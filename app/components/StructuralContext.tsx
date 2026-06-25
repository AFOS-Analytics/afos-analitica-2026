import type { CountryContext } from '../../lib/country-data'

// Bloco "Contexto estrutural" (World Bank WGI + WDI), reutilizado nas páginas de país
// (CountryPageContent) e no dashboard do Brasil. Trilíngue (PT-BR/EN/ES) e theme-aware.

const GOV_ORDER = ['political_stability', 'voice_accountability', 'rule_of_law', 'government_effectiveness', 'regulatory_quality', 'control_of_corruption'] as const

const CTEXTS: Record<string, { title: string; gov: string; eco: string; edu: string; note: string; gov_labels: Record<string, string>; pop: string; gdp: string; gdppc: string; infl: string; edu_spend: string; edu_schooling: string; edu_years: string; locale: string }> = {
  'pt-BR': {
    title: 'Contexto estrutural', gov: 'Governança (escala 0–100)', eco: 'Economia', edu: 'Educação', locale: 'pt-BR',
    note: 'Fonte: World Bank — Worldwide Governance Indicators + World Development Indicators ({year}). Indicadores estruturais anuais que contextualizam o país; não preveem o resultado eleitoral.',
    pop: 'População', gdp: 'PIB', gdppc: 'PIB per capita', infl: 'Inflação', edu_spend: 'Gasto público em educação (% PIB)', edu_schooling: 'Expectativa de anos de escola', edu_years: 'anos',
    gov_labels: { political_stability: 'Estabilidade política', voice_accountability: 'Voz e democracia', rule_of_law: 'Estado de direito', government_effectiveness: 'Efetividade do governo', regulatory_quality: 'Qualidade regulatória', control_of_corruption: 'Controle de corrupção' },
  },
  en: {
    title: 'Structural context', gov: 'Governance (0–100 scale)', eco: 'Economy', edu: 'Education', locale: 'en-US',
    note: 'Source: World Bank — Worldwide Governance Indicators + World Development Indicators ({year}). Annual structural indicators that contextualize the country; they do not predict the electoral outcome.',
    pop: 'Population', gdp: 'GDP', gdppc: 'GDP per capita', infl: 'Inflation', edu_spend: 'Public education spending (% GDP)', edu_schooling: 'Expected years of schooling', edu_years: 'years',
    gov_labels: { political_stability: 'Political stability', voice_accountability: 'Voice & accountability', rule_of_law: 'Rule of law', government_effectiveness: 'Government effectiveness', regulatory_quality: 'Regulatory quality', control_of_corruption: 'Control of corruption' },
  },
  es: {
    title: 'Contexto estructural', gov: 'Gobernanza (escala 0–100)', eco: 'Economía', edu: 'Educación', locale: 'es-ES',
    note: 'Fuente: World Bank — Worldwide Governance Indicators + World Development Indicators ({year}). Indicadores estructurales anuales que contextualizan el país; no predicen el resultado electoral.',
    pop: 'Población', gdp: 'PIB', gdppc: 'PIB per cápita', infl: 'Inflación', edu_spend: 'Gasto público en educación (% PIB)', edu_schooling: 'Años esperados de escolaridad', edu_years: 'años',
    gov_labels: { political_stability: 'Estabilidad política', voice_accountability: 'Voz y rendición de cuentas', rule_of_law: 'Estado de derecho', government_effectiveness: 'Efectividad del gobierno', regulatory_quality: 'Calidad regulatoria', control_of_corruption: 'Control de corrupción' },
  },
}

function fmtUsdCompact(v: number, tag: string) { return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(v) }
function fmtUsd(v: number, tag: string) { return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v) }
function fmtPct(v: number, tag: string) { return new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v) + '%' }
function fmtCountCompact(v: number, tag: string) { return new Intl.NumberFormat(tag, { notation: 'compact', maximumFractionDigits: 1 }).format(v) }

export function StructuralContext({ context, locale, isBlue = false, className = '' }: { context: CountryContext; locale: string; isBlue?: boolean; className?: string }) {
  const ctx = context
  const ct = CTEXTS[locale] || CTEXTS['en']
  const tag = ct.locale
  const card = isBlue ? 'bg-blue-900/40 border-blue-400/30' : 'bg-light-bg border-light-border'
  const heading = isBlue ? 'text-blue-100' : 'text-primary'
  const textMuted = isBlue ? 'text-blue-200/80' : 'text-gray-500'
  const textMain = isBlue ? 'text-white' : 'text-dark'
  const link = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  const barTrack = isBlue ? 'bg-blue-400/15' : 'bg-primary/10'
  const barFill = isBlue ? 'bg-blue-300' : 'bg-primary'

  const govRows = GOV_ORDER.filter((k) => ctx.governance[k]).map((k) => ({ k, label: ct.gov_labels[k], v: ctx.governance[k]!.value }))
  const macro: { label: string; val: string }[] = []
  if (ctx.macro.population) macro.push({ label: ct.pop, val: fmtCountCompact(ctx.macro.population.value, tag) })
  if (ctx.macro.gdp_usd) macro.push({ label: ct.gdp, val: fmtUsdCompact(ctx.macro.gdp_usd.value, tag) })
  if (ctx.macro.gdp_per_capita_usd) macro.push({ label: ct.gdppc, val: fmtUsd(ctx.macro.gdp_per_capita_usd.value, tag) })
  if (ctx.macro.inflation_pct) macro.push({ label: ct.infl, val: fmtPct(ctx.macro.inflation_pct.value, tag) })
  const edu: { label: string; val: string }[] = []
  if (ctx.education?.gov_expenditure_pct_gdp) edu.push({ label: ct.edu_spend, val: fmtPct(ctx.education.gov_expenditure_pct_gdp.value, tag) })
  if (ctx.education?.expected_years_schooling) edu.push({ label: ct.edu_schooling, val: `${new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(ctx.education.expected_years_schooling.value)} ${ct.edu_years}` })

  return (
    <section className={`${card} border rounded-xl p-6 ${className}`}>
      <h2 className={`text-xl font-bold ${heading} mb-4`}>{ct.title}</h2>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <p className={`text-[11px] uppercase tracking-wide ${textMuted} mb-3`}>{ct.gov}</p>
          <div className="space-y-2.5">
            {govRows.map(({ k, label, v }) => (
              <div key={k} className="flex items-center gap-3">
                <span className={`text-sm ${textMain} w-44 shrink-0`}>{label}</span>
                <span className={`h-1.5 flex-1 rounded-full ${barTrack} overflow-hidden`}>
                  <span className={`block h-full rounded-full ${barFill}`} style={{ width: `${Math.max(0, Math.min(100, v))}%` }} />
                </span>
                <span className={`text-sm font-semibold tabular-nums ${textMain} w-8 text-right`}>{Math.round(v)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className={`text-[11px] uppercase tracking-wide ${textMuted} mb-3`}>{ct.eco}</p>
            <div className="space-y-2.5">
              {macro.map(({ label, val }) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <span className={`text-sm ${textMain}`}>{label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${textMain}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          {edu.length > 0 && (
            <div>
              <p className={`text-[11px] uppercase tracking-wide ${textMuted} mb-3`}>{ct.edu}</p>
              <div className="space-y-2.5">
                {edu.map(({ label, val }) => (
                  <div key={label} className="flex items-baseline justify-between gap-3">
                    <span className={`text-sm ${textMain}`}>{label}</span>
                    <span className={`text-sm font-semibold tabular-nums ${textMain} shrink-0`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className={`text-xs ${isBlue ? 'text-blue-300/60' : 'text-gray-400'} mt-5`}>
        {ct.note.replace('{year}', String(ctx.latest_year ?? ''))}{' '}
        <a href={ctx.sources.wgi} target="_blank" rel="noopener noreferrer" className={link}>WGI ↗</a>{' · '}
        <a href={ctx.sources.wdi} target="_blank" rel="noopener noreferrer" className={link}>WDI ↗</a>
      </p>
    </section>
  )
}
