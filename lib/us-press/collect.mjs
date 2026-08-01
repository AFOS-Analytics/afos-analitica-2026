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
  { casa: 'The New York Times', tipo: 'jornal' },
  { casa: 'The Washington Post', tipo: 'jornal' },
  { casa: 'The Wall Street Journal', tipo: 'jornal' },
  { casa: 'USA TODAY', tipo: 'jornal' },

  // Imprensa especializada em Congresso e campanha. É a que mais cobre midterms.
  { casa: 'Politico', tipo: 'especializada' },
  { casa: 'The Hill', tipo: 'especializada' },
  { casa: 'Roll Call', tipo: 'especializada' },
  { casa: 'Axios', tipo: 'especializada' },

  // Televisão e rádio pública.
  { casa: 'NPR', tipo: 'tv/rádio' },
  { casa: 'ABC News', tipo: 'tv/rádio' },
  { casa: 'CBS News', tipo: 'tv/rádio' },
  { casa: 'NBC News', tipo: 'tv/rádio' },
  { casa: 'CNN', tipo: 'tv/rádio' },
  { casa: 'Fox News', tipo: 'tv/rádio' },

  // Opinião declarada, dos dois lados, para a lista não pender.
  { casa: 'Washington Examiner', tipo: 'opinião' },
  { casa: 'National Review', tipo: 'opinião' },
  { casa: 'The Guardian', tipo: 'opinião' },

  // Análise eleitoral de casa, não modelo de terceiro republicado.
  { casa: 'The Cook Political Report', tipo: 'análise' },
  { casa: 'Sabato’s Crystal Ball', tipo: 'análise' },
]

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

const tag = (bloco, nome) => {
  const m = bloco.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`))
  if (!m) return null
  return m[1]
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
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
 * Coleta e FILTRA pela lista. Devolve também quantos ficaram de fora, porque
 * descarte silencioso esconde o tamanho real da curadoria: sem esse número não
 * dá para saber se a lista está apertada demais.
 */
export async function coletarImprensaUs({ maximo = 12, agora = new Date() } = {}) {
  const todos = []
  const falhas = []
  for (const c of CONSULTAS) {
    try {
      todos.push(...(await buscar(c)))
    } catch (e) {
      falhas.push(`${c.id}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const naLista = todos.filter((i) => i.casa && NOMES.has(i.casa.toLowerCase()))

  // Mesma matéria costuma vir em mais de uma consulta.
  const porUrl = new Map()
  for (const i of naLista) if (!porUrl.has(i.url)) porUrl.set(i.url, i)

  const comData = [...porUrl.values()]
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
    },
    itens,
  }
}
