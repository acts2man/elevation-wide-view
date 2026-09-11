'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

/**
 * Browser Supabase client, used from client components. Uses the public anon key — RLS governs access.
 * Returns a single shared instance: creating more than one GoTrueClient against the same storage key
 * causes intermittent auth/session bugs (Supabase's own docs warn about this), and calling this from a
 * component body on every render would do exactly that.
 */
export function supabaseBrowser() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
