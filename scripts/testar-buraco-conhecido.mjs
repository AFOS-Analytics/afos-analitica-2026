#!/usr/bin/env node
/**
 * Testa `lib/us-polls/buraco-conhecido.mjs`.
 *
 * 🔴 O DEFEITO QUE ELE GUARDA: o passo 7.5 imprime a mesma lista de buracos
 *    todo dia, em branco, e cada passada refaz a investigação do zero. Em dois
 *    dias seguidos isso custou a conferência inteira de duas casas.
 *
 * ⛔ E o ERRO SIMÉTRICO, que é o que mais assusta: um registro de buraco
 *    diagnosticado é a maneira mais fácil de transformar buraco em silêncio.
 *    Metade dos casos existe para provar que ele ANOTA e nunca REMOVE.
 */
import { diagnosticoDe, conferirCarga, SITUACOES, BURACOS_CONHECIDOS } from '../lib/us-polls/buraco-conhecido.mjs'

let ok = 0
let mau = 0
// 🔴 `JSON.stringify(NaN)` é a string "null", então comparar por JSON faz NaN
//    passar por null. O tipo entra na comparação.
const marca = (x) => (typeof x === 'number' && Number.isNaN(x) ? 'NaN' : JSON.stringify(x))
const eq = (nome, a, b) => {
  if (marca(a) === marca(b)) ok++
  else {
    mau++
    console.log(`  ❌ ${nome}\n     esperado ${marca(b)}\n     veio     ${marca(a)}`)
  }
}

console.log('\n🔬 buraco-conhecido\n')

const base = {
  casa: 'Casa X',
  campoInicio: '2026-09-01',
  campoFim: '2026-09-05',
  situacao: 'FONTE_NAO_LOCALIZADA',
  medidoEm: '2026-09-06',
  revisarApos: '2026-09-20',
  nota: 'procurei no blog',
}
const reg = (o = {}) => [{ ...base, ...o }]
const bloqueio = {
  status: 429,
  medidoEm: '2026-09-06',
  controlePositivo: 'outro host 200 no mesmo minuto',
}

// ══ ANTI-EXCESSO: ele ANOTA, nunca REMOVE ════════════════════════════════
// Esta é a asserção mais importante do arquivo. Se um dia alguém acrescentar
// um campo que o chamador possa ler como "tire da contagem", ela reprova.
{
  const d = diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg(), '2026-09-10')
  eq('o diagnóstico volta para uma rodada registrada', d.situacao, 'FONTE_NAO_LOCALIZADA')
  eq('🔴 e as chaves são EXATAMENTE estas, nenhuma que mande remover',
    Object.keys(d).sort(),
    ['acao', 'acesso', 'descricao', 'medidoEm', 'nota', 'revisarApos', 'situacao', 'vencido'])
  for (const proibida of ['deve', 'remover', 'buraco', 'ignorar', 'silenciar', 'excluir']) {
    eq(`nenhuma chave "${proibida}"`, proibida in d, false)
  }
}

// ══ ANTI-EXCESSO: só responde pela rodada EXATA ══════════════════════════
{
  eq('casa fora do registro devolve null', diagnosticoDe('Outra', '2026-09-01', '2026-09-05', reg(), '2026-09-10'), null)
  eq('mesma casa, campoInicio diferente, devolve null', diagnosticoDe('Casa X', '2026-09-02', '2026-09-05', reg(), '2026-09-10'), null)
  eq('mesma casa, campoFim diferente, devolve null', diagnosticoDe('Casa X', '2026-09-01', '2026-09-06', reg(), '2026-09-10'), null)
  eq('sem casa devolve null', diagnosticoDe('', '2026-09-01', '2026-09-05', reg(), '2026-09-10'), null)
  eq('sem data devolve null', diagnosticoDe('Casa X', '', '2026-09-05', reg(), '2026-09-10'), null)
  eq('registro vazio devolve null', diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', [], '2026-09-10'), null)
}

// ══ O PRAZO: diagnóstico que não vence vira crença ═══════════════════════
{
  const antes = diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg(), '2026-09-19')
  const noDia = diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg(), '2026-09-20')
  const depois = diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg(), '2026-09-21')
  eq('antes do prazo, não vencido', antes.vencido, false)
  eq('NO dia do prazo, ainda não vencido', noDia.vencido, false)
  eq('depois do prazo, VENCIDO', depois.vencido, true)
  eq('e a ação vencida manda RECONFERIR', /RECONFERIR|reconferir/.test(depois.acao), true)
  eq('a ação não vencida é a da situação', antes.acao, SITUACOES.FONTE_NAO_LOCALIZADA.acao)
  eq('data como objeto Date também funciona', diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg(), new Date('2026-09-21T12:00:00Z')).vencido, true)
}

// ══ ANTI-EXCESSO: entrada malformada fica INERTE, não dá diagnóstico errado ═
{
  eq('situação inventada devolve null', diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg({ situacao: 'CHUTE' }), '2026-09-10'), null)
  eq('sem revisarApos devolve null', diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg({ revisarApos: undefined }), '2026-09-10'), null)
  eq('revisarApos malformado devolve null', diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg({ revisarApos: '20/09/2026' }), '2026-09-10'), null)
}

console.log('🔎 conferirCarga\n')

// ══ ANTI-SILÊNCIO: carga malformada é ACUSADA, uma causa por vez ═════════
{
  eq('o registro real passa', conferirCarga(), [])
  eq('carga boa não acusa', conferirCarga(reg()), [])
  const sem = (campo, valor) => conferirCarga(reg({ [campo]: valor }))
  eq('sem casa é acusado', sem('casa', '').length, 1)
  eq('campoInicio malformado é acusado', sem('campoInicio', '01/09/2026').length, 1)
  eq('campoFim malformado é acusado', sem('campoFim', '').length, 1)
  eq('situação inventada é acusada', sem('situacao', 'CHUTE').length, 1)
  eq('medidoEm malformado é acusado', sem('medidoEm', '').length, 1)
  eq('🔴 sem revisarApos é acusado', sem('revisarApos', undefined).length, 1)
  eq('e o aviso nomeia a CRENÇA', /crença/.test(sem('revisarApos', undefined)[0]), true)
  eq('sem nota é acusado', sem('nota', '').length, 1)
}

// ══ ANTI-SILÊNCIO: bloqueio exige PROVA de que não é o nosso leitor ══════
{
  const bloq = (acesso) => conferirCarga(reg({ situacao: 'FONTE_INACESSIVEL', acesso }))
  eq('FONTE_INACESSIVEL sem acesso é acusado', bloq(undefined).length, 1)
  eq('acesso sem controle positivo é acusado', bloq({ status: 429, medidoEm: '2026-09-06' }).length, 1)
  eq('e o aviso diz POR QUE o controle importa', /leitor quebrado/.test(bloq({ status: 429, medidoEm: '2026-09-06' })[0]), true)
  eq('acesso sem medidoEm é acusado', bloq({ status: 429, controlePositivo: 'x' }).length, 1)
  eq('status como texto é acusado', bloq({ status: '429', medidoEm: '2026-09-06', controlePositivo: 'x' }).length, 1)
  eq('acesso completo passa', bloq(bloqueio), [])
  // 🔑 `status: 0` é o host que NÃO RESOLVE, e `!a.status` o rejeitaria. A
  //    guarda é de TIPO, nunca de valor.
  eq('status 0 PASSA, porque é medição legítima de DNS morto', bloq({ ...bloqueio, status: 0 }), [])
}

// ══ A fronteira: acesso onde não houve bloqueio declara bloqueio falso ═══
{
  eq('🔴 acesso em FONTE_NAO_LOCALIZADA é acusado', conferirCarga(reg({ acesso: bloqueio })).length, 1)
  eq('acesso em AGUARDANDO_INDICE é acusado', conferirCarga(reg({ situacao: 'AGUARDANDO_INDICE', acesso: bloqueio })).length, 1)
  eq('AGUARDANDO_INDICE sem acesso passa', conferirCarga(reg({ situacao: 'AGUARDANDO_INDICE' })), [])
}

// ══ as situações declaradas, e todas dizem o que FAZER ═══════════════════
{
  eq('são três situações', Object.keys(SITUACOES).sort(), ['AGUARDANDO_INDICE', 'FONTE_INACESSIVEL', 'FONTE_NAO_LOCALIZADA'])
  for (const [nome, s] of Object.entries(SITUACOES)) {
    eq(`${nome} tem descrição`, Boolean(s.descricao), true)
    eq(`${nome} diz o que FAZER`, Boolean(s.acao), true)
  }
  eq('só FONTE_INACESSIVEL exige acesso', Object.entries(SITUACOES).filter(([, s]) => s.exigeAcesso).map(([n]) => n), ['FONTE_INACESSIVEL'])
}

// ══ as entradas REAIS, porque registro sem caso é registro não medido ════
{
  eq('o registro tem entrada', BURACOS_CONHECIDOS.length > 0, true)
  const cr = BURACOS_CONHECIDOS.find((e) => e.casa === 'Change Research')
  eq('a Change Research está registrada', Boolean(cr), true)
  eq('e com o 429 medido', cr.acesso.status, 429)
  eq('e com controle positivo', /200/.test(cr.acesso.controlePositivo), true)
}

console.log(`\n${mau ? '❌ REPROVADO' : '✅ APROVADO'}: ${ok} passaram, ${mau} falharam\n`)
if (mau) process.exit(1)
