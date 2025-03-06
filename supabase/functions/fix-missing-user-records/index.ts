
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the service role key (has admin rights)
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
    
    // Parse the request body to get userId and userEmail
    const { userId, userEmail, fixSchema = false, fixTriggers = false } = await req.json();
    
    console.log(`Starting fix-missing-user-records function for ${userId || userEmail || 'all users'}`);
    
    // STEP 1: Fix database schema if requested
    if (fixSchema) {
      console.log("Fixing database schema...");
      
      const { error: schemaError } = await supabase.rpc('execute_admin_query', {
        query_text: `
          -- Add the 'enroller' column to license_keys table if it doesn't exist
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'license_keys' 
              AND column_name = 'enroller'
            ) THEN
              ALTER TABLE public.license_keys ADD COLUMN enroller text;
            END IF;
            
            -- Add 'enrolled_by' column to license_keys if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'license_keys' 
              AND column_name = 'enrolled_by'
            ) THEN
              ALTER TABLE public.license_keys ADD COLUMN enrolled_by text;
            END IF;
            
            -- Add 'enrolled_by' column to profiles if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'profiles' 
              AND column_name = 'enrolled_by'
            ) THEN
              ALTER TABLE public.profiles ADD COLUMN enrolled_by text;
            END IF;
            
            -- Add 'enroller' column to profiles if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'profiles' 
              AND column_name = 'enroller'
            ) THEN
              ALTER TABLE public.profiles ADD COLUMN enroller text;
            END IF;
            
            -- Add 'enrolled_by' column to customer_accounts if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'customer_accounts' 
              AND column_name = 'enrolled_by'
            ) THEN
              ALTER TABLE public.customer_accounts ADD COLUMN enrolled_by text;
            END IF;
            
            -- Add 'enroller' column to customers if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'customers' 
              AND column_name = 'enroller'
            ) THEN
              ALTER TABLE public.customers ADD COLUMN enroller text;
            END IF;
            
            -- Add 'referred_by' column to all key tables for future use
            -- profiles
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'profiles' 
              AND column_name = 'referred_by'
            ) THEN
              ALTER TABLE public.profiles ADD COLUMN referred_by text;
            END IF;
            
            -- license_keys
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'license_keys' 
              AND column_name = 'referred_by'
            ) THEN
              ALTER TABLE public.license_keys ADD COLUMN referred_by text;
            END IF;
            
            -- customer_accounts
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'customer_accounts' 
              AND column_name = 'referred_by'
            ) THEN
              ALTER TABLE public.customer_accounts ADD COLUMN referred_by text;
            END IF;
          END$$;
        `
      });
      
      if (schemaError) {
        console.error("Error fixing schema:", schemaError);
      } else {
        console.log("Schema fixed successfully");
      }
    }
    
    // STEP 2: Fix database triggers if requested
    if (fixTriggers) {
      console.log("Fixing database triggers...");
      
      const { error: triggerError } = await supabase.rpc('execute_admin_query', {
        query_text: `
          -- First, drop the existing triggers if they exist to avoid conflicts
          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          DROP TRIGGER IF EXISTS on_auth_user_created_license_key ON auth.users;

          -- Update handle_new_user function to properly handle staff_key for staff vs customers
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            valid_role public.user_role;
            role_text text;
            staff_key_value text;
            is_staff boolean;
          BEGIN
            -- First, safely extract and validate the role
            role_text := COALESCE(new.raw_user_meta_data->>'role', 'customer');
            
            -- Validate the role and convert to enum
            CASE role_text
              WHEN 'ceo' THEN valid_role := 'ceo'::public.user_role;
              WHEN 'admin' THEN valid_role := 'admin'::public.user_role;
              WHEN 'enroller' THEN valid_role := 'enroller'::public.user_role;
              ELSE valid_role := 'customer'::public.user_role;
            END CASE;
            
            -- Determine if this is a staff member (non-customer)
            is_staff := (valid_role = 'ceo' OR valid_role = 'admin' OR valid_role = 'enroller');
            
            -- Set staff_key based on role - only for staff members
            IF is_staff THEN
              -- Staff members get their staff_key stored
              staff_key_value := new.raw_user_meta_data->>'staff_key';
            ELSE
              -- Customers should never have a staff_key (they have enrolled_by instead)
              staff_key_value := NULL;
            END IF;
            
            -- Log for debugging
            RAISE NOTICE 'Creating profile for user % with role % and staff_key %', new.id, valid_role, staff_key_value;
            
            -- Create the profile with the validated role and appropriate staff_key
            INSERT INTO public.profiles (id, role, staff_key)
            VALUES (new.id, valid_role, staff_key_value)
            ON CONFLICT (id) DO UPDATE SET
              role = EXCLUDED.role,
              staff_key = EXCLUDED.staff_key,
              updated_at = NOW();
            
            RETURN NEW;
          EXCEPTION
            WHEN others THEN
              RAISE NOTICE 'Error creating profile: %', SQLERRM;
              RETURN NEW;
          END;
          $$;

          -- Update the create_customer_license function to handle staff_key properly
          CREATE OR REPLACE FUNCTION public.create_customer_license()
          RETURNS trigger
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            new_license_key TEXT;
            enrolled_by_key TEXT := new.raw_user_meta_data->>'enrolled_by';
            role_text TEXT := COALESCE(new.raw_user_meta_data->>'role', 'customer');
            retry_count INTEGER := 0;
            max_retries INTEGER := 3;
            customer_name TEXT;
            is_staff BOOLEAN;
          BEGIN
            -- Log for debugging
            RAISE NOTICE 'Creating license key for user % with role % and enrolled_by %', new.id, role_text, enrolled_by_key;
            
            -- Determine if this is a staff member or customer
            is_staff := (role_text = 'ceo' OR role_text = 'admin' OR role_text = 'enroller');
            
            -- Use email or meta data for customer name 
            customer_name := COALESCE(new.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
            
            -- Generate a new unique license key
            LOOP
              new_license_key := public.generate_random_license_key();
              
              -- Exit when we find a unique key or hit max retries
              EXIT WHEN NOT EXISTS (
                  SELECT 1 FROM public.license_keys 
                  WHERE license_key = new_license_key
              ) OR retry_count >= max_retries;
              
              retry_count := retry_count + 1;
            END LOOP;

            -- Insert the license key with proper field assignments
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
                enrolled_by,    -- Only set for customers 
                staff_key,      -- Only set for staff members
                enroller        -- Same as enrolled_by for backward compatibility
            ) VALUES (
                NEW.id,
                new_license_key,
                '{}',
                'active',
                'standard',
                customer_name,
                NEW.email,
                '',
                'EA-001',
                CASE WHEN NOT is_staff THEN enrolled_by_key ELSE NULL END,  -- Customers: enrolled_by = key used
                CASE WHEN is_staff THEN new.raw_user_meta_data->>'staff_key' ELSE NULL END,  -- Staff: staff_key = their own key
                CASE WHEN NOT is_staff THEN enrolled_by_key ELSE NULL END   -- enroller = enrolled_by for compatibility
            )
            ON CONFLICT (user_id) DO NOTHING;
                
            -- Also insert into customer_accounts table with proper fields
            INSERT INTO public.customer_accounts (
                user_id,
                name,
                email,
                phone,
                status,
                enrolled_by,    -- Only set for customers
                license_key
            ) VALUES (
                NEW.id,
                customer_name,
                NEW.email,
                '',
                'active',
                CASE WHEN NOT is_staff THEN enrolled_by_key ELSE NULL END,
                new_license_key
            )
            ON CONFLICT (user_id) DO NOTHING;
            
            -- Also create customer record if it doesn't exist
            INSERT INTO public.customers (
                id,
                name,
                email,
                phone,
                status,
                sales_rep_id,
                staff_key,
                revenue,
                enroller      -- Add enroller field for customers
            ) VALUES (
                NEW.id,
                customer_name,
                NEW.email,
                '',
                'Active',
                '00000000-0000-0000-0000-000000000000'::uuid,
                CASE WHEN is_staff THEN new.raw_user_meta_data->>'staff_key' ELSE NULL END,
                '$0',
                CASE WHEN NOT is_staff THEN enrolled_by_key ELSE NULL END  -- Only set for customers
            )
            ON CONFLICT (id) DO NOTHING;
            
            RETURN NEW;
          EXCEPTION
            WHEN others THEN
              -- Log error but don't fail the entire transaction
              RAISE NOTICE 'Error creating license key and customer account: %', SQLERRM;
              RETURN NEW;
          END;
          $$;

          -- Recreate both triggers to ensure both functions get called
          CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
              
          CREATE TRIGGER on_auth_user_created_license_key
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.create_customer_license();
        `
      });
      
      if (triggerError) {
        console.error("Error fixing triggers:", triggerError);
      } else {
        console.log("Triggers fixed successfully");
      }
    }
    
    // STEP 3: Fix missing user records
    let userResult;
    
    // Find the user if userId or userEmail was provided
    if (userId || userEmail) {
      if (userId) {
        userResult = await supabase.auth.admin.getUserById(userId);
      } else if (userEmail) {
        const { data: userList, error: userListError } = await supabase
          .from('auth.users')
          .select('id, email')
          .eq('email', userEmail)
          .maybeSingle();
          
        if (userListError) {
          console.error("Error finding user by email:", userListError);
          
          // Fallback to profiles table
          const { data: profileUser, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userEmail)
            .maybeSingle();
            
          if (profileError || !profileUser) {
            return new Response(
              JSON.stringify({ error: 'User not found with email: ' + userEmail }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            );
          }
          
          userResult = { data: { user: { id: profileUser.id, email: userEmail } } };
        } else if (userList) {
          userResult = { data: { user: userList } };
        } else {
          return new Response(
            JSON.stringify({ error: 'User not found with email: ' + userEmail }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          );
        }
      }
      
      if (!userResult || !userResult.data.user) {
        return new Response(
          JSON.stringify({ error: 'User not found with id: ' + userId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      const user = userResult.data.user;
      
      // Check if user has the required records
      const [profileCheck, licenseCheck, customerCheck] = await Promise.all([
        supabase.from('profiles').select('id').eq('id', user.id).maybeSingle(),
        supabase.from('license_keys').select('id').eq('user_id', user.id).maybeSingle(),
        supabase.from('customers').select('id').eq('id', user.id).maybeSingle()
      ]);
      
      // Fix missing profile
      if (!profileCheck.data) {
        console.log(`Creating missing profile for user ${user.id}`);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role: 'customer',
            email: user.email
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      // Fix missing license key
      if (!licenseCheck.data) {
        console.log(`Creating missing license key for user ${user.id}`);
        
        // Generate a random license key
        const licenseKey = Array(5).fill(0).map(() => 
          Math.random().toString(36).substring(2, 7).toUpperCase()
        ).join('-');
        
        const { error: licenseError } = await supabase
          .from('license_keys')
          .insert({
            user_id: user.id,
            license_key: licenseKey,
            account_numbers: [],
            status: 'active',
            subscription_type: 'standard',
            name: user.email.split('@')[0],
            email: user.email,
            phone: '',
            product_code: 'EA-001'
          });
          
        if (licenseError) {
          console.error("Error creating license key:", licenseError);
        }
      }
      
      // Fix missing customer record
      if (!customerCheck.data) {
        console.log(`Creating missing customer record for user ${user.id}`);
        
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: user.id,
            name: user.email.split('@')[0],
            email: user.email,
            phone: '',
            status: 'Active',
            sales_rep_id: '00000000-0000-0000-0000-000000000000',
            revenue: '$0'
          });
          
        if (customerError) {
          console.error("Error creating customer record:", customerError);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Records for user ${user.id} (${user.email}) have been fixed.`,
          userId: user.id,
          email: user.email 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Run the repair function to fix all users
      console.log("Running repair for all users");
      
      const { error: repairError } = await supabase.rpc('repair_missing_customer_records');
      
      if (repairError) {
        console.error("Error running repair function:", repairError);
        return new Response(
          JSON.stringify({ error: 'Failed to repair all user records' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "All user records have been repaired" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.error("Error in fix-missing-user-records:", err);
    
    return new Response(
      JSON.stringify({ error: err.message || "An unknown error occurred" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
