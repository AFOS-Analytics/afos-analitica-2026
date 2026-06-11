# Data Dictionary — AFOS Brazil 2026 Electoral Divergence

Every file, every column, with type, unit, and provenance. Values are never imputed or smoothed: a missing value is left **blank**, not filled.

---

## `polls/tse-registry.csv` / `.json`

Official **TSE poll-registration registry** for the 2026 presidential cycle, built **directly from the TSE Open Data file** `pesquisa_eleitoral_2026_BRASIL.csv` ([dadosabertos.tse.jus.br](https://dadosabertos.tse.jus.br)). One row per registered presidential poll (**350**). This is the **full set of public registration fields** — every poll registered in Brazil must, by **Lei 9.504/1997 art. 33** (and Resolução TSE 23.600/2019), disclose its methodology, sampling/weighting design, cost, contracting party and responsible statistician *before* release. The registry carries that design; it does **not** carry per-candidate results (the institute publishes those) nor the demographic crosstabs *of the results*.

| Column | Type | Unit / format | Notes |
|--------|------|---------------|-------|
| `register_tse` | string | e.g. `BR042272026` | Official TSE registration number (`NR_PROTOCOLO_REGISTRO`). |
| `registration_date` | date | `YYYY-MM-DD` | Date filed with the TSE (`DT_REGISTRO`). |
| `own_poll` | string | `S` \| `N` | `S` = institute's own poll; `N` = commissioned by a third party (`ST_PESQUISA_PROPRIA`). |
| `cnpj` | string | 14 digits | Polling company's CNPJ (`NR_CNPJ_EMPRESA`). |
| `institute` | string | — | Polling company, legal name (`NM_EMPRESA`). |
| `institute_trade_name` | string | — | Trade name, when declared (`NM_EMPRESA_FANTASIA`). |
| `office` | string | — | Office polled (`DS_CARGO`) — filtered to *Presidente*. |
| `field_start` / `field_end` | date | `YYYY-MM-DD` | Fieldwork window (`DT_INICIO/FIM_PESQUISA`). |
| `publication_date` | date | `YYYY-MM-DD` | Planned/actual publication date (`DT_DIVULGACAO`; may be future for registered-but-unreleased polls). |
| `sample_size` | integer | respondents | Declared sample size (`QT_ENTREVISTADO`). |
| `conre` | string | — | Regional Statistics Council registration of the responsible statistician (`CD_CONRE`). |
| `statistician` | string | — | Responsible statistician, named (`NM_ESTATISTICO_RESP`). |
| `cost_brl` | number | BRL | Declared cost of the poll (`VR_PESQUISA`). |
| `methodology` | string (long) | free text | **Full** methodology description (`DS_METODOLOGIA_PESQUISA`) — survey type, mode (in-person/phone), instrument. Up to ~3.8k chars; **not truncated**. |
| `sampling_plan` | string (long) | free text | **Full** sampling/weighting design (`DS_PLANO_AMOSTRAL`) — universe, multi-stage cluster design, **and the demographic/geographic quota design (sex, age, education, income, region) with the exact quota percentages** when declared. Up to ~4k chars; **not truncated**. This is the registration-level weighting *design*. |
| `control_system` | string (long) | free text | Internal field-control/quality-control system (`DS_SISTEMA_CONTROLE`). |
| `municipality_data` | string | free text | Municipality-level breakdown declaration (`DS_DADO_MUNICIPIO`), when present. |
| `uf` | string | 2-letter UF or `BR` | Federative unit (`SG_UF`). |
| `electoral_unit` | string | — | Electoral unit name (`NM_UE`). |

> ⚠️ **"Registered" ≠ "published".** A poll in the registry has been filed with the TSE; it may be delayed or never released. Confirm actual release against a primary source before citing numbers.
>
> 🔎 **What the TSE publishes vs not.** Public (in this file): methodology, sampling/weighting **design**, cost, contracting party, named statistician, fieldwork dates, sample size. **Not** in the open-data file: the per-candidate **results** and their demographic crosstabs (published by the institute, not the TSE), and the **complete questionnaire** (art. 33 VI) — that is an attachment in the TSE *PesqEle* system, not in the open-data CSV.

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

Full structured array of the **22** deduplicated national polls **with results** (first round + runoff scenarios + methodology + sources), reconstructed from the git history of the AFOS dashboard's `polls-data.json`. Deduplicated by TSE register (fallback: institute + date), keeping the most complete version of each poll.

Each poll carries a **`tse_registration`** object linking it to its public TSE registration (from `tse-registry` above):

| Field | Notes |
|-------|-------|
| `register_tse` | Matched TSE protocol. |
| `matched_by` | `protocol` = exact protocol match (8/22); `institute+date(±Nd)` = nearest same-institute registration within N days (14/22). For institute+date matches the attached **methodology/sampling design is the institute's standard** (stable across waves), not a claim of identical protocol. |
| `cnpj`, `institute_full`, `statistician`, `conre`, `cost_brl`, `own_poll` | Registration metadata. |
| `methodology`, `sampling_plan`, `control_system` | Full registration text (see `tse-registry` schema). `null` when no confident match. |

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
