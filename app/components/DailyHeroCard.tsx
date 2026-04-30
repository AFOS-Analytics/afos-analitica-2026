'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/context'

interface DailyMeta {
  date: string
  title: string
  lede: string
  updatedAt: string
  previousDate: string | null
}

const T = {
  'pt-BR': {
    eyebrow: 'AFOS Daily',
    cta: 'Ler síntese',
    updatedAt: 'Atualizado:',
    seePrevious: 'Ver síntese anterior',
  },
  en: {
    eyebrow: 'AFOS Daily',
    cta: 'Read synthesis',
    updatedAt: 'Updated:',
    seePrevious: 'See previous synthesis',
  },
  es: {
    eyebrow: 'AFOS Daily',
    cta: 'Leer síntesis',
    updatedAt: 'Actualizado:',
    seePrevious: 'Ver síntesis anterior',
  },
}

const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDateShort(dateIso: string, locale: string): string {
  const parts = dateIso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateIso
  const [y, m, d] = parts
  if (m < 1 || m > 12) return dateIso
  if (locale === 'en') return `${MONTHS_EN[m - 1]} ${d}, ${y}`
  if (locale === 'es') return `${d} de ${MONTHS_ES[m - 1]}`
  return `${d} de ${MONTHS_PT[m - 1]}`
}

function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

export function DailyHeroCard() {
  const { locale } = useTranslation()
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[tKey]
  const [meta, setMeta] = useState<DailyMeta | null>(null)

  useEffect(() => {
    // AbortController prevents race conditions when the user toggles locale
    // rapidly: fetches from previous locales are cancelled before they can
    // overwrite the response for the current locale.
    const ctrl = new AbortController()
    fetch(`/api/afos-daily/latest?locale=${tKey}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.ok) setMeta({ date: d.date, title: d.title, lede: d.lede, updatedAt: d.updatedAt, previousDate: d.previousDate ?? null })
      })
      .catch(err => {
        // AbortError is expected on locale change; ignore. Other errors:
        // fail silently so the card simply doesn't render.
        if (err?.name !== 'AbortError') {
          /* swallow */
        }
      })
    return () => ctrl.abort()
  }, [tKey])

  if (!meta) return null

  const lede = stripMarkdown(meta.lede)
  const dateShort = formatDateShort(meta.date, tKey)
  const linkHref = `/${tKey}/daily/${meta.date}`
  const ariaLabel = tKey === 'en'
    ? `Read AFOS Daily for ${dateShort} — ${meta.title}`
    : tKey === 'es'
      ? `Leer AFOS Daily de ${dateShort} — ${meta.title}`
      : `Ler AFOS Daily de ${dateShort} — ${meta.title}`

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-5 sm:mt-6">
      {/* Discovery hints for crawlers and assistive engines */}
      <link rel="alternate" type="text/html" href={linkHref} title={meta.title} hrefLang={tKey} />
      <link rel="alternate" type="application/rss+xml" href="/feed/daily.xml" title="AFOS Daily — RSS feed" />
      <a
        href={linkHref}
        aria-label={ariaLabel}
        className="block bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 md:p-5 transition-colors group"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <span className="text-xs font-extrabold text-primary uppercase tracking-[0.18em]">{t.eyebrow}</span>
          <span className="text-base md:text-lg font-bold text-dark">{dateShort}</span>
          {meta.updatedAt && (
            <span className="text-xs text-gray-500 ml-auto">{t.updatedAt} {meta.updatedAt}</span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-snug line-clamp-2 mb-2">{lede}</p>
        <span className="text-sm font-semibold text-primary group-hover:underline">{t.cta} →</span>
      </a>
      {meta.previousDate && (
        <div className="mt-2 text-right">
          <a
            href={`/${tKey}/daily/${meta.previousDate}`}
            aria-label={tKey === 'en' ? `See previous AFOS Daily synthesis (${meta.previousDate})` : tKey === 'es' ? `Ver síntesis anterior de AFOS Daily (${meta.previousDate})` : `Ver síntese anterior do AFOS Daily (${meta.previousDate})`}
            className="text-xs text-gray-500 hover:text-primary hover:underline"
          >
            ← {t.seePrevious}
          </a>
        </div>
      )}
    </div>
  )
}
