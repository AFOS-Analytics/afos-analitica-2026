import { NextResponse } from 'next/server'
import { upsertAnalysisReport } from '../../../../lib/analysis/persist'
import { prisma } from '../../../../lib/db'
import { requireCronAuth } from '../../../../lib/cron/auth'
// Módulo JS puro, com a lista fixa de veículos e os filtros.
import { coletarImprensaUs } from '../../../../lib/us-press/collect.mjs'
import { redigirSegredo } from '../../../../lib/cron/redigir'

/**
 * Imprensa das midterms, coleta diária.
 *
 * ⚠️ ENTRA AUTOMÁTICO, e o André escolheu essa forma sabendo o preço: manchete
 * que nenhum humano leu vai para uma página que promete dado auditável. O que
 * segura o preço é a LISTA FIXA de veículos, aprovada por ele em 30/Jul, mais
 * dois filtros que só apareceram ao rodar. Tudo em `lib/us-press/collect.mjs`.
 *
 * Roda 3x ao dia porque notícia envelhece rápido, e a seção mostrando matéria
 * de ontem numa página de eleição ao vivo seria pior do que não ter seção.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: Request) {
  const naoAutorizado = requireCronAuth(request)
  if (naoAutorizado) return naoAutorizado

  const t0 = Date.now()
  try {
    const dados = await coletarImprensaUs({ maximo: 10 })

    // ⛔ Mesmo portão do generic ballot: leitura vazia NÃO grava por cima de uma
    // boa. Google News fora do ar ou mudança de formato chegam aqui como zero
    // itens, e sobrescrever apagaria a seção em silêncio.
    if (!dados?.itens?.length) {
      return NextResponse.json(
        {
          ok: false,
          motivo: 'nenhum item na lista; nada foi gravado',
          lidos: dados?.qualidade?.lidos ?? 0,
          falhas: dados?.qualidade?.consultasComFalha ?? [],
          ms: Date.now() - t0,
        },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { ok: false, motivo: 'banco indisponível', ms: Date.now() - t0 },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    await upsertAnalysisReport(prisma, 'us-press', dados as unknown as Record<string, unknown>, {
      createdBy: 'system:cron-us-press',
      fallbackIsoDate: dados.lastUpdate,
    })

    return NextResponse.json(
      { ok: true, lastUpdate: dados.lastUpdate, qualidade: dados.qualidade, ms: Date.now() - t0 },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (e) {
    // Redação antes de ir para o CORPO da resposta. Regra única em
    // lib/cron/redigir.ts: esta rota devolvia a mensagem crua, e mensagem de
    // driver de banco carrega a string de conexão inteira.
    const msg = redigirSegredo(e)
    console.error('[cron:refresh-us-press]', msg)
    return NextResponse.json(
      { ok: false, motivo: msg, ms: Date.now() - t0 },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
