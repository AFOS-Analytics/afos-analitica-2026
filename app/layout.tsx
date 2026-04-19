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
  title: "AFOS Analytics — Global Political Risk Intelligence Observatory",
  description: "Open-source observatory cross-referencing prediction markets (Polymarket, Kalshi), electoral polls (TSE + 100+ institutes) and real-time news across 14+ countries. Built for Brazil 2026. Apache 2.0.",
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
    title: "AFOS Analytics — Global Political Risk Intelligence Observatory",
    description: "Open-source observatory cross-referencing prediction markets, electoral polls and real-time news across 14+ countries. Built for Brazil 2026.",
    url: "https://afos-analytics.com",
    siteName: "AFOS Analytics",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AFOS Analytics — Global Political Risk Intelligence Observatory',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFOS Analytics — Global Political Risk Intelligence Observatory",
    description: "Open-source: prediction markets × electoral polls × real-time news. 14+ countries. Built for Brazil 2026. Apache 2.0.",
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
