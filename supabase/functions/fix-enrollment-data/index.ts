
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

    // Parse request body
    const { userEmail, referralCode } = await req.json();
    
    if (!userEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "User email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Fixing enrollment data for user: ${userEmail} with referral code: ${referralCode}`);

    // Ensure referral system migration has been executed
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

    // Get the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(userEmail);
    
    if (userError || !userData?.user) {
      console.error("Error finding user:", userError);
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    const userId = userData.user.id;
    
    // If referral code is provided, validate it
    let referrerUserId = null;
    if (referralCode) {
      const { data: referrerData } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle();
        
      if (referrerData) {
        referrerUserId = referrerData.id;
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    }
    
    // Begin transaction to update all tables consistently
    const updates = [];
    
    // Use the new update_user_referral_codes function to update all tables
    const { error: updateError } = await supabase.rpc('update_user_referral_codes', {
      user_id: userId,
      referral_code: referralCode
    });
      
    if (updateError) {
      console.error("Error updating referral codes:", updateError);
      updates.push({ function: 'update_user_referral_codes', success: false, error: updateError.message });
      
      // Fallback to manual updates if the function fails
      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          referred_by: referralCode,
          enrolled_by: referralCode,  // Keep for backward compatibility
          enroller: referralCode      // Keep for backward compatibility
        })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
        updates.push({ table: 'profiles', success: false, error: profileError.message });
      } else {
        updates.push({ table: 'profiles', success: true });
      }
      
      // 2. Update license_keys table
      const { error: licenseError } = await supabase
        .from('license_keys')
        .update({ 
          referred_by: referralCode,
          enrolled_by: referralCode,
          enroller: referralCode
        })
        .eq('user_id', userId);
        
      if (licenseError) {
        console.error("Error updating license_keys:", licenseError);
        updates.push({ table: 'license_keys', success: false, error: licenseError.message });
      } else {
        updates.push({ table: 'license_keys', success: true });
      }
      
      // 3. Update customer_accounts table
      const { error: accountsError } = await supabase
        .from('customer_accounts')
        .update({ 
          referred_by: referralCode,
          enrolled_by: referralCode
        })
        .eq('user_id', userId);
        
      if (accountsError) {
        console.error("Error updating customer_accounts:", accountsError);
        updates.push({ table: 'customer_accounts', success: false, error: accountsError.message });
      } else {
        updates.push({ table: 'customer_accounts', success: true });
      }
      
      // 4. Update customers table
      const updateData: any = { enroller: referralCode };
      
      // Set sales_rep_id if we have the referrer's user ID
      if (referrerUserId) {
        updateData.sales_rep_id = referrerUserId;
      }
      
      const { error: customersError } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', userId);
        
      if (customersError) {
        console.error("Error updating customers:", customersError);
        updates.push({ table: 'customers', success: false, error: customersError.message });
      } else {
        updates.push({ table: 'customers', success: true });
      }
    } else {
      updates.push({ function: 'update_user_referral_codes', success: true });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Enrollment data fixed successfully",
        updates 
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
