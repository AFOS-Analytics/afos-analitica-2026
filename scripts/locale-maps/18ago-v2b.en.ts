/** Mapa EN de 18/Ago/2026, parte 2: analysis-data e polls-data. */
import { construir } from '../build-locale-json'

construir('analysis-data', 'en', {
  'cards.sentimento.text1': `The distance between LULA and FLÁVIO BOLSONARO narrowed for the second day running and closed at 31.45pp in the confirmed reading of Aug 18, 10:32 PM BRT. It was 37.05pp on Aug 16 and 33.05pp on Aug 17, that is 5.60pp in two days, in a presidential book that has accumulated USD 128.96M.`,
  'cards.sentimento.text2': `The ballot box says the opposite. BTG/Nexus of Aug 17, the only national poll of the week, measured Lula going from 40% to 41% and Flávio from 35% to 36%: the difference between the two stayed INTACT at 5 points, and each 1-point move fits inside the house's own 2pp margin.`,
  'cards.sentimento.text3': `RONALDO CAIADO moved both ways at once: he more than tripled in the contract on winning, from 0.25% to 0.80%, and gave ground in the third place one, from 38.50% to 37.00%. Winning the election and finishing third are different questions, and the panel does not add them together.`,
  'cards.sentimento.polymarket': `Confirmed reading of Aug 18, 10:32 PM BRT. Lula 63.50%, Flávio Bolsonaro 32.05%, Renan Santos 4.40%, Pablo Marçal 0.90% and Ronaldo Caiado 0.80%.`,
})

construir('polls-data', 'en', {
  'polymarketComparison.note': `⭐ CONFIRMED READING OF Aug 18, 10:32 PM BRT. The distance between LULA and FLÁVIO BOLSONARO narrowed 1.60pp and closed at 31.45pp, the SECOND day running of convergence: it was 37.05pp on Aug 16 and 33.05pp on Aug 17, adding up to 5.60pp in two days. 🔑 THE BALLOT BOX SAYS THE OPPOSITE: BTG/Nexus of Aug 17, the only national poll of the week, measured both rising 1 point each, which leaves the difference INTACT at 5 points. A measurement that does not narrow cannot explain a narrowing. ⭐⭐ AND RONALDO CAIADO MOVED BOTH WAYS: he more than tripled in the contract on WINNING, from 0.25% to 0.80%, and GAVE GROUND in the THIRD PLACE one, from 38.50% to 37.00%. 📌 No new national poll came in. Datafolha of Aug 21 will be the first to measure Pablo Marçal.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket': `🔴 DOWN 1.00pp on Aug 18, from 64.50% to 63.50% (vol USD 8.67M accumulated), confirmed reading of Aug 18, 10:32 PM BRT. The distance to the runner-up NARROWED 1.60pp to 31.45pp, the second day running of convergence, adding up to 5.60pp since Aug 16. ⛔ No superlative: the high of the 88-day series is still 66.50%, from Aug 1.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `🔺 UP 0.60pp on Aug 18, from 31.45% to 32.05% (vol USD 8.62M accumulated), a fifth day running of gains. In the second place contract he marks 88.50%. ⛔ NOT a record: the high of the 88-day series is 33.20%, from Jun 2.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket': `🔺 UP 0.35pp in the presidential book, to 4.40% (vol USD 10.11M accumulated). ⭐ The strong move was in PLACEMENT: in the third place contract he jumped from 52.50% to 57.00%, and the distance to Caiado REOPENED from 14.00pp to 20.00pp.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket': `⭐ MORE THAN TRIPLED in the contract on WINNING, from 0.25% to 0.80% (vol USD 6.34M accumulated), returning above the panel's 0.5% cut. And he GAVE GROUND in the THIRD PLACE one, from 38.50% to 37.00%. ⛔ No superlative: it is a recovery from the series low, 0.50% on Aug 15, and the high is 2.40%, from Jun 19.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket': `STABLE at 0.90% (vol USD 1.66M accumulated), with volume rising from USD 1.21M in one day. 🏷️ ELECTORAL STATUS, updated today: he asked the electoral court to correct his asset declaration and declared wealth fell from R$ 7.4 billion to R$ 149.9 million, according to G1 and Valor Econômico, of the same group. He remains INELIGIBLE until 2032, campaigning allowed by injunction and registration pending. 📅 Datafolha of Aug 21 is the FIRST to measure him.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket': `DOWN 0.10pp, to 0.15% (vol USD 5.71M accumulated), below the 0.5% cut the panel uses to separate price from noise. In the ballot box BTG/Nexus of Aug 17 gives him 4% in the first round.`,

  'polymarketComparison.candidates[0].polymarket': `63.50%`,
  'polymarketComparison.candidates[1].polymarket': `32.05%`,
  'polymarketComparison.candidates[2].polymarket': `4.40%`,
  'polymarketComparison.candidates[3].polymarket': `0.80%`,
  'polymarketComparison.candidates[4].polymarket': `0.90%`,
  'polymarketComparison.candidates[6].polymarket': `0.15%`,
})
