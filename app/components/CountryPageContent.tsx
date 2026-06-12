'use client'
import { useEffect, useState } from 'react'
import type { CountrySEO } from '../../lib/seo/countries'
import type { CountryDivergence } from '../../lib/country-data'

type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-country-theme'
const ISO3_TO_CC: Record<string, string> = { BRA: 'br', FRA: 'fr', DEU: 'de', GBR: 'gb', CAN: 'ca', AUS: 'au', KOR: 'kr', COL: 'co', PER: 'pe', CHL: 'cl', IND: 'in', MEX: 'mx', NGA: 'ng', PHL: 'ph', USA: 'us' }

const LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { region: 'Região', type: 'Tipo', date: 'Data', status: 'Status', elections: 'Eleições monitoradas', backToDashboard: '← Dashboard', overview: 'Visão geral', risk: 'Risco Político', market: 'Relevância para o Mercado', why: 'Por que acompanhar', politicalRisk: 'Risco Político', forInvestors: 'Para Investidores' },
  en: { region: 'Region', type: 'Type', date: 'Date', status: 'Status', elections: 'Monitored elections', backToDashboard: '← Dashboard', overview: 'Overview', risk: 'Political Risk', market: 'Market Relevance', why: 'Why monitor', politicalRisk: 'Political Risk', forInvestors: 'For Investors' },
  es: { region: 'Región', type: 'Tipo', date: 'Fecha', status: 'Estado', elections: 'Elecciones monitoreadas', backToDashboard: '← Dashboard', overview: 'Visión general', risk: 'Riesgo Político', market: 'Relevancia de Mercado', why: 'Por qué monitorear', politicalRisk: 'Riesgo Político', forInvestors: 'Para Inversores' },
}
const STATUS_L: Record<string, Record<string, string>> = {
  'pt-BR': { active: 'Em andamento', completed: 'Encerrada', upcoming: 'Futura' },
  en: { active: 'Active', completed: 'Completed', upcoming: 'Upcoming' },
  es: { active: 'En curso', completed: 'Finalizada', upcoming: 'Próxima' },
}
const TEXTS = (name: string): Record<string, Record<string, string>> => ({
  'pt-BR': { overview: `Acompanhe a eleição de ${name} com dados de mercados de previsão, pesquisas eleitorais e análise de risco político.`, risk: `O cenário político de ${name} é monitorado com sinais de mercados de previsão, sentimento público e eventos críticos que podem impactar câmbio, investimentos e governança.`, market: `Eleições em ${name} impactam diretamente fluxos de capital, câmbio e percepção de risco soberano. Mercados de previsão oferecem sinais antecipados sobre cenários prováveis.`, why: `${name} é um dos mercados monitorados pela AFOS Analytics. Cruzar mercado de previsão e pesquisas permite decisões mais informadas para investidores, analistas e cidadãos.` },
  en: { overview: `Track ${name}'s election with prediction market data, electoral polls, and political risk analysis.`, risk: `${name}'s political landscape is monitored with prediction market signals, public sentiment, and critical events that may impact FX, investments, and governance.`, market: `Elections in ${name} directly impact capital flows, FX, and sovereign risk perception. Prediction markets offer early signals on likely scenarios.`, why: `${name} is one of the markets monitored by AFOS Analytics. Cross-referencing prediction markets and polls enables more informed decisions for investors, analysts, and citizens.` },
  es: { overview: `Siga la elección de ${name} con datos de mercados de predicción, encuestas electorales y análisis de riesgo político.`, risk: `El escenario político de ${name} es monitoreado con señales de mercados de predicción, sentimiento público y eventos críticos que pueden impactar divisas, inversiones y gobernanza.`, market: `Las elecciones en ${name} impactan directamente flujos de capital, tipo de cambio y percepción de riesgo soberano. Los mercados de predicción ofrecen señales anticipadas sobre escenarios probables.`, why: `${name} es uno de los mercados monitoreados por AFOS Analytics. Cruzar mercados de predicción y encuestas permite decisiones más informadas para inversores, analistas y ciudadanos.` },
})
const DTEXTS: Record<string, { title: string; subtitle: string; candidate: string; poll: string; market: string; div: string; dataset: string; source: (p: string, d: string, n: number) => string }> = {
  'pt-BR': { title: 'Análise de divergência', subtitle: 'Mercado de previsão × pesquisas', candidate: 'Candidato', poll: 'Pesquisa', market: 'Mercado', div: 'Divergência', dataset: 'Dataset aberto', source: (p, d, n) => `Pesquisa mais recente (${p}, ${d}) cruzada com odds do Polymarket. Dataset aberto com ${n} pesquisas.` },
  en: { title: 'Divergence analysis', subtitle: 'Prediction market × polls', candidate: 'Candidate', poll: 'Poll', market: 'Market', div: 'Divergence', dataset: 'Open dataset', source: (p, d, n) => `Latest poll (${p}, ${d}) cross-referenced with Polymarket odds. Open dataset with ${n} polls.` },
  es: { title: 'Análisis de divergencia', subtitle: 'Mercado de predicción × encuestas', candidate: 'Candidato', poll: 'Encuesta', market: 'Mercado', div: 'Divergencia', dataset: 'Dataset abierto', source: (p, d, n) => `Encuesta más reciente (${p}, ${d}) cruzada con odds de Polymarket. Dataset abierto con ${n} encuestas.` },
}

function ThemeToggle({ theme, onChoose, isBlue }: { theme: Theme; onChoose: (t: Theme) => void; isBlue: boolean }) {
  const base = 'w-5 h-5 rounded border-2 transition-all'
  return (
    <div className={`flex items-center gap-1.5 rounded-lg p-1 ${isBlue ? 'border border-blue-400/30 bg-blue-900/40' : 'border border-gray-200 bg-white'}`} role="radiogroup" aria-label="Tema">
      <button type="button" role="radio" aria-checked={theme === 'light'} aria-label="Tema claro" onClick={() => onChoose('light')} className={`${base} bg-slate-50 ${theme === 'light' ? 'scale-110 border-primary' : 'border-gray-300 hover:border-gray-400'}`} />
      <button type="button" role="radio" aria-checked={theme === 'blue'} aria-label="Tema Sapphire" onClick={() => onChoose('blue')} className={`${base} bg-[#0a3d8f] ${theme === 'blue' ? 'scale-110 border-white' : 'border-blue-700 hover:border-blue-500'}`} />
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
            <ThemeToggle theme={theme} onChoose={choose} isBlue={isBlue} />
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
            <p className={`text-xs ${isBlue ? 'text-blue-300/60' : 'text-gray-400'} mt-4`}>
              {ds.source(div.latest_poll?.pollster || '', div.latest_poll?.date || '', div.polls_count ?? 0)}{' '}
              <a href={div.hf} target="_blank" rel="noopener noreferrer" className={link}>🤗 {ds.dataset} ↗</a>
            </p>
          </section>
        )}

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
