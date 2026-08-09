/**
 * Mapa ES de 09/Ago para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const PV = G('primera vuelta', 'primeiro-turno')
const TSE = G('TSE', 'tse')
const STF = G('STF', 'stf')
const PF = G('PF', 'pf')
const PT = G('PT', 'pt')
const QUAEST = G('Genial/Quaest', 'quaest')

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 9/Ago 17:34 UTC, a 56 días de la ${PV}. Cruce de Polymarket (lectura confirmada por dos lecturas), ${TSE} (${QUAEST} del 5/Ago y Meio/Ideia del 5/Ago, las últimas nacionales) y la prensa del día.`,

  // ─────────────────────────── LULA ───────────────────────────
  'candidates[0].header':
    `ROMPIÓ LA MESETA DE CINCO DÍAS: Polymarket 63,50% (vol USD 8,18M acumulado), de la lectura del 9/Ago de las 17:34 UTC, contra 64,50% de ayer. Es la primera variación de su precio desde el 4/Ago, y la brecha sobre Flávio cayó a +36,55pp. DECLARÓ SU PATRIMONIO ante el ${TSE}, cerca de R$ 4,7 millones, 35% menos que en 2022. En las encuestas siguen valiendo el 39% de la ${PV} de ${QUAEST} y el 43% de Meio/Ideia.`,
  'candidates[0].fortes[1]':
    `Es la ÚNICA fórmula presidencial con más de un partido. La coalición Brasil Pronto Pra Mais reúne siete: PDT, PSB, la federación ${PT}, PCdoB y PV, y la federación PSOL y Rede.`,
  'candidates[0].fortes[2]':
    `Consolidó 26 plataformas estatales, contra 16 articuladas por su adversario, según un relevamiento publicado el 9/Ago.`,
  'candidates[0].fortes[4]':
    `Incluso tras la caída de hoy, 63,50% queda por encima de la mediana de su propia serie: en 89 días medidos, 13 tuvieron un valor igual o mayor.`,
  'candidates[0].fracos[0]':
    `PERDIÓ 1,00pp EN EL DÍA, de 64,50% a 63,50%, y rompió por abajo la meseta que duraba desde el 4/Ago. La brecha sobre Flávio se estrechó SOLO por ese lado, porque el adversario no se movió.`,
  'candidates[0].fracos[1]':
    `La brecha cayó en SIETE de los ocho días desde el 1/Ago, con un único día quieto. Salió de +41,80pp en el techo de la serie y está en +36,55pp.`,
  'candidates[0].fracos[2]':
    `Declaró ante el ${TSE} un patrimonio 35% menor que el informado en 2022, y una caída de 60% en términos reales desde 2018 según Poder360, lo que se vuelve material de campaña adversaria.`,
  'candidates[0].fracos[3]':
    `En el contrato de segundo lugar de la ${PV} CAYÓ de 8,20% a 6,75%, y la distancia hacia Renan Santos en ese libro, que ayer era de 0,10pp, se abrió a 1,50pp.`,
  'candidates[0].analise':
    `HOY SU PRECIO VOLVIÓ A MOVERSE, Y HACIA ABAJO. EN EL MERCADO está en 63,50% (vol USD 8,18M acumulado), en la lectura del 9/Ago de las 17:34 UTC, contra 64,50% de ayer. Es la primera variación desde el 4/Ago, o sea, la meseta de cinco días fue rota por abajo. La brecha sobre Flávio cayó a +36,55pp, y la distinción que importa es de dónde vino: FLÁVIO NO SUBIÓ, está en su tercer día en 26,95%. En los días anteriores el estrechamiento venía de los dos extremos, con el segundo ganando lo que el líder perdía. Hoy solo se movió el líder, y eso describe una pérdida de precio en el favorito, no una transferencia al adversario. LA SERIE da la regla: desde el 1/Ago la brecha cayó en siete de los ocho días, con un único día quieto, bajando de +41,80pp a +36,55pp. EN LAS ENCUESTAS nada cambió, porque no salió encuesta nacional nueva desde el 5/Ago: valen ${QUAEST} (n=2.004, BR-06591/2026) con 39% y segunda vuelta de 44% x 39%, y Meio/Ideia (n=1.500, BR-04579/2026) con 43% y 48,5% x 43%. Son cuatro días sin medición, y hay tres nacionales previstas para mañana, entre ellas Palver con n=5.000. EN EL TABLERO el día fue de papeleo y de mapa. Declaró su patrimonio ante el ${TSE}, cerca de R$ 4,7 millones, 35% menor que el informado en 2022, con Alckmin declarando R$ 3,3 millones. Y un relevamiento publicado hoy cuenta 26 plataformas estatales para él contra 16 del adversario, que es la cara estatal de la misma asimetría que ya aparecía en la composición de la fórmula.`,

  // ────────────────────── FLÁVIO BOLSONARO ──────────────────────
  'candidates[1].header':
    `TERCER DÍA ESTANCADO: Polymarket 26,95% (vol USD 8,09M acumulado), lectura del 9/Ago de las 17:34 UTC, el mismo valor del 7 y el 8/Ago. La brecha se estrechó hoy sin que él subiera. El contrato de segundo lugar SE DETUVO en 81,50%, tras dos días de caída. En las encuestas siguen valiendo el 30% de Quaest y el 35% de Ideia.`,
  'candidates[1].fortes[0]':
    `Sigue siendo favorito holgado del contrato de segundo lugar de la ${PV}, con 81,50% (vol USD 242 mil), y allí la caída de dos días SE DETUVO.`,
  'candidates[1].fortes[1]':
    `El nivel de 26,95% se sostuvo tres días sin devolver terreno, y en la serie de 89 días 30 de ellos tuvieron un valor igual o mayor.`,
  'candidates[1].fortes[2]':
    `Gana entre evangélicos en los recortes de ${QUAEST}, y amplió ventaja entre votantes con educación secundaria y superior, según un recorte publicado el 9/Ago.`,
  'candidates[1].fortes[4]':
    `La brecha hacia Lula volvió a caer hoy, séptimo día de caída en ocho, y esta vez sin que él necesitara ganar nada.`,
  'candidates[1].fracos[0]':
    `NO CAPTURÓ LO QUE EL LÍDER PERDIÓ. Lula cayó 1,00pp y él quedó quieto, así que la probabilidad salió del favorito sin ir al segundo.`,
  'candidates[1].fracos[1]':
    `Está estancado hace tres días en 26,95%, tras seis días seguidos de alza. La racha de subida terminó el 6/Ago.`,
  'candidates[1].fracos[2]':
    `El contrato de segundo lugar perdió 6,00pp entre el 6 y el 8/Ago, de 87,50% a 81,50%, y hoy apenas se detuvo, sin recuperar nada.`,
  'candidates[1].fracos[3]':
    `Pierde los dos escenarios de ${PV} y los dos de segunda vuelta vigentes, por 9pp y por 8pp en la primera vuelta y por 5pp y 5,5pp en la segunda.`,
  'candidates[1].fracos[4]':
    `La ausencia de mujer en su fórmula sigue siendo tema: 2026 es la primera elección del siglo sin mujer en fórmula competitiva, y su respuesta fue hablar de nombrar mujeres al ${STF}.`,
  'candidates[1].fracos[5]':
    `En la lista de enmiendas Pix que Dino ordenó investigar a la ${PF} está su compañero de fórmula, junto al presidente de la Cámara y a un exlíder del ${PT} en el Senado.`,
  'candidates[1].analise':
    `SU DÍA ES DE GANANCIA SIN MOVIMIENTO. EN EL MERCADO está en 26,95% (vol USD 8,09M acumulado), en la lectura del 9/Ago de las 17:34 UTC, el mismo valor del 7 y el 8/Ago, tercer día estancado. La brecha hacia Lula cayó a +36,55pp, y se estrechó SIN que este lado subiera: quien se movió fue el líder, que perdió 1,00pp. Esa distinción separa dos cosas que el número final confunde. Cuando la brecha se estrecha por los dos extremos, hay transferencia entre los dos nombres. Cuando se estrecha solo porque el líder cede, lo que existe es pérdida de convicción en el favorito, y la probabilidad puede haber ido a cualquier otro desenlace del libro, incluso a ninguno. EN EL CONTRATO DE SEGUNDO LUGAR la caída se detuvo: 81,50% (vol USD 242 mil), lo mismo que ayer, tras perder 6,00pp entre el 6 y el 8/Ago. Detenerse no es recuperar, y el nivel sigue 6,00pp por debajo del del 6/Ago. EN LAS ENCUESTAS nada cambió desde el 5/Ago: 30% en ${QUAEST} y 35% en Meio/Ideia, con segundas vueltas de 39% y 43%. El recorte nuevo publicado hoy lo muestra ampliando ventaja entre votantes con educación secundaria y superior, que es una lectura de la composición de esa misma encuesta del 5/Ago, no medición nueva. EN EL EJE JUDICIAL sigue valiendo la decisión de Dino sobre las enmiendas Pix, que alcanza a su compañero de fórmula, al presidente de la Cámara y a un exlíder del ${PT} en el Senado. El panel registra a los tres juntos porque separarlos sería elegir un lado de la misma decisión.`,

  // ─────────────────────── RENAN SANTOS ───────────────────────
  'candidates[2].header':
    `EL MOVIMIENTO DEL DÍA ESTÁ EN EL LIBRO DE TERCER LUGAR: Renan Santos saltó de 58,50% a 64,50% (vol USD 176 mil), mientras Caiado cayó de 31,00% a 25,50%. La transferencia entre los dos, que ayer se había DETENIDO, volvió en espejo casi exacto. En el presidencial está en 7,80% (vol USD 9,27M), contra 4% y 4,7% en las encuestas.`,
  'candidates[2].fortes[0]':
    `SALTÓ 6,00pp en el contrato de tercer lugar de la ${PV}, de 58,50% a 64,50%, el mayor movimiento de cualquier nombre del panel hoy.`,
  'candidates[2].fortes[1]':
    `Subió 0,15pp en el presidencial, a 7,80%, tercer día seguido de alza.`,
  'candidates[2].fortes[2]':
    `En el contrato de segundo lugar abrió distancia sobre Lula: 8,25% contra 6,75%, cuando ayer los dos estaban separados por 0,10pp.`,
  'candidates[2].fortes[3]':
    `Volumen acumulado de USD 9,27M en el presidencial, todavía mayor que el de Lula y el de Flávio, lo que da profundidad de negociación al contrato.`,
  'candidates[2].fortes[4]':
    `Declaró R$ 795 mil en bienes ante el ${TSE}, con su compañero de fórmula informando R$ 1,6 millones, y apostó al interior para crecer según un reportaje del 9/Ago.`,
  'candidates[2].fracos[0]':
    `La distancia entre precio y encuesta SIGUE siendo la mayor del panel: 7,80% en el mercado contra 4% en Quaest y 4,7% en Meio/Ideia, siempre del lado del precio.`,
  'candidates[2].fracos[2]':
    `En la serie de 89 días del libro presidencial su máximo es 17,90% y su mínimo 5,50%, y 77 de los 89 días tuvieron un valor igual o mayor que el 7,80% de hoy.`,
  'candidates[2].fracos[4]':
    `El reportaje del 9/Ago apunta que su apuesta al interior choca con la estructura de Missão, o sea, el cuello de botella es organizativo y no de intención declarada.`,
  'candidates[2].analise':
    `SU DÍA ES EL MOVIMIENTO MÁS FUERTE DEL PANEL, Y OCURRIÓ EN EL LIBRO MÁS FINO. EN EL CONTRATO DE TERCER LUGAR DE LA ${PV} saltó de 58,50% a 64,50% (vol USD 176 mil), 6,00pp, mientras Caiado cayó de 31,00% a 25,50%, 5,50pp. La transferencia entre los dos es casi exacta, y el detalle importa porque AYER SE HABÍA DETENIDO: el 8/Ago Caiado cayó y él no subió junto, y el panel registró que la probabilidad salía del libro en vez de migrar dentro de él. Hoy volvió a migrar. Dos lecturas de días seguidos apuntando en sentidos opuestos son el motivo de que el panel describa mecanismo en vez de tendencia. EN EL PRESIDENCIAL fue a 7,80% (vol USD 9,27M acumulado), contra 7,65% de ayer, tercer día seguido de alza. EN EL CONTRATO DE SEGUNDO LUGAR abrió sobre Lula: 8,25% contra 6,75%, una distancia de 1,50pp, cuando ayer eran 0,10pp. Quien se movió allí fue Lula, que cayó 1,45pp en ese libro. EN LAS ENCUESTAS sigue entre 4% en Quaest y 4,7% en Meio/Ideia, así que la distancia va de 3,10pp a 3,80pp, siempre del lado del precio, y hoy aumentó. LA SECUENCIA de las encuestas sigue siendo lo que más pesa contra la lectura de crecimiento: seis nacionales consecutivas lo miden entre 3% y 4,7%. LA SERIE DE MERCADO da la otra regla: en 89 días su precio presidencial fue de 17,90% como máximo a 5,50% como mínimo, y 77 de esos días tuvieron un valor igual o mayor que el de hoy, así que 7,80% no describe una recuperación, describe la mitad baja de su propio historial.`,

  // ────────────────── CAIADO / HADDAD / ZEMA ──────────────────
  'candidates[3].header':
    `Precios del 9/Ago de las 17:34 UTC: Caiado 1,25% (vol USD 5,60M), Zema 0,45% (vol USD 5,02M) y Haddad 0,05%. CAIADO CAYÓ POR TERCER DÍA en los dos libros, y en el de tercer lugar perdió 5,50pp, yendo de 31,00% a 25,50%, esta vez con Renan Santos subiendo junto. Zema volvió a quedar por debajo del corte de 0,5%. En las encuestas nada cambió.`,
  'candidates[3].fortes[1]':
    `Caiado sigue como segundo nombre del contrato de tercer lugar de la ${PV}, con 25,50%.`,
  'candidates[3].fortes[2]':
    `Zema registró su candidatura ante el ${TSE} el 6/Ago y declaró su patrimonio junto con los demás en el papeleo del 9/Ago.`,
  'candidates[3].fortes[3]':
    `El volumen acumulado de Caiado, USD 5,60M, y el de Zema, USD 5,02M, mantienen profundidad de negociación pese a los precios bajos.`,
  'candidates[3].fortes[4]':
    `El plazo de registro va hasta el 15/Ago, así que todavía hay calendario para movimientos de fórmula en el pelotón.`,
  'candidates[3].fracos[0]':
    `CAIADO CAYÓ POR TERCER DÍA SEGUIDO en los dos libros: presidencial de 1,35% a 1,25%, y tercer lugar de 31,00% a 25,50%. Solo en el libro de tercer lugar son 10,00pp en tres días.`,
  'candidates[3].fracos[1]':
    `ZEMA cayó 0,10pp, a 0,45%, y volvió a quedar POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido.`,
  'candidates[3].fracos[3]':
    `HADDAD sigue en 0,05%, el piso que el mercado descuenta, y sigue sin ser candidato a la Presidencia.`,
  'candidates[3].fracos[4]':
    `En la lectura del 9/Ago los tres sumados valían 1,75% en el mercado, contra 26,95% de Flávio, menos que el 1,95% de ayer.`,
  'candidates[3].analise':
    `EL PELOTÓN VOLVIÓ A ENCOGERSE, Y EL MOVIMIENTO FUE TODO DE CAIADO. EN EL PRECIO cayó por tercer día seguido en los dos libros: presidencial de 1,35% a 1,25%, y tercer lugar de la ${PV} de 31,00% a 25,50%. Solo en ese libro son 10,00pp en tres días, desde el 33,50% del 6/Ago hasta el 25,50% actual. LA DIFERENCIA CON AYER ES EL MECANISMO, NO LA DIRECCIÓN: ayer él cayó y Renan Santos quedó quieto, y el panel registró que la probabilidad salía del libro. Hoy Renan subió 6,00pp contra los 5,50pp que él perdió, o sea, migró entre los dos. La dirección es la misma en los dos días y lo que ocurrió con la probabilidad no, y por eso el panel describe los dos casos por separado en vez de sumarlos en una tendencia. ZEMA cayó 0,10pp, a 0,45%, y volvió a quedar por debajo del corte de 0,5% que separa precio de ruido, tras haber estado por encima un único día. HADDAD sigue en 0,05%. EN LAS ENCUESTAS NADA CAMBIÓ, porque no hay encuesta nacional nueva desde el 5/Ago: Caiado sigue con 4% en Quaest y 5,7% en Meio/Ideia, Zema con 2% y 2,6%. EN EL TABLERO el día fue de papeleo, con las declaraciones de patrimonio ante el ${TSE}, y el calendario de registro se cierra el 15/Ago. EL CRUCE QUE INTERESA: los tres sumados valen 1,75% en el contrato de ganador, contra 26,95% del segundo, y esa proporción VOLVIÓ a encogerse, porque fueron sus 0,20pp los que se perdieron mientras el segundo quedaba quieto.`,

  // ──────────────────── QUADRO COMPARATIVO ────────────────────
  'quadroComparativo[0].p':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días, desde el 5/Ago. Siguen valiendo ${QUAEST} (n=2.004, BR-06591/2026) con 39% en la ${PV} y 44% x 39% en la segunda vuelta, y Meio/Ideia (n=1.500, BR-04579/2026) con 43% y 48,5% x 43%. APROBACIÓN 48% x 47% en Quaest.`,
  'quadroComparativo[0].m':
    `63,50% (vol USD 8,18M acumulado), lectura del 9/Ago 17:34 UTC`,
  'quadroComparativo[0].t':
    `CAYÓ 1,00pp y rompió por abajo la meseta de cinco días. Primera variación desde el 4/Ago. La brecha sobre Flávio quedó en +36,55pp, y se estrechó solo por este lado.`,
  'quadroComparativo[0].s':
    `56 días de la elección. DECLARÓ SU PATRIMONIO ante el ${TSE}, cerca de R$ 4,7 millones, 35% menos que en 2022, con Alckmin informando R$ 3,3 millones. Un relevamiento del 9/Ago cuenta 26 plataformas estatales para él contra 16 del adversario. Lanzamiento oficial el 16/Ago, en Vila Euclides.`,

  'quadroComparativo[1].p':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 30% en Quaest, contra 28% el 15/Jul de la misma casa, y el 35% en Meio/Ideia, contra 32% el 8/Jul. Segundas vueltas de 39% y 43%, pierde las dos. RECHAZO 54%, el más alto entre los dos primeros.`,
  'quadroComparativo[1].m':
    `26,95% (vol USD 8,09M), lectura del 9/Ago 17:34 UTC`,
  'quadroComparativo[1].t':
    `TERCER día estancado en el mismo valor. Ganó terreno relativo sin moverse: la brecha se estrechó porque el líder cedió. En el libro de segundo lugar la caída se detuvo en 81,50%.`,
  'quadroComparativo[1].s':
    `Un recorte publicado el 9/Ago lo muestra ampliando ventaja entre votantes con educación secundaria y superior, que es una lectura de esa misma ronda del 5/Ago y no medición nueva. Su compañero de fórmula sigue en la lista de enmiendas Pix que Dino ordenó investigar, con R$ 6,2 millones sin rastrear.`,

  'quadroComparativo[2].p':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 4% en Quaest, contra 3% el 15/Jul, y el 4,7% en Meio/Ideia, contra 2% el 8/Jul. Con eso, SEIS nacionales consecutivas lo miden entre 3% y 4,7%. Pierde las segundas vueltas por 45% x 35% y 48% x 34,7%.`,
  'quadroComparativo[2].m':
    `7,80% (vol USD 9,27M), lectura del 9/Ago 17:34 UTC`,
  'quadroComparativo[2].t':
    `Subió 0,15pp en el presidencial, tercer día de alza, y SALTÓ 6,00pp en el libro de tercer lugar, a 64,50%. La distancia hacia las encuestas aumentó y va de 3,10pp a 3,80pp.`,
  'quadroComparativo[2].s':
    `Mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,27M, por encima del de Lula. Declaró R$ 795 mil en bienes ante el ${TSE}, con su compañero de fórmula informando R$ 1,6 millones. Un reportaje del 9/Ago apunta que su apuesta al interior choca con la estructura de Missão.`,

  'quadroComparativo[3].p':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 4% en Quaest, lo mismo que el 15/Jul, y el 5,7% en Meio/Ideia, contra 4% el 8/Jul. En las segundas vueltas, 37% contra 45% y 40% contra 48,5%, esta la menor distancia entre los cuatro adversarios probados en Ideia.`,
  'quadroComparativo[3].m':
    `1,25% (vol USD 5,60M), lectura del 9/Ago 17:34 UTC`,
  'quadroComparativo[3].t':
    `CAYÓ por TERCER día seguido en los dos libros: 0,10pp en el presidencial y 5,50pp en el de tercer lugar, a 25,50%. Son 10,00pp en ese libro en tres días.`,
  'quadroComparativo[3].s':
    `Su caída en el libro de tercer lugar tuvo un mecanismo DISTINTO al de ayer: hoy Renan Santos subió 6,00pp contra los 5,50pp perdidos, o sea, la probabilidad migró entre los dos. Ayer había salido del libro. La divergencia entre institutos sigue abierta: 4% en una casa y 5,7% en la otra.`,

  'quadroComparativo[4].p':
    `SIN ENCUESTA NACIONAL NUEVA desde hace CUATRO días. Siguen valiendo el 2% en Quaest, lo mismo que el 15/Jul, y el 2,6% en Meio/Ideia, prácticamente el 2,5% del 8/Jul. En las segundas vueltas, 34% contra 46% y 37% contra 48,5%, y es el adversario al que Lula gana con más holgura en Quaest.`,
  'quadroComparativo[4].m':
    `0,45% (vol USD 5,02M), lectura del 9/Ago 17:34 UTC`,
  'quadroComparativo[4].t':
    `Cayó 0,10pp y volvió a quedar POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido, tras un único día por encima de él.`,
  'quadroComparativo[4].s':
    `Registró su candidatura ante el ${TSE} el 6/Ago, declarando R$ 178,7 millones de patrimonio, y sigue siendo el único del pelotón con registro presentado. El plazo se cierra el 15/Ago.`,

  'quadroComparativo[5].m':
    `3,60% (vol USD 83 mil), lectura del 9/Ago 17:34 UTC`,
  'quadroComparativo[5].t':
    `SUBIÓ 0,50pp, primera variación tras dos días quieto. Sigue siendo el contrato más fino entre los seguidos, y el movimiento en él exige esa salvedad.`,
  'quadroComparativo[5].s':
    `Sigue valiendo la decisión de Dino que ordenó a la ${PF} investigar R$ 55,4 millones en enmiendas Pix señalados por el TCU, con el compañero de fórmula de Flávio, el presidente de la Cámara y un exlíder del ${PT} en el Senado en la misma lista. El panel registra a los tres juntos porque separarlos sería elegir un lado de la misma decisión.`,

  cruzamento:
    `HOY LA BRECHA VOLVIÓ A ESTRECHARSE, Y POR UN SOLO LADO. En la lectura del 9/Ago de las 17:34 UTC, confirmada por dos lecturas independientes, Lula está en 63,50% (vol USD 8,18M acumulado) y Flávio en 26,95% (vol USD 8,09M), con una brecha de +36,55pp contra +37,55pp de ayer. LO QUE CAMBIÓ FUE EL LÍDER: Lula perdió 1,00pp y rompió por abajo la meseta de cinco días que duraba desde el 4/Ago, mientras Flávio completó su tercer día estancado. En los días anteriores el estrechamiento venía de los dos extremos. Hoy vino de uno, y esa diferencia separa una transferencia de probabilidad entre dos nombres de una pérdida de precio en el favorito. Desde el 1/Ago la brecha cayó en SIETE de los ocho días, con un único día quieto, bajando de +41,80pp a +36,55pp. EL SEGUNDO MOVIMIENTO DEL DÍA ESTÁ EN EL LIBRO DE TERCER LUGAR, Y CONTRADICE EL DE AYER: Renan Santos saltó 6,00pp, a 64,50%, y Caiado cayó 5,50pp, a 25,50%, en espejo casi exacto. Ayer Caiado cayó sin que Renan subiera, y el panel registró que la probabilidad salía del libro en vez de migrar dentro de él. Hoy migró. La dirección fue la misma en los dos días, el mecanismo no, y por eso el panel los describe por separado en vez de sumarlos en una tendencia. EN LAS ENCUESTAS NO HAY MEDICIÓN NUEVA DESDE HACE CUATRO DÍAS. Siguen valiendo ${QUAEST} (n=2.004, BR-06591/2026) con 39% x 30% en la ${PV} y 44% x 39% en la segunda vuelta, y Meio/Ideia (n=1.500, BR-04579/2026) con 43% x 35% y 48,5% x 43%. La cobertura de hoy sobre Quaest trae recortes por escolaridad y por posicionamiento, que son lecturas de esa misma ronda del 5/Ago, no medición nueva. EL CALENDARIO LO RESUELVE MAÑANA: hay TRES nacionales previstas para el 10/Ago, entre ellas Palver con n=5.000, más dos el 11/Ago y una el 13/Ago. Son seis en cuatro días, y son la primera oportunidad de comparar las encuestas con un mercado que se movió solo durante toda la semana. EN EL TABLERO el día fue de papeleo y de mapa: las declaraciones de patrimonio ante el ${TSE}, con Lula informando cerca de R$ 4,7 millones, 35% menos que en 2022, y un relevamiento contando 26 plataformas estatales para él contra 16 del adversario. El plazo de registro se cierra el 15/Ago, y 2026 ya es la elección con la mayor proporción de fórmulas de un solo partido desde la redemocratización, con 92,3%.`,
})
