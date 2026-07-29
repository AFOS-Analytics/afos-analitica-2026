import type { Metadata } from 'next'
import { JsonLd } from '../../components/JsonLd'
import { redirect } from 'next/navigation'
import { getLatestDate, listPublishedDailies, loadDaily, isValidLocale, SUPPORTED_LOCALES } from '../../../lib/afos-daily/loader'
import { getOgImageUrl } from '../../../lib/afos-daily/schema'
import { breadcrumbSchema } from '../../../lib/seo/schema'
import { MONTHS, type MonthsLocale } from '../../../lib/i18n/months'
import { DailyArchiveShell, type ArchiveGroup, type ArchiveStrings } from '../../components/DailyArchiveShell'

const BASE = 'https://www.afos-analytics.com'

interface Props {
  params: Promise<{ locale: string }>
}

// Mirror the edition pages (which render the correct <html lang>): prerender one
// page per locale via generateStaticParams and DO NOT force-static (force-static
// with no params baked lang="pt-BR" into the /en and /es variants, SEO regression).
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

const T = {
  'pt-BR': {
    eyebrow: 'AFOS Daily',
    title: 'Arquivo de edições',
    subtitle: (n: number) => `${n} edições publicadas, da mais recente à mais antiga.`,
    latestLabel: 'Edição mais recente',
    readLatest: 'Ler agora →',
    jumpLabel: 'Ir para uma data:',
    themeAria: 'Tema da página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
    langAria: 'Selecionar idioma',
    metaTitle: 'Arquivo do AFOS Daily | AFOS Analytics',
    metaDesc: 'Todas as edições do AFOS Daily, síntese diária cruzando mercados de previsão, pesquisas e notícias da eleição brasileira de 2026.',
  },
  en: {
    eyebrow: 'AFOS Daily',
    title: 'Editions archive',
    subtitle: (n: number) => `${n} editions published, newest to oldest.`,
    latestLabel: 'Latest edition',
    readLatest: 'Read now →',
    jumpLabel: 'Jump to a date:',
    themeAria: 'Page theme',
    lightAria: 'Light mode',
    blueAria: 'Sapphire Blue mode',
    langAria: 'Select language',
    metaTitle: 'AFOS Daily archive | AFOS Analytics',
    metaDesc: 'All AFOS Daily editions, the daily synthesis cross-referencing prediction markets, polls and news on the 2026 Brazilian election.',
  },
  es: {
    eyebrow: 'AFOS Daily',
    title: 'Archivo de ediciones',
    subtitle: (n: number) => `${n} ediciones publicadas, de la más reciente a la más antigua.`,
    latestLabel: 'Edición más reciente',
    readLatest: 'Leer ahora →',
    jumpLabel: 'Ir a una fecha:',
    themeAria: 'Tema de la página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
    langAria: 'Seleccionar idioma',
    metaTitle: 'Archivo del AFOS Daily | AFOS Analytics',
    metaDesc: 'Todas las ediciones del AFOS Daily, la síntesis diaria que cruza mercados de predicción, encuestas y noticias de la elección brasileña de 2026.',
  },
} as const

function tLocale(locale: string): keyof typeof T {
  return locale === 'en' || locale === 'es' ? locale : 'pt-BR'
}

function monthsLocale(locale: string): MonthsLocale {
  return locale === 'en' || locale === 'es' ? locale : 'pt-BR'
}

function ogLocale(loc: string): string {
  return loc === 'pt-BR' ? 'pt_BR' : loc === 'es' ? 'es_ES' : 'en_US'
}

function fmtDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d || m < 1 || m > 12) return iso
  const loc = monthsLocale(locale)
  const month = MONTHS[loc][m - 1]
  return loc === 'en' ? `${month} ${d}, ${y}` : `${d} de ${month} de ${y}`
}

function fmtMonthHeading(ym: string, locale: string): string {
  const [y, m] = ym.split('-').map(Number)
  const loc = monthsLocale(locale)
  const month = MONTHS[loc][m - 1]
  const cap = month.charAt(0).toUpperCase() + month.slice(1)
  return `${cap} ${y}`
}

// Strips markdown emphasis and truncates the lede for the list snippet.
function snippet(lede: string, max = 150): string {
  const clean = lede.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean
}

function langAlternates(path: string): Record<string, string> {
  return {
    'pt-BR': `${BASE}/pt-BR/${path}`,
    en: `${BASE}/en/${path}`,
    es: `${BASE}/es/${path}`,
    'x-default': `${BASE}/pt-BR/${path}`,
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const loc = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const t = T[tLocale(loc)]
  const canonical = `${BASE}/${loc}/daily`
  const ogImage = getOgImageUrl(loc)
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: langAlternates('daily'),
      types: { 'application/rss+xml': [{ url: `${BASE}/feed/daily${loc === 'pt-BR' ? '' : '.' + loc}.xml`, title: 'AFOS Daily, RSS feed' }] },
    },
    openGraph: {
      type: 'website',
      title: t.metaTitle,
      description: t.metaDesc,
      url: canonical,
      siteName: 'AFOS Analytics',
      locale: ogLocale(loc),
      images: [{ url: ogImage, width: 1200, height: 627, alt: t.metaTitle }],
    },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDesc, images: [ogImage] },
  }
}

export default async function DailyArchivePage(props: Props) {
  const params = await props.params
  const loc = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const t = T[tLocale(loc)]

  const latest = getLatestDate()
  if (!latest) redirect(`/${loc}/dashboard/br`)

  // Newest-first list of published editions, with localized lede snippet.
  // Snippet only when the requested-locale file actually exists (data.locale === loc);
  // otherwise omit so an EN/ES indexable list never leaks a PT lede (parity guard).
  const dates = listPublishedDailies().slice().reverse()
  const items = dates.map((date) => {
    const data = loadDaily(date, loc)
    const localized = !!data && data.locale === loc
    return { date, dateLabel: fmtDate(date, loc), snippet: localized ? snippet(data.lede ?? '') : '' }
  })

  const oldest = dates[dates.length - 1]
  const latestData = loadDaily(latest, loc)
  const latestItem = {
    date: latest,
    dateLabel: fmtDate(latest, loc),
    snippet: latestData && latestData.locale === loc ? snippet(latestData.lede ?? '', 180) : '',
  }

  // Group by YYYY-MM, preserving newest-first order.
  const groups: ArchiveGroup[] = []
  for (const it of items) {
    const ym = it.date.slice(0, 7)
    const heading = fmtMonthHeading(ym, loc)
    const last = groups[groups.length - 1]
    if (last && last.heading === heading) last.items.push(it)
    else groups.push({ heading, items: [it] })
  }

  const strings: ArchiveStrings = {
    eyebrow: t.eyebrow,
    title: t.title,
    subtitle: t.subtitle(items.length),
    latestLabel: t.latestLabel,
    readLatest: t.readLatest,
    jumpLabel: t.jumpLabel,
    themeAria: t.themeAria,
    lightAria: t.lightAria,
    blueAria: t.blueAria,
    langAria: t.langAria,
  }

  // CollectionPage + ItemList so crawlers/LLMs can parse the full back-catalog,
  // plus a Home > AFOS Daily breadcrumb. URLs/dates only, no editorial text.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t.metaTitle,
    description: t.metaDesc,
    url: `${BASE}/${loc}/daily`,
    inLanguage: loc,
    isPartOf: { '@id': `${BASE}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/${loc}/daily/${it.date}`,
        name: it.dateLabel,
      })),
    },
  }
  const breadcrumb = breadcrumbSchema(loc as 'pt-BR' | 'en' | 'es', [
    { name: 'AFOS Analytics', path: '' },
    { name: t.metaTitle, path: 'daily' },
  ])

  return (
    <>
      <JsonLd data={[collectionSchema, breadcrumb]} />
      <DailyArchiveShell locale={loc} strings={strings} latest={latestItem} oldest={oldest} groups={groups} />
    </>
  )
}
