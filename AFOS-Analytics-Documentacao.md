# AFOS Analytics — Documentacao Completa do Projeto

**Data:** 05/04/2026
**Versao:** 1.0
**URL:** https://afos-analitica-2026.vercel.app
**Repositorio:** https://github.com/andrefelipe-afos/afos-analitica-2026

---

## 1. VISAO GERAL

| Item | Valor |
|---|---|
| Nome | AFOS Analytics |
| Proposito | Dashboard de inteligencia eleitoral — Eleicoes Presidenciais Brasil 2026 |
| Stack | Next.js 14.2, React 18, TypeScript 5.9, Tailwind CSS 3.4 |
| Deploy | Vercel (ISR — Incremental Static Regeneration) |
| Idioma | Portugues brasileiro (lang="pt-BR") |
| Bundle | 101kB first load |
| Pacotes | 105 instalados |

---

## 2. ARQUITETURA DE ARQUIVOS

```
AFOS-Analitica-2026/
  app/
    components/
      ui.tsx                    (43 linhas — Card, HBar, Stars, SectionTitle)
    api/
      polymarket/route.ts       (49 linhas — odds ao vivo)
      polls/route.ts            (15 linhas — le polls-data.json)
      news/route.ts             (204 linhas — Google News + Firecrawl)
      analysis-cards/route.ts   (17 linhas — le analysis-data.json)
      analysis-criteriosa/route.ts (15 linhas — le analysis-criteriosa.json)
      global-elections/route.ts (52 linhas — 11+ eleicoes mundiais)
    layout.tsx                  (51 linhas — metadata + SEO + OG)
    page.tsx                    (1.060 linhas — dashboard principal)
    opengraph-image.tsx         (55 linhas — imagem OG dinamica 1200x630)
    globals.css                 (41 linhas — variaveis CSS + Tailwind)
  public/
    polls-data.json             (dados de 17 institutos + 6 pesquisas)
    analysis-data.json          (cards: Sentimento, INSS, Master, STF)
    analysis-criteriosa.json    (4 candidatos: fortes/fracos/analise)
    favicon.svg                 (icone sapphire blue)
    fotos/                      (13 fotos de candidatos .jpg/.svg)
  package.json, tsconfig.json, tailwind.config.ts, next.config.mjs
```

---

## 3. FLUXO DE DADOS

Na carga da pagina (useEffect), 5 fetches paralelos:

- /api/polymarket -> gamma-api.polymarket.com (6 mercados)
- /api/polls -> public/polls-data.json
- /api/news -> Google News RSS + Firecrawl API
- /api/analysis-cards -> public/analysis-data.json
- /api/analysis-criteriosa -> public/analysis-criteriosa.json

Fetch lazy (botao Global):
- /api/global-elections -> gamma-api.polymarket.com (11 eleicoes)

### Fontes Externas

| API | URL | Auth |
|---|---|---|
| Polymarket Gamma | gamma-api.polymarket.com/events?slug=X&limit=1 | Nenhuma (publica) |
| Google News RSS | news.google.com/rss/search?q=X&hl=pt-BR&gl=BR | Nenhuma |
| Firecrawl | api.firecrawl.dev/v1/scrape | Bearer token (FIRECRAWL_API_KEY) |

---

## 4. ESTRATEGIA DE CACHE (ISR)

| Rota | Revalidate | Justificativa |
|---|---|---|
| /api/polymarket | 2h (7200s) | Odds mudam, mas nao a cada segundo |
| /api/polls | 2h (7200s) | Pesquisas saem esporadicamente |
| /api/news | 30min (1800s) | Noticias precisam ser frescas |
| /api/analysis-cards | 2h (7200s) | Analises atualizadas manualmente |
| /api/analysis-criteriosa | 2h (7200s) | Idem |
| /api/global-elections | 2h (7200s) | Dados internacionais menos volateis |

---

## 5. MERCADOS POLYMARKET MONITORADOS

| Mercado | Slug |
|---|---|
| Presidente 1T | brazil-presidential-election |
| 2o lugar 1T | brazil-presidential-election-first-round-2nd-place |
| 3o lugar 1T | brazil-presidential-election-first-round-3rd-place |
| STF Impeachment | any-brazil-stf-justice-removed-by-impeachment-before-2027 |
| Senado | next-brazil-senate-election-most-seats-won |
| Inflacao 2026 | brazil-annual-inflation-2026 |

---

## 6. INSTITUTOS DE PESQUISA (17)

### 5 estrelas — Referencia nacional
- Datafolha (Presencial) — Mais tradicional do Brasil. Grupo Folha.
- Quaest/Genial (Presencial) — Encomendada por bancos/investidores. Alta precisao.

### 4 estrelas — Alta confiabilidade
- AtlasIntel (Online/Big Data) — Metodologia digital. Parceria Bloomberg.
- Parana Pesquisas (Presencial) — Forte em estaduais e nacionais.
- MDA (Presencial) — Um dos que mais acertou historicamente.
- Ipec ex-Ibope (Presencial) — Herdeiro do Ibope.

### 3 estrelas — Confiavel
- Real Time Big Data (Telefonica) — Series frequentes, amostra menor.
- Ideia/Canal Meio (Misto) — Parceria editorial Canal Meio.
- Futura Inteligencia (Misto) — Pesquisas nacionais e regionais.
- Gerp (Misto) — Frequente em rodadas semanais 2026.
- PoderData (Telefonica/Online) — Foco em tendencias politicas.
- Methodus (Presencial) — Atuacao regional forte.
- Ipespe (Presencial) — Menos frequente atualmente.

### 2 estrelas — Usar com cautela
- Verita (Presencial) — Erros metodologicos documentados.
- Ranking Brasil (Misto) — Menos historico disponivel.
- Alfa Inteligencia (Misto) — Instituto mais recente.
- Colectta (Online) — Metodologia digital.

---

## 7. CANDIDATOS MONITORADOS (7)

| Candidato | Partido | Cor | Polymarket | Pesquisas |
|---|---|---|---|---|
| Lula | PT | #DC2626 | 42.5% | 33-46% |
| Flavio Bolsonaro | PL | #0F52BA | 36.5% | 37-52% |
| Renan Santos | Missao | #8B5CF6 | 6.05% | 1-4.5% |
| Fernando Haddad | PT | #DC2626 | 6.7% | 21-38% (s/ Lula) |
| Ronaldo Caiado | PSD | #6B7280 | 2.2% | 3-5% |
| Romeu Zema | Novo | #F59E0B | 1.75% | 3-6% |
| Tarcisio de Freitas | Republicanos | #059669 | 0.4% | 33% (solo) |

---

## 8. CATEGORIAS DE NOTICIAS (7)

| Categoria | Queries Google News |
|---|---|
| Presidencia | eleicoes 2026 presidente, Flavio Bolsonaro Lula 2026 |
| Governadores | governador eleicao 2026 |
| Senado | senado eleicao 2026 |
| Banco Master | Banco Master BRB |
| INSS | INSS Lulinha CPI |
| STF | STF Moraes Toffoli Gilmar Dino |
| Congresso | Alcolumbre Senado Hugo Motta Camara |

Portais Firecrawl: Poder360, Metropoles, CNN Brasil, Gazeta do Povo, UOL

---

## 9. SECOES DO DASHBOARD

| # | Secao | Fonte | Atualizacao |
|---|---|---|---|
| 1 | Polymarket (6 mercados) | API Polymarket ao vivo | 2h ISR |
| 2 | Pesquisas Eleitorais | polls-data.json | Manual |
| 3 | Analise Criteriosa (4 cards) | analysis-criteriosa.json | Manual |
| 4 | Perfil dos Candidatos (7 cards) | Hardcoded no page.tsx | Manual |
| 5 | Live Eleicoes News 120' | Google News + Firecrawl | 30min ISR |
| 6 | Sentimento Popular | analysis-data.json | Manual |
| 7 | Escandalo INSS | analysis-data.json | Manual |
| 8 | Banco Master | analysis-data.json | Manual |
| 9 | STF (impeachment 14.5%) | analysis-data.json | Manual |

Modais: Sobre, Metas, Global (11+ eleicoes mundiais com mapa SVG)

---

## 10. INTERFACES TYPESCRIPT (13)

Market — question, outcomePrices[], outcomes[], volumeNum, active, closed
PolyEvent — title, slug, markets[]
PolyData — presidential, secondPlace, thirdPlace, stf, senate, inflation, fetchedAt
Poll — institute, date, sample, margin, register, reliability, method, scenarios[], secondRound[]
PollData — lastUpdate, polls[], institutes[], polymarketComparison
NewsItem — title, source, url, time, category, summary
NewsData — updatedAt, totalNews, grouped, firecrawlActive, all[]
AnalysisSection — text1-4, direita, esquerda, terceiraVia, polymarket, impactoLula, conclusao, toffoli, moraes, gilmar, dino, nexo, analise
AnalysisData — updatedAt, cards (sentimento, inss, bancoMaster, stf)
GlobalElection — country, flag, date, type, lat, lng, polymarket
CritCandidate — rank, name, party, color, header, fortes[], fracos[], analise, caiado, haddad
QuadroRow — n, p, m, t, s, pc, mc
CritData — updatedAt, subtitle, candidates[], quadroComparativo[], cruzamento

---

## 11. DESIGN SYSTEM

| Elemento | Valor |
|---|---|
| Cor primaria | #0F52BA (Sapphire Blue) |
| Fundo | #FFFFFF |
| Texto | #1a1a1a |
| Card bg | #F8FAFC |
| Borda | #E2E8F0 |
| Fonte | Inter (Google Fonts, latin) |
| Container | max-w-6xl mx-auto |
| Cards | rounded-xl, p-6, border |
| Modais | fixed inset-0, bg-black/60, max-w-3xl |
| Barras | transition-all duration-700 |

### Cores dos Partidos
- PT: #DC2626 (vermelho)
- PL: #0F52BA (azul safira)
- PSD: #6B7280 (cinza)
- Novo: #F59E0B (ambar)
- Missao: #8B5CF6 (roxo)
- Republicanos: #059669 (verde)

---

## 12. SEO E SOCIAL

| Meta | Valor |
|---|---|
| title | AFOS Analytics — Eleicoes Presidenciais Brasil 2026 |
| description | Dashboard de inteligencia eleitoral com pesquisas de +17 institutos... |
| metadataBase | https://afos-analitica-2026.vercel.app |
| og:type | website |
| og:locale | pt_BR |
| og:image | Gerada dinamicamente (1200x630, edge runtime) |
| twitter:card | summary_large_image |
| robots | index: true, follow: true |

---

## 13. ACESSIBILIDADE

| Recurso | Implementacao |
|---|---|
| Skip-nav | Link oculto "Pular para conteudo principal" |
| Landmarks | role="banner" (header), role="main", role="contentinfo" (footer) |
| Modais | role="dialog" + aria-label em cada modal |
| Botoes | aria-label descritivo |
| Stars | aria-label="X de 5 estrelas" |

---

## 14. REGRAS DE ATUALIZACAO

| Dado | Arquivo | Como atualizar |
|---|---|---|
| Pesquisas novas | public/polls-data.json | Editar JSON + deploy |
| Analise Criteriosa | public/analysis-criteriosa.json | Editar JSON + deploy |
| Cards de analise | public/analysis-data.json | Editar JSON + deploy |
| Perfil candidatos | app/page.tsx (linhas 79-97) | Editar codigo + deploy |
| STF impeachment odds | app/page.tsx (buscar "14.5%") | Editar codigo + deploy |
| Eleicoes globais | app/api/global-elections/route.ts | Editar codigo + deploy |

Padrao: Todos os dados sao cruzamentos Polymarket (ao vivo) + institutos de pesquisa disponiveis na data da atualizacao.

---

## 15. VARIAVEIS DE AMBIENTE

| Variavel | Uso | Obrigatoria |
|---|---|---|
| FIRECRAWL_API_KEY | Deep scrape de portais | Nao (degrada gracefully) |
| VERCEL_OIDC_TOKEN | Auth de deploy Vercel | Automatica (.env.local) |

---

## 16. ELEICOES GLOBAIS MONITORADAS (11)

| Pais | Data | Tipo | Slug Polymarket |
|---|---|---|---|
| Brasil | Out 2026 | Presidencial | brazil-presidential-election |
| Colombia | 2026 | Presidencial | colombia-presidential-election |
| Franca | 2027 | Presidencial | french-presidential-election-2027 |
| Coreia do Sul | 2027 | Presidencial | south-korea-presidential-election |
| Mexico | Jun 2027 | Presidencial | mexico-presidential-election |
| Argentina | Out 2027 | Presidencial | argentina-presidential-election |
| Italia | 2027 | Parlamentar | italian-general-election |
| Japao | 2028 | Parlamentar | japan-general-election |
| EUA | Nov 2028 | Presidencial | presidential-election-winner-2028 |
| India | 2029 | Parlamentar | india-general-election |
| Reino Unido | 2029 | Parlamentar | uk-general-election |

---

## 17. METRICAS DO PROJETO

| Metrica | Valor |
|---|---|
| Total de linhas de codigo | ~1.650 |
| page.tsx | 1.060 linhas |
| APIs | 6 rotas (388 linhas) |
| Componentes reutilizaveis | 4 |
| Interfaces TypeScript | 13 |
| JSONs de dados | 3 |
| Pacotes instalados | 105 |
| Bundle (first load) | 101kB |
| Fotos de candidatos | 13 |
| Commits | 13 |

---

## 18. HISTORICO DE COMMITS

1. AFOS Analytics - Dashboard v1.0
2. README.md completo
3. Header + disclaimer Polymarket no footer
4. Titulo secao atualizado
5. Textos header e secao atualizados
6. Cruzamentos plural + fonte maior + mobile
7. Analise Criteriosa atualizada 01/Abr
8. Analysis cards atualizados 04/Abr
9. Fix XSS, remove recharts, add TypeScript types, SEO meta tags
10. Analise Criteriosa atualizada 04/Abr - Polymarket + AtlasIntel estaduais
11. Institutos ordenados por credibilidade
12. Refactor: OG image, JSON data extraction, components, accessibility
13. Analysis cards atualizados 04/Abr — Sentimento, INSS, Banco Master, STF

---

Documento gerado em 05/04/2026 por AFOS Analytics.
