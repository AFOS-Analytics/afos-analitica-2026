/**
 * serie-do-contrato.mjs · a ETAPA 4 do `/atualizar-usa` e o guardrail de
 * superlativo do `/atualizar-brz`, feitos por medição em vez de à mão.
 *
 * Lê a série GRAVADA em `backup/neon/marketPrice`, fecha a cauda cega com a
 * leitura certificada da trava de captura, e diz por contrato se o valor de
 * agora é RECORDE, PISO ou está DENTRO da faixa. Também mede quanto a janela
 * de 90 dias da API esconderia, que foi o defeito achado em 04/Set/2026.
 *
 * ⚠️ O bloco `QUARENTENA` hoje NÃO aparece, porque o único dia contaminado
 * conhecido, 28/Abr/2026, foi expurgado. Se ele voltar a aparecer, é
 * contaminação NOVA e o lugar de olhar é a coleta, não este script.
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
  estaEncerrada,
  extremos,
  idadeEmHoras,
  instantesSuspeitos,
  oQueAJanelaEsconde,
  parBinario,
  precosCertificados,
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

/**
 * A leitura certificada de agora, que fecha a cauda cega do backup.
 *
 * 🔒 Só entram os livros que a trava CERTIFICOU. Até 12/Set/2026 esta função
 * lia `s.precos` inteiro e nunca o veredito, então preço de livro reprovado
 * entrava como "agora". Ver `precosCertificados`.
 *
 * ⚠️ Os dois retornos de saída rápida devolvem a MESMA forma do caminho feliz.
 * Antes o de arquivo ausente não trazia `foraDeEscopo`, e quem lê `.length` mais
 * abaixo quebraria com o cache vazio, que é justamente o estado de máquina nova.
 */
function lerCaptura(pais, chavesDaSerie) {
  const vazio = {
    precos: new Map(),
    orfas: [],
    foraDeEscopo: [],
    bloqueadas: [],
    livrosBloqueados: [],
    vereditoAusente: false,
    carimbo: null,
  }
  const caminho = CAPTURA[pais]
  if (!caminho || !existsSync(caminho)) return vazio
  try {
    const s = JSON.parse(readFileSync(caminho, 'utf8'))
    const { precos, bloqueadas, livrosBloqueados, vereditoAusente } = precosCertificados(s)
    const { casadas, orfas, foraDeEscopo } = casarCaptura(precos, pais, chavesDaSerie)
    return { precos: casadas, orfas, foraDeEscopo, bloqueadas, livrosBloqueados, vereditoAusente, carimbo: s.fetchedAt ?? null }
  } catch {
    return vazio
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

  // As chaves da SÉRIE entram na junção para ela escolher a grafia que existe,
  // em vez de apostar numa. Ver casarCaptura.
  const { precos: agora, orfas, foraDeEscopo, bloqueadas, livrosBloqueados, vereditoAusente, carimbo } = lerCaptura(
    pais,
    new Set(livros.keys())
  )

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

  /**
   * 🏷️ Livro vigiado pela trava e SEM série guardada, como o 2º e o 3º lugar do
   * Brasil. Sai contado e não listado: são dezenas de linhas esperadas, e listar
   * todas afogaria a órfã de verdade, que é uma. Em 10/Set eram 37 destas para 1
   * daquelas.
   */
  if (foraDeEscopo.length) {
    const grupos = [...new Set(foraDeEscopo.map((c) => c.split(':')[0]))].join(', ')
    console.log(
      `   📌 ${foraDeEscopo.length} chave(s) da captura são de livro SEM série vigiada (${grupos}): ` +
        `não há superlativo a conferir para elas, e isso não abre cauda cega.\n`
    )
  }

  /**
   * 🔒 Livro que a trava REPROVOU. Sai em voz alta e os preços dele NÃO entram
   * como "agora": sem certificação não há preço de agora, e a série cai para o
   * último ponto gravado, com a cauda cega declarada ao lado.
   *
   * ⚠️ Isto é uma terceira categoria, e não uma órfã nem um fora de escopo. A
   * órfã é defeito de JUNÇÃO, o fora de escopo é livro sem série, e este é livro
   * com série e com preço cujo CARIMBO não vale. Misturar os três esconderia o
   * único que muda o veredito de superlativo.
   */
  if (vereditoAusente) {
    console.log(
      `   ⚠️ a captura não gravou 'livrosOk': não há veredito da trava neste arquivo, ` +
        `e os preços entraram SEM conferir certificação.\n`
    )
  } else if (livrosBloqueados.length) {
    console.log(
      `   🔒 ${livrosBloqueados.length} livro(s) BLOQUEADO(s) pela trava: ${bloqueadas.length} preço(s) ficaram de fora e NÃO são "agora".`
    )
    for (const l of livrosBloqueados) {
      console.log(`      ${l.grupo}${l.motivos.length ? `: ${l.motivos[0]}` : ''}`)
    }
    console.log(`      Estes livros caem para o ÚLTIMO PONTO GRAVADO, e a cauda cega de até 24h fica aberta neles.\n`)
  }

  let alertas = 0
  // Os dois lados de cada livro binário, juntados para o bloco do par lá embaixo.
  const paresPorSlug = new Map()
  for (const chave of [...livros.keys()].sort()) {
    const [slug, outcome] = chave.split('␟')
    const pontos = livros.get(chave)
    const ext = extremos(pontos)

    // 🔑 O ponto de AGORA entra na série antes de qualquer veredito, senão a
    // conferência é contra um retrato de até 24h atrás.
    const hoje = agora.get(chave) ?? null
    const comAgora = hoje == null ? pontos : [...pontos, { t: carimbo ?? new Date().toISOString(), v: hoje, slug, outcome }]
    const extTudo = extremos(comAgora)

    // 🔴 O veredito compara contra a série SEM o ponto que está sendo julgado.
    // Achado em 04/Set/2026 conferindo a ferramenta: eu comparava contra a série
    // COM o valor de agora dentro, e aí `agora > max` é impossível por
    // construção. RECORDE e PISO nunca disparavam, e um portão que não pode
    // disparar é indistinguível de um portão quebrado. O `extTudo` continua
    // servindo para IMPRIMIR a faixa, que aí sim inclui hoje.
    const anteriores = hoje == null ? pontos.slice(0, -1) : pontos
    const extAnterior = extremos(anteriores)
    // Livro sem leitura viva e sem ponto novo há mais de uma semana saiu do
    // book: não existe "preço de agora" para julgar.
    const encerrada = hoje == null && estaEncerrada(ext)
    const v = vereditoSuperlativo(hoje ?? ext.ultimo, extAnterior, { encerrada })

    // O "antes" do par é o último ponto GRAVADO no backup, e o "agora" é a
    // leitura certificada. São duas grandezas de tempo diferentes e o bloco
    // abaixo diz qual é qual, porque entre elas há a cauda cega de até 24h.
    if (!paresPorSlug.has(slug)) paresPorSlug.set(slug, [])
    paresPorSlug.get(slug).push({ outcome, antes: ext.ultimo, agora: hoje, fimGravado: ext.fim })

    console.log(`   ${outcome} · ${slug}`)
    console.log(
      `      ${ext.n} pontos gravados, de ${ext.inicio.slice(0, 10)} a ${ext.fim.slice(0, 16).replace('T', ' ')} UTC` +
        (hoje == null ? `  (último gravado ${ext.ultimo.toFixed(2)})` : `  + agora ${hoje.toFixed(2)}`)
    )
    console.log(`      faixa da série  ${extTudo.min.toFixed(2)} a ${extTudo.max.toFixed(2)}   amplitude ${(extTudo.max - extTudo.min).toFixed(2)}pp`)
    const marca = v.veredito === 'DENTRO' ? '·' : v.veredito === 'SERIE_ENCERRADA' ? '⏹' : '⭐'
    const ressalva = velha && !encerrada ? ` (leitura de ${idade.toFixed(1)}h atrás, NÃO é o preço de agora)` : ''
    console.log(`      ${marca} ${v.veredito}${ressalva}: ${v.motivo}`)

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

  /**
   * ⚖️ O PAR BINÁRIO, instalado em 07/Set/2026.
   *
   * A régua é de 18/Ago e o painel já publica cru e normalizado lado a lado
   * desde então, mas NENHUMA ferramenta de linha de comando calculava isso: a
   * conta era refeita à mão a cada passada, e é a conta do número da manchete.
   * Regra decidida que ninguém mede é regra que não roda.
   */
  const pares = [...paresPorSlug.entries()].filter(([, l]) => l.length === 2)
  if (pares.length) {
    console.log(`   ⚖️ PAR BINÁRIO · cru e normalizado, sempre os dois`)
    console.log(`      A soma do par se move sem o meio se mover. Δ que sobrevive à normalização é informação;`)
    console.log(`      Δ que some é spread do livro. Sobrepreço não é defeito de coleta e não bloqueia captura.`)
    console.log()
    for (const [slug, lados] of pares) {
      const p = parBinario(lados)
      console.log(`      ${slug}`)
      if (!p) {
        console.log(`        (sem leitura certificada dos dois lados: o par não se calcula, e supor seria inventar)\n`)
        continue
      }
      if (!p.ehPar) {
        // ⛔ Declarar em voz alta, nunca sumir com a linha: sumir se lê como
        // "não há nada a dizer sobre este livro", e há.
        console.log(
          `        ⛔ os dois lados somam ${p.somaAgora.toFixed(2)}%, longe de 100: isto NÃO é par binário.` +
            ` São dois desfechos de um livro com mais de dois, e normalizar aqui inventaria 50/50.\n`
        )
        continue
      }
      const gravadoEm = (lados[0].fimGravado ?? '').slice(0, 16).replace('T', ' ')
      const sinal = (x) => (x == null ? '   n/d' : `${x >= 0 ? '+' : ''}${x.toFixed(2)}pp`)
      console.log(
        `        soma do par   ${p.somaAntes == null ? 'n/d' : p.somaAntes.toFixed(2) + '%'}` +
          ` (último gravado, ${gravadoEm} UTC)  ->  ${p.somaAgora.toFixed(2)}% (certificada)   ${sinal(p.deltaSoma)}`
      )
      for (const l of p.lados) {
        console.log(
          `        ${l.outcome.padEnd(14)} cru ${l.antes == null ? '  n/d' : l.antes.toFixed(2)} -> ${l.agora.toFixed(2)}  ${sinal(l.deltaCru)}` +
            `   |   normalizado ${l.normAntes == null ? '  n/d' : l.normAntes.toFixed(2)} -> ${l.normAgora.toFixed(2)}  ${sinal(l.deltaNorm)}`
        )
      }
      if (p.discordam) {
        console.log(`        ⚠️ as duas leituras DISCORDAM neste livro: um lado parado no cru andou no normalizado,`)
        console.log(`           ou os sinais se opõem. Escrever o Δ cru sozinho aqui descreve o LIVRO, não a disputa.`)
      }
      console.log()
    }
  }

  /**
   * 📅 O CAMINHO DIÁRIO, criado em 10/Set/2026 a pedido do /weekly-usa.
   *
   * A edição semanal não pergunta a FAIXA da série, pergunta o que aconteceu
   * NESTA semana e EM QUE DIA. Isso vinha sendo montado à mão toda quinta, e a
   * saída natural era a rota `/api/market/history`, que é justamente a que trava
   * em 90 dias e COLA as séries de Câmara e Senado, porque os dois livros guardam
   * o desfecho com o mesmo nome. O backup já está lido aqui, então o caminho sai
   * sem uma requisição a mais e sem a armadilha do nome.
   *
   * 📌 O ponto do dia é o ÚLTIMO gravado naquele dia, e o de hoje é a leitura
   * CERTIFICADA quando ela existe. Misturar fechamento com meio de dia faria o
   * último degrau parecer movimento, e o fechamento do dia já esconde topo e piso
   * por conta própria: quem quiser extremo olha a faixa, não este caminho.
   */
  const desde = arg('desde')
  if (desde) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(desde)) {
      console.log(`   ⚠️ --desde precisa ser uma data YYYY-MM-DD, veio "${desde}": caminho não impresso.\n`)
    } else {
      console.log(`   📅 CAMINHO DIÁRIO desde ${desde} · fechamento de cada dia, e hoje a certificada`)
      console.log(`      ⛔ para superlativo vale a FAIXA da série acima, não este recorte.`)
      console.log()
      for (const chave of [...livros.keys()].sort()) {
        const [slug, outcome] = chave.split('\u241f')
        const pontos = livros.get(chave).filter((p) => String(p.t).slice(0, 10) >= desde)
        const fechamento = new Map()
        for (const p of pontos.sort((a, b) => String(a.t).localeCompare(String(b.t)))) {
          fechamento.set(String(p.t).slice(0, 10), p.v)
        }
        const hojeCert = agora.get(chave)
        const diaDeHoje = (carimbo ?? new Date().toISOString()).slice(0, 10)
        if (hojeCert != null) fechamento.set(diaDeHoje, hojeCert)
        const dias = [...fechamento.keys()].sort()
        if (dias.length < 2) {
          console.log(`      ${slug} · ${outcome}`)
          console.log(`        (menos de dois dias no recorte: não há caminho a descrever)\n`)
          continue
        }
        console.log(`      ${slug} · ${outcome}`)
        let anterior = null
        for (const d of dias) {
          const v = fechamento.get(d)
          const delta = anterior == null ? null : v - anterior
          const marca = d === diaDeHoje && hojeCert != null ? '  (certificada)' : ''
          const mexeu = delta != null && Math.abs(delta) >= 0.005 ? ' ←' : ''
          console.log(
            `        ${d}   ${v.toFixed(2).padStart(6)}` +
              `   ${delta == null ? '     ' : (delta >= 0 ? '+' : '') + delta.toFixed(2) + 'pp'}${mexeu}${marca}`
          )
          anterior = v
        }
        const total = fechamento.get(dias[dias.length - 1]) - fechamento.get(dias[0])
        console.log(`        Δ no período: ${total >= 0 ? '+' : ''}${total.toFixed(2)}pp em ${dias.length} dia(s) com ponto\n`)
      }
    }
  }

  if (alertas) {
    console.log(`   ⛔ ${alertas} série(s) em que consultar a API produziria superlativo FALSO sem dar erro.\n`)
  } else {
    console.log(`   ✅ nenhuma série ultrapassa a janela de ${diasApi}d: aqui a API serviria.\n`)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) principal()
