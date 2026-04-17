/**
 * Persiste snapshots das análises diárias no Neon.
 *
 * Lê public/analysis-data.json e public/analysis-criteriosa.json e grava
 * um AnalysisReport por tipo+data (upsert via slug).
 *
 * Uso: npx tsx scripts/persist-analysis.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { backupToBlob } from '../lib/analysis/blob-backup'

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

  for (const job of jobs) {
    const path = join(process.cwd(), 'public', job.file)
    const raw = readFileSync(path, 'utf-8')
    const data = JSON.parse(raw) as Record<string, unknown>

    const updatedAt = (data.updatedAt as string) || new Date().toISOString()
    const dateSlug = updatedAt.slice(0, 10).replace(/\//g, '-')
    const slug = `${job.type}-${dateSlug}`

    const title = job.type === 'analysis-cards'
      ? `Análise Cards — ${updatedAt}`
      : `Análise Criteriosa — ${updatedAt}`

    const executiveSummary = job.type === 'analysis-cards'
      ? buildCardsSummary(data)
      : buildCriteriaSummary(data)

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

    console.log(`✅ Neon  ${job.type.padEnd(22)} slug=${slug} (id=${result.id.slice(0, 8)}…)`)

    const blob = await backupToBlob(job.type, data)
    if (blob.ok) {
      console.log(`✅ Blob  ${job.type.padEnd(22)} ${blob.url}`)
    } else {
      console.log(`⚠️  Blob  ${job.type.padEnd(22)} skipped (${blob.error})`)
    }
  }

  await prisma.$disconnect()
  console.log('\n✨ Done\n')
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
