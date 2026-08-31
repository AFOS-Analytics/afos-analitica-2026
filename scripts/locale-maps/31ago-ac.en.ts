/** Mapa EN de 31/Ago/2026: analysis-criteriosa. Ponto decimal, vírgula de milhar. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const S = 'confirmed reading of Aug 31, 1:43 PM BRT (4:43 PM UTC)'
const ATLAS = 'AtlasIntel/Bloomberg of Aug 31 (BR-07972/2026, fieldwork Aug 25 to 30, n=5,014)'
const NEXUS = 'BTG/Nexus of Aug 31 (BR-08900/2026, fieldwork Aug 28 to 30, n=2,005)'
const SEM = 'This round publishes no new price for him, and the last price published is the one from Aug 30, 4:40 PM BRT'
const PISO = 'below the 0.5% floor at which the double reading certifies movement'
const TOFFOLI =
  "Dias Toffoli suspended the ticket's electoral advertising, its transfer of funds and its right to take part in debates, according to G1, after citing signs of illegality in the registration and postponing the ticket's ruling, according to Folha de S.Paulo and O Globo"
const TSE_PROP =
  "The TSE suspended the advertising spot from his campaign that listed a résumé of his opponent citing Banco Master and the payroll kickback scheme, according to O Globo, Folha de S.Paulo, Terra and CBN, and the Electoral Court also suspended the one that called him a ghost employee, according to G1"

construir('analysis-criteriosa', 'en', {
  subtitle: `Crossing of August 31, 2026: Polymarket price in the ${S}, presidential book at USD 140.52M, against the TWO national polls released this Monday, ${ATLAS} and ${NEXUS}. They are the first national polls since Vox Brasil of Aug 29, and fieldwork for both closed on Aug 30, already after the free electoral airtime debuted on Aug 28.`,

  // ── Lula ────────────────────────────────────────────────────────────────────
  'candidates[0].header': `PRICE: 55.50% (vol USD 9.53M accumulated), ${S}. No change on the day, and his price has not moved off 55.50% for the third day running. POLLING: AtlasIntel puts him at 43.4% in the ${G('first round', 'primeiro-turno')} and 47.1% in the ${G('runoff', 'segundo-turno')} against 42.6%, and BTG/Nexus puts him at 39% and 46% against 45%. The two agree that he is ahead and disagree on the size: 9.7pp against 6pp in the first round.`,
  'candidates[0].fortes[0]': `Both national polls this Monday put him ahead in the first round and in the runoff, and it is the first time since Vox of Aug 29 that the runoff carries a favourable sign for him in a released national poll.`,
  'candidates[0].fortes[1]': `AtlasIntel is the largest national sample in the panel's 30-day window, at n=5,014, and in it his first-round lead is 9.7 points.`,
  'candidates[0].fortes[2]': `In AtlasIntel's alternative scenarios he wins every one tested: 46.6% to 41.0% against Ronaldo Caiado, 47.0% to 40.7% against Romeu Zema and 47.5% to 26.0% against Renan Santos.`,
  'candidates[0].fortes[3]': `He is less rejected than the runner-up in both houses, with 52.0% by AtlasIntel and 49% by BTG/Nexus.`,
  'candidates[0].fortes[4]': `In the price, the distance to the runner-up widened to 16.45pp, against 14.40pp the day before, and the whole widening came from his opponent's side.`,
  'candidates[0].fracos[0]': `Government disapproval comes in above approval in both new readings: 52.9% disapproval by AtlasIntel, according to InfoMoney, and 46% approval against 51% disapproval by BTG/Nexus, according to VEJA.`,
  'candidates[0].fracos[1]': `BTG/Nexus itself records that the distance between approval and disapproval is the widest since May.`,
  'candidates[0].fracos[2]': `In the Nexus comparison against itself, against the Aug 24 round, he gives up 2 points in the first round, from 41% to 39%.`,
  'candidates[0].fracos[3]': `In the runoff of that same Nexus the picture did not move: it was 46% to 45% on Aug 24 and it is still 46% to 45%, meaning the first-round rearrangement did not reach the runoff.`,
  'candidates[0].fracos[4]': `${TSE_PROP}.`,
  'candidates[0].analise': `Monday gave the panel back what had been missing since Aug 29: a reading from the ballot. Two national polls came out on the same day, with different methods and different samples, and both put him ahead in both rounds. They disagree on the size, 9.7pp against 6pp in the first round and 4.5pp against 1pp in the runoff, and they do not disagree on the sign. In the price he sits at 55.50% (vol USD 9.53M) and did not move for the third day, while his opponent gave up 2.05pp. It is the first round of the week in which the two measurements move in the same direction in the ${G('first round', 'primeiro-turno')}, with the runner-up giving ground in the declared ballot and in the price. The side that does not follow is the government's ratings: both houses bring disapproval above approval, and Nexus records the widest distance between the two since May. Voting intention and government ratings are different rulers, and the panel does not add them up.`,

  // ── Flávio Bolsonaro ────────────────────────────────────────────────────────
  'candidates[1].header': `PRICE: 39.05% (vol USD 9.37M accumulated), ${S}. Down 2.05pp on the day, the largest move among the panel's names this round. POLLING: AtlasIntel puts him at 33.7% in the ${G('first round', 'primeiro-turno')} and 42.6% in the ${G('runoff', 'segundo-turno')}, and BTG/Nexus at 33% and 45%, 1 point behind the leader and inside the 2pp margin.`,
  'candidates[1].fortes[0]': `In the BTG/Nexus runoff he is 1 point behind the leader, 45% against 46%, inside the 2pp margin, which makes it a ${G('technical tie', 'empate-tecnico')}.`,
  'candidates[1].fortes[1]': `In the first-round second-place contract he is still at 85.50%, unchanged, and he is the name the market considers most likely to reach the runoff.`,
  'candidates[1].fortes[2]': `The Nexus runoff did not move against the same house's round of Aug 24, even though he gave up 4 points in the first round over the same interval.`,
  'candidates[1].fortes[3]': `The accumulated volume of his contract, USD 9.37M, is the second largest in the presidential book and sits less than USD 0.2M below the leader's.`,
  'candidates[1].fortes[4]': `The opposing campaign's advertising that listed accusations against him was suspended by the TSE and by the Electoral Court on the same day, according to O Globo, Folha de S.Paulo and G1.`,
  'candidates[1].fracos[0]': `He gave up 2.05pp in the price, from 41.10% to 39.05%, after four consecutive closes on the rise that had taken him from 35.50% on Aug 27 to 41.20% on Aug 30.`,
  'candidates[1].fracos[1]': `In the Nexus comparison against itself he gives up 4 points in the first round, from 37% to 33%, twice the leader's loss over the same interval.`,
  'candidates[1].fracos[2]': `He is the more rejected of the two in both houses, with 52.7% by AtlasIntel, according to CNN Brasil, and 50% by BTG/Nexus, according to Metrópoles.`,
  'candidates[1].fracos[3]': `The distance to the leader widened in both measurements at once: 16.45pp in the price, against 14.40pp the day before, and 9.7pp in AtlasIntel.`,
  'candidates[1].fracos[4]': `The former air force commander denied campaigning for the leader and pushed back on a statement of his, according to O Tempo and G1.`,
  'candidates[1].analise': `He was the name that moved most this round, and the move is downward in both measurements at once. In the price he gave up 2.05pp and went back to 39.05% (vol USD 9.37M), undoing much of the four-session rise that had taken him to 41.20% on Aug 30. In the declared ballot, the comparison that counts is Nexus against itself, same method and same sample: he gives up 4 points in the first round in one week, twice what the leader gave up. The counterpoint is in the runoff: in that same Nexus it stayed put at 45% against 46%, inside the margin, and he is still at 85.50% in the first-round second-place contract. That is, the market still treats his reaching the runoff as near certain, and what moved was the expectation about what happens there. Rejection is the steadiest figure in the set: he is the more rejected of the two in both houses.`,

  // ── Renan Santos ────────────────────────────────────────────────────────────
  'candidates[2].header': `PRICE: 1.85% (vol USD 11.95M accumulated), ${S}. Down 0.40pp on the day. POLLING: AtlasIntel measures him at 7.6% in the ${G('first round', 'primeiro-turno')}, practically tied with Augusto Cury for third, and BTG/Nexus measures him at 3%, unchanged against Aug 24.`,
  'candidates[2].fortes[0]': `AtlasIntel puts him at 7.6% in the first round, practically tied with Augusto Cury at 7.8%, and it is his best mark in a national poll in the panel's 30-day window.`,
  'candidates[2].fortes[1]': `The accumulated volume of his contract, USD 11.95M, is the largest in the presidential book among all names below the top two.`,
  'candidates[2].fortes[2]': `He held the 3% from BTG/Nexus unchanged against the same house's round of Aug 24, on a day when the leader and the runner-up both gave ground.`,
  'candidates[2].fracos[0]': `${TOFFOLI}.`,
  'candidates[2].fracos[1]': `AtlasIntel gives him a 67% negative image, the highest among the presidential candidates, according to CartaCapital.`,
  'candidates[2].fracos[2]': `In a hypothetical runoff against the leader he loses 47.5% to 26.0% in AtlasIntel, the widest distance among the alternative scenarios the house tested.`,
  'candidates[2].fracos[3]': `The two houses disagree by 4.6 points about him, 7.6% against 3%, the widest distance between them on a single name this round.`,
  'candidates[2].analise': `He is the name with the sharpest contrast of the round: his best poll so far and his worst court ruling so far, on the same day. AtlasIntel puts him at 7.6%, tied with Augusto Cury for third place, and BTG/Nexus keeps him at 3%, which opens a 4.6-point gap between the two houses about the same person. At the court, Dias Toffoli suspended the ticket's advertising, its transfer of funds and its right to debate, which is a ruling of greater practical reach than the previous day's removal from the docket. In the price he gave up 0.40pp, to 1.85% (vol USD 11.95M). His volume is still the largest in the book among names outside the top two, and that is what separates his case from Caiado's or Marçal's: there is real money positioned, even at a low price. The figure that ties the two sides together is the 67% negative image from AtlasIntel, the highest on the table.`,

  // ── Caiado / Haddad / Zema ──────────────────────────────────────────────────
  'candidates[3].header': `PRICE: Caiado 0.15% (vol USD 6.97M), Haddad 0.05% (vol USD 7.41M) and Zema 0.05% (vol USD 6.37M). All three are ${PISO}, and this round publishes no new price for any of them: the last prices published are the ones from Aug 30, 4:40 PM BRT. POLLING: BTG/Nexus of Aug 31 puts Caiado at 5% in the ${G('first round', 'primeiro-turno')}, the fourth name on its table, and Zema at 1%, the last.`,
  'candidates[3].subtitle': `Back of the field in the ${S}. Ronaldo Caiado comes in at 5% in the BTG/Nexus first round and Romeu Zema at 1%, and both remain below the 0.5% floor in the outright-winner contract. Augusto Cury, who is not in this block, is the one who moved in the declared ballot.`,
  'candidates[3].caiado.label': `CAIADO (PSD), presidential Poly 0.15% (vol USD 6.97M accumulated), ${PISO}. ${SEM}, at 0.15%. In the first-round third-place contract he is no longer the leading name.`,
  'candidates[3].caiado.fortes': `BTG/Nexus measures him at 5% in the first round, unchanged against the same house's round of Aug 24, and he is the fourth name on its table, behind Augusto Cury. In an AtlasIntel runoff he loses to the leader 46.6% to 41.0%, a distance of 5.6 points, the narrowest among the alternative scenarios tested.`,
  'candidates[3].caiado.fracos': `He fell behind Augusto Cury in BTG/Nexus, which had him ahead in the Aug 24 round. In the outright-winner contract he is still at 0.15%, ${PISO}, and the distance between the 5% the declared ballot gives him and the 0.15% of the implied probability is large, without the two quantities subtracting: one measures voting intention and the other, the chance of winning.`,
  'candidates[3].haddad.label': `HADDAD (PT), presidential Poly 0.05% (vol USD 7.41M accumulated), ${PISO}. ${SEM}, at 0.05%. He is not a presidential candidate.`,
  'candidates[3].zema.label': `ZEMA (Novo), presidential Poly 0.05% (vol USD 6.37M accumulated), ${PISO}. ${SEM}, at 0.05%.`,
  'candidates[3].zema.fracos': `BTG/Nexus measures him at 1% in the first round, against 3% in the same house's round of Aug 24, a loss of 2 points that puts him last on its table. In an AtlasIntel runoff he loses to the leader 47.0% to 40.7%, a distance of 6.3 points, wider than Caiado's.`,
  'candidates[3].fortes[0]': `RONALDO CAIADO (PSD) is at 5% in the BTG/Nexus first round, unchanged against the same house's round of Aug 24, on a day when the top two names both gave ground.`,
  'candidates[3].fortes[1]': `In the runoff tested by AtlasIntel, Caiado is the one who comes closest to the leader among the alternative scenarios, at 41.0% against 46.6%.`,
  'candidates[3].fortes[2]': `The three contracts hold meaningful volume even with the price at the floor: USD 7.41M in Haddad, USD 6.97M in Caiado and USD 6.37M in Zema.`,
  'candidates[3].fortes[3]': `None of the three was the target of a court ruling this Monday, unlike the fourth name on the table.`,
  'candidates[3].fracos[0]': `All three are still below the 0.5% floor in the outright-winner contract, the band in which the AFOS double reading does not certify movement.`,
  'candidates[3].fracos[1]': `Caiado lost third place in BTG/Nexus to Augusto Cury, who jumped from 2% to 11% in the same house.`,
  'candidates[3].fracos[2]': `Zema gave up 2 points in BTG/Nexus, from 3% to 1%, and is the last name on its table.`,
  'candidates[3].fracos[3]': `Haddad is not a presidential candidate: he is running for governor of São Paulo, and his contract measures an outcome his campaign is not pursuing.`,
  'candidates[3].analise': `The back of the field lost the reference it had. Until the BTG/Nexus round of Aug 24, Ronaldo Caiado was the third name of the third way in the national polls and the leading name in the first-round third-place contract. This Monday he held the same house's 5% and was overtaken by Augusto Cury, who reached 11%. Zema gave up 2 points and landed at 1%. In the price, all three are still at the floor: 0.15% for Caiado and 0.05% for Haddad and Zema, all below the 0.5% threshold at which the double reading certifies movement, which is why this round publishes no new price for any of the three. What separates this block from Renan Santos's case is volume: their contracts hold between USD 6.37M and USD 7.41M, real money positioned on an outcome the market prices as very unlikely.`,

  // ── Quadro comparativo ──────────────────────────────────────────────────────
  'quadroComparativo[0].p': `${ATLAS} puts him at 43.4% in the ${G('first round', 'primeiro-turno')} and 47.1% in the ${G('runoff', 'segundo-turno')} against 42.6%, and ${NEXUS} puts him at 39% and 46% against 45%. In the Nexus comparison against itself, against Aug 24, he gives up 2 points in the first round and does not move in the runoff, which is still 46 to 45. Rejection of 52.0% by AtlasIntel and 49% by Nexus.`,
  'quadroComparativo[0].m': `55.50% (vol USD 9.53M), ${S}. No change on the day, and his price has not moved off 55.50% for the third day running. The distance to the runner-up widened to 16.45pp, against 14.40pp yesterday.`,
  'quadroComparativo[0].t': `still on price for the third day, and the distance widens only from his opponent's side`,
  'quadroComparativo[0].s': `${TSE_PROP}. After the defeat in the Senate, he said he will nominate Messias to the Supreme Court again, according to Migalhas.`,
  'quadroComparativo[1].p': `The same AtlasIntel puts him at 33.7% in the first round and 42.6% in the runoff, 4.5 points behind the leader, and Nexus puts him at 33% and 45%, 1 point behind, inside the 2pp margin and therefore a ${G('technical tie', 'empate-tecnico')}. In the Nexus comparison against itself he gives up 4 points in the first round, from 37% to 33%, twice the leader's loss. He is the more rejected of the two in both houses, with 52.7% by AtlasIntel and 50% by Nexus.`,
  'quadroComparativo[1].m': `39.05% (vol USD 9.37M), ${S}. Down 2.05pp, the largest move among the panel's names this round, after four consecutive closes on the rise that took him from 35.50% on Aug 27 to 41.20% on Aug 30. In the first-round second-place contract he is still at 85.50%.`,
  'quadroComparativo[1].t': `gives ground in both measurements on the same day, undoing much of the four-session rise`,
  'quadroComparativo[1].s': `He said he will nominate to the Supreme Court justices opposed to abortion, drugs and injustice, according to Gazeta do Povo. The former air force commander denied campaigning for the leader and pushed back on a statement of his, according to O Tempo and G1.`,
  'quadroComparativo[2].p': `${NEXUS} measures him at 11% in the ${G('first round', 'primeiro-turno')}, against 2% in its own round of Aug 24, a gain of 9 points in one week, and he is the first name outside the top two to reach double digits in that series, according to CNN Brasil. AtlasIntel measures him at 7.8%, practically tied with Renan Santos.`,
  'quadroComparativo[2].m': `1.85% (vol USD 2.89M) in the outright-winner contract. ${SEM}, and his series has 68 captures, too short for a superlative.`,
  'quadroComparativo[2].t': `the name that moved in the declared ballot, with no new price reading this round`,
  'quadroComparativo[2].s': `The campaigns of the top two names reacted to his rise in the polls, according to UOL. Searches for his name on Google were 900% higher in the week after the Aug 22 debate, according to CNN Brasil.`,
  'quadroComparativo[3].p': `AtlasIntel measures him at 7.6% in the first round, practically tied with Augusto Cury for third, and in a hypothetical runoff he loses 47.5% to 26.0%. Nexus measures him at 3%, unchanged against Aug 24. It is the widest distance between the two houses on a single name this round, at 4.6 points. AtlasIntel gives him a 67% negative image, the highest among the presidential candidates, according to CartaCapital.`,
  'quadroComparativo[3].m': `1.85% (vol USD 11.95M), ${S}. Down 0.40pp on the day. His accumulated volume is the largest in the presidential book among the names below the top two.`,
  'quadroComparativo[3].t': `best poll and worst court ruling on the same day`,
  'quadroComparativo[3].s': `${TOFFOLI}. He called the leader a friend and the runner-up an ally of organised crime, according to UOL.`,
  'quadroComparativo[4].p': `${NEXUS} puts him at 5% in the first round, unchanged against the same house's round of Aug 24, and he is the fourth name on its table, behind Augusto Cury. In an AtlasIntel runoff he loses to the leader 46.6% to 41.0%, a distance of 5.6 points, the narrowest among the alternative scenarios.`,
  'quadroComparativo[4].m': `0.15% (vol USD 6.97M), ${PISO}. ${SEM}, at 0.15%.`,
  'quadroComparativo[4].t': `holds the 5% of the declared ballot and loses third place to another name`,
  'quadroComparativo[4].s': `He does not appear in this Monday's news cycle with a fact of his own.`,
  'quadroComparativo[5].p': `Neither national poll this Monday includes him in the released first-round table. PoderData/Aya of Aug 27 measured him at 3% in the first round.`,
  'quadroComparativo[5].m': `0.15% (vol USD 3.07M), ${PISO}. ${SEM}, at 0.15%.`,
  'quadroComparativo[5].s': `He does not appear in this Monday's news cycle with a fact of his own.`,
  'quadroComparativo[6].m': `3.60% (vol USD 84 thousand), ${S}. No change, and it is still the smallest book on the panel.`,
  'quadroComparativo[6].t': `still on a day when the court ruled on a presidential ticket`,
  'quadroComparativo[6].s': `${TOFFOLI}. Gilmar Mendes barred a judges' union from charging non-member magistrates, according to O Globo. After the defeat in the Senate, the leader said he will nominate Messias to the court again, according to Migalhas, and the runner-up said he will nominate justices opposed to abortion, drugs and injustice, according to Gazeta do Povo.`,

  cruzamento: `August 31 is the first round of the week in which the panel's two measurements move in the same direction, and that is what sets it apart from the previous ones. Two national polls were released on the same day, ${ATLAS} and ${NEXUS}, and both show the runner-up giving ground in the ${G('first round', 'primeiro-turno')}. In the price, he gave up 2.05pp, from 41.10% to 39.05%, while the leader did not move off 55.50% for the third day running. The distance between the two widened from 14.40pp to 16.45pp, and the widening came from one side only.

The two houses agree on who is ahead and disagree on the size: 9.7pp against 6pp in the first round, and 4.5pp against 1pp in the ${G('runoff', 'segundo-turno')}. Disagreement on size between pollsters with different methods, electronic form against phone, is normal instrument behaviour, and the panel publishes both without choosing between them.

The move both houses record and the price does not is Augusto Cury's. Nexus measures him at 11% in the first round, against 2% in its own round of Aug 24, and AtlasIntel measures him at 7.8%. This round publishes no new price for him, and the last one published is from Aug 30, 4:40 PM BRT, at 1.85%. His contract's series has 68 captures, too short to support a superlative.

What does not follow the rest is the government's ratings. Both houses bring disapproval above approval, at 52.9% by AtlasIntel and 51% against 46% by Nexus, which records the widest distance between the two since May. Voting intention and government ratings are different rulers, measured with different questions, and the panel neither adds them up nor derives one from the other.`,
})
