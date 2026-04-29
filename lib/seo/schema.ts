/**
 * Schema.org / JSON-LD Generator
 *
 * Gera structured data para Google e mecanismos generativos.
 * Cada função retorna um objeto JSON-LD pronto para <script>.
 */

import type { Locale } from '../i18n/config';

const BASE_URL = 'https://afos-analytics.com';

/** Organization — identidade da marca */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AFOS Analytics',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: 'Global electoral intelligence platform combining prediction markets, polls, and real-time news analysis.',
    foundingDate: '2026',
    sameAs: [
      'https://github.com/AFOS-Analytics/afos-analitica-2026',
    ],
  };
}

/** WebSite — search action e multilíngue */
export function websiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AFOS Analytics',
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale === 'es' ? 'es' : locale === 'en' ? 'en' : 'pt-BR',
    description: locale === 'en'
      ? 'Global electoral intelligence in real time'
      : locale === 'es'
        ? 'Inteligencia electoral global en tiempo real'
        : 'Inteligência eleitoral global em tempo real',
  };
}

/** WebApplication — o produto em si */
export function webAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AFOS Analytics',
    url: BASE_URL,
    applicationCategory: 'NewsApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'AFOS Analytics', url: BASE_URL },
    inLanguage: ['pt-BR', 'en', 'es'],
    isAccessibleForFree: true,
  };
}

/** BreadcrumbList — navegação estruturada */
export function breadcrumbSchema(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}/${locale}${item.path ? '/' + item.path : ''}`,
    })),
  };
}

/** FAQPage — para GEO (mecanismos generativos) */
export function faqSchema(locale: Locale) {
  const faqs: Record<Locale, { q: string; a: string }[]> = {
    'pt-BR': [
      { q: 'O que é o AFOS Analytics?', a: 'AFOS Analytics é uma plataforma global de inteligência eleitoral que cruza mercados de previsão com dinheiro real (Polymarket), pesquisas eleitorais de +17 institutos, notícias ao vivo e análises estratégicas em tempo real.' },
      { q: 'O AFOS Analytics é gratuito?', a: 'Sim. O acesso à plataforma é completamente gratuito, sem necessidade de cadastro. O projeto é open source.' },
      { q: 'O que são mercados de previsão?', a: 'Mercados de previsão são plataformas onde pessoas apostam dinheiro real em eventos futuros. Diferente de pesquisas de opinião, refletem onde as pessoas colocam seu dinheiro — historicamente mais precisos que pesquisas tradicionais.' },
      { q: 'Quais eleições o AFOS monitora?', a: 'O AFOS monitora eleições em 14+ países, incluindo Brasil 2026, EUA, França, Alemanha, Reino Unido, Canadá, Austrália, Coreia do Sul, Colômbia, Chile, entre outros.' },
      { q: 'Como os dados são atualizados?', a: 'Os dados de mercados de previsão são atualizados a cada 30 minutos via cron job. Notícias são atualizadas a cada 30 minutos. Análises são atualizadas manualmente com cruzamento de fontes.' },
    ],
    en: [
      { q: 'What is AFOS Analytics?', a: 'AFOS Analytics is a global electoral intelligence platform that cross-references real-money prediction markets (Polymarket), polls from 17+ institutes, live news, and strategic analysis in real time.' },
      { q: 'Is AFOS Analytics free?', a: 'Yes. Access to the platform is completely free, with no registration required. The project is open source.' },
      { q: 'What are prediction markets?', a: 'Prediction markets are platforms where people bet real money on future events. Unlike opinion polls, they reflect where people put their money — historically more accurate than traditional polls.' },
      { q: 'Which elections does AFOS monitor?', a: 'AFOS monitors elections in 14+ countries, including Brazil 2026, USA, France, Germany, UK, Canada, Australia, South Korea, Colombia, Chile, and more.' },
      { q: 'How is the data updated?', a: 'Prediction market data is updated every 30 minutes via cron job. News is updated every 30 minutes. Analysis is updated manually with source cross-referencing.' },
    ],
    es: [
      { q: '¿Qué es AFOS Analytics?', a: 'AFOS Analytics es una plataforma global de inteligencia electoral que cruza mercados de predicción con dinero real (Polymarket), encuestas de +17 institutos, noticias en vivo y análisis estratégico en tiempo real.' },
      { q: '¿AFOS Analytics es gratuito?', a: 'Sí. El acceso a la plataforma es completamente gratuito, sin necesidad de registro. El proyecto es open source.' },
      { q: '¿Qué son los mercados de predicción?', a: 'Los mercados de predicción son plataformas donde las personas apuestan dinero real en eventos futuros. A diferencia de las encuestas, reflejan dónde la gente pone su dinero — históricamente más precisos que las encuestas tradicionales.' },
      { q: '¿Qué elecciones monitorea AFOS?', a: 'AFOS monitorea elecciones en 14+ países, incluyendo Brasil 2026, EE.UU., Francia, Alemania, Reino Unido, Canadá, Australia, Corea del Sur, Colombia, Chile, entre otros.' },
      { q: '¿Cómo se actualizan los datos?', a: 'Los datos de mercados de predicción se actualizan cada 30 minutos. Las noticias se actualizan cada 30 minutos. Los análisis se actualizan manualmente con cruce de fuentes.' },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs[locale] || faqs['pt-BR']).map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/** Dataset — dados eleitorais como dataset estruturado */
export function datasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'AFOS Analytics Election Data',
    description: 'Real-time election prediction market data, polls from 17+ institutes, and news analysis for global elections.',
    url: BASE_URL,
    license: 'https://opensource.org/licenses/MIT',
    creator: { '@type': 'Organization', name: 'AFOS Analytics' },
    temporalCoverage: '2025/..',
    spatialCoverage: { '@type': 'Place', name: 'Global' },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${BASE_URL}/api/global-map`,
    },
  };
}

/** Combina múltiplos schemas em um array JSON-LD */
export function combineSchemas(...schemas: Record<string, unknown>[]): string {
  return JSON.stringify(schemas);
}
