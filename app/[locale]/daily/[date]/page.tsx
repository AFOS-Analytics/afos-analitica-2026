import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AfosDailyTemplate } from '../../../components/AfosDailyTemplate'
import { loadDaily, listDailies, isValidDate, isValidLocale, SUPPORTED_LOCALES, getAdjacentDates } from '../../../../lib/afos-daily/loader'
import { buildArticleSchema, getOgImageUrl, parseUpdatedAt } from '../../../../lib/afos-daily/schema'

interface PageProps {
  params: { locale: string; date: string }
}

export async function generateStaticParams() {
  const dates = listDailies()
  return SUPPORTED_LOCALES.flatMap(locale => dates.map(date => ({ locale, date })))
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isValidLocale(params.locale) || !isValidDate(params.date)) {
    return { title: 'AFOS Daily | AFOS Analytics', robots: { index: false, follow: false } }
  }
  const data = loadDaily(params.date, params.locale)
  if (!data) return { title: 'AFOS Daily | AFOS Analytics', robots: { index: false, follow: false } }

  const ledePlain = data.lede.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 240)
  const url = `https://afos-analytics.com/${params.locale}/daily/${params.date}`
  const ogImage = getOgImageUrl()
  const publishedTime = `${data.date}T00:00:00-03:00`
  const modifiedTime = parseUpdatedAt(data.updatedAt, data.date)

  return {
    title: `${data.title} | AFOS Analytics`,
    description: ledePlain,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': [
          { url: 'https://afos-analytics.com/feed/daily.xml', title: 'AFOS Daily — RSS feed' },
        ],
      },
    },
    openGraph: {
      type: 'article',
      title: data.title,
      description: ledePlain,
      url,
      siteName: 'AFOS Analytics',
      locale: params.locale,
      publishedTime,
      modifiedTime,
      authors: ['AFOS Analytics'],
      section: 'Politics',
      tags: ['Brazil 2026 election', 'prediction markets', 'electoral polls', 'political risk'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'AFOS Analytics — Daily Synthesis',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: ledePlain,
      images: [ogImage],
    },
  }
}

export default function DailyByDatePage({ params }: PageProps) {
  if (!isValidLocale(params.locale)) notFound()
  if (!isValidDate(params.date)) notFound()
  const data = loadDaily(params.date, params.locale)
  if (!data) notFound()

  const schema = buildArticleSchema(data, params.locale)
  const nav = getAdjacentDates(params.date)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AfosDailyTemplate data={data} nav={nav} />
    </>
  )
}
