# Datasheet: Brazil 2026 Electoral Divergence Dataset

Following *Datasheets for Datasets* (Gebru et al., 2021; arXiv:1803.09010). Part of the AFOS Analytics collection, cross-referencing prediction market, opinion polls and press coverage against the official result.

**Status: closed.** Brazil's 2026 presidential election ended with the runoff of 2026-10-25, and the TSE declared Luiz Inácio Lula da Silva elected with 51.79% of valid votes against 48.21% for Flávio Bolsonaro. The daily mirror that fed this dataset was switched off on **2026-11-01**, and no files are added after that date. Corrections, if any, are published in `ERRATA.md` and never by rewriting a file in silence.

## 1. Motivation
Created by AFOS Analytics (independent, self-funded, no client work) to document, in an auditable form, the divergence between prediction markets, opinion polls and press coverage during a national election. The premise is that when real money and declared intention disagree, the distance between them is information about electoral risk, and that averaging the two away destroys the signal. Intended for research on market-versus-poll calibration, for teaching, and for replication of the AFOS divergence method.

## 2. Composition
Several observational units, each in its own table.

- **Polls.** `polls/tse-registry.csv` and `.json` carry the official TSE registration sheet of every presidential poll filed for 2026. `polls/national-poll-results-firstround.csv` and `polls/national-poll-results-secondround.csv` hold published results in long format, one row per candidate, scenario and poll, each carrying its TSE registration number. `polls/national-polls.json` holds the full structured polls with methodology. `polls/sample-demographics.csv` holds the declared sample-design quotas.
- **Market.** `data/market-odds-timeseries.csv` holds the daily Polymarket presidential prices per candidate, with volume. The series begins on 2026-04-17; the daily analysis snapshots begin on 2026-04-04.
- **Divergence.** `data/divergence-timeseries.csv` and `data/poll-divergence.csv` pair each poll with the market, keeping both raw values side by side. `data/divergence-daily-timeseries.csv` is the same comparison by day of market capture.
- **Official result.** `results/` holds the final TSE tally of both rounds (JSON and CSV), and a retrospective of what each instrument said on the eve of each round.
- **Election nights.** `election-night/` holds each AFOS edition during the count of both rounds and, for the runoff night, the trades and the largest holders of the two winner contracts, with wallets anonymized (labels `A1` upward; no address, username or transaction hash).
- **Closing report.** `final-report/` holds the AFOS closing report in Portuguese, English and Spanish (version 1.1, cutoff 2026-10-31) and the frozen version 1.0.
- **Daily snapshots.** `data/divergence-{date}.csv`, `polls/polls-data-{date}.json`, `snapshots/analysis-criteriosa/{date}.json` and `snapshots/analysis-cards/{date}.json` preserve the state of each day as it was published.
- **Press.** `news/news-{date}.json` carries links only: source, headline, URL and date. No article body is reproduced.

Columns are enumerated per file in `DATA_DICTIONARY.md`. Values are transcribed from public primary sources; nothing is imputed and nothing is smoothed. Where a number is missing it is left missing.

**Personal data.** Polls enter as published aggregates. The demographic file describes the declared composition of each sample, never individual respondents. The CPF of the statisticians named in the TSE registry is removed before publication. Polymarket wallets are anonymized.

## 3. Collection process
- **Polls:** the official TSE Open Data registry (https://dadosabertos.tse.jus.br), plus the results as published by each named institute. Every row carries its TSE registration number, so any figure can be traced back to the filing.
- **Market:** Polymarket, read every 30 minutes from its public API through the AFOS server, and, for the runoff night, from the public trade feed.
- **Official result:** the TSE result files of each round (election 6257 for the first round, 6258 for the runoff).
- **Press:** links collected as references, never as content.
- Collection was automated and ran daily from 2026-04-04 to 2026-11-01; each run appended a dated snapshot rather than replacing the previous one.

**Registered is not published.** A poll filed with the TSE does not mean its numbers were released. Results enter this dataset only once the institute publishes them.

## 4. Preprocessing / cleaning
Poll and market series are emitted in tidy long format. Nothing is smoothed except where a column is explicitly labelled as an average. Daily files are append-only: a correction produces a new dated file or an errata entry, it does not rewrite an old file.

## 5. Uses
Supports market-versus-poll calibration research, teaching, and replication of the AFOS method, now with the official result of both rounds to score against. It should not be read as a forecast, as a causal claim, or as an official tally.

## 6. Distribution
Hugging Face Hub (https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence) and the Harvard Dataverse under the DOI [10.7910/DVN/2D0UK7](https://doi.org/10.7910/DVN/2D0UK7). **Dual licence:** data under CC BY 4.0, code and scripts under Apache 2.0. Both require attribution to AFOS Analytics.

**Polymarket data.** Prices, volumes and trades were read by AFOS from Polymarket's public API and from the public Polygon blockchain. AFOS is not affiliated with Polymarket. Polymarket's Terms of Use (version effective 2026-08-11, https://polymarket.com/tos) restrict access to and redistribution of its data, including derived, aggregated or anonymized data, for capital-market firms and market-data distributors unless agreed in writing with Polymarket. Users in those categories should check those terms before using the Polymarket-derived files. The TSE files are Brazilian public open data, and the press layer carries links rather than text.

## 7. Maintenance and integrity
Maintained by AFOS Analytics (afos-analytics.com). Country ISO3: BRA. Election: national presidential, 2026, first round 2026-10-04, runoff 2026-10-25.

- `CHECKSUMS.txt` lists the SHA-256 of every published file, generated from the published tree itself.
- `datapackage.json` (Frictionless) and `croissant.json` (MLCommons Croissant 1.0) describe every final table and the report PDFs, each with its SHA-256; the package passes `frictionless validate`. The two descriptors are not listed in `CHECKSUMS.txt`, by the convention of this collection.
- `CHANGELOG.md` records structural changes; `ERRATA.md` records every correction to a published number, in English, Portuguese and Spanish.

## 8. Limitations
- **Different quantities.** A prediction market prices the probability of winning; a poll measures vote share. Both divergence files keep the two raw values side by side and label the naive difference `naive_winprob_minus_voteshare`. It is a diagnostic of tension between instruments, not a measurement error.
- **One market.** The market side is Polymarket only. The Brazilian presidential market is dollar-denominated and traded outside Brazil; its participants are not the Brazilian electorate.
- **Total votes and valid votes.** Polls of the runoff are recorded in total votes; the official result is in valid votes. The retrospective files declare the base of each figure.
- **Market series history.** Between 2026-09-03 and 2026-10-05 some published versions of the market series were shorter than the full series (ERR-2026-005). The current files carry the full series, and a gate now blocks a shorter series from being published.
- **Demographic depth.** Only sample-design demographics are included; vote-by-demographic crosstabs are not, because they are not uniformly published.
- **Election nights.** The runoff-night trades are those received by the AFOS collector, not a full on-chain reconstruction.
