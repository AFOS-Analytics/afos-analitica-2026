import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Static fallback when ImageResponse fails (rare, but possible during edge runtime
// hiccups). Unfurl previews are critical during launch — better to serve a slightly
// generic image than a 500 to social media crawlers.
const STATIC_FALLBACK_URL = 'https://afos-analytics.com/brand/og-en-linkedin-1200x627.png'

const COPY = {
  'pt-BR': {
    subtitle: 'Inteligência Eleitoral Open-Source',
    chips: ['Mercado de previsão', '17 Institutos', 'Notícias ao Vivo', 'Análises'],
    footer: 'Construído e validado durante o ciclo eleitoral 2026 em países na América do Sul + 14 países. Análises diárias.',
  },
  en: {
    subtitle: 'Open-Source Electoral Intelligence',
    chips: ['Prediction market', '17 Institutes', 'Live News', 'Analysis'],
    footer: 'Built and validated during the 2026 electoral cycle across South American countries + 14 countries. Daily analyses.',
  },
  es: {
    subtitle: 'Inteligencia Electoral Open-Source',
    chips: ['Mercado de predicción', '17 Institutos', 'Noticias en Vivo', 'Análisis'],
    footer: 'Construido y validado durante el ciclo electoral 2026 en países de América del Sur + 14 países. Análisis diarios.',
  },
} as const

type Locale = keyof typeof COPY

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get('locale')
  const locale: Locale = (localeParam === 'en' || localeParam === 'es') ? localeParam : 'pt-BR'
  const copy = COPY[locale]

  try {
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
        <div style={{ fontSize: 22, marginTop: 32, fontWeight: 600, maxWidth: 1000, lineHeight: 1.4, textAlign: 'center', display: 'flex' }}>
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
          'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (err) {
    console.error('[og] ImageResponse failed, redirecting to static fallback:', err)
    return NextResponse.redirect(STATIC_FALLBACK_URL, { status: 307 })
  }
}
