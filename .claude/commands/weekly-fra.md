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

1. **`/atualizar-fra` rodado nas últimas horas**, com a trava de captura aprovada: `npx tsx scripts/capture-guard.ts --pais=fra` → ler a ÚLTIMA linha, `VEREDITO: APROVADO`, ou, se BLOQUEADO, publicar só o que a certificação por livro e por contrato liberar.

   🎯 **Certificação (decisão do André, 08/Nov/2026):** vencer e 1º colocado são livros de resultado exclusivo e se certificam **por livro** (`CERTIFICAÇÃO POR LIVRO`). Vai ao 2º turno e estará na cédula são contratos independentes e se certificam **por contrato** (`CERTIFICAÇÃO POR CONTRATO`): com o livro bloqueado, publica-se só o contrato listado como certificado, com o valor da 2ª leitura (`.cache/capture-guard/ultima-fra.json`, campo `contratosOk`). Nada que não esteja em uma das duas listas entra no texto.
2. **Pesquisas do dia** coletadas (cron `refresh-fr-polls`, 07:40 e 19:40 UTC) ou `/atualizar-pesquisas-fra`. A média (30 dias) e as contagens (45 dias) andam à meia-noite UTC sem pesquisa nova: a seção `A JANELA ANDA` do `scripts/pesquisas-fra.ts` diz o que sai no dia da edição. Medir no dia em que se escreve, não na véspera. A seção `PUBLICADA SEM FICHA` do mesmo atalho diz se há pesquisa já na imprensa que a tela ainda não tem (em 22/Nov/2026, véspera da №1: a vaga 10 da Toluna Harris, campo 18-19/11). Listar ao André antes de escrever; nenhum número dela entra na tela à mão.
3. **Imprensa do dia** coletada (cron `refresh-fr-press`, 3x ao dia).

Faltando qualquer um, PARAR e pedir primeiro.

## ETAPA 1: Coletar

- **Polymarket:** `curl -s "https://www.afos-analytics.com/api/polymarket?country=fra&fresh=1"`. Sem `&fresh=1` vem o cache. Conferir o `fetchedAt`.
- **Kalshi:** `curl -s "https://www.afos-analytics.com/api/kalshi?country=fra&fresh=1"`.

  🔁 **Regra desde 08/Nov/2026 (decisão do André):** a Kalshi entra com o PREÇO DA HORA sempre que a leitura passa na avaliação (`avaliacao.ok` na resposta da rota: soma 85 a 120, líder com oferta de compra e de venda). A prontidão de 14 dias (`npx tsx scripts/kalshi-prontidao.ts --pais=fra`) passou a valer só para a SÉRIE: antes de `PRONTO`, nada de variação semanal nem superlativo da Kalshi, e qualquer "desde" diz "desde 08/11/2026".
  ⚠️ O volume da Kalshi é em **CONTRATOS**, nunca em dólares. O `cadastroAtualizadoEm` é do cadastro do contrato, **não** do preço; frescor é `ultimaNegociacaoEm`.
- **Δ da semana:** `node scripts/semana-do-contrato.mjs --pais=fr --de=AAAA-MM-DD --ate=AAAA-MM-DD`. Lê o backup do Neon. Com `--neon` (desde 23/Nov/2026) ele lê as mesmas tabelas DIRETO NO NEON, sem a cauda cega do backup: é o que vale para o dia de hoje e para superlativo "desde" (controle: na semana de 15 a 21/11 os dois modos dão saída idêntica; série cortada dá 140 linhas diferentes). Os 4 livros: vencedor, vai ao 2º turno, mais votado no 1º turno, cédula. A série da Polymarket da França começa em **08/Nov/2026, 19:30 UTC** (a captura das 18:30 caiu na quarentena); a da Kalshi em **08/Nov/2026, 18:25 UTC**. Superlativo é "desde" essas datas.
- **Δ da semana da Kalshi:** `npx tsx scripts/semana-kalshi.ts --pais=fra --de=AAAA-MM-DD --ate=AAAA-MM-DD` (Neon direto, sem a cauda cega do backup; a série vale desde 22/Nov/2026, quando a prontidão passou a PRONTO; superlativo "desde 08/11/2026"; preço = último negócio, conferir `ultimaNegociacaoEm`).
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
- 💰 **VOLUME ACUMULADO DOS DOIS LIVROS, EM DÓLARES, OBRIGATÓRIO** (decisão do André, 23/Nov/2026, refeita em 24/Nov: "a Kalshi também em dólares; número de contrato não significa nada para os usuários"; vale da edição de 24/11/2026 em diante; a Weekly №1 fica como foi publicada). Uma frase com o volume acumulado do contrato de vitória na Polymarket e na Kalshi, **os dois em USD**, LADO A LADO e **nunca somados**, e quanto andou na semana. Convenção: a das duas plataformas, volume NOCIONAL, contratos negociados x US$ 1 (medido em 24/Nov: o `volumeNum` da Polymarket é a soma dos contratos do lado tomador, não dinheiro; Sylvain Durif tinha 88.386 de volume e USD 88 pagos). A frase diz "a USD 1 por contrato negociado". **ATALHO:** `node scripts/volume-acumulado-fra.mjs --de=AAAA-MM-DD --ate=AAAA-MM-DD` dá os dois acumulados (rotas do AFOS na Vercel), o que andou na semana (Neon), a conferência com as duas fontes e a frase pronta em EN/PT/ES. A frase gasta cerca de 28 palavras do teto. O portão reprova a edição sem a frase em qualquer idioma (`scripts/lib/volume-acumulado-fr.mjs`: "acumulado/cumulative", os dois livros e pelo menos dois valores em USD; controle positivo e negativo; mutação conferida em 24/Nov, inclusive a forma antiga com a Kalshi em contratos).
- ⛔ **Contratos de enchimento** ("Candidate A", "Person B", 0.50 sem negócio) não são preço. Nunca citar.

## ETAPA 3: Travas legais (só da França)

1. 🔒 **ANJ, lei 2010-476, art. 57:** multa para quem divulga cotação de site não autorizado "para promovê-lo". Na peça: **nenhum link para página de negociação** da Polymarket ou da Kalshi, nenhum convite, preço sempre como medição. Fonte de preço na seção 7 aponta para o **painel do AFOS** (`/[idioma]/dashboard/fr`), não para polymarket.com nem kalshi.com.
2. 🔇 **Lei de 1977, art. 11:** nada de pesquisa publicada, difundida ou comentada no sábado e no domingo de cada turno. A agenda já evita (segunda); **broadcast também não sai nesses dias**. Janelas em `lib/fr/silencio-eleitoral.ts`.

## ETAPA 3.5: Portão (bloqueante)

```bash
npx tsx scripts/gate-weekly-us.ts AAAA-MM-DD --pais=fr
```

Conferir que a 1ª linha diz **`país = FR`**. Ele conta os blocos pelo loader, mede o corpo contra o teto de 1.100 no inglês e roda o gate numérico dos três idiomas. Desde 23/Nov/2026, também exige a frase do **volume acumulado dos dois livros, em USD**, nos três idiomas.

## ETAPA 4: Preview, SEM prod

`npx vercel --yes`, conferir os 3 idiomas em `/[idioma]/weekly/fr/{data}` e **aguardar aprovação expressa**.

## ETAPA 5: Depois do "aprovado"

1. **Traduzir EN → pt-BR e es NA SESSÃO** (nunca por API). Decimal: **ponto nos três idiomas**; milhar muda (EN vírgula, pt-BR/ES ponto). Ler as três versões INTEIRAS.
2. `npx tsx scripts/publish-afos-weekly.ts AAAA-MM-DD --pais=fr --all-locales`  → desde 24/Nov/2026 roda SOZINHO o cartão (`build-og-card-fr-weekly.mjs`) antes de virar o status: gera os 9 cartões a partir do texto de cada idioma, grava o `ogImage`, não refaz cartão que já existe e, se reprovar (número da arte fora do texto, texto que não cabe), NADA é publicado. No commit, incluir os cartões novos `public/brand/og-fr-weekly-<N>*.png` por nome. `--sem-cartao` só em emergência.
3. Commit por nome (`git add public/afos-weekly/fr/AAAA-MM-DD*.md`), push, `npx vercel --yes --prod` **de um worktree de `origin/main`**, nunca da árvore principal.
4. `npx tsx scripts/persist-afos-weekly.ts AAAA-MM-DD --pais=fr` → slug com qualificador `fr`, sem colidir com os EUA.
5. **Broadcast:** `npx tsx scripts/broadcast-afos-weekly.ts AAAA-MM-DD --pais=fr --dry-run`, conferir contagem e idiomas; `curl` nos 3 links conferindo o **`og:title`** (307 e 200 são sucesso, código sozinho não prova país); só então o envio real.
6. **IndexNow**, depois do deploy de produção: `node scripts/indexnow-ping.mjs --edicao=weekly/fr/AAAA-MM-DD --dry-run`, conferir a lista, e rodar sem `--dry-run`.

## 📅 Calendário

**№1 na segunda 23/Nov/2026** (sugestão de 08/Nov, aguardando confirmação do André), no mesmo dia em que a tela da França vira pública (as 5 chaves: `robots`, `sitemap.ts`, `llms-txt.ts`, IndexNow, `CountrySelector`). Segundas até **03/Mai/2027**, a edição do resultado do 2º turno; **19/Abr/2027** é a do 1º turno.

## Ainda não construído

- Cartão social: FEITO (23/Nov/2026). `node scripts/build-og-card-fr-weekly.mjs --data=AAAA-MM-DD` monta os 9 cartões (3 idiomas x 3 tamanhos) a partir do próprio arquivo da edição, ANTES do preview; recusa número que não esteja no texto e não refaz cartão que já circulou sem `--refazer`. Chamado sozinho pelo `publish-afos-weekly.ts --pais=fr` desde 24/Nov/2026 (rodar antes, no preview, continua valendo para o André ver o cartão).
- `llms-txt.ts` e `sitemap.ts`: a edição entra sozinha (conferido na №1, 23/Nov).
- 💵 **Dinheiro de fato pago, nos dois livros** (anotado em 23/Nov/2026, sem prazo): o volume publicado é o nocional (contratos x US$ 1). O dinheiro que mudou de mão sai negócio a negócio (preço pago pelo lado tomador x contratos): medido em 24/Nov na Kalshi, USD 3,72 mi contra 7,46 mi nocionais, com `/markets/trades` + `/historical/trades` (antes do corte de 24/09/2026), soma dos contratos igual ao `volume_fp` em 31 de 31. Na Polymarket, `data-api.polymarket.com/v2/trades?condition_id=` (a v1 foi aposentada). Só se o André pedir.

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `project_us_weekly_produto_editorial` · `feedback_pais_nao_se_mistura_e_fallback_silencioso_entrega_o_outro` · `feedback_a_falha_do_instrumento_nunca_e_a_manchete`
