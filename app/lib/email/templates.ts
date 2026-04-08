/**
 * Templates de Email — AFOS Analytics
 *
 * Todos os templates HTML para envio via Resend.
 * Design: limpo, profissional, mobile-friendly.
 */

const BRAND = {
  color: '#0F52BA',
  name: 'AFOS Analytics',
  url: 'https://afos-analitica-2026.vercel.app',
  tagline: 'Plataforma Global de Inteligência Eleitoral',
};

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background:${BRAND.color};padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">${BRAND.name}</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">${BRAND.tagline}</p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #eee;">
          <p style="margin:0;color:#999;font-size:11px;line-height:1.6;">
            ${BRAND.name} — ${BRAND.tagline}<br>
            <a href="${BRAND.url}" style="color:${BRAND.color};text-decoration:none;">${BRAND.url}</a><br><br>
            Para cancelar o recebimento, responda este email com "cancelar".
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Template: Welcome (novo subscriber)
 */
export function welcomeTemplate(): string {
  return layout(`
    <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:18px;">Bem-vindo ao AFOS Analytics</h2>
    <p style="color:#333;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Obrigado por se cadastrar. A partir de agora, você receberá:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="color:${BRAND.color};font-weight:600;">📊</span>
        <span style="color:#333;font-size:14px;margin-left:8px;">Alertas de mudanças significativas nas odds</span>
      </td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="color:${BRAND.color};font-weight:600;">📰</span>
        <span style="color:#333;font-size:14px;margin-left:8px;">Resumo diário das eleições</span>
      </td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="color:${BRAND.color};font-weight:600;">⚡</span>
        <span style="color:#333;font-size:14px;margin-left:8px;">Notificações de eventos críticos</span>
      </td></tr>
      <tr><td style="padding:10px 0;">
        <span style="color:${BRAND.color};font-weight:600;">🌍</span>
        <span style="color:#333;font-size:14px;margin-left:8px;">Novidades da plataforma</span>
      </td></tr>
    </table>
    <a href="${BRAND.url}" style="display:inline-block;background:${BRAND.color};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Acessar o Dashboard
    </a>
  `);
}

/**
 * Template: Alerta de mudança de odds
 */
export function oddsAlertTemplate(data: {
  country: string;
  candidate: string;
  oldOdds: number;
  newOdds: number;
  direction: 'up' | 'down';
}): string {
  const arrow = data.direction === 'up' ? '↑' : '↓';
  const color = data.direction === 'up' ? '#16a34a' : '#dc2626';
  const diff = Math.abs(data.newOdds - data.oldOdds).toFixed(1);

  return layout(`
    <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:18px;">Alerta de Odds — ${data.country}</h2>
    <p style="color:#666;font-size:13px;margin:0 0 20px;">Mudança significativa detectada no Polymarket</p>
    <div style="background:#f8fafc;border-radius:8px;padding:20px;border-left:4px solid ${color};margin:0 0 20px;">
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:16px;font-weight:700;">${data.candidate}</p>
      <p style="margin:0;font-size:28px;font-weight:800;color:${color};">
        ${data.newOdds}% <span style="font-size:16px;">${arrow} ${diff}pp</span>
      </p>
      <p style="margin:8px 0 0;color:#999;font-size:12px;">Antes: ${data.oldOdds}%</p>
    </div>
    <a href="${BRAND.url}" style="display:inline-block;background:${BRAND.color};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Ver Detalhes
    </a>
  `);
}

/**
 * Template: Resumo diário
 */
export function dailySummaryTemplate(data: {
  date: string;
  highlights: string[];
  topCandidates: { name: string; odds: number; change: string }[];
}): string {
  const candidateRows = data.topCandidates.map(c => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#333;font-size:14px;">${c.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:${BRAND.color};font-weight:700;text-align:right;font-size:14px;">${c.odds}%</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#666;text-align:right;font-size:13px;">${c.change}</td>
    </tr>
  `).join('');

  const highlightItems = data.highlights.map(h => `
    <li style="padding:4px 0;color:#333;font-size:14px;line-height:1.6;">${h}</li>
  `).join('');

  return layout(`
    <h2 style="margin:0 0 4px;color:#1a1a1a;font-size:18px;">Resumo Diário</h2>
    <p style="color:#999;font-size:13px;margin:0 0 20px;">${data.date}</p>
    <h3 style="color:${BRAND.color};font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Odds do Polymarket</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <th style="text-align:left;padding:8px 0;border-bottom:2px solid #eee;color:#999;font-size:12px;font-weight:600;">Candidato</th>
        <th style="text-align:right;padding:8px 0;border-bottom:2px solid #eee;color:#999;font-size:12px;font-weight:600;">Odds</th>
        <th style="text-align:right;padding:8px 0;border-bottom:2px solid #eee;color:#999;font-size:12px;font-weight:600;">Variação</th>
      </tr>
      ${candidateRows}
    </table>
    <h3 style="color:${BRAND.color};font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Destaques do dia</h3>
    <ul style="margin:0 0 20px;padding-left:20px;">${highlightItems}</ul>
    <a href="${BRAND.url}" style="display:inline-block;background:${BRAND.color};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Ver Dashboard Completo
    </a>
  `);
}

/**
 * Template: Alerta de sistema (cron falhou, health degraded)
 */
export function systemAlertTemplate(data: {
  type: string;
  message: string;
  details: string;
}): string {
  return layout(`
    <h2 style="margin:0 0 8px;color:#dc2626;font-size:18px;">⚠️ Alerta do Sistema</h2>
    <p style="color:#666;font-size:13px;margin:0 0 20px;">${data.type}</p>
    <div style="background:#fef2f2;border-radius:8px;padding:16px;border-left:4px solid #dc2626;margin:0 0 20px;">
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:14px;font-weight:600;">${data.message}</p>
      <p style="margin:0;color:#666;font-size:13px;">${data.details}</p>
    </div>
    <a href="${BRAND.url}/api/health" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Verificar Status
    </a>
  `);
}
