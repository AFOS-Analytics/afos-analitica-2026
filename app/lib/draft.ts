/**
 * Draft Manager — Sistema de rascunho + aprovação
 *
 * Fluxo:
 *   Cron (4h) → gera draft → Redis (TTL 24h)
 *   Email → link "Aprovar" com token
 *   /api/approve-draft?token=xxx → move draft → live
 *   APIs leem live do Redis → fallback JSON estático
 *
 * Redis keys:
 *   afos:draft:analysis-data       → rascunho (cards)
 *   afos:draft:analysis-criteriosa → rascunho (criteriosa)
 *   afos:draft:token               → token de aprovação
 *   afos:draft:created-at          → timestamp do draft
 *   afos:live:analysis-data        → dados aprovados (cards)
 *   afos:live:analysis-criteriosa  → dados aprovados (criteriosa)
 */

import { Redis } from '@upstash/redis';

const KEYS = {
  DRAFT_CARDS: 'afos:draft:analysis-data',
  DRAFT_CRIT: 'afos:draft:analysis-criteriosa',
  DRAFT_TOKEN: 'afos:draft:token',
  DRAFT_CREATED: 'afos:draft:created-at',
  LIVE_CARDS: 'afos:live:analysis-data',
  LIVE_CRIT: 'afos:live:analysis-criteriosa',
} as const;

const DRAFT_TTL = 86400; // 24 horas

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/**
 * Gerar token único para aprovação.
 */
function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

/**
 * Salvar draft no Redis.
 * Retorna o token de aprovação.
 */
export async function saveDraft(
  cardsData: unknown,
  critData: unknown
): Promise<{ token: string; error?: string }> {
  const redis = getRedis();
  if (!redis) return { token: '', error: 'redis_unavailable' };

  const token = generateToken();
  const now = new Date().toISOString();

  try {
    const pipeline = redis.pipeline();
    pipeline.set(KEYS.DRAFT_CARDS, JSON.stringify(cardsData), { ex: DRAFT_TTL });
    pipeline.set(KEYS.DRAFT_CRIT, JSON.stringify(critData), { ex: DRAFT_TTL });
    pipeline.set(KEYS.DRAFT_TOKEN, token, { ex: DRAFT_TTL });
    pipeline.set(KEYS.DRAFT_CREATED, now, { ex: DRAFT_TTL });
    await pipeline.exec();

    console.log('[draft] Rascunho salvo com sucesso');
    return { token };
  } catch (error) {
    console.error('[draft] Erro ao salvar:', error);
    return { token: '', error: 'save_failed' };
  }
}

/**
 * Aprovar draft: mover de draft → live.
 * Valida token antes de aprovar.
 */
export async function approveDraft(token: string): Promise<{ success: boolean; error?: string }> {
  const redis = getRedis();
  if (!redis) return { success: false, error: 'redis_unavailable' };

  try {
    // Validar token
    const storedToken = await redis.get<string>(KEYS.DRAFT_TOKEN);
    if (!storedToken || storedToken !== token) {
      return { success: false, error: 'invalid_token' };
    }

    // Ler drafts
    const [cardsRaw, critRaw] = await Promise.all([
      redis.get<string>(KEYS.DRAFT_CARDS),
      redis.get<string>(KEYS.DRAFT_CRIT),
    ]);

    if (!cardsRaw || !critRaw) {
      return { success: false, error: 'draft_expired' };
    }

    // Mover para live (sem TTL — persiste até próxima aprovação)
    const pipeline = redis.pipeline();
    pipeline.set(KEYS.LIVE_CARDS, cardsRaw);
    pipeline.set(KEYS.LIVE_CRIT, critRaw);
    // Limpar draft
    pipeline.del(KEYS.DRAFT_CARDS);
    pipeline.del(KEYS.DRAFT_CRIT);
    pipeline.del(KEYS.DRAFT_TOKEN);
    pipeline.del(KEYS.DRAFT_CREATED);
    await pipeline.exec();

    console.log('[draft] Draft aprovado e publicado');
    return { success: true };
  } catch (error) {
    console.error('[draft] Erro ao aprovar:', error);
    return { success: false, error: 'approve_failed' };
  }
}

/**
 * Ler dados live do Redis (dados aprovados).
 * Retorna null se não existir (fallback para JSON estático).
 */
export async function readLiveData(key: 'cards' | 'criteriosa'): Promise<unknown | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const redisKey = key === 'cards' ? KEYS.LIVE_CARDS : KEYS.LIVE_CRIT;
    const raw = await redis.get<string>(redisKey);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

/**
 * Verificar se existe draft pendente.
 */
export async function hasPendingDraft(): Promise<{ pending: boolean; createdAt: string | null }> {
  const redis = getRedis();
  if (!redis) return { pending: false, createdAt: null };

  try {
    const createdAt = await redis.get<string>(KEYS.DRAFT_CREATED);
    return { pending: !!createdAt, createdAt: createdAt || null };
  } catch {
    return { pending: false, createdAt: null };
  }
}
