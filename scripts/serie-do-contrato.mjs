/**
 * serie-do-contrato.mjs — a ETAPA 4 do `/atualizar-usa` e o guardrail de
 * superlativo do `/atualizar-brz`, feitos por medição em vez de à mão.
 *
 * Lê a série GRAVADA em `backup/neon/marketPrice`, fecha a cauda cega com a
 * leitura certificada da trava de captura, e diz por contrato se o valor de
 * agora é RECORDE, PISO ou está DENTRO da faixa. Também mede quanto a janela
 * de 90 dias da API esconderia, que foi o defeito achado em 04/Set/2026.
 *
 * ⛔ Não coleta, não escreve nada e não toca na rede.
 *
 * Uso:
 *   node scripts/serie-do-contrato.mjs --pais=us
 *   node scripts/serie-do-contrato.mjs --pais=br
 *   node scripts/serie-do-contrato.mjs --slug=which-party-will-win-the-senate-in-2026
 *   node scripts/serie-do-contrato.mjs --pais=us --dias-api=90
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'
import { pathToFileURL } from 'url'
import {
  agruparPorLivro,
  casarCaptura,
  extremos,
  idadeEmHoras,
  instantesSuspeitos,
  oQueAJanelaEsconde,
  serieDe,
  vereditoSuperlativo,
} from './lib/serie-contrato.mjs'

const RAIZ = 'backup/neon'

/**
 * Os contratos BINÁRIOS de cada país. Distribuição fica de fora de propósito:
 * faixa fina oscila entre si sem a eleição ter mudado, e "recorde" numa faixa de
 * 3% não é notícia, é ruído. Quem cuida da qualidade delas é o portão de 95-105%.
 */
const PAISES = {
  us: [/^which-party-will-win-the-(house|senate)-in-2026$/, /^will-the-2026-midterm-elections-happen-as-scheduled$/],
  br: [/^brazil-presidential-election$/, /^any-brazil-stf-justice-removed-by-impeachment-before-2027$/, /^next-brazil-senate-election-most-seats-won$/],
}

const CAPTURA = { us: '.cache/capture-guard/ultima-us.json', br: '.cache/capture-guard/ultima-br.json' }

function lerCsvGz(dir) {
  const caminho = join(RAIZ, dir)
  if (!existsSync(caminho)) return []
  const linhas = []
  for (const f of readdirSync(caminho).filter((x) => x.endsWith('.csv.gz'))) {
    const txt = gunzipSync(readFileSync(join(caminho, f))).toString('utf8')
    const [cab, ...resto] = txt.split(/\r?\n/).filter(Boolean)
    const cols = cab.split(',')
    for (const l of resto) {
      // Só lemos colunas ANTES do primeiro campo que pode ter vírgula
      // (title, description, rawPayload), então o split simples basta aqui.
      const v = l.split(',')
      const o = {}
      cols.forEach((c, i) => (o[c] = v[i]))
      linhas.push(o)
    }
  }
  return linhas
}

/** A leitura certificada de agora, que fecha a cauda cega do backup. */
function lerCaptura(pais) {
  const caminho = CAPTURA[pais]
  if (!caminho || !existsSync(caminho)) return { precos: new Map(), orfas: [], carimbo: null }
  try {
    const s = JSON.parse(readFileSync(caminho, 'utf8'))
    const { casadas, orfas } = casarCaptura(s.precos, pais)
    return { precos: casadas, orfas, carimbo: s.fetchedAt ?? null }
  } catch {
    return { precos: new Map(), orfas: [], carimbo: null }
  }
}

function principal() {
  const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
  const pais = arg('pais') ?? 'us'
  const soSlug = arg('slug')
  const diasApi = Number(arg('dias-api') ?? 90)
  const maxIdadeH = Number(arg('max-idade-h') ?? 2)

  const mercados = lerCsvGz('market')
  const saidas = lerCsvGz('marketOutcome')
  const precos = lerCsvGz('marketPrice')
  if (precos.length === 0) {
    console.error(`❌ nenhum ponto lido em ${RAIZ}/marketPrice. O backup existe e está descompactável?`)
    process.exit(1)
  }

  const mercadoDe = new Map(mercados.map((m) => [m.id, m]))
  const outcomeDe = new Map(saidas.map((o) => [o.id, o]))
  const padroes = PAISES[pais] ?? []

  // 🔴 A quarentena roda sobre TODOS os preços, de todos os livros e países,
  // porque a assinatura é cruzada: o que denuncia o instante é meio backup
  // sentado perto de 50 ao mesmo tempo, não o valor de um livro só.
  const suspeitos = instantesSuspeitos(precos)
  const antesDaQuarentena = precos.length
  const limpos = suspeitos.size === 0 ? precos : precos.filter((p) => !suspeitos.has(String(p.snapshotAt).slice(0, 19)))

  const todos = serieDe(limpos, outcomeDe, mercadoDe, soSlug ? { slug: soSlug } : {})
  const livros = agruparPorLivro(
    soSlug ? todos : todos.filter((p) => padroes.some((re) => re.test(p.slug)))
  )

  if (livros.size === 0) {
    console.log(`\n(nenhuma série gravada para ${soSlug ?? `pais=${pais}`})\n`)
    return
  }

  const { precos: agora, orfas, carimbo } = lerCaptura(pais)

  console.log(`\n📈 SÉRIE DOS CONTRATOS · lida em ${RAIZ}/marketPrice, não na API`)
  console.log(`   ⚠️ superlativo se confere AQUI. A rota /api/market/history trava em 90 dias`)
  console.log(`      e devolve truncated:false mesmo escondendo o começo da série.`)
  const idade = idadeEmHoras(carimbo)
  const velha = idade != null && idade > maxIdadeH
  if (!carimbo) {
    console.log(`   ⚠️ sem leitura certificada em ${CAPTURA[pais] ?? '(país sem cache)'}: a CAUDA CEGA do backup, de até 24h, fica aberta.\n`)
  } else if (velha) {
    // 🔴 Leitura que casa e está velha é PIOR que leitura que não casa: a que
    // não casa aparece como buraco, a velha passa por atual.
    console.log(`   🔴 a leitura certificada tem ${idade.toFixed(1)}h (${carimbo}), acima do limite de ${maxIdadeH}h.`)
    console.log(`      Ela entra na série como o PONTO DAQUELE INSTANTE, e o veredito abaixo NÃO descreve o preço de agora.`)
    console.log(`      Para conferir superlativo agora, rodar a trava primeiro: npx tsx scripts/capture-guard.ts --pais=${pais}\n`)
  } else {
    console.log(`   leitura certificada de agora: ${carimbo} (${idade.toFixed(1)}h)\n`)
  }

  if (suspeitos.size) {
    const fora = antesDaQuarentena - limpos.length
    console.log(`   🔴 QUARENTENA: ${suspeitos.size} instante(s) e ${fora} ponto(s) fora, por concentração perto de 50%.`)
    for (const [k, o] of [...suspeitos].sort()) {
      console.log(`      ${k.replace('T', ' ')} UTC   ${o.perto} de ${o.n} pontos entre 49 e 51  (${(o.frac * 100).toFixed(1)}%)`)
    }
    console.log(`      Mediana do backup é 0,0% e o p99 é 8,7%: isso é valor de recuo do coletor, não preço.`)
    console.log(`      ⛔ Filtro de LEITURA, só aqui. O backup não foi tocado.\n`)
  }

  // ⚠️ Chave da captura que não acha livro no backup é cauda cega passando por
  // conferida, e por isso ela grita em vez de sumir.
  if (orfas.length) {
    console.log(`   ⚠️ ${orfas.length} chave(s) da captura certificada NÃO casaram com nenhum livro do backup:`)
    for (const o of orfas) console.log(`      ${o}`)
    console.log(`      Sem casar, o veredito abaixo usa o ÚLTIMO PONTO GRAVADO e a cauda cega de até 24h fica aberta.
`)
  }

  let alertas = 0
  for (const chave of [...livros.keys()].sort()) {
    const [slug, outcome] = chave.split('␟')
    const pontos = livros.get(chave)
    const ext = extremos(pontos)

    // 🔑 O ponto de AGORA entra na série antes de qualquer veredito, senão a
    // conferência é contra um retrato de até 24h atrás.
    const hoje = agora.get(chave) ?? null
    const comAgora = hoje == null ? pontos : [...pontos, { t: carimbo ?? new Date().toISOString(), v: hoje, slug, outcome }]
    const extTudo = extremos(comAgora)
    const v = vereditoSuperlativo(hoje ?? ext.ultimo, extTudo)

    console.log(`   ${outcome} · ${slug}`)
    console.log(
      `      ${ext.n} pontos gravados, de ${ext.inicio.slice(0, 10)} a ${ext.fim.slice(0, 16).replace('T', ' ')} UTC` +
        (hoje == null ? `  (último gravado ${ext.ultimo.toFixed(2)})` : `  + agora ${hoje.toFixed(2)}`)
    )
    console.log(`      faixa da série  ${extTudo.min.toFixed(2)} a ${extTudo.max.toFixed(2)}   amplitude ${(extTudo.max - extTudo.min).toFixed(2)}pp`)
    console.log(`      ${v.veredito === 'DENTRO' ? '·' : '⭐'} ${v.veredito}: ${v.motivo}`)

    const escondido = oQueAJanelaEsconde(comAgora, diasApi)
    if (escondido) {
      alertas++
      console.log(
        `      🔴 a janela de ${diasApi}d da API esconderia ${escondido.diasFora} dia(s) e ${escondido.pontosFora} ponto(s):` +
          ` ela começaria em ${escondido.inicioVisivel.slice(0, 10)}, a série começa em ${escondido.inicioReal.slice(0, 10)}`
      )
      if (escondido.escondeMax)
        console.log(
          `         e o TOPO real, ${escondido.escondeMax.real.toFixed(2)} de ${escondido.escondeMax.em.slice(0, 10)},` +
            ` apareceria como ${escondido.escondeMax.aparente.toFixed(2)}`
        )
      if (escondido.escondeMin)
        console.log(
          `         e o PISO real, ${escondido.escondeMin.real.toFixed(2)} de ${escondido.escondeMin.em.slice(0, 10)},` +
            ` apareceria como ${escondido.escondeMin.aparente.toFixed(2)}`
        )
    }
    console.log()
  }

  if (alertas) {
    console.log(`   ⛔ ${alertas} série(s) em que consultar a API produziria superlativo FALSO sem dar erro.\n`)
  } else {
    console.log(`   ✅ nenhuma série ultrapassa a janela de ${diasApi}d: aqui a API serviria.\n`)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) principal()
