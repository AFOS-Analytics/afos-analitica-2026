/**
 * API Route: POST /api/subscribe
 *
 * Cadastra lead no Neon (crm.leads).
 * Idempotente: se email já existe, retorna sucesso sem duplicar.
 * Rate limiting permanece no Redis (efêmero, atômico).
 * Contrato de request/response inalterado para o EmailPopup.
 */

import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { randomBytes } from 'crypto'
import { createSubscriber } from '../../lib/email/subscribers'
import { sendWelcomeEmail } from '../../lib/email/resend'
import { subscribeSchema } from '../../../lib/validations'
import { clientIp } from '../../../lib/net/client-ip'
import { audit } from '../../../lib/audit'
import { locales } from '../../../lib/i18n/config'

const VALID_LOCALES = locales as readonly string[]
const SIGNUP_SESSION_TTL_SECONDS = 3600 // 1h — TTL for /welcome screen access

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
    }

    // Zod validation
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_email' },
        { status: 400 }
      )
    }

    const { email, _hp, visitorId, captureSource } = parsed.data

    // Honeypot check — bots preenchem campos ocultos
    if (_hp) {
      return NextResponse.json({ ok: true, isNew: false }, { status: 200 })
    }

    // Rate limit: 5 cadastros por IP por hora (Redis — efêmero)
    const ip = clientIp(request.headers)
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken })
      const rateLimitKey = `afos:ratelimit:subscribe:${ip}`
      const attempts = await redis.incr(rateLimitKey)
      if (attempts === 1) await redis.expire(rateLimitKey, 3600)
      if (attempts > 5) {
        audit('rate_limited', 'api.subscribe', ip, { ip })
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
      }
    }

    // Criar lead no Neon (idempotente)
    const userAgent = request.headers.get('user-agent') || undefined
    const rawLocale = request.headers.get('accept-language')?.split(',')[0]?.split(';')[0]?.trim()
    const locale = rawLocale && VALID_LOCALES.includes(rawLocale) ? rawLocale : 'pt-BR'

    const result = await createSubscriber(email, captureSource || 'popup', { ip, userAgent, locale })

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error || 'internal_error' },
        { status: result.error === 'storage_unavailable' ? 503 : 500 }
      )
    }

    // Welcome email apenas para novos leads, com token de unsubscribe one-click
    if (result.isNew) {
      sendWelcomeEmail(email, result.unsubscribeToken).catch((err) => {
        console.error('[subscribe] Welcome email falhou:', err)
      })
    }

    // Vincular visitor_state ao lead (fire-and-forget)
    if (visitorId && result.leadId) {
      const { prisma: db } = await import('../../../lib/db')
      if (db) {
        db.visitorState.upsert({
          where: { visitorId },
          create: { visitorId, subscribed: true, subscribedAt: new Date(), leadId: result.leadId },
          update: { subscribed: true, subscribedAt: new Date(), leadId: result.leadId },
        }).catch((err) => {
          console.error('[subscribe] visitor_state update failed:', err)
        })
      }
    }

    // Set signup session cookie — grants temporary access to /welcome screen
    // for locale capture (TTL 1h). Stored server-side in Redis with email payload.
    let signupSessionId: string | null = null
    if (redisUrl && redisToken && result.leadId) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken })
        signupSessionId = randomBytes(24).toString('hex')
        await redis.set(
          `afos:signup-session:${signupSessionId}`,
          JSON.stringify({ email, leadId: result.leadId, createdAt: Date.now() }),
          { ex: SIGNUP_SESSION_TTL_SECONDS }
        )
      } catch (err) {
        console.error('[subscribe] signup session cookie set failed:', err)
      }
    }

    const response = NextResponse.json(
      { ok: true, isNew: result.isNew },
      { status: 200, headers: { 'X-Content-Type-Options': 'nosniff' } }
    )
    if (signupSessionId) {
      response.cookies.set('signup_session_id', signupSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SIGNUP_SESSION_TTL_SECONDS,
        path: '/',
      })
    }
    return response
  } catch (error) {
    console.error('[subscribe] Erro:', error)
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    )
  }
}
