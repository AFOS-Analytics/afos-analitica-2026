import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  loadWeekly,
  listPublishedWeeklies,
  getLatestDate,
  isValidLocale,
  isValidCountry,
} from '../../../../lib/afos-weekly/loader'

/**
 * Arquivo de edições do AFOS Weekly: /[idioma]/weekly/[país].
 *
 * 🔴 POR QUE ESTA PÁGINA EXISTE: o rodapé do template sempre teve o botão
 * "Todas as edições" apontando para `/{idioma}/weekly/{país}`, e a rota nunca
 * foi construída. Enquanto nada estava publicado ninguém percorria o caminho;
 * no dia em que a Edição №1 entrou no ar, o botão passou a levar o leitor a um
 * 404. Pego pelo André em 06/Ago/2026, no mesmo dia da publicação.
 *
 * 📌 A régua da casa é não prometer ao leitor o que não está no ar. O botão
 * prometia. Construir a página é o conserto certo; esconder o botão só
 * empurraria o problema.
 *
 * ⚠️ MÓDULO ISOLADO: nada aqui importa do `afos-tradeoff` nem do `afos-daily`,
 * e a casca visual é própria. Custa duplicação; evita que um produto em piloto
 * quebre dois que já estão no ar.
 *
 * 🔒 PILOTO: `noindex`, como a página da edição. A decisão de indexar é do
 * André e vem depois da Edição №2.
 */

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; country: string }>
}

const T = {
  en: {
    eyebrow: 'AFOS Weekly',
    title: 'All editions',
    subtitle: (n: number) => `${n} ${n === 1 ? 'edition published' : 'editions published'}, newest first.`,
    latestLabel: 'Latest edition',
    read: 'Read',
    issue: 'Issue',
    week: 'Week of',
    weekTo: 'to',
    empty: 'No edition has been published for this country yet.',
    back: 'Back to the US dashboard',
    metaTitle: 'AFOS Weekly archive | AFOS Analytics',
    metaDesc: 'Every AFOS Weekly edition on the US midterms: where the prediction market, the polls and the press disagree, and what each one measures.',
  },
  'pt-BR': {
    eyebrow: 'AFOS Weekly',
    title: 'Todas as edições',
    subtitle: (n: number) => `${n} ${n === 1 ? 'edição publicada' : 'edições publicadas'}, da mais recente para a mais antiga.`,
    latestLabel: 'Edição mais recente',
    read: 'Ler',
    issue: 'Edição',
    week: 'Semana de',
    weekTo: 'a',
    empty: 'Ainda não há edição publicada para este país.',
    back: 'Voltar ao painel dos EUA',
    metaTitle: 'Arquivo do AFOS Weekly | AFOS Analytics',
    metaDesc: 'Todas as edições do AFOS Weekly sobre as midterms dos EUA: onde o mercado de previsão, as pesquisas e a imprensa discordam, e o que cada um mede.',
  },
  es: {
    eyebrow: 'AFOS Weekly',
    title: 'Todas las ediciones',
    subtitle: (n: number) => `${n} ${n === 1 ? 'edición publicada' : 'ediciones publicadas'}, de la más reciente a la más antigua.`,
    latestLabel: 'Edición más reciente',
    read: 'Leer',
    issue: 'Edición',
    week: 'Semana del',
    weekTo: 'al',
    empty: 'Todavía no hay edición publicada para este país.',
    back: 'Volver al panel de EE. UU.',
    metaTitle: 'Archivo del AFOS Weekly | AFOS Analytics',
    metaDesc: 'Todas las ediciones del AFOS Weekly sobre las midterms de EE. UU.: dónde discrepan el mercado de predicción, las encuestas y la prensa, y qué mide cada uno.',
  },
} as const

function chave(locale: string): keyof typeof T {
  return locale === 'en' || locale === 'es' ? locale : 'pt-BR'
}

function limpa(s: string, max = 190): string {
  const t = s
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/📌/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return t.length > max ? t.slice(0, max).trimEnd() + '…' : t
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const p = await props.params
  const t = T[chave(p.locale)]
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    // Piloto: fora de buscador, igual à página da edição.
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      title: t.metaTitle,
      description: t.metaDesc,
      url: `https://www.afos-analytics.com/${p.locale}/weekly/${p.country}`,
      siteName: 'AFOS Analytics',
      locale: p.locale === 'es' ? 'es_ES' : p.locale === 'en' ? 'en_US' : 'pt_BR',
      images: [{ url: `https://www.afos-analytics.com/api/og?locale=${chave(p.locale)}`, width: 1200, height: 630, alt: t.metaTitle }],
    },
  }
}

export default async function WeeklyArchivePage(props: Props) {
  const p = await props.params
  if (!isValidLocale(p.locale)) notFound()
  if (!isValidCountry(p.country)) notFound()

  const t = T[chave(p.locale)]
  const latest = getLatestDate(p.country)

  // País válido e ainda sem edição publicada. O estado vazio diz a verdade em
  // vez de redirecionar para outro produto, que seria resposta errada.
  if (!latest) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-700">{t.eyebrow}</p>
        <h1 className="mb-3 text-2xl font-bold text-primary">{t.title}</h1>
        <p className="text-sm text-gray-700">{t.empty}</p>
        <a href={`/${p.locale}/dashboard/us`} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          {t.back} →
        </a>
      </main>
    )
  }

  const datas = listPublishedWeeklies(p.country).slice().reverse()
  const itens = datas.map((date) => {
    const d = loadWeekly(date, p.locale, p.country)
    return {
      date,
      issueNumber: d?.issueNumber ?? null,
      // ⚠️ Só usa o resumo quando a edição EXISTE no idioma pedido. Sem isto o
      // arquivo em português listaria o TL;DR em inglês sem avisar.
      resumo: d && d.locale === p.locale ? limpa(d.tldr[0] ?? '') : '',
      semana: d?.weekStart && d?.weekEnd ? `${t.week} ${d.weekStart} ${t.weekTo} ${d.weekEnd}` : '',
    }
  })

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-700">{t.eyebrow}</p>
        <h1 className="flex items-center gap-2.5 text-3xl font-bold text-primary">
          {/* Bandeira SVG, NUNCA emoji: emoji de bandeira não renderiza no
              Windows. Mesma convenção do arquivo do Tradeoff. `alt` vazio e
              aria-hidden porque o país já está dito no texto ao redor. */}
          <img
            src={`/flags/${p.country}.svg`}
            alt=""
            aria-hidden="true"
            width={36}
            height={25}
            className="inline-block h-[25px] w-[36px] rounded-[3px] object-cover shadow-sm"
          />
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{t.subtitle(itens.length)}</p>
      </header>

      <ol className="space-y-4">
        {itens.map((it, i) => (
          <li key={it.date}>
            <a
              href={`/${p.locale}/weekly/${p.country}/${it.date}`}
              className="block rounded-xl border border-gray-200 p-5 transition-colors hover:border-teal-500 hover:bg-teal-50/40"
            >
              <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-sm font-bold text-primary">
                  {it.issueNumber ? `${t.issue} №${it.issueNumber}` : it.date}
                </span>
                {i === 0 && (
                  <span className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {t.latestLabel}
                  </span>
                )}
                <span className="text-xs text-gray-500">{it.date}</span>
              </div>
              {it.semana && <p className="mb-2 text-xs text-gray-500">{it.semana}</p>}
              {it.resumo && <p className="text-sm leading-snug text-gray-700">{it.resumo}</p>}
              <span className="mt-2 inline-block text-xs font-semibold text-teal-700">{t.read} →</span>
            </a>
          </li>
        ))}
      </ol>

      <a href={`/${p.locale}/dashboard/us`} className="mt-8 inline-block text-sm font-semibold text-primary hover:underline">
        {t.back} →
      </a>
    </main>
  )
}
