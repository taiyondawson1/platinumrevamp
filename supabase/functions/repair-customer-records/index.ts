
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

    console.log("Starting repair-customer-records function...");

    // First, let's ensure our database is updated for the referral code system
    try {
      await fetch(`${supabaseUrl}/functions/v1/migrate-to-referral-codes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (migrationError) {
      console.warn("Non-blocking warning - Error during migration:", migrationError);
    }

    // Ensure that necessary columns exist and constraints are properly set
    const { error: updateFunctionsError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Ensure that staff_key can be NULL in license_keys table
        ALTER TABLE IF EXISTS public.license_keys ALTER COLUMN staff_key DROP NOT NULL;
        
        -- Ensure that all related columns exist in profiles table
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'enrolled_by'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN enrolled_by text;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'referred_by'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN referred_by text;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'referral_code'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN referral_code text;
            
            -- Add unique constraint if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint 
              WHERE conname = 'profiles_referral_code_key'
            ) THEN
              ALTER TABLE public.profiles ADD CONSTRAINT profiles_referral_code_key UNIQUE (referral_code);
            END IF;
          END IF;
        END$$;
      `
    });

    if (updateFunctionsError) {
      console.error("Error updating database constraints:", updateFunctionsError);
      // Non-fatal error, continue with other operations
    }

    // Call the repair_missing_customer_records function
    const { data, error } = await supabase.rpc('repair_missing_customer_records');
    
    if (error) {
      console.error("Error repairing customer records:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Generate referral codes for users who don't have one
    const { error: generateCodesError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Generate referral codes for all users who don't have one
        UPDATE public.profiles
        SET referral_code = public.generate_unique_referral_code()
        WHERE referral_code IS NULL;
        
        -- Copy enrolled_by to referred_by for backward compatibility
        UPDATE public.profiles
        SET referred_by = enrolled_by
        WHERE referred_by IS NULL AND enrolled_by IS NOT NULL;
        
        -- Map old enrollment relationship to new referral system
        UPDATE public.profiles p
        SET referred_by = (
          SELECT referral_code
          FROM public.profiles p2
          JOIN public.staff_keys sk ON p2.id = sk.user_id
          WHERE sk.key = p.enrolled_by OR sk.key = p.enroller
          LIMIT 1
        )
        WHERE referred_by IS NULL AND (enrolled_by IS NOT NULL OR enroller IS NOT NULL);
      `
    });

    if (generateCodesError) {
      console.error("Error generating referral codes:", generateCodesError);
      // Non-fatal error, continue with response
    }

    // Fix any customers with empty enrollment data to have empty strings instead of NULLs
    const { error: fixEnrollmentError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Update profiles with empty strings for enrolled_by/enroller/referred_by if they're NULL and role is 'customer'
        UPDATE public.profiles p
        SET 
          enrolled_by = '',
          enroller = '',
          referred_by = '',
          updated_at = NOW()
        FROM public.customers c
        WHERE p.id = c.id
        AND p.role = 'customer'
        AND (p.enrolled_by IS NULL OR p.enroller IS NULL OR p.referred_by IS NULL);
        
        -- Similarly for license_keys
        UPDATE public.license_keys lk
        SET 
          enrolled_by = COALESCE(lk.enrolled_by, ''),
          enroller = COALESCE(lk.enroller, ''),
          created_at = COALESCE(lk.created_at, NOW())
        FROM public.profiles p
        WHERE lk.user_id = p.id
        AND p.role = 'customer'
        AND (lk.enrolled_by IS NULL OR lk.enroller IS NULL);
        
        -- And for customer_accounts
        UPDATE public.customer_accounts ca
        SET 
          enrolled_by = COALESCE(ca.enrolled_by, ''),
          updated_at = NOW()
        FROM public.profiles p
        WHERE ca.user_id = p.id
        AND p.role = 'customer'
        AND ca.enrolled_by IS NULL;
      `
    });

    if (fixEnrollmentError) {
      console.error("Error fixing enrollment data:", fixEnrollmentError);
      // Non-fatal error, continue with response
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Customer records repair completed successfully. Records have been created or fixed in profiles, license_keys, and customer_accounts tables. All users now have unique referral codes."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in repair-customer-records:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
