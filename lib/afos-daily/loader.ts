import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import type { AfosDailyData } from '../../app/components/AfosDailyTemplate'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidDate(date: string): boolean {
  return DATE_RE.test(date)
}

export function listDailies(): string[] {
  if (!existsSync(DAILY_DIR)) return []
  return readdirSync(DAILY_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .filter(isValidDate)
    .sort()
}

export function getLatestDate(): string | null {
  const all = listDailies()
  return all.length ? all[all.length - 1] : null
}

export function loadDaily(date: string): AfosDailyData | null {
  if (!isValidDate(date)) return null
  const path = join(DAILY_DIR, `${date}.md`)
  if (!existsSync(path)) return null

  const raw = readFileSync(path, 'utf-8')
  const { data: fm, content: rawBody } = matter(raw)

  // Extract the sources list from the markdown footer before stripping it.
  // Pattern: "**Fontes citadas:** Source A, Source B, ..." (single line, may include period at end).
  const sourcesMatch = rawBody.match(/\*\*Fontes citadas:?\*\*\s*([^\n]+)/i)
  const sources = sourcesMatch ? sourcesMatch[1].trim().replace(/\.$/, '') : ''

  // Strip the footer (Fontes citadas / Método / Integração) — template renders it.
  // Markdown footer pattern: trailing horizontal rule + "**Fontes citadas:**" section.
  const body = rawBody
    .replace(/\n+---\n+\*\*Fontes citadas:?\*\*[\s\S]*$/i, '')
    // Also strip the leading H1 — template renders the date as the heading.
    .replace(/^# .+?\n+/, '')
    // Strip the "Polymarket × Pesquisas × Notícias" subline (template renders it).
    .replace(/^\*\*Polymarket × Pesquisas × Notícias\*\*[^\n]*\n+/m, '')
    // Strip the lede blockquote that duplicates the frontmatter lede.
    .replace(/^> [^\n]+(?:\n> [^\n]+)*\n+/m, '')
    .trim()

  // gray-matter parses unquoted YAML dates as Date objects — coerce back to YYYY-MM-DD
  let dateStr = date
  if (fm.date instanceof Date) {
    dateStr = fm.date.toISOString().slice(0, 10)
  } else if (typeof fm.date === 'string') {
    dateStr = fm.date
  }

  return {
    date: dateStr,
    updatedAt: typeof fm.updatedAt === 'string' ? fm.updatedAt : '',
    title: typeof fm.title === 'string' ? fm.title : `AFOS Daily — ${dateStr}`,
    locale: typeof fm.locale === 'string' ? fm.locale : 'pt-BR',
    status: typeof fm.status === 'string' ? fm.status : 'published',
    lede: typeof fm.lede === 'string' ? fm.lede : '',
    body,
    sources,
  }
}
