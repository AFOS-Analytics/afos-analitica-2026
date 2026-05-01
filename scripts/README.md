# Scripts — AFOS Analytics

Scripts utilitários e de manutenção do AFOS Analytics. Todos rodam via `tsx` e leem variáveis do `.env.local`.

## Estrutura

| Script | Propósito | Quando rodar |
|--------|-----------|--------------|
| **persist-afos-daily.ts** | Persiste arquivos `public/afos-daily/{date}.md` no Neon (tabela `analysis_reports`) com slug `afos-daily-DD-MM-YYYY`. | Após criar/editar uma síntese AFOS Daily e antes de fazer commit/deploy. |
| **persist-analysis.ts** | Persiste `analysis-data.json` e `analysis-criteriosa.json` no Neon como snapshots diários. | Manualmente após `/atualizar`. Roda automaticamente via cron Vercel às 14:00 UTC. |
| **translate-afos-daily.ts** | Traduz uma síntese AFOS Daily PT-BR → EN/ES via Claude Haiku 4.5. Lê `ANTHROPIC_API_KEY` do `.env.local`. | Quando o pipeline de tradução automatizada for ativado (Task 7.12 do roadmap). Pré-launch: tradução é manual. |
| **test-afos-daily-edge-cases.ts** | 42 testes de edge cases do loader AFOS Daily + glossário (path traversal, datas inválidas, locale fallback, etc.). | Antes de qualquer commit que toque `lib/afos-daily/`. CI roda automaticamente. |
| **seed-dev.ts** | Popula tabelas Neon com dados de teste para desenvolvimento local. | Após `npx prisma migrate dev` em ambiente novo. |
| **backfill-analysis.ts** | Re-popula `analysis_reports` a partir de arquivos JSON antigos em git history. | Apenas para recovery — não rodar em produção sem backup. |
| **check-neon-polls.ts** | Diagnóstico: lista pesquisas TSE indexadas no Neon nos últimos 15 dias. | Quando suspeitar de pesquisa duplicada ou faltando. |
| **check-neon-size.ts** | Mostra tamanho do Neon (storage, queries, connections) — útil pra monitorar consumo do free tier. | Mensalmente, ou quando pico de tráfego. |
| **send-test-welcome.ts** | Envia email de welcome de teste via Resend para validar template/SPF/DKIM. | Após mudanças em template ou domínio Resend. |

## Como rodar

```bash
# Carrega .env.local automaticamente via dotenv
npx tsx scripts/<nome>.ts [args]
```

Exemplos:

```bash
# Persistir AFOS Daily de 29/Abr no Neon
npx tsx scripts/persist-afos-daily.ts 2026-04-29

# Persistir TODOS os AFOS Daily de public/afos-daily/
npx tsx scripts/persist-afos-daily.ts

# Traduzir AFOS Daily 22/Abr para EN
npx tsx scripts/translate-afos-daily.ts 2026-04-22 --locale=en

# Traduzir para EN E ES
npx tsx scripts/translate-afos-daily.ts 2026-04-22

# Dry-run (mostra prompt sem chamar API)
npx tsx scripts/translate-afos-daily.ts 2026-04-22 --dry-run

# Rodar testes edge case
npx tsx scripts/test-afos-daily-edge-cases.ts
```

## Pré-requisitos

- `.env.local` configurado com pelo menos `DATABASE_URL` (Neon) — todos os scripts que tocam Neon falham gracefully se ausente
- Para `translate-afos-daily.ts`: `ANTHROPIC_API_KEY` ou `TRANSLATION_API_KEY` no `.env.local`
- Para `send-test-welcome.ts`: `RESEND_API_KEY` no `.env.local`

## Observações de segurança

- **Não commite outputs** de scripts de diagnóstico que expõem dados de produção (use `.gitignore` se gerar arquivos)
- Scripts que **escrevem** no Neon (`persist-*`, `backfill-analysis`, `fix-typo-email`) são idempotentes via `upsert` por slug único
- Scripts de **leitura** (`check-*`) são read-only — seguros pra rodar em produção a qualquer momento
