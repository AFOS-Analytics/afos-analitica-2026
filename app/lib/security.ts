// OWASP Top 10 2025 (Web) + OWASP API Security Top 10 2023
// Security utilities for AFOS Analytics

/**
 * Sanitize string input to prevent XSS (OWASP A03:2021 - Injection)
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validate URL to prevent SSRF (OWASP A10:2021 - Server-Side Request Forgery)
 */
export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'gamma-api.polymarket.com',
      'news.google.com',
      'api.firecrawl.dev',
    ];
    return allowedHosts.some(host => parsed.hostname === host) &&
           (parsed.protocol === 'https:');
  } catch {
    return false;
  }
}

/**
 * Validate and sanitize API slug parameters (OWASP API4:2023 - Unrestricted Resource Consumption)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length <= 100;
}

// Rate limiting is handled by middleware.ts (100 req/min/IP)

/**
 * Validate environment variables at startup (OWASP A05:2021 - Security Misconfiguration)
 */
export function validateEnvVars(): { valid: boolean; missing: string[] } {
  const required: string[] = [];
  const optional = ['FIRECRAWL_API_KEY'];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) missing.push(key);
  }

  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`[SECURITY] Optional env var ${key} not set`);
    }
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Safe JSON parse with error handling (OWASP A08:2021 - Software and Data Integrity Failures)
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('[SECURITY] JSON parse failed:', error);
    return fallback;
  }
}

/**
 * Create safe fetch with timeout and validation
 * OWASP API8:2023 - Lack of Protection from Automated Threats
 */
export async function safeFetch(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options;

  if (!isValidExternalUrl(url)) {
    throw new Error(`[SECURITY] Invalid external URL: ${url}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Security headers for API responses
 * OWASP A05:2021 - Security Misconfiguration
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
