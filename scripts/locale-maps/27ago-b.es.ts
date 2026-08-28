/**
 * Mapa ES do REBASELINE de 27/Ago 22:49 BRT + correção do Vorcaro.
 * Convenções ES: VÍRGULA decimal e PONTO de milhar, igual ao pt-BR.
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const S = 'lectura confirmada del 27/Ago, 22:49 BRT (01:49 UTC del 28/Ago)'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `El libro presidencial acumula USD 137,64M y el precio de esta página es de la ${S}. El día tuvo una encuesta nacional nueva, PoderData/Aya, con ${G('empate técnico', 'empate-tecnico')} en las dos vueltas, y tuvo un nombre NUEVO recibiendo precio en el libro.`,
  'cards.sentimento.text2':
    `En el precio, el líder cedió 5,00pp en el día y quedó en 57,50%, su nivel más bajo desde el 01/Jul. El segundo subió 1,30pp, hasta 36,85%, su nivel más alto desde el 13/May. La distancia entre ambos cayó de 26,95pp a 20,65pp, el mayor estrechamiento en un día desde que el panel acompaña los dos contratos.`,
  'cards.sentimento.text3':
    `El cambio estructural del día es Augusto Cury, que hasta ayer no tenía precio y cerró en 4,05% (vol USD 2,12M) en el contrato de ganador, por delante de Renan Santos. Aparece también con 23,75% en el contrato de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')} y 3,70% en el de segundo. En la urna no es novedad: PoderData lo mide en 4%, igualado con Renan Santos y con Ronaldo Caiado.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro en 36,85% (vol USD 9,11M) en el presidencial, alza de 1,30pp, y su nivel más alto desde el 13/May: el último punto por encima de eso fue el 13/May a las 02:00 UTC, con 42,80%, verificado en el respaldo contra el registro completo desde el 14/Abr. En la urna, PoderData lo coloca a 3 puntos en la primera vuelta, 35% frente a 38%, y a 1 punto en la ${G('segunda vuelta', 'segundo-turno')}, 44% frente a 45%, ambos dentro del margen de 2pp, con un rechazo de 49%, igualado con el del líder.`,
  'cards.sentimento.esquerda':
    `Lula en 57,50% (vol USD 9,30M), caída de 5,00pp y su nivel más bajo desde el 01/Jul. En la urna, PoderData lo mide en 38% en la primera vuelta, frente al 41% de la propia casa el 13/Ago, y lo mantiene adelante en los cuatro escenarios de segunda vuelta probados. La aprobación del gobierno aparece en 42% frente a 50% de desaprobación en la misma ronda, y la gestión es mala o pésima para 48% frente a buena o muy buena para 33%.`,
  'cards.sentimento.terceiraVia':
    `Aquí está la novedad del día, y tiene dos mitades. Augusto Cury pasó a tener precio y cerró en 4,05% (vol USD 2,12M), el tercero mayor del libro. Y Renan Santos, que había tocado el piso de toda su serie en la captura de las 21:46, con 1,65%, volvió a 2,35% (vol USD 11,65M) una hora después. Ronaldo Caiado quedó en 0,15% (vol USD 6,80M) y Romeu Zema en 0,15% (vol USD 6,21M). En la urna PoderData da 4% a Cury, Renan y Caiado, igualados, y coloca a Caiado y a Zema en empate técnico con el líder en la segunda vuelta, por 43% a 44% cada uno.`,
  'cards.sentimento.polymarket':
    `Precios de la ${S}. El AFOS solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp, y la confirmación se hace contrato por contrato. En esta lectura los cinco libros acompañados confirmaron, incluido el contrato de Augusto Cury, que se abrió este jueves. Los nombres por debajo de 0,5% quedan fuera de esa vigilancia, porque en un libro delgado la oscilación no distingue movimiento de ruido.`,
  'cards.bancoMaster.text1':
    `⭐ EL HECHO NUEVO DEL 27/Ago ES QUE LA DECLARACIÓN NO OCURRIÓ, POR SEGUNDA VEZ. La audiencia de Daniel Vorcaro estaba fijada para las 10h de este jueves, por videoconferencia desde la unidad donde está preso, y fue aplazada por inestabilidad de conexión, según CNN Brasil y Gazeta do Povo. La defensa informó que aguardó el restablecimiento de la señal y que no fue posible realizar la audiencia.`,
  'cards.bancoMaster.text2':
    `⚠️ Es el segundo aplazamiento de la misma declaración. El primero fue el 20/Ago, a pedido de la defensa, que todavía no tenía acceso completo al material de la investigación; este fue técnico. La nueva fecha es el viernes, 28/Ago, y la Policía Federal no confirmó horario, según CNN Brasil.`,
  'cards.bancoMaster.text3':
    `El objeto de la investigación no cambió: la actuación de dos exdirectores de supervisión del Banco Central en favor del ${G('Master', 'banco-master')} mientras la institución enfrentaba una crisis de liquidez. El mismo día, una agencia de viajes confirmó a la ${G('PF', 'pf')} un pago de USD 38 mil hecho por Vorcaro para un itinerario guiado en Disney a un exdirector del Banco Central, según O Globo.`,
  'cards.bancoMaster.conclusao':
    `⭐ Y AQUÍ ESTÁ EL CRUCE DEL DÍA. El acto de investigación no ocurrió, pero el caso entró en la campaña por otro camino: la propaganda de Lula pasó a circular en las redes con el audio en que Flávio Bolsonaro llama hermano a Vorcaro al pedirle dinero, según Estadão y Terra. El audio no es nuevo, fue revelado en mayo por Intercept Brasil, y el senador afirmó entonces que los aportes financiaron la película Dark Horse. Lo nuevo es el uso electoral. El mismo día su precio subió 1,30pp, hasta el nivel más alto desde el 13/May. El panel registra ambas cosas en la misma fecha y no decide cuál explica a la otra.`,
  'cards.stf.analise':
    `El contrato de salida de un ministro del Supremo por juicio político antes de 2027 está en 3,40% (vol USD 84 mil), sin variación en la ${S}. Es el cuarto día consecutivo en el mismo nivel. Este jueves el tribunal apareció en el centro de las dos mayores disputas de la campaña, por competencia y por acceso a pruebas, y aun así el precio no se movió. El mercado de ese contrato es pequeño, con un volumen acumulado de 84 mil dólares, así que el panel no trata la ausencia de movimiento como respuesta a nada: la trata como ausencia de negocio.`,
})

construir('analysis-criteriosa', 'es', {
  subtitle:
    `Cruce del 27 de agosto de 2026: precio de Polymarket en ${S}, libro presidencial en USD 137,64M, contra la PoderData/Aya divulgada este jueves (BR-04974/2026, campo del 23 al 26/Ago, n=2.400), que trae EMPATE TÉCNICO en las dos vueltas, y contra Gerp e Indexa/Broadcast del 26/Ago, que se contradicen entre sí. BTG/Nexus del 24/Ago (BR-09028/2026, n=2.006) sigue siendo la de mayor confiabilidad de la ventana en la regla de la casa. Noticias revisadas en 1.152 ítems recogidos este jueves.`,
  'candidates[0].header':
    `PRECIO: 57,50% (vol USD 9,30M acumulado), ${S}. Caída de 5,00pp en el día, la mayor variación del panel en el contrato de ganador, y el nivel más bajo desde el 01/Jul.`,
  'candidates[0].fortes[2]':
    `Aun después de la caída, su precio sigue siendo el mayor del libro por amplio margen, y el segundo está 20,65pp atrás.`,
  'candidates[0].analise':
    `El día invierte el dibujo de la víspera. El 26/Ago su precio estaba estancado y quien se movía era el segundo; este jueves quien se movió fue él, y hacia abajo: 5,00pp en cinco lecturas sucesivas, de 62,50% a 57,50%, el nivel más bajo desde el 01/Jul. El mismo día PoderData/Aya publicó la primera ronda de la propia casa con empate técnico en las dos vueltas, con la primera estrechándose de 6pp a 3pp en dos semanas y la segunda en 1pp. Las dos cosas cayeron en la misma fecha y el panel registra la coincidencia sin atribuir causa, porque probabilidad de ganar e intención de voto miden cosas distintas, y la misma ronda que estrecha la primera vuelta también lo mantiene adelante en los cuatro escenarios de segunda probados. El libro también cambió de composición este jueves, con un nombre que hasta ayer no tenía precio y cerró tercero. Aun así su precio sigue siendo el mayor del libro por amplio margen, y la distancia al segundo, ahora en 20,65pp, sigue siendo la mayor entre dos nombres cualesquiera de la disputa. ${S}.`,
  'candidates[1].header':
    `PRECIO: 36,85% (vol USD 9,11M acumulado), ${S}. Alza de 1,30pp, la mayor del día entre los contratos de ganador, y su nivel más alto desde el 13/May.`,
  'candidates[1].fortes[0]':
    `⭐ 36,85% es su precio más alto desde el 13/May. El último punto por encima de eso fue el 13/May a las 02:00 UTC, con 42,80%, verificado en el respaldo de la base contra el registro completo desde el 14/Abr. El techo de la serie sigue siendo 45,50%, del 06/May.`,
  'candidates[1].fortes[2]':
    `La distancia de precio con el líder cayó de 26,95pp a 20,65pp en un solo día, y se estrechó por los dos lados: el líder cedió 5,00pp y él subió 1,30pp.`,
  'candidates[1].fracos[0]':
    `En el contrato de segundo lugar de la primera vuelta cedió 3,00pp, de 87,50% a 84,50%, el mismo día en que un nombre nuevo pasó a tener precio en ese contrato, con 3,70%.`,
  'candidates[1].fracos[1]':
    `Su alza en el contrato de ganador fue de 1,30pp y la caída del líder fue de 5,00pp: de los 6,30pp que la distancia se acortó, la mayor parte vino del otro lado.`,
  'candidates[1].analise':
    `Su precio cerró en 36,85%, el más alto desde el 13/May, y la distancia con el líder es la menor del ciclo reciente, 20,65pp. Esta vez él participó del acortamiento: subió 1,30pp, la mayor alza del día entre los contratos de ganador, en un día en que el líder cedió 5,00pp. En la urna, PoderData/Aya lo pone a 3 puntos en la primera vuelta y a 1 punto en la segunda, ambos dentro del margen de 2pp, y el rechazo de los dos está igualado en 49%. En el contrato de segundo lugar de la primera vuelta, sin embargo, cedió 3,00pp, hasta 84,50%, el mismo día en que el contrato de Augusto Cury en ese libro pasó a valer 3,70%. En el noticiero, el caso Dark Horse avanzó por decisión judicial y por el pedido de la productora de llevar la indagación al STF, y la propaganda de su adversario pasó a circular con el audio en que él llama hermano a Daniel Vorcaro al pedirle dinero. El panel registra el alza de precio y el avance del caso lado a lado, en la misma fecha, y no decide cuál explica qué. ${S}.`,
  'candidates[2].header':
    `PRECIO: 2,35% (vol USD 11,65M acumulado), ${S}. El contrato TOCÓ el piso de toda su serie este jueves, con 1,70% en el registro y 1,65% en la captura de las 21:46, y ya volvió a subir.`,
  'candidates[2].fortes[1]':
    `Sigue siendo el nombre más caro del contrato de tercer lugar de la primera vuelta, con 36,00% (vol USD 207 mil), por delante de Ronaldo Caiado y de Augusto Cury.`,
  'candidates[2].fortes[2]':
    `El volumen acumulado en su contrato de ganador, USD 11,65M, es uno de los mayores del libro presidencial, detrás solo de nombres cuyo precio está pegado al cero.`,
  'candidates[2].fracos[0]':
    `⚠️ El contrato tocó el PISO de toda su serie este jueves. El registro marcó 1,70% en cuatro lecturas seguidas, entre las 19:00 y las 00:00 UTC, y ninguno de los 350 puntos registrados desde el 14/Abr quedó por debajo de eso. El techo de la serie es 49,60%, del 28/Abr.`,
  'candidates[2].fracos[1]':
    `⚠️ En el contrato de tercer lugar de la primera vuelta cedió 9,50pp, de 45,50% a 36,00%, la mayor variación aislada del panel hoy. Es su nivel más bajo en ese contrato desde el 27/May.`,
  'candidates[2].fracos[2]':
    `En el contrato de segundo lugar de la primera vuelta cedió 0,45pp y quedó en 1,55%, detrás del 3,70% del nombre que pasó a tener precio este jueves.`,
  'candidates[2].analise':
    `Su contrato de ganador tocó este jueves el menor precio de toda la serie, con 1,70% en cuatro lecturas seguidas del registro, y ninguno de los 350 puntos desde el 14/Abr quedó por debajo de eso. Una hora después de la captura de las 21:46 ya estaba de vuelta en 2,35%, lo que es una recuperación dentro del día y no una reversión de tendencia: el 25/Ago valía 3,10%. En el contrato de tercer lugar de la primera vuelta la pérdida fue mayor, 9,50pp, de 45,50% a 36,00%, su nivel más bajo en ese contrato desde el 27/May, y aun así sigue siendo el nombre más caro allí. En la urna la lectura es otra: PoderData/Aya lo mide en 4%, igualado con Caiado y con Cury, exactamente donde estaba en las rondas anteriores. La distancia entre las dos mediciones es lo que el panel existe para mostrar, y no se resuelve por promedio. El mismo día fue al Jornal Nacional y defendió un régimen de excepción en las favelas y el armamento nuclear. ${S}.`,
  'candidates[3].header':
    `PRECIO: Augusto Cury 4,05% (vol USD 2,12M acumulado), Ronaldo Caiado 0,15% (vol USD 6,80M acumulado) y Romeu Zema 0,15% (vol USD 6,21M acumulado), ${S}. El primero pasó a tener precio CONFIRMADO este jueves y ya es el tercero mayor del libro.`,
  'candidates[3].subtitle':
    `Pelotón de atrás en la ${S}, y cambió de tamaño este jueves. Augusto Cury entró en el libro y cerró en 4,05%, el tercer precio más alto, mientras Caiado y Zema siguen en 0,15%, por debajo del piso de 0,5% en que la doble lectura distingue movimiento de ruido.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,15% (vol USD 6,80M acumulado, ${S}), con caída de 0,30pp. En el contrato de tercer lugar de la primera vuelta cedió 5,50pp y tiene 33,50% (vol USD 68 mil), su nivel más bajo allí desde el 14/Ago.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,30M acumulado, ${S}), sin variación.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,15% (vol USD 6,21M acumulado, ${S}), sin variación en el día.`,
  'candidates[3].zema.fracos':
    `Sigue en 0,15% en el contrato de ganador, por debajo del piso de vigilancia. En la urna, Gerp e Indexa del 26/Ago lo medían en 1% cada una y BTG/Nexus del 24/Ago en 3%, así que el 2% de PoderData de hoy queda en el medio de esa amplitud.`,
  'candidates[3].fortes[0]':
    `⭐ AUGUSTO CURY (Avante) PASÓ A TENER PRECIO CONFIRMADO ESTE JUEVES. Su contrato abrió a las 00:30 UTC y cerró en 4,05% (vol USD 2,12M), el tercer precio más alto del libro presidencial, por delante de Renan Santos y de Ronaldo Caiado. En el contrato de tercer lugar de la primera vuelta marca 23,75% (vol USD 33 mil) y en el de segundo, 3,70% (vol USD 57 mil).`,
  'candidates[3].fracos[0]':
    `⚠️ Su serie de precio tiene cinco puntos, todos de este jueves, entre 0,80% y 5,00%. En un contrato recién abierto una amplitud así no separa precio de ruido, y el panel no trata ninguno de sus niveles como establecido.`,
  'candidates[3].fracos[2]':
    `Romeu Zema sigue en 0,15% en el contrato de ganador, también por debajo del piso de vigilancia.`,
  'candidates[3].fracos[3]':
    `Caiado y Zema sumados valen 0,30% en el contrato de ganador, frente a 94,35% de los dos primeros. La tercera vía sigue medida en la urna y casi sin precio en el mercado.`,
  'candidates[3].analise':
    `La novedad estructural del día está aquí, y en esta lectura se completó. Augusto Cury, cuyo contrato abrió a las 00:30 UTC y pasó el día sin precio que dos lecturas confirmaran, cerró en 4,05% en la lectura de las 22:49, el tercero mayor del libro presidencial. El mercado también formó precio sobre dónde llega: 23,75% para terminar tercero en la primera vuelta y 3,70% para terminar segundo. En la urna no es un nombre nuevo: PoderData/Aya lo mide en 4% en la primera vuelta, igualado con los otros dos nombres de la tercera vía, y esos 4% son su mayor número en toda la tabla del panel, que lo medía entre 1% y 3% hasta ahora. Caiado y Zema siguen el camino opuesto, en 0,15% cada uno, y PoderData coloca a los dos en empate técnico con el líder en la segunda vuelta, 43% frente a 44% cada uno. Es la distancia entre las dos mediciones que el panel existe para mostrar: en la urna empatan en la segunda vuelta, y en el precio de ganador los dos sumados no llegan a un tercio de punto. ${S}.`,
  'quadroComparativo[0].m':
    `57,50% (vol USD 9,30M), ${S}. Caída de 5,00pp, la mayor variación del panel en el contrato de ganador, y el nivel más bajo desde el 01/Jul.`,
  'quadroComparativo[1].m':
    `36,85% (vol USD 9,11M), ${S}. Alza de 1,30pp, la mayor del día, y su nivel más alto desde el 13/May. En el contrato de segundo lugar cedió 3,00pp, hasta 84,50%.`,
  'quadroComparativo[1].t': `la mayor alza del día, y el nivel más alto desde el 13/May`,
  'quadroComparativo[2].m':
    `4,05% (vol USD 2,12M) en el contrato de ganador, ${S}, el tercer precio más alto del libro. También 23,75% en el de tercer lugar de la primera vuelta y 3,70% en el de segundo. El contrato abrió este jueves, a las 00:30 UTC.`,
  'quadroComparativo[2].t': `nombre nuevo en el libro, y ya tercero en el contrato de ganador`,
  'quadroComparativo[3].m':
    `2,35% (vol USD 11,65M), ${S}. El contrato TOCÓ el piso de toda la serie este jueves, con 1,70% en el registro, y ya volvió a subir. En el de tercer lugar cedió 9,50pp, hasta 36,00%, la mayor variación aislada del panel hoy.`,
  'quadroComparativo[3].t': `tocó el piso de la serie y volvió`,
  'quadroComparativo[4].m':
    `0,15% (vol USD 6,80M), ${S}. Caída de 0,30pp, por debajo del piso de 0,5% de la doble lectura. En el contrato de tercer lugar cedió 5,50pp, hasta 33,50%, su nivel más bajo allí desde el 14/Ago.`,
  'quadroComparativo[5].m': `0,15% (vol USD 3,03M), ${S}. Sin variación, y por debajo del piso de 0,5% de la doble lectura.`,
  'quadroComparativo[6].m': `3,40% (vol USD 84 mil), ${S}. Sin variación en el día, y es el cuarto día consecutivo en el mismo nivel.`,
  cruzamento:
    `El 27 de agosto tiene un hecho de urna y tres de mercado, y todos cayeron en la misma fecha. En la urna, PoderData/Aya (BR-04974/2026, campo del 23 al 26/Ago, n=2.400, teléfono) trajo empate técnico en las DOS vueltas: 38% a 35% en la primera y 45% a 44% en la segunda, ambos dentro del margen de 2pp. La comparación que vale aquí es con la propia casa, porque método y muestra son los mismos: el 13/Ago medía 41% a 35% en la primera vuelta, seis puntos, y ahora mide tres. La segunda vuelta estaba en un punto y sigue en uno. La misma ronda da empate técnico del líder también contra Romeu Zema y contra Ronaldo Caiado, por 44% a 43% en cada uno, y ventaja de siete puntos sobre Renan Santos. Rechazo igualado en 49% para los dos primeros, y aprobación del gobierno en 42% frente a 50% de desaprobación. En el precio, la lectura confirmada de las 22:49 trae al líder en 57,50%, con caída de 5,00pp en el día, continua a lo largo de cinco lecturas, y en su nivel más bajo desde el 01/Jul: la última lectura por debajo de eso fue el 30/Jun a las 16:30 UTC, con 55,50%, verificado en el respaldo de la base contra el registro completo desde el 14/Abr. El segundo subió 1,30pp, hasta 36,85%, la mayor alza del día y su nivel más alto desde el 13/May. La distancia entre ambos cayó de 26,95pp a 20,65pp, y esta vez se estrechó por los dos lados. ⚠️ El panel NO llama a eso la distancia más estrecha de nada, porque no lo es: en mayo el segundo estuvo por delante del primero, con la distancia llegando a menos 8,00pp el 06/May. El segundo hecho de mercado es estructural: Augusto Cury, cuyo contrato abrió a las 00:30 UTC y pasó el día sin precio que dos lecturas confirmaran, cerró en 4,05% y es el tercer precio más alto del libro. El mercado también formó precio sobre dónde llega, con 23,75% para terminar tercero en la primera vuelta y 3,70% para terminar segundo. En la urna no es un nombre nuevo, porque PoderData lo mide en 4%, igualado con los otros dos de la tercera vía, y esos 4% son su mayor número en toda la tabla del panel, que lo medía entre 1% y 3% hasta ahora. El tercer hecho es un piso tocado y deshecho el mismo día: Renan Santos marcó 1,70% en el registro, el menor de toda su serie de 350 puntos desde el 14/Abr, y a las 22:49 ya estaba en 2,35%. En el contrato de tercer lugar cedió 9,50pp, hasta 36,00%, la mayor variación aislada del panel, y Ronaldo Caiado cedió 5,50pp, hasta 33,50%. En el noticiero, la declaración de Daniel Vorcaro ante la Policía Federal fue aplazada por segunda vez, ahora por una falla técnica en la videoconferencia, y reprogramada para el viernes; el caso Dark Horse tuvo el pedido de la productora de ir al STF y la ampliación del acceso de la PF a las pruebas; y la propaganda del primero pasó a circular con el audio en que el segundo llama hermano a Vorcaro al pedirle dinero, audio revelado en mayo por Intercept Brasil. Todos esos hechos son de la misma fecha, y el panel registra la coincidencia sin atribuir causa. Probabilidad de ganar e intención de voto miden cosas distintas, y el panel no resta una de la otra. ${S}.`,
})

construir('polls-data', 'es', {
  'polymarketComparison.note':
    `Precios de Polymarket en la ${S}, con el libro presidencial en USD 137,64M. ⭐ EL DÍA TIENE UNA ENCUESTA NUEVA Y UN NOMBRE NUEVO EN EL LIBRO. PoderData/Aya (BR-04974/2026, campo del 23 al 26/Ago, n=2.400) trae empate técnico en las DOS vueltas, 38% a 35% en la primera y 45% a 44% en la segunda, y la comparación con la propia casa muestra la primera vuelta estrechándose de 6pp a 3pp en dos semanas. En el precio, el líder cedió 5,00pp y bajó a 57,50%, su nivel más bajo desde el 01/Jul, y el segundo subió 1,30pp, hasta 36,85%, su nivel más alto desde el 13/May. La distancia entre ambos cayó de 26,95pp a 20,65pp y se estrechó por los dos lados. ⚠️ Eso NO es la distancia más estrecha de nada: en mayo el segundo estuvo por delante del primero. ⭐ Augusto Cury pasó a tener precio confirmado y cerró en 4,05%, el tercero mayor del libro, con 23,75% en el contrato de tercer lugar de la primera vuelta y 3,70% en el de segundo. Y Renan Santos tocó el piso de toda su serie, con 1,70% en el registro, y ya estaba de vuelta en 2,35% a las 22:49.`,
  'polymarketComparison.sources':
    `Precios de Polymarket vía el proxy AFOS, y el panel solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp. La confirmación se hace contrato por contrato. El 27/Ago los cinco libros acompañados confirmaron en la lectura de las 22:49, incluido el contrato de Augusto Cury, que abrió ese mismo día. Encuestas registradas en el TSE y divulgadas por los institutos, con reporte de Poder360, Gazeta do Povo, CNN Brasil, Exame, UOL, CartaCapital, G1, Folha de S.Paulo, O Globo, Estadão, Valor Econômico, VEJA, BBC y Jornal de Brasília. La PoderData/Aya del 27/Ago fue verificada en dos fuentes, con el número de registro del TSE coincidiendo y con el alcance nacional confirmado en la divulgación, que declara 555 municipios en las 27 unidades federativas. Superlativo de serie verificado en el respaldo de Neon, en backup/neon/marketPrice, que guarda el registro completo desde el 14/Abr.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `57,50% (vol USD 9,30M) en la ${S}, con caída de 5,00pp en el día, la mayor variación del panel en el contrato de ganador. La caída fue continua, en cinco lecturas sucesivas. ⚠️ Es el nivel más bajo desde el 01/Jul: la última lectura por debajo de eso fue el 30/Jun a las 16:30 UTC, con 55,50%, verificado en el respaldo contra la serie entera desde el 14/Abr. El techo de la serie sigue siendo 67,50%, del 16/Ago. Su distancia con el segundo cayó a 20,65pp.`,
  'polymarketComparison.candidates[1].polymarket': `36,85%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `36,85% (vol USD 9,11M) en la ${S}, con alza de 1,30pp, la mayor del día entre los contratos de ganador. ⭐ Es su nivel más alto desde el 13/May: el último punto por encima de eso fue el 13/May a las 02:00 UTC, con 42,80%, verificado en el respaldo. El techo de la serie sigue siendo 45,50%, del 06/May. En el contrato de segundo lugar de la primera vuelta cedió 3,00pp, hasta 84,50%.`,
  'polymarketComparison.candidates[2].polymarket': `4,05%`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `⭐ EL 4% DE LA PoderData/Aya DE HOY ES SU MAYOR NÚMERO EN TODA LA TABLA DEL PANEL, que reúne las nacionales de los últimos 30 días y lo medía entre 1% y 3% hasta ahora. Queda igualado con Renan Santos y con Ronaldo Caiado en la primera vuelta. BTG/Nexus del 24/Ago, que alimenta el número de este bloque, lo medía en 2%.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `4,05% (vol USD 2,12M) en la ${S}. ⭐ EL CONTRATO ABRIÓ ESTE JUEVES, a las 00:30 UTC, y ya es el tercer precio más alto del libro presidencial, por delante de Renan Santos y de Ronaldo Caiado. También marca 23,75% en el contrato de tercer lugar de la primera vuelta y 3,70% en el de segundo. ⚠️ Su serie tiene cinco puntos, todos de hoy, entre 0,80% y 5,00%: en un contrato recién abierto una amplitud así no separa precio de ruido.`,
  'polymarketComparison.candidates[3].polymarket': `2,35%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `2,35% (vol USD 11,65M) en la ${S}. ⚠️ El contrato TOCÓ el piso de toda su serie este jueves: el registro marcó 1,70% en cuatro lecturas seguidas y ninguno de los 350 puntos desde el 14/Abr quedó por debajo de eso, verificado en el respaldo. Una hora después ya estaba de vuelta en 2,35%. El techo de la serie es 49,60%, del 28/Abr. En el contrato de tercer lugar de la primera vuelta cedió 9,50pp, hasta 36,00%, la mayor variación aislada del panel hoy, y sigue siendo el nombre más caro de ese contrato.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0,15% (vol USD 6,80M) en la ${S}, con caída de 0,30pp, que lo coloca por debajo del piso de 0,5% de la doble lectura. En el contrato de tercer lugar de la primera vuelta cedió 5,50pp, hasta 33,50%, su nivel más bajo allí desde el 14/Ago.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0,15% (vol USD 3,03M) en la ${S}, sin variación, y por debajo del piso de 0,5% de la doble lectura.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0,05% (vol USD 14,06M) en la ${S}, sin variación. Es el mayor volumen acumulado del libro presidencial, y está por debajo del piso de vigilancia desde hace semanas: volumen alto con precio pegado al cero es posición antigua desarmada, no contrato activo.`,
  'polymarketComparison.candidates[7].polymarket': `0,15%`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0,15% (vol USD 6,21M) en la ${S}, sin variación en el día, y por debajo del piso de 0,5% de la doble lectura.`,
  'polymarketComparison.candidates[8].tendenciaPolymarket':
    `0,05% (vol USD 7,30M) en la ${S}, sin variación.`,
})
