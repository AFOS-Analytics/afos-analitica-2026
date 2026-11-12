'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/context'

/**
 * Cartão do AFOS Weekly, no mesmo padrão dos cartões do Daily e do Tradeoff.
 *
 * 🎨 A COR SEPARA PAÍS, NÃO PRODUTO (decisão do André em 06/Ago/2026, que
 * substitui a régua de 01/Ago). Painel dos EUA em verde-azulado, painel do
 * Brasil em âmbar. O Tradeoff acompanha: ele é âmbar no Brasil e teal nos EUA.
 * O que separa Tradeoff de Weekly é o nome e a pílula do dia da semana, que já
 * estão à vista no cabeçalho do cartão.
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

const T_US = {
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

/**
 * 🇫🇷 França (08/Nov/2026): Weekly às SEGUNDAS, presidencial de 2027.
 * Era um único `T` com "midterms" e "quintas" escritos, e a França sairia
 * anunciada como peça das midterms no dia errado.
 */
const T_FR: typeof T_US = {
  en: {
    ...T_US.en,
    badge: 'Weekly · Mondays',
    subtitle: 'The crossing, explained for voters · Every Monday',
    preDesc: 'Where the prediction markets, the polls and the press disagree about the 2027 French presidential election, and what each one actually measures. Written for voters, not for trading desks.',
  },
  'pt-BR': {
    ...T_US['pt-BR'],
    badge: 'Semanal · Segundas',
    subtitle: 'O cruzamento, explicado para o eleitor · Toda segunda',
    preDesc: 'Onde os mercados de previsão, as pesquisas e a imprensa discordam sobre a presidencial francesa de 2027, e o que cada um mede de fato. Escrito para o eleitor, não para mesa de operação.',
  },
  es: {
    ...T_US.es,
    badge: 'Semanal · Lunes',
    subtitle: 'El cruce, explicado para el votante · Cada lunes',
    preDesc: 'Dónde los mercados de predicción, las encuestas y la prensa discrepan sobre la presidencial francesa de 2027, y qué mide cada uno en realidad. Escrito para el votante, no para una mesa de operaciones.',
  },
}

const TEXTOS_POR_PAIS: Record<string, typeof T_US> = { us: T_US, fr: T_FR }

/** Cor por país, a mesma do cartão do Tradeoff: EUA verde-azulado, França violeta. */
const COR_POR_PAIS: Record<string, { caixa: string; pilula: string }> = {
  us: { caixa: 'border-teal-100 bg-teal-50 group-hover:bg-teal-100', pilula: 'bg-teal-200/60' },
  fr: { caixa: 'border-violet-100 bg-violet-50 group-hover:bg-violet-100', pilula: 'bg-violet-200/60' },
}

export function AfosWeeklyHeroCard({ country = 'us', semContainer = false }: { country?: string; semContainer?: boolean }) {
  const { locale } = useTranslation()
  const k = (locale === 'pt-BR' || locale === 'es' ? locale : 'en') as keyof typeof T
  // País sem texto próprio não ganha cartão: melhor nada do que o texto de outro país.
  const T = TEXTOS_POR_PAIS[country]
  const cor = COR_POR_PAIS[country]
  const t = T?.[k]
  const [meta, setMeta] = useState<WeeklyMeta | null>(null)
  // false enquanto a ida à API não terminou. Serve para reservar a altura do
  // cartão (evita CLS) e, se a API falhar, sumir em vez de deixar o esqueleto.
  const [terminou, setTerminou] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    setTerminou(false)
    fetch(`/api/afos-weekly/latest?locale=${k}&country=${country}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (j?.ok) setMeta(j) })
      .catch(() => {})
      .finally(() => { if (!ctrl.signal.aborted) setTerminou(true) })
    return () => ctrl.abort()
  }, [k, country])

  if (!t || !cor) return null

  // Esqueleto com a mesma moldura e altura mínima do AfosTradeoffHeroCard,
  // sem texto, enquanto o fetch não volta.
  if (!meta && !terminou) {
    const esqueleto = (
      <div aria-hidden="true">
        <div className={`min-h-[140px] sm:min-h-[116px] rounded-xl border p-4 md:p-5 animate-pulse ${cor.caixa}`}>
          <div className={`mb-3 h-4 w-2/5 rounded ${cor.pilula}`} />
          <div className={`mb-1.5 h-3 w-full rounded ${cor.pilula}`} />
          <div className={`h-3 w-4/6 rounded ${cor.pilula}`} />
        </div>
      </div>
    )
    if (semContainer) return esqueleto
    return <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-8">{esqueleto}</div>
  }

  if (!meta) return null

  const href = meta.hasEdition ? `/${locale}/weekly/${meta.country ?? country}/${meta.date}` : null

  /**
   * 📐 Estrutura ESPELHADA do `AfosTradeoffHeroCard`, por pedido do André em
   * 06/Ago/2026: mesma moldura, mesma linha de cabeçalho (nome + pílula + meta
   * + atualização à direita), mesmo corpo em duas linhas e a mesma fileira de
   * navegação embaixo do cartão.
   *
   * 🎨 A cor também se igualou, e por outro motivo: no painel dos EUA os dois
   * cartões são verde-azulados, porque a cor passou a dizer PAÍS.
   */
  const linhaMeta = meta.hasEdition ? (
    <>
      {t.issuePrefix} №{meta.issueNumber}
      {meta.weekStart && meta.weekEnd && <> · {t.weekPrefix} {meta.weekStart} — {meta.weekEnd}</>}
    </>
  ) : null

  const corpo = (
    <div className={`block rounded-xl border p-4 transition-colors md:p-5 ${cor.caixa}`}>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="text-base font-extrabold uppercase tracking-[0.12em] text-primary md:text-lg">
          {t.eyebrow}
        </span>
        <span className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-dark ${cor.pilula}`}>
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
   * ⚠️ CARD E NAVEGAÇÃO NUM ÚNICO ELEMENTO, e não num fragmento.
   *
   * Isto era `<>card + nav</>`. O painel dos EUA empilha os filhos com
   * `space-y-8 sm:space-y-12`, e um fragmento entrega DOIS filhos, então o
   * "Todas as edições" levava 3rem de distância do próprio cartão e parecia
   * solto no meio da página. O cartão do Tradeoff sempre embrulhou os dois
   * juntos, e por isso o dele ficava colado. Pego pelo André em 06/Ago/2026.
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
