/**
 * API Route: POST /api/subscribe
 *
 * Cadastra lead no Neon (crm.leads).
 * Idempotente: se email já existe, retorna sucesso sem duplicar.
 * Rate limiting permanece no Redis (efêmero, atômico).
 * Contrato de request/response inalterado para o EmailPopup.
 */

import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { randomBytes } from 'crypto'
import { createSubscriber } from '../../lib/email/subscribers'
import { sendWelcomeEmail } from '../../lib/email/resend'
import { subscribeSchema } from '../../../lib/validations'
import { clientIp } from '../../../lib/net/client-ip'
import { audit } from '../../../lib/audit'
import { locales } from '../../../lib/i18n/config'

const VALID_LOCALES = locales as readonly string[]
const SIGNUP_SESSION_TTL_SECONDS = 3600 // 1h — TTL for /welcome screen access

/**
 * Casa a etiqueta do navegador com um idioma da casa, por PREFIXO.
 * 'en-US' e 'en-GB' viram 'en'; 'es-419' e 'es-ES' viram 'es'; 'pt-PT' e
 * 'pt-BR' viram 'pt-BR'. Desconhecido cai no padrao da casa.
 */
function normalizaLocale(raw: string | undefined): string {
  if (!raw) return 'pt-BR'
  const l = raw.toLowerCase()
  if (l.startsWith('pt')) return 'pt-BR'
  if (l.startsWith('es')) return 'es'
  if (l.startsWith('en')) return 'en'
  return 'pt-BR'
}

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
    }

    // Zod validation
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      // 🔴 Colapsar TODA falha de schema em `invalid_email` fazia a tela mentir:
      // quem enviasse sem consentimento via "Insira um email valido" com o
      // e-mail perfeito. Os campos de analytics ja deixaram de bloquear; o que
      // sobra e o consentimento, e ele merece a propria mensagem.
      const erroConsent = parsed.error.issues.some((i) => i.path[0] === 'consent')
      return NextResponse.json(
        { ok: false, error: erroConsent ? 'consent_required' : 'invalid_email' },
        { status: 400 }
      )
    }

    const { email, _hp, visitorId, captureSource } = parsed.data

    // Honeypot check — bots preenchem campos ocultos
    if (_hp) {
      return NextResponse.json({ ok: true, isNew: false }, { status: 200 })
    }

    // Rate limit: 5 cadastros por IP por hora (Redis — efêmero)
    const ip = clientIp(request.headers)
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

    // 🔴 DUAS TRAVAS DE ROBUSTEZ AQUI, as duas medidas em 27/Ago/2026.
    //
    // 1. CHAVE ORFA, QUE BLOQUEAVA O IP PARA SEMPRE. `INCR` cria a chave SEM
    //    TTL, e o `EXPIRE` era uma SEGUNDA ida ao Redis. Se o processo morresse
    //    entre as duas, coisa banal em serverless, a chave ficava eterna. E o
    //    `expire` so era tentado quando `attempts === 1`, condicao que nunca
    //    mais se repete: o contador subia de 5 e o IP ficava barrado PARA
    //    SEMPRE, no desktop e no celular, porque o limite e por IP e nao por
    //    aparelho. Agora a ausencia de TTL e detectada e reparada.
    //
    // 2. FALHA DO REDIS NAO PODE BARRAR CADASTRO. Antes, um soluco do Redis
    //    caia no catch geral da rota e devolvia 500 para uma pessoa legitima.
    //    Limite de taxa e anti-abuso, nao correcao: falha ABERTO. Aceitar um
    //    cadastro a mais e barato; recusar um assinante real nao e.
    if (redisUrl && redisToken) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken })
        const rateLimitKey = `afos:ratelimit:subscribe:${ip}`
        // A segunda metade da condicao REPARA chave sem expiracao (TTL < 0), e
        // o curto-circuito garante que ela so custa uma ida a mais quando a
        // chave ja existia.
        const attempts = await redis.incr(rateLimitKey)
        if (attempts === 1 || (await redis.ttl(rateLimitKey)) < 0) {
          await redis.expire(rateLimitKey, 3600)
        }
        if (attempts > 5) {
          audit('rate_limited', 'api.subscribe', ip, { ip })
          return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
        }
      } catch (err) {
        console.error('[subscribe] rate limit indisponivel, seguindo sem ele:', err)
      }
    }

    // Criar lead no Neon (idempotente)
    const userAgent = request.headers.get('user-agent') || undefined
    // 🔴 O NAVEGADOR NAO MANDA 'en'. Ele manda 'en-US', 'es-ES', 'pt-BR', e a
    // comparacao exata contra ['pt-BR','en','es'] so acertava o portugues. Todo
    // americano e todo hispanofono era gravado como pt-BR. PROVA medida em
    // 27/Ago/2026: os 31 leads da base tinham locale='pt-BR', 31 de 31, e ainda
    // assim DOIS deles escolheram ingles a mao no /welcome. O produto dos EUA
    // tem origem em ingles e mandava portugues para todo mundo por causa disto.
    const rawLocale = request.headers.get('accept-language')?.split(',')[0]?.split(';')[0]?.trim()
    const locale = normalizaLocale(rawLocale)

    // A origem vem do COOKIE que o middleware gravou, nunca do corpo do formulário:
    // o cliente não deve poder declarar de onde veio, senão a métrica é opinião dele.
    // ⚠️ Aqui o handler recebe `Request`, não `NextRequest`, então não existe
    // `.cookies`: ler do cabeçalho é o caminho, e o valor já vem sanitizado do middleware.
    const campaign =
      request.headers.get('cookie')?.match(/(?:^|;\s*)afos_origin=([a-z0-9_-]{1,32})/)?.[1] || undefined

    const result = await createSubscriber(email, captureSource || 'popup', { ip, userAgent, locale, campaign })

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error || 'internal_error' },
        { status: result.error === 'storage_unavailable' ? 503 : 500 }
      )
    }

    // Welcome email apenas para novos leads, com token de unsubscribe one-click
    if (result.isNew || result.reativado) {
      sendWelcomeEmail(email, result.unsubscribeToken)
        .then((ok) => {
          // 🔴 `sendWelcomeEmail` DEVOLVE boolean, nao lanca. So o `.catch()`
          // deixava a falha passar calada, o MESMO defeito do consentimento.
          // Medido em 27/Ago/2026.
          if (!ok) console.error('[subscribe] Welcome email NAO enviado (retorno false):', email.slice(0, 3) + '***')
        })
        .catch((err) => {
          console.error('[subscribe] Welcome email falhou:', err)
        })
    }

    // Vincular visitor_state ao lead (fire-and-forget)
    if (visitorId && result.leadId) {
      // getPrisma(), nao a constante: import dinamico da constante herda o
      // mesmo defeito, porque ela e a leitura do primeiro import do modulo.
      const { getPrisma } = await import('../../../lib/db')
      const db = getPrisma()
      if (db) {
        db.visitorState.upsert({
          where: { visitorId },
          create: { visitorId, subscribed: true, subscribedAt: new Date(), leadId: result.leadId },
          update: { subscribed: true, subscribedAt: new Date(), leadId: result.leadId },
        }).catch((err) => {
          console.error('[subscribe] visitor_state update failed:', err)
        })
      }
    }

    // Set signup session cookie — grants temporary access to /welcome screen
    // for locale capture (TTL 1h). Stored server-side in Redis with email payload.
    let signupSessionId: string | null = null
    if (redisUrl && redisToken && result.leadId) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken })
        signupSessionId = randomBytes(24).toString('hex')
        await redis.set(
          `afos:signup-session:${signupSessionId}`,
          JSON.stringify({ email, leadId: result.leadId, createdAt: Date.now() }),
          { ex: SIGNUP_SESSION_TTL_SECONDS }
        )
      } catch (err) {
        console.error('[subscribe] signup session cookie set failed:', err)
      }
    }

    const response = NextResponse.json(
      { ok: true, isNew: result.isNew },
      { status: 200, headers: { 'X-Content-Type-Options': 'nosniff' } }
    )
    if (signupSessionId) {
      response.cookies.set('signup_session_id', signupSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SIGNUP_SESSION_TTL_SECONDS,
        path: '/',
      })
    }
    return response
  } catch (error) {
    console.error('[subscribe] Erro:', error)
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    )
  }
}
