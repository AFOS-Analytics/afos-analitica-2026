/**
 * Trava de captura do Polymarket.
 *
 * POR QUE EXISTE
 * Em 24/Jul/2026 o /atualizar capturou o book às 15h38 num momento de spread
 * largo e publicou. Metade dos deltas estava errada e DOIS TINHAM SINAL
 * INVERTIDO: Michelle e Caiado foram publicados em alta e fecharam em queda.
 * O snapshot passou por todos os validadores porque era internamente coerente,
 * ou seja, os deltas batiam com os valores. O erro estava na ENTRADA.
 * Nenhuma checagem sobre o JSON pega isso. Só a captura pega.
 *
 * COMO FUNCIONA
 * O Polymarket é arbitrado em minutos. Logo, duas leituras independentes
 * separadas por alguns minutos que CONCORDAM são um preço; que DISCORDAM são
 * um book em trânsito. A trava lê duas vezes e só libera se concordarem.
 *
 * As duas leituras usam ?fresh=1, que ignora o cache de dados do proxy. Sem
 * isso a trava leria o mesmo cache duas vezes e aprovaria qualquer coisa.
 *
 * USO
 *   npx tsx scripts/capture-guard.ts                 # padrão, Brasil, 8 min
 *   npx tsx scripts/capture-guard.ts --pais=us       # midterms dos EUA
 *   npx tsx scripts/capture-guard.ts --intervalo=3   # intervalo em minutos
 *   npx tsx scripts/capture-guard.ts --json          # saída JSON para pipeline
 *
 * SAÍDA
 *   exit 0 = as duas leituras concordam, pode publicar a SEGUNDA
 *   exit 1 = discordam ou proxy degradado, NÃO publicar
 */

const PROXY_BASE = 'https://www.afos-analytics.com/api/polymarket?fresh=1'

/** Divergência tolerada entre as duas leituras, em pontos percentuais. */
const TOLERANCIA_PP = 0.20

/** Só vale a pena vigiar quem tem preço relevante. Abaixo disso é ruído de book fino. */
const PISO_RELEVANCIA_PCT = 0.5

/**
 * ⚠️ MERCADO DE DISTRIBUIÇÃO FICA DE FORA, nos dois países.
 *
 * No Brasil a `inflation` nunca esteve nesta lista, e a razão vale igual para os
 * EUA: uma distribuição tem dezenas de faixas finas, cada uma com book raso, e
 * elas oscilam entre si sem que o preço da eleição tenha mudado. Vigiá-las com
 * tolerância de 0,20pp produziria bloqueio constante por ruído, e trava que
 * bloqueia todo dia é trava que alguém aprende a pular.
 *
 * O que segura a qualidade das faixas é OUTRO portão, o de coerência: a seção
 * só mostra a distribuição se as faixas somarem entre 95% e 105%.
 */
const BOOKS_BR = ['presidential', 'secondPlace', 'thirdPlace', 'stf', 'senate'] as const
const BOOKS_US = ['house', 'senate', 'asScheduled'] as const

interface Leitura {
  precos: Map<string, number>
  fetchedAt: string | null
  degraded: boolean
  failedCount: number
}

function limpaNome(q: string): string {
  return String(q)
    .replace(/^Will\s+/i, '')
    .replace(/\s+win the.*$/i, '')
    .replace(/\s+finish in .*$/i, '')
    .replace(/\?$/, '')
    .trim()
}

async function ler(proxy: string, books: readonly string[]): Promise<Leitura> {
  const res = await fetch(proxy, { cache: 'no-store' })
  if (!res.ok) throw new Error(`proxy devolveu HTTP ${res.status}`)
  const j = await res.json() as Record<string, any>

  const precos = new Map<string, number>()
  for (const book of books) {
    for (const m of j?.[book]?.markets ?? []) {
      const p = Number(m?.outcomePrices?.[0])
      if (!Number.isFinite(p)) continue
      precos.set(`${book}:${limpaNome(m.question)}`, Number((p * 100).toFixed(2)))
    }
  }
  return {
    precos,
    fetchedAt: j?.fetchedAt ?? null,
    degraded: !!j?.degraded,
    failedCount: Number(j?.failedCount ?? 0),
  }
}

async function main() {
  const args = process.argv.slice(2)
  const jsonOut = args.includes('--json')
  const minutos = Number(args.find(a => a.startsWith('--intervalo='))?.split('=')[1] ?? 8)
  const log = (s: string) => { if (!jsonOut) console.log(s) }

  // ⚠️ O padrão continua sendo o Brasil, sem parâmetro nenhum. Quem já chama
  // esta trava (o /atualizar-brz e quem a roda à mão) não pode mudar de
  // comportamento por causa da chegada dos EUA.
  const pais = args.find(a => a.startsWith('--pais='))?.split('=')[1] === 'us' ? 'us' : 'br'
  const proxy = pais === 'us' ? `${PROXY_BASE}&country=us` : PROXY_BASE
  const books: readonly string[] = pais === 'us' ? BOOKS_US : BOOKS_BR

  const motivos: string[] = []

  log(`Trava de captura (${pais.toUpperCase()}): 2 leituras com ${minutos} min de intervalo, tolerância ${TOLERANCIA_PP}pp.`)
  log(`Books vigiados: ${books.join(', ')}`)
  log('')

  const a = await ler(proxy, books)
  log(`  1a leitura: ${a.precos.size} mercados, fetchedAt=${a.fetchedAt}`)
  if (a.degraded) motivos.push(`1a leitura veio degradada (failedCount=${a.failedCount}). Não publicar.`)

  // ⛔ Falha fechada: sem book nenhum não há o que confirmar. Sem isto, um erro
  // no nome de um book faria a trava ler zero preços, achar zero divergências e
  // APROVAR com exit 0, que é o pior desfecho possível para uma trava.
  if (a.precos.size === 0) {
    motivos.push(`a 1a leitura não trouxe preço nenhum de ${books.join('/')}. A trava não tem o que confirmar.`)
  }

  log(`  aguardando ${minutos} min...`)
  await new Promise(r => setTimeout(r, minutos * 60_000))

  const b = await ler(proxy, books)
  log(`  2a leitura: ${b.precos.size} mercados, fetchedAt=${b.fetchedAt}`)
  if (b.degraded) motivos.push(`2a leitura veio degradada (failedCount=${b.failedCount}). Não publicar.`)

  // Se o proxy devolveu o MESMO carimbo nas duas, não houve leitura independente:
  // a trava não confirmou nada e não pode dizer que está tudo bem.
  if (a.fetchedAt && a.fetchedAt === b.fetchedAt) {
    motivos.push(
      `As duas leituras têm o mesmo fetchedAt (${a.fetchedAt}), então vieram do mesmo cache. ` +
      `A trava NÃO confirmou estabilidade. Confira se o ?fresh=1 está valendo no proxy.`
    )
  }

  const divergencias: Array<{ nome: string; p1: number; p2: number; d: number }> = []
  for (const [nome, p1] of a.precos) {
    const p2 = b.precos.get(nome)
    if (p2 === undefined) {
      motivos.push(`${nome}: presente na 1a leitura e ausente na 2a.`)
      continue
    }
    if (Math.max(p1, p2) < PISO_RELEVANCIA_PCT) continue
    const d = Math.abs(p2 - p1)
    if (d > TOLERANCIA_PP) divergencias.push({ nome, p1, p2, d })
  }

  for (const { nome, p1, p2, d } of divergencias.sort((x, y) => y.d - x.d)) {
    motivos.push(
      `${nome}: as leituras discordam em ${d.toFixed(2)}pp ` +
      `(${p1.toFixed(2)}% -> ${p2.toFixed(2)}%). Book em trânsito ou spread largo.`
    )
  }

  const ok = motivos.length === 0

  if (jsonOut) {
    console.log(JSON.stringify({
      ok,
      motivos,
      fetchedAt: b.fetchedAt,
      // A 2a leitura é a que vale: é a mais recente e sobreviveu à confirmação.
      precos: Object.fromEntries(b.precos),
    }, null, 2))
  } else {
    log('')
    if (ok) {
      log(`APROVADO. As duas leituras concordam dentro de ${TOLERANCIA_PP}pp.`)
      log(`Publicar os valores da 2a leitura (fetchedAt=${b.fetchedAt}).`)
    } else {
      log(`BLOQUEADO. ${motivos.length} motivo(s):`)
      motivos.forEach(m => log(`  - ${m}`))
      log('')
      log('Recapturar antes de publicar. Se persistir, o book está instável agora.')
    }
  }

  process.exit(ok ? 0 : 1)
}

main().catch(err => {
  console.error('capture-guard falhou:', err instanceof Error ? err.message : err)
  // Falha da própria trava é motivo para NÃO publicar (fail-closed).
  process.exit(1)
})
