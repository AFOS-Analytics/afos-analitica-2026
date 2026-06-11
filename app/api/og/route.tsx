import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Static fallback when ImageResponse fails (rare, but possible during edge runtime
// hiccups). Unfurl previews are critical during launch — better to serve a slightly
// generic image than a 500 to social media crawlers.
const STATIC_FALLBACK_URL = 'https://www.afos-analytics.com/brand/og-en-linkedin-1200x627.png'

const COPY = {
  'pt-BR': {
    subtitle: 'Inteligência de Risco Político Eleitoral Global',
    openSource: 'Open-Source',
    chips: ['Mercado de previsão', '17 Institutos', 'Notícias ao Vivo', 'Análises'],
    footer: 'Construído e validado durante o ciclo eleitoral 2026 em países na América do Sul + 15 países. Análises diárias.',
  },
  en: {
    subtitle: 'Global Electoral Political Risk Intelligence',
    openSource: 'Open-Source',
    chips: ['Prediction market', '17 Institutes', 'Live News', 'Analysis'],
    footer: 'Built and validated during the 2026 electoral cycle across South American countries + 15 countries. Daily analyses.',
  },
  es: {
    subtitle: 'Inteligencia Global de Riesgo Político Electoral',
    openSource: 'Open-Source',
    chips: ['Mercado de predicción', '17 Institutos', 'Noticias en Vivo', 'Análisis'],
    footer: 'Construido y validado durante el ciclo electoral 2026 en países de América del Sur + 15 países. Análisis diarios.',
  },
} as const

type Locale = keyof typeof COPY

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const localeParam = sp.get('locale')
  const locale: Locale = (localeParam === 'en' || localeParam === 'es') ? localeParam : 'pt-BR'
  const copy = COPY[locale]

  // Dataset/open-data OG mode: /api/og?title=...&line=...&tag=...
  const title = sp.get('title')
  if (title) {
    const line = sp.get('line') || 'Prediction market × polls — the spread is the signal.'
    const tag = sp.get('tag') || 'Open dataset · CC BY 4.0'
    const chips = (sp.get('chips') || 'Reproducible · EN · ES · PT').split('·').map((c) => c.trim())
    const cc = (sp.get('cc') || '').replace(/[^a-z]/g, '') // 2-letter country code → /flags/{cc}.svg
    try {
      return new ImageResponse(
        (
          <div style={{ background: 'linear-gradient(135deg, #0F52BA 0%, #0a3d8f 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif', color: 'white', padding: '64px 72px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, fontWeight: 700, letterSpacing: '0.5px', opacity: 0.85 }}>
              <span style={{ display: 'flex' }}>AFOS ANALYTICS</span>
              <span style={{ display: 'flex', opacity: 0.8 }}>{tag}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cc && (
                <img
                  src={`${request.nextUrl.origin}/flags/${cc}.svg`}
                  width={88}
                  height={59}
                  style={{ borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 14px rgba(0,0,0,0.3)' }}
                />
              )}
              <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, display: 'flex', maxWidth: 1040 }}>{title}</div>
              <div style={{ fontSize: 30, opacity: 0.92, marginTop: 22, lineHeight: 1.35, display: 'flex', maxWidth: 1000 }}>{line}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                {chips.map((c) => (
                  <span key={c} style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 999, padding: '6px 16px', opacity: 0.85 }}>{c}</span>
                ))}
              </div>
              <span style={{ display: 'flex', opacity: 0.6 }}>huggingface.co/AFOS-Analytics1</span>
            </div>
          </div>
        ),
        { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } }
      )
    } catch (err) {
      console.error('[og] dataset ImageResponse failed:', err)
      return NextResponse.redirect(STATIC_FALLBACK_URL, { status: 307 })
    }
  }

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
        <div style={{ fontSize: 32, opacity: 0.9, textAlign: 'center', maxWidth: 1000, lineHeight: 1.4, display: 'flex' }}>
          {copy.subtitle}
        </div>
        <div style={{ fontSize: 22, opacity: 0.75, marginTop: 8, textAlign: 'center', display: 'flex', fontWeight: 500, letterSpacing: '0.5px' }}>
          {copy.openSource}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 20, display: 'flex', gap: 24 }}>
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
