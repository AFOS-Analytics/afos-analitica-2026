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
  title: "AFOS Analytics — Plataforma Inédita no Mundo | Inteligência Eleitoral Global e Preditiva",
  description: "Plataforma inédita no mundo: cruzamento de mercados de previsão (Polymarket) com pesquisas eleitorais de +17 institutos em tempo real. Notícias ao vivo, análises estratégicas. Eleições Brasil 2026 e cobertura de 14 países.",
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
    title: "AFOS Analytics — Plataforma Inédita | Inteligência Eleitoral Global e Preditiva",
    description: "Plataforma inédita no mundo: cruzamento de mercados de previsão com pesquisas eleitorais em tempo real. Eleições Brasil 2026 e cobertura de 14 países.",
    url: "https://afos-analytics.com",
    siteName: "AFOS Analytics",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AFOS Analytics — Plataforma Inédita no Mundo | Inteligência Eleitoral Global e Preditiva',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFOS Analytics — Plataforma Inédita | Inteligência Eleitoral Global e Preditiva",
    description: "Plataforma inédita no mundo: Polymarket + 17 institutos de pesquisa + notícias ao vivo. Eleições Brasil 2026 e cobertura de 14 países.",
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
  // geo tags moved to lib/seo/metadata.ts buildMetadata() per locale
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
