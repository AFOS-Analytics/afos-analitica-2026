/**
 * API Route: GET/POST /api/unsubscribe
 *
 * RFC 8058 one-click unsubscribe.
 * - GET com ?token=X: SÓ confere o token e mostra a página de CONFIRMAÇÃO, com
 *   um botão que faz POST para esta mesma rota. Não grava nada.
 * - POST vindo desse botão (form com `confirmar=1`): cancela e mostra a página
 *   de inscrição cancelada.
 * - POST com body { List-Unsubscribe: 'One-Click' } ou JSON com token: cancela
 *   e responde JSON (Gmail/Outlook chamam isso automaticamente quando o
 *   usuário aperta "Cancelar inscrição", pelo cabeçalho List-Unsubscribe-Post).
 *
 * 🔴 POR QUE O GET NÃO CANCELA MAIS. Filtros de segurança de e-mail (Safe Links
 * e similares) e pré-visualizações abrem TODO link da mensagem com GET. Com o
 * GET cancelando na hora, o varredor descadastrava a pessoa sem clique humano.
 * O RFC 8058 põe a ação no POST justamente por isso.
 *
 * As páginas saem no idioma do lead (preferredLocale, senão locale). O texto
 * em português é o original; en e es são fiéis a ele.
 *
 * Anti-enumeration: sempre retorna 200 mesmo se token inválido.
 * Cache-Control: no-store para evitar cache do browser causar segundo unsubscribe falhar.
 */

import { NextResponse } from 'next/server'
import { findLeadByUnsubscribeToken, unsubscribeByToken } from '../../lib/email/subscribers'

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
}

const HTML_HEADERS = { 'Content-Type': 'text/html; charset=utf-8', ...NO_CACHE_HEADERS }

type Idioma = 'pt-BR' | 'en' | 'es'

function idiomaDe(raw: string | undefined | null): Idioma {
  const l = (raw || '').toLowerCase()
  if (l.startsWith('en')) return 'en'
  if (l.startsWith('es')) return 'es'
  return 'pt-BR'
}

/** Sem lead conhecido (token inválido), o idioma vem do navegador. */
function idiomaDoNavegador(request: Request): Idioma {
  return idiomaDe(request.headers.get('accept-language')?.split(',')[0]?.split(';')[0]?.trim())
}

function htmlEscape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const HTML_OK_PT = (email: string) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Inscricao cancelada</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#0F52BA;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6;margin:0 0 12px}a{color:#0F52BA}</style>
</head><body><main>
<h1>Inscricao cancelada</h1>
<p>Voce nao recebera mais emails do AFOS Analytics em <strong>${htmlEscape(email)}</strong>.</p>
<p>Se foi um engano, basta se inscrever novamente em <a href="https://www.afos-analytics.com">afos-analytics.com</a>.</p>
</main></body></html>`

const HTML_FAIL_PT = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Link invalido</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#dc2626;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6}a{color:#0F52BA}</style>
</head><body><main>
<h1>Link invalido ou ja usado</h1>
<p>Para cancelar a inscricao, envie um email para <a href="mailto:contact@afos-analytics.com?subject=cancelar">contact@afos-analytics.com</a> com o assunto &quot;cancelar&quot;.</p>
</main></body></html>`

const ESTILO_OK = `<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#0F52BA;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6;margin:0 0 12px}a{color:#0F52BA}button{font:inherit;font-size:14px;font-weight:600;background:#0F52BA;color:#fff;border:0;border-radius:8px;padding:12px 24px;cursor:pointer}</style>`
const ESTILO_FAIL = `<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:48px 16px;color:#1a1a1a}main{max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center}h1{color:#dc2626;font-size:20px;margin:0 0 12px}p{color:#444;font-size:14px;line-height:1.6}a{color:#0F52BA}</style>`

/** Textos das páginas em en e es, fiéis ao português original acima. */
const TEXTOS = {
  en: {
    okTitulo: 'Unsubscribed',
    okLinha1: (email: string) => `You will no longer receive emails from AFOS Analytics at <strong>${htmlEscape(email)}</strong>.`,
    okLinha2: 'If this was a mistake, just subscribe again at <a href="https://www.afos-analytics.com">afos-analytics.com</a>.',
    failTitulo: 'Invalid link',
    failH1: 'Invalid or already used link',
    failTexto: 'To unsubscribe, send an email to <a href="mailto:contact@afos-analytics.com?subject=unsubscribe">contact@afos-analytics.com</a> with the subject &quot;unsubscribe&quot;.',
  },
  es: {
    okTitulo: 'Suscripción cancelada',
    okLinha1: (email: string) => `Ya no recibirá más correos de AFOS Analytics en <strong>${htmlEscape(email)}</strong>.`,
    okLinha2: 'Si fue un error, basta con suscribirse de nuevo en <a href="https://www.afos-analytics.com">afos-analytics.com</a>.',
    failTitulo: 'Enlace no válido',
    failH1: 'Enlace no válido o ya utilizado',
    failTexto: 'Para cancelar la suscripción, envíe un correo a <a href="mailto:contact@afos-analytics.com?subject=cancelar">contact@afos-analytics.com</a> con el asunto &quot;cancelar&quot;.',
  },
} as const

/** Página de confirmação (nova em 12/Nov/2026), nos três idiomas. */
const CONFIRMAR = {
  'pt-BR': {
    titulo: 'Cancelar inscrição',
    texto: 'Confirme abaixo para deixar de receber os emails do AFOS Analytics.',
    botao: 'Confirmar cancelamento',
  },
  en: {
    titulo: 'Unsubscribe',
    texto: 'Confirm below to stop receiving emails from AFOS Analytics.',
    botao: 'Confirm unsubscribe',
  },
  es: {
    titulo: 'Cancelar suscripción',
    texto: 'Confirme abajo para dejar de recibir los correos de AFOS Analytics.',
    botao: 'Confirmar cancelación',
  },
} as const

function htmlOk(email: string, idioma: Idioma): string {
  if (idioma === 'pt-BR') return HTML_OK_PT(email)
  const T = TEXTOS[idioma]
  return `<!DOCTYPE html>
<html lang="${idioma}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${T.okTitulo}</title>
${ESTILO_OK}
</head><body><main>
<h1>${T.okTitulo}</h1>
<p>${T.okLinha1(email)}</p>
<p>${T.okLinha2}</p>
</main></body></html>`
}

function htmlFail(idioma: Idioma): string {
  if (idioma === 'pt-BR') return HTML_FAIL_PT
  const T = TEXTOS[idioma]
  return `<!DOCTYPE html>
<html lang="${idioma}"><head><meta charset="UTF-8"><title>${T.failTitulo}</title>
${ESTILO_FAIL}
</head><body><main>
<h1>${T.failH1}</h1>
<p>${T.failTexto}</p>
</main></body></html>`
}

function htmlConfirmar(token: string, idioma: Idioma): string {
  const C = CONFIRMAR[idioma]
  const action = `/api/unsubscribe?token=${encodeURIComponent(token)}`
  return `<!DOCTYPE html>
<html lang="${idioma}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex"><title>${C.titulo}</title>
${ESTILO_OK}
</head><body><main>
<h1>${C.titulo}</h1>
<p>${C.texto}</p>
<form method="post" action="${htmlEscape(action)}">
<input type="hidden" name="confirmar" value="1">
<input type="hidden" name="lang" value="${idioma}">
<button type="submit">${C.botao}</button>
</form>
</main></body></html>`
}

/** Lê o token (URL primeiro, depois o corpo) e diz se o POST veio do botão da página. */
async function lerPedido(request: Request): Promise<{ token: string; doFormulario: boolean; lang: string }> {
  const { searchParams } = new URL(request.url)
  let token = searchParams.get('token') || ''
  let doFormulario = false
  let lang = ''

  // Tentar form-encoded body (Gmail/Outlook às vezes enviam assim)
  const contentType = request.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(await request.text())
      if (!token) token = params.get('token') || ''
      doFormulario = params.get('confirmar') === '1'
      lang = params.get('lang') || ''
    } else if (contentType.includes('application/json') && !token) {
      const body = (await request.json()) as { token?: string }
      token = typeof body?.token === 'string' ? body.token : ''
    }
  } catch {
    // body vazio ou malformado — válido em RFC 8058 quando token está só na URL
  }
  return { token, doFormulario, lang }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token') || ''

  const lead = await findLeadByUnsubscribeToken(token)
  if (!lead.success) {
    return new NextResponse(htmlFail(idiomaDoNavegador(request)), { status: 200, headers: HTML_HEADERS })
  }

  return new NextResponse(htmlConfirmar(token, idiomaDe(lead.locale)), { status: 200, headers: HTML_HEADERS })
}

export async function POST(request: Request) {
  const { token, doFormulario, lang } = await lerPedido(request)
  const result = await unsubscribeByToken(token)

  if (doFormulario) {
    if (!result.success || !result.email) {
      return new NextResponse(htmlFail(lang ? idiomaDe(lang) : idiomaDoNavegador(request)), { status: 200, headers: HTML_HEADERS })
    }
    return new NextResponse(htmlOk(result.email, idiomaDe(result.locale)), { status: 200, headers: HTML_HEADERS })
  }

  if (!result.success) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200, headers: NO_CACHE_HEADERS })
  }
  return NextResponse.json({ ok: true }, { status: 200, headers: NO_CACHE_HEADERS })
}
