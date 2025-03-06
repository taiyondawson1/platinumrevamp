
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

    console.log("Starting fix-database-schema function...");

    // Add all the missing columns to the license_keys table
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
          
          RAISE NOTICE 'Schema update completed';
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

    // After fixing the schema, run a function to check all users and ensure they have complete records
    const { error: fixError } = await supabase.rpc('repair_missing_customer_records');

    if (fixError) {
      console.error("Error running repair function:", fixError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Repair function error: " + fixError.message,
          note: "Schema was successfully updated but records repair failed"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database schema and user records have been successfully updated."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in fix-database-schema:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
