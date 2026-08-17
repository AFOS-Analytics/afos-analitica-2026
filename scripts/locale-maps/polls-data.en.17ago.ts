/**
 * Mapa EN de 17/Ago para polls-data.json.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar.
 */
import { construir } from '../build-locale-json'

const STAMP = 'confirmed reading of Aug 17, 6:48 PM BRT (9:48 PM UTC)'

construir('polls-data', 'en', {
  'polls[0].method': `Telephone`,
  'polls[0].note':
    `BTG/Nexus national poll released on Aug 17, the 10th round of the house's series, checked against the pollster's own site (nexus.fsb.com.br) and reported by Folha de S.Paulo, UOL, Poder360, VEJA, CartaCapital, Metrópoles and Gazeta do Povo. ` +
    `Stimulated first round: Lula 41% x Flávio Bolsonaro 36%, with Ronaldo Caiado at 5%, Renan Santos at 4% and Romeu Zema at 4%. Runoff: Lula 47% x Flávio 44%. ` +
    `⭐ THE COMPARISON WITH THE HOUSE'S OWN PREVIOUS ROUND IS THE DATA, AND IT IS ONE OF STABILITY: in the first round Lula went from 40% to 41% and Flávio from 35% to 36%, so the DISTANCE stayed at the same 5 points. In the runoff the result is IDENTICAL to the previous round, 47 to 44, keeping 3 points. Each 1-point move fits entirely inside the 2pp margin declared by the house. ` +
    `⭐ THE PACK'S ORDERING IS INVERTED RELATIVE TO THE MARKET: Caiado appears at 5% and Renan Santos at 4%, while in the price Renan has 4.05% to win against Caiado's 0.25%. ` +
    `GOVERNMENT ASSESSMENT in the same round: 42% bad or terrible, 34% excellent or good and 23% average, according to Diário do Grande ABC, ndmais and A Folha das Cidades. ` +
    `⛔ The panel does NOT publish the approve-and-disapprove pair from this round: outlets diverged between 47% against 48% (Metrópoles) and 46% against 49% (Brasil 247), and the pollster's own site did not carry the figure. Where the reading does not converge, the panel declares instead of choosing. ` +
    `⚠️ The electoral court records the field as Aug 14 to 16 and the planned sample as 2,000; the pollster published 2,003 completed interviews.`,
  'polls[0].source':
    `BTG/Nexus, checked at the primary source on nexus.fsb.com.br, and reported by Folha de S.Paulo, UOL, Poder360, VEJA, CartaCapital, Metrópoles and Gazeta do Povo, Aug 17`,

  'approvalData.note':
    `🏷️ THE STRUCTURED NUMBERS IN THIS BLOCK ARE FROM GENIAL/QUAEST OF Aug 14, and they are these: 46% approval against 48% disapproval, with 6% don't know, and 36% excellent or good, 25% average and 37% bad or terrible. The panel keeps ONE house per block on purpose, so as not to add up the scales of different pollsters. ` +
    `⭐ NEW NATIONAL POLL ON Aug 17, declared here and NOT mixed into the figures above: BTG/Nexus (n=2,003, field Aug 14 to 16, BR-03317/2026, margin of 2pp) reports 42% bad or terrible, 34% excellent or good and 23% average, according to Diário do Grande ABC, ndmais and A Folha das Cidades. ` +
    `⛔ THE BTG/NEXUS APPROVE-AND-DISAPPROVE PAIR DOES NOT ENTER, and the reason is declared: outlets diverged between 47% against 48% (Metrópoles) and 46% against 49% (Brasil 247), and the pollster's own site did not publish the figure. Where the reading does not converge, the panel declares instead of choosing. ` +
    `⭐ THE DISTANCE BETWEEN HOUSES IS THE DATA: on the negative side of the excellent-to-terrible scale, Quaest of Aug 14 marks 37% and BTG/Nexus of Aug 17 marks 42%, five points in three days. PoderData/Aya of Aug 13 still carried 43% approval against 50% disapproval. The panel does not choose between them.`,

  'polymarketComparison.note':
    `⭐ THE DAY HAS A DISAGREEMENT IN DIRECTION BETWEEN THE TWO UNIVERSES, and that is the finding. The BTG/Nexus of Aug 17 (n=2,003, field Aug 14 to 16, margin of 2pp) showed STABILITY: the leader went from 40% to 41%, the runner-up from 35% to 36%, the distance stayed at the same 5 points and the runoff repeated 47 to 44. On the same day the price CLOSED 4.00pp of that distance, from 37.05pp to 33.05pp. ` +
    `⛔ The panel does not claim the price reacted to the poll: the poll shortened nothing, so it does not explain a 4-point shortening. ` +
    `⭐ And there is a second crossing, about who is third: the poll puts Caiado at 5% and Renan Santos at 4%, while the market gives Renan 4.05% and Caiado 0.25%, and in the third place contract 52.50% against 38.50%. The two universes disagree about the ordering of the pack. ` +
    `📌 Capture confirmed by TWO independent runs of the guard, in separate windows.`,

  'polymarketComparison.candidates[0].polymarket': `64.50%`,
  'polymarketComparison.candidates[0].pesquisaRange': `38-44%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `NEW NATIONAL POLL ON Aug 17: BTG/Nexus gives him 41% in the first round, up 1 point against the house's own previous round, which had him at 40%, and 47% in the runoff, IDENTICAL to the previous round. ⭐ The distance to the runner-up did NOT change, it stays at 5 points, because both rose 1 point, and each move fits inside the 2pp margin. Quaest of Aug 14 remains in the base with 38%.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `🔴 A 2.00pp DROP ON Aug 17, from 66.50% to 64.50% (vol USD 8.52M accumulated), ${STAMP}, with the capture guard approved in TWO separate runs. He gave back exactly what he had gained the day before. The distance to the runner-up CLOSED from 37.05pp to 33.05pp, that is 4.00pp in about 26 hours. ⛔ No superlative: the series high remains 66.50%, from Aug 1, and 5 of the 90 days recorded since May 19 are above today's close.`,

  'polymarketComparison.candidates[1].polymarket': `31.45%`,
  'polymarketComparison.candidates[1].pesquisaRange': `31-36%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `NEW NATIONAL POLL ON Aug 17: BTG/Nexus takes him from 35% to 36% in the first round and repeats 44% in the runoff. ⚠️ The 1-point gain sits inside the house's 2pp margin, and the distance to the leader stayed the same, at 5 points. Quaest of Aug 14 remains in the base with 31%.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `🔴 A 2.00pp RISE ON Aug 17, from 29.45% to 31.45% (vol USD 8.46M accumulated), ${STAMP}. It is the fourth straight day of gains and the largest move of the day among the big contracts. ⛔ NOT a record: of the 90 days in the series since May 19, 2 are above it, and the high is 33.20%, from Jun 2. ⚠️ CAUSATION: the poll of the day did NOT shorten the distance between the top two, which stayed at the same 5 points, so it does not explain the 4.00pp shortening in the price.`,

  'polymarketComparison.candidates[2].polymarket': `4.05%`,
  'polymarketComparison.candidates[2].pesquisaRange': `4-5%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `🔴 NEW NATIONAL POLL ON Aug 17: BTG/Nexus keeps him at 4% in the first round and places him BEHIND Caiado, who has 5%. He is tied with Zema, who also has 4%, inside the 2pp margin.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `🔴 A DROP from 4.70% to 4.05% (vol USD 9.95M accumulated), ${STAMP}, and the value sits BELOW the 4.80% floor recorded in the 90-day series. ⚠️ CAVEAT ON FORM: his book is thin and swung between 3.75% and 4.15% in under ten minutes during the capture, so the move deserves a looser reading than that of the top two. In the third place contract he gave ground from 53.00% to 52.50%.`,

  'polymarketComparison.candidates[3].polymarket': `0.25%`,
  'polymarketComparison.candidates[3].pesquisaRange': `4-5%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `⭐ NEW NATIONAL POLL ON Aug 17: BTG/Nexus gives him 5% in the first round, ABOVE Renan Santos's 4%. In declared intention he becomes the third name in the race, inverting the ordering the market prices.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `⭐ THE CONTRACT CROSSING REPEATS AND FLIPS SIGN: he fell from 0.60% to 0.25% in WINNING (vol USD 6.07M accumulated), below the 0.50% series floor, and ROSE from 37.50% to 38.50% in the first-round THIRD PLACE contract. His distance to the leader of that book closed from 15.50pp to 14.00pp. These are different questions and the panel does not add them.`,

  'polymarketComparison.candidates[4].polymarket': `0.05%`,
  'polymarketComparison.candidates[4].pesquisaRange': `not tested`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `He does not appear in the stimulated scenario of the BTG/Nexus of Aug 17 nor in the Quaest of Aug 14.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `No movement captured on Aug 17. The price remains below the 0.5% cut the panel uses to separate price from noise, and he does not appear in the stimulated scenario of today's BTG/Nexus.`,

  'polymarketComparison.candidates[5].polymarket': `0.25%`,
  'polymarketComparison.candidates[5].pesquisaRange': `2-4%`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `NEW NATIONAL POLL ON Aug 17: BTG/Nexus gives him 4% in the first round, above the 2% Quaest measured on Aug 14, and tied with Renan Santos inside the 2pp margin.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `A 0.10pp RISE, from 0.15% to 0.25% (vol USD 5.62M accumulated), ${STAMP}. The price remains below the 0.5% cut the panel uses to separate price from noise. In the third place contract he has 4.95%.`,

  'polymarketComparison.candidates[6].polymarket': `0.05%`,
  'polymarketComparison.candidates[6].pesquisaRange': `not tested`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `He does not appear in the stimulated scenario of the BTG/Nexus of Aug 17 nor in the Quaest of Aug 14.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `No movement captured on Aug 17. The price remains below the 0.5% cut, and he does not appear in the stimulated scenario of today's BTG/Nexus.`,
})
