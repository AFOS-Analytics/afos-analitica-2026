'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/context'

/**
 * Cartão do AFOS Weekly, no mesmo padrão dos cartões do Daily e do Tradeoff.
 *
 * 🎨 A COR É O QUE SEPARA OS TRÊS PRODUTOS na mesma página. O Tradeoff usa o
 * amarelo/âmbar; este usa o verde-azulado (teal), para o leitor distinguir de
 * relance sem precisar ler o rótulo. Mesma altura, mesma estrutura interna e
 * mesmo comportamento de pré-lançamento dos outros dois.
 *
 * ⚠️ Se não houver edição, ele mostra o estado de "primeira edição em ...", em
 * vez de sumir. Cartão que some deixa buraco no layout aprovado.
 */

interface WeeklyMeta {
  hasEdition: boolean
  date?: string
  previousDate?: string | null
  country?: string
  issueNumber?: number
  weekStart?: string
  weekEnd?: string
  title?: string
  resumo?: string
  updatedAt?: string
  status?: string
  firstEditionDate?: string
}

const T = {
  en: {
    eyebrow: 'AFOS Weekly',
    badge: 'Weekly · Thursdays',
    subtitle: 'The crossing, explained for voters · Every Thursday',
    cta: 'Read issue',
    issuePrefix: 'Issue',
    weekPrefix: 'Week of',
    updatedAt: 'Reading:',
    seeAll: 'All editions',
    seePrevious: 'See previous edition',
    preTitle: 'First issue on',
    preDesc: 'Where the prediction market, the polls and the press disagree about the midterms, and what each one actually measures. Written for voters, not for trading desks.',
    draft: 'DRAFT · preview only',
  },
  'pt-BR': {
    eyebrow: 'AFOS Weekly',
    badge: 'Semanal · Quintas',
    subtitle: 'O cruzamento, explicado para o eleitor · Toda quinta',
    cta: 'Ler edição',
    issuePrefix: 'Edição',
    weekPrefix: 'Semana de',
    updatedAt: 'Leitura:',
    seeAll: 'Todas as edições',
    seePrevious: 'Ver edição anterior',
    preTitle: 'Primeira edição em',
    preDesc: 'Onde o mercado de previsão, as pesquisas e a imprensa discordam sobre as midterms, e o que cada um mede de fato. Escrito para o eleitor, não para mesa de operação.',
    draft: 'RASCUNHO · só no preview',
  },
  es: {
    eyebrow: 'AFOS Weekly',
    badge: 'Semanal · Jueves',
    subtitle: 'El cruce, explicado para el votante · Cada jueves',
    cta: 'Leer edición',
    issuePrefix: 'Edición',
    weekPrefix: 'Semana del',
    updatedAt: 'Lectura:',
    seeAll: 'Todas las ediciones',
    seePrevious: 'Ver edición anterior',
    preTitle: 'Primera edición el',
    preDesc: 'Dónde el mercado de predicción, las encuestas y la prensa discrepan sobre las midterms, y qué mide cada uno en realidad. Escrito para el votante, no para una mesa de operaciones.',
    draft: 'BORRADOR · solo en preview',
  },
}

export function AfosWeeklyHeroCard({ country = 'us', semContainer = false }: { country?: string; semContainer?: boolean }) {
  const { locale } = useTranslation()
  const k = (locale === 'pt-BR' || locale === 'es' ? locale : 'en') as keyof typeof T
  const t = T[k]
  const [meta, setMeta] = useState<WeeklyMeta | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/afos-weekly/latest?locale=${k}&country=${country}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (j?.ok) setMeta(j) })
      .catch(() => {})
    return () => ctrl.abort()
  }, [k, country])

  if (!meta) return null

  const href = meta.hasEdition ? `/${locale}/weekly/${meta.country ?? country}/${meta.date}` : null

  /**
   * 📐 Estrutura ESPELHADA do `AfosTradeoffHeroCard`, por pedido do André em
   * 06/Ago/2026: mesma moldura, mesma linha de cabeçalho (nome + pílula + meta
   * + atualização à direita), mesmo corpo em duas linhas e a mesma fileira de
   * navegação embaixo do cartão.
   *
   * 🎨 O QUE NÃO SE ESPELHA É A COR, e isso foi reafirmado no mesmo dia: o
   * Tradeoff é âmbar e o Weekly é verde-azulado. Os dois cartões ficam vizinhos
   * no painel dos EUA, e a cor é o que separa os produtos de relance, sem o
   * leitor precisar ler o rótulo.
   */
  const linhaMeta = meta.hasEdition ? (
    <>
      {t.issuePrefix} №{meta.issueNumber}
      {meta.weekStart && meta.weekEnd && <> · {t.weekPrefix} {meta.weekStart} — {meta.weekEnd}</>}
    </>
  ) : null

  const corpo = (
    <div className="block rounded-xl border border-teal-100 bg-teal-50 p-4 transition-colors group-hover:bg-teal-100 md:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="text-base font-extrabold uppercase tracking-[0.12em] text-primary md:text-lg">
          {t.eyebrow}
        </span>
        <span className="whitespace-nowrap rounded bg-teal-200/60 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-dark">
          {t.badge}
        </span>
        {meta.status === 'draft' && (
          <span className="whitespace-nowrap rounded bg-amber-200/70 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-900">
            {t.draft}
          </span>
        )}
        {linhaMeta && <span className="text-sm text-gray-700">{linhaMeta}</span>}
        {meta.hasEdition && meta.updatedAt && (
          <span className="ml-auto text-xs text-gray-600">{t.updatedAt} {meta.updatedAt}</span>
        )}
        {!meta.hasEdition && <span className="text-sm italic text-gray-700 md:ml-auto">{t.subtitle}</span>}
      </div>

      {meta.hasEdition ? (
        <>
          <p className="mb-2 text-sm leading-snug text-gray-800 line-clamp-2">{meta.resumo}…</p>
          <span className="text-sm font-semibold text-primary group-hover:underline">{t.cta} →</span>
        </>
      ) : (
        <p className="text-sm leading-snug text-gray-800">
          <strong className="text-dark">{t.preTitle} {meta.firstEditionDate}.</strong> {t.preDesc}
        </p>
      )}
    </div>
  )

  /**
   * ⚠️ UM ÚNICO ELEMENTO NA RAIZ, e isto não é preferência de estilo.
   *
   * Isto devolvia um Fragment com DOIS filhos, o quadro e a fileira de
   * navegação. O painel envolve os cartões num container com
   * `space-y-8 sm:space-y-12`, e esse espaçamento entra ENTRE irmãos: os dois
   * filhos soltos ganhavam 48px de distância, e o "Todas as edições" ficava
   * boiando longe do quadro. O cartão do Tradeoff nunca teve isso porque
   * sempre devolveu um `div` só. Pego pelo André em 06/Ago/2026.
   */
  const cartao = (
    <div>
      {href ? (
        <a href={href} className="group block">
          {corpo}
        </a>
      ) : (
        corpo
      )}

      {meta.hasEdition && (
        <div className="mt-2 flex items-center justify-between gap-3">
          <a
            href={`/${locale}/weekly/${meta.country ?? country}`}
            aria-label={t.seeAll}
            className="text-xs font-medium text-gray-500 hover:text-primary hover:underline"
          >
            {t.seeAll} →
          </a>
          {/* ⚠️ O PAÍS VAI NO ENDEREÇO. O cartão do Tradeoff montava este link
              sem ele e caía na rota antiga, que redireciona para o Brasil: no
              painel dos EUA, "ver edição anterior" entregava a edição
              brasileira, sem 404 e sem link quebrado. */}
          {meta.previousDate && (
            <a
              href={`/${locale}/weekly/${meta.country ?? country}/${meta.previousDate}`}
              aria-label={`${t.seePrevious} (${meta.previousDate})`}
              className="text-xs text-gray-500 hover:text-primary hover:underline"
            >
              ← {t.seePrevious}
            </a>
          )}
        </div>
      )}
    </div>
  )

  if (semContainer) return cartao
  return <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-8">{cartao}</div>
}
