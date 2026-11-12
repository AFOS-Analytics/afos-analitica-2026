/**
 * POST /api/visitor/migrate
 *
 * One-time migration: marks a visitor as subscribed when they have
 * the old localStorage flag but no backend record.
 * Called automatically by useVisitorState on first load.
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'
import { visitorStateSchema } from '../../../../lib/validations'
import { isRateLimited } from '../../../../lib/rate-limit'
import { clientIp } from '../../../../lib/net/client-ip'

export async function POST(request: Request) {
  const prisma = getPrisma()
  if (!prisma) return NextResponse.json({ ok: false }, { status: 503 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const parsed = visitorStateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  // 🔴 Freio POR IP, além do por visitorId. O visitorId vem do corpo e o
  // cliente escolhe: com um UUID novo a cada chamada o contador por visitorId
  // fica sempre em 1 e não freia nada. A chave é a mesma nas quatro rotas de
  // visitante (state, migrate, dismiss, session).
  if (await isRateLimited(`afos:ratelimit:visitor:ip:${clientIp(request.headers)}`, 60, 60)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  // Rate-limit (EVAL 06/Jun): rota era unauthenticated + sem throttle = amplificador de
  // escrita no Neon. 10 chamadas/min por visitorId, mesmo guard do /dismiss.
  if (await isRateLimited(`afos:ratelimit:migrate:${parsed.data.visitorId}`, 10, 60)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  try {
    // Semântica de migração (EVAL 06/Jun): create-if-absent ATÔMICO via upsert com update vazio.
    // O `update: {}` garante que um registro JÁ existente NÃO é sobrescrito — fecha o vetor de
    // "flipar qualquer visitorId para subscribed=true". E por ser upsert é race-safe (sem P2002
    // em requests concorrentes, ao contrário de findUnique+create).
    await prisma.visitorState.upsert({
      where: { visitorId: parsed.data.visitorId },
      create: { visitorId: parsed.data.visitorId, subscribed: true, subscribedAt: new Date() },
      update: {},
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[visitor/migrate] Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
