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

export const localeSchema = z.enum(['pt-BR', 'en', 'es'])

export const cuidSchema = z.string().cuid()

// ── CRM ────────────────────────────────────────────────────

export const subscribeSchema = z.object({
  email: emailSchema,
  consent: z.boolean().optional(),
  _hp: z.string().max(500).optional(),
})
