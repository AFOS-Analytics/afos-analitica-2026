# Data Dictionary — AFOS Brazil 2026 Electoral Divergence

Every file, every column, with type, unit, and provenance. Values are never imputed or smoothed: a missing value is left **blank**, not filled.

---

## `polls/tse-registry.csv` / `.json`

Official **TSE poll-registration registry** for the 2026 cycle. One row per registered poll. Registration-sheet metadata **only** — no per-candidate results, no demographic crosstabs.

| Column | Type | Unit / format | Notes |
|--------|------|---------------|-------|
| `register_tse` | string | e.g. `BR-08016/2026` | Official TSE registration number. |
| `institute` | string | — | Polling institute as registered with the TSE. |
| `scope` | string | `state` \| empty | `state` = state-level poll; empty = national / not tagged. |
| `uf` | string | 2-letter UF or `BR` | Federative unit. |
| `sample_size` | integer | respondents | Declared sample size. Blank when not declared. |
| `field_start` / `field_end` | date | `YYYY-MM-DD` | Fieldwork window. |
| `publication_date` | date | `YYYY-MM-DD` | Planned/actual publication date (may be in the future for registered-but-unreleased polls). |
| `registration_date` | date | `YYYY-MM-DD` | Date filed with the TSE. |
| `cost` | number | BRL | Declared cost of the poll. |
| `confidence_score` | number | 0–1 | AFOS internal credibility weight. |
| `source_name` | string | — | Source as ingested. |
| `source_credibility` | integer | 1–3 | AFOS source-tier (3 = highest). |
| `event_date` | date | `YYYY-MM-DD` | Reference date used by the AFOS pipeline. |

> ⚠️ **"Registered" ≠ "published".** A poll appearing in the registry has been filed with the TSE; it may be delayed or never released. Confirm actual release against a primary source before citing numbers.

---

## `polls/national-poll-results-firstround.csv`

Published **first-round** results, long format (one row per candidate × scenario × poll).

| Column | Type | Notes |
|--------|------|-------|
| `poll_id` | string | TSE register if available, else `institute-date`. |
| `register_tse` | string | TSE registration number (blank if unregistered/commissioned). |
| `institute` | string | Polling institute. |
| `poll_date` | date | Publication date (`YYYY-MM-DD`). |
| `field_dates` | string | Fieldwork window as published. |
| `sample` | integer | Sample size. |
| `margin_pp` | number | Margin of error, percentage points. |
| `method` | string | e.g. "Pesquisa nacional", "Telefônica". |
| `scenario` | string | Scenario label (some polls test multiple candidate sets). |
| `candidate` | string | Candidate name. |
| `party` | string | Party, parsed from the candidate label. |
| `percent` | number | Voting intention, %. |

## `polls/national-poll-results-secondround.csv`

Published **runoff** matchups.

| Column | Type | Notes |
|--------|------|-------|
| `poll_id`, `register_tse`, `institute`, `poll_date` | — | As above. |
| `matchup` | string | e.g. "Lula vs Flávio". |
| `candidate1` / `percent1` | string / number | First candidate and %. |
| `candidate2` / `percent2` | string / number | Second candidate and %. |

## `polls/national-polls.json`

Full structured array of the deduplicated national polls (results + methodology + sources), reconstructed from the git history of the AFOS dashboard's `polls-data.json`. Deduplicated by TSE register (fallback: institute + date), keeping the most complete version of each poll.

---

## `data/market-odds-timeseries.csv`

Polymarket presidential **winner** odds per candidate, daily.

| Column | Type | Notes |
|--------|------|-------|
| `date` | date | `YYYY-MM-DD`. |
| `candidate` | string | First-name key (e.g. "Lula", "Flávio"). |
| `party` | string | Party. |
| `polymarket_pct` | number | Implied probability, %. |
| `volume_usd_m` | number | Cumulative traded volume, USD millions. Blank for legacy snapshots (pre-2026-05-22) that did not record volume. |

> Extracted by regex from each daily `analysis-criteriosa.json` `quadroComparativo[].m` field — no value is fabricated; candidates without a parseable market price are omitted.

## `data/divergence-timeseries.csv`

**Market × poll divergence** — the dataset's namesake signal. Each national-poll first-round result is joined to the candidate's Polymarket odds on the poll's date.

| Column | Type | Notes |
|--------|------|-------|
| `poll_date` | date | Poll publication date. |
| `institute` | string | Polling institute. |
| `register_tse` | string | TSE register. |
| `candidate` | string | Canonical candidate key. |
| `poll_pct` | number | Poll voting intention, %. |
| `polymarket_pct` | number | Market implied probability on `polymarket_date`, %. |
| `polymarket_date` | date | Market date used: nearest available **on or before** `poll_date`. |
| `divergence_pp` | number | `polymarket_pct − poll_pct`, percentage points. |

> **Interpretation caveat:** a poll reports first-round *vote share*; a Polymarket contract prices *probability of winning the election*. The two are different quantities — `divergence_pp` measures the gap between the market's win-probability and the poll's vote share, which is the spread AFOS tracks editorially, **not** a like-for-like error metric. Candidate names are normalized across sources via an explicit mapping (see `scripts/export-hf-dataset.mjs`).

## `data/divergence-{date}.csv`

Per-day snapshot: `date, candidate, polymarket_pct, poll_pct, divergence_pp`.

---

## `snapshots/analysis-criteriosa/{date}.json`

Daily structured analysis. Key fields: `updatedAt`, `subtitle`, `cruzamento` (the day's cross-source reading), `candidates[]` (per-candidate `header`/`analise`/`fortes`/`fracos`), and `quadroComparativo[]` — the comparison table where `m` = market price string, `p` = poll mentions, `t` = trend reading, `s` = sources.

## `snapshots/analysis-cards/{date}.json`

Thematic cards: `sentimento`, `inss`, `bancoMaster`, `stf` (incl. impeachment market %).

## `news/news-{date}.json`

`{ date, count, items[] }`, where each item is `{ source, title, url, published }`. **Links only — no article bodies.**
