/**
 * Mapa EN de 15/Ago para analysis-data.json.
 * Convenções: ponto decimal, vírgula de milhar, datas no formato "Aug 15".
 */
import { construir } from '../build-locale-json'

const NOVO = 'confirmed reading of Aug 15, 13:33 BRT (16:33 UTC)'

construir('analysis-data', 'en', {
  'cards.sentimento.text1':
    `50 days from the first round, the day has a clean crossing and it points in opposite directions. The Quaest poll released on Aug 14 at 21:00, after yesterday's capture, shows both distances NARROWING against the house's own previous round: in the first round from 9pp to 7pp, with Lula at 38% and Flávio Bolsonaro at 31%, and in the runoff from 5pp to 3pp, at 43% against 40%. The movement is symmetrical, with one giving up 1 point and the other gaining 1 point in each round. Fieldwork Aug 10 to Aug 13, n=2,004, registration BR-06773/2026.`,

  'cards.sentimento.text2':
    `On price the opposite happened. The distance between the two WIDENED, from 35.65pp to 36.35pp, because Lula rose 1.00pp and Flávio Bolsonaro rose 0.30pp. ⭐ The two instruments moved over the same pair of days and in opposite directions, and that divergence is the finding of the day. The panel neither reconciles it nor picks which of the two counts, because they measure different questions: declared voting intention and probability of winning.`,

  'cards.sentimento.text3':
    `Quaest also brought two pieces PoderData did not carry on Aug 13. The first is REJECTION separated for the first time in the window: 54% for Flávio Bolsonaro and 52% for Lula, where PoderData had them tied at 48%. The second is Caiado's rejection, at 35%, with high non-recognition declared by the house itself. ⚠️ Two national polls two days apart disagreeing on the sign of rejection is a house effect, not a shift in public opinion, and the panel prefers to show the distance between houses rather than pick one of them.`,

  'cards.sentimento.direita':
    `Flávio Bolsonaro rose on both instruments and still ended up further behind. On price he stands at 28.15% (vol USD 8.23M cumulative), up 0.30pp and a second straight day of gains. In the polls, Quaest is the first national poll to show him narrowing both rounds against the house's own previous reading. ⚠️ But his distance to the leader on price WIDENED, because the leader rose more. At the registry the episode closed: his presidential candidacy was registered on Aug 14, hours after Nunes Marques restored his PL affiliation, and the registration deadline closes today, Aug 15. Quaest gives him the highest rejection on the board, at 54%.`,

  'cards.sentimento.esquerda':
    `Lula broke upward after seven days without moving. The price went from 63.50%, where it had stood since Aug 9, to 64.50% (vol USD 8.29M cumulative), up 1.00pp, returning to the level last seen on Aug 8. ⛔ No superlative: among the 174 points recorded since May 18, 17 had a value equal to or above 64.50%, and the peak remains 66.50%, from Aug 1. In the polls, Quaest gives him 38% in the first round, the FLOOR of the nine national polls since Aug 5, and government approval at 46% against 48% disapproval, his best net since Aug 5.`,

  'cards.sentimento.terceiraVia':
    `There is no new confirmed price reading for Renan Santos or for the trailing pack on Aug 15, and the values displayed are those of Aug 14, 14:46 BRT. In the polls, Quaest of Aug 14 kept all three flat against the house's own Aug 5 round: Renan Santos at 4%, Caiado at 4% and Zema at 2%, with no gain in nine days. ⭐ The new data point about the pack is not voting intention, it is rejection: Caiado appears at 35%, against 54% and 52% for the top two, with high non-recognition declared by the house. Low rejection with high non-recognition is not acceptance, and the panel states both together.`,

  'cards.sentimento.polymarket':
    `NEW CONFIRMED READING ON Aug 15 for the leader and for the runner-up, ${NOVO}: Lula 64.50% (vol USD 8.29M cumulative) and Flávio Bolsonaro 28.15% (vol USD 8.23M). The distance between the two is 36.35pp, against 35.65pp on Aug 14, and it WIDENED over the same pair of days in which the polls narrowed it. For Renan Santos, for the trailing pack and for the second and third place contracts, the Senate one and the STF impeachment one there is no new reading on Aug 15, and the values of Aug 14, 14:46 BRT still stand. ⛔ No superlative: the 36.35pp gap is ordinary in the series, with 32 of the 88 recorded days at an equal or greater distance, and the peak remains 41.80pp, from Aug 1.`,

  'cards.stf.analise':
    `THERE IS NO NEW READING ON Aug 15 for the contract on the impeachment of an STF justice. The value displayed is that of the last confirmed reading, from Aug 14, 14:46 BRT, at 3.90% on cumulative volume of USD 83 thousand. It remains the thinnest contract among those this panel tracks, with volume three orders of magnitude below the presidential book, and any movement in it requires that caveat before any reading. ⭐ The judicial thread of Aug 15 has a direct electoral effect: the STF suspended the conviction of Romero Jucá, who becomes eligible to run, according to O Globo. Justice Mendonça pledged to handle the Master and INSS cases impartially and defended changes at the STF, according to G1 and Folha de S.Paulo, and the Federal Police opened an inquiry into the suspicion that a senator tried to interfere in an investigation in Maranhão, also according to Folha. The Aug 12 order in which Moraes, Dino, Gilmar Mendes and Zanin required seven courts to return supplementary payments still stands.`,
})
