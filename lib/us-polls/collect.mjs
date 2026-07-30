/**
 * Coleta do generic ballot dos EUA. Wikipédia como ÍNDICE, instituto como FONTE.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE (30/Jul/2026): a lógica morava só dentro de
 * `scripts/parse-us-generic-ballot.mjs`, que é rodado À MÃO. Enquanto foi assim,
 * o generic ballot do painel só mudava quando alguém lembrava de rodar o script
 * e publicar. Isso não sobrevive a outubro, que tem três eleições em 30 dias.
 *
 * Agora a lógica é uma só e serve os dois lados: o script continua existindo
 * para rodada manual e para gerar o arquivo do repositório, e o cron
 * `/api/cron/refresh-us-polls` chama a MESMA função e grava no Neon.
 *
 * ⚠️ Nada aqui escreve em disco. É de propósito: em serverless não há
 * repositório para gravar, e uma função que às vezes grava arquivo e às vezes
 * não é a origem de bug silencioso.
 *
 * ⛔ O QUE ESTE MÓDULO NÃO FAZ, de propósito:
 *  - NÃO usa a tabela de agregadores da Wikipédia (Decision Desk HQ, RCP,
 *    FiftyPlusOne, Silver Bulletin, VoteHub). Aquilo é MODELO de terceiro, e
 *    republicar modelo alheio como se fosse leitura da casa é o oposto do que o
 *    AFOS faz. A casa calcula a própria média, simples.
 *  - NÃO pondera e NÃO exclui instituto. Excluir seria juízo de valor, e o
 *    rating do 538 morreu com o fechamento dele em mar/2025, então não existe
 *    régua pública para ponderar sem inventar uma.
 */

const ARTIGO = '2026 United States elections'
export const URL_RAW = `https://en.wikipedia.org/wiki/${ARTIGO.replace(/ /g, '_')}?action=raw`
export const URL_HUMANA = `https://en.wikipedia.org/wiki/${ARTIGO.replace(/ /g, '_')}`
const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'

// ─── Limpeza de wikitext ────────────────────────────────────────────

/**
 * Primeira URL citada na célula: é a fonte primária que a Wikipédia indexa.
 * `refsNomeadas` resolve o `<ref name="X" />`, que só aponta para uma citação
 * definida em outro lugar do artigo. Sem isso, uma em cada nove linhas ficava
 * sem link, e linkar o instituto é o método inteiro.
 */
function extrairUrl(celula, refsNomeadas) {
  const direta = celula.match(/url\s*=\s*([^|}\s]+)/)
  if (direta) return direta[1].trim()
  const nomeada = celula.match(/<ref\s+name\s*=\s*"?([^"/>]+)"?\s*\/>/)
  if (nomeada) return refsNomeadas.get(nomeada[1].trim()) ?? null
  return null
}

/** name → url, lido do artigo inteiro, porque a definição pode estar longe da tabela. */
function mapearRefsNomeadas(wikitext) {
  const mapa = new Map()
  for (const m of wikitext.matchAll(/<ref\s+name\s*=\s*"?([^"/>]+)"?\s*>([\s\S]*?)<\/ref>/g)) {
    const url = m[2].match(/url\s*=\s*([^|}\s]+)/)
    if (url && !mapa.has(m[1].trim())) mapa.set(m[1].trim(), url[1].trim())
  }
  return mapa
}

/**
 * Tira os atributos de célula que vêm antes do primeiro | (style=, rowspan=,
 * colspan=). Não dá para fazer isso com um replace de cada um: eles aparecem
 * juntos, como style="..." rowspan="2"|, e remover um deixa o outro colado no
 * conteúdo. Só corta se o que antecede o | for mesmo atributo, isto é, tiver =
 * e nenhum caractere de texto solto.
 */
function semAtributos(celula) {
  const i = celula.indexOf('|')
  if (i < 0) return celula
  const antes = celula.slice(0, i)
  if (/=/.test(antes) && /^[\w\s"'=;:%.\-]*$/.test(antes)) return celula.slice(i + 1)
  return celula
}

function limpar(celula) {
  return semAtributos(celula)
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[\s\S]*?<\/ref>/g, '')
    .replace(/\{\{efn[^{}]*(\{\{[^{}]*\}\})?[^{}]*\}\}/g, '')
    .replace(/\{\{party shading\/[^}]*\}\}\s*\|/g, '')
    .replace(/\{\{nowrap\|([^}]*)\}\}/g, '$1')
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/'''/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/style="[^"]*"\s*\|/g, '')
    .replace(/rowspan="?\d+"?\s*\|/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const num = (s) => {
  const m = String(s).match(/-?\d+(?:\.\d+)?/)
  return m ? Number(m[0]) : null
}

/** "1,100 (LV)" → { n: 1100, tipo: 'LV' }. LV/RV/A = likely, registered, adults. */
function amostra(s) {
  const n = s.replace(/,/g, '').match(/\d+/)
  const t = s.match(/\((LV|RV|A|V)\)/)
  return { n: n ? Number(n[0]) : null, tipo: t ? t[1] : null }
}

const MESES = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 }

/**
 * "July 19–20, 2026" · "June 30 – July 2, 2026" · "December 30, 2025 – January 1, 2026"
 * Devolve início e fim em ISO. O ano só aparece no fim quando o intervalo não cruza ano.
 */
function campo(s) {
  const txt = s.replace(/–|—/g, '-').replace(/\s+/g, ' ').trim()
  const anoFim = txt.match(/(\d{4})\s*$/)
  if (!anoFim) return { inicio: null, fim: null }
  const ano = Number(anoFim[1])
  const partes = txt.split('-').map((p) => p.trim())
  const parse = (p, anoPadrao) => {
    const m = p.match(/([A-Z][a-z]+)?\s*(\d{1,2}),?\s*(\d{4})?/)
    if (!m) return null
    return { mes: m[1] ? MESES[m[1]] : null, dia: Number(m[2]), ano: m[3] ? Number(m[3]) : anoPadrao }
  }
  const b = parse(partes[partes.length - 1], ano)
  const a = partes.length > 1 ? parse(partes[0], b?.ano ?? ano) : b
  if (!a || !b) return { inicio: null, fim: null }
  // "July 19-20, 2026": o fim vem sem mês e herda o do início. O contrário
  // acontece em "June 30 - July 2", em que o início é que está completo.
  if (b.mes === null) b.mes = a.mes
  if (a.mes === null) a.mes = b.mes
  const iso = (d) => (d.mes === null || !d.dia ? null : new Date(Date.UTC(d.ano, d.mes, d.dia)).toISOString().slice(0, 10))
  return { inicio: iso(a), fim: iso(b) }
}

// ─── Parser da tabela ───────────────────────────────────────────────

function parseTabela(wikitext) {
  const ini = wikitext.indexOf('==Polling==')
  if (ini < 0) throw new Error('seção ==Polling== não encontrada: a Wikipédia mudou de estrutura')
  const fim = wikitext.indexOf('\n|}', ini)
  // Uma citação pode ocupar várias linhas, e as células são divididas por
  // quebra-de-linha seguida de |. Sem achatar a citação antes, ela é cortada ao
  // meio e o pedaço vira "célula", o que embaralha a linha inteira e o rowspan
  // junto. Medido: 2 linhas de 320 saíam com o instituto trocado pela amostra.
  const tabela = wikitext.slice(ini, fim).replace(/<ref[\s\S]*?<\/ref>/g, (m) => m.replace(/\n/g, ' '))
  const refsNomeadas = mapearRefsNomeadas(wikitext)

  const blocos = tabela.split(/^\|-.*$/m).slice(1)
  const pesquisas = []
  // rowspan: instituto e datas valem para as N linhas seguintes.
  let carry = { instituto: null, url: null, inicio: null, fim: null, restam: 0 }

  for (const bloco of blocos) {
    const celulas = bloco.split(/\n\|/).slice(1).map((c) => c.replace(/^\|/, ''))
    if (celulas.length < 4) continue

    let instituto, url, datas, resto
    if (carry.restam > 0) {
      instituto = carry.instituto
      url = carry.url
      datas = { inicio: carry.inicio, fim: carry.fim }
      resto = celulas
      carry.restam--
    } else {
      const rs = celulas[0].match(/rowspan="?(\d+)"?/)
      instituto = limpar(celulas[0])
      url = extrairUrl(celulas[0], refsNomeadas)
      datas = campo(limpar(celulas[1]))
      resto = celulas.slice(2)
      if (rs) carry = { instituto, url, inicio: datas.inicio, fim: datas.fim, restam: Number(rs[1]) - 1 }
    }
    if (!instituto || resto.length < 4) continue

    const am = amostra(limpar(resto[0]))
    const dem = num(limpar(resto[2]))
    const rep = num(limpar(resto[3]))
    if (dem === null || rep === null) continue

    pesquisas.push({
      instituto,
      campoInicio: datas.inicio,
      campoFim: datas.fim,
      amostra: am.n,
      amostraTipo: am.tipo,
      margemErro: num(limpar(resto[1])),
      dem,
      rep,
      outros: num(limpar(resto[4] ?? '')),
      vantagemDem: Number((dem - rep).toFixed(1)),
      fontePrimaria: url,
    })
  }
  return pesquisas
}

// ─── Média da casa ──────────────────────────────────────────────────

/**
 * Média SIMPLES, sem ponderação e sem exclusão de instituto, sobre a janela
 * declarada.
 *
 * Uma pesquisa costuma publicar mais de um recorte da MESMA rodada (LV = provável
 * votante, RV = eleitor registrado, A = adultos). Entra um só, senão o instituto
 * pesa o dobro por ter publicado mais recortes.
 *
 * ⚠️ A escolha é por HIERARQUIA DE RECORTE, LV > RV > A, e não pela maior amostra.
 * Pegar a maior escolhe quase sempre a de adultos, que é a mais larga e a que mais
 * inclui quem não vota, e ela puxa a média para o lado democrata de forma
 * sistemática. Isso seria um viés introduzido por mim, não medido pelo instituto.
 * Escolher entre recortes que o MESMO instituto publicou não é excluir instituto,
 * que é o que a regra da casa proíbe.
 */
const ORDEM_RECORTE = { LV: 3, V: 3, RV: 2, A: 1 }

function media(pesquisas, dias, agora = new Date()) {
  const corte = new Date(agora.getTime() - dias * 86400000).toISOString().slice(0, 10)
  const naJanela = pesquisas.filter((p) => p.campoFim && p.campoFim >= corte)
  const porRodada = new Map()
  for (const p of naJanela) {
    const chave = `${p.instituto}|${p.campoFim}`
    const atual = porRodada.get(chave)
    const peso = (x) => (ORDEM_RECORTE[x.amostraTipo] ?? 0) * 1e9 + (x.amostra ?? 0)
    if (!atual || peso(p) > peso(atual)) porRodada.set(chave, p)
  }
  const usadas = [...porRodada.values()]
  if (usadas.length === 0) return null
  const m = (k) => Number((usadas.reduce((s, p) => s + p[k], 0) / usadas.length).toFixed(2))
  return {
    janelaDias: dias,
    desde: corte,
    nPesquisas: usadas.length,
    nInstitutos: new Set(usadas.map((p) => p.instituto)).size,
    dem: m('dem'),
    rep: m('rep'),
    vantagemDem: Number((m('dem') - m('rep')).toFixed(2)),
    metodo: 'média aritmética simples, sem ponderação e sem exclusão de instituto. Quando o mesmo instituto publica mais de um recorte da mesma rodada, entra um só, pela hierarquia provável votante > eleitor registrado > adultos.',
    institutos: [...new Set(usadas.map((p) => p.instituto))].sort(),
  }
}

// ─── Coleta ─────────────────────────────────────────────────────────

/**
 * Portão de forma. Uma linha em que o rowspan sai de sincronia acaba com o
 * TAMANHO DA AMOSTRA no lugar do nome do instituto, e sem data de campo. Ela
 * passaria a contar na média como se fosse pesquisa de verdade.
 *
 * Linha que não tem data de campo, ou cujo "instituto" é só número, é descartada
 * e CONTADA. Descarte silencioso seria o mesmo defeito que ela.
 */
const valida = (p) =>
  Boolean(p.campoFim) && /[A-Za-z]{3}/.test(p.instituto) && !/^\d[\d,.\s]*\(/.test(p.instituto)

/** Busca o índice, lê a tabela e devolve o objeto pronto. Não grava nada. */
export async function coletarGenericBallot({ dias = 30, agora = new Date() } = {}) {
  const res = await fetch(URL_RAW, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`Wikipédia devolveu HTTP ${res.status}`)
  const wikitext = await res.text()

  const brutas = parseTabela(wikitext)
  const descartadas = brutas.filter((p) => !valida(p))
  const pesquisas = brutas.filter(valida)

  // Mais recente primeiro, e quem não tem data vai para o fim: linha sem data é
  // defeito de leitura, não notícia fresca, e não pode encabeçar a lista.
  pesquisas.sort((a, b) => {
    if (!a.campoFim && !b.campoFim) return 0
    if (!a.campoFim) return 1
    if (!b.campoFim) return -1
    return b.campoFim.localeCompare(a.campoFim)
  })

  const semFonte = pesquisas.filter((p) => !p.fontePrimaria).length

  return {
    lastUpdate: agora.toISOString().slice(0, 10),
    fetchedAt: agora.toISOString(),
    eleicao: { pais: 'US', data: '2026-11-03', cargo: 'US House generic ballot' },
    procedencia: {
      indice: URL_HUMANA,
      licencaIndice: 'CC BY-SA 4.0 (Wikipédia)',
      regra: 'A Wikipédia é usada como ÍNDICE de quais pesquisas existem e quem publicou. Os números são atribuídos ao instituto e cada linha traz o link da fonte primária. O AFOS não redistribui tabela de terceiro.',
      agregadoresIgnorados: ['Decision Desk HQ', 'FiftyPlusOne', 'RealClearPolitics', 'Silver Bulletin', 'VoteHub'],
      motivoIgnorar: 'são modelos de terceiros; o AFOS calcula a própria média simples e não republica modelo alheio',
    },
    ressalvas: [
      'Não existe registro público obrigatório de pesquisa nos EUA, ao contrário do TSE no Brasil.',
      'A ponta da Wikipédia pode atrasar alguns dias em relação ao que os institutos já publicaram.',
      'Pesquisa americana é proprietária: exibida com atribuição e link, nunca redistribuída.',
    ],
    mediaAfos: media(pesquisas, dias, agora),
    qualidade: {
      linhasLidas: brutas.length,
      publicadas: pesquisas.length,
      descartadasPorForma: descartadas.length,
      motivoDescarte: 'linha sem data de campo ou com o instituto ilegível, tipicamente rowspan fora de sincronia na origem',
      semFontePrimaria: semFonte,
    },
    polls: pesquisas,
  }
}
