/**
 * Teste do segundo leitor (`fora-do-indice.mjs`) e do medidor de exposição.
 *
 * 🔴 O QUE ESTE TESTE EXISTE PARA PEGAR, e é uma coisa só:
 *
 *   que uma falha vire "nada novo".
 *
 * Um verificador que devolve SEM_RODADA_NOVA quando na verdade não conseguiu
 * olhar fecha a suspeita com um verde que ninguém mediu. É o mesmo defeito que
 * o `catch { return true }` do coletor de mercado em 28/Ago/2026, que engoliu
 * duas exceções e deixou o banco gravar 15 vezes mais rápido sem alarme.
 * Ver memory/feedback_o_cliente_devolve_desserializado_e_o_failopen_engoliu.md
 *
 * Por isso metade dos casos aqui é de FALHA, não de sucesso.
 *
 * Uso:  node scripts/testar-fora-do-indice.mjs
 */

import {
  verificarCasa,
  verificarCasasAtrasadas,
  buracosNoRegistro,
  extrairIntervalosDeCampo,
  extrairUltimaModificacao,
  LISTAGENS_POR_CASA,
  VEREDITOS,
} from '../lib/us-polls/fora-do-indice.mjs'
import { medirExposicao } from '../lib/us-polls/exposicao.mjs'
import { medirCadencia } from '../lib/us-polls/atraso.mjs'

const AGORA = new Date('2026-08-30T12:00:00Z')
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

const resposta = (texto, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => texto,
})

// A casa usada nos casos de rede é uma que existe no registro com formato
// 'intervalo'. Se ela sair do registro um dia, o teste falha alto, que é o
// comportamento certo: o teste não pode passar por vacuidade.
const CASA = 'The Economist/YouGov'

console.log('\n── extrator de intervalos ──')
{
  const t = 'August 21 - 24, 2026 e July 30 – August 3, 2026 e Aug 14-17, 2026 e March 2, 2025'
  const r = extrairIntervalosDeCampo(t, 2026)
  ok('acha os tres intervalos de 2026', r.length === 3, `achou ${r.length}`)
  ok('ordena do mais recente para o mais antigo', r[0].iso === '2026-08-24', r[0]?.iso)
  ok('usa o FIM do intervalo que cruza mes', r.some((x) => x.iso === '2026-08-03'), JSON.stringify(r.map((x) => x.iso)))
  ok('descarta ano diferente', !r.some((x) => x.iso.startsWith('2025')))
  ok('guarda a evidencia literal', r[0].evidencia === 'August 21 - 24, 2026', r[0]?.evidencia)
}
{
  const r = extrairIntervalosDeCampo('February 30 - 45, 2026', 2026)
  ok('descarta dia impossivel', r.length === 0, JSON.stringify(r))
}
{
  const m = extrairUltimaModificacao('"datePublished":"2026-08-17 12:05","dateModified":"2026-08-19 09:00"')
  ok('pega a data de modificacao mais recente', m === '2026-08-19', String(m))
}

console.log('\n── FALHA NUNCA VIRA "NADA NOVO" ──')
{
  const r = await verificarCasa(CASA, '2026-08-10', {
    agora: AGORA,
    fetchImpl: async () => {
      throw new Error('getaddrinfo ENOTFOUND')
    },
  })
  ok('erro de rede -> INDETERMINADO', r.veredito === VEREDITOS.INDETERMINADO, r.veredito)
  ok('erro de rede NAO vira SEM_RODADA_NOVA', r.veredito !== VEREDITOS.SEM_RODADA_NOVA)
}
{
  const r = await verificarCasa(CASA, '2026-08-10', { agora: AGORA, fetchImpl: async () => resposta('', 403) })
  ok('403 de borda -> INDETERMINADO', r.veredito === VEREDITOS.INDETERMINADO, r.veredito)
  ok('403 diz o status no detalhe', /403/.test(r.detalhe), r.detalhe)
}
{
  const r = await verificarCasa(CASA, '2026-08-10', {
    agora: AGORA,
    fetchImpl: async () => resposta('<html><body>pagina montada no cliente</body></html>'),
  })
  ok('pagina sem intervalo legivel -> INDETERMINADO', r.veredito === VEREDITOS.INDETERMINADO, r.veredito)
}
{
  const r = await verificarCasa('Instituto Que Nao Existe', '2026-08-10', { agora: AGORA })
  ok('casa fora do registro -> SEM_LISTAGEM_REGISTRADA', r.veredito === VEREDITOS.SEM_LISTAGEM_REGISTRADA, r.veredito)
}
{
  const r = await verificarCasa('Cygnal (R)', '2026-08-07', { agora: AGORA })
  ok('casa registrada com url null -> SEM_LISTAGEM_REGISTRADA', r.veredito === VEREDITOS.SEM_LISTAGEM_REGISTRADA, r.veredito)
}

console.log('\n── vereditos de conteudo ──')
{
  const r = await verificarCasa(CASA, '2026-08-10', {
    agora: AGORA,
    fetchImpl: async () => resposta('Poll of August 14 - 17, 2026 and August 21 - 24, 2026'),
  })
  ok('rodada mais nova -> RODADA_FORA_DO_INDICE', r.veredito === VEREDITOS.RODADA_FORA_DO_INDICE, r.veredito)
  ok('conta as duas rodadas', r.rodadasFora.length === 2, JSON.stringify(r.rodadasFora))
  ok('a mais recente e 24/Ago', r.ultimoNaListagem === '2026-08-24', r.ultimoNaListagem)
}
{
  const r = await verificarCasa(CASA, '2026-08-24', {
    agora: AGORA,
    fetchImpl: async () => resposta('Poll of August 14 - 17, 2026 and August 21 - 24, 2026'),
  })
  ok('nada mais novo -> SEM_RODADA_NOVA', r.veredito === VEREDITOS.SEM_RODADA_NOVA, r.veredito)
}
{
  // Data no FUTURO na pagina nao pode virar rodada: campo que nao encerrou
  // nao existe como leitura.
  const r = await verificarCasa(CASA, '2026-08-10', {
    agora: AGORA,
    fetchImpl: async () => resposta('Coming: September 10 - 14, 2026'),
  })
  ok('so data futura -> INDETERMINADO, nunca rodada', r.veredito === VEREDITOS.INDETERMINADO, r.veredito)
}

console.log('\n── a lista de quem e consultado vem do PORTAO ──')
{
  const dados = {
    polls: [
      { instituto: 'Casa A', campoFim: '2026-08-10', dem: 46, rep: 41, amostraTipo: 'RV', amostra: 1000, vantagemDem: 5 },
      { instituto: 'Casa B', campoFim: '2026-08-25', dem: 45, rep: 42, amostraTipo: 'RV', amostra: 1000, vantagemDem: 3 },
    ],
  }
  const consultadas = []
  const cad = { atrasadas: [{ instituto: 'Casa A' }] }
  await verificarCasasAtrasadas(dados, cad, {
    agora: AGORA,
    fetchImpl: async (u) => {
      consultadas.push(u)
      return resposta('')
    },
  })
  ok('consulta so quem o portao sinalizou', consultadas.length === 0 || consultadas.length === 1)
  const vazio = await verificarCasasAtrasadas(dados, { atrasadas: [] }, { agora: AGORA })
  ok('portao vazio nao consulta ninguem', vazio.resultados.length === 0)
}
{
  const cad = { avaliadas: Object.keys(LISTAGENS_POR_CASA).map((instituto) => ({ instituto })) }
  const b = buracosNoRegistro(cad)
  const semUrl = Object.values(LISTAGENS_POR_CASA).filter((x) => !x.url).length
  ok('buracos do registro batem com as urls nulas', b.length === semUrl, `${b.length} vs ${semUrl}`)
  ok('todo buraco tem nota dizendo por que', b.every((x) => x.nota && x.nota.length > 5))
}

console.log('\n── exposicao ──')
{
  // Casa calada de cadencia 7d, com efeito de casa negativo claro.
  const polls = []
  for (let i = 0; i < 8; i++) {
    const d = new Date(Date.UTC(2026, 4, 1) + i * 14 * 86400000).toISOString().slice(0, 10)
    polls.push({ instituto: 'Campo 1', campoFim: d, dem: 47, rep: 41, outros: 12, vantagemDem: 6, amostraTipo: 'RV', amostra: 1000 })
    polls.push({ instituto: 'Campo 2', campoFim: d, dem: 46, rep: 41, outros: 13, vantagemDem: 5, amostraTipo: 'RV', amostra: 1000 })
    polls.push({ instituto: 'Campo 3', campoFim: d, dem: 46, rep: 42, outros: 12, vantagemDem: 4, amostraTipo: 'RV', amostra: 1000 })
  }
  for (let i = 0; i < 10; i++) {
    const d = new Date(Date.UTC(2026, 4, 4) + i * 7 * 86400000).toISOString().slice(0, 10)
    polls.push({ instituto: 'Calada', campoFim: d, dem: 44, rep: 43, outros: 13, vantagemDem: 1, amostraTipo: 'RV', amostra: 1000 })
  }
  const dados = { polls, mediaAfos: { janelaDias: 30, desde: '2026-07-31', dem: 46.33, rep: 41.33, vantagemDem: 5, nPesquisas: 9, nInstitutos: 4 } }
  const cad = medirCadencia(dados, AGORA)
  const calada = cad.avaliadas.find((c) => c.instituto === 'Calada')
  ok('a casa calada aparece na cadencia', Boolean(calada), JSON.stringify(cad.avaliadas.map((c) => c.instituto)))
  const ex = medirExposicao(dados, { atrasadas: calada ? [calada] : [] }, { agora: AGORA })
  ok('mede exposicao', Boolean(ex && ex.rodadasFaltando > 0), JSON.stringify(ex && ex.rodadasFaltando))
  if (ex) {
    ok('efeito de casa sai NEGATIVO para a casa mais republicana', ex.porCasa[0].efeitoDeCasaPp < 0, String(ex.porCasa[0]?.efeitoDeCasaPp))
    ok('a media com as que faltam cai', ex.central.vantagemDem < ex.atual.vantagemDem, `${ex.central.vantagemDem} vs ${ex.atual.vantagemDem}`)
    ok('faixa nao sai invertida', ex.faixa.min <= ex.faixa.max, JSON.stringify(ex.faixa))
    ok('nenhuma rodada esperada cai em hoje ou depois', ex.porCasa.every((c) => c.datasEsperadasNaJanela.every((d) => d < '2026-08-30')))
    ok('nenhuma rodada esperada cai antes da janela', ex.porCasa.every((c) => c.datasEsperadasNaJanela.every((d) => d >= ex.desde)))
    ok('n cresce exatamente pelas rodadas que faltam', ex.central.nPesquisas === ex.atual.nPesquisas + ex.rodadasFaltando, `${ex.central.nPesquisas} vs ${ex.atual.nPesquisas}+${ex.rodadasFaltando}`)
  }
  const semAtraso = medirExposicao(dados, { atrasadas: [] }, { agora: AGORA })
  ok('sem casa atrasada, nao ha rodada faltando', semAtraso.rodadasFaltando === 0, String(semAtraso?.rodadasFaltando))
  ok('sem casa atrasada, a media servida nao muda', semAtraso.central.vantagemDem === semAtraso.atual.vantagemDem)
}

console.log(`\n${falhas ? '❌ REPROVADO' : '✅ APROVADO'}: ${passes} passaram, ${falhas} falharam\n`)
process.exitCode = falhas ? 1 : 0
