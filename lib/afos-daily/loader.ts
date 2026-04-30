import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import type { AfosDailyData } from '../../app/components/AfosDailyTemplate'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'es'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export function isValidLocale(loc: string): loc is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(loc)
}

export function isValidDate(date: string): boolean {
  if (!DATE_RE.test(date)) return false
  // Defensively validate that the date is a real calendar date
  // (the regex alone allows things like "2026-13-45" or "2026-02-30").
  const [y, m, d] = date.split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const probe = new Date(Date.UTC(y, m - 1, d))
  return (
    probe.getUTCFullYear() === y &&
    probe.getUTCMonth() === m - 1 &&
    probe.getUTCDate() === d
  )
}

// Memoize listDailies for 60s. The directory only changes when a new daily
// is committed (manual op). 60s TTL means worst case 60s of stale list,
// but eliminates readdirSync from the hot path of /api/afos-daily/latest.
const LIST_TTL_MS = 60 * 1000
let listCache: { list: string[]; expiresAt: number } | null = null

export function listDailies(): string[] {
  const now = Date.now()
  if (listCache && now < listCache.expiresAt) return listCache.list

  if (!existsSync(DAILY_DIR)) {
    listCache = { list: [], expiresAt: now + LIST_TTL_MS }
    return []
  }
  try {
    const list = readdirSync(DAILY_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .filter(isValidDate)
      .sort()
    listCache = { list, expiresAt: now + LIST_TTL_MS }
    return list
  } catch (err) {
    console.error('[afos-daily] Failed to list dailies:', err)
    return []
  }
}

export function getLatestDate(): string | null {
  const all = listDailies()
  return all.length ? all[all.length - 1] : null
}

/**
 * Returns the YYYY-MM-DD adjacent to the given date in the sorted list of
 * available dailies. Used for prev/next navigation on the synthesis page.
 */
export function getAdjacentDates(date: string): { previous?: string; next?: string } {
  const all = listDailies()
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

function coerceDate(value: unknown, fallback: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value
  return fallback
}

// Matches the "sources cited" line label in any supported locale.
const SOURCES_LABEL_RE = /\*\*(?:Fontes citadas|Sources cited|Fuentes citadas):?\*\*/i

// Extracts the comma-separated sources list from the sources-cited line.
function extractSources(rawBody: string): string {
  const m = rawBody.match(new RegExp(SOURCES_LABEL_RE.source + /\s*([^\n]+)/.source, 'i'))
  return m ? m[1].trim().replace(/\.$/, '') : ''
}

// Removes elements that the template renders separately (date heading, subline,
// lede blockquote, sources/method footer) so the body only contains article sections.
function stripTemplateArtifacts(rawBody: string): string {
  const sourcesFooter = new RegExp(`\\n+---\\n+${SOURCES_LABEL_RE.source}[\\s\\S]*$`, 'i')
  return rawBody
    .replace(sourcesFooter, '')
    .replace(/^# .+?\n+/, '')
    .replace(/^\*\*Polymarket × (?:Pesquisas|Polls|Encuestas) × (?:Notícias|News|Noticias)\*\*[^\n]*\n+/m, '')
    .replace(/^> [^\n]+(?:\n> [^\n]+)*\n+/m, '')
    .trim()
}

export function loadDaily(date: string, locale?: string): AfosDailyData | null {
  if (!isValidDate(date)) return null
  // Try {date}.{locale}.md first; fall back to canonical {date}.md (PT-BR).
  const canonical = join(DAILY_DIR, `${date}.md`)
  const localized = locale && locale !== 'pt-BR' && isValidLocale(locale)
    ? join(DAILY_DIR, `${date}.${locale}.md`)
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
    console.error(`[afos-daily] Failed to read or parse ${date}.md:`, err)
    return null
  }

  // Required fields must be present in the frontmatter so the page doesn't
  // render skeleton content. If any is missing, return null so the caller
  // (page or API) can decide how to handle (notFound, fallback, etc).
  const lede = str(fm.lede)
  if (!lede || !fm.date || !fm.title) {
    console.warn(`[afos-daily] ${path} missing required frontmatter (lede/date/title)`)
    return null
  }

  const dateStr = coerceDate(fm.date, date)

  return {
    date: dateStr,
    updatedAt: str(fm.updatedAt),
    title: str(fm.title, `AFOS Daily — ${dateStr}`),
    locale: str(fm.locale, 'pt-BR'),
    status: str(fm.status, 'published'),
    lede,
    body: stripTemplateArtifacts(rawBody),
    sources: extractSources(rawBody),
  }
}
