/**
 * Diagnóstico: lista os caminhos cujo texto pt-BR mudou desde tmp-head e que,
 * portanto, PRECISAM entrar no mapa do idioma. Não escreve nada.
 */
import { readFileSync } from 'fs'
import { caminhosDeString } from './lib/translation-map'
import { FORA_DE_TRADUCAO } from './build-locale-json'

function valorEm(raiz: any, caminho: string): any {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (const p of partes) v = v?.[p]
  return v
}

const arquivo = process.argv[2] as 'analysis-data' | 'analysis-criteriosa' | 'polls-data'
const pt = JSON.parse(readFileSync(`public/${arquivo}.json`, 'utf-8'))
const velho = JSON.parse(readFileSync(`scripts/tmp-head/${arquivo}.json`, 'utf-8'))

const conhecidos = new Set<string>()
for (const c of caminhosDeString(velho, '', FORA_DE_TRADUCAO)) {
  const o = valorEm(velho, c)
  if (typeof o === 'string') conhecidos.add(o)
}

const novos: string[] = []
for (const c of caminhosDeString(pt, '', FORA_DE_TRADUCAO)) {
  const texto = valorEm(pt, c)
  if (typeof texto !== 'string') continue
  if (!conhecidos.has(texto)) novos.push(c)
}

console.log(`\n=== ${arquivo}: ${novos.length} campo(s) precisam de tradução nova ===`)
for (const c of novos) console.log(`  ${c}`)
