/**
 * API Route: GET /api/admin/metrics
 *
 * Dashboard executivo — contagens, crescimento, status operacional.
 * Auth: Bearer CRON_SECRET (timing-safe).
 * Sob demanda — não é polling, não gera custo recorrente.
 */

import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { prisma } from '../../../../lib/db'
import { audit } from '../../../../lib/audit'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch { return false }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  const authHeader = request.headers.get('authorization') || ''
  if (!safeCompare(authHeader, `Bearer ${secret}`)) {
    audit('auth_failure', 'api.admin.metrics', 'n/a', { ip: request.headers.get('x-forwarded-for') || undefined })
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!prisma) return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })

  try {
    const now = new Date()
    const d7 = new Date(now.getTime() - 7 * 86400000)
    const d30 = new Date(now.getTime() - 30 * 86400000)
    const d24h = new Date(now.getTime() - 86400000)

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('metrics_timeout')), 8000)
    )

    const queries = Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { firstSeenAt: { gte: d7 } } }),
      prisma.lead.count({ where: { firstSeenAt: { gte: d30 } } }),
      prisma.marketPrice.count(),
      prisma.marketPrice.count({ where: { snapshotAt: { gte: d24h } } }),
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { createdAt: { gte: d24h } } }),
      prisma.llmRun.count(),
      prisma.llmRun.count({ where: { createdAt: { gte: d7 } } }),
      prisma.deletionRequest.count({ where: { status: 'pending' } }),
      prisma.deletionRequest.count({ where: { status: 'completed' } }),
    ])

    const [
      leadsTotal,
      leads7d,
      leads30d,
      pricesTotal,
      prices24h,
      auditTotal,
      audit24h,
      llmTotal,
      llm7d,
      deletionsPending,
      deletionsCompleted,
    ] = await Promise.race([queries, timeout])

    return NextResponse.json({
      timestamp: now.toISOString(),
      leads: { total: leadsTotal, last7d: leads7d, last30d: leads30d },
      marketPrices: { total: pricesTotal, last24h: prices24h },
      auditLogs: { total: auditTotal, last24h: audit24h },
      llmRuns: { total: llmTotal, last7d: llm7d },
      deletionRequests: { pending: deletionsPending, completed: deletionsCompleted },
    }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    })
  } catch (error) {
    console.error('[metrics] Erro:', error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
