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

- **Mercado:** `curl -s "https://www.afos-analytics.com/api/polymarket?country=us&fresh=1"` (⚠️ **sem `?country=us` a rota devolve o BRASIL**, bem-formado, e passa despercebido. 🔴 **Sem `&fresh=1` ela devolve o CACHE**, com carimbo antigo: medido em 10/Ago/2026, 19 minutos de atraso e o republicano da Câmara errado em 2.00pp. Conferir o `fetchedAt`, não o valor).
- **Série, para variação:** 🔴 **filtrar o slug**. Câmara e Senado usam o MESMO nome de desfecho, e sem filtro as duas séries colam:
  ```bash
  curl -s "https://www.afos-analytics.com/api/market/history?candidate=Democratas&country=which-party-will-win-the-house&days=90"
  ```
  📏 O primeiro ponto gravado da série da Câmara é de **29/Jul/2026** (a coleta foi ligada em 28/Jul, mas o dia que conta é o do primeiro ponto). A do Senado começa em **14/Abr/2026**. Superlativo é "desde" essas datas, nunca "do ciclo".
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

⛔ **O campo `noDivergence` NÃO EXISTE MAIS.** Ele era um interruptor: quando ligado, o template trocava a seção inteira por "não houve divergência conferível nesta janela". **Com 23 veículos monitorados e matéria coletada, isso é entregar uma desculpa.** Se a seção sair vazia de novo, o defeito é meu, não da semana.

⛔ **Sem rótulo de inclinação política.** O AFOS não classifica veículo. Compara **afirmações conferíveis**, com o número medido ao lado.

### Seção 7: fontes, e a exceção da imprensa

URL **visível e clicável** como no Tradeoff, com uma exceção: os itens de imprensa levam `hideUrl: true`, e aí **a manchete vira o link e endereço nenhum é impresso**.

**Por quê:** a coleta guarda o link do Google News para os veículos sem RSS próprio. Aquele endereço tem 300 caracteres ilegíveis, e escrever "cnn.com" no lugar seria anunciar um destino e mandar o leitor para outro. Não dizer endereço nenhum é a única saída que não mente.

📌 Item que vier de feed próprio (`origem: 'feed'` no arquivo) **tem URL canônica e pode mostrar o endereço**.

## ETAPA 3: As travas

**Herdadas do Daily:** 2 fontes independentes para evento de alto impacto (5 manchetes do mesmo agregador = 1 fonte) · link por alegação (≥80%) · data explícita, nunca "ontem" · rascunho por padrão.

📏 **Teto: 1.100 palavras no corpo.** Decisão do André em 13/Ago/2026, permanente, e ela vale **só para o Weekly**.

⚠️ **CORRIGIDO em 04/Set/2026: esta linha proibia algo que já tinha sido decidido ao contrário.** Ela dizia "a Daily segue em 900" e mandava não propagar o 1.100. **A Daily subiu para 1.100 em 24/Ago/2026**, por ordem do André, e a própria `/afos-daily` registra isso. Os dois produtos hoje têm o **mesmo teto de 1.100**.

📌 **O que sobrevive da regra original, e continua valendo:** os dois tetos foram decididos SEPARADAMENTE, em datas diferentes e por razões diferentes. Se um mudar, o outro não muda junto. ⛔ **E subir teto se faz DEVOLVENDO conteúdo verificado que foi cortado, nunca escrevendo prosa nova para encher.** Ver `memory/feedback_o_ponto_onde_parei_de_cortar_nao_e_o_limite.md`.

O corpo é título, TL;DR, `moneyIntro`, os `desc` dos cards, `moneyFootnote`, `pollsIntro`, a nota de dispersão, a narrativa, as alegações, a medição, os cruzamentos e o `howToRead`. **`methodology` e `sources` ficam fora da conta**, por serem rodapé de procedência e não leitura corrida. Medir, não estimar: o ponto onde se para de cortar não é o limite.

**Específicas dos EUA:**
- 🔴 **NUNCA subtrair mercado de pesquisa.** O mercado dá probabilidade de controlar a casa; a pesquisa dá vantagem em pontos de voto. A subtração produz número sem unidade. Em 2012 os democratas tiveram mais votos e menos cadeiras: a distância pode ser inteiramente geografia.
- **Distribuição só entra se as faixas somarem 95% a 105%.** O `popularVoteMargin` está reprovado e é coletado todo dia mesmo assim. **Medido em 04/Set sobre os 37 dias da série: mediana 151.90%, faixa de 144.80% a 154.60%.** O "~145%" que esta linha trazia era o MÍNIMO da série, não o valor típico.
- **Medir, nunca julgar** veículo.
- 🏷️ **Todo número diz DE QUE ele é.** "85,50%" não basta: é a probabilidade de os **democratas** controlarem a **Câmara**.

## ETAPA 3.5: CONTAR os blocos pelo LOADER, antes do preview (bloqueante)

🔴 **Instalado em 23/Ago/2026.** A régua de contar bloco existia na skill do `/tradeoff-usa` e **não existia aqui nem no `/tradeoff-brz`**, e foi no produto sem a régua que o defeito sobreviveu seis edições. Regra instalada em um caminho de três protege um caminho de três.

O `coerce*` do loader falha **calado** de duas formas: campo obrigatório com nome errado faz a linha ser **descartada**, e enum com valor inválido **cai para o padrão**, produzindo um valor errado e plausível. A segunda não deixa rastro.

**Rodar antes do preview e comparar com o que o arquivo tem:**

```bash
cat > scripts/tmp-wk.ts <<'EOF'
import { loadWeekly } from '../lib/afos-weekly/loader'
for (const loc of ['en', 'pt-BR', 'es']) {
  const d: any = loadWeekly('DATA', loc, 'us')   // ordem: (data, IDIOMA, pais)
  if (!d) { console.log(`  ${loc} LOADER DEVOLVEU NULL`); continue }
  console.log(`  ${loc.padEnd(6)} tldr=${d.tldr?.length} cards=${d.cards?.length} cruzamentos=${d.crossings?.length} fontes=${d.sources?.length} narrativa=${d.coverage?.narrative ? 'sim' : 'NAO'}`)
}
EOF
npx tsx scripts/tmp-wk.ts; rm -f scripts/tmp-wk.ts
```

**Bloco com 0, ou `narrativa=NAO`, é bloco que não vai aparecer.** Ver [[feedback_loader_descarta_bloco_com_campo_errado_em_silencio]].

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

## ✅ O piloto ACABOU em 27/Ago/2026

⚠️ **Esta seção descrevia o piloto e ficou desatualizada por uma semana.** Medido em 04/Set sobre a №5 publicada: as três páginas respondem `index, follow`, estão no `sitemap.xml` e aparecem no `llms.txt`.

**O que vale hoje:** o portão de rascunho continua devolvendo 404 em produção enquanto `status: draft`, e o flip do `publish-afos-weekly.ts` é o que tira o 404. A partir dele a edição **entra em busca**, e não há mais `noindex`.

📌 **Descrição de ESTADO envelhece sem avisar, porque nada a testa.** Foi a segunda régua desatualizada achada em 04/Set, junto com a forma do `outcomePrices`. Quando esta seção mudar de novo, medir e reescrever, não presumir.

**Não existe ainda:** arquivo de edições e RSS. Os dois foram aprovados no desenho e não construídos. Não prometer ao leitor o que não está no ar.

📮 **BROADCAST: decisão do André em 03/Ago/2026, construído NA QUINTA 06/Ago, junto da publicação da №1.** Não construir antes, e não publicar a №1 sem ele.

✅ **QUEM RECEBE, decidido em 03/Ago: TODOS os assinantes, cada um na versão do SEU idioma.** Sem opt-in separado e sem recorte de base, mesma regra do Tradeoff. O `broadcast-afos-tradeoff.ts` já resolve locale por lead (a saída mostra `[DRY] jss*** → pt-BR`), então é esse o padrão a espelhar.

📌 **Base medida em 03/Ago: 20 leads ativos, TODOS em pt-BR.** Ou seja, na prática a versão que sai é a portuguesa, e o inglês da origem não chega a ninguém por e-mail. Isso não muda a regra de traduzir antes, mas muda a prioridade da revisão.

### 🔴🌍 As TRÊS armadilhas de país, medidas no Tradeoff em 03/Ago

O broadcast do Tradeoff foi espelhado dos EUA nesse dia e **os três furos abaixo estavam lá**. O Weekly vai herdar todos se for copiado sem cuidado, e nenhum deles dá erro.

1. **Pasta presa à raiz.** O script lia `public/afos-tradeoff/` e ignorava `--pais` em silêncio. Como Brasil e EUA publicam na mesma data, ele **mandaria a peça brasileira para a lista inteira reportando sucesso**. O Weekly já nasce com subpasta por país, então aqui é só não esquecer de passar o país adiante.

2. **Slug do Neon sem país.** `afos-weekly-DD-MM-AAAA` funciona **enquanto só existir `us`**. País novo colide e o upsert apaga um sem erro. O conserto já existe: `slugQualifier` em `lib/analysis/persist.ts`.

3. ⚠️ **A URL do e-mail sem país, que foi a pior.** O teaser do Tradeoff montava `/[idioma]/tradeoff/[data]`, e a rota antiga sobrevive como **redirect de compatibilidade que aponta para o Brasil**. Medido em produção: `/en/tradeoff/2026-08-03` respondia **307 e entregava a edição BRASILEIRA**. Manchete de um país, peça de outro, sem 404 e sem link quebrado.

**Antes de disparar, sempre:** `curl` em cada um dos 3 links e conferir o **`og:title`**, não só o código HTTP. 🔴 **307 e 200 são as duas respostas de sucesso**, então código sozinho não prova nada.

🔴 **A consequência operacional, e ela é dura:** com envio por idioma, **as três versões precisam estar prontas e aprovadas ANTES do disparo**. No Weekly o inglês é a origem e pt-BR e es são derivados, então uma tradução atrasada não atrasa só ela: **trava o broadcast inteiro**. Traduzir é etapa bloqueante da quinta, não acabamento.

⚠️ **`--dry-run` é obrigatório antes do envio real**, e aqui vale em dobro porque o código será novo no mesmo dia. Rodar, conferir a contagem e a distribuição por idioma, e só então disparar.

## Memórias relacionadas

`project_us_weekly_produto_editorial` · `project_state_03ago_imprensa_weekly` · `project_us_imprensa_sem_rotulo_de_vies` · `project_us_midterms_2026_live_case` · `reference_serie_mercado_us_camara_senado_mesmo_nome`
