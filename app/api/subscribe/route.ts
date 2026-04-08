/**
 * API Route: POST /api/subscribe
 *
 * Cadastra email de subscriber.
 * Idempotente: se email já existe, retorna sucesso sem duplicar.
 * Validação dupla: frontend + backend.
 */

import { NextResponse } from 'next/server';
import { createSubscriber, isValidEmail } from '../../lib/email/subscribers';
import { sendWelcomeEmail } from '../../lib/email/resend';

export async function POST(request: Request) {
  // Apenas POST
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const consent = body.consent === true;

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
