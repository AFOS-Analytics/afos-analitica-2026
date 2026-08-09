/**
 * Mapa EN de 09/Ago para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 9".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const FR = G('first round', 'primeiro-turno')
const TSE = G('TSE', 'tse')
const STF = G('STF', 'stf')
const PF = G('PF', 'pf')
const PT = G('PT', 'pt')
const QUAEST = G('Genial/Quaest', 'quaest')

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 9, 17:34 UTC, 56 days to the ${FR}. A crossing of Polymarket (reading confirmed by two readings), ${TSE} (${QUAEST} of Aug 5 and Meio/Ideia of Aug 5, the latest national polls) and the day's press.`,

  // ─────────────────────────── LULA ───────────────────────────
  'candidates[0].header':
    `BROKE THE FIVE-DAY PLATEAU: Polymarket 63.50% (vol USD 8.18M cumulative), from the Aug 9 reading at 17:34 UTC, against 64.50% yesterday. It is the first change in his price since Aug 4, and the gap over Flávio fell to +36.55pp. HE DECLARED HIS ASSETS to the ${TSE}, around R$ 4.7 million, 35% less than in 2022. In the polling what still stands is 39% in the ${FR} from ${QUAEST} and 43% from Meio/Ideia.`,
  'candidates[0].fortes[1]':
    `It is the ONLY presidential ticket with more than one party. The Brasil Pronto Pra Mais coalition brings together seven: PDT, PSB, the ${PT}, PCdoB and PV federation, and the PSOL and Rede federation.`,
  'candidates[0].fortes[2]':
    `He consolidated 26 state platforms, against 16 organised by his rival, according to a survey published on Aug 9.`,
  'candidates[0].fortes[4]':
    `Even after today's fall, 63.50% sits above the median of his own series: in 89 days measured, 13 had a value equal to or above it.`,
  'candidates[0].fracos[0]':
    `HE LOST 1.00pp ON THE DAY, from 64.50% to 63.50%, and broke below the plateau that had held since Aug 4. The gap over Flávio narrowed from THAT SIDE ONLY, because his rival did not move.`,
  'candidates[0].fracos[1]':
    `The gap has fallen on SEVEN of the eight days since Aug 1, with a single flat day. It came from +41.80pp at the high of the series and now sits at +36.55pp.`,
  'candidates[0].fracos[2]':
    `He declared to the ${TSE} assets 35% smaller than those reported in 2022, and a 60% fall in real terms since 2018 according to Poder360, which becomes rival campaign material.`,
  'candidates[0].fracos[3]':
    `In the runner-up contract of the ${FR} he FELL from 8.20% to 6.75%, and the distance to Renan Santos in that book, which yesterday was 0.10pp, opened to 1.50pp.`,
  'candidates[0].analise':
    `TODAY HIS PRICE MOVED AGAIN, AND DOWNWARD. IN THE MARKET he is at 63.50% (vol USD 8.18M cumulative), in the Aug 9 reading at 17:34 UTC, against 64.50% yesterday. It is the first change since Aug 4, which means the five-day plateau was broken from below. The gap over Flávio fell to +36.55pp, and the distinction that matters is where it came from: FLÁVIO DID NOT RISE, he is on his third day at 26.95%. On the previous days the narrowing came from both ends, with the runner-up gaining what the leader lost. Today only the leader moved, and that describes a loss of price in the favourite, not a transfer to the rival. THE SERIES gives the yardstick: since Aug 1 the gap has fallen on seven of the eight days, with a single flat day, coming down from +41.80pp to +36.55pp. IN THE POLLING nothing changed, because no new national poll has come out since Aug 5: what stands is ${QUAEST} (n=2,004, BR-06591/2026) with 39% and a runoff of 44% x 39%, and Meio/Ideia (n=1,500, BR-04579/2026) with 43% and 48.5% x 43%. That is four days without polling measurement, and three national polls are scheduled for tomorrow, among them Palver with n=5,000. ON THE BOARD the day was paperwork and map. He declared his assets to the ${TSE}, around R$ 4.7 million, 35% smaller than reported in 2022, with Alckmin declaring R$ 3.3 million. And a survey published today counts 26 state platforms for him against 16 for his rival, which is the state-level face of the same asymmetry that already showed in the composition of the ticket.`,

  // ────────────────────── FLÁVIO BOLSONARO ──────────────────────
  'candidates[1].header':
    `THIRD DAY FLAT: Polymarket 26.95% (vol USD 8.09M cumulative), Aug 9 reading at 17:34 UTC, the same value as Aug 7 and Aug 8. The gap narrowed today without him rising. The runner-up contract STOPPED at 81.50%, after two days of falls. In the polling what still stands is 30% at Quaest and 35% at Ideia.`,
  'candidates[1].fortes[0]':
    `He remains a comfortable favourite in the runner-up contract of the ${FR}, with 81.50% (vol USD 242 thousand), and there the two-day fall STOPPED.`,
  'candidates[1].fortes[1]':
    `The 26.95% level held for three days without giving back ground, and in the 89-day series 30 of them had a value equal to or above it.`,
  'candidates[1].fortes[2]':
    `He wins among evangelicals in the ${QUAEST} cuts, and widened his advantage among voters with secondary and higher education, according to a cut published on Aug 9.`,
  'candidates[1].fortes[4]':
    `The gap to Lula fell again today, the seventh day of falls in eight, and this time without him needing to gain anything.`,
  'candidates[1].fracos[0]':
    `HE DID NOT CAPTURE WHAT THE LEADER LOST. Lula fell 1.00pp and he stood still, so the probability left the favourite without going to the runner-up.`,
  'candidates[1].fracos[1]':
    `He has been flat for three days at 26.95%, after six days running of gains. The rising run ended on Aug 6.`,
  'candidates[1].fracos[2]':
    `The runner-up contract lost 6.00pp between Aug 6 and Aug 8, from 87.50% to 81.50%, and today it merely stopped, without recovering anything.`,
  'candidates[1].fracos[3]':
    `He loses the two ${FR} scenarios and the two runoffs in force, by 9pp and by 8pp in the first round and by 5pp and 5.5pp in the runoff.`,
  'candidates[1].fracos[4]':
    `The absence of a woman on his ticket remains an issue: 2026 is the first election this century with no woman on a competitive ticket, and his answer was to talk about appointing women to the ${STF}.`,
  'candidates[1].fracos[5]':
    `On the list of Pix earmarks Dino ordered the ${PF} to investigate is his running mate, alongside the president of the Chamber and a former ${PT} leader in the Senate.`,
  'candidates[1].analise':
    `HIS DAY IS A GAIN WITHOUT MOVEMENT. IN THE MARKET he is at 26.95% (vol USD 8.09M cumulative), in the Aug 9 reading at 17:34 UTC, the same value as Aug 7 and Aug 8, third day flat. The gap to Lula fell to +36.55pp, and it narrowed WITHOUT this side rising: the one who moved was the leader, who lost 1.00pp. That distinction separates two things the final number confuses. When the gap narrows from both ends, there is a transfer between the two names. When it narrows only because the leader gives way, what exists is a loss of conviction in the favourite, and the probability may have gone to any other outcome in the book, including none. IN THE RUNNER-UP CONTRACT the fall stopped: 81.50% (vol USD 242 thousand), the same as yesterday, after losing 6.00pp between Aug 6 and Aug 8. Stopping is not recovering, and the level remains 6.00pp below that of Aug 6. IN THE POLLING nothing has changed since Aug 5: 30% at ${QUAEST} and 35% at Meio/Ideia, with runoffs of 39% and 43%. The fresh cut published today shows him widening his advantage among voters with secondary and higher education, which is a reading of the composition of that same Aug 5 poll, not fresh measurement. ON THE JUDICIAL AXIS what still stands is Dino's decision on the Pix earmarks, which reaches his running mate, the president of the Chamber and a former ${PT} leader in the Senate. The panel records the three together because separating them would be picking a side of the same decision.`,

  // ─────────────────────── RENAN SANTOS ───────────────────────
  'candidates[2].header':
    `THE MOVE OF THE DAY IS IN THE THIRD PLACE BOOK: Renan Santos jumped from 58.50% to 64.50% (vol USD 176 thousand), while Caiado fell from 31.00% to 25.50%. The transfer between the two, which had STOPPED yesterday, came back in an almost exact mirror. In the presidential book he is at 7.80% (vol USD 9.27M), against 4% and 4.7% in the polling.`,
  'candidates[2].fortes[0]':
    `HE JUMPED 6.00pp in the third place contract of the ${FR}, from 58.50% to 64.50%, the largest move by any name in the panel today.`,
  'candidates[2].fortes[1]':
    `He rose 0.15pp in the presidential book, to 7.80%, third day running of gains.`,
  'candidates[2].fortes[2]':
    `In the runner-up contract he opened up over Lula: 8.25% against 6.75%, when yesterday the two were 0.10pp apart.`,
  'candidates[2].fortes[3]':
    `Cumulative volume of USD 9.27M in the presidential book, still larger than Lula's and Flávio's, which gives the contract trading depth.`,
  'candidates[2].fortes[4]':
    `He declared R$ 795 thousand in assets to the ${TSE}, with his running mate reporting R$ 1.6 million, and is betting on the interior to grow, according to an Aug 9 report.`,
  'candidates[2].fracos[0]':
    `The gap between price and polling REMAINS the largest in the panel: 7.80% in the market against 4% at Quaest and 4.7% at Meio/Ideia, always on the price side.`,
  'candidates[2].fracos[2]':
    `In the 89-day series of the presidential book his high is 17.90% and his low is 5.50%, and 77 of the 89 days had a value equal to or above today's 7.80%.`,
  'candidates[2].fracos[4]':
    `The Aug 9 report notes that his bet on the interior runs into the structure of Missão, which means the bottleneck is organisational and not one of declared intention.`,
  'candidates[2].analise':
    `HIS DAY IS THE STRONGEST MOVE IN THE PANEL, AND IT HAPPENED IN THE THINNEST BOOK. IN THE THIRD PLACE CONTRACT OF THE ${FR} he jumped from 58.50% to 64.50% (vol USD 176 thousand), 6.00pp, while Caiado fell from 31.00% to 25.50%, 5.50pp. The transfer between the two is almost exact, and the detail matters because YESTERDAY IT HAD STOPPED: on Aug 8 Caiado fell and he did not rise alongside, and the panel recorded that the probability was leaving the book instead of migrating inside it. Today it migrated again. Two readings on consecutive days pointing in opposite directions are the reason the panel describes mechanism rather than trend. IN THE PRESIDENTIAL BOOK he went to 7.80% (vol USD 9.27M cumulative), against 7.65% yesterday, third day running of gains. IN THE RUNNER-UP CONTRACT he opened up over Lula: 8.25% against 6.75%, a distance of 1.50pp, when yesterday it was 0.10pp. The one who moved there was Lula, who fell 1.45pp in that book. IN THE POLLING he remains between 4% at Quaest and 4.7% at Meio/Ideia, so the distance runs from 3.10pp to 3.80pp, always on the price side, and today it widened. THE POLLING SEQUENCE remains what weighs most against a reading of growth: six consecutive national polls measure him between 3% and 4.7%. THE MARKET SERIES gives the other yardstick: in 89 days his presidential price ran from a high of 17.90% to a low of 5.50%, and 77 of those days had a value equal to or above today's, so 7.80% does not describe a recovery, it describes the lower half of his own history.`,

  // ────────────────── CAIADO / HADDAD / ZEMA ──────────────────
  'candidates[3].header':
    `Prices from Aug 9 at 17:34 UTC: Caiado 1.25% (vol USD 5.60M), Zema 0.45% (vol USD 5.02M) and Haddad 0.05%. CAIADO FELL FOR THE THIRD DAY in both books, and in the third place one he lost 5.50pp, going from 31.00% to 25.50%, this time with Renan Santos rising alongside. Zema moved back below the 0.5% cut. In the polling nothing changed.`,
  'candidates[3].fortes[1]':
    `Caiado remains the second name in the third place contract of the ${FR}, with 25.50%.`,
  'candidates[3].fortes[2]':
    `Zema filed his candidacy with the ${TSE} on Aug 6 and declared his assets alongside the others in the Aug 9 paperwork.`,
  'candidates[3].fortes[3]':
    `Caiado's cumulative volume, USD 5.60M, and Zema's, USD 5.02M, keep trading depth despite the low prices.`,
  'candidates[3].fortes[4]':
    `The registration window runs to Aug 15, so there is still calendar left for ticket movement in the pack.`,
  'candidates[3].fracos[0]':
    `CAIADO FELL FOR THE THIRD DAY RUNNING in both books: presidential from 1.35% to 1.25%, and third place from 31.00% to 25.50%. In the third place book alone that is 10.00pp in three days.`,
  'candidates[3].fracos[1]':
    `ZEMA fell 0.10pp, to 0.45%, and moved back BELOW the 0.5% cut the panel uses to separate price from noise.`,
  'candidates[3].fracos[3]':
    `HADDAD remains at 0.05%, the floor the market prices, and he is still not a presidential candidate.`,
  'candidates[3].fracos[4]':
    `In the Aug 9 reading the three together were worth 1.75% in the market, against 26.95% for Flávio, less than yesterday's 1.95%.`,
  'candidates[3].analise':
    `THE PACK SHRANK AGAIN, AND THE MOVEMENT WAS ALL CAIADO'S. IN THE PRICE he fell for the third day running in both books: presidential from 1.35% to 1.25%, and third place of the ${FR} from 31.00% to 25.50%. In that book alone that is 10.00pp in three days, from 33.50% on Aug 6 to the current 25.50%. THE DIFFERENCE FROM YESTERDAY IS THE MECHANISM, NOT THE DIRECTION: yesterday he fell and Renan Santos stood still, and the panel recorded that the probability was leaving the book. Today Renan rose 6.00pp against the 5.50pp he lost, which means it migrated between the two. The direction is the same on both days and what happened to the probability is not, which is why the panel describes the two cases separately instead of adding them into a trend. ZEMA fell 0.10pp, to 0.45%, and moved back below the 0.5% cut that separates price from noise, having stayed above it for a single day. HADDAD remains at 0.05%. IN THE POLLING NOTHING CHANGED, because there is no new national poll since Aug 5: Caiado still has 4% at Quaest and 5.7% at Meio/Ideia, Zema 2% and 2.6%. ON THE BOARD the day was paperwork, with the asset declarations to the ${TSE}, and the registration calendar closes on Aug 15. THE CROSSING THAT MATTERS: the three together are worth 1.75% in the winner contract, against 26.95% for the runner-up, and that proportion SHRANK again, because it was their 0.20pp that was lost while the runner-up stood still.`,

  // ──────────────────── QUADRO COMPARATIVO ────────────────────
  'quadroComparativo[0].p':
    `NO NEW NATIONAL POLL for FOUR days, since Aug 5. What still stands is ${QUAEST} (n=2,004, BR-06591/2026) with 39% in the ${FR} and 44% x 39% in the runoff, and Meio/Ideia (n=1,500, BR-04579/2026) with 43% and 48.5% x 43%. APPROVAL 48% x 47% at Quaest.`,
  'quadroComparativo[0].m':
    `63.50% (vol USD 8.18M cumulative), reading of Aug 9 17:34 UTC`,
  'quadroComparativo[0].t':
    `FELL 1.00pp and broke below the five-day plateau. First change since Aug 4. The gap over Flávio went to +36.55pp, and it narrowed from this side only.`,
  'quadroComparativo[0].s':
    `56 days to the election. HE DECLARED HIS ASSETS to the ${TSE}, around R$ 4.7 million, 35% less than in 2022, with Alckmin reporting R$ 3.3 million. An Aug 9 survey counts 26 state platforms for him against 16 for his rival. Official launch on Aug 16, at Vila Euclides.`,

  'quadroComparativo[1].p':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is 30% at Quaest, against 28% on Jul 15 from the same house, and 35% at Meio/Ideia, against 32% on Jul 8. Runoffs of 39% and 43%, he loses both. REJECTION 54%, the highest between the top two.`,
  'quadroComparativo[1].m':
    `26.95% (vol USD 8.09M), reading of Aug 9 17:34 UTC`,
  'quadroComparativo[1].t':
    `THIRD day flat at the same value. He gained relative ground without moving: the gap narrowed because the leader gave way. In the runner-up book the fall stopped at 81.50%.`,
  'quadroComparativo[1].s':
    `A cut published on Aug 9 shows him widening his advantage among voters with secondary and higher education, which is a reading of that same Aug 5 round and not fresh measurement. His running mate remains on the list of Pix earmarks Dino ordered investigated, with R$ 6.2 million untraced.`,

  'quadroComparativo[2].p':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is 4% at Quaest, against 3% on Jul 15, and 4.7% at Meio/Ideia, against 2% on Jul 8. With those, SIX consecutive national polls measure him between 3% and 4.7%. He loses the runoffs by 45% x 35% and 48% x 34.7%.`,
  'quadroComparativo[2].m':
    `7.80% (vol USD 9.27M), reading of Aug 9 17:34 UTC`,
  'quadroComparativo[2].t':
    `Rose 0.15pp in the presidential book, third day of gains, and JUMPED 6.00pp in the third place book, to 64.50%. The gap to the polling widened and runs from 3.10pp to 3.80pp.`,
  'quadroComparativo[2].s':
    `Largest cumulative volume in the presidential book among names above 1%, at USD 9.27M, above Lula's. He declared R$ 795 thousand in assets to the ${TSE}, with his running mate reporting R$ 1.6 million. An Aug 9 report notes that his bet on the interior runs into the structure of Missão.`,

  'quadroComparativo[3].p':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is 4% at Quaest, the same as Jul 15, and 5.7% at Meio/Ideia, against 4% on Jul 8. In the runoffs, 37% against 45% and 40% against 48.5%, the latter the smallest distance among the four rivals tested at Ideia.`,
  'quadroComparativo[3].m':
    `1.25% (vol USD 5.60M), reading of Aug 9 17:34 UTC`,
  'quadroComparativo[3].t':
    `FELL for the THIRD day running in both books: 0.10pp in the presidential one and 5.50pp in the third place one, to 25.50%. That is 10.00pp in that book in three days.`,
  'quadroComparativo[3].s':
    `His fall in the third place book had a DIFFERENT mechanism from yesterday's: today Renan Santos rose 6.00pp against the 5.50pp lost, which means the probability migrated between the two. Yesterday it had left the book. The divergence between institutes remains open: 4% at one house and 5.7% at the other.`,

  'quadroComparativo[4].p':
    `NO NEW NATIONAL POLL for FOUR days. What still stands is 2% at Quaest, the same as Jul 15, and 2.6% at Meio/Ideia, practically the 2.5% of Jul 8. In the runoffs, 34% against 46% and 37% against 48.5%, and he is the rival Lula beats most comfortably at Quaest.`,
  'quadroComparativo[4].m':
    `0.45% (vol USD 5.02M), reading of Aug 9 17:34 UTC`,
  'quadroComparativo[4].t':
    `Fell 0.10pp and moved back BELOW the 0.5% cut the panel uses to separate price from noise, after a single day above it.`,
  'quadroComparativo[4].s':
    `He filed his candidacy with the ${TSE} on Aug 6, declaring R$ 178.7 million in assets, and remains the only one of the pack with a registration filed. The window closes on Aug 15.`,

  'quadroComparativo[5].m':
    `3.60% (vol USD 83 thousand), reading of Aug 9 17:34 UTC`,
  'quadroComparativo[5].t':
    `ROSE 0.50pp, the first change after two days flat. It remains the thinnest contract among those tracked, and movement in it requires that caveat.`,
  'quadroComparativo[5].s':
    `What still stands is Dino's decision ordering the ${PF} to investigate R$ 55.4 million in Pix earmarks flagged by the TCU, with Flávio's running mate, the president of the Chamber and a former ${PT} leader in the Senate on the same list. The panel records the three together because separating them would be picking a side of the same decision.`,

  cruzamento:
    `TODAY THE GAP NARROWED AGAIN, AND FROM ONE SIDE ONLY. In the Aug 9 reading at 17:34 UTC, confirmed by two independent readings, Lula is at 63.50% (vol USD 8.18M cumulative) and Flávio at 26.95% (vol USD 8.09M), with a gap of +36.55pp against +37.55pp yesterday. WHAT CHANGED WAS THE LEADER: Lula lost 1.00pp and broke below the five-day plateau that had held since Aug 4, while Flávio completed his third day flat. On the previous days the narrowing came from both ends. Today it came from one, and that difference separates a transfer of probability between two names from a loss of price in the favourite. Since Aug 1 the gap has fallen on SEVEN of the eight days, with a single flat day, coming down from +41.80pp to +36.55pp. THE SECOND MOVE OF THE DAY IS IN THE THIRD PLACE BOOK, AND IT CONTRADICTS YESTERDAY'S: Renan Santos jumped 6.00pp, to 64.50%, and Caiado fell 5.50pp, to 25.50%, in an almost exact mirror. Yesterday Caiado fell without Renan rising, and the panel recorded that the probability was leaving the book instead of migrating inside it. Today it migrated. The direction was the same on both days, the mechanism was not, and that is why the panel describes them separately instead of adding them into a trend. IN THE POLLING THERE HAS BEEN NO FRESH MEASUREMENT FOR FOUR DAYS. What still stands is ${QUAEST} (n=2,004, BR-06591/2026) with 39% x 30% in the ${FR} and 44% x 39% in the runoff, and Meio/Ideia (n=1,500, BR-04579/2026) with 43% x 35% and 48.5% x 43%. Today's coverage of Quaest carries cuts by education and by placement, which are readings of that same Aug 5 round, not fresh measurement. THE CALENDAR SETTLES THAT TOMORROW: there are THREE national polls scheduled for Aug 10, among them Palver with n=5,000, plus two on Aug 11 and one on Aug 13. That is six in four days, and they are the first chance to compare the polling against a market that moved on its own all week. ON THE BOARD the day was paperwork and map: the asset declarations to the ${TSE}, with Lula reporting around R$ 4.7 million, 35% less than in 2022, and a survey counting 26 state platforms for him against 16 for his rival. The registration window closes on Aug 15, and 2026 is already the election with the highest proportion of single-party tickets since redemocratisation, at 92.3%.`,
})
