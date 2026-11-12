/**
 * Cron: purge VisitorState antigos sem subscriber.
 * Roda 1x/dia (configurar em vercel.json).
 *
 * Política: deletar visitor_states com lastSessionAt < 90 dias atrás
 * E subscribed=false E sem leadId (puramente anônimos sem conversão).
 *
 * E, à parte, qualquer linha SEM ATIVIDADE há mais de 12 meses, inscrita ou
 * não: a política publicada promete identificadores anônimos por 12 meses, e
 * as linhas com subscribed=true (de /api/visitor/migrate, ou de quem se
 * descadastrou antes de o descadastro passar a soltar o vínculo) nunca
 * entravam no filtro acima e ficavam para sempre.
 *
 * E, desde 12/Nov/2026, a retenção de LEADS fora da lista: quem está como
 * unsubscribed, bounced ou complained há mais de 24 meses é anonimizado pela
 * mesma regra do pedido de exclusão (purgarLeadsInativos, em
 * lib/governance/data-lifecycle.ts), até LOTE_LEADS por execução.
 *
 * Auth: Bearer CRON_SECRET (Vercel injeta automaticamente em scheduled crons).
 */

import { NextResponse } from 'next/server'
import { getPrisma } from '../../../../lib/db'
import { audit } from '../../../../lib/audit'
import { requireCronAuth } from '../../../../lib/cron/auth'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'
import { purgarLeadsInativos, RETENCAO_LEAD_INATIVO_MESES } from '../../../../lib/governance/data-lifecycle'

export const maxDuration = 60

const RETENTION_DAYS = 90
const MAX_RETENTION_DAYS = 365
// Leads anonimizados por execução. O que passar disso fica para o dia seguinte.
const LOTE_LEADS = 200
// Tempo máximo gasto na anonimização dentro dos 60s da função.
const PRAZO_LEADS_MS = 35_000

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request)
  if (unauthorized) return unauthorized

  const prisma = getPrisma()
  if (!prisma) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const cutoffMax = new Date(Date.now() - MAX_RETENTION_DAYS * 24 * 60 * 60 * 1000)

  try {
    const result = await prisma.visitorState.deleteMany({
      where: {
        subscribed: false,
        leadId: null,
        OR: [
          { lastSessionAt: { lt: cutoff } },
          { lastSessionAt: null, createdAt: { lt: cutoff } },
        ],
      },
    })

    // Teto de 12 meses sem atividade, para qualquer linha. `updatedAt` muda a
    // cada sessão, dispensa ou cadastro, então mede a última atividade.
    const antigas = await prisma.visitorState.deleteMany({
      where: { updatedAt: { lt: cutoffMax } },
    })

    audit('visitor_state_purged', 'crm.visitor_states', 'cron', {
      after: {
        deleted: result.count,
        retentionDays: RETENTION_DAYS,
        cutoff: cutoff.toISOString(),
        deletedMaxRetention: antigas.count,
        maxRetentionDays: MAX_RETENTION_DAYS,
      },
    })

    // Retenção de leads fora da lista. Falha aqui não desfaz a purga acima:
    // avisa e devolve o erro no corpo.
    let leads: Awaited<ReturnType<typeof purgarLeadsInativos>> | { erro: string }
    try {
      leads = await purgarLeadsInativos({ limite: LOTE_LEADS, prazoMs: PRAZO_LEADS_MS })
      audit('inactive_leads_purged', 'crm.leads', 'cron', {
        after: { ...leads, retentionMonths: RETENCAO_LEAD_INATIVO_MESES, batchLimit: LOTE_LEADS },
      })
      if (leads.falhas > 0) {
        await avisarFalhaDeCron('purge-visitor-state', `anonimizacao de lead falhou em ${leads.falhas}`)
      }
    } catch (error) {
      leads = { erro: 'lead_purge_failed' }
      await avisarFalhaDeCron('purge-visitor-state', 'purga de leads inativos falhou', error)
      console.error('[purge-visitor-state] Lead purge error:', error)
    }

    return NextResponse.json({
      ok: true,
      deleted: result.count,
      retentionDays: RETENTION_DAYS,
      cutoff: cutoff.toISOString(),
      deletedMaxRetention: antigas.count,
      maxRetentionDays: MAX_RETENTION_DAYS,
      leads,
    })
  } catch (error) {
    // Alerta por email. Este cron falhava em SILENCIO: dos sete declarados,
    // so `persist-analysis` avisava alguem. Nao bloqueia nem derruba nada.
    await avisarFalhaDeCron('purge-visitor-state', 'excecao nao tratada', error)
    console.error('[purge-visitor-state] Error:', error)
    return NextResponse.json({ error: 'purge_failed' }, { status: 500 })
  }
}
