/**
 * ATALHO (26/Nov/2026): A SEMANA DAS PESQUISAS da França, entre o fechamento de
 * um dia e o de outro (ou agora). SÓ LEITURA. Criado para o Tradeoff França №1,
 * que precisava da "média de 19/11 contra a de hoje" e das listas que entraram
 * no meio, e só achava isso refazendo a conta à mão.
 *
 *   npx tsx scripts/semana-pesquisas-fra.ts --de=2026-11-19 [--ate=2026-11-26]
 *
 * Cada ponta é a TELA daquele momento: o registro `fr-polls` que estava gravado
 * no fim do dia (último com publishedAt até 23:59:59 UTC), lido com as funções
 * da tela (`mediaPorCandidato`, `listaPrincipalPorInstituto`, `listasNaJanela`)
 * e a hora de corte daquele momento. Sem --ate, a ponta final é o último
 * registro e a hora de agora.
 * Mostra: média de 30 dias por candidato nas duas pontas (com listas e
 * institutos), as listas que ENTRARAM e as que SAÍRAM da janela de 45 dias
 * (por pollId, com instituto, cliente, campo, amostra e ficha), e a lista
 * principal de cada instituto nas duas pontas.
 * 🧪 Controle: com --de=2026-11-16 --ate=2026-11-23 tem de reproduzir a Weekly
 * França №1 (Le Pen 34.1 → 33.5, Philippe 13.3 → 11.7, Lisnard 8.1 → 9.5).
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })
import type { FrPesquisa } from '../lib/fr/painel'
import { mediaPorCandidato, listaPrincipalPorInstituto } from '../lib/fr/painel'
import { listasNaJanela } from '../lib/fr/candidatos'

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)

async function main() {
  const de = arg('de'), ate = arg('ate')
  if (!de || !/^\d{4}-\d{2}-\d{2}$/.test(de)) throw new Error('uso: --de=AAAA-MM-DD [--ate=AAAA-MM-DD]')
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('SEM BANCO: DATABASE_URL ausente (copiar .env.local para o worktree)')

  const ponta = async (dia: string | undefined) => {
    const agora = dia ? new Date(`${dia}T23:59:59Z`) : new Date()
    const r = await prisma.analysisReport.findFirst({
      where: { slug: { startsWith: 'fr-polls-' }, publishedAt: { lte: agora } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, bodyMarkdown: true, publishedAt: true },
    })
    if (!r) throw new Error(`nenhum fr-polls gravado até ${agora.toISOString()}`)
    const pesquisas = (JSON.parse(r.bodyMarkdown) as { pesquisas: FrPesquisa[] }).pesquisas
    return { agora, slug: r.slug, gravado: r.publishedAt, pesquisas }
  }
  const A = await ponta(de), B = await ponta(ate)
  await prisma.$disconnect()

  console.log(`🗳️ SEMANA DAS PESQUISAS · FRANÇA · ${de} → ${ate ?? 'agora'}`)
  for (const [n, p] of [['início', A], ['fim', B]] as const) console.log(`   ${n}: tela de ${p.agora.toISOString()} · registro ${p.slug} (gravado ${p.gravado?.toISOString()})`)

  const mA = new Map(mediaPorCandidato(A.pesquisas, A.agora).map((m) => [m.candidato, m]))
  const mB = mediaPorCandidato(B.pesquisas, B.agora)
  const universo = (p: typeof A) => {
    const j = listasNaJanela(p.pesquisas, p.agora, 30).filter((x) => x.turno === 1)
    return `${j.length} listas de ${new Set(j.map((x) => x.instituto.trim().toLowerCase())).size} institutos`
  }
  console.log(`\n== MÉDIA DE 30 DIAS (1º turno) · início ${universo(A)} · fim ${universo(B)}`)
  for (const m of mB.slice(0, 14)) {
    const a = mA.get(m.candidato)
    const d = a ? (m.media - a.media).toFixed(1) : 'n/d'
    console.log(`   ${m.candidato.padEnd(24)} ${a ? a.media.toFixed(1).padStart(5) : '  n/d'} (${a?.listas ?? 0} listas, ${a?.institutos ?? 0} inst.) → ${m.media.toFixed(1).padStart(5)} (${m.listas} listas, ${m.institutos} inst.)  Δ ${d}`)
  }

  const jA = listasNaJanela(A.pesquisas, A.agora), jB = listasNaJanela(B.pesquisas, B.agora)
  const idsA = new Set(jA.map((p) => p.pollId)), idsB = new Set(jB.map((p) => p.pollId))
  const rodada = (p: FrPesquisa) => `${p.instituto}/${p.cliente} campo ${p.campo.inicio} a ${p.campo.fim} · amostra ${p.amostra ?? 'n/d'} · ficha ${p.ficha.numero ?? '-'}`
  const agrupa = (ps: FrPesquisa[]) => {
    const m = new Map<string, { t1: number; t2: number }>()
    for (const p of ps) { const k = rodada(p), x = m.get(k) ?? { t1: 0, t2: 0 }; if (p.turno === 1) x.t1++; else x.t2++; m.set(k, x) }
    return [...m].sort()
  }
  const entraram = jB.filter((p) => !idsA.has(p.pollId)), sairam = jA.filter((p) => !idsB.has(p.pollId))
  console.log(`\n== ENTRARAM na janela de 45 dias: ${entraram.filter((p) => p.turno === 1).length} listas de 1º turno e ${entraram.filter((p) => p.turno === 2).length} duelos`)
  for (const [k, x] of agrupa(entraram)) console.log(`   + ${k} · ${x.t1} listas, ${x.t2} duelos`)
  console.log(`== SAÍRAM: ${sairam.filter((p) => p.turno === 1).length} listas de 1º turno e ${sairam.filter((p) => p.turno === 2).length} duelos`)
  for (const [k, x] of agrupa(sairam)) console.log(`   - ${k} · ${x.t1} listas, ${x.t2} duelos`)

  const lA = new Map(listaPrincipalPorInstituto(A.pesquisas, A.agora).map((l) => [l.instituto, l]))
  console.log(`\n== LISTA PRINCIPAL por instituto (fim; ⟳ = rodada nova desde o início)`)
  for (const l of listaPrincipalPorInstituto(B.pesquisas, B.agora)) {
    const velho = lA.get(l.instituto)
    const nova = !velho || velho.campo.fim !== l.campo.fim
    console.log(`   ${nova ? '⟳' : ' '} ${l.instituto}/${l.cliente} campo até ${l.campo.fim} · ficha ${l.ficha.numero ?? '-'} · ${l.intencoes.slice(0, 6).map((i) => `${i.candidato.split(' ').pop()} ${i.pct}`).join(' · ')}`)
  }
}
main().catch((e) => { console.error('❌', e instanceof Error ? e.message : e); process.exit(1) })
