/**
 * Subscriber Service — Persistência de leads no Neon (crm.leads)
 * Interface pública inalterada para não quebrar callers.
 * Upsert atômico para evitar race condition em double-submit.
 * Gera unsubscribeToken único para one-click unsubscribe (RFC 8058).
 */

import { randomBytes } from 'crypto'
import { prisma } from '../../../lib/db'
import { audit } from '../../../lib/audit'
import { registerConsent } from '../../../lib/consent'

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim().toLowerCase()
  if (trimmed.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
}

function generateUnsubscribeToken(): string {
  return randomBytes(24).toString('hex')
}

export async function subscriberExists(email: string): Promise<boolean> {
  if (!prisma) return false
  const normalized = email.toLowerCase().trim()
  try {
    const lead = await prisma.lead.findUnique({
      where: { email: normalized },
      select: { id: true },
    })
    return lead !== null
  } catch {
    return false
  }
}

export async function getUnsubscribeToken(email: string): Promise<string | null> {
  if (!prisma) return null
  const normalized = email.toLowerCase().trim()
  try {
    const lead = await prisma.lead.findUnique({
      where: { email: normalized },
      select: { unsubscribeToken: true },
    })
    return lead?.unsubscribeToken ?? null
  } catch {
    return null
  }
}

export async function createSubscriber(
  email: string,
  source: string = 'popup',
  meta?: { ip?: string; userAgent?: string; locale?: string }
): Promise<{ success: boolean; isNew: boolean; leadId?: string; unsubscribeToken?: string; error?: string }> {
  const normalized = email.toLowerCase().trim()

  if (!isValidEmail(normalized)) {
    return { success: false, isNew: false, error: 'invalid_email' }
  }

  if (!prisma) {
    return { success: false, isNew: false, error: 'storage_unavailable' }
  }

  try {
    const newToken = generateUnsubscribeToken()
    const now = new Date()

    // Upsert atômico — elimina race condition em double-submit.
    // Se o lead existe: atualiza lastSeenAt e mantém token original.
    // Se não existe: cria com token novo.
    const lead = await prisma.lead.upsert({
      where: { email: normalized },
      update: { lastSeenAt: now },
      create: {
        email: normalized,
        captureSource: source,
        locale: meta?.locale,
        status: 'active',
        unsubscribeToken: newToken,
      },
      select: { id: true, unsubscribeToken: true, firstSeenAt: true, lastSeenAt: true },
    })

    // isNew = firstSeenAt === lastSeenAt (foi criado agora, sem update prévio)
    const isNew = lead.firstSeenAt.getTime() === lead.lastSeenAt.getTime()

    if (isNew) {
      audit('lead_created', 'crm.leads', lead.id, { ip: meta?.ip, userAgent: meta?.userAgent })

      // Registrar consentimento LGPD com IP/UA hash (Art. 8 — prova de consentimento)
      registerConsent({
        email: normalized,
        consentType: 'email_marketing',
        granted: true,
        policyVersion: '1.0',
        source,
        locale: meta?.locale,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      }).catch((err) => {
        console.error('[subscribers] Consent registration failed:', normalized.slice(0, 3) + '***', err)
      })
    }

    return {
      success: true,
      isNew,
      leadId: lead.id,
      unsubscribeToken: lead.unsubscribeToken ?? undefined,
    }
  } catch (error) {
    console.error('[subscribers] Erro ao criar subscriber:', error)
    return { success: false, isNew: false, error: 'internal_error' }
  }
}

export async function unsubscribeByEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!prisma) return { success: false, error: 'storage_unavailable' }

  const normalized = email.toLowerCase().trim()
  try {
    await prisma.lead.update({
      where: { email: normalized },
      data: { status: 'unsubscribed' },
    })
    audit('lead_unsubscribed', 'crm.leads', normalized)
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao unsubscribe:', error)
    return { success: false, error: 'internal_error' }
  }
}

/** Backward-compat alias */
export const unsubscribe = unsubscribeByEmail

export async function unsubscribeByToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
  if (!prisma) return { success: false, error: 'storage_unavailable' }
  if (!token || typeof token !== 'string' || token.length < 32) {
    return { success: false, error: 'invalid_token' }
  }

  try {
    const lead = await prisma.lead.findFirst({
      where: { unsubscribeToken: token },
      select: { id: true, email: true },
    })

    if (!lead) return { success: false, error: 'token_not_found' }

    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'unsubscribed' },
    })
    audit('lead_unsubscribed', 'crm.leads', lead.id)
    return { success: true, email: lead.email }
  } catch (error) {
    console.error('[subscribers] Erro ao unsubscribe by token:', error)
    return { success: false, error: 'internal_error' }
  }
}

export async function markBouncedByEmail(email: string, reason?: string): Promise<{ success: boolean }> {
  if (!prisma) return { success: false }
  const normalized = email.toLowerCase().trim()
  try {
    await prisma.lead.update({
      where: { email: normalized },
      data: { status: 'bounced' },
    })
    audit('lead_bounced', 'crm.leads', normalized, { actorType: 'system', actorId: reason })
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao mark bounced:', error)
    return { success: false }
  }
}

export async function countSubscribers(): Promise<number> {
  if (!prisma) return 0
  try {
    return await prisma.lead.count({ where: { status: 'active' } })
  } catch {
    return 0
  }
}
