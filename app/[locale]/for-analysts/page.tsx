import { InstitutionalPage } from '../../../lib/seo/institutional-page'

const p = InstitutionalPage('for-analysts', {
  'pt-BR': {
    metaTitle: 'Para Analistas | Inteligência Eleitoral em Tempo Real | AFOS Analytics',
    desc: 'Dados consolidados de múltiplas fontes para analistas políticos e de mercado. Pesquisas, mercados de previsão e sinais cruzados.',
    h1: 'Inteligência Eleitoral para Analistas',
    intro: 'Cruzamento de pesquisas, mercados de previsão e notícias em uma única plataforma.',
    features: ['Dados de 17+ institutos de pesquisa consolidados', 'Odds de mercados de previsão em tempo real', 'Cruzamento pesquisas × mercados × narrativa de mídia', 'Análise de candidatos com forças e fraquezas', 'Histórico de odds para análise temporal', 'Export de dados para relatórios'],
    cta: '← Acessar Dashboard', ctaHref: '/{locale}', icon: '→',
  },
  en: {
    metaTitle: 'For Analysts | Real-Time Election Intelligence | AFOS Analytics',
    desc: 'Consolidated multi-source data for political and market analysts. Polls, prediction markets, and cross-referenced signals.',
    h1: 'Election Intelligence for Analysts',
    intro: 'Cross-referencing polls, prediction markets, and news in a single platform.',
    features: ['Data from 17+ polling institutes consolidated', 'Real-time prediction market odds', 'Polls × markets × media narrative cross-analysis', 'Candidate analysis with strengths and weaknesses', 'Historical odds for temporal analysis', 'Data export for reports'],
    cta: '← Access Dashboard', ctaHref: '/{locale}', icon: '→',
  },
  es: {
    metaTitle: 'Para Analistas | Inteligencia Electoral en Tiempo Real | AFOS Analytics',
    desc: 'Datos consolidados de múltiples fuentes para analistas políticos y de mercado. Encuestas, mercados de predicción y señales cruzadas.',
    h1: 'Inteligencia Electoral para Analistas',
    intro: 'Cruce de encuestas, mercados de predicción y noticias en una única plataforma.',
    features: ['Datos de 17+ institutos de encuestas consolidados', 'Odds de mercados de predicción en tiempo real', 'Cruce encuestas × mercados × narrativa mediática', 'Análisis de candidatos con fortalezas y debilidades', 'Historial de odds para análisis temporal', 'Exportación de datos para informes'],
    cta: '← Acceder al Dashboard', ctaHref: '/{locale}', icon: '→',
  },
})

export const { generateStaticParams, generateMetadata } = p
export default p.Page
