import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { organizationSchema, webAppSchema, datasetSchema, combineSchemas } from '../lib/seo/schema';
import "./globals.css";

const inter = { className: "font-sans antialiased" };

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://afos-analytics.com'),
  title: "AFOS Analytics — Inteligência Eleitoral Global em Tempo Real",
  description: "Plataforma global de inteligência eleitoral: Polymarket (mercados de previsão com dinheiro real) + pesquisas de +17 institutos + notícias ao vivo + análises estratégicas. Eleições Brasil 2026 e mundo.",
  alternates: {
    canonical: 'https://afos-analytics.com/pt-BR',
    languages: {
      'pt-BR': 'https://afos-analytics.com/pt-BR',
      'en': 'https://afos-analytics.com/en',
      'es': 'https://afos-analytics.com/es',
      'x-default': 'https://afos-analytics.com/pt-BR',
    },
  },
  openGraph: {
    title: "AFOS Analytics — Inteligência Eleitoral Global",
    description: "Mercados de previsão + pesquisas + notícias + análises em tempo real. Eleições Brasil 2026 e mundo.",
    url: "https://afos-analytics.com",
    siteName: "AFOS Analytics",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AFOS Analytics — Inteligência Eleitoral Global em Tempo Real',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFOS Analytics — Inteligência Eleitoral Global",
    description: "Polymarket + 17 institutos de pesquisa + notícias ao vivo. Eleições Brasil 2026 e mundo.",
    images: ['/opengraph-image'],
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
  other: {
    'geo.region': 'BR',
    'geo.placename': 'Brasil',
    'content-language': 'pt-BR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F52BA" />
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
