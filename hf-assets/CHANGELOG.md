# Changelog

All notable changes to this dataset. The data itself is dated and append-only; this log records **structural** changes (new files, schema, coverage).

## 2026-06-13 — Poll-centric research enrichment

### Added
- **`polls/national-polls.json`** — each poll now carries `field_window`, `field_midpoint`, `days_to_first_round`/`days_to_runoff`, `dating_source`, and `tse_registration.sample_design` (sample composition/weighting, layer A).
- **`polls/sample-demographics.csv`** — flat view of the sample-design demographics (layer A) with explicit per-poll coverage (`full_percentages` for 12/22 polls; `mentioned_no_pct` for 10/22). This is sample composition/weighting, **not** vote-by-demographic crosstabs (layer B), which are absent from TSE open data.
- **`data/poll-divergence.csv`** — poll-level market×poll pairing anchored on the fieldwork midpoint, with `naive_gap_pp` explicitly flagged as P(win) − vote-share (not scale-reconciled).

## 2026-06-10 — Robustness & research release

Major enrichment toward academic-grade, poll-centric use.

### Added
- **`polls/tse-registry.csv` / `.json`** — official TSE poll-registration registry (382 records): institute, sample, scope, UF, field dates, registration number, declared cost. Registration metadata only.
- **`polls/national-poll-results-firstround.csv`** (158 rows) and **`-secondround.csv`** (38 rows) — published national poll results, long format, carrying TSE registration numbers; reconstructed from the full platform history (22 distinct national polls, Mar–Jun 2026).
- **`polls/national-polls.json`** — full structured national polls (results + methodology).
- **`data/market-odds-timeseries.csv`** — daily Polymarket presidential odds per candidate, **backfilled to 2026-04-17** (previously divergence/market files began only 2026-06-04).
- **`data/divergence-timeseries.csv`** — market × poll divergence per candidate, reconstructed by joining each national poll to the market odds on its date.
- **`DATA_DICTIONARY.md`**, **`CITATION.cff`**, **`CHANGELOG.md`** — academic documentation.

### Fixed
- Backfill gap: the daily divergence/poll/news files had no historical backfill (only the analysis snapshots did), so the market & divergence series started on 2026-06-04. The new time-series files restore the full history from the archived snapshots.

## 2026-06-05 — Initial public mirror

- Daily mirror established: `snapshots/analysis-criteriosa`, `snapshots/analysis-cards` (backfilled from 2026-04-17), `polls/polls-data-{date}.json`, `data/divergence-{date}.csv`, `news/news-{date}.json`.
- Dual license (CC BY 4.0 data / Apache 2.0 code); database-free export pipeline (no subscriber data).
