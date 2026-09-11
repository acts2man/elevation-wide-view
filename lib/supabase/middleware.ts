import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the auth session on every request and returns the response plus the current user.
 * Pass `withRole: true` only where the role is actually needed (admin routes) — the profile lookup
 * is an extra network round trip to Postgres, so skipping it on plain member routes cuts latency.
 * Uses getSession() (a local, unverified JWT decode) rather than getUser() (which calls the Supabase
 * Auth server) to avoid a second network round trip on every navigation: the real security boundary
 * here is Postgres Row Level Security, which independently verifies the JWT on every actual data
 * request, so this only affects which page the UI shows, not what data can be read or written.
 */
export async function updateSession(req: NextRequest, opts?: { withRole?: boolean }) {
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  let role: 'admin' | 'member' | null = null;
  if (user && opts?.withRole) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    role = (profile?.role as 'admin' | 'member' | undefined) ?? null;
  }
  return { res, user, role };
}
