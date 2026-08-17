/**
 * Mapa EN de 17/Ago para analysis-criteriosa.json.
 * Convenções EN: PONTO decimal e VÍRGULA de milhar. R$ permanece, só a escala traduz.
 */
import { construir } from '../build-locale-json'

const STAMP = 'confirmed reading of Aug 17, 6:48 PM BRT (9:48 PM UTC)'

construir('analysis-criteriosa', 'en', {
  updatedAt: `17/08/2026, 18:48`,

  subtitle:
    `UPDATE Aug 17, 48 days from the first round and on the SECOND DAY OF THE OFFICIAL CAMPAIGN. NEW POLL: BTG/Nexus was released today (n=2,003, field Aug 14 to 16, TSE registration BR-03317/2026, margin of 2pp), the first national poll since Quaest on Aug 14. PRICE: a new confirmed reading for every contract, with the capture guard approved in two separate runs. ⭐ THE CROSSING OF THE DAY: the poll did not move the distance between the top two, which stays at 5 points, and the price closed 4.00pp of that same distance on the same day.`,

  // ---------------- LULA ----------------
  'candidates[0].header':
    `PRICE: 64.50% (vol USD 8.52M accumulated), ${STAMP}. POLL: 41% in the first round and 47% in the runoff in today's BTG/Nexus.`,
  'candidates[0].fortes[0]':
    `Today's BTG/Nexus puts him at 41% in the first round, up 1 point against the same house's previous round, which had him at 40%.`,
  'candidates[0].fortes[1]':
    `In the stimulated runoff he appears with 47% against 44%, a result IDENTICAL to the house's previous round, keeping the 3-point advantage.`,
  'candidates[0].fortes[2]':
    `The distance to the runner-up in the poll stays at 5 points, the same as the previous round, meaning the challenger's gain did not shorten the measured interval.`,
  'candidates[0].fortes[3]':
    `In the price he remains far ahead, at 64.50% against 31.45%, and his contract holds USD 8.52M inside a presidential book of USD 126.85M.`,
  'candidates[0].fortes[4]':
    `Of the 90 days in the series recorded since May 19, only 5 are above today's close.`,
  'candidates[0].fracos[0]':
    `🔴 A 2.00pp DROP in the price in one day, from 66.50% to 64.50%, giving back exactly what he had gained the day before.`,
  'candidates[0].fracos[1]':
    `The distance to the runner-up in the price CLOSED from 37.05pp to 33.05pp, that is 4.00pp in about 26 hours.`,
  'candidates[0].fracos[2]':
    `The government assessment in today's BTG/Nexus has 42% rating it bad or terrible against 34% excellent or good, with 23% average.`,
  'candidates[0].fracos[3]':
    `⛔ No upside superlative applies: the series high remains 66.50%, from Aug 1, and today's value sits below it.`,
  'candidates[0].fracos[4]':
    `The Federal Police found a message in which his son and a lobbyist under investigation for INSS fraud discuss business, and the runner-up and his brother used the case the same day, according to Poder360.`,
  'candidates[0].analise':
    `⭐ THE DAY IS ONE OF DISAGREEMENT BETWEEN THE TWO UNIVERSES, and that is the finding. The new poll said almost nothing changed: he went from 40% to 41%, the runner-up from 35% to 36%, the distance between them stayed at the same 5 points and the runoff scenario repeated 47 to 44, number for number. Both 1-point moves fit entirely inside the 2pp margin declared by the house. On the same day the price did something else: he gave up 2.00pp and the runner-up gained 2.00pp, so the distance in the market shrank 4.00pp. ⛔ The panel does NOT claim the price moved because of the poll, and the reason is arithmetic: the poll showed no shortening at all, so it does not explain a 4-point shortening in the price. What can be recorded is that both moved in different directions on the same day, and that the press framed the runner-up's 1-point gain as an advance and a more competitive race. 📌 The price reading also does not come from a single instant: the capture guard was run TWICE, in separate windows, and approved both times.`,

  // ---------------- FLÁVIO ----------------
  'candidates[1].header':
    `PRICE: 31.45% (vol USD 8.46M accumulated), ${STAMP}. POLL: 36% in the first round and 44% in the runoff in today's BTG/Nexus.`,
  'candidates[1].fortes[0]':
    `🔴 A 2.00pp RISE in the price in one day, from 29.45% to 31.45%, and it is the fourth straight day of gains.`,
  'candidates[1].fortes[1]':
    `The distance to the leader in the price CLOSED 4.00pp in about 26 hours, from 37.05pp to 33.05pp.`,
  'candidates[1].fortes[2]':
    `Today's BTG/Nexus takes him from 35% to 36% in the first round, and in the runoff he repeats the 44% of the previous round.`,
  'candidates[1].fortes[3]':
    `He dominates the first-round second place contract with 85.50%, far ahead of the next name in that book.`,
  'candidates[1].fortes[4]':
    `The negative assessment of the incumbent administration stands at 42% bad or terrible in the same BTG/Nexus.`,
  'candidates[1].fracos[0]':
    `⛔ Not a record: of the 90 days in the series since May 19, 2 are above today's close, and the high remains 33.20%, from Jun 2.`,
  'candidates[1].fracos[1]':
    `In the poll the distance to the leader did NOT change: it was 5 points and it is still 5 points, because both rose 1 point.`,
  'candidates[1].fracos[2]':
    `The 1-point gain sits inside the house's own 2pp margin, so it is not distinguishable from stability.`,
  'candidates[1].fracos[3]':
    `In the runoff he remains 3 points behind, 44% against 47%, exactly as in the previous round.`,
  'candidates[1].fracos[4]':
    `His campaign spent the day in a dispute with a rival from his own side: he accused Caiado of helping the leader, after Kassab said Caiado has zero chance, and Kassab replied that his campaign is worried about Caiado, according to Estadão.`,
  'candidates[1].analise':
    `His price made the largest move of the day among the big contracts, at 2.00pp, and it is the fourth straight day rising. ⚠️ The new poll does NOT support that move as a shortening: he rose 1 point, the leader rose 1 point, and the measured distance stayed at the same 5. In the runoff the result was identical to the previous round. 📌 The difference between the two readings is the data: the market closed 4.00pp of distance on a day when the poll closed none. ⛔ No superlative: 31.45% is not the highest value in the series, and two of the 90 recorded days are above it. Outside the price, his day was one of internal friction on the right, with the public exchange with Kassab and with Caiado recorded by Estadão and Folha de S.Paulo.`,

  // ---------------- RENAN SANTOS ----------------
  'candidates[2].header':
    `PRICE: 4.05% (vol USD 9.95M accumulated), ${STAMP}. POLL: 4% in the first round in today's BTG/Nexus, BEHIND Caiado, who has 5%.`,
  'candidates[2].fortes[0]':
    `He still leads the first-round third place contract, at 52.50%, the highest probability in that book.`,
  'candidates[2].fortes[1]':
    `His contract has the LARGEST accumulated volume in the presidential book, at USD 9.95M, above the leader's own.`,
  'candidates[2].fortes[2]':
    `Today's BTG/Nexus keeps him at 4% in the first round, the same level as recent national polls.`,
  'candidates[2].fortes[3]':
    `He opened his campaign in São Paulo on Aug 16 with a security-focused speech, according to O Globo and G1.`,
  'candidates[2].fortes[4]':
    `He publicly assessed that Pablo Marçal's possible entry into the race would benefit his rival on the right, and not him.`,
  'candidates[2].fracos[0]':
    `🔴 A CONTINUED DROP in the price, from 4.70% to 4.05%, and the value sits BELOW any close recorded in the 90-day series, whose floor was 4.80%.`,
  'candidates[2].fracos[1]':
    `⚠️ His book is thin and swung between 3.75% and 4.15% in under ten minutes during today's capture. The published number is the one the guard confirmed, and that instability is declared here.`,
  'candidates[2].fracos[2]':
    `In the third place contract he also gave ground, from 53.00% to 52.50%, and the distance to the second name in that book narrowed from 15.50pp to 14.00pp.`,
  'candidates[2].fracos[3]':
    `🔴 IN THE POLL HE IS BEHIND CAIADO: today's BTG/Nexus gives Caiado 5% and him 4%.`,
  'candidates[2].fracos[4]':
    `His series high is 17.90%, from Jun 9, meaning today's price is less than a quarter of that value.`,
  'candidates[2].analise':
    `⭐ THE CLEANEST CROSSING OF THE DAY IS IN HIM, and it is between the two universes. In today's POLL he appears with 4% and Caiado with 5%, that is, behind. In the MARKET he has 4.05% to win against Caiado's 0.25%, and in the third place contract he has 52.50% against 38.50%. 📌 The two universes disagree about who the third name in the race is, and the panel does not arbitrate between them: it records that the poll measures declared vote intention and the contract measures probability of finishing in a given position, which are different questions. ⚠️ And there is a caveat on form that weighs here: his book is thin, it swung 0.40pp within minutes during the capture, and for that reason movement in his win contract deserves a looser reading than that of the top two.`,

  // ---------------- PELOTÃO ----------------
  'candidates[3].header':
    `PRICE for the whole pack, ${STAMP}: Caiado 0.25% (vol USD 6.07M), Zema 0.25% (vol USD 5.62M). ⭐ Pablo Marçal appears at 0.90% and enters the next Datafolha survey.`,
  'candidates[3].fortes[0]':
    `⭐ CAIADO ROSE IN THE POSITION CONTRACT: first-round third place went from 37.50% to 38.50%, and his distance to the leader of that book closed from 15.50pp to 14.00pp.`,
  'candidates[3].fortes[1]':
    `In today's BTG/Nexus Caiado has 5% in the first round, ABOVE Renan Santos's 4%, inverting the ordering the market prices.`,
  'candidates[3].fortes[2]':
    `Zema has 4% in the same BTG/Nexus, tied with Renan Santos inside the 2pp margin.`,
  'candidates[3].fortes[3]':
    `The runner-up's campaign treated Caiado as a problem on the same day: Kassab said the campaign is worried about Caiado, according to Estadão.`,
  'candidates[3].fortes[4]':
    `Pablo Marçal is priced at 0.90% and will be included in the Datafolha survey scheduled for Aug 21, according to Valor Econômico.`,
  'candidates[3].fracos[0]':
    `🔴 Caiado FELL in the win contract, from 0.60% to 0.25%, below the 0.50% floor recorded in the 90-day series.`,
  'candidates[3].fracos[1]':
    `Zema remains at 0.25%, below the 0.5% cut the panel uses to separate price from noise.`,
  'candidates[3].fracos[2]':
    `Both win contracts in the pack sit at a level where a one-hundredth change already shifts the relative percentage, and the panel treats that as shape, not signal.`,
  'candidates[3].fracos[3]':
    `Kassab, who is the running mate on Caiado's ticket, publicly said he has zero chance in the election, and then said he had been misinterpreted, according to Folha de S.Paulo and Estadão.`,
  'candidates[3].fracos[4]':
    `Zema opened the week promising a maximum-security prison and criticising Supreme Court justices, and that still has no translation into price, with 4.95% in the third place contract.`,
  'candidates[3].analise':
    `The pack produced the most interesting move of the day in POSITION, not in winning. Caiado fell in the contract on winning, from 0.60% to 0.25%, and rose in the one on finishing third, from 37.50% to 38.50%. 📌 These are different questions and the panel does not add them: one contract asks whether he wins the election, the other asks in which position he finishes the first round. ⭐ And today's poll reinforces that side: BTG/Nexus gives Caiado 5% against Renan Santos's 4%, meaning that in declared intention he is already the third name, while in the third place book he still sits 14.00pp behind. ⚠️ All of these win contracts in the pack are below 1%, a range in which the panel declares noise and avoids fine readings.`,

  // ---------------- QUADRO COMPARATIVO ----------------
  'quadroComparativo[0].p':
    `NEW NATIONAL POLL: BTG/Nexus of Aug 17 (n=2,003, field Aug 14 to 16, BR-03317/2026, margin of 2pp) with 41% in the first round, up 1 point against the same house, and 47% in the runoff, IDENTICAL to the previous round. Quaest of Aug 14 remains in the base with 38%.`,
  'quadroComparativo[0].m': `64.50% (vol USD 8.52M accumulated), ${STAMP}`,
  'quadroComparativo[0].t':
    `🔴 A 2.00pp DROP, from 66.50% to 64.50%, giving back what he gained the day before. The distance to the runner-up CLOSED from 37.05pp to 33.05pp. ⛔ No superlative: the series high remains 66.50%, from Aug 1, and 5 of the 90 recorded days are above today's close.`,
  'quadroComparativo[0].s':
    `Second day of the official campaign, 48 days from the first round. The Federal Police found a message in which his son and a lobbyist under investigation for INSS fraud discuss business, according to Poder360. 📅 Datafolha publishes on Aug 21, including Pablo Marçal.`,

  'quadroComparativo[1].p':
    `NEW NATIONAL POLL: today's BTG/Nexus takes him from 35% to 36% in the first round and repeats 44% in the runoff. ⚠️ The distance to the leader did NOT change, it stays at 5 points, because both rose 1 point, and each move fits inside the 2pp margin.`,
  'quadroComparativo[1].m': `31.45% (vol USD 8.46M accumulated), ${STAMP}`,
  'quadroComparativo[1].t':
    `🔴 A 2.00pp RISE, from 29.45% to 31.45%, the fourth straight day of gains and the largest move of the day among the big contracts. ⛔ Not a record: 2 of the 90 days in the series are above it, and the high is 33.20%, from Jun 2.`,
  'quadroComparativo[1].s':
    `He spent the day in friction inside his own camp: he accused Caiado of helping the leader after Kassab said Caiado has zero chance, and Kassab replied that his campaign is worried about Caiado, according to Estadão.`,

  'quadroComparativo[2].p':
    `NEW NATIONAL POLL: today's BTG/Nexus keeps him at 4% in the first round. 🔴 He appears BEHIND Caiado, who has 5%, and tied with Zema, who has 4%.`,
  'quadroComparativo[2].m': `4.05% (vol USD 9.95M accumulated), ${STAMP}`,
  'quadroComparativo[2].t':
    `🔴 A CONTINUED DROP, from 4.70% to 4.05%, and the value falls BELOW the 4.80% floor recorded in the 90-day series. ⚠️ The book is thin and swung between 3.75% and 4.15% in under ten minutes during the capture, and the published number is the one the guard confirmed. In third place he gave ground from 53.00% to 52.50%.`,
  'quadroComparativo[2].s':
    `He opened his campaign in São Paulo on Aug 16 with a security-focused speech, according to O Globo and G1. He said Pablo Marçal's possible entry would benefit his rival on the right, and not him.`,

  'quadroComparativo[3].p':
    `NEW NATIONAL POLL: today's BTG/Nexus gives him 5% in the first round, ⭐ ABOVE Renan Santos's 4%. In declared intention he is already the third name in the race.`,
  'quadroComparativo[3].m': `0.25% (vol USD 6.07M accumulated), ${STAMP}`,
  'quadroComparativo[3].t':
    `⭐ THE CONTRACT CROSSING REPEATS AND FLIPS SIGN: he fell from 0.60% to 0.25% in WINNING, below the 0.50% series floor, and ROSE from 37.50% to 38.50% in third PLACE. His distance to the leader of that book closed from 15.50pp to 14.00pp.`,
  'quadroComparativo[3].s':
    `Kassab, the running mate on his ticket, said he has zero chance and then said he had been misinterpreted, according to Folha de S.Paulo. The same day, Kassab said the runner-up's campaign is worried about him, according to Estadão.`,

  'quadroComparativo[4].p':
    `NEW NATIONAL POLL: today's BTG/Nexus gives him 4% in the first round, tied with Renan Santos inside the 2pp margin and behind Caiado's 5%.`,
  'quadroComparativo[4].m': `0.25% (vol USD 5.62M accumulated), ${STAMP}`,
  'quadroComparativo[4].t':
    `A 0.10pp RISE, from 0.15% to 0.25%, and the price remains below the 0.5% cut the panel uses to separate price from noise. In the third place contract he has 4.95%.`,
  'quadroComparativo[4].s':
    `He began the campaign week promising a maximum-security prison and criticising Supreme Court justices, according to Folha de S.Paulo and Valor Econômico.`,

  'quadroComparativo[5].p': `No poll. Market on the impeachment of a Supreme Court justice before 2027.`,
  'quadroComparativo[5].m': `3.40% (vol USD 84 thousand), ${STAMP}`,
  'quadroComparativo[5].t':
    `FLAT at 3.40%, with no variation against the Aug 16 reading. ⚠️ It remains the thinnest contract among those tracked, with volume three orders of magnitude below the presidential book, and movement in it requires that caveat before any reading.`,
  'quadroComparativo[5].s':
    `⭐ The court returned to the news from outside the campaign: the United States government is weighing new sanctions against Justice Alexandre de Moraes, according to the Financial Times, reported in Brazil by Valor Econômico and G1. The São Paulo bar association proposed to the Supreme Court a 12-year term for justices and a minimum age of 50.`,

  // ---------------- CRUZAMENTO ----------------
  cruzamento:
    `⭐ THE DAY HAS A SINGLE FINDING AND IT IS A DISAGREEMENT BETWEEN THE TWO UNIVERSES THE PANEL MEASURES. The first national poll since Aug 14 came out today, BTG/Nexus (n=2,003, field Aug 14 to 16, BR-03317/2026, margin of 2pp), and what it says is stability: the leader went from 40% to 41%, the runner-up from 35% to 36%, the DISTANCE between them stayed at the same 5 points, and the runoff scenario repeated 47 to 44, number for number. Both 1-point moves fit entirely inside the margin declared by the house. On the same day the market did the opposite: the leader gave up 2.00pp and the runner-up gained 2.00pp, so the distance in the price CLOSED 4.00pp, from 37.05pp to 33.05pp, in about 26 hours. ⛔ The panel does NOT claim the price reacted to the poll, and the reason is arithmetic: the poll showed no shortening, so it does not explain a 4-point shortening. What can be recorded, and the panel records it, is that the press framed the runner-up's 1-point gain as an advance and a more competitive race, and that the price moved in the direction of that framing. Directional correlation is not cause, and the panel stops here. ⭐ THE SECOND CROSSING IS ABOUT WHO IS THIRD. In today's poll, Caiado has 5% and Renan Santos has 4%, with Zema also at 4%. In the market, Renan Santos has 4.05% to win against Caiado's 0.25%, and in the first-round third place contract he has 52.50% against 38.50%. The two universes disagree about the ordering of the pack, and the disagreement has been narrowing: that book was 15.50pp apart on Aug 16 and is 14.00pp apart now. 📌 The panel does not arbitrate between them, because the questions are different: the poll measures declared first-round vote intention, the contract measures probability of finishing in a given position. ⚠️ WHAT WEAKENS TODAY'S READING, declared: the Renan Santos contract is thin and swung between 3.75% and 4.15% in under ten minutes during the capture, so movement in it deserves a looser reading than in the top two. And the government approval rating does NOT enter this panel today, because outlets diverged on the BTG/Nexus figure, between 47% against 48% and 46% against 49%, and the pollster's own site did not carry the data. Only the assessment enters, where the reading converges: 42% bad or terrible, 34% excellent or good and 23% average. 📌 The price capture for this panel was confirmed by TWO independent runs of the guard, in separate windows, and both approved.`,
})
