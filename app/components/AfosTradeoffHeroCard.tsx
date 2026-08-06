'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/context'
import { MONTHS } from '../../lib/i18n/months'

interface TradeoffMeta {
  hasEdition: boolean
  date?: string
  issueNumber?: number
  weekStart?: string
  weekEnd?: string
  title?: string
  sinalDaSemana?: string
  updatedAt?: string
  previousDate?: string | null
  firstEditionDate?: string
}

const T = {
  'pt-BR': {
    eyebrow: 'AFOS Tradeoff',
    badge: 'Semanal · Segundas',
    subtitle: 'Leitura técnica semanal · Toda segunda',
    cta: 'Ler edição',
    seeAll: 'Todas as edições',
    ctaPre: 'Cadastre-se pra receber',
    updatedAt: 'Atualizado:',
    seePrevious: 'Ver edição anterior',
    issuePrefix: 'Edição',
    weekPrefix: 'Semana de',
    prePrimeiraTitle: 'Primeira edição em',
    prePrimeiraDesc: 'Brief técnico semanal do mercado de previsão eleitoral, sem médias suavizadas. Audiência: research, buy-side, treasury.',
  },
  en: {
    eyebrow: 'AFOS Tradeoff',
    badge: 'Weekly · Mondays',
    subtitle: 'Weekly technical reading · Every Monday',
    cta: 'Read edition',
    seeAll: 'All editions',
    ctaPre: 'Subscribe to receive',
    updatedAt: 'Updated:',
    seePrevious: 'See previous edition',
    issuePrefix: 'Issue',
    weekPrefix: 'Week of',
    prePrimeiraTitle: 'First edition on',
    prePrimeiraDesc: 'Weekly technical brief on the electoral prediction market, no smoothed averages. Audience: research, buy-side, treasury.',
  },
  es: {
    eyebrow: 'AFOS Tradeoff',
    badge: 'Semanal · Lunes',
    subtitle: 'Lectura técnica semanal · Todos los lunes',
    cta: 'Leer edición',
    seeAll: 'Todas las ediciones',
    ctaPre: 'Suscríbete para recibir',
    updatedAt: 'Actualizado:',
    seePrevious: 'Ver edición anterior',
    issuePrefix: 'Edición',
    weekPrefix: 'Semana de',
    prePrimeiraTitle: 'Primera edición el',
    prePrimeiraDesc: 'Brief técnico semanal del mercado de predicción electoral, sin promedios suavizados. Audiencia: research, buy-side, treasury.',
  },
}

function formatDateShort(dateIso: string, locale: 'pt-BR' | 'en' | 'es'): string {
  const parts = dateIso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateIso
  const [y, m, d] = parts
  if (m < 1 || m > 12) return dateIso
  const month = MONTHS[locale][m - 1]
  return locale === 'en' ? `${month} ${d}, ${y}` : `${d} de ${month}`
}

function formatWeekRange(start: string, end: string, locale: 'pt-BR' | 'en' | 'es'): string {
  const p1 = start.split('-').map(Number)
  const p2 = end.split('-').map(Number)
  if (p1.length !== 3 || p2.length !== 3) return `${start}, ${end}`
  const [, m1, d1] = p1
  const [, m2, d2] = p2
  const month = MONTHS[locale][m2 - 1]
  if (m1 === m2) return `${d1}-${d2} ${month}`
  const month1 = MONTHS[locale][m1 - 1]
  return `${d1} ${month1} - ${d2} ${month}`
}

/**
 * `country` entrou em 31/Jul, com o Tradeoff virando um produto por país. O
 * padrão é 'br' para que a landing e o painel do Brasil, que já usavam este
 * cartão, continuem funcionando sem alteração.
 */
export function AfosTradeoffHeroCard({ country = 'br', semContainer = false }: { country?: string; semContainer?: boolean } = {}) {
  const { locale } = useTranslation()
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[tKey]

  /**
   * ⚠️ O cartão nasceu na LANDING, onde ele mesmo precisa criar a coluna, por
   * isso traz `max-w-6xl mx-auto px-3 sm:px-4 md:px-8`. Dentro de uma página que
   * JÁ tem essa coluna, como o painel, o padding é aplicado duas vezes e o
   * cartão fica visivelmente mais estreito que os vizinhos. Foi o que o André
   * viu em 31/Jul. Com `semContainer`, ele apenas ocupa a largura de quem o
   * contém.
   */
  const embrulho = semContainer ? 'w-full' : 'w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-3 sm:mt-4'
  const [meta, setMeta] = useState<TradeoffMeta | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/afos-tradeoff/latest?locale=${tKey}&country=${country}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.ok) setMeta(d)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') console.error('[AfosTradeoffHeroCard] fetch failed:', err)
      })
    return () => ctrl.abort()
  }, [tKey, country])

  // Placeholder reservando a altura (evita CLS quando o fetch client popula este
  // card no topo, logo abaixo do DailyHeroCard).
  if (!meta) return (
    <div className={embrulho} aria-hidden="true">
      <div className="min-h-[140px] sm:min-h-[116px] rounded-xl border border-orange-100 bg-orange-50/60 p-4 md:p-5 animate-pulse">
        <div className="mb-3 h-4 w-2/5 rounded bg-orange-100" />
        <div className="mb-1.5 h-3 w-full rounded bg-orange-100/70" />
        <div className="h-3 w-4/6 rounded bg-orange-100/70" />
      </div>
    </div>
  )

  // Estado A, pré-primeira edição (ainda não tem nada publicado)
  if (!meta.hasEdition) {
    const dateShort = meta.firstEditionDate ? formatDateShort(meta.firstEditionDate, tKey) : ''
    return (
      <div className={embrulho}>
        <div
          className="block bg-orange-50 border border-orange-100 rounded-xl p-4 md:p-5"
          aria-label={`${t.eyebrow}: ${t.prePrimeiraTitle} ${dateShort}`}
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <div className="flex items-baseline gap-x-3 flex-nowrap">
              <span className="text-base md:text-lg font-extrabold text-primary uppercase tracking-[0.12em]">
                {t.eyebrow}
              </span>
              <span className="text-xs font-semibold text-dark uppercase tracking-wider px-2 py-0.5 bg-orange-200/60 rounded whitespace-nowrap">
                {t.badge}
              </span>
            </div>
            <span className="text-sm text-gray-700 italic md:ml-auto">{t.subtitle}</span>
          </div>
          <p className="text-sm text-gray-800 leading-snug mb-2">
            <strong className="text-dark">{t.prePrimeiraTitle} {dateShort}.</strong> {t.prePrimeiraDesc}
          </p>
          <a
            href={`/${tKey}/tradeoff/${country}/${meta.firstEditionDate}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t.cta} →
          </a>
        </div>
      </div>
    )
  }

  // Estado B, tem edição publicada
  const dateShort = formatDateShort(meta.date!, tKey)
  const weekRange = formatWeekRange(meta.weekStart!, meta.weekEnd!, tKey)
  const linkHref = `/${tKey}/tradeoff/${country}/${meta.date}`
  const ariaLabel = tKey === 'en'
    ? `Read AFOS Tradeoff issue ${meta.issueNumber} for ${dateShort}`
    : tKey === 'es'
      ? `Leer AFOS Tradeoff edición ${meta.issueNumber} de ${dateShort}`
      : `Ler AFOS Tradeoff edição ${meta.issueNumber} de ${dateShort}`

  return (
    <div className={embrulho}>
      <link rel="alternate" type="text/html" href={linkHref} title={meta.title} hrefLang={tKey} />
      <a
        href={linkHref}
        aria-label={ariaLabel}
        className="block bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl p-4 md:p-5 transition-colors group"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <div className="flex items-baseline gap-x-3 flex-nowrap">
            <span className="text-base md:text-lg font-extrabold text-primary uppercase tracking-[0.12em]">
              {t.eyebrow}
            </span>
            <span className="text-xs font-semibold text-dark uppercase tracking-wider px-2 py-0.5 bg-orange-200/60 rounded whitespace-nowrap">
              {t.badge}
            </span>
          </div>
          <span className="text-sm text-gray-700">
            {t.issuePrefix} №{meta.issueNumber} · {t.weekPrefix} {weekRange}
          </span>
          {meta.updatedAt && (
            <span className="text-xs text-gray-600 ml-auto">{t.updatedAt} {meta.updatedAt}</span>
          )}
        </div>
        <p className="text-sm text-gray-800 leading-snug line-clamp-2 mb-2">{meta.sinalDaSemana}</p>
        <span className="text-sm font-semibold text-primary group-hover:underline">{t.cta} →</span>
      </a>
      <div className="mt-2 flex items-center justify-between gap-3">
        <a
          href={`/${tKey}/tradeoff/${country}`}
          aria-label={t.seeAll}
          className="text-xs font-medium text-gray-500 hover:text-primary hover:underline"
        >
          {t.seeAll} →
        </a>
        {meta.previousDate && (
          <a
            /* 🔴 O PAÍS FALTAVA AQUI, e o link de cima já o tinha. Sem ele o
               endereço vira /{idioma}/tradeoff/{data}, que é a rota ANTIGA e
               redireciona para o BRASIL. No painel dos EUA, "ver edição
               anterior" entregava a edição brasileira: 307 e 200, sem 404 e
               sem link quebrado, então nenhum teste de código HTTP pegaria.
               Pego pelo André em 06/Ago/2026. */
            href={`/${tKey}/tradeoff/${country}/${meta.previousDate}`}
            aria-label={`${t.seePrevious} (${meta.previousDate})`}
            className="text-xs text-gray-500 hover:text-primary hover:underline"
          >
            ← {t.seePrevious}
          </a>
        )}
      </div>
    </div>
  )
}
