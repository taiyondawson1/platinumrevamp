
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

    // Call the repair_missing_customer_records function
    const { data, error } = await supabase.rpc('repair_missing_customer_records');
    
    if (error) {
      console.error("Error repairing customer records:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Fix any customers with staff_key but who are not staff
    // This is the primary fix to ensure enrollment keys are properly stored
    const { error: fixCustomerError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Fix customers that have staff_key incorrectly set
        UPDATE public.customers c
        SET 
          staff_key = NULL,
          updated_at = NOW()
        FROM public.profiles p
        WHERE c.id = p.id
        AND p.role = 'customer'
        AND c.staff_key IS NOT NULL;
        
        -- Ensure enrolled_by is set properly for customers in license_keys table
        UPDATE public.license_keys lk
        SET 
          enrolled_by = COALESCE(lk.enrolled_by, lk.staff_key),
          staff_key = NULL,
          created_at = COALESCE(lk.created_at, NOW())
        FROM public.profiles p
        WHERE lk.user_id = p.id
        AND p.role = 'customer'
        AND lk.staff_key IS NOT NULL;
        
        -- Ensure enrolled_by is set properly in customer_accounts table
        UPDATE public.customer_accounts ca
        SET 
          enrolled_by = COALESCE(ca.enrolled_by, lk.enrolled_by, lk.staff_key),
          updated_at = NOW()
        FROM public.license_keys lk
        JOIN public.profiles p ON lk.user_id = p.id
        WHERE ca.user_id = lk.user_id
        AND p.role = 'customer'
        AND ca.enrolled_by IS NULL
        AND (lk.enrolled_by IS NOT NULL OR lk.staff_key IS NOT NULL);
        
        -- Make sure staff profiles have correct staff_key values
        UPDATE public.profiles p
        SET 
          staff_key = lk.staff_key,
          updated_at = NOW()
        FROM public.license_keys lk
        WHERE p.id = lk.user_id
        AND (p.role = 'ceo' OR p.role = 'admin' OR p.role = 'enroller')
        AND p.staff_key IS NULL
        AND lk.staff_key IS NOT NULL;
      `
    });

    if (fixCustomerError) {
      console.error("Error fixing customer records:", fixCustomerError);
      // Non-fatal error, continue with response
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Customer records repair completed successfully"
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
