import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getLatestDate, isValidLocale } from '../../../lib/afos-daily/loader'

export const dynamic = 'force-static'

interface Props {
  params: { locale: string }
}

// Index page redirects to /daily/{latest-date}. Metadata is set to noindex
// so the redirect URL itself doesn't compete with the canonical permalink
// in search engines. Sitemap still lists this URL (priority 0.9) for
// discoverability.
export function generateMetadata({ params }: Props): Metadata {
  const latest = getLatestDate()
  const validLocale = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const canonical = latest
    ? `https://afos-analytics.com/${validLocale}/daily/${latest}`
    : `https://afos-analytics.com/${validLocale}/dashboard`

  return {
    title: 'AFOS Daily — latest synthesis | AFOS Analytics',
    description: 'Redirects to the most recent AFOS Daily synthesis.',
    robots: { index: false, follow: true },
    alternates: { canonical },
  }
}

export default function DailyIndexPage({ params }: Props) {
  const validLocale = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const latest = getLatestDate()
  if (!latest) redirect(`/${validLocale}/dashboard`)
  redirect(`/${validLocale}/daily/${latest}`)
}
