#!/usr/bin/env node
/**
 * fetch-google-news.mjs
 *
 * Coleta Google News RSS preservando URLs primárias (campo <link>).
 * Resolve o problema de URLs homepage que não levam à matéria específica.
 *
 * O <link> retorna URL agregadora `news.google.com/rss/articles/CBM...` que
 * REDIRECIONA para a matéria primária ao ser clicada — funciona mesmo para
 * veículos com anti-bot (UOL, Globo, Estadão, Folha).
 *
 * Output: public/news-cache/{YYYY-MM-DD}.json
 *
 * Usado pelo skill /atualizar e /afos-daily para evitar coleta sem URL primária.
 *
 * Uso:
 *   node scripts/fetch-google-news.mjs           # data = hoje
 *   node scripts/fetch-google-news.mjs 2026-05-07  # data específica
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const QUERIES = [
  { id: 'eleicoes-2026', q: 'eleições 2026 presidente Brasil when:1d' },
  { id: 'flavio-lula', q: 'Flávio Bolsonaro Lula 2026 when:1d' },
  { id: 'master-vorcaro', q: 'Banco Master Vorcaro STF INSS CPI when:1d' },
  { id: 'pesquisas', q: 'pesquisa eleitoral Datafolha AtlasIntel Quaest 2026 when:2d' },
  { id: 'aprovacao', q: 'Lula aprovação rejeição governo redes sociais when:1d' },
  { id: 'estaduais', q: 'governador senado eleição 2026 when:1d' },
]

async function fetchRSS(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AFOS-News-Bot/1.0; +https://www.afos-analytics.com)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${query}`)
  return await res.text()
}

// Parser RSS simples via regex — estrutura do Google News é fixa.
// Cada <item> tem: <title>, <link>, <pubDate>, <source url="...">Veículo</source>, <description>
function parseItems(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`))
      return m ? m[1].trim() : ''
    }
    const sourceMatch = block.match(/<source[^>]*url="([^"]+)"[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/source>/)
    items.push({
      title: get('title'),
      link: get('link'),
      pubDate: get('pubDate'),
      sourceName: sourceMatch ? sourceMatch[2].trim() : '',
      sourceUrl: sourceMatch ? sourceMatch[1] : '',
      description: get('description'),
    })
  }
  return items
}

async function main() {
  const argDate = process.argv[2]
  const date = argDate || new Date().toISOString().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`Invalid date: ${date}. Use YYYY-MM-DD.`)
    process.exit(1)
  }

  const outDir = join(process.cwd(), 'public', 'news-cache')
  mkdirSync(outDir, { recursive: true })

  const allItems = {}
  let totalItems = 0
  let totalErrors = 0

  for (const { id, q } of QUERIES) {
    process.stdout.write(`Fetching ${id}... `)
    try {
      const xml = await fetchRSS(q)
      const items = parseItems(xml)
      allItems[id] = { query: q, items }
      totalItems += items.length
      console.log(`✓ ${items.length} items`)
    } catch (err) {
      console.log(`✗ ${err.message}`)
      allItems[id] = { query: q, items: [], error: String(err) }
      totalErrors++
    }
  }

  const outPath = join(outDir, `${date}.json`)
  const payload = {
    date,
    fetchedAt: new Date().toISOString(),
    totalItems,
    totalErrors,
    queries: allItems,
  }
  writeFileSync(outPath, JSON.stringify(payload, null, 2))

  console.log(`\nSaved: ${outPath}`)
  console.log(`Total items: ${totalItems}`)
  console.log(`Errors: ${totalErrors}/${QUERIES.length}`)

  // Fail-fast: qualquer query falhando significa cache incompleto.
  // Daily depende de cache completo para fluxo híbrido — re-rodar antes de prosseguir.
  if (totalErrors > 0) {
    console.error(`\n${totalErrors}/${QUERIES.length} queries falharam. Cache incompleto — re-execute.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
