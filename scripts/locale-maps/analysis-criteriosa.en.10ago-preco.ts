/**
 * Mapa EN de 10/Ago (rodada do PREÇO) para analysis-criteriosa.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 10".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const S = 'confirmed reading of Aug 10, 21:32 BRT (Aug 11, 00:32 UTC)'

construir('analysis-criteriosa', 'en', {
  subtitle:
    `UPDATE Aug 10, 55 days from the ${G('first round', 'primeiro-turno')}. TWO NEW NATIONAL POLLS: BTG/Nexus (n=2,001, telephone, BR-08428/2026) and the debut of Palver (n=5,000, online, BR-06596/2026), both published today. Prices from the ${S}, confirmed by two independent readings.`,

  // ================= LULA =================
  'candidates[0].header':
    `TWO NEW POLLS AND THEY DISAGREE WITH EACH OTHER: BTG/Nexus gives him 40% in the first round and Palver gives him 44%, with runoffs of 47% x 44% and 46% x 46%. Across the four national polls since Aug 5 he ranges from 39% to 44%, a 5pp band. ON PRICE, FLAT: 63.50% (vol USD 8.20M cumulative) at the ${S}, the same value as yesterday.`,
  'candidates[0].fortes[4]':
    `Price from the ${S} at 63.50%, with USD 8.20M in cumulative volume, and the 88-day series has a peak of 66.50%, from Aug 1.`,
  'candidates[0].fracos[3]':
    `THE GAP NARROWED AGAIN, AND NOW FOR A DIFFERENT REASON: it went to +36.25pp, against +36.55pp yesterday, and this time because the opponent ROSE 0.30pp while he stood still. Yesterday it had narrowed because he himself fell.`,
  'candidates[0].fracos[4]':
    `Series caveat that still holds: 14 of the 88 days had a price equal to or above 63.50%, so the current level is not extreme.`,
  'candidates[0].analise':
    `THE DAY BROUGHT POLLING AND IT BROUGHT PRICE, AND THE TWO POINT IN DIFFERENT DIRECTIONS. Two national polls came out and they measure the same contest with different results: BTG/Nexus, by telephone, gives 40% x 35% in the first round and 47% x 44% in the runoff; Palver, online and with n=5,000, gives 44% x 40% and a tie at 46% x 46%. Added to the two from Aug 5, that is four national polls in six days, and he appears between 39% and 44%. WHAT THE WITHIN-HOUSE COMPARISON SHOWS is the reverse of what last week showed: on Aug 3 BTG/Nexus had tightened the first round from 9pp to 4pp, and now it has widened again, to 5pp, with both giving way and the opponent giving way more. In the runoff at the same house the distance went from 1pp to 3pp. ON PRICE HE STOOD STILL at 63.50%, the same value as yesterday's reading, with USD 8.20M in cumulative volume. AND THE MECHANISM OF THE GAP FLIPPED, which is the detail that matters: the distance over the runner-up narrowed to +36.25pp, but this time because the OPPONENT rose 0.30pp, and not because the leader gave way. Yesterday it was the other way round. When only the leader falls, what exists is a loss of price in the favourite and the probability may not have gone to anyone; when only the runner-up rises, there was buying on his side. APPROVAL MOVED THE OTHER WAY, and in both readings: 46% against 49% at Nexus and 45% against 55% at Palver. Across five readings in eight days the balance runs from 1pp positive to 10pp negative. THE CROSSING THAT MATTERS is one of direction: in the same week in which the market gap narrowed on six of the last seven sessions, the BTG/Nexus gap widened in both rounds. The two instruments moved in opposite directions, and the panel records that without saying which one is right.`,

  // ================= FLÁVIO =================
  'candidates[1].header':
    `HE ROSE ON PRICE AND HE IS THE ONLY ONE IN THE CHASING PACK WHO DID: 27.25% (vol USD 8.11M cumulative) at the ${S}, up 0.30pp against yesterday. In the polling, the spread is still his number: across the four national polls since Aug 5 he comes in at 30%, 35%, 35% and 40% in the first round, a 10pp band, double the leader's.`,
  'candidates[1].fortes[4]':
    `Price from the ${S} at 27.25%, with USD 8.11M in cumulative volume, up 0.30pp and the ONLY name in the chasing pack to rise in today's reading.`,
  'candidates[1].fracos[4]':
    `The 0.30pp rise does not change the level: 26 of the 88 days in the series had a value equal to or above it, with a peak of 34.40% on May 13 and a floor of 22.00% on Jul 3.`,
  'candidates[1].analise':
    `THE MOST INFORMATIVE FIGURE ABOUT HIM IN THE POLLING IS NOT A NUMBER, IT IS A RANGE. Across the four national polls published since Aug 5 he comes in at 30%, 35%, 35% and 40% in the first round, and the distance between the highest and the lowest reading reaches 10pp. On the leader's side the same band is 5pp. In other words, the measurement uncertainty is concentrated on him, and any headline that fixes a value is choosing a house. TODAY'S TWO ILLUSTRATE THE DISTANCE: BTG/Nexus, by telephone, gives 35% and a runoff defeat by 47% x 44%; Palver, online, gives 40% and a TIE at 46% x 46%, which is the best scenario he has obtained in the window. WITHIN HIS OWN HOUSE the move went against him: BTG/Nexus had 37% on Aug 3 and now has 35%, and the first round gap widened from 4pp to 5pp precisely because of that. ON PRICE THE MOVE WENT IN HIS FAVOUR, and he is the only one in the chasing pack who rose: 27.25% in today's reading, up 0.30pp, with USD 8.11M cumulative. THE DIFFERENCE FROM YESTERDAY IS THE MECHANISM, and it needs to be said: yesterday the gap narrowed because the leader fell and he stood still; today it narrowed because he rose and the leader stood still. They are different things, even if the final number moves the same way. REJECTION REMAINS THE CEILING: 50% at Nexus and 51% at Palver, and in both he sits at the top or one point from it. ON THE BOARD, Folha de S.Paulo reported on Aug 10 that the Speaker of the lower house declared support for his opponent after his own party rejected a coalition with him, and Estadão and O Globo published a state-level Ideia/ACSP cut in São Paulo in which he takes 44% against 39% in the runoff, data that is state in scope and therefore does not enter the national panel.`,

  // ================= RENAN =================
  'candidates[2].header':
    `THE METHOD CASE OF THE DAY IS HIM, AND IT WAS THE INSTITUTE THAT DECLARED IT: Palver, online, gives him 10%, against 4% at BTG/Nexus by telephone on the same day, and 4% and 4.7% in the two from Aug 5. Palver itself assessed that the digital format may have boosted his performance. ON PRICE HE FELL 0.15pp, to 7.65% (vol USD 9.32M cumulative), at the ${S}.`,
  'candidates[2].fortes[1]':
    `Largest cumulative volume in the presidential book among the names above 1%, with USD 9.32M in today's reading, above the leader's own volume.`,
  'candidates[2].fortes[2]':
    `The market price, at 7.65%, still sits ABOVE every telephone and in-person reading, which fall between 4% and 4.7%.`,
  'candidates[2].fracos[2]':
    `The market prices him near the FLOOR of his own series and pushed him further towards it: he fell 0.15pp today, to 7.65%, and 84 of the 88 days had a value equal to or above it, with a minimum of 6.80% on Aug 6.`,
  'candidates[2].analise':
    `THIS IS THE CLEANEST CROSSING THE PANEL CAN SHOW, AND IT DEPENDS ON NO JUDGEMENT AT ALL. The same name, in the same week, comes in at 4% at Genial/Quaest in person on Aug 5, at 4.7% at Meio/Ideia by telephone the same day, at 4% at BTG/Nexus by telephone today, and at 10% at Palver over the internet, also today. The difference between the highest and the lowest reading is 6pp for a candidate that no house puts into double digits by telephone. THE CAVEAT IS NOT OURS, IT IS THE HOUSE'S: Palver assessed that the digital format may have boosted his performance, since he keeps an active base in that environment, and said it is testing approaches to reduce that effect in online polls. The panel repeats its declaration rather than judging the number, because measuring and judging are different things. AND THE PRICE STILL SITS BETWEEN THE TWO METHODS: 7.65% in today's reading, above the 4% to 4.7% of telephone and in person, below the 10% of the internet. BUT IT MOVED DOWN ON THE VERY DAY THE ONLINE POLL PUT HIM AT HIS CEILING: it fell 0.15pp, and 84 of the 88 days in the series had a value equal to or above it, with a maximum of 17.90% on Jun 9. Ceiling in the polling and floor in the price, in the same week, and both are true at the same time.`,

  // ================= CAIADO / HADDAD / ZEMA =================
  'candidates[3].header':
    `CAIADO TIES WITH LULA IN THE BTG/NEXUS RUNOFF, and that is the figure that changes the reading on him: the same round that gives a 47% x 44% defeat to the runner-up points to a tie in the matchup against Caiado. In the first round he has 5% at Nexus. Prices from the ${S}: Caiado 1.15% (vol USD 5.62M), Zema 0.45% (vol USD 5.05M) and Haddad 0.15% (vol USD 6.98M).`,
  'candidates[3].fracos[0]':
    `Caiado's price FELL again, 0.10pp, to 1.15%, and it remains dozens of times smaller than his declared voting intention, which runs from 4% to 5.7% across the national polls of the window.`,
  'candidates[3].fracos[1]':
    `Zema stood still at 0.45%, BELOW the 0.5% cut the panel uses to separate price from noise, and the reading on him remains suspended.`,
  'candidates[3].analise':
    `THE FRESH FIGURE BELONGS TO CAIADO AND IT COMES FROM THE RUNOFF. Today's BTG/Nexus points to Lula tying with him, in the same round in which the leader beats the runner-up by 47% x 44%. Added to the 40% against 48.5% at Meio/Ideia on Aug 5, the picture is of a third name who looks better in the head-to-head than off the starting line, and it is exactly the opposite of what the price shows: 1.15% in today's reading, after another 0.10pp fall, against 4% to 5.7% of declared intention. THE PANEL DOES NOT SUBTRACT ONE FROM THE OTHER, because the two quantities are not the same: the polling measures intention now and the contract measures the probability of winning at the end. What the panel records is that the distance between them is the largest of the chasing pack, and that it GREW today, because the price fell while the polling delivered his best runoff of the window. ZEMA stood still at 0.45% and remains below the 0.5% cut the panel uses to separate price from noise. HADDAD rose 0.10pp, to 0.15%, at a level where a change carries no informational value, and he remains without polling and without a presidential candidacy, running for the governorship of São Paulo. ABSENCE IS ALSO INFORMATION: Palver, which is the largest sample of the day with n=5,000, published no scenario including Caiado or Zema, and the panel records the absence rather than repeating an old number as if it were fresh.`,

  // ================= QUADRO COMPARATIVO =================
  'quadroComparativo[0].m': `63.50% (vol USD 8.20M cumulative), ${S}`,
  'quadroComparativo[0].t':
    `FLAT at the same value as yesterday. The gap over Flávio narrowed to +36.25pp, but this time because the OPPONENT rose 0.30pp, and not because he gave way. Over the window since Aug 3 the gap fell on six of the seven sessions, from +38.90pp, with one flat day.`,

  'quadroComparativo[1].m': `27.25% (vol USD 8.11M), ${S}`,
  'quadroComparativo[1].t':
    `ROSE 0.30pp and is the ONLY name in the chasing pack to rise in today's reading, after three days flat at 26.95%. It was that rise, and not a fall by the leader, that narrowed the gap today.`,

  'quadroComparativo[2].m': `7.65% (vol USD 9.32M), ${S}`,
  'quadroComparativo[2].t':
    `FELL 0.15pp on the very day the online poll put him at 10%. The price still sits BETWEEN the two methods, above the 4% to 4.7% of telephone and in person and below the 10% of the internet, and near the floor of his own series: 84 of the 88 days had a value equal to or above it.`,

  'quadroComparativo[3].m': `1.15% (vol USD 5.62M), ${S}`,
  'quadroComparativo[3].t':
    `FELL 0.10pp, and the distance between polling and price GREW on the very day he had his best runoff of the window. It is the largest distance between the two quantities in the whole chasing pack.`,

  'quadroComparativo[4].m': `0.45% (vol USD 5.05M), ${S}`,
  'quadroComparativo[4].t':
    `FLAT at 0.45%, BELOW the 0.5% cut the panel uses to separate price from noise. The reading on him remains suspended while he sits in that band.`,

  'quadroComparativo[5].m': `no number published in this round, see the note`,
  'quadroComparativo[5].t':
    `THIS PANEL PUBLISHES NO NUMBER FOR THIS CONTRACT TODAY, and the reason is the data itself: it is the thinnest among those tracked, with USD 83 thousand in cumulative volume, and today's readings did not hold up against each other. AFOS only publishes a price that two independent readings confirm, and this one did not confirm. The last confirmed value is still the one from Aug 9, 3.60%.`,

  cruzamento:
    `THE DAY BROUGHT POLLING AND IT BROUGHT PRICE, AND THE TWO POINT IN DIFFERENT DIRECTIONS. The prices on this page are from the ${S}, confirmed by two independent readings taken eight minutes apart. TWO NATIONAL POLLS CAME OUT, and what they show together is worth more than each on its own. BTG/Nexus, by telephone, n=2,001, gives a first round of 40% x 35% and a runoff of 47% x 44%. Palver, which debuts on the panel with n=5,000 and an online questionnaire, gives 44% x 40% and a TIE at 46% x 46%. Both measured the same week. THE FIRST THING TO RECORD IS THE RANGE, NOT THE POINT: adding the four national polls since Aug 5, Lula runs from 39% to 44% and Flávio runs from 30% to 40%. The measurement uncertainty is concentrated on the runner-up, with double the amplitude of the leader, and in the runoff the distance between them runs from 0pp to 5.5pp depending on the house. Choosing one poll is choosing one conclusion, and that is why the panel publishes the set. THE SECOND IS A METHOD EFFECT DECLARED BY THE VERY HOUSE THAT PRODUCED IT. Renan Santos comes in at 4% at Quaest in person, 4.7% at Ideia by telephone, 4% at BTG/Nexus by telephone and 10% at Palver over the internet. Palver assessed that the digital format may have boosted his performance, since he keeps an active base in that environment, and said it is testing approaches to reduce that effect. His price, 7.65%, sits BETWEEN the two methods, and FELL 0.15pp on the very day the online polling put him at his ceiling: 84 of the 88 days in the series had a value equal to or above it. THE THIRD IS THE MECHANISM OF THE GAP, AND IT FLIPPED WITHIN TWENTY-FOUR HOURS. The distance between the top two narrowed again, to +36.25pp against +36.55pp yesterday, and over the window since Aug 3 it fell on six of the seven sessions, from +38.90pp. But YESTERDAY it narrowed because the LEADER gave way 1.00pp with the runner-up flat; TODAY it narrowed because the RUNNER-UP rose 0.30pp with the leader flat. The number moves the same way by opposite routes, and treating the two days as the same trend would erase the difference. Flávio was the only name in the chasing pack to rise in today's reading. THE FOURTH IS ONE OF DIRECTION BETWEEN INSTRUMENTS: in the week in which the market gap narrowed, the BTG/Nexus gap WIDENED inside its own house, from 4pp to 5pp in the first round and from 1pp to 3pp in the runoff. Two instruments, the same contest, opposite directions, and the panel does not say which one is right. THE FIFTH IS APPROVAL, which worsened in both of today's readings and widened the spread: 46% x 49% at BTG/Nexus, against 47% x 48% in that house's own Aug 3 round, and 45% x 55% at Palver. Across five readings in eight days the balance runs from 1pp positive to 10pp negative and disapproval on its own runs from 47% to 55%. Before, the SIGN of the balance already depended on the house; now the SIZE depends on it too.`,
})
