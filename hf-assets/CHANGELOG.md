# Changelog

All notable changes to this dataset. The data itself is dated and append-only; this log records **structural** changes (new files, schema, coverage).

## 2026-07-30, errata mechanism

### Added
- **`ERRATA.md`** (trilingual). Records known defects in already-published dated files. Policy stated explicitly: **files for closed dates are never rewritten**; the correction is published in the errata instead, so the record stays exactly as distributed and the defect stays discoverable. The file for the *current* date may still be regenerated during the day, since the mirror runs more than once daily.
- **First entry, ERR-2026-001:** `data/divergence-2026-07-29.csv`, row `Renan Santos`, `polymarket_pct` published as `8.6` where the site and the daily synthesis published `8.70%` (`divergence_pp` `0.8` instead of `0.90`). One row of seven on that date; 0.10pp. Cause and prevention documented in `ERRATA.md`.

## 2026-06-30, June poll wave + coverage refresh

### Added / Updated
- **+10 national polls (Jun 10 to 29, through BTG/Nexus 29/Jun).** `polls/national-polls.json` now **32 polls**; `polls/national-poll-results-firstround.csv` **196 rows** and `-secondround.csv` **50 rows**.
- **`polls/tse-registry.csv` / `.json`** grown to **399 presidential records** (from 382). Registration metadata only.
- **`polls/sample-demographics.csv`** extended through 29/Jun (**159 rows**; `full_percentages` 15/32 · `mentioned_no_pct` 17/32). Still layer A (sample composition/weighting), not vote-by-demographic crosstabs (layer B, absent from TSE open data).
- **Time-series refreshed:** `data/market-odds-timeseries.csv` (2026-04-04 to 2026-06-29), `data/divergence-timeseries.csv` and `data/poll-divergence.csv` re-paired on the fieldwork midpoint.

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
