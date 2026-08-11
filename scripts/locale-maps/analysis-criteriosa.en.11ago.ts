/**
 * Mapa EN de 11/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 11".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 11, 16:27 BRT'

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 11, 54 days from the first round. THREE NEW NATIONAL POLLS and they disagree with one another: CNT/MDA (n=2,002, in person), Futura Inteligência (n=2,000, telephone) and Gerp (n=2,400, telephone). In the runoff, the result runs from 9pp in the leader's favour to 2pp in the challenger's favour. Prices from the ${S}, confirmed by two independent readings.`,

  // ---------- Lula ----------
  'candidates[0].header':
    `THREE NEW POLLS AND THEY DISAGREE MORE THAN ON ANY DAY IN THE WINDOW: CNT/MDA gives 42.4% and a win by 48% x 39% in the runoff, Futura gives 38.8% and 46.5% x 44%, and Gerp gives a TIE at 38% and a LOSS by 45% x 43%. IN THE PRICE, FLAT for the third session: 63.50% (vol USD 8.21M cumulative) at the ${S}.`,
  'candidates[0].fortes[0]':
    `He leads or ties the first round in all SEVEN national polls since Aug 5, and wins the runoff in five of the six rounds that test it.`,
  'candidates[0].fortes[1]':
    `Today's CNT/MDA brings his best reading of the whole window: 42.4% in the first round, with 13.7pp of advantage, and 48% x 39% in the runoff.`,
  'candidates[0].fortes[4]':
    `Price at the ${S} at 63.50%, with USD 8.21M in cumulative volume, and the 89-day series has a peak of 66.50%, from Aug 1.`,
  'candidates[0].fracos[0]':
    `GERP IS THE FIRST NATIONAL POLL OF THE WINDOW TO PUT HIM BEHIND IN THE RUNOFF: 43% against 45%, within the 2pp margin and treated as a statistical tie by the release itself.`,
  'candidates[0].fracos[3]':
    `The market gap returned to +36.55pp, the same value as Aug 9, undoing the previous day's narrowing.`,
  'candidates[0].fracos[4]':
    `Series caveat: 15 of the 89 days had a price equal to or above 63.50%, so the current level is not extreme.`,
  'candidates[0].analise':
    `THE DAY BROUGHT THREE POLLS AND THEY DO NOT TELL THE SAME STORY. CNT/MDA, in person, with n=2,002 and field from Aug 5 to 8, gives 42.4% in the first round and 48% x 39% in the runoff. Futura Inteligência, telephone, with n=2,000 and field from Aug 3 to 7, gives 38.8% and 46.5% x 44%. Gerp, telephone, with n=2,400 and field from Aug 6 to 10, gives a TIE at 38% x 38% and a loss by 45% x 43%. ALL THREE MEASURED THE SAME WEEK, and in the runoff the result runs from nine points in favour to two points against, that is, eleven points of distance on the same question. Adding up the seven national polls since Aug 5 he appears between 38% and 44%. IN THE PRICE THERE WAS NO MOVEMENT: 63.50% for the third session running, with USD 8.21M cumulative. The gap returned to +36.55pp, the Aug 9 value, and this time because the challenger gave back the 0.30pp he had gained. ⚠️ THE CENTRAL CROSSING OF THE DAY IS ONE OF REGIME, NOT OF LEVEL: while three institutes opened eleven points of distance between themselves, the whole market had a maximum move of 0.75pp, and his price did not budge. The two instruments measured the same race and one of them is far more uncertain than the other. The panel records the difference in regime without saying which one is right. APPROVAL follows the same dispersion: 47.3% against 49.9% at Futura, 53% disapproval at Gerp, and administration at 35% excellent or good against 36% poor or terrible at CNT/MDA.`,

  // ---------- Flávio ----------
  'candidates[1].header':
    `GERP PUTS HIM AHEAD IN THE RUNOFF, with 45% against 43%, and it is the FIRST time a national poll in the window has done so. On the same day CNT/MDA puts him nine points behind. In the first round he runs from 28.7% to 38% across today's three. IN THE PRICE HE FELL 0.30pp, to 26.95% (vol USD 8.12M cumulative), at the ${S}.`,
  'candidates[1].fortes[0]':
    `Today's Gerp is the FIRST national poll of the window to put him ahead in the runoff, with 45% against 43%, and the same survey shows a tie at 38% x 38% in the first round.`,
  'candidates[1].fortes[1]':
    `Adding Gerp and Palver together, that is two rounds in two days in which he does not lose the runoff, after a whole window of defeats.`,
  'candidates[1].fortes[4]':
    `Price at the ${S} at 26.95%, with USD 8.12M cumulative, and 30 of the 89 days in the series had a value equal to or above it.`,
  'candidates[1].fracos[0]':
    `HIS SPREAD GREW TO 11.3pp: across the seven national polls since Aug 5 he appears with 28.7%, 30%, 34.1%, 35%, 35%, 38% and 40%, and CNT/MDA's 28.7% falls below the window's previous floor.`,
  'candidates[1].fracos[4]':
    `In the price he gave back the 0.30pp he had gained, and in the runner-up contract he fell 1.50pp, to 80.50%.`,
  'candidates[1].analise':
    `HIS DAY HOLDS THE BEST AND THE WORST DATA POINT OF THE WINDOW, AND THE TWO CAME OUT TOGETHER. Gerp puts him ahead in the runoff, with 45% against 43%, and it is the first national poll of the period to do so; the release itself treats the 2pp difference as a statistical tie within the margin. On the same day CNT/MDA puts him nine points behind, with 39% against 48%. Futura sits in the middle, with 44% against 46.5%. IN THE FIRST ROUND THE DISTANCE IS EQUALLY LARGE: 28.7% at CNT/MDA and 38% at Gerp, 9.3 points between two readings from the same day. HIS SPREAD IN THE WINDOW REACHED 11.3pp, against 6pp for the leader, and the 28.7% opened a new floor. Choosing one of the three is choosing the conclusion, and that is why the panel publishes the set. IN THE PRICE THE MOVE WAS SMALL AND IN THE OPPOSITE DIRECTION: he fell 0.30pp, to 26.95%, giving back exactly what he had gained the day before, and the gap returned to the Aug 9 value. In the runner-up contract he lost 1.50pp, to 80.50%. REJECTION REMAINS HIGH: 47.1% at Futura, in a statistical tie with the leader's 45.9%. ON THE BOARD, his campaign settled its slogan on Aug 11 and revived a 2002 line from his opponent to talk about fear, and he stated that he will attend the debates and that he owes no explanations about the Master case.`,

  // ---------- Renan Santos ----------
  'candidates[2].header':
    `THE LARGEST MOVE IN THE WHOLE BOOK WAS HIS: he rose 0.75pp, to 8.40% (vol USD 9.43M cumulative), at the ${S}. In the polling Gerp gives him 5%, the second highest value of the window, behind only Palver's 10% online. The method effect remains the reading.`,
  'candidates[2].fortes[0]':
    `LARGEST MOVE IN THE WHOLE PRESIDENTIAL BOOK in today's reading, with a rise of 0.75pp, to 8.40%.`,
  'candidates[2].fortes[1]':
    `He came off the floor of his own series: on Aug 10, 84 of the 88 days had a value equal to or above his, and now 72 of 89 do.`,
  'candidates[2].fortes[2]':
    `Gerp gives him 5% in the first round, the second highest value of the window, and the price remains above every telephone and in-person reading.`,
  'candidates[2].fracos[2]':
    `The interval between methods remains open: 4% to 5% by telephone and in person against 10% online, with the caveat declared by Palver itself.`,
  'candidates[2].analise':
    `HE HAD THE LARGEST PRICE MOVE OF THE DAY AND THE SECOND HIGHEST POLLING VALUE OF THE WINDOW, AND THE TWO THINGS NEED TO BE READ SEPARATELY. In the market he rose 0.75pp, to 8.40%, and it was the only move above 0.30pp in the whole presidential book. In the 89-day series he came off the floor: on Aug 10 there were 84 days with a value equal to or above his, and now there are 72. IN THE POLLING Gerp gives him 5% in the first round, behind only the 10% Palver measured online on Aug 10, and CNT/MDA and Futura did not publish the full field. THE METHOD EFFECT REMAINS THE CENTRAL READING ON HIM: the same name runs from 4% to 10% depending on the interview setting, and the caveat is not this panel's, it was declared by Palver itself, which stated that it is testing approaches to reduce the effect in online polls. ⚠️ THE PANEL DOES NOT ATTRIBUTE THE PRICE RISE TO THE PUBLIC DISCUSSION ABOUT METHOD that the press ran on Aug 10 and 11. There is no measurement linking the two, and an intraday move with no identifiable event is momentum, not reaction. The sequence is recorded without asserting cause. He still holds the largest cumulative volume in the book among the names above 1%, with USD 9.43M.`,

  // ---------- pelotão ----------
  'candidates[3].header':
    `THE BASIS FOR COMPARISON ON THEM SHRANK: of today's three national polls, only Gerp published the full field, with Caiado at 4% and Zema at 2%. Prices from the ${S}: Caiado 1.05% (vol USD 5.63M), Zema 0.35% (vol USD 5.05M) and Haddad 0.05% (vol USD 7.01M).`,
  'candidates[3].subtitle':
    `Aug 11, 54 days from the first round: of the three national polls published today, only Gerp released the full field, and the basis for comparison on the chasing pack shrank precisely on the day of greatest dispersion between houses. All three fell in the price. The filing phase runs to Aug 15, and Zema, who filed on Aug 6, remains the only one of the three with a candidacy submitted.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 1.05% (vol USD 5.63M cumulative, ${S}) | candidate confirmed at convention, with Kassab as running mate | polling in force: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5.7%, BTG/Nexus 5%`,
  'candidates[3].caiado.fortes':
    `Today's Gerp gives him 4% in the first round, the same value as Genial/Quaest of Aug 5, and he remains ahead of Zema in every round that publishes the full field. Still in force is Lula's tie with him in the BTG/Nexus runoff of Aug 10, which is the best result any name outside the top two has posted in this window. In the Meio/Ideia poll of Aug 5 he is the challenger who comes closest in the runoff, with 40% against 48.5%.`,
  'candidates[3].caiado.fracos':
    `HE FELL 0.10pp FOR THE THIRD SESSION RUNNING, to 1.05%. His distance between polling and price remains the largest in the chasing pack: from 4% to 5.7% of declared intention against 1.05% of priced probability. The disagreement between institutes about him remains open within the same field, with 4% at one house and 5.7% at another. Two of today's three national polls did not publish the full field, so the basis for comparison on him shrank.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.05% (vol USD 7.01M cumulative, ${S}) | NOT tested by any of the three national polls of Aug 11, because he is running for governor of São Paulo`,
  'candidates[3].haddad.fortes':
    `His cumulative volume, USD 7.01M, remains larger than that of several names priced above him, which keeps the contract backed by real trading despite the low level.`,
  'candidates[3].haddad.fracos':
    `HE FELL 0.10pp AND RETURNED TO THE FLOOR OF 0.05% after a single day above it. None of the three national polls of Aug 11 tests him, in any scenario. The aggravating factor remains and needs to be said plainly: he is NOT a presidential candidate, he is running for governor of São Paulo, and any scenario that includes him is a polling hypothesis and not a candidacy under way. At that level, variation has almost no informational value.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.35% (vol USD 5.05M cumulative, ${S}) | polling in force: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2.6%, BTG/Nexus 3% | ticket with senator Eduardo Girão | filed his candidacy with the TSE on Aug 6`,
  'candidates[3].zema.fortes':
    `He filed his candidacy with the TSE on Aug 6, declaring R$ 178.7 million in assets, and remains the only one in the chasing pack with a candidacy submitted, in a window that closes on Aug 15. In the polling he is stable at every house that tests him, between 2% and 3%.`,
  'candidates[3].zema.fracos':
    `HE FELL 0.10pp, to 0.35%, SINKING FURTHER BELOW THE 0.5% CUT the panel uses to separate price from noise, and the reading on him remains suspended in that band. He is the challenger the leader beats by the widest margin in the rounds that test him, by 46% x 34% at Quaest and 48.5% x 37% at Ideia. In the polling he has not moved for a month. The series caveat is large: his maximum was 10.10%, on Apr 26.`,
  'candidates[3].fortes[0]':
    `Today's Gerp gives Caiado 4%, the same value as Genial/Quaest of Aug 5, and he remains ahead of Zema in every round that publishes the full field.`,
  'candidates[3].fracos[0]':
    `Caiado's price fell 0.10pp for the THIRD session running, to 1.05%, and his distance between polling and price remains the largest in the chasing pack.`,
  'candidates[3].fracos[1]':
    `Zema fell 0.10pp, to 0.35%, sinking further below the 0.5% cut the panel uses to separate price from noise.`,
  'candidates[3].fracos[2]':
    `TWO OF TODAY'S THREE NATIONAL POLLS did not publish the full field, so the basis for comparison between houses on them shrank precisely on the day of greatest dispersion.`,
  'candidates[3].analise':
    `THEIR DATA POINT TODAY IS AN ABSENCE, AND ABSENCE IS INFORMATION TOO. Of the three national polls published on Aug 11, only Gerp released the full field, with Caiado at 4%, Zema at 2%, Cabo Daciolo and Augusto Cury at 1% each, plus 7% undecided and 4% who would choose none. CNT/MDA and Futura published only the top two. On the day when dispersion between institutes was the largest of the window, the basis for comparison on the chasing pack got smaller, and the panel records that instead of filling the void with old figures. IN THE PRICE all three fell: Caiado 0.10pp for the third session running, to 1.05%, Zema 0.10pp, to 0.35%, and Haddad 0.10pp, back to the floor of 0.05%. CAIADO'S DISTANCE REMAINS THE LARGEST IN THE PACK: from 4% to 5.7% of declared intention against 1.05% of priced probability. The panel records the distance without subtracting one quantity from the other, because the polling measures intention now and the contract measures the probability of winning at the end. ZEMA remains below the 0.5% cut and the reading on him stays suspended. HADDAD still has no presidential candidacy, running for governor of São Paulo, and the coverage of Aug 11 brings him in a São Paulo state poll after the first debate on Band.`,

  // ---------- quadro comparativo ----------
  'quadroComparativo[0].p':
    `THREE NEW NATIONAL POLLS ON AUG 11 and they disagree. CNT/MDA (n=2,002, in person, BR-06935/2026): 42.4% and 48% x 39% in the runoff. Futura (n=2,000, telephone): 38.8% and 46.5% x 44%. Gerp (n=2,400, telephone, BR-08045/2026): TIED at 38% and defeated 45% x 43%. Across the seven rounds since Aug 5 he runs from 38% to 44%.`,
  'quadroComparativo[0].m': `63.50% (vol USD 8.21M cumulative), ${S}`,
  'quadroComparativo[0].t':
    `FLAT for the third session running. The gap returned to +36.55pp, the Aug 9 value, because the challenger gave back yesterday's 0.30pp. In the 89-day series, 15 had a value equal to or above it.`,
  'quadroComparativo[0].s':
    `54 days to the election. Approval also disperses: 47.3% x 49.9% at Futura, 53% disapproval at Gerp, and administration at 35% excellent or good against 36% poor or terrible at CNT/MDA.`,

  'quadroComparativo[1].p':
    `GERP PUTS HIM AHEAD IN THE RUNOFF, 45% x 43%, the first time in the window. CNT/MDA puts him nine points behind on the same day, with 39% x 48%. Futura sits in the middle, with 44% x 46.5%. In the first round he runs from 28.7% to 38% across the three, and the window's spread reached 11.3pp. REJECTION of 47.1% at Futura.`,
  'quadroComparativo[1].m': `26.95% (vol USD 8.12M), ${S}`,
  'quadroComparativo[1].t':
    `FELL 0.30pp and gave back what he had gained the day before. In the runner-up contract he fell 1.50pp, to 80.50%. It is not extreme: 30 of the 89 days had a value equal to or above it.`,
  'quadroComparativo[1].s':
    `The campaign settled its slogan on Aug 11 and revived a 2002 line from his opponent to talk about fear. He stated that he will attend the debates and that he owes no explanations about the Master case.`,

  'quadroComparativo[2].p':
    `Gerp gives him 5% in the first round, the second highest value of the window, behind only Palver's 10% online. Still in force are 4% at Genial/Quaest in person, 4.7% at Meio/Ideia and 4% at BTG/Nexus. CNT/MDA and Futura did not publish the full field.`,
  'quadroComparativo[2].m': `8.40% (vol USD 9.43M), ${S}`,
  'quadroComparativo[2].t':
    `ROSE 0.75pp and was the LARGEST move in the whole presidential book. He came off the floor of his own series: 84 of the 88 days were above him on Aug 10, now 72 of 89 are. The price still sits BETWEEN the two polling methods.`,
  'quadroComparativo[2].s':
    `Largest cumulative volume in the book among the names above 1%, with USD 9.43M. The BBC published a report on Aug 11 about part of the financial market rallying behind his campaign.`,

  'quadroComparativo[3].p':
    `Gerp gives him 4% in the first round, the same value as Genial/Quaest of Aug 5. Meio/Ideia still has 5.7%. CNT/MDA and Futura did not publish the full field, and the basis for comparison on him shrank.`,
  'quadroComparativo[3].m': `1.05% (vol USD 5.63M), ${S}`,
  'quadroComparativo[3].t':
    `FELL 0.10pp for the THIRD session running. The distance between polling and price remains the largest in the chasing pack: from 4% to 5.7% declared against 1.05% priced.`,
  'quadroComparativo[3].s':
    `Still in force is Lula's tie with him in the BTG/Nexus runoff of Aug 10, the best result any name outside the top two posted in the window.`,

  'quadroComparativo[4].p':
    `Gerp gives him 2% in the first round, and BTG/Nexus of Aug 10 had given 3%. Still in force are Genial/Quaest's 2% and Meio/Ideia's 2.6%, of Aug 5.`,
  'quadroComparativo[4].m': `0.35% (vol USD 5.05M), ${S}`,
  'quadroComparativo[4].t':
    `FELL 0.10pp and sank further below the 0.5% cut that separates price from noise. The reading on him remains suspended in that band.`,
  'quadroComparativo[4].s':
    `He filed his candidacy with the TSE on Aug 6, with R$ 178.7 million declared, and the filing window for the others closes on Aug 15.`,

  'quadroComparativo[5].m': `3.80% (vol USD 83 thousand), ${S}`,
  'quadroComparativo[5].t':
    `ROSE 0.20pp against the last confirmed value, which was 3.60% on Aug 9. It remains the thinnest contract among those tracked, and any move in it demands that caveat.`,
  'quadroComparativo[5].s':
    `The Master case returned to coverage on Aug 11 with no fresh judicial decision: the liquidator widened the net around Vorcaro's assets in the United States, the Federal Police pointed out a consultancy that acted to favour the bank in a pension fund in Maceió, and the FGC stated that it is not a party to the deal at the Supreme Court over the BRB rescue.`,

  cruzamento:
    `THREE NATIONAL POLLS ON AUG 11, AND THEY DISAGREE WITH ONE ANOTHER MORE THAN ON ANY OTHER DAY IN THIS WINDOW. The prices on this page are from the ${S}, confirmed by two independent readings taken eight minutes apart. IN THE RUNOFF, THE DISTANCE IS ELEVEN POINTS: CNT/MDA (n=2,002, in person, field Aug 5 to 8) gives 48% x 39% for the leader; Futura Inteligência (n=2,000, telephone, field Aug 3 to 7) gives 46.5% x 44%; and Gerp (n=2,400, telephone, field Aug 6 to 10) gives 45% x 43% FOR THE RUNNER-UP. It is the first time in the window that a national poll puts the challenger ahead in that scenario. IN THE FIRST ROUND THE DISTANCE IS 9.3 POINTS on the same name: 28.7% at CNT/MDA and 38% at Gerp, with Futura at 34.1%. Adding up the seven national polls since Aug 5, the leader runs from 38% to 44%, a 6pp band, and the runner-up runs from 28.7% to 40%, an 11.3pp band, almost double. ⭐ THE CENTRAL CROSSING OF THE DAY IS ONE OF REGIME, AND NOT OF LEVEL. While the polling opened that distance, the market barely moved: the leader was flat for the third session, at 63.50%, the runner-up gave back 0.30pp and returned to 26.95%, and the gap went back to +36.55pp, exactly the Aug 9 value. The largest move in the whole presidential book, which adds up to USD 122.16M in cumulative volume, was 0.75pp, on the third-placed name. The two instruments measured the same week, and one of them is far more uncertain than the other. The panel records the difference in regime and does not say which one is right, because it does not know, and because saying so would trade measurement for opinion. THE THIRD-PLACED NAME HOLDS WHAT MOVEMENT WAS LEFT: he rose 0.75pp, to 8.40%, came off the floor of his own series, and his price still sits BETWEEN the two polling methods, above the 4% to 5% of telephone and in person and below the 10% the online poll measured on Aug 10. ⚠️ No cause is attributed to that move, because there is no measurement linking it to the public discussion about method. APPROVAL FOLLOWS THE SAME PATTERN OF DISPERSION: across seven readings in seven days, disapproval runs from 47% to 55%, and the balance runs from 1pp positive to 10pp negative.`,
})
