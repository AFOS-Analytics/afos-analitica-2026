/**
 * wayback-archive.ts — arquiva URLs citadas na AFOS Daily via archive.org
 *
 * Origem: Fase 3.2 do guardrail. Cobre 2 categorias de erro:
 *   - Link rot (URL viva mas conteudo mudou)
 *   - Edit silencioso (veiculo edita matéria depois sem nota de retificacao)
 *
 * Estrategia (PolitiFact-style):
 *   1. Extrai URLs do markdown da AFOS Daily
 *   2. Para cada URL, dispara https://web.archive.org/save/{url}
 *   3. Aguarda confirmacao do snapshot (Wayback retorna 200 com Location header)
 *   4. Reporta sucesso/falha por URL
 *
 * Uso recomendado: rodar antes de `scripts/publish-afos-daily.ts` para garantir
 * que toda fonte citada tem snapshot permanente. Ate Wayback ter snapshot
 * confirmado, NAO publicar.
 *
 * Usage:
 *   npx tsx scripts/wayback-archive.ts 2026-05-01
 *   npx tsx scripts/wayback-archive.ts 2026-05-01 --dry-run    # nao chama API, so lista
 *
 * Custo: zero. Wayback Machine e' gratuito.
 * Throttle: aguarda 5s entre requests para nao sobrecarregar archive.org.
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const WAYBACK_BASE = 'https://web.archive.org/save/'
const THROTTLE_MS = 5000

function readMarkdown(date: string): string | null {
  const path = join(ROOT, 'public', 'afos-daily', `${date}.md`)
  if (!existsSync(path)) return null
  return readFileSync(path, 'utf-8')
}

function extractUrls(text: string): string[] {
  // Matches markdown link [...](http://... ou https://...)
  const re = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g
  const urls = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const url = m[1]
    // Ignora URLs internas do AFOS (links de glossario, etc.)
    if (url.includes('afos-analytics.com')) continue
    if (url.startsWith('/')) continue
    urls.add(url)
  }
  return Array.from(urls)
}

async function archiveUrl(url: string): Promise<{ ok: boolean; archived?: string; error?: string }> {
  try {
    const archiveUrl = WAYBACK_BASE + url
    const res = await fetch(archiveUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'AFOS-Analytics-Wayback-Archiver/1.0' },
    })
    if (res.ok) {
      // O Wayback retorna a URL final do snapshot na headers ou na URL final
      return { ok: true, archived: res.url }
    }
    return { ok: false, error: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const date = process.argv[2]
  const dryRun = process.argv.includes('--dry-run')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Usage: npx tsx scripts/wayback-archive.ts YYYY-MM-DD [--dry-run]')
    process.exit(1)
  }

  const markdown = readMarkdown(date)
  if (!markdown) {
    console.error(`File public/afos-daily/${date}.md not found.`)
    process.exit(1)
  }

  const urls = extractUrls(markdown)

  console.log(`Wayback archive — AFOS Daily ${date}`)
  console.log(`URLs externas extraidas: ${urls.length}\n`)

  if (urls.length === 0) {
    console.log('Nenhuma URL externa encontrada. Nada a arquivar.')
    process.exit(0)
  }

  if (dryRun) {
    console.log('DRY RUN — listando URLs sem arquivar:\n')
    urls.forEach((u, i) => console.log(`  [${i + 1}] ${u}`))
    process.exit(0)
  }

  console.log(`Iniciando arquivamento (throttle ${THROTTLE_MS}ms entre requests)...\n`)

  const results: Array<{ url: string; ok: boolean; archived?: string; error?: string }> = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    process.stdout.write(`  [${i + 1}/${urls.length}] ${url.slice(0, 70)}${url.length > 70 ? '...' : ''} `)
    const result = await archiveUrl(url)
    if (result.ok) {
      console.log('OK')
    } else {
      console.log(`FAIL (${result.error})`)
    }
    results.push({ url, ...result })
    if (i < urls.length - 1) await sleep(THROTTLE_MS)
  }

  const ok = results.filter((r) => r.ok).length
  const fail = results.filter((r) => !r.ok).length

  console.log(`\nResumo: ${ok} arquivados / ${fail} falharam (de ${urls.length} URLs).`)

  if (fail > 0) {
    console.log('\nFalhas:')
    results.filter((r) => !r.ok).forEach((r) => {
      console.log(`  - ${r.url}: ${r.error}`)
    })
    console.log('\nNotas:')
    console.log('  - Paywalls (Folha, Estadão, O Globo) podem retornar erro mas Wayback ainda salva snapshot publico.')
    console.log('  - Erros 429 = rate limit, aumentar THROTTLE_MS.')
    console.log('  - Erros de conexao podem ser temporarios; tentar de novo em 5min.')
  }

  process.exit(fail > 0 ? 1 : 0)
}

main()
