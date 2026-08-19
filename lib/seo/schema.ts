/**
 * Schema.org / JSON-LD Generator
 *
 * Gera structured data para Google e mecanismos generativos.
 * Cada função retorna um objeto JSON-LD pronto para <script>.
 */

import type { Locale } from '../i18n/config';

const BASE_URL = 'https://www.afos-analytics.com';

/** Organization, identidade da marca */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'AFOS Analytics',
    alternateName: 'AFOS',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/brand/logo-icon-512.png`,
      width: 1024,
      height: 1024,
    },
    description: 'Global Electoral Political Risk Intelligence, Open-Source. Cross-references Polymarket, 17+ polls, and live news. Brazil 2026 + 15 countries.',
    foundingDate: '2026',
    knowsAbout: [
      'Election prediction',
      'Brazilian politics',
      'Polymarket prediction markets',
      'Electoral polls',
      'Political risk analysis',
      'Open data',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@afos-analytics.com',
      availableLanguage: ['Portuguese', 'English', 'Spanish'],
    },
    sameAs: [
      'https://github.com/AFOS-Analytics',
      'https://github.com/AFOS-Analytics/afos-analitica-2026',
      'https://x.com/AFOS_Analytics',
      'https://bsky.app/profile/afos-analytics.com',
      'https://huggingface.co/AFOS-Analytics1',
      'https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence',
      'https://dataverse.harvard.edu/dataverse/afos-analytics',
    ],
  };
}

/** WebSite, search action e multilíngue */
export function websiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'AFOS Analytics',
    url: `${BASE_URL}/${locale}`,
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: locale === 'es' ? 'es' : locale === 'en' ? 'en' : 'pt-BR',
    description: locale === 'en'
      ? 'Global Electoral Political Risk Intelligence, Open-Source'
      : locale === 'es'
        ? 'Inteligencia Global de Riesgo Político Electoral, Open-Source'
        : 'Inteligência de Risco Político Eleitoral Global, Open-Source',
  };
}

/** WebApplication, o produto em si */
export function webAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AFOS Analytics',
    url: BASE_URL,
    // Dual-categoria: NewsApplication (Daily editorial) + BusinessApplication
    // (risco político eleitoral para tomada de decisão institucional).
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Political Risk Intelligence',
    operatingSystem: 'Web',
    description: 'Global Electoral Political Risk Intelligence, Open-Source. Cross-references real-money prediction markets (Polymarket), polls from 17+ Brazilian institutes (TSE), and live news coverage across 15 countries.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'AFOS Analytics', url: BASE_URL },
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: ['pt-BR', 'en', 'es'],
    isAccessibleForFree: true,
    // Imagem estática rastreável (a anterior, /api/og, fica sob o Disallow:/api/ do robots).
    screenshot: { '@type': 'ImageObject', url: `${BASE_URL}/brand/og-en-linkedin-1200x627.png`, width: 1200, height: 627 },
    featureList: [
      'Real-time prediction market odds (Polymarket)',
      'Polls cross-reference from 17+ institutes',
      'Daily editorial synthesis with auditable sources',
      'Coverage across 15 countries',
      'Open-source under Apache 2.0',
    ],
  };
}

/** BreadcrumbList, navegação estruturada */
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

/**
 * Fonte ÚNICA das perguntas/respostas do FAQ. Consumida pelo faqSchema (JSON-LD)
 * E pelo bloco FAQ visível em /how-it-works — paridade obrigatória (política
 * FAQPage do Google exige que o texto do schema apareça visível na página).
 */
export const FAQ_DATA: Record<Locale, { q: string; a: string }[]> = {
    'pt-BR': [
      { q: 'O que é o AFOS Analytics?', a: 'AFOS Analytics é uma plataforma global de inteligência eleitoral que cruza mercados de previsão com dinheiro real (Polymarket), pesquisas eleitorais de +17 institutos, notícias ao vivo e análises estratégicas em tempo real.' },
      { q: 'O AFOS Analytics é gratuito?', a: 'Sim. O acesso à plataforma é completamente gratuito, sem necessidade de cadastro. O projeto é open source.' },
      { q: 'O que são mercados de previsão?', a: 'Mercados de previsão são plataformas onde pessoas apostam dinheiro real em eventos futuros. Diferente de pesquisas de opinião, refletem onde as pessoas colocam seu dinheiro, historicamente mais precisos que pesquisas tradicionais.' },
      { q: 'Quais eleições o AFOS monitora?', a: 'O AFOS monitora eleições em 15 países, incluindo Brasil 2026, EUA, França, Alemanha, Reino Unido, Canadá, Austrália, Coreia do Sul, Colômbia, Chile, entre outros.' },
      { q: 'Como os dados são atualizados?', a: 'Os dados de mercados de previsão são atualizados a cada 30 minutos via cron job. Notícias são atualizadas a cada 30 minutos. Análises são atualizadas manualmente com cruzamento de fontes.' },
    ],
    en: [
      { q: 'What is AFOS Analytics?', a: 'AFOS Analytics is a global electoral intelligence platform that cross-references real-money prediction markets (Polymarket), polls from 17+ institutes, live news, and strategic analysis in real time.' },
      { q: 'Is AFOS Analytics free?', a: 'Yes. Access to the platform is completely free, with no registration required. The project is open source.' },
      { q: 'What are prediction markets?', a: 'Prediction markets are platforms where people bet real money on future events. Unlike opinion polls, they reflect where people put their money, historically more accurate than traditional polls.' },
      { q: 'Which elections does AFOS monitor?', a: 'AFOS monitors elections in 15 countries, including Brazil 2026, USA, France, Germany, UK, Canada, Australia, South Korea, Colombia, Chile, and more.' },
      { q: 'How is the data updated?', a: 'Prediction market data is updated every 30 minutes via cron job. News is updated every 30 minutes. Analysis is updated manually with source cross-referencing.' },
    ],
    es: [
      { q: '¿Qué es AFOS Analytics?', a: 'AFOS Analytics es una plataforma global de inteligencia electoral que cruza mercados de predicción con dinero real (Polymarket), encuestas de +17 institutos, noticias en vivo y análisis estratégico en tiempo real.' },
      { q: '¿AFOS Analytics es gratuito?', a: 'Sí. El acceso a la plataforma es completamente gratuito, sin necesidad de registro. El proyecto es open source.' },
      { q: '¿Qué son los mercados de predicción?', a: 'Los mercados de predicción son plataformas donde las personas apuestan dinero real en eventos futuros. A diferencia de las encuestas, reflejan dónde la gente pone su dinero, históricamente más precisos que las encuestas tradicionales.' },
      { q: '¿Qué elecciones monitorea AFOS?', a: 'AFOS monitorea elecciones en 15 países, incluyendo Brasil 2026, EE.UU., Francia, Alemania, Reino Unido, Canadá, Australia, Corea del Sur, Colombia, Chile, entre otros.' },
      { q: '¿Cómo se actualizan los datos?', a: 'Los datos de mercados de predicción se actualizan cada 30 minutos. Las noticias se actualizan cada 30 minutos. Los análisis se actualizan manualmente con cruce de fuentes.' },
    ],
};

/** FAQPage JSON-LD, para GEO (mecanismos generativos). Espelha FAQ_DATA. */
export function faqSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (FAQ_DATA[locale] || FAQ_DATA['pt-BR']).map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/** Dataset, dados eleitorais como dataset estruturado */
export function datasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    // 🔴 `@id` e `mainEntityOfPage` acrescentados em 19/Ago/2026, junto com a
    // saída deste nó do layout raiz. Sem `@id`, a página de um país servia DOIS
    // Dataset anônimos, um do país e um do Brasil, e nada dizia qual era o
    // assunto. Sem `mainEntityOfPage`, o nó apontava para a home a partir de
    // qualquer rota.
    '@id': `${BASE_URL}/#dataset-afos`,
    mainEntityOfPage: `${BASE_URL}/pt-BR/data-sources`,
    name: 'AFOS Analytics Election Data',
    description: 'Global electoral political risk intelligence dataset: real-time Polymarket odds, polls from 17+ institutes, and news cross-references across 15 countries.',
    url: BASE_URL,
    // EVAL 06/Jun: licença estava MIT (errada, o dado é CC BY 4.0). distribution apontava
    // para /api/global-map (bloqueado no robots). Agora aponta para o dataset aberto real no
    // Hugging Face + sameAs para citabilidade (Google Dataset Search / engines de IA).
    license: 'https://creativecommons.org/licenses/by/4.0/',
    sameAs: 'https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence',
    creator: { '@type': 'Organization', name: 'AFOS Analytics', url: BASE_URL },
    temporalCoverage: '2025/..',
    spatialCoverage: { '@type': 'Place', name: 'Global' },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/csv',
      contentUrl: 'https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence/resolve/main/data/market-odds-timeseries.csv',
    },
  };
}

/** Dataset por país, casos validados (Google Dataset Search / GEO) */
export function countryDatasetSchema(countryName: string, hf: string, iso3?: string, loc?: string, paginaUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    // `@id` estável e IGUAL nos três idiomas: sem ele os nós de países
    // diferentes eram anônimos e indistinguíveis para o consumidor.
    ...(iso3 ? { '@id': `${BASE_URL}/#dataset-${iso3}` } : {}),
    ...(loc ? { inLanguage: loc } : {}),
    ...(paginaUrl ? { mainEntityOfPage: paginaUrl } : {}),
    name: `AFOS Analytics, ${countryName} electoral divergence dataset`,
    description: `Prediction-market odds cross-referenced with electoral polls (market × poll divergence) for ${countryName}, checked against the real election result. Open dataset, CC BY 4.0.`,
    url: hf,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    creator: { '@type': 'Organization', name: 'AFOS Analytics', url: BASE_URL },
    publisher: { '@id': `${BASE_URL}/#organization` },
    temporalCoverage: '2024/..',
    spatialCoverage: { '@type': 'Place', name: countryName },
    sameAs: hf,
    // 🏷️ A etiqueta do formato tem de dizer a verdade: `hf` é a PÁGINA do
    // dataset no Hugging Face, que é text/html, e não o arquivo. Antes ela vinha
    // declarada como `text/csv`, então o consumidor baixava markup achando que
    // era tabela.
    // ⛔ E NÃO se inventa aqui a URL do CSV: o caminho do arquivo varia por
    // dataset, e apontar para um `/resolve/main/...` adivinhado publicaria um
    // link quebrado, que é pior que a etiqueta errada. Quando cada país
    // declarar o caminho do próprio arquivo, entra um segundo DataDownload.
    distribution: { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: hf },
  };
}

/** AboutPage, institutional Organization page (E-E-A-T trust signal) */
export function aboutPageSchema(locale: Locale, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name,
    description,
    url: `${BASE_URL}/${locale}/about`,
    inLanguage: locale === 'es' ? 'es' : locale === 'en' ? 'en' : 'pt-BR',
    mainEntity: { '@id': `${BASE_URL}/#organization` },
    isPartOf: { '@type': 'WebSite', name: 'AFOS Analytics', url: BASE_URL },
  };
}

/**
 * Serializa JSON-LD escapando os caracteres que quebrariam a tag <script>
 * (o "<" de um eventual "</script>" no conteúdo) e os separadores de linha/
 * parágrafo Unicode. O navegador desescapa < de volta para "<" ao parsear,
 * então o dado estruturado permanece idêntico e nenhum texto visível muda.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** Combina múltiplos schemas em um array JSON-LD (com escaping seguro) */
export function combineSchemas(...schemas: Record<string, unknown>[]): string {
  return safeJsonLd(schemas);
}
