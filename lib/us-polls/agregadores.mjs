/**
 * ÍNDICE x MUNDO: o campo mais recente que os AGREGADORES declaram, contra o da
 * nossa base.
 *
 * 🔴 POR QUE EXISTE, medido em 13/Set/2026.
 *
 * O coletor imprimia "atraso da fonte: 13 dia(s)" e nenhum medidor da casa
 * sabia dizer DE QUEM era o atraso. São duas frases com consequências opostas:
 *
 *   a) ninguém mediu nada desde 31/Ago     → a base está certa e completa
 *   b) mediram, e o índice não recebeu     → a base está certa e INCOMPLETA
 *
 * O `atraso.mjs` mede a ponta da base e é cego a essa diferença. O
 * `check-us-polls-defasagem.mjs` responde casa por casa, e naquele dia deixou 2
 * de 8 sem veredicto e 3 como "sem item do tema". Nenhum dos dois cobre as
 * casas que não estão no registro.
 *
 * A resposta estava no próprio host que já lemos. O artigo da Câmara na
 * Wikipédia tem uma seção de AGREGADORES (Decision Desk HQ, RealClearPolitics,
 * Silver Bulletin, VoteHub, FiftyPlusOne, Race to the WH), e cada linha declara
 * o intervalo de campo das pesquisas que entraram na média dela. Em 13/Set seis
 * de seis diziam "até 11/Set" e a nossa base dizia 31/Ago. Aquilo foi lido UMA
 * vez à mão, em 24/Ago (ver o cabeçalho do `atraso.mjs`), e nunca virou medidor.
 *
 * 🔑 O QUE A LEITURA PROVA, E O QUE NÃO PROVA.
 *   Prova EXISTÊNCIA: se um agregador declara campo até 11/Set, existe ao menos
 *   uma pesquisa com campo terminando em 11/Set. Isso vale mesmo que a tabela
 *   dele esteja velha, porque data que já existiu não deixa de existir.
 *   NÃO prova quais pesquisas, nem de que casa, nem o valor delas.
 *
 * ⛔ NADA DAQUI ENTRA NA MÉDIA. Média de agregador não é pesquisa, e a regra da
 *    casa (`procedencia.agregadoresIgnorados` no `collect.mjs`) continua valendo.
 *    Aqui se lê SÓ a data de campo, nunca o percentual.
 *
 * ⛔ E NADA DAQUI SE PUBLICA. "O índice está 11 dias atrás dos agregadores" é
 *    fato sobre a NOSSA coleta, não sobre a eleição, e por isso não entra no
 *    objeto `dados`, que o cron grava no Neon e o site serve em público.
 *    Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 *
 * ⛔ E ELE NÃO ABRE A INGESTÃO. Saber que o índice está atrasado não autoriza
 *    ler rodada no instituto: isso muda a procedência da média e é decisão do
 *    André, por casa (`decididoEm` no `collect.mjs`).
 *    Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
 *
 * 🧪 Casos plantados em `scripts/testar-agregadores-us.mjs`.
 */

import { UA } from './collect.mjs'

export const ARTIGO_AGREGADORES = '2026 United States House of Representatives elections'
export const URL_AGREGADORES_RAW =
  `https://en.wikipedia.org/wiki/${ARTIGO_AGREGADORES.replace(/ /g, '_')}?action=raw`
export const SECAO = 'GenericBallotAgg'

/**
 * Campo até 3 dias de distância é compasso. Agregador e índice recebem a mesma
 * pesquisa em dias diferentes, e o que se compara aqui é FIM DE CAMPO com fim de
 * campo, então a tolerância só precisa absorver a diferença de ritmo entre as
 * duas páginas, não o intervalo entre campo e divulgação.
 */
export const TOLERANCIA_DIAS = 3

/**
 * Tabela de agregadores sem atualização há mais que isto não serve para dizer
 * EM COMPASSO: dois parados concordam entre si e isso não prova nada. Para
 * dizer ÍNDICE ATRASADO ela continua servindo, porque ali o que se usa é
 * existência de data, e data não envelhece.
 */
export const TABELA_VELHA_DIAS = 7

/** Um agregador sozinho pode ter erro de digitação. A referência exige dois. */
export const MIN_AGREGADORES = 2

/**
 * 🔴 O QUE ESTE MEDIDOR ALCANÇA: a PONTA da base, nunca a CONTAGEM.
 *
 * Ele compara uma data só, a do campo mais recente. Medido em 15/Set/2026: o
 * índice recebeu a CBS News/YouGov com campo até 11/Set, os seis agregadores
 * declaravam 11/Set, e o veredito saiu EM COMPASSO, com 0 dia de diferença. No
 * mesmo arquivo, a listagem da Economist/YouGov declarava uma rodada de 4 a 8/Set
 * que o índice não tinha, e a exposição da média contava 8 rodadas faltando
 * dentro da janela. A ponta chegou; o miolo, não.
 *
 * "Em compasso" lido sem esse alcance vira "a base está completa", que é o
 * número certo para a pergunta errada, a mesma família dos três medidores de
 * 13/Set. Por isso todo veredito com referência carrega `alcance: 'PONTA'` e o
 * motivo diz "na ponta". Quem responde pela CONTAGEM é o passo 1 do polls:usa
 * (listagens das casas e exposição).
 */
export const ALCANCES = { PONTA: 'PONTA' }

export const VEREDITOS = {
  ATRASADO: 'INDICE ATRASADO',
  COMPASSO: 'EM COMPASSO',
  A_FRENTE: 'BASE A FRENTE',
  INCONCLUSIVO: 'INCONCLUSIVO',
}

const MESES = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}
const DIA_MS = 86_400_000

const pad = (n) => String(n).padStart(2, '0')
const mesDe = (nome) => MESES[String(nome).slice(0, 3).toLowerCase()] ?? null

function isoValida(ano, mes, dia) {
  if (!ano || !mes || !dia) return null
  const d = new Date(Date.UTC(ano, mes - 1, dia))
  // 31 de setembro vira 1º de outubro no Date. Isso é data ilegível, não outra data.
  if (d.getUTCFullYear() !== ano || d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) return null
  return `${ano}-${pad(mes)}-${pad(dia)}`
}

/** Tira do texto da célula tudo que não é o texto visível. */
export function limparCelula(bruto) {
  let s = String(bruto ?? '')
  s = s.replace(/<ref[^>]*\/>/gi, '')
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
  s = s.replace(/\{\{efn[^}]*\}\}/gi, '')
  // Atributo de célula ANTES do conteúdo: `style="..." |texto` ou `colspan=2 |texto`.
  // Só quando a célula COMEÇA com atributo, porque `[[Nate Silver|Silver Bulletin]]`
  // também tem uma barra e não é atributo.
  s = s.replace(/^\s*(?:[a-z-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s|]+)\s*)+\|(?!\|)/i, '')
  // `{{Party shading/Democratic}} |'''48.6%'''`: a predefinição é atributo.
  s = s.replace(/^\s*\{\{[^}]*\}\}\s*\|(?!\|)/, '')
  s = s.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
  s = s.replace(/\[\[([^\]]*)\]\]/g, '$1')
  s = s.replace(/\{\{nowrap\|([^}]*)\}\}/gi, '$1')
  s = s.replace(/'{2,}/g, '')
  s = s.replace(/&nbsp;| /g, ' ')
  s = s.replace(/&ndash;|&mdash;|\{\{snd\}\}|\{\{ndash\}\}/gi, '–')
  return s.replace(/\s+/g, ' ').trim()
}

/** "September 11, 2026" → "2026-09-11". Tudo que não for data inteira devolve null. */
export function lerData(texto) {
  const m = String(texto ?? '').trim().match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2}),\s*(\d{4})$/)
  if (!m) return null
  return isoValida(Number(m[3]), mesDe(m[1]), Number(m[2]))
}

/**
 * O FIM de um intervalo de campo, nas formas que a tabela usa:
 *   "January 9, 2025 – September 11, 2026"
 *   "August 16 – September 11, 2026"
 *   "September 2–11, 2026"
 *   "September 11, 2026"
 *
 * ⚠️ A célula tem de ser SÓ o intervalo. Texto a mais devolve null em vez de
 * garimpar uma data no meio, porque garimpar foi o que já fez um leitor da casa
 * pegar o `access-date` de uma referência como se fosse dado.
 */
export function fimDoIntervalo(texto) {
  const partes = String(texto ?? '').split(/\s*[–—-]\s*/)
  if (partes.length > 2) return null
  const fim = partes[partes.length - 1].trim()

  const inteira = lerData(fim)
  if (inteira) return inteira

  // "11, 2026": o mês está no começo do intervalo.
  const soDia = fim.match(/^(\d{1,2}),\s*(\d{4})$/)
  if (soDia && partes.length === 2) {
    const inicio = partes[0].trim().match(/^([A-Za-z]{3,9})\.?\s+\d{1,2}$/)
    if (!inicio) return null
    return isoValida(Number(soDia[2]), mesDe(inicio[1]), Number(soDia[1]))
  }
  return null
}

/** O trecho entre os marcadores da seção, ou null se ela não existir. */
export function extrairSecao(wikitext, nome = SECAO) {
  const s = String(wikitext ?? '')
  const ini = s.search(new RegExp(`<section\\s+begin\\s*=\\s*"?${nome}"?\\s*/>`, 'i'))
  if (ini < 0) return null
  const resto = s.slice(ini)
  const fim = resto.search(new RegExp(`<section\\s+end\\s*=\\s*"?${nome}"?\\s*/>`, 'i'))
  if (fim < 0) return null
  return resto.slice(0, fim)
}

/**
 * Uma entrada por agregador: nome, fim do campo declarado e data de atualização.
 * A linha da média entre agregadores (`Average`) sai, porque ela não é agregador
 * e repetiria as datas dos outros como se fosse um sétimo voto.
 */
export function lerAgregadores(wikitext) {
  const secao = extrairSecao(wikitext)
  if (secao === null) return { secaoEncontrada: false, agregadores: [] }

  const agregadores = []
  for (const bloco of secao.split(/^\|-.*$/m).slice(1)) {
    const celulas = []
    for (const linha of bloco.split('\n')) {
      if (!linha.startsWith('|') || linha.startsWith('|}') || linha.startsWith('|-')) continue
      // `||` separa várias células na mesma linha.
      for (const c of linha.slice(1).split('||')) celulas.push(c)
    }
    if (celulas.length < 3) continue

    const nome = limparCelula(celulas[0])
    if (!nome || /^average$/i.test(nome)) continue

    const administrado = limparCelula(celulas[1])
    const atualizado = limparCelula(celulas[2])
    agregadores.push({
      nome,
      campoTexto: administrado,
      campoFim: fimDoIntervalo(administrado),
      atualizadoEm: lerData(atualizado),
    })
  }
  return { secaoEncontrada: true, agregadores }
}

const diasEntre = (de, ate) =>
  Math.round((new Date(`${ate}T00:00:00Z`) - new Date(`${de}T00:00:00Z`)) / DIA_MS)

/**
 * O veredito. `hoje` em AAAA-MM-DD.
 *
 * A referência é a SEGUNDA maior data de campo, e não a maior: assim ela exige
 * que dois agregadores sustentem a data, e um erro de digitação isolado não
 * fabrica atraso. Data de campo no futuro é descartada como ilegível.
 */
export function compararComBase({ secaoEncontrada, agregadores }, campoMaisRecenteBase, hoje) {
  const base = { secaoEncontrada, lidos: 0, referencia: null, descompassoDias: null, idadeTabelaDias: null }

  if (!secaoEncontrada) {
    return { ...base, veredito: VEREDITOS.INCONCLUSIVO, motivo: `seção ${SECAO} não encontrada no artigo` }
  }
  if (!campoMaisRecenteBase) {
    return { ...base, veredito: VEREDITOS.INCONCLUSIVO, motivo: 'a nossa base não tem data de campo legível' }
  }

  const validos = agregadores.filter((a) => a.campoFim && (!hoje || a.campoFim <= hoje))
  const lidos = validos.length
  if (lidos < MIN_AGREGADORES) {
    return {
      ...base, lidos, veredito: VEREDITOS.INCONCLUSIVO,
      motivo: `${lidos} agregador(es) com data de campo legível, e a referência exige ${MIN_AGREGADORES}`,
    }
  }

  const datas = validos.map((a) => a.campoFim).sort()
  const referencia = datas[datas.length - MIN_AGREGADORES]
  const descompassoDias = diasEntre(campoMaisRecenteBase, referencia)

  const atualizacoes = agregadores.map((a) => a.atualizadoEm).filter(Boolean).sort()
  const ultimaAtualizacao = atualizacoes.length ? atualizacoes[atualizacoes.length - 1] : null
  const idadeTabelaDias = hoje && ultimaAtualizacao ? diasEntre(ultimaAtualizacao, hoje) : null

  const r = { ...base, lidos, referencia, descompassoDias, ultimaAtualizacao, idadeTabelaDias, alcance: ALCANCES.PONTA }

  if (descompassoDias > TOLERANCIA_DIAS) {
    return {
      ...r, veredito: VEREDITOS.ATRASADO,
      motivo: `pelo menos ${MIN_AGREGADORES} agregadores declaram campo até ${referencia}, ${descompassoDias} dias depois da nossa base`,
    }
  }

  // Daqui para baixo o veredito depende de a tabela estar VIVA.
  if (idadeTabelaDias === null || idadeTabelaDias > TABELA_VELHA_DIAS) {
    return {
      ...r, veredito: VEREDITOS.INCONCLUSIVO,
      motivo: idadeTabelaDias === null
        ? 'a tabela de agregadores não declara data de atualização legível'
        : `a tabela de agregadores não é atualizada há ${idadeTabelaDias} dias, e compasso entre dois parados não prova nada`,
    }
  }

  if (descompassoDias < -TOLERANCIA_DIAS) {
    return {
      ...r, veredito: VEREDITOS.A_FRENTE,
      motivo: `a nossa base tem campo ${-descompassoDias} dias depois do que os agregadores declaram`,
    }
  }
  return {
    ...r, veredito: VEREDITOS.COMPASSO,
    motivo: `diferença de ${descompassoDias} dia(s) NA PONTA, dentro da tolerância de ${TOLERANCIA_DIAS}`,
  }
}

/** A leitura com rede. Falha de rede devolve seção não encontrada, que dá INCONCLUSIVO. */
export async function buscarAgregadores({ fetchImpl = fetch } = {}) {
  try {
    const res = await fetchImpl(URL_AGREGADORES_RAW, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) return { secaoEncontrada: false, agregadores: [], erro: `HTTP ${res.status}` }
    return { ...lerAgregadores(await res.text()), erro: null }
  } catch (e) {
    return { secaoEncontrada: false, agregadores: [], erro: e?.message ?? String(e) }
  }
}
