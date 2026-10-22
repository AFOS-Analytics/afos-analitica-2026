/**
 * CASAS CUJO INSTRUMENTO FOI MEDIDO COMO OUTRO, e por isso não devem rodada
 * a esta média.
 *
 * ─── A PERGUNTA ─────────────────────────────────────────────────────────────
 *
 * O `exposicao.mjs` projeta as rodadas que faltam pela CADÊNCIA da casa: se ela
 * publica a cada sete dias e está calada há vinte e dois, ela "deve" três. A
 * conta está certa para uma casa que segue medindo a mesma coisa, e **errada
 * para uma casa que trocou a pergunta**. Rodada de outro instrumento não é
 * devida a esta média, e somá-la desloca um número interno que ninguém
 * questiona porque ele parece aritmética.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE, e a data importa ──────────────────────────
 *
 * 🔴 Isto foi DIAGNOSTICADO em 15/Set/2026 e não foi CONSERTADO. A ficha
 *    daquele dia escreveu, com estas palavras, que "o custo não era só de
 *    frase" e que a exposição "cobrava da YouGov 07/Set e 14/Set e somava as
 *    duas na linha servida D+5.36 · com as que faltam D+4.66". O conserto
 *    ficou na memória e nunca chegou ao código.
 *
 * ⚠️ Em 22/Set/2026 a mesma casa estava com **três** ondas seguidas medidas
 *    como NOMINAIS (campo 4-8, 11-14 e 18-21/Set), e a exposição seguia
 *    cobrando três rodadas dela, movendo a linha de D+7.00 para D+6.56.
 *
 * ─── O QUE ESTE ARQUIVO NÃO É ───────────────────────────────────────────────
 *
 * ⛔ Não é heurística e não é opinião: cada entrada nasce de uma medição do
 *    `conferir-instrumento-us.mjs`, que lê o PDF da casa e casa a ressalva da
 *    pergunta. A entrada guarda a data da medição e o documento, para poder ser
 *    conferida e para PODER SER DESFEITA.
 *
 * ⛔ Não exclui a casa da média nem do índice. A média serve o que o índice
 *    tem; isto só impede que a casa seja COBRADA por rodadas que ela não deve.
 *
 * ⚠️ E não é permanente. Casa que volta ao generic ballot volta a dever
 *    rodada, e a entrada sai daqui. Instrumento é propriedade da ONDA, não da
 *    casa, e tratá-lo como permanente é o erro simétrico do que ele conserta.
 */

import { serieDaCasa } from './casas.mjs'

const FORMA_ISO = /^\d{4}-\d{2}-\d{2}$/

/**
 * 🏷️ O TIPO do instrumento, DECLARADO, criado em 16/Out/2026.
 *
 * 🔴 POR QUE EXISTE. O `deveRodada` montava o motivo com a frase SOLDADA
 *    "cédula com nomes do distrito", porque as duas primeiras casas do registro
 *    eram as duas nominais. Em 16/Out entrou a AP-NORC, cujo problema é OUTRO:
 *    ela não pergunta em quem o eleitor votaria, pergunta qual partido ele
 *    PREFERE que controle a Câmara. Declará-la sem tipo faria o conferidor
 *    imprimir o rótulo errado sobre a exclusão certa, que é o defeito que esta
 *    casa persegue em todo lugar: o valor certo com a etiqueta errada.
 *
 * ⛔ Não existe padrão aqui de propósito. Entrada com tipo não declarado NÃO é
 *    excluída: ela segue na média e o `conferirRegistro` a acusa. A direção do
 *    erro se escolhe pela consequência, e o lado que PUBLICA é o que exclui
 *    rodada por um motivo que ninguém sabe dizer.
 */
export const TIPOS = {
  NOMINAL: 'cédula com os NOMES dos candidatos do distrito do entrevistado, e não a pergunta genérica',
  PREFERENCIA_DE_CONTROLE: 'preferência de qual partido deve CONTROLAR a casa, e não em quem o eleitor votaria no distrito dele',
}

/**
 * @type {Record<string, { tipo: keyof typeof TIPOS, desde: string, medidoEm: string, ondas: string[], ressalva: string, prova: string }>}
 */
export const INSTRUMENTO_TROCADO = {
  'The Economist/YouGov': {
    // 🔑 `desde` é o INÍCIO DO CAMPO da primeira onda nominal, não o fim.
    //
    // A cadência projeta SLOTS (a cada sete dias sobre o último campo
    // indexado), e um slot cai DENTRO da onda que o preenche. Medido em
    // 22/Set/2026: datando pelo fim do campo (08/Set), o slot de 07/Set
    // continuava sendo cobrado, e a onda que o preenche é justamente a de
    // campo 4 a 8/Set, que é nominal. Datar pelo fim cobra a casa por uma
    // rodada que ela publicou com outro instrumento.
    tipo: 'NOMINAL',
    desde: '2026-09-04',
    medidoEm: '2026-09-22',
    // 📌 A onda de 25 a 28/Set foi conferida na fonte em 29/Set/2026, no tab
    //    report da própria casa: é a pergunta 46, "2026 Congressional Vote", com
    //    a mesma nota de rodapé, e os Likely Voters saem D 53% x R 38%. Ela NÃO
    //    está no nosso índice; entrou aqui porque o agregador a publica DENTRO
    //    da média de generic ballot dele, e sem este registro o conferidor de
    //    cobertura a contava como buraco NOSSO.
    ondas: ['2026-09-04 a 2026-09-08', '2026-09-11 a 2026-09-14', '2026-09-18 a 2026-09-21', '2026-09-25 a 2026-09-28'],
    ressalva: 'Asked using the names of candidates running in the respondent’s district of residence',
    prova: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econtoplines_87cqd96.pdf',
    provaOndaRecente: 'https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_CCphJ5Q.pdf',
  },
  'Pew Research Center': {
    // 🔴 A SEGUNDA casa a trocar de instrumento, medida em 09/Out/2026 no
    // relatório da própria Pew, e o caso é gêmeo do da Economist/YouGov.
    //
    // A pergunta é a `CONG`, "If the November elections for the U.S. House of
    // Representatives were being held today, would you vote for...", e as opções
    // são "Rep/Lean Rep candidate in your district" e "Dem/Lean Dem candidate in
    // your district". A nota de rodapé 12 do documento diz o resto.
    //
    // ⚠️ A GENÉRICA sobrevive só como EXCEÇÃO declarada: Alasca e partes da
    // Louisiana, onde o distrito pode ter dois candidatos do mesmo partido;
    // Missouri, por disputa judicial sobre o mapa; distritos em que um lado não
    // tem adversário; e 1 (um) eleitor cujo distrito não foi identificado.
    // Exceção por distrito não faz a onda voltar a ser generic ballot.
    //
    // 📊 PREÇO, medido: a onda entrou em 09/Out com D+8.00 sobre n=3.917 RV e
    // levou a média de D+7.57 para D+7.59. Excluindo-a, a média fica em D+7.58
    // sobre 45 rodadas. O deslocamento é pequeno e isso não é o argumento: a
    // média tem de medir o que ela diz medir, e o tamanho da amostra não muda a
    // pergunta que foi feita.
    //
    // 🔑 A onda de JULHO fica, e é por isso que o corte é por ONDA: a nota diz
    // "in the October 2026 survey", ou seja a troca é desta onda. A de 06 a
    // 12/Jul (D 43 x R 37) é anterior a `desde` e segue na base.
    //
    // 🕳️ E uma armadilha de leitura que eu quase comprei: procurando "44" e
    // "36" no PDF, o primeiro casamento foi a linha de "Artificial intelligence"
    // numa bateria de IMPORTÂNCIA DE TEMAS, onde 44 é "muito importante" e 36 é
    // "mais ou menos". Os números certos batiam e o objeto era outro. Conferir o
    // RÓTULO DA PERGUNTA, nunca o par de números.
    tipo: 'NOMINAL',
    desde: '2026-09-28',
    medidoEm: '2026-10-09',
    ondas: ['2026-09-28 a 2026-10-04'],
    ressalva:
      'In the October 2026 survey, candidate names were inserted into the response options based on the respondent’s congressional district',
    prova: 'https://www.pewresearch.org/wp-content/uploads/sites/20/2026/10/PP_2026.10.8_midterms_report.pdf',
  },
    'The New York Times/Siena University': {
    // 🔴 A TERCEIRA casa a trocar para cédula NOMINAL, decidida em 22/Out/2026.
    //
    // A nota do EXECUTOR (Siena Research Institute, 21/Out) cita o diretor:
    // "Democrats lead Republicans by 10 points in a Congressional toss-up when
    // we provided the names of every candidate". A nota da onda de SETEMBRO, da
    // mesma casa, diz "Likely Voters Favor the Democratic Candidate for Congress
    // in their District", sem nomes. A troca é desta onda, e a amostra subiu de
    // 1.503 para 3.494 LV, coerente com um desenho por distrito.
    //
    // ⚠️ O que NÃO se leu: o topline e os crosstabs do NYT devolvem 403 ao nosso
    //    leitor (controle positivo: poll.qu.edu e sri.siena.edu em 200), e o
    //    Wayback não tem cópia. A prova é a frase do executor, não a pergunta
    //    lida, e por isso o motivo fica declarado em fonte-conferida.mjs.
    //
    // 📐 E a discordância de números não derruba a prova: a nota fala em 10
    //    pontos e o índice dá 52 x 41 (D+11) entre LV. Diferença calculada antes
    //    de arredondar contra partes já arredondadas dá exatamente esse tipo de
    //    salto de um ponto, o mesmo caso da GBAO de 21/Out.
    //
    // ⏪ Desfaz-se se alguém mostrar que a linha tabulada é uma pergunta
    //    genérica separada: aí a entrada sai daqui e a onda volta à média.
    //
    // 📊 PREÇO, medido com a media() de produção em 22/Out: D+7.71 sobre 32
    //    para D+7.61 sobre 31. O tamanho não é o argumento, como na Pew.
    tipo: 'NOMINAL',
    desde: '2026-10-12',
    medidoEm: '2026-10-22',
    ondas: ['2026-10-12 a 2026-10-19'],
    ressalva: 'Democrats lead Republicans by 10 points in a Congressional toss-up when we provided the names of every candidate',
    prova: 'https://sri.siena.edu/2026/10/21/new-york-times-siena-national-survey/',
  },
/**
   * 🔴 A TERCEIRA casa, e a primeira que NÃO é nominal. Medida em 16/Out/2026.
   *
   * 🧭 Como ela chegou aqui: o passo 7.5 acusou duas rodadas que o agregador
   *    tem e a nossa base não, e esta saiu com a marca mais forte do
   *    conferidor, "a casa NÃO tem UMA linha no arquivo". É verdade, e são
   *    ZERO linhas em 343 rodadas, o que parecia buraco estrutural numa casa de
   *    primeira linha. Aberto o topline, não é buraco nenhum.
   *
   * 🔑 A ÚNICA pergunta do documento sobre o Congresso é a `MT1`, e ela é de
   *    PREFERÊNCIA DE CONTROLE. Os resultados saem sobre os 1.119 ADULTOS:
   *    Câmara D 43 x R 34 x indeciso 22, Senado D 41 x R 36 x indeciso 22.
   *
   * 🔬 E o teste que fecha o veredito é de AUSÊNCIA, medido no texto extraído:
   *    as cadeias `vote for`, `your district`, `if the election` e
   *    `congressional district` aparecem ZERO vez no topline inteiro. Não é que
   *    a pergunta genérica esteja lá com outra forma: ela NÃO ESTÁ.
   *
   * 📊 O agregador publica esta onda como `925 RV, D 47 x R 38`. Os dois lados
   *    desse rótulo não vêm do topline: `925` não aparece UMA vez no documento,
   *    e o 47 x 38 é o subgrupo de eleitores registrados da MESMA MT1, que saiu
   *    na matéria da AP. É a classe do 566 da BGSU, N de recorte lido como N do
   *    estudo, agora sobre uma pergunta que já era outra.
   *
   * ✅ Conclusão: o ÍNDICE ACERTA ao não tabular, e a nossa base não tem buraco
   *    aqui. Sem esta entrada o conferidor seguiria mandando abrir cobertura
   *    nova para uma casa que não mede a nossa pergunta.
   *
   * 🧊 ESCOPO do que foi medido, estreito de propósito: a onda de 08-12/Out.
   *    📌 A mesma tabela traz a MT1 em 06-10/Out/2022 com redação idêntica, o
   *    que sugere que a casa sempre perguntou assim, mas isso é padrão
   *    observado e não medição de cada onda. Se a AP-NORC publicar generic
   *    ballot um dia, a entrada sai daqui, como manda o cabeçalho.
   *
   * ⛔ E isto não julga o agregador: ele inclui o que quiser na média dele. O
   *    que muda aqui é só quem entra na contagem de buraco NOSSO.
   */
  'AP-NORC': {
    tipo: 'PREFERENCIA_DE_CONTROLE',
    desde: '2026-10-08',
    medidoEm: '2026-10-16',
    ondas: ['2026-10-08 a 2026-10-12'],
    ressalva: 'MT1. Thinking about the outcome of this November’s midterm elections, would you prefer to see the Democratic Party or the Republican Party control: The U.S. House of Representatives',
    prova: 'https://apnorc.org/wp-content/uploads/2026/10/October-2026-Topline-Issues.pdf',
  },
}

/**
 * 🔎 A CARGA do registro se confere, no mesmo padrão do `fonte-conferida`.
 *
 * Devolve a lista de problemas, vazia quando está tudo declarado. ⛔ Ela NÃO
 * lança: entrada malformada não pode derrubar a coleta, e também não pode
 * excluir rodada em silêncio. O meio-termo é a entrada ficar INERTE, com a
 * rodada seguindo na média, e esta lista acusando em toda passada.
 */
export function conferirRegistro(registro = INSTRUMENTO_TROCADO) {
  const problemas = []
  for (const [casa, e] of Object.entries(registro ?? {})) {
    if (!e || typeof e !== 'object') {
      problemas.push(`${casa}: entrada vazia`)
      continue
    }
    if (!TIPOS[e.tipo]) problemas.push(`${casa}: tipo ${JSON.stringify(e.tipo)} não está declarado em TIPOS`)
    if (!FORMA_ISO.test(e.desde ?? '')) problemas.push(`${casa}: 'desde' não está em AAAA-MM-DD`)
    if (!FORMA_ISO.test(e.medidoEm ?? '')) problemas.push(`${casa}: 'medidoEm' não está em AAAA-MM-DD`)
    if (!e.ressalva) problemas.push(`${casa}: sem 'ressalva', que é a frase literal da fonte`)
    if (!e.prova) problemas.push(`${casa}: sem 'prova', e conferência sem prova é opinião`)
  }
  return problemas
}

/** A entrada da casa, pela SÉRIE: o rótulo do veículo acha a do executor. */
function buscar(instituto, registro = INSTRUMENTO_TROCADO) {
  const alvo = serieDaCasa(instituto)
  const par = Object.entries(registro ?? {}).find(([casa]) => serieDaCasa(casa) === alvo)
  return par ? par[1] : null
}

/**
 * 🎯 ESTA LINHA MEDE O MESMO INSTRUMENTO QUE A MÉDIA DECLARA MEDIR?
 *
 * 🔴 POR QUE EXISTE, decidido em 26/Set/2026. O registro acima nasceu em
 * 22/Set para a CADÊNCIA parar de cobrar da casa rodadas que ela publicou com
 * outro instrumento. A MÉDIA seguiu incluindo essas mesmas ondas, e o resultado
 * era a casa declarando, com prova e data, que três ondas não são generic
 * ballot, e publicando-as dentro de uma média que se chama generic ballot.
 * Dois medidores da MESMA pergunta discordando dentro de casa.
 *
 * 📊 Medido no dia: as três ondas nominais eram as três maiores margens da
 * janela (D+14, D+12 e D+11) e puxavam a média de D+7,60 para D+7,97.
 *
 * 🔑 O corte é por ONDA e pelo INÍCIO do campo, nunca por casa: a casa segue
 * dentro da média com tudo que é anterior à troca, e de fato segue, pela onda
 * de 31/Ago. Excluir a casa apagaria medição legítima do passado.
 */
export function ehOutroInstrumento(poll, registro = INSTRUMENTO_TROCADO) {
  if (!poll?.campoInicio) return false
  const reg = buscar(poll.instituto, registro)
  // 🏷️ Sem TIPO declarado a entrada é INERTE: a rodada segue na média e quem
  //    reclama é o `conferirRegistro`. Excluir por motivo que ninguém sabe
  //    dizer é o lado do erro que PUBLICA.
  if (!reg || !TIPOS[reg.tipo]) return false
  return poll.campoInicio >= reg.desde
}

/** O motivo e a prova, para a exclusão nunca sair sem dizer por quê. */
export function motivoDoInstrumento(poll, registro = INSTRUMENTO_TROCADO) {
  const reg = buscar(poll?.instituto, registro)
  if (!reg || !ehOutroInstrumento(poll, registro)) return null
  return { tipo: reg.tipo, descricao: TIPOS[reg.tipo], desde: reg.desde, medidoEm: reg.medidoEm, ressalva: reg.ressalva, prova: reg.prova }
}

/**
 * A casa deve rodada a esta média na data pedida?
 *
 * 🔑 A comparação é por ONDA e não por casa: uma casa que trocou o instrumento
 *    em setembro seguia devendo as rodadas de agosto, quando ela media a mesma
 *    coisa. Excluir a casa inteira apagaria buraco real do passado.
 *
 * @param {string} instituto nome da casa, já na forma da série
 * @param {string} dataIso   a data da rodada hipotética, `YYYY-MM-DD`
 */
export function deveRodada(instituto, dataIso, registro = INSTRUMENTO_TROCADO) {
  const reg = buscar(instituto, registro)
  if (!reg) return { deve: true, motivo: null }
  // 🏷️ Tipo não declarado: a casa segue devendo, e o aviso sai separado para
  //    não virar exclusão com rótulo inventado.
  if (!TIPOS[reg.tipo]) return { deve: true, motivo: null, tipoNaoDeclarado: true }
  if (!dataIso || dataIso < reg.desde) return { deve: true, motivo: null }
  return {
    deve: false,
    motivo: `instrumento medido em ${reg.medidoEm} como ${reg.tipo}, ${TIPOS[reg.tipo]}, em campo iniciado desde ${reg.desde}`,
    registro: reg,
  }
}
