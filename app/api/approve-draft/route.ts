/**
 * API Route: GET /api/approve-draft?token=xxx
 *
 * Endpoint clicável do email de aprovação.
 * Valida token → move draft → live → redireciona para o dashboard.
 */

import { NextResponse } from 'next/server';
import { approveDraft } from '../../lib/draft';

export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token || token.length !== 32) {
    return new Response(htmlPage('Token Invalido', 'O link de aprovacao e invalido ou expirou.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const result = await approveDraft(token);

  if (!result.success) {
    const msgs: Record<string, string> = {
      invalid_token: 'Token invalido ou ja utilizado.',
      draft_expired: 'O rascunho expirou (mais de 24 horas).',
      redis_unavailable: 'Servico temporariamente indisponivel.',
      approve_failed: 'Erro ao aprovar. Tente novamente.',
    };
    return new Response(htmlPage('Erro', msgs[result.error || ''] || 'Erro desconhecido.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response(htmlPage('Aprovado!', 'Os dados foram publicados com sucesso no AFOS Analytics.', true), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function htmlPage(title: string, message: string, success: boolean): string {
  const color = success ? '#16a34a' : '#dc2626';
  const icon = success ? '&#10003;' : '&#10007;';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - AFOS Analytics</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="background:#fff;border-radius:16px;padding:48px;max-width:400px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<div style="width:64px;height:64px;border-radius:50%;background:${color}15;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:${color};">${icon}</div>
<h1 style="margin:0 0 12px;color:#1a1a1a;font-size:24px;">${title}</h1>
<p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">${message}</p>
<a href="https://afos-analitica-2026.vercel.app" style="display:inline-block;background:#0F52BA;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Ir para o Dashboard</a>
</div>
</body>
</html>`;
}
