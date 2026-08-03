# AFOS Weekly — US Midterms (semanal, quintas)

Gerar a edição semanal do **AFOS Weekly**, o terceiro produto: **editorial, escrito para o ELEITOR COMUM**, sobre as midterms de 03/Nov/2026.

## ⚠️ Leia isto antes: este produto não é o Tradeoff nem o Daily

**A fronteira, decidida com o André em 01/Ago/2026:**

> O **Tradeoff** responde "quanto o mercado de previsão está pagando".
> O **Weekly** responde "quem está discordando de quem, e o que isso significa para quem vai votar".

🔴 **Se uma edição do Weekly puder ser resumida como "o mercado está em X%", ela virou Tradeoff e precisa ser reescrita.**

| | Tradeoff | Weekly |
|---|---|---|
| Leitor | research, buy-side, tesouraria | **eleitor comum** |
| Dia | segunda | **quinta** |
| Origem | português | 🔴 **INGLÊS** |
| Aviso financeiro | obrigatório | ⛔ **não tem** |

## 🔴 O INGLÊS É A ORIGEM, e isso inverte tudo

O arquivo canônico é `public/afos-weekly/us/{data}.md` **escrito em inglês**. As traduções são `{data}.pt-BR.md` e `{data}.es.md`.

**Três consequências que já derrubaram gente:**

1. **Sua revisão passa a ser na segunda língua**, o inverso do Brasil. A memória registra **30 erros de tradução que já passaram como verdes** → `feedback_afos_daily_translation_review`. O André pediu **atenção redobrada** aqui.
2. **Falta de tradução cai para o INGLÊS, nunca para o português.** Leitor americano recebendo português seria pior que receber o original.
3. **O `publish-afos-weekly.ts` usa sufixos `['', '.pt-BR', '.es']`**, não os do Tradeoff. Copiar de lá procura um `.en.md` que não existe.

## Pré-requisitos

1. `/atualizar-usa` rodado nas últimas horas, com a **trava de captura aprovada** (`scripts/capture-guard.ts --pais=us`).
2. `public/us-polls-data.json` fresco, com `descartadasPorValor: 0`.
3. Coleta de imprensa do dia **arquivada** (ETAPA 3.1 do `/atualizar-usa`).

Faltando qualquer um, PARAR e pedir o `/atualizar-usa` primeiro.

## ETAPA 1: Coletar

- **Mercado:** `curl -s "https://www.afos-analytics.com/api/polymarket?country=us"` (⚠️ **sem `?country=us` a rota devolve o BRASIL**, bem-formado, e passa despercebido).
- **Série, para variação:** 🔴 **filtrar o slug**. Câmara e Senado usam o MESMO nome de desfecho, e sem filtro as duas séries colam:
  ```bash
  curl -s "https://www.afos-analytics.com/api/market/history?candidate=Democratas&country=which-party-will-win-the-house&days=90"
  ```
  📏 A série da Câmara começa em **28/Jul/2026**. Superlativo é "desde 28/Jul", nunca "do ciclo".
- **Pesquisas:** `public/us-polls-data.json`, e o que importa é a **dispersão entre institutos**, não a média.
- **Imprensa:** `public/us-press-archive/{data}.json`.

## ETAPA 2: Escrever as 7 seções

Frontmatter em `public/afos-weekly/us/{data}.md`, **em inglês**, com `status: draft`.

| # | Seção | Campo | Regra |
|---|---|---|---|
| 1 | TL;DR | `tldr` | 3 marcadores. **Nada aqui que não esteja no corpo** |
| 2 | O que o mercado de previsão fez | `moneyIntro` + `cards` | os 5 preços publicados, com volume |
| 3 | O que as pesquisas fizeram | `pollsIntro` + `dispersion` | **a dispersão vem antes da média** |
| 4 | O que a imprensa contou | `coverage` | ver abaixo |
| 5 | **O cruzamento da semana** | `crossings` | 🎯 a ESPINHA, não apêndice |
| 6 | Como ler este número | `howToRead` | um conceito por edição |
| 7 | Fontes | `sources` | ver abaixo |

### 🔴 Seção 4: narrativa é OBRIGATÓRIA, divergência é bônus

Decisão do André em 03/Ago/2026, e ela derrubou o desenho anterior.

`coverage.narrative` é **obrigatório**: 3 a 4 parágrafos sobre o que a imprensa cobriu na janela, **atribuído por veículo, com data explícita**, no modelo da Seção 3 do AFOS Daily. `coverage.claims` é opcional e só entra quando há **afirmação conferível** divergindo, sempre com a nossa medição ao lado.

⛔ **O campo `noDivergence` NÃO EXISTE MAIS.** Ele era um interruptor: quando ligado, o template trocava a seção inteira por "não houve divergência conferível nesta janela". **Com 22 veículos monitorados e matéria coletada, isso é entregar uma desculpa.** Se a seção sair vazia de novo, o defeito é meu, não da semana.

⛔ **Sem rótulo de inclinação política.** O AFOS não classifica veículo. Compara **afirmações conferíveis**, com o número medido ao lado.

### Seção 7: fontes, e a exceção da imprensa

URL **visível e clicável** como no Tradeoff, com uma exceção: os itens de imprensa levam `hideUrl: true`, e aí **a manchete vira o link e endereço nenhum é impresso**.

**Por quê:** a coleta guarda o link do Google News para os veículos sem RSS próprio. Aquele endereço tem 300 caracteres ilegíveis, e escrever "cnn.com" no lugar seria anunciar um destino e mandar o leitor para outro. Não dizer endereço nenhum é a única saída que não mente.

📌 Item que vier de feed próprio (`origem: 'feed'` no arquivo) **tem URL canônica e pode mostrar o endereço**.

## ETAPA 3: As travas

**Herdadas do Daily:** 2 fontes independentes para evento de alto impacto (5 manchetes do mesmo agregador = 1 fonte) · link por alegação (≥80%) · **teto de 900 palavras** · data explícita, nunca "ontem" · rascunho por padrão.

**Específicas dos EUA:**
- 🔴 **NUNCA subtrair mercado de pesquisa.** O mercado dá probabilidade de controlar a casa; a pesquisa dá vantagem em pontos de voto. A subtração produz número sem unidade. Em 2012 os democratas tiveram mais votos e menos cadeiras: a distância pode ser inteiramente geografia.
- **Distribuição só entra se as faixas somarem 95% a 105%.** O `popularVoteMargin` está reprovado em ~145% e é coletado todo dia mesmo assim.
- **Medir, nunca julgar** veículo.
- 🏷️ **Todo número diz DE QUE ele é.** "85,50%" não basta: é a probabilidade de os **democratas** controlarem a **Câmara**.

## ETAPA 4: Preview, SEM prod

```bash
npx vercel --yes
```

Conferir os 3 idiomas e reportar a URL. **Aguardar aprovação expressa.**

## ETAPA 5: Depois do "aprovado"

1. **Traduzir EN → pt-BR e es NA PRÓPRIA SESSÃO.**

   ⛔ **NUNCA usar conta de API para traduzir.** Assunto encerrado pelo André em 25/Jul e reafirmado em 26/Jul: a tradução do AFOS é feita na sessão, pela assinatura do Claude Code. Se algum script falhar por "SEM CRÉDITO", **não é bloqueio nem pendência**, é a ferramenta errada. Não sugerir recarga, não citar saldo, não reabrir.

   **Gate numérico obrigatório:** todo número seguido de unidade (`%`, `pp`, `M`) tem que dar multiconjunto idêntico nos três idiomas. Ler as três versões INTEIRAS, varredura automática não basta.

   🔢 **Decimal: PONTO nos três idiomas**, como no Tradeoff. O que muda é só o separador de MILHAR: EN vírgula (`n=2,004`), pt-BR e ES ponto (`n=2.004`).

   📅 **Dia da semana traduzido errado é erro FACTUAL**, não de estilo.

2. **Flip nos 3 idiomas:**
   ```bash
   npx tsx scripts/publish-afos-weekly.ts YYYY-MM-DD --all-locales
   ```

3. **Commit, push e prod:**
   ```bash
   git add public/afos-weekly/us/YYYY-MM-DD*.md
   git commit -m "AFOS Weekly Issue №N (YYYY-MM-DD) — [resumo em 1 linha]"
   git push origin main
   npx vercel --yes --prod
   ```

## 📅 Calendário: 13 + 1

Quintas: **06/Ago** (№1, piloto) · **13/Ago** (№2, piloto, **decisão de seguir**) · 20 e 27/Ago · 03, 10, 17 e 24/Set · 01, 08, 15 e 22/Out · **29/Out** (№13, última antes da urna).

⭐ **№14 em 05/Nov, dois dias DEPOIS da urna, e é a mais importante:** é onde o AFOS diz "o mercado precificou X, as pesquisas mediram Y, a realidade foi Z". **É o que transforma as 13 edições num CASO VALIDADO.** Sem ela a série termina sem veredito.

⚠️ **Primárias estaduais não entram por estimativa:** têm calendário próprio por estado e não estão na nossa base.

## 🚧 Estado do piloto

⛔ **Enquanto o piloto durar, publicar NÃO põe a edição em busca.** Três travas em série, de propósito: o portão de rascunho devolve 404 em produção, a rota `latest` só conta rascunho fora de produção, e a página é **`noindex` mesmo depois de publicada**. O flip só tira o 404.

**Não existe ainda:** arquivo de edições, RSS e broadcast. Os três foram aprovados no desenho e não construídos. Não prometer ao leitor o que não está no ar.

## Memórias relacionadas

`project_us_weekly_produto_editorial` · `project_state_03ago_imprensa_weekly` · `project_us_imprensa_sem_rotulo_de_vies` · `project_us_midterms_2026_live_case` · `reference_serie_mercado_us_camara_senado_mesmo_nome`
