import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, expectedAdminCookie } from '@/lib/admin-auth';

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin/login') || req.nextUrl.pathname === '/api/admin/login') return NextResponse.next();
  const expected = await expectedAdminCookie();
  // No ADMIN_PASSWORD configured yet: leave the admin studio open, matching the current design-preview behavior.
  if (!expected) return NextResponse.next();
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie === expected) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
