# AFOS Analytics — Governança LGPD

## 1. Mapa de PII

| Dado | Tabela | Formato | Finalidade | Base legal | Retenção | Sensibilidade |
|------|--------|---------|-----------|-----------|----------|---------------|
| Email | `iam.users` | Plaintext | Identificação | Consentimento | 2 anos inativo → anonimizar | Alta |
| Email | `crm.leads` | Plaintext | Captura lead | Consentimento | 2 anos inativo → anonimizar | Alta |
| Email | `iam.user_consents` | Plaintext | Prova consentimento | Obrigação legal | Indefinido | Alta |
| Email | `governance.deletion_requests` | Plaintext | Processar exclusão | Obrigação legal | Processamento + 5 anos | Alta |
| Nome | `iam.users` | Plaintext | Identificação opcional | Consentimento | Junto com user | Média |
| IP | `governance.audit_logs` | HMAC-SHA256 com `AUDIT_HASH_SALT` (16 chars) desde 12/Nov/2026 | Correlação segurança | Interesse legítimo | 1 ano → delete | Baixa |
| User-Agent | `governance.audit_logs` | HMAC-SHA256 com `AUDIT_HASH_SALT` (16 chars) desde 12/Nov/2026 | Diagnóstico | Interesse legítimo | 1 ano → delete | Baixa |
| IP e User-Agent | `iam.user_consents` | HMAC com `AUDIT_HASH_SALT`; os anteriores a 12/Nov/2026 no esquema `h1:` (ver nota abaixo) | Prova acessória do consentimento | Obrigação legal | Junto com o consentimento | Baixa |

> **Hashes antes de 12/Nov/2026.** Eram SHA-256 sem segredo, cortados em 16 caracteres: o espaço IPv4 se enumera em minutos, então devolviam o IP a quem tivesse o banco. Em 12/Nov/2026, os 69 de `governance.audit_logs` foram apagados (sem valor de prova) e os 44 de `iam.user_consents` receberam o esquema `h1:` = HMAC(`AUDIT_HASH_SALT`, hash antigo), que preserva a prova sem permitir enumeração a quem não tem o segredo. Para conferir um IP apresentado por titular ou autoridade: `conferirHash(ip, gravado)` em `lib/audit.ts`, que entende os dois esquemas.
| Locale | `iam.user_preferences` | Plaintext | Personalização | Consentimento | Junto com user | Baixa |
| IP em Redis | Redis keys | Plaintext | Anti-abuse | Interesse legítimo | 1h TTL (auto) | Baixa |

### Dados SEM PII (analítico público — nunca destruídos por exclusão)

| Schema | Tabelas | Motivo |
|--------|---------|--------|
| `market.*` | markets, events, outcomes, prices | Dados públicos Polymarket |
| `research.*` | sources, runs, findings, reports | Pesquisas públicas |
| `ai.llm_runs` | Apenas hashes de input/output | Sem texto PII |
| `ai.model_outputs` | Texto editorial traduzido | Sem dados pessoais |

---

## 2. Política de Retenção

| Tabela | Prazo | Ação | Trigger |
|--------|-------|------|---------|
| `iam.users` | 2 anos sem login/atividade | Anonimizar email + name | Manual ou cron futuro |
| `iam.user_preferences` | Junto com user | CASCADE DELETE | Automático (FK) |
| `iam.user_consents` | Indefinido | Manter (obrigação legal) | Nunca deletar |
| `crm.leads` | 24 meses depois da última atividade (`lastSeenAt` ou `unsubscribedAt`), para status `unsubscribed`, `bounced` ou `complained` | Anonimizar via `anonymizeUser` (`purgarLeadsInativos`, `lib/governance/data-lifecycle.ts`) | Cron diário `purge-visitor-state`, lote de 200, desde 12/Nov/2026 |
| `crm.visitor_states` | 12 meses sem atividade; as linhas do lead descadastrado são desligadas na hora | DELETE | Cron diário `purge-visitor-state` |
| `crm.contact_events` | 1 ano após lead anonimizado | DELETE orphaned events | Manual |
| `governance.audit_logs` | 5 anos | DELETE | Manual |
| `governance.deletion_requests` | 5 anos após processamento | DELETE | Manual |
| `ai.llm_runs` | 1 ano | DELETE | Manual |
| `ai.model_outputs` | 1 ano | DELETE | Manual |
| `market.*` | Sem prazo | Manter (dado público) | N/A |
| `research.*` | Sem prazo | Manter (dado público) | N/A |

---

## 3. Runbook: Exclusão de Dados (LGPD Art. 18)

**Prazo legal: 15 dias úteis.**

### Passo a passo

```bash
# 1. Registrar pedido de exclusão
curl -X POST https://afos-analytics.com/api/admin/data-request \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email": "titular@email.com", "type": "deletion"}'
# Response: { "status": "accepted", "requestId": "uuid" }

# 2. Processar exclusão (anonimiza PII, preserva analítico)
curl -X POST https://afos-analytics.com/api/admin/data-request \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email": "titular@email.com", "type": "process"}'
# Response: { "status": "completed" }

# 3. Responder ao titular
# "Seus dados foram excluídos conforme LGPD Art. 18."
```

### O que acontece internamente

| Tabela | Antes | Depois |
|--------|-------|--------|
| `iam.users` | `email: "titular@email.com"` | `email: "deleted-a1b2c3@anon.local"`, `name: null`, `status: "deleted"` |
| `iam.user_preferences` | `locale: "pt-BR"` | **DELETADO** (cascade) |
| `iam.user_consents` | `email: "titular@email.com"`, `userId: "uuid"` | `email: null`, `userId: null` (registro mantido como prova legal) |
| `crm.leads` | `email: "titular@email.com"` | `email: "deleted-a1b2c3@anon.local"`, `status: "deleted"` |
| `crm.contact_events` | `leadId: "uuid"`, `eventType: "subscribed"` | **Preservado** (leadId desvinculado se lead for deletado) |
| `market.*` | dados Polymarket | **Intocado** |

---

## 4. Runbook: Exportação de Dados (LGPD Art. 18, II)

**Prazo legal: 15 dias úteis.**

```bash
curl -X POST https://afos-analytics.com/api/admin/data-request \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email": "titular@email.com", "type": "export"}'
# Response: { "status": "exported", "data": { ... } }
```

Response contém: user, preferences, consents, lead, events, deletion_requests.

---

## 5. Runbook: Revogação de Consentimento

```bash
# Soft-delete do lead (para de receber emails)
# Internamente: unsubscribe(email) → status = 'unsubscribed'
# O consent original é mantido com grantedAt e, desde 12/Nov/2026, ganha revokedAt na mesma transação.
```

Desde 12/Nov/2026: o link de descadastro do e-mail (GET) só mostra uma página de confirmação, e o cancelamento acontece no POST do botão (varredor de link de e-mail não cancela mais a inscrição). O cancelamento de um clique do Gmail e do Outlook (RFC 8058, `List-Unsubscribe-Post`) segue direto. As páginas saem no idioma do lead. Reclamação de spam recebida pelo webhook grava o status `complained`; recadastro reativa só quem está `unsubscribed`, nunca `bounced` ou `complained`.

---

## 6. Tabela de Decisão para Incidentes

| Cenário | Ação | Prazo | Endpoint |
|---------|------|-------|----------|
| Titular pediu exclusão | Registrar + processar | 15 dias úteis | `POST /api/admin/data-request` type=deletion + process |
| Titular pediu acesso | Exportar dados | 15 dias úteis | `POST /api/admin/data-request` type=export |
| Titular revogou consentimento | Soft-delete lead | Imediato | `unsubscribe(email)` via código |
| Vazamento de dados | Notificar ANPD em 72h | 72h | Manual (LGPD Art. 48) |
| Vazamento - rotação secrets | Rotacionar todos os tokens | Imediato | Vercel Dashboard → Env Vars |

### Secrets para rotacionar em caso de vazamento

| Secret | Onde |
|--------|------|
| `DATABASE_URL` | Neon Console → Roles → Reset password |
| `CRON_SECRET` | `openssl rand -hex 32` → Vercel Env Vars |
| `AUDIT_HASH_SALT` | `openssl rand -hex 32` → Vercel Env Vars (Production, não sensível, para poder conferir com `vercel env pull`). ⚠️ Trocar desliga o vínculo com TODOS os hashes já gravados, inclusive os `h1:` de consentimento |
| `TRANSLATION_AUTH_TOKEN` | `openssl rand -hex 32` → Vercel Env Vars |
| `RESEND_API_KEY` | Resend Dashboard → API Keys → Revoke + Create |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → Database → Reset token |

---

## 7. Checklist LGPD Readiness

| Item | Status |
|------|--------|
| Consentimento registrado com versão e timestamp | ✅ `iam.user_consents` |
| Consentimento revogável | ✅ `revokedAt` field + `unsubscribe()` |
| Soft-delete implementado | ✅ `status` field em users/leads |
| Hard-delete (anonimização) implementado | ✅ `anonymizeUser()` com `$transaction` |
| Exportação de dados do titular | ✅ `exportUserData()` |
| Processo de exclusão automatizado | ✅ `POST /api/admin/data-request` |
| Audit trail sem PII direta | ✅ IP/UA hasheados, email mascarado |
| Dados analíticos dissociáveis de PII | ✅ market/research intocados por exclusão |
| Política de retenção documentada | ✅ Seção 2 deste documento |
| Anti-enumeration no endpoint admin | ✅ Sempre retorna 200 |
| Auth no endpoint admin | ✅ CRON_SECRET timing-safe |
| Exclusão atômica (transação) | ✅ `prisma.$transaction()` |
| Runbook operacional documentado | ✅ Seções 3-6 deste documento |
| Política de rotação de secrets | ✅ Seção 6 deste documento |
