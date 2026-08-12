/**
 * Diagnostica um mercado de FAIXAS (distribuição) que não fecha em 100%.
 *
 * POR QUE EXISTE
 * O painel só publica uma distribuição se as faixas somarem entre 95% e 105%.
 * Quando uma reprova, existem três causas possíveis e elas pedem ações opostas:
 *
 *   1. FAIXA DUPLICADA ou BURACO na partição  -> defeito de coleta, corrigir o coletor
 *   2. EXCESSO UNIFORME entre as faixas       -> viés de book, a FORMA ainda serve
 *   3. EXCESSO CONCENTRADO NA CAUDA           -> favorite-longshot, o centro serve, a cauda não
 *
 * Distinguir 2 de 3 é o que este script faz, com o TESTE DO EXCESSO UNIFORME:
 * se o excesso fosse uniforme, a fatia NORMALIZADA do centro seria invariante à
 * soma bruta. Se ela anda junto com a soma, o excesso está na cauda.
 * (Método em memory/reference_teste_do_excesso_uniforme.md, construído em 10/Ago
 * para o book de cadeiras do Senado brasileiro.)
 *
 * A checagem de partição (causa 1) é feita antes, lendo os rótulos das faixas.
 *
 * Uso:
 *   npx tsx scripts/check-distribuicao.ts house-seats
 *   npx tsx scripts/check-distribuicao.ts senate-seats
 *   npx tsx scripts/check-distribuicao.ts --lista        # mostra os slugs disponíveis
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

const fmt = (n: number) => n.toFixed(2).replace('.', ',')
const brt = (t: number) => new Date(t - 3 * 3600e3).toISOString().slice(5, 16).replace('T', ' ')

/**
 * Extrai os limites da faixa. Cobre os DOIS formatos, porque eles diferem:
 *   API do Polymarket : "Will ... hold between 190 and 194 House seats ..."
 *   banco (outcomeName): "190–194 cad."  com TRAVESSÃO TIPOGRÁFICO (U+2013), "< 190 cad.", "≥ 230 cad."
 * ⚠️ Ler o formato errado devolve zero faixa legível, e aí este script dá VERDE
 * sem ter medido nada. Foi o que aconteceu na primeira versão, em 11/Ago/2026.
 */
function limites(nome: string): { lo: number; hi: number } | null {
  let m = nome.match(/between\s+(\d+)\s+and\s+(\d+)/i)
  if (m) return { lo: +m[1], hi: +m[2] }
  m = nome.match(/(\d+)\s*[–—-]\s*(\d+)/) // travessão, meia-risca ou hífen
  if (m) return { lo: +m[1], hi: +m[2] }
  m = nome.match(/(?:below|under|fewer than|<)\s*(\d+)/i)
  if (m) return { lo: -Infinity, hi: +m[1] - 1 }
  m = nome.match(/(?:≥|at least|>=)\s*(\d+)/i)
  if (m) return { lo: +m[1], hi: Infinity }
  m = nome.match(/(?:≤|at most|<=|or fewer)\s*(\d+)/i) || nome.match(/(\d+)\s+or\s+fewer/i)
  if (m) return { lo: -Infinity, hi: +m[1] }
  m = nome.match(/(\d+)\s+or\s+more/i)
  if (m) return { lo: +m[1], hi: Infinity }
  m = nome.match(/exactly\s+(\d+)/i)
  if (m) return { lo: +m[1], hi: +m[1] }
  // rótulo em PAR: "22 ou 23 cad.", "24 or 25". Sem isto, "22 ou 23" vira [22,22]
  // e o verificador inventa um buraco entre 22 e 24 que não existe.
  m = nome.match(/(\d+)\s+(?:ou|or)\s+(\d+)/i)
  if (m) return { lo: +m[1], hi: +m[2] }
  // faixa de valor ÚNICO: "48 cad.", "50 seats". Só depois de descartar tudo acima,
  // senão "< 190 cad." casaria aqui e viraria a faixa [190,190].
  m = nome.match(/^\s*(\d+)\b/)
  return m ? { lo: +m[1], hi: +m[1] } : null
}

/** Cauda = faixa aberta de um dos lados. É onde o viés de longshot mora. */
function ehCauda(nome: string) {
  const l = limites(nome)
  return l != null && (l.lo === -Infinity || l.hi === Infinity)
}

async function main() {
  const args = process.argv.slice(2)
  const { prisma } = await import('../lib/db')
  if (!prisma) { console.error('SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  if (args.includes('--lista') || args.length === 0) {
    const ms = await prisma.market.findMany({ select: { slug: true, _count: { select: { outcomes: true } } } })
    console.log('\nmercados com 6 ou mais desfechos (candidatos a distribuição):')
    ms.filter(m => m._count.outcomes >= 6).forEach(m => console.log(`  ${m.slug}  (${m._count.outcomes})`))
    await prisma.$disconnect(); return
  }

  const busca = args[0]
  const cand = await prisma.market.findMany({
    where: { slug: { contains: busca, mode: 'insensitive' } },
    select: { slug: true, _count: { select: { outcomes: true } } },
  })
  const alvo = cand.sort((a, b) => b._count.outcomes - a._count.outcomes)[0]
  if (!alvo) { console.error(`nenhum mercado casa com "${busca}"`); process.exit(1) }
  console.log(`\nmercado: ${alvo.slug}  (${alvo._count.outcomes} faixas)`)

  const pontos = await prisma.marketPrice.findMany({
    where: { market: { slug: alvo.slug } },
    select: { price: true, snapshotAt: true, outcome: { select: { outcomeName: true } } },
    orderBy: { snapshotAt: 'asc' },
  })
  if (pontos.length === 0) { console.error('sem série'); process.exit(1) }

  const porT = new Map<number, Record<string, number>>()
  for (const p of pontos) {
    const t = p.snapshotAt.getTime()
    if (!porT.has(t)) porT.set(t, {})
    porT.get(t)![p.outcome?.outcomeName ?? ''] = p.price
  }
  const minFaixas = Math.max(2, Math.floor(alvo._count.outcomes * 0.8))
  const caps = [...porT.entries()].sort((a, b) => a[0] - b[0])
    .map(([t, linha]) => ({ t, linha, soma: Object.values(linha).reduce((a, b) => a + b, 0), n: Object.keys(linha).length }))
    .filter(c => c.n >= minFaixas)
  if (caps.length === 0) { console.error('nenhuma captura completa'); process.exit(1) }

  // ---------- CAUSA 1: a partição fecha? ----------
  const nomes = Object.keys(caps[caps.length - 1].linha)
  const faixas = nomes.map(n => ({ n, lim: limites(n) })).filter(x => x.lim).sort((a, b) => a.lim!.lo - b.lim!.lo)
  console.log(`\n1️⃣  PARTIÇÃO  (${faixas.length} de ${nomes.length} faixas com limites legíveis)`)
  // 🔴 TRAVA: sem ler os limites, este script não mede nada e não pode dar verde.
  if (faixas.length < nomes.length) {
    console.error(
      `\n❌ ABORTADO: ${nomes.length - faixas.length} faixa(s) sem limites legíveis.\n` +
      `   ilegíveis: ${nomes.filter(n => !limites(n)).map(n => `"${n}"`).join(', ')}\n` +
      `   O formato do rótulo mudou. Corrigir limites() ANTES de ler qualquer resultado:\n` +
      `   um diagnóstico que não lê as faixas daria "partição limpa" sem ter olhado nenhuma.`
    )
    await prisma.$disconnect()
    process.exit(1)
  }
  /**
   * ⚠️ Grandeza DISCRETA (cadeiras) e CONTÍNUA (votos) têm regras opostas de borda.
   * Em cadeiras, 190-194 e 195-199 são contíguas e 190-194 com 194-199 é sobreposição.
   * Em votos, "85-90m" e "90-95m" COMPARTILHAM a borda 90m de propósito, e tratar
   * isso como sobreposição faz o verificador gritar lobo em toda captura.
   */
  const discreta = /cad\.|gov\.|seat|assento|governor|senador/i.test(nomes.join(' '))
  console.log(`   grandeza: ${discreta ? 'DISCRETA (borda compartilhada É sobreposição)' : 'CONTÍNUA (borda compartilhada é normal)'}`)
  const problemas: string[] = []
  for (let i = 1; i < faixas.length; i++) {
    const ant = faixas[i - 1].lim!, at = faixas[i].lim!
    if (discreta) {
      if (at.lo <= ant.hi) problemas.push(`SOBREPOSIÇÃO: "${faixas[i - 1].n}" e "${faixas[i].n}"`)
      else if (at.lo > ant.hi + 1) problemas.push(`BURACO entre ${ant.hi} e ${at.lo}`)
    } else {
      if (at.lo < ant.hi) problemas.push(`SOBREPOSIÇÃO REAL: "${faixas[i - 1].n}" e "${faixas[i].n}"`)
      // tolera 1 unidade: "< 85m" sai como hi=84 pela convenção discreta do parser
      else if (at.lo > ant.hi + 1) problemas.push(`BURACO entre ${ant.hi} e ${at.lo}`)
    }
  }
  const dupes = nomes.filter((n, i) => nomes.indexOf(n) !== i)
  if (dupes.length) problemas.push(`RÓTULO REPETIDO: ${dupes.join(', ')}`)
  if (problemas.length) { console.log('   ❌ ' + problemas.join('\n   ❌ ')); console.log('   => é DEFEITO DE COLETA, corrigir o coletor antes de qualquer leitura') }
  else console.log('   ✅ partição limpa: sem sobreposição, sem buraco, sem rótulo repetido')

  // ---------- CAUSA 2 x 3: onde está o excesso ----------
  const caudas = nomes.filter(ehCauda)
  const centro = nomes.filter(n => !ehCauda(n))
  console.log(`\n2️⃣  ONDE ESTÁ O EXCESSO   (cauda: ${caudas.length} faixas | centro: ${centro.length})`)
  console.log('   captura BRT       soma      centro cru   centro NORM   cauda cru   cauda NORM')
  for (const c of caps.slice(-12)) {
    const cc = centro.reduce((s, n) => s + (c.linha[n] ?? 0), 0)
    const tc = caudas.reduce((s, n) => s + (c.linha[n] ?? 0), 0)
    console.log(`   ${brt(c.t)}  ${fmt(c.soma).padStart(7)}%  ${fmt(cc).padStart(9)}%  ${fmt(cc / c.soma * 100).padStart(10)}%  ${fmt(tc).padStart(8)}%  ${fmt(tc / c.soma * 100).padStart(9)}%`)
  }

  const xs = caps.map(c => c.soma)
  const ys = caps.map(c => centro.reduce((s, n) => s + (c.linha[n] ?? 0), 0) / c.soma * 100)
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length
  const my = ys.reduce((a, b) => a + b, 0) / ys.length
  const den = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0))
  const r = den === 0 ? 0 : xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / den

  console.log(`\n3️⃣  TESTE DO EXCESSO UNIFORME   (${caps.length} capturas)`)
  console.log(`   soma bruta      : de ${fmt(Math.min(...xs))}% a ${fmt(Math.max(...xs))}%`)
  console.log(`   fatia do centro : de ${fmt(Math.min(...ys))}% a ${fmt(Math.max(...ys))}%`)
  console.log(`   correlação r    : ${r.toFixed(3)}`)
  if (Math.max(...xs) - Math.min(...xs) < 3) {
    console.log('   ⚠️  a soma bruta quase não variou na série; o teste não conclui nada aqui.')
  } else if (r < -0.5) {
    console.log('   => a fatia do centro CAI quando a soma sobe: o EXCESSO ESTÁ NA CAUDA.')
    console.log('      A forma do centro sobrevive à normalização; a cauda, não.')
  } else if (r > 0.5) {
    console.log('   => a fatia do centro SOBE com a soma: o excesso está no CENTRO.')
  } else {
    console.log('   => sem relação clara: o excesso é aproximadamente UNIFORME.')
    console.log('      Normalizar preserva a forma, mas o NÍVEL de cada faixa não vale.')
  }
  // ---------- com que frequência ele passa no portão de 95-105%? ----------
  const passa = caps.filter(c => c.soma >= 95 && c.soma <= 105).length
  const pct = (passa / caps.length) * 100
  const t0 = brt(caps[0].t), t1 = brt(caps[caps.length - 1].t)
  console.log(`\n4️⃣  PORTÃO DE 95-105%, sobre as ${caps.length} capturas de ${t0} a ${t1}`)
  console.log(`   passou em ${passa} (${fmt(pct)}%), reprovou em ${caps.length - passa}`)
  console.log(
    pct < 25
      ? '   => reprovar é o COMPORTAMENTO NORMAL deste book, não um evento. Publicar\n' +
        '      "reprovou hoje" como novidade seria transformar rotina em notícia.'
      : pct > 75
        ? '   => este book costuma fechar. Reprovar AQUI é evento e merece nota.'
        : '   => o book fecha em parte das capturas. A leitura depende do dia, e o\n' +
          '      portão tem de ser reavaliado a cada rodada, nunca herdado.'
  )

  console.log('\n   ⚠️  Em qualquer dos casos, distribuição reprovada NÃO se publica como se valesse.')
  await prisma.$disconnect()
}
main().catch(e => { console.error('ERRO:', (e as Error).message.slice(0, 300)); process.exit(1) })
