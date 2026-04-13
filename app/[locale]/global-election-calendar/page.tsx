import { InstitutionalPage } from '../../../lib/seo/institutional-page'

const p = InstitutionalPage('global-election-calendar', {
  'pt-BR': {
    metaTitle: 'Calendário Global de Eleições | Tempo Real | AFOS Analytics',
    desc: 'Calendário global de eleições com dados ao vivo. 14 países monitorados. Mercados de previsão, pesquisas e análise de risco político.',
    h1: 'Calendário Global de Eleições',
    intro: 'Todas as eleições do mundo em um único lugar — com dados ao vivo e análise de risco.',
    features: ['14 países monitorados simultaneamente', 'Mapa interativo D3.js com dados ao vivo', 'Status por país: ativa, futura, encerrada', 'Odds de mercados de previsão por eleição', 'Cruzamento com pesquisas e notícias locais', 'Multilíngue: PT-BR, EN, ES'],
    cta: '← Acessar Mapa Global', ctaHref: '/{locale}/global', icon: '📅',
  },
  en: {
    metaTitle: 'Global Election Calendar | Real-Time Data | AFOS Analytics',
    desc: 'Global election calendar with live data. 14 countries monitored. Prediction markets, polls, and political risk analysis.',
    h1: 'Global Election Calendar',
    intro: 'Every election in the world in one place — with live data and risk analysis.',
    features: ['14 countries monitored simultaneously', 'Interactive D3.js map with live data', 'Status by country: active, upcoming, resolved', 'Prediction market odds per election', 'Cross-referencing with local polls and news', 'Multilingual: PT-BR, EN, ES'],
    cta: '← Access Global Map', ctaHref: '/{locale}/global', icon: '📅',
  },
  es: {
    metaTitle: 'Calendario Global de Elecciones | Tiempo Real | AFOS Analytics',
    desc: 'Calendario global de elecciones con datos en vivo. 14 países monitoreados. Mercados de predicción, encuestas y análisis de riesgo político.',
    h1: 'Calendario Global de Elecciones',
    intro: 'Todas las elecciones del mundo en un solo lugar — con datos en vivo y análisis de riesgo.',
    features: ['14 países monitoreados simultáneamente', 'Mapa interactivo D3.js con datos en vivo', 'Estado por país: activa, futura, finalizada', 'Odds de mercados de predicción por elección', 'Cruce con encuestas y noticias locales', 'Multilingüe: PT-BR, EN, ES'],
    cta: '← Acceder al Mapa Global', ctaHref: '/{locale}/global', icon: '📅',
  },
})

export const { generateStaticParams, generateMetadata } = p
export default p.Page
