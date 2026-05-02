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

## ETAPA 1.5: FACT-CHECK GATE (obrigatório — guardrail incidente Vorcaro 01/Mai/2026)

Antes de incorporar qualquer **evento factual de alto impacto** à síntese (prisão, morte, decisão judicial, indicação, demissão, ruptura institucional, vazamento), **VERIFICAR TIMING** em duas etapas:

### Verificação 1 — Cross-reference temporal

Ler os ÚLTIMOS 3-5 arquivos `public/afos-daily/YYYY-MM-DD.md` e comparar:
- Esse evento já apareceu em síntese anterior?
- Se sim, é **continuidade** (delação progredindo, julgamento em andamento) — NÃO trate como novidade do dia
- Se não, fetch artigo completo (próxima etapa)

### Verificação 2 — Fetch corpo de pelo menos 1 artigo

Headlines de Google News RSS retornam título + timestamp, NÃO o corpo do artigo. Verbos como "preso", "que levaram à prisão", "morto", "decidiu X" no título podem referir a:
- **Evento de hoje** (incorporar)
- **Explainer/perfil** sobre situação em curso (NÃO tratar como evento novo — texto atemporal)
- **Análise/desdobramento** sobre evento passado (NÃO incorporar como divisor de águas)

Use `WebFetch` para abrir 1 artigo do veículo principal e extrair:
- Data exata do evento descrito
- Tempo verbal do lead do artigo (passado distante = evento antigo recoberto; passado recente = evento de hoje)
- Se o artigo é "perfil/explainer" sobre figura já em situação crítica

### Quando incorporar à síntese

- ✅ Evento confirmadamente acontecido **na janela do dia da síntese** → incorporar com link e tom factual
- ⚠️ Evento de janela ambígua (ex: "decisão de ontem comentada hoje") → incorporar com framing correto ("comentários sobre decisão de DD/MM")
- ❌ Evento já em curso há semanas/meses → NÃO tratar como divisor de águas; tratar como continuidade

### Não atribuir CAUSAÇÃO sem timing compatível

Movimentos de mercado (Polymarket) podem reagir a eventos novos ou refletir digestão de informação anterior. **NUNCA** atribuir causação tipo "STF impeach caiu PORQUE Vorcaro foi preso" sem confirmar que Vorcaro foi preso na janela compatível. Se não houver evento triggador claro do dia, escrever "saída do pico do ciclo após série de altas" ou similar — leitura técnica, não narrativa especulativa.

### Histórico do incidente (não esquecer)

Em **01/Mai/2026**, gerei síntese afirmando "Daniel Vorcaro PRESO PELA PF HOJE — divisor de águas Master" e atribuindo a queda do STF impeach (-2.5pp) à "vindicação institucional pela prisão". Era falso: Vorcaro estava preso desde 19/Mar/2026. As 5 manchetes do Google News eram explainers sobre o já-preso (perfis, apuração de mensagens, declarações antigas vindo a público). O usuário pegou o erro antes do deploy prod. Esse fact-check gate foi adicionado para impedir recorrência.

## ETAPA 2: Gerar markdown seguindo o template

Criar arquivo em `public/afos-daily/{YYYY-MM-DD}.md` com a estrutura EXATA do template 22/Abr:

```yaml
---
date: YYYY-MM-DD
updatedAt: "DD/MM/YYYY, HH:MM"
title: AFOS Daily — DD de MÊS de YYYY
locale: pt-BR
status: published
lede: "[lede de 2-3 linhas capturando 3 movimentos-chave do dia]"
---
```

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
