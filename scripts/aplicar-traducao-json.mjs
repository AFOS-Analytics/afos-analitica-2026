#!/usr/bin/env node
/**
 * APLICA TRADUÇÃO EM JSON EDITORIAL, campo a campo, sem redigitar o arquivo.
 *
 * 🔴 POR QUE EXISTE, medido em 10/Set/2026. A ETAPA 3.5 do `/atualizar-brz` manda
 * traduzir três JSONs para dois idiomas na própria sessão, e o método prescrito
 * desde 25/Jul é "fornecer o mapa caminho -> tradução e deixar o código copiar
 * byte a byte o que não se traduz". O código que faz isso nunca existiu: cada
 * rodada remontava a coisa à mão. Em 09/Set a etapa simplesmente NÃO RODOU, e os
 * arquivos `.en.json` e `.es.json` foram para produção com dois dias de idade.
 *
 * 🔑 A IDEIA QUE BARATEIA A ETAPA: traduzir só o DELTA. O que não mudou no
 * pt-BR desde a última publicação já está traduzido no arquivo do idioma, e
 * reaproveitar isso é seguro PORQUE a comparação é feita contra o pt-BR de
 * então, não contra o texto traduzido. Se o português daquele caminho é
 * byte a byte o mesmo, a tradução anterior descreve o mesmo fato.
 *
 * ⛔ E o inglês é TUDO OU NADA. Campo deixado em português carrega vírgula
 * decimal, que lida na convenção inglesa vira outro número: `45,9%` lê-se 459.
 * Por isso, se sobrar qualquer campo sem tradução, este script NÃO ESCREVE o
 * arquivo e lista os caminhos que faltam.
 *
 * 🔢 GATE NUMÉRICO por campo: o multiconjunto de números com unidade tem de ser
 * idêntico entre o pt-BR e a tradução. Divergiu, o arquivo não é escrito.
 * A unidade é SÍMBOLO (%, pp, M, USD, R$), nunca palavra: "10 pontos" vira "10
 * points" e reprovaria uma tradução correta.
 *
 * Uso:
 *   node scripts/aplicar-traducao-json.mjs --arquivo=public/analysis-data.json \
 *        --locale=en --mapa=caminho/para/mapa.json
 *   ... --so-relatar     lista o que falta traduzir e não escreve nada
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const argv = process.argv.slice(2)
const opt = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const ARQUIVO = opt('arquivo')
const LOCALE = opt('locale')
const MAPA = opt('mapa')
const BASE = opt('base') ?? 'HEAD'
const SO_RELATAR = argv.includes('--so-relatar')

if (!ARQUIVO || !LOCALE) {
  console.error('Uso: --arquivo=public/x.json --locale=en [--mapa=mapa.json] [--so-relatar]')
  process.exit(1)
}

const destino = ARQUIVO.replace(/\.json$/, `.${LOCALE}.json`)

/**
 * O que precisa passar pela tradução.
 *
 * 🔴 A primeira versão exigia quatro letras seguidas, e com isso deixou campos
 * como `43,50%` e `36% a 39%` serem COPIADOS do pt-BR para dentro do inglês.
 * Medido em 10/Set/2026 contra o arquivo da véspera, que trazia `54.50%` e
 * `36% to 39%`: o critério tinha regredido a convenção decimal em 12 campos.
 *
 * ⚠️ É o defeito que a régua da casa descreve: `45,9%` lido na convenção
 * inglesa vira 459. Então entra na conta toda string com QUALQUER letra, e
 * também a que só tem número mas carrega vírgula decimal.
 */
const ehTraduzivel = (s) =>
  typeof s === 'string' && s.length > 1 && (/[a-zà-ÿ]/i.test(s) || /\d,\d/.test(s))

/** Percorre o objeto e devolve [caminho, valor] de cada string traduzível. */
function caminhos(o, pre = '', out = []) {
  if (ehTraduzivel(o)) out.push([pre, o])
  else if (Array.isArray(o)) o.forEach((v, i) => caminhos(v, `${pre}[${i}]`, out))
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) caminhos(v, pre ? `${pre}.${k}` : k, out)
  return out
}

function ler(obj, caminho) {
  return caminho.split(/\.|\[/).reduce((o, p) => {
    if (o == null) return undefined
    const k = p.endsWith(']') ? Number(p.slice(0, -1)) : p
    return o[k]
  }, obj)
}

/**
 * 🔴 O CAMINHO NÃO É IDENTIDADE EM ARRAY QUE CRESCE PELO TOPO.
 *
 * Medido na primeira execução, em 10/Set/2026: `polls-data` acusou 401 campos
 * pendentes num dia em que só 4 pesquisas eram novas. A causa é que pesquisa
 * entra no começo do array, então `polls[5].note` de hoje é o `polls[1].note` de
 * ontem, e a comparação por caminho declara tudo mudado.
 *
 * ⛔ E a saída fácil, casar pelo TEXTO solto, é o defeito já fichado da memória
 * de tradução: fora do par, a frase de um campo vira a de outro em silêncio.
 * → memory/feedback_o_par_da_memoria_de_traducao_e_o_conselho_errado_do_script
 *
 * ✅ O par certo é CHAVE NATURAL DO ITEM mais nome do campo. Para pesquisa a
 * chave é o registro no TSE, que é único e não se repete entre casas.
 */
const CHAVES_NATURAIS = ['register', 'id', 'slug', 'matchup', 'name', 'n', 'candidate', 'institute']

/** Reescreve `arr[3].note` como `arr{BR-04914/2026}.note`, quando dá. */
function caminhoEstavel(obj, caminho) {
  return caminho.replace(/^(.*?)\[(\d+)\]/, (todo, ate, idx) => {
    const arr = ler(obj, ate)
    const item = Array.isArray(arr) ? arr[Number(idx)] : null
    if (!item || typeof item !== 'object') return todo
    for (const k of CHAVES_NATURAIS) {
      if (typeof item[k] === 'string' && item[k].length) return `${ate}{${k}=${item[k]}}`
    }
    return todo
  })
}

function gravar(obj, caminho, valor) {
  const partes = caminho.split(/\.|\[/).map((p) => (p.endsWith(']') ? Number(p.slice(0, -1)) : p))
  const fim = partes.pop()
  const alvo = partes.reduce((o, p) => o[p], obj)
  alvo[fim] = valor
}

/**
 * 🔢 Números com unidade SÍMBOLO. Sem `\b` no fim, porque ele não casa depois de
 * `%`: foi assim que um gate desta casa conferiu só `pp` e passou verde em 03/Set.
 */
/**
 * 🔴 MAGNITUDE ESCRITA POR EXTENSO É TRADUZÍVEL, e o gate tem de saber disso.
 *
 * Medido na primeira execução, em 10/Set/2026: `USD 88 mil` virou `USD 88
 * thousand` e o gate reprovou uma tradução CORRETA. Baixar a régua e ignorar a
 * palavra deixaria passar `88 million`, que é o defeito que o gate existe para
 * pegar. Então a palavra é NORMALIZADA para a magnitude que ela nomeia.
 */
const MAGNITUDE = {
  mil: 'k', thousand: 'k',
  m: 'M', mi: 'M', milhao: 'M', milhoes: 'M', million: 'M', millon: 'M', millones: 'M',
  bi: 'G', bilhao: 'G', bilhoes: 'G', billion: 'G', billones: 'G',
}
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function numeros(txt) {
  const out = []
  const limpo = txt.replace(/\*\*/g, '')
  for (const m of limpo.matchAll(/(?:USD|R\$)?\s?(\d[\d.,]*)\s*(%|pp|[A-Za-zÀ-ÿ]{1,9})?/g)) {
    const bruto = m[2] ? semAcento(m[2]) : ''
    const unidade = bruto === '%' || bruto === 'pp' ? bruto : (MAGNITUDE[bruto] ?? null)
    const temMoeda = /USD|R\$/i.test(m[0])
    if (unidade == null && !temMoeda) continue
    out.push(`${m[1].replace(/[.,]/g, '')}${unidade ?? ''}`)
  }
  return out.sort()
}

const origem = JSON.parse(readFileSync(ARQUIVO, 'utf8'))
const mapa = MAPA && existsSync(MAPA) ? JSON.parse(readFileSync(MAPA, 'utf8')) : {}

/** O pt-BR de ANTES, para saber o que mudou. Sem ele, nada se reaproveita. */
let baseOrigem = null
try {
  baseOrigem = JSON.parse(execSync(`git show ${BASE}:${ARQUIVO}`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }))
} catch {
  console.log(`⚠️ sem versão anterior de ${ARQUIVO} em ${BASE}: nada será reaproveitado.`)
}
const anterior = existsSync(destino) ? JSON.parse(readFileSync(destino, 'utf8')) : null

/** Índice `caminho estável -> texto` de um documento, calculado uma vez por objeto. */
const cacheIndice = new WeakMap()
function indice(obj) {
  if (!obj) return new Map()
  if (cacheIndice.has(obj)) return cacheIndice.get(obj)
  const m = new Map()
  for (const [c, v] of caminhos(obj)) m.set(caminhoEstavel(obj, c), v)
  cacheIndice.set(obj, m)
  return m
}

const todos = caminhos(origem)
const saida = JSON.parse(JSON.stringify(origem))
let doMapa = 0
let reaproveitados = 0
const pendentes = []
/** Reaproveitáveis pelo texto, mas com número velho: a tradução ficou uma rodada atrás. */
const desatualizados = []
const numeroDivergente = []

for (const [caminho, texto] of todos) {
  if (mapa[caminho] != null) {
    gravar(saida, caminho, mapa[caminho])
    doMapa++
    const a = numeros(texto).join('|')
    const b = numeros(String(mapa[caminho])).join('|')
    if (a !== b) numeroDivergente.push({ caminho, ptBR: a, traduzido: b })
    continue
  }
  // Reaproveita SÓ se o português daquele MESMO item não mudou desde a base.
  // O par é chave natural do item + campo, nunca o texto solto.
  const estavel = caminhoEstavel(origem, caminho)
  /**
   * 🔴 SEM FALLBACK POR ÍNDICE QUANDO EXISTE CHAVE NATURAL, e este foi o defeito
   * mais perigoso do script, medido em 10/Set/2026.
   *
   * Com o fallback, um caminho como `polls{register=BR-07935/2026}.institute`
   * que não achasse casa no arquivo anterior caía para `polls[1].institute` e
   * reaproveitava o valor da pesquisa que ocupava aquela posição ontem. O
   * resultado, no arquivo em inglês: `institute: "Quaest/Genial"` na linha cujo
   * português diz Ideia/Canal Meio, com a nota inteira de outra casa.
   *
   * ⚠️ E o GATE NUMÉRICO NÃO PEGA ISSO, porque nome de instituto, data e método
   * não têm número com unidade. É o defeito de etiqueta passando por todo portão
   * de valor. → memory/feedback_defeito_de_etiqueta_passa_por_todo_portao_de_valor
   *
   * Então: item com chave natural só reaproveita da MESMA chave. Não achou, é
   * pendente, e pendente não deixa o arquivo ser escrito.
   */
  const temChave = estavel !== caminho
  const buscar = (doc) => {
    if (!doc) return undefined
    const porChave = indice(doc).get(estavel)
    if (porChave !== undefined) return porChave
    return temChave ? undefined : ler(doc, caminho)
  }
  const antesPt = buscar(baseOrigem)
  const antesTraduzido = buscar(anterior)
  /**
   * 🔴 REAPROVEITAR EXIGE O GATE TAMBÉM, e a premissa que faltava é esta: o
   * arquivo traduzido pode NÃO corresponder ao pt-BR anterior.
   *
   * Medido em 10/Set/2026: a etapa de tradução não rodou em 09/Set, então o
   * `.en.json` estava uma rodada atrás. Comparar o português contra o commit
   * anterior dizia "não mudou" e o reaproveitamento trazia números da véspera
   * da véspera, com o texto lendo perfeitamente bem. Quem pegou foi o gate
   * numérico da casa, depois que este script já tinha dito ✅.
   *
   * Por isso o campo reaproveitado passa pelo MESMO gate do campo traduzido: se
   * os números não batem com o pt-BR de agora, ele não é reaproveitável.
   */
  if (antesPt === texto && ehTraduzivel(antesTraduzido)) {
    if (numeros(texto).join('|') === numeros(String(antesTraduzido)).join('|')) {
      gravar(saida, caminho, antesTraduzido)
      reaproveitados++
      continue
    }
    desatualizados.push(caminho)
  }
  pendentes.push(caminho)
}

console.log('')
console.log(`🌍 ${destino}`)
console.log(`   ${todos.length} campo(s) de texto · ${doMapa} do mapa · ${reaproveitados} reaproveitado(s) · ${pendentes.length} PENDENTE(S)`)
if (desatualizados.length) console.log(`   ⚠️ ${desatualizados.length} campo(s) tinham tradução mas com NÚMERO VELHO: a tradução ficou uma rodada atrás e eles entram como pendentes.`)

if (numeroDivergente.length) {
  console.log(`\n🔴 GATE NUMÉRICO reprovou em ${numeroDivergente.length} campo(s):`)
  for (const d of numeroDivergente.slice(0, 8)) console.log(`   ${d.caminho}\n      pt-BR: ${d.ptBR}\n      ${LOCALE}: ${d.traduzido}`)
}

if (pendentes.length) {
  console.log(`\n⛔ FALTAM TRADUZIR ${pendentes.length} campo(s). O arquivo NÃO foi escrito.`)
  console.log(`   Campo em português dentro do ${LOCALE} carrega vírgula decimal e vira outro número.`)
  for (const p of pendentes.slice(0, 40)) console.log(`   ${p}`)
  if (pendentes.length > 40) console.log(`   ... e mais ${pendentes.length - 40}`)
  process.exit(2)
}

if (numeroDivergente.length) {
  console.log(`\n⛔ O arquivo NÃO foi escrito: número traduzido errado é pior que idioma errado.`)
  process.exit(3)
}

if (SO_RELATAR) {
  console.log(`\n✅ nada pendente: com --so-relatar o arquivo não é escrito.`)
  process.exit(0)
}

writeFileSync(destino, JSON.stringify(saida, null, 2) + '\n')
console.log(`\n✅ escrito. Gate numérico bateu em ${doMapa} campo(s) do mapa.`)
