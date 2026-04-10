/**
 * API Route: POST /api/user/preferences
 *
 * Persiste preferências do usuário no banco (iam.user_preferences).
 * Identifica usuário por email. Cria user se não existe (upsert).
 */

import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { prisma } from '../../../../lib/db'
import { savePreferenceSchema } from '../../../../lib/validations'
import { audit } from '../../../../lib/audit'
import { locales } from '../../../../lib/i18n/config'

const VALID_KEYS = ['locale', 'timezone', 'marketing_opt_in'] as const
const VALID_LOCALES = locales as readonly string[]

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = savePreferenceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'invalid_input' }, { status: 400 })
    }

    const { email, key, value } = parsed.data

    if (!VALID_KEYS.includes(key as typeof VALID_KEYS[number])) {
      return NextResponse.json({ ok: false, error: 'invalid_key' }, { status: 400 })
    }

    if (key === 'locale' && !VALID_LOCALES.includes(value)) {
      return NextResponse.json({ ok: false, error: 'invalid_locale' }, { status: 400 })
    }

    // Rate limit: 10/min por IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken })
      const rlKey = `afos:ratelimit:preferences:${ip}`
      const attempts = await redis.incr(rlKey)
      if (attempts === 1) await redis.expire(rlKey, 60)
      if (attempts > 10) {
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
      }
    }

    if (!prisma) {
      return NextResponse.json({ ok: false, error: 'database_unavailable' }, { status: 503 })
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    })

    const updateData: Record<string, unknown> = {}
    if (key === 'locale') updateData.locale = value
    else if (key === 'timezone') updateData.timezone = value
    else if (key === 'marketing_opt_in') updateData.marketingOptIn = value === 'true'

    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: updateData,
      create: { userId: user.id, ...updateData },
    })

    audit('preference_updated', 'iam.user_preferences', user.id, { after: { key, value }, ip })

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: { 'X-Content-Type-Options': 'nosniff' } }
    )
  } catch (error) {
    console.error('[preferences] Erro:', error)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
