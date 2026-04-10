import { createHash } from 'crypto'
import { prisma } from './db'

/**
 * Grava evento de auditoria em governance.audit_logs.
 * Fire-and-forget — nunca bloqueia a request, fallback para console.log.
 */
export function audit(
  action: string,
  entityType: string,
  entityId: string,
  detail?: { before?: unknown; after?: unknown; ip?: string; userAgent?: string; actorType?: string; actorId?: string }
) {
  if (!prisma) return

  const ipHash = detail?.ip ? createHash('sha256').update(detail.ip).digest('hex').slice(0, 16) : undefined
  const uaHash = detail?.userAgent ? createHash('sha256').update(detail.userAgent).digest('hex').slice(0, 16) : undefined

  let before: object | undefined
  let after: object | undefined
  try {
    before = detail?.before ? JSON.parse(JSON.stringify(detail.before)) : undefined
    after = detail?.after ? JSON.parse(JSON.stringify(detail.after)) : undefined
  } catch {
    after = { error: 'unserializable' }
  }

  prisma.auditLog
    .create({
      data: {
        actorType: detail?.actorType || 'system',
        actorId: detail?.actorId,
        action,
        entityType,
        entityId,
        beforeData: before ?? undefined,
        afterData: after ?? undefined,
        ipHash,
        userAgentHash: uaHash,
      },
    })
    .catch((err) => {
      console.error('[audit] Neon write failed:', action, entityType, err instanceof Error ? err.message : err)
    })
}
