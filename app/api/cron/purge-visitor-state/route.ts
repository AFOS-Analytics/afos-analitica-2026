/**
 * Cron: purge VisitorState antigos sem subscriber.
 * Roda 1x/dia (configurar em vercel.json).
 *
 * Política: deletar visitor_states com lastSessionAt < 90 dias atrás
 * E subscribed=false E sem leadId (puramente anônimos sem conversão).
 *
 * Auth: Bearer CRON_SECRET (Vercel injeta automaticamente em scheduled crons).
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { audit } from '../../../../lib/audit'

export const maxDuration = 60

const RETENTION_DAYS = 90

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (process.env.VERCEL && (!cronSecret || authHeader !== `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)

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

    audit('visitor_state_purged', 'crm.visitor_states', 'cron', {
      after: { deleted: result.count, retentionDays: RETENTION_DAYS, cutoff: cutoff.toISOString() },
    })

    return NextResponse.json({
      ok: true,
      deleted: result.count,
      retentionDays: RETENTION_DAYS,
      cutoff: cutoff.toISOString(),
    })
  } catch (error) {
    console.error('[purge-visitor-state] Error:', error)
    return NextResponse.json({ error: 'purge_failed' }, { status: 500 })
  }
}
