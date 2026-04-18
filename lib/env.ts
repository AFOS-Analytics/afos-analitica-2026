import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgres'),
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().min(10).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(10).optional(),
  RESEND_API_KEY: z.string().startsWith('re_').optional(),
  CRON_SECRET: z.string().min(16).optional(),
  ALERT_EMAIL: z.string().email().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
}).refine(
  d => d.KV_REST_API_URL || d.UPSTASH_REDIS_REST_URL,
  { message: 'Redis URL obrigatória: KV_REST_API_URL ou UPSTASH_REDIS_REST_URL' },
).refine(
  d => d.KV_REST_API_TOKEN || d.UPSTASH_REDIS_REST_TOKEN,
  { message: 'Redis token obrigatório: KV_REST_API_TOKEN ou UPSTASH_REDIS_REST_TOKEN' },
)

type Env = z.infer<typeof envSchema>

let cached: Env | null = null

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
