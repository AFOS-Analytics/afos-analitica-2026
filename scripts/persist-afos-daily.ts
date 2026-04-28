import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport } from '../lib/analysis/persist'

function parseFrontmatter(md: string): { fm: Record<string, string>; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) return { fm: {}, body: md }
  const fm: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    fm[kv[1]] = v
  }
  return { fm, body: m[2] }
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
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

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
