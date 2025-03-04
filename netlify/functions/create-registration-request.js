
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  console.log('Registration request received');
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    console.log('Request body:', JSON.stringify(requestBody));
    
    // Validate input
    if (!requestBody.customer_name || !requestBody.request_type || !requestBody.description) {
      console.log('Validation failed: Missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }
    
    // Extract email from description for duplicate check
    let email = '';
    try {
      const descriptionObj = JSON.parse(requestBody.description);
      email = descriptionObj.email;
    } catch (e) {
      console.error('Failed to parse description JSON:', e);
    }
    
    if (email) {
      // Check for existing requests with the same email
      const { data: existingRequests, error: checkError } = await supabase
        .from('customer_requests')
        .select('id, status')
        .eq('request_type', 'registration')
        .filter('description', 'ilike', `%${email}%`);
      
      if (checkError) {
        console.error('Error checking for existing requests:', checkError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: `Database error: ${checkError.message}` })
        };
      }
      
      // If there's an existing pending request, return it instead of creating a new one
      const pendingRequest = existingRequests?.find(req => req.status === 'pending');
      if (pendingRequest) {
        console.log('Found existing pending request:', pendingRequest.id);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Registration request already exists',
            data: [pendingRequest]
          })
        };
      }
      
      // If there's an approved request, treat it as a duplicate registration
      const approvedRequest = existingRequests?.find(req => req.status === 'approved');
      if (approvedRequest) {
        console.log('Found existing approved request:', approvedRequest.id);
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ 
            message: 'This email has already been registered. Please login or use a different email.' 
          })
        };
      }
    }
    
    // Insert request into customer_requests table
    console.log('Creating new registration request');
    const { data, error } = await supabase
      .from('customer_requests')
      .insert([requestBody])
      .select();
    
    if (error) {
      console.error('Error creating registration request:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: `Database error: ${error.message}` })
      };
    }
    
    console.log('Registration request created successfully:', data);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Registration request created successfully',
        data
      })
    };
    
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: error.message || 'Unknown server error' })
    };
  }
};
