import { redirect } from 'next/navigation'
import { getLatestDate } from '../../../lib/afos-daily/loader'

export const dynamic = 'force-static'

interface Props {
  params: { locale: string }
}

export default function DailyIndexPage({ params }: Props) {
  const latest = getLatestDate()
  if (!latest) redirect(`/${params.locale}/dashboard`)
  redirect(`/${params.locale}/daily/${latest}`)
}
