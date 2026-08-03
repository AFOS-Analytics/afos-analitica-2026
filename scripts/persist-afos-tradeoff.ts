import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport } from '../lib/analysis/persist'
import { assertDatabaseUrl } from '../lib/db-url-validator'

function parseFrontmatter(md: string): { fm: Record<string, unknown>; body: string } {
  const parsed = matter(md)
  return { fm: parsed.data as Record<string, unknown>, body: parsed.content }
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

async function persistOne(prisma: PrismaClient, filePath: string, dateIso: string) {
  const raw = readFileSync(filePath, 'utf-8')
  const { fm, body } = parseFrontmatter(raw)

  // Tradeoff stores rich structured frontmatter (summaryCards, antiAvg, scenarios,
  // indicatorGrid, liquidity, calendar, watchList, additionalReading). For Neon
  // persistence, capture the full file (frontmatter + body) so the snapshot
  // preserves everything needed to re-render the edition later if the .md is lost.
  const fullMarkdown = `---\n${Object.entries(fm).map(([k, v]) =>
    typeof v === 'object' && v !== null ? `${k}: ${JSON.stringify(v)}` : `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`
  ).join('\n')}\n---\n\n${body}`

  const data = {
    date: dateIso,
    updatedAt: str(fm.updatedAt, dateIso),
    title: str(fm.title, `AFOS Tradeoff — ${dateIso}`),
    locale: str(fm.locale, 'pt-BR'),
    lede: str(fm.sinalDaSemana),
    markdown: fullMarkdown,
  }

  // O slug sai da DATA DA EDIÇÃO (nome do arquivo), não do `updatedAt`. No
  // Tradeoff as duas são diferentes por desenho: a edição sai na segunda e o
  // snapshot de mercado é do domingo, então sem `slugIsoDate` a edição de
  // 03/Ago era gravada como `afos-tradeoff-02-08-2026`.
  const result = await upsertAnalysisReport(prisma, 'afos-tradeoff', data, {
    createdBy: 'afos-tradeoff',
    fallbackIsoDate: dateIso,
    slugIsoDate: dateIso,
  })

  return { slug: result.slug, id: result.id }
}

async function main() {
  const url = process.env.DATABASE_URL
  assertDatabaseUrl(url, 'DATABASE_URL')

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log('\n💾 Persistindo AFOS Tradeoff no Neon\n')

  const dir = join(process.cwd(), 'public', 'afos-tradeoff')
  const targetArg = process.argv[2]

  let files: string[]
  if (targetArg) {
    files = [`${targetArg}.md`]
  } else {
    files = readdirSync(dir).filter(f => f.endsWith('.md') && !f.includes('.en.') && !f.includes('.es.')).sort()
  }

  let ok = 0
  for (const f of files) {
    const dateIso = f.replace('.md', '')
    const path = join(dir, f)
    try {
      const { slug, id } = await persistOne(prisma, path, dateIso)
      console.log(`✅ ${f.padEnd(18)} slug=${slug} (id=${id.slice(0, 8)}…)`)
      ok++
    } catch (e) {
      console.error(`❌ ${f}: ${e instanceof Error ? e.message : e}`)
    }
  }

  console.log(`\n✨ ${ok}/${files.length} persistidos no Neon.\n`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
