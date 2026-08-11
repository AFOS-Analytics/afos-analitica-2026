/**
 * Mapa EN da ERRATA de serie de 11/Ago para analysis-data.json.
 * Restaura o topo do Flavio (34,40% em 13/Mai) e o piso do Renan (6,80% em 06/Ago),
 * que a rodada de fechamento havia trocado por valores de fecho-do-dia.
 */
import { construir } from '../build-locale-json'

construir('analysis-data', 'en', {
  'cards.sentimento.terceiraVia':
    "THE THIRD-PLACED NAME WAS THE ONLY THING THAT MOVED ALL DAY, AND HE CAME BACK: he rose as far as 8.40% in the 16:27 reading and closed at 7.75%, finishing 0.10pp above Aug 10. Both readings were confirmed, each by two captures, so it is not that one of them is wrong, it is that the day kept going. In the 90-day series, 78 had a value equal to or above 7.75%, with a peak of 17.90% on Jun 9 and a floor of 6.80% on Aug 6. In the polling Gerp gives him 5%, the second highest value of the window, behind only the 10% Palver measured online, and the method effect remains the reading on him. Caiado, Zema and Haddad each gave up 0.10pp, closing at 1.05%, 0.35% and 0.05%.",
})
