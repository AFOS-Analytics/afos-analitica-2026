import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport } from '../lib/analysis/persist'
import { assertDatabaseUrl } from '../lib/db-url-validator'

function parseFrontmatter(md: string): { fm: Record<string, string>; body: string } {
  const parsed = matter(md)
  const fm: Record<string, string> = {}
  for (const [k, v] of Object.entries(parsed.data)) fm[k] = String(v ?? '')
  return { fm, body: parsed.content }
}

async function persistOne(prisma: PrismaClient, filePath: string, dateIso: string) {
  const raw = readFileSync(filePath, 'utf-8')
  const { fm, body } = parseFrontmatter(raw)

  const data = {
    date: dateIso,
    updatedAt: fm.updatedAt || `${dateIso}`,
    title: fm.title || `AFOS Daily — ${dateIso}`,
    locale: fm.locale || 'pt-BR',
    lede: fm.lede || '',
    markdown: body,
  }

  const result = await upsertAnalysisReport(prisma, 'afos-daily', data, {
    createdBy: 'afos-daily',
    fallbackIsoDate: dateIso,
  })

  return { slug: result.slug, id: result.id }
}

async function main() {
  const url = process.env.DATABASE_URL
  assertDatabaseUrl(url, 'DATABASE_URL')

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log('\n💾 Persistindo AFOS Daily no Neon\n')

  const dir = join(process.cwd(), 'public', 'afos-daily')
  const targetArg = process.argv[2]

  let files: string[]
  if (targetArg) {
    // Persist específico (ex: 2026-04-22)
    files = [`${targetArg}.md`]
  } else {
    // Persist todos os .md no diretório
    files = readdirSync(dir).filter(f => f.endsWith('.md')).sort()
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
