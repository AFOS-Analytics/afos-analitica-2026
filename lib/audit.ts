import { prisma } from './db'

/**
 * Grava evento de auditoria em governance.audit_log.
 * Fire-and-forget — nunca bloqueia a request, fallback para console.log.
 */
export function audit(
  action: string,
  resource: string,
  detail?: Record<string, unknown> | null,
  ip?: string | null,
  actor?: string | null
) {
  prisma.auditLog
    .create({
      data: {
        action,
        resource,
        detail: detail ? JSON.parse(JSON.stringify(detail)) : undefined,
        ip: ip ?? undefined,
        actor: actor ?? undefined,
      },
    })
    .catch((err) => {
      // Fallback: se Neon estiver fora, log no console (não perde o evento)
      console.error('[audit] Neon write failed, fallback console:', {
        action,
        resource,
        detail: detail ? redactSensitive(detail) : undefined,
        error: err instanceof Error ? err.message : String(err),
      })
    })
}

/** Remove valores de chaves sensíveis antes de logar */
function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const sensitive = ['token', 'key', 'secret', 'password', 'auth', 'credential']
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    result[k] = sensitive.some((s) => k.toLowerCase().includes(s)) ? '[REDACTED]' : v
  }
  return result
}
