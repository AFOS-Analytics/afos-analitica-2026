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

// Feeds RSS dos veículos de prestígio brasileiros (Folha, O Globo, Estadão, G1, Valor).
// Esses feeds são endpoints públicos oficiais para syndication — URLs primárias do veículo,
// sem anti-bot, sem paywall ao nível de URL (clique vai à matéria; conteúdo pode ser pago).
// Adicionado em 07/Mai/2026 após meta-falha: a /afos-daily 07/Mai cedo usei só Google News
// e não consegui URLs primárias para Folha/O Globo. RSS direto resolve definitivamente.
const PRESTIGE_FEEDS = [
  // Folha de S.Paulo
  { id: 'prestige-folha-poder', source: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/poder/rss091.xml' },
  { id: 'prestige-folha-mercado', source: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/mercado/rss091.xml' },
  { id: 'prestige-folha-cotidiano', source: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/cotidiano/rss091.xml' },
  // O Globo
  { id: 'prestige-oglobo-politica', source: 'O Globo', url: 'https://oglobo.globo.com/rss/oglobo/politica/' },
  { id: 'prestige-oglobo-economia', source: 'O Globo', url: 'https://oglobo.globo.com/rss/oglobo/economia/' },
  { id: 'prestige-oglobo-brasil', source: 'O Globo', url: 'https://oglobo.globo.com/rss/oglobo/brasil/' },
  // G1
  { id: 'prestige-g1-politica', source: 'G1', url: 'https://g1.globo.com/rss/g1/politica/' },
  // Estadão (URL via meta tag rss+xml descoberta na home — endpoint Arc CMS)
  { id: 'prestige-estadao-geral', source: 'Estadão', url: 'https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/geral/?body=%7B%22layout%22:%22google-news%22%7D' },
  { id: 'prestige-estadao-politica', source: 'Estadão', url: 'https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/politica/?body=%7B%22layout%22:%22google-news%22%7D' },
  { id: 'prestige-estadao-economia', source: 'Estadão', url: 'https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/economia/?body=%7B%22layout%22:%22google-news%22%7D' },
  // Valor (feed único)
  { id: 'prestige-valor', source: 'Valor', url: 'https://valor.globo.com/rss/valor' },
  // VEJA (oficial endpoint via meta tag rss+xml descoberta)
  { id: 'prestige-veja-ultimas', source: 'VEJA', url: 'https://veja.abril.com.br/ultimas-noticias/rss' },
  { id: 'prestige-veja-politica', source: 'VEJA', url: 'https://veja.abril.com.br/politica/feed/' },
  { id: 'prestige-veja-economia', source: 'VEJA', url: 'https://veja.abril.com.br/economia/feed/' },
]

const FETCH_TIMEOUT_MS = 30000  // 30s timeout per query — Google News RSS pode estar lento
const MAX_RETRIES = 2  // 1 retry em transient (429/5xx/network)

async function fetchRSS(query, attempt = 0) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AFOS-News-Bot/1.0; +https://www.afos-analytics.com)' },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!res.ok) {
      // 429 (rate limit) e 5xx (transient) merecem retry
      if (attempt < MAX_RETRIES && (res.status === 429 || res.status >= 500)) {
        const backoffMs = 1000 * Math.pow(2, attempt)  // 1s, 2s
        await new Promise((r) => setTimeout(r, backoffMs))
        return fetchRSS(query, attempt + 1)
      }
      throw new Error(`HTTP ${res.status} for ${query}`)
    }
    return await res.text()
  } catch (err) {
    clearTimeout(timeoutId)
    // AbortError (timeout) ou network failure — retry se atrás do limite
    if (attempt < MAX_RETRIES && (err.name === 'AbortError' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
      const backoffMs = 1000 * Math.pow(2, attempt)
      await new Promise((r) => setTimeout(r, backoffMs))
      return fetchRSS(query, attempt + 1)
    }
    throw err
  }
}

// Parser RSS estruturado — sem regex frágil de CDATA. Usa string scanning
// que tolera CDATA aninhado e escape de entities.
function parseItems(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    // Extrair tag content, lidando com CDATA wrapping. Pega greedy o conteúdo
    // entre <tag> e </tag>, depois remove <![CDATA[...]]> wrapper se existir.
    const getTag = (tag) => {
      const tagRe = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`)
      const m = block.match(tagRe)
      if (!m) return ''
      let content = m[1]
      // Remove CDATA wrapper se presente (preserva ]]> internos no conteúdo)
      const cdataMatch = content.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/)
      if (cdataMatch) content = cdataMatch[1]
      return content.trim()
    }

    // Source tag tem atributo url + content text
    const sourceMatch = block.match(/<source\b[^>]*\burl="([^"]+)"[^>]*>([\s\S]*?)<\/source>/)
    let sourceName = ''
    let sourceUrl = ''
    if (sourceMatch) {
      sourceUrl = sourceMatch[1]
      let content = sourceMatch[2]
      const cdataMatch = content.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/)
      if (cdataMatch) content = cdataMatch[1]
      sourceName = content.trim()
    }

    items.push({
      title: getTag('title'),
      link: getTag('link'),
      pubDate: getTag('pubDate'),
      sourceName,
      sourceUrl,
      description: getTag('description'),
    })
  }
  return items
}

// Filtra items inválidos (sem link OU sem título). Items com sourceUrl vazio
// são preservados (Google News às vezes omite source para alguns publishers).
function filterValidItems(items) {
  return items.filter((item) => {
    if (!item.link || !item.link.startsWith('http')) return false
    if (!item.title || item.title.length < 5) return false
    return true
  })
}

// Fetch RSS de um veículo de prestígio (Folha/O Globo/Estadão/G1/Valor).
// Diferente do Google News: source pré-conhecido, URL primária do veículo.
async function fetchPrestigeRSSFeed(feedUrl, sourceName, attempt = 0) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AFOS-News-Bot/1.0; +https://www.afos-analytics.com)' },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!res.ok) {
      if (attempt < MAX_RETRIES && (res.status === 429 || res.status >= 500)) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
        return fetchPrestigeRSSFeed(feedUrl, sourceName, attempt + 1)
      }
      throw new Error(`HTTP ${res.status} for ${feedUrl}`)
    }
    return await res.text()
  } catch (err) {
    clearTimeout(timeoutId)
    if (attempt < MAX_RETRIES && (err.name === 'AbortError' || err.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
      return fetchPrestigeRSSFeed(feedUrl, sourceName, attempt + 1)
    }
    throw err
  }
}

// Filtra items por janela temporal — só matérias do dia alvo ±24h.
// RSS feeds podem ter histórico de dias; queremos só recentes pra daily.
function filterByDateWindow(items, targetDate) {
  const target = new Date(targetDate + 'T12:00:00Z').getTime()
  const windowMs = 30 * 60 * 60 * 1000  // 30h: ontem 18h até hoje 24h
  return items.filter((item) => {
    if (!item.pubDate) return true  // sem pubDate, manter (raro)
    const pubMs = new Date(item.pubDate).getTime()
    if (isNaN(pubMs)) return true  // formato inválido, manter
    return Math.abs(target - pubMs) <= windowMs
  })
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

  // 6 queries Google News + 11 feeds RSS prestige em paralelo (single batch).
  // Volume baixo, hosts diversos, sem rate-limit prático. Worst-case ~30s.
  console.log(`Fetching ${QUERIES.length} Google News queries + ${PRESTIGE_FEEDS.length} prestige RSS feeds in parallel...`)

  const googleNewsResults = await Promise.all(
    QUERIES.map(async ({ id, q }) => {
      try {
        const xml = await fetchRSS(q)
        const rawItems = parseItems(xml)
        const items = filterValidItems(rawItems)
        return { id, q, items, filteredOut: rawItems.length - items.length, error: null, kind: 'google' }
      } catch (err) {
        return { id, q, items: [], filteredOut: 0, error: String(err), kind: 'google' }
      }
    }),
  )

  const prestigeResults = await Promise.all(
    PRESTIGE_FEEDS.map(async ({ id, source, url }) => {
      try {
        const xml = await fetchPrestigeRSSFeed(url, source)
        const rawItems = parseItems(xml).map((it) => ({ ...it, sourceName: source }))
        let items = filterValidItems(rawItems)
        items = filterByDateWindow(items, date)
        return { id, q: url, source, items, filteredOut: rawItems.length - items.length, error: null, kind: 'prestige' }
      } catch (err) {
        return { id, q: url, source, items: [], filteredOut: 0, error: String(err), kind: 'prestige' }
      }
    }),
  )

  const results = [...googleNewsResults, ...prestigeResults]

  const allItems = {}
  let totalItems = 0
  let totalErrors = 0
  let totalFiltered = 0
  for (const { id, q, items, filteredOut, error } of results) {
    if (error) {
      console.log(`  ✗ ${id}: ${error}`)
      allItems[id] = { query: q, items: [], error }
      totalErrors++
    } else {
      const filterNote = filteredOut > 0 ? ` (${filteredOut} dropped)` : ''
      console.log(`  ✓ ${id}: ${items.length} items${filterNote}`)
      allItems[id] = { query: q, items }
      totalItems += items.length
      totalFiltered += filteredOut
    }
  }

  const outPath = join(outDir, `${date}.json`)
  const payload = {
    date,
    fetchedAt: new Date().toISOString(),
    totalItems,
    totalErrors,
    totalFiltered,
    queries: allItems,
  }
  writeFileSync(outPath, JSON.stringify(payload, null, 2))

  console.log(`\nSaved: ${outPath}`)
  console.log(`Total items: ${totalItems}`)
  if (totalFiltered > 0) console.log(`Items filtered (invalid link/title): ${totalFiltered}`)
  console.log(`Errors: ${totalErrors}/${QUERIES.length}`)

  // Fail-fast: qualquer query falhando significa cache incompleto.
  // Daily depende de cache completo para fluxo híbrido — re-rodar antes de prosseguir.
  if (totalErrors > 0) {
    console.error(`\n${totalErrors}/${QUERIES.length} queries falharam. Cache incompleto — re-execute.`)
    process.exit(1)
  }

  // Sanity check: cada query deve ter pelo menos 1 item válido.
  // 0 itens é suspeito (provavelmente filtro Google News mudou ou anti-bot).
  const emptyQueries = Object.entries(allItems).filter(([, q]) => q.items.length === 0)
  if (emptyQueries.length > 0) {
    console.warn(`\n⚠ ${emptyQueries.length} queries retornaram zero items: ${emptyQueries.map(([id]) => id).join(', ')}`)
    console.warn('Possível: anti-bot, filtro Google News mudou, ou janela "when:1d" muito curta.')
    // Não exit 1 — cache parcial é melhor que zero, mas alerta usuário.
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
