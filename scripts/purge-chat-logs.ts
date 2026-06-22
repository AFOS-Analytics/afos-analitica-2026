/**
 * Retenção do arquivo anônimo do chatbot: remove conversas com última atividade
 * há mais de 12 meses (cascade apaga as mensagens). Rodar periodicamente (cron/manual).
 *
 *   npx tsx scripts/purge-chat-logs.ts          # purga real
 *   npx tsx scripts/purge-chat-logs.ts --dry    # só conta, não apaga
 */
import { prisma } from '../lib/db'

async function main() {
  if (!prisma) {
    console.error('[purge-chat-logs] DATABASE_URL indisponível.')
    process.exit(1)
  }
  const dry = process.argv.includes('--dry')
  const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // ~12 meses

  const stale = await prisma.chatConversation.count({ where: { lastMessageAt: { lt: cutoff } } })
  if (dry) {
    console.log(`[purge-chat-logs] DRY: ${stale} conversas com >12 meses de inatividade seriam removidas (corte ${cutoff.toISOString()}).`)
    return
  }
  const res = await prisma.chatConversation.deleteMany({ where: { lastMessageAt: { lt: cutoff } } })
  console.log(`[purge-chat-logs] ${res.count} conversas >12 meses removidas (cascade nas mensagens). Corte: ${cutoff.toISOString()}.`)
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
