# AFOS Analytics

![AFOS Analytics](public/social-preview.jpg)

🇧🇷 [Leia em Português](README.pt-BR.md) | 🇺🇸 English

### Global platform — unprecedented — real-time cross-referencing of prediction markets, electoral polls and news.

Built and validated during the 2026 electoral cycle across South American countries + 15 countries. Daily analyses.

**Aggregating over 400 sources** (5 major global prediction markets + 100+ polling institutes + 300+ media outlets and social networks, 20+ languages) across **14+ countries.**

[![GitHub Stars](https://img.shields.io/github/stars/AFOS-Analytics/afos-analitica-2026?style=flat&logo=github&label=Stars&color=0F52BA)](https://github.com/AFOS-Analytics/afos-analitica-2026/stargazers)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Harvard Dataverse](https://img.shields.io/badge/Harvard%20Dataverse-DOI%2010.7910%2FDVN%2F2D0UK7-0F52BA)](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7)
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
- **AFOS Daily** — narrative daily synthesis cross-referencing the three sources, with auditable links per claim. Validated through a 7-day pilot (April 22-28/2026), now permanent — **40 editions published as of 31/May/2026** (D+17 of public launch), in 3 languages (PT-BR, EN, ES) with full archive at `/daily/[date]`. Distribution by email to opted-in subscribers via Resend Pro
- **AFOS Tradeoff** — weekly technical reading published every Monday, targeted at institutional research, buy-side and treasury. Cross-references the same three signals but reports them **separately** (no weighted-average composites) — when prediction markets, polls and news diverge, the divergence *is* the signal. Structured in 9 sections (executive summary cards, anti-average rationale, weighted scenarios, indicator grid, liquidity & market structure, polls calendar, watch list, methodology, additional reading). Published in 3 languages (PT-BR, EN, ES) with full archive at `/tradeoff/[date]`. RSS: `/feed/tradeoff.xml`

Coverage of **14+ countries** with monitored elections, in **3 languages** (PT-BR, EN, ES).

**Open Source. Free. Mobile and desktop.**

### Platform demo (~90 seconds)

[![AFOS Analytics — platform demo (click to play)](public/screenshots/landing.png)](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-en.mp4)

> **Click the image above to play** (~9 MB, audio in PT-BR with English subtitles burned-in). Covers: real-time cross-referencing, prediction markets, electoral polls, news aggregation, and the **AFOS Daily** narrative synthesis. Alternative tracks: [`public/demo.mp4`](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo.mp4) (no subtitles) and [`public/demo-audio.m4a`](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-audio.m4a) (audio only).

---

## Community

- 💬 **Questions & ideas** → [GitHub Issues](https://github.com/AFOS-Analytics/afos-analitica-2026/issues) · [Discussions](https://github.com/AFOS-Analytics/afos-analitica-2026/discussions)
- 🏢 **GitHub Organization** → [github.com/AFOS-Analytics](https://github.com/AFOS-Analytics)
- 🐦 **Twitter / X** → [@AFOS_Analytics](https://x.com/AFOS_Analytics)
- 🦋 **Bluesky** → [@afos-analytics.com](https://bsky.app/profile/afos-analytics.com)
- 🚀 **Product Hunt** → [@afosanalytics](https://www.producthunt.com/@afosanalytics)
- 📧 **Press, partnerships, general** → [contact@afos-analytics.com](mailto:contact@afos-analytics.com)
- 💡 **User support & help** → [support@afos-analytics.com](mailto:support@afos-analytics.com)
- 🔒 **Security vulnerability disclosure** → [security@afos-analytics.com](mailto:security@afos-analytics.com) (see [SECURITY.md](SECURITY.md))
- 👤 **Founder direct** → [founder@afos-analytics.com](mailto:founder@afos-analytics.com)

Open source. **Code** is licensed under **Apache 2.0**; **data** (e.g. the public divergence dataset mirrored daily to [Hugging Face](https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence)) is licensed under **CC BY 4.0** — both require attribution to AFOS Analytics. Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Trademark use of the "AFOS Analytics" name and logo is governed by [TRADEMARK.md](TRADEMARK.md). Hosted-platform contributions (onboarding a new country) are documented at [docs/platform/add-your-country.md](docs/platform/add-your-country.md) and the public governance model is explained at `/methodology/automated-governance`.

---

## Architecture

### Main Routes

| Route | Content |
|-------|---------|
| `/[locale]` | Landing page (color + language selector) |
| `/[locale]/dashboard` | Interactive dashboard with live data — header logo links back to landing |
| `/[locale]/daily` | AFOS Daily — daily narrative synthesis cross-referencing prediction markets, polls and news. Available in **3 languages** (PT-BR, EN, ES) — loader detects `{date}.{locale}.md` with fallback to canonical PT-BR. Brazilian political terms (TSE, STF, BolsoMaster, etc.) kept in PT with inline links to the trilingual glossary. **Index route = editions archive** (month-grouped list of every published edition, latest highlighted, jump-to-date + in-page language & theme selectors); individual editions live at `/[locale]/daily/[date]` with prev / next + "All editions" navigation |
| `/[locale]/tradeoff` | AFOS Tradeoff — weekly technical reading (Mondays) targeted at institutional research / buy-side / treasury. Three signals reported separately — divergence *is* the signal, not noise to average away. 9 structured sections rendered via rich-frontmatter YAML (summary cards, anti-average rationale, weighted scenarios, indicator grid, liquidity & market structure, polls calendar, watch list, methodology, additional reading). Tri-locale parity with Daily (`{date}.{locale}.md`). **Index route = editions archive** (list by issue number & week, latest highlighted, in-page language & theme selectors); editions live at `/[locale]/tradeoff/[date]` with prev / next + "All editions" navigation. RSS: `/feed/tradeoff.xml` |
| `/[locale]/global` | Global elections map (D3.js) |
| `/[locale]/country/[country]` | Country page (15 countries) |
| `/[locale]/how-it-works` | Didactic methodology guide (3 languages) — "The Method". In-page language selector (PT-BR/EN/ES). 14-section platform tour including the AFOS Daily card (`#afos-daily-card`), the **AFOS Tradeoff** weekly-brief section (`#afos-tradeoff-card`), the **AFOS Global** section (`#afos-global-card`) documenting the validated-cases layer (the probability-of-winning vs vote-share concept, the country & election divergence pages, and the open datasets), and polling institute evaluation criteria (`#criterios-institutos`); the "Start here" onboarding orients readers to both the Daily and the Tradeoff. Uses shared Tailwind constants (`styles.ts`) for cross-language visual consistency |
| `/[locale]/methodology/automated-governance` | Public governance page (3 languages) — how the hosted platform enforces editorial integrity via code (automated validators + versioned prompt rules), the 2 interaction paths (Fork / Country Onboarding), and the 3 human-intervention exceptions |
| `/[locale]/latam` · `/[locale]/eu` | Regional hubs (Latin America, Europe), 3 languages. AFOS wordmark + "Dashboard" button header. **Monitored countries** as clickable cards (SVG flag + name + region + next election + "View country →" CTA → `/country/[country]`) and **related elections** as rows (SVG flag + localized colored status badge — Active / Completed / Upcoming — + "View election →" → `/election/[slug]`), plus an institutional-intelligence button grid. Shared `RegionPage` component; flags via `ISO3_TO_CC` → `/flags/{cc}.svg` (no emoji, Windows-safe) |

### Landing Page

- Theme selector (white/primary blue) with animated transition
- Language selector (PT-BR/EN/ES) with mini dropdown menu
- SVG flags (compatible with all devices including Windows)
- Lead capture form integrated with visitor tracking system
- SEO optimized with "Unprecedented platform worldwide" claim in metadata
- **Reading flow (revised 29/May/2026):** Hero → ProductsSection (3 cards: Daily / Tradeoff / Global) → Stats → Email signup ("Or receive weekly analysis...") → Features → Countries → Final CTA "Open Dashboard". Lead capture moved up the page to convert before users scroll past Features; redundant intermediate dashboard CTA removed (only nav-button and final-CTA dashboard buttons remain). Daily / Tradeoff / Global links always use the index route (`/{locale}/daily`, `/{locale}/tradeoff`) — never hardcoded dates. As of June 2026 these index routes **are the editions archive** (a browsable, month-grouped list of all editions with in-page language & theme selectors), not a redirect to the latest edition; the most recent edition is highlighted at the top so it stays one click away.
- **Inverted-color design rule:** components that need to stand out from the page background invert across themes — light theme = Sapphire Blue components (cards, CTA, subtitle box) with white text; Sapphire Blue theme = white components with primary-color text. Applied consistently in ProductsSection, dashboard CTA, and hero subtitle box.

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

### URL-Primary Architecture (AFOS Daily editorial integrity)

Each claim in AFOS Daily must link to the **specific article** that supports it — not the outlet's homepage. Enforced by 5 cooperating layers:

| Layer | Component | Function |
|-------|-----------|----------|
| 1 | `scripts/fetch-google-news.mjs` | Collects Google News RSS preserving primary `<link>` URLs (redirect to article works even for anti-bot outlets). Parallel fetch via `Promise.all`, retry with backoff, fail-fast on partial errors |
| 2 | Hybrid flow in `/afos-daily` skill | WebSearch with `allowed_domains` for 3-5 anchor stories (clean primary URLs); Google News redirect from cache for the rest |
| 3 | `scripts/wayback-archive.ts` | Snapshots cited URLs to archive.org before publish (evidence preservation) |
| 4 | `scripts/precommit-afos-daily-urls.py` (PreToolUse hook) + `lib/afos-daily/validator.ts` | Blocks `Write/Edit/MultiEdit` on `public/afos-daily/*.md` if forbidden URLs detected (`gamma-api.polymarket.com`, markdown links in plain-text "Sources cited" footer). Warns on >30% homepage ratio or <80% link-density per substantial paragraph |
| 5 | `.claude/commands/afos-daily.md` (skill rules) | Documents the URL hierarchy, validation gates, and the editorial principles enforced in code |

**Manual validator:** `npx tsx scripts/validate-afos-daily.ts {date} [--locale=en\|es]` exits 1 on critical errors (matches the PreToolUse hook). Used in CI checks and in operator workflow before commit.

**Editorial source ratio (50/50 rule, firmed May 9, 2026):** each AFOS Daily uses a **minimum 50% anchor outlets via direct RSS** (Folha de S.Paulo, O Globo, G1, Estadão, Valor, VEJA — institutional credibility) **+ minimum 50% secondary outlets via Google News redirect** (Poder360, BBC, Canal MyNews, CartaCapital, InfoMoney, CBN, Gazeta do Povo, Exame, etc. — open access, reproduce anchor coverage without paywall). Refinement of the prior 30/70 rule motivated by the observation that anchor outlets often paywall content for non-subscribers (especially international readers); secondary outlets replicate the same coverage with open access. Applies uniformly to PT-BR / EN / ES. Translations preserve URLs as collected in the source language.

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
| Country (15 × 3) | 45 | 0.8 |
| Election (15 × 3) | 45 | 0.7-0.9 |
| Institutional (7 × 3) | 21 | 0.8 |
| Region (2 × 3) | 6 | 0.85 |
| How It Works (1 × 3) | 3 | 0.85 |

---

## Global Elections Map

- **D3.js + TopoJSON** — Natural Earth projection, SVG render
- **15 countries** with live Polymarket data
- **SVG flags** — visible on all devices (Windows, Mac, mobile)
- **Volume with label**: "Vol: $53.4M (sum of 6 markets)" when multiple markets
- **Hover** — tooltip with leading candidate, probability, volume
- **Click** — side drawer with candidate breakdown
- **Zoom/Pan** — d3-zoom (1x-8x)

---

## Open Datasets (Hugging Face)

Public, auditable **electoral-divergence** datasets — *prediction markets × polls, with explicit divergence* (the spread is the signal, not a blended average). All **CC BY 4.0**, trilingual cards with a branded flag banner, built from public sources only (no personal data).

| Dataset | Election | What the divergence shows |
|---|---|---|
| [brazil-2026](https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence) | Brazil 2026 (live) | Daily market × poll divergence + full TSE registry (350 polls × 20 public fields) |
| [peru-2026](https://huggingface.co/datasets/AFOS-Analytics1/peru-2026-electoral-divergence) | Peru 2026 ✓ | The market's sustained favorite (López Aliaga) missed the runoff; the Jun 7 Fujimori × Sánchez runoff is a near-tie (~50.1% × 49.9%), winner not yet proclaimed |
| [colombia-2026](https://huggingface.co/datasets/AFOS-Analytics1/colombia-2026-electoral-divergence) | Colombia 2026 (1st round) | The market matched de la Espriella's first-round win |
| [chile-2025](https://huggingface.co/datasets/AFOS-Analytics1/chile-2025-electoral-divergence) | Chile 2025 ✓ | Market priced Kast ~66% to win while polls led with Jara, and Kast won |
| [germany-2025](https://huggingface.co/datasets/AFOS-Analytics1/germany-2025-electoral-divergence) | Germany 2025 ✓ | AfD 2nd in votes (~21%) but ~3% to win the most seats |
| [canada-2025](https://huggingface.co/datasets/AFOS-Analytics1/canada-2025-electoral-divergence) | Canada 2025 ✓ | Market swung 85% Conservative → 80% Liberal; the Liberals won |
| [uk-2024](https://huggingface.co/datasets/AFOS-Analytics1/uk-2024-electoral-divergence) | United Kingdom 2024 ✓ | Labour won 411 of 650 seats on 33.7% of the vote; the market read a landslide the polls measured only as ~40% vote share |
| [mexico-2024](https://huggingface.co/datasets/AFOS-Analytics1/mexico-2024-electoral-divergence) | Mexico 2024 ✓ | Market gave Sheinbaum ~90% to win from January; she won with ~59.8%, above the final polls |

The **Brazil 2026** dataset additionally has a curated, citable academic release on **[Harvard Dataverse](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7)** — DOI [10.7910/DVN/2D0UK7](https://doi.org/10.7910/DVN/2D0UK7), a versioned and permanent snapshot of the live Hugging Face mirror, deposited in the largest social-science data repository. To our knowledge it is the first dataset on Harvard Dataverse to cross-reference prediction markets × registered polls × press coverage to measure explicit divergence in a Brazilian election.

The completed cases (✓) are the method **validated against the real result**, surfaced as **"Validated cases"** on the [`/global`](https://www.afos-analytics.com/en/global) hub. Each carries the full poll history, daily Polymarket odds, the market×poll divergence time-series, **two odds charts** (probability trajectory + eve-of-vote market×poll snapshot, with total bet volume), a `DATA_DICTIONARY.md` and a `CITATION.cff`. Outside Brazil the depth is topline-only (no equivalent to Brazil's TSE open-data registry).

On-platform, every completed election's `/country/[country]` and `/election/[slug]` pages render its **election-day Polymarket snapshot** (candidates, bars, accumulated volume), the **market×poll divergence** table, and a **native odds-trajectory chart** (Polymarket implied probability over the campaign for the top contenders, with total bet volume), all theme-aware (light / Sapphire), with the AFOS brand and country flag.

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
  → Parse CSV (350 presidential polls, ALL public fields:
     methodology + sampling/weighting plan + statistician/CONRE, un-truncated)
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
| **Polymarket API** | Prediction markets (18 markets, 15 countries) |
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
| **F** | Fairness | Verifiable impartiality in the treatment of every source |
| **O** | Objectivity | Analytical neutrality — we observe the data, we don't take sides |
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
| `/tradeoff` | Generate the weekly technical reading (AFOS Tradeoff) — 9 structured sections, reports the three signals separately, weighted-scenario analysis for institutional readers |

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

## Official domain

The canonical domain is **[afos-analytics.com](https://www.afos-analytics.com)**. Any other `afos-analytics.*` TLD or variation of the name is **not** officially operated by AFOS Analytics unless explicitly confirmed via [contact@afos-analytics.com](mailto:contact@afos-analytics.com).

---

*AFOS Analytics — Unprecedented platform worldwide: Real-time Political Electoral Risk Intelligence.*
