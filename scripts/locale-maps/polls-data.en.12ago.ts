/**
 * Mapa EN de 12/Ago para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 12".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 12, 16:41 BRT'

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE CONFIRMED READING OF AUG 12, 16:41 BRT, confirmed by two independent readings taken eight minutes apart. ⚠️ THE DAY HAD NO NEW NATIONAL POLL, so the polling column is the same as Aug 11 and the comparison measures only the price side. ⭐ AND THE PRICE MOVED WHERE THE ELECTION IS NOT DECIDED: in the contract about who wins, the leader was flat for the fourth day running and the gap narrowed 0.40pp, to 35.85pp; in the contract about who finishes second in the first round, the runner-up rose 3.50pp, to 84.00%, and that was the largest move of the day in any book tracked. They are different questions, one about winning and one about placing, and the panel does not add them together. The most interesting crossing is Caiado's, who FELL in the contract about winning and ROSE in the third-place one on the same day.`,

  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, capture confirmed by two independent readings taken eight minutes apart, the most recent at 16:41 BRT on Aug 12 (scripts/capture-guard.ts). ⚠️ NO NEW NATIONAL POLL ON AUG 12: still in force are CNT/MDA BR-06935/2026, Gerp BR-08045/2026 and Futura Inteligência BR-08109/2026, all of Aug 11, plus Palver BR-06596/2026 and BTG/Nexus BR-08428/2026, of Aug 10, and Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, of Aug 5. ✅ Futura's registration was CONFIRMED in this round: the poll is carried out by Futura Inteligência and commissioned by 100% Cidades, which is why the TSE protocol is filed under the commissioning brand. Next national polls in the queue: PoderData (n=2,400, BR-06868/2026) on Aug 13, Quaest (n=2,004, BR-06773/2026) on Aug 14 and Nexus (n=2,000, BR-03317/2026) on Aug 17.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] At 63.50% (vol USD 8.22M cumulative), at the SAME VALUE FOR THE FOURTH DAY RUNNING, since Aug 9. The gap over Flávio fell 0.40pp, to 35.85pp, and the fall came entirely from the challenger's end, because his own price did not move. In the 90-day series, 17 of the 88 days had a value equal to or above it, with a peak of 66.50% on Aug 1 and a floor of 39.50% on May 25. ⚠️ With no new national poll on Aug 12, this line compares the price against the polling of Aug 11.`,

  'polymarketComparison.candidates[1].polymarket': `27.65%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] At 27.65% (vol USD 8.13M cumulative). ROSE 0.40pp in the presidential contract, and the 90-day series has 22 of the 88 days with a value equal to or above it, a peak of 33.20% on Jun 2 and a floor of 22.00% on Jul 2. ⭐ BUT HIS BIG MOVE WAS IN ANOTHER CONTRACT: in the first-round runner-up one he rose 3.50pp, from 80.50% to 84.00%, and that was the largest move of the day in any book tracked. Winning and finishing second are different questions, and today the market moved the second one.`,

  'polymarketComparison.candidates[2].polymarket': `7.45%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] At 7.45% (vol USD 9.48M cumulative). FELL 0.30pp in the presidential and gave up 1.50pp in the first-round third-place contract, to 62.50%. In the 90-day series, more than 80 of the 88 days had a value equal to or above it, with a peak of 17.90% on Jun 9 and a floor of 6.80% on Aug 6. The price still sits BETWEEN the two polling methods, above the 4% to 5% of telephone and in person and below the 10% of the internet, and he keeps the largest cumulative volume in the book among the names above 1%.`,

  'polymarketComparison.candidates[3].polymarket': `0.95%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] At 0.95% (vol USD 5.66M cumulative). ⭐ HIS CROSSING POINTS BOTH WAYS ON THE SAME DAY: he fell 0.10pp in the contract about winning, dropping BELOW 1% and 0.05pp from the floor of the series, which is 0.90% from Jul 7; and he ROSE 2.00pp in the first-round third-place contract, to 31.50%. The market lowered his chance of winning and raised his chance of finishing third. The distance between polling and price remains the largest in the chasing pack: from 4% to 5.7% of declared intention against 0.95% of priced probability.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] At 0.05% (vol USD 13.91M cumulative). ⚠️ It remains the LARGEST cumulative volume in the whole presidential book, with the price at the floor. High volume with probability at the floor is conviction already priced in, not movement, and variations in this band have almost no informational value.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] At 0.35% (vol USD 5.07M cumulative), with no change. He remains below the 0.5% cut the panel uses to separate price from noise, a band in which the reading on him stays suspended. In the first-round third-place contract he marks 4.00%.`,

  'polymarketComparison.candidates[6].polymarket': `0.15%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] At 0.15% (vol USD 7.06M cumulative), a rise of 0.10pp that lifts him off the floor. Variation in this band has no informational value, and the underlying caveat stands: he is NOT a presidential candidate and is running for governor of São Paulo.`,
})
