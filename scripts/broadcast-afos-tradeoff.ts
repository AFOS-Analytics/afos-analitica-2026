/**
 * broadcast-afos-tradeoff.ts — Send AFOS Tradeoff teaser to all active subscribers.
 *
 * Mirror of broadcast-afos-daily.ts adapted for Tradeoff editions.
 * Reads markdown frontmatter of 3 locale variants and sends teaser in lead's
 * preferredLocale (fallback 'en').
 *
 *   npx tsx scripts/broadcast-afos-tradeoff.ts 2026-05-24 --dry-run
 *   npx tsx scripts/broadcast-afos-tradeoff.ts 2026-05-24
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { sendTradeoffTeaser } from '../app/lib/email/resend'

const TRADEOFF_DIR = join(process.cwd(), 'public', 'afos-tradeoff')

// Adaptive throttle — espelha broadcast-afos-daily.ts (fix 31/Mai commit 01c319b).
// Limite REAL do Resend = 5 req/s. interSendMs é stagger cumulativo (interSendMs*idx dentro
// do batch) ⇒ >=220ms mantém <5 envios/s. Antes, este script usava batchSize:50 + Promise.all
// SEM stagger → dispararia a lista toda de uma vez e bateria 429 (mesmo furo do Daily).
function pickThrottle(leadCount: number): { batchSize: number; batchDelayMs: number; interSendMs: number } {
  if (leadCount > 200) return { batchSize: 5, batchDelayMs: 1000, interSendMs: 220 }
  if (leadCount > 50) return { batchSize: 8, batchDelayMs: 1000, interSendMs: 220 }
  if (leadCount > 20) return { batchSize: 10, batchDelayMs: 1000, interSendMs: 220 }
  return { batchSize: 10, batchDelayMs: 1000, interSendMs: 220 } // piso 220ms: <5 req/s, sem 429
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

type Locale = 'pt-BR' | 'en' | 'es'
const LOCALE_SUFFIX: Record<Locale, string> = { 'pt-BR': '', 'en': '.en', 'es': '.es' }

interface TradeoffContent {
  title: string
  sinalDaSemana: string
  issueNumber: number
}

function readTradeoffFrontmatter(date: string, locale: Locale): TradeoffContent | null {
  const path = join(TRADEOFF_DIR, `${date}${LOCALE_SUFFIX[locale]}.md`)
  if (!existsSync(path)) return null
  const raw = readFileSync(path, 'utf-8')
  const { data } = matter(raw)
  if (typeof data.title !== 'string' || typeof data.sinalDaSemana !== 'string') return null
  if (data.status !== 'published') return null
  const issueNumber = typeof data.issueNumber === 'number' ? data.issueNumber : 1
  return { title: data.title, sinalDaSemana: data.sinalDaSemana, issueNumber }
}

async function main() {
  const date = process.argv[2]
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Usage: npx tsx scripts/broadcast-afos-tradeoff.ts YYYY-MM-DD')
    process.exit(1)
  }

  const dryRun = process.argv.includes('--dry-run')
  if (dryRun) console.log('🔵 DRY-RUN mode — no emails will be sent.\n')

  const content: Record<Locale, TradeoffContent | null> = {
    'pt-BR': readTradeoffFrontmatter(date, 'pt-BR'),
    'en':    readTradeoffFrontmatter(date, 'en'),
    'es':    readTradeoffFrontmatter(date, 'es'),
  }
  if (!content.en) {
    console.error(`❌ EN Tradeoff not published for ${date}. Publish first with: npx tsx scripts/publish-afos-tradeoff.ts ${date} --all-locales`)
    process.exit(1)
  }

  console.log(`📰 Tradeoff ${date} content loaded:`)
  for (const loc of ['pt-BR', 'en', 'es'] as Locale[]) {
    const c = content[loc]
    console.log(`  ${loc}: ${c ? `"${c.title}" (issue #${c.issueNumber}, ${c.sinalDaSemana.slice(0, 60)}...)` : 'NOT PUBLISHED'}`)
  }
  console.log()

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!url) {
    console.error('❌ DATABASE_URL not set')
    process.exit(1)
  }
  const adapter = new PrismaNeon({ connectionString: url })
  const prisma = new PrismaClient({ adapter })

  const leads = await prisma.lead.findMany({
    where: { status: 'active' },
    select: { id: true, email: true, preferredLocale: true, locale: true, unsubscribeToken: true },
  })
  console.log(`📋 ${leads.length} active leads found.\n`)

  if (leads.length === 0) {
    console.log('No active leads to email. Done.')
    await prisma.$disconnect()
    return
  }

  let sent = 0
  let failed = 0
  let skipped = 0

  const { batchSize: BATCH_SIZE, batchDelayMs: BATCH_DELAY_MS, interSendMs: INTER_SEND_MS } = pickThrottle(leads.length)
  console.log(`🚦 Throttle: batchSize=${BATCH_SIZE} batchDelay=${BATCH_DELAY_MS}ms interSend=${INTER_SEND_MS}ms (${leads.length} leads)`)
  console.log()

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    console.log(`📤 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(leads.length / BATCH_SIZE)} (${batch.length} emails)...`)

    const results = await Promise.all(batch.map(async (lead, idx) => {
      if (INTER_SEND_MS > 0 && idx > 0) await sleep(INTER_SEND_MS * idx)
      const raw = (lead.preferredLocale || lead.locale || 'en').toLowerCase()
      const locale: Locale = raw.startsWith('pt') ? 'pt-BR' : raw.startsWith('es') ? 'es' : 'en'

      const c = content[locale] || content.en!
      if (!c) {
        skipped++
        return { ok: false, lead, reason: 'no_content' }
      }

      if (dryRun) {
        console.log(`  [DRY] ${lead.email.slice(0, 3)}*** → ${locale}`)
        return { ok: true, lead, reason: 'dry_run' }
      }

      const ok = await sendTradeoffTeaser(
        lead.email,
        { date, locale, title: c.title, sinalDaSemana: c.sinalDaSemana, issueNumber: c.issueNumber },
        lead.unsubscribeToken || undefined,
      )
      return { ok, lead }
    }))

    sent += results.filter(r => r.ok).length
    failed += results.filter(r => !r.ok).length

    if (i + BATCH_SIZE < leads.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  console.log(`\n✅ Broadcast complete: ${sent} sent / ${failed} failed / ${skipped} skipped of ${leads.length} active leads.`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌ Broadcast failed:', err)
  process.exit(1)
})
