/**
 * wayback-prioridade.mjs — ordena o passivo do Wayback pelo que de fato se
 * PRESERVA em cada daily, e não pela data.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 04/Set/2026. O André pediu para priorizar
 * "as dailies com matéria de mais risco". A intuição diz veículo pequeno e
 * daily antiga. A medição diz outra coisa, e ela inverte a ordem:
 *
 *   518 URLs externas no passivo, e 265 delas, 51%, são INVÓLUCRO do Google News.
 *
 * ⚠️ E o invólucro não se resolve mais. O `news.google.com/rss/articles/...`
 * responde 200 e faz o salto em JAVASCRIPT, então o `fetch` do resolvedor nunca
 * sai do domínio. Medido em cinco dailies de 29/Jul a 03/Set: NENHUM invólucro
 * resolveu, inclusive os da véspera, ou seja não é decaimento por idade, é o
 * mecanismo que mudou. O payload novo é opaco, do tipo `AU_yqL...`, e não traz
 * a URL em texto, então também não dá para decodificar sem rede.
 *
 * 🕳️ CONSEQUÊNCIA: arquivar uma dessas URLs preserva a casca de JavaScript do
 * Google, não a matéria. É o que a ficha de 12/Jul já dizia com outras palavras,
 * "preservar o carimbo do correio em vez da carta", e o conserto daquela vez
 * cobriu a Folha, que se resolve OFFLINE pelo `*` na URL, e apostou em seguir
 * redirect para o Google News. Essa aposta venceu.
 * → memory/feedback_wayback_bloqueio_de_host_nao_se_resolve_insistindo.md
 *
 * ✅ ENTÃO A PRIORIDADE É POR URL ARQUIVÁVEL, não por data: gastar a cota do
 * archive.org, que é escassa e nos bloqueia por volume, nas dailies onde cada
 * requisição preserva uma matéria de verdade.
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
 * O invólucro se resolve SEM REDE?
 *
 * A Folha embute a URL final depois de um `*`, então sim. O Google News, não:
 * o salto é em JavaScript e o payload é opaco. Qualquer outro domínio é URL
 * direta e já aponta para a matéria.
 */
export function classificar(url) {
  if (/redir\.folha\.com\.br\/.*\*https?:\/\//.test(url)) return 'resolve-offline'
  if (url.includes('news.google.com/rss/articles/')) return 'involucro-opaco'
  return 'direta'
}

/** Só conta o que, arquivado, guarda a matéria. */
export function ehArquivavel(url) {
  return classificar(url) !== 'involucro-opaco'
}

export function urlsDaDaily(markdown) {
  const brutas = (markdown.match(/\]\((https?:\/\/[^)]+)\)/g) || []).map((x) => x.slice(2, -1))
  return [...new Set(brutas)].filter((u) => !NAO_E_MATERIA.test(u))
}

export function ranquear(dailies) {
  return dailies
    .map((d) => {
      const cont = { direta: 0, 'resolve-offline': 0, 'involucro-opaco': 0 }
      for (const u of d.urls) cont[classificar(u)]++
      return {
        data: d.data,
        total: d.urls.length,
        arquivavel: cont.direta + cont['resolve-offline'],
        involucro: cont['involucro-opaco'],
        direta: cont.direta,
        folha: cont['resolve-offline'],
      }
    })
    // 🔑 Ordena pelo que se PRESERVA, e desempata pela data mais antiga, que é
    // a que está exposta há mais tempo.
    .sort((a, b) => b.arquivavel - a.arquivavel || a.data.localeCompare(b.data))
}

function principal() {
  const desde = process.argv.find((a) => a.startsWith('--desde='))?.slice(8) ?? '2026-07-29'
  const top = Number(process.argv.find((a) => a.startsWith('--top='))?.slice(6) ?? 0)

  const jaRodou = new Set()
  if (existsSync(LEDGER)) {
    for (const l of readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean)) {
      try {
        const r = JSON.parse(l)
        if (!r.abortou && r.ok > 0) jaRodou.add(r.daily)
      } catch {
        /* linha quebrada não invalida o resto da ordenação */
      }
    }
  }

  const dailies = readdirSync(DIR)
    .filter((f) => /^\d{4}-\d\d-\d\d\.md$/.test(f) && f.slice(0, 10) >= desde)
    .sort()
    .map((f) => ({ data: f.slice(0, 10), urls: urlsDaDaily(readFileSync(`${DIR}/${f}`, 'utf8')) }))

  const r = ranquear(dailies)
  const T = r.reduce((s, x) => s + x.total, 0)
  const A = r.reduce((s, x) => s + x.arquivavel, 0)
  const I = r.reduce((s, x) => s + x.involucro, 0)

  console.log(`\n📉 PASSIVO DO WAYBACK, ordenado pelo que se PRESERVA · desde ${desde}\n`)
  console.log(`   ${r.length} dailies · ${T} URLs externas`)
  console.log(`   ${A} arquiváveis (${Math.round((A / T) * 100)}%) · ${I} invólucro opaco do Google News (${Math.round((I / T) * 100)}%)`)
  console.log(`\n   ⚠️ O invólucro do Google News NÃO resolve: o salto é em JavaScript e o payload é opaco.`)
  console.log(`      Arquivá-lo preserva a casca, não a matéria. Por isso ele não conta na coluna arquivável.\n`)
  console.log('   data         arquiv.  invól.  direta  folha  total  ledger')
  const lista = top > 0 ? r.slice(0, top) : r
  for (const x of lista) {
    console.log(
      `   ${x.data}  ${String(x.arquivavel).padStart(7)}${String(x.involucro).padStart(8)}${String(x.direta).padStart(8)}${String(x.folha).padStart(7)}${String(x.total).padStart(7)}  ${jaRodou.has(x.data) ? 'rodou' : ''}`
    )
  }
  console.log(`\n   "ledger" marca a daily que já teve rodada com sucesso e sem abortar, lida de ${LEDGER}.\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) principal()
