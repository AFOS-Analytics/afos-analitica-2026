'use client'
import { useEffect, useState } from 'react'
import type { CountrySEO } from '../../lib/seo/countries'
import { ISO3_TO_CC, STATUS_LABELS as STATUS_L } from '../../lib/seo/countries'
import type { CountryDivergence } from '../../lib/country-data'
import { OddsTrajectoryChart } from './OddsTrajectoryChart'

type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-country-theme'

const LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { themeAria: 'Tema', themeLight: 'Tema claro', themeBlue: 'Tema Sapphire', region: 'Região', type: 'Tipo', date: 'Data', status: 'Status', elections: 'Eleições monitoradas', backToDashboard: '← Dashboard', overview: 'Visão geral', risk: 'Risco Político', market: 'Relevância para o Mercado', why: 'Por que acompanhar', politicalRisk: 'Risco Político', forInvestors: 'Para Investidores' },
  en: { themeAria: 'Theme', themeLight: 'Light theme', themeBlue: 'Sapphire theme', region: 'Region', type: 'Type', date: 'Date', status: 'Status', elections: 'Monitored elections', backToDashboard: '← Dashboard', overview: 'Overview', risk: 'Political Risk', market: 'Market Relevance', why: 'Why monitor', politicalRisk: 'Political Risk', forInvestors: 'For Investors' },
  es: { themeAria: 'Tema', themeLight: 'Tema claro', themeBlue: 'Tema Sapphire', region: 'Región', type: 'Tipo', date: 'Fecha', status: 'Estado', elections: 'Elecciones monitoreadas', backToDashboard: '← Dashboard', overview: 'Visión general', risk: 'Riesgo Político', market: 'Relevancia de Mercado', why: 'Por qué monitorear', politicalRisk: 'Riesgo Político', forInvestors: 'Para Inversores' },
}
const TEXTS = (name: string): Record<string, Record<string, string>> => ({
  'pt-BR': { overview: `Acompanhe a eleição de ${name} com dados de mercados de previsão, pesquisas eleitorais e análise de risco político.`, risk: `O cenário político de ${name} é monitorado com sinais de mercados de previsão, sentimento público e eventos críticos que podem impactar câmbio, investimentos e governança.`, market: `Eleições em ${name} impactam diretamente fluxos de capital, câmbio e percepção de risco soberano. Mercados de previsão oferecem sinais antecipados sobre cenários prováveis.`, why: `${name} é um dos mercados monitorados pela AFOS Analytics. Cruzar mercado de previsão e pesquisas permite decisões mais informadas para investidores, analistas e cidadãos.` },
  en: { overview: `Track ${name}'s election with prediction market data, electoral polls, and political risk analysis.`, risk: `${name}'s political landscape is monitored with prediction market signals, public sentiment, and critical events that may impact FX, investments, and governance.`, market: `Elections in ${name} directly impact capital flows, FX, and sovereign risk perception. Prediction markets offer early signals on likely scenarios.`, why: `${name} is one of the markets monitored by AFOS Analytics. Cross-referencing prediction markets and polls enables more informed decisions for investors, analysts, and citizens.` },
  es: { overview: `Siga la elección de ${name} con datos de mercados de predicción, encuestas electorales y análisis de riesgo político.`, risk: `El escenario político de ${name} es monitoreado con señales de mercados de predicción, sentimiento público y eventos críticos que pueden impactar divisas, inversiones y gobernanza.`, market: `Las elecciones en ${name} impactan directamente flujos de capital, tipo de cambio y percepción de riesgo soberano. Los mercados de predicción ofrecen señales anticipadas sobre escenarios probables.`, why: `${name} es uno de los mercados monitoreados por AFOS Analytics. Cruzar mercados de predicción y encuestas permite decisiones más informadas para inversores, analistas y ciudadanos.` },
})
const DTEXTS: Record<string, { title: string; subtitle: string; candidate: string; poll: string; market: string; div: string; dataset: string; harvard: string; source: (p: string, d: string, n: number) => string }> = {
  'pt-BR': { title: 'Análise de divergência', subtitle: 'Mercado de previsão × pesquisas', candidate: 'Candidato', poll: 'Pesquisa', market: 'Mercado', div: 'Divergência', dataset: 'Dataset aberto', harvard: 'Harvard DOI', source: (p, d, n) => `Pesquisa mais recente (${p}, ${d}) cruzada com odds do Polymarket. Dataset aberto com ${n} pesquisas.` },
  en: { title: 'Divergence analysis', subtitle: 'Prediction market × polls', candidate: 'Candidate', poll: 'Poll', market: 'Market', div: 'Divergence', dataset: 'Open dataset', harvard: 'Harvard DOI', source: (p, d, n) => `Latest poll (${p}, ${d}) cross-referenced with Polymarket odds. Open dataset with ${n} polls.` },
  es: { title: 'Análisis de divergencia', subtitle: 'Mercado de predicción × encuestas', candidate: 'Candidato', poll: 'Encuesta', market: 'Mercado', div: 'Divergencia', dataset: 'Dataset abierto', harvard: 'Harvard DOI', source: (p, d, n) => `Encuesta más reciente (${p}, ${d}) cruzada con odds de Polymarket. Dataset abierto con ${n} encuestas.` },
}

const GOV_ORDER = ['political_stability', 'voice_accountability', 'rule_of_law', 'government_effectiveness', 'regulatory_quality', 'control_of_corruption'] as const
const CTEXTS: Record<string, { title: string; gov: string; eco: string; note: string; gov_labels: Record<string, string>; gdp: string; gdppc: string; infl: string; locale: string }> = {
  'pt-BR': {
    title: 'Contexto estrutural', gov: 'Governança (escala 0–100)', eco: 'Economia', locale: 'pt-BR',
    note: 'Fonte: World Bank — Worldwide Governance Indicators + World Development Indicators ({year}). Indicadores estruturais anuais que contextualizam o país; não preveem o resultado eleitoral.',
    gdp: 'PIB', gdppc: 'PIB per capita', infl: 'Inflação',
    gov_labels: { political_stability: 'Estabilidade política', voice_accountability: 'Voz e democracia', rule_of_law: 'Estado de direito', government_effectiveness: 'Efetividade do governo', regulatory_quality: 'Qualidade regulatória', control_of_corruption: 'Controle de corrupção' },
  },
  en: {
    title: 'Structural context', gov: 'Governance (0–100 scale)', eco: 'Economy', locale: 'en-US',
    note: 'Source: World Bank — Worldwide Governance Indicators + World Development Indicators ({year}). Annual structural indicators that contextualize the country; they do not predict the electoral outcome.',
    gdp: 'GDP', gdppc: 'GDP per capita', infl: 'Inflation',
    gov_labels: { political_stability: 'Political stability', voice_accountability: 'Voice & accountability', rule_of_law: 'Rule of law', government_effectiveness: 'Government effectiveness', regulatory_quality: 'Regulatory quality', control_of_corruption: 'Control of corruption' },
  },
  es: {
    title: 'Contexto estructural', gov: 'Gobernanza (escala 0–100)', eco: 'Economía', locale: 'es-ES',
    note: 'Fuente: World Bank — Worldwide Governance Indicators + World Development Indicators ({year}). Indicadores estructurales anuales que contextualizan el país; no predicen el resultado electoral.',
    gdp: 'PIB', gdppc: 'PIB per cápita', infl: 'Inflación',
    gov_labels: { political_stability: 'Estabilidad política', voice_accountability: 'Voz y rendición de cuentas', rule_of_law: 'Estado de derecho', government_effectiveness: 'Efectividad del gobierno', regulatory_quality: 'Calidad regulatoria', control_of_corruption: 'Control de corrupción' },
  },
}

// Formatadores locale-aware. notation:'compact' resolve tri/bi por idioma (pt "28,8 tri", en "28.8T").
function fmtUsdCompact(v: number, tag: string) {
  return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(v)
}
function fmtUsd(v: number, tag: string) {
  return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
}
function fmtPct(v: number, tag: string) {
  return new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v) + '%'
}

function ThemeToggle({ theme, onChoose, isBlue, labels }: { theme: Theme; onChoose: (t: Theme) => void; isBlue: boolean; labels: { group: string; light: string; blue: string } }) {
  const base = 'w-5 h-5 rounded border-2 transition-all'
  return (
    <div className={`flex items-center gap-1.5 rounded-lg p-1 ${isBlue ? 'border border-blue-400/30 bg-blue-900/40' : 'border border-gray-200 bg-white'}`} role="radiogroup" aria-label={labels.group}>
      <button type="button" role="radio" aria-checked={theme === 'light'} aria-label={labels.light} onClick={() => onChoose('light')} className={`${base} bg-slate-50 ${theme === 'light' ? 'scale-110 border-primary' : 'border-gray-300 hover:border-gray-400'}`} />
      <button type="button" role="radio" aria-checked={theme === 'blue'} aria-label={labels.blue} onClick={() => onChoose('blue')} className={`${base} bg-[#0a3d8f] ${theme === 'blue' ? 'scale-110 border-white' : 'border-blue-700 hover:border-blue-500'}`} />
    </div>
  )
}

export function CountryPageContent({ locale, country, div }: { locale: string; country: CountrySEO; div: CountryDivergence | null }) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
    if (saved === 'blue' || saved === 'light') setTheme(saved)
  }, [])
  const choose = (t: Theme) => { setTheme(t); if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, t) }
  const isBlue = theme === 'blue'

  const loc = locale
  const name = country.name[loc] || country.name['en']
  const cc = ISO3_TO_CC[country.iso3] || country.flag
  const election = country.elections[0]
  const elType = election?.type[loc] || election?.type['en'] || ''
  const l = LABELS[loc] || LABELS['en']
  const t = TEXTS(name)[loc] || TEXTS(name)['en']
  const ds = DTEXTS[loc] || DTEXTS['en']

  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-white'
  const textMain = isBlue ? 'text-white' : 'text-dark'
  const textMuted = isBlue ? 'text-blue-200/80' : 'text-gray-500'
  const heading = isBlue ? 'text-blue-100' : 'text-primary'
  const link = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  const card = isBlue ? 'bg-blue-900/40 border-blue-400/30' : 'bg-light-bg border-light-border'
  const divCard = isBlue ? 'bg-blue-900/30 border-blue-300/30' : 'bg-primary/[0.03] border-primary/20'
  const thRow = isBlue ? 'text-blue-300/70 border-blue-400/20' : 'text-gray-500 border-light-border'
  const tdRow = isBlue ? 'border-blue-400/15' : 'border-light-border/40'
  const tdNum = isBlue ? 'text-blue-100/80' : 'text-gray-600'
  const elCard = isBlue ? 'bg-blue-800/40 border-blue-400/30 hover:bg-blue-800/60' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  const instCard = isBlue ? 'bg-blue-900/40 border-blue-400/30 hover:border-blue-200 text-white' : 'bg-light-bg border-light-border hover:border-primary text-dark'
  const pos = isBlue ? 'text-emerald-400' : 'text-emerald-600'
  const neg = isBlue ? 'text-red-400' : 'text-red-600'

  return (
    <div className={`min-h-screen ${pageBg} transition-colors`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between gap-3 mb-6">
          <a href={`/${loc}`} className={`text-base sm:text-lg font-extrabold tracking-tight ${isBlue ? 'text-white' : 'text-primary'}`} aria-label="AFOS Analytics, Home">AFOS Analytics</a>
          <div className="flex items-center gap-4">
            <a href={`/${loc}/dashboard`} className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90">Dashboard</a>
            <ThemeToggle theme={theme} onChoose={choose} isBlue={isBlue} labels={{ group: l.themeAria, light: l.themeLight, blue: l.themeBlue }} />
          </div>
        </div>

        <h1 className={`flex items-center gap-3 text-3xl md:text-4xl font-extrabold ${textMain} mb-2`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/flags/${cc}.svg`} alt="" aria-hidden="true" width={40} height={27} className="rounded-sm object-cover shadow-sm" style={{ width: 40, height: 27 }} />
          {name}
        </h1>
        <p className={`${textMuted} mb-8`}>{l.region}: {country.region}</p>

        {election && (
          <div className={`${card} border rounded-xl p-6 mb-8`}>
            <h2 className={`text-xl font-bold ${heading} mb-4`}>{l.elections}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className={`text-xs ${textMuted} uppercase`}>{l.type}</span>
                <p className={`font-semibold ${textMain}`}>{elType} {election.year}</p>
              </div>
              <div>
                <span className={`text-xs ${textMuted} uppercase`}>{l.date}</span>
                <p className={`font-semibold ${textMain}`}>{election.date}</p>
              </div>
              <div>
                <span className={`text-xs ${textMuted} uppercase`}>{l.status}</span>
                <p className={`font-semibold ${textMain}`}>{(STATUS_L[loc] || STATUS_L['en'])[election.status] || election.status}</p>
              </div>
            </div>
          </div>
        )}

        {div && (
          <section className={`${divCard} border rounded-xl p-6 mb-8`}>
            <h2 className={`text-xl font-bold ${heading} mb-0.5`}>{ds.title}</h2>
            <p className={`text-xs ${textMuted} uppercase tracking-wide mb-4`}>{ds.subtitle}</p>
            <p className={`text-sm ${textMain} leading-relaxed mb-5`}>{div.headline?.[loc] || div.headline?.['en']}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-[11px] uppercase border-b ${thRow}`}>
                    <th className="text-left font-medium py-2">{ds.candidate}</th>
                    <th className="text-right font-medium px-2">{ds.poll}</th>
                    <th className="text-right font-medium px-2">{ds.market}</th>
                    <th className="text-right font-medium pl-2">{ds.div}</th>
                  </tr>
                </thead>
                <tbody>
                  {(div.rows || []).map((r) => (
                    <tr key={r.candidate} className={`border-b ${tdRow} align-top`}>
                      <td className={`py-2 font-medium ${textMain}`}>
                        {r.candidate}
                        {r.note && (r.note[loc] || r.note['en']) && (
                          <span className={`block text-[11px] font-normal italic ${textMuted} mt-0.5 max-w-xs leading-snug`}>⚠ {r.note[loc] || r.note['en']}</span>
                        )}
                      </td>
                      <td className={`text-right tabular-nums px-2 ${tdNum}`}>{r.poll_pct}%</td>
                      <td className={`text-right tabular-nums px-2 ${tdNum}`}>{r.market_pct}%{r.note ? '*' : ''}</td>
                      <td className={`text-right tabular-nums font-semibold pl-2 ${r.divergence_pp > 0 ? pos : r.divergence_pp < 0 ? neg : textMuted}`}>{r.divergence_pp > 0 ? '+' : ''}{r.divergence_pp}pp{r.note ? '*' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {div.market_trajectory && (
              <OddsTrajectoryChart trajectory={div.market_trajectory} volume={div.market_snapshot?.total_volume_usd || 0} locale={loc} isBlue={isBlue} />
            )}
            <p className={`text-xs ${isBlue ? 'text-blue-300/60' : 'text-gray-400'} mt-4`}>
              {ds.source(div.latest_poll?.pollster || '', div.latest_poll?.date || '', div.polls_count ?? 0)}{' '}
              {div.harvard && <><a href={div.harvard} target="_blank" rel="noopener noreferrer" className={link}>🎓 {ds.harvard} ↗</a> · </>}
              <a href={div.hf} target="_blank" rel="noopener noreferrer" className={link}>🤗 {ds.dataset} ↗</a>
            </p>
          </section>
        )}

        {div?.context && (() => {
          const ctx = div.context!
          const ct = CTEXTS[loc] || CTEXTS['en']
          const tag = ct.locale
          const barTrack = isBlue ? 'bg-blue-400/15' : 'bg-primary/10'
          const barFill = isBlue ? 'bg-blue-300' : 'bg-primary'
          const govRows = GOV_ORDER.filter((k) => ctx.governance[k]).map((k) => ({ k, label: ct.gov_labels[k], v: ctx.governance[k]!.value }))
          const macro: { label: string; val: string }[] = []
          if (ctx.macro.gdp_usd) macro.push({ label: ct.gdp, val: fmtUsdCompact(ctx.macro.gdp_usd.value, tag) })
          if (ctx.macro.gdp_per_capita_usd) macro.push({ label: ct.gdppc, val: fmtUsd(ctx.macro.gdp_per_capita_usd.value, tag) })
          if (ctx.macro.inflation_pct) macro.push({ label: ct.infl, val: fmtPct(ctx.macro.inflation_pct.value, tag) })
          return (
            <section className={`${card} border rounded-xl p-6 mb-8`}>
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
              </div>
              <p className={`text-xs ${isBlue ? 'text-blue-300/60' : 'text-gray-400'} mt-5`}>
                {ct.note.replace('{year}', String(ctx.latest_year ?? ''))}{' '}
                <a href={ctx.sources.wgi} target="_blank" rel="noopener noreferrer" className={link}>WGI ↗</a>{' · '}
                <a href={ctx.sources.wdi} target="_blank" rel="noopener noreferrer" className={link}>WDI ↗</a>
              </p>
            </section>
          )
        })()}

        <div className="space-y-6 mb-8">
          {([['overview', t.overview], ['risk', t.risk], ['market', t.market], ['why', t.why]] as const).map(([k, body]) => (
            <div key={k}>
              <h2 className={`text-lg font-bold ${heading} mb-2`}>{l[k]}</h2>
              <p className={`text-sm ${textMain} leading-relaxed`}>{body}</p>
            </div>
          ))}
        </div>

        {country.elections.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${heading} mb-3`}>{l.elections}</h2>
            <div className="space-y-2">
              {country.elections.map((el) => (
                <a key={el.slug} href={`/${loc}/election/${el.slug}`} className={`block ${elCard} border rounded-lg p-4 transition-colors`}>
                  <span className={`font-semibold ${textMain}`}>{el.type[loc] || el.type['en']} {el.year}</span>
                  <span className={`text-xs ${textMuted} ml-2`}>{(STATUS_L[loc] || STATUS_L['en'])[el.status] || el.status}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`/${loc}/political-risk`} className={`${instCard} border rounded-lg p-3 text-sm font-semibold transition-colors`}>→ {l.politicalRisk}</a>
          <a href={`/${loc}/for-investors`} className={`${instCard} border rounded-lg p-3 text-sm font-semibold transition-colors`}>→ {l.forInvestors}</a>
        </div>
      </div>
    </div>
  )
}
