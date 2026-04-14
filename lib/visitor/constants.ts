/** Single source of truth for visitor/lead capture system constants. */

export const VISITOR_COOKIE = 'afos_visitor_id'
export const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year
export const VISITOR_LS_KEY = 'afos_visitor_id'
export const SUBSCRIBED_LS_KEY = 'afos_popup_subscribed'

export const SESSION_GATE_THRESHOLD = 3
export const MAX_POPUP_DISMISSALS = 3
export const SESSION_MIN_DURATION_MS = 30_000
export const SESSION_DEDUP_TTL = 1800 // 30 min
export const POPUP_SHOW_DELAY_MS = 30_000

export type Eligible = 'free' | 'gate' | 'subscribed'

export function computeEligible(sessions: number, subscribed: boolean): Eligible {
  if (subscribed) return 'subscribed'
  if (sessions >= SESSION_GATE_THRESHOLD) return 'gate'
  return 'free'
}

export function shouldShowPopup(sessions: number, dismissals: number, subscribed: boolean): boolean {
  return !subscribed && sessions < SESSION_GATE_THRESHOLD && dismissals < MAX_POPUP_DISMISSALS
}
