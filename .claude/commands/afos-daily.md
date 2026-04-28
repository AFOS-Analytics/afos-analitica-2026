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
6. **4. Divergências do dia** — box com 2-3 observações de onde mercado ≠ pesquisa ≠ notícia
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
