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
