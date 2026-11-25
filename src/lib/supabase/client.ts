import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let clientInstance: SupabaseClient | null = null;

/**
 * Tarayıcı tarafı için fail-safe Supabase istemcisi.
 * Anahtarlar eksik olduğunda çökmez, null döner veya demo modunda devam eder.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Demo modunda sessizce çalışmaya devam et
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    });
  }

  return clientInstance;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
