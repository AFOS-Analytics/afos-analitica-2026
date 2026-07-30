/**
 * Lista os campos cujo texto pt-BR mudou desde o HEAD e que, por isso, PRECISAM
 * entrar no mapa de tradução. Sem isso o build aborta um caminho por vez, e
 * descobrir 80 campos a um por rodada custa 80 rodadas.
 *
 * Não escreve nada. Só imprime o inventário.
 */
import { readFileSync } from 'fs'
import { FORA_DE_TRADUCAO } from '../build-locale-json'
import { caminhosDeString } from '../lib/translation-map'

function valorEm(raiz: any, caminho: string): any {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (const p of partes) v = v?.[p]
  return v
}

const arquivos = ['analysis-data', 'analysis-criteriosa', 'polls-data'] as const
const modo = process.argv[2] === '--texto' ? 'texto' : 'lista'

for (const arq of arquivos) {
  const pt = JSON.parse(readFileSync(`public/${arq}.json`, 'utf-8'))
  const velho = JSON.parse(readFileSync(`scripts/tmp-head/${arq}.json`, 'utf-8'))

  // memória: texto pt-BR anterior -> existe tradução publicada
  const conhecidos = new Set<string>()
  for (const c of caminhosDeString(velho, '', FORA_DE_TRADUCAO)) {
    const o = valorEm(velho, c)
    if (typeof o === 'string') conhecidos.add(o)
  }

  const faltando: string[] = []
  for (const c of caminhosDeString(pt, '', FORA_DE_TRADUCAO)) {
    const txt = valorEm(pt, c)
    if (typeof txt !== 'string') continue
    if (conhecidos.has(txt)) continue // reaproveita tradução por texto de origem
    faltando.push(c)
  }

  console.log(`\n######## ${arq} — ${faltando.length} campos precisam de tradução ########`)
  for (const c of faltando) {
    if (modo === 'texto') {
      console.log(`\n===[${c}]===\n${valorEm(pt, c)}`)
    } else {
      const t = String(valorEm(pt, c))
      console.log(`  ${c}   (${t.length}c)`)
    }
  }
}
