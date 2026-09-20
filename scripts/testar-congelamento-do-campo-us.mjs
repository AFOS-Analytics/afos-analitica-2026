#!/usr/bin/env node
/**
 * Casos plantados da régua do congelamento do campo.
 * Uso: node scripts/testar-congelamento-do-campo-us.mjs
 */
import { blocosDeCongelamento, medirCongelamento, VEREDITOS, MIN_TRAVAMENTOS } from '../lib/us-polls/congelamento-do-campo.mjs'

let passes = 0
let falhas = 0
const conferir = (nome, ok, visto) => {
  if (ok) { passes++; console.log(`  ✅ ${nome}`) }
  else { falhas++; console.log(`  ❌ ${nome}${visto !== undefined ? `  → viu ${JSON.stringify(visto)}` : ''}`) }
}

const r = (dia, campo, extra = {}) => ({ lastUpdate: dia, campoMaisRecente: campo, ...extra })
/** n registros seguidos com o mesmo campo, a partir de um dia de setembro. */
const bloco = (n, campo, diaInicio) =>
  Array.from({ length: n }, (_, i) => r(`2026-09-${String(diaInicio + i).padStart(2, '0')}`, campo))

console.log('\n1· blocosDeCongelamento agrupa consecutivos iguais')
{
  const b = blocosDeCongelamento([...bloco(3, '2026-08-31', 1), ...bloco(2, '2026-09-11', 4)])
  conferir('dois blocos', b.length === 2, b.length)
  conferir('o primeiro tem 3', b[0].n === 3, b[0].n)
  conferir('o segundo tem 2', b[1].n === 2, b[1].n)
  conferir('e guarda o intervalo', b[0].de === '2026-09-01' && b[0].ate === '2026-09-03', [b[0].de, b[0].ate])
}

console.log('\n2· 🔀 a série vem do Neon em ordem DECRESCENTE e tem de ser ordenada')
{
  const crescente = [...bloco(3, '2026-08-31', 1), ...bloco(2, '2026-09-11', 4)]
  const b1 = blocosDeCongelamento(crescente)
  const b2 = blocosDeCongelamento([...crescente].reverse())
  conferir('mesma contagem nas duas ordens', b1.map((x) => x.n).join() === b2.map((x) => x.n).join(), [b1.map((x) => x.n), b2.map((x) => x.n)])
  conferir('e as datas de início batem', b1[0].de === b2[0].de, [b1[0].de, b2[0].de])
}

console.log('\n3· 🕳️ buraco QUEBRA o bloco, não costura dois num só')
{
  const com = [...bloco(2, '2026-08-31', 1), r('2026-09-03', null), ...bloco(2, '2026-08-31', 4)]
  const b = blocosDeCongelamento(com)
  conferir('vira DOIS blocos de 2, não um de 4', b.length === 2 && b[0].n === 2 && b[1].n === 2, b.map((x) => x.n))
  const ileg = [...bloco(2, '2026-08-31', 1), { lastUpdate: '2026-09-03', ilegivel: true }, ...bloco(2, '2026-08-31', 4)]
  conferir('ilegível também quebra', blocosDeCongelamento(ileg).length === 2, blocosDeCongelamento(ileg).length)
}

console.log('\n4· entrada que não é array explode, não some calada')
{
  for (const mau of [null, undefined, 'x', 42]) {
    let lancou = false
    try { blocosDeCongelamento(mau) } catch { lancou = true }
    conferir(`${JSON.stringify(mau)} explode`, lancou)
  }
}

console.log('\n5· O CASO REAL de 19/Set: 2 contra mediana 7,5 e máximo 19')
{
  // do mais antigo para o mais novo, como a série real
  const serie = [
    ...bloco(5, '2026-07-29', 1),   // cortado na borda, sai da distribuição
    ...bloco(19, '2026-08-04', 6),
    ...bloco(10, '2026-08-17', 25),
  ]
  // remonta com dias distintos para nao repetir chave
  const s2 = serie.map((x, i) => r(`2026-${String(7 + Math.floor(i / 28)).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`, x.campoMaisRecente))
  const comAtual = [...s2, ...bloco(11, '2026-08-31', 1).map((x, i) => r(`2026-10-${String(i + 1).padStart(2, '0')}`, x.campoMaisRecente)),
    ...bloco(2, '2026-09-11', 1).map((x, i) => r(`2026-11-${String(i + 1).padStart(2, '0')}`, x.campoMaisRecente)),
    ...bloco(1, '2026-09-15', 1).map((x, i) => r(`2026-11-${String(i + 10).padStart(2, '0')}`, x.campoMaisRecente)),
    ...bloco(2, '2026-09-17', 1).map((x, i) => r(`2026-12-${String(i + 1).padStart(2, '0')}`, x.campoMaisRecente))]
  const m = medirCongelamento(comAtual)
  conferir('o bloco ATUAL é o último', m.atual.campo === '2026-09-17' && m.atual.n === 2, [m.atual.campo, m.atual.n])
  conferir('veredito DENTRO DO NORMAL', m.veredito === VEREDITOS.DENTRO, m.veredito)
  conferir('o bloco atual NÃO entra na distribuição', !m.anteriores.some((b) => b.campo === '2026-09-17'))
  conferir('e o mais antigo, cortado na borda, também não', !m.anteriores.some((b) => b.campo === '2026-07-29'))
  conferir('declara que o bloco atual está ABERTO', m.aindaAberto === true)
}

console.log('\n6· travamento longo é reconhecido como longo')
{
  const s = [...bloco(2, 'a', 1), ...bloco(1, 'b', 3), ...bloco(2, 'c', 4), ...bloco(1, 'd', 6), ...bloco(9, 'e', 7)]
  const m = medirCongelamento(s)
  conferir('9 contra mediana pequena sai LONGO ou RECORDE', m.veredito === VEREDITOS.LONGO || m.veredito === VEREDITOS.RECORDE, m.veredito)
}

console.log('\n7· 🕳️ O PORTÃO QUE NÃO PODE DISPARAR: poucos travamentos não viram veredito')
{
  const s = [...bloco(2, 'a', 1), ...bloco(3, 'b', 3), ...bloco(1, 'c', 6)]
  const m = medirCongelamento(s)
  conferir('sai INDETERMINADO', m.veredito === VEREDITOS.INDETERMINADO, m.veredito)
  conferir('o motivo diz o mínimo', m.motivo.includes(String(MIN_TRAVAMENTOS)))
  conferir('e ainda assim devolve o bloco atual', m.atual !== null)
}

console.log('\n8· série vazia não vira aprovação')
{
  const m = medirCongelamento([])
  conferir('INDETERMINADO', m.veredito === VEREDITOS.INDETERMINADO, m.veredito)
  conferir('atual é null', m.atual === null)
}

console.log('\n9· 🏷️ ANTI-RÓTULO: o motivo não pode falar do MUNDO')
{
  const s = [...bloco(2, 'a', 1), ...bloco(3, 'b', 3), ...bloco(1, 'c', 6), ...bloco(4, 'd', 7), ...bloco(2, 'e', 11)]
  const m = medirCongelamento(s)
  conferir('não diz "sem pesquisa"', !/sem pesquisa/i.test(m.motivo), m.motivo)
  conferir('não diz "ninguém publicou"', !/ningu[ée]m publicou/i.test(m.motivo))
  conferir('nenhum veredito fala do mundo', !Object.values(VEREDITOS).some((v) => /pesquisa|mundo|instituto/i.test(v)))
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
