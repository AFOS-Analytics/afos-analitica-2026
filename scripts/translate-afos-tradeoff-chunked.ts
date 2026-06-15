/**
 * translate-afos-tradeoff-chunked.ts — translates a Tradeoff edition PT→EN/ES.
 *
 * Usage:
 *   npx tsx scripts/translate-afos-tradeoff-chunked.ts 2026-05-25 en
 *   npx tsx scripts/translate-afos-tradeoff-chunked.ts 2026-05-25 es
 *
 * Tradeoff editions are rich-frontmatter: ~25 translatable text fields scattered
 * across 9 structured YAML blocks (summaryCards, antiAvg, scenarios, indicatorGrid,
 * liquidity, calendar, watchList, methodology, additionalReading). This walker
 * translates each text field individually using lib/ai/translate while preserving
 * structure, numbers, percentages, URLs, candidate names, institute names,
 * deltas (↓1.25pp), volumes (USD 11.18M), and sample sizes (n=5.000).
 *
 * Date abbreviations (Ter 19/Mai → Tue May 19 / Mar 19 May) handled by a local
 * map, NOT sent to the translator — fewer chars + zero risk of corruption.
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { translate } from '../lib/ai/translate'
import { loadGlossary } from '../lib/glossary/loader'
import { MONTHS } from '../lib/i18n/months'

const TRADEOFF_DIR = join(process.cwd(), 'public', 'afos-tradeoff')

type TargetLocale = 'en' | 'es'

const TARGET_LOCALE_NAMES: Record<TargetLocale, string> = { en: 'English', es: 'Spanish' }

// Day-of-week abbreviations (3 chars), used inside calendar[].date strings like "Ter 19/Mai"
const DOW_MAP: Record<string, { en: string; es: string }> = {
  Seg: { en: 'Mon', es: 'Lun' },
  Ter: { en: 'Tue', es: 'Mar' },
  Qua: { en: 'Wed', es: 'Mié' },
  Qui: { en: 'Thu', es: 'Jue' },
  Sex: { en: 'Fri', es: 'Vie' },
  Sáb: { en: 'Sat', es: 'Sáb' },
  Sab: { en: 'Sat', es: 'Sáb' },
  Dom: { en: 'Sun', es: 'Dom' },
}

// Month abbreviations (3 chars), used inside calendar dates and titles ("Mai" → "May" / "May")
const MONTH_ABBR_MAP: Record<string, { en: string; es: string }> = {
  Jan: { en: 'Jan', es: 'Ene' },
  Fev: { en: 'Feb', es: 'Feb' },
  Mar: { en: 'Mar', es: 'Mar' },
  Abr: { en: 'Apr', es: 'Abr' },
  Mai: { en: 'May', es: 'May' },
  Jun: { en: 'Jun', es: 'Jun' },
  Jul: { en: 'Jul', es: 'Jul' },
  Ago: { en: 'Aug', es: 'Ago' },
  Set: { en: 'Sep', es: 'Sep' },
  Out: { en: 'Oct', es: 'Oct' },
  Nov: { en: 'Nov', es: 'Nov' },
  Dez: { en: 'Dec', es: 'Dic' },
}

// "Ao longo" / "varia" etc — phrases that show up in calendar fields and aren't
// dates but free text. Mapped here to avoid spending API calls on 8-char strings.
const SHORT_PHRASE_MAP: Record<string, { en: string; es: string }> = {
  'Ao longo': { en: 'Throughout', es: 'A lo largo' },
  'varia': { en: 'varies', es: 'varía' },
  '—': { en: '—', es: '—' },
}

function localizeShortString(s: string, locale: TargetLocale): string {
  if (SHORT_PHRASE_MAP[s]) return SHORT_PHRASE_MAP[s][locale]
  // Pattern "DOW DD/MMM" — e.g. "Ter 19/Mai"
  const m = s.match(/^([A-Za-zÁ-ú]{3})\s+(\d{1,2})\/([A-Za-z]{3})$/)
  if (m) {
    const dow = DOW_MAP[m[1]]
    const mon = MONTH_ABBR_MAP[m[3]]
    if (dow && mon) {
      return locale === 'en'
        ? `${dow.en} ${mon.en} ${m[2]}`
        : `${dow.es} ${m[2]}/${mon.es}`
    }
  }
  return s
}

// Replaces inline "Mai" tokens (e.g. inside week-range "19-23 Mai 2026" or
// dates inside prose "16/Mai", "18/Mai noite") — operates on translated text
// because we strip Portuguese dates BEFORE sending to the translator would
// risk losing context, and AFTER preserves the translator's prose around it.
function localizeMonthAbbrInline(text: string, locale: TargetLocale): string {
  for (const [pt, target] of Object.entries(MONTH_ABBR_MAP)) {
    // Match standalone abbr OR "DD/Abbr" / "DD–DD Abbr" / "Abbr YYYY"
    text = text.replace(new RegExp(`\\b${pt}\\b`, 'g'), target[locale])
  }
  return text
}

function buildTitle(date: string, issueNumber: number, weekStart: string, weekEnd: string, locale: TargetLocale): string {
  const [, , dStart] = weekStart.split('-').map(Number)
  const [yEnd, mEnd, dEnd] = weekEnd.split('-').map(Number)
  if (locale === 'en') {
    return `AFOS Tradeoff — Issue #${issueNumber} · Week of ${MONTHS.en[mEnd - 1]} ${dStart}-${dEnd}, ${yEnd}`
  }
  return `AFOS Tradeoff — Edición №${issueNumber} · Semana del ${dStart}-${dEnd} de ${MONTHS.es[mEnd - 1]} de ${yEnd}`
}

interface TranslateContext {
  locale: TargetLocale
  glossary: Array<{ term: string; id: string }>
}

// Throttle: Anthropic Tier 1 has ~50 RPM and ~10k output TPM. With 30+ calls
// and ~500 output tokens each, back-to-back calls trip the limit. 1.5s sleep
// = 40 calls/min max, well under any rate limit. Adds ~45s total to a full
// edition translation — acceptable cost for reliability.
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
const RATE_LIMIT_SLEEP_MS = 3000

async function callTranslateWithRetry(text: string, ctx: TranslateContext, attempt = 0): Promise<{ translatedText: string }> {
  try {
    return await translate({
      sourceText: text,
      sourceLocale: 'pt-BR',
      targetLocale: ctx.locale,
      type: 'afos-daily',
      glossaryEntries: ctx.glossary,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    // Retry on rate_limited up to 3 times with exponential backoff (30s, 60s, 90s).
    // Avoids losing 30+ already-translated calls when a single burst trips the TPM cap.
    if (msg.includes('rate_limited') && attempt < 3) {
      const backoff = 30000 * (attempt + 1)
      console.log(`   ⏳ rate_limited — backoff ${backoff / 1000}s (attempt ${attempt + 1}/3)`)
      await sleep(backoff)
      return callTranslateWithRetry(text, ctx, attempt + 1)
    }
    throw err
  }
}

async function tx(text: string | undefined, ctx: TranslateContext): Promise<string> {
  if (!text || !text.trim()) return text ?? ''
  // Tiny phrases bypass the API
  if (text.length <= 20 && SHORT_PHRASE_MAP[text.trim()]) {
    return SHORT_PHRASE_MAP[text.trim()][ctx.locale]
  }
  await sleep(RATE_LIMIT_SLEEP_MS)
  const r = await callTranslateWithRetry(text, ctx)
  // Strip glossary auto-tags that sometimes appear inside markdown links
  // (known translator bug, documented in feedback_translator_known_bugs.md).
  let out = r.translatedText
    .replace(/<term id="[^"]+">([^<]+)<\/term>/g, '$1')
    .trim()
  out = localizeMonthAbbrInline(out, ctx.locale)
  return out
}

async function txArray(arr: string[] | undefined, ctx: TranslateContext): Promise<string[]> {
  if (!arr || arr.length === 0) return []
  const out: string[] = []
  for (const item of arr) out.push(await tx(item, ctx))
  return out
}

async function main() {
  const date = process.argv[2]
  const locale = process.argv[3] as TargetLocale
  if (!date || !['en', 'es'].includes(locale)) {
    console.error('Usage: translate-afos-tradeoff-chunked.ts <YYYY-MM-DD> <en|es>')
    process.exit(1)
  }

  const path = join(TRADEOFF_DIR, `${date}.md`)
  const raw = readFileSync(path, 'utf-8')
  const { data: fm, content: body } = matter(raw)

  const glossaryEntries = loadGlossary().map(e => ({ term: e.term, id: e.id }))
  const ctx: TranslateContext = { locale, glossary: glossaryEntries }

  console.log(`📖 ${date} → ${TARGET_LOCALE_NAMES[locale]}`)
  console.log(`   issueNumber=${fm.issueNumber} week=${fm.weekStart}…${fm.weekEnd}`)

  // ─── Top-level prose ──────────────────────────────────────────────
  console.log('   [1] sinalDaSemana')
  const sinalDaSemana = await tx(String(fm.sinalDaSemana ?? ''), ctx)

  console.log('   [2] execSummaryIntro')
  const execSummaryIntro = await tx(typeof fm.execSummaryIntro === 'string' ? fm.execSummaryIntro : undefined, ctx)

  console.log('   [3] antiAvgIntro')
  const antiAvgIntro = await tx(typeof fm.antiAvgIntro === 'string' ? fm.antiAvgIntro : undefined, ctx)

  console.log('   [4] antiAvgClosing')
  const antiAvgClosing = await tx(typeof fm.antiAvgClosing === 'string' ? fm.antiAvgClosing : undefined, ctx)

  console.log('   [5] scenariosIntro')
  const scenariosIntro = await tx(typeof fm.scenariosIntro === 'string' ? fm.scenariosIntro : undefined, ctx)

  console.log('   [6] calendarFooter')
  const calendarFooter = await tx(typeof fm.calendarFooter === 'string' ? fm.calendarFooter : undefined, ctx)

  console.log('   [7] methodology')
  const methodology = await tx(typeof fm.methodology === 'string' ? fm.methodology : undefined, ctx)
  const trackRecord = await tx(typeof fm.trackRecord === 'string' ? fm.trackRecord : undefined, ctx)

  // ─── summaryCards ─────────────────────────────────────────────────
  const summaryCards = Array.isArray(fm.summaryCards)
    ? await Promise.all(fm.summaryCards.map(async (c: Record<string, unknown>, i: number) => {
        console.log(`   [8.${i + 1}] summaryCard.label/delta/desc`)
        return {
          ...c,
          label: await tx(String(c.label ?? ''), ctx),
          delta: await tx(String(c.delta ?? ''), ctx),
          desc: await tx(String(c.desc ?? ''), ctx),
        }
      }))
    : undefined

  // ─── antiAvg ──────────────────────────────────────────────────────
  let antiAvg: Record<string, unknown> | undefined
  if (fm.antiAvg && typeof fm.antiAvg === 'object') {
    const a = fm.antiAvg as Record<string, unknown>
    console.log('   [9] antiAvg (title/labels/details/footer)')
    antiAvg = {
      ...a,
      title: await tx(String(a.title ?? ''), ctx),
      leftLabel: await tx(String(a.leftLabel ?? ''), ctx),
      leftDetails: await txArray(Array.isArray(a.leftDetails) ? a.leftDetails as string[] : [], ctx),
      rightLabel: await tx(String(a.rightLabel ?? ''), ctx),
      rightDetails: await txArray(Array.isArray(a.rightDetails) ? a.rightDetails as string[] : [], ctx),
      rightBadge: await tx(String(a.rightBadge ?? ''), ctx),
      footer: await tx(String(a.footer ?? ''), ctx),
    }
  }

  // ─── scenarios ────────────────────────────────────────────────────
  const scenarios = Array.isArray(fm.scenarios)
    ? await Promise.all(fm.scenarios.map(async (s: Record<string, unknown>, i: number) => {
        console.log(`   [10.${i + 1}] scenario.label/text`)
        return {
          ...s,
          label: await tx(String(s.label ?? ''), ctx),
          text: await tx(String(s.text ?? ''), ctx),
        }
      }))
    : undefined

  // ─── indicatorGrid ────────────────────────────────────────────────
  const indicatorGrid = Array.isArray(fm.indicatorGrid)
    ? await Promise.all(fm.indicatorGrid.map(async (r: Record<string, unknown>, i: number) => {
        console.log(`   [11.${i + 1}] indicator.contract/reading`)
        return {
          ...r,
          contract: await tx(String(r.contract ?? ''), ctx),
          reading: await tx(String(r.reading ?? ''), ctx),
        }
      }))
    : undefined

  // ─── liquidity ────────────────────────────────────────────────────
  let liquidity: Record<string, unknown> | undefined
  if (fm.liquidity && typeof fm.liquidity === 'object') {
    const l = fm.liquidity as Record<string, unknown>
    console.log('   [12] liquidity (totalLabel/anomalyText/footer + rows.probability)')
    const rows = Array.isArray(l.rows)
      ? await Promise.all((l.rows as Record<string, unknown>[]).map(async row => ({
          ...row,
          // probability: "0.35% prob." → "0.35% prob." in EN, "0.35% prob." stays
          // (the word "prob." is universal abbreviation, but Portuguese might
          // become "probabilidade" if translator gets clever — translate to be safe)
          probability: await tx(String(row.probability ?? ''), ctx),
        })))
      : []
    liquidity = {
      ...l,
      totalLabel: await tx(String(l.totalLabel ?? ''), ctx),
      rows,
      anomalyText: l.anomalyText ? await tx(String(l.anomalyText), ctx) : undefined,
      footer: l.footer ? await tx(String(l.footer), ctx) : undefined,
    }
  }

  // ─── calendar ─────────────────────────────────────────────────────
  const calendar = Array.isArray(fm.calendar)
    ? await Promise.all(fm.calendar.map(async (c: Record<string, unknown>, i: number) => {
        console.log(`   [13.${i + 1}] calendar.date/print/sample/reading`)
        return {
          ...c,
          date: localizeShortString(String(c.date ?? ''), locale),
          print: await tx(String(c.print ?? ''), ctx),
          sample: localizeShortString(String(c.sample ?? ''), locale),
          reading: await tx(String(c.reading ?? ''), ctx),
        }
      }))
    : undefined

  // ─── watchList ────────────────────────────────────────────────────
  const watchList = Array.isArray(fm.watchList)
    ? await Promise.all(fm.watchList.map(async (w: Record<string, unknown>, i: number) => {
        console.log(`   [14.${i + 1}] watchList.bold/text`)
        return {
          ...w,
          bold: await tx(String(w.bold ?? ''), ctx),
          text: await tx(String(w.text ?? ''), ctx),
        }
      }))
    : undefined

  // ─── additionalReading ────────────────────────────────────────────
  let additionalReading: Record<string, unknown> | undefined
  if (fm.additionalReading && typeof fm.additionalReading === 'object') {
    const ar = fm.additionalReading as Record<string, unknown>
    console.log('   [15] additionalReading (intro/items.description/footer)')
    const items = Array.isArray(ar.items)
      ? await Promise.all((ar.items as Record<string, unknown>[]).map(async item => ({
          ...item,
          description: await tx(String(item.description ?? ''), ctx),
        })))
      : []
    additionalReading = {
      ...ar,
      intro: await tx(String(ar.intro ?? ''), ctx),
      items,
      footer: ar.footer ? await tx(String(ar.footer), ctx) : undefined,
    }
  }

  // ─── body (markdown fallback) ─────────────────────────────────────
  let translatedBody = ''
  if (body && body.trim().length > 0) {
    console.log(`   [16] body (${body.length} chars)`)
    translatedBody = await tx(body, ctx)
  }

  // ─── Reconstruct frontmatter ──────────────────────────────────────
  const dateStr = fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date)
  const issueNumber = typeof fm.issueNumber === 'number' ? fm.issueNumber : 1
  const weekStart = fm.weekStart instanceof Date ? fm.weekStart.toISOString().slice(0, 10) : String(fm.weekStart ?? dateStr)
  const weekEnd = fm.weekEnd instanceof Date ? fm.weekEnd.toISOString().slice(0, 10) : String(fm.weekEnd ?? dateStr)

  const outFm: Record<string, unknown> = {
    date: dateStr,
    issueNumber,
    weekStart,
    weekEnd,
    updatedAt: String(fm.updatedAt ?? ''),
    title: buildTitle(dateStr, issueNumber, weekStart, weekEnd, locale),
    locale,
    status: 'draft',
    sinalDaSemana,
  }
  if (summaryCards) outFm.summaryCards = summaryCards
  if (execSummaryIntro) outFm.execSummaryIntro = execSummaryIntro
  if (antiAvgIntro) outFm.antiAvgIntro = antiAvgIntro
  if (antiAvg) outFm.antiAvg = antiAvg
  if (antiAvgClosing) outFm.antiAvgClosing = antiAvgClosing
  if (scenariosIntro) outFm.scenariosIntro = scenariosIntro
  if (scenarios) outFm.scenarios = scenarios
  if (indicatorGrid) outFm.indicatorGrid = indicatorGrid
  if (liquidity) outFm.liquidity = liquidity
  if (calendar) outFm.calendar = calendar
  if (calendarFooter) outFm.calendarFooter = calendarFooter
  if (watchList) outFm.watchList = watchList
  if (methodology) outFm.methodology = methodology
  if (trackRecord) outFm.trackRecord = trackRecord
  if (additionalReading) outFm.additionalReading = additionalReading

  const outMd = matter.stringify(translatedBody, outFm)
  const outPath = join(TRADEOFF_DIR, `${date}.${locale}.md`)
  writeFileSync(outPath, outMd, 'utf-8')
  console.log(`   ✅ ${outPath} written (${outMd.length} chars)`)
}

main().catch(err => {
  console.error('\n❌ Translation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
