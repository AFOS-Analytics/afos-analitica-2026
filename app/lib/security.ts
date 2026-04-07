/**
 * Security utilities — OWASP Top 10 2025 + API Security Top 10 2023
 *
 * Apenas funções que são efetivamente usadas em produção.
 * Rate limiting está no middleware.ts.
 * Slug validation está inline nas API routes.
 * Headers de segurança estão no next.config.mjs.
 */

// Este módulo foi reduzido ao essencial.
// Funções removidas (código morto):
// - sanitizeHtml: nunca chamada
// - isValidExternalUrl: nunca chamada fora do próprio módulo
// - isValidSlug: duplicada inline na API polymarket
// - checkRateLimit: duplicada no middleware
// - validateEnvVars: nunca chamada
// - safeJsonParse: nunca chamada
// - safeFetch: nunca chamada
// - securityHeaders: nunca importado

// Security agora é implementada em:
// - middleware.ts: rate limiting (100 req/min/IP)
// - next.config.mjs: CSP, HSTS, X-Frame-Options, Permissions-Policy
// - API routes: slug validation, timeout, try-catch inline
// - lib/kv.ts: fallback graceful
// - lib/polymarket/client.ts: circuit breaker, retry, timeout
