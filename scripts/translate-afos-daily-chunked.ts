import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { translate } from '../lib/ai/translate'
import { loadGlossary } from '../lib/glossary/loader'
import { MONTHS } from '../lib/i18n/months'

const DAILY_DIR = join(process.cwd(), 'public', 'afos-daily')

type TargetLocale = 'en' | 'es'

const TARGET_LOCALE_NAMES: Record<TargetLocale, string> = { en: 'English', es: 'Spanish' }

function buildTitle(date: string, locale: TargetLocale): string {
  const [y, m, d] = date.split('-').map(Number)
  return locale === 'en'
    ? `AFOS Daily — ${MONTHS.en[m - 1]} ${d}, ${y}`
    : `AFOS Daily — ${d} de ${MONTHS.es[m - 1]} de ${y}`
}

async function translateChunk(text: string, locale: TargetLocale, glossary: Array<{ term: string; id: string }>) {
  return translate({
    sourceText: text,
    sourceLocale: 'pt-BR',
    targetLocale: locale,
    type: 'afos-daily',
    glossaryEntries: glossary,
  })
}

/**
 * GUARD DE INTEGRIDADE DE URL (instalado 12/Jul/2026).
 *
 * O modelo CORROMPE tokens base64 dentro das URLs do Google News ao traduzir:
 * "...RlJRdU85U2N4..." virou "...RlJRdU81S2N4..." (85 -> 81). O link continua com
 * cara de válido, passa em qualquer validador de formato, e simplesmente NÃO RESOLVE.
 * É corrupção SILENCIOSA: só quebra quando o leitor clica. Aconteceu em 9 URLs no
 * Daily de 12/Jul (5 no EN, 4 no ES).
 *
 * Também observado: o modelo troca links EXTERNOS por links internos de glossário
 * (ex.: [Polymarket](/es/glossary#polymarket)) e dropa links inteiros.
 *
 * Estratégia: as URLs são dados, não texto a traduzir. Toda URL do texto traduzido é
 * casada com a do original por prefixo comum mais longo e SUBSTITUÍDA pela original.
 * URL sem match suficiente aborta a tradução em vez de gravar link quebrado.
 */
function enforceUrlIntegrity(translated: string, source: string, locale: string): string {
  const URL_RE = /https?:\/\/[^\s)\]]+/g
  const srcUrls = [...new Set(source.match(URL_RE) ?? [])]
  if (srcUrls.length === 0) return translated

  const lcp = (a: string, b: string) => {
    let i = 0
    while (i < a.length && i < b.length && a[i] === b[i]) i++
    return i
  }

  let restauradas = 0
  const orfas: string[] = []
  const out = translated.replace(URL_RE, (u) => {
    if (srcUrls.includes(u)) return u
    let best: string | null = null
    let bestLen = 0
    for (const s of srcUrls) {
      const n = lcp(u, s)
      if (n > bestLen) { bestLen = n; best = s }
    }
    // 40 chars de prefixo comum: suficiente para identificar o host + caminho inicial
    // sem correr o risco de casar duas URLs distintas do mesmo domínio.
    if (best && bestLen >= 40) { restauradas++; return best }
    orfas.push(u)
    return u
  })

  if (restauradas > 0) console.log(`   🔧 [${locale}] ${restauradas} URL(s) corrompida(s) pelo modelo, restauradas do original`)
  if (orfas.length > 0) {
    console.error(`\n❌ [${locale}] ${orfas.length} URL(s) no texto traduzido não existem no original e não puderam ser casadas:`)
    orfas.forEach(u => console.error(`   ${u}`))
    console.error('   O modelo inventou ou destruiu essas URLs. Abortando para não gravar link quebrado.')
    process.exit(1)
  }

  // Nenhuma URL do original pode SUMIR na tradução (o modelo dropa links).
  const outUrls = out.match(URL_RE) ?? []
  const count = (arr: string[], u: string) => arr.filter(x => x === u).length
  const srcAll = source.match(URL_RE) ?? []
  const perdidas = srcUrls.filter(u => count(outUrls, u) < count(srcAll, u))
  if (perdidas.length > 0) {
    console.error(`\n⚠️  [${locale}] ${perdidas.length} URL(s) do original aparecem MENOS vezes na tradução (link dropado pelo modelo):`)
    perdidas.forEach(u => console.error(`   original=${count(srcAll, u)}x  traduzido=${count(outUrls, u)}x  ${u.slice(0, 80)}`))
    console.error('   Corrigir manualmente antes de publicar (o texto foi gravado mesmo assim).')
  }

  return out
}

async function main() {
  const date = process.argv[2]
  const locale = process.argv[3] as TargetLocale
  if (!date || !['en', 'es'].includes(locale)) {
    console.error('Usage: translate-afos-daily-chunked.ts <YYYY-MM-DD> <en|es>')
    process.exit(1)
  }

  const path = join(DAILY_DIR, `${date}.md`)
  const raw = readFileSync(path, 'utf-8')
  const { data: fm, content: body } = matter(raw)
  const lede = String(fm.lede ?? '')
  // tldr: optional 3-bullet summary; translate each bullet separately if present
  const tldr: string[] = Array.isArray(fm.tldr)
    ? fm.tldr.filter((b: unknown): b is string => typeof b === 'string' && b.trim().length > 0)
    : []

  const glossaryEntries = loadGlossary().map(e => ({ term: e.term, id: e.id }))

  // Split body in 4 chunks: each at ## section boundary
  // Chunk A: title + section 1 + section 2
  // Chunk B: section 3
  // Chunk C: section 4 + Em síntese
  // Chunk D: --- + sources + método (large URL block)
  const sec3Idx = body.indexOf('## 3. ')
  const sec4Idx = body.indexOf('## 4. ')
  // sepIdx: separator AFTER sec4 (lede may have its own `---` before sec1, ignore it)
  const sepIdx = body.indexOf('\n---\n', sec4Idx)
  if (sec3Idx < 0 || sec4Idx < 0 || sepIdx < 0) {
    console.error('Section markers not found in body')
    process.exit(1)
  }
  const chunkA = body.slice(0, sec3Idx)
  const chunkB = body.slice(sec3Idx, sec4Idx)
  const chunkC = body.slice(sec4Idx, sepIdx)
  const chunkDFull = body.slice(sepIdx)

  // Split chunk D further if too large: at "matérias secundárias" heading
  // (sources block with many Google News URLs can exceed API max_tokens)
  const secondMatIdx = chunkDFull.indexOf('matérias secundárias')
  const splitDPoint = secondMatIdx > 0 ? chunkDFull.lastIndexOf('\n\n**', secondMatIdx) : -1
  const chunkD1 = splitDPoint > 0 ? chunkDFull.slice(0, splitDPoint) : chunkDFull
  const chunkD2 = splitDPoint > 0 ? chunkDFull.slice(splitDPoint) : ''

  console.log(`📖 ${date} body=${body.length} chars (chunks: ${chunkA.length}+${chunkB.length}+${chunkC.length}+${chunkD1.length}${chunkD2 ? '+' + chunkD2.length : ''})`)
  console.log(`🌐 Translating to ${TARGET_LOCALE_NAMES[locale]}...`)

  console.log('   [1/6] lede')
  const ledeResult = await translateChunk(lede, locale, glossaryEntries)

  // Translate TL;DR bullets (if present). Each bullet is small (~150-200 chars),
  // so translating individually is cheap and keeps glossary tagging granular.
  let tldrTranslated: string[] = []
  if (tldr.length > 0) {
    console.log(`   [1.5/6] TL;DR (${tldr.length} bullets)`)
    for (const bullet of tldr) {
      const r = await translateChunk(bullet, locale, glossaryEntries)
      tldrTranslated.push(r.translatedText.trim())
    }
  }

  console.log('   [2/6] chunk A (title + sec 1 + sec 2)')
  const aResult = await translateChunk(chunkA, locale, glossaryEntries)

  console.log('   [3/6] chunk B (sec 3)')
  let bText: string
  if (chunkB.length > 7000) {
    // Section 3 with many long Google News URLs exceeds output tokens — split at paragraph boundaries
    const parts: string[] = []
    let remaining = chunkB
    while (remaining.length > 5000) {
      const splitAt = remaining.lastIndexOf('\n\n', 5000)
      const cut = splitAt > 2000 ? splitAt + 2 : 5000
      parts.push(remaining.slice(0, cut))
      remaining = remaining.slice(cut)
    }
    if (remaining.length > 0) parts.push(remaining)
    console.log(`   Split B in ${parts.length} sub-chunks: ${parts.map(p => p.length).join('+')}`)
    const bResults: string[] = []
    for (let i = 0; i < parts.length; i++) {
      console.log(`   [B.${i + 1}/${parts.length}] ${parts[i].length} chars`)
      const r = await translateChunk(parts[i], locale, glossaryEntries)
      bResults.push(r.translatedText)
    }
    bText = bResults.join('')
  } else {
    const bResult = await translateChunk(chunkB, locale, glossaryEntries)
    bText = bResult.translatedText
  }

  console.log('   [4/6] chunk C (sec 4 + Em síntese)')
  const cResult = await translateChunk(chunkC, locale, glossaryEntries)

  console.log('   [5/6] chunk D1 (separator + anchor sources)')
  const d1Result = await translateChunk(chunkD1, locale, glossaryEntries)

  let d2Text = ''
  if (chunkD2) {
    // Quartile-split D2: long URL list blows past API limits when in 1-2 chunks.
    // Split at "- [" boundaries to keep each chunk under ~5000 chars.
    if (chunkD2.length > 8000) {
      const quarter = Math.floor(chunkD2.length / 4)
      const p1 = chunkD2.indexOf('\n- [', quarter)
      const p2 = p1 > 0 ? chunkD2.indexOf('\n- [', p1 + quarter) : -1
      const p3 = p2 > 0 ? chunkD2.indexOf('\n- [', p2 + quarter) : -1
      const parts = [
        chunkD2.slice(0, p1 > 0 ? p1 : chunkD2.length),
        p1 > 0 ? chunkD2.slice(p1, p2 > 0 ? p2 : chunkD2.length) : '',
        p2 > 0 ? chunkD2.slice(p2, p3 > 0 ? p3 : chunkD2.length) : '',
        p3 > 0 ? chunkD2.slice(p3) : '',
      ].filter(Boolean)
      console.log(`   Split D2 in ${parts.length} sub-chunks: ${parts.map(p => p.length).join('+')}`)
      const results: string[] = []
      for (let i = 0; i < parts.length; i++) {
        console.log(`   [D2.${i + 1}/${parts.length}] ${parts[i].length} chars`)
        const r = await translateChunk(parts[i], locale, glossaryEntries)
        results.push(r.translatedText)
      }
      d2Text = results.join('')
    } else {
      console.log('   [6/6] chunk D2 (secondary sources + método)')
      const d2Result = await translateChunk(chunkD2, locale, glossaryEntries)
      d2Text = d2Result.translatedText
    }
  }

  let translatedBody = aResult.translatedText + bText + cResult.translatedText + d1Result.translatedText + d2Text

  // ============================================================
  // POST-PROCESS — corrige bugs cumulativos do tradutor
  // Documentado em memory/feedback_translator_known_bugs.md
  // ============================================================
  // 1. Insert blank line before ## headers glued to previous content
  // Use [^\n#] (NOT just [^\n]) to avoid breaking ### into # + ##.
  // Match both '\n##' (already on own line) and inline '##' (no newline at all).
  translatedBody = translatedBody.replace(/([^\n#])(## )/g, '$1\n\n$2')
  translatedBody = translatedBody.replace(/([^\n#])(### )/g, '$1\n\n$2')
  // 2. Restore ### Calendar heading split into '#\n\n## 📅' or '## 📅'
  translatedBody = translatedBody.replace(/\n#\n+## 📅/g, '\n\n### 📅')
  translatedBody = translatedBody.replace(/^## 📅 /gm, '### 📅 ')
  // 2b. Fronteira D1→D2: os chunks são concatenados SEM separador (ver a soma acima) e o
  // modelo não devolve a quebra de linha final. Resultado: o heading em negrito das fontes
  // secundárias COLA no fim do último bullet de âncora, na mesma linha:
  //   "- [Folha - ...](url)**Secondary stories (Google News redirect...):**"
  // Bug visível em produção no Daily de 12/Jul (EN e ES), pego pelo André na tela.
  //
  // ⚠️ O padrão genérico /\)(\*\*...\*\*)/ NÃO serve: ele casa prosa legítima do TL;DR,
  // onde o ')' está DENTRO do negrito ("**empate no 1º turno (36% × 36%)** e **...").
  // Ali o '**' é FECHAMENTO, não abertura, e a quebra corromperia a frase.
  // Por isso o match exige o texto do heading de fontes secundárias.
  translatedBody = translatedBody.replace(
    /\)(\*\*[^\n*]*(?:secundári|secundaria|Secondary)[^\n*]*\*\*)/gi,
    ')\n\n$1',
  )
  // 3. Em-dash auto-replacement: standalone — used as section separator
  translatedBody = translatedBody.replace(/^—$/gm, '---')
  translatedBody = translatedBody.replace(/^—{2,}$/gm, '---')
  // 4. Em-dash in table separator row: |—|—|...|  →  |---|---|...|
  translatedBody = translatedBody.replace(/^\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|[—\-\s]+\|$/gm, '|---|---|---|---|---|---|')

  const yamlLines = [
    '---',
    `date: ${fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : fm.date}`,
    `updatedAt: "${fm.updatedAt}"`,
    `title: ${JSON.stringify(buildTitle(date, locale))}`,
    `locale: ${locale}`,
    'status: draft',
    `lede: ${JSON.stringify(ledeResult.translatedText)}`,
  ]
  if (tldrTranslated.length > 0) {
    yamlLines.push('tldr:')
    for (const bullet of tldrTranslated) {
      yamlLines.push(`  - ${JSON.stringify(bullet)}`)
    }
  }
  yamlLines.push('---', '', '') // 5. Blank line between frontmatter close and content (lede blockquote rendering)
  let outMd = yamlLines.join('\n') + translatedBody.trim() + '\n'

  // URLs são DADOS, não texto: restaurar do original qualquer uma que o modelo tenha
  // corrompido (tokens base64 do Google News) ou trocado por link de glossário.
  outMd = enforceUrlIntegrity(outMd, raw, locale)

  // O modelo reintroduz travessão mesmo quando o original não tem (regra anti-AI da casa).
  const travessoes = (outMd.match(/—/g) ?? []).length
  if (travessoes > 0) {
    outMd = outMd.replace(/ — /g, ' - ').replace(/—/g, '-')
    console.log(`   🔧 [${locale}] ${travessoes} travessão(ões) reintroduzido(s) pelo modelo, trocado(s) por traço comum`)
  }

  const outPath = join(DAILY_DIR, `${date}.${locale}.md`)
  writeFileSync(outPath, outMd, 'utf-8')
  console.log(`   ✅ ${outPath} written (${outMd.length} chars)`)
}

main().catch(err => {
  console.error('\n❌ Translation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
