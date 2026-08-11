/**
 * Mapa ES do REBASELINE de 11/Ago (leitura de fechamento, 18:22 BRT) para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 11/Ago, 18:22 BRT'

construir('polls-data', 'es', {
  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA LECTURA CONFIRMADA DEL 11/AGO, 18:22 BRT, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. EL DÍA TUVO TRES ENCUESTAS NACIONALES Y DISCREPAN ENTRE SÍ MÁS QUE EN CUALQUIER OTRO DÍA DE LA VENTANA. En la segunda vuelta, CNT/MDA da 48% x 39% para el líder, Futura da 46,5% x 44%, y Gerp da 45% x 43% PARA EL SEGUNDO. Son once puntos de distancia entre la lectura más favorable y la más desfavorable, sobre la misma pregunta, el mismo día, y es la primera vez en la ventana que una nacional pone al adversario por delante en la segunda vuelta. En la primera vuelta la distancia es de 9,3pp, entre el 28,7% de CNT/MDA y el 38% de Gerp. ⭐ EL CRUCE CENTRAL ES DE RÉGIMEN, NO DE NIVEL: mientras la encuesta abría esa distancia, EL MERCADO CERRÓ EL DÍA DONDE EMPEZÓ. El líder quedó estancado por cuarta jornada, el segundo volvió a 27,25% tras marcar 26,95% a las 16:27, y la diferencia cerró en +36,25pp, idéntica a la del 10/Ago. El tercero fue el único en oscilar, y también volvió. Los dos instrumentos midieron la misma semana, y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen sin decir qué instrumento está en lo cierto, porque no lo sabe, y porque decirlo sería cambiar medición por opinión.`,

  'polymarketComparison.sources':
    `Precios de Polymarket vía proxy AFOS, captura confirmada por dos lecturas independientes tomadas con ocho minutos de intervalo, la más reciente a las 18:22 BRT del 11/Ago (scripts/capture-guard.ts). Hubo una lectura confirmada anterior el mismo día, a las 16:27 BRT, y las diferencias entre las dos están registradas en el texto en lugar de descartadas. Encuestas del 11/Ago: CNT/MDA BR-06935/2026 (n=2.002, presencial, campo del 5 al 8/Ago), Gerp BR-08045/2026 (n=2.400, telefónica, campo del 6 al 10/Ago) y Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago, registro no confirmado en fuente primaria). Siguen vigentes Palver BR-06596/2026 y BTG/Nexus BR-08428/2026, del 10/Ago, y Genial/Quaest BR-06591/2026 y Meio/Ideia BR-04579/2026, del 5/Ago. Próxima nacional en la fila de difusión: PoderData (n=2.400, BR-06868/2026) el 13/Ago.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[${S}] En 63,50% (vol USD 8,21M acumulado), ESTANCADO por cuarta jornada seguida. La diferencia sobre Flávio cerró en +36,25pp, exactamente el valor del 10/Ago: un día entero de encuestas no movió la distancia entre los dos. ⚠️ EL CONTRASTE CON LA ENCUESTA ES EL DATO DE LA RONDA: mientras tres institutos publicaban lecturas separadas por once puntos en la segunda vuelta, su precio no se movió en ninguna de las dos lecturas confirmadas del día. En la serie de 90 días el techo es 66,50%, del 1/Ago, y 17 de los 90 días tuvieron un valor igual o superior, así que el nivel no es extremo.`,

  'polymarketComparison.candidates[1].polymarket': `27,25%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[${S}] En 27,25% (vol USD 8,12M acumulado). EL DÍA FUE DE IDA Y VUELTA Y TERMINÓ EN CERO: marcó 26,95% en la lectura confirmada de las 16:27 y cerró en 27,25%, exactamente donde estaba el 10/Ago. ⚠️ EL DÍA MUESTRA LOS DOS INSTRUMENTOS EN REGÍMENES DISTINTOS: en la encuesta varía 11,3pp entre casas y llega a liderar una segunda vuelta; en el precio cerró sin variación. En la serie de 90 días, 25 tuvieron un valor igual o superior, con un techo de 33,20% el 2/Jun y un piso de 22,00% el 3/Jul. En el contrato de segundo lugar está en 80,50%, contra 82,00% el 10/Ago.`,

  'polymarketComparison.candidates[2].polymarket': `7,75%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[${S}] En 7,75% (vol USD 9,44M acumulado). FUE EL ÚNICO NOMBRE EN OSCILAR EN TODO EL DÍA, Y LA OSCILACIÓN VOLVIÓ: 8,40% en la lectura confirmada de las 16:27 y 7,75% en el cierre, terminando 0,10pp por encima del 10/Ago. ⚠️ Las dos lecturas fueron confirmadas, cada una por dos capturas, así que ninguna está equivocada y el panel registra el camino en lugar de esconder una oscilación de 1,4pp detrás de una sola cifra. En la serie de 90 días, 78 tuvieron un valor igual o superior, con un techo de 17,90% el 9/Jun y un piso de 6,90% el 6/Ago. El precio sigue ENTRE los dos métodos de la encuesta, por encima del 4% a 5% del teléfono y del presencial y por debajo del 10% de internet. ⚠️ El panel NO atribuye ninguna de las dos puntas del vaivén a la discusión pública sobre método que la prensa hizo el 10 y el 11/Ago, porque no midió nada que ligue las dos cosas. Mayor volumen acumulado del libro entre los nombres por encima de 1%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[${S}] En 1,05% (vol USD 5,63M acumulado). CEDIÓ 0,10pp por tercera jornada seguida, y la distancia entre encuesta y precio sigue siendo la mayor del pelotón: de 4% a 5,7% de intención declarada contra 1,05% de probabilidad descontada. El panel registra la distancia sin restar una magnitud de la otra, porque la encuesta mide intención ahora y el contrato mide probabilidad de ganar al final.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[${S}] En 0,05% (vol USD 13,90M acumulado). ⚠️ Sigue siendo el MAYOR volumen acumulado de todo el libro presidencial, con el precio en el piso. Volumen alto con probabilidad en el piso es convicción ya descontada, no movimiento, y las variaciones en esta franja tienen un valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[${S}] En 0,35% (vol USD 5,05M acumulado). CEDIÓ 0,10pp y se hundió más por debajo del corte de 0,5% que el panel usa para separar precio de ruido, franja en la que la lectura sobre él sigue suspendida. La ventana de serie que este panel puede verificar empieza el 13/May, así que su pico de abril queda fuera de ella.`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[${S}] En 0,05% (vol USD 7,01M acumulado), de vuelta al piso tras un único día por encima de él. La variación en esta franja no tiene valor informativo.`,
})
