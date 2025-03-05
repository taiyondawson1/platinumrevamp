
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
    console.log("Starting fix-handle-new-user function...")
    
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

    // Update the handle_new_user function to properly handle staff_key and enrolled_by
    const { error } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- First, drop the existing triggers if they exist to avoid conflicts
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP TRIGGER IF EXISTS on_auth_user_created_license_key ON auth.users;

        -- Update handle_new_user function to properly handle staff_key for staff vs customers
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          valid_role public.user_role;
          role_text text;
          staff_key_value text;
          is_staff boolean;
        BEGIN
          -- First, safely extract and validate the role
          role_text := COALESCE(new.raw_user_meta_data->>'role', 'customer');
          
          -- Validate the role and convert to enum
          CASE role_text
            WHEN 'ceo' THEN valid_role := 'ceo'::public.user_role;
            WHEN 'admin' THEN valid_role := 'admin'::public.user_role;
            WHEN 'enroller' THEN valid_role := 'enroller'::public.user_role;
            ELSE valid_role := 'customer'::public.user_role;
          END CASE;
          
          -- Determine if this is a staff member (non-customer)
          is_staff := (valid_role = 'ceo' OR valid_role = 'admin' OR valid_role = 'enroller');
          
          -- Set staff_key based on role - only for staff members
          IF is_staff THEN
            -- Staff members get their staff_key stored
            staff_key_value := new.raw_user_meta_data->>'staff_key';
          ELSE
            -- Customers should never have a staff_key (they have enrolled_by instead)
            staff_key_value := NULL;
          END IF;
          
          -- Log for debugging
          RAISE NOTICE 'Creating profile for user % with role % and staff_key %', new.id, valid_role, staff_key_value;
          
          -- Create the profile with the validated role and appropriate staff_key
          INSERT INTO public.profiles (id, role, staff_key)
          VALUES (new.id, valid_role, staff_key_value)
          ON CONFLICT (id) DO UPDATE SET
            role = EXCLUDED.role,
            staff_key = EXCLUDED.staff_key,
            updated_at = NOW();
          
          RETURN NEW;
        EXCEPTION
          WHEN others THEN
            RAISE NOTICE 'Error creating profile: %', SQLERRM;
            RETURN NEW;
        END;
        $$;

        -- The create_customer_license function has already been updated in the SQL migration

        -- Recreate both triggers to ensure both functions get called
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            
        CREATE TRIGGER on_auth_user_created_license_key
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.create_customer_license();
      `
    })

    if (error) {
      console.error('Error updating handle_new_user function:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to update handle_new_user function',
        details: error
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Run the repair function to fix any existing records with incorrect data
    const { error: repairError } = await supabase.rpc('repair_missing_customer_records')

    if (repairError) {
      console.error('Error running repair function:', repairError)
      // Non-fatal error, continue with response
    }

    return new Response(JSON.stringify({ 
      message: "Successfully updated database triggers and fixed existing records to properly handle enrollment keys."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
