import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../../../lib/i18n/config'

const BASE_URL = 'https://afos-analytics.com'

const CONTENT: Record<string, { metaTitle: string; desc: string; h1: string; intro: string; features: string[]; cta: string }> = {
  'pt-BR': {
    metaTitle: 'Inteligência Eleitoral | Dados Políticos em Tempo Real | AFOS Analytics',
    desc: 'Plataforma de inteligência eleitoral global. Mercados de previsão, pesquisas, notícias e análises cruzadas para eleições em 14 países.',
    h1: 'Inteligência Eleitoral Global',
    intro: 'Uma camada de inteligência política para mercados, governos e cidadãos.',
    features: ['14 países monitorados com dados ao vivo', 'Mercados de previsão × pesquisas × notícias cruzadas', 'Análise de candidatos com forças e fraquezas', 'Mapa global interativo com D3.js', 'Multilíngue: PT-BR, EN, ES', 'Open source, gratuito, sem cadastro obrigatório'],
    cta: '← Acessar Plataforma',
  },
  en: {
    metaTitle: 'Election Intelligence | Real-Time Political Data | AFOS Analytics',
    desc: 'Global election intelligence platform. Prediction markets, polls, news, and cross-analysis for elections in 14 countries.',
    h1: 'Global Election Intelligence',
    intro: 'A political intelligence layer for markets, governments, and citizens.',
    features: ['14 countries monitored with live data', 'Prediction markets × polls × news cross-referenced', 'Candidate analysis with strengths and weaknesses', 'Interactive global map with D3.js', 'Multilingual: PT-BR, EN, ES', 'Open source, free, no registration required'],
    cta: '← Access Platform',
  },
  es: {
    metaTitle: 'Inteligencia Electoral | Datos Políticos en Tiempo Real | AFOS Analytics',
    desc: 'Plataforma de inteligencia electoral global. Mercados de predicción, encuestas, noticias y análisis cruzados para elecciones en 14 países.',
    h1: 'Inteligencia Electoral Global',
    intro: 'Una capa de inteligencia política para mercados, gobiernos y ciudadanos.',
    features: ['14 países monitoreados con datos en vivo', 'Mercados de predicción × encuestas × noticias cruzadas', 'Análisis de candidatos con fortalezas y debilidades', 'Mapa global interactivo con D3.js', 'Multilingüe: PT-BR, EN, ES', 'Código abierto, gratuito, sin registro obligatorio'],
    cta: '← Acceder a la Plataforma',
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
  for (const l of locales) languages[l] = `${BASE_URL}/${l}/election-intelligence`
  languages['x-default'] = `${BASE_URL}/en/election-intelligence`
  return {
    title: c.metaTitle,
    description: c.desc,
    alternates: { canonical: `${BASE_URL}/${loc}/election-intelligence`, languages },
    openGraph: { title: c.metaTitle, description: c.desc, url: `${BASE_URL}/${loc}/election-intelligence` },
  }
}

export default async function ElectionIntelligencePage({ params }: { params: Promise<{ locale: string }> }) {
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
              <span className="text-primary font-bold text-lg mt-0.5">→</span>
              <p className="text-dark">{f}</p>
            </div>
          ))}
        </div>
        <a href={`/${loc}`} className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">{c.cta}</a>
      </div>
    </div>
  )
}
