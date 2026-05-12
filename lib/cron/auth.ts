import { NextResponse } from 'next/server'

/**
 * Validates Bearer CRON_SECRET on the request. Returns null when authorized
 * (caller proceeds) or a 401 response when not (caller returns it directly).
 *
 * The bypass via `x-vercel-cron` header was removed after audit: if Vercel
 * ever stopped stripping that header on inbound public requests, anyone could
 * forge a cron run. Bearer-only is the safer default.
 *
 * In non-Vercel envs (`process.env.VERCEL` unset = local dev) auth is bypassed
 * so scripts can hit the route without setting headers.
 */
export function requireCronAuth(request: Request): NextResponse | null {
  if (!process.env.VERCEL) return null
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
