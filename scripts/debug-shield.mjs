/**
 * Reproduz o caso que abortou: descobrir O QUE o modelo faz com um link cuja
 * ancora e PROSA TRADUZIVEL (nao um nome proprio como TSE).
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })
import { shieldLinks } from '../lib/ai/link-shield.ts'

const SRC = '**Flávio deu o maior salto individual do dia** no sub-mercado de [2º lugar do 1º turno](https://polymarket.com/event/brazil-presidential-election-first-round-2nd-place), para **83,50%** (↑5,0pp, USD 175 mil).'

const { masked, links } = shieldLinks(SRC)
console.log('=== o que o modelo RECEBE ===')
console.log(masked)
console.log('\nlinks protegidos:', JSON.stringify(links, null, 1))

// chamada crua ao provider, sem o unshield, para ver a saida bruta
const { SYSTEM_PROMPT, afosDailyTranslationPrompt } = await import('../lib/ai/prompts.ts')
const key = process.env.TRANSLATION_API_KEY ?? process.env.ANTHROPIC_API_KEY
const prompt = afosDailyTranslationPrompt(masked, 'pt-BR', 'en', [
  { term: 'TSE', id: 'tse' }, { term: 'STF', id: 'stf' }, { term: '1º turno', id: 'primeiro-turno' }, { term: '2º turno', id: 'segundo-turno' },
])
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
  body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: prompt }] }),
})
const data = await res.json()
const out = (data.content?.[0]?.text || '').trim()
console.log('\n=== o que o modelo DEVOLVE (bruto, sem unshield) ===')
console.log(out)
console.log('\n=== diagnostico ===')
console.log('token ⟦U0⟧ sobreviveu? ' + (/⟦\s*U\s*0\s*⟧/.test(out) ? 'SIM' : 'NAO <<< aqui esta o problema'))
const links2 = [...out.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => ({ ancora: m[1], destino: m[2] }))
console.log('links na saida:', JSON.stringify(links2, null, 1))
