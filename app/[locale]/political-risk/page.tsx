import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../../../lib/i18n/config'

const BASE_URL = 'https://afos-analytics.com'

const CONTENT: Record<string, { metaTitle: string; desc: string; h1: string; intro: string; features: string[]; cta: string }> = {
  'pt-BR': {
    metaTitle: 'Risco Político Global | Monitoramento em Tempo Real | AFOS Analytics',
    desc: 'Monitoramento de risco político global em tempo real. Eleições, mercados de previsão, sinais macro e análise de cenários para tomada de decisão.',
    h1: 'Risco Político Global',
    intro: 'Monitoramento contínuo de risco político em 14 países. Dados ao vivo, não relatórios estáticos.',
    features: ['Termômetro de risco político por país', 'Mercados de previsão como indicador antecipado', 'Impacto de escândalos e crises em tempo real', 'Calendário eleitoral global interativo', 'Cruzamento pesquisas × mercado × notícias'],
    cta: '← Acessar Mapa Global',
  },
  en: {
    metaTitle: 'Global Political Risk | Real-Time Monitoring | AFOS Analytics',
    desc: 'Real-time global political risk monitoring. Elections, prediction markets, macro signals, and scenario analysis for decision-making.',
    h1: 'Global Political Risk',
    intro: 'Continuous political risk monitoring across 14 countries. Live data, not static reports.',
    features: ['Political risk thermometer by country', 'Prediction markets as leading indicator', 'Real-time impact of scandals and crises', 'Interactive global election calendar', 'Cross-referencing polls × markets × news'],
    cta: '← Access Global Map',
  },
  es: {
    metaTitle: 'Riesgo Político Global | Monitoreo en Tiempo Real | AFOS Analytics',
    desc: 'Monitoreo de riesgo político global en tiempo real. Elecciones, mercados de predicción, señales macro y análisis de escenarios para toma de decisiones.',
    h1: 'Riesgo Político Global',
    intro: 'Monitoreo continuo de riesgo político en 14 países. Datos en vivo, no informes estáticos.',
    features: ['Termómetro de riesgo político por país', 'Mercados de predicción como indicador anticipado', 'Impacto de escándalos y crisis en tiempo real', 'Calendario electoral global interactivo', 'Cruce encuestas × mercado × noticias'],
    cta: '← Acceder al Mapa Global',
  },
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isValidLocale(locale) ? locale : 'en'
  const c = CONTENT[loc] || CONTENT['en']
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${BASE_URL}/${l}/political-risk`
  languages['x-default'] = `${BASE_URL}/en/political-risk`
  return {
    title: c.metaTitle,
    description: c.desc,
    alternates: { canonical: `${BASE_URL}/${loc}/political-risk`, languages },
    openGraph: { title: c.metaTitle, description: c.desc, url: `${BASE_URL}/${loc}/political-risk` },
  }
}

export default async function PoliticalRiskPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale
  const c = CONTENT[loc] || CONTENT['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <a href={`/${loc}/global`} className="text-primary text-sm hover:underline mb-8 inline-block">{c.cta}</a>
        <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4">{c.h1}</h1>
        <p className="text-lg text-gray-600 mb-10">{c.intro}</p>
        <div className="space-y-4 mb-12">
          {c.features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-danger font-bold text-lg mt-0.5">!</span>
              <p className="text-dark">{f}</p>
            </div>
          ))}
        </div>
        <a href={`/${loc}/global`} className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">{c.cta}</a>
      </div>
    </div>
  )
}
