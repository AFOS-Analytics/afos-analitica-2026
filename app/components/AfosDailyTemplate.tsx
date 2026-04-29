'use client'
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-daily-theme'

export interface AfosDailyData {
  date: string          // YYYY-MM-DD
  updatedAt: string     // "DD/MM/YYYY, HH:MM"
  title: string         // "AFOS Daily — DD de MÊS de YYYY"
  locale: string        // "pt-BR" | "en" | "es"
  status: string        // "published" | "pilot"
  lede: string
  body: string          // markdown body (without footer)
  sources: string       // comma-separated source list extracted from markdown footer
}

interface NavDates {
  previous?: string  // YYYY-MM-DD
  next?: string      // YYYY-MM-DD
}

function formatDateExtenso(dateIso: string, locale: string): string {
  const meses: Record<string, string[]> = {
    'pt-BR': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  }
  const parts = dateIso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateIso
  const [y, m, d] = parts
  if (m < 1 || m > 12) return dateIso
  const monthName = (meses[locale] ?? meses['pt-BR'])[m - 1]
  if (locale === 'en') return `${monthName} ${d}, ${y}`
  return `${d} de ${monthName} de ${y}`
}

const T = {
  'pt-BR': {
    backToDashboard: '← Voltar ao Dashboard',
    eyebrow: 'AFOS Daily · Síntese do Dia',
    subline: 'Mercado de Previsão × Pesquisas × Notícias',
    disclaimer: 'Síntese gerada com base em dados auditáveis. Cada alegação cita sua fonte.',
    sourcesLabel: 'Fontes citadas neste texto:',
    methodLabel: 'Método:',
    methodText: 'esta síntese é gerada automaticamente a partir dos dados auditáveis da plataforma AFOS Analytics, sob regras em código versionadas em git. Todas as alegações podem ser verificadas na plataforma ou nas fontes linkadas.',
    methodLink: 'Entenda a governança automatizada',
    integrationLabel: 'Integração:',
    integrationText1: 'para ver os dados ao vivo e as análises dos candidatos em detalhe, acesse o',
    integrationText2: 'dashboard completo',
    integrationText3: '. Para entender o método em profundidade, leia',
    integrationText4: 'O Método',
    glossaryLabel: 'Glossário:',
    glossaryText: 'termos políticos brasileiros usados nas sínteses (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.) — definições nos 3 idiomas.',
    glossaryLink: 'Ver glossário completo',
    accessDashboard: '← Acessar o Dashboard',
    homeAriaLabel: 'AFOS Analytics — página inicial',
  },
  en: {
    backToDashboard: '← Back to Dashboard',
    eyebrow: 'AFOS Daily · Daily Synthesis',
    subline: 'Prediction Markets × Polls × News',
    disclaimer: 'Synthesis generated from auditable data. Every claim cites its source.',
    sourcesLabel: 'Sources cited in this text:',
    methodLabel: 'Method:',
    methodText: 'this synthesis is generated automatically from auditable data on the AFOS Analytics platform, under code-versioned rules in git. All claims can be verified on the platform or in the linked sources.',
    methodLink: 'Understand the automated governance',
    integrationLabel: 'Integration:',
    integrationText1: 'for live data and detailed candidate analyses, access the',
    integrationText2: 'full dashboard',
    integrationText3: '. To understand the method in depth, read',
    integrationText4: 'The Method',
    glossaryLabel: 'Glossary:',
    glossaryText: 'Brazilian political terms used in the syntheses (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.) — definitions in 3 languages.',
    glossaryLink: 'See the full glossary',
    accessDashboard: '← Access the Dashboard',
    homeAriaLabel: 'AFOS Analytics — homepage',
  },
  es: {
    backToDashboard: '← Volver al Dashboard',
    eyebrow: 'AFOS Daily · Síntesis del Día',
    subline: 'Mercados de Predicción × Encuestas × Noticias',
    disclaimer: 'Síntesis generada con base en datos auditables. Cada afirmación cita su fuente.',
    sourcesLabel: 'Fuentes citadas en este texto:',
    methodLabel: 'Método:',
    methodText: 'esta síntesis se genera automáticamente a partir de datos auditables de la plataforma AFOS Analytics, bajo reglas en código versionadas en git. Todas las afirmaciones pueden ser verificadas en la plataforma o en las fuentes enlazadas.',
    methodLink: 'Entienda la gobernanza automatizada',
    integrationLabel: 'Integración:',
    integrationText1: 'para datos en vivo y análisis detallados de candidatos, acceda al',
    integrationText2: 'dashboard completo',
    integrationText3: '. Para entender el método en profundidad, lea',
    integrationText4: 'El Método',
    glossaryLabel: 'Glosario:',
    glossaryText: 'términos políticos brasileños usados en las síntesis (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.) — definiciones en 3 idiomas.',
    glossaryLink: 'Ver glosario completo',
    accessDashboard: '← Acceder al Dashboard',
    homeAriaLabel: 'AFOS Analytics — página principal',
  },
}

interface Props {
  data: AfosDailyData
  nav?: NavDates
}

const LANG_LABEL: Record<string, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }
const NAV_LABEL = {
  'pt-BR': { prev: '← Síntese anterior', next: 'Próxima síntese →' },
  en: { prev: '← Previous synthesis', next: 'Next synthesis →' },
  es: { prev: '← Síntesis anterior', next: 'Próxima síntesis →' },
}

function ThemeToggle({ theme, onChoose }: { theme: Theme; onChoose: (t: Theme) => void }) {
  const isBlue = theme === 'blue'
  const baseStyle = 'w-6 h-6 rounded border-2 transition-all'
  return (
    <div className={`absolute top-3 right-3 md:top-5 md:right-5 flex items-center gap-2 p-1.5 rounded-lg ${isBlue ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-white border border-gray-200'}`} role="radiogroup" aria-label="Tema da página">
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label="Modo claro"
        onClick={() => onChoose('light')}
        className={`${baseStyle} bg-slate-50 ${theme === 'light' ? 'border-primary scale-110' : 'border-gray-300 hover:border-gray-400'}`}
      />
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'blue'}
        aria-label="Modo Sapphire Blue"
        onClick={() => onChoose('blue')}
        className={`${baseStyle} bg-[#0a3d8f] ${theme === 'blue' ? 'border-white scale-110' : 'border-blue-700 hover:border-blue-500'}`}
      />
    </div>
  )
}

function LanguagePicker({ currentLocale, currentDate, isBlue }: { currentLocale: string; currentDate: string; isBlue: boolean }) {
  const locales: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es']
  const linkBase = isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary'
  const activeBase = isBlue ? 'text-white font-bold' : 'text-primary font-bold'
  return (
    <div className="flex items-center gap-2 text-xs">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className={isBlue ? 'text-blue-400/50' : 'text-gray-300'}>·</span>}
          <a
            href={`/${loc}/daily/${currentDate}`}
            aria-label={`Idioma: ${LANG_LABEL[loc]}`}
            className={loc === currentLocale ? activeBase : linkBase}
          >
            {LANG_LABEL[loc]}
          </a>
        </span>
      ))}
    </div>
  )
}

export function AfosDailyTemplate({ data, nav }: Props) {
  const locale = (data.locale === 'en' || data.locale === 'es' ? data.locale : 'pt-BR') as 'pt-BR' | 'en' | 'es'
  const t = T[locale]
  const dateExtenso = formatDateExtenso(data.date, locale)

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
  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-slate-50'
  const headingColor = isBlue ? 'text-white' : 'text-primary'
  const wordmarkColor = isBlue ? 'text-white' : 'text-primary'
  const eyebrowColor = isBlue ? 'text-blue-200' : 'text-primary'
  const sublineColor = isBlue ? 'text-blue-100' : 'text-gray-600'
  const disclaimerColor = isBlue ? 'text-blue-200/70' : 'text-gray-400'
  const ledeBorder = isBlue ? 'border-blue-300' : 'border-primary'
  const ledeText = isBlue ? 'text-blue-50' : 'text-dark'
  const sectionBorder = isBlue ? 'border-blue-400/40' : 'border-blue-100'
  const sectionHeading = isBlue ? 'text-white' : 'text-primary'
  const bodyText = isBlue ? 'text-blue-50' : 'text-gray-700'
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  const strongColor = isBlue ? 'text-white' : 'text-dark'
  const blockquoteBg = isBlue ? 'bg-blue-900/40 border-amber-300' : 'bg-amber-50 border-amber-500'
  const footerBorder = isBlue ? 'border-blue-400/30' : 'border-gray-200'
  const footerText = isBlue ? 'text-blue-200' : 'text-gray-500'
  const footerStrong = isBlue ? 'text-white' : 'text-gray-700'
  const ctaBg = isBlue ? 'bg-white text-primary hover:bg-blue-50' : 'bg-primary text-white hover:bg-primary/90'

  return (
    <div className={`min-h-screen ${pageBg} transition-colors`}>
      <article className="max-w-[720px] mx-auto px-5 md:px-10 py-12 md:py-14 relative">
        <ThemeToggle theme={theme} onChoose={chooseTheme} />

        <nav className="mb-10 text-sm flex flex-wrap items-center justify-between gap-3 pr-20">
          <a href={`/${locale}/dashboard`} className={linkColor}>{t.backToDashboard}</a>
          <LanguagePicker currentLocale={locale} currentDate={data.date} isBlue={isBlue} />
        </nav>

        <div className="flex justify-center mb-6">
          <a href={`/${locale}`} aria-label={t.homeAriaLabel} className="hover:opacity-90 transition-opacity">
            <span className={`text-3xl md:text-4xl font-extrabold tracking-tight ${wordmarkColor}`}>AFOS Analytics</span>
          </a>
        </div>

        <p className={`text-center text-xs font-extrabold uppercase tracking-[0.25em] mb-2 ${eyebrowColor}`}>{t.eyebrow}</p>
        <h1 className={`text-4xl md:text-5xl font-extrabold text-center mb-3 tracking-tight leading-tight ${headingColor}`}>
          {dateExtenso}
        </h1>
        <p className={`text-center text-base font-medium mb-2 ${sublineColor}`}>{t.subline}</p>
        <p className={`text-center text-xs mb-12 italic ${disclaimerColor}`}>{t.disclaimer}</p>

        {/* LEDE */}
        {data.lede && (
          <div className={`border-l-4 ${ledeBorder} pl-5 py-2 mb-10`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className={`text-lg md:text-xl font-medium leading-relaxed ${ledeText}`}>{children}</p>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={linkColor}>{children}</a>
                ),
                strong: ({ children }) => <strong>{children}</strong>,
              }}
            >
              {data.lede}
            </ReactMarkdown>
          </div>
        )}

        {/* BODY (markdown) */}
        <div className="prose prose-slate max-w-none">
          {!data.body && (
            <p className={`italic ${footerText}`}>{locale === 'en' ? 'Synthesis content unavailable for this date.' : locale === 'es' ? 'Contenido de la síntesis no disponible para esta fecha.' : 'Conteúdo da síntese indisponível para esta data.'}</p>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null,
              h2: ({ children }) => (
                <h2 className={`text-2xl font-bold mt-10 mb-4 pb-2 border-b-2 ${sectionHeading} ${sectionBorder}`}>{children}</h2>
              ),
              p: ({ children }) => <p className={`mb-4 leading-relaxed ${bodyText}`}>{children}</p>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkColor}>{children}</a>
              ),
              strong: ({ children }) => <strong className={`font-bold ${strongColor}`}>{children}</strong>,
              ul: ({ children }) => <ul className={`space-y-3 leading-relaxed mb-6 list-none pl-0 ${bodyText}`}>{children}</ul>,
              ol: ({ children }) => <ol className={`space-y-3 leading-relaxed mb-6 list-decimal pl-6 ${bodyText}`}>{children}</ol>,
              li: ({ children }) => <li className="flex gap-3"><span>{children}</span></li>,
              blockquote: ({ children }) => (
                <div className={`border-l-4 pl-5 py-4 my-4 rounded-r [&_p]:mb-3 [&_p:last-child]:mb-0 ${blockquoteBg}`}>
                  {children}
                </div>
              ),
              hr: () => <hr className={`my-10 ${footerBorder}`} />,
            }}
          >
            {data.body}
          </ReactMarkdown>
        </div>

        {/* PREV / NEXT NAVIGATION */}
        {(nav?.previous || nav?.next) && (
          <div className={`mt-12 pt-6 border-t ${footerBorder} flex flex-wrap items-center justify-between gap-3 text-sm`}>
            {nav?.previous ? (
              <a href={`/${locale}/daily/${nav.previous}`} className={`${linkColor} font-medium`}>
                {NAV_LABEL[locale].prev}
              </a>
            ) : <span />}
            {nav?.next ? (
              <a href={`/${locale}/daily/${nav.next}`} className={`${linkColor} font-medium`}>
                {NAV_LABEL[locale].next}
              </a>
            ) : <span />}
          </div>
        )}

        {/* RODAPÉ MÉTODO */}
        <div className={`mt-12 pt-8 border-t text-xs space-y-3 ${footerBorder} ${footerText}`}>
          {data.sources && (
            <p>
              <strong className={footerStrong}>{t.sourcesLabel}</strong> {data.sources}
            </p>
          )}
          <p>
            <strong className={footerStrong}>{t.methodLabel}</strong> {t.methodText}{' '}
            <a href={`/${locale}/methodology/automated-governance`} className={linkColor}>{t.methodLink}</a>.
          </p>
          <p>
            <strong className={footerStrong}>{t.integrationLabel}</strong> {t.integrationText1}{' '}
            <a href={`/${locale}/dashboard`} className={linkColor}>{t.integrationText2}</a>{t.integrationText3}{' '}
            <a href={`/${locale}/how-it-works`} className={linkColor}>{t.integrationText4}</a>.
          </p>
          <p>
            <strong className={footerStrong}>{t.glossaryLabel}</strong> {t.glossaryText}{' '}
            <a href={`/${locale}/glossary`} className={linkColor}>{t.glossaryLink} →</a>
          </p>
        </div>

        <div className="mt-12 text-center">
          <a
            href={`/${locale}/dashboard`}
            className={`inline-block px-8 py-3 rounded-xl font-semibold transition-colors text-sm ${ctaBg}`}
          >
            {t.accessDashboard}
          </a>
        </div>
      </article>
    </div>
  )
}
