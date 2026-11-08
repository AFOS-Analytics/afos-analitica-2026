import { NextResponse } from 'next/server'
import { requireCronAuth } from '../../../../lib/cron/auth'
import { avisarFalhaDeCron } from '../../../../lib/cron/alerta'
import { getPrisma } from '../../../../lib/db'
import { capturarKalshi } from '../../../../lib/kalshi/persist'

/**
 * Coleta da Kalshi, o segundo livro de mercado do painel da França.
 * Criado 08/Nov/2026. A cada 30 min, deslocado 15 min do refresh-elections
 * (Polymarket), para as duas coletas não disputarem a mesma janela.
 *
 * Grava SEMPRE uma linha em `kalshi_capturas`, com ou sem defeito; preço só
 * quando a captura passa na avaliação (lib/kalshi/leitura.ts) e a regra de
 * gravação manda (lib/kalshi/persist.ts).
 *
 * ⚠️ Coletar não é mostrar: a Kalshi só aparece na tela depois de 14 dias de
 * captura sem defeito (lib/kalshi/prontidao.ts, `npx tsx scripts/kalshi-prontidao.ts`).
 *
 * HTTP 503 quando alguma captura teve defeito, para o monitoramento enxergar;
 * o defeito já está gravado no diário de capturas.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const naoAutorizado = requireCronAuth(request)
  if (naoAutorizado) return naoAutorizado

  const t0 = Date.now()
  try {
    const inicio = new Date()
    const capturas = await capturarKalshi('fra', 'cron')
    const ok = capturas.every((c) => c.ok)
    // 📧 Avisa só na VIRADA para defeito: com a Kalshi fora por um dia, avisar
    // em toda rodada seriam 48 e-mails iguais. O diário guarda todas.
    const anterior = await getPrisma()?.kalshiCaptura.findFirst({
      where: { pais: 'fra', startedAt: { lt: inicio } },
      orderBy: { startedAt: 'desc' },
      select: { ok: true },
    })
    if (!ok && anterior?.ok !== false) {
      const resumo = capturas.filter((c) => !c.ok).map((c) => `${c.eventTicker}: ${c.defeitos.join('; ')}`).join(' | ')
      void avisarFalhaDeCron('refresh-kalshi', 'captura com defeito', new Error(resumo))
    }
    return NextResponse.json(
      { ok, pais: 'fra', capturas, elapsed: Date.now() - t0 },
      { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    void avisarFalhaDeCron('refresh-kalshi', 'excecao nao tratada', error)
    console.error('[cron kalshi] erro fatal:', error)
    return NextResponse.json(
      { ok: false, error: 'internal', elapsed: Date.now() - t0 },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
