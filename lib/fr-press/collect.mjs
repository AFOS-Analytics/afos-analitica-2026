/**
 * Imprensa da presidencial francesa de 2027, com LISTA FIXA de veículos.
 * Criado 08/Nov/2026. Molde: `lib/us-press/collect.mjs`, cujas regras valem
 * aqui inteiras:
 *
 *  - entra automático, mas SÓ de veículo da lista abaixo; a lista está no
 *    código e vale igual em toda rodada;
 *  - ⛔ NENHUM rótulo de inclinação política (decisão do André, 01/Ago/2026).
 *    O `tipo` é fato sobre o que a organização é, não juízo sobre onde se
 *    posiciona;
 *  - não resume, não interpreta, não escolhe por relevância: lista o que os
 *    veículos publicaram, com link para a matéria;
 *  - TRÊS trilhos: disputa (a corrida), método (o instrumento: pesquisa,
 *    mercado de previsão, a ANJ e a Commission des sondages) e o teto por
 *    veículo.
 *
 * ⚠️ LISTA PROVISÓRIA, para o André aprovar. Ela foi montada em 08/Nov/2026 a
 * partir de duas medições: os RSS que responderam com matéria do dia e os
 * nomes que o Google News FR mais devolveu para "présidentielle 2027" (BFM 27,
 * Le Parisien 18, Le Figaro 16, TF1 Info 11, Le Monde.fr 8...).
 *
 * 🔤 Coleta só na língua de origem. O painel sai em EN, PT-BR e ES (decisão do
 * André, 08/Nov/2026); a manchete fica em francês, como a fonte a escreveu.
 */

import { chaveTitulo, separarTitulo, tag } from '../press/rss.mjs'

/**
 * `casa` é o nome mostrado. `nomes` são as grafias com que o Google News FR
 * devolve o veículo no campo `source` (medidas em 08/Nov/2026): o filtro casa
 * por elas, e sem a grafia exata a matéria cai como "fora da lista".
 */
export const VEICULOS = [
  // Jornais de referência, nacionais.
  { casa: 'Le Monde', tipo: 'jornal', nomes: ['Le Monde', 'Le Monde.fr'], feed: 'https://www.lemonde.fr/politique/rss_full.xml' },
  { casa: 'Le Figaro', tipo: 'jornal', nomes: ['Le Figaro'], feed: 'https://www.lefigaro.fr/rss/figaro_politique.xml' },
  { casa: 'Libération', tipo: 'jornal', nomes: ['Libération'], feed: 'https://www.liberation.fr/arc/outboundfeeds/rss-all/category/politique/?outputType=xml' },
  { casa: 'Le Parisien', tipo: 'jornal', nomes: ['Le Parisien'], feed: 'https://www.leparisien.fr/politique/rss.xml' },
  { casa: 'Les Echos', tipo: 'jornal', nomes: ['Les Echos'] },
  { casa: "L'Opinion", tipo: 'jornal', nomes: ["L'Opinion", "l'Opinion"], feed: 'https://www.lopinion.fr/politique.rss' },
  { casa: '20 Minutes', tipo: 'jornal', nomes: ['20 Minutes'], feed: 'https://www.20minutes.fr/feeds/rss-politique.xml' },

  // Imprensa regional: a maior circulação do país.
  { casa: 'Ouest-France', tipo: 'regional', nomes: ['Ouest-France'], feed: 'https://www.ouest-france.fr/rss/france' },

  // Televisão e rádio, públicas e privadas.
  { casa: 'franceinfo', tipo: 'tv/rádio', nomes: ['franceinfo', 'Franceinfo', 'France Info'], feed: 'https://www.francetvinfo.fr/politique.rss' },
  { casa: 'France 24', tipo: 'tv/rádio', nomes: ['France 24'], feed: 'https://www.france24.com/fr/france/rss' },
  { casa: 'BFMTV', tipo: 'tv/rádio', nomes: ['BFM', 'BFMTV', 'BFM TV'], feed: 'https://www.bfmtv.com/rss/politique/' },
  { casa: 'TF1 Info', tipo: 'tv/rádio', nomes: ['TF1 Info', 'TF1INFO'] },
  { casa: 'CNews', tipo: 'tv/rádio', nomes: ['CNews'] },
  { casa: 'RTL', tipo: 'tv/rádio', nomes: ['RTL'] },
  { casa: 'Europe 1', tipo: 'tv/rádio', nomes: ['Europe 1'] },
  { casa: 'Public Sénat', tipo: 'tv/rádio', nomes: ['Public Sénat'] },

  // Revistas semanais.
  { casa: "L'Express", tipo: 'revista', nomes: ["L'Express"], feed: 'https://www.lexpress.fr/arc/outboundfeeds/rss/politique.xml' },
  { casa: 'Le Point', tipo: 'revista', nomes: ['Le Point'] },
  { casa: 'Marianne', tipo: 'revista', nomes: ['Marianne'] },
  { casa: 'Le JDD', tipo: 'revista', nomes: ['lejdd.fr', 'Le JDD', 'Le Journal du dimanche'] },

  // Nativos digitais.
  { casa: 'Mediapart', tipo: 'digital', nomes: ['Mediapart'] },
  { casa: 'Le HuffPost', tipo: 'digital', nomes: ['Le HuffPost', 'HuffPost France'] },

  // Imprensa especializada em política e Europa.
  { casa: 'Politico Europe', tipo: 'especializada', nomes: ['POLITICO Europe', 'Politico Europe', 'Politico.eu'], feed: 'https://www.politico.eu/section/politics/feed/' },
  { casa: 'Le Grand Continent', tipo: 'especializada', nomes: ['Le Grand Continent'], feed: 'https://legrandcontinent.eu/fr/feed/' },
]

const VEICULOS_COM_FEED = VEICULOS.filter((v) => v.feed)

/** grafia do Google News → nome mostrado */
const CASA_POR_NOME = new Map(VEICULOS.flatMap((v) => v.nomes.map((n) => [n.toLowerCase(), v.casa])))

// ─── Trilho 1: DISPUTA ───────────────────────────────────────────────────────
//
// Deliberadamente ESTREITO, como nos EUA: melhor perder matéria do que encher a
// seção de política geral. Porta explícita: a eleição nomeada.
//
// ⚠️ 12/Nov/2026 (EVAL): `2027` solto e `présidentielle` solta abriam a porta
// para o que não é a corrida. Medido na rodada ao vivo de 12/Nov: três títulos
// de "Budget 2027" (o projeto de lei de finanças) saíram como 'disputa'. Por
// isso as duas portas largas ficam separadas, cada uma com o seu veto.
const E_PRESIDENTIELLE = /[ée]lys[ée]e 2027|premier tour|second tour|parrainages|primaire (?:de la droite|de la gauche|du centre|commune|ouverte)/i
const PRESIDENTIELLE = /pr[ée]sidentielle/i
// Usos de "présidentielle" que não são a eleição. Saem do título antes do teste,
// para que "majorité présidentielle ... présidentielle 2027" continue entrando.
const PRESIDENTIELLE_NAO_ELEITORAL = /gr[âa]ce pr[ée]sidentielle|majorit[ée] pr[ée]sidentielle/gi
const ANO_2027 = /\b2027\b/
// "2027" num título de orçamento é o ano fiscal, não a eleição.
const VETO_2027 = /\b(?:budget|plf|loi de finances|projet de loi)\b/i

// Segunda porta: um candidato nomeado E uma palavra de campanha. Nome sozinho
// pega qualquer declaração de ministro; as duas juntas separam campagne de
// política geral.
const CANDIDATO = /\ble pen\b|\bbardella\b|\bphilippe\b|\battal\b|\bretailleau\b|\blisnard\b|\bm[ée]lenchon\b|\bglucksmann\b|\btondelier\b|\bruffin\b|\broussel\b|\bzemmour\b|\bvillepin\b|\bhollande\b|\bknafo\b|\bcazeneuve\b|\bbouamrane\b/i
//
// ⚠️ `\b` não serve antes de "é": para o JS, "é" não é caractere de palavra, e
// `\b[ée]lecteurs` só casava a grafia SEM acento, que a imprensa francesa não
// usa. Os dois termos com "é" inicial usam fronteira por letra Unicode (flag u).
const CAMPANHA = /\bcandidat|\bcampagne\b|\bsondage|\bintentions? de vote|\bprogramme\b|\bmeeting\b|\binvestiture\b|\bprimaire\b|\bduel\b|\bcourse\b|\bqualifi|(?<![\p{L}\p{N}])[ée]lecteurs?(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])[ée]ligibilit|\bcassation\b/iu

function ehDisputa(titulo) {
  if (E_PRESIDENTIELLE.test(titulo)) return true
  if (CANDIDATO.test(titulo) && CAMPANHA.test(titulo)) return true
  if (PRESIDENTIELLE.test(titulo.replace(PRESIDENTIELLE_NAO_ELEITORAL, ''))) return true
  return ANO_2027.test(titulo) && !VETO_2027.test(titulo)
}

// ─── Trilho 2: MÉTODO (o instrumento) ────────────────────────────────────────
//
// O assunto próprio do AFOS. Na França ele já é pauta: o bloqueio da Polymarket
// pela ANJ e a pergunta "cota de aposta é pesquisa?" (Lisnard a "13%" no Le
// Parisien, outubro de 2026).
const INSTRUMENTO = /polymarket|kalshi|march[ée]s? de pr[ée]diction|sites? de pr[ée]diction|paris (?:en ligne )?sur (?:la |l')?[ée]lection|\bcotes?\b.*(?:[ée]lection|pr[ée]sidentielle)|\banj\b|autorit[ée] nationale des jeux|commission des sondages|marge d'erreur|instituts? de sondage|sondeurs?/i
const CASA_DE_PESQUISA = /\bifop\b|\belabe\b|\bodoxa\b|\bopinionway\b|harris interactive|\btoluna\b|\bcluster ?17\b|\bipsos\b|\byougov\b|\bviavoice\b|\bverian\b/i

function ehMetodo(titulo) {
  return INSTRUMENTO.test(titulo) || CASA_DE_PESQUISA.test(titulo)
}

/** `disputa` vence quando os dois casam: matéria de corrida que cita instituto continua sendo de corrida. */
export function trilhoDaMateria(titulo) {
  if (ehDisputa(titulo)) return 'disputa'
  if (ehMetodo(titulo)) return 'metodo'
  return null
}

// ─── Página que não é notícia, e o teto ──────────────────────────────────────
//
// Direto ao vivo, mapa de resultado e rastreador de pesquisa mudam sozinhos;
// como âncora de imprensa dariam a impressão de que algo aconteceu naquele dia.
// "DIRECT." no início do título é como franceinfo e BFMTV marcam o direto
// (medido em 08/Nov/2026: "DIRECT. Présidentielle : ..." escapou da 1a versão).
const NAO_E_NOTICIA = /^\s*direct\b|\ben direct\b|\blive\b|suivez|r[ée]sultats en temps r[ée]el|carte des r[ée]sultats|tous les sondages|agr[ée]gateur de sondages/i
const TETO_POR_VEICULO = 2

const CONSULTAS = [
  { id: 'presidentielle', q: 'présidentielle 2027 when:2d' },
  { id: 'sondages', q: 'sondage présidentielle 2027 when:3d' },
  { id: 'instrumento', q: '(Polymarket OR Kalshi OR "marché de prédiction") présidentielle when:7d' },
]

const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'

async function buscarGoogle(consulta) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(consulta.q)}&hl=fr&gl=FR&ceid=FR:fr`
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`Google News FR devolveu HTTP ${res.status} em ${consulta.id}`)
  const xml = await res.text()
  const itens = []
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const bloco = m[1]
    const bruto = tag(bloco, 'title')
    const link = tag(bloco, 'link')
    if (!bruto || !link || !link.startsWith('http')) continue
    const { titulo, casa } = separarTitulo(bruto)
    itens.push({ titulo, url: link, nomeFonte: tag(bloco, 'source') || casa, publicadoEm: tag(bloco, 'pubDate'), consulta: consulta.id })
  }
  return itens
}

/** RSS 2.0 ou Atom. A URL vem do `<link>` do item: é a CANÔNICA do veículo. */
async function buscarFeedProprio(veiculo, desde) {
  const res = await fetch(veiculo.feed, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml' },
    redirect: 'follow',
    signal: AbortSignal.timeout(8_000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  const itens = []
  let lidos = 0
  // Contados para o AVISO: feed que responde 200 e não rende nada (sem item, ou
  // todo item sem data) contava como feed ativo e contribuía zero em silêncio.
  // Medido em 12/Nov/2026: o Le Parisien devolve 100 itens sem tag de data.
  // A data NÃO é inventada: item sem data fica de fora, e a falha fica escrita.
  let brutos = 0
  let semData = 0
  for (const m of xml.matchAll(/<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/g)) {
    const bloco = m[1]
    const titulo = tag(bloco, 'title')
    const href = bloco.match(/<link[^>]+href="([^"]+)"/)?.[1]
    const link = href || tag(bloco, 'link')
    if (!titulo || !link || !link.startsWith('http')) continue
    brutos++
    const dataBruta = tag(bloco, 'pubDate') || tag(bloco, 'published') || tag(bloco, 'updated') || tag(bloco, 'dc:date')
    const d = dataBruta ? new Date(dataBruta) : null
    if (!d || isNaN(d.getTime())) {
      semData++
      continue
    }
    if (d < desde) continue
    lidos++
    const trilho = trilhoDaMateria(titulo)
    if (!trilho) continue
    itens.push({ titulo, url: link, casa: veiculo.casa, publicadoEm: d.toISOString(), consulta: 'feed-proprio', origem: 'feed', trilho })
  }
  let aviso = null
  if (brutos === 0) aviso = 'feed respondeu sem nenhum item legivel'
  else if (semData === brutos) aviso = `${brutos} itens sem data; nenhum aproveitado`
  else if (semData > 0) aviso = `${semData} de ${brutos} itens sem data, descartados`
  return { itens, lidos, aviso }
}

/**
 * Coleta e FILTRA pela lista. Devolve quantos ficaram de fora e por qual
 * porta cada um entrou, para a curadoria ficar medida e não suposta.
 */
export async function coletarImprensaFr({ maximo = 12, agora = new Date(), diasDeFeed = 3 } = {}) {
  const todos = []
  const falhas = []
  const desde = new Date(agora.getTime() - diasDeFeed * 24 * 3600 * 1000)

  // 1) Feeds próprios primeiro: URL canônica, e na deduplicação quem chega antes vence.
  let lidosNoFeed = 0
  const doFeed = await Promise.all(
    VEICULOS_COM_FEED.map(async (v) => {
      try {
        return await buscarFeedProprio(v, desde)
      } catch (e) {
        falhas.push(`feed:${v.casa}: ${e instanceof Error ? e.message : String(e)}`)
        return { itens: [], lidos: 0, aviso: null }
      }
    }),
  )
  for (const [i, lote] of doFeed.entries()) {
    lidosNoFeed += lote.lidos
    todos.push(...lote.itens)
    if (lote.aviso) {
      const msg = `feed:${VEICULOS_COM_FEED[i].casa}: ${lote.aviso}`
      console.warn(`[fr-press] ${msg}`)
      falhas.push(msg)
    }
  }

  // 2) Google News FR como rede para quem não tem feed (Les Echos, Le Point,
  //    HuffPost, TF1 Info...). Aqui o portão de assunto TAMBÉM vale: a consulta
  //    em francês devolve matéria regional e de opinião que não é sobre a corrida.
  let lidosNoGoogle = 0
  for (const c of CONSULTAS) {
    try {
      for (const i of await buscarGoogle(c)) {
        lidosNoGoogle++
        const casa = i.nomeFonte ? CASA_POR_NOME.get(i.nomeFonte.toLowerCase()) ?? null : null
        const trilho = trilhoDaMateria(i.titulo) ?? (c.id === 'instrumento' ? 'metodo' : null)
        todos.push({ ...i, casa, origem: 'google', trilho })
      }
    } catch (e) {
      falhas.push(`${c.id}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const naLista = todos.filter((i) => i.casa)
  const comAssunto = naLista.filter((i) => i.trilho)

  const porTitulo = new Map()
  for (const i of comAssunto) {
    const k = chaveTitulo(i.titulo)
    if (!porTitulo.has(k)) porTitulo.set(k, i)
  }

  const comData = [...porTitulo.values()]
    .map((i) => {
      const d = i.publicadoEm ? new Date(i.publicadoEm) : null
      return { ...i, publicadoEm: d && !isNaN(d.getTime()) ? d.toISOString() : null }
    })
    .filter((i) => i.publicadoEm)
    .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm))

  const acompanhamento = comData.filter((i) => NAO_E_NOTICIA.test(i.titulo))
  const noticias = comData.filter((i) => !NAO_E_NOTICIA.test(i.titulo))

  const porCasa = new Map()
  const itens = []
  for (const i of noticias) {
    const n = porCasa.get(i.casa) ?? 0
    if (n >= TETO_POR_VEICULO) continue
    porCasa.set(i.casa, n + 1)
    const { nomeFonte: _descartado, ...limpo } = i
    itens.push(limpo)
    if (itens.length >= maximo) break
  }

  return {
    pais: 'fra',
    lastUpdate: agora.toISOString().slice(0, 10),
    fetchedAt: agora.toISOString(),
    regra: 'Entram apenas matérias de veículos da lista fixa do AFOS, com link para a matéria. O AFOS não resume nem interpreta: a leitura é do veículo.',
    veiculos: VEICULOS.map(({ casa, tipo }) => ({ casa, tipo })),
    qualidade: {
      lidosEmFeedProprio: lidosNoFeed,
      lidosNoGoogle,
      naLista: naLista.length,
      foraDaLista: todos.length - naLista.length,
      semAssunto: naLista.length - comAssunto.length,
      publicados: itens.length,
      descartadosPorAcompanhamento: acompanhamento.length,
      veiculosRepresentados: porCasa.size,
      tetoPorVeiculo: TETO_POR_VEICULO,
      consultasComFalha: falhas,
      feedsProprios: VEICULOS_COM_FEED.length,
      publicadosComLinkCanonico: itens.filter((i) => i.origem === 'feed').length,
      publicadosViaGoogleNews: itens.filter((i) => i.origem !== 'feed').length,
      publicadosPorDisputa: itens.filter((i) => i.trilho === 'disputa').length,
      publicadosPorMetodo: itens.filter((i) => i.trilho === 'metodo').length,
    },
    itens,
  }
}
