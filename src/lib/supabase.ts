import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('CRITICAL: VITE_SUPABASE_URL is missing from environment.');
}
if (!supabaseAnonKey) {
  console.error('CRITICAL: VITE_SUPABASE_ANON_KEY is missing from environment.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
