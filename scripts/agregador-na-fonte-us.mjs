#!/usr/bin/env node
/**
 * AGREGADOR NA FONTE — o que o Race to the WH tem que a nossa base não tem?
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 19/Set/2026: o `agregadores-us-polls.mjs`
 *    lê os agregadores pela CÓPIA da Wikipédia e compara só a PONTA, a data de
 *    campo mais recente. Naquele dia ele saiu `EM COMPASSO, 0 dias` e estava
 *    certo na ponta e cego no meio: o agregador tinha **NYT/Siena (A+), Fox
 *    News/Beacon (A), Marquette (A+), Quinnipiac (A-), Ipsos (B) e Cygnal
 *    (A+)** dentro da nossa janela de 30 dias, e a nossa base tinha ZERO
 *    rodadas dessas casas desde 21/Ago. Duas delas, Fox News/Beacon e The
 *    Honest Poll, não têm UMA linha no arquivo inteiro de 397.
 *
 * 🔑 Como o dado é lido, e custou uma caçada:
 *    1. `racetothewh.com/polls/genericballot` é Squarespace e a tabela é embed
 *       do **Infogram** (`e.infogram.com/_/kgnBnGYUAJL5SSzYyJTD`).
 *    2. O HTML do embed traz `window.publicViewConfig` com
 *       `liveDataURL: https://live-data.jifo.co/`, e o `chartData` VAZIO,
 *       porque o gráfico é de dado vivo.
 *    3. O bloco `props.chartData.custom.live` do gráfico "Generic Ballot -
 *       Publish" traz `key`, e `liveDataURL + key` devolve o JSON inteiro.
 *
 * ⛔ ISTO NÃO INGERE NADA. Saber que falta rodada não autoriza ler no
 *    instituto: isso muda a PROCEDÊNCIA da média e segue decisão do André,
 *    casa por casa. Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
 *
 * ⛔ USO INTERNO. Ele mede a nossa cobertura, não o eleitorado.
 *
 * Uso:
 *   node scripts/agregador-na-fonte-us.mjs
 *   node scripts/agregador-na-fonte-us.mjs --dias=30
 */
import { readFileSync } from 'fs'
import { pathToFileURL } from 'url'

export const CHAVE_GENERIC_BALLOT = '79287655-1e6e-4a3a-9ca3-13883c9a7496'
export const BASE_LIVE = 'https://live-data.jifo.co/'
const FONTE_HUMANA = 'https://www.racetothewh.com/polls/genericballot'

const opt = (n, p) => {
  const a = process.argv.find((x) => x.startsWith(`--${n}=`))
  return a ? a.slice(n.length + 3) : p
}
const DIAS = Number(opt('dias', '30'))
const ARQUIVO = opt('arquivo', 'public/us-polls-data.json')

const MES = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }

/**
 * "Sep 15 - 17: Zogby (B-), 1007 LV" → fim de campo, casa, amostra, recorte.
 * ⚠️ O intervalo pode cruzar o mês: "Aug 31 - Sep 10" tem o mês só no começo
 *    do segundo lado. Sem tratar isso, o fim vira 31/Ago e a rodada some da
 *    janela por 10 dias.
 */
export function lerRotulo(txt) {
  const s = String(txt ?? '').trim()
  const m = s.match(/^([A-Z][a-z]{2})\s+(\d{1,2})(?:\s*-\s*(?:([A-Z][a-z]{2})\s+)?(\d{1,2}))?\s*:\s*(.+)$/)
  if (!m) return null
  const mesIni = MES[m[1]]
  if (!mesIni) return null
  const mesFim = m[3] ? MES[m[3]] : mesIni
  const diaFim = Number(m[4] ?? m[2])
  if (!mesFim || !Number.isFinite(diaFim)) return null
  const resto = m[5]
  // ⚠️ O nome CURTO perde o qualificador entre parênteses: "YouGov (CBS)" vira
  // "YouGov" e deixa de casar com a CBS News/YouGov que JÁ temos, inflando o
  // buraco. A tabela de apelidos tem de ver o rótulo INTEIRO, e o nome curto
  // fica só para exibição.
  const casa = resto.split(/\s*\(|,/)[0].trim()
  const casaCompleta = resto.split(',')[0].trim()
  // 🔴 O recorte sai do MESMO casamento que a amostra, e isso não é elegância:
  //    o rótulo traz a NOTA da casa entre parênteses, e "(A+)" casa com `\bA\b`
  //    porque "(" e "+" não são caractere de palavra. Medido em 19/Set/2026: a
  //    NYT/Siena, que é "1503 LV", saía como recorte **A**, e a Quinnipiac, que
  //    é "970 RV", também. Nota A+ ou A- em qualquer casa produzia o mesmo erro.
  //    Ele não muda o CASAMENTO, que é por casa e data, então passa calado no
  //    veredito e só aparece na linha que alguém vai transcrever à mão.
  const comAmostra = resto.match(/([\d,]{3,7})\s*(LV|RV|A)\b/i)
  const amostra = comAmostra?.[1]?.replace(/,/g, '') ?? null
  // Sem amostra no rótulo não há âncora, e aí a varredura solta é o que sobra:
  // ela vale menos, e por isso só roda nesse caso.
  const recorte = (comAmostra?.[2] ?? (resto.match(/\b(LV|RV|A)\b/i) || [])[1])?.toUpperCase() ?? null
  return {
    campoFim: `2026-${String(mesFim).padStart(2, '0')}-${String(diaFim).padStart(2, '0')}`,
    casa,
    amostra: amostra ? Number(amostra) : null,
    casaCompleta,
    recorte,
    rotulo: s,
  }
}

/**
 * Nome do agregador → nome no nosso índice. Tabela EXPLÍCITA, nunca por semelhança.
 *
 * 🔴 APELIDO QUE FALTA VIRA BURACO QUE NÃO EXISTE, medido em 20/Set/2026: logo
 *    depois de ingerir Focaldata, UMass Amherst e McLaughlin, o conferidor ainda
 *    imprimia as três como faltando e ainda por cima com "🔴 a casa NAO tem UMA
 *    linha no arquivo", porque o rótulo delas não estava aqui. Era mandar
 *    caçar de novo rodada que eu acabara de escrever.
 *
 * ⚠️ E as duas YouGov de universidade são casas DIFERENTES entre si: UMass
 *    Amherst e UMass Lowell não se fundem, e BGSU é uma terceira. Um apelido
 *    frouxo aqui juntaria séries de instituições distintas.
 *
 * 📌 A ordem importa, porque a busca é `find`: o primeiro padrão que casar
 *    vence. Os qualificadores de universidade vêm ANTES das regras genéricas
 *    da YouGov por isso.
 */
export const APELIDOS = [
  [/amherst/i, 'UMass Amherst/YouGov'],
  [/lowell/i, 'UMass Lowell/YouGov'],
  [/bgsu|bowling green/i, 'BGSU/YouGov'],
  [/focaldata/i, 'Focaldata/Financial Times'],
  // ⚠️ O agregador rotula esta casa como "McLaughlin (D)". O nosso índice a
  //    grava como "(R)" nas 6 linhas que já tem, e McLaughlin & Associates é
  //    casa republicana. A letra do agregador não é autoridade sobre isso.
  [/mclaughlin/i, 'McLaughlin & Associates (R)'],
  [/zogby/i, 'John Zogby Strategies'],
  [/rmg research|napolitan/i, 'Napolitan News/RMG Research'],
  [/rainey/i, 'The Rainey Center'],
  [/big data/i, 'Big Data Poll'],
  [/yougov \(cbs\)|cbs/i, 'CBS News/YouGov'],
  [/yougov \(economist\)|economist/i, 'The Economist/YouGov'],
  [/catawba/i, 'Catawba College/YouGov'],
  [/harvard|harris/i, 'Harvard/Harris'],
  [/quantus/i, 'Quantus Insights'],
  [/siena|nyt/i, 'NYT/Siena'],
  [/fox news|beacon/i, 'Fox News/Beacon'],
  [/marquette/i, 'Marquette'],
  [/quinnipiac/i, 'Quinnipiac'],
  [/ipsos/i, 'Reuters/Ipsos'],
  [/cygnal/i, 'Cygnal'],
  [/morning consult/i, 'Morning Consult'],
  [/activote/i, 'Activote'],
  [/honest/i, 'The Honest Poll'],
]
const normalizar = (casa) => (APELIDOS.find(([re]) => re.test(casa)) || [null, casa])[1]

/** Morning Consult fica FORA por desenho: o tracker é produto pago. */
const FORA_POR_DESENHO = [/morning consult/i]

async function main() {
  let dados
  try {
    dados = JSON.parse(readFileSync(ARQUIVO, 'utf8'))
  } catch (e) {
    console.error(`❌ NAO LEU ${ARQUIVO}: ${e.message}`)
    process.exit(1)
  }

  let vivo
  try {
    const r = await fetch(BASE_LIVE + CHAVE_GENERIC_BALLOT, { signal: AbortSignal.timeout(30_000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    vivo = await r.json()
  } catch (e) {
    console.error(`\n❌ NAO LEU o agregador na fonte: ${e.message}`)
    console.error(`   ${BASE_LIVE}${CHAVE_GENERIC_BALLOT}`)
    console.error(`   ⛔ Isto NAO e "nada faltando": e o conferidor declarando que nao mediu.`)
    process.exit(4)
  }

  const folhas = vivo.data ?? []
  const iLista = (vivo.sheetNames ?? []).findIndex((n) => /^list$/i.test(String(n)))
  const lista = folhas[iLista === -1 ? 1 : iLista] ?? []
  const carimbo = String(folhas[(vivo.sheetNames ?? []).findIndex((n) => /last update/i.test(String(n)))]?.[0]?.[0] ?? '')

  const corte = new Date(Date.now() - DIAS * 86400_000).toISOString().slice(0, 10)
  const nossas = (dados.polls ?? []).filter((p) => p.campoFim >= corte)
  // ⚠️ Casa a rodada por CASA + DATA, com tolerância de 1 dia, porque o
  // agregador e o índice às vezes anotam o fim de campo com um dia de
  // diferença para a MESMA onda. Casar só por casa esconderia rodada
  // faltando de casa que já temos, e é o sentido em que o conferidor cala.
  const temosRodada = (casa, iso) => {
    const d = new Date(iso + 'T00:00:00Z').getTime()
    return nossas.some(
      (p) => normalizar(p.instituto) === casa && Math.abs(new Date(p.campoFim + 'T00:00:00Z').getTime() - d) <= 86400000,
    )
  }
  const nossasCasas = new Set(nossas.map((p) => normalizar(p.instituto)))

  const deles = []
  for (const l of lista.slice(1)) {
    const cel = l?.[1]
    const txt = cel && typeof cel === 'object' ? (cel.value ?? '') : cel
    const p = lerRotulo(txt)
    if (!p || p.campoFim < corte) continue
    const casa = normalizar(p.casaCompleta || p.casa)
    deles.push({ ...p, casaNorm: casa, temos: temosRodada(casa, p.campoFim) })
  }

  console.log(`\n🔎 AGREGADOR NA FONTE x NOSSA BASE  [USO INTERNO, nao publicar]`)
  console.log(`   fonte: ${FONTE_HUMANA}`)
  console.log(`   dado : ${BASE_LIVE}${CHAVE_GENERIC_BALLOT}  (${carimbo || 'sem carimbo'})`)
  console.log(`   janela de ${DIAS} dias, desde ${corte}`)
  console.log(`\n   nossa base: ${nossas.length} linha(s) · agregador: ${deles.length} rodada(s) na mesma janela`)

  const faltando = deles.filter((x) => !x.temos && !FORA_POR_DESENHO.some((re) => re.test(x.casa)))
  const excluidas = deles.filter((x) => !x.temos && FORA_POR_DESENHO.some((re) => re.test(x.casa)))

  if (faltando.length) {
    console.log(`\n🔴 ${faltando.length} rodada(s) que o agregador tem e a nossa base NAO:`)
    for (const f of faltando) {
      const noArquivo = (dados.polls ?? []).some((p) => normalizar(p.instituto) === f.casaNorm)
      console.log(`      ${f.campoFim}  ${f.casaNorm.padEnd(28)} ${String(f.amostra ?? '?').padStart(5)} ${f.recorte ?? '??'}   ${noArquivo ? 'a casa existe no arquivo' : '🔴 a casa NAO tem UMA linha no arquivo'}`)
      console.log(`                 «${f.rotulo.slice(0, 74)}»`)
    }
  } else {
    console.log(`\n✅ nenhuma rodada do agregador falta na nossa base, nesta janela.`)
  }

  if (excluidas.length) {
    console.log(`\n   ⏭️  ${excluidas.length} fora por DESENHO (tracker pago): ${excluidas.map((x) => x.casaNorm).join(', ')}`)
  }

  console.log(`\n   ⛔ NADA foi ingerido. Saber que falta rodada nao autoriza ler no instituto:`)
  console.log(`      isso muda a PROCEDENCIA da media e segue decisao do Andre, casa por casa.`)
  console.log(`   📌 E o "EM COMPASSO" do agregadores-us-polls compara a PONTA, nao a contagem:`)
  console.log(`      base e agregador podem ter a mesma data mais recente e o MEIO da janela`)
  console.log(`      cheio de buraco, que e exatamente o que este conferidor existe para ver.\n`)

}

// ⚠️ Só roda quando CHAMADO, nunca quando importado: o teste importa `lerRotulo`
//    daqui, e sem esta guarda importar o módulo dispararia a leitura na rede e a
//    impressão do relatório inteiro no meio da saída do teste. Foi o que
//    aconteceu em 19/Set/2026, e um teste que sai à internet para rodar não
//    serve para CI.
const chamadoDireto = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (chamadoDireto) {
  main().catch((e) => {
    console.error(`❌ NAO MEDIU: ${e?.message ?? e}`)
    process.exit(1)
  })
}
