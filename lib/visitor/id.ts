/** Client-side visitor ID management (cookie + localStorage). */

import { VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE, VISITOR_LS_KEY } from './constants'

function setCookie(id: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''

  // Try cookie
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]+)`))
  if (match?.[1]) return match[1]

  // Try localStorage
  try {
    const stored = localStorage.getItem(VISITOR_LS_KEY)
    if (stored) { setCookie(stored); return stored }
  } catch {}

  // Generate new
  const id = crypto.randomUUID()
  setCookie(id)
  try { localStorage.setItem(VISITOR_LS_KEY, id) } catch {}
  return id
}
