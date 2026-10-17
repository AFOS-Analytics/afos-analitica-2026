#!/usr/bin/env node
/**
 * FORA DO PAINEL — nacional que terminou o campo e NÃO está no polls-data.json.
 *
 * Uso:
 *   node scripts/fora-do-painel-brz.mjs                    # campo terminado nos últimos 14 dias
 *   node scripts/fora-do-painel-brz.mjs --desde=2026-10-05 # desde o início do 2º turno
 *   node scripts/fora-do-painel-brz.mjs --cache-dir=C:/.../public/news-cache
 *
 * Saída:
 *   0  EM_DIA: toda nacional com campo encerrado está no painel, retirada, ou sem número na imprensa
 *   1  FALTA_NO_PAINEL: protocolo fora do painel COM manchete nacional da casa com %, conferir NO CORPO
 *   2  CASA_SEM_TABELA: casa nacional que a cobertura de imprensa não mede
 *   4  não leu (rota, polls-data ou cache) — NÃO é aprovação
 *
 * 🔴 Nasceu em 17/Out/2026 com a Gerp BR-05187, que saiu na noite de 16/Out e
 *    nenhum passo da rodada apontou como faltando. A regra e o porquê estão em
 *    `lib/tse/fora-do-painel-brz.mjs`.
 *
 * ⚠️ O news-cache NÃO está no git: num worktree de origin/main só existe o do
 *    dia que a rodada coletou. `--cache-dir` aponta para a pasta da árvore
 *    principal, onde ficam os dias anteriores.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { urlApiPolls, bordaDaResposta } from './lib/tse-api-polls.mjs'
import { dataCivilBrasil } from './lib/data-civil-brz.mjs'
import { CASAS_BRZ, casaDoRegistro } from './lib/cobertura-imprensa-brz.mjs'
import { classificarForaDoPainel, numerosDoPainel, protocolosDoPainel } from '../lib/tse/fora-do-painel-brz.mjs'
import { normalizarProtocolo } from '../lib/tse/saiu-hoje-brz.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const hoje = dataCivilBrasil()
const desde = valor('desde') ?? (() => {
  const d = new Date(`${hoje}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 14)
  return d.toISOString().slice(0, 10)
})()
const dias = Number(valor('dias') ?? 60)
const cacheDir = valor('cache-dir') ?? 'public/news-cache'

function naoLeu(msg) {
  console.error(`\n⚠️ NÃO LEU: ${msg}`)
  console.error('   Isto não é aprovação: a conferência não aconteceu.')
  process.exit(4)
}

let registros
try {
  const r = await fetch(urlApiPolls(baseDeLeitura(), dias), { signal: AbortSignal.timeout(30000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const j = await r.json()
  registros = j.polls ?? []
  // A janela da rota é por data de INGESTÃO: protocolo registrado há mais de
  // `dias` some daqui sem aviso. O corte por teto, esse sim, a rota declara.
  if (bordaDaResposta(j, registros) !== null) naoLeu(`a rota cortou a resposta (${registros.length} de ${j.total}); reduzir --dias`)
} catch (e) {
  naoLeu(`rota de pesquisas (${e.message ?? e})`)
}

let painel
let numerosPublicados
let semCasa = []
// O painel escreve a casa como a IMPRENSA ("Futura/100% Cidades"), e o regex do
// registro (/100 cidades/) não casa o "%": cai para os alvos de imprensa.
const casaDoPainel = (nome) => casaDoRegistro(nome) ?? CASAS_BRZ.find((c) => c.alvos.some((re) => re.test(String(nome ?? '')))) ?? null
try {
  const pd = JSON.parse(readFileSync('public/polls-data.json', 'utf8'))
  painel = protocolosDoPainel(pd)
  numerosPublicados = numerosDoPainel(pd, casaDoPainel)
  semCasa = [...new Set(pd.polls.map((p) => p.institute).filter((i) => !casaDoPainel(i)))]
} catch (e) {
  naoLeu(`public/polls-data.json (${e.message ?? e})`)
}

let fantasmas = null
let idadeFantasmas = null
try {
  const linhas = readFileSync('data/tse/fantasmas.jsonl', 'utf8').trim().split('\n').filter(Boolean)
  const o = JSON.parse(linhas.at(-1))
  const lista = o.protocolos ?? o.fantasmas
  if (Array.isArray(lista)) {
    fantasmas = new Set(lista.map(normalizarProtocolo))
    idadeFantasmas = (Date.now() - Date.parse(o.quando)) / 3_600_000
  }
} catch {
  // sem ledger, segue: as retiradas aparecem como FORA e isso é dito abaixo
}

if (!existsSync(cacheDir)) naoLeu(`pasta ${cacheDir} não existe`)
// 🔑 Pasta indexada por DATA se filtra pela FORMA da data, não por extensão.
const arquivos = readdirSync(cacheDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) >= desde).sort()
if (!arquivos.length) naoLeu(`nenhum news-cache em ${cacheDir} desde ${desde}`)
const itens = []
for (const f of arquivos) {
  const a = JSON.parse(readFileSync(join(cacheDir, f), 'utf8'))
  for (const q of Object.values(a.queries ?? {})) for (const i of q.items ?? []) itens.push({ title: i.title, pubDate: i.pubDate })
}

const { linhas, veredito } = classificarForaDoPainel(registros, {
  painel: painel.protocolos, fantasmas, itens, hoje, desde, casaDe: casaDoRegistro, numerosPublicados,
})

console.log(`\n🧾 FORA DO PAINEL · hoje ${hoje}, campo encerrado desde ${desde}`)
console.log(`   rota: ${registros.length} linha(s) em ${dias}d de ingestão · painel: ${painel.protocolos.size} protocolo(s) no register`)
console.log(`   news-cache: ${arquivos.length} dia(s), ${arquivos[0].slice(0, 10)} a ${arquivos.at(-1).slice(0, 10)}, ${itens.length} itens`)
if (fantasmas) {
  console.log(`   👻 ${fantasmas.size} retirada(s) no ledger, de ${idadeFantasmas.toFixed(1)}h atrás${idadeFantasmas > 36 ? '  ⚠️ VELHO: rodar a rodada --apply antes' : ''}`)
} else {
  console.log('   ⚠️ sem ledger de fantasmas: retirada do TSE vai aparecer como FORA')
}
if (semCasa.length) console.log(`   ⚠️ casa(s) do painel sem entrada em CASAS_BRZ, repercussão delas NÃO é filtrada: ${semCasa.join(', ')}`)
if (painel.semRegistro.length) console.log(`   ⚠️ ${painel.semRegistro.length} pesquisa(s) do painel SEM protocolo no register: ${painel.semRegistro.slice(0, 5).join('; ')}`)

const ordem = ['FORA_COM_NUMERO', 'CASA_SEM_TABELA', 'FORA_SEM_NUMERO', 'EM_CAMPO', 'RETIRADA', 'NO_PAINEL']
const marca = { FORA_COM_NUMERO: '🔴', CASA_SEM_TABELA: '🟠', FORA_SEM_NUMERO: '🟡', EM_CAMPO: '⏳', RETIRADA: '👻', NO_PAINEL: '✅' }
console.log('')
for (const e of ordem) {
  const daqui = linhas.filter((l) => l.estado === e).sort((a, b) => a.fim.localeCompare(b.fim))
  if (!daqui.length) continue
  console.log(`   ${marca[e]} ${e}: ${daqui.length}`)
  if (e === 'NO_PAINEL') continue
  for (const l of daqui) {
    console.log(`      ${l.protocolo}  campo até ${l.fim}  div reg ${l.divulgacao}  n=${String(l.n ?? '?').padStart(5)}  ${String(l.casa).slice(0, 34)}${l.itens ? `  · ${l.itens} manchete(s) com % novo` : ''}${l.repercussao ? `  · ${l.repercussao} de repercussão` : ''}`)
    for (const x of l.exemplos ?? []) console.log(`         «${x.slice(0, 120)}»`)
  }
}

console.log('')
if (veredito === 'FALTA_NO_PAINEL') {
  console.log('🔴 VEREDITO: FALTA_NO_PAINEL · há nacional com campo encerrado, fora do painel, e número na imprensa da casa.')
  console.log('   ⛔ Manchete da casa pode ser REPERCUSSÃO de onda anterior. Confirmar no CORPO, pelo protocolo:')
  console.log('      npx tsx scripts/ler-materia.mjs "<padrão do título>"')
  process.exit(1)
}
if (veredito === 'CASA_SEM_TABELA') {
  console.log('🟠 VEREDITO: CASA_SEM_TABELA · pôr a casa em CASAS_BRZ (scripts/lib/cobertura-imprensa-brz.mjs).')
  process.exit(2)
}
console.log('✅ VEREDITO: EM_DIA · nenhuma nacional encerrada fora do painel com número na imprensa.')
