#!/usr/bin/env node
/**
 * Teste da régua que separa PROMESSA de PUBLICAÇÃO.
 *
 * Os dois casos reais de 20/Set/2026 estão plantados, e eles são opostos:
 * a Palver prometeu e não saiu, a Veritá saiu dois dias depois do prometido.
 * Se um dia a régua deixar de separar os dois, isto fica vermelho.
 */
import { classificarTitulo, medirSaida, ehNacional, semVeiculo, separarFantasmas, normalizarProtocolo, divulgacaoAntesDoCampo } from '../lib/tse/saiu-hoje-brz.mjs'

let ok = 0
let falhas = 0
const eq = (achado, esperado, nome) => {
  if (achado === esperado) return void ok++
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}

console.log('\n🧪 classificarTitulo — manchete de RESULTADO x manchete de ANÚNCIO\n')

// ── os dois títulos REAIS de 20/Set, que são o motivo do módulo ──────────────
eq(
  classificarTitulo('Palver divulga nova pesquisa presidencial neste domingo (20/9)'),
  'ANUNCIO',
  'Palver 00:01: "divulga nova pesquisa ... neste domingo" é ANUNCIO'
)
eq(
  classificarTitulo('Pesquisa Veritá mostra Flávio Bolsonaro com 45,73% e Lula com 41,56%'),
  'COM_NUMERO',
  'Veritá 20:18: traz percentual, é COM_NUMERO'
)

// ⚠️ O caso que prova que `divulga` sozinho NAO pode ser marcador de anuncio.
eq(classificarTitulo('Datafolha divulga: Lula tem 44% e Flávio, 40%'), 'COM_NUMERO', 'divulga + numero = resultado')
eq(classificarTitulo('Quaest divulga nova pesquisa nesta terça'), 'ANUNCIO', 'divulga + marca de tempo = anuncio')

// 🔴 O caso que decide a ORDEM das duas regras, e sem ele inverter a ordem
//    passava batido na mutação: a manchete traz marca de ANÚNCIO **e**
//    percentual na mesma frase. O número vence, porque existe número para ir
//    conferir; tratar isto como anúncio esconderia um resultado que está lá.
eq(
  classificarTitulo('Datafolha divulga nesta sexta nova pesquisa; na anterior, Lula tinha 44%'),
  'COM_NUMERO',
  'anuncio E numero na mesma manchete: o NUMERO vence'
)
eq(
  classificarTitulo('Quaest divulga nesta terça a pesquisa que mediu Lula e Flávio'),
  'ANUNCIO',
  'a mesma forma SEM numero continua anuncio'
)

// ── outras formas de anúncio vistas no cache do dia ──────────────────────────
eq(classificarTitulo('Quaest, Datafolha e mais: as pesquisas presidenciais que saem nesta semana'), 'ANUNCIO', 'que saem nesta semana')
eq(classificarTitulo('Próxima pesquisa Datafolha para presidente: quando sai?'), 'ANUNCIO', 'proxima pesquisa / quando sai')
eq(classificarTitulo('DataTrends divulga à meia-noite nova pesquisa para governador'), 'ANUNCIO', 'sai as / a meia-noite')
eq(classificarTitulo('Nexus vai divulgar pesquisa na sexta'), 'ANUNCIO', 'vai divulgar')

// ── percentual em formatos diferentes ────────────────────────────────────────
eq(classificarTitulo('Flávio lidera no 1º turno com 45,53%'), 'COM_NUMERO', 'decimal com virgula')
eq(classificarTitulo('Lula tem 54% no Ceará contra 26%'), 'COM_NUMERO', 'inteiro')
eq(classificarTitulo('Lula e Flávio empatam com 41% no 2º turno'), 'COM_NUMERO', 'percentual no meio')

// ⛔ ANTI-ALARME: numero que NAO e percentual nao pode virar resultado.
eq(classificarTitulo('Pesquisa Veritá com 40,5 mil entrevistas'), 'MENCAO', 'amostra em mil NAO e percentual')
eq(classificarTitulo('Palver ouviu 5 mil pessoas entre 15 e 20 de setembro'), 'MENCAO', 'n e data nao sao percentual')

// ⛔ E mencao pura fica MENCAO, nunca vira as outras duas.
eq(classificarTitulo('TRE-AM barra pesquisa Veritá'), 'MENCAO', 'noticia sobre a casa, sem numero e sem anuncio')
eq(classificarTitulo(''), 'MENCAO', 'vazio')
eq(classificarTitulo(null), 'MENCAO', 'null nao quebra')

console.log('\n🧪 ehNacional — presidencial x estadual da MESMA casa\n')

// 🔴 Todos estes títulos são REAIS, do cache de 20/Set/2026. Sem o filtro o
//    medidor acusava 9 casas de 15, e a maioria era pesquisa ESTADUAL.
eq(ehNacional('Pesquisa Veritá mostra Flávio Bolsonaro com 45,73% e Lula com 41,56%'), true, 'Veritá nacional')
eq(ehNacional('Palver divulga nova pesquisa presidencial neste domingo (20/9)'), true, 'Palver: "presidencial"')
eq(
  ehNacional('Quaest, Datafolha e mais: as pesquisas presidenciais que saem nesta semana'),
  true,
  'PLURAL: "presidenciais" perde o L de "presidencial"'
)
eq(ehNacional('Paraná Pesquisas: No 2º Turno, Flávio Tem 45,2% E Lula, 44,1%'), true, 'Lula + Flávio sem marca de estado')

// ⛔ O CASO QUE O `\b` ASCII DEIXAVA PASSAR: nome de estado ACENTUADO.
eq(
  ehNacional('Lula tem 54% no Ceará contra 26% de Flávio Bolsonaro, mostra Datafolha'),
  false,
  '🔴 "no Ceará": o \\b nao casa depois do "á", e isso virava manchete NACIONAL'
)
eq(ehNacional('Ciro Gomes abre 7 pontos sobre Elmano no Ceará'), false, 'Ceará de novo')
eq(ehNacional('Lula e Flávio no Pará: levantamento aponta empate'), false, 'Pará, acento no fim')
eq(ehNacional('Disputa presidencial em Goiás tem Flávio à frente de Lula'), false, 'Goiás')
eq(ehNacional('Flávio lidera sobre Lula no Piauí'), false, 'Piauí')
eq(ehNacional('Pesquisa no Maranhão mostra Lula e Flávio'), false, 'Maranhão')

// ⛔ Cargo estadual, mesmo com os dois nomes nacionais por perto.
eq(ehNacional('DataTrends: Raquel tem 46% e João Campos, 38% na disputa pelo Governo de Pernambuco'), false, 'governo de')
eq(ehNacional('Manuela lidera disputa ao Senado no RS'), false, 'Senado')
eq(ehNacional('Zucco e Juliana Brizola empatam em 1º turno no RS'), false, 'sigla de UF')
// 🔴 O caso acima passava pelo motivo ERRADO: sem Lula nem Flávio no título ele
//    sai estadual por falta de marca presidencial, e a sigla nunca era testada.
//    Medido em 25/Set/2026: a regra só aceitava "em/de/do" antes da sigla, e a
//    manchete real do Poder360 abaixo, pesquisa do AMAZONAS, saiu como PoderData
//    nacional COM NUMERO. Os pares de teste agora têm Lula E Flávio, para que só
//    a sigla possa decidir.
eq(ehNacional('Lula tem 44% e Flávio, 42% no 1º turno no AM, diz PoderData - Poder360'), false, '🔴 "no AM", manchete real de 25/Set')
eq(ehNacional('Flávio lidera sobre Lula na BA, aponta pesquisa'), false, '"na" antes da sigla')
eq(ehNacional('Lula e Flávio empatam no eleitorado da PB'), false, '"da" antes da sigla')
eq(ehNacional('Lula tem 40% e Flávio, 36% em SP'), false, '"em" continua valendo')
eq(ehNacional('Lula e Flávio Bolsonaro no STF: o que dizem os ministros'), true, '"no STF" NAO é UF: a sigla tem de terminar')
eq(ehNacional('Lula e Flávio em PAUTA no Congresso'), true, '"em PAUTA" NAO é a UF PA: palavra em caixa alta não é sigla')
eq(ehNacional('Quaest no RJ: Flávio, 35%; Lula, 33%; Cury, 5% - g1.globo.com'), false, 'recorte estadual real, "no RJ"')
eq(
  ehNacional('PESQUISA VERITÁ/VOTOS VÁLIDOS: Flávio lidera no 1º turno com 45,53%, seguido por Lula com 41,76%, em levantamento com 40,5 mil entrevistados nos 26 estados e no DF - Blog do BG'),
  true,
  '⚠️ "nos 26 estados e no DF" é NACIONAL: o DF ali não é recorte'
)
eq(
  ehNacional('Pesquisa Real Time Big Data testa disputa Lula x Flávio no terceiro maior colégio eleitoral'),
  false,
  '"colégio eleitoral" é como a imprensa nomeia um estado'
)

// ⚠️ A sigla de UF é case-SENSITIVE de propósito: sem isso, "de pé" vira PE.
eq(ehNacional('Lula e Flávio Bolsonaro disputam voto de pé de igualdade'), true, '"de pé" NAO pode virar a UF PE')

// 🔴 26/Set/2026: estado colado na casa, SEM preposição, e sigla depois de barra
eq(ehNacional('Datafolha Ceará aponta Lula com 56% contra 26% de Flávio Bolsonaro - Portal Ceará'), false, '🔴 "Datafolha Ceará", manchete real de 26/Set')
eq(ehNacional('Pesquisa Datafolha Ceará tem Lula 54% e Flávio Bolsonaro 26% - O POVO'), false, 'Datafolha Ceará, 2ª forma')
eq(ehNacional('Ceará dá 54% a Lula e deixa Flávio Bolsonaro em segundo, aponta Quaest'), false, 'estado ABRINDO a manchete')
eq(ehNacional('Datafolha/DF: No 2º turno, Flávio mantém 51% e Lula oscila de 39% a 41% - UOL Notícias'), false, '"/DF" depois da casa')
eq(ehNacional('Datafolha: Flávio lidera no 2º turno em São Paulo, Rio e Espiríto Santo'), false, 'São Paulo solto na enumeração')
// ⚠️ o que NÃO pode virar estadual
eq(ehNacional('Paraná Pesquisas: No 2º Turno, Flávio Tem 45,2% E Lula, 44,1% - media.unisba.ac.id'), true, '"Paraná Pesquisas" é CASA, não estado')
eq(ehNacional('Lula tem 40% e Flávio, 36% para presidente, diz pesquisa'), true, '"para" sem acento NÃO é o Pará')
// a regra tem caixa, então o caso que exerce o acento é "Para" abrindo a frase
eq(ehNacional('Para Quaest, Lula tem 40% e Flávio, 36% no 1º turno'), true, '"Para" maiúsculo, sem acento, NÃO é o Pará')
eq(ehNacional('Deputado do PSB-MG é o maior doador da campanha de Cury à Presidência'), true, 'hífen de partido NÃO é recorte')
eq(
  ehNacional('Flávio lidera com 45,53% e Lula tem 41,76%, com 40,5 mil entrevistados nos 26 estados e no Distrito Federal'),
  true,
  '"26 estados e no Distrito Federal" por extenso continua NACIONAL'
)

// 🔴 26/Set/2026: o NOME DO VEÍCULO decidia. 53 nacionais de setembro saíam estaduais.
eq(ehNacional('Datafolha: Lula tem 46% e Flávio Bolsonaro, 44% no segundo turno - Diario de Pernambuco'), true, '🔴 "- Diario de Pernambuco" é o veículo')
eq(ehNacional('Pesquisa Nexus/BTG aponta Lula com 40% e Flávio Bolsonaro com 37% no 1º turno - Portal de Prefeitura'), true, '"Prefeitura" do veículo NÃO é disputa municipal')
eq(ehNacional('AtlasIntel: Flávio vira sobre Lula no 2º turno - Estado de Minas'), true, '"- Estado de Minas"')
eq(ehNacional('PODERDATA/AYA: FLÁVIO BOLSONARO E LULA EMPATAM TECNICAMENTE NO 2º TURNO - - Bahia Economica'), true, 'traço duplo antes do veículo')
eq(ehNacional('Datafolha no RJ: Flávio Bolsonaro, 44%; Lula, 38% - G1'), false, 'e o recorte da MANCHETE continua valendo')
eq(semVeiculo('Datafolha: Lula 40% - 25/09/2026 - Brazil - Folha de S.Paulo'), 'Datafolha: Lula 40% - 25/09/2026 - Brazil', 'só o ÚLTIMO segmento sai')
eq(semVeiculo('Sem veículo nenhum'), 'Sem veículo nenhum', 'título sem sufixo fica intacto')

console.log('\n🧪 medirSaida — as DUAS divergências de 20/Set, em direções opostas\n')

const HOJE = '2026-09-20'
const palavra = (c) => new RegExp(`(?<!\\p{L})${c}(?!\\p{L})`, 'iu')

const CASAS = [
  { nome: 'Palver', alvos: [palavra('palver')], divulgacoes: ['2026-09-20', '2026-09-20'] },
  { nome: 'Veritá', alvos: [palavra('verit[áa]')], divulgacoes: ['2026-09-18'] },
  { nome: 'Datafolha', alvos: [palavra('datafolha')], divulgacoes: ['2026-09-24'] },
  // 🔴 Esta casa existe no conjunto SÓ para provar que o filtro nacional está
  //    ligado: ela publicou número de verdade hoje, e o número é ESTADUAL.
  //    Sem o filtro ela vira COM_NUMERO e inventa uma divergência.
  { nome: 'DataTrends', alvos: [palavra('datatrends')], divulgacoes: ['2026-09-16'] },
]
const TITULOS = [
  'Palver divulga nova pesquisa presidencial neste domingo (20/9)',
  'Pesquisa Veritá mostra Flávio Bolsonaro com 45,73% e Lula com 41,56%',
  'Flávio Bolsonaro lidera contra Lula por 3,77 pontos em pesquisa Veritá com 40,5 mil entrevistas',
  'Quaest, Datafolha e mais: as pesquisas presidenciais que saem nesta semana',
  'DataTrends: Raquel tem 46% e João Campos, 38% na disputa pelo Governo de Pernambuco',
  'DataTrends aponta Raquel Lyra com 46% na corrida pelo Governo de Pernambuco',
]

const r = medirSaida(CASAS, TITULOS, HOJE)
const de = (n) => r.linhas.find((l) => l.nome === n)

eq(de('Palver').estado, 'SO_ANUNCIO', 'Palver: so anuncio')
eq(de('Palver').prometeuHoje, true, 'Palver: prometeu hoje')
eq(de('Palver').divergencia, 'PROMETEU_E_NAO_SAIU', 'Palver: prometeu e nao saiu')

eq(de('Veritá').estado, 'COM_NUMERO', 'Veritá: com numero')
eq(de('Veritá').prometeuHoje, false, 'Veritá: NAO prometeu hoje')
eq(de('Veritá').divergencia, 'SAIU_DEPOIS_DO_PROMETIDO', 'Veritá: saiu depois do prometido')

// ⛔ O portao que NAO PODE disparar: casa que prometeu para o FUTURO e so
//    apareceu em anuncio esta em ordem, e nao pode virar alerta.
eq(de('Datafolha').estado, 'SO_ANUNCIO', 'Datafolha: so anuncio')
eq(de('Datafolha').divergencia, null, 'Datafolha promete para 24/Set: anuncio hoje NAO e divergencia')

// ⛔ O SEGUNDO portão que NÃO pode disparar: a DataTrends publicou dois números
//    hoje e os dois são do governo de Pernambuco. Ela tem de sair SEM_ITEM na
//    contagem nacional, com os estaduais contados ao lado.
eq(de('DataTrends').estado, 'SEM_ITEM', 'DataTrends: dois numeros ESTADUAIS nao contam como nacional')
eq(de('DataTrends').itens, 0, 'DataTrends: zero item nacional')
eq(de('DataTrends').itensEstaduais, 2, 'DataTrends: os dois estaduais ficam CONTADOS, nao sumidos')
eq(de('DataTrends').divergencia, null, 'DataTrends: numero estadual NAO inventa divergencia nacional')

eq(r.veredito, 'DIVERGEM', 'veredito do dia')

console.log('\n🧪 divulgacaoAntesDoCampo — a promessa que o próprio registro torna impossível\n')

// Os três registros reais de 25/Set/2026, com as datas copiadas do arquivo do TSE.
eq(divulgacaoAntesDoCampo({ fieldStart: '2026-09-30', fieldEnd: '2026-10-02', publicationDate: '2026-09-29' }), 'ANTES_DO_INICIO', '🔴 Gerp BR005092026: div antes do campo começar')
eq(divulgacaoAntesDoCampo({ campoInicio: '2026-10-01', campoFim: '2026-10-03', divulgacao: '2026-09-29' }), 'ANTES_DO_INICIO', 'Gerp BR081682026, nomes de campo do ZIP')
eq(divulgacaoAntesDoCampo({ fieldStart: '2026-03-24', fieldEnd: '2026-03-30', publicationDate: '2026-03-29' }), 'ANTES_DO_FIM', 'Veritá de março: um dia antes do fim')
// ⛔ Os que NÃO podem disparar.
eq(divulgacaoAntesDoCampo({ fieldStart: '2026-09-23', fieldEnd: '2026-09-26', publicationDate: '2026-09-27' }), null, 'Gerp BR039292026: div depois do campo, coerente')
eq(divulgacaoAntesDoCampo({ fieldStart: '2026-09-24', fieldEnd: '2026-09-27', publicationDate: '2026-09-27' }), null, 'div NO último dia de campo é coerente (sai à noite)')
eq(divulgacaoAntesDoCampo({ fieldStart: '2026-09-24', fieldEnd: '2026-09-27', publicationDate: '2026-09-28T00:00:00.000Z' }), null, 'data ISO completa da API')
eq(divulgacaoAntesDoCampo({ fieldEnd: '2026-09-27', publicationDate: null }), null, 'sem divulgação: não inventa')
eq(divulgacaoAntesDoCampo({ fieldStart: null, fieldEnd: '2026-10-02', publicationDate: '2026-09-29' }), 'ANTES_DO_FIM', 'sem início ainda mede contra o fim')
eq(divulgacaoAntesDoCampo(null), null, 'null não quebra')

// A casa com as duas promessas impossíveis de 29/Set, e ZERO número no dia.
const r29 = medirSaida(
  [{ nome: 'Gerp', alvos: [palavra('gerp')], divulgacoes: ['2026-09-27'], divulgacoesIncoerentes: ['2026-09-29', '2026-09-29'] }],
  ['Gerp registra nova pesquisa presidencial'],
  '2026-09-29'
)
eq(r29.linhas[0].prometeuHoje, false, 'Gerp 29/Set: promessa impossível NÃO conta como prometeu hoje')
eq(r29.linhas[0].divergencia, null, '🔴 Gerp 29/Set: NÃO pode sair PROMETEU_E_NAO_SAIU')
eq(r29.linhas[0].aviso, 'DIVULGACAO_ANTES_DO_CAMPO', 'Gerp 29/Set: mas também não some, sai com aviso nomeado')
eq(r29.veredito, 'PROMESSA_E_MUNDO_BATEM', 'aviso não é divergência')
// E a mesma casa com promessa COERENTE no dia continua cobrada.
const r27 = medirSaida(
  [{ nome: 'Gerp', alvos: [palavra('gerp')], divulgacoes: ['2026-09-27'], divulgacoesIncoerentes: ['2026-09-29'] }],
  [],
  '2026-09-27'
)
eq(r27.linhas[0].divergencia, 'PROMETEU_E_NAO_SAIU', 'Gerp 27/Set, promessa coerente: continua cobrada')
eq(r27.linhas[0].aviso, null, 'e sem aviso')
eq(r.alerta.length, 2, 'duas divergencias, e sao as duas opostas')

// ── o caso em que tudo bate: prometeu hoje e saiu com numero ─────────────────
{
  const r2 = medirSaida(
    [{ nome: 'Quaest', alvos: [palavra('quaest')], divulgacoes: ['2026-09-20'] }],
    ['Quaest: Lula e Flávio empatam com 41% no 2º turno'],
    HOJE
  )
  eq(r2.linhas[0].estado, 'COM_NUMERO', 'prometeu e saiu: estado')
  eq(r2.linhas[0].divergencia, null, 'prometeu e saiu: sem divergencia')
  eq(r2.veredito, 'PROMESSA_E_MUNDO_BATEM', 'veredito limpo')
}

// ── casa sem item nenhum, sem promessa: silencio em ordem ────────────────────
{
  const r3 = medirSaida([{ nome: 'MDA', alvos: [palavra('mda')], divulgacoes: ['2026-09-15'] }], ['nada a ver'], HOJE)
  eq(r3.linhas[0].estado, 'SEM_ITEM', 'sem item')
  eq(r3.linhas[0].divergencia, null, 'sem promessa hoje e sem numero: nao e divergencia')
}

// ── ANTI-SILENCIO de tipo: data invalida tem de LANCAR, nunca virar 1970 ─────
for (const ruim of [null, undefined, '', '20/09/2026', 0, true, new Date()]) {
  let lancou = false
  try {
    medirSaida([], [], ruim)
  } catch {
    lancou = true
  }
  eq(lancou, true, `hoje=${JSON.stringify(ruim)} tem de LANCAR`)
}
for (const ruim of [null, 'x', 42]) {
  let lancou = false
  try {
    medirSaida(ruim, [], HOJE)
  } catch {
    lancou = true
  }
  eq(lancou, true, `casas=${JSON.stringify(ruim)} tem de LANCAR`)
}


// ── 👻 SEPARAR FANTASMA, medido em 23/Set/2026 ────────────────────────────────
//
// A rota serve o BANCO e o banco nunca esquece. Naquele dia a Real Time saiu
// como PROMETEU_E_NAO_SAIU "prometeu HOJE" e a promessa estava RETIRADA: a
// BR-00548/2026 já não estava no arquivo do TSE, e o relatório do passo 2 a
// marcava com 👻 na mesma rodada.
console.log('\n🧪 separarFantasmas — o banco nunca esquece, e o TSE retira\n')

const reais = [
  { protocol: 'BR047392026', institute: 'AtlasIntel', publicationDate: '2026-09-23' },
  { protocol: 'BR005482026', institute: 'Real Time Big Data', publicationDate: '2026-09-23' },
  { protocol: 'BR042022026', institute: 'Real Time Big Data', publicationDate: '2026-09-24' },
]

const caso = separarFantasmas(reais, ['BR005482026'])
eq(caso.vivas.length, 2, 'o caso real de 23/Set deixa 2 vivas')
eq(caso.retiradas.length, 1, 'e separa 1 retirada')
eq(caso.retiradas[0].protocol, 'BR005482026', 'a retirada é a BR-00548/2026')
eq(caso.vivas.some((r) => r.protocol === 'BR042022026'), true, 'a OUTRA da mesma casa continua viva')
eq(caso.suspeito, false, 'com casamento, nada de suspeito')

// 🔑 o ledger grava sem pontuação e a rota pode devolver com: o casamento é
//    por protocolo NORMALIZADO, senão o filtro vira um no-op silencioso
eq(normalizarProtocolo('BR-00548/2026'), 'BR005482026', 'normaliza pontuação')
eq(normalizarProtocolo('br005482026'), 'BR005482026', 'normaliza caixa')
eq(normalizarProtocolo(null), '', 'nulo vira string vazia, nunca casa')
eq(
  separarFantasmas([{ protocol: 'BR-00548/2026' }], ['BR005482026']).retiradas.length,
  1,
  'rota com pontuação casa com ledger sem pontuação'
)

// ── ANTI-EXCESSO: sem ledger NÃO se filtra, e isso se declara ────────────────
const semLedger = separarFantasmas(reais, null)
eq(semLedger.vivas.length, 3, 'sem ledger nenhuma linha é cortada')
eq(semLedger.semLedger, true, 'e o estado sai declarado')
eq(semLedger.retiradas.length, 0, 'sem ledger não se inventa retirada')

// ── ANTI-SILÊNCIO: ledger com nomes e ZERO casamento é formato que mudou ─────
const nenhumCasou = separarFantasmas(reais, ['XX999999999'])
eq(nenhumCasou.suspeito, true, 'ledger com fantasma e zero casamento sai SUSPEITO')
eq(nenhumCasou.vivas.length, 3, 'e não corta nada, porque cortar seria pior')

// ledger vazio não é suspeito: é arquivo sem retirada, que acontece
eq(separarFantasmas(reais, []).suspeito, false, 'ledger vazio não é suspeito')
// lista de servidas vazia também não acusa formato
eq(separarFantasmas([], ['BR005482026']).suspeito, false, 'sem servidas não há o que casar')

// 🔴 26/Set/2026: o formato se confere no UNIVERSO servido. Nacionais sem
//    nenhuma retirada é o caso NORMAL, e o alarme gritava nele.
const nacionaisLimpas = [{ protocol: 'BR047392026' }, { protocol: 'BR042022026' }]
const rotaInteira = [...nacionaisLimpas, { protocol: 'BR081552026' }]
const normal = separarFantasmas(nacionaisLimpas, ['BR081552026'], { universo: rotaInteira })
eq(normal.suspeito, false, 'nacionais sem retirada e rota COM casamento: NÃO é suspeito')
eq(normal.casamNoUniverso, 1, 'e o casamento no universo sai contado')
eq(normal.vivas.length, 2, 'e nenhuma nacional é cortada')
eq(
  separarFantasmas(nacionaisLimpas, ['XX999999999'], { universo: rotaInteira }).suspeito,
  true,
  'rota inteira sem NENHUM casamento continua SUSPEITO'
)
eq(
  separarFantasmas(nacionaisLimpas, ['BR081552026']).suspeito,
  true,
  'sem universo vale o conjunto cortado, como antes'
)

// ⛔ registro sem protocolo nunca é cortado por engano
eq(separarFantasmas([{ institute: 'X' }], ['BR005482026']).vivas.length, 1, 'registro sem protocolo fica VIVO')

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${ok} asserção(ões) passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
