import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Bare-domain landing for `/`. Renders OG metadata (EN, the international face
// of the project) so that LLM crawlers and IM clients that don't follow
// redirects still see proper share previews. Real users get server-side
// redirected to their detected locale immediately — no visible UI flash.
// The blue post-signup screen lives at /welcome (not here).

export const metadata: Metadata = {
  title: 'AFOS Analytics — Global Electoral Political Risk Intelligence — Open-Source',
  description: 'Real-time global electoral political risk intelligence: cross-reference of prediction markets (Polymarket), polls from 17+ Brazilian institutes (TSE), and live news. Open-source, auditable. Brazil 2026 + 15 countries.',
  alternates: {
    canonical: 'https://www.afos-analytics.com/en',
    languages: {
      'pt-BR': 'https://www.afos-analytics.com/pt-BR',
      en: 'https://www.afos-analytics.com/en',
      es: 'https://www.afos-analytics.com/es',
      'x-default': 'https://www.afos-analytics.com/pt-BR',
    },
  },
  // Don't compete with /en in search results — canonical handles consolidation
  // but explicit noindex on this transitional page is belt-and-suspenders.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'AFOS Analytics — Global Electoral Political Risk Intelligence — Open-Source',
    description: 'Global electoral political risk intelligence: Polymarket × 17 polling institutes × live news, cross-referenced in real time. Brazil 2026 + 15 countries.',
    url: 'https://www.afos-analytics.com',
    siteName: 'AFOS Analytics',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://www.afos-analytics.com/brand/og-en-linkedin-1200x627.png', width: 1200, height: 627, alt: 'AFOS Analytics — Global Electoral Political Risk Intelligence — Open-Source' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFOS Analytics — Global Electoral Political Risk Intelligence — Open-Source',
    description: 'Global electoral political risk intelligence: Polymarket × 17 polling institutes × live news, cross-referenced in real time. Brazil 2026 + 15 countries.',
    images: ['https://www.afos-analytics.com/brand/og-en-linkedin-1200x627.png'],
  },
};

// Server-side redirect to detected locale based on Accept-Language header.
// No UI rendered for real users; the blue welcome screen lives at /welcome
// and only shows for visitors with a valid signup_session_id cookie.
function detectLocaleFromHeader(acceptLanguage: string | null): 'pt-BR' | 'en' | 'es' {
  if (!acceptLanguage) return 'en';
  const first = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || '';
  if (first.startsWith('pt')) return 'pt-BR';
  if (first.startsWith('es')) return 'es';
  return 'en';
}

export default async function RootPage() {
  const h = await headers();
  const locale = detectLocaleFromHeader(h.get('accept-language'));
  redirect(`/${locale}`);
}
