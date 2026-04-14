/**
 * SEO Metadata Helper
 *
 * Gera metadata por locale para qualquer página.
 * Server-side only — usado em generateMetadata() do App Router.
 */

import type { Metadata } from 'next';
import type { Locale } from '../i18n/config';

const BASE_URL = 'https://afos-analytics.com';

const LOCALES: Locale[] = ['pt-BR', 'en', 'es'];

interface PageSeo {
  title: string;
  description: string;
  path: string; // sem locale prefix (ex: '' para home, 'global' para mapa)
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
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: 'AFOS Analytics',
      locale: locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_US' : 'pt_BR',
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/opengraph-image'],
    },
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
      title: 'AFOS Analytics — Inteligência Eleitoral Global em Tempo Real',
      description: 'Plataforma global de inteligência eleitoral: Polymarket + pesquisas de +17 institutos + notícias ao vivo. Eleições Brasil 2026 e mundo.',
      path: '',
    },
    en: {
      title: 'AFOS Analytics — Global Electoral Intelligence in Real Time',
      description: 'Global electoral intelligence platform: Polymarket + polls from 17+ institutes + live news. Brazil 2026 elections and world.',
      path: '',
    },
    es: {
      title: 'AFOS Analytics — Inteligencia Electoral Global en Tiempo Real',
      description: 'Plataforma global de inteligencia electoral: Polymarket + encuestas de +17 institutos + noticias en vivo. Elecciones Brasil 2026 y mundo.',
      path: '',
    },
  },
  global: {
    'pt-BR': {
      title: 'Mapa Global de Eleições — AFOS Analytics',
      description: 'Mapa interativo com eleições ao vivo em 14+ países. Mercados de previsão Polymarket e calendário eleitoral global.',
      path: 'global',
    },
    en: {
      title: 'Global Election Map — AFOS Analytics',
      description: 'Interactive map with live elections in 14+ countries. Polymarket prediction markets and global election calendar.',
      path: 'global',
    },
    es: {
      title: 'Mapa Global de Elecciones — AFOS Analytics',
      description: 'Mapa interactivo con elecciones en vivo en 14+ países. Mercados de predicción Polymarket y calendario electoral global.',
      path: 'global',
    },
  },
};
