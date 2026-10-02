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
import { serieDaCasa } from '../lib/us-polls/casas.mjs'
import { deveRodada } from '../lib/us-polls/instrumento-medido.mjs'

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
  // 🔴 A NOTA DO AGREGADOR NÃO É PARTE DO NOME, e ela entrava na CHAVE DE
  //    CASAMENTO. Régua de 25/Set/2026.
  //
  // O `normalizar()` passa OS DOIS LADOS pela tabela de apelidos. Casa que tem
  // apelido converge; casa que NÃO tem passa intacta nos dois lados, e aí o lado
  // do agregador carrega a nota e o nosso não: `"Emerson College (A+)"` nunca é
  // igual a `"Emerson College"`. Efeito medido no dia: o conferidor imprimiu
  // 9 rodadas faltando e, para 6 delas, "🔴 a casa NAO tem UMA linha no
  // arquivo", com as 6 no arquivo e com a data de campo exata.
  //
  // ⚠️ É o MESMO defeito de 20/Set, e o conserto de então foi o sintoma:
  //    adicionaram-se três apelidos. Apelido conserta uma casa; a nota volta a
  //    abrir o buraco em TODA casa nova que o índice receber, o que faz deste um
  //    falso alarme que se renova sozinho. E falso buraco alto é caro: ele manda
  //    caçar no instituto rodada que já está escrita, e ingerir o que não falta
  //    troca amostra por escolha.
  //
  // 📐 A regra é `[A-F]` com sinal opcional, e ela é EXATA na origem, medida em
  //    125 rótulos: as notas são A+ A A- B+ B B- C+ C- D, e todo parêntese
  //    informativo tem 3 letras ou mais (Economist, CBS, BGSU, Amherst,
  //    Verasight, Harvard, Dem, GOP). Por isso o qualificador sobrevive e só a
  //    nota sai.
  //
  // 🔑 O `(D)` era o único ambíguo, e a origem o resolve: em
  //    `"McLaughlin (D), 1000 LV (GOP)"` o mesmo rótulo traz o `(D)` na posição
  //    da nota E o `(GOP)` como filiação. O `(D)` é a nota D que o agregador dá
  //    à casa, não uma alegação de partido.
  const semNota = resto.replace(/\s*\((?:[A-F][+-]?)\)/g, '')
  // ⚠️ O nome CURTO perde o qualificador entre parênteses: "YouGov (CBS)" vira
  // "YouGov" e deixa de casar com a CBS News/YouGov que JÁ temos, inflando o
  // buraco. A tabela de apelidos tem de ver o rótulo INTEIRO, e o nome curto
  // fica só para exibição.
  const casa = semNota.split(/\s*\(|,/)[0].trim()
  const casaCompleta = semNota.split(',')[0].trim()
  // 🔴 O recorte sai do MESMO casamento que a amostra, e isso não é elegância:
  //    o rótulo traz a NOTA da casa entre parênteses, e "(A+)" casa com `\bA\b`
  //    porque "(" e "+" não são caractere de palavra. Medido em 19/Set/2026: a
  //    NYT/Siena, que é "1503 LV", saía como recorte **A**, e a Quinnipiac, que
  //    é "970 RV", também. Nota A+ ou A- em qualquer casa produzia o mesmo erro.
  //
  // ✅ Com a nota removida do rótulo, o LIMITE que ficou declarado em 19/Set
  //    FECHOU: "Casa (A+), sem numero" não tem mais nenhum `A` para a varredura
  //    solta achar, e o recorte sai NULO em vez de sair "A" inventado. O caso
  //    real era a Strength In #s, que o agregador publica sem amostra e que saía
  //    como recorte A enquanto o índice a traz como LV.
  const comAmostra = semNota.match(/([\d,]{3,7})\s*(LV|RV|A)\b/i)
  const amostra = comAmostra?.[1]?.replace(/,/g, '') ?? null
  // Sem amostra no rótulo não há âncora, e aí a varredura solta é o que sobra:
  // ela vale menos, e por isso só roda nesse caso.
  const recorte = (comAmostra?.[2] ?? (semNota.match(/\b(LV|RV|A)\b/i) || [])[1])?.toUpperCase() ?? null
  // 🔑 O INÍCIO do campo sai do mesmo rótulo ("Sep 25 - 28") e existe porque a
  //    régua de instrumento data a onda pelo INÍCIO, nunca pelo fim. Datar pelo
  //    fim cobra a casa por uma onda que ela publicou com outro instrumento, e é
  //    o defeito que `instrumento-medido.mjs` declara ter corrigido em 22/Set.
  //    Sem este campo, a chamada a `deveRodada` cairia no `campoFim` em silêncio
  //    e repetiria o erro para toda onda que atravessa a data de corte.
  const diaIni = Number(m[2])
  return {
    campoInicio: Number.isFinite(diaIni) ? `2026-${String(mesIni).padStart(2, '0')}-${String(diaIni).padStart(2, '0')}` : null,
    campoFim: `2026-${String(mesFim).padStart(2, '0')}-${String(diaFim).padStart(2, '0')}`,
    casa,
    amostra: amostra ? Number(amostra) : null,
    casaCompleta,
    recorte,
    rotulo: s,
  }
}

/**
 * 🧬 A ASSINATURA DA RODADA É CAMPO + AMOSTRA + RECORTE, e NÃO o nome.
 *
 * 🔴 Régua de 02/Out/2026, e ela já existia na casa: o `duplicata-de-rodada.mjs`
 *    diz, com todas as letras, que a assinatura é campo mais amostra mais
 *    recorte "e nunca o nome, que é a coisa sob suspeita". Este conferidor
 *    casava SÓ por nome, e por isso o mesmo defeito reapareceu aqui.
 *
 * 📌 O caso: o agregador escreve `Nat Res./Impact Res.` e o índice escreve
 *    `Impact Research (D)/National Research Inc. (R)`. Mesma onda (16-21/Set),
 *    mesma amostra (1.500) e mesmo recorte (RV), com as duas firmas em ordem
 *    INVERTIDA e abreviadas. Nenhuma tabela de apelido razoável casa isso, e a
 *    assinatura casa de primeira.
 *
 * ⚠️ E o comentário do bloco de APELIDOS já tinha previsto a esteira: "apelido
 *    conserta uma casa; o buraco volta a abrir em TODA casa nova". Três dias
 *    depois de a Clarity entrar na tabela, apareceram DUAS novas. Apelido é
 *    sintoma; assinatura é a regra.
 *
 * ⛔ A assinatura exige os TRÊS campos. Sem amostra ou sem recorte no rótulo
 *    ela NÃO opina, e o casamento por nome volta a ser a única resposta: duas
 *    casas diferentes com a mesma data colidiriam sozinhas, que é a mesma
 *    anti-excesso que o `duplicata-de-rodada.mjs` aplica.
 */
export const pertoNoDia = (a, b) =>
  Math.abs(new Date(a + 'T00:00:00Z').getTime() - new Date(b + 'T00:00:00Z').getTime()) <= 86400000

export function assinaturaBate(rodadaDeles, nossas) {
  if (!rodadaDeles || !Array.isArray(nossas)) return false
  const { campoFim, amostra, recorte } = rodadaDeles
  if (!campoFim || amostra == null || recorte == null) return false
  return nossas.some(
    (n) =>
      n &&
      n.campoFim &&
      pertoNoDia(n.campoFim, campoFim) &&
      Number(n.amostra) === Number(amostra) &&
      String(n.amostraTipo ?? '').toUpperCase() === String(recorte).toUpperCase()
  )
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
  // 🔑 O "(D)" que o agregador cola nesta casa é a NOTA D dele, não um rótulo de
  //    partido: em 25/Set/2026 o rótulo dela saía como "McLaughlin (D), 1000 LV
  //    (GOP)", com a filiação num parêntese SEPARADO e no fim. A versão anterior
  //    deste comentário lia o "(D)" como alegação de partido e a refutava, e era
  //    defesa contra uma afirmação que a origem nunca fez. O nosso índice grava
  //    "(R)", McLaughlin & Associates é casa republicana, e os dois concordam.
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
  // 🔴 29/Set/2026. O agregador escreve o nome CURTO, "Clarity Campaign", e o
  //    índice escreve "Clarity Campaign Labs (D)". O conferidor imprimiu
  //    "🔴 a casa NAO tem UMA linha no arquivo" sobre uma casa que tem CINCO
  //    rodadas nossas, a mais recente de 22/Jul. O rótulo errado é mais caro que
  //    o buraco: "buraco de rodada" manda conferir uma onda, e "casa inteira
  //    ausente" manda abrir cobertura nova para uma casa que já está coberta.
  [/clarity campaign/i, 'Clarity Campaign Labs (D)'],
  // 🔴 As três de 25/Set/2026. Elas entraram no índice na mesma semana e o
  //    conferidor as imprimia como buraco porque o NOME difere entre os dois
  //    lados, não porque a rodada falte. Remover a nota resolveu Emerson,
  //    Echelon e CNN/SSRS, que passaram a casar sozinhas; estas três precisam de
  //    apelido de verdade.
  [/marist/i, 'Marist'],
  [/hart research|hart\/pos|public opinion strategies/i, 'Hart/POS'],
  // ⛔ O apelido é por "strength in", NUNCA por "verasight": o agregador também
  //    publica "Wave Polling (Verasight)", que é casa DIFERENTE, e um apelido por
  //    verasight fundiria as duas séries.
  [/strength in/i, 'Strength In Numbers/Verasight'],
  [/quinnipiac/i, 'Quinnipiac'],
  [/ipsos/i, 'Reuters/Ipsos'],
  [/cygnal/i, 'Cygnal'],
  [/morning consult/i, 'Morning Consult'],
  [/activote/i, 'Activote'],
  [/honest/i, 'The Honest Poll'],
]
// 🧬 O apelido mapeia o rótulo do AGREGADOR para o nosso, e a série mapeia o
// rótulo do ÍNDICE para o nosso: as duas pontas compõem, e compor evita que o
// alvo escrito aqui seja uma terceira cópia da escolha de nome. Instalado em
// 26/Set/2026, quando a canônica da Focaldata foi invertida.
const normalizar = (casa) => serieDaCasa((APELIDOS.find(([re]) => re.test(casa)) || [null, casa])[1])

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
  const perto = pertoNoDia

  const temosRodada = (p) =>
    nossas.some((n) => normalizar(n.instituto) === p.casaNorm && n.campoFim && perto(n.campoFim, p.campoFim)) ||
    assinaturaBate(p, nossas)
  const nossasCasas = new Set(nossas.map((p) => normalizar(p.instituto)))

  const deles = []
  for (const l of lista.slice(1)) {
    const cel = l?.[1]
    const txt = cel && typeof cel === 'object' ? (cel.value ?? '') : cel
    const p = lerRotulo(txt)
    if (!p || p.campoFim < corte) continue
    const casa = normalizar(p.casaCompleta || p.casa)
    const comCasa = { ...p, casaNorm: casa }
    deles.push({ ...comCasa, temos: temosRodada(comCasa) })
  }

  console.log(`\n🔎 AGREGADOR NA FONTE x NOSSA BASE  [USO INTERNO, nao publicar]`)
  console.log(`   fonte: ${FONTE_HUMANA}`)
  console.log(`   dado : ${BASE_LIVE}${CHAVE_GENERIC_BALLOT}  (${carimbo || 'sem carimbo'})`)
  console.log(`   janela de ${DIAS} dias, desde ${corte}`)
  console.log(`\n   nossa base: ${nossas.length} linha(s) · agregador: ${deles.length} rodada(s) na mesma janela`)

  const ausentes = deles.filter((x) => !x.temos && !FORA_POR_DESENHO.some((re) => re.test(x.casa)))
  const excluidas = deles.filter((x) => !x.temos && FORA_POR_DESENHO.some((re) => re.test(x.casa)))

  // 🎯 A RODADA QUE A NOSSA RÉGUA RECUSA NÃO É BURACO NOSSO, régua de 29/Set/2026.
  //
  // 🔴 O caso. O conferidor imprimiu "3 rodada(s) que o agregador tem e a nossa
  //    base NAO" e SEIS dias de atraso na ponta, e as três, abertas na fonte
  //    primária, eram:
  //
  //      · The Economist/YouGov 25-28/Set, 1003 LV, D 53 x R 38. É a pergunta 46
  //        do tab report, com a nota "Asked using the names of candidates running
  //        in the respondent's district of residence". CÉDULA COM NOMES, que é o
  //        instrumento que este registro recusa desde 04/Set, com prova e data.
  //      · Angus Reid 19-25/Set, D 56 x R 40. É o recorte "Registered AND
  //        decided", n=919 e não os 1.041 que o agregador etiquetou, e o mesmo
  //        documento traz D 42 x R 32 na base cheia e D 45 x R 34 com leaners.
  //      · Clarity Campaign 11-16/Set. Esta sim é rodada nossa que falta.
  //
  // 📒 A CLARITY FOI ATRÁS NA FONTE em 29/Set, e o beco fica gravado para
  //    ninguém repetir a caçada, no mesmo padrão da CNN/SSRS:
  //
  //      página : https://www.claritycampaigns.com/clarity-omnibus-2026-september
  //      PDF    : go.claritycampaigns.com/hubfs/Omnibus Surveys/
  //               Clarity Omnibus Overview - Sept 2026 - public.pdf   (HTTP 200)
  //
  //    ✅ O documento CONFIRMA três dos quatro campos: campo de **11 a 16 de
  //       setembro**, **1.046 respondentes** casados com o cadastro eleitoral, e
  //       o recorte **LV**, porque ele diz que os pesos vão para "a national
  //       universe of likely 2026 General election voters". Ainda traz a margem
  //       de **±3,03%**, que o agregador não dá.
  //
  //    🔴 E ele NÃO TRAZ O TOPLINE. As palavras `ballot`, `vote for`, `congress`
  //       e `midterm` não aparecem UMA vez no documento: ele é o overview público
  //       de metodologia e de inventário de modelos. Os percentuais que existem
  //       ali são dos modelos (partidarismo, ansiedade econômica), não de
  //       intenção de voto.
  //
  //    ⛔ Portanto o D 50 x R 43 existe SÓ no agregador, e não foi promovido a
  //       conferido. É a mesma dívida da Emerson/RealClear: o topline que a casa
  //       não publica. Ingerir por aqui trocaria a procedência de "índice mais
  //       curadoria conferida na fonte" por "agregador", e isso é decisão do
  //       André, declarada, e não efeito colateral de uma passada.
  //
  // 📊 O PREÇO de tratar as três como buraco: a média iria de D+7.58 a D+8.00,
  //    e a única que é mesmo generic ballot leva a D+7.57. Ou seja, TODO o
  //    movimento vinha de instrumento e NENHUM do eleitorado.
  //
  // 🔑 `deveRodada` já existia, já é chamada pela cadência e declara isto com
  //    prova. Este conferidor não a chamava. É a mesma família de "ferramenta
  //    pronta e nenhum comando a chama": a resposta estava na casa e a decisão
  //    não a lia.
  //
  // ⛔ Isto NÃO julga o que o agregador faz: ele pode incluir o que quiser na
  //    média dele, e a nossa mede outra coisa, declarada. O que muda aqui é só
  //    quem entra na CONTAGEM de buraco NOSSO.
  const recusadas = []
  const faltando = []
  for (const x of ausentes) {
    // Pelo INÍCIO do campo. Sem ele, declarar em vez de cair no fim calado.
    if (!x.campoInicio) {
      faltando.push({ ...x, semInicio: true })
      continue
    }
    const d = deveRodada(x.casaNorm, x.campoInicio)
    if (d.deve) faltando.push(x)
    else recusadas.push({ ...x, motivo: d.motivo })
  }

  if (faltando.length) {
    console.log(`\n🔴 ${faltando.length} rodada(s) que o agregador tem e a nossa base NAO:`)
    for (const f of faltando) {
      // 🔴 "A CASA NÃO TEM UMA LINHA" é a afirmação mais forte deste conferidor e
      //    a que mais errou: ela manda abrir cobertura nova para uma casa que já
      //    está coberta. Em 02/Out ela saiu em 3 de 3, e DUAS eram falso alarme.
      //
      // 📌 Antes de dizê-la, procura o nome da casa como PEDAÇO do nosso nome e
      //    o contrário também: `The Argument` do agregador contra o
      //    `The Argument/Verasight` do índice. Isso NÃO decide se a rodada falta,
      //    que é outra pergunta e já foi respondida: decide só o rótulo.
      //
      // ⛔ Comparação por pedaço é frouxa de propósito AQUI e em lugar nenhum
      //    mais: ela nunca entra no casamento de rodada, onde juntaria séries de
      //    casas distintas. Aqui o custo de errar é mandar conferir uma casa que
      //    existe, e o de não ter nada é mandar abrir cobertura que já existe.
      const casaCrua = String(f.casaNorm).toLowerCase()
      const nomesNossos = [...new Set((dados.polls ?? []).map((p) => String(p.instituto).toLowerCase()))]
      const noArquivo =
        nomesNossos.includes(casaCrua) ||
        nomesNossos.some((n) => normalizar(n) === f.casaNorm) ||
        nomesNossos.some((n) => n.startsWith(casaCrua) || casaCrua.startsWith(n))
      console.log(`      ${f.campoFim}  ${f.casaNorm.padEnd(28)} ${String(f.amostra ?? '?').padStart(5)} ${f.recorte ?? '??'}   ${noArquivo ? 'a casa existe no arquivo' : '🔴 a casa NAO tem UMA linha no arquivo'}`)
      console.log(`                 «${f.rotulo.slice(0, 74)}»`)
    }
  } else {
    console.log(`\n✅ nenhuma rodada do agregador falta na nossa base, nesta janela.`)
  }

  if (recusadas.length) {
    console.log(`\n   🎯 ${recusadas.length} rodada(s) do agregador que a NOSSA RÉGUA recusa, e que por isso NÃO são buraco:`)
    for (const r of recusadas) {
      console.log(`      ${r.campoFim}  ${r.casaNorm.padEnd(28)} ${String(r.amostra ?? '?').padStart(5)} ${r.recorte ?? '??'}`)
      console.log(`                 ${r.motivo}`)
    }
    console.log(`      ⛔ Ingerir uma destas trocaria o instrumento da média sem trocar o nome dela.`)
  }

  if (excluidas.length) {
    console.log(`\n   ⏭️  ${excluidas.length} fora por DESENHO (tracker pago): ${excluidas.map((x) => x.casaNorm).join(', ')}`)
  }

  // ── A PONTA VIVA, e por que ela precisa sair daqui ────────────────────────
  //
  // 🔴 Medido em 21/Set/2026. O `agregadores-us-polls.mjs` leu a tabela de
  //    agregadores da Wikipédia, onde quatro deles declaravam campo até
  //    2026-09-17, igual à nossa base, e deu `EM COMPASSO` com "diferença de 0
  //    dia(s) NA PONTA". No MESMO instante este conferidor, que lê o dado vivo
  //    do agregador, trazia Reuters/Ipsos com campo até 2026-09-20 e Quantus
  //    até 2026-09-18.
  //
  // 🔑 As duas leituras não se contradizem por defeito de nenhuma das duas: a
  //    tabela da Wikipédia é uma CÓPIA e envelhece. O ponto é que um veredito
  //    de "0 dias na ponta" contra uma cópia velha se lê como base em dia, e
  //    aqui a ponta do mundo estava três dias à frente.
  //
  // ⛔ Por isso este bloco NÃO julga a nossa base: ele publica a ponta que ELE
  //    viu, para que o veredito do outro medidor possa ser confrontado em vez
  //    de aceito. Dois medidores da mesma pergunta que nunca se comparam é
  //    como o vão nasce.
  const pontaDeles = deles.length ? deles.map((x) => x.campoFim).sort().at(-1) : null
  const pontaNossa = nossas.length ? nossas.map((p) => p.campoFim).filter(Boolean).sort().at(-1) : null
  console.log(`\n   📍 PONTA, pelo dado VIVO do agregador`)
  console.log(`      agregador: ${pontaDeles ?? '(sem rodada na janela)'}   ·   nossa base: ${pontaNossa ?? '(sem campo legivel)'}`)
  if (pontaDeles && pontaNossa) {
    const dias = Math.round((Date.parse(pontaDeles) - Date.parse(pontaNossa)) / 86400000)
    if (dias > 0) {
      console.log(`      🔴 o agregador esta ${dias} dia(s) A FRENTE da nossa base NA PONTA.`)
      console.log(`         ⚠️ Se o agregadores-us-polls disser EM COMPASSO nesta mesma rodada, ele`)
      console.log(`            mediu contra a tabela da Wikipedia, que e COPIA e envelhece. Vale esta.`)
      // 🎯 A PONTA PODE SER DE UMA RODADA QUE A NOSSA RÉGUA RECUSA, 29/Set/2026.
      //    Naquele dia a ponta do agregador era a onda NOMINAL da Economist/YouGov
      //    e o atraso saía como 6 dias. Pela ponta que a nossa régua aceita, era 3.
      //    Atraso que só existe contra instrumento que não medimos manda correr
      //    atrás de rodada que não deveríamos ter.
      //    ⚠️ E o filtro tem de tirar TAMBÉM o que sai por DESENHO. Na primeira
      //       versão desta linha, no mesmo dia, ela devolveu 26/Set e 4 dias de
      //       atraso, e a rodada de 26/Set era a Morning Consult, tracker pago que
      //       a nossa base nunca vai ter. Ponta que inclui o que nunca ingerimos é
      //       atraso que não fecha nem com a base perfeita.
      const pontaAceita = deles
        .filter((x) => !FORA_POR_DESENHO.some((re) => re.test(x.casa)))
        .filter((x) => !x.campoInicio || deveRodada(x.casaNorm, x.campoInicio).deve)
        .map((x) => x.campoFim)
        .sort()
        .at(-1)
      if (pontaAceita && pontaAceita !== pontaDeles) {
        const d2 = Math.round((Date.parse(pontaAceita) - Date.parse(pontaNossa)) / 86400000)
        console.log(`         🎯 pela ponta ALCANCAVEL, sem o que sai por desenho e sem o que a regua recusa,`)
        console.log(`            ela e ${pontaAceita} e o atraso e ${d2} dia(s), contra os ${dias} da linha acima.`)
      }
    } else if (dias < 0) {
      console.log(`      ✅ a nossa base esta ${-dias} dia(s) a frente do agregador na ponta.`)
    } else {
      console.log(`      ✅ mesma data na ponta.`)
    }
  } else {
    console.log(`      ⚠️ INDETERMINADO: falta uma das duas pontas. Nao e "em compasso".`)
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
