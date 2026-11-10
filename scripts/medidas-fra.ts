/**
 * ATALHO da ETAPA 3 do /atualizar-fra: mede, numa chamada só, TODO número que o
 * texto do painel da França costuma citar, com as MESMAS funções da tela.
 * Só leitura, nada é gravado. Criado 08/Nov/2026.
 *
 *   npx tsx scripts/medidas-fra.ts            # precisa de .env.local (lê o Neon)
 *
 * POR QUE EXISTE. O texto cita contagens que mudam SEM pesquisa nova: a janela de
 * 45 dias anda um dia por dia e uma lista antiga sai dela. "60 de 60 listas" de
 * ontem pode ser "57 de 57" hoje. Contar à mão a cada rodada é o caminho do
 * superlativo errado (memory/feedback_o_superlativo_erra_o_universo_nao_so_a_janela.md).
 * Aqui a conta sai de `lib/fr/painel.ts` e `lib/fr/candidatos.ts`, que a tela usa.
 *
 * A última seção, CONFERÊNCIA DO TEXTO, lista os números do texto publicado
 * (`public/fr/analise.pt-BR.json`) que NÃO aparecem nesta medição. Data, ano e
 * lei aparecem ali por natureza; preço ou contagem ali = número velho no texto.
 *
 * ⛔ País fixo: França. Nada aqui lê o Brasil ou os EUA.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { readFileSync } from 'fs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import {
  mediaPorCandidato, duelosSegundoTurno, listaPrincipalPorInstituto,
  type FrPollsData, type FrPressData, type FrPesquisa,
} from '../lib/fr/painel'
import { estatisticasPorCandidato, montarMedidas, selecionarPerfis, selecionarAnalise } from '../lib/fr/candidatos'

const DIA = 864e5
const agora = new Date()
const pt2 = (v: number) => v.toFixed(2).replace('.', ',')
const pt1 = (v: number) => v.toFixed(1).replace('.', ',')
const horas = (iso: string | Date) => ((agora.getTime() - new Date(iso).getTime()) / 36e5).toFixed(1) + 'h'
const medidos = new Set<string>()
/** Guarda o número como o texto em PT o escreve: decimal com vírgula. */
const anota = (...vs: (string | number)[]) => vs.forEach((v) => medidos.add(typeof v === 'number' ? String(v).replace('.', ',') : v))

type Ev = { markets?: { question?: string; outcomePrices?: string[]; closed?: boolean; volumeNum?: number }[] }

/** Igual à tela (FrDashboardClient): contrato aberto e com negócio; enchimento fora. */
function precoPorNome(ev: Ev | undefined, re: RegExp) {
  const m = new Map<string, number>()
  for (const k of ev?.markets ?? []) {
    const nome = k.question?.match(re)?.[1]?.trim()
    const p = Number(k.outcomePrices?.[0])
    if (nome && !k.closed && Number(k.volumeNum) > 0 && Number.isFinite(p)) m.set(nome, p * 100)
  }
  return m
}
const top = (m: Map<string, number>, n: number) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)

async function ultimo<T>(prisma: any, prefixo: string): Promise<{ em: Date; d: T } | null> {
  const r = await prisma.analysisReport.findFirst({
    where: { slug: { startsWith: prefixo } }, orderBy: { publishedAt: 'desc' },
    select: { bodyMarkdown: true, publishedAt: true },
  })
  return r ? { em: r.publishedAt, d: JSON.parse(r.bodyMarkdown) as T } : null
}

async function main() {
  console.log(`Medidas do texto (FRA) · agora ${agora.toISOString()}`)
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('SEM BANCO: DATABASE_URL ausente (copiar .env.local para o worktree)')

  // ── Coletas ────────────────────────────────────────────────────────────────
  const polls = await ultimo<FrPollsData>(prisma, 'fr-polls-')
  const press = await ultimo<FrPressData>(prisma, 'fr-press-')
  if (!polls) throw new Error('nenhum registro fr-polls')
  const P = polls.d
  const campoMax = P.pesquisas.filter((p) => p.publicavel).reduce((m, p) => (p.campo.fim > m ? p.campo.fim : m), '')
  console.log(`\n== PESQUISAS · registro de ${polls.em.toISOString()} (${horas(polls.em)}), coleta ${P.fetchedAt}`)
  console.log(`   ${P.qualidade.publicaveis} publicáveis de ${P.qualidade.pesquisas} · ficha diverge ${P.qualidade.fichaDiverge} · fichas oficiais SEM lista no CSV: ${P.qualidade.pendentes}`)
  console.log(`   campo mais recente publicável: ${campoMax}`)
  for (const f of P.pendentes.slice(0, 8)) console.log(`   ⏳ pendente: ${f.numero} ${f.rotulo}`)
  if (press) {
    const D = press.d
    console.log(`\n== IMPRENSA · registro de ${press.em.toISOString()} (${horas(press.em)}), ${D.itens.length} itens, ${D.qualidade.veiculosRepresentados} veículos`)
    const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(agora)
    const doDia = D.itens.filter((i) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(i.publicadoEm)) === hoje)
    console.log(`   do dia ${hoje} (Paris): ${doDia.length}`)
    for (const i of D.itens.slice(0, 14)) console.log(`   ${i.publicadoEm.slice(0, 16)} [${i.trilho}] ${i.casa}: ${i.titulo}`)
  }

  // ── Mercado ────────────────────────────────────────────────────────────────
  const base = baseDeLeitura()
  const pm = await (await fetch(`${base}/api/polymarket?country=fra&fresh=1`, { signal: AbortSignal.timeout(90000) })).json() as Record<string, any>
  const ka = await (await fetch(`${base}/api/kalshi?country=fra&fresh=1`, { signal: AbortSignal.timeout(90000) })).json() as Record<string, any>
  const vencer = precoPorNome(pm.winner, /^Will (.+?) win /)
  const segundo = precoPorNome(pm.secondRound, /^Will (.+?) advance /)
  const cedula = precoPorNome(pm.onBallot, /^Will (.+?) be on /)
  console.log(`\n== POLYMARKET · ${pm.fetchedAt} · degraded=${pm.degraded}`)
  const linha = (rot: string, m: Map<string, number>, n: number) => {
    console.log(`   ${rot}: ` + top(m, n).map(([c, v], i) => `${i + 1}º ${c} ${pt2(v)}`).join(' · '))
    for (const [, v] of top(m, n)) anota(pt2(v))
  }
  linha('vencer', vencer, 8)
  linha('vai ao 2º turno', segundo, 8)
  linha('na cédula', cedula, 12)
  // A conferência cobre TODO contrato, não só os impressos: em 10/Nov o texto citou
  // Riner na cédula (25,00, 13º do livro) e o corte em 12 o acusava como número velho.
  for (const m of [vencer, segundo, cedula]) for (const v of m.values()) anota(pt2(v))

  const kc: any[] = ka?.winner?.contratos ?? []
  const kalshi = new Map<string, number>(kc.filter((c) => c.ultimo !== null).map((c) => [c.candidato, c.ultimo]))
  console.log(`\n== KALSHI · ${ka.fetchedAt} · avaliacao ${JSON.stringify(ka?.winner?.avaliacao)}`)
  console.log('   vencer: ' + top(kalshi, 8).map(([c, v], i) => `${i + 1}º ${c} ${pt2(v)}`).join(' · '))
  for (const [, v] of kalshi) anota(pt2(v))
  for (const c of kc.slice().sort((a, b) => (b.ultimo ?? 0) - (a.ultimo ?? 0)).slice(0, 5)) {
    console.log(`   ${c.candidato}: compra ${c.compra} venda ${c.venda} anterior ${c.anterior} · última negociação ${c.ultimaNegociacaoEm ?? 'n/d'} · vol 24h ${Math.round(c.volume24hContratos)} contratos`)
  }

  // ── Pesquisas: as contagens que o texto usa ───────────────────────────────
  const pub: FrPesquisa[] = P.pesquisas.filter((p) => p.publicavel)
  const corte45 = new Date(agora.getTime() - 45 * DIA).toISOString().slice(0, 10)
  const l45 = pub.filter((p) => p.turno === 1 && p.campo.fim >= corte45)
  const d45 = pub.filter((p) => p.turno === 2 && p.intencoes.length === 2 && p.campo.fim >= corte45)
  const inst = (xs: FrPesquisa[]) => new Set(xs.map((p) => p.instituto.trim().toLowerCase())).size
  console.log(`\n== 1º TURNO, janela de 45 dias (campo desde ${corte45}): ${l45.length} listas, ${inst(l45)} institutos`)
  // as janelas e o último campo também são citados no texto
  const [, mesC, diaC] = campoMax.split('-')
  anota(l45.length, inst(l45), 45, 30, `${diaC}/${mesC}`, diaC, mesC)
  const lider = new Map<string, number>()
  for (const p of l45) lider.set(p.intencoes[0]?.candidato, (lider.get(p.intencoes[0]?.candidato) ?? 0) + 1)
  console.log('   primeiro lugar por lista: ' + [...lider.entries()].map(([c, n]) => `${c} ${n}`).join(' · '))

  const medias = mediaPorCandidato(pub, agora, 30)
  const estat = new Map(estatisticasPorCandidato(pub, agora, 45).map((e) => [e.candidato, e]))
  console.log(`\n== POR CANDIDATO (média = 30 dias; listas, 1º, top-2 e duelos = 45 dias)`)
  for (const m of medias.slice(0, 10)) {
    const e = estat.get(m.candidato)
    const pcts = l45.flatMap((p) => p.intencoes.filter((i) => i.candidato === m.candidato).map((i) => i.pct))
    const duelos = d45.filter((p) => p.intencoes.some((i) => i.candidato === m.candidato))
    const dpct = duelos.map((p) => (p.intencoes.find((i) => i.candidato === m.candidato) as { pct: number }).pct)
    const venceu = duelos.filter((p) => { const [a, b] = p.intencoes; return (a.candidato === m.candidato ? a.pct > b.pct : b.pct > a.pct) }).length
    const faixa = pcts.length ? `${Math.min(...pcts)}% a ${Math.max(...pcts)}%` : 'n/d'
    const dfaixa = dpct.length ? `${Math.min(...dpct)}% a ${Math.max(...dpct)}%` : 'n/d'
    console.log(`   ${m.candidato.padEnd(22)} média ${pt1(m.media)} (${m.listas} listas, ${m.institutos} inst., ${m.minimo}-${m.maximo})` +
      ` | 45d: ${e?.listas ?? 0} listas, 1º em ${e?.primeiro ?? 0}, top-2 em ${e?.top2 ?? 0}, faixa ${faixa}` +
      ` | duelos ${venceu}/${duelos.length} vencidos, faixa ${dfaixa}`)
    anota(pt1(m.media), m.listas, m.institutos, m.minimo, m.maximo, e?.listas ?? 0, e?.primeiro ?? 0, e?.top2 ?? 0, duelos.length, venceu)
    if (pcts.length) anota(Math.min(...pcts), Math.max(...pcts))
    if (dpct.length) anota(Math.min(...dpct), Math.max(...dpct))
  }
  console.log(`\n== 2º TURNO, janela de 45 dias: ${d45.length} duelos (${inst(d45)} institutos); na tela, rodada mais recente de cada um: ${duelosSegundoTurno(pub, agora, 45).length}`)
  console.log(`== listas principais na tela: ${listaPrincipalPorInstituto(pub, agora, 45).length} institutos`)

  // ── Quem entra em cada seção ───────────────────────────────────────────────
  const med = montarMedidas(medias, vencer, segundo, cedula)
  const sel = selecionarAnalise(med)
  console.log(`\n== PERFIS (8, mais de 5 no mercado ou na média): ${selecionarPerfis(med).join(' · ')}`)
  console.log(`== ANÁLISE CRITERIOSA: ${sel.nomes.join(' · ')}  (só pesquisa: ${sel.soPesquisa.join(', ') || '-'}; só mercado: ${sel.soMercado.join(', ') || '-'})`)

  // ── Conferência do texto publicado ─────────────────────────────────────────
  const txt = JSON.parse(readFileSync('public/fr/analise.pt-BR.json', 'utf8')) as { updatedAt: string; paragrafos: string[] }
  const nums = (txt.paragrafos.join(' ').replace(/\d+[ºª]/g, '').match(/\d+(?:,\d+)?/g) ?? [])
  const fora = [...new Set(nums)].filter((n) => !medidos.has(n))
  console.log(`\n== CONFERÊNCIA DO TEXTO (analise.pt-BR.json de ${txt.updatedAt}): ${nums.length} números, ${fora.length} distintos fora desta medição`)
  console.log(`   fora: ${fora.join(' · ') || '(nenhum)'}`)
  console.log('   (data, ano, lei e dia do turno aparecem aqui por natureza; preço ou contagem aqui = número velho no texto)')

  // ── Conferência do PREÇO pela etiqueta ─────────────────────────────────────
  // A conferência acima vê o NÚMERO, não de quem ele é. Em 10/Nov/2026 o texto
  // dizia "Kalshi 49,00" para Le Pen, que já estava a 50,00, e passou calado:
  // 49,00 era, na mesma medição, o preço de Jean Lassalle na cédula. Aqui cada
  // preço do texto (2 casas) é procurado entre os contratos dos candidatos que
  // o PRÓPRIO parágrafo cita, com o livro e o contrato impressos para leitura.
  const etiquetas = new Map<string, string[]>()
  const etiqueta = (livro: string, m: Map<string, number>) => {
    for (const [c, v] of m) etiquetas.set(pt2(v), [...(etiquetas.get(pt2(v)) ?? []), `${livro} · ${c}`])
  }
  etiqueta('Polymarket vencer', vencer); etiqueta('Polymarket 2º turno', segundo)
  etiqueta('Polymarket cédula', cedula); etiqueta('Kalshi vencer', kalshi)
  const sobrenome = (c: string) => c.split(' ').slice(1).join(' ') || c
  console.log('\n== CONFERÊNCIA DO PREÇO POR ETIQUETA (de quem é cada preço do texto nesta medição)')
  let suspeitos = 0
  txt.paragrafos.forEach((par, i) => {
    for (const p of par.match(/\d+,\d{2}\b/g) ?? []) {
      const donos = etiquetas.get(p) ?? []
      const casa = donos.filter((d) => par.includes(sobrenome(d.split(' · ')[1])))
      if (!casa.length) suspeitos++
      console.log(`   §${i + 1} ${p.padStart(6)} ${casa.length ? '✓' : '⚠️'} ${(casa.length ? casa : donos).join(' | ') || 'não está nesta medição'}${casa.length ? '' : donos.length ? '  ← de ninguém que o parágrafo cita' : ''}`)
    }
  })
  console.log(`   ${suspeitos ? `⚠️ ${suspeitos} preço(s) sem dono no parágrafo: número velho ou do candidato errado` : 'todo preço do texto é de um candidato citado no parágrafo; conferir o LIVRO e o CONTRATO acima'}`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error('medidas-fra falhou:', e instanceof Error ? e.message : e); process.exit(1) })
