/**
 * Metadados do bundle FRANCE 2027 presidential (v1, pré-eleitoral): README (cartão
 * do HF), DATASHEET, CITATION, licenças. Criado 08/Nov/2026.
 *
 * Roda DEPOIS de `build-fr-2027-dataset.mjs`, que gera os dados e o resumo.
 * O CHECKSUMS.txt é regerado no fim, cobrindo dados e metadados.
 *
 * ✍️ Regras de texto da casa: descreve a medição, não defende tese; afirma o que o
 * pacote é, sem pedir licença pelo que ele ainda não é; sem travessão.
 */
import { readFileSync, writeFileSync, readdirSync, copyFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

const ROOT = process.cwd()
const OUT = process.env.FR2027_OUT || join(ROOT, '.cache', 'fr2027-dataset')
const R = JSON.parse(readFileSync(join(OUT, 'data', 'fr-2027-case-summary.json'), 'utf-8'))
const VERSAO = '1.0.0'
const REPO = 'AFOS-Analytics1/france-2027-presidential-divergence'
const P = R.polls

copyFileSync(join(ROOT, 'hf-assets', 'fr-2027', 'LICENSE-MieuxVoter-polls.txt'), join(OUT, 'polls', 'LICENSE-MieuxVoter.txt'))

const linhaMercado = (m) => `| \`${m.file}\` | \`${m.slug}\` | ${m.type} | ${m.rows} | ${m.snapshots} | ${m.from?.slice(0, 16) ?? '-'} | ${m.to?.slice(0, 16) ?? '-'} |`
const totalMercado = R.markets.books.reduce((a, m) => a + m.rows, 0)

const yaml = `---
license: cc-by-4.0
language:
- en
- fr
pretty_name: AFOS France 2027 Presidential, prediction market and polls side by side
tags:
- elections
- france
- prediction-markets
- polymarket
- opinion-polls
- political-risk
- forecasting
size_categories:
- 1K<n<10K
configs:
- config_name: winner
  data_files: data/winner.csv
- config_name: advance_to_runoff
  data_files: data/advance-to-runoff.csv
- config_name: first_round_winner
  data_files: data/first-round-winner.csv
- config_name: on_the_ballot
  data_files: data/on-the-ballot.csv
- config_name: voting_intentions
  data_files: polls/fr-voting-intentions.csv
- config_name: press
  data_files: press/fr-press-timeline.csv
---
`

const corpo = `# AFOS France 2027 Presidential: prediction market and polls, side by side

Every price and every poll in this bundle was recorded **before the vote**. The first round is on **18 April 2027** and the runoff on **2 May 2027**. The official result lands in a later version, so anyone can check both instruments against it without taking our word for anything.

Live panel: [afos-analytics.com/en/dashboard/fr](https://www.afos-analytics.com/en/dashboard/fr) · Version ${VERSAO}

## What is inside

| part | content |
|---|---|
| **Market** | ${totalMercado} price observations from Polymarket in 4 books, from ${R.markets.series_starts_utc.slice(0, 16)} UTC |
| **Polls** | ${P.lists} voting-intention lists; ${P.publishable_lists} of them pass the official-notice check, from ${P.pollsters} pollsters, fieldwork ${P.fieldwork_from} to ${P.fieldwork_to}: ${P.first_round_lists} first-round lists and ${P.runoff_matchups} runoff matchups |
| **Press** | ${R.press.rows} headlines from a fixed list of ${R.press.outlets_on_list} French outlets, in ${R.press.daily_records} daily ${R.press.daily_records === 1 ? "record" : "records"} |
| **Reference** | pollster table: 2022 first-round error against the official result, and formal actions by the Commission des sondages |

### Market books

| file | Polymarket event | type | rows | snapshots | first (UTC) | last (UTC) |
|---|---|---|---|---|---|---|
${R.markets.books.map(linhaMercado).join('\n')}

- **mutually-exclusive**: only one outcome happens (who wins the election, who tops the first round).
- **independent-binary**: each contract is its own yes/no question (who advances to the runoff, who is on the ballot); prices do not add up to 100.
- \`price_pct\` is the implied probability in points from 0 to 100. \`volume_usd\` is cumulative traded volume of the contract since it opened, not money at stake today.
- A snapshot is stored when any contract of the book moves 0.5 points or more (checked at most once an hour), with a forced snapshot every 4 hours. A book that does not move has few snapshots, and that is a measurement too.
- Placeholder contracts listed by the exchange before a candidate exists ("Candidate A") are not prices and are left out.

### Polls

\`polls/fr-voting-intentions.csv\` has one row per candidate per list. Each list is checked against the official notice listing of the **Commission des sondages** (tag 2027-Présidentielle): the notice number must exist and name the same pollster. \`notice_check\` says the outcome (\`matches\`, \`mismatch\`, \`no-notice-cited\`, \`not-on-2027-listing\`), and \`publishable\` is true only when the notice matches and the list sums to 97 to 103. Lists that fail stay in the file, flagged, and are listed with the reason in \`polls/fr-notice-mismatches.csv\`. \`polls/fr-pending-notices.csv\` lists official notices with voting intentions that the source has not structured yet.

Poll figures come from the open dataset [MieuxVoter/presidentielle2027](https://github.com/MieuxVoter/presidentielle2027) (MIT License, copyright 2025 Mieux Voter; the notice is in \`polls/LICENSE-MieuxVoter.txt\`). AFOS adds the notice check and the English columns; no poll number is typed by hand.

### Press

\`press/fr-press-timeline.csv\` holds headline, outlet, publication time and link, nothing else. The outlet list is fixed (\`press/fr-outlet-list.csv\`) and carries no political label.

## What this bundle does not do

- It does not subtract a market price from a poll number. The market pays on **winning the election**; a poll measures **first-round voting intention**. They are different quantities, and the difference would have no unit.
- It does not average polls from an aggregator. The panel shows a simple average per candidate with the number of lists behind it; this bundle gives the lists themselves.
- It does not filter what fails a check: it flags it and says why.

## Files

- \`data/*.csv\` market series · \`data/fr-2027-case-summary.json\` counts of this build
- \`polls/\` voting intentions, notice checks, pending notices, MIT notice
- \`press/\` headline timeline and the outlet list
- \`raw/\` the records exactly as AFOS stored them (field names in Portuguese)
- \`reference/pollsters.json\` the pollster table of the live panel (field names in Portuguese)
- \`CHECKSUMS.txt\` SHA-256 of every file

## Reproducibility

The bundle is built from the daily backup of the AFOS database that is versioned in the public repository [AFOS-Analytics/afos-analitica-2026](https://github.com/AFOS-Analytics/afos-analitica-2026) (\`backup/neon/\`), with \`scripts/build-fr-2027-dataset.mjs\` and \`scripts/build-fr-2027-metadata.mjs\`. No live API is read at build time.

## Licenses

Data: **CC BY 4.0**. Poll figures: MIT, from Mieux Voter (see above). Code in the repository: Apache 2.0. Nothing here is an invitation to bet.

## Citation

\`\`\`
AFOS Analytics (2026). AFOS France 2027 Presidential: prediction market and polls, side by side (v${VERSAO}).
Hugging Face. https://huggingface.co/datasets/${REPO}
\`\`\`
`
writeFileSync(join(OUT, 'README.md'), yaml + '\n' + corpo)

writeFileSync(join(OUT, 'DATASHEET.md'), `# Datasheet: AFOS France 2027 Presidential (v${VERSAO})

**Motivation.** To keep, side by side and on the record before the vote, what prediction markets and published polls said about the 2027 French presidential election. They are different quantities; the useful fact is where and when they disagree.

**Creator.** AFOS Analytics (afos-analytics.com).

**Composition.** ${totalMercado} Polymarket price observations in 4 books; ${P.lists} poll lists (${P.publishable_lists} publishable) from ${P.pollsters} pollsters; ${R.press.rows} press headlines from ${R.press.outlets_on_list} outlets. Election: first round 2027-04-18, runoff 2027-05-02. Official result: not yet available (status: ${R.status}).

**Collection.** Polymarket public prices read every 30 minutes by the AFOS server, stored on movement of 0.5 points or a 4-hour heartbeat. Polls collected twice a day from the Mieux Voter open dataset and checked list by list against the Commission des sondages notice listing. Press collected three times a day from RSS feeds of a fixed outlet list.

**Preprocessing.** Placeholder contracts removed; market series starts ${R.markets.series_starts_utc}. Poll lists failing the notice check are kept and flagged. Column names and check labels translated to English; raw records kept as stored.

**Uses.** Research on prediction markets, polling and political risk. Not betting advice.

**Distribution.** Hugging Face, CC BY 4.0 (poll figures MIT).

**Maintenance.** Updated by AFOS Analytics; the result version follows the official count.
`)

writeFileSync(join(OUT, 'CITATION.cff'), `cff-version: 1.2.0
title: "AFOS France 2027 Presidential: prediction market and polls, side by side"
version: "${VERSAO}"
type: dataset
authors:
  - name: "AFOS Analytics"
url: "https://huggingface.co/datasets/${REPO}"
license: CC-BY-4.0
`)

const lista = (dir, base = '') => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? lista(join(dir, d.name), join(base, d.name)) : [join(base, d.name)])
const arquivos = lista(OUT).filter((f) => f !== 'CHECKSUMS.txt').sort()
writeFileSync(join(OUT, 'CHECKSUMS.txt'), arquivos.map((f) =>
  `${createHash('sha256').update(readFileSync(join(OUT, f))).digest('hex')}  ${f.replace(/\\/g, '/')}`).join('\n') + '\n')
console.log('metadados ok:', arquivos.length, 'arquivos com checksum; repo', REPO)
