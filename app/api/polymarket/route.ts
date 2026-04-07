import { NextResponse } from 'next/server';

export const revalidate = 7200;

const slugs = [
  'brazil-presidential-election',
  'brazil-presidential-election-first-round-2nd-place',
  'brazil-presidential-election-first-round-3rd-place',
  'any-brazil-stf-justice-removed-by-impeachment-before-2027',
  'next-brazil-senate-election-most-seats-won',
  'brazil-annual-inflation-2026',
];

const keys = ['presidential', 'secondPlace', 'thirdPlace', 'stf', 'senate', 'inflation'] as const;

// Validate slug format: only allow alphanumeric characters and hyphens
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

async function fetchEvent(slug: string) {
  if (!isValidSlug(slug)) {
    console.error(`[polymarket] Invalid slug rejected: ${slug}`);
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`, {
      next: { revalidate: 7200 },
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

        return {
          question: m.question,
          outcomePrices,
          outcomes,
          volumeNum: m.volumeNum,
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

export async function GET() {
  const results = await Promise.all(slugs.map(fetchEvent));
  const data: Record<string, unknown> = {};
  keys.forEach((key, i) => {
    data[key] = results[i];
  });
  return NextResponse.json({ ...data, fetchedAt: new Date().toISOString() });
}
