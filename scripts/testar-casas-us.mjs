/**
 * Teste da SÉRIE de casa (lib/us-polls/casas.mjs) e dos medidores que agrupam por casa.
 *
 * O caso real é o de 17/Set/2026: a Big Data Poll trocou de rótulo no índice,
 * de "Big Data Poll (R)" para "Big Data Poll/Public Polling Project", e os
 * medidores por casa passaram a ver duas casas, uma calada desde 29/Jul e outra
 * com uma rodada só. Nada deu erro.
 *
 * Os casos cobrem os dois lados, e o segundo é o que mais importa:
 *   - JUNTAR o que a tabela afirma ser a mesma série;
 *   - NÃO juntar o que só se parece: "(R)" não se tira por regra, e o prefixo
 *     antes da barra não identifica série ("Morning Consult/Cato Institute").
 *
 * Sem rede: a listagem da casa recebe um fetch falso.
 *
 * Uso: node scripts/testar-casas-us.mjs
 */
import { SERIES_DE_CASA, serieDaCasa, nomesDaSerie } from '../lib/us-polls/casas.mjs'
import { medirCadencia } from '../lib/us-polls/atraso.mjs'
import { verificarCasasAtrasadas, buracosNoRegistro, LISTAGENS_POR_CASA } from '../lib/us-polls/fora-do-indice.mjs'
import { media } from '../lib/us-polls/collect.mjs'

let ok = 0
let falhou = 0
const caso = (nome, cond) => {
  if (cond) {
    ok++
    console.log(`  ✅ ${nome}`)
  } else {
    falhou++
    console.log(`  ❌ ${nome}`)
  }
}

const AGORA = new Date('2026-09-17T17:00:00Z')
const linha = (instituto, campoFim, dem, rep, amostraTipo = 'LV', amostra = 2600) => ({
  instituto,
  campoInicio: campoFim,
  campoFim,
  amostra,
  amostraTipo,
  margemErro: 1.7,
  dem,
  rep,
  outros: 100 - dem - rep,
  vantagemDem: dem - rep,
  fontePrimaria: 'https://example.com',
  origem: 'indice-wikipedia',
})

// A série real, mensal, com o rótulo velho até julho e o novo em setembro.
const bigDataVelha = ['2026-01-24', '2026-02-18', '2026-03-24', '2026-04-28', '2026-05-27', '2026-06-28', '2026-07-29'].map(
  (d) => linha('Big Data Poll (R)', d, 48, 37),
)
const bigDataNova = [linha('Big Data Poll/Public Polling Project', '2026-09-15', 48, 37)]

console.log('\n1. a tabela')
caso('rótulo velho da Big Data vai para a série', serieDaCasa('Big Data Poll (R)') === 'Big Data Poll')
caso('rótulo novo da Big Data vai para a MESMA série', serieDaCasa('Big Data Poll/Public Polling Project') === 'Big Data Poll')
caso('Focaldata vai para a série com o parceiro', serieDaCasa('Focaldata') === 'Focaldata/Financial Times')
caso('nome fora da tabela volta intacto', serieDaCasa('Emerson College') === 'Emerson College')
caso('valor que não é texto volta intacto, sem lançar', serieDaCasa(undefined) === undefined && serieDaCasa(null) === null)
caso('nomesDaSerie devolve os dois rótulos e a série', nomesDaSerie('Big Data Poll').length === 3)
caso('herança de protótipo não vira série ("toString")', serieDaCasa('toString') === 'toString')

console.log('\n2. o que NÃO se junta, porque só se parece')
caso('"(R)" não se tira por regra: Quantus Insights (R) fica como está', serieDaCasa('Quantus Insights (R)') === 'Quantus Insights (R)')
caso('Morning Consult/Cato Institute NÃO é Morning Consult', serieDaCasa('Morning Consult/Cato Institute') !== serieDaCasa('Morning Consult'))
caso('HarrisX/Forbes NÃO é Harvard/Harris Poll/HarrisX', serieDaCasa('HarrisX/Forbes') !== serieDaCasa('Harvard/Harris Poll/HarrisX'))
caso('toda entrada da tabela aponta para uma série escrita, sem vazio', Object.values(SERIES_DE_CASA).every((s) => typeof s === 'string' && s.length > 0))

console.log('\n3. cadência: a série renomeada NÃO fica calada')
{
  const cad = medirCadencia({ polls: [...bigDataVelha, ...bigDataNova] }, AGORA)
  const bd = cad.avaliadas.find((c) => c.instituto === 'Big Data Poll')
  caso('uma casa só, não duas', cad.avaliadas.filter((c) => /Big Data/.test(c.instituto)).length === 1)
  caso('o último campo é o de 15/Set, do rótulo novo', bd?.ultimoCampo === '2026-09-15')
  caso('não aparece como atrasada', !cad.atrasadas.some((c) => /Big Data/.test(c.instituto)))
  // A janela de cadência é de 180 dias: com agora em 17/Set, janeiro e fevereiro
  // ficam de fora, e sobram 5 rodadas do rótulo velho mais 1 do novo.
  caso('as 6 rodadas da janela de cadência contam, dos dois rótulos', bd?.rodadas === 6)
}
{
  // Controle: só o rótulo velho, que é o que os medidores viam antes do conserto.
  const cad = medirCadencia({ polls: bigDataVelha }, AGORA)
  const bd = cad.avaliadas.find((c) => c.instituto === 'Big Data Poll')
  caso('controle: sem a rodada nova, a série fica calada desde 29/Jul', bd?.ultimoCampo === '2026-07-29')
}

console.log('\n4. listagem própria: o registro é achado pela série')
{
  caso('o registro tem a chave da série', Boolean(LISTAGENS_POR_CASA['Big Data Poll']))
  caso('o registro NÃO tem mais a chave do rótulo velho', !LISTAGENS_POR_CASA['Big Data Poll (R)'])
  const cadFalsa = { atrasadas: [{ instituto: 'Big Data Poll' }], avaliadas: [{ instituto: 'Big Data Poll' }] }
  const ver = await verificarCasasAtrasadas({ polls: [...bigDataVelha, ...bigDataNova] }, cadFalsa, {
    agora: AGORA,
    fetchImpl: async () => {
      throw new Error('não deveria ir à rede: a casa não tem URL de listagem')
    },
  })
  caso('o último campo no índice sai pela série: 15/Set', ver.resultados[0]?.ultimoCampoNoIndice === '2026-09-15')
  caso('buracosNoRegistro acha a nota da série, não "nao esta no registro"', buracosNoRegistro(cadFalsa)[0]?.nota !== 'nao esta no registro')
}

console.log('\n4b. exposição: o efeito de casa é medido sobre as rodadas da série')
{
  // Campo de comparação: três outras casas em cada data da Big Data, e uma rodada
  // recente para a média servida existir. A Big Data mede 3 pontos acima do campo.
  const outras = []
  for (const d of ['2026-03-24', '2026-04-28', '2026-05-27', '2026-06-28', '2026-07-29', '2026-09-10']) {
    outras.push(linha('Casa A', d, 47, 39), linha('Casa B', d, 46, 40), linha('Casa C', d, 48, 41))
  }
  const polls = [...bigDataVelha, ...outras]
  const dados = { polls, mediaAfos: media(polls, 30, AGORA) }
  const cad = { atrasadas: [{ instituto: 'Big Data Poll', cadenciaDias: 30, ultimoCampo: '2026-07-29' }] }
  // Importado aqui para não pesar nos outros casos se o módulo mudar de forma.
  const { medirExposicao } = await import('../lib/us-polls/exposicao.mjs')
  const ex = medirExposicao(dados, cad, { agora: AGORA })
  const bd = ex?.porCasa?.find((c) => c.instituto === 'Big Data Poll')
  caso('a série com rótulo velho é achada pela exposição', Boolean(bd))
  caso('as 5 rodadas da janela de cadência são observadas', bd?.rodadasObservadas === 5)
  caso('não cai em "sem efeito medível"', !ex?.semEfeitoMedivel?.some((c) => c.instituto === 'Big Data Poll'))
  // Big Data D+11 contra o campo SEM ela, (8 + 6 + 7) / 3 = D+7: efeito de +4.
  // Se o campo não excluísse a série pelo nome dela, a própria casa entraria no
  // campo, (8 + 6 + 7 + 11) / 4 = D+8, e o efeito encolheria para +3.
  caso('o efeito de casa é +4,00pp, com a série fora do próprio campo', bd?.efeitoDeCasaPp === 4)
}

console.log('\n5. a média NÃO usa a série: identidade de rodada segue pelo nome cru')
{
  const m = media([...bigDataVelha, ...bigDataNova, linha('Emerson College', '2026-09-10', 50, 42)], 30, AGORA)
  caso('a rodada nova entra com o rótulo que o índice escreveu', m.incluidas.some((p) => p.instituto === 'Big Data Poll/Public Polling Project'))
  caso('nenhuma linha da média foi renomeada para a série', !m.incluidas.some((p) => p.instituto === 'Big Data Poll'))
}

console.log(`\n${falhou ? '❌ REPROVADO' : '✅ APROVADO'}: ${ok} passaram, ${falhou} falharam`)
process.exit(falhou ? 1 : 0)
