/**
 * API Route: GET/POST /api/unsubscribe
 *
 * RFC 8058 one-click unsubscribe.
 * - GET com ?token=X: cancela e mostra HTML de confirmação (clique em link de email)
 * - POST com body { List-Unsubscribe: 'One-Click' } ou JSON com token: cancela
 *   (Gmail/Outlook chamam isso automaticamente quando user aperta "Cancelar inscrição")
 *
 * Anti-enumeration: sempre retorna 200 mesmo se token inválido.
 */

import { NextResponse } from 'next/server'
import { unsubscribeByToken } from '../../lib/email/subscribers'

const HTML_OK = (email: string) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Inscricao cancelada</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#0F52BA;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6;margin:0 0 12px}a{color:#0F52BA}</style>
</head><body><main>
<h1>Inscricao cancelada</h1>
<p>Voce nao recebera mais emails do AFOS Analytics em <strong>${email.replace(/[<>"&]/g, '')}</strong>.</p>
<p>Se foi um engano, basta se inscrever novamente em <a href="https://afos-analytics.com">afos-analytics.com</a>.</p>
</main></body></html>`

const HTML_FAIL = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Link invalido</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#dc2626;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6}a{color:#0F52BA}</style>
</head><body><main>
<h1>Link invalido ou ja usado</h1>
<p>Para cancelar a inscricao, envie um email para <a href="mailto:contact@afos-analytics.com?subject=cancelar">contact@afos-analytics.com</a> com o assunto &quot;cancelar&quot;.</p>
</main></body></html>`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token') || ''

  const result = await unsubscribeByToken(token)
  if (!result.success || !result.email) {
    return new NextResponse(HTML_FAIL, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  return new NextResponse(HTML_OK(result.email), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(request: Request) {
  // RFC 8058: Gmail/Outlook fazem POST com body 'List-Unsubscribe=One-Click'.
  // Token vem do query string da URL List-Unsubscribe original.
  const { searchParams } = new URL(request.url)
  let token = searchParams.get('token') || ''

  if (!token) {
    try {
      const body = await request.json() as { token?: string }
      if (body && typeof body.token === 'string') token = body.token
    } catch {
      // Pode ser form-encoded ou body vazio (válido em RFC 8058 quando token está na URL)
    }
  }

  const result = await unsubscribeByToken(token)
  if (!result.success) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
