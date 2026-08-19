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
import { registrarBroadcast, type ResultadoEnvio } from './lib/broadcast-audit'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')

// Adaptive throttle (firmed 30/Mai pós-EVAL D+15 — incidente 22/Mai broadcast bateu 429
// em 8/13 envios, retries absorveram. Acima de 30 leads cai abrupto.
// Limite REAL observado = 5 req/s (mensagem 429 em 31/Mai), NÃO 10/s. interSendMs é stagger
// cumulativo (interSendMs*idx dentro do batch). 220ms ficou NA BORDA (5 sends em ~880ms = 5/s):
// no broadcast Tradeoff de 31/Mai 2 envios ainda bateram 429 (recuperados por retry). 260ms dá
// folga real (~3.8/s) e zera os 429. Faixa base era interSendMs:0 → disparava lista pequena de
// uma vez e estourava o limite (15 leads bateram ~7x 429, salvos só pelo retry).
function pickThrottle(leadCount: number): { batchSize: number; batchDelayMs: number; interSendMs: number } {
  if (leadCount > 200) return { batchSize: 5, batchDelayMs: 1000, interSendMs: 260 }
  if (leadCount > 50) return { batchSize: 8, batchDelayMs: 1000, interSendMs: 260 }
  if (leadCount > 20) return { batchSize: 10, batchDelayMs: 1000, interSendMs: 260 }
  return { batchSize: 10, batchDelayMs: 1000, interSendMs: 260 } // piso 260ms: ~3.8/s, folga real <5 req/s
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

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
  const failedEmails: string[] = []
  /** Um item por destinatário, para a trilha em contact_events. */
  const trilha: ResultadoEnvio[] = []
  /** Espelho do lote corrente. Zerado a cada gravacao. */
  const trilhaDoLote: ResultadoEnvio[] = []

  const { batchSize: BATCH_SIZE, batchDelayMs: BATCH_DELAY_MS, interSendMs: INTER_SEND_MS } = pickThrottle(leads.length)
  console.log(`🚦 Throttle: batchSize=${BATCH_SIZE} batchDelay=${BATCH_DELAY_MS}ms interSend=${INTER_SEND_MS}ms (${leads.length} leads)`)
  console.log()

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    console.log(`📤 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(leads.length / BATCH_SIZE)} (${batch.length} emails)...`)

    const results = await Promise.all(batch.map(async (lead, idx) => {
      if (INTER_SEND_MS > 0 && idx > 0) await sleep(INTER_SEND_MS * idx)
      // Resolve locale: preferredLocale (set via /welcome) takes priority.
      // Fallback to signup-time locale (accept-language inference) → fallback 'en'.
      const raw = (lead.preferredLocale || lead.locale || 'en').toLowerCase()
      const locale: Locale = raw.startsWith('pt') ? 'pt-BR' : raw.startsWith('es') ? 'es' : 'en'

      const c = content[locale] || content.en!
      if (!c) {
        skipped++
        trilha.push({ leadId: lead.id, locale, ok: false, pulado: true, erro: 'no_content' }); trilhaDoLote.push({ leadId: lead.id, locale, ok: false, pulado: true, erro: 'no_content' })
        return { ok: false, lead, reason: 'no_content' }
      }

      if (dryRun) {
        console.log(`  [DRY] ${lead.email.slice(0, 3)}*** → ${locale}`)
        return { ok: true, lead, reason: 'dry_run' }
      }

      const r = await sendDailyTeaser(
        lead.email,
        { date, locale, title: c.title, lede: c.lede },
        lead.unsubscribeToken || undefined,
      )
      trilha.push({ leadId: lead.id, locale, ok: r.ok, messageId: r.id, erro: r.erro }); trilhaDoLote.push({ leadId: lead.id, locale, ok: r.ok, messageId: r.id, erro: r.erro })
      return { ok: r.ok, lead }
    }))

    sent += results.filter(r => r.ok).length
    failed += results.filter(r => !r.ok).length
    // EVAL 06/Jun: registra os endereços que falharam para re-envio DIRIGIDO. Sem isso, um
    // crash/429 no meio forçava re-broadcast pra lista inteira (duplicatas). Não é idempotência
    // completa, mas torna a falha observável e recuperável sem reenviar a todos.
    for (const r of results) {
      const reason = 'reason' in r ? r.reason : undefined
      if (!r.ok && reason !== 'dry_run' && reason !== 'no_content') failedEmails.push(r.lead.email)
    }

    // 🔴 A TRILHA SAI POR LOTE, nao no fim.
    //
    // Ate 19/Ago/2026 ela era gravada UMA vez, depois do laco inteiro. Um crash
    // ou um 429 no lote 5 de 10 deixava zero linha de trilha, e a lista de quem
    // JA recebeu se perdia: rodar de novo reenviava para todo mundo. Agora cada
    // lote e gravado assim que fecha, entao o operador sempre sabe onde parou.
    //
    // `createMany` e apendice, entao gravar em pedacos e equivalente a gravar
    // no fim, com a diferenca de sobreviver a interrupcao.
    if (!dryRun && trilhaDoLote.length > 0) {
      await registrarBroadcast(prisma, { produto: 'daily', edicao: date, pais: 'br' }, trilhaDoLote)
      trilhaDoLote.length = 0
    }

    if (i + BATCH_SIZE < leads.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  console.log(`\n✅ Broadcast complete: ${sent} sent / ${failed} failed / ${skipped} skipped of ${leads.length} active leads.`)
  if (failedEmails.length > 0) {
    console.warn(`⚠️  ${failedEmails.length} envios falharam — re-enviar dirigido a:`)
    failedEmails.forEach(e => console.warn(`   ${e}`))
  }

  if (!dryRun) {
    if (trilhaDoLote.length > 0) await registrarBroadcast(prisma, { produto: 'daily', edicao: date, pais: 'br' }, trilhaDoLote)
  } else {
    console.log('🧾 trilha: dry-run não grava evento, por desenho.')
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌ Broadcast failed:', err)
  process.exit(1)
})
