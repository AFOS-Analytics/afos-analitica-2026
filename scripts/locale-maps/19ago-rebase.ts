/**
 * Mapa de tradução do REBASELINE de 19/Ago.
 *
 * Só os 11 campos que carregavam bloco de rodada anterior e foram reescritos
 * com a captura certificada de 19/Ago, 14:58 BRT. Todo o resto vem da memória
 * de tradução, byte a byte.
 *
 * Origem do defeito: auditoria EVAL de 16 eixos, achado nº 2. O carimbo do topo
 * dizia 19/Ago e três blocos do cartão de clima traziam a leitura de 17/Ago,
 * com o líder em 64,50% onde o preço do dia era 63,50%.
 */
import { construir } from '../build-locale-json'

// ---------------------------------------------------------------- EN
construir('analysis-data', 'en', {
  'cards.sentimento.direita': `The runner-up rose 0.50pp, from 32.05% to 32.55% (vol USD 8.63M accumulated), confirmed reading of Aug 19, 2:58 PM BRT (5:58 PM UTC), on a SIXTH day running of gains and solely responsible for the narrowing of the distance. ⛔ Not a record: of the 88 days in the series since May 22, 2 posted a value equal to or above today's close, and the high is still 33.20%, from Jun 2. In the polls he went to 36% in the first round, and the distance to the leader stayed the same.`,
  'cards.sentimento.esquerda': `The leader repeated 63.50% for a second day running (vol USD 8.69M accumulated), confirmed reading of Aug 19, 2:58 PM BRT (5:58 PM UTC), losing no price at all. Of the 88 days in the series recorded since May 22, 23 are at 63.50% or above, and the high is still 66.50%, from Aug 1. In the polls he went to 41% in the first round and repeated 47% in the runoff.`,
  'cards.sentimento.terceiraVia': `🔴 The pack fell again in the WIN price, and in POSITION the gap widened without either of them moving. Renan Santos went from 4.40% to 4.05%, giving back what he gained the previous day, and Caiado went from 0.80% to 0.55%, undoing the previous day's rise. ⭐ In the third place contract of the first round Renan was STABLE at 57.00% and Caiado gave ground from 37.00% to 36.00%, with the gap between them WIDENING from 20.00pp to 21.00pp: the one who widened it was the one who gave ground. ⭐ And the polls invert the market's ordering: Nexus/BTG gives 5% to Caiado against 4% for Renan Santos.`,
  'cards.stf.analise': `Supreme Court justice impeachment contract, confirmed reading of Aug 19, 2:58 PM BRT (5:58 PM UTC): 3.40% (vol USD 84 thousand). FLAT at 3.40%, unchanged since Aug 17. ⚠️ It remains the thinnest contract among those tracked, with volume three orders of magnitude below the presidential one, and any move in it requires that caveat before becoming a reading.`,
})

construir('analysis-criteriosa', 'en', {
  'candidates[0].fortes[4]': `The high of the 88-day series recorded since May 22 is still 66.50%, from Aug 1, and today's close is among the 23 days on which the price marked 63.50% or above.`,
  'candidates[1].fracos[0]': `⛔ Not a record: of the 88 days in the series since May 22, 2 posted a value equal to or above today's close, and the high is still 33.20%, from Jun 2.`,
  'candidates[2].fracos[0]': `🔻 DOWN in price, from 4.40% to 4.05%, giving back what he gained the previous day. The value is still close to the low: 86 of the 88 days recorded since May 22 are above it, and the low was touched on Aug 18, at 3.60%.`,
  'candidates[3].caiado.label': `CAIADO (PSD), Poly presidential 0.55% (vol USD 6.35M accumulated, confirmed reading of Aug 19, 2:58 PM BRT (5:58 PM UTC)), down 0.25pp | third place in the first round at 36.00% | polling in force: Quaest 4%, Gerp 4%, Meio/Ideia 5.7%, BTG/Nexus 5% | REJECTION of 35% in the Quaest of Aug 14`,
  'candidates[3].haddad.label': `HADDAD (PT), Poly presidential 0.05%, confirmed reading of Aug 19, 2:58 PM BRT (5:58 PM UTC), below the 0.5% cut`,
  'candidates[3].zema.label': `ZEMA (Novo), Poly presidential 0.15% (vol USD 5.72M accumulated, confirmed reading of Aug 19, 2:58 PM BRT (5:58 PM UTC)), unchanged and below the 0.5% cut | third place in the first round at 4.85%`,
  'candidates[3].fracos[0]': `🔻 Caiado FELL in the win contract, from 0.80% to 0.55%, undoing the previous day's rise, and stays above the 0.5% cut, but barely.`,
})

// ---------------------------------------------------------------- ES
construir('analysis-data', 'es', {
  'cards.sentimento.direita': `El segundo subió 0,50pp, de 32,05% a 32,55% (vol USD 8,63M acumulado), lectura confirmada del 19 de ago, 14:58 BRT (17:58 UTC), en el SEXTO día seguido de alza y único responsable del acortamiento de la distancia. ⛔ No es récord: de los 88 días de la serie desde el 22 de may, 2 marcaron un valor igual o superior al cierre de hoy, y el máximo sigue en 33,20%, del 2 de jun. En la encuesta llegó a 36% en la primera vuelta, y la distancia hacia el líder quedó igual.`,
  'cards.sentimento.esquerda': `El líder repitió 63,50% por segundo día seguido (vol USD 8,69M acumulado), lectura confirmada del 19 de ago, 14:58 BRT (17:58 UTC), sin perder precio alguno. De los 88 días de la serie registrada desde el 22 de may, 23 están en 63,50% o por encima, y el máximo sigue en 66,50%, del 1 de ago. En la encuesta llegó a 41% en la primera vuelta y repitió 47% en la segunda.`,
  'cards.sentimento.terceiraVia': `🔴 El pelotón cayó de nuevo en el precio de VICTORIA, y en la POSICIÓN la distancia se abrió sin que ninguno de los dos se moviera. Renan Santos fue de 4,40% a 4,05%, devolviendo lo que subió la víspera, y Caiado fue de 0,80% a 0,55%, deshaciendo el alza del día anterior. ⭐ En el contrato de tercer lugar de la primera vuelta Renan quedó ESTABLE en 57,00% y Caiado cedió de 37,00% a 36,00%, con la distancia entre ellos ABRIÉNDOSE de 20,00pp a 21,00pp: quien abrió la distancia fue quien cedió. ⭐ Y la encuesta invierte el orden del mercado: Nexus/BTG da 5% a Caiado contra 4% de Renan Santos.`,
  'cards.stf.analise': `Contrato de impeachment de ministro del Supremo, lectura confirmada del 19 de ago, 14:58 BRT (17:58 UTC): 3,40% (vol USD 84 mil). QUIETO en 3,40%, sin variación desde el 17 de ago. ⚠️ Sigue siendo el contrato más fino entre los seguidos, con un volumen tres órdenes de magnitud por debajo del presidencial, y cualquier movimiento en él exige esa salvedad antes de convertirse en lectura.`,
})

construir('analysis-criteriosa', 'es', {
  'candidates[0].fortes[4]': `El máximo de la serie de 88 días registrada desde el 22 de may sigue en 66,50%, del 1 de ago, y el cierre de hoy está entre los 23 días en que el precio marcó 63,50% o por encima.`,
  'candidates[1].fracos[0]': `⛔ No es récord: de los 88 días de la serie desde el 22 de may, 2 marcaron un valor igual o superior al cierre de hoy, y el máximo sigue siendo 33,20%, del 2 de jun.`,
  'candidates[2].fracos[0]': `🔻 CAÍDA en el precio, de 4,40% a 4,05%, devolviendo lo que subió la víspera. El valor sigue cerca del piso: 86 de los 88 días registrados desde el 22 de may están por encima, y el piso se tocó el 18 de ago, con 3,60%.`,
  'candidates[3].caiado.label': `CAIADO (PSD), Poly presidencial 0,55% (vol USD 6,35M acumulado, lectura confirmada del 19 de ago, 14:58 BRT (17:58 UTC)), caída de 0,25pp | tercer lugar de la primera vuelta en 36,00% | encuestas en vigor: Quaest 4%, Gerp 4%, Meio/Ideia 5,7%, BTG/Nexus 5% | RECHAZO de 35% en la Quaest del 14 de ago`,
  'candidates[3].haddad.label': `HADDAD (PT), Poly presidencial 0,05%, lectura confirmada del 19 de ago, 14:58 BRT (17:58 UTC), por debajo del corte de 0,5%`,
  'candidates[3].zema.label': `ZEMA (Novo), Poly presidencial 0,15% (vol USD 5,72M acumulado, lectura confirmada del 19 de ago, 14:58 BRT (17:58 UTC)), sin variación y por debajo del corte de 0,5% | tercer lugar de la primera vuelta en 4,85%`,
  'candidates[3].fracos[0]': `🔻 Caiado CAYÓ en el contrato de victoria, de 0,80% a 0,55%, deshaciendo el alza de la víspera, y sigue por encima del corte de 0,5%, pero por poco.`,
})
