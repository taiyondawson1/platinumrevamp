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

    // 1. First, check if the trigger for handle_new_user exists
    const { data: triggerData, error: triggerError } = await supabase.rpc(
      'execute_admin_query',
      { 
        query_text: `
          SELECT trigger_name 
          FROM information_schema.triggers 
          WHERE event_object_table = 'users' 
          AND trigger_name = 'on_auth_user_created'
        `
      }
    );

    if (triggerError) {
      console.error("Error checking trigger:", triggerError);
      return new Response(
        JSON.stringify({ success: false, error: triggerError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // 2. If the trigger doesn't exist, recreate it
    if (!triggerData || triggerData.length === 0) {
      console.log("Recreating handle_new_user trigger...");
      
      const { error: createTriggerError } = await supabase.rpc(
        'execute_admin_query',
        { 
          query_text: `
            CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
          `
        }
      );

      if (createTriggerError) {
        console.error("Error recreating trigger:", createTriggerError);
        return new Response(
          JSON.stringify({ success: false, error: createTriggerError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    // 3. Check if the license key trigger exists
    const { data: licenseKeyTriggerData, error: licenseKeyTriggerError } = await supabase.rpc(
      'execute_admin_query',
      { 
        query_text: `
          SELECT trigger_name 
          FROM information_schema.triggers 
          WHERE event_object_table = 'users' 
          AND trigger_name = 'on_auth_user_created_license_key'
        `
      }
    );

    if (licenseKeyTriggerError) {
      console.error("Error checking license key trigger:", licenseKeyTriggerError);
    }

    // 4. If the license key trigger doesn't exist, recreate it
    if (!licenseKeyTriggerData || licenseKeyTriggerData.length === 0) {
      console.log("Recreating create_customer_license trigger...");
      
      const { error: createLicenseTriggerError } = await supabase.rpc(
        'execute_admin_query',
        { 
          query_text: `
            CREATE TRIGGER on_auth_user_created_license_key
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.create_customer_license()
          `
        }
      );

      if (createLicenseTriggerError) {
        console.error("Error recreating license key trigger:", createLicenseTriggerError);
      }
    }

    // 5. Check for and fix the customer_accounts sync trigger
    const { data: syncTriggerData, error: syncTriggerError } = await supabase.rpc(
      'execute_admin_query',
      { 
        query_text: `
          SELECT trigger_name 
          FROM information_schema.triggers 
          WHERE event_object_table = 'license_keys' 
          AND trigger_name = 'sync_license_key_to_customer_accounts_trigger'
        `
      }
    );

    if (syncTriggerError) {
      console.error("Error checking sync trigger:", syncTriggerError);
    }

    // 6. If the sync trigger doesn't exist, recreate it
    if (!syncTriggerData || syncTriggerData.length === 0) {
      console.log("Recreating sync_license_key_to_customer_accounts trigger...");
      
      const { error: createSyncTriggerError } = await supabase.rpc(
        'execute_admin_query',
        { 
          query_text: `
            CREATE TRIGGER sync_license_key_to_customer_accounts_trigger
            AFTER INSERT OR UPDATE ON public.license_keys
            FOR EACH ROW EXECUTE FUNCTION public.sync_license_key_to_customer_accounts()
          `
        }
      );

      if (createSyncTriggerError) {
        console.error("Error recreating sync trigger:", createSyncTriggerError);
      }
    }

    // 7. Repair any missing customer records
    const { error: repairError } = await supabase.rpc('repair_missing_customer_records');
    
    if (repairError) {
      console.error("Error repairing customer records:", repairError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Database triggers and customer records successfully repaired" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in fix-handle-new-user:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
