
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
    const { userEmail } = await req.json();
    
    if (!userEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing userEmail" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Fixing enrollment data for user ${userEmail}`);

    // Get Supabase client with admin privileges
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the user by email
    const { data: authUsers, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .limit(1);

    if (userError || !authUsers || authUsers.length === 0) {
      console.error("Error finding user by email:", userError);
      // Try an alternative approach
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error listing users:", authError);
        return new Response(
          JSON.stringify({ success: false, error: "Could not find user" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
      
      const user = users.find(u => u.email === userEmail);
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, error: "User not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
      
      // Update the profile 
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          enrolled_by: null,
          enroller: null,
          staff_key: null,  // Ensure staff_key is NULL for customers
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to update profile" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // Update the license_keys record
      const { error: licenseError } = await supabase
        .from('license_keys')
        .update({ 
          enrolled_by: null,
          enroller: null,
          staff_key: null  // Ensure staff_key is NULL for customers
        })
        .eq('user_id', user.id);

      if (licenseError) {
        console.error("Error updating license_keys:", licenseError);
        // Non-fatal error, continue
      }

      // Update the customer_accounts record
      const { error: customerAccountsError } = await supabase
        .from('customer_accounts')
        .update({ 
          enrolled_by: null 
        })
        .eq('user_id', user.id);

      if (customerAccountsError) {
        console.error("Error updating customer_accounts:", customerAccountsError);
        // Non-fatal error, continue
      }

      // Update the customers table
      const { error: customersError } = await supabase
        .from('customers')
        .update({ 
          staff_key: null,  // Ensure staff_key is NULL for customers
          enroller: null
        })
        .eq('id', user.id);

      if (customersError) {
        console.error("Error updating customers:", customersError);
        // Non-fatal error, continue
      }

      return new Response(
        JSON.stringify({ success: true, message: "Enrollment data fixed successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const userId = authUsers[0].id;

    // Update the profile with enrollment data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        enrolled_by: null,
        enroller: null,
        staff_key: null,  // Ensure staff_key is NULL for customers
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update profile" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Update the license_keys record
    const { error: licenseError } = await supabase
      .from('license_keys')
      .update({ 
        enrolled_by: null,
        enroller: null,
        staff_key: null  // Ensure staff_key is NULL for customers
      })
      .eq('user_id', userId);

    if (licenseError) {
      console.error("Error updating license_keys:", licenseError);
      // Non-fatal error, continue
    }

    // Update the customer_accounts record
    const { error: customerAccountsError } = await supabase
      .from('customer_accounts')
      .update({ 
        enrolled_by: null 
      })
      .eq('user_id', userId);

    if (customerAccountsError) {
      console.error("Error updating customer_accounts:", customerAccountsError);
      // Non-fatal error, continue
    }

    // Update the customers table
    const { error: customersError } = await supabase
      .from('customers')
      .update({ 
        staff_key: null,  // Ensure staff_key is NULL for customers
        enroller: null
      })
      .eq('id', userId);

    if (customersError) {
      console.error("Error updating customers:", customersError);
      // Non-fatal error, continue
    }

    return new Response(
      JSON.stringify({ success: true, message: "Enrollment data fixed successfully" }),
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
