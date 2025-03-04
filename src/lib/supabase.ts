
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://qzbwxtegqsusmfwjauwh.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Ynd4dGVncXN1c21md2phdXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NTgwMzMsImV4cCI6MjA1MzIzNDAzM30.N3vIgRtWmaEVkaNEWDo_ywfzOu-gSupjCQywKQA8kz8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true,
    storage: localStorage, // Use localStorage instead of sessionStorage
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
