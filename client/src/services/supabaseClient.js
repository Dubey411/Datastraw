import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgwuikcnnwqhyjgqrmjc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here');

// Normalize URL hash if redirected back with double hash (#app#access_token=...)
if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
  if (window.location.hash.startsWith('#app#')) {
    window.location.hash = window.location.hash.replace('#app#', '#');
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Trigger Supabase Google OAuth sign-in flow
 */
export async function signInWithGoogle() {
  if (!supabase) {
    console.warn('Supabase anon key not found. Using simulated authentication.');
    return { simulated: true };
  }

  // Redirect to site root origin so Supabase attaches #access_token cleanly to root
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutSupabase() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error);
}

/**
 * Get current session user
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}
