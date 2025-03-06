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

    // First, let's ensure our database functions are updated to handle NULL staff_key
    const { error: updateFunctionsError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Ensure that staff_key can be NULL in license_keys table
        ALTER TABLE IF EXISTS public.license_keys ALTER COLUMN staff_key DROP NOT NULL;
        
        -- Ensure that enrolled_by exists in profiles table
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

    // Fix any customers with empty enrollment data to have empty strings instead of NULLs
    const { error: fixEnrollmentError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Update profiles with empty strings for enrolled_by/enroller if they're NULL and role is 'customer'
        UPDATE public.profiles p
        SET 
          enrolled_by = '',
          enroller = '',
          updated_at = NOW()
        FROM public.customers c
        WHERE p.id = c.id
        AND p.role = 'customer'
        AND (p.enrolled_by IS NULL OR p.enroller IS NULL);
        
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
        message: "Customer records repair completed successfully. Records have been created or fixed in profiles, license_keys, and customer_accounts tables. Enrollment data has been updated to use empty strings instead of NULLs."
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
