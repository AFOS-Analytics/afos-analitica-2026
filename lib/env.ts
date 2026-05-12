import { z } from 'zod'

// Trata string vazia como undefined: Node define env vars sem valor como "",
// e z.string().optional() rejeita "" em vez de aceitar como ausente.
const optional = (inner: z.ZodString) =>
  z.preprocess(v => (v === '' ? undefined : v), inner.optional())

const envSchema = z.object({
  DATABASE_URL: optional(z.string().url().startsWith('postgres')),
  KV_REST_API_URL: optional(z.string().url()),
  KV_REST_API_TOKEN: optional(z.string().min(10)),
  UPSTASH_REDIS_REST_URL: optional(z.string().url()),
  UPSTASH_REDIS_REST_TOKEN: optional(z.string().min(10)),
  RESEND_API_KEY: optional(z.string().startsWith('re_').min(20)),
  ANTHROPIC_API_KEY: optional(z.string().startsWith('sk-ant-').min(40)),
  CRON_SECRET: optional(z.string().min(16)),
  ALERT_EMAIL: optional(z.string().email()),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
}).superRefine((d, ctx) => {
  if (d.NODE_ENV !== 'production') return
  // Em produção, crítico ter os secrets principais configurados.
  if (!d.DATABASE_URL) ctx.addIssue({ code: 'custom', path: ['DATABASE_URL'], message: 'obrigatório em produção' })
  if (!d.CRON_SECRET) ctx.addIssue({ code: 'custom', path: ['CRON_SECRET'], message: 'obrigatório em produção (autentica /api/cron/*)' })
  const hasRedisUrl = d.KV_REST_API_URL || d.UPSTASH_REDIS_REST_URL
  const hasRedisToken = d.KV_REST_API_TOKEN || d.UPSTASH_REDIS_REST_TOKEN
  if (!hasRedisUrl) ctx.addIssue({ code: 'custom', path: ['KV_REST_API_URL'], message: 'Redis URL obrigatória em produção' })
  if (!hasRedisToken) ctx.addIssue({ code: 'custom', path: ['KV_REST_API_TOKEN'], message: 'Redis token obrigatório em produção' })
})

type Env = z.infer<typeof envSchema>

let cached: Env | null = null

/**
 * Valida process.env contra o schema e retorna valores tipados + cacheados.
 * Em dev: fields opcionais podem faltar. Em prod: secrets críticos obrigatórios.
 * Throw com mensagens descritivas se inválido.
 */
export function getEnv(): Env {
  if (cached) return cached
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const errors = parsed.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`[env] Configuração inválida:\n${errors}`)
  }
  cached = parsed.data
  return cached
}
