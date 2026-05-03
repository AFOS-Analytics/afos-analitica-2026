/**
 * API Route: POST /api/admin/data-request
 *
 * Operações LGPD: criar pedido de exclusão, processar exclusão, exportar dados.
 * Auth: Bearer CRON_SECRET (timing-safe).
 * Anti-enumeration: sempre retorna 200 (não revela se email existe).
 */

import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { Redis } from '@upstash/redis'
import { prisma } from '../../../../lib/db'
import { anonymizeUser, exportUserData, processDeletionRequest } from '../../../../lib/governance/data-lifecycle'
import { audit } from '../../../../lib/audit'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch { return false }
}

const ALLOWED_ORIGINS = ['https://www.afos-analytics.com', 'https://afos-analytics.com']

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  // Origin whitelist (cron e Postman não enviam origin → passam)
  const origin = request.headers.get('origin')
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    audit('origin_rejected', 'api.admin.data-request', 'n/a', { ip, actorId: origin })
    return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 })
  }

  // Bearer auth (timing-safe)
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  const authHeader = request.headers.get('authorization') || ''
  if (!safeCompare(authHeader, `Bearer ${secret}`)) {
    audit('auth_failure', 'api.admin.data-request', 'n/a', { ip })
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Rate limit defensivo (defesa em profundidade): 30 req/min por IP
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    const redis = new Redis({ url: redisUrl, token: redisToken })
    const key = `afos:ratelimit:admin:data-request:${ip}`
    const attempts = await redis.incr(key)
    if (attempts === 1) await redis.expire(key, 60)
    if (attempts > 30) {
      audit('rate_limited', 'api.admin.data-request', ip, { ip })
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    }
  }

  // Parse body
  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const type = typeof body.type === 'string' ? body.type : ''

  if (!email || !type) {
    return NextResponse.json({ error: 'email and type required' }, { status: 400 })
  }

  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  // ─── Create deletion request ─────────────────────────────────
  if (type === 'deletion') {
    // Idempotente: se já existe pending/completed, retorna sucesso
    const existing = await prisma.deletionRequest.findFirst({
      where: { email, status: { in: ['pending', 'completed'] } },
      select: { id: true, status: true },
    })

    if (existing) {
      return NextResponse.json({ status: 'accepted', requestId: existing.id, note: existing.status })
    }

    const req = await prisma.deletionRequest.create({
      data: { email, requestType: 'lgpd_art18_deletion', status: 'pending' },
      select: { id: true },
    })

    audit('deletion_requested', 'governance.deletion_requests', req.id)

    // Anti-enumeration: always 200
    return NextResponse.json({ status: 'accepted', requestId: req.id })
  }

  // ─── Process deletion request ────────────────────────────────
  if (type === 'process') {
    const pending = await prisma.deletionRequest.findFirst({
      where: { email, status: 'pending' },
      select: { id: true },
    })

    if (!pending) {
      return NextResponse.json({ status: 'no_pending_request' })
    }

    const result = await processDeletionRequest(pending.id)

    return NextResponse.json({
      status: result.success ? 'completed' : 'failed',
      error: result.error,
    })
  }

  // ─── Export user data ────────────────────────────────────────
  if (type === 'export') {
    const result = await exportUserData(email)

    if (!result.success) {
      return NextResponse.json({ status: 'failed', error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      status: 'exported',
      data: result.data,
    })
  }

  return NextResponse.json({ error: 'invalid type (deletion, process, export)' }, { status: 400 })
}
