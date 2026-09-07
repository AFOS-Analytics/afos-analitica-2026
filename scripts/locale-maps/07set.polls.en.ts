/**
 * Mapa EN: polls-data, rodada de 07/Set/2026.
 *
 * ⭐ As duas notas longas NÃO são retraduzidas do zero. Elas mudaram numa frase
 * só, então o mapa lê a tradução JÁ PUBLICADA e troca apenas o trecho que mudou.
 * Retraduzir 1.500 caracteres para mexer em 200 é risco sem necessidade, e o
 * gate numérico é sensível a cada dígito redigitado.
 */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const S7 = 'confirmed reading of 07/Sep, 13:02 BRT'
const S6 = 'confirmed reading of 06/Sep'
const PISO = 'below the 0.5% floor of the double reading, and this round publishes no new price for him in that contract'

const publicado = JSON.parse(readFileSync('public/polls-data.en.json', 'utf-8'))

/** Troca cirúrgica sobre a tradução publicada, com aborto se o trecho não existir. */
const trocar = (texto: string, de: string, para: string): string => {
  if (!texto.includes(de)) throw new Error('trecho não encontrado na tradução publicada: ' + de.slice(0, 60))
  return texto.split(de).join(para)
}

const notaVerita = trocar(
  publicado.polls[0].note,
  `⚠️ THIS SURVEY CARRIES NO ${G('RUNOFF', 'segundo-turno')} SCENARIO, and the most recent reading of that pairing is still Datafolha of 03/Sep.`,
  `⭐ THE ${G('RUNOFF', 'segundo-turno')} SCENARIO OF THIS SAME ROUND CAME OUT LATER, and it flips the pairing: Flávio Bolsonaro 48.5% against 43.1% for Lula, with 4.9% blank and spoilt and 3.6% undecided. 🏷️ On 06/Sep the panel recorded that this survey carried no runoff scenario, because at the moment of capture it carried none: the CNN Brasil story that publishes it is from 06/Sep at 13:53 and was updated on 07/Sep at 00:03. ⚠️ It is the FIRST national poll of the window to hand the runoff to Flávio Bolsonaro. The other two that test the pairing go the other way: Datafolha of 03/Sep, 46% to 44% for Lula, and Quaest of 02/Sep, 42% to 41%, also for Lula. The rejection measured in this same round is 35% for Lula and 25.8% for Flávio Bolsonaro.`
)

const notaRealTime =
  publicado.polls[4].note +
  ` 🏷️ THE NATIONAL SCOPE OF THIS REGISTRATION IS DERIVED BY US, and the evidence supporting it is weak. It comes from the sampling plan, and this house's sampling plan declares a national universe in 23 of its 23 STATE polls in the 30-day window, with the methodology silent about the universe. A field that says national in every case separates nothing, so saying national here is not evidence. This does not assert that the poll is a state one: it asserts that the registration does not support the label, and the page declares the doubt instead of hiding it.`

construir('polls-data', 'en', {
  'polls[0].note': notaVerita,
  'polls[4].note': notaRealTime,

  'polymarketComparison.note': `Polymarket prices with the presidential book at USD 144.60M, ${S7} (16:02 UTC). ⚠️ IN THIS ROUND TWO OF THE FIVE BOOKS RECEIVED A NEW PRICE, the winner one and the ${G('first-round', 'primeiro-turno')} third-place one, which were the ones confirmed across the two independent readings. For the first-round runner-up book, the Supreme Court impeachment book and the Senate majority book there is no fresh reading on 07/Sep, and their figures on this page are those of the ${S6}. ⭐ AND THE POLL AND THE PRICE MOVED IN OPPOSITE DIRECTIONS FOR THE SECOND DAY RUNNING: the Veritá ${G('runoff', 'segundo-turno')} scenario, released after yesterday's round, puts Flávio Bolsonaro ahead by 48.5% to 43.1%, and the winner contract widened Lula's gap from 16.80pp to 18.05pp. 📌 The two quantities do not subtract from one another, because one is declared voting intention in the runoff and the other is the implied probability of winning the election. The page records that today they rank the race in opposite ways, without arbitrating between them.`,

  'polymarketComparison.candidates[0].polymarket': '57.50%',
  'polymarketComparison.candidates[0].tendenciaPesquisa': `Veritá of 06/Sep (BR-09426/2026, fieldwork 01 to 04/Sep, n=3,804, margin of 2pp) measures him at 38.4% in the ${G('first round', 'primeiro-turno')}, behind Flávio Bolsonaro by 0.5 point, which fits inside the margin and is therefore a ${G('statistical tie', 'empate-tecnico')}. ⭐ AND THE ${G('RUNOFF', 'segundo-turno')} SCENARIO OF THE SAME ROUND, WHICH CAME OUT LATER, PUTS HIM BEHIND: 43.1% against 48.5%. It is the first national poll of the window to hand the runoff to his opponent, against Datafolha of 03/Sep (46% to 44%) and Quaest of 02/Sep (42% to 41%), both in his favour. The rejection measured by Veritá is 35% for him and 25.8% for his opponent.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket': `57.50% (vol USD 9.92M) in the winner contract, ${S7}, a rise of 1.00pp against the ${S6}. ⭐ THE GAP OVER THE RUNNER-UP WIDENED FROM 16.80pp TO 18.05pp, and it is the second consecutive session of widening. 📌 The price moved in the direction opposite to the poll for the second day: yesterday Veritá tied the ${G('first round', 'primeiro-turno')}, today it places him behind in the runoff, and the winner contract rose both times. In the first-round runner-up contract this round publishes no new price. In the series recorded since 14/Apr his contract runs from 34.50% to 67.50%, and today's 57.50% sits inside that range.`,

  'polymarketComparison.candidates[1].polymarket': '39.45%',
  'polymarketComparison.candidates[1].tendenciaPesquisa': `⭐ VERITÁ OF 06/Sep PUTS HIM AHEAD IN BOTH SCENARIOS: 38.9% against 38.4% in the ${G('first round', 'primeiro-turno')}, inside the margin and therefore a ${G('statistical tie', 'empate-tecnico')}, and 48.5% against 43.1% in the ${G('runoff', 'segundo-turno')}, the first time in the window that a national poll hands him the second round. ⚠️ The other two national polls that test the pairing go the other way: Datafolha of 03/Sep, 46% to 44% for Lula, and Quaest of 02/Sep, 42% to 41%, also for Lula. Veritá carries a reliability of 2 on the house scale, the lowest in the window.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `39.45% (vol USD 9.80M) in the winner contract, ${S7}, a fall of 0.25pp against the ${S6}. ⚠️ THE PRICE MOVED AGAINST THE POLL FOR THE SECOND DAY RUNNING, and this time the poll hands him the ${G('runoff', 'segundo-turno')}. In the ${G('first-round', 'primeiro-turno')} runner-up contract this round publishes no new price for him.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket': `1.15% (vol USD 4.19M) in the WINNER contract, ${S7}, unchanged against the ${S6}. ⭐ In the ${G('first-round', 'primeiro-turno')} THIRD-PLACE contract, which is a different market, he rose 2.35pp to 58.55% (vol USD 126 thousand), a second consecutive gain. 📌 The market is consolidating him as the third-placed finisher of the first round and not as a candidate to win the election, and his two contracts keep telling different stories.`,

  'polymarketComparison.candidates[3].polymarket': '1.55%',
  'polymarketComparison.candidates[3].tendenciaPolymarket': `1.55% (vol USD 12.76M) in the winner contract, ${S7}, a fall of 0.05pp. ⚠️ In the ${G('first-round', 'primeiro-turno')} third-place contract he GAVE UP 1.50pp to 24.50% (vol USD 279 thousand), breaking three consecutive gains, on the very day Cury rose 2.35pp in that same book. 📌 Among the four names above 1% in the winner contract, his is the largest accumulated volume, above the leader and the runner-up, in a contract priced below 2%.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa': `Veritá of 06/Sep puts him at 1.9% in the ${G('first round', 'primeiro-turno')}, below the 4% Datafolha measured on 03/Sep. The Veritá poll carries only the pairing against Flávio Bolsonaro in the ${G('runoff', 'segundo-turno')}, so the most recent reading of the pairing against him is still Datafolha, at 46% to 41%.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `0.15% (vol USD 7.23M) in the WINNER contract, ${PISO}. In the ${G('first-round', 'primeiro-turno')} THIRD-PLACE contract, which is a different market, he gave up 0.50pp to 9.50% (vol USD 115 thousand), ${S7}.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket': `0.15% (vol USD 3.82M) in the WINNER contract, ${PISO}. In the ${G('first-round', 'primeiro-turno')} THIRD-PLACE contract he gave up 0.40pp to 1.85% (vol USD 48 thousand), ${S7}.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa': `Veritá of 06/Sep measures him at 0.3% in the ${G('first round', 'primeiro-turno')}, below the 2% Datafolha measured on 03/Sep. The Veritá poll carries only the pairing against Flávio Bolsonaro in the ${G('runoff', 'segundo-turno')}, so the most recent reading of the pairing against him is still Datafolha, at 48% to 39%.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `0.15% (vol USD 6.56M) in the WINNER contract, ${PISO}. In the ${G('first-round', 'primeiro-turno')} THIRD-PLACE contract he holds at 0.85% (vol USD 51 thousand), unchanged, ${S7}.`,
})
