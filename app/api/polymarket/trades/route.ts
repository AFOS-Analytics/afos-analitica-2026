import { NextResponse } from 'next/server';

/**
 * Proxy de leitura das NEGOCIAÇÕES e dos DETENTORES de um contrato da Polymarket
 * (data-api), server-side na Vercel/EUA. Criado em 25/Out/2026, noite da apuração
 * do 2º turno, para gravar o movimento das carteiras ao lado do TSE.
 *
 * Existe pelo mesmo motivo de /api/polymarket/lookup e /history: o domínio
 * polymarket.com é bloqueado no DNS de certas redes (BR), e o servidor Vercel
 * alcança. Somente leitura de dado público de mercado (a blockchain é pública).
 *
 * Segurança (anti-SSRF): bases e endpoints FIXOS; só valores validados passam.
 *   - market: slug do contrato, restrito a [a-z0-9-] (não injeta host);
 *   - tipo:   allowlist (trades | holders);
 *   - limit:  inteiro 1..500.
 * O conditionId sai da gamma-api pelo slug, no servidor, e nunca vem do cliente.
 *
 *   GET /api/polymarket/trades?market=<market-slug>[&tipo=trades|holders][&limit=200]
 *     → { market, conditionId, tipo, fetchedAt, count, data }
 *
 * Sem cache: é série ao vivo.
 */

export const dynamic = 'force-dynamic';

const GAMMA = 'https://gamma-api.polymarket.com';
const DATA = 'https://data-api.polymarket.com';
const TIPOS = new Set(['trades', 'holders']);

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length <= 140;
}

async function getJson(url: string, timeoutMs = 12000): Promise<{ data?: unknown; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) return { error: `upstream HTTP ${res.status}` };
    return { data: await res.json() };
  } catch (error) {
    return { error: String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market');
  const tipo = searchParams.get('tipo') || 'trades';
  const limitParam = Number(searchParams.get('limit') || '200');

  if (!market || !isValidSlug(market)) {
    return NextResponse.json({ error: 'provide ?market=<market-slug> (only [a-z0-9-])' }, { status: 400 });
  }
  if (!TIPOS.has(tipo)) {
    return NextResponse.json({ error: `invalid tipo (one of ${[...TIPOS].join(', ')})` }, { status: 400 });
  }
  if (!Number.isInteger(limitParam) || limitParam < 1 || limitParam > 500) {
    return NextResponse.json({ error: 'invalid limit (integer 1..500)' }, { status: 400 });
  }

  const g = await getJson(`${GAMMA}/markets?slug=${market}&limit=1`);
  if (g.error) return NextResponse.json({ error: g.error, market }, { status: 502 });
  const arr = Array.isArray(g.data) ? (g.data as Record<string, unknown>[]) : [];
  const conditionId = typeof arr[0]?.conditionId === 'string' ? (arr[0].conditionId as string) : '';
  if (!/^0x[0-9a-fA-F]{64}$/.test(conditionId)) {
    return NextResponse.json({ error: 'market not found or without conditionId', market }, { status: 404 });
  }

  const url = tipo === 'trades'
    ? `${DATA}/trades?market=${conditionId}&limit=${limitParam}&takerOnly=false`
    : `${DATA}/holders?market=${conditionId}&limit=${Math.min(limitParam, 100)}`;
  const r = await getJson(url);
  if (r.error) return NextResponse.json({ error: r.error, market, conditionId, tipo }, { status: 502 });

  const data = r.data;
  const count = Array.isArray(data) ? data.length : null;
  return NextResponse.json(
    { market, conditionId, tipo, fetchedAt: new Date().toISOString(), count, data },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
