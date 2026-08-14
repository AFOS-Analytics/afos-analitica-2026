/**
 * Mapa EN de 14/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 14".
 */
import { construir } from '../build-locale-json'

const NOVO = 'confirmed reading of Aug 14, 14:46 BRT (17:46 UTC)'
const VELHO = 'last confirmed reading, from Aug 12, 16:41 BRT'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `51 days from the first round, the day had a new price reading and an institutional fact, and the bigger of the two came from neither the polls nor the market. The TSE suspended the processing of new party affiliations across the country after identifying the false registration of Flávio Bolsonaro in the Missão party and an attempt to change Lula's affiliation, according to G1, O Globo, Gazeta do Povo, CartaCapital and Money Times. The candidate registration deadline closes on Aug 15, which means the suspension lands on the eve of the cutoff.`,

  'cards.sentimento.text2':
    `Nothing changed in the polls since yesterday. Quaest releases a national poll today with 13 candidates tested, and at the time of this capture the results had not yet been published, so the national poll in force remains PoderData/Aya from Aug 13 (n=2,400, telephone, fieldwork Aug 9 to Aug 12, BR-06868/2026), with 41% in the first round for the leader against 35% for the runner-up, and 46% x 45% in the runoff. Rejection at 48% for both, exactly tied, which blocks any easy reading about who has more room to grow.`,

  'cards.sentimento.text3':
    `The third fact of the day has no counterpart in the price and is of another order: the OAS announced on Aug 13 that it will send an electoral observation mission to Brazil, headed by a former Chilean minister, according to G1, CNN Brasil and Folha de S.Paulo. International observation measures neither voting intention nor probability, and so it enters neither of the two instruments this panel crosses, but it is a relevant electoral fact of the window.`,

  'cards.sentimento.direita':
    `The runner-up had the most eventful day on the panel, and for opposite reasons. At the registry, his improper link to Missão was cancelled and his PL affiliation was restored after Justice Nunes Marques granted the requests filed, according to Folha de S.Paulo and G1, which removed the formal obstacle to registering his candidacy. On price, he was the ONLY name above 1% to rise, up 0.20pp to 27.85% (vol USD 8.20M cumulative). ⚠️ The order of events is on the record and the cause is not: both fall in the same window, and that is a calendar coincidence until measured otherwise.`,

  'cards.sentimento.esquerda':
    `The leader remains at 63.50% (vol USD 8.25M cumulative) for the sixth consecutive day in the recorded series, which shows the same value on every day from Aug 9 to Aug 14. Six days without variation in a contract of this size is information, and what it says is that the market did not react to anything that happened during the week. The attempt to change his PT affiliation was identified and blocked before it produced any effect, according to G1 and Gazeta do Povo, and his party registration did not change.`,

  'cards.sentimento.terceiraVia':
    `Renan Santos had the largest fall in the leading pack, down 0.30pp to 7.15%, even though he keeps the largest cumulative volume in the presidential book among names above 1%, at USD 9.59M. Caiado rose 0.10pp to 1.05% (vol USD 5.70M cumulative), the only one in the pack with a new reading. Zema and Haddad remain below the 0.5% cutoff the panel uses to separate price from noise and therefore receive no new reading. In the polls, PoderData from Aug 13 still places Caiado and Zema tied with the leader in the runoff, according to CNN Brasil and Bnews.`,

  'cards.sentimento.polymarket':
    `NEW READING ON Aug 14 for the presidential market, ${NOVO}: Lula 63.50% (vol USD 8.25M cumulative), Flávio Bolsonaro 27.85% (vol USD 8.20M), Renan Santos 7.15% (vol USD 9.59M) and Ronaldo Caiado 1.05% (vol USD 5.70M). The distance between the top two is 35.65pp, against 35.85pp on Aug 12, and all of the narrowing came from the runner-up. For the second and third place contracts, for the Senate and for the STF impeachment contract there is no new reading on Aug 14, and the values displayed are those of the ${VELHO}. ⛔ No superlative: among the points recorded since May 16, 51 had the runner-up at a level equal to or above today's, with a peak of 33.20% on Jun 2.`,

  'cards.stf.analise':
    `THERE IS NO NEW READING ON Aug 14 for the contract on the impeachment of an STF justice. The value displayed is that of the ${VELHO}, at 3.90% on cumulative volume of USD 83 thousand. It remains the thinnest contract among those this panel tracks, with volume three orders of magnitude below the presidential book, and any movement in it requires that caveat before any reading. The judicial thread of the week remains the Federal Police operation against a journalist's source, based on messages that underpinned reports about Justice Dino, and the reaction of professional bodies to Justice Moraes's decision in the case. The Aug 12 order in which Moraes, Dino, Gilmar Mendes and Zanin required seven courts to return supplementary payments still stands. ⭐ Today's new judicial fact is of a different nature and is electoral: Nunes Marques granted Flávio Bolsonaro's requests in the case of the improper affiliation with Missão, and the TSE then suspended the processing of new affiliations nationwide.`,
})
