#!/usr/bin/env node
/**
 * Casos plantados da régua do ruído da janela.
 *
 * ⚠️ Metade deles é ANTI-SILÊNCIO e ANTI-RÓTULO, que é onde este medidor pode
 *    errar de verdade. Ele compara dois números que não são da mesma natureza,
 *    e o modo de falhar não é dar conta errada: é dar a conta certa com o nome
 *    errado, ou calar quando a base encolheu.
 *
 * Uso: node scripts/testar-ruido-da-janela-us.mjs
 */
import { amplitudeObservada, compararRuido, VEREDITOS, MIN_REGISTROS } from '../lib/us-polls/ruido-da-janela.mjs'

let passes = 0
let falhas = 0
const conferir = (nome, ok, visto) => {
  if (ok) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${visto !== undefined ? `  → viu ${JSON.stringify(visto)}` : ''}`)
  }
}

const reg = (v, dia = '2026-09-01', extra = {}) => ({ vantagemDem: v, lastUpdate: dia, ...extra })
/** n registros usáveis, para passar do mínimo sem escrever 10 linhas à mão. */
const muitos = (n, v = 5) => Array.from({ length: n }, (_, i) => reg(v, `2026-09-${String(i + 1).padStart(2, '0')}`))

console.log('\n1· amplitudeObservada: a conta básica')
{
  const a = amplitudeObservada([reg(5.0, '2026-09-07'), reg(6.69, '2026-09-19'), reg(5.5, '2026-09-10')])
  conferir('amplitude é max menos min', a.amplitudePp === 1.69, a.amplitudePp)
  conferir('nomeia o dia do mínimo', a.emMin === '2026-09-07', a.emMin)
  conferir('nomeia o dia do máximo', a.emMax === '2026-09-19', a.emMax)
  conferir('conta os usáveis', a.n === 3, a.n)
}

console.log('\n2· 🕳️ ANTI-SILÊNCIO: base que encolhe tem de ser DECLARADA')
{
  const a = amplitudeObservada([
    reg(5.0),
    { ilegivel: true, motivo: 'corpo nao e JSON' },
    reg(6.0),
    reg(null),
    reg('6.5'),
  ])
  conferir('ilegível sai da conta', a.n === 2, a.n)
  conferir('vantagem null sai da conta', a.amplitudePp === 1, a.amplitudePp)
  conferir('vantagem STRING sai da conta, não vira número por coerção', a.descartados === 3, a.descartados)
  conferir('e os descartados são CONTADOS, não sumidos', a.descartados > 0)
}

console.log('\n3· 🕳️ base vazia não vira amplitude zero')
{
  const a = amplitudeObservada([])
  conferir('n é 0', a.n === 0, a.n)
  conferir('amplitude é null e NÃO 0', a.amplitudePp === null, a.amplitudePp)
  const b = amplitudeObservada([{ ilegivel: true }, reg(undefined)])
  conferir('só ilegíveis também dá null', b.amplitudePp === null, b.amplitudePp)
}

console.log('\n4· amplitudeObservada recusa entrada que não é array')
{
  for (const mau of [null, undefined, 'x', 42, {}]) {
    let lancou = false
    try {
      amplitudeObservada(mau)
    } catch {
      lancou = true
    }
    conferir(`${JSON.stringify(mau)} explode em vez de sumir calado`, lancou)
  }
}

console.log('\n5· O CASO REAL de 19/Set/2026: mecanismo alcança o observado')
// 📏 ERRATA de 20/Set/2026: estes 1.69pp vieram de uma consulta TRUNCADA, e a
//    amplitude verdadeira daquele dia era 1,82pp, com razão 1,28x. A aritmética
//    abaixo segue certa e fica como está; o caso truncado está no bloco 13.
{
  const c = compararRuido({ amplitudePp: 2.33 }, { n: 45, amplitudePp: 1.69 })
  conferir('veredito é MECANISMO ALCANCA', c.veredito === VEREDITOS.MECANISMO_ALCANCA, c.veredito)
  conferir('razão 2.33/1.69 = 1.38', c.razao === 1.38, c.razao)
  conferir('o motivo traz os DOIS números', c.motivo.includes('2.33') && c.motivo.includes('1.69'))
}

console.log('\n6· o outro lado: observado acima do mecanismo')
{
  const c = compararRuido({ amplitudePp: 1.0 }, { n: 45, amplitudePp: 4.0 })
  conferir('veredito é OBSERVADO ACIMA', c.veredito === VEREDITOS.OBSERVADO_MAIOR, c.veredito)
  conferir('razão fica abaixo de 1', c.razao === 0.25, c.razao)
}

console.log('\n7· ⚖️ EMPATE conta como mecanismo alcançando, não como observado maior')
{
  const c = compararRuido({ amplitudePp: 2.0 }, { n: 45, amplitudePp: 2.0 })
  conferir('empate é MECANISMO ALCANCA', c.veredito === VEREDITOS.MECANISMO_ALCANCA, c.veredito)
  conferir('razão exatamente 1', c.razao === 1, c.razao)
}

console.log('\n8· 🕳️ O PORTÃO QUE NÃO PODE DISPARAR: série curta não vira veredito')
{
  const c = compararRuido({ amplitudePp: 2.33 }, { n: MIN_REGISTROS - 1, amplitudePp: 0.1 })
  conferir('sai INDETERMINADO mesmo com mecanismo 23x maior', c.veredito === VEREDITOS.INDETERMINADO, c.veredito)
  conferir('o motivo diz quantos registros havia', c.motivo.includes(String(MIN_REGISTROS - 1)))
  conferir('e NÃO inventa razão', c.razao === null, c.razao)
  const d = compararRuido({ amplitudePp: 2.33 }, { n: MIN_REGISTROS, amplitudePp: 0.1 })
  conferir('exatamente no mínimo já decide', d.veredito === VEREDITOS.MECANISMO_ALCANCA, d.veredito)
}

console.log('\n9· 🧮 série ABSOLUTAMENTE parada não vira divisão por zero')
{
  const c = compararRuido({ amplitudePp: 2.33 }, { n: 45, amplitudePp: 0 })
  conferir('veredito sai MECANISMO ALCANCA', c.veredito === VEREDITOS.MECANISMO_ALCANCA, c.veredito)
  conferir('razão é null, não Infinity', c.razao === null, c.razao)
  conferir('e nunca Infinity', c.razao !== Infinity)
}

console.log('\n10· 🕳️ lado que falta sai INDETERMINADO, nunca aprovação')
{
  const semProj = compararRuido({ amplitudePp: null }, { n: 45, amplitudePp: 1.69 })
  conferir('sem projeção: INDETERMINADO', semProj.veredito === VEREDITOS.INDETERMINADO, semProj.veredito)
  conferir('e o motivo aponta a PROJEÇÃO', semProj.motivo.includes('projeção'))
  const semObs = compararRuido({ amplitudePp: 2.33 }, { n: 0, amplitudePp: null })
  conferir('sem série: INDETERMINADO', semObs.veredito === VEREDITOS.INDETERMINADO, semObs.veredito)
  conferir('e o motivo aponta o NEON', semObs.motivo.includes('Neon'))
  const nada = compararRuido(null, null)
  conferir('os dois ausentes: INDETERMINADO, sem explodir', nada.veredito === VEREDITOS.INDETERMINADO, nada.veredito)
}

console.log('\n11· 🏷️ ANTI-RÓTULO: o veredito NÃO pode dizer "sinal" nem "ruído puro"')
{
  // A amplitude observada JÁ CONTÉM a mecânica. Chamar a diferença de "sinal"
  // seria afirmar uma separação que a medição não faz, e é exatamente o defeito
  // que este medidor existe para não cometer.
  const c = compararRuido({ amplitudePp: 2.33 }, { n: 45, amplitudePp: 1.69 })
  conferir('o motivo não diz "sinal"', !/\bsinal\b/i.test(c.motivo), c.motivo)
  conferir('o motivo não diz "ruído puro"', !/ru[íi]do puro/i.test(c.motivo))
  conferir('o motivo diz que NÃO PERMITE SEPARAR', /n[ãa]o permite separar/i.test(c.motivo))
  conferir('nenhum veredito contém a palavra sinal', !Object.values(VEREDITOS).some((v) => /sinal/i.test(v)))
}

console.log('\n12· 🔢 razão arredonda a duas casas, e não acumula ponto flutuante')
{
  const c = compararRuido({ amplitudePp: 1 }, { n: 45, amplitudePp: 3 })
  conferir('1/3 sai 0.33 e não 0.3333333', c.razao === 0.33, c.razao)
}


console.log('\n13· 🔴 TRUNCAMENTO: só degrada o veredito que pode VIRAR')
{
  // 20/Set/2026: o `take` do script nascia em 45 e a série já tinha 52 linhas.
  // O corte comeu 30/Jul, D+6,82, que era o MÁXIMO da série. O extremo mora na
  // parte escondida, aqui como mora na janela de 90 dias da rota de histórico.
  const piso = compararRuido({ amplitudePp: 2.33 }, { n: 45, amplitudePp: 1.69 }, { truncada: true })
  conferir('sobre série truncada o veredito NÃO sai inteiro', piso.veredito === VEREDITOS.MECANISMO_ALCANCA_SOBRE_PISO, piso.veredito)
  conferir('o motivo diz que o observado é PISO', /PISO/.test(piso.motivo), piso.motivo)
  conferir('e diz em que número o veredito VIRA', piso.motivo.includes('2.33'))
  conferir('a razão continua sendo calculada', piso.razao === 1.38, piso.razao)
  conferir('e a saída carrega o campo truncada', piso.truncada === true)

  // ⭐ A ASSIMETRIA, que é a razão de degradar UM só: destruncar acrescenta
  //    registros, e acrescentar só pode baixar o mínimo ou subir o máximo.
  //    O lado que já venceu PELO observado não tem como perder.
  const forte = compararRuido({ amplitudePp: 1.0 }, { n: 45, amplitudePp: 4.0 }, { truncada: true })
  conferir('observado acima do mecanismo SOBREVIVE ao truncamento', forte.veredito === VEREDITOS.OBSERVADO_MAIOR, forte.veredito)
  conferir('e o motivo diz que o truncamento REFORÇA', /REFOR[ÇC]A/i.test(forte.motivo), forte.motivo)

  const inteira = compararRuido({ amplitudePp: 2.4 }, { n: 53, amplitudePp: 2.0 }, { truncada: false })
  conferir('sem truncamento o veredito sai INTEIRO', inteira.veredito === VEREDITOS.MECANISMO_ALCANCA, inteira.veredito)
  conferir('e truncada sai false, não undefined', inteira.truncada === false, inteira.truncada)
}

console.log('\n14· 🕳️ ANTI-ALARME: o padrão do truncamento é o veredito FORTE')
{
  // Quem trunca é quem sabe que truncou, e tem de dizer com `true` literal.
  // Valor ambíguo degradando por acidente faria o medidor reclamar sem
  // ninguém ter medido nada, e medidor que reclama todo dia é medidor pulado.
  for (const mau of [undefined, null, 'true', 1, {}, 'false']) {
    const c = compararRuido({ amplitudePp: 2.33 }, { n: 45, amplitudePp: 1.69 }, { truncada: mau })
    conferir(`truncada=${JSON.stringify(mau)} NÃO degrada`, c.veredito === VEREDITOS.MECANISMO_ALCANCA, c.veredito)
  }
  const semTerceiro = compararRuido({ amplitudePp: 2.33 }, { n: 45, amplitudePp: 1.69 })
  conferir('chamada sem o 3º argumento segue funcionando', semTerceiro.veredito === VEREDITOS.MECANISMO_ALCANCA, semTerceiro.veredito)
  const ind = compararRuido({ amplitudePp: null }, { n: 5, amplitudePp: null }, { truncada: true })
  conferir('INDETERMINADO também carrega o campo truncada', ind.truncada === true, ind.truncada)
  const curta = compararRuido({ amplitudePp: 2.33 }, { n: MIN_REGISTROS - 1, amplitudePp: 0.1 }, { truncada: true })
  conferir('série curta segue INDETERMINADO, truncada não a promove', curta.veredito === VEREDITOS.INDETERMINADO, curta.veredito)
}

console.log('\n15· 📐 MONOTONIA: a amplitude de um superconjunto NUNCA encolhe')
{
  // É esta propriedade que autoriza a assimetria do bloco 13. Se ela cair,
  // degradar só um dos dois vereditos passa a ser errado.
  const base = [reg(5.0, '2026-09-09'), reg(7.0, '2026-09-20'), reg(6.0, '2026-09-15')]
  const a = amplitudeObservada(base)
  for (const extra of [-3, 0, 5, 6, 6.82, 7, 12]) {
    const b = amplitudeObservada([...base, reg(extra, '2026-07-30')])
    conferir(`acrescentar ${extra} não encolhe a amplitude`, b.amplitudePp >= a.amplitudePp, [a.amplitudePp, b.amplitudePp])
  }
  const c = amplitudeObservada([...base, reg(6.82, '2026-07-30')])
  conferir('o caso real: 30/Jul com D+6,82 não mexe num máximo de 7,00', c.amplitudePp === a.amplitudePp, c.amplitudePp)
  const d = amplitudeObservada([reg(5.0, '2026-09-09'), reg(6.69, '2026-09-19'), reg(6.82, '2026-07-30')])
  conferir('mas em 19/Set, com máximo 6,69, ele ALARGA de 1,69 para 1,82', d.amplitudePp === 1.82, d.amplitudePp)
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
