/**
 * Classificador de INSTRUMENTO de uma rodada do generic ballot.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * Medido em 15/Set/2026. O `fora-do-indice.mjs` apontou duas rodadas da The
 * Economist/YouGov com campo mais recente do que o índice (4-8/Set e 11-14/Set)
 * e o passo 1 concluiu, com essas palavras:
 *
 *     "📌 o buraco é do ÍNDICE, não das casas"
 *
 * A conclusão não se sustentava, e o motivo é que o detector compara DATA e
 * mais nada. Conferido nos PDFs do próprio instituto:
 *
 *   | onda        | relatório              | pergunta                          |
 *   |-------------|------------------------|-----------------------------------|
 *   | 14-17/Ago   | 1.611 Adult Citizens   | genérica, sem ressalva            |
 *   | 21-24/Ago   | 1.536 Adult citizens   | genérica, sem ressalva            |
 *   | 28-31/Ago   | 1.592 Adult citizens   | genérica, sem ressalva            |
 *   | 4-8/Set     | 1.469 Registered Voters| "Asked using the NAMES of          |
 *   | 11-14/Set   | 1.461 Registered Voters|  candidates running in the        |
 *   |             |                        |  respondent's district"           |
 *
 * ⭐ A casa TROCOU o instrumento em setembro: a cédula deixou de ser genérica e
 * passou a ser NOMINAL, com o eleitor vendo os nomes dos candidatos do próprio
 * distrito. Cédula nominal e cédula genérica não são a mesma medição, e uma
 * média de generic ballot que engole as duas mistura dois instrumentos.
 *
 * 🔑 Ou seja: a Wikipédia pode estar EXCLUINDO essas ondas com razão, e não
 * atrasada. A evidência circunstancial é forte, porque o índice recebeu a CBS
 * News/YouGov de campo 8-11/Set, que é MAIS NOVA que a Economist de 4-8/Set:
 * quem edita o índice estava ativo e mesmo assim não pôs a Economist.
 *
 * ⛔ E o defeito tinha DUAS bocas, porque a conta seguia adiante:
 * `exposicao.mjs` projeta as rodadas devidas pela CADÊNCIA da casa, então ela
 * cobrava da YouGov as rodadas de 07/Set e 14/Set e somava as duas no número
 * que a passada imprime ("servida D+5.36 · com as que faltam D+4.66"). Rodada
 * de outro instrumento não é devida a esta média, e entrar nela como se fosse
 * desloca o número para um lugar que nenhuma medição sustenta.
 *
 * ─── O QUE ELE FAZ, E O QUE ELE NÃO FAZ ─────────────────────────────────────
 *
 * ✅ FAZ: recebe o TEXTO já extraído de um topline ou crosstab e responde uma
 *    pergunta só, "esta rodada mede a mesma coisa que a nossa média mede?".
 *
 * ⛔ NÃO FAZ: não baixa PDF, não roda pdftotext, não lê a nossa base, não
 *    ingere linha nenhuma e não entra no objeto `dados`. Rede e extração ficam
 *    na casca (`scripts/conferir-instrumento-us.mjs`), porque regra que toca a
 *    rede não se testa com caso plantado.
 *
 * ⛔ E ele NÃO decide ingestão. Ingerir muda a procedência da média servida e
 *    segue decisão do André.
 *    Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
 *
 * ─── A REGRA DE FALHA ───────────────────────────────────────────────────────
 *
 * 🔌 Texto vazio, curto demais ou ilegível devolve `INDETERMINADO`, NUNCA
 * `AUSENTE`. "Não achei a pergunta" e "não consegui ler o documento" são
 * coisas diferentes, e confundi-las é a forma mais fácil de transformar um
 * conferidor em verde que ninguém mediu.
 * Ver memory/feedback_o_cliente_devolve_desserializado_e_o_failopen_engoliu.md
 *
 * 🔔 E a ressalva desconhecida NÃO é engolida: qualquer "Asked ..." colado na
 * pergunta sai como `COM_RESSALVA` com o texto dela, para uma pessoa decidir.
 * Um conferidor que se aperta para calar falso positivo vira alarme mudo, e
 * alarme mudo é indistinguível de alarme quebrado.
 * Ver memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */

export const VEREDITOS_INSTRUMENTO = {
  /** pergunta presente e sem ressalva: é a mesma medição da nossa média */
  GENERICO: 'GENERICO',
  /** pergunta presente, mas feita com os NOMES dos candidatos do distrito */
  NOMINAL: 'NOMINAL',
  /** pergunta presente com alguma outra ressalva de quem foi perguntado */
  COM_RESSALVA: 'COM_RESSALVA',
  /** documento legível, e a pergunta não está nele */
  AUSENTE: 'AUSENTE',
  /** não deu para olhar. NUNCA confundir com AUSENTE */
  INDETERMINADO: 'INDETERMINADO',
}

/**
 * Abaixo disto o documento não é documento: é falha de download ou de
 * extração. O menor topline real medido até aqui tem dezenas de milhares de
 * caracteres, então o piso é folgado de propósito.
 */
const MINIMO_DE_TEXTO = 400

/**
 * 🔑 O casamento é pelo NÚCLEO da pergunta, não pela frase inteira.
 *
 * A frase completa é "In the elections for U.S. Congress in November, who will
 * you vote for in the district where you live?". Casar com ela inteira ataria
 * o leitor a "in November", que é do ciclo, e ao ano, que muda. O núcleo
 * "elections for U.S. Congress ... who will you vote for" é o que define a
 * pergunta e sobrevive à troca de ciclo.
 */
const RE_PERGUNTA = /elections?\s+for\s+(?:the\s+)?U\.?\s?S\.?\s+Congress\b[^?]{0,240}?who\s+will\s+you\s+vote\s+for/i

/** O título que o crosstab dá à tabela. Sinal de apoio, não o critério. */
const RE_TITULO_TABELA = /Generic\s+Congressional\s+Vote/i

/**
 * A ressalva vem colada na pergunta, numa linha começada por "Asked".
 *
 * ⚠️ A janela de 260 caracteres não é enfeite. Sem ela, um "Asked of those who
 * aren't voting third-party" da pergunta SEGUINTE seria lido como ressalva
 * desta, e o conferidor fabricaria alarme. Medido no topline de 28-31/Ago, em
 * que a Q18 tem ressalva e a Q17, que é a nossa, não tem.
 */
const JANELA_DA_RESSALVA = 260
const RE_RESSALVA = /\bAsked\s+([^.?]{5,220})/i

/** A ressalva que troca o instrumento, e é a única que tem nome próprio. */
const RE_NOMINAL = /\bnames?\s+of\s+(?:the\s+)?candidates?\b/i

const RE_AMOSTRA = /\b([\d,]{3,9})\s+U\.?\s?S\.?\s+(Registered\s+Voters|Adult\s+Citizens|Likely\s+Voters|Adults)/i
const RE_CONDUZIDA = /\bConducted\s+([A-Z][a-z]+\s+\d{1,2}\s*[-–]\s*(?:[A-Z][a-z]+\s+)?\d{1,2},\s*\d{4})/
/**
 * ⚠️ O crosstab NÃO tem a linha "Conducted": ele só traz o intervalo no
 * cabeçalho, colado no tamanho da amostra. Sem este segundo leitor o campo
 * sairia nulo em metade dos documentos, e campo nulo não casa com a nossa base,
 * então toda onda já ingerida pareceria onda que falta.
 */
const RE_CAMPO_NO_CABECALHO = /([A-Z][a-z]+\s+\d{1,2}\s*[-–]\s*(?:[A-Z][a-z]+\s+)?\d{1,2},\s*\d{4})\s*[-–]\s*[\d,]{3,9}\s+U\.?\s?S\.?\s+(?:Registered|Adult|Likely)/
const RE_MARGEM = /Margin\s+of\s+Error\s*±?\s*([\d.]+)\s*%/i

const ROTULOS = {
  dem: 'The Democratic candidate',
  rep: 'The Republican candidate',
  outro: 'Other',
  naoSei: 'Not sure',
  naoVou: 'I will not vote',
}

/**
 * Normaliza para busca: corre tudo para uma linha só.
 *
 * 🔑 Sem isto o leitor quebraria em documento cuja pergunta embrulha em duas
 * linhas, e embrulhar é decisão do gerador do PDF, não do instituto. O
 * `pdftotext -layout` preserva colunas, então a mesma pergunta sai numa linha
 * num relatório e em duas no outro.
 */
function achatar(texto) {
  return texto.replace(/\s+/g, ' ').trim()
}

/**
 * A ressalva não termina em ponto final: o que vem depois dela é a TABELA.
 *
 * Achatado, "…district of residence" cola em "The Democratic candidate 44% 40%
 * Sex Race Age…", e a ressalva impressa viraria um parágrafo de números. O
 * corte é no primeiro rótulo de resposta ou de coluna, que é onde a frase
 * acaba de fato.
 *
 * ⚠️ Poda é COSMÉTICA e não pode mudar veredito: o classificador decide sobre
 * o texto podado, então o corte nunca pode comer a frase. Por isso ele só
 * corta em rótulo conhecido, e o teto de 200 é rede, não regra.
 */
function podarRessalva(texto) {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  const cortes = [...Object.values(ROTULOS), 'Sex ', 'Total ', 'Unweighted N']
    .map((r) => limpo.indexOf(r))
    .filter((i) => i > 0)
  const fim = cortes.length ? Math.min(...cortes) : limpo.length
  return limpo.slice(0, Math.min(fim, 200)).replace(/[\s,;:]+$/, '')
}

function primeiroPercentual(trecho, rotulo) {
  const i = trecho.indexOf(rotulo)
  if (i < 0) return null
  const depois = trecho.slice(i + rotulo.length, i + rotulo.length + 220)
  const m = depois.match(/(\d{1,3}(?:\.\d)?)\s*%/)
  return m ? Number(m[1]) : null
}

/**
 * Classifica o instrumento de UM documento.
 *
 * @param {string} texto  texto já extraído do PDF (pdftotext -layout)
 * @returns {{veredito: string, motivo: string, pergunta: string|null,
 *            ressalva: string|null, amostra: object|null, campo: string|null,
 *            margemErro: number|null, numeros: object|null, tituloDeTabela: boolean}}
 */
export function classificarInstrumento(texto, opts = {}) {
  const { minimoDeTexto = MINIMO_DE_TEXTO } = opts

  const vazio = {
    veredito: VEREDITOS_INSTRUMENTO.INDETERMINADO,
    motivo: '',
    pergunta: null,
    ressalva: null,
    amostra: null,
    campo: null,
    campoIso: null,
    margemErro: null,
    numeros: null,
    tituloDeTabela: false,
  }

  if (typeof texto !== 'string' || texto.trim().length < minimoDeTexto) {
    const tamanho = typeof texto === 'string' ? texto.trim().length : 0
    return {
      ...vazio,
      motivo: `texto com ${tamanho} caractere(s), abaixo do piso de ${minimoDeTexto}: download ou extracao falhou, NAO e "pergunta ausente"`,
    }
  }

  const plano = achatar(texto)

  const mAmostra = plano.match(RE_AMOSTRA)
  const mCampo = plano.match(RE_CONDUZIDA) ?? plano.match(RE_CAMPO_NO_CABECALHO)
  const mMargem = plano.match(RE_MARGEM)
  const campo = mCampo ? mCampo[1].replace(/\s+/g, ' ') : null
  const ficha = {
    amostra: mAmostra ? { n: Number(mAmostra[1].replace(/,/g, '')), tipo: mAmostra[2].replace(/\s+/g, ' ') } : null,
    campo,
    campoIso: campoParaIso(campo),
    margemErro: mMargem ? Number(mMargem[1]) : null,
    tituloDeTabela: RE_TITULO_TABELA.test(plano),
  }

  const mPergunta = plano.match(RE_PERGUNTA)
  if (!mPergunta) {
    return {
      ...vazio,
      ...ficha,
      veredito: VEREDITOS_INSTRUMENTO.AUSENTE,
      motivo: 'documento legivel e a pergunta de voto para o Congresso NAO esta nele',
    }
  }

  const fim = mPergunta.index + mPergunta[0].length
  const depois = plano.slice(fim, fim + JANELA_DA_RESSALVA)
  const mRessalva = depois.match(RE_RESSALVA)
  const ressalva = mRessalva ? podarRessalva(`Asked ${mRessalva[1]}`) : null

  const numeros = {}
  for (const [k, rotulo] of Object.entries(ROTULOS)) {
    numeros[k] = primeiroPercentual(plano.slice(fim, fim + 1400), rotulo)
  }
  numeros.soma = Object.entries(numeros)
    .filter(([k]) => k !== 'soma')
    .reduce((s, [, v]) => (typeof v === 'number' ? s + v : s), 0)

  const base = { ...ficha, pergunta: mPergunta[0].replace(/\s+/g, ' '), ressalva, numeros }

  if (!ressalva) {
    return {
      ...base,
      veredito: VEREDITOS_INSTRUMENTO.GENERICO,
      motivo: 'pergunta presente e sem ressalva colada: mesma medicao da nossa media',
    }
  }
  if (RE_NOMINAL.test(ressalva)) {
    return {
      ...base,
      veredito: VEREDITOS_INSTRUMENTO.NOMINAL,
      motivo: 'cedula NOMINAL: o eleitor viu os NOMES dos candidatos do distrito dele, e isso nao e generic ballot',
    }
  }
  return {
    ...base,
    veredito: VEREDITOS_INSTRUMENTO.COM_RESSALVA,
    motivo: 'pergunta presente com ressalva de quem foi perguntado: precisa de olho humano, nao se decide sozinho',
  }
}

const MESES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
}

/**
 * "September 11 - 14, 2026" → { inicio: '2026-09-11', fim: '2026-09-14' }
 *
 * 🔑 Existe para uma coisa só: casar o documento do instituto com o que a
 * NOSSA base já tem, que guarda `campoInicio` e `campoFim` em ISO. Comparar
 * "September 11 - 14, 2026" com "2026-09-11" por texto daria sempre diferente,
 * e "diferente" seria lido como "rodada que falta".
 *
 * ⚠️ Trata a virada de mês, que é onde a conta ingênua erra: em
 * "August 31 - September 3, 2026" o dia final pertence a OUTRO mês.
 */
export function campoParaIso(texto) {
  if (typeof texto !== 'string') return null
  const t = texto.replace(/\s+/g, ' ').trim()

  // ⚠️ O `\s*` antes da vírgula não é zelo: o `pdftotext` de tabela com coluna
  // estreita devolve "September 4 - 8 , 2026". Sem ele o campo sairia nulo, e
  // campo nulo é campo que não casa com a base, ou seja, onda já ingerida
  // pareceria onda que falta.
  const dois = t.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*([A-Za-z]+)\s+(\d{1,2})\s*,\s*(\d{4})$/,
  )
  if (dois) {
    const m1 = MESES[dois[1].toLowerCase()]
    const m2 = MESES[dois[3].toLowerCase()]
    if (!m1 || !m2) return null
    const ano = Number(dois[5])
    // Virada de ANO: dezembro para janeiro começa no ano anterior.
    const anoInicio = m2 < m1 ? ano - 1 : ano
    return { inicio: iso(anoInicio, m1, Number(dois[2])), fim: iso(ano, m2, Number(dois[4])) }
  }

  const um = t.match(/^([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*(\d{1,2})\s*,\s*(\d{4})$/)
  if (um) {
    const m = MESES[um[1].toLowerCase()]
    if (!m) return null
    const ano = Number(um[4])
    return { inicio: iso(ano, m, Number(um[2])), fim: iso(ano, m, Number(um[3])) }
  }

  const soUm = t.match(/^([A-Za-z]+)\s+(\d{1,2})\s*,\s*(\d{4})$/)
  if (soUm) {
    const m = MESES[soUm[1].toLowerCase()]
    if (!m) return null
    const d = iso(Number(soUm[3]), m, Number(soUm[2]))
    return { inicio: d, fim: d }
  }

  return null
}

function iso(ano, mes, dia) {
  if (!(ano > 1900) || !(mes >= 1 && mes <= 12) || !(dia >= 1 && dia <= 31)) return null
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

/**
 * ⚖️ A leitura de uma LISTA de documentos da mesma casa.
 *
 * Devolve `comparaveis`, `naoComparaveis` e `naoConcluidos` separados, porque
 * somar os três daria um total que esconde exatamente a distinção que este
 * arquivo existe para fazer.
 */
export function classificarLote(documentos, opts = {}) {
  const resultados = (documentos ?? []).map((d) => ({
    rotulo: d.rotulo ?? d.url ?? '(sem rotulo)',
    url: d.url ?? null,
    ...classificarInstrumento(d.texto, opts),
  }))

  const ehComparavel = (r) => r.veredito === VEREDITOS_INSTRUMENTO.GENERICO
  const ehNaoComparavel = (r) =>
    r.veredito === VEREDITOS_INSTRUMENTO.NOMINAL || r.veredito === VEREDITOS_INSTRUMENTO.AUSENTE

  return {
    resultados,
    comparaveis: resultados.filter(ehComparavel),
    naoComparaveis: resultados.filter(ehNaoComparavel),
    // ⚠️ COM_RESSALVA e INDETERMINADO ficam JUNTOS aqui de proposito: os dois
    // querem a mesma coisa, que e uma pessoa olhar. Nenhum dos dois conta como
    // comparavel, e nenhum dos dois conta como descartado.
    naoConcluidos: resultados.filter((r) => !ehComparavel(r) && !ehNaoComparavel(r)),
  }
}
