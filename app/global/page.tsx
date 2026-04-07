import dynamic from 'next/dynamic';
import { MOCK_ELECTIONS } from '../lib/mock-elections';
import { MAP_TOKENS } from '../lib/map-colors';

// D3 must not be SSR'd — dynamic import with ssr: false
const GlobalElectionMap = dynamic(
  () => import('../components/global-map/GlobalElectionMap').then(mod => mod.GlobalElectionMap),
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

export default function GlobalMapPage() {
  // In production, this will be fetched from /api/global-map
  // For now, using mock data
  const countries = MOCK_ELECTIONS;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: MAP_TOKENS.bg }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3"
        style={{ borderBottom: `1px solid ${MAP_TOKENS.border}` }}
      >
        <div className="flex items-center gap-3">
          <a
            href="/"
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
              Real-time prediction markets × election data — {countries.filter(c => c.status === 'live').length} live markets
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Countries tracked</div>
            <div className="font-bold text-sm" style={{ color: MAP_TOKENS.text }}>{countries.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Total volume</div>
            <div className="font-bold text-sm" style={{ color: MAP_TOKENS.primarySoft }}>
              ${(countries.reduce((s, c) => s + c.volumeUsd, 0) / 1_000_000).toFixed(1)}M
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
