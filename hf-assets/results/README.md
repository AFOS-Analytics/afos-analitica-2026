# Official result, Brazil 2026 presidential election

The official tally that every market price and every poll in this dataset is measured against. The first round (October 4, 2026) is here; the second round (October 25, 2026) will be added in the same format, as `second-round-2026-*`, once the TSE publishes its final tally.

Every number comes from a TSE primary source, and the raw files are kept in the AFOS repository under `data/brz/resultado-oficial-2026/`:

- **Tally:** the final presidential tally file, `br-c0001-e006257-u.json`, with 100% of polling sections, generated on 2026-10-05 at 12:51:47 (Brasília). The panel card "Totalização do TSE" reads the same numbers, and the build script aborts if card and file disagree on any of them.
- **Voting machines:** the TSE document "Números gerais, coletiva das 21h" of 2026-10-04, section "Urnas e seções".

| file | content |
|---|---|
| `first-round-2026-official.json` | everything in one file: sections, electorate, turnout, abstention, valid, blank and null votes, the twelve candidates with votes, percentages, party and coalition, the voting-machine figures, sources and notes |
| `first-round-2026-candidates.csv` | one row per candidate: `rank, number, name, ballot_name, party, coalition, coalition_parties, votes, pct_valid, status` (`status` is the TSE label, kept in Portuguese: "2º turno" for the two runoff candidates, "Não eleito" for the others) |
| `first-round-2026-summary.csv` | one row per figure: `metric, value, pct, pct_base, source`, where `pct_base` names the denominator of each percentage |
| `first-round-2026-retrospective.csv` | what each instrument said on the eve of the vote, one row per item: the nine national polls released on 2026-10-03 and the four Polymarket books, with the eve value, its rank and whether it matched the outcome |
| `first-round-2026-retrospective-summary.csv` | the same panel card ("What each instrument said on the eve") one row per instrument: the eve summary, the outcome, whether it matched (`yes`, `no`, `open`), and for the polls the count of houses with each leader, the range of margins, whether the majority of houses had the winner ahead and whether the range contained the count |

Notes:

- Market prices in the retrospective are the last point recorded on 2026-10-03, read from the daily backup of the AFOS database and not from the live interface.
- Candidate percentages are over valid votes; blank and null are over votes cast; turnout and abstention are over the electorate.
- `other_names_votes` sums the seven candidates below fifth place by votes. Subtracting the five rounded percentages from 100 would give 0.50 instead of 0.49.
- Replaced voting machines: 1,904, which is 0.35% of all 549,286 machines (in use plus backup), the same base the TSE uses. Over the 499,248 machines in use it would be 0.38%. According to the TSE, the replacements, mostly caused by power fluctuations, did not affect votes already recorded. "Replaced" is the TSE term; the TSE does not publish a count of "defective" machines. No section voted on paper.
- In the retrospective, poll rows give the margin in points (Flávio Bolsonaro minus Lula, total votes) and `item_is_outcome` is `true` when the house had the same leader as the count. Polls measure total votes and the count reports valid votes, so the comparison is of order and direction, not of size. Market rows give the price in percent and `item_is_outcome` is `true` for the item that won; the winner contract stays open until the runoff.
