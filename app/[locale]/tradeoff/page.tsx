import type { Metadata } from 'next'
import { JsonLd } from '../../components/JsonLd'
import { redirect } from 'next/navigation'
import { getLatestDate, listPublishedTradeoffs, loadTradeoff, isValidLocale, SUPPORTED_LOCALES } from '../../../lib/afos-tradeoff/loader'
import { getOgImageUrl } from '../../../lib/afos-daily/schema'
import { breadcrumbSchema } from '../../../lib/seo/schema'
import { MONTHS, type MonthsLocale } from '../../../lib/i18n/months'
import { TradeoffArchiveShell, type TradeoffArchiveGroup, type TradeoffArchiveStrings, type TradeoffArchiveItem } from '../../components/TradeoffArchiveShell'

const BASE = 'https://www.afos-analytics.com'

interface Props {
  params: Promise<{ locale: string }>
}

// Mirror the edition pages (correct <html lang> per locale): prerender per locale
// and do NOT force-static (force-static baked lang="pt-BR" into /en and /es).
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

const T = {
  'pt-BR': {
    eyebrow: 'AFOS Tradeoff',
    title: 'Arquivo de edições',
    subtitle: (n: number) => `${n} ${n === 1 ? 'edição publicada' : 'edições publicadas'}, da mais recente à mais antiga.`,
    latestLabel: 'Edição mais recente',
    readLatest: 'Ler agora →',
    issueLabel: 'Edição',
    weekOf: 'Semana de',
    themeAria: 'Tema da página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
    langAria: 'Selecionar idioma',
    metaTitle: 'Arquivo do AFOS Tradeoff | AFOS Analytics',
    metaDesc: 'Todas as edições do AFOS Tradeoff, o brief técnico semanal de risco político eleitoral sem médias suavizadas.',
  },
  en: {
    eyebrow: 'AFOS Tradeoff',
    title: 'Editions archive',
    subtitle: (n: number) => `${n} ${n === 1 ? 'edition published' : 'editions published'}, newest to oldest.`,
    latestLabel: 'Latest edition',
    readLatest: 'Read now →',
    issueLabel: 'Issue',
    weekOf: 'Week of',
    themeAria: 'Page theme',
    lightAria: 'Light mode',
    blueAria: 'Sapphire Blue mode',
    langAria: 'Select language',
    metaTitle: 'AFOS Tradeoff archive | AFOS Analytics',
    metaDesc: 'All AFOS Tradeoff editions, the weekly technical brief on electoral political risk without smoothed averages.',
  },
  es: {
    eyebrow: 'AFOS Tradeoff',
    title: 'Archivo de ediciones',
    subtitle: (n: number) => `${n} ${n === 1 ? 'edición publicada' : 'ediciones publicadas'}, de la más reciente a la más antigua.`,
    latestLabel: 'Edición más reciente',
    readLatest: 'Leer ahora →',
    issueLabel: 'Edición',
    weekOf: 'Semana del',
    themeAria: 'Tema de la página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
    langAria: 'Seleccionar idioma',
    metaTitle: 'Archivo del AFOS Tradeoff | AFOS Analytics',
    metaDesc: 'Todas las ediciones del AFOS Tradeoff, el brief técnico semanal de riesgo político electoral sin promedios suavizados.',
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

function fmtWeekRange(start: string, end: string, locale: string): string {
  const p1 = start.split('-').map(Number)
  const p2 = end.split('-').map(Number)
  if (p1.length !== 3 || p2.length !== 3) return `${start}, ${end}`
  const [, m1, d1] = p1
  const [y2, m2, d2] = p2
  const loc = monthsLocale(locale)
  const mn1 = MONTHS[loc][m1 - 1]
  const mn2 = MONTHS[loc][m2 - 1]
  if (m1 === m2) return loc === 'en' ? `${mn2} ${d1}-${d2}, ${y2}` : `${d1}-${d2} ${mn2} ${y2}`
  return loc === 'en' ? `${mn1} ${d1} - ${mn2} ${d2}, ${y2}` : `${d1} ${mn1} - ${d2} ${mn2} ${y2}`
}

function fmtMonthHeading(ym: string, locale: string): string {
  const [y, m] = ym.split('-').map(Number)
  const loc = monthsLocale(locale)
  const month = MONTHS[loc][m - 1]
  const cap = month.charAt(0).toUpperCase() + month.slice(1)
  return `${cap} ${y}`
}

function snippet(s: string, max = 160): string {
  const clean = s.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim()
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
  const canonical = `${BASE}/${loc}/tradeoff`
  const ogImage = getOgImageUrl(loc)
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: langAlternates('tradeoff'),
      types: { 'application/rss+xml': [{ url: `${BASE}/feed/tradeoff${loc === 'pt-BR' ? '' : '.' + loc}.xml`, title: 'AFOS Tradeoff, RSS feed' }] },
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

export default async function TradeoffArchivePage(props: Props) {
  const params = await props.params
  const loc = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const t = T[tLocale(loc)]

  const latest = getLatestDate()
  if (!latest) redirect(`/${loc}/dashboard/br`)

  const dates = listPublishedTradeoffs().slice().reverse()
  const items: TradeoffArchiveItem[] = dates.map((date) => {
    const data = loadTradeoff(date, loc)
    const localized = !!data && data.locale === loc
    const primary = data ? `${t.issueLabel} №${data.issueNumber}` : date
    const secondary = data?.weekStart && data?.weekEnd ? `${t.weekOf} ${fmtWeekRange(data.weekStart, data.weekEnd, loc)}` : ''
    return { date, primary, secondary, snippet: localized ? snippet(data.sinalDaSemana ?? '') : '' }
  })

  const latestData = loadTradeoff(latest, loc)
  const latestItem: TradeoffArchiveItem = {
    date: latest,
    primary: latestData ? `${t.issueLabel} №${latestData.issueNumber}` : latest,
    secondary: latestData?.weekStart && latestData?.weekEnd ? `${t.weekOf} ${fmtWeekRange(latestData.weekStart, latestData.weekEnd, loc)}` : '',
    snippet: latestData && latestData.locale === loc ? snippet(latestData.sinalDaSemana ?? '', 200) : '',
  }

  const groups: TradeoffArchiveGroup[] = []
  for (const it of items) {
    const heading = fmtMonthHeading(it.date.slice(0, 7), loc)
    const last = groups[groups.length - 1]
    if (last && last.heading === heading) last.items.push(it)
    else groups.push({ heading, items: [it] })
  }

  const strings: TradeoffArchiveStrings = {
    eyebrow: t.eyebrow,
    title: t.title,
    subtitle: t.subtitle(items.length),
    latestLabel: t.latestLabel,
    readLatest: t.readLatest,
    themeAria: t.themeAria,
    lightAria: t.lightAria,
    blueAria: t.blueAria,
    langAria: t.langAria,
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t.metaTitle,
    description: t.metaDesc,
    url: `${BASE}/${loc}/tradeoff`,
    inLanguage: loc,
    isPartOf: { '@id': `${BASE}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/${loc}/tradeoff/${it.date}`,
        name: it.primary,
      })),
    },
  }
  const breadcrumb = breadcrumbSchema(loc as 'pt-BR' | 'en' | 'es', [
    { name: 'AFOS Analytics', path: '' },
    { name: t.metaTitle, path: 'tradeoff' },
  ])

  return (
    <>
      <JsonLd data={[collectionSchema, breadcrumb]} />
      <TradeoffArchiveShell locale={loc} strings={strings} latest={latestItem} groups={groups} />
    </>
  )
}
