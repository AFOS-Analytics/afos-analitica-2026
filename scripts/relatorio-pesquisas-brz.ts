/**
 * relatorio-pesquisas-brz.ts — o Passo 4 e o Passo 5 do `/atualizar-pesquisas-brz`
 * numa chamada só, com os portões que a mão esquece.
 *
 * Uso:
 *   npx tsx scripts/relatorio-pesquisas-brz.ts              # janela de 15 dias
 *   npx tsx scripts/relatorio-pesquisas-brz.ts --dias=30
 *   npx tsx scripts/relatorio-pesquisas-brz.ts --sem-tse    # pula o filtro de fantasma
 *
 * 🔴 POR QUE ISTO EXISTE. Escrito em 03/Set/2026: depois da ingestão, o relatório
 * era montado à mão toda sessão, com script descartável reescrito do zero. Três
 * regras já medidas moravam só na memória, e regra que fica só na ficha reincide:
 *
 *   1. 🕳️ O banco NUNCA APAGA e o registro do TSE RETIRA. Em 02/Set havia 75
 *      protocolos no banco fora do arquivo oficial, 16 deles servidos pela API.
 *      Publicar "divulgação prevista" sem tirar os retirados é anunciar
 *      compromisso que o TSE já não tem.
 *      → feedback_o_registro_do_tse_perde_linhas_e_o_banco_nunca_perde
 *   2. 🗳️ O `scope` é DERIVADO por nós de texto livre, não é campo do TSE. Uma
 *      Real Time do DF passou 7 dias como nacional. `scopeSource != methodology`
 *      é sinal de conferir na divulgação, não é erro por si.
 *      → feedback_escopo_nacional_derivado_do_plano_amostral
 *   3. 🆔 Varredura de CPF sem CONTROLE PLANTADO não mede nada: zero pode ser
 *      base limpa ou detector mudo, e o detector mudo já mordeu.
 *      → feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor
 *
 * ⛔ Este script NÃO grava e NÃO ingere. Ele lê a API pública, o mercado e o
 * registro do TSE, e compara. Quem grava é o `ingest-tse-local.ts`.
 *
 * 📌 Sai com código diferente de zero quando um PORTÃO quebra, nunca quando o
 * mundo é feio: fantasma no calendário é aviso, detector mudo é falha.
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { fetchTSEPolls } from '../lib/tse/ingest'
import { acharCpf } from './lib/cpf.mjs'

const BASE = 'https://www.afos-analytics.com'
const HOJE = new Date().toISOString().slice(0, 10)

// 🔒 CPF de teste público, dígitos verificadores válidos, não pertence a ninguém.
// Existe para provar que o detector está VIVO antes de o zero valer alguma coisa.
const CPF_CONTROLE = '529.982.247-25'

// Texto livre onde o TSE já pôs CPF. A redação foi instalada na origem em 22/Ago.
const CAMPOS_LIVRES = ['statistician', 'methodology', 'samplingPlan', 'controlSystem'] as const

// 🔴 Se aparecer `house` ou `senateSeats`, a rota devolveu os EUA.
const CHAVES_BR = ['presidential', 'secondPlace', 'thirdPlace', 'stf', 'senate', 'inflation'] as const
const CHAVES_US = ['house', 'senateSeats']

const MAX_IDADE_MIN = 30

type Poll = Record<string, string | number | null> & { protocolo: string }

let falhas = 0
function falhar(msg: string) {
  falhas++
  console.log(`\n❌ PORTÃO QUEBRADO: ${msg}`)
}

async function json(url: string) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url} devolveu HTTP ${r.status}`)
  return r.json()
}

function pct(n: number) {
  return (n * 100).toFixed(2).replace('.', ',') + '%'
}

async function main() {
  const dias = Number(process.argv.find((a) => a.startsWith('--dias='))?.slice(7) ?? 15)
  const semTse = process.argv.includes('--sem-tse')

  console.log(`\n🗳️  RELATÓRIO DE PESQUISAS, BRASIL — hoje ${HOJE}, janela de ${dias} dias`)

  // ── Passo 4a: a API de pesquisas ────────────────────────────────────────────
  const api = await json(`${BASE}/api/polls/tse?days=${dias}`)
  const polls: Poll[] = api.polls
  if (!Array.isArray(polls) || polls.length === 0) {
    falhar('a API devolveu zero linhas. Sem linhas não há relatório, e este zero não é medição.')
    process.exit(1)
  }
  const ingestaoMaisNova = polls.map((p) => String(p.ingestedAt ?? '')).sort().at(-1) ?? '?'
  console.log(`\n📡 API: ${polls.length} linha(s), total declarado ${api.total}`)
  console.log(`   ingestão mais recente na resposta: ${ingestaoMaisNova}`)
  if (ingestaoMaisNova.slice(0, 10) < HOJE) {
    console.log(`   ⚠️  nada de hoje na resposta. Ou não entrou nada, ou a rota está servindo cache.`)
  }

  // ── Passo 4b: o registro do TSE, para saber quem já SAIU ─────────────────────
  let fantasmas = new Set<string>()
  if (semTse) {
    console.log(`\n➖ FANTASMAS: pulado por --sem-tse. ⚠️ O calendário abaixo NÃO está filtrado.`)
  } else {
    console.log(`\n🌐 baixando o registro do TSE para separar o que já saiu…`)
    const arquivo = await fetchTSEPolls(2026)
    const noArquivo = new Set(arquivo.map((p) => p.protocolo).filter(Boolean) as string[])
    if (noArquivo.size === 0) {
      falhar('o arquivo do TSE veio vazio. Tudo pareceria fantasma, e seria leitura ruim, não achado.')
      process.exit(1)
    }
    fantasmas = new Set(polls.map((p) => p.protocolo).filter((p) => !noArquivo.has(p)))
    console.log(`   registro do TSE: ${noArquivo.size} presidenciais`)
    console.log(`   servidas pela API e FORA do registro: ${fantasmas.size} de ${polls.length}`)
  }
  const ehFantasma = (p: Poll) => fantasmas.has(p.protocolo)

  // ── Passo 4c: escopo, sempre com a fonte ────────────────────────────────────
  const porFonte: Record<string, number> = {}
  const porPar: Record<string, number> = {}
  for (const p of polls) {
    porFonte[String(p.scopeSource)] = (porFonte[String(p.scopeSource)] ?? 0) + 1
    const par = `${p.scope}/${p.scopeSource}`
    porPar[par] = (porPar[par] ?? 0) + 1
  }
  console.log(`\n🔍 ESCOPO, e ele é DERIVADO por nós, não é campo do TSE:`)
  for (const [k, v] of Object.entries(porPar).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${k.padEnd(26)} ${String(v).padStart(4)}`)
  }
  console.log(`   por fonte: ${Object.entries(porFonte).map(([k, v]) => `${k}=${v}`).join('  ')}`)

  const nacionais = polls.filter((p) => p.scope === 'national')
  const conferir = nacionais.filter((p) => p.scopeSource !== 'methodology')
  console.log(`\n   nacionais na janela: ${nacionais.length}`)
  console.log(`   🚩 com scopeSource != methodology, CONFERIR o escopo na divulgação: ${conferir.length}`)
  for (const p of conferir) {
    console.log(
      `      ${p.protocolo}  ${String(p.institute).slice(0, 32).padEnd(32)} n=${p.sampleSize}  div ${p.publicationDate}  uf=${p.uf}  [${p.scopeSource}]`,
    )
  }

  // ── Passo 5a: campo ATIVO agora ─────────────────────────────────────────────
  const linha = (p: Poll) =>
    `${ehFantasma(p) ? '👻' : '  '} ${p.protocolo}  ${String(p.institute).slice(0, 32).padEnd(32)} n=${String(p.sampleSize).padStart(5)}  campo ${p.fieldStart} a ${p.fieldEnd}  div ${p.publicationDate}  [${p.scopeSource}]`

  const ativo = polls.filter(
    (p) => p.fieldStart && p.fieldEnd && String(p.fieldStart) <= HOJE && HOJE <= String(p.fieldEnd),
  )
  const ativoNac = ativo.filter((p) => p.scope === 'national')
  console.log(`\n🎤 CAMPO ATIVO em ${HOJE}: ${ativo.length} registro(s), sendo ${ativoNac.length} nacionais`)
  for (const p of ativoNac.sort((a, b) => String(a.fieldEnd).localeCompare(String(b.fieldEnd)))) {
    console.log(`   ${linha(p)}`)
  }

  // ── Passo 5b: divulgação PREVISTA, o calendário da semana ───────────────────
  const prevista = polls.filter((p) => p.publicationDate && String(p.publicationDate) > HOJE)
  const prevNac = prevista.filter((p) => p.scope === 'national')
  const prevFant = prevista.filter(ehFantasma)
  console.log(
    `\n📅 DIVULGAÇÃO PREVISTA, depois de ${HOJE}: ${prevista.length} registro(s), sendo ${prevNac.length} nacionais`,
  )
  for (const p of prevNac.sort((a, b) => String(a.publicationDate).localeCompare(String(b.publicationDate)))) {
    console.log(`   ${linha(p)}`)
  }
  if (prevFant.length > 0) {
    const nacFant = prevFant.filter((p) => p.scope === 'national').length
    console.log(
      `\n   ⚠️ ${prevFant.length} desses compromissos JÁ SAÍRAM do registro do TSE (marcados 👻), sendo ${nacFant} nacionais.`,
    )
    console.log(
      `      Calendário limpo: ${prevista.length - prevFant.length} no total, ${prevNac.length - nacFant} nacionais.`,
    )
  }

  // ── Passo 5c: registrada ≠ publicada, com a conta honesta ───────────────────
  const vencidaNac = nacionais.filter((p) => p.publicationDate && String(p.publicationDate) <= HOJE)
  const vencidaFant = vencidaNac.filter(ehFantasma)
  console.log(`\n⏳ NACIONAIS com divulgação já vencida na janela: ${vencidaNac.length}`)
  console.log(`   destas, fora do registro do TSE: ${vencidaFant.length}`)
  console.log(
    `   🔑 conta honesta de "registrada e não divulgada": ${vencidaNac.length - vencidaFant.length}, não ${vencidaNac.length}. Cancelamento não é sonegação.`,
  )

  const institutos: Record<string, number> = {}
  for (const p of nacionais) institutos[String(p.institute)] = (institutos[String(p.institute)] ?? 0) + 1
  console.log(`\n🏛️  Institutos com registro NACIONAL na janela:`)
  for (const [k, v] of Object.entries(institutos).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${String(v).padStart(2)}x  ${k}`)
  }

  // ── Portão de CPF, com controle plantado ────────────────────────────────────
  let achados = 0
  let camposLidos = 0
  for (const p of polls) {
    for (const c of CAMPOS_LIVRES) {
      const txt = p[c]
      if (!txt) continue
      camposLidos++
      for (const h of acharCpf(String(txt))) {
        achados++
        console.log(`\n🆔 CPF VÁLIDO servido pela API: ${p.protocolo} campo=${c} trecho=${h.trecho}`)
      }
    }
  }
  const vivo = acharCpf(`Estatístico responsável, CPF ${CPF_CONTROLE}, inscrito no CONRE.`).length === 1
  console.log(`\n🆔 CPF: ${achados} válido(s) em ${camposLidos} campos de texto livre`)
  console.log(`   controle plantado ${CPF_CONTROLE}: ${vivo ? 'ENCONTRADO, detector VIVO' : 'NÃO ENCONTRADO'}`)
  if (!vivo) falhar('o controle plantado não foi encontrado. O zero acima é o DETECTOR MUDO, não base limpa.')
  if (achados > 0) falhar(`${achados} CPF válido(s) sendo servidos pela API pública.`)

  // ── Passo 5d: o mercado, com as duas travas ─────────────────────────────────
  const pm = await json(`${BASE}/api/polymarket?country=br&fresh=1`)
  const chaves = Object.keys(pm)
  const intrusos = CHAVES_US.filter((k) => chaves.includes(k))
  if (intrusos.length > 0) falhar(`a rota devolveu chave dos EUA (${intrusos.join(', ')}). Isto não é o Brasil.`)
  const faltando = CHAVES_BR.filter((k) => !chaves.includes(k))
  if (faltando.length > 0) falhar(`faltam chaves do Brasil: ${faltando.join(', ')}`)

  const idadeMin = Math.round((Date.now() - new Date(pm.fetchedAt).getTime()) / 60000)
  console.log(`\n💹 MERCADO, Polymarket Brasil`)
  console.log(`   fetchedAt ${pm.fetchedAt}  (${idadeMin} min)  degraded=${pm.degraded}  falhas=${pm.failedCount}`)
  if (idadeMin > MAX_IDADE_MIN) falhar(`o carimbo tem ${idadeMin} min mesmo com fresh=1. É cache, não preço de agora.`)
  if (pm.degraded) falhar(`a rota veio degradada, com ${pm.failedCount} coleta(s) falhando.`)

  for (const k of CHAVES_BR) {
    const bloco = pm[k]
    if (!bloco?.markets) continue
    const linhas = bloco.markets
      .map((m: { question: string; outcomePrices: string[]; volumeNum: number }) => ({
        q: m.question,
        p: parseFloat(m.outcomePrices?.[0] ?? 'NaN'),
        v: m.volumeNum ?? 0,
      }))
      .filter((r: { p: number }) => Number.isFinite(r.p) && r.p >= 0.01)
      .sort((a: { p: number }, b: { p: number }) => b.p - a.p)
    console.log(`\n   ── ${k} (${bloco.markets.length} contratos, ${linhas.length} acima de 1%)`)
    for (const r of linhas.slice(0, 6)) {
      const nome = r.q.replace(/^Will /, '').replace(/ (win|finish in) .*$/, '').slice(0, 58)
      console.log(`      ${pct(r.p).padStart(7)}  US$ ${Math.round(r.v).toLocaleString('en-US').padStart(11)}  ${nome}`)
    }
  }

  // ── Fecho ───────────────────────────────────────────────────────────────────
  if (falhas > 0) {
    console.log(`\n❌ ${falhas} portão(ões) quebrado(s). Não publicar sem resolver.`)
    process.exit(1)
  }
  console.log(`\n✅ Portões verdes: CPF com controle vivo, mercado do Brasil fresco, calendário filtrado por fantasma.`)
  if (prevNac.length > 0) {
    console.log(`📌 Se algo nacional entrou nesta rodada, rodar /atualizar-brz para o painel refletir.`)
  }
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
