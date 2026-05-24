import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AfosTradeoffTemplate } from '../../../components/AfosTradeoffTemplate'
import {
  loadTradeoff,
  listPublishedTradeoffs,
  isValidDate,
  isValidLocale,
  SUPPORTED_LOCALES,
  isVisibleInProduction,
  tradeoffExists,
  getAdjacentDates,
} from '../../../../lib/afos-tradeoff/loader'
import { buildArticleSchema, buildBreadcrumbSchema, getOgImageUrl, parseUpdatedAt } from '../../../../lib/afos-tradeoff/schema'

interface PageProps {
  params: Promise<{ locale: string; date: string }>
}

// Force dynamic rendering. With zero published Tradeoffs initially,
// generateStaticParams returns [], which would make Next.js 15 attempt
// static fallback rendering — but the page reads process.env.VERCEL_ENV
// (a dynamic API), causing DYNAMIC_SERVER_USAGE crash. Forcing dynamic
// makes every request go through SSR cleanly, no static fallback.
// TODO post-launch: once Tradeoff has N≥2 published editions, switch
// back to SSG fallback for better cache hit rate.
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const dates = listPublishedTradeoffs()
  return SUPPORTED_LOCALES.flatMap(locale => dates.map(date => ({ locale, date })))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  if (!isValidLocale(params.locale) || !isValidDate(params.date)) {
    return { title: 'AFOS Tradeoff | AFOS Analytics', robots: { index: false, follow: false } }
  }
  const data = loadTradeoff(params.date, params.locale)
  if (!data) return { title: 'AFOS Tradeoff | AFOS Analytics', robots: { index: false, follow: false } }

  const isDraft = data.status !== 'published'

  const sinalPlain = data.sinalDaSemana.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 240)
  const url = `https://afos-analytics.com/${params.locale}/tradeoff/${params.date}`
  const ogImage = getOgImageUrl(params.locale)
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
          if (tradeoffExists(params.date, loc)) langs[loc] = `https://afos-analytics.com/${loc}/tradeoff/${params.date}`
        }
        if (langs['pt-BR'] || langs['en'] || langs['es']) {
          langs['x-default'] = langs['pt-BR'] || langs['en'] || langs['es']
        }
        return langs
      })(),
      types: {
        'application/rss+xml': [
          { url: 'https://afos-analytics.com/feed/tradeoff.xml', title: 'AFOS Tradeoff — RSS feed' },
        ],
      },
    },
    openGraph: {
      type: 'article',
      title: data.title,
      description: sinalPlain,
      url,
      siteName: 'AFOS Analytics',
      locale: params.locale,
      publishedTime,
      modifiedTime,
      authors: ['AFOS Analytics'],
      section: 'Politics',
      tags: ['Brazil 2026 election', 'prediction markets', 'electoral polls', 'political risk', 'weekly analysis'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'AFOS Analytics — Weekly Tradeoff',
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
  if (process.env.VERCEL_ENV === 'production' && !isVisibleInProduction(params.date)) notFound()
  const data = loadTradeoff(params.date, params.locale)
  if (!data) notFound()

  const nav = getAdjacentDates(params.date)
  const schema = buildArticleSchema(data, params.locale)
  const breadcrumb = buildBreadcrumbSchema(params.date, params.locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumb]) }}
      />
      <AfosTradeoffTemplate data={data} nav={nav} />
    </>
  )
}
