/**
 * Subscriber Service — Persistência de leads no Neon (crm.leads)
 *
 * Migrado de Redis SET+HASH para Prisma/Neon.
 * Interface pública inalterada para não quebrar callers.
 */

import { prisma } from '../../../lib/db'
import { audit } from '../../../lib/audit'

export interface Subscriber {
  email: string
  source: string
  status: 'active' | 'unsubscribed'
  consentVersion: string
  createdAt: string
  updatedAt: string
}

/**
 * Validar formato de email (backend).
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim().toLowerCase()
  if (trimmed.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
}

/**
 * Verificar se email já existe.
 */
export async function subscriberExists(email: string): Promise<boolean> {
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

/**
 * Criar subscriber (idempotente — se já existe, atualiza updatedAt e retorna sucesso).
 */
export async function createSubscriber(
  email: string,
  source: string = 'popup',
  meta?: { ip?: string; userAgent?: string; locale?: string }
): Promise<{ success: boolean; isNew: boolean; error?: string }> {
  const normalized = email.toLowerCase().trim()

  if (!isValidEmail(normalized)) {
    return { success: false, isNew: false, error: 'invalid_email' }
  }

  try {
    const existing = await prisma.lead.findUnique({
      where: { email: normalized },
      select: { id: true },
    })

    if (existing) {
      await prisma.lead.update({
        where: { email: normalized },
        data: { updatedAt: new Date() },
      })
      return { success: true, isNew: false }
    }

    await prisma.lead.create({
      data: {
        email: normalized,
        source,
        status: 'active',
        consentVersion: '1.0',
        ip: meta?.ip,
        userAgent: meta?.userAgent,
        locale: meta?.locale,
      },
    })

    audit('lead_created', 'crm.leads', { source, locale: meta?.locale }, meta?.ip)

    return { success: true, isNew: true }
  } catch (error) {
    console.error('[subscribers] Erro ao criar subscriber:', error)
    return { success: false, isNew: false, error: 'internal_error' }
  }
}

/**
 * Marcar subscriber como unsubscribed.
 */
export async function unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
  const normalized = email.toLowerCase().trim()

  try {
    await prisma.lead.update({
      where: { email: normalized },
      data: { status: 'unsubscribed' },
    })

    audit('lead_unsubscribed', 'crm.leads', null, null)

    return { success: true }
  } catch (error) {
    // Se não existe, é idempotente
    if ((error as { code?: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao unsubscribe:', error)
    return { success: false, error: 'internal_error' }
  }
}

/**
 * Contar total de subscribers ativos.
 */
export async function countSubscribers(): Promise<number> {
  try {
    return await prisma.lead.count({ where: { status: 'active' } })
  } catch {
    return 0
  }
}
