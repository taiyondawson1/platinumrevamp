import { createClient } from '@supabase/supabase-js';

// Since we're connected to Supabase through Lovable, we can access these values directly
export const supabase = createClient(
  'https://8d65ebc1-e5eb-48c2-8638-1c49afe9516b.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IjhkNjVlYmMxLWU1ZWItNDhjMi04NjM4LTFjNDlhZmU5NTE2YiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA5NzU2MjY5LCJleHAiOjIwMjUzMzIyNjl9.Wd27nY_iJhyPLqjcxaVGWHEwqoVA4RWu_zQyGVqLvvE'
);