/**
 * testar-data-corrente-imprensa.mjs · casos plantados para
 * `lib/us-press/data-corrente.mjs`. Sem rede, sem banco, sem relógio real.
 *
 * 🔴 O caso central é o de 15/Set/2026 às 01:10Z: sem arquivo da data corrente,
 * o arquivador o criaria com a coleta da madrugada e o dia congelaria parcial.
 *
 * Uso: node scripts/testar-data-corrente-imprensa.mjs
 */
import { readFileSync } from 'fs'
import {
  ultimoCronDoDia,
  agendaDaRota,
  decidirDataCorrente,
  ACOES,
  FOLGA_MIN,
} from '../lib/us-press/data-corrente.mjs'

let falhas = 0
let passes = 0
function ok(nome, cond, detalhe = '') {
  if (cond) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? ` — ${detalhe}` : ''}`)
  }
}

const CRON = { hora: 19, minuto: 20 }

console.log('\n── a agenda ──')
ok('lê o último cron de "20 7,13,19 * * *"', JSON.stringify(ultimoCronDoDia('20 7,13,19 * * *')) === '{"hora":19,"minuto":20}')
ok('ordem das horas não importa', ultimoCronDoDia('20 19,7,13 * * *')?.hora === 19)
ok('hora única', JSON.stringify(ultimoCronDoDia('5 6 * * *')) === '{"hora":6,"minuto":5}')
ok('passo (*/30) não é entendido: devolve null, não chuta', ultimoCronDoDia('*/30 * * * *') === null)
ok('dia da semana restrito não é entendido', ultimoCronDoDia('20 7,13,19 * * 1') === null)
ok('hora 24 é inválida', ultimoCronDoDia('20 7,24 * * *') === null)
ok('texto que não é agenda devolve null', ultimoCronDoDia('todo dia') === null && ultimoCronDoDia(undefined) === null)
ok('acha a agenda da rota no vercel.json', agendaDaRota({ crons: [{ path: '/a', schedule: '1 1 * * *' }, { path: '/api/cron/refresh-us-press', schedule: '20 7,13,19 * * *' }] }, '/api/cron/refresh-us-press') === '20 7,13,19 * * *')
ok('rota ausente devolve null', agendaDaRota({ crons: [] }, '/x') === null && agendaDaRota({}, '/x') === null)

console.log('\n── o vercel.json REAL, para a agenda não mudar calada ──')
{
  const real = JSON.parse(readFileSync('vercel.json', 'utf8'))
  const u = ultimoCronDoDia(agendaDaRota(real, '/api/cron/refresh-us-press'))
  ok('a agenda real da imprensa é legível', u !== null, JSON.stringify(u))
}

console.log('\n── a decisão ──')
{
  const d = decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T01:10:37Z', ultimoCron: CRON })
  ok('🔴 15/Set 01:10Z sem arquivo: ADIAR', d.acao === ACOES.ADIAR, d.motivo)
  ok('e o motivo diz o horário a partir do qual pode', /19:30 UTC/.test(d.motivo), d.motivo)
}
ok('às 19:20Z em ponto ainda adia (a coleta pode estar gravando)', decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T19:20:00Z', ultimoCron: CRON }).acao === ACOES.ADIAR)
ok(`um minuto antes da folga de ${FOLGA_MIN} ainda adia`, decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T19:29:59Z', ultimoCron: CRON }).acao === ACOES.ADIAR)
ok('na borda da folga já cria', decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T19:30:00Z', ultimoCron: CRON }).acao === ACOES.CRIAR)
ok('às 23:50Z cria', decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T23:50:00Z', ultimoCron: CRON }).acao === ACOES.CRIAR)
ok('com arquivo existente, REGERA a qualquer hora', decidirDataCorrente({ jaExiste: true, agora: '2026-09-15T01:10:00Z', ultimoCron: CRON }).acao === ACOES.REGERAR)
ok('--dia-corrente força a criação cedo', decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T01:10:00Z', ultimoCron: CRON, forcar: true }).acao === ACOES.CRIAR)
ok('⛔ agenda ilegível ADIA, nunca cria', decidirDataCorrente({ jaExiste: false, agora: '2026-09-15T23:00:00Z', ultimoCron: null }).acao === ACOES.ADIAR)
ok('⛔ relógio ilegível ADIA', decidirDataCorrente({ jaExiste: false, agora: 'ontem', ultimoCron: CRON }).acao === ACOES.ADIAR)

console.log(`\n${falhas ? '❌ REPROVADO' : '✅ APROVADO'}: ${passes} passaram, ${falhas} falharam\n`)
process.exitCode = falhas ? 1 : 0
