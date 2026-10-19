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
const lido = {
  status: 200,
  medidoEm: '2026-09-06',
  urls: ['https://exemplo.org/painel'],
  oQueTem: 'o painel traz aprovacao presidencial e tema mais importante, e a serie do congresso para em Ago',
}

// ══ ANTI-EXCESSO: ele ANOTA, nunca REMOVE ════════════════════════════════
// Esta é a asserção mais importante do arquivo. Se um dia alguém acrescentar
// um campo que o chamador possa ler como "tire da contagem", ela reprova.
{
  const d = diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg(), '2026-09-10')
  eq('o diagnóstico volta para uma rodada registrada', d.situacao, 'FONTE_NAO_LOCALIZADA')
  eq('🔴 e as chaves são EXATAMENTE estas, nenhuma que mande remover',
    Object.keys(d).sort(),
    ['acao', 'acesso', 'descricao', 'leitura', 'medidoEm', 'nota', 'revisarApos', 'situacao', 'vencido'])
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
  eq('são quatro situações', Object.keys(SITUACOES).sort(), ['AGUARDANDO_INDICE', 'FONTE_INACESSIVEL', 'FONTE_NAO_LOCALIZADA', 'FONTE_SEM_A_PERGUNTA'])
  for (const [nome, s] of Object.entries(SITUACOES)) {
    eq(`${nome} tem descrição`, Boolean(s.descricao), true)
    eq(`${nome} diz o que FAZER`, Boolean(s.acao), true)
  }
  eq('só FONTE_INACESSIVEL exige acesso', Object.entries(SITUACOES).filter(([, s]) => s.exigeAcesso).map(([n]) => n), ['FONTE_INACESSIVEL'])
  eq('só FONTE_SEM_A_PERGUNTA exige leitura', Object.entries(SITUACOES).filter(([, s]) => s.exigeLeitura).map(([n]) => n), ['FONTE_SEM_A_PERGUNTA'])
  // ⛔ ANTI-EXCESSO: as duas situações de documento ACHADO prescrevem coisas
  //    OPOSTAS, e é só por isso que vale serem duas. Se a ação da nova um dia
  //    mandar procurar de novo, ela virou a antiga com outro nome.
  eq('🔴 FONTE_SEM_A_PERGUNTA NÃO manda procurar de novo', /procurar de novo na data/.test(SITUACOES.FONTE_SEM_A_PERGUNTA.acao), false)
  eq('e FONTE_NAO_LOCALIZADA manda', /procurar de novo na data/.test(SITUACOES.FONTE_NAO_LOCALIZADA.acao), true)
  for (const [nome, s] of Object.entries(SITUACOES)) {
    for (const verbo of ['remover', 'ignorar', 'silenciar', 'excluir', 'descontar']) {
      eq(`a ação de ${nome} não manda ${verbo}`, new RegExp(verbo, 'i').test(s.acao), false)
    }
  }
}

// ══ ANTI-SILÊNCIO: "abri e a pergunta não está lá" exige PROVA de leitura ══
// O erro simétrico desta situação é ela virar o lugar barato de arquivar
// buraco: basta afirmar que se leu. Por isso a carga cobra O QUE foi lido.
{
  const ler = (leitura) => conferirCarga(reg({ situacao: 'FONTE_SEM_A_PERGUNTA', leitura }))
  eq('FONTE_SEM_A_PERGUNTA sem leitura é acusado', ler(undefined).length, 1)
  eq('leitura sem urls é acusada', ler({ ...lido, urls: undefined }).length, 1)
  eq('urls vazia é acusada', ler({ ...lido, urls: [] }).length, 1)
  eq('urls só com string vazia é acusada', ler({ ...lido, urls: [''] }).length, 1)
  eq('🧪 leitura sem oQueTem é acusada', ler({ ...lido, oQueTem: '' }).length, 1)
  eq('e o aviso diz POR QUE o oQueTem importa', /indistinguível de não ter lido/.test(ler({ ...lido, oQueTem: '' })[0]), true)
  eq('status como texto é acusado', ler({ ...lido, status: '200' }).length, 1)
  eq('leitura sem medidoEm é acusada', ler({ ...lido, medidoEm: '' }).length, 1)
  eq('leitura completa passa', ler(lido), [])
  // ⚠️ Aqui a guarda É de valor, e de propósito: `curl -o` GRAVA no 403 e no
  //    429, então página de erro lida inteira passaria por documento lido.
  eq('🔴 status 403 é acusado: página de erro não é o documento', ler({ ...lido, status: 403 }).length, 1)
  eq('status 429 é acusado', ler({ ...lido, status: 429 }).length, 1)
  eq('e o aviso diz que erro não refuta pergunta', /não refuta pergunta nenhuma/.test(ler({ ...lido, status: 403 })[0]), true)
  eq('status 299 passa, porque a borda é 2xx', ler({ ...lido, status: 299 }), [])
  eq('status 300 é acusado', ler({ ...lido, status: 300 }).length, 1)
  // 🔑 E o `status: 0` do bloqueio NÃO vale aqui: host que não resolve não
  //    entregou documento nenhum. Mesma guarda, vereditos opostos.
  eq('status 0 é acusado nesta situação, ao contrário do bloqueio', ler({ ...lido, status: 0 }).length, 1)
}

// ══ A fronteira dos DOIS campos de prova, nas duas direções ══════════════
{
  eq('🔴 leitura em FONTE_NAO_LOCALIZADA é acusada', conferirCarga(reg({ leitura: lido })).length, 1)
  eq('leitura em AGUARDANDO_INDICE é acusada', conferirCarga(reg({ situacao: 'AGUARDANDO_INDICE', leitura: lido })).length, 1)
  // ⛔ A pior combinação possível: o host recusou E o documento foi lido.
  eq('🔴 leitura em FONTE_INACESSIVEL é acusada', conferirCarga(reg({ situacao: 'FONTE_INACESSIVEL', acesso: bloqueio, leitura: lido })).length, 1)
  eq('e acesso em FONTE_SEM_A_PERGUNTA é acusado', conferirCarga(reg({ situacao: 'FONTE_SEM_A_PERGUNTA', leitura: lido, acesso: bloqueio })).length, 1)
}

// ══ ANTI-EXCESSO: a situação nova também ANOTA, nunca REMOVE ═════════════
{
  const d = diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg({ situacao: 'FONTE_SEM_A_PERGUNTA', leitura: lido }), '2026-09-10')
  eq('o diagnóstico sai', d.situacao, 'FONTE_SEM_A_PERGUNTA')
  eq('🔴 e as chaves seguem EXATAMENTE as mesmas', Object.keys(d).sort(),
    ['acao', 'acesso', 'descricao', 'leitura', 'medidoEm', 'nota', 'revisarApos', 'situacao', 'vencido'])
  eq('a leitura chega ao chamador', d.leitura.urls.length, 1)
  eq('e o acesso segue nulo, porque não houve bloqueio', d.acesso, null)
  eq('vencida, ela manda reconferir como as outras',
    diagnosticoDe('Casa X', '2026-09-01', '2026-09-05', reg({ situacao: 'FONTE_SEM_A_PERGUNTA', leitura: lido }), '2026-09-21').vencido, true)
}

// ══ as entradas REAIS, porque registro sem caso é registro não medido ════
{
  eq('o registro tem entrada', BURACOS_CONHECIDOS.length > 0, true)
  const cr = BURACOS_CONHECIDOS.find((e) => e.casa === 'Change Research')
  eq('a Change Research está registrada', Boolean(cr), true)
  eq('e com o 429 medido', cr.acesso.status, 429)
  eq('e com controle positivo', /200/.test(cr.acesso.controlePositivo), true)
  const nb = BURACOS_CONHECIDOS.find((e) => e.casa === 'Noble Predictive')
  eq('a Noble Predictive está registrada', Boolean(nb), true)
  eq('🔴 e ela deixou de ser "não localizada" em 19/Out', nb.situacao, 'FONTE_SEM_A_PERGUNTA')
  eq('com a leitura medida em 200', nb.leitura.status, 200)
  eq('e o oQueTem nomeia a série que PARA em Ago', /Ago\/2026/.test(nb.leitura.oQueTem), true)
  eq('e as 7 URLs lidas estão declaradas', nb.leitura.urls.length, 7)
  eq('⛔ e ela NÃO carrega acesso, porque o host abriu', 'acesso' in nb, false)
}

console.log(`\n${mau ? '❌ REPROVADO' : '✅ APROVADO'}: ${ok} passaram, ${mau} falharam\n`)
if (mau) process.exit(1)
