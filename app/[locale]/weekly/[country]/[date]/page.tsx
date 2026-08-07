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
 * 🏷️ Assunto do cartão social, POR PAÍS.
 *
 * Estava faltando inteiro, e o efeito era o pior possível: sem `openGraph` na
 * página, o WhatsApp herdava o do layout raiz e anunciava **"Brazil 2026
 * Elections"** num link das midterms americanas. O leitor via a eleição errada
 * no cartão e o endereço certo logo abaixo.
 *
 * ⚠️ `robots: noindex` NÃO protege disto. Ele tira a página do buscador e não
 * tem efeito nenhum sobre quem recebe o link: o scraper social lê a página
 * assim mesmo. Piloto fora de busca continua sendo compartilhável.
 */
const TAGS_POR_PAIS: Record<string, string[]> = {
  us: ['US 2026 midterms', 'prediction markets', 'electoral polls', 'political risk', 'weekly analysis'],
}

/** Imagem OG por idioma. Replicada, não importada: este módulo é isolado. */
function getOgImageUrl(locale?: string): string {
  const safe = locale === 'en' || locale === 'es' ? locale : 'pt-BR'
  return `https://www.afos-analytics.com/api/og?locale=${safe}`
}

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

  const descricao = data.tldr[0]?.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 200) ?? ''
  const url = `https://www.afos-analytics.com/${p.locale}/weekly/${p.country}/${p.date}`

  return {
    title: `${data.title} | AFOS Analytics`,
    description: descricao,
    // Piloto: fora de buscador até a decisão de seguir, na edição No 2.
    robots: { index: false, follow: false },
    // ⚠️ CANÔNICO PRÓPRIO. Sem este bloco a página herdava o do layout raiz e
    // TODA edição do Weekly declarava a HOME como sua canônica. `noindex` não
    // resolve isso: quem recebe o link, e qualquer agregador que leia o head,
    // continua vendo a identidade errada da página.
    alternates: { canonical: url },
    // 🔴 SEM ESTE BLOCO o card social herdava o do layout raiz, que anuncia
    // "Brazil 2026 Elections". Quem compartilhasse esta edição no WhatsApp via a
    // eleição ERRADA no cartão, com o link das midterms logo abaixo. `noindex`
    // tira a página do buscador e NÃO tira do compartilhamento: quem recebe o
    // link continua vendo o cartão. Corrigido em 03/Ago/2026.
    openGraph: {
      type: 'article',
      title: data.title,
      description: descricao,
      url,
      siteName: 'AFOS Analytics',
      locale: p.locale === 'es' ? 'es_ES' : p.locale === 'en' ? 'en_US' : 'pt_BR',
      publishedTime: `${data.date}T00:00:00-03:00`,
      authors: ['AFOS Analytics'],
      section: 'Politics',
      tags: TAGS_POR_PAIS[p.country] ?? ['prediction markets', 'electoral polls', 'political risk'],
      images: [{ url: getOgImageUrl(p.locale), width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: descricao,
      images: [getOgImageUrl(p.locale)],
    },
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
      <AfosWeeklyTemplate data={data} locale={p.locale} country={p.country} />
    </main>
  )
}
