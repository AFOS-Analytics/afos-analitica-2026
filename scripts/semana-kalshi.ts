/**
 * ATALHO: a SEMANA de cada contrato da Kalshi, lida DIRETO do Neon. SÓ LEITURA.
 * Criado 22/Nov/2026, no dia em que a prontidão da Kalshi da França passou a
 * PRONTO (14 dias sem defeito): a partir dele a SÉRIE da Kalshi vale (variação
 * semanal e superlativo "desde 08/11/2026", regra do /atualizar-fra).
 *
 *   npx tsx scripts/semana-kalshi.ts --pais=fra                       # semana até hoje (UTC)
 *   npx tsx scripts/semana-kalshi.ts --pais=fra --de=2026-11-15 --ate=2026-11-22
 *   npx tsx scripts/semana-kalshi.ts --pais=fra --nomes="Marine Le Pen,David Lisnard"
 *
 * Por que existe: `semana-do-contrato.mjs` lê só a Polymarket, e do backup, que
 * tem cauda cega de até 24h. Aqui a fonte é `market.kalshi_precos` (só capturas
 * `ok`), sem cauda cega.
 *
 * Como ler a série: o cron só grava um preço quando algum contrato andou 0,5pp,
 * quando aparece contrato novo ou a cada 4h. O preço num instante é o ÚLTIMO
 * ponto gravado até ele (`herdado` quando o dia não teve ponto). Fechamento do
 * dia = último ponto até 23:59:59 UTC. Preço = último negócio, em pontos (0 a
 * 100); volume em CONTRATOS, nunca em dólares. `ultimaNegociacaoEm` diz quando
 * o preço foi negociado de fato (o preço pode ser de dias antes).
 *
 * 🧪 Controle positivo: o último ponto do Neon de cada candidato listado tem de
 * bater com o `ultimo` da rota /api/kalshi ao vivo. Diferença = o cron ainda não
 * gravou o movimento (até 30 min) ou o leitor está errado; o atalho diz qual.
 *
 * ⛔ País sempre explícito; sem --pais o atalho para. Nada aqui grava.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { resolverPaisKalshi } from '../lib/kalshi/leitura'

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const DIA = 864e5
const fimDoDia = (d: string) => new Date(`${d}T23:59:59.999Z`)
const maisDias = (d: string, n: number) => new Date(new Date(`${d}T00:00:00Z`).getTime() + n * DIA).toISOString().slice(0, 10)
const f2 = (v: number) => v.toFixed(2)
const pp = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}pp`
const hm = (d: Date) => d.toISOString().slice(5, 16).replace('T', ' ')

type Ponto = { t: Date; preco: number; vol: number | null; neg: Date | null }

async function main() {
  const pedido = arg('pais')
  if (!pedido) throw new Error('--pais é obrigatório (ex.: --pais=fra). Nunca um país por padrão.')
  const pais = resolverPaisKalshi(pedido)
  if (!pais) throw new Error(`--pais=${pedido} não tem Kalshi`)
  const ate = arg('ate') ?? new Date().toISOString().slice(0, 10)
  const de = arg('de') ?? maisDias(ate, -7)
  if (!(de < ate)) throw new Error(`--de (${de}) tem de ser antes de --ate (${ate})`)

  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('SEM BANCO: DATABASE_URL ausente (copiar .env.local para o worktree)')
  const linhas = await prisma.kalshiPreco.findMany({
    where: { captura: { pais, ok: true }, snapshotAt: { lte: fimDoDia(ate) } },
    select: { candidato: true, preco: true, volumeContratos: true, ultimaNegociacaoEm: true, snapshotAt: true, eventTicker: true },
    orderBy: { snapshotAt: 'asc' },
  })
  const capturas = await prisma.kalshiCaptura.count({ where: { pais, ok: true, startedAt: { gt: fimDoDia(de), lte: fimDoDia(ate) } } })
  await prisma.$disconnect()
  if (!linhas.length) throw new Error('nenhum preço da Kalshi no Neon para esse país')
  const inicioSerie = linhas[0].snapshotAt
  const eventos = [...new Set(linhas.map((l) => l.eventTicker))]

  const serie = new Map<string, Ponto[]>()
  for (const l of linhas) serie.set(l.candidato, [...(serie.get(l.candidato) ?? []), { t: l.snapshotAt, preco: l.preco, vol: l.volumeContratos, neg: l.ultimaNegociacaoEm }])
  const ate_ = (ps: Ponto[], t: Date) => { let r: Ponto | null = null; for (const p of ps) { if (p.t <= t) r = p; else break } return r }

  // Ao vivo, para o controle positivo.
  let vivo: Map<string, number> | null = null, vivoEm = ''
  try {
    const r = await fetch(`https://www.afos-analytics.com/api/kalshi?country=${pais}&fresh=1`, { signal: AbortSignal.timeout(30_000) })
    const j = (await r.json()) as { fetchedAt: string; winner?: { contratos: { candidato: string; ultimo: number | null }[] } }
    vivoEm = j.fetchedAt
    vivo = new Map((j.winner?.contratos ?? []).filter((c) => c.ultimo != null).map((c) => [c.candidato, c.ultimo as number]))
  } catch (e) { console.log(`⚠️ rota ao vivo não lida (${e instanceof Error ? e.message : String(e)}): controle positivo NÃO feito`) }

  const pedidos = arg('nomes')?.split(',').map((s) => s.trim()).filter(Boolean)
  const nomes = pedidos ?? [...serie.entries()]
    .map(([n, ps]) => [n, ate_(ps, fimDoDia(ate))?.preco ?? 0] as const)
    .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([n]) => n)

  console.log(`📆 SEMANA DA KALSHI · ${pais.toUpperCase()} · ${eventos.join(', ')} · fechamento de ${de} a ${ate} (UTC)`)
  console.log(`   fonte: Neon market.kalshi_precos (só capturas ok) · série desde ${inicioSerie.toISOString()} · ${capturas} captura(s) ok na semana`)
  console.log('   preço = último negócio, em pontos · volume em CONTRATOS · "herdado" = o dia não teve ponto gravado')

  const dias: string[] = []
  for (let d = de; d <= ate; d = maisDias(d, 1)) dias.push(d)
  let controleOk = 0, controleFalha = 0
  for (const n of nomes) {
    const ps = serie.get(n)
    if (!ps) { console.log(`\n   ${n}: sem série na Kalshi`); continue }
    const abre = ate_(ps, fimDoDia(de)), fecha = ate_(ps, fimDoDia(ate))
    if (!fecha) { console.log(`\n   ${n}: sem ponto até ${ate}`); continue }
    console.log(`\n   ${n}`)
    console.log(`      fecha em ${ate}: ${f2(fecha.preco)}${fecha.t.toISOString().slice(0, 10) === ate ? '' : ' (herdado)'} · último ponto gravado ${fecha.t.toISOString()}${fecha.neg ? ` · último negócio ${fecha.neg.toISOString()}` : ''}`)
    if (abre) console.log(`      Δ desde o fechamento de ${de} .... ${pp(fecha.preco - abre.preco)}   (abre ${f2(abre.preco)})`)
    else console.log(`      Δ: sem ponto até ${de} (contrato entrou depois)`)
    console.log('      caminho: ' + dias.map((d) => { const p = ate_(ps, fimDoDia(d)); return `${d.slice(5)} ${p ? f2(p.preco) + (p.t.toISOString().slice(0, 10) === d ? '' : '*') : '-'}` }).join(' | ') + '   (* herdado)')
    const naSemana = ps.filter((p) => p.t > fimDoDia(de) && p.t <= fimDoDia(ate))
    const cand = [...(abre ? [abre] : []), ...naSemana]
    const min = Math.min(...cand.map((p) => p.preco)), max = Math.max(...cand.map((p) => p.preco))
    const pMin = cand.find((p) => p.preco === min) as Ponto, pMax = cand.find((p) => p.preco === max) as Ponto
    // Antes da semana = pontos ANTERIORES ao de abertura (o de abertura é o próprio começo da semana).
    const antes = abre ? ps.filter((p) => p.t < abre.t) : []
    const ultAbaixo = [...antes].reverse().find((p) => p.preco <= min), ultAcima = [...antes].reverse().find((p) => p.preco >= max)
    console.log(`      pontos na semana: ${naSemana.length} · piso ${f2(min)} (1º em ${hm(pMin.t)}) · topo ${f2(max)} (1º em ${hm(pMax.t)}) · amplitude ${f2(max - min)}pp`)
    console.log(`      contra a série: piso ${f2(min)} · ${ultAbaixo ? `último ponto igual ou abaixo antes da semana em ${hm(ultAbaixo.t)} (${f2(ultAbaixo.preco)})` : `NUNCA abaixo antes, desde ${inicioSerie.toISOString().slice(0, 10)}`}`)
    console.log(`                      topo ${f2(max)} · ${ultAcima ? `último ponto igual ou acima antes da semana em ${hm(ultAcima.t)} (${f2(ultAcima.preco)})` : `NUNCA acima antes, desde ${inicioSerie.toISOString().slice(0, 10)}`}`)
    if (abre?.vol != null && fecha.vol != null) console.log(`      contratos negociados na semana (volume acumulado ${Math.round(abre.vol)} → ${Math.round(fecha.vol)}): ${Math.round(fecha.vol - abre.vol)}`)
    if (vivo) {
      const v = vivo.get(n)
      if (v == null) console.log('      controle: candidato fora da rota ao vivo')
      else if (Math.abs(v - fecha.preco) < 1e-9) { controleOk++; console.log(`      controle: rota ao vivo ${f2(v)} = último ponto do Neon ✓`) }
      else { controleFalha++; console.log(`      controle: rota ao vivo ${f2(v)} ≠ último ponto do Neon ${f2(fecha.preco)} (o cron grava só a cada 0,5pp ou 4h, e a cada ~30 min; conferir a hora)`) }
    }
  }
  if (vivo) console.log(`\n   CONTROLE POSITIVO (rota ao vivo ${vivoEm}): ${controleOk} de ${controleOk + controleFalha} iguais ao último ponto do Neon${controleOk * 2 < controleOk + controleFalha ? ' → ⛔ a MAIORIA não bate: leitor suspeito, nada acima vale até conferir' : controleFalha ? ' → poucas diferenças (movimento que o cron ainda não gravou, até 4h): conferir a hora' : ' → CONFERE'}`)
  // Mutação conferida em 22/Nov/2026: ler o PRIMEIRO ponto em vez do último dá 1 de 8 → ⛔.
  console.log(`   superlativo da Kalshi: "desde ${inicioSerie.toISOString().slice(0, 10).split('-').reverse().join('/')}" (início da série)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
