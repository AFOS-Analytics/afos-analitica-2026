import { createHash } from 'crypto'
import { prisma } from './db'

/** SHA-256 truncado em 16 chars hex (LGPD Art. 8 sem PII em claro). */
const hashShort = (s: string | undefined) =>
  s ? createHash('sha256').update(s).digest('hex').slice(0, 16) : undefined

/**
 * Registra consentimento LGPD. Upsert User por email + insert UserConsent
 * com IP/UA hasheados. Fire-and-forget safe.
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
  if (!prisma) return { success: false }

  try {
    const user = await prisma.user.upsert({
      where: { email: input.email },
      update: { locale: input.locale || undefined },
      create: { email: input.email, locale: input.locale || 'pt-BR' },
      select: { id: true },
    })

    await prisma.userConsent.create({
      data: {
        userId: user.id,
        email: input.email,
        consentType: input.consentType,
        granted: input.granted,
        policyVersion: input.policyVersion,
        source: input.source,
        locale: input.locale || 'pt-BR',
        ipHash: hashShort(input.ip),
        userAgentHash: hashShort(input.userAgent),
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[consent] erro:', error)
    return { success: false }
  }
}
