'use client'
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, type ReactNode } from 'react'
import { MONTHS, type MonthsLocale } from '../../lib/i18n/months'
import { InlineSubscribe } from './InlineSubscribe'

type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-daily-theme'

export interface AfosDailyData {
  date: string          // YYYY-MM-DD
  updatedAt: string     // "DD/MM/YYYY, HH:MM"
  title: string         // "AFOS Daily, DD de MÊS de YYYY"
  locale: string        // "pt-BR" | "en" | "es"
  status: string        // "published" | "pilot"
  lede: string
  // TL;DR: optional 3-bullet summary rendered above lede. Convention is
  // 1 bullet per article section (Mercado / Pesquisas+Eventos / Divergência).
  // Label is the literal acronym "TL;DR" in all 3 locales (PT/EN/ES).
  tldr?: string[]
  body: string          // markdown body (without footer)
  sources: string       // comma-separated source list extracted from markdown footer
}

interface NavDates {
  previous?: string  // YYYY-MM-DD
  next?: string      // YYYY-MM-DD
}

function formatDateExtenso(dateIso: string, locale: string): string {
  const parts = dateIso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateIso
  const [y, m, d] = parts
  if (m < 1 || m > 12) return dateIso
  const loc: MonthsLocale = (locale === 'en' || locale === 'es') ? locale : 'pt-BR'
  const monthName = MONTHS[loc][m - 1]
  return loc === 'en' ? `${monthName} ${d}, ${y}` : `${d} de ${monthName} de ${y}`
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
    glossaryText: 'termos políticos brasileiros usados nas sínteses (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.), definições nos 3 idiomas.',
    glossaryLink: 'Ver glossário completo',
    accessDashboard: '← Acessar o Dashboard',
    homeAriaLabel: 'AFOS Analytics, página inicial',
    themeAria: 'Tema da página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
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
    glossaryText: 'Brazilian political terms used in the syntheses (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.), definitions in 3 languages.',
    glossaryLink: 'See the full glossary',
    accessDashboard: '← Access the Dashboard',
    homeAriaLabel: 'AFOS Analytics, homepage',
    themeAria: 'Page theme',
    lightAria: 'Light mode',
    blueAria: 'Sapphire Blue mode',
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
    glossaryText: 'términos políticos brasileños usados en las síntesis (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.), definiciones en 3 idiomas.',
    glossaryLink: 'Ver glosario completo',
    accessDashboard: '← Acceder al Dashboard',
    homeAriaLabel: 'AFOS Analytics, página principal',
    themeAria: 'Tema de la página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
  },
}

interface Props {
  data: AfosDailyData
  nav?: NavDates
  // Markdown renderizado no SERVIDOR (DailyMarkdown) e passado como nós prontos,
  // p/ react-markdown ficar fora do bundle client. Cor via amd-* + [data-theme].
  renderedTldr?: ReactNode[]
  renderedLede?: ReactNode
  renderedBody?: ReactNode
}

// Link canônico do dataset BR2026 no Harvard Dataverse (DOI permanente).
// Mesma URL usada no hero da landing, README, how-it-works e LinkedIn.
// Pílula no hero da daily = lastro acadêmico dos dados de divergência da série.
const HARVARD_DOI_URL = 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7'

const LANG_LABEL: Record<string, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }
const NAV_LABEL = {
  'pt-BR': { prev: '← Síntese anterior', next: 'Próxima síntese →', archive: 'Todas as edições' },
  en: { prev: '← Previous synthesis', next: 'Next synthesis →', archive: 'All editions' },
  es: { prev: '← Síntesis anterior', next: 'Próxima síntesis →', archive: 'Todas las ediciones' },
}

function ThemeToggle({ theme, onChoose, labels }: { theme: Theme; onChoose: (t: Theme) => void; labels: { group: string; light: string; blue: string } }) {
  const isBlue = theme === 'blue'
  const baseStyle = 'w-6 h-6 rounded border-2 transition-all'
  return (
    <div className={`absolute top-3 right-3 md:top-5 md:right-5 flex items-center gap-2 p-1.5 rounded-lg ${isBlue ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-white border border-gray-200'}`} role="radiogroup" aria-label={labels.group}>
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label={labels.light}
        onClick={() => onChoose('light')}
        className={`${baseStyle} bg-slate-50 ${theme === 'light' ? 'border-primary scale-110' : 'border-gray-300 hover:border-gray-400'}`}
      />
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'blue'}
        aria-label={labels.blue}
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

export function AfosDailyTemplate({ data, nav, renderedTldr, renderedLede, renderedBody }: Props) {
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
  // Lede agora renderiza como BOX AMARELO HIGHLIGHT (Opção B firmada 26/Mai noite):
  // - bg-yellow-100 + border-yellow-500 thick = highlight visual no topo do daily
  // - Distinto do amber-50 mais suave da seção 4 Divergências (hierarquia: lede > divergências)
  // - Mesma cor em ambos temas (yellow contrasta com white e Sapphire blue de fundo)
  const ledeBg = 'bg-yellow-100'
  const ledeBorder = 'border-yellow-500'
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  const footerBorder = isBlue ? 'border-blue-400/30' : 'border-gray-200'
  const footerText = isBlue ? 'text-blue-200' : 'text-gray-500'
  const footerStrong = isBlue ? 'text-white' : 'text-gray-700'
  const ctaBg = isBlue ? 'bg-white text-primary hover:bg-blue-50' : 'bg-primary text-white hover:bg-primary/90'
  const harvardPill = isBlue
    ? 'bg-white/15 text-white hover:bg-white/25 border-white/20'
    : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/15'

  return (
    <div data-theme={theme} className={`min-h-screen ${pageBg} transition-colors`}>
      <article className="max-w-[720px] mx-auto px-5 md:px-10 py-12 md:py-14 relative">
        <ThemeToggle theme={theme} onChoose={chooseTheme} labels={{ group: t.themeAria, light: t.lightAria, blue: t.blueAria }} />

        <nav className="mb-10 text-sm flex flex-wrap items-center justify-between gap-3 pr-20">
          <a href={`/${locale}/dashboard/br`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>Dashboard</a>
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
        <p className={`text-center text-xs mb-5 italic ${disclaimerColor}`}>{t.disclaimer}</p>

        {/* Harvard Dataverse, lastro acadêmico dos dados de divergência da série.
            Link, não badge de imagem, p/ acessibilidade e theme-awareness. */}
        <div className="flex justify-center mb-12">
          <a
            href={HARVARD_DOI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${harvardPill}`}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M4 10 H7 V17 H4 Z M10 10 H13 V17 H10 Z M16 10 H19 V17 H16 Z M2 19 H21 V22 H2 Z M11.5 1 L2 6 V8 H21 V6 Z" />
            </svg>
            Harvard Dataverse · DOI 10.7910/DVN/2D0UK7
          </a>
        </div>

        {/* TL;DR, bloco callout antes da lede; opcional, backward compatible */}
        {renderedTldr && renderedTldr.length > 0 && (
          <aside
            className={`rounded-lg border-l-4 ${isBlue ? 'bg-blue-950/40 border-blue-300' : 'bg-slate-50 border-primary'} p-4 md:p-5 mb-6`}
            aria-label="TL;DR"
          >
            <h2 className={`text-sm font-extrabold uppercase tracking-[0.18em] mb-3 ${isBlue ? 'text-blue-200' : 'text-primary'}`}>
              📌 TL;DR
            </h2>
            <ul className="space-y-2 list-none pl-0">
              {renderedTldr.map((node, i) => (
                <li key={i} className="text-sm md:text-base leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:font-bold amd-tldr-li">
                  {node}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* LEDE, box amarelo highlight (Opção B firmada 26/Mai) */}
        {renderedLede && (
          <div className={`${ledeBg} border-l-4 ${ledeBorder} px-5 py-4 mb-10 rounded-r-lg`}>
            {renderedLede}
          </div>
        )}

        {/* BODY (markdown) */}
        <div className="prose prose-slate max-w-none">
          {!data.body && (
            <p className={`italic ${footerText}`}>{locale === 'en' ? 'Synthesis content unavailable for this date.' : locale === 'es' ? 'Contenido de la síntesis no disponible para esta fecha.' : 'Conteúdo da síntese indisponível para esta data.'}</p>
          )}
          {renderedBody}
        </div>

        {/* PREV / ARCHIVE / NEXT NAVIGATION (archive link always present) */}
        <div className={`mt-12 pt-6 border-t ${footerBorder} flex flex-wrap items-center justify-between gap-3 text-sm`}>
          {/* Navegação de edição como botões (mesmo estilo do botão Dashboard do masthead) */}
          {nav?.previous ? (
            <a href={`/${locale}/daily/${nav.previous}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>
              {NAV_LABEL[locale].prev}
            </a>
          ) : <span />}
          <a href={`/${locale}/daily`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>
            {NAV_LABEL[locale].archive}
          </a>
          {nav?.next ? (
            <a href={`/${locale}/daily/${nav.next}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>
              {NAV_LABEL[locale].next}
            </a>
          ) : <span />}
        </div>

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
            <a href={`/${locale}/dashboard/br`} className={linkColor}>{t.integrationText2}</a>{t.integrationText3}{' '}
            <a href={`/${locale}/how-it-works`} className={linkColor}>{t.integrationText4}</a>.
          </p>
          <p>
            <strong className={footerStrong}>{t.glossaryLabel}</strong> {t.glossaryText}{' '}
            <a href={`/${locale}/glossary`} className={linkColor}>{t.glossaryLink} →</a>
          </p>
        </div>

        <InlineSubscribe locale={locale} isBlue={isBlue} product="daily" />

        <div className="mt-12 text-center">
          <a
            href={`/${locale}/dashboard/br`}
            className={`inline-block px-8 py-3 rounded-xl font-semibold transition-colors text-sm ${ctaBg}`}
          >
            {t.accessDashboard}
          </a>
        </div>
      </article>
    </div>
  )
}
