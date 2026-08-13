/**
 * Mapa EN de 13/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 13".
 */
import { construir } from '../build-locale-json'

const S = 'last confirmed reading, from Aug 12, 16:41 BRT'
const SEM = `NO NEW MARKET READING ON Aug 13. The value shown is from the ${S}.`

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 13, 52 days from the first round. NEW NATIONAL POLL: PoderData/Aya (n=2,400, telephone, fieldwork Aug 9 to Aug 12, registration BR-06868/2026), the first since Aug 11. PRICES: there is no new market reading on Aug 13, and the values shown are from the ${S}. 📅 Quaest publishes on Aug 14 and Nexus on Aug 17.`,

  'candidates[0].header':
    `NEW NATIONAL POLL ON Aug 13: PoderData/Aya (n=2,400, telephone, fieldwork Aug 9 to Aug 12, registration BR-06868/2026) with 41% in the first round and 46% x 45% in the runoff. Against the house itself, the first round repeats the 41% x 35% of Jul 30 and the runoff narrows from 3pp to 1pp. Rejection at 48%, tied with his opponent's. No new market reading on Aug 13: the price shown is from the ${S}.`,
  'candidates[0].fortes[1]':
    `CNT/MDA of Aug 11 remains his best reading of the window: 42.4% in the first round, with a 13.7pp lead, and 48% x 39% in the runoff.`,
  'candidates[0].fortes[4]':
    `Price from the ${S}, at 63.50%, with USD 8.22M cumulative. Among the 173 points recorded since May 16, 29 had a value equal to or above it, with a peak of 66.50% on Aug 1 at 23:00.`,
  'candidates[0].fracos[3]':
    `With no new market reading on Aug 13, the distance over the runner-up has no fresh measurement on this day. The last confirmed distance is that of Aug 12, 16:41 BRT.`,
  'candidates[0].fracos[4]':
    `Series caveat, measured over all 173 points recorded since May 16 and not over the last point of each day: 29 had a price equal to or above 63.50%, so the current level is not an extreme of the series.`,
  'candidates[0].analise':
    `THE DAY BROUGHT A NEW NATIONAL POLL AND NO NEW MARKET READING, and the day's reading is entirely in the polling. PoderData/Aya published the first national poll since Aug 11, and the finding is in the house compared with itself, which is the comparison that holds method, sample and questionnaire constant. In the first round the distance between him and the runner-up has not moved in four weeks: 6pp on Jul 16, 6pp on Jul 30 and 6pp now, with both repeating exactly the same percentages as the previous round. In the runoff, over the same span, the distance fell from 3pp to 1pp, which is inside the poll's 2pp margin. One round frozen and the other narrowing, at the same house. Rejection came out tied at 48% for the top two, which removes the basis for any easy reading about who has more room to grow. He launched his re-election campaign at Vila Euclides Stadium, in São Bernardo, according to TVT News and G1. SERIES CAVEAT, measured over all 173 points recorded since May 16 and not over the last of each day: 29 had a value equal to or above 63.50%, with a peak of 66.50% on Aug 1 at 23:00.`,

  'candidates[1].header':
    `NEW NATIONAL POLL ON Aug 13: PoderData/Aya gives him 35% in the first round, the same figure the house gave him on Jul 30, and 45% in the runoff, against 43% in the previous round, 1pp from the leader. Rejection at 48%, exactly equal to his. No new market reading on Aug 13: the price shown is from the ${S}.`,
  'candidates[1].fortes[0]':
    `Gerp of Aug 11 remains the first national poll of the window to put him ahead in the runoff, with 45% against 43%, and PoderData of Aug 13 leaves him 1pp away, inside the margin.`,
  'candidates[1].fortes[4]':
    `Price from the ${S}, at 27.65%, with USD 8.13M cumulative. Among the 172 points recorded since May 16, 51 had a value equal to or above it, with a peak of 33.20% on Jun 2 at 19:30 and a floor of 22.00% on Jul 3 at 01:00.`,
  'candidates[1].fracos[4]':
    `PoderData keeps him frozen in the first round, at the same 35% of Jul 30, and his advance on the day is only in the runoff. Getting close in the runoff and growing in the first round are different things, and only the second would change the distance that separates the two at the start.`,
  'candidates[1].analise':
    `🔴 THE FACT OF THE DAY ABOUT HIM IS NEITHER PRICE NOR POLL, IT IS REGISTRATION. Folha de S.Paulo and G1 report that he appears in the TSE records affiliated with Missão, the party Renan Santos runs for, without his knowledge, and that this blocked the formal registration of his presidential candidacy by the PL. G1 records that the PL speaks of fraud. The registration deadline closes on Aug 15, which leaves two days. IN THE POLLING, PoderData keeps him frozen in the first round, at the same 35% of Jul 30, and brings him closer in the runoff, from 43% to 45%, leaving the distance at 1pp, inside the margin. Exame summarised it as growth for him in the runoff. REJECTION TIED AT 48% is the figure the panel highlights, because it prevents the reading that either of the two would have a higher ceiling. ⚠️ NO CAUSE IS ATTRIBUTED: there is no new market reading on Aug 13 to compare with the registration episode, and the panel does not convert a coincidence of dates into a relationship. SERIES CAVEAT, over the 172 points recorded since May 16: 51 had a value equal to or above 27.65%, with a peak of 33.20% on Jun 2 at 19:30.`,

  'candidates[2].header':
    `PoderData of Aug 13 tested him in the runoff and he is the ONLY one of the chasing pack the leader beats in that scenario, according to Bnews, while tying with the other three. His first-round percentages in this round did not appear in the articles captured. No new market reading on Aug 13: the price shown is from the ${S}.`,
  'candidates[2].fortes[0]':
    `He keeps the largest cumulative volume in the presidential book among names above 1%, with USD 9.48M at the ${S}.`,
  'candidates[2].fortes[1]':
    `Series caveat: over the window recorded since May 16 his price spent most of the time at a level equal to or above the current one, with a floor of 6.80% on Aug 6, so today's value sits near the low part of his own series.`,
  'candidates[2].analise':
    `THE DAY SEPARATED HIM FROM THE REST OF THE CHASING PACK, AND FOR THE WORSE. PoderData tested four names in the runoff against the leader and, according to CNN Brasil and Bnews, three tied and only he lost. It is the first time in the window the pack has split this way, and the split does not follow the price: he is priced well above Caiado and Zema, who tied. ⚠️ His first-round percentages in this round did not appear in the articles captured, and the panel does not estimate them: the 5% from Gerp of Aug 11, the 4% from Genial/Quaest and BTG/Nexus, the 4.7% from Meio/Ideia and the 10% from Palver online still stand. THE METHOD EFFECT REMAINS THE READING ON HIM, with the same name running from 4% to 10% depending on the interview environment, a caveat declared by Palver itself. ON THE BOARD, Gazeta do Povo published his government plan, and the party he runs for is the same one in which the runner-up appeared affiliated without his knowledge, in the episode that blocked that candidate's registration.`,

  'candidates[3].header':
    `⭐ THE CHASING PACK HAD ITS BEST DAY OF THE WINDOW, AND IT CAME FROM THE POLLING. According to CNN Brasil and Bnews, PoderData of Aug 13 puts CAIADO and ZEMA in a TIE with the leader in the runoff. For Caiado it is the second tie in four days, after BTG/Nexus of Aug 10. No new market reading on Aug 13: the prices shown are from the ${S}.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 0.95% (vol USD 5.66M cumulative, ${S}) | TIES with the leader in PoderData's runoff of Aug 13 | polling in force: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5.7%, BTG/Nexus 5%`,
  'candidates[3].caiado.fortes':
    `TIES WITH THE LEADER IN THE RUNOFF of PoderData of Aug 13, according to CNN Brasil and Bnews, his second tie in four days after BTG/Nexus of Aug 10. It is the best result any name outside the top two has been getting in the window.`,
  'candidates[3].caiado.fracos':
    `THE DISTANCE BETWEEN POLLING AND PRICE REMAINS THE WIDEST OF THE CHASING PACK IN THIS WINDOW: from 4% to 5.7% of declared intention against 0.95% priced at the last confirmed reading. His first-round percentages in the round of Aug 13 did not appear in the articles captured, and the panel records the absence instead of estimating.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.15% (vol USD 7.06M cumulative, ${S}) | NOT tested by the national polls in force, because he is running for the governorship of São Paulo`,
  'candidates[3].haddad.fortes':
    `His cumulative volume is still larger than that of several names priced above him, which keeps the contract with trading backing despite the low price.`,
  'candidates[3].haddad.fracos':
    `PoderData of Aug 13 does not test him, and no national poll in the window tests him in a presidential scenario. THE CAVEAT REMAINS AND MUST BE STATED PLAINLY: he is NOT a candidate for the presidency, he is running for the governorship of São Paulo, and any scenario including him is a polling hypothesis, not a candidacy under way.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.35% (vol USD 5.07M cumulative, ${S}) | TIES with the leader in PoderData's runoff of Aug 13 | polling in force: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2.6%, BTG/Nexus 3%`,
  'candidates[3].zema.fortes':
    `TIES WITH THE LEADER IN THE RUNOFF for the first time in the window, according to CNN Brasil and Bnews. He remains the only one of the chasing pack with a candidacy registration filed at the TSE, on Aug 6 with R$ 178.7 million declared, in a window that closes on Aug 15.`,
  'candidates[3].zema.fracos':
    `THE PRICE REMAINS BELOW THE 0.5% CUT the panel uses to separate price from noise, and in that range a move does not sustain interpretation. His first-round percentages in the round of Aug 13 did not appear in the articles captured, and he remains the name of the chasing pack with the lowest declared intention among those the houses test.`,
  'candidates[3].analise':
    `⭐ THE STRONGEST CONTRAST OF THE DAY IS HERE, AND IT SETS POLLING AGAINST PRICE. Caiado and Zema TIE with the leader in PoderData's runoff, according to CNN Brasil and Bnews, and the winning prices in force for the two are 0.95% and 0.35%. They are different questions and the panel does not subtract them: tying in a hypothetical runoff measures something other than winning the election, and the distance between the two measurements is precisely what this section exists to show. For Caiado it is the second tie in four days, after BTG/Nexus of Aug 10. ⚠️ The first-round percentages of these names in this round did not appear in the articles captured, and the panel records an absence instead of estimating. ON THE BOARD, Caiado attacked in São Paulo the records of the top two and criticised the conduct of the Supreme Court, according to Goiás 246; Zema remains the only one of the pack with registration filed at the TSE, and the deadline for the others closes on Aug 15.`,
  'candidates[3].fortes[0]':
    `PoderData of Aug 13 puts Caiado and Zema in a tie with the leader in the runoff, according to CNN Brasil and Bnews, and Caiado stays ahead of Zema in every round that publishes the first round for both.`,
  'candidates[3].fortes[4]':
    `Palver of Aug 10 does not test Caiado or Zema in the scenario published, so the absence of a reading is recorded as an absence, and not filled in by estimate.`,
  'candidates[3].fracos[2]':
    `TWO OF THE THREE NATIONAL POLLS OF Aug 11 did not publish the full field, and PoderData of Aug 13 did not have their first-round percentages in the articles captured, so the basis for comparison between houses on them remains narrow.`,

  'quadroComparativo[0].p':
    `NEW NATIONAL POLL ON Aug 13. PoderData/Aya (n=2,400, telephone, fieldwork Aug 9 to Aug 12, BR-06868/2026): 41% in the first round and 46% x 45% in the runoff. Against the house itself, the first round repeats 41% x 35% of Jul 30 and the runoff narrows from 3pp to 1pp. Rejection at 48%, equal to his opponent's. Personal approval at 43% against 50% disapproval.`,
  'quadroComparativo[0].t':
    `${SEM} WHAT CHANGED TODAY CAME FROM THE POLLING, NOT FROM THE PRICE: PoderData repeats the house's own first round and narrows the runoff from 3pp to 1pp. SERIES CAVEAT: among the 173 points recorded since May 16, 29 had a value equal to or above 63.50%, with a peak of 66.50% on Aug 1 at 23:00 and a floor of 39.50% on May 26.`,
  'quadroComparativo[0].s':
    `52 days from the election. He launched his re-election campaign at Vila Euclides Stadium, in São Bernardo, the cradle of trade unionism in the ABC region, according to TVT News and G1, on the same day his opponent opened his in Rio. 📅 Quaest publishes on Aug 14 and Nexus on Aug 17.`,

  'quadroComparativo[1].p':
    `NEW NATIONAL POLL ON Aug 13. PoderData/Aya gives him 35% in the first round, the same figure the house gave him on Jul 30, and 45% in the runoff, against 43% in the previous round. Rejection at 48%, exactly equal to the leader's. The 28.7% from CNT/MDA, the 34.1% from Futura and the 38% from Gerp, of Aug 11, still stand.`,
  'quadroComparativo[1].t':
    `${SEM} IN THE POLLING he repeated the house's own 35% in the first round and rose from 43% to 45% in the runoff. SERIES CAVEAT: among the 172 points recorded since May 16, 51 had a value equal to or above 27.65%, with a peak of 33.20% on Jun 2 at 19:30 and a floor of 22.00% on Jul 3 at 01:00.`,
  'quadroComparativo[1].s':
    `🔴 THE FACT OF THE DAY IS HIS REGISTRATION. Folha de S.Paulo and G1 report that he appears at the TSE affiliated with Missão, the party of the MBL and of Renan Santos, without his knowledge, which disrupted the formal registration of his presidential candidacy by the PL. G1 records that the PL speaks of fraud. The registration deadline closes on Aug 15. He opened his campaign in Rio and again criticised Justice Moraes after an operation against a journalist's source.`,

  'quadroComparativo[2].p':
    `PoderData of Aug 13 tested him in the runoff and he is the only one of the chasing pack the leader BEATS in that scenario, according to Bnews, while tying with the other three. His first-round percentages in this round did not appear in the articles captured. The 5% from Gerp, the 4% from Genial/Quaest and BTG/Nexus, the 4.7% from Meio/Ideia and the 10% from Palver online still stand.`,
  'quadroComparativo[2].t':
    `${SEM} He keeps the largest cumulative volume in the book among names above 1%.`,
  'quadroComparativo[2].s':
    `Gazeta do Povo published his government plan. The party he runs for, Missão, is the same one in which the PL's candidate appeared affiliated without his knowledge, according to Folha and G1, in the episode that blocked that candidate's presidential registration.`,

  'quadroComparativo[3].p':
    `PoderData of Aug 13 puts him in a TIE with the leader in the runoff, according to CNN Brasil and Bnews, his second tie in four days after BTG/Nexus of Aug 10. The first-round percentages in this round did not appear in the articles captured, and the 4% from Gerp and Genial/Quaest, the 5.7% from Meio/Ideia and the 5% from BTG/Nexus still stand.`,
  'quadroComparativo[3].t':
    `${SEM} The distance between polling and price remains the widest of the chasing pack in this window: from 4% to 5.7% of declared intention against 0.95% priced, and now with a runoff tie at two different houses in four days.`,
  'quadroComparativo[3].s':
    `In São Paulo, according to Goiás 246, he attacked the records of the leader and of the runner-up and criticised the conduct of the Supreme Court.`,

  'quadroComparativo[4].p':
    `PoderData of Aug 13 puts him in a TIE with the leader in the runoff, according to CNN Brasil and Bnews, and it is the first time in the window he appears in that condition. The first-round percentages in this round did not appear in the articles captured, and the 2% from Gerp, the 3% from BTG/Nexus, the 2% from Genial/Quaest and the 2.6% from Meio/Ideia still stand.`,
  'quadroComparativo[4].t':
    `${SEM} It remains below the 0.5% cut the panel uses to separate price from noise. ⚠️ THE CONTRAST OF THE DAY IS HIS: he ties with the leader in the runoff and is priced at 0.35%.`,
  'quadroComparativo[4].s':
    `He remains the only one of the chasing pack with a registration already filed at the TSE, on Aug 6 with R$ 178.7 million declared. The deadline for the others closes on Aug 15, and from then on the absence of a registration becomes a fact, not a pending item.`,

  'quadroComparativo[5].p':
    `No polling. Market on the impeachment of a Supreme Court justice before 2027.`,
  'quadroComparativo[5].t':
    `${SEM} It remains the thinnest contract among those tracked, and a move in it requires that caveat.`,
  'quadroComparativo[5].s':
    `The judicial thread of the day is the Federal Police operation against a journalist's source, based on an exchange of messages that underpinned reports about Justice Dino. He said he is the target of aggression and injustice, according to O Globo, and Justice Moraes's decision in the case drew a reaction from professional bodies and doubts among specialists, according to Folha. The Aug 12 order still stands, in which Moraes, Dino, Gilmar Mendes and Zanin instructed seven courts to return penduricalhos.`,

  'quadroComparativo[0].m': `63.50% (vol USD 8.22M cumulative), ${S}`,
  'quadroComparativo[1].m': `27.65% (vol USD 8.13M), ${S}`,
  'quadroComparativo[2].m': `7.45% (vol USD 9.48M), ${S}`,
  'quadroComparativo[3].m': `0.95% (vol USD 5.66M), ${S}`,
  'quadroComparativo[4].m': `0.35% (vol USD 5.07M), ${S}`,
  'quadroComparativo[5].m': `3.90% (vol USD 83 thousand), ${S}`,

  cruzamento:
    `THE DAY WAS DECIDED IN THE POLLING AND AT THE ELECTORAL REGISTRY, NOT IN THE PRICE. First, PoderData/Aya published the first national poll since Aug 11 and the finding is in the house compared with itself: in the first round the distance between the top two has not moved in four weeks, 6pp on Jul 16, 6pp on Jul 30 and 6pp now, with both repeating exactly the same percentages as the previous round; in the runoff, over the same span, the distance fell from 3pp to 1pp. Same house, same method, same sample and same TSE registration, with one round frozen and the other narrowing. Second, rejection came out tied at 48% for the top two, which removes the basis for any easy reading about who has more room to grow. Third, and it is the political fact of the day, Folha de S.Paulo and G1 report that the runner-up appears in the TSE records affiliated with Missão, the party the fourth-placed candidate runs for, without his knowledge, and that this blocked the formal registration of his presidential candidacy by the PL, which speaks of fraud. The registration deadline closes on Aug 15. ⚠️ THE PANEL ATTRIBUTES NO CAUSE: there is no measurement here linking the registration episode to a price move, and there is no new market reading on Aug 13 to compare. The prices shown on this page are from the ${S}.`,
})
