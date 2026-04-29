import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AfosDailyTemplate } from '../../../components/AfosDailyTemplate'
import { loadDaily, listDailies, isValidDate } from '../../../../lib/afos-daily/loader'

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

  const ledePlain = data.lede.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 200)

  return {
    title: `${data.title} | AFOS Analytics`,
    description: ledePlain,
    robots: { index: false, follow: false },
    alternates: { canonical: `https://afos-analytics.com/${params.locale}/daily/${params.date}` },
    openGraph: {
      type: 'article',
      title: data.title,
      description: ledePlain,
      publishedTime: data.date,
      modifiedTime: data.updatedAt,
    },
  }
}

export default function DailyByDatePage({ params }: PageProps) {
  if (!isValidDate(params.date)) notFound()
  const data = loadDaily(params.date)
  if (!data) notFound()

  return <AfosDailyTemplate data={data} />
}
