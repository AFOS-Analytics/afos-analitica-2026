import type { Metadata } from 'next';

// Bare-domain landing for `/`. Renders OG metadata (EN, the international face
// of the project) so that LLM crawlers and IM clients that don't follow
// redirects still see proper share previews. Real users hit this for ~50ms
// before being bounced to their preferred locale via JS. The visible link
// list is the no-JS fallback — modern browsers all support JS.

export const metadata: Metadata = {
  title: 'AFOS Analytics — Electoral Political Risk Intelligence — Open-Source',
  description: 'Real-time electoral political risk intelligence: cross-reference of prediction markets (Polymarket), polls from 17+ Brazilian institutes (TSE), and live news. Open-source, auditable. Brazil 2026 + 14 countries.',
  alternates: {
    canonical: 'https://afos-analytics.com/en',
    languages: {
      'pt-BR': 'https://afos-analytics.com/pt-BR',
      en: 'https://afos-analytics.com/en',
      es: 'https://afos-analytics.com/es',
      'x-default': 'https://afos-analytics.com/en',
    },
  },
  // Don't compete with /en in search results — canonical handles consolidation
  // but explicit noindex on this transitional page is belt-and-suspenders.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'AFOS Analytics — Electoral Political Risk Intelligence — Open-Source',
    description: 'Electoral political risk intelligence: Polymarket × 17 polling institutes × live news, cross-referenced in real time. Brazil 2026 + 14 countries.',
    url: 'https://afos-analytics.com',
    siteName: 'AFOS Analytics',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/api/og?locale=en', width: 1200, height: 630, alt: 'AFOS Analytics — Electoral Political Risk Intelligence — Open-Source' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFOS Analytics — Electoral Political Risk Intelligence — Open-Source',
    description: 'Electoral political risk intelligence: Polymarket × 17 polling institutes × live news, cross-referenced in real time. Brazil 2026 + 14 countries.',
    images: ['/api/og?locale=en'],
  },
};

// D+7 hardening (Rule 5B): transition state. Detect language, show explicit
// "Redirecting to X — click to switch" UI for 8 seconds, then auto-redirect.
// Sapphire blue mode — full background AFOS primary color.
const TRANSITION_SCRIPT = `(function(){
  var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  var target = '/en';
  var label = 'English';
  if (lang.indexOf('pt') === 0) { target = '/pt-BR'; label = 'Português'; }
  else if (lang.indexOf('es') === 0) { target = '/es'; label = 'Español'; }
  var el = document.getElementById('redirect-status');
  if (el) {
    el.textContent = 'Redirecting to ' + label + ' in 8 seconds…';
  }
  setTimeout(function(){ window.location.replace(target); }, 8000);
})();`;

export default function RootPage() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        backgroundColor: '#0F52BA',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 8vw, 3rem) clamp(0.75rem, 4vw, 1.5rem)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 8vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          AFOS Analytics
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.125rem', margin: '0 0 0.35rem', lineHeight: 1.5, fontWeight: 500 }}>
          Electoral Political Risk Intelligence
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: 1.4, fontWeight: 400, letterSpacing: '0.02em' }}>
          Open-Source
        </p>

        {/* Rule 6: CTA primary above fold — Dashboard + AFOS Daily */}
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <a
            href="/en/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.875rem 1.75rem',
              backgroundColor: '#fff',
              color: '#0F52BA',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            View live dashboard →
          </a>
          <a
            href="/en/daily"
            style={{
              display: 'inline-block',
              padding: '0.875rem 1.75rem',
              backgroundColor: 'transparent',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              border: '2px solid rgba(255,255,255,0.9)',
            }}
          >
            Read AFOS Daily →
          </a>
        </div>

        {/* Rule 5B: explicit transition state with escape hatch (8s timeout) */}
        <p id="redirect-status" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', margin: '0 0 1.25rem' }}>
          Detecting language preference…
        </p>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)' }}>
          Switch manually:{' '}
          <a href="/pt-BR" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500 }}>Português</a>
          {' · '}
          <a href="/en" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500 }}>English</a>
          {' · '}
          <a href="/es" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500 }}>Español</a>
        </p>
      </div>
      <script dangerouslySetInnerHTML={{ __html: TRANSITION_SCRIPT }} />
    </main>
  );
}
