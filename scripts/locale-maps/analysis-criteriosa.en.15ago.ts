/**
 * Mapa EN de 15/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 15".
 */
import { construir } from '../build-locale-json'

const NOVO = 'confirmed reading of Aug 15, 13:33 BRT (16:33 UTC)'
const VELHO = 'confirmed reading of Aug 14, 14:46 BRT'

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 15, 50 days from the first round. PRICE: there is a new confirmed reading for the leader and for the runner-up, ${NOVO}. For Renan Santos, for the trailing pack and for the second and third place contracts, the Senate one and the STF impeachment one there is no new reading on Aug 15, and the values of Aug 14, 14:46 BRT still stand. POLLS: Quaest released on Aug 14 at 21:00, after yesterday's capture, with 38% x 31% in the first round and 43% x 40% in the runoff (n=2,004, BR-06773/2026). REGISTRY: the candidate registration deadline closes today, Aug 15.`,

  'candidates[0].header':
    `PRICE WITH A NEW READING ON Aug 15: 64.50% (vol USD 8.29M cumulative). The price went from 63.50% on Aug 14 to 64.50% now, up 1.00pp, breaking a level it had held for seven days. POLLS: Quaest of Aug 14 gives him 38% in the first round and 43% in the runoff, the floor of the window in the first case.`,
  'candidates[0].fortes[0]': `He broke upward after seven days stuck at 63.50%, up 1.00pp, returning to the level last seen on Aug 8.`,
  'candidates[0].fortes[1]': `He remains ahead in all nine national polls since Aug 5, in both rounds, without exception.`,
  'candidates[0].fortes[2]': `Quaest of Aug 14 shows government approval in a technical tie, 46% against 48%, his best net since Aug 5 and well above the 43% against 50% from PoderData of Aug 13.`,
  'candidates[0].fortes[3]': `His rejection is LOWER than his opponent's in Quaest, 52% against 54%, and this is the first national poll of the window to separate the two on that indicator.`,
  'candidates[0].fortes[4]': `The cumulative volume of his contract rose to USD 8.29M, and the distance to the runner-up WIDENED on price even as the polls narrowed it.`,
  'candidates[0].fracos[0]': `The 38% from Quaest is the FLOOR of the nine national polls since Aug 5, whose range runs from 38% to 44%.`,
  'candidates[0].fracos[1]': `Against Quaest's own Aug 5 round he gave up 1 point in the first round and 1 point in the runoff, and both distances narrowed by 2pp.`,
  'candidates[0].fracos[2]': `In the Quaest runoff the difference is 3pp, with a 2pp margin, that is, close to the threshold of a technical tie.`,
  'candidates[0].fracos[3]': `Series caveat: among the 174 points recorded since May 18, 17 had a value equal to or above 64.50%, with a peak of 66.50% on Aug 1.`,
  'candidates[0].fracos[4]': `Government disapproval remains above approval in every house of the window, with a net between 2pp and 7pp negative.`,
  'candidates[0].analise':
    `THE PRICE BROKE UPWARD AND THE POLLS NARROWED, AND THE TWO MOVED IN OPPOSITE DIRECTIONS. On the market he went from 63.50%, where he had stood for seven days, to 64.50% (vol USD 8.29M cumulative), up 1.00pp, returning to the level last seen on Aug 8. In the polls the opposite happened: Quaest, released on Aug 14 at 21:00, shows both distances NARROWING against the house's own previous round, from 9pp to 7pp in the first round and from 5pp to 3pp in the runoff, and the movement is symmetrical, with him giving up 1 point and his opponent gaining 1 point in each round. His 38% is the floor of the nine national polls since Aug 5. ⚠️ The panel records both movements and does not reconcile them: they are different instruments measuring different questions, and the divergence is the data, not the problem. Series caveat: among the 174 points recorded since May 18, 17 had a value equal to or above today's, and the peak remains 66.50%, from Aug 1. On rejection, Quaest brings the first separation of the window: 52% for him against 54% for his opponent, where PoderData of Aug 13 had tied them at 48%.`,

  'candidates[1].header':
    `PRICE WITH A NEW READING ON Aug 15: 28.15% (vol USD 8.23M cumulative). The price went from 27.85% on Aug 14 to 28.15% now, up 0.30pp. POLLS: Quaest of Aug 14 gives him 31% in the first round and 40% in the runoff, narrowing both distances against the house itself.`,
  'candidates[1].fortes[0]': `He rose for the second straight day, 0.30pp on Aug 15 after 0.20pp on Aug 14.`,
  'candidates[1].fortes[1]': `Quaest of Aug 14 is the first national poll to show him narrowing BOTH rounds against the house itself, from 9pp to 7pp and from 5pp to 3pp.`,
  'candidates[1].fortes[2]': `In the Quaest runoff he is 3pp from the leader, with a 2pp margin, and Gerp of Aug 11 remains the only national poll of the window to put him ahead.`,
  'candidates[1].fortes[3]': `Across the nine national polls since Aug 5 he ranged from 30% to 38% in the first round, and Quaest places him at 31%, above the house's own floor.`,
  'candidates[1].fortes[4]': `His presidential candidacy was registered on Aug 14, hours after Nunes Marques restored his PL affiliation, which closes the registry episode ahead of the Aug 15 deadline.`,
  'candidates[1].fracos[0]': `Even while rising, his distance to the leader WIDENED on price, from 35.65pp to 36.35pp, because the leader rose more than he did.`,
  'candidates[1].fracos[1]': `Quaest gives him the HIGHEST rejection on the board, 54%, above the leader's 52%, and it is the first national poll of the window to separate the two.`,
  'candidates[1].fracos[2]': `Series caveat: among the 172 points recorded since May 18, 23 had a value equal to or above 28.15%, with a peak of 33.20% on Jun 2 and a floor of 22.00% on Jul 3.`,
  'candidates[1].fracos[3]': `The spread between houses on him remains above 8pp in the window, from 30% to 38% in the first round.`,
  'candidates[1].fracos[4]': `In the Quaest first round he has 31%, against the 41% PoderData of Aug 13 gives the leader on the same indicator, and the distance between houses on his own standing is large.`,
  'candidates[1].analise':
    `HE ROSE IN THE POLLS AND ROSE ON PRICE, AND STILL ENDED UP FURTHER BEHIND. The price went from 27.85% to 28.15% (vol USD 8.23M cumulative), up 0.30pp and a second straight day of gains. In the polls, Quaest of Aug 14 is the first national poll to show him narrowing both rounds against the house itself: from 9pp to 7pp in the first round and from 5pp to 3pp in the runoff, with a symmetrical movement of 1 point on each side. ⚠️ And here is the crossing of the day: despite both gains, his distance to the leader on price WIDENED, from 35.65pp to 36.35pp, because the leader rose 1.00pp against his 0.30pp. The polls brought them closer and the price pushed them apart, over the same pair of days. Series caveat: among the 172 points recorded since May 18, 23 had a value equal to or above today's, and the peak remains 33.20%, from Jun 2. At the registry the episode closed: the candidacy was registered on Aug 14, hours after Nunes Marques restored the PL affiliation, and the registration deadline closes on Aug 15. ⛔ Quaest gives him the highest rejection on the board, 54%, and the panel records that alongside the gains, without choosing which of the two counts more.`,

  'candidates[2].header':
    `THERE IS NO NEW CONFIRMED READING FOR HIM ON Aug 15, and the value displayed is that of the last confirmed reading, from Aug 14, 14:46 BRT, at 7.15% (vol USD 9.59M cumulative). POLLS: Quaest of Aug 14 gives him 4% in the first round, the same value the house gave him on Aug 5.`,
  'candidates[2].fortes[0]': `He keeps the largest cumulative volume in the presidential book among names above 1%, at USD 9.59M in the last confirmed reading.`,
  'candidates[2].fortes[1]': `Quaest of Aug 14 keeps him at 4% in the first round, exactly the same value as Aug 5, with no loss against the house itself.`,
  'candidates[2].fortes[2]': `His price remains BETWEEN the two polling methods, above the 4% of telephone and in-person and below the 10% of Palver online.`,
  'candidates[2].fortes[4]': `Gazeta do Povo published his government programme this week, and his party was not named as the author in the TSE records episode.`,
  'candidates[2].fracos[0]': `There is no new confirmed reading for him on Aug 15, so the panel publishes no movement.`,
  'candidates[2].fracos[1]': `He tied with himself in Quaest, at 4% on Aug 5 and 4% on Aug 14, with no gain in nine days.`,
  'candidates[2].fracos[2]': `In PoderData of Aug 13 he is the only one in the pack whom the leader BEATS in the runoff, while the other three tie.`,
  'candidates[2].fracos[3]': `In telephone and in-person national polls he sits between 4% and 5%, below what the price assigns him.`,
  'candidates[2].fracos[4]': `The method effect remains the reading on him: the same name runs from 4% to 10% depending on the interview environment.`,
  'candidates[2].analise':
    `THERE IS NO NEW CONFIRMED READING FOR HIM ON Aug 15, and the value displayed is that of Aug 14, 14:46 BRT, at 7.15% (vol USD 9.59M cumulative). In the polls, Quaest of Aug 14 keeps him at 4% in the first round, exactly the same value the house gave him on Aug 5, which means nine days without any gain against its own ruler. He still holds the largest cumulative volume in the presidential book among names above 1%, and the price remains positioned between the two polling methods, above the 4% of telephone and in-person and below the 10% of Palver online. The method effect remains the central reading on him, and the caveat was declared by Palver itself. In the runoff scenario of PoderData of Aug 13 he is the only one of the four tested whom the leader beats, while Caiado, Zema and the runner-up all tie.`,

  'candidates[3].header':
    `THERE IS NO NEW CONFIRMED READING ON Aug 15 for any name in the trailing pack, and the values displayed are those of Aug 14, 14:46 BRT. POLLS: Quaest of Aug 14 gives 4% to CAIADO and 2% to ZEMA, and brings a new data point on the first, with rejection at 35% and high non-recognition.`,
  'candidates[3].subtitle':
    `Aug 15, 50 days from the first round: no new price reading for the pack, and Quaest adds the missing piece about Caiado, which is rejection at 35% on a board where the top two are both above 50%.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), presidential Poly 1.05% (vol USD 5.70M cumulative, ${VELHO}), no new reading on Aug 15 | polls in force: Quaest 4%, Gerp 4%, Meio/Ideia 5.7%, BTG/Nexus 5% | REJECTION at 35% in Quaest of Aug 14`,
  'candidates[3].caiado.fortes':
    `Quaest of Aug 14 gives him 4% in the first round, the same as Gerp and as Quaest's own Aug 5 round, and brings the data point that was missing about him: REJECTION at 35%, well below the 54% and 52% of the top two, with high non-recognition. He continues to tie with the leader in the runoff of PoderData of Aug 13, according to CNN Brasil and Bnews, his second tie in four days.`,
  'candidates[3].caiado.fracos':
    `There is no new price reading for him on Aug 15. Low rejection with high non-recognition is not the same as acceptance: it means most of the electorate has not yet formed an opinion, and an unformed opinion can go either way. He remains at 4% to 5.7% in the first round against a little over 1% of winning price.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), presidential Poly 0.35% (vol USD 5.07M cumulative, ${VELHO}), no new reading on Aug 15 and below the 0.5% cutoff | polls in force: Quaest 2%, Gerp 2%, Meio/Ideia 2.6%, BTG/Nexus 3%`,
  'candidates[3].zema.fortes':
    `Quaest of Aug 14 keeps him at 2% in the first round, the same value as Aug 5. He remains the only one in the pack with a candidacy registration already filed with the TSE, done on Aug 6 with R$ 178.7 million declared, and for that reason the deadline closing on Aug 15 does not press him.`,
  'candidates[3].zema.fracos':
    `There is no new reading for him on Aug 15, and the price remains below the 0.5% cutoff the panel uses to separate price from noise. In the polls he runs from 2% to 3% in the first round, the narrowest band in the pack, and he tied with himself in Quaest between Aug 5 and Aug 14.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), presidential Poly 0.15% (vol USD 7.06M cumulative, ${VELHO}), no new reading on Aug 15 and below the 0.5% cutoff | NOT tested by the national polls in force, because he is running for the governorship of São Paulo`,
  'candidates[3].haddad.fracos':
    `Quaest of Aug 14 does not test him in a presidential scenario, and no national poll of the window includes him. The underlying caveat remains and must be stated clearly: he is NOT a presidential candidate, he is running for the governorship of São Paulo, and any scenario that includes him is a polling hypothesis, not a candidacy under way.`,
  'candidates[3].fortes[0]': `Quaest of Aug 14 brings the piece that was missing about Caiado: rejection at 35%, against 54% and 52% for the top two.`,
  'candidates[3].fortes[1]': `Caiado remains at 4% to 5.7% in the first round depending on the house, ahead of the other names in the pack.`,
  'candidates[3].fortes[2]': `Zema is the only one in the pack with a candidacy registration already filed with the TSE, done on Aug 6, and for that reason he is outside the squeeze of the deadline closing on Aug 15.`,
  'candidates[3].fortes[3]': `Neither Caiado nor Zema lost ground against Quaest's own Aug 5 round between Aug 5 and Aug 14; both repeated their previous values.`,
  'candidates[3].fracos[0]': `There is no new confirmed price reading for any name in the pack on Aug 15.`,
  'candidates[3].fracos[1]': `The distance between polls and price remains the largest on the panel: 4% to 5.7% of declared intention for Caiado against a little over 1% of winning price.`,
  'candidates[3].fracos[2]': `Low rejection with high non-recognition is not acceptance, and Quaest declares that non-recognition for Caiado.`,
  'candidates[3].fracos[3]': `No name in the pack goes above 5.7% in the first round in any national poll of the window, and none gained against the house itself.`,
  'candidates[3].fracos[4]': `Haddad is not a presidential candidate and is running for the governorship of São Paulo, so his contract measures a hypothesis, not a candidacy.`,
  'candidates[3].analise':
    `⭐ QUAEST OF Aug 14 BROUGHT THE PIECE THAT WAS MISSING ABOUT THE PACK, AND IT IS NOT VOTING INTENTION. IT IS REJECTION: Caiado appears at 35%, against 54% for the runner-up and 52% for the leader, and the house itself declares that non-recognition of him is high. ⚠️ The two go together and do not separate: someone who is not known is not rejected, and an unformed opinion can go either way. The panel records the figure and the caveat in the same breath, because publishing only the low rejection would suggest a ceiling the data does not support. On voting intention nothing changed: Caiado repeated the 4% and Zema the 2% that Quaest itself gave them on Aug 5, that is, nine days without movement against the same ruler. There is no new confirmed price reading for any of them on Aug 15, and the values displayed are those of Aug 14. The distance between polls and price remains the largest on the panel.`,

  'quadroComparativo[0].p': `NEW NATIONAL POLL: Quaest of Aug 14 (n=2,004, fieldwork Aug 10 to Aug 13, BR-06773/2026) with 38% in the first round and 43% in the runoff. Against the house's own Aug 5 round he gives up 1 point in both. Rejection at 52%, below his opponent's 54%. Government approval at 46% against 48% disapproval.`,
  'quadroComparativo[0].m': `64.50% (vol USD 8.29M cumulative), ${NOVO}`,
  'quadroComparativo[0].t': `BROKE UPWARD after seven days at 63.50%, up 1.00pp, returning to the level of Aug 8. SERIES CAVEAT: among the 174 points recorded since May 18, 17 had a value equal to or above 64.50%, with a peak of 66.50% on Aug 1 and a floor of 39.50% on May 26. The distance to the runner-up WIDENED, from 35.65pp to 36.35pp.`,
  'quadroComparativo[0].s': `50 days to the election. The 38% from Quaest is the floor of the nine national polls since Aug 5. 📅 Nexus publishes on Aug 17 and Real Time Big Data on Aug 19.`,
  'quadroComparativo[1].p': `NEW NATIONAL POLL: Quaest of Aug 14 gives him 31% in the first round and 40% in the runoff, gaining 1 point in both against the house's own Aug 5 round. REJECTION at 54%, the highest on the board and above the leader's 52%.`,
  'quadroComparativo[1].m': `28.15% (vol USD 8.23M cumulative), ${NOVO}`,
  'quadroComparativo[1].t': `SECOND STRAIGHT DAY OF GAINS, 0.30pp on Aug 15 after 0.20pp on Aug 14. ⚠️ Even while rising he ended up FURTHER from the leader, because the leader rose 1.00pp. SERIES CAVEAT: among the 172 points since May 18, 23 had a value equal to or above 28.15%, with a peak of 33.20% on Jun 2 and a floor of 22.00% on Jul 3.`,
  'quadroComparativo[1].s': `His presidential candidacy was registered on Aug 14, hours after Nunes Marques restored his PL affiliation, according to Brasil de Fato. The registration deadline closes today, Aug 15.`,
  'quadroComparativo[2].p': `Quaest of Aug 14 keeps him at 4% in the first round, the same value the house gave him on Aug 5. The 5% from Gerp, the 4% from BTG/Nexus, the 4.7% from Meio/Ideia and the 10% from Palver online all still stand.`,
  'quadroComparativo[2].m': `7.15% (vol USD 9.59M cumulative), ${VELHO}`,
  'quadroComparativo[2].t': `THERE IS NO NEW CONFIRMED READING FOR HIM ON Aug 15. The value displayed is that of the last confirmed reading, from Aug 14, 14:46 BRT. He still holds the largest cumulative volume in the presidential book among names above 1%, and the price remains BETWEEN the two polling methods.`,
  'quadroComparativo[2].s': `Gazeta do Povo published his government programme this week. He tied with himself in Quaest between Aug 5 and Aug 14, at 4% in both.`,
  'quadroComparativo[3].p': `Quaest of Aug 14 gives him 4% in the first round, the same as Aug 5, and brings the new data point: REJECTION at 35%, with high non-recognition declared by the house. He continues to tie with the leader in the runoff of PoderData of Aug 13.`,
  'quadroComparativo[3].m': `1.05% (vol USD 5.70M cumulative), ${VELHO}`,
  'quadroComparativo[3].t': `THERE IS NO NEW CONFIRMED READING FOR HIM ON Aug 15. The value displayed is that of Aug 14, 14:46 BRT. The distance between polls and price remains the largest on the panel: 4% to 5.7% of declared intention against a little over 1% of winning price.`,
  'quadroComparativo[3].s': `⚠️ Rejection at 35% with high non-recognition is not acceptance: it means most of the electorate has not yet formed an opinion about him, and an unformed opinion can go either way.`,
  'quadroComparativo[4].p': `Quaest of Aug 14 keeps him at 2% in the first round, the same value as Aug 5. The 2% from Gerp, the 3% from BTG/Nexus and the 2.6% from Meio/Ideia all still stand. He ties with the leader in the runoff of PoderData of Aug 13.`,
  'quadroComparativo[4].m': `0.35% (vol USD 5.07M cumulative), ${VELHO}`,
  'quadroComparativo[4].t': `THERE IS NO NEW READING FOR HIM ON Aug 15, and the price remains below the 0.5% cutoff the panel uses to separate price from noise. The value displayed is that of Aug 14, 14:46 BRT.`,
  'quadroComparativo[4].s': `He remains the only one in the pack with a candidacy registration already filed with the TSE, done on Aug 6 with R$ 178.7 million declared, and for that reason the deadline closing today does not press him.`,
  'quadroComparativo[5].m': `3.90% (vol USD 83 thousand), ${VELHO}`,
  'quadroComparativo[5].t': `THERE IS NO NEW READING FOR THIS CONTRACT ON Aug 15. The value displayed is that of Aug 14, 14:46 BRT. It remains the thinnest contract among those tracked, and any movement in it requires that caveat.`,
  'quadroComparativo[5].s': `The STF suspended the conviction of Romero Jucá, who becomes eligible to run, according to O Globo. Justice Mendonça pledged to handle the Master and INSS cases impartially, according to G1, and the Federal Police opened an inquiry into suspected interference by a senator in an investigation in Maranhão, according to Folha de S.Paulo.`,

  cruzamento:
    `THE DAY HAS A CLEAN CROSSING, AND IT POINTS IN OPPOSITE DIRECTIONS. In the polls, Quaest released on Aug 14 at 21:00 shows both distances NARROWING against the house's own previous round: in the first round from 9pp to 7pp, with the leader giving up 1 point and the runner-up gaining 1 point, and in the runoff from 5pp to 3pp, by the same symmetrical movement. On price the opposite happened: the distance WIDENED, from 35.65pp to 36.35pp, because the leader rose 1.00pp and the runner-up rose 0.30pp. ⭐ The two instruments moved over the same pair of days and in opposite directions, and that divergence is the data. The panel neither reconciles it nor picks which of the two counts, because they measure different questions: declared voting intention and probability of winning. ⛔ No superlative: the 36.35pp gap is ordinary in the series, with 32 of the 88 recorded days registering an equal or greater value, and the peak remains 41.80pp, from Aug 1. The leader at 64.50% is not an extreme either, with 17 of the 174 points at an equal or higher level and a peak of 66.50%, from Aug 1. What is a fact is the break: he had stood at 63.50% for seven days and returned to the level last seen on Aug 8. Quaest also separated the two on rejection for the first time in the window, at 54% for the runner-up and 52% for the leader, where PoderData of Aug 13 had tied them at 48%, and it brought government approval to 46% against 48%, the best net since Aug 5. ⚠️ Two national polls two days apart disagreeing on the sign of rejection and by 5 points in the approval net is a house effect, not a shift in public opinion, and the panel prefers to show the distance between houses rather than pick one of them. At the electoral registry the candidate registration deadline closes today, Aug 15, and from tomorrow the absence of a registration stops being a pending matter and becomes a fact.`,
})
