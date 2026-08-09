/**
 * Mapa EN de 09/Ago para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 9".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE AUG 9 READING, AT 17:34 UTC. AFOS only publishes a price that two independent readings confirm, taken eight minutes apart. THE GAP NARROWED AGAIN, AND FROM ONE SIDE ONLY: it went to +36.55pp, against +37.55pp yesterday, because Lula fell 1.00pp, to 63.50%, breaking below the five-day plateau that had held since Aug 4, while Flávio stood still at 26.95% for the third day. When the gap narrows from both ends there is a transfer between the two names; when it narrows only because the leader gives way, what exists is a loss of price in the favourite. Since Aug 1 the gap has fallen on SEVEN of the eight days, with a single flat day, coming down from +41.80pp. IN THE POLLING THERE HAS BEEN NO FRESH MEASUREMENT FOR FOUR DAYS: the latest national polls are ${G('Genial/Quaest', 'quaest')} and Meio/Ideia, both from Aug 5, and today's coverage carries cuts of that same round, not a new poll. THREE national polls are scheduled for Aug 10, among them Palver with n=5,000, plus two on Aug 11 and one on Aug 13. IN THE THIRD PLACE BOOK the move of the day contradicts yesterday's: Renan Santos jumped 6.00pp, to 64.50%, and Caiado fell 5.50pp, to 25.50%, in an almost exact mirror, when yesterday Caiado fell without Renan rising.`,

  'polymarketComparison.candidates[0].polymarket': `63.50%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `NO NEW NATIONAL POLL for FOUR days, since Aug 5. The two from that day still stand: ${G('Genial/Quaest', 'quaest')} (n=2,004, fieldwork Jul 31 to Aug 3, in person, 2pp margin, BR-06591/2026) with 39% in the ${G('first round', 'primeiro-turno')} and 44% x 39% in the runoff against Flávio, also beating Zema by 46% x 34%, Caiado by 45% x 37% and Renan Santos by 45% x 35%; and Meio/Ideia (n=1,500, telephone, 2.5pp margin, BR-04579/2026) with 43% and 48.5% x 43%. Today's coverage carries cuts of that same round, not fresh measurement. APPROVAL still stands at 48% against 47%. ON THE BOARD, he declared his assets to the ${G('TSE', 'tse')}, around R$ 4.7 million, 35% less than in 2022, with Alckmin reporting R$ 3.3 million, and a survey counts 26 state platforms for him against 16 for his rival.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 63.50% (vol USD 8.18M cumulative). FELL 1.00pp and broke below the five-day plateau that had held since Aug 4, in the first change to his price in five sessions. The gap over Flávio went to +36.55pp, and it narrowed ONLY from this side, because his rival did not move. In the 89-day series, from May 11 to Aug 9, his high is 66.50%, from Aug 1, and 13 of the 89 days had a value equal to or above the current one.`,

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is the 30% in the ${G('first round', 'primeiro-turno')} from ${G('Genial/Quaest', 'quaest')}, against 28% in that same house's Jul 15 round, and the 35% from Meio/Ideia, against 32% in its own Jul 8 round, with runoffs of 39% and 43%. The gap against Lula is 9pp at Quaest and 8pp at Ideia. A cut published on Aug 9 shows him widening his advantage among voters with secondary and higher education, and it is a reading of the Aug 5 round, not a new poll. REJECTION still stands at 54%, against Lula's 52%. ON THE BOARD, his running mate remains on the list of Pix earmarks Dino ordered the ${G('PF', 'pf')} to investigate.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 26.95% (vol USD 8.09M cumulative). THIRD day flat at the same value, after six days of gains that ended on Aug 6. He gained relative ground without moving: the gap narrowed because the leader gave way 1.00pp, not because he rose. It is not an extreme: 30 of the 89 days in the series had a value equal to or above it, with a high of 43.30% on May 12 and a low of 22.00% on Jul 3. IN THE RUNNER-UP CONTRACT the fall STOPPED at 81.50%, after losing 6.00pp between Aug 6 and Aug 8.`,

  'polymarketComparison.candidates[2].polymarket': `7.80%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is the 4% from ${G('Genial/Quaest', 'quaest')}, against 3% in its own Jul 15 round, and the 4.7% from Meio/Ideia, against 2% in its own Jul 8 round. In the runoffs he is the weakest of the two rounds: he loses to Lula by 45% x 35% at Quaest and by 48% x 34.7% at Ideia. With those, six consecutive national polls measure him between 3% and 4.7%, after the 7.8% from AtlasIntel on Jul 29, and the isolated high reading remains the exception of the set. He declared R$ 795 thousand in assets to the ${G('TSE', 'tse')}, with his running mate reporting R$ 1.6 million.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 7.80% (vol USD 9.27M cumulative). Rose 0.15pp, third day running of gains, and with the polling flat between 4% and 4.7% the distance to declared intention grew again, running from 3.10pp to 3.80pp, always on the price side. HIS MOVE TODAY IS IN THE THIRD PLACE BOOK: he jumped 6.00pp, from 58.50% to 64.50%, while Caiado fell 5.50pp, in an almost exact mirror, when YESTERDAY Caiado fell without him rising. In the runner-up contract he opened up over Lula, with 8.25% against 6.75%. In the 89-day series the high is 17.90% and the low is 5.50%, and 77 of the 89 days had a value equal to or above today's.`,

  'polymarketComparison.candidates[3].polymarket': `1.25%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is the 4% from ${G('Genial/Quaest', 'quaest')}, the same as its own Jul 15 round, and the 5.7% from Meio/Ideia, against 4% in its own Jul 8 round. In the runoffs he loses to Lula by 45% x 37% at Quaest and by 48.5% x 40% at Ideia. The divergence between institutes about him remains open within the same field: 4% at one house and 5.7% at the other, with both collecting from Jul 31 to Aug 3.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 1.25% (vol USD 5.60M cumulative). FELL for the THIRD day running in both books: 0.10pp in the presidential one and 5.50pp in the ${G('first round', 'primeiro-turno')} third place one, from 31.00% to 25.50%. In three days that is 10.00pp lost in that contract, since the 33.50% of Aug 6. THE DIFFERENCE FROM YESTERDAY IS THE MECHANISM: today Renan Santos rose 6.00pp against the 5.50pp he lost, which means the probability migrated between the two; yesterday Renan stood still and it left the book.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Neither ${G('Genial/Quaest', 'quaest')} nor Meio/Ideia tests him in any presidential scenario, ${G('first round', 'primeiro-turno')} or runoff, and there has been no new national poll since Aug 5. Absence of testing is information the panel records, rather than repeating old data as if it were new. He is running for RE-ELECTION as governor of São Paulo, made official by Republicanos on Aug 1.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 0.05% (vol USD 13.87M cumulative). No change against Aug 8. The level is low enough that changes in this band carry almost no informational value.`,

  'polymarketComparison.candidates[5].polymarket': `0.45%`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is the 2% from ${G('Genial/Quaest', 'quaest')}, the same as its own Jul 15 round, and the 2.6% from Meio/Ideia, practically the 2.5% of its Jul 8 one. In the runoffs he is the rival Lula beats most comfortably at Quaest, by 46% x 34%, and he loses by 48.5% x 37% at Ideia. He filed his candidacy with the ${G('TSE', 'tse')} on Aug 6, declaring R$ 178.7 million in assets, with his running mate Girão reporting R$ 34.1 million, and he remains the only one of the pack with a registration filed, in a window that runs to Aug 15.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 0.45% (vol USD 5.02M cumulative). FELL 0.10pp and moved back BELOW the 0.5% cut the panel uses to separate price from noise, having stayed above it for a single day. In the ${G('first round', 'primeiro-turno')} third place contract he sits at 3.35%. A series caveat that still holds: his high was 10.10%, on Apr 26.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Neither ${G('Genial/Quaest', 'quaest')} nor Meio/Ideia tests him in any scenario, ${G('first round', 'primeiro-turno')} or runoff, and there has been no new national poll since Aug 5, so he remains without polling. The caveat stands and needs to be said plainly: he is NOT a presidential candidate, he is running for governor of São Paulo, and any scenario including him is a polling hypothesis, not a candidacy under way.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[reading of Aug 9, 17:34 UTC] At 0.05% (vol USD 6.78M cumulative). No change against Aug 8, at the floor the market prices. Change in this band carries no informational value.`,
})
