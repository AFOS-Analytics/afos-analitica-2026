#!/usr/bin/env node
/**
 * Disparo TESTE do email de launch para um endereço específico.
 * Usa Resend API com chave do .env.local.
 *
 * Uso: node scripts/send-test-launch-email.mjs <email> [pt|en]
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Load .env.local manually
const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
const envMap = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g, '')] })
)
const RESEND_API_KEY = envMap.RESEND_API_KEY || process.env.RESEND_API_KEY
if (!RESEND_API_KEY) { console.error('RESEND_API_KEY ausente'); process.exit(1) }

const to = process.argv[2]
const lang = (process.argv[3] || 'pt').toLowerCase()
const recipientName = process.argv[4] || 'Rogério'
const fileArg = process.argv[5] || '07-email-tier1-launch-dday-en-pt-br.md'
if (!to) { console.error('Uso: node send-test-launch-email.mjs <email> [pt|en] [nome] [arquivo.md]'); process.exit(1) }

const md = readFileSync(resolve(process.cwd(), 'docs/launch-texts/' + fileArg), 'utf-8')

// Extract all code blocks then identify by content (resilient para arquivos com ordem diferente)
const codeBlocks = [...md.matchAll(/```\n([\s\S]*?)\n```/g)].map(m => m[1].trim())
const SEPARATOR_REGEX = /\n\s*[—\-═]+\s*[^\n]*?(Vers[ãa]o em portugu[êe]s|English version)[^\n]*?\n/i

// New: detect hybrid block (single block containing both EN and PT separated by hybrid separator)
let bodyEN = ''
let bodyPT = ''
const hybridBlock = codeBlocks.find(b => /^Hi[\s,]/m.test(b) && /^Olá[\s,]/m.test(b) && SEPARATOR_REGEX.test(b))
if (hybridBlock) {
  const parts = hybridBlock.split(SEPARATOR_REGEX)
  const cleanParts = parts.filter(p => p && p.trim() && !/^(Vers[ãa]o em portugu[êe]s|English version)/i.test(p.trim().slice(0, 50)))
  for (const p of cleanParts) {
    if (/^Hi[\s,]/m.test(p.trim())) bodyEN = p.trim()
    else if (/^Olá[\s,]/m.test(p.trim())) bodyPT = p.trim()
  }
} else {
  // Legacy: separate code blocks for EN and PT
  bodyPT = codeBlocks.find(b => /^Olá[\s,]/m.test(b)) || ''
  bodyEN = codeBlocks.find(b => /^Hi[\s,]/m.test(b)) || ''
}

let subjectEN = codeBlocks.find(b => b.length < 200 && /^(Live now|Heads-up|Political risk|AFOS Analytics)/i.test(b)) || ''
let subjectPT = codeBlocks.find(b => b.length < 200 && /^(Lan[çc]amento|Embargo|Infraestrutura)/i.test(b)) || ''
const preheader = codeBlocks.find(b => b.length < 250 && b !== subjectEN && b !== subjectPT && /(Three signals|Cross-referencing|narrative)/i.test(b)) || ''

// Files like 10-email-cold-3lines have "Subject: X\n\nHi [Nome]" inline. Extract subject from body if not found separately.
function splitSubjectInline(body) {
  const lines = body.split('\n')
  const m = lines[0].match(/^Subject:\s*(.+)$/)
  if (!m) return null
  let i = 1
  while (i < lines.length && lines[i].trim() === '') i++
  return { subject: m[1].trim(), body: lines.slice(i).join('\n') }
}
if (!subjectEN && bodyEN) {
  const ex = splitSubjectInline(bodyEN)
  if (ex) { subjectEN = ex.subject; bodyEN = ex.body }
}
if (!subjectPT && bodyPT) {
  const ex = splitSubjectInline(bodyPT)
  if (ex) { subjectPT = ex.subject; bodyPT = ex.body }
}

// Fallback: se um subject não existe, usa o outro (template com subject único)
if (!subjectPT && subjectEN) subjectPT = subjectEN
if (!subjectEN && subjectPT) subjectEN = subjectPT

if (!subjectEN || !subjectPT || !bodyEN || !bodyPT) {
  console.error('❌ Parsing falhou. Code blocks encontrados:', codeBlocks.length)
  console.error('subjectEN:', !!subjectEN, 'subjectPT:', !!subjectPT, 'bodyEN:', !!bodyEN, 'bodyPT:', !!bodyPT)
  process.exit(1)
}

const isHybrid = lang === 'hybrid' || lang === 'both'
const subject = '[TESTE] ' + (lang === 'en' ? subjectEN : subjectPT)
let body
if (isHybrid) {
  const bodyPTClean = bodyPT.replace('[Nome]', recipientName).replace(/\[PERSONALIZAR.*?\]/g, '(linha de personalização aqui)')
  const bodyENClean = bodyEN.replace('[Nome]', recipientName).replace(/\[PERSONALIZAR.*?\]/g, '(personalization line here)')
  body = bodyENClean + '\n\n---HYBRID-SEPARATOR---\n\n' + bodyPTClean
} else {
  body = (lang === 'pt' ? bodyPT : bodyEN).replace('[Nome]', recipientName)
  body = body.replace(/\[PERSONALIZAR.*?\]/g, '(linha de personalização aqui)')
}

// Build HTML
const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:'Segoe UI',-apple-system,Arial,sans-serif;color:#1f2937;line-height:1.6;max-width:600px;margin:0 auto;padding:24px;font-size:15px}p{margin:0 0 14px}ul{padding-left:20px;margin:0 0 14px}li{margin:4px 0}a{color:#0F52BA}.preheader{font-size:11px;color:#94a3b8;font-style:italic;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e2e8f0}.banner{background:#fef3c7;border:1px solid #f59e0b;padding:10px 14px;border-radius:6px;font-size:12px;color:#92400e;margin-bottom:18px}.signature{margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;font-size:13px;color:#475569}.signature img{display:block;margin-bottom:8px;width:180px;height:auto}.signature .brand{color:#0F52BA;font-weight:700;font-size:14px}.signature .tag{color:#64748b;font-size:12px;margin-top:2px}</style>
</head><body>
<div class="banner">📄 <strong>TESTE DE ENVIO</strong> — este é um envio de teste do email de launch (arquivo 07). Não distribuir.</div>
<div class="preheader">${preheader}</div>
${body.split('\n\n').filter(p => !/^(Atenciosamente|Best),?\s*$/i.test(p.trim()) && !/^AFOS Analytics$/i.test(p.trim()) && !/^contact@afos-analytics\.com$/i.test(p.trim())).map(p => {
  if (p.trim() === '---HYBRID-SEPARATOR---') {
    return '<div style="margin:32px 0 24px;padding:12px 0;border-top:2px dashed #cbd5e1;border-bottom:2px dashed #cbd5e1;text-align:center;font-size:11px;letter-spacing:0.15em;color:#64748b;text-transform:uppercase;">Versão em português abaixo ↓</div>'
  }
  if (p.startsWith('•') || p.startsWith('- ')) {
    const items = p.split('\n').map(l => l.replace(/^[•-]\s*/, '')).filter(Boolean)
    return '<ul>' + items.map(i => '<li>' + i.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>') + '</li>').join('') + '</ul>'
  }
  return '<p>' + p.replace(/\n/g, '<br>').replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>') + '</p>'
}).join('\n')}
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:1px solid #e2e8f0;padding-top:18px;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="vertical-align:top;padding-right:18px;">
      <img src="https://www.afos-analytics.com/brand/logo-icon-256.png" alt="AFOS" width="72" height="72" style="display:block;border-radius:14px;">
    </td>
    <td style="vertical-align:top;">
      <div style="font-size:18px;font-weight:700;color:#0F52BA;line-height:1.2;">AFOS contact</div>
      <div style="font-size:14px;color:#475569;margin-top:4px;">AFOS Contact</div>
      <div style="font-size:13px;color:#0F52BA;font-style:italic;margin-top:6px;">Global Political Risk Intelligence</div>
      <div style="font-size:13px;color:#475569;margin-top:10px;">
        <a href="https://www.afos-analytics.com" style="color:#475569;text-decoration:none;">www.afos-analytics.com</a>
        &nbsp;·&nbsp;
        <a href="mailto:contact@afos-analytics.com" style="color:#475569;text-decoration:none;">contact@afos-analytics.com</a>
      </div>
    </td>
  </tr>
</table>
</body></html>`

const payload = {
  from: 'AFOS Analytics <contact@afos-analytics.com>',
  to: [to],
  reply_to: 'contact@afos-analytics.com',
  subject,
  html,
  text: body,
}

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

const result = await res.json()
if (res.ok) {
  console.log(`✅ Enviado · id: ${result.id} · to: ${to} · lang: ${lang}`)
  console.log(`   Subject: ${subject}`)
} else {
  console.error(`❌ Falhou (${res.status}):`, JSON.stringify(result, null, 2))
  process.exit(1)
}
