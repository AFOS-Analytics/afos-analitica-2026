// Harvard Dataverse — CRIA um dataset NOVO na coleção afos-analytics (Native API), em DRAFT.
// Um país por vez. NÃO publica (deixa rascunho para André revisar + publicar na UI).
// Token lido do .env.local (DATAVERSE_TOKEN), nunca do chat. Fonte = bundle local (.cache/zaid-repo/<país>).
//
// Uso:
//   node scripts/harvard-dataverse-create.mjs colombia        → cria o dataset (DRAFT) + sobe os arquivos
//   node scripts/harvard-dataverse-create.mjs colombia --files-only doi:10.7910/DVN/XXXX  → só (re)sobe arquivos num draft já criado
import { readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'https://dataverse.harvard.edu'
const COLLECTION = 'afos-analytics'

function token() {
  const env = readFileSync('.env.local', 'utf8')
  const m = env.match(/^DATAVERSE_TOKEN=(.+)$/m)
  if (!m) { console.error('❌ DATAVERSE_TOKEN não encontrado no .env.local'); process.exit(1) }
  return m[1].trim().replace(/^["']|["']$/g, '')
}
const TOKEN = token()
const H = { 'X-Dataverse-key': TOKEN }
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const AUTHOR = { authorName: { typeName: 'authorName', multiple: false, typeClass: 'primitive', value: 'Felipe, Andre' }, authorAffiliation: { typeName: 'authorAffiliation', multiple: false, typeClass: 'primitive', value: 'AFOS-Analytics.com' } }
const CONTACT = { datasetContactName: { typeName: 'datasetContactName', multiple: false, typeClass: 'primitive', value: 'AFOS-Analytics' }, datasetContactAffiliation: { typeName: 'datasetContactAffiliation', multiple: false, typeClass: 'primitive', value: 'AFOS-Analytics.com' }, datasetContactEmail: { typeName: 'datasetContactEmail', multiple: false, typeClass: 'primitive', value: 'founder@afos-analytics.com' } }
const kw = (v) => ({ keywordValue: { typeName: 'keywordValue', multiple: false, typeClass: 'primitive', value: v } })

// Config por país. Bundle = .cache/zaid-repo/<país>. Sem travessão nos metadados (anti-AI).
const COUNTRIES = {
  peru: {
    dir: '.cache/zaid-repo/peru',
    title: 'AFOS · Peru 2026 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the Peru 2026 general election release (first round 12 April 2026 with 35 candidates; runoff 7 June 2026, Keiko Fujimori vs Roberto Sanchez). It cross-references prediction markets (Polymarket, total volume near US$ 106.9 million), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. Peru is a rare case with two opposite divergences in one election. In the first round the market made Rafael Lopez Aliaga the runaway favorite to win (40 to 55 percent probability for months), yet he collapsed down the stretch and finished third, out of the runoff, the biggest gap of the cycle between what the market priced and the actual vote. In the runoff the market favored Fujimori (near 68 percent to win on election day) while the final publishable polls showed a statistical tie (Ipsos valid-vote simulacro near 51.4 to 48.6), and the vote itself was a photo finish. Roberto Sanchez contested the count, seeking to void the overseas vote and petitioning the Inter-American Commission on Human Rights; the National Jury of Elections (JNE) rejected the appeals, resolved the observed tally sheets, and on 3 July 2026 proclaimed Keiko Fujimori president-elect for 2026 to 2031 with 50.135 percent to Sanchez 49.865 percent, a margin near 0.27pp (just over 49,000 votes), one of the closest results in Peruvian history; the inauguration is set for 28 July 2026. The lesson is double: in the first round the market misread the frontrunner, and in the runoff it was right on direction but overstated the margin, while the polls near-tie matched the outcome. Divergence and overstated confidence are the signal, not a polling error. Includes first-round and runoff polls in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'Peru', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'Latin America', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'peru-2026-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'banner.png', dir: '', src: '../AFOS-Analytics1/peru-2026-electoral-divergence/banner.png' },
      { p: 'peru-first-round-polls.csv', dir: 'polls' },
      { p: 'peru-runoff-polls.csv', dir: 'polls' },
      { p: 'peru-polls.json', dir: 'polls' },
      { p: 'peru-market-odds-timeseries.csv', dir: 'data' },
      { p: 'peru-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  colombia: {
    dir: '.cache/zaid-repo/colombia',
    title: 'AFOS · Colombia 2026 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the Colombia 2026 presidential release (first round 31 May 2026; runoff 21 June 2026, Abelardo de la Espriella vs Ivan Cepeda). It cross-references prediction markets (Polymarket), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. Result (21 June): de la Espriella won 49.66% to 48.70%, a margin near 1pp; both the market and the polls called the winner but overstated the margin (the market priced an 88.5% near-certainty, the polls a roughly 8pp lead), a case where divergence and overstated confidence are the signal. Includes first-round and runoff polls in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA) and the AS/COA poll tracker; each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'Colombia', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'Latin America', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'colombia-2026-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'colombia-first-round-polls.csv', dir: 'polls' },
      { p: 'colombia-runoff-polls.csv', dir: 'polls' },
      { p: 'colombia-polls.json', dir: 'polls' },
      { p: 'colombia-market-odds-timeseries.csv', dir: 'data' },
      { p: 'colombia-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  chile: {
    dir: '.cache/zaid-repo/chile',
    title: 'AFOS · Chile 2025 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the Chile 2025 presidential release (first round 16 November 2025; runoff 14 December 2025, Jeannette Jara vs Jose Antonio Kast). It cross-references prediction markets (Polymarket), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. Chile is one of the method\'s cleanest divergence-confirmed-by-result cases: Jara led almost every first-round poll (and won the first round with 26.8%) while the market gave her only near 16% to win the presidency; Kast sat around 17 to 21 percent of the first-round vote, at times behind Jara, yet the market priced his probability of winning near 66%, because it was already pricing the runoff consolidation of the fragmented right. Kast won the runoff 58% to 42%. The divergence was signal, not noise, confirmed by the result. Includes first-round and runoff polls in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'Chile', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'Latin America', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'chile-2025-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'chile-first-round-polls.csv', dir: 'polls' },
      { p: 'chile-runoff-polls.csv', dir: 'polls' },
      { p: 'chile-polls.json', dir: 'polls' },
      { p: 'chile-market-odds-timeseries.csv', dir: 'data' },
      { p: 'chile-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  mexico: {
    dir: '.cache/zaid-repo/mexico',
    title: 'AFOS · Mexico 2024 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the Mexico 2024 presidential release (single round, 2 June 2024). It cross-references prediction markets (Polymarket), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. Claudia Sheinbaum won with about 59.8% of the vote, the largest vote count in Mexican history, and became the country\'s first woman president. The signal showed early: from January the market already gave Sheinbaum near 90% probability of winning, while polls measured her vote share around 50% (the Oraculus aggregate closed near 54%). The market treated the race as decided long before election day, and the actual result ran even higher than the polls suggested. Official result: Claudia Sheinbaum (Morena) 59.8%, Xochitl Galvez (PAN-PRI-PRD) 27.5%, Jorge Alvarez Maynez (Movimiento Ciudadano) 10.3%. Where some polls still showed a contest, the market read the outcome. Includes the poll series in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'Mexico', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'North America', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'mexico-2024-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'banner.png', dir: '', src: '../AFOS-Analytics1/mexico-2024-electoral-divergence/banner.png' },
      { p: 'mexico-polls.csv', dir: 'polls' },
      { p: 'mexico-polls.json', dir: 'polls' },
      { p: 'mexico-market-odds-timeseries.csv', dir: 'data' },
      { p: 'mexico-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  uk: {
    dir: '.cache/zaid-repo/uk',
    title: 'AFOS · United Kingdom 2024 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the United Kingdom 2024 general election release (House of Commons, 4 July 2024). It cross-references prediction markets (Polymarket), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. Under first-past-the-post the market prices which party wins the most seats while polls measure party vote share, and the gap between them is the signal. Keir Starmer\'s Labour won 411 of the 650 seats. On the eve of the vote the market (total volume near US$ 1.76 million) gave Labour a 99% chance of winning the most seats, while polls measured around 40% of vote intention; this is not a contradiction, because Britain\'s first-past-the-post system turned 33.7% of the vote into 63% of the seats. Official result: Labour 411 seats (33.7%), Conservative 121 (23.7%), Liberal Democrats 72 (12.2%), SNP 9 (2.5%), Reform UK 5 (14.3%), Green 4 (6.8%), Plaid Cymru 4 (0.7%). Where a naive reading saw a single number, the market-versus-poll spread read the outcome. Includes the poll series in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'United Kingdom', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'Europe', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'uk-2024-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'banner.png', dir: '', src: '../AFOS-Analytics1/uk-2024-electoral-divergence/banner.png' },
      { p: 'uk-polls.csv', dir: 'polls' },
      { p: 'uk-polls.json', dir: 'polls' },
      { p: 'uk-market-odds-timeseries.csv', dir: 'data' },
      { p: 'uk-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  canada: {
    dir: '.cache/zaid-repo/canada',
    title: 'AFOS · Canada 2025 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the Canada 2025 federal release (House of Commons, 28 April 2025). It cross-references prediction markets (Polymarket), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. In a first-past-the-post system the market prices which party wins the most seats (the plurality), while polls measure party vote share, and in 2025 the two came apart in one of the most dramatic reversals a prediction market has tracked. In late January the market gave the Conservatives near 85% to win the most seats; by late April it had flipped to the Liberals near 80%, while the two parties\' vote shares stayed within a few points of each other the whole time. The trigger (Trudeau\'s resignation, Mark Carney\'s rise, and the tariff shock) repriced the winner long before vote-share polls told a clean story. The Liberals won the most seats (169 to 144), validating the market\'s final read; on election day they took near 43.8% of the vote to the Conservatives\' near 41.3%, a gap near 2.5pp that still produced a clear seat plurality. Smaller parties (NDP, Bloc, Green) held meaningful vote share but near 0% probability of winning the most seats throughout. Includes the poll series in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'Canada', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'North America', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'canada-2025-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'banner.png', dir: '', src: '../AFOS-Analytics1/canada-2025-electoral-divergence/banner.png' },
      { p: 'canada-polls.csv', dir: 'polls' },
      { p: 'canada-polls.json', dir: 'polls' },
      { p: 'canada-market-odds-timeseries.csv', dir: 'data' },
      { p: 'canada-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  germany: {
    dir: '.cache/zaid-repo/germany',
    title: 'AFOS · Germany 2025 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the Germany 2025 federal release (Bundestag, 23 February 2025, a snap election after the November 2024 coalition collapse). It cross-references prediction markets (Polymarket), named polling institutes, and press coverage, flagging explicit divergence between sources instead of smoothed averages. Germany is a clean case of why probability is not vote share: the Polymarket contract prices who wins the most seats (the plurality), not vote totals. The AfD held around 21% of the vote in final polls, clearly the second-largest party, yet the market gave it only near 3% to win the most seats (a gap near 18pp); it finished second with 20.8% and did not win the plurality. The CDU/CSU is the mirror image: around 29.5% of the vote but near 97% to win the most seats, a moderate vote lead translated into near-certain plurality; it won with 28.5% and Friedrich Merz became Chancellor. In a fragmented parliament, vote share and who wins diverge by design, and only the market-versus-poll spread captures it. Includes the poll series in long format, a daily market-odds time series, a market-versus-poll divergence series, a structured press-coverage index, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'Germany', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'Europe', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'germany-2025-press-coverage.csv', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'banner.png', dir: '', src: '../AFOS-Analytics1/germany-2025-electoral-divergence/banner.png' },
      { p: 'germany-polls.csv', dir: 'polls' },
      { p: 'germany-polls.json', dir: 'polls' },
      { p: 'germany-market-odds-timeseries.csv', dir: 'data' },
      { p: 'germany-divergence-timeseries.csv', dir: 'data' },
    ],
  },
  'south-korea': {
    dir: '.cache/zaid-repo/south-korea',
    title: 'AFOS · South Korea 2025 Electoral Divergence Dataset',
    description: 'AFOS Analytics is global-by-design open-source civic infrastructure for electoral political-risk intelligence: wherever there is an election, there is a signal. This dataset is the South Korea 2025 snap presidential release (3 June 2025), the first AFOS validated case in Asia. The snap election followed Yoon Suk-yeol\'s martial-law crisis and his removal by the Constitutional Court. Lee Jae-myung (Democratic Party) won with 49.42%, defeating Kim Moon-soo (People Power Party, 41.15%) and Lee Jun-seok (Reform Party, near 8.3%), a margin of 8.27pp. The dataset cross-references prediction markets (Polymarket) and named polling institutes (36 pollsters, including Gallup Korea, Embrain and KOPRA), flagging explicit divergence between sources instead of smoothed averages. It is a clean read of the method: from early April the market already priced Lee near 80% to win, rising to near 95% at the close, while polls measured his vote share around 46 to 50 percent; the market even sat in the 8 to 11pp lead band against the actual 8.27pp margin. The gap between probability of winning (market) and vote share (poll) is the signal AFOS tracks, not a polling error. Includes the full poll series in long format, a daily market-odds time series, a market-versus-poll divergence series, and structural context. Poll figures were compiled deterministically from the public Wikipedia aggregation (CC BY-SA); each figure traces to a named pollster. A methodological caveat: South Korean law restricts residents from Polymarket, so market volume is predominantly international. Contains only public electoral data: no personal data. Observational research, not investment advice or voting guidance. DOI-backed release of the live mirror maintained at Hugging Face.',
    keywords: ['elections', 'South Korea', 'prediction markets', 'polls', 'political risk', 'electoral divergence', 'Asia', 'Polymarket', 'open data'],
    files: [
      { p: 'README.md', dir: '' },
      { p: 'DATA_DICTIONARY.md', dir: '' },
      { p: 'LICENSE-CC-BY-4.0', dir: '' },
      { p: 'LICENSE-APACHE-2.0', dir: '' },
      { p: 'structural-context.csv', dir: '' },
      { p: 'banner.png', dir: '' },
      { p: 'odds-trajectory.png', dir: '' },
      { p: 'odds-snapshot.png', dir: '' },
      { p: 'south-korea-polls.csv', dir: '' },
      { p: 'south-korea-polls.json', dir: '' },
      { p: 'south-korea-market-odds-timeseries.csv', dir: '' },
      { p: 'south-korea-divergence-timeseries.csv', dir: '' },
    ],
  },
}

function buildMetadata(c) {
  return {
    datasetVersion: {
      license: { name: 'CC BY 4.0', uri: 'https://creativecommons.org/licenses/by/4.0/' },
      metadataBlocks: {
        citation: {
          displayName: 'Citation Metadata',
          fields: [
            { typeName: 'title', multiple: false, typeClass: 'primitive', value: c.title },
            { typeName: 'author', multiple: true, typeClass: 'compound', value: [AUTHOR] },
            { typeName: 'datasetContact', multiple: true, typeClass: 'compound', value: [CONTACT] },
            { typeName: 'dsDescription', multiple: true, typeClass: 'compound', value: [{ dsDescriptionValue: { typeName: 'dsDescriptionValue', multiple: false, typeClass: 'primitive', value: c.description } }] },
            { typeName: 'subject', multiple: true, typeClass: 'controlledVocabulary', value: ['Social Sciences'] },
            { typeName: 'keyword', multiple: true, typeClass: 'compound', value: c.keywords.map(kw) },
          ],
        },
      },
    },
  }
}

async function createDataset(c) {
  const url = `${BASE}/api/dataverses/${COLLECTION}/datasets`
  const r = await fetch(url, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(buildMetadata(c)) })
  const j = await r.json().catch(() => ({}))
  if (j.status !== 'OK') { console.error('❌ create falhou:', JSON.stringify(j.message || j)); process.exit(1) }
  const pid = j.data.persistentId
  console.log(`✅ dataset criado (DRAFT): ${pid}`)
  return pid
}

async function addFile(pid, { p, dir, src }, bundleDir) {
  const full = src ? src : join(bundleDir, p)
  if (!existsSync(full)) { console.log(`  ⚠️  PULADO (não existe): ${full}`); return false }
  const buf = readFileSync(full)
  const name = p.split('/').pop()
  const fd = new FormData()
  fd.append('file', new Blob([buf]), name)
  fd.append('jsonData', JSON.stringify(dir ? { directoryLabel: dir } : {}))
  const url = `${BASE}/api/datasets/:persistentId/add?persistentId=${pid}`
  const r = await fetch(url, { method: 'POST', headers: H, body: fd })
  const j = await r.json().catch(() => ({}))
  const ok = j.status === 'OK'
  console.log(`  ${ok ? '✓' : '✗'} ${dir ? dir + '/' : ''}${name} (${(statSync(full).size / 1024).toFixed(1)} KB) → ${j.status || r.status}${ok ? '' : ' :: ' + JSON.stringify(j.message || j)}`)
  return ok
}

async function addAll(pid, c) {
  let ok = 0
  for (const f of c.files) {
    let done = false
    for (let attempt = 1; attempt <= 4 && !done; attempt++) {
      done = await addFile(pid, f, c.dir)
      if (!done) { console.log(`     ⏳ retry em 5s (${attempt}/4, lock de ingest?)`); await sleep(5000) }
    }
    if (done) ok++
  }
  console.log(`\n📦 ${ok}/${c.files.length} arquivos no DRAFT.`)
  return ok
}

const country = process.argv[2]
const c = COUNTRIES[country]
if (!c) { console.error(`uso: node scripts/harvard-dataverse-create.mjs <país>  (configurados: ${Object.keys(COUNTRIES).join(', ')})`); process.exit(1) }

const filesOnlyIdx = process.argv.indexOf('--files-only')
if (filesOnlyIdx !== -1) {
  const pid = process.argv[filesOnlyIdx + 1]
  if (!pid) { console.error('❌ --files-only exige o persistentId (doi:...)'); process.exit(1) }
  console.log(`📤 (re)subindo arquivos em ${pid}`)
  await addAll(pid, c)
} else {
  console.log(`🌎 Criando dataset DRAFT para "${country}" na coleção ${COLLECTION}...`)
  const pid = await createDataset(c)
  await addAll(pid, c)
  console.log(`\n🔗 Revise o DRAFT na UI: ${BASE}/dataset.xhtml?persistentId=${pid}&version=DRAFT`)
  console.log('   (NÃO publicado. Você revisa e clica em Publish na UI.)')
}
