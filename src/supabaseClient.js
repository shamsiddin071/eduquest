import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfiguredSupabase = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = createClient(
  isConfiguredSupabase ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfiguredSupabase ? supabaseAnonKey : 'placeholder-anon-key'
);
