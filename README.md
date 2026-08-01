# AFOS Analytics

![AFOS Analytics](public/social-preview.jpg)

🇧🇷 [Leia em Português](README.pt-BR.md) | 🇺🇸 English

### Global platform, unprecedented, real-time cross-referencing of prediction markets, electoral polls and news.

Built and validated during the 2026 electoral cycle across South American countries + 15 countries. Daily analyses.

**Aggregating over 400 sources** (5 major global prediction markets + 100+ polling institutes + 300+ media outlets and social networks, 20+ languages) across **14+ countries.**

[![GitHub Stars](https://img.shields.io/github/stars/AFOS-Analytics/afos-analitica-2026?style=flat&logo=github&label=Stars&color=0F52BA)](https://github.com/AFOS-Analytics/afos-analitica-2026/stargazers)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Harvard Dataverse](https://img.shields.io/badge/Harvard%20Dataverse-AFOS%20Analytics%20collection-0F52BA)](https://dataverse.harvard.edu/dataverse/afos-analytics)
[![Contact](https://img.shields.io/badge/contact-afos--analytics.com-0F52BA?logo=maildotru&logoColor=white)](mailto:contact@afos-analytics.com)
[![Security](https://img.shields.io/badge/security-disclosure-d32f2f?logo=keycdn&logoColor=white)](mailto:security@afos-analytics.com)

**[afos-analytics.com](https://afos-analytics.com)**

> *Democracy runs on information. Information runs on transparency. AFOS Analytics is programmable transparency worldwide.*

> Scalable pipeline with cron, Redis, and Neon. Add sources per country as elections approach.

---

## About

**AFOS Analytics** is the world's first political electoral risk intelligence platform that cross-references in real time:

- **Prediction markets** with real money (Polymarket), odds updated every 30 minutes
- **Electoral polls** from official sources (TSE) + 17 Brazilian institutes
- **Live news** from major media outlets
- **Strategic analyses** powered by artificial intelligence
- **AFOS Daily**, narrative daily synthesis cross-referencing the three sources, with auditable links per claim. Validated through a 7-day pilot (April 22-28/2026), now permanent, **61 editions published as of 21/Jun/2026** (D+38 of public launch), in 3 languages (PT-BR, EN, ES) with full archive at `/daily/[date]`. Distribution by email to opted-in subscribers via Resend Pro
- **AFOS Tradeoff**, weekly technical reading published every Monday, targeted at institutional research, buy-side and treasury. Cross-references the same three signals but reports them **separately** (no weighted-average composites), when prediction markets, polls and news diverge, the divergence *is* the signal. Structured in 9 sections (executive summary cards, anti-average rationale, weighted scenarios, indicator grid, liquidity & market structure, polls calendar, watch list, methodology, additional reading). Published in 3 languages (PT-BR, EN, ES) with full archive at `/tradeoff/[date]`. RSS: `/feed/tradeoff.xml`
- **AFOS Chat**, conversational agent available as a **floating bubble on every page** (and full-screen at `/chat`) that answers in natural language by querying the platform's **live data via tool-calling**: Polymarket odds, TSE polls, the **validated cases & market×poll divergence**, news, and the latest AFOS Daily, **every answer cites its source**, with the same radical-honesty rules (a prediction market is an implied probability, not a forecast; divergence is the signal, the real result is the validator). Trilingual (PT-BR, EN, ES), streamed responses, powered by **OpenRouter (DeepSeek V4 Flash)**. Public with per-IP rate limiting

Coverage of **14+ countries** with monitored elections, in **3 languages** (PT-BR, EN, ES).

**Open Source. Free. Mobile and desktop.**

### Platform demo (~90 seconds)

[![AFOS Analytics, platform demo (click to play)](public/screenshots/landing.png)](https://github.com/AFOS-Analytics/afos-analitica-2026/raw/main/public/demo-en.mp4)

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

Open source. **Code** is licensed under **Apache 2.0**; **data** (e.g. the public divergence dataset mirrored daily to [Hugging Face](https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence)) is licensed under **CC BY 4.0**, both require attribution to AFOS Analytics. Contributions welcome, see [CONTRIBUTING.md](CONTRIBUTING.md). Trademark use of the "AFOS Analytics" name and logo is governed by [TRADEMARK.md](TRADEMARK.md). Hosted-platform contributions (onboarding a new country) are documented at [docs/platform/add-your-country.md](docs/platform/add-your-country.md) and the public governance model is explained at `/methodology/automated-governance`.

---

## Architecture

### Main Routes

| Route | Content |
|-------|---------|
| `/[locale]` | Landing page (color + language selector) |
| `/[locale]/dashboard` | **307 redirect to `/dashboard/br`** since 29/Jul/2026, when the panel gained a country in the address. Old links never break |
| `/[locale]/dashboard/br` | Brazil panel, interactive dashboard with live data, header logo links back to landing. After the Polymarket odds cards it carries the **navigable cross-reference graph** (the "brain"): live market×poll divergence plus clickable nodes to the Brazil HF dataset, the structural-context card, the platform products, the dashboard sections and Harvard Dataverse |
| `/[locale]/dashboard/us` | US panel, 2026 midterms (3 Nov). **Published on 01/Aug/2026**: indexable, in the sitemap, in `llms.txt`, pinged to IndexNow, and live in the country selector. Seven blocks: intro card, prediction market (8 Polymarket markets, every card clickable through to the real market), Republican Senate-seat distribution, generic-ballot polling for the **House**, cross-reference graph, World Bank structural context, press (automatic, fixed outlet list), declared limitations. ⚠️ **The market×poll edge in the graph is MUTE**: the market prices the probability of controlling a chamber and the poll measures a lead in vote points, so no Δpp is shown, by design. A band market only reaches the screen if its bands total between 95% and 105%; the popular-vote-margin market is collected daily but stays off screen at ~145% |
| `/[locale]/daily` | AFOS Daily, daily narrative synthesis cross-referencing prediction markets, polls and news. Available in **3 languages** (PT-BR, EN, ES), loader detects `{date}.{locale}.md` with fallback to canonical PT-BR. Brazilian political terms (TSE, STF, BolsoMaster, etc.) kept in PT with inline links to the trilingual glossary. **Index route = editions archive** (month-grouped list of every published edition, latest highlighted, jump-to-date + in-page language & theme selectors); individual editions live at `/[locale]/daily/[date]` with prev / next + "All editions" navigation |
| `/[locale]/tradeoff` | AFOS Tradeoff, weekly technical reading (Mondays) targeted at institutional research / buy-side / treasury. Three signals reported separately, divergence *is* the signal, not noise to average away. 9 structured sections rendered via rich-frontmatter YAML (summary cards, anti-average rationale, weighted scenarios, indicator grid, liquidity & market structure, polls calendar, watch list, methodology, additional reading). Tri-locale parity with Daily (`{date}.{locale}.md`). **Index route = editions archive** (list by issue number & week, latest highlighted, in-page language & theme selectors); editions live at `/[locale]/tradeoff/[date]` with prev / next + "All editions" navigation. RSS: `/feed/tradeoff.xml` |
| `/[locale]/global` | Global elections hub, **leads with validated cases** (market × poll divergence vs the real result, with open datasets) followed by the **live odds map** (D3.js). Same destination as the landing's "AFOS Global" card and the dashboard header's Global link (single source of truth) |
| `/[locale]/chat` | **AFOS Chat**, conversational agent with live data access via tool-calling (Polymarket odds, TSE polls, validated cases & divergence, news, AFOS Daily); every answer cites its source. Streamed responses (SSE), trilingual, OpenRouter / DeepSeek V4 Flash. Also mounted site-wide as a **floating chat bubble** (lazy-loaded, hidden on this dedicated page) |
| `/[locale]/country/[country]` | Country page (15 countries). Validated cases carry the market×poll **divergence analysis** (table + embedded "🏆 Who won?" odds bars + odds-trajectory chart), the **Structural context** block, and a force-directed **cross-reference graph** (Obsidian-style, d3-force) mapping the election against its markets, polls, press and structural context with the divergence drawn as a colored Δpp edge; theme-aware (light / Sapphire), trilingual. The header carries solid Dashboard + responsive "← Global Coverage / ← Global" back buttons (both invert to white on the Sapphire theme) |
| `/[locale]/how-it-works` | Didactic methodology guide (3 languages), "The Method". In-page language selector (PT-BR/EN/ES). 14-section platform tour including the AFOS Daily card (`#afos-daily-card`), the **AFOS Tradeoff** weekly-brief section (`#afos-tradeoff-card`), the **AFOS Global** section (`#afos-global-card`) documenting the validated-cases layer (the probability-of-winning vs vote-share concept, the country & election divergence pages, and the open datasets), and polling institute evaluation criteria (`#criterios-institutos`); the "Start here" onboarding orients readers to both the Daily and the Tradeoff. Closes with a visible **FAQ section** (`#faq`) rendered from the same source as the FAQPage JSON-LD (text-visible × schema parity for the rich result). Uses shared Tailwind constants (`styles.ts`) for cross-language visual consistency |
| `/[locale]/white-paper` | **White Paper**, the project's goals-and-method document (3 languages), a citable working note: the question (markets vs polls), the falsifiable thesis (*the divergence is the signal*), what we integrate, validation **including the failures** (e.g. the US 2024 popular-vote market), open data, goals, open questions and limitations. Reading-page shell with in-page PT-EN-ES language switcher and light / Sapphire Blue theme toggle (shared `afos-daily-theme`) |
| `/[locale]/methodology/automated-governance` | Public governance page (3 languages), how the hosted platform enforces editorial integrity via code (automated validators + versioned prompt rules), the 2 interaction paths (Fork / Country Onboarding), and the 3 human-intervention exceptions |
| `/[locale]/latam` · `/[locale]/eu` | Regional hubs (Latin America, Europe), 3 languages. AFOS wordmark + "Dashboard" button header. **Monitored countries** as clickable cards (SVG flag + name + region + next election + "View country →" CTA → `/country/[country]`) and **related elections** as rows (SVG flag + localized colored status badge, Active / Completed / Upcoming, + "View election →" → `/election/[slug]`), plus an institutional-intelligence button grid. Shared `RegionPage` component; flags via `ISO3_TO_CC` → `/flags/{cc}.svg` (no emoji, Windows-safe) |

### Landing Page

- Theme selector (white/primary blue) with animated transition
- Language selector (PT-BR/EN/ES) with mini dropdown menu
- SVG flags (compatible with all devices including Windows)
- Lead capture form integrated with visitor tracking system
- SEO optimized with "Unprecedented platform worldwide" claim in metadata
- **Reading flow (revised 29/May/2026):** Hero → ProductsSection (3 cards: Daily / Tradeoff / Global) → Stats → Email signup ("Or receive weekly analysis...") → Features → Countries → Final CTA "Open Dashboard". Lead capture moved up the page to convert before users scroll past Features; redundant intermediate dashboard CTA removed (only nav-button and final-CTA dashboard buttons remain). Daily / Tradeoff / Global links always use the index route (`/{locale}/daily`, `/{locale}/tradeoff`), never hardcoded dates. As of June 2026 these index routes **are the editions archive** (a browsable, month-grouped list of all editions with in-page language & theme selectors), not a redirect to the latest edition; the most recent edition is highlighted at the top so it stays one click away.
- **Inverted-color design rule:** components that need to stand out from the page background invert across themes, light theme = Sapphire Blue components (cards, CTA, subtitle box) with white text; Sapphire Blue theme = white components with primary-color text. Applied consistently in ProductsSection, dashboard CTA, hero subtitle box, **and every solid action button across the theme-aware surfaces** (the Dashboard / Global / back-to-country / edition-navigation buttons on the country, election, AFOS Daily, AFOS Tradeoff, their archives, white paper and how-it-works pages); the static light-only pages (glossary, governance, global/region hubs, for-investors) keep the Sapphire button since they never render on a dark background.
- **Shared footer (compact):** the home renders the shared `<Footer compact />` below the landing, adding internal link-juice (Navigation / Open Source / Legal columns to latam, eu, about, glossary, legal and governance) from the highest-authority page. The `compact` variant hides the redundant blocks already present on the landing (social row, contacts, Harvard pill, back-to-top) and a few duplicate column links; other pages use the full footer.

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
| `SubscribeForm` | Shared form (popup + gate + landing + inline) |
| `InlineSubscribe` | End-of-edition block on AFOS Daily and Tradeoff |
| `DashboardGate` | Blur overlay on 4th session |
| `EmailPopup` | Soft popup on first 3 sessions |

**Security:** Backend is source of truth (not localStorage). 3s timeout with fallback. Atomic dedup via Redis SET NX. Honeypot anti-bot. Rate limiting.

**Inline subscribe (end of each published edition).** AFOS Daily and Tradeoff are the
recurring content of the platform and, until July 2026, were the only surfaces with no
way to subscribe on the page itself. `InlineSubscribe` closes that gap: it wraps the same
`SubscribeForm`, so it inherits honeypot, inline validation, explicit LGPD consent, typo
correction and the redirect to `/welcome`, **where the subscriber picks the language they
want to receive** (English, Portuguese or Spanish). Copy is written for all three locales
and the block adapts to both page themes (light and Sapphire Blue).

`captureSource` distinguishes `daily` and `tradeoff` from `popup`, `gate` and `landing`,
which makes it possible to measure whether recurring content converts, without any
tracking pixel in email.

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

Each claim in AFOS Daily must link to the **specific article** that supports it, not the outlet's homepage. Enforced by 5 cooperating layers:

| Layer | Component | Function |
|-------|-----------|----------|
| 1 | `scripts/fetch-google-news.mjs` | Collects Google News RSS preserving primary `<link>` URLs (redirect to article works even for anti-bot outlets). Parallel fetch via `Promise.all`, retry with backoff, fail-fast on partial errors |
| 2 | Hybrid flow in `/afos-daily` skill | WebSearch with `allowed_domains` for 3-5 anchor stories (clean primary URLs); Google News redirect from cache for the rest |
| 3 | `scripts/wayback-archive.ts` | Snapshots cited URLs to archive.org before publish (evidence preservation) |
| 4 | `scripts/precommit-afos-daily-urls.py` (PreToolUse hook) + `lib/afos-daily/validator.ts` | Blocks `Write/Edit/MultiEdit` on `public/afos-daily/*.md` if forbidden URLs detected (`gamma-api.polymarket.com`, markdown links in plain-text "Sources cited" footer). Warns on >30% homepage ratio or <80% link-density per substantial paragraph |
| 5 | `.claude/commands/afos-daily.md` (skill rules) | Documents the URL hierarchy, validation gates, and the editorial principles enforced in code |

**Manual validator:** `npx tsx scripts/validate-afos-daily.ts {date} [--locale=en\|es]` exits 1 on critical errors (matches the PreToolUse hook). Used in CI checks and in operator workflow before commit.

**Editorial source ratio (50/50 rule, firmed May 9, 2026):** each AFOS Daily uses a **minimum 50% anchor outlets via direct RSS** (Folha de S.Paulo, O Globo, G1, Estadão, Valor, VEJA, institutional credibility) **+ minimum 50% secondary outlets via Google News redirect** (Poder360, BBC, Canal MyNews, CartaCapital, InfoMoney, CBN, Gazeta do Povo, Exame, etc., open access, reproduce anchor coverage without paywall). Refinement of the prior 30/70 rule motivated by the observation that anchor outlets often paywall content for non-subscribers (especially international readers); secondary outlets replicate the same coverage with open access. Applies uniformly to PT-BR / EN / ES. Translations preserve URLs as collected in the source language.

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
│   ├── InlineSubscribe.tsx            # End-of-edition subscribe block (Daily + Tradeoff)
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

### Editorial content, not just the frame

Until July 2026 the UI was translated but the dashboard **analysis** was not: `/en` and `/es` rendered the entire editorial text in Portuguese. The three editorial JSONs now ship one file per locale, loaded by `readLocalized` in `lib/dashboard/static-data.ts`:

```
public/analysis-data.{en,es}.json          market sentiment, INSS, Banco Master, STF cards
public/analysis-criteriosa.{en,es}.json    per-candidate analysis + comparison table
public/polls-data.{en,es}.json             poll registry, approval series, market cross-reference
```

**Fallback is deliberate:** if a locale file is missing or was discarded, the reader gets pt-BR. Serving Portuguese beats serving a mistranslated number.

### Numeric gate

`scripts/lib/json-number-gate.ts` compares the **multiset of unit-bearing values** (%, pp, USD) of every string against the source. Any divergence discards the whole locale file. It is locale-aware because the traps are:

- `61,50%` read under English convention becomes **6150**
- Spanish `billón` is **10¹²**, so `R$ 145 bi` is `145 mil millones`, never `145 billones`
- decimal separator: EN uses a dot, ES keeps the comma, per field

### Glossary links

Brazilian terms link to the glossary **on the expression itself**, the same standard used by AFOS Daily and Tradeoff. The rule has two sides:

| Term | Treatment | Example |
|---|---|---|
| No English/Spanish equivalent | stays in Portuguese **and** links | `[centrão](/en/glossary#centrao)` |
| Has an equivalent | is translated **and** still links | `[first round](/en/glossary#primeiro-turno)` |

Dashboard cards render these through `app/components/GlossaryText.tsx`, which recognises glossary links **and nothing else**: bold, italics and headings remain inert in the JSONs by design. An external URL or an unknown glossary id renders literally, so a broken link is visible rather than silent.

### Known legacy

`app/components/CandidatesSection.tsx` holds its editorial prose **inside the component** rather than in a JSON, so the pre-candidate profile section still renders in Portuguese on `/en` and `/es`. This is frozen on purpose and is not being rewritten. `scripts/check-hardcoded-ptbr.ts` runs on pre-commit and fails any **other** component that gains Portuguese prose, so the gap cannot grow. New editorial content goes to JSON, which has the translation pipeline.

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

- **`public/llms.txt`**, Describes platform for AI crawlers (ChatGPT, Perplexity, Claude, Gemini) following emerging industry standard
- **13 AI crawlers explicitly allowed** in `app/robots.ts`: GPTBot, anthropic-ai, ClaudeBot, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, CCBot, Bytespider, Applebot-Extended, cohere-ai, Meta-ExternalAgent, FacebookBot
- **JSON-LD Article schema** on `/how-it-works` for citation attribution by generative engines
- **Transparent AI attribution**, analyses generated by AI from public, auditable data

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
| White Paper (1 × 3) | 3 | 0.85 |

---

## Global Elections Map

- **D3.js + TopoJSON**, Natural Earth projection, SVG render
- **15 countries** with live Polymarket data
- **SVG flags**, visible on all devices (Windows, Mac, mobile)
- **Volume with label**: "Vol: $53.4M (sum of 6 markets)" when multiple markets
- **Hover**, tooltip with leading candidate, probability, volume
- **Click**, side drawer with candidate breakdown
- **Zoom/Pan**, d3-zoom (1x-8x)

---

## Open Datasets (Hugging Face)

Public, auditable **electoral-divergence** datasets, *prediction markets × polls, with explicit divergence* (the spread is the signal, not a blended average). All **CC BY 4.0**, trilingual cards with a branded flag banner, built from public sources only (no personal data).

| Dataset | Election | What the divergence shows |
|---|---|---|
| [brazil-2026](https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence) | Brazil 2026 (live) | Daily market × poll divergence + full TSE registry (399 polls × 22 public fields) |
| [peru-2026](https://huggingface.co/datasets/AFOS-Analytics1/peru-2026-electoral-divergence) | Peru 2026 ✓ | The market's sustained favorite (López Aliaga) missed the runoff; in the Jun 7 runoff the market favored Fujimori while polls showed a tie, and Keiko Fujimori was proclaimed president-elect by the JNE (50.14% × 49.86%) |
| [colombia-2026](https://huggingface.co/datasets/AFOS-Analytics1/colombia-2026-electoral-divergence) | Colombia 2026 ✓ | First round: de la Espriella led; in the Jun 21 runoff he won 49.66% × 48.70% over Cepeda, market and polls both calling the winner but overstating the margin |
| [chile-2025](https://huggingface.co/datasets/AFOS-Analytics1/chile-2025-electoral-divergence) | Chile 2025 ✓ | Market priced Kast ~66% to win while polls led with Jara, and Kast won |
| [germany-2025](https://huggingface.co/datasets/AFOS-Analytics1/germany-2025-electoral-divergence) | Germany 2025 ✓ | AfD 2nd in votes (~21%) but ~3% to win the most seats |
| [canada-2025](https://huggingface.co/datasets/AFOS-Analytics1/canada-2025-electoral-divergence) | Canada 2025 ✓ | Market swung 85% Conservative → 80% Liberal; the Liberals won |
| [south-korea-2025](https://huggingface.co/datasets/AFOS-Analytics1/south-korea-2025-electoral-divergence) | South Korea 2025 ✓ | Snap election after Yoon's martial-law crisis; the market priced Lee Jae-myung ~80% to win from early April (rising to ~95%) while polls measured ~46–50% vote share, and Lee won with 49.42% |
| [uk-2024](https://huggingface.co/datasets/AFOS-Analytics1/uk-2024-electoral-divergence) | United Kingdom 2024 ✓ | Labour won 411 of 650 seats on 33.7% of the vote; the market read a landslide the polls measured only as ~40% vote share |
| [mexico-2024](https://huggingface.co/datasets/AFOS-Analytics1/mexico-2024-electoral-divergence) | Mexico 2024 ✓ | Market gave Sheinbaum ~90% to win from January; she won with ~59.8%, above the final polls |
| [usa-2024](https://huggingface.co/datasets/AFOS-Analytics1/usa-2024-electoral-divergence) | United States 2024 ✓ | Two markets disagreed: the winner market (electoral college, **US$3.7bn**, the largest election market ever) called Trump vs a poll near-tie and was right; the popular-vote market favored Harris and erred. Adds a Wayback-archived **press timeline** (market × poll × press) |
| [france-2024](https://huggingface.co/datasets/AFOS-Analytics1/france-2024-electoral-divergence) | France 2024 ✓ | The deepest market (US$917k, "which single party wins the most seats") priced the Rassemblement National ~99% to be the largest single party, and it was right (143 seats); the RN-majority hype (230–270 seats) only lived in polls and thin markets. A divergence is only robust at high volume |

All datasets are additionally released as curated, citable academic snapshots on **[Harvard Dataverse](https://dataverse.harvard.edu/dataverse/afos-analytics)**, grouped under the **AFOS Analytics** collection, **each with its own DOI** (11 datasets, e.g. France [10.7910/DVN/N51NQF](https://doi.org/10.7910/DVN/N51NQF), Brazil [10.7910/DVN/2D0UK7](https://doi.org/10.7910/DVN/2D0UK7), USA [10.7910/DVN/3DJCW5](https://doi.org/10.7910/DVN/3DJCW5)), each a versioned and permanent snapshot of its live Hugging Face mirror, deposited in the largest social-science data repository. To our knowledge the Brazil 2026 deposit is the first on Harvard Dataverse to cross-reference prediction markets × registered polls × press coverage to measure explicit divergence in a Brazilian election.

The completed cases (✓) are the method **validated against the real result**, surfaced as **"Validated cases"** on the [`/global`](https://www.afos-analytics.com/en/global) hub. Each carries the full poll history, daily Polymarket odds, the market×poll divergence time-series, **two odds charts** (probability trajectory + eve-of-vote market×poll snapshot, with total bet volume), a **`data/{country}-structural-context.csv`** (World Bank WGI governance + WDI economy & education), and a `DATA_DICTIONARY.md`. Every dataset is built to **FAIR, tidy-data and AAPOR-disclosure norms**, with immutable `raw/` sources separated from derived tables, a machine-readable **`datapackage.json`** (Frictionless Table Schema, validated) and **`croissant.json`**, SHA-256 **`CHECKSUMS.txt`**, a **`DATASHEET.md`** (Datasheets for Datasets) and a `CITATION.cff`. Outside Brazil the depth is topline-only (no equivalent to Brazil's TSE open-data registry).

On-platform, every completed election's `/country/[country]` and `/election/[slug]` pages render its **election-day Polymarket snapshot** (candidates, bars, accumulated volume), the **market×poll divergence** table, and a **native odds-trajectory chart** (Polymarket implied probability over the campaign for the top contenders, with total bet volume), all theme-aware (light / Sapphire), with the AFOS brand and country flag.

### Structural context (World Bank WGI + WDI)

Each validated country page also carries a **Structural context** block, official, open, citable World Bank indicators that frame the country *alongside* the market signal (not as a predictor of it). Two columns:

- **Governance** (six **Worldwide Governance Indicators**, 0–100 scale, with bars): political stability, voice & accountability, rule of law, government effectiveness, regulatory quality, control of corruption.
- **Economy & Education** (**World Development Indicators**): population, GDP, GDP per capita, inflation; public education spending (% of GDP) and expected years of schooling.

These are **annual structural indicators that contextualize the country, they do not predict the electoral outcome** (stated explicitly in the source line of the block), trilingual (PT-BR / EN / ES) with locale-aware number formatting, and theme-aware. The data is fetched keyless from two World Bank surfaces: **WGI via the new [Data360 API](https://data360api.worldbank.org/)** (the legacy v2 WGI codes were archived) and **WDI via the classic [v2 API](https://api.worldbank.org/v2/)**, both open-licensed and citable, matching the AFOS open-data ethos (a proprietary terminal feed, e.g. Bloomberg, would be non-redistributable and incompatible with the published datasets). Hub cards are intentionally left unchanged; the block lives only on the country detail page as complementary information.

**Open-data parity (published to all three surfaces).** The structural context is not just rendered on the site, it is published alongside every validated dataset so it is reproducible from the open files:

- **Hugging Face** — each of the 8 datasets ships a `data/{country}-structural-context.csv` (long/tidy: `category, indicator, label, value, unit, year, source, iso3`, 11 indicators per country), documented in its `DATA_DICTIONARY.md`.
- **Academic bundle (multi-country repo)** — a per-country `structural-context.csv` in each country folder, with the same dictionary entry.
- **Neon Postgres** — an isolated `{country}.structural_indicator` table per country schema (Brazil's `public` schema untouched).

### Cross-reference graph

Below the structural context, each validated country page renders a force-directed **cross-reference graph** (Obsidian-style, built with d3-force): the election at the center, surrounded by its **prediction markets, polls, press and structural context** (governance / economy / education). The **divergence is the star**, each candidate's market reading is linked by a thin colored edge labeled with the Δpp gap (red = high divergence, amber = medium, green = convergence), and validated cases add a **"real result" node** wired in green to the actual winner (omitted where no official result is proclaimed yet, e.g. Peru, contested). Trilingual labels (PT-BR / EN / ES) and theme-aware (light / Sapphire). It is a **visualization layer over data already published** to Hugging Face / Neon, no new data; enabled per country via an allowlist for incremental rollout. The US 2024 case additionally shows the two markets that disagreed (electoral college vs popular vote) and press anchors. Across all validated cases the candidate nodes are colored by party (US R=red / D=blue; elsewhere left/labour red, right/conservative blue; real party colors for Germany), every node lights up Obsidian-style on hover (the node and its edges glow blue while the rest fades), and the **data nodes are clickable** — markets, polls, candidates and the real-result node open the matching folder of that country's open Hugging Face dataset (`data/`, `polls/`, `press/`), while the structural-context nodes scroll to the on-page context card; the US page also carries a clickable **Harvard Dataverse** cluster (AFOS collection + USA DOI).

On the **Brazil dashboard** (the live case) the same graph is the **navigable brain**, placed right after the Polymarket odds cards: the live market×poll divergence (Lula / Flávio / Renan…) at the heart, plus **clickable nodes** that turn it into a map of the whole platform. Data nodes (markets / polls / press / candidates) link to their daily-updated folder in the **Brazil Hugging Face dataset** (`data/`, `polls/`, `news/`, `snapshots/analysis-criteriosa/`); structural-context nodes scroll to the on-page context card; and three navigation hubs link out to the **products** (Daily, Tradeoff, Global, Method, White Paper, Governance, About, Goals), the **dashboard sections** (in-page anchors), and **Harvard Dataverse** (the AFOS collection + Brazil DOI + USA DOI). Every node points somewhere, just like an Obsidian vault graph.

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
  → Parse CSV (399 presidential polls, ALL public fields:
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
| **Next.js 15** | App Router, RSC, TypeScript, Middleware |
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
| **OpenRouter (DeepSeek V4 Flash)** | AFOS Chat, conversational tool-calling agent over live data |
| **World Bank (WGI via Data360 + WDI v2)** | Structural country context on validated pages, governance (WGI 0–100) + economy & education (WDI). Keyless, open-licensed |
| **Vercel Analytics + Speed Insights** | Traffic metrics + Core Web Vitals (real-user performance) |

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
| `/api/cron/refresh-elections` | Cron 30min, Polymarket → Redis + Neon (unified, single fetch per tick) |
| `/api/cron/refresh-polls` | Cron 3x/day TSE |
| `/api/cron/persist-analysis` | Cron 1x/day, persists analysis JSONs and AFOS Daily markdown to Neon |
| `/api/polymarket` | BR odds |
| `/api/polls` / `/api/polls/tse` | Polls |
| `/api/news` | News |
| `/api/admin/analytics` | Detailed analytics |
| `/api/admin/search-console` | Google Search Console |
| `/api/admin/metrics` | Executive dashboard |
| `/api/admin/data-request` | LGPD deletion/export |
| `/api/health` | Health check |
| `/api/translations` | AI translation pipeline |
| `/api/chat` | AFOS Chat, streaming (SSE) tool-calling agent over live platform data; per-IP rate limited |
| `/api/market/history` | Odds time series |

---

## What does AFOS mean?

| Letter | Meaning | Description |
|--------|---------|-------------|
| **A** | Astuteness | Intelligence to cross-reference data and generate clarity |
| **F** | Fairness | Verifiable impartiality in the treatment of every source |
| **O** | Objectivity | Analytical neutrality, we observe the data, we don't take sides |
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
| `/afos-daily` | Generate the daily narrative synthesis (AFOS Daily), cross-references markets, polls and news with auditable links per claim |
| `/tradeoff` | Generate the weekly technical reading (AFOS Tradeoff), 9 structured sections, reports the three signals separately, weighted-scenario analysis for institutional readers |

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

*AFOS Analytics, Unprecedented platform worldwide: Real-time Political Electoral Risk Intelligence.*
