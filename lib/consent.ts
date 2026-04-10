import { prisma } from './db'

/**
 * Registra consentimento LGPD — cria user se não existe (upsert por email).
 * Fire-and-forget safe: callers podem ignorar erros.
 */
export async function registerConsent(input: {
  email: string
  consentType: string
  granted: boolean
  policyVersion: string
  source: string
  locale?: string
}): Promise<{ success: boolean }> {
  try {
    if (!prisma) return { success: false }

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
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[consent] Erro ao registrar:', error)
    return { success: false }
  }
}
