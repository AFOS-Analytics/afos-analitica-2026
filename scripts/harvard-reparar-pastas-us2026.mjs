// Harvard Dataverse - USA 2026 Midterms: devolve o directoryLabel dos arquivos
// que o /replace achatou para a raiz.
//
// 🔴 POR QUE ISTO EXISTE (10/Set/2026): o endpoint /api/files/{id}/replace NAO
// herda o directoryLabel do arquivo que substitui. Ao atualizar 18 arquivos, os
// 15 que viviam em data/, polls/, press/ e raw/ foram parar na RAIZ do deposito.
// Cada envio devolveu "status":"OK", entao o defeito nao aparece no envio: so
// relendo a versao publicada e contando quantos ainda tem pasta.
//
// A pasta certa nao e adivinhada: sai de onde o arquivo vive no bundle local.
//
// Uso:
//   node scripts/harvard-reparar-pastas-us2026.mjs conferir
//   node scripts/harvard-reparar-pastas-us2026.mjs aplicar
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const BASE = 'https://dataverse.harvard.edu'
const PID = 'doi:10.7910/DVN/XRUT8U'
const ORIGEM = '.cache/us2026-dataset'
const PASTAS = ['data', 'polls', 'press', 'raw']
const MODO = process.argv[2] === 'aplicar' ? 'aplicar' : 'conferir'

const TOKEN = (() => {
  const m = readFileSync('.env.local', 'utf8').match(/^DATAVERSE_TOKEN=(.+)$/m)
  if (!m) { console.error('DATAVERSE_TOKEN ausente no .env.local'); process.exit(1) }
  return m[1].trim().replace(/^["']|["']$/g, '')
})()

async function api(caminho, opcoes = {}) {
  const r = await fetch(BASE + caminho, { ...opcoes, headers: { 'X-Dataverse-key': TOKEN, ...(opcoes.headers || {}) } })
  const t = await r.text()
  let j = null
  try { j = JSON.parse(t) } catch {}
  return { ok: r.ok, status: r.status, json: j, texto: t.slice(0, 300) }
}

async function esperarDestravar(tentativas = 40, intervaloMs = 3000) {
  for (let i = 1; i <= tentativas; i++) {
    const r = await api('/api/datasets/:persistentId/locks?persistentId=' + PID)
    const travas = Array.isArray(r.json && r.json.data) ? r.json.data : []
    if (!travas.length) return true
    if (i === 1) console.log('   travado (' + travas.map((t) => t.lockType).join(', ') + '), esperando...')
    await new Promise((r2) => setTimeout(r2, intervaloMs))
  }
  return false
}

/** Onde este arquivo vive no bundle local. O .tab do deposito veio de um .csv. */
function pastaDoBundle(label) {
  const nome = label.endsWith('.tab') ? label.slice(0, -4) + '.csv' : label
  for (const p of PASTAS) if (existsSync(join(ORIGEM, p, nome))) return p
  if (existsSync(join(ORIGEM, nome))) return ''
  return null
}

async function main() {
  console.log('USA 2026 Midterms · ' + PID + ' · reparo de pastas · modo: ' + MODO.toUpperCase() + '\n')

  const v = await api('/api/datasets/:persistentId/versions/:latest?persistentId=' + PID)
  if (!v.ok) { console.error('nao li o deposito:', v.status, v.texto); process.exit(1) }
  const d = v.json.data
  console.log('deposito: v' + d.versionNumber + '.' + d.versionMinorNumber + ' ' + d.versionState + ', ' + d.files.length + ' arquivos\n')

  const corrigir = []
  const semLugar = []
  for (const f of d.files) {
    const label = f.label || f.dataFile.filename
    const atual = f.directoryLabel || ''
    const certa = pastaDoBundle(label)
    if (certa === null) { semLugar.push(label); continue }
    if (certa !== atual) corrigir.push({ id: f.dataFile.id, label, de: atual || '(raiz)', para: certa || '(raiz)', dir: certa })
  }

  for (const s of semLugar) console.log('   sem par no bundle, intocado: ' + s)
  for (const c of corrigir) console.log('   ' + c.label.padEnd(42) + c.de.padEnd(10) + ' -> ' + c.para)
  console.log('\n' + corrigir.length + ' arquivo(s) a corrigir')

  if (!corrigir.length) { console.log('nada a fazer.'); return }
  if (MODO === 'conferir') { console.log('rode com "aplicar".'); return }

  for (const c of corrigir) {
    if (!(await esperarDestravar())) { console.error('trava nao zerou'); process.exit(1) }
    const saida = execFileSync('curl.exe', [
      '-s', '-X', 'POST', BASE + '/api/files/' + c.id + '/metadata',
      '-H', 'X-Dataverse-key: ' + TOKEN,
      '-F', 'jsonData={"directoryLabel":"' + c.dir + '"}',
    ], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
    const ok = !/"status":"ERROR"/.test(saida) && !/error/i.test(saida.slice(0, 40))
    console.log((ok ? 'OK   ' : 'ERRO ') + c.label + ' -> ' + c.para + (ok ? '' : ' · ' + saida.slice(0, 200)))
    if (!ok) { console.error('abortando antes de publicar'); process.exit(1) }
  }

  if (!(await esperarDestravar())) { console.error('trava nao zerou'); process.exit(1) }
  // Mudanca so de METADADO de arquivo aceita versao menor. Se o Harvard exigir
  // maior, a mensagem diz "Re-try as major release" e ai se repete com major.
  let pub = await api('/api/datasets/:persistentId/actions/:publish?persistentId=' + PID + '&type=minor', { method: 'POST' })
  if (!pub.ok && /major release/i.test(pub.texto)) {
    console.log('minor recusado, repetindo como major (a MENSAGEM decide)')
    if (!(await esperarDestravar())) process.exit(1)
    pub = await api('/api/datasets/:persistentId/actions/:publish?persistentId=' + PID + '&type=major', { method: 'POST' })
  }
  console.log('\n' + (pub.ok ? 'OK   ' : 'ERRO ') + 'publicacao: ' + pub.status + (pub.ok ? '' : ' · ' + pub.texto))
  if (!pub.ok) process.exit(1)
}

main().catch((e) => { console.error('erro:', String(e).slice(0, 400)); process.exit(1) })
