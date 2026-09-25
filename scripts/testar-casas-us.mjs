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
import {
  SERIES_DE_CASA,
  CASAS_DECLARADAS,
  PAPEIS,
  serieDaCasa,
  nomesDaSerie,
  mesmaCasa,
  ordemDeEmpate,
  compararEmpate,
  conferirCarga,
} from '../lib/us-polls/casas.mjs'
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

console.log('\n5. a média USA a série, e isso mudou em 25/Set/2026')
{
  // 🔴 Esta seção afirmava o CONTRÁRIO, e a premissa caiu. Ela dizia "a média
  // NÃO usa a série: identidade de rodada segue pelo nome cru", e isso valia
  // para o caso que criou a tabela, em que o nome muda ENTRE ondas. Não vale
  // quando o índice escreve a MESMA onda duas vezes, o caso de 25/Set/2026.
  // A janela de 30 dias a partir de 17/Set deixa de fora tudo de bigDataVelha,
  // cuja ultima rodada e de 29/Jul, entao a onda de 25/Ago entra aqui de
  // proposito: sem DUAS ondas dentro da janela nao se testa o anti-excesso.
  const bdAgosto = linha('Big Data Poll (R)', '2026-08-25', 46, 38)
  const m = media([...bigDataVelha, ...bigDataNova, bdAgosto, linha('Emerson College', '2026-09-10', 50, 42)], 30, AGORA)
  caso('a rodada da casa entra com o nome da SÉRIE', m.incluidas.some((p) => p.instituto === 'Big Data Poll'))
  caso(
    'e o rótulo do ÍNDICE fica ao lado, em institutoNoIndice',
    m.incluidas.some((p) => p.institutoNoIndice === 'Big Data Poll/Public Polling Project')
  )
  // ⛔ ANTI-EXCESSO: colapsar o NOME nao pode colapsar ONDAS. Os dois rotulos
  // caem em ondas diferentes (25/Ago e 15/Set) e tem de contar duas rodadas.
  caso('duas ondas da MESMA casa seguem sendo DUAS rodadas', m.incluidas.filter((p) => p.instituto === 'Big Data Poll').length === 2)
  caso('e as duas vieram de rotulos diferentes do indice', new Set(m.incluidas.filter((p) => p.instituto === 'Big Data Poll').map((p) => p.institutoNoIndice)).size === 2)
  caso('e a casa conta como UM instituto', m.institutos.filter((i) => i.startsWith('Big Data')).length === 1)
  // ⛔ E o que NÃO pode mudar: a linha de polls[] segue com o nome do índice.
  caso('nada foi renomeado na transcrição do índice', bigDataNova[0].instituto === 'Big Data Poll/Public Polling Project')
}

console.log('\n6. os tres pares de 25/Set/2026, e quem EXECUTA e o nome que fica')
caso('Fox News e o veiculo, Beacon/Shaw executa', serieDaCasa('Fox News') === 'Beacon Research (D)/ Shaw & Co. Research (R)')
caso('Activote colapsa em ActiVote', serieDaCasa('Activote') === 'ActiVote')
caso('Marquette curto colapsa no longo', serieDaCasa('Marquette Law School') === 'Marquette University Law School')
caso('serie canoniza em si mesma', serieDaCasa('ActiVote') === 'ActiVote')
caso('mesmaCasa junta o par declarado', mesmaCasa('Fox News', 'Beacon Research (D)/ Shaw & Co. Research (R)'))
caso('mesmaCasa separa casas diferentes', !mesmaCasa('Emerson College', 'Echelon Insights'))

console.log('\n7. ANTI-EXCESSO do casamento: nada por semelhanca')
caso('nome NAO declarado passa inteiro', serieDaCasa('Casa Nova LLC') === 'Casa Nova LLC')
caso('grafia parecida e NAO declarada passa inteira', serieDaCasa('activote') === 'activote')
caso('ACTIVOTE em caixa alta NAO e absorvida', serieDaCasa('ACTIVOTE') === 'ACTIVOTE')
caso('Fox News Poll NAO e Fox News', serieDaCasa('Fox News Poll') === 'Fox News Poll')
caso('nao-string volta como veio', serieDaCasa(undefined) === undefined)

console.log('\n8. a carga da tabela: entrada sem prova e opiniao')
caso('a tabela real nao tem erro de carga', conferirCarga().length === 0)
caso('a tabela real tem 5 casas', CASAS_DECLARADAS.length === 5)
caso('os 3 papeis previstos', Object.keys(PAPEIS).sort().join(',') === 'grafia,serie,veiculo')
{
  const base = () => [
    {
      serie: 'Casa A',
      conferidoEm: '2026-09-25',
      motivo: 'motivo',
      variantes: [
        {
          nome: 'Casa A Veiculo',
          papel: 'veiculo',
          prova: { url: 'https://x' },
          motivo: 'm',
          assinatura: 'a|b|1|LV',
          valores: ['50/40'],
        },
      ],
    },
  ]
  const err = (r, agulha) => conferirCarga(r).some((e) => e.includes(agulha))
  const semCampo = (f) => {
    const r = base()
    delete r[0][f]
    return r
  }
  const semVar = (f) => {
    const r = base()
    delete r[0].variantes[0][f]
    return r
  }
  caso('entrada sem conferidoEm reprova', err(semCampo('conferidoEm'), 'sem conferidoEm'))
  caso('entrada sem motivo reprova', err(semCampo('motivo'), 'sem motivo'))
  caso('entrada sem serie reprova', err(semCampo('serie'), 'sem serie'))
  caso('entrada sem variantes reprova', err(semCampo('variantes'), 'nao colapsa nada'.replace('nao', 'não')))
  caso('variante sem prova reprova', err(semVar('prova'), 'sem prova'))
  caso('variante sem motivo reprova', err(semVar('motivo'), 'sem motivo'))
  caso('variante sem assinatura reprova', err(semVar('assinatura'), 'sem assinatura'))
  caso('variante sem valores reprova', err(semVar('valores'), 'sem valores'))
  {
    const r = base()
    r[0].variantes[0].prova = { onde: 'conferido no topline impresso' }
    caso('papel veiculo SEM url reprova, porque afirma quem executou', err(r, 'exige url'))
    const r2 = base()
    r2[0].variantes[0].papel = 'grafia'
    r2[0].variantes[0].prova = { onde: 'conferido no topline impresso' }
    caso('papel grafia aceita prova por ONDE, sem url', conferirCarga(r2).length === 0)
    const r3 = base()
    r3[0].variantes[0].papel = 'serie'
    delete r3[0].variantes[0].assinatura
    delete r3[0].variantes[0].valores
    caso('papel serie NAO exige assinatura: os dois nomes nunca dividem uma onda', conferirCarga(r3).length === 0)
  }
  {
    const r = base()
    r[0].variantes[0].papel = 'inventado'
    caso('papel fora da lista reprova', err(r, 'não é um de'))
  }
  {
    const r = base()
    r[0].variantes[0].nome = 'Casa A'
    caso('variante igual a serie reprova', err(r, 'igual à série'))
  }
  {
    const r = base()
    r.push({
      serie: 'Casa B',
      conferidoEm: '2026-09-25',
      motivo: 'm',
      variantes: [{ nome: 'Casa A', papel: 'serie', prova: { onde: 'x' }, motivo: 'm' }],
    })
    caso('variante que e serie de outra entrada reprova', err(r, 'cadeia de nomes'))
  }
  {
    const r = base()
    r.push({
      serie: 'Casa C',
      conferidoEm: '2026-09-25',
      motivo: 'm',
      variantes: [{ nome: 'Casa A Veiculo', papel: 'serie', prova: { onde: 'x' }, motivo: 'm' }],
    })
    caso('mesmo nome declarado duas vezes reprova', err(r, 'declarada em'))
  }
}

console.log('\n9. o desempate entre duas linhas da MESMA rodada')
{
  const REG = [
    {
      serie: 'Executor Ltda',
      conferidoEm: '2026-09-25',
      motivo: 'm',
      variantes: [
        { nome: 'Veiculo TV', papel: 'veiculo', prova: { url: 'https://x' }, motivo: 'm', assinatura: 's', valores: ['51/44'] },
      ],
    },
  ]
  const oe = (o) => ordemDeEmpate(o, REG)
  caso(
    'decimal ganha de inteiro',
    compararEmpate(oe({ dem: 52.3, rep: 47.7, instituto: 'X' }), oe({ dem: 52, rep: 48, instituto: 'X' })) > 0
  )
  caso(
    'com os dois inteiros, o nome da SERIE ganha',
    compararEmpate(oe({ dem: 51, rep: 44, instituto: 'Executor Ltda' }), oe({ dem: 51, rep: 44, instituto: 'Veiculo TV' })) > 0
  )
  caso('empate exato devolve 0', compararEmpate([1, 2, 'a'], [1, 2, 'a']) === 0)
  // 🔴 O caso que um teste mais fraco NAO via: ali a serie tambem era a primeira em
  // ordem alfabetica, entao o desempate alfabetico dava a MESMA resposta e apagar a
  // regra do nome da serie passava. Aqui a serie vem DEPOIS no alfabeto.
  const REG_Z = [
    {
      serie: 'Zebra Executor',
      conferidoEm: '2026-09-25',
      motivo: 'm',
      variantes: [
        { nome: 'Alfa Veiculo', papel: 'veiculo', prova: { url: 'https://x' }, motivo: 'm', assinatura: 's', valores: ['51/44'] },
      ],
    },
  ]
  caso(
    'serie alfabeticamente ATRAS ainda ganha da variante',
    compararEmpate(
      ordemDeEmpate({ dem: 51, rep: 44, instituto: 'Zebra Executor' }, REG_Z),
      ordemDeEmpate({ dem: 51, rep: 44, instituto: 'Alfa Veiculo' }, REG_Z)
    ) > 0
  )
  caso(
    'sem serie e sem decimal, ordem alfabetica e nunca a de leitura',
    compararEmpate(oe({ dem: 1, rep: 1, instituto: 'AAA' }), oe({ dem: 1, rep: 1, instituto: 'ZZZ' })) > 0
  )

  console.log('\n10. a regra onde ela AGE: dentro da media')
  const HOJE = new Date('2026-09-25T12:00:00Z')
  const l = (o) => ({ campoInicio: '2026-09-11', campoFim: '2026-09-14', amostra: 1000, amostraTipo: 'LV', dem: 51, rep: 44, ...o })
  const med = (polls, reg) => media(polls, 30, HOJE, reg)
  const par = [l({ instituto: 'Executor Ltda' }), l({ instituto: 'Veiculo TV' })]
  caso('par declarado conta UMA rodada', med(par, REG).nPesquisas === 1)
  caso('par declarado conta UM instituto', med(par, REG).nInstitutos === 1)
  caso('a casa que sobra e a serie', med(par, REG).institutos.join('|') === 'Executor Ltda')
  caso('SEM a tabela, conta duas rodadas', med(par, []).nPesquisas === 2)
  caso('SEM a tabela, dois institutos', med(par, []).nInstitutos === 2)
  caso('duas casas NAO declaradas seguem sendo duas rodadas', med([l({ instituto: 'Casa X' }), l({ instituto: 'Casa Y' })], REG).nPesquisas === 2)
  const duasOndas = [l({ instituto: 'Executor Ltda' }), l({ instituto: 'Executor Ltda', campoFim: '2026-09-21', dem: 53, rep: 42 })]
  caso('duas ONDAS da mesma casa seguem sendo duas rodadas', med(duasOndas, REG).nPesquisas === 2)
  caso('duas ondas da mesma casa sao UM instituto', med(duasOndas, REG).nInstitutos === 1)
  const ondaEVeiculo = [l({ instituto: 'Executor Ltda' }), l({ instituto: 'Veiculo TV', campoFim: '2026-09-21', dem: 53, rep: 42 })]
  caso('colapso de nome NAO junta ondas diferentes', med(ondaEVeiculo, REG).nPesquisas === 2)
  const precisao = [l({ instituto: 'Executor Ltda', dem: 52, rep: 48 }), l({ instituto: 'Veiculo TV', dem: 52.3, rep: 47.7 })]
  caso('a linha mais PRECISA e a que fica', med(precisao, REG).incluidas[0].dem === 52.3)
  caso('e ela fica sob o nome da serie', med(precisao, REG).incluidas[0].instituto === 'Executor Ltda')
  caso('com o rotulo do indice ao lado', med(precisao, REG).incluidas[0].institutoNoIndice === 'Veiculo TV')
  caso('sem colapso, NAO ha institutoNoIndice', !('institutoNoIndice' in med([l({ instituto: 'Casa X' })], REG).incluidas[0]))
  // 🔴 E o RECORTE continua mandando: a hierarquia e anterior ao desempate.
  const recorte = [
    l({ instituto: 'Executor Ltda', amostraTipo: 'A', amostra: 2000, dem: 45, rep: 40 }),
    l({ instituto: 'Veiculo TV', amostraTipo: 'LV', amostra: 800, dem: 51, rep: 44 }),
  ]
  caso('LV do veiculo ganha do recorte A da serie', med(recorte, REG).incluidas[0].amostraTipo === 'LV')
  caso('e a amostra maior NAO inverte a hierarquia', med(recorte, REG).incluidas[0].dem === 51)
  // 🧬 O caso REAL de Marquette: o nome curto vem ANTES no alfabeto, entao a linha
  // que fica so e a do nome longo por causa da preferencia declarada.
  const marq = ['Marquette University Law School', 'Marquette Law School'].map((n) =>
    l({ instituto: n, campoInicio: '2026-09-02', campoFim: '2026-09-09', amostra: 581, dem: 54, rep: 41 })
  )
  caso('Marquette: uma rodada so', media(marq, 30, HOJE).nPesquisas === 1)
  caso('Marquette: fica a linha escrita com o nome longo', !('institutoNoIndice' in media(marq, 30, HOJE).incluidas[0]))
}


console.log(`\n${falhou ? '❌ REPROVADO' : '✅ APROVADO'}: ${ok} passaram, ${falhou} falharam`)
process.exit(falhou ? 1 : 0)
