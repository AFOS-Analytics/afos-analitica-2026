/**
 * Mapa ES de 12/Ago para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 12/Ago, 16:41 BRT'

construir('polls-data', 'es', {
  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA LECTURA CONFIRMADA DEL 12/AGO, 16:41 BRT, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. ⚠️ EL DÍA NO TUVO ENCUESTA NACIONAL NUEVA, así que la columna de la encuesta es la misma del 11/Ago y la comparación mide solo el lado del precio. ⭐ Y EL PRECIO SE MOVIÓ DONDE LA ELECCIÓN NO SE DECIDE: en el contrato sobre quién gana, el líder quedó estancado por cuarto día seguido y la diferencia se estrechó 0,40pp, a 35,85pp; en el contrato sobre quién termina segundo en la primera vuelta, el segundo subió 3,50pp, a 84,00%, y esa fue la mayor variación del día en cualquier libro seguido. Son preguntas distintas, una sobre ganar y otra sobre posición, y el panel no las suma. El cruce más interesante es el de Caiado, que CAYÓ en el contrato sobre ganar y SUBIÓ en el de tercer lugar el mismo día.`,

  'polymarketComparison.sources':
    `Precios de Polymarket vía proxy AFOS, captura confirmada por dos lecturas independientes tomadas con ocho minutos de intervalo, la más reciente a las 16:41 BRT del 12/Ago (scripts/capture-guard.ts). ⚠️ NINGUNA ENCUESTA NACIONAL NUEVA EL 12/Ago: siguen vigentes CNT/MDA BR-06935/2026, Gerp BR-08045/2026 y Futura Inteligência BR-08109/2026, todas del 11/Ago, más Palver BR-06596/2026 y BTG/Nexus BR-08428/2026, del 10/Ago, y Genial/Quaest BR-06591/2026 y Meio/Ideia BR-04579/2026, del 5/Ago. ✅ El registro de Futura fue CONFIRMADO en esta ronda: la encuesta la ejecuta Futura Inteligência y la contrata 100% Cidades, y por eso el protocolo del TSE figura a nombre de la contratante. Próximas nacionales en la fila: PoderData (n=2.400, BR-06868/2026) el 13/Ago, Quaest (n=2.004, BR-06773/2026) el 14/Ago y Nexus (n=2.000, BR-03317/2026) el 17/Ago.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] En 63,50% (vol USD 8,22M acumulado), en el MISMO VALOR POR CUARTO DÍA SEGUIDO, desde el 9/Ago. La diferencia sobre Flávio cayó 0,40pp, a 35,85pp, y la caída vino entera de la punta del adversario, porque su propio precio no se movió. En la serie de 90 días, 17 de los 88 días tuvieron un valor igual o superior, con un techo de 66,50% el 1/Ago y un piso de 39,50% el 25/May. ⚠️ Sin encuesta nacional nueva el 12/Ago, esta línea compara el precio con la encuesta del 11/Ago.`,

  'polymarketComparison.candidates[1].polymarket': `27,65%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] En 27,65% (vol USD 8,13M acumulado). SUBIÓ 0,40pp en el contrato presidencial, y la serie de 90 días tiene 22 de los 88 días con un valor igual o superior, un techo de 33,20% el 2/Jun y un piso de 22,00% el 2/Jul. ⭐ PERO SU MOVIMIENTO GRANDE FUE EN OTRO CONTRATO: en el de segundo lugar de la primera vuelta subió 3,50pp, de 80,50% a 84,00%, y esa fue la mayor variación del día en cualquier libro seguido. Ganar y terminar segundo son preguntas distintas, y hoy el mercado movió la segunda.`,

  'polymarketComparison.candidates[2].polymarket': `7,45%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] En 7,45% (vol USD 9,48M acumulado). CAYÓ 0,30pp en el presidencial y cedió 1,50pp en el contrato de tercer lugar de la primera vuelta, a 62,50%. En la serie de 90 días, más de 80 de los 88 días tuvieron un valor igual o superior, con un techo de 17,90% el 9/Jun y un piso de 6,80% el 6/Ago. El precio sigue ENTRE los dos métodos de la encuesta, por encima del 4% a 5% del teléfono y del presencial y por debajo del 10% de internet, y mantiene el mayor volumen acumulado del libro entre los nombres por encima de 1%.`,

  'polymarketComparison.candidates[3].polymarket': `0,95%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] En 0,95% (vol USD 5,66M acumulado). ⭐ SU CRUCE APUNTA HACIA LOS DOS LADOS EL MISMO DÍA: cayó 0,10pp en el contrato sobre ganar, quedando POR DEBAJO de 1% y a 0,05pp del piso de la serie, que es 0,90% del 7/Jul; y SUBIÓ 2,00pp en el contrato de tercer lugar de la primera vuelta, a 31,50%. El mercado bajó su probabilidad de ganar y subió la de terminar tercero. La distancia entre encuesta y precio sigue siendo la mayor del pelotón: de 4% a 5,7% de intención declarada contra 0,95% de probabilidad descontada.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] En 0,05% (vol USD 13,91M acumulado). ⚠️ Sigue siendo el MAYOR volumen acumulado de todo el libro presidencial, con el precio en el piso. Volumen alto con probabilidad en el piso es convicción ya descontada, no movimiento, y las variaciones en esta franja tienen un valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] En 0,35% (vol USD 5,07M acumulado), sin variación. Sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido, franja en la que la lectura sobre él permanece suspendida. En el contrato de tercer lugar de la primera vuelta marca 4,00%.`,

  'polymarketComparison.candidates[6].polymarket': `0,15%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] En 0,15% (vol USD 7,06M acumulado), un alza de 0,10pp que lo saca del piso. La variación en esta franja no tiene valor informativo, y la salvedad de fondo permanece: él NO es candidato a la Presidencia y disputa el gobierno de São Paulo.`,
})
