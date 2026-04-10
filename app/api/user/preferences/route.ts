/**
 * API Route: POST /api/user/preferences
 *
 * Persiste preferência do usuário no banco (iam.user_preferences).
 * Identifica usuário por email. Cria user se não existe (upsert).
 * Uso principal: salvar locale preferido.
 */

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { savePreferenceSchema } from '../../../../lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = savePreferenceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_input' },
        { status: 400 }
      )
    }

    const { email, key, value } = parsed.data

    if (!prisma) {
      return NextResponse.json({ ok: false, error: 'database_unavailable' }, { status: 503 })
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    })

    // Upsert preference
    await prisma.userPreference.upsert({
      where: { userId_key: { userId: user.id, key } },
      update: { value },
      create: { userId: user.id, key, value },
    })

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: { 'X-Content-Type-Options': 'nosniff' } }
    )
  } catch (error) {
    console.error('[preferences] Erro:', error)
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    )
  }
}
