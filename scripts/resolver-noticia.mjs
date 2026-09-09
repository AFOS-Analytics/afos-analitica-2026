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
 *   node scripts/resolver-noticia.mjs "Meio/Ideia|Gerp"        # casa no título do cache de hoje
 *   node scripts/resolver-noticia.mjs "Palver" --data=2026-09-09 --max=3
 *   node scripts/resolver-noticia.mjs --link=https://news.google.com/rss/articles/...
 */

import { readFileSync } from 'node:fs'
import {
  UA_NAVEGADOR,
  extrairAtributos,
  extrairUrlDoVeiculo,
  montarPayload,
} from './wayback-archive.ts'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const hoje = new Date().toISOString().slice(0, 10)
const data = valor('data') ?? hoje
const max = Number(valor('max') ?? 6)
const linkDireto = valor('link')
const padrao = argv.find((a) => !a.startsWith('--'))

async function resolver(url) {
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
}

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
