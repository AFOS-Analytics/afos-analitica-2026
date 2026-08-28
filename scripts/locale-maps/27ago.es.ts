/**
 * Mapa ES de 27/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções ES: VÍRGULA decimal e PONTO de milhar, igual ao pt-BR.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem.
 * 🏷️ `parado` é `estancado`; `precificar` é `descontar`; `estadual` é `estatal`.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/es/glossary#${id})`
const S = 'lectura confirmada del 27/Ago, 21:46 BRT (00:46 UTC del 28/Ago)'
const CURY = 'El contrato de ganador de Augusto Cury se abrió este jueves y esta ronda no publica precio para él. Sus contratos de segundo y de tercer lugar sí, y son esos los que aparecen en el panel.'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `El libro presidencial acumula USD 137,47M y el precio de esta página es de la ${S}. El día tuvo una encuesta nacional nueva, PoderData/Aya, con ${G('empate técnico', 'empate-tecnico')} en las dos vueltas, y tuvo un nombre NUEVO recibiendo contratos en el libro de precios.`,
  'cards.sentimento.text2':
    `En el precio, el líder cedió 5,00pp y bajó a 57,50%, su nivel más bajo desde el 01/Jul, con la caída llegando en cinco lecturas sucesivas a lo largo del día. El segundo subió 0,30pp, hasta 35,85%, su nivel más alto desde el 13/May. La distancia entre ambos se redujo de 26,95pp a 21,65pp, y se estrechó por arriba: quien se movió fue el primero.`,
  'cards.sentimento.text3':
    `El mayor movimiento del día no está en el contrato de ganador. Está en los contratos de posición, donde tres nombres cedieron al mismo tiempo: Renan Santos perdió 9,00pp en el de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')}, hasta 36,50%, Ronaldo Caiado perdió 5,50pp, hasta 33,50%, y Flávio Bolsonaro perdió 3,00pp en el de segundo lugar, hasta 84,50%. El mismo día ${G('Polymarket', 'polymarket')} abrió contratos para Augusto Cury, que aparece con 23,50% en el de tercer lugar y 4,00% en el de segundo. El panel registra la simultaneidad y no afirma que haya transferencia.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro en 35,85% en el presidencial, alza de 0,30pp, y su nivel más alto desde el 13/May, verificado en el respaldo contra el registro completo desde el 14/Abr. En el contrato de segundo lugar de la primera vuelta cedió 3,00pp, hasta 84,50%. En la urna, PoderData lo coloca a 3 puntos en la primera vuelta, 35% frente a 38%, y a 1 punto en la ${G('segunda vuelta', 'segundo-turno')}, 44% frente a 45%, ambos dentro del margen de 2pp, con un rechazo de 49%, igualado con el del líder.`,
  'cards.sentimento.esquerda':
    `Lula en 57,50%, caída de 5,00pp y su nivel más bajo desde el 01/Jul. En la urna, PoderData lo mide en 38% en la primera vuelta, frente al 41% de la propia casa el 13/Ago, y lo mantiene adelante en los cuatro escenarios de segunda vuelta probados. La aprobación del gobierno aparece en 42% frente a 50% de desaprobación en la misma ronda, y la gestión es mala o pésima para 48% frente a buena o muy buena para 33%.`,
  'cards.sentimento.terceiraVia':
    `Aquí está la novedad del día. Polymarket abrió contratos para Augusto Cury este jueves, a las 00:30 UTC, y el mercado ya formó precio sobre dónde llega: 23,50% para terminar tercero en la primera vuelta y 4,00% para terminar segundo. ${CURY} Renan Santos cayó a 1,65% en el contrato de ganador, el piso de toda su serie, y Ronaldo Caiado cayó a 0,15%. En la urna PoderData da 4% a los tres, igualados, y coloca a Caiado y a Zema en empate técnico con el líder en la segunda vuelta, por 43% a 44% cada uno.`,
  'cards.sentimento.polymarket':
    `Precios de la ${S}. El AFOS solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp, y la confirmación se hace contrato por contrato. ${CURY} Los nombres por debajo de 0,5% quedan fuera de esa vigilancia, porque en un libro delgado la oscilación no distingue movimiento de ruido.`,
  'cards.inss.text1':
    `⭐ EL HECHO NUEVO DEL 27/Ago ES QUE EL CASO LLEGÓ A LA ENTREVISTA TELEVISIVA. Lula fue al Jornal Nacional este jueves, llamó ilaciones a las acusaciones sobre su hijo, dijo que Lulinha probará su inocencia y negó haberlo blindado, según O Globo. Aliados lo prepararon para despegarse del caso y apuntar a su adversario, según Estadão.`,
  'cards.inss.text2':
    `La investigación avanzó en tres frentes el mismo día. La ${G('PF', 'pf')} indaga el pedido de un lobista para que Lulinha actuara en favor del llamado Careca do ${G('INSS', 'inss')}, según Folha de S.Paulo. El abogado del hijo pidió a la PF que investigue filtraciones, citando al adversario, a su compañero de fórmula y a su coordinador de campaña, según O Globo. Y el Ministerio Público de España analiza una denuncia sobre una empresa vinculada al caso, según Gazeta do Povo.`,
  'cards.inss.text3':
    `El caso también se volvió disputa institucional. El enfrentamiento entre André Mendonça y la dirección de la Policía Federal creó un impasse en las investigaciones, según Gazeta do Povo, y Lula intentó contener la crisis defendiendo una reunión para limar asperezas, según O Globo. En el Congreso, parlamentarios articulan una comisión de investigación sobre el caso, según Gazeta do Povo, mientras el gobierno apunta a una agenda positiva para desviar el foco, según CNN Brasil.`,
  'cards.inss.text4':
    `⚠️ El caso sigue vivo y sin desenlace. La distinción que el panel mantiene desde el inicio sigue vigente: una cosa es el efecto sobre la evaluación del gobierno, otra es el efecto sobre la intención de voto, y las dos no andan juntas por defecto.`,
  'cards.inss.impactoLula':
    `No aislable, y la ronda de hoy permite decirlo con la comparación más limpia que existe, que es la de una casa consigo misma. PoderData mide al líder en 38% en la primera vuelta ahora y lo medía en 41% el 13/Ago, con el mismo método, la misma muestra y el mismo margen. Son tres puntos de diferencia entre dos rondas de la misma casa, y ningún efecto de caso es separable dentro de eso.`,
  'cards.inss.impactoGestao':
    `La evaluación sigue con saldo negativo, y ahora en cuatro lecturas de la semana: 42% de aprobación frente a 50% de desaprobación en la PoderData de hoy, 46% frente a 50% en Indexa/Broadcast del 26/Ago, 43% frente a 51% en Gerp del 26/Ago, y 48% frente a 49% en ${G('BTG/Nexus', 'nexus-btg')} del 24/Ago. Las cuatro coinciden en el signo y discrepan en el tamaño, con seis puntos de amplitud en la aprobación.`,
  'cards.inss.conclusao':
    `El 27/Ago el caso entra en la entrevista de mayor audiencia de la campaña y al mismo tiempo traba su propia investigación, con el enfrentamiento entre el relator en el ${G('STF', 'stf')} y la dirección de la Policía Federal. El panel registra los dos movimientos y no convierte ninguno en pronóstico de voto: PoderData muestra empate técnico en las dos vueltas el mismo día en que el precio del líder cede 5,00pp, y esas son dos mediciones distintas que apenas cayeron en la misma fecha.`,
  'cards.bancoMaster.text1':
    `⭐ EL HECHO NUEVO DEL 27/Ago ES QUE LA DECLARACIÓN OCURRIÓ. Daniel Vorcaro declaró ante la Policía Federal este jueves, por videoconferencia, desde la unidad donde está preso, según Jornal de Brasília y ND Mais. La declaración estaba fijada para el 20/Ago, fue aplazada a pedido de la defensa y fue reprogramada para hoy.`,
  'cards.bancoMaster.text2':
    `⚠️ El foco de la investigación es la actuación de dos exdirectores de supervisión del Banco Central en favor del ${G('Master', 'banco-master')} mientras la institución enfrentaba una crisis de liquidez. Es la primera manifestación formal del excontrolador después de que dos propuestas de delación fueran rechazadas por la PF y por la Procuraduría General de la República, según Portal Salvador FM.`,
  'cards.bancoMaster.text3':
    `El caso Dark Horse, que corre en paralelo, tuvo tres movimientos este jueves: la productora pidió a André Mendonça que saque la investigación de São Paulo y lleve el caso al STF, según G1, Folha de S.Paulo y Valor Econômico; Flavio Dino amplió el acceso de la PF a las pruebas, según G1; y la distribuidora decidió estrenar la película después de la elección, según O Globo.`,
  'cards.bancoMaster.conclusao':
    `⭐ Y AQUÍ ESTÁ EL CRUCE DEL DÍA. La declaración ocurrió, el caso Dark Horse avanzó contra el segundo en dos frentes judiciales, y su precio en el contrato de ganador aun así subió 0,30pp, hasta el nivel más alto desde el 13/May. En el contrato de segundo lugar de la primera vuelta, sin embargo, cedió 3,00pp. La víspera el CEO de Indexa había dicho a Estadão que él venía recuperando electores después del caso Master. El panel registra ambos lados en la misma fecha y no decide cuál explica al otro.`,
  'cards.stf.toffoli':
    `Prorrogó la investigación sobre el Banco Master. Votó con Zanin para mantener la exigencia del Marco Civil de Internet sobre datos de usuarios.`,
  'cards.stf.moraes': `Sin acto individual nuevo de fondo el 27/Ago.`,
  'cards.stf.gilmar': `Sin acto individual nuevo capturado el 27/Ago.`,
  'cards.stf.dino':
    `Amplió el acceso de la Policía Federal a las pruebas del caso Dark Horse, y los investigadores evalúan concentrar la indagación en el STF, según G1.`,
  'cards.stf.mendonca':
    `⭐ EL NOMBRE DEL DÍA EN EL TRIBUNAL ES ÉL POR SEGUNDO DÍA CONSECUTIVO, y ahora por un enfrentamiento abierto. Se enfrenta a la dirección de la Policía Federal en la investigación sobre el hijo del presidente, y el impasse creado allí puede definir el ritmo de las indagaciones dentro de la campaña, según O Globo y Gazeta do Povo. El mismo jueves la productora de Dark Horse le pidió que saque la investigación de São Paulo y lleve el caso al STF. Su tesis sobre deepfake generó debate en el ${G('TSE', 'tse')}, y los ministros evalúan que hace falta definir el alcance de la prohibición.`,
  'cards.stf.nexo':
    `⭐ EL NEXO DEL DÍA ES DE COMPETENCIA, NO DE FONDO. Las dos mayores disputas de la campaña, el caso Lulinha y el caso Dark Horse, pasaron este jueves por la pregunta de quién investiga y dónde: el enfrentamiento entre el relator y la dirección de la PF en uno, y el pedido de llevar el otro de São Paulo al STF. En ambos lo que está en juego es el fuero, y es el fuero el que decide el calendario de las indagaciones dentro del período electoral.`,
  'cards.stf.analise':
    `El contrato de salida de un ministro del Supremo por juicio político antes de 2027 está en 3,40% (vol USD 84 mil), sin variación en la ${S}. Es el cuarto día consecutivo en el mismo nivel. Este jueves el tribunal apareció en el centro de las dos mayores disputas de la campaña, por competencia y por acceso a pruebas, y aun así el precio no se movió. El mercado de ese contrato es pequeño, con un volumen acumulado de 84 mil dólares, así que el panel no trata la ausencia de movimiento como respuesta a nada: la trata como ausencia de negocio.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'es', {
  subtitle:
    `Cruce del 27 de agosto de 2026: precio de Polymarket en ${S}, libro presidencial en USD 137,47M, contra la PoderData/Aya divulgada este jueves (BR-04974/2026, campo del 23 al 26/Ago, n=2.400), que trae EMPATE TÉCNICO en las dos vueltas, y contra Gerp e Indexa/Broadcast del 26/Ago, que se contradicen entre sí. BTG/Nexus del 24/Ago (BR-09028/2026, n=2.006) sigue siendo la de mayor confiabilidad de la ventana en la regla de la casa. Noticias revisadas en 1.152 ítems recogidos este jueves.`,
  'candidates[0].header':
    `PRECIO: 57,50% (vol USD 9,27M acumulado), ${S}. Caída de 5,00pp en el día, la mayor variación del panel en el contrato de ganador, y el nivel más bajo desde el 01/Jul.`,
  'candidates[0].fortes[0]':
    `La PoderData/Aya de hoy (n=2.400, teléfono, campo del 23 al 26/Ago, BR-04974/2026) todavía lo coloca ADELANTE en la primera vuelta, con 38% frente a 35%, y ganando los CUATRO escenarios de segunda vuelta probados: 45% a 44% contra Flávio Bolsonaro, 44% a 43% contra Romeu Zema, 44% a 43% contra Ronaldo Caiado y 44% a 37% contra Renan Santos.`,
  'candidates[0].fortes[1]':
    `BTG/Nexus del 24/Ago, la de mayor confiabilidad de la ventana, lo mantiene en 41% en la primera vuelta y ganando la segunda por 46% a 45%. Las tres nacionales de la semana lo dan adelante o igualado, y ninguna lo da atrás por más de 1 punto.`,
  'candidates[0].fortes[2]':
    `Aun después de la caída, su precio sigue siendo el mayor del libro por amplio margen, y el segundo está 21,65pp atrás.`,
  'candidates[0].fortes[3]':
    `Fue a la entrevista del Jornal Nacional este jueves, llamó ilaciones a las acusaciones sobre su hijo y dijo que Lulinha probará su inocencia, negando haberlo blindado, según O Globo. Aliados lo prepararon para despegarse del caso y apuntar a su adversario, según Estadão.`,
  'candidates[0].fortes[4]':
    `La propaganda electoral en televisión debuta sin Lulinha y con el adversario citando el caso, según O Globo, lo que mueve la disputa a un terreno donde el oficialismo tiene más tiempo de pantalla.`,
  'candidates[0].fracos[0]':
    `⚠️ PoderData trae EMPATE TÉCNICO en las DOS vueltas por primera vez en la serie de la propia casa. En la primera vuelta su distancia cayó de 6pp el 13/Ago (41% x 35%) a 3pp ahora (38% x 35%), y en la segunda sigue en 1pp (45% x 44%, frente a 46% x 45%). Misma casa, mismo método y misma muestra: la primera vuelta se estrechó a la mitad en dos semanas.`,
  'candidates[0].fracos[1]':
    `El precio cedió 5,00pp en un solo día, de 62,50% a 57,50%, y la caída fue continua, en cinco lecturas sucesivas a lo largo de este jueves.`,
  'candidates[0].fracos[2]':
    `⚠️ 57,50% es el nivel más bajo desde el 01/Jul. La última lectura por debajo de eso fue el 30/Jun a las 16:30 UTC, con 55,50%, verificado en el respaldo de la base contra el registro completo desde el 14/Abr.`,
  'candidates[0].fracos[3]':
    `Rechazo en 49%, igualado con el del segundo, según Poder360. La aprobación del gobierno aparece en 42% frente a 50% de desaprobación en la misma ronda, y la gestión es mala o pésima para 48% frente a buena o muy buena para 33%, según CNN Brasil.`,
  'candidates[0].fracos[4]':
    `⚠️ El caso Lulinha ganó tres frentes nuevos este jueves: la PF indaga el pedido de un lobista para que él actuara en favor del llamado Careca do INSS, según Folha de S.Paulo; el abogado del hijo pidió una investigación sobre filtraciones citando al adversario y a su coordinador de campaña, según O Globo; y el Ministerio Público de España analiza una denuncia sobre una empresa vinculada al caso, según Gazeta do Povo.`,
  'candidates[0].analise':
    `El día invierte el dibujo de la víspera. El 26/Ago su precio estaba estancado y quien se movía era el segundo; este jueves quien se movió fue él, y hacia abajo: 5,00pp en cinco lecturas sucesivas, de 62,50% a 57,50%, el nivel más bajo desde el 01/Jul. El mismo día PoderData/Aya publicó la primera ronda de la propia casa con empate técnico en las dos vueltas, con la primera estrechándose de 6pp a 3pp en dos semanas y la segunda en 1pp. Las dos cosas cayeron en la misma fecha y el panel registra la coincidencia sin atribuir causa, porque probabilidad de ganar e intención de voto miden cosas distintas, y la misma ronda que estrecha la primera vuelta también lo mantiene adelante en los cuatro escenarios de segunda probados. El libro también cambió de composición este jueves, con la apertura de contratos para un nombre que hasta ayer no tenía precio. Aun así su precio sigue siendo el mayor del libro por amplio margen, y la distancia al segundo, ahora en 21,65pp, sigue siendo la mayor entre dos nombres cualesquiera de la disputa. ${S}.`,
  'candidates[1].header':
    `PRECIO: 35,85% (vol USD 9,10M acumulado), ${S}. Alza de 0,30pp y su nivel más alto desde el 13/May.`,
  'candidates[1].fortes[0]':
    `⭐ 35,85% es su precio más alto desde el 13/May. El último punto por encima de eso fue el 13/May a las 02:00 UTC, con 42,80%, verificado en el respaldo de la base contra el registro completo desde el 14/Abr. El techo de la serie sigue siendo 45,50%, del 06/May.`,
  'candidates[1].fortes[1]':
    `La PoderData/Aya de hoy lo coloca a 3 puntos en la primera vuelta, 35% frente a 38%, dentro del margen de 2pp, y a 1 punto en la segunda, 44% frente a 45%. Es empate técnico en las dos.`,
  'candidates[1].fortes[2]':
    `La distancia de precio con el líder cayó de 26,95pp a 21,65pp en un solo día, y esta vez se estrechó por arriba, con el líder cediendo.`,
  'candidates[1].fortes[3]':
    `Rechazo en 49%, el mismo nivel del líder, según Poder360. Acudió al TSE este jueves para prohibir el uso del Palacio de la Alvorada en contenido electoral de su adversario, según Folha de S.Paulo y G1.`,
  'candidates[1].fortes[4]':
    `Su propaganda en televisión destacará el endeudamiento de las familias, el caso Lulinha y la crisis de Casas Bahia, según Valor Econômico, y cita a su padre, la seguridad pública y un guiño al electorado femenino, según O Globo.`,
  'candidates[1].fracos[0]':
    `En el contrato de segundo lugar de la primera vuelta cedió 3,00pp, de 87,50% a 84,50%. Es la segunda mayor variación del panel hoy, y ocurrió el mismo día en que un nombre nuevo pasó a tener precio en ese contrato.`,
  'candidates[1].fracos[1]':
    `Su alza en el contrato de ganador fue de 0,30pp. La distancia con el líder se acortó 5,30pp en el día, y 5,00pp de eso vinieron de la caída del otro lado, no de su subida.`,
  'candidates[1].fracos[2]':
    `⚠️ El caso Dark Horse avanzó contra él en tres frentes este jueves: la productora pidió a André Mendonça que saque la investigación de São Paulo y lleve el caso al STF, según G1, Folha de S.Paulo y Valor Econômico; Flavio Dino amplió el acceso de la PF a las pruebas, según G1; y él tercerizó la rendición de cuentas, con la transferencia de un fondo de Estados Unidos todavía sin detallar, según Folha de S.Paulo.`,
  'candidates[1].fracos[3]':
    `La distribuidora decidió estrenar la película después de la elección, según O Globo, y militantes del PT pidieron una investigación sobre la relación entre su oficina y un objetivo del operativo del INSS, también según O Globo.`,
  'candidates[1].analise':
    `Su precio cerró en 35,85%, el más alto desde el 13/May, y la distancia con el líder es la menor del ciclo reciente, 21,65pp. La lectura precisa es que él no hizo ese acortamiento solo: subió 0,30pp en un día en que el líder cedió 5,00pp. En la urna, PoderData/Aya lo pone a 3 puntos en la primera vuelta y a 1 punto en la segunda, ambos dentro del margen de 2pp, y el rechazo de los dos está igualado en 49%. En el contrato de segundo lugar de la primera vuelta, sin embargo, cedió 3,00pp, hasta 84,50%, y eso ocurrió el mismo día en que el contrato de Augusto Cury en ese libro pasó a valer 4,00%: la probabilidad que entra en un nombre nuevo sale de algún lado, y salió principalmente del suyo. En el noticiero, el caso Dark Horse avanzó por decisión judicial y por el pedido de la productora de llevar la indagación al STF, y la rendición de cuentas sigue sin el detalle de la transferencia externa. El panel registra el alza en el contrato de ganador, la caída en el de segundo lugar y el avance del caso lado a lado, en la misma fecha, y no decide cuál explica qué. ${S}.`,
  'candidates[2].header':
    `PRECIO: 1,65% (vol USD 11,63M acumulado), ${S}. Caída de 1,10pp y el PISO de toda la serie: ninguno de los 346 puntos registrados desde el 14/Abr quedó por debajo de esto.`,
  'candidates[2].fortes[0]':
    `La PoderData/Aya de hoy lo mide en 4% en la primera vuelta, igualado con Ronaldo Caiado y con Augusto Cury, y en 37% en la segunda contra el líder. En la urna está donde estaba en las rondas anteriores.`,
  'candidates[2].fortes[1]':
    `Sigue siendo el nombre más caro del contrato de tercer lugar de la primera vuelta, con 36,50%, por delante de Ronaldo Caiado y de Augusto Cury.`,
  'candidates[2].fortes[2]':
    `El volumen acumulado en su contrato de ganador, USD 11,63M, es uno de los mayores del libro presidencial, detrás solo de nombres cuyo precio está pegado al cero.`,
  'candidates[2].fortes[3]':
    `Fue entrevistado en el Jornal Nacional este jueves, en la serie de entrevistas de la emisora con los presidenciables, según BBC.`,
  'candidates[2].fracos[0]':
    `⚠️ 1,65% es el PISO ABSOLUTO de su serie. Ninguno de los 346 puntos registrados desde el 14/Abr quedó por debajo de eso, y la caída viene en línea recta: 3,10% el 25/Ago, 3,00% el 26/Ago, 2,70% en la madrugada de este jueves y 1,65% ahora. El techo de la serie es 49,60%, del 28/Abr.`,
  'candidates[2].fracos[1]':
    `⚠️ En el contrato de tercer lugar de la primera vuelta cedió 9,00pp, de 45,50% a 36,50%, la mayor variación aislada del panel hoy. Es su nivel más bajo en ese contrato desde el 27/May.`,
  'candidates[2].fracos[2]':
    `En el contrato de segundo lugar de la primera vuelta cedió 0,50pp y quedó en 1,50%, detrás del 4,00% del nombre que pasó a tener precio este jueves.`,
  'candidates[2].fracos[3]':
    `En la entrevista del Jornal Nacional dijo que va a adoptar un régimen de excepción en las favelas y defendió que Brasil tenga bomba atómica, según Folha de S.Paulo. Un análisis de CartaCapital le dio una nota de 2,6, señalando una postura fluida y propuestas autoritarias.`,
  'candidates[2].analise':
    `Su contrato de ganador registró hoy el menor precio de toda la serie: 1,65%, sin ninguno de los 346 puntos desde el 14/Abr por debajo de eso. La caída no es de un día, es de una secuencia, y bajó de 3,10% el 25/Ago a 1,65% ahora sin ningún repunte. En el contrato de tercer lugar de la primera vuelta la pérdida fue mayor todavía, 9,00pp, de 45,50% a 36,50%, su nivel más bajo en ese contrato desde el 27/May, y aun así sigue siendo el nombre más caro allí. En la urna la lectura es otra: PoderData/Aya lo mide en 4%, igualado con Caiado y con Cury, exactamente donde estaba en las rondas anteriores. La distancia entre las dos mediciones es lo que el panel existe para mostrar, y no se resuelve por promedio. El mismo día fue al Jornal Nacional y defendió un régimen de excepción en las favelas y el armamento nuclear. El panel registra las dos cosas en la misma fecha y no atribuye causa. ${S}.`,
  'candidates[3].header':
    `PRECIO: Ronaldo Caiado 0,15% (vol USD 6,80M acumulado), Romeu Zema 0,05% (vol USD 6,13M acumulado) y Fernando Haddad 0,05% (vol USD 7,30M acumulado) en el contrato de ganador, ${S}. Los tres por debajo del piso de 0,5% de la doble lectura.`,
  'candidates[3].subtitle':
    `Pelotón de atrás en la ${S}. Los tres están por debajo del piso de 0,5% en que la doble lectura distingue movimiento de ruido, así que ninguna variación de ellos es tratada como señal por el panel. ⭐ Y este jueves el pelotón ganó un cuarto nombre: Polymarket abrió contratos para Augusto Cury, que aparece con 23,50% en el de tercer lugar de la primera vuelta y 4,00% en el de segundo.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,15% (vol USD 6,80M acumulado, ${S}), con caída de 0,30pp. En el contrato de tercer lugar de la primera vuelta cedió 5,50pp y tiene 33,50%, su nivel más bajo allí desde el 14/Ago.`,
  'candidates[3].caiado.fortes':
    `La PoderData/Aya de hoy lo mide en 4% en la primera vuelta, igualado con Renan Santos y con Augusto Cury, y lo coloca en EMPATE TÉCNICO con el líder en la segunda, por 43% a 44%, dentro del margen de 2pp. Es el segundo escenario de segunda vuelta más ajustado de la ronda, detrás solo del de Flávio Bolsonaro. Sigue siendo el segundo nombre más caro del contrato de tercer lugar de la primera vuelta.`,
  'candidates[3].caiado.fracos':
    `Cedió en los dos contratos en que se lo acompaña: 0,30pp en el de ganador, lo que lo lleva a 0,15% y por debajo del piso de vigilancia, y 5,50pp en el de tercer lugar de la primera vuelta. Indexa del 26/Ago lo medía en 5% y Gerp en 3%, y las tres casas de la semana discrepan sobre su tamaño.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,05% (vol USD 6,13M acumulado, ${S}), con caída de 0,10pp.`,
  'candidates[3].zema.fortes':
    `PoderData/Aya lo coloca en EMPATE TÉCNICO con el líder en la segunda vuelta, por 43% a 44%, el mismo escenario de Ronaldo Caiado. Sigue siendo probado por las nacionales, a diferencia de Tarcísio y Haddad, y la misma ronda lo mide en 2% en la primera vuelta.`,
  'candidates[3].zema.fracos':
    `Cedió 0,10pp en el contrato de ganador y quedó en 0,05%, pegado al cero y por debajo del piso de vigilancia. En la urna, Gerp e Indexa del 26/Ago lo medían en 1% cada una y BTG/Nexus del 24/Ago en 3%, así que el 2% de hoy queda en el medio de esa amplitud.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,30M acumulado, ${S}), sin variación.`,
  'candidates[3].haddad.fortes':
    `Sigue sin ser probado en la primera vuelta por ninguna nacional, lo que lo mantiene fuera del grafo de divergencia, a propósito. La encuesta de JOTA divulgada el 26/Ago (BR-07806/2026, 6.000 entrevistas por internet, campo del 27/Jul al 24/Ago) declaró un escenario de segunda vuelta con él en el lugar del líder contra Flávio Bolsonaro.`,
  'candidates[3].haddad.fracos':
    `Los porcentajes del escenario de JOTA no salieron en una fuente que el panel alcance, y por eso nada de él fue a la tabla. Su contrato de ganador está en 0,05% desde hace semanas, con USD 7,30M de volumen acumulado: volumen alto con precio pegado al cero es posición antigua desarmada, no contrato activo.`,
  'candidates[3].fortes[0]':
    `⭐ AUGUSTO CURY (Avante) PASÓ A TENER PRECIO ESTE JUEVES. Sus contratos se abrieron en el libro presidencial a las 00:30 UTC, y ya es el tercer nombre más caro del contrato de tercer lugar de la primera vuelta, con 23,50%, detrás solo de Renan Santos y de Ronaldo Caiado. En el de segundo lugar marca 4,00%, por delante de Renan Santos.`,
  'candidates[3].fortes[1]':
    `En la urna, la PoderData/Aya de hoy mide a Cury en 4% en la primera vuelta, igualado con Renan Santos y con Ronaldo Caiado. Son sus 4% más altos en toda la tabla del panel, que reúne las nacionales de los últimos 30 días y lo medía entre 1% y 3% hasta ahora.`,
  'candidates[3].fortes[2]':
    `Fue el presidenciable más buscado en Google durante el debate y el de mayor crecimiento de seguidores y de búsquedas, según CNN Brasil y Pleno.News, y ganó 2 millones de seguidores, según SpaceMoney. Es candidato del ${G('Avante', 'avante')}, oficializado en convención el 03/Ago, con Júlio Delgado como vicepresidente.`,
  'candidates[3].fortes[3]':
    `Ronaldo Caiado y Romeu Zema empatan técnicamente con el líder en la segunda vuelta de PoderData, por 43% a 44% cada uno, ambos dentro del margen de 2pp.`,
  'candidates[3].fracos[0]': `⚠️ ${CURY}`,
  'candidates[3].fracos[1]':
    `Ronaldo Caiado cedió 0,30pp en el contrato de ganador y quedó en 0,15%, por debajo del piso de 0,5% de la doble lectura, y cedió 5,50pp en el de tercer lugar de la primera vuelta.`,
  'candidates[3].fracos[2]':
    `Romeu Zema cedió 0,10pp y quedó en 0,05% en el contrato de ganador, también por debajo del piso de vigilancia.`,
  'candidates[3].fracos[3]':
    `La tercera vía sigue medida en la urna y casi sin precio en el contrato de ganador: los nombres de ella con precio confirmado suman menos de medio punto, frente a 93,35% de los dos primeros.`,
  'candidates[3].analise':
    `La novedad estructural del día está aquí. Polymarket abrió contratos para Augusto Cury este jueves, a las 00:30 UTC, y el mercado ya formó precio sobre DÓNDE llega: 23,50% para terminar tercero en la primera vuelta, lo que lo coloca detrás solo de Renan Santos y de Ronaldo Caiado, y 4,00% para terminar segundo. ${CURY} En la urna no es un nombre nuevo: PoderData/Aya lo mide en 4% en la primera vuelta, igualado con los otros dos nombres de la tercera vía, y esos 4% son su mayor número en toda la tabla del panel, que lo medía entre 1% y 3% hasta ahora. Caiado y Zema siguen el camino opuesto, cediendo en el contrato de ganador, y Caiado cedió 5,50pp también en el de tercer lugar. PoderData coloca a los dos en empate técnico con el líder en la segunda vuelta, 43% frente a 44% cada uno, y esa es la distancia entre las dos mediciones que el panel existe para mostrar: en la urna empatan en la segunda vuelta, y en el precio de ganador los dos sumados no llegan a medio punto. ${S}.`,
  'quadroComparativo[0].p':
    `La PoderData/Aya de hoy lo da en 38% en la primera vuelta, adelante por 3 puntos, y ganando los cuatro escenarios de segunda vuelta probados, el más ajustado de ellos por 45% a 44%. Gerp del 26/Ago lo daba en 37% e Indexa en 39%. BTG/Nexus del 24/Ago, que alimenta el número de este bloque, lo mantiene en 41%.`,
  'quadroComparativo[0].m':
    `57,50% (vol USD 9,27M), ${S}. Caída de 5,00pp, la mayor variación del panel en el contrato de ganador, y el nivel más bajo desde el 01/Jul.`,
  'quadroComparativo[0].t': `cede 5,00pp en cinco lecturas sucesivas y vuelve al nivel del 01/Jul`,
  'quadroComparativo[0].s':
    `Fue a la entrevista del Jornal Nacional, llamó ilaciones a las acusaciones sobre su hijo y negó haberlo blindado. La PF indaga el pedido de un lobista para que el hijo actuara en favor del llamado Careca do INSS.`,
  'quadroComparativo[1].p':
    `PoderData/Aya lo da en 35% en la primera vuelta, a 3 puntos, y en 44% en la segunda, a 1 punto. Los dos dentro del margen de 2pp. Gerp del 26/Ago lo daba adelante con 38% e Indexa atrás con 34%.`,
  'quadroComparativo[1].m':
    `35,85% (vol USD 9,10M), ${S}. Alza de 0,30pp y su nivel más alto desde el 13/May. En el contrato de segundo lugar cedió 3,00pp, hasta 84,50%.`,
  'quadroComparativo[1].t': `el precio más alto desde el 13/May, y la distancia con el líder se estrechó por arriba`,
  'quadroComparativo[1].s':
    `Acudió al TSE para prohibir el uso del Palacio de la Alvorada en contenido electoral de su adversario. La productora de Dark Horse pidió a Mendonça que lleve el caso al STF, y Dino amplió el acceso de la PF a las pruebas.`,
  'quadroComparativo[2].p':
    `La PoderData/Aya de hoy lo mide en 4% en la primera vuelta, igualado con Renan Santos y con Ronaldo Caiado, y es su mayor número en toda la tabla del panel. Candidato del Avante, oficializado en convención el 03/Ago.`,
  'quadroComparativo[2].m':
    `23,50% (vol USD 33 mil) en el contrato de tercer lugar de la primera vuelta y 4,00% en el de segundo, ${S}. Sus contratos se abrieron este jueves, a las 00:30 UTC. El de ganador todavía no tiene precio confirmado.`,
  'quadroComparativo[2].t': `nombre nuevo en el libro, y el mercado ya formó precio sobre dónde llega`,
  'quadroComparativo[2].s':
    `Fue el presidenciable más buscado en Google durante el debate y el de mayor crecimiento de seguidores, según CNN Brasil y Pleno.News.`,
  'quadroComparativo[3].p':
    `PoderData/Aya lo da en 4% en la primera vuelta, igualado con Caiado y con Cury, y en 37% en la segunda contra el líder. Gerp del 26/Ago lo daba en 3% e Indexa en 4%.`,
  'quadroComparativo[3].m':
    `1,65% (vol USD 11,63M), ${S}. Caída de 1,10pp y el PISO de toda la serie: ninguno de los 346 puntos desde el 14/Abr quedó por debajo de esto. En el contrato de tercer lugar cedió 9,00pp, hasta 36,50%, la mayor variación aislada del panel hoy.`,
  'quadroComparativo[3].t': `el piso de toda la serie en el contrato de ganador`,
  'quadroComparativo[3].s':
    `Fue al Jornal Nacional, dijo que va a adoptar un régimen de excepción en las favelas y defendió que Brasil tenga bomba atómica.`,
  'quadroComparativo[4].p':
    `PoderData/Aya lo da en 4% en la primera vuelta, igualado con Renan Santos y con Cury, y en empate técnico con el líder en la segunda, por 43% a 44%.`,
  'quadroComparativo[4].m':
    `0,15% (vol USD 6,80M), ${S}. Caída de 0,30pp, por debajo del piso de 0,5% de la doble lectura. En el contrato de tercer lugar cedió 5,50pp, hasta 33,50%, su nivel más bajo allí desde el 14/Ago.`,
  'quadroComparativo[4].t': `cede en los dos contratos y queda por debajo del piso de vigilancia en el de ganador`,
  'quadroComparativo[4].s':
    `La víspera defendió la posibilidad de juicio político a ministros del STF y pidió el levantamiento del secreto de los casos Master, INSS y Carbono Oculto.`,
  'quadroComparativo[5].p':
    `PoderData/Aya lo mide en 3% en la primera vuelta. Gerp del 26/Ago lo daba en 4% e Indexa en 2%, y sigue siendo el nombre con mayor divergencia relativa entre institutos en la ventana.`,
  'quadroComparativo[5].m': `0,15% (vol USD 3,03M), ${S}. Sin variación, y por debajo del piso de 0,5% de la doble lectura.`,
  'quadroComparativo[5].s': `No aparece en el noticiero de este jueves entre los nombres con hecho propio.`,
  'quadroComparativo[6].m': `3,40% (vol USD 84 mil), ${S}. Sin variación en el día, y es el cuarto día consecutivo en el mismo nivel.`,
  'quadroComparativo[6].t': `estancado por cuarto día`,
  'quadroComparativo[6].s':
    `El enfrentamiento entre André Mendonça y la dirección de la PF en la investigación sobre el hijo del presidente es el hecho del tribunal este jueves. La productora de Dark Horse pidió que la indagación vaya al STF, y Dino amplió el acceso de la PF a las pruebas.`,
  cruzamento:
    `El 27 de agosto tiene un hecho de urna y tres de mercado, y todos cayeron en la misma fecha. En la urna, PoderData/Aya (BR-04974/2026, campo del 23 al 26/Ago, n=2.400, teléfono) trajo empate técnico en las DOS vueltas: 38% a 35% en la primera y 45% a 44% en la segunda, ambos dentro del margen de 2pp. La comparación que vale aquí es con la propia casa, porque método y muestra son los mismos: el 13/Ago medía 41% a 35% en la primera vuelta, seis puntos, y ahora mide tres. La segunda vuelta estaba en un punto y sigue en uno. La misma ronda da empate técnico del líder también contra Romeu Zema y contra Ronaldo Caiado, por 44% a 43% en cada uno, y ventaja de siete puntos sobre Renan Santos. Rechazo igualado en 49% para los dos primeros, y aprobación del gobierno en 42% frente a 50% de desaprobación. En el precio, la lectura confirmada de este jueves trae al líder en 57,50%, con caída de 5,00pp en el día. La caída fue continua, en cinco lecturas sucesivas, y llevó el contrato a su nivel más bajo desde el 01/Jul: la última lectura por debajo de eso fue el 30/Jun a las 16:30 UTC, con 55,50%, verificado en el respaldo de la base contra el registro completo desde el 14/Abr. El segundo subió 0,30pp, hasta 35,85%, su nivel más alto desde el 13/May. La distancia entre ambos cayó de 26,95pp a 21,65pp, y se estrechó por arriba: 5,00pp de los 5,30pp vinieron de la caída del primero. ⚠️ El panel NO llama a eso la distancia más estrecha de nada, porque no lo es: 387 de los 691 puntos de la serie están por debajo de 21,65pp, y en mayo el segundo estuvo por delante del primero, con la distancia llegando a menos 8,00pp el 06/May. El segundo hecho de mercado es estructural: Polymarket abrió contratos para Augusto Cury este jueves, a las 00:30 UTC, y el mercado ya formó precio sobre dónde llega, con 23,50% para terminar tercero en la primera vuelta y 4,00% para terminar segundo. ${CURY} En la urna no es un nombre nuevo, porque PoderData lo mide en 4%, igualado con los otros dos de la tercera vía, y esos 4% son su mayor número en toda la tabla del panel, que lo medía entre 1% y 3% hasta ahora. El tercer hecho es un piso, y vino acompañado de la mayor variación del día: Renan Santos cerró el contrato de ganador en 1,65%, y ninguno de los 346 puntos de su serie desde el 14/Abr quedó por debajo de eso, mientras que en el contrato de tercer lugar cedió 9,00pp, hasta 36,50%. Ronaldo Caiado cedió 5,50pp en ese mismo contrato, hasta 33,50%, y Flávio Bolsonaro cedió 3,00pp en el de segundo lugar, hasta 84,50%. Los tres perdieron probabilidad en los contratos de posición el mismo día en que un cuarto nombre pasó a tener precio en ellos, y el panel registra la simultaneidad sin afirmar transferencia. En el noticiero, Daniel Vorcaro declaró ante la Policía Federal este jueves por videoconferencia, en la investigación sobre la actuación de exdirectores del Banco Central en favor del Master; el caso Dark Horse tuvo el pedido de la productora de ir al STF y la ampliación del acceso de la PF a las pruebas; y el caso Lulinha ganó frentes en la PF, en el Congreso y en el Ministerio Público de España. Todos esos hechos son de la misma fecha, y el panel registra la coincidencia sin atribuir causa. Probabilidad de ganar e intención de voto miden cosas distintas, y el panel no resta una de la otra. ${S}.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'es', {
  'polls[0].note':
    `Encuesta nacional PoderData/Aya publicada el 27/Ago (Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL, CartaCapital, Jornal de Brasília, Pleno.News). Primera vuelta Lula 38% x Flávio 35%, distancia de 3pp, empate técnico por el margen de 2pp; Renan Santos, Ronaldo Caiado y Augusto Cury con 4% cada uno, Pablo Marçal 3% y Romeu Zema 2%. Segunda vuelta Lula 45% x Flávio 44%, también empate técnico. Campo del 23 al 26/Ago, n=2.400, telefónico en 555 municipios de las 27 unidades federativas, margen 2pp, 95% de confianza, registro BR-04974/2026. ⭐ LA COMPARACIÓN QUE VALE ES CON LA PROPIA CASA, Y MUESTRA LA PRIMERA VUELTA ESTRECHÁNDOSE A LA MITAD: eran 6pp el 16/Jul (40% x 34%), 6pp el 30/Jul (41% x 35%), 6pp el 13/Ago (41% x 35%) y son 3pp ahora (38% x 35%). La segunda vuelta sigue en 1pp, como el 13/Ago. Misma casa, mismo método y misma muestra, con la primera vuelta estrechándose y la segunda estancada, lo inverso de lo que la serie de la casa venía mostrando. RECHAZO igualado en 49% para cada uno (Poder360). La misma ronda da empate técnico del líder contra Romeu Zema (44% x 43%) y contra Ronaldo Caiado (44% x 43%), y ventaja de 7 puntos sobre Renan Santos (44% x 37%). ⭐ Y el 4% de Augusto Cury es su mayor número en toda la tabla del panel, que reúne las nacionales de los últimos 30 días y lo medía entre 1% y 3% hasta ahora. APROBACIÓN del gobierno en 42% frente a 50% de desaprobación, y la gestión es mala o pésima para 48% frente a buena o muy buena para 33% (CNN Brasil). ALCANCE NACIONAL confirmado en la divulgación, que declara 555 municipios en las 27 unidades federativas.`,
  'polls[0].source':
    `PoderData/Aya, publicada el 27/Ago por Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL Notícias, CartaCapital, Jornal de Brasília y Pleno.News. Registro TSE BR-04974/2026.`,
  'approvalData.note':
    `🏷️ LOS NÚMEROS ESTRUCTURADOS DE ESTE BLOQUE SON DE GENIAL/QUAEST DEL 14/Ago, y son estos: 46% de aprobación frente a 48% de desaprobación, con 6% de no sabe, y 36% de bueno o muy bueno, 25% de regular y 37% de malo o pésimo. El panel mantiene UNA casa por bloque a propósito, para no sumar reglas de institutos distintos. ⭐ LECTURA NUEVA EL 27/Ago, declarada aquí y NO mezclada arriba: PoderData/Aya trae 42% de aprobación frente a 50% de desaprobación, y la gestión es mala o pésima para 48% frente a buena o muy buena para 33%, según Poder360 y CNN Brasil. 📌 Las tres lecturas anteriores de la semana: Indexa/Broadcast del 26/Ago con 46% frente a 50%, según Estadão y CNN Brasil; Gerp del 26/Ago con 43% frente a 51%, según CNN Brasil y Diário de São Paulo; y BTG/Nexus del 24/Ago con 48% frente a 49%, y 35% de bueno o muy bueno frente a 43% de malo o pésimo. ⚠️ LAS CUATRO CASAS COINCIDEN EN EL SIGNO Y DISCREPAN EN EL TAMAÑO: la desaprobación va de 49% a 51% y la aprobación de 42% a 48%, o sea seis puntos de amplitud entre institutos sobre la misma pregunta en la misma semana. El panel no promedia entre ellas.`,
  'polymarketComparison.note':
    `Precios de Polymarket en la ${S}, con el libro presidencial en USD 137,47M. ⭐ EL DÍA TIENE UNA ENCUESTA NUEVA Y UN NOMBRE NUEVO EN EL LIBRO. PoderData/Aya (BR-04974/2026, campo del 23 al 26/Ago, n=2.400) trae empate técnico en las DOS vueltas, 38% a 35% en la primera y 45% a 44% en la segunda, y la comparación con la propia casa muestra la primera vuelta estrechándose de 6pp a 3pp en dos semanas. En el precio, el líder cedió 5,00pp y bajó a 57,50%, su nivel más bajo desde el 01/Jul, con la caída llegando en cinco lecturas sucesivas a lo largo del día; el segundo subió 0,30pp, hasta 35,85%, su nivel más alto desde el 13/May. La distancia entre ambos cayó de 26,95pp a 21,65pp y se estrechó por arriba. ⚠️ Eso NO es la distancia más estrecha de nada: 387 de los 691 puntos de la serie están por debajo de eso, y en mayo el segundo estuvo por delante del primero. ⭐ El mayor movimiento del día está en los contratos de POSICIÓN: Renan Santos cedió 9,00pp en el de tercer lugar de la primera vuelta, hasta 36,50%, y marcó también el piso de toda su serie en el de ganador, con 1,65%; Ronaldo Caiado cedió 5,50pp en ese mismo contrato, hasta 33,50%; y Flávio Bolsonaro cedió 3,00pp en el de segundo lugar, hasta 84,50%. El mismo día Polymarket abrió contratos para Augusto Cury, que aparece con 23,50% en el de tercer lugar y 4,00% en el de segundo. ${CURY} Por eso todavía no tiene línea propia en este bloque, que carga el precio de ganador.`,
  'polymarketComparison.sources':
    `Precios de Polymarket vía el proxy AFOS, y el panel solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp. La confirmación se hace contrato por contrato. El 27/Ago hay lectura confirmada nueva para el libro presidencial, para los contratos de segundo y de tercer lugar de la primera vuelta, para el de juicio político en el STF y para el del Senado. ${CURY} Encuestas registradas en el TSE y divulgadas por los institutos, con reporte de Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL, CartaCapital, G1, Folha de S.Paulo, O Globo, Estadão, Valor Econômico, VEJA, BBC y Jornal de Brasília. La PoderData/Aya del 27/Ago fue verificada en dos fuentes, con el número de registro del TSE coincidiendo y con el alcance nacional confirmado en la divulgación, que declara 555 municipios en las 27 unidades federativas. Superlativo de serie verificado en el respaldo de Neon, en backup/neon/marketPrice, que guarda el registro completo desde el 14/Abr.`,
  'polymarketComparison.candidates[0].polymarket': `57,50%`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `ENCUESTA NUEVA HOY, Y TRAE EMPATE TÉCNICO EN LAS DOS VUELTAS. PoderData/Aya (BR-04974/2026, campo del 23 al 26/Ago, n=2.400) lo da en 38% en la primera vuelta frente a 35%, y en 45% frente a 44% en la segunda, ambos dentro del margen de 2pp. La comparación con la propia casa es lo que informa: eran 6pp en la primera vuelta el 13/Ago y son 3pp ahora. Sigue ganando los cuatro escenarios de segunda vuelta probados. BTG/Nexus del 24/Ago, la nacional de mayor confiabilidad de la ventana, lo mantiene en 41% y es la que alimenta el número de este bloque.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `57,50% (vol USD 9,27M) en la ${S}, con caída de 5,00pp en el día, la mayor variación del panel en el contrato de ganador. La caída fue continua, en cinco lecturas sucesivas. ⚠️ Es el nivel más bajo desde el 01/Jul: la última lectura por debajo de eso fue el 30/Jun a las 16:30 UTC, con 55,50%, verificado en el respaldo contra la serie entera desde el 14/Abr. El techo de la serie sigue siendo 67,50%, del 16/Ago. Su distancia con el segundo cayó a 21,65pp, y se estrechó por arriba.`,
  'polymarketComparison.candidates[1].polymarket': `35,85%`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `La PoderData/Aya de hoy lo da en 35% en la primera vuelta, a 3 puntos, y en 44% en la segunda, a 1 punto, ambos dentro del margen de 2pp. Su rechazo está en 49%, igualado con el del líder. Gerp del 26/Ago lo daba adelante en la primera vuelta con 38% e Indexa/Broadcast lo daba atrás con 34%, y las dos midieron en la misma semana.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `35,85% (vol USD 9,10M) en la ${S}, con alza de 0,30pp. ⭐ Es su nivel más alto desde el 13/May: el último punto por encima de eso fue el 13/May a las 02:00 UTC, con 42,80%, verificado en el respaldo. El techo de la serie sigue siendo 45,50%, del 06/May. La distancia con el líder se acortó 5,30pp en el día, y 5,00pp de eso vinieron de la caída del otro lado. En el contrato de segundo lugar de la primera vuelta cedió 3,00pp, hasta 84,50%.`,
  'polymarketComparison.candidates[2].polymarket': `1,65%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `PoderData/Aya lo mide en 4% en la primera vuelta, igualado con Ronaldo Caiado y con Augusto Cury, y en 37% en la segunda contra el líder. Gerp del 26/Ago lo daba en 3% e Indexa en 4%. En la urna está donde estaba; en el precio, no.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `1,65% (vol USD 11,63M) en la ${S}, con caída de 1,10pp. ⚠️ Es el PISO de toda la serie: ninguno de los 346 puntos registrados desde el 14/Abr quedó por debajo de eso, verificado en el respaldo. El descenso es en línea recta, de 3,10% el 25/Ago a 1,65% ahora, sin repunte. El techo de la serie es 49,60%, del 28/Abr. En el contrato de tercer lugar de la primera vuelta cedió 9,00pp, hasta 36,50%, la mayor variación aislada del panel hoy, y sigue siendo el nombre más caro de ese contrato.`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `PoderData/Aya lo mide en 4% en la primera vuelta, igualado con Renan Santos y con Augusto Cury, y lo coloca en empate técnico con el líder en la segunda, por 43% a 44%. Indexa del 26/Ago lo daba en 5% y Gerp en 3%.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `0,15% (vol USD 6,80M) en la ${S}, con caída de 0,30pp, que lo coloca por debajo del piso de 0,5% de la doble lectura. En el contrato de tercer lugar de la primera vuelta cedió 5,50pp, hasta 33,50%, su nivel más bajo allí desde el 14/Ago.`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `PoderData/Aya lo mide en 3% en la primera vuelta. Gerp del 26/Ago lo daba en 4% e Indexa en 2%, las dos midiendo en la misma semana, y sigue siendo el nombre con mayor divergencia relativa entre institutos en la ventana.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0,15% (vol USD 3,03M) en la ${S}, sin variación, y por debajo del piso de 0,5% de la doble lectura.`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `Ninguna nacional lo prueba para presidente, incluida la PoderData/Aya de hoy. Por eso aparece sin franja de encuesta en este bloque, y el panel no convierte ausencia de prueba en ausencia de intención.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0,05% (vol USD 14,06M) en la ${S}, sin variación. Es el mayor volumen acumulado del libro presidencial, y está por debajo del piso de vigilancia desde hace semanas: volumen alto con precio pegado al cero es posición antigua desarmada, no contrato activo.`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `PoderData/Aya lo mide en 2% en la primera vuelta y lo coloca en empate técnico con el líder en la segunda, por 43% a 44%. Gerp e Indexa del 26/Ago lo medían en 1% cada una, y BTG/Nexus del 24/Ago en 3%.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0,05% (vol USD 6,13M) en la ${S}, con caída de 0,10pp, y por debajo del piso de 0,5% de la doble lectura.`,
  'polymarketComparison.candidates[7].tendenciaPesquisa':
    `Ninguna nacional lo prueba para presidente. La encuesta de JOTA divulgada el 26/Ago declaró un escenario de segunda vuelta con él en el lugar del líder, pero los porcentajes de ese escenario no fueron divulgados en una fuente que el panel alcance, y por eso no entran aquí.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0,05% (vol USD 7,30M) en la ${S}, sin variación.`,
})
