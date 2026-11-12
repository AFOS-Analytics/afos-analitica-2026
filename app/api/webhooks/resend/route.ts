/**
 * Resend Webhook: bounces, complaints, deliveries.
 * https://resend.com/docs/dashboard/webhooks/introduction
 *
 * Configurar em Resend Dashboard:
 * - URL: https://www.afos-analytics.com/api/webhooks/resend
 * - Events: email.bounced, email.complained, email.delivery_delayed
 * - Signing secret: RESEND_WEBHOOK_SECRET (env, prefixo "whsec_")
 *
 * Verificação de assinatura HMAC-SHA256 manual (Svix-compatible),
 * sem dependência adicional.
 */

import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { Redis } from '@upstash/redis'
import { markBouncedByEmail, unsubscribeByEmail, incrementSoftBounce, resetSoftBounce } from '../../../lib/email/subscribers'
import { audit } from '../../../../lib/audit'

const SOFT_BOUNCE_THRESHOLD = 5

interface ResendEvent {
  type: 'email.bounced' | 'email.complained' | 'email.delivered' | 'email.delivery_delayed' | string
  data: {
    email_id?: string
    to?: string[] | string
    bounce?: { type?: string; subType?: string; message?: string }
    complaint?: { type?: string }
  }
}

function safeCompareB64(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'base64')
    const bufB = Buffer.from(b, 'base64')
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch { return false }
}

function verifySvixSignature(secret: string, id: string, timestamp: string, body: string, signatureHeader: string): boolean {
  // Secret format: "whsec_<base64>" — decodifica payload
  const rawSecret = secret.startsWith('whsec_') ? Buffer.from(secret.slice(6), 'base64') : Buffer.from(secret)
  const signedPayload = `${id}.${timestamp}.${body}`
  const computed = createHmac('sha256', rawSecret).update(signedPayload).digest('base64')

  // signatureHeader: "v1,abc... v1,def..." (espaço entre versões)
  const signatures = signatureHeader.split(' ')
  return signatures.some((s) => {
    const [version, sig] = s.split(',')
    return version === 'v1' && sig && safeCompareB64(sig, computed)
  })
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[resend-webhook] RESEND_WEBHOOK_SECRET não configurado')
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 })
  }

  const svixId = request.headers.get('svix-id') || ''
  const svixTimestamp = request.headers.get('svix-timestamp') || ''
  const svixSignature = request.headers.get('svix-signature') || ''
  const body = await request.text()

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'missing_headers' }, { status: 400 })
  }

  // Reject replay attacks: timestamp deve estar dentro de 5 minutos
  const ts = Number(svixTimestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
    return NextResponse.json({ error: 'stale_timestamp' }, { status: 400 })
  }

  if (!verifySvixSignature(secret, svixId, svixTimestamp, body, svixSignature)) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  // D+7 hardening: dedup by svix-id (24h TTL). Resend retries up to 5 times on non-2xx;
  // without dedup, audit log gets polluted and Prisma updates re-run unnecessarily.
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  const dedupKey = `afos:svix-dedup:${svixId}`
  const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null
  if (redis) {
    // SET NX with 24h TTL — returns 'OK' if first time, null if already seen.
    const firstTime = await redis.set(dedupKey, '1', { ex: 86400, nx: true })
    if (!firstTime) {
      return NextResponse.json({ ok: true, dedup: true })
    }
  }

  // 🔴 FALHA DEVOLVE 500 E SOLTA O DEDUP. Antes, os helpers engoliam o erro do
  // banco ({ success: false }), a rota respondia 200 e o Resend nunca reenviava;
  // e se algo lançasse, a retentativa caía no dedup de 24h. Nos dois casos o
  // bounce ou a reclamação se perdia e o lead seguia 'active'. Agora a chave de
  // dedup é apagada e o 500 faz o Resend tentar de novo.
  const falhar = async (motivo: string) => {
    console.error('[resend-webhook] Evento NAO aplicado, pedindo retentativa:', motivo)
    if (redis) {
      try { await redis.del(dedupKey) } catch (err) { console.error('[resend-webhook] dedup nao liberado:', err) }
    }
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 })
  }

  let event: ResendEvent
  try {
    event = JSON.parse(body) as ResendEvent
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const recipient = Array.isArray(event.data?.to) ? event.data.to[0] : event.data?.to
  if (!recipient) {
    return NextResponse.json({ ok: true, ignored: 'no_recipient' })
  }

  try {
    if (event.type === 'email.bounced') {
      const bounceType = (event.data.bounce?.type || 'unknown').toLowerCase()
      if (bounceType === 'hard' || bounceType === 'permanent') {
        const r = await markBouncedByEmail(recipient, bounceType)
        if (!r.success) return await falhar('mark_bounced')
        audit('email_hard_bounce', 'crm.leads', recipient, { actorType: 'resend' })
        return NextResponse.json({ ok: true, type: bounceType })
      }
      // D+7 hardening: soft bounce tracking. Increment counter; mark as bounced
      // after 5 consecutive soft bounces. A successful delivery resets the counter.
      const result = await incrementSoftBounce(recipient, SOFT_BOUNCE_THRESHOLD)
      if (result.erro) return await falhar('soft_bounce')
      audit('email_soft_bounce', 'crm.leads', recipient, { actorType: 'resend', actorId: `count=${result.count}` })
      if (result.markedBounced) {
        audit('email_bounced_threshold', 'crm.leads', recipient, { actorType: 'system' })
      }
      return NextResponse.json({ ok: true, type: bounceType, softBounceCount: result.count, markedBounced: result.markedBounced })
    }

    if (event.type === 'email.delivered') {
      // D+7 hardening: reset soft bounce counter on successful delivery.
      const r = await resetSoftBounce(recipient)
      if (!r.success) return await falhar('reset_soft_bounce')
      return NextResponse.json({ ok: true, type: 'delivered' })
    }

    if (event.type === 'email.complained') {
      // Status PRÓPRIO ('complained'), para o formulário público não reativar.
      const r = await unsubscribeByEmail(recipient, 'complained')
      if (!r.success) return await falhar('complaint')
      audit('email_complaint', 'crm.leads', recipient, { actorType: 'resend' })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true, ignored: event.type })
  } catch (error) {
    console.error('[resend-webhook] Erro processando evento:', error)
    return await falhar('excecao')
  }
}
