'use client'
import { useEffect, useState } from 'react'
import type { CountrySEO, ElectionSEO } from '../../lib/seo/countries'
import { ISO3_TO_CC, STATUS_LABELS as STATUS_L } from '../../lib/seo/countries'
import type { CountryDivergence } from '../../lib/country-data'

type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-country-theme'

function ThemeToggle({ theme, onChoose, isBlue, labels }: { theme: Theme; onChoose: (t: Theme) => void; isBlue: boolean; labels: { group: string; light: string; blue: string } }) {
  const base = 'w-5 h-5 rounded border-2 transition-all'
  return (
    <div className={`flex items-center gap-1.5 rounded-lg p-1 ${isBlue ? 'border border-blue-400/30 bg-blue-900/40' : 'border border-gray-200 bg-white'}`} role="radiogroup" aria-label={labels.group}>
      <button type="button" role="radio" aria-checked={theme === 'light'} aria-label={labels.light} onClick={() => onChoose('light')} className={`${base} bg-slate-50 ${theme === 'light' ? 'scale-110 border-primary' : 'border-gray-300 hover:border-gray-400'}`} />
      <button type="button" role="radio" aria-checked={theme === 'blue'} aria-label={labels.blue} onClick={() => onChoose('blue')} className={`${base} bg-[#0a3d8f] ${theme === 'blue' ? 'scale-110 border-white' : 'border-blue-700 hover:border-blue-500'}`} />
    </div>
  )
}

const L: Record<string, { themeAria: string; themeLight: string; themeBlue: string; backToCountry: string; date: string; status: string; marketTitle: string; whoWins: string; volume: string; snapshotNote: (d: string) => string; viewOn: string; context: string; implications: string; institutional: string; whyPrediction: string; ctx: (n: string, t: string, y: number) => string; impl: (n: string) => string; inst: (n: string) => string; why: string }> = {
  'pt-BR': { themeAria: 'Tema', themeLight: 'Tema claro', themeBlue: 'Tema Sapphire', backToCountry: '← Ver país', date: 'Data', status: 'Status', marketTitle: 'Mercado de previsão (Polymarket)', whoWins: 'Quem vence?', volume: 'Volume', snapshotNote: (d) => `Foto do mercado em ${d}, pré-resultado (mercado encerrado).`, viewOn: 'Ver no Polymarket', context: 'Contexto político', implications: 'Implicações de mercado', institutional: 'Relevância institucional', whyPrediction: 'Por que mercados de previsão', ctx: (n, t, y) => `A eleição ${t.toLowerCase()} de ${n} em ${y} é monitorada pela AFOS Analytics com dados de mercados de previsão, pesquisas eleitorais e análise de eventos críticos.`, impl: (n) => `Resultados eleitorais em ${n} impactam diretamente percepção de risco soberano, fluxos de capital e decisões de investidores globais. Mercados de previsão precificam cenários prováveis em tempo real.`, inst: (n) => `Fundos, bancos e consultorias estratégicas usam sinais eleitorais para antecipar movimentos de mercado. A AFOS Analytics consolida esses sinais em uma interface acessível.`, why: 'Mercados de previsão com dinheiro real (como Polymarket) são historicamente competitivos com as pesquisas. Refletem onde as pessoas colocam seu dinheiro, não apenas sua opinião; e a divergência entre os dois é o sinal que a AFOS acompanha.' },
  en: { themeAria: 'Theme', themeLight: 'Light theme', themeBlue: 'Sapphire theme', backToCountry: '← View country', date: 'Date', status: 'Status', marketTitle: 'Prediction market (Polymarket)', whoWins: 'Who wins?', volume: 'Volume', snapshotNote: (d) => `Market snapshot on ${d}, pre-result (market closed).`, viewOn: 'View on Polymarket', context: 'Political context', implications: 'Market implications', institutional: 'Institutional relevance', whyPrediction: 'Why prediction markets', ctx: (n, t, y) => `The ${t.toLowerCase()} election in ${n} ${y} is monitored by AFOS Analytics with prediction market data, electoral polls, and critical event analysis.`, impl: (n) => `Election outcomes in ${n} directly impact sovereign risk perception, capital flows, and global investor decisions. Prediction markets price likely scenarios in real time.`, inst: (n) => `Funds, banks, and strategic consultancies use election signals to anticipate market movements. AFOS Analytics consolidates these signals into an accessible interface.`, why: 'Real-money prediction markets (like Polymarket) are historically competitive with polls. They reflect where people put their money, not just their opinion; and the divergence between the two is the signal AFOS tracks.' },
  es: { themeAria: 'Tema', themeLight: 'Tema claro', themeBlue: 'Tema Sapphire', backToCountry: '← Ver país', date: 'Fecha', status: 'Estado', marketTitle: 'Mercado de predicción (Polymarket)', whoWins: '¿Quién gana?', volume: 'Volumen', snapshotNote: (d) => `Foto del mercado el ${d}, pre-resultado (mercado cerrado).`, viewOn: 'Ver en Polymarket', context: 'Contexto político', implications: 'Implicaciones de mercado', institutional: 'Relevancia institucional', whyPrediction: 'Por qué mercados de predicción', ctx: (n, t, y) => `La elección ${t.toLowerCase()} de ${n} en ${y} es monitoreada por AFOS Analytics con datos de mercados de predicción, encuestas electorales y análisis de eventos críticos.`, impl: (n) => `Los resultados electorales en ${n} impactan directamente la percepción de riesgo soberano, flujos de capital y decisiones de inversores globales. Los mercados de predicción precifican escenarios probables en tiempo real.`, inst: (n) => `Fondos, bancos y consultorías estratégicas usan señales electorales para anticipar movimientos de mercado. AFOS Analytics consolida esas señales en una interfaz accesible.`, why: 'Los mercados de predicción con dinero real (como Polymarket) son históricamente competitivos con las encuestas. Reflejan dónde las personas ponen su dinero, no solo su opinión; y la divergencia entre ambos es la señal que AFOS sigue.' },
}

export function ElectionPageContent({ locale, country, election, div }: { locale: string; country: CountrySEO; election: ElectionSEO; div: CountryDivergence | null }) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
    if (saved === 'blue' || saved === 'light') setTheme(saved)
  }, [])
  const choose = (t: Theme) => { setTheme(t); if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, t) }
  const isBlue = theme === 'blue'

  const loc = locale
  const name = country.name[loc] || country.name['en']
  const type = election.type[loc] || election.type['en']
  const cc = ISO3_TO_CC[country.iso3] || country.flag
  const l = L[loc] || L['en']
  const snap = div?.market_snapshot?.candidates?.length ? div.market_snapshot : null

  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-white'
  const textMain = isBlue ? 'text-white' : 'text-dark'
  const textMuted = isBlue ? 'text-blue-200/80' : 'text-gray-500'
  const heading = isBlue ? 'text-blue-100' : 'text-primary'
  const link = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  const card = isBlue ? 'bg-blue-900/40 border-blue-400/30' : 'bg-light-bg border-light-border'
  const mktCard = isBlue ? 'bg-blue-900/30 border-blue-300/30' : 'bg-primary/[0.03] border-primary/20'
  const track = isBlue ? 'bg-blue-950/50' : 'bg-gray-200'
  const linkCard = isBlue ? 'bg-blue-900/40 border-blue-400/30 hover:border-blue-200 text-white' : 'bg-light-bg border-light-border hover:border-primary text-dark'

  const max = snap ? Math.max(...snap.candidates.map((c) => c.market_pct || 0), 1) : 1

  return (
    <div className={`min-h-screen ${pageBg} transition-colors`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between gap-3 mb-6">
          <a href={`/${loc}`} className={`text-base sm:text-lg font-extrabold tracking-tight ${isBlue ? 'text-white' : 'text-primary'}`} aria-label="AFOS Analytics, Home">AFOS Analytics</a>
          <div className="flex items-center gap-4">
            <a href={`/${loc}/country/${country.slug[loc]}`} className={`text-sm font-medium ${link}`}>{l.backToCountry}</a>
            <ThemeToggle theme={theme} onChoose={choose} isBlue={isBlue} labels={{ group: l.themeAria, light: l.themeLight, blue: l.themeBlue }} />
          </div>
        </div>

        <h1 className={`flex items-center gap-3 text-3xl md:text-4xl font-extrabold ${textMain} mb-2`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/flags/${cc}.svg`} alt="" aria-hidden="true" width={40} height={27} className="rounded-sm object-cover shadow-sm" style={{ width: 40, height: 27 }} />
          <span>{name} · {type} {election.year}</span>
        </h1>
        <p className={`${textMuted} mb-8`}>{l.date}: {election.date} · {l.status}: <span>{(STATUS_L[locale] || STATUS_L['en'])[election.status] || election.status}</span></p>

        {snap ? (
          <section className={`${mktCard} border rounded-xl p-6 mb-8`}>
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h2 className={`text-lg font-bold ${heading}`}>🏆 {l.whoWins}</h2>
              <span className={`text-sm font-semibold ${textMuted}`}>{l.volume}: ${((snap.total_volume_usd || 0) / 1e6).toFixed(1)}M</span>
            </div>
            <div className="space-y-2.5">
              {snap.candidates.slice(0, 8).map((c, i) => (
                <div key={c.candidate}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${textMain}`}>{c.candidate}</span>
                    <span className={`tabular-nums font-bold ${i === 0 ? (isBlue ? 'text-blue-200' : 'text-primary') : textMuted}`}>{c.market_pct ?? 0}%</span>
                  </div>
                  <div className={`w-full ${track} rounded-full h-2.5`}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(((c.market_pct || 0) / max) * 100, 100)}%`, backgroundColor: i === 0 ? '#0F52BA' : (isBlue ? '#3b6fd4' : '#94a3b8') }} />
                  </div>
                </div>
              ))}
            </div>
            <p className={`text-xs ${textMuted} mt-4`}>
              {l.snapshotNote(snap.date)}{' '}
              {election.polymarketSlug && <a href={`https://polymarket.com/event/${election.polymarketSlug}`} target="_blank" rel="noopener noreferrer" className={link}>{l.viewOn} ↗</a>}
            </p>
          </section>
        ) : (
          <section className={`${card} border rounded-xl p-6 mb-8`}>
            <h2 className={`text-lg font-bold ${heading} mb-3`}>{l.marketTitle}</h2>
            <p className="text-sm">
              {election.polymarketSlug
                ? <a href={`https://polymarket.com/event/${election.polymarketSlug}`} target="_blank" rel="noopener noreferrer" className={link}>{l.viewOn} ↗</a>
                : <span className={textMuted}>—</span>}
            </p>
          </section>
        )}

        <div className="space-y-6 mb-8">
          <div>
            <h2 className={`text-lg font-bold ${heading} mb-2`}>{l.context}</h2>
            <p className={`text-sm ${textMain} leading-relaxed`}>{l.ctx(name, type, election.year)}</p>
          </div>
          <div>
            <h2 className={`text-lg font-bold ${heading} mb-2`}>{l.implications}</h2>
            <p className={`text-sm ${textMain} leading-relaxed`}>{l.impl(name)}</p>
          </div>
          <div>
            <h2 className={`text-lg font-bold ${heading} mb-2`}>{l.institutional}</h2>
            <p className={`text-sm ${textMain} leading-relaxed`}>{l.inst(name)}</p>
          </div>
          <div>
            <h3 className={`text-base font-bold ${textMain} mb-2`}>{l.whyPrediction}</h3>
            <p className={`text-sm ${textMuted} leading-relaxed`}>{l.why}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`/${loc}/country/${country.slug[loc]}`} className={`${linkCard} border rounded-lg p-3 text-sm font-semibold transition-colors`}>→ {name}</a>
          <a href={`/${loc}/global`} className={`${linkCard} border rounded-lg p-3 text-sm font-semibold transition-colors`}>→ {loc === 'pt-BR' ? 'Cobertura Global' : loc === 'es' ? 'Cobertura Global' : 'Global Coverage'}</a>
        </div>
      </div>
    </div>
  )
}
