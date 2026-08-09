/**
 * Mapa ES de 09/Ago para polls-data.json.
 * Convenções: vírgula decimal e ponto de milhar, iguais ao pt-BR.
 * "parado" em ES é desempregado, então o termo de mercado é "estancado".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`

construir('polls-data', 'es', {
  'polymarketComparison.note':
    `LOS PRECIOS DE ESTA SECCIÓN SON DE LA LECTURA DEL 9/Ago, DE LAS 17:34 UTC. AFOS solo publica un precio que dos lecturas independientes confirmen, tomadas con ocho minutos de intervalo. LA BRECHA VOLVIÓ A ESTRECHARSE, Y POR UN SOLO LADO: quedó en +36,55pp, contra +37,55pp de ayer, porque Lula cayó 1,00pp, a 63,50%, rompiendo por abajo la meseta de cinco días que duraba desde el 4/Ago, mientras Flávio quedó estancado en 26,95% por tercer día. Cuando la brecha se estrecha por los dos extremos hay transferencia entre los dos nombres; cuando se estrecha solo porque el líder cede, lo que existe es pérdida de precio en el favorito. Desde el 1/Ago la brecha cayó en SIETE de los ocho días, con un único día quieto, bajando desde +41,80pp. EN LAS ENCUESTAS NO HAY MEDICIÓN NUEVA DESDE HACE CUATRO DÍAS: las últimas nacionales son ${G('Genial/Quaest', 'quaest')} y Meio/Ideia, ambas del 5/Ago, y la cobertura de hoy trae recortes de esa misma ronda, no una encuesta nueva. Hay TRES nacionales previstas para el 10/Ago, entre ellas Palver con n=5.000, más dos el 11/Ago y una el 13/Ago. EN EL LIBRO DE TERCER LUGAR el movimiento del día contradice el de ayer: Renan Santos saltó 6,00pp, a 64,50%, y Caiado cayó 5,50pp, a 25,50%, en espejo casi exacto, cuando ayer Caiado cayó sin que Renan subiera.`,

  'polymarketComparison.candidates[0].polymarket': `63,50%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días, desde el 5/Ago. Siguen valiendo las dos de aquel día: ${G('Genial/Quaest', 'quaest')} (n=2.004, campo del 31/Jul al 3/Ago, presencial, margen 2pp, BR-06591/2026) con 39% en la ${G('primera vuelta', 'primeiro-turno')} y 44% x 39% en la segunda vuelta contra Flávio, ganando también a Zema por 46% x 34%, a Caiado por 45% x 37% y a Renan Santos por 45% x 35%; y Meio/Ideia (n=1.500, telefónica, margen 2,5pp, BR-04579/2026) con 43% y 48,5% x 43%. La cobertura de hoy trae recortes de esa misma ronda, no medición nueva. APROBACIÓN sigue en 48% contra 47%. EN EL TABLERO, declaró su patrimonio ante el ${G('TSE', 'tse')}, cerca de R$ 4,7 millones, 35% menos que en 2022, con Alckmin informando R$ 3,3 millones, y un relevamiento cuenta 26 plataformas estatales para él contra 16 del adversario.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 63,50% (vol USD 8,18M acumulado). CAYÓ 1,00pp y rompió por abajo la meseta de cinco días que duraba desde el 4/Ago, en la primera variación de su precio en cinco ruedas. La brecha sobre Flávio quedó en +36,55pp, y se estrechó SOLO por este lado, porque el adversario no se movió. En la serie de 89 días, del 11/May al 9/Ago, su techo es 66,50%, del 1/Ago, y 13 de los 89 días tuvieron un valor igual o mayor que el actual.`,

  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 30% en la ${G('primera vuelta', 'primeiro-turno')} de ${G('Genial/Quaest', 'quaest')}, contra 28% en la ronda del 15/Jul de la misma casa, y el 35% de Meio/Ideia, contra 32% en su propia ronda del 8/Jul, con segundas vueltas de 39% y 43%. La brecha contra Lula queda en 9pp en Quaest y 8pp en Ideia. Un recorte publicado el 9/Ago lo muestra ampliando ventaja entre votantes con educación secundaria y superior, y es una lectura de la ronda del 5/Ago, no una encuesta nueva. RECHAZO sigue en 54%, contra 52% de Lula. EN EL TABLERO, su compañero de fórmula sigue en la lista de enmiendas Pix que Dino ordenó investigar a la ${G('PF', 'pf')}.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 26,95% (vol USD 8,09M acumulado). TERCER día estancado en el mismo valor, tras seis días de alza que terminaron el 6/Ago. Ganó terreno relativo sin moverse: la brecha se estrechó porque el líder cedió 1,00pp, y no porque él subiera. No es un extremo: 30 de los 89 días de la serie tuvieron un valor igual o mayor, con techo de 43,30% el 12/May y piso de 22,00% el 3/Jul. EN EL CONTRATO DE SEGUNDO LUGAR la caída SE DETUVO en 81,50%, tras perder 6,00pp entre el 6 y el 8/Ago.`,

  'polymarketComparison.candidates[2].polymarket': `7,80%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 4% de ${G('Genial/Quaest', 'quaest')}, contra 3% en su propia ronda del 15/Jul, y el 4,7% de Meio/Ideia, contra 2% en su propia ronda del 8/Jul. En las segundas vueltas es el peor colocado de las dos rondas: pierde con Lula por 45% x 35% en Quaest y por 48% x 34,7% en Ideia. Con eso, seis nacionales seguidas lo miden entre 3% y 4,7%, tras el 7,8% de AtlasIntel del 29/Jul, y la lectura aislada alta sigue siendo la excepción del conjunto. Declaró R$ 795 mil en bienes ante el ${G('TSE', 'tse')}, con su compañero de fórmula informando R$ 1,6 millones.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 7,80% (vol USD 9,27M acumulado). Subió 0,15pp, tercer día seguido de alza, y con las encuestas estancadas entre 4% y 4,7% la distancia hacia la intención declarada volvió a crecer, yendo de 3,10pp a 3,80pp, siempre del lado del precio. SU MOVIMIENTO DE HOY ESTÁ EN EL LIBRO DE TERCER LUGAR: saltó 6,00pp, de 58,50% a 64,50%, mientras Caiado cayó 5,50pp, en espejo casi exacto, cuando AYER Caiado cayó sin que él subiera. En el contrato de segundo lugar abrió distancia sobre Lula, con 8,25% contra 6,75%. En la serie de 89 días el máximo es 17,90% y el mínimo 5,50%, y 77 de los 89 días tuvieron un valor igual o mayor que el de hoy.`,

  'polymarketComparison.candidates[3].polymarket': `1,25%`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 4% de ${G('Genial/Quaest', 'quaest')}, lo mismo que su propia ronda del 15/Jul, y el 5,7% de Meio/Ideia, contra 4% en su propia ronda del 8/Jul. En las segundas vueltas pierde con Lula por 45% x 37% en Quaest y por 48,5% x 40% en Ideia. La divergencia entre institutos sobre él sigue abierta dentro del mismo campo: 4% en una casa y 5,7% en la otra, con las dos relevando del 31/Jul al 3/Ago.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 1,25% (vol USD 5,60M acumulado). CAYÓ por TERCER día seguido en los dos libros: 0,10pp en el presidencial y 5,50pp en el de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')}, de 31,00% a 25,50%. En tres días son 10,00pp perdidos en ese contrato, desde el 33,50% del 6/Ago. LA DIFERENCIA CON AYER ES EL MECANISMO: hoy Renan Santos subió 6,00pp contra los 5,50pp que él perdió, o sea, la probabilidad migró entre los dos; ayer Renan quedó quieto y ella salió del libro.`,

  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Ni ${G('Genial/Quaest', 'quaest')} ni Meio/Ideia lo prueban en ningún escenario presidencial, de ${G('primera vuelta', 'primeiro-turno')} o de segunda vuelta, y no hay encuesta nacional nueva desde el 5/Ago. La ausencia de prueba es información que el panel registra, en vez de repetir un dato viejo como si fuera nuevo. Él disputa la REELECCIÓN en el gobierno de São Paulo, oficializada por Republicanos el 1/Ago.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 0,05% (vol USD 13,87M acumulado). Sin variación contra el 8/Ago. El nivel es lo bastante bajo como para que las variaciones en esta franja tengan un valor informativo casi nulo.`,

  'polymarketComparison.candidates[5].polymarket': `0,45%`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 2% de ${G('Genial/Quaest', 'quaest')}, lo mismo que su propia ronda del 15/Jul, y el 2,6% de Meio/Ideia, prácticamente el 2,5% de la del 8/Jul. En las segundas vueltas es el adversario al que Lula gana con más holgura en Quaest, por 46% x 34%, y pierde por 48,5% x 37% en Ideia. Registró su candidatura ante el ${G('TSE', 'tse')} el 6/Ago, declarando R$ 178,7 millones de patrimonio, con su compañero de fórmula Girão informando R$ 34,1 millones, y sigue siendo el único del pelotón con registro presentado, en un plazo que va hasta el 15/Ago.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 0,45% (vol USD 5,02M acumulado). CAYÓ 0,10pp y volvió a quedar POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido, tras haber pasado por encima de él un único día. En el contrato de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} quedó en 3,35%. Salvedad de serie que sigue valiendo: su máximo fue 10,10%, el 26/Abr.`,

  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Ni ${G('Genial/Quaest', 'quaest')} ni Meio/Ideia lo prueban en ningún escenario, ni de ${G('primera vuelta', 'primeiro-turno')} ni de segunda vuelta, y no hay encuesta nacional nueva desde el 5/Ago, así que sigue sin medición. La salvedad permanece y hay que decirla con claridad: él NO es candidato a la Presidencia, disputa el gobierno de São Paulo, y cualquier escenario que lo incluya es una hipótesis de encuesta, no una candidatura en curso.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `[lectura del 9/Ago, 17:34 UTC] En 0,05% (vol USD 6,78M acumulado). Sin variación contra el 8/Ago, en el piso que el mercado descuenta. La variación en esta franja no tiene valor informativo.`,
})
