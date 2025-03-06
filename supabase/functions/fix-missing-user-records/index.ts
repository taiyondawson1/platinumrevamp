
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

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

    console.log("Starting fix-missing-user-records function...");

    // First, fix the database schema to ensure all required columns exist
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
          
          -- Add 'enroller' column to profiles if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'enroller'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN enroller text;
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
          
          -- Add 'enrolled_by' column to profiles if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'enrolled_by'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN enrolled_by text;
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
          
          -- Add 'referred_by' column to profiles for future use
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'referred_by'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN referred_by text;
          END IF;
          
          -- Add 'referred_by' column to license_keys for future use
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'license_keys' 
            AND column_name = 'referred_by'
          ) THEN
            ALTER TABLE public.license_keys ADD COLUMN referred_by text;
          END IF;
          
          -- Add 'referred_by' column to customer_accounts for future use
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
      console.error("Error updating schema:", schemaError);
      return new Response(
        JSON.stringify({ success: false, error: "Schema update failed: " + schemaError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Now let's fix the specific account (taiyonswipe@gmail.com)
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', 'taiyonswipe@gmail.com')
      .maybeSingle();

    const targetUserId = userData?.id || '47c482b9-131f-4502-8f14-7ea111795a1e';
    const targetEmail = userData?.email || 'taiyonswipe@gmail.com';

    console.log(`Fixing account for user ID: ${targetUserId}, email: ${targetEmail}`);

    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .maybeSingle();

    if (profileError) {
      console.error("Error checking profile:", profileError);
    }

    // Create profile if it doesn't exist
    if (!profileData) {
      console.log("Profile doesn't exist, creating...");
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: targetUserId,
          role: 'customer',
        });

      if (createProfileError) {
        console.error("Error creating profile:", createProfileError);
      } else {
        console.log("Profile created successfully");
      }
    } else {
      console.log("Profile already exists");
    }

    // Check if license key exists
    const { data: licenseData, error: licenseError } = await supabase
      .from('license_keys')
      .select('*')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (licenseError) {
      console.error("Error checking license key:", licenseError);
    }

    // Create license key if it doesn't exist
    if (!licenseData) {
      console.log("License key doesn't exist, creating...");

      // Generate a random license key
      const prefixes = ["ALPHA", "BETA", "DELTA", "GAMMA", "SIGMA"];
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const licenseKey = `${randomPrefix}-${randomSuffix}`;

      const { error: createLicenseError } = await supabase
        .from('license_keys')
        .insert({
          user_id: targetUserId,
          license_key: licenseKey,
          account_numbers: [],
          status: 'active',
          subscription_type: 'standard',
          name: targetEmail.split('@')[0],
          email: targetEmail,
          phone: '',
          product_code: 'EA-001',
          enrolled_by: null,
          enroller: null
        });

      if (createLicenseError) {
        console.error("Error creating license key:", createLicenseError);
      } else {
        console.log("License key created successfully");
      }
    } else {
      console.log("License key already exists");
    }

    // Check if customer account exists
    const { data: customerAccountData, error: customerAccountError } = await supabase
      .from('customer_accounts')
      .select('*')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (customerAccountError) {
      console.error("Error checking customer account:", customerAccountError);
    }

    // Create customer account if it doesn't exist
    if (!customerAccountData) {
      console.log("Customer account doesn't exist, creating...");
      
      // Get the license key if we didn't just create it
      let licenseKey = licenseData?.license_key;
      
      if (!licenseKey) {
        const { data: newLicenseData } = await supabase
          .from('license_keys')
          .select('license_key')
          .eq('user_id', targetUserId)
          .maybeSingle();
          
        licenseKey = newLicenseData?.license_key;
      }

      const { error: createCustomerAccountError } = await supabase
        .from('customer_accounts')
        .insert({
          user_id: targetUserId,
          name: targetEmail.split('@')[0],
          email: targetEmail,
          phone: '',
          status: 'active',
          license_key: licenseKey
        });

      if (createCustomerAccountError) {
        console.error("Error creating customer account:", createCustomerAccountError);
      } else {
        console.log("Customer account created successfully");
      }
    } else {
      console.log("Customer account already exists");
    }

    // Check if customer record exists
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', targetUserId)
      .maybeSingle();

    if (customerError) {
      console.error("Error checking customer record:", customerError);
    }

    // Create customer record if it doesn't exist
    if (!customerData) {
      console.log("Customer record doesn't exist, creating...");
      const { error: createCustomerError } = await supabase
        .from('customers')
        .insert({
          id: targetUserId,
          name: targetEmail.split('@')[0],
          email: targetEmail,
          phone: '',
          status: 'Active',
          sales_rep_id: '00000000-0000-0000-0000-000000000000',
          revenue: '$0'
        });

      if (createCustomerError) {
        console.error("Error creating customer record:", createCustomerError);
      } else {
        console.log("Customer record created successfully");
      }
    } else {
      console.log("Customer record already exists");
    }

    // Now run a more general fix for any other accounts with missing records
    const { error: fixError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Find all auth users without complete records
        DO $$
        DECLARE
          user_record RECORD;
          license_key_var TEXT;
        BEGIN
          FOR user_record IN 
            SELECT au.id, au.email
            FROM auth.users au
            LEFT JOIN public.profiles p ON au.id = p.id
            LEFT JOIN public.license_keys lk ON au.id = lk.user_id
            LEFT JOIN public.customer_accounts ca ON au.id = ca.user_id
            LEFT JOIN public.customers c ON au.id = c.id
            WHERE p.id IS NULL OR lk.user_id IS NULL OR ca.user_id IS NULL OR c.id IS NULL
          LOOP
            -- Ensure profile exists
            IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_record.id) THEN
              INSERT INTO public.profiles (id, role)
              VALUES (user_record.id, 'customer');
            END IF;
            
            -- Ensure license key exists
            IF NOT EXISTS (SELECT 1 FROM public.license_keys WHERE user_id = user_record.id) THEN
              -- Generate a random license key
              SELECT 'FIXED-' || substr(md5(random()::text), 1, 20) INTO license_key_var;
              
              INSERT INTO public.license_keys (
                user_id, 
                license_key, 
                account_numbers, 
                status, 
                subscription_type,
                name, 
                email, 
                phone, 
                product_code
              )
              VALUES (
                user_record.id,
                license_key_var,
                '{}',
                'active',
                'standard',
                split_part(user_record.email, '@', 1),
                user_record.email,
                '',
                'EA-001'
              );
            ELSE
              -- Get existing license key
              SELECT license_key INTO license_key_var
              FROM public.license_keys
              WHERE user_id = user_record.id;
            END IF;
            
            -- Ensure customer account exists
            IF NOT EXISTS (SELECT 1 FROM public.customer_accounts WHERE user_id = user_record.id) THEN
              INSERT INTO public.customer_accounts (
                user_id,
                name,
                email,
                phone,
                status,
                license_key
              )
              VALUES (
                user_record.id,
                split_part(user_record.email, '@', 1),
                user_record.email,
                '',
                'active',
                license_key_var
              );
            END IF;
            
            -- Ensure customer record exists
            IF NOT EXISTS (SELECT 1 FROM public.customers WHERE id = user_record.id) THEN
              INSERT INTO public.customers (
                id,
                name,
                email,
                phone,
                status,
                sales_rep_id,
                revenue
              )
              VALUES (
                user_record.id,
                split_part(user_record.email, '@', 1),
                user_record.email,
                '',
                'Active',
                '00000000-0000-0000-0000-000000000000',
                '$0'
              );
            END IF;
          END LOOP;
        END$$;
      `
    });

    if (fixError) {
      console.error("Error fixing other accounts:", fixError);
      // Continue execution - this is non-fatal
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User record repair completed successfully",
        details: {
          user_id: targetUserId,
          email: targetEmail,
          profile_exists: !!profileData,
          license_exists: !!licenseData,
          customer_account_exists: !!customerAccountData,
          customer_exists: !!customerData
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in fix-missing-user-records:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
