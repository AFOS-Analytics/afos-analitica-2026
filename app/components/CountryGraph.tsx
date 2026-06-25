'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { CountryDivergence } from '../../lib/country-data'
import { ELECTION_WINNER } from '../../lib/country-data'

// Grafo "estilo Obsidian" do cruzamento AFOS para um país: a eleição no centro, camadas (mercados,
// pesquisas, imprensa, contexto) e itens em volta. A DIVERGÊNCIA mercado x pesquisa é a estrela:
// linha fina colorida pela magnitude (vermelho alta, amarelo média, verde convergência) com o Δpp
// em destaque sobre a própria linha. Localizado PT/EN/ES e theme-aware (claro/Sapphire).

type NodeType = 'election' | 'market' | 'candidate' | 'poll' | 'press' | 'context' | 'indicator' | 'result'
type LinkKind = 'tree' | 'divergence' | 'poll' | 'correct' | 'wrong'

interface GNode {
  id: string
  label: string
  sub?: string
  type: NodeType
  r: number
  color: string
  x?: number; y?: number; fx?: number | null; fy?: number | null
}
interface GLink { source: string; target: string; kind: LinkKind; div?: number; w?: number }

const TYPE_COLOR: Record<NodeType, string> = {
  election: '#0F52BA',
  market: '#1d4ed8',
  candidate: '#334155',
  poll: '#7c3aed',
  press: '#ea580c',
  context: '#0891b2',
  indicator: '#94a3b8',
  result: '#16a34a',
}

// paleta para candidatos sem cor explícita (por índice)
const PALETTE = ['#0F52BA', '#c0392b', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#475569']
// cores explícitas conhecidas (partidárias)
const CAND_COLOR: Record<string, string> = { Trump: '#c0392b', Harris: '#2563eb' }

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
  college: string; collegeSub: string; popular: string; popularSub: string
  anchors: { debate: string; attempt: string; dropout: string; eve: string }
  legend: { div: string; conv: string; poll: string; hit: string; miss: string; press: string; hint: string }
}

const LBL: Record<string, Lbl> = {
  'pt-BR': {
    market: 'Mercados de previsão', poll: 'Pesquisas', pollsN: (n) => `${n} pesquisas`, press: 'Imprensa', pressSub: 'âncoras arquivadas (Wayback)', ctx: 'Contexto estrutural',
    gov: 'Governança', eco: 'Economia', edu: 'Educação',
    govLabels: { political_stability: 'Estabilidade política', voice_accountability: 'Voz e democracia', rule_of_law: 'Estado de direito', government_effectiveness: 'Efetividade do governo', regulatory_quality: 'Qualidade regulatória', control_of_corruption: 'Controle de corrupção' },
    pop: 'População', gdp: 'PIB', gdppc: 'PIB per capita', infl: 'Inflação', eduSpend: 'Gasto em educação', eduSpendSub: (s) => `${s} do PIB`, eduYears: 'Anos de escola', eduYearsSub: (s) => `${s} anos`,
    mkt: (s) => `mercado ${s}`, pollPct: (s) => `pesquisa ${s}`, result: (w) => `Resultado real: ${w} venceu`,
    college: 'Colégio eleitoral', collegeSub: '~US$ 3,7 bi · acertou', popular: 'Voto popular', popularSub: 'deu Harris ~74% · errou',
    anchors: { debate: 'Debate Biden×Trump (27/jun)', attempt: 'Atentado a Trump (13/jul)', dropout: 'Biden sai, Harris entra (21/jul)', eve: 'Véspera da eleição (04/nov)' },
    legend: { div: 'divergência mercado × pesquisa (Δpp)', conv: 'convergência (Δ baixo)', poll: 'leitura de pesquisa', hit: 'mercado acertou', miss: 'mercado errou', press: 'imprensa (âncoras)', hint: 'arraste os nós · scroll para zoom' },
  },
  en: {
    market: 'Prediction markets', poll: 'Polls', pollsN: (n) => `${n} polls`, press: 'Press', pressSub: 'archived anchors (Wayback)', ctx: 'Structural context',
    gov: 'Governance', eco: 'Economy', edu: 'Education',
    govLabels: { political_stability: 'Political stability', voice_accountability: 'Voice & accountability', rule_of_law: 'Rule of law', government_effectiveness: 'Government effectiveness', regulatory_quality: 'Regulatory quality', control_of_corruption: 'Control of corruption' },
    pop: 'Population', gdp: 'GDP', gdppc: 'GDP per capita', infl: 'Inflation', eduSpend: 'Education spending', eduSpendSub: (s) => `${s} of GDP`, eduYears: 'Years of schooling', eduYearsSub: (s) => `${s} yrs`,
    mkt: (s) => `market ${s}`, pollPct: (s) => `poll ${s}`, result: (w) => `Real result: ${w} won`,
    college: 'Electoral college', collegeSub: '~US$3.7bn · correct', popular: 'Popular vote', popularSub: 'gave Harris ~74% · wrong',
    anchors: { debate: 'Biden×Trump debate (Jun 27)', attempt: 'Trump assassination attempt (Jul 13)', dropout: 'Biden drops out, Harris in (Jul 21)', eve: 'Election eve (Nov 4)' },
    legend: { div: 'market × poll divergence (Δpp)', conv: 'convergence (low Δ)', poll: 'poll reading', hit: 'market correct', miss: 'market wrong', press: 'press (anchors)', hint: 'drag nodes · scroll to zoom' },
  },
  es: {
    market: 'Mercados de predicción', poll: 'Encuestas', pollsN: (n) => `${n} encuestas`, press: 'Prensa', pressSub: 'anclas archivadas (Wayback)', ctx: 'Contexto estructural',
    gov: 'Gobernanza', eco: 'Economía', edu: 'Educación',
    govLabels: { political_stability: 'Estabilidad política', voice_accountability: 'Voz y rendición de cuentas', rule_of_law: 'Estado de derecho', government_effectiveness: 'Efectividad del gobierno', regulatory_quality: 'Calidad regulatoria', control_of_corruption: 'Control de corrupción' },
    pop: 'Población', gdp: 'PIB', gdppc: 'PIB per cápita', infl: 'Inflación', eduSpend: 'Gasto en educación', eduSpendSub: (s) => `${s} del PIB`, eduYears: 'Años de escolaridad', eduYearsSub: (s) => `${s} años`,
    mkt: (s) => `mercado ${s}`, pollPct: (s) => `encuesta ${s}`, result: (w) => `Resultado real: ganó ${w}`,
    college: 'Colegio electoral', collegeSub: '~US$ 3,7 mil M · acertó', popular: 'Voto popular', popularSub: 'dio a Harris ~74% · erró',
    anchors: { debate: 'Debate Biden×Trump (27 jun)', attempt: 'Atentado a Trump (13 jul)', dropout: 'Biden se retira, entra Harris (21 jul)', eve: 'Víspera electoral (4 nov)' },
    legend: { div: 'divergencia mercado × encuesta (Δpp)', conv: 'convergencia (Δ baja)', poll: 'lectura de encuesta', hit: 'mercado acertó', miss: 'mercado erró', press: 'prensa (anclas)', hint: 'arrastra los nodos · scroll para zoom' },
  },
}

const TAG: Record<string, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }

function buildGraph(d: CountryDivergence, electionLabel: string, lbl: Lbl, tag: string, dec: (v: number | string) => string): { nodes: GNode[]; links: GLink[] } {
  const nodes: GNode[] = []
  const links: GLink[] = []
  const add = (n: GNode) => { nodes.push(n); return n.id }
  const isUSA = d.iso3 === 'USA'

  add({ id: 'election', label: electionLabel, type: 'election', r: 30, color: TYPE_COLOR.election })

  // camadas
  add({ id: 'L_market', label: lbl.market, type: 'market', r: 16, color: TYPE_COLOR.market })
  add({ id: 'L_poll', label: lbl.poll, sub: lbl.pollsN(d.polls_count), type: 'poll', r: 16, color: TYPE_COLOR.poll })
  add({ id: 'L_press', label: lbl.press, sub: isUSA ? lbl.pressSub : '', type: 'press', r: 15, color: TYPE_COLOR.press })
  add({ id: 'L_ctx', label: lbl.ctx, type: 'context', r: 15, color: TYPE_COLOR.context })
  for (const t of ['L_market', 'L_poll', 'L_press', 'L_ctx']) links.push({ source: 'election', target: t, kind: 'tree' })

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
    add({ id: cid, label: row.candidate, sub: `${lbl.mkt(dec(row.market_pct) + '%')} · ${lbl.pollPct(dec(row.poll_pct) + '%')}`, type: 'candidate', r: 12 + Math.min(13, row.market_pct / 5), color: col })
    links.push({ source: marketParent, target: cid, kind: 'divergence', div: row.divergence_pp, w: 1.5 + Math.min(1.3, Math.abs(row.divergence_pp) / 6) })
    links.push({ source: 'L_poll', target: cid, kind: 'poll' })
  })

  // nó de resultado real (vencedor), genérico por país
  const winner = ELECTION_WINNER[d.iso3]
  if (winner && d.rows.some((r) => r.candidate === winner)) {
    const winnerShort = winner.split(' ').pop() || winner
    add({ id: 'result', label: lbl.result(winnerShort), type: 'result', r: 18, color: TYPE_COLOR.result })
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

  // contexto estrutural agrupado: Governança (WGI) + Economia + Educação
  const ctx = d.context as unknown as {
    governance?: Record<string, { value: number }>
    macro?: Record<string, { value: number }>
    education?: Record<string, { value: number }>
  } | undefined
  if (ctx) {
    add({ id: 'g_gov', label: lbl.gov, type: 'context', r: 11, color: '#0e7490' })
    add({ id: 'g_eco', label: lbl.eco, type: 'context', r: 11, color: '#0e7490' })
    add({ id: 'g_edu', label: lbl.edu, type: 'context', r: 11, color: '#0e7490' })
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

  return { nodes, links }
}

export function CountryGraph({ data, electionLabel, locale = 'pt-BR', isBlue = false }: { data: CountryDivergence; electionLabel: string; locale?: string; isBlue?: boolean }) {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const W = 900, H = 580
    const lbl = LBL[locale] || LBL['en']
    const tag = TAG[locale] || 'en-US'
    const dec = (v: number | string) => locale === 'en' ? String(v) : String(v).replace('.', ',')
    const { nodes, links } = buildGraph(data, electionLabel, lbl, tag, dec)
    const pal = isBlue
      ? { tree: '#3f6cb0', label: '#f1f5f9', halo: '#082a5e', sub: '#93c5fd', nodeStroke: '#0a3d8f' }
      : { tree: '#cbd5e1', label: '#1e293b', halo: '#ffffff', sub: '#64748b', nodeStroke: '#ffffff' }

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    const root = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.4, 3]).on('zoom', (e) => root.attr('transform', e.transform.toString()))
    svg.call(zoom as never)

    const linkSel = root.append('g').attr('fill', 'none')
      .selectAll('line').data(links).join('line')
      .attr('stroke', (l) => l.kind === 'divergence' ? divColor(l.div ?? 0) : l.kind === 'poll' ? '#c4b5fd' : l.kind === 'correct' ? '#16a34a' : l.kind === 'wrong' ? '#ef4444' : pal.tree)
      .attr('stroke-width', (l) => l.kind === 'divergence' ? (l.w ?? 2) : l.kind === 'correct' ? 3 : 1.5)
      .attr('stroke-dasharray', (l) => l.kind === 'poll' || l.kind === 'wrong' ? '4 4' : null)
      .attr('stroke-linecap', 'round')
      .attr('opacity', (l) => l.kind === 'divergence' ? 0.95 : l.kind === 'tree' ? 0.45 : 0.8)

    // rótulo Δpp sobre a aresta de divergência (o cruzamento mercado × pesquisa, a estrela do AFOS)
    const divLinks = links.filter((l) => l.kind === 'divergence')
    const linkLabelSel = root.append('g').selectAll<SVGTextElement, GLink>('text').data(divLinks).join('text')
      .text((l) => `Δ ${dec(Math.abs(l.div ?? 0).toFixed(1))}pp`)
      .attr('text-anchor', 'middle').attr('dy', -4)
      .attr('font-size', 12.5).attr('font-weight', 800)
      .attr('fill', (l) => divColor(l.div ?? 0))
      .attr('paint-order', 'stroke').attr('stroke', '#fff').attr('stroke-width', 4)

    const nodeSel = root.append('g').selectAll<SVGGElement, GNode>('g').data(nodes).join('g').style('cursor', 'grab')

    nodeSel.append('circle')
      .attr('r', (n) => n.r)
      .attr('fill', (n) => n.color)
      .attr('stroke', pal.nodeStroke).attr('stroke-width', 2)
      .attr('opacity', (n) => n.type === 'indicator' ? 0.85 : 1)

    nodeSel.append('text')
      .text((n) => n.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (n) => n.r + 12)
      .attr('font-size', (n) => n.type === 'election' ? 13 : n.type === 'indicator' ? 9 : 11)
      .attr('font-weight', (n) => n.type === 'election' || n.type === 'result' ? 700 : 500)
      .attr('fill', pal.label)
      .attr('paint-order', 'stroke').attr('stroke', pal.halo).attr('stroke-width', 3)

    nodeSel.append('text')
      .text((n) => n.sub ?? '')
      .attr('text-anchor', 'middle')
      .attr('dy', (n) => n.r + 24)
      .attr('font-size', 9)
      .attr('fill', pal.sub)
      .attr('paint-order', 'stroke').attr('stroke', pal.halo).attr('stroke-width', 2.5)

    const sim = d3.forceSimulation<GNode>(nodes)
      .force('link', d3.forceLink<GNode, GLink>(links).id((n) => n.id).distance((l) => l.kind === 'divergence' ? 115 : l.kind === 'tree' ? ((l.source as unknown as GNode).id === 'election' ? 125 : 80) : 95).strength((l) => l.kind === 'divergence' ? 0.3 : 0.55))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide<GNode>().radius((n) => n.r + 26))
      .force('x', d3.forceX(W / 2).strength(0.04))
      .force('y', d3.forceY(H / 2).strength(0.04))

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
    })

    const drag = d3.drag<SVGGElement, GNode>()
      .on('start', (e, n) => { if (!e.active) sim.alphaTarget(0.3).restart(); n.fx = n.x; n.fy = n.y })
      .on('drag', (e, n) => { n.fx = e.x; n.fy = e.y })
      .on('end', (e, n) => { if (!e.active) sim.alphaTarget(0); n.fx = null; n.fy = null })
    nodeSel.call(drag as never)

    return () => { sim.stop() }
  }, [data, electionLabel, locale, isBlue])

  const lbl = LBL[locale] || LBL['en']
  return (
    <div className={`w-full rounded-xl border shadow-sm overflow-hidden ${isBlue ? 'border-blue-400/30 bg-blue-900/40' : 'border-light-border bg-white'}`}>
      <svg ref={ref} viewBox="0 0 900 580" className="w-full" style={{ height: 'auto', display: 'block', background: isBlue ? '#0b327a' : '#f8fafc' }} />
      <div className={`flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 text-[11px] border-t ${isBlue ? 'text-blue-100/80 border-blue-400/20' : 'text-gray-600 border-light-border'}`}>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-5 h-1 rounded" style={{ background: '#ef4444' }} /> <b>{lbl.legend.div}</b></span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-5 h-1 rounded" style={{ background: '#22c55e' }} /> {lbl.legend.conv}</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: '#a78bfa' }} /> {lbl.legend.poll}</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ background: '#16a34a' }} /> {lbl.legend.hit}</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: '#ef4444' }} /> {lbl.legend.miss}</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#ea580c' }} /> {lbl.legend.press}</span>
        <span className={`ml-auto ${isBlue ? 'text-blue-300/60' : 'text-gray-400'}`}>{lbl.legend.hint}</span>
      </div>
    </div>
  )
}
