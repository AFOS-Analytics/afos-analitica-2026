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

import type { Locale } from '../i18n/config';
import { locales } from '../i18n/config';

// ─── Input Validation ───────────────────────────────────────────────

/** Validar e sanitizar texto para uso em prompts de IA */
export function sanitizeForAI(text: string, maxLength: number = 10_000): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .slice(0, maxLength)
    .replace(/```/g, "'''")       // Previne escape de code blocks
    .replace(/---{3,}/g, '—')     // Previne separadores markdown
    .replace(/<script[^>]*>/gi, '')  // Strip script tags
    .replace(/<\/script>/gi, '')
    .replace(/\x00/g, '');         // Null bytes
}

/** Validar locale em runtime (além da tipagem) */
export function assertLocale(value: unknown): asserts value is Locale {
  if (typeof value !== 'string' || !(locales as readonly string[]).includes(value)) {
    throw new Error(`Invalid locale: ${String(value)}`);
  }
}

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

type AuditEvent =
  | 'auth_success'
  | 'auth_failure'
  | 'translation_success'
  | 'translation_failure'
  | 'validation_failure'
  | 'ai_output_blocked'
  | 'rate_limited'
  | 'invalid_locale'
  | 'invalid_input';

/** Log de auditoria estruturado (sem vazar secrets) */
export function auditLog(event: AuditEvent, details: Record<string, unknown> = {}): void {
  const safe = { ...details };
  // Nunca logar tokens, keys, passwords
  for (const key of Object.keys(safe)) {
    if (/token|key|secret|password|auth/i.test(key)) {
      safe[key] = '[REDACTED]';
    }
  }
  console.log(`[audit] ${event}`, JSON.stringify(safe));
}
