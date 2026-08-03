# AFOS Analytics

![AFOS Analytics](public/social-preview.jpg)

🇧🇷 Português | 🇺🇸 [Read in English](README.md)

### Plataforma Global, inédita, cruzamento em tempo real entre mercados de previsão, pesquisas eleitorais e notícias.

Construído e validado durante o ciclo eleitoral 2026 em países na América do Sul + 15 países. Análises diárias.

**Agregando mais de 400 fontes** (5 grandes mercados globais de previsão + 100+ institutos de pesquisa + 300+ meios de comunicação e redes sociais, 20+ idiomas) em **14+ países.**

[![GitHub Stars](https://img.shields.io/github/stars/AFOS-Analytics/afos-analitica-2026?style=flat&logo=github&label=Stars&color=0F52BA)](https://github.com/AFOS-Analytics/afos-analitica-2026/stargazers)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Harvard Dataverse](https://img.shields.io/badge/Harvard%20Dataverse-AFOS%20Analytics%20collection-0F52BA)](https://dataverse.harvard.edu/dataverse/afos-analytics)
[![Contato](https://img.shields.io/badge/contato-afos--analytics.com-0F52BA?logo=maildotru&logoColor=white)](mailto:contact@afos-analytics.com)
[![Segurança](https://img.shields.io/badge/segurança-disclosure-d32f2f?logo=keycdn&logoColor=white)](mailto:security@afos-analytics.com)

**[afos-analytics.com](https://afos-analytics.com)**

> *Democracy runs on information. Information runs on transparency. AFOS Analytics is programmable transparency worldwide.*

> Pipeline escalável com cron, Redis e Neon. Adicione fontes por país conforme as eleições se aproximam.

---

## Sobre

O **AFOS Analytics** é a plataforma inédita no mundo de inteligência de risco político eleitoral que cruza em tempo real:

- **Mercados de previsao** com dinheiro real (Polymarket), odds atualizadas a cada 30 minutos
- **Pesquisas eleitorais** oficiais do TSE + 17 institutos brasileiros
- **Noticias ao vivo** da grande imprensa
- **Analises estrategicas** com inteligencia artificial
- **AFOS Daily**, sintese narrativa diaria cruzando as tres fontes, com link auditavel por alegacao. Validada em piloto de 7 dias (22-28/Abr/2026), agora permanente, **61 edicoes publicadas ate 21/Jun/2026** (D+38 do lancamento publico), em 3 idiomas (PT-BR, EN, ES) com arquivo completo em `/daily/[data]`. Distribuicao por email para assinantes optados-in via Resend Pro
- **AFOS Tradeoff**, leitura tecnica semanal publicada toda segunda, voltada para research institucional, buy-side e tesouraria. Cruza os mesmos tres sinais mas reporta **separadamente** (sem compostos de media ponderada), quando mercado de previsao, pesquisa e noticia divergem, a divergencia *e* o sinal. Estruturada em 9 secoes (cards de resumo executivo, racional anti-media, cenarios ponderados, grade de indicadores, liquidez e estrutura de mercado, calendario de prints, watch list, metodologia, leitura adicional). Publicada em 3 idiomas (PT-BR, EN, ES) com arquivo completo em `/tradeoff/[pais]/[data]` (`/br`, `/us`). RSS: `/feed/tradeoff.xml`
- **AFOS Chat**, agente conversacional disponivel como **bolha flutuante em todas as paginas** (e em tela cheia em `/chat`) que responde em linguagem natural consultando os **dados ao vivo da plataforma via tool-calling**: odds do Polymarket, pesquisas TSE, os **casos validados & divergencia mercado×pesquisa**, noticias e a ultima edicao do AFOS Daily, **toda resposta cita a fonte**, com as mesmas regras de honestidade radical (mercado de previsao e probabilidade implicita, nao previsao; divergencia e o sinal, o resultado real e o validador). Trilingue (PT-BR, EN, ES), respostas em streaming, com **OpenRouter (DeepSeek V4 Flash)**. Publico com rate-limit por IP

Cobertura de **14+ paises** com eleicoes monitoradas, em **3 idiomas** (PT-BR, EN, ES).

**Open Source. Gratuito. Mobile e desktop.**

### Demo da plataforma (~90 segundos)

[![AFOS Analytics, demo (clique para tocar)](public/screenshots/landing.png)](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-en.mp4)

> **Clique na imagem acima para tocar** (~9 MB, audio em PT-BR com legendas em ingles embutidas). Cobre: cruzamento em tempo real, mercados de previsao, pesquisas eleitorais, agregacao de noticias e a sintese narrativa **AFOS Daily**. Trilhas alternativas: [`public/demo.mp4`](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo.mp4) (sem legendas) e [`public/demo-audio.m4a`](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-audio.m4a) (apenas audio).

---

## Comunidade

- 💬 **Dúvidas & ideias** → [GitHub Issues](https://github.com/AFOS-Analytics/afos-analitica-2026/issues) · [Discussions](https://github.com/AFOS-Analytics/afos-analitica-2026/discussions)
- 🏢 **GitHub Organization** → [github.com/AFOS-Analytics](https://github.com/AFOS-Analytics)
- 🐦 **Twitter / X** → [@AFOS_Analytics](https://x.com/AFOS_Analytics)
- 🦋 **Bluesky** → [@afos-analytics.com](https://bsky.app/profile/afos-analytics.com)
- 🚀 **Product Hunt** → [@afosanalytics](https://www.producthunt.com/@afosanalytics)
- 📧 **Imprensa, parcerias, geral** → [contact@afos-analytics.com](mailto:contact@afos-analytics.com)
- 💡 **Suporte e ajuda ao usuário** → [support@afos-analytics.com](mailto:support@afos-analytics.com)
- 🔒 **Disclosure de vulnerabilidades** → [security@afos-analytics.com](mailto:security@afos-analytics.com) (ver [SECURITY.md](SECURITY.md))
- 👤 **Contato direto com o founder** → [founder@afos-analytics.com](mailto:founder@afos-analytics.com)

Open source. O **código** é licenciado sob **Apache 2.0**; os **dados** (ex.: o dataset público de divergência espelhado diariamente no [Hugging Face](https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence)) são licenciados sob **CC BY 4.0**, ambos exigem atribuição ao AFOS Analytics. Contribuições bem-vindas, veja [CONTRIBUTING.md](CONTRIBUTING.md). O uso da marca "AFOS Analytics" (nome e logo) é regido pelo [TRADEMARK.md](TRADEMARK.md). Contribuições para a plataforma hospedada (onboarding de um novo país) são documentadas em [docs/platform/add-your-country.md](docs/platform/add-your-country.md) e o modelo público de governança é explicado em `/methodology/automated-governance`.

---

## Arquitetura

### Rotas Principais

| Rota | Conteudo |
|------|---------|
| `/[locale]` | Landing page (seletor de cor + idioma) |
| `/[locale]/dashboard` | **Redirect 307 para `/dashboard/br`** desde 29/Jul/2026, quando o painel ganhou pais no endereco. Link antigo nunca quebra |
| `/[locale]/dashboard/br` | Painel Brasil, dashboard interativo com dados ao vivo, logo do header volta para landing. Apos os cards de odds do Polymarket traz o **grafo do cruzamento navegavel** (o "cerebro"): divergencia mercado×pesquisa ao vivo + nos clicaveis para o dataset do Brasil no HF, o card de contexto estrutural, os produtos da plataforma, as secoes do dashboard e o Harvard Dataverse |
| `/[locale]/dashboard/us` | Painel EUA, midterms de 2026 (3/Nov). **PUBLICADO em 01/Ago/2026**: indexavel, no sitemap, no `llms.txt`, avisado ao IndexNow e ligado no seletor de pais. Sete blocos: cartao de apresentacao, mercado de previsao (8 mercados do Polymarket, cada card clicavel ate a aposta real), distribuicao de cadeiras republicanas no Senado, pesquisas do generic ballot da **Camara**, grafo do cruzamento, contexto estrutural do Banco Mundial, imprensa (automatica, lista fixa de veiculos) e limitacoes declaradas. ⚠️ **A aresta mercado×pesquisa do grafo e MUDA**: o mercado da a probabilidade de controlar a casa e a pesquisa da a vantagem em pontos de voto, entao nao se exibe Δpp, de proposito. Mercado de faixa so entra na tela se as faixas somarem entre 95% e 105%; o de margem do voto popular e coletado todo dia e fica fora da tela, em ~145%. **O leitor do generic ballot tem dois portoes**: um de forma (linha sem data de campo ou com instituto ilegivel) e um **de valor** (partido fora de 15-70%, ou a soma dos dois acima de 100). Os dois descartam *e contam*, nunca em silencio. O de valor entrou em 01/Ago/2026 depois de uma linha sair como "D 914 x R 3,2", em que 914 era o tamanho da amostra e 3,2 a margem de erro: a origem usa `rowspan` tambem na coluna da margem, entao as linhas seguintes deslizavam uma coluna. O leitor passou a resolver `rowspan` por indice de coluna |
| `/[locale]/daily` | AFOS Daily, sintese narrativa diaria cruzando mercados de previsao, pesquisas e noticias. Disponivel em **3 idiomas** (PT-BR, EN, ES), loader detecta `{data}.{locale}.md` com fallback para o PT-BR canonico. Termos politicos brasileiros (TSE, STF, BolsoMaster, etc.) preservados em PT com links inline para o glossario trilingue. **Rota indice = arquivo de edicoes** (lista agrupada por mes de todas as edicoes publicadas, ultima destacada, pular-para-data + seletores de idioma e tema na pagina); edicoes individuais ficam em `/[locale]/daily/[date]` com prev / next + navegacao "Todas as edicoes" |
| `/[locale]/tradeoff` | AFOS Tradeoff, leitura tecnica semanal (segundas) voltada para research institucional / buy-side / tesouraria. Tres sinais reportados separadamente, divergencia *e* o sinal, nao ruido a mediar. 9 secoes estruturadas renderizadas via YAML rich-frontmatter (cards de resumo, racional anti-media, cenarios ponderados, grade de indicadores, liquidez e estrutura de mercado, calendario de prints, watch list, metodologia, leitura adicional). Paridade tri-locale com Daily (`{data}.{locale}.md`). **Rota indice = arquivo de edicoes** (lista por numero de edicao e semana, ultima destacada, seletores de idioma e tema na pagina); edicoes ficam em `/[locale]/tradeoff/[pais]/[date]` com prev / next + navegacao "Todas as edicoes". RSS: `/feed/tradeoff.xml` |
| `/[locale]/weekly/[pais]/[data]` | **AFOS Weekly, PILOTO (nao publicado).** Terceiro produto: editorial, escrito para o eleitor comum, sobre as midterms dos EUA de 2026, as quintas. A fronteira com o Tradeoff esta escrita no codigo: o Tradeoff responde "quanto o mercado de previsao esta pagando", o Weekly responde "quem esta discordando de quem, e o que isso significa para quem vai votar". 7 secoes (TL;DR, o que o mercado de previsao fez, o que as pesquisas fizeram, o que a imprensa contou, o cruzamento da semana, como ler este numero, fontes). 🔴 **O INGLES e o idioma de ORIGEM**, ao contrario de todos os outros produtos: PT-BR e ES sao derivados, e falta de traducao cai para o ingles, nunca para o portugues. `lib/afos-weekly/` nao importa nada de `afos-tradeoff` nem de `afos-daily`, e nenhum deles importa daqui, de proposito: um piloto nao pode ter como quebrar dois produtos que ja estao no ar. Tres travas o mantem fora de producao durante o piloto (portao de rascunho devolve 404, a rota `latest` ignora rascunho em producao, e a pagina e `noindex` mesmo depois de publicada) |
| `/[locale]/global` | Hub global de eleicoes, **lidera com os casos validados** (divergencia mercado × pesquisa vs o resultado real, com datasets abertos) seguidos do **mapa de odds ao vivo** (D3.js). Mesmo destino do card "AFOS Global" da landing e do link Global no header do dashboard (fonte unica) |
| `/[locale]/chat` | **AFOS Chat**, agente conversacional com acesso a dados ao vivo via tool-calling (odds Polymarket, pesquisas TSE, casos validados & divergencia, noticias, AFOS Daily); toda resposta cita a fonte. Respostas em streaming (SSE), trilingue, OpenRouter / DeepSeek V4 Flash. Tambem montado no site todo como **bolha de chat flutuante** (lazy-load, oculta nesta pagina dedicada) |
| `/[locale]/country/[country]` | Pagina por pais (15 paises). Casos validados trazem a **analise de divergencia** mercado×pesquisa (tabela + barras de odds "🏆 Quem venceu?" embutidas + grafico de trajetoria), o bloco **Contexto estrutural** e um **grafo do cruzamento** force-directed (estilo Obsidian, d3-force) que mapeia a eleicao contra seus mercados, pesquisas, imprensa e contexto, com a divergencia desenhada como aresta colorida com o Δpp; theme-aware (light / Sapphire), trilingue. O header traz os botoes solidos Dashboard + voltar responsivo "← Cobertura Global / ← Global" (ambos invertem para branco no tema Sapphire) |
| `/[locale]/how-it-works` | Guia didatico da metodologia (3 idiomas), "O Metodo". Seletor de idioma na pagina (PT-BR/EN/ES). Tour pela plataforma com 14 secoes incluindo o card AFOS Daily (`#afos-daily-card`), a secao do **AFOS Tradeoff** semanal (`#afos-tradeoff-card`), a secao do **AFOS Global** (`#afos-global-card`) documentando a camada de casos validados (o conceito de probabilidade-de-vencer vs participacao-de-votos, as paginas de divergencia por pais e eleicao, e os datasets abertos) e criterios de avaliacao dos institutos (`#criterios-institutos`); o "Comece por aqui" orienta o leitor tanto ao Daily quanto ao Tradeoff. Encerra com uma **seção FAQ** visível (`#faq`) renderizada da mesma fonte do JSON-LD FAQPage (paridade texto-visível × schema para o rich result). Usa constantes Tailwind compartilhadas (`styles.ts`) para consistencia visual entre idiomas |
| `/[locale]/white-paper` | **White Paper**, o documento de objetivos e método do projeto (3 idiomas), uma nota de trabalho citável: a pergunta (mercados vs pesquisas), a tese falseável (*a divergência é o sinal*), o que integramos, validação **inclusive das falhas** (ex.: o mercado de voto popular dos EUA em 2024), dados abertos, objetivos, questões em aberto e limitações. Shell de página de leitura com seletor de idioma PT-EN-ES na página e toggle de tema claro / Sapphire Blue (chave compartilhada `afos-daily-theme`) |
| `/[locale]/methodology/automated-governance` | Pagina publica de governanca (3 idiomas), como a plataforma hospedada aplica integridade editorial via codigo (validadores automaticos + prompt rules versionadas), os 2 caminhos de interacao (Fork / Country Onboarding) e as 3 excecoes onde o humano intervem |
| `/[locale]/latam` · `/[locale]/eu` | Hubs regionais (America Latina, Europa), 3 idiomas. Wordmark AFOS + header com botao "Dashboard". **Paises monitorados** como cards clicaveis (bandeira SVG + nome + regiao + proxima eleicao + CTA "Ver pais →" → `/country/[country]`) e **eleicoes relacionadas** como linhas (bandeira SVG + badge de status colorido e localizado, Ativa / Concluida / Proxima, + "Ver eleicao →" → `/election/[slug]`), mais uma grade de botoes de inteligencia institucional. Componente `RegionPage` compartilhado; bandeiras via `ISO3_TO_CC` → `/flags/{cc}.svg` (sem emoji, Windows-safe) |

### Landing Page

- Seletor de tema (branco/azul primary) com transicao animada
- Seletor de idioma (PT-BR/EN/ES) com mini-menu dropdown
- Bandeiras SVG (compativel com todos os dispositivos incluindo Windows)
- Formulario de captura de lead integrado com sistema de visitor tracking
- SEO otimizado com claim "Plataforma inedita no mundo" em metadata
- **Fluxo de leitura (revisado 29/Mai/2026):** Hero → ProductsSection (3 cards: Daily / Tradeoff / Global) → Stats → Captura de email ("Ou receba análises semanais...") → Features → Países → CTA Final "Acessar Dashboard". A captura de leads subiu na página para converter antes do usuário rolar até depois das Features; CTA intermediario redundante removido (somente botões nav-topo e CTA Final permanecem). Links Daily / Tradeoff / Global sempre usam a rota indice (`/{locale}/daily`, `/{locale}/tradeoff`), nunca data hardcoded, para que novas edicoes sejam auto-descobertas. A partir de junho/2026 essas rotas indice **sao o arquivo de edicoes** (uma lista navegavel, agrupada por mes, de todas as edicoes, com seletores de idioma e tema na pagina), nao um redirect para a ultima edicao; a edicao mais recente fica destacada no topo, a um clique de distancia.
- **Regra de design "cores invertidas":** componentes que precisam destacar do fundo da pagina invertem nos temas, tema light = componentes Sapphire Blue (cards, CTA, caixa do subtitle) com texto branco; tema Sapphire Blue = componentes brancos com texto cor primaria. Aplicado consistentemente em ProductsSection, CTA dashboard, caixa do subtitle do hero **e em todo botao de acao solido nas superficies com tema** (os botoes Dashboard / Global / voltar-ao-pais / navegacao de edicao nas paginas de pais, eleicao, AFOS Daily, AFOS Tradeoff, seus arquivos, white paper e how-it-works); as paginas estaticas so-light (glossario, governanca, hubs global/regiao, for-investors) mantem o botao Sapphire por nunca renderizarem em fundo escuro.
- **Footer compartilhado (compact):** a home renderiza o `<Footer compact />` abaixo da landing, somando link-juice interno (colunas Navegacao / Open Source / Legal para latam, eu, about, glossary, legais e governanca) a partir da pagina de maior autoridade. A variante `compact` esconde os blocos redundantes que a landing ja tem (fileira social, contatos, pilula Harvard, voltar ao topo) e alguns links de coluna duplicados; as demais paginas usam o footer completo.

### Sistema de Captura de Leads (Visitor State)

```
Sessao 1-3: Dashboard livre + popup suave (30s + scroll, max 3 dismissals)
Sessao 4+:  Gate obrigatorio (blur + formulario premium)
Apos cadastro: Acesso ilimitado, sem popup/gate
```

| Componente | Funcao |
|---|---|
| `visitor_states` (Neon) | Rastreia visitantes anonimos por visitor_id |
| `POST /api/visitor/state` | Cria/retorna estado do visitante |
| `POST /api/visitor/session` | Registra sessao qualificada (30s + scroll) |
| `POST /api/visitor/dismiss` | Registra dismissal do popup (max 3) |
| `POST /api/visitor/migrate` | Migra inscritos antigos (localStorage → backend) |
| `useVisitorState` hook | Estado central no cliente (cookie + backend) |
| `VisitorStateProvider` | Context React para dashboard |
| `SubscribeForm` | Formulario compartilhado (popup + gate + landing + inline) |
| `InlineSubscribe` | Bloco no fim das edicoes do AFOS Daily e do Tradeoff |
| `DashboardGate` | Blur overlay na 4a sessao |
| `EmailPopup` | Popup suave nas 3 sessoes livres |

**Seguranca:** Backend e fonte de verdade (nao localStorage). Timeout 3s com fallback. Dedup atomico via Redis SET NX. Honeypot anti-bot. Rate limiting.

**Inscricao inline (fim de cada edicao publicada).** O AFOS Daily e o Tradeoff sao o
conteudo recorrente da plataforma e, ate julho de 2026, eram as unicas superficies sem
caminho de assinatura na propria pagina. O `InlineSubscribe` fecha essa lacuna: ele
envolve o mesmo `SubscribeForm`, entao herda honeypot, validacao inline, consentimento
explicito LGPD, correcao de erro de digitacao e o redirecionamento para `/welcome`,
**onde o assinante escolhe o idioma em que quer receber** (portugues, ingles ou espanhol).
A copy existe nos tres idiomas e o bloco se adapta aos dois temas da pagina (claro e
Sapphire Blue).

O `captureSource` separa `daily` e `tradeoff` de `popup`, `gate` e `landing`, o que
permite medir se o conteudo recorrente converte, sem nenhum pixel de rastreamento em
e-mail.

### Pipeline de Dados (Cron + Upstash Redis + Neon)

```
Background:  Cron 30min  → Polymarket (18 mercados paralelo) → Upstash Redis + Neon
Usuario:     Requisicao  → Redis read (<1ms) → resposta
```

**Arquitetura de cron unico (otimizada para custo + carga):** um unico cron de 30 minutos escreve tanto no Redis (caminho quente para usuarios) quanto no Neon (snapshot historico). Decisao documentada em abril/2026 apos analise de risco/custo: a cadencia de 5 minutos criava pressao excessiva em Vercel e Upstash sob picos de trafego sem ganho relevante de UX (movimentos do Polymarket raramente exigem granularidade sub-30-minutos para analises eleitorais cruzadas). A cadencia de 30 minutos permite scale-to-zero do Neon entre ticks, simplifica operacao (um unico cron) e preserva o diferencial real-time atraves do cruzamento em si, nao da frequencia de polling.

**Cascata de fallback (4 niveis):**

| Nivel | Condicao | Resposta |
|-------|----------|----------|
| 1 | Redis com dados frescos | <1ms (99.9% dos casos) |
| 2 | Redis vazio | Fetch direto Polymarket (~4s) |
| 3 | Polymarket falhou | Dados em memoria (ultimo resultado bom) |
| 4 | Sem nenhum dado | HTTP 503 + Retry-After: 60 |

### Arquitetura URL-Primary (integridade editorial do AFOS Daily)

Cada alegacao no AFOS Daily precisa linkar para o **artigo especifico** que a sustenta, nao para a home do veiculo. Garantido por 5 camadas cooperantes:

| Camada | Componente | Funcao |
|--------|------------|--------|
| 1 | `scripts/fetch-google-news.mjs` | Coleta o RSS do Google News preservando as URLs primarias do `<link>` (o redirect para o artigo funciona ate em veiculos anti-bot). Fetch paralelo via `Promise.all`, retry com backoff, fail-fast em erros parciais |
| 2 | Fluxo hibrido na skill `/afos-daily` | WebSearch com `allowed_domains` para 3-5 materias-ancora (URLs primarias limpas); redirect do cache do Google News para o resto |
| 3 | `scripts/wayback-archive.ts` | Snapshot das URLs citadas no archive.org antes de publicar (preservacao de evidencia) |
| 4 | `scripts/precommit-afos-daily-urls.py` (hook PreToolUse) + `lib/afos-daily/validator.ts` | Bloqueia `Write/Edit/MultiEdit` em `public/afos-daily/*.md` se detectar URLs proibidas (`gamma-api.polymarket.com`, links markdown no rodape de texto puro "Fontes citadas"). Alerta se a razao de homepage for >30% ou a densidade de links for <80% por paragrafo substancial |
| 5 | `.claude/commands/afos-daily.md` (regras da skill) | Documenta a hierarquia de URLs, os gates de validacao e os principios editoriais aplicados em codigo |

**Validador manual:** `npx tsx scripts/validate-afos-daily.ts {date} [--locale=en\|es]` sai com 1 em erros criticos (igual ao hook PreToolUse). Usado nos checks de CI e no fluxo do operador antes do commit.

**Razao de fontes editoriais (regra 50/50, firmada em 9/Mai/2026):** cada AFOS Daily usa **no minimo 50% de veiculos-ancora via RSS direto** (Folha de S.Paulo, O Globo, G1, Estadao, Valor, VEJA, credibilidade institucional) **+ no minimo 50% de veiculos secundarios via redirect do Google News** (Poder360, BBC, Canal MyNews, CartaCapital, InfoMoney, CBN, Gazeta do Povo, Exame, etc., acesso aberto, reproduzem a cobertura-ancora sem paywall). Refinamento da regra anterior 30/70, motivado pela observacao de que veiculos-ancora frequentemente colocam conteudo em paywall para nao-assinantes (sobretudo leitores internacionais); os secundarios replicam a mesma cobertura com acesso aberto. Aplica-se uniformemente a PT-BR / EN / ES. As traducoes preservam as URLs como coletadas no idioma de origem.

### Estrutura do Projeto

```
app/
├── [locale]/
│   ├── layout.tsx                     # Layout por locale (metadata + i18n)
│   ├── page.tsx                       # Landing page (LandingPageDual)
│   ├── dashboard/
│   │   ├── layout.tsx                 # Metadata SEO do dashboard
│   │   └── page.tsx                   # Dashboard + Gate + Popup
│   └── global/page.tsx                # Mapa global traduzido
├── components/
│   ├── LandingPageDual.tsx            # Landing com seletor cor/idioma
│   ├── DashboardGate.tsx              # Gate blur overlay
│   ├── EmailPopup.tsx                 # Popup suave
│   ├── SubscribeForm.tsx              # Formulario compartilhado
│   ├── InlineSubscribe.tsx            # Bloco de inscricao no fim das edicoes (Daily + Tradeoff)
│   ├── FlagImg.tsx                    # Bandeira SVG cross-platform
│   ├── Header.tsx / Footer.tsx        # Header e footer traduzidos
│   ├── PolymarketSection.tsx          # Odds ao vivo
│   ├── PollsSection.tsx               # Pesquisas eleitorais
│   ├── global-map/                    # D3 + TopoJSON + SVG
│   └── ...                            # Demais secoes do dashboard
├── hooks/
│   ├── useDashboardData.ts            # Data fetching (5 APIs paralelo)
│   └── useVisitorState.tsx            # Estado do visitante (context)
├── api/
│   ├── visitor/state/session/dismiss/migrate/  # Visitor tracking
│   ├── subscribe/                     # Captura email
│   ├── cron/refresh-elections/        # Cron 30min → Redis + Neon (unificado)
│   ├── cron/refresh-polls/            # Cron 3x/dia → TSE (Brasil)
│   ├── cron/refresh-us-polls/         # Cron diario 07:10 UTC → generic ballot EUA
│   ├── cron/refresh-us-press/         # Cron 3x/dia → imprensa EUA, HIBRIDO (15 RSS proprios + Google News)
│   ├── admin/analytics/               # Analytics detalhado (Neon)
│   ├── admin/search-console/          # Google Search Console API
│   ├── admin/metrics/                 # Dashboard executivo
│   └── ...                            # Demais endpoints
├── lib/
│   ├── polymarket/                    # Client, registry, bootstrap, persist
│   ├── email/                         # Subscribers, Resend, templates
│   ├── cache/                         # Cache multi-camada
│   └── kv.ts                          # Wrapper Upstash Redis
lib/
├── db.ts                              # Prisma singleton (Neon)
├── visitor/constants.ts               # Constantes centralizadas do visitor system
├── visitor/id.ts                      # Visitor ID (cookie + localStorage)
├── seo/metadata.ts                    # buildMetadata() com claim + hreflang
├── seo/schema.ts                      # 6 schemas JSON-LD
├── validations/index.ts               # Zod schemas
├── audit.ts                           # Audit trail
├── consent.ts                         # LGPD consent
├── ai/                                # Guardrails, translate, prompts
├── i18n/                              # Config, messages, glossary
├── governance/                        # Data lifecycle, LGPD
└── security/                          # Output sanitization
prisma/
├── schema.prisma                      # 20 tabelas, 6 schemas
└── migrations/
public/
├── flags/                             # 16 bandeiras SVG (cross-platform)
├── geo/world-110m.json                # TopoJSON para mapa global
└── ...
```

---

## Internacionalizacao (i18n)

| Idioma | Rota | Status |
|--------|------|--------|
| Portugues (BR) | `/pt-BR` | Default |
| English | `/en` | Completo |
| Espanol | `/es` | Completo |

- **244+ chaves** × 3 idiomas = 732+ strings traduzidas
- **Language Switcher**: dropdown na landing e no dashboard
- **Cookie** `NEXT_LOCALE`: persiste preferencia
- **Content-Language**: header dinamico por locale no middleware
- **Geo tags**: `geo.region` e `geo.placename` por locale (BR/Global/LATAM)

### O conteudo editorial, nao so a moldura

Ate julho de 2026 a interface era traduzida, mas a **analise** do dashboard nao: o `/en` e o `/es` renderizavam o texto editorial inteiro em portugues. Os tres JSONs editoriais passaram a ter um arquivo por idioma, lidos pelo `readLocalized` em `lib/dashboard/static-data.ts`:

```
public/analysis-data.{en,es}.json          cartoes de sentimento, INSS, Banco Master, STF
public/analysis-criteriosa.{en,es}.json    analise por candidato + quadro comparativo
public/polls-data.{en,es}.json             registro de pesquisas, aprovacao, cruzamento
```

**O fallback e deliberado:** se o arquivo do idioma nao existe ou foi descartado, o leitor recebe pt-BR. Servir portugues e melhor do que servir numero traduzido errado.

### Gate numerico

O `scripts/lib/json-number-gate.ts` compara o **multiconjunto de valores com unidade** (%, pp, USD) de cada string contra a origem. Qualquer divergencia descarta o arquivo inteiro daquele idioma. Ele conhece o idioma porque as armadilhas sao:

- `61,50%` lido em convencao inglesa vira **6150**
- `billon` em espanhol e **10¹²**, entao `R$ 145 bi` e `145 mil millones`, nunca `145 billones`
- separador decimal: EN usa ponto, ES mantem a virgula, campo a campo

### Links de glossario

Termo brasileiro linka para o verbete **na propria expressao**, o mesmo padrao do AFOS Daily e do Tradeoff. A regra tem dois lados:

| Termo | Tratamento | Exemplo |
|---|---|---|
| Sem equivalente em EN/ES | fica em portugues **e** linka | `[centrão](/en/glossary#centrao)` |
| Com equivalente | e traduzido **e** linka mesmo assim | `[first round](/en/glossary#primeiro-turno)` |

Os cartoes renderizam isso pelo `app/components/GlossaryText.tsx`, que reconhece link de glossario **e nada mais**: negrito, italico e cabecalho seguem sem efeito nos JSONs, de proposito. URL externa ou id inexistente aparece literal na tela, para o defeito ser visivel em vez de silencioso.

### Legado conhecido

O `app/components/CandidatesSection.tsx` tem a prosa editorial **dentro do componente**, nao em JSON, entao a secao de perfis ainda renderiza em portugues no `/en` e no `/es`. Isso esta congelado de proposito e nao sera reescrito. O `scripts/check-hardcoded-ptbr.ts` roda no pre-commit e reprova qualquer **outro** componente que ganhe prosa em portugues, para o problema nao crescer. Conteudo editorial novo vai para JSON, que tem o pipeline de traducao.

---

## SEO / GEO

### Metadata por Locale

Cada pagina gera metadata nativa no idioma correto via `buildMetadata()`:
- Title com claim "Plataforma Inedita no Mundo"
- Description com posicionamento unico
- Canonical + hreflang cruzado (pt-BR, en, es, x-default)
- Open Graph + Twitter Card
- Geo tags por locale

### Google Search Console

Integrado via `POST /api/admin/search-console`:
- Impressoes, cliques, CTR, posicao media
- Breakdown por pagina, query, pais, device
- Secao especial `seoGeo` para paginas de pais
- Auth: Bearer CRON_SECRET

### Schema.org (7 tipos)

Organization, WebApplication, Dataset, WebSite, FAQPage, BreadcrumbList, Article

### Otimizacao para IA (GEO)

- **`public/llms.txt`**, Descreve a plataforma para AI crawlers (ChatGPT, Perplexity, Claude, Gemini) seguindo padrao emergente da industria
- **13 AI crawlers permitidos explicitamente** em `app/robots.ts`: GPTBot, anthropic-ai, ClaudeBot, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, CCBot, Bytespider, Applebot-Extended, cohere-ai, Meta-ExternalAgent, FacebookBot
- **JSON-LD Article schema** em `/how-it-works` para atribuicao em citacoes de motores generativos
- **Atribuicao transparente de IA**, analises geradas por inteligencia artificial a partir de dados publicos e auditaveis

### Paginas indexaveis (~120+ com hreflang)

| Tipo | Paginas | Prioridade |
|------|---------|-----------|
| Landing page | 3 | 1.0 |
| Dashboard | 3 | 0.95 |
| Mapa Global | 3 | 0.9 |
| Pais (15 × 3) | 45 | 0.8 |
| Eleicao (15 × 3) | 45 | 0.7-0.9 |
| Institucional (7 × 3) | 21 | 0.8 |
| Regiao (2 × 3) | 6 | 0.85 |
| Como Funciona (1 × 3) | 3 | 0.85 |
| White Paper (1 × 3) | 3 | 0.85 |

---

## Mapa Global de Eleicoes

- **D3.js + TopoJSON**, Natural Earth projection, SVG render
- **15 paises** com dados ao vivo do Polymarket
- **Bandeiras SVG**, visiveis em todos os dispositivos (Windows, Mac, mobile)
- **Volume com label**: "Vol: $53.4M (somatorio 6 mercados)" quando multiplos mercados
- **Hover**, tooltip com candidato lider, probabilidade, volume
- **Click**, drawer lateral com breakdown de candidatos
- **Zoom/Pan**, d3-zoom (1x-8x)

---

## Datasets Abertos (Hugging Face)

Datasets publicos e auditaveis de **divergencia eleitoral**, *mercados de previsao × pesquisas, com divergencia explicita* (o spread e o sinal, nao uma media combinada). Todos em **CC BY 4.0**, com cards trilingues e banner com bandeira da marca, construidos apenas a partir de fontes publicas (sem dados pessoais).

| Dataset | Eleicao | O que a divergencia mostra |
|---|---|---|
| [brazil-2026](https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence) | Brasil 2026 (ao vivo) | Divergencia diaria mercado × pesquisa + registro completo do TSE (399 pesquisas × 22 campos publicos) |
| [peru-2026](https://huggingface.co/datasets/AFOS-Analytics1/peru-2026-electoral-divergence) | Peru 2026 ✓ | O favorito sustentado do mercado (Lopez Aliaga) ficou fora do 2o turno; no runoff de 7/jun o mercado favoreceu Fujimori enquanto as pesquisas davam empate, e Keiko Fujimori foi proclamada presidente eleita pela JNE (50,14% × 49,86%) |
| [colombia-2026](https://huggingface.co/datasets/AFOS-Analytics1/colombia-2026-electoral-divergence) | Colombia 2026 ✓ | 1o turno: De la Espriella na frente; no runoff de 21/jun ele venceu 49,66% × 48,70% sobre Cepeda, com mercado e pesquisas acertando o vencedor mas superestimando a margem |
| [chile-2025](https://huggingface.co/datasets/AFOS-Analytics1/chile-2025-electoral-divergence) | Chile 2025 ✓ | O mercado precificava Kast em ~66% para vencer enquanto as pesquisas lideravam com Jara, e Kast venceu |
| [germany-2025](https://huggingface.co/datasets/AFOS-Analytics1/germany-2025-electoral-divergence) | Alemanha 2025 ✓ | AfD em 2o em votos (~21%) mas com ~3% de vencer a maioria das cadeiras |
| [canada-2025](https://huggingface.co/datasets/AFOS-Analytics1/canada-2025-electoral-divergence) | Canada 2025 ✓ | O mercado virou 85% Conservador → 80% Liberal; os Liberais venceram |
| [south-korea-2025](https://huggingface.co/datasets/AFOS-Analytics1/south-korea-2025-electoral-divergence) | Coreia do Sul 2025 ✓ | Eleicao antecipada apos a crise da lei marcial de Yoon; o mercado deu ~80% a Lee Jae-myung desde inicio de abril (subindo a ~95%) enquanto as pesquisas mediam ~46–50% de votos, e Lee venceu com 49,42% |
| [uk-2024](https://huggingface.co/datasets/AFOS-Analytics1/uk-2024-electoral-divergence) | Reino Unido 2024 ✓ | O Labour venceu 411 de 650 cadeiras com 33,7% dos votos; o mercado leu uma vitoria esmagadora que as pesquisas mediam so como ~40% de votos |
| [mexico-2024](https://huggingface.co/datasets/AFOS-Analytics1/mexico-2024-electoral-divergence) | Mexico 2024 ✓ | O mercado dava ~90% a Sheinbaum desde janeiro; ela venceu com ~59,8%, acima das pesquisas finais |
| [usa-2024](https://huggingface.co/datasets/AFOS-Analytics1/usa-2024-electoral-divergence) | Estados Unidos 2024 ✓ | Dois mercados discordaram: o de vencedor (colégio eleitoral, **US$ 3,7 bi**, o maior mercado eleitoral da história) cravou Trump contra o empate das pesquisas e acertou; o de voto popular favoreceu Harris e errou. Inclui uma **linha do tempo de imprensa** arquivada no Wayback (mercado × pesquisa × imprensa) |
| [france-2024](https://huggingface.co/datasets/AFOS-Analytics1/france-2024-electoral-divergence) | Franca 2024 ✓ | O mercado mais fundo (US$ 917 mil, "qual partido isolado faz a maior bancada") deu ~99% ao Rassemblement National como maior partido isolado, e acertou (143 cadeiras); a quase-maioria do RN (230–270 cadeiras) so viveu nas pesquisas e nos mercados rasos. Uma divergencia so e robusta com alto volume |

Todos os datasets tem, adicionalmente, snapshots academicos curados e citaveis no **[Harvard Dataverse](https://dataverse.harvard.edu/dataverse/afos-analytics)**, agrupados na colecao **AFOS Analytics**, **cada um com seu proprio DOI** (11 datasets, ex.: Franca [10.7910/DVN/N51NQF](https://doi.org/10.7910/DVN/N51NQF), Brasil [10.7910/DVN/2D0UK7](https://doi.org/10.7910/DVN/2D0UK7), EUA [10.7910/DVN/3DJCW5](https://doi.org/10.7910/DVN/3DJCW5)), cada um um snapshot versionado e permanente do seu mirror ao vivo do Hugging Face, depositado no maior repositorio de dados de ciencias sociais. Ate onde verificamos, o deposito do Brasil 2026 e o primeiro no Harvard Dataverse a cruzar mercados de previsao × pesquisas registradas × cobertura de imprensa para medir divergencia explicita numa eleicao brasileira.

Os casos concluidos (✓) sao o metodo **validado contra o resultado real**, exibidos como **"Casos validados"** no hub [`/global`](https://www.afos-analytics.com/pt-BR/global). Cada um carrega o historico completo de pesquisas, as odds diarias do Polymarket, a serie temporal da divergencia mercado × pesquisa, **dois graficos de odds** (trajetoria de probabilidade + snapshot mercado × pesquisa na vespera, com volume total apostado), um **`data/{pais}-structural-context.csv`** (governanca World Bank WGI + economia e educacao WDI) e um `DATA_DICTIONARY.md`. Todo dataset segue as normas **FAIR, tidy-data e de disclosure AAPOR**, com fontes `raw/` imutaveis separadas das tabelas derivadas, um **`datapackage.json`** legivel por maquina (Frictionless Table Schema, validado) e **`croissant.json`**, **`CHECKSUMS.txt`** SHA-256, um **`DATASHEET.md`** (Datasheets for Datasets) e um `CITATION.cff`. Fora do Brasil a profundidade e apenas topline (sem equivalente ao registro de open-data do TSE brasileiro).

Na plataforma, as paginas `/country/[country]` e `/election/[slug]` de cada eleicao concluida renderizam o **snapshot do Polymarket no dia da eleicao** (candidatos, barras, volume acumulado), a tabela de **divergencia mercado × pesquisa** e um **grafico nativo de trajetoria de odds** (probabilidade implicita do Polymarket ao longo da campanha para os principais concorrentes, com volume total apostado), tudo theme-aware (light / Sapphire), com a marca AFOS e a bandeira do pais.

### Contexto estrutural (World Bank WGI + WDI)

Cada pagina de pais validado tambem traz um bloco **Contexto estrutural**, indicadores oficiais, abertos e citaveis do World Bank que enquadram o pais *ao lado* do sinal de mercado (nao como previsor dele). Duas colunas:

- **Governanca** (seis **Worldwide Governance Indicators**, escala 0-100, com barras): estabilidade politica, voz e democracia, estado de direito, efetividade do governo, qualidade regulatoria, controle de corrupcao.
- **Economia e Educacao** (**World Development Indicators**): populacao, PIB, PIB per capita, inflacao; gasto publico em educacao (% do PIB) e expectativa de anos de escola.

Sao **indicadores estruturais anuais que contextualizam o pais, nao preveem o resultado eleitoral** (dito explicitamente na linha de fonte do bloco), trilingues (PT-BR / EN / ES) com formatacao numerica por idioma, e theme-aware. Os dados sao buscados sem chave em duas superficies do World Bank: **WGI pela nova [API Data360](https://data360api.worldbank.org/)** (os codigos antigos do WGI no v2 foram arquivados) e **WDI pela [API v2 classica](https://api.worldbank.org/v2/)**, ambas de licenca aberta e citaveis, alinhadas ao ethos open-data da AFOS (um feed proprietario de terminal, ex.: Bloomberg, seria nao-redistribuivel e incompativel com os datasets publicados). Os cards do hub ficam intactos de proposito; o bloco vive apenas na pagina de detalhe do pais, como informacao complementar.

**Paridade open-data (publicado nas tres superficies).** O contexto estrutural nao fica so renderizado no site, ele e publicado junto de cada dataset validado, reproduzivel a partir dos arquivos abertos:

- **Hugging Face**, cada um dos 8 datasets traz um `data/{pais}-structural-context.csv` (long/tidy: `category, indicator, label, value, unit, year, source, iso3`, 11 indicadores por pais), documentado no `DATA_DICTIONARY.md`.
- **Bundle academico (repo multi-pais)**, um `structural-context.csv` por pasta de pais, com a mesma entrada no dicionario.
- **Neon Postgres**, uma tabela isolada `{pais}.structural_indicator` por schema de pais (o schema `public` do Brasil fica intocado).

### Grafo do cruzamento

Abaixo do contexto estrutural, cada pagina de pais validado renderiza um **grafo do cruzamento** force-directed (estilo Obsidian, d3-force): a eleicao no centro, cercada por seus **mercados de previsao, pesquisas, imprensa e contexto estrutural** (governanca / economia / educacao). A **divergencia e a estrela**, a leitura de mercado de cada candidato e ligada por uma aresta fina colorida rotulada com o Δpp (vermelho = divergencia alta, ambar = media, verde = convergencia), e os casos validados acrescentam um no de **"resultado real"** ligado em verde ao vencedor de fato (omitido onde nao ha resultado oficial proclamado, ex.: Peru, contestado). Rotulos trilingues (PT-BR / EN / ES) e theme-aware (light / Sapphire). E uma **camada de visualizacao sobre dados ja publicados** no Hugging Face / Neon, sem dado novo; ligado por pais via allowlist para rollout incremental. O caso EUA 2024 mostra ainda os dois mercados que discordaram (colegio eleitoral vs voto popular) e ancoras de imprensa. Em todos os casos validados os nos de candidato sao coloridos por partido (EUA R=vermelho / D=azul; nos demais esq./trabalhista vermelho, dir./conservador azul; cores partidarias reais na Alemanha), todo no acende estilo Obsidian no hover (o no e suas arestas brilham em azul e o resto esmaece), e os **nos de dado sao clicaveis** — mercados, pesquisas, candidatos e o no de resultado real abrem a pasta correspondente do dataset aberto daquele pais no Hugging Face (`data/`, `polls/`, `press/`), enquanto os nos de contexto estrutural rolam para o card de contexto na propria pagina; a pagina dos EUA traz ainda um cluster clicavel **Harvard Dataverse** (colecao AFOS + DOI EUA).

No **dashboard do Brasil** (o caso ao vivo) o mesmo grafo e o **cerebro navegavel**, posicionado logo apos os cards de odds do Polymarket: a divergencia mercado×pesquisa ao vivo (Lula / Flavio / Renan...) no coracao, mais **nos clicaveis** que o transformam num mapa de toda a plataforma. Os nos de dado (mercados / pesquisas / imprensa / candidatos) linkam para a pasta correspondente, atualizada diariamente, no **dataset do Brasil no Hugging Face** (`data/`, `polls/`, `news/`, `snapshots/analysis-criteriosa/`); os nos de contexto estrutural rolam para o card de contexto na propria pagina; e tres hubs de navegacao apontam para os **produtos** (Daily, Tradeoff, Global, Metodo, White Paper, Governanca, Sobre, Metas), as **secoes do dashboard** (ancoras na pagina) e o **Harvard Dataverse** (a colecao AFOS + DOI Brasil + DOI EUA). Cada no aponta para algum lugar, igual ao grafo de um vault Obsidian.

---

## Analytics

### /api/admin/analytics
Analytics detalhado do Neon: curva de leads, pipeline health, engajamento, audit logs, AI runs.

### /api/admin/search-console
Dados do Google Search Console: impressoes, cliques, CTR, posicao media, performance de paginas de pais (SEO GEO).

### /api/admin/metrics
Dashboard executivo: contagens pontuais de leads, precos, audit logs, LLM runs, deletion requests.

---

## Ingestao TSE (Pesquisas Eleitorais)

```
Cron 3x/dia (6h, 12h, 18h)
  → cdn.tse.jus.br/pesquisa_eleitoral_2026.zip
  → Parse CSV (399 pesquisas presidenciais, TODOS os campos publicos:
     metodologia + plano amostral/ponderacao + estatistico/CONRE, nao-truncado)
  → Neon: research.sources + research_runs + research_findings
  → Cruzamento: pesquisas recentes (15 dias) × odds Polymarket
```

---

## Banco de Dados (Neon Postgres)

6 schemas, 20 tabelas, UUID PKs, timestamptz:

| Schema | Tabelas | Proposito |
|--------|---------|-----------|
| **iam** | users, user_preferences, user_consents | Identidade, LGPD |
| **crm** | leads, contact_events, visitor_states | Leads, visitor tracking |
| **research** | sources, runs, findings, reports, cross_signals | Pesquisas, cruzamentos |
| **market** | events, markets, outcomes, prices, forecasts | Polymarket, serie temporal |
| **governance** | audit_logs, deletion_requests | Auditoria, LGPD Art. 18 |
| **ai** | llm_runs, model_outputs | Tracking IA, guardrails |

---

## Seguranca

| Camada | Medidas |
|--------|---------|
| **Web** | CSP (unsafe-eval so em dev), HSTS, X-Frame-Options, Referrer-Policy |
| **API** | Rate limiting distribuido (Upstash), timeout, slug validation |
| **Auth** | timing-safe compare, **somente Bearer token**. O bypass pelo header `x-vercel-cron` foi removido apos auditoria: se a Vercel deixasse de remover esse header em requisicao publica, qualquer um forjaria uma rodada de cron |
| **Email** | Honeypot anti-bot, rate limit 5/IP/hora, Zod validation |
| **Visitor** | Backend source of truth, Redis SET NX dedup, 3s timeout |
| **IA** | Prompt injection detection, output sanitization, risk scoring |
| **LGPD** | Consent tracking, exclusao atomica, anonimizacao, audit trail |

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 15** | App Router, RSC, TypeScript, Middleware |
| **Prisma 7** | ORM com multiSchema (6 schemas, 20 tabelas) |
| **Neon Postgres** | Banco principal (pooled + unpooled) |
| **D3.js + TopoJSON** | Mapa global SVG interativo |
| **Tailwind CSS** | Design system |
| **Zod** | Validacao de inputs |
| **Vercel** | Hosting, Edge Runtime, Cron |
| **Upstash Redis** | Hot cache, rate limiting, session dedup |
| **Resend** | Email transacional |
| **Polymarket API** | Mercados de previsao (18 mercados, 15 paises) |
| **Google News RSS + Firecrawl** | Noticias ao vivo |
| **OpenRouter (DeepSeek V4 Flash)** | AFOS Chat, agente conversacional (tool-calling) sobre dados ao vivo |
| **World Bank (WGI via Data360 + WDI v2)** | Contexto estrutural nas paginas validadas, governanca (WGI 0-100) + economia e educacao (WDI). Sem chave, licenca aberta |
| **Vercel Analytics + Speed Insights** | Metricas de trafego + Core Web Vitals (performance de usuario real) |

---

## APIs (22+ endpoints)

| Endpoint | Descricao |
|---|---|
| `/api/visitor/state` | Estado do visitante (get/create) |
| `/api/visitor/session` | Registra sessao qualificada |
| `/api/visitor/dismiss` | Registra dismissal popup |
| `/api/visitor/migrate` | Migra inscritos legados |
| `/api/subscribe` | Captura email (visitorId + captureSource) |
| `/api/global-map` | Eleicoes globais (Redis → Polymarket) |
| `/api/cron/refresh-elections` | Cron 30min, Polymarket → Redis + Neon (unificado, um fetch por tick) |
| `/api/cron/refresh-polls` | Cron 3x/dia TSE (Brasil) |
| `/api/cron/refresh-us-polls` | Cron diario 07:10 UTC, generic ballot da Camara dos EUA → Neon. **Recusa sobrescrever dado bom com leitura vazia** (502, nada gravado) |
| `/api/cron/refresh-us-press` | Cron 3x/dia, imprensa dos EUA por lista fixa de veiculos → Neon. Mesmo portao de recusa. **Coleta hibrida desde 03/Ago/2026**: 15 dos 22 veiculos da lista sao lidos pelo RSS proprio, que entrega a URL canonica da materia; os outros 7 seguem pelo Google News, cujo link e um redirecionamento opaco. Medido em 03/Ago: Reuters e Associated Press descontinuaram RSS publico, USA TODAY nao devolve feed utilizavel, e Washington Examiner / Cook Political Report / Sabato's Crystal Ball respondem 403 a robo. **Nao forjamos user-agent de navegador para passar por esses tres**: e bloqueio deliberado do veiculo. Cada item registra sua `origem` (`feed` ou `google`) e o bloco de qualidade conta `publicadosComLinkCanonico` contra `publicadosViaGoogleNews`, para uma quebra silenciosa dos feeds aparecer como metrica em vez de passar por rodada normal |
| `/api/cron/persist-analysis` | Cron 1x/dia, persiste JSONs de analise e markdown do AFOS Daily no Neon |
| `/api/polymarket` | Odds BR |
| `/api/polls` / `/api/polls/tse` | Pesquisas |
| `/api/news` | Noticias |
| `/api/admin/analytics` | Analytics detalhado |
| `/api/admin/search-console` | Google Search Console |
| `/api/admin/metrics` | Dashboard executivo |
| `/api/admin/data-request` | LGPD exclusao/exportacao |
| `/api/health` | Health check |
| `/api/translations` | Pipeline traducao IA |
| `/api/chat` | AFOS Chat, agente tool-calling em streaming (SSE) sobre dados ao vivo; rate-limit por IP |
| `/api/market/history` | Serie temporal odds |

---

## O que significa AFOS?

| Letra | Significado | Descricao |
|---|---|---|
| **A** | Astuteness | Inteligencia para cruzar dados e gerar clareza |
| **F** | Fairness | Imparcialidade verificavel no tratamento de cada fonte |
| **O** | Objectivity | Neutralidade analitica - observamos os dados, nao tomamos partido |
| **S** | Synthesis | Transformar dados complexos em entendimento simples |

---

## Configuracao

```bash
git clone https://github.com/AFOS-Analytics/afos-analitica-2026.git
cd afos-analitica-2026
npm install
cp .env.example .env.local
# Preencher env vars (ver .env.example)
npx prisma migrate dev
npx tsx scripts/seed-dev.ts
npm run dev
```

---

## Documentacao

| Documento | Conteudo |
|-----------|---------|
| [docs/DATABASE.md](docs/DATABASE.md) | Schemas, tabelas, convencoes |
| [docs/LGPD.md](docs/LGPD.md) | Matriz PII, retencao, runbooks |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Deploy, rollback, observabilidade |
| [docs/platform/add-your-country.md](docs/platform/add-your-country.md) | Guia passo-a-passo para onboardar um novo pais na plataforma hospedada (configuracao, nao conteudo diario) |
| [TRADEMARK.md](TRADEMARK.md) | Politica de trademark do AFOS Analytics (o que forkers podem/nao podem fazer com nome e logo) |
| [docs/como-funciona-afos.html](docs/como-funciona-afos.html) | Guia didatico da metodologia (fonte) |
| [V1 README](docs/README-v1.pt-BR.md) | Como tudo comecou |

---

## Claude Code

| Comando | Descricao |
|---------|-----------|
| `/atualizar-brz` | Atualizacao completa do AFOS Analytics para o **Brasil** (Polymarket + Google News + JSONs + deploy) |
| `/atualizar-pesquisas-brz` | Ingestao de pesquisas eleitorais do TSE (**Brasil**) |
| `/afos-daily` | Gera a sintese narrativa diaria (AFOS Daily), cruza mercados, pesquisas e noticias com link auditavel por alegacao |
| `/tradeoff-brz` | Gera a leitura tecnica semanal (AFOS Tradeoff) do **Brasil**, 9 secoes estruturadas, reporta os tres sinais separadamente, analise de cenarios ponderados para leitores institucionais |
| `/atualizar-usa` | Passada completa no painel das midterms dos **EUA**: leitura do mercado ao vivo (8 contratos do Polymarket), trava de captura, generic ballot, imprensa e conferencia da tela nos 3 idiomas |
| `/atualizar-pesquisas-usa` | Ingestao do generic ballot da Camara (**EUA**). Nao existe equivalente para o Senado, e isso e declarado |
| `/tradeoff-usa` | Gera a leitura tecnica semanal das midterms dos **EUA**, com as 4 trocas de template: bloco das duas grandezas no lugar da anti-media, calendario eleitoral no lugar do calendario de prints, sem historico de acertos, cenarios lidos da distribuicao de cadeiras |

> O sufixo `-brz` / `-usa` marca sobre qual painel e qual dataset o comando age. Foi criado em 01/Ago/2026, quando a plataforma ganhou um segundo pais ao vivo (midterms dos EUA), para que um comando de um pais so nunca seja confundido com um comando da plataforma inteira. O `/afos-daily` fica sem sufixo porque nao e de um pais so.
>
> Os comandos dos EUA **nao** sao copia dos do Brasil. O `/atualizar-brz` ESCREVE prosa editorial em tres JSONs; o painel dos EUA nao tem prosa editorial por rodada, ele le dado medido do Neon (mercado a cada 30 min, generic ballot uma vez por dia, imprensa 3x por dia) e desenha. Por isso **nao existe etapa de traducao** do lado dos EUA: o arquivo de dados dele nao tem variante por idioma, de proposito.

---

## Contato

| Finalidade | Email |
|------------|-------|
| Geral, imprensa, parcerias | [contact@afos-analytics.com](mailto:contact@afos-analytics.com) |
| Suporte e ajuda ao usuário | [support@afos-analytics.com](mailto:support@afos-analytics.com) |
| Disclosure de vulnerabilidades | [security@afos-analytics.com](mailto:security@afos-analytics.com) |
| Contato direto com o founder | [founder@afos-analytics.com](mailto:founder@afos-analytics.com) |

Para bugs e pedidos de features, use [GitHub Issues](https://github.com/AFOS-Analytics/afos-analitica-2026/issues).

---

## Dominio oficial

O dominio canonico e **[afos-analytics.com](https://www.afos-analytics.com)**. Qualquer outro TLD `afos-analytics.*` ou variacao do nome **nao** e operado oficialmente pelo AFOS Analytics, a menos que confirmado explicitamente via [contact@afos-analytics.com](mailto:contact@afos-analytics.com).

---

*AFOS Analytics, Plataforma inédita no mundo: Inteligência de Risco Político Eleitoral em tempo real.*
