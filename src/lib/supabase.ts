import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://qzbwxtegqsusmfwjauwh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Ynd4dGVncXN1c21md2phdXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NTYyNjksImV4cCI6MjAyNTMzMjI2OX0.gFN8MzKHkFk9-HtgJBCy8V97nyiOGBvIkPSyHxqKF_E'
);