/**
 * Consent Service — Registro de consentimentos (LGPD)
 *
 * Cria user em iam.users (se não existe) e grava consent em iam.consents
 * com hash SHA-256 como prova criptográfica do consentimento.
 */

import { createHash } from 'crypto'
import { prisma } from './db'

function hashConsent(email: string, type: string, version: string, granted: boolean, timestamp: string): string {
  return createHash('sha256').update(`${email}|${type}|${version}|${granted}|${timestamp}`).digest('hex')
}

/**
 * Registra consentimento — cria user se não existe (upsert por email).
 * Fire-and-forget safe: callers podem ignorar erros.
 */
export async function registerConsent(input: {
  email: string
  type: 'email_marketing' | 'data_processing' | 'cookies'
  version: string
  granted: boolean
  ip?: string
  userAgent?: string
  locale?: string
}): Promise<{ success: boolean }> {
  try {
    const user = await prisma.user.upsert({
      where: { email: input.email },
      update: { locale: input.locale || undefined },
      create: { email: input.email, locale: input.locale || 'pt-BR' },
      select: { id: true },
    })

    const now = new Date()

    await prisma.consent.create({
      data: {
        userId: user.id,
        type: input.type,
        version: input.version,
        granted: input.granted,
        consentHash: hashConsent(input.email, input.type, input.version, input.granted, now.toISOString()),
        ip: input.ip,
        userAgent: input.userAgent,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[consent] Erro ao registrar:', error)
    return { success: false }
  }
}
