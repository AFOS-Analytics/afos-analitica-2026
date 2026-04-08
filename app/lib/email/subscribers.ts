/**
 * Subscriber Service — Persistência de emails no Redis
 *
 * Estrutura no Redis:
 *   SET  afos:subscribers           → Set com todos os emails (dedup)
 *   HASH afos:subscriber:{email}   → Metadados do subscriber
 *
 * Campos do subscriber:
 *   email, source, status, consentVersion, createdAt, updatedAt
 */

import { Redis } from '@upstash/redis';

const KEYS = {
  SUBSCRIBERS_SET: 'afos:subscribers',
  subscriberHash: (email: string) => `afos:subscriber:${email.toLowerCase().trim()}`,
} as const;

export interface Subscriber {
  email: string;
  source: string;
  status: 'active' | 'unsubscribed';
  consentVersion: string;
  createdAt: string;
  updatedAt: string;
}

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/**
 * Validar formato de email (backend).
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

/**
 * Verificar se email já existe.
 */
export async function subscriberExists(email: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const normalized = email.toLowerCase().trim();
  return await redis.sismember(KEYS.SUBSCRIBERS_SET, normalized) === 1;
}

/**
 * Criar subscriber (idempotente — se já existe, atualiza updatedAt e retorna sucesso).
 */
export async function createSubscriber(email: string, source: string = 'popup'): Promise<{ success: boolean; isNew: boolean; error?: string }> {
  const redis = getRedis();
  if (!redis) {
    console.error('[subscribers] Redis não disponível');
    return { success: false, isNew: false, error: 'storage_unavailable' };
  }

  const normalized = email.toLowerCase().trim();

  if (!isValidEmail(normalized)) {
    return { success: false, isNew: false, error: 'invalid_email' };
  }

  try {
    // Verificar se já existe
    const exists = await redis.sismember(KEYS.SUBSCRIBERS_SET, normalized) === 1;

    if (exists) {
      // Idempotente: atualizar updatedAt, não criar duplicata
      await redis.hset(KEYS.subscriberHash(normalized), {
        updatedAt: new Date().toISOString(),
      });
      console.log(`[subscribers] Email já existente (idempotente): ${normalized.slice(0, 3)}***`);
      return { success: true, isNew: false };
    }

    // Criar novo subscriber
    const now = new Date().toISOString();
    const subscriber: Subscriber = {
      email: normalized,
      source,
      status: 'active',
      consentVersion: '1.0',
      createdAt: now,
      updatedAt: now,
    };

    const pipeline = redis.pipeline();
    pipeline.sadd(KEYS.SUBSCRIBERS_SET, normalized);
    pipeline.hset(KEYS.subscriberHash(normalized), subscriber as unknown as Record<string, string>);
    await pipeline.exec();

    console.log(`[subscribers] Novo subscriber: ${normalized.slice(0, 3)}***`);
    return { success: true, isNew: true };
  } catch (error) {
    console.error('[subscribers] Erro ao criar subscriber:', error);
    return { success: false, isNew: false, error: 'internal_error' };
  }
}

/**
 * Marcar subscriber como unsubscribed.
 */
export async function unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
  const redis = getRedis();
  if (!redis) return { success: false, error: 'storage_unavailable' };

  const normalized = email.toLowerCase().trim();

  try {
    const exists = await redis.sismember(KEYS.SUBSCRIBERS_SET, normalized) === 1;
    if (!exists) return { success: true }; // Idempotente

    await redis.hset(KEYS.subscriberHash(normalized), {
      status: 'unsubscribed',
      updatedAt: new Date().toISOString(),
    });

    console.log(`[subscribers] Unsubscribe: ${normalized.slice(0, 3)}***`);
    return { success: true };
  } catch (error) {
    console.error('[subscribers] Erro ao unsubscribe:', error);
    return { success: false, error: 'internal_error' };
  }
}

/**
 * Contar total de subscribers ativos.
 */
export async function countSubscribers(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  try {
    return await redis.scard(KEYS.SUBSCRIBERS_SET);
  } catch {
    return 0;
  }
}
