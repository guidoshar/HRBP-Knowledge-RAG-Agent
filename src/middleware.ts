import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/shark-logo.svg') ||
    pathname.startsWith('/shark_logo_large.svg')
  ) {
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path);
  const token = req.cookies.get('hrbp_token')?.value;

  if (isPublicPath) {
    if (!token) {
      return NextResponse.next();
    }
    const payload = await verifyToken(token);
    if (payload && pathname === '/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.set('hrbp_token', '', { path: '/', maxAge: 0 });
    return response;
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-role', payload.role);
  // HTTP header values must be ByteString; encode non-ASCII display names.
  requestHeaders.set('x-user-name', encodeURIComponent(payload.name));
  requestHeaders.set('x-user-username', payload.username);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
};
