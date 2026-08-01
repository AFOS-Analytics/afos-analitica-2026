/**
 * /atualizar-brz 01/Ago — parte C: o que a varredura por valor antigo apontou.
 *
 * Campos que eu não sabia que existiam e por isso ficaram para trás nas partes
 * A e B: `candidates[3].subtitle` (só o pelotão tem esse campo) e as colunas
 * `.p` e `.s` do quadroComparativo. É exatamente o caso de
 * feedback_rebaseline_varre_o_arquivo_inteiro: a lista de campos que eu monto
 * de cabeça não cobre a estrutura real.
 *
 * Inclui também o FRESCOR do polls-data: a AtlasIntel de 01/Jul passou de 30
 * dias e sai do painel, conforme o Guardrail #1 da ETAPA 3.4.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const erros: string[] = []
const P_AC = 'public/analysis-criteriosa.json'
const P_PD = 'public/polls-data.json'
const oAc = JSON.parse(readFileSync(P_AC, 'utf-8'))
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

function set(raiz: any, caminho: string, valor: string, rot: string) {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = raiz
  for (const p of partes.slice(0, -1)) no = no?.[p]
  const u = partes[partes.length - 1]
  if (typeof no?.[u] !== 'string') { erros.push(`${rot}: campo inexistente ${caminho}`); return }
  no[u] = valor
}

set(oAc, 'candidates[2].fracos[3]',
'CAI 0,55pp no contrato de vencedor, para 7,60%, o quinto pregão seguido de queda naquele contrato.', 'AC.c2.fr3')
set(oAc, 'candidates[3].subtitle',
'01/Ago, a 64 dias: o pelotão inteiro encolheu, e essa é a diferença em relação à véspera, quando os sinais eram cruzados. Caiado cedeu no vencedor e desabou 5,00pp no book de 3º lugar, desfazendo em um pregão a alta do dia anterior. Camilo Santana devolveu 0,90pp e foi ao menor valor dele na série. Jair Bolsonaro e Alckmin também cederam. Zema ficou estável, interrompendo quatro quedas seguidas. Nenhum nome do pelotão passa de 1,35%.',
  'AC.c3.subtitle')
set(oAc, 'candidates[3].zema.fortes',
'Na urna ele fica estável: os 3,2% da Vox de 31/Jul são praticamente os mesmos 3% da PoderData de 30/Jul e ficam acima dos 2,8% da AtlasIntel de 29/Jul. SOBE para 4,60% no book de 3º lugar do 1º turno, à frente de todo o pelotão exceto Caiado, e interrompe quatro pregões seguidos de queda no contrato de vencedor, ficando estável em 0,35%. Segue oficializado pelo Novo desde 27/Jul.',
  'AC.c3.zema.fortes')

// ── quadroComparativo: colunas p (urna) e s (síntese) ──
const P: Array<[number, string, string]> = [
  [0,
    'SEM URNA NOVA. A última nacional segue sendo a Vox Brasil de 31/Jul (n=2.100, campo 26 a 28/Jul, margem de 2,15pp, 95% de confiança, BR-01084/2026), com 40,5% no 1º turno e 47,5% x 41,1% no returno. A pesquisa do dia é estadual e por isso não entra aqui: a Datafolha de Pernambuco dá 57% a ele no estado.',
    '64 dias da eleição. O preço andou 2,00pp em dois pregões SEM nenhuma urna nacional no intervalo, e o painel registra a assimetria sem atribuir causa, porque não há leitura de intenção de voto para acompanhar o movimento. Polymarket ao vivo 01/Ago 16:49 UTC.'],
  [1,
    'Vox Brasil de 31/Jul: 31,2% no 1º turno e 41,1% no returno contra 47,5% de Lula. A diferença de 6,4pp no returno fica fora da margem somada, então esta leitura NÃO descreve empate técnico. Sem urna nacional nova desde então.',
    'Subir no vencedor e ver o gap abrir ao mesmo tempo é o registro do dia, e a explicação é aritmética: o favorito subiu mais. No arranjo político, segue sem vice a quatro dias do prazo, e a convenção do Republicanos que decide aliança presidencial é só em 04/Ago.'],
  [2,
    'A Vox de 31/Jul deu 3,0% e fechou a sequência: TRÊS institutos seguidos o cortaram, de 7,8% na AtlasIntel de 29/Jul para 4% na PoderData de 30/Jul e 3,0% agora. Sem urna nova desde então. Com o preço em 7,60%, a distância entre mercado e urna FECHOU de 5,15pp para 4,60pp, e fechou pelo lado do preço.',
    'É o nome que mais se moveu no recorte, e sempre para baixo: 4,40pp cedidos em nove rodadas desde 23/Jul. A distância entre mercado e urna, que o painel viu quadruplicar, começou a fechar, e fechou porque o preço caiu, não porque a urna subiu.'],
  [3,
    'A Vox de 31/Jul deu 5,5%, a melhor urna nacional dele no recorte, acima dos 5% da PoderData e bem acima dos 3,1% da AtlasIntel. Sem urna nova desde então, e a divergência entre institutos sobre ele segue aberta em quatro níveis dentro do mesmo mês.',
    'A realocação que o painel registrou na véspera, do vencedor para o terceiro lugar, foi desfeita em 24 horas: ele agora cede nos dois books ao mesmo tempo. A ressalva de série cabe e não descreve colapso, porque o mínimo dele é 0,90%, de 09/Jul.'],
  [4,
    'Vox Brasil de 31/Jul: 3,2% no 1º turno, praticamente o mesmo dos 3% da PoderData e acima dos 2,8% da AtlasIntel. Sem urna nova desde então.',
    'A urna o mantém estável em torno de 3% e o preço parou de cair depois de quatro pregões. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então movimentos nesta faixa têm valor informativo quase nulo. Segue sem vice, com prazo em 05/Ago.'],
  [5,
    'Sem pesquisa. Mercado de impeachment de ministro do STF antes de 2027.',
    'Terceiro pregão seguido no mesmo valor. O eixo judicial produziu fato no período, com dois inquéritos sobre Lulinha e a quebra de sigilo sobre um senador, mas nenhum deles mira integrante da Corte, que é o objeto deste contrato. Com USD 83 mil contra USD 117,52M do presidencial, preço parado diante de fato que não toca o objeto é o esperado.'],
]
for (const [i, p, s] of P) { set(oAc, `quadroComparativo[${i}].p`, p, `AC.q${i}.p`); set(oAc, `quadroComparativo[${i}].s`, s, `AC.q${i}.s`) }

// ── frescor: pesquisa com mais de 30 dias sai do painel ──
const CORTE = '2026-07-02'
const antes = oPd.polls.length
const removidas = oPd.polls.filter((x: any) => x.date < CORTE).map((x: any) => `${x.date} ${x.institute}`)
oPd.polls = oPd.polls.filter((x: any) => x.date >= CORTE)

if (erros.length) { console.error('❌ ABORTADO:'); erros.forEach(e => console.error('   • ' + e)); process.exit(1) }

// varredura final
const textos: string[] = []
;(function walk(o: any) { for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') textos.push(v); else if (v && typeof v === 'object') walk(v) } })({ oAc, pmc: oPd.polymarketComparison })
const tudo = textos.join('\n')
for (const s of ['65 dias', '8,15%', '64,50% (vol', '4,45% no book', '117,06M']) {
  if (tudo.includes(s)) { console.error(`❌ resíduo sobreviveu: "${s}"`); process.exit(1) }
}

writeFileSync(P_AC, JSON.stringify(oAc, null, 2) + '\n', 'utf-8')
writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
console.log(`✅ parte C aplicada. polls: ${antes} -> ${oPd.polls.length}` + (removidas.length ? ` (removida por frescor: ${removidas.join('; ')})` : ''))
