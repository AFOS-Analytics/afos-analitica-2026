import type { Metadata } from 'next'
import { JsonLd } from '../../../../components/JsonLd'
import { notFound } from 'next/navigation'
import { AfosTradeoffTemplate, type TradeoffRenderedMd } from '../../../../components/AfosTradeoffTemplate'
import { Inline, InlineSpan, Body } from '../../../../components/TradeoffMarkdown'
import {
  isValidCountry,
  PAIS_PADRAO,
  PAISES_TRADEOFF,
  loadTradeoff,
  listPublishedTradeoffs,
  isValidDate,
  isValidLocale,
  SUPPORTED_LOCALES,
  isVisibleInProduction,
  tradeoffExists,
  getAdjacentDates,
  type PaisTradeoff,
} from '../../../../../lib/afos-tradeoff/loader'
import { buildArticleSchema, buildBreadcrumbSchema, getOgImageUrl, parseUpdatedAt } from '../../../../../lib/afos-tradeoff/schema'
import { feedPath, type FeedLocale, type FeedCountry } from '../../../../../lib/feeds/rss'

/** 🏷️ Assunto do cartão social, POR PAÍS. Ver comentário no bloco openGraph. */
// 🔒 08/Nov/2026: tipado por `PaisTradeoff`. Um país novo em PAISES_TRADEOFF
// (a França) sem a sua linha aqui NÃO COMPILA, em vez de cair calado nas
// etiquetas do Brasil, como fazia o `?? TAGS_POR_PAIS.br`.
const TAGS_POR_PAIS: Record<PaisTradeoff, string[]> = {
  br: ['Brazil 2026 election', 'prediction markets', 'electoral polls', 'political risk', 'weekly analysis'],
  us: ['US 2026 midterms', 'prediction markets', 'electoral polls', 'political risk', 'weekly analysis'],
  fr: ['France 2027 presidential election', 'prediction markets', 'electoral polls', 'political risk', 'weekly analysis'],
}

/** 🔒 08/Nov/2026: era `pais === 'br' ? '' : ' US'`, e QUALQUER terceiro país sairia "US". */
const SUFIXO_FEED_POR_PAIS: Record<PaisTradeoff, string> = {
  br: '',
  us: ' US',
  fr: ' France',
}

interface PageProps {
  params: Promise<{ locale: string; country: string; date: string }>
}

// ✅ 12/Nov/2026: SAIU o `force-dynamic`. Ele nasceu quando não havia Tradeoff
// publicado e a lista de generateStaticParams vinha vazia; hoje há dezenas.
// `process.env.VERCEL_ENV` NÃO é API dinâmica (é lido no build e no servidor
// do mesmo jeito, como em daily/[date]), e o que deixava o site inteiro sem
// cache era o `headers()` do antigo app/layout.tsx. Agora:
//   - as edições publicadas saem prontas do build (generateStaticParams);
//   - `dynamicParams = true` mantém o rascunho abrindo no preview, renderizado
//     sob demanda (em produção ele segue dando 404 pelo portão abaixo);
//   - `revalidate` renova a página guardada a cada hora.
export const dynamicParams = true
export const revalidate = 3600

export async function generateStaticParams() {
  const dates = PAISES_TRADEOFF.flatMap((c) => listPublishedTradeoffs(c).map((date) => ({ country: c, date })))
  return SUPPORTED_LOCALES.flatMap(locale => dates.map(({ country, date }) => ({ locale, country, date })))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const pais = isValidCountry(params.country) ? params.country : PAIS_PADRAO;
  if (!isValidLocale(params.locale) || !isValidDate(params.date)) {
    return { title: 'AFOS Tradeoff | AFOS Analytics', robots: { index: false, follow: false } }
  }
  const data = loadTradeoff(params.date, params.locale, pais)
  if (!data) return { title: 'AFOS Tradeoff | AFOS Analytics', robots: { index: false, follow: false } }

  const isDraft = data.status !== 'published'

  const sinalPlain = data.sinalDaSemana.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 240)
  const url = `https://www.afos-analytics.com/${params.locale}/tradeoff/${pais}/${params.date}`
  const ogImage = getOgImageUrl(params.locale, data.ogImage)
  const publishedTime = `${data.date}T00:00:00-03:00`
  const modifiedTime = parseUpdatedAt(data.updatedAt, data.date)

  return {
    title: `${data.title} | AFOS Analytics`,
    description: sinalPlain,
    robots: isDraft
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    alternates: {
      canonical: url,
      languages: (() => {
        const langs: Record<string, string> = {}
        for (const loc of SUPPORTED_LOCALES) {
          if (tradeoffExists(params.date, loc, pais)) langs[loc] = `https://www.afos-analytics.com/${loc}/tradeoff/${pais}/${params.date}`
        }
        if (langs['pt-BR'] || langs['en'] || langs['es']) {
          langs['x-default'] = langs['pt-BR'] || langs['en'] || langs['es']
        }
        return langs
      })(),
      // ⚠️ COM O PAÍS. Até 10/Ago/2026 esta linha era fixa no feed do BRASIL, e
      // toda edição dos EUA anunciava um feed que nunca traria a própria peça.
      types: {
        'application/rss+xml': [
          {
            url: `https://www.afos-analytics.com${feedPath('tradeoff', params.locale as FeedLocale, pais as FeedCountry)}`,
            title: `AFOS Tradeoff${SUFIXO_FEED_POR_PAIS[pais]}, RSS feed`,
          },
        ],
      },
    },
    openGraph: {
      type: 'article',
      title: data.title,
      description: sinalPlain,
      url,
      siteName: 'AFOS Analytics',
      locale: params.locale === 'es' ? 'es_ES' : params.locale === 'en' ? 'en_US' : 'pt_BR',
      publishedTime,
      modifiedTime,
      authors: ['AFOS Analytics'],
      section: 'Politics',
      // 🏷️ POR PAÍS. Era fixo em "Brazil 2026 election" e ia junto na edição
      // americana, dizendo ao scraper social que a peça era sobre outra eleição.
      // Corrigido em 03/Ago/2026, no mesmo dia em que o cartão do Weekly foi
      // pego anunciando o Brasil num link das midterms.
      tags: TAGS_POR_PAIS[pais],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 627,
          alt: 'AFOS Analytics, Weekly Tradeoff',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: sinalPlain,
      images: [ogImage],
    },
  }
}

export default async function TradeoffByDatePage(props: PageProps) {
  const params = await props.params;
  if (!isValidLocale(params.locale)) notFound()
  if (!isValidDate(params.date)) notFound()
  /**
   * 🔴 PAÍS INVÁLIDO É 404, NUNCA O BRASIL.
   *
   * Isto caía em `PAIS_PADRAO`, então um endereço com país errado servia a
   * edição BRASILEIRA com HTTP 200. Regra do André em 06/Ago/2026: o que é da
   * eleição brasileira é brasileiro, o que é da americana é americano, e as
   * duas são independentes. Errar o país tem que doer na hora, não entregar a
   * peça do outro país calado.
   */
  if (!isValidCountry(params.country)) notFound()
  const pais = params.country;
  // ⚠️ O país precisa ir junto: sem ele a checagem de rascunho lia o arquivo do
  // BRASIL com a mesma data. Hoje isso acerta por acidente (o arquivo não
  // existe, então cai em draft), e erraria feio no dia em que as duas edições
  // coincidissem de data.
  if (process.env.VERCEL_ENV === 'production' && !isVisibleInProduction(params.date, pais)) notFound()
  const data = loadTradeoff(params.date, params.locale, pais)
  if (!data) notFound()
  // 🔴 O loader cai para o pt-BR quando falta a tradução, e servia a peça em
  // português sob /en e /es sem nada dizer, com o hreflang da própria página
  // afirmando que aquela versão existe naquele idioma. É a mesma trava que o
  // Daily já aplica. Em produção, tradução ausente vira 404, não peça trocada.
  if (process.env.VERCEL_ENV === 'production' && data.locale !== params.locale) notFound()

  // ⚠️ Com o país: sem ele a edição dos EUA oferecia "edição anterior" numa
  // data do BRASIL, que no caminho `/tradeoff/us/...` não existe e dava 404.
  const nav = getAdjacentDates(params.date, pais)
  const schema = buildArticleSchema(data, params.locale, pais)
  const breadcrumb = buildBreadcrumbSchema(params.date, params.locale, pais)

  // Markdown renderizado no servidor (react-markdown fora do bundle client).
  const md: TradeoffRenderedMd = {
    sinalDaSemana: data.sinalDaSemana ? <Inline text={data.sinalDaSemana} /> : undefined,
    execSummaryIntro: data.execSummaryIntro ? <Inline text={data.execSummaryIntro} /> : undefined,
    antiAvgIntro: data.antiAvgIntro ? <Inline text={data.antiAvgIntro} /> : undefined,
    antiAvgClosing: data.antiAvgClosing ? <Inline text={data.antiAvgClosing} /> : undefined,
    scenariosIntro: data.scenariosIntro ? <Inline text={data.scenariosIntro} /> : undefined,
    calendarFooter: data.calendarFooter ? <Inline text={data.calendarFooter} /> : undefined,
    methodology: data.methodology ? <Inline text={data.methodology} /> : undefined,
    trackRecord: data.trackRecord ? <Inline text={data.trackRecord} /> : undefined,
    body: (!data.summaryCards && data.body) ? <Body text={data.body} /> : undefined,
    antiAvgFooter: data.antiAvg?.footer ? <Inline text={data.antiAvg.footer} /> : undefined,
    antiAvgRightDetails: data.antiAvg?.rightDetails?.map((d, i) => <InlineSpan key={i} text={d} />),
    scenarioTexts: data.scenarios?.map((s, i) => <Inline key={i} text={s.text} />),
    liquidityAnomaly: data.liquidity?.anomalyText ? <Inline text={data.liquidity.anomalyText} /> : undefined,
    liquidityFooter: data.liquidity?.footer ? <Inline text={data.liquidity.footer} /> : undefined,
    additionalIntro: data.additionalReading?.intro ? <Inline text={data.additionalReading.intro} /> : undefined,
    additionalFooter: data.additionalReading?.footer ? <Inline text={data.additionalReading.footer} /> : undefined,
  }

  return (
    <>
      <JsonLd data={[schema, breadcrumb]} />
      <AfosTradeoffTemplate country={pais} data={data} nav={nav} md={md} />
    </>
  )
}
