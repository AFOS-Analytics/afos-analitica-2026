// Harvard Dataverse - USA 2026 Midterms (doi:10.7910/DVN/XRUT8U).
//
// Atualiza o deposito a partir do bundle local, que e o MESMO conteudo do
// espelho publicado no Hugging Face (conferido byte a byte antes de subir).
// Substitui APENAS os arquivos que DIFEREM, e publica versao MAIOR.
//
// AS REGRAS QUE ESTE SCRIPT CARREGA, todas medidas em producao:
//
// 1. O mapa caminho -> dataFile.id sai da API, NUNCA de um plano em disco.
//    Medido em 10/Set/2026 no Brasil: o plano estatico guardava ids da versao
//    anterior e o Harvard TROCA o id a cada substituicao, entao a trava de
//    nao-regressao reprovou 11 de 11 dizendo "id nao esta no deposito".
//
// 2. O Dataverse INGERE tabular: um .csv enviado vira .tab no deposito. Casar
//    pelo nome-base sozinho junta tse-registry.csv com tse-registry.json, que
//    sao arquivos diferentes. O casamento e por caminho COM a extensao mapeada.
//
// 3. Comparar exige ?format=original. O .tab e uma CONVERSAO, e comparar o
//    original com a conversao acusaria diferenca em todo tabular, sempre.
//
// 4. Esperar a trava de INGESTAO zerar antes de CADA envio. Medido em 25/Ago
//    neste mesmo deposito: 6 de 26 falharam com HTTP 400, INTERCALADOS com
//    sucessos. Falha alternada e trava; falha em bloco seria credencial.
//
// 5. Nao tocar em dsDescription. A moderacao do Harvard barrou 9 publicacoes em
//    22/Jul por URL nesse campo, e o bloqueio notifica a equipe do repositorio.
//
// 6. HTTP 403 tem DUAS causas opostas aqui: "did not pass our automated
//    metadata validation scans" e moderacao, e manda PARAR; "Re-try as major
//    release" e tipo de versao, e manda REPETIR com type=major. A mensagem
//    decide, nunca o codigo.
//
// Token: .env.local (DATAVERSE_TOKEN).
//
// Uso:
//   node scripts/harvard-publish-us2026.mjs conferir
//   node scripts/harvard-publish-us2026.mjs publicar
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'

const BASE = 'https://dataverse.harvard.edu'
const PID = 'doi:10.7910/DVN/XRUT8U'
const ORIGEM = '.cache/us2026-dataset'
const TMP = '.cache/us2026-harvard-original'
const MODO = process.argv[2] === 'publicar' ? 'publicar' : 'conferir'

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
  return { ok: r.ok, status: r.status, json: j, texto: t.slice(0, 400) }
}

const sha = (b) => createHash('sha256').update(b).digest('hex')

/** Regra 4: a trava de ingestao. */
async function esperarDestravar(tentativas = 40, intervaloMs = 3000) {
  for (let i = 1; i <= tentativas; i++) {
    const r = await api('/api/datasets/:persistentId/locks?persistentId=' + PID)
    const travas = Array.isArray(r.json && r.json.data) ? r.json.data : []
    if (!travas.length) return true
    if (i === 1) console.log('   travado (' + travas.map((t) => t.lockType).join(', ') + '), esperando...')
    await new Promise((r2) => setTimeout(r2, intervaloMs))
  }
  console.error('   a trava nao zerou; abortando')
  return false
}

async function main() {
  console.log('USA 2026 Midterms · ' + PID + ' · modo: ' + MODO.toUpperCase() + '\n')

  const v = await api('/api/datasets/:persistentId/versions/:latest?persistentId=' + PID)
  if (!v.ok) { console.error('nao li o deposito:', v.status, v.texto); process.exit(1) }
  const d = v.json.data
  console.log('deposito hoje: v' + d.versionNumber + '.' + d.versionMinorNumber + ' ' + d.versionState + ', ' + d.files.length + ' arquivos\n')

  mkdirSync(TMP, { recursive: true })
  const iguais = []
  const difere = []
  const semPar = []

  for (const f of d.files) {
    const label = f.label || f.dataFile.filename
    const dir = f.directoryLabel ? f.directoryLabel + '/' : ''
    // Regra 2: o .tab do deposito veio de um .csv nosso.
    const relLocal = dir + (label.endsWith('.tab') ? label.slice(0, -4) + '.csv' : label)
    const local = join(ORIGEM, relLocal)
    if (!existsSync(local)) { semPar.push(relLocal); continue }

    // Regra 3: baixar o ORIGINAL, nunca a conversao.
    const r = await fetch(BASE + '/api/access/datafile/' + f.dataFile.id + '?format=original',
      { headers: { 'X-Dataverse-key': TOKEN } })
    const buf = Buffer.from(await r.arrayBuffer())
    const destino = join(TMP, relLocal)
    mkdirSync(dirname(destino), { recursive: true })
    writeFileSync(destino, buf)

    const nosso = readFileSync(local)
    if (sha(buf) === sha(nosso)) { iguais.push(relLocal); continue }
    // Regra 7: o directoryLabel viaja junto, senao o replace ACHATA o deposito.
    difere.push({ rel: relLocal, id: f.dataFile.id, dir: f.directoryLabel || '', harvard: buf.length, local: nosso.length })
  }

  console.log('iguais: ' + iguais.length + ' | diferem: ' + difere.length + ' | sem par local: ' + semPar.length)
  for (const s of semPar) console.log('   SEM PAR LOCAL: ' + s)
  for (const x of difere) console.log('   DIFERE ' + x.rel.padEnd(46) + ' harvard ' + String(x.harvard).padStart(9) + ' -> local ' + String(x.local).padStart(9))

  if (semPar.length) { console.error('\nabortando: arquivo no deposito sem par na origem'); process.exit(1) }
  if (!difere.length) { console.log('\nnada a fazer: o deposito ja reflete o bundle.'); return }

  if (MODO === 'conferir') { console.log('\n' + difere.length + ' arquivo(s) a substituir. Rode com "publicar".'); return }

  for (const { rel, id, dir } of difere) {
    if (!(await esperarDestravar())) process.exit(1)
    // Regra 7, medida em 10/Set/2026 NESTE deposito: o /replace NAO herda o
    // directoryLabel do arquivo que ele substitui. Sem reenvia-lo aqui, os 15
    // arquivos que viviam em data/, polls/, press/ e raw/ foram para a RAIZ, e
    // a estrutura de pastas do deposito publicado se achatou. O envio devolve
    // "status":"OK" nos dois casos, entao o sinal so aparece relendo a versao.
    const meta = dir ? '{"forceReplace":true,"directoryLabel":"' + dir + '"}' : '{"forceReplace":true}'
    const saida = execFileSync('curl.exe', [
      '-s', '-X', 'POST', BASE + '/api/files/' + id + '/replace',
      '-H', 'X-Dataverse-key: ' + TOKEN,
      '-F', 'file=@' + join(ORIGEM, rel),
      '-F', 'jsonData=' + meta,
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    const ok = /"status":"OK"/.test(saida)
    console.log((ok ? 'OK   ' : 'ERRO ') + rel + (ok ? '' : ' · ' + saida.slice(0, 220)))
    if (!ok) { console.error('abortando antes de publicar'); process.exit(1) }
  }

  if (!(await esperarDestravar())) process.exit(1)
  const pub = await api('/api/datasets/:persistentId/actions/:publish?persistentId=' + PID + '&type=major', { method: 'POST' })
  console.log('\n' + (pub.ok ? 'OK   ' : 'ERRO ') + 'publicacao: ' + pub.status + (pub.ok ? '' : ' · ' + pub.texto))
  if (!pub.ok) {
    // Regra 6: a mensagem decide, nunca o codigo.
    if (/major release/i.test(pub.texto)) console.error('-> e TIPO DE VERSAO: repetir com type=major')
    else if (/validation scans/i.test(pub.texto)) console.error('-> e MODERACAO: PARAR, nao insistir. A equipe do repositorio foi notificada.')
    process.exit(1)
  }
}

main().catch((e) => { console.error('erro:', String(e).slice(0, 400)); process.exit(1) })
