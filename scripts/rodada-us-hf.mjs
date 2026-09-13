#!/usr/bin/env node
/**
 * SUBIDA DO DATASET US 2026 AO HUGGING FACE — atalho de ORQUESTRAÇÃO.
 *
 * ⛔ Este arquivo NÃO tem regra própria. O build vive nos dois `build-us-2026-*`,
 *    o portão de encolhimento e a conferência depois da subida vivem no
 *    `hf-upload-us2026.py`, com casos plantados em `testar-hf-upload-us2026.py`.
 *
 * 🔴 POR QUE EXISTE, medido em 13/Set/2026. A subida era improvisada a cada
 *    passada, em cinco comandos, e duas coisas decididas em 12/Set não estavam em
 *    lugar nenhum: o conserto do certificado (feito à mão naquele dia) e a
 *    conferência DEPOIS da subida, que é quem responde se publicou, e não a barra
 *    de progresso do envio.
 *
 * A ordem:
 *   1. dados        build-us-2026-dataset.mjs   (backup do Neon, pesquisas, imprensa)
 *   2. metadados    build-us-2026-metadata.mjs  (README, DATASHEET, CHECKSUMS)
 *   3. portão       conferir: nenhum arquivo encolhe, e nenhum fica sem ser lido
 *   4. subir        só se o portão aprovou
 *   5. conferir     --exato: todo arquivo do staging publicado com as mesmas linhas
 *
 * ⚠️ ELE PUBLICA um dataset aberto. Por isso o padrão é `--ensaio` NÃO: quem roda
 *    sem flag sobe. Para só montar e conferir, `--ensaio`.
 *
 * Uso:
 *   node scripts/rodada-us-hf.mjs --ensaio                 monta e confere, não sobe
 *   node scripts/rodada-us-hf.mjs "mensagem do commit"     monta, confere, sobe e reconfere
 *   node scripts/rodada-us-hf.mjs "msg" --declarado=data/erratas/encolhimento-AAAA-MM-DD.json
 */

import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const ensaio = argv.includes('--ensaio')
const declarado = argv.find((a) => a.startsWith('--declarado='))
const mensagem = argv.find((a) => !a.startsWith('--')) || 'Atualiza serie de mercado, imprensa e metadados'
const PY = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3')
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' }
const regua = '─'.repeat(72)

const passos = [
  { id: 'dados', titulo: '1/5 · DADOS', cmd: process.execPath, args: ['scripts/build-us-2026-dataset.mjs'], bloqueante: true },
  { id: 'metadados', titulo: '2/5 · METADADOS', cmd: process.execPath, args: ['scripts/build-us-2026-metadata.mjs'], bloqueante: true },
  { id: 'portao', titulo: '3/5 · PORTÃO — nada encolhe, nada fica sem ler', cmd: PY, args: ['scripts/hf-upload-us2026.py', 'conferir', ...(declarado ? [declarado] : [])], bloqueante: true },
  { id: 'subir', titulo: '4/5 · SUBIR', cmd: PY, args: ['scripts/hf-upload-us2026.py', 'subir', mensagem, ...(declarado ? [declarado] : [])], bloqueante: true, pular: ensaio },
  { id: 'conferir', titulo: '5/5 · CONFERIR DEPOIS — publicado = staging', cmd: PY, args: ['scripts/hf-upload-us2026.py', 'conferir', '--exato'], pular: ensaio },
]

const resultados = []
console.log('')
console.log(`🤗 SUBIDA DO DATASET US 2026 · ${new Date().toISOString()}${ensaio ? '  [ENSAIO: não sobe]' : ''}`)

for (const p of passos) {
  console.log('')
  console.log(regua)
  if (p.pular) {
    console.log(`⏭️  ${p.titulo}  PULADO por --ensaio`)
    resultados.push({ ...p, estado: 'PULADO', codigo: null })
    continue
  }
  console.log(`▶️  ${p.titulo}`)
  console.log(regua)
  const r = spawnSync(p.cmd, p.args, { stdio: 'inherit', env })
  const codigo = r.error ? null : r.status
  resultados.push({ ...p, codigo, estado: codigo === 0 ? 'ok' : r.error ? `não executou (${r.error.message})` : 'saiu != 0' })
  if (p.bloqueante && codigo !== 0) {
    console.log('')
    console.log(`🛑 PARADO em ${p.id}. Nada depois dele rodou.`)
    break
  }
}

console.log('')
console.log(regua)
console.log('📋 RESUMO')
for (const r of resultados) {
  const marca = r.estado === 'PULADO' ? '⏭️ ' : r.codigo === 0 ? '✅' : '❌'
  console.log(`   ${marca} ${r.id.padEnd(10)} ${r.estado}`)
}
const conferido = resultados.find((r) => r.id === 'conferir')
if (conferido && conferido.codigo === 0) console.log('\n   ✅ o publicado confere com o staging, arquivo por arquivo')
else if (!ensaio) console.log('\n   ⚠️ SEM prova de publicação: o passo 5 não aprovou ou não rodou')
console.log('   ⚠️ linha não é conteúdo: rotação do mesmo tamanho sai como +0\n')
process.exit(resultados.every((r) => r.estado === 'PULADO' || r.codigo === 0) ? 0 : 1)
