import { InstitutionalPage } from '../../../lib/seo/institutional-page'

const p = InstitutionalPage('geopolitical-signals', {
  'pt-BR': {
    metaTitle: 'Sinais Geopolíticos | Monitoramento em Tempo Real | AFOS Analytics',
    desc: 'Monitoramento de sinais geopolíticos globais. Eleições, risco político, mercados de previsão e impacto macro em tempo real.',
    h1: 'Sinais Geopolíticos Globais',
    intro: 'Monitoramento contínuo de sinais que impactam câmbio, commodities e fluxos de capital.',
    features: ['Mapa global interativo com 14 países', 'Sinais de mercados de previsão como indicador antecipado', 'Impacto de eleições em câmbio e risco-país', 'Correlação entre eventos políticos e movimentos de mercado', 'Alertas de mudança de cenário político'],
    cta: '← Acessar Mapa Global', ctaHref: '/{locale}/global', icon: '⚡',
  },
  en: {
    metaTitle: 'Geopolitical Signals | Real-Time Monitoring | AFOS Analytics',
    desc: 'Global geopolitical signal monitoring. Elections, political risk, prediction markets, and real-time macro impact.',
    h1: 'Global Geopolitical Signals',
    intro: 'Continuous monitoring of signals that impact currencies, commodities, and capital flows.',
    features: ['Interactive global map with 14 countries', 'Prediction market signals as leading indicator', 'Election impact on FX and sovereign risk', 'Correlation between political events and market movements', 'Political scenario change alerts'],
    cta: '← Access Global Map', ctaHref: '/{locale}/global', icon: '⚡',
  },
  es: {
    metaTitle: 'Señales Geopolíticas | Monitoreo en Tiempo Real | AFOS Analytics',
    desc: 'Monitoreo de señales geopolíticas globales. Elecciones, riesgo político, mercados de predicción e impacto macro en tiempo real.',
    h1: 'Señales Geopolíticas Globales',
    intro: 'Monitoreo continuo de señales que impactan divisas, commodities y flujos de capital.',
    features: ['Mapa global interactivo con 14 países', 'Señales de mercados de predicción como indicador anticipado', 'Impacto de elecciones en tipo de cambio y riesgo soberano', 'Correlación entre eventos políticos y movimientos de mercado', 'Alertas de cambio de escenario político'],
    cta: '← Acceder al Mapa Global', ctaHref: '/{locale}/global', icon: '⚡',
  },
})

export const { generateStaticParams, generateMetadata } = p
export default p.Page
