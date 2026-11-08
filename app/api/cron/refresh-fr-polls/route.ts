import { NextResponse } from 'next/server'
import { upsertAnalysisReport } from '../../../../lib/analysis/persist'
import { getPrisma } from '../../../../lib/db'
import { requireCronAuth } from '../../../../lib/cron/auth'
import { coletarPesquisasFr } from '../../../../lib/fr-polls/collect.mjs'
import { redigirSegredo } from '../../../../lib/cron/redigir'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'

/**
 * Pesquisas da presidencial francesa de 2027. Criado 08/Nov/2026.
 *
 * Cruza a base MieuxVoter com as fichas oficiais da Commission des sondages
 * (regras em `lib/fr-polls/collect.mjs`) e grava em `analysis_reports`, tipo
 * `fr-polls`. Nenhuma tela lê isto ainda: o painel da França não existe.
 *
 * 2x ao dia (07:40 e 19:40 UTC): pesquisa francesa sai de manhã e à noite.
 * 🔏 Só GRAVA quando a assinatura do conteúdo muda; dia sem pesquisa nova não
 * acrescenta 300 KB repetidos ao banco.
 *
 * ⛔ Leitura com falha em qualquer das duas fontes NÃO grava: sem a Commission
 * não há conferência, e sem a base não há número. Gravar pela metade apagaria
 * a última leitura boa do dia.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const naoAutorizado = requireCronAuth(request)
  if (naoAutorizado) return naoAutorizado

  const t0 = Date.now()
  try {
    const dados = await coletarPesquisasFr()
    const q = dados.qualidade

    if (q.falhas.length || !q.pesquisas || !q.fichasNaListagem) {
      void avisarFalhaDeCron('refresh-fr-polls', 'fonte indisponível; nada gravado', new Error(q.falhas.join(' | ') || 'zero pesquisas ou zero fichas'))
      return NextResponse.json({ ok: false, motivo: 'fonte indisponível; nada foi gravado', qualidade: q, ms: Date.now() - t0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
    }

    const prisma = getPrisma()
    if (!prisma) {
      return NextResponse.json({ ok: false, motivo: 'banco indisponível', ms: Date.now() - t0 }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
    }

    const ultimo = await prisma.analysisReport.findFirst({
      where: { slug: { startsWith: 'fr-polls-' } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, bodyMarkdown: true },
    })
    let assinaturaAnterior: string | null = null
    try {
      assinaturaAnterior = ultimo ? (JSON.parse(ultimo.bodyMarkdown) as { assinatura?: string }).assinatura ?? null : null
    } catch {
      assinaturaAnterior = null
    }
    if (assinaturaAnterior === dados.assinatura) {
      return NextResponse.json({ ok: true, gravado: false, motivo: `sem mudança desde ${ultimo?.slug}`, qualidade: q, ms: Date.now() - t0 }, { headers: { 'Cache-Control': 'no-store' } })
    }

    await upsertAnalysisReport(prisma, 'fr-polls', dados as unknown as Record<string, unknown>, {
      createdBy: 'system:cron-fr-polls',
      fallbackIsoDate: dados.lastUpdate,
    })

    return NextResponse.json({ ok: true, gravado: true, assinatura: dados.assinatura, qualidade: q, ms: Date.now() - t0 }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    void avisarFalhaDeCron('refresh-fr-polls', 'excecao nao tratada', e)
    const msg = redigirSegredo(e)
    console.error('[cron:refresh-fr-polls]', msg)
    return NextResponse.json({ ok: false, motivo: msg, ms: Date.now() - t0 }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}
