import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../../../lib/i18n/config'

const BASE_URL = 'https://afos-analytics.com'

const CONTENT: Record<string, { title: string; metaTitle: string; desc: string; h1: string; intro: string; features: string[]; cta: string }> = {
  'pt-BR': {
    title: 'Para Investidores | AFOS Analytics',
    metaTitle: 'Inteligência Eleitoral para Investidores | Risco Político em Tempo Real',
    desc: 'Mercados de previsão, odds eleitorais e sinais macro para gestão de risco político. Dados em tempo real para fundos, bancos e consultorias.',
    h1: 'Inteligência Eleitoral para Investidores',
    intro: 'Decisões de investimento baseadas em dados eleitorais em tempo real — não em narrativa.',
    features: ['Odds de mercados de previsão com dinheiro real (Polymarket)', 'Cruzamento de pesquisas eleitorais com sinais de mercado', 'Alertas de risco político por país e região', 'Calendário global de eleições com impacto macro', 'API de inteligência política estruturada'],
    cta: '← Acessar Dashboard',
  },
  en: {
    title: 'For Investors | AFOS Analytics',
    metaTitle: 'Election Intelligence for Investors | Real-Time Political Risk',
    desc: 'Prediction markets, election odds, and macro signals for political risk management. Real-time data for funds, banks, and consultancies.',
    h1: 'Election Intelligence for Investors',
    intro: 'Investment decisions driven by real-time election data — not narrative.',
    features: ['Real-money prediction market odds (Polymarket)', 'Cross-referencing polls with market signals', 'Political risk alerts by country and region', 'Global election calendar with macro impact', 'Structured political intelligence API'],
    cta: '← Access Dashboard',
  },
  es: {
    title: 'Para Inversores | AFOS Analytics',
    metaTitle: 'Inteligencia Electoral para Inversores | Riesgo Político en Tiempo Real',
    desc: 'Mercados de predicción, odds electorales y señales macro para gestión de riesgo político. Datos en tiempo real para fondos, bancos y consultorías.',
    h1: 'Inteligencia Electoral para Inversores',
    intro: 'Decisiones de inversión basadas en datos electorales en tiempo real — no en narrativa.',
    features: ['Odds de mercados de predicción con dinero real (Polymarket)', 'Cruce de encuestas electorales con señales de mercado', 'Alertas de riesgo político por país y región', 'Calendario global de elecciones con impacto macro', 'API de inteligencia política estructurada'],
    cta: '← Acceder al Dashboard',
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
  for (const l of locales) languages[l] = `${BASE_URL}/${l}/for-investors`
  languages['x-default'] = `${BASE_URL}/en/for-investors`
  return {
    title: c.metaTitle,
    description: c.desc,
    alternates: { canonical: `${BASE_URL}/${loc}/for-investors`, languages },
    openGraph: { title: c.metaTitle, description: c.desc, url: `${BASE_URL}/${loc}/for-investors` },
  }
}

export default async function ForInvestorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale
  const c = CONTENT[loc] || CONTENT['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <a href={`/${loc}`} className="text-primary text-sm hover:underline mb-8 inline-block">{c.cta}</a>
        <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4">{c.h1}</h1>
        <p className="text-lg text-gray-600 mb-10">{c.intro}</p>
        <div className="space-y-4 mb-12">
          {c.features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg mt-0.5">+</span>
              <p className="text-dark">{f}</p>
            </div>
          ))}
        </div>
        <a href={`/${loc}`} className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">{c.cta}</a>
      </div>
    </div>
  )
}
