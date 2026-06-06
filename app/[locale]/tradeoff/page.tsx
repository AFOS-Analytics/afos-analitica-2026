import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getLatestDate, isValidLocale } from '../../../lib/afos-tradeoff/loader'

export const dynamic = 'force-static'

interface Props {
  params: Promise<{ locale: string }>
}

// Index page redirects to /tradeoff/{latest-published-date}. Metadata is set
// to noindex so the redirect URL doesn't compete with canonical permalinks in
// search engines. When no edition is published yet (pre-launch), redirects
// to /dashboard so the user lands somewhere coherent.
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const latest = getLatestDate()
  const validLocale = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const canonical = latest
    ? `https://www.afos-analytics.com/${validLocale}/tradeoff/${latest}`
    : `https://www.afos-analytics.com/${validLocale}/dashboard`

  return {
    title: 'AFOS Tradeoff — latest edition | AFOS Analytics',
    description: 'Redirects to the most recent AFOS Tradeoff weekly edition.',
    robots: { index: false, follow: true },
    alternates: { canonical },
  }
}

export default async function TradeoffIndexPage(props: Props) {
  const params = await props.params;
  const validLocale = isValidLocale(params.locale) ? params.locale : 'pt-BR'
  const latest = getLatestDate()
  if (!latest) redirect(`/${validLocale}/dashboard`)
  redirect(`/${validLocale}/tradeoff/${latest}`)
}
