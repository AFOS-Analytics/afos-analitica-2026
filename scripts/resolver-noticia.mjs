#!/usr/bin/env node
/**
 * RESOLVER NOTÍCIA — do invólucro do Google News para a URL do VEÍCULO.
 *
 * ⛔ Sem regra própria: importa `extrairAtributos`, `montarPayload`,
 *    `extrairUrlDoVeiculo` e o user-agent de `wayback-archive.ts`, que é onde a
 *    resolução mora e onde ela tem casos plantados
 *    (`scripts/testar-resolver-google-news.mjs`). Recopiar qualquer um deles
 *    criaria a segunda cópia da mesma regra.
 *
 * 🔑 POR QUE ISTO EXISTE, medido em 09/Set/2026: o `news-cache` guarda só o link
 *    do Google, e abrir esse link devolve a palavra "Google News" e mais nada.
 *    A resolução já existia no repositório, mas trancada dentro do arquivador do
 *    Wayback, então na prática toda rodada que precisava LER uma matéria ficava
 *    sem caminho. Ferramenta que só um comando alcança é ferramenta que os
 *    outros não têm.
 *
 * Uso:
 *   npx tsx scripts/resolver-noticia.mjs "Meio/Ideia|Gerp"        # casa no título do cache de hoje
 *   npx tsx scripts/resolver-noticia.mjs "Palver" --data=2026-09-09 --max=3
 *   npx tsx scripts/resolver-noticia.mjs --link=https://news.google.com/rss/articles/...
 *
 * ⚠️ Com `tsx`, não com `node`: ele importa de `wayback-archive.ts`, que importa
 * `./lib/daily-files` sem extensão, e o `node` puro morre com ERR_MODULE_NOT_FOUND.
 * Medido em 14/Set/2026, na primeira chamada do gate de fact-check do dia.
 */

import { readFileSync } from 'node:fs'
import { resolverGoogleNews } from './lib/resolver-gnews.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const hoje = new Date().toISOString().slice(0, 10)
const data = valor('data') ?? hoje
const max = Number(valor('max') ?? 6)
const linkDireto = valor('link')
const padrao = argv.find((a) => !a.startsWith('--'))

// 🔑 A resolução mora em `lib/resolver-gnews.mjs` desde 18/Set/2026, para o
// `ler-materia.mjs` usar o MESMO caminho em vez de uma segunda cópia dele.
const resolver = resolverGoogleNews

const alvos = []
if (linkDireto) {
  alvos.push({ title: '(link direto)', sourceName: '', link: linkDireto })
} else {
  if (!padrao) {
    console.error('faltou o padrão de título, ou --link=')
    process.exit(2)
  }
  const cache = JSON.parse(readFileSync(`public/news-cache/${data}.json`, 'utf8'))
  const re = new RegExp(padrao, 'i')
  const vistos = new Set()
  for (const q of Object.values(cache.queries))
    for (const it of q.items ?? [])
      if (re.test(it.title) && !vistos.has(it.title)) {
        vistos.add(it.title)
        alvos.push(it)
      }
}

console.log(`\n🔗 RESOLVER NOTÍCIA · ${alvos.length} candidato(s), resolvendo até ${max}\n`)

let resolvidos = 0
let falhas = 0
for (const t of alvos.slice(0, max)) {
  const url = await resolver(t.link).catch(() => null)
  if (url) resolvidos++
  else falhas++
  console.log(`[${(t.sourceName || '?').slice(0, 20)}] ${t.title.slice(0, 78)}`)
  console.log(`   ${url ?? '❌ não resolveu'}\n`)
}

console.log(`resolvidos ${resolvidos} · falharam ${falhas}`)
// ⚠️ Falha aqui é do Google, não do chamador: não sai != 0 por isso, para não
// derrubar um encadeamento por causa de uma matéria que não abriu.
