/**
 * ERRATA ES de 07/Ago. Três defeitos publicados no painel e corrigidos:
 *  1. Zema registrou candidatura em 06/Ago, não em 07/Ago.
 *  2. Ele NÃO foi o primeiro presidenciável registrado no TSE: foi Renan Santos.
 *  3. candidates[3].fortes e .fracos tinham sumido do arquivo. Repostos.
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 7/Ago 19:44 UTC, a 58 días de la ${G('primera vuelta', 'primeiro-turno')}. EL PRECIO ES DEL DÍA: Lula 64,50%, Flávio 26,95%, brecha de +37,55pp. La brecha se redujo por SEXTO día consecutivo, desde el máximo de +41,80pp del 1/Ago, y los dos extremos lo hicieron solos, porque no hay encuesta nacional nueva: las últimas siguen siendo ${G('Genial/Quaest', 'quaest')} y Meio/Ideia, ambas del 5/Ago. El tablero entró en la fase de REGISTRO, que va hasta el 15/Ago, y Zema registró su candidatura el 6/Ago, declarando R$ 178,7 millones de patrimonio. Cinco encuestas nacionales están registradas en el ${G('TSE', 'tse')} para el 10 y el 11/Ago.`,

  'candidates[3].subtitle':
    `7/Ago, a 58 días: el pelotón está en la fase de REGISTRO, que va hasta el 15/Ago, y Zema registró su candidatura el 6/Ago, declarando R$ 178,7 millones de patrimonio. Este viernes volvió a atacar al ${G('STF', 'stf')}, llamando al Poder Judicial un poder incendiario, y un diputado de su propio campo pasó a intentar convencerlo de cambiar la carrera presidencial por el Senado. El primer presidenciable registrado en el TSE fue Renan Santos.`,

  'candidates[3].zema.label':
    `ZEMA (${G('Novo', 'novo')}), Poly presidencial 0,45% (vol USD 4,83M, lectura del 7/Ago 19:44 UTC) | tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} 3,70% | encuestas vigentes: Quaest 2%, Meio/Ideia 2,6% | fórmula con el senador Eduardo Girão | registró su candidatura en el TSE el 6/Ago`,

  'candidates[3].zema.fortes':
    `REGISTRÓ SU CANDIDATURA EN EL TSE EL 6/Ago, declarando R$ 178,7 millones de patrimonio (Diário do Grande ABC y A Crítica, 6/Ago), en un plazo que solo se cierra el 15/Ago. Fue el segundo entrevistado de la serie de g1 y GloboNews con presidenciables, el 6/Ago, y ocupó espacio editorial grande en dos días seguidos. En las encuestas está estable en las dos casas, con 2% en Quaest, lo mismo que el 15/Jul, y 2,6% en Ideia, prácticamente el 2,5% del 8/Jul. En el libro de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} está en 3,70%, por delante de todo el pelotón excepto Caiado.`,

  'candidates[3].analise':
    `El pelotón tuvo el día más movido del tablero y el más quieto del precio, y las dos cosas juntas dicen algo. EL TABLERO ESTÁ EN LA FASE DE REGISTRO, que va hasta el 15/Ago, y ZEMA REGISTRÓ SU CANDIDATURA EL 6/Ago, declarando R$ 178,7 millones de patrimonio. El primer presidenciable registrado en el TSE fue Renan Santos, no él. Ese mismo 6/Ago Zema dio una entrevista a g1 y GloboNews defendiendo privatizarlo todo empezando por Petrobras y represalias contra Estados Unidos por el alza arancelaria, y este viernes volvió a atacar al Poder Judicial, llamándolo poder incendiario. También este viernes apareció la noticia de que Nikolas Ferreira intenta convencerlo de abandonar la presidencial y disputar el Senado. Registrar candidatura el jueves y ser presionado a dejarla el viernes es el retrato del espacio que ocupa. EN EL PRECIO, EL MOVIMIENTO FUE TODO DE CAIADO, Y HACIA ABAJO: presidencial de 1,85% a 1,55%, y tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} de 35,50% a 33,50%. Esa caída de 2,00pp en el libro de tercer lugar es el espejo exacto de la subida de 2,50pp de Renan Santos en el mismo contrato, lo que describe transferencia de probabilidad entre los dos nombres y no movimiento del pelotón como bloque. Zema quedó estancado en 0,45% y Haddad en 0,15%. EN LAS ENCUESTAS NADA CAMBIÓ, porque no hay encuesta nacional nueva: Caiado sigue con 4% en Quaest y 5,7% en Meio/Ideia, Zema con 2% y 2,6%, y Haddad no es probado por ninguna de las dos. La divergencia entre institutos sobre Caiado sigue siendo el dato más interesante del pelotón, con 4% en una casa y 5,7% en la otra recogiendo en la misma ventana, y abanico mensual de 3,1% a 6%. EL CRUCE QUE INTERESA: los tres sumados valen 2,15% en el contrato de ganador, contra 26,95% del segundo, y esa proporción no se movió con la convención cerrada, con la fórmula definida ni con el registro presentado. El tablero anduvo y el precio del tercer espacio no.`,

  'candidates[3].fortes[0]':
    `CAIADO es el nombre más votado del pelotón en las dos nacionales vigentes, con 5,7% en Meio/Ideia y 4% en Quaest, y tiene la menor distancia a Lula entre los cuatro rivales probados en Ideia, por 48,5% x 40%.`,
  'candidates[3].fortes[1]':
    `ZEMA registró su candidatura en el TSE el 6/Ago, declarando R$ 178,7 millones de patrimonio, en un plazo que va hasta el 15/Ago.`,
  'candidates[3].fortes[2]':
    `En las encuestas, Zema está estable en las dos casas, con 2% en Quaest y 2,6% en Ideia, sin caer en ninguna.`,
  'candidates[3].fortes[3]':
    `Caiado sigue como segundo nombre del contrato de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')}, con 33,50%.`,
  'candidates[3].fortes[4]':
    `El volumen acumulado de Haddad, USD 6,77M, mantiene lastre de negociación en el contrato pese al precio de 0,15%.`,

  'candidates[3].fracos[0]':
    `Ninguno de los tres pasa de 5,7% en ninguna de las dos nacionales vigentes, y Lula gana los seis escenarios de balotaje en los que aparecen.`,
  'candidates[3].fracos[1]':
    `CAIADO cayó en los dos libros hoy, 0,30pp en el presidencial y 2,00pp en el de tercer lugar, de 35,50% a 33,50%, reflejando exactamente la subida de Renan Santos.`,
  'candidates[3].fracos[2]':
    `ZEMA es el rival al que Lula gana con más holgura en Quaest, por 46% x 34%, y no se mueve en las encuestas hace un mes en ninguna de las dos casas.`,
  'candidates[3].fracos[3]':
    `HADDAD no es probado por ninguna de las dos rondas vigentes, y sigue sin ser candidato a la Presidencia.`,
  'candidates[3].fracos[4]':
    `En la lectura del 7/Ago los tres sumados valían 2,15% en el mercado, contra 26,95% de Flávio, lo que describe un tercer espacio que el precio no trata como competitivo.`,

  'quadroComparativo[4].s':
    `Registró su candidatura en el TSE el 6/Ago, declarando R$ 178,7 millones de patrimonio. El primer presidenciable registrado en el TSE fue Renan Santos. Este viernes llamó al Poder Judicial un poder incendiario, y Nikolas Ferreira intenta convencerlo de cambiar la carrera presidencial por el Senado.`,

  cruzamento:
    `HOY EL CRUCE SALE ENTERO, Y LOS DOS LADOS DICEN COSAS DISTINTAS. El lado del MERCADO es de la lectura del 7/Ago a las 19:44 UTC. El lado de las ENCUESTAS es del 5/Ago, porque no salió nacional nueva, y está marcado como tal en cada línea. --- LA BRECHA SE REDUJO POR SEXTO DÍA CONSECUTIVO, Y LA CAUSA ESTÁ EN UN SOLO EXTREMO. La secuencia desde el máximo es 41,80pp el 1/Ago, 40,90pp, 38,90pp, 38,60pp, 38,50pp, 37,90pp y 37,55pp hoy. En esos seis días el precio de Flávio salió de 24,70% y llegó a 26,95%, y el de Lula está estancado en 64,50% desde el 4/Ago. Es decir, el estrechamiento entero del tramo final es subida del segundo, no caída del primero, y eso es distinto de lo que ocurrió en la primera mitad del movimiento, cuando Lula cayó de 66,50% a 64,50%. --- Y EL MISMO CANDIDATO ANDUVO HACIA ATRÁS EN EL OTRO LIBRO. Mientras el contrato de ganador subía 0,10pp para él, el contrato de segundo lugar de la ${G('primera vuelta', 'primeiro-turno')} cayó 4,50pp, de 87,50% a 83,00%. No hay contradicción aritmética, porque ganar posibilidad de vencer quita posibilidad de quedar segundo, pero 4,50pp es el mayor movimiento del panel desde la lectura del 6/Ago y merece decirse con el tamaño que tiene. --- EL TERCER LUGAR CAMBIÓ DE MANOS OTRA VEZ, Y EN ESPEJO. Renan Santos subió 2,50pp, de 56,00% a 58,50%, y Caiado cayó 2,00pp, de 35,50% a 33,50%. El 6/Ago el movimiento había sido el inverso, con Caiado subiendo 10,50pp y Renan Santos cayendo cuatro escalones. Dos días seguidos de transferencia entre los mismos dos nombres, en direcciones opuestas, describen un libro disputado, y el panel registra los dos lados del movimiento en vez de contar solo el de hoy. --- LAS ENCUESTAS NO ENTRAN HOY PORQUE NO HUBO ENCUESTAS. Siguen vigentes ${G('Genial/Quaest', 'quaest')} y Meio/Ideia, ambas del 5/Ago, con brechas de 9pp y 8pp en la primera vuelta. Lo que llegó nuevo fueron los CRUCES de Quaest, divulgados el 6 y el 7/Ago, y dibujan la geografía del voto: Lula lidera entre los mayores, los católicos y quienes no tienen religión, y abre más de 16 puntos entre las mujeres; Flávio gana entre los evangélicos. La misma ronda midió que el apoyo declarado de Trump a Flávio NO amplía la intención de voto para él. --- LA PRÓXIMA PRUEBA TIENE FECHA. Cinco encuestas nacionales están registradas en el ${G('TSE', 'tse')} para divulgación el 10 y el 11/Ago: Gerp con n=2.400, ${G('BTG/Nexus', 'nexus-btg')} con n=2.000 y Palver con n=5.000 el día 10, y MDA con n=2.002 y 100 Cidades con n=2.000 el día 11. Cuatro de ellas seguían en campo este viernes. Es la mayor concentración de nacionales desde el comienzo del ciclo, y es la que va a decir si el estrechamiento del precio tiene correspondencia en las encuestas. --- EL TABLERO ESTÁ EN LA FASE DE REGISTRO, que va hasta el 15/Ago. Zema registró su candidatura el 6/Ago, declarando R$ 178,7 millones de patrimonio, y el primer presidenciable registrado en el TSE fue Renan Santos. Este viernes, un diputado de su propio campo pasó a intentar convencerlo de cambiar la carrera presidencial por el Senado. --- EN EL EJE JUDICIAL, EL DÍA FUE PESADO PARA LOS DOS PRIMEROS. Contra Flávio: la defensa del compañero de fórmula pidió a la PGR y al ${G('STF', 'stf')} un examen de ADN en un plazo de 72 horas para descartar una acusación de violación, el ${G('PL', 'pl')} dejó una rendija para que el compañero de fórmula vuelva a disputar el Senado, O Globo reveló que la elección fue de última hora y sin llamada del propio candidato, y Dino ordenó a la ${G('PF', 'pf')} investigar enmiendas Pix con una transferencia del compañero de fórmula en la lista. Contra Lula: Estadão reconstruyó el día en que la PF sospechó de los negocios de Fábio Luís, la PF va a citar a un exjefe de gabinete del presidente para declarar sobre transferencias de un lobista, y la campaña rival evalúa llevar el caso al estreno del espacio electoral gratuito. Sumando los dos precios, el mercado movió 0,10pp en un día en que los dos lados recibieron golpes. El panel registra los hechos y el tamaño del movimiento, y no afirma que uno explique al otro.`,
})

construir('analysis-data', 'es', {
  'cards.sentimento.terceiraVia':
    `EL ESPACIO ESTÁ EN LA FASE DE REGISTRO Y ZEMA REGISTRÓ SU CANDIDATURA EL 6/Ago, declarando R$ 178,7 millones de patrimonio (Diário do Grande ABC y A Crítica, 6/Ago), en un plazo que solo cierra el 15/Ago. El primer presidenciable registrado en el ${G('TSE', 'tse')} fue Renan Santos. Ese mismo 6/Ago Zema dio una entrevista a g1 y GloboNews defendiendo privatizarlo todo empezando por Petrobras, y este viernes llamó al Poder Judicial un poder incendiario. También este viernes apareció la noticia de que Nikolas Ferreira intenta convencerlo de abandonar la carrera presidencial y disputar el Senado. En las encuestas nada se movió: Caiado sigue con 4% en Quaest y 5,7% en Ideia, Renan Santos con 4% y 4,7%, Zema con 2% y 2,6%.`,
})

construir('polls-data', 'es', {
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA. Siguen vigentes los 2% de ${G('Genial/Quaest', 'quaest')}, lo mismo que en su propia ronda del 15/Jul, y los 2,6% de Meio/Ideia, contra 2,5% en su propia ronda del 8/Jul. En los balotajes es el rival al que Lula gana con más holgura en Quaest, por 46% x 34%, y pierde por 48,5% x 37% en Ideia. REGISTRÓ SU CANDIDATURA EN EL ${G('TSE', 'tse')} EL 6/Ago, declarando R$ 178,7 millones de patrimonio, en un plazo que va hasta el 15/Ago. El primer presidenciable registrado en el TSE fue Renan Santos. Este viernes, Nikolas Ferreira pasó a intentar convencerlo de cambiar la carrera presidencial por el Senado.`,
})
