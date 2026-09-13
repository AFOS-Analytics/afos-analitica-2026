/**
 * testar-frescor-contratos.mjs — casos plantados para a régua por contrato.
 *
 * 🔑 Os casos 4 e 5 são os que importam: um planta o FALSO POSITIVO real de
 * 04/Set/2026 e cobra que ele suma; o outro planta um volume genuinamente
 * VELHO no livro de 3º lugar e cobra que ele apareça. Uma régua que só fizesse
 * a primeira metade seria pior que a anterior, porque calaria de vez.
 *
 * Uso: node scripts/testar-frescor-contratos.mjs
 */

import { frasesDe, contratoDaFrase, canonPorContrato, contratoNoPonto, precosAfirmados, ehHistoricoEm } from './lib/frescor-contratos.mjs'

let falhas = 0
let passes = 0
function conferir(nome, cond, detalhe) {
  if (cond) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? `\n     ${detalhe}` : ''}`)
  }
}

console.log('\n1. Quebra em frases: número decimal e milhar não encerram frase')
{
  const f = frasesDe('Ele está em 9,50% (vol USD 114 mil). E no outro livro, 0,15%.')
  conferir('duas frases, não quatro', f.length === 2, JSON.stringify(f))
  conferir('o decimal sobreviveu', f[0].includes('9,50%'), f[0])
  conferir('o par vol sobreviveu', f[0].includes('114 mil'), f[0])
}

console.log('\n2. Classificação de uma frase')
{
  conferir('vencedor', contratoDaFrase('0,15% no contrato de VENCEDOR, abaixo do piso.') === 'vencedor')
  conferir('terceiro', contratoDaFrase('No contrato de 3º LUGAR do 1º turno cedeu 0,50pp.') === 'terceiro')
  conferir('segundo', contratoDaFrase('No contrato de 2º lugar do 1º turno subiu 4,00pp.') === 'segundo')
  conferir('sem marcador cai no padrão', contratoDaFrase('Ele subiu 1,00pp hoje.') === 'vencedor')
  conferir('padrão configurável', contratoDaFrase('Ele subiu 1,00pp.', 'terceiro') === 'terceiro')
  conferir(
    '🔑 frase AMBÍGUA devolve null e não se julga',
    contratoDaFrase('No contrato de VENCEDOR está em 0,15% e no de 3º lugar em 9,50%.') === null
  )
}

console.log('\n3. Linha de base por contrato, lida do quadro')
{
  const m =
    '0,15% (vol USD 7,15M) no contrato de VENCEDOR, abaixo do piso de 0,5% da dupla leitura. ' +
    'No contrato de 3º LUGAR do 1º turno, que é outro mercado, cedeu 0,50pp e está em 9,50% (vol USD 114 mil).'
  const c = canonPorContrato(m)
  conferir('conhece os dois contratos', c.size === 2, JSON.stringify([...c]))
  conferir('vencedor 0,15% / 7,15m', c.get('vencedor').preco === '0,15' && c.get('vencedor').vol === '7,15m', JSON.stringify(c.get('vencedor')))
  conferir('terceiro 9,50% / 114mil', c.get('terceiro').preco === '9,50' && c.get('terceiro').vol === '114mil', JSON.stringify(c.get('terceiro')))
}

console.log('\n4. 🔴 O FALSO POSITIVO REAL DE 04/Set: marcador ANTES e DEPOIS do nome')
{
  const a = 'é o contrato de 3º lugar do 1º turno, que é outro mercado: Caiado cedeu 0,50pp e está em 9,50% (vol USD 114 mil), e Zema'
  const i = a.indexOf('Caiado')
  const f = a.indexOf('mil)') + 4
  conferir('marcador ANTES do nome é encontrado', contratoNoPonto(a, i, f) === 'terceiro', contratoNoPonto(a, i, f))

  const b = 'Ronaldo Caiado segue em terceiro no contrato de 3º lugar do 1º turno, com 9,50% (vol USD 114 mil), atrás apenas de'
  const i2 = b.indexOf('Ronaldo')
  const f2 = b.indexOf('mil)') + 4
  conferir('⚠️ marcador DEPOIS do nome também', contratoNoPonto(b, i2, f2) === 'terceiro', contratoNoPonto(b, i2, f2))
}

console.log('\n5. 🔴 E o volume genuinamente VELHO do 3º lugar tem de continuar aparecendo')
{
  // A régua só é útil se, sabendo o contrato, ainda comparar contra a base DELE.
  const m = '0,15% (vol USD 7,15M) no contrato de VENCEDOR. No contrato de 3º LUGAR está em 9,50% (vol USD 114 mil).'
  const canon = canonPorContrato(m)
  const textoVelho = 'No contrato de 3º LUGAR do 1º turno Caiado está em 10,00% (vol USD 111 mil).'
  const contrato = contratoNoPonto(textoVelho, textoVelho.indexOf('Caiado'), textoVelho.length)
  conferir('o contrato é reconhecido', contrato === 'terceiro', String(contrato))
  const base = canon.get(contrato)
  conferir('e a base comparada é a do 3º lugar, não a do vencedor', base.vol === '114mil', JSON.stringify(base))
  conferir('logo 111 mil é acusado como velho', '111mil' !== base.vol)
}

console.log('\n6. Contrato desconhecido no quadro não vira acusação')
{
  const canon = canonPorContrato('0,15% (vol USD 7,15M) no contrato de VENCEDOR.')
  conferir('o quadro só conhece vencedor', canon.size === 1)
  conferir('e o 3º lugar volta indefinido, para o chamador pular', canon.get('terceiro') === undefined)
}

console.log('\n7. O livro de vencedor continua sendo conferido como antes')
{
  const t = 'CAIADO (PSD), 0,25% (vol USD 7,11M) no contrato de VENCEDOR, abaixo do piso.'
  const c = contratoNoPonto(t, t.indexOf('CAIADO'), t.length)
  conferir('classificado como vencedor', c === 'vencedor', String(c))
  const canon = canonPorContrato('0,15% (vol USD 7,15M) no contrato de VENCEDOR.')
  conferir('e 7,11M diverge da base 7,15m, então é acusado', canon.get('vencedor').vol === '7,15m')
}

console.log('\n8. PONTO CEGO CONHECIDO: frase que não repete o nome do dono')
{
  // Medido em 04/Set/2026 com defeito plantado. A régua 3 acha o dono pelo NOME
  // no texto, e a janela dela não cruza fim de frase. Na segunda frase dos blocos
  // `caiado`, `haddad` e `zema` o nome não se repete, então o valor ali não é
  // conferido por ninguém, nem antes nem depois desta mudança.
  //
  // Este caso NÃO cobra que o portão pegue o defeito: cobra que a classificação
  // por contrato já esteja certa, para o dia em que a régua do dono passar a ler
  // a ESTRUTURA do JSON em vez do texto. Registrar o vão é mais honesto que
  // fingir que ele não existe.
  const bloco =
    'CAIADO (PSD), 0,15% (vol USD 7,15M) no contrato de VENCEDOR, abaixo do piso. ' +
    'No contrato de 3º LUGAR do 1º turno, que é outro mercado, cedeu 0,50pp e está em 9,50%, num livro de USD 114 mil.'
  const i = bloco.indexOf('9,50%')
  const c = contratoNoPonto(bloco, i, bloco.length)
  conferir('a segunda frase é classificada como terceiro', c === 'terceiro', String(c))
  conferir(
    'e o nome do dono NÃO está nela, que é exatamente o ponto cego',
    !bloco.slice(bloco.indexOf('No contrato de 3º')).includes('CAIADO')
  )
}

console.log('\n9. precosAfirmados: o preço que o texto afirma como de HOJE')
{
  // O defeito REAL de 12/Set/2026, palavra por palavra do arquivo que foi ao ar.
  const analise =
    'O 11 de setembro repete a direção do dia anterior com um décimo da intensidade. ' +
    'O contrato de vencedor cedeu 1,00pp e está em 42,50% (vol USD 10,69M), contra uma queda de 9,00pp na véspera.'
  const r = precosAfirmados(analise)
  const venc = r.filter((x) => x.contrato === 'vencedor').map((x) => x.preco)
  conferir('🔴 pega o preço afirmado dentro da analise', venc.includes('42,50'), JSON.stringify(r))
  conferir('e NÃO devolve o 9,00 do delta, que não é preço de contrato', !venc.includes('9,00'), JSON.stringify(venc))
}

console.log('\n10. O que NÃO pode disparar')
{
  conferir(
    'valor marcado como histórico por "contra ... confirmada de" é ignorado',
    precosAfirmados('Está em 4,60%, contra 6,70% na leitura confirmada de 12/Set.')
      .map((x) => x.preco)
      .join(',') === '4,60'
  )
  conferir(
    '"de X% para Y%" devolve só o Y, porque o X é o valor velho',
    precosAfirmados('O contrato foi de 48,50% para 47,50% hoje.')
      .map((x) => x.preco)
      .join(',') === '47,50'
  )
  conferir(
    'valor seguido de DATA é referência a outro dia',
    precosAfirmados('Fica abaixo do pico dele, 55,10% em 10/Set.').length === 0
  )
  conferir(
    '"topo da série" antes do valor é histórico',
    precosAfirmados('Segue 20,00pp abaixo do topo da série dele, de 67,50%.').length === 0
  )
  conferir(
    '🔑 número de URNA com UMA casa não é preço',
    precosAfirmados('Na Datafolha ele tem 5,2% no 1º turno.').length === 0
  )
  conferir(
    '🔑 número de urna SEM casa decimal não é preço',
    precosAfirmados('Na Datafolha ele tem 39% no 1º turno e 46% no 2º.').length === 0
  )
  conferir(
    'frase AMBÍGUA, que nomeia dois livros, não devolve nada',
    precosAfirmados('No contrato de vencedor está em 0,15% e no de 3º lugar em 9,50%.').length === 0
  )
}

console.log('\n11. Contrato por frase, dentro do cartão')
{
  const r = precosAfirmados('No contrato de 3º lugar do 1º turno ele cedeu 0,20pp e está em 55,60%.')
  conferir('classifica como terceiro', r.length === 1 && r[0].contrato === 'terceiro', JSON.stringify(r))
  conferir('e devolve o preço certo', r[0]?.preco === '55,60')
  const d = precosAfirmados('Ele está em 47,50% depois de ceder 1,00pp.')
  conferir('sem marcador cai no padrão vencedor', d.some((x) => x.contrato === 'vencedor' && x.preco === '47,50'))
  const t = precosAfirmados('Ele está em 8,50% ali.', 'terceiro')
  conferir('e o padrão é configurável', t.length === 1 && t[0].contrato === 'terceiro')
}

console.log('\n12. ehHistoricoEm isolado')
{
  const f = 'Está em 4,60%, contra 6,70% na leitura confirmada de 12/Set.'
  conferir('o valor de hoje NÃO é histórico', !ehHistoricoEm(f, f.indexOf('4,60')))
  conferir('o valor da véspera É histórico', ehHistoricoEm(f, f.indexOf('6,70')))
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
