/**
 * POST /api/visitor/state — Get or create visitor state.
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'
import { visitorStateSchema } from '../../../../lib/validations'
import { computeEligible, shouldShowPopup } from '../../../../lib/visitor/constants'
import { isRateLimited } from '../../../../lib/rate-limit'
import { clientIp } from '../../../../lib/net/client-ip'

export async function POST(request: Request) {
  const prisma = getPrisma()
  if (!prisma) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const parsed = visitorStateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid_visitor_id' }, { status: 400 })

  // 🔴 Limite de taxa, que as rotas IRMÃS já tinham e esta não. `dismiss` e
  // `migrate` limitam por visitorId; esta CRIA linha no banco para qualquer UUID
  // que chegue, e era a única das três sem freio. Assimetria de proteção entre
  // rotas irmãs é o defeito, não a ausência em si.
  // 🔴 Freio POR IP, além do por visitorId. O visitorId vem do corpo e o
  // cliente escolhe: com um UUID novo a cada chamada o contador por visitorId
  // fica sempre em 1 e não freia nada. A chave é a mesma nas quatro rotas de
  // visitante (state, migrate, dismiss, session).
  if (await isRateLimited(`afos:ratelimit:visitor:ip:${clientIp(request.headers)}`, 60, 60)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  if (await isRateLimited(`afos:ratelimit:state:${parsed.data.visitorId}`, 30, 60)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

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
