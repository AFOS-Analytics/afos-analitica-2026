/**
 * OG Image Route Handler — locale-aware via ?locale=X
 * Substitui app/opengraph-image.tsx que não respeitava searchParams em Edge.
 *
 * Uso: /api/og?locale=en (ou pt-BR, es). Default: pt-BR.
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const COPY = {
  'pt-BR': {
    subtitle: 'Inteligência Eleitoral Open-Source',
    chips: ['Polymarket', '17 Institutos', 'Notícias ao Vivo', 'Análises'],
    footer: 'Brasil 2026 + 14 países',
  },
  en: {
    subtitle: 'Open-Source Electoral Intelligence',
    chips: ['Polymarket', '17 Institutes', 'Live News', 'Analysis'],
    footer: 'Brazil 2026 + 14 countries',
  },
  es: {
    subtitle: 'Inteligencia Electoral Open-Source',
    chips: ['Polymarket', '17 Institutos', 'Noticias en Vivo', 'Análisis'],
    footer: 'Brasil 2026 + 14 países',
  },
} as const

type Locale = keyof typeof COPY

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get('locale')
  const locale: Locale = (localeParam === 'en' || localeParam === 'es') ? localeParam : 'pt-BR'
  const copy = COPY[locale]

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F52BA 0%, #0a3d8f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-2px', marginBottom: 16, display: 'flex' }}>
          AFOS Analytics
        </div>
        <div style={{ fontSize: 32, opacity: 0.9, textAlign: 'center', maxWidth: 900, lineHeight: 1.4, display: 'flex' }}>
          {copy.subtitle}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 24, display: 'flex', gap: 24 }}>
          {copy.chips.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <div style={{ fontSize: 28, marginTop: 40, fontWeight: 700, display: 'flex' }}>
          {copy.footer}
        </div>
        <div style={{ position: 'absolute', bottom: 40, fontSize: 18, opacity: 0.5, display: 'flex' }}>
          afos-analytics.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Cache CDN 1h, navegador 0 (revalidação imediata se locale muda)
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}
