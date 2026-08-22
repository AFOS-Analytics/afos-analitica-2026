'use client'

import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY } from 'd3-force'
import { drag as d3drag } from 'd3-drag'
import type { CountryDivergence } from '../../lib/country-data'
import { ELECTION_WINNER } from '../../lib/country-data'

// Grafo "estilo Obsidian" do cruzamento AFOS para um país: a eleição no centro, camadas (mercados,
// pesquisas, imprensa, contexto) e itens em volta. A DIVERGÊNCIA mercado x pesquisa é a estrela:
// linha fina colorida pela magnitude (vermelho alta, amarelo média, verde convergência) com o Δpp
// em destaque sobre a própria linha. Localizado PT/EN/ES e theme-aware (claro/Sapphire).

type NodeType = 'election' | 'market' | 'candidate' | 'poll' | 'press' | 'context' | 'indicator' | 'result' | 'navhub' | 'nav' | 'dataset'
type LinkKind = 'tree' | 'divergence' | 'poll' | 'correct' | 'wrong' | 'nav'

interface GNode {
  id: string
  label: string
  sub?: string
  type: NodeType
  r: number
  color: string
  href?: string
  action?: string
  x?: number; y?: number; fx?: number | null; fy?: number | null
}
interface GLink { source: string; target: string; kind: LinkKind; div?: number; w?: number }

// grupos de navegação opcionais (usado no dashboard do Brasil: o grafo vira mapa navegável)
export interface NavItem { id: string; label: string; href?: string; action?: string }
export interface NavGroup { id: string; label: string; color?: string; items: NavItem[] }
// links dos nós de DADO para o dataset (ex.: HF do Brasil), por tipo de nó. Estilo Obsidian:
// cada nó aponta para o arquivo/seção que o alimenta.
export interface DataLinks { election?: string; market?: string; poll?: string; press?: string; candidate?: string; context?: string; result?: string }

const TYPE_COLOR: Record<NodeType, string> = {
  election: '#0F52BA',
  market: '#1d4ed8',
  candidate: '#334155',
  poll: '#7c3aed',
  press: '#ea580c',
  context: '#0891b2',
  indicator: '#94a3b8',
  result: '#16a34a',
  navhub: '#4f46e5',
  nav: '#818cf8',
  // amarelo do Hugging Face. Nao colide com nenhum outro TIPO de no nem com a
  // escala das arestas de divergencia, entao o no do dataset se le de longe.
  dataset: '#eab308',
}

// paleta para candidatos sem cor explícita (por índice)
const PALETTE = ['#0F52BA', '#c0392b', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#475569']
// cores explícitas conhecidas (partidárias)
// cores por candidato/partido nos casos validados (esq./trabalhista = vermelho, dir./conservador =
// azul; EUA segue a convenção local R=vermelho, D=azul). Sem correspondência → paleta por índice.
const CAND_COLOR: Record<string, string> = {
  // EUA
  Trump: '#c0392b', Harris: '#2563eb',
  // Brasil
  Lula: '#c0392b', 'Flávio Bolsonaro': '#2563eb', 'Renan Santos': '#f59e0b', 'Ronaldo Caiado': '#16a34a', 'Romeu Zema': '#f97316',
  // Chile
  'Jeannette Jara': '#c0392b', 'José Antonio Kast': '#2563eb', 'Evelyn Matthei': '#0891b2', 'Johannes Kaiser': '#7c3aed', 'Franco Parisi': '#f97316', 'Eduardo Artés': '#991b1b',
  // Colômbia
  'Abelardo de la Espriella': '#2563eb', 'Iván Cepeda': '#c0392b',
  // Peru
  'Keiko Fujimori': '#f97316', 'Roberto Sánchez': '#c0392b', 'Rafael López Aliaga': '#2563eb', 'Carlos Álvarez': '#0891b2', 'Ricardo Belmont': '#7c3aed',
  // Alemanha (cores partidárias)
  'CDU/CSU': '#1f2937', AfD: '#2563eb', SPD: '#c0392b', 'Grüne': '#16a34a', FDP: '#eab308', BSW: '#7c3aed',
  // Canadá
  Liberal: '#c0392b', Conservative: '#2563eb', NDP: '#f97316', 'Bloc Québécois': '#38bdf8', Green: '#16a34a', "People's Party": '#7c3aed',
  // México
  Sheinbaum: '#c0392b', 'Gálvez': '#2563eb', 'Máynez': '#f97316',
  // Reino Unido (Conservative já mapeado acima, mesmo azul)
  Labour: '#c0392b', Reform: '#06b6d4', 'Lib Dems': '#f59e0b',
}

// cor da aresta de divergência: |div|>=6 vermelho, 3-6 âmbar, <3 verde (convergência)
function divColor(div: number): string {
  const a = Math.abs(div)
  if (a >= 6) return '#ef4444'
  if (a >= 3) return '#f59e0b'
  return '#22c55e'
}

interface Lbl {
  market: string; poll: string; pollsN: (n: number) => string; press: string; pressSub: string; ctx: string
  gov: string; eco: string; edu: string; govLabels: Record<string, string>
  pop: string; gdp: string; gdppc: string; infl: string; eduSpend: string; eduSpendSub: (s: string) => string; eduYears: string; eduYearsSub: (s: string) => string
  mkt: (s: string) => string; pollPct: (s: string) => string; result: (w: string) => string
  mktMudo: (s: string) => string; pollMudo: (s: string) => string
  college: string; collegeSub: string; popular: string; popularSub: string
  anchors: { debate: string; attempt: string; dropout: string; eve: string }
  dataset: string
  legend: { div: string; conv: string; poll: string; hit: string; miss: string; press: string; hint: string; semDelta: string; dataset: string }
}

const LBL: Record<string, Lbl> = {
  'pt-BR': {
    market: 'Mercados de previsão', poll: 'Pesquisas', pollsN: (n) => `${n} pesquisas`, press: 'Imprensa', pressSub: 'âncoras arquivadas (Wayback)', ctx: 'Contexto estrutural',
    gov: 'Governança', eco: 'Economia', edu: 'Educação',
    govLabels: { political_stability: 'Estabilidade política', voice_accountability: 'Voz e democracia', rule_of_law: 'Estado de direito', government_effectiveness: 'Efetividade do governo', regulatory_quality: 'Qualidade regulatória', control_of_corruption: 'Controle de corrupção' },
    pop: 'População', gdp: 'PIB', gdppc: 'PIB per capita', infl: 'Inflação', eduSpend: 'Gasto em educação', eduSpendSub: (s) => `${s} do PIB`, eduYears: 'Anos de escola', eduYearsSub: (s) => `${s} anos`,
    mkt: (s) => `mercado ${s}`, pollPct: (s) => `pesquisa ${s}`, result: (w) => `Resultado real: ${w} venceu`,
    mktMudo: (s) => `controle ${s}`, pollMudo: (s) => `voto ${s}`,
    college: 'Colégio eleitoral', collegeSub: '~US$ 3,7 bi · acertou', popular: 'Voto popular', popularSub: 'deu Harris ~74% · errou',
    anchors: { debate: 'Debate Biden×Trump (27/jun)', attempt: 'Atentado a Trump (13/jul)', dropout: 'Biden sai, Harris entra (21/jul)', eve: 'Véspera da eleição (04/nov)' },
    dataset: 'Dataset aberto',
    legend: { div: 'divergência mercado × pesquisa (Δpp)', conv: 'convergência (Δ baixo)', poll: 'leitura de pesquisa', hit: 'mercado acertou', miss: 'mercado errou', press: 'imprensa (âncoras)', hint: 'arraste os nós · scroll para zoom', semDelta: 'sem Δ: grandezas diferentes', dataset: 'dataset aberto (clique abre o Hugging Face)' },
  },
  en: {
    market: 'Prediction markets', poll: 'Polls', pollsN: (n) => `${n} polls`, press: 'Press', pressSub: 'archived anchors (Wayback)', ctx: 'Structural context',
    gov: 'Governance', eco: 'Economy', edu: 'Education',
    govLabels: { political_stability: 'Political stability', voice_accountability: 'Voice & accountability', rule_of_law: 'Rule of law', government_effectiveness: 'Government effectiveness', regulatory_quality: 'Regulatory quality', control_of_corruption: 'Control of corruption' },
    pop: 'Population', gdp: 'GDP', gdppc: 'GDP per capita', infl: 'Inflation', eduSpend: 'Education spending', eduSpendSub: (s) => `${s} of GDP`, eduYears: 'Years of schooling', eduYearsSub: (s) => `${s} yrs`,
    mkt: (s) => `market ${s}`, pollPct: (s) => `poll ${s}`, result: (w) => `Real result: ${w} won`,
    mktMudo: (s) => `control ${s}`, pollMudo: (s) => `vote ${s}`,
    college: 'Electoral college', collegeSub: '~US$3.7bn · correct', popular: 'Popular vote', popularSub: 'gave Harris ~74% · wrong',
    anchors: { debate: 'Biden×Trump debate (Jun 27)', attempt: 'Trump assassination attempt (Jul 13)', dropout: 'Biden drops out, Harris in (Jul 21)', eve: 'Election eve (Nov 4)' },
    dataset: 'Open dataset',
    legend: { div: 'market × poll divergence (Δpp)', conv: 'convergence (low Δ)', poll: 'poll reading', hit: 'market correct', miss: 'market wrong', press: 'press (anchors)', hint: 'drag nodes · scroll to zoom', semDelta: 'no Δ: different quantities', dataset: 'open dataset (click opens Hugging Face)' },
  },
  es: {
    market: 'Mercados de predicción', poll: 'Encuestas', pollsN: (n) => `${n} encuestas`, press: 'Prensa', pressSub: 'anclas archivadas (Wayback)', ctx: 'Contexto estructural',
    gov: 'Gobernanza', eco: 'Economía', edu: 'Educación',
    govLabels: { political_stability: 'Estabilidad política', voice_accountability: 'Voz y rendición de cuentas', rule_of_law: 'Estado de derecho', government_effectiveness: 'Efectividad del gobierno', regulatory_quality: 'Calidad regulatoria', control_of_corruption: 'Control de corrupción' },
    pop: 'Población', gdp: 'PIB', gdppc: 'PIB per cápita', infl: 'Inflación', eduSpend: 'Gasto en educación', eduSpendSub: (s) => `${s} del PIB`, eduYears: 'Años de escolaridad', eduYearsSub: (s) => `${s} años`,
    mkt: (s) => `mercado ${s}`, pollPct: (s) => `encuesta ${s}`, result: (w) => `Resultado real: ganó ${w}`,
    mktMudo: (s) => `control ${s}`, pollMudo: (s) => `voto ${s}`,
    college: 'Colegio electoral', collegeSub: '~US$ 3,7 mil M · acertó', popular: 'Voto popular', popularSub: 'dio a Harris ~74% · erró',
    anchors: { debate: 'Debate Biden×Trump (27 jun)', attempt: 'Atentado a Trump (13 jul)', dropout: 'Biden se retira, entra Harris (21 jul)', eve: 'Víspera electoral (4 nov)' },
    dataset: 'Dataset abierto',
    legend: { div: 'divergencia mercado × encuesta (Δpp)', conv: 'convergencia (Δ baja)', poll: 'lectura de encuesta', hit: 'mercado acertó', miss: 'mercado erró', press: 'prensa (anclas)', hint: 'arrastra los nodos · scroll para zoom', semDelta: 'sin Δ: magnitudes distintas', dataset: 'dataset abierto (clic abre Hugging Face)' },
  },
}

const TAG: Record<string, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }

function buildGraph(d: CountryDivergence, electionLabel: string, lbl: Lbl, tag: string, dec: (v: number | string) => string, navGroups: NavGroup[] = [], dataLinks: DataLinks = {}, mudo = false): { nodes: GNode[]; links: GLink[] } {
  const nodes: GNode[] = []
  const links: GLink[] = []
  const add = (n: GNode) => { nodes.push(n); return n.id }
  const isUSA = d.iso3 === 'USA'

  add({ id: 'election', label: electionLabel, type: 'election', r: 30, color: TYPE_COLOR.election, href: dataLinks.election })

  // camadas
  add({ id: 'L_market', label: lbl.market, type: 'market', r: 16, color: TYPE_COLOR.market, href: dataLinks.market })
  add({ id: 'L_poll', label: lbl.poll, sub: lbl.pollsN(d.polls_count), type: 'poll', r: 16, color: TYPE_COLOR.poll, href: dataLinks.poll })
  add({ id: 'L_press', label: lbl.press, sub: isUSA ? lbl.pressSub : '', type: 'press', r: 15, color: TYPE_COLOR.press, href: dataLinks.press })
  add({ id: 'L_ctx', label: lbl.ctx, type: 'context', r: 15, color: TYPE_COLOR.context, href: dataLinks.context })
  for (const t of ['L_market', 'L_poll', 'L_press', 'L_ctx']) links.push({ source: 'election', target: t, kind: 'tree' })

  /**
   * 🔗 NÓ PRÓPRIO DO DATASET, instalado 22/Ago/2026 por pedido do André.
   *
   * 🔴 A HISTÓRIA, porque ela é a razão de ele existir: o link do dataset foi
   * primeiro pendurado no `href` do nó da eleição. Funcionava e ninguém achava,
   * porque só o cursor denunciava. Depois ganhou anel tracejado e legenda no
   * rodapé, e o André respondeu que **texto no rodapé não é nó**: para clicar em
   * alguma coisa, a coisa precisa estar DENTRO do grafo, com nome.
   *
   * 🔑 A lição: num grafo, a unidade de descoberta é o NÓ. Marcar um nó
   * existente como "também leva a outro lugar" é meta-informação sobre um nó que
   * já significa outra coisa. O dataset é um destino próprio, e destino próprio
   * é nó próprio.
   *
   * O `href` no nó da eleição CONTINUA, e não é redundância: quem já sabe clica
   * no centro, e quem não sabe encontra o nó com nome. Os dois levam ao mesmo
   * lugar.
   */
  if (dataLinks.election && /^https?:\/\//.test(dataLinks.election)) {
    add({ id: 'dataset', label: lbl.dataset, sub: 'Hugging Face', type: 'dataset', r: 17, color: TYPE_COLOR.dataset, href: dataLinks.election })
    links.push({ source: 'election', target: 'dataset', kind: 'tree' })
  }

  // EUA: 2 mercados que discordaram (colégio acertou, voto popular errou), antes dos candidatos
  if (isUSA) {
    add({ id: 'm_college', label: lbl.college, sub: lbl.collegeSub, type: 'market', r: 16, color: TYPE_COLOR.market })
    add({ id: 'm_popular', label: lbl.popular, sub: lbl.popularSub, type: 'market', r: 13, color: '#b91c1c' })
    links.push({ source: 'L_market', target: 'm_college', kind: 'tree' })
    links.push({ source: 'L_market', target: 'm_popular', kind: 'tree' })
  }

  // candidatos: UM nó por candidato (rótulo mostra mercado% · pesquisa%). A DIVERGÊNCIA é a estrela:
  // a aresta colorida (fina) com o Δpp em destaque sobre a própria linha.
  const marketParent = isUSA ? 'm_college' : 'L_market'
  d.rows.forEach((row, i) => {
    const cid = `c_${row.candidate}`
    const col = CAND_COLOR[row.candidate] || PALETTE[i % PALETTE.length]
    add({ id: cid, label: row.candidate, sub: mudo
      // Com a aresta muda, as duas pontas medem grandezas DIFERENTES, então o
      // rótulo do nó tem de dizer QUAL é cada uma. "mercado 85,5% · pesquisa 47,2%"
      // convida a subtrair; "controle 85,5% · voto 47,2%" não deixa.
      ? `${lbl.mktMudo(dec(row.market_pct) + '%')} · ${lbl.pollMudo(dec(row.poll_pct) + '%')}`
      : `${lbl.mkt(dec(row.market_pct) + '%')} · ${lbl.pollPct(dec(row.poll_pct) + '%')}`, type: 'candidate', r: 12 + Math.min(13, row.market_pct / 5), color: col, href: dataLinks.candidate })
    links.push({ source: marketParent, target: cid, kind: 'divergence', div: row.divergence_pp, w: 1.5 + Math.min(1.3, Math.abs(row.divergence_pp) / 6) })
    links.push({ source: 'L_poll', target: cid, kind: 'poll' })
  })

  // nó de resultado real (vencedor), genérico por país
  const winner = ELECTION_WINNER[d.iso3]
  if (winner && d.rows.some((r) => r.candidate === winner)) {
    const winnerShort = winner.split(' ').pop() || winner
    add({ id: 'result', label: lbl.result(winnerShort), type: 'result', r: 18, color: TYPE_COLOR.result, href: dataLinks.result })
    links.push({ source: 'election', target: 'result', kind: 'tree' })
    links.push({ source: 'result', target: `c_${winner}`, kind: 'correct' })
  }

  // EUA: voto popular errou + âncoras de imprensa (eventos públicos que o mercado precificou;
  // em produção vêm do timeline arquivado no Neon)
  if (isUSA) {
    links.push({ source: 'm_popular', target: 'c_Harris', kind: 'wrong' })
    if (winner) links.push({ source: 'result', target: 'm_popular', kind: 'wrong' })
    const a = lbl.anchors
    const anchors: Array<[string, string]> = [['p_debate', a.debate], ['p_attempt', a.attempt], ['p_dropout', a.dropout], ['p_eve', a.eve]]
    for (const [id, label] of anchors) { add({ id, label, type: 'press', r: 7, color: '#fb923c' }); links.push({ source: 'L_press', target: id, kind: 'tree' }) }
  }

  // imprensa real: veículos que cobriram a eleição (campo `press` do bundle), como sub-nós da camada de imprensa
  if (!isUSA && Array.isArray(d.press) && d.press.length) {
    d.press.forEach((p, i) => {
      const id = `press_${i}`
      add({ id, label: p.outlet, type: 'press', r: 7, color: '#fb923c', href: p.url })
      links.push({ source: 'L_press', target: id, kind: 'tree' })
    })
  }

  // contexto estrutural agrupado: Governança (WGI) + Economia + Educação
  const ctx = d.context as unknown as {
    governance?: Record<string, { value: number }>
    macro?: Record<string, { value: number }>
    education?: Record<string, { value: number }>
  } | undefined
  if (ctx) {
    add({ id: 'g_gov', label: lbl.gov, type: 'context', r: 11, color: '#0e7490', href: dataLinks.context })
    add({ id: 'g_eco', label: lbl.eco, type: 'context', r: 11, color: '#0e7490', href: dataLinks.context })
    add({ id: 'g_edu', label: lbl.edu, type: 'context', r: 11, color: '#0e7490', href: dataLinks.context })
    for (const t of ['g_gov', 'g_eco', 'g_edu']) links.push({ source: 'L_ctx', target: t, kind: 'tree' })

    const usd0 = new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    const usdC = new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 })
    const cnt = new Intl.NumberFormat(tag, { notation: 'compact', maximumFractionDigits: 1 })
    const pct1 = new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

    const g = ctx.governance
    for (const [k, label] of Object.entries(lbl.govLabels)) {
      if (g?.[k]) { const id = `i_${k}`; add({ id, label, sub: `${g[k].value.toFixed(0)}/100`, type: 'indicator', r: 7, color: TYPE_COLOR.indicator }); links.push({ source: 'g_gov', target: id, kind: 'tree' }) }
    }

    const m = ctx.macro
    const eco: Array<[string, string, string]> = []
    if (m?.population) eco.push(['i_pop', lbl.pop, cnt.format(m.population.value)])
    if (m?.gdp_usd) eco.push(['i_gdp', lbl.gdp, usdC.format(m.gdp_usd.value)])
    if (m?.gdp_per_capita_usd) eco.push(['i_gdppc', lbl.gdppc, usd0.format(m.gdp_per_capita_usd.value)])
    if (m?.inflation_pct) eco.push(['i_infl', lbl.infl, pct1.format(m.inflation_pct.value) + '%'])
    for (const [id, label, sub] of eco) { add({ id, label, sub, type: 'indicator', r: 7, color: TYPE_COLOR.indicator }); links.push({ source: 'g_eco', target: id, kind: 'tree' }) }

    const e = ctx.education
    if (e?.gov_expenditure_pct_gdp) { add({ id: 'i_eduexp', label: lbl.eduSpend, sub: lbl.eduSpendSub(pct1.format(e.gov_expenditure_pct_gdp.value) + '%'), type: 'indicator', r: 7, color: TYPE_COLOR.indicator }); links.push({ source: 'g_edu', target: 'i_eduexp', kind: 'tree' }) }
    if (e?.expected_years_schooling) { add({ id: 'i_eduyrs', label: lbl.eduYears, sub: lbl.eduYearsSub(pct1.format(e.expected_years_schooling.value)), type: 'indicator', r: 7, color: TYPE_COLOR.indicator }); links.push({ source: 'g_edu', target: 'i_eduyrs', kind: 'tree' }) }
  }

  // grupos de navegação (mapa do AFOS): hub por grupo + itens clicáveis (href ou ação/modal)
  for (const g of navGroups) {
    if (!g.items.length) continue
    add({ id: g.id, label: g.label, type: 'navhub', r: 13, color: g.color || TYPE_COLOR.navhub })
    links.push({ source: 'election', target: g.id, kind: 'nav' })
    for (const it of g.items) {
      add({ id: it.id, label: it.label, type: 'nav', r: 8, color: TYPE_COLOR.nav, href: it.href, action: it.action })
      links.push({ source: g.id, target: it.id, kind: 'nav' })
    }
  }

  return { nodes, links }
}

/**
 * ⚠️ `divergenciaMuda` existe por uma decisão de MÉTODO, não de estilo.
 *
 * A estrela deste grafo é a aresta de divergência com o Δpp em destaque. Ela
 * vale onde as duas pontas medem A MESMA GRANDEZA, que é o caso do Brasil e dos
 * casos validados. Nas midterms dos EUA não é: o mercado precifica a
 * probabilidade de um partido controlar a casa e a pesquisa mede vantagem em
 * pontos de voto. Subtrair produz número sem significado, e exibi-lo na peça
 * mais chamativa da página contradiria a ressalva escrita logo acima.
 *
 * Com a flag ligada a aresta CONTINUA existindo, porque a relação existe, mas
 * fica tracejada, cinza e MUDA, com rótulo fixo em vez de número. Por ser a
 * única sem número, ela chama atenção justamente para a explicação. Foi assim
 * que o André aprovou no mockup de 27/Jul.
 */
export function CountryGraph({ data, electionLabel, locale = 'pt-BR', isBlue = false, navGroups = [], onNav, dataLinks = {}, dim = false, divergenciaMuda = false }: { data: CountryDivergence; electionLabel: string; locale?: string; isBlue?: boolean; navGroups?: NavGroup[]; onNav?: (action: string) => void; dataLinks?: DataLinks; dim?: boolean; divergenciaMuda?: boolean }) {
  const ref = useRef<SVGSVGElement | null>(null)
  const navCount = navGroups.reduce((a, g) => a + g.items.length, 0)
  // "candDense" = grafo de PAÍS com muitos candidatos (5+) e poucos nós de navegação:
  // dá ao cluster central o respiro que a Coreia do Sul (3 candidatos) tem naturalmente,
  // SEM mexer no dashboard (que é denso por navegação, navCount alto — deixar como está).
  const candCount = data.rows?.length ?? 0
  const candDense = candCount >= 5 && navCount < 10
  const dense = navCount > 6 || candDense
  const veryDense = navCount > 12
  const W = veryDense ? 1320 : dense ? 1140 : 900
  const H = veryDense ? 800 : dense ? 760 : 580

  useEffect(() => {
    if (!ref.current) return
    const lbl = LBL[locale] || LBL['en']
    const tag = TAG[locale] || 'en-US'
    const dec = (v: number | string) => locale === 'en' ? String(v) : String(v).replace('.', ',')
    const { nodes, links } = buildGraph(data, electionLabel, lbl, tag, dec, navGroups, dataLinks, divergenciaMuda)
    const pal = isBlue
      ? { tree: '#3f6cb0', label: '#f1f5f9', halo: '#082a5e', sub: '#93c5fd', nodeStroke: '#0a3d8f' }
      : { tree: '#cbd5e1', label: '#1e293b', halo: '#ffffff', sub: '#64748b', nodeStroke: '#ffffff' }

    const svg = select(ref.current)
    svg.selectAll('*').remove()
    const root = svg.append('g')

    const zoom = d3zoom<SVGSVGElement, unknown>().scaleExtent([0.4, 3]).on('zoom', (e) => root.attr('transform', e.transform.toString()))
    svg.call(zoom as never)

    // hover estilo Obsidian: o nó e os fios conectados acendem em azul reluzente, o resto esmaece
    const HL = '#2563eb'
    const eid = (x: unknown): string => (typeof x === 'object' && x ? (x as GNode).id : (x as string))
    const CINZA_MUDO = '#9ca3af'
    const baseStroke = (l: GLink) => l.kind === 'divergence' ? (divergenciaMuda ? CINZA_MUDO : divColor(l.div ?? 0)) : l.kind === 'poll' ? '#c4b5fd' : l.kind === 'correct' ? '#16a34a' : l.kind === 'wrong' ? '#ef4444' : l.kind === 'nav' ? (isBlue ? '#6366f1' : '#c7d2fe') : pal.tree
    const baseWidth = (l: GLink) => l.kind === 'divergence' ? (l.w ?? 2) : l.kind === 'correct' ? 3 : 1.5
    const baseOpacity = (l: GLink) => l.kind === 'divergence' ? (divergenciaMuda ? 0.7 : 0.95) : l.kind === 'tree' ? 0.45 : 0.8

    const linkSel = root.append('g').attr('fill', 'none')
      .selectAll('line').data(links).join('line')
      .attr('stroke', baseStroke)
      .attr('stroke-width', baseWidth)
      .attr('stroke-dasharray', (l) => (divergenciaMuda && l.kind === 'divergence') ? '6 5' : l.kind === 'poll' || l.kind === 'wrong' ? '4 4' : null)
      .attr('stroke-linecap', 'round')
      .attr('opacity', baseOpacity)

    // rótulo Δpp sobre a aresta de divergência (o cruzamento mercado × pesquisa, a estrela do AFOS)
    const divLinks = links.filter((l) => l.kind === 'divergence')
    const linkLabelSel = root.append('g').selectAll<SVGTextElement, GLink>('text').data(divLinks).join('text')
      .text((l) => divergenciaMuda ? lbl.legend.semDelta : `Δ ${dec(Math.abs(l.div ?? 0).toFixed(1))}pp`)
      .attr('text-anchor', 'middle').attr('dy', -4)
      .attr('font-size', divergenciaMuda ? 11 : 12.5).attr('font-weight', divergenciaMuda ? 600 : 800)
      .attr('fill', (l) => divergenciaMuda ? CINZA_MUDO : divColor(l.div ?? 0))
      .attr('paint-order', 'stroke').attr('stroke', '#fff').attr('stroke-width', 4)

    const nodeSel = root.append('g').selectAll<SVGGElement, GNode>('g').data(nodes).join('g')
      .style('cursor', (n) => n.href || n.action ? 'pointer' : 'grab')
    nodeSel.on('click', (_e, n) => {
      if (n.href) { if (/^https?:\/\//.test(n.href)) window.open(n.href, '_blank', 'noopener'); else window.location.href = n.href }
      else if (n.action) { onNav?.(n.action) }
    })

    nodeSel.append('circle')
      .attr('r', (n) => n.r)
      .attr('fill', (n) => n.color)
      .attr('stroke', pal.nodeStroke).attr('stroke-width', 2)
      .attr('opacity', (n) => n.type === 'indicator' ? 0.85 : 1)

    /**
     * 🔴 ANEL DO NÓ QUE SAI DO SITE, instalado 22/Ago/2026.
     *
     * O André abriu o painel dos EUA procurando o link do dataset e não achou.
     * Ele estava lá e funcionava: o nó central abre o Hugging Face. Mas o ÚNICO
     * sinal de que um nó é clicável era o cursor virar mãozinha ao passar por
     * cima, e num grafo de dezenas de bolinhas isso é indistinguível de
     * decoração. Ninguém varre o mouse por cada nó para descobrir quais
     * respondem.
     *
     * 🔑 A lição, e ela vale além daqui: "implantado" para mim era o `href`
     * ligado; para quem usa, é o link ENCONTRÁVEL. Eu conferi três idiomas e o
     * código servido, e não conferi a única coisa que decidia a entrega.
     *
     * O anel tracejado marca só os nós que levam para FORA do site, que hoje
     * são os do dataset aberto. Âncora interna não ganha anel: ela não tira o
     * leitor da página e já é o comportamento esperado de um painel.
     */
    nodeSel.filter((n) => !!n.href && /^https?:\/\//.test(n.href)).append('circle')
      .attr('r', (n) => n.r + 5)
      .attr('fill', 'none')
      .attr('stroke', pal.nodeStroke)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.85)

    // Dica ao pousar o mouse, para o anel não virar enfeite sem explicação.
    // `<title>` é o tooltip nativo do SVG: não precisa de biblioteca, funciona
    // com leitor de tela e não muda o layout.
    nodeSel.filter((n) => !!n.href).append('title')
      .text((n) => /^https?:\/\//.test(n.href!) ? lbl.legend.dataset : n.label)

    nodeSel.append('text')
      .text((n) => n.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (n) => n.r + 12)
      .attr('font-size', (n) => n.type === 'election' ? 13 : (n.type === 'indicator' || n.type === 'nav') ? 9 : 11)
      .attr('font-weight', (n) => n.type === 'election' || n.type === 'result' || n.type === 'navhub' ? 700 : 500)
      .attr('fill', pal.label)
      .attr('paint-order', 'stroke').attr('stroke', pal.halo).attr('stroke-width', 3)

    nodeSel.append('text')
      .text((n) => n.sub ?? '')
      .attr('text-anchor', 'middle')
      .attr('dy', (n) => n.r + 24)
      .attr('font-size', 9)
      .attr('fill', pal.sub)
      .attr('paint-order', 'stroke').attr('stroke', pal.halo).attr('stroke-width', 2.5)

    const sim = forceSimulation<GNode>(nodes)
      .force('link', forceLink<GNode, GLink>(links).id((n) => n.id).distance((l) => {
        const srcId = (l.source as unknown as GNode).id
        // distâncias maiores SÓ no candDense (país com muitos candidatos); dashboard mantém os valores aprovados
        if (l.kind === 'divergence') return candDense ? 170 : 145
        if (l.kind === 'poll') return candDense ? 150 : 130
        if (l.kind === 'nav') return srcId === 'election' ? (dense ? 165 : 150) : (dense ? 116 : 105)
        if (l.kind === 'tree') return srcId === 'election' ? (candDense ? 155 : 125) : 80
        return 95
      }).strength((l) => l.kind === 'divergence' ? 0.3 : 0.55))
      .force('charge', forceManyBody().strength(veryDense ? -640 : dense ? -560 : -380))
      .force('center', forceCenter(W / 2, H / 2))
      // colisão proporcional ao rótulo nos nós de navegação: labels longos (ex.: "DOI Colômbia 2026")
      // recebem raio maior, evitando sobreposição de texto quando o hub tem muitos filhos.
      .force('collide', forceCollide<GNode>().radius((n) => {
        if (n.type === 'navhub') return n.r + (dense ? 52 : 42)
        if (n.type === 'nav') return Math.max(n.r + 40, n.label.length * 3.1)
        // candidatos têm sub-rótulo largo ("mercado 57,5% · pesquisa 38%"): reservar espaço pela largura do texto
        if (n.type === 'candidate') return Math.max(n.r + 30, (n.sub?.length ?? n.label.length) * 2.2)
        // indicadores (Governança/Economia/Educação) têm rótulos que se tocam: reservar pela largura do nome
        if (n.type === 'indicator') return Math.max(n.r + 24, n.label.length * 3.0)
        return n.r + 28
      }).iterations(3))
      .force('x', forceX(W / 2).strength(0.04))
      .force('y', forceY(H / 2).strength(0.04))

    // enquadra TODO o conteúdo dentro do quadro (nada cortado): calcula a bounding box dos nós
    // incluindo raio e largura estimada do rótulo, e ajusta o zoom para caber, centralizado.
    let fitted = false
    function fit() {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const n of nodes) {
        if (n.x == null || n.y == null) return
        const halfW = Math.max(n.r, (n.label?.length ?? 0) * 3.4)
        minX = Math.min(minX, n.x - halfW); maxX = Math.max(maxX, n.x + halfW)
        minY = Math.min(minY, n.y - n.r - 6); maxY = Math.max(maxY, n.y + n.r + 28) // rótulo abaixo do nó
      }
      if (!isFinite(minX)) return
      const pad = 28
      const bw = (maxX - minX) + pad * 2, bh = (maxY - minY) + pad * 2
      const scale = Math.min(W / bw, H / bh, 1.25)
      const tx = W / 2 - scale * (minX + maxX) / 2
      const ty = H / 2 - scale * (minY + maxY) / 2
      svg.transition().duration(450).call(zoom.transform as never, zoomIdentity.translate(tx, ty).scale(scale))
    }

    let tickCount = 0
    sim.on('tick', () => {
      linkSel
        .attr('x1', (l) => (l.source as unknown as GNode).x!)
        .attr('y1', (l) => (l.source as unknown as GNode).y!)
        .attr('x2', (l) => (l.target as unknown as GNode).x!)
        .attr('y2', (l) => (l.target as unknown as GNode).y!)
      nodeSel.attr('transform', (n) => `translate(${n.x},${n.y})`)
      linkLabelSel
        .attr('x', (l) => ((l.source as unknown as GNode).x! + (l.target as unknown as GNode).x!) / 2)
        .attr('y', (l) => ((l.source as unknown as GNode).y! + (l.target as unknown as GNode).y!) / 2)
      if (!fitted && ++tickCount === 200) { fitted = true; fit() }
    })
    sim.on('end', () => { if (!fitted) { fitted = true; fit() } })

    const drag = d3drag<SVGGElement, GNode>().clickDistance(6)
      .on('start', (e, n) => { if (!e.active) sim.alphaTarget(0.3).restart(); n.fx = n.x; n.fy = n.y })
      .on('drag', (e, n) => { n.fx = e.x; n.fy = e.y })
      .on('end', (e, n) => { if (!e.active) sim.alphaTarget(0); n.fx = null; n.fy = null })
    nodeSel.call(drag as never)

    // realce ao passar o mouse (espelha o Obsidian): nó + arestas incidentes em azul; vizinhos em
    // foco, o resto esmaecido
    function highlight(hoverId: string, on: boolean) {
      const inc = (l: GLink) => eid(l.source) === hoverId || eid(l.target) === hoverId
      linkSel
        .attr('stroke', (l) => (on && inc(l)) ? HL : baseStroke(l))
        .attr('stroke-width', (l) => (on && inc(l)) ? Math.max(2.5, baseWidth(l) + 1) : baseWidth(l))
        .attr('opacity', (l) => on ? (inc(l) ? 1 : baseOpacity(l) * 0.16) : baseOpacity(l))
      const nb = new Set<string>([hoverId])
      if (on) for (const l of links) { const s = eid(l.source), t = eid(l.target); if (s === hoverId) nb.add(t); if (t === hoverId) nb.add(s) }
      nodeSel.attr('opacity', (d) => on ? (nb.has(d.id) ? 1 : 0.22) : 1)
      nodeSel.select<SVGCircleElement>('circle')
        .attr('stroke', (d) => (on && d.id === hoverId) ? HL : pal.nodeStroke)
        .attr('stroke-width', (d) => (on && d.id === hoverId) ? 3.5 : 2)
    }
    nodeSel.on('mouseover', (_e, n) => highlight(n.id, true)).on('mouseout', () => highlight('', false))

    return () => { sim.stop() }
  }, [data, electionLabel, locale, isBlue, navGroups, onNav, dataLinks, divergenciaMuda])

  const lbl = LBL[locale] || LBL['en']
  return (
    <div className={`w-full rounded-xl border shadow-sm overflow-hidden ${isBlue ? 'border-blue-400/30 bg-blue-900/40' : dim ? 'border-slate-200 bg-slate-100' : 'border-light-border bg-white'}`}>
      <svg ref={ref} role="img" aria-label={electionLabel} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto', maxHeight: '74vh', display: 'block', margin: '0 auto', background: isBlue ? '#0b327a' : (dim ? '#edf1f6' : '#f8fafc') }} />
      <div className={`flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 text-[11px] border-t ${isBlue ? 'text-blue-100/80 border-blue-400/20' : 'text-gray-600 border-light-border'}`}>
        {divergenciaMuda ? (
          /* Uma entrada só, e ela diz o que a aresta NÃO afirma. Manter as duas
             entradas coloridas aqui reintroduziria a ideia de Δ que a aresta
             acabou de recusar. */
          <span className="inline-flex items-center gap-1"><span className="inline-block w-5 h-0.5 border-t border-dashed" style={{ borderColor: '#9ca3af' }} /> <b>{lbl.legend.semDelta}</b></span>
        ) : (
          <>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-5 h-1 rounded" style={{ background: '#ef4444' }} /> <b>{lbl.legend.div}</b></span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-5 h-1 rounded" style={{ background: '#22c55e' }} /> {lbl.legend.conv}</span>
          </>
        )}
        <span className="inline-flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: '#a78bfa' }} /> {lbl.legend.poll}</span>
        {/* "mercado acertou" e "mercado errou" só fazem sentido onde JÁ existe
            resultado. Numa eleição que ainda vai acontecer, anunciar essas duas
            entradas sugere que o painel está dando nota ao mercado, e ele não
            está: não há o que acertar ainda. Escondidas quando a aresta é muda,
            que hoje é só o painel das midterms.
            📌 O mesmo vale para o painel do Brasil, que também é eleição ativa e
            também exibe as duas. Não mexi lá porque é página no ar e a limpeza
            é decisão do André, não efeito colateral desta entrega. */}
        {!divergenciaMuda && (
          <>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ background: '#16a34a' }} /> {lbl.legend.hit}</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: '#ef4444' }} /> {lbl.legend.miss}</span>
          </>
        )}
        <span className="inline-flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#ea580c' }} /> {lbl.legend.press}</span>
        {navGroups.length > 0 && (
          <span className="inline-flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#818cf8' }} /> {locale === 'en' ? 'navigation (click)' : locale === 'es' ? 'navegación (clic)' : 'navegação (clique)'}</span>
        )}
        {/* 🔗 A legenda do nó que SAI do site. Só aparece quando existe algum,
            então painel sem dataset publicado não ganha linha vazia. O quadrado
            é tracejado de propósito: repete no rodapé o mesmo anel desenhado em
            volta do nó, e é essa repetição que liga uma coisa à outra sem
            precisar de texto explicando o desenho. */}
        {Object.values(dataLinks).some((u) => typeof u === 'string' && /^https?:\/\//.test(u)) && (
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed" style={{ borderColor: isBlue ? '#93c5fd' : '#64748b' }} />
            {lbl.legend.dataset}
          </span>
        )}
        <span className={`ml-auto ${isBlue ? 'text-blue-300/60' : 'text-gray-400'}`}>{lbl.legend.hint}</span>
      </div>
    </div>
  )
}
