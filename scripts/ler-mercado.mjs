/**
 * LEITURA DO MERCADO pelo proxy AFOS, com as duas travas da rota e a forma dos
 * campos resolvida num lugar só.
 *
 * ⚠️ POR QUE ESTE SCRIPT EXISTE. A leitura era redigitada à mão a cada rodada, a
 * partir da régua, e em 04/Set/2026 a redigitação supôs que `outcomePrices` era
 * string JSON. Ele chega como ARRAY JÁ DESSERIALIZADO: o `JSON.parse` lançou
 * dentro de um `try/catch` que devolvia valor neutro, e a saída foi
 * `house 9 mercados, 0 com preco` nos três binários, que se lê como fonte
 * degradada e era o leitor.
 *
 * 🔑 A régua não estava errada, ela era SILENCIOSA quanto ao tipo. Vão de tipo
 * em documentação é convite a supor, e leitor redigitado é uma chance nova de
 * supor errado. Por isso este arquivo é persistente.
 *
 * ✅ ACEITA AS DUAS FORMAS de propósito: o proxy entrega array, e o `gamma-api`
 * direto, que é o fallback manual quando o proxy cai, entrega string. Exigir só
 * array criaria o defeito espelhado.
 *
 * 🔍 E ELE SE RECUSA A DEVOLVER SILÊNCIO: nenhum preço em NENHUM grupo é tratado
 * como defeito de LEITURA e sai com código 1, porque apagão total é muito mais
 * provável no leitor do que no mundo. Zero num grupo é notícia; zero em todos é
 * sintoma. A resposta ainda traz `degraded` e `failedCount`, que são o teste de
 * contradição mais barato e por isso são sempre impressos.
 *
 * Uso:
 *   node scripts/ler-mercado.mjs                 # EUA
 *   node scripts/ler-mercado.mjs --pais=br
 *   node scripts/ler-mercado.mjs --json          # para encadear
 */

import { pathToFileURL } from 'url'

const PAIS = process.argv.find((a) => a.startsWith('--pais='))?.slice(7) ?? 'us'
const SO_JSON = process.argv.includes('--json')

/** Distribuição só sobe à tela se as faixas somarem entre estes dois. */
const PORTAO_MIN = 95
const PORTAO_MAX = 105

const GRUPOS = {
  us: {
    binarios: ['house', 'senate', 'asScheduled'],
    distribuicoes: ['houseSeats', 'senateSeats', 'governors', 'turnout', 'popularVoteMargin'],
  },
  br: {
    binarios: ['stf', 'senate'],
    distribuicoes: ['presidential', 'secondPlace', 'thirdPlace', 'inflation'],
  },
}

/**
 * A forma dos campos, resolvida UMA vez. Array já desserializado (proxy) e
 * string JSON (gamma-api direto) devolvem a mesma coisa; qualquer outra coisa
 * devolve vazio SEM lançar, porque lançar aqui vira zero silencioso lá em cima.
 */
export function comoLista(v) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim()) {
    try {
      const p = JSON.parse(v)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  }
  return []
}

/** O preço do lado SIM, ou o primeiro quando o mercado não é Sim/Não. */
export function precoSim(mercado) {
  const p = comoLista(mercado.outcomePrices)
  if (!p.length) return null
  const o = comoLista(mercado.outcomes)
  const i = o.findIndex((x) => /^yes$/i.test(String(x)))
  const v = Number(i >= 0 ? p[i] : p[0])
  return Number.isFinite(v) ? Number((v * 100).toFixed(2)) : null
}

export function lerResposta(dados, pais = 'us') {
  const g = GRUPOS[pais] ?? GRUPOS.us
  const grupos = {}
  let comPrecoNoTotal = 0

  for (const chave of [...g.binarios, ...g.distribuicoes]) {
    const ms = dados[chave]?.markets ?? []
    const linhas = []
    for (const m of ms) {
      const preco = precoSim(m)
      if (preco === null) continue
      linhas.push({ pergunta: m.question ?? '', preco, volume: m.volumeNum ?? 0 })
    }
    comPrecoNoTotal += linhas.length
    const distribuicao = g.distribuicoes.includes(chave)
    const soma = distribuicao ? Number(linhas.reduce((s, l) => s + l.preco, 0).toFixed(2)) : null
    grupos[chave] = {
      distribuicao,
      mercados: ms.length,
      comPreco: linhas.length,
      soma,
      passaPortao: distribuicao ? soma >= PORTAO_MIN && soma <= PORTAO_MAX : null,
      linhas: linhas.sort((a, b) => b.preco - a.preco),
    }
  }

  return {
    pais,
    fetchedAt: dados.fetchedAt ?? null,
    degraded: dados.degraded ?? null,
    failedCount: dados.failedCount ?? null,
    comPrecoNoTotal,
    // 🔍 nenhum preço em lugar nenhum não é retrato do mercado, é defeito de leitura
    leituraVazia: comPrecoNoTotal === 0,
    grupos,
  }
}

async function principal() {
  // 🔴 As duas travas da rota: sem `country` ela devolve o OUTRO país, e sem
  // `fresh=1` devolve o CACHE com carimbo antigo.
  const url = `https://www.afos-analytics.com/api/polymarket?country=${PAIS}&fresh=1`
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) {
    console.error(`proxy devolveu HTTP ${res.status}`)
    process.exit(1)
  }
  const r = lerResposta(await res.json(), PAIS)

  if (SO_JSON) {
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.leituraVazia ? 1 : 0)
  }

  const br = (n) => n.toFixed(2).replace('.', ',')
  console.log(`\n🗳️  MERCADO ${PAIS.toUpperCase()} · ${r.fetchedAt}`)
  console.log(`   degraded ${r.degraded} · falhas ${r.failedCount} · ${r.comPrecoNoTotal} mercados com preço\n`)

  console.log('── binários ──')
  for (const [k, g] of Object.entries(r.grupos).filter(([, g]) => !g.distribuicao)) {
    console.log(`\n${k}: ${g.comPreco} com preço de ${g.mercados} (o resto é placeholder do Polymarket)`)
    for (const l of g.linhas) {
      console.log(`   ${br(l.preco).padStart(6)}%  ${l.pergunta.slice(0, 72)}  · USD ${Math.round(l.volume).toLocaleString('pt-BR')}`)
    }
  }

  console.log(`\n\n── distribuições · portão ${PORTAO_MIN}% a ${PORTAO_MAX}% ──\n`)
  for (const [k, g] of Object.entries(r.grupos).filter(([, g]) => g.distribuicao)) {
    console.log(
      `${g.passaPortao ? '✅' : '❌'} ${k.padEnd(18)} soma ${br(g.soma).padStart(7)}%  em ${String(g.comPreco).padStart(2)} faixas` +
        (g.passaPortao ? '' : '  REPROVADO, não publicar como se valesse')
    )
  }

  if (r.leituraVazia) {
    console.log(
      `\n❌ LEITURA VAZIA: nenhum preço em NENHUM grupo.\n` +
        `   Isso quase nunca é o mercado. Conferir a forma de outcomePrices antes de\n` +
        `   suspeitar da fonte, sobretudo se degraded=${r.degraded} e failedCount=${r.failedCount}.\n`
    )
    process.exit(1)
  }
  console.log('\n✅ leitura íntegra\n')
}

// ⚠️ Montar `file://` + caminho À MÃO não casa no Windows: o `import.meta.url`
// traz `file:///C:/...`, com três barras, e a comparação falhava em silêncio,
// deixando o script sair com 0 sem imprimir nada. `pathToFileURL` resolve isso
// nos dois sistemas.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  principal().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
