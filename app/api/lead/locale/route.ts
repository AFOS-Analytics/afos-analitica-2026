/**
 * POST /api/lead/locale — Capture preferred locale from /welcome screen.
 *
 * Auth: signup_session_id cookie (set by /api/subscribe on success).
 * Cookie payload (in Redis) carries { email, leadId } → server resolves
 * lead WITHOUT trusting client-supplied email.
 *
 * Idempotent: re-clicking another language overwrites preferredLocale.
 */

import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { prisma } from '../../../../lib/db'
import { audit } from '../../../../lib/audit'
import { locales } from '../../../../lib/i18n/config'

const VALID_LOCALES = locales as readonly string[]

interface SignupSession {
  email: string
  leadId: string
  createdAt: number
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ ok: false, error: 'storage_unavailable' }, { status: 503 })

  const sessionId = request.headers.get('cookie')?.match(/signup_session_id=([a-f0-9]+)/)?.[1]
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: 'no_session' }, { status: 401 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }
  const locale = (body as { locale?: unknown })?.locale
  if (typeof locale !== 'string' || !VALID_LOCALES.includes(locale)) {
    return NextResponse.json({ ok: false, error: 'invalid_locale' }, { status: 400 })
  }

  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!redisUrl || !redisToken) {
    return NextResponse.json({ ok: false, error: 'session_unavailable' }, { status: 503 })
  }

  const redis = new Redis({ url: redisUrl, token: redisToken })
  const sessionRaw = await redis.get<string | SignupSession>(`afos:signup-session:${sessionId}`)
  if (!sessionRaw) {
    return NextResponse.json({ ok: false, error: 'session_expired' }, { status: 401 })
  }

  const session: SignupSession = typeof sessionRaw === 'string' ? JSON.parse(sessionRaw) : sessionRaw
  if (!session?.leadId) {
    return NextResponse.json({ ok: false, error: 'invalid_session' }, { status: 401 })
  }

  try {
    await prisma.lead.update({
      where: { id: session.leadId },
      data: { preferredLocale: locale },
    })
    audit('lead_locale_set', 'crm.leads', session.leadId, { actorType: 'user', actorId: locale })
    return NextResponse.json({ ok: true, locale })
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'lead_not_found' }, { status: 404 })
    }
    console.error('[lead/locale] update failed:', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
