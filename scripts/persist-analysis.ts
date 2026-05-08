import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { upsertAnalysisReport, type AnalysisType } from '../lib/analysis/persist'
import { assertDatabaseUrl } from '../lib/db-url-validator'

const JOBS: Array<{ type: AnalysisType; file: string }> = [
  { type: 'analysis-cards', file: 'analysis-data.json' },
  { type: 'analysis-criteriosa', file: 'analysis-criteriosa.json' },
]

// Detalha qualquer erro em formato legível — Neon WebSocket retorna ErrorEvent
// que stringify mostra apenas '[object ErrorEvent]'. Aqui extraímos message,
// type, code, e qualquer detalhe disponível.
function describeError(err: unknown): string {
  if (err instanceof Error) {
    return `${err.name}: ${err.message}${err.cause ? ` (cause: ${describeError(err.cause)})` : ''}`
  }
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    const parts: string[] = []
    if (e.type) parts.push(`type=${e.type}`)
    if (e.message) parts.push(`message=${e.message}`)
    if (e.code) parts.push(`code=${e.code}`)
    if (e.errno) parts.push(`errno=${e.errno}`)
    if (e.error) parts.push(`error=${describeError(e.error)}`)
    if (e.reason) parts.push(`reason=${e.reason}`)
    if (parts.length === 0) {
      try { return JSON.stringify(err) } catch { return String(err) }
    }
    return parts.join(' | ')
  }
  return String(err)
}

async function withRetry<T>(label: string, fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const detail = describeError(err)
      console.warn(`  ⚠️  ${label} tentativa ${attempt}/${maxAttempts} falhou: ${detail}`)
      if (attempt < maxAttempts) {
        const backoff = 500 * Math.pow(2, attempt - 1)  // 500ms, 1s, 2s
        await new Promise(r => setTimeout(r, backoff))
      }
    }
  }
  throw lastErr
}

async function main() {
  const url = process.env.DATABASE_URL
  assertDatabaseUrl(url, 'DATABASE_URL')

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
  console.log('\n💾 Persistindo snapshots de análise no Neon\n')

  // Warm-up Neon WS antes de upserts — Neon serverless WebSocket tem cold-start
  // que provoca [object ErrorEvent] na primeira query. SELECT 1 abre o canal
  // e exercita o adapter sem alterar dados. Resolve falha recorrente analysis-cards.
  try {
    await withRetry('warmup', () => prisma.$queryRaw`SELECT 1`, 3)
    console.log('  ✓ Neon WS warm-up OK\n')
  } catch (err) {
    console.warn(`  ⚠️ Warm-up falhou após 3 tentativas, prosseguindo: ${describeError(err)}\n`)
  }

  // Sequential — Neon serverless adapter doesn't guarantee safety with
  // concurrent queries on the same client. Promise.all once silently dropped
  // the second upsert; for...of avoids it without a perf cost (2 jobs).
  const results: Array<{ ok: boolean }> = []
  for (const job of JOBS) {
    try {
      const data = JSON.parse(readFileSync(join(process.cwd(), 'public', job.file), 'utf-8'))
      const r = await withRetry(
        job.type,
        () => upsertAnalysisReport(prisma, job.type, data, { createdBy: 'script:persist-analysis' }),
        3,
      )
      console.log(`✅ ${job.type.padEnd(22)} slug=${r.slug} (id=${r.id.slice(0, 8)}…)`)
      results.push({ ok: true })
    } catch (err) {
      console.error(`❌ ${job.type.padEnd(22)} falhou após retries: ${describeError(err)}`)
      if (err instanceof Error && err.stack) console.error(err.stack)
      results.push({ ok: false })
    }
  }

  await prisma.$disconnect()
  const failed = results.filter(r => !r.ok).length
  const ok = results.length - failed
  console.log(`\n${failed === 0 ? '✨' : '⚠️'} ${ok}/${results.length} persistidos. Git archive via GitHub Actions no próximo push.\n`)
  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
