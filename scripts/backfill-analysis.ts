/**
 * Backfill histórico de análises do git para o Neon.
 *
 * Para cada arquivo (analysis-data.json, analysis-criteriosa.json):
 *   1. Lista todos os commits que tocaram o arquivo
 *   2. Extrai o conteúdo em cada commit
 *   3. Persiste no Neon via upsert por slug (tipo-data)
 *
 * Commits dentro do mesmo dia: o último (mais recente) "ganha" o upsert.
 * Idempotente: rodar múltiplas vezes é seguro.
 *
 * Uso: npx tsx scripts/backfill-analysis.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { deriveDateSlug, truncate } from '../lib/analysis/date-slug'

type Job = { type: 'analysis-cards' | 'analysis-criteriosa'; path: string }

const jobs: Job[] = [
  { type: 'analysis-cards', path: 'public/analysis-data.json' },
  { type: 'analysis-criteriosa', path: 'public/analysis-criteriosa.json' },
]

function gitLog(path: string): Array<{ hash: string; date: string }> {
  const out = execSync(`git log --pretty=format:"%H|%ai" --follow -- "${path}"`, { encoding: 'utf-8' })
  if (!out.trim()) return []
  return out.trim().split('\n').map(line => {
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

function buildTitle(type: Job['type'], data: Record<string, unknown>, fallbackDate: string): string {
  const updatedAt = (data.updatedAt as string) || fallbackDate
  return type === 'analysis-cards'
    ? `Análise Cards — ${updatedAt}`
    : `Análise Criteriosa — ${updatedAt}`
}

function buildSummary(type: Job['type'], data: Record<string, unknown>): string {
  if (type === 'analysis-cards') {
    const cards = data.cards as Record<string, unknown> | undefined
    if (!cards) return 'Sem dados'
    return `Cards: ${Object.keys(cards).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
  }
  const candidates = data.candidates as Array<{ name: string }> | undefined
  if (!candidates) return 'Sem dados'
  return `Candidatos: ${candidates.map(c => c.name).join(', ')} | Atualizado: ${data.updatedAt || 'N/A'}`
}

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) { console.error('❌ DATABASE_URL não configurada'); process.exit(1) }

  const adapter = new PrismaNeon({ connectionString: url })
  const prisma = new PrismaClient({ adapter })

  console.log('\n📚 Backfill histórico Neon — git → AnalysisReport\n')

  for (const job of jobs) {
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
        const dateSlug = deriveDateSlug(data, date.slice(0, 10))
        const slug = `${job.type}-${dateSlug}`
        const title = buildTitle(job.type, data, date.slice(0, 10))
        const summary = truncate(buildSummary(job.type, data))
        const publishedAt = new Date(date)

        await prisma.analysisReport.upsert({
          where: { slug },
          create: {
            slug, title,
            locale: 'pt-BR',
            status: 'published',
            executiveSummary: summary,
            bodyMarkdown: JSON.stringify(data),
            createdBy: `backfill:${hash.slice(0, 7)}`,
            publishedAt,
          },
          update: {
            title,
            executiveSummary: summary,
            bodyMarkdown: JSON.stringify(data),
            publishedAt,
          },
        })

        persisted++
        process.stdout.write(`  ✓ ${slug.padEnd(40)} (${hash.slice(0, 7)} ${date.slice(0, 10)})\n`)
      } catch (err) {
        skipped++
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`  ✗ ${hash.slice(0, 7)} falhou: ${msg}`)
      }
    }

    console.log(`\n  → ${persisted} persistidos, ${skipped} pulados\n`)
  }

  const total = await prisma.analysisReport.count()
  console.log(`\n📊 Total AnalysisReports no Neon: ${total}\n`)

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
