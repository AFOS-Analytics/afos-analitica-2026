import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AfosDailyTemplate } from '../../../components/AfosDailyTemplate'
import { loadDaily, listPublishedDailies, isValidDate, isValidLocale, SUPPORTED_LOCALES, getAdjacentDates, isVisibleInProduction, dailyExists } from '../../../../lib/afos-daily/loader'
import { buildArticleSchema, getOgImageUrl, parseUpdatedAt } from '../../../../lib/afos-daily/schema'

interface PageProps {
  params: { locale: string; date: string }
}

export async function generateStaticParams() {
  // Pre-render only published dailies. Drafts are still accessible
  // dynamically (rendered on first request) so Vercel preview deploys can
  // show them for review, but they're never in the static manifest.
  const dates = listPublishedDailies()
  return SUPPORTED_LOCALES.flatMap(locale => dates.map(date => ({ locale, date })))
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isValidLocale(params.locale) || !isValidDate(params.date)) {
    return { title: 'AFOS Daily | AFOS Analytics', robots: { index: false, follow: false } }
  }
  const data = loadDaily(params.date, params.locale)
  if (!data) return { title: 'AFOS Daily | AFOS Analytics', robots: { index: false, follow: false } }

  // Drafts: noindex + follow even on preview deploys. Belt-and-suspenders
  // alongside notFound() in production — protects review URLs that get
  // shared by accident from being crawled.
  const isDraft = data.status !== 'published'

  const ledePlain = data.lede.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 240)
  const url = `https://afos-analytics.com/${params.locale}/daily/${params.date}`
  const ogImage = getOgImageUrl(params.locale)
  const publishedTime = `${data.date}T00:00:00-03:00`
  const modifiedTime = parseUpdatedAt(data.updatedAt, data.date)

  return {
    title: `${data.title} | AFOS Analytics`,
    description: ledePlain,
    robots: isDraft
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    alternates: {
      canonical: url,
      // Only include hreflang for locales whose .{locale}.md actually exists
      // for this date. Listing missing locales tells Google a translation
      // exists when the page would silently fall back to PT — that erodes
      // hreflang trust signal across the site.
      languages: (() => {
        const langs: Record<string, string> = {}
        for (const loc of SUPPORTED_LOCALES) {
          if (dailyExists(params.date, loc)) {
            langs[loc] = `https://afos-analytics.com/${loc}/daily/${params.date}`
          }
        }
        // x-default points to PT-BR if it exists, otherwise to whichever
        // locale we did include — never to a missing file.
        const fallback = langs['pt-BR'] || langs['en'] || langs['es']
        if (fallback) langs['x-default'] = fallback
        return langs
      })(),
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
  // Production-only gate: drafts are 404 on www.afos-analytics.com but
  // remain accessible on Vercel preview deploys for human review.
  // VERCEL_ENV is 'production' on the prod domain, 'preview' on previews.
  if (process.env.VERCEL_ENV === 'production' && !isVisibleInProduction(params.date)) notFound()
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
