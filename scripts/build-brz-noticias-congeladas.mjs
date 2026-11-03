// Painel do Brasil CONGELADO em 02/Nov/2026: a seção de notícias deixa de buscar
// o Google News a cada visita e passa a servir as notícias da noite da apuração,
// tiradas do cache de 25/Out (public/news-cache/2026-10-25.json), no mesmo
// formato que a rota /api/news devolvia. Uso: node scripts/build-brz-noticias-congeladas.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const ORIGEM = 'public/news-cache/2026-10-25.json'
const DESTINO = 'public/brz-congelado/noticias-2026-10-25.json'
const POR_CATEGORIA = 5
const MAPA = {
  'eleicoes-2026': '🗳️ Presidência',
  'flavio-lula': '🗳️ Presidência',
  pesquisas: '🗳️ Presidência',
  aprovacao: '🗳️ Presidência',
  estaduais: '🏛️ Governadores',
}

const cache = JSON.parse(readFileSync(ORIGEM, 'utf8'))
const fmt = (d) => d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const vistos = new Set()
const todos = []
for (const [q, cat] of Object.entries(MAPA)) {
  for (const it of cache.queries[q]?.items || []) {
    const d = new Date(it.pubDate)
    if (Number.isNaN(d.getTime())) continue
    const fonte = it.sourceName || ''
    const titulo = fonte && it.title.endsWith(' - ' + fonte) ? it.title.slice(0, -(fonte.length + 3)) : it.title
    const chave = titulo.toLowerCase().slice(0, 50)
    if (vistos.has(chave)) continue
    vistos.add(chave)
    todos.push({ title: titulo, source: fonte, url: it.link, time: fmt(d).slice(0, 5) + ' ' + fmt(d).slice(-5), timeIso: d.toISOString(), category: cat })
  }
}
todos.sort((a, b) => b.timeIso.localeCompare(a.timeIso))
const grouped = {}
for (const cat of [...new Set(Object.values(MAPA))]) grouped[cat] = todos.filter((n) => n.category === cat).slice(0, POR_CATEGORIA)

const saida = {
  updatedAt: fmt(new Date(cache.fetchedAt)),
  geradoEm: cache.fetchedAt,
  congelado: true,
  origem: ORIGEM,
  totalNews: todos.length,
  grouped,
  firecrawlActive: false,
  all: todos.slice(0, 35),
}
writeFileSync(DESTINO, JSON.stringify(saida, null, 2) + '\n')
console.log(`${DESTINO}: ${todos.length} notícias, coleta de ${saida.updatedAt} BRT`)
for (const [c, l] of Object.entries(grouped)) console.log(' ', c, l.length, '·', l[0]?.time, l[0]?.title.slice(0, 70))
