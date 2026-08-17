/**
 * Mapa ES de 17/Ago para polls-data.json.
 * Convenções ES: vírgula decimal e ponto de milhar, como no pt-BR.
 */
import { construir } from '../build-locale-json'

const CAR = 'lectura confirmada del 17 de ago, 18:48 BRT (21:48 UTC)'

construir('polls-data', 'es', {
  'polls[0].method': `Telefónica`,
  'polls[0].note':
    `Encuesta nacional BTG/Nexus difundida el 17 de ago, la 10ª ronda de la serie de la casa, verificada en el sitio de la propia casa (nexus.fsb.com.br) y reportada por Folha de S.Paulo, UOL, Poder360, VEJA, CartaCapital, Metrópoles y Gazeta do Povo. ` +
    `Primera vuelta estimulada: Lula 41% x Flávio Bolsonaro 36%, con Ronaldo Caiado en 5%, Renan Santos en 4% y Romeu Zema en 4%. Balotaje: Lula 47% x Flávio 44%. ` +
    `⭐ LA COMPARACIÓN CON LA RONDA ANTERIOR DE LA PROPIA CASA ES EL DATO, Y ES DE ESTABILIDAD: en la primera vuelta Lula pasó de 40% a 41% y Flávio de 35% a 36%, así que la DISTANCIA quedó en los mismos 5 puntos. En el balotaje el resultado es IDÉNTICO al de la ronda anterior, 47 a 44, manteniendo 3 puntos. Cada movimiento de 1 punto cabe entero dentro del margen de 2pp declarado por la casa. ` +
    `⭐ EL ORDEN DEL PELOTÓN ESTÁ INVERTIDO RESPECTO DEL MERCADO: Caiado aparece con 5% y Renan Santos con 4%, mientras que en el precio Renan tiene 4,05% de ganar contra 0,25% de Caiado. ` +
    `EVALUACIÓN DEL GOBIERNO en la misma ronda: 42% de malo o pésimo, 34% de excelente o bueno y 23% de regular, según Diário do Grande ABC, ndmais y A Folha das Cidades. ` +
    `⛔ El panel NO publica el par aprobación y desaprobación de esta ronda: los medios divergieron entre 47% contra 48% (Metrópoles) y 46% contra 49% (Brasil 247), y el sitio de la casa no trajo el dato. Donde la lectura no converge, el panel declara en vez de elegir. ` +
    `⚠️ La justicia electoral registra el campo del 14 al 16 de ago y la muestra planificada en 2.000; la casa publicó 2.003 entrevistas realizadas.`,
  'polls[0].source':
    `BTG/Nexus, verificada en la fuente primaria en nexus.fsb.com.br, y reportada por Folha de S.Paulo, UOL, Poder360, VEJA, CartaCapital, Metrópoles y Gazeta do Povo, 17 de ago`,

  'approvalData.note':
    `🏷️ LOS NÚMEROS ESTRUCTURADOS DE ESTE BLOQUE SON DE LA GENIAL/QUAEST DEL 14 DE AGO, y son estos: 46% de aprobación contra 48% de desaprobación, con 6% de no sabe, y 36% de excelente o bueno, 25% de regular y 37% de malo o pésimo. El panel mantiene UNA casa por bloque a propósito, para no sumar escalas de casas distintas. ` +
    `⭐ NACIONAL NUEVA EL 17 DE AGO, declarada acá y NO mezclada arriba: la BTG/Nexus (n=2.003, campo del 14 al 16 de ago, BR-03317/2026, margen de 2pp) trae 42% de malo o pésimo, 34% de excelente o bueno y 23% de regular, según Diário do Grande ABC, ndmais y A Folha das Cidades. ` +
    `⛔ EL PAR APROBACIÓN Y DESAPROBACIÓN DE LA BTG/NEXUS NO ENTRA, y el motivo está declarado: los medios divergieron entre 47% contra 48% (Metrópoles) y 46% contra 49% (Brasil 247), y el sitio de la casa no publicó el dato. Donde la lectura no converge, el panel declara en vez de elegir. ` +
    `⭐ LA DISTANCIA ENTRE LAS CASAS ES EL DATO: en el campo negativo de la escala de excelente a pésimo, la Quaest del 14 de ago marca 37% y la BTG/Nexus del 17 de ago marca 42%, cinco puntos en tres días. La PoderData/Aya del 13 de ago traía todavía 43% de aprobación contra 50% de desaprobación. El panel no elige entre ellas.`,

  'polymarketComparison.note':
    `⭐ EL DÍA TIENE UNA DIVERGENCIA DE DIRECCIÓN ENTRE LOS DOS UNIVERSOS, y ese es el hallazgo. La BTG/Nexus del 17 de ago (n=2.003, campo del 14 al 16 de ago, margen de 2pp) mostró ESTABILIDAD: el líder pasó de 40% a 41%, el segundo de 35% a 36%, la distancia quedó en los mismos 5 puntos y el balotaje repitió 47 a 44. El mismo día el precio CERRÓ 4,00pp de esa distancia, de 37,05pp a 33,05pp. ` +
    `⛔ El panel no afirma que el precio reaccionó a la encuesta: la encuesta no achicó nada, así que no explica un achicamiento de 4 puntos. ` +
    `⭐ Y hay un segundo cruce, sobre quién es el tercero: la encuesta pone a Caiado en 5% y a Renan Santos en 4%, mientras el mercado le da 4,05% a Renan y 0,25% a Caiado, y en el contrato de tercer lugar 52,50% contra 38,50%. Los dos universos no coinciden sobre el orden del pelotón. ` +
    `📌 Captura confirmada por DOS pasadas independientes de la traba, en ventanas separadas.`,

  'polymarketComparison.candidates[0].polymarket': `64,50%`,
  'polymarketComparison.candidates[0].pesquisaRange': `38-44%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `NACIONAL NUEVA EL 17 DE AGO: la BTG/Nexus le da 41% en la primera vuelta, alza de 1 punto contra la ronda anterior de la propia casa, que lo tenía en 40%, y 47% en el balotaje, IDÉNTICO a la ronda anterior. ⭐ La distancia hacia el segundo NO cambió, sigue en 5 puntos, porque los dos subieron 1 punto, y cada movimiento cabe dentro del margen de 2pp. La Quaest del 14 de ago sigue en la base con 38%.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `🔴 CAÍDA DE 2,00pp EL 17 DE AGO, de 66,50% a 64,50% (vol USD 8,52M acumulado), ${CAR}, con la traba de captura aprobada en DOS pasadas separadas. Devolvió exactamente lo que había subido la víspera. La distancia hacia el segundo SE CERRÓ de 37,05pp a 33,05pp, o sea 4,00pp en cerca de 26 horas. ⛔ Sin superlativo: el máximo de la serie sigue en 66,50%, del 1 de ago, y 5 de los 90 días registrados desde el 19 de may están por encima del cierre de hoy.`,

  'polymarketComparison.candidates[1].polymarket': `31,45%`,
  'polymarketComparison.candidates[1].pesquisaRange': `31-36%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `NACIONAL NUEVA EL 17 DE AGO: la BTG/Nexus lo lleva de 35% a 36% en la primera vuelta y repite 44% en el balotaje. ⚠️ La ganancia de 1 punto está dentro del margen de 2pp de la casa, y la distancia hacia el líder quedó igual, en 5 puntos. La Quaest del 14 de ago sigue en la base con 31%.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `🔴 ALZA DE 2,00pp EL 17 DE AGO, de 29,45% a 31,45% (vol USD 8,46M acumulado), ${CAR}. Es el cuarto día seguido de alza y el mayor movimiento del día entre los contratos grandes. ⛔ NO es récord: de los 90 días de la serie desde el 19 de may, 2 están por encima, y el máximo es 33,20%, del 2 de jun. ⚠️ CAUSACIÓN: la encuesta del día NO achicó la distancia entre los dos primeros, que quedó en los mismos 5 puntos, así que no explica el achicamiento de 4,00pp en el precio.`,

  'polymarketComparison.candidates[2].polymarket': `4,05%`,
  'polymarketComparison.candidates[2].pesquisaRange': `4-5%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `🔴 NACIONAL NUEVA EL 17 DE AGO: la BTG/Nexus lo mantiene en 4% en la primera vuelta y lo ubica DETRÁS de Caiado, que tiene 5%. Queda empatado con Zema, que también tiene 4%, dentro del margen de 2pp.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `🔴 CAÍDA de 4,70% a 4,05% (vol USD 9,95M acumulado), ${CAR}, y el valor queda POR DEBAJO del piso de 4,80% registrado en la serie de 90 días. ⚠️ SALVEDAD DE FORMA: su book es fino y osciló entre 3,75% y 4,15% en menos de diez minutos durante la captura, así que el movimiento merece una lectura más floja que la de los dos primeros. En el contrato de tercer lugar cedió de 53,00% a 52,50%.`,

  'polymarketComparison.candidates[3].polymarket': `0,25%`,
  'polymarketComparison.candidates[3].pesquisaRange': `4-5%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `⭐ NACIONAL NUEVA EL 17 DE AGO: la BTG/Nexus le da 5% en la primera vuelta, POR ENCIMA del 4% de Renan Santos. En la intención declarada pasa a ser el tercer nombre del cuadro, invirtiendo el orden que el mercado descuenta.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `⭐ EL CRUCE DE CONTRATO SE REPITE Y CAMBIA DE SIGNO: cayó de 0,60% a 0,25% en la VICTORIA (vol USD 6,07M acumulado), por debajo del piso de 0,50% de la serie, y SUBIÓ de 37,50% a 38,50% en el contrato de TERCER LUGAR de la primera vuelta. Su distancia hacia el primero de ese book se cerró de 15,50pp a 14,00pp. Son preguntas distintas y el panel no las suma.`,

  'polymarketComparison.candidates[4].polymarket': `0,05%`,
  'polymarketComparison.candidates[4].pesquisaRange': `no testeado`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `No aparece en el escenario estimulado de la BTG/Nexus del 17 de ago ni en la Quaest del 14 de ago.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `Sin movimiento capturado el 17 de ago. El precio sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido, y no aparece en el escenario estimulado de la BTG/Nexus de hoy.`,

  'polymarketComparison.candidates[5].polymarket': `0,25%`,
  'polymarketComparison.candidates[5].pesquisaRange': `2-4%`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `NACIONAL NUEVA EL 17 DE AGO: la BTG/Nexus le da 4% en la primera vuelta, por encima del 2% que medía la Quaest del 14 de ago, y empatado con Renan Santos dentro del margen de 2pp.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `ALZA de 0,10pp, de 0,15% a 0,25% (vol USD 5,62M acumulado), ${CAR}. El precio sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. En el contrato de tercer lugar tiene 4,95%.`,

  'polymarketComparison.candidates[6].polymarket': `0,05%`,
  'polymarketComparison.candidates[6].pesquisaRange': `no testeado`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `No aparece en el escenario estimulado de la BTG/Nexus del 17 de ago ni en la Quaest del 14 de ago.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `Sin movimiento capturado el 17 de ago. El precio sigue por debajo del corte de 0,5%, y no aparece en el escenario estimulado de la BTG/Nexus de hoy.`,
})
