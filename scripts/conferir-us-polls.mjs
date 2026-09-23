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
import { separarPorConferencia, validarRegistro } from '../lib/us-polls/soma-conferida.mjs'

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
    `   ${cor.aviso}⚠️${cor.fim}  SEM LINHA DE BASE: não achei a versão anterior.\n` +
      `      Valem só as regras ABSOLUTAS: publicadas = 0 e mediaAfos nula.\n` +
      `      Ficam INERTES, e não é possível reprovar por elas:\n` +
      `        · colapso "caiu para menos da METADE"\n` +
      `        · contaminação "cresceu fora da faixa"\n` +
      `        · a atribuição da variação\n` +
      `      Medido em 09/Set/2026: sem base, um arquivo que foi de 387 para 3 linhas\n` +
      `      passava com VEREDITO: APROVADO e um ✅ verde no colapso.\n`
  )
}

// ── 1. COLAPSO: a leitura morreu? ─────────────────────────────────────────

const publicadas = q.publicadas ?? 0
const pubBase = qb?.publicadas ?? null
const colapsoZero = publicadas === 0
const colapsoMetade = pubBase !== null && publicadas < pubBase / 2
const colapsoMedia = !m
const passaColapso = !colapsoZero && !colapsoMetade && !colapsoMedia

// Sem base, "caiu para menos da METADE" não pode disparar. Passar aqui não é
// a mesma coisa que passar com base, e o ✅ verde escondia exatamente isso.
const colapsoDegradado = pubBase === null
const marcaColapso =
  passaColapso && colapsoDegradado ? `${cor.aviso}⚠️${cor.fim}` : marca(passaColapso)
console.log(
  `   ${marcaColapso} colapso` +
    (passaColapso && colapsoDegradado ? '  DEGRADADO: só "zero" e "média nula" foram testados' : '')
)
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

const somaForaBaseLinhas = base
  ? (base.polls ?? []).map((p) => ({ p, s: soma(p) })).filter((x) => x.s < SOMA_MIN || x.s > SOMA_MAX)
  : null
const somaForaBase = somaForaBaseLinhas ? somaForaBaseLinhas.length : null

// 🔑 O "CRESCEU" conta o que NINGUÉM ABRIU AINDA, não a contagem bruta: linha já
// conferida no topline do instituto não é assinatura de formato novo, e mantê-la
// no contador reprovaria a passada todo dia. → lib/us-polls/soma-conferida.mjs
const problemasDoRegistro = validarRegistro()
const aqui = separarPorConferencia(somaFora)
const naBase = somaForaBaseLinhas ? separarPorConferencia(somaForaBaseLinhas) : null
const cresceuForaDaFaixa = naBase !== null && aqui.naoConferidas.length > naBase.naoConferidas.length

const passaContaminacao =
  foraDaRegua.length === 0 && deslizadas.length === 0 && !cresceuForaDaFaixa && problemasDoRegistro.length === 0

console.log(`   ${marca(passaContaminacao)} contaminação  (varrendo TODAS as ${linhas.length} linhas)`)
console.log(`        fora da régua ${MIN_PCT}-${MAX_PCT}%: ${foraDaRegua.length}`)
for (const p of foraDaRegua.slice(0, 8)) {
  console.log(`          ${p.instituto} ${p.campoFim} · D ${p.dem} R ${p.rep} · ${assinaturaDeDeslize(p) ?? 'sem assinatura de deslize'}`)
}
console.log(
  `        soma D+R+outros fora de ${SOMA_MIN}-${SOMA_MAX}: ${somaFora.length}` +
    (somaForaBase === null ? '' : ` (base tinha ${somaForaBase})`) +
    `, das quais ${aqui.naoConferidas.length} NÃO abertas na fonte` +
    (naBase === null ? '' : ` (base tinha ${naBase.naoConferidas.length})`) +
    (cresceuForaDaFaixa ? `  ${cor.mau}← CRESCEU: a origem pode ter mudado de formato${cor.fim}` : '')
)
for (const x of deslizadas) {
  console.log(`          ${cor.mau}DESLIZE${cor.fim} ${x.p.instituto} ${x.p.campoFim} · soma ${x.s} · ${assinaturaDeDeslize(x.p)}`)
}
for (const x of aqui.naoConferidas) {
  console.log(
    `          ${cor.mau}NÃO ABERTA${cor.fim} ${x.p.instituto} ${x.p.campoInicio}→${x.p.campoFim} · ` +
      `D ${x.p.dem} R ${x.p.rep} outros ${x.p.outros} = ${x.s} · amostra ${x.p.amostra} ${x.p.amostraTipo ?? ''} · margem ${x.p.margemErro}` +
      `\n            abrir o topline do instituto e registrar em lib/us-polls/soma-conferida.mjs`
  )
}
for (const x of aqui.recorteConferido) {
  console.log(
    `          recorte do instituto, CONFERIDO em ${x.entrada.conferidoEm}: ${x.p.instituto} ${x.p.campoInicio}→${x.p.campoFim} · ` +
      `D ${x.p.dem} R ${x.p.rep} outros ${x.p.outros} = ${x.s}`
  )
}
// Dívida aberta contra a origem: sai do contador porque já foi investigada, e
// aparece em TODA passada porque continua errada lá fora.
for (const x of aqui.erroDoIndice) {
  console.log(
    `          ${cor.mau}ERRO DO ÍNDICE${cor.fim}, conferido em ${x.entrada.conferidoEm}: ${x.p.instituto} ${x.p.campoInicio}→${x.p.campoFim} · ` +
      `D ${x.p.dem} R ${x.p.rep} outros ${x.p.outros} = ${x.s}\n            ${x.entrada.decomposicao}`
  )
}
for (const p of problemasDoRegistro) console.log(`          ${cor.mau}REGISTRO INVÁLIDO${cor.fim}: ${p}`)
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
    // 🚀 A FICHA de quem entrou, para a conferência na FONTE começar daqui.
    //    Medido em 15/Set/2026: a CBS News/YouGov entrou e a conferência exigiu
    //    garimpar o JSON atrás do link, da amostra e do recorte antes de abrir o
    //    topline. Lá, D 54 x R 46 e o N ponderado de 1.750 LV bateram, e a margem
    //    de 2,9 do índice NÃO constava (o instituto declara ±2,3 só para os 2.460
    //    adultos). Wikipédia é ÍNDICE, o instituto é FONTE: a ficha diz o que
    //    conferir, não certifica nada.
    for (const x of dif.entraram) {
      const p = (atual.polls ?? []).find(
        (q) => q.instituto === x.instituto && q.campoFim === x.campoFim && q.dem === x.dem && q.rep === x.rep &&
          (!x.amostraTipo || q.amostraTipo === x.amostraTipo)
      )
      if (!p) {
        console.log(`          ↳ ${cor.aviso}⚠️${cor.fim}  ${x.instituto} ${x.campoFim}: rodada incluída na média sem linha correspondente em polls`)
        continue
      }
      const soma = (p.dem ?? 0) + (p.rep ?? 0) + (p.outros ?? 0)
      console.log(
        `          ↳ ficha ${p.instituto}: campo ${p.campoInicio}→${p.campoFim} · n=${p.amostra ?? '?'} ${p.amostraTipo ?? '?'} · ±${p.margemErro ?? '?'} · ` +
          `D ${p.dem} R ${p.rep} outros ${p.outros ?? '?'} (soma ${soma}) · origem ${p.origem ?? '?'}`
      )
      console.log(`            fonte ${p.fontePrimaria || `${cor.mau}SEM FONTE PRIMÁRIA${cor.fim}`}`)
      console.log(`            conferir NA FONTE: D e R, recorte (LV/RV/A), amostra e margem. O índice não é a fonte.`)
    }
    if (dif.mudaram.length) {
      // 🔑 "Corrigida na origem" afirma que a Wikipédia mudou o número, e isso
      // nem sempre é o que houve: quando a curada se aposenta porque o índice
      // finalmente indexou a onda, a linha TROCA DE PROCEDÊNCIA e os valores
      // podem mudar sem ninguém ter corrigido nada. Medido em 23/Set/2026: a
      // UMass de 21-26/Ago foi de D+7.00 para D+8.00 porque a curada lia o
      // tópico SEM leaners (D 40 x R 33) e o índice publica COM (D 42 x R 34).
      // Chamar isso de correção esconde uma troca de instrumento de leitura.
      // A chave de `comparar` é instituto|campoFim, e `incluidas` nem sempre
      // carrega campoInicio: casar só pelo que existe nos dois lados.
      const ondeEsta = (arq, x) =>
        (arq?.polls ?? []).find(
          (p) =>
            p.instituto === x.instituto &&
            p.campoFim === x.campoFim &&
            (x.amostraTipo == null || p.amostraTipo === x.amostraTipo) &&
            (x.dem == null || Number(p.dem) === Number(x.dem))
        )?.origem ?? null
      const trocouProcedencia = []
      const corrigidas = []
      for (const x of dif.mudaram) {
        const de = ondeEsta(base, x.antes)
        const para = ondeEsta(atual, x.depois)
        ;(de && para && de !== para ? trocouProcedencia : corrigidas).push({ ...x, de, para })
      }
      if (corrigidas.length) {
        console.log(`        corrigidas na origem: ${corrigidas.map((x) => rot(x.antes) + ' → ' + rot(x.depois)).join(' · ')}`)
      }
      for (const x of trocouProcedencia) {
        console.log(
          `        ${cor.aviso ?? ''}trocou de PROCEDÊNCIA${cor.fim}, não foi correção: ${rot(x.antes)} → ${rot(x.depois)}` +
            `\n            ${x.de} → ${x.para}. A curada se aposentou porque o índice indexou a onda, e os dois leem a mesma rodada de jeitos diferentes.`
        )
      }
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
const degradado = !base
console.log(
  `\n${ok ? cor.ok : cor.mau}VEREDITO: ${ok ? 'APROVADO' : 'REPROVADO'}` +
    (ok && degradado ? ' (DEGRADADO)' : '') +
    `${cor.fim}` +
    (passaColapso ? '' : '  — COLAPSO') +
    (passaContaminacao ? '' : '  — CONTAMINAÇÃO') +
    '\n'
)
if (ok && degradado) {
  console.log(
    `   ${cor.aviso}⚠️${cor.fim}  APROVADO aqui NÃO é o mesmo APROVADO de uma passada com base.\n` +
      `      Metade das regras não pôde ser aplicada. Não usar este veredito para publicar.\n`
  )
}
if (!ok) {
  console.log(`   Desfazer e investigar a ORIGEM, nunca repetir a coleta por cima:`)
  console.log(`     git checkout -- ${ARQUIVO}\n`)
}

process.exit(ok ? 0 : 1)
