# AFOS Analytics — Operações de Produção

## 1. Ambientes

| Ambiente | URL | Banco | Branch | Uso |
|----------|-----|-------|--------|-----|
| **Local** | `localhost:3000` | Neon main (via .env.local) | `main` ou feature | Desenvolvimento |
| **Preview** | `*.vercel.app` (por PR) | Neon main (shared) | PR branch | QA de features |
| **Production** | `afos-analytics.com` | Neon main | `main` | Produção |

### ENV vars por ambiente

| Variável | Local (.env.local) | Preview (Vercel) | Production (Vercel) |
|----------|-------------------|-----------------|-------------------|
| DATABASE_URL | Pooled | ✅ | ✅ |
| DATABASE_URL_UNPOOLED | Direct | ✅ | ✅ |
| UPSTASH_REDIS_* | — | Via Vercel | Via Vercel |
| CRON_SECRET | — | — | ✅ |
| RESEND_API_KEY | — | ✅ | ✅ |
| TRANSLATION_AUTH_TOKEN | — | — | ✅ |

### Neon Preview Branches (quando escalar)

```bash
# Criar branch para PR (futuro, quando houver migrations frequentes)
neonctl branches create --name "preview/pr-123" --parent main
# Cada preview deploy usa branch isolada — zero risco para prod
```

---

## 2. Deploy

### Deploy normal (push to main)

```bash
git push origin main
npx vercel --prod
```

### Deploy com migration

```bash
# 1. Criar migration local (usa DATABASE_URL_UNPOOLED)
npx prisma migrate dev --name "descricao"

# 2. Commit migration + código
git add prisma/migrations/ prisma/schema.prisma
git add <arquivos alterados>
git commit -m "migration: descricao"
git push origin main

# 3. Deploy (postinstall roda prisma generate)
npx vercel --prod

# 4. Aplicar migration em produção
# Opção A: automático se Neon está apontado para mesma branch
# Opção B: manual via Neon SQL Editor
```

### Verificação pós-deploy

```bash
# Health check
curl -s https://afos-analytics.com/api/health | jq .

# Metrics (requer CRON_SECRET)
curl -s https://afos-analytics.com/api/admin/metrics \
  -H "Authorization: Bearer $CRON_SECRET" | jq .
```

---

## 3. Rollback

### App (deploy quebrou)

```bash
# Listar deploys recentes
npx vercel ls --limit 5

# Promover deploy anterior para produção (~10 seg, zero downtime)
npx vercel promote <deployment-url-anterior>
```

### Código (commit quebrou)

```bash
git revert HEAD
git push origin main
npx vercel --prod
```

### Banco (migration quebrou)

```bash
# NUNCA usar migrate reset em produção
# Criar migration de correção:
npx prisma migrate dev --name "revert_broken_change"
git add prisma/migrations/
git commit -m "revert: migration quebrada"
git push origin main
npx vercel --prod
```

### Dados (corrupção)

```bash
# Neon Point-in-Time Recovery (free tier, 24h)
# Neon Console → Branches → Restore to timestamp
```

---

## 4. Health Checks

### Endpoint: `GET /api/health`

| Componente | Check | Healthy | Degraded |
|-----------|-------|---------|----------|
| App | Response 200 | ✅ | Timeout |
| Redis | `isKvAvailable()` | `ok: true` | `ok: false` |
| Cron | Redis timestamp age < 5min | `ok: true` | `ageSeconds > 300` |
| Polymarket | Circuit breaker | `CLOSED` | `OPEN` |
| Neon | `SELECT 1` | `ok: true` | `ok: false` |

### Endpoint: `GET /api/admin/metrics` (auth required)

Retorna: leads (total, 7d, 30d), market prices (total, 24h), audit logs, LLM runs, deletion requests.

### Monitoramento externo (recomendado)

```
UptimeRobot (free):
  URL: https://afos-analytics.com/api/health
  Intervalo: 5 minutos
  Alerta: email quando status != 200
```

---

## 5. Observabilidade

| O que monitorar | Onde | Custo |
|----------------|------|-------|
| App errors | Vercel Dashboard → Functions → Error rate | $0 |
| Response time | Vercel Dashboard → Analytics → Web Vitals | $0 |
| Cron status | `/api/health` → `cron.ok` + `ageSeconds` | $0 |
| Polymarket falhas | `/api/health` → `polymarket.circuit` + `failures` | $0 |
| Banco status | `/api/health` → `neon.ok` | $0 |
| Leads growth | `/api/admin/metrics` → `leads.last7d` | $0 |
| Market data volume | `/api/admin/metrics` → `marketPrices.total` | $0 |
| LLM usage | `/api/admin/metrics` → `llmRuns.last7d` | $0 |
| Audit volume | `/api/admin/metrics` → `auditLogs.last24h` | $0 |
| LGPD pendências | `/api/admin/metrics` → `deletionRequests.pending` | $0 |

### Alertas

| Alerta | Trigger | Canal | Setup |
|--------|---------|-------|-------|
| Site down | Health 503 por 3 checks | Email | UptimeRobot free |
| Cron stale | `ageSeconds > 600` | Vercel logs | Manual check semanal |
| Circuit open | `polymarket.circuit: OPEN` | Vercel logs | Manual check |
| Neon down | `neon.ok: false` | UptimeRobot | Via health check |
| Deletion pendente > 10 dias | `deletionRequests.pending > 0` | Manual | Check semanal via metrics |

---

## 6. Política de Custo

### Limites de free tier

| Serviço | Free tier | Uso atual | Margem |
|---------|-----------|-----------|--------|
| Vercel | 100GB bandwidth, 100h build | < 1% | 99% |
| Neon | 0.5 GiB storage, 191.9h compute | ~5 MB | 99% |
| Upstash Redis | 10k cmds/dia | ~5k/dia | 50% |
| Resend | 100 emails/dia | < 5/dia | 95% |

### Controle de volume

| Dado | Geração | Controle |
|------|---------|---------|
| market_prices | ~60 rows/dia (com dedup) | Cron inteligente: hot 15min, warm 60min, cold skip |
| audit_logs | ~50 rows/dia | Fire-and-forget, sem volume excessivo |
| llm_runs | ~10 rows/dia | Só chamadas reais (cache evita duplicata) |
| leads | ~1-5/dia (fase inicial) | Natural, sem controle necessário |

### Compactação futura (quando necessário)

```sql
-- Quando market_prices > 100k rows:
-- Agregar snapshots > 7 dias em 1 row/dia por market
INSERT INTO market.forecast_snapshots (market_id, snapshot_date, probability_yes)
SELECT market_id, DATE(snapshot_at), AVG(price)
FROM market.market_prices
WHERE snapshot_at < NOW() - INTERVAL '7 days'
GROUP BY market_id, DATE(snapshot_at)
ON CONFLICT (market_id, snapshot_date) DO NOTHING;

-- Depois deletar os finos
DELETE FROM market.market_prices WHERE snapshot_at < NOW() - INTERVAL '7 days';
```

---

## 7. Plano de Escala

### Gatilhos numéricos

| Gatilho | Threshold | Ação | Custo |
|---------|-----------|------|-------|
| Response p95 > 3s | Vercel Analytics | Upgrade Vercel Pro | $20/mês |
| Neon storage > 400MB | Neon Console | Upgrade Neon Launch | $19/mês |
| Redis cmds > 8k/dia | Upstash Console | Pay-as-you-go | ~$1/mês |
| Emails > 80/dia | Resend Dashboard | Upgrade Resend Pro | $20/mês |
| market_prices > 100k rows | Metrics endpoint | Ativar compactação | $0 |
| Visitas > 100k/mês | Vercel Analytics | Vercel Pro | $20/mês |
| LLM cost > $50/mês | llm_runs count × preço | Cache mais agressivo | $0 |

### Quando NÃO escalar

| Tentação | Resistir até |
|----------|-------------|
| Migrar banco | Neon > 80% storage |
| Adicionar Sentry | > 3 pessoas no time |
| Microserviços | > 500k visitas/mês |
| Kafka / queues | > 10k eventos/segundo |
| Redis dedicado | Upstash > 80% free tier |
| CDN separada | Vercel CDN dando problema |

---

## 8. Incident Response

### Incidente 1: Site fora do ar

```bash
# Detectar
curl -s https://afos-analytics.com/api/health

# Se timeout → Vercel down → status.vercel.com → esperar
# Se 503 → ver components no JSON

# Se neon.ok: false
# → Dashboard continua (Redis). Subscribe falha graceful
# → Neon Console: verificar status

# Se redis.ok: false
# → Rate limit em fallback memória
# → Upstash Console: verificar status

# Se > 30 min → rollback
npx vercel ls --limit 5
npx vercel promote <url-anterior>
```

### Incidente 2: Cron parou

```bash
# Detectar: health → cron.ok: false, ageSeconds > 300

# Vercel Dashboard → Cron → Logs
# Se timeout → Polymarket lento, circuit breaker protege, aguardar
# Se error → git log, revert se necessário
# Se not running → verificar vercel.json, redeploy

# UX: dados stale por até 10 min (Redis KV TTL)
```

### Incidente 3: Polymarket bloqueou

```bash
# Detectar: health → polymarket.circuit: OPEN

# Circuit breaker reabre em 5 min (automático)
# Dashboard mostra dados de até 10 min atrás
# Se persistir: verificar Polymarket status + rate limits
```

### Incidente 4: Banco indisponível

```bash
# Detectar: health → neon.ok: false

# Dashboard: FUNCIONA (Redis + JSON)
# Subscribe: FALHA GRACEFUL ("tente mais tarde")
# Audit: FALLBACK console.log
# Market persist: SILENCIADO

# Neon Console: verificar. Recuperação automática quando volta
```

### Incidente 5: Vazamento de dados

```bash
# IMEDIATO (primeiras 4 horas):
# 1. Rotacionar TODOS os secrets
#    Neon: Console → Roles → Reset password
#    Vercel: Dashboard → Env Vars → atualizar cada um
#    Resend: Dashboard → API Keys → Revoke + Create
# 2. Redeploy
npx vercel --prod

# 72 HORAS: Notificar ANPD (LGPD Art. 48)
# INVESTIGAR: governance.audit_logs por acessos anômalos
```

### Incidente 6: LGPD — pedido de exclusão

```bash
# Prazo: 15 dias úteis
curl -X POST .../api/admin/data-request \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"email": "titular@email.com", "type": "deletion"}'

curl -X POST .../api/admin/data-request \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"email": "titular@email.com", "type": "process"}'

# Verificar: status: "completed"
# Responder ao titular
```

---

## 9. Checklist Go-Live

### Infra

- [x] Vercel production deploy ativo
- [x] Neon Postgres conectado (pooled + unpooled)
- [x] Upstash Redis conectado (rate limit + KV cache)
- [x] Resend configurado (welcome email)
- [x] Cron 5min ativo (vercel.json)
- [x] `postinstall: prisma generate` no package.json
- [x] ENV vars em production + preview

### Segurança

- [x] HSTS + CSP + security headers (next.config.mjs)
- [x] Rate limit global (middleware 100/min/IP)
- [x] Rate limit subscribe (5/hora/IP)
- [x] Rate limit translations (60/min/token)
- [x] Rate limit preferences (10/min/IP)
- [x] Auth timing-safe em translations + admin endpoints
- [x] Zod validation em todos os POST
- [x] Honeypot anti-bot no subscribe
- [x] AI guardrails (injection detection, risk flags, canPublish)
- [x] Audit trail (governance.audit_logs)
- [x] IP/UA hasheados (SHA256)

### LGPD

- [x] Consentimento registrado com versão + timestamp
- [x] Exclusão automatizada (anonymizeUser + $transaction)
- [x] Exportação de dados do titular
- [x] Política de retenção documentada
- [x] Anti-enumeration no endpoint admin
- [x] docs/LGPD.md completo

### Dados

- [x] Schema v2 (UUID, timestamptz, 19 tabelas, 6 schemas)
- [x] Market ingestion (cron inteligente, dedup 2 camadas)
- [x] AI tracking (llm_runs + model_outputs + classification)
- [x] Popup → Neon (contrato HTTP inalterado)

### Observabilidade

- [x] Health check (app + redis + cron + neon + polymarket)
- [x] Metrics endpoint (leads, prices, audit, llm, deletions)
- [x] Runbooks documentados (6 cenários)
- [ ] UptimeRobot configurado (manual, 5 min)

### Arquivos protegidos (nunca alterados)

- [x] EmailPopup.tsx
- [x] templates.ts
- [x] resend.ts

---

## 10. Riscos Operacionais

| Risco | Impacto | Probabilidade | Mitigação | Owner |
|-------|---------|--------------|-----------|-------|
| Neon free tier storage esgotado | Subscribe + audit param | Baixa (99% margem) | Monitorar semanal, compactar market_prices | Operador |
| Neon compute hours esgotadas | Todas as queries falham | Baixa (health ping leve) | Monitorar semanal no Console | Operador |
| Vercel cold start > 5s | UX degradada em primeira visita | Média | Health check mantém Neon quente | Automático |
| Polymarket muda API | Ingestão para | Baixa | Circuit breaker + fallback Redis 10min | Automático |
| CRON_SECRET vaza | Admin endpoints expostos | Baixa | Rotacionar, min 32 chars | Operador |
| Redis atinge 10k cmds/dia | Rate limit para | Média (50% margem) | Monitorar, upgrade pay-as-you-go | Operador |
| Resend atinge 100 emails/dia | Welcome emails param | Baixa (< 5/dia atual) | Monitorar, upgrade quando > 80 | Operador |
| Migration quebra schema em prod | App errors em runtime | Média | Testar em preview, rollback via promote | Dev |
| LLM provider down | Traduções falham | Baixa | In-memory cache 24h + fallback approved | Automático |
| DDoS no subscribe | Rate limit esgota Redis | Baixa | Honeypot + rate limit 5/IP/h + middleware global | Automático |
