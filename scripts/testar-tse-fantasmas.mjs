/**
 * testar-tse-fantasmas.mjs — casos plantados para a conta de conjuntos.
 *
 * 🔑 A régua da casa: o conferidor que eu escrevo também é um medidor, e o pior
 * defeito é o portão que NÃO PODE disparar. Por isso há caso cujo resultado
 * certo é ZERO, e há o caso que existe só porque a CONTAGEM não o distingue.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */

import {
  compararFantasmas,
  formatarFantasmas,
  lerFantasmas,
  ultimoFantasmas,
  serializarFantasmas,
  vereditoEditorial,
  aFrenteDaCasa,
  mesmaAssinatura,
} from './lib/tse-fantasmas.mjs'

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

const reg = (quando, protocolos) => ({ quando, protocolos })

console.log('\n🧪 CONJUNTO DE FANTASMAS DO TSE\n')

// 1. Primeira rodada: não há contra o que comparar, e a resposta NÃO é "zero saíram".
{
  const r = compararFantasmas(null, ['BR001', 'BR002'])
  ok('primeira rodada devolve primeira:true', r.primeira === true)
  ok('primeira rodada NÃO inventa lista vazia', r.sairam === null && r.voltaram === null)
  ok('primeira rodada guarda os atuais', r.atuais.join(',') === 'BR001,BR002')
}

// 2. Conjunto idêntico: o resultado certo é ZERO nos dois lados.
{
  const r = compararFantasmas(reg('t1', ['BR002', 'BR001']), ['BR001', 'BR002'])
  ok('conjunto idêntico: nenhuma saída', r.sairam.length === 0)
  ok('conjunto idêntico: nenhuma volta', r.voltaram.length === 0)
  ok('conjunto idêntico independe da ORDEM', r.atuais.join(',') === 'BR001,BR002')
}

// 3. Uma retirada nova, que é o caso de 10 e 11/Set.
{
  const r = compararFantasmas(reg('t1', ['BR001']), ['BR001', 'BR002'])
  ok('uma saída é nomeada', r.sairam.join(',') === 'BR002')
  ok('uma saída não inventa volta', r.voltaram.length === 0)
}

// 4. Uma reposição: o TSE devolveu a linha ao arquivo.
{
  const r = compararFantasmas(reg('t1', ['BR001', 'BR002']), ['BR001'])
  ok('uma volta é nomeada', r.voltaram.join(',') === 'BR002')
  ok('uma volta não inventa saída', r.sairam.length === 0)
}

// 5. 🔴 O CASO QUE JUSTIFICA O ARQUIVO: saída E volta na mesma janela.
//    A contagem vai de 2 para 2 e a subtração dá ZERO, ou seja, a contagem
//    afirma "nada aconteceu" enquanto dois protocolos se moveram.
{
  const anterior = reg('t1', ['BR001', 'BR002'])
  const atual = ['BR001', 'BR003']
  const r = compararFantasmas(anterior, atual)
  ok('a CONTAGEM não muda neste caso', anterior.protocolos.length === atual.length)
  ok('saída e volta aparecem separadas', r.sairam.join(',') === 'BR003' && r.voltaram.join(',') === 'BR002')
  const texto = formatarFantasmas(anterior, r).join('\n')
  ok('o relato AVISA que a contagem esconde os dois', texto.includes('se cancelam'))
}

// 6. Duas saídas de uma vez, ordenadas.
{
  const r = compararFantasmas(reg('t1', ['BR005']), ['BR009', 'BR005', 'BR007'])
  ok('duas saídas saem ordenadas', r.sairam.join(',') === 'BR007,BR009')
}

// 7. Duplicata na entrada não vira fantasma a mais.
{
  const r = compararFantasmas(reg('t1', ['BR001']), ['BR001', 'BR002', 'BR002'])
  ok('duplicata é colapsada', r.atuais.length === 2 && r.sairam.join(',') === 'BR002')
}

// 8. Registro anterior SEM o campo `protocolos` é base ausente, não base vazia.
//    Sem isto, um registro velho de outro formato faria toda a base atual
//    aparecer como "saiu agora", que é um alarme inteiro falso.
{
  const r = compararFantasmas({ quando: 't1' }, ['BR001', 'BR002'])
  ok('anterior sem `protocolos` devolve primeira:true', r.primeira === true)
  ok('anterior sem `protocolos` NÃO acusa saída em massa', r.sairam === null)
}

// 9. Leitura do JSONL: linha quebrada ABORTA em vez de virar lista vazia.
{
  let abortou = false
  try {
    lerFantasmas('{"quando":"t1","protocolos":[]}\n{isto não é json}\n')
  } catch {
    abortou = true
  }
  ok('linha quebrada aborta a leitura', abortou)
  ok('texto vazio devolve lista vazia', lerFantasmas('').length === 0)
  const h = lerFantasmas(
    serializarFantasmas(reg('2026-09-11T00:00:00Z', ['BR002'])) + serializarFantasmas(reg('2026-09-10T00:00:00Z', ['BR001'])),
  )
  ok('ultimoFantasmas ordena por `quando`, não pela ordem do arquivo', ultimoFantasmas(h).protocolos.join(',') === 'BR002')
  ok('ultimoFantasmas devolve null em histórico vazio', ultimoFantasmas([]) === null)
}

// 10. IDENTIDADE: o protocolo sozinho e chave, nao resposta. Acrescentado em
// 13/Set/2026, quando 2 sairam e foi preciso um SEGUNDO script para saber se
// alguma importava.
{
  const r = compararFantasmas(reg('t1', ['BR001']), ['BR001', 'BR002'])
  const ident = { BR002: { nacional: false, divulgacao: '2026-09-15', instituto: 'APURA PARANA' } }
  const semId = formatarFantasmas(reg('t1', ['BR001']), r).join('|')
  const comId = formatarFantasmas(reg('t1', ['BR001']), r, ident).join('|')
  ok('sem identidade o formato antigo e preservado', semId.includes('      BR002'))
  ok('com identidade sai a casa', comId.includes('APURA PARANA'))
  ok('com identidade sai o escopo', comId.includes('estadual'))
  ok('com identidade sai a divulgacao', comId.includes('div 2026-09-15'))
}

// 11. O PORTAO QUE NAO PODE DISPARAR, e o que TEM de disparar. O discriminador
// e 'NACIONAL' em caixa alta, que so existe no ramo que dispara.
{
  const r = compararFantasmas(reg('t1', []), ['BR100'])
  const HOJE = '2026-09-13'
  const D = (l) => l.join('|').includes('NACIONAL com')
  const viva = { BR100: { nacional: true, divulgacao: '2026-09-20', instituto: 'CASA X' } }
  const vencida = { BR100: { nacional: true, divulgacao: '2026-09-01', instituto: 'CASA X' } }
  const estadual = { BR100: { nacional: false, divulgacao: '2026-09-20', instituto: 'CASA X' } }
  ok('nacional com divulgacao A FRENTE dispara', D(vereditoEditorial(r, viva, HOJE)))
  ok('nacional ja VENCIDA nao dispara', !D(vereditoEditorial(r, vencida, HOJE)))
  ok('estadual a frente nao dispara', !D(vereditoEditorial(r, estadual, HOJE)))
  ok('divulgacao IGUAL a hoje ainda e viva', D(vereditoEditorial(r, { BR100: { nacional: true, divulgacao: HOJE } }, HOJE)))
  ok('quando nao dispara, ele AFIRMA que esta limpo', vereditoEditorial(r, estadual, HOJE).join('|').includes('nada a corrigir'))
}

// 12. O MEDIDOR MUDO: sem identidade a resposta NAO pode ser 'nenhuma nacional'.
{
  const r = compararFantasmas(reg('t1', []), ['BR100'])
  const semNada = vereditoEditorial(r, undefined, '2026-09-13').join('|')
  ok('sem identidade ele AVISA', semNada.includes('Sem identidade dos protocolos'))
  ok('sem identidade ele NAO afirma que esta limpo', !semNada.includes('nada a corrigir'))
  const parcial = vereditoEditorial(r, { BR999: { nacional: true, divulgacao: '2026-09-20' } }, '2026-09-13').join('|')
  ok('protocolo sem ficha e declarado, nao some', parcial.includes('BR100') && parcial.includes('sem ficha'))
}

// 13. Sem retirada, o veredito e silencio, nao 'esta tudo bem'.
{
  const semSaida = compararFantasmas(reg('t1', ['BR001']), ['BR001'])
  ok('sem retirada o veredito e vazio', vereditoEditorial(semSaida, {}, '2026-09-13').length === 0)
  ok('primeira rodada nao emite veredito', vereditoEditorial(compararFantasmas(null, ['BR001']), {}, '2026-09-13').length === 0)
}

// 14. O QUE A CASA TEM À FRENTE, reproduzindo a rodada de 16/Set/2026: saiu a
// BR-01431 (American Analytics, nacional, div no proprio dia) e a casa tinha a
// BR-02587 para 21/Set com a mesma assinatura. A BR-09521 de JUNHO tem a mesma
// assinatura e ja venceu: e ela que prova que assinatura nao e re-registro.
{
  const HOJE = '2026-09-16'
  const MET = 'Pesquisa quantitativa, com realização de entrevistas pessoais.'
  const retirada = { nacional: true, divulgacao: HOJE, instituto: 'AMERICAN ANALYTICS', cnpj: 'C1', amostra: 2000, valorPesquisa: 50000, metodologia: MET }
  const arq = [
    { protocolo: 'BR025872026', cnpj: 'C1', nacional: true, registroDate: '2026-09-15', campoInicio: '2026-09-15', campoFim: '2026-09-20', divulgacao: '2026-09-21', amostra: 2000, valorPesquisa: 50000, metodologia: 'PESQUISA quantitativa,  com realizacao de entrevistas pessoais.' },
    { protocolo: 'BR095212026', cnpj: 'C1', nacional: true, registroDate: '2026-06-10', divulgacao: '2026-06-16', amostra: 2000, valorPesquisa: 50000, metodologia: MET },
    { protocolo: 'BR000012026', cnpj: 'C1', nacional: false, divulgacao: '2026-09-25', amostra: 800, valorPesquisa: 9000, metodologia: 'estadual' },
    { protocolo: 'BR000022026', cnpj: 'OUTRA', nacional: true, divulgacao: '2026-09-18', amostra: 2000, valorPesquisa: 50000, metodologia: MET },
  ]
  const af = aFrenteDaCasa(retirada, arq, HOJE)
  ok('a frente: so a nacional FUTURA da mesma casa', af.aFrente.map((p) => p.protocolo).join() === 'BR025872026', JSON.stringify(af.aFrente.map((p) => p.protocolo)))
  ok('a frente: assinatura igual apesar de caixa, acento e espaco', af.aFrente[0]?.assinaturaIgual === true)
  ok('a frente: a assinatura conta a de JUNHO tambem (taxa-base)', af.comAssinatura === 2, String(af.comAssinatura))
  ok('a frente: registros da casa contam a estadual', af.registrosDaCasa === 3, String(af.registrosDaCasa))
  ok('a frente: divulgacao IGUAL a hoje entra', aFrenteDaCasa(retirada, [{ ...arq[0], divulgacao: HOJE }], HOJE).aFrente.length === 1)
  ok('a frente: n diferente nao e mesma assinatura', !mesmaAssinatura(retirada, { ...arq[0], amostra: 2001 }))
  ok('a frente: custo diferente nao e mesma assinatura', !mesmaAssinatura(retirada, { ...arq[0], valorPesquisa: 50001 }))
  ok('a frente: sem CNPJ devolve null, nunca lista vazia', aFrenteDaCasa({ ...retirada, cnpj: '' }, arq, HOJE) === null)

  const r = compararFantasmas(reg('t1', []), ['BR014312026'])
  const ident = { BR014312026: retirada }
  const txt = vereditoEditorial(r, ident, HOJE, arq).join('|')
  ok('veredito com arquivo lista a data nova', txt.includes('BR025872026') && txt.includes('div 2026-09-21'))
  ok('veredito com arquivo NAO afirma re-registro', txt.includes('NÃO prova re-registro') && txt.includes('2 de 3'))
  ok('veredito sem arquivo fica no formato antigo, byte a byte',
    vereditoEditorial(r, ident, HOJE).join('|') === vereditoEditorial(r, ident, HOJE, undefined).join('|') && !vereditoEditorial(r, ident, HOJE).join('|').includes('↳') && !vereditoEditorial(r, ident, HOJE).join('|').includes('sem CNPJ'))
  const nada = vereditoEditorial(r, ident, HOJE, [arq[1], arq[3]]).join('|')
  ok('casa sem nada a frente AFIRMA isso', nada.includes('NÃO tem outra nacional'))
  const semCnpj = vereditoEditorial(r, { BR014312026: { ...retirada, cnpj: undefined } }, HOJE, arq).join('|')
  ok('sem CNPJ ele AVISA e nao diz que a casa nao tem nada', semCnpj.includes('sem CNPJ') && !semCnpj.includes('NÃO tem outra'))
  ok('assinatura diferente nao imprime a ressalva', !vereditoEditorial(r, ident, HOJE, [{ ...arq[0], amostra: 1 }]).join('|').includes('NÃO prova'))
}

// 15. O "HOJE" PADRAO e a data civil do BRASIL. Relogio falso em 17/Set 01:30Z,
// que e 16/Set 22:30 em Brasilia: a retirada nacional com divulgacao em 16/Set
// TEM de disparar. Com o padrao UTC de antes de 16/Set/2026 ela saia "nada a
// corrigir no calendario". O relogio falso e o unico jeito de este caso reprovar
// a mutacao, porque fora da faixa das 21h as duas datas coincidem.
{
  const DataReal = globalThis.Date
  const FIXO = DataReal.parse('2026-09-17T01:30:00Z')
  globalThis.Date = class extends DataReal {
    constructor(...a) {
      super(...(a.length ? a : [FIXO]))
    }
    static now() {
      return FIXO
    }
  }
  try {
    const r = compararFantasmas(reg('t1', []), ['BR100'])
    const ident = { BR100: { nacional: true, divulgacao: '2026-09-16', instituto: 'CASA X' } }
    const D = (l) => l.join('|').includes('NACIONAL com')
    ok('22h30 BRT: veredito padrao usa a data do Brasil', D(vereditoEditorial(r, ident)))
    ok('22h30 BRT: formatarFantasmas sem hoje usa a data do Brasil', D(formatarFantasmas(reg('t1', []), r, ident)))
  } finally {
    globalThis.Date = DataReal
  }
}

console.log(`\n   ${passou} asserção(ões) passaram, ${falhou} falharam\n`)
process.exit(falhou === 0 ? 0 : 1)
