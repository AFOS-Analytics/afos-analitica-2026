/**
 * API Route: POST /api/unsubscribe
 *
 * Marca subscriber como unsubscribed (não deleta dados).
 * Idempotente: se não existe, retorna sucesso.
 */

import { NextResponse } from 'next/server';
import { unsubscribe, isValidEmail } from '../../lib/email/subscribers';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
    }

    const result = await unsubscribe(email);

    if (!result.success) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[api/unsubscribe] Erro:', error);
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 });
  }
}
