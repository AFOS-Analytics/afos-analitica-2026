/**
 * /welcome — Post-signup confirmation + locale capture screen.
 *
 * Trigger: only renders for visitors with a valid signup_session_id cookie
 * set by /api/subscribe on successful submission. Without cookie, redirects
 * gracefully to /en (no error page).
 *
 * UX: brand reinforcement + 3 language picker buttons (PT/EN/ES with flags).
 * Click → POST /api/lead/locale → redirect to /{locale}/dashboard/br.
 *
 * Dashboard + Daily CTAs kept above fold (user request).
 */
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { defaultLocale } from '../../lib/i18n/config'
import { Redis } from '@upstash/redis'
import WelcomeClient from './WelcomeClient'

export const metadata: Metadata = {
  title: 'Welcome — AFOS Analytics',
  description: 'Choose your language to receive AFOS Daily',
  robots: { index: false, follow: false },
}

interface SignupSession {
  email: string
  leadId: string
  createdAt: number
}

async function validateSignupSession(sessionId: string | undefined): Promise<SignupSession | null> {
  if (!sessionId) return null
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!redisUrl || !redisToken) return null
  try {
    const redis = new Redis({ url: redisUrl, token: redisToken })
    const raw = await redis.get<string | SignupSession>(`afos:signup-session:${sessionId}`)
    if (!raw) return null
    const session: SignupSession = typeof raw === 'string' ? JSON.parse(raw) : raw
    return session?.leadId ? session : null
  } catch {
    return null
  }
}

export default async function WelcomePage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('signup_session_id')?.value
  const session = await validateSignupSession(sessionId)

  if (!session) {
    // 🔴 Caia no PADRAO DA CASA, nao no ingles cru. O cookie de sessao so e
    // gravado quando o Redis responde, entao um soluco do Redis fazia um
    // cadastro BEM-SUCEDIDO terminar numa landing em ingles, sem explicacao e
    // sem a escolha de idioma. Medido em 27/Ago/2026, com a base 100% pt-BR.
    redirect(`/${defaultLocale}`)
  }

  return <WelcomeClient email={session.email} />
}
