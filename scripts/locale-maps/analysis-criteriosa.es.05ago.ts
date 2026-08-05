/**
 * Mapa ES de 05/Ago para analysis-criteriosa.json.
 * Vírgula decimal e ponto de milhar, iguais ao pt. Datas "03/Ago".
 * "pesquisa" vira "encuesta", "returno" vira "segunda vuelta", "parado" vira
 * "estancado", "estadual" vira "estatal", "precificar" vira "descontar".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 05/Ago 17:00, a 60 días de la ${G('1ª vuelta', 'primeiro-turno')}. EL LADO DE LAS URNAS ES DE HOY Y VINO DOBLE: dos encuestas nacionales publicadas el mismo día, ambas con campo en la misma ventana, del 31/Jul al 03/Ago. ${G('Genial/Quaest', 'quaest')} (n=2.004, BR-06591/2026) da 39% x 30% en la 1ª vuelta y 44% x 39% en la segunda. Meio/Ideia (n=1.500, BR-04579/2026) da 43% x 35% y 48,5% x 43%. LA APROBACIÓN REPITIÓ EL NÚMERO DE TRES SEMANAS ANTES: 48% x 47% en Quaest, idéntico al del 15/Jul, con la gestión en 36% x 26% x 36%, también idéntica. En el tablero, FLÁVIO CERRÓ FÓRMULA en el último día del plazo de las convenciones, con Alfredo Gaspar, relator de la comisión de investigación del INSS. Los precios de esta página son de la lectura del 03/Ago, a las 19:11 UTC, y cada uno está marcado como tal.`,

  'candidates[0].header':
    `URNAS DOBLES HOY: 39% en la ${G('1ª vuelta', 'primeiro-turno')} de Genial/Quaest y 43% en la de Meio/Ideia, con segundas vueltas de 44% x 39% y 48,5% x 43%. APROBACIÓN en 48% contra 47% en Quaest, número idéntico al de su propia ronda del 15/Jul. Precio del 03/Ago: ${G('Polymarket', 'polymarket')} 65,50% (vol USD 7,92M acumulado), de la lectura de las 19:11 UTC.`,

  'candidates[0].fortes[0]':
    `Lidera LOS DOS escenarios de 1ª vuelta de hoy y gana los OCHO escenarios de segunda vuelta de las dos rondas sumadas, sin excepción: 44% x 39%, 46% x 34%, 45% x 37% y 45% x 35% en Quaest, y 48,5% x 43%, 48,5% x 37%, 48,5% x 40% y 48% x 34,7% en Ideia.`,

  'candidates[0].fortes[1]':
    `En Meio/Ideia SUBIÓ dentro de su propia casa, de 40,4% a 43% en la 1ª vuelta, y la diferencia contra Flávio quedó casi igual, de 8,4pp a 8pp.`,

  'candidates[0].fortes[2]':
    `Su rechazo es MENOR que el del segundo colocado en la ronda de Quaest: 52% contra 54%, con 45% declarando voto contra 41% de Flávio.`,

  'candidates[0].fortes[3]':
    `La aprobación del gobierno no cedió en ninguna de las dos casas recientes: 48% x 47% en Quaest, repitiendo el número del 15/Jul, y 47% x 48% en ${G('BTG/Nexus', 'nexus-btg')}, estancada en 47% desde hace tres rondas.`,

  'candidates[0].fortes[4]':
    `En el voto espontáneo de Meio/Ideia, que es una pregunta más dura porque no ofrece lista, tiene 34,4% contra 23% de Flávio, con 27,7% de indecisos.`,

  'candidates[0].fracos[0]':
    `En ${G('Genial/Quaest', 'quaest')} CEDIÓ dentro de su propia casa: de 40% a 39% en la 1ª vuelta y de 45% a 44% en la segunda. Las dos caídas son de 1pp y quedan dentro del margen de 2pp, así que aisladas no son movimiento.`,

  'candidates[0].fracos[1]':
    `La diferencia de la segunda vuelta en Quaest cayó de 8pp a 5pp, y esa caída de 3pp es mayor que el margen de la encuesta.`,

  'candidates[0].fracos[2]':
    `Las dos casas miden movimientos de SIGNO CONTRARIO para él en la misma ventana de campo, subiendo en Ideia y cediendo en Quaest, lo que es información sobre método y no permite afirmar una dirección.`,

  'candidates[0].fracos[3]':
    `Ninguna de las dos rondas lo coloca por encima de 43% en la 1ª vuelta, así que la hipótesis de victoria en una sola vuelta sigue sin sustento en los números de hoy.`,

  'candidates[0].fracos[4]':
    `Aliados admiten desgaste de campaña por las investigaciones sobre Fábio Luís Lula da Silva y por el caso Marcola, y se reunió con Alcolumbre en la casa de Moraes tras la ruptura entre los dos.`,

  'candidates[0].analise':
    `Su día tiene dos lecturas de las urnas y ninguna del mercado, y hay que separar las tres cosas. ${G('GENIAL/QUAEST', 'quaest')} (n=2.004, campo del 31/Jul al 03/Ago, presencial en 120 municipios, margen 2pp, contratante Banco Genial, BR-06591/2026) lo trae con 39% en la ${G('1ª vuelta', 'primeiro-turno')} y 44% x 39% en la ${G('segunda vuelta', 'segundo-turno')} contra Flávio, venciendo también a Zema por 46% x 34%, a Caiado por 45% x 37% y a Renan Santos por 45% x 35%. MEIO/IDEIA (n=1.500, telefónica, margen 2,5pp, BR-04579/2026) lo trae con 43% y 48,5% x 43%, ganando también los cuatro. DENTRO DE CADA CASA, QUE ES LA ÚNICA COMPARACIÓN VÁLIDA, los movimientos se oponen: en Quaest cede 1pp en la 1ª vuelta y 1pp en la segunda, contra la ronda del 15/Jul; en Ideia sube de 40,4% a 43%, contra la ronda del 08/Jul. Dos casas midiendo la misma ventana y apuntando hacia lados distintos es información sobre la regla, no sobre el electorado, y el panel registra las dos sin elegir. LO QUE NO SE MOVIÓ FUE LA APROBACIÓN, y aquí el dato es fuerte justamente porque se repite: Quaest da 48% de aprobación contra 47% de desaprobación, los MISMOS 48% x 47% que midió el 15/Jul, y la evaluación de la gestión repite el reparto exacto de 36% positiva, 26% regular y 36% negativa. ${G('BTG/Nexus', 'nexus-btg')} del 03/Ago da la imagen espejo, 47% x 48%, y en su serie la aprobación está en 47% desde hace tres rondas. Las dos casas discrepan en el signo del saldo, ambas dentro del margen, y coinciden en que no se mueve. PoderData/Aya del 30/Jul sigue siendo la lectura más dura del conjunto, en 43% x 49%. EL PRECIO NO ENTRA HOY: lo que el panel publica es la lectura del 03/Ago, con él en 65,50% (vol USD 7,92M acumulado) y diferencia de +40,05pp. En la serie diaria de 88 días, del 08/May a hoy, su máximo sigue siendo 66,50% y la diferencia máxima +41,80pp, ambos del cierre del 01/Ago.`,

  'candidates[1].header':
    `CERRÓ FÓRMULA EN EL ÚLTIMO DÍA DEL PLAZO: el candidato a vice es Alfredo Gaspar, diputado del ${G('PL', 'pl')} por Alagoas y relator de la comisión de investigación del INSS. Es una fórmula de un solo partido. En las urnas sube dentro de las dos casas: 30% en Quaest, contra 28% el 15/Jul, y 35% en Ideia, contra 32% el 08/Jul. Precio del 03/Ago: ${G('Polymarket', 'polymarket')} 25,45% (vol USD 7,86M acumulado).`,

  'candidates[1].fortes[0]':
    `SUBIÓ en las dos casas dentro de su propia serie: de 28% a 30% en la 1ª vuelta de Quaest y de 32% a 35% en la de Ideia, y de 37% a 39% y de 40% a 43% en las respectivas segundas vueltas.`,

  'candidates[1].fortes[1]':
    `El alza de 3pp en Meio/Ideia es mayor que el margen de 2,5pp de la encuesta, así que no se explica por ruido de muestra.`,

  'candidates[1].fortes[2]':
    `RESOLVIÓ LA VICEPRESIDENCIA, que era el agujero declarado de su campaña, en el último día del plazo de las convenciones, y lo resolvió con un nombre que carga el caso INSS, tema en que el gobierno es el blanco.`,

  'candidates[1].fortes[3]':
    `Es el favorito holgado del contrato de 2º lugar, que estaba en 80,50% en la lectura del 03/Ago, lo que describe una segunda vuelta tratada como casi segura por el mercado.`,

  'candidates[1].fortes[4]':
    `En el voto espontáneo de Meio/Ideia tiene 23%, el segundo mayor, detrás del 34,4% de Lula.`,

  'candidates[1].fracos[0]':
    `EL RECHAZO ES SU NÚMERO MÁS DURO: 54% dice que no votaría por él en Quaest, contra 41% que sí. Lula tiene 52% de rechazo y 45% de intención. Entre los dos primeros colocados, los únicos con rechazo divulgado en esta ronda, el de él es el más alto.`,

  'candidates[1].fracos[1]':
    `Pierde los OCHO escenarios de segunda vuelta de las dos rondas de hoy, y el mejor de ellos sigue siendo una derrota por 5pp, en Quaest, por 44% x 39%.`,

  'candidates[1].fracos[2]':
    `LA FÓRMULA DE UN SOLO PARTIDO tiene un precio institucional declarado: la prensa calcula que tendrá más de un minuto menos de tiempo de televisión que Lula en la campaña.`,

  'candidates[1].fracos[3]':
    `Siete partidos ya declararon neutralidad en la disputa presidencial, entre ellos ${G('Republicanos', 'republicanos')}, PP, Podemos y União Brasil, y fue esa secuencia de rechazos la que lo llevó a cerrar fórmula dentro de su propio PL.`,

  'candidates[1].fracos[4]':
    `Su serie de mercado desarma cualquier lectura de recuperación: en la serie disponible de 88 días, el máximo es 44,30%, del 08/May, y el mínimo es 22,00%, del 03/Jul.`,

  'candidates[1].fracos[5]':
    `El alza de 2pp en Quaest queda exactamente en el límite del margen de 2pp, así que en esa casa el movimiento no se separa del ruido con seguridad.`,

  'candidates[1].analise':
    `Su día es el de cerrar la cuenta que estaba abierta, y la cuenta cerró por el lado más estrecho. ANUNCIÓ CANDIDATO A VICE en el último día del plazo de las convenciones: Alfredo Gaspar, diputado federal del ${G('PL', 'pl')} por Alagoas, 52 años, natural de Maceió, ex procurador general y ex secretario de Seguridad Pública del estado, relator de la comisión de investigación del INSS. ES UNA FÓRMULA DE UN SOLO PARTIDO, y llegó a eso después de que ${G('Republicanos', 'republicanos')}, PP, Podemos y União Brasil declararan neutralidad, en un cuadro donde siete partidos ya salieron de la disputa presidencial. La lectura de la elección, tal como la describe la prensa, es de radicalización y de foco: Gaspar entró en la política por el grupo de los Calheiros, usó la comisión para desgastar al gobierno, ya llamó al ${G('STF', 'stf')} dictadura judicial, y la apuesta declarada es convertir el INSS y las investigaciones sobre el hijo del presidente en eje de campaña. El costo aparece en la misma página: con fórmula pura tendrá más de un minuto menos de tiempo de televisión que Lula, y líderes evangélicos preferían una mujer en el lugar. EN LAS URNAS SUBIÓ EN LAS DOS CASAS, y hay que ser exacto sobre el tamaño: 2pp en Quaest, de 28% a 30%, lo que queda en el límite del margen de 2pp y por lo tanto no se separa del ruido con seguridad; y 3pp en Ideia, de 32% a 35%, lo que pasa el margen de 2,5pp y es movimiento. LA DIFERENCIA CONTRA LULA QUEDÓ EN 9pp EN QUAEST Y 8pp EN IDEIA. Eso importa porque ${G('BTG/Nexus', 'nexus-btg')} del 03/Ago había medido 4pp, la más apretada del conjunto, y la pregunta abierta era si aquello era tendencia o casa. Con las dos de hoy, el cuadro de las nacionales desde el 29/Jul queda así: ${G('AtlasIntel', 'atlasintel')} 9,1pp, PoderData 6pp, Vox Brasil 9,3pp, Nexus 4pp, Quaest 9pp e Ideia 8pp. EL NIVEL de 4pp sigue siendo de una sola casa. LA DIRECCIÓN, esa sí tiene confirmación, porque Quaest apretó 3pp dentro de su propia serie. EL PRECIO NO ENTRA HOY: vale la lectura del 03/Ago, con él en 25,45% (vol USD 7,86M acumulado).`,

  'candidates[2].header':
    `Las dos encuestas nacionales de hoy lo miden entre 4% y 4,7%, y pierde las dos segundas vueltas por amplio margen: 45% x 35% en Quaest y 48% x 34,7% en Ideia. Declaró que, si es elegido, no cumplirá decisiones monocráticas del ${G('STF', 'stf')}. Precio del 03/Ago: ${G('Polymarket', 'polymarket')} 7,45% (vol USD 8,86M acumulado).`,

  'candidates[2].fortes[0]':
    `SUBIÓ en las dos casas dentro de su propia serie: de 3% a 4% en Quaest, contra la ronda del 15/Jul, y de 2% a 4,7% en Ideia, contra la del 08/Jul.`,

  'candidates[2].fortes[1]':
    `En Meio/Ideia queda por delante de Zema, con 4,7% contra 2,6%, y detrás solo de Caiado, que tiene 5,7%.`,

  'candidates[2].fortes[2]':
    `Sigue siendo el favorito del contrato de 3º lugar de la 1ª vuelta, que estaba en 60,50% en la lectura del 03/Ago, bien por delante de Caiado.`,

  'candidates[2].fortes[3]':
    `Tiene el mayor volumen acumulado entre los nombres con precio por encima de 1%, con USD 8,86M, por encima de los USD 7,92M de Lula.`,

  'candidates[2].fortes[4]':
    `El precio de 7,45% sigue muy por encima de las urnas, que hoy están entre 4% y 4,7%, lo que describe un mercado pagando por un escenario que la intención declarada todavía no muestra.`,

  'candidates[2].fracos[0]':
    `Pierde los dos escenarios de segunda vuelta de hoy por 10pp y por 13,3pp, y es el adversario al que Lula vence con más holgura en la ronda de Meio/Ideia.`,

  'candidates[2].fracos[1]':
    `Con las dos de hoy, seis encuestas nacionales seguidas lo miden entre 3% y 4,7%, después del 7,8% de ${G('AtlasIntel', 'atlasintel')} del 29/Jul. La lectura aislada alta sigue siendo la excepción del conjunto.`,

  'candidates[2].fracos[2]':
    `La distancia entre el precio de 7,45% y las urnas queda entre 2,75pp y 3,45pp, y es del lado del precio, no de las urnas.`,

  'candidates[2].fracos[3]':
    `Declaró este miércoles que, si es elegido, no cumplirá decisiones monocráticas del STF, que va a pactar con el Centrão y llamó parásitos a los parlamentarios, lo que tensiona su propio discurso antisistema.`,

  'candidates[2].fracos[4]':
    `El volumen acumulado alto con precio en caída a lo largo de julio describe una posición antigua abierta, no convicción actual.`,

  'candidates[2].analise':
    `Su caso sigue siendo la mayor distancia entre lo que el mercado paga y lo que las urnas miden, y las dos rondas de hoy estrecharon esa distancia por el lado de las urnas, no del precio. EN QUAEST va a 4%, contra 3% en la ronda del 15/Jul de la misma casa. EN MEIO/IDEIA va a 4,7%, contra 2% en la ronda del 08/Jul, y pasa por delante de Zema. Son alzas dentro de cada serie, y es la primera vez en este conjunto que las dos casas lo mueven hacia arriba en la misma ventana de campo. Aun así, LA SECUENCIA sigue siendo lo que más pesa: sumando las dos de hoy, seis encuestas nacionales consecutivas lo miden entre 3% y 4,7%, después del 7,8% que AtlasIntel midió el 29/Jul. Una lectura aislada alta contra seis consistentes en la franja baja es el patrón de caso atípico, y el panel lo registra así en vez de tratar la excepción como escenario. EN LAS SEGUNDAS VUELTAS es el peor colocado de las dos rondas: pierde contra Lula por 45% x 35% en Quaest y por 48% x 34,7% en Ideia. EN EL DISCURSO, hizo este miércoles la declaración más dura de su campaña hasta ahora: dijo que, si es elegido, no cumplirá decisiones monocráticas del ${G('STF', 'stf')}, que va a pactar con el Centrão y llamó parásitos a los parlamentarios. El panel registra la declaración y no estima efecto, porque no hay precio confirmado para medirlo. EL PRECIO Y EL VOLUMEN siguen siendo la anomalía de la pieza: en la lectura del 03/Ago estaba en 7,45% con USD 8,86M acumulados, más dinero negociado que Lula, que tiene USD 7,92M, con un precio que es un octavo. El volumen mide historia negociada, no convicción actual.`,

  'candidates[3].header':
    `Precios del 03/Ago: Caiado 1,15% (vol USD 5,30M), Zema 0,25% (vol USD 4,66M) y Haddad 0,15% (vol USD 6,64M), de la lectura de las 19:11 UTC. En las urnas de hoy, Caiado tiene 4% en Quaest y 5,7% en Ideia, Zema tiene 2% y 2,6%, y Haddad no es probado por ninguna de las dos.`,

  'candidates[3].subtitle':
    `05/Ago, a 60 días: el pelotón no se movió en las urnas y se volvió más estridente en el discurso. Ninguno de los tres pasa de 5,7% en ninguna de las dos encuestas nacionales del día, y Lula gana los seis escenarios de segunda vuelta en que aparecen. Zema es el único de los tres con fórmula cerrada, desde el 04/Ago, con el senador Eduardo Girão. Hoy fue el último día del plazo de las convenciones, y la fase siguiente es el registro de candidaturas.`,

  'candidates[3].caiado.label':
    `CAIADO (${G('PSD', 'psd')}), Poly presidencial 1,15% (vol USD 5,30M, precio del 03/Ago) | 3º lugar de la 1ª vuelta 25,00% en la lectura del 03/Ago | candidato oficializado en convención, con Kassab de vice | urnas de hoy: Quaest 4%, Meio/Ideia 5,7%`,

  'candidates[3].caiado.fortes':
    `Es el nombre más votado del pelotón en LAS DOS encuestas nacionales de hoy: 5,7% en Meio/Ideia, por delante de Renan Santos, y 4% en Quaest, empatado con él. En la segunda vuelta de Meio/Ideia tiene 40% contra 48,5% de Lula, la MENOR distancia entre los cuatro adversarios probados en esa ronda, y en la de Quaest tiene 37% contra 45%. Sigue siendo el segundo nombre del contrato de 3º lugar de la 1ª vuelta, que estaba en 25,00% en la lectura del 03/Ago. Ironizó sobre Lula y Flávio este miércoles, diciendo que los dos están más preocupados por salvar a la familia que al país, lo que es posicionamiento de tercera vía en estado puro.`,

  'candidates[3].caiado.fracos':
    `LA DISCREPANCIA ENTRE CASAS SOBRE ÉL SIGUE ABIERTA DENTRO DE LA MISMA VENTANA DE CAMPO: 4% en una casa y 5,7% en la otra, con las dos con campo del 31/Jul al 03/Ago, y en el mes entero el abanico va de 3,1% en AtlasIntel a 6% en Nexus. En el contrato de ganador estaba en 1,15% en la lectura del 03/Ago, y no hay lectura confirmada posterior. Pierde las dos segundas vueltas de hoy. En Quaest no se movió dentro de su propia casa, quedando en los mismos 4% del 15/Jul, y la promesa de amnistiar a Bolsonaro y a los condenados del 8 de Enero lo pone a disputar el mismo electorado de Flávio, que cerró fórmula hoy y subió en las dos casas.`,

  'candidates[3].haddad.label':
    `HADDAD (${G('PT', 'pt')}), Poly presidencial 0,15% (vol USD 6,64M, precio del 03/Ago) | 2º lugar de la 1ª vuelta 1,05% en la lectura del 03/Ago | NO probado por Quaest ni por Meio/Ideia, porque disputa el gobierno de São Paulo`,

  'candidates[3].haddad.fortes':
    `Su volumen acumulado, USD 6,64M, es mayor que el de varios nombres con precio por encima del suyo, lo que mantiene el contrato con lastre de negociación a pesar del nivel bajo.`,

  'candidates[3].haddad.fracos':
    `NINGUNA de las dos encuestas nacionales de hoy lo prueba, en ningún escenario, ni de 1ª vuelta ni de segunda. La ausencia de prueba en dos rondas el mismo día es información que el panel registra, en vez de repetir un dato antiguo como si fuera nuevo. La reserva permanece y hay que decirla con claridad: él NO es candidato a la Presidencia, disputa el gobierno de São Paulo, y cualquier escenario que lo incluya es hipótesis de encuesta y no candidatura en curso. En un precio de 0,15%, las variaciones tienen valor informativo casi nulo, y el volumen alto mide historia negociada, no convicción actual.`,

  'candidates[3].zema.label':
    `ZEMA (${G('Novo', 'novo')}), Poly presidencial 0,25% (vol USD 4,66M, precio del 03/Ago) | 3º lugar de la 1ª vuelta 4,60% en la lectura del 03/Ago | urnas de hoy: Quaest 2%, Meio/Ideia 2,6% | fórmula cerrada el 04/Ago con el senador Eduardo Girão`,

  'candidates[3].zema.fortes':
    `Es el ÚNICO de los tres con la fórmula resuelta, desde el 04/Ago, cuando anunció al senador Eduardo Girão, del Novo, y la resolvió dentro de su propio partido, sin depender de una alianza. En las urnas está estancado en las dos casas: 2% en Quaest, lo mismo que el 15/Jul, y 2,6% en Ideia, prácticamente el 2,5% del 08/Jul. En el libro de 3º lugar de la 1ª vuelta estaba en 4,60% en la lectura del 03/Ago, por delante de todo el pelotón excepto Caiado.`,

  'candidates[3].zema.fracos':
    `Es el adversario al que Lula vence con MÁS HOLGURA en la ronda de Quaest, por 46% x 34%, y pierde por 48,5% x 37% en Ideia. En las urnas no se mueve desde hace un mes en ninguna de las dos casas. En el contrato de ganador estaba en 0,25% en la lectura del 03/Ago. La reserva de serie es grande: su máximo es 10,10%, del 26/Abr, así que 0,25% es una fracción pequeña de ese nivel y las variaciones en esta franja tienen valor informativo casi nulo.`,

  'candidates[3].analise':
    `La tercera vía tuvo el día en que quedó claro que su espacio no es el que se mueve. EN LAS DOS ENCUESTAS NACIONALES DE HOY, con campo en la misma ventana, ninguno de los tres pasa de 5,7%: Caiado tiene 4% en Quaest y 5,7% en Meio/Ideia, Zema tiene 2% y 2,6%, y Haddad no es probado por ninguna de las dos. Sumando los escenarios, Lula gana las seis segundas vueltas en que aparecen los tres. Y LA DISCREPANCIA ENTRE CASAS SOBRE CAIADO SIGUE SIENDO EL DATO MÁS INTERESANTE DEL PELOTÓN: 4% en una casa y 5,7% en la otra, con las dos con campo del 31/Jul al 03/Ago, y en el mes el abanico va de 3,1% a 6%. Dos reglas midiendo la misma semana y llegando a números que difieren en 1,7pp es exactamente el tipo de cosa que este panel existe para registrar. EN EL TABLERO, hoy fue el último día del plazo de las convenciones, y la fase siguiente es el registro de candidaturas. Zema sigue siendo el único de los tres con fórmula cerrada, desde el 04/Ago, con Eduardo Girão. Caiado ironizó sobre Lula y Flávio diciendo que los dos están más preocupados por salvar a la familia que al país. Haddad sigue sin ser candidato, y ese contrato descuenta un escenario de sustitución en la fórmula del ${G('PT', 'pt')}. EL CRUCE QUE INTERESA: el espacio de la tercera vía ganó definición partidaria en los últimos dos días, con Zema cerrando fórmula y con Flávio cerrando la suya dentro de su propio partido, y el efecto de eso sobre el precio no puede medirse en esta ronda, porque no hay lectura de mercado confirmada el 04 y el 05/Ago.`,

  'candidates[3].fortes[0]':
    `CAIADO es el nombre más votado del pelotón en las dos encuestas nacionales de hoy, con 5,7% en Meio/Ideia y 4% en Quaest, y tiene la menor distancia hacia Lula entre los cuatro adversarios probados en Ideia, por 48,5% x 40%.`,

  'candidates[3].fortes[1]':
    `ZEMA es el único de los tres con fórmula cerrada, con el senador Eduardo Girão, resuelta dentro de su propio partido el 04/Ago.`,

  'candidates[3].fortes[2]':
    `En las urnas, Zema está estancado en las dos casas, con 2% en Quaest y 2,6% en Ideia, sin caer en ninguna de ellas.`,

  'candidates[3].fortes[3]':
    `Caiado sigue como segundo nombre del contrato de 3º lugar de la 1ª vuelta, que estaba en 25,00% en la lectura del 03/Ago.`,

  'candidates[3].fortes[4]':
    `El volumen acumulado de Haddad, USD 6,64M, mantiene lastre de negociación en el contrato a pesar del precio de 0,15%.`,

  'candidates[3].fracos[0]':
    `Ninguno de los tres pasa de 5,7% en ninguna de las dos encuestas nacionales de hoy, y Lula gana los seis escenarios de segunda vuelta en que aparecen.`,

  'candidates[3].fracos[1]':
    `La discrepancia entre casas sobre CAIADO sigue abierta dentro de la misma ventana de campo, con 4% en una casa y 5,7% en la otra, y un abanico mensual de 3,1% a 6%.`,

  'candidates[3].fracos[2]':
    `ZEMA es el adversario al que Lula vence con más holgura en Quaest, por 46% x 34%, y no se mueve en las urnas desde hace un mes en ninguna de las dos casas.`,

  'candidates[3].fracos[3]':
    `HADDAD no es probado por ninguna de las dos rondas de hoy, y sigue sin ser candidato a la Presidencia.`,

  'candidates[3].fracos[4]':
    `En la lectura del 03/Ago los tres sumados no llegaban a 1,60% en el mercado, contra 25,45% de Flávio, lo que describe un tercer espacio que el precio no trata como competitivo.`,

  'quadroComparativo[0].p':
    `DOS ENCUESTAS NACIONALES HOY. ${G('Genial/Quaest', 'quaest')} (n=2.004, BR-06591/2026): 39% en la ${G('1ª vuelta', 'primeiro-turno')} y 44% x 39% en la segunda. Meio/Ideia (n=1.500, BR-04579/2026): 43% y 48,5% x 43%. APROBACIÓN 48% x 47% en Quaest, IDÉNTICA a la de su propia ronda del 15/Jul. Gestión 36% positiva, 26% regular, 36% negativa, también idéntica. Rechazo 52%.`,

  'quadroComparativo[0].m': '65,50% (vol USD 7,92M acumulado), precio del 03/Ago',

  'quadroComparativo[0].t':
    `Sin lectura de mercado nueva el 04 y el 05/Ago. Vale la del 03/Ago, de las 19:11 UTC, con diferencia de +40,05pp. En la serie de 88 días, el máximo es 66,50% y la diferencia máxima +41,80pp, ambos del 01/Ago.`,

  'quadroComparativo[0].s':
    `60 días de la elección. Gana los OCHO escenarios de segunda vuelta de las dos rondas. Se reunió con Alcolumbre en la casa de Moraes tras la ruptura. Aliados admiten desgaste por las investigaciones sobre Lulinha.`,

  'quadroComparativo[1].p':
    `Quaest: 30% en la 1ª vuelta, contra 28% el 15/Jul de la misma casa, alza en el LÍMITE del margen de 2pp. Meio/Ideia: 35%, contra 32% el 08/Jul, alza de 3pp por encima del margen de 2,5pp. Segundas vueltas: 39% y 43%, pierde las dos. RECHAZO 54%, el más alto entre los dos primeros colocados.`,

  'quadroComparativo[1].m': '25,45% (vol USD 7,86M acumulado), precio del 03/Ago',

  'quadroComparativo[1].t':
    `Sin lectura de mercado nueva el 04 y el 05/Ago. La reserva de serie sigue valiendo: en la serie disponible de 88 días, su máximo es 44,30% el 08/May y su mínimo es 22,00% el 03/Jul.`,

  'quadroComparativo[1].s':
    `CERRÓ FÓRMULA en el último día del plazo: el vice es Alfredo Gaspar, del ${G('PL', 'pl')} de Alagoas, relator de la comisión de investigación del INSS. Fórmula de un solo partido, después de que ${G('Republicanos', 'republicanos')}, PP, Podemos y União Brasil quedaran neutros. Tendrá más de un minuto menos de televisión que Lula.`,

  'quadroComparativo[2].p':
    `Quaest: 4%, contra 3% el 15/Jul de la misma casa. Meio/Ideia: 4,7%, contra 2% el 08/Jul. Con las dos, SEIS encuestas nacionales seguidas lo miden entre 3% y 4,7%. Pierde las segundas vueltas por 45% x 35% y 48% x 34,7%.`,

  'quadroComparativo[2].m': '7,45% (vol USD 8,86M acumulado), precio del 03/Ago',

  'quadroComparativo[2].t':
    `Sin lectura de mercado nueva el 04 y el 05/Ago. La distancia entre el precio de 7,45% y las urnas de hoy queda entre 2,75pp y 3,45pp, y es del lado del precio.`,

  'quadroComparativo[2].s':
    `Declaró que, si es elegido, NO cumplirá decisiones monocráticas del ${G('STF', 'stf')}, que va a pactar con el Centrão y llamó parásitos a los parlamentarios. Mayor volumen acumulado entre los nombres por encima de 1%, superior al de Lula.`,

  'quadroComparativo[3].p':
    `Quaest: 4% en la 1ª vuelta, lo mismo que el 15/Jul de la misma casa. Meio/Ideia: 5,7%, contra 4% el 08/Jul. En las segundas vueltas, 37% contra 45% y 40% contra 48,5%, esta la menor distancia entre los cuatro adversarios probados en Ideia.`,

  'quadroComparativo[3].m': '1,15% (vol USD 5,30M acumulado), precio del 03/Ago',

  'quadroComparativo[3].t':
    `Sin lectura de mercado nueva el 04 y el 05/Ago. Era el segundo nombre del contrato de 3º lugar de la 1ª vuelta, con 25,00% en la lectura del 03/Ago.`,

  'quadroComparativo[3].s':
    `Ironizó sobre Lula y Flávio diciendo que los dos están más preocupados por salvar a la familia que al país. La discrepancia entre casas sobre él sigue abierta en la misma ventana: 4% en una casa y 5,7% en la otra.`,

  'quadroComparativo[4].p':
    `Quaest: 2% en la 1ª vuelta, lo mismo que el 15/Jul de la misma casa. Meio/Ideia: 2,6%, prácticamente el 2,5% del 08/Jul. En las segundas vueltas, 34% contra 46% y 37% contra 48,5%, y es el adversario al que Lula vence con más holgura en Quaest.`,

  'quadroComparativo[4].m': '0,25% (vol USD 4,66M acumulado), precio del 03/Ago',

  'quadroComparativo[4].t':
    `Sin lectura de mercado nueva el 04 y el 05/Ago. La reserva de serie es grande: su máximo es 10,10% el 26/Abr, así que las variaciones en esta franja tienen valor informativo casi nulo.`,

  'quadroComparativo[4].s':
    `Es el ÚNICO nombre de la tercera vía con fórmula cerrada, desde el 04/Ago, con el senador Eduardo Girão, del ${G('Novo', 'novo')}, resuelta dentro de su propio partido.`,

  'quadroComparativo[5].p':
    `Sin encuesta. Mercado de destitución de un ministro del ${G('STF', 'stf')} antes de 2027.`,

  'quadroComparativo[5].m': '3,10% (vol USD 83 mil), precio del 03/Ago',

  'quadroComparativo[5].t':
    `Sin lectura de mercado nueva el 04 y el 05/Ago. Es el contrato más delgado entre los que el panel publica.`,

  'quadroComparativo[5].s':
    `Mendonça NEGÓ un pedido de la ${G('Policía Federal', 'pf')} en la operación que involucra a Cláudio Castro. El candidato a vice anunciado hoy en la fórmula de Flávio ya llamó al STF dictadura judicial. Renan Santos dijo que no cumplirá decisiones monocráticas del tribunal.`,

  cruzamento:
    `ESTA RONDA PUBLICA LA MITAD DEL CRUCE, Y DICE CUÁL MITAD. El lado de la ENCUESTA es de hoy y vino doble. El lado del MERCADO es del 03/Ago, de la lectura de las 19:11 UTC, y cada precio está marcado con la fecha. --- DOS ENCUESTAS NACIONALES EL MISMO DÍA, EN LA MISMA VENTANA, DEL 31/Jul AL 03/Ago. ${G('Genial/Quaest', 'quaest')} (n=2.004, presencial en 120 municipios, margen 2pp, contratante Banco Genial, BR-06591/2026) da una ${G('1ª vuelta', 'primeiro-turno')} de 39% x 30%, diferencia de 9pp, y una ${G('segunda vuelta', 'segundo-turno')} de 44% x 39%. Meio/Ideia (n=1.500, telefónica, margen 2,5pp, BR-04579/2026) da 43% x 35%, diferencia de 8pp, y segunda vuelta de 48,5% x 43%. Lula gana los OCHO escenarios de segunda vuelta de las dos sumadas. --- LA PREGUNTA QUE ESTABA ABIERTA QUEDÓ RESPONDIDA, Y LA RESPUESTA TIENE DOS PARTES. ${G('BTG/Nexus', 'nexus-btg')} del 03/Ago midió una diferencia de 4pp en la 1ª vuelta, la más apretada del conjunto, y la duda era si aquello era tendencia o efecto de casa. Con las dos de hoy, el cuadro de las nacionales desde el 29/Jul queda así: ${G('AtlasIntel', 'atlasintel')} 9,1pp, PoderData 6pp, Vox Brasil 9,3pp, Nexus 4pp, Quaest 9pp e Ideia 8pp. El NIVEL de 4pp sigue siendo de una sola casa. LA DIRECCIÓN tiene confirmación, porque Quaest apretó 3pp dentro de su propia serie, de 12pp a 9pp en la 1ª vuelta y de 8pp a 5pp en la segunda. --- Y LAS DOS CASAS APRETARON POR MOTIVOS DISTINTOS, que es el hallazgo más fino del día. En Quaest hubo traspaso: Lula cedió 1pp y Flávio subió 2pp. En Ideia hubo concentración: la diferencia quedó igual, de 8,4pp a 8pp, y subieron LOS DOS, Lula de 40,4% a 43% y Flávio de 32% a 35%. Una casa describe voto cambiando de lado y la otra describe voto saliendo del pelotón hacia los dos primeros. El panel registra las dos sin elegir cuál está en lo correcto. --- LA APROBACIÓN REPITIÓ EL NÚMERO EXACTO DE TRES SEMANAS ANTES. En Quaest, 48% aprueba y 47% desaprueba, los MISMOS 48% x 47% del 15/Jul, y la evaluación de la gestión repite el reparto idéntico de 36% positiva, 26% regular y 36% negativa. BTG/Nexus da la imagen espejo, 47% x 48%, y está en 47% desde hace tres rondas. Dos casas discrepan en el SIGNO del saldo, ambas dentro del margen, y ninguna registra movimiento. La convergencia sobre la inmovilidad no es lo mismo que confianza en el nivel, y el panel no trata las dos cosas como una. PoderData/Aya del 30/Jul sigue más dura, en 43% x 49%. --- EL TABLERO CERRÓ HOY, PORQUE HOY ERA EL PLAZO. Flávio anunció candidato a vice en el último día de las convenciones: Alfredo Gaspar, diputado del ${G('PL', 'pl')} por Alagoas, relator de la comisión de investigación del INSS, ex procurador general y ex secretario de Seguridad del estado. Es una fórmula de un solo partido, y llegó a eso después de que ${G('Republicanos', 'republicanos')}, PP, Podemos y União Brasil declararan neutralidad, en un cuadro de siete partidos fuera de la disputa presidencial. El costo viene junto: con fórmula pura tendrá más de un minuto menos de tiempo de televisión que Lula. Zema sigue como el único nombre de la tercera vía con fórmula cerrada, desde el 04/Ago, con Eduardo Girão. La fase siguiente es el registro de candidaturas. --- EN EL EJE JUDICIAL, el poder judicial entró en la campaña por la boca de los candidatos y no por una decisión nueva. Mendonça NEGÓ un pedido de la ${G('Policía Federal', 'pf')} en la operación que involucra a Cláudio Castro, dentro del expediente del caso Master. El candidato a vice anunciado hoy ya llamó al ${G('STF', 'stf')} dictadura judicial. Renan Santos declaró que, si es elegido, no cumplirá decisiones monocráticas del tribunal y que va a pactar con el Centrão. Del lado del gobierno, Lula y Alcolumbre se reencontraron en la casa de Moraes, con ministros del STF articulando el acercamiento. Sin un precio confirmado, no hay forma de decir si el mercado descontó alguna de esas cosas, y el panel lo dice en vez de estimar.`,
})
