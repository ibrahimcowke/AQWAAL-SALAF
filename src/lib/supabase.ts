import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === '') {
  console.error('CRITICAL: VITE_SUPABASE_URL is missing. Please check Netlify Environment Variables.');
}
if (!supabaseAnonKey || supabaseAnonKey === '') {
  console.error('CRITICAL: VITE_SUPABASE_ANON_KEY is missing. Please check Netlify Environment Variables.');
}

// Log available VITE_ keys for debugging (without values)
const viteKeys = Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'));
console.log('Available environment keys:', viteKeys);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
