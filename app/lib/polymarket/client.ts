/**
 * Polymarket API Client
 *
 * Handles all communication with gamma-api.polymarket.com.
 * Implements timeout, retry, circuit breaker, and strong typing.
 */

const BASE_URL = 'https://gamma-api.polymarket.com';
const DEFAULT_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 2_000;
const MAX_RETRIES = 1;

// ─── Types ──────────────────────────────────────────────────────────

export interface PolymarketRawMarket {
  question: string;
  conditionId: string;
  slug: string;
  outcomePrices: string;  // JSON string: '["0.42","0.58"]'
  outcomes: string;       // JSON string: '["Yes","No"]'
  volumeNum: number;
  active: boolean;
  closed: boolean;
}

export interface PolymarketRawEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  markets: PolymarketRawMarket[];
  volume: number;
  liquidity: number;
  startDate: string;
  endDate: string;
  active: boolean;
  closed: boolean;
  tags: string[];
}

export interface ParsedMarket {
  question: string;
  conditionId: string;
  yesPrice: number;
  noPrice: number;
  outcomes: string[];
  volume: number;
  active: boolean;
  closed: boolean;
}

export interface ParsedEvent {
  id: string;
  title: string;
  slug: string;
  markets: ParsedMarket[];
  totalVolume: number;
  active: boolean;
  closed: boolean;
}

// ─── Circuit Breaker ────────────────────────────────────────────────

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

const circuit = {
  state: 'CLOSED' as CircuitState,
  failureCount: 0,
  lastFailureAt: 0,
  cooldownMs: 5 * 60 * 1000, // 5 minutes
  threshold: 3,
};

function checkCircuit(): boolean {
  if (circuit.state === 'CLOSED') return true;
  if (circuit.state === 'OPEN') {
    if (Date.now() - circuit.lastFailureAt > circuit.cooldownMs) {
      circuit.state = 'HALF_OPEN';
      console.log('[polymarket-client] Circuit HALF_OPEN — attempting probe request');
      return true;
    }
    return false;
  }
  // HALF_OPEN: allow one request
  return true;
}

function recordSuccess(): void {
  if (circuit.state !== 'CLOSED') {
    console.log('[polymarket-client] Circuit CLOSED — recovered');
  }
  circuit.state = 'CLOSED';
  circuit.failureCount = 0;
}

function recordFailure(): void {
  circuit.failureCount++;
  circuit.lastFailureAt = Date.now();
  if (circuit.failureCount >= circuit.threshold || circuit.state === 'HALF_OPEN') {
    circuit.state = 'OPEN';
    console.warn(`[polymarket-client] Circuit OPEN — ${circuit.failureCount} consecutive failures, cooldown ${circuit.cooldownMs / 1000}s`);
  }
}

// ─── Core Fetch ─────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url: string, retries: number = MAX_RETRIES): Promise<Response | null> {
  if (!checkCircuit()) {
    console.warn('[polymarket-client] Circuit OPEN — skipping request:', url);
    return null;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url);

      if (res.status === 429) {
        console.warn('[polymarket-client] Rate limited (429), circuit opening');
        recordFailure();
        return null;
      }

      if (res.ok) {
        recordSuccess();
        return res;
      }

      // 5xx: retry
      if (res.status >= 500 && attempt < retries) {
        console.warn(`[polymarket-client] Server error ${res.status}, retry ${attempt + 1}/${retries}`);
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      // 4xx (not 429): don't retry
      console.error(`[polymarket-client] Client error ${res.status}: ${url}`);
      recordFailure();
      return null;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);

      if (msg.includes('aborted')) {
        console.error(`[polymarket-client] Timeout (${DEFAULT_TIMEOUT_MS}ms): ${url}`);
      } else {
        console.error(`[polymarket-client] Network error: ${msg}`);
      }

      if (attempt < retries) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      recordFailure();
      return null;
    }
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── JSON Parsing ───────────────────────────────────────────────────

function safeParseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseMarket(raw: PolymarketRawMarket): ParsedMarket {
  const prices = safeParseJsonArray(raw.outcomePrices).map(Number);
  const outcomes = safeParseJsonArray(raw.outcomes);

  return {
    question: raw.question || '',
    conditionId: raw.conditionId || '',
    yesPrice: isNaN(prices[0]) ? 0 : prices[0],
    noPrice: isNaN(prices[1]) ? 0 : prices[1],
    outcomes,
    volume: raw.volumeNum || 0,
    active: raw.active ?? true,
    closed: raw.closed ?? false,
  };
}

function parseEvent(raw: PolymarketRawEvent): ParsedEvent {
  const markets = (raw.markets || []).map(parseMarket);
  const totalVolume = markets.reduce((sum, m) => sum + m.volume, 0);

  return {
    id: raw.id || '',
    title: raw.title || '',
    slug: raw.slug || '',
    markets,
    totalVolume,
    active: raw.active ?? true,
    closed: raw.closed ?? false,
  };
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Fetch a single event by slug.
 * Returns null if not found or on error.
 */
export async function fetchEventBySlug(slug: string): Promise<ParsedEvent | null> {
  if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 150) {
    console.error(`[polymarket-client] Invalid slug: "${slug}"`);
    return null;
  }

  const url = `${BASE_URL}/events?slug=${encodeURIComponent(slug)}&limit=1`;
  const res = await fetchWithRetry(url);
  if (!res) return null;

  try {
    const data = await res.json() as unknown;
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`[polymarket-client] No event found for slug: ${slug}`);
      return null;
    }
    return parseEvent(data[0] as PolymarketRawEvent);
  } catch (error) {
    console.error(`[polymarket-client] JSON parse error for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch multiple events by slugs in sequence (respects rate limits).
 * Returns a Map of slug → ParsedEvent.
 */
export async function fetchEventsBySlugs(slugs: string[]): Promise<Map<string, ParsedEvent>> {
  const results = new Map<string, ParsedEvent>();
  const BATCH_DELAY_MS = 200; // 200ms between requests to be respectful

  for (const slug of slugs) {
    const event = await fetchEventBySlug(slug);
    if (event) {
      results.set(slug, event);
    }
    // Small delay between requests
    if (slugs.indexOf(slug) < slugs.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`[polymarket-client] Fetched ${results.size}/${slugs.length} events`);
  return results;
}

/**
 * Get circuit breaker status (for health checks).
 */
export function getCircuitStatus(): { state: CircuitState; failures: number } {
  return { state: circuit.state, failures: circuit.failureCount };
}
