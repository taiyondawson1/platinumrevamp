
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with admin privileges
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting migration to referral code system...");

    // Update profiles table to add referral code and referred_by fields
    const { error: alterProfilesError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Add referral_code and referred_by to profiles table
        ALTER TABLE public.profiles 
        ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
        ADD COLUMN IF NOT EXISTS referred_by TEXT;
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles (referral_code);
      `
    });

    if (alterProfilesError) {
      console.error("Error altering profiles table:", alterProfilesError);
      return new Response(
        JSON.stringify({ success: false, error: alterProfilesError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Create function to generate unique 4-digit referral codes
    const { error: createFunctionError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Create function to generate unique 4-digit referral codes
        CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
        RETURNS text
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
            new_code TEXT;
            code_exists BOOLEAN;
            max_attempts INTEGER := 100;
            current_attempt INTEGER := 0;
        BEGIN
            LOOP
                -- Generate a random 4-digit number as string
                new_code := LPAD(FLOOR(random() * 10000)::integer::text, 4, '0');
                
                -- Check if this code already exists
                SELECT EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE referral_code = new_code
                ) INTO code_exists;
                
                -- Exit if we found a unique code or reached max attempts
                EXIT WHEN (NOT code_exists) OR (current_attempt >= max_attempts);
                
                current_attempt := current_attempt + 1;
            END LOOP;
            
            -- If we couldn't find a unique code after max attempts, add a random suffix
            IF code_exists THEN
                new_code := new_code || SUBSTRING(MD5(random()::text) FROM 1 FOR 2);
            END IF;
            
            RETURN new_code;
        END;
        $$;
      `
    });

    if (createFunctionError) {
      console.error("Error creating generate_unique_referral_code function:", createFunctionError);
      return new Response(
        JSON.stringify({ success: false, error: createFunctionError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Update handle_new_user function for new referral system
    const { error: updateTriggerError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- First, drop the existing triggers to avoid conflicts
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP TRIGGER IF EXISTS on_auth_user_created_license_key ON auth.users;

        -- Update handle_new_user function to use referral codes
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          role_text text;
          valid_role public.user_role;
          new_referral_code TEXT;
          referred_by_code TEXT;
        BEGIN
          -- Get user's role
          role_text := COALESCE(new.raw_user_meta_data->>'role', 'customer');
          
          -- Validate role
          CASE role_text
            WHEN 'ceo' THEN valid_role := 'ceo'::public.user_role;
            WHEN 'admin' THEN valid_role := 'admin'::public.user_role;
            WHEN 'enroller' THEN valid_role := 'enroller'::public.user_role;
            ELSE valid_role := 'customer'::public.user_role;
          END CASE;
          
          -- Generate a unique referral code for this user
          new_referral_code := public.generate_unique_referral_code();
          
          -- Get referral code used during registration if any
          referred_by_code := new.raw_user_meta_data->>'referred_by';
          
          -- Create the profile with new referral system
          INSERT INTO public.profiles (
            id, 
            role,
            referral_code,
            referred_by,
            -- Keep existing fields for backward compatibility during migration
            staff_key,
            enrolled_by,
            enroller
          )
          VALUES (
            new.id, 
            valid_role, 
            new_referral_code,
            referred_by_code,
            -- Map old fields to maintain backward compatibility
            CASE WHEN (valid_role = 'ceo' OR valid_role = 'admin' OR valid_role = 'enroller') 
                 THEN new.raw_user_meta_data->>'staff_key' ELSE NULL END,
            referred_by_code,
            referred_by_code
          )
          ON CONFLICT (id) DO UPDATE SET
            role = EXCLUDED.role,
            referral_code = EXCLUDED.referral_code,
            referred_by = EXCLUDED.referred_by,
            staff_key = EXCLUDED.staff_key,
            enrolled_by = EXCLUDED.enrolled_by,
            enroller = EXCLUDED.enroller,
            updated_at = NOW();
          
          RETURN NEW;
        EXCEPTION
          WHEN others THEN
            RAISE NOTICE 'Error creating profile: %', SQLERRM;
            RETURN NEW;
        END;
        $$;

        -- Update create_customer_license function for new referral system
        CREATE OR REPLACE FUNCTION public.create_customer_license()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          new_license_key TEXT;
          referred_by_code TEXT;
          role_text TEXT;
          retry_count INTEGER := 0;
          max_retries INTEGER := 3;
          is_staff BOOLEAN;
          referrer_id UUID;
        BEGIN
          -- Get user's role and referral code
          role_text := COALESCE(new.raw_user_meta_data->>'role', 'customer');
          referred_by_code := new.raw_user_meta_data->>'referred_by';
          
          -- Determine if this is a staff member
          is_staff := (role_text = 'ceo' OR role_text = 'admin' OR role_text = 'enroller');
          
          -- Find the referrer's ID if a referral code was used
          IF referred_by_code IS NOT NULL AND referred_by_code != '' THEN
            SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = referred_by_code LIMIT 1;
          END IF;
          
          -- Generate a unique license key
          LOOP
            new_license_key := public.generate_random_license_key();
            EXIT WHEN NOT EXISTS (
              SELECT 1 FROM public.license_keys WHERE license_key = new_license_key
            ) OR retry_count >= max_retries;
            retry_count := retry_count + 1;
          END LOOP;

          -- Insert the license key with referral information
          INSERT INTO public.license_keys (
            user_id,
            license_key,
            account_numbers,
            status,
            subscription_type,
            name,
            email,
            phone,
            product_code,
            -- Keep old fields for backward compatibility
            enrolled_by,
            enroller,
            staff_key
          ) VALUES (
            NEW.id,
            new_license_key,
            '{}',
            'active',
            'standard',
            COALESCE(new.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.email,
            '',
            'EA-001',
            referred_by_code,
            referred_by_code,
            CASE WHEN is_staff THEN new.raw_user_meta_data->>'staff_key' ELSE NULL END
          )
          ON CONFLICT (user_id) DO NOTHING;
              
          -- Also insert into customer_accounts table
          INSERT INTO public.customer_accounts (
            user_id,
            name,
            email,
            phone,
            status,
            enrolled_by,
            license_key
          ) VALUES (
            NEW.id,
            COALESCE(new.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.email,
            '',
            'active',
            referred_by_code,
            new_license_key
          )
          ON CONFLICT (user_id) DO NOTHING;
          
          -- Also create customer record
          INSERT INTO public.customers (
            id,
            name,
            email,
            phone,
            status,
            sales_rep_id,
            staff_key,
            enroller,
            revenue
          ) VALUES (
            NEW.id,
            COALESCE(new.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.email,
            '',
            'Active',
            COALESCE(referrer_id, '00000000-0000-0000-0000-000000000000'::uuid),
            CASE WHEN is_staff THEN new.raw_user_meta_data->>'staff_key' ELSE NULL END,
            referred_by_code,
            '$0'
          )
          ON CONFLICT (id) DO NOTHING;
          
          RETURN NEW;
        EXCEPTION
          WHEN others THEN
            RAISE NOTICE 'Error creating license key and customer account: %', SQLERRM;
            RETURN NEW;
        END;
        $$;

        -- Recreate both triggers
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            
        CREATE TRIGGER on_auth_user_created_license_key
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.create_customer_license();
      `
    });

    if (updateTriggerError) {
      console.error("Error updating database triggers:", updateTriggerError);
      return new Response(
        JSON.stringify({ success: false, error: updateTriggerError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Generate referral codes for existing users
    const { error: migrateExistingError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Generate referral codes for existing users who don't have one
        UPDATE public.profiles
        SET referral_code = public.generate_unique_referral_code()
        WHERE referral_code IS NULL;
        
        -- Map enrollment relationships to referral relationships
        UPDATE public.profiles p
        SET referred_by = (
          SELECT referral_code 
          FROM public.profiles p2 
          WHERE p2.id IN (
            SELECT user_id 
            FROM public.staff_keys 
            WHERE key = p.enrolled_by OR key = p.enroller
            LIMIT 1
          )
          LIMIT 1
        )
        WHERE referred_by IS NULL AND (enrolled_by IS NOT NULL OR enroller IS NOT NULL);
      `
    });

    if (migrateExistingError) {
      console.error("Error migrating existing users:", migrateExistingError);
      // Non-fatal, proceed with response
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully migrated to referral code system. All users now have unique referral codes."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in migrate-to-referral-codes:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
