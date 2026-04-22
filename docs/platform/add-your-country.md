# Add Your Country to the AFOS Hosted Platform

> **5 steps. ~2 hours of work. One PR. After merge, your country runs autonomously on `afos-analytics.com`.**

## Scope: this guide is about the hosted platform, not the code

This document describes how to onboard a new country to the **AFOS hosted platform at `afos-analytics.com`** — the instance operated by AFOS. The contribution model here is **platform-level**, not code-level:

- **Hosting a country on AFOS's platform** = your configuration runs under the AFOS brand, on infrastructure AFOS pays for, producing analyses audited by AFOS's automated validators. Follow this guide.
- **Running your own AFOS-like instance** = fork the repo under Apache 2.0, ignore this guide entirely. You are free to replicate, modify, and operate — as long as you comply with the license (attribution, NOTICE file, no use of the AFOS trademark). Forks are independent projects and this document does not apply to them.
- **Improving the codebase itself** (bugs, features, new validators) = standard open-source contribution via [`CONTRIBUTING.md`](../../CONTRIBUTING.md). That is a different flow than this guide.

The integrity rules, validators and governance for `afos-analytics.com` are described on the public page [`/methodology/automated-governance`](https://afos-analytics.com/en/methodology/automated-governance).

---

## What you're actually building

A **configuration** that onboards a new country to the AFOS hosted platform. You are not writing daily analyses. You are giving the automated pipeline what it needs to generate analyses for your country autonomously:

- Which Polymarket events to track
- Which polling institutes to trust
- Which news outlets to reference
- Country-specific political context (actors, themes, glossary)
- Technical scaffolding (routes, translations)

After your PR merges, the pipeline starts generating daily analyses for your country using your config. No more work from you is required — unless the config itself needs updating later (source drift).

---

## Prerequisites

- Node.js 18+ and npm 9+ installed
- A GitHub account (to open the PR)
- ~2 hours of focused time
- First-hand knowledge of your country's political landscape (not just online reading)

---

## Step 1 — Pick your country and do a 10-minute sanity check

Before writing any code, verify your country has the inputs the pipeline needs:

### 1.1 Check Polymarket coverage

Visit `https://gamma-api.polymarket.com/events?limit=100` and search for your country (or check [polymarket.com/politics](https://polymarket.com/politics)).

- Are there active events for elections in your country?
- Do any events have volume > US$ 10k? (Below that, signal is noise.)

If the answer is no to both, your country has **low market coverage**. You can still contribute — the pipeline will weight polls and news more heavily — but document this in your PR.

### 1.2 Check poll sources

List 2-3 polling institutes in your country you'd consider "reference" (the ones local journalists actually cite). Examples:

- **Brazil:** Datafolha, Quaest, Paraná Pesquisas
- **USA:** FiveThirtyEight aggregation, Marist, Siena College
- **France:** Ifop, Ipsos, Harris
- **Germany:** Forsa, INSA, Infratest Dimap
- **Colombia:** Invamer, Cifras y Conceptos, Guarumo

Does the institute have a public website with poll archives? Are its methodology and sample sizes disclosed? If yes — good enough.

### 1.3 Check news sources

List 3-5 reference news outlets for your country. They should:

- Publish political news regularly
- Have RSS feeds OR be indexed by Google News
- Span the political spectrum (include outlets seen as center-left, center, center-right)

---

## Step 2 — Add the country to the Polymarket market map

**File:** `lib/polymarket/country-market-map.ts`

Add an entry for your country following the existing Brazil pattern:

```typescript
// Before — existing countries
export const COUNTRY_MARKETS = {
  br: {
    presidential: 'brazil-presidential-election',
    secondPlace: 'brazil-presidential-election-first-round-2nd-place',
    // ...
  },
  // After — add yours
  co: {
    presidential: 'colombia-presidential-election-2026',
    // If no equivalent exists, use null and the pipeline skips that card
    secondPlace: null,
    // ...
  },
}
```

Tip: if your country has strong legislative markets but weak presidential ones, that's fine — map what exists.

---

## Step 3 — Register country metadata

**File:** `lib/seo/countries.ts`

```typescript
export const COUNTRIES = {
  // ... existing ...
  co: {
    code: 'co',
    flag: 'co',  // maps to /public/flags/co.svg
    name: {
      'pt-BR': 'Colômbia',
      en: 'Colombia',
      es: 'Colombia',
    },
    nextElection: '2026-05-31',  // ISO date
    electionType: 'presidential',
    description: {
      'pt-BR': 'Eleição presidencial colombiana de 2026.',
      en: 'Colombian presidential election 2026.',
      es: 'Elección presidencial colombiana 2026.',
    },
  },
}
```

If the flag SVG is missing from `/public/flags/`, add one from [flagicons.lipis.dev](https://flagicons.lipis.dev/) (MIT-licensed).

---

## Step 4 — Create the country config for the pipeline

**New file:** `lib/countries/{code}/config.ts`

This is the **heart of your contribution**. The pipeline reads this when generating analyses.

```typescript
import type { CountryConfig } from '../types'

export const coConfig: CountryConfig = {
  code: 'co',

  // Poll institutes the pipeline should ingest (ordered by reliability tier)
  pollSources: [
    { name: 'Invamer', reliability: 5, url: 'https://www.invamer.com.co/' },
    { name: 'Cifras y Conceptos', reliability: 4, url: 'https://www.cifrasyconceptos.com/' },
    { name: 'Guarumo', reliability: 3, url: 'https://guarumo.co/' },
  ],

  // News outlets (used to build Google News search queries + direct RSS)
  newsSources: [
    'El Tiempo',
    'Semana',
    'El Espectador',
    'La Silla Vacía',
    'Portafolio',
  ],

  // Known political actors the pipeline prompt will contextualize
  politicalActors: [
    { name: 'Gustavo Petro', role: 'incumbent president', party: 'Pacto Histórico' },
    // ... add top 5-8 expected candidates or relevant figures
  ],

  // Country-specific glossary (equivalent to Brazil's "STF", "INSS", "Banco Master")
  glossary: [
    { term: 'JEP', expansion: 'Jurisdicción Especial para la Paz — transitional justice system' },
    // ... add 5-10 terms a non-local reader needs explained
  ],

  // Optional: liquidity thresholds, weight overrides
  marketLiquidityThreshold: 5000,  // USD
  vectorWeights: { market: 0.3, polls: 0.5, news: 0.2 },  // polls heavier for this country
}
```

Copy `lib/countries/br/config.ts` as a starting template and adapt.

**Important:** do NOT embed editorial opinions in the political actors or glossary entries. "Incumbent president, center-left" is fine. "Authoritarian populist" is not. The pipeline's integrity validators will flag partisan terms in configs.

---

## Step 5 — Add the country page route and translations

**New directory:** `app/[locale]/country/{slug}/`

Copy the Brazil page as scaffold:

```bash
cp -r app/\[locale\]/country/brasil app/\[locale\]/country/colombia
```

Then edit the page to reference your country code. Check `app/[locale]/country/brasil/page.tsx` — most of it is generic; you mainly change the country code lookup.

**Translations:** add keys for candidate names and parties to:

- `messages/pt-BR/home.json`
- `messages/en/home.json`
- `messages/es/home.json`

If you're a native speaker of only one locale, **say so in the PR** — maintainers or the community can help with missing translations.

---

## Step 6 — Run locally and verify

```bash
npm install
npm run build
npm run dev
```

Open `http://localhost:3000/en/country/{your-slug}`. You should see:

- Country name, flag, next election date
- Polymarket cards (if markets were mapped)
- Placeholder for polls (empty until ingestion cron runs)
- News feed (populates on first pipeline run)

If anything renders broken, fix before opening the PR.

---

## Step 7 — Open the PR

Title: `feat(country): add {country name}`

PR description should include:

- [ ] Polymarket market map entry added
- [ ] Country metadata in `lib/seo/countries.ts`
- [ ] Country config in `lib/countries/{code}/config.ts`
- [ ] Country page route in `app/[locale]/country/{slug}/`
- [ ] Translations added to `messages/{locale}/home.json`
- [ ] `npm run build` passes locally
- [ ] Flag SVG present in `/public/flags/`
- [ ] Source map uses verifiable, linkable, reputable sources
- [ ] Political actors listed without partisan adjectives
- [ ] Glossary entries describe functions, not motivations

**What happens after you submit:**

1. AFOS is maintained by a small team. We aim to respond to Country Onboarding PRs within 7-10 business days (reviewing config quality, not editorial content). If we miss that window, please bump the PR with a polite comment and we'll prioritize.
2. Any revisions requested are narrow and technical (e.g., "this URL is dead", "Polymarket slug is outdated")
3. Once merged, the pipeline picks up your country on the next cron run (within ~1 hour)
4. Your country appears on the global map; daily analyses generate autonomously

---

## After merge — what changes for you

**Nothing, unless your config needs updating.** You are not committed to writing, reviewing, or curating anything. The pipeline handles daily operation.

**When to come back:**

- An institute you listed stops publishing (source drift) → update `pollSources`
- A new major political actor emerges → add to `politicalActors`
- A news outlet changes URL structure → update `newsSources`
- You want to add more countries

Each of these is a small PR (~15 minutes). The hosted platform operates without you in between.

---

## What makes a great Country Onboarding

The 5 signals maintainers look for:

1. **Source diversity** — poll institutes and news outlets that don't all lean the same way
2. **Link hygiene** — every source URL resolves and opens what's described
3. **Actor balance** — listed political figures span current contenders, not a curated subset
4. **Glossary clarity** — a non-local reader can understand your country's analysis with the glossary alone
5. **Honest limitations** — the PR describes what this country lacks (low Polymarket liquidity, no structured poll API, etc.), not just what it has

---

## Getting help

- **Technical questions:** open a GitHub issue with the `country-onboarding` label
- **Clarification on rules:** ask in the PR comments; we respond as soon as we can — typically within a few days
- **Direct contact:** `contact@afos-analytics.com`

---

## The philosophy (short version)

AFOS is rigorous in method, flexible in execution. You bring the local execution (sources, actors, context). The method — cross-source triangulation, integrity rules, output structure — is the same for every country. This is how the platform scales: **contribute once, impact persists**.

Welcome to AFOS. Thank you for considering this contribution.
