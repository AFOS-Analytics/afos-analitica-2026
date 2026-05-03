import { createHash } from 'crypto'
import { prisma } from './db'

/**
 * Registra consentimento LGPD — cria user se não existe (upsert por email).
 * Fire-and-forget safe: callers podem ignorar erros.
 *
 * IP e user-agent são hasheados (SHA-256, 16 chars) antes de gravar.
 * Isso atende LGPD Art. 8 (prova de consentimento) sem armazenar PII em claro.
 */
export async function registerConsent(input: {
  email: string
  consentType: string
  granted: boolean
  policyVersion: string
  source: string
  locale?: string
  ip?: string
  userAgent?: string
}): Promise<{ success: boolean }> {
  try {
    if (!prisma) return { success: false }

    const user = await prisma.user.upsert({
      where: { email: input.email },
      update: { locale: input.locale || undefined },
      create: { email: input.email, locale: input.locale || 'pt-BR' },
      select: { id: true },
    })

    const ipHash = input.ip ? createHash('sha256').update(input.ip).digest('hex').slice(0, 16) : undefined
    const userAgentHash = input.userAgent ? createHash('sha256').update(input.userAgent).digest('hex').slice(0, 16) : undefined

    await prisma.userConsent.create({
      data: {
        userId: user.id,
        email: input.email,
        consentType: input.consentType,
        granted: input.granted,
        policyVersion: input.policyVersion,
        source: input.source,
        locale: input.locale || 'pt-BR',
        ipHash,
        userAgentHash,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[consent] Erro ao registrar:', error)
    return { success: false }
  }
}
