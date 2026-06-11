'use client'

import { useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'blue'
// Chave compartilhada com o AFOS Daily/Tradeoff → preferência de leitura unificada.
const THEME_KEY = 'afos-daily-theme'

const L: Record<string, { back: string; cta: string; langAria: string; themeAria: string; light: string; blue: string }> = {
  'pt-BR': { back: '← Voltar ao Dashboard', cta: '← Acessar o Dashboard', langAria: 'Seletor de idioma', themeAria: 'Tema da página', light: 'Modo claro', blue: 'Modo Sapphire Blue' },
  en: { back: '← Back to Dashboard', cta: '← Access the Dashboard', langAria: 'Language selector', themeAria: 'Page theme', light: 'Light mode', blue: 'Sapphire Blue mode' },
  es: { back: '← Volver al Dashboard', cta: '← Acceder al Dashboard', langAria: 'Selector de idioma', themeAria: 'Tema de la página', light: 'Modo claro', blue: 'Modo Sapphire Blue' },
}

function ThemeToggle({ theme, onChoose, ariaLabel, lightLabel, blueLabel }: { theme: Theme; onChoose: (t: Theme) => void; ariaLabel: string; lightLabel: string; blueLabel: string }) {
  const isBlue = theme === 'blue'
  const baseStyle = 'w-6 h-6 rounded border-2 transition-all'
  return (
    <div className={`flex items-center gap-2 p-1.5 rounded-lg ${isBlue ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-white border border-gray-200'}`} role="radiogroup" aria-label={ariaLabel}>
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label={lightLabel}
        onClick={() => onChoose('light')}
        className={`${baseStyle} bg-slate-50 ${theme === 'light' ? 'border-primary scale-110' : 'border-gray-300 hover:border-gray-400'}`}
      />
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'blue'}
        aria-label={blueLabel}
        onClick={() => onChoose('blue')}
        className={`${baseStyle} bg-[#0a3d8f] ${theme === 'blue' ? 'border-white scale-110' : 'border-blue-700 hover:border-blue-500'}`}
      />
    </div>
  )
}

export function ThemeShell({ loc, slug, children }: { loc: string; slug: string; children: ReactNode }) {
  const t = L[loc] || L.en
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

  return (
    <div className={isBlue ? 'dark' : undefined}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a3d8f] transition-colors">
        <article className="max-w-[920px] mx-auto px-5 md:px-10 py-12 md:py-14">
          <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 text-sm">
            <a href={`/${loc}`} aria-label="AFOS Analytics, Home" className="text-base sm:text-lg font-extrabold tracking-tight text-primary dark:text-white">AFOS Analytics</a>
            <div className="flex items-center gap-3">
              <a href={`/${loc}/dashboard`} className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90">Dashboard</a>
              <div className="flex items-center gap-1" aria-label={t.langAria}>
                {(['pt-BR', 'en', 'es'] as const).map((l) => (
                  <a
                    key={l}
                    href={`/${l}/${slug}`}
                    hrefLang={l}
                    aria-current={l === loc ? 'page' : undefined}
                    className={
                      l === loc
                        ? 'px-2.5 py-1 rounded-md bg-primary text-white text-xs font-semibold'
                        : 'px-2.5 py-1 rounded-md text-slate-500 dark:text-blue-200 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-blue-900/40 text-xs font-semibold transition-colors'
                    }
                  >
                    {l === 'pt-BR' ? 'PT-BR' : l === 'es' ? 'ES' : 'EN'}
                  </a>
                ))}
              </div>
              <ThemeToggle theme={theme} onChoose={chooseTheme} ariaLabel={t.themeAria} lightLabel={t.light} blueLabel={t.blue} />
            </div>
          </nav>
          {children}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-blue-400/30 text-center">
            <a href={`/${loc}/dashboard`} className="inline-block bg-primary text-white dark:bg-white dark:text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 dark:hover:bg-blue-50 transition-colors text-sm">
              {t.cta}
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
