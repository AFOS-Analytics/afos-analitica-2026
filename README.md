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
│   │   └── normalize.ts              # Payload optimization (compartilhado)
│   └── email/
│       ├── subscribers.ts             # CRUD subscribers (Redis Set + Hash)
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
│   ├── cron/refresh-elections/        # Cron 60s → Redis
│   ├── health/                        # Health check
│   ├── subscribe/                     # Captura email (rate limit, honeypot)
│   └── translations/                  # Pipeline tradução IA (Bearer auth)
├── page.tsx                           # Redirect → /pt-BR
├── layout.tsx                         # Root layout (metadata, Schema.org, Analytics)
├── sitemap.ts                         # 6 entries (3 locales × 2 pages) + alternates
└── robots.ts                          # Dinâmico
lib/
├── i18n/
│   ├── config.ts                      # Locales, default, cookie, labels
│   ├── get-messages.ts                # Carrega namespaces por locale
│   └── glossary.ts                    # Referência editorial (30+ termos)
├── seo/
│   ├── metadata.ts                    # buildMetadata() com hreflang cruzado
│   └── schema.ts                      # 6 schemas JSON-LD
├── ai/
│   ├── prompts.ts                     # 4 prompts (system, UI, editorial, QA)
│   ├── translate.ts                   # Tradução IA (SHA-256 cache, LRU 500)
│   └── validate-translation.ts       # 7 checks determinísticos
└── security/
    └── hardening.ts                   # sanitizeAIOutput, isAIOutputSafe, auditLog
messages/
├── pt-BR/ (common, home, about, seo)
├── en/    (common, home, about, seo)
└── es/    (common, home, about, seo)
middleware.ts                          # Rate limiting Redis + locale routing
vercel.json                            # Cron schedule
tests/i18n.spec.ts                     # 9 testes E2E Playwright
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
| **D3.js + TopoJSON** | Mapa global SVG interativo |
| **Tailwind CSS** | Design system com cores centralizadas |
| **Vercel** | Hosting, Edge Runtime, Cron |
| **Upstash Redis** | KV, subscribers, rate limiting distribuído |
| **Resend** | Email transacional |
| **Polymarket API** | Mercados de previsão (18 mercados, 14 países) |
| **Google News RSS + Firecrawl** | Notícias ao vivo |
| **Vercel Analytics** | Métricas de tráfego |
| **Playwright** | Testes E2E |

---

## APIs (12 endpoints)

| Endpoint | Descrição | Segurança |
|---|---|---|
| `/api/global-map` | Eleições globais | Redis → Polymarket, 4 fallbacks |
| `/api/cron/refresh-elections` | Refresh background | x-vercel-cron + CRON_SECRET |
| `/api/translations` | Pipeline tradução IA | Bearer auth, timing-safe |
| `/api/health` | Status do sistema | revalidate=0 |
| `/api/subscribe` | Captura email | Rate limit 5/IP/h, honeypot |
| `/api/polymarket` | Odds BR | Slug validation, timeout |
| `/api/polls` | Pesquisas +17 institutos | File check |
| `/api/news` | Notícias | URL validation, timeout |
| `/api/analysis-cards` | Análises | File check |
| `/api/analysis-criteriosa` | Top 4 candidatos | File check |
| `/api/global-elections` | Eleições globais (legado) | Safe JSON parse |

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

# Instalar
npm install

# Configurar
cp .env.example .env.local
# Preencher: UPSTASH_REDIS, FIRECRAWL_API_KEY, RESEND_API_KEY, CRON_SECRET
# Opcional: TRANSLATION_API_KEY, TRANSLATION_PROVIDER, TRANSLATION_AUTH_TOKEN

# Desenvolvimento
npm run dev

# Testes
npx playwright test

# Build
npm run build

# Produção (Vercel)
# 1. Push para GitHub
# 2. Conectar repo no Vercel Dashboard
# 3. Marketplace → Upstash Redis → Install → Connect
# 4. Environment Variables → RESEND_API_KEY + TRANSLATION_*
# 5. Deploy automático + cron ativo a cada 60s
```

---

## Licença

Projeto open source. Qualquer pessoa pode estudar, auditar e contribuir.

---

## Versões anteriores

- [README-v1.md](README-v1.md) — Versão original (pré-refatoração)

---

*AFOS Analytics — Plataforma Global de Inteligência Eleitoral*
