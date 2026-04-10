/**
 * Security Hardening Utilities — AFOS Analytics
 *
 * Camada centralizada de segurança para:
 * - OWASP Top 10 Web (2025)
 * - OWASP API Security Top 10 (2023)
 * - LLM/AI Application Security
 *
 * RISCOS COBERTOS:
 * - A01: Broken Access Control → auth helpers
 * - A03: Injection → sanitização de input
 * - A04: Insecure Design → validação de output IA
 * - A05: Security Misconfiguration → headers via next.config
 * - A07: Auth Failures → timing-safe compare
 * - A08: Data Integrity → validação de tradução
 * - A10: SSRF → URL whitelist
 * - API4: Unrestricted Resource Consumption → rate limiting
 * - API8: Automated Threats → honeypot
 * - LLM01: Prompt Injection → sanitização + delimitadores
 * - LLM02: Insecure Output Handling → validação pós-IA
 *
 * RISCOS REMANESCENTES:
 * - CSP com 'unsafe-inline'/'unsafe-eval' (necessário para Next.js)
 * - Rate limiting in-memory (não distribuído entre workers)
 * - WebSocket não implementado (Vercel limitação)
 *
 * COMO OPERAR COM SEGURANÇA:
 * 1. Nunca expor TRANSLATION_API_KEY ou TRANSLATION_AUTH_TOKEN no frontend
 * 2. Sempre validar output da IA antes de publicar
 * 3. Monitorar /api/health para detectar anomalias
 * 4. Rotacionar tokens periodicamente
 * 5. Revisar logs de [translations] para tentativas não autorizadas
 */

// Locale validation via middleware (isValidLocale + normalizeLocale)

// sanitizeForAI: implementado em lib/ai/prompts.ts → sanitize()
// assertLocale: implementado via isValidLocale() + normalizeLocale() no middleware

/** Sanitizar output de IA antes de usar */
export function sanitizeAIOutput(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Strip scripts
    .replace(/javascript:/gi, '')                       // Strip JS protocol
    .replace(/on\w+\s*=/gi, '')                        // Strip event handlers
    .replace(/\x00/g, '')                              // Null bytes
    .trim();
}

/** Verificar se output da IA é seguro para publicação */
export function isAIOutputSafe(text: string): { safe: boolean; reason?: string } {
  if (!text || text.trim().length === 0) {
    return { safe: false, reason: 'empty' };
  }
  if (/<script/i.test(text)) {
    return { safe: false, reason: 'contains_script_tag' };
  }
  if (/javascript:/i.test(text)) {
    return { safe: false, reason: 'contains_js_protocol' };
  }
  if (/on(click|load|error|mouseover)\s*=/i.test(text)) {
    return { safe: false, reason: 'contains_event_handler' };
  }
  if (text.length > 50_000) {
    return { safe: false, reason: 'too_long' };
  }
  return { safe: true };
}

// ─── Audit Logging ──────────────────────────────────────────────────

import { audit } from '../audit'

/** Log de auditoria — grava no Neon (governance.audit_logs) com fallback console */
export function auditLog(event: string, details: Record<string, unknown> = {}): void {
  const entityType = (details.route as string) || (details.resource as string) || 'system'
  const ip = details.ip as string | undefined
  const userAgent = details.userAgent as string | undefined

  audit(event, entityType, 'n/a', { ip, userAgent, after: details })
}
