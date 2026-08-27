/**
 * POST /api/visitor/dismiss — Record popup dismissal (max 3).
 * Rate-limit: 10 calls per minute per visitorId (D+7 hardening).
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'
import { visitorDismissSchema } from '../../../../lib/validations'
import { MAX_POPUP_DISMISSALS } from '../../../../lib/visitor/constants'
import { isRateLimited } from '../../../../lib/rate-limit'

export async function POST(request: Request) {
  const prisma = getPrisma()
  if (!prisma) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorDismissSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_visitor_id' }, { status: 400 })

  // Rate limit: 10 dismiss calls per minute per visitorId (D+7 hardening).
  if (await isRateLimited(`afos:ratelimit:dismiss:${parsed.data.visitorId}`, 10, 60)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  try {
    const current = await prisma.visitorState.findUnique({
      where: { visitorId: parsed.data.visitorId },
      select: { popupDismissals: true },
    })

    if (!current || current.popupDismissals >= MAX_POPUP_DISMISSALS) {
      return NextResponse.json({ ok: true, popupDismissals: current?.popupDismissals ?? MAX_POPUP_DISMISSALS })
    }

    const updated = await prisma.visitorState.update({
      where: { visitorId: parsed.data.visitorId },
      data: { popupDismissals: { increment: 1 } },
      select: { popupDismissals: true },
    })

    return NextResponse.json({ ok: true, popupDismissals: updated.popupDismissals })
  } catch (error) {
    console.error('[visitor/dismiss] Error:', error)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
