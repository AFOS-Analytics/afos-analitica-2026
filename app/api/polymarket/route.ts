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

async function fetchEvent(slug: string) {
  try {
    const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`, {
      next: { revalidate: 7200 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data[0]) return null;
    const event = data[0];
    return {
      title: event.title,
      slug: event.slug,
      markets: (event.markets || []).map((m: Record<string, unknown>) => ({
        question: m.question,
        outcomePrices: typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices as string) : m.outcomePrices,
        outcomes: typeof m.outcomes === 'string' ? JSON.parse(m.outcomes as string) : m.outcomes,
        volumeNum: m.volumeNum,
        active: m.active,
        closed: m.closed,
      })),
    };
  } catch {
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
