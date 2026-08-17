/**
 * Mapa EN, complemento de 17/Ago: Marçal entra, estado eleitoral declarado.
 * Índices novos: 0 Lula, 1 Flávio, 2 Renan, 3 Caiado, 4 Marçal, 5 Tarcísio, 6 Zema, 7 Haddad.
 */
import { construir } from '../build-locale-json'

const STAMP = 'confirmed reading of Aug 17, 6:48 PM BRT (9:48 PM UTC)'

construir('polls-data', 'en', {
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `🔴 A 2.00pp DROP ON Aug 17, from 66.50% to 64.50% (vol USD 8.52M accumulated), ${STAMP}, with the capture guard approved in TWO separate runs. He gave back exactly what he had gained the day before. The distance to the runner-up CLOSED from 37.05pp to 33.05pp, that is 4.00pp in about 26 hours. ⛔ No superlative: since May 19 the series marked 66.50% as its high, on Aug 1, and 5 of the 90 recorded days are above today's close.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `🔴 A DROP: it went from 4.70% to 4.05% (vol USD 9.95M accumulated), ${STAMP}, and the value sits BELOW the 4.80% floor recorded in the 90-day series. ⚠️ CAVEAT ON FORM: his book is thin and swung between 3.75% and 4.15% in under ten minutes during the capture, so the move deserves a looser reading than that of the top two. In the third place contract he gave ground from 53.00% to 52.50%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `⭐ THE CONTRACT CROSSING REPEATS AND FLIPS SIGN: it went from 0.60% to 0.25% in WINNING (vol USD 6.07M accumulated), below the 0.50% series floor, and ROSE from 37.50% to 38.50% in the first-round THIRD PLACE contract. His distance to the leader of that book closed from 15.50pp to 14.00pp. These are different questions and the panel does not add them.`,

  // ---- MARÇAL, linha nova ----
  'polymarketComparison.candidates[4].polymarket': `0.90%`,
  'polymarketComparison.candidates[4].pesquisaRange': `not tested`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `🔴 NONE of the panel's 19 polls tests him, and no national poll in the window includes him in a presidential scenario. 📅 The Datafolha scheduled for Aug 21 will be the FIRST to include him, according to Valor Econômico. ⚠️ Until then the panel records absence of measurement, which is different from a measurement equal to zero, and for that reason he stays out of the crossing graph until a poll exists.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `At 0.90% (vol USD 1.21M accumulated), ${STAMP}. It is the only book in which he appears: he has no second place or third place contract. 🏷️ DECLARED ELECTORAL STATUS: he filed for registration and is among the 13 who did so, and an INJUNCTION cleared him to campaign, but he is INELIGIBLE until 2032 and the registration remains PENDING a decision by the electoral court, according to BBC, G1 and Folha de S.Paulo. ⭐ The crossing he produces is the sharpest in the panel today: the market already assigns him a price and more than a million dollars of volume, and the ballot box has not measured him even once.`,

  // ---- TARCÍSIO, agora índice 5 ----
  'polymarketComparison.candidates[5].pesquisaRange': `not tested`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `🏷️ HE IS NOT A PRESIDENTIAL CANDIDATE: he opened his campaign for REELECTION as governor of São Paulo on Aug 16, according to O Globo and Folha de S.Paulo. No national poll in the window tests him in a presidential scenario, and absence of testing is information the panel records rather than repeating old data as if it were new.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `At 0.05% (vol USD 13.93M accumulated), ${STAMP}, flat and below the 0.5% cut the panel uses to separate price from noise. ⭐ And here is why the row REMAINS in the panel even with him out of the presidential race: in the Aug 17 capture he holds the highest accumulated volume among the 18 priced contracts in the presidential book, above the leader's own, which holds USD 8.52M. Declared scope: the comparison is made in this capture, not across the series. High volume with probability at the floor, on someone who has already registered for a different office, is conviction priced into an outcome reality has ruled out. The panel shows that instead of deleting the row.`,

  // ---- ZEMA, agora índice 6 ----
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `A 0.10pp RISE: it went from 0.15% to 0.25% (vol USD 5.62M accumulated), ${STAMP}. The price remains below the 0.5% cut the panel uses to separate price from noise. In the third place contract he has 4.95%.`,

  // ---- HADDAD, agora índice 7 ----
  'polymarketComparison.candidates[7].pesquisaRange': `not tested`,
  'polymarketComparison.candidates[7].tendenciaPesquisa':
    `🏷️ HE IS NOT A PRESIDENTIAL CANDIDATE: he opened his campaign for GOVERNOR OF SÃO PAULO on Aug 16, according to O Globo and Times Brasil. No national poll in the window includes him in a presidential scenario, and any scenario that did would be a survey hypothesis, not a candidacy under way.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `At 0.05% (vol USD 7.20M accumulated), ${STAMP}, flat and below the 0.5% cut. The contract remains open and traded even with him running for a different office, and the panel keeps the row to record that fact rather than hide it.`,

  'polymarketComparison.note':
    `⭐ THE DAY HAS A DISAGREEMENT IN DIRECTION BETWEEN THE TWO UNIVERSES, and that is the finding. The BTG/Nexus of Aug 17 (n=2,003, field Aug 14 to 16, margin of 2pp) showed STABILITY: the leader went from 40% to 41%, the runner-up from 35% to 36%, the distance stayed at the same 5 points and the runoff repeated 47 to 44. On the same day the price CLOSED 4.00pp of that distance, from 37.05pp to 33.05pp. ` +
    `⛔ The panel does not claim the price reacted to the poll: the poll shortened nothing, so it does not explain a 4-point shortening. ` +
    `⭐ And there is a second crossing, about who is third: the poll puts Caiado at 5% and Renan Santos at 4%, while the market gives Renan 4.05% and Caiado 0.25%, and in the third place contract 52.50% against 38.50%. The two universes disagree about the ordering of the pack. ` +
    `📌 Capture confirmed by TWO independent runs of the guard, in separate windows. ` +
    `🏷️ ELECTORAL STATUS DECLARED ROW BY ROW, from Aug 17: Pablo Marçal enters the table because he is a registered candidate cleared to campaign by an injunction, though INELIGIBLE until 2032 and with his registration pending before the electoral court. Tarcísio de Freitas and Fernando Haddad REMAIN despite not running for president, because their contracts are still open and traded, and the first holds, in the Aug 17 capture, the highest accumulated volume among the 18 priced contracts in the presidential book. ⛔ The panel does not delete a row to look tidy: it declares the status of each one.`,
})
