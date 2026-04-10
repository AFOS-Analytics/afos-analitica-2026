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
import { createSubscriber } from '../../lib/email/subscribers'
import { sendWelcomeEmail } from '../../lib/email/resend'
import { subscribeSchema } from '../../../lib/validations'
import { audit } from '../../../lib/audit'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod validation
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_email' },
        { status: 400 }
      )
    }

    const { email, _hp } = parsed.data

    // Honeypot check — bots preenchem campos ocultos
    if (_hp) {
      return NextResponse.json({ ok: true, isNew: false }, { status: 200 })
    }

    // Rate limit: 5 cadastros por IP por hora (Redis — efêmero)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken })
      const rateLimitKey = `afos:ratelimit:subscribe:${ip}`
      const attempts = await redis.incr(rateLimitKey)
      if (attempts === 1) await redis.expire(rateLimitKey, 3600)
      if (attempts > 5) {
        audit('rate_limited', 'subscribe', { ip })
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
      }
    }

    // Criar lead no Neon (idempotente)
    const userAgent = request.headers.get('user-agent') || undefined
    const locale = request.headers.get('accept-language')?.split(',')[0] || undefined

    const result = await createSubscriber(email, 'popup', { ip, userAgent, locale })

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error || 'internal_error' },
        { status: result.error === 'storage_unavailable' ? 503 : 500 }
      )
    }

    // Welcome email apenas para novos leads
    if (result.isNew) {
      sendWelcomeEmail(email).catch((err) => {
        console.error('[subscribe] Welcome email falhou:', err)
      })
    }

    return NextResponse.json(
      { ok: true, isNew: result.isNew },
      { status: 200, headers: { 'X-Content-Type-Options': 'nosniff' } }
    )
  } catch (error) {
    console.error('[subscribe] Erro:', error)
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    )
  }
}
