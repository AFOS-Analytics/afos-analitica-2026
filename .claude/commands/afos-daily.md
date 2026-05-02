# AFOS Daily — Síntese Narrativa Diária

Gerar síntese jornalística-didática do dia cruzando Polymarket + Pesquisas + Notícias, seguindo o template aprovado em 22/04/2026 e validado pelo piloto de 7 dias (decisão GO em 28/04/2026 noite).

## Pré-requisito obrigatório

Antes de executar este comando, o `/atualizar` do mesmo dia já deve ter sido executado — o conteúdo vem dos JSONs atualizados:
- `public/analysis-criteriosa.json`
- `public/analysis-data.json`

Se o `/atualizar` de hoje ainda não rodou, PARAR e pedir ao usuário para executar `/atualizar` primeiro.

## ETAPA 1: Ler dados de baseline

1. Ler `public/analysis-criteriosa.json` (campo `cruzamento`, `subtitle`, `candidates[].analise`)
2. Ler `public/analysis-data.json` (cards `sentimento`, `inss`, `bancoMaster`, `stf`)
3. Extrair data de hoje em formato `YYYY-MM-DD` (usar `updatedAt` dos JSONs)

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
- [ ] Verbos críticos (codebook em `docs/operacao/codebook-verbos-criticos.md`) desambiguados
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
---
```

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
2. **Lede (blockquote)** — 2-3 linhas bold que capturam os 3 movimentos mais relevantes
3. **1. Mercado de previsão** — 4-5 parágrafos cobrindo: presidencial (Flávio × Lula + gap), 3ª via (Zema + Renan), 2º lugar, STF impeach, Senado, inflação
4. **2. O que os institutos registraram** — 2-3 parágrafos: TSE agregado, pesquisas do dia, próximas publicações, estaduais novos se houver
5. **3. O que a imprensa cobriu** — 3-4 parágrafos: dinâmica governo, dinâmica oposição, pauta institucional, observações
6. **4. Divergências do dia** — box amarelo com 2-3 observações de onde mercado ≠ pesquisa ≠ notícia. **REGRA (a partir de 29/Abr/2026):** usar **blockquote markdown** (`>`) em cada parágrafo da seção, NÃO `<div class="box-divergencia">`. O template renderiza `react-markdown` sem `rehype-raw`, então HTML inline é ignorado — apenas blockquote captura o estilo amber/yellow definido em `AfosDailyTemplate.tsx` (linha 192). Exemplo correto: `> **Mercado × pesquisa:** ...` (separar parágrafos com `>` em linha vazia entre eles). Dailies anteriores (22-28/Abr) ficam como histórico, não retroagir.
7. **Em síntese** — 3 bullets numerados com observações-chave
8. **Rodapé** — fontes citadas + método + links

## REGRAS EDITORIAIS DO TEMPLATE (não negociáveis)

Mantidas rigorosamente do piloto 22/Abr:

- **Cada alegação factual com link inline** para fonte — mínimo 1 link por parágrafo substantivo
- **Zero adjetivos partidários** ("autoritário", "corrupto", "salvador", "radical", "extremista", "visionário")
- **Zero atribuição de motivação sem evidência documentada** ("ele quer X porque Y" só se Y estiver citado)
- **Simetria** — cada movimento de Flávio deve ter contrapartida de Lula (e vice-versa) quando relevante
- **Divergências declaradas explicitamente** — não mascarar em narrativa fluída
- **Tom observacional, não prescritivo** — "segundo X", "dados indicam", "o mercado precificou"
- **Variações ↑↓pp sempre citadas** quando mudou desde dia anterior
- **Datas sempre explícitas** — nunca "ontem" ou "semana passada", sempre "21 de abril"
- **Densidade alvo:** 600-900 palavras, 4-5 min de leitura

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

### Quando este pass é PARTICULARMENTE crítico

- Síntese tem >5 alegações de eventos factuais novos (mais material = mais risco)
- Caso de alto perfil envolvido (presidente, ministro STF, candidato top-3)
- Movimento de mercado forte (>3pp Polymarket) atribuído a evento — risco de causação espúria
- Pesquisa nacional publicada hoje — confrontar números com mesmo cuidado

## ETAPA 4: Gerar preview Vercel (SEM prod)

```bash
npx vercel --yes
```

Reportar URL do preview para o usuário avaliar.

## ETAPA 5: AGUARDAR APROVAÇÃO EXPRESSA

NÃO executar commit/push/deploy prod automaticamente. Aguardar mensagem explícita do usuário ("aprovado", "pode fazer", "deploy", etc.).

## ETAPA 6: Após aprovação — persistir + commit + deploy

Executar em sequência:

1. **Persistir no Neon:**
   ```bash
   npx tsx scripts/persist-afos-daily.ts YYYY-MM-DD
   ```

2. **Commit + push:**
   ```bash
   git add public/afos-daily/YYYY-MM-DD.md app/\[locale\]/daily/page.tsx
   git commit -m "AFOS Daily YYYY-MM-DD — [resumo do dia em 1 linha]" (com Co-Authored-By padrão)
   git push origin main
   ```

3. **Deploy prod:**
   ```bash
   npx vercel --yes --prod
   ```

## Histórico

- **Piloto de 7 dias (22-28/Abr/2026):** ✅ concluído, decisão GO em 28/Abr noite. Feature aprovada e renomeada de "AFOS Hoje" para "AFOS Daily".
- **Slugs Neon do piloto:** `afos-hoje-22-04-2026` até `afos-hoje-28-04-2026` (preservados como histórico). Novos arquivos a partir de 29/Abr usam slug `afos-daily-YYYY-MM-DD`.

## Observações importantes

- **Zero auto-disparo:** este comando NUNCA dispara sozinho — sempre via ação explícita do usuário
- **Cada dia um arquivo:** `public/afos-daily/{data}.md` preserva histórico legível (arquivos do piloto 22-28/Abr permanecem na pasta com nomes originais)
- **Arquivamento Neon obrigatório:** garante que nenhuma síntese se perca
- **`/pt-BR/daily` mostra sempre a última:** arquitetura dinâmica para múltiplas datas é trabalho futuro
- **`robots: noindex`** mantido (decisão de indexação para buscadores fica para a etapa de lançamento)
