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

export async function sendCronFailureAlert(
  job: string,
  reason: string,
  elapsed: number,
): Promise<void> {
  // Throttle via Redis: se já alertou pra esse job na última hora, skip
  const redis = getRedis()
  if (redis) {
    const throttleKey = `afos:cron-alert:${job}`
    const recent = await redis.set(throttleKey, '1', { nx: true, ex: THROTTLE_SECONDS })
    if (recent !== 'OK') return // já alertou
  }

  await sendSystemAlert(EMAIL_ALERTS, {
    type: `cron-failure: ${job}`,
    message: `Cron ${job} falhou em ${new Date().toISOString()}`,
    details: `Reason: ${reason} | Elapsed: ${elapsed}ms | Verificar /api/health e logs Vercel.`,
  }).catch((err) => console.error('[cron-alerts] sendSystemAlert failed:', err))
}
