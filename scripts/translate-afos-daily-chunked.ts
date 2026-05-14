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

  const glossaryEntries = loadGlossary().map(e => ({ term: e.term, id: e.id }))

  // Split body in 4 chunks: each at ## section boundary
  // Chunk A: title + section 1 + section 2
  // Chunk B: section 3
  // Chunk C: section 4 + Em síntese
  // Chunk D: --- + sources + método (large URL block)
  const sec3Idx = body.indexOf('## 3. ')
  const sec4Idx = body.indexOf('## 4. ')
  const sepIdx = body.indexOf('\n---\n')
  if (sec3Idx < 0 || sec4Idx < 0 || sepIdx < 0) {
    console.error('Section markers not found in body')
    process.exit(1)
  }
  const chunkA = body.slice(0, sec3Idx)
  const chunkB = body.slice(sec3Idx, sec4Idx)
  const chunkC = body.slice(sec4Idx, sepIdx)
  const chunkD = body.slice(sepIdx)

  console.log(`📖 ${date} body=${body.length} chars (4 chunks: ${chunkA.length}+${chunkB.length}+${chunkC.length}+${chunkD.length})`)
  console.log(`🌐 Translating to ${TARGET_LOCALE_NAMES[locale]}...`)

  console.log('   [1/5] lede')
  const ledeResult = await translateChunk(lede, locale, glossaryEntries)

  console.log('   [2/5] chunk A (title + sec 1 + sec 2)')
  const aResult = await translateChunk(chunkA, locale, glossaryEntries)

  console.log('   [3/5] chunk B (sec 3)')
  const bResult = await translateChunk(chunkB, locale, glossaryEntries)

  console.log('   [4/5] chunk C (sec 4 + Em síntese)')
  const cResult = await translateChunk(chunkC, locale, glossaryEntries)

  console.log('   [5/5] chunk D (separator + sources + método)')
  const dResult = await translateChunk(chunkD, locale, glossaryEntries)

  const translatedBody = aResult.translatedText + bResult.translatedText + cResult.translatedText + dResult.translatedText

  const yamlLines = [
    '---',
    `date: ${fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : fm.date}`,
    `updatedAt: "${fm.updatedAt}"`,
    `title: ${buildTitle(date, locale)}`,
    `locale: ${locale}`,
    'status: draft',
    `lede: ${JSON.stringify(ledeResult.translatedText)}`,
    '---',
    '',
  ]
  const outMd = yamlLines.join('\n') + translatedBody.trim() + '\n'

  const outPath = join(DAILY_DIR, `${date}.${locale}.md`)
  writeFileSync(outPath, outMd, 'utf-8')
  console.log(`   ✅ ${outPath} written (${outMd.length} chars)`)
}

main().catch(err => {
  console.error('\n❌ Translation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
