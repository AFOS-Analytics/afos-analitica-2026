# AFOS Tradeoff — Brazil Political Risk Weekly

Gerar edição semanal técnica do AFOS Tradeoff seguindo o template HTML preview validado por Custódio + Cunha em 23/Mai/2026. Audiência: leitor profissional de mercado (research, buy-side, treasury, mesa institucional).

## Pré-requisitos obrigatórios

Antes de executar este comando:

1. **O Daily da semana** deve estar atualizado — `/atualizar` rodado nos últimos 1-2 dias com dados frescos dos JSONs (`public/analysis-criteriosa.json`, `public/analysis-data.json`, `public/polls-data.json`).
2. **Snapshot Polymarket atual** — preço/volume USD de cada contrato relevante da semana. Se mais de ~12h desde último `/atualizar`, refazer.
3. **Histórico Neon** — séries de Δ semana exigem snapshots persistidos. Verificar via API ou Neon direto que tem dados da semana inteira.

Se faltar qualquer pré-requisito, PARAR e pedir ao usuário para rodar `/atualizar` primeiro.

## ETAPA 1: Coletar baseline da semana

1. Ler `public/analysis-criteriosa.json` (campo `cruzamento`, `subtitle`, `candidates[].analise`)
2. Ler `public/analysis-data.json` (cards `sentimento`, `inss`, `bancoMaster`, `stf`)
3. Snapshot Polymarket atual via `/api/polymarket` (cruzar com snapshots históricos Neon pra calcular Δ semana)
4. Determinar número da edição (`issueNumber`): N + 1 onde N = `listPublishedTradeoffs().length`
5. Determinar `weekStart` e `weekEnd`: tipicamente seg-sex da semana anterior à publicação (publicação seg = cobre seg-sex anterior)
6. Cadência fixa: **publicação toda segunda-feira**. Verificar dia da semana antes de gerar

## ETAPA 2: Estruturar markdown seguindo o template

Criar arquivo em `public/afos-tradeoff/{YYYY-MM-DD}.md` (data da segunda-feira de publicação) com frontmatter canônico:

```yaml
---
date: YYYY-MM-DD                    # Segunda da publicação
issueNumber: N                      # 1, 2, 3... (autoincrement)
weekStart: YYYY-MM-DD               # Segunda da semana coberta
weekEnd: YYYY-MM-DD                 # Sexta da semana coberta
updatedAt: "DD/MM/YYYY, HH:MM"
title: "AFOS Tradeoff — Edição №N · Semana de DD-DD MMM YYYY"
locale: pt-BR
status: draft                       # OBRIGATORIAMENTE draft inicial. Flip published só via scripts/publish-afos-tradeoff.ts {date} APÓS revisão humana.
sinalDaSemana: "[1-2 parágrafos sintetizando o sinal mais relevante da semana — equivalente do lede do Daily mas focado em pricing/mercado/divergência. Cita números-chave em negrito (Lula 45.50%, gap +17.75pp, STF impeach 6.65%). Linka mercados Polymarket relevantes. 250-450 palavras.]"
---
```

⚠️ **REGRA DE PUBLICAÇÃO (Fase 1.1 — publish gate):** Toda edição nova começa como `status: draft`. Isso garante:
- Página `/[locale]/tradeoff/{data}` retorna 404 em produção (mas acessível em Vercel preview pra revisão)
- `sitemap.xml` NÃO lista a draft (Google não indexa)
- `/feed/tradeoff.xml` NÃO inclui draft (subscritores RSS não recebem push)
- `llms.txt` NÃO inclui draft (LLM crawlers não veem)
- `getLatestDate()` NÃO retorna draft (redirect `/tradeoff` continua na última publicada)

Flip pra `published` via:
```bash
npx tsx scripts/publish-afos-tradeoff.ts YYYY-MM-DD --all-locales
```

## ETAPA 2.5: 9 seções obrigatórias do corpo (espelhando template HTML preview)

Estrutura editorial canônica firmada com Custódio + Cunha em 23/Mai/2026. Não desviar sem pedido explícito.

### 1. Executive Summary
- **3 summary cards** com a métrica mais relevante de cada eixo da semana
  - Card 1: gap presidencial principal (ex: "Gap Lula × Flávio: +17.75pp · ↓1.25pp em semana")
  - Card 2: contrato de risco institucional (ex: "STF impeach <2027: 6.65% · ↑0.20pp em semana")
  - Card 3: indicador macro (ex: "Cauda CPI ≥6.50%: 14.05% · ↓1.80pp em semana")
- Parágrafo síntese (~150 palavras) introduzindo o tema central da semana

### 2. Por que o AFOS não suaviza
- Texto fixo OU adaptado com cenário da semana sobre como média ponderada cancela informação útil
- Componente visual "anti-avg" — coluna esquerda "se fosse média" (strike-through) vs direita "AFOS reporta"
- Footer com `<strong>Por que importa:</strong>` explicando que divergência É o sinal

### 3. Cenários ponderados para a semana
- **3 cenários** com probabilidades (~):
  - Cenário base (~60%) — caminho mais provável
  - Cenário contrário ao pricing atual (~30%) — mercado pode estar errado
  - Cauda (~10%) — evento de baixa probabilidade mas alto impacto

### 4. Indicator Grid
- Tabela com 7-9 contratos relevantes
- Colunas: Contrato | Preço atual | Δ semana | Vol USD acum. | Leitura implícita
- Highlight rows nas linhas mais relevantes (gap presidencial, contrato com maior Δ, STF impeach)
- Linkar cada contrato a `polymarket.com/event/{slug}`

### 5. Liquidez e estrutura de mercado
- Volume USD total acumulado no mercado presidencial (header)
- Breakdown top-5 nomes por volume USD acumulado com vol-bars proporcionais
- Anomaly callout (amber background) quando volume alto + probabilidade baixa = convicção concentrada precificada (ex: Tarcísio histórico)

### 6. Calendário de prints price-relevant
- Tabela compacta com 4-6 eventos da próxima semana
- Colunas: Data | Print | Amostra | Por que importa
- Highlight nas pesquisas Tier 1 (Datafolha, AtlasIntel, Quaest)
- Linkar registro TSE pra cada poll

### 7. Watch list — gatilhos da semana
- 5 bullets numerados com triggers a vigiar
- Cada bullet começa com `<strong>` enunciando o evento
- Foco em pontos-de-dado que mudariam o pricing

### 8. Metodologia
- Texto fixo OU adaptado sobre não-média + 3 sinais (Polymarket + pesquisas + 400 fontes imprensa)
- Apache 2.0 + link GitHub
- 2 parágrafos curtos

### 9. Leitura adicional · cobertura macro
- 4-6 referências a veículos financeiros (Bloomberg, Reuters, FT, Valor, Estadão)
- Marcar paywall quando aplicável
- Disclaimer: AFOS é fonte primária, links secundários são leitura complementar de contexto macro

## ETAPA 3: Disclaimer financeiro hard-coded (NÃO-NEGOCIÁVEL)

No final do `body` markdown, ANTES do footer de sources, sempre incluir bloco canônico (já renderizado pelo template, mas a skill deve mencionar pra reforçar):

> **Aviso obrigatório.** Este brief é pesquisa observacional sobre infraestrutura de mercados de previsão, pesquisas eleitorais e fluxo de notícias. **Não constitui recomendação de investimento.** Nenhuma posição é recomendada ou implícita. Polymarket é mercado USD-denominado operando fora da jurisdição brasileira; volumes mencionados são informativos, não orientativos. Decisões de portfólio são responsabilidade exclusiva do leitor e devem considerar análise independente, perfil de risco e regulamentação aplicável.

## REGRAS EDITORIAIS (não negociáveis)

- **Tom técnico, não narrativo** — research/buy-side audience; sem floreio jornalístico
- **Volume USD inline obrigatório** — toda menção de contrato Polymarket cita preço + volume USD acumulado (mesma regra do Daily firmada 17/Mai)
- **NÃO citar `liquidityNum`** (decisão 21/Mai pós-pushback Rogério Menezes — liquidez baixa ≠ preço errado em mercado arbitrado)
- **Zero recomendação de investimento explícita ou implícita** — disclaimer hard-coded reforça mas linguagem editorial precisa ser observacional
- **Cada alegação factual com link** — para fonte primária (Polymarket event, registro TSE, matéria de veículo)
- **Datas explícitas** — "17/Mai noite" não "ontem"
- **Variações ↑↓pp sempre citadas** com janela temporal (em 20h, em semana, em 72h)
- **Anti-AI tells:** evitar travessão como separador, evitar parallel structure forçado, evitar adjetivos partidários, evitar bold markdown dentro de JSON quando aplicável
- **Densidade alvo:** 1500-2500 palavras corpo + 3 summary cards + 1 indicator grid + 1 liquidez block + 1 calendar table

## ETAPA 4: Preview Vercel (SEM prod)

```bash
npx vercel --yes
```

Reportar URL pra André avaliar em aba anônima.

## ETAPA 5: AGUARDAR APROVAÇÃO EXPRESSA

NÃO executar commit/push/deploy prod automaticamente. Aguardar mensagem explícita ("aprovado", "deploy prod", "pode fazer").

## ETAPA 6: Após aprovação — publicar + persistir + deploy

1. Flip status:
```bash
npx tsx scripts/publish-afos-tradeoff.ts YYYY-MM-DD --all-locales
```

2. Traduzir EN+ES:
```bash
npx tsx scripts/translate-afos-tradeoff-chunked.ts YYYY-MM-DD en
npx tsx scripts/translate-afos-tradeoff-chunked.ts YYYY-MM-DD es
```

3. Persistir no Neon:
```bash
npx tsx scripts/persist-afos-tradeoff.ts YYYY-MM-DD
```

4. Commit + push:
```bash
git add public/afos-tradeoff/YYYY-MM-DD*.md
git commit -m "AFOS Tradeoff Edição №N (YYYY-MM-DD) — [resumo em 1 linha]"
git push origin main
```

5. Deploy prod:
```bash
npx vercel --yes --prod
```

## ETAPA 7: Broadcast email (a partir da Edição №2)

**Edição №1 = silent launch sem broadcast.**

**Edição №2 em diante:** broadcast automático pra TODOS os subscribers do Daily (decisão firmada 23/Mai/2026 — sem opt-in separado).

```bash
# Dry-run primeiro
npx tsx scripts/broadcast-afos-tradeoff.ts YYYY-MM-DD --dry-run

# Send real após aprovação
npx tsx scripts/broadcast-afos-tradeoff.ts YYYY-MM-DD
```

## Observações importantes

- **Cadência fixa segunda-feira:** Tradeoff é semanal, não diário. Skill só roda às segundas (ou domingo noite preparatório). Edições "ad-hoc" entre segundas violam o ritmo prometido ao subscriber.
- **Edição №1 (semana de 19-23 Mai 2026):** publicada **Seg 25/Mai/2026** seguindo HTML preview validado por Custódio + Cunha. Conteúdo será editado próximo do silent launch.
- **Tradeoff é independente do Daily** — pode usar dados frescos do dia ou consolidar a semana inteira; o foco é em pricing/divergência semanal, não em narrativa diária.
- **HTML preview como referência canônica:** `C:\Users\afos3\OneDrive\Área de Trabalho\AFOS-Tradeoff-Preview.html` define o visual e estrutura de 9 seções. Mantido fora do git como histórico.
- **Memórias relacionadas:** `project_tradeoff_arquitetura_final.md`, `project_tradeoff_launch_sequence.md`, `feedback_tradeoff_implementation_preview_only.md`, `project_prediction_circle_benchmark.md`.
