/**
 * Controle plantado do conferidor de tela dos EUA (`conferir-tela.mjs`).
 *
 * 🔑 Os DOIS primeiros casos são os defeitos que o próprio conferidor teve na
 * estreia, em 06/Set/2026, e que só apareceram porque ele foi rodado contra a
 * produção. Ficam aqui plantados para não voltarem:
 *
 *   1. SEPARADOR DECIMAL. A primeira versão comparava `87.50` contra as três
 *      telas. O pt-BR e o ES escrevem `87,50`, então ele reprovou DUAS telas
 *      corretas e aprovou só o inglês. Falso positivo que manda consertar o que
 *      está bom é pior que falso negativo, porque gasta o crédito do portão.
 *
 *   2. SUBSTRING. `texto.includes('51.50')` deu verdadeiro numa tela pt-BR que
 *      nem usa ponto decimal, porque o pedaço aparecia dentro de outro número.
 *      Acerto por acaso é indistinguível de acerto de verdade no relatório.
 *
 * ⭐ E o caso que mais importa é o NEGATIVO: o conferidor tem de recusar o
 * número que aparece dentro de outro. Sem ele, um portão que diz "sim" para
 * tudo passa em todos os outros casos.
 *
 * Uso:  node scripts/testar-conferir-tela.mjs
 */
import { achou, naConvencao, primeiroNumero, valorSobOsRotulos } from './conferir-tela.mjs'
import { CONTRATOS, conferirRegistro } from './lib/rotulos-do-painel-us.mjs'

const CASOS = [
  // ── 1. o defeito do separador decimal, nos dois sentidos
  ['pt-BR escreve com vírgula', 'Democratas 87,50% na Câmara', '87.50', 'pt-BR', true],
  ['ES escreve com vírgula', 'Demócratas 87,50% en la Cámara', '87.50', 'es', true],
  ['EN escreve com ponto', 'Democrats at 87.50% in the House', '87.50', 'en', true],
  ['pt-BR NÃO deve casar a forma inglesa', 'Democratas 87.50% na Câmara', '87.50', 'pt-BR', false],
  ['EN NÃO deve casar a forma brasileira', 'Democrats at 87,50% in the House', '87.50', 'en', false],

  // ── 2. o defeito do substring: os NEGATIVOS que sustentam o portão
  ['não casa dentro de número maior', 'volume 187,502 negociado', '87.50', 'pt-BR', false],
  ['não casa com milhar antes', 'USD 1.187,50 acumulado', '87.50', 'pt-BR', false],
  ['não casa com dígito depois', 'a média foi 5,143 pontos', '5.14', 'pt-BR', false],
  ['inteiro não casa dentro de outro inteiro', 'n=140 pesquisas', '14', 'pt-BR', false],
  ['inteiro casa sozinho', 'n=14 pesquisas de 10 institutos', '14', 'pt-BR', true],

  // ── 3. o caso real da rodada de estreia
  ['a média do generic ballot em pt-BR', 'vantagem D+5,14 sobre 14 rodadas', '5.14', 'pt-BR', true],
  ['a média do generic ballot em EN', 'margin D+5.14 over 14 rounds', '5.14', 'en', true],
  ['o contrato de calendário', 'acontece no prazo: 97,15%', '97.15', 'pt-BR', true],
  ['ausência de verdade é ausência', 'a tela não trouxe o número', '97.15', 'pt-BR', false],

  // ── 4. borda: fim de linha e começo de texto contam como fronteira
  ['casa no fim do texto', 'o preço fechou em 49,50', '49.50', 'pt-BR', true],
  ['casa no começo do texto', '49,50 foi o fechamento', '49.50', 'pt-BR', true],
]

let falhas = 0
for (const [rot, texto, valor, locale, esperado] of CASOS) {
  const r = achou(texto, valor, locale)
  const ok = r === esperado
  if (!ok) falhas++
  console.log(`${ok ? '✅' : '❌'} ${rot}${ok ? '' : `  → esperava ${esperado}, veio ${r}`}`)
}

// a conversão sozinha, porque ela é a peça reusável
const conv = [
  ['87.50 em pt-BR vira 87,50', naConvencao('87.50', 'pt-BR') === '87,50'],
  ['87.50 em en fica 87.50', naConvencao('87.50', 'en') === '87.50'],
  ['87,50 em en vira 87.50', naConvencao('87,50', 'en') === '87.50'],
  ['inteiro atravessa sem mudar', naConvencao('14', 'pt-BR') === '14'],
]
for (const [rot, ok] of conv) {
  if (!ok) falhas++
  console.log(`${ok ? '✅' : '❌'} ${rot}`)
}


// ══════════════════════════════════════════════════════════════════════════
// 🏷️ O PORTÃO DE ETIQUETA, instalado em 19/Out/2026
//
// 🔴 De 06/Set a 19/Out o conferidor só respondia "o número chegou à tela?", e
//    a própria ficha dele declarava o limite: valor certo com rótulo errado
//    passava. Medido na tela viva de 19/Out: com os dois lados da Câmara
//    TROCADOS entre si, o contador antigo dava 6/6 e a etiqueta dá 4/6.
//
// 📐 A régua NÃO é proximidade, e a medição é que decidiu: o valor certo está a
//    1 char do rótulo, o `no-prazo` legítimo a 25, e o valor REPUBLICANO a 21
//    do rótulo "Democratas". 25 tem de passar e 21 tem de reprovar, então
//    nenhuma janela de caracteres separa os dois. A régua é O PRIMEIRO NÚMERO
//    DEPOIS DO RÓTULO.
// ══════════════════════════════════════════════════════════════════════════

// A tela, na forma REAL em que ela renderiza (medida em 19/Out), encurtada.
// 🔑 O que a torna um caso de verdade: "Democratas" aparece nos DOIS cartões e
//    também na linha do normalizado, então só a âncora do cartão distingue.
const TELA = [
  'Probabilidade de controlar cada casa',
  'Câmara ↗',
  '(abrir no Polymarket)',
  'Volume: $18,65M · soma do par 100,0%',
  'Democratas',
  '91,50%',
  'Republicanos',
  '8,50%',
  '',
  'normalizado: Democratas 91,50% · Republicanos 8,50%',
  '',
  'Senado ↗',
  '(abrir no Polymarket)',
  'Volume: $7,20M · soma do par 100,0%',
  'Democratas',
  '63,50%',
  'Republicanos',
  '36,50%',
  '',
  'A eleição acontece na data prevista ↗',
  '(abrir no Polymarket)',
  '99,00%',
  '',
  'Vantagem democrata: D+7,54',
].join('\n')

const A = (chave) => CONTRATOS.find((c) => c.chave === chave).ancoras['pt-BR']
const sob = (chave, valor, texto = TELA) => valorSobOsRotulos(texto, A(chave), valor, 'pt-BR')

const etq = []
const e = (rotulo, cond) => etq.push([rotulo, cond])

// ── O CERTO, nos seis pares
e('Câmara D sob o rótulo dela', sob('camara-dem', '91.50').ok === true)
e('Câmara R sob o rótulo dela', sob('camara-rep', '8.50').ok === true)
e('Senado D sob o rótulo dele', sob('senado-dem', '63.50').ok === true)
e('Senado R sob o rótulo dele', sob('senado-rep', '36.50').ok === true)
e('o contrato de calendário', sob('no-prazo', '99.00').ok === true)
e('a média do generic ballot', sob('generic-ballot', '7.54').ok === true)

// ── 🔴 A TROCA DENTRO DO MESMO CARTÃO, que é o defeito fundador
{
  const r = sob('camara-dem', '8.50')
  e('🔴 o valor REPUBLICANO sob o rótulo democrata REPROVA', r.ok === false)
  e('e o motivo é OUTRO_NUMERO, não ausência', r.motivo === 'OUTRO_NUMERO')
  e('e ele NOMEIA o que achou', r.encontrado === '91,50')
  e('e o que esperava, na convenção do idioma', r.esperado === '8,50')
  e('o espelho, democrata sob o rótulo republicano, também reprova', sob('camara-rep', '91.50').ok === false)
}

// ── 🔴 A TROCA ENTRE CARTÕES
e('🔴 o valor do SENADO sob o rótulo da Câmara reprova', sob('camara-dem', '63.50').ok === false)
e('e o valor da CÂMARA sob o rótulo do Senado reprova', sob('senado-dem', '91.50').ok === false)
e('o do calendário sob a Câmara reprova', sob('camara-dem', '99.00').ok === false)

// ── 🔑 E a prova de que o portão ANTIGO não pegava nada disso: os dois números
//    estão na tela, então o contador de presença segue dando verdadeiro.
e('🔑 o portão ANTIGO daria verde na troca, e é por isso que este existe', achou(TELA, '8.50', 'pt-BR') === true && achou(TELA, '91.50', 'pt-BR') === true)

// ── ÂNCORA AUSENTE é veredito PRÓPRIO, não falta de valor
{
  const semCartao = TELA.replace('Câmara ↗', 'Camara')
  const r = valorSobOsRotulos(semCartao, A('camara-dem'), '91.50', 'pt-BR')
  e('🏷️ rótulo mudado dá ANCORA_AUSENTE, não OUTRO_NUMERO', r.motivo === 'ANCORA_AUSENTE')
  e('e NOMEIA a âncora que faltou', r.ancora === 'Câmara ↗')
  // ⛔ A distinção importa porque as ações são opostas: uma manda conferir o
  //    número, a outra manda consertar o registro de rótulos.
  e('e NÃO diz que está ok', r.ok === false)
  const semSegunda = TELA.replace(/Democratas/g, 'Dems')
  e('âncora de 2o nível ausente também é nomeada', valorSobOsRotulos(semSegunda, A('camara-dem'), '91.50', 'pt-BR').ancora === 'Democratas')
}

// ── A CADEIA é ordenada: a 2a âncora se procura DEPOIS da 1a
{
  // Aqui "Democratas" existe ANTES de "Senado ↗" (no cartão da Câmara), e a
  // cadeia do Senado tem de ignorar essa e achar a seguinte.
  e('🧬 a cadeia do Senado ignora o "Democratas" da Câmara', sob('senado-dem', '63.50').ok === true)
}

// ── ANTI-EXCESSO: entrada degenerada não vira verde
e('cadeia vazia devolve SEM_ANCORA', valorSobOsRotulos(TELA, [], '91.50', 'pt-BR').motivo === 'SEM_ANCORA')
e('cadeia nula devolve SEM_ANCORA', valorSobOsRotulos(TELA, null, '91.50', 'pt-BR').motivo === 'SEM_ANCORA')
e('texto vazio não acha âncora', valorSobOsRotulos('', A('camara-dem'), '91.50', 'pt-BR').motivo === 'ANCORA_AUSENTE')
e('texto nulo não estoura', valorSobOsRotulos(null, A('camara-dem'), '91.50', 'pt-BR').ok === false)
{
  // 🔑 Conferir o MOTIVO sem conferir o VEREDITO deixa passar `ok: true` com o
  //    motivo certo, e foi exatamente a mutação que sobreviveu na 1a rodada.
  const r = valorSobOsRotulos('Vantagem democrata: n/d', ['Vantagem democrata'], '7.54', 'pt-BR')
  e('rótulo sem número depois devolve SEM_NUMERO_DEPOIS', r.motivo === 'SEM_NUMERO_DEPOIS')
  e('🔑 e REPROVA, porque motivo certo com veredito verde é pior que motivo errado', r.ok === false)
}

// ── O PRIMEIRO NÚMERO, isolado
e('primeiroNumero pega o decimal com vírgula', primeiroNumero('\n91,50%\nRepublicanos') === '91,50')
e('primeiroNumero pega o decimal com ponto', primeiroNumero(': D+7.54 sobre') === '7.54')
e('primeiroNumero ignora texto antes', primeiroNumero(' ↗\n(abrir no Polymarket)\n99,00%') === '99,00')
e('primeiroNumero devolve null sem número', primeiroNumero('(abrir no Polymarket)') === null)
e('primeiroNumero em texto vazio devolve null', primeiroNumero('') === null)
e('primeiroNumero não estoura em nulo', primeiroNumero(null) === null)
e('primeiroNumero pega inteiro sozinho', primeiroNumero('n=14 pesquisas') === '14')

// ── O REGISTRO: carga conferida e contrato de ordem
{
  e('o registro carrega sem problema', conferirRegistro().length === 0)
  e('são SEIS contratos, a mesma contagem que a rodada monta', CONTRATOS.length === 6)
  e('🔴 e na ORDEM que a rodada imprime: house D/R, senate D/R, prazo, média',
    CONTRATOS.map((c) => c.chave).join(',') === 'camara-dem,camara-rep,senado-dem,senado-rep,no-prazo,generic-ballot')
  e('todo contrato tem âncora nos três idiomas',
    CONTRATOS.every((c) => ['pt-BR', 'en', 'es'].every((l) => Array.isArray(c.ancoras[l]) && c.ancoras[l].length)))
  e('e todo contrato tem descrição, que é a etiqueta legível', CONTRATOS.every((c) => Boolean(c.descricao)))
  // ⛔ ANTI-SILÊNCIO da carga: entrada sem âncora para um idioma não pode passar
  e('carga sem âncora de um idioma é acusada',
    conferirRegistro([{ chave: 'x', descricao: 'd', ancoras: { 'pt-BR': ['a'], en: ['b'] } }]).length === 1)
  e('carga sem descrição é acusada',
    conferirRegistro([{ chave: 'x', ancoras: { 'pt-BR': ['a'], en: ['b'], es: ['c'] } }]).length === 1)
  e('chave repetida é acusada',
    conferirRegistro([
      { chave: 'x', descricao: 'd', ancoras: { 'pt-BR': ['a'], en: ['b'], es: ['c'] } },
      { chave: 'x', descricao: 'd', ancoras: { 'pt-BR': ['a'], en: ['b'], es: ['c'] } },
    ]).length === 1)
  e('âncora vazia é acusada',
    conferirRegistro([{ chave: 'x', descricao: 'd', ancoras: { 'pt-BR': [''], en: ['b'], es: ['c'] } }]).length === 1)
}


// ══ 🌐 As âncoras do INGLÊS e do ESPANHOL, travadas em 19/Out/2026 ════════
// 🔴 Até 19/Out os cartões imprimiam `Democratas` e `Republicanos` em PORTUGUÊS
//    nesses dois idiomas, porque era o nome do desfecho como o banco o guarda.
//    O conserto (lib/dashboard/partido-us.ts) e estas âncoras andaram JUNTOS:
//    âncora apontando para o rótulo antigo reprovaria a tela certa.
{
  const telaEn = [
    'House ↗', '(open on Polymarket)', 'Volume: $18.65M · pair total 100.0%',
    'Democrats', '91.50%', 'Republicans', '8.50%', '',
    'normalized: Democrats 91.50% · Republicans 8.50%', '',
    'Senate ↗', '(open on Polymarket)', 'Volume: $7.20M · pair total 100.0%',
    'Democrats', '63.50%', 'Republicans', '36.50%', '',
    'The election happens as scheduled ↗', '(open on Polymarket)', '99.00%', '',
    'Democratic margin: D+7.54',
  ].join('\n')
  const telaEs = [
    'Cámara ↗', '(abrir en Polymarket)', 'Volumen: $18,65M · suma del par 100,0%',
    'Demócratas', '91,50%', 'Republicanos', '8,50%', '',
    'normalizado: Demócratas 91,50% · Republicanos 8,50%', '',
    'Senado ↗', '(abrir en Polymarket)', 'Volumen: $7,20M · suma del par 100,0%',
    'Demócratas', '63,50%', 'Republicanos', '36,50%', '',
    'La elección ocurre en la fecha prevista ↗', '(abrir en Polymarket)', '99,00%', '',
    'Ventaja demócrata: D+7,54',
  ].join('\n')
  const esperados = ['91.50', '8.50', '63.50', '36.50', '99.00', '7.54']
  for (const [loc, tela] of [['en', telaEn], ['es', telaEs]]) {
    CONTRATOS.forEach((c, i) => {
      const r = valorSobOsRotulos(tela, c.ancoras[loc], esperados[i], loc)
      e(`${loc}: ${c.chave} está sob o rótulo dele`, r.ok === true)
    })
  }
  // 🔴 E a trava que prova que o conserto da tela está refletido aqui: o rótulo
  //    ANTIGO, em português, não pode mais ser a âncora do inglês.
  e('🔴 nenhuma âncora do EN usa o rótulo em português', CONTRATOS.every((c) => !c.ancoras.en.includes('Democratas') && !c.ancoras.en.includes('Republicanos')))
  e('🔴 nem a do ES para Democratas', CONTRATOS.every((c) => !c.ancoras.es.includes('Democratas')))
  // 📌 E `Republicanos` SEGUE valendo no ES, porque é a mesma palavra em
  //    espanhol. Tirá-la por simetria seria conserto cosmético que quebra a tela.
  e('📌 mas `Republicanos` segue sendo a âncora do ES, porque é a mesma palavra', CONTRATOS.find((c) => c.chave === 'senado-rep').ancoras.es.includes('Republicanos'))
  // ⛔ E o rótulo do inglês aplicado à tela em português REPROVA, que é a prova
  //    de que a âncora é por idioma e não um texto só.
  e('⛔ âncora do EN contra a tela pt-BR reprova', valorSobOsRotulos(TELA, CONTRATOS[0].ancoras.en, '91.50', 'en').ok === false)
}

for (const [rot, ok] of etq) {
  if (!ok) falhas++
  console.log(`${ok ? '✅' : '❌'} ${rot}`)
}

const total = CASOS.length + conv.length + etq.length
console.log(`\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${total - falhas}/${total} corretos\n`)
process.exit(falhas === 0 ? 0 : 1)
