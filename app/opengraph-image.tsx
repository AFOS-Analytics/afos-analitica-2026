import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AFOS Analytics — Open-Source Electoral Intelligence';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Per-locale text. Defaults to PT-BR if locale missing/invalid.
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
} as const;

type Locale = keyof typeof COPY;

export default function Image({ searchParams }: { searchParams?: { locale?: string } } = {}) {
  // Per-locale OG image: /opengraph-image?locale=en or /opengraph-image?locale=es.
  // Defaults to pt-BR. Fixes prior issue where shares of /en/* and /es/* pages
  // were preview-cached as Portuguese-only (mismatched language signal).
  const localeParam = searchParams?.locale as string | undefined;
  const locale: Locale = (localeParam === 'en' || localeParam === 'es') ? localeParam : 'pt-BR';
  const copy = COPY[locale];

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
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            opacity: 0.5,
            display: 'flex',
          }}
        >
          afos-analytics.com
        </div>
      </div>
    ),
    { ...size }
  );
}
