#!/usr/bin/env node
/**
 * Testa `lib/us-market/cauda-cega.mjs`.
 *
 * 🔴 O DEFEITO QUE ELE GUARDA, e ele é de dois andares:
 *
 * 1. a cauda cega do backup diário escondeu o topo da série duas vezes, em 09 e
 *    13/Out/2026, e os dois superlativos falsos foram PUBLICADOS;
 * 2. a primeira versão do medidor comparava contra `ext.max.price`, que é
 *    `undefined`, e `x > undefined` é SEMPRE falso: ele nunca acusaria extremo
 *    e só saberia dizer "fechada". Um medidor que só tem uma resposta não é
 *    medidor.
 *
 * ⚖️ Metade dos casos é ANTI-EXCESSO, porque o erro simétrico é um medidor que
 *    grita extremo em toda cauda e vira trava que se aprende a pular.
 */
import { vereditoDaCauda, controlePositivo, horasEntre, gradeDaSerie, VEREDITO } from '../lib/us-market/cauda-cega.mjs'

let ok = 0
let mau = 0
// 🔴 `JSON.stringify(NaN)` e a string "null", entao comparar por JSON faz NaN
//    passar por null e ESCONDE o defeito do guarda de data. O tipo entra na
//    comparacao. Achado por mutacao sobrevivente em 16/Out/2026.
const marca = (x) => (typeof x === 'number' && Number.isNaN(x) ? 'NaN' : JSON.stringify(x))
const eq = (nome, a, b) => {
  const bate = marca(a) === marca(b)
  if (bate) ok++
  else {
    mau++
    console.log(`  ❌ ${nome}\n     esperado ${JSON.stringify(b)}\n     veio     ${JSON.stringify(a)}`)
  }
}

console.log('\n🔬 cauda-cega · vereditoDaCauda e controlePositivo\n')

const AGORA = new Date('2026-10-13T19:30:00.000Z')
const ext = (o = {}) => ({ min: 95.1, max: 98.9, minEm: '2026-09-01T00:00:00.000Z', maxEm: '2026-10-09T12:00:00.000Z', fim: '2026-10-12T21:00:00.000Z', ...o })
const p = (t, v) => ({ t, v })

// ══ O CASO REAL DE 13/Out/2026, plantado como regressão ═══════════════════
// O topo gravado era 98,90 e a cauda continha 99,10 às 18:30Z, 57 minutos
// antes da leitura certificada das 19:27Z, que marcava 99,05. O backup não
// tinha, a certificada não viu, e saiu "RECORDE" sobre o valor errado.
{
  const v = vereditoDaCauda(ext(), [p('2026-10-13T18:30:00.000Z', 99.1), p('2026-10-13T19:27:00.000Z', 99.05)], AGORA)
  eq('13/Out: a cauda contém o topo e isso é EXTREMO', v.veredito, VEREDITO.EXTREMO)
  eq('13/Out: ele nomeia que bateu o TOPO', v.bateTopo, true)
  eq('13/Out: e não inventa piso', v.bateFundo, false)
  eq('13/Out: o valor da cauda é o 99.10, não o 99.05 da certificada', v.maxCauda, 99.1)
  eq('13/Out: conta os dois pontos da cauda', v.naCauda, 2)
}

// ══ ANTI-EXCESSO: cauda normal NÃO vira alarme ════════════════════════════
{
  const v = vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', 98.5), p('2026-10-13T18:00:00.000Z', 98.0)], AGORA)
  eq('cauda dentro da faixa é FECHADA', v.veredito, VEREDITO.FECHADA)
  eq('e ela declara quantos pontos olhou', v.naCauda, 2)
  eq('o valor IGUAL ao topo não é recorde novo', vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', 98.9)], AGORA).veredito, VEREDITO.FECHADA)
  eq('o valor IGUAL ao piso não é piso novo', vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', 95.1)], AGORA).veredito, VEREDITO.FECHADA)
}

// ══ o PISO também se mede, não só o topo ══════════════════════════════════
{
  const v = vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', 94.0)], AGORA)
  eq('cauda abaixo do piso é EXTREMO', v.veredito, VEREDITO.EXTREMO)
  eq('e ele nomeia o FUNDO', v.bateFundo, true)
  eq('sem inventar topo', v.bateTopo, false)
}

// ══ ANTI-SILÊNCIO: rota muda com cauda aberta NÃO é "nada novo" ═══════════
{
  eq('cauda de 22h sem ponto é INDETERMINADO', vereditoDaCauda(ext(), [], AGORA).veredito, VEREDITO.INDETERMINADO)
  eq('e o motivo diz o tamanho da cauda', /22\.5h/.test(vereditoDaCauda(ext(), [], AGORA).motivo), true)
  const curta = ext({ fim: '2026-10-13T19:00:00.000Z' })
  eq('cauda de 30 min sem ponto é VAZIA, não indeterminada', vereditoDaCauda(curta, [], AGORA).veredito, VEREDITO.VAZIA)
}

// ══ ANTI-SILÊNCIO: o extremo tem de vir em NÚMERO ═════════════════════════
//    Este é o defeito da primeira versao: comparar com undefined nunca acusa.
{
  eq('extremo sem max é INDETERMINADO', vereditoDaCauda(ext({ max: undefined }), [p('2026-10-13T06:00:00.000Z', 99.9)], AGORA).veredito, VEREDITO.INDETERMINADO)
  eq('extremo sem min é INDETERMINADO', vereditoDaCauda(ext({ min: null }), [p('2026-10-13T06:00:00.000Z', 1)], AGORA).veredito, VEREDITO.INDETERMINADO)
  eq('extremo como objeto, e não número, é INDETERMINADO', vereditoDaCauda(ext({ max: { price: 98.9 } }), [p('2026-10-13T06:00:00.000Z', 99.9)], AGORA).veredito, VEREDITO.INDETERMINADO)
  eq('sem fim do backup é INDETERMINADO', vereditoDaCauda(ext({ fim: null }), [p('2026-10-13T06:00:00.000Z', 99.9)], AGORA).veredito, VEREDITO.INDETERMINADO)
  eq('ext nulo é INDETERMINADO', vereditoDaCauda(null, [], AGORA).veredito, VEREDITO.INDETERMINADO)
}

// ══ a cauda é o que vem DEPOIS do backup, nunca o que já estava dentro ════
{
  const v = vereditoDaCauda(ext(), [p('2026-10-10T00:00:00.000Z', 99.9), p('2026-10-13T06:00:00.000Z', 98.0)], AGORA)
  eq('ponto ANTERIOR ao fim do backup não entra na cauda', v.veredito, VEREDITO.FECHADA)
  eq('e ele não é contado', v.naCauda, 1)
  eq('ponto NO instante do fim também não entra', vereditoDaCauda(ext(), [p('2026-10-12T21:00:00.000Z', 99.9)], AGORA).naCauda, 0)
}

// ══ valor ilegível não vira zero nem extremo ══════════════════════════════
{
  eq('ponto sem número não conta', vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', NaN)], AGORA).naCauda, 0)
  eq('e com cauda aberta isso é INDETERMINADO', vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', NaN)], AGORA).veredito, VEREDITO.INDETERMINADO)
}

console.log('🧪 controlePositivo\n')

// ══ CONTROLE POSITIVO: ele é o que autoriza a rota a fechar a cauda ═══════
{
  const bk = [p('2026-10-12T18:00:00.000Z', 98.0), p('2026-10-12T21:00:00.000Z', 98.5)]
  const rt = [p('2026-10-12T18:00:00.000Z', 98.0), p('2026-10-12T21:00:00.000Z', 98.5), p('2026-10-13T06:00:00.000Z', 98.6)]
  const cp = controlePositivo(bk, rt)
  eq('espelho fiel é FIEL', cp.fiel, true)
  eq('e conta os pontos da sobreposição', cp.nBackup, 2)

  const valorDiferente = [p('2026-10-12T18:00:00.000Z', 97.0), p('2026-10-12T21:00:00.000Z', 98.5)]
  eq('🔴 valor diferente na sobreposição REPROVA', controlePositivo(bk, valorDiferente).fiel, false)
  // 🔴 Mesmos VALORES e carimbos DIFERENTES: sem este caso, parar de comparar
  //    carimbo sobrevivia a tudo. A rota pode trazer o valor certo na hora
  //    errada, e aí ela não é espelho do gravado.
  const horaTrocada = [p('2026-10-12T18:30:00.000Z', 98.0), p('2026-10-12T21:00:00.000Z', 98.5)]
  eq('🔴 mesmo valor em carimbo DIFERENTE reprova', controlePositivo(bk, horaTrocada).fiel, false)
  eq('e ele nomeia que o carimbo divergiu', controlePositivo(bk, horaTrocada).mesmosCarimbos, false)
  eq('sem acusar valor, que bateu', controlePositivo(bk, horaTrocada).mesmosValores, true)

  const faltando = [p('2026-10-12T21:00:00.000Z', 98.5)]
  eq('🔴 rota com MENOS pontos na sobreposição reprova', controlePositivo(bk, faltando).fiel, false)
  eq('rota vazia reprova', controlePositivo(bk, []).fiel, false)
  eq('backup vazio reprova', controlePositivo([], rt).fiel, false)
  eq('sem sobreposição NÃO é fiel', controlePositivo(bk, [p('2026-10-13T06:00:00.000Z', 98.6)]).semSobreposicao, true)
  eq('e sem sobreposição também não é fiel', controlePositivo(bk, [p('2026-10-13T06:00:00.000Z', 98.6)]).fiel, false)
}

console.log('⏱️ horasEntre\n')
{
  eq('conta as horas', horasEntre('2026-10-12T21:00:00.000Z', '2026-10-13T19:30:00.000Z'), 22.5)
  eq('data ilegível devolve null, não zero', horasEntre('nao e data', '2026-10-13T19:30:00.000Z'), null)
  eq('e null não vira 0 na outra ponta', horasEntre('2026-10-12T21:00:00.000Z', undefined), null)
}


console.log('📏 gradeDaSerie e o limiar auto-calibrado\n')

// ══ O DEFEITO DE 18/Out, plantado ════════════════════════════════════════
// A primeira versão usava 1h fixo, supondo captura de 30 em 30 min. A grade
// real, medida nos 40 últimos pontos dos cinco livros, é de 4,5h uniformes.
// Resultado: cauda de 3,4h no livro mais ralo saiu INDETERMINADO sendo normal.
{
  const serie = (h, n = 10) => Array.from({ length: n }, (_, i) => p(new Date(Date.UTC(2026, 9, 1) + i * h * 36e5).toISOString(), 90))
  eq('a grade sai da mediana dos intervalos', gradeDaSerie(serie(4.5)), 4.5)
  eq('série curta demais devolve null', gradeDaSerie(serie(4.5, 2)), null)
  eq('série vazia devolve null', gradeDaSerie([]), null)
  eq('série nula devolve null', gradeDaSerie(null), null)

  // o caso real: cauda de 3.4h com grade de 4.5h
  const e34 = ext({ fim: '2026-10-13T16:06:00.000Z' })
  eq('🔴 cauda de 3.4h com grade de 4.5h é VAZIA, não indeterminada',
    vereditoDaCauda(e34, [], AGORA, { intervaloTipicoH: 4.5 }).veredito, VEREDITO.VAZIA)
  eq('e o motivo DIZ que o limiar veio da grade medida',
    /grade medida de 4\.5h/.test(vereditoDaCauda(e34, [], AGORA, { intervaloTipicoH: 4.5 }).motivo), true)

  // ⛔ ANTI-EXCESSO: afrouxar não pode calar cauda longa de verdade
  const e22 = ext()
  eq('cauda de 22.5h com grade de 4.5h segue INDETERMINADA',
    vereditoDaCauda(e22, [], AGORA, { intervaloTipicoH: 4.5 }).veredito, VEREDITO.INDETERMINADO)
  eq('o limiar é 1,5x a grade', vereditoDaCauda(e22, [], AGORA, { intervaloTipicoH: 4.5 }).limiar, 6.75)
  // na fronteira: 6h está dentro de 6.75, 7h está fora
  eq('6h com grade 4.5 ainda é VAZIA',
    vereditoDaCauda(ext({ fim: '2026-10-13T13:30:00.000Z' }), [], AGORA, { intervaloTipicoH: 4.5 }).veredito, VEREDITO.VAZIA)
  eq('7h com grade 4.5 já é INDETERMINADA',
    vereditoDaCauda(ext({ fim: '2026-10-13T12:30:00.000Z' }), [], AGORA, { intervaloTipicoH: 4.5 }).veredito, VEREDITO.INDETERMINADO)

  // ⛔ ANTI-SILÊNCIO: sem grade, o padrão conservador e ele se DECLARA
  eq('sem grade, volta ao padrão de 1h', vereditoDaCauda(e34, [], AGORA).veredito, VEREDITO.INDETERMINADO)
  eq('e o motivo DIZ que é padrão, não medição',
    /padrão conservador/.test(vereditoDaCauda(e34, [], AGORA).motivo), true)
  eq('grade zero não vira limiar zero', vereditoDaCauda(e34, [], AGORA, { intervaloTipicoH: 0 }).veredito, VEREDITO.INDETERMINADO)
  eq('grade negativa é ignorada', vereditoDaCauda(e34, [], AGORA, { intervaloTipicoH: -5 }).veredito, VEREDITO.INDETERMINADO)
  eq('grade NaN é ignorada', vereditoDaCauda(e34, [], AGORA, { intervaloTipicoH: NaN }).veredito, VEREDITO.INDETERMINADO)

  // ⛔ ANTI-EXCESSO: a grade NÃO muda o veredito quando HÁ ponto na cauda
  eq('com ponto além do extremo, grade não salva',
    vereditoDaCauda(ext(), [p('2026-10-13T06:00:00.000Z', 99.9)], AGORA, { intervaloTipicoH: 99 }).veredito, VEREDITO.EXTREMO)
}


// ══ Os furos que a MUTAÇÃO achou no próprio arnês, em 18/Out ══════════════
{
  // 🔴 1. MEDIANA e não média: com gaps uniformes as duas coincidem, então o
  //    caso anterior não distinguia. Gaps [1,1,1,10]: mediana 1, média 3,25.
  const t = (h) => new Date(Date.UTC(2026, 9, 1) + h * 36e5).toISOString()
  const torta = [p(t(0), 90), p(t(1), 90), p(t(2), 90), p(t(3), 90), p(t(13), 90)]
  eq('a grade é MEDIANA, imune ao gap gigante', gradeDaSerie(torta), 1)

  // 🔴 2. gap não finito não pode entrar na conta
  const comLixo = [p(t(0), 90), p('nao e data', 90), p(t(1), 90), p(t(2), 90), p(t(3), 90)]
  eq('carimbo ilegível não contamina a grade', gradeDaSerie(comLixo), 1)
  // 🔑 E o caso DETERMINÍSTICO, que não depende de onde o NaN cai na ordenação:
  //    se TODOS os gaps forem ilegíveis, sobra gap nenhum e a resposta é null.
  //    Sem o guarda, sobrariam dois NaN e a função devolveria NaN, que é um
  //    número falso em vez de uma recusa.
  // 🔑 E o que a guarda filtra ALÉM do ilegível: gap ZERO, de carimbo repetido.
  //    Com quatro carimbos iguais e dois espaçados, os zeros empurram a mediana
  //    para o próprio zero se eles entrarem na conta.
  const repetido = [p(t(0), 90), p(t(0), 90), p(t(0), 90), p(t(0), 90), p(t(4), 90), p(t(8), 90)]
  eq('carimbo REPETIDO não derruba a grade para zero', gradeDaSerie(repetido), 4)

  eq('série onde todo gap é ilegível devolve null, nunca NaN',
    gradeDaSerie([p(t(0), 90), p('lixo', 90), p(t(5), 90)]), null)

  // 🔴 3. a FRONTEIRA do limiar: exatamente 1,5x a grade ainda é VAZIA
  //    Com grade 4.5 o limiar é 6.75, e `caudaH > limiar` deixa o igual passar.
  const noLimiar = ext({ fim: '2026-10-13T12:45:00.000Z' })   // 6.75h antes de AGORA
  eq('cauda EXATAMENTE no limiar ainda é VAZIA',
    vereditoDaCauda(noLimiar, [], AGORA, { intervaloTipicoH: 4.5 }).veredito, VEREDITO.VAZIA)

  // 🔴 4. grade negativa tem de ser IGNORADA, e não virar limiar negativo.
  //    Limiar negativo deixa TODA cauda acima dele e some com a VAZIA.
  const curtinha = ext({ fim: '2026-10-13T19:00:00.000Z' })   // 0.5h
  eq('grade negativa cai no padrão e 0.5h segue VAZIA',
    vereditoDaCauda(curtinha, [], AGORA, { intervaloTipicoH: -5 }).veredito, VEREDITO.VAZIA)
  eq('grade zero cai no padrão e 0.5h segue VAZIA',
    vereditoDaCauda(curtinha, [], AGORA, { intervaloTipicoH: 0 }).veredito, VEREDITO.VAZIA)
}

console.log(`\n${mau ? '❌ REPROVADO' : '✅ APROVADO'}: ${ok} passaram, ${mau} falharam\n`)
if (mau) process.exit(1)
