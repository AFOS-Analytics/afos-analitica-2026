/**
 * Subscriber Service — Persistência de leads no Neon (crm.leads)
 * Interface pública inalterada para não quebrar callers.
 */

import { prisma } from '../../../lib/db'
import { audit } from '../../../lib/audit'
import { registerConsent } from '../../../lib/consent'

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim().toLowerCase()
  if (trimmed.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
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

export async function createSubscriber(
  email: string,
  source: string = 'popup',
  meta?: { ip?: string; userAgent?: string; locale?: string }
): Promise<{ success: boolean; isNew: boolean; leadId?: string; error?: string }> {
  const normalized = email.toLowerCase().trim()

  if (!isValidEmail(normalized)) {
    return { success: false, isNew: false, error: 'invalid_email' }
  }

  if (!prisma) {
    return { success: false, isNew: false, error: 'storage_unavailable' }
  }

  try {
    const existing = await prisma.lead.findUnique({
      where: { email: normalized },
      select: { id: true },
    })

    if (existing) {
      await prisma.lead.update({
        where: { email: normalized },
        data: { lastSeenAt: new Date() },
      })
      return { success: true, isNew: false, leadId: existing.id }
    }

    const lead = await prisma.lead.create({
      data: {
        email: normalized,
        captureSource: source,
        locale: meta?.locale,
        status: 'active',
      },
    })

    audit('lead_created', 'crm.leads', lead.id, { ip: meta?.ip, userAgent: meta?.userAgent })

    // Registrar consentimento LGPD (fire-and-forget com log)
    registerConsent({
      email: normalized,
      consentType: 'email_marketing',
      granted: true,
      policyVersion: '1.0',
      source,
      locale: meta?.locale,
    }).catch((err) => {
      console.error('[subscribers] Consent registration failed:', normalized.slice(0, 3) + '***', err)
    })

    return { success: true, isNew: true, leadId: lead.id }
  } catch (error) {
    console.error('[subscribers] Erro ao criar subscriber:', error)
    return { success: false, isNew: false, error: 'internal_error' }
  }
}

export async function unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
  if (!prisma) return { success: false, error: 'storage_unavailable' }

  const normalized = email.toLowerCase().trim()
  try {
    await prisma.lead.update({
      where: { email: normalized },
      data: { status: 'unsubscribed' },
    })
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao unsubscribe:', error)
    return { success: false, error: 'internal_error' }
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
