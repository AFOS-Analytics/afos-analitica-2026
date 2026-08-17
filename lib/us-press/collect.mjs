/**
 * Imprensa das midterms dos EUA, com LISTA FIXA de veículos.
 *
 * 🔴 A REGRA QUE GOVERNA ESTE ARQUIVO: entra automático, mas só de veículo que
 * está na lista abaixo. O André escolheu essa forma em 30/Jul, e o preço dela é
 * conhecido: manchete não lida por humano vai para uma página que promete dado
 * auditável. A lista é o que segura esse preço.
 *
 * ⚖️ POR QUE A LISTA É EQUILIBRADA DE PROPÓSITO: escolher veículo É juízo
 * editorial. Uma lista torta faria o painel ter opinião sem declarar que tem, e
 * o AFOS relata cruzamentos sem juízo de valor. Por isso ela tem agência,
 * jornal de referência, imprensa especializada em Congresso, televisão e
 * opinião dos dois lados. Quem quiser discordar da curadoria pode discordar de
 * uma lista visível, e não de um critério secreto.
 *
 * 🔒 E é a lista, não o meu bom senso, que impede escolha a dedo: ela está no
 * CÓDIGO e vale igual em toda rodada, inclusive naquela em que o resultado não
 * agrada. Hoje ela derruba a maioria do que é lido (85 de 146 numa rodada
 * medida em 01/Ago) sem ninguém olhar.
 *
 * ⛔ ESTE MÓDULO NÃO CLASSIFICA VEÍCULO POR INCLINAÇÃO POLÍTICA, e isso foi
 * decidido pelo André em 01/Ago/2026. Cada entrada já teve um campo
 * `inclinacao` com rótulo NOSSO e sem fonte; cruzado contra o AllSides, 13 dos
 * 22 divergiam, e para os dois lados. Rotular também é PRESUMIR: antecipa o que
 * esperar do veículo antes de ler a matéria, o contrário do método da casa.
 * O `tipo` fica porque é fato sobre o que a organização é, não juízo sobre onde
 * ela se posiciona.
 *
 * ⛔ O QUE ESTE MÓDULO NÃO FAZ: não resume, não interpreta e não escolhe manchete
 * por relevância. Ele lista o que os veículos da lista publicaram sobre as
 * midterms, com link para a matéria. Interpretar é trabalho da daily, com
 * revisão humana.
 */

/**
 * Lista fixa, agrupada pelo PAPEL de cada veículo. `casa` é o texto que o
 * Google News devolve no campo `source`, e é por ele que o filtro casa.
 */
export const VEICULOS = [
  // Agências: o piso factual, sem linha editorial de opinião no noticiário.
  { casa: 'Reuters', tipo: 'agência' },
  { casa: 'Associated Press', tipo: 'agência' },
  { casa: 'AP News', tipo: 'agência' },

  // Jornais de referência.
  { casa: 'The New York Times', tipo: 'jornal', feed: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml' },
  { casa: 'The Washington Post', tipo: 'jornal', feed: 'https://feeds.washingtonpost.com/rss/politics' },
  { casa: 'The Wall Street Journal', tipo: 'jornal', feed: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml' },
  { casa: 'USA TODAY', tipo: 'jornal' },

  // Imprensa especializada em Congresso e campanha. É a que mais cobre midterms.
  { casa: 'Politico', tipo: 'especializada', feed: 'https://rss.politico.com/politics-news.xml' },
  { casa: 'The Hill', tipo: 'especializada', feed: 'https://thehill.com/homenews/feed/' },
  { casa: 'Roll Call', tipo: 'especializada', feed: 'https://rollcall.com/feed/' },
  { casa: 'Axios', tipo: 'especializada', feed: 'https://api.axios.com/feed/' },

  // Televisão e rádio pública.
  { casa: 'NPR', tipo: 'tv/rádio', feed: 'https://feeds.npr.org/1014/rss.xml' },
  { casa: 'ABC News', tipo: 'tv/rádio', feed: 'https://abcnews.go.com/abcnews/politicsheadlines' },
  { casa: 'CBS News', tipo: 'tv/rádio', feed: 'https://www.cbsnews.com/latest/rss/politics' },
  { casa: 'NBC News', tipo: 'tv/rádio', feed: 'https://feeds.nbcnews.com/nbcnews/public/politics' },
  { casa: 'CNN', tipo: 'tv/rádio', feed: 'http://rss.cnn.com/rss/cnn_allpolitics.rss' },
  { casa: 'Fox News', tipo: 'tv/rádio', feed: 'https://moxie.foxnews.com/google-publisher/politics.xml' },
  // 📌 Acrescentada em 16/Ago/2026. O papel dela não é "mais uma TV": é a rede
  // nacional da lista que ENTREVISTA quem mede, ou seja, gente de instituto de
  // pesquisa e de mercado de previsão falando sobre o próprio método. Esse é o
  // material que o cruzamento do AFOS usa, e as outras cinco raramente o dão.
  // ⚠️ O gatilho da inclusão foi uma entrevista que chegou até nós por um
  // contato. A justificativa acima vale SEM esse contato, e é ela que sustenta
  // a entrada. Procedência do caso registrada na memória do projeto.
  { casa: 'NewsNation', tipo: 'tv/rádio', feed: 'https://www.newsnationnow.com/politics/feed/' },

  // Opinião declarada, dos dois lados, para a lista não pender.
  { casa: 'Washington Examiner', tipo: 'opinião' },
  { casa: 'National Review', tipo: 'opinião', feed: 'https://www.nationalreview.com/feed/' },
  { casa: 'The Guardian', tipo: 'opinião', feed: 'https://www.theguardian.com/us-news/us-politics/rss' },

  // Análise eleitoral de casa, não modelo de terceiro republicado.
  { casa: 'The Cook Political Report', tipo: 'análise' },
  { casa: 'Sabato’s Crystal Ball', tipo: 'análise' },
]

/**
 * 🔗 COLETA HÍBRIDA, decidida pelo André em 03/Ago/2026.
 *
 * O PROBLEMA: até aqui tudo vinha do Google News, que entrega um link
 * `news.google.com/rss/articles/CBMi...` em vez do endereço do veículo. Aquele
 * link funciona no navegador, mas:
 *   - é ilegível na tela (300 caracteres de token opaco);
 *   - não dá para resolver no servidor (o encaminhamento é por JavaScript, o
 *     token novo não decodifica e a página não expõe o destino);
 *   - e, o que mais importa, vai para o ARQUIVO DO DATASET. Guardar link de
 *     intermediário numa base que se apresenta como auditável é um defeito de
 *     procedência, não de estética.
 *
 * A MEDIÇÃO, feita em 03/Ago sobre os 22: **15 têm RSS próprio utilizável e os
 * 15 entregam a URL canônica**. Os 7 restantes se dividem em três casos:
 *   - Reuters e Associated Press descontinuaram RSS público (404 em todo caminho);
 *   - Washington Examiner, Cook Political Report e Sabato’s devolvem 403 a robô;
 *   - USA TODAY responde 200 e não devolve feed.
 *
 * ⛔ OS TRÊS 403 PROVAVELMENTE PASSARIAM COM USER-AGENT DE NAVEGADOR, E NÃO
 * FAZEMOS ISSO. É bloqueio deliberado do veículo, e um projeto que quer respeito
 * da imprensa americana não dribla o robots dela. Eles seguem entrando pelo
 * Google News, que é acesso que eles próprios autorizaram ao agregador.
 *
 * POR QUE HÍBRIDO E NÃO SÓ FEEDS: nas 5 coletas já arquivadas, 39 das 47
 * matérias vieram dos 15 que têm feed. Trocar tudo por feed próprio custaria as
 * outras 8, cinco delas do USA TODAY. O Google News fica como rede para quem não
 * tem feed, e a cobertura não cai.
 *
 * Cada item passa a declarar sua `origem`, para o dataset registrar de onde veio.
 */
const VEICULOS_COM_FEED = VEICULOS.filter((v) => v.feed)

/**
 * O feed próprio traz a editoria de política inteira, não só midterms. Este é o
 * filtro de assunto, e ele é DELIBERADAMENTE ESTREITO: é melhor perder matéria
 * do que encher a seção de política geral, que não é o que a página promete.
 * Quantos foram lidos e quantos passaram vai no bloco de qualidade, para o
 * aperto do filtro ficar medido em vez de suposto.
 */
const E_MIDTERM_EXPLICITO = /midterm|generic ballot|2026 (?:election|senate|house|race|map|cycle)|senate race|house race|senate primary|house primary|congressional (?:race|map|election|poll)|redistrict|battleground|toss-?up/i

/**
 * Segunda porta, e ela existe por uma medição: com só a lista explícita acima, a
 * primeira rodada híbrida publicou **4 de 10** com link canônico. A causa não era
 * o feed, era o filtro: ele estava mais ESTREITO que as buscas do Google, então a
 * mesma matéria era descartada no feed do veículo e entrava pelo agregador, com
 * link de intermediário. Filtro mais apertado que a fonte concorrente não protege
 * a seção, só devolve a decisão para o Google.
 *
 * Agora um título também passa quando fala de uma CASA do Congresso E de disputa.
 * As duas condições juntas são o que separa cobertura de eleição de política
 * geral: "Senate" sozinho pega qualquer votação, "primary" sozinho pega qualquer
 * primária.
 */
const CAMARA = /\bsenate\b|\bhouse\b|\bcongress(?:ional)?\b|\bgovernor\b/i
const DISPUTA = /\bprimary\b|\brace\b|\bseat\b|\bcandidate\b|\belection\b|\bballot\b|\bvoters?\b|\bcampaign\b|\bendorse|\bflip\b|\bmajorit|\bcontrol\b|\bpoll\b|\bwins?\b|\bwinning\b|\bnominee\b|\bincumbent\b|\bchallenger\b|\brunoff\b|\bvulnerable\b|\bretir(?:e|ing|ement)\b/i

function ehMidterm(titulo) {
  return E_MIDTERM_EXPLICITO.test(titulo) || (CAMARA.test(titulo) && DISPUTA.test(titulo))
}

/**
 * 🎯 TERCEIRO TRILHO, decidido pelo André em 16/Ago/2026: cobertura sobre o
 * INSTRUMENTO, não sobre a disputa.
 *
 * Os dois trilhos acima perguntam "esta matéria é sobre a corrida?". Nenhum
 * pergunta "esta matéria é sobre como a MEDIÇÃO está indo?", que é o assunto
 * próprio do AFOS. O painel cruza pesquisa com mercado e era cego para a
 * imprensa que discute justamente esse cruzamento.
 *
 * 📌 O caso que revelou o buraco: o Axios publicou "Pollsters missed again in
 * Wisconsin. Here's why." e a seção NUNCA o veria, porque o título não diz
 * midterm, nem senate race, nem generic ballot.
 *
 * ⚠️ POR QUE ELE NÃO É COMPORTA. Medido em 16/Ago/2026 sobre os 16 feeds
 * próprios: **424 títulos lidos, 25 já entravam pelos trilhos antigos, e este
 * acrescentou DOIS**. Os dois eram exatamente o alvo. A régua continua sendo
 * "melhor perder matéria do que encher de política geral".
 *
 * ⛔ O que ficou DE FORA de propósito, e é o que segura a peneira:
 *  - `poll` e `primary` soltos, que já são a segunda porta acima e pegariam
 *    qualquer votação e a primária presidencial de 2028;
 *  - nome de instituto SOZINHO não bastava? Basta, e é deliberado: manchete que
 *    nomeia casa de pesquisa é sobre medição por construção. O teto de 2 por
 *    veículo segura o volume se algum dia isso mudar.
 */
const INSTRUMENTO =
  /prediction market|polymarket|kalshi|betting (?:market|odds)|poll(?:ing)? (?:miss|error|failure|industry|average|model)|polls? (?:were|are|got) wrong|margin of error|likely voter|turnout model|\bweighting\b|\bpollster/i
const CASA_DE_PESQUISA =
  /\bipsos\b|\bgallup\b|\bquinnipiac\b|\bemerson college\b|\byougov\b|\bmarist\b|\bsiena\b|\bmonmouth\b|\bpew research\b|\bnorc\b|\bsuffolk\b|\bselzer\b|\bmorning consult\b|\bharris poll\b/i

function ehMetodo(titulo) {
  return INSTRUMENTO.test(titulo) || CASA_DE_PESQUISA.test(titulo)
}

/**
 * O portão da seção. `trilho` diz por QUAL porta a matéria entrou, e ele existe
 * para o alargamento ficar auditável: dá para contar quantas vieram de método
 * em vez de supor. `disputa` tem precedência quando os dois casam, porque a
 * matéria de corrida que cita instituto continua sendo matéria de corrida.
 */
function trilhoDaMateria(titulo) {
  if (ehMidterm(titulo)) return 'disputa'
  if (ehMetodo(titulo)) return 'metodo'
  return null
}

const NOMES = new Set(VEICULOS.map((v) => v.casa.toLowerCase()))

/**
 * ⚠️ DOIS FILTROS QUE SÓ APARECERAM AO RODAR, em 30/Jul, e sem eles a seção
 * nasceria inútil. A primeira coleta trouxe 12 itens: OITO eram páginas de
 * acompanhamento do New York Times ("Latest Polls" de disputas estaduais) e uma
 * era sobre a primária presidencial de 2028, que não é midterm.
 *
 * 1. PÁGINA DE ACOMPANHAMENTO NÃO É NOTÍCIA. "Latest Polls", "Live Results" e
 *    "Election Calendar" são páginas perenes que mudam sozinhas. Entrar como
 *    âncora de imprensa daria a impressão de que aconteceu algo naquele dia.
 * 2. TETO POR VEÍCULO. Sem ele, uma casa que publica muita página de disputa
 *    estadual ocupa a seção inteira, e a lista equilibrada vira decoração.
 */
// `latest[\s\w]{0,10}polls` cobre "Latest Polls" e "Latest 2026 Polls", que
// escapou do padrão fixo na primeira rodada.
// ⚠️ "Who is Ahead in..." acrescentado em 31/Jul: escapou nas duas primeiras
// rodadas e chegou a entrar na lista de leitura da Edição №1 do Tradeoff, de
// onde eu tirei à mão. É o mesmo tipo de página perene de "Latest Polls", só
// que com outro título, e o endereço denuncia: `/interactive/polls/`.
const NAO_E_NOTICIA = /latest[\s\w]{0,10}polls|live results|election calendar|poll tracker|results map|who is ahead|who's ahead/i
const URL_DE_ACOMPANHAMENTO = /\/interactive\/polls\/|\/polls\/[^/]*tracker/i
const TETO_POR_VEICULO = 2

const CONSULTAS = [
  { id: 'midterms', q: '2026 midterm elections House Senate when:2d' },
  { id: 'generic-ballot', q: 'generic ballot congressional poll 2026 when:3d' },
  { id: 'senate-races', q: '2026 Senate race candidates when:2d' },
]

const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'

/**
 * 🔴 DECODIFICADOR DE ENTIDADE HTML, e ele existe por causa de um defeito com
 * duas caras que nasceu de UMA lista incompleta.
 *
 * Aqui havia cinco `.replace` fixos: `&amp;`, `&quot;`, `&#39;`, `&lt;` e
 * `&gt;`. Faltava `&apos;`, que é justamente o que os feeds da NPR e da Fox
 * mandam. O estrago apareceu em 06/Ago/2026 em dois lugares diferentes:
 *
 * 1. NA TELA: três manchetes do dia saíram com `Michigan&apos;s` e
 *    `Trump&apos;s` à vista, porque o texto chega ao React já escapado.
 *
 * 2. NO DEDUP, e este é o traiçoeiro: a chave de deduplicação remove
 *    pontuação com `[^\p{L}\p{N}\s]`, então de `&apos;` somem o `&` e o `;`
 *    e sobram as LETRAS `apos` dentro da chave. A mesma matéria da NPR virou
 *    `michiganaposs` pelo feed e `michigans` pelo Google News, as chaves não
 *    bateram e ela foi publicada DUAS VEZES, gastando o teto de 2 por veículo.
 *    Das 10 publicadas naquele dia, só 9 eram distintas.
 *
 * ⚠️ `&amp;` é decodificado POR ÚLTIMO, de propósito. Decodificado primeiro,
 * uma entrada com duplo escape (`&amp;apos;`) viraria `&apos;` e a regra
 * seguinte a transformaria em apóstrofo, inventando texto que a fonte não
 * escreveu. Por último, ela para em `&apos;` literal, que é o correto.
 */
function decodificarEntidades(s) {
  return String(s)
    // numéricas primeiro, decimal e hexadecimal
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    // nomeadas que aparecem em feed de notícia
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // 🔴 &amp; SEMPRE por último. Ver a nota acima.
    .replace(/&amp;/g, '&')
}

const tag = (bloco, nome) => {
  const m = bloco.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`))
  if (!m) return null
  return decodificarEntidades(
    m[1]
      .replace(/^<!\[CDATA\[/, '')
      .replace(/\]\]>$/, '')
  ).trim()
}

/**
 * O Google News põe " - Veículo" no fim do título. Tirar isso deixa o título
 * limpo e devolve o nome da casa mesmo quando o campo `source` falta.
 */
function separarTitulo(titulo) {
  const i = titulo.lastIndexOf(' - ')
  if (i < 0) return { titulo, casa: null }
  return { titulo: titulo.slice(0, i).trim(), casa: titulo.slice(i + 3).trim() }
}

async function buscar(consulta) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(consulta.q)}&hl=en-US&gl=US&ceid=US:en`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`Google News devolveu HTTP ${res.status} em ${consulta.id}`)
  const xml = await res.text()
  const itens = []
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const bloco = m[1]
    const bruto = tag(bloco, 'title')
    const link = tag(bloco, 'link')
    if (!bruto || !link || !link.startsWith('http')) continue
    const { titulo, casa } = separarTitulo(bruto)
    itens.push({
      titulo,
      url: link,
      casa: tag(bloco, 'source') || casa,
      publicadoEm: tag(bloco, 'pubDate'),
      consulta: consulta.id,
    })
  }
  return itens
}

/**
 * Lê o RSS do próprio veículo. Aceita RSS 2.0 (`<item>`) e Atom (`<entry>`),
 * porque a lista tem os dois.
 *
 * 🔴 A URL vem do `<link>` do item e é a CANÔNICA do veículo. É esse o ganho
 * inteiro desta função.
 */
async function buscarFeedProprio(veiculo, desde) {
  const res = await fetch(veiculo.feed, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()

  const itens = []
  for (const m of xml.matchAll(/<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/g)) {
    const bloco = m[1]
    const titulo = tag(bloco, 'title')
    // Atom põe a URL no atributo `href`; RSS põe no corpo do `<link>`.
    const href = bloco.match(/<link[^>]+href="([^"]+)"/)?.[1]
    const link = href || tag(bloco, 'link')
    if (!titulo || !link || !link.startsWith('http')) continue

    const dataBruta = tag(bloco, 'pubDate') || tag(bloco, 'published') || tag(bloco, 'updated') || tag(bloco, 'dc:date')
    const d = dataBruta ? new Date(dataBruta) : null
    if (!d || isNaN(d.getTime()) || d < desde) continue

    // Filtro de assunto: o feed é de política, a página é de midterms e da
    // medição delas. Quem não entra por nenhum dos trilhos fica de fora.
    const trilho = trilhoDaMateria(titulo)
    if (!trilho) continue

    itens.push({
      titulo,
      url: link,
      casa: veiculo.casa,
      publicadoEm: d.toISOString(),
      consulta: 'feed-proprio',
      origem: 'feed',
      trilho,
    })
  }
  return itens
}

/**
 * Chave de deduplicação entre as duas fontes: mesma matéria, títulos idênticos.
 *
 * ⚠️ SEGUNDA TRAVA, e não é redundância. O `tag` já decodifica entidade na
 * entrada, mas a limpeza abaixo remove pontuação e DEIXA AS LETRAS: qualquer
 * entidade que escape da lista do decodificador entra na chave como texto
 * (`&apos;` vira `apos`) e separa duas cópias da mesma matéria. Decodificar de
 * novo aqui custa nada e fecha a porta para a entidade que eu não previ.
 *
 * 📌 Também remove um `&` solto seguido de letras, que é o resto de entidade
 * malformada, e aí sim a limpeza de pontuação não tem o que espalhar.
 */
function chaveTitulo(t) {
  return decodificarEntidades(String(t))
    .toLowerCase()
    .replace(/&[a-z]+;?/gi, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 70)
}

/**
 * Coleta e FILTRA pela lista. Devolve também quantos ficaram de fora, porque
 * descarte silencioso esconde o tamanho real da curadoria: sem esse número não
 * dá para saber se a lista está apertada demais.
 */
export async function coletarImprensaUs({ maximo = 12, agora = new Date(), diasDeFeed = 3 } = {}) {
  const todos = []
  const falhas = []
  const desde = new Date(agora.getTime() - diasDeFeed * 24 * 3600 * 1000)

  // 1) FEEDS PRÓPRIOS primeiro. Eles têm a URL canônica, e a ordem importa: na
  //    deduplicação abaixo, quem chegou antes vence.
  let lidosNoFeed = 0
  const doFeed = await Promise.all(
    VEICULOS_COM_FEED.map(async (v) => {
      try {
        return await buscarFeedProprio(v, desde)
      } catch (e) {
        falhas.push(`feed:${v.casa}: ${e instanceof Error ? e.message : String(e)}`)
        return []
      }
    }),
  )
  for (const lote of doFeed) {
    lidosNoFeed += lote.length
    todos.push(...lote)
  }

  // 2) GOOGLE NEWS como rede, para os 7 sem feed utilizável.
  for (const c of CONSULTAS) {
    try {
      // ⚠️ O item do Google NÃO passa pelo portão de assunto: as três consultas
      // já são de midterms. O `trilho` aqui é etiqueta, não filtro, e cai em
      // 'disputa' quando o título não denuncia método, que é o que a consulta
      // pediu.
      todos.push(
        ...(await buscar(c)).map((i) => ({ ...i, origem: 'google', trilho: trilhoDaMateria(i.titulo) ?? 'disputa' })),
      )
    } catch (e) {
      falhas.push(`${c.id}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const naLista = todos.filter((i) => i.casa && NOMES.has(i.casa.toLowerCase()))

  // Mesma matéria costuma vir em mais de uma consulta E nas duas fontes. A
  // deduplicação é por TÍTULO, não por URL, justamente porque a mesma matéria
  // tem endereços diferentes no feed do veículo e no Google News. Como os feeds
  // entraram primeiro, a versão que sobrevive é a de URL canônica.
  const porTitulo = new Map()
  for (const i of naLista) {
    const k = chaveTitulo(i.titulo)
    if (!porTitulo.has(k)) porTitulo.set(k, i)
  }

  const comData = [...porTitulo.values()]
    .map((i) => {
      const d = i.publicadoEm ? new Date(i.publicadoEm) : null
      return { ...i, publicadoEm: d && !isNaN(d.getTime()) ? d.toISOString() : null }
    })
    .filter((i) => i.publicadoEm)
    .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm))

  const ehAcompanhamento = (i) => NAO_E_NOTICIA.test(i.titulo) || URL_DE_ACOMPANHAMENTO.test(i.url)
  const acompanhamento = comData.filter(ehAcompanhamento)
  const noticias = comData.filter((i) => !ehAcompanhamento(i))

  const porCasa = new Map()
  const itens = []
  for (const i of noticias) {
    const n = porCasa.get(i.casa) ?? 0
    if (n >= TETO_POR_VEICULO) continue
    porCasa.set(i.casa, n + 1)
    itens.push(i)
    if (itens.length >= maximo) break
  }

  return {
    lastUpdate: agora.toISOString().slice(0, 10),
    fetchedAt: agora.toISOString(),
    regra: 'Entram apenas matérias de veículos da lista fixa do AFOS, com link para a matéria. O AFOS não resume nem interpreta: a leitura é do veículo.',
    veiculos: VEICULOS,
    qualidade: {
      lidos: todos.length,
      naLista: naLista.length,
      foraDaLista: todos.length - naLista.length,
      publicados: itens.length,
      descartadosPorAcompanhamento: acompanhamento.length,
      veiculosRepresentados: porCasa.size,
      tetoPorVeiculo: TETO_POR_VEICULO,
      consultasComFalha: falhas,
      // Procedência da rodada. Sem isto não dá para saber se os feeds próprios
      // estão vivos: uma quebra silenciosa apareceria como coleta normal, só
      // que toda vinda do Google e com link de intermediário de novo.
      feedsProprios: VEICULOS_COM_FEED.length,
      lidosEmFeedProprio: lidosNoFeed,
      publicadosComLinkCanonico: itens.filter((i) => i.origem === 'feed').length,
      publicadosViaGoogleNews: itens.filter((i) => i.origem !== 'feed').length,
      // Trilho de entrada, para o alargamento de 16/Ago ficar MEDIDO. Se
      // `publicadosPorMetodo` começar a disputar as vagas com a cobertura de
      // corrida, a peneira abriu demais e o lugar de olhar é o INSTRUMENTO.
      publicadosPorDisputa: itens.filter((i) => i.trilho !== 'metodo').length,
      publicadosPorMetodo: itens.filter((i) => i.trilho === 'metodo').length,
    },
    itens,
  }
}
