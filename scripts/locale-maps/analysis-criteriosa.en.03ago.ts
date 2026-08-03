/**
 * Mapa EN de analysis-criteriosa.json — /atualizar-brz 03/Ago/2026.
 * Convenções: ponto decimal, vírgula de milhar. `pesquisa` é poll, `urna` é polling.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/en/glossary#${id})`

const NEXUS = G('BTG/Nexus', 'nexus-btg')
const TIE = G('statistical tie', 'empate-tecnico')
const ATLAS = G('AtlasIntel', 'atlasintel')
const STF = G('STF', 'stf')
const TSE = G('TSE', 'tse')
const R1 = G('first round', 'primeiro-turno')

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 3, 19:11 UTC, 62 days from the ${R1}. THE POLLING TIGHTENED AND THE PRICE TIGHTENED WITH IT. ${NEXUS} published today (n=2,002, fieldwork Jul 31 to Aug 2, BR-02874/2026) and its first-round gap fell from 9pp to 4pp against the institute's own Jul 27 round, with the runoff becoming a 1pp ${TIE}. In the market the gap closed from +40.95pp to +40.05pp. Both tightened for the SAME reason: Lula standing still at 65.50% (vol USD 7.92M) and Flávio rising 0.90pp, to 25.45% (vol USD 7.86M). Capture cleared only on the third attempt, with the first two blocked by the second-place book.`,

  'candidates[0].header':
    `${G('Polymarket', 'polymarket')} 65.50% (flat, vol USD 7.92M accumulated), 62 days from the election, on the day ${NEXUS} showed the polling gap falling from 9pp to 4pp. The price did not give ground, but the gap over Flávio closed 0.90pp and went to +40.05pp, because the challenger rose. Capture locked at 19:11 UTC.`,
  'candidates[0].fortes[0]':
    `He still leads all four national polls released since Jul 29, without exception, and wins the four runoff scenarios in today's ${NEXUS} round: 46% x 45% against Flávio, 46% x 42% against Caiado, 46% x 40% against Zema and 47% x 37% against Renan Santos.`,
  'candidates[0].fortes[1]':
    `His price did NOT give ground on the day the polling tightened: it stood still at 65.50% for a second straight session, which separates the polling move from the market move.`,
  'candidates[0].fortes[2]':
    `The 1pp decline in the first round and the 1pp decline in the runoff, inside ${NEXUS}, both fall WITHIN the 2pp margin. In isolation, they are not movement.`,
  'candidates[0].fortes[3]':
    `Among the four national polls since Jul 29, three put the first-round gap between 6pp and 9.3pp, and the one that tightens to 4pp is this one. The harshest reading for him is, so far, a single house.`,
  'candidates[0].fortes[4]':
    `The 2026 annual inflation contract concentrates 36.60% in the 5.00% to 5.49% band and its bands add to 99.65%, inside the coherence gate, with no runaway tail priced in.`,
  'candidates[0].fracos[0]':
    `The gap closed 0.90pp and went to +40.05pp. In the daily series, it had not been below that since Jul 30, when it marked +39.50pp.`,
  'candidates[0].fracos[1]':
    `The price sits 1.00pp BELOW the series peak, which is 66.50%, from the Aug 1 close, and the gap sits 1.75pp below the maximum of +41.80pp, from the same date.`,
  'candidates[0].fracos[2]':
    `In ${NEXUS} the runoff became a ${TIE}: 46% x 45%, a 1pp difference inside the 2pp margin. In the institute's Jul 27 round it was 4pp.`,
  'candidates[0].fracos[3]':
    `Today's round did not publish approval or disapproval, so the ratings picture has had no fresh reading since Jul 30.`,
  'candidates[0].fracos[4]':
    `The Federal Police asked the ${STF} to open a third inquiry into Lulinha, on suspicion of influence peddling (Folha and O Globo, Aug 3). The panel records the fact and attributes no electoral effect.`,
  'candidates[0].analise':
    `His day is the first in a long while in which polling and price move the same way, and that is the record. ${NEXUS} published the 8th round in the series (n=2,002, fieldwork Jul 31 to Aug 2, telephone, 2pp margin, BR-02874/2026) and the first-round gap fell from 9pp to 4pp against the institute's own Jul 27 round. In the market, the gap closed from +40.95pp to +40.05pp. The coincidence of direction is real and the mechanism is the same in both: LULA DID NOT GIVE GROUND, and the one who moved was the challenger. In the polling he lost 1pp, within the margin; in the price he stood exactly still at 65.50% (vol USD 7.92M), for a second straight session. WORTH SEPARATING WHAT THIS IS NOT. It is not convergence in LEVEL: the market pays 65.50% probability of victory and the polling measures 41% of first-round voting intention, and those two quantities neither subtract from nor compare with each other in level. What coincided was direction and cause. THE PEAK IS STILL BEHIND US and the window has to be stated: the series maximum is 66.50%, from the Aug 1 close, and the gap's is +41.80pp, from the same date. In the daily series, the gap had not been below today's +40.05pp since Jul 30. THE HARSHEST READING COMES FROM A SINGLE HOUSE, for now: the other three national polls released since Jul 29 give 6pp from PoderData, 9.1pp from ${ATLAS} and 9.3pp from Vox Brasil. The distance between the highest and the lowest reading reaches 5.3pp, and it is larger than any price move in the period. The two national polls still outstanding in the window, ${G('Quaest', 'quaest')} and Ideia/Canal Meio, have publication declared for Aug 5, and they are where we find out whether Nexus is the outlier or the first to mark a shift in range. Away from the race, the Federal Police asked the ${STF} for a third inquiry into Lulinha, and the panel records it without attributing effect.`,

  'candidates[1].header':
    `${G('Polymarket', 'polymarket')} 25.45% (↑0.90pp, vol USD 7.86M accumulated), the strongest move of the session among the top two, on the same day ${NEXUS} measured a 4pp rise in his polling. Capture locked at 19:11 UTC.`,
  'candidates[1].fortes[0]':
    `${NEXUS} gives 37% in the first round, against 33% in the institute's own Jul 27 round. The 4pp rise is DOUBLE the 2pp margin, so it is not explained by sampling noise.`,
  'candidates[1].fortes[1]':
    `In the runoff he goes from 43% to 45% and sits 1pp behind Lula, within the margin: it is a ${TIE} for the first time in this series from the house.`,
  'candidates[1].fortes[2]':
    `The price rose 0.90pp on the same day, to 25.45%, and closed the gap on its own, without the leader giving ground.`,
  'candidates[1].fortes[3]':
    `He is the comfortable favourite in the second-place contract, at 80.50%, which describes a runoff the market treats as all but settled.`,
  'candidates[1].fortes[4]':
    `He received an explicit endorsement from Javier Milei, who again attacked Lula publicly on Aug 2 and Aug 3 (Folha and O Globo).`,
  'candidates[1].fracos[0]':
    `His market series dismantles any reading of a comeback: the peak is 45.20%, from May 7, and the floor is 22.00%, from Jul 3. Today's 25.45% is recovery INSIDE a lowered range.`,
  'candidates[1].fracos[1]':
    `The 37% reading is the most favourable to him among the four national polls since Jul 29. The other three give first-round gaps of 6pp to 9.3pp, not 4pp.`,
  'candidates[1].fracos[2]':
    `He loses the four runoff scenarios in today's round, including the tightest one, by 46% x 45%.`,
  'candidates[1].fracos[3]':
    `The 37% in the first round remains below the level needed to force a favourable runoff without vote transfer from the rest of the field.`,
  'candidates[1].fracos[4]':
    `He asked for votes ahead of the legal deadline on Aug 1, in Santa Catarina, on the same day Lula did the same in Bahia.`,
  'candidates[1].analise':
    `He is the name of the day in both measurements, and the only one who moved meaningfully in both. In ${NEXUS} (n=2,002, fieldwork Jul 31 to Aug 2, BR-02874/2026) he goes from 33% to 37% in the first round, a 4pp rise that is double the 2pp margin and therefore not explained by noise. In the runoff he goes from 43% to 45% and comes within 1pp of Lula, which qualifies as a ${TIE}. In the market, he rose 0.90pp to 25.45% (vol USD 7.86M), single-handedly responsible for closing the gap, because Lula gave up nothing. TWO CAVEATS CHANGE THE READING. The first is about the series: his market peak is 45.20%, from May 7, and his floor is 22.00%, from Jul 3. That is, 25.45% is recovery inside a range that was once nearly double, and calling it a comeback would be changing the yardstick. The second is about dispersion: the 37% is the most favourable reading for him among the four national polls released since Jul 29, and the other three give gaps of 6pp from PoderData, 9.1pp from ${ATLAS} and 9.3pp from Vox Brasil, against 4pp here. One house measuring differently from the other three is not a trend yet, it is one house measuring differently. What makes this round weigh more than an ordinary divergence is that the market moved the same way and on the same day, which does not usually happen on this panel. The test arrives on Aug 5, with ${G('Quaest', 'quaest')} and Ideia/Canal Meio. In the second-place contract he stands at 80.50%, and in the third-place contract he appears at only 4.90%, which describes a market treating his path to the runoff as all but resolved.`,

  'candidates[2].header':
    `${G('Polymarket', 'polymarket')} 7.45% (↓0.50pp, vol USD 8.86M accumulated), undoing yesterday's rise. ${NEXUS} gave 4% in the polling, and the distance between price and polling stands at 3.45pp. Capture locked at 19:11 UTC.`,
  'candidates[2].fortes[0]':
    `He has the largest accumulated volume among names priced above 1%, with USD 8.86M, above Lula's own USD 7.92M, at one eighth of his price.`,
  'candidates[2].fortes[1]':
    `He is the favourite in the third-place contract, at 60.50%, well ahead of Caiado, who is at 25.00%.`,
  'candidates[2].fortes[2]':
    `The ${G('Novo', 'novo')} party is losing ground as the anti-establishment party and the panel records O Globo's reading (Aug 2) that he is positioning himself against Zema in that space.`,
  'candidates[2].fortes[3]':
    `VEJA points to an age bracket in which he stands apart from the rest of the third way in today's ${NEXUS} round.`,
  'candidates[2].fortes[4]':
    `The 7.45% price remains well above the 4% polling, which describes a market paying for a scenario that declared voting intention does not yet show.`,
  'candidates[2].fracos[0]':
    `He FELL 0.50pp today, undoing yesterday's 0.35pp rise, which had broken nine straight sessions of decline.`,
  'candidates[2].fracos[1]':
    `${NEXUS} gave 4%, against 5% in the institute's own Jul 27 round. It is the fourth straight national poll measuring him between 3% and 4%, after the 7.8% of ${ATLAS} on Jul 29.`,
  'candidates[2].fracos[2]':
    `He loses the runoff against Lula by 47% x 37%, the worst of the four simulations in today's round.`,
  'candidates[2].fracos[3]':
    `The distance between price (7.45%) and polling (4%) stands at 3.45pp, and it sits on the price side, not the polling side.`,
  'candidates[2].fracos[4]':
    `High volume with a falling price describes an old position left open, not current conviction.`,
  'candidates[2].analise':
    `His case remains the widest distance between what the market pays and what the polling measures, and today the distance narrowed from both wrong sides. In price, he FELL 0.50pp to 7.45% (vol USD 8.86M), undoing yesterday's 0.35pp rise, which had broken nine straight sessions of decline. In polling, ${NEXUS} gave 4%, against 5% in the institute's own Jul 27 round. The distance between the two measurements stands at 3.45pp, against 4.95pp yesterday, and the narrowing comes from the price giving way, not from the polling rising. THE POLLING SEQUENCE IS WHAT WEIGHS MOST: after the 7.8% of ${ATLAS} on Jul 29, four straight national polls measured him between 3% and 4%, with PoderData at 4%, Vox Brasil at 3.0% and now Nexus at 4%. One isolated high reading against four consistent low ones is the classic outlier pattern, and the panel records it that way. VOLUME REMAINS THE ANOMALY OF THE PIECE: with USD 8.86M accumulated, he has more money traded than Lula, who has USD 7.92M, at a price that is one eighth of his. High volume with a falling price describes an old position left open, not conviction now. In the third-place contract he remains the favourite at 60.50%, against Caiado's 25.00%, which is consistent with a market that sees him finishing third rather than contesting the runoff.`,

  'candidates[3].header':
    `Convention day for two of them. Caiado at 1.15% (vol USD 5.30M) and Zema at 0.25% (vol USD 4.66M) were formally nominated as candidates on Aug 3. Haddad PULLED BACK to 0.15% (vol USD 6.64M). Capture locked at 19:11 UTC.`,
  'candidates[3].fortes[0]':
    `CAIADO was formally nominated at his party convention and ${NEXUS} gave him 5% in the first round, behind only the 5.5% of Vox Brasil on Jul 31 among national polls since Jul 29.`,
  'candidates[3].fortes[1]':
    `In today's runoff, Caiado loses to Lula by 46% x 42%, the second narrowest margin among the four scenarios tested.`,
  'candidates[3].fortes[2]':
    `Caiado is the second name in the third-place contract, at 25.00%, behind only Renan Santos.`,
  'candidates[3].fortes[3]':
    `ZEMA was formally nominated and announced a move from Belo Horizonte to São Paulo for the campaign (O Globo, Aug 3).`,
  'candidates[3].fortes[4]':
    `Caiado's price, at 1.15%, sits above the 0.90% floor the series touched intraday on Aug 2.`,
  'candidates[3].fracos[0]':
    `CAIADO promised to pardon Bolsonaro and those convicted over Jan 8 and called the institutional response to the coup attempt the greatest disaster in history (Valor, Aug 3), which puts him competing for the same electorate as Flávio, who gained 4pp in the polling today.`,
  'candidates[3].fracos[1]':
    `ZEMA remains at 0.25% in the market and 3% in ${NEXUS} polling, with no movement on the day of his own convention.`,
  'candidates[3].fracos[2]':
    `HADDAD pulled back to 0.15% (vol USD 6.64M). He is not a candidate, and the contract prices a replacement scenario.`,
  'candidates[3].fracos[3]':
    `In the runoff, Zema loses to Lula by 46% x 40%, the second widest margin among the round's four scenarios.`,
  'candidates[3].fracos[4]':
    `The three combined do not reach 1.60% in the market, against Flávio's 25.45%, which describes a third space the price does not treat as competitive.`,
  'candidates[3].analise':
    `It was the third way's convention day and the market reacted to neither of them. CAIADO, formally nominated, stands at 1.15% (vol USD 5.30M), above the 0.90% floor the series touched intraday on Aug 2, and ${NEXUS} gave him 5% in the first round, against 6% in the institute's own Jul 27 round. In his convention speech he promised to pardon Bolsonaro and those convicted over Jan 8 and called the institutional response to the coup attempt the greatest disaster in history (Valor, Aug 3), and on the same day he contested the agribusiness vote with Flávio, saying he is the root and not the agro flavour (G1, Aug 3). THAT IS THE CROSS-READING THAT MATTERS: he went after that electorate on exactly the day Flávio gained 4pp in the polling and 0.90pp in the price, and neither the polling nor the market recorded a gain for him. ZEMA was also formally nominated and announced a move from Belo Horizonte to São Paulo for the campaign, and he remains at 0.25% in the market and 3% in the polling, with no movement on his own day. HADDAD pulled back to 0.15% (vol USD 6.64M), and it bears repeating that he is not a candidate: that contract prices a replacement scenario, so the level speaks to perceived risk around the ${G('PT', 'pt')} ticket, not to a race under way. Combined, the three do not reach 1.60% in the market, against Flávio's 25.45%. The third space exists in the polling, where Caiado has 5% and Zema 3%, and does not exist in the price.`,

  'quadroComparativo[0].p':
    `FRESH POLLING. ${NEXUS} of Aug 3 (n=2,002, fieldwork Jul 31 to Aug 2, telephone, 2pp margin, 95% confidence, BR-02874/2026): 41% in the first round and 46% x 45% in the runoff against Flávio. In the institute's own Jul 27 round it was 42% and 47% x 43%.`,
  'quadroComparativo[0].m': `65.50% (vol USD 7.92M accumulated)`,
  'quadroComparativo[0].t':
    `FLAT at 65.50% for a second session. The gap over Flávio CLOSED 0.90pp and went to +40.05pp, but it closed on the challenger's rise. The price sits 1.00pp below the series peak, which is 66.50%, from the Aug 1 close.`,
  'quadroComparativo[0].s':
    `62 days from the election. The round did not publish approval or disapproval. The Federal Police asked the ${STF} for a third inquiry into Lulinha, and the panel records it without attributing effect. Capture locked Aug 3, 19:11 UTC.`,
  'quadroComparativo[1].p':
    `${NEXUS} of Aug 3: 37% in the first round, against 33% on Jul 27 from the same house, a 4pp rise that is double the margin. In the runoff, 45% against Lula's 46%, a ${TIE} inside the 2pp margin.`,
  'quadroComparativo[1].m': `25.45% (vol USD 7.86M accumulated)`,
  'quadroComparativo[1].t':
    `ROSE 0.90pp, the strongest move of the session among the top two, and closed the gap on his own. Series caveat: his peak is 45.20% on May 7 and his floor is 22.00% on Jul 3.`,
  'quadroComparativo[1].s':
    `Favourite in the second-place contract at 80.50%. Received an explicit endorsement from Milei, who again attacked Lula on Aug 2 and Aug 3. Capture locked Aug 3, 19:11 UTC.`,
  'quadroComparativo[2].p':
    `${NEXUS} of Aug 3: 4%, against 5% on Jul 27 from the same house. It is the fourth straight national poll measuring him between 3% and 4%, after the 7.8% of ${ATLAS} on Jul 29. He loses the runoff to Lula by 47% x 37%.`,
  'quadroComparativo[2].m': `7.45% (vol USD 8.86M accumulated)`,
  'quadroComparativo[2].t':
    `FELL 0.50pp and undid yesterday's 0.35pp rise, which had broken nine straight sessions of decline. The distance between price and polling stands at 3.45pp, against 4.95pp yesterday, and it narrowed on the price side.`,
  'quadroComparativo[2].s':
    `Largest accumulated volume among names priced above 1%, above Lula's, at one eighth of the price. Favourite in the third-place contract at 60.50%. Capture locked Aug 3, 19:11 UTC.`,
  'quadroComparativo[3].p':
    `${NEXUS} of Aug 3: 5% in the first round, against 6% on Jul 27 from the same house. In the runoff, he loses to Lula by 46% x 42%, the second narrowest margin among the four scenarios tested.`,
  'quadroComparativo[3].m': `1.15% (vol USD 5.30M accumulated)`,
  'quadroComparativo[3].t':
    `Above the 0.90% floor the series touched intraday on Aug 2. No price gain on the day of his own convention.`,
  'quadroComparativo[3].s':
    `Formally nominated at his party convention on Aug 3. Promised to pardon Bolsonaro and those convicted over Jan 8 and contested the agribusiness vote with Flávio. Second name in the third-place contract, at 25.00%.`,
  'quadroComparativo[4].p':
    `${NEXUS} of Aug 3: 3% in the first round, the same as the institute's Jul 27 round. In the runoff, he loses to Lula by 46% x 40%.`,
  'quadroComparativo[4].m': `0.25% (vol USD 4.66M accumulated)`,
  'quadroComparativo[4].t': `FLAT at 0.25%, with no movement on the day of his own convention.`,
  'quadroComparativo[4].s':
    `Formally nominated at his party convention on Aug 3 and announced a move from Belo Horizonte to São Paulo for the campaign. Capture locked Aug 3, 19:11 UTC.`,
  'quadroComparativo[5].t':
    `FLAT at 3.10% for a second straight session, on a day of intense institutional news.`,
  'quadroComparativo[5].s':
    `Fachin said the ${STF} should live with contestation from public opinion. The Federal Police postponed the deposition of Vorcaro's former partner. Moraes's family lost a suit against a senator who cited his link to ${G('Banco Master', 'banco-master')}. None of it moved the price.`,

  cruzamento:
    `TODAY'S CROSS-READING IS RARE AND DESERVES CAREFUL WORDING: both measurements moved the SAME WAY, on the SAME DAY, and for the SAME REASON. ${NEXUS} published the 8th round in the series (n=2,002, fieldwork Jul 31 to Aug 2, telephone, 2pp margin, 95% confidence, BR-02874/2026) and the first-round gap fell from 9pp to 4pp against the institute's own Jul 27 round, with the runoff going from 4pp to 1pp, which is a ${TIE}. In the market, the capture locked at 19:11 UTC shows the gap closing from +40.95pp to +40.05pp. In both cases the mechanism is identical: LULA DID NOT GIVE GROUND and FLÁVIO ROSE. In the polling, Lula lost 1pp, within the margin, and Flávio gained 4pp, double it. In the price, Lula stood exactly still at 65.50% (vol USD 7.92M) and Flávio rose 0.90pp, to 25.45% (vol USD 7.86M). --- WHAT THIS IS NOT, AND THE DISTINCTION IS THE HOUSE METHOD. It is not convergence in LEVEL. The market pays 65.50% probability of victory and the polling measures 41% of first-round voting intention: they are different quantities, one is a chance of winning and the other a share of the vote, and subtracting one from the other produces a number with no unit. AFOS compares DIRECTION and CONVICTION, never level, and that is why there is something to record today: the two series moved the same way, which had not been happening. --- THE CAVEAT THAT BLOCKS THE EASY READING IS DISPERSION BETWEEN HOUSES. The 4pp from Nexus is the tightest reading among the four national polls released since Jul 29: PoderData of Jul 30 gave 6pp, ${ATLAS} of Jul 29 gave 9.1pp and Vox Brasil of Jul 31 gave 9.3pp. The distance between the highest and the lowest reading reaches 5.3pp, and it is LARGER than any price move in the period. One house measuring differently from the other three is not a shift in range, it is one house measuring differently, and the panel records it that way until proven otherwise. The test arrives on Aug 5, when ${G('Quaest', 'quaest')} and Ideia/Canal Meio have publication declared, the two national polls still outstanding from the window the ${TSE} filing recorded. --- THE SERIES BLOCKS THE SECOND SHORTCUT, which would be to speak of a Flávio comeback. His market peak is 45.20%, from May 7, and his floor is 22.00%, from Jul 3. Today's 25.45% is recovery INSIDE an already lowered range, not a return to the previous range. On Lula's side, the peak is 66.50% and the gap's is +41.80pp, both from the Aug 1 close, and both remain above what this panel publishes today. In the daily series, the gap had not been below +40.05pp since Jul 30, when it marked +39.50pp. --- ELSEWHERE ON THE BOARD, the day was one of conventions with no price effect. Caiado and Zema were formally nominated as candidates and neither gained in the market: Caiado is at 1.15% (vol USD 5.30M) and Zema at 0.25% (vol USD 4.66M). Caiado promised to pardon Bolsonaro and those convicted over Jan 8 and contested the agribusiness vote with Flávio, precisely on the day Flávio rose in both measurements. RENAN SANTOS fell 0.50pp to 7.45% (vol USD 8.86M), undoing yesterday's rise, with his polling at 4% and the distance between price and polling at 3.45pp. HADDAD pulled back to 0.15%. The contract on the impeachment of an ${STF} justice held FLAT at 3.10% (vol USD 83 thousand) on a day of heavy institutional news, with the Federal Police postponing the deposition of Vorcaro's former partner and asking for a third inquiry into Lulinha, which describes a market that does not price rupture from an isolated judicial development.`,
})
