import { NextResponse } from 'next/server';

export const revalidate = 7200;

async function fetchPolymarket(slug: string) {
  try {
    const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`, { next: { revalidate: 7200 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.[0]) return null;
    const event = data[0];
    const markets = (event.markets || []).filter((m: any) => !m.closed && m.active).map((m: any) => {
      const prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : m.outcomePrices || [];
      return {
        question: m.question,
        yesPrice: prices[0] ? parseFloat(prices[0]) : 0,
        volume: m.volumeNum || 0,
      };
    }).filter((m: any) => m.yesPrice > 0.005);
    markets.sort((a: any, b: any) => b.yesPrice - a.yesPrice);
    return { title: event.title, volume: parseFloat(event.volume || '0'), markets: markets.slice(0, 5) };
  } catch { return null; }
}

export async function GET() {
  // Eleições futuras — excluídas as que já aconteceram em 2025
  const elections = [
    { country: 'Brasil', flag: '🇧🇷', date: 'Out 2026', slug: 'brazil-presidential-election', type: 'Presidencial', lat: -15.8, lng: -47.9 },
    { country: 'Colômbia', flag: '🇨🇴', date: '2026', slug: 'colombia-presidential-election', type: 'Presidencial', lat: 4.7, lng: -74.1 },
    { country: 'França', flag: '🇫🇷', date: '2027', slug: 'french-presidential-election-2027', type: 'Presidencial', lat: 48.9, lng: 2.3 },
    { country: 'Coreia do Sul', flag: '🇰🇷', date: '2027', slug: 'south-korea-presidential-election', type: 'Presidencial', lat: 37.6, lng: 127.0 },
    { country: 'México', flag: '🇲🇽', date: 'Jun 2027', slug: 'mexico-presidential-election', type: 'Presidencial', lat: 19.4, lng: -99.1 },
    { country: 'Argentina', flag: '🇦🇷', date: 'Out 2027', slug: 'argentina-presidential-election', type: 'Presidencial', lat: -34.6, lng: -58.4 },
    { country: 'Itália', flag: '🇮🇹', date: '2027', slug: 'italian-general-election', type: 'Parlamentar', lat: 41.9, lng: 12.5 },
    { country: 'Japão', flag: '🇯🇵', date: '2028', slug: 'japan-general-election', type: 'Parlamentar', lat: 35.7, lng: 139.7 },
    { country: 'EUA', flag: '🇺🇸', date: 'Nov 2028', slug: 'presidential-election-winner-2028', type: 'Presidencial', lat: 38.9, lng: -77.0 },
    { country: 'Índia', flag: '🇮🇳', date: '2029', slug: 'india-general-election', type: 'Parlamentar', lat: 28.6, lng: 77.2 },
    { country: 'Reino Unido', flag: '🇬🇧', date: '2029', slug: 'uk-general-election', type: 'Parlamentar', lat: 51.5, lng: -0.1 },
  ];

  const results = await Promise.all(
    elections.map(async (e) => {
      const poly = await fetchPolymarket(e.slug);
      return { ...e, polymarket: poly };
    })
  );

  return NextResponse.json({
    elections: results,
    updatedAt: new Date().toISOString(),
  });
}
