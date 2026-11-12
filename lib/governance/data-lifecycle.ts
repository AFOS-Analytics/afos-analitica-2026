/**
 * LGPD Data Lifecycle — AFOS Analytics
 *
 * anonymizeUser:          Anonimiza PII, preserva dados analíticos dissociados
 * exportUserData:         Exporta todos os dados do titular (Art. 18, II)
 * processDeletionRequest: Orquestra exclusão com $transaction atômica
 */

import { Prisma } from '@prisma/client'
import { getPrisma } from '../db'
import { audit, entityIdDeEmail, hashComSegredo } from '../audit'

/**
 * Endereço anônimo POR REGISTRO, montado com o id da linha.
 *
 * 🔴 Era `deleted-` + sha256(email)[0..8], o MESMO para o mesmo titular. Como
 * User.email e Lead.email são únicos, o segundo pedido de exclusão de quem
 * voltou a assinar batia em P2002, a transação voltava inteira e o dado em
 * claro do cadastro novo ficava no banco. E o hash sem sal confirmava, por
 * recálculo, quem tinha sido excluído. O id da linha não diz nada do e-mail.
 */
function anonEmail(id: string): string {
  return `deleted-${id}@anon.local`
}

/**
 * Marcador que substitui o e-mail no registro do pedido de exclusão concluído.
 * HMAC com segredo do servidor: guarda a prova de que houve um pedido sem
 * guardar o endereço. Sem segredo configurado, fica só 'deleted'.
 */
export function marcadorDePedidoConcluido(email: string): string {
  const h = hashComSegredo(email.toLowerCase().trim(), 32)
  return h ? `hmac:${h}` : 'deleted'
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

// ─── Anonymize ─────────────────────────────────────────────────────

export async function anonymizeUser(email: string): Promise<{ success: boolean; error?: string }> {
  const prisma = getPrisma()
  if (!prisma) return { success: false, error: 'database_unavailable' }

  const normalized = email.toLowerCase().trim()

  try {
    const user = await prisma.user.findUnique({ where: { email: normalized }, select: { id: true } })
    const lead = await prisma.lead.findUnique({ where: { email: normalized }, select: { id: true } })

    const ops = []

    if (user) {
      ops.push(prisma.user.update({
        where: { email: normalized },
        data: { email: anonEmail(user.id), name: null, status: 'deleted' },
      }))
      ops.push(prisma.userConsent.updateMany({
        where: { userId: user.id },
        data: { email: null, userId: null },
      }))
    }

    // audit_logs guarda o e-mail de DUAS formas no entityId: em claro (linhas
    // antigas, de antes do conserto de lib/audit.ts) e como hash sha256 (as
    // novas). 🔴 So a forma em claro era alcancada, e o hash sem sal deixava
    // quem conhece o endereco achar o historico de um titular ja excluido. A
    // forma do hash vem da MESMA funcao que o audit() usa para gravar.
    ops.push(prisma.auditLog.updateMany({
      where: { entityId: { in: [normalized, entityIdDeEmail(normalized)] } },
      data: { entityId: 'deleted' },
    }))

    if (lead) {
      ops.push(prisma.lead.update({
        where: { email: normalized },
        data: { email: anonEmail(lead.id), status: 'deleted' },
      }))
      // Scrub eventPayload JSONB (pode conter PII). DbNull força SQL NULL real
      // (data: undefined no Prisma significa "não atualizar", não NULL).
      ops.push(prisma.contactEvent.updateMany({
        where: { leadId: lead.id },
        data: { eventPayload: Prisma.DbNull, leadId: null },
      }))

      // 🔴 `visitor_states` ficava de fora, e ela guarda `leadId` apontando para
      // o lead que acabou de ser anonimizado. O vínculo sobrevivia à exclusão:
      // dava para partir da linha de visitante e chegar ao lead de volta.
      // Encontrado pelo crítico de cobertura do EVAL, em 19/Ago/2026.
      ops.push(prisma.visitorState.updateMany({
        where: { leadId: lead.id },
        data: { leadId: null, subscribed: false },
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
  const prisma = getPrisma()
  if (!prisma) return { success: false, error: 'database_unavailable' }

  const normalized = email.toLowerCase().trim()

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      include: { preferences: true, consents: true },
    })

    // 🔴 SEM `take: 100`. Cada broadcast grava um evento por destinatario, e um
    // assinante desde agosto ja passava de 100: a exportacao do Art. 18, II
    // cortava em silencio.
    const lead = await prisma.lead.findUnique({
      where: { email: normalized },
      include: { events: { orderBy: { createdAt: 'desc' } } },
    })

    const visitorStates = lead
      ? await prisma.visitorState.findMany({ where: { leadId: lead.id }, orderBy: { createdAt: 'desc' } })
      : []

    // Linhas de auditoria do titular: pelo id do lead e pelo e-mail (em claro
    // nas antigas, como hash nas novas).
    const auditIds = [normalized, entityIdDeEmail(normalized), ...(lead ? [lead.id] : [])]
    const auditLogs = await prisma.auditLog.findMany({
      where: { entityId: { in: auditIds } },
      orderBy: { createdAt: 'desc' },
      select: { action: true, entityType: true, actorType: true, createdAt: true },
    })

    const consents = await prisma.userConsent.findMany({
      where: { email: normalized },
      orderBy: { grantedAt: 'desc' },
    })

    // O pedido concluído guarda o marcador HMAC no lugar do e-mail.
    const deletionRequests = await prisma.deletionRequest.findMany({
      where: { email: { in: [normalized, marcadorDePedidoConcluido(normalized)] } },
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
        lead: lead
          ? {
              email: lead.email,
              captureSource: lead.captureSource,
              campaign: lead.campaign,
              locale: lead.locale,
              preferredLocale: lead.preferredLocale,
              status: lead.status,
              firstSeenAt: lead.firstSeenAt,
              lastSeenAt: lead.lastSeenAt,
              unsubscribedAt: lead.unsubscribedAt,
              softBounceCount: lead.softBounceCount,
            }
          : null,
        events: lead?.events.map((e) => ({ type: e.eventType, createdAt: e.createdAt, payload: e.eventPayload })) || [],
        visitorStates: visitorStates.map((v) => ({
          qualifiedSessions: v.qualifiedSessions,
          popupDismissals: v.popupDismissals,
          subscribed: v.subscribed,
          subscribedAt: v.subscribedAt,
          lastSessionAt: v.lastSessionAt,
          createdAt: v.createdAt,
        })),
        auditLogs: auditLogs.map((a) => ({ action: a.action, entityType: a.entityType, actorType: a.actorType, createdAt: a.createdAt })),
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
  const prisma = getPrisma()
  if (!prisma) return { success: false, error: 'database_unavailable' }

  try {
    const request = await prisma.deletionRequest.findUnique({ where: { id: requestId } })
    if (!request) return { success: false, error: 'request_not_found' }
    if (request.status === 'completed') return { success: true } // Idempotente

    const result = await anonymizeUser(request.email)
    if (!result.success) return result

    // 🔴 O pedido concluido NAO guarda mais o e-mail em claro. Fica um HMAC,
    // que prova que houve um pedido sem guardar o endereco (LGPD art. 37).
    await prisma.deletionRequest.update({
      where: { id: requestId },
      data: { status: 'completed', processedAt: new Date(), email: marcadorDePedidoConcluido(request.email) },
    })

    return { success: true }
  } catch (error) {
    console.error('[data-lifecycle] Process deletion failed:', error)
    return { success: false, error: 'processing_failed' }
  }
}
