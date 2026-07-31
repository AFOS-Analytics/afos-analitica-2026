/**
 * REBASELINE do painel de 31/Jul para a captura das 19:25 BRT.
 *
 * POR QUE: o gate da ETAPA 1.1 do /afos-daily disparou por três motivos ao
 * mesmo tempo. Lula subiu 1,00pp desde o painel das 17:33, ROMPEU o topo da
 * série (63,50%, igualado em 26, 28, 30 e 31/Jul, nunca superado desde 14/Abr)
 * e o gap passou de +39,55pp para +40,15pp, o mais largo da série que tem os
 * dois nomes, que começa em 03/Mai, e a primeira vez acima de 40pp.
 *
 * CONFIRMAÇÃO: a trava rodou 4 rodadas hoje. A 3a (22:07-22:15 UTC) reprovou
 * justamente porque Lula estava indo de 63,50% para 64,50%. A 4a (22:16-22:24)
 * repetiu o presidencial inteiro e reprovou só o MDB do Senado. Logo o
 * presidencial entra FIRME e o MDB entra como FAIXA declarada.
 *
 * ⚠️ CORRIGE TAMBÉM UM ERRO DE FATO: o cartão do Master dizia "não trouxe ato
 * novo no caso Master". Trouxe. Em 31/Jul a PF apontou 74 ligações entre o
 * senador Jaques Wagner e o ex-sócio do banco, Mendonça retirou o sigilo de
 * parte da investigação e autorizou o monitoramento do celular do senador, e o
 * Novo pediu processo no Conselho de Ética. Mesmo padrão do erro da Tereza
 * Cristina: o dado estava no cache do dia e o filtro não pegou.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

const HORA = '31/07/2026, 19:25'

function set(raiz: any, caminho: string, valor: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) { if (no == null) { erros.push(`${rot}: caminho quebrado`); return } no = no[p] }
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente ${caminho}`); return }
  no[u] = valor
}
function troca(raiz: any, caminho: string, de: string, para: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) no = no?.[p]
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente`); return }
  if (!no[u].includes(de)) { erros.push(`${rot}: trecho não encontrado -> "${de.slice(0, 60)}"`); return }
  no[u] = no[u].replace(de, para)
}

const TRAVA = 'UMA NOTA DE CAPTURA, e ela explica o número principal. A trava de dupla leitura rodou QUATRO rodadas hoje e reprovou todas. A terceira reprovou justamente porque Lula estava em trânsito de 63,50% para 64,50%. A quarta repetiu o contrato presidencial inteiro e reprovou um book só, o do MDB no Senado. Por isso o presidencial entra FIRME, incluindo os 64,50%, e o MDB entra como FAIXA declarada de 24,65% a 26,65%.'

// ─────────────────────────── analysis-criteriosa ───────────────────────────
oAc.updatedAt = HORA

set(oAc, 'subtitle',
`ATUALIZAÇÃO 31/Jul 19:25 BRT, a 65 dias do 1º turno. LULA ROMPEU O TOPO DA SÉRIE. O favorito subiu 1,00pp e foi a 64,50% (vol USD 7,77M), superando pela primeira vez os 63,50% que a série do AFOS vinha igualando sem ultrapassar em 26, 28, 30 e 31/Jul, e que nunca haviam sido superados desde 14/Abr. Flávio SUBIU 0,40pp, para 24,35% (vol USD 7,76M), e mesmo assim o gap ABRIU de +39,55pp para +40,15pp, o mais largo da série que tem os dois nomes, iniciada em 03/Mai, cujo máximo anterior era +39,80pp de 26/Jul. É a primeira leitura acima de 40pp. A URNA DO DIA: Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026) dá Lula 40,5% x Flávio 31,2% no 1º turno, com Caiado 5,5%, Zema 3,2% e Renan Santos 3,0%, e Lula 47,5% x Flávio 41,1% no returno. São 9,3pp de gap no 1º turno e 6,4pp no returno. O ACHADO POLÍTICO É O ISOLAMENTO DE FLÁVIO, e ele tem duas partes no mesmo dia. O PP anunciou NEUTRALIDADE nas eleições, informando que consultou os diretórios estaduais e decidiu não convocar Convenção Nacional, o que barra a chapa e elimina Tereza Cristina como vice; a senadora, que lidera o PP no Senado, compartilhou a nota e acatou, e Flávio respondeu que respeita e que não desiste. Horas depois, o Republicanos marcou convenção nacional para 04/Ago com a maioria dos diretórios estaduais consultados defendendo neutralidade, encaminhando a recusa de aliança. O painel registra o verbo com precisão: o PP DECIDIU, o Republicanos ainda NÃO decidiu. Em 24/Jul esta série já havia registrado que, sem a federação União-PP, Flávio buscava Republicanos e Podemos. As duas portas que ele procurou estão agora fechando. O SEGUNDO ACHADO É RENAN SANTOS, e ele é de sequência. TRÊS institutos seguidos o cortaram: AtlasIntel 7,8% em 29/Jul, PoderData 4% em 30/Jul e Vox Brasil 3,0% em 31/Jul. Com o preço em 8,15% (vol USD 8,63M), a distância entre mercado e urna vai a 5,15pp, a maior do recorte. Em 29/Jul o painel registrou essa distância em 0,90pp e chamou de convergência. Três institutos depois, ela quadruplicou, e fica registrado que aquela leitura não se sustentou. E há uma contradição DENTRO do próprio mercado: no mesmo dia em que o contrato de vencedor dele cede 0,30pp, o book de 2º lugar do 1º turno SOBE 3,25pp, de 6,10% para 9,35% (vol USD 1,09M). CAIADO DEVOLVEU TUDO E MAIS: caiu 0,95pp contra os 2,55% de 30/Jul e voltou a 1,60% (vol USD 5,22M), mas SUBIU 2,00pp no book de 3º lugar, para 27,50%. No mesmo dia, a Vox lhe deu 5,5%, a melhor urna nacional dele no recorte. CAMILO SANTANA subiu 0,85pp, de 0,50% para 1,35% (vol USD 4,17M), e a ressalva de série é obrigatória: 1,35% NÃO é recorde, o máximo dele é 4,10% de 03/Mai, e o movimento é recuperação do MÍNIMO da série, os 0,50% marcados em 30/Jul. Volume total acumulado no presidencial em USD 117,06M. Cruzamento com Polymarket ao vivo 31/Jul 22:25 UTC. ${TRAVA}`,
  'AC.subtitle')

// ── Lula ──
set(oAc, 'candidates[0].header',
'Polymarket 64,50% (alta 1,00pp, vol USD 7,77M acumulado), a 65 dias da eleição, ROMPENDO o topo da série do AFOS. O gap sobre Flávio abre para +40,15pp, o mais largo desde 03/Mai e o primeiro acima de 40pp. A urna do dia, Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026), dá 40,5% no 1º turno e 47,5% x 41,1% no returno.',
  'AC.c0.header')
set(oAc, 'candidates[0].fortes[0]',
'SUPEROU pela primeira vez os 63,50% que vinha igualando sem romper em 26, 28, 30 e 31/Jul, e foi a 64,50%, o maior valor da série do AFOS desde 14/Abr.', 'AC.c0.f0')
set(oAc, 'candidates[0].fracos[0]',
'O gap de +40,15pp é o mais largo desde 03/Mai, início da série que tem os dois nomes, mas abriu num dia em que Flávio TAMBÉM subiu, o que afasta a leitura de deterioração do adversário.', 'AC.c0.fr0')
troca(oAc, 'candidates[0].analise',
'O dia dele é o de quem não se moveu enquanto o resto do tabuleiro se movia. O contrato de vencedor ficou em 63,50% pelo segundo pregão seguido, mantendo o valor que iguala o topo da série do AFOS, e o gap recuou para +39,20pp porque Flávio subiu, não porque ele caiu.',
'O dia dele terminou onde ele nunca tinha estado. O contrato de vencedor SUBIU 1,00pp e foi a 64,50%, rompendo os 63,50% que a série vinha igualando sem superar em 26, 28, 30 e 31/Jul. O gap ABRIU para +40,15pp, o mais largo desde 03/Mai e o primeiro acima de 40pp, e abriu mesmo com Flávio subindo 0,40pp, o que quer dizer que o movimento é de demanda pelo favorito e não de deterioração do adversário.',
  'AC.c0.analise.abertura')
troca(oAc, 'candidates[0].analise',
'DOIS NOMES DO CAMPO DELE SUBIRAM NO MERCADO no mesmo dia, Camilo Santana a 2,20% e Geraldo Alckmin a 1,10%, e o PCdoB formalizou apoio à chapa Lula-Alckmin. O painel registra a coincidência e não afirma causa. Sobre Camilo, a ressalva de série é obrigatória e desfaz a leitura fácil: 2,20% NÃO é recorde dele, o máximo da série é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO histórico, 0,50%, marcado ontem mesmo.',
'NO CAMPO DELE, Camilo Santana subiu 0,85pp e fechou a captura em 1,35% e Geraldo Alckmin ficou em 0,45%, no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin. O painel registra a coincidência e não afirma causa. Sobre Camilo, a ressalva de série é obrigatória: 1,35% NÃO é recorde dele, o máximo da série é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO da série, 0,50%, marcado em 30/Jul. Os dois passaram por valores mais altos ao longo do dia, 2,20% e 1,10% às 17:33, e devolveram parte antes do fechamento desta captura.',
  'AC.c0.analise.campo')

// ── Flávio ──
set(oAc, 'candidates[1].header',
'Polymarket 24,35% (alta 0,40pp, vol USD 7,76M acumulado), mas o gap ABRE para +40,15pp porque Lula subiu mais. CAI nos dois books de colocação: 0,50pp no 2º lugar do 1º turno, para 78,50%, e fica em 5,65% no 3º lugar. A Vox Brasil o dá em 31,2% no 1º turno e 41,1% no returno. Perdeu o PP e o Republicanos caminha para recusar aliança.',
  'AC.c1.header')
set(oAc, 'candidates[1].fortes[0]',
'SOBE 0,40pp no contrato de vencedor, para 24,35%, o quinto pregão seguido sem queda naquele contrato.', 'AC.c1.f0')
set(oAc, 'candidates[1].fortes[3]',
'Mantém 78,50% no book de 2º lugar do 1º turno, ou seja, a posição de returno segue consolidada e não em disputa.', 'AC.c1.f3')
set(oAc, 'candidates[1].fracos[0]',
'SUBIU no contrato de vencedor e mesmo assim VIU O GAP ABRIR de +39,55pp para +40,15pp, porque Lula subiu 1,00pp no mesmo pregão.', 'AC.c1.fr0')
set(oAc, 'candidates[1].fracos[3]',
'O Republicanos marcou convenção nacional para 04/Ago com a maioria dos diretórios consultados defendendo neutralidade, encaminhando a recusa de aliança; é o segundo partido a fechar a porta em 24 horas, depois do PP.', 'AC.c1.fr3')

// ── Renan ──
set(oAc, 'candidates[2].header',
'Polymarket 8,15% no vencedor (queda 0,30pp, vol USD 8,63M acumulado). TRÊS institutos seguidos o cortaram, de 7,8% para 4% e agora 3,0% na Vox, e a distância entre preço e urna vai a 5,15pp, a maior do recorte. Mas o book de 2º lugar do 1º turno SOBE 3,25pp, para 9,35%, contradizendo a urna no mesmo dia.',
  'AC.c2.header')
set(oAc, 'candidates[2].fortes[1]',
'Fica em 61,50% no book de 3º lugar do 1º turno, mantendo folga sobre Caiado, que subiu para 27,50%.', 'AC.c2.f1')

// ── pelotão ──
set(oAc, 'candidates[3].header',
'Polymarket: Caiado 1,60% (queda 0,95pp contra 30/Jul, vol USD 5,22M), Camilo Santana 1,35% (alta 0,85pp, vol USD 4,17M), Jair 0,85%, Alckmin 0,45% (vol USD 4,98M), Zema 0,35% (queda 0,20pp), Haddad 0,25%, Michelle 0,25%, Tereza Cristina 0,20%, Tarcísio 0,15%. Na urna, a Vox dá a Caiado 5,5%, a melhor leitura nacional dele no recorte.',
  'AC.c3.header')
set(oAc, 'candidates[3].fortes[1]',
'Caiado SOBE 2,00pp no book de 3º lugar do 1º turno, para 27,50%, a maior marca dele naquele contrato no acompanhamento do painel.', 'AC.c3.f1')
set(oAc, 'candidates[3].fortes[2]',
'Camilo Santana subiu 0,85pp, de 0,50% para 1,35%, no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin.', 'AC.c3.f2')
set(oAc, 'candidates[3].fracos[0]',
'Caiado CAIU 0,95pp contra os 2,55% de 30/Jul, foi a 1,60% e devolveu mais do que a alta de dois dias.', 'AC.c3.fr0')
set(oAc, 'candidates[3].fracos[1]',
'Nenhum nome do pelotão passa de 1,60% no contrato presidencial, contra 64,50% do favorito.', 'AC.c3.fr1')
set(oAc, 'candidates[3].fracos[4]',
'Os 1,35% de Camilo Santana NÃO são recorde: o máximo da série é 4,10%, de 03/Mai, e o movimento é recuperação do mínimo da série, 0,50%, marcado em 30/Jul.', 'AC.c3.fr4')

// ── quadro comparativo ──
const Q: Array<[number, string, string]> = [
  [0, '64,50% (vol USD 7,77M acumulado)', 'SUBIU 1,00pp e foi a 64,50%, ROMPENDO o topo da série do AFOS, que era 63,50% e vinha sendo igualado sem ser superado. O gap sobre Flávio ABRIU de +39,55pp para +40,15pp, o mais largo desde 03/Mai.'],
  [1, '24,35% (vol USD 7,76M acumulado)', 'SOBE 0,40pp para 24,35% e mesmo assim vê o gap ABRIR, de +39,55pp para +40,15pp, porque Lula subiu mais. Nos sub-mercados, CAI 0,50pp no 2º lugar do 1º turno, para 78,50%, e fica em 5,65% no 3º lugar.'],
  [2, '8,15% (vol USD 8,63M acumulado)', 'CAI 0,30pp no vencedor, para 8,15%, mas o movimento do dia é o oposto no book de colocação: SOBE 3,25pp no 2º lugar do 1º turno, de 6,10% para 9,35%, e fica em 61,50% no 3º lugar.'],
  [3, '1,60% (vol USD 5,22M)', 'CAI 0,95pp contra os 2,55% de 30/Jul e vai a 1,60%, devolvendo mais do que a alta de dois dias, e SOBE 2,00pp no book de 3º lugar, para 27,50%. A ressalva de série vale: 1,60% está dentro da faixa dele desde 22/Jul.'],
  [4, '0,35% (vol USD 4,59M)', 'CAI 0,20pp para 0,35% e fica em 4,45% no 3º lugar do 1º turno. Quarto pregão seguido de queda no contrato de vencedor.'],
  [5, '3,10% (vol USD 83 mil)', 'ESTÁVEL em 3,10%, sem nenhuma variação nas oito leituras das quatro rodadas da trava de hoje.'],
]
for (const [i, m, t] of Q) { set(oAc, `quadroComparativo[${i}].m`, m, `AC.q${i}.m`); set(oAc, `quadroComparativo[${i}].t`, t, `AC.q${i}.t`) }

// ── cruzamento ──
troca(oAc, 'cruzamento', 'O EIXO PARTIDÁRIO foi o do dia.',
'O EIXO PARTIDÁRIO foi o do dia, e ele tem DUAS portas, não uma.', 'AC.cruz.eixo')
troca(oAc, 'cruzamento',
'O prazo de 05/Ago segue com a vice indefinida, agora com uma porta fechada.',
'E não foi só o PP. Horas depois, o Republicanos marcou convenção nacional para 04/Ago com a maioria dos diretórios estaduais consultados defendendo neutralidade, encaminhando a recusa de aliança nacional com o senador. O painel separa os dois verbos porque eles não são iguais: o PP DECIDIU, o Republicanos ainda NÃO decidiu. Em 24/Jul esta série registrou que, sem a federação União-PP, Flávio buscava Republicanos e Podemos; as duas portas que ele procurou naquele dia estão agora fechando. O prazo de 05/Ago segue com a vice indefinida.',
  'AC.cruz.republicanos')

if (erros.length) { console.error('❌ ABORTADO, nada escrito:'); erros.forEach(e => console.error('   • ' + e)); process.exit(1) }
writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
console.log('✅ analysis-criteriosa.json rebaseado para 19:25')
