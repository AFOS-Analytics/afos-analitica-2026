import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { organizationSchema, webAppSchema } from '../../../lib/seo/schema';
import { JsonLd } from '../JsonLd';
import "../../globals.css";

/**
 * O DOCUMENTO (`<html>`, `<head>`, `<body>`) comum aos layouts raiz do site.
 *
 * 🔴 12/Nov/2026: até aqui havia UM layout raiz, app/layout.tsx, que lia o idioma
 * com `await headers()`. Só isso tornava o site INTEIRO dinâmico: nenhuma página
 * de /[idioma] cacheava, `revalidate` e `generateStaticParams` não tinham efeito
 * e toda visita respondia `no-store`. Agora há dois layouts raiz:
 *   - app/[locale]/layout.tsx, que tira o idioma de `params` (estático);
 *   - app/(raiz)/layout.tsx, para `/` e `/welcome`, que já eram dinâmicas.
 * Os dois montam o documento por aqui, para não haver duas cópias da `<head>`.
 * Trocar de um layout raiz para o outro recarrega a página inteira, e isso só
 * acontece entre a raiz e as páginas com idioma.
 */

// Real Inter from Google Fonts (subsetted, self-hosted by Next). Replaces
// the prior placeholder `{ className: 'font-sans antialiased' }` which fell
// back to Arial, looked like weekend project to design-savvy reviewers.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewportRaiz: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadataRaiz: Metadata = {
  metadataBase: new URL('https://www.afos-analytics.com'),
  title: "AFOS Analytics, Inteligência de Risco Político Eleitoral Global, Open-Source",
  description: "Inteligência de risco político eleitoral global em tempo real: cruzamento entre Polymarket, +17 institutos brasileiros e cobertura jornalística. Open-source, fontes públicas auditáveis. Brasil 2026 e 15 países.",
  // Canonical/alternates removidos do root layout para evitar que TODAS as
  // rotas (PT-BR/EN/ES) declarem canonical=PT-BR (Google trataria EN/ES como
  // duplicatas). buildMetadata() em [locale]/layout aplica canonical correto
  // por locale via PAGE_SEO + alternates.languages cruzado.
  openGraph: {
    title: "AFOS Analytics, Inteligência de Risco Político Eleitoral Global, Open-Source",
    description: "Inteligência de risco político eleitoral global em tempo real: Polymarket, pesquisas e cobertura jornalística cruzados. Brasil 2026 e 15 países.",
    url: "https://www.afos-analytics.com",
    siteName: "AFOS Analytics",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: 'https://www.afos-analytics.com/brand/og-pt-linkedin-1200x627.png',
        width: 1200,
        height: 627,
        alt: 'AFOS Analytics, Inteligência de Risco Político Eleitoral Global, Open-Source',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFOS Analytics, Inteligência de Risco Político Eleitoral Global, Open-Source",
    description: "Inteligência de risco político eleitoral global: Polymarket, 17 institutos e notícias cruzados em tempo real. Open-source. Brasil 2026 e 15 países.",
    images: ['https://www.afos-analytics.com/brand/og-pt-linkedin-1200x627.png'],
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

export function DocumentoRaiz({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F52BA" />
        <meta name="google-site-verification" content="9Fyuh0VcblSnhBhJADUisYYzPG24CuRieNWPyPhJyxE" />
        {/* Schema.org: Organization + WebApplication. Os dois descrevem o SITE
            inteiro e por isso pertencem à raiz.
            🔴 `datasetSchema()` SAIU daqui em 19/Ago/2026: injetado no layout raiz,
            ele fazia toda página do site declarar o dataset do BRASIL. O painel
            das midterms era indexado como sendo sobre o dado brasileiro, e a
            página da França servia dois Dataset sem @id, um da França e outro do
            Brasil, sem nada dizer qual era o assunto. Ele agora é emitido só em
            /[idioma]/data-sources, que é a página que fala do dado. */}
        <JsonLd data={[organizationSchema(), webAppSchema()]} />
      </head>
      <body className={`${inter.className} bg-white text-dark`}>{children}<Analytics /><SpeedInsights /></body>
    </html>
  );
}
