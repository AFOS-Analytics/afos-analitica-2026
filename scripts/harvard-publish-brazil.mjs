// Harvard Dataverse — Brasil 2026 (doi:10.7910/DVN/2D0UK7).
//
// Sobe a camada curada de 15 arquivos a partir da ÁRVORE PUBLICADA no Hugging
// Face (.cache/hf-publicado), que passou a ser fonte única depois de o Brasil
// entrar no padrão-ouro. E troca os 2 travessões da descrição, pendência que o
// André adiou em 12/Jul com a regra "fazer junto com a próxima subida de versão".
//
// ⛔ TRAVA DE NÃO-REGRESSÃO: nenhum arquivo pode ENCOLHER. O dataset é
// append-only por política própria (ver ERRATA.md: arquivos de datas fechadas
// nunca são reescritos), então arquivo menor significa build incompleto, não
// dado novo. Encontrando um, aborta antes de enviar qualquer coisa.
//
// ⚠️ NÃO acrescenta URL à descrição. A moderação automática do Harvard barrou
// 9 publicações em 22/Jul exatamente por isso. Aqui só se troca — por -.
//
// Token: .env.local (DATAVERSE_TOKEN), nunca do chat.
//
// Uso:
//   node scripts/harvard-publish-brazil.mjs conferir
//   node scripts/harvard-publish-brazil.mjs publicar
import { readFileSync, existsSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const BASE = 'https://dataverse.harvard.edu'
const PID = 'doi:10.7910/DVN/2D0UK7'
const ORIGEM = '.cache/hf-publicado'
const PLANO = '.cache/br-trocar.json'
const MODO = process.argv[2] === 'publicar' ? 'publicar' : 'conferir'

function token() {
  const m = readFileSync('.env.local', 'utf8').match(/^DATAVERSE_TOKEN\s*=\s*(.+)$/m)
  if (!m) { console.error('DATAVERSE_TOKEN ausente no .env.local'); process.exit(1) }
  return m[1].trim().replace(/^["']|["']$/g, '')
}
const TOKEN = token()

async function api(caminho, opcoes = {}) {
  const r = await fetch(`${BASE}${caminho}`, {
    ...opcoes,
    headers: { 'X-Dataverse-key': TOKEN, ...(opcoes.headers || {}) },
  })
  const t = await r.text()
  let j = null
  try { j = JSON.parse(t) } catch {}
  return { ok: r.ok, status: r.status, json: j, texto: t.slice(0, 400) }
}

/** Troca os travessões (U+2014) por traço comum, preservando o resto do texto. */
function semTravessao(s) {
  return s.replace(/\s*—\s*/g, ' - ')
}

async function main() {
  console.log(`Brasil 2026 · ${PID} · modo: ${MODO.toUpperCase()}\n`)

  if (!existsSync(PLANO)) { console.error(`plano ausente: ${PLANO}`); process.exit(1) }
  const plano = JSON.parse(readFileSync(PLANO, 'utf8'))
  if (!plano.length) { console.log('nada a trocar'); return }

  const v = await api(`/api/datasets/:persistentId/versions/:latest?persistentId=${PID}`)
  if (!v.ok) { console.error('não li o depósito:', v.status, v.texto); process.exit(1) }
  const d = v.json.data
  const porId = new Map(d.files.map((f) => [f.dataFile.id, f]))

  // ── trava de não-regressão ─────────────────────────────────────────────
  const problemas = []
  for (const { rel, id } of plano) {
    const p = `${ORIGEM}/${rel}`
    if (!existsSync(p)) { problemas.push(`${rel}: ausente na origem`); continue }
    const f = porId.get(id)
    if (!f) { problemas.push(`${rel}: id ${id} não está no depósito`); continue }
    const novo = statSync(p).size
    const velho = f.dataFile.filesize
    if (novo < velho) problemas.push(`${rel}: ENCOLHERIA (${velho} -> ${novo})`)
  }
  if (problemas.length) {
    console.error('TRAVA DE NÃO-REGRESSÃO, nada foi enviado:')
    for (const p of problemas) console.error('   · ' + p)
    process.exit(1)
  }
  console.log(`trava passou: ${plano.length} arquivos, nenhum encolhe\n`)

  // ── descrição: travessões ──────────────────────────────────────────────
  const campos = d.metadataBlocks.citation.fields
  const ds = campos.find((c) => c.typeName === 'dsDescription')
  const antes = ds.value.map((x) => x.dsDescriptionValue.value)
  const depois = antes.map(semTravessao)
  const qtd = antes.join('').split('—').length - 1
  console.log(`descrição: ${qtd} travessão(ões) a trocar`)
  if (MODO === 'conferir') {
    depois.forEach((t, i) => { if (t !== antes[i]) console.log(`\n  nova descrição ${i + 1}:\n  ${t.slice(0, 260)}...`) })
    console.log(`\n${plano.length} arquivos a substituir. Rode com "publicar".`)
    return
  }

  for (const { rel, id } of plano) {
    const saida = execFileSync('curl.exe', [
      '-s', '-X', 'POST', `${BASE}/api/files/${id}/replace`,
      '-H', `X-Dataverse-key: ${TOKEN}`,
      '-F', `file=@${ORIGEM}/${rel}`,
      '-F', 'jsonData={"forceReplace":true}',
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    const ok = /"status":"OK"/.test(saida)
    console.log(`${ok ? 'OK  ' : 'ERRO'} ${rel}${ok ? '' : ' · ' + saida.slice(0, 200)}`)
    if (!ok) { console.error('abortando antes de publicar'); process.exit(1) }
  }

  if (qtd > 0) {
    const corpo = {
      fields: [{
        typeName: 'dsDescription',
        multiple: true,
        typeClass: 'compound',
        value: depois.map((t) => ({ dsDescriptionValue: { typeName: 'dsDescriptionValue', multiple: false, typeClass: 'primitive', value: t } })),
      }],
    }
    const r = await api(`/api/datasets/:persistentId/editMetadata?persistentId=${PID}&replace=true`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
    })
    console.log(`${r.ok ? 'OK  ' : 'ERRO'} descrição sem travessões${r.ok ? '' : ' · ' + r.texto}`)
    if (!r.ok) { console.error('abortando antes de publicar'); process.exit(1) }
  }

  const pub = await api(`/api/datasets/:persistentId/actions/:publish?persistentId=${PID}&type=major`, { method: 'POST' })
  console.log(`\n${pub.ok ? 'OK  ' : 'ERRO'} publicação: ${pub.status}${pub.ok ? '' : ' · ' + pub.texto}`)
  if (!pub.ok) process.exit(1)
}

main().catch((e) => { console.error('erro:', String(e).slice(0, 400)); process.exit(1) })
