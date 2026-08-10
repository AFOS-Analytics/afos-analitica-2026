/**
 * Mapa EN de 10/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 10".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const PRICE = 'confirmed reading of Aug 9, 17:34 UTC'

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 10, 55 days from the ${G('first round', 'primeiro-turno')}. TWO NEW NATIONAL POLLS: BTG/Nexus (n=2,001, telephone, BR-08428/2026) and the debut of Palver (n=5,000, online, BR-06596/2026), both published today. The prices on this page are from the ${PRICE}, because there is no new price reading on Aug 10.`,

  // ================= LULA =================
  'candidates[0].header':
    `TWO NEW POLLS AND THEY DISAGREE WITH EACH OTHER: BTG/Nexus gives him 40% in the first round and Palver gives him 44%, with runoffs of 47% x 44% and 46% x 46%. Across the four national polls since Aug 5 he ranges from 39% to 44%, a 5pp band. Price from the ${PRICE}: 63.50% (vol USD 8.18M cumulative). There is no new price reading on Aug 10, and so this page records no price movement on the day.`,
  'candidates[0].fortes[0]':
    `He leads the first round in ALL FOUR national polls of the window, without exception: 39% at Quaest on Aug 5, 43% at Ideia the same day, 40% at BTG/Nexus today and 44% at Palver today.`,
  'candidates[0].fortes[1]':
    `Today's BTG/Nexus puts the first round difference OUTSIDE the 2pp margin, with 40% against 35%, and it is the same house that in the Aug 3 round had recorded 41% against 37%.`,
  'candidates[0].fortes[2]':
    `He wins or ties the runoffs of all four rounds, and in the worst of them, Palver, he ties at 46% x 46%.`,
  'candidates[0].fortes[3]':
    `The spread between houses is SMALLER on his side: in the first round the four readings fit inside a 5pp band, against 10pp for his opponent.`,
  'candidates[0].fortes[4]':
    `Price from the ${PRICE} at 63.50%, with USD 8.18M in cumulative volume, and the 89-day series has a peak of 66.50%, from Aug 1.`,
  'candidates[0].fracos[0]':
    `APPROVAL WORSENED IN BOTH OF TODAY'S READINGS: 46% against 49% at BTG/Nexus, versus 47% x 48% in that house's own Aug 3 round, and 45% against 55% at Palver, the most negative balance of the window.`,
  'candidates[0].fracos[1]':
    `REJECTION at 48% at BTG/Nexus and 52% at Palver, and at Palver he is the MORE rejected of the two, flipping the order that Nexus shows.`,
  'candidates[0].fracos[2]':
    `In the Palver runoff the tie at 46% x 46% is the worst runoff scenario any national poll of the window has given him.`,
  'candidates[0].fracos[3]':
    `The market gap had been narrowing: it fell on six of the last seven sessions, from +38.90pp on Aug 3 to +36.55pp at the Aug 9 reading.`,
  'candidates[0].fracos[4]':
    `Series caveat that still holds: 13 of the 89 days had a price equal to or above 63.50%, so the current level is not extreme.`,
  'candidates[0].analise':
    `THE DAY BROUGHT POLLING, NOT PRICE, and that is where the reading has to start. Two national polls came out and they measure the same contest with different results: BTG/Nexus, by telephone, gives 40% x 35% in the first round and 47% x 44% in the runoff; Palver, online and with n=5,000, gives 44% x 40% and a tie at 46% x 46%. Added to the two from Aug 5, that is four national polls in six days, and he appears between 39% and 44%. WHAT THE WITHIN-HOUSE COMPARISON SHOWS is the reverse of what last week showed: on Aug 3 BTG/Nexus had tightened the first round from 9pp to 4pp, and now it has widened again, to 5pp, with both giving way and the opponent giving way more. In the runoff at the same house the distance went from 1pp to 3pp. APPROVAL MOVED THE OTHER WAY, and in both readings: 46% against 49% at Nexus and 45% against 55% at Palver. Across five readings in eight days the balance runs from 1pp positive to 10pp negative, and disapproval on its own runs from 47% to 55%. ON PRICE there is nothing new to record: the most recent confirmed value is the one from Aug 9 at 17:34 UTC, 63.50% with USD 8.18M in cumulative volume, and this page attributes no movement to today because there is no reading from today to compare with. THE CROSSING THAT MATTERS is one of direction: in the same week in which the market gap narrowed on six of the last seven sessions, the BTG/Nexus gap widened in both rounds. The two instruments moved in opposite directions, and the panel records that without saying which one is right.`,

  // ================= FLÁVIO =================
  'candidates[1].header':
    `THE SPREAD BETWEEN HOUSES IS HIS NUMBER TODAY: across the four national polls since Aug 5 he comes in at 30%, 35%, 35% and 40% in the first round, a 10pp band, double the leader's. Today's two give 35% at BTG/Nexus and 40% at Palver. Price from the ${PRICE}: 26.95% (vol USD 8.09M cumulative), with no new reading on Aug 10.`,
  'candidates[1].fortes[0]':
    `Today's Palver brings the best result any national poll has given him in the window: 40% in the first round and a TIE at 46% x 46% in the runoff.`,
  'candidates[1].fortes[1]':
    `It is the first time in the window that a national poll does not show him losing the runoff to Lula, even if by a tie on the number rather than an advantage.`,
  'candidates[1].fortes[2]':
    `At BTG/Nexus the runoff distance is 3pp, which the round's own release treats as a technical tie inside the 2pp margin.`,
  'candidates[1].fortes[3]':
    `That same BTG/Nexus round also points to him tying in the Lula against Caiado matchup, which suggests the runoff problem is not exclusive to his name.`,
  'candidates[1].fortes[4]':
    `Price from the ${PRICE} at 26.95%, with USD 8.09M in cumulative volume, and 30 of the 89 days in the series had a value equal to or above that.`,
  'candidates[1].fracos[0]':
    `THE 10pp BAND BETWEEN HOUSES IS HIS READING PROBLEM: 30% at Quaest, 35% at Ideia, 35% at BTG/Nexus and 40% at Palver, and choosing one of them is choosing the conclusion.`,
  'candidates[1].fracos[1]':
    `At BTG/Nexus he GAVE UP 2pp against that house's own Aug 3 round, from 37% to 35%, and the first round gap widened from 4pp to 5pp because of it.`,
  'candidates[1].fracos[2]':
    `The 5pp difference in the BTG/Nexus first round falls OUTSIDE the 2pp margin, which means it is not a tie there.`,
  'candidates[1].fracos[3]':
    `REJECTION at 50% at BTG/Nexus, the highest of the round, and at 51% at Palver, where he sits behind only the leader.`,
  'candidates[1].fracos[4]':
    `His confirmed price stays at 26.95%, and the 89-day series has a peak of 43.30%, from May 12, with a floor of 22.00%, from Jul 3.`,
  'candidates[1].analise':
    `THE MOST INFORMATIVE FIGURE ABOUT HIM TODAY IS NOT A NUMBER, IT IS A RANGE. Across the four national polls published since Aug 5 he comes in at 30%, 35%, 35% and 40% in the first round, and the distance between the highest and the lowest reading reaches 10pp. On the leader's side the same band is 5pp. In other words, the measurement uncertainty is concentrated on him, and any headline that fixes a value is choosing a house. TODAY'S TWO ILLUSTRATE THE DISTANCE: BTG/Nexus, by telephone, gives 35% and a runoff defeat by 47% x 44%; Palver, online, gives 40% and a TIE at 46% x 46%, which is the best scenario he has obtained in the window. WITHIN HIS OWN HOUSE the move went against him: BTG/Nexus had 37% on Aug 3 and now has 35%, and the first round gap widened from 4pp to 5pp precisely because of that. It is the reverse of what the same series showed a week ago, when the tightening from 9pp to 4pp was driven by a rise of his. REJECTION REMAINS THE CEILING: 50% at Nexus and 51% at Palver, and in both he sits at the top or one point from it. ON PRICE there is no new reading on Aug 10; the confirmed value is the one from Aug 9 at 17:34 UTC, 26.95% with USD 8.09M cumulative. ON THE BOARD, Folha de S.Paulo reported on Aug 10 that the Speaker of the lower house declared support for his opponent after his own party rejected a coalition with him, and Estadão and O Globo published a state-level Ideia/ACSP cut in São Paulo in which he takes 44% against 39% in the runoff, data that is state in scope and therefore does not enter the national panel.`,

  // ================= RENAN =================
  'candidates[2].header':
    `THE METHOD CASE OF THE DAY IS HIM, AND IT WAS THE INSTITUTE THAT DECLARED IT: Palver, online, gives him 10%, against 4% at BTG/Nexus by telephone on the same day, and 4% and 4.7% in the two from Aug 5. Palver itself assessed that the digital format may have boosted his performance. Price from the ${PRICE}: 7.80% (vol USD 9.27M cumulative).`,
  'candidates[2].fortes[0]':
    `Today's Palver gives him 10% and places him ALONE in third, the best result he has had in any national poll of the window.`,
  'candidates[2].fortes[1]':
    `Largest cumulative volume in the presidential book among the names above 1%, with USD 9.27M at the Aug 9 reading, above the leader's own volume.`,
  'candidates[2].fortes[2]':
    `The market price, at 7.80%, sits ABOVE every telephone and in-person reading, which fall between 4% and 4.7%.`,
  'candidates[2].fortes[3]':
    `He appears ahead of Caiado and of Zema at Palver, flipping the order that the Aug 5 Ideia showed, in which Caiado had 5.7% against his 4.7%.`,
  'candidates[2].fortes[4]':
    `The method caveat came from the house that measured him high, not from those that measure him low, which reduces the chance that the figure is a one-sided reading.`,
  'candidates[2].fracos[0]':
    `PALVER ITSELF DECLARED THE CAVEAT: it assessed that the digital format may have boosted his performance, since he keeps an active base in that environment, and said it is testing approaches to reduce that effect in online polls.`,
  'candidates[2].fracos[1]':
    `In the three telephone or in-person national polls of the window he falls between 4% and 4.7%, and the 10% reading is the only one outside that range.`,
  'candidates[2].fracos[2]':
    `The market prices him near the FLOOR of his own series: 84 of the 88 days had a value equal to or above the current one, and the period low was 6.80%, on Aug 6.`,
  'candidates[2].fracos[3]':
    `He loses the runoffs comfortably in the rounds that test him, and in the Aug 5 Quaest the defeat is 45% x 35%.`,
  'candidates[2].fracos[4]':
    `The press on Aug 10 published two pieces questioning whether online polling overstates his performance, which makes the 10% figure a number under public discussion rather than a consolidated level.`,
  'candidates[2].analise':
    `THIS IS THE CLEANEST CROSSING THE PANEL CAN SHOW, AND IT DEPENDS ON NO JUDGEMENT AT ALL. The same name, in the same week, comes in at 4% at Genial/Quaest in person on Aug 5, at 4.7% at Meio/Ideia by telephone the same day, at 4% at BTG/Nexus by telephone today, and at 10% at Palver over the internet, also today. The difference between the highest and the lowest reading is 6pp for a candidate that no house puts into double digits by telephone. THE CAVEAT IS NOT OURS, IT IS THE HOUSE'S: Palver assessed that the digital format may have boosted his performance, since he keeps an active base in that environment, and said it is testing approaches to reduce that effect in online polls. The panel repeats its declaration rather than judging the number, because measuring and judging are different things. AND THE PRICE SITS BETWEEN THE TWO METHODS: 7.80% at the confirmed Aug 9 reading, above the 4% to 4.7% of telephone and in person, below the 10% of the internet. BUT THE PRICE IS NOT HIGH IN HIS OWN HISTORY: 84 of the 88 days in the series had a value equal to or above it, with a maximum of 17.90% on Jun 9. In other words, he is near the market floor at the same time as he records his ceiling in the polls, and both things are true in the same week.`,

  // ================= CAIADO / HADDAD / ZEMA =================
  'candidates[3].header':
    `CAIADO TIES WITH LULA IN THE BTG/NEXUS RUNOFF, and that is the figure that changes the reading on him: the same round that gives a 47% x 44% defeat to the runner-up points to a tie in the matchup against Caiado. In the first round he has 5% at Nexus. Prices from the ${PRICE}: Caiado 1.25% (vol USD 5.60M), Zema 0.45% (vol USD 5.02M) and Haddad 0.05%.`,
  'candidates[3].fortes[0]':
    `CAIADO TIES WITH LULA in today's BTG/Nexus runoff, according to the round's release, and he is the only name outside the top two to manage that in the window.`,
  'candidates[3].fortes[1]':
    `Caiado has 5% in the BTG/Nexus first round, ahead of Renan Santos, on 4%, and of Zema, on 3%.`,
  'candidates[3].fortes[2]':
    `In the Aug 5 Meio/Ideia, Caiado is the opponent who comes closest in the runoff, with 40% against 48.5%.`,
  'candidates[3].fortes[3]':
    `Zema registered his candidacy with the ${G('TSE', 'tse')} on Aug 6 and remains the only one of the chasing pack with a registration filed, in a window that closes on Aug 15.`,
  'candidates[3].fortes[4]':
    `Today's Palver does not test Caiado or Zema in the published scenario, so the absence of a reading is recorded as an absence, and not filled in with old data.`,
  'candidates[3].fracos[0]':
    `Caiado's price, at 1.25% in the Aug 9 reading, is dozens of times smaller than his declared voting intention, which runs from 4% to 5.7% across the national polls of the window.`,
  'candidates[3].fracos[1]':
    `Zema stays at 0.45%, BELOW the 0.5% cut the panel uses to separate price from noise.`,
  'candidates[3].fracos[2]':
    `Palver, with the largest sample of the day, does not include them in the published scenario, which shrinks the basis for comparison between houses for the two of them.`,
  'candidates[3].fracos[3]':
    `HADDAD IS NOT A PRESIDENTIAL CANDIDATE and is running for the governorship of São Paulo, so any scenario that includes him is a polling hypothesis, not a candidacy under way.`,
  'candidates[3].fracos[4]':
    `None of the three appears in the secondary books at a price that supports a reading of movement: the contracts are thin and any change in them calls for a caveat.`,
  'candidates[3].analise':
    `THE FRESH FIGURE BELONGS TO CAIADO AND IT COMES FROM THE RUNOFF. Today's BTG/Nexus points to Lula tying with him, in the same round in which the leader beats the runner-up by 47% x 44%. Added to the 40% against 48.5% at Meio/Ideia on Aug 5, the picture is of a third name who looks better in the head-to-head than off the starting line, and it is exactly the opposite of what the price shows: 1.25% at the confirmed Aug 9 reading, against 4% to 5.7% of declared intention. THE PANEL DOES NOT SUBTRACT ONE FROM THE OTHER, because the two quantities are not the same: the polling measures intention now and the contract measures the probability of winning at the end. What the panel records is that the distance between them is the largest of the chasing pack. ZEMA stays at 0.45% and below the 0.5% cut the panel uses to separate price from noise, and the reading on him is suspended while he sits in that band. ABSENCE IS ALSO INFORMATION: Palver, which is the largest sample of the day with n=5,000, published no scenario including the two of them, and the panel records the absence rather than repeating an old number as if it were fresh. HADDAD remains without polling and without a presidential candidacy, running for the governorship of São Paulo.`,

  // ================= QUADRO COMPARATIVO =================
  'quadroComparativo[0].p':
    `TWO NEW NATIONAL POLLS ON Aug 10. BTG/Nexus (n=2,001, telephone, BR-08428/2026): 40% in the first round and 47% x 44% in the runoff. Palver (n=5,000, online, BR-06596/2026): 44% and a tie at 46% x 46%. Across the four rounds since Aug 5 he runs from 39% to 44%. APPROVAL worsened in both: 46% x 49% and 45% x 55%.`,
  'quadroComparativo[0].m': `63.50% (vol USD 8.18M cumulative), ${PRICE}`,
  'quadroComparativo[0].t':
    `NO NEW PRICE READING ON Aug 10. The most recent confirmed value is still the one from Aug 9 at 17:34 UTC. In the week up to that point, the gap over Flávio narrowed on six of the seven sessions, from +38.90pp on Aug 3 to +36.55pp.`,
  'quadroComparativo[0].s':
    `55 days from the election. The campaigns launched their slogans on Aug 10, and he and Alckmin presented a government programme with an emphasis on sovereignty, the economy, security and the environment. Folha de S.Paulo reported that the Speaker of the lower house backed him, after the Speaker's party rejected a coalition with his opponent. Official launch on Aug 16, at Vila Euclides.`,

  'quadroComparativo[1].p':
    `TWO NEW NATIONAL POLLS. BTG/Nexus: 35% in the first round, against 37% in that house's own Aug 3 round, and a 47% x 44% runoff defeat. Palver: 40% and a TIE at 46% x 46%, the best scenario he has obtained in the window. Across the four rounds since Aug 5 he runs from 30% to 40%, a 10pp band. REJECTION of 50% and 51%.`,
  'quadroComparativo[1].m': `26.95% (vol USD 8.09M), ${PRICE}`,
  'quadroComparativo[1].t':
    `NO NEW PRICE READING ON Aug 10. The confirmed value is still the one from Aug 9 at 17:34 UTC, which was the third day at the same level. In the runner-up book, the last confirmed value is 81.50%.`,
  'quadroComparativo[1].s':
    `Estadão and O Globo published a STATE-level Ideia/ACSP cut in São Paulo, with 44% against 39% in the runoff, data that does not enter the national panel on grounds of scope. His running mate remains on the list of Pix earmarks that Dino ordered investigated. A Quaest round indicates that Milei's endorsement of him raises the chance of a vote for his opponent.`,

  'quadroComparativo[2].p':
    `THE METHOD CASE OF THE WEEK. Palver, online: 10%, alone in third. BTG/Nexus, telephone, on the same day: 4%. Quaest in person on Aug 5: 4%. Ideia by telephone: 4.7%. PALVER ITSELF declared that the digital format may have boosted his performance and that it is testing approaches to reduce the effect.`,
  'quadroComparativo[2].m': `7.80% (vol USD 9.27M), ${PRICE}`,
  'quadroComparativo[2].t':
    `NO NEW PRICE READING ON Aug 10. The confirmed Aug 9 value, 7.80%, sits BETWEEN the two methods: above the 4% to 4.7% of telephone and in person, below the 10% of the internet. And it is near the floor of his own series: 84 of the 88 days had a value equal to or above it.`,
  'quadroComparativo[2].s':
    `Largest cumulative volume in the presidential book among the names above 1%, with USD 9.27M. Two pieces on Aug 10, in UOL and CartaCapital, discuss whether online polling overstates his performance.`,

  'quadroComparativo[3].p':
    `FRESH FIGURE IN THE RUNOFF: today's BTG/Nexus points to a TIE between Lula and him, in the same round in which the leader beats the runner-up by 47% x 44%. In the first round he has 5%, ahead of Renan Santos and of Zema. Palver does not test him in the published scenario, and the absence is recorded as an absence.`,
  'quadroComparativo[3].m': `1.25% (vol USD 5.60M), ${PRICE}`,
  'quadroComparativo[3].t':
    `NO NEW PRICE READING ON Aug 10. The confirmed value is the one from Aug 9, which closed the third consecutive day of falls in both books, with 25.50% in the third place one.`,
  'quadroComparativo[3].s':
    `He is the name with the LARGEST distance between polling and price in the chasing pack: 4% to 5.7% of declared intention against 1.25% of priced probability. The panel records the distance without subtracting one quantity from the other, because they measure different things.`,

  'quadroComparativo[4].p':
    `Neither of today's two rounds tests him in the published scenario. What still stands is the 3% at BTG/Nexus in the first round, the 2% at Quaest and the 2.6% at Ideia, both from Aug 5. In the runoffs of those two, 34% against 46% and 37% against 48.5%.`,
  'quadroComparativo[4].m': `0.45% (vol USD 5.02M), ${PRICE}`,
  'quadroComparativo[4].t':
    `NO NEW PRICE READING ON Aug 10. The confirmed Aug 9 value, 0.45%, is BELOW the 0.5% cut the panel uses to separate price from noise, and the reading on him is suspended while he sits in that band.`,
  'quadroComparativo[4].s':
    `He registered his candidacy with the ${G('TSE', 'tse')} on Aug 6, declaring R$ 178.7 million in assets, and remains the only one of the chasing pack with a registration filed. The window closes on Aug 15.`,

  'quadroComparativo[5].m': `3.60% (vol USD 83 thousand), ${PRICE}`,
  'quadroComparativo[5].t':
    `NO NEW PRICE READING ON Aug 10. The confirmed value is the one from Aug 9, 3.60%. It remains the thinnest contract among those tracked, and any movement in it calls for a reading with that caveat.`,
  'quadroComparativo[5].s':
    `What still stands is the Dino decision ordering the Federal Police to investigate R$ 55.4 million in Pix earmarks flagged by the TCU. In the Master case, Poder360 published on Aug 10 that two ministers favoured a deal that enriched Vorcaro, and a state assembly is holding up the opening of a CPI into a pension institute's investments in the bank.`,

  cruzamento:
    `THE DAY BROUGHT POLLING AND DID NOT BRING PRICE, AND THE READING STARTS THERE. The values on this page are from the ${PRICE}, because there is no new price reading on Aug 10, and so no line here attributes price movement to today. TWO NATIONAL POLLS CAME OUT, and what they show together is worth more than each on its own. BTG/Nexus, by telephone, n=2,001, gives a first round of 40% x 35% and a runoff of 47% x 44%. Palver, which debuts on the panel with n=5,000 and an online questionnaire, gives 44% x 40% and a TIE at 46% x 46%. Both measured the same week. THE FIRST THING TO RECORD IS THE RANGE, NOT THE POINT: adding the four national polls since Aug 5, Lula runs from 39% to 44% and Flávio runs from 30% to 40%. The measurement uncertainty is concentrated on the runner-up, with double the amplitude of the leader, and in the runoff the distance between them runs from 0pp to 5.5pp depending on the house. Choosing one poll is choosing one conclusion, and that is why the panel publishes the set. THE SECOND IS A METHOD EFFECT DECLARED BY THE VERY HOUSE THAT PRODUCED IT. Renan Santos comes in at 4% at Quaest in person, 4.7% at Ideia by telephone, 4% at BTG/Nexus by telephone and 10% at Palver over the internet. Palver assessed that the digital format may have boosted his performance, since he keeps an active base in that environment, and said it is testing approaches to reduce that effect. His confirmed price, 7.80%, sits BETWEEN the two methods. And at the same time near the floor of his own series, with 84 of the 88 days at a value equal to or above it: ceiling in the polling and floor in the price, in the same week. THE THIRD IS ONE OF DIRECTION, AND IT IS THE CENTRAL CROSSING OF THE ROUND. In the week in which the market gap NARROWED, falling on six of the last seven sessions, from +38.90pp on Aug 3 to +36.55pp on Aug 9, the BTG/Nexus gap WIDENED inside its own house, from 4pp to 5pp in the first round and from 1pp to 3pp in the runoff. The two instruments moved in opposite directions over the same contest and in the same window. The panel records the crossing and does not say which one is right, because it does not know, and because saying so would trade measurement for opinion. THE FOURTH IS APPROVAL, which worsened in both of today's readings and widened the spread: 46% x 49% at BTG/Nexus, against 47% x 48% in that house's own Aug 3 round, and 45% x 55% at Palver. Across five readings in eight days the balance runs from 1pp positive to 10pp negative and disapproval on its own runs from 47% to 55%. Before, the SIGN of the balance already depended on the house; now the SIZE depends on it too.`,
})
