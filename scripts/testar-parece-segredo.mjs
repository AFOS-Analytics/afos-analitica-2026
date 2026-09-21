#!/usr/bin/env node
/**
 * Casos plantados da trava que decide se o backup vai a um repositório PÚBLICO.
 *
 * 🔴 ATÉ 20/Set/2026 ESTA REGRA NÃO TINHA UM ÚNICO CASO E NÃO RODAVA NO CI.
 *    Ela decide se o backup do dia vai ao ar, vivia inline no
 *    `check-backup-sem-pii.ts`, e o único sinal de que tinha errado era o
 *    workflow falhar no dia seguinte. Foi assim que se descobriu o erro.
 *
 * ⚠️ OS DOIS LADOS TÊM CUSTOS OPOSTOS E OS DOIS SÃO CAROS:
 *    · liberar um segredo é VAZAMENTO em repositório público, irreversível;
 *    · barrar um nome público é backup que não roda, e a série de preços é a
 *      única coisa do projeto que não se reconstrói se o banco sumir.
 *    Por isso os falsos positivos têm caso plantado tanto quanto os negativos.
 *
 * ⛔ Nenhuma das cadeias abaixo é credencial de verdade. São FORMAS de
 *    credencial, escritas à mão para exercitar a régua.
 *
 * Uso: node scripts/testar-parece-segredo.mjs
 */
import {
  pareceSegredo,
  pareceNomeDeDocumento,
  formaDePalavra,
  partirEmPedacos,
  COBERTURA_MINIMA,
  PALAVRAS_MINIMAS,
} from './lib/parece-segredo.mjs'

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

console.log('\n1· 🔴 O CASO DE 20/Set/2026: os dois nomes que pararam o backup')
{
  // Os dois entraram pela ingestão de rodadas curadas do mesmo dia, dentro da
  // URL de `fontePrimaria`. O workflow reprovou e o backup daquele dia não saiu.
  for (const nome of [
    'MLSPSC35PressRelease_NationalTopics',
    'August2026NationalPollMidtermCongressToplines',
  ]) {
    conferir(`${nome} NÃO é segredo`, pareceSegredo(nome) === false, pareceSegredo(nome))
    conferir(`  e é reconhecido como nome de documento`, pareceNomeDeDocumento(nome) === true)
  }
}

console.log('\n2· 🕳️ ANTI-RALO: forma de credencial segue sendo pega')
{
  // ⛔ Nenhuma é real. São as FORMAS que o conserto poderia ter liberado.
  //
  // 🔴 E O PREFIXO DE FABRICANTE FOI TROCADO DE PROPÓSITO, medido em
  //    20/Set/2026: a primeira versão deste bloco usava os prefixos reais de
  //    três fabricantes, e o push protection do GitHub REPROVOU o push
  //    acusando "Stripe API Key" numa cadeia que eu inventei. Amostra
  //    inventada com prefixo de fabricante é tratada como credencial de
  //    verdade por todo varredor a jusante, e a saída certa NÃO é pedir
  //    exceção ao varredor: é desmarcar a amostra. Esta régua não olha
  //    prefixo nenhum, então desmarcar não enfraquece um caso sequer.
  const credenciais = [
    '4eC39HqLyjWDarjtT1zdp7dc',                 // o contraexemplo que definiu a régua
    'aGVsbG9Xb3JsZFRoaXNJc0FTZWNyZXQx',         // base64
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',     // cabeçalho de JWT
    'zzp_16C7e42F292c6912E7710c838347Ae178B4a', // forma de token do GitHub
    'zz_demo_51H8xYzAbCdEfGhIjKlMnOpQrStUv',    // forma de chave de pagamento
    '9D28188FB1F79A93aB7c2d1E4f5A6b8C',         // hex de caixa misturada
    'zzzb-2Fk9Lm3Qr7Tv1Wy5Bz8Cd4Ef6Gh0Jk2Np',   // forma de token de bot
  ]
  for (const c of credenciais) {
    conferir(`${c.slice(0, 28)}… É segredo`, pareceSegredo(c) === true, {
      segredo: pareceSegredo(c),
      documento: pareceNomeDeDocumento(c),
      pedacos: partirEmPedacos(c),
    })
  }
}

console.log('\n3· 📄 NOMES PÚBLICOS que aparecem de verdade no backup')
{
  // Varridos do `analysisReport` real. Barrar qualquer um deles para o backup.
  for (const nome of [
    'Focaldata_US_Midterms_Poll_Sep2026_formatted',
    'Toplines_260142_CNBC_AAES_Q1_2026_Topline',
    '24524-Cygnal-National-Sept26-NVT-Deck-Public-1',
    'Conservative-Energy-Network-National-2026-05-04-2026-05-07',
    '2026-Nat-Pol-March-Topline_tcm18-417813',
    'National-June-Presentation-RELEASE-June-2026',
    'fox_september-11-14-2026_national_topline_september-16-release-1',
    'Yahoo-YouGov-Politics-Poll-March-2026',
    'May-2026-Winning-the-Issues-Survey',
    'generic_congressional_ballot_march26',
    'brazil-presidential-election-first-round-2nd-place',
  ]) {
    conferir(`${nome.slice(0, 40)}… NÃO é segredo`, pareceSegredo(nome) === false, pareceSegredo(nome))
  }
}

console.log('\n4· 🔑 A regra da FORMA DE PALAVRA, que é onde o ralo se abriria')
{
  conferir('National é palavra', formaDePalavra('National'))
  conferir('formatted é palavra', formaDePalavra('formatted'))
  conferir('CNBC é sigla e conta', formaDePalavra('CNBC'))
  conferir('US é sigla de 2 e conta', formaDePalavra('US'))
  // 🔴 os quatro que um token produz ao ser quebrado na maiúscula
  conferir('WDarjt NÃO é palavra: maiúscula no MEIO', !formaDePalavra('WDarjt'))
  conferir('Hq NÃO é palavra: 1 letra minúscula só', !formaDePalavra('Hq'))
  conferir('dc NÃO é palavra: 2 letras minúsculas', !formaDePalavra('dc'))
  conferir('T NÃO é palavra', !formaDePalavra('T'))
  conferir('Lyj É palavra pela forma, e é por isso que a CONTAGEM não basta sozinha', formaDePalavra('Lyj'))
}

console.log('\n5· ✂️ A quebra em pedaços: hífen, sublinhado, MAIÚSCULA e dígito')
{
  conferir(
    'PressRelease vira duas palavras',
    JSON.stringify(partirEmPedacos('MLSPSC35PressRelease_NationalTopics')) ===
      JSON.stringify(['MLSPSC', '35', 'Press', 'Release', 'National', 'Topics']),
    partirEmPedacos('MLSPSC35PressRelease_NationalTopics'),
  )
  conferir(
    'letra e dígito se separam nos dois sentidos',
    JSON.stringify(partirEmPedacos('Sep2026v2')) === JSON.stringify(['Sep', '2026', 'v', '2']),
    partirEmPedacos('Sep2026v2'),
  )
  conferir('cadeia vazia não explode', partirEmPedacos('').length === 0)
  conferir('hífens repetidos não geram pedaço vazio', !partirEmPedacos('a---b').includes(''))
}

console.log('\n6· 🕳️ AS DUAS TRANCAS SÃO INDEPENDENTES, e as duas precisam existir')
{
  // Contagem sem cobertura: três palavras curtas afogadas em lixo.
  const afogado = 'Xq7ZvbT3nkJw9RtLmPasBqoDufCei4HgYnk'
  const pedacos = partirEmPedacos(afogado)
  const nPalavras = pedacos.filter(formaDePalavra).length
  conferir(
    `cadeia aleatória não vira documento nem com ${nPalavras} pedaço(s) de forma de palavra`,
    pareceNomeDeDocumento(afogado) === false,
    { pedacos, nPalavras },
  )

  // Cobertura sem contagem: duas palavras longas e nada mais.
  conferir(
    'duas palavras longas não bastam: o mínimo é ' + PALAVRAS_MINIMAS,
    pareceNomeDeDocumento('NationalToplines9') === false,
    partirEmPedacos('NationalToplines9'),
  )
  conferir('e três já bastam, com cobertura', pareceNomeDeDocumento('NationalTopicsToplines9') === true)
  conferir('a cobertura mínima é ' + COBERTURA_MINIMA, COBERTURA_MINIMA >= 0.6)
}

console.log('\n7· 🧱 O que a régua ANTIGA já barrava continua barrado')
{
  // ⛔ O conserto só pode ACRESCENTAR escape. Regressão aqui é vazamento.
  conferir('slug de 3+ palavras segue liberado', pareceSegredo('americans-know-who-the-real-elite') === false)
  conferir('cadeia sem dígito nunca é segredo', pareceSegredo('NationalAugustPresentationRELEASE') === false)
  conferir('hex todo minúsculo não é segredo por esta régua', pareceSegredo('20f8baa5c94f1c43cfef74a1573ab942b9024b12') === false)
  // 🔑 hex de 24 + _Palavra: a função sozinha DIZ que é segredo, e quem o
  //    libera é a lista PERMITIDOS do varredor, por contexto. A separação de
  //    camadas é de propósito: afrouxar aqui abriria o ralo para todos.
  conferir('hex24_Palavra segue sendo segredo PARA ESTA FUNÇÃO', pareceSegredo('6a9b4ff8d7e29e1d65b43064_September') === true)
}

console.log('\n8· 🕳️ entrada estranha não explode nem vira liberação')
{
  for (const mau of [null, undefined, '', 0, 42, {}, []]) {
    let lancou = false
    let r
    try {
      r = pareceSegredo(mau)
    } catch {
      lancou = true
    }
    conferir(`${JSON.stringify(mau)} responde booleano sem explodir`, !lancou && typeof r === 'boolean', { lancou, r })
  }
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
