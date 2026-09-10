// Harvard Dataverse - Brasil 2026 (doi:10.7910/DVN/2D0UK7): confere o deposito
// PUBLICADO byte a byte contra a arvore publicada no Hugging Face.
//
// 🔴 POR QUE ISTO EXISTE (10/Set/2026): o harvard-publish-brazil.mjs so tem
// trava de NAO-REGRESSAO por TAMANHO, que responde "nenhum arquivo encolheu" e
// nao responde "o conteudo e o mesmo". Publicar e conferir sao passos
// diferentes, e o segundo nao existia deste lado.
//
// ⚠️ O download usa ?format=original. O .tab do deposito e uma CONVERSAO que o
// Dataverse faz do csv enviado, entao comparar contra ele acusaria diferenca em
// todo tabular, sempre, e o alarme seria eterno.
//
// Uso: node scripts/harvard-conferir-brasil.mjs
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const BASE = 'https://dataverse.harvard.edu'
const PID = 'doi:10.7910/DVN/2D0UK7'
const ORIGEM = '.cache/hf-publicado'

const TOKEN = (() => {
  const m = readFileSync('.env.local', 'utf8').match(/^DATAVERSE_TOKEN=(.+)$/m)
  if (!m) { console.error('DATAVERSE_TOKEN ausente no .env.local'); process.exit(1) }
  return m[1].trim().replace(/^["']|["']$/g, '')
})()

const sha = (b) => createHash('sha256').update(b).digest('hex')

// O deposito e PLANO: os arquivos vivem na raiz, enquanto na arvore do HF eles
// moram em polls/ e data/. O mapa e explicito de proposito, porque adivinhar
// pelo nome-base junta tse-registry.csv com tse-registry.json.
const MAPA = {
  'CHANGELOG.md': 'CHANGELOG.md',
  'README.md': 'README.md',
  'divergence-timeseries.tab': 'data/divergence-timeseries.csv',
  'market-odds-timeseries.tab': 'data/market-odds-timeseries.csv',
  'poll-divergence.tab': 'data/poll-divergence.csv',
  'national-poll-results-firstround.tab': 'polls/national-poll-results-firstround.csv',
  'national-poll-results-secondround.tab': 'polls/national-poll-results-secondround.csv',
  'national-polls.json': 'polls/national-polls.json',
  'sample-demographics.tab': 'polls/sample-demographics.csv',
  'tse-registry.json': 'polls/tse-registry.json',
  'tse-registry.tab': 'polls/tse-registry.csv',
}

async function main() {
  const r = await fetch(BASE + '/api/datasets/:persistentId/versions/:latest?persistentId=' + PID,
    { headers: { 'X-Dataverse-key': TOKEN } })
  const d = (await r.json()).data
  console.log('Brasil 2026 · v' + d.versionNumber + '.' + d.versionMinorNumber + ' ' + d.versionState + ', ' + d.files.length + ' arquivos\n')

  let iguais = 0
  let difere = 0
  let estaticos = 0
  for (const f of d.files) {
    const label = f.label || f.dataFile.filename
    const rel = MAPA[label]
    if (!rel) { estaticos++; continue }
    const local = join(ORIGEM, rel)
    if (!existsSync(local)) { console.log('AUSENTE NA ORIGEM ' + rel); difere++; continue }
    const rr = await fetch(BASE + '/api/access/datafile/' + f.dataFile.id + '?format=original',
      { headers: { 'X-Dataverse-key': TOKEN } })
    const buf = Buffer.from(await rr.arrayBuffer())
    const nosso = readFileSync(local)
    if (sha(buf) === sha(nosso)) { iguais++; console.log('OK      ' + rel) }
    else { difere++; console.log('DIFERE  ' + rel + '  harvard ' + buf.length + ' x local ' + nosso.length) }
  }
  console.log('\niguais: ' + iguais + ' | diferem: ' + difere + ' | estaticos nao comparados: ' + estaticos)
  if (difere) process.exit(1)
}

main().catch((e) => { console.error('erro:', String(e).slice(0, 300)); process.exit(1) })
