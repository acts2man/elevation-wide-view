import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export const config = { matcher: ['/admin/:path*', '/member/:path*'] };

export async function middleware(req: NextRequest) {
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
  const { res, user, role } = await updateSession(req, { withRole: isAdminPath });

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (isAdminPath && role !== 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/member';
    return NextResponse.redirect(url);
  }
  return res;
}
