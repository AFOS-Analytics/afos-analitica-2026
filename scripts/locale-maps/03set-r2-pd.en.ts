/** Mapa EN, 2a rodada de 03/Set/2026: polls-data. Ponto decimal. Tudo ou nada. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/en/glossary#${id})`
const S = 'confirmed reading of 03/Sep, 17:28 BRT (20:28 UTC)'
const PD = 'the PoderData poll of 03/Sep (BR-07561/2026, field 30/Aug to 02/Sep, n=3,000, margin of 2pp)'
const FOUR =
  'BTG/Nexus on 31/Aug at 11%, against 2% in the same house’s round of 24/Aug; Real Time Big Data on 01/Sep at 11%; Genial/Quaest on 02/Sep at 10%, against 2% on 14/Aug and 1% on 05/Aug; and PoderData on 03/Sep at 10%, against 4% on 27/Aug'

construir('polls-data', 'en', {
  'polymarketComparison.note': `${G('Polymarket', 'polymarket')} prices from the ${S}, with the presidential book at USD 142.36M. This is the SECOND confirmed reading of the day, and it measures two things. ⭐ THE FIRST IS THE PRICE: a single contract in the presidential book moved in the two hours between the readings, and it moved 2.15pp. The runner-up went from 40.35% to 42.50% and the other eighteen stayed flat, the leader included, who is still at 54.50%. The gap between the two fell to 12.00pp, against 14.15pp at 15:22, 14.85pp on 02/Sep and 16.55pp on 01/Sep. ⚠️ AND THE MONEY BEHIND IT IS SMALL: the runner-up's contract took in about USD 5.8 thousand of new business and the leader's took in about USD 7.0 thousand without moving. Because the runner-up rose and nobody else gave ground, the sum of the YES legs went from 99.20% to 101.35%. 🔴 THE SECOND IS A CORRECTION OF OUR OWN: the 15:22 reading said Augusto Cury's jump into double digits had been measured by two houses and that Genial/${G('Quaest', 'quaest')} was the first. It was FOUR houses since 31/Aug, and the first was BTG/${G('Nexus', 'nexus-btg')}: ${FOUR}. All four readings were already in this base. ⏳ No new national poll since the 15:22 reading, and ${G('Datafolha', 'datafolha')} (BR-03669/2026, n=2,002, field 01 to 03/Sep), scheduled for release today on the ${G('TSE', 'tse')} register, still had no published figures at the time of this reading.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket': `54.50% (vol USD 9.63M), ${S}. Unchanged since the 15:22 reading today, and the contract took in about USD 7.0 thousand of new business over that stretch without moving. The gap to the runner-up fell to 12.00pp, against 14.15pp at 15:22 and 14.85pp on 02/Sep. In the ${G('first round', 'primeiro-turno')} runner-up contract he gave up 0.05pp and stands at 8.70%.`,

  'polymarketComparison.candidates[1].polymarket': `42.50%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket': `42.50% (vol USD 9.59M), ${S}. Up 2.15pp on the 15:22 reading today, and it is the only move in the presidential book between the two readings, with the other eighteen contracts flat. ⚠️ The contract took in about USD 5.8 thousand of new business over that stretch, less than went into the leader's contract, which did not move. In the first-round runner-up contract he is still flat at 85.50%.`,

  'polymarketComparison.candidates[2].tendenciaPesquisa': `🔴 CORRECTION OF THE 15:22 READING, which said two houses and named Genial/Quaest as the first. His jump into double digits was measured by FOUR houses since 31/Aug: ${FOUR}. AtlasIntel on 31/Aug measured him at 7.8%. The largest jump between two consecutive rounds of the same house, in this window, is BTG/Nexus: from 2% on 24/Aug to 11% on 31/Aug, seven days between the two rounds. PoderData did not test a ${G('second round', 'segundo-turno')} with him.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket': `1.35% (vol USD 3.64M), ${S}. Unchanged in the winner contract since the 15:22 reading today. In the first-round third-place contract he rose 0.05pp and stands at 55.90% (vol USD 108 thousand), and in the runner-up contract he rose 0.30pp to 2.45%.`,

  'polymarketComparison.candidates[3].tendenciaPesquisa': `${PD} gives him 3% in the first round, against 4% in the same house's round of 27/Aug. ⚠️ HE IS THE NAME THE HOUSES DISAGREE ON MOST IN THIS WINDOW: 3% at Genial/Quaest and PoderData, 6% at Real Time Big Data on 01/Sep and 7.6% at AtlasIntel on 31/Aug. In a second round he loses to the leader by 44% to 39%, and the same house measured 44% to 37% on 27/Aug.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket': `1.75% (vol USD 12.48M), ${S}. Unchanged in the winner contract since the 15:22 reading today. In the first-round third-place contract he gave up 0.50pp and now stands at 26.50% in a contract of USD 266 thousand.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket': `0.25% (vol USD 7.11M) in the WINNER contract, below the 0.5% floor of the double reading, and this round does not publish a new price for him in that contract. In the first-round THIRD-PLACE contract, which is a different market, he gave up 0.50pp and stands at 10.50% (vol USD 111 thousand), ${S}, handing back part of the 2.50pp rise from the 15:22 reading.`,
})
