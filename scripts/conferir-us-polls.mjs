/**
 * PORTÃO DO GENERIC BALLOT: o passo bloqueante do `/atualizar-pesquisas-usa`.
 *
 * ⚠️ POR QUE ESTE SCRIPT EXISTE. O `parse-us-generic-ballot.mjs` NÃO tem portão
 * de segurança e a rota do cron TEM: a rota se recusa a gravar leitura vazia por
 * cima de uma boa, o script escreve o arquivo de qualquer jeito. A conferência
 * existia só como um `node -e` digitado à mão na régua, e conferidor que se
 * redigita é chance nova de errar. A versão anterior dele olhava as 5 primeiras
 * linhas, que são sempre as mais recentes e as mais bem formatadas, e coluna
 * deslizada aparece onde a origem mudou de formato, no meio ou no fim da tabela.
 * Em 04/Ago/2026 varrer as 351 achou 2 que a amostra de 5 nunca mostraria.
 * Ver memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * 🔑 SÃO DOIS DEFEITOS E SÓ UM ENCOLHE O ARQUIVO. Em 01/Ago/2026 a coleta
 * CRESCEU de 278 para 282 linhas e mesmo assim publicou lixo: "Big Data Poll ·
 * D 914 x R 3,2", em que o 914 era a AMOSTRA e o 3,2 a MARGEM DE ERRO, porque o
 * `rowspan` da Wikipédia desliza a coluna. Conferir só o tamanho não basta.
 *
 * ⛔ O QUE ELE NÃO É. Não coleta, não escreve o arquivo de dados e não conserta
 * nada. Ele lê o que o parser produziu, compara com a versão que está no git e
 * dá um veredito. O conserto é sempre `git checkout --` e investigar a origem.
 *
 * ✅ O CONTROLE QUE FAZ O VEREDITO VALER: a LINHA DE BASE VEM DO GIT.
 *
 * Um portão que só olha o arquivo de hoje não sabe dizer se 2 somas fora da
 * faixa são as 2 de sempre ou 2 novas. As duas conhecidas (RMG Research 94 e
 * Reuters/Ipsos 92) são recorte do instituto, com o indeciso fora de "outros", e
 * NÃO são defeito. O que denuncia mudança de formato na origem é o CRESCIMENTO
 * desse número, e crescimento só se vê contra uma base.
 *
 * 🏷️ E o campo da fonte chama `fontePrimaria`, não `fonte`. Recontar por conta
 * própria com o nome errado devolve "379 de 379 sem fonte primária", que parece
 * achado gravíssimo e é laço vazio. Aqui se usa o contador que o próprio arquivo
 * declara, `qualidade.semFontePrimaria`.
 *
 * Uso:
 *   node scripts/conferir-us-polls.mjs
 *   node scripts/conferir-us-polls.mjs --base=<ref-git>       (padrão HEAD)
 *   node scripts/conferir-us-polls.mjs --arquivo=<caminho> --base-arquivo=<caminho>
 */

import { readFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { comparar, conferirSubtracao, mediaDe, veredito } from '../lib/us-polls/atribuicao.mjs'

const arg = (n, padrao) =>
  process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? padrao

const ARQUIVO = arg('arquivo', 'public/us-polls-data.json')
const BASE_REF = arg('base', 'HEAD')
const BASE_ARQUIVO = arg('base-arquivo', null)

/** Régua de valor da casa: folgada de propósito, existe recorte com muito indeciso. */
const MIN_PCT = 15
const MAX_PCT = 70
/** Numa linha bem lida, Dem + Rep + outros fecha perto de 100. */
const SOMA_MIN = 97
const SOMA_MAX = 102

const cor = { ok: '\x1b[32m', mau: '\x1b[31m', aviso: '\x1b[33m', fim: '\x1b[0m' }
const marca = (p) => (p ? `${cor.ok}✅${cor.fim}` : `${cor.mau}❌${cor.fim}`)
const num = (v) => (v === null || v === undefined ? '—' : v)

const atual = JSON.parse(readFileSync(ARQUIVO, 'utf8'))

/** A base sai do git, não de uma cópia que alguém lembrou de fazer. */
function lerBase() {
  if (BASE_ARQUIVO) return JSON.parse(readFileSync(BASE_ARQUIVO, 'utf8'))
  try {
    return JSON.parse(
      execFileSync('git', ['show', `${BASE_REF}:${ARQUIVO}`], {
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      })
    )
  } catch {
    return null
  }
}
const base = lerBase()

const q = atual.qualidade ?? {}
const m = atual.mediaAfos ?? null
const qb = base?.qualidade ?? null
const mb = base?.mediaAfos ?? null
const linhas = Array.isArray(atual.polls) ? atual.polls : []

console.log(`\n🇺🇸 GENERIC BALLOT — portão de publicação`)
console.log(`   arquivo ${ARQUIVO} · base ${BASE_ARQUIVO ?? `git ${BASE_REF}`}\n`)

if (!base) {
  console.log(
    `   ${cor.aviso}⚠️${cor.fim}  SEM LINHA DE BASE: não achei a versão anterior. ` +
      `Colapso e contaminação ainda são conferidos, mas CRESCIMENTO não.\n`
  )
}

// ── 1. COLAPSO: a leitura morreu? ─────────────────────────────────────────

const publicadas = q.publicadas ?? 0
const pubBase = qb?.publicadas ?? null
const colapsoZero = publicadas === 0
const colapsoMetade = pubBase !== null && publicadas < pubBase / 2
const colapsoMedia = !m
const passaColapso = !colapsoZero && !colapsoMetade && !colapsoMedia

console.log(`   ${marca(passaColapso)} colapso`)
console.log(
  `        publicadas ${num(pubBase)} → ${publicadas}` +
    (colapsoZero ? '  ← ZERO' : colapsoMetade ? '  ← caiu para menos da METADE' : '') +
    ` · lidas ${num(qb?.linhasLidas)} → ${num(q.linhasLidas)}`
)
console.log(`        mediaAfos ${m ? 'presente' : `${cor.mau}NULA${cor.fim}`}`)

// ── 2. CONTAMINAÇÃO: a leitura sobreviveu mas deslizou? ───────────────────

const foraDaRegua = linhas.filter(
  (p) =>
    !(p.dem >= MIN_PCT && p.dem <= MAX_PCT && p.rep >= MIN_PCT && p.rep <= MAX_PCT && p.dem + p.rep <= 100)
)

const soma = (p) => p.dem + p.rep + (p.outros || 0)

/**
 * Coluna deslizada tem assinatura própria: a AMOSTRA ou a MARGEM aparecem como
 * intenção de voto. Recorte do instituto, não: ali `dem` e `rep` são plausíveis
 * e a amostra e a margem estão nos campos delas.
 */
function assinaturaDeDeslize(p) {
  const perto = (a, b) => a !== undefined && b !== undefined && Math.abs(a - b) < 0.01
  for (const campo of ['dem', 'rep', 'outros']) {
    const v = p[campo]
    if (v === undefined || v === null) continue
    if (perto(v, p.amostra)) return `${campo} é igual à amostra (${p.amostra})`
    if (perto(v, p.margemErro)) return `${campo} é igual à margem de erro (${p.margemErro})`
  }
  if (!p.amostra && !p.margemErro) return 'amostra E margem ausentes, os dois campos sumiram'
  return null
}

const somaFora = linhas.map((p) => ({ p, s: soma(p) })).filter((x) => x.s < SOMA_MIN || x.s > SOMA_MAX)
const deslizadas = somaFora.filter((x) => assinaturaDeDeslize(x.p))
const recortes = somaFora.filter((x) => !assinaturaDeDeslize(x.p))

const somaForaBase = base
  ? (base.polls ?? []).map(soma).filter((s) => s < SOMA_MIN || s > SOMA_MAX).length
  : null
const cresceuForaDaFaixa = somaForaBase !== null && somaFora.length > somaForaBase

const passaContaminacao = foraDaRegua.length === 0 && deslizadas.length === 0 && !cresceuForaDaFaixa

console.log(`   ${marca(passaContaminacao)} contaminação  (varrendo TODAS as ${linhas.length} linhas)`)
console.log(`        fora da régua ${MIN_PCT}-${MAX_PCT}%: ${foraDaRegua.length}`)
for (const p of foraDaRegua.slice(0, 8)) {
  console.log(`          ${p.instituto} ${p.campoFim} · D ${p.dem} R ${p.rep} · ${assinaturaDeDeslize(p) ?? 'sem assinatura de deslize'}`)
}
console.log(
  `        soma D+R+outros fora de ${SOMA_MIN}-${SOMA_MAX}: ${somaFora.length}` +
    (somaForaBase === null ? '' : ` (base tinha ${somaForaBase})`) +
    (cresceuForaDaFaixa ? `  ${cor.mau}← CRESCEU: a origem pode ter mudado de formato${cor.fim}` : '')
)
for (const x of deslizadas) {
  console.log(`          ${cor.mau}DESLIZE${cor.fim} ${x.p.instituto} ${x.p.campoFim} · soma ${x.s} · ${assinaturaDeDeslize(x.p)}`)
}
for (const x of recortes) {
  console.log(
    `          recorte do instituto: ${x.p.instituto} ${x.p.campoInicio}→${x.p.campoFim} · ` +
      `D ${x.p.dem} R ${x.p.rep} outros ${x.p.outros} = ${x.s} · amostra ${x.p.amostra} ${x.p.amostraTipo ?? ''} · margem ${x.p.margemErro}`
  )
}
console.log(
  `        descartadas por valor ${num(qb?.descartadasPorValor)} → ${num(q.descartadasPorValor)}` +
    (qb && q.descartadasPorValor > qb.descartadasPorValor ? `  ${cor.mau}← subiu: olhar o parseTabela${cor.fim}` : '')
)
console.log(`        sem fonte primária (contador do ARQUIVO): ${num(qb?.semFontePrimaria)} → ${num(q.semFontePrimaria)}`)

// ── 3. COMPOSIÇÃO: a média mexeu por pesquisa nova ou pela borda da janela? ─

const campoMaisRecente = (a) =>
  (a?.polls ?? []).map((p) => p.campoFim).filter(Boolean).sort().at(-1) ?? null
const campoAgora = campoMaisRecente(atual)
const campoBase = campoMaisRecente(base)

console.log(`\n   📊 composição`)
let passaAtribuicao = true
if (m && mb) {
  const d = Number((m.vantagemDem - mb.vantagemDem).toFixed(2))
  const reguaParada = campoAgora === campoBase
  console.log(`        vantagem  ${mb.vantagemDem} → ${m.vantagemDem}  (${d >= 0 ? '+' : ''}${d.toFixed(2)}pp)`)
  console.log(`        n         ${mb.nPesquisas} → ${m.nPesquisas} pesquisas · ${mb.nInstitutos} → ${m.nInstitutos} institutos`)
  console.log(`        janela    desde ${mb.desde} → ${m.desde}`)
  console.log(`        campo mais recente da base: ${campoBase} → ${campoAgora}${reguaParada ? '  (PARADO)' : ''}`)

  // 🔑 A média declarada tem de sair das linhas que ela mesma declara. Arquivo
  // incoerente consigo próprio não se commita.
  if (m.incluidas) {
    const r = mediaDe(m.incluidas)
    const bate = r.n === m.nPesquisas && r.dem === m.dem && r.rep === m.rep && r.vantagemDem === m.vantagemDem
    const inst = new Set(m.incluidas.map((x) => x.instituto)).size
    if (!bate || inst !== m.nInstitutos) {
      passaAtribuicao = false
      console.log(
        `        ${cor.mau}❌${cor.fim}  a média NÃO reproduz a partir das linhas declaradas:\n` +
          `           declarada D${m.dem}/${m.rep} n=${m.nPesquisas} inst=${m.nInstitutos}` +
          ` · reproduzida D${r.dem}/${r.rep} n=${r.n} inst=${inst}`
      )
    } else {
      console.log(`        ${cor.ok}✓${cor.fim} a média reproduz a partir das ${r.n} rodadas declaradas`)
    }
  }

  if (m.incluidas && mb.incluidas) {
    // ✅ Caminho bom: comparar RODADA a rodada.
    const dif = comparar(mb.incluidas, m.incluidas)
    const rot = (x) => `${x.campoFim} ${x.instituto} (D+${(x.dem - x.rep).toFixed(2)})`
    console.log(`        saíram    ${dif.sairam.map(rot).join(' · ') || '(ninguém)'}`)
    console.log(`        entraram  ${dif.entraram.map(rot).join(' · ') || '(ninguém)'}`)
    if (dif.mudaram.length) {
      console.log(
        `        corrigidas na origem: ${dif.mudaram.map((x) => rot(x.antes) + ' → ' + rot(x.depois)).join(' · ')}`
      )
    }
    for (const pb of conferirSubtracao(mb.incluidas, m.incluidas, dif)) {
      passaAtribuicao = false
      console.log(`        ${cor.mau}❌${cor.fim}  a conta de ${pb.campo} não fecha: prevista ${pb.previsto}, real ${pb.real}`)
    }
    const v = veredito(dif, d)
    console.log(`        🧭 VEREDITO DA VARIAÇÃO: ${v.join(' + ')}`)
    if (v.includes('COMPOSICAO')) {
      console.log(
        `        ${cor.aviso}⚠️${cor.fim}  ZERO informação nova: ninguém entrou e nada foi corrigido.\n` +
          `           A variação é de COMPOSIÇÃO, e escrever verbo de movimento aqui é falso.`
      )
    }
    if (v.includes('INCONSISTENTE')) {
      passaAtribuicao = false
      console.log(`        ${cor.mau}❌${cor.fim}  conjunto idêntico e a média mexeu ${d.toFixed(2)}pp. Defeito do coletor.`)
    }
  } else {
    // ⚠️ Caminho DEGRADADO, só para leitura anterior a 04/Set/2026, que não grava
    // `incluidas`. Ele compara NOMES de casa, e nome de casa não é rodada: onda
    // nova de uma casa que JÁ está na lista passa invisível por aqui. Medido em
    // 04/Set sobre o arquivo real: uma onda da YouGov com campo 28/Ago levaria a
    // média de D+5.69 a D+5.93 e este caminho diria "ninguém entrou".
    const antes = new Set(mb.institutos ?? [])
    const agora = new Set(m.institutos ?? [])
    console.log(`        saíram    ${[...antes].filter((x) => !agora.has(x)).join(', ') || '(ninguém)'}`)
    console.log(`        entraram  ${[...agora].filter((x) => !antes.has(x)).join(', ') || '(ninguém)'}`)
    console.log(
      `        ${cor.aviso}⚠️${cor.fim}  atribuição DEGRADADA: falta mediaAfos.incluidas ${!m.incluidas ? 'na leitura nova' : 'na base do git'}.\n` +
        `           Aqui a comparação é por NOME de casa, e onda nova de casa que já está na lista passa invisível.\n` +
        `           NÃO usar esta linha para afirmar "zero informação nova".`
    )
  }
} else {
  console.log(`        sem base comparável`)
}

// ── Veredito ──────────────────────────────────────────────────────────────

const ok = passaColapso && passaContaminacao && passaAtribuicao
console.log(
  `\n${ok ? cor.ok : cor.mau}VEREDITO: ${ok ? 'APROVADO' : 'REPROVADO'}${cor.fim}` +
    (passaColapso ? '' : '  — COLAPSO') +
    (passaContaminacao ? '' : '  — CONTAMINAÇÃO') +
    '\n'
)
if (!ok) {
  console.log(`   Desfazer e investigar a ORIGEM, nunca repetir a coleta por cima:`)
  console.log(`     git checkout -- ${ARQUIVO}\n`)
}

process.exit(ok ? 0 : 1)
