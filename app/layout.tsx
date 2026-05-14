import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { organizationSchema, webAppSchema, datasetSchema, combineSchemas } from '../lib/seo/schema';
import "./globals.css";

// Real Inter from Google Fonts (subsetted, self-hosted by Next). Replaces
// the prior placeholder `{ className: 'font-sans antialiased' }` which fell
// back to Arial — looked like weekend project to design-savvy reviewers.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.afos-analytics.com'),
  title: "AFOS Analytics | Polymarket, Pesquisas e Notícias Eleitorais Cruzados",
  description: "Cruzamento em tempo real entre mercados de previsão (Polymarket), pesquisas eleitorais de +17 institutos brasileiros e cobertura jornalística. Open-source, fontes públicas auditáveis. Eleições Brasil 2026 e 14 países.",
  // Canonical/alternates removidos do root layout para evitar que TODAS as
  // rotas (PT-BR/EN/ES) declarem canonical=PT-BR (Google trataria EN/ES como
  // duplicatas). buildMetadata() em [locale]/layout aplica canonical correto
  // por locale via PAGE_SEO + alternates.languages cruzado.
  openGraph: {
    title: "AFOS Analytics. Inteligência Eleitoral Open-Source",
    description: "Cruzamento em tempo real entre Polymarket, pesquisas eleitorais e cobertura jornalística. Eleições Brasil 2026 e 14 países.",
    url: "https://www.afos-analytics.com",
    siteName: "AFOS Analytics",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: '/api/og?locale=pt-BR',
        width: 1200,
        height: 630,
        alt: 'AFOS Analytics. Inteligência Eleitoral Open-Source',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFOS Analytics. Inteligência Eleitoral Open-Source",
    description: "Polymarket, 17 institutos de pesquisa e notícias cruzados em tempo real. Open-source. Brasil 2026 e 14 países.",
    images: ['/api/og?locale=pt-BR'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // geo tags moved to lib/seo/metadata.ts buildMetadata() per locale
};

// Read locale from middleware-injected header so <html lang> matches the
// route. Defaults to pt-BR for routes that don't pass through the locale
// matcher (api, _next, static).
import { headers } from 'next/headers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const localeFromMiddleware = headersList.get('x-pathname-locale') || 'pt-BR';
  return (
    <html lang={localeFromMiddleware}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F52BA" />
        <meta name="google-site-verification" content="9Fyuh0VcblSnhBhJADUisYYzPG24CuRieNWPyPhJyxE" />
        {/* Schema.org: Organization + WebApplication + Dataset (static, safe) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: combineSchemas(organizationSchema(), webAppSchema(), datasetSchema()),
          }}
        />
      </head>
      <body className={`${inter.className} bg-white text-dark`}>{children}<Analytics /></body>
    </html>
  );
}
