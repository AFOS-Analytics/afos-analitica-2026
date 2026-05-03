import { Resend } from 'resend';
import { welcomeTemplate, oddsAlertTemplate, dailySummaryTemplate, systemAlertTemplate } from './templates';
import { EMAIL_ALERTS, EMAIL_CONTACT } from '../contacts';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = `AFOS Analytics <${EMAIL_ALERTS}>`;
const REPLY_TO_HUMAN = EMAIL_CONTACT;
const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://afos-analytics.com';

/**
 * Retry com exponential backoff: 1s → 2s → 4s.
 * Falhas transientes (5xx, network, timeout) são retentadas. 4xx (validação) não.
 */
type ResendSendResponse = Awaited<ReturnType<Resend['emails']['send']>>

async function sendWithRetry(
  fn: () => Promise<ResendSendResponse>,
  context: string,
  maxAttempts = 3,
): Promise<boolean> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await fn();
      if (!error) return true;
      const status = Number((error as { statusCode?: number | null })?.statusCode) || 0;
      // 4xx (validation, invalid email): não retry
      if (status >= 400 && status < 500) {
        console.error(`[resend] ${context} 4xx, sem retry:`, error.message);
        return false;
      }
      lastError = error;
      console.warn(`[resend] ${context} tentativa ${attempt}/${maxAttempts} falhou:`, error.message);
    } catch (err) {
      lastError = err;
      console.warn(`[resend] ${context} tentativa ${attempt}/${maxAttempts} threw:`, err);
    }
    if (attempt < maxAttempts) {
      const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  console.error(`[resend] ${context} esgotou ${maxAttempts} tentativas:`, lastError);
  return false;
}

/**
 * Headers RFC 2369 + RFC 8058 (one-click unsubscribe).
 * Gmail/Outlook usam isso para botão "Cancelar inscrição" nativo.
 */
function buildListUnsubscribeHeaders(token: string | undefined): Record<string, string> | undefined {
  if (!token) return undefined;
  const url = `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
  return {
    'List-Unsubscribe': `<${url}>, <mailto:${EMAIL_CONTACT}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

export async function sendWelcomeEmail(to: string, unsubscribeToken?: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn('[resend] API key não configurada');
    return false;
  }

  const headers = buildListUnsubscribeHeaders(unsubscribeToken);
  return sendWithRetry(
    () => resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO_HUMAN,
      to,
      subject: 'Bem-vindo ao AFOS Analytics',
      html: welcomeTemplate(unsubscribeToken),
      headers,
    }),
    `welcome to ${to.slice(0, 3)}***`,
  );
}

export async function sendOddsAlert(to: string, data: {
  country: string;
  candidate: string;
  oldOdds: number;
  newOdds: number;
  direction: 'up' | 'down';
}, unsubscribeToken?: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const arrow = data.direction === 'up' ? '↑' : '↓';
  const headers = buildListUnsubscribeHeaders(unsubscribeToken);
  return sendWithRetry(
    () => resend.emails.send({
      from: FROM,
      to,
      subject: `${data.candidate} ${arrow} ${data.newOdds}% — ${data.country}`,
      html: oddsAlertTemplate(data, unsubscribeToken),
      headers,
    }),
    `odds alert to ${to.slice(0, 3)}***`,
  );
}

export async function sendDailySummary(to: string, data: {
  date: string;
  highlights: string[];
  topCandidates: { name: string; odds: number; change: string }[];
}, unsubscribeToken?: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const headers = buildListUnsubscribeHeaders(unsubscribeToken);
  return sendWithRetry(
    () => resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO_HUMAN,
      to,
      subject: `AFOS Resumo — ${data.date}`,
      html: dailySummaryTemplate(data, unsubscribeToken),
      headers,
    }),
    `daily summary to ${to.slice(0, 3)}***`,
  );
}

export async function sendSystemAlert(to: string, data: {
  type: string;
  message: string;
  details: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  // System alerts são internos (ops), não levam unsubscribe
  return sendWithRetry(
    () => resend.emails.send({
      from: FROM,
      to,
      subject: `⚠️ AFOS Alert: ${data.type}`,
      html: systemAlertTemplate(data),
    }),
    `system alert to ${to.slice(0, 3)}***`,
  );
}
