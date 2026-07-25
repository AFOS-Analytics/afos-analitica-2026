/**
 * Monta public/<arquivo>.<locale>.json a partir do pt-BR + memória + mapa novo.
 *
 * COMO FUNCIONA
 *  1. Estrutura vem SEMPRE do pt-BR atual, então chave nova, chave removida e
 *     reordenação de array acompanham sozinhas.
 *  2. Campo cujo texto pt-BR não mudou desde o último commit reaproveita a
 *     tradução já publicada, buscada por TEXTO DE ORIGEM e não por caminho
 *     (polls[] muda de índice quando uma pesquisa sai por frescor).
 *  3. Campo cujo texto mudou tem de estar no mapa. Se não estiver, o script
 *     ABORTA em vez de publicar português calado dentro do arquivo inglês.
 *  4. Gate numérico no fim. Divergiu, NÃO escreve, e o readLocalized devolve
 *     pt-BR. Melhor servir português do que publicar número errado.
 *
 * Uso: importado por scripts/locale-maps/<arquivo>.<locale>.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { compararNumeros } from './lib/json-number-gate'
import { caminhosDeString } from './lib/translation-map'

/** Não se traduz: dado, metadado, procedência, cor, protocolo, nome próprio. */
export const FORA_DE_TRADUCAO = [
  /\.(date|fieldDates|register|reliability|sample|margin|color|pc|mc|rank|party|updatedAt|lastUpdate|id)$/,
  /^(updatedAt|lastUpdate|date)$/,
  /\.candidate$/, /\.candidate1$/, /\.candidate2$/, /\.matchup$/,
  /\.institute$/, /\.president$/, /\.name$/, /\.n$/,
]

function valorEm(raiz: any, caminho: string): any {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (const p of partes) v = v?.[p]
  return v
}

function gravarEm(raiz: any, caminho: string, valor: string): void {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (let i = 0; i < partes.length - 1; i++) v = v[partes[i]]
  v[partes[partes.length - 1]] = valor
}

export function construir(
  arquivo: 'analysis-data' | 'analysis-criteriosa' | 'polls-data',
  locale: 'en' | 'es',
  mapa: Record<string, string>,
): void {
  const pt = JSON.parse(readFileSync(`public/${arquivo}.json`, 'utf-8'))
  const saida = `public/${arquivo}.${locale}.json`

  // Memória: texto pt-BR anterior -> tradução publicada, se houver base.
  //
  // ⚠️ ARMADILHA, e ela morde de verdade: `ptAnterior` e `saida` PRECISAM vir da
  // MESMA publicação, porque a memória casa os dois pelo mesmo caminho. Rodar
  // este script duas vezes no mesmo dia quebra esse par: na segunda vez `saida`
  // já tem a estrutura NOVA e `ptAnterior` continua com a antiga, então
  // polls[7] de um vira polls[7] do outro e a memória associa a tradução de uma
  // pesquisa ao texto de outra, silenciosamente. Para corrigir prosa depois de
  // já ter construído, edite o arquivo do idioma direto ou restaure `saida` do
  // commit anterior ANTES de reconstruir. Nunca reconstrua por cima do próprio
  // resultado.
  const memoria = new Map<string, string>()
  const ptAnterior = `scripts/tmp-head/${arquivo}.json`
  if (existsSync(ptAnterior) && existsSync(saida)) {
    const velho = JSON.parse(readFileSync(ptAnterior, 'utf-8'))
    const trad = JSON.parse(readFileSync(saida, 'utf-8'))
    for (const c of caminhosDeString(velho, '', FORA_DE_TRADUCAO)) {
      const o = valorEm(velho, c)
      const t = valorEm(trad, c)
      if (typeof o === 'string' && typeof t === 'string') memoria.set(o, t)
    }
  }

  const destino = JSON.parse(JSON.stringify(pt))
  const semTraducao: string[] = []
  let doMapa = 0
  let daMemoria = 0

  for (const c of caminhosDeString(pt, '', FORA_DE_TRADUCAO)) {
    const texto = valorEm(pt, c)
    if (typeof texto !== 'string') continue
    if (mapa[c] != null) { gravarEm(destino, c, mapa[c]); doMapa++; continue }
    const lembrada = memoria.get(texto)
    if (lembrada != null) { gravarEm(destino, c, lembrada); daMemoria++; continue }
    semTraducao.push(c)
  }

  if (semTraducao.length > 0) {
    console.error(`\n❌ ${arquivo}.${locale}: ${semTraducao.length} campo(s) SEM tradução.`)
    console.error('   Traduzir parcialmente o inglês não é opção: campo em português carrega')
    console.error('   vírgula decimal, que lida em convenção inglesa vira outro número.')
    for (const c of semTraducao.slice(0, 25)) {
      console.error(`   ${c}  ::  ${String(valorEm(pt, c)).slice(0, 90)}`)
    }
    if (semTraducao.length > 25) console.error(`   ... e mais ${semTraducao.length - 25}`)
    process.exit(1)
  }

  const div = compararNumeros(pt, destino, locale)
  if (div.length > 0) {
    console.error(`\n❌ ${arquivo}.${locale}: gate numérico reprovou em ${div.length} campo(s). NÃO escrito.`)
    for (const d of div.slice(0, 8)) {
      console.error(`   ${d.caminho}`)
      console.error(`     pt : [${d.original.join(', ')}]  ${d.trechoOriginal}`)
      console.error(`     ${locale} : [${d.traduzido.join(', ')}]  ${d.trechoTraduzido}`)
    }
    process.exit(1)
  }

  writeFileSync(saida, JSON.stringify(destino, null, 2) + '\n', 'utf-8')
  console.log(`✅ ${saida}  (${doMapa} do mapa, ${daMemoria} da memória, gate 0 divergência)`)
}
