import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Admin sayfasını bot'lardan koru
  if (pathname.startsWith('/admin')) {
    const ua = request.headers.get('user-agent') || '';
    const botPattern = /bot|crawler|spider|scraper|curl|wget/i;
    if (botPattern.test(ua)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // API rate limiting - basit IP bazlı
  if (pathname.startsWith('/api/')) {
    // Cron endpointi sadece Vercel'den erişilebilir
    if (pathname === '/api/reminders') {
      const auth = request.headers.get('authorization');
      const cronSecret = process.env.CRON_SECRET;
      if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  // Güvenlik header'ları ekle
  response.headers.set('X-Robots-Tag', pathname.startsWith('/panel') || pathname.startsWith('/admin') ? 'noindex, nofollow' : 'index, follow');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/panel/:path*',
  ],
};
