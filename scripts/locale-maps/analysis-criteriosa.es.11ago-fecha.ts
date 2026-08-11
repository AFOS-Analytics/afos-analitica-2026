/**
 * Mapa ES do REBASELINE de 11/Ago (leitura de fechamento, 18:22 BRT) para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado"; "descontar", nunca "precificar".
 */
import { construir } from '../build-locale-json'

const S = 'lectura confirmada del 11/Ago, 18:22 BRT'

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 11/Ago, a 54 días de la primera vuelta. TRES NACIONALES NUEVAS y discrepan entre sí: CNT/MDA (n=2.002, presencial), Futura Inteligência (n=2.000, telefónica) y Gerp (n=2.400, telefónica). En la segunda vuelta, el resultado va de 9pp a favor del líder a 2pp a favor del adversario. Precios de la ${S}, confirmados por dos lecturas independientes.`,

  'candidates[0].header':
    `TRES ENCUESTAS NUEVAS Y DISCREPAN MÁS QUE EN CUALQUIER DÍA DE LA VENTANA: CNT/MDA da 42,4% y victoria por 48% x 39% en la segunda vuelta, Futura da 38,8% y 46,5% x 44%, y Gerp da EMPATE en 38% y DERROTA por 45% x 43%. EN EL PRECIO, ESTANCADO por cuarta jornada: 63,50% (vol USD 8,21M acumulado) en la ${S}.`,
  'candidates[0].fortes[4]':
    `Precio de la ${S} en 63,50%, con USD 8,21M de volumen acumulado, y la serie de 90 días tiene un techo de 66,50%, del 1/Ago.`,
  'candidates[0].fracos[3]':
    `La diferencia de mercado cerró el día en +36,25pp, exactamente el mismo valor del 10/Ago, es decir, un día entero de encuestas no movió la distancia entre los dos.`,
  'candidates[0].fracos[4]':
    `Salvedad de serie: 17 de los 90 días tuvieron un precio igual o superior a 63,50%, así que el nivel actual no es extremo.`,
  'candidates[0].analise':
    `EL DÍA TRAJO TRES ENCUESTAS Y NO CUENTAN LA MISMA HISTORIA. CNT/MDA, presencial, con n=2.002 y campo del 5 al 8/Ago, da 42,4% en la primera vuelta y 48% x 39% en la segunda. Futura Inteligência, telefónica, con n=2.000 y campo del 3 al 7/Ago, da 38,8% y 46,5% x 44%. Gerp, telefónica, con n=2.400 y campo del 6 al 10/Ago, da EMPATE en 38% x 38% y derrota por 45% x 43%. LAS TRES MIDIERON LA MISMA SEMANA, y en la segunda vuelta el resultado va de nueve puntos a favor a dos puntos en contra, es decir, once puntos de distancia sobre la misma pregunta. Sumando las siete nacionales desde el 5/Ago aparece entre 38% y 44%. EN EL PRECIO NO HUBO NINGÚN MOVIMIENTO: 63,50% por cuarta jornada seguida, con USD 8,21M acumulados, y la diferencia cerró en +36,25pp, idéntica a la del 10/Ago. ⚠️ EL CRUCE CENTRAL DEL DÍA ES DE RÉGIMEN, NO DE NIVEL: mientras tres institutos abrían once puntos de distancia entre sí, el libro presidencial cerró el día donde empezó. Los dos instrumentos midieron la misma disputa y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen sin decir cuál está en lo cierto. LA APROBACIÓN acompaña la misma dispersión: 47,3% contra 49,9% en Futura, 53% de desaprobación en Gerp, y gestión en 35% de excelente o buena contra 36% de mala o pésima en CNT/MDA.`,

  'candidates[1].header':
    `GERP LO PONE POR DELANTE EN LA SEGUNDA VUELTA, con 45% contra 43%, y es la PRIMERA vez que una nacional de la ventana lo hace. El mismo día CNT/MDA lo pone nueve puntos por detrás. En la primera vuelta va de 28,7% a 38% entre las tres de hoy. EN EL PRECIO EL DÍA FUE DE IDA Y VUELTA: marcó 26,95% a las 16:27 y cerró en 27,25% (vol USD 8,12M acumulado), en la ${S}.`,
  'candidates[1].fortes[4]':
    `Precio de la ${S} en 27,25%, con USD 8,12M acumulados, y 25 de los 90 días de la serie tuvieron un valor igual o superior.`,
  'candidates[1].fracos[4]':
    `El precio cerró el día sin variación contra el 10/Ago, tras caer a 26,95% a media tarde y recuperarse, y en el contrato de segundo lugar está en 80,50%, contra 82,00% el 10/Ago.`,
  'candidates[1].analise':
    `SU DÍA TIENE EL MEJOR Y EL PEOR DATO DE LA VENTANA, Y LOS DOS SALIERON JUNTOS. Gerp lo pone por delante en la segunda vuelta, con 45% contra 43%, y es la primera nacional del período en hacerlo; la propia difusión trata la diferencia de 2pp como empate técnico dentro del margen. El mismo día CNT/MDA lo pone nueve puntos por detrás, con 39% contra 48%. Futura queda en el medio, con 44% contra 46,5%. EN LA PRIMERA VUELTA LA DISTANCIA ES IGUALMENTE GRANDE: 28,7% en CNT/MDA y 38% en Gerp, 9,3 puntos entre dos lecturas del mismo día. SU AMPLITUD EN LA VENTANA LLEGÓ A 11,3pp, contra 6pp del líder, y el 28,7% abrió un piso nuevo. Elegir una de las tres es elegir la conclusión, y por eso el panel publica el conjunto. EN EL PRECIO EL DÍA FUE DE IDA Y VUELTA Y TERMINÓ EN CERO: cayó a 26,95% en la lectura de las 16:27 y cerró en 27,25%, exactamente donde estaba el 10/Ago. En la serie de 90 días, 25 tuvieron un valor igual o superior, con un techo de 33,20% el 2/Jun y un piso de 22,00% el 3/Jul. EL RECHAZO SIGUE ALTO: 47,1% en Futura, en empate técnico con el 45,9% del líder. EN EL TABLERO, afirmó el 11/Ago que irá a los debates y que no debe explicaciones sobre el caso Master, grabó propaganda con Michelle Bolsonaro afirmando que Moraes es articulador del adversario, y insinuó el fin de la reelección para atraer partidos. 📌 El eslogan de su campaña salió el 10/Ago, no hoy.`,

  'candidates[2].header':
    `FUE LO ÚNICO QUE SE MOVIÓ EN EL LIBRO, Y VOLVIÓ: marcó 8,40% a las 16:27 y cerró en 7,75% (vol USD 9,44M acumulado), en la ${S}, terminando 0,10pp por encima del 10/Ago. En la encuesta Gerp le da 5%, el segundo mayor valor de la ventana, por detrás solo del 10% de Palver por internet.`,
  'candidates[2].fortes[0]':
    `Fue el único nombre del libro presidencial en moverse más de 0,30pp en cualquier momento del día, con una oscilación de 0,75pp hacia arriba y 0,65pp de vuelta.`,
  'candidates[2].fortes[1]':
    `Cerró 0,10pp por encima del 10/Ago, y en la serie de 90 días 78 tuvieron un valor igual o superior, con un piso de 6,90% el 6/Ago.`,
  'candidates[2].analise':
    `FUE EL ÚNICO NOMBRE EN MOVERSE DE VERDAD EN TODO EL DÍA, Y EL MOVIMIENTO FUE DE IDA Y VUELTA. En la lectura de las 16:27 marcaba 8,40%, un alza de 0,75pp; en la lectura de cierre, a las 18:22, estaba en 7,75%, es decir, 0,10pp por encima del 10/Ago. ⚠️ LAS DOS LECTURAS FUERON CONFIRMADAS, cada una por dos capturas tomadas con ocho minutos de intervalo, así que ninguna está equivocada: el día simplemente siguió después de la primera. El panel publica el cierre y registra el camino, porque esconder el camino haría que una oscilación de 1,4pp pareciera un día estancado. En la serie de 90 días, 78 tuvieron un valor igual o superior a 7,75%, con un techo de 17,90% el 9/Jun y un piso de 6,90% el 6/Ago. EN LA ENCUESTA Gerp le da 5% en la primera vuelta, por detrás solo del 10% que Palver midió por internet el 10/Ago, y CNT/MDA y Futura no publicaron el campo completo. EL EFECTO DE MÉTODO SIGUE SIENDO LA LECTURA CENTRAL SOBRE ÉL: el mismo nombre va de 4% a 10% según el entorno de la entrevista, y la salvedad no es de este panel, fue declarada por la propia Palver, que informó que prueba enfoques para reducir el efecto en encuestas online. ⚠️ EL PANEL NO ATRIBUYE NINGUNA DE LAS DOS PUNTAS DE ESE VAIVÉN A LA DISCUSIÓN PÚBLICA SOBRE MÉTODO que la prensa hizo el 10 y el 11/Ago. No hay medición que ligue las dos cosas. Sigue con el mayor volumen acumulado del libro entre los nombres por encima de 1%, con USD 9,44M.`,

  'candidates[3].header':
    `LA BASE DE COMPARACIÓN SOBRE ELLOS SE REDUJO: de las tres nacionales de hoy, solo Gerp publicó el campo completo, con Caiado en 4% y Zema en 2%. Los tres cedieron 0,10pp en el precio. Valores de la ${S}: Caiado 1,05% (vol USD 5,63M), Zema 0,35% (vol USD 5,05M) y Haddad 0,05% (vol USD 7,01M).`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 1,05% (vol USD 5,63M acumulado, ${S}) | candidato oficializado en convención, con Kassab de vice | encuesta vigente: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5,7%, BTG/Nexus 5%`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,01M acumulado, ${S}) | NO probado por ninguna de las tres nacionales del 11/Ago, porque disputa el gobierno de São Paulo`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,35% (vol USD 5,05M acumulado, ${S}) | encuesta vigente: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2,6%, BTG/Nexus 3% | fórmula con el senador Eduardo Girão | registró su candidatura ante el TSE el 6/Ago`,
  'candidates[3].zema.fracos':
    `CEDIÓ 0,10pp, a 0,35%, HUNDIÉNDOSE MÁS POR DEBAJO DEL CORTE DE 0,5% que el panel usa para separar precio de ruido, y la lectura sobre él sigue suspendida en esa franja. Es el adversario al que el líder vence con más holgura en las rondas que lo prueban, por 46% x 34% en Quaest y 48,5% x 37% en Ideia. En la encuesta no se mueve desde hace un mes. La ventana de 90 días que cubre la serie empieza el 13/May, así que su pico de abril queda fuera de lo que este panel puede verificar hoy.`,

  'quadroComparativo[0].m': `63,50% (vol USD 8,21M acumulado), ${S}`,
  'quadroComparativo[0].t':
    `ESTANCADO por cuarta jornada seguida. La diferencia cerró en +36,25pp, el mismo valor del 10/Ago, es decir, un día de tres encuestas no movió la distancia. En la serie de 90 días, 17 tuvieron un valor igual o superior.`,
  'quadroComparativo[1].m': `27,25% (vol USD 8,12M), ${S}`,
  'quadroComparativo[1].t':
    `IDA Y VUELTA: cayó a 26,95% en la lectura de las 16:27 y cerró en 27,25%, donde ya estaba el 10/Ago. En el contrato de segundo lugar está en 80,50%, contra 82,00% ayer. No es extremo: 25 de los 90 días tuvieron un valor igual o superior.`,
  'quadroComparativo[1].s':
    `Afirmó el 11/Ago que irá a los debates y que no debe explicaciones sobre el caso Master. Grabó propaganda con Michelle Bolsonaro afirmando que Moraes es articulador del adversario, e insinuó el fin de la reelección para atraer partidos.`,
  'quadroComparativo[5].s':
    `El caso Master tuvo un hecho propio el 11/Ago, y es de estancamiento y no de decisión: el FGC afirmó al Supremo que no es parte del acuerdo y que no recibió el balance del BRB, necesario para el préstamo de rescate, y el BRB respondió que solo difunde los estados de 2025 tras la capitalización. El liquidador del Master amplió el cerco a los bienes de Vorcaro en Estados Unidos. 📌 El operativo de la PF sobre el fondo de pensiones de Maceió es del 10/Ago, no de hoy.`,
  'quadroComparativo[2].m': `7,75% (vol USD 9,44M), ${S}`,
  'quadroComparativo[2].t':
    `LA ÚNICA OSCILACIÓN REAL DEL DÍA, Y VOLVIÓ: 8,40% a las 16:27 y 7,75% en el cierre, 0,10pp por encima del 10/Ago. Las dos lecturas fueron confirmadas. En la serie de 90 días, 78 tuvieron un valor igual o superior.`,
  'quadroComparativo[3].m': `1,05% (vol USD 5,63M), ${S}`,
  'quadroComparativo[4].m': `0,35% (vol USD 5,05M), ${S}`,
  'quadroComparativo[4].t':
    `CEDIÓ 0,10pp y se hundió más por debajo del corte de 0,5% que separa precio de ruido. La lectura sobre él sigue suspendida en esa franja.`,
  'quadroComparativo[5].m': `3,80% (vol USD 83 mil), ${S}`,

  cruzamento:
    `TRES ENCUESTAS NACIONALES EL 11/Ago, Y DISCREPAN ENTRE SÍ MÁS QUE EN CUALQUIER OTRO DÍA DE ESTA VENTANA. Los precios de esta página son de la ${S}, confirmados por dos lecturas independientes tomadas con ocho minutos de intervalo. EN LA SEGUNDA VUELTA, LA DISTANCIA ES DE ONCE PUNTOS: CNT/MDA (n=2.002, presencial, campo del 5 al 8/Ago) da 48% x 39% para el líder; Futura Inteligência (n=2.000, telefónica, campo del 3 al 7/Ago) da 46,5% x 44%; y Gerp (n=2.400, telefónica, campo del 6 al 10/Ago) da 45% x 43% PARA EL SEGUNDO. Es la primera vez en la ventana que una nacional pone al adversario por delante en ese escenario. EN LA PRIMERA VUELTA LA DISTANCIA ES DE 9,3 PUNTOS sobre el mismo nombre: 28,7% en CNT/MDA y 38% en Gerp, con Futura en 34,1%. Sumando las siete nacionales desde el 5/Ago, el líder va de 38% a 44%, una franja de 6pp, y el segundo va de 28,7% a 40%, una franja de 11,3pp, casi el doble. ⭐ EL CRUCE CENTRAL DEL DÍA ES DE RÉGIMEN, Y NO DE NIVEL. Mientras la encuesta abría esa distancia, EL MERCADO CERRÓ EL DÍA DONDE EMPEZÓ: el líder estancado por cuarta jornada, en 63,50%, el segundo de vuelta en 27,25% tras marcar 26,95% a las 16:27, y la diferencia en +36,25pp, idéntica a la del 10/Ago. El libro presidencial suma USD 122,17M de volumen acumulado. ⚠️ EL ÚNICO NOMBRE EN OSCILAR FUE EL TERCERO, Y TAMBIÉN VOLVIÓ: 8,40% a las 16:27 y 7,75% en el cierre, 0,10pp por encima de ayer. Las dos lecturas del día fueron confirmadas, cada una por dos capturas, así que ninguna está equivocada, y el panel publica el cierre registrando el camino. No se atribuye ninguna causa a ese vaivén, porque no hay medición que lo ligue a la discusión pública sobre método que la prensa hizo el 10 y el 11/Ago. Los dos instrumentos midieron la misma semana, y uno de ellos está mucho más incierto que el otro. El panel registra la diferencia de régimen y no dice cuál está en lo cierto, porque no lo sabe, y porque decirlo sería cambiar medición por opinión. LA APROBACIÓN SIGUE EL MISMO PATRÓN DE DISPERSIÓN: en siete lecturas de siete días la desaprobación va de 47% a 55%, y el saldo va de 1pp positivo a 10pp negativo.`,
})
