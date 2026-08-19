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
 */

import { listPublishedDailies, loadDaily, dailyExists } from '../afos-daily/loader'
import { listPublishedTradeoffs, loadTradeoff, tradeoffExists, PAISES_TRADEOFF } from '../afos-tradeoff/loader'
import { listPublishedWeeklies, loadWeekly, PAISES_WEEKLY } from '../afos-weekly/loader'
import { cleanMarkdownText } from '../afos-daily/utils'
import { feedPath, type FeedLocale } from '../feeds/rss'

const SITE = 'https://www.afos-analytics.com'

interface Parts {
  dailyEntries: string
  tradeoffEntries: string
  weeklyEntries: string
  dailyFeed: string
  /** Feed do Tradeoff BRASIL. O endereço não tem qualificador, por histórico. */
  tradeoffFeed: string
  /** Feed do Tradeoff ESTADOS UNIDOS, criado em 10/Ago/2026. */
  tradeoffUsFeed: string
  lastUpdated: string
  todayLong: string
}

function dailyEntriesFor(loc: FeedLocale): string {
  return listPublishedDailies()
    .slice()
    .reverse()
    .filter(date => dailyExists(date, loc))
    .map(date => {
      const data = loadDaily(date, loc)
      if (!data) return ''
      const url = `${SITE}/${loc}/daily/${date}`
      const lede = cleanMarkdownText(data.lede).slice(0, 220)
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
 * edição mais nova para a mais antiga. O Brasil vem primeiro por ser o país de
 * origem do produto e ter a série mais longa.
 */
function tradeoffEntriesFor(loc: FeedLocale): string {
  return PAISES_TRADEOFF.flatMap(pais =>
    listPublishedTradeoffs(pais)
      .slice()
      .reverse()
      .filter(date => tradeoffExists(date, loc, pais))
      .map(date => {
        const data = loadTradeoff(date, loc, pais)
        if (!data) return ''
        const url = `${SITE}/${loc}/tradeoff/${pais}/${date}`
        const sinal = cleanMarkdownText(data.sinalDaSemana).slice(0, 220)
        return `- [${data.title}](${url}): ${sinal}`
      })
      .filter(Boolean)
  ).join('\n')
}


/**
 * Edições do AFOS Weekly.
 *
 * 🔴 O Weekly não existia neste arquivo. Seis páginas vivas, duas datas em três
 * idiomas, ficavam sem citação possível por motor de IA. Pior que a ausência: o
 * único produto americano descrito aqui é o Tradeoff, chamado de "weekly
 * edition", então o motor tendia a atribuir AO TRADEOFF o conteúdo do Weekly.
 *
 * ⚠️ O filtro é `servedLocale`, NUNCA `weeklyExists`. O loader do Weekly cai
 * para o arquivo de origem em inglês quando falta a tradução, então
 * `weeklyExists` devolve `true` para os três idiomas SEMPRE, e o llms.pt-BR.txt
 * passaria a anunciar em português uma edição que só existe em inglês. Isso
 * viola a regra de veracidade declarada no cabeçalho deste próprio arquivo.
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
        const resumo = cleanMarkdownText(data.tldr?.[0] ?? '').slice(0, 220)
        return `- [${data.title}](${url}): ${resumo}`
      })
      .filter(Boolean)
  ).join('\n')
}

const LOCALE_TAG: Record<FeedLocale, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }

// ──────────────────────────────────────────────────────────────────────────
// English (canonical)
// ──────────────────────────────────────────────────────────────────────────
function enLlms(p: Parts): string {
  return `# AFOS Analytics

> Global Electoral Political Risk Intelligence, Open-Source. Global platform that cross-references prediction markets, electoral polls, and real-time news across 15 countries. Open source (Apache 2.0), free, and without mandatory registration.

This file also exists in other languages: ${SITE}/llms.txt (English), ${SITE}/llms.pt-BR.txt (Portuguese), ${SITE}/llms.es.txt (Spanish).

AFOS Analytics combines three independent data sources in real time to provide unbiased electoral political risk analysis:

- **Prediction markets** (Polymarket): real-money odds updated every 30 minutes
- **Polling institutes**: 17+ in Brazil (Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá) plus equivalents in each monitored country, ingested automatically from official registries (e.g., TSE in Brazil)
- **Live news**: 400+ sources via Google News in 3 languages (PT-BR, EN, ES), refreshed every 30 minutes

When the three sources agree, the forecast is robust. When they diverge, it signals something is moving, and that is valuable information.

## Brazilian political terms glossary

For Brazilian political terminology that does not have direct translation
to English or Spanish (institutional acronyms, neologisms, idiomatic
expressions, polling institutes), AFOS maintains a public glossary at
${SITE}/en/glossary (also available in pt-BR and es). Each entry has a
Schema.org \`DefinedTerm\` JSON-LD and definitions in all three languages.
This is the canonical reference for terms like TSE, STF, PEC, BolsoMaster,
Farra do INSS, lideranças envelhecidas, and others that appear repeatedly
in AFOS Daily syntheses.

## Core pages

- [AFOS Daily archive](${SITE}/en/daily): browsable index of every daily synthesis, newest first (also /pt-BR/daily, /es/daily)
- [AFOS Tradeoff archive](${SITE}/en/tradeoff): browsable index of every weekly technical brief (also /pt-BR/tradeoff, /es/tradeoff)
- [Dashboard (main application)](${SITE}/en/dashboard/br): 6 Polymarket cards (1st round, 2nd place, 3rd place, Supreme Court impeachment, Senate, inflation), in-depth candidate analysis, comparative table, live news feed
- [United States panel, 2026 midterms](${SITE}/en/dashboard/us): November 3, 2026 midterms. Polymarket implied probability of controlling each chamber plus the seat-count distribution, the House generic ballot as a simple average of polls, declared limitations, World Bank structural context, and press coverage. The market and the polls are shown side by side and are NOT subtracted from one another: control probability and vote share are different quantities (also /pt-BR/dashboard/us, /es/dashboard/us)
- [How it works (didactic guide)](${SITE}/en/how-it-works): complete methodology explanation, cross-referencing logic, ↑↓pp variation interpretation, user profiles, honest limitations
- [Automated Governance (public methodology)](${SITE}/en/methodology/automated-governance): explains how AFOS enforces editorial integrity via code (automated validators and prompt rules) rather than human editorial review; describes the 2 paths for interacting with the hosted platform (Fork under Apache 2.0, or Country Onboarding contribution) and the 3 exceptions where humans do intervene
- [AFOS Chat](${SITE}/en/chat): conversational agent answering in natural language with live platform data (Polymarket odds, TSE polls, validated cases and divergence, news, AFOS Daily); every answer cites its source. Also a floating bubble on every page (also /pt-BR/chat, /es/chat)
- [Global map](${SITE}/en/global): interactive D3.js visualization of monitored countries
- [Latin America hub](${SITE}/en/latam): Brazil, Colombia, Chile, Mexico
- [Europe hub](${SITE}/en/eu): France, Germany, United Kingdom

## Open data

The dataset behind AFOS, the daily divergence between prediction markets, polls, and press for Brazil's 2026 election, is published openly and updated daily:

- Dataset (Hugging Face): https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence, dated divergence CSVs (Polymarket % vs poll % per candidate) plus poll and news snapshots. Branded alias: ${SITE}/dataset
- Academic releases (Harvard Dataverse, persistent DOIs, preferred for citation): Brazil 2026 https://doi.org/10.7910/DVN/2D0UK7 and USA 2024 https://doi.org/10.7910/DVN/3DJCW5. Collection: https://dataverse.harvard.edu/dataverse/afos-analytics
- Validated multi-country datasets (Hugging Face org): https://huggingface.co/AFOS-Analytics1 (Peru, Colombia, Chile, Germany, Canada, UK, Mexico, USA 2024)
- [About AFOS](${SITE}/en/about): who operates the project, mission, and independence
- [Data sources](${SITE}/en/data-sources): full list of polling institutes, markets, and news sources

Data is licensed CC BY 4.0; code is Apache 2.0. Both require attribution. When citing the dataset, reference the Hugging Face repository above.

## Method (summary)

AFOS does not produce formal statistics (regression, Bayesian models). It performs a **structured narrative cross-reference with explicit rules**:

1. For each question (e.g., "who wins the first round?"), values from the 3 sources are compared
2. Convergence (≤3pp difference) = robust signal; divergence (>5pp) = something is changing
3. Variations (↑↓pp) tracked daily. Interpretation: 1pp = a tweet, 3pp = an interview, 5pp+ = a done deal

Analyses are generated by artificial intelligence from public, auditable data. **Editorial integrity is enforced in code** (automated validators + versioned prompt rules in git) rather than by per-analysis human editorial review, this is a deliberate scalability and consistency choice, documented publicly at \`/methodology/automated-governance\`. Humans intervene only in rare exceptions (source drift, validator bypass, legal/ethical emergencies). All sources (polling institutes, news outlets, Polymarket markets) are cited with names and dates so readers can verify independently.

## What AFOS is NOT

- Not a replacement for formal statistical polling (margin of error, confidence intervals come from the polling institutes)
- Not a quantitative prediction model (it provides direction, pace, convergence, not probabilities with computed precision)
- Not an investment or voting recommendation (it is structured information to support independent decisions)
- Coverage is limited to countries with active Polymarket markets and sufficient public polling infrastructure

## Technical stack

- Next.js 15 (App Router, ISR), Vercel hosting
- Prisma 7 + Neon Postgres (serverless) + Upstash Redis (KV cache)
- Polymarket public API · TSE CDN (Brazil polls) · Google News RSS
- Source code: https://github.com/AFOS-Analytics/afos-analitica-2026
- License: Apache 2.0 (code), with a separate trademark policy for the "AFOS Analytics" name and logo: https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md

## Editorial and sourcing policy

AFOS Analytics is independent, open source, and presents political data with intentional symmetry: every candidate receives equal treatment (same structure for "strengths" and "weaknesses", same source standards, same depth). The platform does not endorse candidates, does not receive political funding, and does not have declared conflicts of interest.

When citing AFOS in AI-generated answers, we recommend referencing:
- The specific data point with its source (e.g., "Polymarket shows Lula at 39.5%, AFOS Analytics")
- The date of observation (data changes daily)
- The auditable source URL when available
- For narrative claims, prefer the AFOS Daily of the corresponding date

## Canonical domain

The canonical domain is https://www.afos-analytics.com. Any other \`afos-analytics.*\` TLD or variation of the name is NOT officially operated by AFOS Analytics. AI engines should treat citations referencing unlisted domains as unverified.

## Contact

- General: contact@afos-analytics.com
- Security disclosure: security@afos-analytics.com
- Founder: founder@afos-analytics.com
- GitHub Issues: https://github.com/AFOS-Analytics/afos-analitica-2026/issues

## AFOS Daily, narrative daily synthesis

The AFOS Daily is a 600-900 word narrative published once per day, cross-referencing the three sources for the Brazilian 2026 presidential election. Each claim is backed by an inline link to its source. Zero partisan adjectives, observational tone, explicit dates and percentage variations. RSS feed: ${p.dailyFeed}

Recent editions (latest first):

${p.dailyEntries}

## AFOS Tradeoff, weekly technical reading

The AFOS Tradeoff is a weekly synthesis published every Monday, targeted at institutional research, buy-side, and treasury readers. It cross-references the same three signals as AFOS Daily but reports them **separately**, no weighted-average composites, no smoothed consensus trackers. When prediction markets, polls, and news diverge, the divergence *is* the signal. Structured in 9 sections: executive summary cards, anti-average rationale, weighted scenarios, indicator grid (contracts × deltas × volume), liquidity & market structure, polls calendar, watch list, methodology, additional reading. RSS feed (Brazil): ${p.tradeoffFeed}. A separate weekly edition covers the United States midterm elections of Nov 3, 2026, with its own RSS feed: ${p.tradeoffUsFeed}

Recent editions (latest first):

${p.tradeoffEntries || '- (no editions published yet)'}

## AFOS Weekly

The AFOS Weekly is a separate product from the Tradeoff, with its own publication day and its own editorial structure. It covers the United States midterm elections of Nov 3, 2026, reporting what each source measured and where they crossed, without ranking one above the other. Pilot stage.

Recent editions (latest first):

${p.weeklyEntries || '- (no editions published yet)'}

## Updated

${p.todayLong} (${p.lastUpdated})
`
}

// ──────────────────────────────────────────────────────────────────────────
// Portuguese (pt-BR)
// ──────────────────────────────────────────────────────────────────────────
function ptLlms(p: Parts): string {
  return `# AFOS Analytics

> Inteligência de Risco Político Eleitoral Global, Open-Source. Plataforma global que cruza mercados de previsão, pesquisas eleitorais e notícias em tempo real em 15 países. Código aberto (Apache 2.0), gratuita e sem cadastro obrigatório.

Este arquivo também existe em outros idiomas: ${SITE}/llms.txt (inglês), ${SITE}/llms.pt-BR.txt (português), ${SITE}/llms.es.txt (espanhol).

A AFOS Analytics combina três fontes de dados independentes em tempo real para oferecer análise de risco político eleitoral sem viés:

- **Mercados de previsão** (Polymarket): odds com dinheiro real atualizadas a cada 30 minutos
- **Institutos de pesquisa**: 17+ no Brasil (Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá) mais equivalentes em cada país monitorado, ingeridos automaticamente de registros oficiais (ex.: TSE no Brasil)
- **Notícias ao vivo**: 400+ fontes via Google News em 3 idiomas (PT-BR, EN, ES), atualizadas a cada 30 minutos

Quando as três fontes concordam, a previsão é robusta. Quando divergem, é sinal de que algo está se movendo, e isso é informação valiosa.

## Glossário de termos políticos brasileiros

Para a terminologia política brasileira que não tem tradução direta
para inglês ou espanhol (siglas institucionais, neologismos, expressões
idiomáticas, institutos de pesquisa), a AFOS mantém um glossário público em
${SITE}/pt-BR/glossary (também disponível em en e es). Cada verbete tem um
JSON-LD \`DefinedTerm\` do Schema.org e definições nos três idiomas.
É a referência canônica para termos como TSE, STF, PEC, BolsoMaster,
Farra do INSS, lideranças envelhecidas e outros que aparecem repetidamente
nas sínteses do AFOS Daily.

## Páginas principais

- [Arquivo do AFOS Daily](${SITE}/pt-BR/daily): índice navegável de todas as sínteses diárias, mais novas primeiro (também /en/daily, /es/daily)
- [Arquivo do AFOS Tradeoff](${SITE}/pt-BR/tradeoff): índice navegável de todos os briefs técnicos semanais (também /en/tradeoff, /es/tradeoff)
- [Dashboard (aplicação principal)](${SITE}/pt-BR/dashboard/br): 6 cards Polymarket (1º turno, 2º lugar, 3º lugar, impeachment no STF, Senado, inflação), análise aprofundada de candidatos, tabela comparativa, feed de notícias ao vivo
- [Painel Estados Unidos, midterms 2026](${SITE}/pt-BR/dashboard/us): eleições de meio de mandato de 3 de novembro de 2026. Probabilidade implícita no Polymarket de controlar cada casa e a distribuição de cadeiras, o generic ballot da Câmara como média simples das pesquisas, limitações declaradas, contexto estrutural do Banco Mundial e cobertura de imprensa. O mercado e as pesquisas aparecem lado a lado e NÃO são subtraídos um do outro: probabilidade de controle e intenção de voto são grandezas diferentes (também /en/dashboard/us, /es/dashboard/us)
- [Como funciona (guia didático)](${SITE}/pt-BR/how-it-works): explicação completa da metodologia, lógica de cruzamento, interpretação de variações ↑↓pp, perfis de usuário, limitações honestas
- [Governança Automatizada (metodologia pública)](${SITE}/pt-BR/methodology/automated-governance): explica como a AFOS garante integridade editorial via código (validadores automatizados e regras de prompt) em vez de revisão editorial humana; descreve os 2 caminhos para interagir com a plataforma hospedada (Fork sob Apache 2.0, ou contribuição de Onboarding de País) e as 3 exceções em que humanos intervêm
- [AFOS Chat](${SITE}/pt-BR/chat): agente conversacional que responde em linguagem natural com os dados ao vivo da plataforma (odds Polymarket, pesquisas TSE, casos validados e divergência, notícias, AFOS Daily); toda resposta cita a fonte. Também uma bolha flutuante em todas as páginas (também /en/chat, /es/chat)
- [Mapa global](${SITE}/pt-BR/global): visualização interativa em D3.js dos países monitorados
- [Hub América Latina](${SITE}/pt-BR/latam): Brasil, Colômbia, Chile, México
- [Hub Europa](${SITE}/pt-BR/eu): França, Alemanha, Reino Unido

## Dados abertos

O dataset por trás da AFOS, a divergência diária entre mercados de previsão, pesquisas e imprensa para a eleição de 2026 no Brasil, é publicado abertamente e atualizado diariamente:

- Dataset (Hugging Face): https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence, CSVs de divergência datados (Polymarket % vs pesquisa % por candidato) mais snapshots de pesquisas e notícias. Alias institucional: ${SITE}/dataset
- Versões acadêmicas (Harvard Dataverse, DOIs persistentes, preferidos para citação): Brasil 2026 https://doi.org/10.7910/DVN/2D0UK7 e EUA 2024 https://doi.org/10.7910/DVN/3DJCW5. Coleção: https://dataverse.harvard.edu/dataverse/afos-analytics
- Datasets validados multi-país (organização Hugging Face): https://huggingface.co/AFOS-Analytics1 (Peru, Colômbia, Chile, Alemanha, Canadá, Reino Unido, México, EUA 2024)
- [Sobre a AFOS](${SITE}/pt-BR/about): quem opera o projeto, missão e independência
- [Fontes de dados](${SITE}/pt-BR/data-sources): lista completa de institutos de pesquisa, mercados e fontes de notícias

Os dados são licenciados CC BY 4.0; o código é Apache 2.0. Ambos exigem atribuição. Ao citar o dataset, referencie o repositório Hugging Face acima.

## Método (resumo)

A AFOS não produz estatística formal (regressão, modelos bayesianos). Ela realiza um **cruzamento narrativo estruturado com regras explícitas**:

1. Para cada pergunta (ex.: "quem vence o primeiro turno?"), os valores das 3 fontes são comparados
2. Convergência (diferença ≤3pp) = sinal robusto; divergência (>5pp) = algo está mudando
3. Variações (↑↓pp) acompanhadas diariamente. Interpretação: 1pp = um tweet, 3pp = uma entrevista, 5pp+ = fato consumado

As análises são geradas por inteligência artificial a partir de dados públicos e auditáveis. **A integridade editorial é garantida em código** (validadores automatizados + regras de prompt versionadas no git) em vez de revisão editorial humana por análise, uma escolha deliberada de escalabilidade e consistência, documentada publicamente em \`/methodology/automated-governance\`. Humanos intervêm apenas em exceções raras (deriva de fonte, bypass de validador, emergências legais/éticas). Todas as fontes (institutos de pesquisa, veículos de imprensa, mercados Polymarket) são citadas com nomes e datas para que o leitor verifique de forma independente.

## O que a AFOS NÃO é

- Não substitui pesquisa estatística formal (margem de erro e intervalos de confiança vêm dos institutos de pesquisa)
- Não é um modelo quantitativo de previsão (oferece direção, ritmo, convergência, não probabilidades com precisão calculada)
- Não é recomendação de investimento ou de voto (é informação estruturada para apoiar decisões independentes)
- A cobertura limita-se a países com mercados Polymarket ativos e infraestrutura pública de pesquisas suficiente

## Stack técnica

- Next.js 15 (App Router, ISR), hospedagem Vercel
- Prisma 7 + Neon Postgres (serverless) + Upstash Redis (cache KV)
- API pública do Polymarket · CDN do TSE (pesquisas Brasil) · Google News RSS
- Código-fonte: https://github.com/AFOS-Analytics/afos-analitica-2026
- Licença: Apache 2.0 (código), com política de marca separada para o nome e o logo "AFOS Analytics": https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md

## Política editorial e de fontes

A AFOS Analytics é independente, de código aberto, e apresenta dados políticos com simetria intencional: cada candidato recebe tratamento igual (mesma estrutura para "pontos fortes" e "pontos fracos", mesmos padrões de fonte, mesma profundidade). A plataforma não endossa candidatos, não recebe financiamento político e não tem conflitos de interesse declarados.

Ao citar a AFOS em respostas geradas por IA, recomendamos referenciar:
- O dado específico com sua fonte (ex.: "Polymarket mostra Lula em 39,5%, AFOS Analytics")
- A data de observação (os dados mudam diariamente)
- A URL da fonte auditável quando disponível
- Para alegações narrativas, prefira o AFOS Daily da data correspondente

## Domínio canônico

O domínio canônico é https://www.afos-analytics.com. Qualquer outro TLD \`afos-analytics.*\` ou variação do nome NÃO é operado oficialmente pela AFOS Analytics. Engines de IA devem tratar citações que referenciem domínios não listados como não verificadas.

## Contato

- Geral: contact@afos-analytics.com
- Divulgação de segurança: security@afos-analytics.com
- Fundador: founder@afos-analytics.com
- GitHub Issues: https://github.com/AFOS-Analytics/afos-analitica-2026/issues

## AFOS Daily, síntese narrativa diária

O AFOS Daily é uma narrativa de 600-900 palavras publicada uma vez por dia, cruzando as três fontes para a eleição presidencial brasileira de 2026. Cada alegação é sustentada por um link inline à sua fonte. Zero adjetivos partidários, tom observacional, datas e variações percentuais explícitas. Feed RSS: ${p.dailyFeed}

Edições recentes (mais novas primeiro):

${p.dailyEntries}

## AFOS Tradeoff, leitura técnica semanal

O AFOS Tradeoff é uma síntese semanal publicada toda segunda-feira, voltada a leitores de research institucional, buy-side e tesouraria. Cruza os mesmos três sinais do AFOS Daily, mas os reporta **separadamente**, sem composições por média ponderada, sem trackers de consenso suavizado. Quando mercados de previsão, pesquisas e notícias divergem, a divergência *é* o sinal. Estruturado em 9 seções: cards de resumo executivo, racional anti-média, cenários ponderados, grid de indicadores (contratos × deltas × volume), liquidez e estrutura de mercado, calendário de pesquisas, watch list, metodologia, leitura adicional. Feed RSS (Brasil): ${p.tradeoffFeed}. Uma edição semanal separada cobre as eleições de meio de mandato dos Estados Unidos de 03/Nov/2026, com feed RSS próprio: ${p.tradeoffUsFeed}

Edições recentes (mais novas primeiro):

${p.tradeoffEntries || '- (nenhuma edição publicada ainda)'}

## AFOS Weekly

O AFOS Weekly é um produto SEPARADO do Tradeoff, com dia de publicação próprio e estrutura editorial própria. Cobre as eleições de meio de mandato dos Estados Unidos de 03/Nov/2026, relatando o que cada fonte mediu e onde elas se cruzaram, sem colocar uma acima da outra. Em fase de piloto.

Edições recentes (mais novas primeiro):

${p.weeklyEntries || '- (nenhuma edição publicada ainda)'}

## Atualizado

${p.todayLong} (${p.lastUpdated})
`
}

// ──────────────────────────────────────────────────────────────────────────
// Spanish (es)
// ──────────────────────────────────────────────────────────────────────────
function esLlms(p: Parts): string {
  return `# AFOS Analytics

> Inteligencia de Riesgo Político Electoral Global, Open-Source. Plataforma global que cruza mercados de predicción, encuestas electorales y noticias en tiempo real en 15 países. Código abierto (Apache 2.0), gratuita y sin registro obligatorio.

Este archivo también existe en otros idiomas: ${SITE}/llms.txt (inglés), ${SITE}/llms.pt-BR.txt (portugués), ${SITE}/llms.es.txt (español).

AFOS Analytics combina tres fuentes de datos independientes en tiempo real para ofrecer un análisis de riesgo político electoral sin sesgo:

- **Mercados de predicción** (Polymarket): odds con dinero real actualizadas cada 30 minutos
- **Institutos de encuestas**: 17+ en Brasil (Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá) más equivalentes en cada país monitoreado, ingeridos automáticamente desde registros oficiales (ej.: TSE en Brasil)
- **Noticias en vivo**: 400+ fuentes vía Google News en 3 idiomas (PT-BR, EN, ES), actualizadas cada 30 minutos

Cuando las tres fuentes coinciden, el pronóstico es robusto. Cuando divergen, es señal de que algo se está moviendo, y eso es información valiosa.

## Glosario de términos políticos brasileños

Para la terminología política brasileña que no tiene traducción directa
al inglés o al español (siglas institucionales, neologismos, expresiones
idiomáticas, institutos de encuestas), AFOS mantiene un glosario público en
${SITE}/es/glossary (también disponible en pt-BR y en). Cada entrada tiene un
JSON-LD \`DefinedTerm\` de Schema.org y definiciones en los tres idiomas.
Es la referencia canónica para términos como TSE, STF, PEC, BolsoMaster,
Farra do INSS, lideranças envelhecidas y otros que aparecen repetidamente
en las síntesis del AFOS Daily.

## Páginas principales

- [Archivo del AFOS Daily](${SITE}/es/daily): índice navegable de todas las síntesis diarias, más nuevas primero (también /pt-BR/daily, /en/daily)
- [Archivo del AFOS Tradeoff](${SITE}/es/tradeoff): índice navegable de todos los briefs técnicos semanales (también /pt-BR/tradeoff, /en/tradeoff)
- [Dashboard (aplicación principal)](${SITE}/es/dashboard/br): 6 tarjetas Polymarket (1ª vuelta, 2º lugar, 3er lugar, impeachment en el STF, Senado, inflación), análisis a fondo de candidatos, tabla comparativa, feed de noticias en vivo
- [Panel Estados Unidos, midterms 2026](${SITE}/es/dashboard/us): elecciones de medio término del 3 de noviembre de 2026. Probabilidad implícita en Polymarket de controlar cada cámara y la distribución de escaños, el generic ballot de la Cámara de Representantes como promedio simple de las encuestas, limitaciones declaradas, contexto estructural del Banco Mundial y cobertura de prensa. El mercado y las encuestas se muestran lado a lado y NO se restan entre sí: probabilidad de control e intención de voto son magnitudes distintas (también /pt-BR/dashboard/us, /en/dashboard/us)
- [Cómo funciona (guía didáctica)](${SITE}/es/how-it-works): explicación completa de la metodología, lógica de cruce, interpretación de variaciones ↑↓pp, perfiles de usuario, limitaciones honestas
- [Gobernanza Automatizada (metodología pública)](${SITE}/es/methodology/automated-governance): explica cómo AFOS garantiza la integridad editorial mediante código (validadores automatizados y reglas de prompt) en lugar de revisión editorial humana; describe los 2 caminos para interactuar con la plataforma alojada (Fork bajo Apache 2.0, o contribución de Onboarding de País) y las 3 excepciones en que intervienen humanos
- [AFOS Chat](${SITE}/es/chat): agente conversacional que responde en lenguaje natural con los datos en vivo de la plataforma (odds Polymarket, encuestas TSE, casos validados y divergencia, noticias, AFOS Daily); cada respuesta cita su fuente. También una burbuja flotante en todas las páginas (también /pt-BR/chat, /en/chat)
- [Mapa global](${SITE}/es/global): visualización interactiva en D3.js de los países monitoreados
- [Hub América Latina](${SITE}/es/latam): Brasil, Colombia, Chile, México
- [Hub Europa](${SITE}/es/eu): Francia, Alemania, Reino Unido

## Datos abiertos

El dataset detrás de AFOS, la divergencia diaria entre mercados de predicción, encuestas y prensa para la elección de 2026 en Brasil, se publica abiertamente y se actualiza a diario:

- Dataset (Hugging Face): https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence, CSVs de divergencia fechados (Polymarket % vs encuesta % por candidato) más snapshots de encuestas y noticias. Alias institucional: ${SITE}/dataset
- Versiones académicas (Harvard Dataverse, DOIs persistentes, preferidos para citación): Brasil 2026 https://doi.org/10.7910/DVN/2D0UK7 y EE.UU. 2024 https://doi.org/10.7910/DVN/3DJCW5. Colección: https://dataverse.harvard.edu/dataverse/afos-analytics
- Datasets validados multipaís (organización Hugging Face): https://huggingface.co/AFOS-Analytics1 (Perú, Colombia, Chile, Alemania, Canadá, Reino Unido, México, EE.UU. 2024)
- [Acerca de AFOS](${SITE}/es/about): quién opera el proyecto, misión e independencia
- [Fuentes de datos](${SITE}/es/data-sources): lista completa de institutos de encuestas, mercados y fuentes de noticias

Los datos están licenciados CC BY 4.0; el código es Apache 2.0. Ambos requieren atribución. Al citar el dataset, referencie el repositorio Hugging Face anterior.

## Método (resumen)

AFOS no produce estadística formal (regresión, modelos bayesianos). Realiza un **cruce narrativo estructurado con reglas explícitas**:

1. Para cada pregunta (ej.: "¿quién gana la primera vuelta?"), se comparan los valores de las 3 fuentes
2. Convergencia (diferencia ≤3pp) = señal robusta; divergencia (>5pp) = algo está cambiando
3. Variaciones (↑↓pp) seguidas a diario. Interpretación: 1pp = un tuit, 3pp = una entrevista, 5pp+ = un hecho consumado

Los análisis son generados por inteligencia artificial a partir de datos públicos y auditables. **La integridad editorial se garantiza en código** (validadores automatizados + reglas de prompt versionadas en git) en lugar de revisión editorial humana por análisis, una elección deliberada de escalabilidad y consistencia, documentada públicamente en \`/methodology/automated-governance\`. Los humanos intervienen solo en excepciones raras (deriva de fuente, bypass de validador, emergencias legales/éticas). Todas las fuentes (institutos de encuestas, medios de prensa, mercados Polymarket) se citan con nombres y fechas para que el lector verifique de forma independiente.

## Lo que AFOS NO es

- No reemplaza la encuesta estadística formal (el margen de error y los intervalos de confianza vienen de los institutos de encuestas)
- No es un modelo cuantitativo de predicción (ofrece dirección, ritmo, convergencia, no probabilidades con precisión calculada)
- No es una recomendación de inversión o de voto (es información estructurada para apoyar decisiones independientes)
- La cobertura se limita a países con mercados Polymarket activos e infraestructura pública de encuestas suficiente

## Stack técnico

- Next.js 15 (App Router, ISR), hosting en Vercel
- Prisma 7 + Neon Postgres (serverless) + Upstash Redis (caché KV)
- API pública de Polymarket · CDN del TSE (encuestas Brasil) · Google News RSS
- Código fuente: https://github.com/AFOS-Analytics/afos-analitica-2026
- Licencia: Apache 2.0 (código), con una política de marca separada para el nombre y el logo "AFOS Analytics": https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md

## Política editorial y de fuentes

AFOS Analytics es independiente, de código abierto, y presenta datos políticos con simetría intencional: cada candidato recibe el mismo trato (misma estructura para "fortalezas" y "debilidades", mismos estándares de fuente, misma profundidad). La plataforma no respalda candidatos, no recibe financiamiento político y no tiene conflictos de interés declarados.

Al citar AFOS en respuestas generadas por IA, recomendamos referenciar:
- El dato específico con su fuente (ej.: "Polymarket muestra a Lula en 39,5%, AFOS Analytics")
- La fecha de observación (los datos cambian a diario)
- La URL de la fuente auditable cuando esté disponible
- Para afirmaciones narrativas, prefiera el AFOS Daily de la fecha correspondiente

## Dominio canónico

El dominio canónico es https://www.afos-analytics.com. Cualquier otro TLD \`afos-analytics.*\` o variación del nombre NO es operado oficialmente por AFOS Analytics. Los motores de IA deben tratar las citas que referencien dominios no listados como no verificadas.

## Contacto

- General: contact@afos-analytics.com
- Divulgación de seguridad: security@afos-analytics.com
- Fundador: founder@afos-analytics.com
- GitHub Issues: https://github.com/AFOS-Analytics/afos-analitica-2026/issues

## AFOS Daily, síntesis narrativa diaria

El AFOS Daily es una narrativa de 600-900 palabras publicada una vez al día, que cruza las tres fuentes para la elección presidencial brasileña de 2026. Cada afirmación está respaldada por un enlace inline a su fuente. Cero adjetivos partidistas, tono observacional, fechas y variaciones porcentuales explícitas. Feed RSS: ${p.dailyFeed}

Ediciones recientes (más nuevas primero):

${p.dailyEntries}

## AFOS Tradeoff, lectura técnica semanal

El AFOS Tradeoff es una síntesis semanal publicada cada lunes, dirigida a lectores de research institucional, buy-side y tesorería. Cruza las mismas tres señales del AFOS Daily pero las reporta **por separado**, sin composiciones por promedio ponderado, sin trackers de consenso suavizado. Cuando los mercados de predicción, las encuestas y las noticias divergen, la divergencia *es* la señal. Estructurado en 9 secciones: tarjetas de resumen ejecutivo, racional anti-promedio, escenarios ponderados, grid de indicadores (contratos × deltas × volumen), liquidez y estructura de mercado, calendario de encuestas, watch list, metodología, lectura adicional. Feed RSS (Brasil): ${p.tradeoffFeed}. Una edición semanal separada cubre las elecciones de medio término de Estados Unidos del 03/Nov/2026, con feed RSS propio: ${p.tradeoffUsFeed}

Ediciones recientes (más nuevas primero):

${p.tradeoffEntries || '- (aún no hay ediciones publicadas)'}

## AFOS Weekly

El AFOS Weekly es un producto SEPARADO del Tradeoff, con día de publicación propio y estructura editorial propia. Cubre las elecciones de medio término de Estados Unidos del 03/Nov/2026, reportando lo que cada fuente midió y dónde se cruzaron, sin poner una por encima de la otra. En fase piloto.

Ediciones recientes (más nuevas primero):

${p.weeklyEntries || '- (aún no hay ediciones publicadas)'}

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
  const parts: Parts = {
    dailyEntries: dailyEntriesFor(loc),
    tradeoffEntries: tradeoffEntriesFor(loc),
    weeklyEntries: weeklyEntriesFor(loc),
    dailyFeed: `${SITE}${feedPath('daily', loc)}`,
    tradeoffFeed: `${SITE}${feedPath('tradeoff', loc, 'br')}`,
    tradeoffUsFeed: `${SITE}${feedPath('tradeoff', loc, 'us')}`,
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
