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
import {
  MARCADOR,
  datasDe,
  datasDoTemaEmHtml,
  trechoDaData,
  veredito,
  VEREDITOS,
  ORDEM,
} from '../lib/us-polls/defasagem.mjs'

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

/**
 * 📌 O marcador do tema, a leitura de datas e a regra do veredicto moram em
 * `lib/us-polls/defasagem.mjs` desde 07/Set/2026, e não aqui.
 *
 * O motivo é de teste, não de arrumação: este arquivo tem `await` no topo, então
 * importá-lo é executá-lo, e executá-lo é ir à rede. Enquanto a regra vivia aqui,
 * ela era a única desta casa sem caso plantado, e foi ela que errou em 07/Set.
 * A prova está em `scripts/testar-defasagem-us.mjs`.
 */

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
  // No RSS a data e o assunto vêm do MESMO item; no HTML a amarração é inferida.
  let granularidade = 'item', textoDaPagina = null
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
    datas = datasDe(r.texto, HOJE)
    falaDoTema = MARCADOR.test(r.texto)
    /**
     * 🔴 AQUI MORAVA O DEFEITO DE 07/Set/2026, e ele era uma linha.
     *
     * A versão antiga era `datasDoTema = falaDoTema ? datas : []`, ou seja: se o
     * tema aparecia em QUALQUER lugar da página, TODA data da página virava data
     * do tema. O comentário de então dizia que em HTML não dava para amarrar data
     * a item, e isso é falso: dá por PROXIMIDADE.
     *
     * O caso que derrubou a linha foi a Big Data Poll. A data mais nova, 27/Ago,
     * é de um post sobre TPS de haitianos em Springfield, Ohio, e o "Generic
     * Ballot" é um link permanente do catálogo de projetos. POSSIVEL NOVIDADE
     * todo dia, para sempre, sem uma pesquisa nova existir.
     */
    datasDoTema = datasDoTemaEmHtml(r.texto, HOJE)
    textoDaPagina = r.texto
    granularidade = 'proximidade'
  }

  /**
   * O CONTROLE POSITIVO e a TOLERÂNCIA moram em `lib/us-polls/defasagem.mjs`,
   * com o porquê de cada número. Em resumo: página com menos de 3 datas não foi
   * lida, e 7 dias absorvem a diferença entre fim de campo e data de publicação.
   */
  const res = veredito({ conhecido, datas, datasDoTema, temaNaPagina: falaDoTema, granularidade })

  linhas.push({
    casa: casa.nome, veredicto: res.veredicto, conhecido, maisRecente: res.maisRecente,
    tema: falaDoTema, temaAte: res.maisRecenteTema, datas: datas.length, bytes: r.bytes, via,
    // O trecho em volta da data mais nova, para o humano decidir sem abrir o navegador.
    trecho: textoDaPagina && res.maisRecente ? trechoDaData(textoDaPagina, res.maisRecente, HOJE) : null,
  })
}

linhas.sort((a, b) => (ORDEM[a.veredicto] ?? 9) - (ORDEM[b.veredicto] ?? 9))

for (const l of linhas) {
  const cab = `  ${l.veredicto.padEnd(20)} ${l.casa.slice(0, 28).padEnd(30)}`
  if (l.veredicto === 'INACESSIVEL') { console.log(cab + `${l.detalhe}`); continue }
  console.log(cab +
    `temos ${l.conhecido || '-'} | tema ate ${l.temaAte || '-'} | fonte ate ${l.maisRecente || '-'} | ${l.datas} datas | via ${l.via}`)
  /**
   * ⭐ O TRECHO É O ATALHO. Sem ele o veredicto mandava "abrir a pagina a mao", e
   * em 07/Set abrir custou quatro requisicoes para descobrir que o item mais novo
   * da Big Data Poll era uma pesquisa local de Ohio. A linha do item resolve isso
   * em cinco segundos, e so aparece onde ha decisao humana a tomar.
   */
  if (l.trecho && (l.veredicto === VEREDITOS.POSSIVEL_NOVIDADE || l.veredicto === VEREDITOS.TEMA_LONGE)) {
    console.log(`${' '.repeat(23)}item de ${l.maisRecente}: ...${l.trecho.slice(-170)}`)
  }
}

const novidades = linhas.filter((l) => l.veredicto === VEREDITOS.POSSIVEL_NOVIDADE)
const temaLonge = linhas.filter((l) => l.veredicto === VEREDITOS.TEMA_LONGE)
const inconclusivos = linhas.filter((l) => l.veredicto === 'INCONCLUSIVO' || l.veredicto === 'INACESSIVEL')
const emDia = linhas.length - novidades.length - temaLonge.length - inconclusivos.length

console.log('')
console.log(`resumo: ${novidades.length} possivel(is) novidade(s), ${temaLonge.length} com tema longe da data, ${inconclusivos.length} sem veredicto, ${emDia} em dia`)
console.log('')
if (novidades.length) {
  console.log('POSSIVEL NOVIDADE quer dizer: o ITEM mais novo da pagina fala do tema E e mais novo que a nossa base.')
  console.log('NAO e pesquisa confirmada. Conferir o trecho impresso acima antes de qualquer coisa.')
} else {
  console.log('Nenhuma casa acessivel mostrou item do tema mais novo que a nossa base.')
}
if (temaLonge.length) {
  console.log('')
  console.log('TEMA LONGE DA DATA: a pagina tem post mais novo que a nossa base, e o tema aparece nela,')
  console.log('mas a mais de 200 caracteres de qualquer data nova. Tipicamente e link de catalogo ou de menu.')
  console.log('NAO e "em dia" nem alarme: e o conferidor dizendo que nao amarra os dois. O trecho acima decide.')
}
if (inconclusivos.length) {
  console.log('')
  console.log('SEM VEREDICTO nao e "nada novo": e o conferidor declarando que nao enxerga aquela pagina.')
  console.log('Essas casas seguem sem cobertura e precisam de olho humano.')
}
console.log('')
console.log('Morning Consult fica FORA por desenho: o tracker de congressional ballot e produto pago.')
