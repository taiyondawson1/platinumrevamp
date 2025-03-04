
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://qzbwxtegqsusmfwjauwh.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Ynd4dGVncXN1c21md2phdXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NTgwMzMsImV4cCI6MjA1MzIzNDAzM30.N3vIgRtWmaEVkaNEWDo_ywfzOu-gSupjCQywKQA8kz8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    fetch: (url, options) => {
      // Set a longer timeout for fetch operations to prevent timeouts during registration
      const controller = new AbortController();
      const signal = controller.signal;
      
      // 30-second timeout instead of the browser default
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      // Combine the provided options with our signal
      const fetchOptions = {
        ...options,
        signal
      };
      
      return fetch(url, fetchOptions)
        .finally(() => clearTimeout(timeoutId));
    }
  }
});
