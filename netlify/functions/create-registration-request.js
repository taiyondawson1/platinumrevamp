
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin access
// This bypasses RLS policies
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { customer_name, request_type, description } = JSON.parse(event.body);

    // Validate required fields
    if (!customer_name || !request_type || !description) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    console.log("Processing registration request:", { customer_name, request_type });

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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          message: 'Failed to create registration request', 
          error: error.message 
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};
