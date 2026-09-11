#!/usr/bin/env node
/**
 * conferir-paridade-readme.mjs — os dois READMEs contam os MESMOS achados?
 *
 * A régua da casa é que todo achado datado exista em inglês e em português. Ela
 * vinha sendo conferida à mão, com um regex escrito na hora, e em 11/Set/2026
 * isso produziu uma dívida INEXISTENTE: o contador reconhecia só `(DD/Mmm/AAAA)`
 * e um achado usava `(Mmm DD, AAAA)`, então 55 e 55 apareceram como 54 e 55 e eu
 * levei ao André a conclusão de que faltava uma tradução. Faltava um medidor.
 *
 * ⛔ Ele lê e reprova. Não reescreve README.
 *
 * Uso:
 *   npm run paridade:readme
 *   node scripts/conferir-paridade-readme.mjs --data=2026-09-11
 *
 * Saída 0 = paridade fecha em todas as datas. 1 = alguma data diverge.
 */

import { readFileSync, existsSync } from 'fs'
import { compararParidade, formatarParidade, acharDatasEN, acharDatasPT, chave } from './lib/paridade-readme.mjs'

const EN = 'README.md'
const PT = 'README.pt-BR.md'

for (const f of [EN, PT]) {
  if (!existsSync(f)) {
    console.error(`❌ ${f} não encontrado. Rodar da raiz do projeto.`)
    process.exit(1)
  }
}

const textoEN = readFileSync(EN, 'utf8')
const textoPT = readFileSync(PT, 'utf8')
const r = compararParidade(textoEN, textoPT)

console.log('')
console.log(`🔎 PARIDADE DOS READMEs · ${new Date().toISOString()}`)
console.log('')
for (const l of formatarParidade(r)) console.log(l)

// 🔒 Portão de colapso: zero achado dos dois lados passaria como "paridade
// fecha", e seria o medidor mudo em vez de dois arquivos em dia.
if (r.totalEN === 0 && r.totalPT === 0) {
  console.log('')
  console.log('❌ ZERO achados datados nos DOIS arquivos. Isso não é paridade, é o padrão')
  console.log('   ter mudado ou o arquivo errado ter sido lido. Conferir à mão.')
  process.exit(1)
}

const data = process.argv.slice(2).find((a) => a.startsWith('--data='))?.slice(7)
if (data) {
  const nEN = acharDatasEN(textoEN).filter((d) => chave(d) === data).length
  const nPT = acharDatasPT(textoPT).filter((d) => chave(d) === data).length
  console.log('')
  console.log(`📅 ${data}:  EN ${nEN} · pt-BR ${nPT}  ${nEN === nPT && nEN > 0 ? '✅' : nEN === 0 ? '⚠️ nenhum achado nessa data' : '🔴'}`)
}

console.log('')
process.exit(r.divergencias.length ? 1 : 0)
