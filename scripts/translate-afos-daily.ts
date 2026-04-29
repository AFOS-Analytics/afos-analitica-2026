/**
 * Translate an AFOS Daily synthesis from PT-BR to EN and ES using Claude Haiku.
 *
 * Usage:
 *   npx tsx scripts/translate-afos-daily.ts <YYYY-MM-DD> [--locale=en|es|both] [--dry-run]
 *
 * Examples:
 *   npx tsx scripts/translate-afos-daily.ts 2026-04-28
 *     → translates to EN and ES, writes 2026-04-28.en.md and 2026-04-28.es.md
 *
 *   npx tsx scripts/translate-afos-daily.ts 2026-04-28 --locale=en
 *     → translates only to EN
 *
 *   npx tsx scripts/translate-afos-daily.ts 2026-04-28 --dry-run
 *     → prints the prompt that would be sent to Claude (no API call, no write)
 *
 * Env required (in .env.local):
 *   TRANSLATION_API_KEY=<anthropic api key>
 *   TRANSLATION_PROVIDER=anthropic   # default if omitted
 *
 * Editorial review: by policy, the first 2-3 weeks of EN/ES output
 * MUST be reviewed by a human before publication. Output goes to
 * disk; commit is manual.
 */

import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { translate } from '../lib/ai/translate'
import { afosDailyTranslationPrompt } from '../lib/ai/prompts'
import { loadGlossary } from '../lib/glossary/loader'
import { isValidDate } from '../lib/afos-daily/loader'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')

type TargetLocale = 'en' | 'es'
const SUPPORTED_TARGETS: TargetLocale[] = ['en', 'es']

const TARGET_LOCALE_NAMES: Record<TargetLocale, string> = {
  en: 'English',
  es: 'Spanish',
}

interface ParsedArgs {
  date: string
  locales: TargetLocale[]
  dryRun: boolean
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2)
  const date = args.find(a => isValidDate(a))
  if (!date) {
    console.error('Usage: translate-afos-daily.ts <YYYY-MM-DD> [--locale=en|es|both] [--dry-run]')
    process.exit(1)
  }
  const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1] ?? 'both'
  let locales: TargetLocale[]
  if (localeArg === 'both') locales = SUPPORTED_TARGETS
  else if (localeArg === 'en' || localeArg === 'es') locales = [localeArg]
  else {
    console.error(`Invalid --locale: ${localeArg}. Use en, es, or both.`)
    process.exit(1)
  }
  const dryRun = args.includes('--dry-run')
  return { date, locales, dryRun }
}

interface TitleInfo {
  pt: string
  en: string
  es: string
}

const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function buildTitles(date: string): TitleInfo {
  const [y, m, d] = date.split('-').map(Number)
  return {
    pt: `AFOS Daily — ${d} de ${MONTHS_PT[m - 1]} de ${y}`,
    en: `AFOS Daily — ${MONTHS_EN[m - 1]} ${d}, ${y}`,
    es: `AFOS Daily — ${d} de ${MONTHS_ES[m - 1]} de ${y}`,
  }
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

function buildOutputMarkdown(fm: Record<string, unknown>, locale: TargetLocale, title: string, translatedLede: string, translatedBody: string): string {
  const yamlLines = [
    '---',
    `date: ${fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : fm.date}`,
    `updatedAt: "${fm.updatedAt}"`,
    `title: ${title}`,
    `locale: ${locale}`,
    `status: ${fm.status || 'published'}`,
    `lede: ${JSON.stringify(translatedLede)}`,
    '---',
    '',
  ]
  return yamlLines.join('\n') + translatedBody.trim() + '\n'
}

async function main() {
  const args = parseArgs(process.argv)
  const path = join(DAILY_DIR, `${args.date}.md`)
  if (!existsSync(path)) {
    console.error(`File not found: ${path}`)
    process.exit(1)
  }

  console.log(`\n📖 Reading ${args.date}.md`)
  const raw = readFileSync(path, 'utf-8')
  const { data: fm, content: body } = matter(raw)
  const lede = String(fm.lede ?? '')
  const titles = buildTitles(args.date)

  const glossaryEntries = loadGlossary().map(e => ({ term: e.term, id: e.id }))
  console.log(`   ${glossaryEntries.length} glossary entries available`)
  console.log(`   body: ${body.length} chars / lede: ${lede.length} chars`)

  if (args.dryRun) {
    console.log('\n🔍 DRY RUN — printing prompt that would be sent to Claude (en, body):\n')
    const prompt = afosDailyTranslationPrompt(body.slice(0, 800) + '\n[...truncated for dry-run...]', 'pt-BR', 'en', glossaryEntries)
    console.log(prompt)
    console.log('\n[dry-run end]\n')
    process.exit(0)
  }

  if (!process.env.TRANSLATION_API_KEY) {
    console.error('\n❌ TRANSLATION_API_KEY not set in .env.local')
    console.error('   Add: TRANSLATION_API_KEY="sk-ant-api03-..."')
    console.error('   Get a key at: https://console.anthropic.com/settings/keys\n')
    process.exit(1)
  }

  for (const locale of args.locales) {
    console.log(`\n🌐 Translating to ${TARGET_LOCALE_NAMES[locale]}...`)

    console.log('   [1/2] lede')
    const ledeResult = await translateChunk(lede, locale, glossaryEntries)
    console.log(`        ${ledeResult.cached ? 'cache hit' : `${ledeResult.meta?.tokensIn}→${ledeResult.meta?.tokensOut} tokens, ${ledeResult.meta?.latencyMs}ms`}`)

    console.log('   [2/2] body')
    const bodyResult = await translateChunk(body, locale, glossaryEntries)
    console.log(`        ${bodyResult.cached ? 'cache hit' : `${bodyResult.meta?.tokensIn}→${bodyResult.meta?.tokensOut} tokens, ${bodyResult.meta?.latencyMs}ms`}`)

    const outPath = join(DAILY_DIR, `${args.date}.${locale}.md`)
    const outMd = buildOutputMarkdown(fm, locale, titles[locale], ledeResult.translatedText, bodyResult.translatedText)
    writeFileSync(outPath, outMd, 'utf-8')

    const totalTokens =
      (ledeResult.meta?.tokensIn ?? 0) +
      (ledeResult.meta?.tokensOut ?? 0) +
      (bodyResult.meta?.tokensIn ?? 0) +
      (bodyResult.meta?.tokensOut ?? 0)
    console.log(`   ✅ ${outPath} written (${outMd.length} chars, ~${totalTokens} tokens used)`)
  }

  console.log('\n✨ Done. Review the .en.md / .es.md files manually before committing.\n')
}

main().catch(err => {
  console.error('\n❌ Translation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
