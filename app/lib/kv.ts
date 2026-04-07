/**
 * Vercel KV Wrapper
 *
 * Abstrai o acesso ao Vercel KV com fallback graceful.
 * Se KV não estiver configurado (dev local), opera sem cache distribuído.
 *
 * Para configurar KV em produção:
 * 1. Vercel Dashboard → Storage → Create KV Database
 * 2. Conectar ao projeto → env vars são injetadas automaticamente
 */

import { kv } from '@vercel/kv';

const KV_KEYS = {
  GLOBAL_MAP: 'afos:global-map:latest',
  GLOBAL_MAP_TIMESTAMP: 'afos:global-map:timestamp',
  POLYMARKET_RAW: 'afos:polymarket:raw',
} as const;

/**
 * Verifica se o KV está configurado (env vars presentes).
 */
function isKvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Gravar dados do mapa global no KV.
 * TTL: 10 minutos (dados ficam disponíveis mesmo se cron falhar).
 */
export async function writeGlobalMapData(data: unknown): Promise<boolean> {
  if (!isKvAvailable()) {
    console.warn('[kv] KV não configurado — dados não persistidos');
    return false;
  }

  try {
    await kv.set(KV_KEYS.GLOBAL_MAP, JSON.stringify(data), { ex: 600 }); // 10min TTL
    await kv.set(KV_KEYS.GLOBAL_MAP_TIMESTAMP, new Date().toISOString(), { ex: 600 });
    console.log('[kv] Dados do mapa global gravados com sucesso');
    return true;
  } catch (error) {
    console.error('[kv] Erro ao gravar:', error);
    return false;
  }
}

/**
 * Ler dados do mapa global do KV.
 * Retorna null se KV não disponível ou dados expirados.
 */
export async function readGlobalMapData<T>(): Promise<{ data: T; timestamp: string } | null> {
  if (!isKvAvailable()) {
    return null;
  }

  try {
    const [rawData, timestamp] = await Promise.all([
      kv.get<string>(KV_KEYS.GLOBAL_MAP),
      kv.get<string>(KV_KEYS.GLOBAL_MAP_TIMESTAMP),
    ]);

    if (!rawData || !timestamp) return null;

    const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    return { data: data as T, timestamp: timestamp as string };
  } catch (error) {
    console.error('[kv] Erro ao ler:', error);
    return null;
  }
}

export { KV_KEYS, isKvAvailable };
