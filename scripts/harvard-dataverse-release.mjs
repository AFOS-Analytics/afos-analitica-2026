// Harvard Dataverse — release V2.0 do dataset BR2026 (Native API).
// Sobe os arquivos CSV soltos (descompacta o zip da V1) + demografia A e publica versão maior.
// DOI persiste (10.7910/DVN/2D0UK7). Token lido do .env.local (DATAVERSE_TOKEN), nunca do chat.
//
// Uso:
//   node scripts/harvard-dataverse-release.mjs list      → lista arquivos da versão atual
//   node scripts/harvard-dataverse-release.mjs stage     → deleta o zip V1 + adiciona os 15 arquivos (cria DRAFT)
//   node scripts/harvard-dataverse-release.mjs publish    → publica versão MAIOR (V2.0)
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'https://dataverse.harvard.edu'
const PID = 'doi:10.7910/DVN/2D0UK7'
const STAGING = '.cache/harvard-v2'

function token() {
  const env = readFileSync('.env.local', 'utf8')
  const m = env.match(/^DATAVERSE_TOKEN=(.+)$/m)
  if (!m) { console.error('❌ DATAVERSE_TOKEN não encontrado no .env.local'); process.exit(1) }
  return m[1].trim().replace(/^["']|["']$/g, '')
}
const TOKEN = token()
const H = { 'X-Dataverse-key': TOKEN }

// Conjunto curado (paridade com HF/Zaid). directoryLabel preserva a organização polls/ e data/.
const FILES = [
  { p: 'README.md', dir: '' },
  { p: 'DATA_DICTIONARY.md', dir: '' },
  { p: 'CITATION.cff', dir: '' },
  { p: 'CHANGELOG.md', dir: '' },
  { p: 'LICENSE-CC-BY-4.0', dir: '' },
  { p: 'LICENSE-APACHE-2.0', dir: '' },
  { p: 'polls/national-poll-results-firstround.csv', dir: 'polls' },
  { p: 'polls/national-poll-results-secondround.csv', dir: 'polls' },
  { p: 'polls/national-polls.json', dir: 'polls' },
  { p: 'polls/sample-demographics.csv', dir: 'polls' },
  { p: 'polls/tse-registry.csv', dir: 'polls' },
  { p: 'polls/tse-registry.json', dir: 'polls' },
  { p: 'data/divergence-timeseries.csv', dir: 'data' },
  { p: 'data/market-odds-timeseries.csv', dir: 'data' },
  { p: 'data/poll-divergence.csv', dir: 'data' },
]

async function listFiles() {
  const url = `${BASE}/api/datasets/:persistentId/versions/:latest?persistentId=${PID}`
  const r = await fetch(url, { headers: H })
  const j = await r.json()
  if (j.status !== 'OK') { console.error('❌', JSON.stringify(j)); process.exit(1) }
  const v = j.data
  console.log(`Versão atual: ${v.versionNumber ?? 'DRAFT'}.${v.minorVersionNumber ?? ''} (${v.versionState})`)
  for (const f of v.files) {
    console.log(`  id=${f.dataFile.id}  ${f.directoryLabel ? f.directoryLabel + '/' : ''}${f.label}  (${f.dataFile.contentType}, ${f.dataFile.filesize} bytes)`)
  }
  return v.files
}

async function deleteFile(id, label) {
  // SWORD edit-media (método estável de remoção de arquivo no Dataverse)
  const url = `${BASE}/dvn/api/data-deposit/v1.1/swordv2/edit-media/file/${id}`
  const auth = 'Basic ' + Buffer.from(TOKEN + ':').toString('base64')
  const r = await fetch(url, { method: 'DELETE', headers: { Authorization: auth } })
  console.log(`  🗑️  delete ${label} (id=${id}) → HTTP ${r.status}`)
  return r.ok || r.status === 204
}

async function addFile({ p, dir }) {
  const full = join(STAGING, p)
  const buf = readFileSync(full)
  const name = p.split('/').pop()
  const fd = new FormData()
  fd.append('file', new Blob([buf]), name)
  fd.append('jsonData', JSON.stringify(dir ? { directoryLabel: dir } : {}))
  const url = `${BASE}/api/datasets/:persistentId/add?persistentId=${PID}`
  const r = await fetch(url, { method: 'POST', headers: H, body: fd })
  const j = await r.json().catch(() => ({}))
  const ok = j.status === 'OK'
  console.log(`  ${ok ? '✓' : '✗'} add ${dir ? dir + '/' : ''}${name} (${(statSync(full).size/1024).toFixed(1)} KB) → ${j.status || r.status}${ok ? '' : ' :: ' + JSON.stringify(j.message || j)}`)
  return ok
}

async function stage() {
  console.log('📋 Estado atual:')
  const files = await listFiles()
  const zip = files.find(f => /\.zip$/i.test(f.label))
  console.log('\n🗑️  Removendo o zip da V1 (descompactar → arquivos soltos):')
  if (zip) await deleteFile(zip.dataFile.id, zip.label)
  else console.log('  (nenhum zip encontrado — talvez já removido)')
  console.log('\n📤 Adicionando os 15 arquivos curados (cria DRAFT V2):')
  let ok = 0
  for (const f of FILES) if (await addFile(f)) ok++
  console.log(`\n✅ ${ok}/${FILES.length} adicionados. Dataset agora tem um DRAFT. Confira com 'list' antes de 'publish'.`)
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Adiciona só os arquivos que ainda NÃO estão no draft (idempotente), com retry
// para contornar o lock de ingest tabular do Dataverse.
async function fill() {
  const files = await listFiles()
  const present = new Set(files.map(f => (f.directoryLabel ? f.directoryLabel + '/' : '') + f.label))
  const missing = FILES.filter(f => !present.has((f.dir ? f.dir + '/' : '') + f.p.split('/').pop()))
  if (!missing.length) { console.log('\n✅ Nada faltando — os 15 já estão no draft.'); return }
  console.log(`\n📤 Faltam ${missing.length}: ${missing.map(f => f.p).join(', ')}`)
  let ok = 0
  for (const f of missing) {
    let done = false
    for (let attempt = 1; attempt <= 4 && !done; attempt++) {
      done = await addFile(f)
      if (!done) { console.log(`     ⏳ lock? aguardando 5s (tentativa ${attempt}/4)`); await sleep(5000) }
    }
    if (done) ok++
  }
  console.log(`\nfill: ${ok}/${missing.length} adicionados.`)
}

async function publish() {
  const url = `${BASE}/api/datasets/:persistentId/actions/:publish?persistentId=${PID}&type=major`
  const r = await fetch(url, { method: 'POST', headers: H })
  const j = await r.json().catch(() => ({}))
  console.log(`publish major → ${j.status || r.status}`)
  console.log(JSON.stringify(j, null, 2).slice(0, 1200))
}

const cmd = process.argv[2]
if (cmd === 'list') await listFiles()
else if (cmd === 'stage') await stage()
else if (cmd === 'fill') await fill()
else if (cmd === 'del') { for (const id of process.argv.slice(3)) await deleteFile(id, 'id=' + id) }
else if (cmd === 'publish') await publish()
else { console.error('uso: list | stage | publish'); process.exit(1) }
