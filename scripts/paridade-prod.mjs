#!/usr/bin/env node
/**
 * PARIDADE COM A PRODUÇÃO: cada JSON de `public/` contra o que o site serve agora.
 *
 * 🔑 POR QUE ISTO EXISTE, medido em 16/Out/2026: as duas faixas publicam de worktree,
 *    e o deploy leva a árvore INTEIRA. Antes de cada deploy a pergunta é "o que eu NÃO
 *    mexi está igual ao que está no ar?", e depois é "o que eu mexi chegou?". A conta
 *    era um laço de `md5sum` e `curl` escrito à mão, quatro vezes numa sessão só, e na
 *    quarta ele pegou o caso que ela existe para pegar: o merge com `origin/main` tinha
 *    trazido o `us-polls-data.json` da outra faixa, commitado e AINDA NÃO publicado.
 *    O deploy do merge teria publicado o trabalho dela antes da hora.
 *
 * Uso:
 *   node scripts/paridade-prod.mjs                          # todos devem estar IGUAIS (depois do deploy)
 *   node scripts/paridade-prod.mjs --meus=analysis-data.json,polls-data.json   # antes do deploy
 *   node scripts/paridade-prod.mjs --meus=br                # atalho: os 9 do painel do Brasil
 *
 * Saída: 0 quando tudo bate com o esperado; 1 quando um arquivo que NÃO é seu difere
 * da produção (deploy levaria mudança alheia, ou reverteria uma); 2 quando um arquivo
 * seu já está igual antes do deploy ou diferente depois (`--depois`); 3 quando a
 * produção não respondeu, porque arquivo que não foi lido não é arquivo igual.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { baseDeLeitura } from './lib/base-afos.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const BR = ['analysis-data', 'analysis-criteriosa', 'polls-data'].flatMap((b) => [`${b}.json`, `${b}.en.json`, `${b}.es.json`])
const meusArg = valor('meus')
const meus = new Set(meusArg === 'br' ? BR : (meusArg ?? '').split(',').map((s) => s.trim()).filter(Boolean))
const depois = argv.includes('--depois')

// manifest.json é do Next e muda a cada build; não é dado editorial.
const arquivos = readdirSync('public').filter((f) => f.endsWith('.json') && f !== 'manifest.json').sort()
const desconhecidos = [...meus].filter((m) => !arquivos.includes(m))
if (desconhecidos.length) {
  console.error(`❌ --meus cita arquivo que não existe em public/: ${desconhecidos.join(', ')}`)
  process.exit(3)
}

const base = baseDeLeitura()
const sha = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 12)

console.log(`\n🔁 PARIDADE public/ × ${base}`)
console.log(meus.size ? `   seus (esperados ${depois ? 'IGUAIS, já publicados' : 'DIFERENTES, ainda por publicar'}): ${[...meus].join(', ')}` : '   sem --meus: todos devem estar IGUAIS')

let alheioDiferente = 0, meuFora = 0, semLeitura = 0
for (const f of arquivos) {
  const local = sha(readFileSync(`public/${f}`))
  let prod
  try {
    const r = await fetch(`${base}/${f}?paridade=${Date.now()}`, { cache: 'no-store' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    prod = sha(Buffer.from(await r.arrayBuffer()))
  } catch (e) {
    console.log(`   ⚠️  ${f.padEnd(30)} produção não respondeu (${e.message ?? e})`)
    semLeitura++
    continue
  }
  const igual = local === prod
  const meu = meus.has(f)
  let marca
  if (!meu) {
    marca = igual ? '✅ igual' : '🔴 DIFERENTE e não é seu'
    if (!igual) alheioDiferente++
  } else if (depois) {
    marca = igual ? '✅ publicado' : '🔴 seu e AINDA diferente'
    if (!igual) meuFora++
  } else {
    marca = igual ? '🟡 seu e já IGUAL (nada a publicar?)' : '🟢 seu, vai mudar'
    if (igual) meuFora++
  }
  console.log(`   ${marca.padEnd(36)} ${f}`)
}

console.log('')
if (semLeitura) {
  console.log(`⚠️ VEREDITO: ${semLeitura} arquivo(s) sem leitura da produção. Não leu não é igual.`)
  process.exit(3)
}
if (alheioDiferente) {
  console.log(`🔴 VEREDITO: ${alheioDiferente} arquivo(s) que NÃO são seus diferem da produção.`)
  console.log('   Antes do deploy: o build levaria mudança de outra faixa (ou reverteria uma publicada).')
  console.log('   Saída limpa: publicar do seu commit ANTERIOR ao merge, e empurrar o merge sem publicá-lo.')
  process.exit(1)
}
if (meuFora) {
  console.log(`🟡 VEREDITO: ${meuFora} arquivo(s) seu(s) fora do esperado; conferir antes de seguir.`)
  process.exit(2)
}
console.log('✅ VEREDITO: a produção bate com o esperado.')
