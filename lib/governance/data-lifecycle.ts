/**
 * LGPD Data Lifecycle — AFOS Analytics
 *
 * anonymizeUser:          Anonimiza PII, preserva dados analíticos dissociados
 * exportUserData:         Exporta todos os dados do titular (Art. 18, II)
 * processDeletionRequest: Orquestra exclusão com $transaction atômica
 */

import { createHash } from 'crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '../db'
import { audit } from '../audit'

function anonEmail(email: string): string {
  const hash = createHash('sha256').update(email).digest('hex').slice(0, 8)
  return `deleted-${hash}@anon.local`
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

// ─── Anonymize ─────────────────────────────────────────────────────

export async function anonymizeUser(email: string): Promise<{ success: boolean; error?: string }> {
  if (!prisma) return { success: false, error: 'database_unavailable' }

  const normalized = email.toLowerCase().trim()
  const anon = anonEmail(normalized)

  try {
    const user = await prisma.user.findUnique({ where: { email: normalized }, select: { id: true } })
    const lead = await prisma.lead.findUnique({ where: { email: normalized }, select: { id: true } })

    const ops = []

    if (user) {
      ops.push(prisma.user.update({
        where: { email: normalized },
        data: { email: anon, name: null, status: 'deleted' },
      }))
      ops.push(prisma.userConsent.updateMany({
        where: { userId: user.id },
        data: { email: null, userId: null },
      }))
    }

    if (lead) {
      ops.push(prisma.lead.update({
        where: { email: normalized },
        data: { email: anon, status: 'deleted' },
      }))
      // Scrub eventPayload JSONB (pode conter PII). DbNull força SQL NULL real
      // (data: undefined no Prisma significa "não atualizar", não NULL).
      ops.push(prisma.contactEvent.updateMany({
        where: { leadId: lead.id },
        data: { eventPayload: Prisma.DbNull, leadId: null },
      }))
    }

    // Consents sem userId mas com email direto
    ops.push(prisma.userConsent.updateMany({
      where: { email: normalized },
      data: { email: null },
    }))

    if (ops.length > 0) {
      await prisma.$transaction(ops)
    }

    audit('user_anonymized', 'governance', 'n/a', {
      after: { maskedEmail: maskEmail(normalized), tablesAffected: ops.length },
    })

    return { success: true }
  } catch (error) {
    console.error('[data-lifecycle] Anonymize failed:', error)
    return { success: false, error: 'anonymize_failed' }
  }
}

// ─── Export ────────────────────────────────────────────────────────

export async function exportUserData(email: string): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  if (!prisma) return { success: false, error: 'database_unavailable' }

  const normalized = email.toLowerCase().trim()

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      include: { preferences: true, consents: true },
    })

    const lead = await prisma.lead.findUnique({
      where: { email: normalized },
      include: { events: { orderBy: { createdAt: 'desc' }, take: 100 } },
    })

    const consents = await prisma.userConsent.findMany({
      where: { email: normalized },
      orderBy: { grantedAt: 'desc' },
    })

    const deletionRequests = await prisma.deletionRequest.findMany({
      where: { email: normalized },
      orderBy: { requestedAt: 'desc' },
    })

    audit('data_exported', 'governance', 'n/a', {
      after: { maskedEmail: maskEmail(normalized) },
    })

    return {
      success: true,
      data: {
        user: user ? { email: user.email, name: user.name, locale: user.locale, status: user.status, createdAt: user.createdAt } : null,
        preferences: user?.preferences ? { locale: user.preferences.locale, timezone: user.preferences.timezone, marketingOptIn: user.preferences.marketingOptIn } : null,
        consents: consents.map((c) => ({ type: c.consentType, granted: c.granted, grantedAt: c.grantedAt, revokedAt: c.revokedAt, policyVersion: c.policyVersion })),
        lead: lead ? { captureSource: lead.captureSource, locale: lead.locale, status: lead.status, firstSeenAt: lead.firstSeenAt } : null,
        events: lead?.events.map((e) => ({ type: e.eventType, createdAt: e.createdAt })) || [],
        deletionRequests: deletionRequests.map((d) => ({ type: d.requestType, status: d.status, requestedAt: d.requestedAt, processedAt: d.processedAt })),
      },
    }
  } catch (error) {
    console.error('[data-lifecycle] Export failed:', error)
    return { success: false, error: 'export_failed' }
  }
}

// ─── Process Deletion Request ──────────────────────────────────────

export async function processDeletionRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  if (!prisma) return { success: false, error: 'database_unavailable' }

  try {
    const request = await prisma.deletionRequest.findUnique({ where: { id: requestId } })
    if (!request) return { success: false, error: 'request_not_found' }
    if (request.status === 'completed') return { success: true } // Idempotente

    const result = await anonymizeUser(request.email)
    if (!result.success) return result

    await prisma.deletionRequest.update({
      where: { id: requestId },
      data: { status: 'completed', processedAt: new Date() },
    })

    return { success: true }
  } catch (error) {
    console.error('[data-lifecycle] Process deletion failed:', error)
    return { success: false, error: 'processing_failed' }
  }
}
