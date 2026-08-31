/**
 * Teste da projeção da janela (`lib/us-polls/projecao.mjs`).
 *
 * 🔴 O QUE ESTE TESTE EXISTE PARA PEGAR, e são três coisas:
 *
 *   1. que a linha de base venha do ARQUIVO em vez de ser recomputada.
 *      Foi esse o defeito da primeira versão do `exposicao.mjs`, em 30/Ago/2026:
 *      ler `dados.mediaAfos` mistura a rolagem da janela com o efeito que se
 *      quer medir. Aqui o teste alimenta um `mediaAfos` DELIBERADAMENTE FALSO e
 *      exige que a projeção o ignore.
 *
 *   2. que a janela vazia vire "não mudou" em vez de virar EVENTO. Média que
 *      deixa de existir é o instrumento acabando, e some silenciosamente se
 *      quem chama tratar o `null` como dia parado.
 *
 *   3. que a projeção invente movimento. Dia em que ninguém sai da janela tem
 *      de sair com a média IDÊNTICA e a lista de saída VAZIA.
 *
 * Os números esperados estão escritos à mão, não recalculados com a mesma
 * função: teste que recomputa com o código testado passa por vacuidade.
 *
 * Uso:  node scripts/testar-projecao-janela.mjs
 */

import { projetarJanela, mediaEm, diaQueEsvazia, campoMaisRecente, HORIZONTE_PADRAO } from '../lib/us-polls/projecao.mjs'

let falhas = 0
let passes = 0

function ok(nome, condicao, detalhe = '') {
  if (condicao) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? ' — ' + detalhe : ''}`)
  }
}

const p = (instituto, campoFim, dem, rep, amostraTipo = 'RV', amostra = 1000) => ({
  instituto,
  campoFim,
  dem,
  rep,
  outros: Number((100 - dem - rep).toFixed(0)),
  vantagemDem: dem - rep,
  amostraTipo,
  amostra,
})

// Base de mão, com as três datas escolhidas para que a saída de cada uma caia
// num dia diferente e conhecido.
const POLLS = [
  p('Casa A', '2026-08-01', 50, 40, 'LV', 900),
  p('Casa B', '2026-08-10', 46, 42),
  p('Casa C', '2026-08-20', 44, 44),
]
const DE = new Date('2026-08-25T12:00:00Z')

console.log('\n── media em um dia dado ──')
{
  const m = mediaEm(POLLS, '2026-08-25', 30)
  ok('corte fica em campoMaisRecente - 30', m.desde === '2026-07-26', m.desde)
  ok('n e institutos contam as tres', m.nPesquisas === 3 && m.nInstitutos === 3, `${m.nPesquisas}/${m.nInstitutos}`)
  ok('media aritmetica bate a conta feita a mao', m.dem === 46.67 && m.rep === 42, `${m.dem} x ${m.rep}`)
  ok('vantagem bate a conta feita a mao', m.vantagemDem === 4.67, String(m.vantagemDem))
}
{
  // A hora do dia NAO pode mover a borda. Se um dia mover, a projecao passa a
  // depender da hora em que alguem rodou o script, e duas rodadas do mesmo dia
  // dariam numeros diferentes.
  const a = mediaEm(POLLS, '2026-08-25', 30)
  const b = mediaEm([...POLLS], '2026-08-25', 30)
  ok('a borda nao depende da hora do dia', a.desde === b.desde && a.desde === '2026-07-26')
}
{
  ok('data invalida devolve null, nao chuta', mediaEm(POLLS, '25/08/2026', 30) === null)
  ok('base vazia devolve null, nao zero', mediaEm([], '2026-08-25', 30) === null)
  ok('base que nao e lista devolve null', mediaEm(null, '2026-08-25', 30) === null)
}

console.log('\n── hierarquia de recorte, herdada da media() de producao ──')
{
  // Se alguem trocar a hierarquia em collect.mjs, este caso quebra AQUI, que e
  // o ponto de importar em vez de copiar a regra.
  const comDoisRecortes = [...POLLS, p('Casa C', '2026-08-20', 30, 20, 'A', 5000)]
  const m = mediaEm(comDoisRecortes, '2026-08-25', 30)
  ok('mesmo instituto e mesma data entram uma vez so', m.nPesquisas === 3, String(m.nPesquisas))
  ok('provavel votante ganha de adultos mesmo com amostra menor', m.dem === 46.67, String(m.dem))
}

console.log('\n── o dia em que a janela esvazia ──')
{
  ok('campoMaisRecente acha a ultima data', campoMaisRecente(POLLS) === '2026-08-20')
  ok('campoMaisRecente de base vazia e null', campoMaisRecente([]) === null)
  // ultimo dia com media = 2026-08-20 + 30 = 2026-09-19; o primeiro sem e o seguinte
  ok('esvazia em campoMaisRecente + dias + 1', diaQueEsvazia(POLLS, 30) === '2026-09-20', String(diaQueEsvazia(POLLS, 30)))
  ok('no ultimo dia ainda ha media', mediaEm(POLLS, '2026-09-19', 30) !== null)
  ok('no dia seguinte NAO ha', mediaEm(POLLS, '2026-09-20', 30) === null)
  ok('sem base, nao inventa data de esvaziamento', diaQueEsvazia([], 30) === null)
}

console.log('\n── projecao ──')
{
  const r = projetarJanela({ polls: POLLS }, { agora: DE, horizonte: 30, dias: 30 })
  const por = (dia) => r.linhas.find((l) => l.dia === dia)

  ok('a primeira linha e o proprio dia de partida', r.linhas[0].dia === '2026-08-25')
  ok('no dia de partida ninguem "sai"', r.linhas[0].saindo.length === 0)
  ok('dia sem saida repete a media exata', por('2026-08-26').media.vantagemDem === 4.67 && por('2026-08-26').saindo.length === 0)

  const d1 = por('2026-09-01')
  ok('a Casa A sai no dia certo', d1.saindo.length === 1 && d1.saindo[0].instituto === 'Casa A', JSON.stringify(d1.saindo))
  ok('a saida derruba n para 2', d1.media.nPesquisas === 2, String(d1.media.nPesquisas))
  ok('e a vantagem cai para a conta de mao', d1.media.vantagemDem === 2, String(d1.media.vantagemDem))

  const d2 = por('2026-09-10')
  ok('a Casa B sai no dia certo', d2.saindo.length === 1 && d2.saindo[0].instituto === 'Casa B', JSON.stringify(d2.saindo))
  ok('sobra uma pesquisa so', d2.media.nPesquisas === 1 && d2.media.vantagemDem === 0)

  // ⭐ A INVARIANTE QUE AMARRA TUDO: nada entra na janela, entao a queda do `n`
  // de um dia para o outro tem de ser EXATAMENTE o numero de rodadas que
  // sairam. Se um dia essa conta nao fechar, ou a lista de saida esta contando
  // linha em vez de rodada, ou o `n` deixou de ser rodada.
  {
    let bate = true
    for (let i = 1; i < r.linhas.length; i++) {
      const a = r.linhas[i - 1]
      const b = r.linhas[i]
      if (a.vazia || b.vazia) continue
      if (a.media.nPesquisas - b.media.nPesquisas !== b.saindo.length) bate = false
    }
    ok('a queda do n e sempre igual ao numero de rodadas que saem', bate)
  }

  const vazia = r.linhas[r.linhas.length - 1]
  ok('a janela vazia aparece como LINHA, nao como corte silencioso', vazia.vazia === true && vazia.media === null)
  ok('e no dia certo', vazia.dia === '2026-09-20', vazia.dia)
  ok('o resumo diz que esvaziou dentro do horizonte', r.esvaziaDentroDoHorizonte === true && r.esvaziaEm === '2026-09-20')
  ok('a amplitude e max menos min, conferida a mao', r.amplitudePp === 4.67, `${r.vantagemMin} a ${r.vantagemMax} = ${r.amplitudePp}`)
}
{
  const r = projetarJanela({ polls: POLLS }, { agora: DE, horizonte: 3, dias: 30 })
  ok('o horizonte e respeitado', r.linhas.length === 4, String(r.linhas.length))
  ok('sem esvaziar dentro do horizonte, o sinalizador e falso', r.esvaziaDentroDoHorizonte === false)
  ok('mas a data de esvaziamento ainda e informada', r.esvaziaEm === '2026-09-20', String(r.esvaziaEm))
}

console.log('\n── quem sai e RODADA, nao linha ──')
{
  // A Casa A com tres recortes da MESMA rodada: a media ja conta como uma,
  // entao a saida tem de aparecer uma vez, com os tres recortes declarados.
  const comRecortes = [
    p('Casa A', '2026-08-01', 50, 40, 'LV', 900),
    p('Casa A', '2026-08-01', 48, 41, 'RV', 1100),
    p('Casa A', '2026-08-01', 46, 42, 'A', 1400),
    p('Casa B', '2026-08-10', 46, 42),
    p('Casa C', '2026-08-20', 44, 44),
  ]
  const r = projetarJanela({ polls: comRecortes }, { agora: DE, horizonte: 10, dias: 30 })
  const d1 = r.linhas.find((l) => l.dia === '2026-09-01')
  ok('a rodada com tres recortes sai UMA vez', d1.saindo.length === 1, JSON.stringify(d1.saindo))
  ok('e os tres recortes ficam declarados', d1.saindo[0].linhas === 3, JSON.stringify(d1.saindo[0]))
  ok('a queda do n e 1, nao 3', r.linhas.find((l) => l.dia === '2026-08-31').media.nPesquisas - d1.media.nPesquisas === 1)
}

console.log('\n── a linha de base NAO vem do arquivo ──')
{
  // `mediaAfos` aqui e uma mentira deliberada. Se a projecao a usar, os numeros
  // abaixo saem dela e o teste falha.
  const dados = {
    polls: POLLS,
    mediaAfos: { janelaDias: 30, desde: '1999-01-01', nPesquisas: 99, nInstitutos: 99, dem: 1, rep: 99, vantagemDem: -98 },
  }
  const r = projetarJanela(dados, { agora: DE, horizonte: 2 })
  ok('a base e recomputada, nao lida de mediaAfos', r.base.mediaHoje.vantagemDem === 4.67, String(r.base.mediaHoje.vantagemDem))
  ok('o n tambem', r.base.mediaHoje.nPesquisas === 3, String(r.base.mediaHoje.nPesquisas))
  ok('o corte tambem', r.linhas[0].desde === '2026-07-26', r.linhas[0].desde)
  ok('mas a janela em dias PODE vir do arquivo, que e onde ela e declarada', r.janelaDias === 30)
}
{
  const r = projetarJanela({ polls: [] }, { agora: DE, horizonte: 2 })
  ok('base vazia nao explode', Boolean(r))
  ok('base vazia devolve a primeira linha ja VAZIA', r.linhas[0].vazia === true)
  ok('base vazia nao inventa amplitude', r.amplitudePp === null && r.vantagemMin === null)
  ok('base vazia nao inventa data de fim', r.esvaziaEm === null, String(r.esvaziaEm))
  ok('base vazia se declara como tal', r.baseVazia === true)
  ok('base vazia nao diz que "esvaziou no horizonte"', r.esvaziaDentroDoHorizonte === false)
}
{
  const r = projetarJanela({}, { agora: DE, horizonte: 1 })
  ok('objeto sem polls nao explode', Boolean(r) && r.base.nLinhas === 0)
  ok('e cai no padrao de 30 dias de janela', r.janelaDias === 30)
  ok('horizonte padrao existe e e um numero', Number.isFinite(HORIZONTE_PADRAO))
}

console.log(`\n${falhas ? '❌ REPROVADO' : '✅ APROVADO'}: ${passes} passaram, ${falhas} falharam\n`)
process.exitCode = falhas ? 1 : 0
