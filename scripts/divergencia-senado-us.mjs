/**
 * divergencia-senado-us.mjs — a distância entre os DOIS livros do Senado americano.
 *
 * O painel guarda duas apostas sobre a mesma pergunta, e elas discordam:
 *   - o BINÁRIO: "o Partido Republicano controla o Senado?"
 *   - a DISTRIBUIÇÃO: quantas cadeiras o Partido Republicano tem
 * Somando as faixas em que os republicanos controlam e normalizando pela soma
 * das faixas, sai um segundo preço para a mesma pergunta. A diferença entre os
 * dois é a medida que o painel acompanha desde 24/Ago/2026.
 *
 * 🔴 POR QUE ISTO VIROU SCRIPT, medido em 03/Set/2026, na 9ª medição.
 *
 * A conta era feita à mão toda rodada, e nesta eu a errei por QUATRO VEZES o
 * valor: somei só a faixa de 51 cadeiras ou mais e cheguei a 16,61pp, contra
 * 3,90pp do correto. O que segurou a mão foi a série, que anda entre 1,21 e
 * 5,34: salto de 4x é alarme sobre o MEDIDOR, não notícia sobre o mundo.
 *
 * 🔑 O ERRO TEM NOME: o EMPATE EM 50 A 50 CONTA PARA OS REPUBLICANOS, porque o
 * vice-presidente desempata o Senado. "R controla" é `R >= 51` MAIS `R == 50`,
 * e isso não está escrito em lugar nenhum da tabela de faixas: está na
 * Constituição. Uma conta ad hoc não sabe disso, e a série é a única coisa que
 * denuncia quando ela esquece.
 *
 * ✅ POR ISSO O CONTROLE VEM PRIMEIRO E É BLOQUEANTE. Antes de medir o dia, o
 * script refaz a conta sobre os números PUBLICADOS em 01/Set e exige reproduzir
 * os 3,84pp. Se não reproduzir, ele para e não mede nada: conferidor que não
 * prova que mede não pode dizer que mediu.
 * Ver memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * Uso:
 *   node scripts/divergencia-senado-us.mjs              # lê ao vivo pelo proxy
 *   node scripts/divergencia-senado-us.mjs arquivo.json # lê um payload salvo
 *   node scripts/divergencia-senado-us.mjs --data=2026-09-04  # fechamento no BACKUP
 *
 * 🔑 O --data= existe porque a peça SEMANAL fecha na sexta e a leitura ao vivo
 * é de domingo. Medir hoje e rotular o número como achado da semana seria data
 * errada numa afirmação de série. Ele lê o ÚLTIMO ponto do dia pedido.
 */
import { readFileSync, readdirSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'
import { instantesSuspeitos } from './lib/serie-contrato.mjs'

const PROXY = 'https://www.afos-analytics.com/api/polymarket?country=us&fresh=1'

/**
 * A série publicada, para dar contexto e para o teste de sanidade.
 *
 * 🔴 ELA É DE LEITURAS AO VIVO, em horas avulsas, e NÃO é comparável com o que
 * o --data= devolve, que é FECHAMENTO de dia. Misturar as duas produz uma série
 * que muda de método no meio, e superlativo sobre ela seria falso sem dar erro.
 * Medido em 06/Set/2026: ao vivo às 21:57Z deu 6,15pp e o fechamento do mesmo
 * dia deu 4,83pp. Para comparar semana com semana, usar --data= nas DUAS pontas.
 * Cada valor é uma medição da distância normalizada, em pontos percentuais.
 * ⚠️ O 2,77 de 24/Ago segue DECLARADO como não reproduzível no backup.
 */
const SERIE = [1.21, 2.37, 4.64, 4.53, 5.34, 4.51, 3.13, 3.84]

/** Os números publicados em 01/Set, que o controle tem de reproduzir. */
const CONTROLE = {
  rotulo: '01/Set/2026',
  dMaj: 53.5,
  empate: 12.5,
  rMaj: 32.45,
  binarioR: 49.5,
  esperado: { soma: 98.45, cru: 44.95, normalizado: 45.66, distancia: 3.84 },
}

/**
 * A conta, num lugar só.
 *
 * ⚠️ `cru` inclui o empate DE PROPÓSITO. Ver o cabeçalho.
 */
function medir({ dMaj, empate, rMaj, binarioR }) {
  const soma = dMaj + empate + rMaj
  const cru = rMaj + empate
  const normalizado = (cru / soma) * 100
  return {
    soma: +soma.toFixed(2),
    cru: +cru.toFixed(2),
    normalizado: +normalizado.toFixed(2),
    distancia: +Math.abs(normalizado - binarioR).toFixed(2),
  }
}

/**
 * A REGRA CONSTITUCIONAL, e ela mora AQUI e em nenhum outro lugar: o empate
 * em 50 a 50 e dos republicanos, porque o vice-presidente desempata o Senado.
 * Os DOIS adaptadores abaixo, o da API e o do backup, chamam esta funcao.
 * Duas copias desta linha seria o defeito de 29/Jul: convivem sem incidente
 * ate o dia em que uma e corrigida e a outra nao.
 */
function classificar(n) {
  if (n <= 49) return 'dMaj'
  if (n === 50) return 'empate'
  return 'rMaj'
}

/**
 * O numero de cadeiras de um rotulo, nos DOIS formatos que existem de verdade:
 *   API    : "hold 47 or fewer Senate seats", "hold exactly 50 Senate seats"
 *   backup : "<= 47 cad.", "50 cad.", ">= 57 cad."
 *
 * WARN O backup NAO guarda a pergunta em ingles: ele guarda UM mercado com 11
 * OUTCOMES ja rotulados em portugues. Supor a forma da API aqui devolveria
 * ZERO faixa reconhecida, que este script ja trata como "a origem mudou de
 * formato" e por isso para em vez de medir errado.
 */
function numeroDaFaixa(rotulo) {
  const t = String(rotulo ?? '')
  const api = t.match(/(\d+)\s+(?:or fewer|or more|Senate seats)/i)
  if (api) return Number(api[1])
  const bkp = t.match(/(\d+)\s*cad\./i)
  if (bkp) return Number(bkp[1])
  return null
}

/** Soma por balde. `itens` = [{ rotulo, preco }], com preco em 0 a 100. */
function separarFaixasRotuladas(itens) {
  const acc = { dMaj: 0, empate: 0, rMaj: 0 }
  const semNumero = []
  for (const { rotulo, preco } of itens) {
    if (!Number.isFinite(preco)) continue
    const n = numeroDaFaixa(rotulo)
    if (n === null) {
      semNumero.push(rotulo)
      continue
    }
    acc[classificar(n)] += preco
  }
  return { dMaj: +acc.dMaj.toFixed(2), empate: +acc.empate.toFixed(2), rMaj: +acc.rMaj.toFixed(2), semNumero }
}

/** Adaptador da API: cada faixa e um MERCADO, com a pergunta em `question`. */
function separarFaixas(mercados) {
  return separarFaixasRotuladas(
    mercados.map((m) => ({ rotulo: m.question, preco: Number(m?.outcomePrices?.[0]) * 100 })),
  )
}

// ---- O adaptador do BACKUP -------------------------------------------------
const RAIZ_BACKUP = 'backup/neon'
const SLUG_FAIXAS = 'republican-senate-seats-after-the-2026-midterm-elections-927'
const SLUG_BINARIO = 'which-party-will-win-the-senate-in-2026'

function lerCsvGz(dir) {
  const caminho = join(RAIZ_BACKUP, dir)
  const linhas = []
  for (const f of readdirSync(caminho).filter((x) => x.endsWith('.csv.gz'))) {
    const txt = gunzipSync(readFileSync(join(caminho, f))).toString('utf8')
    const [cab, ...resto] = txt.split(/\r?\n/).filter(Boolean)
    const cols = cab.split(',')
    for (const l of resto) {
      const v = l.split(',')
      const o = {}
      cols.forEach((c, i) => (o[c] = v[i]))
      linhas.push(o)
    }
  }
  return linhas
}

/**
 * Devolve um payload com a MESMA FORMA que o proxy entrega, medido no
 * FECHAMENTO de `data`, ou seja no ULTIMO ponto daquele dia de cada faixa.
 *
 * WARN Dia sem ponto NAO herda do anterior aqui, de proposito: a pergunta que
 * este script responde e "quanto os dois livros discordavam NAQUELE dia", e
 * herdar responderia outra pergunta sem avisar.
 *
 * WARN E o backup tem CAUDA CEGA de ate 24h, entao pedir o dia de HOJE devolve
 * foto incompleta. Para hoje, usar a leitura ao vivo, que e o padrao.
 */
function payloadDoBackup(data) {
  const mercados = lerCsvGz('market')
  const saidas = lerCsvGz('marketOutcome')
  const precos = lerCsvGz('marketPrice')

  const suspeitos = instantesSuspeitos(precos)
  const limpos =
    suspeitos.size === 0 ? precos : precos.filter((p) => !suspeitos.has(String(p.snapshotAt).slice(0, 19)))

  const idDe = (slug) => mercados.find((m) => m.slug === slug)?.id
  const montar = (slug) => {
    const mid = idDe(slug)
    if (!mid) throw new Error('slug ausente no backup: ' + slug)
    const outs = saidas.filter((o) => o.marketId === mid)
    const porSaida = new Map(outs.map((o) => [o.id, o]))
    const ultimo = new Map()
    for (const p of limpos) {
      if (!porSaida.has(p.outcomeId)) continue
      if (String(p.snapshotAt).slice(0, 10) !== data) continue
      const atual = ultimo.get(p.outcomeId)
      if (!atual || p.snapshotAt > atual.snapshotAt) ultimo.set(p.outcomeId, p)
    }
    const markets = []
    for (const [oid, p] of ultimo) {
      markets.push({
        question: porSaida.get(oid).outcomeName,
        outcomePrices: [String(Number(p.price) / 100)],
        carimbo: p.snapshotAt,
      })
    }
    return markets
  }

  const faixas = montar(SLUG_FAIXAS)
  const binarios = montar(SLUG_BINARIO)
  if (!faixas.length || !binarios.length) {
    throw new Error('o backup nao tem ponto do Senado em ' + data + '. Dia sem coleta nao vira zero.')
  }
  const carimbos = [...faixas, ...binarios].map((m) => m.carimbo).sort()
  return {
    fetchedAt: carimbos[carimbos.length - 1] + '  (FECHAMENTO de ' + data + ', lido no backup)',
    senateSeats: { markets: faixas },
    senate: { markets: binarios },
  }
}

const br = (n, c = 2) => n.toFixed(c).replace('.', ',')

async function main() {
  // ── CONTROLE, e ele é bloqueante ────────────────────────────────────────────
  const c = medir(CONTROLE)
  const e = CONTROLE.esperado
  const bate =
    Math.abs(c.soma - e.soma) < 0.01 &&
    Math.abs(c.cru - e.cru) < 0.01 &&
    Math.abs(c.normalizado - e.normalizado) < 0.01 &&
    Math.abs(c.distancia - e.distancia) < 0.01
  console.log(`🔬 CONTROLE contra o publicado em ${CONTROLE.rotulo}`)
  console.log(`   conta:     soma ${br(c.soma)}%  cru ${br(c.cru)}%  norm ${br(c.normalizado)}%  distancia ${br(c.distancia)}pp`)
  console.log(`   publicado: soma ${br(e.soma)}%  cru ${br(e.cru)}%  norm ${br(e.normalizado)}%  distancia ${br(e.distancia)}pp`)
  if (!bate) {
    console.error('   ❌ a conta NAO reproduz o publicado. PARANDO: nao medir com regua que nao afere.')
    process.exit(1)
  }
  console.log('   ✅ reproduz. A conta esta certa, entao a medicao do dia vale.\n')

  // ── A leitura do dia ────────────────────────────────────────────────────────
  const dataArg = process.argv.find((a) => a.startsWith('--data='))?.slice(7)
  const caminho = process.argv.slice(2).find((a) => !a.startsWith('--'))
  let payload
  if (dataArg) {
    payload = payloadDoBackup(dataArg)
    console.log('BACKUP: medido no FECHAMENTO de ' + dataArg + ', nao na API')
  } else if (caminho) {
    payload = JSON.parse(readFileSync(caminho, 'utf-8'))
    console.log(`📄 payload lido de ${caminho}`)
  } else {
    const res = await fetch(PROXY, { cache: 'no-store' })
    if (!res.ok) {
      console.error(`❌ o proxy devolveu HTTP ${res.status}`)
      process.exit(1)
    }
    payload = await res.json()
  }

  const faixas = payload?.senateSeats?.markets ?? []
  const binarios = payload?.senate?.markets ?? []
  if (!faixas.length || !binarios.length) {
    console.error('❌ payload sem senateSeats ou sem senate. ZERO aqui seria medidor mudo, nao medicao.')
    process.exit(1)
  }

  const { dMaj, empate, rMaj, semNumero } = separarFaixas(faixas)
  if (semNumero.length) {
    console.error(`❌ ${semNumero.length} faixa(s) sem numero reconhecivel. A origem mudou de formato:`)
    for (const q of semNumero) console.error(`   ${q}`)
    process.exit(1)
  }

  const bR = binarios.find((m) => /Republican/i.test(m.question))
  // WARN a API diz "Democratic Party" e o BACKUP diz "Democratas": os dois entram.
  const bD = binarios.find((m) => /Democratic|Democratas/i.test(m.question))
  const binarioR = Number(bR?.outcomePrices?.[0]) * 100
  const binarioD = Number(bD?.outcomePrices?.[0]) * 100
  if (!Number.isFinite(binarioR)) {
    console.error('❌ binario republicano sem preco.')
    process.exit(1)
  }

  const r = medir({ dMaj, empate, rMaj, binarioR })

  console.log(`📅 leitura de ${payload.fetchedAt}\n`)
  console.log(`   D com maioria propria (R <= 49) : ${br(dMaj).padStart(6)}%`)
  console.log(`   Empate em 50 a 50               : ${br(empate).padStart(6)}%   ⚠️ conta para R, o vice desempata`)
  console.log(`   R com maioria propria (R >= 51) : ${br(rMaj).padStart(6)}%`)
  console.log(`   soma das faixas                 : ${br(r.soma).padStart(6)}%   ${r.soma >= 95 && r.soma <= 105 ? '✅ dentro de 95-105' : '❌ FORA de 95-105'}`)
  console.log('')
  console.log(`   R controla, CRU                 : ${br(r.cru).padStart(6)}%`)
  console.log(`   R controla, NORMALIZADO         : ${br(r.normalizado).padStart(6)}%`)
  console.log(`   Binario R                       : ${br(binarioR).padStart(6)}%`)
  console.log(`   Binario D                       : ${br(binarioD).padStart(6)}%   (par soma ${br(binarioR + binarioD)}%)`)
  console.log('')
  console.log(`   🔑 DISTANCIA normalizada        : ${br(r.distancia)}pp`)
  console.log('')
  console.log(`   serie: ${SERIE.map((v) => br(v)).join(' · ')} · ${br(r.distancia)}`)

  // Sanidade sobre a SERIE, que foi o que denunciou o erro de 03/Set.
  const max = Math.max(...SERIE)
  const min = Math.min(...SERIE)
  if (r.distancia > max * 2 || r.distancia < min / 2) {
    console.log('')
    console.log(`   ⚠️ o valor de hoje esta MUITO fora da faixa historica (${br(min)} a ${br(max)}pp).`)
    console.log('      Antes de publicar, conferir se a conta mudou de significado. Salto de multiplos')
    console.log('      costuma ser defeito do medidor, nao noticia sobre o mundo.')
  }
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
