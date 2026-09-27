#!/usr/bin/env node
/**
 * VÃO DA SEMANA (Brasil): Flávio Bolsonaro menos Lula no contrato de vencedor,
 * PAREADO por instante, lido no BACKUP.
 *
 * 🔑 POR QUE ISTO EXISTE (27/Set/2026): o `semana-do-contrato` imprime cada lado
 *    sozinho, com piso e topo de CADA um. O topo do vão não é o topo de um lado
 *    menos o piso do outro, porque os dois extremos acontecem em instantes
 *    diferentes. Na №18 o piso intra-semana do vão (1.60pp às 12h30 UTC de
 *    segunda) e o ranking "sexto maior das 23 semanas" saíram de conta avulsa, e
 *    conta avulsa refeita toda semana é conta que um dia sai diferente.
 *
 * O que ele imprime:
 *   1. o vão em cada fechamento diário da janela (último instante PAREADO do dia);
 *   2. o piso e o topo INTRADIÁRIOS do vão, com o instante UTC;
 *   3. o Δ da semana (fechamento de `ate` menos o de `de`, a convenção das
 *      edições do Brasil) e o ranking dele entre TODAS as semanas seg-sex da
 *      série com quatro ou mais pregões pareados, por módulo e por sinal.
 *
 * ⛔ Instante pareado = os dois lados com carimbo idêntico. Instante com um lado
 *    só não entra: vão de lados de horas diferentes é número fabricado.
 * ⚠️ Lê o backup, que tem cauda cega de até 24h: a janela tem de terminar antes
 *    do `geradoEm` do MANIFEST, e ele avisa quando não termina.
 *
 * Uso:
 *   node scripts/vao-da-semana-brz.mjs --de=2026-09-21 --ate=2026-09-25
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'
import { instantesSuspeitos, serieDe } from './lib/serie-contrato.mjs'

const RAIZ = 'backup/neon'
const SLUG = 'brazil-presidential-election'
const A = 'Flávio Bolsonaro'
const B = 'Lula'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const de = arg('de')
const ate = arg('ate')
if (!de || !ate) {
  console.error('❌ faltam as bordas. Use --de=AAAA-MM-DD --ate=AAAA-MM-DD')
  process.exit(1)
}

function lerCsvGz(dir) {
  const caminho = join(RAIZ, dir)
  if (!existsSync(caminho)) return []
  const linhas = []
  for (const f of readdirSync(caminho).filter((x) => x.endsWith('.csv.gz'))) {
    const [cab, ...resto] = gunzipSync(readFileSync(join(caminho, f))).toString('utf8').split(/\r?\n/).filter(Boolean)
    const cols = cab.split(',')
    for (const l of resto) {
      const v = l.split(',')
      const o = {}
      cols.forEach((c, i) => (o[c] = v[i]))
      linhas.push(o)
    }
  }
  return linhas
}

const precos = lerCsvGz('marketPrice')
if (!precos.length) {
  console.error(`❌ nenhum ponto lido em ${RAIZ}/marketPrice`)
  process.exit(1)
}
const mercadoDe = new Map(lerCsvGz('market').map((m) => [m.id, m]))
const outcomeDe = new Map(lerCsvGz('marketOutcome').map((o) => [o.id, o]))
const suspeitos = instantesSuspeitos(precos)
const limpos = suspeitos.size === 0 ? precos : precos.filter((p) => !suspeitos.has(String(p.snapshotAt).slice(0, 19)))

const chave = (t) => String(t).slice(0, 19)
const lado = (nome) => new Map(serieDe(limpos, outcomeDe, mercadoDe, { slug: SLUG, outcome: nome }).map((p) => [chave(p.t), p.v]))
const sa = lado(A)
const sb = lado(B)
if (!sa.size || !sb.size) {
  console.error(`❌ série vazia: ${A} ${sa.size} pontos, ${B} ${sb.size} pontos. Nome do desfecho mudou?`)
  process.exit(1)
}

/** Série pareada, ordenada: { t, a, b, vao }. */
const pares = [...sa.keys()]
  .filter((t) => sb.has(t))
  .sort()
  .map((t) => ({ t, a: sa.get(t), b: sb.get(t), vao: +(sa.get(t) - sb.get(t)).toFixed(2) }))

const fechamentos = new Map()
for (const p of pares) fechamentos.set(p.t.slice(0, 10), p) // ordenado: o último do dia fica

const f2 = (x) => (x >= 0 ? '+' : '') + x.toFixed(2)
const hora = (t) => `${t.slice(8, 10)}/${t.slice(5, 7)} ${t.slice(11, 16)}Z`

let geradoEm = null
try {
  geradoEm = JSON.parse(readFileSync(join(RAIZ, 'MANIFEST.json'), 'utf8')).geradoEm
} catch {}

console.log(`\n⚖️  VÃO DA SEMANA · ${A} menos ${B} · ${de} a ${ate} · lido no backup`)
if (geradoEm) {
  console.log(`   backup gerado em ${geradoEm}`)
  if (geradoEm.slice(0, 10) <= ate) console.log(`   ⚠️ o backup NÃO cobre o fim de ${ate}: a cauda cega corta a janela`)
}

const naJanela = pares.filter((p) => p.t.slice(0, 10) >= de && p.t.slice(0, 10) <= ate)
if (!naJanela.length) {
  console.error('❌ nenhum instante pareado na janela')
  process.exit(1)
}

console.log('\n   fechamentos (último instante pareado de cada dia):')
const dias = [...fechamentos.keys()].filter((d) => d >= de && d <= ate).sort()
for (const d of dias) {
  const p = fechamentos.get(d)
  console.log(`      ${d}  vão ${f2(p.vao).padStart(7)}pp   ${A} ${p.a.toFixed(2)} · ${B} ${p.b.toFixed(2)}   (${hora(p.t)})`)
}

let min = naJanela[0]
let max = naJanela[0]
for (const p of naJanela) {
  if (p.vao < min.vao) min = p
  if (p.vao > max.vao) max = p
}
console.log(`\n   instantes pareados na janela: ${naJanela.length}`)
console.log(`   piso do vão: ${f2(min.vao)}pp em ${hora(min.t)} (${A} ${min.a.toFixed(2)} · ${B} ${min.b.toFixed(2)})`)
console.log(`   topo do vão: ${f2(max.vao)}pp em ${hora(max.t)} (${A} ${max.a.toFixed(2)} · ${B} ${max.b.toFixed(2)})`)
console.log(`   amplitude intradiária: ${(max.vao - min.vao).toFixed(2)}pp`)

// Superlativo: o topo e o piso da janela contra a SÉRIE INTEIRA do backup, e
// contra tudo o que veio ANTES da janela (o "recorde" que a semana bateu ou não).
const antes = pares.filter((p) => p.t.slice(0, 10) < de)
const extremo = (xs, cmp) => xs.reduce((m, p) => (cmp(p.vao, m.vao) ? p : m), xs[0])
const topoSerie = extremo(pares, (x, y) => x > y)
const pisoSerie = extremo(pares, (x, y) => x < y)
console.log(`\n   série inteira (${pares[0].t.slice(0, 10)} a ${pares[pares.length - 1].t.slice(0, 10)}):`)
console.log(`      topo ${f2(topoSerie.vao)}pp em ${topoSerie.t.slice(0, 10)} ${topoSerie.t.slice(11, 16)}Z · piso ${f2(pisoSerie.vao)}pp em ${pisoSerie.t.slice(0, 10)} ${pisoSerie.t.slice(11, 16)}Z`)
if (antes.length) {
  const topoAntes = extremo(antes, (x, y) => x > y)
  const pisoAntes = extremo(antes, (x, y) => x < y)
  console.log(`      antes da janela: topo ${f2(topoAntes.vao)}pp (${topoAntes.t.slice(0, 10)}) · piso ${f2(pisoAntes.vao)}pp (${pisoAntes.t.slice(0, 10)})`)
  if (max.vao > topoAntes.vao) console.log(`      🏆 o topo da janela SUPERA todo instante pareado anterior, por ${(max.vao - topoAntes.vao).toFixed(2)}pp`)
  if (min.vao < pisoAntes.vao) console.log(`      🏆 o piso da janela fica ABAIXO de todo instante pareado anterior`)
}
const depois = pares.filter((p) => p.t.slice(0, 10) > ate)
if (depois.length && extremo(depois, (x, y) => x > y).vao > max.vao) console.log('      ⚠️ depois da janela o vão já passou do topo dela: frase de recorde precisa de data')

/** Δ semanal seg-sex de toda a série, com ≥4 pregões pareados. */
const segundaDe = (d) => {
  const dt = new Date(d + 'T12:00:00Z')
  const dow = dt.getUTCDay() || 7
  return new Date(dt.getTime() - (dow - 1) * 86400000).toISOString().slice(0, 10)
}
const semanas = new Map()
for (const d of [...fechamentos.keys()].sort()) {
  const dow = new Date(d + 'T12:00:00Z').getUTCDay()
  if (dow === 0 || dow === 6) continue
  const s = segundaDe(d)
  if (!semanas.has(s)) semanas.set(s, [])
  semanas.get(s).push(d)
}
const deltas = []
for (const [s, ds] of semanas) {
  if (ds.length < 4) continue
  const ini = fechamentos.get(ds[0]).vao
  const fim = fechamentos.get(ds[ds.length - 1]).vao
  deltas.push({ semana: s, pregoes: ds.length, delta: +(fim - ini).toFixed(2), ini, fim })
}
const esta = deltas.find((x) => x.semana === segundaDe(de))
console.log(`\n   Δ semanal (último pregão menos primeiro), ${deltas.length} semanas com ≥4 pregões pareados:`)
if (!esta) {
  console.log('   ⚠️ a janela pedida não é uma semana seg-sex completa com ≥4 pregões: sem ranking')
} else {
  const porModulo = [...deltas].sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))
  const rMod = porModulo.findIndex((x) => x.semana === esta.semana) + 1
  const mesmoSinal = deltas.filter((x) => Math.sign(x.delta) === Math.sign(esta.delta)).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))
  const rSinal = mesmoSinal.findIndex((x) => x.semana === esta.semana) + 1
  console.log(`   esta semana: ${f2(esta.ini)} → ${f2(esta.fim)} = ${f2(esta.delta)}pp em ${esta.pregoes} pregões`)
  console.log(`   ranking por MÓDULO: ${rMod}º de ${deltas.length}`)
  console.log(`   ranking entre as de MESMO SINAL (${esta.delta < 0 ? 'fechando para Lula' : 'abrindo para Flávio'}): ${rSinal}º de ${mesmoSinal.length}`)
  console.log('   as cinco maiores por módulo:')
  for (const x of porModulo.slice(0, 5)) console.log(`      semana de ${x.semana}  ${f2(x.delta)}pp  (${x.pregoes} pregões)`)
}
console.log(`\n   série pareada desde ${pares[0].t.slice(0, 10)} · ${pares.length} instantes`)
