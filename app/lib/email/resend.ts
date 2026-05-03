import { Resend } from 'resend';
import { welcomeTemplate, oddsAlertTemplate, dailySummaryTemplate, systemAlertTemplate } from './templates';
import { EMAIL_ALERTS, EMAIL_CONTACT } from '../contacts';

const FROM = `AFOS Analytics <${EMAIL_ALERTS}>`;
const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://afos-analytics.com';

function getResend(): Resend | null {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

type ResendSendResponse = Awaited<ReturnType<Resend['emails']['send']>>;

/** Retry exponential backoff (1s/2s/4s). 4xx não retentam exceto 408/429. */
async function sendWithRetry(
  fn: () => Promise<ResendSendResponse>,
  context: string,
  maxAttempts = 3,
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await fn();
      if (!error) return true;
      const status = Number((error as { statusCode?: number | null })?.statusCode) || 0;
      if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
        console.error(`[resend] ${context} ${status}, sem retry:`, error.message);
        return false;
      }
      console.warn(`[resend] ${context} tentativa ${attempt}/${maxAttempts} falhou (${status}):`, error.message);
    } catch (err) {
      console.warn(`[resend] ${context} tentativa ${attempt}/${maxAttempts} threw:`, err);
    }
    if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 1000 * 2 ** (attempt - 1)));
  }
  return false;
}

/** Headers RFC 8058 — botão "Cancelar inscrição" nativo do Gmail/Outlook. */
function unsubHeaders(token: string | undefined): Record<string, string> | undefined {
  if (!token) return undefined;
  const url = `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
  return {
    'List-Unsubscribe': `<${url}>, <mailto:${EMAIL_CONTACT}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

/** Envio único — todos os templates passam por aqui. */
async function send(opts: {
  to: string;
  subject: string;
  html: string;
  unsubscribeToken?: string;
  replyTo?: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn('[resend] API key não configurada');
    return false;
  }
  return sendWithRetry(
    () => resend.emails.send({
      from: FROM,
      replyTo: opts.replyTo,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      headers: unsubHeaders(opts.unsubscribeToken),
    }),
    `to ${opts.to.slice(0, 3)}***`,
  );
}

export function sendWelcomeEmail(to: string, unsubscribeToken?: string): Promise<boolean> {
  return send({
    to,
    subject: 'Bem-vindo ao AFOS Analytics',
    html: welcomeTemplate(unsubscribeToken),
    unsubscribeToken,
    replyTo: EMAIL_CONTACT,
  });
}

export function sendOddsAlert(to: string, data: {
  country: string;
  candidate: string;
  oldOdds: number;
  newOdds: number;
  direction: 'up' | 'down';
}, unsubscribeToken?: string): Promise<boolean> {
  const arrow = data.direction === 'up' ? '↑' : '↓';
  return send({
    to,
    subject: `${data.candidate} ${arrow} ${data.newOdds}% — ${data.country}`,
    html: oddsAlertTemplate(data, unsubscribeToken),
    unsubscribeToken,
  });
}

export function sendDailySummary(to: string, data: {
  date: string;
  highlights: string[];
  topCandidates: { name: string; odds: number; change: string }[];
}, unsubscribeToken?: string): Promise<boolean> {
  return send({
    to,
    subject: `AFOS Resumo — ${data.date}`,
    html: dailySummaryTemplate(data, unsubscribeToken),
    unsubscribeToken,
    replyTo: EMAIL_CONTACT,
  });
}

export function sendSystemAlert(to: string, data: {
  type: string;
  message: string;
  details: string;
}): Promise<boolean> {
  return send({
    to,
    subject: `⚠️ AFOS Alert: ${data.type}`,
    html: systemAlertTemplate(data),
  });
}
