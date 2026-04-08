'use client';

import type { MapTooltipData } from '../../types/global-map';
import { MAP_TOKENS, formatVolume } from '../../lib/map-colors';

interface Props {
  data: MapTooltipData | null;
}

export function GlobalMapTooltip({ data }: Props) {
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
          <span className="text-lg">{c.flag}</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: MAP_TOKENS.text }}>{c.countryName}</div>
            <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>{c.electionType} — {c.electionDate}</div>
          </div>
        </div>

        {isLive ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Líder</span>
              <span className="font-bold text-sm" style={{ color: MAP_TOKENS.primarySoft }}>{c.leadCandidate}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Probabilidade</span>
              <span className="font-bold text-sm" style={{ color: MAP_TOKENS.text }}>{c.probability}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>Volume</span>
              <span className="text-xs font-medium" style={{ color: MAP_TOKENS.textMuted }}>{formatVolume(c.volumeUsd)}</span>
            </div>
          </>
        ) : (
          <div className="text-xs" style={{ color: MAP_TOKENS.textMuted }}>
            {c.status === 'upcoming' ? 'Em breve — sem dados de mercado' : 'Encerrada'}
          </div>
        )}
      </div>
    </div>
  );
}
