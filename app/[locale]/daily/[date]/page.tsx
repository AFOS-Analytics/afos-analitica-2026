import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AfosDailyTemplate } from '../../../components/AfosDailyTemplate'
import { loadDaily, listDailies, isValidDate } from '../../../../lib/afos-daily/loader'
import { buildArticleSchema, getOgImageUrl, parseUpdatedAt } from '../../../../lib/afos-daily/schema'

interface PageProps {
  params: { locale: string; date: string }
}

export async function generateStaticParams() {
  const locales = ['pt-BR', 'en', 'es']
  const dates = listDailies()
  return locales.flatMap(locale => dates.map(date => ({ locale, date })))
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isValidDate(params.date)) return { title: 'AFOS Daily | AFOS Analytics' }
  const data = loadDaily(params.date)
  if (!data) return { title: 'AFOS Daily | AFOS Analytics' }

  const ledePlain = data.lede.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 240)
  const url = `https://afos-analytics.com/${params.locale}/daily/${params.date}`
  const ogImage = getOgImageUrl()
  const publishedTime = `${data.date}T00:00:00-03:00`
  const modifiedTime = parseUpdatedAt(data.updatedAt, data.date)

  return {
    title: `${data.title} | AFOS Analytics`,
    description: ledePlain,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
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
  if (!isValidDate(params.date)) notFound()
  const data = loadDaily(params.date)
  if (!data) notFound()

  const schema = buildArticleSchema(data, params.locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AfosDailyTemplate data={data} />
    </>
  )
}
