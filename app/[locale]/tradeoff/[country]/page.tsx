import type { Metadata } from 'next'
import { JsonLd } from '../../../components/JsonLd'
import { notFound } from 'next/navigation'
import { getLatestDate, listPublishedTradeoffs, loadTradeoff, isValidLocale, isValidCountry, PAIS_PADRAO, PAISES_TRADEOFF, SUPPORTED_LOCALES } from '../../../../lib/afos-tradeoff/loader'
import { getOgImageUrl } from '../../../../lib/afos-daily/schema'
import { feedPath, type FeedLocale, type FeedCountry } from '../../../../lib/feeds/rss'
import { breadcrumbSchema } from '../../../../lib/seo/schema'
import { MONTHS, type MonthsLocale } from '../../../../lib/i18n/months'
import { TradeoffArchiveShell, type TradeoffArchiveGroup, type TradeoffArchiveStrings, type TradeoffArchiveItem } from '../../../components/TradeoffArchiveShell'

const BASE = 'https://www.afos-analytics.com'

interface Props {
  params: Promise<{ locale: string; country: string }>
}

/**
 * ⚠️ ESTE SEGMENTO É O PAÍS, e só o país. O Next não aceita `tradeoff/[date]` e
 * `tradeoff/[country]` no mesmo nível, porque são dois nomes dinâmicos
 * disputando a mesma posição, então tudo que chega aqui é lido como país:
 *
 *   `/tradeoff/br`          → arquivo de edições do Brasil
 *   `/tradeoff/us`          → arquivo de edições dos EUA
 *   `/tradeoff/2026-07-27`  → 404
 *
 * 🔴 O 404 NA FORMA DE DATA É DECISÃO DO ANDRÉ, DE 07/Ago/2026, e substitui um
 * redirect que mandava tudo para o Brasil.
 *
 * Por que o redirect era pior que o 404, apesar de parecer mais gentil: até
 * 27/Jul só existia o Brasil, então todo endereço sem país era mesmo brasileiro
 * e o redirect acertava. **A partir de 31/Jul o Tradeoff dos EUA passou a
 * existir, e em 03/Ago as duas edições caíram na MESMA DATA.** Medido em
 * produção naquele dia: `/en/tradeoff/2026-08-03` respondia **307 e entregava a
 * edição BRASILEIRA**, com manchete de um país e peça de outro, sem 404 e sem
 * link quebrado. Endereço ambíguo resolvido em silêncio é pior que endereço
 * inexistente: o 404 o leitor entende, a peça errada ele lê como verdade.
 *
 * ⚠️ Quem quer o produto sem saber o país continua tendo porta: `/tradeoff`,
 * sem segmento nenhum, segue redirecionando para o Brasil, que é o país de
 * origem. O que morre aqui é só a forma AMBÍGUA, nunca a forma CURTA.
 *
 * 📌 Isto obrigou dois consertos que não são cosméticos, porque o `llms.txt`
 * publicava TODA edição do Tradeoff nesta forma antiga. Sem eles, virar 404
 * mataria de uma vez todos os links do produto entregues a robô de IA. Ver
 * `lib/llms/llms-txt.ts`.
 */

// Mirror the edition pages (correct <html lang> per locale): prerender per locale
// and do NOT force-static (force-static baked lang="pt-BR" into /en and /es).
export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) => PAISES_TRADEOFF.map((country) => ({ locale, country })))
}

// Endereço antigo com data no lugar do país precisa ser resolvido em tempo de
// requisição, e ele não está na lista acima.
export const dynamicParams = true

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

  /**
   * 🔴 Segmento que não é país agora dá 404 na página, e o metadado precisa
   * dizer a MESMA coisa. Antes daqui saía `?? PAIS_PADRAO`, ou seja, a página
   * inexistente vinha com canônico do Brasil e `index: true`: um endereço morto
   * se anunciando ao buscador como o arquivo brasileiro.
   */
  if (!isValidCountry(params.country)) {
    return { title: t.metaTitle, robots: { index: false, follow: false } }
  }
  const pais = params.country
  const canonical = `${BASE}/${loc}/tradeoff/${pais}`
  const ogImage = getOgImageUrl(loc)
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      // ⚠️ COM O PAÍS. Sem ele o hreflang do arquivo dos EUA declarava que as
      // versões em outro idioma eram o arquivo do BRASIL, e ainda contradizia
      // o canonical da própria página, que já traz `/us`.
      languages: langAlternates(`tradeoff/${pais}`),
      // ⚠️ COM O PAÍS, pelo mesmo motivo do hreflang acima. Até 10/Ago/2026
      // esta linha era fixa no feed do BRASIL, então a página dos EUA anunciava
      // aos leitores de RSS um feed que nunca traria as edições dela.
      types: { 'application/rss+xml': [{ url: `${BASE}${feedPath('tradeoff', loc as FeedLocale, pais as FeedCountry)}`, title: `AFOS Tradeoff${pais === 'br' ? '' : ' US'}, RSS feed` }] },
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

  // Não é país: não existe. Ver a nota longa no topo do arquivo.
  if (!isValidCountry(params.country)) notFound()
  const pais = params.country
  const t = T[tLocale(loc)]

  const latest = getLatestDate(pais)

  /**
   * País válido e ainda SEM edição. Antes daqui saía um redirect para o painel,
   * rede de segurança que fazia sentido quando só existia o Brasil, que nunca
   * fica sem edição. Com o país no endereço isso passou a mandar quem pedia
   * `/tradeoff/us` para o painel brasileiro, que é resposta errada para a
   * pergunta feita.
   *
   * O estado vazio diz a verdade: o produto para este país ainda não começou.
   */
  if (!latest) {
    const vazio = {
      'pt-BR': {
        titulo: 'AFOS Tradeoff',
        aviso: 'Ainda não há edição publicada para este país.',
        volta: 'Ver as edições do Brasil',
      },
      en: {
        titulo: 'AFOS Tradeoff',
        aviso: 'No edition has been published for this country yet.',
        volta: 'See the Brazil editions',
      },
      es: {
        titulo: 'AFOS Tradeoff',
        aviso: 'Todavía no hay edición publicada para este país.',
        volta: 'Ver las ediciones de Brasil',
      },
    }[tLocale(loc)]
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-3 text-2xl font-bold text-primary">{vazio.titulo}</h1>
        <p className="text-sm text-gray-700">{vazio.aviso}</p>
        <a
          href={`/${loc}/tradeoff/${PAIS_PADRAO}`}
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          {vazio.volta} →
        </a>
      </main>
    )
  }

  const dates = listPublishedTradeoffs(pais).slice().reverse()
  const items: TradeoffArchiveItem[] = dates.map((date) => {
    const data = loadTradeoff(date, loc, pais)
    const localized = !!data && data.locale === loc
    const primary = data ? `${t.issueLabel} №${data.issueNumber}` : date
    const secondary = data?.weekStart && data?.weekEnd ? `${t.weekOf} ${fmtWeekRange(data.weekStart, data.weekEnd, loc)}` : ''
    return { date, primary, secondary, snippet: localized ? snippet(data.sinalDaSemana ?? '') : '' }
  })

  const latestData = loadTradeoff(latest, loc, pais)
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
    url: `${BASE}/${loc}/tradeoff/${pais}`,
    inLanguage: loc,
    isPartOf: { '@id': `${BASE}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/${loc}/tradeoff/${pais}/${it.date}`,
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
      {/* 🔴 `country` PRECISA ser passado, e não era. O shell já sabia usá-lo,
          mas a página nunca o entregava, então ele caía no padrão `?? 'br'`.
          Consequência em /en/tradeoff/us: a bandeira sumia, o seletor de idioma
          voltava para o Brasil e, o pior, TODOS os links de edição apontavam
          para /tradeoff/BR/{data}. O arquivo dos EUA levava às edições
          BRASILEIRAS, sem 404 e sem link quebrado. Pego em 06/Ago/2026. */}
      <TradeoffArchiveShell locale={loc} strings={strings} latest={latestItem} groups={groups} country={pais} />
    </>
  )
}
