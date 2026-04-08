/**
 * API Route: POST /api/subscribe
 *
 * Cadastra email de subscriber.
 * Idempotente: se email já existe, retorna sucesso sem duplicar.
 * Validação dupla: frontend + backend.
 */

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { createSubscriber, isValidEmail } from '../../lib/email/subscribers';
import { sendWelcomeEmail } from '../../lib/email/resend';

export async function POST(request: Request) {
  // Apenas POST
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const consent = body.consent === true;

    // Honeypot check — bots preenchem campos ocultos
    const hp = body._hp;
    if (hp) {
      // Honeypot triggered — return fake success
      return NextResponse.json({ ok: true, isNew: false }, { status: 200 });
    }

    // Validação
    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'email_required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'invalid_email' },
        { status: 400 }
      );
    }

    // Rate limit: 5 cadastros por IP por hora
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimitKey = `afos:ratelimit:subscribe:${ip}`;
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      const attempts = await redis.incr(rateLimitKey);
      if (attempts === 1) await redis.expire(rateLimitKey, 3600);
      if (attempts > 5) {
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
      }
    }

    // Criar subscriber (idempotente)
    const result = await createSubscriber(email, 'popup');

    if (!result.success) {
      console.error(`[api/subscribe] Falha: ${result.error}`);
      return NextResponse.json(
        { ok: false, error: result.error || 'internal_error' },
        { status: result.error === 'storage_unavailable' ? 503 : 500 }
      );
    }

    // Enviar welcome email apenas para novos subscribers
    if (result.isNew) {
      sendWelcomeEmail(email).catch(err => {
        console.error('[api/subscribe] Welcome email falhou:', err);
      });
    }

    return NextResponse.json(
      { ok: true, isNew: result.isNew },
      {
        status: 200,
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }
    );
  } catch (error) {
    console.error('[api/subscribe] Erro:', error);
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    );
  }
}
