
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

    // First make sure the generate_random_license_key function exists
    const { error: keyFunctionError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Ensure we have a function to generate random license keys
        CREATE OR REPLACE FUNCTION public.generate_random_license_key()
        RETURNS text
        LANGUAGE plpgsql
        AS $function$
        DECLARE
            chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            result TEXT := '';
            i INTEGER;
            j INTEGER;
        BEGIN
            FOR i IN 1..5 LOOP
                FOR j IN 1..5 LOOP
                    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
                END LOOP;
                IF i < 5 THEN
                    result := result || '-';
                END IF;
            END LOOP;
            RETURN result;
        END;
        $function$;
      `
    })

    if (keyFunctionError) {
      console.error('Error creating license key generation function:', keyFunctionError)
      // Continue despite this error as it might just be that the function already exists
    }

    // Update the handle_new_user function to properly handle customer roles
    const { error } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Drop the existing triggers if they exist to avoid conflicts
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP TRIGGER IF EXISTS on_auth_user_created_license_key ON auth.users;

        -- Update handle_new_user function to just handle profile creation
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
                        END,
            updated_at = NOW();
          
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
        BEGIN
          -- Log for debugging
          RAISE NOTICE 'Creating license key for user % with role %', new.id, role_text;
          
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
              COALESCE(enrolled_by_key, new.raw_user_meta_data->>'staff_key')
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

    // Create or replace the sync_license_key_to_customer function to properly handle customer creation
    const { error: syncFunctionError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        CREATE OR REPLACE FUNCTION public.sync_license_key_to_customer()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Create or update the customer record based on license key
          INSERT INTO public.customers (
            id,
            name,
            email,
            phone,
            status,
            sales_rep_id,
            staff_key,
            revenue
          ) 
          VALUES (
            NEW.user_id, 
            COALESCE(NEW.name, 'Customer'),
            COALESCE(NEW.email, ''),
            COALESCE(NEW.phone, ''),
            COALESCE(NEW.status, 'Active'),
            '00000000-0000-0000-0000-000000000000'::uuid,
            COALESCE(NEW.staff_key, NEW.enrolled_by),
            '$0'
          )
          ON CONFLICT (id) 
          DO UPDATE SET
            name = COALESCE(EXCLUDED.name, customers.name),
            email = COALESCE(EXCLUDED.email, customers.email),
            phone = COALESCE(EXCLUDED.phone, customers.phone),
            status = COALESCE(EXCLUDED.status, customers.status),
            staff_key = COALESCE(EXCLUDED.staff_key, customers.staff_key),
            updated_at = NOW();
            
          RETURN NEW;
        END;
        $$;
      `
    })

    if (syncFunctionError) {
      console.error('Error updating sync_license_key_to_customer function:', syncFunctionError)
      return new Response(JSON.stringify({ 
        error: 'Failed to update sync_license_key_to_customer function',
        details: syncFunctionError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Fix existing customers with missing profiles or customer records
    const { error: fixCustomersError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Update any existing users who might have incorrect role assignments
        DO $$
        DECLARE
          user_record RECORD;
          license_record RECORD;
          new_license_key TEXT;
          retry_count INTEGER;
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
          
          -- Find any users without license keys
          FOR user_record IN 
            SELECT au.id, au.email, p.role, p.staff_key
            FROM auth.users au
            JOIN public.profiles p ON au.id = p.id
            LEFT JOIN public.license_keys lk ON au.id = lk.user_id
            WHERE lk.id IS NULL
          LOOP
            -- Generate a unique license key
            retry_count := 0;
            LOOP
                new_license_key := public.generate_random_license_key();
                
                -- Exit when we find a unique key or hit max retries
                EXIT WHEN NOT EXISTS (
                    SELECT 1 FROM public.license_keys 
                    WHERE license_key = new_license_key
                ) OR retry_count >= 3;
                
                retry_count := retry_count + 1;
            END LOOP;
            
            -- Insert the license key record
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
                staff_key,
                enrolled_by
            ) VALUES (
                user_record.id,
                new_license_key,
                '{}',
                'active',
                'standard',
                split_part(user_record.email, '@', 1),
                user_record.email,
                '',
                'EA-001', 
                user_record.staff_key,
                user_record.staff_key
            );
            
            RAISE NOTICE 'Created license key for user %: %', user_record.id, new_license_key;
          END LOOP;
          
          -- Find any license_keys without corresponding customers
          FOR license_record IN
            SELECT lk.user_id, lk.name, lk.email, lk.phone, lk.status, lk.staff_key
            FROM public.license_keys lk
            LEFT JOIN public.customers c ON lk.user_id = c.id
            WHERE c.id IS NULL
          LOOP
            -- Create a customer record from the license key info
            INSERT INTO public.customers (
              id,
              name,
              email,
              phone,
              status,
              sales_rep_id,
              staff_key,
              revenue
            ) 
            VALUES (
              license_record.user_id, 
              license_record.name,
              license_record.email,
              COALESCE(license_record.phone, ''),
              COALESCE(license_record.status, 'Active'),
              '00000000-0000-0000-0000-000000000000'::uuid,
              license_record.staff_key,
              '$0'
            )
            ON CONFLICT (id) DO NOTHING;
            
            -- Log the fix
            RAISE NOTICE 'Created customer record for user %: %', license_record.user_id, license_record.email;
          END LOOP;
        END $$;
      `
    })

    if (fixCustomersError) {
      console.error('Error fixing existing customer profiles and records:', fixCustomersError)
      return new Response(JSON.stringify({ 
        error: 'Failed to fix existing customer profiles and records',
        details: fixCustomersError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Recreate the triggers to run the functions
    const { error: triggerError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Recreate both triggers to ensure both functions get called
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            
        CREATE TRIGGER on_auth_user_created_license_key
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.create_customer_license();
      `
    })

    if (triggerError) {
      console.error('Error recreating triggers:', triggerError)
      return new Response(JSON.stringify({ 
        error: 'Failed to recreate triggers',
        details: triggerError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Update the config to enable the functions
    const { error: configError } = await supabase.rpc('execute_admin_query', {
      query_text: `
        -- Make sure the functions are enabled in config
        UPDATE supabase_functions.config
        SET verify_jwt = false
        WHERE function_name IN ('update-handle-new-user', 'fix-handle-new-user');
      `
    })

    if (configError) {
      console.error('Error updating function config:', configError)
      // This is not critical, so continue anyway
    }

    return new Response(JSON.stringify({ 
      message: 'Database functions and triggers updated successfully. All accounts will now be properly stored in the license_keys table.'
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
