
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
    console.log("Starting to fix handle_new_user function...")
    
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

    // Update the handle_new_user function to properly handle customer roles
    const { error } = await supabase.rpc('execute_admin_query', {
      query_text: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          valid_role public.user_role;
          role_text text;
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
          
          -- Log for debugging
          RAISE NOTICE 'Creating profile for user % with role %', new.id, valid_role;
          
          -- Create the profile with the validated role
          INSERT INTO public.profiles (id, role, staff_key)
          VALUES (
              new.id,
              valid_role,
              -- Only set staff_key for staff members
              CASE 
                WHEN valid_role = 'customer' THEN NULL
                ELSE COALESCE(new.raw_user_meta_data->>'staff_key', NULL)
              END
          )
          ON CONFLICT (id) DO UPDATE SET
            role = valid_role,
            staff_key = CASE 
                          WHEN valid_role = 'customer' THEN NULL
                          ELSE COALESCE(new.raw_user_meta_data->>'staff_key', profiles.staff_key)
                        END;
          
          RETURN NEW;
        END;
        $$;
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

    // Create a separate function for creating license keys for new customers
    const { error: licenseError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        CREATE OR REPLACE FUNCTION public.create_customer_license()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          new_license_key TEXT;
          enrolled_by_key TEXT := new.raw_user_meta_data->>'enrolled_by';
          role_text TEXT := COALESCE(new.raw_user_meta_data->>'role', 'customer');
          retry_count INTEGER := 0;
          max_retries INTEGER := 3;
          is_customer BOOLEAN;
        BEGIN
          -- Only create license keys for customers
          is_customer := (role_text = 'customer');
          
          IF NOT is_customer THEN
            -- Not a customer, don't create a license key
            RETURN NEW;
          END IF;
          
          -- For customers, ensure they have a license key
          -- Generate a new unique license key
          LOOP
            new_license_key := public.generate_random_license_key();
            
            -- Exit when we find a unique key or hit max retries
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.license_keys 
                WHERE license_key = new_license_key
            ) OR retry_count >= max_retries;
            
            retry_count := retry_count + 1;
          END LOOP;
          
          -- Insert the license key with enrolled_by if provided
          INSERT INTO public.license_keys (
              user_id,
              license_key,
              account_numbers,
              status,
              subscription_type,
              name,
              email,
              phone,
              product_code,
              enrolled_by,
              staff_key
          ) VALUES (
              NEW.id,
              new_license_key,
              '{}',
              'active',
              'standard',
              COALESCE(split_part(NEW.email, '@', 1), 'Customer'),
              NEW.email,
              '',
              'EA-001',
              enrolled_by_key,
              enrolled_by_key
          )
          ON CONFLICT (user_id) DO NOTHING;
              
          RETURN NEW;
        EXCEPTION
          WHEN others THEN
            -- Log error but don't fail the entire transaction
            RAISE NOTICE 'Error creating license key: %', SQLERRM;
            RETURN NEW;
        END;
        $$;
      `
    })

    if (licenseError) {
      console.error('Error creating license key function:', licenseError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create customer license function',
        details: licenseError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Create or replace the trigger for license key creation
    const { error: triggerError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        DROP TRIGGER IF EXISTS on_auth_user_created_license_key ON auth.users;
        
        CREATE TRIGGER on_auth_user_created_license_key
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.create_customer_license();
      `
    })

    if (triggerError) {
      console.error('Error updating license key trigger:', triggerError)
      return new Response(JSON.stringify({ 
        error: 'Failed to update license key trigger',
        details: triggerError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Fix existing customers with missing profiles
    const { error: fixCustomersError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Update any existing users who might have incorrect role assignments
        DO $$
        DECLARE
          user_record RECORD;
        BEGIN
          -- Find any auth users without valid profiles
          FOR user_record IN 
            SELECT au.id, au.email
            FROM auth.users au
            LEFT JOIN public.profiles p ON au.id = p.id
            WHERE p.id IS NULL OR p.role IS NULL
          LOOP
            -- Create a profile with customer role for any missing profiles
            INSERT INTO public.profiles (id, role)
            VALUES (user_record.id, 'customer'::public.user_role)
            ON CONFLICT (id) DO UPDATE SET
              role = 'customer'::public.user_role;
              
            -- Log the fix
            RAISE NOTICE 'Fixed profile for user %: %', user_record.id, user_record.email;
          END LOOP;
        END $$;
      `
    })

    if (fixCustomersError) {
      console.error('Error fixing existing customer profiles:', fixCustomersError)
      return new Response(JSON.stringify({ 
        error: 'Failed to fix existing customer profiles',
        details: fixCustomersError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    return new Response(JSON.stringify({ 
      message: 'handle_new_user function and triggers updated successfully'
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
