import { NextResponse } from 'next/server';

// Sem `export const revalidate`: com ele a rota virava ISR e o Cache-Control
// montado no fim desta função NUNCA chegava ao cliente (produção servia
// `public, max-age=0` e o mesmo fetchedAt por até 2h). Efeito colateral grave:
// o `s-maxage=60` do caminho degradado era código morto, e um payload degradado
// ficava preso na borda por 2 horas. Verificado em 24/Jul/2026.
// Ler searchParams já torna a rota dinâmica, então o header abaixo passa a valer.
export const dynamic = 'force-dynamic';

// Janela de frescor do caminho normal. 30 min é o que a página /data-sources
// promete ao leitor; antes eram 2h, ou seja, o texto público era falso.
const REVALIDATE_S = 1800;

const slugs = [
  'brazil-presidential-election',
  'brazil-presidential-election-first-round-2nd-place',
  'brazil-presidential-election-first-round-3rd-place',
  'any-brazil-stf-justice-removed-by-impeachment-before-2027',
  'next-brazil-senate-election-most-seats-won',
  'brazil-annual-inflation-2026',
];

const keys = ['presidential', 'secondPlace', 'thirdPlace', 'stf', 'senate', 'inflation'] as const;

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

async function fetchEvent(slug: string, fresh = false) {
  if (!isValidSlug(slug)) {
    console.error(`[polymarket] Invalid slug rejected: ${slug}`);
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`, {
      // `?fresh=1` ignora o cache de dados. Serve à trava de captura, que precisa
      // de DUAS leituras genuinamente independentes para decidir se o book está
      // estável. Sem isso a trava leria o mesmo cache duas vezes e aprovaria
      // qualquer snapshot, inclusive um capturado com spread largo.
      ...(fresh ? { cache: 'no-store' as const } : { next: { revalidate: REVALIDATE_S } }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data[0]) return null;
    const event = data[0];
    return {
      title: event.title,
      slug: event.slug,
      markets: (event.markets || []).map((m: Record<string, unknown>) => {
        let outcomePrices = m.outcomePrices;
        let outcomes = m.outcomes;

        if (typeof outcomePrices === 'string') {
          try {
            outcomePrices = JSON.parse(outcomePrices as string);
          } catch (e) {
            console.error(`[polymarket] Failed to parse outcomePrices for slug=${slug}:`, e);
            outcomePrices = [];
          }
        }

        if (typeof outcomes === 'string') {
          try {
            outcomes = JSON.parse(outcomes as string);
          } catch (e) {
            console.error(`[polymarket] Failed to parse outcomes for slug=${slug}:`, e);
            outcomes = [];
          }
        }

        // Hardening firmed 30/Mai pós-EVAL D+15: shape validation pós-parse.
        // Polymarket gamma-api ocasionalmente retorna objeto ao invés de array após mudanças de schema.
        // Dashboard ficaria silenciosamente quebrado (PollsSection / CandidatesSection .map em não-array).
        if (!Array.isArray(outcomePrices)) {
          console.error(`[polymarket] outcomePrices not array after parse for slug=${slug}, got:`, typeof outcomePrices);
          outcomePrices = [];
        }
        if (!Array.isArray(outcomes)) {
          console.error(`[polymarket] outcomes not array after parse for slug=${slug}, got:`, typeof outcomes);
          outcomes = [];
        }

        return {
          question: m.question,
          outcomePrices,
          outcomes,
          volumeNum: m.volumeNum,
          liquidityNum: m.liquidityNum,
          active: m.active,
          closed: m.closed,
        };
      }),
    };
  } catch (error) {
    console.error(`[polymarket] Error fetching event slug=${slug}:`, error);
    return null;
  }
}

async function fetchFromProdProxy() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('https://www.afos-analytics.com/api/polymarket', {
      next: { revalidate: 7200 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[polymarket] Error fetching from prod proxy:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.has('fresh');
  if (process.env.NODE_ENV === 'development') {
    const proxied = await fetchFromProdProxy();
    if (proxied) {
      return NextResponse.json(proxied);
    }
  }

  const results = await Promise.all(slugs.map(slug => fetchEvent(slug, fresh)));
  const data: Record<string, unknown> = {};
  keys.forEach((key, i) => {
    data[key] = results[i];
  });
  // Surface a degraded flag when some/all upstream events failed so callers
  // (dashboard cards, refresh-elections cron) can distinguish a stale-cache
  // empty result from "data missing today" and decide whether to alert.
  const failed = results.filter(r => r === null).length;
  const degraded = failed > 0;
  return NextResponse.json(
    {
      ...data,
      fetchedAt: failed < slugs.length ? new Date().toISOString() : null,
      degraded,
      failedCount: failed,
    },
    {
      headers: {
        'Cache-Control': fresh
          ? 'no-store'
          : degraded
            ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=600'
            : `public, max-age=0, s-maxage=${REVALIDATE_S}, stale-while-revalidate=86400`,
      },
    }
  );
}
