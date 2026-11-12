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
// 1.1.0 (08/Nov/2026): entra a Kalshi, livro próprio
// 1.2.0 (10/Nov/2026): séries até 10/Nov e nota da ficha da Ifop renumerada pela Commission
// 1.3.0 (12/Nov/2026): séries até 12/Nov; preço da Polymarket com 2 casas e livro de vitória inteiro (até 80 contratos) desde 12/Nov
const VERSAO = '1.3.0'
const K = R.kalshi
const REPO = 'AFOS-Analytics1/france-2027-presidential-divergence'
const P = R.polls

copyFileSync(join(ROOT, 'hf-assets', 'fr-2027', 'LICENSE-MieuxVoter-polls.txt'), join(OUT, 'polls', 'LICENSE-MieuxVoter.txt'))

const linhaMercado = (m) => `| \`${m.file}\` | \`${m.slug}\` | ${m.type} | ${m.rows} | ${m.snapshots} | ${m.from?.slice(0, 16) ?? '-'} | ${m.to?.slice(0, 16) ?? '-'} |`
const totalMercado = R.markets.books.reduce((a, m) => a + m.rows, 0)

const yaml = `---
license: cc-by-4.0
language:
- en
- pt
- es
- fr
pretty_name: AFOS France 2027 Presidential, prediction markets and polls side by side
tags:
- elections
- france
- prediction-markets
- polymarket
- kalshi
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
- config_name: kalshi_winner
  data_files: data/kalshi-winner.csv
- config_name: voting_intentions
  data_files: polls/fr-voting-intentions.csv
- config_name: press
  data_files: press/fr-press-timeline.csv
---
`

const corpo = `![AFOS France 2027 Presidential Electoral Divergence](banner.png)

# AFOS France 2027 Presidential: prediction markets and polls, side by side

**English** · [Português](#português) · [Español](#español)

Every price and every poll in this bundle was recorded **before the vote**. The first round is on **18 April 2027** and the runoff on **2 May 2027**. The official result lands in a later version, so anyone can check both instruments against it without taking our word for anything.

Live panel: [afos-analytics.com/en/dashboard/fr](https://www.afos-analytics.com/en/dashboard/fr) · Version ${VERSAO}

## What is inside

| part | content |
|---|---|
| **Market, Polymarket** | ${totalMercado} price observations in 4 books, from ${R.markets.series_starts_utc.slice(0, 16)} UTC |
| **Market, Kalshi** | ${K.rows} price observations in the win book (\`${K.event}\`), from ${K.from?.slice(0, 16)} UTC, plus the log of all ${K.captures} captures |
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
- From 12 Nov 2026, about 15:50 UTC, \`price_pct\` is stored with 2 decimals (0.01 point); earlier rows are in steps of 0.1 point. From the same time, the win book stores up to 80 contracts; before, it stored the 20 highest, so the smallest contracts of that book are missing from earlier snapshots.

### Kalshi book

\`data/kalshi-winner.csv\` is the same question as the Polymarket win book, priced on a second exchange. The two books are **never added or averaged**: fees, liquidity and the people trading differ, and the distance between them is a measurement of its own.

- \`last_price_pct\`, \`bid_pct\`, \`ask_pct\` are in points from 0 to 100 (cents per contract). \`volume_contracts\` and \`open_interest_contracts\` are counted in **contracts, not dollars**.
- \`last_trade_at_utc\` is the time of the last trade, read from the trades endpoint. It is the freshness of the price; the contract's own update stamp is not.
- Each capture runs every 30 minutes. A row is stored when a contract moves 0.5 points or more, when a new contract appears, or every 4 hours. \`data/kalshi-captures.csv\` logs **every** capture, stored or not, with its check: prices must sum to 85 to 120 and the leader must have a bid and an ask (\`passed_check\`, \`defects\`, \`warnings\`).

Source: Kalshi (kalshi.com), market \`${K.event}\`.

### Polls

\`polls/fr-voting-intentions.csv\` has one row per candidate per list. Each list is checked against the official notice listing of the **Commission des sondages** (tag 2027-Présidentielle): the notice number must exist and name the same pollster. \`notice_check\` says the outcome (\`matches\`, \`mismatch\`, \`no-notice-cited\`, \`not-on-2027-listing\`), and \`publishable\` is true only when the notice matches and the list sums to 97 to 103. Lists that fail stay in the file, flagged, and are listed with the reason in \`polls/fr-notice-mismatches.csv\`. \`polls/fr-pending-notices.csv\` lists official notices with voting intentions that the source has not structured yet.

Known case (checked 09 Nov 2026): the four IFOP/LCI lists with fieldwork 27 to 29 Oct cite notice 10352. The Commission first posted that notice as the file \`10352-pres-iv-ifop-lci-3-novembre.pdf\` on 04 Nov and republished it as \`10351-pres-iv-ifop-lci-3-novembre.pdf\` on 05 Nov; on the listing, 10352 is now a different survey. The four lists stay flagged \`mismatch\` until the source cites 10351 (reported upstream in MieuxVoter/presidentielle2027#339), and notice 10351 shows in the pending file meanwhile.

Poll figures come from the open dataset [MieuxVoter/presidentielle2027](https://github.com/MieuxVoter/presidentielle2027) (MIT License, copyright 2025 Mieux Voter; the notice is in \`polls/LICENSE-MieuxVoter.txt\`). AFOS adds the notice check and the English columns; no poll number is typed by hand.

### Press

\`press/fr-press-timeline.csv\` holds headline, outlet, publication time and link, nothing else. The outlet list is fixed (\`press/fr-outlet-list.csv\`) and carries no political label.

## What this bundle does not do

- It does not subtract a market price from a poll number. The market pays on **winning the election**; a poll measures **first-round voting intention**. They are different quantities, and the difference would have no unit.
- It does not average polls from an aggregator. The panel shows a simple average per candidate with the number of lists behind it; this bundle gives the lists themselves.
- It does not filter what fails a check: it flags it and says why.

## Português

Todo preço e toda pesquisa deste pacote foram registrados **antes da urna**. O 1º turno é em **18 de abril de 2027** e o 2º turno em **2 de maio de 2027**. O resultado oficial entra numa versão posterior, e aí qualquer pessoa confere os dois instrumentos contra ele sem precisar confiar na nossa palavra.

| parte | conteúdo |
|---|---|
| **Mercado, Polymarket** | ${totalMercado} observações de preço em 4 livros (vencer, mais votado no 1º turno, vai ao 2º turno, estará na cédula), desde ${R.markets.series_starts_utc.slice(0, 16)} UTC |
| **Mercado, Kalshi** | ${K.rows} observações de preço no livro de vitória, desde ${K.from?.slice(0, 16)} UTC, mais o diário das ${K.captures} capturas |
| **Pesquisas** | ${P.lists} listas de intenção de voto; ${P.publishable_lists} delas passam na conferência com a ficha oficial da Commission des sondages, de ${P.pollsters} institutos, campo de ${P.fieldwork_from} a ${P.fieldwork_to} |
| **Imprensa** | ${R.press.rows} manchetes de uma lista fixa de ${R.press.outlets_on_list} veículos franceses |

- Os dois livros de mercado **nunca são somados nem tirados em média**: taxas, liquidez e quem negocia são diferentes, e a distância entre eles é uma medição própria. O volume da Kalshi é contado em contratos, não em dólares.
- O pacote **não subtrai** preço de pesquisa. O mercado paga **vencer a eleição**; a pesquisa mede **intenção de voto no 1º turno**. São grandezas diferentes, e a diferença não teria unidade.
- Desde 12/11/2026, por volta das 15:50 UTC, o preço da Polymarket é gravado com 2 casas decimais (antes, de 0,1 em 0,1 ponto), e o livro de vitória guarda até 80 contratos (antes, os 20 maiores).
- Lista que não passa na conferência fica no arquivo, marcada com o motivo.
- Pesquisas da base aberta da [Mieux Voter](https://github.com/MieuxVoter/presidentielle2027) (licença MIT). Dados sob CC BY 4.0. Nada aqui é convite a apostar.

## Español

Todo precio y toda encuesta de este paquete se registraron **antes de la votación**. La 1ª vuelta es el **18 de abril de 2027** y la 2ª vuelta el **2 de mayo de 2027**. El resultado oficial entra en una versión posterior, y entonces cualquiera puede cotejar los dos instrumentos con él sin tener que confiar en nuestra palabra.

| parte | contenido |
|---|---|
| **Mercado, Polymarket** | ${totalMercado} observaciones de precio en 4 libros (ganar, más votado en la 1ª vuelta, pasa a la 2ª vuelta, estará en la papeleta), desde ${R.markets.series_starts_utc.slice(0, 16)} UTC |
| **Mercado, Kalshi** | ${K.rows} observaciones de precio en el libro de victoria, desde ${K.from?.slice(0, 16)} UTC, más el registro de las ${K.captures} capturas |
| **Encuestas** | ${P.lists} listas de intención de voto; ${P.publishable_lists} de ellas pasan el cotejo con la ficha oficial de la Commission des sondages, de ${P.pollsters} encuestadoras, campo de ${P.fieldwork_from} a ${P.fieldwork_to} |
| **Prensa** | ${R.press.rows} titulares de una lista fija de ${R.press.outlets_on_list} medios franceses |

- Los dos libros de mercado **nunca se suman ni se promedian**: comisiones, liquidez y quién negocia son distintos, y la distancia entre ellos es una medición en sí. El volumen de Kalshi se cuenta en contratos, no en dólares.
- El paquete **no resta** precio de encuesta. El mercado paga **ganar la elección**; la encuesta mide **intención de voto en la 1ª vuelta**. Son magnitudes distintas, y la diferencia no tendría unidad.
- Desde el 12/11/2026, hacia las 15:50 UTC, el precio de Polymarket se guarda con 2 decimales (antes, de 0,1 en 0,1 punto), y el libro de victoria guarda hasta 80 contratos (antes, los 20 mayores).
- La lista que no pasa el cotejo queda en el archivo, marcada con el motivo.
- Encuestas de la base abierta de [Mieux Voter](https://github.com/MieuxVoter/presidentielle2027) (licencia MIT). Datos bajo CC BY 4.0. Nada aquí es una invitación a apostar.

## Files

- \`data/*.csv\` market series (Polymarket books and \`kalshi-*.csv\`) · \`data/fr-2027-case-summary.json\` counts of this build
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
AFOS Analytics (2026). AFOS France 2027 Presidential: prediction markets and polls, side by side (v${VERSAO}).
Hugging Face. https://huggingface.co/datasets/${REPO}
\`\`\`
`
writeFileSync(join(OUT, 'README.md'), yaml + '\n' + corpo)

writeFileSync(join(OUT, 'DATASHEET.md'), `# Datasheet: AFOS France 2027 Presidential (v${VERSAO})

**Motivation.** To keep, side by side and on the record before the vote, what prediction markets and published polls said about the 2027 French presidential election. They are different quantities; the useful fact is where and when they disagree.

**Creator.** AFOS Analytics (afos-analytics.com).

**Composition.** ${totalMercado} Polymarket price observations in 4 books; ${K.rows} Kalshi price observations in the win book, with a log of ${K.captures} captures; ${P.lists} poll lists (${P.publishable_lists} publishable) from ${P.pollsters} pollsters; ${R.press.rows} press headlines from ${R.press.outlets_on_list} outlets. Election: first round 2027-04-18, runoff 2027-05-02. Official result: not yet available (status: ${R.status}).

**Collection.** Polymarket public prices read every 30 minutes by the AFOS server, stored on movement of 0.5 points or a 4-hour heartbeat. Kalshi public market data read every 30 minutes, same storage rule, every capture logged with its check. Polls collected twice a day from the Mieux Voter open dataset and checked list by list against the Commission des sondages notice listing. Press collected three times a day from RSS feeds of a fixed outlet list.

**Preprocessing.** Placeholder contracts removed; market series starts ${R.markets.series_starts_utc}. Poll lists failing the notice check are kept and flagged. Column names and check labels translated to English; raw records kept as stored.

**Uses.** Research on prediction markets, polling and political risk. Not betting advice.

**Distribution.** Hugging Face, CC BY 4.0 (poll figures MIT).

**Maintenance.** Updated by AFOS Analytics; the result version follows the official count.
`)

writeFileSync(join(OUT, 'CITATION.cff'), `cff-version: 1.2.0
title: "AFOS France 2027 Presidential: prediction markets and polls, side by side"
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
