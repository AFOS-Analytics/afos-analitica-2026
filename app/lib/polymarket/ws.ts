/**
 * Polymarket WebSocket Layer
 *
 * Subscribes to real-time price updates from Polymarket's CLOB WebSocket.
 * Implements exponential backoff reconnection and selective country updates.
 *
 * Architecture:
 * - Connects to Polymarket's public WebSocket feed
 * - Monitors condition IDs from active markets
 * - Emits price change events that can be consumed by SSE/polling layer
 *
 * NOTE: This is a server-side module. It runs in a long-lived process
 * (e.g., a separate worker), NOT in a Vercel serverless function.
 * For Vercel deployment, use the polling fallback in the API route instead.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface PriceUpdate {
  conditionId: string;
  newPrice: number;
  timestamp: number;
}

export interface WSConfig {
  url: string;
  conditionIds: string[];
  onPriceUpdate: (update: PriceUpdate) => void;
  onError?: (error: Error) => void;
  onReconnect?: (attempt: number) => void;
}

type WSState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

// ─── Constants ──────────────────────────────────────────────────────

// TODO: Verify this endpoint is publicly accessible and stable
const DEFAULT_WS_URL = 'wss://ws-subscriptions-clob.polymarket.com/ws/market';

const INITIAL_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 60_000;
const MAX_RECONNECT_ATTEMPTS = 10;
const PING_INTERVAL_MS = 30_000;

// ─── WebSocket Manager ──────────────────────────────────────────────

export class PolymarketWebSocket {
  private ws: WebSocket | null = null;
  private state: WSState = 'disconnected';
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private config: WSConfig;

  constructor(config: Partial<WSConfig> & Pick<WSConfig, 'conditionIds' | 'onPriceUpdate'>) {
    this.config = {
      url: config.url || DEFAULT_WS_URL,
      ...config,
    };
  }

  /**
   * Connect to the WebSocket server.
   */
  connect(): void {
    if (this.state === 'connected' || this.state === 'connecting') {
      console.warn('[ws] Already connected or connecting');
      return;
    }

    this.state = 'connecting';
    console.log(`[ws] Connecting to ${this.config.url}...`);

    try {
      // NOTE: This uses the Node.js WebSocket or browser WebSocket API.
      // In a Vercel serverless context, WebSocket connections are NOT supported
      // for long-lived connections. This module is designed for a dedicated worker.
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        this.state = 'connected';
        this.reconnectAttempt = 0;
        console.log('[ws] Connected');

        // Subscribe to condition IDs
        this.subscribe(this.config.conditionIds);

        // Start ping interval
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data as string);
      };

      this.ws.onerror = (event) => {
        console.error('[ws] WebSocket error:', event);
        this.config.onError?.(new Error('WebSocket error'));
      };

      this.ws.onclose = (event) => {
        console.warn(`[ws] Disconnected: code=${event.code} reason="${event.reason}"`);
        this.state = 'disconnected';
        this.stopPing();
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('[ws] Failed to create WebSocket:', error);
      this.state = 'disconnected';
      this.scheduleReconnect();
    }
  }

  /**
   * Gracefully disconnect.
   */
  disconnect(): void {
    console.log('[ws] Disconnecting...');
    this.state = 'disconnected';
    this.reconnectAttempt = MAX_RECONNECT_ATTEMPTS; // Prevent auto-reconnect

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopPing();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  /**
   * Update the list of monitored condition IDs.
   */
  updateSubscriptions(conditionIds: string[]): void {
    this.config.conditionIds = conditionIds;
    if (this.state === 'connected' && this.ws) {
      this.subscribe(conditionIds);
    }
  }

  /**
   * Get current connection state.
   */
  getState(): WSState {
    return this.state;
  }

  // ─── Private Methods ───────────────────────────────────────────────

  private subscribe(conditionIds: string[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Polymarket CLOB subscription format
    // TODO: Verify exact subscription message format with Polymarket docs
    const subscribeMsg = JSON.stringify({
      type: 'subscribe',
      channel: 'market',
      assets: conditionIds,
    });

    this.ws.send(subscribeMsg);
    console.log(`[ws] Subscribed to ${conditionIds.length} condition IDs`);
  }

  private handleMessage(raw: string): void {
    try {
      const data = JSON.parse(raw);

      // TODO: Verify exact message format from Polymarket WebSocket
      // Expected format based on CLOB API docs:
      // { type: "price_change", asset_id: "...", price: "0.42", timestamp: ... }
      if (data.type === 'price_change' && data.asset_id && data.price) {
        const update: PriceUpdate = {
          conditionId: data.asset_id,
          newPrice: parseFloat(data.price),
          timestamp: data.timestamp || Date.now(),
        };
        this.config.onPriceUpdate(update);
      }
    } catch {
      // Ignore non-JSON messages (pings, etc.)
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
      console.error(`[ws] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached — giving up`);
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, 60s, 60s...
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempt),
      MAX_RECONNECT_DELAY_MS
    );

    this.reconnectAttempt++;
    this.state = 'reconnecting';

    console.log(`[ws] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})`);
    this.config.onReconnect?.(this.reconnectAttempt);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, PING_INTERVAL_MS);
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}

// ─── Factory ────────────────────────────────────────────────────────

/**
 * Create a PolymarketWebSocket instance for monitoring election markets.
 *
 * Usage (in a dedicated worker process, NOT in Vercel serverless):
 *
 * ```ts
 * const ws = createElectionWS(
 *   conditionIds,
 *   (update) => console.log('Price changed:', update)
 * );
 * ws.connect();
 *
 * // Later:
 * ws.disconnect();
 * ```
 *
 * For Vercel: use polling via /api/global-map with ISR instead.
 */
export function createElectionWS(
  conditionIds: string[],
  onPriceUpdate: (update: PriceUpdate) => void
): PolymarketWebSocket {
  return new PolymarketWebSocket({
    conditionIds,
    onPriceUpdate,
    onError: (err) => console.error('[ws] Error:', err.message),
    onReconnect: (attempt) => console.log(`[ws] Reconnect attempt ${attempt}`),
  });
}
