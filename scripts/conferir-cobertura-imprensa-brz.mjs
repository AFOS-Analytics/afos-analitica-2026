#!/usr/bin/env node
/**
 * CONFERIR COBERTURA DE IMPRENSA — as casas do NOSSO índice aparecem na NOSSA
 * coleta de imprensa?
 *
 * Uso:
 *   npx tsx scripts/conferir-cobertura-imprensa-brz.mjs
 *   npx tsx scripts/conferir-cobertura-imprensa-brz.mjs --dias=15 --cache=20
 *
 * Saída:
 *   0  cobertura ok, ou só silêncio ambíguo de um dia
 *   1  BURACO: casa com 2+ divulgações vencidas e ZERO item em todo o cache
 *   2  casa NACIONAL fora da tabela: a cobertura dela não está sendo medida
 *   4  não leu (rede, HTTP, cache ausente) — NÃO é reprovação
 *
 * 🔑 O 4 existe pelo mesmo motivo do conferidor de escopo: medição que não
 *    aconteceu não pode sair com o código de quem mediu e reprovou.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { dataCivilBrasil } from './lib/data-civil-brz.mjs'
import { medirCobertura } from './lib/cobertura-imprensa-brz.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const dias = Number(valor('dias') ?? 10)
const maxCache = Number(valor('cache') ?? 14)
const hoje = dataCivilBrasil()

let nacionais
let cortada = false
try {
  const r = await fetch(`${baseDeLeitura()}/api/polls/tse?days=30`, { signal: AbortSignal.timeout(25000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const j = await r.json()
  const linhas = j.polls ?? []
  cortada = linhas.length >= 200
  const borda = new Date(hoje)
  borda.setUTCDate(borda.getUTCDate() - dias)
  const limite = borda.toISOString().slice(0, 10)
  nacionais = linhas
    .filter((p) => p.scope === 'national')
    .filter((p) => (p.publicationDate ?? '').slice(0, 10) >= limite)
    .map((p) => ({
      institute: p.institute,
      publicationDate: p.publicationDate,
      protocolo: p.protocolo ?? p.protocol ?? null,
    }))
} catch (e) {
  console.error(`\n⚠️ NÃO LEU a base: ${e.message ?? e}`)
  console.error('   Isto não é reprovação: a medição não aconteceu.')
  process.exit(4)
}

let diasDeCache
try {
  diasDeCache = readdirSync('public/news-cache')
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .slice(-maxCache)
    .map((f) => {
      const j = JSON.parse(readFileSync(`public/news-cache/${f}`, 'utf8'))
      const itens = [].concat(...Object.values(j.queries ?? {}).map((q) => q.items ?? []))
      return { dia: f.slice(0, 10), titulos: [...new Set(itens.map((x) => x.title))] }
    })
} catch (e) {
  console.error(`\n⚠️ NÃO LEU o cache de imprensa: ${e.message ?? e}`)
  process.exit(4)
}

if (diasDeCache.length === 0) {
  console.error('\n⚠️ nenhum arquivo em public/news-cache: a medição não aconteceu.')
  process.exit(4)
}

const { casas, desconhecidas, veredito } = medirCobertura(nacionais, diasDeCache, hoje)
const totalTitulos = diasDeCache.reduce((s, d) => s + d.titulos.length, 0)

console.log(`\n📡 COBERTURA DE IMPRENSA x ÍNDICE NACIONAL · hoje ${hoje}`)
console.log(`   ${nacionais.length} registro(s) nacional(is) com divulgação nos últimos ${dias} dias`)
console.log(`   ${diasDeCache.length} dia(s) de news-cache (${diasDeCache[0].dia} a ${diasDeCache.at(-1).dia}), ${totalTitulos} títulos únicos`)
if (cortada) {
  console.log('   🔴 a rota parou em 200 linhas: casa que só aparece ABAIXO do corte não é medida aqui.')
}

const rotulo = { COBERTA: '✅', SUSPEITA: '🟡', CEGA: '🔴', INDETERMINADO: '⏳' }
console.log('\n   casa                      div(s)                        itens  estado')
for (const c of casas) {
  const divs = c.divulgacoes.map((d) => d.div.slice(5)).join(' ')
  console.log(
    `   ${rotulo[c.estado]} ${c.nome.padEnd(22)} ${divs.padEnd(28)} ${String(c.itens).padStart(5)}  ${c.estado}`,
  )
}

console.log('\n   ⚖️ COMO LER, e isto é a razão do script existir:')
console.log('      COBERTA        a nossa coleta enxerga a casa. Silêncio dela num dia é informação.')
console.log('      SUSPEITA       uma divulgação vencida e zero item: pode ser casa calada OU buraco nosso.')
console.log('      CEGA           duas ou mais vencidas e zero item em TODO o cache: o buraco é nosso.')
console.log('      INDETERMINADO  só divulgação de hoje ou futura: ainda pode sair à noite.')
console.log('   ⛔ Nenhum destes estados diz que a pesquisa saiu ou deixou de sair.')

if (desconhecidas.length > 0) {
  console.log(`\n🔴 ${desconhecidas.length} casa(s) NACIONAL(is) fora da tabela de cobertura:`)
  desconhecidas.forEach((d) => console.log(`      ${d}`))
  console.log('   A cobertura delas não está sendo medida por ninguém. Acrescentar em lib/cobertura-imprensa-brz.mjs.')
}

const cegas = casas.filter((c) => c.estado === 'CEGA')
if (cegas.length > 0) {
  console.log(`\n🔴 VEREDITO: ${veredito} · ${cegas.length} casa(s) que a nossa imprensa nunca viu`)
  cegas.forEach((c) => console.log(`      ${c.nome}: ${c.vencidas} divulgação(ões) vencida(s), 0 item em ${diasDeCache.length} dias de cache`))
  console.log('   Enquanto isso não fechar, "não achei matéria dessa casa" não é resposta.')
} else if (desconhecidas.length > 0) {
  console.log(`\n🔴 VEREDITO: ${veredito}`)
} else {
  console.log(`\n✅ VEREDITO: ${veredito}`)
}

process.exit(desconhecidas.length > 0 ? 2 : cegas.length > 0 ? 1 : 0)
