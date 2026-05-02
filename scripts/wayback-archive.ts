/**
 * wayback-archive.ts — arquiva URLs citadas na AFOS Daily via archive.org
 *
 * Origem: Fase 3.2 do guardrail. Imuniza contra link rot e edits silenciosos.
 *
 * Usage:
 *   npx tsx scripts/wayback-archive.ts 2026-05-01
 *
 * Throttle: 3s entre requests para nao sobrecarregar archive.org.
 * Custo: zero (Wayback Machine e' gratuito).
 */
import { isValidDate, readDailyMarkdown, extractExternalUrls } from './lib/daily-files'

const WAYBACK_BASE = 'https://web.archive.org/save/'
const THROTTLE_MS = 3000

async function archiveUrl(url: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(WAYBACK_BASE + url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'AFOS-Analytics-Wayback-Archiver/1.0' },
    })
    return res.ok ? { ok: true } : { ok: false, error: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const date = process.argv[2]
  if (!date || !isValidDate(date)) {
    console.error('Usage: npx tsx scripts/wayback-archive.ts YYYY-MM-DD')
    process.exit(1)
  }

  const markdown = readDailyMarkdown(date)
  if (!markdown) {
    console.error(`File public/afos-daily/${date}.md not found.`)
    process.exit(1)
  }

  const urls = extractExternalUrls(markdown)
  console.log(`Wayback archive — AFOS Daily ${date}: ${urls.length} URLs externas`)

  if (urls.length === 0) process.exit(0)

  let ok = 0
  let fail = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const short = url.length > 70 ? url.slice(0, 67) + '...' : url
    process.stdout.write(`  [${i + 1}/${urls.length}] ${short} `)
    const result = await archiveUrl(url)
    if (result.ok) {
      console.log('OK')
      ok++
    } else {
      console.log(`FAIL (${result.error})`)
      fail++
    }
    if (i < urls.length - 1) await sleep(THROTTLE_MS)
  }

  console.log(`\nResumo: ${ok}/${urls.length} arquivados${fail > 0 ? `, ${fail} falharam` : ''}.`)
  process.exit(fail > 0 ? 1 : 0)
}

main()
