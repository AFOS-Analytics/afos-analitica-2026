/**
 * Mapa ES da ERRATA de serie de 11/Ago para polls-data.json.
 * Restaura o topo do Flavio (34,40% em 13/Mai) e o piso do Renan (6,80% em 06/Ago),
 * que a rodada de fechamento havia trocado por valores de fecho-do-dia.
 */
import { construir } from '../build-locale-json'

construir('polls-data', 'es', {
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    "[lectura confirmada del 11/Ago, 18:22 BRT] En 27,25% (vol USD 8,12M acumulado). EL DÍA FUE DE IDA Y VUELTA Y TERMINÓ EN CERO: marcó 26,95% en la lectura confirmada de las 16:27 y cerró en 27,25%, exactamente donde estaba el 10/Ago. ⚠️ EL DÍA MUESTRA LOS DOS INSTRUMENTOS EN REGÍMENES DISTINTOS: en la encuesta varía 11,3pp entre casas y llega a liderar una segunda vuelta; en el precio cerró sin variación. En la serie de 90 días, 25 tuvieron un valor igual o superior, con un techo de 34,40% el 13/May y un piso de 22,00% el 3/Jul. En el contrato de segundo lugar está en 80,50%, contra 82,00% el 10/Ago.",
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    "[lectura confirmada del 11/Ago, 18:22 BRT] En 7,75% (vol USD 9,44M acumulado). FUE EL ÚNICO NOMBRE EN OSCILAR EN TODO EL DÍA, Y LA OSCILACIÓN VOLVIÓ: 8,40% en la lectura confirmada de las 16:27 y 7,75% en el cierre, terminando 0,10pp por encima del 10/Ago. ⚠️ Las dos lecturas fueron confirmadas, cada una por dos capturas, así que ninguna está equivocada y el panel registra el camino en lugar de esconder una oscilación de 1,4pp detrás de una sola cifra. En la serie de 90 días, 78 tuvieron un valor igual o superior, con un techo de 17,90% el 9/Jun y un piso de 6,80% el 6/Ago. El precio sigue ENTRE los dos métodos de la encuesta, por encima del 4% a 5% del teléfono y del presencial y por debajo del 10% de internet. ⚠️ El panel NO atribuye ninguna de las dos puntas del vaivén a la discusión pública sobre método que la prensa hizo el 10 y el 11/Ago, porque no midió nada que ligue las dos cosas. Mayor volumen acumulado del libro entre los nombres por encima de 1%.",
})
