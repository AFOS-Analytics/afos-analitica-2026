import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../../../lib/i18n/config'
import { HowItWorksPtBR } from './content-pt-BR'
import { HowItWorksEn } from './content-en'
import { HowItWorksEs } from './content-es'

const BASE_URL = 'https://afos-analytics.com'
const SLUG = 'how-it-works'

const SEO: Record<string, {
  title: string
  description: string
  keywords: string[]
  headline: string
  ogLocale: string
  htmlLocale: string
}> = {
  'pt-BR': {
    title: 'Como Funciona o AFOS Analytics — Guia Didático da Plataforma',
    description: 'Guia completo: como o AFOS cruza Polymarket, 17+ institutos de pesquisa e Google News em tempo real para entregar inteligência eleitoral sem viés em 14+ países.',
    keywords: ['como funciona afos', 'inteligência eleitoral', 'polymarket brasil', 'cruzamento de pesquisas', 'mercado de previsão', 'análise eleitoral 2026', 'risco político', 'open source eleições', 'afos analytics'],
    headline: 'Como funciona o AFOS Analytics',
    ogLocale: 'pt_BR',
    htmlLocale: 'pt-BR',
  },
  en: {
    title: 'How AFOS Analytics Works — Platform Didactic Guide',
    description: 'Complete guide: how AFOS cross-references Polymarket, 17+ polling institutes, and Google News in real time to deliver unbiased electoral intelligence across 14+ countries.',
    keywords: ['how afos works', 'electoral intelligence', 'polymarket brazil', 'poll cross-reference', 'prediction market', 'election analysis 2026', 'political risk', 'open source elections', 'afos analytics'],
    headline: 'How AFOS Analytics Works',
    ogLocale: 'en_US',
    htmlLocale: 'en',
  },
  es: {
    title: 'Cómo Funciona AFOS Analytics — Guía Didáctica de la Plataforma',
    description: 'Guía completa: cómo AFOS cruza Polymarket, 17+ encuestadoras y Google News en tiempo real para entregar inteligencia electoral sin sesgo en 14+ países.',
    keywords: ['cómo funciona afos', 'inteligencia electoral', 'polymarket brasil', 'cruce de encuestas', 'mercado de predicción', 'análisis electoral 2026', 'riesgo político', 'open source elecciones', 'afos analytics'],
    headline: 'Cómo Funciona AFOS Analytics',
    ogLocale: 'es_ES',
    htmlLocale: 'es',
  },
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isValidLocale(locale) ? locale : 'en'
  const seo = SEO[loc] || SEO['en']

  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${BASE_URL}/${l}/${SLUG}`
  languages['x-default'] = `${BASE_URL}/en/${SLUG}`

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${BASE_URL}/${loc}/${SLUG}`,
      languages,
    },
    openGraph: {
      type: 'article',
      title: seo.title,
      description: seo.description,
      url: `${BASE_URL}/${loc}/${SLUG}`,
      siteName: 'AFOS Analytics',
      locale: seo.ogLocale,
      publishedTime: '2026-04-19T12:00:00Z',
      modifiedTime: '2026-04-19T22:00:00Z',
      authors: ['AFOS Analytics'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  }
}

const MENTIONS_I18N: Record<string, { dailyName: string; dailyDesc: string; glossaryName: string }> = {
  'pt-BR': {
    dailyName: 'AFOS Daily — Síntese Narrativa Diária',
    dailyDesc: 'Síntese narrativa diária cruzando Polymarket, pesquisas eleitorais e notícias com link auditável por alegação. Disponível em 3 idiomas.',
    glossaryName: 'Glossário Político Brasileiro',
  },
  en: {
    dailyName: 'AFOS Daily — Daily Narrative Synthesis',
    dailyDesc: 'Daily narrative synthesis cross-referencing Polymarket, electoral polls, and news with auditable links per claim. Available in 3 languages.',
    glossaryName: 'Brazilian Political Glossary',
  },
  es: {
    dailyName: 'AFOS Daily — Síntesis Narrativa Diaria',
    dailyDesc: 'Síntesis narrativa diaria cruzando Polymarket, encuestas electorales y noticias con enlace auditable por afirmación. Disponible en 3 idiomas.',
    glossaryName: 'Glosario Político Brasileño',
  },
}

function articleSchema(loc: Locale) {
  const seo = SEO[loc] || SEO['en']
  const m = MENTIONS_I18N[loc] || MENTIONS_I18N.en
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.headline,
    description: seo.description,
    inLanguage: seo.htmlLocale,
    datePublished: '2026-04-19T12:00:00Z',
    dateModified: '2026-04-30T22:00:00Z',
    url: `${BASE_URL}/${loc}/${SLUG}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${loc}/${SLUG}`,
    },
    author: {
      '@type': 'Organization',
      name: 'AFOS Analytics',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AFOS Analytics',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.svg`,
      },
    },
    mentions: [
      {
        '@type': 'CreativeWork',
        '@id': `${BASE_URL}/${loc}/daily`,
        name: m.dailyName,
        description: m.dailyDesc,
        url: `${BASE_URL}/${loc}/daily`,
        inLanguage: seo.htmlLocale,
        publisher: { '@type': 'Organization', name: 'AFOS Analytics', url: BASE_URL },
      },
      {
        '@type': 'DefinedTermSet',
        '@id': `${BASE_URL}/${loc}/glossary`,
        name: m.glossaryName,
        url: `${BASE_URL}/${loc}/glossary`,
      },
    ],
  }
}

function breadcrumbSchema(loc: Locale) {
  const seo = SEO[loc] || SEO['en']
  const homeName = loc === 'pt-BR' ? 'Início' : loc === 'es' ? 'Inicio' : 'Home'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${BASE_URL}/${loc}` },
      { '@type': 'ListItem', position: 2, name: seo.headline, item: `${BASE_URL}/${loc}/${SLUG}` },
    ],
  }
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale

  const Content = loc === 'pt-BR' ? HowItWorksPtBR : loc === 'es' ? HowItWorksEs : HowItWorksEn

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema(loc), breadcrumbSchema(loc)]) }}
      />
      <article className="max-w-[920px] mx-auto px-5 md:px-10 py-12 md:py-14">
        <nav className="mb-8 text-sm">
          <a href={`/${loc}/dashboard`} className="text-primary hover:underline">← {loc === 'pt-BR' ? 'Voltar ao Dashboard' : loc === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}</a>
        </nav>
        <Content />
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <a href={`/${loc}/dashboard`} className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm">
            {loc === 'pt-BR' ? '← Acessar o Dashboard' : loc === 'es' ? '← Acceder al Dashboard' : '← Access the Dashboard'}
          </a>
        </div>
      </article>
    </div>
  )
}
