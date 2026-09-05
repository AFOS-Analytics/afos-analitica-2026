/**
 * wayback-prioridade.mjs — ordena o passivo do Wayback.
 *
 * 🔄 REESCRITO em 04/Set/2026, no mesmo dia em que nasceu, porque a premissa
 * dele caiu no mesmo dia.
 *
 * A primeira versão ordenava pelo que se PRESERVA e descontava os invólucros do
 * Google News, sob o diagnóstico de que eles não resolviam: o `news.google.com`
 * responde 200 e faz o salto em JavaScript, então o `fetch` nunca sai do
 * domínio. Isso empurrava para o fim da fila justamente as dailies com mais
 * invólucro, 51% do passivo.
 *
 * ✅ O DIAGNÓSTICO ESTAVA ERRADO, e o conserto veio horas depois: o invólucro
 * resolve pelo endpoint `batchexecute`, com os atributos `data-n-a-sg`,
 * `data-n-a-ts` e `data-n-a-id` da própria página. Medido em 04/Set sobre 12
 * invólucros de 6 dailies, de 3 a 38 dias de idade: **12 de 12 resolveram**.
 *
 * 🔑 E a medição por IDADE é o que derruba a ordenação antiga: não há
 * decaimento. O invólucro de 38 dias resolve igual ao de 3. **O que estava
 * quebrado era o método, não o link.**
 *
 * ⚠️ CONSEQUÊNCIA: com 100% do passivo arquivável, ordenar por "quantidade de
 * URL arquivável" vira ordenar por tamanho da daily, e isso não maximiza nada.
 * Cada chamada ao archive.org preserva uma matéria, seja ela de que daily for.
 * O que diferencia uma daily da outra passa a ser o RISCO, e o único eixo de
 * risco que dá para medir com honestidade aqui é a EXPOSIÇÃO: há quanto tempo
 * aquelas URLs estão sem cópia.
 *
 * 🕳️ O QUE EU NÃO CONSEGUI MEDIR, e por isso não entra na ordem: se a URL de
 * destino ainda está viva. Testar com HEAD produziria sinal falso, porque
 * veículo que devolve 403 a robô é indistinguível de página morta, e são
 * justamente Estadão e Grupo Globo que dominam o passivo. Podridão medida com
 * instrumento cego não é medição.
 * → memory/reference_bloqueio_de_borda_como_diagnosticar.md
 *
 * ⛔ Isto NÃO arquiva nada e não toca no archive.org. Só lê os .md e ordena.
 *
 * Uso:
 *   node scripts/wayback-prioridade.mjs
 *   node scripts/wayback-prioridade.mjs --desde=2026-07-29 --top=10
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { pathToFileURL } from 'url'

const DIR = 'public/afos-daily'
const LEDGER = 'data/wayback/rodadas.jsonl'

/** Domínios que são infraestrutura da casa, não matéria a preservar. */
const NAO_E_MATERIA = /polymarket\.com|divulgacandcontas\.tse\.jus\.br|afos-analytics\./

/**
 * Como a URL chega até a matéria, e quanto custa.
 *
 * - `direta`          1 chamada ao archive.org
 * - `resolve-offline` 1 chamada. A Folha embute a URL final depois de um `*`.
 * - `resolve-por-rede` 2 chamadas ao Google mais 1 ao archive.org.
 *
 * 📌 As três são arquiváveis. A diferença é de CUSTO, não de possibilidade, e
 * foi confundir as duas coisas que produziu a ordenação errada da primeira
 * versão.
 */
export function classificar(url) {
  if (/redir\.folha\.com\.br\/.*\*https?:\/\//.test(url)) return 'resolve-offline'
  if (url.includes('news.google.com/rss/articles/')) return 'resolve-por-rede'
  return 'direta'
}

/** Chamadas ao archive.org, que é o recurso escasso e o que nos bloqueia. */
export function custoArchive(urls) {
  return urls.length
}

/** Chamadas ao Google News, que é throughput e não cota do archive.org. */
export function custoGoogle(urls) {
  return urls.filter((u) => classificar(u) === 'resolve-por-rede').length * 2
}

export function urlsDaDaily(markdown) {
  const brutas = (markdown.match(/\]\((https?:\/\/[^)]+)\)/g) || []).map((x) => x.slice(2, -1))
  return [...new Set(brutas)].filter((u) => !NAO_E_MATERIA.test(u))
}

/**
 * Quantas URLs de cada daily já foram arquivadas, somando as rodadas do ledger.
 *
 * ⚠️ "Rodou" não é "pronto". A rodada de 04/Set gravou 6 de 23 e as 17 falhas
 * seguem sem explicação; a de 29/Jul abortou no disjuntor com 3 de 38. Marcar a
 * daily como feita porque houve rodada esconderia exatamente esse resto.
 */
export function lerLedger(texto) {
  const porDaily = new Map()
  for (const l of (texto ?? '').split('\n').filter(Boolean)) {
    try {
      const r = JSON.parse(l)
      if (!r.daily) continue
      const a = porDaily.get(r.daily) ?? { ok: 0, rodadas: 0, abortou: false }
      a.ok += Number(r.ok) || 0
      a.rodadas++
      a.abortou = a.abortou || Boolean(r.abortou)
      porDaily.set(r.daily, a)
    } catch {
      /* linha quebrada não invalida o resto da ordenação */
    }
  }
  return porDaily
}

/**
 * 🔑 A ordem é por EXPOSIÇÃO: a daily mais antiga que ainda tem URL sem cópia
 * vem primeiro. Empate se desfaz pela que tem mais URLs faltando.
 *
 * Dailies sem nada faltando saem da fila e são contadas à parte.
 */
export function ranquear(dailies, ledger = new Map()) {
  return dailies
    .map((d) => {
      const cont = { direta: 0, 'resolve-offline': 0, 'resolve-por-rede': 0 }
      for (const u of d.urls) cont[classificar(u)]++
      const feito = ledger.get(d.data)?.ok ?? 0
      return {
        data: d.data,
        total: d.urls.length,
        direta: cont.direta,
        folha: cont['resolve-offline'],
        involucro: cont['resolve-por-rede'],
        arquivado: Math.min(feito, d.urls.length),
        falta: Math.max(0, d.urls.length - feito),
        custoGoogle: custoGoogle(d.urls),
        rodadas: ledger.get(d.data)?.rodadas ?? 0,
        abortou: ledger.get(d.data)?.abortou ?? false,
      }
    })
    .sort((a, b) => a.data.localeCompare(b.data) || b.falta - a.falta)
}

function principal() {
  const desde = process.argv.find((a) => a.startsWith('--desde='))?.slice(8) ?? '2026-07-29'
  const top = Number(process.argv.find((a) => a.startsWith('--top='))?.slice(6) ?? 0)

  const ledger = existsSync(LEDGER) ? lerLedger(readFileSync(LEDGER, 'utf8')) : new Map()

  const dailies = readdirSync(DIR)
    .filter((f) => /^\d{4}-\d\d-\d\d\.md$/.test(f) && f.slice(0, 10) >= desde)
    .sort()
    .map((f) => ({ data: f.slice(0, 10), urls: urlsDaDaily(readFileSync(`${DIR}/${f}`, 'utf8')) }))

  const r = ranquear(dailies, ledger)
  const T = r.reduce((s, x) => s + x.total, 0)
  const I = r.reduce((s, x) => s + x.involucro, 0)
  const F = r.reduce((s, x) => s + x.falta, 0)
  const A = r.reduce((s, x) => s + x.arquivado, 0)
  const G = r.reduce((s, x) => s + x.custoGoogle, 0)
  const hoje = new Date()

  console.log(`\n📉 PASSIVO DO WAYBACK · ordenado por EXPOSIÇÃO, não por contagem\n`)
  console.log(`   ${r.length} dailies · ${T} URLs externas · ${A} já com cópia · ${F} faltando`)
  console.log(`   TODAS as ${T} são arquiváveis. Dessas, ${I} (${Math.round((I / T) * 100)}%) passam pelo invólucro do Google News.`)
  console.log(`\n   ✅ O invólucro RESOLVE. Medido em 04/Set/2026: 12 de 12, em dailies de 3 a 38 dias.`)
  console.log(`      Sem decaimento por idade. O que estava quebrado era o MÉTODO, não o link.`)
  console.log(`\n   💰 Custo do passivo inteiro: ${F} chamadas ao archive.org, mais ${G} ao Google News.`)
  console.log(`      A cota escassa é a do archive.org, que é quem nos bloqueia por volume.`)
  console.log(`\n   🕳️ NÃO foi possível medir se a URL de destino ainda está viva: veículo que devolve`)
  console.log(`      403 a robô é indistinguível de página morta, e são Estadão e Globo que dominam`)
  console.log(`      o passivo. Por isso a ordem é por exposição, e não por podridão estimada.\n`)

  console.log('   data        idade  URLs  invól.  direta  folha   feito  falta  Google  ledger')
  const fila = r.filter((x) => x.falta > 0)
  const lista = top > 0 ? fila.slice(0, top) : fila
  for (const x of lista) {
    const idade = Math.round((hoje - Date.parse(`${x.data}T12:00:00Z`)) / 86400000)
    const marca = x.rodadas === 0 ? '' : x.abortou ? `${x.rodadas}x, abortou` : `${x.rodadas}x`
    console.log(
      `   ${x.data}  ${String(idade).padStart(4)}d  ${String(x.total).padStart(4)}  ${String(x.involucro).padStart(6)}  ${String(x.direta).padStart(6)}  ${String(x.folha).padStart(5)}  ${String(x.arquivado).padStart(6)}  ${String(x.falta).padStart(5)}  ${String(x.custoGoogle).padStart(6)}  ${marca}`
    )
  }

  const prontas = r.filter((x) => x.falta === 0)
  if (prontas.length) console.log(`\n   ${prontas.length} daily(s) sem nada faltando: ${prontas.map((x) => x.data).join(', ')}`)

  console.log(`\n   ▶ próxima: ${fila[0]?.data ?? '(fila vazia)'}, exposta há ${fila[0] ? Math.round((hoje - Date.parse(`${fila[0].data}T12:00:00Z`)) / 86400000) : '-'} dias, ${fila[0]?.falta ?? 0} URLs faltando.`)
  console.log(`   ⛔ Só depois da pausa de 3 a 4 dias SEM sondar. O host está bloqueando.\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) principal()
