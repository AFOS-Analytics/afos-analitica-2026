/**
 * Mapa ES de analysis-criteriosa.json — /atualizar-brz 03/Ago/2026.
 * Convenções: vírgula decimal e ponto de milhar. `pesquisa` é `encuesta`,
 * `parado` (sem movimento) é `quieto`, `estadual` é `estatal`, e o verbo de
 * mercado é `descontar`, nunca `precificar`. Setas ↑↓ preservadas: o gate
 * numérico lê o sinal.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/es/glossary#${id})`

const NEXUS = G('BTG/Nexus', 'nexus-btg')
const EMP = G('empate técnico', 'empate-tecnico')
const ATLAS = G('AtlasIntel', 'atlasintel')
const STF = G('STF', 'stf')
const TSE = G('TSE', 'tse')
const V1 = G('1ª vuelta', 'primeiro-turno')

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 03/Ago 19:11 UTC, a 62 días de la ${V1}. LA ENCUESTA SE AJUSTÓ Y EL PRECIO SE AJUSTÓ CON ELLA. ${NEXUS} publicó hoy (n=2.002, campo del 31/Jul al 02/Ago, BR-02874/2026) y su diferencia de 1ª vuelta cayó de 9pp a 4pp contra la propia ronda del 27/Jul, con la 2ª vuelta volviéndose ${EMP} de 1pp. En el mercado la diferencia se cerró de +40,95pp a +40,05pp. Los dos se ajustaron por el MISMO motivo: Lula quieto en 65,50% (vol USD 7,92M) y Flávio subiendo 0,90pp, hasta 25,45% (vol USD 7,86M). Captura aprobada solo en el tercer intento, con los dos primeros bloqueados por el libro de 2º lugar.`,

  'candidates[0].header':
    `${G('Polymarket', 'polymarket')} 65,50% (quieto, vol USD 7,92M acumulado), a 62 días de la elección, el día en que ${NEXUS} mostró la diferencia de la encuesta cayendo de 9pp a 4pp. El precio no cedió, pero la diferencia sobre Flávio se cerró 0,90pp y fue a +40,05pp, porque el rival subió. Captura trabada de las 19:11 UTC.`,
  'candidates[0].fortes[0]':
    `Sigue liderando las cuatro nacionales divulgadas desde el 29/Jul, sin excepción, y gana los cuatro escenarios de 2ª vuelta de la ronda de ${NEXUS} de hoy: 46% x 45% contra Flávio, 46% x 42% contra Caiado, 46% x 40% contra Zema y 47% x 37% contra Renan Santos.`,
  'candidates[0].fortes[1]':
    `Su precio NO cedió el día en que la encuesta se ajustó: quedó quieto en 65,50% por segunda rueda seguida, lo que separa el movimiento de la encuesta del movimiento del mercado.`,
  'candidates[0].fortes[2]':
    `La caída de 1pp en 1ª vuelta y la de 1pp en la 2ª, dentro de ${NEXUS}, quedan DENTRO del margen de 2pp. Aisladas, no son movimiento.`,
  'candidates[0].fortes[3]':
    `Entre las cuatro nacionales desde el 29/Jul, tres miden la diferencia de 1ª vuelta entre 6pp y 9,3pp, y la que se ajusta a 4pp es esta. La lectura más dura para él es, por ahora, una sola casa.`,
  'candidates[0].fortes[4]':
    `El contrato de inflación anual de 2026 concentra 36,60% en la franja de 5,00% a 5,49% y sus franjas suman 99,65%, dentro de la compuerta de coherencia, sin cola de descontrol descontada.`,
  'candidates[0].fracos[0]':
    `La diferencia se cerró 0,90pp y fue a +40,05pp. En la serie diaria, no quedaba por debajo de eso desde el 30/Jul, cuando marcó +39,50pp.`,
  'candidates[0].fracos[1]':
    `El precio está 1,00pp POR DEBAJO del techo de la serie, que es 66,50%, del cierre del 01/Ago, y la diferencia está 1,75pp por debajo del máximo de +41,80pp, de la misma fecha.`,
  'candidates[0].fracos[2]':
    `En ${NEXUS} la 2ª vuelta se volvió ${EMP}: 46% x 45%, diferencia de 1pp dentro del margen de 2pp. En la ronda del 27/Jul de la misma casa eran 4pp.`,
  'candidates[0].fracos[3]':
    `La ronda de hoy no publicó aprobación ni desaprobación, así que el cuadro de evaluación sigue sin lectura nueva desde el 30/Jul.`,
  'candidates[0].fracos[4]':
    `La Policía Federal pidió al ${STF} la apertura de un tercer expediente contra Lulinha, por sospecha de tráfico de influencias (Folha y O Globo, 03/Ago). El panel registra el hecho y no atribuye efecto electoral.`,
  'candidates[0].analise':
    `Su día es el primero en mucho tiempo en que la encuesta y el precio se mueven hacia el mismo lado, y ese es el registro. ${NEXUS} publicó la 8ª ronda de la serie (n=2.002, campo del 31/Jul al 02/Ago, telefónica, margen 2pp, BR-02874/2026) y la diferencia de 1ª vuelta cayó de 9pp a 4pp contra la ronda del 27/Jul de la propia casa. En el mercado, la diferencia se cerró de +40,95pp a +40,05pp. La coincidencia de dirección es real y el mecanismo es el mismo en los dos: LULA NO CEDIÓ, y quien se movió fue el rival. En la encuesta perdió 1pp, dentro del margen; en el precio quedó exactamente quieto en 65,50% (vol USD 7,92M), por segunda rueda seguida. CONVIENE SEPARAR LO QUE ESTO NO ES. No es convergencia de NIVEL: el mercado paga 65,50% de probabilidad de victoria y la encuesta mide 41% de intención de voto en 1ª vuelta, y esas dos magnitudes ni se restan ni se comparan en nivel. Lo que coincidió fue dirección y causa. EL TECHO SIGUE ATRÁS y hay que decir la ventana: el máximo de la serie es 66,50%, del cierre del 01/Ago, y el de la diferencia es +41,80pp, de la misma fecha. En la serie diaria, la diferencia no quedaba por debajo de los +40,05pp de hoy desde el 30/Jul. LA LECTURA MÁS DURA ES DE UNA SOLA CASA, por ahora: las otras tres nacionales divulgadas desde el 29/Jul dan 6pp en PoderData, 9,1pp en ${ATLAS} y 9,3pp en Vox Brasil. La distancia entre la lectura más alta y la más baja llega a 5,3pp, y es mayor que cualquier movimiento de precio del período. Las dos nacionales que faltan de la ventana, ${G('Quaest', 'quaest')} e Ideia/Canal Meio, tienen publicación declarada para el 05/Ago y es ahí donde se ve si Nexus es la excepción o la primera en marcar un cambio de nivel. Fuera de la disputa, la Policía Federal pidió al ${STF} un tercer expediente contra Lulinha, y el panel lo registra sin atribuir efecto.`,

  'candidates[1].header':
    `${G('Polymarket', 'polymarket')} 25,45% (↑0,90pp, vol USD 7,86M acumulado), el movimiento más fuerte de la rueda entre los dos primeros, el mismo día en que ${NEXUS} midió una subida de 4pp en su encuesta. Captura trabada de las 19:11 UTC.`,
  'candidates[1].fortes[0]':
    `${NEXUS} da 37% en 1ª vuelta, contra 33% en la ronda del 27/Jul de la misma casa. La subida de 4pp es el DOBLE del margen de 2pp, así que no se explica por ruido muestral.`,
  'candidates[1].fortes[1]':
    `En la 2ª vuelta pasa de 43% a 45% y queda a 1pp de Lula, dentro del margen: es ${EMP} por primera vez en esta serie de la casa.`,
  'candidates[1].fortes[2]':
    `El precio subió 0,90pp el mismo día, hasta 25,45%, y cerró la diferencia solo, sin que el líder cediera.`,
  'candidates[1].fortes[3]':
    `Es el favorito holgado del contrato de 2º lugar, con 80,50%, lo que describe una 2ª vuelta que el mercado trata como casi resuelta.`,
  'candidates[1].fortes[4]':
    `Recibió apoyo declarado de Javier Milei, que volvió a atacar a Lula públicamente el 02 y el 03/Ago (Folha y O Globo).`,
  'candidates[1].fracos[0]':
    `Su serie de mercado desarma cualquier lectura de retorno: el techo es 45,20%, del 07/May, y el piso es 22,00%, del 03/Jul. El 25,45% de hoy es recuperación DENTRO de un nivel rebajado.`,
  'candidates[1].fracos[1]':
    `La lectura de 37% es la más favorable a él entre las cuatro nacionales desde el 29/Jul. Las otras tres dan diferencias de 6pp a 9,3pp en 1ª vuelta, y no 4pp.`,
  'candidates[1].fracos[2]':
    `Pierde los cuatro escenarios de 2ª vuelta de la propia ronda de hoy, incluso el más ajustado, por 46% x 45%.`,
  'candidates[1].fracos[3]':
    `El 37% de la 1ª vuelta sigue por debajo del nivel necesario para forzar una 2ª vuelta favorable sin transferencia de voto del resto del campo.`,
  'candidates[1].fracos[4]':
    `Pidió el voto antes del plazo legal el 01/Ago, en Santa Catarina, el mismo día en que Lula hizo lo mismo en Bahía.`,
  'candidates[1].analise':
    `Es el nombre del día en las dos mediciones, y el único que se movió de forma relevante en ambas. En ${NEXUS} (n=2.002, campo del 31/Jul al 02/Ago, BR-02874/2026) pasa de 33% a 37% en 1ª vuelta, subida de 4pp que es el doble del margen de 2pp y por lo tanto no se explica por ruido. En la 2ª vuelta pasa de 43% a 45% y queda a 1pp de Lula, lo que caracteriza ${EMP}. En el mercado, subió 0,90pp hasta 25,45% (vol USD 7,86M), responsable en solitario del cierre de la diferencia, porque Lula no cedió nada. DOS SALVEDADES CAMBIAN LA LECTURA. La primera es de serie: su techo en el mercado es 45,20%, del 07/May, y su piso es 22,00%, del 03/Jul. Es decir, 25,45% es recuperación dentro de un nivel que ya fue casi el doble, y llamar a eso un retorno sería cambiar la vara de medir. La segunda es de dispersión: el 37% es la lectura más favorable a él entre las cuatro nacionales divulgadas desde el 29/Jul, y las otras tres dan diferencias de 6pp en PoderData, 9,1pp en ${ATLAS} y 9,3pp en Vox Brasil, contra 4pp aquí. Una casa midiendo distinto de las otras tres no es una tendencia todavía, es una casa midiendo distinto. Lo que hace que esta ronda pese más que una divergencia común es que el mercado se movió en el mismo sentido y el mismo día, algo que no suele ocurrir en este panel. La prueba llega el 05/Ago, con ${G('Quaest', 'quaest')} e Ideia/Canal Meio. En el contrato de 2º lugar está en 80,50%, y en el de 3º lugar aparece con apenas 4,90%, lo que describe un mercado que trata su llegada a la 2ª vuelta como casi resuelta.`,

  'candidates[2].header':
    `${G('Polymarket', 'polymarket')} 7,45% (↓0,50pp, vol USD 8,86M acumulado), deshaciendo la subida de ayer. ${NEXUS} dio 4% en la encuesta, y la distancia entre precio y encuesta queda en 3,45pp. Captura trabada de las 19:11 UTC.`,
  'candidates[2].fortes[0]':
    `Tiene el mayor volumen acumulado entre los nombres con precio por encima de 1%, con USD 8,86M, por encima del propio Lula, que tiene USD 7,92M, con un precio un octavo del suyo.`,
  'candidates[2].fortes[1]':
    `Es el favorito del contrato de 3º lugar, con 60,50%, bastante por delante de Caiado, que tiene 25,00%.`,
  'candidates[2].fortes[2]':
    `El ${G('Novo', 'novo')} pierde espacio como partido antisistema y el panel registra la lectura de O Globo (02/Ago) de que él se contrapone a Zema en ese espacio.`,
  'candidates[2].fortes[3]':
    `VEJA señala una franja etaria en la que él se aparta del resto de la tercera vía en la ronda de ${NEXUS} de hoy.`,
  'candidates[2].fortes[4]':
    `El precio de 7,45% sigue muy por encima de la encuesta de 4%, lo que describe un mercado pagando por un escenario que la intención declarada aún no muestra.`,
  'candidates[2].fracos[0]':
    `CAYÓ 0,50pp hoy, deshaciendo la subida de 0,35pp de ayer, que había interrumpido nueve ruedas de baja.`,
  'candidates[2].fracos[1]':
    `${NEXUS} dio 4%, contra 5% en la ronda del 27/Jul de la misma casa. Es la cuarta nacional seguida en medirlo entre 3% y 4%, tras el 7,8% de ${ATLAS} del 29/Jul.`,
  'candidates[2].fracos[2]':
    `Pierde la 2ª vuelta contra Lula por 47% x 37%, la peor de las cuatro simulaciones de la ronda de hoy.`,
  'candidates[2].fracos[3]':
    `La distancia entre precio (7,45%) y encuesta (4%) queda en 3,45pp, y está del lado del precio, no de la encuesta.`,
  'candidates[2].fracos[4]':
    `Volumen alto con precio en baja describe una posición vieja que quedó abierta, no convicción actual.`,
  'candidates[2].analise':
    `Su caso sigue siendo la mayor distancia entre lo que el mercado paga y lo que la encuesta mide, y hoy la distancia disminuyó por los dos lados equivocados. En el precio, CAYÓ 0,50pp hasta 7,45% (vol USD 8,86M), deshaciendo la subida de 0,35pp de ayer, que había interrumpido nueve ruedas seguidas de baja. En la encuesta, ${NEXUS} dio 4%, contra 5% en la ronda del 27/Jul de la misma casa. La distancia entre las dos mediciones queda en 3,45pp, contra 4,95pp ayer, y el estrechamiento viene del precio cediendo, no de la encuesta subiendo. LA SECUENCIA DE LA ENCUESTA ES LO QUE MÁS PESA: tras el 7,8% de ${ATLAS} del 29/Jul, cuatro nacionales seguidas lo midieron entre 3% y 4%, con PoderData en 4%, Vox Brasil en 3,0% y ahora Nexus en 4%. Una lectura aislada alta contra cuatro consistentes bajas es el patrón clásico de excepción, y el panel lo registra así. EL VOLUMEN SIGUE SIENDO LA ANOMALÍA DE LA PIEZA: con USD 8,86M acumulados, tiene más dinero negociado que Lula, que tiene USD 7,92M, con un precio que es un octavo. Volumen alto con precio en baja describe una posición vieja que quedó abierta, no convicción de ahora. En el contrato de 3º lugar sigue siendo favorito con 60,50%, contra 25,00% de Caiado, lo que es coherente con un mercado que lo ve llegando tercero y no disputando la 2ª vuelta.`,

  'candidates[3].header':
    `Día de convención para dos de ellos. Caiado en 1,15% (vol USD 5,30M) y Zema en 0,25% (vol USD 4,66M) fueron oficializados candidatos el 03/Ago. Haddad RETROCEDIÓ a 0,15% (vol USD 6,64M). Captura trabada de las 19:11 UTC.`,
  'candidates[3].fortes[0]':
    `CAIADO fue oficializado candidato en convención y ${NEXUS} le dio 5% en 1ª vuelta, solo detrás del 5,5% de Vox Brasil del 31/Jul entre las nacionales desde el 29/Jul.`,
  'candidates[3].fortes[1]':
    `En la 2ª vuelta de la ronda de hoy, Caiado pierde ante Lula por 46% x 42%, la segunda menor distancia entre los cuatro escenarios probados.`,
  'candidates[3].fortes[2]':
    `Caiado es el segundo nombre del contrato de 3º lugar, con 25,00%, solo detrás de Renan Santos.`,
  'candidates[3].fortes[3]':
    `ZEMA fue oficializado y anunció una mudanza de Belo Horizonte a São Paulo por la campaña (O Globo, 03/Ago).`,
  'candidates[3].fortes[4]':
    `El precio de Caiado, en 1,15%, está por encima del piso de 0,90% que la serie tocó dentro del día 02/Ago.`,
  'candidates[3].fracos[0]':
    `CAIADO prometió amnistiar a Bolsonaro y a los condenados del 8 de Enero y llamó a la respuesta institucional a los actos golpistas el mayor desastre de la historia (Valor, 03/Ago), lo que lo pone a disputar el mismo electorado que Flávio, que subió 4pp en la encuesta hoy.`,
  'candidates[3].fracos[1]':
    `ZEMA sigue en 0,25% en el mercado y 3% en la encuesta de ${NEXUS}, sin movimiento el día de su propia convención.`,
  'candidates[3].fracos[2]':
    `HADDAD retrocedió a 0,15% (vol USD 6,64M). Él no es candidato, y el contrato descuenta un escenario de sustitución.`,
  'candidates[3].fracos[3]':
    `En la 2ª vuelta, Zema pierde ante Lula por 46% x 40%, la segunda mayor distancia de los cuatro escenarios de la ronda.`,
  'candidates[3].fracos[4]':
    `Los tres sumados no llegan a 1,60% en el mercado, contra 25,45% de Flávio, lo que describe un tercer espacio que el precio no trata como competitivo.`,
  'candidates[3].analise':
    `Fue el día de convención de la tercera vía y el mercado no reaccionó a ninguna de las dos. CAIADO, oficializado candidato, está en 1,15% (vol USD 5,30M), por encima del piso de 0,90% que la serie tocó dentro del día 02/Ago, y ${NEXUS} le dio 5% en 1ª vuelta, contra 6% en la ronda del 27/Jul de la misma casa. En el discurso de convención prometió amnistiar a Bolsonaro y a los condenados del 8 de Enero y llamó a la respuesta institucional a los actos golpistas el mayor desastre de la historia (Valor, 03/Ago), y el mismo día disputó con Flávio el voto del agronegocio, diciendo ser la raíz y no el sabor agro (G1, 03/Ago). EL CRUCE QUE INTERESA ES ESE: fue a buscar exactamente el electorado en el que Flávio subió 4pp en la encuesta y 0,90pp en el precio, y ni la encuesta ni el mercado registraron ganancia para él. ZEMA también fue oficializado y anunció una mudanza de Belo Horizonte a São Paulo por la campaña, y sigue en 0,25% en el mercado y 3% en la encuesta, sin movimiento en su propio día. HADDAD retrocedió a 0,15% (vol USD 6,64M), y conviene repetir que no es candidato: aquel contrato descuenta un escenario de sustitución, así que el nivel habla de percepción de riesgo sobre la fórmula del ${G('PT', 'pt')}, no de una disputa en curso. Sumados, los tres no llegan a 1,60% en el mercado, contra 25,45% de Flávio. El tercer espacio existe en la encuesta, donde Caiado tiene 5% y Zema 3%, y no existe en el precio.`,

  'quadroComparativo[0].p':
    `ENCUESTA NUEVA. ${NEXUS} del 03/Ago (n=2.002, campo del 31/Jul al 02/Ago, telefónica, margen 2pp, 95% de confianza, BR-02874/2026): 41% en 1ª vuelta y 46% x 45% en la 2ª contra Flávio. En la ronda del 27/Jul de la misma casa eran 42% y 47% x 43%.`,
  'quadroComparativo[0].m': `65,50% (vol USD 7,92M acumulado)`,
  'quadroComparativo[0].t':
    `QUIETO en 65,50% por segunda rueda. La diferencia sobre Flávio SE CERRÓ 0,90pp y fue a +40,05pp, pero se cerró por subida del rival. El precio está 1,00pp por debajo del techo de la serie, que es 66,50%, del cierre del 01/Ago.`,
  'quadroComparativo[0].s':
    `62 días de la elección. La ronda no publicó aprobación ni desaprobación. La Policía Federal pidió al ${STF} un tercer expediente contra Lulinha, y el panel lo registra sin atribuir efecto. Captura trabada 03/Ago 19:11 UTC.`,
  'quadroComparativo[1].p':
    `${NEXUS} del 03/Ago: 37% en 1ª vuelta, contra 33% el 27/Jul de la misma casa, subida de 4pp que es el doble del margen. En la 2ª vuelta, 45% contra 46% de Lula, ${EMP} dentro del margen de 2pp.`,
  'quadroComparativo[1].m': `25,45% (vol USD 7,86M acumulado)`,
  'quadroComparativo[1].t':
    `SUBIÓ 0,90pp, el movimiento más fuerte de la rueda entre los dos primeros, y cerró la diferencia solo. Salvedad de serie: su techo es 45,20% del 07/May y su piso es 22,00% del 03/Jul.`,
  'quadroComparativo[1].s':
    `Favorito del contrato de 2º lugar con 80,50%. Recibió apoyo declarado de Milei, que volvió a atacar a Lula el 02 y el 03/Ago. Captura trabada 03/Ago 19:11 UTC.`,
  'quadroComparativo[2].p':
    `${NEXUS} del 03/Ago: 4%, contra 5% el 27/Jul de la misma casa. Es la cuarta nacional seguida en medirlo entre 3% y 4%, tras el 7,8% de ${ATLAS} del 29/Jul. Pierde la 2ª vuelta ante Lula por 47% x 37%.`,
  'quadroComparativo[2].m': `7,45% (vol USD 8,86M acumulado)`,
  'quadroComparativo[2].t':
    `CAYÓ 0,50pp y deshizo la subida de 0,35pp de ayer, que había interrumpido nueve ruedas de baja. La distancia entre precio y encuesta queda en 3,45pp, contra 4,95pp ayer, y se estrechó por el lado del precio.`,
  'quadroComparativo[2].s':
    `Mayor volumen acumulado entre los nombres con precio por encima de 1%, por encima del de Lula, con un precio un octavo. Favorito del contrato de 3º lugar con 60,50%. Captura trabada 03/Ago 19:11 UTC.`,
  'quadroComparativo[3].p':
    `${NEXUS} del 03/Ago: 5% en 1ª vuelta, contra 6% el 27/Jul de la misma casa. En la 2ª vuelta, pierde ante Lula por 46% x 42%, la segunda menor distancia de los cuatro escenarios probados.`,
  'quadroComparativo[3].m': `1,15% (vol USD 5,30M acumulado)`,
  'quadroComparativo[3].t':
    `Por encima del piso de 0,90% que la serie tocó dentro del día 02/Ago. Sin ganancia de precio el día de su propia convención.`,
  'quadroComparativo[3].s':
    `Oficializado candidato en convención el 03/Ago. Prometió amnistiar a Bolsonaro y a los condenados del 8 de Enero y disputó con Flávio el voto del agronegocio. Segundo nombre del contrato de 3º lugar, con 25,00%.`,
  'quadroComparativo[4].p':
    `${NEXUS} del 03/Ago: 3% en 1ª vuelta, el mismo de la ronda del 27/Jul de la misma casa. En la 2ª vuelta, pierde ante Lula por 46% x 40%.`,
  'quadroComparativo[4].m': `0,25% (vol USD 4,66M acumulado)`,
  'quadroComparativo[4].t': `ESTABLE en 0,25%, sin movimiento el día de su propia convención.`,
  'quadroComparativo[4].s':
    `Oficializado candidato en convención el 03/Ago y anunció una mudanza de Belo Horizonte a São Paulo por la campaña. Captura trabada 03/Ago 19:11 UTC.`,
  'quadroComparativo[5].t':
    `ESTABLE en 3,10% por segunda rueda seguida, en un día de noticias institucionales intensas.`,
  'quadroComparativo[5].s':
    `Fachin dijo que el ${STF} debe convivir con la contestación de la opinión pública. La Policía Federal aplazó la declaración del ex socio de Vorcaro. La familia de Moraes perdió una acción contra un senador que citó su vínculo con el ${G('Banco Master', 'banco-master')}. Nada de eso movió el precio.`,

  cruzamento:
    `EL CRUCE DE HOY ES RARO Y MERECE DECIRSE CON CUIDADO: las dos mediciones se movieron hacia el MISMO LADO, el MISMO DÍA, y por el MISMO MOTIVO. ${NEXUS} publicó la 8ª ronda de la serie (n=2.002, campo del 31/Jul al 02/Ago, telefónica, margen 2pp, 95% de confianza, BR-02874/2026) y la diferencia de 1ª vuelta cayó de 9pp a 4pp contra la ronda del 27/Jul de la propia casa, con la 2ª vuelta pasando de 4pp a 1pp, lo que es ${EMP}. En el mercado, la captura trabada de las 19:11 UTC muestra la diferencia cerrándose de +40,95pp a +40,05pp. En ambos casos el mecanismo es idéntico: LULA NO CEDIÓ y FLÁVIO SUBIÓ. En la encuesta, Lula perdió 1pp, dentro del margen, y Flávio ganó 4pp, el doble. En el precio, Lula quedó exactamente quieto en 65,50% (vol USD 7,92M) y Flávio subió 0,90pp, hasta 25,45% (vol USD 7,86M). --- LO QUE ESTO NO ES, Y LA DISTINCIÓN ES EL MÉTODO DE LA CASA. No es convergencia de NIVEL. El mercado paga 65,50% de probabilidad de victoria y la encuesta mide 41% de intención de voto en 1ª vuelta: son magnitudes distintas, una es chance de ganar y la otra es porción de voto, y restar una de la otra produce un número sin unidad. AFOS compara DIRECCIÓN y CONVICCIÓN, nunca nivel, y por eso hoy hay algo que registrar: las dos series se movieron en el mismo sentido, algo que no venía ocurriendo. --- LA SALVEDAD QUE IMPIDE LA LECTURA FÁCIL ES LA DISPERSIÓN ENTRE CASAS. Los 4pp de Nexus son la lectura más ajustada entre las cuatro nacionales divulgadas desde el 29/Jul: PoderData del 30/Jul dio 6pp, ${ATLAS} del 29/Jul dio 9,1pp y Vox Brasil del 31/Jul dio 9,3pp. La distancia entre la lectura más alta y la más baja llega a 5,3pp, y es MAYOR que cualquier movimiento de precio del período. Una casa midiendo distinto de las otras tres no es un cambio de nivel, es una casa midiendo distinto, y el panel lo registra así hasta que se pruebe lo contrario. La prueba llega el 05/Ago, cuando ${G('Quaest', 'quaest')} e Ideia/Canal Meio tienen publicación declarada, las dos nacionales que faltan de la ventana que el ${TSE} registró. --- LA SERIE IMPIDE EL SEGUNDO ATAJO, que sería hablar de un retorno de Flávio. Su techo en el mercado es 45,20%, del 07/May, y su piso es 22,00%, del 03/Jul. El 25,45% de hoy es recuperación DENTRO de un nivel ya rebajado, no retorno al nivel anterior. Del lado de Lula, el techo es 66,50% y el de la diferencia es +41,80pp, ambos del cierre del 01/Ago, y los dos siguen por encima de lo que este panel publica hoy. En la serie diaria, la diferencia no quedaba por debajo de los +40,05pp desde el 30/Jul, cuando marcó +39,50pp. --- EN EL RESTO DEL TABLERO, el día fue de convención sin efecto de precio. Caiado y Zema fueron oficializados candidatos y ninguno de los dos ganó en el mercado: Caiado está en 1,15% (vol USD 5,30M) y Zema en 0,25% (vol USD 4,66M). Caiado prometió amnistiar a Bolsonaro y a los condenados del 8 de Enero y disputó con Flávio el voto del agronegocio, justo el día en que Flávio subió en las dos mediciones. RENAN SANTOS cayó 0,50pp hasta 7,45% (vol USD 8,86M), deshaciendo la subida de ayer, con su encuesta en 4% y la distancia entre precio y encuesta en 3,45pp. HADDAD retrocedió a 0,15%. El contrato de destitución de un ministro del ${STF} quedó ESTABLE en 3,10% (vol USD 83 mil) en un día de noticias institucionales pesadas, con la Policía Federal aplazando la declaración del ex socio de Vorcaro y pidiendo un tercer expediente contra Lulinha, lo que describe un mercado que no descuenta una ruptura a partir de un hecho judicial aislado.`,
})
