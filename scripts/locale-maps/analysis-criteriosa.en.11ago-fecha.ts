/**
 * Mapa EN do REBASELINE de 11/Ago (leitura de fechamento, 18:22 BRT) para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 11".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 11, 18:22 BRT'

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 11, 54 days from the first round. THREE NEW NATIONAL POLLS and they disagree with one another: CNT/MDA (n=2,002, in person), Futura Inteligência (n=2,000, telephone) and Gerp (n=2,400, telephone). In the runoff, the result runs from 9pp in the leader's favour to 2pp in the challenger's favour. Prices from the ${S}, confirmed by two independent readings.`,

  'candidates[0].header':
    `THREE NEW POLLS AND THEY DISAGREE MORE THAN ON ANY DAY IN THE WINDOW: CNT/MDA gives 42.4% and a win by 48% x 39% in the runoff, Futura gives 38.8% and 46.5% x 44%, and Gerp gives a TIE at 38% and a LOSS by 45% x 43%. IN THE PRICE, FLAT for the fourth session: 63.50% (vol USD 8.21M cumulative) at the ${S}.`,
  'candidates[0].fortes[4]':
    `Price at the ${S} at 63.50%, with USD 8.21M in cumulative volume, and the 90-day series has a peak of 66.50%, from Aug 1.`,
  'candidates[0].fracos[3]':
    `The market gap closed the day at +36.25pp, exactly the same value as Aug 10, meaning a whole day of polls did not move the distance between the two.`,
  'candidates[0].fracos[4]':
    `Series caveat: 17 of the 90 days had a price equal to or above 63.50%, so the current level is not extreme.`,
  'candidates[0].analise':
    `THE DAY BROUGHT THREE POLLS AND THEY DO NOT TELL THE SAME STORY. CNT/MDA, in person, with n=2,002 and field from Aug 5 to 8, gives 42.4% in the first round and 48% x 39% in the runoff. Futura Inteligência, telephone, with n=2,000 and field from Aug 3 to 7, gives 38.8% and 46.5% x 44%. Gerp, telephone, with n=2,400 and field from Aug 6 to 10, gives a TIE at 38% x 38% and a loss by 45% x 43%. ALL THREE MEASURED THE SAME WEEK, and in the runoff the result runs from nine points in favour to two points against, that is, eleven points of distance on the same question. Adding up the seven national polls since Aug 5 he appears between 38% and 44%. IN THE PRICE THERE WAS NO MOVEMENT AT ALL: 63.50% for the fourth session running, with USD 8.21M cumulative, and the gap closed at +36.25pp, identical to Aug 10. ⚠️ THE CENTRAL CROSSING OF THE DAY IS ONE OF REGIME, NOT OF LEVEL: while three institutes opened eleven points of distance between themselves, the presidential book closed the day where it started. The two instruments measured the same race and one of them is far more uncertain than the other. The panel records the difference in regime without saying which one is right. APPROVAL follows the same dispersion: 47.3% against 49.9% at Futura, 53% disapproval at Gerp, and administration at 35% excellent or good against 36% poor or terrible at CNT/MDA.`,

  'candidates[1].header':
    `GERP PUTS HIM AHEAD IN THE RUNOFF, with 45% against 43%, and it is the FIRST time a national poll in the window has done so. On the same day CNT/MDA puts him nine points behind. In the first round he runs from 28.7% to 38% across today's three. IN THE PRICE THE DAY WAS A ROUND TRIP: he marked 26.95% at 16:27 and closed at 27.25% (vol USD 8.12M cumulative), at the ${S}.`,
  'candidates[1].fortes[4]':
    `Price at the ${S} at 27.25%, with USD 8.12M cumulative, and 25 of the 90 days in the series had a value equal to or above it.`,
  'candidates[1].fracos[4]':
    `The price closed the day with no change against Aug 10, after falling to 26.95% in mid-afternoon and recovering, and in the runner-up contract he stands at 80.50%, against 82.00% on Aug 10.`,
  'candidates[1].analise':
    `HIS DAY HOLDS THE BEST AND THE WORST DATA POINT OF THE WINDOW, AND THE TWO CAME OUT TOGETHER. Gerp puts him ahead in the runoff, with 45% against 43%, and it is the first national poll of the period to do so; the release itself treats the 2pp difference as a statistical tie within the margin. On the same day CNT/MDA puts him nine points behind, with 39% against 48%. Futura sits in the middle, with 44% against 46.5%. IN THE FIRST ROUND THE DISTANCE IS EQUALLY LARGE: 28.7% at CNT/MDA and 38% at Gerp, 9.3 points between two readings from the same day. HIS SPREAD IN THE WINDOW REACHED 11.3pp, against 6pp for the leader, and the 28.7% opened a new floor. Choosing one of the three is choosing the conclusion, and that is why the panel publishes the set. IN THE PRICE THE DAY WAS A ROUND TRIP AND ENDED AT ZERO: he fell to 26.95% in the 16:27 reading and closed at 27.25%, exactly where he stood on Aug 10. In the 90-day series, 25 had a value equal to or above it, with a peak of 33.20% on Jun 2 and a floor of 22.00% on Jul 3. REJECTION REMAINS HIGH: 47.1% at Futura, in a statistical tie with the leader's 45.9%. ON THE BOARD, he stated on Aug 11 that he will attend the debates and that he owes no explanations about the Master case, recorded a campaign broadcast with Michelle Bolsonaro asserting that Moraes is his opponent's operator, and floated ending re-election as a way to attract parties. 📌 His campaign slogan came out on Aug 10, not today.`,

  'candidates[2].header':
    `HE WAS THE ONLY THING THAT MOVED IN THE BOOK, AND HE CAME BACK: he marked 8.40% at 16:27 and closed at 7.75% (vol USD 9.44M cumulative), at the ${S}, finishing 0.10pp above Aug 10. In the polling Gerp gives him 5%, the second highest value of the window, behind only Palver's 10% online.`,
  'candidates[2].fortes[0]':
    `He was the only name in the presidential book to move more than 0.30pp at any point in the day, with a swing of 0.75pp up and 0.65pp back.`,
  'candidates[2].fortes[1]':
    `He closed 0.10pp above Aug 10, and in the 90-day series 78 had a value equal to or above it, with a floor of 6.90% on Aug 6.`,
  'candidates[2].analise':
    `HE WAS THE ONLY NAME TO REALLY MOVE ALL DAY, AND THE MOVE WAS A ROUND TRIP. In the 16:27 reading he marked 8.40%, a rise of 0.75pp; in the closing reading, at 18:22, he stood at 7.75%, that is, 0.10pp above Aug 10. ⚠️ BOTH READINGS WERE CONFIRMED, each by two captures taken eight minutes apart, so neither is wrong: the day simply kept going after the first one. The panel publishes the close and records the path, because hiding the path would make a 1.4pp swing look like a flat day. In the 90-day series, 78 had a value equal to or above 7.75%, with a peak of 17.90% on Jun 9 and a floor of 6.90% on Aug 6. IN THE POLLING Gerp gives him 5% in the first round, behind only the 10% Palver measured online on Aug 10, and CNT/MDA and Futura did not publish the full field. THE METHOD EFFECT REMAINS THE CENTRAL READING ON HIM: the same name runs from 4% to 10% depending on the interview setting, and the caveat is not this panel's, it was declared by Palver itself, which stated that it is testing approaches to reduce the effect in online polls. ⚠️ THE PANEL ATTRIBUTES NEITHER END OF THAT SWING TO THE PUBLIC DISCUSSION ABOUT METHOD that the press ran on Aug 10 and 11. There is no measurement linking the two. He still holds the largest cumulative volume in the book among the names above 1%, with USD 9.44M.`,

  'candidates[3].header':
    `THE BASIS FOR COMPARISON ON THEM SHRANK: of today's three national polls, only Gerp published the full field, with Caiado at 4% and Zema at 2%. All three gave up 0.10pp in the price. Values from the ${S}: Caiado 1.05% (vol USD 5.63M), Zema 0.35% (vol USD 5.05M) and Haddad 0.05% (vol USD 7.01M).`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 1.05% (vol USD 5.63M cumulative, ${S}) | candidate confirmed at convention, with Kassab as running mate | polling in force: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5.7%, BTG/Nexus 5%`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.05% (vol USD 7.01M cumulative, ${S}) | NOT tested by any of the three national polls of Aug 11, because he is running for governor of São Paulo`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.35% (vol USD 5.05M cumulative, ${S}) | polling in force: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2.6%, BTG/Nexus 3% | ticket with senator Eduardo Girão | filed his candidacy with the TSE on Aug 6`,
  'candidates[3].zema.fracos':
    `HE GAVE UP 0.10pp, to 0.35%, SINKING FURTHER BELOW THE 0.5% CUT the panel uses to separate price from noise, and the reading on him remains suspended in that band. He is the challenger the leader beats by the widest margin in the rounds that test him, by 46% x 34% at Quaest and 48.5% x 37% at Ideia. In the polling he has not moved for a month. The 90-day window the series covers starts on May 13, so his April peak falls outside what this panel can check today.`,

  'quadroComparativo[0].m': `63.50% (vol USD 8.21M cumulative), ${S}`,
  'quadroComparativo[0].t':
    `FLAT for the fourth session running. The gap closed at +36.25pp, the same value as Aug 10, meaning a day of three polls did not move the distance. In the 90-day series, 17 had a value equal to or above it.`,
  'quadroComparativo[1].m': `27.25% (vol USD 8.12M), ${S}`,
  'quadroComparativo[1].t':
    `ROUND TRIP: he fell to 26.95% in the 16:27 reading and closed at 27.25%, where he already stood on Aug 10. In the runner-up contract he is at 80.50%, against 82.00% yesterday. It is not extreme: 25 of the 90 days had a value equal to or above it.`,
  'quadroComparativo[1].s':
    `He stated on Aug 11 that he will attend the debates and that he owes no explanations about the Master case. He recorded a campaign broadcast with Michelle Bolsonaro asserting that Moraes is his opponent's operator, and floated ending re-election as a way to attract parties.`,
  'quadroComparativo[5].s':
    `The Master case had a fact of its own on Aug 11, and it is one of deadlock rather than decision: the FGC told the Supreme Court that it is not a party to the deal and that it has not received BRB's balance sheet, required for the rescue loan, and BRB replied that it only releases its 2025 statements after the capitalisation. Master's liquidator widened the net around Vorcaro's assets in the United States. 📌 The Federal Police operation over the Maceió pension fund is from Aug 10, not today.`,
  'quadroComparativo[2].m': `7.75% (vol USD 9.44M), ${S}`,
  'quadroComparativo[2].t':
    `THE ONLY REAL SWING OF THE DAY, AND IT CAME BACK: 8.40% at 16:27 and 7.75% at the close, 0.10pp above Aug 10. Both readings were confirmed. In the 90-day series, 78 had a value equal to or above it.`,
  'quadroComparativo[3].m': `1.05% (vol USD 5.63M), ${S}`,
  'quadroComparativo[4].m': `0.35% (vol USD 5.05M), ${S}`,
  'quadroComparativo[4].t':
    `GAVE UP 0.10pp and sank further below the 0.5% cut that separates price from noise. The reading on him remains suspended in that band.`,
  'quadroComparativo[5].m': `3.80% (vol USD 83 thousand), ${S}`,

  cruzamento:
    `THREE NATIONAL POLLS ON AUG 11, AND THEY DISAGREE WITH ONE ANOTHER MORE THAN ON ANY OTHER DAY IN THIS WINDOW. The prices on this page are from the ${S}, confirmed by two independent readings taken eight minutes apart. IN THE RUNOFF, THE DISTANCE IS ELEVEN POINTS: CNT/MDA (n=2,002, in person, field Aug 5 to 8) gives 48% x 39% for the leader; Futura Inteligência (n=2,000, telephone, field Aug 3 to 7) gives 46.5% x 44%; and Gerp (n=2,400, telephone, field Aug 6 to 10) gives 45% x 43% FOR THE RUNNER-UP. It is the first time in the window that a national poll puts the challenger ahead in that scenario. IN THE FIRST ROUND THE DISTANCE IS 9.3 POINTS on the same name: 28.7% at CNT/MDA and 38% at Gerp, with Futura at 34.1%. Adding up the seven national polls since Aug 5, the leader runs from 38% to 44%, a 6pp band, and the runner-up runs from 28.7% to 40%, an 11.3pp band, almost double. ⭐ THE CENTRAL CROSSING OF THE DAY IS ONE OF REGIME, AND NOT OF LEVEL. While the polling opened that distance, THE MARKET CLOSED THE DAY WHERE IT STARTED: the leader flat for the fourth session, at 63.50%, the runner-up back at 27.25% after marking 26.95% at 16:27, and the gap at +36.25pp, identical to Aug 10. The presidential book adds up to USD 122.17M in cumulative volume. ⚠️ THE ONLY NAME TO SWING WAS THE THIRD-PLACED ONE, AND HE CAME BACK TOO: 8.40% at 16:27 and 7.75% at the close, 0.10pp above yesterday. Both of the day's readings were confirmed, each by two captures, so neither is wrong, and the panel publishes the close while recording the path. No cause is attributed to that swing, because there is no measurement linking it to the public discussion about method that the press ran on Aug 10 and 11. The two instruments measured the same week, and one of them is far more uncertain than the other. The panel records the difference in regime and does not say which one is right, because it does not know, and because saying so would trade measurement for opinion. APPROVAL FOLLOWS THE SAME PATTERN OF DISPERSION: across seven readings in seven days, disapproval runs from 47% to 55%, and the balance runs from 1pp positive to 10pp negative.`,
})
