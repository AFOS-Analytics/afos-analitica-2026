# AFOS Analytics — Arquitetura de Banco de Dados

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Banco | Neon Postgres (serverless) |
| ORM | Prisma 7 |
| Adapter | @prisma/adapter-neon (WebSocket) |
| Validação | Zod (API boundaries) |

## Conexões

| Variável | Uso | Quando |
|----------|-----|--------|
| `DATABASE_URL` | Pooled (pgbouncer) | Runtime serverless (API routes) |
| `DATABASE_URL_UNPOOLED` | Direct | Migrations, admin, seeds |

## Schemas (6)

### `iam` — Identity & Access Management

| Tabela | Motivo |
|--------|--------|
| `users` | Perfil mínimo do usuário — email, nome, locale, status. Central para FK de preferências e consentimentos. |
| `user_preferences` | Preferências persistentes (locale, timezone, opt-in marketing). 1:1 com user. Evita poluir a tabela users com campos mutáveis. |
| `user_consents` | Registro LGPD de consentimentos com timestamp, versão de política e source. Permite auditoria e revogação. userId nullable para consentimentos pré-cadastro (lead sem conta). |

### `crm` — Customer Relationship Management

| Tabela | Motivo |
|--------|--------|
| `leads` | Emails capturados pelo popup. Separado de users porque nem todo lead vira user. Campos: capture_source, campaign, status, timestamps. |
| `contact_events` | Event sourcing de interações (subscribed, email_sent, email_opened, unsubscribed). leadId e userId nullable para flexibilidade. JSONB para payload variável por tipo de evento. |

### `research` — Pesquisas e Análises

| Tabela | Motivo |
|--------|--------|
| `sources` | Fontes de dados (institutos de pesquisa, portais de notícia, APIs). Credibility score permite ponderar confiabilidade. |
| `research_runs` | Execuções de coleta/análise. Rastreia status (pending, running, completed, failed), locale, timing. Base para pipeline de ingestão automática. |
| `research_findings` | Dados brutos e normalizados de cada run. JSONB para raw e normalized permite schemas variáveis por tipo de fonte. Country code e confidence score para filtragem. |
| `analysis_reports` | Relatórios editoriais publicáveis. Slug único para URLs. Markdown body para renderização. Status (draft, published, archived) para workflow editorial. |
| `cross_signal_links` | Relações entre entidades de schemas diferentes (ex: finding ↔ report, lead ↔ finding). Polimórfico via reference_type + reference_id. Strength score para priorização. |

### `market` — Sinais de Mercado

Schema criado, tabelas serão adicionadas quando a pipeline de ingestão Polymarket for migrada para persistência relacional. Atualmente o hot cache (Redis KV, 60s TTL) atende a demanda.

### `governance` — Auditoria e Compliance

| Tabela | Motivo |
|--------|--------|
| `audit_logs` | Trail de auditoria para toda escrita. Actor type/id para rastrear quem (system, user, cron, api). IP e user-agent como hash (não armazenar PII). Before/after data em JSONB para diff. |
| `deletion_requests` | LGPD Art. 18 — direito de exclusão. Rastreia pedidos, status (pending, processing, completed, denied) e timestamps. |

### `ai` — Inteligência Artificial

| Tabela | Motivo |
|--------|--------|
| `llm_runs` | Rastreamento de chamadas LLM. Run type (translation, analysis, summary). Input/output hash para dedup e auditoria sem armazenar conteúdo completo. Risk flags JSONB para guardrails. |

## Índices

Criados em: `email`, `slug`, `created_at`, `locale`, `run_type`, `status`, `entity_type+entity_id`, FKs.

## Convenções

- PKs: UUID v4 (`gen_random_uuid()`)
- Timestamps: `timestamptz(6)` — sempre UTC
- Soft delete: campo `status` (active/inactive/archived) — nunca DELETE
- JSONB: apenas para payloads variáveis (events, findings, risk_flags)
- Naming: snake_case no banco, camelCase no Prisma

## Comandos

```bash
# Gerar client
npx prisma generate

# Nova migration
npx prisma migrate dev --name "descricao"

# Reset (DESTROI DADOS)
npx prisma migrate reset

# Seed dev
npx tsx scripts/seed-dev.ts

# Visualizar banco
npx prisma studio
```
