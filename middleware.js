import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/src/lib/admin/session';

// Everything under /admin and /api/admin needs a valid session, except the login page/endpoint.
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login' || pathname === '/api/admin/login') return NextResponse.next();

  if (await verifySession(request.cookies.get(SESSION_COOKIE)?.value)) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
