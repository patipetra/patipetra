import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/panel', '/veteriner-paneli'];
const ADMIN_ONLY = ['/admin'];
const AUTH_ONLY  = ['/giris', '/kayit', '/sifremi-unuttum'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token    = req.cookies.get('__session')?.value;
  const isLoggedIn = Boolean(token);

  if (ADMIN_ONLY.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL('/giris', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (PROTECTED.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL('/giris', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/panel', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
