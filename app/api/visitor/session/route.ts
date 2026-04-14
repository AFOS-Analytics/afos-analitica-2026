/**
 * POST /api/visitor/session — Register a qualified session.
 * Atomic dedup via Redis SET NX.
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { visitorSessionSchema } from '../../../../lib/validations'
import { computeEligible, shouldShowPopup, SESSION_MIN_DURATION_MS, SESSION_DEDUP_TTL } from '../../../../lib/visitor/constants'

async function tryClaimSession(visitorId: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return true

  try {
    const res = await fetch(`${url}/set/afos:session:active:${visitorId}/1/ex/${SESSION_DEDUP_TTL}/nx`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return true
    const data = await res.json()
    return data?.result === 'OK'
  } catch (err) {
    console.warn('[visitor/session] Redis dedup error:', err instanceof Error ? err.message : err)
    return true
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorSessionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_data' }, { status: 400 })

  const { visitorId, durationMs, hasInteraction } = parsed.data

  if (durationMs < SESSION_MIN_DURATION_MS || !hasInteraction) {
    return NextResponse.json({ ok: true, counted: false, reason: 'not_qualified' })
  }

  if (!(await tryClaimSession(visitorId))) {
    return NextResponse.json({ ok: true, counted: false, reason: 'already_counted' })
  }

  try {
    const s = await prisma.visitorState.upsert({
      where: { visitorId },
      create: { visitorId, qualifiedSessions: 1, lastSessionAt: new Date() },
      update: { qualifiedSessions: { increment: 1 }, lastSessionAt: new Date() },
      select: { qualifiedSessions: true, subscribed: true, popupDismissals: true },
    })

    return NextResponse.json({
      ok: true, counted: true,
      state: {
        qualifiedSessions: s.qualifiedSessions,
        subscribed: s.subscribed,
        eligible: computeEligible(s.qualifiedSessions, s.subscribed),
        showPopup: shouldShowPopup(s.qualifiedSessions, s.popupDismissals, s.subscribed),
      },
    })
  } catch (error) {
    console.error('[visitor/session] Error:', error)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
