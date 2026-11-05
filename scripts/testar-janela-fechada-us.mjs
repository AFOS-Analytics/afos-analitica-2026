/**
 * 🧪 A JANELA DA MÉDIA FECHA NO DIA DA ELEIÇÃO — casos plantados
 *
 * 🗳️ Decisão do André em 05/Nov/2026. Sem isto, depois de 03/Nov a janela de
 *    30 dias seguia andando sem pesquisa nova e a média murchava sozinha:
 *    D+7.73 em 05/Nov, D+7.61 em 12/Nov, D+7.48 em 20/Nov e NULA em 03/Dez.
 *
 * ⚖️ Metade ANTI-SILÊNCIO (depois da eleição a média não pode andar nem sumir)
 *    e metade ANTI-EXCESSO (antes dela nada pode mudar).
 */
import { media, fimDaJanela, DIA_DA_ELEICAO } from '../lib/us-polls/collect.mjs'

let ok = 0
let falhas = 0
const eq = (achado, esperado, nome) => {
  if (JSON.stringify(achado) === JSON.stringify(esperado)) return ok++
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}

const linha = (instituto, campoFim, dem, rep) => ({
  instituto, campoInicio: campoFim, campoFim, dem, rep, outros: 100 - dem - rep,
  vantagemDem: dem - rep, amostra: 1000, amostraTipo: 'LV',
})
const base = [
  linha('Casa A', '2026-10-05', 50, 44), // D+6, sai da janela andando em 05/Nov
  linha('Casa B', '2026-10-20', 52, 44), // D+8
  linha('Casa C', '2026-11-02', 51, 42), // D+9
]

console.log('\n🧪 a janela da média fecha no dia da eleição\n')

eq(DIA_DA_ELEICAO, '2026-11-03', 'o dia da eleição é 03/Nov/2026')

// ── ANTI-EXCESSO: antes do fim do dia da eleição, nada muda ──────────────────
const antes = new Date('2026-11-03T12:00:00Z')
eq(fimDaJanela(antes), antes, 'antes do fim do dia, o fim da janela é o agora')
const mAntes = media(base, 30, antes)
eq(mAntes.fechadaEm, undefined, 'antes da eleição não há marca de janela fechada')
eq(mAntes.vantagemDem, 7.67, 'antes da eleição a média é a de sempre (3 rodadas)')
eq(media(base, 30, new Date('2026-10-21T00:00:00Z')).vantagemDem, 7.67, 'antes da eleição a janela continua SEM teto, como sempre foi')

// ── ANTI-SILÊNCIO: depois da eleição a média PARA ─────────────────────────────
for (const d of ['2026-11-04T00:00:00Z', '2026-11-05T21:58:00Z', '2026-11-20T12:00:00Z', '2026-12-03T12:00:00Z', '2027-03-01T00:00:00Z']) {
  const m = media(base, 30, new Date(d))
  eq(m && m.vantagemDem, 7.67, `em ${d.slice(0, 10)} a média é a do dia da eleição`)
  eq(m && m.fechadaEm, '2026-11-03', `em ${d.slice(0, 10)} a média declara a janela fechada`)
}
eq(media(base, 30, new Date('2026-12-03T12:00:00Z')).desde, '2026-10-04', 'o começo da janela também para')

// ⛔ Rodada com campo DEPOIS da eleição não mexe na média do dia.
const comPosEleicao = [...base, linha('Casa D', '2026-11-10', 40, 55)]
eq(media(comPosEleicao, 30, new Date('2026-11-20T00:00:00Z')).vantagemDem, 7.67, 'rodada de campo pós-eleição fica fora da média fechada')

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
