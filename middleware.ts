import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, COOKIE_NAME, isValidLocale, normalizeLocale, locales } from './lib/i18n/config';
import { negotiateLocale } from './lib/i18n/negotiate';
import { clientIp } from './lib/net/client-ip';

const VISITOR_COOKIE_NAME = 'afos_visitor_id';
const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function ensureVisitorCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (!request.cookies.get(VISITOR_COOKIE_NAME)) {
    response.cookies.set(VISITOR_COOKIE_NAME, crypto.randomUUID(), {
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return response;
}

const ORIGIN_COOKIE_NAME = 'afos_origin';
const ORIGIN_COOKIE_MAX_AGE = 90 * 24 * 60 * 60;

/**
 * Guarda a ORIGEM do tráfego (?from= ou ?utm_source=) num cookie, para que ela
 * sobreviva ao redirecionamento de idioma e à navegação até o cadastro.
 *
 * PRIMEIRO TOQUE VENCE: se o cookie já existe, não sobrescreve. Quem chegou pelo
 * LinkedIn e voltou depois por busca orgânica continua contando como LinkedIn,
 * que é a pergunta que interessa ("de onde essa pessoa veio a primeira vez").
 *
 * ⚠️ O valor é sanitizado antes de guardar: ele vai parar no banco, em `Lead.campaign`,
 * e vem inteiro da URL, ou seja, de fora.
 */
function ensureOriginCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (request.cookies.get(ORIGIN_COOKIE_NAME)) return response;
  const raw =
    request.nextUrl.searchParams.get('from') || request.nextUrl.searchParams.get('utm_source');
  if (!raw) return response;
  const valor = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
  if (!valor) return response;
  response.cookies.set(ORIGIN_COOKIE_NAME, valor, {
    maxAge: ORIGIN_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

const STRATEGIC_DOCS = new Set([
  '/pipeline-launch-opensource.html',
  '/posicionamento-estrategico-afos.html',
]);

function basicAuthChallenge(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AFOS Analytics - Documento interno"',
      'Cache-Control': 'no-store',
    },
  });
}

function checkStrategicDocAuth(request: NextRequest): NextResponse | null {
  const password = process.env.STRATEGIC_DOCS_PASSWORD;
  if (!password) {
    // Fail closed — sem env var, ninguém entra (mais seguro que liberar geral).
    return new NextResponse('Service unavailable', { status: 503 });
  }
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return basicAuthChallenge();
  let provided = '';
  try {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(':');
    provided = idx >= 0 ? decoded.slice(idx + 1) : decoded;
  } catch {
    return basicAuthChallenge();
  }
  // Comparação de tempo constante. `!==` sai no primeiro caractere diferente e
  // vaza o prefixo correto pelo tempo de resposta. `timingSafeEqual` de
  // node:crypto não existe no runtime de edge, então a conta é feita à mão: XOR
  // acumulado sobre o comprimento máximo, sem atalho.
  if (!comparaConstante(provided, password)) return basicAuthChallenge();
  return null;
}

/** Igualdade sem atalho: percorre tudo e só decide no fim. */
function comparaConstante(a: string, b: string): boolean {
  const n = Math.max(a.length, b.length);
  let dif = a.length ^ b.length;
  for (let i = 0; i < n; i++) dif |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return dif === 0;
}

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

function shouldSkip(pathname: string): boolean {
  return pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/geo/') ||
    pathname === '/opengraph-image' ||
    // /welcome is a locale-less meta route (post-signup language picker).
    // It must NOT be prefixed with /pt-BR, /en, or /es — the page itself
    // renders the trilingual UI and saves the chosen locale to Lead.
    pathname === '/welcome' || pathname.startsWith('/welcome/') ||
    pathname.includes('.');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (STRATEGIC_DOCS.has(pathname)) {
    const denied = checkStrategicDocAuth(request);
    if (denied) return denied;
    return NextResponse.next();
  }

  // Bare root `/` falls through to app/page.tsx, which renders OG metadata
  // (EN copy) and dispatches a JS smart-redirect based on navigator.language.
  // Without this, middleware would 307 to /pt-BR before any HTML body renders,
  // leaving LLM crawlers and IM clients that don't follow redirects with empty
  // OG. See app/page.tsx for the redirect logic.
  if (pathname === '/') {
    // ⚠️ A RAIZ É ONDE O TRÁFEGO DE FORA CAI, incluindo a pílula do LinkedIn. Ela sai
    // daqui antes de qualquer redirecionamento, então a origem tem de ser gravada
    // AQUI: o `app/page.tsx` despacha para /pt-BR ou /en sem carregar a query, e sem
    // este cookie o ?from=li morre em silêncio. O cookie é o transporte, não a URL.
    return ensureOriginCookie(request, ensureVisitorCookie(request, NextResponse.next()));
  }

  if (shouldSkip(pathname)) {
    if (pathname.startsWith('/api/')) {
      const ip = clientIp(request.headers);
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
      // ⚠️ `search` explícito: `new URL(path, base)` DESCARTA a query, e sem isto todo
      // parâmetro morre no redirecionamento de idioma (medido em 11/Ago/2026, com o
      // ?from=li da pílula do LinkedIn sumindo em silêncio).
      return ensureOriginCookie(
        request,
        NextResponse.redirect(new URL('/' + segments.join('/') + request.nextUrl.search, request.url))
      );
    }
  } else {
    // Set Content-Language header based on locale + propagate locale via x-pathname-locale.
    // CRÍTICO: o header precisa ir nas REQUEST headers (não só na response) para o root
    // layout (server component) lê-lo via headers() e emitir <html lang="...">. Sem o
    // request.headers, headers() nunca enxerga o valor e <html lang> ficava sempre "pt-BR"
    // em /en/* e /es/* (bug a11y + SEO, EVAL 06/Jun).
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname-locale', firstSegment);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Language', firstSegment);
    response.headers.set('x-pathname-locale', firstSegment);
    return ensureOriginCookie(request, ensureVisitorCookie(request, response));
  }

  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return ensureOriginCookie(
      request,
      NextResponse.redirect(new URL(`/${cookieLocale}${pathname}${request.nextUrl.search}`, request.url))
    );
  }

  // Regra única em lib/i18n/negotiate.ts: respeita q-value e a ordem do LEITOR.
  // A varredura anterior percorria a NOSSA lista e casava por substring, então
  // `en-US,en;q=0.9,pt;q=0.3` caía em português.
  const detectedLocale = negotiateLocale(request.headers.get('accept-language'), defaultLocale);

  return ensureOriginCookie(
    request,
    NextResponse.redirect(new URL(`/${detectedLocale}${pathname}${request.nextUrl.search}`, request.url))
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
