import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MAP_TOKENS } from '../../lib/map-colors';
import { MOCK_ELECTIONS } from '../../lib/mock-elections';
import type { CountryMarketSummary } from '../../types/global-map';
import { isValidLocale } from '../../../lib/i18n/config';
import { buildMetadata, PAGE_SEO } from '../../../lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata(PAGE_SEO.global[locale], locale);
}

// D3 must not be SSR'd — dynamic import with ssr: false
const GlobalElectionMap = dynamic(
  () => import('../../components/global-map/GlobalElectionMap').then(mod => mod.GlobalElectionMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center" style={{ background: MAP_TOKENS.bg }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3" style={{ borderColor: MAP_TOKENS.primary }} />
          <p className="text-sm" style={{ color: MAP_TOKENS.textMuted }}>Initializing map engine...</p>
        </div>
      </div>
    ),
  }
);

// ISR: revalidate every 5 minutes
export const revalidate = 300;

/**
 * Server-side data fetch with fallback to mock data.
 * Runs on Vercel edge, NOT in the browser.
 */
async function getMapData(): Promise<{ countries: CountryMarketSummary[]; stale: boolean; source: string }> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://www.afos-analytics.com`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/global-map`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data = await res.json();
    if (!data.c || data.c.length === 0) throw new Error('Empty dataset');

    // Map optimized payload back to CountryMarketSummary shape
    const countries: CountryMarketSummary[] = data.c.map((c: Record<string, unknown>) => ({
      iso3: c.iso3 as string,
      countryName: c.n as string,
      flag: c.f as string,
      electionDate: c.d as string,
      electionType: c.t as string,
      probability: (c.p as number) || 0,
      leadCandidate: (c.lc as string) || '—',
      volumeUsd: (c.v as number) || 0,
      status: (c.s as string) || 'no-data',
      candidates: ((c.cs as Array<Record<string, unknown>>) || []).map((cd) => ({
        name: cd.n as string,
        probability: cd.p as number,
        volumeUsd: cd.v as number,
      })),
    }));

    return { countries, stale: !!data.stale, source: 'polymarket' };
  } catch (error) {
    console.error('[global/page] API fetch failed, using mock data:', error);
    return { countries: MOCK_ELECTIONS, stale: true, source: 'mock' };
  }
}

export default async function GlobalMapPage() {
  const { countries, stale, source } = await getMapData();

  const liveCount = countries.filter(c => c.status === 'live').length;
  const totalVolume = countries.reduce((s, c) => s + (c.volumeUsd || 0), 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: MAP_TOKENS.bg }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3"
        style={{ borderBottom: `1px solid ${MAP_TOKENS.border}` }}
      >
        <div className="flex items-center gap-3">
          <a
            href=".."
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: MAP_TOKENS.textMuted, border: `1px solid ${MAP_TOKENS.border}` }}
            aria-label="Voltar ao dashboard"
          >
            ← Dashboard
          </a>
          <div>
            <h1 className="font-bold text-base sm:text-lg" style={{ color: MAP_TOKENS.text }}>
              Global Election Intelligence
            </h1>
            <p className="text-[10px] sm:text-xs" style={{ color: MAP_TOKENS.textMuted }}>
              Real-time prediction markets × election data — {liveCount} live markets
              {stale && <span className="ml-2 text-yellow-500">(stale data)</span>}
              {source === 'mock' && <span className="ml-2 text-orange-400">(demo mode)</span>}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Countries</div>
            <div className="font-bold text-sm" style={{ color: MAP_TOKENS.text }}>{countries.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Volume</div>
            <div className="font-bold text-sm" style={{ color: MAP_TOKENS.primarySoft }}>
              ${totalVolume >= 1_000_000 ? (totalVolume / 1_000_000).toFixed(1) + 'M' : (totalVolume / 1_000).toFixed(0) + 'K'}
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        <GlobalElectionMap countries={countries} />
      </main>

      {/* Footer */}
      <footer
        className="px-4 sm:px-6 py-2 text-center"
        style={{ borderTop: `1px solid ${MAP_TOKENS.border}` }}
      >
        <p className="text-[10px]" style={{ color: MAP_TOKENS.textMuted }}>
          AFOS Analytics — Data: Polymarket prediction markets — Not affiliated with Polymarket — Updated continuously
        </p>
      </footer>
    </div>
  );
}
