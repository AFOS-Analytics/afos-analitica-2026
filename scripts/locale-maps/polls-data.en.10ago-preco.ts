/**
 * Mapa EN de 10/Ago (rodada do PREÇO) para polls-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 10".
 */
import { construir } from '../build-locale-json'

const S = 'confirmed reading of Aug 10, 21:32 BRT (Aug 11, 00:32 UTC)'

construir('polls-data', 'en', {
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] At 63.50% (vol USD 8.20M cumulative), FLAT at the same value as yesterday. THE GAP OVER FLÁVIO NARROWED TO +36.25pp, against +36.55pp yesterday, BUT THE MECHANISM FLIPPED: today it narrowed because the opponent ROSE 0.30pp with him flat, and yesterday because HE gave way 1.00pp with the opponent flat. The number moves the same way by opposite routes, and treating the two days as the same trend would erase the difference. Over the window since Aug 3 the gap fell on six of the seven sessions, from +38.90pp, with one flat day. In the 88-day series his peak is 66.50%, from Aug 1, and 14 of the 88 days had a value equal to or above the current one, so the level is not extreme.`,

  'polymarketComparison.candidates[1].polymarket': `27.25%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] At 27.25% (vol USD 8.11M cumulative). ROSE 0.30pp and is the ONLY name in the chasing pack to rise in today's reading, after three days flat at 26.95%. It was that rise, and not a fall by the leader, that narrowed the gap today. The rise does not change the level: 26 of the 88 days in the series had a value equal to or above it, with a peak of 34.40% on May 13 and a floor of 22.00% on Jul 3. In the runner-up contract he stands at 82.00%.`,

  'polymarketComparison.candidates[2].polymarket': `7.65%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] At 7.65% (vol USD 9.32M cumulative). FELL 0.15pp ON THE VERY DAY the online poll put him at 10%. WHAT THE PRICE DOES IS SIT BETWEEN THE TWO METHODS: above the 4% to 4.7% of telephone and in person, below the 10% of the internet. And at the same time near the FLOOR of his own history: in the 88-day series, 84 of them had a value equal to or above it, with a maximum of 17.90% on Jun 9 and a minimum of 6.80% on Aug 6. Ceiling in the polling and floor in the price, in the same week, and both are true. Largest cumulative volume in the presidential book among the names above 1%.`,

  'polymarketComparison.candidates[3].polymarket': `1.15%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] At 1.15% (vol USD 5.62M cumulative). FELL 0.10pp. AND THE DISTANCE BETWEEN POLLING AND PRICE GREW on the very day he had his best runoff of the window, with a tie against Lula at BTG/Nexus: 4% to 5.7% of declared intention against 1.15% of priced probability. It is the largest distance between the two quantities in the whole chasing pack. The panel records the distance without subtracting one from the other, because the polling measures intention now and the contract measures the probability of winning at the end.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] At 0.05% (vol USD 13.90M cumulative). THE CONTRAST WORTH RECORDING: this is the LARGEST cumulative volume in the whole presidential book, at USD 13.90M, and the price is at the floor. High volume with probability at the floor is conviction already priced in, not movement, and the level is low enough that changes in this band carry almost no informational value.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] At 0.45% (vol USD 5.05M cumulative), FLAT. The value is BELOW the 0.5% cut the panel uses to separate price from noise, and the reading on him remains suspended while he sits in that band. Series caveat that still holds: his maximum was 10.10%, on Apr 26.`,

  'polymarketComparison.candidates[6].polymarket': `0.15%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] At 0.15% (vol USD 6.98M cumulative), up 0.10pp at a level where a change carries no informational value. He remains without polling and without a presidential candidacy, running for the governorship of São Paulo.`,

  'polymarketComparison.note':
    `THE PRICES IN THIS SECTION ARE FROM THE ${S.toUpperCase()}, confirmed by two independent readings taken eight minutes apart. THE DAY BROUGHT POLLING AND IT BROUGHT PRICE, AND THE TWO POINT IN DIFFERENT DIRECTIONS. Two national polls were published, BTG/Nexus (n=2,001, telephone) with 40% x 35% in the first round and 47% x 44% in the runoff, and the debut of Palver (n=5,000, over the internet) with 44% x 40% and a tie at 46% x 46%. FOUR CROSSINGS COME OUT OF THAT. The first is one of amplitude: across the four national polls since Aug 5 the runner-up varies by 10pp, from 30% to 40%, against 5pp for the leader, and in the runoff the distance between them runs from 0pp to 5.5pp depending on the house. The second is one of method, and it was declared by the institute itself: Renan Santos comes in at 4% and 4.7% by telephone and in person and at 10% over the internet, and Palver assessed that the digital format may have boosted his performance, saying it is testing approaches to reduce the effect. His price, 7.65%, sits between the two methods, and FELL 0.15pp on the same day, leaving him near the floor of his own series, with 84 of the 88 days at a value equal to or above it. The third is THE MECHANISM OF THE GAP, which flipped within twenty-four hours: the distance between the top two narrowed to +36.25pp, but today it was because the RUNNER-UP rose 0.30pp with the leader flat, when yesterday it had been because the LEADER gave way 1.00pp with the runner-up flat. Flávio was the only name in the chasing pack to rise. The fourth is one of direction between instruments: in the week in which the market gap narrowed, on six of the last seven sessions, the BTG/Nexus gap WIDENED inside its own house, from 4pp to 5pp in the first round and from 1pp to 3pp in the runoff. Two instruments, the same contest, opposite directions, and the panel records the crossing without saying which one is right.`,
})
