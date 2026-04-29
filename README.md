# AFOS Analytics

![AFOS Analytics](public/social-preview.jpg)

🇧🇷 [Leia em Português](README.pt-BR.md) | 🇺🇸 English

### Global platform — unprecedented — real-time cross-referencing of prediction markets, electoral polls and news.

Built and battle-tested during the 2026 election cycle in South American countries. Daily analysis.

**Aggregating over 400 sources** (5 major global prediction markets + 100+ polling institutes + 300+ media outlets and social networks, 20+ languages) across **14+ countries.**

![GitHub Stars](https://img.shields.io/github/stars/AFOS-Analytics/afos-analitica-2026?style=social)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Contact](https://img.shields.io/badge/contact-afos--analytics.com-0F52BA?logo=maildotru&logoColor=white)](mailto:contact@afos-analytics.com)
[![Security](https://img.shields.io/badge/security-disclosure-d32f2f?logo=keycdn&logoColor=white)](mailto:security@afos-analytics.com)

**[afos-analytics.com](https://afos-analytics.com)**

> *Democracy runs on information. Information runs on transparency. AFOS Analytics is programmable transparency worldwide.*

> Scalable pipeline with cron, Redis, and Neon. Add sources per country as elections approach.

---

## About

**AFOS Analytics** is the world's first political electoral risk intelligence platform that cross-references in real time:

- **Prediction markets** with real money (Polymarket) — odds updated every 30 minutes
- **Electoral polls** from official sources (TSE) + 17 Brazilian institutes
- **Live news** from major media outlets
- **Strategic analyses** powered by artificial intelligence
- **AFOS Daily** — narrative daily synthesis cross-referencing the three sources, with auditable links per claim (validated through a 7-day pilot in April/2026, now permanent)

Coverage of **14+ countries** with monitored elections, in **3 languages** (PT-BR, EN, ES).

**Open Source. Free. Mobile and desktop.**

### 60-second platform demo

[![AFOS Analytics — 60-second demo (click to play)](public/screenshots/landing.png)](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-en.mp4)

> **Click the image above to play** (~8.5 MB, audio in PT-BR with English subtitles burned-in). Alternative tracks: [`public/demo.mp4`](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo.mp4) (no subtitles) and [`public/demo-audio.m4a`](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-audio.m4a) (audio only).

---

## Community

- 💬 **Questions & ideas** → [GitHub Issues](https://github.com/AFOS-Analytics/afos-analitica-2026/issues) · [Discussions](https://github.com/AFOS-Analytics/afos-analitica-2026/discussions)
- 📧 **Press, partnerships, general** → [contact@afos-analytics.com](mailto:contact@afos-analytics.com)
- 💡 **User support & help** → [support@afos-analytics.com](mailto:support@afos-analytics.com)
- 🔒 **Security vulnerability disclosure** → [security@afos-analytics.com](mailto:security@afos-analytics.com) (see [SECURITY.md](SECURITY.md))
- 👤 **Founder direct** → [founder@afos-analytics.com](mailto:founder@afos-analytics.com)

Open source, Apache 2.0. Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Trademark use of the "AFOS Analytics" name and logo is governed by [TRADEMARK.md](TRADEMARK.md). Hosted-platform contributions (onboarding a new country) are documented at [docs/platform/add-your-country.md](docs/platform/add-your-country.md) and the public governance model is explained at `/methodology/automated-governance`.

---

## Architecture

### Main Routes

| Route | Content |
|-------|---------|
| `/[locale]` | Landing page (color + language selector) |
| `/[locale]/dashboard` | Interactive dashboard with live data — header logo links back to landing |
| `/[locale]/daily` | AFOS Daily — daily narrative synthesis cross-referencing prediction markets, polls and news |
| `/[locale]/global` | Global elections map (D3.js) |
| `/[locale]/country/[country]` | Country page (13 countries) |
| `/[locale]/how-it-works` | Didactic methodology guide (3 languages) — "The Method". Includes subsection on polling institute evaluation criteria (`#criterios-institutos`). Uses shared Tailwind constants (`styles.ts`) for cross-language visual consistency |
| `/[locale]/methodology/automated-governance` | Public governance page (3 languages) — how the hosted platform enforces editorial integrity via code (automated validators + versioned prompt rules), the 2 interaction paths (Fork / Country Onboarding), and the 3 human-intervention exceptions |
| `/[locale]/latam` · `/[locale]/eu` | Regional hubs (Latin America, Europe) |

### Landing Page

- Theme selector (white/primary blue) with animated transition
- Language selector (PT-BR/EN/ES) with mini dropdown menu
- SVG flags (compatible with all devices including Windows)
- Lead capture form integrated with visitor tracking system
- SEO optimized with "Unprecedented platform worldwide" claim in metadata

### Lead Capture System (Visitor State)

```
Session 1-3: Free dashboard + soft popup (30s + scroll, max 3 dismissals)
Session 4+:  Mandatory gate (blur + premium form)
After signup: Unlimited access, no popup/gate
```

| Component | Function |
|-----------|----------|
| `visitor_states` (Neon) | Tracks anonymous visitors by visitor_id |
| `POST /api/visitor/state` | Creates/returns visitor state |
| `POST /api/visitor/session` | Records qualified session (30s + scroll) |
| `POST /api/visitor/dismiss` | Records popup dismissal (max 3) |
| `POST /api/visitor/migrate` | Migrates legacy subscribers (localStorage → backend) |
| `useVisitorState` hook | Central client state (cookie + backend) |
| `VisitorStateProvider` | React Context for dashboard |
| `SubscribeForm` | Shared form (popup + gate + landing) |
| `DashboardGate` | Blur overlay on 4th session |
| `EmailPopup` | Soft popup on first 3 sessions |

**Security:** Backend is source of truth (not localStorage). 3s timeout with fallback. Atomic dedup via Redis SET NX. Honeypot anti-bot. Rate limiting.

### Data Pipeline (Cron + Upstash Redis + Neon)

```
Background:  Cron 30min  → Polymarket (18 markets in parallel) → Upstash Redis + Neon
User:        Request     → Redis read (<1ms) → response
```

**Single-cron architecture (cost + load optimized):** a unified 30-minute cron writes both to Redis (hot path for users) and to Neon (historical snapshot). Decision documented in April/2026 after analyzing risk/cost tradeoffs: 5-minute cadence created excess pressure on Vercel and Upstash quotas under traffic spikes without meaningful UX gain (Polymarket movements rarely require sub-30-minute granularity for cross-referenced electoral analysis). The 30-minute cadence allows Neon to scale to zero between ticks, simplifies operation (one cron path), and preserves real-time differentiation through the cross-reference itself, not the polling frequency.

**4-level fallback cascade:**

| Level | Condition | Response |
|-------|-----------|----------|
| 1 | Redis with fresh data | <1ms (99.9% of cases) |
| 2 | Redis empty | Direct Polymarket fetch (~4s) |
| 3 | Polymarket failed | In-memory data (last good result) |
| 4 | No data at all | HTTP 503 + Retry-After: 60 |

### Project Structure

```
app/
├── [locale]/
│   ├── layout.tsx                     # Per-locale layout (metadata + i18n)
│   ├── page.tsx                       # Landing page (LandingPageDual)
│   ├── dashboard/
│   │   ├── layout.tsx                 # Dashboard SEO metadata
│   │   └── page.tsx                   # Dashboard + Gate + Popup
│   └── global/page.tsx                # Translated global map
├── components/
│   ├── LandingPageDual.tsx            # Landing with color/language selector
│   ├── DashboardGate.tsx              # Gate blur overlay
│   ├── EmailPopup.tsx                 # Soft popup
│   ├── SubscribeForm.tsx              # Shared form
│   ├── FlagImg.tsx                    # Cross-platform SVG flag
│   ├── Header.tsx / Footer.tsx        # Translated header and footer
│   ├── PolymarketSection.tsx          # Live odds
│   ├── PollsSection.tsx               # Electoral polls
│   ├── global-map/                    # D3 + TopoJSON + SVG
│   └── ...                            # Other dashboard sections
├── hooks/
│   ├── useDashboardData.ts            # Data fetching (5 APIs in parallel)
│   └── useVisitorState.tsx            # Visitor state (context)
├── api/
│   ├── visitor/state/session/dismiss/migrate/  # Visitor tracking
│   ├── subscribe/                     # Email capture
│   ├── cron/refresh-elections/        # Cron 30min → Redis + Neon (unified)
│   ├── cron/refresh-polls/            # Cron 3x/day → TSE
│   ├── admin/analytics/               # Detailed analytics (Neon)
│   ├── admin/search-console/          # Google Search Console API
│   ├── admin/metrics/                 # Executive dashboard
│   └── ...                            # Other endpoints
├── lib/
│   ├── polymarket/                    # Client, registry, bootstrap, persist
│   ├── email/                         # Subscribers, Resend, templates
│   ├── cache/                         # Multi-layer cache
│   └── kv.ts                          # Upstash Redis wrapper
lib/
├── db.ts                              # Prisma singleton (Neon)
├── visitor/constants.ts               # Centralized visitor system constants
├── visitor/id.ts                      # Visitor ID (cookie + localStorage)
├── seo/metadata.ts                    # buildMetadata() with claim + hreflang
├── seo/schema.ts                      # 6 JSON-LD schemas
├── validations/index.ts               # Zod schemas
├── audit.ts                           # Audit trail
├── consent.ts                         # LGPD consent
├── ai/                                # Guardrails, translate, prompts
├── i18n/                              # Config, messages, glossary
├── governance/                        # Data lifecycle, LGPD
└── security/                          # Output sanitization
prisma/
├── schema.prisma                      # 20 tables, 6 schemas
└── migrations/
public/
├── flags/                             # 16 SVG flags (cross-platform)
├── geo/world-110m.json                # TopoJSON for global map
└── ...
```

---

## Internationalization (i18n)

| Language | Route | Status |
|----------|-------|--------|
| Portuguese (BR) | `/pt-BR` | Default |
| English | `/en` | Complete |
| Spanish | `/es` | Complete |

- **244+ keys** × 3 languages = 732+ translated strings
- **Language Switcher**: dropdown on landing and dashboard
- **Cookie** `NEXT_LOCALE`: persists preference
- **Content-Language**: dynamic header per locale in middleware
- **Geo tags**: `geo.region` and `geo.placename` per locale (BR/Global/LATAM)

---

## SEO / GEO

### Per-Locale Metadata

Each page generates native metadata in the correct language via `buildMetadata()`:
- Title with "Unprecedented Platform Worldwide" claim
- Description with unique positioning
- Canonical + cross-linked hreflang (pt-BR, en, es, x-default)
- Open Graph + Twitter Card
- Geo tags per locale

### Google Search Console

Integrated via `POST /api/admin/search-console`:
- Impressions, clicks, CTR, average position
- Breakdown by page, query, country, device
- Special `seoGeo` section for country pages
- Auth: Bearer CRON_SECRET

### Schema.org (7 types)

Organization, WebApplication, Dataset, WebSite, FAQPage, BreadcrumbList, Article

### AI Search Optimization (GEO)

- **`public/llms.txt`** — Describes platform for AI crawlers (ChatGPT, Perplexity, Claude, Gemini) following emerging industry standard
- **13 AI crawlers explicitly allowed** in `app/robots.ts`: GPTBot, anthropic-ai, ClaudeBot, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, CCBot, Bytespider, Applebot-Extended, cohere-ai, Meta-ExternalAgent, FacebookBot
- **JSON-LD Article schema** on `/how-it-works` for citation attribution by generative engines
- **Transparent AI attribution** — analyses generated by AI from public, auditable data

### Indexable Pages (~120+ with hreflang)

| Type | Pages | Priority |
|------|-------|----------|
| Landing page | 3 | 1.0 |
| Dashboard | 3 | 0.95 |
| Global Map | 3 | 0.9 |
| Country (13 × 3) | 39 | 0.8 |
| Election (13 × 3) | 39 | 0.7-0.9 |
| Institutional (7 × 3) | 21 | 0.8 |
| Region (2 × 3) | 6 | 0.85 |
| How It Works (1 × 3) | 3 | 0.85 |

---

## Global Elections Map

- **D3.js + TopoJSON** — Natural Earth projection, SVG render
- **14 countries** with live Polymarket data
- **SVG flags** — visible on all devices (Windows, Mac, mobile)
- **Volume with label**: "Vol: $53.4M (sum of 6 markets)" when multiple markets
- **Hover** — tooltip with leading candidate, probability, volume
- **Click** — side drawer with candidate breakdown
- **Zoom/Pan** — d3-zoom (1x-8x)

---

## Analytics

### /api/admin/analytics
Detailed analytics from Neon: lead curves, pipeline health, engagement, audit logs, AI runs.

### /api/admin/search-console
Google Search Console data: impressions, clicks, CTR, average position, country page performance (SEO GEO).

### /api/admin/metrics
Executive dashboard: point-in-time counts of leads, prices, audit logs, LLM runs, deletion requests.

---

## TSE Ingestion (Electoral Polls)

```
Cron 3x/day (6am, 12pm, 6pm)
  → cdn.tse.jus.br/pesquisa_eleitoral_2026.zip
  → Parse CSV (180+ presidential polls)
  → Neon: research.sources + research_runs + research_findings
  → Cross-reference: recent polls (15 days) × Polymarket odds
```

---

## Database (Neon Postgres)

6 schemas, 20 tables, UUID PKs, timestamptz:

| Schema | Tables | Purpose |
|--------|--------|---------|
| **iam** | users, user_preferences, user_consents | Identity, LGPD |
| **crm** | leads, contact_events, visitor_states | Leads, visitor tracking |
| **research** | sources, runs, findings, reports, cross_signals | Polls, cross-references |
| **market** | events, markets, outcomes, prices, forecasts | Polymarket, time series |
| **governance** | audit_logs, deletion_requests | Audit, LGPD Art. 18 |
| **ai** | llm_runs, model_outputs | AI tracking, guardrails |

---

## Security

| Layer | Measures |
|-------|----------|
| **Web** | CSP (unsafe-eval only in dev), HSTS, X-Frame-Options, Referrer-Policy |
| **API** | Distributed rate limiting (Upstash), timeout, slug validation |
| **Auth** | timing-safe compare, Bearer token, x-vercel-cron |
| **Email** | Honeypot anti-bot, rate limit 5/IP/hour, Zod validation |
| **Visitor** | Backend source of truth, Redis SET NX dedup, 3s timeout |
| **AI** | Prompt injection detection, output sanitization, risk scoring |
| **LGPD** | Consent tracking, atomic deletion, anonymization, audit trail |

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| **Next.js 14** | App Router, RSC, TypeScript, Middleware |
| **Prisma 7** | ORM with multiSchema (6 schemas, 20 tables) |
| **Neon Postgres** | Main database (pooled + unpooled) |
| **D3.js + TopoJSON** | Interactive SVG global map |
| **Tailwind CSS** | Design system |
| **Zod** | Input validation |
| **Vercel** | Hosting, Edge Runtime, Cron |
| **Upstash Redis** | Hot cache, rate limiting, session dedup |
| **Resend** | Transactional email |
| **Polymarket API** | Prediction markets (18 markets, 14 countries) |
| **Google News RSS + Firecrawl** | Live news |
| **Vercel Analytics** | Traffic metrics |

---

## APIs (22+ endpoints)

| Endpoint | Description |
|----------|-------------|
| `/api/visitor/state` | Visitor state (get/create) |
| `/api/visitor/session` | Record qualified session |
| `/api/visitor/dismiss` | Record popup dismissal |
| `/api/visitor/migrate` | Migrate legacy subscribers |
| `/api/subscribe` | Email capture (visitorId + captureSource) |
| `/api/global-map` | Global elections (Redis → Polymarket) |
| `/api/cron/refresh-elections` | Cron 30min — Polymarket → Redis + Neon (unified, single fetch per tick) |
| `/api/cron/refresh-polls` | Cron 3x/day TSE |
| `/api/cron/persist-analysis` | Cron 1x/day — persists analysis JSONs and AFOS Daily markdown to Neon |
| `/api/polymarket` | BR odds |
| `/api/polls` / `/api/polls/tse` | Polls |
| `/api/news` | News |
| `/api/admin/analytics` | Detailed analytics |
| `/api/admin/search-console` | Google Search Console |
| `/api/admin/metrics` | Executive dashboard |
| `/api/admin/data-request` | LGPD deletion/export |
| `/api/health` | Health check |
| `/api/translations` | AI translation pipeline |
| `/api/market/history` | Odds time series |

---

## What does AFOS mean?

| Letter | Meaning | Description |
|--------|---------|-------------|
| **A** | Astuteness | Intelligence to cross-reference data and generate clarity |
| **F** | Faith | Trust in truthful and impartial information |
| **O** | Optimism | Future vision based on innovation and transparency |
| **S** | Synthesis | Transforming complex data into simple understanding |

---

## Setup

```bash
git clone https://github.com/AFOS-Analytics/afos-analitica-2026.git
cd afos-analitica-2026
npm install
cp .env.example .env.local
# Fill in env vars (see .env.example)
npx prisma migrate dev
npx tsx scripts/seed-dev.ts
npm run dev
```

---

## Documentation

| Document | Content |
|----------|---------|
| [docs/DATABASE.md](docs/DATABASE.md) | Schemas, tables, conventions |
| [docs/LGPD.md](docs/LGPD.md) | PII matrix, retention, runbooks |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Deploy, rollback, observability |
| [docs/platform/add-your-country.md](docs/platform/add-your-country.md) | Step-by-step guide to onboard a new country to the AFOS hosted platform (configuration, not daily content) |
| [TRADEMARK.md](TRADEMARK.md) | AFOS Analytics trademark policy (what forkers can/cannot do with the name and logo) |
| [docs/como-funciona-afos.html](docs/como-funciona-afos.html) | Didactic methodology guide (source) |
| [V1 README](docs/README-v1.md) | How it all started |

---

## Claude Code

| Command | Description |
|---------|-------------|
| `/atualizar` | Full AFOS Analytics update (Polymarket + Google News + JSONs + deploy) |
| `/atualizar-pesquisas` | TSE electoral polls ingestion |
| `/afos-daily` | Generate the daily narrative synthesis (AFOS Daily) — cross-references markets, polls and news with auditable links per claim |

---

## Contact

| Purpose | Email |
|---------|-------|
| General inquiries, press, partnerships | [contact@afos-analytics.com](mailto:contact@afos-analytics.com) |
| User support and help | [support@afos-analytics.com](mailto:support@afos-analytics.com) |
| Security vulnerability disclosure | [security@afos-analytics.com](mailto:security@afos-analytics.com) |
| Founder direct | [founder@afos-analytics.com](mailto:founder@afos-analytics.com) |

For bugs and feature requests, please use [GitHub Issues](https://github.com/AFOS-Analytics/afos-analitica-2026/issues).

---

*AFOS Analytics — Unprecedented platform worldwide: Real-time Political Electoral Risk Intelligence.*
