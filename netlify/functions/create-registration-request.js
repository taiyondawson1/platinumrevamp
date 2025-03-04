
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin access
// This bypasses RLS policies
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    console.log(`Rejected ${event.httpMethod} request. Only POST is allowed.`);
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Log environment variables availability (without exposing secrets)
    console.log("SUPABASE_URL available:", !!process.env.SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const requestBody = event.body;
    console.log("Request body received:", requestBody);
    
    // Parse request body
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Invalid JSON in request body' }),
      };
    }
    
    const { customer_name, request_type, description } = parsedBody;

    // Validate required fields
    if (!customer_name || !request_type || !description) {
      console.error("Missing required fields:", { customer_name, request_type, description });
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    console.log("Processing registration request:", { customer_name, request_type });

    // Check if Supabase client is initialized correctly
    if (!supabaseAdmin) {
      console.error("Supabase client not initialized");
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Supabase client not initialized' }),
      };
    }

    // Insert request using service role to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('customer_requests')
      .insert([
        {
          customer_name,
          request_type,
          description,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Error creating registration request:', error);
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: 'Failed to create registration request', 
          error: error.message 
        }),
      };
    }

    console.log("Registration request created successfully:", data);
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Registration request created successfully',
        data
      }),
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};
