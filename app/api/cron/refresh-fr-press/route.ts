import { NextResponse } from 'next/server'
import { upsertAnalysisReport } from '../../../../lib/analysis/persist'
import { getPrisma } from '../../../../lib/db'
import { requireCronAuth } from '../../../../lib/cron/auth'
// Módulo JS puro, com a lista fixa de veículos e os filtros.
import { coletarImprensaFr } from '../../../../lib/fr-press/collect.mjs'
import { redigirSegredo } from '../../../../lib/cron/redigir'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'
import { avisarComTrava } from '../../../lib/cron/health-alerts'

// Um aviso por dia, no máximo, para a mesma quebra: a rota roda 3x ao dia.
const TRAVA_AVISO_S = 20 * 60 * 60

/**
 * Imprensa da presidencial francesa de 2027. Criado 08/Nov/2026, cópia da
 * rota dos EUA (`refresh-us-press`) com o coletor da França.
 *
 * ⚠️ ENTRA AUTOMÁTICO, pela mesma regra dos EUA: só de veículo da LISTA FIXA,
 * que aqui ainda é PROVISÓRIA e aguarda aprovação do André. Tudo em
 * `lib/fr-press/collect.mjs`. Grava em `analysis_reports` (tipo `fr-press`);
 * nenhuma tela lê isto ainda: o painel da França não existe.
 *
 * Roda 3x ao dia (06:25, 12:25 e 18:25 UTC), como os EUA. Horários em UTC
 * escolhidos para cair de manhã, no almoço e no começo da noite em Paris.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: Request) {
  const naoAutorizado = requireCronAuth(request)
  if (naoAutorizado) return naoAutorizado

  const t0 = Date.now()
  try {
    const dados = await coletarImprensaFr({ maximo: 10 })

    // ⛔ Mesmo portão do generic ballot: leitura vazia NÃO grava por cima de uma
    // boa. Google News fora do ar ou mudança de formato chegam aqui como zero
    // itens, e sobrescrever apagaria a seção em silêncio.
    if (!dados?.itens?.length) {
      // O 502 sozinho não avisa ninguém: o cron da Vercel não notifica status
      // de erro e a rota exige CRON_SECRET. O e-mail é o único canal.
      const falhas: string[] = dados?.qualidade?.consultasComFalha ?? []
      await avisarComTrava('refresh-fr-press:vazia', TRAVA_AVISO_S, () =>
        avisarFalhaDeCron('refresh-fr-press', 'nenhum item na lista; nada gravado', new Error(falhas.join(' | ') || 'zero itens')),
      )
      return NextResponse.json(
        {
          ok: false,
          motivo: 'nenhum item na lista; nada foi gravado',
          lidos: (dados?.qualidade?.lidosEmFeedProprio ?? 0) + (dados?.qualidade?.lidosNoGoogle ?? 0),
          falhas: dados?.qualidade?.consultasComFalha ?? [],
          ms: Date.now() - t0,
        },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const prisma = getPrisma()
    if (!prisma) {
      await avisarComTrava('refresh-fr-press:sem-banco', TRAVA_AVISO_S, () =>
        avisarFalhaDeCron('refresh-fr-press', 'banco indisponivel; nada gravado'),
      )
      return NextResponse.json(
        { ok: false, motivo: 'banco indisponível', ms: Date.now() - t0 },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    await upsertAnalysisReport(prisma, 'fr-press', dados as unknown as Record<string, unknown>, {
      createdBy: 'system:cron-fr-press',
      fallbackIsoDate: dados.lastUpdate,
    })

    return NextResponse.json(
      { ok: true, lastUpdate: dados.lastUpdate, qualidade: dados.qualidade, ms: Date.now() - t0 },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (e) {
    // Alerta por email. Este cron falhava em SILENCIO: dos sete declarados,
    // so `persist-analysis` avisava alguem. Nao bloqueia nem derruba nada.
    await avisarFalhaDeCron('refresh-fr-press', 'excecao nao tratada', e)
    // Redação antes de ir para o CORPO da resposta. Regra única em
    // lib/cron/redigir.ts: esta rota devolvia a mensagem crua, e mensagem de
    // driver de banco carrega a string de conexão inteira.
    const msg = redigirSegredo(e)
    console.error('[cron:refresh-fr-press]', msg)
    return NextResponse.json(
      { ok: false, motivo: msg, ms: Date.now() - t0 },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
