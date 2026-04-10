/**
 * Seed: JSON files → Neon research.analyses
 *
 * Armazena os 3 JSONs como registros JSONB com versionamento.
 * Seguro para rodar múltiplas vezes (upsert por type).
 *
 * Uso:
 *   npx tsx scripts/seed-research.ts --dry-run
 *   npx tsx scripts/seed-research.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const dryRun = process.argv.includes('--dry-run')

const FILES = [
  { type: 'polls_data', file: 'polls-data.json', dateField: 'lastUpdate' },
  { type: 'analysis_cards', file: 'analysis-data.json', dateField: 'updatedAt' },
  { type: 'analysis_criteriosa', file: 'analysis-criteriosa.json', dateField: 'updatedAt' },
] as const

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL não configurada')
    process.exit(1)
  }

  const adapter = new PrismaNeon({ connectionString: dbUrl })
  const prisma = new PrismaClient({ adapter })

  console.log(`\n${dryRun ? '🔍 DRY RUN' : '🌱 SEED'} — JSON → Neon research.analyses\n`)

  for (const { type, file, dateField } of FILES) {
    const filePath = join(process.cwd(), 'public', file)

    if (!existsSync(filePath)) {
      console.log(`  ⚠️  ${file} — não encontrado, pulando`)
      continue
    }

    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    const dateStr = data[dateField] || new Date().toISOString()
    // Parse date — handle "DD/MM/YYYY, HH:mm" format
    const publishedAt = dateStr.includes('/')
      ? new Date(dateStr.split(', ')[0].split('/').reverse().join('-'))
      : new Date(dateStr)

    if (dryRun) {
      const sizeKb = (Buffer.byteLength(raw) / 1024).toFixed(1)
      console.log(`  [dry] ${type} — ${file} (${sizeKb} KB) — published: ${publishedAt.toISOString().slice(0, 10)}`)
      continue
    }

    // Verificar versão atual
    const existing = await prisma.analysis.findFirst({
      where: { type },
      orderBy: { version: 'desc' },
      select: { version: true },
    })

    const nextVersion = (existing?.version ?? 0) + 1

    await prisma.analysis.create({
      data: {
        type,
        content: data,
        publishedAt,
        version: nextVersion,
      },
    })

    console.log(`  ✅ ${type} v${nextVersion} — ${file}`)
  }

  // Resumo
  if (!dryRun) {
    const total = await prisma.analysis.count()
    console.log(`\n📊 Total registros em research.analyses: ${total}`)
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('💥 Erro fatal:', err)
  process.exit(1)
})
