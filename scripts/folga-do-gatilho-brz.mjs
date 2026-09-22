#!/usr/bin/env node
/**
 * FOLGA DO GATILHO: quantas linhas faltam para o corte da rota alcançar HOJE.
 *
 * ─── A PERGUNTA ─────────────────────────────────────────────────────────────
 *
 * `/api/polls/tse` para em 200 linhas, ordena por divulgação decrescente e diz
 * `total` igual ao que serviu, então **o corte não se declara**. Ele come as
 * divulgações mais antigas primeiro, e por isso o bloco `📣 DIVULGAM HOJE`,
 * que é o gatilho do `/atualizar-brz`, segue inteiro enquanto as linhas com
 * divulgação **de hoje em diante** couberem nas 200.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * 🔴 A régua da rodada manda *"remedir a cada rodada até o 1º turno, porque o
 *    estoque de divulgações futuras cresce perto da eleição"*. O relatório
 *    mede e IMPRIME, e nada grava. Em 22/Set/2026 a comparação com a medição
 *    anterior só existiu porque o número de 16/Set estava escrito numa ficha
 *    de memória, à mão. **Régua que depende de um número que ninguém grava é
 *    régua que não roda**, e é o mesmo defeito que fez o total do arquivo do
 *    TSE precisar ser refeito por identidade em 04/Set.
 *
 * ⛔ Ele NÃO conserta a rota. O conserto de verdade é lá (contagem real e
 *    limite maior) e é deploy de API pública, decisão do André. Isto aqui só
 *    responde **quando** o gatilho deixa de ser confiável, com série em vez de
 *    lembrança.
 *
 * ─── O QUE ELE SE RECUSA A FAZER ────────────────────────────────────────────
 *
 * ⛔ Não projeta sobre um ponto só, e não chama de série o que tem um dia.
 * ⛔ Rota que não responde sai **4 e sem veredito**, nunca "está folgado".
 * ⛔ Não mistura janelas: cada linha grava o `dias` com que foi medida, e a
 *    projeção só usa linhas da MESMA janela.
 *
 * Uso:
 *   node scripts/folga-do-gatilho-brz.mjs
 *   node scripts/folga-do-gatilho-brz.mjs --dias=30
 *   node scripts/folga-do-gatilho-brz.mjs --sem-registro    # mede e não grava
 */

import { appendFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { dataCivilBrasil, datasDeHoje } from './lib/data-civil-brz.mjs'
import { folgaDoGatilho } from './lib/tse-api-polls.mjs'
import { baseDeLeitura } from './lib/base-afos.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const HOJE = valor('data') ?? dataCivilBrasil()
const DIAS = Number(valor('dias') ?? 15)
const semRegistro = argv.includes('--sem-registro')
const LEDGER = 'data/tse/folga-gatilho.jsonl'

console.log(`\n📏 FOLGA DO GATILHO · hoje ${HOJE}, janela de ${DIAS} dias`)
const d = datasDeHoje()
if (d.diverge && !valor('data')) {
  console.log(`   ⚠️ a data UTC já virou para ${d.utc}, e "hoje" aqui é a data civil do BRASIL (${d.br}).`)
}

// ── 1. medir ────────────────────────────────────────────────────────────────
let linhas
try {
  const r = await fetch(`${baseDeLeitura()}/api/polls/tse?days=${DIAS}`, { signal: AbortSignal.timeout(45_000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const j = await r.json()
  linhas = j.findings ?? j.polls ?? j.items ?? []
} catch (e) {
  console.error(`\n❌ NAO LEU a rota de pesquisas: ${e.message}`)
  console.error(`   ⛔ Isto NAO e "o gatilho esta folgado": e o medidor declarando que nao mediu.`)
  process.exit(4)
}

const f = folgaDoGatilho(linhas, HOJE)
const noTeto = linhas.length >= f.teto
console.log(`   ${linhas.length} linha(s) servidas, teto ${f.teto}${noTeto ? ' · 🔴 NO TETO' : ' · abaixo do teto'}`)
console.log(`   ${f.aFrente}${f.exata ? '' : ' (PISO)'} linha(s) com divulgação de ${HOJE} em diante · folga ${f.folga}`)

// ── 2. registrar, porque medir e não gravar é o defeito que ele conserta ────
const linhaNova = {
  quando: new Date().toISOString(),
  dia: HOJE,
  dias: DIAS,
  servidas: linhas.length,
  teto: f.teto,
  aFrente: f.aFrente,
  folga: f.folga,
  exata: f.exata,
  fonte: 'medido',
}
if (!semRegistro) {
  mkdirSync(dirname(LEDGER), { recursive: true })
  appendFileSync(LEDGER, JSON.stringify(linhaNova) + '\n')
}

// ── 3. a série, e ela é POR DIA ─────────────────────────────────────────────
//
// 🔑 Rodar duas vezes no mesmo dia grava duas linhas, e isso é verdade e não
//    defeito. Por isso a taxa é calculada sobre o ÚLTIMO registro de cada DIA
//    distinto: duas medições da mesma tarde não são dois dias de estoque.
const historico = existsSync(LEDGER)
  ? readFileSync(LEDGER, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l)
        } catch {
          return null
        }
      })
      .filter((o) => o && o.dias === DIAS)
  : []
if (semRegistro) historico.push(linhaNova)

const porDia = new Map()
for (const o of historico) porDia.set(o.dia, o)
const serie = [...porDia.values()].sort((a, b) => a.dia.localeCompare(b.dia))

console.log('')
console.log(`   📓 ${serie.length} dia(s) na série${semRegistro ? ' (--sem-registro: o de hoje não foi gravado)' : ''}`)
for (const o of serie.slice(-6)) {
  const marca = o.fonte === 'medido' ? ' ' : '📎'
  console.log(`   ${marca} ${o.dia}  a frente ${String(o.aFrente).padStart(3)}  folga ${String(o.folga).padStart(3)}${o.fonte === 'medido' ? '' : `  (${o.fonte})`}`)
}

// ── 4. a projeção, e ela se RECUSA sobre um ponto só ────────────────────────
console.log('')
if (serie.length < 2) {
  console.log('   ⏳ INDETERMINADO: um dia não é série, e este medidor não projeta sobre um ponto.')
  console.log('      Isto NÃO é "está folgado". Rodar de novo amanhã.')
} else {
  const a = serie[0]
  const b = serie.at(-1)
  const vaoDias = Math.round((Date.parse(b.dia) - Date.parse(a.dia)) / 86_400_000)
  const cresceu = b.aFrente - a.aFrente
  if (vaoDias < 1) {
    console.log('   ⏳ INDETERMINADO: a série tem dias demais no mesmo dia, sem vão para taxa.')
  } else if (cresceu <= 0) {
    console.log(`   ✅ o estoque não cresceu no vão de ${vaoDias} dia(s) (${a.aFrente} → ${b.aFrente}): sem data projetada.`)
    console.log('      ⚠️ E isto vale para o vão medido, não para o mês: perto da eleição ele cresce.')
  } else {
    const taxa = cresceu / vaoDias
    const diasAteOTeto = b.folga / taxa
    const quando = new Date(Date.parse(b.dia) + Math.ceil(diasAteOTeto) * 86_400_000).toISOString().slice(0, 10)
    console.log(`   📈 ${cresceu} linha(s) em ${vaoDias} dia(s), ${taxa.toFixed(1)}/dia, sobre ${serie.length} ponto(s).`)
    console.log(`   🗓️  no ritmo medido, o corte alcança HOJE por volta de ${quando} (folga ${b.folga}).`)
    console.log('      ⛔ Projeção não é previsão: ela supõe ritmo constante, e o estoque de')
    console.log('         divulgações futuras acelera perto do 1º turno. Serve para decidir QUANDO')
    console.log('         mexer na rota, não para prometer o dia.')
  }
}

// ── 5. veredito ─────────────────────────────────────────────────────────────
// ⚠️ `process.exit()` aqui ABORTA o processo no Windows, medido em 22/Set/2026:
//    o socket do fetch ainda está no laço e o libuv cai com
//    `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`, depois de toda a
//    saída já impressa. Quem lê a última linha não vê diferença; quem lê o
//    código de saída, como o orquestrador, recebe um aborto no lugar do
//    veredito. `exitCode` deixa o laço drenar e sai com o número certo.
console.log('')
if (!noTeto) {
  console.log('✅ VEREDITO: FOLGADO · a resposta veio abaixo do teto, o corte não está ativo.')
  process.exitCode = 0
} else if (f.folga <= 0) {
  console.log('🔴 VEREDITO: ALCANÇADO · as linhas com divulgação de hoje em diante não cabem no teto.')
  console.log('   O bloco 📣 deixou de ser confiável: nacional de hoje pode estar ABAIXO do corte.')
  process.exitCode = 1
} else {
  console.log(`⚠️  VEREDITO: CORTANDO, gatilho INTEIRO · folga de ${f.folga} linha(s).`)
  console.log('   O corte come as divulgações mais antigas primeiro, então o que olha para a')
  console.log('   frente está inteiro e o que olha para trás é PISO.')
  process.exitCode = 0
}
