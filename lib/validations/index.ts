import { z } from 'zod'

// ── Shared primitives ──────────────────────────────────────

export const emailSchema = z
  .string()
  .min(5, 'Email muito curto')
  .max(254, 'Email muito longo')
  .email('Email inválido')
  .refine(
    (v) => v.indexOf('@') <= 64,
    'Local part do email excede 64 caracteres (RFC 5321)'
  )
  .transform((v) => v.trim().toLowerCase())

// ── CRM ────────────────────────────────────────────────────

export const subscribeSchema = z.object({
  email: emailSchema,
  // LGPD compliance: consent must be explicitly true. Was z.boolean().optional(),
  // which allowed silent subscriptions without consent record. Frontend MUST
  // include `consent: true` in the request payload.
  consent: z.literal(true, { message: 'Consent must be explicitly granted (LGPD)' }),
  _hp: z.string().max(500).optional(),
  // 🔴 `.catch(undefined)` DESDE 27/Ago/2026, e a razão é dura: estes dois
  // campos são de ANALYTICS, e antes um valor ruim neles derrubava o parse
  // INTEIRO. O usuário via "Insira um email válido" com o e-mail perfeito, e
  // não havia saída: `getOrCreateVisitorId()` devolve o que estiver no cookie
  // ou no localStorage, então um valor corrompido ou de formato antigo travava
  // o cadastro PARA SEMPRE naquele aparelho, no desktop e no celular.
  //
  // ⭐ O princípio: campo opcional de medição NUNCA bloqueia a ação principal.
  // Valor ruim vira `undefined`, perde-se a atribuição daquele cadastro, e a
  // pessoa entra na base. Perder a origem é barato; perder o assinante não.
  //
  // ⛔ `email` e `consent` seguem ESTRITOS de propósito: um é a identidade e o
  // outro é a base legal LGPD. Tolerar qualquer um dos dois seria outro defeito.
  visitorId: z.string().uuid().optional().catch(undefined),
  // 'daily' e 'tradeoff' = bloco de inscrição no fim das edições publicadas.
  // Separar a origem permite medir se o conteúdo converte, sem tracking em e-mail.
  captureSource: z.enum(['popup', 'gate', 'landing', 'daily', 'tradeoff', 'weekly']).optional().catch(undefined),
})

// ── Visitor ───────────────────────────────────────────────

export const visitorStateSchema = z.object({
  visitorId: z.string().uuid('Invalid visitor ID'),
})

export const visitorSessionSchema = z.object({
  visitorId: z.string().uuid('Invalid visitor ID'),
  durationMs: z.number().int().min(0).max(86_400_000),
  hasInteraction: z.boolean(),
})

export const visitorDismissSchema = z.object({
  visitorId: z.string().uuid('Invalid visitor ID'),
})

// ── IAM ────────────────────────────────────────────────────

export const savePreferenceSchema = z.object({
  email: emailSchema,
  key: z.string().min(1).max(100),
  value: z.string().max(1000),
})
