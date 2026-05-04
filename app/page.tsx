import type { Metadata } from 'next';

// Bare-domain landing for `/`. Renders OG metadata (EN, the international face
// of the project) so that LLM crawlers and IM clients that don't follow
// redirects still see proper share previews. Real users hit this for ~50ms
// before being bounced to their preferred locale via JS. The visible link
// list is the no-JS fallback — modern browsers all support JS.

export const metadata: Metadata = {
  title: 'AFOS Analytics — Open-Source Electoral Intelligence',
  description: 'Real-time cross-reference of prediction markets (Polymarket), polls from 17+ Brazilian institutes (TSE), and live news. Open-source, auditable. Brazil 2026 + 14 countries.',
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
    title: 'AFOS Analytics — Open-Source Electoral Intelligence',
    description: 'Polymarket × 17 polling institutes × live news, cross-referenced in real time. Brazil 2026 + 14 countries.',
    url: 'https://afos-analytics.com',
    siteName: 'AFOS Analytics',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/api/og?locale=en', width: 1200, height: 630, alt: 'AFOS Analytics — Open-Source Electoral Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFOS Analytics — Open-Source Electoral Intelligence',
    description: 'Polymarket × 17 polling institutes × live news, cross-referenced in real time. Brazil 2026 + 14 countries.',
    images: ['/api/og?locale=en'],
  },
};

const REDIRECT_SCRIPT = `(function(){
  var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  var target = '/en';
  if (lang.indexOf('pt') === 0) target = '/pt-BR';
  else if (lang.indexOf('es') === 0) target = '/es';
  window.location.replace(target);
})();`;

export default function RootPage() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '4rem 2rem', color: '#333' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AFOS Analytics</h1>
      <p style={{ color: '#555' }}>Inteligência Eleitoral Open-Source · Open-Source Electoral Intelligence · Inteligencia Electoral Open-Source</p>
      <p style={{ marginTop: '0.5rem', color: '#666' }}>Redirecionando · Redirecting · Redirigiendo…</p>
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <a href="/pt-BR">Português</a>
        {' · '}
        <a href="/en">English</a>
        {' · '}
        <a href="/es">Español</a>
      </p>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
    </main>
  );
}
