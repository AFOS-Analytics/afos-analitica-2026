import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AfosWeeklyTemplate } from '../../../../components/AfosWeeklyTemplate'
import {
  loadWeekly,
  isValidLocale,
  isValidCountry,
  isValidDate,
  isVisibleInProduction,
} from '../../../../../lib/afos-weekly/loader'

/**
 * Página de uma edição do AFOS Weekly: /[idioma]/weekly/[país]/[data].
 *
 * 🔒 PORTÃO DE RASCUNHO, igual ao do Tradeoff e do Daily: em PRODUÇÃO, edição
 * que não estiver `published` devolve 404. No preview da Vercel ela abre, que é
 * como a revisão humana acontece antes de qualquer coisa ir ao ar.
 *
 * ⚠️ `noindex` enquanto o produto está em piloto. Decisão do André em
 * 01/Ago/2026: sitemap e indexação só depois das duas primeiras edições. Não
 * basta o rascunho: uma edição publicada durante o piloto também não deve
 * entrar em buscador antes da decisão de seguir.
 */

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ locale: string; country: string; date: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const p = await props.params
  if (!isValidLocale(p.locale) || !isValidCountry(p.country) || !isValidDate(p.date)) {
    return { title: 'AFOS Weekly', robots: { index: false, follow: false } }
  }
  const data = loadWeekly(p.date, p.locale, p.country)
  if (!data) return { title: 'AFOS Weekly', robots: { index: false, follow: false } }

  return {
    title: `${data.title} | AFOS Analytics`,
    description: data.tldr[0]?.replace(/\*\*/g, '').slice(0, 200) ?? '',
    // Piloto: fora de buscador até a decisão de seguir, na edição No 2.
    robots: { index: false, follow: false },
  }
}

export default async function WeeklyEditionPage(props: PageProps) {
  const p = await props.params

  if (!isValidLocale(p.locale)) notFound()
  if (!isValidCountry(p.country)) notFound()
  if (!isValidDate(p.date)) notFound()

  // Em produção, rascunho não existe. No preview, abre para revisão.
  if (process.env.VERCEL_ENV === 'production' && !isVisibleInProduction(p.date, p.country)) {
    notFound()
  }

  const data = loadWeekly(p.date, p.locale, p.country)
  if (!data) notFound()

  return (
    <main className="min-h-screen bg-white">
      <AfosWeeklyTemplate data={data} locale={p.locale} />
    </main>
  )
}
