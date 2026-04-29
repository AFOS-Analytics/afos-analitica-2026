/* eslint-disable react/no-unescaped-entities */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
    accessDashboard: '← Acceder al Dashboard',
    homeAriaLabel: 'AFOS Analytics — página principal',
  },
}

interface Props {
  data: AfosDailyData
}

export function AfosDailyTemplate({ data }: Props) {
  const locale = (data.locale === 'en' || data.locale === 'es' ? data.locale : 'pt-BR') as 'pt-BR' | 'en' | 'es'
  const t = T[locale]
  const dateExtenso = formatDateExtenso(data.date, locale)

  return (
    <div className="min-h-screen bg-slate-50">
      <article className="max-w-[720px] mx-auto px-5 md:px-10 py-12 md:py-14">
        <nav className="mb-10 text-sm">
          <a href={`/${locale}/dashboard`} className="text-primary hover:underline">{t.backToDashboard}</a>
        </nav>

        <div className="flex justify-center mb-6">
          <a href={`/${locale}`} aria-label={t.homeAriaLabel} className="hover:opacity-90 transition-opacity">
            <span className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">AFOS Analytics</span>
          </a>
        </div>

        <p className="text-center text-xs font-extrabold text-primary uppercase tracking-[0.25em] mb-2">{t.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary text-center mb-3 tracking-tight leading-tight">
          {dateExtenso}
        </h1>
        <p className="text-center text-gray-600 text-base font-medium mb-2">{t.subline}</p>
        <p className="text-center text-gray-400 text-xs mb-12 italic">{t.disclaimer}</p>

        {/* LEDE */}
        {data.lede && (
          <div className="border-l-4 border-primary pl-5 py-2 mb-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="text-lg md:text-xl text-dark font-medium leading-relaxed">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
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
            <p className="text-gray-500 italic">{locale === 'en' ? 'Synthesis content unavailable for this date.' : locale === 'es' ? 'Contenido de la síntesis no disponible para esta fecha.' : 'Conteúdo da síntese indisponível para esta data.'}</p>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null,
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">{children}</h2>
              ),
              p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
              ),
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              ul: ({ children }) => <ul className="space-y-3 text-gray-700 leading-relaxed mb-6 list-none pl-0">{children}</ul>,
              ol: ({ children }) => <ol className="space-y-3 text-gray-700 leading-relaxed mb-6 list-decimal pl-6">{children}</ol>,
              li: ({ children }) => <li className="flex gap-3"><span className="text-gray-700">{children}</span></li>,
              blockquote: ({ children }) => (
                <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 my-4 rounded-r [&_p]:mb-3 [&_p:last-child]:mb-0">
                  {children}
                </div>
              ),
              hr: () => <hr className="my-10 border-gray-200" />,
            }}
          >
            {data.body}
          </ReactMarkdown>
        </div>

        {/* RODAPÉ MÉTODO */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          {data.sources && (
            <p>
              <strong className="text-gray-700">{t.sourcesLabel}</strong> {data.sources}
            </p>
          )}
          <p>
            <strong className="text-gray-700">{t.methodLabel}</strong> {t.methodText}{' '}
            <a href={`/${locale}/methodology/automated-governance`} className="text-primary hover:underline">{t.methodLink}</a>.
          </p>
          <p>
            <strong className="text-gray-700">{t.integrationLabel}</strong> {t.integrationText1}{' '}
            <a href={`/${locale}/dashboard`} className="text-primary hover:underline">{t.integrationText2}</a>{t.integrationText3}{' '}
            <a href={`/${locale}/how-it-works`} className="text-primary hover:underline">{t.integrationText4}</a>.
          </p>
        </div>

        <div className="mt-12 text-center">
          <a
            href={`/${locale}/dashboard`}
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            {t.accessDashboard}
          </a>
        </div>
      </article>
    </div>
  )
}
