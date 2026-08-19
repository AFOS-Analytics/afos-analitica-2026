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
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    // 🔴 FALHA FECHADA em produção. Antes, segredo ausente devolvia `null` e a
    // rota ABRIA: uma variável de ambiente esquecida num deploy transformava
    // toda rota de cron, que grava, apaga e purga, em endpoint público, e nada
    // no comportamento denunciava isso. A validação de lib/env.ts não cobre
    // este caminho, então a defesa tem de estar aqui.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'cron_secret_not_configured' }, { status: 503 })
    }
    // Só em dev local, para script bater na rota sem cabeçalho.
    return null
  }
  const authHeader = request.headers.get('authorization')
  if (!cronSecret || !authHeader || !safeEqual(authHeader, `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
