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

import { existsSync, readFileSync, readdirSync, appendFileSync, mkdirSync } from 'fs'
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
/**
 * A chave e LIVRO + PERGUNTA, e nao a pergunta sozinha.
 *
 * 🔴 DEFEITO REAL, achado em 04/Set/2026 usando o script pela primeira vez
 * contra duas leituras de verdade. O `pergunta` do book NAO e a pergunta
 * inteira, e o NOME do candidato, e o mesmo nome existe nos tres livros:
 * "Augusto Cury" vale 1,95% no de vencedor e 54,65% no de 3o lugar. Com a
 * chave so no nome, o comparador casou o 3o lugar de um lado com o vencedor do
 * outro e imprimiu -52,70pp.
 *
 * 🕳️ E o meu proprio teste passou por sorte: o caso 6 usava "Flavio vence?" e
 * "Flavio em 2o?", textos DIFERENTES por livro, que nao e o que o book manda.
 * Fixture irreal da confianca falsa.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */
const chaveDe = (l) => JSON.stringify([l.livro, l.pergunta])

export function comparar(antes, agora, piso = 0.5) {
  const mapaAntes = new Map(antes.map((l) => [chaveDe(l), l]))
  const mapaAgora = new Map(agora.map((l) => [chaveDe(l), l]))

  const movidos = []
  const parados = []
  const entrantes = []
  const sumidos = []

  for (const a of agora) {
    const b = mapaAntes.get(chaveDe(a))
    if (!b) {
      entrantes.push(a)
      continue
    }
    const delta = Number((a.preco - b.preco).toFixed(2))
    const linha = { ...a, antes: b.preco, delta, deltaVolume: Math.round(a.volume - b.volume) }
    if (delta === 0) parados.push(linha)
    else movidos.push(linha)
  }
  for (const b of antes) if (!mapaAgora.has(chaveDe(b))) sumidos.push(b)

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

export const DIR_CERTIFICADOS = '.cache/capture-guard'

/**
 * A BASE da variação, LIVRO A LIVRO: para cada livro, a certificada mais recente
 * ANTERIOR à atual em que AQUELE livro foi aprovado.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 16/Set/2026. A tabela dizia "contra a
 * leitura confirmada de 2026-09-04T22:53", ONZE dias antes, porque a base era a
 * última linha do `leituras-confirmadas.jsonl`, e as rodadas de 05 a 15/Set não
 * passaram o `--registrar`. O vão do contrato de vencedor sairia +13,60pp para
 * Flávio quando o movimento contra o publicado na véspera era de menos de 2pp.
 * Nenhum aviso: a linha de cabeçalho trazia a data, e a data era a única pista.
 *
 * 🔑 A trava já grava TODA certificada em `.cache/capture-guard/br-*.json`, com
 * `livrosOk`. É o registro que existe mesmo quando ninguém lembra de registrar.
 *
 * ⭐ E a escolha é por LIVRO porque a publicação é por livro. Em 15/Set o 3º
 * lugar bloqueou nas duas passadas, e o painel manteve os valores de 14/Set,
 * 19:44. A certificada mais recente inteira daria ao 3º lugar uma base que
 * nunca foi publicada; a regra por livro reproduz o que foi ao ar.
 *
 * `minMinutos` evita que a trava refeita minutos depois de um bloqueio vire base
 * de si mesma (mesma régua do `escolherCapturaAnterior` dos EUA).
 */
export function escolherBasePorLivro(certificados, carimboAtual, { minMinutos = 60 } = {}) {
  const t0 = Date.parse(carimboAtual ?? '')
  if (!Number.isFinite(t0)) throw new Error('escolherBasePorLivro exige o carimbo da leitura atual')
  const ordenados = (certificados ?? [])
    .filter((c) => {
      const t = Date.parse(c?.fetchedAt ?? '')
      return Number.isFinite(t) && t0 - t >= minMinutos * 60_000
    })
    .sort((a, b) => Date.parse(b.fetchedAt) - Date.parse(a.fetchedAt))
  const livros = new Set(ordenados.flatMap((c) => c.livrosOk ?? []))
  const linhas = []
  const origem = {}
  for (const livro of livros) {
    const c = ordenados.find((x) => (x.livrosOk ?? []).includes(livro))
    origem[livro] = c.fetchedAt
    linhas.push(...doCertificado(c).linhas.filter((l) => l.livro === livro))
  }
  return { linhas, origem }
}

/**
 * Os `n` contratos de maior volume acumulado de um livro, do maior para o menor.
 *
 * 🔴 POR QUE ISTO EXISTE. Em 15/Set/2026 o painel publicou, nos três idiomas,
 * que o contrato de Renan Santos era "o de maior volume acumulado do livro
 * presidencial", com USD 13,49M. O maior era o de Tarcísio de Freitas, USD
 * 14,07M, parado no piso de preço e por isso fora de vista, e já era o maior em
 * 04/Set. O guardrail de superlativo mede séries de PREÇO; ranking de volume
 * não tinha medidor, e a frase saiu de suposição.
 */
export function rankingDeVolume(linhas, livro, n = 3) {
  return linhas
    .filter((l) => l.livro === livro && Number.isFinite(l.volume))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, n)
}

/** Horas entre dois carimbos, com uma casa. */
export const horasEntre = (antes, depois) => Math.round((Date.parse(depois) - Date.parse(antes)) / 360_000) / 10

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

  let anterior = ultimaLeitura(lerLinhas(existsSync(CAMINHO_LEITURAS) ? readFileSync(CAMINHO_LEITURAS, 'utf8') : ''))

  // Com --certificado, a base sai das certificadas gravadas pela trava, livro a
  // livro. O jsonl só vale como último recurso, e com a idade impressa.
  if (CERTIFICADO && existsSync(DIR_CERTIFICADOS)) {
    const certificados = readdirSync(DIR_CERTIFICADOS)
      .filter((f) => /^br-.*\.json$/.test(f))
      .map((f) => JSON.parse(readFileSync(`${DIR_CERTIFICADOS}/${f}`, 'utf8')))
    const base = escolherBasePorLivro(certificados, carimbo)
    if (base.linhas.length) {
      anterior = { fetchedAt: 'por livro', linhas: base.linhas }
      console.log('\n🧭 BASE POR LIVRO, a certificada anterior em que cada livro foi aprovado:')
      for (const [livro, quando] of Object.entries(base.origem)) {
        const h = horasEntre(quando, carimbo)
        console.log(`   ${h > 36 ? '🔴' : '  '} ${livro.padEnd(13)} ${quando}  (${String(h).replace('.', ',')}h antes)`)
      }
      const semBase = [...new Set(agora.map((l) => l.livro))].filter((l) => !base.origem[l])
      if (semBase.length) console.log(`   ⚠️ sem certificada anterior, fora da comparação: ${semBase.join(', ')}`)
      console.log('   ⚠️ certificada não é publicada: conferir contra o painel da véspera se alguma rodada foi abortada.')
    }
  } else if (anterior && carimbo && horasEntre(anterior.fetchedAt, carimbo) > 36) {
    console.log(`\n🔴 A BASE TEM ${horasEntre(anterior.fetchedAt, carimbo)}h: a variação abaixo NÃO é a do dia.`)
  }

  if (!anterior) {
    console.log(`\n📓 Sem leitura anterior em ${CAMINHO_LEITURAS}.`)
    console.log('   Esta rodada só REGISTRA. A tabela de variação sai a partir da próxima.')
  } else {
    const r = comparar(anterior.linhas, agora, PISO)
    console.log(
      `\n📊 VARIAÇÃO contra ${anterior.fetchedAt === 'por livro' ? 'a base por livro acima' : `a leitura confirmada de ${anterior.fetchedAt}`}`,
    )
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

  // 🏆 Quem lidera em VOLUME, por livro. Superlativo de volume também é superlativo.
  const livrosComVolume = [...new Set(agora.map((l) => l.livro))]
  console.log('\n🏆 MAIOR VOLUME ACUMULADO, por livro (para qualquer frase de "o maior volume"):')
  for (const livro of livrosComVolume) {
    const top = rankingDeVolume(agora, livro, 3)
    if (!top.length) continue
    console.log(`   ${livro.padEnd(13)} ${top.map((l) => `${l.pergunta.slice(0, 26)} USD ${(l.volume / 1e6).toFixed(2).replace('.', ',')}M`).join(' · ')}`)
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
