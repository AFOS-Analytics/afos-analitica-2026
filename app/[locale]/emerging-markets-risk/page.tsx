import { InstitutionalPage } from '../../../lib/seo/institutional-page'

const p = InstitutionalPage('emerging-markets-risk', {
  'pt-BR': {
    metaTitle: 'Risco em Mercados Emergentes | Eleições e Sinais Políticos | AFOS Analytics',
    desc: 'Monitoramento de risco político em mercados emergentes. Brasil, Colômbia, México, Índia, Nigéria. Mercados de previsão e dados eleitorais.',
    h1: 'Risco Político em Mercados Emergentes',
    intro: 'Onde política e mercado se encontram: dados eleitorais em tempo real para mercados emergentes.',
    features: ['Cobertura de mercados emergentes: Brasil, Colômbia, México, Índia, Nigéria', 'Odds de mercados de previsão como proxy de risco político', 'Impacto eleitoral em câmbio e CDS soberano', 'Monitoramento de transição de poder', 'Sinais antecipados de instabilidade política'],
    cta: '← Acessar Dashboard', ctaHref: '/{locale}', icon: '!',
  },
  en: {
    metaTitle: 'Emerging Markets Risk | Elections & Political Signals | AFOS Analytics',
    desc: 'Political risk monitoring for emerging markets. Brazil, Colombia, Mexico, India, Nigeria. Prediction markets and election data.',
    h1: 'Emerging Markets Political Risk',
    intro: 'Where politics meets markets: real-time election data for emerging economies.',
    features: ['Emerging market coverage: Brazil, Colombia, Mexico, India, Nigeria', 'Prediction market odds as political risk proxy', 'Election impact on FX and sovereign CDS', 'Power transition monitoring', 'Early signals of political instability'],
    cta: '← Access Dashboard', ctaHref: '/{locale}', icon: '!',
  },
  es: {
    metaTitle: 'Riesgo en Mercados Emergentes | Elecciones y Señales Políticas | AFOS Analytics',
    desc: 'Monitoreo de riesgo político en mercados emergentes. Brasil, Colombia, México, India, Nigeria. Mercados de predicción y datos electorales.',
    h1: 'Riesgo Político en Mercados Emergentes',
    intro: 'Donde política y mercado se encuentran: datos electorales en tiempo real para economías emergentes.',
    features: ['Cobertura de mercados emergentes: Brasil, Colombia, México, India, Nigeria', 'Odds de mercados de predicción como proxy de riesgo político', 'Impacto electoral en tipo de cambio y CDS soberano', 'Monitoreo de transición de poder', 'Señales anticipadas de inestabilidad política'],
    cta: '← Acceder al Dashboard', ctaHref: '/{locale}', icon: '!',
  },
})

export const { generateStaticParams, generateMetadata } = p
export default p.Page
