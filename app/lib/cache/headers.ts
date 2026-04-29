/**
 * Cache Multi-Camada para AFOS Analytics
 *
 * Usuário → Browser (5min) → Vercel Edge (30min) → KV (<1ms; cron 30min) → origem
 *
 * TTLs alinhados à frequência do cron de 30min: CDN cacheia até a próxima
 * atualização do cron; browser cacheia 5min para reload rápido.
 *
 * Apenas os profiles efetivamente usados estão aqui.
 */

export interface CacheProfile {
  vercelCdn: string;
  cdn: string;
  browser: string;
}

/** Mapa global: dados de eleições, atualizado pelo cron a cada 30min. */
export const CACHE_GLOBAL_MAP: CacheProfile = {
  vercelCdn: 'max-age=1800, stale-while-revalidate=3600',
  cdn: 'max-age=900, stale-while-revalidate=1800',
  browser: 'public, max-age=300',
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
