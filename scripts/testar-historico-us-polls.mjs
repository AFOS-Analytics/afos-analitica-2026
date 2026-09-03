/**
 * Teste do leitor de histórico (`lib/us-polls/historico.mjs`).
 *
 * 🔴 O QUE ESTE TESTE EXISTE PARA PEGAR, e é uma família de defeito só:
 *
 *   que uma AUSÊNCIA seja lida como uma NEGAÇÃO.
 *
 * São três formas do mesmo erro, e cada uma tem casos aqui:
 *
 *   1. registro com corpo ilegível SUMIR da série. Uma série que descarta o que
 *      não entende sai mais limpa que a realidade, e é a limpa que engana.
 *   2. dia sem registro passar por continuidade. Buraco no meio da série é
 *      evidência de buraco, não prova de que nada aconteceu.
 *   3. carimbo fora da hora do cron virar "o cron nao rodou". O registro do dia
 *      é um só e é sobrescrito, então uma chamada forçada às 15h APAGA o
 *      carimbo das 07:10Z. Ausência de marca não é marca de ausência.
 *      Ver memory/feedback_cache_date_vs_event_date.md
 *
 * Por isso a maioria dos casos aqui é de entrada torta, não de entrada boa.
 *
 * Uso:  node scripts/testar-historico-us-polls.mjs
 */

import {
  resumirRegistro,
  montarSerie,
  contarCongelamento,
  lacunasDeDia,
  origemDaGravacao,
  diagnosticarSerie,
  ORIGENS,
  HORA_CRON_UTC,
  TOLERANCIA_CRON_MIN,
} from '../lib/us-polls/historico.mjs'

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

/** Um registro como o Neon devolve: corpo é JSON dentro de string. */
const reg = (dia, hora, { lidas = 379, n = 15, inst = 11, vant = 5.66, campo = '2026-08-17', desde = '2026-08-01' } = {}) => ({
  slug: `us-generic-ballot-${dia.slice(8, 10)}-${dia.slice(5, 7)}-${dia.slice(0, 4)}`,
  updatedAt: new Date(`${dia}T${hora}Z`),
  bodyMarkdown: JSON.stringify({
    lastUpdate: dia,
    fetchedAt: `${dia}T${hora}Z`,
    qualidade: { linhasLidas: lidas, publicadas: lidas, descartadas: 0, semFontePrimaria: 2 },
    mediaAfos: { janelaDias: 30, desde, nPesquisas: n, nInstitutos: inst, dem: 46.53, rep: 40.87, vantagemDem: vant },
    polls: [{ campoFim: '2026-08-10' }, { campoFim: campo }],
  }),
})

console.log('\n── um registro vira uma linha ──')
{
  const r = resumirRegistro(reg('2026-08-31', '07:10:50'))
  ok('nao marca ilegivel o que e legivel', r.ilegivel === false)
  ok('pega lastUpdate', r.lastUpdate === '2026-08-31')
  ok('pega linhasLidas', r.linhasLidas === 379)
  ok('pega n e institutos', r.nPesquisas === 15 && r.nInstitutos === 11)
  ok('deriva o campo mais recente dos polls', r.campoMaisRecente === '2026-08-17', String(r.campoMaisRecente))
  ok('carimbo vira ISO', r.gravadoEm === '2026-08-31T07:10:50.000Z', String(r.gravadoEm))
}

console.log('\n── entrada torta NAO some ──')
{
  const r = resumirRegistro({ slug: 'x', updatedAt: new Date('2026-08-30T07:10:00Z'), bodyMarkdown: 'isto nao e json' })
  ok('corpo nao-JSON vira ILEGIVEL declarado', r.ilegivel === true && typeof r.motivo === 'string', JSON.stringify(r))
  ok('e mesmo ilegivel guarda o carimbo', r.gravadoEm === '2026-08-30T07:10:00.000Z')
}
{
  const r = resumirRegistro({ slug: 'x', updatedAt: new Date('2026-08-30T07:10:00Z'), bodyMarkdown: 'null' })
  ok('corpo "null" e JSON valido mas NAO e objeto: ilegivel', r.ilegivel === true, JSON.stringify(r))
}
{
  const r = resumirRegistro({ slug: 'x', updatedAt: new Date('2026-08-30T07:10:00Z'), bodyMarkdown: '{}' })
  ok('objeto vazio nao explode', r.ilegivel === false)
  ok('e campo ausente vira null, nao zero', r.linhasLidas === null && r.nPesquisas === null)
  ok('rodada sem media se declara', r.temMedia === false)
}
{
  const r = resumirRegistro({ slug: 'x', updatedAt: 'data podre', bodyMarkdown: '{}' })
  ok('carimbo ilegivel vira null, nao Invalid Date', r.gravadoEm === null)
}
{
  const r = resumirRegistro(undefined)
  ok('registro undefined nao explode', r.ilegivel === true)
}

console.log('\n── a serie ──')
{
  // De proposito fora de ordem, e com um ilegivel no meio.
  const rows = [
    reg('2026-08-29', '07:10:14'),
    { slug: 'podre', updatedAt: new Date('2026-08-30T07:10:00Z'), bodyMarkdown: '<<<' },
    reg('2026-08-31', '07:10:50'),
  ]
  const s = montarSerie(rows)
  ok('ordena do mais recente para o mais antigo', s.registros[0].gravadoEm.startsWith('2026-08-31'), s.registros[0].gravadoEm)
  ok('o ilegivel CONTINUA na serie', s.total === 3, String(s.total))
  ok('e e contado a parte', s.ilegiveis === 1, String(s.ilegiveis))
}

console.log('\n── congelamento ──')
{
  const s = montarSerie([reg('2026-08-31', '07:10:00'), reg('2026-08-30', '07:10:00'), reg('2026-08-29', '07:10:00')])
  const c = contarCongelamento(s.registros, 'linhasLidas')
  ok('conta os registros seguidos com o mesmo valor', c.registros === 3, JSON.stringify(c))
  ok('guarda o valor congelado', c.valor === 379)
  ok('diz desde quando', c.desde === '2026-08-29', String(c.desde))
  ok('avisa que o congelamento cobre a serie inteira lida', c.cobreASerieInteira === true)
}
{
  // A mudanca de base QUEBRA a contagem: 24/Ago tinha 363 linhas.
  const s = montarSerie([
    reg('2026-08-31', '07:10:00'),
    reg('2026-08-30', '07:10:00'),
    reg('2026-08-24', '07:10:00', { lidas: 363 }),
    reg('2026-08-23', '07:10:00', { lidas: 363 }),
  ])
  const c = contarCongelamento(s.registros, 'linhasLidas')
  ok('para de contar quando o valor muda', c.registros === 2, JSON.stringify(c))
  ok('e nao diz que cobre a serie inteira', c.cobreASerieInteira === false)
}
{
  const s = montarSerie([reg('2026-08-31', '07:10:00')])
  ok('um registro so devolve INDETERMINADO, nao "congelado ha 0"', contarCongelamento(s.registros, 'linhasLidas') === null)
}
{
  const s = montarSerie([])
  ok('serie vazia devolve INDETERMINADO', contarCongelamento(s.registros, 'linhasLidas') === null)
}
{
  // O ilegivel nao pode ENCERRAR nem PROLONGAR o congelamento por acidente:
  // ele nao tem o campo, entao fica fora da contagem e visivel no total.
  const s = montarSerie([
    reg('2026-08-31', '07:10:00'),
    { slug: 'podre', updatedAt: new Date('2026-08-30T07:10:00Z'), bodyMarkdown: '<<<' },
    reg('2026-08-29', '07:10:00'),
  ])
  const c = contarCongelamento(s.registros, 'linhasLidas')
  ok('ilegivel nao entra na contagem de congelamento', c.registros === 2, JSON.stringify(c))
  ok('mas continua contado na serie', s.ilegiveis === 1)
}

console.log('\n── lacuna de dia ──')
{
  const s = montarSerie([reg('2026-08-31', '07:10:00'), reg('2026-08-28', '07:10:00'), reg('2026-08-27', '07:10:00')])
  const l = lacunasDeDia(s.registros)
  ok('acha os dias sem registro no meio', l.length === 2 && l[0] === '2026-08-29' && l[1] === '2026-08-30', JSON.stringify(l))
}
{
  const s = montarSerie([reg('2026-08-31', '07:10:00'), reg('2026-08-30', '07:10:00')])
  ok('serie sem buraco devolve lista vazia', lacunasDeDia(s.registros).length === 0)
}
{
  const s = montarSerie([reg('2026-08-31', '07:10:00')])
  ok('um ponto so nao produz lacuna inventada', lacunasDeDia(s.registros).length === 0)
}

console.log('\n── quem gravou hoje ──')
{
  const AGORA = new Date('2026-08-31T13:40:00Z')
  const s = montarSerie([reg('2026-08-31', '07:10:50'), reg('2026-08-30', '07:10:00')])
  const o = origemDaGravacao(s.registros, AGORA)
  ok('carimbo na janela das 07:10Z e creditado ao CRON', o.origem === ORIGENS.CRON, JSON.stringify(o))
}
{
  const AGORA = new Date('2026-08-31T18:00:00Z')
  const s = montarSerie([reg('2026-08-31', '15:45:18')])
  const o = origemDaGravacao(s.registros, AGORA)
  ok('carimbo fora da janela e INDETERMINADO', o.origem === ORIGENS.INDETERMINADO, JSON.stringify(o))
  ok('e a nota diz por que NAO prova falha do cron', /NAO prova que o cron falhou/.test(o.nota), o.nota)
}
{
  const AGORA = new Date('2026-08-31T13:40:00Z')
  const s = montarSerie([reg('2026-08-30', '07:10:00')])
  const o = origemDaGravacao(s.registros, AGORA)
  ok('sem registro de hoje, o veredito e AUSENTE', o.origem === ORIGENS.AUSENTE)
  ok('e o registro vem nulo, sem herdar o de ontem', o.registro === null)
}
{
  // AGUARDANDO: antes da hora do cron, ausencia de registro e esperada.
  const s = montarSerie([reg('2026-09-02', '07:10:42')])
  const antes = origemDaGravacao(s.registros, new Date('2026-09-03T02:17:00Z'))
  ok('antes das 07:10Z o veredito e AGUARDANDO', antes.origem === ORIGENS.AGUARDANDO, antes.origem)
  ok('e AGUARDANDO nao devolve registro do dia anterior', antes.registro === null)
  const dentro = origemDaGravacao(s.registros, new Date('2026-09-03T06:41:00Z'))
  ok('dentro da folga de 30min ja volta a ser AUSENTE', dentro.origem === ORIGENS.AUSENTE, dentro.origem)
  const depois = origemDaGravacao(s.registros, new Date('2026-09-03T09:00:00Z'))
  ok('depois da hora do cron e sem registro, AUSENTE', depois.origem === ORIGENS.AUSENTE, depois.origem)
}
{
  // A trava de vocabulario: nao pode EXISTIR um veredito que afirme que o cron
  // nao rodou, porque o dado disponivel nunca sustenta essa afirmacao.
  //
  // 📌 Passou de TRES para QUATRO em 02/Set/2026, com decisao registrada. O
  // quarto e AGUARDANDO, para o intervalo entre a virada do dia UTC e a hora do
  // cron, em que a ausencia de registro e ESPERADA. Antes disso o diagnostico
  // devolvia AUSENTE por sete horas todo dia e mandava FORCAR, que e a acao que
  // apagou o carimbo do cron em 01/Set. Este contador segue aqui de proposito:
  // veredito novo exige decisao, nao acontece por descuido.
  const valores = Object.values(ORIGENS)
  ok('o vocabulario tem exatamente quatro vereditos', valores.length === 4, valores.join(','))
  ok('e nenhum deles nega o cron', !valores.some((v) => /NAO_RODOU|FALHOU|SEM_CRON/.test(v)), valores.join(','))
}
{
  const AGORA = new Date('2026-08-31T13:40:00Z')
  const limite = HORA_CRON_UTC.hora * 60 + HORA_CRON_UTC.minuto + TOLERANCIA_CRON_MIN
  const hh = String(Math.floor(limite / 60)).padStart(2, '0')
  const mm = String(limite % 60).padStart(2, '0')
  const dentro = origemDaGravacao(montarSerie([reg('2026-08-31', `${hh}:${mm}:00`)]).registros, AGORA)
  ok('a borda exata da tolerancia ainda conta como cron', dentro.origem === ORIGENS.CRON, `${hh}:${mm} -> ${dentro.origem}`)
  const forah = String(Math.floor((limite + 1) / 60)).padStart(2, '0')
  const foram = String((limite + 1) % 60).padStart(2, '0')
  const fora = origemDaGravacao(montarSerie([reg('2026-08-31', `${forah}:${foram}:00`)]).registros, AGORA)
  ok('um minuto depois, ja e INDETERMINADO', fora.origem === ORIGENS.INDETERMINADO, `${forah}:${foram} -> ${fora.origem}`)
}

console.log('\n── diagnostico inteiro ──')
{
  const AGORA = new Date('2026-08-31T13:40:00Z')
  const d = diagnosticarSerie(
    [
      reg('2026-08-31', '07:10:50'),
      reg('2026-08-30', '15:45:18'),
      { slug: 'podre', updatedAt: new Date('2026-08-28T07:10:00Z'), bodyMarkdown: '<<<' },
      reg('2026-08-24', '07:10:00', { lidas: 363, n: 11, inst: 9, vant: 5.82, campo: '2026-08-04' }),
    ],
    AGORA
  )
  ok('junta serie, ilegiveis, congelamento, lacuna e origem', Boolean(d.registros && d.indice && d.lacunas && d.hoje))
  ok('o ilegivel aparece na conta', d.ilegiveis === 1)
  ok('o congelamento do indice para na troca de base', d.indice.registros === 2, JSON.stringify(d.indice))
  ok('o campo travado tambem e medido', d.campo.valor === '2026-08-17' && d.campo.registros === 2, JSON.stringify(d.campo))
  ok('as lacunas aparecem', d.lacunas.includes('2026-08-29'), JSON.stringify(d.lacunas))
  ok('e hoje e creditado ao cron', d.hoje.origem === ORIGENS.CRON)
}
{
  const d = diagnosticarSerie([], new Date('2026-08-31T13:40:00Z'))
  ok('serie vazia nao explode', d.total === 0)
  ok('serie vazia nao inventa congelamento', d.indice === null)
  ok('serie vazia diz que hoje esta AUSENTE', d.hoje.origem === ORIGENS.AUSENTE)
}

console.log(`\n${falhas ? '❌ REPROVADO' : '✅ APROVADO'}: ${passes} passaram, ${falhas} falharam\n`)
process.exitCode = falhas ? 1 : 0
