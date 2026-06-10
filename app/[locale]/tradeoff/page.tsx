import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getLatestDate, listPublishedTradeoffs, loadTradeoff, isValidLocale } from '../../../lib/afos-tradeoff/loader'
import { MONTHS, type MonthsLocale } from '../../../lib/i18n/months'
import { TradeoffArchiveShell, type TradeoffArchiveGroup, type TradeoffArchiveStrings, type TradeoffArchiveItem } from '../../components/TradeoffArchiveShell'

export const dynamic = 'force-static'

interface Props {
  params: Promise<{ locale: string }>
}

const T = {
  'pt-BR': {
    backToDashboard: '← Voltar ao Dashboard',
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
    backToDashboard: '← Back to Dashboard',
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
    backToDashboard: '← Volver al Dashboard',
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

function fmtWeekRange(start: string, end: string, locale: string): string {
  const p1 = start.split('-').map(Number)
  const p2 = end.split('-').map(Number)
  if (p1.length !== 3 || p2.length !== 3) return `${start} – ${end}`
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const loc = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const t = T[tLocale(loc)]
  const canonical = `https://www.afos-analytics.com/${loc}/tradeoff`
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    robots: { index: true, follow: true },
    alternates: { canonical },
  }
}

export default async function TradeoffArchivePage(props: Props) {
  const params = await props.params
  const loc = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const t = T[tLocale(loc)]

  const latest = getLatestDate()
  if (!latest) redirect(`/${loc}/dashboard`)

  const dates = listPublishedTradeoffs().slice().reverse()
  const items: TradeoffArchiveItem[] = dates.map((date) => {
    const data = loadTradeoff(date, loc)
    const primary = data ? `${t.issueLabel} №${data.issueNumber}` : date
    const secondary = data?.weekStart && data?.weekEnd ? `${t.weekOf} ${fmtWeekRange(data.weekStart, data.weekEnd, loc)}` : ''
    return { date, primary, secondary, snippet: snippet(data?.sinalDaSemana ?? '') }
  })

  const latestData = loadTradeoff(latest, loc)
  const latestItem: TradeoffArchiveItem = {
    date: latest,
    primary: latestData ? `${t.issueLabel} №${latestData.issueNumber}` : latest,
    secondary: latestData?.weekStart && latestData?.weekEnd ? `${t.weekOf} ${fmtWeekRange(latestData.weekStart, latestData.weekEnd, loc)}` : '',
    snippet: snippet(latestData?.sinalDaSemana ?? '', 200),
  }

  const groups: TradeoffArchiveGroup[] = []
  for (const it of items) {
    const heading = fmtMonthHeading(it.date.slice(0, 7), loc)
    const last = groups[groups.length - 1]
    if (last && last.heading === heading) last.items.push(it)
    else groups.push({ heading, items: [it] })
  }

  const strings: TradeoffArchiveStrings = {
    backToDashboard: t.backToDashboard,
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

  return <TradeoffArchiveShell locale={loc} strings={strings} latest={latestItem} groups={groups} />
}
