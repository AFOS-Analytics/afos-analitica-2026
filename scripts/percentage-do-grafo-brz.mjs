#!/usr/bin/env node
/**
 * percentage-do-grafo-brz.mjs — mede e atualiza o `percentage` do
 * `polymarketComparison`, que é o lado PESQUISA do grafo de divergência do
 * painel do Brasil.
 *
 * 🔴 POR QUE ELE EXISTE. O `DashboardClient.tsx` do Brasil monta o grafo com
 *    `divergence_pp = odds − percentage`, e o `percentage` é posto À MÃO, sem
 *    régua escrita e sem medidor. Medido em 21/Set/2026: ele estava CONGELADO
 *    em Lula 44,1 e Flávio 41,7 desde 17/Set, cinco rodadas, atravessando dois
 *    dias com pesquisa nacional nova. O grafo publicava, ao vivo, a divergência
 *    contra uma pesquisa de quatro dias antes.
 *
 * ⛔ E o `latest_poll` que a tela renderiza ia VAZIO: `CountryPageContent.tsx`
 *    imprime `ds.source(latest_poll.pollster, latest_poll.date, ...)` e o Brasil
 *    passava duas strings vazias. O número aparecia sem dizer de qual pesquisa
 *    saiu, que é o que permite ele envelhecer sem ninguém ver.
 *
 * 📐 A RÉGUA, e ela foi DESCOBERTA reproduzindo a escolha já publicada, não
 *    inventada agora: `percentage` é o 1º turno da nacional MAIS RECENTE, com
 *    desempate pela MAIOR AMOSTRA. Em 17/Set cinco nacionais saíram no mesmo
 *    dia e o painel ficou com a AtlasIntel, n=5.018, que é a maior; não com a
 *    Datafolha, que tem confiabilidade mais alta. Antes disso os valores eram
 *    inteiros (39, 38, 36), que são pesquisas únicas, nunca médias.
 *
 * ⛔ NÃO se tira média. A régua da casa é não suavizar, e o lado americano só
 *    usa média porque ela é DECLARADA na tela como `mediaAfos`. Aqui a escolha
 *    é de UMA pesquisa, e por isso ela tem de sair com nome e data ao lado.
 *
 * ⚠️ QUANDO DUAS NACIONAIS DO MESMO DIA DISCORDAM, o desempate por amostra é
 *    uma escolha de verdade, e o script IMPRIME a alternativa para ela ser feita
 *    em voz alta. Em 21/Set a régua escolhe a Palver (n=5.000, online não
 *    probabilística) sobre a BTG/Nexus (n=2.006, telefone probabilística), e as
 *    duas medem Renan Santos com 8 pontos de diferença.
 *
 * 🗳️ 2º TURNO, a partir de 05/Out/2026 (o padrão agora é `--turno=2`). O 1º
 *    turno acabou em 04/Out com Flávio Bolsonaro e Lula, e o lado pesquisa do
 *    grafo passa a ser o PAR do 2º turno (`secondRound`, o confronto Lula ×
 *    Flávio), com a MESMA régua: a nacional mais recente que mediu o par,
 *    desempate pela maior amostra. Os eliminados PERDEM o campo (não viram 0):
 *    não foram medidos no 2º turno, e zero seria uma medição que não existe.
 *    O `pollSource.round` grava o turno, e o export do HF o lê para não misturar
 *    as duas séries sob o mesmo nome de arquivo.
 *
 * 🔴 E o `pollSource` ficou PARADO em "Palver, 24/09" de 24/Set a 05/Out
 *    enquanto o `percentage` foi trocado à mão em outras rodadas (Quaest em
 *    28/Set, Palver de 03/Out): a tela dizia de qual pesquisa o número saía, e
 *    dizia a errada. Quem troca o `percentage` sem este script troca o número e
 *    deixa a procedência velha. Este script grava os dois juntos, sempre.
 *
 * Uso:
 *   node scripts/percentage-do-grafo-brz.mjs            # mede e NÃO escreve (2º turno)
 *   node scripts/percentage-do-grafo-brz.mjs --aplicar  # escreve
 *   node scripts/percentage-do-grafo-brz.mjs --casa=Datafolha --aplicar
 *   node scripts/percentage-do-grafo-brz.mjs --turno=1  # a régua antiga, do 1º turno
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P = 'public/polls-data.json'
const argv = process.argv.slice(2)
const aplicar = argv.includes('--aplicar')
const casaForcada = (argv.find((a) => a.startsWith('--casa=')) ?? '').slice(7) || null
const turno = (argv.find((a) => a.startsWith('--turno=')) ?? '--turno=2').slice(8) === '1' ? 1 : 2

/** O confronto Lula × Flávio Bolsonaro do 2º turno, nos dois sentidos de ordem. */
export function parDoSegundoTurno(poll) {
  for (const sr of poll?.secondRound ?? []) {
    const lados = [[sr.candidate1, sr.percent1], [sr.candidate2, sr.percent2]]
    const lula = lados.find(([n]) => /^Lula\b/.test(String(n)))
    const flavio = lados.find(([n]) => /^Fl[áa]vio\b/.test(String(n)))
    if (lula && flavio && typeof lula[1] === 'number' && typeof flavio[1] === 'number') {
      return { Lula: lula[1], 'Flávio Bolsonaro': flavio[1], matchup: sr.matchup }
    }
  }
  return null
}

const dados = JSON.parse(readFileSync(P, 'utf8'))
const nacionais = (dados.polls ?? [])
  .filter((p) => p.scope === 'national' && (turno === 1 ? p.scenarios?.[0]?.results?.length : parDoSegundoTurno(p)))
  .sort((a, b) => b.date.localeCompare(a.date) || (b.sample ?? 0) - (a.sample ?? 0))

if (!nacionais.length) {
  console.error(`❌ nenhuma nacional com ${turno === 1 ? 'cenário de 1º turno' : 'o par Lula × Flávio do 2º turno'}: nada a medir.`)
  process.exit(1)
}

const maisRecente = nacionais[0].date
const doDia = nacionais.filter((p) => p.date === maisRecente)
const escolhida = casaForcada ? doDia.find((p) => p.institute === casaForcada) : doDia[0]

if (!escolhida) {
  console.error(`❌ --casa=${casaForcada} não está entre as nacionais de ${maisRecente}.`)
  console.error(`   opções: ${doDia.map((p) => p.institute).join(' · ')}`)
  process.exit(1)
}

const regua = '─'.repeat(74)
console.log('')
console.log('📊 `percentage` DO GRAFO DE DIVERGÊNCIA · lado PESQUISA')
console.log(regua)
console.log(
  turno === 1
    ? `   régua: 1º turno da nacional MAIS RECENTE, desempate pela MAIOR AMOSTRA`
    : `   régua: par Lula × Flávio do 2º TURNO da nacional MAIS RECENTE que o mediu, desempate pela MAIOR AMOSTRA`,
)
console.log(`   nacionais de ${maisRecente}: ${doDia.length}`)
for (const p of doDia) {
  const marca = p === escolhida ? '▶' : ' '
  console.log(`   ${marca} ${p.institute.padEnd(14)} n=${String(p.sample).padStart(5)}  ${p.method ?? ''}`)
}
if (doDia.length > 1) {
  console.log('')
  console.log('   ⚠️ MAIS DE UMA nacional no dia: o desempate por amostra é uma ESCOLHA.')
  console.log(`      Para trocar: --casa="${doDia.find((p) => p !== escolhida).institute}"`)
}

/** Nome do candidato sem o partido, para casar com o `polymarketComparison`. */
const semPartido = (s) => s.replace(/\s*\(.*/, '').trim()

const medido = {}
if (turno === 1) {
  for (const r of escolhida.scenarios[0].results) medido[semPartido(r.candidate)] = r.percent
} else {
  const par = parDoSegundoTurno(escolhida)
  medido.Lula = par.Lula
  medido['Flávio Bolsonaro'] = par['Flávio Bolsonaro']
}

console.log('')
console.log(`   fonte escolhida: ${escolhida.institute}, ${escolhida.date}, n=${escolhida.sample}`)
console.log('')
console.log('   candidato              antes    medido    Δ')
let mudam = 0
let semMedida = 0
for (const c of dados.polymarketComparison?.candidates ?? []) {
  const novo = medido[semPartido(c.name)]
  if (novo === undefined) {
    if (c.percentage) {
      semMedida++
      console.log(
        `   ${c.name.padEnd(20)} ${String(c.percentage).padStart(6)}    ${turno === 2 ? '(fora do 2º turno: SAI do grafo)' : '(fora do cenário publicado)'}`,
      )
    }
    continue
  }
  const d = +(novo - (c.percentage ?? 0)).toFixed(1)
  if (d !== 0) mudam++
  console.log(
    `   ${c.name.padEnd(20)} ${String(c.percentage ?? '-').padStart(6)}  ${String(novo).padStart(6)}  ${(d > 0 ? '+' : '') + d}`,
  )
}

/**
 * 📏 A FAIXA (`pesquisaRange`) do 2º turno MORA AQUI, desde 05/Out/2026.
 *
 * 🔴 Até o 1º turno ela era calculada dentro do aplicador de cada rodada, junto
 *    com o `percentage`, e foi esse atalho que deixou o `pollSource` parado: a
 *    regra existia em dois lugares e a cópia do aplicador não gravava a
 *    procedência. Agora número, faixa e procedência saem do mesmo script.
 *
 * Régua: mínimo e máximo do par Lula × Flávio nas nacionais com data a partir
 * do dia seguinte ao 1º turno. Enquanto não houver nenhuma, as nacionais do
 * ÚLTIMO dia que mediu o par (a véspera), e o script diz isso em voz alta.
 */
const DEPOIS_DO_1T = '2026-10-05'
const faixas = {}
let origemDaFaixa = null
if (turno === 2) {
  const pos = nacionais.filter((p) => p.date >= DEPOIS_DO_1T)
  const recorte = pos.length ? pos : nacionais.filter((p) => p.date === maisRecente)
  origemDaFaixa = pos.length
    ? `${pos.length} nacional(is) desde ${DEPOIS_DO_1T}`
    : `as ${recorte.length} nacionais de ${maisRecente}, a VÉSPERA: nenhuma desde ${DEPOIS_DO_1T}`
  const fmt = (x) => String(x).replace('.', ',') + '%'
  for (const nome of ['Lula', 'Flávio Bolsonaro']) {
    const vals = recorte.map((p) => parDoSegundoTurno(p)[nome])
    faixas[nome] = { min: Math.min(...vals), max: Math.max(...vals), texto: `${fmt(Math.min(...vals))} a ${fmt(Math.max(...vals))}` }
  }
  console.log('')
  console.log(`   📏 faixa do 2º turno (pesquisaRange), de ${origemDaFaixa}:`)
  for (const [nome, f] of Object.entries(faixas)) {
    const dentro = medido[nome] >= f.min && medido[nome] <= f.max
    console.log(`      ${nome.padEnd(18)} ${f.texto.padEnd(14)} ${dentro ? '' : '❌ o percentage escolhido está FORA da faixa'}`)
    if (!dentro) {
      console.error('❌ percentage fora da própria faixa: a escolha e o recorte não conversam. Nada escrito.')
      process.exit(1)
    }
  }
}

console.log('')
if (semMedida && turno === 2) {
  console.log(`   🗳️ ${semMedida} candidato(s) eliminado(s) no 1º turno perdem o percentage e saem do grafo.`)
  console.log('      O campo é REMOVIDO, não zerado: zero seria uma medição de 2º turno que não existe.')
} else if (semMedida) {
  console.log(`   ⚠️ ${semMedida} candidato(s) com percentage mas fora do cenário desta casa.`)
  console.log('      Eles NÃO são zerados: zerar tira a linha do grafo, e ausência de')
  console.log('      medição não é medição de zero. Ficam com o valor anterior e com a')
  console.log('      procedência antiga, que o latest_poll não cobre.')
}

if (!aplicar) {
  console.log(`   👀 ensaio: ${mudam} campo(s) mudariam. Rode com --aplicar para escrever.`)
  console.log('')
  process.exit(0)
}

for (const c of dados.polymarketComparison?.candidates ?? []) {
  const novo = medido[semPartido(c.name)]
  if (novo !== undefined) c.percentage = novo
  else if (turno === 2) delete c.percentage
  if (turno === 2 && faixas[semPartido(c.name)]) c.pesquisaRange = faixas[semPartido(c.name)].texto
}
dados.polymarketComparison.pollSource = {
  pollster: escolhida.institute,
  date: escolhida.date,
  sample: escolhida.sample,
  register: escolhida.register ?? null,
  scenario: turno === 1 ? escolhida.scenarios[0].name : `2º turno, ${parDoSegundoTurno(escolhida).matchup}`,
  round: turno,
}

writeFileSync(P, JSON.stringify(dados, null, 2) + '\n', 'utf8')
console.log(`   ✅ ${mudam} campo(s) escritos, e a procedência foi gravada em`)
console.log(`      polymarketComparison.pollSource (${escolhida.institute}, ${escolhida.date}).`)
console.log('')
// ⚠️ Esta linha dizia "falta o CONSUMIDOR" até 23/Set/2026, e o consumidor
//    tinha sido ligado em 21/Set, no mesmo dia em que este script nasceu.
//    Aviso que manda fazer o que já foi feito treina quem lê a ignorar o aviso.
console.log('   📌 O consumidor está ligado desde 21/Set: o DashboardClient do Brasil lê')
console.log('      `polymarketComparison.pollSource` e passa pollster e date para o grafo,')
console.log('      então a tela diz de qual pesquisa o número saiu.')
console.log('')
