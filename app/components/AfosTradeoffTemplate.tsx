'use client'
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, type ReactNode } from 'react'
import type {
  AfosTradeoffData,
  SummaryCard,
  AntiAvgBlock,
  Scenario,
  IndicatorRow,
  LiquidityBlock,
  CalendarRow,
  WatchItem,
  AdditionalReadingBlock,
} from '../../lib/afos-tradeoff/loader'
import { MONTHS, type MonthsLocale } from '../../lib/i18n/months'
import { InlineSubscribe } from './InlineSubscribe'

type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-tradeoff-theme'

// Link canônico do dataset BR2026 no Harvard Dataverse (DOI permanente).
// Pílula no masthead do Tradeoff = lastro acadêmico dos dados que sustentam a edição.
// Mesma pílula do hero do AFOS Daily (consistência entre as duas superfícies).
const HARVARD_DOI_URL = 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7'

interface NavDates {
  previous?: string
  next?: string
}

// Markdown renderizado no SERVIDOR (TradeoffMarkdown) e passado como nós prontos,
// p/ react-markdown ficar fora do bundle client. Construído no page server.
export interface TradeoffRenderedMd {
  sinalDaSemana?: ReactNode
  execSummaryIntro?: ReactNode
  antiAvgIntro?: ReactNode
  antiAvgClosing?: ReactNode
  scenariosIntro?: ReactNode
  calendarFooter?: ReactNode
  methodology?: ReactNode
  trackRecord?: ReactNode
  body?: ReactNode
  antiAvgFooter?: ReactNode
  antiAvgRightDetails?: ReactNode[]
  scenarioTexts?: ReactNode[]
  liquidityAnomaly?: ReactNode
  liquidityFooter?: ReactNode
  additionalIntro?: ReactNode
  additionalFooter?: ReactNode
}

interface Props {
  data: AfosTradeoffData
  nav?: NavDates
  md: TradeoffRenderedMd
  /** Código do país da edição, para a bandeira do masthead. Padrão: Brasil. */
  country?: string
}

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

function formatWeekRange(start: string, end: string, locale: string): string {
  const parts1 = start.split('-').map(Number)
  const parts2 = end.split('-').map(Number)
  if (parts1.length !== 3 || parts2.length !== 3) return `${start}, ${end}`
  const [, m1, d1] = parts1
  const [y2, m2, d2] = parts2
  const loc: MonthsLocale = (locale === 'en' || locale === 'es') ? locale : 'pt-BR'
  const monthName1 = MONTHS[loc][m1 - 1]
  const monthName2 = MONTHS[loc][m2 - 1]
  if (m1 === m2) {
    return loc === 'en' ? `${monthName2} ${d1}-${d2}, ${y2}` : `${d1}-${d2} ${monthName2} ${y2}`
  }
  return loc === 'en' ? `${monthName1} ${d1} - ${monthName2} ${d2}, ${y2}` : `${d1} ${monthName1} - ${d2} ${monthName2} ${y2}`
}

const DELTA_COLOR = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  flat: 'text-slate-500',
}

const SCENARIO_BORDER = {
  base: 'border-l-primary',
  bear: 'border-l-amber-500',
  tail: 'border-l-violet-600',
}

const SCENARIO_LABEL_COLOR = {
  base: 'text-primary',
  bear: 'text-amber-700',
  tail: 'text-violet-700',
}

// Localized UI strings
const T = {
  'pt-BR': {
    backToDashboard: '← Voltar ao Dashboard',
    eyebrow: 'AFOS Tradeoff · Brazil Political Risk Weekly',
    subline: 'Pricing político em tempo real · Mercado de previsão × pesquisas × imprensa · sem médias suavizadas',
    issueLabel: 'Edição',
    weekLabel: 'Semana de',
    publishedLabel: 'Publicada Segunda 07:00 BRT',
    sinalDaSemana: 'Sinal da semana',
    leftHeader: 'Se fosse média ponderada',
    rightHeader: 'AFOS Tradeoff reporta',
    indicatorHeaders: { contract: 'Contrato', value: 'Atual', delta: 'Δ semana', volume: 'Vol USD acum.', reading: 'Leitura implícita' },
    liquidityTotalSuffix: 'vol. acumulado desde abertura',
    liquidityAnomalyLabel: 'Anomalia de leitura.',
    calendarHeaders: { date: 'Data', print: 'Print', sample: 'Amostra', reading: 'Por que importa' },
    section: { 1: 'Executive Summary', 2: 'Por que o AFOS não suaviza', 3: 'Cenários ponderados para a semana', 4: 'Indicator Grid', 5: 'Liquidez e estrutura de mercado', 6: 'Calendário de prints price-relevant', 7: 'Watch list, gatilhos da semana', 8: 'Metodologia', 9: 'Leitura adicional · cobertura macro' },
    paywall: '(paywall)',
    disclaimerLabel: 'Aviso obrigatório.',
    trackRecordLabel: 'Track record · casos validados globalmente',
    disclaimerText: 'Este brief é pesquisa observacional sobre infraestrutura de mercados de previsão, pesquisas eleitorais e fluxo de notícias.',
    disclaimerNotRec: 'Não constitui recomendação de investimento.',
    disclaimerExtra: 'Nenhuma posição é recomendada ou implícita. Polymarket é mercado USD-denominado operando fora da jurisdição brasileira; volumes mencionados são informativos, não orientativos. Decisões de portfólio são responsabilidade exclusiva do leitor e devem considerar análise independente, perfil de risco e regulamentação aplicável.',
    signatureName: 'AFOS Analytics',
    signatureTitle: 'Global Political Risk Intelligence · GLOBAL POR DESIGN',
    homeAriaLabel: 'AFOS Analytics, página inicial',
    themeAria: 'Tema da página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
    previewBanner: 'PREVIEW LOCAL · DRAFT · Não publicado',
    navPrev: '← Edição anterior',
    navNext: 'Próxima edição →',
    navArchive: 'Todas as edições',
  },
  en: {
    backToDashboard: '← Back to Dashboard',
    eyebrow: 'AFOS Tradeoff · Brazil Political Risk Weekly',
    subline: 'Real-time political pricing · Prediction markets × polls × news · no smoothed averages',
    issueLabel: 'Issue',
    weekLabel: 'Week of',
    publishedLabel: 'Published Monday 07:00 BRT',
    sinalDaSemana: 'Signal of the week',
    leftHeader: 'If it were weighted average',
    rightHeader: 'AFOS Tradeoff reports',
    indicatorHeaders: { contract: 'Contract', value: 'Current', delta: 'Δ week', volume: 'Vol USD acc.', reading: 'Implied reading' },
    liquidityTotalSuffix: 'vol. accumulated since opening',
    liquidityAnomalyLabel: 'Reading anomaly.',
    calendarHeaders: { date: 'Date', print: 'Print', sample: 'Sample', reading: 'Why it matters' },
    section: { 1: 'Executive Summary', 2: 'Why AFOS does not smooth', 3: 'Weighted scenarios for the week', 4: 'Indicator Grid', 5: 'Liquidity and market structure', 6: 'Calendar of price-relevant prints', 7: 'Watch list, week triggers', 8: 'Methodology', 9: 'Additional reading · macro coverage' },
    paywall: '(paywall)',
    disclaimerLabel: 'Mandatory disclaimer.',
    trackRecordLabel: 'Track record · globally validated cases',
    disclaimerText: 'This brief is observational research on the infrastructure of prediction markets, electoral polls, and news flow.',
    disclaimerNotRec: 'Does not constitute investment recommendation.',
    disclaimerExtra: 'No position is recommended or implied. Polymarket is a USD-denominated market operating outside Brazilian jurisdiction; volumes mentioned are informative, not orientative. Portfolio decisions are the sole responsibility of the reader and must consider independent analysis, risk profile, and applicable regulation.',
    signatureName: 'AFOS Analytics',
    signatureTitle: 'Global Political Risk Intelligence · GLOBAL BY DESIGN',
    homeAriaLabel: 'AFOS Analytics, homepage',
    themeAria: 'Page theme',
    lightAria: 'Light mode',
    blueAria: 'Sapphire Blue mode',
    previewBanner: 'LOCAL PREVIEW · DRAFT · Not published',
    navPrev: '← Previous edition',
    navNext: 'Next edition →',
    navArchive: 'All editions',
  },
  es: {
    backToDashboard: '← Volver al Dashboard',
    eyebrow: 'AFOS Tradeoff · Brazil Political Risk Weekly',
    subline: 'Pricing político en tiempo real · Mercado de predicción × encuestas × prensa · sin promedios suavizados',
    issueLabel: 'Edición',
    weekLabel: 'Semana de',
    publishedLabel: 'Publicada Lunes 07:00 BRT',
    sinalDaSemana: 'Señal de la semana',
    leftHeader: 'Si fuera promedio ponderado',
    rightHeader: 'AFOS Tradeoff reporta',
    indicatorHeaders: { contract: 'Contrato', value: 'Actual', delta: 'Δ semana', volume: 'Vol USD acum.', reading: 'Lectura implícita' },
    liquidityTotalSuffix: 'vol. acumulado desde apertura',
    liquidityAnomalyLabel: 'Anomalía de lectura.',
    calendarHeaders: { date: 'Fecha', print: 'Print', sample: 'Muestra', reading: 'Por qué importa' },
    section: { 1: 'Executive Summary', 2: 'Por qué AFOS no suaviza', 3: 'Escenarios ponderados para la semana', 4: 'Indicator Grid', 5: 'Liquidez y estructura de mercado', 6: 'Calendario de prints price-relevant', 7: 'Watch list, disparadores de la semana', 8: 'Metodología', 9: 'Lectura adicional · cobertura macro' },
    paywall: '(paywall)',
    disclaimerLabel: 'Aviso obligatorio.',
    trackRecordLabel: 'Track record · casos validados globalmente',
    disclaimerText: 'Este brief es investigación observacional sobre infraestructura de mercados de predicción, encuestas electorales y flujo de noticias.',
    disclaimerNotRec: 'No constituye recomendación de inversión.',
    disclaimerExtra: 'Ninguna posición es recomendada o implícita. Polymarket es mercado denominado en USD operando fuera de la jurisdicción brasileña; volúmenes mencionados son informativos, no orientativos. Decisiones de portafolio son responsabilidad exclusiva del lector.',
    signatureName: 'AFOS Analytics',
    signatureTitle: 'Global Political Risk Intelligence · GLOBAL POR DISEÑO',
    homeAriaLabel: 'AFOS Analytics, página principal',
    themeAria: 'Tema de la página',
    lightAria: 'Modo claro',
    blueAria: 'Modo Sapphire Blue',
    previewBanner: 'PREVIEW LOCAL · DRAFT · No publicado',
    navPrev: '← Edición anterior',
    navNext: 'Próxima edición →',
    navArchive: 'Todas las ediciones',
  },
}

// ────────────────────────────────────────────────────────────────────
// Section components
// ────────────────────────────────────────────────────────────────────

function SectionHeading({ num, title, isBlue }: { num: number; title: string; isBlue: boolean }) {
  return (
    <h2 className={`text-xl font-bold mt-11 mb-4 pb-2 border-b ${isBlue ? 'text-white border-blue-400/40' : 'text-slate-800 border-slate-200'} tracking-tight`}>
      <span className={`font-extrabold mr-1.5 ${isBlue ? 'text-blue-300' : 'text-primary'}`}>{num}.</span>{title}
    </h2>
  )
}

function SummaryCards({ cards }: { cards: SummaryCard[]; isBlue: boolean }) {
  // Summary cards SEMPRE em Sapphire Blue com letras brancas (pedido 24/Mai noite).
  // Delta highlight: amarelo (em vez de verde) pra contrastar melhor com fundo azul.
  const DELTA_COLOR_CARDS = {
    up: 'text-yellow-300',
    down: 'text-yellow-300',
    flat: 'text-blue-200',
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="rounded-lg p-4 bg-primary border border-primary">
          <div className="text-[10px] font-bold tracking-wider uppercase mb-2 text-blue-200">
            {stripMdLinks(card.label)}
          </div>
          <div className="text-[22px] font-extrabold leading-tight mb-1 text-white">
            {card.headline}{card.unit && <span className="text-sm font-extrabold">{card.unit}</span>}
          </div>
          <div className={`text-xs font-semibold ${DELTA_COLOR_CARDS[card.deltaDirection]}`}>{card.delta}</div>
          <div className="text-xs mt-1.5 leading-snug text-blue-100">{stripMdLinks(card.desc)}</div>
        </div>
      ))}
    </div>
  )
}

function AntiAvg({ block, isBlue, footer, rightDetails }: { block: AntiAvgBlock; isBlue: boolean; footer?: ReactNode; rightDetails?: ReactNode[] }) {
  return (
    <div className={`rounded-lg overflow-hidden my-5 ${isBlue ? 'border border-blue-400/40' : 'border border-slate-200'}`}>
      <div className={`px-5 py-3 font-bold ${isBlue ? 'bg-blue-900 text-white' : 'bg-primary text-white'}`}>
        {stripMdLinks(block.title)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`p-5 ${isBlue ? 'bg-blue-950/60 md:border-r border-blue-400/30' : 'bg-stone-50 md:border-r border-slate-200'}`}>
          <div className={`text-[10px] font-bold tracking-wider uppercase mb-2.5 ${isBlue ? 'text-blue-300' : 'text-slate-400'}`}>
            {block.leftLabel}
          </div>
          <div className={`text-[28px] font-extrabold leading-none mb-2 line-through decoration-red-600 decoration-2 ${isBlue ? 'text-blue-300' : 'text-slate-400'}`}>
            {stripMdLinks(block.leftValue)}{block.leftUnit && <span className="text-sm">{block.leftUnit}</span>}
          </div>
          {block.leftDetails.map((d, i) => (
            <div key={i} className={`text-xs ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>{d}</div>
          ))}
        </div>
        <div className={`p-5 ${isBlue ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
          <div className={`text-[10px] font-bold tracking-wider uppercase mb-2.5 ${isBlue ? 'text-blue-200' : 'text-primary'}`}>
            {block.rightLabel}
          </div>
          <div className={`text-[28px] font-extrabold leading-none mb-2 ${isBlue ? 'text-white' : 'text-primary'}`}>
            {stripMdLinks(block.rightValue)}
          </div>
          {block.rightDetails.map((_d, i) => (
            <div key={i} className={`text-xs ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>
              {rightDetails?.[i]}
            </div>
          ))}
          {block.rightBadge && (
            <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded text-white ${isBlue ? 'bg-blue-700' : 'bg-primary'}`}>
              {block.rightBadge}
            </span>
          )}
        </div>
      </div>
      {block.footer && (
        <div className={`p-4 px-5 text-sm italic leading-relaxed ${isBlue ? 'bg-blue-950 text-blue-100 border-t border-blue-400/30' : 'bg-white text-slate-600 border-t border-slate-200'}`}>
          {footer}
        </div>
      )}
    </div>
  )
}

function Scenarios({ scenarios, isBlue, texts }: { scenarios: Scenario[]; isBlue: boolean; texts?: ReactNode[] }) {
  return (
    <div className="space-y-3 my-4">
      {scenarios.map((s, i) => (
        <div key={i} className={`rounded p-4 border-l-4 ${SCENARIO_BORDER[s.type]} ${isBlue ? 'bg-blue-900/30' : 'bg-slate-50'}`}>
          <div className={`text-[11px] font-bold tracking-wider uppercase mb-2 ${isBlue ? ({ base: 'text-blue-200', bear: 'text-amber-300', tail: 'text-violet-300' })[s.type] : SCENARIO_LABEL_COLOR[s.type]}`}>
            {s.label}
          </div>
          <div className={`text-sm leading-relaxed ${isBlue ? 'text-blue-50' : 'text-slate-800'}`}>
            {texts?.[i]}
          </div>
        </div>
      ))}
    </div>
  )
}

function IndicatorGrid({ rows, headers, isBlue }: { rows: IndicatorRow[]; headers: { contract: string; value: string; delta: string; volume: string; reading: string }; isBlue: boolean }) {
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  return (
    <div className="my-4 overflow-x-auto">
      <table className={`w-full text-[13px] border-collapse ${isBlue ? 'text-blue-50' : 'text-slate-800'}`}>
        <thead>
          <tr className={isBlue ? 'bg-blue-900 text-white' : 'bg-primary text-white'}>
            <th className="text-left font-semibold px-3 py-2.5">{headers.contract}</th>
            <th className="text-right font-semibold px-3 py-2.5">{headers.value}</th>
            <th className="text-right font-semibold px-3 py-2.5">{headers.delta}</th>
            <th className="text-right font-semibold px-3 py-2.5">{headers.volume}</th>
            <th className="text-left font-semibold px-3 py-2.5">{headers.reading}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`${row.highlight ? (isBlue ? 'bg-blue-900/40' : 'bg-amber-50') : ''} ${isBlue ? 'border-b border-blue-400/20' : 'border-b border-slate-200'}`}>
              <td className="px-3 py-2.5">
                {row.contractLink ? (
                  <a href={row.contractLink} target="_blank" rel="noopener noreferrer" className={`font-semibold ${linkColor}`}>{stripMdLinks(row.contract)}</a>
                ) : (
                  <span className={`font-semibold ${isBlue ? 'text-white' : 'text-slate-900'}`}>{stripMdLinks(row.contract)}</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{row.value}</td>
              <td className={`px-3 py-2.5 text-right font-semibold tabular-nums ${DELTA_COLOR[row.deltaDirection]}`}>{row.delta}</td>
              <td className={`px-3 py-2.5 text-right tabular-nums ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>{row.volume}</td>
              <td className={`px-3 py-2.5 italic text-xs ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>{stripMdLinks(row.reading)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Liquidity({ block, totalSuffix, anomalyLabel, isBlue, anomaly, footer }: { block: LiquidityBlock; totalSuffix: string; anomalyLabel: string; isBlue: boolean; anomaly?: ReactNode; footer?: ReactNode }) {
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  return (
    <>
      <div className={`my-4 rounded-lg p-5 ${isBlue ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-slate-50 border border-slate-200'}`}>
        <div className={`flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 mb-3.5 pb-3 ${isBlue ? 'border-b border-blue-400/30' : 'border-b border-slate-200'}`}>
          <span className={`text-[11px] font-bold tracking-wider uppercase ${isBlue ? 'text-blue-300' : 'text-slate-400'}`}>
            {block.totalLink ? (
              <a href={block.totalLink} target="_blank" rel="noopener noreferrer" className={linkColor}>{block.totalLabel}</a>
            ) : block.totalLabel}
            {' · '}{totalSuffix}
          </span>
          <span className={`text-2xl font-extrabold tabular-nums ${isBlue ? 'text-white' : 'text-primary'}`}>{block.total}</span>
        </div>
        <div className="space-y-2">
          {block.rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className={`w-6 font-bold text-xs ${isBlue ? 'text-blue-300' : 'text-slate-400'}`}>{row.rank}</span>
              <span className={`flex-1 text-[13px] font-semibold ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                {row.name}
                <small className={`ml-1.5 font-normal ${isBlue ? 'text-blue-200' : 'text-slate-500'}`}>{row.probability}</small>
              </span>
              <span className={`flex-[2] mx-2 h-2 rounded overflow-hidden ${isBlue ? 'bg-blue-950' : 'bg-white border border-slate-200'}`}>
                <span className="block h-full" style={{ width: `${row.barWidth}%`, background: 'linear-gradient(90deg, #0F52BA 0%, #0A3D8F 100%)' }} />
              </span>
              <span className={`text-[13px] font-bold tabular-nums min-w-[80px] text-right ${isBlue ? 'text-white' : 'text-slate-900'}`}>{row.amount}</span>
            </div>
          ))}
        </div>
        {block.anomalyText && (
          <div className={`mt-4 px-4 py-3 border-l-[3px] border-amber-500 rounded text-[13px] ${isBlue ? 'bg-amber-900/30 text-amber-100' : 'bg-amber-50 text-amber-900'}`}>
            <strong className={isBlue ? 'text-amber-200' : 'text-amber-800'}>{anomalyLabel}</strong>{' '}
            {anomaly}
          </div>
        )}
      </div>
      {block.footer && (
        <div className={`text-sm leading-relaxed ${isBlue ? 'text-blue-50' : 'text-slate-700'}`}>
          {footer}
        </div>
      )}
    </>
  )
}

// O campo `print` é texto plano numa célula (já envolto pelo printLink do TSE).
// O tradutor às vezes injeta link de glossário em termos (ex.: [Datafolha](...)),
// que renderiza cru aqui, remover a sintaxe de link, mantendo só o texto.
function stripMdLinks(s: string): string {
  return (s || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
}

function Calendar({ rows, headers, isBlue }: { rows: CalendarRow[]; headers: { date: string; print: string; sample: string; reading: string }; isBlue: boolean }) {
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  return (
    <div className="my-4 overflow-x-auto">
      <table className={`w-full text-[13px] border-collapse ${isBlue ? 'text-blue-50' : 'text-slate-800'}`}>
        <thead>
          <tr className={isBlue ? 'bg-blue-900 text-white' : 'bg-primary text-white'}>
            <th className="text-left font-semibold px-3 py-2.5">{headers.date}</th>
            <th className="text-left font-semibold px-3 py-2.5">{headers.print}</th>
            <th className="text-left font-semibold px-3 py-2.5">{headers.sample}</th>
            <th className="text-left font-semibold px-3 py-2.5">{headers.reading}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`${row.highlight ? (isBlue ? 'bg-blue-900/40' : 'bg-amber-50') : ''} ${isBlue ? 'border-b border-blue-400/20' : 'border-b border-slate-200'}`}>
              <td className={`px-3 py-2.5 font-semibold ${isBlue ? 'text-white' : 'text-slate-900'}`}>{row.date}</td>
              <td className="px-3 py-2.5">
                {row.printLink ? (
                  <a href={row.printLink} target="_blank" rel="noopener noreferrer" className={`font-semibold ${linkColor}`}>{stripMdLinks(row.print)}</a>
                ) : (
                  <span className="font-semibold">{stripMdLinks(row.print)}</span>
                )}
              </td>
              <td className={`px-3 py-2.5 tabular-nums ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>{row.sample}</td>
              <td className={`px-3 py-2.5 italic text-xs ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>{stripMdLinks(row.reading)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WatchList({ items, isBlue }: { items: WatchItem[]; isBlue: boolean }) {
  return (
    <div className={`my-4 rounded-lg p-5 border-l-4 border-amber-500 ${isBlue ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
      <ol className="list-decimal pl-5 space-y-3">
        {items.map((item, i) => (
          <li key={i} className={`text-sm leading-relaxed ${isBlue ? 'text-amber-50' : 'text-amber-950'}`}>
            <strong className={isBlue ? 'text-white' : 'text-amber-900'}>{stripMdLinks(item.bold)}</strong>{item.text && ' '}
            {stripMdLinks(item.text || '')}
          </li>
        ))}
      </ol>
    </div>
  )
}

function AdditionalReading({ block, paywallLabel, isBlue, intro, footer }: { block: AdditionalReadingBlock; paywallLabel: string; isBlue: boolean; intro?: ReactNode; footer?: ReactNode }) {
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  return (
    <>
      {block.intro && (
        <div className={`text-[13px] leading-relaxed mb-3 ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>
          {intro}
        </div>
      )}
      <ul className="space-y-0 list-none pl-0 text-[13px]">
        {block.items.map((item, i) => (
          <li key={i} className={`py-2 ${i < block.items.length - 1 ? (isBlue ? 'border-b border-blue-400/20' : 'border-b border-slate-200') : ''}`}>
            <strong className={isBlue ? 'text-white' : 'text-slate-900'}>{item.source}</strong>
            {item.description && (
              <>
                {' · '}<span className={isBlue ? 'text-blue-100' : 'text-slate-700'}>{stripMdLinks(item.description)}</span>
              </>
            )}
            {item.paywall && (
              <span className={`ml-1.5 ${isBlue ? 'text-blue-300/70' : 'text-slate-400'}`}>{paywallLabel}</span>
            )}
            {', '}
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={linkColor}>{item.link.replace(/^https?:\/\//, '')}</a>
          </li>
        ))}
      </ul>
      {block.footer && (
        <div className={`mt-3 text-xs italic ${isBlue ? 'text-blue-200/70' : 'text-slate-400'}`}>
          {footer}
        </div>
      )}
    </>
  )
}

function ThemeToggle({ theme, onChoose, labels }: { theme: Theme; onChoose: (t: Theme) => void; labels: { group: string; light: string; blue: string } }) {
  const isBlue = theme === 'blue'
  const baseStyle = 'w-6 h-6 rounded border-2 transition-all'
  return (
    <div className={`absolute top-3 right-3 md:top-5 md:right-5 flex items-center gap-2 p-1.5 rounded-lg ${isBlue ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-white border border-gray-200'}`} role="radiogroup" aria-label={labels.group}>
      <button type="button" role="radio" aria-checked={theme === 'light'} aria-label={labels.light} onClick={() => onChoose('light')} className={`${baseStyle} bg-slate-50 ${theme === 'light' ? 'border-primary scale-110' : 'border-gray-300 hover:border-gray-400'}`} />
      <button type="button" role="radio" aria-checked={theme === 'blue'} aria-label={labels.blue} onClick={() => onChoose('blue')} className={`${baseStyle} bg-[#0a3d8f] ${theme === 'blue' ? 'border-white scale-110' : 'border-blue-700 hover:border-blue-500'}`} />
    </div>
  )
}

function LanguagePicker({ currentLocale, currentDate, isBlue, country }: { currentLocale: string; currentDate: string; isBlue: boolean; country: string }) {
  const locales: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es']
  const linkBase = isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary'
  const activeBase = isBlue ? 'text-white font-bold' : 'text-primary font-bold'
  const LANG_LABEL: Record<string, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }
  return (
    <div className="flex items-center gap-2 text-xs">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className={isBlue ? 'text-blue-400/50' : 'text-gray-300'}>·</span>}
          <a href={`/${loc}/tradeoff/${country}/${currentDate}`} className={loc === currentLocale ? activeBase : linkBase}>{LANG_LABEL[loc]}</a>
        </span>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────
// Main template
// ────────────────────────────────────────────────────────────────────

/**
 * Bandeira do país da edição, no masthead.
 *
 * ⚠️ SVG, NUNCA emoji. A bandeira em emoji não renderiza no Windows, que é onde
 * o André trabalha, e é regra da casa em todas as superfícies. Os arquivos
 * vivem em `/public/flags/{cc}.svg`.
 *
 * `aria-hidden` porque o nome do país já está escrito ao lado: leitor de tela
 * anunciando "bandeira do Brasil, Brasil" é ruído, não acessibilidade.
 */
/**
 * Assinatura do produto por país. O eyebrow do masthead nasceu "Brazil Political
 * Risk Weekly" quando só existia o Brasil; com o produto por país ele passa a
 * dizer de qual eleição a edição trata, senão a edição americana se anuncia
 * como brasileira.
 */
const PAIS_EYEBROW: Record<string, string> = {
  br: 'AFOS Tradeoff · Brazil Political Risk Weekly',
  us: 'AFOS Tradeoff · USA-2026 midterms Political Risk Weekly',
}

const PAIS_ROTULO: Record<string, Record<string, string>> = {
  br: { 'pt-BR': 'Brasil', en: 'Brazil', es: 'Brasil' },
  us: { 'pt-BR': 'Estados Unidos', en: 'United States', es: 'Estados Unidos' },
}

export function AfosTradeoffTemplate({ data, nav, md, country = 'br' }: Props) {
  const locale = (data.locale === 'en' || data.locale === 'es' ? data.locale : 'pt-BR') as 'pt-BR' | 'en' | 'es'
  const t = T[locale]

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
  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-white'
  const ctaBg = isBlue ? 'bg-white text-primary hover:bg-blue-50' : 'bg-primary text-white hover:bg-primary/90'
  const linkColor = isBlue ? 'text-blue-200 hover:text-white' : 'text-primary hover:underline'
  const harvardPill = isBlue
    ? 'bg-white/15 text-white hover:bg-white/25 border-white/20'
    : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/15'

  const weekRange = formatWeekRange(data.weekStart, data.weekEnd, locale)
  const isDraft = data.status !== 'published'

  return (
    <div data-theme={theme} className={`min-h-screen ${pageBg} transition-colors`}>
      {/* Preview banner, only shown for drafts */}
      {isDraft && (
        <div className="bg-[#fef3c7] border-y border-amber-400 text-amber-900 text-xs text-center font-semibold tracking-wide py-2.5 px-4">
          {t.previewBanner}
        </div>
      )}

      <article className="max-w-[760px] mx-auto px-5 md:px-7 pt-12 pb-20 relative">
        <ThemeToggle theme={theme} onChoose={chooseTheme} labels={{ group: t.themeAria, light: t.lightAria, blue: t.blueAria }} />

        <nav className="mb-7 text-sm flex flex-wrap items-center justify-between gap-3 pr-20">
          <a href={`/${locale}/dashboard/br`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>Dashboard</a>
          <LanguagePicker currentLocale={locale} currentDate={data.date} isBlue={isBlue} country={country} />
        </nav>

        {/* Masthead */}
        <header className={`text-center pb-6 mb-7 border-b-[3px] ${isBlue ? 'border-blue-300' : 'border-primary'}`}>
          <div className={`text-[11px] font-extrabold tracking-[4px] uppercase mb-3.5 ${isBlue ? 'text-blue-200' : 'text-primary'}`}>
            {PAIS_EYEBROW[country] ?? t.eyebrow}
          </div>
          <h1 className={`text-[32px] md:text-[44px] font-extrabold tracking-tight leading-none mb-3.5 ${isBlue ? 'text-white' : 'text-primary'}`}>
            <a href={`/${locale}`} aria-label={t.homeAriaLabel} className="hover:opacity-90 transition-opacity">AFOS Analytics</a>
          </h1>
          <p className={`text-[15px] font-medium mb-3.5 max-w-[540px] mx-auto ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>
            {/* subline em 3 linhas: divide nos separadores " · " (mesma cor/tamanho/fonte) */}
            {t.subline.split(' · ').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          {/* Harvard Dataverse, lastro acadêmico dos dados de divergência da edição.
              Link, não badge de imagem, p/ acessibilidade e theme-awareness. Mesma pílula do Daily. */}
          <div className="flex justify-center mb-3.5">
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
          <div className={`flex flex-wrap gap-2.5 justify-center items-center text-xs uppercase tracking-wide ${isBlue ? 'text-blue-300/80' : 'text-slate-400'}`}>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <img
                src={`/flags/${country}.svg`}
                alt=""
                aria-hidden="true"
                width={20}
                height={14}
                className="inline-block h-[14px] w-[20px] rounded-[2px] object-cover align-[-2px] shadow-sm"
              />
              {PAIS_ROTULO[country]?.[locale] ?? country.toUpperCase()}
            </span>
            <span>·</span>
            <span className="font-semibold">{t.issueLabel} №{data.issueNumber}</span>
            <span>·</span>
            <span className="font-semibold">{t.weekLabel} {weekRange}</span>
            <span>·</span>
            <span className="font-semibold">{t.publishedLabel}</span>
          </div>
        </header>

        {/* Lede / Sinal da semana */}
        {data.sinalDaSemana && (
          <div className={`mt-7 mb-8 px-5 py-4 rounded border-l-4 text-[15px] leading-relaxed ${isBlue ? 'border-blue-300 text-blue-50' : 'border-primary text-slate-800'}`}
            style={{ background: isBlue ? 'rgba(15, 82, 186, 0.25)' : 'linear-gradient(135deg, #f0f7ff 0%, #e6f0fc 100%)' }}>
            <div className={`text-[11px] font-bold tracking-wider uppercase mb-2 ${isBlue ? 'text-blue-200' : 'text-primary'}`}>
              {t.sinalDaSemana}
            </div>
            {md.sinalDaSemana}
          </div>
        )}

        {/* Section 1, Executive Summary */}
        {data.summaryCards && data.summaryCards.length > 0 && (
          <>
            <SectionHeading num={1} title={data.sectionTitles?.[1] ?? t.section[1]} isBlue={isBlue} />
            <SummaryCards cards={data.summaryCards} isBlue={isBlue} />
            {data.execSummaryIntro && (
              <div className={`text-[15px] leading-relaxed ${isBlue ? 'text-blue-50' : 'text-slate-700'}`}>
                {md.execSummaryIntro}
              </div>
            )}
          </>
        )}

        {/* Section 2, Por que o AFOS não suaviza */}
        {(data.antiAvg || data.antiAvgIntro) && (
          <>
            <SectionHeading num={2} title={data.sectionTitles?.[2] ?? t.section[2]} isBlue={isBlue} />
            {data.antiAvgIntro && (
              <div className={`text-[15px] leading-relaxed mb-3 ${isBlue ? 'text-blue-50' : 'text-slate-700'}`}>
                {md.antiAvgIntro}
              </div>
            )}
            {data.antiAvg && <AntiAvg block={data.antiAvg} isBlue={isBlue} footer={md.antiAvgFooter} rightDetails={md.antiAvgRightDetails} />}
            {data.antiAvgClosing && (
              <div className={`text-[15px] leading-relaxed ${isBlue ? 'text-blue-50' : 'text-slate-700'}`}>
                {md.antiAvgClosing}
              </div>
            )}
          </>
        )}

        {/* Track record callout, casos validados pelo resultado real */}
        {md.trackRecord && (
          <div className={`my-7 p-5 rounded-lg border-l-[4px] ${isBlue ? 'bg-blue-950/50 border-blue-300 text-blue-50' : 'bg-sky-50 border-sky-500 text-slate-700'}`}>
            <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isBlue ? 'text-white' : 'text-slate-900'}`}>🌐 {t.trackRecordLabel}</div>
            <div className="text-[15px] leading-relaxed">{md.trackRecord}</div>
          </div>
        )}

        {/* Section 3, Cenários ponderados */}
        {data.scenarios && data.scenarios.length > 0 && (
          <>
            <SectionHeading num={3} title={data.sectionTitles?.[3] ?? t.section[3]} isBlue={isBlue} />
            {data.scenariosIntro && (
              <div className={`text-[15px] leading-relaxed mb-3 ${isBlue ? 'text-blue-50' : 'text-slate-700'}`}>
                {md.scenariosIntro}
              </div>
            )}
            <Scenarios scenarios={data.scenarios} isBlue={isBlue} texts={md.scenarioTexts} />
          </>
        )}

        {/* Section 4, Indicator Grid */}
        {data.indicatorGrid && data.indicatorGrid.length > 0 && (
          <>
            <SectionHeading num={4} title={data.sectionTitles?.[4] ?? t.section[4]} isBlue={isBlue} />
            <IndicatorGrid rows={data.indicatorGrid} headers={t.indicatorHeaders} isBlue={isBlue} />
          </>
        )}

        {/* Section 5, Liquidez */}
        {data.liquidity && (
          <>
            <SectionHeading num={5} title={data.sectionTitles?.[5] ?? t.section[5]} isBlue={isBlue} />
            <Liquidity block={data.liquidity} totalSuffix={t.liquidityTotalSuffix} anomalyLabel={t.liquidityAnomalyLabel} isBlue={isBlue} anomaly={md.liquidityAnomaly} footer={md.liquidityFooter} />
          </>
        )}

        {/* Section 6, Calendário */}
        {data.calendar && data.calendar.length > 0 && (
          <>
            <SectionHeading num={6} title={data.sectionTitles?.[6] ?? t.section[6]} isBlue={isBlue} />
            <Calendar rows={data.calendar} headers={t.calendarHeaders} isBlue={isBlue} />
            {data.calendarFooter && (
              <div className={`text-xs ${isBlue ? 'text-blue-200' : 'text-slate-500'}`}>
                {md.calendarFooter}
              </div>
            )}
          </>
        )}

        {/* Section 7, Watch list */}
        {data.watchList && data.watchList.length > 0 && (
          <>
            <SectionHeading num={7} title={data.sectionTitles?.[7] ?? t.section[7]} isBlue={isBlue} />
            <WatchList items={data.watchList} isBlue={isBlue} />
          </>
        )}

        {/* Section 8, Metodologia */}
        {data.methodology && (
          <>
            <SectionHeading num={8} title={data.sectionTitles?.[8] ?? t.section[8]} isBlue={isBlue} />
            <div className={`text-[15px] leading-relaxed ${isBlue ? 'text-blue-50' : 'text-slate-700'}`}>
              {md.methodology}
            </div>
          </>
        )}

        {/* Section 9, Leitura adicional */}
        {data.additionalReading && (
          <>
            <SectionHeading num={9} title={data.sectionTitles?.[9] ?? t.section[9]} isBlue={isBlue} />
            <AdditionalReading block={data.additionalReading} paywallLabel={t.paywall} isBlue={isBlue} intro={md.additionalIntro} footer={md.additionalFooter} />
          </>
        )}

        {/* Fallback body (used by Fase 1 placeholder; will be empty once structured data is present) */}
        {(!data.summaryCards && data.body) && (
          <div className={`mt-6 prose prose-slate max-w-none ${isBlue ? 'prose-invert' : ''}`}>
            {md.body}
          </div>
        )}

        {/* Hard-coded disclaimer (NÃO-NEGOCIÁVEL) */}
        <div className={`mt-12 p-6 rounded-lg text-xs leading-relaxed ${isBlue ? 'bg-blue-950/60 border border-blue-400/30 text-blue-100' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
          <strong className={isBlue ? 'text-white' : 'text-slate-800'}>{t.disclaimerLabel}</strong> {t.disclaimerText} <strong className={isBlue ? 'text-white' : 'text-slate-800'}>{t.disclaimerNotRec}</strong> {t.disclaimerExtra}
        </div>

        {/* Signature */}
        <div className={`mt-7 pt-5 border-t flex items-center gap-4 ${isBlue ? 'border-blue-400/30' : 'border-slate-200'}`}>
          <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center font-extrabold text-white text-sm tracking-tight ${isBlue ? 'bg-white text-primary' : 'bg-primary'}`}>
            <span className={isBlue ? 'text-primary' : 'text-white'}>AFOS</span>
          </div>
          <div className="text-sm">
            <div className={`font-bold text-base ${isBlue ? 'text-white' : 'text-primary'}`}>{t.signatureName}</div>
            <div className={`text-xs italic ${isBlue ? 'text-blue-200' : 'text-slate-600'}`}>{t.signatureTitle}</div>
            <div className={`mt-1.5 text-xs ${isBlue ? 'text-blue-200' : 'text-slate-600'}`}>
              <a href="https://www.afos-analytics.com" className={isBlue ? 'text-blue-200 hover:text-white' : 'text-slate-600 hover:text-primary'}>www.afos-analytics.com</a>
              {' · '}
              <a href="mailto:contact@afos-analytics.com" className={isBlue ? 'text-blue-200 hover:text-white' : 'text-slate-600 hover:text-primary'}>contact@afos-analytics.com</a>
              {' · '}
              <a href="https://github.com/AFOS-Analytics" className={isBlue ? 'text-blue-200 hover:text-white' : 'text-slate-600 hover:text-primary'}>github.com/AFOS-Analytics</a>
            </div>
          </div>
        </div>

        <InlineSubscribe locale={locale} isBlue={isBlue} product="tradeoff" />

        {/* Edition navigation (archive link always present) */}
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Navegação de edição como botões (mesmo estilo do botão Dashboard do masthead) */}
          {nav?.previous ? (
            <a href={`/${locale}/tradeoff/${country}/${nav.previous}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>{t.navPrev}</a>
          ) : <span />}
          <a href={`/${locale}/tradeoff/${country}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>{t.navArchive}</a>
          {nav?.next ? (
            <a href={`/${locale}/tradeoff/${country}/${nav.next}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>{t.navNext}</a>
          ) : <span />}
        </nav>
      </article>
    </div>
  )
}
