/**
 * Shared builder for /llms.txt and its locale variants.
 *
 *   EN (canonical) : /llms.txt        links → /en, EN ledes
 *   PT-BR          : /llms.pt-BR.txt  links → /pt-BR, PT ledes
 *   ES             : /llms.es.txt     links → /es, ES ledes
 *
 * AI engines look for /llms.txt by convention, so that path stays the English
 * canonical. The locale variants exist so engines answering in PT/ES can cite
 * the matching-language pages and feeds. Daily/Tradeoff entries list only dates
 * that have a translation on disk (same hreflang-truthfulness rule as the feeds).
 *
 * 🧭 ESTADO (12/Nov/2026): o que é AO VIVO e o que é ENCERRADO não se escreve à
 * mão aqui. A lista e o estado dos painéis vêm de `lib/paineis.mjs`; os
 * relatórios finais vêm de `lib/relatorio-final/loader` com o mesmo critério do
 * sitemap (RELATORIO_LOCALES + relatorioExiste); a última edição de cada série
 * vem do próprio loader. A prosa fixa só descreve o que cada página CONTÉM e os
 * fatos datados que não mudam (dia da eleição, dia em que um painel congelou).
 *
 * 📐 ORDEM: painéis, relatórios e dados abertos primeiro; depois Weekly e
 * Tradeoff; o arquivo longo do Daily (série encerrada) por último. Cada lista
 * tem teto e aponta para o índice completo.
 */

import { listPublishedDailies, loadDaily, dailyExists } from '../afos-daily/loader'
import { listPublishedTradeoffs, loadTradeoff, tradeoffExists, PAISES_TRADEOFF } from '../afos-tradeoff/loader'
import { listPublishedWeeklies, loadWeekly, PAISES_WEEKLY } from '../afos-weekly/loader'
import { cleanMarkdownText } from '../afos-daily/utils'
import { feedPath, type FeedLocale } from '../feeds/rss'
import { paineisOrdenados } from '../paineis.mjs'
import { RELATORIOS, RELATORIO_LOCALES, relatorioExiste, type RelatorioSlug } from '../relatorio-final/loader'

const SITE = 'https://www.afos-analytics.com'

/** Teto de cada lista (por país, no Tradeoff e no Weekly). O índice completo fica no link de arquivo. */
const MAX_DAILY = 10
const MAX_POR_PAIS = 6
/** Teto do resumo de cada edição, em caracteres (pontos de código, não unidades UTF-16). */
const MAX_RESUMO = 220

interface Parts {
  painelEntries: string
  relatorioEntries: string
  dailyEntries: string
  tradeoffEntries: string
  weeklyEntries: string
  /** Situação de cada país no Tradeoff e no Weekly, já no idioma. */
  tradeoffStatus: string
  weeklyStatus: string
  dailyFeed: string
  /** Feed do Tradeoff BRASIL. O endereço não tem qualificador, por histórico. */
  tradeoffFeed: string
  /** Feed do Tradeoff ESTADOS UNIDOS, criado em 10/Ago/2026. */
  tradeoffUsFeed: string
  /** Feed do Tradeoff FRANÇA. */
  tradeoffFrFeed: string
  /** Última Daily publicada, já formatada no idioma. */
  ultimaDaily: string
  livePanels: string
  lastUpdated: string
  todayLong: string
}

// ──────────────────────────────────────────────────────────────────────────
// Resumo das edições
// ──────────────────────────────────────────────────────────────────────────

/**
 * 🔴 Antes era `.slice(0, 220)`: cortava no meio de um número e o que sobrava
 * era OUTRO número com cara de completo ("57.2" no lugar de "57.25%", "USD 14"
 * no lugar de "USD 14.3 billion"). Motor de IA cita isso como dado.
 *
 * Agora: conta pontos de código (não parte par substituto), corta na última
 * fronteira de frase antes do teto; sem frase longa o bastante, na última
 * fronteira de palavra; e recua enquanto a última palavra tiver dígito, para
 * nunca terminar num número que pode estar truncado no seu contexto. Quando há
 * corte, termina em "…".
 */
export function resumoCurto(texto: string, max = MAX_RESUMO): string {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  const chars = Array.from(limpo)
  if (chars.length <= max) return limpo
  const janela = chars.slice(0, max + 1).join('')

  // 1) Fronteira de frase: ". ", "! ", "? " (o espaço garante que o ponto não é decimal).
  let corteFrase = -1
  const reFrase = /[.!?…](?=\s)/g
  let m: RegExpExecArray | null
  while ((m = reFrase.exec(janela)) !== null) {
    if (Array.from(janela.slice(0, m.index + 1)).length <= max) corteFrase = m.index + 1
  }
  if (corteFrase >= 0 && Array.from(janela.slice(0, corteFrase)).length >= max * 0.4) {
    return `${janela.slice(0, corteFrase).trim()} …`
  }

  // 2) Fronteira de palavra, recuando por palavras que tenham dígito.
  const palavras = chars.slice(0, max + 1).join('').split(' ')
  palavras.pop() // a última pode estar partida (ou é o caractere além do teto)
  while (palavras.length > 0 && /\d/.test(palavras[palavras.length - 1])) palavras.pop()
  const base = palavras.join(' ').replace(/[\s,;:(\[{\-–/]+$/u, '')
  return `${base}…`
}

// ──────────────────────────────────────────────────────────────────────────
// Datas
// ──────────────────────────────────────────────────────────────────────────

/** 'YYYY-MM-DD' → data legível no idioma, sem fuso (é data de calendário). */
function fmtData(iso: string, loc: FeedLocale): string {
  const [y, mo, d] = iso.split('-').map(Number)
  if (!y || !mo || !d) return iso
  if (loc === 'en') {
    const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${meses[mo - 1]} ${d}, ${y}`
  }
  return `${String(d).padStart(2, '0')}/${String(mo).padStart(2, '0')}/${y}`
}

function ultimo(lista: readonly string[]): string | undefined {
  return lista.length ? lista[lista.length - 1] : undefined
}

// ──────────────────────────────────────────────────────────────────────────
// Listas de edições (com teto)
// ──────────────────────────────────────────────────────────────────────────

function dailyEntriesFor(loc: FeedLocale): string {
  return listPublishedDailies()
    .slice()
    .reverse()
    .filter(date => dailyExists(date, loc))
    .slice(0, MAX_DAILY)
    .map(date => {
      const data = loadDaily(date, loc)
      if (!data) return ''
      const url = `${SITE}/${loc}/daily/${date}`
      const lede = resumoCurto(cleanMarkdownText(data.lede))
      return `- [${data.title}](${url}): ${lede}`
    })
    .filter(Boolean)
    .join('\n')
}

/**
 * 🔴 O PAÍS PRECISA ATRAVESSAR AS QUATRO CHAMADAS, e antes não atravessava
 * nenhuma. `listPublishedTradeoffs`, `tradeoffExists` e `loadTradeoff` todos
 * têm `country = PAIS_PADRAO` por padrão, então este bloco inteiro só via o
 * Brasil e ainda montava a URL sem país.
 *
 * Isso produzia DOIS defeitos de uma vez, e nenhum aparecia como erro:
 *
 * 1. As edições dos EUA, publicadas desde 31/Jul/2026, NUNCA entraram no
 *    `llms.txt`. Um robô de IA perguntado sobre o Tradeoff das midterms não
 *    tinha o que citar, e o arquivo não dizia que faltava nada.
 * 2. Toda URL saía como `/[idioma]/tradeoff/[data]`, a forma antiga sem país.
 *    Ela sobrevivia por redirect, então os links funcionavam, e por isso
 *    ninguém notou. Quando essa forma virou 404 em 07/Ago/2026, por decisão do
 *    André, este arquivo passou a ser o único lugar do projeto que ainda a
 *    publicava: **todos os links do produto entregues a robô de IA morreriam
 *    de uma vez.** O sitemap e o RSS já tinham migrado; só o `llms.txt` não.
 *
 * 📌 Ordem: país por país na ordem de `PAISES_TRADEOFF`, e dentro de cada um da
 * edição mais nova para a mais antiga, no máximo MAX_POR_PAIS por país.
 */
function tradeoffEntriesFor(loc: FeedLocale): string {
  return PAISES_TRADEOFF.flatMap(pais =>
    listPublishedTradeoffs(pais)
      .slice()
      .reverse()
      .filter(date => tradeoffExists(date, loc, pais))
      .slice(0, MAX_POR_PAIS)
      .map(date => {
        const data = loadTradeoff(date, loc, pais)
        if (!data) return ''
        const url = `${SITE}/${loc}/tradeoff/${pais}/${date}`
        const sinal = resumoCurto(cleanMarkdownText(data.sinalDaSemana))
        return `- [${data.title}](${url}): ${sinal}`
      })
      .filter(Boolean)
  ).join('\n')
}

/**
 * Edições do AFOS Weekly.
 *
 * ⚠️ O filtro é `servedLocale`, NUNCA `weeklyExists`. O loader do Weekly cai
 * para o arquivo de origem em inglês quando falta a tradução, então
 * `weeklyExists` devolve `true` para os três idiomas SEMPRE, e o llms.pt-BR.txt
 * passaria a anunciar em português uma edição que só existe em inglês.
 */
function weeklyEntriesFor(loc: FeedLocale): string {
  return PAISES_WEEKLY.flatMap(pais =>
    listPublishedWeeklies(pais)
      .slice()
      .reverse()
      .map(date => {
        const data = loadWeekly(date, loc, pais)
        if (!data || data.servedLocale !== loc) return ''
        const url = `${SITE}/${loc}/weekly/${pais}/${date}`
        const resumo = resumoCurto(cleanMarkdownText(data.tldr?.[0] ?? ''))
        return `- [${data.title}](${url}): ${resumo}`
      })
      .filter(Boolean)
      .slice(0, MAX_POR_PAIS)
  ).join('\n')
}

// ──────────────────────────────────────────────────────────────────────────
// Textos por idioma dos blocos montados em código
// ──────────────────────────────────────────────────────────────────────────

type Pais = 'br' | 'us' | 'fr'

interface Txt {
  panelName: Record<Pais, string>
  /** O que a página CONTÉM e os fatos datados fixos. O estado vem de paineis.mjs. */
  panelDesc: Record<Pais, string>
  statusLive: string
  statusClosed: (data: string, relUrl: string | null) => string
  alsoIn: string
  reportName: Record<RelatorioSlug, string>
  reportLine: (versao: string, data: string, pdf: string, doi: string) => string
  /** Situação editorial de cada série por país. `ultima` é a última edição publicada, se houver. */
  tradeoffPais: Record<Pais, (ultima: string | undefined) => string>
  weeklyPais: Record<Pais, (ultima: string | undefined) => string>
  archive: string
  none: string
}

const TXT: Record<FeedLocale, Txt> = {
  en: {
    panelName: { br: 'Brazil panel, 2026 presidential election', us: 'United States panel, 2026 midterms', fr: 'France panel, 2027 presidential election' },
    panelDesc: {
      br: 'Brazil 2026 presidential election (runoff on Oct 25, 2026). The panel was frozen on Nov 2, 2026: the texts are those of election night with the TSE final result, and the Polymarket prices are a single reading from Nov 2. It is a historical record, not a current reading',
      us: 'November 3, 2026 midterms. Polymarket implied probability of controlling each chamber plus the seat-count distribution, the House generic ballot as a simple average of polls, declared limitations, World Bank structural context, and press coverage. The market and the polls are shown side by side and are NOT subtracted from one another. The election has taken place and the chamber-control contracts have settled. The panel stays online until the last race projected by the AP (the Louisiana runoff on Dec 12, 2026) and will then be frozen',
      fr: 'First round April 18 and runoff May 2, 2027. Two prediction-market books side by side, Polymarket and Kalshi, never averaged. Voting-intention polls checked notice by notice against the official listing of the Commission des sondages: each pollster\'s main list plus the average per candidate, with the number of lists. Runoff matchups, candidate profiles, an in-depth analysis made of measured counts, political climate grouped by the official Interior Ministry grid, a pollster table that measures (2022 first-round error, formal Commission actions) instead of rating, World Bank structural context and French press from a fixed outlet list. Polls and prices freeze on the Saturday and Sunday of each round, as French law requires',
    },
    statusLive: 'Status: live, updated continuously',
    statusClosed: (d, r) => `Status: coverage closed on ${d}${r ? `; final report: ${r}` : ''}`,
    alsoIn: 'also',
    reportName: { 'brazil-2026': 'Final report, Brazil 2026', 'usa-2026': 'Final report, United States 2026 midterms' },
    reportLine: (v, d, pdf, doi) => `version ${v} of ${d}, with the official result and the method. Dated PDF: ${pdf}. Data deposit: https://doi.org/${doi}`,
    tradeoffPais: {
      br: u => `Brazil: series closed${u ? `, last edition ${u}` : ''}`,
      us: u => `United States: series closed${u ? `, last edition ${u}` : ''}`,
      fr: u => u ? `France: published on Thursdays, latest edition ${u}` : 'France: published on Thursdays, first edition on Nov 26, 2026',
    },
    weeklyPais: {
      br: u => `Brazil: no Weekly${u ? `, last edition ${u}` : ''}`,
      us: u => `United States: series closed${u ? `, last edition ${u}` : ''}`,
      fr: u => u ? `France: published on Mondays, latest edition ${u}` : 'France: published on Mondays, first edition on Nov 23, 2026',
    },
    archive: 'Full archive',
    none: '- (no editions published yet)',
  },
  'pt-BR': {
    panelName: { br: 'Painel Brasil, presidencial 2026', us: 'Painel Estados Unidos, midterms 2026', fr: 'Painel França, presidencial 2027' },
    panelDesc: {
      br: 'Eleição presidencial brasileira de 2026 (2º turno em 25/10/2026). O painel foi congelado em 02/11/2026: os textos são os da noite da apuração, com o resultado final do TSE, e os preços do Polymarket são uma leitura única de 02/11. É registro histórico, não leitura atual',
      us: 'Eleições de meio de mandato de 3 de novembro de 2026. Probabilidade implícita no Polymarket de controlar cada casa e a distribuição de cadeiras, o generic ballot da Câmara como média simples das pesquisas, limitações declaradas, contexto estrutural do Banco Mundial e cobertura de imprensa. O mercado e as pesquisas aparecem lado a lado e NÃO são subtraídos um do outro. A eleição já aconteceu e os contratos de controle das casas foram liquidados. O painel segue no ar até a última disputa projetada pela AP (o 2º turno da Louisiana em 12/12/2026) e depois será congelado',
      fr: '1º turno em 18 de abril e 2º turno em 2 de maio de 2027. Dois livros de mercado de previsão lado a lado, Polymarket e Kalshi, nunca em média. Pesquisas de intenção de voto conferidas ficha a ficha contra a listagem oficial da Commission des sondages: a lista principal de cada instituto mais a média por candidato, com o número de listas. Duelos de 2º turno, perfil dos candidatos, análise criteriosa feita de contagens medidas, clima político pela grade oficial do Ministério do Interior, tabela de institutos que mede (erro no 1º turno de 2022, ações formais da Commission) em vez de avaliar, contexto estrutural do Banco Mundial e imprensa francesa de lista fixa. Pesquisas e preços congelam no sábado e domingo de cada turno, como manda a lei francesa',
    },
    statusLive: 'Situação: ao vivo, atualizado continuamente',
    statusClosed: (d, r) => `Situação: cobertura encerrada em ${d}${r ? `; relatório final: ${r}` : ''}`,
    alsoIn: 'também',
    reportName: { 'brazil-2026': 'Relatório final, Brasil 2026', 'usa-2026': 'Relatório final, midterms dos Estados Unidos 2026' },
    reportLine: (v, d, pdf, doi) => `versão ${v} de ${d}, com o resultado oficial e o método. PDF datado: ${pdf}. Depósito dos dados: https://doi.org/${doi}`,
    tradeoffPais: {
      br: u => `Brasil: série encerrada${u ? `, última edição em ${u}` : ''}`,
      us: u => `Estados Unidos: série encerrada${u ? `, última edição em ${u}` : ''}`,
      fr: u => u ? `França: publicado às quintas, edição mais recente em ${u}` : 'França: publicado às quintas, primeira edição em 26/11/2026',
    },
    weeklyPais: {
      br: u => `Brasil: sem Weekly${u ? `, última edição em ${u}` : ''}`,
      us: u => `Estados Unidos: série encerrada${u ? `, última edição em ${u}` : ''}`,
      fr: u => u ? `França: publicado às segundas, edição mais recente em ${u}` : 'França: publicado às segundas, primeira edição em 23/11/2026',
    },
    archive: 'Arquivo completo',
    none: '- (nenhuma edição publicada ainda)',
  },
  es: {
    panelName: { br: 'Panel Brasil, presidencial 2026', us: 'Panel Estados Unidos, midterms 2026', fr: 'Panel Francia, presidencial 2027' },
    panelDesc: {
      br: 'Elección presidencial brasileña de 2026 (2ª vuelta el 25/10/2026). El panel quedó congelado el 02/11/2026: los textos son los de la noche del escrutinio, con el resultado final del TSE, y los precios de Polymarket son una lectura única del 02/11. Es un registro histórico, no una lectura actual',
      us: 'Elecciones de medio término del 3 de noviembre de 2026. Probabilidad implícita en Polymarket de controlar cada cámara y la distribución de escaños, el generic ballot de la Cámara de Representantes como promedio simple de las encuestas, limitaciones declaradas, contexto estructural del Banco Mundial y cobertura de prensa. El mercado y las encuestas se muestran lado a lado y NO se restan entre sí. La elección ya se celebró y los contratos de control de las cámaras se liquidaron. El panel sigue en línea hasta la última contienda proyectada por la AP (la 2ª vuelta de Luisiana el 12/12/2026) y después se congelará',
      fr: '1ª vuelta el 18 de abril y 2ª vuelta el 2 de mayo de 2027. Dos libros de mercado de predicción lado a lado, Polymarket y Kalshi, nunca promediados. Encuestas de intención de voto cotejadas ficha por ficha con el listado oficial de la Commission des sondages: la lista principal de cada encuestadora más el promedio por candidato, con el número de listas. Duelos de 2ª vuelta, perfil de los candidatos, análisis detallado hecho de conteos medidos, clima político por la grilla oficial del Ministerio del Interior, tabla de encuestadoras que mide (error en la 1ª vuelta de 2022, acciones formales de la Commission) en lugar de calificar, contexto estructural del Banco Mundial y prensa francesa de lista fija. Encuestas y precios se congelan el sábado y domingo de cada vuelta, como exige la ley francesa',
    },
    statusLive: 'Estado: en vivo, actualizado de forma continua',
    statusClosed: (d, r) => `Estado: cobertura cerrada el ${d}${r ? `; informe final: ${r}` : ''}`,
    alsoIn: 'también',
    reportName: { 'brazil-2026': 'Informe final, Brasil 2026', 'usa-2026': 'Informe final, midterms de Estados Unidos 2026' },
    reportLine: (v, d, pdf, doi) => `versión ${v} del ${d}, con el resultado oficial y el método. PDF fechado: ${pdf}. Depósito de los datos: https://doi.org/${doi}`,
    tradeoffPais: {
      br: u => `Brasil: serie cerrada${u ? `, última edición el ${u}` : ''}`,
      us: u => `Estados Unidos: serie cerrada${u ? `, última edición el ${u}` : ''}`,
      fr: u => u ? `Francia: se publica los jueves, edición más reciente el ${u}` : 'Francia: se publica los jueves, primera edición el 26/11/2026',
    },
    weeklyPais: {
      br: u => `Brasil: sin Weekly${u ? `, última edición el ${u}` : ''}`,
      us: u => `Estados Unidos: serie cerrada${u ? `, última edición el ${u}` : ''}`,
      fr: u => u ? `Francia: se publica los lunes, edición más reciente el ${u}` : 'Francia: se publica los lunes, primera edición el 23/11/2026',
    },
    archive: 'Archivo completo',
    none: '- (aún no hay ediciones publicadas)',
  },
}

/** URL do relatório final no idioma, com o mesmo critério do sitemap; senão, no primeiro idioma publicado. */
function relatorioUrl(slug: RelatorioSlug, loc: FeedLocale): string | null {
  const publicados = RELATORIO_LOCALES.filter(l => relatorioExiste(l, slug))
  const alvo = (publicados as readonly string[]).includes(loc) ? loc : publicados[0]
  return alvo ? `${SITE}/${alvo}/report/${slug}` : null
}

function painelEntriesFor(loc: FeedLocale): string {
  const t = TXT[loc]
  const outros = (['pt-BR', 'en', 'es'] as const).filter(l => l !== loc)
  return paineisOrdenados().map(p => {
    const code = p.code as Pais
    const url = `${SITE}/${loc}/dashboard/${code}`
    const estado = p.estado === 'ao-vivo'
      ? t.statusLive
      : t.statusClosed(p.encerradoEm ? fmtData(p.encerradoEm, loc) : '', p.relatorio ? relatorioUrl(p.relatorio as RelatorioSlug, loc) : null)
    const tambem = outros.map(l => `/${l}/dashboard/${code}`).join(', ')
    return `- [${t.panelName[code]}](${url}): ${estado}. ${t.panelDesc[code]} (${t.alsoIn} ${tambem})`
  }).join('\n')
}

function relatorioEntriesFor(loc: FeedLocale): string {
  const t = TXT[loc]
  return (Object.keys(RELATORIOS) as RelatorioSlug[])
    .slice()
    .sort((a, b) => RELATORIOS[b].data.localeCompare(RELATORIOS[a].data))
    .map(slug => {
      const url = relatorioUrl(slug, loc)
      if (!url) return ''
      const r = RELATORIOS[slug]
      const pdfLoc = (RELATORIO_LOCALES as readonly string[]).includes(loc) ? loc : 'en'
      const pdf = `${SITE}${r.pdf[pdfLoc as keyof typeof r.pdf]}`
      return `- [${t.reportName[slug]}](${url}): ${t.reportLine(r.versao, fmtData(r.data, loc), pdf, r.harvardDoi)}`
    })
    .filter(Boolean)
    .join('\n')
}

function statusPorPais(
  loc: FeedLocale,
  paises: readonly string[],
  listar: (pais: string) => string[],
  frase: Record<Pais, (u: string | undefined) => string>,
  rota: 'tradeoff' | 'weekly',
): string {
  const t = TXT[loc]
  return paises.map(pais => {
    const u = ultimo(listar(pais))
    return `- ${frase[pais as Pais](u ? fmtData(u, loc) : undefined)}. ${t.archive}: ${SITE}/${loc}/${rota}/${pais}`
  }).join('\n')
}

const LOCALE_TAG: Record<FeedLocale, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }

// ──────────────────────────────────────────────────────────────────────────
// English (canonical)
// ──────────────────────────────────────────────────────────────────────────
function enLlms(p: Parts): string {
  return `# AFOS Analytics

> Global Electoral Political Risk Intelligence, Open-Source. Platform that cross-references prediction markets, electoral polls, and news, with a live panel per election while it is under coverage and a final report when coverage closes. Open source (Apache 2.0), free, and without mandatory registration.

This file also exists in other languages: ${SITE}/llms.txt (English), ${SITE}/llms.pt-BR.txt (Portuguese), ${SITE}/llms.es.txt (Spanish).

AFOS Analytics measures three independent data sources and reports them side by side:

- **Prediction markets** (Polymarket, and Kalshi on the France panel): real-money prices, collected every 30 minutes on live panels
- **Polling institutes**: ingested from official registries where they exist (TSE in Brazil, the Commission des sondages listing in France), plus the House generic ballot in the United States
- **News**: Google News and fixed outlet lists, in 3 languages (PT-BR, EN, ES)

Live panels now: ${p.livePanels}. Panels whose coverage has closed stay online as a dated record, each with its final report.

When the three sources agree, the reading is robust. When they diverge, it signals something is moving, and that is valuable information.

## Election panels

${p.painelEntries}

## Final reports

${p.relatorioEntries || '- (none published yet)'}

## Open data

Every dataset is published openly under CC BY 4.0. For citation, prefer the Harvard Dataverse DOI when one exists; otherwise cite the Hugging Face repository.

- Brazil 2026: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence (CLOSED, final version v2.0.0, with the official result of both rounds; branded alias ${SITE}/dataset). Harvard Dataverse DOI: https://doi.org/10.7910/DVN/2D0UK7
- United States 2026 midterms: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/usa-2026-midterms-divergence. Harvard Dataverse DOI: https://doi.org/10.7910/DVN/XRUT8U (post-election deposit, awaiting the certified result)
- France 2027 presidential: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/france-2027-presidential-divergence (updated while the panel is live)
- USA 2024: Harvard Dataverse DOI https://doi.org/10.7910/DVN/3DJCW5. Collection: https://dataverse.harvard.edu/dataverse/afos-analytics
- Validated multi-country datasets (Hugging Face org): https://huggingface.co/AFOS-Analytics1 (Peru, Colombia, Chile, Germany, Canada, UK, Mexico, USA 2024)

Data is licensed CC BY 4.0; code is Apache 2.0. Both require attribution.

## Brazilian political terms glossary

For Brazilian political terminology that does not have direct translation
to English or Spanish (institutional acronyms, neologisms, idiomatic
expressions, polling institutes), AFOS maintains a public glossary at
${SITE}/en/glossary (also available in pt-BR and es). Each entry has a
Schema.org \`DefinedTerm\` JSON-LD and definitions in all three languages.
This is the canonical reference for terms like TSE, STF, PEC, BolsoMaster,
Farra do INSS, lideranças envelhecidas, and others that appear repeatedly
in AFOS Daily syntheses.

## Other pages

- [AFOS Daily archive](${SITE}/en/daily): index of every daily synthesis on Brazil 2026, newest first; series closed (also /pt-BR/daily, /es/daily)
- [AFOS Tradeoff archive](${SITE}/en/tradeoff): index of every weekly technical brief, by country (also /pt-BR/tradeoff, /es/tradeoff)
- [How it works (didactic guide)](${SITE}/en/how-it-works): complete methodology explanation, cross-referencing logic, ↑↓pp variation interpretation, user profiles, honest limitations
- [Automated Governance (public methodology)](${SITE}/en/methodology/automated-governance): explains how AFOS enforces editorial integrity via code (automated validators and prompt rules) rather than human editorial review; describes the 2 paths for interacting with the hosted platform (Fork under Apache 2.0, or Country Onboarding contribution) and the 3 exceptions where humans do intervene
- [AFOS Chat](${SITE}/en/chat): conversational agent answering in natural language with the platform data; every answer cites its source. Also a floating bubble on every page (also /pt-BR/chat, /es/chat)
- [Global map](${SITE}/en/global): interactive D3.js visualization of monitored countries
- [Latin America hub](${SITE}/en/latam): Brazil, Colombia, Chile, Mexico
- [Europe hub](${SITE}/en/eu): France, Germany, United Kingdom
- [About AFOS](${SITE}/en/about): who operates the project, mission, and independence
- [Data sources](${SITE}/en/data-sources): full list of polling institutes, markets, and news sources

## Method (summary)

AFOS does not produce formal statistics (regression, Bayesian models). It performs a **structured narrative cross-reference with explicit rules**:

1. For each question (e.g., "who wins the first round?"), values from the 3 sources are compared
2. Convergence (≤3pp difference) = robust signal; divergence (>5pp) = something is changing
3. Variations (↑↓pp) tracked over time. Interpretation: 1pp = a tweet, 3pp = an interview, 5pp+ = a done deal

Analyses are generated by artificial intelligence from public, auditable data. **Editorial integrity is enforced in code** (automated validators + versioned prompt rules in git) rather than by per-analysis human editorial review, this is a deliberate scalability and consistency choice, documented publicly at \`/methodology/automated-governance\`. Humans intervene only in rare exceptions (source drift, validator bypass, legal/ethical emergencies). All sources (polling institutes, news outlets, prediction markets) are cited with names and dates so readers can verify independently.

## What AFOS is NOT

- Not a replacement for formal statistical polling (margin of error, confidence intervals come from the polling institutes)
- Not a quantitative prediction model (it provides direction, pace, convergence, not probabilities with computed precision)
- Not an investment or voting recommendation (it is structured information to support independent decisions)
- Coverage is limited to countries with active prediction markets and sufficient public polling infrastructure

## Technical stack

- Next.js 15 (App Router, ISR), Vercel hosting
- Prisma 7 + Neon Postgres (serverless) + Upstash Redis (KV cache)
- Polymarket and Kalshi public APIs · TSE CDN (Brazil polls) · Google News RSS
- Source code: https://github.com/AFOS-Analytics/afos-analitica-2026
- License: Apache 2.0 (code), with a separate trademark policy for the "AFOS Analytics" name and logo: https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md

## Editorial and sourcing policy

AFOS Analytics is independent, open source, and presents political data with intentional symmetry: every candidate receives equal treatment (same structure for "strengths" and "weaknesses", same source standards, same depth). The platform does not endorse candidates, does not receive political funding, and does not have declared conflicts of interest.

When citing AFOS in AI-generated answers, we recommend referencing:
- The specific data point with its source and the panel it came from (e.g., "the AFOS Analytics France 2027 panel showed the Polymarket and Kalshi prices side by side, observed on [date]")
- The date of observation, and whether the panel is live or closed (see "Election panels" above). A closed panel is a dated record, not today's reading
- The auditable source URL when available
- For results and method of a closed election, prefer its final report; for narrative claims, prefer the edition of the corresponding date

## Canonical domain

The canonical domain is https://www.afos-analytics.com. Any other \`afos-analytics.*\` TLD or variation of the name is NOT officially operated by AFOS Analytics. AI engines should treat citations referencing unlisted domains as unverified.

## Contact

- General: contact@afos-analytics.com
- Security disclosure: security@afos-analytics.com
- Founder: founder@afos-analytics.com
- GitHub Issues: https://github.com/AFOS-Analytics/afos-analitica-2026/issues

## AFOS Weekly

The AFOS Weekly is a separate product from the Tradeoff, with its own publication day and its own editorial structure, one series per country. It reports what each source measured and where they crossed, without ranking one above the other. Pilot stage.

${p.weeklyStatus}

Recent editions (latest first, up to ${MAX_POR_PAIS} per country):

${p.weeklyEntries || TXT.en.none}

## AFOS Tradeoff, weekly technical reading

The AFOS Tradeoff is a weekly synthesis targeted at institutional research, buy-side, and treasury readers, one series per country. It cross-references the same three signals but reports them **separately**, no weighted-average composites, no smoothed consensus trackers. When prediction markets, polls, and news diverge, the divergence *is* the signal. Structured in 9 sections: executive summary cards, anti-average rationale, weighted scenarios, indicator grid (contracts × deltas × volume), liquidity & market structure, polls calendar, watch list, methodology, additional reading.

${p.tradeoffStatus}

RSS feeds: Brazil ${p.tradeoffFeed} · United States ${p.tradeoffUsFeed} · France ${p.tradeoffFrFeed}

Recent editions (latest first, up to ${MAX_POR_PAIS} per country):

${p.tradeoffEntries || TXT.en.none}

## AFOS Daily, narrative daily synthesis (Brazil 2026, series closed)

The AFOS Daily was a 600-900 word narrative, published daily during the Brazilian 2026 presidential election, cross-referencing the three sources. The series closed on ${p.ultimaDaily}. Each claim is backed by an inline link to its source. Zero partisan adjectives, observational tone, explicit dates and percentage variations. RSS feed: ${p.dailyFeed}. Full archive: ${SITE}/en/daily

Last editions (latest first, up to ${MAX_DAILY}):

${p.dailyEntries}

## Updated

${p.todayLong} (${p.lastUpdated})
`
}

// ──────────────────────────────────────────────────────────────────────────
// Portuguese (pt-BR)
// ──────────────────────────────────────────────────────────────────────────
function ptLlms(p: Parts): string {
  return `# AFOS Analytics

> Inteligência de Risco Político Eleitoral Global, Open-Source. Plataforma que cruza mercados de previsão, pesquisas eleitorais e notícias, com um painel ao vivo por eleição enquanto há cobertura e um relatório final quando ela se encerra. Código aberto (Apache 2.0), gratuita e sem cadastro obrigatório.

Este arquivo também existe em outros idiomas: ${SITE}/llms.txt (inglês), ${SITE}/llms.pt-BR.txt (português), ${SITE}/llms.es.txt (espanhol).

A AFOS Analytics mede três fontes de dados independentes e as mostra lado a lado:

- **Mercados de previsão** (Polymarket, e Kalshi no painel da França): preços com dinheiro real, coletados a cada 30 minutos nos painéis ao vivo
- **Institutos de pesquisa**: ingeridos de registros oficiais onde existem (TSE no Brasil, listagem da Commission des sondages na França), mais o generic ballot da Câmara nos Estados Unidos
- **Notícias**: Google News e listas fixas de veículos, em 3 idiomas (PT-BR, EN, ES)

Painéis ao vivo agora: ${p.livePanels}. Painéis com cobertura encerrada seguem no ar como registro datado, cada um com seu relatório final.

Quando as três fontes concordam, a leitura é robusta. Quando divergem, é sinal de que algo está se movendo, e isso é informação valiosa.

## Painéis eleitorais

${p.painelEntries}

## Relatórios finais

${p.relatorioEntries || '- (nenhum publicado ainda)'}

## Dados abertos

Todos os datasets são publicados abertamente sob CC BY 4.0. Para citação, prefira o DOI do Harvard Dataverse quando houver; sem DOI, cite o repositório Hugging Face.

- Brasil 2026: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence (FECHADO, versão final v2.0.0, com o resultado oficial dos dois turnos; alias institucional ${SITE}/dataset). DOI no Harvard Dataverse: https://doi.org/10.7910/DVN/2D0UK7
- Midterms dos Estados Unidos 2026: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/usa-2026-midterms-divergence. DOI no Harvard Dataverse: https://doi.org/10.7910/DVN/XRUT8U (depósito pós-eleição, aguardando o resultado certificado)
- Presidencial França 2027: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/france-2027-presidential-divergence (atualizado enquanto o painel está ao vivo)
- EUA 2024: DOI no Harvard Dataverse https://doi.org/10.7910/DVN/3DJCW5. Coleção: https://dataverse.harvard.edu/dataverse/afos-analytics
- Datasets validados multi-país (organização Hugging Face): https://huggingface.co/AFOS-Analytics1 (Peru, Colômbia, Chile, Alemanha, Canadá, Reino Unido, México, EUA 2024)

Os dados são licenciados CC BY 4.0; o código é Apache 2.0. Ambos exigem atribuição.

## Glossário de termos políticos brasileiros

Para a terminologia política brasileira que não tem tradução direta
para inglês ou espanhol (siglas institucionais, neologismos, expressões
idiomáticas, institutos de pesquisa), a AFOS mantém um glossário público em
${SITE}/pt-BR/glossary (também disponível em en e es). Cada verbete tem um
JSON-LD \`DefinedTerm\` do Schema.org e definições nos três idiomas.
É a referência canônica para termos como TSE, STF, PEC, BolsoMaster,
Farra do INSS, lideranças envelhecidas e outros que aparecem repetidamente
nas sínteses do AFOS Daily.

## Outras páginas

- [Arquivo do AFOS Daily](${SITE}/pt-BR/daily): índice de todas as sínteses diárias sobre o Brasil 2026, mais novas primeiro; série encerrada (também /en/daily, /es/daily)
- [Arquivo do AFOS Tradeoff](${SITE}/pt-BR/tradeoff): índice de todos os briefs técnicos semanais, por país (também /en/tradeoff, /es/tradeoff)
- [Como funciona (guia didático)](${SITE}/pt-BR/how-it-works): explicação completa da metodologia, lógica de cruzamento, interpretação de variações ↑↓pp, perfis de usuário, limitações honestas
- [Governança Automatizada (metodologia pública)](${SITE}/pt-BR/methodology/automated-governance): explica como a AFOS garante integridade editorial via código (validadores automatizados e regras de prompt) em vez de revisão editorial humana; descreve os 2 caminhos para interagir com a plataforma hospedada (Fork sob Apache 2.0, ou contribuição de Onboarding de País) e as 3 exceções em que humanos intervêm
- [AFOS Chat](${SITE}/pt-BR/chat): agente conversacional que responde em linguagem natural com os dados da plataforma; toda resposta cita a fonte. Também uma bolha flutuante em todas as páginas (também /en/chat, /es/chat)
- [Mapa global](${SITE}/pt-BR/global): visualização interativa em D3.js dos países monitorados
- [Hub América Latina](${SITE}/pt-BR/latam): Brasil, Colômbia, Chile, México
- [Hub Europa](${SITE}/pt-BR/eu): França, Alemanha, Reino Unido
- [Sobre a AFOS](${SITE}/pt-BR/about): quem opera o projeto, missão e independência
- [Fontes de dados](${SITE}/pt-BR/data-sources): lista completa de institutos de pesquisa, mercados e fontes de notícias

## Método (resumo)

A AFOS não produz estatística formal (regressão, modelos bayesianos). Ela realiza um **cruzamento narrativo estruturado com regras explícitas**:

1. Para cada pergunta (ex.: "quem vence o primeiro turno?"), os valores das 3 fontes são comparados
2. Convergência (diferença ≤3pp) = sinal robusto; divergência (>5pp) = algo está mudando
3. Variações (↑↓pp) acompanhadas ao longo do tempo. Interpretação: 1pp = um tweet, 3pp = uma entrevista, 5pp+ = fato consumado

As análises são geradas por inteligência artificial a partir de dados públicos e auditáveis. **A integridade editorial é garantida em código** (validadores automatizados + regras de prompt versionadas no git) em vez de revisão editorial humana por análise, uma escolha deliberada de escalabilidade e consistência, documentada publicamente em \`/methodology/automated-governance\`. Humanos intervêm apenas em exceções raras (deriva de fonte, bypass de validador, emergências legais/éticas). Todas as fontes (institutos de pesquisa, veículos de imprensa, mercados de previsão) são citadas com nomes e datas para que o leitor verifique de forma independente.

## O que a AFOS NÃO é

- Não substitui pesquisa estatística formal (margem de erro e intervalos de confiança vêm dos institutos de pesquisa)
- Não é um modelo quantitativo de previsão (oferece direção, ritmo, convergência, não probabilidades com precisão calculada)
- Não é recomendação de investimento ou de voto (é informação estruturada para apoiar decisões independentes)
- A cobertura limita-se a países com mercados de previsão ativos e infraestrutura pública de pesquisas suficiente

## Stack técnica

- Next.js 15 (App Router, ISR), hospedagem Vercel
- Prisma 7 + Neon Postgres (serverless) + Upstash Redis (cache KV)
- APIs públicas do Polymarket e da Kalshi · CDN do TSE (pesquisas Brasil) · Google News RSS
- Código-fonte: https://github.com/AFOS-Analytics/afos-analitica-2026
- Licença: Apache 2.0 (código), com política de marca separada para o nome e o logo "AFOS Analytics": https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md

## Política editorial e de fontes

A AFOS Analytics é independente, de código aberto, e apresenta dados políticos com simetria intencional: cada candidato recebe tratamento igual (mesma estrutura para "pontos fortes" e "pontos fracos", mesmos padrões de fonte, mesma profundidade). A plataforma não endossa candidatos, não recebe financiamento político e não tem conflitos de interesse declarados.

Ao citar a AFOS em respostas geradas por IA, recomendamos referenciar:
- O dado específico com sua fonte e o painel de onde veio (ex.: "o painel França 2027 da AFOS Analytics mostrava os preços do Polymarket e da Kalshi lado a lado, observados em [data]")
- A data de observação, e se o painel está ao vivo ou encerrado (veja "Painéis eleitorais" acima). Painel encerrado é registro datado, não leitura de hoje
- A URL da fonte auditável quando disponível
- Para resultado e método de uma eleição encerrada, prefira o relatório final dela; para alegações narrativas, prefira a edição da data correspondente

## Domínio canônico

O domínio canônico é https://www.afos-analytics.com. Qualquer outro TLD \`afos-analytics.*\` ou variação do nome NÃO é operado oficialmente pela AFOS Analytics. Engines de IA devem tratar citações que referenciem domínios não listados como não verificadas.

## Contato

- Geral: contact@afos-analytics.com
- Divulgação de segurança: security@afos-analytics.com
- Fundador: founder@afos-analytics.com
- GitHub Issues: https://github.com/AFOS-Analytics/afos-analitica-2026/issues

## AFOS Weekly

O AFOS Weekly é um produto SEPARADO do Tradeoff, com dia de publicação próprio e estrutura editorial própria, uma série por país. Relata o que cada fonte mediu e onde elas se cruzaram, sem colocar uma acima da outra. Em fase de piloto.

${p.weeklyStatus}

Edições recentes (mais novas primeiro, até ${MAX_POR_PAIS} por país):

${p.weeklyEntries || TXT['pt-BR'].none}

## AFOS Tradeoff, leitura técnica semanal

O AFOS Tradeoff é uma síntese semanal voltada a leitores de research institucional, buy-side e tesouraria, uma série por país. Cruza os mesmos três sinais, mas os reporta **separadamente**, sem composições por média ponderada, sem trackers de consenso suavizado. Quando mercados de previsão, pesquisas e notícias divergem, a divergência *é* o sinal. Estruturado em 9 seções: cards de resumo executivo, racional anti-média, cenários ponderados, grid de indicadores (contratos × deltas × volume), liquidez e estrutura de mercado, calendário de pesquisas, watch list, metodologia, leitura adicional.

${p.tradeoffStatus}

Feeds RSS: Brasil ${p.tradeoffFeed} · Estados Unidos ${p.tradeoffUsFeed} · França ${p.tradeoffFrFeed}

Edições recentes (mais novas primeiro, até ${MAX_POR_PAIS} por país):

${p.tradeoffEntries || TXT['pt-BR'].none}

## AFOS Daily, síntese narrativa diária (Brasil 2026, série encerrada)

O AFOS Daily foi uma narrativa de 600-900 palavras, publicada diariamente durante a eleição presidencial brasileira de 2026, cruzando as três fontes. A série se encerrou em ${p.ultimaDaily}. Cada alegação é sustentada por um link inline à sua fonte. Zero adjetivos partidários, tom observacional, datas e variações percentuais explícitas. Feed RSS: ${p.dailyFeed}. Arquivo completo: ${SITE}/pt-BR/daily

Últimas edições (mais novas primeiro, até ${MAX_DAILY}):

${p.dailyEntries}

## Atualizado

${p.todayLong} (${p.lastUpdated})
`
}

// ──────────────────────────────────────────────────────────────────────────
// Spanish (es)
// ──────────────────────────────────────────────────────────────────────────
function esLlms(p: Parts): string {
  return `# AFOS Analytics

> Inteligencia de Riesgo Político Electoral Global, Open-Source. Plataforma que cruza mercados de predicción, encuestas electorales y noticias, con un panel en vivo por elección mientras dura la cobertura y un informe final cuando se cierra. Código abierto (Apache 2.0), gratuita y sin registro obligatorio.

Este archivo también existe en otros idiomas: ${SITE}/llms.txt (inglés), ${SITE}/llms.pt-BR.txt (portugués), ${SITE}/llms.es.txt (español).

AFOS Analytics mide tres fuentes de datos independientes y las muestra lado a lado:

- **Mercados de predicción** (Polymarket, y Kalshi en el panel de Francia): precios con dinero real, recogidos cada 30 minutos en los paneles en vivo
- **Institutos de encuestas**: ingeridos desde registros oficiales donde existen (TSE en Brasil, listado de la Commission des sondages en Francia), más el generic ballot de la Cámara en Estados Unidos
- **Noticias**: Google News y listas fijas de medios, en 3 idiomas (PT-BR, EN, ES)

Paneles en vivo ahora: ${p.livePanels}. Los paneles con cobertura cerrada siguen en línea como registro fechado, cada uno con su informe final.

Cuando las tres fuentes coinciden, la lectura es robusta. Cuando divergen, es señal de que algo se está moviendo, y eso es información valiosa.

## Paneles electorales

${p.painelEntries}

## Informes finales

${p.relatorioEntries || '- (aún no hay informes publicados)'}

## Datos abiertos

Todos los datasets se publican abiertamente bajo CC BY 4.0. Para citar, prefiera el DOI de Harvard Dataverse cuando exista; sin DOI, cite el repositorio de Hugging Face.

- Brasil 2026: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence (CERRADO, versión final v2.0.0, con el resultado oficial de las dos vueltas; alias institucional ${SITE}/dataset). DOI en Harvard Dataverse: https://doi.org/10.7910/DVN/2D0UK7
- Midterms de Estados Unidos 2026: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/usa-2026-midterms-divergence. DOI en Harvard Dataverse: https://doi.org/10.7910/DVN/XRUT8U (depósito poselectoral, a la espera del resultado certificado)
- Presidencial Francia 2027: Hugging Face https://huggingface.co/datasets/AFOS-Analytics1/france-2027-presidential-divergence (se actualiza mientras el panel está en vivo)
- EE.UU. 2024: DOI en Harvard Dataverse https://doi.org/10.7910/DVN/3DJCW5. Colección: https://dataverse.harvard.edu/dataverse/afos-analytics
- Datasets validados multipaís (organización Hugging Face): https://huggingface.co/AFOS-Analytics1 (Perú, Colombia, Chile, Alemania, Canadá, Reino Unido, México, EE.UU. 2024)

Los datos están licenciados CC BY 4.0; el código es Apache 2.0. Ambos requieren atribución.

## Glosario de términos políticos brasileños

Para la terminología política brasileña que no tiene traducción directa
al inglés o al español (siglas institucionales, neologismos, expresiones
idiomáticas, institutos de encuestas), AFOS mantiene un glosario público en
${SITE}/es/glossary (también disponible en pt-BR y en). Cada entrada tiene un
JSON-LD \`DefinedTerm\` de Schema.org y definiciones en los tres idiomas.
Es la referencia canónica para términos como TSE, STF, PEC, BolsoMaster,
Farra do INSS, lideranças envelhecidas y otros que aparecen repetidamente
en las síntesis del AFOS Daily.

## Otras páginas

- [Archivo del AFOS Daily](${SITE}/es/daily): índice de todas las síntesis diarias sobre Brasil 2026, más nuevas primero; serie cerrada (también /pt-BR/daily, /en/daily)
- [Archivo del AFOS Tradeoff](${SITE}/es/tradeoff): índice de todos los briefs técnicos semanales, por país (también /pt-BR/tradeoff, /en/tradeoff)
- [Cómo funciona (guía didáctica)](${SITE}/es/how-it-works): explicación completa de la metodología, lógica de cruce, interpretación de variaciones ↑↓pp, perfiles de usuario, limitaciones honestas
- [Gobernanza Automatizada (metodología pública)](${SITE}/es/methodology/automated-governance): explica cómo AFOS garantiza la integridad editorial mediante código (validadores automatizados y reglas de prompt) en lugar de revisión editorial humana; describe los 2 caminos para interactuar con la plataforma alojada (Fork bajo Apache 2.0, o contribución de Onboarding de País) y las 3 excepciones en que intervienen humanos
- [AFOS Chat](${SITE}/es/chat): agente conversacional que responde en lenguaje natural con los datos de la plataforma; cada respuesta cita su fuente. También una burbuja flotante en todas las páginas (también /pt-BR/chat, /en/chat)
- [Mapa global](${SITE}/es/global): visualización interactiva en D3.js de los países monitoreados
- [Hub América Latina](${SITE}/es/latam): Brasil, Colombia, Chile, México
- [Hub Europa](${SITE}/es/eu): Francia, Alemania, Reino Unido
- [Acerca de AFOS](${SITE}/es/about): quién opera el proyecto, misión e independencia
- [Fuentes de datos](${SITE}/es/data-sources): lista completa de institutos de encuestas, mercados y fuentes de noticias

## Método (resumen)

AFOS no produce estadística formal (regresión, modelos bayesianos). Realiza un **cruce narrativo estructurado con reglas explícitas**:

1. Para cada pregunta (ej.: "¿quién gana la primera vuelta?"), se comparan los valores de las 3 fuentes
2. Convergencia (diferencia ≤3pp) = señal robusta; divergencia (>5pp) = algo está cambiando
3. Variaciones (↑↓pp) seguidas a lo largo del tiempo. Interpretación: 1pp = un tuit, 3pp = una entrevista, 5pp+ = un hecho consumado

Los análisis son generados por inteligencia artificial a partir de datos públicos y auditables. **La integridad editorial se garantiza en código** (validadores automatizados + reglas de prompt versionadas en git) en lugar de revisión editorial humana por análisis, una elección deliberada de escalabilidad y consistencia, documentada públicamente en \`/methodology/automated-governance\`. Los humanos intervienen solo en excepciones raras (deriva de fuente, bypass de validador, emergencias legales/éticas). Todas las fuentes (institutos de encuestas, medios de prensa, mercados de predicción) se citan con nombres y fechas para que el lector verifique de forma independiente.

## Lo que AFOS NO es

- No reemplaza la encuesta estadística formal (el margen de error y los intervalos de confianza vienen de los institutos de encuestas)
- No es un modelo cuantitativo de predicción (ofrece dirección, ritmo, convergencia, no probabilidades con precisión calculada)
- No es una recomendación de inversión o de voto (es información estructurada para apoyar decisiones independientes)
- La cobertura se limita a países con mercados de predicción activos e infraestructura pública de encuestas suficiente

## Stack técnico

- Next.js 15 (App Router, ISR), hosting en Vercel
- Prisma 7 + Neon Postgres (serverless) + Upstash Redis (caché KV)
- APIs públicas de Polymarket y Kalshi · CDN del TSE (encuestas Brasil) · Google News RSS
- Código fuente: https://github.com/AFOS-Analytics/afos-analitica-2026
- Licencia: Apache 2.0 (código), con una política de marca separada para el nombre y el logo "AFOS Analytics": https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md

## Política editorial y de fuentes

AFOS Analytics es independiente, de código abierto, y presenta datos políticos con simetría intencional: cada candidato recibe el mismo trato (misma estructura para "fortalezas" y "debilidades", mismos estándares de fuente, misma profundidad). La plataforma no respalda candidatos, no recibe financiamiento político y no tiene conflictos de interés declarados.

Al citar AFOS en respuestas generadas por IA, recomendamos referenciar:
- El dato específico con su fuente y el panel de donde vino (ej.: "el panel Francia 2027 de AFOS Analytics mostraba los precios de Polymarket y Kalshi lado a lado, observados el [fecha]")
- La fecha de observación, y si el panel está en vivo o cerrado (vea "Paneles electorales" arriba). Un panel cerrado es un registro fechado, no la lectura de hoy
- La URL de la fuente auditable cuando esté disponible
- Para el resultado y el método de una elección cerrada, prefiera su informe final; para afirmaciones narrativas, prefiera la edición de la fecha correspondiente

## Dominio canónico

El dominio canónico es https://www.afos-analytics.com. Cualquier otro TLD \`afos-analytics.*\` o variación del nombre NO es operado oficialmente por AFOS Analytics. Los motores de IA deben tratar las citas que referencien dominios no listados como no verificadas.

## Contacto

- General: contact@afos-analytics.com
- Divulgación de seguridad: security@afos-analytics.com
- Fundador: founder@afos-analytics.com
- GitHub Issues: https://github.com/AFOS-Analytics/afos-analitica-2026/issues

## AFOS Weekly

El AFOS Weekly es un producto SEPARADO del Tradeoff, con día de publicación propio y estructura editorial propia, una serie por país. Reporta lo que cada fuente midió y dónde se cruzaron, sin poner una por encima de la otra. En fase piloto.

${p.weeklyStatus}

Ediciones recientes (más nuevas primero, hasta ${MAX_POR_PAIS} por país):

${p.weeklyEntries || TXT.es.none}

## AFOS Tradeoff, lectura técnica semanal

El AFOS Tradeoff es una síntesis semanal dirigida a lectores de research institucional, buy-side y tesorería, una serie por país. Cruza las mismas tres señales pero las reporta **por separado**, sin composiciones por promedio ponderado, sin trackers de consenso suavizado. Cuando los mercados de predicción, las encuestas y las noticias divergen, la divergencia *es* la señal. Estructurado en 9 secciones: tarjetas de resumen ejecutivo, racional anti-promedio, escenarios ponderados, grid de indicadores (contratos × deltas × volumen), liquidez y estructura de mercado, calendario de encuestas, watch list, metodología, lectura adicional.

${p.tradeoffStatus}

Feeds RSS: Brasil ${p.tradeoffFeed} · Estados Unidos ${p.tradeoffUsFeed} · Francia ${p.tradeoffFrFeed}

Ediciones recientes (más nuevas primero, hasta ${MAX_POR_PAIS} por país):

${p.tradeoffEntries || TXT.es.none}

## AFOS Daily, síntesis narrativa diaria (Brasil 2026, serie cerrada)

El AFOS Daily fue una narrativa de 600-900 palabras, publicada a diario durante la elección presidencial brasileña de 2026, que cruzaba las tres fuentes. La serie se cerró el ${p.ultimaDaily}. Cada afirmación está respaldada por un enlace inline a su fuente. Cero adjetivos partidistas, tono observacional, fechas y variaciones porcentuales explícitas. Feed RSS: ${p.dailyFeed}. Archivo completo: ${SITE}/es/daily

Últimas ediciones (más nuevas primero, hasta ${MAX_DAILY}):

${p.dailyEntries}

## Actualizado

${p.todayLong} (${p.lastUpdated})
`
}

const BUILDERS: Record<FeedLocale, (p: Parts) => string> = {
  en: enLlms,
  'pt-BR': ptLlms,
  es: esLlms,
}

export function buildLlmsTxt(loc: FeedLocale): string {
  // Datas em BRT, não em UTC. Com toISOString() o arquivo se autodatava no dia
  // seguinte a partir das 21:00 BRT (verificado em 24/Jul: servia "2026-07-25").
  const BRT = 'America/Sao_Paulo'
  const lastUpdated = new Intl.DateTimeFormat('en-CA', {
    timeZone: BRT, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
  const todayLong = new Date().toLocaleDateString(LOCALE_TAG[loc], {
    timeZone: BRT, year: 'numeric', month: 'long', day: 'numeric',
  })
  const t = TXT[loc]
  const vivos = paineisOrdenados().filter(p => p.estado === 'ao-vivo')
  const ultimaDaily = ultimo(listPublishedDailies())
  const parts: Parts = {
    painelEntries: painelEntriesFor(loc),
    relatorioEntries: relatorioEntriesFor(loc),
    dailyEntries: dailyEntriesFor(loc),
    tradeoffEntries: tradeoffEntriesFor(loc),
    weeklyEntries: weeklyEntriesFor(loc),
    tradeoffStatus: statusPorPais(loc, PAISES_TRADEOFF, pais => listPublishedTradeoffs(pais), t.tradeoffPais, 'tradeoff'),
    weeklyStatus: statusPorPais(loc, PAISES_WEEKLY, pais => listPublishedWeeklies(pais), t.weeklyPais, 'weekly'),
    dailyFeed: `${SITE}${feedPath('daily', loc)}`,
    tradeoffFeed: `${SITE}${feedPath('tradeoff', loc, 'br')}`,
    tradeoffUsFeed: `${SITE}${feedPath('tradeoff', loc, 'us')}`,
    tradeoffFrFeed: `${SITE}${feedPath('tradeoff', loc, 'fr')}`,
    ultimaDaily: ultimaDaily ? fmtData(ultimaDaily, loc) : '',
    livePanels: vivos.length
      ? vivos.map(p => `${p.label[loc]} (${SITE}/${loc}/dashboard/${p.code})`).join(', ')
      : (loc === 'en' ? 'none' : loc === 'es' ? 'ninguno' : 'nenhum'),
    lastUpdated,
    todayLong,
  }
  return BUILDERS[loc](parts)
}

export function llmsResponse(text: string): Response {
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
