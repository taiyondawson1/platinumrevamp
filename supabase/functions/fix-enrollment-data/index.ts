
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
    // Create a Supabase client with the service role key
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

    // Parse request body
    const { userEmail, enrollmentKey } = await req.json()

    if (!userEmail || !enrollmentKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userEmail and enrollmentKey are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log(`Fixing enrollment data for ${userEmail} with key ${enrollmentKey}`)

    // Find the user by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.admin.getUserByEmail(userEmail)).data.user.id)
      .maybeSingle()

    if (userError || !userData) {
      console.error('Error finding user in profiles:', userError)
      
      // Try using the auth API directly
      const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(userEmail)
      
      if (authError || !authData?.user) {
        console.error('Error finding user with auth API:', authError)
        return new Response(
          JSON.stringify({ error: 'User not found with the provided email' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        )
      }
      
      // Use auth user ID
      const userId = authData.user.id
      
      // Update profile enrollment info
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          enrolled_by: enrollmentKey,
          enroller: enrollmentKey
        })
        .eq('id', userId)

      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError)
      }

      // Update license_keys table
      const { error: licenseUpdateError } = await supabase
        .from('license_keys')
        .update({
          enrolled_by: enrollmentKey,
          enroller: enrollmentKey
        })
        .eq('user_id', userId)

      if (licenseUpdateError) {
        console.error('Error updating license_keys:', licenseUpdateError)
      }

      // Update customer_accounts table
      const { error: accountUpdateError } = await supabase
        .from('customer_accounts')
        .update({
          enrolled_by: enrollmentKey,
          enroller: enrollmentKey
        })
        .eq('user_id', userId)

      if (accountUpdateError) {
        console.error('Error updating customer_accounts:', accountUpdateError)
      }

      // Update customers table
      const { error: customerUpdateError } = await supabase
        .from('customers')
        .update({
          enroller: enrollmentKey
        })
        .eq('id', userId)

      if (customerUpdateError) {
        console.error('Error updating customers:', customerUpdateError)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Enrollment data updated successfully',
          userId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    const userId = userData.id

    // Update profile enrollment info
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        enrolled_by: enrollmentKey,
        enroller: enrollmentKey
      })
      .eq('id', userId)

    if (profileUpdateError) {
      console.error('Error updating profile:', profileUpdateError)
    }

    // Update license_keys table
    const { error: licenseUpdateError } = await supabase
      .from('license_keys')
      .update({
        enrolled_by: enrollmentKey,
        enroller: enrollmentKey
      })
      .eq('user_id', userId)

    if (licenseUpdateError) {
      console.error('Error updating license_keys:', licenseUpdateError)
    }

    // Update customer_accounts table
    const { error: accountUpdateError } = await supabase
      .from('customer_accounts')
      .update({
        enrolled_by: enrollmentKey,
        enroller: enrollmentKey
      })
      .eq('user_id', userId)

    if (accountUpdateError) {
      console.error('Error updating customer_accounts:', accountUpdateError)
    }

    // Update customers table
    const { error: customerUpdateError } = await supabase
      .from('customers')
      .update({
        enroller: enrollmentKey
      })
      .eq('id', userId)

    if (customerUpdateError) {
      console.error('Error updating customers:', customerUpdateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Enrollment data updated successfully',
        userId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
