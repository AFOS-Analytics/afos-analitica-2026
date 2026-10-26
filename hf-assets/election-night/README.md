# Election night, Brazil 2026 first round (October 4, 2026)

One row per edition AFOS produced during the count: three hourly partial editions and the final one. Each row pairs the official TSE presidential tally that the edition used with the Polymarket reading that the edition published.

| column | meaning |
|---|---|
| edition | edition label (BRT time) |
| tse_tally_time_brt | timestamp of the official TSE presidential tally file (election 6257, `br-c0001-e006257-u.json`) |
| tse_sections_tallied_pct | share of polling sections tallied |
| tse_mathematically_defined | TSE flag that the first-round outcome was mathematically defined |
| tse_turnout_pct | turnout among tallied sections |
| valid_* | share of valid votes per candidate, in percent |
| market_reading_utc | timestamp of the Polymarket reading the edition published |
| market_books_confirmed | books confirmed by two independent readings 8 minutes apart within 0.20pp |
| winner_price_* | price in the "Brazil presidential election" winner contract, in percent; the same confirmed reading can repeat across editions when later readings of that book did not confirm |
| preview_dashboard, preview_daily | immutable Vercel preview of the dashboard and of the AFOS Daily at that hour |

The final edition was published at afos-analytics.com. The raw files for every edition (TSE tally, market reading, dashboard JSON, daily markdown) are kept in the AFOS repository under `data/brz/noite-1turno-2026/`. Two previews that were replaced (a failed build and a dashboard left with an older tally) are recorded there as discarded and are not rows here.

# Election night, Brazil 2026 second round (October 25, 2026)

A different shape from the first round: instead of one row per AFOS edition, the second-round night was recorded by a collector that read the official tally and the market every three minutes, and the trades in the winner contracts every minute. Lula was elected with 51.79% of valid votes (TSE final tally, 23:27:02 Brasília).

| file | rows | content |
|---|---|---|
| `second-round-2026-live.csv` · `.jsonl` | 87 | one row per collector reading, from 19:35 to 23:56 Brasília: the TSE presidential tally of the moment (election 6258, `br-c0001-e006258-u.json`) and the Polymarket winner-contract price and cumulative volume at the same minute |
| `second-round-2026-trades.csv` | 24,784 | every trade the collector received in the two winner contracts ("Will Lula win" and "Will Flávio Bolsonaro win"), with the wallet anonymized |
| `second-round-2026-holders.csv` | 16,640 | the 20 largest holders of each side of each contract, about once a minute, with the wallet anonymized |

Columns of `second-round-2026-live`:

| column | meaning |
|---|---|
| collected_at_utc | when the collector read both sources |
| tse_tally_time_brt | timestamp of the TSE tally file (Brasília) |
| tse_sections_tallied, tse_sections_tallied_pct | polling sections tallied, count and percent |
| tse_mathematically_defined | TSE flag that the outcome was mathematically defined; empty when the file did not carry the flag |
| tse_final | TSE flag that the tally was final |
| valid_*, votes_* | share of valid votes in percent, and votes, per candidate |
| valid_votes, blank_pct, null_pct, abstention_pct | as published in the TSE file at that moment |
| market_reading_utc | timestamp of the Polymarket reading |
| winner_price_*, winner_volume_usd_* | price (percent) and cumulative volume (USD) of each candidate in the "Brazil presidential election" winner contract |
| market_confirmation | always `single reading`: these prices were not confirmed by the two-reading check AFOS applies to published prices |

Columns of `second-round-2026-trades.csv`: `timestamp_utc`, `contract` (`lula` or `flavio_bolsonaro`), `outcome` (`Yes` or `No` of that contract), `side` (`BUY` or `SELL`), `shares`, `price` (0 to 1), `notional_usd` (shares times price), `wallet`, `coverage`.

Columns of `second-round-2026-holders.csv`: `fetched_at_utc`, `contract`, `outcome`, `rank` (1 to 20 by shares), `wallet`, `shares`.

Notes:

- **Wallets are anonymized.** Addresses, usernames, display names, profile data and transaction hashes are not published. Each wallet is a label from `A1` upward, ordered by the money it traded during the night across both contracts; wallets that only appear among the holders come after, ordered by their largest position. The same label is the same wallet in both files.
- **Coverage.** Trades are read from the Polymarket trades feed, which serves the most recent trades first. The collection became complete when it started paging back until it overlapped what it already had, at 23:48 UTC, with an initial sweep that reached 23:15:26 UTC in the Lula contract and 23:26:32 UTC in the Flávio Bolsonaro contract. From those times on `coverage` is `complete`; before them it is `partial` (20:01 to 20:26 Brasília), and trades may be missing.
- `notional_usd` summed over this file is not the increase in the contract's cumulative volume: the two follow different conventions, and the earliest trades are partial.
- The raw collector files are kept outside the public repository, because they carry wallet identities. Build script: `scripts/build-hf-noite-2turno.mjs`.
