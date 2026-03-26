import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/panel', '/veteriner-paneli', '/admin'];
const AUTH_ONLY  = ['/giris', '/kayit', '/sifremi-unuttum'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('__session')?.value;
  const isLoggedIn = Boolean(token);

  if (PROTECTED.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL('/giris', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/panel', req.url));
  }

  const res = NextResponse.next();

  // Security headers
  res.headers.set('X-Frame-Options',           'DENY');
  res.headers.set('X-Content-Type-Options',     'nosniff');
  res.headers.set('X-XSS-Protection',           '1; mode=block');
  res.headers.set('Referrer-Policy',             'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy',          'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security',   'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
    "frame-src https://patipetra-dec35.firebaseapp.com",
  ].join('; '));

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
