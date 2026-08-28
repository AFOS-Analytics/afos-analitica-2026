/**
 * Subscriber Service — persistência de leads em crm.leads (Neon).
 * Upsert atômico evita race em double-submit. Gera unsubscribeToken
 * único (24 bytes hex) para one-click unsubscribe RFC 8058.
 */

import { randomBytes } from 'crypto'
import { getPrisma } from '../../../lib/db'
import { audit } from '../../../lib/audit'
import { registerConsent } from '../../../lib/consent'

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim().toLowerCase()
  return trimmed.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
}

export async function subscriberExists(email: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false
  try {
    const lead = await prisma.lead.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    })
    return lead !== null
  } catch {
    return false
  }
}

export async function createSubscriber(
  email: string,
  source: string = 'popup',
  meta?: { ip?: string; userAgent?: string; locale?: string; campaign?: string }
): Promise<{ success: boolean; isNew: boolean; reativado?: boolean; leadId?: string; unsubscribeToken?: string; error?: string }> {
  const normalized = email.toLowerCase().trim()

  if (!isValidEmail(normalized)) {
    return { success: false, isNew: false, error: 'invalid_email' }
  }

  const prisma = getPrisma()
  if (!prisma) {
    return { success: false, isNew: false, error: 'storage_unavailable' }
  }

  try {
    const newToken = randomBytes(24).toString('hex')

    // 🔴 ESTADO ANTERIOR, lido ANTES do upsert. Sem isto não há como saber que
    // houve REATIVAÇÃO, e o defeito era grave: o `update` só tocava
    // `lastSeenAt`, então quem tinha se descadastrado e voltava a se cadastrar
    // recebia SUCESSO na tela, continuava com `status: 'unsubscribed'` e nunca
    // mais recebia nada. Falha silenciosa dos DOIS lados, medida em 27/Ago/2026
    // com 11 dos 31 leads da base nesse estado.
    // Corrida em duplo-clique é inofensiva aqui: reativar duas vezes é idempotente.
    const anterior = await prisma.lead.findUnique({
      where: { email: normalized },
      select: { status: true },
    })
    const reativando = !!anterior && anterior.status !== 'active'

    // Upsert, que resolve duplo-clique no caminho comum. O caso raro em que
    // ele não basta (dois CREATE simultâneos) é tratado no catch, por P2002.
    const lead = await prisma.lead.upsert({
      where: { email: normalized },
      update: {
        lastSeenAt: new Date(),
        // ⭐ Cadastrar-se de novo é um ato de CONSENTIMENTO, e ele tem que
        // valer. Quem estava fora volta para dentro, e o contador de bounce
        // zera para não marcar como quicado de novo pelo histórico velho.
        ...(reativando ? { status: 'active', unsubscribedAt: null, softBounceCount: 0 } : {}),
      },
      create: {
        email: normalized,
        captureSource: source,
        // `captureSource` é a SUPERFÍCIE do site onde a pessoa assinou (popup, gate,
        // daily). `campaign` é de ONDE ela veio (li, x, newsletter). São perguntas
        // diferentes e misturar as duas apagaria uma delas.
        // Só no `create`: origem é de PRIMEIRO toque e não se reescreve depois.
        campaign: meta?.campaign,
        locale: meta?.locale,
        status: 'active',
        unsubscribeToken: newToken,
      },
      select: { id: true, unsubscribeToken: true },
    })

    // Backfill para leads pré-migration (token null)
    let finalToken = lead.unsubscribeToken
    if (!finalToken) {
      const updated = await prisma.lead.update({
        where: { id: lead.id },
        data: { unsubscribeToken: newToken },
        select: { unsubscribeToken: true },
      })
      finalToken = updated.unsubscribeToken
    }

    // ⭐ SIMPLIFICADO: `isNew` era inferido comparando o token devolvido com o
    // recém-gerado, um truque que obrigava a raciocinar sobre o backfill para
    // saber se ainda valia. Agora a resposta vem do fato que já temos em mãos:
    // não existia registro antes.
    const isNew = !anterior

    // Criação e reativação são atos DIFERENTES e cada um tem sua linha de
    // auditoria. Os dois disparam consentimento novo: quem voltou preencheu o
    // formulário e marcou a caixa outra vez, e a base legal LGPD é do ATO, não
    // do cadastro antigo.
    if (isNew) audit('lead_created', 'crm.leads', lead.id, { ip: meta?.ip, userAgent: meta?.userAgent })
    if (reativando) audit('lead_reactivated', 'crm.leads', lead.id, { ip: meta?.ip, userAgent: meta?.userAgent })

    if (isNew || reativando) {

      // Consentimento LGPD Art. 8 (IP/UA hasheados em consent.ts)
      registerConsent({
        email: normalized,
        consentType: 'email_marketing',
        granted: true,
        policyVersion: '1.0',
        source,
        locale: meta?.locale,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      })
        .then((r) => {
          // 🔴 `registerConsent` DEVOLVE `{ success: false }`, não lança. Só o
          // `.catch()` deixava a falha de consentimento LGPD passar TOTALMENTE
          // calada: lead criado, registro de consentimento ausente, e nada no
          // log. Medido em 27/Ago/2026 ao auditar o cadastro.
          if (!r?.success) {
            console.error('[subscribers] consent NAO registrado (retorno):', normalized.slice(0, 3) + '***')
          }
        })
        .catch((err) => {
          console.error('[subscribers] consent failed:', normalized.slice(0, 3) + '***', err)
        })
    }

    return {
      success: true,
      isNew,
      // 📌 O chamador precisa disto para mandar o e-mail de boas-vindas a quem
      // VOLTOU. `isNew` sozinho e false na reativacao, e a pessoa ficava sem
      // nenhuma confirmacao de que tinha voltado.
      reativado: reativando,
      leadId: lead.id,
      unsubscribeToken: finalToken ?? undefined,
    }
  } catch (error) {
    // 🔴 CORRIDA DE DUPLO-CLIQUE no PRIMEIRO cadastro. O `upsert` do Prisma não
    // é atômico no banco: dois pedidos simultâneos para um e-mail que ainda não
    // existe tomam os dois o ramo de CREATE, e o segundo viola a unicidade com
    // P2002. O cadastro DEU CERTO, mas a pessoa via erro genérico na tela.
    // Medido em 27/Ago/2026. A saída é reler: na segunda passada o registro já
    // existe e o caminho vira UPDATE, que é idempotente.
    const codigo = (error as { code?: string })?.code
    if (codigo === 'P2002') {
      try {
        const existente = await prisma.lead.findUnique({
          where: { email: normalized },
          select: { id: true, unsubscribeToken: true },
        })
        if (existente) {
          console.warn('[subscribers] P2002 em corrida, resolvido relendo:', normalized.slice(0, 3) + '***')
          return {
            success: true,
            isNew: false,
            reativado: false,
            leadId: existente.id,
            unsubscribeToken: existente.unsubscribeToken ?? undefined,
          }
        }
      } catch {}
    }
    console.error('[subscribers] Erro ao criar subscriber:', error)
    return { success: false, isNew: false, error: 'internal_error' }
  }
}

export async function unsubscribeByEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const prisma = getPrisma()
  if (!prisma) return { success: false, error: 'storage_unavailable' }

  const normalized = email.toLowerCase().trim()
  try {
    // LGPD Art.16: preserve original unsubscribedAt if already unsubscribed.
    const existing = await prisma.lead.findUnique({
      where: { email: normalized },
      select: { unsubscribedAt: true },
    })
    await prisma.lead.update({
      where: { email: normalized },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: existing?.unsubscribedAt ?? new Date(),
      },
    })
    audit('lead_unsubscribed', 'crm.leads', normalized)
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao unsubscribe:', error)
    return { success: false, error: 'internal_error' }
  }
}

export async function unsubscribeByToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
  const prisma = getPrisma()
  if (!prisma) return { success: false, error: 'storage_unavailable' }
  if (!token || typeof token !== 'string' || token.length < 32) {
    return { success: false, error: 'invalid_token' }
  }

  try {
    const lead = await prisma.lead.findFirst({
      where: { unsubscribeToken: token },
      select: { id: true, email: true, unsubscribedAt: true },
    })

    if (!lead) return { success: false, error: 'token_not_found' }

    // LGPD Art.16: preserve original unsubscribedAt if already unsubscribed.
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: lead.unsubscribedAt ?? new Date(),
      },
    })
    audit('lead_unsubscribed', 'crm.leads', lead.id)
    return { success: true, email: lead.email }
  } catch (error) {
    console.error('[subscribers] Erro ao unsubscribe by token:', error)
    return { success: false, error: 'internal_error' }
  }
}

export async function markBouncedByEmail(email: string, reason?: string): Promise<{ success: boolean }> {
  const prisma = getPrisma()
  if (!prisma) return { success: false }
  const normalized = email.toLowerCase().trim()
  try {
    await prisma.lead.update({
      where: { email: normalized },
      data: { status: 'bounced' },
    })
    audit('lead_bounced', 'crm.leads', normalized, { actorType: 'system', actorId: reason })
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao mark bounced:', error)
    return { success: false }
  }
}

/**
 * D+7 hardening: track soft bounces. Increments counter; marks status='bounced'
 * when threshold reached. Returns { count, markedBounced } for telemetry.
 */
export async function incrementSoftBounce(
  email: string,
  threshold: number,
): Promise<{ count: number; markedBounced: boolean }> {
  const prisma = getPrisma()
  if (!prisma) return { count: 0, markedBounced: false }
  const normalized = email.toLowerCase().trim()
  try {
    const updated = await prisma.lead.update({
      where: { email: normalized },
      data: { softBounceCount: { increment: 1 } },
      select: { softBounceCount: true, status: true },
    })
    if (updated.softBounceCount >= threshold && updated.status === 'active') {
      await prisma.lead.update({
        where: { email: normalized },
        data: { status: 'bounced' },
      })
      return { count: updated.softBounceCount, markedBounced: true }
    }
    return { count: updated.softBounceCount, markedBounced: false }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { count: 0, markedBounced: false }
    }
    console.error('[subscribers] Erro ao increment soft bounce:', error)
    return { count: 0, markedBounced: false }
  }
}

/**
 * D+7 hardening: reset soft bounce counter on successful delivery.
 * Idempotent — no-op if already 0.
 */
export async function resetSoftBounce(email: string): Promise<{ success: boolean }> {
  const prisma = getPrisma()
  if (!prisma) return { success: false }
  const normalized = email.toLowerCase().trim()
  try {
    await prisma.lead.update({
      where: { email: normalized },
      data: { softBounceCount: 0 },
    })
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      return { success: true }
    }
    console.error('[subscribers] Erro ao reset soft bounce:', error)
    return { success: false }
  }
}

export async function countSubscribers(): Promise<number> {
  const prisma = getPrisma()
  if (!prisma) return 0
  try {
    return await prisma.lead.count({ where: { status: 'active' } })
  } catch {
    return 0
  }
}
