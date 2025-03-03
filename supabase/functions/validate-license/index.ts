
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

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
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { licenseKey, accountNumber } = await req.json();
    
    console.log(`Validating license key: ${licenseKey} for account: ${accountNumber}`);
    
    if (!licenseKey || !accountNumber) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Missing license key or account number"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Find the license key in the database
    const { data: licenseData, error: licenseError } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', licenseKey)
      .eq('status', 'active')
      .single();
    
    // Handle license not found
    if (licenseError || !licenseData) {
      console.log(`License not found or inactive: ${licenseKey}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid or inactive license key"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    // Check if license is expired
    if (licenseData.expiry_date && new Date(licenseData.expiry_date) < new Date()) {
      console.log(`License expired: ${licenseKey}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "License key has expired"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    // Check if account number is in the authorized list
    const accountNumbers = licenseData.account_numbers || [];
    const isAuthorized = accountNumbers.includes(accountNumber);
    
    if (!isAuthorized) {
      console.log(`Account not authorized: ${accountNumber} for license: ${licenseKey}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Account number not authorized for this license"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    console.log(`License validated successfully: ${licenseKey} for account: ${accountNumber}`);
    
    // License valid and account authorized
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "License valid and account authorized",
        data: {
          userId: licenseData.user_id,
          licenseKey: licenseData.license_key,
          accountNumbers: licenseData.account_numbers,
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error validating license:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Server error during license validation",
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
