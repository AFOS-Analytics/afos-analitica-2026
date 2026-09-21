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
 * Uso:
 *   node scripts/percentage-do-grafo-brz.mjs            # mede e NÃO escreve
 *   node scripts/percentage-do-grafo-brz.mjs --aplicar  # escreve
 *   node scripts/percentage-do-grafo-brz.mjs --casa=BTG/Nexus --aplicar
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P = 'public/polls-data.json'
const argv = process.argv.slice(2)
const aplicar = argv.includes('--aplicar')
const casaForcada = (argv.find((a) => a.startsWith('--casa=')) ?? '').slice(7) || null

const dados = JSON.parse(readFileSync(P, 'utf8'))
const nacionais = (dados.polls ?? [])
  .filter((p) => p.scope === 'national' && p.scenarios?.[0]?.results?.length)
  .sort((a, b) => b.date.localeCompare(a.date) || (b.sample ?? 0) - (a.sample ?? 0))

if (!nacionais.length) {
  console.error('❌ nenhuma nacional com cenário de 1º turno: nada a medir.')
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
console.log(`   régua: 1ª turno da nacional MAIS RECENTE, desempate pela MAIOR AMOSTRA`)
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
for (const r of escolhida.scenarios[0].results) medido[semPartido(r.candidate)] = r.percent

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
      console.log(`   ${c.name.padEnd(20)} ${String(c.percentage).padStart(6)}    (fora do cenário publicado)`)
    }
    continue
  }
  const d = +(novo - (c.percentage ?? 0)).toFixed(1)
  if (d !== 0) mudam++
  console.log(
    `   ${c.name.padEnd(20)} ${String(c.percentage ?? '-').padStart(6)}  ${String(novo).padStart(6)}  ${(d > 0 ? '+' : '') + d}`,
  )
}

console.log('')
if (semMedida) {
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
}
dados.polymarketComparison.pollSource = {
  pollster: escolhida.institute,
  date: escolhida.date,
  sample: escolhida.sample,
  register: escolhida.register ?? null,
  scenario: escolhida.scenarios[0].name,
}

writeFileSync(P, JSON.stringify(dados, null, 2) + '\n', 'utf8')
console.log(`   ✅ ${mudam} campo(s) escritos, e a procedência foi gravada em`)
console.log(`      polymarketComparison.pollSource (${escolhida.institute}, ${escolhida.date}).`)
console.log('')
console.log('   📌 Falta o CONSUMIDOR: o DashboardClient do Brasil ainda passa')
console.log('      latest_poll vazio para o grafo. Ligar pollSource lá é o que faz')
console.log('      a tela dizer de qual pesquisa o número saiu.')
console.log('')
