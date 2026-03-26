import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Giriş gerektiren sayfalar
const PROTECTED = ['/panel', '/veteriner-paneli'];
// Sadece admin erişebilir
const ADMIN_ONLY = ['/admin'];
// Zaten girişliyse göremesin
const AUTH_ONLY  = ['/giris', '/kayit', '/sifremi-unuttum'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token     = req.cookies.get('__session')?.value;
  const adminRole = req.cookies.get('__role')?.value;
  const isLoggedIn = Boolean(token);
  const isAdmin    = adminRole === 'admin';

  // Admin sayfaları — sadece admin girebilir
  if (ADMIN_ONLY.some(p => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      const url = new URL('/giris', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      // Admin değilse ana sayfaya at
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Korumalı sayfalar
  if (PROTECTED.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL('/giris', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Auth sayfaları — zaten girişliyse panel'e yönlendir
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/panel', req.url));
  }

  const res = NextResponse.next();

  // Güvenlik başlıkları
  res.headers.set('X-Frame-Options',         'DENY');
  res.headers.set('X-Content-Type-Options',   'nosniff');
  res.headers.set('X-XSS-Protection',         '1; mode=block');
  res.headers.set('Referrer-Policy',           'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy',        'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};