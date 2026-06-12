import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, isValidLocale, type Locale } from '../../../../lib/i18n/config'
import { getCountryBySlug, COUNTRIES_SEO } from '../../../../lib/seo/countries'
import { breadcrumbSchema, countryDatasetSchema } from '../../../../lib/seo/schema'
import { getCountryDivergence } from '../../../../lib/country-data'
import { CountryPageContent } from '../../../components/CountryPageContent'
import { socialMeta } from '../../../../lib/seo/metadata'

const BASE_URL = 'https://www.afos-analytics.com'

const META_TEMPLATES: Record<string, { title: string; desc: string }> = {
  'pt-BR': {
    title: '{country} — Eleições {year} | Risco Político e Mercados de Previsão',
    desc: 'Dados eleitorais, sinais de risco político e mercados de previsão para {country}. AFOS Analytics.',
  },
  en: {
    title: '{country} Election {year} | Political Risk & Prediction Markets',
    desc: 'Election data, political risk signals, and prediction markets for {country}. AFOS Analytics.',
  },
  es: {
    title: '{country} — Elecciones {year} | Riesgo Político y Mercados de Predicción',
    desc: 'Datos electorales, señales de riesgo político y mercados de predicción para {country}. AFOS Analytics.',
  },
}

export async function generateStaticParams() {
  const params: { locale: string; country: string }[] = []
  for (const loc of locales) {
    for (const c of COUNTRIES_SEO) {
      params.push({ locale: loc, country: c.slug[loc] })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; country: string }> }): Promise<Metadata> {
  const { locale, country: slug } = await params
  const loc = isValidLocale(locale) ? locale : 'pt-BR'
  const country = getCountryBySlug(slug)
  if (!country) return {}

  const name = country.name[loc] || country.name['en']
  const year = country.elections[0]?.year || ''
  const tpl = META_TEMPLATES[loc] || META_TEMPLATES['en']

  const title = tpl.title.replace('{country}', name).replace('{year}', String(year))
  const description = tpl.desc.replace('{country}', name)

  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/country/${country.slug[l]}`
  }
  languages['x-default'] = `${BASE_URL}/en/country/${country.slug['en']}`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${loc}/country/${slug}`, languages },
    ...socialMeta(loc, { title, description, url: `${BASE_URL}/${loc}/country/${slug}` }),
  }
}

export default async function CountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country: slug } = await params
  const loc = (isValidLocale(locale) ? locale : 'pt-BR') as Locale
  const country = getCountryBySlug(slug)
  if (!country) notFound()

  const name = country.name[loc] || country.name['en']
  const div = getCountryDivergence(country.iso3)
  const breadcrumb = breadcrumbSchema(loc, [{ name: 'AFOS Analytics', path: '' }, { name, path: `country/${slug}` }])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {div?.hf && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryDatasetSchema(name, div.hf)) }} />}
      <CountryPageContent locale={loc} country={country} div={div} />
    </>
  )
}
