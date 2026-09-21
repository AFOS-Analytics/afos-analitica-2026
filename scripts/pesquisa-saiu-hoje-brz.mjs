#!/usr/bin/env node
/**
 * PROMESSA x MUNDO: que pesquisa nacional tem NÚMERO hoje?
 *
 * 🔴 O bloco `📣 DIVULGAM HOJE` do relatório é o gatilho do `/atualizar-brz` e
 *    ele lê a `divulgacao` do REGISTRO, que é o que a casa PROMETEU. Em
 *    20/Set/2026 promessa e mundo divergiram nas DUAS direções no mesmo dia:
 *    a Palver prometeu duas nacionais e às 21h só havia o anúncio das 00:01;
 *    a Veritá, 40.500 entrevistas, tinha divulgação registrada para 18/Set e
 *    os números saíram no dia 20, a partir das 18:12, em treze manchetes.
 *
 * ⛔ ELE NÃO DIZ "PUBLICADO", e essa é a linha que ele não cruza. Manchete não
 *    carrega tempo verbal. O veredito mais forte é COM_NUMERO, que quer dizer
 *    "há manchete com percentual desta casa hoje, vá ao CORPO confirmar":
 *      npx tsx scripts/ler-materia.mjs "<padrão>"
 *    e a confirmação é pelo protocolo ou pelo período de campo, nunca pelo
 *    título. → memory/feedback_a_manchete_esconde_o_tempo_verbal_nova_pesquisa_e_anuncio.md
 *
 * ⛔ Ele não ingere, não grava e não publica.
 *
 * Uso:
 *   node scripts/pesquisa-saiu-hoje-brz.mjs
 *   node scripts/pesquisa-saiu-hoje-brz.mjs --dias=30 --data=2026-09-20
 *
 * Saída: 0 promessa e mundo batem · 1 DIVERGEM, há o que conferir
 *        4 não mediu (sem cache, rede, rota) — nunca confundir com "nada saiu"
 */
import { readFileSync, existsSync } from 'node:fs'
import { CASAS_BRZ, casaDoRegistro } from './lib/cobertura-imprensa-brz.mjs'
import { dataCivilBrasil, datasDeHoje } from './lib/data-civil-brz.mjs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { medirSaida } from '../lib/tse/saiu-hoje-brz.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const HOJE = valor('data') ?? dataCivilBrasil()
const DIAS = Number(valor('dias') ?? 30)

const d = datasDeHoje()
console.log(`\n🗳️  PROMESSA x MUNDO · hoje ${HOJE}, janela de ${DIAS} dias  [USO INTERNO, nao publicar]`)
if (d.diverge && !valor('data')) {
  console.log(`   ⚠️ a data UTC já virou para ${d.utc}, e "hoje" aqui é a data civil do BRASIL (${d.br}).`)
}

// ── 1. o que foi PROMETIDO: nacionais da janela, pela rota ───────────────────
let servidas
try {
  const r = await fetch(`${baseDeLeitura()}/api/polls/tse?days=${DIAS}`, { signal: AbortSignal.timeout(45_000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const j = await r.json()
  servidas = j.findings ?? j.polls ?? j.items ?? []
} catch (e) {
  console.error(`\n❌ NAO LEU a rota de pesquisas: ${e.message}`)
  console.error(`   ⛔ Isto NAO e "nada saiu": e o conferidor declarando que nao mediu.`)
  process.exit(4)
}

const nacionais = servidas.filter((p) => (p.scope ?? p.escopo) === 'national')
const porCasa = new Map()
for (const p of nacionais) {
  const casa = casaDoRegistro(p.institute ?? p.instituto ?? '')
  if (!casa) continue
  if (!porCasa.has(casa.nome)) porCasa.set(casa.nome, { ...casa, divulgacoes: [] })
  porCasa.get(casa.nome).divulgacoes.push((p.publicationDate ?? p.divulgacao ?? '').slice(0, 10))
}
// 🏷️ Casa nacional que NAO esta na tabela nao pode sair calada: ela seria
//    medida como "sem item" e isso se leria como silencio da casa.
const foraDaTabela = [
  ...new Set(nacionais.filter((p) => !casaDoRegistro(p.institute ?? p.instituto ?? '')).map((p) => p.institute ?? p.instituto)),
]

// ── 2. o que o MUNDO tem: títulos do cache de hoje ───────────────────────────
const arq = `public/news-cache/${HOJE}.json`
if (!existsSync(arq)) {
  console.error(`\n❌ NAO LEU o cache de hoje: ${arq} nao existe.`)
  console.error(`   Rodar antes: node scripts/fetch-google-news.mjs`)
  console.error(`   ⛔ Cache ausente NAO e "nenhuma pesquisa saiu".`)
  process.exit(4)
}
const cache = JSON.parse(readFileSync(arq, 'utf8'))
const itens = [
  ...new Map(
    []
      .concat(...Object.values(cache.queries ?? {}).map((q) => q.items ?? []))
      .filter((x) => x?.title)
      .map((x) => [x.title, x])
  ).values(),
]

// 🔴 O ARQUIVO SE CHAMA `2026-09-20.json` E NÃO É O DIA 20. O coletor usa uma
//    janela de 30 horas, de ontem 18h até hoje 24h, então o cache de hoje traz
//    a noite de ontem inteira. Medido em 20/Set/2026: 947 títulos únicos, dos
//    quais **442 eram de 18 e 19/Set** e só 505 do dia 20. Sem este corte, uma
//    manchete de ontem à noite vira "saiu hoje", que é exatamente o erro que
//    este script existe para não cometer. O nome do arquivo é o dia da COLETA,
//    não o dia da notícia.
const diaDe = (x) => {
  const d = new Date(x.pubDate)
  return isNaN(d) ? null : d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}
const doDia = itens.filter((x) => diaDe(x) === HOJE)
const semData = itens.filter((x) => diaDe(x) === null)
const titulos = doDia.map((x) => x.title)

console.log(`   ${nacionais.length} registro(s) nacional(is) na janela · ${itens.length} titulo(s) unico(s) no cache`)
console.log(`   📅 do dia ${HOJE}: ${titulos.length}. O cache tem janela de 30h e trouxe ${itens.length - titulos.length} de outros dias.`)
if (semData.length) {
  // ⛔ Item sem data legível não entra e não some: ele é CONTADO, porque
  //    descartar em silêncio é como se transforma cobertura em amostra.
  console.log(`   ⚠️ ${semData.length} item(ns) sem pubDate legível ficaram FORA da contagem do dia.`)
}

// ── 3. a medição ─────────────────────────────────────────────────────────────
const casas = [...porCasa.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
const r = medirSaida(casas, titulos, HOJE)

const ROTULO = {
  COM_NUMERO: '🔢 COM NUMERO',
  SO_ANUNCIO: '📣 so ANUNCIO',
  SO_MENCAO: '·  so mencao',
  SEM_ITEM: '·  sem item',
}
console.log('')
for (const l of r.linhas) {
  const prom = l.prometeuHoje ? 'prometeu HOJE' : l.divulgacoes.length ? `div ${[...new Set(l.divulgacoes)].sort().join(' ')}` : 'sem div'
  console.log(`   ${l.divergencia ? '🔴' : '  '} ${l.nome.padEnd(22)} ${ROTULO[l.estado].padEnd(14)} ${String(l.itens).padStart(3)} item(ns)  ${prom}`)
  if (l.divergencia) console.log(`         ↳ ${l.divergencia}`)
  for (const t of l.exemplos.slice(0, l.divergencia ? 3 : 0)) console.log(`            «${t.slice(0, 84)}»`)
}

if (foraDaTabela.length) {
  console.log(`\n   🏷️ ${foraDaTabela.length} casa(s) nacional(is) FORA da tabela de cobertura, nao medidas aqui:`)
  foraDaTabela.forEach((n) => console.log(`      ${String(n).slice(0, 56)}`))
  console.log(`      ⛔ Ausencia delas acima e falta de medidor, nao silencio da casa.`)
}

console.log(`
   ⚖️ COMO LER:
      PROMETEU_E_NAO_SAIU          o registro marcou hoje e nao ha numero. Pode sair a noite
      SAIU_DEPOIS_DO_PROMETIDO     numero hoje, com divulgacao registrada para ANTES
      SAIU_SEM_PROMESSA_NA_JANELA  numero hoje, sem divulgacao registrada na janela
   ⛔ COM_NUMERO nao e "publicado": e "ha o que conferir NO CORPO".
      npx tsx scripts/ler-materia.mjs "<padrao do titulo>"
`)
console.log(`${r.veredito === 'DIVERGEM' ? '🔴' : '✅'} VEREDITO: ${r.veredito}${r.alerta.length ? ` · ${r.alerta.length} casa(s) a conferir` : ''}\n`)
process.exit(r.veredito === 'DIVERGEM' ? 1 : 0)
