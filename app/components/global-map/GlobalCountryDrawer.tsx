'use client';

import type { CountryMarketSummary } from '../../types/global-map';
import { MAP_TOKENS, formatVolume } from '../../lib/map-colors';
import { useLocale } from '../../i18n/context';

const DRAWER_L: Record<string, { close: string; live: string; upcoming: string; closed: string; candidates: string; noData: string; scheduledFor: string; source: string; sumMarkets: (n: number) => string }> = {
  'pt-BR': { close: 'Fechar painel', live: 'Mercado ao Vivo', upcoming: 'Em Breve', closed: 'Encerrada', candidates: 'Candidatos', noData: 'Sem dados de mercado disponíveis.', scheduledFor: 'Eleição prevista para', source: 'Dados: Polymarket (mercados de previsão com dinheiro real), atualizado continuamente', sumMarkets: (n) => `soma de ${n} mercados` },
  en: { close: 'Close panel', live: 'Live Market', upcoming: 'Upcoming', closed: 'Completed', candidates: 'Candidates', noData: 'No market data available.', scheduledFor: 'Election scheduled for', source: 'Source: Polymarket (real-money prediction markets), updated continuously', sumMarkets: (n) => `sum of ${n} markets` },
  es: { close: 'Cerrar panel', live: 'Mercado en Vivo', upcoming: 'Próximamente', closed: 'Finalizada', candidates: 'Candidatos', noData: 'Sin datos de mercado disponibles.', scheduledFor: 'Elección prevista para', source: 'Fuente: Polymarket (mercados de predicción con dinero real), actualizado continuamente', sumMarkets: (n) => `suma de ${n} mercados` },
}

interface Props {
  country: CountryMarketSummary | null;
  onClose: () => void;
}

export function GlobalCountryDrawer({ country, onClose }: Props) {
  const locale = useLocale();
  const L = DRAWER_L[locale] || DRAWER_L['en'];
  if (!country) return null;

  const c = country;
  const isLive = c.status === 'live' && c.candidates.length > 0;
  const maxProb = isLive ? Math.max(...c.candidates.map(cd => cd.probability)) : 1;

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 h-full w-full sm:w-[420px] overflow-y-auto"
        style={{ background: MAP_TOKENS.bg }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-5 flex items-center justify-between"
          style={{
            background: MAP_TOKENS.card,
            borderBottom: `1px solid ${MAP_TOKENS.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <img src={`/flags/${c.flag}.svg`} alt={c.countryName} width={28} height={19} className="rounded-sm object-cover" style={{ width: 28, height: 19 }} />
            <div>
              <h2 className="font-bold text-lg" style={{ color: MAP_TOKENS.text }}>{c.countryName}</h2>
              <p className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>{c.electionType}, {c.electionDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none px-2 py-1 rounded hover:bg-white/10 transition-colors"
            style={{ color: MAP_TOKENS.textMuted }}
            aria-label={L.close}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: c.status === 'live' ? 'rgba(37,99,235,0.15)' : 'rgba(148,163,184,0.1)',
                color: c.status === 'live' ? MAP_TOKENS.primarySoft : MAP_TOKENS.textMuted,
              }}
            >
              {c.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
              {c.status === 'live' ? L.live : c.status === 'upcoming' ? L.upcoming : L.closed}
            </span>
            {c.volumeUsd > 0 && (
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>
                Vol: {formatVolume(c.volumeUsd)}{(c.marketCount ?? 0) > 1 ? ` (${L.sumMarkets(c.marketCount ?? 0)})` : ''}
              </span>
            )}
          </div>

          {/* Candidates */}
          {isLive ? (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: MAP_TOKENS.textMuted }}>
                {L.candidates}
              </h3>
              {c.candidates.map((cd, i) => (
                <div key={cd.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: i === 0 ? MAP_TOKENS.primary : 'rgba(148,163,184,0.1)',
                          color: i === 0 ? '#fff' : MAP_TOKENS.textMuted,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium" style={{ color: MAP_TOKENS.text }}>{cd.name}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: i === 0 ? MAP_TOKENS.primarySoft : MAP_TOKENS.text }}>
                      {cd.probability}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(cd.probability / (maxProb * 1.1)) * 100}%`,
                        background: i === 0
                          ? `linear-gradient(90deg, ${MAP_TOKENS.primary}, ${MAP_TOKENS.primarySoft})`
                          : 'rgba(148,163,184,0.2)',
                      }}
                    />
                  </div>
                  <div className="text-right mt-0.5">
                    <span className="text-[10px]" style={{ color: MAP_TOKENS.textMuted }}>
                      {formatVolume(cd.volumeUsd)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-lg p-6 text-center"
              style={{ background: MAP_TOKENS.card, border: `1px solid ${MAP_TOKENS.border}` }}
            >
              <p className="text-sm" style={{ color: MAP_TOKENS.textMuted }}>
                {L.noData}
              </p>
              <p className="text-xs mt-1" style={{ color: MAP_TOKENS.textMuted }}>
                {L.scheduledFor} {c.electionDate}
              </p>
            </div>
          )}

          {/* Source */}
          <div className="pt-4" style={{ borderTop: `1px solid ${MAP_TOKENS.border}` }}>
            <p className="text-[10px]" style={{ color: MAP_TOKENS.textMuted }}>
              {L.source}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
