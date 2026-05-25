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

/**
 * D+8 (Fase 3): lean "AFOS Daily is out" teaser email.
 * Sent in batch by scripts/broadcast-afos-daily.ts after publish flips draft→published.
 * Subject + body localized via `locale` (fallback 'en'). Link points to /{locale}/daily/{date}.
 */
export function sendDailyTeaser(to: string, data: {
  date: string;
  locale: 'pt-BR' | 'en' | 'es';
  title: string;
  lede: string;
}, unsubscribeToken?: string): Promise<boolean> {
  const localeLabels = {
    'pt-BR': { subject: `AFOS Daily — ${data.date}`, cta: 'Ler o AFOS Daily', why: 'Você está recebendo porque se cadastrou em', unsubscribe: 'Cancelar inscrição' },
    'en':    { subject: `AFOS Daily — ${data.date}`, cta: 'Read AFOS Daily',   why: 'You receive this because you subscribed at', unsubscribe: 'Unsubscribe' },
    'es':    { subject: `AFOS Daily — ${data.date}`, cta: 'Leer AFOS Daily',   why: 'Recibe esto porque se suscribió en', unsubscribe: 'Cancelar suscripción' },
  } as const;
  const L = localeLabels[data.locale];
  const url = `${PUBLIC_URL}/${data.locale}/daily/${data.date}`;
  const unsubUrl = unsubscribeToken ? `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `${PUBLIC_URL}/api/unsubscribe`;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.6;">
  <h1 style="color:#0F52BA;font-size:1.5rem;margin:0 0 0.5rem;font-weight:700;">${data.title}</h1>
  <p style="color:#475569;font-size:0.95rem;margin:0 0 1.5rem;">${data.lede}</p>
  <a href="${url}" style="display:inline-block;padding:12px 24px;background-color:#0F52BA;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${L.cta} →</a>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:2rem 0 1rem;" />
  <p style="color:#94a3b8;font-size:0.8rem;margin:0;">${L.why} <a href="${PUBLIC_URL}" style="color:#94a3b8;">afos-analytics.com</a>. <a href="${unsubUrl}" style="color:#94a3b8;">${L.unsubscribe}</a>.</p>
</div>`;

  return send({
    to,
    subject: L.subject,
    html,
    unsubscribeToken,
    replyTo: EMAIL_CONTACT,
  });
}

export function sendTradeoffTeaser(to: string, data: {
  date: string;
  locale: 'pt-BR' | 'en' | 'es';
  title: string;
  sinalDaSemana: string;
  issueNumber: number;
}, unsubscribeToken?: string): Promise<boolean> {
  const localeLabels = {
    'pt-BR': { subject: `AFOS Tradeoff — Edição №${data.issueNumber}`, cta: 'Ler o Tradeoff', why: 'Você está recebendo porque se cadastrou em', unsubscribe: 'Cancelar inscrição' },
    'en':    { subject: `AFOS Tradeoff — Issue #${data.issueNumber}`,  cta: 'Read the Tradeoff', why: 'You receive this because you subscribed at', unsubscribe: 'Unsubscribe' },
    'es':    { subject: `AFOS Tradeoff — Edición №${data.issueNumber}`, cta: 'Leer el Tradeoff', why: 'Recibe esto porque se suscribió en', unsubscribe: 'Cancelar suscripción' },
  } as const;
  const L = localeLabels[data.locale];
  const url = `${PUBLIC_URL}/${data.locale}/tradeoff/${data.date}`;
  const unsubUrl = unsubscribeToken ? `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `${PUBLIC_URL}/api/unsubscribe`;
  // Strip markdown bold/links from sinalDaSemana for plain HTML preview
  const sinalPlain = data.sinalDaSemana.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 400);

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.6;">
  <h1 style="color:#0F52BA;font-size:1.5rem;margin:0 0 0.5rem;font-weight:700;">${data.title}</h1>
  <p style="color:#475569;font-size:0.95rem;margin:0 0 1.5rem;">${sinalPlain}</p>
  <a href="${url}" style="display:inline-block;padding:12px 24px;background-color:#0F52BA;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${L.cta} →</a>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:2rem 0 1rem;" />
  <p style="color:#94a3b8;font-size:0.8rem;margin:0;">${L.why} <a href="${PUBLIC_URL}" style="color:#94a3b8;">afos-analytics.com</a>. <a href="${unsubUrl}" style="color:#94a3b8;">${L.unsubscribe}</a>.</p>
</div>`;

  return send({
    to,
    subject: L.subject,
    html,
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
