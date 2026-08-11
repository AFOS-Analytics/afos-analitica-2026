/**
 * Mapa EN do REBASELINE de 11/Ago (leitura de fechamento, 18:22 BRT) para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 11".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 11, 18:22 BRT'

construir('polls-data', 'en', {
  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE CONFIRMED READING OF AUG 11, 18:22 BRT, confirmed by two independent readings taken eight minutes apart. THE DAY HAD THREE NATIONAL POLLS AND THEY DISAGREE WITH ONE ANOTHER MORE THAN ON ANY OTHER DAY IN THE WINDOW. In the runoff, CNT/MDA gives 48% x 39% for the leader, Futura gives 46.5% x 44%, and Gerp gives 45% x 43% FOR THE RUNNER-UP. That is eleven points of distance between the most favourable and the least favourable reading, on the same question, on the same day, and it is the first time in the window that a national poll puts the challenger ahead in the runoff. In the first round the distance is 9.3pp, between CNT/MDA's 28.7% and Gerp's 38%. ⭐ THE CENTRAL CROSSING IS ONE OF REGIME, NOT OF LEVEL: while the polling opened that distance, THE MARKET CLOSED THE DAY WHERE IT STARTED. The leader was flat for the fourth session, the runner-up went back to 27.25% after marking 26.95% at 16:27, and the gap closed at +36.25pp, identical to Aug 10. The third-placed name was the only one to swing, and he came back too. The two instruments measured the same week, and one of them is far more uncertain than the other. The panel records the difference in regime without saying which instrument is right, because it does not know, and because saying so would trade measurement for opinion.`,

  'polymarketComparison.sources':
    `Polymarket prices via the AFOS proxy, capture confirmed by two independent readings taken eight minutes apart, the most recent at 18:22 BRT on Aug 11 (scripts/capture-guard.ts). There was an earlier confirmed reading on the same day, at 16:27 BRT, and the differences between the two are recorded in the text rather than discarded. Polls of Aug 11: CNT/MDA BR-06935/2026 (n=2,002, in person, field Aug 5 to 8), Gerp BR-08045/2026 (n=2,400, telephone, field Aug 6 to 10) and Futura Inteligência (n=2,000, telephone, field Aug 3 to 7, registration not confirmed in a primary source). Still in force are Palver BR-06596/2026 and BTG/Nexus BR-08428/2026, of Aug 10, and Genial/Quaest BR-06591/2026 and Meio/Ideia BR-04579/2026, of Aug 5. Next national poll in the release queue: PoderData (n=2,400, BR-06868/2026) on Aug 13.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] At 63.50% (vol USD 8.21M cumulative), FLAT for the fourth session running. The gap over Flávio closed at +36.25pp, exactly the Aug 10 value: a whole day of polls did not move the distance between the two. ⚠️ THE CONTRAST WITH THE POLLING IS THE DATA POINT OF THE ROUND: while three institutes published readings eleven points apart in the runoff, his price did not move in either of the day's two confirmed readings. In the 90-day series the peak is 66.50%, from Aug 1, and 17 of the 90 days had a value equal to or above it, so the level is not extreme.`,

  'polymarketComparison.candidates[1].polymarket': `27.25%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] At 27.25% (vol USD 8.12M cumulative). THE DAY WAS A ROUND TRIP AND ENDED AT ZERO: he marked 26.95% in the confirmed 16:27 reading and closed at 27.25%, exactly where he stood on Aug 10. ⚠️ THE DAY SHOWS THE TWO INSTRUMENTS IN DIFFERENT REGIMES: in the polling he varies 11.3pp between houses and even leads a runoff; in the price he closed with no change. In the 90-day series, 25 had a value equal to or above it, with a peak of 33.20% on Jun 2 and a floor of 22.00% on Jul 3. In the runner-up contract he stands at 80.50%, against 82.00% on Aug 10.`,

  'polymarketComparison.candidates[2].polymarket': `7.75%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] At 7.75% (vol USD 9.44M cumulative). HE WAS THE ONLY NAME TO SWING ALL DAY, AND THE SWING CAME BACK: 8.40% in the confirmed 16:27 reading and 7.75% at the close, finishing 0.10pp above Aug 10. ⚠️ Both readings were confirmed, each by two captures, so neither is wrong and the panel records the path rather than hiding a 1.4pp swing behind a single figure. In the 90-day series, 78 had a value equal to or above it, with a peak of 17.90% on Jun 9 and a floor of 6.90% on Aug 6. The price still sits BETWEEN the two polling methods, above the 4% to 5% of telephone and in person and below the 10% of the internet. ⚠️ The panel does NOT attribute either end of the swing to the public discussion about method that the press ran on Aug 10 and 11, because it measured nothing linking the two. Largest cumulative volume in the book among the names above 1%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] At 1.05% (vol USD 5.63M cumulative). GAVE UP 0.10pp for the third session running, and the distance between polling and price remains the largest in the chasing pack: from 4% to 5.7% of declared intention against 1.05% of priced probability. The panel records the distance without subtracting one quantity from the other, because the polling measures intention now and the contract measures the probability of winning at the end.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] At 0.05% (vol USD 13.90M cumulative). ⚠️ It remains the LARGEST cumulative volume in the whole presidential book, with the price at the floor. High volume with probability at the floor is conviction already priced in, not movement, and variations in this band have almost no informational value.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] At 0.35% (vol USD 5.05M cumulative). GAVE UP 0.10pp and sank further below the 0.5% cut the panel uses to separate price from noise, a band in which the reading on him remains suspended. The series window this panel can check starts on May 13, so his April peak falls outside it.`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] At 0.05% (vol USD 7.01M cumulative), back at the floor after a single day above it. Variation in this band has no informational value.`,
})
