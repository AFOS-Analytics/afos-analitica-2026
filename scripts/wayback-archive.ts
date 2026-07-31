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
        abortou = true
        console.error(
          `\n🛑 DISJUNTOR: ${LIMITE_FALHA_HOST} falhas de HOST seguidas. O archive.org está nos bloqueando.\n` +
          `   Abortando com ${urls.length - i - 1} URL(s) ainda não tentadas, para não aprofundar o bloqueio.\n` +
          `   Conferir antes de tentar de novo:\n` +
          `     curl -s -o /dev/null -w "%{http_code}" https://web.archive.org\n` +
          `   200 = liberado. 000 ou 429 = ainda bloqueado, ESPERAR.`
        )
        break
      }
    }
    if (i < urls.length - 1) await sleep(THROTTLE_MS)
  }

  console.log(`\nResumo: ${ok}/${urls.length} arquivados${fail > 0 ? `, ${fail} falharam` : ''}${abortou ? ' (rodada ABORTADA pelo disjuntor)' : ''}.`)
  if (resolvidas > 0) console.log(`${resolvidas} URL(s) de redirect resolvidas para a matéria antes de arquivar.`)
  process.exit(fail > 0 ? 1 : 0)
}

main()
