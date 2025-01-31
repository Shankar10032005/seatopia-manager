import { createClient } from '@supabase/supabase-js';

// Since we don't have environment variables, we'll use placeholder values
// This will allow the app to build and run without Supabase functionality
export const supabase = createClient(
  'https://placeholder-url.supabase.co',
  'placeholder-key'
);