import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const TRADEOFF_DIR = join(process.cwd(), 'public', 'afos-tradeoff')
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
let listCache: { list: string[]; expiresAt: number } | null = null

export function listTradeoffs(): string[] {
  const now = Date.now()
  if (listCache && now < listCache.expiresAt) return listCache.list

  if (!existsSync(TRADEOFF_DIR)) {
    listCache = { list: [], expiresAt: now + LIST_TTL_EMPTY_MS }
    return []
  }
  try {
    const list = readdirSync(TRADEOFF_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .filter(isValidDate)
      .sort()
    const ttl = list.length > 0 ? LIST_TTL_MS : LIST_TTL_EMPTY_MS
    listCache = { list, expiresAt: now + ttl }
    return list
  } catch (err) {
    console.error('[afos-tradeoff] Failed to list editions:', err)
    return []
  }
}

const STATUS_RE = /^status:\s*([a-z]+)\s*$/im
const VALID_STATUSES = new Set(['published', 'draft', 'archived'])
const statusCache = new Map<string, { mtime: number; status: string }>()

function readStatusFast(date: string): string {
  const path = join(TRADEOFF_DIR, `${date}.md`)
  if (!existsSync(path)) return 'draft'
  let mtime = 0
  try {
    mtime = statSync(path).mtimeMs
  } catch {
    return 'draft'
  }
  const cached = statusCache.get(date)
  if (cached && cached.mtime === mtime) return cached.status
  try {
    const head = readFileSync(path, 'utf-8').slice(0, 500)
    const m = head.match(STATUS_RE)
    if (!m) {
      statusCache.set(date, { mtime, status: 'draft' })
      return 'draft'
    }
    const status = m[1].toLowerCase()
    const final = VALID_STATUSES.has(status) ? status : 'draft'
    statusCache.set(date, { mtime, status: final })
    return final
  } catch {
    return 'draft'
  }
}

export function listPublishedTradeoffs(): string[] {
  return listTradeoffs().filter(d => readStatusFast(d) === 'published')
}

export function isVisibleInProduction(date: string): boolean {
  return readStatusFast(date) === 'published'
}

export function tradeoffExists(date: string, locale: string): boolean {
  const filename = locale === 'pt-BR' ? `${date}.md` : `${date}.${locale}.md`
  return existsSync(join(TRADEOFF_DIR, filename))
}

export function getLatestDate(): string | null {
  const all = listPublishedTradeoffs()
  return all.length ? all[all.length - 1] : null
}

export function getAdjacentDates(date: string): { previous?: string; next?: string } {
  const published = listPublishedTradeoffs()
  const all = published.includes(date) ? published : [...published, date].sort()
  const idx = all.indexOf(date)
  if (idx === -1) return {}
  return {
    previous: idx > 0 ? all[idx - 1] : undefined,
    next: idx < all.length - 1 ? all[idx + 1] : undefined,
  }
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function coerceDate(value: unknown, fallback: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value
  return fallback
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

export function loadTradeoff(date: string, locale?: string): AfosTradeoffData | null {
  if (!isValidDate(date)) return null
  const canonical = join(TRADEOFF_DIR, `${date}.md`)
  const localized = locale && locale !== 'pt-BR' && isValidLocale(locale)
    ? join(TRADEOFF_DIR, `${date}.${locale}.md`)
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
    liquidity: coerceLiquidity(fm.liquidity),
    calendar: coerceCalendar(fm.calendar),
    calendarFooter: str(fm.calendarFooter) || undefined,
    watchList: coerceWatchList(fm.watchList),
    methodology: str(fm.methodology) || undefined,
    additionalReading: coerceAdditionalReading(fm.additionalReading),
    body: stripTemplateArtifacts(rawBody),
    sources: extractSources(rawBody),
  }
}
