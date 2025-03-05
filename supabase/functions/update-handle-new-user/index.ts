
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

    // Update the handle_new_user function to use enrolled_by
    const { error } = await supabase.rpc('execute_admin_query', {
      query_text: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Create the profile record
          INSERT INTO public.profiles (id, role)
          VALUES (
              new.id,
              COALESCE(
                  (CASE 
                      WHEN new.raw_user_meta_data->>'role' IS NULL THEN 'customer'::public.user_role
                      ELSE (new.raw_user_meta_data->>'role')::public.user_role
                  END),
                  'customer'::public.user_role
              )
          )
          ON CONFLICT (id) DO NOTHING;
          
          -- For customers, create a license key with the enrolled_by field set
          IF (new.raw_user_meta_data->>'role' IS NULL) OR (new.raw_user_meta_data->>'role' = 'customer') THEN
              -- Only create a license key if enrolled_by is provided 
              IF (new.raw_user_meta_data->>'enrolled_by' IS NOT NULL) THEN
                  -- Get a new random license key
                  DECLARE
                      new_license_key TEXT;
                      enrolled_by_key TEXT := new.raw_user_meta_data->>'enrolled_by';
                      retry_count INTEGER := 0;
                      max_retries INTEGER := 3;
                  BEGIN
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
                      
                      -- Insert the license key with enrolled_by set
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
                          enrolled_by
                      ) VALUES (
                          NEW.id,
                          new_license_key,
                          '{}',
                          'active',
                          'standard',
                          COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
                          NEW.email,
                          '',
                          'EA-001',
                          enrolled_by_key
                      )
                      ON CONFLICT (user_id) DO NOTHING;
                  EXCEPTION
                      WHEN others THEN
                          -- Log error but don't fail the entire transaction
                          RAISE NOTICE 'Error creating license key: %', SQLERRM;
                  END;
              END IF;
          END IF;
          
          RETURN NEW;
        END;
        $$;
      `
    })

    if (error) {
      console.error('Error updating handle_new_user function:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to update handle_new_user function'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    return new Response(JSON.stringify({ 
      message: 'handle_new_user function updated successfully'
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
