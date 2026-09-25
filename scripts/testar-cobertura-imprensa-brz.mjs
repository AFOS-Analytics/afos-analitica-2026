/**
 * testar-cobertura-imprensa-brz.mjs — casos plantados, sem rede.
 *
 * 🔑 Os casos que importam não são os verdes. São três:
 *   · o portão que NÃO PODE disparar: casa que divulga HOJE e está calada é
 *     INDETERMINADO, nunca buraco. Disparar ali treinaria a pular o aviso.
 *   · a casa FORA da tabela, que tem de ser barulhenta: pular em silêncio é o
 *     defeito que este arquivo existe para impedir.
 *   · o falso positivo de sigla curta: "MDA" dentro de outra palavra não é o
 *     instituto MDA.
 *
 * Uso: npx tsx scripts/testar-cobertura-imprensa-brz.mjs
 */

import { casaDoRegistro, medirCobertura } from './lib/cobertura-imprensa-brz.mjs'

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
const cache = (dia, ...titulos) => ({ dia, titulos })
const reg = (institute, div, protocolo = null) => ({ institute, publicationDate: div, protocolo })

console.log('\n1. O caso de 18/Set: casa com divulgações vencidas e ZERO item é BURACO')
{
  const r = medirCobertura(
    [reg('Veritá', '2026-09-11', 'BR080932026'), reg('Veritá', '2026-09-18', 'BR020322026')],
    [cache('2026-09-17', 'Datafolha lidera pesquisa'), cache('2026-09-18', 'AtlasIntel divulga números')],
    '2026-09-18',
  )
  const v = r.casas.find((c) => c.nome === 'Veritá')
  conferir('Veritá não é vista pelo cache', v?.itens === 0, JSON.stringify(v))
  // 🔑 Uma vencida (11/Set) e uma de hoje: o estado é SUSPEITA, não CEGA.
  conferir('uma vencida só dá SUSPEITA, não BURACO', v?.estado === 'SUSPEITA', v?.estado)
  conferir('veredito não é buraco com uma vencida', r.veredito === 'COBERTURA_OK', r.veredito)
}

console.log('\n2. Duas divulgações VENCIDAS e zero item: aí sim é buraco nosso')
{
  const r = medirCobertura(
    [reg('Veritá', '2026-09-11'), reg('Veritá', '2026-09-04')],
    [cache('2026-09-17', 'Datafolha lidera'), cache('2026-09-18', 'Quaest divulga')],
    '2026-09-18',
  )
  conferir('estado CEGA', r.casas.find((c) => c.nome === 'Veritá')?.estado === 'CEGA')
  conferir('veredito BURACO_DE_COBERTURA', r.veredito === 'BURACO_DE_COBERTURA', r.veredito)
}

console.log('\n3. 🔴 O PORTÃO QUE NÃO PODE DISPARAR: divulga HOJE e está calada')
{
  const r = medirCobertura(
    [reg('Veritá', '2026-09-18')],
    [cache('2026-09-18', 'Datafolha lidera')],
    '2026-09-18',
  )
  const v = r.casas.find((c) => c.nome === 'Veritá')
  conferir('divulgação de hoje sozinha é INDETERMINADO', v?.estado === 'INDETERMINADO', v?.estado)
  conferir('e o veredito não reprova', r.veredito === 'COBERTURA_OK', r.veredito)
}

console.log('\n4. Divulgação FUTURA também não reprova')
{
  const r = medirCobertura([reg('Real Time Big Data', '2026-09-23')], [cache('2026-09-18', 'nada')], '2026-09-18')
  conferir('futura é INDETERMINADO', r.casas[0]?.estado === 'INDETERMINADO', r.casas[0]?.estado)
}

console.log('\n5. Casa COBERTA: um item basta para o silêncio virar informação')
{
  const r = medirCobertura(
    [reg('Datafolha', '2026-09-11'), reg('Datafolha', '2026-09-17')],
    [cache('2026-09-17', 'Datafolha, 1º turno: Lula, 39%')],
    '2026-09-18',
  )
  const d = r.casas.find((c) => c.nome === 'Datafolha')
  conferir('COBERTA com 1 item', d?.estado === 'COBERTA' && d.itens === 1, JSON.stringify(d))
  conferir('registra em que dia foi vista', d?.diasComItem?.[0] === '2026-09-17', JSON.stringify(d?.diasComItem))
}

console.log('\n6. 🔴 Casa FORA da tabela é BARULHENTA, nunca pulada em silêncio')
{
  const r = medirCobertura([reg('INSTITUTO QUE NUNCA EXISTIU LTDA', '2026-09-10')], [cache('2026-09-18', 'x')], '2026-09-18')
  conferir('vai para desconhecidas', r.desconhecidas.length === 1, JSON.stringify(r.desconhecidas))
  conferir('veredito CASA_FORA_DA_TABELA', r.veredito === 'CASA_FORA_DA_TABELA', r.veredito)
  conferir('e NÃO entra como casa medida', r.casas.length === 0, JSON.stringify(r.casas))
}

console.log('\n7. Sigla curta: fronteira de palavra separa o instituto do ruído')
{
  conferir('"MDA" casa o instituto', casaDoRegistro('MDA')?.nome === 'MDA')
  const r = medirCobertura(
    [reg('MDA', '2026-09-15'), reg('MDA', '2026-09-08')],
    // 🔑 "amdas" e "Comdado" contêm as letras e NÃO são a casa.
    [cache('2026-09-18', 'As amdas do Comdado mudaram')],
    '2026-09-18',
  )
  conferir('ruído não vira cobertura', r.casas.find((c) => c.nome === 'MDA')?.itens === 0)
  conferir('e o buraco é acusado', r.casas.find((c) => c.nome === 'MDA')?.estado === 'CEGA')
}

console.log('\n8. 🔴 ACENTO: o `\\b` do JS não vê fronteira depois de "á"')
{
  // 🕳️ A primeira versão deste caso usava SÓ "Pesquisa Verita aponta empate",
  // a forma sem acento, que é justamente a que o `\b` acerta. Ele passou verde
  // enquanto o medidor devolvia ZERO sobre 19 títulos reais com "Veritá".
  // O caso que vale é o acentuado, e ele vem PRIMEIRO por isso.
  const comAcento = [
    'Veritá: Flávio e Lula empatam no 1º e no 2º turnos em Tocantins',
    'Justiça proíbe mais uma pesquisa do Veritá e aplica multa de R$ 53 mil',
    'TRE atende Janaina e suspende pesquisa da Veritá em Mato Grosso',
  ]
  const r = medirCobertura(
    [reg('Veritá', '2026-09-11'), reg('Veritá', '2026-09-04')],
    [cache('2026-09-12', ...comAcento, 'Pesquisa Verita aponta empate')],
    '2026-09-18',
  )
  const v = r.casas.find((c) => c.nome === 'Veritá')
  conferir('os 3 títulos ACENTUADOS contam', v?.itens === 4, `itens=${v?.itens}, esperado 4`)
  conferir('e a casa deixa de ser CEGA', v?.estado === 'COBERTA', v?.estado)
  // ⛔ E o que NÃO pode casar: a palavra dentro de outra.
  const r2 = medirCobertura(
    [reg('Veritá', '2026-09-11'), reg('Veritá', '2026-09-04')],
    [cache('2026-09-12', 'O veritásimo relatório e a veritade dos fatos')],
    '2026-09-18',
  )
  conferir('"veritásimo" e "veritade" não são a casa', r2.casas.find((c) => c.nome === 'Veritá')?.itens === 0)
}

console.log('\n9. O nome do registro é longo e sujo, e ainda assim cai na casa certa')
{
  conferir('PODERDATA longo', casaDoRegistro('PODERDATA PESQUISA, JORNALISMO E COMUNIC')?.nome === 'PoderData')
  conferir('NEXUS longo', casaDoRegistro('NEXUS PESQUISA E INTELIGENCIA DE DADOS L')?.nome === 'Nexus')
  conferir('GRUPO GERP longo', casaDoRegistro('GRUPO GERP GERP MERCADO GERP OPINI')?.nome === 'Gerp')
  conferir('AMERICAN ANALYTICS longo', casaDoRegistro('AMERICAN ANALYTICS DO BRASIL CONSU')?.nome === 'American Analytics')
}

console.log('\n10. 🔴 O nome do REGISTRO não é o nome da IMPRENSA (caso 100 Cidades)')
{
  const c = casaDoRegistro('100 Cidades')
  conferir('registro "100 Cidades" cai na entrada', c?.nome === '100 Cidades (Futura)', c?.nome)
  const titulos = [
    'Futura/100% Cidades: Flávio Bolsonaro aparece à frente de Lula no 2º turno',
    'Futura: Flávio tem 48,1% no 2º turno; Lula, 43,7%',
    'Pesquisa Futura/100% Cidades: Lula tem 38,7% e Flávio, 33,6% no 1º turno',
  ]
  for (const t of titulos) conferir(`casa "${t.slice(0, 34)}..."`, c.alvos.some((a) => a.test(t)))
  // ⛔ O que NÃO pode casar: "futura" como adjetivo comum.
  const ruido = ['Lula fala sobre a futura eleição', 'O futuro do Congresso na futura legislatura']
  for (const t of ruido) conferir(`ruído fica de fora: "${t.slice(0, 32)}..."`, !c.alvos.some((a) => a.test(t)))
}

console.log('\n10b. 🔴 A casa que o DETECTOR trouxe: Alfa Inteligência (19/Set/2026)')
{
  const c = casaDoRegistro('ALFA INTELIGENCIA E SERVICOS DE SOFTWARE')
  conferir('o registro SEM acento cai na entrada', c?.nome === 'Alfa Inteligência (TMC)', c?.nome)

  // ⚠️ O ACENTUADO PRIMEIRO, que é a lição da Veritá: o caso plantado daquela
  // vez usou a forma sem acento, justamente a que já funcionava, e o teste
  // passou verde por cima do defeito que existia para pegar.
  const titulos = [
    'Alfa Inteligência: veja a pesquisa para governador do Paraná',
    'Pesquisa Alfa/TMC: Lula tem 43% e Flávio Bolsonaro, 29%, no 1º turno',
    'Pesquisa TMC/Alfa mostra Lula 14 pontos à frente de Flávio Bolsonaro',
    'TMC e Instituto Alfa selam parceria para pesquisas próprias nas Eleições 2026',
    'Pesquisa Alfa aponta empate técnico no segundo turno',
  ]
  for (const t of titulos) conferir(`casa: "${t.slice(0, 38)}..."`, c.alvos.some((a) => a.test(t)))

  // ⛔ Os 5 que NÃO podem casar são reais: saíram do news-cache de 14 dias, onde
  // "alfa" aparece 7 vezes e nenhuma é da casa.
  const ruido = [
    'Mendonça apresenta notas fiscais de R$ 26,4 mil em alfaiataria para rebater áudio',
    'Augusto Cury é analfabeto político, e Flávio errou ao insistir com Vorcaro',
    'Pessoas com deficiência têm analfabetismo maior, diz IBGE',
    'Alface lidera em São Paulo, e mandioca, no Rio; veja produção agrícola',
    'Cinco pesquisas sobre Governo do Paraná poderão ser divulgadas - jornalfatos.com.br',
  ]
  for (const t of ruido) conferir(`ruído do cache fica de fora: "${t.slice(0, 34)}..."`, !c.alvos.some((a) => a.test(t)))

  // ⛔ E o ruído que a fronteira de palavra NÃO resolve sozinha, que é a razão
  // de "alfa" nu estar fora da tabela: aqui "Alfa" é palavra inteira e mesmo
  // assim não é a casa.
  const marcas = ['Alfa Romeo lança novo modelo no Brasil', 'Banco Alfa anuncia resultado do trimestre']
  for (const t of marcas) conferir(`marca homônima fica de fora: "${t.slice(0, 30)}..."`, !c.alvos.some((a) => a.test(t)))
}

console.log('\n10c. A segunda casa que o DETECTOR trouxe: Vox Brasil (24/Set/2026)')
{
  const c = casaDoRegistro('INSTITUTO VOX BRASIL OPINIAO E PESQUISAS')
  conferir('o registro longo cai na entrada', c?.nome === 'Vox Brasil', c?.nome)

  // Os 4 primeiros são REAIS, do news-cache de 30 dias. O 2º é a razão de a
  // forma nua entrar: a Metrópoles e o Poder360 escrevem só "Vox".
  const titulos = [
    'Pesquisa Vox Brasil: Lula tem 37,1% no 1º turno e Flávio Bolsonaro, 34,8% - JOTA Info',
    'Vox: Flávio cresce, vai a 45,1%, e passa Lula, que tem 44,5%, no 2º turno - Metrópoles',
    'VOX BRASIL: Flávio ultrapassa Lula e lidera numericamente o 2º turno com 45,1% contra 44,5%',
    'Marina, André e Tebet empatam na disputa ao Senado em SP, diz Vox - Poder360',
  ]
  for (const t of titulos) conferir(`casa: "${t.slice(0, 38)}..."`, c.alvos.some((a) => a.test(t)))

  // ⛔ O caso que separa esta casa da homônima: "Vox Populi" é outro instituto e
  // não pode contar como cobertura desta. Ele aparece ZERO vez nos 30 dias
  // medidos, então sem esta asserção a exclusão passaria verde por ausência.
  const outra = [
    'Pesquisa Vox Populi: Lula tem 40% e Flávio, 35% no 1º turno',
    'Vox Populi divulga levantamento sobre aprovação do governo',
  ]
  for (const t of outra) conferir(`a casa homônima fica de fora: "${t.slice(0, 30)}..."`, !c.alvos.some((a) => a.test(t)))
}

console.log('\n10d. 🔴 A casa que é VEÍCULO: JOTA, e o rodapé do Google News (24/Set/2026)')
{
  const c = casaDoRegistro('JOTA JORNALISMO S/A')
  conferir('o registro cai na entrada', c?.nome === 'JOTA Jornalismo', c?.nome)

  // 🔴⭐ O CASO QUE DERRUBA A LINHA INGÊNUA, e os 5 são REAIS, copiados do cache
  // de 30 dias. Com `palavra('jota')` os cinco casariam e a casa sairia COBERTA
  // com 89 itens sem um único item de pesquisa dela. Nenhum pode casar:
  //   · os 3 primeiros são o nome da FONTE que o Google News cola no fim;
  //   · o 4º é um candidato a vice cujo nome é Jota;
  //   · o 5º é o jogador Diogo Jota, em matéria de futebol saudita.
  const rodape = [
    'Quem são os candidatos à Presidência da República nas eleições 2026 - JOTA Info',
    'Indexa/Broadcast: Lula marca 46% contra 41% de Flávio Bolsonaro no 2º turno - JOTA Info',
    'AtlasIntel: Flávio avança no Centro-Oeste, e Lula, no Rio de Janeiro - JOTA Jornalismo',
    'Jota Rodrigues 29 (PCO): candidato a Vice-Governador por RR - Gazeta do Povo',
    'Futebol saudita vai punir torcedores por cantos ofensivos sobre Diogo Jota',
  ]
  for (const t of rodape) conferir(`rodapé e homônimo ficam de fora: "${t.slice(0, 40)}..."`, !c.alvos.some((a) => a.test(t)))

  // ⚠️ E o par que prova que a entrada não é um "nunca casa": pesquisa desta casa
  // tem de ser vista. As duas ordens da barra entram porque é a forma que a
  // imprensa usa para parceria, medida no mesmo cache em "Globo/Quaest".
  const dela = [
    'Pesquisa JOTA: Lula tem 41% e Flávio Bolsonaro, 38%, no 1º turno',
    'JOTA/Quaest: eleitor indeciso cai a 9% na reta final',
    'Nexus/JOTA mostra disputa embolada no Senado por São Paulo',
    'Levantamento do JOTA aponta empate técnico no 2º turno',
    'JOTA divulga pesquisa nacional com 6.000 entrevistas',
  ]
  for (const t of dela) conferir(`pesquisa da casa casa: "${t.slice(0, 34)}..."`, c.alvos.some((a) => a.test(t)))

  // 🔑 E o estado de hoje é INDETERMINADO, não buraco: a divulgação é 29/Set e o
  // cache nunca viu a casa. Disparar aqui treinaria a pular o aviso.
  const r = medirCobertura([reg('JOTA JORNALISMO S/A', '2026-09-29', 'BR058692026')], [cache('2026-09-24', 'Datafolha divulga nova pesquisa - JOTA Info')], '2026-09-24')
  const j = r.casas.find((x) => x.nome === 'JOTA Jornalismo')
  conferir('a casa entrou na tabela e não é mais desconhecida', r.desconhecidas.length === 0, JSON.stringify(r.desconhecidas))
  conferir('o rodapé do veículo não conta como item', j?.itens === 0, JSON.stringify(j))
  conferir('divulgação futura é INDETERMINADO', j?.estado === 'INDETERMINADO', j?.estado)
  conferir('e o veredito não reprova', r.veredito === 'COBERTURA_OK', r.veredito)
}

console.log('\n11. Entrada inválida não vira casa fantasma')
{
  conferir('null', casaDoRegistro(null) === null)
  conferir('vazio', casaDoRegistro('   ') === null)
  conferir('número', casaDoRegistro(42) === null)
}

console.log('\n12. Base VAZIA não é cobertura perfeita')
{
  const r = medirCobertura([], [cache('2026-09-18', 'x')], '2026-09-18')
  conferir('sem nacionais, nenhuma casa medida', r.casas.length === 0)
  conferir('e o veredito não finge aprovação de nada', r.veredito === 'COBERTURA_OK')
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
