import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

/** Comparação constant-time de strings (evita side-channel de timing). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/**
 * Validates Bearer CRON_SECRET on the request. Returns null when authorized
 * (caller proceeds) or a 401 response when not (caller returns it directly).
 *
 * The bypass via `x-vercel-cron` header was removed after audit: if Vercel
 * ever stopped stripping that header on inbound public requests, anyone could
 * forge a cron run. Bearer-only is the safer default.
 *
 * Auth é exigida sempre que CRON_SECRET estiver configurado (qualquer host:
 * Vercel, staging ou outro provedor). O bypass só vale em dev local sem segredo
 * configurado, para scripts baterem na rota sem header. Isso substitui o antigo
 * `!process.env.VERCEL` (que desligava a auth em qualquer host não-Vercel).
 *
 * EVAL 06/Jun: a comparação agora é constant-time (timingSafeEqual), consistente
 * com os /api/admin/* (antes era `!==`, side-channel de timing no mesmo segredo que
 * protege endpoints de deleção/LGPD).
 */
export function requireCronAuth(request: Request): NextResponse | null {
  if (!process.env.CRON_SECRET) return null
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || !authHeader || !safeEqual(authHeader, `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
