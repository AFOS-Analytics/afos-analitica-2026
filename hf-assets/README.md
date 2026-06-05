---
license:
- cc-by-4.0
- apache-2.0
language:
- pt
- en
- es
pretty_name: "AFOS — Brazil 2026 Electoral Divergence"
tags:
- elections
- brazil
- prediction-markets
- polls
- political-risk
- divergence
- civic-tech
- open-data
---

# AFOS — Brazil 2026 Electoral Divergence Dataset

Open, auditable daily dataset that cross-references **prediction markets (Polymarket) × polling institutes (TSE-registered) × press coverage** for Brazil's 2026 presidential cycle, with **explicit divergence** between sources instead of smoothed averages.

Maintained by **[AFOS Analytics](https://afos-analytics.com)** — open-source civic infrastructure for electoral political-risk intelligence. This is the public mirror of the same data the platform serves live, updated daily. The Brazil 2026 cycle is the laboratory; the goal is to apply the same lens across more democracies.

## What's inside

| Path | Content |
|------|---------|
| `data/divergence_timeseries.csv` | Cumulative time series: `date, candidate, polymarket_pct, poll_pct, divergence_pp` |
| `data/divergence_latest.csv` | Latest day's snapshot of the above |
| `snapshots/analysis-criteriosa/{date}.json` | Daily structured analysis (market × poll × press, per candidate) |
| `snapshots/analysis-cards/{date}.json` | Daily thematic cards (sentiment, institutional, macro) |
| `polls/polls-data-{date}.json` | National polls (1st/2nd round) referenced that day |
| `news/news-{date}.json` | Public news **links** (source, title, URL, date) — no article bodies |

Files are **dated and cumulative** (append-only): each day adds new files; past dates are never overwritten. Each daily update is a git commit, so the full history is preserved natively.

## 🔒 No personal data (privacy / LGPD)

This dataset contains **only public electoral data** (market odds, registered polls, news links). It contains **no subscriber data, no emails, no leads, no personal information of any kind**. The export pipeline is database-free by construction and never accesses any user table. Brazil's LGPD and equivalent data-protection principles are respected in full.

## License (dual)

- **Data** (CSVs, JSON snapshots, polls, news links): **Creative Commons Attribution 4.0 International (CC BY 4.0)** — see `LICENSE-CC-BY-4.0`.
- **Code / scripts** (any loader, notebook): **Apache License 2.0** — see `LICENSE-APACHE-2.0`.

Both licenses **require attribution**. If you use this dataset, please credit **AFOS Analytics** and link to https://afos-analytics.com.

## How to cite

> AFOS Analytics. *Brazil 2026 Electoral Divergence Dataset.* Hugging Face, 2026. https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence — CC BY 4.0.

## Sources & method

- **Prediction markets:** Polymarket (live USD-denominated markets).
- **Polls:** institutes registered with Brazil's TSE (public registry).
- **Press:** coordinated clipping of 400+ outlets (primary links preserved).

AFOS flags where the three sources diverge rather than averaging them. Method and full source code (Apache 2.0) at [github.com/AFOS-Analytics](https://github.com/AFOS-Analytics).

## Disclaimer

Observational research on prediction markets, polls and news flow. **Not investment advice and not voting guidance.** Polymarket is a USD-denominated market operating outside Brazilian jurisdiction; figures are informational. AFOS observes the markets — it does not trade them.
