/**
 * POST /api/visitor/session
 *
 * Register a qualified session (30s + interaction).
 * Idempotent per session via Redis dedup key (30min TTL).
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { visitorSessionSchema } from '../../../../lib/validations'

const MIN_DURATION_MS = 30_000
const SESSION_DEDUP_TTL = 1800 // 30 minutes

async function isSessionAlreadyCounted(visitorId: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return false

  try {
    const key = `afos:session:active:${visitorId}`
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return false
    const data = await res.json()
    return data?.result !== null
  } catch { return false }
}

async function markSessionCounted(visitorId: string): Promise<void> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return

  try {
    const key = `afos:session:active:${visitorId}`
    await fetch(`${url}/set/${key}/1/ex/${SESSION_DEDUP_TTL}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {}
}

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorSessionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_data' }, { status: 400 })
  }

  const { visitorId, durationMs, hasInteraction } = parsed.data

  // Not qualified
  if (durationMs < MIN_DURATION_MS || !hasInteraction) {
    return NextResponse.json({ ok: true, counted: false, reason: 'not_qualified' })
  }

  // Dedup: already counted this session
  if (await isSessionAlreadyCounted(visitorId)) {
    return NextResponse.json({ ok: true, counted: false, reason: 'already_counted' })
  }

  try {
    const state = await prisma.visitorState.upsert({
      where: { visitorId },
      create: { visitorId, qualifiedSessions: 1, lastSessionAt: new Date() },
      update: {
        qualifiedSessions: { increment: 1 },
        lastSessionAt: new Date(),
      },
      select: { qualifiedSessions: true, subscribed: true, popupDismissals: true },
    })

    await markSessionCounted(visitorId)

    const eligible = state.subscribed ? 'subscribed' : state.qualifiedSessions >= 3 ? 'gate' : 'free'
    const showPopup = !state.subscribed && state.qualifiedSessions < 3 && state.popupDismissals < 3

    return NextResponse.json({
      ok: true,
      counted: true,
      state: {
        qualifiedSessions: state.qualifiedSessions,
        subscribed: state.subscribed,
        eligible,
        showPopup,
      },
    })
  } catch (error) {
    console.error('[visitor/session] Error:', error)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
