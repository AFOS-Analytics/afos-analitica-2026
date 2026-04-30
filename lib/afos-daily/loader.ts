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

export function listDailies(): string[] {
  if (!existsSync(DAILY_DIR)) return []
  try {
    return readdirSync(DAILY_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .filter(isValidDate)
      .sort()
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
  // For non-default locales, try the locale-specific file first ({date}.{locale}.md),
  // falling back to the canonical PT-BR file ({date}.md) if the translation
  // is not available yet. Default locale (pt-BR) goes straight to the canonical file.
  const candidates: string[] = []
  if (locale && locale !== 'pt-BR' && isValidLocale(locale)) {
    candidates.push(join(DAILY_DIR, `${date}.${locale}.md`))
  }
  candidates.push(join(DAILY_DIR, `${date}.md`))
  const path = candidates.find(p => existsSync(p))
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

  const dateStr = coerceDate(fm.date, date)

  return {
    date: dateStr,
    updatedAt: str(fm.updatedAt),
    title: str(fm.title, `AFOS Daily — ${dateStr}`),
    locale: str(fm.locale, 'pt-BR'),
    status: str(fm.status, 'published'),
    lede: str(fm.lede),
    body: stripTemplateArtifacts(rawBody),
    sources: extractSources(rawBody),
  }
}
