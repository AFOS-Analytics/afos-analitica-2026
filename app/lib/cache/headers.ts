/**
 * Multi-Layer Cache Strategy for AFOS Analytics
 *
 * Three cache layers, each with a distinct purpose:
 *
 * LAYER 1: Vercel Edge Network (CDN)
 *   Vercel-CDN-Cache-Control: max-age=60
 *   → Vercel's own CDN caches the response for 60 seconds.
 *   → All users worldwide hit the edge, not the origin function.
 *   → After 60s, ONE request goes to origin; others get stale.
 *   → This is the PRIMARY performance layer — absorbs 99% of traffic.
 *
 * LAYER 2: Downstream CDNs (Cloudflare, ISP caches, corporate proxies)
 *   CDN-Cache-Control: max-age=30, stale-while-revalidate=120
 *   → Any intermediate CDN caches for 30s, serves stale for up to 2min.
 *   → Prevents thundering herd if Vercel edge expires.
 *   → The stale-while-revalidate window ensures users never wait.
 *
 * LAYER 3: Browser
 *   Cache-Control: public, max-age=15
 *   → Browser caches for 15 seconds only.
 *   → Short TTL ensures the user sees reasonably fresh data.
 *   → "public" allows shared caches (CDNs) to store it.
 *   → After 15s, browser revalidates (but hits Vercel edge, not origin).
 *
 * INTERACTION FLOW:
 *   User request → Browser cache (15s) → CDN cache (30s) → Vercel edge (60s) → Origin function
 *
 *   99% of requests stop at Vercel edge.
 *   Origin function runs at most once per 60 seconds.
 *   Users never see a loading spinner after first visit.
 *
 * WHY THREE LAYERS:
 *   - Browser (15s): fast, but we want data reasonably fresh for active users
 *   - CDN (30s): absorbs multi-region traffic between edge refreshes
 *   - Vercel (60s): protects origin from burst traffic, single source of truth
 *   - stale-while-revalidate: users ALWAYS get instant response, even during refresh
 */

// ─── Cache Profiles ─────────────────────────────────────────────────

export interface CacheProfile {
  /** Vercel-CDN-Cache-Control header value */
  vercelCdn: string;
  /** CDN-Cache-Control header value (downstream CDNs) */
  cdn: string;
  /** Cache-Control header value (browser) */
  browser: string;
}

/**
 * Global Map API: election data, updates hourly.
 * Aggressive caching — data changes slowly.
 */
export const CACHE_GLOBAL_MAP: CacheProfile = {
  vercelCdn: 'max-age=300, stale-while-revalidate=600',   // 5min edge, 10min stale
  cdn: 'max-age=120, stale-while-revalidate=300',          // 2min CDN, 5min stale
  browser: 'public, max-age=60',                            // 1min browser
};

/**
 * Polymarket odds: real-time data, changes frequently.
 * Balanced caching — fresh but not expensive.
 */
export const CACHE_POLYMARKET: CacheProfile = {
  vercelCdn: 'max-age=60, stale-while-revalidate=120',    // 1min edge, 2min stale
  cdn: 'max-age=30, stale-while-revalidate=120',           // 30s CDN, 2min stale
  browser: 'public, max-age=15',                            // 15s browser
};

/**
 * News feed: updates every 30 minutes.
 * Moderate caching.
 */
export const CACHE_NEWS: CacheProfile = {
  vercelCdn: 'max-age=120, stale-while-revalidate=300',   // 2min edge, 5min stale
  cdn: 'max-age=60, stale-while-revalidate=180',           // 1min CDN, 3min stale
  browser: 'public, max-age=30',                            // 30s browser
};

/**
 * Static analysis data: updates manually/via cron.
 * Heavy caching.
 */
export const CACHE_ANALYSIS: CacheProfile = {
  vercelCdn: 'max-age=600, stale-while-revalidate=1200',  // 10min edge, 20min stale
  cdn: 'max-age=300, stale-while-revalidate=600',          // 5min CDN, 10min stale
  browser: 'public, max-age=120',                           // 2min browser
};

/**
 * Polls data: updates daily at most.
 * Heaviest caching.
 */
export const CACHE_POLLS: CacheProfile = {
  vercelCdn: 'max-age=1800, stale-while-revalidate=3600', // 30min edge, 1h stale
  cdn: 'max-age=900, stale-while-revalidate=1800',        // 15min CDN, 30min stale
  browser: 'public, max-age=300',                           // 5min browser
};

// ─── Header Builder ─────────────────────────────────────────────────

/**
 * Build response headers for a given cache profile.
 * Also includes security headers for API responses.
 */
export function buildCacheHeaders(profile: CacheProfile, dataStatus: string = 'fresh'): Record<string, string> {
  return {
    'Cache-Control': profile.browser,
    'CDN-Cache-Control': profile.cdn,
    'Vercel-CDN-Cache-Control': profile.vercelCdn,
    'X-Data-Status': dataStatus,
    'X-Content-Type-Options': 'nosniff',
  };
}

/**
 * No-cache headers for error responses.
 */
export function buildNoCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
}
