/**
 * Disparo ÚNICO do Relatório de fechamento Brasil 2026 aos inscritos ativos (01/Nov/2026).
 *
 * Mesmo molde do broadcast-afos-daily.ts: inscritos com status 'active', idioma
 * escolhido no /welcome (preferredLocale) com cascata para o idioma do cadastro e
 * depois 'en', descadastro em um clique, throttle de ~3,8 envios/s e trilha por
 * destinatário em contact_events (produto 'relatorio', edição 'brasil-2026').
 *
 * 🔒 IDEMPOTENTE: quem já tem `broadcast_relatorio_sent` desta edição é pulado.
 * Rodar de novo depois de uma falha reenvia só para quem não recebeu.
 *
 * Uso:
 *   npx tsx scripts/broadcast-relatorio-final.ts --dry-run          lista destinatários por idioma, não envia
 *   npx tsx scripts/broadcast-relatorio-final.ts --preview=<pasta>  grava o HTML dos 3 idiomas para conferir
 *   npx tsx scripts/broadcast-relatorio-final.ts --enviar           envia
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { sendRelatorioFinal, relatorioFinalEmail } from '../app/lib/email/resend'
import { registrarBroadcast, type ResultadoEnvio } from './lib/broadcast-audit'

type Locale = 'pt-BR' | 'en' | 'es'
const META = { produto: 'relatorio', edicao: 'brasil-2026', pais: 'br' }
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 1000
const INTER_SEND_MS = 260

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const preview = process.argv.find((a) => a.startsWith('--preview='))?.split('=')[1]
  if (preview) {
    mkdirSync(preview, { recursive: true })
    for (const l of ['pt-BR', 'en', 'es'] as Locale[]) {
      const { subject, html } = relatorioFinalEmail(l, 'TOKEN-DE-EXEMPLO')
      writeFileSync(join(preview, `relatorio-final-${l}.html`), `<!-- assunto: ${subject} -->\n${html}`)
    }
    console.log(`preview gravado em ${preview}`)
    return
  }
  const enviar = process.argv.includes('--enviar')
  const dryRun = process.argv.includes('--dry-run')
  if (enviar === dryRun) { console.error('use --dry-run OU --enviar'); process.exit(1) }

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!url) { console.error('DATABASE_URL ausente'); process.exit(1) }
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })

  const leads = await prisma.lead.findMany({
    where: { status: 'active' },
    select: { id: true, email: true, preferredLocale: true, locale: true, unsubscribeToken: true },
  })
  const jaRecebeu = new Set(
    (await prisma.contactEvent.findMany({
      where: { eventType: 'broadcast_relatorio_sent', leadId: { in: leads.map((l) => l.id) } },
      select: { leadId: true, eventPayload: true },
    }))
      .filter((e) => (e.eventPayload as { edicao?: string } | null)?.edicao === META.edicao)
      .map((e) => e.leadId),
  )

  const fila = leads
    .filter((l) => !jaRecebeu.has(l.id))
    .map((l) => {
      const raw = (l.preferredLocale || l.locale || 'en').toLowerCase()
      const locale: Locale = raw.startsWith('pt') ? 'pt-BR' : raw.startsWith('es') ? 'es' : 'en'
      return { ...l, alvo: locale }
    })
  const porIdioma = fila.reduce<Record<string, number>>((a, l) => ((a[l.alvo] = (a[l.alvo] || 0) + 1), a), {})
  console.log(`inscritos ativos: ${leads.length} · já receberam esta edição: ${jaRecebeu.size} · a enviar: ${fila.length}`)
  console.log(`por idioma: ${JSON.stringify(porIdioma)}`)
  if (no(fila.length) || dryRun) {
    if (dryRun) for (const l of fila) console.log(`  [DRY] ${l.email.slice(0, 3)}*** -> ${l.alvo}`)
    if (dryRun) console.log('trilha: dry-run não grava evento, por desenho.')
    await prisma.$disconnect()
    return
  }

  let enviados = 0
  const falhas: string[] = []
  for (let i = 0; i < fila.length; i += BATCH_SIZE) {
    const lote = fila.slice(i, i + BATCH_SIZE)
    const trilha: ResultadoEnvio[] = []
    await Promise.all(lote.map(async (l, idx) => {
      if (idx > 0) await sleep(INTER_SEND_MS * idx)
      const r = await sendRelatorioFinal(l.email, l.alvo, l.unsubscribeToken || undefined)
      trilha.push({ leadId: l.id, locale: l.alvo, ok: r.ok, messageId: r.id, erro: r.erro })
      if (r.ok) enviados++
      else falhas.push(l.email)
    }))
    // trilha por LOTE: se cair no meio, a próxima rodada pula quem já recebeu
    await registrarBroadcast(prisma, META, trilha)
    if (i + BATCH_SIZE < fila.length) await sleep(BATCH_DELAY_MS)
  }
  console.log(`\nenviados ${enviados} de ${fila.length}; falhas ${falhas.length}`)
  if (falhas.length) { console.warn('rodar de novo com --enviar reenvia só para estes:'); falhas.forEach((e) => console.warn('  ' + e.slice(0, 3) + '***')) }
  await prisma.$disconnect()
}

const no = (n: number) => n === 0

main().catch((e) => { console.error('falhou:', e); process.exit(1) })
