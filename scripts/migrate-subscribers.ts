/**
 * Migração one-shot: Redis subscribers → Neon crm.leads
 *
 * Uso:
 *   npx tsx scripts/migrate-subscribers.ts --dry-run   (apenas conta, não grava)
 *   npx tsx scripts/migrate-subscribers.ts              (migra de verdade)
 *
 * Seguro para rodar múltiplas vezes (upsert por email).
 * Não deleta dados do Redis — cutover manual depois.
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { Redis } from '@upstash/redis'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const dryRun = process.argv.includes('--dry-run')

async function main() {
  // Redis
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    console.error('❌ Redis env vars não configuradas')
    process.exit(1)
  }

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL não configurada')
    process.exit(1)
  }

  const redis = new Redis({ url: redisUrl, token: redisToken })
  const adapter = new PrismaNeon({ connectionString: dbUrl })
  const prisma = new PrismaClient({ adapter })

  console.log(`\n${dryRun ? '🔍 DRY RUN' : '🚀 MIGRAÇÃO'} — Redis → Neon\n`)

  // 1. Ler todos os emails do Redis SET
  const emails: string[] = await redis.smembers('afos:subscribers')
  console.log(`📧 Emails no Redis: ${emails.length}`)

  if (emails.length === 0) {
    console.log('✅ Nada para migrar')
    await prisma.$disconnect()
    return
  }

  // 2. Para cada email, ler metadata do HASH
  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const email of emails) {
    const normalized = email.toLowerCase().trim()
    const hashKey = `afos:subscriber:${normalized}`

    try {
      const data = await redis.hgetall(hashKey) as Record<string, string> | null

      if (dryRun) {
        console.log(`  [dry] ${normalized.slice(0, 3)}*** — source: ${data?.source || 'unknown'}`)
        migrated++
        continue
      }

      // Upsert — seguro para rodar múltiplas vezes
      await prisma.lead.upsert({
        where: { email: normalized },
        update: {
          updatedAt: new Date(),
        },
        create: {
          email: normalized,
          source: data?.source || 'redis_migration',
          status: (data?.status as 'active' | 'unsubscribed') || 'active',
          consentVersion: data?.consentVersion || '1.0',
          createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(),
        },
      })

      migrated++
    } catch (err) {
      errors++
      console.error(`  ❌ ${normalized.slice(0, 3)}***: ${err instanceof Error ? err.message : err}`)
    }
  }

  // 3. Validação
  const neonCount = await prisma.lead.count()

  console.log(`\n📊 Resultado:`)
  console.log(`   Redis:   ${emails.length} emails`)
  console.log(`   Migrado: ${migrated}`)
  console.log(`   Erros:   ${errors}`)
  console.log(`   Neon:    ${neonCount} leads total`)

  if (!dryRun && neonCount >= emails.length) {
    console.log(`\n✅ Migração completa — contagem OK`)
  } else if (!dryRun) {
    console.log(`\n⚠️  Contagem divergente — investigar`)
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('💥 Erro fatal:', err)
  process.exit(1)
})
