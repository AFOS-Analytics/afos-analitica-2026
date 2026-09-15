/**
 * Casos plantados de `classificarPortao`.
 *
 * Os números vêm de medições reais: a virada seis vezes em dez capturas do book
 * do Senado (10/Ago/2026), as taxas de passagem de `governors` e `houseSeats`
 * medidas em 15/Set/2026, e a deriva de `governors` no dia em que ele cruzou o
 * corte.
 *
 * ⚠️ Os casos de ANTI-SILÊNCIO vêm primeiro em importância: série curta e
 * janela curta NÃO podem sair "ESTADO NORMAL". Um conferidor que diz "o de
 * sempre" sem ter material é indistinguível de um que mediu.
 */
import {
  classificarPortao,
  BORDA_PP,
  MINIMO_NA_JANELA,
  MINIMO_NO_HISTORICO,
  type CapturaDaSoma,
} from '../lib/us-market/estado-do-portao'

let passou = 0
let falhou = 0
const falhas: string[] = []

function ok(nome: string, cond: boolean, detalhe = '') {
  if (cond) passou++
  else {
    falhou++
    falhas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`)
  }
}
function eq(nome: string, obtido: unknown, esperado: unknown) {
  ok(nome, obtido === esperado, `esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(obtido)}`)
}

const AGORA = new Date('2026-09-15T16:00:00Z')
const H = 3_600_000

/** n capturas de meia em meia hora terminando `hAtras` horas antes de AGORA */
function serie(somas: number[], hAtras = 0): CapturaDaSoma[] {
  const fim = AGORA.getTime() - hAtras * H
  return somas.map((soma, i) => ({ t: fim - (somas.length - 1 - i) * 1800_000, soma }))
}

/** enche a série com capturas antigas, fora da janela de 24h */
function antigas(somas: number[]): CapturaDaSoma[] {
  const base = AGORA.getTime() - 40 * H
  return somas.map((soma, i) => ({ t: base - i * 1800_000, soma }))
}

// ─── 1. ANTI-SILÊNCIO ───────────────────────────────────────────────────────

eq('capturas null e INDETERMINADO', classificarPortao(94.2, null, { agora: AGORA }).leitura, 'INDETERMINADO')
eq('capturas vazias e INDETERMINADO', classificarPortao(94.2, [], { agora: AGORA }).leitura, 'INDETERMINADO')
eq(
  'menos capturas que o minimo na janela e INDETERMINADO',
  classificarPortao(94.2, serie([98, 97, 96]), { agora: AGORA }).leitura,
  'INDETERMINADO',
)
ok(
  'e o motivo diz que faltou material, nao que esta normal',
  /nao da para dizer se virou/.test(classificarPortao(94.2, serie([98, 97, 96]), { agora: AGORA }).motivo),
  classificarPortao(94.2, serie([98, 97, 96]), { agora: AGORA }).motivo,
)
{
  // janela cheia, historico curto: os dois portoes sao separados
  const curta = serie(Array(6).fill(98))
  const r = classificarPortao(94.2, curta, { agora: AGORA })
  eq('janela cheia com historico curto e INDETERMINADO', r.leitura, 'INDETERMINADO')
  ok('e o motivo aponta o HISTORICO', /o que e NORMAL/.test(r.motivo), r.motivo)
}
{
  // capturas so FORA da janela: historico existe, janela nao
  const r = classificarPortao(94.2, antigas(Array(40).fill(98)), { agora: AGORA })
  eq('serie longa mas toda antiga e INDETERMINADO', r.leitura, 'INDETERMINADO')
  eq('e a janela sai com zero', r.janela.n, 0)
  eq('enquanto o historico conta tudo', r.historico?.n, 40)
}
ok(
  'INDETERMINADO nunca sai como ESTADO NORMAL',
  ['INDETERMINADO'].includes(classificarPortao(94.2, serie([98]), { agora: AGORA }).leitura),
)

// ─── 2. OSCILANDO: o corte dentro do ruido, medido em 10/Ago/2026 ───────────

// Book de cadeiras do Senado: 106,40 / 104,40 / 104,90 / 106,00 / 105,40 /
// 130,00 / 127,90 / 125,20 / 104,40 / 100,00. O livro mal se moveu no meio e o
// quadro trocou de identidade tres vezes.
const SENADO_10AGO = [106.4, 104.4, 104.9, 106.0, 105.4, 130.0, 127.9, 125.2, 104.4, 100.0]
{
  const r = classificarPortao(100.0, [...antigas(Array(30).fill(103)), ...serie(SENADO_10AGO)], { agora: AGORA })
  eq('portao que vira 3x em 24h e OSCILANDO', r.leitura, 'OSCILANDO')
  eq('e conta as viradas', r.janela.viradas, 3)
  ok('e o motivo desaconselha publicar troca de estado', /nao publicar troca de estado/.test(r.motivo), r.motivo)
}
{
  // uma virada so NAO e oscilacao: e a troca que pode ser noticia
  const r = classificarPortao(94.2, [...antigas(Array(30).fill(98)), ...serie([98, 97.5, 97, 96.5, 94.8])], {
    agora: AGORA,
  })
  ok('uma virada so nao vira OSCILANDO', r.leitura !== 'OSCILANDO', r.leitura)
  eq('e ela e contada', r.janela.viradas, 1)
}

// ─── 3. NA BORDA: a leitura pode virar por sobrepreco ───────────────────────

{
  // valor perto do corte E serie parada: aqui a borda manda
  const r = classificarPortao(95.5, [...antigas(Array(40).fill(98)), ...serie([95.8, 95.7, 95.6, 95.7, 95.6])], {
    agora: AGORA,
  })
  eq('meio ponto acima do corte, com a serie parada, e NA BORDA', r.leitura, 'NA BORDA')
  eq('e a distancia sai medida', r.distanciaDaBorda, 0.5)
  eq('e o veredito segue PASSOU', r.veredito, 'PASSOU')
  ok('e o motivo cita a deriva pequena', /andou -0.2pp/.test(r.motivo), r.motivo)
}
{
  const r = classificarPortao(95 + BORDA_PP, [...antigas(Array(40).fill(98)), ...serie([98, 97, 96.5, 96])], {
    agora: AGORA,
  })
  eq('exatamente no limite da borda ainda e NA BORDA', r.leitura, 'NA BORDA')
}
{
  const r = classificarPortao(95 + BORDA_PP + 0.01, [...antigas(Array(40).fill(98)), ...serie([98, 97, 96.5, 96])], {
    agora: AGORA,
  })
  ok('um centesimo alem da borda ja nao e NA BORDA', r.leitura !== 'NA BORDA', r.leitura)
  eq('e naBorda vira falso', r.naBorda, false)
}
eq(
  'a borda de cima tambem conta',
  classificarPortao(104.5, [...antigas(Array(40).fill(103)), ...serie([103, 103.5, 104, 104.4])], { agora: AGORA })
    .leitura,
  'NA BORDA',
)

// ─── 3b. A DERIVA que tira a borda de cena, caso REAL de 15/Set/2026 ────────

// governors: 101,30% -> 94,20% em 24h, quase monotono, UMA travessia. O valor
// final esta a 0,80pp do corte, o que e borda pela distancia, mas sete pontos
// numa direcao so nao sao ruido de sobrepreco.
const GOVERNORS_15SET = [101.3, 98.7, 98.2, 98.6, 98.4, 97.7, 97.6, 98.0, 97.5, 96.9, 95.2, 95.5]
const HIST_GOVERNORS = antigas([...Array(433).fill(99), ...Array(103).fill(107)])
{
  // 🔴 O CASO EXATO DE 15/Set/2026, e ele NAO e evento: a travessia apareceu so
  // na leitura ao vivo, e as 12 capturas gravadas na janela estavam todas acima
  // do corte. Meia hora depois a leitura ao vivo voltou para 95,50% e passou.
  const r = classificarPortao(94.2, [...HIST_GOVERNORS, ...serie(GOVERNORS_15SET)], { agora: AGORA })
  eq('travessia vista so ao vivo e TRAVESSIA NAO CONFIRMADA', r.leitura, 'TRAVESSIA NAO CONFIRMADA')
  ok('e o motivo manda RELER', /RELER antes de relatar/.test(r.motivo), r.motivo)
  eq('o veredito de agora segue REPROVOU', r.veredito, 'REPROVOU')
  eq('e a janela segue unanime do outro lado', r.janela.passou, 12)
}
{
  // a MESMA travessia, agora com duas capturas gravadas do lado novo: aqui ela
  // esta confirmada, a deriva de 7pp vence a borda, e vira EVENTO
  const confirmada = serie([...GOVERNORS_15SET, 94.5, 94.3])
  const r = classificarPortao(94.2, [...HIST_GOVERNORS, ...confirmada], { agora: AGORA })
  eq('travessia confirmada por capturas gravadas e EVENTO', r.leitura, 'EVENTO')
  eq('mas a borda NAO some do resultado', r.naBorda, true)
  eq('e a distancia segue medida', r.distanciaDaBorda, 0.8)
  ok('o motivo diz que e movimento do livro', /movimento do livro/.test(r.motivo), r.motivo)
  ok('e AINDA ASSIM avisa que pode voltar', /pode voltar/.test(r.motivo), r.motivo)
  ok('a taxa historica sai perto de 80,78%', Math.abs((r.historico?.taxaPassagem ?? 0) - 0.8078) < 0.01)
}
{
  // e o simetrico: book que sempre reprova, com a janela toda reprovando, e uma
  // leitura ao vivo que PASSA. Tambem nao e evento ainda.
  const hist = antigas([...Array(153).fill(99), ...Array(270).fill(112)])
  const r = classificarPortao(100.0, [...hist, ...serie([108.9, 108.8, 108.8, 108.7, 108.6])], { agora: AGORA })
  eq('passar de repente, sem captura que confirme, e TRAVESSIA NAO CONFIRMADA', r.leitura, 'TRAVESSIA NAO CONFIRMADA')
  eq('e o veredito de agora e PASSOU', r.veredito, 'PASSOU')
}
{
  // janela NAO unanime nao dispara a travessia: ali ja existe captura dos dois
  // lados, e a pergunta volta a ser oscilacao ou evento
  const r = classificarPortao(94.2, [...HIST_GOVERNORS, ...serie([98, 96, 94.9, 95.5])], { agora: AGORA })
  ok('janela mista nao vira TRAVESSIA NAO CONFIRMADA', r.leitura !== 'TRAVESSIA NAO CONFIRMADA', r.leitura)
}
{
  // a MESMA distancia do corte, com o livro parado, volta a ser NA BORDA
  const parado = Array(12).fill(94.3)
  const r = classificarPortao(94.2, [...HIST_GOVERNORS, ...serie(parado)], { agora: AGORA })
  eq('mesma distancia, livro parado, e NA BORDA', r.leitura, 'NA BORDA')
}
{
  // deriva exatamente no limiar NAO domina: o limiar e estritamente maior
  const r = classificarPortao(94.2, [...HIST_GOVERNORS, ...serie([96.2, 95.5, 95.0, 94.2])], { agora: AGORA })
  eq('deriva de exatamente 2pp nao vence a borda', r.leitura, 'NA BORDA')
  eq('e a deriva sai medida', r.janela.derivaPp, -2)
}

// ─── 4. EVENTO x ESTADO NORMAL, com as taxas medidas em 15/Set/2026 ─────────

// governors fecha em 433 de 536 (80,78%). Reprovar LONGE da borda e EVENTO.
{
  const janela = serie([98.4, 97.7, 97.6, 98.0, 97.5, 96.9, 93.2, 93.0])
  const r = classificarPortao(92.0, [...HIST_GOVERNORS, ...janela], { agora: AGORA })
  eq('governors reprovando longe da borda e EVENTO', r.leitura, 'EVENTO')
  ok('e o motivo diz que merece nota', /merece nota/.test(r.motivo), r.motivo)
  eq('o veredito e REPROVOU', r.veredito, 'REPROVOU')
  eq('e sem ressalva de borda', r.naBorda, false)
}
// houseSeats fecha em 153 de 423 (36,17%). Reprovar ali e o de sempre.
{
  const historico = antigas([...Array(153).fill(99), ...Array(270).fill(112)])
  const janela = serie([108.9, 108.85, 108.8, 108.8, 108.75])
  const r = classificarPortao(108.8, [...historico, ...janela], { agora: AGORA })
  eq('houseSeats reprovando e ESTADO NORMAL', r.leitura, 'ESTADO NORMAL')
  ok('e o motivo diz que fez o de sempre', /o de sempre/.test(r.motivo), r.motivo)
}
// o mesmo book PASSANDO seria o evento
{
  const historico = antigas([...Array(153).fill(99), ...Array(270).fill(112)])
  const janela = serie([108.9, 107, 104, 101, 100.5])
  const r = classificarPortao(100.0, [...historico, ...janela], { agora: AGORA })
  eq('book que sempre reprova, PASSANDO, e EVENTO', r.leitura, 'EVENTO')
  eq('mesmo com o veredito PASSOU', r.veredito, 'PASSOU')
}
// book que sempre fecha, fechando: rotina
{
  const r = classificarPortao(100.0, [...antigas(Array(200).fill(100)), ...serie([100, 100, 100, 100])], {
    agora: AGORA,
  })
  eq('book que sempre fecha, fechando, e ESTADO NORMAL', r.leitura, 'ESTADO NORMAL')
}

// ─── 5. A JANELA: o que e velho nao entra ───────────────────────────────────

{
  const r = classificarPortao(100, [...antigas(Array(40).fill(130)), ...serie([100, 100, 100, 100])], { agora: AGORA })
  eq('a janela conta so o que esta dentro de 24h', r.janela.n, 4)
  eq('e o historico conta tudo', r.historico?.n, 44)
  ok(
    'historico e janela discordam de proposito',
    (r.historico?.taxaPassagem ?? 1) < 0.5 && r.janela.passou === 4,
    JSON.stringify(r.historico),
  )
}
{
  // exatamente 24h atras entra; 24h e um segundo nao
  const dentro: CapturaDaSoma[] = [{ t: AGORA.getTime() - 24 * H, soma: 100 }]
  const fora: CapturaDaSoma[] = [{ t: AGORA.getTime() - 24 * H - 1000, soma: 100 }]
  eq('exatamente 24h atras entra na janela', classificarPortao(100, dentro, { agora: AGORA }).janela.n, 1)
  eq('um segundo alem de 24h fica fora', classificarPortao(100, fora, { agora: AGORA }).janela.n, 0)
}
{
  const r = classificarPortao(94.2, [...antigas(Array(40).fill(99)), ...serie([101.3, 98.7, 98.2, 95.5])], {
    agora: AGORA,
  })
  eq('a deriva sai da primeira para a ultima da janela', r.janela.derivaPp, -5.8)
}
eq(
  'com uma captura so a deriva e null, nao zero',
  classificarPortao(100, [{ t: AGORA.getTime(), soma: 100 }], { agora: AGORA }).janela.derivaPp,
  null,
)
{
  // ordem de entrada nao pode mudar o resultado
  const s = serie([101.3, 98.7, 98.2, 95.5])
  const baralhada = [s[2], s[0], s[3], s[1]]
  const a = classificarPortao(94.2, [...antigas(Array(40).fill(99)), ...s], { agora: AGORA })
  const b = classificarPortao(94.2, [...antigas(Array(40).fill(99)), ...baralhada], { agora: AGORA })
  eq('serie fora de ordem da o mesmo resultado', b.janela.derivaPp, a.janela.derivaPp)
  eq('e a mesma leitura', b.leitura, a.leitura)
}

// ─── 6. LIXO na entrada nao vira medida ─────────────────────────────────────

{
  const sujas = [
    { t: NaN, soma: 100 },
    { t: AGORA.getTime(), soma: NaN },
    ...serie([100, 100, 100, 100]),
  ] as CapturaDaSoma[]
  const r = classificarPortao(100, [...antigas(Array(40).fill(100)), ...sujas], { agora: AGORA })
  eq('captura com t invalido nao entra', r.janela.n, 4)
  ok('e o historico tambem descarta as duas', r.historico?.n === 44, JSON.stringify(r.historico))
}

// ─── 7. Os limites sao os do portao.ts, nao copias ──────────────────────────

eq('95,00 fecha', classificarPortao(95, [...antigas(Array(40).fill(99)), ...serie([99, 99, 99, 99])], { agora: AGORA }).veredito, 'PASSOU')
eq('94,99 nao fecha', classificarPortao(94.99, [...antigas(Array(40).fill(99)), ...serie([99, 99, 99, 99])], { agora: AGORA }).veredito, 'REPROVOU')
eq('105,00 fecha', classificarPortao(105, [...antigas(Array(40).fill(99)), ...serie([99, 99, 99, 99])], { agora: AGORA }).veredito, 'PASSOU')
eq('105,01 nao fecha', classificarPortao(105.01, [...antigas(Array(40).fill(99)), ...serie([99, 99, 99, 99])], { agora: AGORA }).veredito, 'REPROVOU')
eq('o minimo da janela e o exportado', MINIMO_NA_JANELA, 4)
eq('o minimo do historico e o exportado', MINIMO_NO_HISTORICO, 20)

// ─── RESULTADO ──────────────────────────────────────────────────────────────

console.log(`\n🧪 ESTADO DO PORTAO: ${passou} passou · ${falhou} falhou  (${passou + falhou} casos)`)
if (falhou) {
  console.log('\n❌ falhas:')
  for (const f of falhas) console.log(`   ${f}`)
  process.exit(1)
}
console.log('✅ todos os casos passaram\n')
