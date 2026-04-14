/**
 * API Route: GET /api/admin/analytics
 *
 * Analytics detalhado — séries temporais, breakdowns, saúde do pipeline.
 * Complementa /api/admin/metrics (que retorna apenas contagens pontuais).
 *
 * Auth: Bearer CRON_SECRET (timing-safe).
 * Query params:
 *   ?days=30  (padrão 30, max 90)
 */

import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { prisma } from '../../../../lib/db'
import { checkCronHealth, isKvAvailable } from '../../../lib/kv'
import { audit } from '../../../../lib/audit'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch { return false }
}

interface DailyCount { day: string; count: bigint }
interface GroupCount { key: string; count: bigint }

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  const authHeader = request.headers.get('authorization') || ''
  if (!safeCompare(authHeader, `Bearer ${secret}`)) {
    audit('auth_failure', 'api.admin.analytics', 'n/a', {
      ip: request.headers.get('x-forwarded-for') || undefined,
    })
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!prisma) return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })

  const url = new URL(request.url)
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '30'), 1), 90)
  const since = new Date(Date.now() - days * 86400000)

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('analytics_timeout')), 12000)
    )

    const queries = Promise.all([
      // 1. Lead growth curve (daily)
      prisma.$queryRaw<DailyCount[]>`
        SELECT DATE(first_seen_at) as day, COUNT(*)::bigint as count
        FROM crm.leads
        WHERE first_seen_at >= ${since}
        GROUP BY DATE(first_seen_at)
        ORDER BY day
      `,

      // 2. Leads by capture source
      prisma.$queryRaw<GroupCount[]>`
        SELECT capture_source as key, COUNT(*)::bigint as count
        FROM crm.leads
        GROUP BY capture_source
        ORDER BY count DESC
      `,

      // 3. Leads by locale
      prisma.$queryRaw<GroupCount[]>`
        SELECT COALESCE(locale, 'unknown') as key, COUNT(*)::bigint as count
        FROM crm.leads
        GROUP BY locale
        ORDER BY count DESC
      `,

      // 4. Market prices per day (pipeline health)
      prisma.$queryRaw<DailyCount[]>`
        SELECT DATE(snapshot_at) as day, COUNT(*)::bigint as count
        FROM market.market_prices
        WHERE snapshot_at >= ${since}
        GROUP BY DATE(snapshot_at)
        ORDER BY day
      `,

      // 5. Research findings per day
      prisma.$queryRaw<DailyCount[]>`
        SELECT DATE(created_at) as day, COUNT(*)::bigint as count
        FROM research.research_findings
        WHERE created_at >= ${since}
        GROUP BY DATE(created_at)
        ORDER BY day
      `,

      // 6. Audit log by action (top 20)
      prisma.$queryRaw<GroupCount[]>`
        SELECT action as key, COUNT(*)::bigint as count
        FROM governance.audit_logs
        WHERE created_at >= ${since}
        GROUP BY action
        ORDER BY count DESC
        LIMIT 20
      `,

      // 7. Contact events per day
      prisma.$queryRaw<DailyCount[]>`
        SELECT DATE(created_at) as day, COUNT(*)::bigint as count
        FROM crm.contact_events
        WHERE created_at >= ${since}
        GROUP BY DATE(created_at)
        ORDER BY day
      `,

      // 8. Contact events by type
      prisma.$queryRaw<GroupCount[]>`
        SELECT event_type as key, COUNT(*)::bigint as count
        FROM crm.contact_events
        WHERE created_at >= ${since}
        GROUP BY event_type
        ORDER BY count DESC
      `,

      // 9. Consent activity per day
      prisma.$queryRaw<DailyCount[]>`
        SELECT DATE(granted_at) as day, COUNT(*)::bigint as count
        FROM iam.user_consents
        WHERE granted_at >= ${since}
        GROUP BY DATE(granted_at)
        ORDER BY day
      `,

      // 10. Active markets count
      prisma.market.count({ where: { active: true } }),

      // 11. Total leads
      prisma.lead.count(),

      // 12. LLM runs by model
      prisma.$queryRaw<GroupCount[]>`
        SELECT model_name as key, COUNT(*)::bigint as count
        FROM ai.llm_runs
        WHERE created_at >= ${since}
        GROUP BY model_name
        ORDER BY count DESC
      `,
    ])

    const [
      leadGrowth,
      leadsBySource,
      leadsByLocale,
      pricesPerDay,
      findingsPerDay,
      auditByAction,
      eventsPerDay,
      eventsByType,
      consentsPerDay,
      activeMarkets,
      totalLeads,
      llmByModel,
    ] = await Promise.race([queries, timeout])

    // Cron health (from Redis)
    const cronHealth = await checkCronHealth().catch(() => ({
      healthy: false, lastUpdate: null, ageMs: -1,
    }))

    // Serialize BigInts
    const serializeDaily = (rows: DailyCount[]) =>
      rows.map(r => ({ day: String(r.day).split('T')[0], count: Number(r.count) }))

    const serializeGroup = (rows: GroupCount[]) =>
      rows.map(r => ({ key: r.key, count: Number(r.count) }))

    return NextResponse.json({
      period: { days, since: since.toISOString() },
      leads: {
        total: totalLeads,
        growth: serializeDaily(leadGrowth),
        bySource: serializeGroup(leadsBySource),
        byLocale: serializeGroup(leadsByLocale),
      },
      pipeline: {
        marketPricesPerDay: serializeDaily(pricesPerDay),
        researchFindingsPerDay: serializeDaily(findingsPerDay),
        activeMarkets,
        cronHealth: {
          redis: isKvAvailable(),
          ...cronHealth,
          ageSeconds: cronHealth.ageMs > 0 ? Math.round(cronHealth.ageMs / 1000) : null,
        },
      },
      engagement: {
        contactEventsPerDay: serializeDaily(eventsPerDay),
        contactEventsByType: serializeGroup(eventsByType),
        consentsPerDay: serializeDaily(consentsPerDay),
      },
      audit: {
        byAction: serializeGroup(auditByAction),
      },
      ai: {
        byModel: serializeGroup(llmByModel),
      },
    }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    })
  } catch (error) {
    console.error('[analytics] Error:', error)
    return NextResponse.json(
      { error: 'analytics_failed', message: error instanceof Error ? error.message : 'unknown' },
      { status: 500 }
    )
  }
}
