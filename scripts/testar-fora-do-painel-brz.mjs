#!/usr/bin/env node
/**
 * Teste da régua FORA DO PAINEL: a nacional que terminou o campo está no polls-data?
 *
 * O caso real de 17/Out/2026 está plantado: a Gerp BR-05187, campo de 14 a
 * 16/Out, divulgação registrada para 13/Out (ANTES do campo), número na
 * imprensa na noite de 16/Out, e fora do painel. E o falso alarme do mesmo dia
 * também: a Futura repercutida no dia 17 com os números da onda de 16/Out, que
 * já está no painel, acusando um protocolo cujo campo acabou no dia 17.
 */
import { classificarForaDoPainel, numerosDoPainel, percentuais, protocolosDoPainel, diaCivilDoItem } from '../lib/tse/fora-do-painel-brz.mjs'
import { CASAS_BRZ, casaDoRegistro } from './lib/cobertura-imprensa-brz.mjs'

let ok = 0
let falhas = 0
const eq = (achado, esperado, nome) => {
  if (JSON.stringify(achado) === JSON.stringify(esperado)) return void ok++
  falhas++
  console.error(`  ❌ ${nome}\n       esperado ${JSON.stringify(esperado)}\n       achado   ${JSON.stringify(achado)}`)
}
const lanca = (fn, nome) => {
  try { fn() } catch { return void ok++ }
  falhas++
  console.error(`  ❌ ${nome}: devia lançar e não lançou`)
}

const casaDe = (n) => casaDoRegistro(n) ?? CASAS_BRZ.find((c) => c.alvos.some((re) => re.test(String(n ?? '')))) ?? null

const PAINEL = {
  polls: [
    { institute: 'Gerp', date: '2026-10-12', register: 'BR-07877/2026', note: 'Gerp 53% a 44% no total, 55% a 45% nos válidos; na rodada de 03/Out, registro BR-00509/2026, 46% a 44%', secondRound: [{ percent1: 44, percent2: 53 }] },
    { institute: 'Futura/100% Cidades', date: '2026-10-16', register: 'BR-03764/2026', note: 'nos votos válidos, 50,8% a 49,2%', secondRound: [{ percent1: 47.5, percent2: 49 }] },
    { institute: 'Sem Protocolo', date: '2026-10-01', note: '' },
  ],
}
const { protocolos, semRegistro } = protocolosDoPainel(PAINEL)
const numeros = numerosDoPainel(PAINEL, casaDe)

console.log('\n🧪 protocolosDoPainel — só o `register`, nunca a `note`\n')
eq(protocolos.has('BR078772026'), true, 'register BR-07877/2026 normaliza para BR078772026')
eq(protocolos.has('BR005092026'), false, 'protocolo de onda ANTERIOR citado na nota não conta como publicado')
eq(semRegistro, ['2026-10-01 Sem Protocolo'], 'pesquisa sem register sai LOUD')
lanca(() => protocolosDoPainel({}), 'polls-data sem `polls` lança, não vira painel vazio')

console.log('\n🧪 percentuais e números do painel\n')
eq(percentuais('Flávio tem 50,8% e Lula 49.2 %; 50,0%'), ['50,8', '49,2', '50'], 'vírgula, ponto e ",0" normalizados')
eq(numeros.get('100 Cidades (Futura)')?.has('50,8'), true, '"Futura/100% Cidades" do painel cai na casa pelos alvos de imprensa')
eq(numeros.get('Gerp')?.has('55'), true, 'número da nota entra no conjunto da casa')

console.log('\n🧪 diaCivilDoItem — o pubDate é GMT, o dia é do Brasil\n')
eq(diaCivilDoItem('Sat, 17 Oct 2026 02:30:00 GMT'), '2026-10-16', '02:30Z é 23:30 do dia anterior em Brasília')
eq(diaCivilDoItem('lixo'), null, 'pubDate ilegível dá null')

const REG = [
  // o caso real: div registrada ANTES do campo, campo acabou ontem, fora do painel
  { protocolo: 'BR051872026', institute: 'Gerp', scope: 'national', fieldEnd: '2026-10-16', publicationDate: '2026-10-13', sampleSize: 2400 },
  // o falso alarme real: campo acabou HOJE, só repercussão da onda que está no painel
  { protocolo: 'BR067152026', institute: '100 Cidades', scope: 'national', fieldEnd: '2026-10-17', publicationDate: '2026-10-19' },
  { protocolo: 'BR078772026', institute: 'Gerp', scope: 'national', fieldEnd: '2026-10-11', publicationDate: '2026-10-13' },
  { protocolo: 'BR087712026', institute: 'Instituto Vox Brasil', scope: 'national', fieldEnd: '2026-10-15', publicationDate: '2026-10-16' },
  { protocolo: 'BR024182026', institute: 'AtlasIntel', scope: 'national', fieldEnd: '2026-10-18', publicationDate: '2026-10-19' },
  { protocolo: 'BR099992026', institute: 'Casa Que Ninguém Conhece', scope: 'national', fieldEnd: '2026-10-15', publicationDate: '2026-10-16' },
  { protocolo: 'BR011112026', institute: 'Quaest', scope: 'national', fieldEnd: '2026-10-15', publicationDate: '2026-10-16' },
  { protocolo: 'BR022222026', institute: 'Datafolha', scope: 'state', fieldEnd: '2026-10-15', publicationDate: '2026-10-16' },
  { protocolo: 'BR033332026', institute: 'Datafolha', scope: 'national', fieldEnd: '2026-09-30', publicationDate: '2026-10-01' },
]
const ITENS = [
  { title: 'Flávio tem 52% e Lula, 48% dos votos válidos no 2º turno, diz Gerp - Poder360', pubDate: 'Fri, 16 Oct 2026 21:06:21 GMT' },
  { title: 'Gerp aponta Flávio com 55% e Lula com 45% - RS Notícia', pubDate: 'Fri, 16 Oct 2026 09:38:00 GMT' },
  { title: 'Pesquisa Futura: Flávio Bolsonaro tem 50,8% dos votos válidos; Lula aparece com 49,2% - Goiás 246', pubDate: 'Sat, 17 Oct 2026 13:00:00 GMT' },
  // Quaest: número de ANTES do fim do campo, e número ESTADUAL depois dele
  { title: 'Quaest: Flávio tem 46% e Lula 44% - Estadão', pubDate: 'Wed, 14 Oct 2026 21:00:00 GMT' },
  { title: 'Quaest no RJ: Flávio tem 49% e Lula 40% - O Globo', pubDate: 'Fri, 16 Oct 2026 12:00:00 GMT' },
]
const r = classificarForaDoPainel(REG, { painel: protocolos, fantasmas: new Set(['BR087712026']), itens: ITENS, hoje: '2026-10-17', desde: '2026-10-05', casaDe, numerosPublicados: numeros })
const estado = (p) => r.linhas.find((l) => l.protocolo === p)?.estado ?? 'AUSENTE'

console.log('\n🧪 classificarForaDoPainel — o caso de 17/Out e os que NÃO podem disparar\n')
eq(estado('BR051872026'), 'FORA_COM_NUMERO', 'Gerp BR-05187: div antes do campo NÃO a esconde, e o 52 x 48 é número novo')
eq(r.linhas.find((l) => l.protocolo === 'BR051872026')?.repercussao, 1, 'o 55 x 45 de 16/Out 06h38 BRT cai no dia do fim do campo e sai como REPERCUSSÃO da onda de 13/Out')
eq(estado('BR067152026'), 'FORA_SEM_NUMERO', 'Futura do dia 17 com 50,8 x 49,2 é REPERCUSSÃO da onda do painel')
eq(r.linhas.find((l) => l.protocolo === 'BR067152026')?.repercussao, 1, 'e a repercussão sai contada, não some')
eq(estado('BR078772026'), 'NO_PAINEL', 'protocolo no register é NO_PAINEL')
eq(estado('BR087712026'), 'RETIRADA', 'retirada do TSE não é cobrada')
eq(estado('BR024182026'), 'EM_CAMPO', 'campo que acaba amanhã não é cobrado')
eq(estado('BR099992026'), 'CASA_SEM_TABELA', 'casa fora de CASAS_BRZ sai LOUD, não FORA_SEM_NUMERO')
eq(estado('BR011112026'), 'FORA_SEM_NUMERO', 'Quaest: número de antes do campo acabar e número ESTADUAL não contam')
eq(estado('BR022222026'), 'AUSENTE', 'registro estadual fica fora')
eq(estado('BR033332026'), 'AUSENTE', 'campo antes de `desde` fica fora')
eq(r.veredito, 'FALTA_NO_PAINEL', 'veredito do caso real')

const semGerp = classificarForaDoPainel(REG.filter((x) => x.protocolo !== 'BR051872026' && x.protocolo !== 'BR099992026'), { painel: protocolos, fantasmas: new Set(['BR087712026']), itens: ITENS, hoje: '2026-10-17', desde: '2026-10-05', casaDe, numerosPublicados: numeros })
eq(semGerp.veredito, 'EM_DIA', 'sem a Gerp e sem casa desconhecida, EM_DIA')

lanca(() => classificarForaDoPainel(REG, { painel: protocolos, hoje: null, desde: '2026-10-05', casaDe }), 'hoje null lança (viraria 1970)')
lanca(() => classificarForaDoPainel(REG, { painel: [...protocolos], hoje: '2026-10-17', desde: '2026-10-05', casaDe }), 'painel que não é Set lança')

console.log(`\n${falhas ? '🔴' : '✅'} ${ok} ok, ${falhas} falha(s)\n`)
process.exit(falhas ? 1 : 0)
