# AFOS Weekly — França 2027 (semanal, SEGUNDAS)

Gerar a edição semanal do **AFOS Weekly da França**: editorial, escrito para o **ELEITOR COMUM**, sobre a eleição presidencial francesa (1º turno 18/Abr/2027, 2º turno 02/Mai/2027).

Criado em 08/Nov/2026. Molde: `/weekly-usa`, cujas regras de escrita valem aqui inteiras (fronteira com o Tradeoff, 7 seções, teto de 1.100 palavras, travas herdadas do Daily, portão do loader, fontes com `hideUrl`). Este arquivo diz **o que muda na França**; onde ele não fala, vale o `/weekly-usa`.

## 🔴 O que muda em relação aos EUA

| | Weekly EUA | **Weekly França** |
|---|---|---|
| Dia | quinta | **SEGUNDA** (decisão do André, 08/Nov/2026) |
| Origem | inglês | **inglês** (mesma regra) |
| Pasta | `public/afos-weekly/us/` | **`public/afos-weekly/fr/`** |
| Idiomas | EN, PT-BR, ES | **EN, PT-BR, ES. Sem francês** (decisão do André, 08/Nov/2026) |
| Mercado | 1 livro (Polymarket) | **2 livros: Polymarket e Kalshi, LADO A LADO, nunca em média** |
| Pesquisa | generic ballot, média simples | **(a) lista principal de cada instituto + (b) média por candidato**, com a ficha oficial da Commission des sondages |
| Lei | nenhuma restrição | **ANJ (art. 57) e lei de 1977 (silêncio eleitoral)**: ver abaixo |

📅 **Por que segunda:** as pesquisas francesas saem concentradas no fim de semana (La Tribune Dimanche, JDD, Harris datada de segunda), e a segunda depois de cada turno (19/Abr e 03/Mai/2027) vira a edição do resultado. Nenhuma edição cai no sábado ou no domingo do silêncio eleitoral.

## 🌍 País: SEMPRE `fr`, em todo comando

Todo script desta skill recebe `--pais=fr` (ou `country=fra` na API). **Sem o país, vários caem nos EUA ou no Brasil, bem-formados e calados.** Conferir na SAÍDA o país impresso na 1ª linha, não no comando digitado. → `memory/feedback_pais_nao_se_mistura_e_fallback_silencioso_entrega_o_outro.md`

## Pré-requisitos

1. **`/atualizar-fra` rodado nas últimas horas**, com a trava de captura aprovada: `npx tsx scripts/capture-guard.ts --pais=fra` → ler a ÚLTIMA linha, `VEREDITO: APROVADO`.
2. **Pesquisas do dia** coletadas (cron `refresh-fr-polls`, 07:40 e 19:40 UTC) ou `/atualizar-pesquisas-fra`.
3. **Imprensa do dia** coletada (cron `refresh-fr-press`, 3x ao dia).

Faltando qualquer um, PARAR e pedir primeiro.

## ETAPA 1: Coletar

- **Polymarket:** `curl -s "https://www.afos-analytics.com/api/polymarket?country=fra&fresh=1"`. Sem `&fresh=1` vem o cache. Conferir o `fetchedAt`.
- **Kalshi:** `curl -s "https://www.afos-analytics.com/api/kalshi?country=fra&fresh=1"`.

  🔁 **Regra desde 08/Nov/2026 (decisão do André):** a Kalshi entra com o PREÇO DA HORA sempre que a leitura passa na avaliação (`avaliacao.ok` na resposta da rota: soma 85 a 120, líder com oferta de compra e de venda). A prontidão de 14 dias (`npx tsx scripts/kalshi-prontidao.ts --pais=fra`) passou a valer só para a SÉRIE: antes de `PRONTO`, nada de variação semanal nem superlativo da Kalshi, e qualquer "desde" diz "desde 08/11/2026".
  ⚠️ O volume da Kalshi é em **CONTRATOS**, nunca em dólares. O `cadastroAtualizadoEm` é do cadastro do contrato, **não** do preço; frescor é `ultimaNegociacaoEm`.
- **Δ da semana:** `node scripts/semana-do-contrato.mjs --pais=fr --de=AAAA-MM-DD --ate=AAAA-MM-DD`. Lê o backup do Neon. Os 4 livros: vencedor, vai ao 2º turno, mais votado no 1º turno, cédula. A série da Polymarket da França começa em **08/Nov/2026, 18:30 UTC**; a da Kalshi em **08/Nov/2026, 18:25 UTC**. Superlativo é "desde" essas datas.
- **Pesquisas:** o registro `fr-polls` mais recente do Neon (o mesmo que a tela lê). Usar **só `publicavel: true`**. Divergência de ficha e ficha pendente não viram número na peça.
- **Imprensa:** o registro `fr-press` mais recente. Manchete fica no **francês original**, com a tradução na peça.

## ETAPA 2: Escrever as 7 seções (como `/weekly-usa`)

Arquivo `public/afos-weekly/fr/{data}.md`, **em inglês**, `status: draft`.

**Específicas da França:**

- 🔴 **Os dois livros nunca se somam nem se tiram em média.** A distância entre eles (Polymarket menos Kalshi, em pontos) é medição própria e pode ser manchete do cruzamento.
- 🔴 **Nunca subtrair mercado de pesquisa.** O mercado paga probabilidade de vencer; a pesquisa mede intenção de voto num turno. São grandezas diferentes.
- 🏷️ **Toda média de pesquisa diz de quantas listas e institutos ela saiu.** "Le Pen 34.7 de média" não basta: "34.7, média de 38 listas de 7 institutos nos últimos 30 dias". Listas diferentes de candidatos: a média é o centro do que foi medido, não previsão.
- 🏷️ **Todo número diz de qual contrato ele é:** vencer a eleição, ir ao 2º turno, ser o mais votado no 1º turno, estar na cédula. Os quatro dão números muito diferentes para a mesma pessoa.
- ⚖️ **Le Pen e a cédula:** o recurso na Cour de cassation (decisão "no mais tardar no início de abril de 2027") muda o que o mercado mede. Descrever o contrato da cédula ao lado do de vitória, sem dizer que um "explica" o outro.
- ⛔ **Contratos de enchimento** ("Candidate A", "Person B", 0.50 sem negócio) não são preço. Nunca citar.

## ETAPA 3: Travas legais (só da França)

1. 🔒 **ANJ, lei 2010-476, art. 57:** multa para quem divulga cotação de site não autorizado "para promovê-lo". Na peça: **nenhum link para página de negociação** da Polymarket ou da Kalshi, nenhum convite, preço sempre como medição. Fonte de preço na seção 7 aponta para o **painel do AFOS** (`/[idioma]/dashboard/fr`), não para polymarket.com nem kalshi.com.
2. 🔇 **Lei de 1977, art. 11:** nada de pesquisa publicada, difundida ou comentada no sábado e no domingo de cada turno. A agenda já evita (segunda); **broadcast também não sai nesses dias**. Janelas em `lib/fr/silencio-eleitoral.ts`.

## ETAPA 3.5: Portão (bloqueante)

```bash
npx tsx scripts/gate-weekly-us.ts AAAA-MM-DD --pais=fr
```

Conferir que a 1ª linha diz **`país = FR`**. Ele conta os blocos pelo loader, mede o corpo contra o teto de 1.100 no inglês e roda o gate numérico dos três idiomas.

## ETAPA 4: Preview, SEM prod

`npx vercel --yes`, conferir os 3 idiomas em `/[idioma]/weekly/fr/{data}` e **aguardar aprovação expressa**.

## ETAPA 5: Depois do "aprovado"

1. **Traduzir EN → pt-BR e es NA SESSÃO** (nunca por API). Decimal: **ponto nos três idiomas**; milhar muda (EN vírgula, pt-BR/ES ponto). Ler as três versões INTEIRAS.
2. `npx tsx scripts/publish-afos-weekly.ts AAAA-MM-DD --pais=fr --all-locales`
3. Commit por nome (`git add public/afos-weekly/fr/AAAA-MM-DD*.md`), push, `npx vercel --yes --prod` **de um worktree de `origin/main`**, nunca da árvore principal.
4. `npx tsx scripts/persist-afos-weekly.ts AAAA-MM-DD --pais=fr` → slug com qualificador `fr`, sem colidir com os EUA.
5. **Broadcast:** `npx tsx scripts/broadcast-afos-weekly.ts AAAA-MM-DD --pais=fr --dry-run`, conferir contagem e idiomas; `curl` nos 3 links conferindo o **`og:title`** (307 e 200 são sucesso, código sozinho não prova país); só então o envio real.

## 📅 Calendário

**№1 na segunda 23/Nov/2026** (sugestão de 08/Nov, aguardando confirmação do André), no mesmo dia em que a tela da França vira pública (as 5 chaves: `robots`, `sitemap.ts`, `llms-txt.ts`, IndexNow, `CountrySelector`). Segundas até **03/Mai/2027**, a edição do resultado do 2º turno; **19/Abr/2027** é a do 1º turno.

## Ainda não construído

- Cartão social próprio da Weekly França (`scripts/build-og-card-us-weekly.mjs` é o molde). Sem ele a edição sai com o cartão padrão.
- Entrada da França no `sitemap.ts` e no `llms-txt.ts`: entram no dia da №1, junto com a tela.

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `project_us_weekly_produto_editorial` · `feedback_pais_nao_se_mistura_e_fallback_silencioso_entrega_o_outro` · `feedback_a_falha_do_instrumento_nunca_e_a_manchete`
