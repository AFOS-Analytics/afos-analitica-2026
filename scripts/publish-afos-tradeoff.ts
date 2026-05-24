/**
 * publish-afos-tradeoff.ts — flip status: draft → published in frontmatter
 *
 * Usage:
 *   npx tsx scripts/publish-afos-tradeoff.ts 2026-05-25
 *   npx tsx scripts/publish-afos-tradeoff.ts 2026-05-25 --all-locales
 *
 * Mirror of publish-afos-daily.ts but for Tradeoff editions. Drafts are
 * gated out of sitemap, RSS feed, llms.txt, and prod /[locale]/tradeoff/[date]
 * until a human flips the status. This script is the manual-flip step.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const TRADEOFF_DIR = join(process.cwd(), 'public', 'afos-tradeoff')
const LOCALES = ['', '.en', '.es'] as const

function flipFile(path: string): 'flipped' | 'already-published-warn' | 'already-published-clean' | 'no-status-line' | 'missing' {
  if (!existsSync(path)) return 'missing'
  const content = readFileSync(path, 'utf-8')

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fmMatch) return 'no-status-line'

  const fm = fmMatch[1]
  const statusMatch = fm.match(/^status:\s*([a-z]+)\s*$/m)
  if (!statusMatch) return 'no-status-line'

  if (statusMatch[1] === 'published') {
    return 'already-published-warn'
  }

  const newFm = fm.replace(/^status:\s*[a-z]+\s*$/m, 'status: published')
  const updated = content.replace(fmMatch[0], `---\n${newFm}\n---\n`)
  writeFileSync(path, updated, 'utf-8')
  return 'flipped'
}

function main() {
  const date = process.argv[2]
  const allLocales = process.argv.includes('--all-locales')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('❌ Usage: npx tsx scripts/publish-afos-tradeoff.ts YYYY-MM-DD [--all-locales]')
    process.exit(1)
  }

  const targets = allLocales
    ? LOCALES.map((suffix) => join(TRADEOFF_DIR, `${date}${suffix}.md`))
    : [join(TRADEOFF_DIR, `${date}.md`)]

  console.log(`🚦 Flipping status: draft → published for AFOS Tradeoff ${date}${allLocales ? ' (all locales)' : ' (PT-BR only — pass --all-locales for EN/ES too)'}\n`)

  let anyFlipped = false
  for (const path of targets) {
    const result = flipFile(path)
    const name = path.split(/[\\/]/).pop()
    switch (result) {
      case 'flipped':
        console.log(`✅ ${name}: status flipped to published`)
        anyFlipped = true
        break
      case 'already-published-warn':
        console.log(`⚠️  ${name}: ALREADY published. Possivel skill bypass — edição pode ter sido criada com status:published direto, pulando o publish gate.`)
        break
      case 'already-published-clean':
        console.log(`ℹ️  ${name}: already published, no-op`)
        break
      case 'no-status-line':
        console.log(`⚠️  ${name}: no status line in frontmatter`)
        break
      case 'missing':
        console.log(`⏭️  ${name}: file not found, skipping`)
        break
    }
  }

  if (!anyFlipped) {
    console.log('\n⚠️  No files were flipped. Check arguments or current status.')
    process.exit(0)
  }

  console.log('\n📋 Next steps:')
  console.log(`   1. git add public/afos-tradeoff/${date}*.md`)
  console.log(`   2. git commit -m "Publish AFOS Tradeoff Edição ${date}"`)
  console.log(`   3. git push origin main`)
  console.log(`   4. npx vercel --yes --prod`)
  console.log(`   5. npx tsx scripts/persist-afos-tradeoff.ts ${date}`)
}

main()
