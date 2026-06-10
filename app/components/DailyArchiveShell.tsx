'use client'
import { useEffect, useState } from 'react'
import { DailyArchiveJump } from './DailyArchiveJump'

// Shared with AfosDailyTemplate so the theme choice persists between the
// synthesis reading view and this archive (pick Sapphire on one, both follow).
type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-daily-theme'
const LANG_LABEL: Record<string, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }
const FOOTER: Record<string, { sibling: string; method: string }> = {
  'pt-BR': { sibling: 'AFOS Tradeoff (semanal) →', method: 'O Método →' },
  en: { sibling: 'AFOS Tradeoff (weekly) →', method: 'The Method →' },
  es: { sibling: 'AFOS Tradeoff (semanal) →', method: 'El Método →' },
}

export interface ArchiveItem {
  date: string
  dateLabel: string
  snippet: string
}
export interface ArchiveGroup {
  heading: string
  items: ArchiveItem[]
}
export interface ArchiveStrings {
  backToDashboard: string
  eyebrow: string
  title: string
  subtitle: string
  latestLabel: string
  readLatest: string
  jumpLabel: string
  themeAria: string
  lightAria: string
  blueAria: string
  langAria: string
}

function LanguagePicker({ locale, isBlue, langAria }: { locale: string; isBlue: boolean; langAria: string }) {
  const locales: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es']
  return (
    <div className="flex items-center gap-2 text-xs" aria-label={langAria}>
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className={isBlue ? 'text-blue-400/50' : 'text-gray-300'}>·</span>}
          <a
            href={`/${loc}/daily`}
            aria-label={LANG_LABEL[loc]}
            className={
              loc === locale
                ? isBlue
                  ? 'font-bold text-white'
                  : 'font-bold text-primary'
                : isBlue
                  ? 'text-blue-200 hover:text-white'
                  : 'text-gray-500 hover:text-primary'
            }
          >
            {LANG_LABEL[loc]}
          </a>
        </span>
      ))}
    </div>
  )
}

function ThemeToggle({
  theme,
  onChoose,
  isBlue,
  strings,
}: {
  theme: Theme
  onChoose: (t: Theme) => void
  isBlue: boolean
  strings: ArchiveStrings
}) {
  const base = 'w-5 h-5 rounded border-2 transition-all'
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg p-1 ${isBlue ? 'border border-blue-400/30 bg-blue-900/40' : 'border border-gray-200 bg-white'}`}
      role="radiogroup"
      aria-label={strings.themeAria}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label={strings.lightAria}
        onClick={() => onChoose('light')}
        className={`${base} bg-slate-50 ${theme === 'light' ? 'scale-110 border-primary' : 'border-gray-300 hover:border-gray-400'}`}
      />
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'blue'}
        aria-label={strings.blueAria}
        onClick={() => onChoose('blue')}
        className={`${base} bg-[#0a3d8f] ${theme === 'blue' ? 'scale-110 border-white' : 'border-blue-700 hover:border-blue-500'}`}
      />
    </div>
  )
}

export function DailyArchiveShell({
  locale,
  strings,
  latest,
  oldest,
  groups,
}: {
  locale: string
  strings: ArchiveStrings
  latest: ArchiveItem
  oldest: string
  groups: ArchiveGroup[]
}) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
    if (saved === 'blue' || saved === 'light') setTheme(saved)
  }, [])
  function chooseTheme(next: Theme) {
    setTheme(next)
    if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, next)
  }
  const isBlue = theme === 'blue'
  const footer = FOOTER[locale] ?? FOOTER['pt-BR']

  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-white'
  const backLink = isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary'
  const eyebrow = isBlue ? 'text-blue-200' : 'text-primary'
  const titleColor = isBlue ? 'text-white' : 'text-gray-900'
  const subtitleColor = isBlue ? 'text-blue-100/90' : 'text-gray-500'
  const headerBorder = isBlue ? 'border-blue-400/30' : 'border-gray-200'
  const latestCard = isBlue
    ? 'border-blue-300/40 bg-blue-900/40 hover:bg-blue-900/60'
    : 'border-primary/30 bg-primary/[0.04] hover:border-primary/60 hover:bg-primary/[0.07]'
  const latestRead = isBlue ? 'text-white' : 'text-primary'
  const latestDateColor = isBlue ? 'text-white' : 'text-gray-900'
  const latestSnippet = isBlue ? 'text-blue-100/80' : 'text-gray-600'
  const monthHeading = isBlue ? 'text-blue-300/70' : 'text-gray-400'
  const listDivide = isBlue ? 'divide-blue-400/20 border-blue-400/20' : 'divide-gray-100 border-gray-100'
  const rowHover = isBlue ? 'hover:bg-blue-900/30' : 'hover:bg-gray-50'
  const rowDate = isBlue ? 'text-white group-hover:text-blue-200' : 'text-gray-900 group-hover:text-primary'
  const rowArrow = isBlue ? 'text-blue-300/50 group-hover:text-blue-200' : 'text-gray-300 group-hover:text-primary'
  const rowSnippet = isBlue ? 'text-blue-100/70' : 'text-gray-500'

  return (
    <main className={`min-h-screen ${pageBg} transition-colors`}>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Top bar: back link + language + theme */}
        <div className="flex items-center justify-between gap-3">
          <a href={`/${locale}/dashboard`} className={`text-sm font-medium transition-colors ${backLink}`}>
            {strings.backToDashboard}
          </a>
          <div className="flex items-center gap-3">
            <LanguagePicker locale={locale} isBlue={isBlue} langAria={strings.langAria} />
            <ThemeToggle theme={theme} onChoose={chooseTheme} isBlue={isBlue} strings={strings} />
          </div>
        </div>

        <header className={`mt-6 border-b pb-6 ${headerBorder}`}>
          <p className={`text-xs font-bold uppercase tracking-[0.14em] ${eyebrow}`}>{strings.eyebrow}</p>
          <h1 className={`mt-2 text-3xl font-bold sm:text-4xl ${titleColor}`}>{strings.title}</h1>
          <p className={`mt-2 ${subtitleColor}`}>{strings.subtitle}</p>
        </header>

        {/* Latest edition highlight */}
        <a
          href={`/${locale}/daily/${latest.date}`}
          className={`mt-7 block rounded-xl border p-5 transition-colors ${latestCard}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className={`text-xs font-bold uppercase tracking-wide ${eyebrow}`}>{strings.latestLabel}</span>
            <span className={`text-sm font-semibold ${latestRead}`}>{strings.readLatest}</span>
          </div>
          <p className={`mt-1.5 text-lg font-bold ${latestDateColor}`}>{latest.dateLabel}</p>
          {latest.snippet && <p className={`mt-1 text-sm leading-relaxed ${latestSnippet}`}>{latest.snippet}</p>}
        </a>

        {/* Jump to date */}
        <div className="mt-7">
          <DailyArchiveJump locale={locale} min={oldest} max={latest.date} label={strings.jumpLabel} isBlue={isBlue} />
        </div>

        {/* Month-grouped list */}
        <div className="mt-9 space-y-9">
          {groups.map((group) => (
            <section key={group.heading}>
              <h2 className={`mb-3 text-sm font-bold uppercase tracking-wide ${monthHeading}`}>{group.heading}</h2>
              <ul className={`divide-y border-y ${listDivide}`}>
                {group.items.map((ed) => (
                  <li key={ed.date}>
                    <a href={`/${locale}/daily/${ed.date}`} className={`group block rounded px-2 py-3.5 transition-colors ${rowHover}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={`font-semibold ${rowDate}`}>{ed.dateLabel}</span>
                        <span className={`shrink-0 text-xs ${rowArrow}`}>→</span>
                      </div>
                      {ed.snippet && <p className={`mt-0.5 line-clamp-2 text-sm leading-snug ${rowSnippet}`}>{ed.snippet}</p>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <nav className={`mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm ${headerBorder}`}>
          <a href={`/${locale}/tradeoff`} className={`font-medium ${backLink}`}>{footer.sibling}</a>
          <a href={`/${locale}/how-it-works`} className={`font-medium ${backLink}`}>{footer.method}</a>
        </nav>
      </div>
    </main>
  )
}
