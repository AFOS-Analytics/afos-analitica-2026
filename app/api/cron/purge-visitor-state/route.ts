/**
 * Cron: purge VisitorState antigos sem subscriber.
 * Roda 1x/dia (configurar em vercel.json).
 *
 * Política: deletar visitor_states com lastSessionAt < 90 dias atrás
 * E subscribed=false E sem leadId (puramente anônimos sem conversão).
 *
 * E, à parte, qualquer linha SEM ATIVIDADE há mais de 12 meses, inscrita ou
 * não: a política publicada promete identificadores anônimos por 12 meses, e
 * as linhas com subscribed=true (de /api/visitor/migrate, ou de quem se
 * descadastrou antes de o descadastro passar a soltar o vínculo) nunca
 * entravam no filtro acima e ficavam para sempre.
 *
 * Auth: Bearer CRON_SECRET (Vercel injeta automaticamente em scheduled crons).
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'
import { audit } from '../../../../lib/audit'
import { requireCronAuth } from '../../../../lib/cron/auth'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'

export const maxDuration = 60

const RETENTION_DAYS = 90
const MAX_RETENTION_DAYS = 365

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request)
  if (unauthorized) return unauthorized

  const prisma = getPrisma()
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const cutoffMax = new Date(Date.now() - MAX_RETENTION_DAYS * 24 * 60 * 60 * 1000)

  try {
    const result = await prisma.visitorState.deleteMany({
      where: {
        subscribed: false,
        leadId: null,
        OR: [
          { lastSessionAt: { lt: cutoff } },
          { lastSessionAt: null, createdAt: { lt: cutoff } },
        ],
      },
    })

    // Teto de 12 meses sem atividade, para qualquer linha. `updatedAt` muda a
    // cada sessão, dispensa ou cadastro, então mede a última atividade.
    const antigas = await prisma.visitorState.deleteMany({
      where: { updatedAt: { lt: cutoffMax } },
    })

    audit('visitor_state_purged', 'crm.visitor_states', 'cron', {
      after: {
        deleted: result.count,
        retentionDays: RETENTION_DAYS,
        cutoff: cutoff.toISOString(),
        deletedMaxRetention: antigas.count,
        maxRetentionDays: MAX_RETENTION_DAYS,
      },
    })

    return NextResponse.json({
      ok: true,
      deleted: result.count,
      retentionDays: RETENTION_DAYS,
      cutoff: cutoff.toISOString(),
      deletedMaxRetention: antigas.count,
      maxRetentionDays: MAX_RETENTION_DAYS,
    })
  } catch (error) {
    // Alerta por email. Este cron falhava em SILENCIO: dos sete declarados,
    // so `persist-analysis` avisava alguem. Nao bloqueia nem derruba nada.
    void avisarFalhaDeCron('purge-visitor-state', 'excecao nao tratada', error)
    console.error('[purge-visitor-state] Error:', error)
    return NextResponse.json({ error: 'purge_failed' }, { status: 500 })
  }
}
