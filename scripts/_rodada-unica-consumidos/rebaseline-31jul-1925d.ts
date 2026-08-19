/**
 * Rebaseline 19:25 — parte D: os campos que a varredura de números velhos
 * ainda apontou, incluindo as sub-estruturas caiado/haddad/zema, que não
 * aparecem no dump raso de candidates[] e por isso passaram batido nas partes
 * anteriores. Lição de método: varrer o arquivo INTEIRO atrás dos valores
 * antigos, não confiar na lista de campos que eu acho que existem.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AC = 'public/analysis-criteriosa.json'
const P_AD = 'public/analysis-data.json'
const P_PD = 'public/polls-data.json'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oAd = JSON.parse(readFileSync(P_AD, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

function set(raiz: any, caminho: string, valor: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) no = no?.[p]
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente ${caminho}`); return }
  no[u] = valor
}
/** substituição de par em QUALQUER string do objeto, contando as trocas */
function global(raiz: any, pares: Array<[string, string]>): number {
  let n = 0
  const walk = (o: any) => {
    for (const k of Object.keys(o)) {
      const v = o[k]
      if (typeof v === 'string') { let s = v; for (const [a, b] of pares) if (s.includes(a)) { s = s.split(a).join(b); n++ } o[k] = s }
      else if (v && typeof v === 'object') walk(v)
    }
  }
  walk(raiz); return n
}

// ── Flávio: análise reescrita ──
set(oAc, 'candidates[1].analise',
'O sinal dele hoje é cruzado e vale registrar assim, sem resolver. SOBE 0,40pp no contrato de vencedor, para 24,35%, e mesmo assim VÊ O GAP ABRIR, de +39,55pp para +40,15pp, porque Lula subiu 1,00pp no mesmo pregão. Ao mesmo tempo CAI 0,50pp no book de 2º lugar do 1º turno, para 78,50% (vol USD 216 mil), e fica em 5,65% no de 3º lugar. Subir na chance de ganhar e ceder na colocação é combinação incomum. A contrapartida da queda no book de 2º lugar é a alta de 3,25pp de Renan Santos no mesmo contrato, o que sugere realocação interna daquele book e não leitura nova sobre quem vai ao returno. NA URNA, a Vox o traz em 31,2% no 1º turno e 41,1% no returno, e os 6,4pp que o separam de Lula ficam fora da margem somada, o que afasta a leitura de empate técnico que a PoderData sustentava na véspera. O DIA POLÍTICO DELE FOI DE PORTAS SE FECHANDO, e foram duas. O PP VETOU, e o caso fechou no mesmo dia. Na manhã de 31/Jul, Flávio Bolsonaro disse que Tereza Cristina aceitara o convite para vice na noite anterior, com a ressalva de que as conversas seguiam para saber se o partido avançaria. Minutos depois, o PP anunciou NEUTRALIDADE nas eleições, informando que consultou os diretórios estaduais e decidiu não convocar Convenção Nacional, o que barra a chapa. A senadora, que lidera o PP no Senado, compartilhou a nota do partido e acatou. Flávio respondeu que respeita e que não desiste. Horas depois, o Republicanos marcou convenção nacional para 04/Ago com a maioria dos diretórios estaduais consultados defendendo neutralidade, encaminhando a recusa de aliança. Os verbos não são iguais e o painel não os iguala: o PP DECIDIU, o Republicanos ainda NÃO decidiu. Em 24/Jul esta série registrou que, sem a federação União-PP, ele buscava Republicanos e Podemos; as duas portas que procurou naquele dia estão agora fechando. O prazo de 05/Ago segue com a vice indefinida. No mercado, Tereza Cristina aparece em 0,20% no contrato PRESIDENCIAL, e a distinção importa: aquele contrato mede quem ganha a Presidência, não quem ocupa a vaga de vice.',
  'AC.c1.analise')

// ── Renan: tira a repetição e corrige o 3º lugar ──
set(oAc, 'candidates[2].analise',
'Este é o verbete do dia e ele tem duas partes que apontam para lados opostos. A PRIMEIRA é a urna, e ela é uma sequência, não um número isolado. TRÊS institutos seguidos cortaram Renan Santos: AtlasIntel 7,8% em 29/Jul, PoderData 4% em 30/Jul e Vox Brasil 3,0% em 31/Jul. Com o preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte. Em 29/Jul este painel escreveu que a distância tinha caído a 0,90pp e chamou aquilo de convergência, sublinhando que o estreitamento vinha pelo lado da urna. Três institutos depois, a distância quadruplicou. Fica registrado que a leitura de 29/Jul não se sustentou, e que o que o painel vinha chamando de dispersão virou outra coisa: as três leituras mais recentes são também as três mais baixas do recorte, o que descreve tendência de queda e não ruído entre casas. A SEGUNDA parte é o mercado, e ele contradisse a si mesmo. No contrato de vencedor ele cedeu 0,30pp, para 8,15%. No book de 2º lugar do 1º turno, porém, SUBIU 3,25pp, de 6,10% para 9,35% (vol USD 1,09M), recuperando dois terços do que havia perdido 24 horas antes. E ficou em 61,50% no 3º lugar (vol USD 164 mil). Em 30/Jul o painel escreveu que o dinheiro o havia reclassificado, tirando dele a chance de returno e cravando-o em terceiro. Hoje o mesmo dinheiro devolveu boa parte dessa chance, no dia em que a urna o cortou pela terceira vez seguida. O painel registra as duas direções e não arbitra qual está certa, porque não tem como. Ele mantém o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,63M, acima de Lula e de Flávio.',
  'AC.c2.analise')

// ── pelotão: análise reescrita ──
set(oAc, 'candidates[3].analise',
'O pelotão teve o dia mais movimentado da semana e nenhum dos movimentos aponta na mesma direção. CAIADO caiu 0,95pp no vencedor contra os 2,55% de 30/Jul, foi a 1,60% e devolveu mais do que a alta de dois dias, e SUBIU 2,00pp no 3º lugar, para 27,50%, no mesmo dia em que a Vox lhe deu 5,5%, a melhor urna nacional dele no recorte. Três sinais, duas direções. A leitura que se sustenta é que o mercado o realocou de candidato a vencedor para candidato a terceiro colocado, e que a urna não acompanhou. CAMILO SANTANA subiu 0,85pp, de 0,50% para 1,35%, e GERALDO ALCKMIN ficou em 0,45%, os dois no dia em que o PCdoB formalizou apoio à chapa Lula-Alckmin, e o painel registra a coincidência sem afirmar causa. Sobre Camilo cabe a ressalva de série, que desfaz a leitura fácil: 1,35% não é recorde, o máximo dele é 4,10%, de 03/Mai, e o que houve foi recuperação do MÍNIMO da série, 0,50%, marcado em 30/Jul. Os dois passaram por valores mais altos ao longo do dia, 2,20% e 1,10% às 17:33, e devolveram parte antes desta captura. TEREZA CRISTINA aparece em 0,20% no contrato presidencial no dia em que Flávio disse que ela aceitara ser vice e o PP, minutos depois, anunciou neutralidade e vetou a chapa, com a senadora acatando. O contrato mede quem ganha a Presidência, não quem é vice, então isso é nome em circulação e não cargo. ZEMA caiu pelo QUARTO pregão seguido, para 0,35%, perdendo no mesmo dia o cabeça de chapa ao Senado em Minas. HADDAD subiu 0,10pp, para 0,25%, e segue sem ser testado pelas nacionais.',
  'AC.c3.analise')

// ── sub-estruturas do pelotão: só os números ──
const n1 = global(oAc.candidates[3], [
  ['1,75%', '1,60%'], ['26,50%', '27,50%'], ['0,80pp', '0,95pp'],
  ['SOBE 1,00pp no book de 3º lugar', 'SOBE 2,00pp no book de 3º lugar'],
  ['os 2,55% de ontem é que eram o desvio', 'os 2,55% de 30/Jul é que eram o desvio'],
  ['0,45% (queda 0,10pp, vol USD 4,58M)', '0,35% (queda 0,20pp, vol USD 4,59M)'],
  ['CAI 0,10pp no contrato de vencedor, para 0,45%, no TERCEIRO pregão', 'CAI 0,20pp no contrato de vencedor, para 0,35%, no QUARTO pregão'],
  ['0,30% (alta 0,15pp)', '0,25% (alta 0,10pp)'],
  ['SOBE 0,15pp no contrato de vencedor, para 0,30%, dobrando o valor da véspera', 'SOBE 0,10pp no contrato de vencedor, para 0,25%'],
])

// ── números soltos nos três arquivos ──
const n2 = global(oAc, [['117,03M', '117,06M'], ['nas quatro leituras da trava', 'nas oito leituras das quatro rodadas da trava']])
const n3 = global(oAd, [
  ['117,03M', '117,06M'],
  ['nas quatro leituras da trava de captura de hoje', 'nas oito leituras das quatro rodadas da trava de captura de hoje'],
  ['de 25,20% a 26,60%, porque foi o único book que a trava de captura reprovou nas duas rodadas', 'de 24,65% a 26,65%, porque foi o único book que a trava de captura reprovou na última rodada'],
])
set(oPd, 'polymarketComparison.sources',
  String(oPd.polymarketComparison.sources)
    .replace('captura ao vivo 31/Jul 20:33 UTC', 'captura ao vivo 31/Jul 22:25 UTC')
    .replace('scripts/capture-guard.ts em DUAS rodadas, ambas reprovadas; único book divergente foi senate:MDB, publicado como faixa; o presidencial repetiu nas quatro leituras',
      'scripts/capture-guard.ts em QUATRO rodadas, todas reprovadas; na última o único book divergente foi senate:MDB, publicado como faixa de 24,65% a 26,65%, e o presidencial inteiro repetiu, incluindo os 64,50% de Lula'),
  'PD.sources')

if (erros.length) { console.error('❌ ABORTADO:'); erros.forEach(e => console.error('   • ' + e)); process.exit(1) }

// varredura final: nenhum valor antigo pode sobreviver
const VELHOS = ['+39,20pp', 'ESTÁVEL em 63,50%', '24,30%', '1,75%', '2,20% (vol', '1,10% (vol', '0,55% no contrato', '78,00%', 'em 62,00%', '26,50%', '117,03M', 'DUAS rodadas', '25,20%', '26,60%', '4,58M', 'não trouxe ato novo', 'não se mexeu']
const tudo = JSON.stringify({ oAc, oAd, pmc: oPd.polymarketComparison })
const sobrou = VELHOS.filter(s => tudo.includes(s))
if (sobrou.length) { console.error('❌ ainda sobrevive: ' + sobrou.join(' | ')); process.exit(1) }

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_AD, JSON.stringify(oAd, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
console.log(`✅ parte D aplicada (${n1 + n2 + n3} trocas numéricas) e varredura de valores antigos limpa`)
