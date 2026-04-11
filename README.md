# AFOS Analytics

**Plataforma Global de Inteligência Eleitoral em Tempo Real**

🔗 **[afos-analitica-2026.vercel.app](https://afos-analitica-2026.vercel.app)**

> *Democracy runs on information. Information runs on transparency. AFOS Analytics is programmable transparency.*

---

## Sobre

O **AFOS Analytics** é uma plataforma global de inteligência eleitoral em tempo real.

Monitoramos eleições no mundo inteiro e transformamos dados complexos em informação clara, objetiva e acionável, combinando em um único ambiente:

- Mercados internacionais de previsão com dinheiro real (Polymarket)
- Pesquisas de opinião eleitoral tradicionais
- Notícias da grande imprensa
- Sinais e sentimento das redes sociais
- Análises estratégicas geradas com inteligência artificial

**Open Source. Gratuito. Multilíngue (PT-BR / EN / ES). Mobile e desktop.**

---

## Internacionalização (i18n)

Plataforma disponível em 3 idiomas com rotas dedicadas:

| Idioma | Rota | Status |
|--------|------|--------|
| Português (BR) | `/pt-BR` | Default |
| English | `/en` | Completo |
| Español | `/es` | Completo |

### Arquitetura i18n

```
Middleware: detecta locale (URL → cookie → Accept-Language → pt-BR)
  ↓
/[locale]/page.tsx → dashboard traduzido
/[locale]/global/page.tsx → mapa global traduzido
  ↓
I18nProvider: carrega mensagens server-side → passa via context
  ↓
Componentes: t('header.title') → string no idioma correto
```

- **244 chaves** × 3 idiomas = 732 strings traduzidas
- **4 namespaces**: common, home, about, seo
- **Language Switcher**: dropdown PT/EN/ES no header
- **Cookie** `NEXT_LOCALE`: persiste preferência (Secure + SameSite)
- **Content-Language**: header dinâmico por locale no middleware
- **Glossário editorial**: 30+ termos padronizados (`lib/i18n/glossary.ts`)

---

## Arquitetura

### Pipeline de Dados (Cron + Upstash Redis)

```
Background:  Cron (60s) → Polymarket (18 mercados paralelo) → Upstash Redis
Usuário:     Requisição → Redis read (<1ms) → resposta
             10M usuários = mesma carga que 10 usuários
```

**Cascata de fallback (4 níveis):**

| Nível | Condição | Resposta |
|-------|----------|----------|
| 1 | Redis com dados frescos | <1ms (99.9% dos casos) |
| 2 | Redis vazio | Fetch direto Polymarket (~4s) |
| 3 | Polymarket falhou | Dados em memória (último resultado bom) |
| 4 | Sem nenhum dado | HTTP 503 + Retry-After: 60 |

### Estrutura do Projeto

```
app/
├── [locale]/
│   ├── layout.tsx                     # Layout por locale (metadata + i18n provider)
│   ├── page.tsx                       # Dashboard traduzido
│   └── global/page.tsx                # Mapa global traduzido
├── i18n/context.tsx                   # I18nProvider + useTranslation() hook
├── types/
│   ├── index.ts                       # 19 interfaces TypeScript
│   └── global-map.ts                  # Tipos do mapa global + ISO3
├── hooks/useDashboardData.ts          # Custom hooks de data fetching (timeout 15s)
├── lib/
│   ├── utils.ts                       # Funções utilitárias
│   ├── kv.ts                          # Wrapper Upstash Redis + health check
│   ├── map-colors.ts                  # Tokens visuais do mapa global
│   ├── mock-elections.ts              # Mock data (fallback build-time)
│   ├── cache/headers.ts               # Cache multi-camada
│   ├── polymarket/
│   │   ├── client.ts                  # API client (retry, timeout, circuit breaker)
│   │   ├── country-market-map.ts      # Registry slug → ISO3 (14 países, 18 mercados)
│   │   ├── bootstrap.ts              # Aggregador: fetch → parse → normalize
│   │   ├── normalize.ts              # Payload optimization (compartilhado)
│   │   └── persist.ts                # Ingestão Neon: cron inteligente + dedup 2 camadas
│   └── email/
│       ├── subscribers.ts             # CRUD leads (Prisma/Neon + consentimento LGPD)
│       ├── resend.ts                  # Resend service (welcome, alertas)
│       └── templates.ts              # 4 templates HTML (esc() anti-XSS)
├── components/
│   ├── ui.tsx                         # Card, HBar, Stars, SectionTitle (ARIA)
│   ├── Header.tsx                     # Header + Language Switcher (i18n)
│   ├── Footer.tsx                     # Footer traduzido + voltar ao topo
│   ├── EmailPopup.tsx                 # Popup email traduzido (LGPD)
│   ├── layout/language-switcher.tsx   # Seletor PT/EN/ES (URL-based)
│   ├── ModalAbout.tsx / ModalMetas.tsx / ModalGlobal.tsx  # Modais traduzidos
│   ├── PolymarketSection.tsx / PollsSection.tsx / CandidatesSection.tsx
│   ├── NewsSection.tsx / SentimentSection.tsx
│   ├── InssSection.tsx / BancoMasterSection.tsx / StfSection.tsx
│   └── global-map/
│       ├── GlobalElectionMap.tsx       # D3 + TopoJSON + SVG (React.memo)
│       ├── GlobalMapTooltip.tsx / GlobalMapLegend.tsx / GlobalCountryDrawer.tsx
├── api/
│   ├── polymarket/                    # Odds presidenciais BR
│   ├── polls/ / news/                 # Pesquisas + notícias
│   ├── analysis-cards/ / analysis-criteriosa/  # Análises
│   ├── global-elections/ / global-map/         # Eleições globais
│   ├── cron/refresh-elections/        # Cron 60s → Redis + Neon persist
│   ├── health/                        # Health check (app + redis + cron + neon + polymarket)
│   ├── subscribe/                     # Captura email (Zod + rate limit + honeypot + Neon)
│   ├── translations/                  # Pipeline tradução IA (Bearer auth + rate limit)
│   ├── market/history/                # Série temporal de odds por candidato
│   ├── user/preferences/              # Preferências do usuário (locale, timezone)
│   └── admin/
│       ├── data-request/              # LGPD: exclusão + exportação de dados (auth)
│       └── metrics/                   # Dashboard executivo (auth)
├── page.tsx                           # Redirect → /pt-BR
├── layout.tsx                         # Root layout (metadata, Schema.org, Analytics)
├── sitemap.ts                         # 6 entries (3 locales × 2 pages) + alternates
└── robots.ts                          # Dinâmico
lib/
├── db.ts                              # Prisma singleton (Neon pooled, null-safe)
├── audit.ts                           # Audit trail → governance.audit_logs (IP/UA hash)
├── consent.ts                         # Consentimento LGPD → iam.user_consents
├── validations/index.ts               # Zod schemas (email RFC 5321, subscribe, preferences)
├── governance/
│   └── data-lifecycle.ts              # LGPD: anonymize, export, deletion ($transaction)
├── i18n/
│   ├── config.ts                      # Locales, default, cookie, labels
│   ├── get-messages.ts                # Carrega namespaces por locale
│   └── glossary.ts                    # Referência editorial (30+ termos)
├── seo/
│   ├── metadata.ts                    # buildMetadata() com hreflang cruzado
│   └── schema.ts                      # 6 schemas JSON-LD
├── ai/
│   ├── prompts.ts                     # 4 prompts (system, UI, editorial, QA)
│   ├── translate.ts                   # Tradução IA (cache LRU + risk flags + LLM tracking)
│   ├── validate-translation.ts        # 7 checks determinísticos
│   └── guardrails.ts                  # Injection detection, risk scoring, canPublish
└── security/
    └── hardening.ts                   # sanitizeAIOutput, isAIOutputSafe, auditLog
prisma/
├── schema.prisma                      # 19 tabelas, 6 schemas (UUID, timestamptz)
└── migrations/                        # Versionadas, commitadas
docs/
├── DATABASE.md                        # Arquitetura de banco, convenções, comandos
├── LGPD.md                            # Matriz PII, retenção, runbooks, checklist
└── OPERATIONS.md                      # Deploy, rollback, observabilidade, escala, incidentes
scripts/
└── seed-dev.ts                        # Seed mínimo para desenvolvimento
```

---

## SEO Multilíngue + GEO

### Metadata por Locale

Cada página gera metadata nativa no idioma correto via `buildMetadata()`:
- Title, description, canonical, OG, Twitter Card
- Hreflang cruzado automático (pt-BR, en, es, x-default)
- Content-Language header dinâmico no middleware

### Schema.org (6 tipos)

| Schema | Onde | Propósito |
|--------|------|-----------|
| **Organization** | Root layout | Identidade da marca |
| **WebApplication** | Root layout | Produto como app web gratuito |
| **Dataset** | Root layout | Dados eleitorais como dataset |
| **WebSite** | `[locale]` layout | Site por idioma |
| **FAQPage** | `[locale]` layout | 5 perguntas nativas por idioma (GEO) |
| **BreadcrumbList** | `[locale]` layout | Navegação estruturada |

### GEO (Generative Engine Optimization)

5 FAQs nativas por idioma, otimizadas para LLMs e mecanismos generativos:
- O que é o AFOS Analytics?
- É gratuito?
- O que são mercados de previsão?
- Quais eleições monitora?
- Como os dados são atualizados?

---

## Mapa Global de Eleições

Disponível via botão **"Global"** e rota `/[locale]/global`.

- **D3.js + TopoJSON** — Natural Earth projection, SVG render
- **14 países monitorados** com dados ao vivo do Polymarket
- **Hover** — tooltip com candidato líder, probabilidade, volume
- **Click** — drawer lateral com breakdown de candidatos
- **Zoom/Pan** — d3-zoom (1x-8x)
- **React.memo** — evita re-renders
- **Textos traduzidos** nos 3 idiomas

---

## Pipeline de Tradução por IA

```
POST /api/translations (Bearer auth)
  → sanitize input (anti-prompt-injection)
    → cache SHA-256 (24h, LRU 500)
      → IA (Anthropic/OpenAI)
        → sanitizeAIOutput (strip scripts/JS)
          → isAIOutputSafe (bloqueia se inseguro)
            → validateTranslation (7 checks determinísticos)
              → aprovar ou fallback
```

- **Auth**: timing-safe (timingSafeEqual)
- **Providers**: Anthropic Claude Haiku ou OpenAI GPT-4o-mini
- **Validação**: placeholders, números, URLs, termos protegidos, HTML tags, comprimento, caracteres
- **Audit logging**: auth_failure, ai_output_blocked, validation_failure, translation_success

---

## Segurança

### OWASP Top 10 Web + API Security + LLM Guardrails

| Camada | Medidas |
|--------|---------|
| **Web** | CSP (sem unsafe-eval), HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| **API** | Rate limiting distribuído (Upstash REST), timeout 15s, slug validation, URL validation |
| **Auth** | timing-safe compare, Bearer token, x-vercel-cron |
| **Email** | esc() anti-XSS, honeypot anti-bot, rate limit 5/IP/hora |
| **IA** | sanitize() anti-prompt-injection, sanitizeAIOutput(), isAIOutputSafe(), audit logging |
| **i18n** | locale whitelist, normalizeLocale(), cookie Secure+SameSite |

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | App Router, RSC, TypeScript, Middleware |
| **Prisma 7** | ORM com multiSchema (6 schemas, 19 tabelas) |
| **Neon Postgres** | Banco principal (pooled runtime + unpooled migrations) |
| **D3.js + TopoJSON** | Mapa global SVG interativo |
| **Tailwind CSS** | Design system com cores centralizadas |
| **Zod** | Validação de inputs em API boundaries |
| **Vercel** | Hosting, Edge Runtime, Cron |
| **Upstash Redis** | Hot cache, rate limiting distribuído |
| **Resend** | Email transacional |
| **Polymarket API** | Mercados de previsão (18 mercados, 14 países) |
| **Google News RSS + Firecrawl** | Notícias ao vivo |
| **Vercel Analytics** | Métricas de tráfego |
| **Playwright** | Testes E2E |

---

## Banco de Dados (Neon Postgres)

6 schemas, 19 tabelas, UUID PKs, timestamptz:

| Schema | Tabelas | Propósito |
|--------|---------|-----------|
| **iam** | users, user_preferences, user_consents | Identidade, preferências, consentimento LGPD |
| **crm** | leads, contact_events | Captura de leads, event sourcing |
| **research** | sources, research_runs, findings, analysis_reports, cross_signal_links | Pesquisas, análises, cruzamentos |
| **market** | markets, market_events, market_outcomes, market_prices, forecast_snapshots | Ingestão Polymarket, série temporal |
| **governance** | audit_logs, deletion_requests | Auditoria, LGPD Art. 18 |
| **ai** | llm_runs, model_outputs | Tracking IA, classificação, guardrails |

Conexões: `DATABASE_URL` (pooled/pgbouncer) para runtime, `DATABASE_URL_UNPOOLED` para migrations.

---

## Ingestão Polymarket (Cron Inteligente)

```
Cron 60s → fetch 18 mercados → Redis KV (dashboard, <1ms)
                              ↘ Neon persist (histórico, async):
                                  hot (BRA primary): a cada 15 min
                                  warm (outros live): a cada 60 min
                                  cold (resolved): skip preços
                                  dedup: Redis timestamp + DB UNIQUE hash
```

Endpoint histórico: `GET /api/market/history?candidate=Lula&days=30`

---

## AI Guardrails

| Guardrail | Implementação |
|-----------|--------------|
| Prompt injection detection | 8 regex patterns (`lib/ai/guardrails.ts`) |
| Risk scoring | Hallucination ratio, PII detection (CPF) |
| Output classification | factual / inferred / opinative / experimental |
| Publication gate | `canPublish()` — experimental requer aprovação humana |
| Output sanitization | iframe, svg, script, object, embed, HTML entities |
| Hash chain | inputHash → outputHash → contentHash (integridade) |
| LLM tracking | `ai.llm_runs` + `ai.model_outputs` por chamada |

---

## LGPD Compliance

| Capacidade | Implementação |
|-----------|--------------|
| Consentimento | `iam.user_consents` com versão de política + timestamp |
| Exclusão (Art. 18) | `POST /api/admin/data-request` type=deletion → `$transaction` atômica |
| Exportação (Art. 18 II) | `POST /api/admin/data-request` type=export → JSON completo |
| Anonimização | `email → deleted-{hash}@anon.local`, `name → null` |
| Dissociação analítica | market/research intocados por exclusão de PII |
| Audit trail | `governance.audit_logs` com IP/UA hasheados (SHA256) |
| Anti-enumeration | Admin endpoint sempre retorna 200 |

Documentação completa: [docs/LGPD.md](docs/LGPD.md)

---

## APIs (16 endpoints)

| Endpoint | Descrição | Segurança |
|---|---|---|
| `/api/global-map` | Eleições globais | Redis → Polymarket, 4 fallbacks |
| `/api/cron/refresh-elections` | Refresh background + Neon persist | x-vercel-cron + CRON_SECRET |
| `/api/translations` | Pipeline tradução IA | Bearer auth, timing-safe, rate limit 60/min |
| `/api/health` | Status (app + redis + cron + neon + polymarket) | revalidate=0 |
| `/api/subscribe` | Captura email → Neon + consentimento | Zod, rate limit 5/IP/h, honeypot |
| `/api/polymarket` | Odds BR | Slug validation, timeout |
| `/api/polls` | Pesquisas +17 institutos | File read |
| `/api/news` | Notícias | URL validation, timeout |
| `/api/analysis-cards` | Análises editoriais | File read |
| `/api/analysis-criteriosa` | Top 4 candidatos | File read |
| `/api/global-elections` | Eleições globais (legado) | Safe JSON parse |
| `/api/market/history` | Série temporal de odds | take 1000, cache 5min |
| `/api/user/preferences` | Preferências (locale, timezone) | Zod, rate limit 10/min, audit |
| `/api/admin/data-request` | LGPD: exclusão + exportação | Bearer CRON_SECRET, timing-safe |
| `/api/admin/metrics` | Dashboard executivo | Bearer CRON_SECRET, timing-safe |

---

## O que significa AFOS?

| Letra | Significado | Descrição |
|---|---|---|
| **A** | Astuteness | Inteligência para cruzar dados e gerar clareza |
| **F** | Faith | Confiança em informações verdadeiras e imparciais |
| **O** | Optimism | Visão de futuro baseada em inovação e transparência |
| **S** | Synthesis | Transformar dados complexos em entendimento simples |

---

## Configuração

```bash
# Clone
git clone https://github.com/andrefelipe-afos/afos-analitica-2026.git
cd afos-analitica-2026

# Instalar (postinstall roda prisma generate automaticamente)
npm install

# Configurar
cp .env.example .env.local
# Preencher:
#   DATABASE_URL (Neon pooled)
#   DATABASE_URL_UNPOOLED (Neon direct)
#   UPSTASH_REDIS_REST_URL + TOKEN
#   RESEND_API_KEY
#   CRON_SECRET (min 32 chars)
# Opcional: TRANSLATION_API_KEY, TRANSLATION_PROVIDER, TRANSLATION_AUTH_TOKEN

# Migrations
npx prisma migrate dev

# Seed (dados de teste)
npx tsx scripts/seed-dev.ts

# Desenvolvimento
npm run dev

# Testes
npx playwright test

# Build
npm run build

# Produção (Vercel)
# 1. Push para GitHub
# 2. Conectar repo no Vercel Dashboard
# 3. Storage → Neon → Connect (DATABASE_URL injetado)
# 4. Marketplace → Upstash Redis → Install → Connect
# 5. Environment Variables → CRON_SECRET, RESEND_API_KEY, TRANSLATION_*
# 6. Deploy automático + cron ativo a cada 60s
```

---

## Documentação Operacional

| Documento | Conteúdo |
|-----------|---------|
| [docs/DATABASE.md](docs/DATABASE.md) | Schemas, tabelas, convenções, comandos Prisma |
| [docs/LGPD.md](docs/LGPD.md) | Matriz PII, retenção, runbooks exclusão/exportação, checklist |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Ambientes, deploy, rollback, observabilidade, custo, escala, incidentes |

---

## Claude Code

Este projeto inclui uma skill customizada para o [Claude Code](https://claude.ai/claude-code) CLI:

| Comando | Descrição |
|---------|-----------|
| `/atualizar` | Atualização completa do AFOS Analytics |

---

## Licença

Projeto open source. Qualquer pessoa pode estudar, auditar e contribuir.

---

## Versões anteriores

- [README-v1.md](README-v1.md) — Versão original (pré-refatoração)

---

*AFOS Analytics — Plataforma Global de Inteligência Eleitoral*
