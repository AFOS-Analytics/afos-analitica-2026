/**
 * POST /api/visitor/state — Get or create visitor state.
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { visitorStateSchema } from '../../../../lib/validations'
import { computeEligible, shouldShowPopup } from '../../../../lib/visitor/constants'

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorStateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_visitor_id' }, { status: 400 })

  try {
    const s = await prisma.visitorState.upsert({
      where: { visitorId: parsed.data.visitorId },
      create: { visitorId: parsed.data.visitorId },
      update: {},
      select: { qualifiedSessions: true, popupDismissals: true, subscribed: true },
    })

    return NextResponse.json({
      ok: true,
      state: {
        qualifiedSessions: s.qualifiedSessions,
        popupDismissals: s.popupDismissals,
        subscribed: s.subscribed,
        eligible: computeEligible(s.qualifiedSessions, s.subscribed),
        showPopup: shouldShowPopup(s.qualifiedSessions, s.popupDismissals, s.subscribed),
      },
    }, { headers: { 'X-Content-Type-Options': 'nosniff' } })
  } catch (error) {
    console.error('[visitor/state] Error:', error)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
