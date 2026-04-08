/**
 * API Route: POST /api/test-email
 *
 * Endpoint temporário para testar envio dos 4 templates.
 * Protegido por CRON_SECRET ou x-vercel-cron.
 * Remover após validação.
 */

import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendOddsAlert, sendDailySummary, sendSystemAlert } from '../../lib/email/resend';

const TEST_EMAIL = 'afos2100@gmail.com';

export async function POST(request: Request) {
  // Autenticação (mesmo padrão do cron)
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isLocal = !process.env.VERCEL;
  const isAuthorized = isLocal || isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, boolean> = {};

  // 1. Welcome Email
  results.welcome = await sendWelcomeEmail(TEST_EMAIL);

  // 2. Odds Alert
  results.oddsAlert = await sendOddsAlert(TEST_EMAIL, {
    country: 'Brasil',
    candidate: 'Lula',
    oldOdds: 38,
    newOdds: 42,
    direction: 'up',
  });

  // 3. Daily Summary
  results.dailySummary = await sendDailySummary(TEST_EMAIL, {
    date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    highlights: [
      'Lula recuperou para 42% no Polymarket após pacote fiscal da BBC',
      'STF impeachment subiu para 17% — maior alta em uma semana',
      'Datafolha em campo (7-9/Abr) — primeira pesquisa grande pós-desincompatibilização',
      'PL Senado caiu para 72% (-5.5pp)',
    ],
    topCandidates: [
      { name: 'Lula (PT)', odds: 42, change: '↑ 0.5pp' },
      { name: 'Flávio Bolsonaro (PL)', odds: 38, change: '↓ 1.15pp' },
      { name: 'Renan Santos (Missão)', odds: 6.75, change: '—' },
      { name: 'Fernando Haddad (PT)', odds: 6, change: '↑ 0.25pp' },
      { name: 'Ronaldo Caiado (PSD)', odds: 2, change: '↓ 0.4pp' },
    ],
  });

  // 4. System Alert
  results.systemAlert = await sendSystemAlert(TEST_EMAIL, {
    type: 'Cron Health Check',
    message: 'Cron de atualização não executou nos últimos 10 minutos',
    details: 'Última execução: 07/04/2026 14:45 BRT. Circuit breaker: CLOSED. Redis: OK.',
  });

  const allOk = Object.values(results).every(Boolean);

  console.log(`[test-email] Resultados: ${JSON.stringify(results)}`);

  return NextResponse.json({
    ok: allOk,
    to: TEST_EMAIL,
    results,
    timestamp: new Date().toISOString(),
  }, { status: allOk ? 200 : 207 });
}
