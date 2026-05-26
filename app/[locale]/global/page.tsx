'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { MOCK_ELECTIONS } from '../../lib/mock-elections';
import type { CountryMarketSummary } from '../../types/global-map';
import { useTranslation } from '../../i18n/context';
import { GlobalContent } from '../../components/global-section/GlobalContent';

type Locale = 'pt-BR' | 'en' | 'es';
const LOCALE_LABELS: Record<Locale, string> = { 'pt-BR': 'BR', en: 'EN', es: 'ES' };
const LOCALE_NAMES: Record<Locale, string> = { 'pt-BR': 'Português', en: 'English', es: 'Español' };

function LangSwitcher({ current, onSelect }: { current: Locale; onSelect: (l: Locale) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" />
        </svg>
        <span className="text-[13px] font-bold text-dark tracking-wide">{LOCALE_LABELS[current]}</span>
      </div>

      {open && (
        <div className="absolute top-10 right-0 z-50 bg-white border border-light-border rounded-xl p-1 min-w-[120px] shadow-lg">
          {(['pt-BR', 'en', 'es'] as Locale[]).map((loc) => (
            <div
              key={loc}
              onClick={() => { onSelect(loc); setOpen(false); }}
              className={`px-3 py-2 cursor-pointer rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors ${
                current === loc
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:bg-light-bg'
              }`}
            >
              <span>{LOCALE_LABELS[loc]}</span>
              <span className="font-normal text-[11px] opacity-60">{LOCALE_NAMES[loc]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

export default function GlobalPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = ((params?.locale as string) || 'pt-BR') as Locale;

  const [countries, setCountries] = useState<CountryMarketSummary[]>([]);
  const [source, setSource] = useState<'loading' | 'polymarket' | 'mock'>('loading');
  const [expandedElection, setExpandedElection] = useState<number | null>(null);

  const handleLocaleChange = (next: Locale) => {
    if (next === locale) return;
    const newPath = pathname.replace(/^\/(pt-BR|en|es)/, `/${next}`) || `/${next}/global`;
    router.push(newPath);
  };

  useEffect(() => {
    fetch('/api/global-map')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.c?.length > 0) {
          const apiData = parseMapPayload(data);
          const mockMap = new Map<string, CountryMarketSummary>();
          MOCK_ELECTIONS.forEach(m => mockMap.set(m.iso3, m));
          const merged = apiData.map(c => {
            if ((c.status as string) === 'no-data' || (c.probability === 0 && c.candidates.length === 0)) {
              const mock = mockMap.get(c.iso3);
              if (mock && mock.probability > 0) return mock;
            }
            return c;
          });
          for (const mock of MOCK_ELECTIONS) {
            if (!merged.find(c => c.iso3 === mock.iso3)) {
              merged.push(mock);
            }
          }
          setCountries(merged);
          setSource('polymarket');
        } else {
          setCountries([...MOCK_ELECTIONS]);
          setSource('mock');
        }
      })
      .catch(() => {
        setCountries([...MOCK_ELECTIONS]);
        setSource('mock');
      });
  }, []);

  const liveCount = countries.filter(c => c.status === 'live').length;
  const totalVolume = countries.reduce((s, c) => s + (c.volumeUsd || 0), 0);
  const volStr = totalVolume > 1e6 ? `$${(totalVolume / 1e6).toFixed(1)}M` : `$${(totalVolume / 1e3).toFixed(0)}K`;

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-light-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href={`/${locale}`} className="font-extrabold text-sm sm:text-lg tracking-tight text-primary">
            AFOS Analytics
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-3 text-xs font-semibold mr-2">
              <a href={`/${locale}/daily`} className="text-gray-600 hover:text-primary transition-colors">Daily</a>
              <span className="text-gray-300">·</span>
              <a href={`/${locale}/tradeoff`} className="text-gray-600 hover:text-primary transition-colors">Tradeoff</a>
              <span className="text-gray-300">·</span>
              <span className="text-primary">Global</span>
            </div>
            <LangSwitcher current={locale} onSelect={handleLocaleChange} />
            <a href={`/${locale}/dashboard`} className="text-[11px] sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              {t('home.backToDashboard') || '← Dashboard'}
            </a>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-b from-primary to-primary/90 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
                {t('modal.globalPageTitle')}
              </h1>
              <p className="text-sm sm:text-base text-white/85 max-w-2xl">
                Real-time prediction markets × election data
                {source === 'polymarket' && <span> — {liveCount} live markets</span>}
                {source === 'mock' && <span className="ml-2 text-orange-200">(demo mode)</span>}
                {source === 'loading' && <span className="ml-2 text-yellow-200">loading...</span>}
              </p>
            </div>
            <div className="flex gap-6 sm:text-right">
              <div>
                <div className="text-[11px] text-white/70 uppercase tracking-wider">Countries</div>
                <div className="text-xl sm:text-2xl font-bold">{countries.length}</div>
              </div>
              <div>
                <div className="text-[11px] text-white/70 uppercase tracking-wider">Volume</div>
                <div className="text-xl sm:text-2xl font-bold">{volStr}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <GlobalContent
          mapData={countries}
          expandedElection={expandedElection}
          setExpandedElection={setExpandedElection}
          variant="page"
        />
      </main>

      <footer className="border-t border-light-border py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center text-[11px] text-gray-500">
          AFOS Analytics — Data: Polymarket prediction markets — Updated continuously
        </div>
      </footer>
    </div>
  );
}
