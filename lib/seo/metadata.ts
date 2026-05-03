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
      title: 'AFOS Analytics — Eleições Brasil 2026: Polymarket × Pesquisas TSE em Tempo Real',
      description: 'Eleições Brasil 2026 ao vivo: odds de mercados de previsão (Polymarket), pesquisas eleitorais de 17+ institutos (Quaest, AtlasIntel, Datafolha) e cobertura jornalística cruzados em tempo real. Open-source, fontes públicas auditáveis. 14 países cobertos.',
      path: '',
    },
    en: {
      title: 'AFOS Analytics — Brazil 2026 Elections: Polymarket × Polls in Real Time',
      description: 'Brazil 2026 elections live: prediction market odds (Polymarket), polls from 17+ institutes (Quaest, AtlasIntel, Datafolha) and news coverage cross-referenced in real time. Open-source, auditable public sources. 14 countries covered.',
      path: '',
    },
    es: {
      title: 'AFOS Analytics — Elecciones Brasil 2026: Polymarket × Encuestas en Tiempo Real',
      description: 'Elecciones Brasil 2026 en vivo: odds de mercados de predicción (Polymarket), encuestas de 17+ institutos (Quaest, AtlasIntel, Datafolha) y cobertura periodística cruzados en tiempo real. Open-source, fuentes públicas auditables. 14 países cubiertos.',
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
