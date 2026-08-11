/**
 * Mapa EN da ERRATA de serie de 11/Ago para polls-data.json.
 * Restaura o topo do Flavio (34,40% em 13/Mai) e o piso do Renan (6,80% em 06/Ago),
 * que a rodada de fechamento havia trocado por valores de fecho-do-dia.
 */
import { construir } from '../build-locale-json'

construir('polls-data', 'en', {
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    "[confirmed reading of Aug 11, 18:22 BRT] At 27.25% (vol USD 8.12M cumulative). THE DAY WAS A ROUND TRIP AND ENDED AT ZERO: he marked 26.95% in the confirmed 16:27 reading and closed at 27.25%, exactly where he stood on Aug 10. ⚠️ THE DAY SHOWS THE TWO INSTRUMENTS IN DIFFERENT REGIMES: in the polling he varies 11.3pp between houses and even leads a runoff; in the price he closed with no change. In the 90-day series, 25 had a value equal to or above it, with a peak of 34.40% on May 13 and a floor of 22.00% on Jul 3. In the runner-up contract he stands at 80.50%, against 82.00% on Aug 10.",
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    "[confirmed reading of Aug 11, 18:22 BRT] At 7.75% (vol USD 9.44M cumulative). HE WAS THE ONLY NAME TO SWING ALL DAY, AND THE SWING CAME BACK: 8.40% in the confirmed 16:27 reading and 7.75% at the close, finishing 0.10pp above Aug 10. ⚠️ Both readings were confirmed, each by two captures, so neither is wrong and the panel records the path rather than hiding a 1.4pp swing behind a single figure. In the 90-day series, 78 had a value equal to or above it, with a peak of 17.90% on Jun 9 and a floor of 6.80% on Aug 6. The price still sits BETWEEN the two polling methods, above the 4% to 5% of telephone and in person and below the 10% of the internet. ⚠️ The panel does NOT attribute either end of the swing to the public discussion about method that the press ran on Aug 10 and 11, because it measured nothing linking the two. Largest cumulative volume in the book among the names above 1%.",
})
