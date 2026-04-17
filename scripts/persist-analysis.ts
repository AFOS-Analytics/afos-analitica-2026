/**
 * Persiste snapshots das análises diárias no Neon.
 *
 * Lê public/analysis-data.json e public/analysis-criteriosa.json e grava
 * um AnalysisReport por tipo+data (upsert via slug).
 *
 * Resiliente: falha em um arquivo não impede o outro.
 *
 * Arquivamento redundante em Git branch é feito automaticamente por
 * GitHub Actions (workflow archive-analysis.yml) no push para main.
 *
 * Uso: npx tsx scripts/persist-analysis.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { deriveDateSlug, truncate } from '../lib/analysis/date-slug'

type AnalysisType = 'analysis-cards' | 'analysis-criteriosa'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

  const adapter = new PrismaNeon({ connectionString: url })
  const prisma = new PrismaClient({ adapter })

  console.log('\n💾 Persistindo snapshots de análise no Neon\n')

  const jobs: Array<{ type: AnalysisType; file: string }> = [
    { type: 'analysis-cards', file: 'analysis-data.json' },
    { type: 'analysis-criteriosa', file: 'analysis-criteriosa.json' },
  ]

  let successCount = 0
  let failureCount = 0

  for (const job of jobs) {
    try {
      const path = join(process.cwd(), 'public', job.file)
      const raw = readFileSync(path, 'utf-8')
      const data = JSON.parse(raw) as Record<string, unknown>

      const dateSlug = deriveDateSlug(data)
      const slug = `${job.type}-${dateSlug}`
      const updatedAtLabel = (data.updatedAt as string) || new Date().toISOString()

      const title = job.type === 'analysis-cards'
        ? `Análise Cards — ${updatedAtLabel}`
        : `Análise Criteriosa — ${updatedAtLabel}`

      const executiveSummary = truncate(
        job.type === 'analysis-cards' ? buildCardsSummary(data) : buildCriteriaSummary(data),
      )

      const result = await prisma.analysisReport.upsert({
        where: { slug },
        create: {
          slug,
          title,
          locale: 'pt-BR',
          status: 'published',
          executiveSummary,
          bodyMarkdown: JSON.stringify(data),
          createdBy: 'script:persist-analysis',
          publishedAt: new Date(),
        },
        update: {
          title,
          executiveSummary,
          bodyMarkdown: JSON.stringify(data),
          publishedAt: new Date(),
        },
      })

      console.log(`✅ ${job.type.padEnd(22)} slug=${slug} (id=${result.id.slice(0, 8)}…)`)
      successCount++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`❌ ${job.type.padEnd(22)} falhou: ${msg}`)
      failureCount++
    }
  }

  await prisma.$disconnect()
  console.log(`\n${successCount === jobs.length ? '✨' : '⚠️'} ${successCount}/${jobs.length} snapshots persistidos` +
    (failureCount > 0 ? ` (${failureCount} falharam)` : '') +
    '. Git archive será feito via GitHub Actions no próximo push.\n')

  if (failureCount > 0) process.exit(1)
}

function buildCardsSummary(data: Record<string, unknown>): string {
  const cards = data.cards as Record<string, unknown> | undefined
  if (!cards) return 'Sem dados'
  return `Cards: ${Object.keys(cards).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

function buildCriteriaSummary(data: Record<string, unknown>): string {
  const candidates = data.candidates as Array<{ name: string }> | undefined
  if (!candidates) return 'Sem dados'
  return `Candidatos: ${candidates.map(c => c.name).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

main().catch(err => { console.error(err); process.exit(1) })
