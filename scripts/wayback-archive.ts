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
import { isValidDate, readDailyMarkdown, extractExternalUrls } from './lib/daily-files'

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

  // Google News: seguir o redirect até a matéria do veículo.
  if (url.includes('news.google.com/rss/articles/')) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' },
        signal: AbortSignal.timeout(20000),
      })
      const final = res.url
      if (final && !final.includes('news.google.com')) return final
    } catch {
      // rede falhou: cair para a URL original (melhor tentar que pular)
    }
  }
  return url
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

  const urls = extractExternalUrls(markdown)
  console.log(`Wayback archive — AFOS Daily ${date}: ${urls.length} URLs externas`)

  if (urls.length === 0) process.exit(0)

  let ok = 0
  let fail = 0

  let resolvidas = 0

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
        urls: urls.length,
        ok,
        fail,
        abortou,
        resolvidas,
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

main()
