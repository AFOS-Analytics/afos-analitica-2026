import { sendSystemAlert } from '../../app/lib/email/resend'
import { redigirSegredo } from './redigir'

/**
 * Aviso de falha de cron, por email.
 *
 * 🔴 POR QUE EXISTE, medido em 19/Ago/2026 pelo crítico de cobertura do EVAL:
 * dos SETE crons declarados em `vercel.json`, apenas `persist-analysis` avisava
 * alguém quando falhava. Os outros seis falhavam em silêncio, e entre eles está
 * o `refresh-elections`, que alimenta a série de preços de 30 em 30 minutos.
 *
 * ⚠️ E essa série é a única coisa do banco que **não se reconstrói**: o próprio
 * `backup-neon.yml` registra isso. O `docs/OPERATIONS.md` admitia "cron stale,
 * conferência manual semanal", ou seja, até SETE DIAS de buraco antes de alguém
 * notar, num job que roda a cada meia hora.
 *
 * ⛔ Falha de alerta NUNCA derruba o cron. Gravar o dado importa mais que avisar
 * sobre ele: o `catch` aqui é deliberado, e o mesmo padrão já vale no alerta de
 * pesquisa nacional de `refresh-polls`.
 */
export async function avisarFalhaDeCron(
  rota: string,
  motivo: string,
  detalhe?: unknown
): Promise<void> {
  const destino = process.env.ALERT_EMAIL || 'alerts@afos-analytics.com'
  try {
    await sendSystemAlert(destino, {
      type: `cron-falhou:${rota}`,
      message: `O cron ${rota} não completou: ${motivo}`,
      // Redação antes de sair, porque alerta é email e email circula.
      details: [
        `rota: ${rota}`,
        `motivo: ${motivo}`,
        detalhe ? `detalhe: ${redigirSegredo(detalhe, 500)}` : null,
        `quando: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
  } catch (e) {
    console.error(`[cron/${rota}] o próprio alerta falhou:`, e)
  }
}
