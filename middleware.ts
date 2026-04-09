import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, COOKIE_NAME, isValidLocale } from './lib/i18n/config';

// Rate limiting (keep existing logic)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  if (entry.count >= 100) return true;
  entry.count++;
  return false;
}

// Cleanup expired entries
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const key of Array.from(rateLimit.keys())) {
      const entry = rateLimit.get(key);
      if (entry && now > entry.resetAt) rateLimit.delete(key);
    }
  }, 60000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/geo/') ||
    pathname.startsWith('/fotos/') ||
    pathname.includes('.') // static files (favicon.svg, manifest.json, etc)
  ) {
    // Rate limit only API routes
    if (pathname.startsWith('/api/')) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                 request.headers.get('x-real-ip') ||
                 'unknown';
      if (isRateLimited(ip)) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      return response;
    }
    return NextResponse.next();
  }

  // Check if URL already has a valid locale prefix
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';

  if (isValidLocale(firstSegment)) {
    // URL has valid locale — continue
    return NextResponse.next();
  }

  // No locale in URL — detect and redirect
  // 1. Check cookie
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, request.url));
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  let detectedLocale = defaultLocale;
  for (const locale of locales) {
    if (acceptLang.includes(locale.split('-')[0])) {
      detectedLocale = locale;
      break;
    }
  }

  // 3. Redirect to detected locale
  return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|geo/|fotos/).*)'],
};
