
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

    console.log("Starting fix-enrollment-data function...");

    // Parse request body
    const requestData = await req.json();
    const { userEmail, enrollmentKey } = requestData;

    if (!userEmail || !enrollmentKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: userEmail and enrollmentKey" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Fixing enrollment data for user ${userEmail} with key ${enrollmentKey}`);

    // First, verify the enrollment key exists and is valid
    const { data: staffKeyData, error: staffKeyError } = await supabase
      .from('staff_keys')
      .select('key, role, status')
      .eq('key', enrollmentKey)
      .maybeSingle();

    if (staffKeyError || !staffKeyData) {
      console.error("Error verifying staff key:", staffKeyError);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid enrollment key" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (staffKeyData.status !== 'active') {
      return new Response(
        JSON.stringify({ success: false, error: "Enrollment key is not active" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get user ID from email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', (await supabase.auth.admin.getUserByEmail(userEmail)).data.user?.id)
      .maybeSingle();

    if (userError || !userData) {
      console.error("Error finding user:", userError);
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    console.log("Found user:", userData);

    // Update the profiles table with enrolled_by and enroller
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ 
        enrolled_by: enrollmentKey, 
        enroller: enrollmentKey,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userData.id);

    if (profileUpdateError) {
      console.error("Error updating profile:", profileUpdateError);
    } else {
      console.log("Successfully updated profile with enrollment key");
    }

    // Update the license_keys table with enrolled_by and enroller
    const { error: licenseUpdateError } = await supabase
      .from('license_keys')
      .update({ 
        enrolled_by: enrollmentKey,
        enroller: enrollmentKey,
        staff_key: userData.role === 'customer' ? null : enrollmentKey 
      })
      .eq('user_id', userData.id);

    if (licenseUpdateError) {
      console.error("Error updating license key:", licenseUpdateError);
    } else {
      console.log("Successfully updated license key with enrollment key");
    }

    // Update the customer_accounts table with enrolled_by and enroller
    const { error: accountUpdateError } = await supabase
      .from('customer_accounts')
      .update({ 
        enrolled_by: enrollmentKey,
        enroller: enrollmentKey 
      })
      .eq('user_id', userData.id);

    if (accountUpdateError) {
      console.error("Error updating customer account:", accountUpdateError);
    } else {
      console.log("Successfully updated customer account with enrollment key");
    }

    // Update the customers table with enroller - clear staff_key for customers, set it for staff
    const { error: customerUpdateError } = await supabase
      .from('customers')
      .update({ 
        staff_key: userData.role === 'customer' ? null : enrollmentKey,
        enroller: userData.role === 'customer' ? enrollmentKey : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id);

    if (customerUpdateError) {
      console.error("Error updating customer record:", customerUpdateError);
    } else {
      console.log("Successfully updated customer record");
    }

    // Run the repair function to ensure all records are consistent
    const { error: repairError } = await supabase.functions.invoke('repair-customer-records');

    if (repairError) {
      console.error("Error running repair function:", repairError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully fixed enrollment data across all tables" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in fix-enrollment-data:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
