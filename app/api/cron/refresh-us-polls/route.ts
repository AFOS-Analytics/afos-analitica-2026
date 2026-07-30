import { NextResponse } from 'next/server'
import { upsertAnalysisReport } from '../../../../lib/analysis/persist'
import { prisma } from '../../../../lib/db'
import { requireCronAuth } from '../../../../lib/cron/auth'
// Módulo JS puro, compartilhado com o script manual.
import { coletarGenericBallot } from '../../../../lib/us-polls/collect.mjs'

/**
 * Coleta diária do generic ballot dos EUA.
 *
 * 🔴 O BURACO QUE ESTA ROTA FECHA: até 30/Jul o generic ballot só mudava quando
 * alguém rodava `scripts/parse-us-generic-ballot.mjs` à mão e publicava. Isso
 * não sobrevive a outubro, que tem 04/Out, 25/Out e 03/Nov, três eventos em 30
 * dias com daily em três idiomas.
 *
 * ⚠️ Em serverless NÃO há repositório para gravar, então a rota não escreve
 * arquivo: ela grava no Neon e o painel lê de lá, caindo para o arquivo
 * versionado quando o Neon não responde. O arquivo continua sendo gerado pelo
 * script, e é o piso de segurança, não a fonte viva.
 *
 * A lógica de leitura é a MESMA do script, em `lib/us-polls/collect.mjs`. Duas
 * cópias da mesma regra é o defeito que custou os rótulos de faixa do mercado
 * em 29/Jul: convivem sem incidente até o dia em que uma é corrigida e a outra
 * não.
 */
export const dynamic = 'force-dynamic'
// A Wikipédia costuma responder em 1-2s e o parse é local; 30s cobre pico.
export const maxDuration = 30

export async function GET(request: Request) {
  const naoAutorizado = requireCronAuth(request)
  if (naoAutorizado) return naoAutorizado

  const t0 = Date.now()
  try {
    const dados = await coletarGenericBallot({ dias: 30 })

    // ⛔ Portão: não grava leitura vazia por cima de uma boa. Wikipédia fora do
    // ar, mudança de estrutura da página ou parse quebrado chegam aqui como
    // zero pesquisas, e sobrescrever com zero apagaria o painel em silêncio.
    if (!dados?.polls?.length || !dados.mediaAfos) {
      return NextResponse.json(
        {
          ok: false,
          motivo: 'leitura vazia ou sem média; nada foi gravado',
          lidas: dados?.qualidade?.linhasLidas ?? 0,
          publicadas: dados?.polls?.length ?? 0,
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

    // Aguardado de propósito. Persistência sem `await` foi exatamente o defeito
    // que fazia a coleta de mercado perder linha de histórico em silêncio: em
    // serverless, devolver a resposta autoriza a plataforma a congelar a
    // instância e a gravação morre no meio.
    await upsertAnalysisReport(prisma, 'us-generic-ballot', dados as Record<string, unknown>, {
      createdBy: 'system:cron-us-polls',
      fallbackIsoDate: dados.lastUpdate,
    })

    return NextResponse.json(
      {
        ok: true,
        lastUpdate: dados.lastUpdate,
        lidas: dados.qualidade.linhasLidas,
        publicadas: dados.qualidade.publicadas,
        descartadasPorForma: dados.qualidade.descartadasPorForma,
        semFontePrimaria: dados.qualidade.semFontePrimaria,
        media: {
          dem: dados.mediaAfos.dem,
          rep: dados.mediaAfos.rep,
          vantagemDem: dados.mediaAfos.vantagemDem,
          nPesquisas: dados.mediaAfos.nPesquisas,
          nInstitutos: dados.mediaAfos.nInstitutos,
        },
        ms: Date.now() - t0,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
    console.error('[cron:refresh-us-polls]', msg)
    return NextResponse.json(
      { ok: false, motivo: msg, ms: Date.now() - t0 },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
