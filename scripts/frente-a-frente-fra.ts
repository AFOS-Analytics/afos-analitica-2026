/**
 * ATALHO (24/Nov/2026): FRENTE A FRENTE de dois candidatos nas listas de 1º
 * turno da França. SÓ LEITURA. Responde "em quantas listas que testam os dois
 * A está à frente de B", a conta que a Weekly №1 publicou ("Philippe à frente
 * de Lisnard em 25 de 29 listas") e que muda com pesquisa nova e com a janela.
 *
 *   npx tsx scripts/frente-a-frente-fra.ts --a="Édouard Philippe" --b="David Lisnard"
 *   npx tsx scripts/frente-a-frente-fra.ts --a=... --b=... --em=2026-11-30   # a tela daquele dia (00:30 UTC), com os dados de agora
 *   npx tsx scripts/frente-a-frente-fra.ts --a=... --b=... --dias=30
 *
 * Universo: as listas de `listasNaJanela` (lib/fr/candidatos.ts), as MESMAS das
 * contagens da tela (publicáveis, campo encerrado na janela pela data UTC),
 * lidas do último `fr-polls` do Neon. Empate é contado à parte.
 * 🧪 Controle: o número de listas de A e de B tem de ser o que
 * `estatisticasPorCandidato` (a função da tela) conta; se não for, SEM VALOR.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })
import type { FrPesquisa } from '../lib/fr/painel'
import { listasNaJanela, estatisticasPorCandidato } from '../lib/fr/candidatos'

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)

async function main() {
  const A = arg('a'), B = arg('b')
  if (!A || !B) throw new Error('uso: --a="Nome Completo" --b="Nome Completo" [--em=AAAA-MM-DD] [--dias=45]')
  const dias = Number(arg('dias') ?? 45)
  const em = arg('em') ? new Date(`${arg('em')}T00:30:00Z`) : new Date()

  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('SEM BANCO: DATABASE_URL ausente (copiar .env.local para o worktree)')
  const r = await prisma.analysisReport.findFirst({ where: { slug: { startsWith: 'fr-polls-' } }, orderBy: { publishedAt: 'desc' }, select: { slug: true, bodyMarkdown: true, publishedAt: true } })
  await prisma.$disconnect()
  if (!r) throw new Error('nenhum fr-polls no Neon')
  const pesquisas = (JSON.parse(r.bodyMarkdown) as { pesquisas: FrPesquisa[] }).pesquisas

  const janela = listasNaJanela(pesquisas, em, dias).filter((p) => p.turno === 1)
  const pct = (p: FrPesquisa, c: string) => p.intencoes.find((i) => i.candidato === c)?.pct
  const comAmbos = janela.filter((p) => pct(p, A) !== undefined && pct(p, B) !== undefined)
  const aFrente = comAmbos.filter((p) => (pct(p, A) as number) > (pct(p, B) as number))
  const bFrente = comAmbos.filter((p) => (pct(p, B) as number) > (pct(p, A) as number))
  const empate = comAmbos.length - aFrente.length - bFrente.length

  console.log(`🆚 FRENTE A FRENTE · FRANÇA · ${A} x ${B}`)
  console.log(`   fonte: ${r.slug} (gravado ${r.publishedAt?.toISOString()}) · tela de ${em.toISOString()} · janela ${dias} dias (campo encerrado)`)
  console.log(`   listas de 1º turno na janela: ${janela.length} · testam os dois: ${comAmbos.length}`)
  console.log(`   ${A} à frente: ${aFrente.length} · ${B} à frente: ${bFrente.length} · empate: ${empate}`)
  const porInst = new Map<string, { a: number; b: number; e: number }>()
  for (const p of comAmbos) {
    const k = p.instituto, x = porInst.get(k) ?? { a: 0, b: 0, e: 0 }
    const va = pct(p, A) as number, vb = pct(p, B) as number
    if (va > vb) x.a++; else if (vb > va) x.b++; else x.e++
    porInst.set(k, x)
  }
  for (const [k, x] of [...porInst].sort()) console.log(`      ${k.padEnd(22)} ${A.split(' ').pop()} ${x.a} · ${B.split(' ').pop()} ${x.b}${x.e ? ` · empate ${x.e}` : ''}`)
  for (const p of bFrente.length <= aFrente.length ? bFrente : aFrente) console.log(`      lista minoritária: ${p.pollId} ${p.instituto}/${p.cliente} campo até ${p.campo.fim} · ${A.split(' ').pop()} ${pct(p, A)} x ${B.split(' ').pop()} ${pct(p, B)}`)

  const est = new Map(estatisticasPorCandidato(pesquisas, em, dias).map((e) => [e.candidato, e]))
  const nA = janela.filter((p) => pct(p, A) !== undefined).length, nB = janela.filter((p) => pct(p, B) !== undefined).length
  const ok = est.get(A)?.listas === nA && est.get(B)?.listas === nB
  console.log(`\n   CONTROLE (listas de cada um = função da tela): ${A} ${nA}/${est.get(A)?.listas ?? 0} · ${B} ${nB}/${est.get(B)?.listas ?? 0} → ${ok ? 'CONFERE' : '⛔ SEM VALOR'}`)
  process.exit(ok ? 0 : 1)
}
main().catch((e) => { console.error('❌', e instanceof Error ? e.message : e); process.exit(1) })
