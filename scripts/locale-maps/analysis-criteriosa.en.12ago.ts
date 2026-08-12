/**
 * Mapa EN de 12/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 12".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 12, 16:41 BRT'

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 12, 53 days from the first round. NO NEW NATIONAL POLL: still in force are CNT/MDA, Futura Inteligência and Gerp, all of Aug 11, which disagree by eleven points in the runoff. The price moved where the election is not decided: the presidential book almost flat and the first-round runner-up contract with the largest move of the day. Prices from the ${S}.`,

  'candidates[0].header':
    `NO NEW POLL TODAY: still standing are CNT/MDA, with 42.4% and a win by 48% x 39% in the runoff, Futura, with 38.8% and 46.5% x 44%, and Gerp, with a tie at 38% and a loss by 45% x 43%. IN THE PRICE, the FOURTH day running at 63.50% (vol USD 8.22M cumulative), at the ${S}.`,
  'candidates[0].fortes[4]':
    `Price at the ${S} at 63.50%, with USD 8.22M cumulative, and the 90-day series has a peak of 66.50%, from Aug 1.`,
  'candidates[0].fracos[3]':
    `The gap fell 0.40pp, to 35.85pp, and the fall came entirely from the challenger's end, because his own price did not move.`,
  'candidates[0].fracos[4]':
    `Series caveat: 17 of the 88 days had a price equal to or above 63.50%, so the current level is not extreme.`,
  'candidates[0].analise':
    `THE DAY BROUGHT NO NEW NATIONAL POLL, and that is information: the three from Aug 11 remain the most recent, and they disagree by eleven points in the runoff, running from nine points in his favour at CNT/MDA to two points against at Gerp. IN THE PRICE HE DID NOT MOVE FOR THE FOURTH DAY RUNNING, at 63.50%, with USD 8.22M cumulative. The gap fell 0.40pp, to 35.85pp, and the whole fall came from the challenger's end. ⭐ WHAT CHANGED TODAY WAS SOMEWHERE ELSE: the contract about who finishes second in the first round had the largest move of the day, with the challenger rising 3.50pp, while the contract about who wins barely budged. They are different questions, and the panel does not add them together. In the 90-day series, 17 of the 88 days had a value equal to or above today's, with a peak of 66.50% on Aug 1 and a floor of 39.50% on May 25. APPROVAL is still that of Aug 11, because no house has published since: 47.3% against 49.9% at Futura, 53% disapproval at Gerp, and the administration rating tied at CNT/MDA. 📅 PoderData publishes on Aug 13 and Quaest on Aug 14.`,

  'candidates[1].header':
    `NO NEW POLL TODAY: still standing are CNT/MDA's 28.7%, Futura's 34.1% and Gerp's 38%, with Gerp putting him ahead in the runoff by 45% x 43%. IN THE PRICE he rose 0.40pp, to 27.65% (vol USD 8.13M cumulative), at the ${S}. ⭐ And in the first-round runner-up contract he rose 3.50pp, to 84.00%.`,
  'candidates[1].fortes[4]':
    `Price at the ${S} at 27.65%, with USD 8.13M cumulative, and 22 of the 88 days in the series had a value equal to or above it.`,
  'candidates[1].fracos[4]':
    `The 0.40pp rise in the presidential is small next to the 3.50pp he gained in the runner-up contract, which describes a repricing of PLACING and not of winning.`,
  'candidates[1].analise':
    `HIS MOVE TODAY WAS ABOUT PLACING, NOT WINNING, AND THE DIFFERENCE MATTERS. In the presidential contract he rose 0.40pp, to 27.65%, with USD 8.13M cumulative, and the gap narrowed to 35.85pp. In the contract about who finishes second in the first round, he rose 3.50pp, from 80.50% to 84.00%, and that was the LARGEST move of the day in any book tracked. Winning the election and finishing second in the first round are distinct questions: the second is about reaching the runoff, and that is where the money moved. IN THE POLLING nothing changed, because there was no new national poll: still standing are CNT/MDA's 28.7%, Futura's 34.1% and Gerp's 38%, with a spread of 11.3pp in the window. In the 90-day series, 22 of the 88 days had a value equal to or above 27.65%, with a peak of 33.20% on Jun 2 and a floor of 22.00% on Jul 2. ON THE BOARD, Estadão reported that Tereza Cristina met his team to weigh taking part in the campaign, and that he is courting leaders of neutral parties for a women's platform, since his running mate is not a woman.`,

  'candidates[2].header':
    `HE GAVE WAY IN BOTH CONTRACTS: he fell 0.30pp in the presidential, to 7.45% (vol USD 9.48M cumulative), and 1.50pp in the first-round third-place one, to 62.50%, at the ${S}. In the polling nothing changed, because there was no new poll, and he still runs from 4% to 10% depending on the method.`,
  'candidates[2].fortes[0]':
    `He keeps the largest cumulative volume in the presidential book among the names above 1%, with USD 9.48M.`,
  'candidates[2].fortes[1]':
    `In the 90-day series, more than 80 of the 88 days had a value equal to or above it, with a floor of 6.80% on Aug 6.`,
  'candidates[2].analise':
    `HE GAVE WAY IN BOTH CONTRACTS WHERE HE APPEARS, and the move is small in both. In the presidential he fell 0.30pp, to 7.45%; in the first-round third-place one, 1.50pp, to 62.50%. IN THE POLLING NOTHING CHANGED, because the day had no new national poll: still standing are Gerp's 5%, Genial/Quaest's and BTG/Nexus's 4%, Meio/Ideia's 4.7% and Palver's 10% online. THE METHOD EFFECT REMAINS THE CENTRAL READING ON HIM, with the same name running from 4% to 10% depending on the interview setting, and the caveat was declared by Palver itself. The price still sits BETWEEN the two methods. In the 90-day series, more than 80 of the 88 days had a value equal to or above 7.45%, with a peak of 17.90% on Jun 9 and a floor of 6.80% on Aug 6, meaning he remains near the bottom of his own series even after the swing of Aug 11.`,

  'candidates[3].header':
    `⭐ CAIADO POINTS BOTH WAYS ON THE SAME DAY: he fell 0.10pp in the contract about winning, to 0.95%, dropping below 1%, and ROSE 2.00pp in the first-round third-place one, to 31.50%. Values from the ${S}: Caiado 0.95% (vol USD 5.66M), Zema 0.35% (vol USD 5.07M) and Haddad 0.15% (vol USD 7.06M).`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 0.95% (vol USD 5.66M cumulative, ${S}) | first-round third place 31.50% | polling in force: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5.7%, BTG/Nexus 5%`,
  'candidates[3].caiado.fracos':
    `HE FELL BELOW 1% IN THE CONTRACT ABOUT WINNING, to 0.95%, sitting 0.05pp from the floor of the series, which is 0.90% from Jul 7. His distance between polling and price remains the largest in the chasing pack: from 4% to 5.7% of declared intention against 0.95% of priced probability. ⚠️ And there is a contrast worth recording: Jair Bolsonaro, who is ineligible, is priced at 1.20%, above him.`,
  'candidates[3].caiado.fortes':
    `HE ROSE 2.00pp in the first-round third-place contract, to 31.50%, on the same day he fell in the one about winning. The market lowered his chance of winning and raised his chance of finishing third, and both can be true at once. In the polling he remains the best-placed name in the chasing pack, with 5.7% at Meio/Ideia and 5% at BTG/Nexus.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.15% (vol USD 7.06M cumulative, ${S}) | NOT tested by the national polls in force, because he is running for governor of São Paulo`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.35% (vol USD 5.07M cumulative, ${S}) | first-round third place 4.00% | polling in force: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2.6%, BTG/Nexus 3%`,
  'candidates[3].analise':
    `THE CHASING PACK HAD NO NEW POLL, and what moved was the price, in opposite directions for the same name. CAIADO fell 0.10pp in the contract about winning, to 0.95%, dropping below 1% and 0.05pp from the floor of the series, and at the same time rose 2.00pp in the first-round third-place contract, to 31.50%. Lowering the chance of winning and raising the chance of finishing third is not a contradiction: they are two questions, and the market answered them differently on the same day. ⚠️ One price contrast is worth recording: Jair Bolsonaro, who is ineligible, appears at 1.20%, above Caiado. The panel records the figure without building a thesis on it, because in that band variation carries little informational value. ZEMA remains at 0.35%, below the 0.5% cut, with 4.00% in the third-place contract. HADDAD rose 0.10pp, to 0.15%, and the caveat stands: he is not a presidential candidate and is running for governor of São Paulo.`,

  'quadroComparativo[0].p':
    `NO NEW POLL ON AUG 12. Still standing are the three from Aug 11: CNT/MDA (n=2,002, in person, BR-06935/2026) with 42.4% and 48% x 39% in the runoff; Futura (n=2,000, telephone, BR-08109/2026) with 38.8% and 46.5% x 44%; and Gerp (n=2,400, telephone, BR-08045/2026) with a tie at 38% and a loss by 45% x 43%.`,
  'quadroComparativo[0].m': `63.50% (vol USD 8.22M cumulative), ${S}`,
  'quadroComparativo[0].t':
    `FOURTH DAY RUNNING at the same value, since Aug 9. The gap fell 0.40pp, to 35.85pp, and the fall came from the challenger's end. In the 90-day series, 17 of the 88 had a value equal to or above it.`,
  'quadroComparativo[0].s':
    `53 days to the election. 📅 PoderData publishes on Aug 13, Quaest on Aug 14 and Nexus on Aug 17, all three national.`,
  'quadroComparativo[1].m': `27.65% (vol USD 8.13M), ${S}`,
  'quadroComparativo[1].t':
    `ROSE 0.40pp in the presidential. ⭐ And 3.50pp in the first-round runner-up contract, to 84.00%, which was the largest move of the day in any book. It is not extreme: 22 of the 88 days had a value equal to or above it.`,
  'quadroComparativo[1].s':
    `Estadão reported that Tereza Cristina met his team to weigh taking part in the campaign, and that he is courting leaders of neutral parties for a women's platform.`,
  'quadroComparativo[2].m': `7.45% (vol USD 9.48M), ${S}`,
  'quadroComparativo[2].t':
    `GAVE WAY in both contracts: 0.30pp in the presidential and 1.50pp in the third-place one, to 62.50%. In the 90-day series, more than 80 of the 88 had a value equal to or above it.`,
  'quadroComparativo[3].m': `0.95% (vol USD 5.66M), ${S}`,
  'quadroComparativo[3].t':
    `⭐ BOTH WAYS ON THE SAME DAY: he fell 0.10pp in the contract about winning, dropping below 1% and 0.05pp from the floor of the series, and rose 2.00pp in the third-place one, to 31.50%.`,
  'quadroComparativo[4].m': `0.35% (vol USD 5.07M), ${S}`,
  'quadroComparativo[4].t':
    `NO CHANGE, and he remains below the 0.5% cut that separates price from noise. In the first-round third-place contract he marks 4.00%.`,
  'quadroComparativo[5].m': `3.90% (vol USD 83 thousand), ${S}`,
  'quadroComparativo[5].t':
    `ROSE 0.10pp against Aug 11. It remains the thinnest contract among those tracked, and any move in it demands that caveat.`,
  'quadroComparativo[5].s':
    `The judicial fact of the day is large and has no direct bearing on this contract: Moraes, Dino, Gilmar Mendes and Zanin ordered seven courts of justice to return penduricalhos, citing exorbitant payments, and Moraes said 1,100 magistrates received more than R$ 100 thousand a month.`,

  cruzamento:
    `THE DAY BROUGHT NO NEW NATIONAL POLL, AND THE PRICE MOVED WHERE THE ELECTION IS NOT DECIDED. The prices on this page are from the ${S}, confirmed by two independent readings taken eight minutes apart. IN THE CONTRACT ABOUT WHO WINS almost nothing budged: the leader stayed at 63.50% for the fourth day running, since Aug 9, and the gap narrowed 0.40pp, to 35.85pp, entirely through the challenger's end. ⭐ IN THE CONTRACT ABOUT WHO FINISHES SECOND IN THE FIRST ROUND, the runner-up rose 3.50pp, from 80.50% to 84.00%, and that was the largest move of the day in any book tracked. Winning and reaching the runoff are different questions, and today the money moved the second one. ⭐ THE MOST INTERESTING CROSSING IS CAIADO'S, WHICH POINTS BOTH WAYS: he fell 0.10pp in the contract about winning, dropping below 1% and 0.05pp from the floor of the series, and rose 2.00pp in the third-place one, to 31.50%. Lowering the chance of winning and raising the chance of finishing third is not a contradiction, they are two questions. IN THE POLLING NOTHING CHANGED, and that is information: the three national polls of Aug 11 remain the most recent, eleven points apart in the runoff, and the next one is PoderData on Aug 13. The presidential book adds up to USD 122.49M in cumulative volume. ⚠️ No cause is attributed to the day's moves, because there is no measurement linking them to an identifiable event.`,
})
