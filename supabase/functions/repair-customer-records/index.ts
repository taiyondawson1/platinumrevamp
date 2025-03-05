
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

    // Call the repair_missing_customer_records function
    const { data, error } = await supabase.rpc('repair_missing_customer_records');
    
    if (error) {
      console.error("Error repairing customer records:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Check if any license keys are missing for existing users
    const { data: missingData, error: missingError } = await supabase
      .from('auth.users')
      .select('id, email')
      .not('id', 'in', supabase.from('license_keys').select('user_id'));

    if (missingError) {
      console.error("Error checking for missing license keys:", missingError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Customer records repair initiated",
        missing_license_keys: missingData || []
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
