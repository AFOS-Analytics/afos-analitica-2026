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
      images: [{ url: `/api/og?locale=${locale}`, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [`/api/og?locale=${locale}`],
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
      // Title 60 chars (mobile-safe). Description 155 chars (Google snippet).
      title: 'Eleições Brasil 2026: Polymarket × Pesquisas | AFOS',
      description: 'Eleições Brasil 2026 ao vivo: Polymarket, pesquisas TSE de 17+ institutos (Quaest, AtlasIntel, Datafolha) e notícias cruzadas. Open-source.',
      path: '',
    },
    en: {
      title: 'Brazil 2026 Elections: Polymarket × Polls | AFOS',
      description: 'Brazil 2026 elections live: Polymarket odds, polls from 17+ institutes (Quaest, AtlasIntel, Datafolha) and news cross-referenced. Open-source.',
      path: '',
    },
    es: {
      title: 'Elecciones Brasil 2026: Polymarket × Encuestas | AFOS',
      description: 'Elecciones Brasil 2026 en vivo: Polymarket, encuestas de 17+ institutos (Quaest, AtlasIntel, Datafolha) y noticias cruzadas. Open-source.',
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
