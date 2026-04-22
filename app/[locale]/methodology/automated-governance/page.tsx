import type { Metadata } from 'next'
import { locales, isValidLocale, type Locale } from '../../../../lib/i18n/config'
import { AutomatedGovPtBR } from './content-pt-BR'
import { AutomatedGovEn } from './content-en'
import { AutomatedGovEs } from './content-es'

const BASE_URL = 'https://afos-analytics.com'
const SLUG = 'methodology/automated-governance'

const SEO: Record<string, {
  title: string
  description: string
  keywords: string[]
  headline: string
  ogLocale: string
  htmlLocale: string
}> = {
  'pt-BR': {
    title: 'Governança Automatizada — AFOS Analytics',
    description: 'Como o AFOS gera análises eleitorais sem intervenção humana por análise: regras em código, validadores automáticos, prompts calibrados. Escala para dezenas de países sem newsroom.',
    keywords: ['governança automatizada', 'afos analytics', 'análise política automatizada', 'inteligência eleitoral', 'pipeline de dados', 'validadores de integridade', 'zero-touch'],
    headline: 'Governança Automatizada',
    ogLocale: 'pt_BR',
    htmlLocale: 'pt-BR',
  },
  en: {
    title: 'Automated Governance — AFOS Analytics',
    description: 'How AFOS generates electoral analyses without human-per-analysis intervention: rules in code, automated validators, calibrated prompts. Scales across dozens of countries without a newsroom.',
    keywords: ['automated governance', 'afos analytics', 'automated political analysis', 'electoral intelligence', 'data pipeline', 'integrity validators', 'zero-touch'],
    headline: 'Automated Governance',
    ogLocale: 'en_US',
    htmlLocale: 'en',
  },
  es: {
    title: 'Gobernanza Automatizada — AFOS Analytics',
    description: 'Cómo AFOS genera análisis electorales sin intervención humana por análisis: reglas en código, validadores automáticos, prompts calibrados. Escala a decenas de países sin newsroom.',
    keywords: ['gobernanza automatizada', 'afos analytics', 'análisis político automatizado', 'inteligencia electoral', 'pipeline de datos', 'validadores de integridad', 'zero-touch'],
    headline: 'Gobernanza Automatizada',
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
      publishedTime: '2026-04-21T22:00:00Z',
      modifiedTime: '2026-04-21T23:00:00Z',
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

function articleSchema(loc: Locale) {
  const seo = SEO[loc] || SEO['en']
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.headline,
    description: seo.description,
    inLanguage: seo.htmlLocale,
    datePublished: '2026-04-21T22:00:00Z',
    dateModified: '2026-04-21T23:00:00Z',
    url: `${BASE_URL}/${loc}/${SLUG}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${loc}/${SLUG}`,
    },
    author: { '@type': 'Organization', name: 'AFOS Analytics', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'AFOS Analytics',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` },
    },
  }
}

function breadcrumbSchema(loc: Locale) {
  const seo = SEO[loc] || SEO['en']
  const homeName = loc === 'pt-BR' ? 'Início' : loc === 'es' ? 'Inicio' : 'Home'
  const methodologyName = loc === 'pt-BR' ? 'Metodologia' : loc === 'es' ? 'Metodología' : 'Methodology'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${BASE_URL}/${loc}` },
      { '@type': 'ListItem', position: 2, name: methodologyName, item: `${BASE_URL}/${loc}/methodology` },
      { '@type': 'ListItem', position: 3, name: seo.headline, item: `${BASE_URL}/${loc}/${SLUG}` },
    ],
  }
}

export default async function AutomatedGovernancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale

  const Content = loc === 'pt-BR' ? AutomatedGovPtBR : loc === 'es' ? AutomatedGovEs : AutomatedGovEn

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema(loc), breadcrumbSchema(loc)]) }}
      />
      <article className="max-w-[920px] mx-auto px-5 md:px-10 py-12 md:py-14">
        <nav className="mb-8 text-sm">
          <a href={`/${loc}/dashboard`} className="text-primary hover:underline">
            ← {loc === 'pt-BR' ? 'Voltar ao Dashboard' : loc === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
          </a>
        </nav>
        <Content />
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <a
            href={`/${loc}/dashboard`}
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            {loc === 'pt-BR' ? '← Acessar o Dashboard' : loc === 'es' ? '← Acceder al Dashboard' : '← Access the Dashboard'}
          </a>
        </div>
      </article>
    </div>
  )
}
