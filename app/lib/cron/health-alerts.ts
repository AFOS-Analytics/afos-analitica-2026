/**
 * Cron health alerts — envia email para alerts@ se cron crítico falha.
 * Throttle 1 hora por job (evita spam se cron quebrar em loop).
 */

import { Redis } from '@upstash/redis'
import { sendSystemAlert } from '../email/resend'
import { EMAIL_ALERTS } from '../contacts'

const THROTTLE_SECONDS = 60 * 60 // 1h

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? new Redis({ url, token }) : null
}

/**
 * Envia um aviso no máximo uma vez por janela (`ttlSeg`), com trava no Redis.
 *
 * Para crons que rodam várias vezes ao dia e podem falhar do mesmo jeito em
 * todas (leitura vazia de imprensa, portão do generic ballot): sem trava, a
 * mesma quebra mandaria 3 e-mails por dia; com a trava, um.
 *
 * A trava é DEVOLVIDA quando o envio não sai, para que a rodada seguinte tente
 * de novo. Sem Redis, envia sempre: melhor repetido que calado.
 */
export async function avisarComTrava(
  chave: string,
  ttlSeg: number,
  enviar: () => Promise<boolean>,
): Promise<void> {
  const redis = getRedis()
  const k = `afos:cron-alert:${chave}`
  if (redis) {
    const r = await redis.set(k, '1', { nx: true, ex: ttlSeg }).catch((err) => {
      console.error('[cron-alerts] trava do Redis indisponivel, enviando sem trava:', err)
      return 'OK' as const
    })
    if (r !== 'OK') {
      console.warn(`[cron-alerts] aviso ${chave} ja enviado nesta janela; nao repetido`)
      return
    }
  }
  const ok = await enviar().catch(() => false)
  if (!ok && redis) await redis.del(k).catch(() => {})
}

export async function sendCronFailureAlert(
  job: string,
  reason: string,
  elapsed: number,
): Promise<void> {
  // Throttle via Redis: se já alertou pra esse job na última hora, skip.
  // A trava é tomada antes do envio (nx evita dois envios simultâneos) e
  // DEVOLVIDA quando o envio não sai: sem isso, um e-mail perdido deixava a
  // trava bloqueando o aviso da hora seguinte.
  const redis = getRedis()
  const throttleKey = `afos:cron-alert:${job}`
  if (redis) {
    const recent = await redis.set(throttleKey, '1', { nx: true, ex: THROTTLE_SECONDS }).catch((err) => {
      console.error('[cron-alerts] trava do Redis indisponivel, enviando sem throttle:', err)
      return 'OK' as const
    })
    if (recent !== 'OK') return // já alertou
  }

  const ok = await sendSystemAlert(EMAIL_ALERTS, {
    type: `cron-failure: ${job}`,
    message: `Cron ${job} falhou em ${new Date().toISOString()}`,
    details: `Reason: ${reason} | Elapsed: ${elapsed}ms | Verificar /api/health e logs Vercel.`,
  }).catch((err) => {
    console.error('[cron-alerts] sendSystemAlert failed:', err)
    return false
  })

  if (!ok) {
    console.error(`[cron-alerts] o próprio alerta de ${job} falhou (envio devolveu false); trava liberada`)
    if (redis) await redis.del(throttleKey).catch(() => {})
  }
}
