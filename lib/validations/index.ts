import { z } from 'zod'

// ── Shared primitives ──────────────────────────────────────

/**
 * 🔴 LIMPEZA ANTES DE VALIDAR, e a ordem é o ponto. Antes o `.email()` rodava
 * ANTES do `.transform()`, então espaço ou caractere invisível derrubava a
 * validação e o `.trim()` só acontecia depois, quando já não adiantava.
 *
 * O caso que importa é o **zero-width** (U+200B a U+200D e U+FEFF): muita
 * página web insere esses caracteres no texto, e ao copiar um e-mail de lá
 * eles vêm junto, INVISÍVEIS. O `.trim()` do navegador não os remove, então a
 * pessoa via "Insira um email válido" com um e-mail visualmente perfeito e não
 * tinha como descobrir o motivo. Mesma forma do defeito do `visitorId`.
 *
 * Medido em 27/Ago/2026. Agora o valor é higienizado primeiro e a validação
 * julga o que a pessoa quis dizer, não o que o clipboard trouxe junto.
 */
const higienizaEmail = (v: unknown): unknown =>
  typeof v === 'string'
    ? v.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim().toLowerCase()
    : v

export const emailSchema = z.preprocess(
  higienizaEmail,
  z
    .string()
    .min(5, 'Email muito curto')
    .max(254, 'Email muito longo')
    .email('Email inválido')
    .refine(
      (v) => v.indexOf('@') <= 64,
      'Local part do email excede 64 caracteres (RFC 5321)'
    )
)

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
  // 🔴 'tradeoff' sozinho era CEGO AO PAIS: as edicoes do Brasil e dos EUA
  // usam o MESMO template e mandavam o mesmo valor, entao nao dava para saber
  // qual dos dois converte. 'tradeoff' continua valido para nao invalidar
  // registro antigo. 'weekly' segue sem sufixo porque so existe para os EUA.
  captureSource: z.enum(['popup', 'popup-br', 'popup-us', 'gate', 'landing', 'daily', 'tradeoff', 'tradeoff-br', 'tradeoff-us', 'weekly']).optional().catch(undefined),
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
