/**
 * Shared utilities for AFOS Daily scripts.
 * Used by: check-recurrence, reconcile-claims, wayback-archive.
 */
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')
export const CANONICAL_RE = /^\d{4}-\d{2}-\d{2}\.md$/

/** YYYY-MM-DD ISO date (used as CLI arg validator). */
export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

/** Reads canonical PT-BR markdown for a date. Returns null if missing. */
export function readDailyMarkdown(date: string): string | null {
  const path = join(DAILY_DIR, `${date}.md`)
  return existsSync(path) ? readFileSync(path, 'utf-8') : null
}

/** Lists last N canonical (PT-BR) daily filenames, sorted ascending. */
export function listRecentCanonicalDailies(window: number): string[] {
  if (!existsSync(DAILY_DIR)) return []
  return readdirSync(DAILY_DIR)
    .filter((f) => CANONICAL_RE.test(f))
    .sort()
    .slice(-window)
}

/** Extracts external URLs from markdown link syntax. Skips internal afos-analytics links. */
export function extractExternalUrls(markdown: string): string[] {
  const re = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g
  const urls = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(markdown)) !== null) {
    const url = m[1]
    if (url.includes('afos-analytics.com')) continue
    urls.add(url)
  }
  return Array.from(urls)
}
