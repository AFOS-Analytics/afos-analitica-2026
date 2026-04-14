/**
 * POST /api/visitor/state
 *
 * Get or create visitor state. Called on page load.
 * Returns eligibility: 'free' | 'gate' | 'subscribed'
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { visitorStateSchema } from '../../../../lib/validations'

type Eligible = 'free' | 'gate' | 'subscribed'

function computeEligible(sessions: number, subscribed: boolean): Eligible {
  if (subscribed) return 'subscribed'
  if (sessions >= 3) return 'gate'
  return 'free'
}

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorStateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_visitor_id' }, { status: 400 })
  }

  const { visitorId } = parsed.data

  try {
    const state = await prisma.visitorState.upsert({
      where: { visitorId },
      create: { visitorId },
      update: {},
      select: {
        qualifiedSessions: true,
        popupDismissals: true,
        subscribed: true,
      },
    })

    const eligible = computeEligible(state.qualifiedSessions, state.subscribed)
    const showPopup = !state.subscribed && state.qualifiedSessions < 3 && state.popupDismissals < 3

    return NextResponse.json({
      ok: true,
      state: {
        qualifiedSessions: state.qualifiedSessions,
        popupDismissals: state.popupDismissals,
        subscribed: state.subscribed,
        eligible,
        showPopup,
      },
    }, { headers: { 'X-Content-Type-Options': 'nosniff' } })
  } catch (error) {
    console.error('[visitor/state] Error:', error)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
