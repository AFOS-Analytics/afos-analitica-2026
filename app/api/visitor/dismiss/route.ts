/**
 * POST /api/visitor/dismiss
 *
 * Record popup dismissal. Caps at 3 total.
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { visitorDismissSchema } from '../../../../lib/validations'

const MAX_DISMISSALS = 3

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorDismissSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_visitor_id' }, { status: 400 })
  }

  const { visitorId } = parsed.data

  try {
    const current = await prisma.visitorState.findUnique({
      where: { visitorId },
      select: { popupDismissals: true },
    })

    if (!current || current.popupDismissals >= MAX_DISMISSALS) {
      return NextResponse.json({ ok: true, popupDismissals: current?.popupDismissals ?? MAX_DISMISSALS })
    }

    const updated = await prisma.visitorState.update({
      where: { visitorId },
      data: { popupDismissals: { increment: 1 } },
      select: { popupDismissals: true },
    })

    return NextResponse.json({ ok: true, popupDismissals: updated.popupDismissals })
  } catch (error) {
    console.error('[visitor/dismiss] Error:', error)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
