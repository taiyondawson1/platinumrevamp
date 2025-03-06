
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key (has admin rights)
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Parse the request to get userId
    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User ID is required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }
    
    console.log(`Repairing customer records for user: ${userId}`)
    
    // Fetch the user data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      
    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch user profile',
        details: profileError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }
    
    // Fetch the user from auth.users to get email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({
      limit: 1,
      filters: {
        id: userId,
      },
    })
    
    if (userError || !users || users.length === 0) {
      console.error('Error fetching user:', userError)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch user data',
        details: userError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }
    
    const user = users[0]
    const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
    const userEmail = user.email || ''
    const userPhone = user.user_metadata?.phone || ''
    const referredBy = profile.referred_by || user.user_metadata?.referred_by || null
    const isStaff = (profile.role === 'ceo' || profile.role === 'admin' || profile.role === 'enroller')
    
    console.log(`User info: ${userName}, ${userEmail}, role: ${profile.role}, referred by: ${referredBy}`)
    
    // Check if user already has a license key
    const { data: licenseKey, error: licenseKeyError } = await supabase
      .from('license_keys')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      
    // If license key doesn't exist, create one
    if (!licenseKey || licenseKeyError) {
      console.log(`No license key found, creating one for user: ${userId}`)
      
      // Call the function to generate a unique license key
      const { data: generatedKeyData, error: genKeyError } = await supabase.rpc(
        'generate_random_license_key'
      )
      
      if (genKeyError) {
        console.error('Error generating license key:', genKeyError)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to generate license key',
          details: genKeyError
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        })
      }
      
      const newLicenseKey = generatedKeyData
      
      // Insert the new license key
      const { error: insertLicenseError } = await supabase
        .from('license_keys')
        .insert({
          user_id: userId,
          license_key: newLicenseKey,
          product_code: 'EA-001',
          subscription_type: 'standard',
          name: userName,
          email: userEmail,
          phone: userPhone,
          account_numbers: [],
          status: 'active',
          staff_key: isStaff ? profile.staff_key : null,
          enrolled_by: !isStaff ? referredBy : null,
          referred_by: !isStaff ? referredBy : null,
          enroller: !isStaff ? referredBy : null
        })
        
      if (insertLicenseError) {
        console.error('Error inserting license key:', insertLicenseError)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to insert license key',
          details: insertLicenseError
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        })
      }
      
      console.log(`Created license key ${newLicenseKey} for user ${userId}`)
    } else {
      console.log(`License key already exists for user: ${userId}`)
    }
    
    // Check if user already has a customer account
    const { data: customerAccount, error: customerAccountError } = await supabase
      .from('customer_accounts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      
    // If customer account doesn't exist, create one
    if (!customerAccount || customerAccountError) {
      console.log(`No customer account found, creating one for user: ${userId}`)
      
      // Get the license key (either the existing one or the newly created one)
      const { data: currentLicenseKey } = await supabase
        .from('license_keys')
        .select('license_key')
        .eq('user_id', userId)
        .single()
        
      // Insert the new customer account
      const { error: insertCustomerError } = await supabase
        .from('customer_accounts')
        .insert({
          user_id: userId,
          name: userName,
          email: userEmail,
          phone: userPhone,
          status: 'active',
          enrolled_by: !isStaff ? referredBy : null,
          referred_by: !isStaff ? referredBy : null,
          license_key: currentLicenseKey.license_key
        })
        
      if (insertCustomerError) {
        console.error('Error inserting customer account:', insertCustomerError)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to insert customer account',
          details: insertCustomerError
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        })
      }
      
      console.log(`Created customer account for user ${userId}`)
    } else {
      console.log(`Customer account already exists for user: ${userId}`)
    }
    
    // Check if user already has a customer record in the customers table
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      
    // If customer doesn't exist, create one
    if (!customer || customerError) {
      console.log(`No customer record found, creating one for user: ${userId}`)
      
      // Insert the new customer record
      const { error: insertCustomerRecordError } = await supabase
        .from('customers')
        .insert({
          id: userId,
          name: userName,
          email: userEmail,
          phone: userPhone,
          status: 'Active',
          sales_rep_id: '00000000-0000-0000-0000-000000000000',
          staff_key: isStaff ? profile.staff_key : null,
          enroller: !isStaff ? referredBy : null,
          revenue: '$0'
        })
        
      if (insertCustomerRecordError) {
        console.error('Error inserting customer record:', insertCustomerRecordError)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to insert customer record',
          details: insertCustomerRecordError
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        })
      }
      
      console.log(`Created customer record for user ${userId}`)
    } else {
      console.log(`Customer record already exists for user: ${userId}`)
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully ensured all customer records exist',
      userId: userId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (err) {
    console.error('Error in repair-customer-records function:', err)
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
