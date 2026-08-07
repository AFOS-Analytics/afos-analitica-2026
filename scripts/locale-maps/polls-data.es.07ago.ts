/**
 * Mapa ES de 07/Ago para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como o pt. Datas "7/Ago".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`

construir('polls-data', 'es', {
  // Preço em espanhol segue a convenção do português: vírgula decimal.
  'polymarketComparison.candidates[1].polymarket': `26,95%`,
  'polymarketComparison.candidates[2].polymarket': `7,25%`,
  'polymarketComparison.candidates[3].polymarket': `1,55%`,

  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA LECTURA DEL 7/Ago, DE LAS 19:44 UTC. AFOS solo publica precio que dos lecturas independientes confirmen, tomadas con ocho minutos de intervalo. LA BRECHA DE LULA SOBRE FLÁVIO SE REDUJO POR SEXTO DÍA CONSECUTIVO, de +41,80pp el 1/Ago a +37,55pp hoy, y la causa está en un solo extremo: Flávio subió de 24,70% a 26,95% en el período y Lula sigue estancado en 64,50% desde el 4/Ago. EL MAYOR MOVIMIENTO DEL DÍA NO FUE EN EL CONTRATO DE GANADOR: el de segundo lugar de la ${G('primera vuelta', 'primeiro-turno')} cayó 4,50pp para Flávio, de 87,50% a 83,00%, mientras su precio de ganador subía. En el de tercer lugar hubo un intercambio en espejo, con Renan Santos subiendo 2,50pp, a 58,50%, y Caiado cayendo 2,00pp, a 33,50%, lo inverso exacto de lo que ambos hicieron el 6/Ago. EL LADO DE LAS ENCUESTAS NO ES DE HOY: no hay encuesta nacional nueva desde el 5/Ago, cuando salieron ${G('Genial/Quaest', 'quaest')} y Meio/Ideia. Cinco encuestas nacionales están registradas en el ${G('TSE', 'tse')} para el 10 y el 11/Ago, y cuatro de ellas seguían en campo este viernes.`,

  'polymarketComparison.sources':
    `Precios de ${G('Polymarket', 'polymarket')} vía el proxy de AFOS, captura confirmada por dos lecturas, la más reciente a las 19:44 UTC del 7/Ago (scripts/capture-guard.ts). Encuestas: Genial/Quaest BR-06591/2026 y Meio/Ideia BR-04579/2026, ambas del 5/Ago, campo del 31/Jul al 3/Ago, divulgadas por G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, O Globo, Estadão, Exame, Gazeta do Povo y JOTA. Cruces de Genial/Quaest divulgados el 6 y el 7/Ago por Folha de S.Paulo, Estadão y G1. Barrido del TSE del 7/Ago: 559 registros, ninguno insertado nuevo, 11 nacionales en la ventana de 15 días y cinco de ellas con divulgación prevista para el 10 y el 11/Ago.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes las dos del 5/Ago: ${G('Genial/Quaest', 'quaest')} (n=2.004, campo del 31/Jul al 3/Ago, presencial, margen 2pp, BR-06591/2026) con 39% en la ${G('primera vuelta', 'primeiro-turno')} y 44% x 39% en el balotaje contra Flávio, ganando también a Zema por 46% x 34%, a Caiado por 45% x 37% y a Renan Santos por 45% x 35%; y Meio/Ideia (n=1.500, telefónica, margen 2,5pp, BR-04579/2026) con 43% y 48,5% x 43%, ganando los cuatro escenarios. LO QUE LLEGÓ NUEVO FUERON LOS CRUCES de Quaest, divulgados el 6 y el 7/Ago: lidera entre los mayores, entre los católicos y entre quienes no tienen religión, y abre más de 16 puntos de ventaja entre las mujeres. La misma ronda midió que el apoyo declarado de Trump a su rival NO amplía la intención de voto. La APROBACIÓN sigue en 48% contra 47% en Quaest, con la gestión en 36% positiva, 26% regular y 36% negativa.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 64,50% (vol USD 8,11M acumulado). ESTANCADO en el mismo valor por cuarto día consecutivo, del 4 al 7/Ago. La brecha sobre Flávio pasó de +37,65pp a +37,55pp, sexto estrechamiento consecutivo desde el máximo de +41,80pp del 1/Ago, y en este tramo final el estrechamiento entero viene de la subida del otro. En la serie de 88 días, del 10/May a hoy, su techo es 66,50%, del 1/Ago, y solo 8 de los 88 días tuvieron valor igual o mayor que el actual.`,

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 30% en la ${G('primera vuelta', 'primeiro-turno')} de ${G('Genial/Quaest', 'quaest')}, contra 28% en la propia ronda del 15/Jul de esa casa, y los 35% de Meio/Ideia, contra 32% en su propia ronda del 8/Jul, con balotajes de 39% y 43%. La brecha contra Lula queda en 9pp en Quaest y 8pp en Ideia, contra los 4pp de ${G('BTG/Nexus', 'nexus-btg')} del 3/Ago: el nivel de 4pp sigue siendo de una sola casa. EN LOS CRUCES divulgados el 6 y el 7/Ago gana entre los evangélicos, y es el único segmento grande en el que aparece por delante. El RECHAZO sigue en 54%, contra 52% de Lula, y entre los dos primeros, los únicos con rechazo divulgado en esa ronda, el suyo es el más alto.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 26,95% (vol USD 8,08M acumulado). Subió 0,10pp contra el 6/Ago y completó seis días de acercamiento, de 24,70% el 1/Ago a 26,95% hoy. No es extremo: 28 de los 88 días de la serie tuvieron valor igual o mayor, con techo de 43,30% el 12/May y piso de 22,00% el 3/Jul. EN EL CONTRATO DE SEGUNDO LUGAR CAYÓ 4,50pp, de 87,50% a 83,00%, el mayor movimiento del panel desde la lectura del 6/Ago.`,

  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 4% de ${G('Genial/Quaest', 'quaest')}, contra 3% en la propia ronda del 15/Jul de esa casa, y los 4,7% de Meio/Ideia, contra 2% en su propia ronda del 8/Jul. En los balotajes es el peor colocado de las dos rondas: pierde ante Lula por 45% x 35% en Quaest y por 48% x 34,7% en Ideia. Con eso, seis nacionales seguidas lo miden entre 3% y 4,7%, después del 7,8% de ${G('AtlasIntel', 'atlasintel')} del 29/Jul, y la lectura aislada alta sigue siendo la excepción del conjunto.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 7,25% (vol USD 9,19M acumulado). Subió 0,35pp contra el 6/Ago, y en el contrato de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} subió 2,50pp, de 56,00% a 58,50%. Con las encuestas estancadas entre 4% y 4,7%, la distancia entre precio e intención declarada AUMENTÓ hoy, yendo de 2,55pp a 3,25pp, siempre del lado del precio. En la serie de 88 días su máximo es 17,90% y su mínimo 5,50%.`,

  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 4% de ${G('Genial/Quaest', 'quaest')}, lo mismo que en su propia ronda del 15/Jul, y los 5,7% de Meio/Ideia, contra 4% en su propia ronda del 8/Jul. En los balotajes pierde ante Lula por 45% x 37% en Quaest y por 48,5% x 40% en Ideia. La divergencia entre institutos sobre él sigue abierta dentro de la misma ventana de campo: 4% en una casa y 5,7% en la otra, con ambas recogiendo del 31/Jul al 3/Ago. Su campaña anunció que Roberto Azevêdo coordinará el área internacional.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 1,55% (vol USD 5,58M acumulado). CAYÓ en los dos libros: 0,30pp en el presidencial y 2,00pp en el de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')}, de 35,50% a 33,50%. Esa caída es el espejo exacto de la subida de Renan Santos en el mismo contrato, lo que describe una transferencia entre los dos nombres y no un movimiento del pelotón.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Ni ${G('Genial/Quaest', 'quaest')} ni Meio/Ideia lo prueban en ningún escenario presidencial, de ${G('primera vuelta', 'primeiro-turno')} o de balotaje, y no hay encuesta nacional nueva desde entonces. La ausencia de prueba es información que el panel registra, en vez de repetir dato viejo como si fuera nuevo. Disputa la REELECCIÓN al gobierno de São Paulo, oficializada por ${G('Republicanos', 'republicanos')} el 1/Ago.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 0,05% (vol USD 13,87M acumulado). Sin variación contra el 6/Ago. El nivel es lo bastante bajo para que las variaciones en esta banda tengan valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 2% de ${G('Genial/Quaest', 'quaest')}, lo mismo que en su propia ronda del 15/Jul, y los 2,6% de Meio/Ideia, contra 2,5% en su propia ronda del 8/Jul. En los balotajes es el rival al que Lula gana con más holgura en Quaest, por 46% x 34%, y pierde por 48,5% x 37% en Ideia. FUE EL PRIMER PRESIDENCIABLE EN REGISTRAR CANDIDATURA, el 7/Ago, declarando R$ 178,7 millones de patrimonio, en un plazo que va hasta el 15/Ago. Ese mismo día, Nikolas Ferreira empezó a intentar convencerlo de cambiar la carrera presidencial por el Senado.`,

  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 0,45% (vol USD 4,83M acumulado). Estancado en el mismo valor del 6/Ago, y en esta banda las variaciones tienen valor informativo casi nulo. En el contrato de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} está en 3,70%. La salvedad de serie sigue vigente: su máximo fue 10,10%, el 26/Abr.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Ni ${G('Genial/Quaest', 'quaest')} ni Meio/Ideia lo prueban en ningún escenario, de ${G('primera vuelta', 'primeiro-turno')} o de balotaje, y no hay encuesta nacional nueva desde entonces, así que sigue sin encuestas propias. El agravante permanece y hay que decirlo con claridad: NO es candidato a la Presidencia, disputa el gobierno de São Paulo, y cualquier escenario que lo incluya es hipótesis de encuesta, no candidatura en curso.`,

  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[lectura del 7/Ago, 19:44 UTC] En 0,15% (vol USD 6,77M acumulado). Sin variación contra el 6/Ago. El nivel es lo bastante bajo para que las variaciones en esta banda tengan valor informativo casi nulo.`,
})
