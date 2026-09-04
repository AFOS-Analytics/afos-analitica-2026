/**
 * Lista os campos que PRECISAM de tradução nova, sem escrever nem mover nada.
 *
 * O `construir` do build-locale-json faz isso, mas com efeito colateral: ao
 * reprovar ele MOVE o arquivo do idioma para `.rejeitado`, que é o comportamento
 * certo numa tentativa real e o errado numa sondagem. Este script só lê.
 */
import { readFileSync, existsSync } from 'fs'
import { caminhosDeString } from './lib/translation-map'
import { FORA_DE_TRADUCAO } from './build-locale-json'

function valorEm(raiz: any, caminho: string): any {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (const p of partes) v = v?.[p]
  return v
}

const arquivo = process.argv[2]
const locale = process.argv[3]
const pt = JSON.parse(readFileSync(`public/${arquivo}.json`, 'utf-8'))
const saida = `public/${arquivo}.${locale}.json`
const ptAnterior = `scripts/tmp-head/${arquivo}.json`

const memoria = new Map<string, string>()
if (existsSync(ptAnterior) && existsSync(saida)) {
  const velho = JSON.parse(readFileSync(ptAnterior, 'utf-8'))
  const trad = JSON.parse(readFileSync(saida, 'utf-8'))
  for (const c of caminhosDeString(velho, '', FORA_DE_TRADUCAO)) {
    const o = valorEm(velho, c), t = valorEm(trad, c)
    if (typeof o === 'string' && typeof t === 'string') memoria.set(o, t)
  }
}
const faltam: string[] = []
for (const c of caminhosDeString(pt, '', FORA_DE_TRADUCAO)) {
  const texto = valorEm(pt, c)
  if (typeof texto !== 'string') continue
  if (memoria.has(texto)) continue
  faltam.push(c)
}
console.log(`### ${arquivo}.${locale}: ${faltam.length} campo(s)`)
for (const c of faltam) console.log(c)
