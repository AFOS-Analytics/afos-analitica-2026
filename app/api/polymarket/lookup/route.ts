import { NextResponse } from 'next/server';

/**
 * Proxy GENÉRICO de leitura da Polymarket (gamma-api), server-side na Vercel/EUA.
 *
 * Existe porque o domínio polymarket.com é bloqueado no DNS de certas redes (BR),
 * mas o servidor Vercel alcança a gamma-api. Diferente de /api/polymarket (que é
 * hardcoded aos 6 mercados do Brasil), este aceita QUALQUER mercado — para o
 * backfill multi-país (Índia 2024, França 2024, etc.).
 *
 * Segurança (anti-SSRF): base + endpoint gamma-api FIXOS; só o valor do parâmetro
 * passa. `slug` restrito a [a-z0-9-] (não consegue injetar host); `q` limitado em
 * tamanho e URL-encodado. Somente leitura de dado público de mercado.
 *
 *   GET /api/polymarket/lookup?slug=<event-slug>   → evento + mercados (volume, preços, datas, clobTokenIds)
 *   GET /api/polymarket/lookup?q=<termo>           → busca de eventos (título, slug, volume, closed)
 */

export const revalidate = 3600;

const GAMMA = 'https://gamma-api.polymarket.com';

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length <= 140;
}

function parseArr(v: unknown): unknown {
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return v; }
  }
  return v;
}

async function gammaFetch(url: string, timeoutMs = 12000): Promise<{ data?: unknown; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 3600 } });
    if (!res.ok) return { error: `upstream HTTP ${res.status}` };
    return { data: await res.json() };
  } catch (error) {
    return { error: String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function mapMarket(m: Record<string, unknown>) {
  return {
    id: m.id,
    question: m.question,
    slug: m.slug,
    outcomes: parseArr(m.outcomes),
    outcomePrices: parseArr(m.outcomePrices),
    volume: m.volume,
    volumeNum: m.volumeNum,
    liquidity: m.liquidity,
    liquidityNum: m.liquidityNum,
    lastTradePrice: m.lastTradePrice,
    startDate: m.startDate,
    endDate: m.endDate,
    closed: m.closed,
    clobTokenIds: parseArr(m.clobTokenIds),
  };
}

function mapEvent(ev: Record<string, unknown>) {
  return {
    title: ev.title,
    slug: ev.slug,
    volume: ev.volume,
    liquidity: ev.liquidity,
    startDate: ev.startDate,
    endDate: ev.endDate,
    closed: ev.closed,
    markets: Array.isArray(ev.markets) ? (ev.markets as Record<string, unknown>[]).map(mapMarket) : [],
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const q = searchParams.get('q');

  if (slug) {
    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: 'invalid slug (only [a-z0-9-])' }, { status: 400 });
    }
    // closed=true garante que mercados JÁ RESOLVIDOS (backfill) também apareçam.
    const r = await gammaFetch(`${GAMMA}/events?slug=${slug}&limit=1&closed=true`);
    if (r.error) return NextResponse.json({ error: r.error, slug }, { status: 502 });
    const arr = Array.isArray(r.data) ? (r.data as Record<string, unknown>[]) : [];
    if (arr.length === 0) {
      // fallback sem filtro closed (mercados ainda abertos)
      const r2 = await gammaFetch(`${GAMMA}/events?slug=${slug}&limit=1`);
      const arr2 = Array.isArray(r2.data) ? (r2.data as Record<string, unknown>[]) : [];
      if (arr2.length === 0) return NextResponse.json({ error: 'not found', slug }, { status: 404 });
      return NextResponse.json({ event: mapEvent(arr2[0]) }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
    }
    return NextResponse.json({ event: mapEvent(arr[0]) }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
  }

  if (q) {
    if (q.length > 100) return NextResponse.json({ error: 'query too long (max 100)' }, { status: 400 });
    const r = await gammaFetch(`${GAMMA}/public-search?q=${encodeURIComponent(q)}&limit_per_type=15`);
    if (r.error) return NextResponse.json({ error: r.error, q }, { status: 502 });
    const d = r.data as { events?: Record<string, unknown>[] } | null;
    const events = (d?.events || []).map((ev) => ({
      title: ev.title,
      slug: ev.slug,
      volume: ev.volume,
      liquidity: ev.liquidity,
      closed: ev.closed,
      startDate: ev.startDate,
      endDate: ev.endDate,
    }));
    return NextResponse.json({ query: q, count: events.length, events }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
  }

  return NextResponse.json({ error: 'provide ?slug=<event-slug> or ?q=<term>' }, { status: 400 });
}
