/**
 * Resend Service
 *
 * Env var: RESEND_API_KEY
 * Free tier: 100 emails/dia, domínio onboarding@resend.dev
 */

import { Resend } from 'resend';
import { welcomeTemplate, oddsAlertTemplate, dailySummaryTemplate, systemAlertTemplate } from './templates';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = 'AFOS Analytics <onboarding@resend.dev>';

/**
 * Enviar email de boas-vindas.
 */
export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn('[resend] API key não configurada');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: 'Bem-vindo ao AFOS Analytics',
      html: welcomeTemplate(),
    });
    if (error) {
      console.error('[resend] Welcome email erro:', error.message);
      return false;
    }
    console.log(`[resend] Welcome enviado: ${to.slice(0, 3)}***`);
    return true;
  } catch (err) {
    console.error('[resend] Welcome falhou:', err);
    return false;
  }
}

/**
 * Enviar alerta de odds.
 */
export async function sendOddsAlert(to: string, data: {
  country: string;
  candidate: string;
  oldOdds: number;
  newOdds: number;
  direction: 'up' | 'down';
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    const arrow = data.direction === 'up' ? '↑' : '↓';
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `${data.candidate} ${arrow} ${data.newOdds}% — ${data.country}`,
      html: oddsAlertTemplate(data),
    });
    if (error) { console.error('[resend] Odds alert erro:', error.message); return false; }
    return true;
  } catch (err) {
    console.error('[resend] Odds alert falhou:', err);
    return false;
  }
}

/**
 * Enviar resumo diário.
 */
export async function sendDailySummary(to: string, data: {
  date: string;
  highlights: string[];
  topCandidates: { name: string; odds: number; change: string }[];
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `AFOS Resumo — ${data.date}`,
      html: dailySummaryTemplate(data),
    });
    if (error) { console.error('[resend] Daily summary erro:', error.message); return false; }
    return true;
  } catch (err) {
    console.error('[resend] Daily summary falhou:', err);
    return false;
  }
}

/**
 * Enviar alerta de sistema.
 */
export async function sendSystemAlert(to: string, data: {
  type: string;
  message: string;
  details: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `⚠️ AFOS Alert: ${data.type}`,
      html: systemAlertTemplate(data),
    });
    if (error) { console.error('[resend] System alert erro:', error.message); return false; }
    return true;
  } catch (err) {
    console.error('[resend] System alert falhou:', err);
    return false;
  }
}
