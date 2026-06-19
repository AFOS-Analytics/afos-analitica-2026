import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, isValidLocale, type Locale } from '../../../../lib/i18n/config'
import { getElectionBySlug, COUNTRIES_SEO, ISO3_TO_CC } from '../../../../lib/seo/countries'
import { getCountryDivergence } from '../../../../lib/country-data'
import { ElectionPageContent } from '../../../components/ElectionPageContent'
import { socialMeta } from '../../../../lib/seo/metadata'

const BASE_URL = 'https://www.afos-analytics.com'

const META_TEMPLATES: Record<string, { title: string; desc: string }> = {
  'pt-BR': {
    title: 'Eleição {country} {year} — {type} | AFOS Analytics',
    desc: 'Inteligência eleitoral em tempo real para {country} {year}. Odds de mercados de previsão, pesquisas e sinais políticos.',
  },
  en: {
    title: '{country} {year} {type} Election | AFOS Analytics',
    desc: 'Real-time election intelligence for {country} {year}. Prediction market odds, polls, and political signals.',
  },
  es: {
    title: 'Elección {country} {year} — {type} | AFOS Analytics',
    desc: 'Inteligencia electoral en tiempo real para {country} {year}. Odds de mercados de predicción, encuestas y señales políticas.',
  },
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const loc of locales) {
    for (const c of COUNTRIES_SEO) {
      for (const e of c.elections) {
        params.push({ locale: loc, slug: e.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const loc = isValidLocale(locale) ? locale : 'pt-BR'
  const result = getElectionBySlug(slug)
  if (!result) return {}

  const { country, election } = result
  const name = country.name[loc] || country.name['en']
  const type = election.type[loc] || election.type['en']
  const tpl = META_TEMPLATES[loc] || META_TEMPLATES['en']

  const title = tpl.title.replace('{country}', name).replace('{year}', String(election.year)).replace('{type}', type)
  const description = tpl.desc.replace('{country}', name).replace('{year}', String(election.year))

  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/election/${slug}`
  }
  languages['x-default'] = `${BASE_URL}/en/election/${slug}`

  // OG dinâmico por eleição (bandeira + título) via /api/og — substitui o OG genérico da marca.
  const ogTitle = `${name} · ${type} ${election.year}`
  // subtítulo de 3 eixos (mercado × pesquisa × imprensa) só onde há eixo de imprensa (EUA 2024); demais usam o default 2 eixos
  const ogLine3: Record<string, string> = {
    'pt-BR': 'Mercado de previsão × pesquisas × imprensa — a diferença é o sinal.',
    en: 'Prediction markets × polls × press — the spread is the signal.',
    es: 'Mercado de predicción × encuestas × prensa — la brecha es la señal.',
  }
  const ogLine = country.iso3 === 'USA' ? (ogLine3[loc] || ogLine3.en) : ''
  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}&cc=${ISO3_TO_CC[country.iso3] || ''}${ogLine ? `&line=${encodeURIComponent(ogLine)}` : ''}`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${loc}/election/${slug}`, languages },
    ...socialMeta(loc, { title, description, url: `${BASE_URL}/${loc}/election/${slug}`, image: ogImage }),
  }
}

export default async function ElectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const loc = (isValidLocale(locale) ? locale : 'pt-BR') as Locale
  const result = getElectionBySlug(slug)
  if (!result) notFound()

  const { country, election } = result
  return <ElectionPageContent locale={loc} country={country} election={election} div={getCountryDivergence(country.iso3)} />
}
