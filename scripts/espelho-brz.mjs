/**
 * A SEQUÊNCIA do espelho do Brasil no Hugging Face, num comando só.
 *
 * ⛔ POR QUE ISTO EXISTE (10/Set/2026): a sequência existia apenas em prosa,
 * espalhada por comentários de scripts diferentes e pela mensagem do commit do
 * dia anterior. Num único espelhamento eu errei DUAS vezes por causa disso:
 *
 *   1. rodei `build-hf-tse-registry.mjs`, que lê o NOSSO banco, no lugar de
 *      `build-tse-registry-full.mjs`, que lê o arquivo público do TSE. O nome do
 *      primeiro se parece mais com o destino. Publiquei 14 colunas em vez de 22,
 *      sem `scope_source`, e 930 linhas em vez de 851, incluindo as 79 que o
 *      próprio TSE já RETIROU do arquivo dele.
 *   2. pulei `build-poll-enrichment.mjs`, e as pesquisas nacionais foram ao ar
 *      sem datação por meio de campo, sem dias até a eleição e sem
 *      `sample_design`, com `poll-divergence` e `sample-demographics` parados no
 *      dia anterior.
 *
 * Os dois erros foram SILENCIOSOS: todo passo terminou verde.
 *
 * 🔑 A ordem não é gosto, é dependência:
 *   1 resultados      regenera national-polls.json do histórico do git
 *   2 registro TSE    precisa do 1, e enriquece national-polls com tse_registration
 *   3 redação de CPF  precisa do 2, e ANTES da cópia para o staging
 *   4 export          copia hf-assets -> .cache/hf-dataset e gera a série de mercado
 *   5 enriquecimento  precisa da série de mercado do 4, e reescreve hf-assets
 *   6 export de novo  para o staging levar o que o 5 escreveu
 *
 * O envio e os checksums seguem em `python scripts/hf-mirror-brazil.py`, que tem
 * o portão de CPF fail-closed nos bytes que sobem.
 *
 * Uso: npm run espelho:brz
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const PASSOS = [
  ['resultados das nacionais', 'scripts/build-hf-poll-results.mjs'],
  ['registro do TSE, 22 campos, do ARQUIVO PÚBLICO', 'scripts/build-tse-registry-full.mjs'],
  ['redação de CPF', 'scripts/redigir-cpf-tse-registry.mjs'],
  ['export para o staging', 'scripts/export-hf-dataset.mjs'],
  ['enriquecimento analítico', 'scripts/build-poll-enrichment.mjs'],
  ['export de novo, para o staging levar o enriquecimento', 'scripts/export-hf-dataset.mjs'],
]

const MEDIDOS = [
  'hf-assets/polls/national-poll-results-firstround.csv',
  'hf-assets/polls/national-poll-results-secondround.csv',
  'hf-assets/polls/tse-registry.csv',
  'hf-assets/data/poll-divergence.csv',
  'hf-assets/polls/sample-demographics.csv',
]

const linhas = (p) => (existsSync(p) ? readFileSync(p, 'utf8').trimEnd().split('\n').length - 1 : null)
const antes = Object.fromEntries(MEDIDOS.map((p) => [p, linhas(p)]))

for (const [i, [nome, script]] of PASSOS.entries()) {
  console.log(`\n━━ ${i + 1}/${PASSOS.length} ${nome}`)
  try {
    execFileSync('node', [script], { stdio: 'inherit' })
  } catch {
    console.error(`\n❌ PAROU no passo ${i + 1} (${script}). Nada foi enviado.`)
    process.exit(1)
  }
}

// ⚠️ O enriquecimento NÃO aborta fatal por decisão dele: em erro ele loga e sai
// 0, para não estragar os artefatos-base. Então o exit code dele não responde
// "rodou direito", e quem responde é a contagem abaixo.
console.log('\n━━ contagem, antes e depois')
let parado = 0
for (const p of MEDIDOS) {
  const d = linhas(p)
  const a = antes[p]
  const delta = a === null || d === null ? '' : `(${d - a >= 0 ? '+' : ''}${d - a})`
  if (a !== null && d === a) parado++
  console.log(`  ${p.replace('hf-assets/', '').padEnd(42)} ${String(a).padStart(5)} -> ${String(d).padStart(5)} ${delta}`)
}
if (parado === MEDIDOS.length) {
  console.log('\n⚠️  TODOS parados. É o desfecho normal de um dia sem pesquisa nova, e não prova de que rodou.')
}

console.log('\n✅ sequência concluída. Agora, para publicar:')
console.log('   python scripts/hf-mirror-brazil.py subir')
console.log('   python scripts/hf-mirror-brazil.py checksums')
