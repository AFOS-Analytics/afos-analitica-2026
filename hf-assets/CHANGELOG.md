# Changelog

All notable changes to this dataset. The data itself is dated and append-only; this log records **structural** changes (new files, schema, coverage).

## 2026-07-30, errata mechanism

### Added
- **`ERRATA.md`** (trilingual). Records known defects in already-published dated files. Policy stated explicitly: **files for closed dates are never rewritten**; the correction is published in the errata instead, so the record stays exactly as distributed and the defect stays discoverable. The file for the *current* date may still be regenerated during the day, since the mirror runs more than once daily.
- **First entry, ERR-2026-001:** `data/divergence-2026-07-29.csv`, row `Renan Santos`, `polymarket_pct` published as `8.6` where the site and the daily synthesis published `8.70%` (`divergence_pp` `0.8` instead of `0.90`). One row of seven on that date; 0.10pp. Cause and prevention documented in `ERRATA.md`.

## 2026-07-12, scope column correction + July coverage

### Fixed
- **`scope` column corrected in `polls/tse-registry.{csv,json}`.** The AFOS scope classifier (an inferred field, not an official TSE field, see DATA_DICTIONARY) matched the national pattern `eleitorado de brasil` without a word boundary, so `eleitorado de BRASILIA` matched as a prefix. **Four MUNICIPAL polls were labelled `national`** in v3.0 and earlier:
  - `BR-06776/2026` Instituto Franca (Brasilia/DF, n=1067)
  - `BR-06037/2026` Instituto de Pesquisas Perfil (Sao Mateus/ES, n=604)
  - `BR-02052/2026` Instituto Vox Brasil (Guarulhos/SP, n=1200)
  - `BR-02113/2026` Lais Cristina R. de Oliveira (Marilia/SP, n=400)
  They are now correctly labelled `state` (municipal is a subset of sub-national in this schema). Three further records moved `unknown` -> `state`.
  **If you filtered on `scope == "national"` using v3.0 or earlier, re-run your filter against this version.** No other column was affected: the underlying TSE text (`methodology`, `sampling_plan`, `municipality_data`) was always correct and is unchanged.

### Added / Updated
- **Registry coverage extended:** `polls/tse-registry.{csv,json}` now **447 presidential registrations** (was 399), reflecting TSE filings through 2026-07-12. National: **80**. State/municipal: **357**. Unknown (no declared universe text): **10**.
- Upstream TSE revisions absorbed: 7 institutes renamed their legal entity, 4 `municipality_data` fields were amended by the pollster.

### Unchanged
- `polls/sample-demographics.csv` (layer A, sample composition/quota frame), `polls/national-polls.json`, all poll-result and time-series files: **byte-identical to v3.0**, verified cell by cell.

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
