/**
 * PACOTE DE DADOS DA SEMANA (EUA), para o `/weekly-usa` da quinta.
 *
 * 🔴 POR QUE ISTO EXISTE (17/Set/2026): a edição semanal descreve o que se
 * moveu ENTRE quintas, e essa conta vinha sendo refeita à mão toda semana, a
 * partir de leituras avulsas da série. As frases que ela alimenta são as mais
 * caras do produto: "caiu 3,00pp na semana", "mudou em cinco dias", "só um lado
 * andou", "o mais alto que esta série guarda". Errar ali não dá erro nenhum.
 *
 * O que ele responde, tudo medido e nada estimado:
 *   1. o preço CERTIFICADO de agora, por livro, com o volume da leitura ao vivo;
 *   2. o valor na quinta anterior e a variação da semana;
 *   3. cada MUDANÇA de preço dentro da semana, com data e com o efeito no PAR:
 *      ponto transferido (soma do par igual) ou ponto criado (soma mudou);
 *   4. topo e piso da série INTEIRA, com data, lidos no backup e nunca na API,
 *      que trava a janela em 90 dias e esconderia o começo do Senado;
 *   5. a dispersão das pesquisas da janela, com a rodada mais alta e a mais
 *      baixa, que é o achado antes da média;
 *   6. a imprensa arquivada da janela, por veículo e por dia, separando quem
 *      tem link canônico de quem só tem o invólucro do agregador.
 *
 * ⛔ Ele não escreve prosa, não publica e não vai à rede além da leitura ao
 * vivo do mercado (para volume). Série, pesquisas e imprensa saem do disco.
 *
 * Uso:
 *   node scripts/semana-us.mjs                       # semana até hoje
 *   node scripts/semana-us.mjs --desde=2026-09-10    # quinta anterior explícita
 *   node scripts/semana-us.mjs --json                # para encadear
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { baseDeLeitura } from './lib/base-afos.mjs'

const arg = (nome, padrao) => {
  const a = process.argv.find((x) => x.startsWith(`--${nome}=`))
  return a ? a.split('=')[1] : padrao
}
const JSONOUT = process.argv.includes('--json')

/** Os cinco preços que o painel publica, na ordem em que a edição os apresenta. */
const LIVROS = [
  { chave: 'house:D', slug: 'which-party-will-win-the-house-in-2026', lado: 'democratas', rotulo: 'House · Democrats', par: 'house' },
  { chave: 'house:R', slug: 'which-party-will-win-the-house-in-2026', lado: 'republicanos', rotulo: 'House · Republicans', par: 'house' },
  { chave: 'senate:D', slug: 'which-party-will-win-the-senate-in-2026', lado: 'democratas', rotulo: 'Senate · Democrats', par: 'senate' },
  { chave: 'senate:R', slug: 'which-party-will-win-the-senate-in-2026', lado: 'republicanos', rotulo: 'Senate · Republicans', par: 'senate' },
  { chave: 'asScheduled', slug: 'will-the-2026-midterm-elections-happen-as-scheduled', lado: null, rotulo: 'Election on schedule', par: null },
]

const linhas = (caminho) => gunzipSync(readFileSync(caminho)).toString().trimEnd().split('\n')
const campos = (linha) => linha.split(',')

function lerBackup() {
  const mercados = []
  for (const f of readdirSync('backup/neon/market')) mercados.push(...linhas(`backup/neon/market/${f}`).slice(1))
  const outcomes = []
  for (const f of readdirSync('backup/neon/marketOutcome')) outcomes.push(...linhas(`backup/neon/marketOutcome/${f}`).slice(1))

  // id do mercado por slug, e id do desfecho por (mercado, chave do desfecho).
  const porSlug = new Map()
  for (const l of mercados) {
    const c = campos(l)
    porSlug.set(c[3], c[0])
  }
  const desfecho = new Map()
  for (const l of outcomes) {
    const c = campos(l)
    desfecho.set(`${c[1]}|${c[2]}`, c[0])
  }

  const pontos = new Map() // outcomeId -> [{ ts, preco }]
  for (const f of readdirSync('backup/neon/marketPrice')) {
    for (const l of linhas(`backup/neon/marketPrice/${f}`).slice(1)) {
      const c = campos(l)
      if (!pontos.has(c[2])) pontos.set(c[2], [])
      pontos.get(c[2]).push({ ts: c[6], preco: Number(c[3]) })
    }
  }
  for (const v of pontos.values()) v.sort((a, b) => (a.ts < b.ts ? -1 : 1))
  return { porSlug, desfecho, pontos }
}

/** A quinta anterior, se ninguém disser qual. */
function quintaAnterior(hoje) {
  const d = new Date(`${hoje}T00:00:00Z`)
  do {
    d.setUTCDate(d.getUTCDate() - 1)
  } while (d.getUTCDay() !== 4)
  return d.toISOString().slice(0, 10)
}

function serieDoLivro(bk, livro) {
  const mid = bk.porSlug.get(livro.slug)
  if (!mid) return null
  const chave = livro.lado ?? 'yes'
  let oid = bk.desfecho.get(`${mid}|${chave}`)
  if (!oid && livro.lado === null) {
    // O contrato de calendário guarda o desfecho com outra chave conforme a coleta.
    for (const [k, v] of bk.desfecho) if (k.startsWith(`${mid}|`)) { oid = v; break }
  }
  return oid ? bk.pontos.get(oid) ?? null : null
}

function main() {
  const hoje = new Date().toISOString().slice(0, 10)
  const desde = arg('desde', quintaAnterior(hoje))
  const bk = lerBackup()

  const cert = existsSync('.cache/capture-guard/ultima-us.json')
    ? JSON.parse(readFileSync('.cache/capture-guard/ultima-us.json', 'utf8'))
    : null
  if (!cert?.ok) console.error('⚠️ sem captura certificada aprovada em .cache/capture-guard/ultima-us.json')

  const precoCert = (livro) => {
    if (!cert?.precos) return null
    const alvo = livro.chave === 'asScheduled' ? 'asScheduled:' : `${livro.par}:the ${livro.lado === 'democratas' ? 'Democratic' : 'Republican'} Party`
    const k = Object.keys(cert.precos).find((x) => x.startsWith(alvo))
    return k ? cert.precos[k] : null
  }

  const saida = { desde, ate: hoje, certificadaEm: cert?.fetchedAt ?? null, livros: [], pesquisas: null, imprensa: [] }

  for (const livro of LIVROS) {
    const serie = serieDoLivro(bk, livro)
    if (!serie) {
      saida.livros.push({ rotulo: livro.rotulo, erro: 'série não encontrada no backup' })
      continue
    }
    const anteriores = serie.filter((p) => p.ts.slice(0, 10) <= desde)
    const naSemana = serie.filter((p) => p.ts.slice(0, 10) > desde)
    const base = anteriores.at(-1) ?? null
    const agora = precoCert(livro)

    // As MUDANÇAS, não os pontos: a grade grava a cada 30 min e repetir valor não é notícia.
    const mudancas = []
    let anterior = base?.preco ?? null
    for (const p of naSemana) {
      if (anterior !== null && p.preco !== anterior) mudancas.push({ ts: p.ts, de: anterior, para: p.preco })
      anterior = p.preco
    }
    if (agora !== null && anterior !== null && agora !== anterior) mudancas.push({ ts: cert.fetchedAt, de: anterior, para: agora, certificada: true })

    const precos = serie.map((p) => p.preco)
    const topo = Math.max(...precos)
    const piso = Math.min(...precos)
    saida.livros.push({
      rotulo: livro.rotulo,
      chave: livro.chave,
      par: livro.par,
      agora,
      naQuintaAnterior: base?.preco ?? null,
      baseEm: base?.ts ?? null,
      deltaSemana: agora !== null && base ? Number((agora - base.preco).toFixed(2)) : null,
      diasComMudanca: [...new Set(mudancas.map((m) => m.ts.slice(0, 10)))],
      mudancas,
      pontosNaSemana: naSemana.length,
      serie: {
        de: serie[0].ts.slice(0, 10),
        ate: serie.at(-1).ts.slice(0, 10),
        topo,
        topoEm: serie.find((p) => p.preco === topo).ts.slice(0, 10),
        piso,
        pisoEm: serie.find((p) => p.preco === piso).ts.slice(0, 10),
      },
    })
  }

  // O PAR: ponto transferido (soma igual) ou criado (soma muda). É a distinção
  // que separa disputa de sobrepreço, e ela não se vê olhando um lado só.
  for (const par of ['house', 'senate']) {
    const d = saida.livros.find((l) => l.chave === `${par}:D`)
    const r = saida.livros.find((l) => l.chave === `${par}:R`)
    if (!d?.agora || !r?.agora) continue
    const somaAntes = d.naQuintaAnterior + r.naQuintaAnterior
    const somaAgora = d.agora + r.agora
    saida[`par_${par}`] = {
      somaNaQuintaAnterior: Number(somaAntes.toFixed(2)),
      somaAgora: Number(somaAgora.toFixed(2)),
      normalizadoD: {
        antes: Number(((d.naQuintaAnterior / somaAntes) * 100).toFixed(2)),
        agora: Number(((d.agora / somaAgora) * 100).toFixed(2)),
      },
    }
    saida[`par_${par}`].deltaNormalizadoD = Number(
      (saida[`par_${par}`].normalizadoD.agora - saida[`par_${par}`].normalizadoD.antes).toFixed(2),
    )
  }

  // Pesquisas: a dispersão vem antes da média, porque é ela o achado.
  const pol = JSON.parse(readFileSync('public/us-polls-data.json', 'utf8'))
  const inc = pol.mediaAfos?.incluidas ?? []
  const comVant = inc.map((p) => ({ ...p, vantagem: Number((p.dem - p.rep).toFixed(2)) })).sort((a, b) => b.vantagem - a.vantagem)
  saida.pesquisas = {
    media: pol.mediaAfos?.vantagemDem ?? null,
    n: pol.mediaAfos?.nPesquisas ?? null,
    institutos: pol.mediaAfos?.nInstitutos ?? null,
    janelaDesde: pol.mediaAfos?.desde ?? null,
    campoMaisRecente: inc.map((p) => p.campoFim).sort().at(-1) ?? null,
    alta: comVant[0] ?? null,
    baixa: comVant.at(-1) ?? null,
    amplitude: comVant.length ? Number((comVant[0].vantagem - comVant.at(-1).vantagem).toFixed(2)) : null,
    rodadas: comVant,
  }

  // Imprensa: só o que está ARQUIVADO, que é o que se pode citar depois.
  const dir = 'public/us-press-archive'
  for (const f of readdirSync(dir).sort()) {
    const dia = f.replace('.json', '')
    if (dia <= desde || dia > hoje) continue
    const a = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))
    for (const it of a.itens ?? []) {
      saida.imprensa.push({
        dia,
        veiculo: it.casa ?? '?',
        titulo: it.titulo ?? '',
        publicadoEm: (it.publicadoEm ?? '').slice(0, 10),
        // 'feed' e link canônico do veículo; o resto é invólucro do agregador,
        // e nesse caso a edição imprime a manchete sem endereço (hideUrl).
        canonico: it.origem === 'feed',
        trilho: it.trilho ?? null,
        link: it.url ?? '',
      })
    }
  }

  if (JSONOUT) {
    console.log(JSON.stringify(saida, null, 2))
    return
  }

  const pp = (v) => (v === null ? '?' : `${v > 0 ? '+' : ''}${v.toFixed(2)}pp`)
  console.log(`\n🗓️  SEMANA DOS EUA · de ${desde} a ${hoje}  [USO INTERNO, nao publicar cru]`)
  console.log(`   certificada de agora: ${saida.certificadaEm ?? 'AUSENTE'}`)
  console.log(`   base da semana: último ponto gravado até ${desde}\n`)
  for (const l of saida.livros) {
    if (l.erro) { console.log(`   ${l.rotulo}: ${l.erro}`); continue }
    console.log(`   ${l.rotulo}`)
    console.log(`      ${l.naQuintaAnterior}% (${l.baseEm?.slice(0, 16)}) -> ${l.agora}%   ${pp(l.deltaSemana)}`)
    console.log(`      mudou em ${l.diasComMudanca.length} dia(s): ${l.diasComMudanca.join(', ') || 'nenhum'}`)
    for (const m of l.mudancas) console.log(`         ${m.ts.slice(0, 16)}  ${m.de} -> ${m.para}${m.certificada ? '  (certificada de hoje)' : ''}`)
    console.log(`      série ${l.serie.de} a ${l.serie.ate}: topo ${l.serie.topo} (${l.serie.topoEm}), piso ${l.serie.piso} (${l.serie.pisoEm})`)
  }
  for (const par of ['house', 'senate']) {
    const p = saida[`par_${par}`]
    if (!p) continue
    console.log(`\n   ⚖️ par ${par}: soma ${p.somaNaQuintaAnterior}% -> ${p.somaAgora}% · D normalizado ${p.normalizadoD.antes} -> ${p.normalizadoD.agora} (${pp(p.deltaNormalizadoD)})`)
  }
  const q = saida.pesquisas
  console.log(`\n   🗳️ pesquisas: média D+${q.media} sobre ${q.n} rodada(s) de ${q.institutos} instituto(s), janela desde ${q.janelaDesde}, campo mais recente ${q.campoMaisRecente}`)
  console.log(`      dispersão ${q.amplitude} pontos: ${q.alta?.instituto} ${q.alta?.vantagem >= 0 ? 'D+' : 'R+'}${Math.abs(q.alta?.vantagem)} (campo ${q.alta?.campoFim}) até ${q.baixa?.instituto} ${q.baixa?.vantagem >= 0 ? 'D+' : 'R+'}${Math.abs(q.baixa?.vantagem)} (campo ${q.baixa?.campoFim})`)
  for (const r of q.rodadas) console.log(`         ${r.campoFim}  ${r.instituto} (${r.amostraTipo})  D ${r.dem} x R ${r.rep}  = ${r.vantagem >= 0 ? 'D+' : 'R+'}${Math.abs(r.vantagem)}`)
  console.log(`\n   📰 imprensa arquivada na janela: ${saida.imprensa.length} item(ns)`)
  for (const i of saida.imprensa) console.log(`      ${i.publicadoEm || i.dia} [${i.canonico ? 'canônico' : 'agregador'}] ${i.veiculo}: ${i.titulo.slice(0, 92)}`)
  console.log('')
}

main()
