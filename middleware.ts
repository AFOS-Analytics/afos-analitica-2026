import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, COOKIE_NAME, isValidLocale, normalizeLocale, locales } from './lib/i18n/config';

const VISITOR_COOKIE_NAME = 'afos_visitor_id';
const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function ensureVisitorCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (!request.cookies.get(VISITOR_COOKIE_NAME)) {
    response.cookies.set(VISITOR_COOKIE_NAME, crypto.randomUUID(), {
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return response;
}

// ─── Rate Limiting (distribuído via Upstash REST; memory só quando Upstash ausente) ──
const memoryRL = new Map<string, { count: number; resetAt: number }>();

type RateLimitResult = 'ok' | 'limited' | 'unavailable';

async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    // Upstash configurado: falha = 'unavailable' (nunca cair em memory, evita bypass
    // entre workers serverless — cada instância contaria sozinha, permitindo N× o limite).
    try {
      const key = `rl:${ip}`;
      const res = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify([['INCR', key], ['EXPIRE', key, 60]]),
      });
      if (!res.ok) return 'unavailable';
      const data = await res.json();
      const count = data?.[0]?.result || 0;
      return count > 100 ? 'limited' : 'ok';
    } catch {
      return 'unavailable';
    }
  }

  // Sem Upstash (dev local): memory fallback é aceitável — uma única instância.
  const now = Date.now();
  const entry = memoryRL.get(ip);
  if (!entry || now > entry.resetAt) {
    memoryRL.set(ip, { count: 1, resetAt: now + 60000 });
    return 'ok';
  }
  if (entry.count >= 100) return 'limited';
  entry.count++;
  return 'ok';
}

// ─── Paths to skip ──────────────────────────────────────────────────
function shouldSkip(pathname: string): boolean {
  return pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/geo/') ||
    pathname.startsWith('/fotos/') ||
    pathname === '/opengraph-image' ||
    pathname.includes('.');
}

// ─── Middleware ──────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    if (pathname.startsWith('/api/')) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                 request.headers.get('x-real-ip') || 'unknown';
      const rl = await checkRateLimit(ip);
      if (rl === 'limited') {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } });
      }
      if (rl === 'unavailable') {
        return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503, headers: { 'Retry-After': '30' } });
      }
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      return response;
    }
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';

  if (!isValidLocale(firstSegment)) {
    const normalized = normalizeLocale(firstSegment);
    if (normalized) {
      segments[0] = normalized;
      return NextResponse.redirect(new URL('/' + segments.join('/'), request.url));
    }
  } else {
    // Set Content-Language header based on locale + propagate locale via x-pathname-locale
    // for the root layout to read and emit <html lang="...">.
    const response = NextResponse.next();
    response.headers.set('Content-Language', firstSegment);
    response.headers.set('x-pathname-locale', firstSegment);
    return ensureVisitorCookie(request, response);
  }

  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, request.url));
  }

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
