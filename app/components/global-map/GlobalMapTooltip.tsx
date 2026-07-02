'use client';

import type { MapTooltipData } from '../../types/global-map';
import { MAP_TOKENS, formatVolume } from '../../lib/map-colors';
import { useLocale } from '../../i18n/context';

const TT_L: Record<string, { leader: string; probability: string; upcoming: string; closed: string }> = {
  'pt-BR': { leader: 'Líder', probability: 'Probabilidade', upcoming: 'Em breve, sem dados de mercado', closed: 'Encerrada' },
  en: { leader: 'Leader', probability: 'Probability', upcoming: 'Upcoming, no market data', closed: 'Completed' },
  es: { leader: 'Líder', probability: 'Probabilidad', upcoming: 'Próximamente, sin datos de mercado', closed: 'Finalizada' },
}

interface Props {
  data: MapTooltipData | null;
}

export function GlobalMapTooltip({ data }: Props) {
  const locale = useLocale();
  const L = TT_L[locale] || TT_L['en'];
  if (!data) return null;

  const { x, y, country: c } = data;
  const isLive = c.status === 'live' && c.candidates.length > 0;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-150"
      style={{
        left: x + 12,
        top: y - 8,
        opacity: 1,
      }}
    >
      <div
        className="rounded-lg px-4 py-3 min-w-[220px] max-w-[280px]"
        style={{
          background: MAP_TOKENS.card,
          border: `1px solid ${MAP_TOKENS.border}`,
          boxShadow: MAP_TOKENS.glow,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <img src={`/flags/${c.flag}.svg`} alt={c.countryName} width={22} height={15} loading="lazy" decoding="async" className="rounded-sm object-cover" style={{ width: 22, height: 15 }} />
          <div>
            <div className="font-semibold text-sm" style={{ color: MAP_TOKENS.text }}>{c.countryName}</div>
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>{c.electionType}, {c.electionDate}</div>
          </div>
        </div>

        {isLive ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>{L.leader}</span>
              <span className="font-bold text-sm" style={{ color: MAP_TOKENS.primarySoft }}>{c.leadCandidate}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>{L.probability}</span>
              <span className="font-bold text-sm" style={{ color: MAP_TOKENS.text }}>{c.probability}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Volume</span>
              <span className="text-xs font-medium" style={{ color: MAP_TOKENS.textMuted }}>{formatVolume(c.volumeUsd)}{c.marketCount && c.marketCount > 1 ? ` (${c.marketCount} mkts)` : ''}</span>
            </div>
          </>
        ) : (
          <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>
            {c.status === 'upcoming' ? L.upcoming : L.closed}
          </div>
        )}
      </div>
    </div>
  );
}
