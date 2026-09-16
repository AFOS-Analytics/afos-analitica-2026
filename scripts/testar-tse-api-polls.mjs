/**
 * testar-tse-api-polls.mjs — casos plantados para o teto da API e o gatilho do dia.
 *
 * 🔑 A régua da casa: o conferidor que eu escrevo também é um medidor, e o pior
 * defeito é o portão que NÃO PODE disparar. Aqui há os dois lados: o que tem de
 * disparar (nacional hoje, com zero inserida), o que não pode (estadual hoje,
 * nacional amanhã, nacional hoje que já saiu do registro) e o medidor mudo
 * (zero sobre base cortada, zero sobre base vazia).
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */

import {
  TETO_API_POLLS,
  bordaDoCorte,
  dataDeDivulgacao,
  diaInteiro,
  divulgamHoje,
  folgaDoGatilho,
} from './lib/tse-api-polls.mjs'

let passou = 0
let falhou = 0

function ok(nome, condicao, detalhe = '') {
  if (condicao) {
    passou++
  } else {
    falhou++
    console.log(`   ❌ ${nome}${detalhe ? `  ${detalhe}` : ''}`)
    return
  }
  console.log(`   ✅ ${nome}`)
}

function lanca(fn) {
  try {
    fn()
    return false
  } catch {
    return true
  }
}

const HOJE = '2026-09-14'
const reg = (protocolo, publicationDate, scope = 'national') => ({ protocolo, publicationDate, scope })
const muitas = (n, data) => Array.from({ length: n }, (_, i) => reg(`BR${i}`, data, 'state'))

console.log('\n🧪 TETO DA API E GATILHO DO DIA\n')

// 1. O teto é o da rota.
ok('teto é 200, o take da rota', TETO_API_POLLS === 200)

// 2. Abaixo do teto a resposta está inteira, e a borda é NULA, não uma data.
{
  const linhas = muitas(199, '2026-09-01')
  ok('199 linhas: sem corte', bordaDoCorte(linhas) === null)
  ok('sem corte, qualquer dia está inteiro', diaInteiro('2026-01-01', null))
}

// 3. No teto, a borda é a MENOR data servida, que é o caso medido de 14/Set.
{
  const linhas = [...muitas(150, '2026-09-10'), ...muitas(50, '2026-09-03')]
  const borda = bordaDoCorte(linhas)
  ok('200 linhas: borda na menor data', borda === '2026-09-03', `veio ${borda}`)
  ok('dia DEPOIS da borda está inteiro', diaInteiro('2026-09-04', borda))
  ok('dia NA borda NÃO está inteiro (empate também é cortado)', !diaInteiro('2026-09-03', borda))
  ok('dia ANTES da borda NÃO está inteiro', !diaInteiro('2026-08-20', borda))
}

// 4. A ordem da resposta não pode importar para a borda.
{
  const linhas = [...muitas(100, '2026-09-03'), ...muitas(100, '2026-09-10')]
  ok('borda independe da ordem das linhas', bordaDoCorte(linhas) === '2026-09-03')
}

// 5. No teto sem data legível, nada é inteiro.
{
  const linhas = muitas(200, null)
  const borda = bordaDoCorte(linhas)
  ok('teto sem datas: borda máxima', borda === '9999-12-31')
  ok('teto sem datas: nem hoje está inteiro', !diaInteiro(HOJE, borda))
}

// 6. Data em ISO completo conta como o dia; formato DD/MM não é lido como data.
ok('ISO completo vira o dia', dataDeDivulgacao({ publicationDate: '2026-09-14T00:00:00.000Z' }) === HOJE)
ok('DD/MM não é data', dataDeDivulgacao({ publicationDate: '14/09/2026' }) === '')

// 7. DISPARA: nacional com divulgação hoje, que é o caso de 14/Set (NEXUS e Quaest).
{
  const r = divulgamHoje([reg('BR040762026', HOJE), reg('BR036072026', HOJE), reg('X', '2026-09-17')], HOJE)
  ok('duas nacionais hoje: DISPARA', r.gatilho === 'DISPARA')
  ok('as duas são nomeadas', r.vivas.map((l) => l.protocolo).join(',') === 'BR040762026,BR036072026')
}

// 8. NÃO PODE disparar: estadual hoje, nacional amanhã, nacional ontem.
{
  const linhas = [reg('E', HOJE, 'state'), reg('U', HOJE, 'unknown'), reg('A', '2026-09-15'), reg('O', '2026-09-13')]
  const r = divulgamHoje(linhas, HOJE)
  ok('estadual/unknown hoje e nacional fora do dia: NÃO dispara', r.gatilho === 'NAO_DISPARA')
  ok('nenhuma viva inventada', r.vivas.length === 0)
}

// 9. NÃO PODE disparar: a nacional de hoje já saiu do registro do TSE.
{
  const r = divulgamHoje([reg('F', HOJE)], HOJE, { ehFantasma: (l) => l.protocolo === 'F' })
  ok('nacional hoje que é fantasma: NÃO dispara', r.gatilho === 'NAO_DISPARA')
  ok('ela aparece como fantasma, não some', r.fantasmas.length === 1 && r.vivas.length === 0)
}

// 10. MEDIDOR MUDO: zero sobre base cortada que alcança hoje é INDETERMINADO, não "não dispara".
{
  const r = divulgamHoje([reg('A', '2026-09-15')], HOJE, { borda: HOJE })
  ok('zero com borda em hoje: INDETERMINADO', r.gatilho === 'INDETERMINADO')
  const r2 = divulgamHoje([reg('A', '2026-09-15')], HOJE, { borda: '2026-09-03' })
  ok('zero com borda antes de hoje: NÃO dispara', r2.gatilho === 'NAO_DISPARA')
}

// 11. Achar é afirmação mesmo sobre base cortada.
{
  const r = divulgamHoje([reg('N', HOJE)], HOJE, { borda: HOJE })
  ok('nacional hoje com borda em hoje: ainda DISPARA', r.gatilho === 'DISPARA')
}

// 12. Base vazia e data malformada não viram zero.
ok('base vazia lança', lanca(() => divulgamHoje([], HOJE)))
ok('hoje malformado lança', lanca(() => divulgamHoje([reg('N', HOJE)], '14/09/2026')))
ok('diaInteiro com dia malformado lança', lanca(() => diaInteiro('ontem', null)))

// 13. FOLGA DO GATILHO, acrescentado em 16/Set/2026, quando o corte chegou à
// janela padrão de 15 dias. Hoje INCLUSO, ontem fora, e a contagem só é exata
// enquanto a borda fica antes de hoje.
{
  const base = [...muitas(150, '2026-09-01'), ...muitas(30, HOJE), ...muitas(20, '2026-09-20')]
  const f = folgaDoGatilho(base, HOJE)
  ok('folga: conta hoje e o futuro', f.aFrente === 50, String(f.aFrente))
  ok('folga: teto menos os de hoje em diante', f.folga === 150 && f.teto === 200)
  ok('folga: borda antes de hoje é EXATA', f.exata === true)
  ok('folga: ontem NÃO entra', folgaDoGatilho([reg('A', '2026-09-13'), reg('B', HOJE)], HOJE).aFrente === 1)
  ok('folga: abaixo do teto é exata', folgaDoGatilho([reg('A', HOJE)], HOJE).exata === true)
  const c = folgaDoGatilho(muitas(200, HOJE), HOJE)
  ok('folga: borda EM hoje vira PISO', c.exata === false && c.folga === 0)
  ok('folga: sem linhas lança', lanca(() => folgaDoGatilho([], HOJE)))
  ok('folga: hoje malformado lança', lanca(() => folgaDoGatilho(base, '16/09')))
}

console.log(`\n${falhou === 0 ? '✅' : '❌'} ${passou} passaram, ${falhou} falharam\n`)
process.exit(falhou === 0 ? 0 : 1)
