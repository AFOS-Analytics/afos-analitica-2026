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

  const corpo = (
    <div className="relative overflow-hidden rounded-2xl border border-teal-300/70 bg-gradient-to-br from-teal-50 to-white p-5 transition hover:border-teal-400 hover:shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">{t.eyebrow}</span>
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-800">
          {t.badge}
        </span>
        {meta.status === 'draft' && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
            {t.draft}
          </span>
        )}
      </div>

      {meta.hasEdition ? (
        <>
          <p className="mb-1 text-[11px] text-teal-900/70">
            {t.issuePrefix} {meta.issueNumber}
            {meta.weekStart && <> · {t.weekPrefix} {meta.weekStart}</>}
          </p>
          <h3 className="mb-2 text-base font-bold leading-snug text-dark">{meta.title}</h3>
          {meta.resumo && <p className="mb-3 text-sm leading-snug text-gray-700">{meta.resumo}…</p>}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-teal-800 group-hover:underline">{t.cta} →</span>
            {meta.updatedAt && <span className="text-[11px] text-gray-500">{t.updatedAt} {meta.updatedAt}</span>}
          </div>
        </>
      ) : (
        <>
          <h3 className="mb-2 text-base font-bold leading-snug text-dark">
            {t.preTitle} {meta.firstEditionDate}
          </h3>
          <p className="text-sm leading-snug text-gray-700">{t.preDesc}</p>
        </>
      )}
    </div>
  )

  const cartao = href ? (
    <a href={href} className="group block">
      {corpo}
    </a>
  ) : (
    corpo
  )

  if (semContainer) return cartao
  return <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-8">{cartao}</div>
}
