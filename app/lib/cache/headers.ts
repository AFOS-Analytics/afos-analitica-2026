/**
 * Cache Multi-Camada para AFOS Analytics
 *
 * Usuário → Browser (60s) → Vercel Edge (5min) → KV (<1ms) → origem
 *
 * Apenas os profiles efetivamente usados estão aqui.
 */

export interface CacheProfile {
  vercelCdn: string;
  cdn: string;
  browser: string;
}

/** Mapa global: dados de eleições, atualizado pelo cron a cada 60s. */
export const CACHE_GLOBAL_MAP: CacheProfile = {
  vercelCdn: 'max-age=300, stale-while-revalidate=600',
  cdn: 'max-age=120, stale-while-revalidate=300',
  browser: 'public, max-age=60',
};

/** Headers de cache para uma resposta de API. */
export function buildCacheHeaders(profile: CacheProfile, dataStatus: string = 'fresh'): Record<string, string> {
  return {
    'Cache-Control': profile.browser,
    'CDN-Cache-Control': profile.cdn,
    'Vercel-CDN-Cache-Control': profile.vercelCdn,
    'X-Data-Status': dataStatus,
    'X-Content-Type-Options': 'nosniff',
  };
}

/** Headers para respostas que NÃO devem ser cacheadas. */
export function buildNoCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
}
