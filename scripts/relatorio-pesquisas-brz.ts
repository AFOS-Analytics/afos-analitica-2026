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

import { readFileSync } from 'fs'
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { fetchTSEPolls } from '../lib/tse/ingest'
import { acharCpf } from './lib/cpf.mjs'
import { TETO_API_POLLS, bordaDoCorte, divulgamHoje, folgaDoGatilho } from './lib/tse-api-polls.mjs'
import { datasDeHoje } from './lib/data-civil-brz.mjs'

// AFOS_BASE troca o HOST, nunca a verificação de certificado. 17/Set/2026: uma rede
// com inspeção de TLS (FortiGate) reassinava só www.afos-analytics.com, e o
// afos-analitica-2026.vercel.app serve a mesma produção com cadeia válida.
const BASE = process.env.AFOS_BASE ?? 'https://www.afos-analytics.com'

// 🔴 "Hoje" aqui é a data civil do BRASIL, não a data UTC, desde 15/Set/2026.
// O campo com que ela é comparada é a `divulgacao` do registro do TSE, que é
// data civil brasileira, e das 21h BRT em diante as duas divergem. O bloco
// `📣 DIVULGAM HOJE` é o gatilho do /atualizar-brz, então o erro andava nas duas
// direções: nacional já publicada saindo do bloco, e nacional de amanhã
// entrando nele. Ver scripts/lib/data-civil-brz.mjs
const DATAS_DE_HOJE = datasDeHoje()
const HOJE = DATAS_DE_HOJE.br

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
  // 🔑 A troca de fuso NÃO pode ser silenciosa: se ela muda o dia, quem lê o
  // relatório tem de ver, ou o conserto de hoje vira a confusão de amanhã.
  if (DATAS_DE_HOJE.diverge) {
    console.log(
      `   ⚠️ a data UTC já virou para ${DATAS_DE_HOJE.utc}, e "hoje" aqui é a data civil do BRASIL (${DATAS_DE_HOJE.br}),`,
    )
    console.log('      porque a `divulgacao` do registro do TSE é data brasileira. Ver scripts/lib/data-civil-brz.mjs')
  }

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
    /**
     * 🔑 A AMBIGUIDADE ERA RESOLVÍVEL AQUI DENTRO, e ficava aberta por falta de
     * uma leitura. "Ou não entrou nada, ou a rota está servindo cache" são duas
     * conclusões opostas: uma é o mundo em repouso e a outra é defeito de
     * serviço. Deixar as duas na tela transfere ao leitor uma pergunta que o
     * script tem como responder.
     *
     * A resposta está em `data/tse/historico-arquivo.jsonl`, que o `--apply`
     * anota a cada rodada desde 04/Set/2026. Se a rodada de hoje inseriu ZERO,
     * "nada entrou" é fato e não hipótese. Se ela inseriu e a API não mostra,
     * aí sim o alarme é de serviço, e ele passa a ser afirmação em vez de
     * possibilidade.
     *
     * ⛔ Sem rodada anotada hoje, ele NÃO escolhe: diz que não sabe, porque
     * chutar aqui é trocar uma dúvida honesta por uma certeza inventada.
     */
    let veredito = `Ou não entrou nada, ou a rota está servindo cache.`
    try {
      const linhas = readFileSync('data/tse/historico-arquivo.jsonl', 'utf8')
        .split('\n').filter(Boolean).map((l) => JSON.parse(l) as { quando?: string; inseridas?: number })
      const deHoje = linhas.filter((l) => String(l.quando ?? '').slice(0, 10) === HOJE)
      if (deHoje.length) {
        const inseridas = deHoje.reduce((s, l) => s + (l.inseridas ?? 0), 0)
        veredito = inseridas === 0
          ? `a ingestão de hoje inseriu ZERO, então NÃO ENTROU NADA. Não é cache.`
          : `🔴 a ingestão de hoje inseriu ${inseridas} e a API não as mostra: isto é CACHE ou falha de serviço, não repouso.`
      } else {
        veredito = `nenhuma rodada de ingestão anotada hoje, então não dá para separar "nada entrou" de cache. Rodar o --apply antes de concluir.`
      }
    } catch {
      veredito = `sem data/tse/historico-arquivo.jsonl para desempatar entre "nada entrou" e cache.`
    }
    console.log(`   ⚠️  nada de hoje na resposta: ${veredito}`)
  }

  /**
   * 🔴 O TETO DA ROTA. Ela faz `take: 200` por `eventDate desc` e devolve
   * `total: findings.length`, então o "total declarado" acima NUNCA diverge das
   * linhas e não acusa corte. Medido no Neon em 14/Set/2026: a janela de 30d
   * tinha 351 linhas e a API serviu 200, cortando as divulgações mais antigas.
   * O corte tem borda, e é ela que diz qual bloco abaixo continua inteiro.
   */
  const borda = bordaDoCorte(polls)
  if (borda === null) {
    console.log(`   ✅ abaixo do teto de ${TETO_API_POLLS} linhas da rota: a janela veio inteira`)
  } else {
    console.log(`   🔴 NO TETO de ${TETO_API_POLLS} linhas: a rota corta calada, e o "total" é só o tamanho do que veio.`)
    console.log(`      Divulgações até ${borda}, inclusive, podem estar INCOMPLETAS.`)
  }
  // 📈 Desde 16/Set/2026, quando o corte chegou à janela padrão: quanto falta
  // para ele alcançar HOJE, que é quando o gatilho 📣 deixa de ser confiável.
  if (polls.length > 0) {
    const f = folgaDoGatilho(polls, HOJE)
    const alerta = f.aFrente >= f.teto * 0.75 ? '🔴' : '📏'
    console.log(
      `   ${alerta} folga do gatilho: ${f.aFrente}${f.exata ? '' : ' (PISO)'} linha(s) com divulgação de ${HOJE} em diante, de ${f.teto}.` +
        (f.exata ? ` Faltam ${f.folga} para o corte alcançar hoje.` : ' O corte JÁ alcança hoje.'),
    )
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

  // ── Passo 5b: quem DIVULGA HOJE, que é o gatilho do /atualizar-brz ──────────
  //
  // 🔴 Até 14/Set/2026 o dia de hoje não tinha bloco: "prevista" era `> HOJE` e
  // "vencida" era `<= HOJE`, então quem divulgava hoje virava um número dentro
  // de uma contagem. Naquele dia NEXUS e Quaest divulgavam, a ingestão inseriu
  // zero, e o fecho mandava rodar o /atualizar-brz "se algo nacional entrou".
  // O painel reflete DIVULGAÇÃO, e as duas tinham entrado em 09/Set.
  const doDia = divulgamHoje(polls, HOJE, { ehFantasma, borda })
  console.log(`\n📣 DIVULGAM HOJE, ${HOJE}: ${doDia.vivas.length} nacional(is)`)
  for (const p of doDia.vivas) {
    console.log(`   ${linha(p)}`)
  }
  if (doDia.fantasmas.length > 0) {
    console.log(`   👻 ${doDia.fantasmas.length} nacional(is) de hoje JÁ SAÍRAM do registro do TSE: não esperar número delas.`)
  }
  if (doDia.gatilho === 'INDETERMINADO') {
    falhar(`a resposta está cortada até ${borda} e hoje cai dentro do corte: "ninguém divulga hoje" não pode ser afirmado.`)
  }

  // ── Passo 5c: divulgação PREVISTA, o calendário da semana ───────────────────
  if (borda !== null && borda > HOJE) {
    falhar(`o corte da rota alcança o calendário FUTURO (borda ${borda}): a lista de previstas está incompleta.`)
  }
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

  // ── Passo 5d: registrada ≠ publicada, com a conta honesta ───────────────────
  const vencidaNac = nacionais.filter((p) => p.publicationDate && String(p.publicationDate) <= HOJE)
  const vencidaFant = vencidaNac.filter(ehFantasma)
  console.log(`\n⏳ NACIONAIS com divulgação já vencida na janela, hoje incluso: ${vencidaNac.length}`)
  if (borda !== null) {
    // As vencidas são exatamente as que o corte come primeiro. A conta vira PISO.
    console.log(`   🔴 base cortada até ${borda}: as contas desta seção são PISO, não total.`)
  }
  console.log(`   destas, fora do registro do TSE: ${vencidaFant.length}`)
  // 🕳️ Quando NENHUMA saiu do registro, o texto "X, não X" saía com o mesmo
  // número dos dois lados e lia como defeito de conta, justamente na linha que
  // existe para a conta ser confiável. Zero fantasma é resultado, e o relato
  // dele é outro. Achado lendo a saída em 11/Set/2026.
  console.log(
    vencidaFant.length === 0
      ? `   🔑 conta honesta de "registrada e não divulgada": ${vencidaNac.length}, e nenhuma delas foi cancelada. Cancelamento não é sonegação.`
      : `   🔑 conta honesta de "registrada e não divulgada": ${vencidaNac.length - vencidaFant.length}, não ${vencidaNac.length}. Cancelamento não é sonegação.`,
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
  // O gatilho é a DIVULGAÇÃO de hoje, não a inserção desta rodada, e não as previstas.
  if (doDia.gatilho === 'DISPARA') {
    console.log(
      `📣 ${doDia.vivas.length} nacional(is) divulgam HOJE: o /atualizar-brz entra quando os números estiverem publicados pelo instituto. O registro não traz número.`,
    )
  } else {
    console.log(`📌 Nenhuma nacional com divulgação marcada para hoje no calendário limpo: esta rodada não dispara o /atualizar-brz.`)
  }
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
