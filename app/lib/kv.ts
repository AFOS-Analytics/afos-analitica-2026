/**
 * Upstash Redis Wrapper
 *
 * Substitui o Vercel KV (descontinuado em dez/2024) por Upstash Redis.
 * Fallback graceful se Redis não estiver configurado.
 *
 * Configurar em produção:
 *   Opção A: Vercel Dashboard → Marketplace → Upstash Redis → Install → Connect
 *   Opção B: console.upstash.com → Create Database → copiar URL + TOKEN
 *
 * Env vars (injetadas automaticamente pelo Vercel ao conectar Upstash):
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

import { Redis } from '@upstash/redis';

const KV_KEYS = {
  GLOBAL_MAP: 'afos:global-map:latest',
  GLOBAL_MAP_TIMESTAMP: 'afos:global-map:timestamp',
} as const;

/**
 * Cria instância Redis lazy (só quando as env vars existem).
 */
function getRedis(): Redis | null {
  // Tenta os dois formatos de env var (Vercel Marketplace e manual)
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return new Redis({ url, token });
}

/**
 * Verifica se o Redis está configurado.
 */
function isRedisAvailable(): boolean {
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

/**
 * Gravar dados do mapa global no Redis.
 * TTL: 10 minutos (dados ficam disponíveis mesmo se cron falhar).
 */
export async function writeGlobalMapData(data: unknown): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.warn('[kv] Redis não configurado — dados não persistidos');
    return false;
  }

  try {
    const pipeline = redis.pipeline();
    pipeline.set(KV_KEYS.GLOBAL_MAP, JSON.stringify(data), { ex: 600 }); // 10min TTL
    pipeline.set(KV_KEYS.GLOBAL_MAP_TIMESTAMP, new Date().toISOString(), { ex: 600 });
    await pipeline.exec();
    console.log('[kv] Dados gravados no Redis com sucesso');
    return true;
  } catch (error) {
    console.error('[kv] Erro ao gravar no Redis:', error);
    return false;
  }
}

/**
 * Ler dados do mapa global do Redis.
 * Retorna null se Redis não disponível ou dados expirados.
 */
export async function readGlobalMapData<T>(): Promise<{ data: T; timestamp: string } | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const pipeline = redis.pipeline();
    pipeline.get(KV_KEYS.GLOBAL_MAP);
    pipeline.get(KV_KEYS.GLOBAL_MAP_TIMESTAMP);
    const [rawData, timestamp] = await pipeline.exec();

    if (!rawData || !timestamp) return null;

    const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    return { data: data as T, timestamp: timestamp as string };
  } catch (error) {
    console.error('[kv] Erro ao ler do Redis:', error);
    return null;
  }
}

export { KV_KEYS, isRedisAvailable as isKvAvailable };
