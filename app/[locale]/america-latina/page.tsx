import type { Metadata } from 'next'
import { locales, isValidLocale } from '../../../lib/i18n/config'
import { RegionPage } from '../../../lib/seo/region-page'

const BASE_URL = 'https://afos-analytics.com'

// Canonical aponta para /latam — evitar duplicate content com america-latina
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isValidLocale(locale) ? locale : 'pt-BR'
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${BASE_URL}/${l}/latam`
  languages['x-default'] = `${BASE_URL}/en/latam`
  return {
    alternates: { canonical: `${BASE_URL}/${loc}/latam`, languages },
  }
}

const rp = RegionPage('latam')
export default rp.Page
