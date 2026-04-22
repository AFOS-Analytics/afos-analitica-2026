---
name: Country Onboarding
about: Propose onboarding a new country to the AFOS hosted platform (technical configuration PR companion)
title: 'country: onboard {Country Name}'
labels: country-onboarding, enhancement
assignees: ''
---

<!--
SCOPE: This template is for onboarding a new country to the AFOS HOSTED PLATFORM
at afos-analytics.com — the instance operated by AFOS. Your configuration will
run under the AFOS brand on our infrastructure.

If you want to run your own AFOS-like instance with full freedom, FORK THE REPO
(Apache 2.0) instead. Forks do not go through this template — they are
independent projects and AFOS is not involved.

READ FIRST: docs/platform/add-your-country.md — the step-by-step guide.
Public governance page: /methodology/automated-governance

Country Onboarding contributions are about CONFIGURATION (source map, market
mapping, prompt parameters), not about writing analyses. The hosted platform's
automated pipeline generates analyses from your config.
-->

## Country

- **Country name:** <!-- e.g., Colombia -->
- **ISO 3166-1 alpha-2 code:** <!-- e.g., CO -->
- **Route slug:** <!-- e.g., colombia, usa, south-korea -->
- **Next election:** <!-- YYYY-MM-DD + type (presidential / legislative / regional) -->

## Sanity-check (from docs/platform/add-your-country.md Step 1)

### Polymarket coverage

- [ ] There are active events for this country's elections on Polymarket
- [ ] At least one event has volume > US$ 10k (signal is usable)

If markets are weak or absent, describe the alternative weighting you propose:

<!-- e.g., "No active Polymarket; polls and news get full weight, market card disabled" -->

### Poll sources

List 2-3 reference polling institutes:

- <!-- e.g., Invamer — URL — why reputable in this country -->
- <!-- e.g., Cifras y Conceptos — URL — why reputable -->
- <!-- e.g., Guarumo — URL — why reputable -->

### News sources

List 3-5 reference outlets spanning political perspectives:

- <!-- e.g., El Tiempo (centrist) -->
- <!-- e.g., Semana (center-right) -->
- <!-- e.g., El Espectador (center-left) -->

## Political context preview

Brief description a non-local reader needs to understand this country's AFOS analyses. Think of it as the "glossary" portion of the future config.

- **Top political actors expected to appear:** <!-- 3-8 names, role, party — factual only, no adjectives -->
- **Recurring themes:** <!-- e.g., "post-FARC transitional justice", "economic polarization", "migration from Venezuela" -->
- **Country-specific terms a non-local needs defined:** <!-- e.g., "JEP", "Pacto Histórico", etc. -->

## Your plan

- [ ] I read `docs/platform/add-your-country.md` in full
- [ ] I understand this is a **configuration PR**, not daily-analysis work
- [ ] I can provide source maps for polls and news
- [ ] I know this country's political landscape first-hand
- [ ] I will open the PR within ~2 weeks of this issue

## Discussion

<!--
Anything you want maintainer feedback on BEFORE coding:
- Unusual aspects of this country (e.g., "polls are rare in off-election years")
- Unclear points from the guide
- Uncertainty about source reliability
-->

---

## What happens next

1. AFOS is maintained by a small team. We aim to acknowledge this issue within a few days and respond with any questions.
2. You open the PR following `docs/platform/add-your-country.md` Steps 2-7.
3. We aim to respond to PRs within 7-10 business days. If we miss that window, please bump the PR with a polite comment and we'll prioritize.
4. On merge, the pipeline picks up your country within ~1 hour.

Thank you for contributing.
