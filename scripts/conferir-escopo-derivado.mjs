/**
 * PORTÃO DO ESCOPO DERIVADO: o rótulo "nacional" se apoia em campo que separa?
 *
 * Roda depois do `relatorio-pesquisas-brz.ts`, que já imprime a lista de
 * registros com `scopeSource != methodology` e manda conferir na divulgação.
 * Esse aviso existia desde 01/Set e é bom, mas ele trata os 7 sinalizados como
 * iguais, e eles não são: medido em 06/Set/2026, 1 deles tinha o campo mais
 * confiável da base e 3 tinham um campo comprovadamente cego.
 *
 * O que este portão acrescenta é a MEDIÇÃO que separa os dois casos, e ela é
 * por casa. Ver o porquê inteiro em lib/tse/poder-discriminante.mjs.
 *
 * ⛔ Não coleta, não grava e não conserta. Lê a mesma rota que o relatório lê.
 *
 * Uso:
 *   node scripts/conferir-escopo-derivado.mjs
 *   node scripts/conferir-escopo-derivado.mjs --dias=30
 *   node scripts/conferir-escopo-derivado.mjs --arquivo=<caminho.json> --hoje=2026-09-06
 *
 * Sai 1 quando um rótulo GRAVE está no calendário vivo. Rótulo frágil já
 * vencido sai 0 e aparece como aviso: é dívida de dataset, não publicação de
 * hoje.
 *
 * Sai 3 quando APROVA sobre base CORTADA pelo teto da rota. 🔴 Medido em
 * 14/Set/2026: a janela de 30d tinha 351 linhas e a API serviu 200, e sobre a
 * base inteira a Real Time contradiz em 38 de 38 (não 25 de 25) e os graves
 * são 3 (não 1). O veredito vivo não mudou naquele dia, mas o poder de cada
 * casa é medido sobre TODAS as linhas, então o corte pode esconder os dois
 * sentidos. O 3 não é o 1: não há grave vivo achado, há base que não permite
 * dizer que não há.
 */

import { readFileSync } from 'fs'
import { chaveDaCasa, conferirEscopoDerivado } from '../lib/tse/poder-discriminante.mjs'
import { TETO_API_POLLS, bordaDoCorte } from './lib/tse-api-polls.mjs'

const BASE = 'https://www.afos-analytics.com'

const arg = (nome, padrao) => {
  const achado = process.argv.find((a) => a.startsWith(`--${nome}=`))
  return achado ? achado.slice(nome.length + 3) : padrao
}

const dias = arg('dias', '30')
const arquivo = arg('arquivo', null)
const hoje = arg('hoje', new Date().toISOString().slice(0, 10))

function linhasDe(json) {
  const arr = json.data ?? json.polls ?? json.items ?? (Array.isArray(json) ? json : [])
  if (!Array.isArray(arr) || arr.length === 0) {
    console.error('❌ resposta sem linhas. Portão FALHA FECHADA: nada a conferir não é aprovação.')
    process.exit(1)
  }
  return arr
}

let registros
// Só a leitura da ROTA tem teto. Um --arquivo é o que alguém montou, inteiro ou não.
let borda = null
if (arquivo) {
  registros = linhasDe(JSON.parse(readFileSync(arquivo, 'utf8')))
  console.log(`\n🗂️  ESCOPO DERIVADO · ${registros.length} registro(s) de ${arquivo}, hoje ${hoje}`)
} else {
  const url = `${BASE}/api/polls/tse?days=${dias}`
  const r = await fetch(url)
  if (!r.ok) {
    console.error(`❌ ${url} devolveu HTTP ${r.status}. Portão FALHA FECHADA.`)
    process.exit(1)
  }
  registros = linhasDe(await r.json())
  console.log(`\n🗂️  ESCOPO DERIVADO · ${registros.length} registro(s), janela de ${dias}d, hoje ${hoje}`)
  borda = bordaDoCorte(registros)
  if (borda !== null) {
    console.log(`   🔴 BASE CORTADA: a rota para em ${TETO_API_POLLS} linhas e a janela tem mais.`)
    console.log(`      Faltam divulgações até ${borda}, inclusive, e o poder de cada casa abaixo é medido sem elas.`)
  }
}

const { ok, poder, achados, graves, vivos } = conferirEscopoDerivado(registros, { hoje })

// A tabela mostra toda casa que tem rótulo nacional derivado do plano, INCLUSIVE
// a que passou: ver quem o portão liberou é o que mostra que ele não reprova tudo.
// Mais toda casa CEGA, que é aviso permanente mesmo sem rótulo derivado hoje.
const chavesEmJogo = new Set(
  registros
    .filter((r) => (r.scope ?? r.escopo) === 'national' && (r.scopeSource ?? r.scope_source) === 'sampling_plan')
    .map((r) => chaveDaCasa(r)),
)
const relevantes = [...poder.values()].filter((c) => chavesEmJogo.has(c.chave) || c.veredito === 'CEGO')
relevantes.sort((a, b) => a.veredito.localeCompare(b.veredito) || b.contradicoes - a.contradicoes)

console.log('\n📐 O plano amostral SEPARA escopo, nesta casa?')
console.log('   contradição: diz "nacional" onde a METODOLOGIA já disse estadual')
console.log('   variação:    já disse "estadual" alguma vez, então não é boilerplate')
for (const c of relevantes) {
  const icone = c.veredito === 'CEGO' ? '🔴' : c.veredito === 'DISCRIMINA' ? '✅' : '🟡'
  const nota =
    c.veredito === 'CEGO'
      ? `contradiz em ${c.contradicoes} de ${c.baseEstaduais} estaduais de fonte forte`
      : c.veredito === 'DISCRIMINA'
        ? `varia: diz estadual em ${c.planoDiz.state} e nacional em ${c.planoDiz.national} registros da casa`
        : `nunca diz outra coisa senão nacional (${c.planoDiz.national} registros), e sem estadual não há como medir`
  console.log(`   ${icone} ${String(c.casa).slice(0, 34).padEnd(34)} ${c.veredito.padEnd(11)} ${nota}`)
}

if (achados.length === 0) {
  console.log('\n✅ Nenhum rótulo nacional apoiado em campo sem sustentação.')
} else {
  console.log(`\n⚠️  ${achados.length} rótulo(s) NACIONAL derivado(s) do plano amostral, sem sustentação na casa:`)
  for (const a of achados) {
    const icone = a.gravidade === 'GRAVE' ? '🔴' : '🟡'
    const onde = a.vivo ? 'NO CALENDÁRIO VIVO' : 'já vencido'
    console.log(
      `   ${icone} ${a.protocolo}  ${String(a.casa).slice(0, 30).padEnd(30)} n=${String(a.amostra).padStart(6)}  div ${a.divulgacao}  ${onde}`,
    )
    console.log(
      `      ${a.veredito}: ${a.veredito === 'CEGO' ? `o plano desta casa diz nacional em ${a.contradicoes} de ${a.baseEstaduais} estaduais que a metodologia resolveu` : `o plano desta casa nunca disse "estadual" em nenhum dos ${a.planoDiz.national} registros dela, então "nacional" pode ser só o texto padrão`}`,
    )
  }
}

console.log(
  `\n${ok ? '✅' : '🔴'} VEREDITO: ${ok ? 'APROVADO' : 'REPROVADO'} · ${graves.length} grave(s), ${vivos.length} no calendário vivo`,
)
if (!ok) {
  console.log(
    '   O rótulo não se confirma dentro do registro. Conferir na divulgação antes de publicar como nacional.',
  )
}
if (ok && borda !== null) {
  console.log(
    `   ⚠️ APROVADO sobre base CORTADA em ${borda}: vale como piso. Saída 3, que não é grave vivo, é base que não permite descartá-lo.`,
  )
}
console.log()

process.exit(!ok ? 1 : borda !== null ? 3 : 0)
