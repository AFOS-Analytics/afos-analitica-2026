#!/usr/bin/env node
/**
 * LER MATÉRIA — do link à FICHA TÉCNICA, e da ficha ao que a NOSSA base diz.
 *
 * 🔑 POR QUE ISTO EXISTE, medido em 18/Set/2026: o `resolver-noticia.mjs` entrega
 *    a URL do veículo e para ali. Ler o CORPO era feito pelo WebFetch, e naquele
 *    dia ele recusou `g1.globo.com`, `oglobo.globo.com` e `veja.abril.com.br` de
 *    uma vez, que são justamente os veículos que publicam ficha técnica de
 *    pesquisa nacional. Os três abrem com `curl` normalmente, então o que faltava
 *    não era acesso, era caminho.
 *
 * ⛔ A régua que este script serve é "a confirmação é pelo CORPO com o protocolo
 *    ou o período de campo da onda, nunca pela manchete". Ele existe para ser
 *    chamado ANTES de afirmar que uma pesquisa saiu, qual é o escopo dela e de
 *    que onda ela é.
 *
 * ⚠️ Ele NÃO decide. Cada achado sai com a FRASE inteira em volta, porque quem
 *    lê o cargo e o escopo é você: regex que responde "nacional" sozinha é a
 *    mesma falha do `scope` derivado do plano amostral.
 *
 * Uso:
 *   npx tsx scripts/ler-materia.mjs --link=https://g1.globo.com/...
 *   npx tsx scripts/ler-materia.mjs "Real Time Big Data volta a testar"
 *   npx tsx scripts/ler-materia.mjs "Datafolha, 1º turno" --data=2026-09-17
 *   npx tsx scripts/ler-materia.mjs --link=... --texto        # corpo inteiro
 *   npx tsx scripts/ler-materia.mjs --link=... --sem-base     # não consulta a API
 *
 * ⚠️ Com `tsx`, não com `node`: importa de `wayback-archive.ts`, pelo mesmo
 * motivo do `resolver-noticia.mjs`.
 */

import { readFileSync } from 'node:fs'
import { UA_NAVEGADOR, resolverGoogleNews } from './lib/resolver-gnews.mjs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { dataCivilBrasil } from './lib/data-civil-brz.mjs'

const argv = process.argv.slice(2)
const valor = (n) => argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null
const tem = (n) => argv.includes(`--${n}`)

const data = valor('data') ?? dataCivilBrasil()
const padrao = argv.find((a) => !a.startsWith('--')) ?? null
const linkDireto = valor('link')
const maxMaterias = Number(valor('max') ?? 3)

if (!padrao && !linkDireto) {
  console.error('Uso: npx tsx scripts/ler-materia.mjs "padrão no título" | --link=URL')
  process.exit(2)
}

/** Links a ler: do argumento, ou casando o título no news-cache do dia. */
function alvos() {
  if (linkDireto) return [{ titulo: '(link direto)', fonte: '', link: linkDireto }]
  const caminho = `public/news-cache/${data}.json`
  let cache
  try {
    cache = JSON.parse(readFileSync(caminho, 'utf8'))
  } catch {
    console.error(`❌ sem cache em ${caminho}. Rodar: node scripts/fetch-google-news.mjs`)
    process.exit(2)
  }
  const itens = [].concat(...Object.values(cache.queries).map((q) => q.items ?? []))
  const unicos = [...new Map(itens.map((x) => [x.title, x])).values()]
  const re = new RegExp(padrao, 'i')
  const achados = unicos.filter((x) => re.test(x.title))
  if (achados.length === 0) {
    console.error(`❌ nenhum título casa /${padrao}/i no cache de ${data} (${unicos.length} itens).`)
    process.exit(2)
  }
  // Link do veículo vence o invólucro do Google, quando os dois existem.
  return achados
    .sort((a, b) => Number(b.link.includes('news.google.com')) - Number(a.link.includes('news.google.com')))
    .slice(0, maxMaterias)
    .map((x) => ({ titulo: x.title, fonte: `${x.sourceName} · ${x.pubDate}`, link: x.link }))
}

async function baixar(url) {
  const alvo = await resolverGoogleNews(url)
  if (!alvo) throw new Error('invólucro do Google News não resolveu para URL de veículo')
  const r = await fetch(alvo, {
    headers: { 'User-Agent': UA_NAVEGADOR },
    signal: AbortSignal.timeout(30000),
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return { url: alvo, html: await r.text() }
}

/** HTML para texto corrido, sem script, style, nav nem comentário. */
function aTexto(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr|br)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    // 🔴 As entidades NOMEADAS com acento vêm primeiro, e não são enfeite:
    // a matéria da VEJA de 18/Set saiu com "pesquisa nacional" escrito
    // "n&aacute;cional", e sonda de escopo que procura "nacional" numa frase
    // ainda entitizada não acha nada e devolve "⛔ nada", que se lê como
    // "a matéria não diz o escopo". Silêncio por codificação é o pior tipo.
    .replace(/&([aeiouAEIOU])(acute|grave|circ|uml|tilde);/g, (_, l, t) => {
      const m = { acute: '́', grave: '̀', circ: '̂', uml: '̈', tilde: '̃' }
      return (l + m[t]).normalize('NFC')
    })
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&(m|n)dash;/g, '-')
    .replace(/&[lr]squo;/g, "'")
    .replace(/&[lr]dquo;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    // 🔑 `&amp;` por ÚLTIMO: antes das outras, ele transforma "&amp;aacute;" em
    // "&aacute;" e a entidade dupla passa a ser decodificada, que é o oposto do
    // que o texto original dizia.
    .replace(/&amp;/g, '&')
    .replace(/[ \t ]+/g, ' ')
    // 🔴 `\n{2,}` NÃO basta, medido em 18/Set/2026 no `amazonasatual.com.br`: o
    // corpo saiu com 50 linhas seguidas contendo UM espaço, e linha com espaço
    // não casa `\n\n`. O `--texto` devolvia a manchete e um poço em branco, que
    // se lê como matéria vazia quando ela estava inteira logo abaixo.
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '')
    .join('\n')
    .trim()
}

/** Frases inteiras, para o achado sair com o contexto em volta. */
function frases(texto) {
  return texto
    .split(/(?<=[.!?])\s+|\n+/)
    .map((f) => f.trim())
    .filter((f) => f.length > 15)
}

const SONDAS = [
  ['protocolo', /\bBR[\s-]?\d{5}\s?[/-]\s?20\d{2}\b|registrad[ao].{0,40}\bTSE\b|protocolo.{0,30}\bBR\b|n[úu]mero\s+BR[\s-]?\d/i],
  ['campo', /\b(realizad[ao]|feit[ao]|ouvi[ud]|entrevist\w+|foi a campo|coleta)\b.{0,80}\b(entre|de)\s+\d{1,2}\b.{0,40}\b(a|e|至)\s*\d{1,2}\b/i],
  ['amostra', /\b\d{1,3}(\.\d{3})+\s+(entrevistas?|eleitores?|pessoas?)|\bamostra\b.{0,40}\d/i],
  ['margem', /margem\s+de\s+erro/i],
  ['metodologia', /\b(presencial|telefone|telef[ôo]nico|URA|question[áa]rio|pontos de fluxo|domiciliar|recrutamento digital|painel online)\b/i],
  ['escopo', /\b(em todo o pa[íi]s|nacional|todo o territ[óo]rio|munic[íi]pios|no estado d\w+|eleitores d[oe] [A-ZÁÉÍÓÚÂÊÔÃÕÇ])/],
  ['cargo', /\b(presid\w+|governad\w+|senad\w+|deputad\w+)\b/i],
]

function normalizarProtocolo(s) {
  const m = s.match(/\bBR[\s-]?(\d{5})\s?[/-]\s?(20\d{2})\b/i)
  return m ? `BR${m[1]}${m[2]}` : null
}

async function consultarBase(protocolos) {
  if (protocolos.length === 0 || tem('sem-base')) return null
  try {
    const r = await fetch(`${baseDeLeitura()}/api/polls/tse?days=30`, { signal: AbortSignal.timeout(20000) })
    if (!r.ok) return { erro: `HTTP ${r.status}` }
    const j = await r.json()
    const linhas = j.polls ?? []
    const menorDiv = linhas
      .map((p) => (p.publicationDate ?? '').slice(0, 10))
      .filter(Boolean)
      .sort()[0]
    return {
      cortada: linhas.length >= 200,
      borda: menorDiv,
      achados: protocolos.map((p) => ({
        protocolo: p,
        linha: linhas.find((l) => (l.protocolo ?? l.protocol) === p) ?? null,
      })),
    }
  } catch (e) {
    return { erro: String(e.message ?? e) }
  }
}

const lista = alvos()
let algumOk = false

for (const alvo of lista) {
  console.log('\n' + '─'.repeat(72))
  console.log(`📰 ${alvo.titulo}`)
  if (alvo.fonte) console.log(`   ${alvo.fonte}`)

  let baixado
  try {
    baixado = await baixar(alvo.link)
  } catch (e) {
    console.log(`   ❌ não leu: ${e.message ?? e}`)
    console.log(`   ${alvo.link}`)
    continue
  }
  algumOk = true
  const texto = aTexto(baixado.html)
  const fs_ = frases(texto)
  console.log(`   ${baixado.url}`)
  console.log(`   ${texto.length} caracteres de texto, ${fs_.length} frases`)

  if (tem('texto')) {
    console.log('\n──── CORPO ────')
    console.log(texto.slice(0, Number(valor('chars') ?? 12000)))
    continue
  }

  console.log('\n🔍 FICHA, cada achado com a FRASE inteira em volta:')
  const protocolos = new Set()
  for (const [nome, re] of SONDAS) {
    const hits = fs_.filter((f) => re.test(f)).slice(0, 3)
    if (hits.length === 0) {
      console.log(`   ${nome.padEnd(12)} ⛔ nada`)
      continue
    }
    console.log(`   ${nome.padEnd(12)} ${hits.length} frase(s)`)
    for (const h of hits) {
      console.log(`      · ${h.slice(0, 300)}`)
      const p = normalizarProtocolo(h)
      if (p) protocolos.add(p)
    }
  }

  const base = await consultarBase([...protocolos])
  console.log('\n🗂️  O que a NOSSA base diz sobre o protocolo da matéria:')
  if (!base) console.log('   (pulado)')
  else if (base.erro) console.log(`   ⚠️ não consultou: ${base.erro}`)
  else if (base.achados.length === 0) console.log('   ⛔ a matéria não traz protocolo do TSE: confirmar a onda pelo PERÍODO DE CAMPO.')
  else {
    for (const a of base.achados) {
      if (!a.linha) {
        console.log(`   🔴 ${a.protocolo}  NÃO está entre as linhas servidas.`)
        if (base.cortada) console.log(`      ⚠️ a rota parou em 200 linhas (borda ${base.borda}): ausência aqui NÃO prova ausência no banco.`)
      } else {
        const l = a.linha
        console.log(`   ✅ ${a.protocolo}  ${l.institute}`)
        console.log(`      escopo ${l.scope} [${l.scopeSource}] · uf ${l.uf} · n=${l.sampleSize}`)
        console.log(`      campo ${(l.fieldStart ?? '').slice(0, 10)} a ${(l.fieldEnd ?? '').slice(0, 10)} · div ${(l.publicationDate ?? '').slice(0, 10)}`)
        console.log(`      ⚖️ conferir se o ESCOPO acima bate com a frase de escopo da matéria.`)
      }
    }
  }
}

process.exit(algumOk ? 0 : 1)
