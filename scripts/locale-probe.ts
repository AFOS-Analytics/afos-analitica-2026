/**
 * locale-probe.ts — lista os campos que a rodada PRECISA traduzir, sem escrever nada.
 *
 * 🔴 POR QUE NÃO DÁ PARA SONDAR COM O PRÓPRIO `construir`. Quando falta tradução,
 * ele chama `tirarDoCaminho(saida)`, que RENOMEIA o `.en.json` publicado para
 * `.rejeitado`. Esse arquivo é metade da memória de tradução: a outra metade é o
 * `scripts/tmp-head/<arquivo>.json`. Sondar com mapa vazio destruiria o par e a
 * rodada perderia a memória inteira, tendo que retraduzir campo que não mudou.
 *
 * Este script usa a MESMA função de caminhos e a MESMA lista de exclusão do
 * `construir`, então o que ele lista é exatamente o que o outro vai exigir.
 *
 * Uso: npx tsx scripts/locale-probe.ts [analysis-data|analysis-criteriosa|polls-data]
 */
import { readFileSync, existsSync } from 'fs'
import { FORA_DE_TRADUCAO } from './build-locale-json'
import { caminhosDeString } from './lib/translation-map'

function valorEm(raiz: any, caminho: string): any {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (const p of partes) v = v?.[p]
  return v
}

const ARQUIVOS = ['analysis-data', 'analysis-criteriosa', 'polls-data'] as const
const pedidos = process.argv.slice(2).filter(a => !a.startsWith('--'))
const alvos = pedidos.length ? pedidos : [...ARQUIVOS]
const mostrarTexto = process.argv.includes('--texto')

for (const arquivo of alvos) {
  const pt = JSON.parse(readFileSync(`public/${arquivo}.json`, 'utf-8'))
  const cabecaPath = `scripts/tmp-head/${arquivo}.json`
  if (!existsSync(cabecaPath)) {
    console.error(`❌ falta ${cabecaPath}. Sem ele não há memória, e TODO campo precisa de mapa.`)
    continue
  }
  const velho = JSON.parse(readFileSync(cabecaPath, 'utf-8'))

  // A memória casa por TEXTO DE ORIGEM, não por caminho, e é assim que o
  // `construir` faz. Reproduzir o mesmo critério aqui é o que garante que a
  // lista de baixo seja a mesma que ele vai exigir.
  const conhecidos = new Set<string>()
  for (const c of caminhosDeString(velho, '', FORA_DE_TRADUCAO)) {
    const o = valorEm(velho, c)
    if (typeof o === 'string') conhecidos.add(o)
  }

  const faltam: string[] = []
  let reaproveita = 0
  for (const c of caminhosDeString(pt, '', FORA_DE_TRADUCAO)) {
    const texto = valorEm(pt, c)
    if (typeof texto !== 'string') continue
    if (conhecidos.has(texto)) { reaproveita++; continue }
    faltam.push(c)
  }

  console.log(`\n== ${arquivo} ==  ${faltam.length} campo(s) para o mapa, ${reaproveita} da memória`)
  for (const c of faltam) {
    if (mostrarTexto) console.log(`  ${c}\n      ${String(valorEm(pt, c)).slice(0, 160)}`)
    else console.log(`  ${c}`)
  }
}
