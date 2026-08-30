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
- **AFOS Daily**, sintese narrativa diaria cruzando as tres fontes, com link auditavel por alegacao. Validada em piloto de 7 dias (22-28/Abr/2026), agora permanente, **123 edicoes publicadas ate 22/Ago/2026**, em 3 idiomas (PT-BR, EN, ES) com arquivo completo em `/daily/[data]`. Distribuicao por email para assinantes optados-in via Resend Pro. Teto duro de **900 palavras** no corpo, medido sem tabela e sem URL, que nao sao leitura. ⭐ O bloco de fecho **"Em sintese"** sao tres PARAGRAFOS, cada um abrindo com uma **frase-tese em negrito** seguida dos numeros que a provam, e nao uma lista numerada de uma linha: quem le so os negritos leva a peca inteira, quem le tudo leva os numeros. Formato firmado em 22/Ago/2026 depois de o anterior ser cobrado como raso duas vezes em dois dias, e o conserto ser de FORMA, nao de volume
- **AFOS Tradeoff**, leitura tecnica semanal publicada toda segunda, voltada para research institucional, buy-side e tesouraria. Cruza os mesmos tres sinais mas reporta **separadamente** (sem compostos de media ponderada), quando mercado de previsao, pesquisa e noticia divergem, a divergencia *e* o sinal. Estruturada em 9 secoes (cards de resumo executivo, racional anti-media, cenarios ponderados, grade de indicadores, liquidez e estrutura de mercado, calendario de prints, watch list, metodologia, leitura adicional). Publicada em 3 idiomas (PT-BR, EN, ES) com arquivo completo em `/tradeoff/[pais]/[data]` (`/br`, `/us`). **14 edicoes brasileiras e 4 americanas publicadas ate 24/Ago/2026.** RSS: `/feed/tradeoff.xml` e `/feed/tradeoff-us.xml`

  ⚠️ **O frontmatter rico e um contrato, e as funcoes `coerce*` do loader falham em SILENCIO de duas formas diferentes.** Campo obrigatorio com o nome errado faz a linha ser **descartada** (o `indicatorGrid` filtra por `contract`); **enum com valor invalido CAI PARA O PADRAO**, que e pior, porque a secao mantem o tamanho certo e exibe um valor errado e plausivel que nao deixa rastro. O `scenarios[].type` aceita **somente `base | bear | tail`**: `contrarian` nao existe e vira `base` calado. Isso foi ao ar em seis edicoes brasileiras (№8 a №13) entre 13/Jul e 17/Ago/2026, renderizando o cenario contrario ao pricing com a cor do cenario base, e foi corrigido em 23/Ago em 18 arquivos. A regra que pega isso e contar cada bloco pelo loader antes do preview, e o motivo de ter sobrevivido seis edicoes e que a regra morava na skill `/tradeoff-usa` e nao morava nem na `/tradeoff-brz` nem na `/weekly-usa`; agora esta nas tres.
- **AFOS Weekly**, editorial semanal publicado toda quinta sobre as midterms dos EUA de 2026, escrito para o **eleitor comum** e nao para research institucional. **Edicoes №1 a №3 publicadas, a mais recente em 20/Ago/2026**, nos tres idiomas. O piloto de duas edicoes foi avaliado depois da №2 e confirmado para seguir. A fronteira com o Tradeoff e deliberada e esta escrita no codigo: o Tradeoff responde "quanto o mercado de previsao esta pagando", o Weekly responde "quem esta discordando de quem, e o que isso significa para quem vai votar". 7 secoes (TL;DR, o que o mercado de previsao fez, o que as pesquisas fizeram, o que a imprensa contou, o cruzamento da semana, como ler este numero, fontes), sem aviso financeiro e com teto de 1.100 palavras (a Daily segue em 900; mesmo numero, dois produtos, decisoes opostas). 🔴 **O ingles e o idioma de origem**, o inverso de todos os outros produtos: PT-BR e ES sao derivados, e falta de traducao cai para o ingles, nunca para o portugues. Arquivo em `/weekly/[pais]`, edicoes em `/weekly/[pais]/[data]`. Segue `noindex` enquanto o piloto durar
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
| `/[locale]/dashboard/us` | Painel EUA, midterms de 2026 (3/Nov). **PUBLICADO em 01/Ago/2026**: indexavel, no sitemap, no `llms.txt`, avisado ao IndexNow e ligado no seletor de pais. Sete blocos: cartao de apresentacao, mercado de previsao (8 mercados do Polymarket, cada card clicavel ate a aposta real), distribuicao de cadeiras republicanas no Senado, pesquisas do generic ballot da **Camara**, grafo do cruzamento, contexto estrutural do Banco Mundial, imprensa (automatica, lista fixa de veiculos) e limitacoes declaradas. ⚠️ **A aresta mercado×pesquisa do grafo e MUDA**: o mercado da a probabilidade de controlar a casa e a pesquisa da a vantagem em pontos de voto, entao nao se exibe Δpp, de proposito. Mercado de faixa so entra na tela se as faixas somarem entre 95% e 105%; o de margem do voto popular e coletado todo dia e fica fora da tela, medido entre ~145% e 152,00% (21/Ago/2026). **O leitor do generic ballot tem dois portoes**: um de forma (linha sem data de campo ou com instituto ilegivel) e um **de valor** (partido fora de 15-70%, ou a soma dos dois acima de 100). Os dois descartam *e contam*, nunca em silencio. O de valor entrou em 01/Ago/2026 depois de uma linha sair como "D 914 x R 3,2", em que 914 era o tamanho da amostra e 3,2 a margem de erro: a origem usa `rowspan` tambem na coluna da margem, entao as linhas seguintes deslizavam uma coluna. O leitor passou a resolver `rowspan` por indice de coluna |
| `/[locale]/daily` | AFOS Daily, sintese narrativa diaria cruzando mercados de previsao, pesquisas e noticias. Disponivel em **3 idiomas** (PT-BR, EN, ES), loader detecta `{data}.{locale}.md` com fallback para o PT-BR canonico. Termos politicos brasileiros (TSE, STF, BolsoMaster, etc.) preservados em PT com links inline para o glossario trilingue. **Rota indice = arquivo de edicoes** (lista agrupada por mes de todas as edicoes publicadas, ultima destacada, pular-para-data + seletores de idioma e tema na pagina); edicoes individuais ficam em `/[locale]/daily/[date]` com prev / next + navegacao "Todas as edicoes" |
| `/[locale]/tradeoff` | AFOS Tradeoff, leitura tecnica semanal (segundas) voltada para research institucional / buy-side / tesouraria. Tres sinais reportados separadamente, divergencia *e* o sinal, nao ruido a mediar. 9 secoes estruturadas renderizadas via YAML rich-frontmatter (cards de resumo, racional anti-media, cenarios ponderados, grade de indicadores, liquidez e estrutura de mercado, calendario de prints, watch list, metodologia, leitura adicional). Paridade tri-locale com Daily (`{data}.{locale}.md`). **Rota indice = arquivo de edicoes** (lista por numero de edicao e semana, ultima destacada, seletores de idioma e tema na pagina); edicoes ficam em `/[locale]/tradeoff/[pais]/[date]` com prev / next + navegacao "Todas as edicoes". RSS: `/feed/tradeoff.xml`. ⚠️ **O segmento de pais e obrigatorio e o endereco de edicao sem pais da 404** desde 07/Ago/2026. Ele fazia 307 para o Brasil, o que estava certo enquanto o Brasil era o unico pais e virou errado em 03/Ago, quando os dois publicaram na mesma data e `/en/tradeoff/2026-08-03` respondia 307 entregando a edicao **BRASILEIRA**. Endereco ambiguo resolvido em silencio e pior que endereco inexistente. A forma curta `/[locale]/tradeoff`, sem segmento, continua redirecionando para o Brasil: morreu a forma ambigua, nunca a curta |
| `/[locale]/weekly/[pais]` | **Arquivo de edicoes do Weekly**, construido em 06/Ago/2026. Ele existia como promessa antes de existir como pagina: o rodape de toda edicao trazia um botao "Todas as edicoes" que levava a 404. O titulo carrega a bandeira do pais, porque o leitor precisa saber de qual eleicao e a edicao antes de ler um unico numero |
| `/[locale]/weekly/[pais]/[data]` | **AFOS Weekly, PILOTO. Edicao №1 publicada em 06/Ago/2026, №3 em 20/Ago/2026** nos tres idiomas, cada uma com broadcast 20/20. O piloto foi avaliado depois da №2 e confirmado para seguir. Terceiro produto: editorial, escrito para o eleitor comum, sobre as midterms dos EUA de 2026, as quintas. A fronteira com o Tradeoff esta escrita no codigo: o Tradeoff responde "quanto o mercado de previsao esta pagando", o Weekly responde "quem esta discordando de quem, e o que isso significa para quem vai votar". 7 secoes (TL;DR, o que o mercado de previsao fez, o que as pesquisas fizeram, o que a imprensa contou, o cruzamento da semana, como ler este numero, fontes). 🔴 **O INGLES e o idioma de ORIGEM**, ao contrario de todos os outros produtos: PT-BR e ES sao derivados, e falta de traducao cai para o ingles, nunca para o portugues. `lib/afos-weekly/` nao importa nada de `afos-tradeoff` nem de `afos-daily`, e nenhum deles importa daqui, de proposito: um piloto nao pode ter como quebrar dois produtos que ja estao no ar. **Publicar nao significa indexar:** enquanto o piloto durar a pagina segue `noindex`, entao o flip do portao de rascunho so tira o 404. ⚠️ Esse mesmo portao derrubou a Edicao №1 nos tres idiomas no dia da estreia, e a causa nao estava em nenhum dos tres arquivos: ele lia uma **fatia fixa de 500 bytes** procurando o `status:`, um bloco de comentario empurrou o campo para o byte 558, e ele caiu para `draft` por seguranca. Hoje le ate o delimitador do frontmatter, e o leitor vive em `lib/frontmatter/`, compartilhado pelos tres produtos |
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

Popup: paineis do Brasil E dos EUA.   Gate: so o painel do Brasil, de proposito.
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
| `DashboardGate` | Blur overlay na 4a sessao. **So no painel do Brasil** |
| `EmailPopup` | Popup suave nas 3 sessoes livres. **Nos dois paineis**, desde 28/Ago/2026 |

**Seguranca:** Backend e fonte de verdade (nao localStorage). Timeout 3s com fallback. Dedup atomico via Redis SET NX. Honeypot anti-bot. Rate limiting.

**Inscricao inline (fim de cada edicao publicada).** O AFOS Daily e o Tradeoff sao o
conteudo recorrente da plataforma e, ate julho de 2026, eram as unicas superficies sem
caminho de assinatura na propria pagina. O `InlineSubscribe` fecha essa lacuna: ele
envolve o mesmo `SubscribeForm`, entao herda honeypot, validacao inline, consentimento
explicito LGPD, correcao de erro de digitacao e o redirecionamento para `/welcome`,
**onde o assinante escolhe o idioma em que quer receber** (portugues, ingles ou espanhol).
A copy existe nos tres idiomas e o bloco se adapta aos dois temas da pagina (claro e
Sapphire Blue).

O `captureSource` registra de qual superficie a pessoa veio e, desde 28/Ago/2026, e
**qualificado por pais** onde o mesmo componente serve dois: `popup-br`, `popup-us`,
`gate`, `landing`, `daily`, `tradeoff-br`, `tradeoff-us` e `weekly`. Isso permite medir
se o conteudo recorrente converte, sem nenhum pixel de rastreamento em e-mail. Os
registros anteriores a essa data levam `popup` e `tradeoff` sem sufixo, entao consulta
que compara paises tem que EXCLUI-LOS, nunca atribui-los a um lado.

**O que o fluxo de cadastro GARANTE, e por que (auditado em 27/Ago/2026).** Um leitor
avisou que nao conseguia se cadastrar no desktop **e** no celular. A auditoria achou doze
defeitos, e a maioria nunca apareceu em log nem quebrou teste nenhum. As regras abaixo sao
a resposta, e cada uma fecha uma classe de falha:

| Regra | A falha que ela fecha |
|---|---|
| **Campo opcional de medicao nunca bloqueia a acao principal** | Um `visitorId` fora do formato UUID, ou um `captureSource` desconhecido, derrubava o pedido inteiro. Os dois passam a virar `undefined`: perde-se a atribuicao daquele cadastro, nao o assinante. Perder a origem e barato; perder a pessoa nao |
| **Todo valor guardado e CONFERIDO, nao so lido** | O id de visitante vinha do cookie ou do localStorage sem validacao de formato, entao um valor corrompido travava aquele aparelho **para sempre**, porque era relido a cada tentativa |
| **O e-mail e higienizado ANTES de ser julgado** | A validacao rodava antes da limpeza, entao um espaco ou um caractere invisivel colado de uma pagina web produzia "e-mail invalido" num endereco visualmente perfeito, e o `trim()` do navegador nao remove zero-width |
| **Cliente de banco que falha e RETENTADO, nunca guardado como morto** | O cliente era criado uma vez por instancia. Uma criacao falha servia erro pelo resto da vida daquela instancia, e e por isso que o leitor falhava em dois aparelhos enquanto chamadas diretas funcionavam |
| **O limite de taxa falha ABERTO e repara a propria chave** | `INCR` cria a chave sem expiracao e o `EXPIRE` era uma segunda ida, entao um processo morrendo entre as duas bloqueava aquele IP permanentemente. E queda do Redis devolvia 500 a uma pessoa legitima, quando limite de taxa e anti-abuso, nao correcao |
| **Cadastrar-se de novo e um ato de consentimento NOVO** | Reinscrever-se depois de sair mostrava sucesso e nao mudava nada: o status continuava `unsubscribed`, sem e-mail de boas-vindas, e a pessoa nunca mais tinha noticia. Agora reativa, registra consentimento outra vez e da as boas-vindas de volta |
| **O idioma do navegador casa por PREFIXO** | O navegador manda `en-US` e `es-ES`; a comparacao exata contra `pt-BR/en/es` so acertava o portugues. Medido: 31 de 31 leads com `pt-BR`, e dois deles tinham escolhido ingles a mao |
| **A oferta falha LIGADA, a barreira falha ABERTA** | Quando o estado do visitante nao podia ser lido, o `DEFAULT_STATE` trazia `showPopup: false`, entao o popup e o portao simplesmente nao existiam e nenhum log dizia isso. Tres caminhos do cliente caiam ali, e quatro respostas distintas do servidor caiam num deles. Popup e oportunidade, entao passa a aparecer; portao bloqueia uma pessoa, entao fica aberto |
| **Componente replicado para uma segunda superficie registra QUAL delas e** | Os dois paineis gravavam `popup` e as duas edicoes do Tradeoff gravavam `tradeoff`, entao nenhuma consulta separava o Brasil dos Estados Unidos |
| **Falha que e RETORNADA precisa ser lida** | `registerConsent` e `sendWelcomeEmail` **devolvem** falha em vez de lancar, entao o `.catch()` dos dois nunca disparava e as duas falhavam em silencio completo. Guarda sobre funcao cujo retorno carrega `success` tem que conferir o RETORNO, nao so capturar excecao |

⛔ Duas coisas NAO ficaram mais permissivas, de proposito: `email` e `consent` seguem
estritos. Higienizar entrada nao afrouxa base legal, e consentimento ausente ou falso
continua bloqueando, com erro proprio em vez de uma mensagem sobre o e-mail.

As duas ultimas regras vieram de uma segunda auditoria, feita **por superficie** em
28/Ago/2026, que achou o que a primeira nao podia ver: a primeira leu o caminho
compartilhado (formulario, rota, servico), e esta leu cada superficie por dentro. Medido
naquele dia, o popup e o portao respondiam juntos por 18 dos 29 leads, **62% da base**, e
a pagina ficava perfeitamente normal enquanto a maior parte da captacao nao existia. O
painel dos EUA nao tinha captacao nenhuma, e isso NAO era decisao de produto: o
`UsDashboardClient` ja embrulhava tudo em `<VisitorStateProvider>` e o servidor ja
calculava `showPopup`, so que nada consumia. O portao seguir apenas no painel do Brasil
**e** decisao, porque ele bloqueia acesso em vez de oferecer algo.

### Pipeline de Dados (Cron + Upstash Redis + Neon)

```
Background:  Cron 30min  → Polymarket (18 mercados paralelo) → Upstash Redis + Neon
Usuario:     Requisicao  → Redis read (<1ms) → resposta
```

**Arquitetura de cron unico (otimizada para custo + carga):** um unico cron de 30 minutos escreve tanto no Redis (caminho quente para usuarios) quanto no Neon (snapshot historico). Decisao documentada em abril/2026 apos analise de risco/custo: a cadencia de 5 minutos criava pressao excessiva em Vercel e Upstash sob picos de trafego sem ganho relevante de UX (movimentos do Polymarket raramente exigem granularidade sub-30-minutos para analises eleitorais cruzadas). A cadencia de 30 minutos permite scale-to-zero do Neon entre ticks, simplifica operacao (um unico cron) e preserva o diferencial real-time atraves do cruzamento em si, nao da frequencia de polling.

**O cron CONSULTA de 30 em 30 minutos; a serie historica registra MUDANCA, e essa diferenca faz parte do dado (29/Ago/2026).** Uma linha de preco so e gravada quando algum desfecho do contrato anda pelo menos 0,5 ponto percentual, mais um batimento garantido para contrato que ficou parado. Ou seja, a serie e dirigida por evento e nao e uma amostra uniforme de 30 minutos, e qualquer estatistica do tipo "quantas vezes esse valor apareceu" e contagem de mudanca registrada, nao taxa. A regra mudou em tres datas, todas agora declaradas no datasheet do dataset aberto: ate 28/Ago o movimento era medido so no desfecho LIDER, entao movimento de qualquer outro nao era gravado e um preco publicado podia ter zero ocorrencias na propria serie; entre 28/Ago 18:22 UTC e 29/Ago 14:38 UTC um defeito gravou TODA consulta, cerca de 15 vezes a densidade normal; a partir de 29/Ago o batimento e de 4 horas em vez de 20, entao contrato parado rende seis pontos por dia em vez de um, e um ponto por dia nao distinguia "ficou parado" de "nao foi coletado".

**E o defeito que escondeu isso e a licao que fica: fail-open precisa ser BARULHENTO.** O portao le o estado anterior no Redis, e o cliente do Upstash devolve ja desserializado o que foi gravado como JSON. O parser so tratava string, entao o `JSON.parse` lancou, o caminho de reserva lancou de novo no `.split`, e a excecao caiu num `catch` que devolve "grave" para que queda do Redis nunca pare a coleta. Esse caminho de reserva esta certo e continua. O errado era ele ser SILENCIOSO, entao defeito de codigo ficou indistinguivel de indisponibilidade de infraestrutura por vinte horas, a 4.737 linhas por dia contra as 313 de sempre. O `catch` agora loga antes de abrir. O mesmo dia mostrou um efeito de segunda ordem: o painel so mostra o numero de uma distribuicao quando a soma das faixas fecha o portao de 95-105% em TODAS as leituras das ultimas 24 horas, entao 42 leituras e um teste mais duro que 5, e a tela mudou de estado por um motivo que nao era o mercado.

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

**Validador manual:** `npx tsx scripts/validate-afos-daily.ts {date} [--locale=en\|es]` sai com 1 em erros criticos (igual ao hook PreToolUse). Usado no fluxo do operador antes do commit (hook de pre-commit). NAO esta ligado ao CI: o `ci.yml` nao o chama.

**Bloqueio de borda x link morto (camada 4, 23/Ago/2026).** A camada 4 confere toda URL por HTTP e bloqueia em 4xx/5xx. Essa regra classifica errado um caso: o **bloqueio de borda de CDN**, em que o host responde 403 para *nos* enquanto serve todo mundo. Medido no `divulgacandcontas.tse.jus.br`, o registro publico de pesquisas do TSE: 403 tanto em `HEAD` quanto em `GET`, 403 no proprio `/robots.txt`, corpo assinado por `errors.edgesuite.net` (Akamai), enquanto o cron de producao ingeria 6 pesquisas do mesmo host naquele dia.

Um 403 **nao e afirmacao sobre o recurso, e afirmacao sobre o cliente**. Entao o portao passou a tratar `403` (e so 403) em dominio **ja presente na `ANTI_BOT_WHITELIST`** como bloqueio de borda, e nao como link quebrado. A excecao e estreita de proposito, e nunca e silenciosa: o hook reporta essas URLs como **NAO VERIFICADAS**, nao como aprovadas. `404` e `410` seguem bloqueando em qualquer dominio, inclusive nos da lista branca (conferido com teste negativo em `oglobo.globo.com` e `www1.folha.uol.com.br`).

Consequencia a nao esquecer: enquanto um host estiver atras de bloqueio de borda, o portao **nao consegue distinguir pagina viva de pagina morta ali**. Ele deixa de bloquear, nao passa a confirmar.

**Carimbo de publicação não é data do evento (24/Ago/2026).** Isso vale mesmo quando a matéria traz hora e minuto na própria assinatura. Veículo publica quando pauta, não quando o fato ocorre, e decisão judicial de sexta à noite circula rotineiramente na segunda. Medido: a CNN Brasil publicou uma decisão do TRE-SP com carimbo de **24/Ago às 8h40**, e a matéria **não informava quando a decisão foi tomada**; o Metrópoles, publicado em **21/Ago às 19h30**, dizia que os recursos foram rejeitados **em 21 de agosto**. O fato era três dias mais velho que a cobertura que o trouxe.

O teste é de uma pergunta: **a matéria diz quando o fato aconteceu?** Se não diz, o fato está sem data, e um carimbo de publicação não preenche essa lacuna. É para isso que serve a exigência de duas fontes independentes, e aqui ela pegou um defeito para o qual não estava mirando: a segunda fonte foi buscada para confirmar o *conteúdo* e chegou trazendo a *data*. Nenhum portão deste repositório pegaria, porque o carimbo era plausível, não havia número envolvido, e o `scripts/check-frescor-editorial.ts` mede a idade de um arquivo contra o próprio `updatedAt`, não contra o mundo.

**O ato ANUNCIADO nao e o ato praticado (26/Ago/2026).** E a variante futura da regra acima, e pega o mesmo erro pelo outro lado. Uma manchete do dia dizia que um investigado **ia depor** a Policia Federal. A segunda fonte mostrou que o depoimento estava marcado para seis dias antes, foi **adiado a pedido da defesa** e remarcado para o dia seguinte ao da materia. Escrever no passado teria transformado um ato agendado em ato praticado, e o mesmo paragrafo precisou declarar que o investigado **ja estava preso desde marco**, para que a mencao nao fosse lida como prisao nova. O teste e o mesmo da regra anterior e a resposta muda de tempo verbal: se a materia nao diz que o fato ocorreu, ele nao ocorreu, e o texto usa a data do agendamento.

**Duas medicoes da mesma coisa podem se inverter, e a resposta nao e media (26/Ago/2026).** Dois institutos publicaram pesquisa nacional no mesmo dia, com janelas de campo que se sobrepoem, e chegaram a resultados opostos no segundo turno: um deu o lider perdendo por cinco pontos e o outro deu o lider ganhando por cinco. Sao dez pontos entre casas, sem nenhum dia entre elas para explicar a diferenca. O painel publica as duas com a regua de confiabilidade declarada e **nao faz media**, porque media entre leituras que se invertem apaga exatamente o que ha de informativo no dia. Foi o segundo caso medido no mesmo mes, com quatro institutos diferentes, e ele desarma a leitura de que a pesquisa e o dado firme contra o qual o mercado e ruido: nem a urna e uma coisa so.

**Razao de fontes editoriais (regra 50/50, firmada em 9/Mai/2026):** cada AFOS Daily usa **no minimo 50% de veiculos-ancora via RSS direto** (Folha de S.Paulo, O Globo, G1, Estadao, Valor, VEJA, credibilidade institucional) **+ no minimo 50% de veiculos secundarios via redirect do Google News** (Poder360, BBC, Canal MyNews, CartaCapital, InfoMoney, CBN, Gazeta do Povo, Exame, etc., acesso aberto, reproduzem a cobertura-ancora sem paywall). Refinamento da regra anterior 30/70, motivado pela observacao de que veiculos-ancora frequentemente colocam conteudo em paywall para nao-assinantes (sobretudo leitores internacionais); os secundarios replicam a mesma cobertura com acesso aberto. Aplica-se uniformemente a PT-BR / EN / ES. As traducoes preservam as URLs como coletadas no idioma de origem.

### Extremos de série e superlativos

Média, mediana e quantis sobrevivem a uma observação ruim. **Máximo e mínimo não: um único tick os define sozinho.** Toda vez que o painel publica "o topo da série" ou "o piso da série", está publicando o valor de exatamente um registro, e basta esse registro estar errado para a frase inteira ser falsa.

Medido em 24/Ago/2026, no livro presidencial. Dois extremos, conferidos do mesmo jeito, com vereditos opostos:

| Desfecho | Extremo | Vizinhos temporais | Veredito |
|---|---|---|---|
| Líder | 70,00% em 28/Abr, 11:45 UTC | 36,50% às 10:15, 36,50% às 12:40 | **artefato de captura** |
| Segundo | 45,50% em 06/Mai, 19:00 UTC | 43,70% e 44,80% | **legítimo** |

Salto de 33,5pp e volta completa em duas horas e meia, sem nenhum ponto intermediário, não é nível. O segundo maior valor de toda a série é 67,50%, e só 2 dos 343 pontos passam de 67%.

**A conferência é um comando: olhar os vizinhos do extremo antes de publicá-lo.** Extremo legítimo tem vizinhos próximos; extremo espúrio fica isolado. Dois sinais secundários ajudam: valor exatamente redondo num book que negocia em centésimos de ponto, e extremo muito fora da faixa que o resto da série ocupa.

O `scripts/capture-guard.ts` foi instalado em 24/Jul/2026 e exige duas leituras independentes, separadas por oito minutos, concordando dentro de 0,20pp antes de qualquer preço ser publicado. Ele impede que um book em trânsito vire número publicado **daquela data em diante**; o histórico gravado antes dele não tem essa garantia.

Relacionado: a `/api/market/history` não é fonte segura para essa conferência (ver a tabela de APIs). Superlativos são verificados contra o `backup/neon/marketPrice/*.csv.gz`, que guarda o registro completo desde 14/Abr.

**A trava certifica livro a livro, e o veredito global não é a unidade de decisão (27/Ago/2026).** No dia em que o Polymarket abriu contratos para um candidato que até então não tinha preço, a trava rodou duas vezes e devolveu BLOQUEADO nas duas, com listas de livros aprovados **opostas**: a primeira aprovou presidencial, STF e Senado e bloqueou 2º e 3º lugar; a segunda aprovou 2º e 3º lugar e bloqueou o presidencial. Lidas como veredito de livro, as duas rodadas se contradizem e a rodada para sem publicar nada. Lidas pelo **motivo**, que vem impresso por candidato, as duas dizem a mesma coisa: todo bloqueio das duas rodadas cita o contrato que tinha aberto naquele dia, e todos os outros nomes confirmaram com deriva de 0,00pp em quatro leituras espalhadas por 49 minutos. **A unidade de decisão é a linha do motivo, não a linha do veredito.** A rodada publicou todos os contratos, menos o de vencedor daquele candidato, que não tinha valor confirmado; os dois contratos de posição do mesmo candidato confirmaram e foram publicados. Preço sem leitura confirmada também fica fora do `polymarketComparison` do `polls-data.json`, porque os campos `odds` e `value` dele são o que o exportador do Hugging Face lê primeiro, e número não confirmado não pode chegar a dataset público.

A frase publicada para o leitor descreve o método e nunca relata a falha: *"o contrato abriu nesta quinta e esta rodada não publica preço para ele"*. Por que não há preço é problema da casa, não do leitor.

Um portão de corte duro sobre grandeza ruidosa se lê pela **série**, não pelo instante. O painel dos EUA só exibe uma distribuição se as faixas somarem entre 95% e 105%, e a distribuição de governos estaduais republicanos ficou dentro em 14 de 14 leituras até 25/Ago/2026, saiu em três capturas do mesmo dia (108,45%, 108,45% e 106,45%) e voltou para dentro em 26/Ago (101,45% e 101,95%). Uma travessia numa leitura é excursão, não mudança de estado: o portão decide por `dentro de n` justamente para não virar penhasco, porque trava que bloqueia todo dia é trava que alguém aprende a pular.

Média de janela móvel se move sem dado novo. A média da casa para o generic ballot é aritmética simples sobre 30 dias, e em 26/Ago/2026 ela foi de D+5,91 para D+6,16 com **zero pesquisa nova**: a janela rolou um dia, três rodadas saíram pela borda (duas delas mediam abaixo da média) e a base caiu de 22 para 19 pesquisas e de 16 para 15 institutos. Antes de escrever qualquer verbo de movimento, comparar `nPesquisas` e `nInstitutos` contra a leitura anterior: se caíram, a variação é de composição até prova em contrário, e escrever "a vantagem democrata cresceu" seria falso.

**Índice atrasado e buraco dentro da janela são defeitos diferentes, e o medidor global só enxerga o primeiro (28/Ago/2026).** A fonte é uma única tabela da Wikipédia, alimentada por editores voluntários, e o `lib/us-polls/atraso.mjs` mede a distância entre a data de campo mais recente dela e hoje. Esse número fica verde assim que um lote entra, e um lote pode entrar pulando a rodada de uma casa: em 24/Ago um lote de 16 linhas deixou a tabela em dia, e a onda de 14 a 17/Ago da The Economist/YouGov nunca entrou, embora outras quatro casas com o *mesmo* dia de encerramento de campo tenham entrado. A rodada que falta encerra campo **dentro** da janela de 30 dias, então ela move a média sem mover a data mais recente, que é a única coisa que o medidor global relata.

Quem pega isso compara cada casa **com ela mesma**: uma casa semanal calada há 18 dias é anomalia, uma casa mensal calada há 18 dias é rotina, e comparar casa com casa não diz nada, porque as cadências são diferentes por natureza. O `medirCadencia` exige ao menos 5 datas de campo distintas em 180 dias, usa a mediana dos intervalos e não a média, e acusa em 2 ciclos perdidos. Reexecutado sobre o mesmo arquivo com o relógio em 25/Ago, o atraso global marcava brandos 8 dias enquanto a YouGov já estava em 2,1 ciclos. Como o número do atraso, ele é impresso e enviado por email e **nunca gravado no JSON servido**: o `/us-polls-data.json` é público, e "esta casa está calada há 18 dias" é fato sobre a nossa coleta, não sobre a eleição. Ele avisa em vez de bloquear, porque casa calada não corrompe nada, e trava que para a rodada por algo que não se conserta do nosso lado é trava que alguém aprende a pular.

**Apontar a casa não é saber se a rodada existe, e até 30/Ago/2026 o passo que fechava esse vão era uma linha de texto mandando alguém ir olhar.** Conferir só as casas que alguém reparou troca uma amostra sistemática por uma discricionária, então o `lib/us-polls/fora-do-indice.mjs` consulta a listagem própria de **toda** casa que o portão de cadência sinaliza, sem exceção e sem escolha de quem chama. Ele responde a uma pergunta só, se existe rodada com campo encerrando depois da mais recente que o índice tem, e devolve o trecho literal como evidência. Ele **detecta e nunca ingere**: ler valor no instituto mudaria a procedência da média servida, o que é decisão e não efeito colateral. Falha de rede, 403 de borda, formato de página mudado ou casa sem listagem registrada devolvem `INDETERMINADO` ou `SEM_LISTAGEM_REGISTRADA`, **nunca "nada novo"**, e metade dos 33 testes dele exercita falha exatamente por isso. O registro cobre as 11 casas que o portão consegue avaliar, e o host de cada uma foi derivado dos links de `fontePrimaria` que o próprio índice já dá, em vez de escolhido a dedo; as 3 sem listagem utilizável são impressas em toda passada, inclusive nas que não têm ninguém atrasado, porque registro incompleto de outro modo só aparece no dia em que a casa que falta é justamente a que se cala. Em 30/Ago ele separou duas casas que o portão tinha juntado: a The Economist/YouGov tinha duas ondas fora do índice, com campo encerrando em 17 e 24/Ago, enquanto a Morning Consult voltou inconclusiva porque o tracker dela não declara intervalo de campo e parte do conteúdo é paga.

Saber que o buraco existe ainda não diz se ele importa, e o `lib/us-polls/exposicao.mjs` responde a isso: quanto a média servida se moveria se as rodadas que faltam entrassem. Cada rodada ausente entra como **o campo de hoje mais o efeito daquela casa**, medido rodada a rodada contra o campo do próprio momento e com a casa excluída desse campo. Mediana bruta de 180 dias não serve, e o erro tem direção: ela carrega a tendência do tempo junto com o efeito de casa, e em 30/Ago teria feito o buraco parecer maior do que é. As três rodadas que faltam levariam a média de D+5,66 para D+5,39, numa faixa de D+5,07 a D+5,85, ou seja, o buraco inclina o número servido levemente para o lado democrata sem mudar a manchete. Como o atraso e a cadência, ele vive no log de operador e nunca no arquivo servido.

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
│   ├── cron/refresh-us-press/         # Cron 3x/dia → imprensa EUA, HIBRIDO (16 RSS proprios + Google News)
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
├── frontmatter/                       # Primitivos de YAML compartilhados: portao de status + coercoes (06/Ago/2026)
├── afos-daily/                        # Loader do Daily — o arquivo canonico e o PT-BR
├── afos-tradeoff/                     # Loader do Tradeoff — canonico em PT-BR, com escopo de pais
├── afos-weekly/                       # Loader do Weekly — o arquivo canonico e o INGLES
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

**A regra do modulo isolado, e a unica excecao dela.** Os tres produtos editoriais nunca importam um do outro: produto novo nao pode ter como quebrar dois que ja estao no ar. Essa regra custou duplicacao de verdade, e em 06/Ago/2026 a conta chegou. O portao de status do frontmatter existia em tres copias identicas, o mesmo defeito precisou ser consertado tres vezes separadas no mesmo dia, e a essa altura as copias **ja tinham derivado** entre si: uma tinha guarda de `isNaN` na coercao de data e duas nao tinham, o que significa que dois produtos lancariam `RangeError` e derrubariam a pagina inteira onde o terceiro degradava com elegancia.

`lib/frontmatter/` e a excecao, e a linha que ela tras e precisa: ler YAML nao e primitivo de PRODUTO, e primitivo de FORMATO DE ARQUIVO. Os tres podem depender dele sem que nenhum dependa do outro, entao a regra original continua de pe. Duas coisas tornaram a unificacao segura: a **assinatura publica dos tres loaders ficou identica**, deixando os 32 chamadores externos intocados, e onde as copias discordavam a fusao pegou sempre a variante **mais segura**, nunca a mais permissiva.

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

### Carimbo da mesma rodada

O gate numerico nao e a unica trava. O `readLocalized`, em `lib/dashboard/static-data.ts`, so entrega a variante traduzida quando o `updatedAt` e o `lastUpdate` dela batem com os do pt-BR **byte a byte**:

```ts
if (traduzido && mesmoCarimbo(pt, traduzido)) return traduzido
return pt   // cai para o portugues
```

A razao e que o fallback precisa ser **alcancavel**. Sem essa checagem, quando a traducao de hoje era reprovada pelo gate numerico, a variante de ONTEM continuava sendo entregue sob o carimbo de hoje: o leitor de ingles recebia a analise da vespera, e a queda declarada para o portugues nunca acontecia.

⚠️ **A consequencia para quem edita os arquivos: `updatedAt` e `lastUpdate` NAO se traduzem.** Eles estao em `FORA_DE_TRADUCAO` e sao copia byte a byte. Localizar o carimbo para `08/21/2026, 3:59 PM` enquanto o pt-BR traz `21/08/2026, 15:59` descarta o arquivo inteiro, e a pagina renderiza em portugues com um `.en.json` perfeitamente correto no servidor. Medido em producao em 21/Ago/2026. O gate numerico nao pega isso, porque carimbo nao tem `%`, `pp` nem `USD`.

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
- 🌍 **Cartao social com escopo de PAIS (corrigido em 03/Ago/2026).** As paginas editoriais (Daily, Tradeoff, Weekly) montam o proprio `openGraph`/`twitter` a partir da edicao, e as tags de assunto seguem o pais dela: `US 2026 midterms` em `/us/`, `Brazil 2026 election` em `/br/`. Antes disso o Weekly nao declarava `openGraph` nenhum e herdava o layout raiz, entao compartilhar um link das midterms no WhatsApp mostrava um cartao dizendo **"Brazil 2026 Elections"** acima da URL certa, e o Tradeoff levava a tag brasileira fixa na edicao americana. ⚠️ `robots: noindex` **nao** protege disso: ele tira a pagina do buscador e nao tem efeito sobre o scraper social, entao piloto fora de busca continua perfeitamente compartilhavel
- 🏛️ **Pilula do Harvard e por pais.** `/br/` mostra o DOI do Brasil, que existe; `/us/` aponta para a colecao do AFOS com o rotulo `collection`, sem prometer prazo, porque o dataset das midterms ainda nao foi depositado
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
| [usa-2026-midterms](https://huggingface.co/datasets/AFOS-Analytics1/usa-2026-midterms-divergence) | Midterms EUA 2026 (ao vivo) | **v1, PRÉ-ELEITORAL e declarada como tal.** A urna é em 3/Nov, então não existe `official-result.json` contra o qual validar e este bundle NÃO é padrão-ouro, de propósito: abrir exceção quebraria a comparabilidade com os 11 que são. 363 pesquisas de generic ballot de 63 institutos (99,4% com fonte primária), 5.585 linhas de preço em 9 contratos, 237 manchetes de imprensa. Um caso já resolve: a **primária republicana do Senado no Texas**, em que o mercado pagou 57-62% em Paxton por cinco semanas, saltou para 94,5% em 21/Mai, e ele venceu com 63,8% em 26/Mai |
| [usa-2024](https://huggingface.co/datasets/AFOS-Analytics1/usa-2024-electoral-divergence) | Estados Unidos 2024 ✓ | Dois mercados discordaram: o de vencedor (colégio eleitoral, **US$ 3,7 bi**, o maior mercado eleitoral da história) cravou Trump contra o empate das pesquisas e acertou; o de voto popular favoreceu Harris e errou. Inclui uma **linha do tempo de imprensa** arquivada no Wayback (mercado × pesquisa × imprensa) |
| [france-2024](https://huggingface.co/datasets/AFOS-Analytics1/france-2024-electoral-divergence) | Franca 2024 ✓ | O mercado mais fundo (US$ 917 mil, "qual partido isolado faz a maior bancada") deu ~99% ao Rassemblement National como maior partido isolado, e acertou (143 cadeiras); a quase-maioria do RN (230–270 cadeiras) so viveu nas pesquisas e nos mercados rasos. Uma divergencia so e robusta com alto volume |
| [india-2024-lok-sabha](https://huggingface.co/datasets/AFOS-Analytics1/india-2024-lok-sabha-electoral-divergence) | India 2024 ✓ | A maior eleicao ja realizada, 642 milhoes de votos. Mercado (~361 cadeiras) e pesquisas (~373) superestimaram a NDA; o resultado foi 293 e o BJP perdeu a maioria sozinho. Os exit polls deram media ~355 numa faixa de 221 a 415, e a projecao mais perto, 316, foi a que ficou abafada |

Os **13 datasets DEPOSITADOS** tem, adicionalmente, snapshots academicos curados e citaveis no **[Harvard Dataverse](https://dataverse.harvard.edu/dataverse/afos-analytics)**, agrupados na colecao **AFOS Analytics**, **cada um com seu proprio DOI** (13 datasets: as 11 eleicoes encerradas mais os dois bundles vivos, ex.: Franca [10.7910/DVN/N51NQF](https://doi.org/10.7910/DVN/N51NQF), Brasil [10.7910/DVN/2D0UK7](https://doi.org/10.7910/DVN/2D0UK7), EUA [10.7910/DVN/3DJCW5](https://doi.org/10.7910/DVN/3DJCW5)), cada um um snapshot versionado e permanente do seu mirror ao vivo do Hugging Face, depositado no maior repositorio de dados de ciencias sociais. ⚠️ **O bundle das midterms de 2026 foi depositado em 25/Ago/2026 como v1 pre-eleitoral** ([10.7910/DVN/XRUT8U](https://doi.org/10.7910/DVN/XRUT8U)): ele ainda nao carrega resultado certificado, entao NAO e padrao-ouro de proposito, e a v2 vem depois de 3/Nov. Ate onde verificamos, o deposito do Brasil 2026 e o primeiro no Harvard Dataverse a cruzar mercados de previsao × pesquisas registradas × cobertura de imprensa para medir divergencia explicita numa eleicao brasileira.

Os casos concluidos (✓) sao o metodo **validado contra o resultado real**, exibidos como **"Casos validados"** no hub [`/global`](https://www.afos-analytics.com/pt-BR/global). Cada um carrega o historico completo de pesquisas, as odds diarias do Polymarket, a serie temporal da divergencia mercado × pesquisa, **dois graficos de odds** (trajetoria de probabilidade + snapshot mercado × pesquisa na vespera, com volume total apostado), um **`data/{pais}-structural-context.csv`** (governanca World Bank WGI + economia e educacao WDI) e um `DATA_DICTIONARY.md`. Todo dataset segue as normas **FAIR, tidy-data e de disclosure AAPOR**, com fontes `raw/` imutaveis separadas das tabelas derivadas, um **`datapackage.json`** legivel por maquina (Frictionless Table Schema, validado) e **`croissant.json`**, **`CHECKSUMS.txt`** SHA-256, um **`DATASHEET.md`** (Datasheets for Datasets) e um `CITATION.cff`. Fora do Brasil a profundidade e apenas topline (sem equivalente ao registro de open-data do TSE brasileiro).

Na plataforma, as paginas `/country/[country]` e `/election/[slug]` de cada eleicao concluida renderizam o **snapshot do Polymarket no dia da eleicao** (candidatos, barras, volume acumulado), a tabela de **divergencia mercado × pesquisa** e um **grafico nativo de trajetoria de odds** (probabilidade implicita do Polymarket ao longo da campanha para os principais concorrentes, com volume total apostado), tudo theme-aware (light / Sapphire), com a marca AFOS e a bandeira do pais.

🔭 **Todo bundle ao vivo declara suas tabelas (22/Ago/2026).** O Hugging Face so desenha o visualizador quando sabe quais sao as tabelas; sem instrucao, ele tenta empilhar todos os arquivos num split unico e desiste. Medido antes do conserto: o bundle dos EUA 2026 mostrava as primeiras linhas e nao paginava, e o **Brasil servia 0 de 2,5 MB com os cinco indicadores desligados**, porque lia o `datapackage.json` (metadado) como se fosse dado. Os dois passaram a declarar um bloco `configs` nomeando cada tabela, e a primeira entrada e a que a pagina abre. **EUA 2026: 12 tabelas, 6.644 linhas. Brasil: 8 tabelas, 3.329 linhas**, cada contagem batendo com o arquivo em disco. ⛔ Os 11 bundles encerrados ficaram INTOCADOS de proposito: regua escrita depois nao reprova retroativamente caso ja publicado, citado e validado naquele estado. O Brasil ganhou tambem o `data/divergence-daily-timeseries.csv`, unindo as fatias diarias numa serie navegavel, aditivo e sem reescrever nenhuma delas.

🕸️ **O grafo leva ao dataset (22/Ago/2026).** Os dois paineis de pais desenham um no `Dataset aberto · Hugging Face` ligado ao bundle, mais um anel tracejado e uma dica ao pousar o mouse em todo no que sai do site. Levou tres tentativas: um `href` num no existente era invisivel, anel mais legenda de rodape explicavam o desenho em vez de ser o desenho, e so um **no com nome** foi encontravel. Num grafo, a unidade de descoberta e o no.

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

**Identificar a que onda uma pesquisa pertence (24/Ago/2026).** Trackers semanais repetem patamares. A série BTG/Nexus mediu 41 x 37 no 1º turno e 46 x 45 no 2º turno **tanto** em 03/Ago **quanto** em 24/Ago, com três semanas de diferença. No dia em que a segunda delas saiu, quatro fontes distintas devolveram a onda errada: um resumo de busca misturando três delas, uma URL de veículo cujo slug contém o topline mas é da onda anterior, uma página de veículo em slug mensal e outra em slug genérico.

**A onda se identifica pelo número de registro no TSE, nunca pelo topline e nunca pela URL.** O registro é único por levantamento, aparece na matéria e no ZIP oficial, e é o campo `register` do `public/polls-data.json`. O `fieldDates` é a segunda âncora. A comparação com a onda anterior se faz contra a nossa própria série registrada, não contra o enquadramento de um veículo, porque veículos comparam com bases diferentes sem sempre dizer qual.

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

### Backup e restauracao

A serie de precos do Polymarket e a unica coisa que existia num lugar so: pontos de meia em meia hora desde 14/Abr/2026. Os JSON editoriais e as dailies vivem em tres lugares (repositorio, Vercel, Neon) e sobrevivem a perda de qualquer um. A serie nao sobrevivia, e ninguem pode pedir ao Polymarket o preco que o book mostrava as 14h37 de um dia de maio.

O `backup/neon/` guarda CSV comprimido particionado por mes, commitado neste repositorio. Mes fechado nunca mais muda, entao o git guarda uma vez so. Estado atual: 38 arquivos, cerca de 6,3 MB comprimidos. E o mesmo arquivo que a conferencia de superlativo le (ver *Extremos de série e superlativos* acima).

**Este repositorio e PUBLICO**, entao 12 tabelas com dado pessoal ficam de fora por nome, cada uma com o motivo registrado no `backup/neon/MANIFEST.json`. Tabela nova sem classificacao ABORTA o backup em vez de adivinhar: adivinhar ali ou vaza dado pessoal ou perde backup em silencio, e de repositorio publico nada se despublica.

```bash
npx tsx scripts/backup-neon.ts              # gera
npx tsx scripts/backup-neon.ts --verificar  # checksum de cada arquivo
npx tsx scripts/check-backup-sem-pii.ts     # trava de dado pessoal
npx tsx scripts/check-backup-restauravel.ts # prova que RESTAURA
```

A ultima trava e a que importa, e ela nao compara bytes. Reconstroi a serie a partir dos CSV **sem tocar no banco** e verifica se ela responde a mesma pergunta que o banco responde. Medido em 28/Ago/2026: 50.267 linhas de preco, 134 dias com os dois nomes, pico de gap de **41,80pp em 01/Ago/2026**, identico dos dois lados. Backup que ninguem tentou restaurar nao e backup.

O `.github/workflows/backup-neon.yml` roda todo dia as 15:00 UTC. Saida "0 alterados" e determinismo, nao tarefa parada: para distinguir backup em dia de backup congelado, comparar a contagem do banco com a soma de linhas do `MANIFEST.json`.

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
| **Dependencias** | Dependabot em **zero alertas abertos** (27/Ago/2026). Vulnerabilidade em dependencia transitiva nao se resolve subindo major de framework. As rotas, em ordem de custo: `npm update` dentro das faixas ja declaradas, depois patch da origem que **alarga** o pin, e `overrides` so como ultimo recurso. O VAO na faixa vulneravel do aviso aponta o patch que ja conserta. Concretamente, o `npm audit fix --force` propunha instalar o Next 16 **e REBAIXAR** o Prisma de 7.9.1 para 6.12.0; nenhum dos dois foi feito e todos os alertas fecharam assim mesmo |
| **Dado pessoal nos datasets** | Politica de 04/Ago/2026: **CPF sai por minimizacao**, CNPJ fica porque o TSE publica de proposito, e revisao ja publicada e preservada inteira, erro se corrige por **errata**, nunca reescrevendo o historico. A regua e o **padrao de digito**, nao o rotulo do campo, porque CPF dentro de observacao em texto livre continua sendo CPF. Em 06/Ago/2026 uma auditoria achou o redator cobrindo **2 dos 3** arquivos do TSE, e a trava foi ampliada para os tres. Sendo preciso sobre o que isso era: o arquivo descoberto media **zero** CPF naquele dia, entao era falha estrutural e latente, nao vazamento vivo |

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
| `/api/cron/refresh-us-press` | Cron 3x/dia, imprensa dos EUA por lista fixa de veiculos → Neon. Mesmo portao de recusa. **Coleta hibrida desde 03/Ago/2026**: 16 dos 23 veiculos da lista sao lidos pelo RSS proprio, que entrega a URL canonica da materia; os outros 7 seguem pelo Google News, cujo link e um redirecionamento opaco. Medido em 03/Ago: Reuters e Associated Press descontinuaram RSS publico, USA TODAY nao devolve feed utilizavel, e Washington Examiner / Cook Political Report / Sabato's Crystal Ball respondem 403 a robo. **Nao forjamos user-agent de navegador para passar por esses tres**: e bloqueio deliberado do veiculo. Cada item registra sua `origem` (`feed` ou `google`) e o bloco de qualidade conta `publicadosComLinkCanonico` contra `publicadosViaGoogleNews`, para uma quebra silenciosa dos feeds aparecer como metrica em vez de passar por rodada normal |
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
| `/api/market/history` | Serie temporal de odds. ⚠️ **Nao e a serie completa, e nao serve para superlativo.** O `days` trava em 90 por `Math.min`, o `country=` casa o slug por PREFIXO (entao uma consulta presidencial arrasta junto os contratos de 2o e 3o lugar), e um teto de 1.000 pontos trunca o que sobrou: medido em 22/Ago/2026, uma chamada com `days=90` voltou `truncated: true` com a serie presidencial cortada seis dias antes do fim. Ela alimenta o grafico da tela. Afirmacao de "o maior/o menor de todos" se confere em `backup/neon/marketPrice/*.csv.gz`, que e incremental por mes e guarda o registro desde 14/Abr |

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
