/**
 * atribuicao.mjs · a única implementação da pergunta que a régua do generic
 * ballot faz antes de qualquer verbo de movimento: **o que mudou foi a intenção
 * de voto ou foi o conjunto?**
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 04/Set/2026. A média foi de D+6.07 para
 * D+5.69, uma queda de 0,38pp, com ZERO pesquisa nova: a John Zogby Strategies,
 * campo 04-05/Ago e D+11.00, saiu pela borda quando o dia UTC virou. O
 * `conferir-us-polls.mjs` já dizia isso, e dizia certo naquele dia.
 *
 * 🕳️ MAS DIZIA POR SORTE, e o ponto cego foi medido no mesmo dia. Ele comparava
 * o CONJUNTO DE NOMES de instituto, `mediaAfos.institutos`, e nome de casa não é
 * rodada. Caso plantado sobre o arquivo real de 04/Set: uma onda NOVA da
 * The Economist/YouGov, campo 28/Ago, entra na média e a leva de D+5.69 a
 * D+5.93. Como a YouGov já estava no conjunto e o campo mais recente do arquivo
 * seguia sendo 31/Ago, a régua antiga imprimia:
 *
 *     entraram (ninguém) · saíram (ninguém) · campo PARADO
 *     ⚠️ ZERO informação nova. Escrever verbo de movimento aqui é falso.
 *
 * Ou seja: no dia em que uma pesquisa DE VERDADE entrou, o portão mandava
 * escrever o contrário. Falso negativo que produz frase falsa, que é a família
 * de defeito que este projeto mais persegue.
 *
 * ✅ O conserto tem duas metades e as duas são necessárias:
 *   1. `collect.mjs` passou a gravar QUAIS rodadas entraram, em
 *      `mediaAfos.incluidas`, e não só quantas. Sem isso a atribuição só se
 *      obtinha reexecutando o coletor, e reexecutar é medir de novo, não
 *      conferir. Regra que depende de um número que ninguém grava não roda.
 *   2. A comparação passou a ser por RODADA, o par instituto + fim de campo.
 *
 * 📌 Uma cópia só, aqui. O `conferir-us-polls.mjs` importa daqui em vez de ter
 * a sua própria versão da regra. Duas cópias convivem sem incidente até o dia em
 * que uma é corrigida e a outra não, que foi o que custou os rótulos de faixa do
 * mercado em 29/Jul.
 */

import { serieDaCasa } from './casas.mjs'
import { vantagemDeProducao } from './collect.mjs'

/**
 * A identidade de uma rodada é o par instituto + fim de campo.
 *
 * ⚠️ NÃO usar só o instituto. A The Economist/YouGov publica toda semana e em
 * 04/Set aparecia QUATRO vezes na mesma janela, com quatro campos diferentes.
 * Foi exatamente esse o defeito do comparador de deltas do Brasil, achado horas
 * antes no mesmo dia: a chave era a pergunta, e a mesma pergunta existe nos três
 * livros.
 */
export const chaveDe = (x) => `${x.instituto}|${x.campoFim}`

/**
 * 🧬 A mesma rodada, pela SÉRIE da casa. Serve para separar RENOMEAÇÃO de
 * rodada nova, e foi instalada em 25/Set/2026 porque sem ela o portão mentia.
 *
 * 🔴 Naquele dia a tabela de casas canônicas passou a valer na média e cinco
 * curadas se aposentaram. O comparador leu 4 saídas e 1 entrada e devolveu
 * "PESQUISA_NOVA + borda-rolou", que é a frase que a régua manda escrever como
 * "entrou pesquisa nova e a borda rolou". Nada tinha entrado e nada tinha
 * rolado: um rótulo mudou e três casas pararam de ser contadas duas vezes.
 */
export const chaveSerie = (x) => `${serieDaCasa(x.instituto)}|${x.campoFim}`

/** Uma rodada mudou se o recorte escolhido ou algum dos dois valores mudou. */
export function mudou(a, b) {
  return a.dem !== b.dem || a.rep !== b.rep || (a.amostraTipo ?? null) !== (b.amostraTipo ?? null)
}

/**
 * @param {Array} antes    `incluidas` da base
 * @param {Array} depois   `incluidas` de agora
 * @param {Array} excluidas `excluidasPorInstrumento` de agora, para uma saída
 *   explicada pela regra de instrumento não ser lida como borda rolando.
 */
export function comparar(antes, depois, excluidas = [], auditoriaIndeciso = []) {
  const A = new Map((antes ?? []).map((x) => [chaveDe(x), x]))
  const D = new Map((depois ?? []).map((x) => [chaveDe(x), x]))
  const entraram0 = [...D.values()].filter((x) => !A.has(chaveDe(x)))
  const sairam0 = [...A.values()].filter((x) => !D.has(chaveDe(x)))
  const mudaram0 = [...D.values()]
    .filter((x) => A.has(chaveDe(x)) && mudou(A.get(chaveDe(x)), x))
    .map((x) => ({ antes: A.get(chaveDe(x)), depois: x }))

  // 0.5) 🎚️ TROCA DE PAINEL: a rodada continua a mesma e o número mudou porque a
  //      NOSSA escolha de tratamento do indeciso passou a servir outro painel da
  //      mesma onda. Sem esta classe o veredito diz CORRECAO, cuja leitura
  //      prescrita é "a origem foi corrigida", e isso é falso: o índice não
  //      mexeu em nada.
  //
  //      ⚠️ É a TERCEIRA vez que esta forma aparece. A primeira foi COMPOSICAO
  //      dizendo "saiu gente pela borda" quando quem saiu foi a elegibilidade, e
  //      virou EXCLUIDA_POR_INSTRUMENTO em 26/Set/2026. A régua que fica:
  //      quando a RÉGUA muda o número, o veredito não pode nomear o MUNDO.
  //
  //      A assinatura é a auditoria que a própria `media()` já produziu, e não
  //      uma segunda leitura do registro aqui: o valor declarado é o de depois e
  //      não era o de antes.
  const declarado = new Map(
    (auditoriaIndeciso ?? []).map((a) => [`${a.serie}|${a.campoFim}`, a.declarado]),
  )
  const ehOPainelEscolhido = (x) => {
    const d = declarado.get(`${chaveSerie(x)}`)
    return !!d && x.dem === d.dem && x.rep === d.rep
  }
  const trocaDePainel = mudaram0.filter((p) => ehOPainelEscolhido(p.depois) && !ehOPainelEscolhido(p.antes))
  const mudaram = mudaram0.filter((p) => !(ehOPainelEscolhido(p.depois) && !ehOPainelEscolhido(p.antes)))

  // 1) RENOMEAÇÃO: saiu sob um rótulo e entrou sob outro, mesma casa e mesma
  //    onda. É par 1 para 1, e some das duas listas.
  const renomeadas = []
  const entraram = [...entraram0]
  const sairam = []
  for (const x of sairam0) {
    const i = entraram.findIndex((y) => chaveSerie(y) === chaveSerie(x))
    if (i < 0) sairam.push(x)
    else renomeadas.push({ antes: x, depois: entraram.splice(i, 1)[0] })
  }

  // 1.5) EXCLUÍDA POR INSTRUMENTO: saiu porque a regra de instrumento passou a
  //      tirá-la, e não porque a janela rolou. Sem esta classe o veredito diria
  //      COMPOSICAO, cuja leitura prescrita é "saiu gente pela borda", que é
  //      falso: a rodada continua na janela e deixou de ser elegível.
  const chavesFora = new Set((excluidas ?? []).map(chaveSerie))
  const excluidasPorInstrumento = sairam.filter((x) => chavesFora.has(chaveSerie(x)))
  const sairamAinda = sairam.filter((x) => !chavesFora.has(chaveSerie(x)))
  sairam.length = 0
  sairam.push(...sairamAinda)

  // 2) DEDUPLICAÇÃO: saiu e a casa CONTINUA na média, na mesma onda, sob outro
  //    rótulo que já estava lá antes. A rodada não saiu da janela: ela parou de
  //    ser contada duas vezes.
  const serieDepois = new Set((depois ?? []).map(chaveSerie))
  const deduplicadas = sairam.filter((x) => serieDepois.has(chaveSerie(x)))
  const sairamMesmo = sairam.filter((x) => !serieDepois.has(chaveSerie(x)))

  // 3) ⛔ E O SENTIDO INVERSO NÃO SE CALA. Entrou uma rodada cuja casa JÁ tinha
  //    rodada naquela onda: isso é a casa passando a ser contada duas vezes, que
  //    é o defeito de 25/Set nascendo de novo. Silenciar aqui, por simetria com
  //    o item 2, esconderia exatamente o que este medidor existe para achar.
  const serieAntes = new Set((antes ?? []).map(chaveSerie))
  const duplicaram = entraram.filter((x) => serieAntes.has(chaveSerie(x)))
  const entraramMesmo = entraram.filter((x) => !serieAntes.has(chaveSerie(x)))

  return {
    entraram: entraramMesmo,
    sairam: sairamMesmo,
    mudaram,
    renomeadas,
    deduplicadas,
    duplicaram,
    excluidasPorInstrumento,
    trocaDePainel,
  }
}

/**
 * A média que as linhas produzem, para conferir contra a que o arquivo declara.
 *
 * 🔢 DELEGA a `vantagemDeProducao`, que é a casa ÚNICA da convenção de
 * arredondamento desde 29/Set/2026: arredonda `dem` e `rep` a duas casas e só
 * então subtrai, para quem subtrair os dois números da tela chegar ao terceiro.
 *
 * 🔴 CONSERTADO em 03/Out/2026, e o defeito era latente. Esta função tinha a
 * convenção INLINE, reescrita aqui, o que é exatamente o que a régua de 29/Set
 * proíbe ao dizer "nenhum medidor recomputa a média: importa essa função". A
 * régua nasceu porque a mesma conta, duplicada, divergiu em UM CENTÉSIMO, que é
 * o tamanho que não dispara portão nenhum.
 *
 * ✅ Medido antes de trocar: as duas implementações concordaram em `dem`, `rep`
 * e `vantagemDem` nos **597 subconjuntos** contíguos das rodadas do arquivo
 * real de 03/Out, ou seja a troca não move número nenhum hoje. O que ela tira é
 * a chance de divergirem amanhã, quando uma for corrigida e a outra não.
 * Ver memory/feedback_duas_copias_da_mesma_regra.md
 */
export function mediaDe(linhas) {
  if (!linhas || linhas.length === 0) return null
  const v = vantagemDeProducao(linhas)
  if (!v) return null
  return { ...v, n: linhas.length }
}

/**
 * 🔑 O veredito.
 *
 * - COMPOSICAO: nada entrou e nada foi corrigido, só saiu gente pela borda da
 *   janela. Escrever "a média caiu" aqui é falso, e é o erro que a régua nomeia.
 * - PESQUISA_NOVA: entrou rodada nova. Aí sim há leitura nova do eleitorado,
 *   ainda que misturada com a rolagem da borda.
 * - CORRECAO: alguma rodada que já estava mudou de valor ou de recorte, ou seja
 *   a origem foi corrigida. Vale investigar antes de narrar.
 * - RENOMEACAO: a mesma onda da mesma casa trocou de rótulo. Não é leitura
 *   nova do eleitorado e não é correção da origem.
 * - DEDUPLICACAO: a casa parou de ser contada duas vezes na mesma onda. A média
 *   pode mexer, e o que mexeu foi a CONTAGEM, não a intenção de voto.
 * - 🔴 DUPLICOU: a casa passou a ser contada duas vezes. É o defeito de
 *   25/Set/2026 nascendo outra vez, e o lugar de olhar é a tabela de casas.
 * - EXCLUIDA_POR_INSTRUMENTO: a rodada continua na janela e deixou de ser
 *   elegível, porque a onda foi medida como outro instrumento. A média mexe, e
 *   o que mexeu foi a RÉGUA, não o eleitorado nem a borda.
 * - 🎚️ TROCA_DE_PAINEL: a rodada é a mesma e o número mudou porque a NOSSA
 *   escolha de tratamento do indeciso passou a servir outro painel da mesma
 *   onda. ⛔ Não é CORRECAO: a origem não mexeu em nada. É a régua, de novo.
 * - PARADO: conjunto idêntico e média idêntica.
 * - INCONSISTENTE: conjunto idêntico e a média mexeu. O lugar de olhar é o
 *   coletor, não o mundo.
 */
export function veredito({ entraram, sairam, mudaram, renomeadas, deduplicadas, duplicaram, excluidasPorInstrumento, trocaDePainel }, deltaPp) {
  const rotulos = []
  if (duplicaram?.length) rotulos.push('DUPLICOU')
  if (entraram.length) rotulos.push('PESQUISA_NOVA')
  if (mudaram.length) rotulos.push('CORRECAO')
  if (sairam.length && !entraram.length && !mudaram.length) rotulos.push('COMPOSICAO')
  else if (sairam.length) rotulos.push('borda-rolou')
  if (renomeadas?.length) rotulos.push('RENOMEACAO')
  if (deduplicadas?.length) rotulos.push('DEDUPLICACAO')
  if (excluidasPorInstrumento?.length) rotulos.push('EXCLUIDA_POR_INSTRUMENTO')
  if (trocaDePainel?.length) rotulos.push('TROCA_DE_PAINEL')
  if (!rotulos.length) rotulos.push(Math.abs(deltaPp ?? 0) > 0.001 ? 'INCONSISTENTE' : 'PARADO')
  return rotulos
}

/**
 * A conta de atribuição fecha? Soma de antes, menos as que saíram, mais as que
 * entraram, mais o efeito das correções, tem de dar a soma de depois.
 *
 * Devolve a lista de inconsistências, vazia quando fecha.
 */
export function conferirSubtracao(antes, depois, d) {
  const soma = (ls, k) => (ls ?? []).reduce((s, x) => s + x[k], 0)
  const delta = (ls, k) => (ls ?? []).reduce((s, m) => s + m.depois[k] - m.antes[k], 0)
  const problemas = []
  for (const k of ['dem', 'rep']) {
    // 🔑 Todas as SETE listas entram, e é isso que impede a classificação nova de
    // virar um lugar onde uma saída se esconde: quem sai da média, saia pela
    // borda ou por deduplicação, tem de aparecer na subtração.
    //
    // ⚠️ E foi aqui que a `trocaDePainel` cobrou, em 05/Out/2026, no mesmo dia em
    // que nasceu: classificá-la em `comparar` e listá-la em `CAUSAS_DA_VARIACAO`
    // não bastou, porque esta função tem a sua PRÓPRIA aritmética. Sem a linha
    // dela a conta de `dem` saiu 1778 prevista contra 1774 real. É a terceira
    // vez que a casa paga por caminho que recomputa sem receber o registro novo.
    // Ver memory/feedback_duas_copias_da_mesma_regra.md
    const previsto =
      soma(antes, k) -
      soma(d.sairam, k) -
      soma(d.deduplicadas, k) -
      soma(d.excluidasPorInstrumento, k) +
      soma(d.entraram, k) +
      soma(d.duplicaram, k) +
      delta(d.mudaram, k) +
      delta(d.renomeadas, k) +
      delta(d.trocaDePainel, k)
    const real = soma(depois, k)
    if (Math.abs(previsto - real) > 1e-9) problemas.push({ campo: k, previsto, real })
  }
  return problemas
}

/**
 * ⚖️ O PESO DE CADA CAUSA, quando o veredito acende mais de uma.
 *
 * ─── A PERGUNTA QUE ESTE BLOCO RESPONDE ─────────────────────────────────────
 *
 * O `veredito` acima diz QUAIS causas acenderam. Ele não diz, e a régua do
 * generic ballot pede, a única coisa que decide a frase: **de qual delas veio o
 * deslocamento?**
 *
 * 🔴 POR QUE EXISTE, medido em 03/Out/2026. O veredito saiu
 * `PESQUISA_NOVA + borda-rolou` e a variação foi de −0,06pp. A leitura natural
 * de "as duas causas" é que elas pesam parecido. Não pesavam: a borda valeu
 * −0,01pp e a rodada nova valeu −0,05pp, ou seja **cinco sextos do movimento
 * eram a pesquisa nova**. E em 02/Out o veredito foi o MESMO par, com a conta
 * feita à mão na hora de escrever o relato. Conta refeita à mão toda passada é
 * a esteira que esta casa já pagou várias vezes.
 * Ver memory/feedback_ferramenta_pronta_e_nenhum_comando_a_chama.md
 *
 * ─── POR QUE DUAS ORDENS, E NÃO UM NÚMERO ───────────────────────────────────
 *
 * Atribuição depende da ORDEM em que as causas são aplicadas, e isso não é
 * detalhe: tirar a borda primeiro e depois somar a entrada dá um número, e o
 * inverso dá outro. Então cada causa sai com DUAS medidas, e a diferença entre
 * elas é a própria ambiguidade:
 *
 *   `sozinha`   aplicada ANTES de todas, sobre a base
 *   `porUltimo` aplicada DEPOIS de todas, isto é o final menos o final sem ela
 *
 * ⚠️ `meio` é a média das duas, e com DUAS causas ela é exata e fecha com o
 * total. Com três ou mais ela é aproximação, e por isso `interacao` sai sempre
 * declarada: ela é o total menos a soma dos meios, e é o tamanho do que a
 * decomposição NÃO explica. ⛔ `fecha: false` quer dizer que nenhum número por
 * causa é honesto, e a frase tem de citar a faixa.
 *
 * ─── AS TRÊS TRAVAS ANTI-SILÊNCIO ───────────────────────────────────────────
 *
 * 1. causa que acendeu NUNCA sai da lista, nem quando o peso dela é 0,00pp:
 *    peso zero é achado, porque é a causa que o relato ia citar e não devia;
 * 2. cenário que ficaria com ZERO rodada sai `indeterminado`, e não 0,00pp:
 *    média de lista vazia não existe, e chamá-la de zero é inventar medida;
 * 3. `ordemImporta` acende quando as duas ordens discordam OU quando a
 *    interação sobra, e aí o relato não pode usar número único.
 */
const CAUSAS_DA_VARIACAO = [
  { nome: 'entraram', tipo: 'adiciona' },
  { nome: 'duplicaram', tipo: 'adiciona' },
  { nome: 'sairam', tipo: 'remove' },
  { nome: 'deduplicadas', tipo: 'remove' },
  { nome: 'excluidasPorInstrumento', tipo: 'remove' },
  { nome: 'mudaram', tipo: 'troca' },
  { nome: 'renomeadas', tipo: 'troca' },
  { nome: 'trocaDePainel', tipo: 'troca' },
]

/** Meio centésimo: abaixo disso a discordância não existe no número publicado. */
export const TOLERANCIA_DE_ORDEM = 0.005

const semEstas = (lista, itens) => {
  const fora = new Set(itens.map(chaveDe))
  return lista.filter((x) => !fora.has(chaveDe(x)))
}

/** A causa aplicada sobre a lista de ANTES. */
function aplicar(lista, causa, itens) {
  if (causa.tipo === 'adiciona') return [...lista, ...itens]
  if (causa.tipo === 'remove') return semEstas(lista, itens)
  return [...semEstas(lista, itens.map((p) => p.antes)), ...itens.map((p) => p.depois)]
}

/** A causa DESFEITA sobre a lista de DEPOIS. */
function desfazer(lista, causa, itens) {
  if (causa.tipo === 'adiciona') return semEstas(lista, itens)
  if (causa.tipo === 'remove') return [...lista, ...itens]
  return [...semEstas(lista, itens.map((p) => p.depois)), ...itens.map((p) => p.antes)]
}

/**
 * @param {Array} antes  `incluidas` da base
 * @param {Array} depois `incluidas` de agora
 * @param {object} d     o retorno de `comparar`
 */
export function decompor(antes, depois, d) {
  const mA = mediaDe(antes)
  const mD = mediaDe(depois)
  if (!mA || !mD || !d) return null
  const total = Number((mD.vantagemDem - mA.vantagemDem).toFixed(2))
  const causas = []
  for (const c of CAUSAS_DA_VARIACAO) {
    const itens = d[c.nome] ?? []
    if (!itens.length) continue
    const mSozinha = mediaDe(aplicar(antes, c, itens))
    const mSemEla = mediaDe(desfazer(depois, c, itens))
    if (!mSozinha || !mSemEla) {
      causas.push({
        causa: c.nome,
        n: itens.length,
        indeterminado: true,
        motivo: 'o cenário sem esta causa fica com ZERO rodada, e média de lista vazia não existe',
      })
      continue
    }
    const sozinha = Number((mSozinha.vantagemDem - mA.vantagemDem).toFixed(2))
    const porUltimo = Number((mD.vantagemDem - mSemEla.vantagemDem).toFixed(2))
    causas.push({
      causa: c.nome,
      n: itens.length,
      sozinha,
      porUltimo,
      faixa: [Math.min(sozinha, porUltimo), Math.max(sozinha, porUltimo)],
      meio: Number(((sozinha + porUltimo) / 2).toFixed(3)),
    })
  }
  const medidas = causas.filter((c) => !c.indeterminado)
  const somaDosMeios = Number(medidas.reduce((s, c) => s + c.meio, 0).toFixed(3))
  const interacao = Number((total - somaDosMeios).toFixed(3))
  const discordam = medidas.filter((c) => Math.abs(c.sozinha - c.porUltimo) > TOLERANCIA_DE_ORDEM)
  return {
    total,
    causas,
    somaDosMeios,
    interacao,
    indeterminadas: causas.filter((c) => c.indeterminado).map((c) => c.causa),
    ordemImporta: discordam.length > 0 || Math.abs(interacao) > TOLERANCIA_DE_ORDEM,
    fecha: Math.abs(interacao) <= TOLERANCIA_DE_ORDEM,
  }
}
