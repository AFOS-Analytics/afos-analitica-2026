/**
 * wayback-archive.ts — arquiva URLs citadas na AFOS Daily via archive.org
 *
 * Origem: Fase 3.2 do guardrail. Imuniza contra link rot e edits silenciosos.
 *
 * Usage:
 *   npx tsx scripts/wayback-archive.ts 2026-05-01
 *
 * Throttle: 3s entre requests para nao sobrecarregar archive.org.
 * Custo: zero (Wayback Machine e' gratuito).
 */
import { appendFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { pathToFileURL } from 'url'
import { isValidDate, readDailyMarkdown, extractExternalUrls } from './lib/daily-files'
import { separarAlvos } from './lib/wayback-alvos.mjs'

const WAYBACK_BASE = 'https://web.archive.org/save/'
const THROTTLE_MS = 3000
const FETCH_TIMEOUT_MS = 120000
const MAX_RETRIES = 3

/**
 * RESOLVER REDIRECT ANTES DE ARQUIVAR (instalado 12/Jul/2026).
 *
 * O Daily cita muitas matérias por URL de REDIRECT, não pela URL da matéria:
 *   - Google News: https://news.google.com/rss/articles/CBM...  (invólucro)
 *   - Folha:       https://redir.folha.com.br/redir/online/poder/rss091/*https://www1.folha...
 *
 * O Wayback NÃO arquiva invólucro: não há página ali, só um salto. O resultado é que
 * o relatório dizia "16/23 arquivados" enquanto a matéria real ficava desprotegida.
 * Auditoria de 12/Jul: das 11 URLs que faltavam no Wayback, 8 eram redirect do Google
 * News e 1 era o redirect da Folha. Submetendo a URL DIRETA da Folha, arquivou na hora.
 *
 * Ou seja: estávamos preservando o carimbo do correio em vez da carta.
 */
async function resolveRedirect(url: string): Promise<string> {
  // Folha embute a URL final depois de um '*' — extrair sem rede.
  const folha = url.match(/^https?:\/\/redir\.folha\.com\.br\/.*?\*(https?:\/\/.+)$/)
  if (folha) return folha[1]

  // Google News: resolver pelo endpoint interno, porque SEGUIR REDIRECT PAROU
  // DE FUNCIONAR.
  //
  // 🔴 Medido em 04/Set/2026. O `news.google.com/rss/articles/...` responde 200
  // e faz o salto em JAVASCRIPT, então `redirect: 'follow'` nunca sai do
  // domínio: em cinco dailies de 29/Jul a 03/Set, NENHUM invólucro resolveu,
  // inclusive os da véspera. Não é decaimento por idade, é o mecanismo que
  // mudou. E o payload novo é opaco, do tipo `AU_yqL...`, sem a URL em texto,
  // então também não dá para decodificar sem rede.
  //
  // 🕳️ O estrago era silencioso: o arquivador dizia OK e preservava a CASCA de
  // JavaScript do Google, não a matéria. Na rodada de 04/Set, das 23 URLs só 3
  // foram resolvidas, todas da Folha. E 265 das 518 URLs do passivo, 51%, são
  // invólucro, ou seja metade da cota do archive.org, que é escassa, ia para
  // casca. É a mesma armadilha da ficha de 12/Jul: preservar o carimbo do
  // correio em vez da carta.
  //
  // ✅ O caminho que funciona: a página do invólucro carrega os atributos
  // `data-n-a-sg`, `data-n-a-ts` e `data-n-a-id`, e com eles o endpoint
  // `batchexecute` devolve a URL do veículo. Medido: 4 de 4.
  //
  // ⚠️ É endpoint INTERNO do Google, então pode mudar sem aviso. Por isso a
  // falha aqui NÃO derruba nada: cai para a URL original, que é o que o
  // arquivador já fazia. O que não pode voltar a acontecer é a falha passar
  // como sucesso.
  if (url.includes('news.google.com/rss/articles/')) {
    const resolvida = await resolverGoogleNews(url)
    if (resolvida) return resolvida
  }
  return url
}

const UA_NAVEGADOR =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

/** Os três atributos que o endpoint exige. Sem os três, não há o que pedir. */
export function extrairAtributos(html: string): { sg: string; ts: string; id: string } | null {
  const sg = html.match(/data-n-a-sg="([^"]+)"/)?.[1]
  const ts = html.match(/data-n-a-ts="([^"]+)"/)?.[1]
  const id = html.match(/data-n-a-id="([^"]+)"/)?.[1]
  return sg && ts && id ? { sg, ts, id } : null
}

/**
 * A URL do VEÍCULO dentro da resposta do batchexecute.
 * ⚠️ Descarta os domínios do próprio Google, senão o primeiro casamento é um
 * `gstatic` e o arquivador volta a preservar coisa que não é a matéria.
 */
export function extrairUrlDoVeiculo(texto: string): string | null {
  // ⚠️ Aceita a URL CRUA e a ESCAPADA. Medido em 04/Set/2026 o endpoint devolveu
  // barra normal, mas a resposta do batchexecute é JSON dentro de JSON e a mesma
  // URL pode vir com as barras escapadas. A primeira versão deste extrator
  // parava no primeiro contrabarra e capturava só o HOST, jogando o caminho
  // fora, o que faria o arquivador preservar a HOME do veículo em vez da
  // matéria: exatamente o defeito que ele existe para consertar, de novo.
  for (const m of texto.matchAll(/https?:(?:\\?\/){2}[^"\s]+/g)) {
    const u = m[0].replace(/\\\//g, '/').replace(/[\\"',)\]}]+$/, '')
    if (!/news\.google|www\.google|gstatic|googleapis|schema\.org|policies\.google|support\.google/.test(u)) return u
  }
  return null
}

export function montarPayload(a: { sg: string; ts: string; id: string }): string {
  const inner = JSON.stringify([
    'garturlreq',
    [['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1], 'X', 'X', 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
    a.id,
    Number(a.ts),
    a.sg,
  ])
  return JSON.stringify([[['Fbv4je', inner, null, 'generic']]])
}

async function resolverGoogleNews(url: string): Promise<string | null> {
  try {
    const pagina = await fetch(url, { headers: { 'User-Agent': UA_NAVEGADOR }, signal: AbortSignal.timeout(25000) })
    const attrs = extrairAtributos(await pagina.text())
    if (!attrs) return null
    const res = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
      method: 'POST',
      headers: { 'User-Agent': UA_NAVEGADOR, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: 'f.req=' + encodeURIComponent(montarPayload(attrs)),
      signal: AbortSignal.timeout(25000),
    })
    return extrairUrlDoVeiculo(await res.text())
  } catch {
    return null
  }
}

async function archiveOnce(url: string): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(WAYBACK_BASE + url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'AFOS-Analytics-Wayback-Archiver/1.0' },
      signal: controller.signal,
    })
    return res.ok ? { ok: true } : { ok: false, error: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: String(err) }
  } finally {
    clearTimeout(timeout)
  }
}

async function archiveUrl(url: string): Promise<{ ok: boolean; error?: string; attempts: number }> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await archiveOnce(url)
    if (result.ok) return { ok: true, attempts: attempt }
    if (attempt < MAX_RETRIES) {
      const backoff = 2000 * attempt
      await new Promise(r => setTimeout(r, backoff))
    } else {
      return { ok: false, error: result.error, attempts: attempt }
    }
  }
  return { ok: false, error: 'unreachable', attempts: MAX_RETRIES }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const date = process.argv[2]
  if (!date || !isValidDate(date)) {
    console.error('Usage: npx tsx scripts/wayback-archive.ts YYYY-MM-DD')
    process.exit(1)
  }

  const markdown = readDailyMarkdown(date)
  if (!markdown) {
    console.error(`File public/afos-daily/${date}.md not found.`)
    process.exit(1)
  }

  const todas = extractExternalUrls(markdown)

  /**
   * 🔴 A INFRAESTRUTURA SAI DA FILA, medido em 05/Set/2026 ao investigar as 17
   * falhas da rodada de 04/Set.
   *
   * Das 23 URLs daquela daily, 6 eram infraestrutura: 5 do Polymarket e 1 do
   * TSE. Nenhuma das duas arquiva, e as do Polymarket são as CINCO PRIMEIRAS da
   * fila, sistematicamente, porque o bloco de fontes técnicas vem antes das
   * matérias. O disjuntor aborta com 5 falhas de host seguidas.
   *
   * Ou seja: toda rodada começava gastando 26% da cota em URL que não arquiva,
   * e o gasto disparava o próprio disjuntor. A rodada de 29/Jul registrou
   * exatamente isso: 3 arquivadas, 5 falhas, abortada.
   */
  const { arquivar: urls, pular } = separarAlvos(todas)
  console.log(`Wayback archive · AFOS Daily ${date}: ${todas.length} URLs externas`)
  if (pular.length) {
    console.log(`  ${pular.length} fora da fila por serem infraestrutura, e não matéria:`)
    for (const p of pular) console.log(`    ${new URL(p.url).hostname}  ${p.motivo}`)
    console.log(`  restam ${urls.length} para submeter.`)
  }

  if (urls.length === 0) process.exit(0)

  let ok = 0
  let fail = 0

  let resolvidas = 0

  /**
   * 📓 O resultado POR URL, e não só a contagem.
   *
   * 🔴 Instalado em 05/Set/2026 porque a pergunta "por que as 17 falharam?" não
   * teve resposta: o ledger guardava `fail: 17` e mais nada. Sobrou atribuir 6
   * delas à infraestrutura pela composição da daily, e as outras 11 ficaram sem
   * explicação possível, porque ninguém gravou o erro de cada uma.
   *
   * É a mesma família do ledger em si, uma camada abaixo: contagem sem detalhe
   * responde "quanto" e nunca "por quê".
   */
  const resultados: Array<{ url: string; ok: boolean; erro?: string; resolvidaDe?: string; tentativas: number }> = []

  /**
   * DISJUNTOR, instalado 31/Jul/2026.
   *
   * Quando o archive.org bloqueia por excesso de requisição, ele para de
   * responder no host inteiro: `web.archive.org` devolve 000 e a API de
   * disponibilidade devolve 429. Nesse estado a retentativa NÃO recupera nada,
   * ela só triplica o volume contra quem já está bloqueando, e o bloqueio dura
   * mais. Em 31/Jul uma rodada de 38 URLs disparou até 114 requisições numa
   * parede e voltou com 7/38, contra 25/38 na véspera.
   *
   * Falha de host é diferente de falha de URL. Se N seguidas forem de host,
   * a rodada aborta e o que não foi tentado fica para depois, intacto.
   */
  const LIMITE_FALHA_HOST = 5
  const ehFalhaDeHost = (e?: string) =>
    !!e && /fetch failed|429|ECONNRESET|ETIMEDOUT|socket hang up|AbortError/i.test(e)
  let seguidasDeHost = 0
  let abortou = false

  for (let i = 0; i < urls.length; i++) {
    const citada = urls[i]
    // Arquivar a MATÉRIA, não o invólucro de redirect.
    const url = await resolveRedirect(citada)
    if (url !== citada) resolvidas++
    const short = url.length > 70 ? url.slice(0, 67) + '...' : url
    process.stdout.write(`  [${i + 1}/${urls.length}] ${short}${url !== citada ? ' (resolvida)' : ''} `)
    const result = await archiveUrl(url)
    resultados.push({
      url,
      ok: result.ok,
      ...(result.ok ? {} : { erro: String(result.error ?? 'sem mensagem') }),
      ...(url !== citada ? { resolvidaDe: citada } : {}),
      tentativas: result.attempts,
    })
    if (result.ok) {
      console.log(result.attempts > 1 ? `OK (retry ${result.attempts})` : 'OK')
      ok++
      seguidasDeHost = 0
    } else {
      console.log(`FAIL after ${result.attempts} attempts (${result.error})`)
      fail++
      seguidasDeHost = ehFalhaDeHost(result.error) ? seguidasDeHost + 1 : 0
      if (seguidasDeHost >= LIMITE_FALHA_HOST) {
        // 🔴 O DISJUNTOR PASSOU A PROVAR ANTES DE AFIRMAR, em 04/Set/2026.
        //
        // Ele dizia "o archive.org está nos bloqueando" só por contar 5 falhas
        // seguidas, e `ehFalhaDeHost` conta o `fetch failed` genérico do Node,
        // que é o invólucro de QUALQUER erro de transporte, inclusive de um
        // problema da ORIGEM da URL. Medido hoje: as 5 falhas eram de URLs do
        // Polymarket, e a mesma URL respondia 520 no curl, que é erro de
        // Cloudflare na origem, enquanto o `/save/` do archive.org respondia
        // 302 com snapshot novo e a MESMA URL passava no segundo Node fetch.
        //
        // 🕳️ O estrago não foi a rodada perdida, foi a CONCLUSÃO: a mensagem
        // virou diagnóstico, o diagnóstico virou ficha de memória, e o passivo
        // ficou parado dias esperando um bloqueio que não existia.
        const sonda = await archiveUrl('https://example.com')
        if (sonda.ok) {
          console.log(
            `\n   ⚠️ ${LIMITE_FALHA_HOST} falhas seguidas, mas a SONDA do archive.org passou.\n` +
            `      Não é bloqueio de host: são falhas da origem das URLs. Seguindo.\n`
          )
          seguidasDeHost = 0
        } else {
          abortou = true
          console.error(
            `\n🛑 DISJUNTOR: ${LIMITE_FALHA_HOST} falhas seguidas E a sonda do archive.org também falhou (${sonda.error}).\n` +
            `   Agora sim é bloqueio de host. Abortando com ${urls.length - i - 1} URL(s) não tentadas.\n` +
            `   Conferir antes de tentar de novo, com a conversão de caminho DESLIGADA:\n` +
            `     MSYS_NO_PATHCONV=1 curl -s -o /dev/null -w "%{http_code}" "https://web.archive.org/save/https://example.com"\n` +
            `   302 ou 200 = liberado. 429 = bloqueado, ESPERAR.`
          )
          break
        }
      }
    }
    if (i < urls.length - 1) await sleep(THROTTLE_MS)
  }

  console.log(`\nResumo: ${ok}/${urls.length} arquivados${fail > 0 ? `, ${fail} falharam` : ''}${abortou ? ' (rodada ABORTADA pelo disjuntor)' : ''}.`)
  if (resolvidas > 0) console.log(`${resolvidas} URL(s) de redirect resolvidas para a matéria antes de arquivar.`)

  // 📓 LEDGER, instalado 04/Set/2026.
  //
  // 🔴 Até aqui o script NÃO REGISTRAVA NADA, e por isso a pergunta "o que
  // falta arquivar?" só tinha resposta de memória. A ficha dizia "faltam 5 dias
  // de agosto"; a medição pela API de disponibilidade, feita hoje, achou 27 de
  // 38 dailies sem snapshot nas URLs amostradas. A lembrança estava errada por
  // uma ordem de grandeza, e ninguém tinha como saber.
  //
  // Regra que depende de um número que ninguém grava não roda.
  // → memory/feedback_regra_que_depende_de_numero_que_ninguem_grava.md
  try {
    const ledger = 'data/wayback/rodadas.jsonl'
    mkdirSync(dirname(ledger), { recursive: true })
    appendFileSync(
      ledger,
      JSON.stringify({
        quando: new Date().toISOString(),
        daily: date,
        urlsNaDaily: todas.length,
        puladas: pular.length,
        urls: urls.length,
        ok,
        fail,
        abortou,
        resolvidas,
        // 🔑 O detalhe é o que responde "por quê". Sem ele o ledger diz quanto
        // falhou e nunca de que, que foi o vão de 04/Set.
        resultados,
        motivosPulados: pular.map((p) => ({ url: p.url, motivo: p.motivo })),
      }) + '\n'
    )
    console.log(`📓 rodada anotada em ${ledger}`)
  } catch (e) {
    // ⚠️ Falha ao anotar NÃO derruba a rodada: o arquivamento já aconteceu e
    // perder o registro é menos grave que perder o trabalho. Mas AVISA, porque
    // silêncio aqui recria exatamente o vão que este ledger fecha.
    console.error(`⚠️ não consegui anotar a rodada no ledger: ${(e as Error).message}`)
  }
  process.exit(fail > 0 ? 1 : 0)
}

// ⚠️ `main()` solto rodava no IMPORT, entao o arquivo de teste disparava uma
// rodada inteira em vez de exercitar as funcoes puras. Guard de entrada com
// `pathToFileURL`, que e o que casa no Windows: `import.meta.url` traz tres
// barras e comparacao montada a mao falha em silencio.
if (import.meta.url === pathToFileURL(process.argv[1]).href) main()
