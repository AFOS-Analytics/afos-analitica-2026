import { getPrisma } from './db'
import { hashComSegredo } from './audit'

/**
 * HMAC com segredo do servidor, truncado em 16 chars hex (LGPD Art. 8 sem PII
 * em claro). Era SHA-256 puro, que devolve o IPv4 por enumeração. A regra é a
 * MESMA de lib/audit.ts, e mora lá.
 */
const hashShort = (s: string | undefined) => hashComSegredo(s)

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
  const prisma = getPrisma()
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
