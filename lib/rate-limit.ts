import { Redis } from '@upstash/redis'

/**
 * Rate-limit por chave via Upstash (INCR + EXPIRE).
 *
 * Retorna `true` quando o número de chamadas ULTRAPASSA `limit` na janela (o caller deve
 * responder 429). No-op (retorna `false`) quando o Redis não está configurado — fail-OPEN
 * é intencional para estes guards de abuso não-críticos (popup/visitor): a rota segue
 * funcionando em dev local sem Redis. NÃO confundir com o rate-limit do middleware, que é
 * fail-CLOSED por proteger superfícies sensíveis.
 *
 * Extraído no EVAL 06/Jun para deduplicar o bloco inline repetido em visitor/migrate e
 * visitor/dismiss (mesmo padrão, mesma política).
 */
export async function isRateLimited(key: string, limit: number, windowSec: number): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return false
  const redis = new Redis({ url, token })
  const attempts = await redis.incr(key)
  if (attempts === 1) await redis.expire(key, windowSec)
  return attempts > limit
}
