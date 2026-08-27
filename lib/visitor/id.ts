/** Client-side visitor ID management (cookie + localStorage). */

import { VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE, VISITOR_LS_KEY } from './constants'

function setCookie(id: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE}; SameSite=Lax`
}

/**
 * 🔴 O valor guardado tem que ser CONFERIDO, não só lido. Medido em
 * 27/Ago/2026: o cookie e o localStorage eram devolvidos como vieram, e o
 * servidor exige UUID. Um valor corrompido, truncado ou de formato antigo
 * fazia o cadastro ser rejeitado com "Insira um email válido", **para sempre
 * naquele aparelho**, porque o valor ruim era relido a cada tentativa.
 * Conferindo aqui, um valor ruim se auto-corrige na primeira visita.
 */
function ehUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''

  // Try cookie
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]+)`))
  if (match?.[1] && ehUuid(match[1])) return match[1]

  // Try localStorage
  try {
    const stored = localStorage.getItem(VISITOR_LS_KEY)
    if (stored && ehUuid(stored)) { setCookie(stored); return stored }
  } catch {}

  // Generate new
  const id = crypto.randomUUID()
  setCookie(id)
  try { localStorage.setItem(VISITOR_LS_KEY, id) } catch {}
  return id
}
