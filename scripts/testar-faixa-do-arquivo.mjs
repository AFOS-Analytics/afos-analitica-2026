/**
 * testar-faixa-do-arquivo.mjs · casos plantados para `lib/faixa-do-arquivo.mjs`,
 * a regra que decide se um arquivo modificado é da faixa dos EUA.
 * Sem rede, sem tocar em arquivo do projeto.
 *
 * 🔑 Metade dos casos é ANTI-SILÊNCIO (o que tem de sair EUA, senão o medidor
 * chama o artefato central da faixa de "outra faixa" e eu paro de publicar sem
 * motivo) e metade é ANTI-EXCESSO (o que NÃO pode sair EUA, que é o defeito de
 * 04/Out, quando cinco arquivos do Brasil foram reivindicados como meus).
 *
 * Uso: node scripts/testar-faixa-do-arquivo.mjs
 */

import { FAIXA_EUA, FORA, caminhoDoStatus, faixaDaLinha, faixaDoCaminho } from '../lib/faixa-do-arquivo.mjs'

let falhas = 0
let passes = 0
const caso = (nome, cond, detalhe) => {
  if (cond) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? `\n     ${detalhe}` : ''}`)
  }
}

console.log('\n🧭 De quem é o arquivo: faixa dos EUA ou FORA\n')

// ── O CAMINHO, extraído da linha de status ────────────────────────────────
console.log('📄 caminhoDoStatus')
caso('modificado', caminhoDoStatus(' M public/us-polls-data.json') === 'public/us-polls-data.json')
caso('nao rastreado', caminhoDoStatus('?? public/us-press-archive/2026-10-04.json') === 'public/us-press-archive/2026-10-04.json')
caso('estagiado', caminhoDoStatus('M  lib/us-polls/collect.mjs') === 'lib/us-polls/collect.mjs')
// 🔑 Renomeação: quem vai no commit é o DESTINO.
caso('renomeado leva o DESTINO', caminhoDoStatus('R  public/velho.json -> public/us-polls-data.json') === 'public/us-polls-data.json')
// ⚠️ Porcelain cita caminho com espaço ou acento, e as aspas não são do caminho.
caso('caminho citado perde as aspas', caminhoDoStatus(' M "public/us-press-archive/com espaco.json"') === 'public/us-press-archive/com espaco.json')
caso('linha curta e ilegivel', caminhoDoStatus(' M') === null)
caso('entrada que nao e texto', caminhoDoStatus(null) === null)

// ── ANTI-SILÊNCIO: o que TEM de sair EUA ──────────────────────────────────
console.log('\n🇺🇸 anti-silencio: o que tem de ser EUA')
for (const p of [
  'public/us-polls-data.json',
  'public/us-press-data.json',
  'public/us-press-archive/2026-10-04.json',
  'public/afos-weekly/us/2026-10-01.md',
  'public/afos-weekly/us/2026-10-01.pt-BR.md',
  'public/afos-tradeoff/us/2026-09-28.md',
  'lib/us-polls/collect.mjs',
  'lib/us-polls/casas.mjs',
  'lib/us-press/data-corrente.mjs',
  'lib/us-market/estado-do-portao.ts',
  'lib/dashboard/us-static-data.ts',
  'app/api/cron/refresh-us-polls/route.ts',
  'app/[locale]/dashboard/us/page.tsx',
  'scripts/conferir-us-polls.mjs',
  'scripts/rodada-us-polls.mjs',
  'scripts/estado-da-faixa-us.mjs',
  'scripts/parse-us-generic-ballot.mjs',
  'scripts/build-us-2026-dataset.mjs',
  'scripts/hf-upload-us2026.py',
  'scripts/efeito-do-recorte-us.mjs',
  '.claude/commands/atualizar-usa.md',
  '.claude/commands/atualizar-pesquisas-usa.md',
]) caso(p, faixaDoCaminho(p) === FAIXA_EUA, `saiu ${faixaDoCaminho(p)}`)

// 🔴 O defeito de 02/Out, que esta regra não pode reintroduzir: o piso das
//    pesquisas dos EUA é o artefato CENTRAL da faixa e saía como outra faixa.
caso(
  'o piso das pesquisas NAO volta a ser outra faixa',
  faixaDaLinha(' M public/us-polls-data.json') === FAIXA_EUA,
)

// ── ANTI-EXCESSO: o que NAO pode sair EUA ─────────────────────────────────
console.log('\n⛔ anti-excesso: o que NAO pode ser EUA')
// 🔴 OS CINCO DE 04/Out/2026, que a regra antiga reivindicou como meus.
for (const p of [
  'hf-assets/data/poll-divergence.csv',
  'hf-assets/polls/national-poll-results-firstround.csv',
  'hf-assets/polls/national-poll-results-secondround.csv',
  'hf-assets/polls/national-polls.json',
  'hf-assets/polls/sample-demographics.csv',
  'hf-assets/polls/tse-registry.csv',
  'hf-assets/polls/tse-registry.json',
]) caso(`Brasil: ${p}`, faixaDoCaminho(p) === FORA, `saiu ${faixaDoCaminho(p)}`)

for (const p of [
  'public/polls-data.json',
  'public/polls-data.en.json',
  'public/analysis-criteriosa.json',
  'public/analysis-data.json',
  'public/afos-daily/2026-10-03.md',
  'public/afos-tradeoff/2026-09-28.md',
  'public/afos-weekly/br/2026-10-01.md',
  'lib/afos-daily/loader.ts',
  'lib/tse/api.ts',
  'data/tse/sondas.jsonl',
  'scripts/atualizar-brz.ts',
  'scripts/wayback-archive.ts',
  '.claude/commands/atualizar-brz.md',
]) caso(`outra faixa: ${p}`, faixaDoCaminho(p) === FORA, `saiu ${faixaDoCaminho(p)}`)

// 📌 COMPARTILHADO sai FORA de propósito, e isto é decisão e não descuido: para
//    a pergunta "posso publicar daqui?" um arquivo que os dois países usam pede
//    a mesma cautela de um da outra faixa, e afirmar autoria aqui seria inventar.
for (const p of ['README.md', 'README.pt-BR.md', 'package.json', 'vercel.json', 'scripts/capture-guard.ts', 'scripts/ler-mercado.mjs', 'scripts/serie-do-contrato.mjs']) {
  caso(`compartilhado sai FORA: ${p}`, faixaDoCaminho(p) === FORA, `saiu ${faixaDoCaminho(p)}`)
}

// ⛔ E `us` solto não basta, senão a lista deixa de ser estreita.
for (const p of ['public/census-data.json', 'lib/status/bus.ts', 'scripts/discussao-interna.mjs', 'public/campus-map.json']) {
  caso(`\`us\` dentro de palavra nao conta: ${p}`, faixaDoCaminho(p) === FORA, `saiu ${faixaDoCaminho(p)}`)
}

// ── A DIREÇÃO DO ERRO, que é o ponto da inversão ──────────────────────────
console.log('\n🧭 a direcao do erro')
caso('caminho desconhecido cai em FORA, nunca em EUA', faixaDoCaminho('inventado/que/ninguem/previu.json') === FORA)
caso('string vazia cai em FORA', faixaDoCaminho('') === FORA)
caso('entrada nao-texto cai em FORA', faixaDoCaminho(null) === FORA && faixaDoCaminho(42) === FORA)
caso('linha ilegivel cai em FORA', faixaDaLinha(' M') === FORA && faixaDaLinha(null) === FORA)
caso('prefixo ./ nao atrapalha', faixaDoCaminho('./public/us-polls-data.json') === FAIXA_EUA)

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
