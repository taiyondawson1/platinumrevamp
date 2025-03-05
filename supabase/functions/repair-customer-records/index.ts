
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
    const { error: fixCustomerError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Fix customers that have staff_key incorrectly set
        UPDATE public.customers c
        SET staff_key = NULL
        FROM public.profiles p
        WHERE c.id = p.id
        AND p.role = 'customer'
        AND c.staff_key IS NOT NULL;
        
        -- Fix license_keys that have staff_key set incorrectly
        UPDATE public.license_keys lk
        SET staff_key = NULL
        FROM public.profiles p
        WHERE lk.user_id = p.id
        AND p.role = 'customer'
        AND lk.staff_key IS NOT NULL;
        
        -- Ensure enrolled_by is set properly for customers
        UPDATE public.license_keys lk
        SET enrolled_by = lk.staff_key
        FROM public.profiles p
        WHERE lk.user_id = p.id
        AND p.role = 'customer'
        AND lk.enrolled_by IS NULL
        AND lk.staff_key IS NOT NULL;
        
        -- Clear staff_key for all customers after copying to enrolled_by
        UPDATE public.license_keys lk
        SET staff_key = NULL
        FROM public.profiles p
        WHERE lk.user_id = p.id
        AND p.role = 'customer';
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
