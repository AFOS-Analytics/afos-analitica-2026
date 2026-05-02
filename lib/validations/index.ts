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
  visitorId: z.string().uuid().optional(),
  captureSource: z.enum(['popup', 'gate', 'landing']).optional(),
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
