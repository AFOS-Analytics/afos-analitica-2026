/** Mapa ES de analysis-criteriosa.json — /atualizar-brz 04/Ago/2026. Vírgula decimal, ponto de milhar. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const NEXUS = G('BTG/Nexus', 'nexus-btg')
const STF = G('STF', 'stf')
const NOVO = G('Novo', 'novo')
const PF = G('Policía Federal', 'pf')

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 04/Ago 18:30, a 61 días de la 1ª vuelta. ⚠️ EL LADO DE LA ENCUESTA ES DE HOY, EL DEL MERCADO ES DE AYER: la traba de captura bloqueó cuatro rondas seguidas el 04/Ago, con el libro de Caiado oscilando entre 1,65% y 2,30% en ocho minutos, y el panel no publica un precio que dos lecturas no confirmen. Los precios de aquí son de la captura trabada de las 19:11 UTC del 03/Ago. EL DATO NUEVO ES LA APROBACIÓN: ${NEXUS} divulgó hoy, de la misma ronda de ayer, 47% de aprobación del gobierno contra 48% de desaprobación, y la aprobación está quieta en 47% desde hace tres rondas de la casa. En el tablero, ZEMA ANUNCIÓ VICE, el senador Eduardo Girão, del partido ${NOVO}, y FLÁVIO RECIBIÓ DOS RECHAZOS, de Republicanos y de Podemos, quedando sin vice.`,

  'candidates[0].header':
    `Precio del 03/Ago: ${G('Polymarket', 'polymarket')} 65,50% (vol USD 7,92M acumulado), de la captura trabada de las 19:11 UTC. El 04/Ago la traba bloqueó cuatro veces y no hay precio nuevo. El dato de hoy es la APROBACIÓN: 47% contra 48% de desaprobación en ${NEXUS}, quieta en 47% desde hace tres rondas de la casa.`,
  'candidates[0].analise':
    `Su día es de aprobación nueva y de precio no publicado, y las dos cosas hay que decirlas por separado. LA APROBACIÓN salió hoy, de la misma ronda de ${NEXUS} de ayer (n=2.002, campo del 31/Jul al 02/Ago, BR-02874/2026): 47% aprueban al gobierno y 48% desaprueban. El hallazgo no es el nivel, es la INMOVILIDAD: dentro de la propia casa la aprobación está en 47% en las tres últimas rondas, 13/Jul, 27/Jul y ahora, y quien osciló fue la desaprobación, de 47% a 49% y de vuelta a 48%, siempre dentro del margen de 2pp. Una serie que no se mueve en tres lecturas describe un electorado dividido y estable, no una tendencia. En la EVALUACIÓN DE LA GESTIÓN, que es una pregunta distinta y no se mezcla con la aprobación, son 37% de excelente o buena, 18% de regular y 43% de mala o pésima, contra 36% y 43% el 27/Jul. También quieto. ⚠️ El panel CAMBIÓ DE FUENTE en este campo, que hasta ayer traía la lectura del 29/Jul, y por eso no publica variación contra ella: comparar casas distintas sería cambiar la vara de medir a mitad de la medición. PoderData/Aya del 30/Jul, la otra lectura reciente, da un cuadro bastante más duro, 43% x 49%. Las dos siguen apuntando a lados distintos. EL PRECIO NO ENTRA HOY: la traba bloqueó cuatro rondas, y lo que el panel publica es la captura trabada del 03/Ago, con él en 65,50% y una diferencia de +40,05pp. En su campo, la ${PF} tuvo un día cargado: Dino AUTORIZÓ el tercer expediente contra Lulinha y abrió una investigación sobre filtraciones, y el propio Lula mandó a un asesor a explicar un préstamo tomado con una amiga de Lulinha investigada. El panel registra los hechos y no atribuye efecto electoral.`,

  'candidates[1].header':
    `Precio del 03/Ago: ${G('Polymarket', 'polymarket')} 25,45% (vol USD 7,86M acumulado), de la captura trabada de las 19:11 UTC. El 04/Ago recibió DOS rechazos de alianza, de Republicanos y de Podemos, y sigue sin vice a once días del plazo que él mismo declaró.`,
  'candidates[1].analise':
    `Su día fue de aislamiento partidario, y eso es un hecho registrado, no una lectura. REPUBLICANOS confirmó neutralidad en la elección y rechazó integrar la fórmula, y Folha de S.Paulo describe el movimiento como una ampliación de su aislamiento. Enseguida PODEMOS también rechazó el apoyo y decidió quedarse neutral, tras resistirse a postular a su propia presidenta, Renata Abreu, como vice. Sigue SIN VICE y dijo que la definición sale hasta el 15 de agosto, lo que da once días. Michelle Bolsonaro llamó a Ciro Nogueira para interceder por Tereza Cristina en el puesto, y Daniella Marques, que era la apuesta anterior, seguirá en la campaña como asesora tras la negativa de Republicanos. EN LA ENCUESTA SIGUE SIENDO EL MOVIMIENTO DE LA SEMANA: ${NEXUS} del 03/Ago lo llevó de 33% a 37% en 1ª vuelta, subida de 4pp que es el doble del margen, y de 43% a 45% en la 2ª, a 1pp de Lula. Pero la salvedad de casa sigue valiendo: las otras tres nacionales desde el 29/Jul dan diferencias de 6pp a 9,3pp, contra 4pp aquí. EL PRECIO NO ENTRA HOY, porque la traba bloqueó cuatro rondas. Lo que el panel publica es la captura del 03/Ago, con él en 25,45%. El cruce que queda abierto para mañana es justamente ese: subió en la encuesta y a la vez perdió dos partidos, y ninguna de las dos cosas pasó todavía por un precio confirmado.`,

  'candidates[3].header':
    `Precios del 03/Ago: Caiado 1,15% (vol USD 5,30M), Zema 0,25% (vol USD 4,66M) y Haddad 0,15% (vol USD 6,64M). ⚠️ ES JUSTAMENTE AQUÍ donde la traba de captura viene bloqueando el 04/Ago, con el libro de Caiado oscilando entre 1,65% y 2,30% en ocho minutos.`,
  'candidates[3].analise':
    `La tercera vía tuvo el día más movido del ciclo y es ella la que está trabando la captura, lo que no es casualidad. ZEMA ANUNCIÓ VICE: el senador Eduardo Girão, del partido ${NOVO}, confirmado por Folha, O Globo y G1. Es el primero de los tres en cerrar fórmula, y la cierra dentro de su propio partido, sin depender de una alianza. CAIADO, oficializado ayer, aparece hoy como el nombre cuyo precio más se mueve, y el panel NO publica ese número porque cuatro lecturas seguidas no lo confirmaron: entre 1,65% y 2,30%, con variación de 0,65pp en ocho minutos. Conviene registrar qué significa eso en términos de método: un libro que se mueve así está siendo repreciado ahora, y publicar un retrato de él sería publicar un instante, no un precio. HADDAD sigue en 0,15% y sigue sin ser candidato, así que aquel contrato descuenta un escenario de sustitución. EN LA ENCUESTA, ${NEXUS} del 03/Ago da 5% a Caiado y 3% a Zema, y en las 2ª vueltas Lula les gana a ambos, 46% x 42% y 46% x 40%. EL CRUCE QUE INTERESA: el espacio de la tercera vía ganó definición partidaria hoy, con Zema cerrando fórmula y con Republicanos y Podemos bajándose del palco de Flávio, y nada de eso pasó todavía por un precio que el panel pueda publicar. Es lo que medirá la ronda de mañana.`,

  'quadroComparativo[0].p':
    `ENCUESTA DEL 03/Ago, APROBACIÓN DIVULGADA HOY. ${NEXUS} (n=2.002, BR-02874/2026): 41% en 1ª vuelta y 46% x 45% en la 2ª. APROBACIÓN del gobierno 47% x 48% de desaprobación, quieta en 47% en las tres últimas rondas de la casa. Gestión: 37% excelente o buena, 18% regular, 43% mala o pésima.`,
  'quadroComparativo[0].m': `65,50% (vol USD 7,92M acumulado), precio del 03/Ago`,
  'quadroComparativo[0].t':
    `⚠️ SIN PRECIO NUEVO EL 04/Ago: la traba de captura bloqueó cuatro rondas. Vale la captura trabada del 03/Ago, 19:11 UTC, con diferencia de +40,05pp.`,
  'quadroComparativo[0].s':
    `61 días de la elección. Dino AUTORIZÓ el tercer expediente contra Lulinha y abrió una investigación sobre filtraciones. Lula mandó a un asesor a explicar un préstamo con una amiga de Lulinha investigada. Sin atribución de efecto electoral.`,
  'quadroComparativo[1].p':
    `${NEXUS} del 03/Ago: 37% en 1ª vuelta, contra 33% el 27/Jul de la misma casa, subida de 4pp que es el doble del margen. En la 2ª vuelta, 45% contra 46% de Lula, empate técnico.`,
  'quadroComparativo[1].m': `25,45% (vol USD 7,86M acumulado), precio del 03/Ago`,
  'quadroComparativo[1].t':
    `⚠️ SIN PRECIO NUEVO EL 04/Ago, por el mismo bloqueo de la traba. Salvedad de serie que sigue valiendo: su techo es 45,20% el 07/May y su piso es 22,00% el 03/Jul.`,
  'quadroComparativo[1].s':
    `DOS RECHAZOS EN UN DÍA: Republicanos y Podemos confirmaron neutralidad y rechazaron la alianza. Sigue SIN VICE y dice que define hasta el 15/Ago. Michelle intercedió por Tereza Cristina en el puesto.`,
  'quadroComparativo[2].p':
    `${NEXUS} del 03/Ago: 4%, contra 5% el 27/Jul de la misma casa. Cuarta nacional seguida en medirlo entre 3% y 4%. Pierde la 2ª vuelta ante Lula 47% x 37%.`,
  'quadroComparativo[2].m': `7,45% (vol USD 8,86M acumulado), precio del 03/Ago`,
  'quadroComparativo[2].t':
    `⚠️ SIN PRECIO NUEVO EL 04/Ago. En la captura de ayer había caído 0,50pp, deshaciendo la subida de la víspera.`,
  'quadroComparativo[2].s':
    `Mayor volumen acumulado entre los nombres con precio por encima de 1%, por encima del de Lula. Favorito del contrato de 3º lugar en la captura de ayer, con 60,50%.`,
  'quadroComparativo[3].p':
    `${NEXUS} del 03/Ago: 5% en 1ª vuelta, contra 6% el 27/Jul de la misma casa. En la 2ª vuelta, pierde ante Lula 46% x 42%.`,
  'quadroComparativo[3].m': `1,15% (vol USD 5,30M acumulado), precio del 03/Ago`,
  'quadroComparativo[3].t':
    `⚠️ ES EL LIBRO QUE ESTÁ TRABANDO LA CAPTURA: cuatro rondas bloqueadas el 04/Ago, con lecturas entre 1,65% y 2,30% y variación de 0,65pp en ocho minutos. El panel no publica un precio no confirmado.`,
  'quadroComparativo[3].s':
    `Oficializado candidato el 03/Ago. Segundo nombre del contrato de 3º lugar en la captura de ayer, con 25,00%.`,
  'quadroComparativo[4].p':
    `${NEXUS} del 03/Ago: 3% en 1ª vuelta, el mismo de la ronda del 27/Jul. En la 2ª vuelta, pierde ante Lula 46% x 40%.`,
  'quadroComparativo[4].m': `0,25% (vol USD 4,66M acumulado), precio del 03/Ago`,
  'quadroComparativo[4].t':
    `⚠️ SIN PRECIO NUEVO EL 04/Ago. Las lecturas bloqueadas de la traba lo mostraban bastante por encima de eso, y al no haber sido confirmadas no entran.`,
  'quadroComparativo[4].s':
    `ANUNCIÓ VICE el 04/Ago: el senador Eduardo Girão, del partido ${NOVO}. Es el primero de los tres nombres de la tercera vía en cerrar fórmula, y la cierra dentro de su propio partido.`,
  'quadroComparativo[5].m': `3,10% (vol USD 83 mil), precio del 03/Ago`,
  'quadroComparativo[5].t':
    `⚠️ SIN PRECIO NUEVO EL 04/Ago. Estaba estable en 3,10% en la captura de ayer.`,
  'quadroComparativo[5].s':
    `Dino AUTORIZÓ el tercer expediente contra Lulinha y abrió una investigación sobre filtraciones. Flávio nombró a Moraes, Dino y Zanin al defender la destitución de ministros. Sin precio confirmado contra el cual medir una reacción.`,

  cruzamento:
    `ESTA RONDA PUBLICA LA MITAD DEL CRUCE, Y DICE CUÁL MITAD. El lado de la ENCUESTA es de hoy. El lado del MERCADO es de ayer, de la captura trabada del 03/Ago a las 19:11 UTC, porque el 04/Ago la traba de captura bloqueó CUATRO rondas seguidas. El motivo cambió de figura a lo largo del día: empezó en libros finos y terminó en CAIADO, que osciló entre 1,65% y 2,30% en lecturas separadas por ocho minutos, variación de 0,65pp. El panel no publica un precio que dos lecturas independientes no confirmen, y publicar un retrato de un libro en movimiento es exactamente lo que esa regla existe para impedir. --- EL DATO NUEVO DEL DÍA ES LA APROBACIÓN, y vino de la ronda de ayer. ${NEXUS} divulgó, en la cobertura del 04/Ago y de la MISMA ronda BR-02874/2026, aprobación del gobierno en 47% contra 48% de desaprobación. ⚠️ El panel corrige aquí una afirmación que publicó ayer: la ficha de aquella ronda decía que no había traído aprobación, y sí la trajo. La corrección queda declarada en la propia ficha, en vez de reescrita en silencio. --- EL HALLAZGO NO ES EL NIVEL, ES LA INMOVILIDAD. Dentro de la propia ${NEXUS}, la aprobación está en 47% en las TRES últimas rondas: 47% x 47% el 13/Jul, 47% x 49% el 27/Jul y 47% x 48% ahora. Quien osciló fue la desaprobación, y osciló 2pp hacia arriba y 1pp hacia abajo, dentro del margen en ambos casos. Tres lecturas sin movimiento describen un electorado dividido y estable, no una tendencia. La gestión cuenta la misma historia: 37% de excelente o buena contra 43% de mala o pésima, frente a 36% y 43% el 27/Jul. ⚠️ Y el panel CAMBIÓ DE FUENTE en este campo, que hasta ayer traía la lectura del 29/Jul, así que no publica variación contra ella: comparar casas distintas es cambiar la vara de medir a mitad de la medición. PoderData/Aya del 30/Jul sigue dando un cuadro bastante más duro, 43% x 49%, y las dos casas continúan apuntando a lados distintos. --- EL TABLERO PARTIDARIO SE MOVIÓ MÁS QUE LA ENCUESTA. ZEMA anunció vice, el senador Eduardo Girão, del partido ${NOVO}, y es el primero de los tres nombres de la tercera vía en cerrar fórmula, encima dentro de su propio partido. FLÁVIO recibió DOS rechazos el mismo día, de Republicanos y de Podemos, que confirmaron neutralidad, y sigue SIN VICE a once días del plazo que él mismo declaró, el 15 de agosto. Es la combinación que mañana será medida: subió 4pp en la encuesta de ${NEXUS} y perdió dos partidos en la misma semana, y ninguna de las dos cosas pasó todavía por un precio que este panel pueda publicar. --- EN EL EJE JUDICIAL, el pedido de ayer se volvió decisión hoy: DINO AUTORIZÓ el tercer expediente contra Lulinha y abrió una investigación sobre filtraciones. El panel registró ayer que la ${PF} lo había PEDIDO, y mantiene la distinción entre pedir y abrir, porque es lo que separa la noticia del hecho. Lula mandó a un asesor a explicar un préstamo tomado con una amiga de Lulinha investigada. Sin precio confirmado hoy, no hay cómo medir si el mercado descontó alguna de esas cosas, y el panel lo dice en vez de estimar.`,
})
