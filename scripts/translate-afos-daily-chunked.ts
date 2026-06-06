import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { translate } from '../lib/ai/translate'
import { loadGlossary } from '../lib/glossary/loader'
import { MONTHS } from '../lib/i18n/months'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')

type TargetLocale = 'en' | 'es'

const TARGET_LOCALE_NAMES: Record<TargetLocale, string> = { en: 'English', es: 'Spanish' }

function buildTitle(date: string, locale: TargetLocale): string {
  const [y, m, d] = date.split('-').map(Number)
  return locale === 'en'
    ? `AFOS Daily — ${MONTHS.en[m - 1]} ${d}, ${y}`
    : `AFOS Daily — ${d} de ${MONTHS.es[m - 1]} de ${y}`
}

async function translateChunk(text: string, locale: TargetLocale, glossary: Array<{ term: string; id: string }>) {
  return translate({
    sourceText: text,
    sourceLocale: 'pt-BR',
    targetLocale: locale,
    type: 'afos-daily',
    glossaryEntries: glossary,
  })
}

async function main() {
  const date = process.argv[2]
  const locale = process.argv[3] as TargetLocale
  if (!date || !['en', 'es'].includes(locale)) {
    console.error('Usage: translate-afos-daily-chunked.ts <YYYY-MM-DD> <en|es>')
    process.exit(1)
  }

  const path = join(DAILY_DIR, `${date}.md`)
  const raw = readFileSync(path, 'utf-8')
  const { data: fm, content: body } = matter(raw)
  const lede = String(fm.lede ?? '')
  // tldr: optional 3-bullet summary; translate each bullet separately if present
  const tldr: string[] = Array.isArray(fm.tldr)
    ? fm.tldr.filter((b: unknown): b is string => typeof b === 'string' && b.trim().length > 0)
    : []

  const glossaryEntries = loadGlossary().map(e => ({ term: e.term, id: e.id }))

  // Split body in 4 chunks: each at ## section boundary
  // Chunk A: title + section 1 + section 2
  // Chunk B: section 3
  // Chunk C: section 4 + Em síntese
  // Chunk D: --- + sources + método (large URL block)
  const sec3Idx = body.indexOf('## 3. ')
  const sec4Idx = body.indexOf('## 4. ')
  // sepIdx: separator AFTER sec4 (lede may have its own `---` before sec1, ignore it)
  const sepIdx = body.indexOf('\n---\n', sec4Idx)
  if (sec3Idx < 0 || sec4Idx < 0 || sepIdx < 0) {
    console.error('Section markers not found in body')
    process.exit(1)
  }
  const chunkA = body.slice(0, sec3Idx)
  const chunkB = body.slice(sec3Idx, sec4Idx)
  const chunkC = body.slice(sec4Idx, sepIdx)
  const chunkDFull = body.slice(sepIdx)

  // Split chunk D further if too large: at "matérias secundárias" heading
  // (sources block with many Google News URLs can exceed API max_tokens)
  const secondMatIdx = chunkDFull.indexOf('matérias secundárias')
  const splitDPoint = secondMatIdx > 0 ? chunkDFull.lastIndexOf('\n\n**', secondMatIdx) : -1
  const chunkD1 = splitDPoint > 0 ? chunkDFull.slice(0, splitDPoint) : chunkDFull
  const chunkD2 = splitDPoint > 0 ? chunkDFull.slice(splitDPoint) : ''

  console.log(`📖 ${date} body=${body.length} chars (chunks: ${chunkA.length}+${chunkB.length}+${chunkC.length}+${chunkD1.length}${chunkD2 ? '+' + chunkD2.length : ''})`)
  console.log(`🌐 Translating to ${TARGET_LOCALE_NAMES[locale]}...`)

  console.log('   [1/6] lede')
  const ledeResult = await translateChunk(lede, locale, glossaryEntries)

  // Translate TL;DR bullets (if present). Each bullet is small (~150-200 chars),
  // so translating individually is cheap and keeps glossary tagging granular.
  let tldrTranslated: string[] = []
  if (tldr.length > 0) {
    console.log(`   [1.5/6] TL;DR (${tldr.length} bullets)`)
    for (const bullet of tldr) {
      const r = await translateChunk(bullet, locale, glossaryEntries)
      tldrTranslated.push(r.translatedText.trim())
    }
  }

  console.log('   [2/6] chunk A (title + sec 1 + sec 2)')
  const aResult = await translateChunk(chunkA, locale, glossaryEntries)

  console.log('   [3/6] chunk B (sec 3)')
  let bText: string
  if (chunkB.length > 7000) {
    // Section 3 with many long Google News URLs exceeds output tokens — split at paragraph boundaries
    const parts: string[] = []
    let remaining = chunkB
    while (remaining.length > 5000) {
      const splitAt = remaining.lastIndexOf('\n\n', 5000)
      const cut = splitAt > 2000 ? splitAt + 2 : 5000
      parts.push(remaining.slice(0, cut))
      remaining = remaining.slice(cut)
    }
    if (remaining.length > 0) parts.push(remaining)
    console.log(`   Split B in ${parts.length} sub-chunks: ${parts.map(p => p.length).join('+')}`)
    const bResults: string[] = []
    for (let i = 0; i < parts.length; i++) {
      console.log(`   [B.${i + 1}/${parts.length}] ${parts[i].length} chars`)
      const r = await translateChunk(parts[i], locale, glossaryEntries)
      bResults.push(r.translatedText)
    }
    bText = bResults.join('')
  } else {
    const bResult = await translateChunk(chunkB, locale, glossaryEntries)
    bText = bResult.translatedText
  }

  console.log('   [4/6] chunk C (sec 4 + Em síntese)')
  const cResult = await translateChunk(chunkC, locale, glossaryEntries)

  console.log('   [5/6] chunk D1 (separator + anchor sources)')
  const d1Result = await translateChunk(chunkD1, locale, glossaryEntries)

  let d2Text = ''
  if (chunkD2) {
    // Quartile-split D2: long URL list blows past API limits when in 1-2 chunks.
    // Split at "- [" boundaries to keep each chunk under ~5000 chars.
    if (chunkD2.length > 8000) {
      const quarter = Math.floor(chunkD2.length / 4)
      const p1 = chunkD2.indexOf('\n- [', quarter)
      const p2 = p1 > 0 ? chunkD2.indexOf('\n- [', p1 + quarter) : -1
      const p3 = p2 > 0 ? chunkD2.indexOf('\n- [', p2 + quarter) : -1
      const parts = [
        chunkD2.slice(0, p1 > 0 ? p1 : chunkD2.length),
        p1 > 0 ? chunkD2.slice(p1, p2 > 0 ? p2 : chunkD2.length) : '',
        p2 > 0 ? chunkD2.slice(p2, p3 > 0 ? p3 : chunkD2.length) : '',
        p3 > 0 ? chunkD2.slice(p3) : '',
      ].filter(Boolean)
      console.log(`   Split D2 in ${parts.length} sub-chunks: ${parts.map(p => p.length).join('+')}`)
      const results: string[] = []
      for (let i = 0; i < parts.length; i++) {
        console.log(`   [D2.${i + 1}/${parts.length}] ${parts[i].length} chars`)
        const r = await translateChunk(parts[i], locale, glossaryEntries)
        results.push(r.translatedText)
      }
      d2Text = results.join('')
    } else {
      console.log('   [6/6] chunk D2 (secondary sources + método)')
      const d2Result = await translateChunk(chunkD2, locale, glossaryEntries)
      d2Text = d2Result.translatedText
    }
  }

  let translatedBody = aResult.translatedText + bText + cResult.translatedText + d1Result.translatedText + d2Text

  // ============================================================
  // POST-PROCESS — corrige bugs cumulativos do tradutor
  // Documentado em memory/feedback_translator_known_bugs.md
  // ============================================================
  // 1. Insert blank line before ## headers glued to previous content
  // Use [^\n#] (NOT just [^\n]) to avoid breaking ### into # + ##.
  // Match both '\n##' (already on own line) and inline '##' (no newline at all).
  translatedBody = translatedBody.replace(/([^\n#])(## )/g, '$1\n\n$2')
  translatedBody = translatedBody.replace(/([^\n#])(### )/g, '$1\n\n$2')
  // 2. Restore ### Calendar heading split into '#\n\n## 📅' or '## 📅'
  translatedBody = translatedBody.replace(/\n#\n+## 📅/g, '\n\n### 📅')
  translatedBody = translatedBody.replace(/^## 📅 /gm, '### 📅 ')
  // 3. Em-dash auto-replacement: standalone — used as section separator
  translatedBody = translatedBody.replace(/^—$/gm, '---')
  translatedBody = translatedBody.replace(/^—{2,}$/gm, '---')
  // 4. Em-dash in table separator row: |—|—|...|  →  |---|---|...|
  translatedBody = translatedBody.replace(/^\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|$/gm, '|---|---|---|---|---|---|')

  const yamlLines = [
    '---',
    `date: ${fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : fm.date}`,
    `updatedAt: "${fm.updatedAt}"`,
    `title: ${JSON.stringify(buildTitle(date, locale))}`,
    `locale: ${locale}`,
    'status: draft',
    `lede: ${JSON.stringify(ledeResult.translatedText)}`,
  ]
  if (tldrTranslated.length > 0) {
    yamlLines.push('tldr:')
    for (const bullet of tldrTranslated) {
      yamlLines.push(`  - ${JSON.stringify(bullet)}`)
    }
  }
  yamlLines.push('---', '', '') // 5. Blank line between frontmatter close and content (lede blockquote rendering)
  const outMd = yamlLines.join('\n') + translatedBody.trim() + '\n'

  const outPath = join(DAILY_DIR, `${date}.${locale}.md`)
  writeFileSync(outPath, outMd, 'utf-8')
  console.log(`   ✅ ${outPath} written (${outMd.length} chars)`)
}

main().catch(err => {
  console.error('\n❌ Translation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
