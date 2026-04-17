import { config } from 'dotenv'
config({ path: '.env.local' })

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport, type AnalysisType } from '../lib/analysis/persist'

type Job = { type: AnalysisType; path: string }

const JOBS: Job[] = [
  { type: 'analysis-cards', path: 'public/analysis-data.json' },
  { type: 'analysis-criteriosa', path: 'public/analysis-criteriosa.json' },
]

function gitLog(path: string): Array<{ hash: string; date: string }> {
  const out = execSync(`git log --pretty=format:"%H|%ai" --follow -- "${path}"`, { encoding: 'utf-8' }).trim()
  if (!out) return []
  return out.split('\n').map(line => {
    const [hash, date] = line.split('|')
    return { hash, date }
  })
}

function gitShow(hash: string, path: string): string | null {
  try {
    return execSync(`git show ${hash}:"${path}"`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] })
  } catch {
    return null
  }
}

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log('\n📚 Backfill histórico Neon — git → AnalysisReport\n')

  for (const job of JOBS) {
    const commits = gitLog(job.path).reverse()
    console.log(`\n🔍 ${job.type}: ${commits.length} commits encontrados`)

    let persisted = 0
    let skipped = 0

    for (const { hash, date } of commits) {
      const raw = gitShow(hash, job.path)
      if (!raw) { skipped++; continue }

      let data: Record<string, unknown>
      try { data = JSON.parse(raw) } catch { skipped++; continue }

      try {
        const r = await upsertAnalysisReport(prisma, job.type, data, {
          createdBy: `backfill:${hash.slice(0, 7)}`,
          publishedAt: new Date(date),
          fallbackIsoDate: date.slice(0, 10),
        })
        persisted++
        process.stdout.write(`  ✓ ${r.slug.padEnd(40)} (${hash.slice(0, 7)} ${date.slice(0, 10)})\n`)
      } catch (err) {
        skipped++
        console.error(`  ✗ ${hash.slice(0, 7)} falhou: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    console.log(`\n  → ${persisted} persistidos, ${skipped} pulados\n`)
  }

  const total = await prisma.analysisReport.count()
  console.log(`\n📊 Total AnalysisReports no Neon: ${total}\n`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
