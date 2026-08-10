import { Resend } from 'resend';
import { welcomeTemplate, oddsAlertTemplate, dailySummaryTemplate, systemAlertTemplate } from './templates';
import { EMAIL_ALERTS, EMAIL_CONTACT } from '../contacts';

const FROM = `AFOS Analytics <${EMAIL_ALERTS}>`;
const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.afos-analytics.com';

function getResend(): Resend | null {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

type ResendSendResponse = Awaited<ReturnType<Resend['emails']['send']>>;

/**
 * Resultado de um envio.
 *
 * 🔴 O `id` existe por causa da TRILHA DE AUDITORIA. Até 09/Ago/2026 o envio
 * devolvia só `boolean`, o id do Resend era descartado e os broadcasts não
 * gravavam nada no banco. O relatório "20 enviados / 0 falhas" era a ÚNICA
 * evidência de um disparo, e ela morria no terminal: não dava para dizer
 * depois quem recebeu o quê, nem reconciliar com o painel do Resend.
 */
export type SendResult = { ok: boolean; id?: string; erro?: string };

/** Retry exponential backoff (1s/2s/4s). 4xx não retentam exceto 408/429. */
async function sendWithRetry(
  fn: () => Promise<ResendSendResponse>,
  context: string,
  maxAttempts = 3,
): Promise<SendResult> {
  let ultimoErro = '';
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { data, error } = await fn();
      if (!error) return { ok: true, id: data?.id };
      ultimoErro = error.message;
      const status = Number((error as { statusCode?: number | null })?.statusCode) || 0;
      if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
        console.error(`[resend] ${context} ${status}, sem retry:`, error.message);
        return { ok: false, erro: `${status}: ${error.message}` };
      }
      console.warn(`[resend] ${context} tentativa ${attempt}/${maxAttempts} falhou (${status}):`, error.message);
    } catch (err) {
      ultimoErro = String(err);
      console.warn(`[resend] ${context} tentativa ${attempt}/${maxAttempts} threw:`, err);
    }
    if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 1000 * 2 ** (attempt - 1)));
  }
  return { ok: false, erro: ultimoErro || 'esgotou as tentativas' };
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
}): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    console.warn('[resend] API key não configurada');
    return { ok: false, erro: 'RESEND_API_KEY ausente' };
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

/**
 * Quem só precisa do sim/não continua com `Promise<boolean>`, para não
 * respingar nas rotas de API que já chamam estas funções. Só os TEASERS de
 * broadcast devolvem `SendResult`, porque só eles gravam trilha.
 */
const soOk = (p: Promise<SendResult>): Promise<boolean> => p.then((r) => r.ok);

export function sendWelcomeEmail(to: string, unsubscribeToken?: string): Promise<boolean> {
  return soOk(send({
    to,
    subject: 'Bem-vindo ao AFOS Analytics',
    html: welcomeTemplate(unsubscribeToken),
    unsubscribeToken,
    replyTo: EMAIL_CONTACT,
  }));
}

export function sendOddsAlert(to: string, data: {
  country: string;
  candidate: string;
  oldOdds: number;
  newOdds: number;
  direction: 'up' | 'down';
}, unsubscribeToken?: string): Promise<boolean> {
  const arrow = data.direction === 'up' ? '↑' : '↓';
  return soOk(send({
    to,
    subject: `${data.candidate} ${arrow} ${data.newOdds}% — ${data.country}`,
    html: oddsAlertTemplate(data, unsubscribeToken),
    unsubscribeToken,
  }));
}

export function sendDailySummary(to: string, data: {
  date: string;
  highlights: string[];
  topCandidates: { name: string; odds: number; change: string }[];
}, unsubscribeToken?: string): Promise<boolean> {
  return soOk(send({
    to,
    subject: `AFOS Resumo — ${data.date}`,
    html: dailySummaryTemplate(data, unsubscribeToken),
    unsubscribeToken,
    replyTo: EMAIL_CONTACT,
  }));
}

/**
 * D+8 (Fase 3): lean "AFOS Daily is out" teaser email.
 * Sent in batch by scripts/broadcast-afos-daily.ts after publish flips draft→published.
 * Subject + body localized via `locale` (fallback 'en'). Link points to /{locale}/daily/{date}.
 */
/**
 * O `lede` vem do frontmatter do Daily e é MARKDOWN: a PÁGINA o renderiza (glossário,
 * negrito), mas o e-mail interpolava a string CRUA no HTML. Resultado: o assinante via
 * "[1º turno](/en/glossary#primeiro-turno)" literal no corpo do e-mail.
 * Só não estourou no envio de 12/Jul porque os 19 leads eram todos pt-BR (o lede PT não
 * tem link); o tradutor injeta links de glossário no lede EN/ES, então o primeiro
 * assinante internacional receberia markdown quebrado.
 *
 * Converte para HTML seguro: escapa primeiro (o lede não é conteúdo confiável para HTML),
 * depois reabilita só negrito e transforma link markdown em texto puro (e-mail de teaser
 * não deve levar o leitor para âncora de glossário; o CTA é o único link).
 */
function ledeToEmailHtml(lede: string): string {
  const escaped = lede
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // [texto](url) -> texto
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '$1') // itálico solto -> texto
    .replace(/—/g, '-');                       // travessão (regra anti-AI da casa)
}

export function sendDailyTeaser(to: string, data: {
  date: string;
  locale: 'pt-BR' | 'en' | 'es';
  title: string;
  lede: string;
}, unsubscribeToken?: string): Promise<SendResult> {
  // Sem travessão no assunto (regra anti-AI): usar dois-pontos.
  const localeLabels = {
    'pt-BR': { subject: `AFOS Daily: ${data.date}`, cta: 'Ler o AFOS Daily', why: 'Você está recebendo porque se cadastrou em', unsubscribe: 'Cancelar inscrição' },
    'en':    { subject: `AFOS Daily: ${data.date}`, cta: 'Read AFOS Daily',   why: 'You receive this because you subscribed at', unsubscribe: 'Unsubscribe' },
    'es':    { subject: `AFOS Daily: ${data.date}`, cta: 'Leer AFOS Daily',   why: 'Recibe esto porque se suscribió en', unsubscribe: 'Cancelar suscripción' },
  } as const;
  const L = localeLabels[data.locale];
  const url = `${PUBLIC_URL}/${data.locale}/daily/${data.date}`;
  const unsubUrl = unsubscribeToken ? `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `${PUBLIC_URL}/api/unsubscribe`;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.6;">
  <h1 style="color:#0F52BA;font-size:1.5rem;margin:0 0 0.5rem;font-weight:700;">${data.title}</h1>
  <p style="color:#475569;font-size:0.95rem;margin:0 0 1.5rem;">${ledeToEmailHtml(data.lede)}</p>
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

/**
 * 🌍 Rótulo do país no ASSUNTO, por idioma. O Brasil é string vazia de propósito:
 * os assinantes já receberam dezenas de "AFOS Tradeoff: Edição №N" sem país, e
 * mudar isso agora quebraria o agrupamento por assunto na caixa de entrada deles.
 */
const PAIS_NO_ASSUNTO: Record<string, Record<'pt-BR' | 'en' | 'es', string>> = {
  br: { 'pt-BR': '', en: '', es: '' },
  us: { 'pt-BR': ' EUA', en: ' US', es: ' EE.UU.' },
};

export function sendTradeoffTeaser(to: string, data: {
  date: string;
  locale: 'pt-BR' | 'en' | 'es';
  title: string;
  sinalDaSemana: string;
  issueNumber: number;
  /**
   * Slug do país da edição. 🔴 OBRIGATÓRIO, e era opcional com default 'br'.
   *
   * Aqui o esquecimento não fica na tela, sai por e-mail e não volta: assunto
   * e link de país errado chegam à base inteira. O default silencioso é
   * exatamente o mecanismo que já entregou peça brasileira em contexto
   * americano. Obrigatório, o TypeScript recusa a chamada incompleta no build.
   * Regra do André em 06/Ago/2026: as duas eleições são independentes.
   */
  pais: string;
}, unsubscribeToken?: string): Promise<SendResult> {
  const pais = data.pais;
  const p = (PAIS_NO_ASSUNTO[pais] ?? PAIS_NO_ASSUNTO.br)[data.locale];
  // Sem travessão no assunto (regra anti-AI): usar dois-pontos.
  const localeLabels = {
    'pt-BR': { subject: `AFOS Tradeoff${p}: Edição №${data.issueNumber}`, cta: 'Ler o Tradeoff', why: 'Você está recebendo porque se cadastrou em', unsubscribe: 'Cancelar inscrição' },
    'en':    { subject: `AFOS Tradeoff${p}: Issue №${data.issueNumber}`,  cta: 'Read the Tradeoff', why: 'You receive this because you subscribed at', unsubscribe: 'Unsubscribe' },
    'es':    { subject: `AFOS Tradeoff${p}: Edición №${data.issueNumber}`, cta: 'Leer el Tradeoff', why: 'Recibe esto porque se suscribió en', unsubscribe: 'Cancelar suscripción' },
  } as const;
  const L = localeLabels[data.locale];
  /**
   * 🔴 O PAÍS NA URL É OBRIGATÓRIO, e a falta dele não dava erro: dava a PEÇA ERRADA.
   *
   * A rota virou `/[idioma]/tradeoff/[pais]/[data]` em 01/Ago/2026. A antiga
   * `/[idioma]/tradeoff/[data]` sobreviveu por um tempo como redirect de
   * compatibilidade que mandava para o BRASIL, e foi assim que o defeito
   * apareceu: como Brasil e EUA publicam na mesma segunda, em 03/Ago as duas
   * edições existiam na mesma data, e `/en/tradeoff/2026-08-03` respondia
   * **307 entregando a Edição №11 do Brasil**. O leitor receberia manchete dos
   * EUA e abriria a peça brasileira, sem 404 e sem link quebrado.
   *
   * ⚠️ ESSA REDE DE SEGURANÇA NÃO EXISTE MAIS: por decisão do André em
   * 07/Ago/2026 a forma sem país virou **404**. Montar esta URL sem o país
   * agora não entrega a peça errada, entrega uma página morta para a lista
   * inteira. O país continua obrigatório, e a consequência de esquecê-lo ficou
   * mais barulhenta, que é como tem que ser.
   */
  const url = `${PUBLIC_URL}/${data.locale}/tradeoff/${pais}/${data.date}`;
  const unsubUrl = unsubscribeToken ? `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `${PUBLIC_URL}/api/unsubscribe`;
  // O sinalDaSemana é MARKDOWN e vai para dentro de HTML: escapar ANTES (não é conteúdo
  // confiável para interpolar), depois reduzir a texto puro (link vira texto: num teaser
  // o CTA deve ser o único link) e cortar em fronteira de palavra, não no meio dela.
  const sinalPlain = (() => {
    const escaped = data.sinalDaSemana
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const flat = escaped
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/—/g, '-');
    if (flat.length <= 400) return flat;
    const corte = flat.slice(0, 400);
    return corte.slice(0, corte.lastIndexOf(' ')) + '…';
  })();

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

/**
 * 📰 Teaser do AFOS Weekly. Construído em 06/Ago/2026, junto da publicação da
 * Edição №1, que é quando o André decidiu que ele seria feito.
 *
 * ⚠️ NÃO É CÓPIA DO TRADEOFF, e três coisas mudam:
 *
 * 1. O produto é para o ELEITOR COMUM, não para mesa. Nada de aviso financeiro
 *    e nada de linguagem de operação.
 * 2. O corpo vem do `tldr[0]`, porque o Weekly não tem `sinalDaSemana`.
 * 3. O país entra no ASSUNTO sempre. O Tradeoff deixa o Brasil sem rótulo para
 *    não quebrar o agrupamento na caixa de entrada de quem já recebia; aqui não
 *    há histórico para preservar, e o leitor precisa saber de que eleição é.
 */
export function sendWeeklyTeaser(to: string, data: {
  date: string;
  locale: 'pt-BR' | 'en' | 'es';
  title: string;
  resumo: string;
  issueNumber: number;
  /** 🔴 OBRIGATÓRIO. Ver a nota em sendTradeoffTeaser: país errado no e-mail não volta atrás. */
  pais: string;
}, unsubscribeToken?: string): Promise<SendResult> {
  const rotuloPais: Record<string, Record<'pt-BR' | 'en' | 'es', string>> = {
    us: { 'pt-BR': ' EUA', en: ' US', es: ' EE.UU.' },
  };
  const p = (rotuloPais[data.pais] ?? { 'pt-BR': '', en: '', es: '' })[data.locale];
  // Sem travessão no assunto (regra anti-AI): usar dois-pontos.
  const localeLabels = {
    'pt-BR': { subject: `AFOS Weekly${p}: Edição №${data.issueNumber}`, cta: 'Ler a edição', why: 'Você está recebendo porque se cadastrou em', unsubscribe: 'Cancelar inscrição' },
    'en':    { subject: `AFOS Weekly${p}: Issue №${data.issueNumber}`,  cta: 'Read the issue', why: 'You receive this because you subscribed at', unsubscribe: 'Unsubscribe' },
    'es':    { subject: `AFOS Weekly${p}: Edición №${data.issueNumber}`, cta: 'Leer la edición', why: 'Recibe esto porque se suscribió en', unsubscribe: 'Cancelar suscripción' },
  } as const;
  const L = localeLabels[data.locale];

  /**
   * 🔴 O PAÍS NA URL É OBRIGATÓRIO. A rota do Weekly é
   * `/[idioma]/weekly/[pais]/[data]` desde o primeiro dia, e ela NÃO tem rota
   * antiga sem país, o que aqui é sorte e não desenho: no Tradeoff a rota
   * antiga sobrevive como redirect para o Brasil e já entregou a peça errada.
   * Montar sempre com o país, para o dia em que existir um segundo país.
   */
  const url = `${PUBLIC_URL}/${data.locale}/weekly/${data.pais}/${data.date}`;
  const unsubUrl = unsubscribeToken ? `${PUBLIC_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `${PUBLIC_URL}/api/unsubscribe`;

  // O resumo é MARKDOWN e vai para dentro de HTML: escapar ANTES, depois achatar
  // para texto puro (o CTA deve ser o único link) e cortar em fronteira de palavra.
  const resumoPlain = (() => {
    const escaped = data.resumo
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const flat = escaped
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/—/g, '-');
    if (flat.length <= 400) return flat;
    const corte = flat.slice(0, 400);
    return corte.slice(0, corte.lastIndexOf(' ')) + '…';
  })();

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.6;">
  <h1 style="color:#0F52BA;font-size:1.5rem;margin:0 0 0.5rem;font-weight:700;">${data.title}</h1>
  <p style="color:#475569;font-size:0.95rem;margin:0 0 1.5rem;">${resumoPlain}</p>
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
  return soOk(send({
    to,
    subject: `⚠️ AFOS Alert: ${data.type}`,
    html: systemAlertTemplate(data),
  }));
}
