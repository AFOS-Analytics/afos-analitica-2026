/**
 * API Route: GET/POST /api/unsubscribe
 *
 * RFC 8058 one-click unsubscribe.
 * - GET com ?token=X: cancela e mostra HTML de confirmação (clique em link de email)
 * - POST com body { List-Unsubscribe: 'One-Click' } ou JSON com token: cancela
 *   (Gmail/Outlook chamam isso automaticamente quando user aperta "Cancelar inscrição")
 *
 * Anti-enumeration: sempre retorna 200 mesmo se token inválido.
 * Cache-Control: no-store para evitar cache do browser causar segundo unsubscribe falhar.
 */

import { NextResponse } from 'next/server'
import { unsubscribeByToken } from '../../lib/email/subscribers'

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
}

function htmlEscape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const HTML_OK = (email: string) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Inscricao cancelada</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#0F52BA;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6;margin:0 0 12px}a{color:#0F52BA}</style>
</head><body><main>
<h1>Inscricao cancelada</h1>
<p>Voce nao recebera mais emails do AFOS Analytics em <strong>${htmlEscape(email)}</strong>.</p>
<p>Se foi um engano, basta se inscrever novamente em <a href="https://afos-analytics.com">afos-analytics.com</a>.</p>
</main></body></html>`

const HTML_FAIL = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Link invalido</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#dc2626;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6}a{color:#0F52BA}</style>
</head><body><main>
<h1>Link invalido ou ja usado</h1>
<p>Para cancelar a inscricao, envie um email para <a href="mailto:contact@afos-analytics.com?subject=cancelar">contact@afos-analytics.com</a> com o assunto &quot;cancelar&quot;.</p>
</main></body></html>`

async function extractToken(request: Request): Promise<string> {
  const { searchParams } = new URL(request.url)
  const fromUrl = searchParams.get('token') || ''
  if (fromUrl) return fromUrl

  // Tentar form-encoded body (Gmail/Outlook às vezes enviam assim)
  const contentType = request.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      return params.get('token') || ''
    }
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { token?: string }
      return typeof body?.token === 'string' ? body.token : ''
    }
  } catch {
    // body vazio ou malformado — válido em RFC 8058 quando token está só na URL
  }
  return ''
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token') || ''

  const result = await unsubscribeByToken(token)
  if (!result.success || !result.email) {
    return new NextResponse(HTML_FAIL, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...NO_CACHE_HEADERS },
    })
  }

  return new NextResponse(HTML_OK(result.email), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...NO_CACHE_HEADERS },
  })
}

export async function POST(request: Request) {
  const token = await extractToken(request)
  const result = await unsubscribeByToken(token)
  if (!result.success) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200, headers: NO_CACHE_HEADERS })
  }
  return NextResponse.json({ ok: true }, { status: 200, headers: NO_CACHE_HEADERS })
}
