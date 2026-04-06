# AFOS Analytics — Fontes de Dados Consultadas

**Data:** 05/04/2026 | **URL:** https://afos-analitica-2026.vercel.app

---

## FONTE 1: Polymarket (Mercado de Previsao)

| Item | Detalhe |
|---|---|
| O que e | Maior plataforma de mercados de previsao do mundo. Apostas com dinheiro real em eventos futuros |
| API | gamma-api.polymarket.com/events?slug=X&limit=1 |
| Autenticacao | Nenhuma — API publica |
| Frequencia | A cada 2 horas (ISR) |
| Dados extraidos | Probabilidades (odds), volume de apostas em USD, status do mercado |

### 6 Mercados monitorados

| # | Mercado | Slug | O que mede |
|---|---|---|---|
| 1 | Presidente 1T | brazil-presidential-election | Quem vence a presidencia |
| 2 | 2o lugar 1T | brazil-presidential-election-first-round-2nd-place | Quem vai ao 2o turno |
| 3 | 3o lugar 1T | brazil-presidential-election-first-round-3rd-place | Terceira forca |
| 4 | STF Impeachment | any-brazil-stf-justice-removed-by-impeachment-before-2027 | Risco institucional |
| 5 | Senado | next-brazil-senate-election-most-seats-won | Composicao legislativa |
| 6 | Inflacao 2026 | brazil-annual-inflation-2026 | Cenario economico |

### 11 Mercados globais (modal Global)

| Pais | Slug |
|---|---|
| Brasil | brazil-presidential-election |
| Colombia | colombia-presidential-election |
| Franca | french-presidential-election-2027 |
| Coreia do Sul | south-korea-presidential-election |
| Mexico | mexico-presidential-election |
| Argentina | argentina-presidential-election |
| Italia | italian-general-election |
| Japao | japan-general-election |
| EUA | presidential-election-winner-2028 |
| India | india-general-election |
| Reino Unido | uk-general-election |

Uso no cruzamento: Odds do Polymarket sao confrontadas com pesquisas de institutos para identificar divergencias — onde o dinheiro real discorda da intencao declarada de voto.

---

## FONTE 2: Google News RSS (Noticias ao Vivo)

| Item | Detalhe |
|---|---|
| O que e | Feed RSS publico do Google News, agregando +30 veiculos brasileiros |
| API | news.google.com/rss/search?q=X&hl=pt-BR&gl=BR&ceid=BR:pt-419 |
| Autenticacao | Nenhuma — RSS publico |
| Frequencia | A cada 30 minutos (ISR) |
| Dados extraidos | Titulo, fonte, URL, data de publicacao |
| Dedup | Primeiros 50 caracteres do titulo (case-insensitive) |
| Limite | 5 noticias por categoria, 35 total |

### 13 Queries executadas

| # | Query | Categoria | Filtro tempo |
|---|---|---|---|
| 1 | eleicoes 2026 presidente | Presidencia | when:1d (24h) |
| 2 | Flavio Bolsonaro Lula 2026 | Presidencia | when:1d |
| 3 | Caiado Tarcisio Zema Renan Santos 2026 | Presidencia | when:1d |
| 4 | governador eleicao 2026 | Governadores | when:1d |
| 5 | senado eleicao 2026 | Senado | when:1d |
| 6 | Banco Master BRB | Banco Master | when:1d |
| 7 | INSS Lulinha CPI | INSS | when:1d |
| 8 | STF Moraes Toffoli Gilmar Dino | STF | when:1d |
| 9 | Alcolumbre Senado Hugo Motta Camara | Congresso | when:1d |
| 10 | eleicoes 2026 pesquisa | Presidencia | when:1d |
| 11 | eleicoes 2026 presidente candidato | Presidencia | Sem filtro (fallback) |
| 12 | Banco Master escandalo BRB rombo | Banco Master | Sem filtro (fallback) |
| 13 | STF impeachment ministros 2026 | STF | Sem filtro (fallback) |

### Veiculos capturados via Google News (30+)

| Veiculo | Tipo | Alcance |
|---|---|---|
| Folha de S.Paulo | Jornal | Nacional |
| O Globo | Jornal | Nacional |
| Estadao | Jornal | Nacional |
| CNN Brasil | TV/Digital | Nacional |
| TV Globo / G1 | TV/Digital | Nacional |
| UOL Noticias | Portal | Nacional |
| Valor Economico | Economia | Nacional |
| Poder360 | Digital | Politica |
| Metropoles | Digital | Nacional |
| Gazeta do Povo | Jornal | Nacional/PR |
| Jovem Pan | Radio/Digital | Nacional |
| Correio Braziliense | Jornal | Nacional/DF |
| Band / BandNews | TV/Radio | Nacional |
| Record / R7 | TV/Digital | Nacional |
| SBT News | TV/Digital | Nacional |
| VEJA | Revista | Nacional |
| IstoE | Revista | Nacional |
| Epoca | Revista | Nacional |
| Revista Oeste | Digital | Nacional |
| CartaCapital | Revista | Nacional |
| Exame | Economia | Nacional |
| InfoMoney | Economia | Nacional |
| Terra | Portal | Nacional |
| MSN Brasil | Agregador | Nacional |
| Brasil 247 | Digital | Nacional |
| Radio Itatiaia | Radio | MG |
| ContraFatos | Digital | Regional |
| Portal CBN | Radio | Nacional |
| Tribuna da Internet | Digital | Nacional |
| ReporterMT | Digital | MT |
| MundoBA | Digital | BA |

---

## FONTE 3: Firecrawl API (Deep Scrape de Portais)

| Item | Detalhe |
|---|---|
| O que e | API de web scraping com IA que extrai conteudo principal de paginas |
| API | api.firecrawl.dev/v1/scrape |
| Autenticacao | Bearer token (FIRECRAWL_API_KEY) |
| Metodo | POST |
| Frequencia | A cada 30 minutos (junto com News) |
| Obrigatorio | Nao — degrada gracefully se chave ausente |

### Uso A: Extracao de headlines de portais (links)

| Portal | URL escaneada | Categoria padrao |
|---|---|---|
| Poder360 | poder360.com.br/tag/eleicoes-2026/ | Presidencia |
| Metropoles | metropoles.com/brasil/politica-brasil | Presidencia |
| CNN Brasil | cnnbrasil.com.br/politica/ | Congresso |
| Gazeta do Povo | gazetadopovo.com.br/eleicoes/2026/ | Presidencia |
| UOL | noticias.uol.com.br/politica/ | Presidencia |

Payload: url, formats: links, onlyMainContent: true
Filtro: texto entre 30-200 caracteres, exclui "Assine" e "Login"
Limite: 8 links por portal

### Uso B: Enriquecimento de headlines (summaries)

- Top 3 noticias recebem resumo via Firecrawl
- Payload: url, formats: markdown, onlyMainContent: true
- Resumo cortado em 200 caracteres + "..."
- Exclui URLs do news.google.com

---

## FONTE 4: Institutos de Pesquisa (17 monitorados)

### 5 estrelas — Referencia nacional

| Instituto | Metodo | Nota |
|---|---|---|
| Datafolha | Presencial | Mais tradicional do Brasil. Grupo Folha |
| Quaest/Genial | Presencial | Encomendada por bancos/investidores. Alta precisao |

### 4 estrelas — Alta confiabilidade

| Instituto | Metodo | Nota |
|---|---|---|
| AtlasIntel | Online/Big Data | Metodologia digital. Parceria Bloomberg |
| Parana Pesquisas | Presencial | Forte em estaduais e nacionais |
| MDA | Presencial | Um dos que mais acertou historicamente |
| Ipec (ex-Ibope) | Presencial | Herdeiro do Ibope |

### 3 estrelas — Confiavel

| Instituto | Metodo | Nota |
|---|---|---|
| Real Time Big Data | Telefonica | Series frequentes, amostra menor |
| Ideia/Canal Meio | Misto | Parceria editorial Canal Meio |
| Futura Inteligencia | Misto | Pesquisas nacionais e regionais |
| Gerp | Misto | Frequente em rodadas semanais 2026 |
| PoderData | Telefonica/Online | Foco em tendencias politicas |
| Methodus | Presencial | Atuacao regional forte |
| Ipespe | Presencial | Menos frequente atualmente |

### 2 estrelas — Usar com cautela

| Instituto | Metodo | Nota |
|---|---|---|
| Verita | Presencial | Erros metodologicos documentados |
| Ranking Brasil | Misto | Menos historico disponivel |
| Alfa Inteligencia | Misto | Instituto mais recente |
| Colectta | Online | Metodologia digital |

Dados extraidos de cada pesquisa: instituto, data, amostra, margem de erro, registro TSE, metodologia, cenarios de 1o turno (multiplos), simulacoes de 2o turno, aprovacao/rejeicao.

---

## FONTE 5: Analise editorial AFOS (cruzamento manual)

| Item | Detalhe |
|---|---|
| O que e | Analise proprietaria que cruza todas as fontes acima |
| Metodo | Busca manual via Google News, leitura de portais, consulta Polymarket ao vivo |
| Frequencia | A cada atualizacao manual (tipicamente diaria ou quando evento relevante ocorre) |

### 3 arquivos JSON de analise

#### analysis-data.json — 4 cards tematicos

| Card | Conteudo | Fontes cruzadas |
|---|---|---|
| Sentimento Popular | Aprovacao/rejeicao, redes sociais, espectro politico | AtlasIntel/Arko, Nexus/BTG, PoderData, Polymarket, Google News |
| INSS | CPI, Lulinha, delacao Vorcaro, impacto eleitoral | Gazeta do Povo, CNN Brasil, Estadao, Folha, VEJA, BBC |
| Banco Master | BRB, rombo, voos Moraes, delacao, paraisos fiscais | Agencia Brasil, G1, Folha, CNN, SBT News, MundoBA |
| STF | Toffoli, Moraes, Gilmar, Dino, impeachment | O Globo, Poder360, Gazeta do Povo, Folha, Estadao |

#### analysis-criteriosa.json — 4 candidatos

| Card | Conteudo | Fontes cruzadas |
|---|---|---|
| Lula (1o) | Fortes/fracos, Polymarket + 7 institutos | Polymarket + AtlasIntel + Parana + Nexus/BTG + Gerp + Quaest + Datafolha |
| Flavio (2o) | Fortes/fracos, estaduais + rejeicao | Polymarket + AtlasIntel estaduais (PR, SC, MG, SP, AP) + nacionais |
| Renan (3o) | Divergencia pesquisas vs mercado | Polymarket (3o lugar) + 5 institutos |
| Caiado/Haddad (4o) | Plano B do PT, estagnacao PSD | Polymarket + VEJA + AtlasIntel + Datafolha |

#### polls-data.json — Pesquisas brutas

| Dado | Fontes |
|---|---|
| 6 pesquisas completas | Parana Pesquisas, Nexus/BTG, AtlasIntel, Datafolha, Quaest, Gerp, RTBD |
| Comparativo Pesquisa vs Polymarket | Cruzamento dos 7 institutos com odds Polymarket |
| Aprovacao governo | Nexus/BTG + PoderData |
| Comparacao historica | FHC 2002, Lula 2006, Dilma 2014, Bolsonaro 2022, Lula 2026 |

---

## RESUMO: FLUXO COMPLETO DE CRUZAMENTO

```
POLYMARKET (ao vivo, 6 mercados, 17+ candidatos)
        cruzamento
PESQUISAS (17 institutos, 6 pesquisas recentes, multiplos cenarios)
        cruzamento
NOTICIAS (30+ veiculos via Google News + 5 portais via Firecrawl)
        cruzamento
ANALISE AFOS (editorial: fortes/fracos, sentimento, escandalos, STF)

DASHBOARD (tudo em um unico painel visual, mobile e desktop)
```

Regra fundamental: Todos os dados apresentados sao cruzamentos Polymarket (dinheiro real) + institutos de pesquisa (intencao declarada) + noticias (contexto) na data da atualizacao. Nenhuma fonte e apresentada isoladamente — o valor esta no cruzamento.

---

Documento gerado em 05/04/2026 por AFOS Analytics.
