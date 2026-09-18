#!/usr/bin/env node
/**
 * MONTAR TRADUÇÃO DA DAILY — a URL vem do pt-BR, nunca da digitação.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 18/Set/2026: o portão de URL bloqueou a
 *    escrita da daily com HTTP 400 numa URL do Google News que eu tinha montado
 *    a partir de um dump truncado. A régua do comando já avisa, com todas as
 *    letras, "NÃO copie via `head -c N`", e ainda assim o caminho normal de
 *    escrita é digitar a URL. Numa daily há 15 a 25 links, vários com 300 a 800
 *    caracteres de token opaco, e eles se repetem nos TRÊS idiomas.
 *
 * ⭐ A tradução NÃO muda URL nenhuma, então digitá-las de novo é risco puro sem
 *    ganho. Aqui o tradutor escreve `](§1)`, `](§2)` e assim por diante, e este
 *    script preenche a partir do pt-BR, na ordem.
 *
 * ⛔ Ele ABORTA quando a contagem de marcadores não bate com a de links do
 *    pt-BR, porque desalinhar a ordem trocaria a URL de uma alegação pela de
 *    outra, que é pior que truncar: o link abre, a matéria é outra.
 *
 * Uso:
 *   node scripts/montar-traducao-daily.mjs 2026-09-18 en
 *   node scripts/montar-traducao-daily.mjs 2026-09-18 es --arquivo=rascunho.md
 *
 * Lê `public/afos-daily/{data}.md` como fonte das URLs e
 * `public/afos-daily/{data}.{idioma}.md` (ou `--arquivo`) como texto com §N.
 * Escreve por cima do arquivo do idioma.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const [data, idioma] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const alt = process.argv.slice(2).find((a) => a.startsWith('--arquivo='))?.slice(10)

if (!data || !idioma) {
  console.error('Uso: node scripts/montar-traducao-daily.mjs AAAA-MM-DD en|es [--arquivo=x.md]')
  process.exit(2)
}

const fonte = `public/afos-daily/${data}.md`
const alvo = alt ?? `public/afos-daily/${data}.${idioma}.md`

const pt = readFileSync(fonte, 'utf8')
const urls = [...pt.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1])
if (urls.length === 0) {
  console.error(`❌ nenhum link em ${fonte}. Fonte errada?`)
  process.exit(2)
}

let txt = readFileSync(alvo, 'utf8')
const marcadores = [...txt.matchAll(/\]\(§(\d+)\)/g)].map((m) => Number(m[1]))

if (marcadores.length === 0) {
  console.error(`❌ nenhum marcador §N em ${alvo}. Já foi montado, ou o tradutor digitou URL à mão?`)
  process.exit(2)
}

if (marcadores.length !== urls.length) {
  console.error(`❌ CONTAGEM NÃO BATE: ${urls.length} link(s) no pt-BR e ${marcadores.length} marcador(es) em ${alvo}.`)
  console.error('   Isto aborta de propósito: preencher fora de ordem trocaria a URL de uma alegação pela de outra,')
  console.error('   e o link abriria uma matéria que não é a citada, que é pior do que não abrir.')
  process.exit(1)
}

const esperados = urls.map((_, i) => i + 1)
const fora = marcadores.filter((n, i) => n !== esperados[i])
if (fora.length > 0) {
  console.error(`❌ os marcadores não estão em ordem crescente de 1 a ${urls.length}.`)
  console.error(`   primeiro fora de lugar: §${fora[0]}`)
  process.exit(1)
}

txt = txt.replace(/\]\(§(\d+)\)/g, (_, n) => `](${urls[Number(n) - 1]})`)
writeFileSync(alvo, txt)

console.log(`✅ ${alvo}: ${urls.length} URL(s) copiadas do pt-BR, na ordem.`)
console.log('   ⛔ Nenhuma foi digitada, então nenhuma pode estar truncada.')
