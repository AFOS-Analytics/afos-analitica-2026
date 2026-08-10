# AFOS Daily — Síntese Narrativa Diária

Gerar síntese jornalística-didática do dia cruzando Polymarket + Pesquisas + Notícias, seguindo o template aprovado em 22/04/2026 e validado pelo piloto de 7 dias (decisão GO em 28/04/2026 noite).

## 🥇 Pré-requisito ZERO: o WAYBACK ATRASADO roda ANTES da daily

**Ordem do André em 03/Ago/2026, literal: "roda o wayback amanhã antes da daily".**

O arquivamento das dailies anteriores vem **antes** de escrever a do dia, não depois. A ETAPA 6 continua tendo o Wayback da daily nova; isto aqui é o **passivo acumulado**, que é outra coisa.

```bash
# 1. pré-check: bate no /save/, NUNCA na raiz. A raiz responde 200 com o save bloqueado.
curl -s -o /dev/null -w "%{http_code}\n" -m 45 "https://web.archive.org/save/https://example.com"

# 2. se deu 200, rodar a fila do mais antigo para o mais novo
npx tsx scripts/wayback-archive.ts 2026-07-29   # e assim por diante
```

⛔ **Se o pré-check der 000 ou 429, NÃO rodar e NÃO insistir.** Avisar o André **no começo da sessão**, não no fim. Rodar bloqueado não arquiva nada e aprofunda o bloqueio.

⚠️ **A armadilha do disjuntor:** as cinco primeiras URLs de qualquer daily são do Polymarket, que é domínio anti-robô. Quando ele aborta com "5 falhas de HOST seguidas", parece defeito daquelas cinco. Um teste único distingue: salvar uma URL de notícia comum. Se também der 000, é bloqueio global. Regra completa em `memory/feedback_wayback_bloqueio_de_host_nao_se_resolve_insistindo.md`.

📌 **Por que virou pré-requisito:** o passivo chegou a **cinco dias** (29-31/Jul, 01 e 03/Ago) porque o arquivamento ficava sempre para o fim da sessão, competindo com o deploy e com o cansaço. Rodar primeiro custa minutos.

## Pré-requisito obrigatório

Antes de executar este comando, o `/atualizar-brz` do mesmo dia já deve ter sido executado — o conteúdo vem dos JSONs atualizados:
- `public/analysis-criteriosa.json`
- `public/analysis-data.json`

Se o `/atualizar-brz` de hoje ainda não rodou, PARAR e pedir ao usuário para executar `/atualizar-brz` primeiro.

⚠️ O `/atualizar-brz` é o **ponto de partida** (estrutura dos JSONs + cache de notícias), NÃO a palavra final sobre o mercado: o snapshot dele pode ter minutos/horas. A **ETAPA 1.1 re-fetcha o Polymarket ao vivo** e rebaseia os JSONs se o mercado tiver andado, antes de escrever o Daily.

## ETAPA 1: Ler dados de baseline

1. Ler `public/analysis-criteriosa.json` (campo `cruzamento`, `subtitle`, `candidates[].analise`)
2. Ler `public/analysis-data.json` (cards `sentimento`, `inss`, `bancoMaster`, `stf`)
3. Extrair data de hoje em formato `YYYY-MM-DD` (usar `updatedAt` dos JSONs)

## ETAPA 1.1: RE-FETCH POLYMARKET AO VIVO (obrigatório — anti-snapshot-stale)

**Instalado 03/Jul/2026** após o Daily de 03/Jul: o `/atualizar-brz` rodou às 18:39 (consolidação, Lula 60,50%), mas ao publicar o Daily às 19:07 o mercado tinha andado 1pp (Lula rompeu 61%, gap virou recorde +39,55pp). O André pegou a defasagem conferindo o volume. **Lição gravada** em `feedback_atualizar_vs_daily_factcheck_gap.md`: o snapshot do `/atualizar-brz` pode ter minutos/horas e o Polymarket é vivo. **O Daily NÃO herda cegamente o número do `/atualizar-brz` — re-verifica ao vivo na hora de escrever.**

### Passo 1 — Re-fetch ao vivo (proxy AFOS, NUNCA gamma-api direto)

```bash
curl -s "https://www.afos-analytics.com/api/polymarket?fresh=1"
```

🔴 **O `?fresh=1` não é opcional: sem ele a rota devolve o CACHE**, com carimbo de tempo antigo, e o passo se chama "re-fetch ao vivo" sem estar ao vivo. Medido em 10/Ago/2026 no lado americano: a leitura cacheada estava **19 minutos velha** e um dos preços saía errado em 2.00pp. Aqui o efeito é pior que lá, porque o `fetchedAt` desta chamada **vira o `updatedAt` publicado do Daily**: carimbo de cache publicado é data errada na peça, não só número velho.

📌 **Conferir o `fetchedAt`, não o valor.** Duas chamadas com o mesmo carimbo são a mesma leitura comparada consigo mesma.

Extrair, do snapshot ao vivo: **% e volume dos top candidatos presidenciais** (Lula, Flávio, Renan, Michelle, Caiado, Zema, Haddad), **gap Lula×Flávio**, **volume TOTAL do presidencial** (soma dos `volumeNum`, ~USD XXM), e os sub-mercados (2º/3º lugar, STF impeach, Senado, inflação). Anotar o horário do `fetchedAt` (converter p/ BRT) — ele vira o `updatedAt` do Daily e dos JSONs se houver rebaseline.

### Passo 2 — Reconciliar contra a baseline dos JSONs

Comparar os valores ao vivo com o que está em `analysis-criteriosa.json` / `analysis-data.json` (gerados pelo `/atualizar-brz`). Calcular o delta de: Lula %, Flávio %, gap, Renan %, e volume total.

### Passo 3 — GATE de rebaseline

**Se QUALQUER um destes disparar, é OBRIGATÓRIO rebaseline ANTES de escrever o Daily:**
- Lula, Flávio, Renan ou o gap moveram **≥ 0,50pp** vs o JSON; **ou**
- um **recorde foi rompido/desfeito** (ex.: gap cruza o pico anterior, candidato cruza uma marca redonda tipo 60%/10%); **ou**
- o **enquadramento muda** (ex.: "consolidação" no JSON vira "novo recorde" ao vivo, ou vice-versa); **ou**
- o volume total diverge de forma visível do que o JSON/Daily citaria.

**Rebaseline = mini-`/atualizar-brz` pro snapshot ao vivo:** reescrever os campos numéricos + narrativa afetados em **TODOS os 5 arquivos** — `analysis-criteriosa.json` (subtitle, cruzamento, headers/analise/fortes/fracos, quadroComparativo m/t), `analysis-data.json` (sentimento, stf, bancoMaster — vírgula decimal), `polls-data.json` (`polymarketComparison` note + candidates), `app/components/CandidatesSection.tsx` (dot decimal) — e ajustar `updatedAt`/horário pro `fetchedAt` ao vivo. Usar scripts Node (fs) para os JSONs/TSX (evita o revert silencioso do OneDrive e garante vírgula/ponto decimal correto por arquivo). Rodar `npx tsx scripts/validate-polls-data.ts` (exit 0) depois.

**Se nenhum gate disparar** (mercado praticamente parado desde o `/atualizar-brz`), seguir com a baseline do JSON e apenas **atualizar o volume total** pro número ao vivo se estiver mais preciso.

### Passo 4 — Log obrigatório no chat

Emitir um mini-bloco de reconciliação antes de prosseguir:

```
## Re-fetch Polymarket — log [{fetchedAt BRT}]
- Lula: JSON X% → live Y% (Δ) | Flávio: … | gap: … | Renan: … | vol total: USD …M
- Gate de rebaseline: [DISPAROU (motivo) → rebaseline nos 5 arquivos | não disparou → mantém baseline]
```

**Regra de causação (herda da 1.5):** um movimento intradiário sem evento triggador claro é **momentum**, não reação a notícia — descrever como "saída/entrada de faixa por momentum", nunca "subiu PORQUE o evento X".

## ETAPA 1.5: FACT-CHECK GATE (obrigatório)

Antes de incorporar qualquer **evento de alto impacto** à síntese (prisão, morte, decisão judicial, indicação, demissão, vazamento), passar pelas duas verificações abaixo. Esse gate foi instalado após o incidente Vorcaro de 01/Mai/2026 (alegação falsa de prisão "hoje" quando o sujeito estava preso desde 19/Mar). Memória persistente: `feedback_afos_daily_factcheck.md`.

### Verificação 1 — Cross-reference temporal (mecânica)

```bash
npx tsx scripts/check-recurrence.ts "{keyword}"
```

Se o keyword aparece nas últimas 7 dailies, é **continuidade**, não novidade. Não tratar como divisor de águas.

### Verificação 2 — Two-source rule (Reuters/AP)

Fetch corpo de **2 fontes independentes** via `WebFetch`. Google News RSS = 1 fonte (agregador). 5 manchetes Google News sobre o mesmo evento = 1 fonte. Veículos do mesmo grupo (Folha+UOL) = 1 fonte. Confirmar:
- Data exata do evento (ISO)
- Tempo verbal do lead (passado distante = recobrança; passado recente = evento de hoje)
- Tipo do artigo: **evento** (incorporar) | **explainer/perfil** (não tratar como novidade) | **análise/desdobramento** (não tratar como divisor de águas)

### Causação requer timing compatível

Movimentos de Polymarket podem reagir a eventos novos OU refletir digestão de informação anterior. **NUNCA** atribuir "X caiu PORQUE Y aconteceu" sem confirmar que Y é da janela. Sem evento triggador claro, escrever leitura técnica ("saída do pico após série de altas").

### OUTPUT OBRIGATÓRIO — sem este bloco, ETAPA 2 não começa

Emitir literal no chat (PreToolUse hook em `.claude/settings.json` bloqueia Write em `public/afos-daily/*.md` se este bloco não estiver na transcript):

```
## Fact-check gate — log [{YYYY-MM-DD}]

**Eventos candidatos a alto impacto:** [lista | "nenhum"]

Para cada um:
- **Evento:** [descrição]
- **Verificação 1 (cross-ref):** [aparece em datas X | não] → [novidade | continuidade | recobrança]
- **Verificação 2 (fetch):** URL=..., data=YYYY-MM-DD, tipo=[evento|explainer|análise]
- **2ª fonte:** [URL independente | "não verificado"]
- **Decisão:** [incorporar | NÃO incorporar | UNVERIFIED]

**Self-check pré-deploy:**
- [ ] Toda âncora narrativa passou por Verificação 2
- [ ] Sem causação espúria entre evento e movimento Polymarket
- [ ] Verbos críticos (codebook inline na ETAPA 3.5 desta skill, tabela "Codebook verbos críticos") desambiguados
- [ ] `npx tsx scripts/reconcile-claims.ts {date}` rodado (% do markdown bate com JSON)
```

Se não houver eventos críticos, ainda emitir o bloco com `Eventos: nenhum` — documenta que o cross-reference rodou.

## ETAPA 2: Gerar markdown seguindo o template

Criar arquivo em `public/afos-daily/{YYYY-MM-DD}.md` com a estrutura EXATA do template 22/Abr:

```yaml
---
date: YYYY-MM-DD
updatedAt: "DD/MM/YYYY, HH:MM"
title: AFOS Daily — DD de MÊS de YYYY
locale: pt-BR
status: draft  # OBRIGATORIAMENTE draft. Vira published só via scripts/publish-afos-daily.ts {date} APÓS revisão humana e aprovação explícita.
lede: "[lede de 2-3 linhas capturando 3 movimentos-chave do dia]"
tldr:
  - "[Mercado: 1-2 frases sintetizando os movimentos Polymarket relevantes — gap presidencial, destaque do dia, sub-mercado relevante]"
  - "[Pesquisas+Eventos: 1-2 frases sintetizando o que pesquisas/imprensa mostraram + 1-2 eventos institucionais do dia]"
  - "[Divergência: 1 frase sintetizando a divergência mais relevante mercado × pesquisa × narrativa]"
---
```

⚠️ **REGRA TL;DR — NÃO-NEGOCIÁVEL (firmada 23/Mai/2026 noite após benchmark Prediction Circle, ativa em prod desde commit 44f643c):**

O campo `tldr` é **obrigatório** em **toda daily a partir de 23/Mai/2026 (inclusive)**. Ausência = daily incompleta, NÃO publicar.

### Estrutura canônica obrigatória

- **Exatamente 3 bullets**, espelhando as 3 seções do Daily nesta ordem:
  1. **Mercado** (movimentos Polymarket relevantes do dia)
  2. **Pesquisas+Eventos** (o que pesquisas + imprensa registraram + eventos institucionais)
  3. **Divergência** (a divergência mais relevante mercado × pesquisa × narrativa)
- **Label exibido:** "📌 TL;DR" — sigla literal (NÃO traduzir pra PT/EN/ES; convenção internet reconhecida internacionalmente)
- **Comprimento por bullet:** 1-2 frases curtas (~100-180 caracteres), escaneáveis em segundos
- **Negrito em entidades-chave** via markdown `**...**` (`**Lula 45,50%**`, `**Datafolha**`, `**Caiado ↑+0,60pp**`) — renderizado pelo template
- **Conteúdo derivado, não inventado:** os 3 bullets sintetizam o que já está no corpo do Daily — proibido criar fato novo no TL;DR que não aparece em alguma seção
- Renderizado pelo `AfosDailyTemplate.tsx` como `<aside>` callout ANTES da lede (cor primária no light theme, blue-300 no Sapphire theme)
- Traduzido junto com o resto da daily na ETAPA 3.7, na própria sessão, bullet a bullet
- Backward compatible: dailies antigas (≤22/Mai/2026) sem `tldr` continuam renderizando sem o bloco — não retroagir

### Checklist self-check pré-publish (obrigatório)

Antes de submeter o `.md` para preview, validar mentalmente:

- [ ] `tldr` tem **exatamente 3** entradas (nem 2, nem 4, nem 5)
- [ ] Bullet 1 começa com `**Mercado:**` (ou tradução EN/ES correspondente, mas mantendo a ordem semântica Mercado→Pesquisas→Divergência)
- [ ] Bullet 2 começa com `**Pesquisas+Eventos:**` ou variação coerente
- [ ] Bullet 3 começa com `**Divergência:**` ou variação coerente
- [ ] Cada bullet < 250 chars (mais que isso = não é mais TL;DR, é parágrafo)
- [ ] Toda alegação no TL;DR aparece detalhada em alguma seção do corpo
- [ ] Negrito aplicado em pelo menos 2-3 entidades-chave por bullet

### Por que essa regra é não-negociável

1. **Urgência competitiva:** Prediction Circle vai lançar "Daily Prediction Brief" Q1 2026 — formato TL;DR como produto email. AFOS Daily TL;DR antes do PC = reivindicar convenção no mercado PT/EN/ES.
2. **UX:** dailies têm 600-900 palavras. Maioria dos leitores não lê tudo. TL;DR captura quem ia bouncar.
3. **GEO/LLM:** estrutura bulletada com entidades em negrito é trivialmente parseável vs prosa — reforça posicionamento machine-readable do AFOS.

Memórias relacionadas: `project_post_launch_visualizations.md` (Fase 0 implementada 23/Mai), `project_prediction_circle_benchmark.md` (urgência competitiva PC), `feedback_tradeoff_implementation_preview_only.md` (sprint Tradeoff onde TL;DR foi implementado como Fase 0).

⚠️ **REGRA DE PUBLICAÇÃO (Fase 1.1 — publish gate):** Toda síntese nova começa como `status: draft`. Isso garante que:
- Página `/[locale]/daily/{data}` retorna 404 em produção (mas continua acessível em Vercel preview para revisão)
- `sitemap.xml` NÃO lista a draft (Google não indexa)
- `/feed/daily.xml` NÃO inclui draft (subscritores RSS não recebem push)
- `/llms.txt` NÃO inclui draft (LLM crawlers não veem)
- `getLatestDate()` NÃO retorna draft (redirect `/daily` continua na última publicada)

A flip para `published` é executada APÓS a aprovação do usuário, via:
```bash
npx tsx scripts/publish-afos-daily.ts YYYY-MM-DD --all-locales
```

Esse comando deve ser invocado em ETAPA 6 (após aprovação), nunca em ETAPA 2 (geração).

Seguido de 6 seções obrigatórias:

1. **Título + eyebrow** — "AFOS Daily · Síntese do Dia" + data por extenso
2. **Lede — SOMENTE no YAML frontmatter** (campo `lede`) — o `AfosDailyTemplate.tsx` já renderiza automaticamente como bloco prominent. NÃO repetir como blockquote `>` no body (duplica em 2 blocos visuais: azul do YAML + amarelo do body — regra firmada 25/Mai/2026, `feedback_daily_no_body_blockquote_duplicating_lede.md`). Blockquote `>` é usado APENAS na Seção 4 (Divergências).
3. **1. Mercado de previsão** — 4-5 parágrafos cobrindo: presidencial (Flávio × Lula + gap), 3ª via (Zema + Renan), 2º lugar, STF impeach, Senado, inflação
4. **2. O que os institutos registraram** — 2-3 parágrafos: TSE agregado, pesquisas do dia, próximas publicações, estaduais novos se houver. **No FIM da seção, sub-bloco obrigatório "Calendário de pesquisas — próximos 7 dias"** (ver ETAPA 2.5 abaixo).
5. **3. O que a imprensa cobriu** — 3-4 parágrafos: dinâmica governo, dinâmica oposição, pauta institucional, observações
6. **4. Divergências do dia** — box amarelo com 2-3 observações de onde mercado ≠ pesquisa ≠ notícia. **REGRA (a partir de 29/Abr/2026):** usar **blockquote markdown** (`>`) em cada parágrafo da seção, NÃO `<div class="box-divergencia">`. O template renderiza `react-markdown` sem `rehype-raw`, então HTML inline é ignorado — apenas blockquote captura o estilo amber/yellow definido em `AfosDailyTemplate.tsx` (linha 192). Exemplo correto: `> **Mercado × pesquisa:** ...` (separar parágrafos com `>` em linha vazia entre eles). Dailies anteriores (22-28/Abr) ficam como histórico, não retroagir.
7. **Em síntese** — 3 bullets numerados com observações-chave
8. **Rodapé — "## Fontes consultadas"** — ver estrutura canônica obrigatória logo abaixo

### Estrutura canônica do rodapé — "## Fontes consultadas" (NÃO-NEGOCIÁVEL, firmada 26/Mai/2026)

Regra completa em `feedback_afos_daily_fontes_consultadas_template.md`. O fim do `.md` segue EXATAMENTE este formato (ler uma daily recente em `public/afos-daily/` antes de redigir):

```markdown
---

## Fontes consultadas

**matérias com link direto para a notícia (veículos âncora):**

- [Veículo — Título da matéria](URL primária)
- ...

**matérias secundárias (URL Google News redirect — clique resolve à matéria):**

- [Veículo — Título da matéria](URL Google News redirect completa do news-cache)
- ...

**Fontes técnicas:** [Polymarket](https://polymarket.com/event/brazil-presidential-election) (cotações ao vivo via proxy AFOS, fetched DD/MMM HH:MM BRT), [registro TSE](https://divulgacandcontas.tse.jus.br/divulga/) (pesquisas eleitorais oficiais).

---

**Fontes citadas:** Polymarket, TSE (registro público), [lista plain de veículos sem links — SEM markdown].

**Método:** Síntese gerada com assistência de IA cruzando mercados de previsão, pesquisas registradas no TSE e cobertura editorial. Cada alegação factual linka diretamente à fonte primária. Fonte do método e código aberto em afos-analytics.com.

**Histórico:** Síntese DD de mês disponível em /pt-BR/daily/YYYY-MM-DD. Arquivo completo em /pt-BR/daily.
```

Regras inflexíveis do rodapé:
- Seção `## Fontes consultadas` é OBRIGATÓRIA no body, antes do separador final. NUNCA omitir.
- Os 2 sub-blocos (âncora + secundárias) sempre presentes; cada bullet no formato `- [Veículo — Título](URL)`.
- Bloco `**Fontes técnicas:**` sempre presente após os 2 sub-blocos (Polymarket + TSE linkados).
- Linha plain `**Fontes citadas:**` mantida APÓS o separador final, SEM markdown links (URL gate bloqueia) — extraída pelo loader pro footer.
- Linhas `**Método:**` e `**Histórico:**` sempre presentes após "Fontes citadas:".
- NÃO modificar `AfosDailyTemplate.tsx` pra renderizar markdown no footer — template é fixo.

## ETAPA 2.5: Sub-bloco "Calendário de pesquisas — próximos 7 dias" (no fim da Seção 2)

**Implantado em 16/Mai/2026 D+2 launch.** Bloco aditivo obrigatório no fim da Seção 2, sem modificar o template visual (markdown nativo puro, renderizado via prose-slate do `AfosDailyTemplate.tsx`).

### Como gerar

1. Consultar `/api/polls/tse?days=10` (ou ler do Neon) e filtrar:
   - `publicationDate` > hoje E ≤ hoje+7
   - `sampleSize` ≥ 1000 (filtro contra municipais de baixo n)
   - Ordenar por `publicationDate` ascendente, então por `sampleSize` descendente

2. Construir tabela markdown GFM com 6 colunas: **Data · Instituto · Amostra · Escopo · Protocolo TSE · Conf.**

3. **Highlight rows ≥ 3.000 amostra:** bold em `Data`, `Instituto` + 🔥 emoji após nome, bold em `Amostra`.

4. **Link no protocolo:** cada protocolo TSE linkado à consulta pública `https://divulgacandcontas.tse.jus.br/divulga/` (em PT, EN e ES).

5. **Parágrafo de fonte abaixo da tabela** linkando "TSE" → `https://divulgacandcontas.tse.jus.br/divulga/`.

### Template markdown obrigatório

```markdown
### 📅 Calendário de pesquisas — próximos 7 dias

Pesquisas registradas no TSE com publicação prevista entre [DD/Mai] e [DD/Mai]. Inclusão na tabela não significa publicação confirmada — institutos podem atrasar ou cancelar divulgação. Filtro aplicado: amostra ≥ 1.000. Cada protocolo linkado à [consulta pública TSE](https://divulgacandcontas.tse.jus.br/divulga/).

| Data | Instituto | Amostra | Escopo | Protocolo TSE | Conf. |
|------|-----------|---------|--------|---------------|-------|
| **DD/Mai** | **Instituto 🔥** | **n** | escopo | [BR-XXXXX/2026](https://divulgacandcontas.tse.jus.br/divulga/) | 0.X |
| DD/Mai | Instituto | n | escopo | [BR-XXXXX/2026](https://divulgacandcontas.tse.jus.br/divulga/) | 0.X |

Fonte: registro público [TSE](https://divulgacandcontas.tse.jus.br/divulga/) via API AFOS. 🔥 destaca amostras ≥ 3.000. Status "registrada ≠ publicada" — confirmação de divulgação efetiva exige verificação de duas fontes primárias antes da citação de números.
```

### Tradução EN/ES

- **EN:** Heading "📅 Polling calendar — next 7 days". Frase: "Polls registered with TSE scheduled for publication between [DD/May] and [DD/May]…"
- **ES:** Heading "📅 Calendario de encuestas — próximos 7 días". Frase: "Encuestas registradas en el TSE con publicación prevista entre [DD/May] y [DD/May]…"

### Quando NÃO incluir o bloco

- Sem nenhuma pesquisa registrada com publicação prevista nos próximos 7 dias E amostra ≥ 1.000: emitir o heading com nota "Sem pesquisas com amostra ≥ 1.000 registradas no TSE para os próximos 7 dias."
- Não pular o bloco silenciosamente — ausência também é informação.

### Princípio editorial

Bloco é **descritivo, não preditivo**. NÃO atribuir resultado à pesquisa que ainda não saiu. NÃO indicar "Datafolha 19/Mai vai mostrar X". Apenas registrar a existência da pesquisa em campo via metadata TSE.

## REGRAS EDITORIAIS DO TEMPLATE (não negociáveis)

Mantidas rigorosamente do piloto 22/Abr:

- **Volume USD inline obrigatório na Seção 1** — protocolo firmado 17/Mai (`feedback_afos_daily_volume_polymarket.md`): toda menção de candidato/mercado em Seção 1 cita % E volume USD acumulado no formato `XX,XX% (USD X,XXM)`. Aplicar a TODOS os sub-mercados: presidencial (top 5 candidatos), 2L, 3L, STF impeach, Senado, inflação. **OBRIGATÓRIO também o VOLUME TOTAL acumulado do mercado presidencial** (soma dos `volumeNum`, ~USD XXM), citado inline na Seção 1 (ex.: "volume total acumulado no presidencial soma ~USD 99,6M") — faltou no Daily 14/Jun, por isso virou regra dura. Reforça "dinheiro real" e contextualiza distorções de baixa liquidez (ex: MDB Senado spike 16,55% com vol USD 254k = distorção). **Validator W7 emite warning se < 4 menções USD na Seção 1; Validator W8 emite warning se o volume TOTAL acumulado não for citado na Seção 1; Validator W9 emite warning se o volume TOTAL não estiver no Lede.** O volume TOTAL agregado (um número, ~USD XXM) entra TAMBÉM no Lede como assinatura de "dinheiro real" — exceção à diretriz "evitar excesso técnico no Lede", que vale só para volumes por candidato (esses ficam fora do Lede). Daily 18/Mai é o gabarito (12 USDs aplicados); dailies 19-21/Mai regrediram — não repetir. **NÃO citar `liquidityNum` (liquidez de book) em texto editorial** — decisão 21/Mai/2026 após pushback do consultor de mercado: liquidez baixa em Polymarket NÃO significa preço errado (mercado é arbitrado continuamente em minutos), e expor o número técnico para leitor leigo gera misread "AFOS mostra mercado quebrado" quando na verdade indica arbitragem ativa. Volume sozinho carrega o sinal de "dinheiro real" sem o risco. Liquidity só faz sentido como dado bruto para análise interna de anomalia, nunca como número inline na narrativa.
- **Cada alegação factual com link inline** para fonte — mínimo 1 link por parágrafo substantivo
- **Zero adjetivos partidários** ("autoritário", "corrupto", "salvador", "radical", "extremista", "visionário")
- **Zero atribuição de motivação sem evidência documentada** ("ele quer X porque Y" só se Y estiver citado)
- **Simetria** — cada movimento de Flávio deve ter contrapartida de Lula (e vice-versa) quando relevante
- **Divergências declaradas explicitamente** — não mascarar em narrativa fluída
- **Tom observacional, não prescritivo** — "segundo X", "dados indicam", "o mercado precificou"
- **Variações ↑↓pp sempre citadas** quando mudou desde dia anterior
- **Datas sempre explícitas** — nunca "ontem" ou "semana passada", sempre "21 de abril"
- **Densidade: TETO DE 900 PALAVRAS, e ele é obrigatório a partir de 31/Jul/2026.** Alvo 600-900, 4-5 min de leitura.

  ⚠️ **DECISÃO DO ANDRÉ EM 30/Jul/2026: voltar ao teto de 900.** A régua escrita e a prática estavam descoladas havia pelo menos quatro dias, com a série no DOBRO do teto. Medido, no corpo, sem tabela e sem URL: **27/Jul 1.883 · 28/Jul 1.926 · 29/Jul 2.395 · 30/Jul 1.873**. Nenhuma das quatro cabia na régua.

  🔒 **REAFIRMADO EM 01/Ago/2026, e este é o ponto.** Eu levei a decisão de volta ao André propondo subir o teto para 1.100, com o argumento de que 31/Jul e 01/Ago pararam no mesmo lugar (1.065 e 1.062) depois de cortar toda a gordura. **Ele manteve os 900.** A leitura correta é que dois dias parando em ~1.060 não provam que 1.060 é o tamanho natural do dia: provam que eu parei de cortar cedo demais e comecei a chamar de "fato verificado" o que ainda era redação. Em 01/Ago, depois da reafirmação, a daily chegou a 900 SEM perder nenhum dos três blocos que eu tinha declarado incortáveis, só comprimindo. **Não repropor o teto.**

  **Como medir antes de dar por pronta** (corpo, fora do bloco de fontes, sem a tabela do calendário e sem URLs, que não são leitura):

  ```bash
  node -e "const fs=require('fs');const t=fs.readFileSync('public/afos-daily/{DATA}.md','utf-8');
  const c=t.split('## Fontes consultadas')[0].replace(/^---[\s\S]*?\n---\n/,'');
  const s=c.split('\n').filter(l=>!l.trim().startsWith('|')).join('\n').replace(/\]\([^)]*\)/g,']').replace(/https?:\/\/\S+/g,'');
  const n=s.split(/\s+/).filter(Boolean).length;
  console.log(n+' palavras '+(n<=900?'✅':'❌ CORTAR '+(n-900)))"
  ```

  **Onde cortar primeiro, na ordem:** (1) parágrafos de leitura de método que repetem a ressalva já dita na Seção 1; (2) listas de preço de nomes abaixo de 1%, que cabem numa frase só; (3) repetição do mesmo achado no corpo e em "Em síntese", que existe para resumir e não para reafirmar. **O TL;DR, as Divergências e o rodapé de fontes NÃO se cortam.**

  **Se o corte custar informação verificada, dizer isso ao André em vez de cortar calado.**

## REGRAS DE URL (não negociáveis — gate técnico bloqueia Write se violado)

Implementadas em 07/Mai/2026 após incidente daily 06/Mai (homepages em vez de URLs específicas, gamma-api em vez de polymarket.com/event). PreToolUse hook `precommit-afos-daily-urls.py` bloqueia Write automaticamente se detectar violações críticas.

### REGRA DE FONTES — mínimo 50% secundário (refinada 09/Mai/2026, supersede o 30/70 de 08/Mai; vale PT-BR/EN/ES)

> **≥50% veículos secundários via Google News redirect (acesso aberto) + ≤50% veículos âncora via RSS direto. Alvo operacional: 50–70% secundário.**

**Razão do refinamento (09/Mai, `project_afos_daily_template_definitivo.md`):** veículos âncora prestigiados têm paywall pesado (Folha/Globo/Estadão/Valor) que bloqueia leitor não-assinante, especialmente do exterior. Secundários replicam o conteúdo com acesso aberto. O 30/70 inicial (08/Mai) já priorizava acessibilidade; o piso virou ≥50% secundário, podendo ir a 60–70%. O que NÃO pode é âncora virar maioria (síntese predominante paywall).

**Veículos âncora (~30% das citações, RSS direto preserva URL primária):**
- Folha de S.Paulo · O Globo · G1 · Estadão · Valor · VEJA

**Veículos secundários (~70% das citações, Google News redirect):**
- Poder360 · CartaCapital · InfoMoney · Brasil 247 · Imirante · Diário Carioca · CNN Brasil · Gazeta do Povo · Hora do Povo · Jornal O Sul · UOL Notícias · Correio Braziliense · Diário do Centro do Mundo · BBC News Brasil · Estado de Minas · etc.

**Tolerância:** alvo 50–70% secundário; não cair abaixo de 50% secundário. Razão: prioriza acessibilidade (acesso aberto) sem perder a credibilidade institucional dos 30–50% âncora.

**Operacionalização:**
- Items com `qid` começando em `prestige-` no cache `public/news-cache/{YYYY-MM-DD}.json` são âncora (URL primária do RSS direto)
- Items das queries Google News (`eleicoes-2026`, `flavio-lula`, `master-vorcaro`, `pesquisas`, `aprovacao`, `estaduais`) são secundários (Google News redirect)
- Mirar 50–70% secundário (acesso aberto) + 30–50% prestígio âncora ao construir parágrafos da síntese
- **Seção "Fontes consultadas" SEPARADA em 2 blocos:**
  - "Matérias com link direto para a notícia" — primárias âncora
  - "Matérias secundárias (URL Google News redirect — clique resolve à matéria)" — secundárias

**Aplicar em PT-BR, EN e ES uniformemente** (as traduções da ETAPA 3.7 mantêm as URLs originais — a proporção é definida na geração PT e replicada nas traduções).

### URLs PROIBIDAS (bloqueiam Write — gate Python)

- ❌ `gamma-api.polymarket.com` — URL de API REST, não interface humana. Use `polymarket.com/event/{slug}`.
- ❌ Linha "Fontes citadas:" no rodapé com markdown links `[Texto](URL)` — o template renderiza `data.sources` como **texto plano**, então markdown vira texto literal. Use texto plano separado por vírgulas.
- ❌ **URL Google News redirect truncada (<150 chars)** — token incompleto não resolve para a matéria, leitor recebe erro 400/404. Releia URL completa do `news-cache/{YYYY-MM-DD}.json`. **NÃO copie via `head -c N` ou similar** — sempre ler URL inteira.
- ❌ **URL retornando HTTP 4xx/5xx no HEAD check** — gate faz `urllib.request.HEAD` com User-Agent browser em paralelo (8 workers, 8s timeout cada). Domínios anti-bot conhecidos (polymarket, TSE, paywalls Globo/Folha/Estadão) passam em network timeout, mas 4xx/5xx explícito SEMPRE bloqueia.

### REGRA PRESTIGE OUTLETS (Folha/Globo/Estadão)

Folha, O Globo e Estadão são veículos de prestígio nacional — citá-los empresta credibilidade ao AFOS Daily. **Mas só se o link levar a uma matéria real do veículo.** Hierarquia:

1. **WebSearch primário** com `allowed_domains: ['folha.uol.com.br']` (ou outlet equivalente). Se WebSearch retornar URL bonita do próprio veículo, usar — paywall é OK, leitor chega na página com brand do veículo.
2. **Google News redirect URL completa** (~400 chars do cache). Resolve para matéria do veículo via redirect.
3. **Atribuição plain-text + link primário de outlet secundário** — quando 1 e 2 falham. Ex: "A reportagem original do O Globo, assinada por Malu Gaspar, [resumida em Revista Fórum](https://...)". Mantém credibilidade da fonte original sem prometer link que não funciona.

**NUNCA fazer:** citar `[Folha](URL_quebrada)` quando URL gera 400/404. Hook bloqueia automaticamente, mas a regra editorial é: **preferir reformular o texto a forçar URL ruim**.

### FLUXO HÍBRIDO (procedimento obrigatório — adotado 07/Mai/2026)

**Passo 1 — Identificar 3-5 matérias-âncora do dia.** Matérias-âncora = alegações centrais da síntese (movimento Polymarket forte, pesquisa nacional publicada, evento político major). Listar antes de redigir.

**Passo 2 — Para cada matéria-âncora, buscar URL primária do veículo via WebSearch:**

```javascript
WebSearch({
  query: '"título exato ou trecho-chave" veículo data',
  allowed_domains: ['veiculo.com.br']  // restringe ao domínio
})
```

Resultado típico: URL bonita tipo `https://www.estadao.com.br/politica/carolina-brigido/.../titulo-slug/` — leva direto à matéria.

**Passo 3 — Para matérias secundárias (suplementares ao texto), usar URL Google News redirect do cache.** O `/atualizar-brz` gera `public/news-cache/{YYYY-MM-DD}.json` com todas as matérias coletadas e suas URLs primárias preservadas (`news.google.com/rss/articles/CBM...`). Ler e cruzar título→URL.

```javascript
// Pseudocódigo de leitura do cache
const cache = JSON.parse(readFileSync(`public/news-cache/${date}.json`))
const allItems = Object.values(cache.queries).flatMap(q => q.items)
const article = allItems.find(item => item.title.includes('palavra-chave'))
const url = article.link  // Google News redirect
```

**Resultado do fluxo híbrido:** matérias-âncora com URL bonita (estadao.com.br/...), matérias secundárias com Google News redirect funcional (anti-bot bypass automático). **Zero veículos sem link.**

### URLs PREFERIDAS (hierarquia de fallback)

Para CADA matéria/alegação citada, escolher URL na seguinte ordem:

1. **URL primária do veículo via WebSearch** (matérias-âncora) — `[Estadão](https://www.estadao.com.br/politica/.../titulo-slug/)`
2. **URL Google News redirect via cache** (matérias secundárias) — `[Estadão](https://news.google.com/rss/articles/CBM...)`. Funciona até com anti-bot.
3. **URL específica de mercado Polymarket** — `polymarket.com/event/{slug}`
4. **URL TSE registro** — `divulgacandcontas.tse.jus.br/divulga/`
5. **Atribuição texto plano com data exata** — apenas em último caso, e somente se cache Google News também falhou

### URLs HOMEPAGE (`https://www.veiculo.com.br/`) — evitar

Não bloqueiam Write, mas warning é emitido se >30% dos links forem homepage sem path. **Significa coleta superficial** — buscar URL específica via cache Google News antes de aceitar homepage.

### Validação manual antes de Write

Após gerar markdown, rodar:

```bash
npx tsx scripts/validate-afos-daily.ts {YYYY-MM-DD}
```

Sai com exit 1 se errors críticos. Hook PreToolUse roda equivalente automaticamente.

## ETAPA 3: Atualizar a página `/pt-BR/daily`

Editar `app/[locale]/daily/page.tsx` para refletir o novo conteúdo do dia. Manter exatamente a mesma estrutura visual aprovada em 22/Abr (Lede em box azul, seções numeradas com h2 border, box amarelo de divergências, bullets numerados em síntese, rodapé com 3 linhas).

## ETAPA 3.5: Adversarial review pass (Fase 3.3 — guardrail)

**Antes** de gerar o preview Vercel, fazer um **adversarial pass** sobre a síntese gerada.

Isso é uma sanity-check anti-viés-do-autor: invocar perspectiva de jornalista hostil tentando destruir a credibilidade da síntese.

### Como executar

Releia a síntese inteira e responda explicitamente as 5 perguntas adversariais abaixo. Cada pergunta deve gerar 1 linha de resposta — se houver vulnerabilidade real, **corrigir antes de prosseguir**.

```
## Adversarial review — pass [{YYYY-MM-DD}]

1. **Single-source claims:** Que alegações não-triviais aparecem com 1 só fonte? [listar | "nenhuma"]
2. **Numerical errors:** Algum % do markdown não bate com analysis-data.json? Rodar `npx tsx scripts/reconcile-claims.ts {date}`. [output | "OK"]
3. **Fontes inventadas:** Cada veículo citado tem matéria correspondente do dia? [verificar 3 aleatórios]
4. **Quotes literais:** Existe aspas literais sem confirmação? [listar | "nenhuma"]
5. **Causação espúria:** Existe atribuição "X aconteceu PORQUE Y" sem evidência documentada? [listar | "nenhuma"]
6. **Verbos críticos do codebook (Fase 2.3):** Algum verbo de privação de liberdade, morte, decisão judicial foi usado sem desambiguação? [listar | "OK"]

**Decisão:** [prosseguir para preview | corrigir issues antes]
```

### Codebook verbos críticos — inline (Fase 2.3, evita depender de leitura externa)

Estes verbos **devem ser desambiguados** quando aparecerem na síntese:

| Verbo | Risco | Forma desambiguada |
|-------|-------|---------------------|
| **preso** | confunde "preso hoje" vs "preso desde [data anterior]" (incidente Vorcaro 01/Mai) | "preso desde 19/Mar", "permanece preso", "foi preso em [data]" |
| **morreu / faleceu** | recobrança de morte antiga lida como evento atual | sempre data exata; se >7 dias, marcar "[recobrança]" |
| **rejeitou** (Senado/Câmara) | precisa placar e data | "rejeitou 42×34 em 28/Abr" |
| **indicou** (presidencial → STF/STJ) | confunde com "considerou indicar" | "Lula indicou X em DD/MM" — só com decreto/oficial |
| **demitiu / exonerou** | rumor vs fato | só com Diário Oficial citado |
| **vazou** (documento/áudio) | cuidado: alegação ≠ verificação | "[veículo] reportou ter acesso a..." |
| **declarou inconstitucional / suspendeu** (STF) | minoritário em colegiado vs decisão consolidada | "decisão monocrática", "plenário decidiu" |
| **operou plea deal** | em curso ≠ celebrado | "PF analisa proposta de plea deal" |
| **confessou** | nunca sem citação direta + fonte | só com aspas literais + 2 fontes |
| **renunciou** | data crítica (desincompatibilização) | "renunciou em DD/MM via Diário Oficial extra" |

**Verbos a EVITAR sempre:** "destruiu", "humilhou", "atacou", "demoliu" (carga editorial). Trocar por "criticou", "respondeu", "confrontou".

### Datas — REGRA R8 (sem "ontem")

PROIBIDO: "ontem", "hoje", "amanhã", "esta semana", "semana passada", "no início da semana".
USAR SEMPRE: data explícita por extenso ou DD/MM ("em 2 de maio", "no dia 28/Abr").

Razão: permalinks são lidos meses/anos depois. "Ontem" sem data é contexto perdido.

### Quando este pass é PARTICULARMENTE crítico

- Síntese tem >5 alegações de eventos factuais novos (mais material = mais risco)
- Caso de alto perfil envolvido (presidente, ministro STF, candidato top-3)
- Movimento de mercado forte (>3pp Polymarket) atribuído a evento — risco de causação espúria
- Pesquisa nacional publicada hoje — confrontar números com mesmo cuidado

## ETAPA 3.7: Traduzir a daily para EN e ES (obrigatório, antes do preview)

**A tradução é feita NA PRÓPRIA SESSÃO**, lendo o `{date}.md` e escrevendo o `{date}.en.md` e o `{date}.es.md`. É como a tradução do AFOS sempre foi feita, desde o lançamento, pela assinatura mensal do Claude Code.

⛔ **NÃO usar `scripts/translate-afos-daily-chunked.ts`.** Ele chama uma conta de API avulsa, que **nunca** foi o caminho. Se for executado e falhar com `anthropic_400: SEM CRÉDITO`, isso **não é bloqueio nem pendência do André**: é a ferramenta errada. ⛔ **NÃO sugerir recarregar crédito, NÃO citar saldo, NÃO listar como pendência, NÃO reabrir o assunto.** Encerrado pelo André em 25/Jul e reafirmado em 26/Jul. Regra completa em `memory/feedback_openrouter_key_e_do_chatbot_nao_da_traducao.md`.

### Como fazer

1. **Ler o pt-BR INTEIRO** antes de traduzir, e depois ler as três versões inteiras antes de dar por pronto. Varredura automática não basta (`memory/feedback_afos_daily_translation_review.md`).
2. **Espelhar as convenções da daily anterior**, não inventar: `title` traduzido, `locale` correto, `status: draft`, links de glossário no locale certo, e os rótulos do rodapé (`**Fontes citadas:**`, `**Método:**`, `**Histórico:**`) **permanecem em português nos três idiomas**, porque o loader os extrai por esse texto literal.
3. **EN** usa ponto decimal e vírgula de milhar; **ES** mantém vírgula decimal e ponto de milhar. `pesquisa` vira `poll`/`encuesta`, `1º turno` vira `first round`/`primera vuelta`, `returno` vira `runoff`/`balotaje`.
4. **URLs e protocolos TSE não mudam** entre idiomas.

### Gate obrigatório antes de seguir

- **Gate numérico:** extrair todo número seguido de unidade (`%`, `pp`, `M`, `mil`/`thousand`) do corpo das três versões, normalizar pela convenção de cada idioma, e comparar. **Tem que dar multiconjunto idêntico.** Divergiu, corrigir antes de publicar.
- **As 5 checagens:** nenhuma âncora de glossário inexistente; nenhum link apontando para outro locale; nenhum homóglifo cirílico; separador decimal consistente com o idioma (inclusive em colunas de tabela como a de confiança do calendário, que já escapou uma vez); e `tldr` com exatamente 3 bullets nas três versões.
- Varrer sobre o corpo, **fora do bloco de fontes**, senão título de matéria em português dá falso positivo.

## ETAPA 4: Gerar preview Vercel (SEM prod)

```bash
npx vercel --yes
```

Reportar URL do preview para o usuário avaliar.

## ETAPA 5: AGUARDAR APROVAÇÃO EXPRESSA

NÃO executar commit/push/deploy prod automaticamente. Aguardar mensagem explícita do usuário ("aprovado", "pode fazer", "deploy", etc.).

## ETAPA 6: Após aprovação — persistir + commit + deploy

Executar em sequência:

1. **Arquivar adversarial review pass** (Fase 3.3):
   Salvar o bloco emitido em ETAPA 3.5 em `public/afos-daily/_audit/{YYYY-MM-DD}.json`. Sem isso, audit pós-fato depende de transcripts e fica não-reproduzível.

2. **Wayback archiving (Fase 3.2):**
   ```bash
   npx tsx scripts/wayback-archive.ts YYYY-MM-DD
   ```
   Snapshot das URLs citadas na daily em archive.org/web/save antes do deploy. Se uma fonte editar/cair, evidência fica preservada.

3. **Persistir no Neon:**
   ```bash
   npx tsx scripts/persist-afos-daily.ts YYYY-MM-DD
   ```

4. **Commit + push:**
   ```bash
   git add public/afos-daily/YYYY-MM-DD*.md public/afos-daily/_audit/YYYY-MM-DD.json
   git commit -m "AFOS Daily YYYY-MM-DD — [resumo do dia em 1 linha]" (com Co-Authored-By padrão)
   git push origin main
   ```

5. **Deploy prod:**
   ```bash
   npx vercel --yes --prod
   ```

## ETAPA 7: Broadcast email aos subscribers (Fase 3 — firmada 22/Mai/2026 D+8)

**Pré-requisito:** deploy prod da ETAPA 6 concluído (URL `/{locale}/daily/{date}` precisa estar live antes do email apontar pra ela).

**Disparo automático em 2 passos:**

1. **Dry-run primeiro (preview obrigatório):**
   ```bash
   npx tsx scripts/broadcast-afos-daily.ts YYYY-MM-DD --dry-run
   ```
   Mostra título/lede extraídos das 3 versões locale (.md, .en.md, .es.md) + quantos leads ativos seriam alcançados + por idioma cada um receberia. **Nenhum email é enviado.**

2. **Send real (após dry-run aprovar):**
   ```bash
   npx tsx scripts/broadcast-afos-daily.ts YYYY-MM-DD
   ```
   Batch de 50 emails/lote com 1s delay (respeita rate limit Resend 10/s). Locale resolution: `preferredLocale` (set via /welcome) > `locale` signup (accept-language inferido) > fallback `'en'`. Link aponta pra `/{locale}/daily/{date}`. Audit log entry por batch.

**Critérios pra disparar:**
- ✅ Daily 3 versões (.md, .en.md, .es.md) com `status: published`
- ✅ Deploy prod confirmado live em `https://www.afos-analytics.com/{locale}/daily/{date}`
- ✅ Dry-run mostrou números esperados

**Quando NÃO disparar:**
- Daily ainda em draft em alguma versão locale
- Deploy prod com falha
- Dry-run mostrou 0 leads (algo de errado no Neon access)

**Histórico:** scripts/broadcast-afos-daily.ts criado 22/Mai/2026 D+8 dentro do bundle Fase 3 + locale capture flow (commit 5b3f48e). Antes desta data, distribuição era manual via outros scripts ou inexistente.

## Histórico

- **Piloto de 7 dias (22-28/Abr/2026):** ✅ concluído, decisão GO em 28/Abr noite. Feature AFOS Daily aprovada.
- **Slugs Neon do piloto** preservados como histórico. Novos arquivos a partir de 29/Abr usam slug `afos-daily-YYYY-MM-DD`.

## Observações importantes

- **Zero auto-disparo:** este comando NUNCA dispara sozinho — sempre via ação explícita do usuário
- **Cada dia um arquivo:** `public/afos-daily/{data}.md` preserva histórico legível (arquivos do piloto 22-28/Abr permanecem na pasta com nomes originais)
- **Arquivamento Neon obrigatório:** garante que nenhuma síntese se perca
- **`/pt-BR/daily` mostra sempre a última:** arquitetura dinâmica para múltiplas datas é trabalho futuro
- **`robots: noindex`** mantido (decisão de indexação para buscadores fica para a etapa de lançamento)
