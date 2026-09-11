import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, checkAdminPassword, expectedAdminCookie } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (typeof password !== 'string' || !(await checkAdminPassword(password))) {
    return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });
  }
  const cookieValue = await expectedAdminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, cookieValue!, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
