'use client'
import type { MarketTrajectory } from '../../lib/country-data'

// Paleta viva e legível em AMBOS os temas (fundo branco e fundo Sapphire). Evita azuis escuros que somem no azul.
const PALETTE = ['#FF5C8A', '#3FA9F5', '#FFA63D', '#34D399', '#B98BFF', '#FBBF24']

const L: Record<string, { caption: string; vol: string }> = {
  'pt-BR': { caption: 'Probabilidade implícita (Polymarket)', vol: 'volume total' },
  en: { caption: 'Implied probability (Polymarket)', vol: 'total volume' },
  es: { caption: 'Probabilidad implícita (Polymarket)', vol: 'volumen total' },
}

export function OddsTrajectoryChart({ trajectory, volume, locale, isBlue }: {
  trajectory: MarketTrajectory
  volume: number
  locale: string
  isBlue: boolean
}) {
  const { dates, series } = trajectory
  if (!dates?.length || !series?.length) return null

  const W = 800, H = 300, M = { t: 14, r: 14, b: 26, l: 32 }
  const plotW = W - M.l - M.r, plotH = H - M.t - M.b
  const t0 = Date.parse(dates[0]), t1 = Date.parse(dates[dates.length - 1])
  const X = (d: string) => M.l + (t1 === t0 ? 0 : (Date.parse(d) - t0) / (t1 - t0)) * plotW
  const Y = (p: number) => M.t + (1 - Math.max(0, Math.min(100, p)) / 100) * plotH

  const grid = isBlue ? 'rgba(147,197,253,0.16)' : '#eceef3'
  const axisText = isBlue ? 'rgba(191,219,254,0.7)' : '#9aa3b2'
  const lab = L[locale] || L['en']
  const fmtVol = volume >= 1e9 ? 'US$ ' + (volume / 1e9).toFixed(1) + 'B' : 'US$ ' + (volume / 1e6).toFixed(volume >= 1e8 ? 0 : 1) + 'M'
  const fmtPct = (p: number) => (p < 1 ? '<1%' : Math.min(99, Math.round(p)) + '%')
  const fmtDate = (d: string) => {
    try { return new Date(d + 'T00:00:00Z').toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : locale, { month: 'short', year: '2-digit', timeZone: 'UTC' }) } catch { return d }
  }

  return (
    <div className="mt-5">
      <p className={`text-[11px] uppercase tracking-wide mb-1.5 ${isBlue ? 'text-blue-300/70' : 'text-gray-500'}`}>
        {lab.caption} · {lab.vol} <strong className={`font-extrabold ${isBlue ? 'text-blue-100' : 'text-primary'}`}>{fmtVol}</strong>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" role="img" aria-label={lab.caption}>
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={M.l} y1={Y(p)} x2={W - M.r} y2={Y(p)} stroke={grid} strokeWidth={1} />
            <text x={M.l - 6} y={Y(p) + 3} textAnchor="end" fontSize={10} fill={axisText}>{p}</text>
          </g>
        ))}
        {series.map((s, i) => (
          <polyline
            key={s.name}
            fill="none"
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={dates.map((d, j) => `${X(d).toFixed(1)},${Y(s.pct[j] ?? 0).toFixed(1)}`).join(' ')}
          />
        ))}
        <text x={M.l} y={H - 6} fontSize={10} fill={axisText}>{fmtDate(dates[0])}</text>
        <text x={W - M.r} y={H - 6} fontSize={10} fill={axisText} textAnchor="end">{fmtDate(dates[dates.length - 1])}</text>
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
        {series.map((s, i) => (
          <span key={s.name} className={`inline-flex items-center gap-1.5 text-xs ${isBlue ? 'text-blue-100/90' : 'text-gray-600'}`}>
            <span className="inline-block h-1.5 w-3.5 rounded-sm" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
            {s.name} <strong className="font-semibold">{fmtPct(s.pct[s.pct.length - 1] ?? 0)}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}
