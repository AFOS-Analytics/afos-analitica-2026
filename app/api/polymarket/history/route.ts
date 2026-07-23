import { NextResponse } from 'next/server';

/**
 * Proxy GENÉRICO da série histórica de preços da Polymarket (CLOB), server-side
 * na Vercel/EUA. Fase-2 do backfill multi-país.
 *
 * Complementa /api/polymarket/lookup: o lookup traz o snapshot + os clobTokenIds
 * (via gamma-api); ESTE traz a SÉRIE TEMPORAL de preços de um token (via CLOB
 * data-api, clob.polymarket.com/prices-history), que o gamma NÃO expõe.
 *
 * Existe porque clob.polymarket.com é bloqueado no DNS de certas redes (BR), mas
 * o servidor Vercel alcança. Somente leitura de dado público de mercado.
 *
 * Segurança (anti-SSRF): base + endpoint CLOB FIXOS; só valores validados passam.
 *   - token:    clobTokenId, restrito a [0-9]{40,90} (não injeta host).
 *   - interval: allowlist (max/1m/1w/1d/6h/1h).
 *   - fidelity: inteiro em minutos, 1..43200 (default 1440 = diário).
 *
 *   GET /api/polymarket/history?token=<clobTokenId>[&interval=max][&fidelity=1440]
 *     → { token, interval, fidelity, points, history: [{ t, date, p }], fetchedAt }
 */

export const revalidate = 3600;

const CLOB = 'https://clob.polymarket.com';
const INTERVALS = new Set(['max', '1m', '1w', '1d', '6h', '1h']);

function isValidToken(token: string): boolean {
  return /^[0-9]{40,90}$/.test(token);
}

async function clobFetch(url: string, timeoutMs = 15000): Promise<{ data?: unknown; error?: string }> {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const intervalParam = searchParams.get('interval') || 'max';
  const fidelityParam = searchParams.get('fidelity');

  if (!token) {
    return NextResponse.json({ error: 'provide ?token=<clobTokenId>' }, { status: 400 });
  }
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'invalid token (only digits, 40-90 chars)' }, { status: 400 });
  }
  if (!INTERVALS.has(intervalParam)) {
    return NextResponse.json({ error: `invalid interval (one of ${[...INTERVALS].join(', ')})` }, { status: 400 });
  }
  const fidelity = fidelityParam ? Number(fidelityParam) : 1440;
  if (!Number.isInteger(fidelity) || fidelity < 1 || fidelity > 43200) {
    return NextResponse.json({ error: 'invalid fidelity (integer minutes, 1-43200)' }, { status: 400 });
  }

  const url = `${CLOB}/prices-history?market=${token}&interval=${intervalParam}&fidelity=${fidelity}`;
  const r = await clobFetch(url);
  if (r.error) return NextResponse.json({ error: r.error, token }, { status: 502 });

  // CLOB retorna { history: [{ t: <unix seconds>, p: <0..1> }, ...] }
  const raw = r.data as { history?: Array<{ t?: number; p?: number }> } | null;
  const hist = Array.isArray(raw?.history) ? raw!.history : [];
  const history = hist
    .filter((pt) => typeof pt?.t === 'number' && typeof pt?.p === 'number')
    .map((pt) => ({
      t: pt.t,
      date: new Date((pt.t as number) * 1000).toISOString(),
      p: pt.p,
    }));

  return NextResponse.json(
    {
      token,
      interval: intervalParam,
      fidelity,
      points: history.length,
      history,
      fetchedAt: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
