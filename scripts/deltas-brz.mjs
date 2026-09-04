/**
 * deltas-brz.mjs — a tabela de VARIAÇÃO entre a leitura confirmada de hoje e a
 * da rodada anterior, calculada em vez de somada de cabeça.
 *
 * 🔴 POR QUE ISTO EXISTE, e o incidente é o mesmo que criou a trava de captura.
 * Em 24/Jul/2026 o `/atualizar-brz` publicou um snapshot em que metade dos
 * deltas estava errada e DOIS TINHAM O SINAL INVERTIDO: Michelle e Caiado foram
 * ao ar em alta e fecharam o dia em queda. A trava de captura conserta a
 * ENTRADA, garantindo que o preço de hoje é um preço e não um book em trânsito.
 * Ela não conserta a SUBTRAÇÃO, que continuou sendo feita à mão, em prosa, uma
 * vez por candidato e por livro, a cada rodada.
 *
 * 🔑 A subtração é a última aritmética da rotina que ainda mora na cabeça. Este
 * script tira ela de lá. A prosa passa a ser escrita a partir de uma tabela
 * calculada, e o sinal vem impresso.
 *
 * ⚠️ A COMPARAÇÃO É POR PERGUNTA, não por nome. O `question` do Polymarket é a
 * chave estável entre rodadas; extrair nome de dentro dele é uma suposição a
 * mais, e é assim que sobrenome solto colide.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * 📌 NÃO substitui a trava de captura, que continua obrigatória e roda antes.
 * Este script LÊ o mercado uma vez só, para montar a tabela. O preço que vai
 * ao ar é o da SEGUNDA leitura da trava.
 *
 * Uso:
 *   node scripts/deltas-brz.mjs --certificado --registrar   # o caminho da rodada
 *   node scripts/deltas-brz.mjs               # tabela contra a rodada anterior, ao vivo
 *   node scripts/deltas-brz.mjs --registrar   # e grava a leitura de hoje
 *   node scripts/deltas-brz.mjs --piso=0.5    # piso de ruído (padrão 0,5%)
 */

import { existsSync, readFileSync, appendFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { pathToFileURL } from 'url'
import { lerResposta } from './ler-mercado.mjs'

export const CAMINHO_LEITURAS = 'data/brz/leituras-confirmadas.jsonl'

const REGISTRAR = process.argv.includes('--registrar')
const CERTIFICADO = process.argv.includes('--certificado')
const PISO = Number(process.argv.find((a) => a.startsWith('--piso='))?.slice(6) ?? 0.5)

/** Achata os grupos numa lista de linhas com chave estável. */
export function achatar(leitura) {
  const linhas = []
  for (const [livro, g] of Object.entries(leitura.grupos)) {
    for (const l of g.linhas) {
      linhas.push({ livro, pergunta: l.pergunta, preco: l.preco, volume: l.volume })
    }
  }
  return linhas
}

/**
 * Compara duas leituras achatadas. Devolve movidos, parados, entrantes e
 * sumidos, todos explícitos: contrato que SAIU do book é informação, e some da
 * tabela se a comparação for só um `for` sobre o lado de hoje.
 */
export function comparar(antes, agora, piso = 0.5) {
  const mapaAntes = new Map(antes.map((l) => [l.pergunta, l]))
  const mapaAgora = new Map(agora.map((l) => [l.pergunta, l]))

  const movidos = []
  const parados = []
  const entrantes = []
  const sumidos = []

  for (const a of agora) {
    const b = mapaAntes.get(a.pergunta)
    if (!b) {
      entrantes.push(a)
      continue
    }
    const delta = Number((a.preco - b.preco).toFixed(2))
    const linha = { ...a, antes: b.preco, delta, deltaVolume: Math.round(a.volume - b.volume) }
    if (delta === 0) parados.push(linha)
    else movidos.push(linha)
  }
  for (const b of antes) if (!mapaAgora.has(b.pergunta)) sumidos.push(b)

  movidos.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))

  // 🔴 Volume acumulado SÓ CRESCE. Encolher é sinal de que o valor de uma das
  // duas pontas é de outro contrato ou de outra rodada, e isso é defeito, não
  // notícia. → memory/feedback_defeito_de_etiqueta_passa_por_todo_portao_de_valor.md
  const volumeEncolheu = [...movidos, ...parados].filter((l) => l.deltaVolume < 0)

  const relevantes = movidos.filter((l) => l.preco >= piso || l.antes >= piso)
  return { movidos, parados, entrantes, sumidos, relevantes, volumeEncolheu }
}

export function lerLinhas(texto) {
  if (!texto) return []
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l, i) => {
      try {
        return JSON.parse(l)
      } catch {
        throw new Error(`${CAMINHO_LEITURAS}: linha ${i + 1} não é JSON. Conferir à mão.`)
      }
    })
}

export function ultimaLeitura(registros) {
  if (!registros.length) return null
  return [...registros].sort((a, b) => String(a.fetchedAt).localeCompare(String(b.fetchedAt))).pop()
}

const br = (n) => (n > 0 ? '+' : n < 0 ? '' : ' ') + n.toFixed(2).replace('.', ',')

export const CAMINHO_CERTIFICADO = '.cache/capture-guard/ultima-br.json'

/**
 * Lê o instantâneo que a TRAVA DE CAPTURA certificou, e não o mercado ao vivo.
 *
 * 🔑 É esta a leitura que vai ao ar, então é ela que tem de virar a base da
 * próxima rodada. Registrar uma leitura ao vivo NÃO CERTIFICADA como baseline
 * faria o delta de amanhã ser medido contra um preço que nunca foi publicado.
 *
 * ⚠️ Só entram os livros APROVADOS. Livro bloqueado não tem preço publicável, e
 * deixá-lo entrar aqui o transformaria em baseline sem nunca ter sido confirmado.
 */
export function doCertificado(snap) {
  const ok = new Set(snap.livrosOk ?? [])
  const linhas = []
  for (const [chave, preco] of Object.entries(snap.precos ?? {})) {
    const i = chave.indexOf(':')
    if (i < 0) continue
    const livro = chave.slice(0, i)
    if (!ok.has(livro)) continue
    linhas.push({ livro, pergunta: chave.slice(i + 1), preco, volume: snap.volumes?.[chave] ?? 0 })
  }
  return { fetchedAt: snap.fetchedAt, linhas, livrosOk: [...ok], livrosBloqueados: Object.keys(snap.livros ?? {}).filter((l) => !ok.has(l)) }
}

async function principal() {
  let leitura
  let agora
  let carimbo
  let bloqueados = []

  if (CERTIFICADO) {
    if (!existsSync(CAMINHO_CERTIFICADO)) {
      console.error(`❌ ${CAMINHO_CERTIFICADO} não existe. Rodar a trava de captura antes: npx tsx scripts/capture-guard.ts`)
      process.exit(1)
    }
    const c = doCertificado(JSON.parse(readFileSync(CAMINHO_CERTIFICADO, 'utf8')))
    agora = c.linhas
    carimbo = c.fetchedAt
    bloqueados = c.livrosBloqueados
    console.log(`\n🔒 CERTIFICADO pela trava · ${carimbo}`)
    console.log(`   livros aprovados: ${c.livrosOk.join(', ') || 'nenhum'}`)
    if (bloqueados.length) console.log(`   livros BLOQUEADOS, fora desta tabela e sem preço novo: ${bloqueados.join(', ')}`)
  } else {
    const url = 'https://www.afos-analytics.com/api/polymarket?country=br&fresh=1'
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
    if (!res.ok) {
      console.error(`proxy devolveu HTTP ${res.status}`)
      process.exit(1)
    }
    leitura = lerResposta(await res.json(), 'br')
    if (leitura.leituraVazia) {
      console.error('❌ LEITURA VAZIA em TODOS os grupos: isso acusa o leitor, não o mercado.')
      process.exit(1)
    }
    agora = achatar(leitura)
    carimbo = leitura.fetchedAt
    console.log('\n⚠️  LEITURA AO VIVO, NÃO certificada. Para a tabela que vai ao ar, usar --certificado.')
  }
  if (leitura) console.log(`   degraded ${leitura.degraded} · falhas ${leitura.failedCount}`)
  console.log(`   ${agora.length} contratos com preço em ${new Set(agora.map((l) => l.livro)).size} livro(s)`)

  const anterior = ultimaLeitura(lerLinhas(existsSync(CAMINHO_LEITURAS) ? readFileSync(CAMINHO_LEITURAS, 'utf8') : ''))

  if (!anterior) {
    console.log(`\n📓 Sem leitura anterior em ${CAMINHO_LEITURAS}.`)
    console.log('   Esta rodada só REGISTRA. A tabela de variação sai a partir da próxima.')
  } else {
    const r = comparar(anterior.linhas, agora, PISO)
    console.log(`\n📊 VARIAÇÃO contra a leitura confirmada de ${anterior.fetchedAt}`)
    console.log(`   ${r.movidos.length} se moveram, ${r.parados.length} pararam, piso de ruído ${PISO}%\n`)
    console.log('   livro         antes    agora    Δpp     contrato')
    for (const l of r.relevantes) {
      console.log(
        `   ${l.livro.padEnd(13)} ${l.antes.toFixed(2).padStart(6)}  ${l.preco.toFixed(2).padStart(6)}  ${br(l.delta).padStart(6)}   ${l.pergunta.slice(0, 62)}`
      )
    }
    const abaixoDoPiso = r.movidos.length - r.relevantes.length
    if (abaixoDoPiso > 0) console.log(`\n   (${abaixoDoPiso} movimento(s) abaixo do piso de ${PISO}%, ruído de book fino, fora da tabela)`)

    if (r.entrantes.length) {
      console.log(`\n   ➕ ${r.entrantes.length} contrato(s) NOVO(S) no book:`)
      for (const l of r.entrantes.slice(0, 10)) console.log(`      ${l.preco.toFixed(2).padStart(6)}%  [${l.livro}] ${l.pergunta.slice(0, 62)}`)
    }
    if (r.sumidos.length) {
      console.log(`\n   ➖ ${r.sumidos.length} contrato(s) SUMIU do book desde a leitura anterior:`)
      for (const l of r.sumidos.slice(0, 10)) console.log(`      ${l.preco.toFixed(2).padStart(6)}%  [${l.livro}] ${l.pergunta.slice(0, 62)}`)
    }
    if (r.volumeEncolheu.length) {
      console.log(`\n   🔴 ${r.volumeEncolheu.length} contrato(s) com VOLUME MENOR que na leitura anterior.`)
      console.log('      Volume acumulado só cresce. Isso é defeito de pareamento, não movimento de mercado.')
      for (const l of r.volumeEncolheu.slice(0, 6)) console.log(`      ${l.deltaVolume.toLocaleString('pt-BR').padStart(12)}  [${l.livro}] ${l.pergunta.slice(0, 58)}`)
    }
  }

  if (REGISTRAR) {
    mkdirSync(dirname(CAMINHO_LEITURAS), { recursive: true })
    appendFileSync(
      CAMINHO_LEITURAS,
      JSON.stringify({ fetchedAt: carimbo, certificado: CERTIFICADO, livrosBloqueados: bloqueados, linhas: agora }) + '\n'
    )
    console.log(`\n   📓 leitura de ${carimbo} registrada em ${CAMINHO_LEITURAS}`)
  } else {
    console.log(`\n   (nada gravado; use --registrar para esta leitura virar a base da próxima rodada)`)
  }
  console.log()
}

// ⚠️ Comparar `import.meta.url` com caminho montado à mão NÃO casa no Windows:
// o `import.meta.url` traz `file:///C:/...`, com três barras, e o script sai com
// 0 sem imprimir nada. Mesmo defeito já documentado em `ler-mercado.mjs`.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  principal().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
