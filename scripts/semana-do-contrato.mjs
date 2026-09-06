/**
 * SEMANA DO CONTRATO: o fechamento diário e o Δ da semana, lidos no BACKUP.
 *
 * ⚠️ POR QUE EXISTE. Toda edição do `/tradeoff-brz` e do `/tradeoff-usa` abre com
 * um Δ semanal ("o vão fechou de 29.60pp para 19.90pp em cinco pregões") e não
 * havia ferramenta: a conta era refeita à mão a cada semana. Conta de fechamento
 * semanal tem duas armadilhas que a mão erra em silêncio, e as duas custam a
 * manchete da edição, porque o Δ É a manchete.
 *
 *   1. QUAL PONTO É O FECHAMENTO. A série grava de 30 em 30 minutos. O
 *      fechamento de um dia é o ÚLTIMO ponto daquele dia, não o primeiro nem a
 *      média, e dia sem ponto tem de herdar o último fechamento anterior em vez
 *      de virar buraco.
 *   2. QUAL É A BORDA DA SEMANA. Δ de "seg a sex" pode significar três coisas
 *      diferentes, e elas dão números diferentes. Este script imprime as três e
 *      deixa a escolha explícita, em vez de embutir uma e chamar de a verdade.
 *
 * 🔑 ELE NÃO REIMPLEMENTA NADA. A carga, o casamento de outcome e a quarentena
 * vêm de `scripts/lib/serie-contrato.mjs`, a mesma que o `serie-do-contrato.mjs`
 * usa. Duas cópias da mesma regra foi o defeito que custou os rótulos de faixa
 * do mercado em 29/Jul: convivem sem incidente até o dia em que uma é corrigida
 * e a outra não. → memory/feedback_duas_copias_da_mesma_regra.md
 *
 * ⛔ Não coleta, não escreve e não toca na rede. Lê o backup e imprime.
 *
 * ⚠️ E o backup tem CAUDA CEGA de até 24h, porque ele é gerado uma vez por dia
 * e a série viva cresce de 30 em 30 minutos. Para uma semana JÁ FECHADA isso é
 * irrelevante; para o dia de hoje, não é, e por isso o último dia sai marcado.
 * → memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 *
 * Uso:
 *   node scripts/semana-do-contrato.mjs --pais=br --de=2026-08-31 --ate=2026-09-04
 *   node scripts/semana-do-contrato.mjs --slug=brazil-presidential-election --de=... --ate=...
 *   node scripts/semana-do-contrato.mjs --pais=br --de=... --ate=... --nomes=Lula,Flávio Bolsonaro
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'
import { agruparPorLivro, instantesSuspeitos, serieDe } from './lib/serie-contrato.mjs'

const RAIZ = 'backup/neon'

const PAISES = {
  br: [/^brazil-presidential-election$/, /^any-brazil-stf-justice-removed-by-impeachment-before-2027$/, /^next-brazil-senate-election-most-seats-won$/, /^brazil-presidential-election-first-round-2nd-place$/, /^brazil-presidential-election-first-round-3rd-place$/],
  us: [/^which-party-will-win-the-(house|senate)-in-2026$/, /^will-the-2026-midterm-elections-happen-as-scheduled$/],
}

function lerCsvGz(dir) {
  const caminho = join(RAIZ, dir)
  if (!existsSync(caminho)) return []
  const linhas = []
  for (const f of readdirSync(caminho).filter((x) => x.endsWith('.csv.gz'))) {
    const txt = gunzipSync(readFileSync(join(caminho, f))).toString('utf8')
    const [cab, ...resto] = txt.split(/\r?\n/).filter(Boolean)
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

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const somarDias = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 86400000).toISOString().slice(0, 10)

const pais = arg('pais') ?? 'br'
const soSlug = arg('slug')
const de = arg('de')
const ate = arg('ate')
const filtroNomes = (arg('nomes') ?? '').split(',').map((s) => s.trim()).filter(Boolean)

if (!de || !ate) {
  console.error('❌ faltam as bordas. Use --de=AAAA-MM-DD --ate=AAAA-MM-DD')
  process.exit(1)
}

const mercados = lerCsvGz('market')
const saidas = lerCsvGz('marketOutcome')
const precos = lerCsvGz('marketPrice')
if (!precos.length) {
  console.error(`❌ nenhum ponto lido em ${RAIZ}/marketPrice`)
  process.exit(1)
}

const mercadoDe = new Map(mercados.map((m) => [m.id, m]))
const outcomeDe = new Map(saidas.map((o) => [o.id, o]))
const suspeitos = instantesSuspeitos(precos)
const limpos = suspeitos.size === 0 ? precos : precos.filter((p) => !suspeitos.has(String(p.snapshotAt).slice(0, 19)))

const todos = serieDe(limpos, outcomeDe, mercadoDe, soSlug ? { slug: soSlug } : {})
const padroes = PAISES[pais] ?? []
const livros = agruparPorLivro(soSlug ? todos : todos.filter((p) => padroes.some((re) => re.test(p.slug))))

/** Último ponto de CADA dia. Fechamento é o último, não a média nem o primeiro. */
function fechamentosPorDia(pontos) {
  const porDia = new Map()
  for (const p of pontos) {
    // 🔑 a lib devolve { t, v }: t é o carimbo e v é o preço. Ler outro nome
    // aqui daria série VAZIA em silêncio, que foi o que aconteceu na 1a rodada.
    const dia = String(p.t ?? '').slice(0, 10)
    if (!dia) continue
    const atual = porDia.get(dia)
    if (!atual || p.t > atual.carimbo) porDia.set(dia, { valor: p.v, carimbo: p.t })
  }
  return porDia
}

/** O fechamento vigente EM `dia`: o do próprio dia, ou o último anterior. */
function vigenteEm(porDia, dia) {
  const dias = [...porDia.keys()].filter((d) => d <= dia).sort()
  if (!dias.length) return null
  const d = dias[dias.length - 1]
  return { dia: d, ...porDia.get(d), herdado: d !== dia }
}

const HOJE = new Date().toISOString().slice(0, 10)
console.log(`\n📆 SEMANA DO CONTRATO · ${de} a ${ate} · pais=${pais}${soSlug ? ` · slug=${soSlug}` : ''}`)
console.log(`   fechamento = ÚLTIMO ponto do dia · lido no backup, não na API`)
console.log(`   ⚠️  as três bordas abaixo dão números DIFERENTES: escolher uma e declarar qual\n`)

for (const [chave, pontos] of [...livros.entries()].sort()) {
  // a chave de agruparPorLivro e `slug␟outcome`
  const [slug, nome] = String(chave).split('␟')
  if (filtroNomes.length && !filtroNomes.some((n) => nome.includes(n))) continue
  const porDia = fechamentosPorDia(pontos)
  if (!porDia.size) continue

  const abreNoDia = vigenteEm(porDia, de)
  const abreNaVespera = vigenteEm(porDia, somarDias(de, -1))
  const fecha = vigenteEm(porDia, ate)
  if (!abreNoDia || !fecha) continue

  const d = (a, b) => (b === null || a === null ? null : +(b - a).toFixed(2))
  console.log(`   ${nome}  ·  ${slug}`)
  console.log(`      fecha em ${fecha.dia}: ${Number(fecha.valor).toFixed(2)}${fecha.herdado ? ' (herdado)' : ''}${fecha.dia === HOJE ? '  ⚠️ dia de hoje, cauda cega' : ''}`)
  console.log(`      Δ desde o fechamento de ${de} .............. ${fmt(d(abreNoDia.valor, fecha.valor))}   (abre ${Number(abreNoDia.valor).toFixed(2)})`)
  console.log(`      Δ desde o fechamento da véspera, ${abreNaVespera?.dia ?? 'n/d'} ... ${fmt(d(abreNaVespera?.valor ?? null, fecha.valor))}   (abre ${abreNaVespera ? Number(abreNaVespera.valor).toFixed(2) : 'n/d'})`)

  const caminho = []
  for (let x = de; x <= ate; x = somarDias(x, 1)) {
    const v = porDia.get(x)
    caminho.push(`${x.slice(5)} ${v ? Number(v.valor).toFixed(2) : '  ·  '}`)
  }
  console.log(`      caminho: ${caminho.join(' | ')}\n`)
}

function fmt(v) {
  if (v === null) return '  n/d '
  return (v >= 0 ? '+' : '') + v.toFixed(2) + 'pp'
}
