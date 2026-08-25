/**
 * Metadados do bundle US 2026 midterms (v1 pré-eleitoral): DATASHEET, dicionário,
 * README, datapackage (Frictionless), croissant, CITATION e licenças.
 *
 * Roda DEPOIS de `build-us-2026-dataset.mjs`, que gera os dados e o resumo.
 * O CHECKSUMS.txt é regerado no fim, cobrindo dados e metadados.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

const ROOT = process.cwd()
const OUT = process.env.US2026_OUT || join(ROOT, '.cache', 'us2026-dataset')
const resumo = JSON.parse(readFileSync(join(OUT, 'data', 'us-2026-case-summary.json'), 'utf-8'))

const VERSAO = '1.0.0'
const REPO = 'AFOS-Analytics1/usa-2026-midterms-divergence'

// ── resultado VERIFICADO da unica corrida ja decidida no bundle ─────────────────
mkdirSync(join(OUT, 'raw'), { recursive: true })
writeFileSync(
  join(OUT, 'raw', 'us-2026-texas-senate-primary-result.json'),
  JSON.stringify(
    {
      race: 'Texas U.S. Senate — Republican primary runoff',
      election_date: '2026-05-26',
      winner: 'Ken Paxton',
      winner_vote_share_pct: 63.8,
      loser: 'John Cornyn',
      total_votes_reported: '>1,380,000',
      note:
        'Runoff. Paxton faces Democrat James Talarico in the November 3 general election. ' +
        'This is the only race in this bundle with a decided outcome; the general election has not happened.',
      sources: [
        'https://www.texastribune.org/2026/05/26/texas-john-cornyn-ken-paxton-us-senate-republican-primary-runoff/',
        'https://www.pbs.org/newshour/politics/live-results-texas-midterm-primary-runoffs',
        'https://www.aljazeera.com/news/2026/5/27/ken-paxton-wins-texas-primary-election-results-and-key-takeaways',
        'https://www.cnbc.com/2026/05/26/texas-primary-election-senate-paxton-cornyn.html',
      ],
      verified_by: 'AFOS Analytics, cross-checked across four independent outlets',
    },
    null,
    2
  )
)

const mercadoLinhas = resumo.markets.reduce((a, m) => a + m.rows, 0)
const linha = (m) => `| \`${m.slug}\` | ${m.type} | ${m.rows} | ${m.from || '—'} | ${m.to || '—'} |`

// ── DATASHEET (Gebru et al.) ───────────────────────────────────────────────────
writeFileSync(join(OUT, 'DATASHEET.md'), `# Datasheet — AFOS US 2026 Midterms Divergence (v${VERSAO})

## Motivation

**For what purpose was the dataset created?** To make auditable, side by side, what two instruments said about the same election before it happened: **prediction market prices** and **published opinion polls**. The AFOS thesis is that these are different quantities that must not be subtracted, and that the informative fact is *where and when they disagree*.

**Who created it?** AFOS Analytics (afos-analytics.com).

## ⚠️ Status: PRE-ELECTORAL. This is not the gold-standard version.

The 2026 US midterms are held on **November 3, 2026**. Every AFOS country bundle that reaches gold standard carries an \`official-result.json\` and validates the divergence against the certified outcome. **This bundle cannot, because the election has not happened.**

What it does carry is **one race already decided**: the Texas Republican Senate primary runoff of May 26, 2026, in \`raw/us-2026-texas-senate-primary-result.json\`, with 409 price points covering it. That is a validation case, not the validation.

**v2, after certification, closes the cycle.** Until then, treat every market series here as a forecast with no scored outcome.

## Composition

| Layer | Content |
|---|---|
| \`polls/us-generic-ballot.csv\` | **${resumo.polls.rows} national generic-ballot polls**, ${resumo.polls.pollsters} pollsters, fieldwork ${resumo.polls.fieldwork_from} to ${resumo.polls.fieldwork_to}. ${resumo.polls.with_primary_source} of ${resumo.polls.rows} rows carry a primary source URL |
| \`data/*.csv\` | **${mercadoLinhas} market price rows** across ${resumo.markets.length} Polymarket contracts |
| \`press/us-press-timeline.csv\` | ${resumo.press.rows} headlines from ${resumo.press.collections} daily collections, fixed outlet list |
| \`raw/\` | inputs as collected, plus the Texas primary result |

### Markets

| slug | type | rows | from | to |
|---|---|---|---|---|
${resumo.markets.map(linha).join('\n')}

**\`binario\`** contracts price the probability of an outcome; the two sides sum to about 100. **\`faixa\`** contracts are distributions over buckets of seats, turnout or vote margin.

⚠️ **Distribution coherence is published, not filtered.** \`data/distribution-coherence.csv\` gives, for every snapshot, the sum of a distribution's buckets and whether it falls inside the 95–105% band that the AFOS panel requires before showing a distribution on screen. **The house popular-vote-margin market fails that gate persistently** and is collected anyway, because a failing instrument is still a measurement and hiding it would misrepresent the record.

## Collection process

- **Market:** Polymarket, via the AFOS server-side proxy, snapshotted to Postgres every 30 minutes by cron and exported here from the versioned daily database backup. **Use the backup, not the public history API:** that API caps at 90 days, which silently hid six weeks of the Senate series.
- **Polls:** the aggregating Wikipedia page is an **index**, never the source. Every row keeps the pollster's own \`source_url\` where it exists. A deterministic reader (\`lib/us-polls/collect.mjs\`) resolves \`rowspan\` by column index, after a 2026-08-01 defect in which a shifted column published a sample size as a vote intention.
- **Press:** a fixed list of 23 outlets chosen on 2026-07-30, each with a declared role, at most two items per outlet per collection. The collector does not summarise, interpret or rank by relevance. ⛔ **No political-leaning label is attached to any outlet**, a field removed on 2026-08-01 because the rating was ours, unsourced, and disagreed with AllSides in 13 of 22 cases in both directions.

## Uses

**Suitable for:** studying market–poll divergence over time; pollster dispersion; whether prices move before, with or after published polls; the calibration of a resolved primary.

⛔ **Not suitable for:** subtracting a market probability from a poll margin. They are different quantities. A party can win the popular vote and lose the chamber, as Democrats did in 2012, and the difference may be entirely geography.

⚠️ **Aggregators are excluded from the poll layer by design.** An average of averages is not a measurement.

## Distribution and maintenance

Mirrored to Hugging Face. Rebuilt by \`scripts/build-us-2026-dataset.mjs\`, which reads only files versioned in the repository. Errors in a closed date are corrected by **erratum**, never by silent rewrite.

## License

Data under CC BY 4.0. Code under Apache 2.0. Polymarket and the pollsters retain their own terms over the underlying material.
`)

// ── DATA DICTIONARY ────────────────────────────────────────────────────────────
writeFileSync(join(OUT, 'DATA_DICTIONARY.md'), `# Data dictionary

## \`polls/us-generic-ballot.csv\`

| column | type | description |
|---|---|---|
| \`fieldwork_start\` | date | first day in the field, ISO 8601 |
| \`fieldwork_end\` | date | last day in the field. **Sort on this, not on the release date** |
| \`pollster\` | string | institute, as published |
| \`sample_size\` | integer | interviews |
| \`sample_type\` | string | \`LV\` likely voters · \`RV\` registered voters · \`A\` adults. **Not comparable across types** |
| \`margin_of_error\` | number | percentage points, as declared by the institute |
| \`dem_pct\` | number | Democratic share |
| \`rep_pct\` | number | Republican share |
| \`other_pct\` | number | other or undecided, when published |
| \`dem_margin\` | number | \`dem_pct − rep_pct\`. Positive favours Democrats |
| \`source_url\` | string | the institute's own report where available; empty where the aggregator carried no link |

📌 **The soundest integrity check is the sum.** In a well-read row, \`dem + rep + other\` lands near 100. A sum far from it is the signature of a shifted column at the source, and it catches errors that a plausibility range cannot.

## \`data/<market>.csv\`

| column | type | description |
|---|---|---|
| \`snapshot_at_utc\` | datetime | capture instant, UTC |
| \`market_slug\` | string | Polymarket contract |
| \`market_type\` | string | \`binario\` or \`faixa\` |
| \`outcome_name\` | string | outcome as the book names it |
| \`outcome_key\` | string | stable key for the outcome |
| \`price_pct\` | number | implied probability, 0–100 |
| \`volume_usd\` | number | cumulative notional traded since the contract opened |

⚠️ **\`outcome_name\` repeats across chambers.** House and Senate both label their sides \`Democratas\` and \`Republicanos\`. **Always filter by \`market_slug\`**; joining on the name alone glues two different contracts into one series that looks perfectly legitimate.

⚠️ **Volume is cumulative, not per period.** It only grows. A smaller value later means the row is stale, not that trading fell.

⛔ **Book depth (liquidity) is deliberately absent.** Low depth on Polymarket does not mean a wrong price, and publishing the figure invites the misreading that the market is broken when it is being arbitraged.

## \`data/distribution-coherence.csv\`

| column | type | description |
|---|---|---|
| \`snapshot_at_utc\` | datetime | capture instant |
| \`market_slug\` | string | the distribution contract |
| \`sum_of_buckets_pct\` | number | sum of all bucket prices at that instant |
| \`passes_95_105_gate\` | boolean | whether the sum falls within the band the AFOS panel requires |

## \`press/us-press-timeline.csv\`

| column | type | description |
|---|---|---|
| \`collected_on\` | date | collection day |
| \`outlet\` | string | outlet, from the fixed list |
| \`headline\` | string | headline as published. **Never rewritten by AFOS** |
| \`published_at\` | datetime | as declared by the feed, when present |
| \`link_origin\` | string | \`feed\` own RSS with a canonical URL · \`google\` aggregator redirect |
| \`track\` | string | \`disputa\` the race · \`metodo\` the instrument itself |
| \`url\` | string | link |
`)

// ── README ─────────────────────────────────────────────────────────────────────
// As 12 tabelas, declaradas. A primeira e a default da pagina, e por isso e a
// camada de pesquisas: e a mais forte do bundle.
const TABELAS = [
  ['generic_ballot', 'polls/us-generic-ballot.csv'],
  ['house_control', 'data/house-control.csv'],
  ['senate_control', 'data/senate-control.csv'],
  ['election_as_scheduled', 'data/election-as-scheduled.csv'],
  ['house_seats_distribution', 'data/house-seats-distribution.csv'],
  ['senate_seats_distribution', 'data/senate-seats-distribution.csv'],
  ['governors_distribution', 'data/governors-distribution.csv'],
  ['turnout_distribution', 'data/turnout-distribution.csv'],
  ['popular_vote_margin_distribution', 'data/popular-vote-margin-distribution.csv'],
  ['texas_senate_primary', 'data/texas-senate-primary.csv'],
  ['distribution_coherence', 'data/distribution-coherence.csv'],
  ['press_timeline', 'press/us-press-timeline.csv'],
]
const yamlConfigs = TABELAS.map(
  ([nome, caminho]) =>
    `  - config_name: ${nome}\n    data_files:\n      - split: train\n        path: ${caminho}`
).join('\n')

writeFileSync(join(OUT, 'README.md'), `---
license: cc-by-4.0
language: [en, pt, es]
tags: [elections, prediction-markets, polling, united-states, midterms-2026, divergence]
configs:
${yamlConfigs}
---

![AFOS — US 2026 Midterms Divergence](banner.png)

# AFOS — US 2026 Midterms Divergence (v${VERSAO}, pre-electoral)

[![Harvard Dataverse DOI](https://img.shields.io/badge/Harvard%20Dataverse-10.7910%2FDVN%2FXRUT8U-a51c30)](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/XRUT8U)

What the **market** priced and what the **polls** measured about the same election, day by day, before it happened.

> ⚠️ **Pre-electoral bundle.** The election is on **November 3, 2026**. There is no certified result to score these forecasts against, so this is **not** the gold-standard version. See \`DATASHEET.md\`. The v2, after certification, closes the cycle.

## What is inside

- **${resumo.polls.rows} national generic-ballot polls** from **${resumo.polls.pollsters} pollsters**, fieldwork **${resumo.polls.fieldwork_from} → ${resumo.polls.fieldwork_to}**, ${resumo.polls.with_primary_source} of them with the institute's own source URL
- **${mercadoLinhas} market price rows** across **${resumo.markets.length} Polymarket contracts**: chamber control, seat distributions, turnout, popular-vote margin, and whether the election happens on schedule
- **${resumo.press.rows} headlines** from ${resumo.press.collections} daily collections over a fixed list of 23 outlets
- One **already decided race** with its verified outcome: the Texas Republican Senate primary runoff

## The one case that is already scored

The Texas Senate Republican runoff resolved on **May 26, 2026**. **Ken Paxton beat John Cornyn with 63.8%** of more than 1.38 million votes.

The market had priced Paxton between **57% and 62%** for five straight weeks, then moved to **94.5% on May 21**, five days before the vote. The price was a probability and the result is a vote share, so the two are not the same quantity and do not subtract. What the series does let you ask is a real question: was the pre-jump price well calibrated, and what moved on May 21.

## How to read it without making the classic mistake

⛔ **Do not subtract a market probability from a poll margin.** One is the chance of controlling a chamber; the other is a lead in vote points. In 2012 Democrats won more votes and fewer seats, and the gap can be entirely geography.

⚠️ **Filter by \`market_slug\`.** House and Senate name their outcomes identically.

⚠️ **Do not compare \`LV\`, \`RV\` and \`A\` samples as if they were one series.**

## Reproducing

\`\`\`bash
node scripts/build-us-2026-dataset.mjs    # data
node scripts/build-us-2026-metadata.mjs   # datasheet, dictionary, package, checksums
\`\`\`

Both read only files versioned in the AFOS repository. \`CHECKSUMS.txt\` carries SHA-256 for every file.

## Citation

See \`CITATION.cff\`. Harvard Dataverse DOI: **[10.7910/DVN/XRUT8U](https://doi.org/10.7910/DVN/XRUT8U)**. Cite: *Felipe, Andre, 2026, "AFOS · USA 2026 Midterms Electoral Divergence Dataset (v1, pre-electoral)", https://doi.org/10.7910/DVN/XRUT8U, Harvard Dataverse.*

⚠️ The citation above names NO version number on purpose: the DOI resolves to the latest release, and a hard-coded version goes stale the next time any file changes.

Data CC BY 4.0, code Apache 2.0.
`)

// ── datapackage (Frictionless), com schema DECLARADO ───────────────────────────
// Declarado e nao inferido de proposito: a inferencia tipa `dem_pct` como
// `integer` porque hoje nenhuma linha tem decimal, e a primeira pesquisa que
// publicar 47,5% quebraria o schema ja publicado. Percentual e `number`.
const SCHEMA_MERCADO = {
  fields: [
    { name: 'snapshot_at_utc', type: 'datetime', description: 'capture instant, UTC' },
    { name: 'market_slug', type: 'string', description: 'Polymarket contract' },
    { name: 'market_type', type: 'string', constraints: { enum: ['binario', 'faixa'] } },
    { name: 'outcome_name', type: 'string', description: 'outcome as the book names it; repeats across chambers' },
    { name: 'outcome_key', type: 'string' },
    { name: 'price_pct', type: 'number', description: 'implied probability, 0-100' },
    { name: 'volume_usd', type: 'number', description: 'cumulative notional since the contract opened' },
  ],
}
const SCHEMAS = {
  'polls/us-generic-ballot.csv': {
    fields: [
      { name: 'fieldwork_start', type: 'date' },
      { name: 'fieldwork_end', type: 'date', description: 'sort on this, not on the release date' },
      { name: 'pollster', type: 'string' },
      { name: 'sample_size', type: 'integer' },
      { name: 'sample_type', type: 'string', constraints: { enum: ['LV', 'RV', 'A'] }, description: 'likely voters, registered voters, adults; not comparable across types' },
      { name: 'margin_of_error', type: 'number' },
      { name: 'dem_pct', type: 'number' },
      { name: 'rep_pct', type: 'number' },
      { name: 'other_pct', type: 'number' },
      { name: 'dem_margin', type: 'number', description: 'dem_pct minus rep_pct' },
      { name: 'source_url', type: 'string', format: 'uri' },
    ],
  },
  'press/us-press-timeline.csv': {
    fields: [
      { name: 'collected_on', type: 'date' },
      { name: 'outlet', type: 'string' },
      { name: 'headline', type: 'string', description: 'as published, never rewritten' },
      { name: 'published_at', type: 'string' },
      { name: 'link_origin', type: 'string', constraints: { enum: ['feed', 'google', ''] } },
      { name: 'track', type: 'string' },
      { name: 'url', type: 'string', format: 'uri' },
    ],
  },
  'data/distribution-coherence.csv': {
    fields: [
      { name: 'snapshot_at_utc', type: 'datetime' },
      { name: 'market_slug', type: 'string' },
      { name: 'sum_of_buckets_pct', type: 'number' },
      { name: 'passes_95_105_gate', type: 'boolean' },
    ],
  },
}
const recursos = []
for (const sub of ['data', 'polls', 'press']) {
  for (const f of readdirSync(join(OUT, sub)).filter((f) => f.endsWith('.csv')).sort()) {
    const rel = `${sub}/${f}`
    recursos.push({
      name: rel.replace(/[/]/g, '-').replace('.csv', '').toLowerCase(),
      path: rel,
      profile: 'tabular-data-resource',
      format: 'csv',
      mediatype: 'text/csv',
      encoding: 'utf-8',
      dialect: { delimiter: ',', header: true },
      schema: SCHEMAS[rel] || SCHEMA_MERCADO,
    })
  }
}
writeFileSync(join(OUT, 'datapackage.json'), JSON.stringify({
  profile: 'tabular-data-package',
  name: 'afos-usa-2026-midterms-divergence',
  title: 'AFOS — US 2026 Midterms Divergence (pre-electoral)',
  version: VERSAO,
  description: 'Prediction-market prices and published polls for the 2026 US midterms, side by side, before the election. Pre-electoral: no certified result to validate against.',
  licenses: [{ name: 'CC-BY-4.0', path: 'https://creativecommons.org/licenses/by/4.0/', title: 'Creative Commons Attribution 4.0' }],
  homepage: `https://huggingface.co/datasets/${REPO}`,
  contributors: [{ title: 'AFOS Analytics', path: 'https://afos-analytics.com', role: 'author' }],
  resources: recursos,
}, null, 2))

// ── croissant ──────────────────────────────────────────────────────────────────
writeFileSync(join(OUT, 'croissant.json'), JSON.stringify({
  '@context': { '@vocab': 'https://schema.org/', cr: 'http://mlcommons.org/croissant/' },
  '@type': 'Dataset',
  name: 'afos-usa-2026-midterms-divergence',
  description: 'Prediction-market prices and published polls for the 2026 US midterms. Pre-electoral version: the election is on 2026-11-03 and no certified result is available.',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  url: `https://huggingface.co/datasets/${REPO}`,
  version: VERSAO,
  creator: { '@type': 'Organization', name: 'AFOS Analytics', url: 'https://afos-analytics.com' },
  distribution: recursos.map((r) => ({ '@type': 'cr:FileObject', '@id': r.path, name: r.name, encodingFormat: 'text/csv', contentUrl: r.path })),
}, null, 2))

// ── CITATION ───────────────────────────────────────────────────────────────────
writeFileSync(join(OUT, 'CITATION.cff'), `cff-version: 1.2.0
title: "AFOS — US 2026 Midterms Divergence (pre-electoral)"
message: "If you use this dataset, please cite it."
type: dataset
version: "${VERSAO}"
license: CC-BY-4.0
url: "https://huggingface.co/datasets/${REPO}"
authors:
  - name: "AFOS Analytics"
abstract: >-
  Prediction-market prices and published opinion polls for the 2026 United States
  midterm elections, recorded side by side before the vote. Pre-electoral version:
  the election is held on 2026-11-03 and there is no certified result to validate
  the forecasts against. One race in the bundle, the Texas Republican Senate primary
  runoff of 2026-05-26, is already decided and carries its verified outcome.
`)

writeFileSync(join(OUT, 'LICENSE-CC-BY-4.0'), 'Creative Commons Attribution 4.0 International\nhttps://creativecommons.org/licenses/by/4.0/legalcode\n\nApplies to the data files in this bundle.\n')
writeFileSync(join(OUT, 'LICENSE-APACHE-2.0'), 'Apache License 2.0\nhttps://www.apache.org/licenses/LICENSE-2.0\n\nApplies to the build scripts shipped with this bundle.\n')

// ── CHECKSUMS, agora cobrindo dados e metadados ────────────────────────────────
function lista(dir, base = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? lista(join(dir, d.name), join(base, d.name)) : [join(base, d.name)]
  )
}
const arquivos = lista(OUT).filter((f) => !f.endsWith('CHECKSUMS.txt')).sort()
writeFileSync(join(OUT, 'CHECKSUMS.txt'),
  arquivos.map((f) => `${createHash('sha256').update(readFileSync(join(OUT, f))).digest('hex')}  ${f.replace(/\\/g, '/')}`).join('\n') + '\n')

console.log('metadados gerados. arquivos no bundle:', arquivos.length + 1)
for (const f of arquivos) console.log('  ', f.replace(/\\/g, '/'))
