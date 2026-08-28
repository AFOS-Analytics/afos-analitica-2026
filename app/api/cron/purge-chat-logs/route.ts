/**
 * Cron: retenção do arquivo ANÔNIMO de conversas do chatbot.
 * Roda 1x/dia (configurado em vercel.json).
 *
 * Política: deletar chat_conversations com lastMessageAt < 12 meses atrás
 * (cascade apaga as chat_messages). Conteúdo anônimo, sem IP/identidade.
 *
 * Auth: Bearer CRON_SECRET (Vercel injeta automaticamente em scheduled crons).
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'
import { audit } from '../../../../lib/audit'
import { requireCronAuth } from '../../../../lib/cron/auth'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'

export const maxDuration = 60

const RETENTION_DAYS = 365

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request)
  if (unauthorized) return unauthorized

  const prisma = getPrisma()
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)

  try {
    const result = await prisma.chatConversation.deleteMany({
      where: { lastMessageAt: { lt: cutoff } },
    })

    audit('chat_logs_purged', 'ai.chat_conversations', 'cron', {
      after: { deleted: result.count, retentionDays: RETENTION_DAYS, cutoff: cutoff.toISOString() },
    })

    return NextResponse.json({
      ok: true,
      deleted: result.count,
      retentionDays: RETENTION_DAYS,
      cutoff: cutoff.toISOString(),
    })
  } catch (error) {
    // Alerta por email. Este cron falhava em SILENCIO: dos sete declarados,
    // so `persist-analysis` avisava alguem. Nao bloqueia nem derruba nada.
    void avisarFalhaDeCron('purge-chat-logs', 'excecao nao tratada', error)
    console.error('[purge-chat-logs] Error:', error)
    return NextResponse.json({ error: 'purge_failed' }, { status: 500 })
  }
}
