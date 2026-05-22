/**
 * broadcast-afos-daily.ts — Send AFOS Daily teaser to all active subscribers.
 *
 * Fase 3 (D+8 22/Mai). Run after publish-afos-daily.ts:
 *   npx tsx scripts/broadcast-afos-daily.ts 2026-05-22
 *
 * Reads markdown frontmatter of the 3 locale variants (.md, .en.md, .es.md)
 * to extract title + lede per locale. Queries Neon for active leads. For each,
 * sends teaser email in their preferredLocale (fallback 'en').
 *
 * Batching: 100 emails per batch, 1s sleep between batches to respect Resend
 * rate limits (10/s default tier).
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { sendDailyTeaser } from '../app/lib/email/resend'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')
const BATCH_SIZE = 50
const BATCH_DELAY_MS = 1000

type Locale = 'pt-BR' | 'en' | 'es'
const LOCALE_SUFFIX: Record<Locale, string> = { 'pt-BR': '', 'en': '.en', 'es': '.es' }

interface DailyContent {
  title: string
  lede: string
}

function readDailyFrontmatter(date: string, locale: Locale): DailyContent | null {
  const path = join(DAILY_DIR, `${date}${LOCALE_SUFFIX[locale]}.md`)
  if (!existsSync(path)) return null
  const raw = readFileSync(path, 'utf-8')
  const { data } = matter(raw)
  if (typeof data.title !== 'string' || typeof data.lede !== 'string') return null
  if (data.status !== 'published') return null
  return { title: data.title, lede: data.lede }
}

async function main() {
  const date = process.argv[2]
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Usage: npx tsx scripts/broadcast-afos-daily.ts YYYY-MM-DD')
    process.exit(1)
  }

  const dryRun = process.argv.includes('--dry-run')
  if (dryRun) console.log('🔵 DRY-RUN mode — no emails will be sent.\n')

  const content: Record<Locale, DailyContent | null> = {
    'pt-BR': readDailyFrontmatter(date, 'pt-BR'),
    'en':    readDailyFrontmatter(date, 'en'),
    'es':    readDailyFrontmatter(date, 'es'),
  }
  if (!content.en) {
    console.error(`❌ EN daily not published for ${date}. Publish first with: npx tsx scripts/publish-afos-daily.ts ${date} --all-locales`)
    process.exit(1)
  }

  console.log(`📰 Daily ${date} content loaded:`)
  for (const loc of ['pt-BR', 'en', 'es'] as Locale[]) {
    console.log(`  ${loc}: ${content[loc] ? `"${content[loc]!.title}" (${content[loc]!.lede.slice(0, 60)}...)` : 'NOT PUBLISHED'}`)
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

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    console.log(`📤 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(leads.length / BATCH_SIZE)} (${batch.length} emails)...`)

    const results = await Promise.all(batch.map(async (lead) => {
      // Resolve locale: preferredLocale (set via /welcome) takes priority.
      // Fallback to signup-time locale (accept-language inference) → fallback 'en'.
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

      const ok = await sendDailyTeaser(
        lead.email,
        { date, locale, title: c.title, lede: c.lede },
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
