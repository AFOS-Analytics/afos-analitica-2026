/**
 * POST /api/visitor/migrate
 *
 * One-time migration: marks a visitor as subscribed when they have
 * the old localStorage flag but no backend record.
 * Called automatically by useVisitorState on first load.
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { visitorStateSchema } from '../../../../lib/validations'

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ ok: false }, { status: 503 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const parsed = visitorStateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  try {
    await prisma.visitorState.upsert({
      where: { visitorId: parsed.data.visitorId },
      create: { visitorId: parsed.data.visitorId, subscribed: true, subscribedAt: new Date() },
      update: { subscribed: true, subscribedAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[visitor/migrate] Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
