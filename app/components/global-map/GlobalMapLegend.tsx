'use client';

import { MAP_TOKENS } from '../../lib/map-colors';

export function GlobalMapLegend() {
  const stops = [
    { label: 'No data', color: '#121f36' },
    { label: '< 30%', color: '#132044' },
    { label: '30-50%', color: '#1e3a7a' },
    { label: '50-70%', color: '#2150a8' },
    { label: '> 70%', color: '#2563eb' },
    { label: '> 85%', color: '#3b82f6' },
  ];

  return (
    <div
      className="absolute bottom-4 left-4 rounded-lg px-4 py-3 z-10"
      style={{
        background: `${MAP_TOKENS.card}ee`,
        border: `1px solid ${MAP_TOKENS.border}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="text-xs font-semibold mb-2" style={{ color: MAP_TOKENS.textMuted }}>
        Lead candidate probability
      </div>
      <div className="flex items-center gap-1">
        {stops.map(s => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <div className="w-8 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-[9px]" style={{ color: MAP_TOKENS.textMuted }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
