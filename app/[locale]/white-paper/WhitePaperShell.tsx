'use client'
import { useEffect, useState } from 'react'

// Shared theme key with AFOS Daily/Tradeoff/how-it-works so the reading
// preference (light / Sapphire Blue) persists across all reading surfaces.
type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-daily-theme'
const LANG_LABEL: Record<string, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }

const L: Record<string, { langAria: string; themeAria: string; light: string; blue: string; method: string }> = {
  'pt-BR': { langAria: 'Seletor de idioma', themeAria: 'Tema da página', light: 'Modo claro', blue: 'Modo Sapphire Blue', method: 'O Método →' },
  en: { langAria: 'Language selector', themeAria: 'Page theme', light: 'Light mode', blue: 'Sapphire Blue mode', method: 'The Method →' },
  es: { langAria: 'Selector de idioma', themeAria: 'Tema de la página', light: 'Modo claro', blue: 'Modo Sapphire Blue', method: 'El Método →' },
}

type Bullet = string | { lead: string; text: string }
interface Section { heading: string; paras?: string[]; bullets?: Bullet[] }
export interface WhitePaperContent {
  h1: string
  tagline: string
  updated: string
  intro: string[]
  question: string
  questionAfter: string
  thesisIntro: string
  thesis: string
  thesisAfter: string
  sections: Section[]
  closing: string[]
}

const SLUG = 'white-paper'

function LanguagePicker({ locale, isBlue, langAria }: { locale: string; isBlue: boolean; langAria: string }) {
  const locales: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es']
  return (
    <div className="flex items-center gap-2 text-xs" aria-label={langAria}>
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className={isBlue ? 'text-blue-400/50' : 'text-gray-300'}>·</span>}
          <a
            href={`/${loc}/${SLUG}`}
            hrefLang={loc}
            aria-current={loc === locale ? 'page' : undefined}
            aria-label={LANG_LABEL[loc]}
            className={
              loc === locale
                ? isBlue ? 'font-bold text-white' : 'font-bold text-primary'
                : isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary'
            }
          >
            {LANG_LABEL[loc]}
          </a>
        </span>
      ))}
    </div>
  )
}

function ThemeToggle({ theme, onChoose, isBlue, themeAria, lightAria, blueAria }: { theme: Theme; onChoose: (t: Theme) => void; isBlue: boolean; themeAria: string; lightAria: string; blueAria: string }) {
  const base = 'w-5 h-5 rounded border-2 transition-all'
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg p-1 ${isBlue ? 'border border-blue-400/30 bg-blue-900/40' : 'border border-gray-200 bg-white'}`}
      role="radiogroup"
      aria-label={themeAria}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label={lightAria}
        onClick={() => onChoose('light')}
        className={`${base} bg-slate-50 ${theme === 'light' ? 'scale-110 border-primary' : 'border-gray-300 hover:border-gray-400'}`}
      />
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'blue'}
        aria-label={blueAria}
        onClick={() => onChoose('blue')}
        className={`${base} bg-[#0a3d8f] ${theme === 'blue' ? 'scale-110 border-white' : 'border-blue-700 hover:border-blue-500'}`}
      />
    </div>
  )
}

function renderBullet(b: Bullet, i: number, bodyc: string, leadc: string) {
  if (typeof b === 'string') {
    return <li key={i} className={`text-sm sm:text-base leading-relaxed ${bodyc}`}>{b}</li>
  }
  return (
    <li key={i} className={`text-sm sm:text-base leading-relaxed ${bodyc}`}>
      <strong className={leadc}>{b.lead}</strong> {b.text}
    </li>
  )
}

export function WhitePaperShell({ locale, c }: { locale: string; c: WhitePaperContent }) {
  const t = L[locale] || L.en
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

  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-light-bg'
  const wordmark = isBlue ? 'text-white' : 'text-primary'
  const h1c = isBlue ? 'text-white' : 'text-dark'
  const tagc = isBlue ? 'text-blue-100/90' : 'text-gray-700'
  const updc = isBlue ? 'text-blue-300/70' : 'text-gray-500'
  const bodyc = isBlue ? 'text-blue-100/80' : 'text-gray-700'
  const questionc = isBlue ? 'text-white' : 'text-primary'
  const calloutBox = isBlue ? 'border-blue-300/50 bg-blue-900/40' : 'border-primary bg-primary/5'
  const thesisStrong = isBlue ? 'text-white' : 'text-dark'
  const cardBox = isBlue ? 'border-blue-400/30 bg-blue-900/40' : 'border-light-border bg-white'
  const headingc = isBlue ? 'text-white' : 'text-primary'
  const leadc = isBlue ? 'text-white' : 'text-dark'
  const dividerc = isBlue ? 'border-blue-400/30' : 'border-light-border'
  const navLink = isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary'

  return (
    <main className={`min-h-screen ${pageBg} transition-colors`}>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Top bar: wordmark + Dashboard + language + theme */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href={`/${locale}`} aria-label="AFOS Analytics, Home" className={`text-base font-extrabold tracking-tight transition-colors sm:text-lg ${wordmark}`}>
            AFOS Analytics
          </a>
          <div className="flex items-center gap-3">
            <a href={`/${locale}/dashboard`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${isBlue ? 'bg-white text-primary hover:bg-blue-50' : 'bg-primary text-white hover:bg-primary/90'}`}>
              Dashboard
            </a>
            <LanguagePicker locale={locale} isBlue={isBlue} langAria={t.langAria} />
            <ThemeToggle theme={theme} onChoose={chooseTheme} isBlue={isBlue} themeAria={t.themeAria} lightAria={t.light} blueAria={t.blue} />
          </div>
        </div>

        <header className={`mt-8 border-b pb-6 ${dividerc}`}>
          <h1 className={`text-3xl font-extrabold sm:text-4xl ${h1c}`}>{c.h1}</h1>
          <p className={`mt-2 text-base sm:text-lg font-medium ${tagc}`}>{c.tagline}</p>
          <p className={`mt-2 text-xs ${updc}`}>{c.updated}</p>
        </header>

        {/* Section 1, the question */}
        <div className="mt-8">
          {c.intro.map((p, i) => (
            <p key={i} className={`text-base leading-relaxed mb-5 ${bodyc}`}>{p}</p>
          ))}
          <p className={`text-lg sm:text-xl font-bold leading-snug my-6 ${questionc}`}>{c.question}</p>
          <p className={`text-base leading-relaxed ${bodyc}`}>{c.questionAfter}</p>
        </div>

        {/* Section 2, core claim (callout) */}
        <div className={`border-l-4 ${calloutBox} rounded-r-xl p-6 my-10`}>
          <p className={`text-sm mb-3 ${bodyc}`}>{c.thesisIntro}</p>
          <p className={`text-base sm:text-lg font-semibold leading-relaxed mb-3 ${thesisStrong}`}>{c.thesis}</p>
          <p className={`text-sm leading-relaxed ${bodyc}`}>{c.thesisAfter}</p>
        </div>

        {/* Sections 3 onward */}
        <div className="space-y-8">
          {c.sections.map((s, idx) => (
            <section key={idx} className={`rounded-xl border p-6 shadow-sm ${cardBox}`}>
              <h2 className={`text-lg sm:text-xl font-bold mb-3 ${headingc}`}>{s.heading}</h2>
              {s.paras?.map((p, i) => (
                <p key={i} className={`text-sm sm:text-base leading-relaxed mb-3 last:mb-0 ${bodyc}`}>{p}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc pl-5 space-y-2 mt-3">
                  {s.bullets.map((b, i) => renderBullet(b, i, bodyc, leadc))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className={`mt-12 pt-6 border-t ${dividerc}`}>
          {c.closing.map((p, i) => (
            <p key={i} className={`text-xs leading-relaxed ${updc}`}>{p}</p>
          ))}
        </div>

        <nav className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm ${dividerc}`}>
          <a href={`/${locale}/how-it-works`} className={`font-medium ${navLink}`}>{t.method}</a>
        </nav>
      </div>
    </main>
  )
}
