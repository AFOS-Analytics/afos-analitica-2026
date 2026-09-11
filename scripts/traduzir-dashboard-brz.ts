/**
 * traduzir-dashboard-brz.ts — gera os `.en.json` e `.es.json` do painel do
 * Brasil a partir do pt-BR do dia, HERDANDO a tradução de tudo que não mudou.
 *
 * 🔴 POR QUE ISTO EXISTE. A ETAPA 3.5 do `/atualizar-brz` manda traduzir NA
 * SESSÃO e avisa, com razão, que redigitar o arquivo inteiro para traduzir
 * alguns campos "cria risco sem necessidade". Mesmo assim, sem ferramenta, a
 * sessão acabava olhando os três arquivos inteiros toda rodada. Medido em
 * 11/Set/2026: dos 117 textos da `analysis-criteriosa`, 70 tinham mudado e 47
 * eram idênticos aos de ontem, ou seja 40% do trabalho era retradução do que
 * já estava traduzido e revisado.
 *
 * 🔑 A CHAVE É O DIFF CONTRA O `HEAD`, não contra a memória da sessão. Se o
 * texto pt-BR é BYTE A BYTE um texto de `HEAD`, a tradução dele continua
 * válida por construção. Só o que mudou precisa de tradução nova, e o script
 * COBRA cada um deles pelo nome.
 *
 * 🔴 E A HERANÇA É PELO TEXTO, NUNCA PELO CAMINHO. A primeira versão casava
 * `polls[8].note` do dia com `polls[8].note` de `HEAD`, e isso quebrou na
 * primeira rodada: a de 11/Set removeu três pesquisas vencidas e inseriu uma
 * no topo, então `polls[8]` passou a ser OUTRA pesquisa. O resultado foi 358
 * pendências onde havia pouco mais de oitenta mudanças reais, e o modo
 * perigoso do mesmo defeito seria herdar a tradução da pesquisa errada.
 * Índice de array não é identidade.
 * → memory/feedback_fallback_por_indice_desfaz_a_protecao_da_chave_natural.md
 *
 * ⚠️ Texto pt-BR que aparece em `HEAD` com DUAS traduções diferentes não é
 * herdado: vira pendência, porque o script não tem como escolher.
 *
 * ⛔ Ele NÃO traduz. Ele herda, cobra, confere e escreve. A tradução continua
 * sendo feita na sessão, que é como a tradução do AFOS sempre foi feita.
 * ⛔ E NÃO é o `translate-dashboard-json.ts`, que chama conta de API avulsa e
 * nunca foi o caminho da casa.
 *
 * 🔢 O GATE NUMÉRICO é o mesmo `compararNumeros` do resto do projeto, não uma
 * segunda cópia da regra. Idioma que diverge num número NÃO É ESCRITO, e o
 * `readLocalized` serve o pt-BR daquele arquivo. Melhor português do que
 * número traduzido errado. Descarte sai com código 0, porque o fallback é
 * decisão de projeto e não falha de rodada.
 *
 * Uso:
 *   npx tsx scripts/traduzir-dashboard-brz.ts --mapa=arquivo.json
 *   npx tsx scripts/traduzir-dashboard-brz.ts --pendentes    # só lista o que falta
 *
 * Formato do mapa:
 *   { "analysis-data": { "cards.sentimento.text1": { "en": "...", "es": "..." } } }
 */

import { execFileSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { compararNumeros } from './lib/json-number-gate'

const ARQUIVOS = ['analysis-data', 'analysis-criteriosa', 'polls-data'] as const
const IDIOMAS = ['en', 'es'] as const
type Idioma = (typeof IDIOMAS)[number]

/**
 * Caminhos que NUNCA se traduzem, porque são dado e não prosa. Traduzir um
 * carimbo de data ou um nome de instituto produz divergência onde não havia
 * defeito, e o `source` carrega número em convenção pt que o gate leria errado.
 */
const NAO_TRADUZ = [
  /(^|\.)updatedAt$/,
  /(^|\.)lastUpdate$/,
  /(^|\.)date$/,
  /(^|\.)fieldDates$/,
  /(^|\.)register$/,
  /(^|\.)institute$/,
  /(^|\.)name$/,
  /(^|\.)party$/,
  /(^|\.)color$/,
  /(^|\.)pc$/,
  /(^|\.)mc$/,
  /(^|\.)matchup$/,
  /(^|\.)candidate\d?$/,
  /(^|\.)n$/,
]
const naoTraduz = (c: string) => NAO_TRADUZ.some((re) => re.test(c))

function doHead(caminho: string): unknown | null {
  try {
    return JSON.parse(execFileSync('git', ['show', `HEAD:${caminho}`], { encoding: 'utf8', maxBuffer: 1e8 }))
  } catch {
    return null
  }
}

/** Todas as strings, indexadas por caminho. Mesma travessia usada nos dois lados. */
function textos(o: unknown, p = '', acc: Record<string, string> = {}): Record<string, string> {
  if (typeof o === 'string') { acc[p] = o; return acc }
  if (Array.isArray(o)) { o.forEach((v, i) => textos(v, `${p}[${i}]`, acc)); return acc }
  if (o && typeof o === 'object') { for (const k of Object.keys(o)) textos((o as any)[k], p ? `${p}.${k}` : k, acc); return acc }
  return acc
}

/** Escreve uma string no caminho dado, criando nada: o caminho tem de existir. */
function porCaminho(o: any, caminho: string, valor: string): boolean {
  const partes = caminho.match(/[^.[\]]+/g) ?? []
  let cur = o
  for (let i = 0; i < partes.length - 1; i++) {
    cur = cur?.[partes[i] as any]
    if (cur === undefined) return false
  }
  const ult = partes[partes.length - 1] as any
  if (cur === undefined || cur[ult] === undefined) return false
  cur[ult] = valor
  return true
}

const argv = process.argv.slice(2)
const soPendentes = argv.includes('--pendentes')
const caminhoMapa = argv.find((a) => a.startsWith('--mapa='))?.slice(7)
const mapa: Record<string, Record<string, Partial<Record<Idioma, string>>>> =
  caminhoMapa && existsSync(caminhoMapa) ? JSON.parse(readFileSync(caminhoMapa, 'utf8')) : {}

let pendentesTotal = 0
let escritos = 0
let descartados = 0

for (const base of ARQUIVOS) {
  const ptAtual = JSON.parse(readFileSync(`public/${base}.json`, 'utf8'))
  const ptHead = doHead(`public/${base}.json`)
  const tAtual = textos(ptAtual)
  const tHead = ptHead ? textos(ptHead) : {}

  console.log('')
  console.log('─'.repeat(72))
  console.log(`📄 ${base}.json — ${Object.keys(tAtual).length} textos`)

  for (const idioma of IDIOMAS) {
    const traduzidoHead = doHead(`public/${base}.${idioma}.json`)
    const tTradHead = traduzidoHead ? textos(traduzidoHead) : {}

    // Base do arquivo novo: uma cópia do pt-BR do dia, com a estrutura e os
    // números já certos. Só as strings de prosa são sobrescritas.
    const saida = JSON.parse(JSON.stringify(ptAtual))

    // 🔑 O dicionário da herança: texto pt-BR de HEAD -> tradução de HEAD, no
    // MESMO caminho. Construído por caminho e consultado por TEXTO, que é o
    // que sobrevive a array reordenado.
    const porTexto = new Map<string, string>()
    const ambiguos = new Set<string>()
    for (const [caminho, ptTexto] of Object.entries(tHead)) {
      if (naoTraduz(caminho)) continue
      const trad = tTradHead[caminho]
      if (trad === undefined) continue
      const jaTem = porTexto.get(ptTexto)
      if (jaTem !== undefined && jaTem !== trad) ambiguos.add(ptTexto)
      else porTexto.set(ptTexto, trad)
    }

    let herdados = 0
    let novos = 0
    const pendentes: string[] = []

    for (const [caminho, texto] of Object.entries(tAtual)) {
      if (naoTraduz(caminho)) continue

      const herdada = ambiguos.has(texto) ? undefined : porTexto.get(texto)
      const doMapa = mapa[base]?.[caminho]?.[idioma]

      if (herdada !== undefined) {
        porCaminho(saida, caminho, herdada)
        herdados++
      } else if (doMapa !== undefined) {
        porCaminho(saida, caminho, doMapa)
        novos++
      } else {
        pendentes.push(caminho)
      }
    }

    if (pendentes.length) {
      pendentesTotal += pendentes.length
      console.log(`   ${idioma}: ⏳ ${pendentes.length} PENDENTE(S), ${herdados} herdado(s), ${novos} do mapa. Arquivo NÃO escrito.`)
      for (const p of pendentes.slice(0, 60)) console.log(`      ${p}  [${tAtual[p].length}c]`)
      if (pendentes.length > 60) console.log(`      … e mais ${pendentes.length - 60}`)
      continue
    }

    if (soPendentes) {
      console.log(`   ${idioma}: ✅ nada pendente (${herdados} herdado, ${novos} do mapa). Nada escrito, é só a listagem.`)
      continue
    }

    // 🔢 Gate numérico, contra o pt-BR do DIA.
    const div = compararNumeros(ptAtual, saida, idioma)
    if (div.length) {
      descartados++
      console.log(`   ${idioma}: 🔴 DESCARTADO por ${div.length} divergência(s) numérica(s). O locale serve o pt-BR.`)
      for (const d of div.slice(0, 8)) {
        console.log(`      ${d.caminho}`)
        console.log(`         pt : [${d.original.join(', ')}]  "${d.trechoOriginal.slice(0, 90)}"`)
        console.log(`         ${idioma} : [${d.traduzido.join(', ')}]  "${d.trechoTraduzido.slice(0, 90)}"`)
      }
      continue
    }

    writeFileSync(`public/${base}.${idioma}.json`, JSON.stringify(saida, null, 2) + '\n')
    escritos++
    console.log(`   ${idioma}: ✅ escrito. ${herdados} herdado(s), ${novos} traduzido(s) nesta rodada, gate numérico zerado.`)
  }
}

console.log('')
console.log('─'.repeat(72))
if (pendentesTotal) {
  console.log(`⏳ ${pendentesTotal} campo(s) sem tradução. Preencher o mapa e rodar de novo.`)
  console.log('   Nenhum arquivo com pendência foi escrito, para não publicar meio traduzido.')
  console.log('   ⚠️ O inglês é TUDO OU NADA: campo em português carrega vírgula decimal,')
  console.log('      que lida em convenção inglesa vira outro número e reprova o arquivo.')
} else {
  console.log(`✅ ${escritos} arquivo(s) escrito(s), ${descartados} descartado(s) pelo gate.`)
  if (descartados) console.log('   Descarte NÃO bloqueia o deploy: o locale cai para o pt-BR, que é a decisão de projeto.')
}
// Pendência é trabalho a fazer e para a rodada; descarte é fallback previsto.
process.exit(pendentesTotal ? 1 : 0)
