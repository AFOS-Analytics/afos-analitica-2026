/**
 * CONFERIDOR DE DEFASAGEM: o instituto publicou algo que a Wikipédia ainda não indexou?
 *
 * ⚠️ POR QUE ESTE SCRIPT EXISTE. O generic ballot do AFOS é coletado da Wikipédia,
 * que é ÍNDICE e não fonte. Em 19/Ago/2026 o André perguntou se a coleta estava
 * trazendo o que existe, e a resposta honesta era "a Wikipédia não tem nada mais
 * novo que 04/Ago", que é diferente de "nenhum instituto publicou desde 04/Ago".
 * Este script mede a diferença entre as duas frases.
 *
 * 🔑 O QUE ELE NÃO É. Ele NÃO coleta pesquisa e NÃO alimenta o painel. Ele é um
 * detector de atraso de indexação, e o resultado dele é um ALERTA para ir olhar
 * à mão, nunca um dado publicável.
 *
 * ⛔ A TRAVA QUE FAZ ELE VALER ALGUMA COISA: o CONTROLE POSITIVO.
 *
 * Um conferidor que varre uma página e não acha nada tem dois desfechos
 * indistinguíveis: "não há nada novo" e "eu não sei ler esta página". Sem separar
 * os dois, "nada novo" é uma frase vazia que dá falsa tranquilidade.
 *
 * Então, para cada casa, ele primeiro procura a pesquisa que o AFOS JÁ TEM. Se
 * não achar nem essa, o veredicto daquela casa é INCONCLUSIVO, e é declarado como
 * tal. Só quem passa no controle positivo pode dizer EM DIA.
 *
 * 📌 Morning Consult fica de fora de propósito: o tracker de congressional ballot
 * dela é produto pago e a página pública não lista a série.
 *
 * Uso:  node scripts/check-us-polls-defasagem.mjs
 */
import { readFileSync } from 'fs'

const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'
const HOJE = new Date().toISOString().slice(0, 10)

/**
 * Cada casa aponta para a PÁGINA DE LISTAGEM dela, não para uma pesquisa
 * específica: é ali que uma divulgação nova apareceria primeiro.
 */
/**
 * ⭐ RSS QUANDO EXISTE, e a razão é que ele resolve o defeito central deste
 * script. Página de listagem moderna não renderiza sem JavaScript, então raspar
 * HTML devolve zero data e o veredicto vira INCONCLUSIVO. O feed traz `pubDate`
 * em formato declarado, que é exatamente o dado que se quer.
 *
 * Medido em 19/Ago: das seis casas ilegíveis por HTML, TRÊS tinham feed, entre
 * elas o YouGov, que é a que mais publica generic ballot na nossa base.
 */
const CASAS = [
  { nome: 'The Economist/YouGov', rss: 'https://today.yougov.com/rss', url: 'https://today.yougov.com/topics/politics' },
  { nome: 'Reuters/Ipsos', rss: 'https://www.ipsos.com/en-us/rss.xml', url: 'https://www.ipsos.com/en-us' },
  { nome: 'Emerson College', rss: 'https://emersoncollegepolling.com/feed/', url: 'https://emersoncollegepolling.com/category/national/' },
  { nome: 'Big Data Poll (R)', url: 'https://www.bigdatapoll.com' },
  { nome: 'Focaldata/Financial Times', url: 'https://www.focaldata.com', alias: ['Focaldata'] },
  { nome: 'Quantus Insights (R)', url: 'https://quantusinsights.org/polling' },
  { nome: 'Quinnipiac University', url: 'https://poll.qu.edu/poll-release' },
  { nome: 'McLaughlin & Associates (R)', url: 'https://mclaughlinonline.com/category/polls/' },
]

/** Marcadores de que a página fala do voto para o Congresso, e não de outra pesquisa. */
const MARCADOR = /generic (?:congressional )?ballot|congressional ballot|congressional vote|house of representatives|midterm (?:election|vote|ballot)|control of congress/i

const MESES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7,
  august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
}

/** Datas em qualquer das formas que estes sites usam. Devolve YYYY-MM-DD. */
function datasDe(txt) {
  const out = new Set()
  for (const m of txt.matchAll(/\b([A-Z][a-z]{2,8})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(20\d{2})/g)) {
    const mes = MESES[m[1].toLowerCase()]
    if (mes) out.add(`${m[3]}-${String(mes).padStart(2, '0')}-${String(+m[2]).padStart(2, '0')}`)
  }
  for (const m of txt.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) out.add(`${m[1]}-${m[2]}-${m[3]}`)
  for (const m of txt.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/g)) {
    out.add(`${m[3]}-${String(+m[1]).padStart(2, '0')}-${String(+m[2]).padStart(2, '0')}`)
  }
  // Data futura é lixo de template ou de calendário eleitoral: não serve de sinal.
  return [...out].filter((d) => d <= HOJE).sort()
}

async function baixar(url, cru = false) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 30_000)
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: ctrl.signal, redirect: 'follow' })
    if (!res.ok) return { erro: `HTTP ${res.status}` }
    const html = await res.text()
    // XML de feed não pode passar pelo removedor de tags: é ele que carrega o dado
    if (cru) return { texto: html, bytes: html.length }
    // tags fora, entidades básicas resolvidas: o que sobra é o texto que um leitor vê
    const texto = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'")
      .replace(/\s+/g, ' ')
    return { texto, bytes: html.length }
  } catch (e) {
    return { erro: e instanceof Error ? e.message : String(e) }
  } finally { clearTimeout(t) }
}

const base = JSON.parse(readFileSync('public/us-polls-data.json', 'utf8'))
const nossoMaisRecente = {}
for (const p of base.polls) {
  const k = p.instituto
  if (!nossoMaisRecente[k] || p.campoFim > nossoMaisRecente[k]) nossoMaisRecente[k] = p.campoFim
}
const baseMaisRecente = base.polls.map((p) => p.campoFim).sort().pop()

console.log('CONFERIDOR DE DEFASAGEM — instituto x indice')
console.log(`base do AFOS: campo mais recente ${baseMaisRecente} | media D+${base.mediaAfos.vantagemDem}`)
console.log('')

const linhas = []
for (const casa of CASAS) {
  const conhecido = nossoMaisRecente[casa.nome] ||
    (casa.alias || []).map((a) => nossoMaisRecente[a]).find(Boolean)

  // RSS primeiro: `pubDate` é data declarada, não data raspada de texto.
  let datas = [], datasDoTema = [], falaDoTema = false, via = 'html', r
  if (casa.rss) {
    r = await baixar(casa.rss, true)
    if (!r.erro) {
      const itens = [...r.texto.matchAll(/<item[\s\S]*?<\/item>/gi)].map((m) => m[0])
      const comData = itens
        .map((it) => {
          const pd = (it.match(/<pubDate>([^<]+)<\/pubDate>/i) || [])[1]
          const d = pd ? new Date(pd) : null
          return { iso: d && !isNaN(+d) ? d.toISOString().slice(0, 10) : null, texto: it }
        })
        .filter((x) => x.iso && x.iso <= HOJE)
      if (comData.length) {
        via = 'rss'
        datas = [...new Set(comData.map((x) => x.iso))].sort()
        /**
         * 🔴 A DATA TEM QUE SER A DO ITEM QUE FALA DO TEMA, e não a mais recente
         * do feed com o tema achado em qualquer lugar.
         *
         * Medido em 19/Ago no feed da Emerson: os itens de 13/Ago e 06/Ago são
         * pesquisas ESTADUAIS, do Texas e de Iowa, e o último generic ballot
         * NACIONAL é de 23/Jul. Somando "data mais nova de todas" com "tema
         * existe em algum item", o veredicto saiu POSSIVEL NOVIDADE e era falso:
         * a casa está em dia.
         *
         * Casa que publica muito estadual dispararia alarme toda semana, e alarme
         * que sempre toca é alarme que ninguém escuta.
         */
        const comTema = comData.filter((x) => MARCADOR.test(x.texto))
        falaDoTema = comTema.length > 0
        datasDoTema = [...new Set(comTema.map((x) => x.iso))].sort()
      }
    }
  }

  if (via === 'html') {
    r = await baixar(casa.url)
    if (r.erro) {
      linhas.push({ casa: casa.nome, veredicto: 'INACESSIVEL', detalhe: r.erro, conhecido })
      continue
    }
    datas = datasDe(r.texto)
    falaDoTema = MARCADOR.test(r.texto)
    // Em HTML não dá para amarrar data ao item com segurança, então a data do
    // tema é a do conjunto e o veredicto fica declaradamente mais frouxo.
    datasDoTema = falaDoTema ? datas : []
  }

  /**
   * CONTROLE POSITIVO, versão 2. A primeira versão só exigia que existisse
   * ALGUMA data igual ou posterior à que temos, e isso passava por acidente.
   *
   * 🔴 Medido em 19/Ago no índice de política do YouGov: 566 KB de HTML, 167 KB
   * de texto visível e DUAS ocorrências da MESMA data. O controle deu "passou" e
   * o veredicto saiu POSSIVEL NOVIDADE, quando o fato é que aquela página não
   * renderiza sem JavaScript e o conferidor não estava lendo nada.
   *
   * 🔑 Página de listagem que rendeu MENOS DE 3 datas não foi lida. Uma listagem
   * de verdade tem uma data por item. O piso não é rigor estatístico, é o mínimo
   * que distingue "li a lista" de "peguei um carimbo solto no rodapé".
   */
  const DATAS_MIN = 3
  const leuAPagina = datas.length >= DATAS_MIN
  const passouControle = leuAPagina && !!conhecido && datas.some((d) => d >= conhecido)
  const maisRecente = datas.length ? datas[datas.length - 1] : null
  // A data que decide é a do item que fala do tema, não a do feed inteiro.
  const maisRecenteTema = datasDoTema.length ? datasDoTema[datasDoTema.length - 1] : null

  /**
   * 🔴 GRANDEZAS DIFERENTES DOS DOIS LADOS, e ignorar isso faz o alarme tocar
   * todo dia. A nossa base guarda FIM DE CAMPO; o feed do instituto dá DATA DE
   * PUBLICAÇÃO, que vem sempre depois. Comparar as duas cruas transforma a MESMA
   * pesquisa em "novidade".
   *
   * Medido em 19/Ago sobre quatro casos que eu confirmei à mão: Emerson 3 dias,
   * Big Data Poll 1, Quantus 1, YouGov 1. A maior defasagem foi de 3 dias, então
   * 7 é folgado e ainda deixa passar atraso de indexação de verdade, que é o que
   * este script existe para achar.
   *
   * ⚠️ A tolerância NÃO conserta a diferença de grandeza, só a torna inofensiva
   * no uso. Se algum dia se quiser comparar direito, o caminho é extrair o campo
   * do texto do item, não afrouxar mais o limiar.
   */
  const TOLERANCIA_DIAS = 7
  const diasDepois = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000)

  let veredicto
  if (!conhecido) veredicto = 'SEM BASE'
  else if (!passouControle) veredicto = 'INCONCLUSIVO'
  else if (maisRecenteTema && diasDepois(conhecido, maisRecenteTema) > TOLERANCIA_DIAS) veredicto = 'POSSIVEL NOVIDADE'
  else if (!falaDoTema) veredicto = 'SEM ITEM DO TEMA'
  else veredicto = 'EM DIA'

  linhas.push({
    casa: casa.nome, veredicto, conhecido, maisRecente,
    tema: falaDoTema, temaAte: maisRecenteTema, datas: datas.length, bytes: r.bytes, via,
  })
}

const ORDEM = { 'POSSIVEL NOVIDADE': 0, INCONCLUSIVO: 1, INACESSIVEL: 2, 'SEM ITEM DO TEMA': 3, 'SEM BASE': 4, 'EM DIA': 5 }
linhas.sort((a, b) => (ORDEM[a.veredicto] ?? 9) - (ORDEM[b.veredicto] ?? 9))

for (const l of linhas) {
  const cab = `  ${l.veredicto.padEnd(20)} ${l.casa.slice(0, 28).padEnd(30)}`
  if (l.veredicto === 'INACESSIVEL') { console.log(cab + `${l.detalhe}`); continue }
  console.log(cab +
    `temos ${l.conhecido || '-'} | tema ate ${l.temaAte || '-'} | fonte ate ${l.maisRecente || '-'} | ${l.datas} datas | via ${l.via}`)
}

const novidades = linhas.filter((l) => l.veredicto === 'POSSIVEL NOVIDADE')
const inconclusivos = linhas.filter((l) => l.veredicto === 'INCONCLUSIVO' || l.veredicto === 'INACESSIVEL')

console.log('')
console.log(`resumo: ${novidades.length} possivel(is) novidade(s), ${inconclusivos.length} sem veredicto, ${linhas.length - novidades.length - inconclusivos.length} em dia`)
console.log('')
if (novidades.length) {
  console.log('POSSIVEL NOVIDADE quer dizer: a pagina tem data mais nova que a nossa base E fala do tema.')
  console.log('NAO e pesquisa confirmada. Abrir a pagina a mao antes de qualquer coisa.')
} else {
  console.log('Nenhuma casa acessivel mostrou data mais nova que a nossa base.')
}
if (inconclusivos.length) {
  console.log('')
  console.log('SEM VEREDICTO nao e "nada novo": e o conferidor declarando que nao enxerga aquela pagina.')
  console.log('Essas casas seguem sem cobertura e precisam de olho humano.')
}
console.log('')
console.log('Morning Consult fica FORA por desenho: o tracker de congressional ballot e produto pago.')
