/**
 * Traduz para EN e ES a correção do enquadramento Tereza Cristina (31/Jul).
 *
 * MÉTODO: não redigita a tradução inteira. Lê a tradução JÁ PUBLICADA e troca
 * só o bloco do enquadramento dentro dela. Redigitar 5 KB de cruzamento para
 * corrigir um parágrafo cria risco sem necessidade.
 *
 * Toda âncora abaixo foi LIDA do arquivo publicado, não suposta. Se alguma não
 * bater, o script aborta antes de escrever qualquer coisa.
 */
import { readFileSync } from 'node:fs'
import { construir } from '../build-locale-json'

const velho: Record<string, any> = {}
for (const f of ['analysis-data', 'analysis-criteriosa', 'polls-data'])
  for (const l of ['en', 'es'])
    velho[`${f}.${l}`] = JSON.parse(readFileSync(`public/${f}.${l}.json`, 'utf-8'))

const VETO_EN = 'The PP VETOED it, and the case closed on the same day. On the morning of Jul 31, Flávio Bolsonaro said Tereza Cristina had accepted the running-mate invitation the night before, with the caveat that talks continued to see whether the party would move forward. Minutes later, the PP announced NEUTRALITY in the election, saying it had consulted its state branches and decided not to call a National Convention, which blocks the ticket. The senator, who leads the PP in the Senate, shared the party statement and complied. Flávio replied that he respects it and that he does not give up. The Aug 5 deadline still has the running mate undefined, now with a door closed.'
const VETO_ES = 'El PP lo VETÓ, y el caso cerró el mismo día. En la mañana del 31 de julio, Flávio Bolsonaro dijo que Tereza Cristina había aceptado la invitación para vice la noche anterior, con la salvedad de que las conversaciones seguían para saber si el partido avanzaría. Minutos después, el PP anunció NEUTRALIDAD en las elecciones, informando que consultó a sus directorios estatales y decidió no convocar Convención Nacional, lo que bloquea la fórmula. La senadora, que lidera al PP en el Senado, compartió la nota del partido y acató. Flávio respondió que respeta la decisión y que no desiste. El plazo del 5 de agosto sigue con la vice indefinida, ahora con una puerta cerrada.'

const V = { en: VETO_EN, es: VETO_ES }
/** mesma frase começando em minúscula, para entrar depois de dois-pontos */
const v = (l: 'en' | 'es') => V[l][0].toLowerCase() + V[l].slice(1)

const erros: string[] = []

/** Troca texto EXATO dentro do valor publicado. Exige que a âncora exista. */
function sub(arq: string, loc: 'en' | 'es', caminho: string, de: string, para: string): string {
  const partes = caminho.match(/[^.[\]]+/g)!
  let no = velho[`${arq}.${loc}`]
  for (const p of partes.slice(0, -1)) no = no?.[p]
  const u = partes[partes.length - 1]
  const txt = no?.[u]
  if (typeof txt !== 'string') { erros.push(`${arq}.${loc}: campo inexistente ${caminho}`); return '' }
  if (!txt.includes(de)) { erros.push(`${arq}.${loc}: âncora não encontrada em ${caminho}`); return '' }
  return txt.replace(de, para)
}

// ─────────────────────────── analysis-data ───────────────────────────
const A_DIREITA = {
  en: 'The day was busy on ticket-building: he said Tereza Cristina had accepted the running-mate slot, the senator said there had been a conversation and that the decision depends on the PL and the PP-União, and the PP leadership assesses that she accepted knowing the party would block it. Three versions of the same fact, and the panel records all three. The Aug 5 deadline for naming a running mate is less than a week away.',
  es: 'El día fue movido en la formación de fórmula: él afirmó que Tereza Cristina aceptó ser vice, la senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União, y la cúpula del PP evalúa que ella aceptó sabiendo que el partido lo bloquearía. Tres versiones del mismo hecho, y el panel registra las tres. El plazo del 5 de agosto para definir vice está a menos de una semana.',
}
const A_INSS = {
  en: 'The political day was about ticket-building, not economics: Flávio Bolsonaro said Tereza Cristina had accepted the running-mate slot, the senator said there had been a conversation and that the decision depends on the PL and the PP-União, and the PP leadership assesses that she accepted knowing the party would block it.',
  es: 'El día político fue de formación de fórmula, no de economía: Flávio Bolsonaro afirmó que Tereza Cristina aceptó ser vice, la senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União, y la cúpula del PP evalúa que ella aceptó sabiendo que el partido lo bloquearía.',
}
const A_NEXO = {
  en: 'Flávio Bolsonaro said Tereza Cristina had accepted the running-mate slot on his ticket; the senator said there had been a conversation and that the decision depends on the PL and the PP-União; and the PP leadership assesses that she accepted precisely because she knew the party would block it. Three versions of the same fact, and the panel records all three without choosing.',
  es: 'Flávio Bolsonaro afirmó que Tereza Cristina aceptó ser vice en su fórmula; la senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União; y la cúpula del PP evalúa que ella aceptó justamente por saber que el partido lo bloquearía. Tres versiones del mismo hecho, y el panel registra las tres sin elegir.',
}

const mapaAD = (l: 'en' | 'es') => ({
  'cards.sentimento.direita': sub('analysis-data', l, 'cards.sentimento.direita', A_DIREITA[l],
    (l === 'en' ? 'The day was about ticket-building. ' : 'El día fue de formación de fórmula. ') + V[l]),
  'cards.inss.text1': sub('analysis-data', l, 'cards.inss.text1', A_INSS[l],
    (l === 'en' ? 'The political day was about ticket-building, not economics. ' : 'El día político fue de formación de fórmula, no de economía. ') + V[l]),
  'cards.stf.nexo': sub('analysis-data', l, 'cards.stf.nexo', A_NEXO[l], V[l]),
})

// ──────────────────────── analysis-criteriosa ────────────────────────
const A_SUBTITLE = {
  en: 'TEREZA CRISTINA appears at 0.55% in the presidential contract on the day Flávio Bolsonaro says she accepted the running-mate slot, she herself says there was a conversation and that the ticket depends on the PL and the PP-União, and the PP leadership discounts it.',
  es: 'TEREZA CRISTINA aparece en 0,55% en el contrato presidencial el día en que Flávio Bolsonaro dice que ella aceptó ser su vice, ella misma dice que hubo conversación y que la fórmula depende del PL y del PP-União, y la cúpula del PP lo descarta.',
}
const A_C1_ANALISE = {
  en: 'HIS DAY, however, was about ticket-building, and there are THREE versions of the same fact. He said Tereza Cristina had accepted the running-mate slot on his ticket. The senator said there had been a conversation and that the decision depends on the PL and the PP-União. And the PP leadership assesses that she accepted precisely because she knew the party would block it. The panel records all three and does not choose.',
  es: 'SU DÍA, sin embargo, fue de formación de fórmula, y hay TRES versiones del mismo hecho. Él afirmó que Tereza Cristina aceptó ser vice en su fórmula. La senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União. Y la cúpula del PP evalúa que ella aceptó justamente por saber que el partido lo bloquearía. El panel registra las tres y no elige.',
}
/** o prazo de 05/Ago passou a fechar o bloco VETO, então a repetição do fim sai */
const A_C1_CAUDA = {
  en: ' The Aug 5 deadline for naming a running mate is less than a week away.',
  es: ' El plazo del 5 de agosto para definir vice está a menos de una semana.',
}
const A_C3_ANALISE = {
  en: 'TEREZA CRISTINA appears at 0.55% in the presidential contract on the day Flávio said she had accepted the running-mate slot, she said there had been a conversation and that it depends on the PL and the PP-União, and the PP discounted it.',
  es: 'TEREZA CRISTINA aparece en 0,55% en el contrato presidencial el día en que Flávio dijo que ella aceptó ser su vice, ella dijo que hubo conversación y que depende del PL y del PP-União, y el PP lo descartó.',
}
const A_Q1 = {
  en: 'On state races and ticket arrangements the day was busy: he said Tereza Cristina had accepted the running-mate slot, the senator said there had been a conversation and that the decision depends on the PL and the PP-União, and the PP leadership assesses that she accepted knowing the party would block it.',
  es: 'En las estatales y en el arreglo de fórmula el día fue movido: afirmó que Tereza Cristina aceptó ser vice, la senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União, y la cúpula del PP evalúa que ella aceptó sabiendo que el partido lo bloquearía.',
}
const A_CRUZ = {
  en: "THE PARTY AXIS was the day's story, and it has THREE versions of the same fact. Flávio said Tereza Cristina had accepted the running-mate slot; the senator said there had been a conversation and that the decision depends on the PL and the PP-União; and the PP leadership assesses that she accepted knowing the party would block it. The panel records all three and does not choose.",
  es: 'EL EJE PARTIDARIO fue el del día, y tiene TRES versiones del mismo hecho. Flávio afirmó que Tereza Cristina aceptó ser su vice; la senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União; y la cúpula del PP evalúa que ella aceptó por saber que el partido lo bloquearía. El panel registra las tres y no elige.',
}

function mapaAC(l: 'en' | 'es') {
  const c1 = sub('analysis-criteriosa', l, 'candidates[1].analise', A_C1_ANALISE[l],
    (l === 'en' ? 'HIS DAY WAS ABOUT TICKET-BUILDING. ' : 'SU DÍA FUE DE FORMACIÓN DE FÓRMULA. ') + V[l])
  if (c1 && !c1.includes(A_C1_CAUDA[l])) erros.push(`analysis-criteriosa.${l}: cauda do prazo não encontrada em candidates[1].analise`)
  return {
    subtitle: sub('analysis-criteriosa', l, 'subtitle', A_SUBTITLE[l],
      (l === 'en' ? 'TEREZA CRISTINA appears at 0.55% in the presidential contract. ' : 'TEREZA CRISTINA aparece en 0,55% en el contrato presidencial. ') + V[l]),
    'candidates[1].fortes[2]': l === 'en'
      ? 'He announced on the morning of Jul 31 that Tereza Cristina had accepted the running-mate slot, but the PP declared neutrality minutes later and vetoed the ticket; he replied that he respects the decision and does not give up.'
      : 'Anunció en la mañana del 31 de julio que Tereza Cristina había aceptado ser vice, pero el PP declaró neutralidad minutos después y vetó la fórmula; él respondió que respeta la decisión y que no desiste.',
    'candidates[1].fracos[1]': l === 'en'
      ? 'The PP announced NEUTRALITY in the election just minutes after his announcement, vetoing the ticket, and the senator publicly complied with the party decision.'
      : 'El PP anunció NEUTRALIDAD en las elecciones pocos minutos después de su anuncio, vetando la fórmula, y la senadora acató públicamente la decisión del partido.',
    'candidates[1].fracos[2]': l === 'en'
      ? "The PP leadership assesses that she accepted the invitation precisely because she knew the party would block the ticket, a reading the same day's outcome made plausible."
      : 'La cúpula del PP evalúa que ella aceptó la invitación justamente por saber que el partido bloquearía la fórmula, lectura que el desenlace del mismo día volvió plausible.',
    'candidates[1].analise': c1.replace(A_C1_CAUDA[l], ''),
    'candidates[3].analise': sub('analysis-criteriosa', l, 'candidates[3].analise', A_C3_ANALISE[l], l === 'en'
      ? 'TEREZA CRISTINA appears at 0.55% in the presidential contract on the day Flávio said she had accepted the running-mate slot and the PP, minutes later, announced neutrality and vetoed the ticket, with the senator complying.'
      : 'TEREZA CRISTINA aparece en 0,55% en el contrato presidencial el día en que Flávio dijo que ella aceptó ser vice y el PP, minutos después, anunció neutralidad y vetó la fórmula, con la senadora acatando.'),
    'quadroComparativo[1].p': sub('analysis-criteriosa', l, 'quadroComparativo[1].p', A_Q1[l],
      (l === 'en' ? 'On ticket arrangements: ' : 'En el arreglo de fórmula: ') + v(l)),
    cruzamento: sub('analysis-criteriosa', l, 'cruzamento', A_CRUZ[l],
      (l === 'en' ? "THE PARTY AXIS was the day's story. " : 'EL EJE PARTIDARIO fue el del día. ') + V[l]),
  }
}

// ───────────────────────────── polls-data ─────────────────────────────
const A_PD = {
  en: 'His day, however, was about ticket-building and it has THREE versions of the same fact: he said Tereza Cristina had accepted the running-mate slot, the senator said there had been a conversation and that the decision depends on the PL and the PP-União, and the PP leadership assesses that she accepted knowing the party would block it. The Aug 5 deadline is less than a week away.',
  es: 'Su día, sin embargo, fue de formación de fórmula y tiene TRES versiones del mismo hecho: él afirmó que Tereza Cristina aceptó ser vice, la senadora dijo que hubo conversación y que la decisión depende del PL y del PP-União, y la cúpula del PP evalúa que ella aceptó sabiendo que el partido lo bloquearía. El plazo del 5 de agosto está a menos de una semana.',
}
const mapaPD = (l: 'en' | 'es') => ({
  'polymarketComparison.candidates[1].tendenciaPesquisa': sub('polls-data', l, 'polymarketComparison.candidates[1].tendenciaPesquisa', A_PD[l],
    (l === 'en' ? 'His day, however, was about ticket-building. ' : 'Su día, sin embargo, fue de formación de fórmula. ') + V[l]),
})

const mapas: any = {
  'analysis-data': { en: mapaAD('en'), es: mapaAD('es') },
  'analysis-criteriosa': { en: mapaAC('en'), es: mapaAC('es') },
  'polls-data': { en: mapaPD('en'), es: mapaPD('es') },
}

// gate: a moldura antiga não pode sobreviver nos valores novos
for (const arq of Object.keys(mapas))
  for (const l of ['en', 'es'] as const)
    for (const [k, txt] of Object.entries(mapas[arq][l]) as Array<[string, string]>) {
      for (const s of ['THREE versions', 'TRES versiones', 'if confirmed by the parties', 'de confirmarse por los partidos'])
        if (txt.includes(s)) erros.push(`${arq}.${l}.${k}: moldura antiga sobreviveu ("${s}")`)
      const marca = l === 'en' ? 'VETOED' : 'VETÓ'
      const rewrite = ['candidates[1].fortes[2]', 'candidates[1].fracos[1]', 'candidates[1].fracos[2]', 'candidates[3].analise']
      if (!rewrite.includes(k) && !txt.includes(marca)) erros.push(`${arq}.${l}.${k}: moldura nova não entrou`)
    }

if (erros.length) {
  console.error('❌ ABORTADO antes de construir:')
  erros.forEach(e => console.error('   • ' + e))
  process.exit(1)
}

for (const arq of ['analysis-data', 'analysis-criteriosa', 'polls-data'] as const)
  for (const l of ['en', 'es'] as const) construir(arq, l, mapas[arq][l])
