'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MAP_TOKENS } from '../../lib/map-colors';
import { MOCK_ELECTIONS } from '../../lib/mock-elections';
import type { CountryMarketSummary } from '../../types/global-map';
import { formatVolume } from '../../lib/map-colors';

const GlobalElectionMap = dynamic(
  () => import('../../components/global-map/GlobalElectionMap').then(mod => mod.GlobalElectionMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center" style={{ background: MAP_TOKENS.bg }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3" style={{ borderColor: MAP_TOKENS.primary }} />
          <p className="text-sm" style={{ color: MAP_TOKENS.textMuted }}>Loading map...</p>
        </div>
      </div>
    ),
  }
);

function parseMapPayload(data: Record<string, unknown>): CountryMarketSummary[] {
  if (!data.c || !Array.isArray(data.c)) return [];
  return (data.c as Record<string, unknown>[]).map((c) => ({
    iso3: c.iso3 as string,
    countryName: c.n as string,
    flag: c.f as string,
    electionDate: c.d as string,
    electionType: c.t as string,
    probability: (c.p as number) || 0,
    leadCandidate: (c.lc as string) || '—',
    volumeUsd: (c.v as number) || 0,
    marketCount: (c.mc as number) || 1,
    status: ((c.s as string) || 'no-data') as CountryMarketSummary['status'],
    candidates: ((c.cs as Array<Record<string, unknown>>) || []).map((cd) => ({
      name: cd.n as string,
      probability: cd.p as number,
      volumeUsd: cd.v as number,
    })),
  }));
}

export default function GlobalMapPage() {
  const [countries, setCountries] = useState<CountryMarketSummary[]>([]);
  const [source, setSource] = useState<'loading' | 'polymarket' | 'mock'>('loading');

  useEffect(() => {
    fetch('/api/global-map')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.c?.length > 0) {
          setCountries(parseMapPayload(data));
          setSource('polymarket');
        } else {
          setCountries(MOCK_ELECTIONS);
          setSource('mock');
        }
      })
      .catch(() => {
        setCountries(MOCK_ELECTIONS);
        setSource('mock');
      });
  }, []);

  const liveCount = countries.filter(c => c.status === 'live').length;
  const totalVolume = countries.reduce((s, c) => s + (c.volumeUsd || 0), 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: MAP_TOKENS.bg }}>
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3"
        style={{ borderBottom: `1px solid ${MAP_TOKENS.border}` }}
      >
        <div className="flex items-center gap-3">
          <a
            href=".."
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: MAP_TOKENS.textMuted, border: `1px solid ${MAP_TOKENS.border}` }}
          >
            ← Dashboard
          </a>
          <div>
            <h1 className="font-bold text-base sm:text-lg" style={{ color: MAP_TOKENS.text }}>
              Global Election Intelligence
            </h1>
            <p className="text-[10px] sm:text-xs" style={{ color: MAP_TOKENS.textMuted }}>
              Real-time prediction markets × election data
              {source === 'polymarket' && <span> — {liveCount} live markets</span>}
              {source === 'mock' && <span className="ml-2 text-orange-400">(demo mode)</span>}
              {source === 'loading' && <span className="ml-2 text-yellow-500">loading...</span>}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Countries</div>
            <div className="font-bold text-sm" style={{ color: MAP_TOKENS.text }}>{countries.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Volume</div>
            <div className="font-bold text-sm" style={{ color: MAP_TOKENS.primarySoft }}>
              {formatVolume(totalVolume)}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {countries.length > 0 ? (
          <GlobalElectionMap countries={countries} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: MAP_TOKENS.bg }}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: MAP_TOKENS.primary }} />
          </div>
        )}
      </main>

      <footer
        className="px-4 sm:px-6 py-2 text-center"
        style={{ borderTop: `1px solid ${MAP_TOKENS.border}` }}
      >
        <p className="text-[10px]" style={{ color: MAP_TOKENS.textMuted }}>
          AFOS Analytics — Data: Polymarket prediction markets — Updated continuously
        </p>
      </footer>
    </div>
  );
}
