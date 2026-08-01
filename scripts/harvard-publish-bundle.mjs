// Harvard Dataverse — atualiza o USA 2024 (doi:10.7910/DVN/3DJCW5) para a versão
// corrigida, substituindo APENAS os 3 arquivos de texto.
//
// 🔴 POR QUE ESTA PUBLICAÇÃO EXISTE: o que está no ar declara a procedência
// ERRADA dos dados. O DATASHEET publicado diz que as pesquisas vêm da agregação
// da Wikipédia; o script de build dos EUA lê o arquivo do FiveThirtyEight. E
// declara "Harvard Dataverse DOI pending" num documento que ESTÁ no Harvard e
// já tem DOI. Os outros 9 bundles foram corrigidos em 25/Jul; o USA ficou de
// fora porque estava reservado.
//
// Token: lido do .env.local (DATAVERSE_TOKEN), NUNCA do chat. Tudo que é
// digitado no chat fica gravado no transcrito da sessão, em disco.
//
// Uso:
//   node scripts/harvard-publish-usa2024.mjs conferir   → só compara, não grava
//   node scripts/harvard-publish-usa2024.mjs publicar   → substitui e publica
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const BASE = 'https://dataverse.harvard.edu'
const ARQUIVOS = ['README.md', 'DATASHEET.md', 'CHECKSUMS.txt']

/**
 * ⚠️ A TRAVA É POR BUNDLE, e isso não é firula. A dos EUA exige que a palavra
 * "Wikipedia" só apareça dentro da nota de correção, porque lá a atribuição à
 * Wikipédia era ERRO: o build lê o arquivo do FiveThirtyEight. Na Índia a
 * Wikipédia é a procedência CERTA, o dado sai do wikitexto bruto. Copiar a
 * trava de um para o outro reprovaria uma publicação correta.
 */
const BUNDLES = {
  'usa-2024': {
    pid: 'doi:10.7910/DVN/3DJCW5',
    dir: '.cache/usa-harvard',
    doi: '10.7910/DVN/3DJCW5',
    wikipediaSoNaCorrecao: true,
  },
  'india-2024': {
    pid: 'doi:10.7910/DVN/CNLXZJ',
    dir: '.cache/india-harvard',
    doi: '10.7910/DVN/CNLXZJ',
    wikipediaSoNaCorrecao: false, // aqui a Wikipédia É a fonte, declarada de propósito
  },
}

const BUNDLE = process.argv[2]
const MODO = process.argv[3] === 'publicar' ? 'publicar' : 'conferir'
const CFG = BUNDLES[BUNDLE]
if (!CFG) {
  console.error(`Uso: node scripts/harvard-publish-bundle.mjs <${Object.keys(BUNDLES).join('|')}> [conferir|publicar]`)
  process.exit(1)
}
const { pid: PID, dir: DIR } = CFG

function token() {
  if (!existsSync('.env.local')) { console.error('❌ .env.local não existe'); process.exit(1) }
  const m = readFileSync('.env.local', 'utf8').match(/^DATAVERSE_TOKEN\s*=\s*(.+)$/m)
  if (!m) { console.error('❌ DATAVERSE_TOKEN não está no .env.local'); process.exit(1) }
  return m[1].trim().replace(/^["']|["']$/g, '')
}
const TOKEN = token()
const md5 = (b) => createHash('md5').update(b).digest('hex')

/**
 * ⛔ TRAVA DE CONTEÚDO. O André dispensou a revisão manual, então a conferência
 * que ele faria vira condição de execução. Depósito com DOI não se desfaz, e
 * publicar texto errado por cima de texto errado seria pior que não publicar.
 */
function conferirTexto() {
  const problemas = []
  for (const nome of ARQUIVOS) {
    const p = `${DIR}/${nome}`
    if (!existsSync(p)) { problemas.push(`${nome}: não baixado da origem`); continue }
    const t = readFileSync(p, 'utf8')
    if (t.length < 500) problemas.push(`${nome}: suspeito de truncado (${t.length} bytes)`)
    if (/DOI pending/i.test(t)) problemas.push(`${nome}: ainda diz "DOI pending"`)
    if (nome !== 'CHECKSUMS.txt' && !t.includes(CFG.doi)) problemas.push(`${nome}: não declara o DOI real`)
    // A menção à Wikipédia só é aceitável dentro da NOTA DE CORREÇÃO, que diz
    // que a atribuição anterior estava errada. Fora dela, é o erro voltando.
    if (CFG.wikipediaSoNaCorrecao && /wikipedia/i.test(t) && !/Correction/i.test(t)) problemas.push(`${nome}: cita Wikipédia fora da nota de correção`)
  }
  return problemas
}

async function api(caminho, opcoes = {}) {
  const r = await fetch(`${BASE}${caminho}`, { ...opcoes, headers: { 'X-Dataverse-key': TOKEN, ...(opcoes.headers || {}) } })
  const t = await r.text()
  let j = null
  try { j = JSON.parse(t) } catch {}
  return { ok: r.ok, status: r.status, json: j, texto: t.slice(0, 300) }
}

async function main() {
  console.log(`Bundle: ${BUNDLE} · ${PID} · modo: ${MODO.toUpperCase()}\n`)

  const problemas = conferirTexto()
  if (problemas.length) {
    console.error('❌ TRAVA DE CONTEÚDO, nada foi enviado:')
    for (const p of problemas) console.error('   · ' + p)
    process.exit(1)
  }
  console.log(`✅ trava passou: declara ${CFG.doi}, sem "DOI pending"${CFG.wikipediaSoNaCorrecao ? ', Wikipédia só na nota de correção' : ' (Wikipédia é a procedência declarada deste bundle)'}\n`)

  const v = await api(`/api/datasets/:persistentId/versions/:latest?persistentId=${PID}`)
  if (!v.ok) { console.error('❌ não consegui ler o dataset:', v.status, v.texto); process.exit(1) }
  const d = v.json.data
  console.log(`dataset: v${d.versionNumber}.${d.versionMinorNumber} ${d.versionState} · ${d.files.length} arquivos\n`)

  const mapa = new Map(d.files.map((f) => [f.dataFile.filename, f.dataFile]))
  const trocar = []
  for (const nome of ARQUIVOS) {
    const remoto = mapa.get(nome)
    if (!remoto) { console.error(`❌ ${nome} não existe no depósito`); process.exit(1) }
    const local = readFileSync(`${DIR}/${nome}`)
    const igual = md5(local) === remoto.md5
    console.log(`${igual ? '=' : '≠'} ${nome.padEnd(14)} harvard=${remoto.md5.slice(0, 10)} origem=${md5(local).slice(0, 10)}${igual ? '  (já idêntico, pula)' : '  → substituir'}`)
    if (!igual) trocar.push({ nome, id: remoto.id })
  }

  if (!trocar.length) { console.log('\nNada a fazer: os 3 já estão idênticos à origem.'); return }
  if (MODO === 'conferir') { console.log(`\n${trocar.length} arquivo(s) a substituir. Rode com "publicar" para executar.`); return }

  for (const { nome, id } of trocar) {
    // multipart via curl.exe: PowerShell 5.1 é sofrimento para isso
    const saida = execFileSync('curl.exe', [
      '-s', '-X', 'POST', `${BASE}/api/files/${id}/replace`,
      '-H', `X-Dataverse-key: ${TOKEN}`,
      '-F', `file=@${DIR}/${nome}`,
      '-F', 'jsonData={"forceReplace":true}',
    ], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
    const ok = /"status":"OK"/.test(saida)
    console.log(`${ok ? '✅' : '❌'} substituído ${nome}${ok ? '' : ' · ' + saida.slice(0, 200)}`)
    if (!ok) { console.error('abortando antes de publicar'); process.exit(1) }
  }

  // Troca de arquivo exige versão MAIOR; o Dataverse não aceita minor.
  const pub = await api(`/api/datasets/:persistentId/actions/:publish?persistentId=${PID}&type=major`, { method: 'POST' })
  console.log(`\n${pub.ok ? '✅' : '❌'} publicação: ${pub.status} ${pub.ok ? 'v' + pub.json.data.versionNumber + '.' + pub.json.data.versionMinorNumber : pub.texto}`)
  if (!pub.ok) process.exit(1)
}

main().catch((e) => { console.error('erro:', String(e).slice(0, 400)); process.exit(1) })
