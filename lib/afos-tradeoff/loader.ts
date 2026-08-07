import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { lerStatusDoArquivo } from '../frontmatter/status'
import { str, num, coerceDate } from '../frontmatter/coerce'

const TRADEOFF_DIR = join(process.cwd(), 'public', 'afos-tradeoff')

/**
 * ── MULTIPAÍS (31/Jul/2026) ────────────────────────────────────────────────
 *
 * A ROTA é simétrica: `/[idioma]/tradeoff/[país]/[data]` para todos, decidido
 * em 27/Jul. O ARQUIVO não é, e isso é deliberado: o Brasil continua na raiz de
 * `public/afos-tradeoff/` e cada país novo ganha uma subpasta.
 *
 * ⚠️ POR QUE NÃO MOVI OS 30 ARQUIVOS DO BRASIL: eles são lidos e escritos por
 * `publish-afos-tradeoff.ts`, `persist-afos-tradeoff.ts` e
 * `broadcast-afos-tradeoff.ts`, que são do ciclo semanal e não deste trabalho.
 * Mover a pasta quebraria os três em silêncio, e o ganho seria só estético.
 * Simetria de rota é o que o leitor vê; simetria de pasta não é.
 *
 * `country` tem padrão 'br' em TODA função, então quem chamava antes continua
 * funcionando sem tocar em nada.
 */
export const PAIS_PADRAO = 'br'
export const PAISES_TRADEOFF = ['br', 'us'] as const
export type PaisTradeoff = (typeof PAISES_TRADEOFF)[number]

export function isValidCountry(c: string): c is PaisTradeoff {
  return (PAISES_TRADEOFF as readonly string[]).includes(c)
}

/** Brasil na raiz (histórico), os demais em subpasta com o código do país. */
function dirDoPais(country: string = PAIS_PADRAO): string {
  return country === PAIS_PADRAO ? TRADEOFF_DIR : join(TRADEOFF_DIR, country)
}
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'es'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export function isValidLocale(loc: string): loc is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(loc)
}

export function isValidDate(date: string): boolean {
  if (!DATE_RE.test(date)) return false
  const [y, m, d] = date.split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const probe = new Date(Date.UTC(y, m - 1, d))
  return (
    probe.getUTCFullYear() === y &&
    probe.getUTCMonth() === m - 1 &&
    probe.getUTCDate() === d
  )
}

// Structured visual blocks rendered by AfosTradeoffTemplate (mirror of the
// HTML preview's 9-section structure validated by Custódio+Cunha 23/Mai/2026).
// All blocks are optional — placeholder editions can have just sinalDaSemana
// and body, the template falls back gracefully.

export type DeltaDirection = 'up' | 'down' | 'flat'

export interface SummaryCard {
  label: string             // "Gap Lula × Flávio"
  headline: string          // "+11.95"
  unit?: string             // "pp" or "%"
  delta: string             // "↓1.25pp em 20h"
  deltaDirection: DeltaDirection
  desc: string              // "Polymarket começa a se aproximar..."
}

export interface AntiAvgBlock {
  title: string             // "Divergência da semana · Lula sobre Flávio"
  leftLabel: string         // "Se fosse média ponderada"
  leftValue: string         // "+7.5"
  leftUnit?: string         // "pp"
  leftDetails: string[]
  rightLabel: string        // "AFOS Tradeoff reporta"
  rightValue: string        // "+11.95pp · +3.0pp"
  rightDetails: string[]
  rightBadge: string        // "A divergência É o sinal"
  footer: string            // markdown OK
}

export type ScenarioType = 'base' | 'bear' | 'tail'

export interface Scenario {
  type: ScenarioType
  label: string             // "Cenário base · ~60% probabilidade"
  text: string              // markdown
}

export interface IndicatorRow {
  contract: string          // "Lula 1º turno (Poly)"
  contractLink?: string     // url
  value: string             // "43.50%"
  delta: string             // "↓1.00pp"
  deltaDirection: DeltaDirection
  volume: string            // "5.47M" or "—"
  reading: string           // "Primeira variação em 60h+"
  highlight?: boolean
}

export interface VolumeRow {
  rank: number              // 1, 2, 3...
  name: string              // "Tarcísio de Freitas"
  probability: string       // "0.35% prob."
  amount: string            // "USD 11.18M"
  barWidth: number          // 0-100 — percent fill of vol-bar
}

export interface LiquidityBlock {
  totalLabel: string        // "Mercado presidencial · vol. acumulado desde abertura"
  totalLink?: string
  total: string             // "USD 78.85M"
  rows: VolumeRow[]
  anomalyText?: string      // markdown — amber callout
  footer?: string           // markdown — paragraph after the block
}

export interface CalendarRow {
  date: string              // "Ter 19/Mai"
  print: string             // "AtlasIntel nacional"
  printLink?: string
  sample: string            // "n=5.000" or "—"
  reading: string           // "Primeiro print pós-áudio Vorcaro..."
  highlight?: boolean
}

export interface WatchItem {
  bold: string              // "AtlasIntel fecha ou amplia o gap?"
  text: string              // " Ponto-de-dado mais price-relevant..."
}

export interface AdditionalReadingItem {
  source: string            // "Bloomberg"
  description: string       // "cobertura Brasil/política"
  paywall?: boolean
  link: string              // "https://..."
}

export interface AdditionalReadingBlock {
  intro: string             // markdown OK
  items: AdditionalReadingItem[]
  footer?: string           // markdown — italic note
}

// Data model returned by loadTradeoff(). Distinct from AfosDailyData by:
// - issueNumber (1, 2, 3...) rendered as "Edição №N"
// - weekStart / weekEnd (YYYY-MM-DD) for the "Semana de DD-DD MMM" header
// - sinalDaSemana (equivalent of Daily's lede, but Tradeoff naming)
// - structured visual blocks (summaryCards, antiAvg, scenarios, etc) all optional
export interface AfosTradeoffData {
  date: string          // YYYY-MM-DD — publish date (typically Monday)
  issueNumber: number   // 1, 2, 3... — renders as "Edição №N"
  weekStart: string     // YYYY-MM-DD — first day of the week covered
  weekEnd: string       // YYYY-MM-DD — last day of the week covered
  updatedAt: string     // "DD/MM/YYYY, HH:MM"
  title: string         // "AFOS Tradeoff — Edição №N · semana de DD-DD MMM YYYY"
  locale: string        // "pt-BR" | "en" | "es"
  status: string        // "published" | "draft"
  sinalDaSemana: string // Tradeoff equivalent of Daily's lede (1-2 paragraphs)
  /**
   * Título de seção sobrescrito pela edição, por número (ex.: { 2: '...' }).
   *
   * ⚠️ EXISTE POR NECESSIDADE DE MÉTODO, não de estilo. Os títulos são fixos no
   * template e nasceram do Brasil: a seção 2 se chama "Por que o AFOS não
   * suaviza" e a 6, "Calendário de prints price-relevant". Na edição dos EUA o
   * conteúdo dessas duas muda (duas grandezas que não se subtraem, e calendário
   * eleitoral em vez de prints registrados), então manter o rótulo faria o
   * título contradizer o texto logo abaixo. Sem sobrescrita, o padrão continua.
   */
  sectionTitles?: Record<string, string>
  // Section 1 — Executive Summary
  summaryCards?: SummaryCard[]
  execSummaryIntro?: string         // free paragraph after the cards
  // Section 2 — Por que o AFOS não suaviza
  antiAvgIntro?: string
  antiAvg?: AntiAvgBlock
  antiAvgClosing?: string
  // Section 3 — Cenários ponderados
  scenariosIntro?: string
  scenarios?: Scenario[]
  // Section 4 — Indicator Grid
  indicatorGrid?: IndicatorRow[]
  // Section 5 — Liquidez e estrutura de mercado
  liquidity?: LiquidityBlock
  // Section 6 — Calendário de prints
  calendar?: CalendarRow[]
  calendarFooter?: string           // "Fonte: registro TSE..."
  // Section 7 — Watch list
  watchList?: WatchItem[]
  // Track record callout — casos validados pelo resultado real (global hub)
  trackRecord?: string
  // Section 8 — Metodologia (free markdown, multi-paragraph)
  methodology?: string
  // Section 9 — Leitura adicional
  additionalReading?: AdditionalReadingBlock
  // Legacy fields for backward compat with placeholder/Fase 1
  body: string          // markdown body — used as fallback when structured blocks absent
  sources: string       // comma-separated source list extracted from markdown footer
}

// Cache parity with Daily loader for performance consistency
const LIST_TTL_MS = 60 * 1000
const LIST_TTL_EMPTY_MS = 5 * 1000
const listCache = new Map<string, { list: string[]; expiresAt: number }>()

export function listTradeoffs(country: string = PAIS_PADRAO): string[] {
  const now = Date.now()
  const cached = listCache.get(country)
  if (cached && now < cached.expiresAt) return cached.list

  const dir = dirDoPais(country)
  if (!existsSync(dir)) {
    listCache.set(country, { list: [], expiresAt: now + LIST_TTL_EMPTY_MS })
    return []
  }
  try {
    const list = readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .filter(isValidDate)
      .sort()
    const ttl = list.length > 0 ? LIST_TTL_MS : LIST_TTL_EMPTY_MS
    listCache.set(country, { list, expiresAt: now + ttl })
    return list
  } catch (err) {
    console.error('[afos-tradeoff] Failed to list editions:', err)
    return []
  }
}


/** Leitura compartilhada em lib/frontmatter/status desde 06/Ago/2026. */
function readStatusFast(date: string, country: string = PAIS_PADRAO): string {
  return lerStatusDoArquivo(join(dirDoPais(country), `${date}.md`))
}

export function listPublishedTradeoffs(country: string = PAIS_PADRAO): string[] {
  return listTradeoffs(country).filter(d => readStatusFast(d, country) === 'published')
}

export function isVisibleInProduction(date: string, country: string = PAIS_PADRAO): boolean {
  return readStatusFast(date, country) === 'published'
}

export function tradeoffExists(date: string, locale: string, country: string = PAIS_PADRAO): boolean {
  const filename = locale === 'pt-BR' ? `${date}.md` : `${date}.${locale}.md`
  return existsSync(join(dirDoPais(country), filename))
}

export function getLatestDate(country: string = PAIS_PADRAO): string | null {
  const all = listPublishedTradeoffs(country)
  return all.length ? all[all.length - 1] : null
}

export function getAdjacentDates(date: string, country: string = PAIS_PADRAO): { previous?: string; next?: string } {
  const published = listPublishedTradeoffs(country)
  const all = published.includes(date) ? published : [...published, date].sort()
  const idx = all.indexOf(date)
  if (idx === -1) return {}
  return {
    previous: idx > 0 ? all[idx - 1] : undefined,
    next: idx < all.length - 1 ? all[idx + 1] : undefined,
  }
}




const SOURCES_LABEL_RE = /\*\*(?:Fontes citadas|Sources cited|Fuentes citadas):?\*\*/i

function extractSources(rawBody: string): string {
  const m = rawBody.match(new RegExp(SOURCES_LABEL_RE.source + /\s*([^\n]+)/.source, 'i'))
  return m ? m[1].trim().replace(/\.$/, '') : ''
}

// Removes elements that the template renders separately so the body only
// contains article sections (matches Daily loader behavior)
const HR_PATTERN = `(?:---|\\*\\*\\*|___|—)`
function stripTemplateArtifacts(rawBody: string): string {
  const sourcesFooter = new RegExp(`\\n+${HR_PATTERN}\\n+${SOURCES_LABEL_RE.source}[\\s\\S]*$`, 'i')
  return rawBody
    .replace(sourcesFooter, '')
    .replace(/^# .+?\n+/, '')
    .trim()
}

// Safely coerce each structured block from YAML — every field is optional and
// each coerce returns undefined when malformed, so the template renders fewer
// sections rather than crashing on bad data.

function isDeltaDirection(v: unknown): v is DeltaDirection {
  return v === 'up' || v === 'down' || v === 'flat'
}

function isScenarioType(v: unknown): v is ScenarioType {
  return v === 'base' || v === 'bear' || v === 'tail'
}

function asArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : undefined
}

function coerceSummaryCards(raw: unknown): SummaryCard[] | undefined {
  const arr = asArray<Record<string, unknown>>(raw)
  if (!arr) return undefined
  return arr.map(r => ({
    label: str(r.label),
    headline: str(r.headline),
    unit: str(r.unit) || undefined,
    delta: str(r.delta),
    deltaDirection: isDeltaDirection(r.deltaDirection) ? r.deltaDirection : 'flat',
    desc: str(r.desc),
  })).filter(c => c.label && c.headline)
}

function coerceAntiAvg(raw: unknown): AntiAvgBlock | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  if (!r.title || !r.leftValue || !r.rightValue) return undefined
  return {
    title: str(r.title),
    leftLabel: str(r.leftLabel),
    leftValue: str(r.leftValue),
    leftUnit: str(r.leftUnit) || undefined,
    leftDetails: Array.isArray(r.leftDetails) ? r.leftDetails.filter((d): d is string => typeof d === 'string') : [],
    rightLabel: str(r.rightLabel),
    rightValue: str(r.rightValue),
    rightDetails: Array.isArray(r.rightDetails) ? r.rightDetails.filter((d): d is string => typeof d === 'string') : [],
    rightBadge: str(r.rightBadge),
    footer: str(r.footer),
  }
}

function coerceScenarios(raw: unknown): Scenario[] | undefined {
  const arr = asArray<Record<string, unknown>>(raw)
  if (!arr) return undefined
  return arr.map(r => ({
    type: isScenarioType(r.type) ? r.type : 'base',
    label: str(r.label),
    text: str(r.text),
  })).filter(s => s.label && s.text)
}

function coerceIndicatorGrid(raw: unknown): IndicatorRow[] | undefined {
  const arr = asArray<Record<string, unknown>>(raw)
  if (!arr) return undefined
  return arr.map(r => ({
    contract: str(r.contract),
    contractLink: str(r.contractLink) || undefined,
    value: str(r.value),
    delta: str(r.delta),
    deltaDirection: isDeltaDirection(r.deltaDirection) ? r.deltaDirection : 'flat',
    volume: str(r.volume, '—'),
    reading: str(r.reading),
    highlight: Boolean(r.highlight),
  })).filter(i => i.contract)
}

function coerceLiquidity(raw: unknown): LiquidityBlock | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  if (!r.total || !Array.isArray(r.rows)) return undefined
  const rows: VolumeRow[] = (r.rows as unknown[]).map(row => {
    const rr = row as Record<string, unknown>
    return {
      rank: typeof rr.rank === 'number' ? rr.rank : 0,
      name: str(rr.name),
      probability: str(rr.probability),
      amount: str(rr.amount),
      barWidth: typeof rr.barWidth === 'number' ? Math.max(0, Math.min(100, rr.barWidth)) : 0,
    }
  }).filter(v => v.name)
  if (rows.length === 0) return undefined
  return {
    totalLabel: str(r.totalLabel),
    totalLink: str(r.totalLink) || undefined,
    total: str(r.total),
    rows,
    anomalyText: str(r.anomalyText) || undefined,
    footer: str(r.footer) || undefined,
  }
}

function coerceCalendar(raw: unknown): CalendarRow[] | undefined {
  const arr = asArray<Record<string, unknown>>(raw)
  if (!arr) return undefined
  return arr.map(r => ({
    date: str(r.date),
    print: str(r.print),
    printLink: str(r.printLink) || undefined,
    sample: str(r.sample, '—'),
    reading: str(r.reading),
    highlight: Boolean(r.highlight),
  })).filter(c => c.date && c.print)
}

function coerceWatchList(raw: unknown): WatchItem[] | undefined {
  const arr = asArray<Record<string, unknown>>(raw)
  if (!arr) return undefined
  return arr.map(r => ({
    bold: str(r.bold),
    text: str(r.text),
  })).filter(w => w.bold)
}

function coerceAdditionalReading(raw: unknown): AdditionalReadingBlock | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  const items = Array.isArray(r.items)
    ? (r.items as unknown[]).map(it => {
        const ii = it as Record<string, unknown>
        return {
          source: str(ii.source),
          description: str(ii.description),
          paywall: Boolean(ii.paywall),
          link: str(ii.link),
        }
      }).filter(it => it.source && it.link)
    : []
  if (items.length === 0) return undefined
  return {
    intro: str(r.intro),
    items,
    footer: str(r.footer) || undefined,
  }
}

export function loadTradeoff(date: string, locale?: string, country: string = PAIS_PADRAO): AfosTradeoffData | null {
  if (!isValidDate(date)) return null
  const canonical = join(dirDoPais(country), `${date}.md`)
  const localized = locale && locale !== 'pt-BR' && isValidLocale(locale)
    ? join(dirDoPais(country), `${date}.${locale}.md`)
    : null
  const path = localized && existsSync(localized) ? localized : existsSync(canonical) ? canonical : null
  if (!path) return null

  let fm: Record<string, unknown>
  let rawBody: string
  try {
    const parsed = matter(readFileSync(path, 'utf-8'))
    fm = parsed.data as Record<string, unknown>
    rawBody = parsed.content
  } catch (err) {
    console.error(`[afos-tradeoff] Failed to read or parse ${date}.md:`, err)
    return null
  }

  const sinalDaSemana = str(fm.sinalDaSemana)
  if (!sinalDaSemana || !fm.date || !fm.title || !fm.issueNumber) {
    console.warn(`[afos-tradeoff] ${path} missing required frontmatter (sinalDaSemana/date/title/issueNumber)`)
    return null
  }

  const dateStr = coerceDate(fm.date, date)

  return {
    date: dateStr,
    issueNumber: num(fm.issueNumber, 1),
    weekStart: coerceDate(fm.weekStart, dateStr),
    weekEnd: coerceDate(fm.weekEnd, dateStr),
    updatedAt: str(fm.updatedAt),
    title: str(fm.title, `AFOS Tradeoff — Edição №${num(fm.issueNumber, 1)}`),
    locale: str(fm.locale, 'pt-BR'),
    status: str(fm.status, 'draft'),
    sinalDaSemana,
    summaryCards: coerceSummaryCards(fm.summaryCards),
    execSummaryIntro: str(fm.execSummaryIntro) || undefined,
    antiAvgIntro: str(fm.antiAvgIntro) || undefined,
    antiAvg: coerceAntiAvg(fm.antiAvg),
    antiAvgClosing: str(fm.antiAvgClosing) || undefined,
    scenariosIntro: str(fm.scenariosIntro) || undefined,
    scenarios: coerceScenarios(fm.scenarios),
    indicatorGrid: coerceIndicatorGrid(fm.indicatorGrid),
    sectionTitles: (fm.sectionTitles && typeof fm.sectionTitles === 'object')
      ? Object.fromEntries(Object.entries(fm.sectionTitles as Record<string, unknown>).map(([k, v]) => [k, String(v)]))
      : undefined,
    liquidity: coerceLiquidity(fm.liquidity),
    calendar: coerceCalendar(fm.calendar),
    calendarFooter: str(fm.calendarFooter) || undefined,
    watchList: coerceWatchList(fm.watchList),
    trackRecord: str(fm.trackRecord) || undefined,
    methodology: str(fm.methodology) || undefined,
    additionalReading: coerceAdditionalReading(fm.additionalReading),
    body: stripTemplateArtifacts(rawBody),
    sources: extractSources(rawBody),
  }
}
