import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, COOKIE_NAME, isValidLocale, normalizeLocale, locales } from './lib/i18n/config';

// ─── Rate Limiting ──────────────────────────────────────────────────
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

// ─── Paths to skip (no locale routing) ──────────────────────────────
function shouldSkip(pathname: string): boolean {
  return pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/geo/') ||
    pathname.startsWith('/fotos/') ||
    pathname === '/opengraph-image' ||
    pathname.includes('.');
}

// ─── Middleware ──────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, Next.js internals
  if (shouldSkip(pathname)) {
    if (pathname.startsWith('/api/')) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                 request.headers.get('x-real-ip') || 'unknown';
      if (isRateLimited(ip)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } });
      }
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      return response;
    }
    return NextResponse.next();
  }

  // Check if URL has a valid locale prefix
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';

  // Case-insensitive: /PT-BR → redirect to /pt-BR
  if (!isValidLocale(firstSegment)) {
    const normalized = normalizeLocale(firstSegment);
    if (normalized) {
      segments[0] = normalized;
      return NextResponse.redirect(new URL('/' + segments.join('/'), request.url));
    }
  } else {
    return NextResponse.next();
  }

  // No locale in URL — detect and redirect
  // 1. Cookie
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, request.url));
  }

  // 2. Accept-Language
  const acceptLang = request.headers.get('accept-language') || '';
  let detectedLocale = defaultLocale;
  for (const locale of locales) {
    if (acceptLang.toLowerCase().includes(locale.split('-')[0].toLowerCase())) {
      detectedLocale = locale;
      break;
    }
  }

  return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
