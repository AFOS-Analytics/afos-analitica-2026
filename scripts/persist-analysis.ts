import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport, type AnalysisType } from '../lib/analysis/persist'

const JOBS: Array<{ type: AnalysisType; file: string }> = [
  { type: 'analysis-cards', file: 'analysis-data.json' },
  { type: 'analysis-criteriosa', file: 'analysis-criteriosa.json' },
]

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log('\n💾 Persistindo snapshots de análise no Neon\n')

  const results = await Promise.all(JOBS.map(async job => {
    try {
      const data = JSON.parse(readFileSync(join(process.cwd(), 'public', job.file), 'utf-8'))
      const r = await upsertAnalysisReport(prisma, job.type, data, { createdBy: 'script:persist-analysis' })
      console.log(`✅ ${job.type.padEnd(22)} slug=${r.slug} (id=${r.id.slice(0, 8)}…)`)
      return { ok: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`❌ ${job.type.padEnd(22)} falhou: ${msg}`)
      return { ok: false }
    }
  }))

  await prisma.$disconnect()
  const failed = results.filter(r => !r.ok).length
  const ok = results.length - failed
  console.log(`\n${failed === 0 ? '✨' : '⚠️'} ${ok}/${results.length} persistidos. Git archive via GitHub Actions no próximo push.\n`)
  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
