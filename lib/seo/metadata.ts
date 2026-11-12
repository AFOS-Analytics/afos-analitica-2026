/**
 * SEO Metadata Helper
 *
 * Gera metadata por locale para qualquer página.
 * Server-side only, usado em generateMetadata() do App Router.
 */

import type { Metadata } from 'next';
import type { Locale } from '../i18n/config';

const BASE_URL = 'https://www.afos-analytics.com';

const LOCALES: Locale[] = ['pt-BR', 'en', 'es'];

interface PageSeo {
  title: string;
  description: string;
  path: string; // sem locale prefix (ex: '' para home, 'global' para mapa)
  /**
   * Cartão social próprio da página, caminho a partir da raiz do site.
   * Sem ele a página cai no cartão genérico por idioma, que é compartilhado
   * com TODAS as outras: dois links divulgados no mesmo dia saem com a mesma
   * imagem no feed. Página com número próprio deve declarar o seu.
   */
  image?: string;
}

/**
 * Bloco OpenGraph + Twitter padrão da plataforma (imagem LinkedIn 1200x627 por locale).
 * Fonte única reusada por buildMetadata e pelos generateMetadata de country/election/
 * institutional/for-investors, evita copiar o mesmo objeto OG em cada página.
 */
export function socialMeta(locale: string, opts: { title: string; description: string; url: string; image?: string }): Pick<Metadata, 'openGraph' | 'twitter'> {
  const ogImage = opts.image || `${BASE_URL}/brand/og-${locale === 'pt-BR' ? 'pt' : locale}-linkedin-1200x627.png`;
  const OG_LOCALE: Record<string, string> = { 'pt-BR': 'pt_BR', en: 'en_US', es: 'es_ES' };
  const ogLocale = OG_LOCALE[locale] || 'pt_BR';
  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.url,
      siteName: 'AFOS Analytics',
      locale: ogLocale,
      // og:locale:alternate — declara as outras versões de idioma para scrapers sociais (LinkedIn/FB)
      alternateLocale: Object.values(OG_LOCALE).filter((v) => v !== ogLocale),
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 627, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [ogImage],
    },
  };
}

/**
 * Gera metadata completa com hreflang cruzado, canonical, OG e Twitter.
 */
export function buildMetadata(seo: PageSeo, locale: Locale): Metadata {
  const url = `${BASE_URL}/${locale}${seo.path ? '/' + seo.path : ''}`;

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE_URL}/${loc}${seo.path ? '/' + seo.path : ''}`;
  }
  languages['x-default'] = `${BASE_URL}/pt-BR${seo.path ? '/' + seo.path : ''}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages,
    },
    ...socialMeta(locale, { title: seo.title, description: seo.description, url, image: seo.image ? `${BASE_URL}${seo.image}` : undefined }),
    other: {
      'geo.region': locale === 'pt-BR' ? 'BR' : locale === 'es' ? 'LATAM' : 'Global',
      'geo.placename': locale === 'pt-BR' ? 'Brasil' : locale === 'es' ? 'America Latina' : 'Global',
      'content-language': locale,
    },
  };
}

/** SEO strings por locale para cada página */
export const PAGE_SEO: Record<string, Record<Locale, PageSeo>> = {
  home: {
    'pt-BR': {
      // Title 60 chars (mobile-safe). Description 155 chars (Google snippet).
      // 12/Nov/2026: saiu "Brasil 2026 ao vivo". O Brasil está encerrado desde
      // 01/Nov e os EUA desde 09/Nov, ambos com relatório final; ao vivo só a
      // França 2027. O texto descreve a plataforma, não um país.
      title: 'Mercados de Previsão × Pesquisas × Imprensa | AFOS',
      description: 'Mercados de previsão lado a lado com pesquisas e imprensa. França 2027 ao vivo. Brasil 2026 e EUA 2026 encerrados, com relatório final. Open-source.',
      path: '',
    },
    en: {
      title: 'Prediction Markets × Polls × Press | AFOS',
      description: 'Prediction markets side by side with polls and press. France 2027 live. Brazil 2026 and US 2026 closed, with final reports. Open-source.',
      path: '',
    },
    es: {
      title: 'Mercados de Predicción × Encuestas × Prensa | AFOS',
      description: 'Mercados de predicción junto a encuestas y prensa. Francia 2027 en vivo. Brasil 2026 y EE. UU. 2026 cerrados, con informe final. Open-source.',
      path: '',
    },
  },
  global: {
    'pt-BR': {
      title: 'Mapa Global de Eleições, AFOS Analytics',
      description: 'Mapa interativo com eleições ao vivo em 15 países. Mercados de previsão Polymarket e calendário eleitoral global.',
      path: 'global',
    },
    en: {
      title: 'Global Election Map, AFOS Analytics',
      description: 'Interactive map with live elections in 15 countries. Polymarket prediction markets and global election calendar.',
      path: 'global',
    },
    es: {
      title: 'Mapa Global de Elecciones, AFOS Analytics',
      description: 'Mapa interactivo con elecciones en vivo en 15 países. Mercados de predicción Polymarket y calendario electoral global.',
      path: 'global',
    },
  },
};
