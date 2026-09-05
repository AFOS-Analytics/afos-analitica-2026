/**
 * efeito-do-recorte-us.mjs · quanto da média servida é ESCOLHA DE RECORTE.
 *
 * 🔑 POR QUE EXISTE, e é uma pergunta que a casa já fazia sem ter medidor:
 * quando o mesmo instituto publica LV, RV e A da MESMA rodada, entra um só,
 * pela hierarquia `LV > RV > A` de `lib/us-polls/collect.mjs`. A regra é certa
 * e não se discute aqui. O que este script mede é o PREÇO dela: se o recorte
 * alternativo mudasse a média servida, quanto mudaria.
 *
 * É o mesmo tipo de exposição declarada que o coletor já imprime para casa
 * calada, e não existia para recorte. Descoberto em 05/Set/2026, quando a
 * Harvard/Harris entrou na janela com LV em R+2 tendo RV em D+2 na mesma onda,
 * e sozinha levou a média de D+5.69 para D+5.14.
 *
 * ⛔ NÃO redeclara a hierarquia: importa `ORDEM_RECORTE` do coletor. Duas
 * cópias da mesma régua convivem sem incidente até o dia em que uma é
 * corrigida e a outra não, que foi o defeito dos rótulos de faixa em 29/Jul.
 *
 * ⛔ Também NÃO reimplementa a janela de 30 dias: lê `mediaAfos.incluidas`,
 * que é o que a média de fato usou. Quem decide quem entra continua sendo o
 * coletor, em um lugar só.
 *
 * ⚠️ Saída de USO INTERNO. Isto descreve a sensibilidade do MÉTODO, e método
 * se descreve. Não vira manchete e não vira ressalva plantada em texto de
 * leitor.
 *
 * Uso:
 *   node scripts/efeito-do-recorte-us.mjs
 *   node scripts/efeito-do-recorte-us.mjs --arquivo=public/us-polls-data.json
 */
import { readFileSync } from 'fs'
import { ORDEM_RECORTE } from '../lib/us-polls/collect.mjs'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const ARQUIVO = arg('arquivo') || 'public/us-polls-data.json'

const dados = JSON.parse(readFileSync(ARQUIVO, 'utf-8'))
const polls = dados.polls || []
const media = dados.mediaAfos

const chave = (p) => `${p.instituto}|${p.campoInicio}|${p.campoFim}`
const peso = (p) => (ORDEM_RECORTE[p.amostraTipo] ?? 0) * 1e9 + (p.amostra ?? 0)
const vant = (p) => (typeof p.vantagemDem === 'number' ? p.vantagemDem : p.dem - p.rep)

const ondas = new Map()
for (const p of polls) {
  const k = chave(p)
  if (!ondas.has(k)) ondas.set(k, [])
  ondas.get(k).push(p)
}

console.log('\n🇺🇸 EFEITO DO RECORTE — quanto a hierarquia LV > RV > A move o número')
console.log(`   arquivo ${ARQUIVO}  [USO INTERNO, nao publicar]\n`)

// ── 1 · o arquivo inteiro, que é o piso empírico ──────────────────────────
const multi = [...ondas.values()].filter((v) => v.length > 1)
const deltas = []
const trocas = []
for (const grupo of multi) {
  const escolhido = [...grupo].sort((a, b) => peso(b) - peso(a))[0]
  for (const alt of grupo) {
    if (alt === escolhido) continue
    const d = vant(escolhido) - vant(alt)
    deltas.push(Math.abs(d))
    if (vant(escolhido) !== 0 && vant(alt) !== 0 && Math.sign(vant(escolhido)) !== Math.sign(vant(alt))) {
      trocas.push({ escolhido, alt })
    }
  }
}
deltas.sort((a, b) => a - b)
const mediana = deltas.length ? deltas[Math.floor(deltas.length / 2)] : 0
const medio = deltas.length ? deltas.reduce((s, d) => s + d, 0) / deltas.length : 0

console.log(`   📚 ARQUIVO INTEIRO`)
console.log(`      ${ondas.size} rodadas, ${multi.length} com mais de um recorte (${((multi.length / ondas.size) * 100).toFixed(0)}%)`)
console.log(`      ${deltas.length} comparações escolhido vs alternativa`)
console.log(`      |delta| mediana ${mediana.toFixed(2)}pp · média ${medio.toFixed(2)}pp · máximo ${(deltas[deltas.length - 1] ?? 0).toFixed(2)}pp · zero em ${deltas.filter((d) => d === 0).length}`)

if (trocas.length === 0) {
  console.log(`      ✅ nenhuma troca de SINAL: a escolha nunca inverteu quem lidera`)
} else {
  console.log(`      🔴 ${trocas.length} troca(s) de SINAL, que é o caso que muda a leitura e não só o valor:`)
  for (const t of trocas) {
    console.log(`         ${t.escolhido.instituto} ${t.escolhido.campoFim}: ${t.escolhido.amostraTipo} ${vant(t.escolhido) >= 0 ? 'D+' : 'R+'}${Math.abs(vant(t.escolhido))} contra ${t.alt.amostraTipo} ${vant(t.alt) >= 0 ? 'D+' : 'R+'}${Math.abs(vant(t.alt))}`)
  }
}

// ── 2 · a média SERVIDA, que é o que sai na tela ──────────────────────────
if (!media?.incluidas?.length) {
  console.log(`\n   ⚠️ mediaAfos.incluidas ausente: sem ela não dá para medir a média servida.`)
  console.log(`      Arquivo anterior a 04/Set/2026. Regerar com scripts/parse-us-generic-ballot.mjs.\n`)
  process.exit(0)
}

const dentro = media.incluidas.map((i) => {
  const grupo = polls.filter((p) => p.instituto === i.instituto && p.campoFim === i.campoFim)
  const escolhido = grupo.find((p) => p.amostraTipo === i.amostraTipo && p.dem === i.dem && p.rep === i.rep) || grupo[0]
  const alternativas = grupo.filter((p) => p !== escolhido)
  return { i, escolhido, alternativas }
})

const soma = dentro.reduce((s, d) => s + (d.i.dem - d.i.rep), 0)
const n = dentro.length
console.log(`\n   📊 MÉDIA SERVIDA: D+${(soma / n).toFixed(2)} sobre ${n} rodadas`)

const comAlternativa = dentro.filter((d) => d.alternativas.length > 0)
if (comAlternativa.length === 0) {
  console.log(`      nenhuma rodada da janela tem recorte alternativo: exposição ZERO hoje`)
} else {
  console.log(`      ${comAlternativa.length} de ${n} rodadas da janela têm recorte alternativo`)
  let pior = { desloc: 0 }
  for (const d of comAlternativa) {
    for (const alt of d.alternativas) {
      const nova = (soma - (d.i.dem - d.i.rep) + vant(alt)) / n
      const desloc = nova - soma / n
      const linha = `         ${d.i.instituto} ${d.i.campoFim}: trocar ${d.escolhido.amostraTipo} por ${alt.amostraTipo} levaria a média a D+${nova.toFixed(2)} (${desloc >= 0 ? '+' : ''}${desloc.toFixed(2)}pp)`
      console.log(linha)
      if (Math.abs(desloc) > Math.abs(pior.desloc)) pior = { desloc, linha }
    }
  }
  console.log(`\n      🔑 maior deslocamento possível por UMA troca de recorte: ${pior.desloc >= 0 ? '+' : ''}${pior.desloc.toFixed(2)}pp`)
}
console.log()
