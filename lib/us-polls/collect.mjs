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

import { mesclarCuradas } from './rodadas-curadas.mjs'
import { serieDaCasa, ordemDeEmpate, compararEmpate } from './casas.mjs'

const ARTIGO = '2026 United States elections'
export const URL_RAW = `https://en.wikipedia.org/wiki/${ARTIGO.replace(/ /g, '_')}?action=raw`
export const URL_HUMANA = `https://en.wikipedia.org/wiki/${ARTIGO.replace(/ /g, '_')}`
export const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'

export const rawDe = (titulo) => `https://en.wikipedia.org/wiki/${titulo.replace(/ /g, '_')}?action=raw`
export const humanaDe = (titulo) => `https://en.wikipedia.org/wiki/${titulo.replace(/ /g, '_')}`

// ─── ONDE a tabela mora ─────────────────────────────────────────────

/**
 * Templates de moldura e de nota. Eles aparecem numa seção sem trazer conteúdo
 * nenhum, e pegar o primeiro `{{...}}` da seção escolheria justamente eles.
 */
const MOLDURA = /^(main|further|see ?also|for|hatnote|about|short description|update|as ?of|sticky header|div col|clear|reflist|notelist|efn|anchor|toc|multiple image|redirect)\b/i

/** `{{X}}` é Template:X. `{{:X}}` é o artigo X. Prefixo explícito passa direto. */
export function paginaDaTransclusao(nome) {
  const n = String(nome).trim()
  if (n.startsWith(':')) return n.slice(1).trim()
  if (/^(Template|Module|Wikipedia|Portal|User|Draft|Help|Category):/i.test(n)) return n
  return `Template:${n}`
}

/**
 * 🔴 ONDE A TABELA MORA É MEDIDO, NÃO SUPOSTO. Régua de 25/Set/2026.
 *
 * Até 23/Set a tabela do generic ballot estava INLINE na seção `==Polling==` do
 * artigo. Em 25/Set a seção inteira virou duas linhas:
 *
 *     ==Polling==
 *     {{2026 United States elections/polling}}
 *
 * A tabela foi movida para uma subpágina e passou a ser TRANSCLUÍDA, e
 * `?action=raw` devolve wikitext NÃO EXPANDIDO: ela simplesmente não está mais
 * no que a gente baixa. O artigo ficou com ZERO wikitable, a leitura caiu de
 * 424 linhas para 0 e o portão de colapso reprovou a passada, que é o certo.
 *
 * ⚠️ O que esta função NÃO pode fazer é devolver vazio sossegada, porque zero
 * pesquisa é saída plausível para um dia sem divulgação. Ela é LOUD nos dois
 * extremos: sem a seção lança, e com a seção sem tabela e sem transclusão
 * lança também.
 *
 * 📌 A seção termina no PRÓXIMO cabeçalho de nível 2, não no primeiro `|}`:
 * delimitar a seção pelo fim da tabela é circular quando a tabela é justamente
 * o que pode não existir.
 */
export function localizarFonteDaTabela(wikitext, { ancora = '==Polling==' } = {}) {
  const ini = wikitext.indexOf(ancora)
  if (ini < 0) throw new Error(`seção ${ancora} não encontrada: a Wikipédia mudou de estrutura`)

  const resto = wikitext.slice(ini + ancora.length)
  const prox = resto.search(/^== *[^=\n][^\n]*== *$/m)
  const secao = prox < 0 ? resto : resto.slice(0, prox)

  if (secao.includes('{|')) return { modo: 'inline', inicioSecao: ini }

  for (const m of secao.matchAll(/\{\{\s*([^{}|\n]+?)\s*(?:\|[^{}]*)?\}\}/g)) {
    if (MOLDURA.test(m[1].trim())) continue
    return { modo: 'transclusao', titulo: paginaDaTransclusao(m[1]), inicioSecao: ini }
  }
  throw new Error(
    `seção ${ancora} sem tabela e sem transclusão de conteúdo: nada a ler, a origem mudou de estrutura`
  )
}

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

export function parseTabela(fonte, desde = 0) {
  const ini = fonte.indexOf('{|', desde)
  if (ini < 0) throw new Error(`nenhuma tabela ({|) na fonte a partir de ${desde}`)
  const fim = fonte.indexOf('\n|}', ini)
  // 🔴 O FIM DA TABELA TAMBÉM É ÂNCORA, e só o INÍCIO era conferido.
  //
  // `slice(ini, -1)` é fatia VÁLIDA em JS, então `indexOf` devolvendo -1 não
  // dava erro: o parser seguia lendo até o fim do artigo como se aquilo fosse a
  // tabela. Em 25/Set/2026 foi o que aconteceu, e só não produziu linha
  // contaminada porque o pedaço restante não tinha nenhum `|-`. Assimetria de
  // guarda entre duas âncoras do mesmo par é defeito silencioso, não estilo.
  if (fim < 0) throw new Error('fim de tabela (|}) não encontrado: a origem mudou de estrutura')
  // Uma citação pode ocupar várias linhas, e as células são divididas por
  // quebra-de-linha seguida de |. Sem achatar a citação antes, ela é cortada ao
  // meio e o pedaço vira "célula", o que embaralha a linha inteira e o rowspan
  // junto. Medido: 2 linhas de 320 saíam com o instituto trocado pela amostra.
  //
  // 🔴 A GUARDA `(?![^>]*\/>)` É O CONSERTO DE 03/Ago/2026 E NÃO SE REMOVE.
  //
  // `<ref name="X"/>` é AUTO-FECHADA: aponta para uma citação definida em outro
  // lugar e não tem `</ref>` próprio. Sem a guarda, o `<ref[\s\S]*?<\/ref>`
  // começa a casar NELA e só para no `</ref>` da PRÓXIMA citação de verdade,
  // que costuma estar várias linhas adiante. Tudo no meio tem as quebras de
  // linha trocadas por espaço, e com elas somem os separadores `|-` das linhas.
  //
  // Medido na tabela de 03/Ago: 352 separadores no bruto, **309 depois de
  // achatar**, ou seja 43 linhas destruídas. Elas não sumiam: as células de uma
  // linha eram engolidas pelo NOME DO INSTITUTO da seguinte, e o arquivo saía
  // com rótulos do tipo `Morning Consult |July 17–19, 2026 |2,200 (RV) |...
  // |- |style="text-align:left;" Strength In Numbers/Verasight`.
  //
  // ⚠️ O portão de valor NÃO pega isso, e é o ponto principal: os percentuais
  // ficam íntegros e `descartadasPorValor` segue em 0. O defeito é de ETIQUETA,
  // não de número, e por isso o tracker do Morning Consult ficava fora da média
  // sem que nenhuma checagem reclamasse. Quem pega é `institutoLegivel`.
  //
  // O `limpar()` já fazia certo, removendo a auto-fechada antes da pareada.
  // Era só aqui que faltava.
  const tabela = fonte
    .slice(ini, fim)
    .replace(/<ref(?![^>]*\/>)[^>]*>[\s\S]*?<\/ref>/g, (m) => m.replace(/\n/g, ' '))
  const refsNomeadas = mapearRefsNomeadas(fonte)

  const blocos = tabela.split(/^\|-.*$/m).slice(1)
  const pesquisas = []

  /**
   * 🔴 ROWSPAN É POR COLUNA, e tratar só as duas primeiras foi o defeito de
   * 01/Ago/2026.
   *
   * As colunas da origem são:
   *   0 instituto · 1 datas · 2 amostra · 3 margem · 4 dem · 5 rep · 6 outros · 7 vantagem
   *
   * O `rowspan` não aparece só no instituto e nas datas. Aparece TAMBÉM na
   * margem de erro, que costuma vir como `rowspan="3"|–` quando o instituto
   * publica três recortes da mesma rodada. Nas linhas seguintes do grupo a
   * célula da margem simplesmente NÃO EXISTE, e quem lê por posição fixa
   * escorrega uma coluna: grava o REPUBLICANO no lugar do democrata e o
   * OUTROS no lugar do republicano.
   *
   * Foi assim que "Focaldata/FT, Dem 51 x Rep 44, outros 5" virou
   * "D=42 x R=9" no arquivo, e "Big Data Poll" virou "D=914 x R=3,2", com o
   * 914 sendo a amostra e o 3,2 a margem.
   *
   * A correção é geral: guardar as células pendentes POR ÍNDICE DE COLUNA e
   * remontar cada linha na posição certa antes de ler qualquer valor.
   */
  const MAX_COLUNAS = 12
  /** @type {Array<{valor: string, restam: number} | null>} */
  const pendentes = new Array(MAX_COLUNAS).fill(null)

  for (const bloco of blocos) {
    const cruas = bloco.split(/\n\|/).slice(1).map((c) => c.replace(/^\|/, ''))
    if (!cruas.length) continue

    // Remonta a linha: onde há célula pendente de rowspan, ela ocupa a coluna;
    // onde não há, entra a próxima célula crua desta linha.
    const linha = new Array(MAX_COLUNAS).fill(undefined)
    const veioDeRowspan = new Array(MAX_COLUNAS).fill(false)
    let i = 0
    for (let col = 0; col < MAX_COLUNAS; col++) {
      const p = pendentes[col]
      if (p && p.restam > 0) {
        linha[col] = p.valor
        veioDeRowspan[col] = true
        p.restam--
        if (p.restam === 0) pendentes[col] = null
      } else if (i < cruas.length) {
        linha[col] = cruas[i++]
      }
    }
    if (i < cruas.length) continue // linha mais larga que o modelo: não adivinhar

    // Registra os rowspan NOVOS desta linha. Célula que já veio de rowspan não
    // se re-registra, senão o contador nunca zeraria.
    for (let col = 0; col < MAX_COLUNAS; col++) {
      if (veioDeRowspan[col] || linha[col] === undefined) continue
      const rs = String(linha[col]).match(/rowspan="?(\d+)"?/)
      if (rs && Number(rs[1]) > 1) pendentes[col] = { valor: linha[col], restam: Number(rs[1]) - 1 }
    }

    if (linha[4] === undefined || linha[5] === undefined) continue

    const instituto = limpar(linha[0] ?? '')
    const url = extrairUrl(linha[0] ?? '', refsNomeadas)
    const datas = campo(limpar(linha[1] ?? ''))
    if (!instituto) continue

    const am = amostra(limpar(linha[2] ?? ''))
    const dem = num(limpar(linha[4]))
    const rep = num(limpar(linha[5]))
    if (dem === null || rep === null) continue

    pesquisas.push({
      instituto,
      campoInicio: datas.inicio,
      campoFim: datas.fim,
      amostra: am.n,
      amostraTipo: am.tipo,
      margemErro: num(limpar(linha[3] ?? '')),
      dem,
      rep,
      outros: num(limpar(linha[6] ?? '')),
      vantagemDem: Number((dem - rep).toFixed(1)),
      fontePrimaria: url,
      // 🔴 A SEGUNDA DIMENSÃO DA MESMA RODADA, medida em 18/Set/2026.
      //
      // O índice marca com `{{efn|name="lean"}}` a linha em que os indecisos que
      // PENDEM para um lado já foram alocados. A nota diz, literalmente, "With
      // voters who lean towards a given candidate", e ela aparece 37 vezes no
      // artigo. Quando o instituto publica as duas versões, a Wikipédia lista
      // DUAS linhas com o mesmo instituto, o mesmo campo, a mesma amostra e a
      // mesma margem, distinguidas só por essa nota.
      //
      // ⛔ O `limpar()` apaga o `{{efn}}` antes de qualquer leitura, então o
      //    coletor era ESTRUTURALMENTE CEGO a essa distinção e ficava com a
      //    linha que viesse primeiro. A hierarquia `LV > RV > A` não resolve:
      //    ela ordena o RECORTE DE ELEITOR, e as duas linhas têm o mesmo.
      //
      // 📌 Este campo é ADITIVO e não muda nada: não entra em `media()`, não
      //    altera `dem`, `rep` nem `vantagemDem`, e não reordena escolha
      //    nenhuma. Ele existe para a dimensão parar de ser invisível, que é o
      //    pré-requisito de qualquer decisão sobre ela. Trocar a régua de
      //    escolha é decisão do André, e sem medida não há decisão.
      //
      // Caso que o achou: John Zogby Strategies, campo 15-17/Set, 1.007 LV,
      // ±3,2. Duas linhas, 46/40 sem leaners e 48/42 com. A margem é D+6 nas
      // duas, então a média não sofreu; o NÍVEL publicado sofreu, e o instituto
      // dá manchete com 48-42.
      comLeaners: /efn\s*\|\s*name\s*=\s*"lean"/.test(`${linha[4] ?? ''}${linha[5] ?? ''}${linha[6] ?? ''}`),
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
export const ORDEM_RECORTE = { LV: 3, V: 3, RV: 2, A: 1 }

// 🔑 `registroCasas` existe para o MEDIDOR poder desligar a tabela e mostrar o
// preço dela, sem escrever uma segunda cópia da regra de deduplicação. Foi
// exatamente essa segunda cópia que errou o preço em 25/Set/2026: o filtro do
// detector tirava a linha duplicada e a casa CAÍA para outro recorte em vez de
// sumir, então o número que ele chamava de "sem as idênticas" era de um terceiro
// mundo, nem o publicado nem o corrigido.
export function media(pesquisas, dias, agora = new Date(), registroCasas = undefined) {
  const canon = (n) => serieDaCasa(n, registroCasas)
  const corte = new Date(agora.getTime() - dias * 86400000).toISOString().slice(0, 10)
  const naJanela = pesquisas.filter((p) => p.campoFim && p.campoFim >= corte)
  const porRodada = new Map()
  for (const p of naJanela) {
    // 🧬 A chave é a casa CANÔNICA, e não o nome que o índice escreveu. Sem isto
    // a regra "uma rodada por instituto por onda" se apoia no único campo que a
    // fonte não promete: em 25/Set/2026 três casas entravam DUAS vezes, e o
    // publicado era D+7.98 onde a regra dava D+7.89. A tabela é declarada, nome
    // por nome e com prova, em `casa-canonica.mjs`, e nome não declarado passa
    // inteiro, para grafia nova não ser absorvida em silêncio.
    const chave = `${canon(p.instituto)}|${p.campoFim}`
    const atual = porRodada.get(chave)
    // Recorte e amostra continuam mandando; o resto do desempate é declarado,
    // porque a alternativa é a ordem em que o índice escreveu.
    const peso = (x) => [ORDEM_RECORTE[x.amostraTipo] ?? 0, x.amostra ?? 0, ...ordemDeEmpate(x, registroCasas)]
    if (!atual || compararEmpate(peso(p), peso(atual)) > 0) porRodada.set(chave, p)
  }
  const usadas = [...porRodada.values()]
  if (usadas.length === 0) return null
  const m = (k) => Number((usadas.reduce((s, p) => s + p[k], 0) / usadas.length).toFixed(2))
  return {
    janelaDias: dias,
    desde: corte,
    nPesquisas: usadas.length,
    // 🔑 QUAIS pesquisas entraram, e não só quantas. Instalado em 04/Set/2026.
    //
    // Sem isto a média era irreproduzível a partir do próprio arquivo: naquele
    // dia 21 linhas tinham `campoFim >= desde` e `nPesquisas` dizia 13, porque a
    // escolha de recorte por rodada vive só aqui dentro. Para saber POR QUE a
    // média mexeu era preciso reexecutar o script, e reexecutar é medir de novo,
    // não conferir. Quem afirma "a variação é de composição" precisa poder
    // mostrar qual linha entrou e qual saiu.
    //
    // 📌 É lista curta, uma entrada por rodada usada, e leva o que reproduz a
    // conta na mão: instituto, fim de campo, recorte escolhido e os dois valores.
    incluidas: usadas
      .map((p) => ({
        instituto: canon(p.instituto),
        // 📌 Quando o colapso de nome aconteceu, o rótulo do ÍNDICE fica ao lado.
        // Registro que esconde o nome de origem obriga quem confere a voltar ao
        // `polls[]` para descobrir que houve colapso.
        ...(canon(p.instituto) !== p.instituto ? { institutoNoIndice: p.instituto } : {}),
        campoFim: p.campoFim,
        amostraTipo: p.amostraTipo ?? null,
        dem: p.dem,
        rep: p.rep,
      }))
      .sort((a, b) => b.campoFim.localeCompare(a.campoFim) || a.instituto.localeCompare(b.instituto)),
    nInstitutos: new Set(usadas.map((p) => canon(p.instituto))).size,
    dem: m('dem'),
    rep: m('rep'),
    vantagemDem: Number((m('dem') - m('rep')).toFixed(2)),
    metodo: 'média aritmética simples, sem ponderação e sem exclusão de instituto. Quando o mesmo instituto publica mais de um recorte da mesma rodada, entra um só, pela hierarquia provável votante > eleitor registrado > adultos. Quando o índice lista a mesma casa sob dois nomes, o de quem executa e o de quem publica, ou duas grafias, ela conta uma vez, pelo nome de quem executa, por tabela declarada casa a casa.',
    institutos: [...new Set(usadas.map((p) => canon(p.instituto)))].sort(),
  }
}

// ─── Coleta ─────────────────────────────────────────────────────────

/**
 * 🏷️ PORTÃO DE ETIQUETA, endurecido em 03/Ago/2026.
 *
 * O nome do instituto é a única coisa que diz DE QUEM é o número. Se ele vier
 * sujo, o percentual continua certo e continua sem dono, e nenhuma checagem
 * sobre o VALOR pega isso.
 *
 * ⚠️ Foi exatamente o que aconteceu: com o achatamento de citação comendo os
 * separadores `|-` (ver o comentário no `parseTabela`), 51 das 304 linhas saíram
 * com o rótulo carregando a linha inteira do instituto anterior, do tipo
 * `Morning Consult |July 17–19, 2026 |2,200 (RV) |– |46% |43% |...`. Passavam
 * por aqui porque tinham data de campo, tinham três letras e não começavam por
 * número. **O `descartadasPorValor` ficou em 0 o tempo todo.**
 *
 * A consequência que mais custou: o tracker do Morning Consult NUNCA entrava na
 * média, porque o nome limpo dele nunca chegava a existir.
 *
 * Nome de instituto não tem cano, não tem porcentagem e não tem atributo de
 * célula. Se tiver, a linha é descartada e CONTADA. Descarte silencioso seria o
 * mesmo defeito que ela.
 */
const NOME_SUJO = /[|%]|style\s*=|rowspan\s*=|colspan\s*=/
const valida = (p) =>
  Boolean(p.campoFim) &&
  /[A-Za-z]{3}/.test(p.instituto) &&
  !/^\d[\d,.\s]*\(/.test(p.instituto) &&
  !NOME_SUJO.test(p.instituto) &&
  p.instituto.length <= 90

/**
 * 🔴 PORTÃO DE VALOR, instalado em 01/Ago/2026.
 *
 * O QUE ACONTECEU: a coleta publicou uma linha do Big Data Poll como
 * "D 914 x R 3,2". O 914 era o TAMANHO DA AMOSTRA e o 3,2 era a MARGEM DE ERRO.
 *
 * POR QUE PASSOU: as colunas são lidas por POSIÇÃO (`resto[2]` e `resto[3]`).
 * Quando a linha da origem tem uma coluna a mais ou a menos, a leitura desliza
 * para as vizinhas e continua devolvendo número. A única conferência que existia
 * era "veio nulo?", e 914 não é nulo. O portão de forma acima também não pega:
 * a linha TEM data de campo e TEM nome de instituto legível, porque o defeito
 * não está no começo da linha, está no meio dela.
 *
 * O mesmo instituto tinha linhas assim desde fevereiro (D=1 R=3,1 · D=2 R=2,2 ·
 * D=19 R=9 com amostra de 46). Só ficou visível quando o valor absurdo cresceu.
 *
 * A RÉGUA: generic ballot nacional não vive fora de 15% a 70%, e democrata mais
 * republicano não passa de 100. É folgada de propósito: existe recorte legítimo
 * de adultos com muito indeciso (D=33 x R=28), e ele precisa continuar entrando.
 *
 * Reprovada é DESCARTADA E CONTADA, igual à de forma. O que não pode é sumir em
 * silêncio, porque aí o defeito volta a ser invisível.
 */
const PCT_MIN = 15
const PCT_MAX = 70

const plausivel = (p) =>
  p.dem >= PCT_MIN && p.dem <= PCT_MAX &&
  p.rep >= PCT_MIN && p.rep <= PCT_MAX &&
  p.dem + p.rep <= 100

/**
 * Baixa wikitext cru com timeout e retentativa. O cron roda UMA vez por dia:
 * uma falha de rede transitória custava a rodada inteira, e sem timeout um
 * socket pendurado segurava a rota até o teto da plataforma. O portão contra
 * leitura vazia continua sendo quem impede gravar por cima do dado bom.
 */
async function baixarWikitext(url) {
  let res
  let ultimoErro
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20_000) })
      if (res.ok) break
      ultimoErro = new Error(`Wikipédia devolveu HTTP ${res.status} em ${url}`)
    } catch (e) {
      ultimoErro = e
    }
    if (tentativa < 3) await new Promise((r) => setTimeout(r, 2000 * tentativa))
  }
  if (!res || !res.ok) throw ultimoErro || new Error(`Wikipédia não respondeu em ${url}`)
  return res.text()
}

/** Busca o índice, lê a tabela e devolve o objeto pronto. Não grava nada. */
export async function coletarGenericBallot({ dias = 30, agora = new Date() } = {}) {
  // ⏱️ Timeout e retentativa. O cron roda UMA vez por dia: uma falha de rede
  // transitória custava a rodada inteira, e sem timeout um socket pendurado
  // segurava a rota até o teto da plataforma. O portão contra leitura vazia
  // continua sendo quem impede gravar por cima do dado bom.
  const wikitext = await baixarWikitext(URL_RAW)

  // A tabela pode estar inline na seção ou numa subpágina transcluída. Quem
  // decide é a medição da seção, e o caminho usado sai declarado na procedência.
  const onde = localizarFonteDaTabela(wikitext)
  let fonte = wikitext
  let desde = onde.inicioSecao
  const fonteDaTabela =
    onde.modo === 'inline'
      ? { modo: 'inline', pagina: URL_HUMANA }
      : {
          modo: 'transclusao',
          pagina: humanaDe(onde.titulo),
          transcluidaEm: URL_HUMANA,
          notadoEm: '2026-09-25',
        }
  if (onde.modo === 'transclusao') {
    fonte = await baixarWikitext(rawDe(onde.titulo))
    desde = 0
  }

  const brutas = parseTabela(fonte, desde)
  // Os dois portões são contados SEPARADAMENTE porque são defeitos diferentes
  // da origem: um embaralha o começo da linha, o outro desliza o meio dela.
  // Somar os dois num número só esconderia qual dos dois piorou.
  const porForma = brutas.filter((p) => !valida(p))
  const porValor = brutas.filter((p) => valida(p) && !plausivel(p))
  const doIndice = brutas.filter((p) => valida(p) && plausivel(p))

  // As rodadas lidas na listagem do próprio instituto entram AQUI, depois dos
  // dois portões e antes da média, para atravessarem exatamente as mesmas
  // regras das do índice, inclusive a hierarquia de recorte da `media()`.
  // O índice sempre vence a duplicata. Ver lib/us-polls/rodadas-curadas.mjs
  const mescla = mesclarCuradas(doIndice)
  const pesquisas = mescla.pesquisas

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
      fonteDaTabela,
      licencaIndice: 'CC BY-SA 4.0 (Wikipédia)',
      regra: 'A Wikipédia é usada como ÍNDICE de quais pesquisas existem e quem publicou. Os números são atribuídos ao instituto e cada linha traz o link da fonte primária. O AFOS não redistribui tabela de terceiro.',
      agregadoresIgnorados: ['Decision Desk HQ', 'FiftyPlusOne', 'RealClearPolitics', 'Silver Bulletin', 'VoteHub'],
      motivoIgnorar: 'são modelos de terceiros; o AFOS calcula a própria média simples e não republica modelo alheio',
      rodadasCuradas: {
        quantas: mescla.aceitas.length,
        regra: 'Rodada que o instituto publicou e o índice não recebeu entra lida na CROSSTAB do próprio instituto, com o link dela, e vem etiquetada com origem "listagem-do-instituto". É exceção declarada, não caminho normal: o índice continua sendo a via padrão e sempre vence a duplicata.',
        institutos: [...new Set(mescla.aceitas.map((p) => p.instituto))].sort(),
        // Uma decisão por casa, cada uma com a sua data: a curadoria não é um
        // portão que se abre uma vez.
        decididoEm: { 'The Economist/YouGov': '2026-09-04', 'Quantus Insights (R)': '2026-09-10' },
      },
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
      descartadasPorForma: porForma.length,
      descartadasPorValor: porValor.length,
      // Total, e é ESTE que a tela declara. Enquanto ela declarava só o de
      // forma, um descarte por valor não apareceria em lugar nenhum.
      descartadas: porForma.length + porValor.length,
      motivoDescarte: `linha sem data de campo ou com o instituto ilegível (rowspan fora de sincronia na origem), ou com percentual fora da faixa plausível de ${PCT_MIN}% a ${PCT_MAX}% e soma até 100 (coluna deslizada, tipicamente amostra ou margem de erro lidas como intenção de voto)`,
      semFontePrimaria: semFonte,
      doIndice: doIndice.length,
      curadas: mescla.aceitas.length,
      curadasDescartadasPorDuplicidade: mescla.duplicadas.length,
    },
    polls: pesquisas,
  }
}
