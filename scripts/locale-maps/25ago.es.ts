/**
 * Mapa ES de 25/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções ES: VÍRGULA decimal e PONTO de milhar, iguais ao pt-BR.
 * ⚠️ Armadilhas registradas: `pesquisa` é `encuesta` e nunca `investigación`;
 *    `estadual` é `estatal`; `parado` é desempregado, então usa-se `estancado`;
 *    o verbo de mercado é `descontar`, nunca `precificar`.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem.
 */
import { construir } from '../build-locale-json'

const STAMP = 'lectura confirmada del 25 de ago, 15:22 BRT (18:22 UTC)'
const NEXUS = 'BTG/Nexus del 24 de ago (n=2.006, campo del 21 al 23 de ago, registro TSE BR-09028/2026)'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `El libro presidencial acumula USD 132,88M y el precio de esta página es de la ${STAMP}. Lula está en 62,50% (vol USD 8,97M acumulado) y Flávio Bolsonaro en 34,65% (vol USD 8,89M acumulado), con la distancia entre ambos en 27,85pp.`,
  'cards.sentimento.text2':
    `El día tuvo poco movimiento en el libro principal y mucho en el de tercer lugar. Lula quedó estancado por segundo día seguido y Flávio Bolsonaro cedió 0,40pp, devolviendo parte de la subida de 1,80pp de ayer. La distancia entre los dos volvió a abrirse, de 27,45pp a 27,85pp, y se abrió sin que el líder ganara nada.`,
  'cards.sentimento.text3':
    `Ningún superlativo se aplica hoy, y eso es resultado de verificación, no de falta de tema. El mayor movimiento del día, en el contrato de tercer lugar, llevó la brecha entre Renan Santos y Ronaldo Caiado de 15,00pp a 9,50pp. Contra la serie entera desde el 14 de abr, verificada en la copia de seguridad de la base, el mismo libro ya estuvo en 3,5pp el 22 de ago a las 19:30, así que 9,50pp no es piso de nada. Y no hubo encuesta nacional nueva este martes: la tanda que Quaest divulgó hoy es toda estatal.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro en 34,65% en el presidencial, con caída de 0,40pp, y 87,50% en el contrato de segundo lugar de la primera vuelta, con subida de 2,00pp. Los dos contratos se movieron en direcciones opuestas el mismo día: el mercado quedó más convencido de que llega a la segunda vuelta y algo menos convencido de que gana. El Partido Liberal sigue con 77,50% en el contrato de mayor bancada en el Senado.`,
  'cards.sentimento.esquerda':
    `Lula en 62,50%, sin variación por segundo día seguido. En el contrato de segundo lugar de la primera vuelta aparece con 8,05%, con subida de 2,10pp, lo que es coherente con un mercado que lo sigue viendo pasar en primer lugar. La encuesta más reciente sigue siendo la ${NEXUS}, que lo da en 41% en la primera vuelta y por delante en la segunda por 46% a 45%.`,
  'cards.sentimento.terceiraVia':
    `Aquí está el movimiento del día. Renan Santos cedió 2,50pp en el contrato de tercer lugar y bajó a 51,50%, mientras Ronaldo Caiado subió 3,00pp hasta 42,00%, la mayor subida del panel en el día. La brecha cayó de 15,00pp a 9,50pp. Las encuestas vienen diciendo lo contrario del precio en este punto, con Caiado en 5% y Renan Santos en 3%, y este martes el precio se movió hacia las encuestas sin que el orden del contrato se invirtiera. En el presidencial los dos siguen en el suelo: 2,95% y 0,55%.`,
  'cards.sentimento.polymarket':
    `Precios de la ${STAMP}. AFOS solo publica precio que dos lecturas independientes, separadas por ocho minutos, confirmen dentro de 0,20pp. Los nombres por debajo de 0,5% quedan fuera de esa confirmación, porque en un libro delgado la variación diaria es ruido: hoy eso vale para Pablo Marçal, en 0,15%, Romeu Zema, en 0,25%, y Fernando Haddad, en 0,05%.`,

  'cards.inss.text1':
    `⭐ EL HECHO NUEVO DEL 25 DE AGO ES DE ARTICULACIÓN ELECTORAL, no de investigación. Folha de S.Paulo informa que la estrategia del PT en Maranhão protege a un senador mencionado en el fraude del INSS, para evitar más desgaste a Lula. Es la primera vez en la ventana del panel que el caso aparece influyendo en el armado de una lista estatal.`,
  'cards.inss.text2':
    `El 24 de ago el Tribunal de Cuentas de la Unión colocó los beneficios previsionales en una lista de alto riesgo por la fila del INSS, según O Globo. Es un acto de control externo sobre la gestión del organismo, y no sobre el fraude de los descuentos.`,
  'cards.inss.text3':
    `La distinción que el panel mantiene desde el inicio sigue vigente: una cosa es el efecto sobre la evaluación de la gestión y otra el efecto sobre la intención de voto. No se suman y no se restan, y el panel no convierte una en la otra.`,
  'cards.inss.text4':
    `⚠️ El caso sigue vivo en la Justicia y sin desenlace. Folha del 25 de ago informa que la investigación sobre el hijo del presidente apunta tres intentos fallidos de cerrar un contrato en el Ministerio de Salud, y su abogado buscó un encuentro con el ministro André Mendonça y se quejó ante el director general de la Policía Federal y ante el ministro de Justicia, según O Globo. Son etapas de indagación, sin decisión de fondo.`,
  'cards.inss.impactoLula':
    `No aislable. La ${NEXUS}, que sigue siendo la nacional más reciente, lo pone en 41% en la primera vuelta y por delante en la segunda por 46% a 45%, y en esa misma ronda es el candidato más rechazado, con 49% frente a 48%. Ninguna encuesta nacional nueva salió este martes para probar si la maniobra en Maranhão movió algo.`,
  'cards.inss.impactoGestao':
    `La evaluación sigue con saldo negativo: 43% de mala o pésima frente a 35% de óptima o buena en la ${NEXUS}, una distancia de 8 puntos. El bloque estructurado de esta página sigue con la Genial/Quaest del 14 de ago, porque la regla de la casa es una casa encuestadora por bloque.`,
  'cards.inss.conclusao':
    `El caso sigue sin desenlace judicial. Lo que el 25 de ago agrega es de otra naturaleza: aparece dentro del cálculo electoral de una lista estatal y dentro de una lista de alto riesgo del Tribunal de Cuentas. Ninguno de los dos es una decisión sobre el fraude, y ninguno movió precio en el libro presidencial, donde el líder quedó estancado en el día.`,

  'cards.bancoMaster.text1':
    `⭐ EL HECHO NUEVO DEL 25 DE AGO ES POLICIAL. La Policía Federal hizo un allanamiento en el Instituto de Previsión de Campo Grande, investigando aportes hechos en el Banco Master, según Folha de S.Paulo y O Globo. Es la primera operación de allanamiento de la ventana del panel que alcanza a un régimen propio de previsión municipal.`,
  'cards.bancoMaster.text2':
    `⚠️ El caso Dark Horse ganó detalle en el Supremo: O Globo del 25 de ago informa que involucra sospechas sobre gastos de Daniel Vorcaro y sobre enmiendas parlamentarias, y el gobernador de São Paulo declaró que la policía cumplirá la decisión del Supremo y enviará a la Policía Federal pruebas sobre una ONG vinculada al caso.`,
  'cards.bancoMaster.text3':
    `El panel separa las tres cosas a propósito. Un allanamiento es un acto de investigación, una decisión sobre enmiendas es control presupuestario, y responsabilizar a administradores es un rito societario. El 24 de ago el BRB autorizó acciones contra ex administradores involucrados en los casos Master y Reag, bajo el artículo 159 de la Ley 6.404/1976, lo que no representa una determinación previa de responsabilidad.`,
  'cards.bancoMaster.conclusao':
    `El 25 de ago el caso avanza por un acto policial, después de haber avanzado por un rito de accionistas el 24 de ago. La cobertura del día también registra que los dos primeros candidatos evitan ambientes no controlados para no ser interpelados sobre Vorcaro y sobre el hijo del presidente, según Estadão. El contrato de impeachment en el Supremo está en 3,40% y no se movió por nada de eso.`,

  'cards.stf.toffoli':
    `Sin acto individual nuevo capturado el 25 de ago.`,
  'cards.stf.moraes':
    `Sin acto individual nuevo el 25 de ago. Aparece en la cobertura del 24 de ago por un pedido de un diputado para investigar a un aliado del clan Bolsonaro detenido en Bolivia, y por haber autorizado una visita de Carlos Bolsonaro a su padre, según O Globo.`,
  'cards.stf.gilmar':
    `Sin acto individual nuevo capturado el 25 de ago.`,
  'cards.stf.dino':
    `⭐ EL ACTO RELEVANTE SIGUE SIENDO SUYO, y este martes produjo efecto político directo. O Globo del 25 de ago informa que Flávio Bolsonaro intenta esquivar el desgaste del caso Dark Horse tras la decisión de Flávio Dino, y dejó las explicaciones a la productora. La decisión reafirma que es nula la indicación de enmiendas parlamentarias hecha por presidentes de partido, con plazo de cinco días hábiles y multa diaria de R$ 100 mil. El 24 de ago Podemos respondió al Supremo que la dirección nacional del partido no controla enmiendas, según O Globo.`,
  'cards.stf.mendonca':
    `Aparece en la cobertura del 25 de ago, no en un acto nuevo: O Globo informa que el abogado del hijo del presidente intentó un encuentro con él y se quejó ante el director general de la Policía Federal y ante el ministro de Justicia.`,
  'cards.stf.nexo':
    `⭐ EL NEXO SIGUE SIENDO PRESUPUESTARIO, y ahora tiene dirección electoral. La decisión sobre enmiendas alcanza el engranaje que financia base parlamentaria en año electoral, y el 25 de ago llegó al segundo de la carrera presidencial por la vía de la cobertura, no por un acto dirigido a él. En paralelo, ministros del Supremo señalaron que pueden anular tramos de la Ley Antifacción, según O Globo del 24 de ago.`,
  'cards.stf.analise':
    `El contrato de salida de un ministro del Supremo por impeachment antes de 2027 está en 3,40% (vol USD 84 mil), con subida de 0,05pp, en la ${STAMP}. En un libro de ese tamaño, 0,05pp es ruido y no señal. El día tuvo tres frentes con el Supremo en el medio, la decisión de Dino sobre enmiendas alcanzando el caso Dark Horse, la respuesta de Podemos sobre el control de enmiendas y la señal sobre la Ley Antifacción, y el contrato no registró ninguna. El panel mantiene este mercado como termómetro institucional justamente por eso: mide riesgo de remoción de un ministro, no intensidad del roce entre poderes.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'es', {
  'subtitle':
    `Cruce del 25 de agosto de 2026: precio de Polymarket en la ${STAMP}, libro presidencial en USD 132,88M, contra la BTG/Nexus del 24 de ago, campo del 21 al 23 de ago, que sigue siendo la nacional más reciente. No hubo encuesta nacional nueva este martes: la tanda divulgada hoy por Quaest es toda estatal, y el panel solo cruza ámbito nacional. El movimiento del día está en el contrato de tercer lugar.`,

  'candidates[0].header':
    `PRECIO: 62,50% (vol USD 8,97M acumulado), ${STAMP}. Sin variación en el día, segundo día seguido estancado.`,
  'candidates[0].fortes[0]':
    `La ${NEXUS}, confiabilidad 4, lo coloca en 41% en la primera vuelta sin Pablo Marçal, 40% en el escenario con él, y ganando la segunda vuelta por 46% a 45%. Sigue siendo la nacional más reciente, y este martes no salió ninguna para reemplazarla.`,
  'candidates[0].fortes[1]':
    `Su precio no se movió por segundo día seguido, en 62,50%, mientras el del segundo cedía. La distancia entre los dos volvió a abrirse, de 27,45pp a 27,85pp.`,
  'candidates[0].fortes[2]':
    `Lidera los dos escenarios de primera vuelta de la ronda más reciente y la segunda vuelta probada en ella.`,
  'candidates[0].fortes[3]':
    `Confirmó su asistencia a la entrevista de Rede Globo, según Valor Econômico del 25 de ago. Es su primera aparición confirmada en un formato de confrontación tras faltar al debate de Band el 23 de ago.`,
  'candidates[0].fortes[4]':
    `En el contrato de segundo lugar de la primera vuelta aparece con 8,05%, con subida de 2,10pp, lo que es coherente con un mercado que lo sigue viendo pasar en primer lugar.`,
  'candidates[0].fracos[0]':
    `⚠️ En la ${NEXUS} aparece como el candidato más rechazado, con 49% frente a 48% del segundo, según Poder360. VEJA registra que es la primera vez desde abril que supera al rival en rechazo, y esa afirmación es de la revista, no del panel.`,
  'candidates[0].fracos[1]':
    `La evaluación de la gestión sigue con saldo negativo en esa misma ronda: 43% de mala o pésima frente a 35% de óptima o buena, según CNN Brasil.`,
  'candidates[0].fracos[2]':
    `La ventaja en la segunda vuelta es de 1 punto, dentro del margen de 2pp de la propia encuesta, lo que la vuelve un empate técnico.`,
  'candidates[0].fracos[3]':
    `📌 Folha del 25 de ago informa que la estrategia del PT en Maranhão protege a un senador mencionado en el fraude del INSS para evitar más desgaste a él, lo que muestra el caso todavía pesando en la negociación electoral.`,
  'candidates[0].fracos[4]':
    `🏛️ Folha del 25 de ago también informa que la investigación sobre su hijo apunta tres intentos fallidos de cerrar un contrato en el Ministerio de Salud. Es una indagación en curso, sin desenlace.`,
  'candidates[0].analise':
    `Su precio lleva dos días estancado en 62,50% (vol USD 8,97M acumulado) y la distancia hacia el segundo volvió a abrirse, de 27,45pp a 27,85pp, sin que él ganara nada: quien cedió fue el otro lado. Contra la serie entera desde el 14 de abr, la menor distancia jamás registrada entre los dos es negativa, de 8 puntos a favor del segundo el 6 de may, así que estrecharse y abrirse en este rango son movimientos comunes de este libro y no un cambio de cuadro. La encuesta más reciente sigue siendo la BTG/Nexus del 24 de ago, que lo da en 41% en la primera vuelta y por delante en la segunda por 46% a 45%, y este martes no hubo nacional nueva. Lo que el día agrega es de agenda y no de número: confirmó su asistencia a la entrevista de Globo, tras faltar al debate del 23 de ago.`,

  'candidates[1].header':
    `PRECIO: 34,65% (vol USD 8,89M acumulado), ${STAMP}. Caída de 0,40pp, devolviendo parte de la subida de ayer.`,
  'candidates[1].fortes[0]':
    `Incluso después de ceder 0,40pp, el 34,65% sigue siendo su nivel más alto desde el 13 de may. Verificado contra la serie entera desde el 14 de abr en la copia de seguridad de la base, y no por la ventana de la API, que trunca en 90 días.`,
  'candidates[1].fortes[1]':
    `⭐ SUBIÓ EN EL CONTRATO DE SEGUNDO LUGAR: 87,50%, con alza de 2,00pp, su mayor movimiento del día. El mercado quedó más seguro de que llega a la segunda vuelta, al mismo tiempo que quedó algo menos seguro de que gana.`,
  'candidates[1].fortes[2]':
    `La ${NEXUS} le da 37% en el escenario sin Pablo Marçal y 34% en el escenario con él, y 45% en la segunda vuelta frente a 46%.`,
  'candidates[1].fortes[3]':
    `En esa misma ronda aparece menos rechazado que el primero, con 48% frente a 49%, según Poder360.`,
  'candidates[1].fortes[4]':
    `Confirmó su asistencia a la entrevista de Rede Globo, según Valor Econômico y VEJA del 25 de ago, tras haber condicionado su presencia en el debate de Band a la asistencia del rival.`,
  'candidates[1].fracos[0]':
    `La caída de 0,40pp devuelve parte de la subida de 1,80pp de ayer, y el saldo de los dos días es positivo en 1,40pp.`,
  'candidates[1].fracos[1]':
    `El techo de su serie es 45,50%, del 6 de may, y está 10,85pp por debajo.`,
  'candidates[1].fracos[2]':
    `🏛️ EL ACTO JUDICIAL DEL DÍA LO ALCANZA: O Globo del 25 de ago informa que intenta esquivar el desgaste del caso Dark Horse tras la decisión del ministro Flávio Dino, y dejó las explicaciones a la productora. El caso involucra sospechas sobre gastos de Daniel Vorcaro y sobre enmiendas parlamentarias.`,
  'candidates[1].fracos[3]':
    `La decisión de Dino sobre la nulidad de enmiendas indicadas por presidentes de partido cita sospechas sobre el presidente de su propio partido, según Poder360 y CNN Brasil del 23 de ago.`,
  'candidates[1].fracos[4]':
    `📌 Su distancia hacia el primero volvió a abrirse este martes, de 27,45pp a 27,85pp.`,
  'candidates[1].analise':
    `Su día tiene dos señales en direcciones opuestas, y es el hallazgo del panel hoy. En el libro presidencial cedió 0,40pp y quedó en 34,65% (vol USD 8,89M acumulado), devolviendo parte de la subida de 1,80pp de ayer. En el contrato de segundo lugar de la primera vuelta hizo el movimiento contrario y subió 2,00pp, llegando a 87,50%. Es decir, el mercado quedó más convencido de que llega a la segunda vuelta y algo menos convencido de que gana. Los dos contratos miden cosas distintas y no se restan. Aun con la caída, el nivel sigue siendo el más alto desde el 13 de may, verificado contra la serie entera desde el 14 de abr en la copia de seguridad de la base. Lo que pesa en su contra en el día es judicial: la cobertura del 25 de ago lo muestra administrando el desgaste del caso Dark Horse tras la decisión de Flávio Dino.`,

  'candidates[2].header':
    `PRECIO: 2,95% (vol USD 11,09M acumulado), ${STAMP}. Subida de 0,05pp en el presidencial, y caída de 2,50pp en el contrato de tercer lugar.`,
  'candidates[2].fortes[0]':
    `Fue uno de los tres candidatos que asistieron al primer debate presidencial, el 23 de ago, junto con Ronaldo Caiado y Augusto Cury.`,
  'candidates[2].fortes[1]':
    `La BBC del 24 de ago informa que lideró la atención en las redes sociales durante el debate, según un estudio citado en la nota.`,
  'candidates[2].fortes[2]':
    `En el presidencial subió 0,05pp, hasta 2,95%, un movimiento que queda por debajo de lo que la doble lectura distingue del ruido.`,
  'candidates[2].fortes[3]':
    `Sigue por delante en el contrato de tercer lugar, con 51,50% frente a 42,00%, incluso después de ceder.`,
  'candidates[2].fracos[0]':
    `🔴 LA MAYOR PÉRDIDA DEL DÍA ES SUYA, y está en el contrato de tercer lugar: 51,50%, con caída de 2,50pp, mientras su rival directo subía 3,00pp.`,
  'candidates[2].fracos[1]':
    `La brecha entre los dos en el contrato de tercer lugar cayó de 15,00pp a 9,50pp en un solo día.`,
  'candidates[2].fracos[2]':
    `⚠️ Eso NO es mínimo de la serie: el mismo libro registró 3,5pp el 22 de ago a las 19:30, y ese día el cierre marcaba 15,5pp. El cierre del día esconde el piso.`,
  'candidates[2].fracos[3]':
    `La ${NEXUS} lo da en 3%, frente a 5% de Ronaldo Caiado, su menor valor en la ventana de 30 días del panel.`,
  'candidates[2].fracos[4]':
    `La discrepancia entre los dos instrumentos sobre quién es tercero continúa, pero se achicó hoy: el precio se movió hacia el orden que las encuestas vienen mostrando, sin que ese orden se invirtiera.`,
  'candidates[2].analise':
    `Su nombre concentra el movimiento del día, y no está en el libro presidencial, donde subió unos irrelevantes 0,05pp hasta 2,95% (vol USD 11,09M acumulado). Está en el contrato de tercer lugar, donde cedió 2,50pp hasta 51,50%, mientras Ronaldo Caiado subía 3,00pp hasta 42,00%. La brecha entre los dos cayó de 15,00pp a 9,50pp en un solo día. ⚠️ Y aquí el panel necesita una salvedad, porque el titular fácil sería falso: 9,50pp NO es la menor brecha de la serie. El mismo libro estuvo en 3,5pp el 22 de ago a las 19:30, y el cierre de ese día marcaba 15,5pp, lo que muestra que mirar solo el cierre esconde el piso. Lo que sí se puede afirmar es lo que hizo el día: el precio se movió hacia el orden que muestran las encuestas, que pone a Caiado por delante con 5% frente a 3%, sin que el orden del contrato se invirtiera.`,

  'candidates[3].header':
    `PRECIO para todo el pelotón, ${STAMP}: Caiado 0,55%, Zema 0,25%, Haddad 0,05%.`,
  'candidates[3].subtitle':
    `Pelotón de atrás en la ${STAMP}. Ronaldo Caiado cedió 0,15pp y volvió al piso de 0,5% en el que la doble lectura confirma variación, y Romeu Zema y Fernando Haddad siguen por debajo. ⭐ El movimiento real del pelotón hoy no está en el libro presidencial: está en el contrato de tercer lugar de la primera vuelta, donde Caiado subió 3,00pp.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,55% (vol USD 6,59M acumulado, ${STAMP}), con caída de 0,15pp. ⭐ En el contrato de tercer lugar de la primera vuelta SUBIÓ 3,00pp y está en 42,00%, a 9,50pp de Renan Santos.`,
  'candidates[3].caiado.fortes':
    `⭐ LA MAYOR SUBIDA DEL PANEL EN EL DÍA ES SUYA, y está en el contrato de tercer lugar de la primera vuelta: 3,00pp, llegando a 42,00%. El movimiento acerca el precio al orden que las encuestas ya mostraban, porque la ${NEXUS} lo mantiene en 5% en la primera vuelta frente a 3% de Renan Santos. Esa misma encuesta lo probó en segunda vuelta contra el primero y midió 46% a 42%, según Metrópoles. Participó del primer debate presidencial, el 23 de ago.`,
  'candidates[3].caiado.fracos':
    `En el libro presidencial fue en la dirección contraria y cedió 0,15pp, volviendo a 0,55%, pegado al piso de 0,5% en el que la doble lectura logra distinguir movimiento de ruido. ⚠️ Y la inversión entre los dos instrumentos continúa: en las encuestas está por delante de Renan Santos, y en el contrato de tercer lugar su precio sigue siendo 9,50pp MENOR que el del rival. La brecha se achicó, pero el orden no se dio vuelta. No hubo encuesta nacional nueva este martes para probar si las encuestas se movieron junto con el precio.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,30M acumulado), ${STAMP}, sin variación. 🏷️ No es candidato a la Presidencia.`,
  'candidates[3].haddad.fortes':
    `Su volumen acumulado, USD 7,30M, sigue siendo mayor que el de varios nombres con precio por encima del suyo, lo que mantiene el contrato con respaldo de negociación pese al precio en el suelo. El volumen acumulado mide cuánto dinero pasó desde la apertura, no la probabilidad de hoy.`,
  'candidates[3].haddad.fracos':
    `⭐ HECHO FECHADO EL 16 DE AGO: abrió formalmente campaña al GOBIERNO DE SÃO PAULO, según O Globo y Times Brasil. Es decir, no disputa la Presidencia, y cualquier escenario presidencial que lo incluya es una hipótesis de encuesta y no una candidatura en curso. El precio sigue en 0,05%, muy por debajo del piso de 0,5% de la doble lectura.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,25% (vol USD 5,98M acumulado, ${STAMP}), con caída de 0,05pp. En el contrato de tercer lugar de la primera vuelta está en 3,15%.`,
  'candidates[3].zema.fortes':
    `⭐ SU DÍA FUE DE EXPOSICIÓN: fue entrevistado durante unos 40 minutos en Jornal Nacional el 25 de ago, según BBC y O Globo, la mayor exposición individual del pelotón en el día. La ${NEXUS} lo mantiene en 3% en la primera vuelta, el mismo nivel que la casa viene midiendo desde el 3 de ago.`,
  'candidates[3].zema.fracos':
    `El precio no registró nada de la entrevista: cedió 0,05pp y quedó en 0,25%, por debajo del piso de 0,5% de la doble lectura. En la entrevista minimizó la situación fiscal de Minas Gerais, criticó al Supremo, dijo que el Poder Judicial se usa para hacer política, no garantizó aumento real del salario mínimo y buscó alejarse de acusaciones de vínculo de Cemig con el Banco Master, según O Globo. 🔴 Él había DESISTIDO del primer debate presidencial a las 12:01 del 23 de ago, tras confirmarse las ausencias de los dos primeros, según Gazeta do Povo.`,
  'candidates[3].analise':
    `El pelotón tiene un nombre que se movió de verdad hoy, y no fue en el libro presidencial. Ronaldo Caiado subió 3,00pp en el contrato de tercer lugar y llegó a 42,00%, la mayor subida del panel en el día, mientras en el presidencial cedía 0,15pp hasta 0,55% (vol USD 6,59M acumulado). El movimiento acerca el precio al orden que las encuestas vienen registrando, que lo pone por delante de Renan Santos por 5% a 3%, sin que el contrato se invirtiera: el rival sigue con 51,50%. Romeu Zema, en 0,25% (vol USD 5,98M acumulado), tuvo el día de mayor exposición, con 40 minutos de entrevista en Jornal Nacional, y su precio no registró nada de eso. Fernando Haddad sigue en 0,05% (vol USD 7,30M acumulado), sin variación.`,
  'candidates[3].fortes[0]':
    `⭐ Ronaldo Caiado hizo la mayor subida del día en cualquier libro del panel: 3,00pp en el contrato de tercer lugar, llegando a 42,00%.`,
  'candidates[3].fortes[1]':
    `En las encuestas sigue por delante de Renan Santos, con 5% frente a 3% en la ${NEXUS}, y el precio del contrato de tercer lugar se movió hoy hacia ese orden.`,
  'candidates[3].fortes[2]':
    `Romeu Zema tuvo 40 minutos de entrevista en Jornal Nacional el 25 de ago, la mayor exposición individual del pelotón en el día.`,
  'candidates[3].fortes[3]':
    `La BTG/Nexus probó a Caiado en segunda vuelta contra el primero y midió 46% a 42%, según Metrópoles.`,
  'candidates[3].fracos[0]':
    `En el libro presidencial los tres siguen por debajo o pegados al piso de 0,5%: Caiado 0,55% tras ceder 0,15pp, Zema 0,25% y Haddad 0,05%.`,
  'candidates[3].fracos[1]':
    `La inversión entre los dos instrumentos en el tercer lugar continúa: en las encuestas Caiado está por delante, y en el contrato su precio sigue siendo 9,50pp menor que el del rival.`,
  'candidates[3].fracos[2]':
    `⚠️ La brecha de 9,50pp no es piso de serie: el libro ya estuvo en 3,5pp el 22 de ago.`,
  'candidates[3].fracos[3]':
    `Ninguno de los tres tuvo encuesta nacional nueva este martes, porque no hubo ninguna.`,

  'quadroComparativo[0].p':
    `SIN NACIONAL NUEVA ESTE MARTES. La más reciente sigue siendo la BTG/Nexus (n=2.006, campo del 21 al 23 de ago, confiabilidad 4), que le da 41% en la primera vuelta sin Marçal, 40% en el escenario con él, y 46% en la segunda vuelta frente a 45%. ⚠️ En esa misma ronda es el más rechazado, con 49% frente a 48% del segundo, según Poder360.`,
  'quadroComparativo[0].m':
    `62,50% (vol USD 8,97M), ${STAMP}. Sin variación, segundo día seguido estancado. Su mayor lectura desde el 14 de abr, cuando empieza la serie, es 67,50%, del 16 de ago.`,
  'quadroComparativo[0].t':
    `estancado por segundo día, 5,00pp por debajo del máximo de la serie`,
  'quadroComparativo[0].s':
    `Séptimo día de campaña oficial, a 43 días de la primera vuelta. Confirmó su asistencia a la entrevista de Rede Globo, según Valor Econômico, tras faltar al debate de Band el 23 de ago.`,
  'quadroComparativo[1].p':
    `La BTG/Nexus del 24 de ago le da 37% en el escenario sin Pablo Marçal y 34% en el escenario con él, y 45% en la segunda vuelta frente a 46%. No hubo encuesta nacional nueva este martes para actualizar esos números.`,
  'quadroComparativo[1].m':
    `34,65% (vol USD 8,89M), ${STAMP}. Caída de 0,40pp, devolviendo parte de la subida de ayer. El nivel sigue siendo el más alto desde el 13 de may, verificado en la copia de seguridad contra la serie entera desde el 14 de abr. El techo de la serie es 45,50%, del 6 de may. ⭐ En el contrato de segundo lugar SUBIÓ 2,00pp y paga 87,50%.`,
  'quadroComparativo[1].t':
    `cede en el presidencial y sube en el contrato de segundo lugar`,
  'quadroComparativo[1].s':
    `Confirmó su asistencia a la entrevista de Rede Globo, según Valor Econômico y VEJA. 🏛️ O Globo del 25 de ago informa que administra el desgaste del caso Dark Horse tras la decisión del ministro Flávio Dino, y dejó las explicaciones a la productora.`,
  'quadroComparativo[2].p':
    `La BTG/Nexus lo da en 3%, frente a 5% de Ronaldo Caiado. Es su menor valor en la ventana de 30 días del panel. Fue uno de los tres que asistieron al debate del 23 de ago, y la BBC informa que lideró la atención en las redes durante el debate.`,
  'quadroComparativo[2].m':
    `2,95% (vol USD 11,09M), ${STAMP}. Subida de 0,05pp, por debajo de lo que la doble lectura distingue del ruido. 🔴 En el contrato de tercer lugar CEDIÓ 2,50pp y paga 51,50%, frente a 42,00% de Ronaldo Caiado.`,
  'quadroComparativo[2].t':
    `estable en el presidencial, mayor pérdida del día en el contrato de tercer lugar`,
  'quadroComparativo[2].s':
    `📌 La discrepancia sobre el tercer lugar SE ACHICÓ: la brecha en el contrato cayó de 15,00pp a 9,50pp, moviéndose hacia el orden que muestran las encuestas. ⚠️ No es piso de serie: el mismo libro estuvo en 3,5pp el 22 de ago a las 19:30.`,
  'quadroComparativo[3].p':
    `La BTG/Nexus lo mantiene en 5%, por delante de Renan Santos en las encuestas. Esa misma encuesta probó la segunda vuelta contra Lula y midió 46% a 42%, según Metrópoles. Participó del debate del 23 de ago.`,
  'quadroComparativo[3].m':
    `0,55% (vol USD 6,59M), ${STAMP}. Caída de 0,15pp, de vuelta al piso de 0,5%. ⭐ En el contrato de tercer lugar hizo la MAYOR SUBIDA DEL DÍA en cualquier libro del panel: 3,00pp, llegando a 42,00%.`,
  'quadroComparativo[3].t':
    `cede en el presidencial, mayor subida del día en el contrato de tercer lugar`,
  'quadroComparativo[3].s':
    `El precio del tercer lugar se movió hacia el orden que las encuestas ya mostraban, que lo pone por delante por 5% a 3%. El orden del contrato no se invirtió: el rival sigue con 51,50%.`,
  'quadroComparativo[4].p':
    `Sin medición nueva este martes. Las tres nacionales de la ventana difieren entre sí: 2% en la Datafolha del 21 de ago, 5,2% en la Veritá del mismo día y 4% en la BTG/Nexus del 24 de ago.`,
  'quadroComparativo[4].m':
    `0,15% (vol USD 2,66M), ${STAMP}. Caída de 0,10pp, y está por debajo del piso de 0,5% de la doble lectura, lo que vuelve la variación diaria ruido de libro delgado.`,
  'quadroComparativo[4].t':
    `por debajo del piso de vigilancia`,
  'quadroComparativo[4].s':
    `🏛️ El cerco judicial tuvo desenlace el 21 de ago: el presidente del Tribunal Regional Electoral de São Paulo rechazó los recursos especiales de su defensa Y del Ministerio Público Electoral, mantuvo la inelegibilidad hasta 2032 y la multa de R$ 420 mil, según Metrópoles y CNN Brasil. 🔴 La mayor distancia entre los dos instrumentos del panel sigue siendo la suya: las encuestas lo ponen quinto con 4% y el precio lo pone noveno con 0,15%. Las dos magnitudes no se restan, y lo que el panel registra es el orden, no una cifra de diferencia.`,
  'quadroComparativo[5].m':
    `3,40% (vol USD 84 mil), ${STAMP}. Subida de 0,05pp, dentro del ruido de un libro de ese tamaño.`,
  'quadroComparativo[5].t':
    `prácticamente estable`,
  'quadroComparativo[5].s':
    `Contrato de impeachment de un ministro del Supremo antes de 2027, mantenido en el panel como termómetro institucional. El 25 de ago el caso Dark Horse ganó detalle en la cobertura, involucrando sospechas sobre gastos de Daniel Vorcaro y sobre enmiendas, según O Globo, y el gobernador de São Paulo declaró que la policía cumplirá la decisión del Supremo sobre pruebas de una ONG vinculada al caso. El contrato no se movió por nada de eso.`,

  'cruzamento':
    `El día no tuvo encuesta nacional nueva y sí tuvo movimiento de precio, y los dos hechos juntos definen la lectura. La tanda divulgada este martes por Quaest es toda estatal, cubriendo Rio Grande do Norte, Paraná, Rio Grande do Sul, Alagoas, Maranhão y Santa Catarina, y el panel solo cruza ámbito nacional. La encuesta más reciente del país sigue siendo la BTG/Nexus del 24 de ago.\n\nEn el libro presidencial, que suma USD 132,88M, el primero quedó estancado en 62,50% por segundo día seguido y el segundo cedió 0,40pp, hasta 34,65%. La distancia entre los dos volvió a abrirse, de 27,45pp a 27,85pp, y se abrió sin que el líder ganara nada. Contra la serie entera desde el 14 de abr, verificada en la copia de seguridad de la base y no por la ventana de la API, la menor distancia jamás registrada entre los dos es negativa, de 8 puntos a favor del segundo el 6 de may. Un movimiento en este rango es rutina de este libro.\n\n⭐ EL HALLAZGO DEL DÍA ESTÁ EN EL CONTRATO DE TERCER LUGAR, y es de convergencia entre instrumentos. Renan Santos cedió 2,50pp hasta 51,50%, mientras Ronaldo Caiado subía 3,00pp hasta 42,00%, la mayor subida del panel en el día. La brecha entre los dos cayó de 15,00pp a 9,50pp. Las encuestas vienen diciendo lo contrario del precio en ese punto desde hace semanas, con Caiado en 5% y Renan Santos en 3% en la ronda más reciente, y este martes el precio se movió hacia las encuestas sin que el orden del contrato se invirtiera.\n\n⚠️ LA SALVEDAD QUE IMPONE LA SERIE, y sin ella la lectura de arriba se vuelve un titular falso: 9,50pp no es la menor brecha jamás registrada en este contrato. El mismo libro estuvo en 3,5pp el 22 de ago a las 19:30, y el cierre de ese día marcaba 15,5pp. Quien mira solo el cierre de cada día no ve el piso, y habría concluido que hoy es mínimo de serie cuando no lo es.\n\nEl segundo contrato del segundo fue en dirección opuesta a su presidencial: en el libro de segundo lugar de la primera vuelta subió 2,00pp y llegó a 87,50%. El mercado quedó más convencido de que llega a la segunda vuelta y algo menos convencido de que gana. Son contratos distintos, que miden desenlaces distintos, y el panel no resta uno del otro.\n\nEn el terreno de los hechos, el día tuvo una reversión de agenda y un acto de investigación. Los dos primeros confirmaron su asistencia a la entrevista de Rede Globo, según Valor Econômico y VEJA, tras haber faltado ambos al debate de Band el 23 de ago. Y la Policía Federal hizo un allanamiento en el Instituto de Previsión de Campo Grande por aportes en el Banco Master, según Folha de S.Paulo y O Globo. Ninguno de los dos movió precio.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'es', {
  'polymarketComparison.note':
    `Precios de Polymarket en la ${STAMP}, con el libro presidencial en USD 132,88M. No hubo encuesta nacional nueva este martes: la tanda divulgada hoy por Quaest es toda estatal, y este bloque solo cruza ámbito nacional. La distancia entre los dos primeros volvió a abrirse, de 27,45pp a 27,85pp, y se abrió porque el segundo cedió 0,40pp, no porque el primero haya ganado. ⭐ El movimiento del día está en el contrato de tercer lugar de la primera vuelta: Renan Santos cedió 2,50pp hasta 51,50% y Ronaldo Caiado subió 3,00pp hasta 42,00%, llevando la brecha entre ambos de 15,00pp a 9,50pp, hacia el orden que las encuestas ya mostraban. ⚠️ Y eso NO es piso de la serie: el mismo libro estuvo en 3,5pp el 22 de ago a las 19:30, verificado en la copia de seguridad de la base contra la serie que empieza el 14 de abr. Probabilidad de ganar e intención de voto miden cosas distintas, y el panel no resta una de la otra.`,
  'polymarketComparison.sources':
    `Precios de Polymarket vía el proxy AFOS, y el panel solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp. El 25 de ago hay lectura confirmada nueva para todos los contratos seguidos, a las 15:22 BRT (18:22 UTC): presidencial, segundo lugar, tercer lugar, Senado e impeachment en el Supremo. Encuestas registradas en el TSE y divulgadas por las casas encuestadoras, con reportes de G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, Estadão, Poder360, VEJA, InfoMoney, UOL, O Globo y Correio Braziliense.`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `62,50% (vol USD 8,97M) en la ${STAMP}, sin variación por segundo día seguido. Su mayor lectura desde el 14 de abr, cuando empieza la serie, es 67,50%, del 16 de ago. En el contrato de segundo lugar de la primera vuelta aparece con 8,05%, con subida de 2,10pp.`,
  'polymarketComparison.candidates[1].polymarket': `34,65%`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `34,65% (vol USD 8,89M) en la ${STAMP}, con caída de 0,40pp que devuelve parte de la subida de 1,80pp de ayer. El nivel sigue siendo el más alto desde el 13 de may, verificado en la copia de seguridad contra la serie entera desde el 14 de abr, y el techo de la serie es 45,50%, del 6 de may. ⭐ En el contrato de segundo lugar de la primera vuelta fue en la dirección contraria y subió 2,00pp, hasta 87,50%.`,
  'polymarketComparison.candidates[2].polymarket': `2,95%`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `2,95% (vol USD 11,09M) en la ${STAMP}, con subida de 0,05pp que queda por debajo de lo que la doble lectura distingue del ruido. 🔴 En el contrato de tercer lugar de la primera vuelta tuvo la mayor pérdida del panel en el día, cediendo 2,50pp hasta 51,50%.`,
  'polymarketComparison.candidates[3].polymarket': `0,55%`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `0,55% (vol USD 6,59M) en la ${STAMP}, con caída de 0,15pp que lo devuelve al piso de 0,5% de la doble lectura. ⭐ En el contrato de tercer lugar de la primera vuelta hizo la mayor subida del panel en el día, subiendo 3,00pp hasta 42,00%, lo que acerca el precio al orden que las encuestas ya mostraban.`,
  'polymarketComparison.candidates[4].polymarket': `0,15%`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0,15% (vol USD 2,66M) en la ${STAMP}, con caída de 0,10pp. Está por debajo del piso de 0,5% de la doble lectura, lo que vuelve la variación diaria ruido de libro delgado.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0,05% (vol USD 14,03M acumulado) en la ${STAMP}. Es el mayor volumen individual del libro presidencial y el precio sigue en el suelo, lo que es coherente con un contrato que el mercado ya resolvió.`,
  'polymarketComparison.candidates[6].polymarket': `0,25%`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0,25% (vol USD 5,98M) en la ${STAMP}, con caída de 0,05pp, por debajo del piso de 0,5% de la doble lectura. ⭐ Fue entrevistado durante 40 minutos en Jornal Nacional el 25 de ago, según BBC y O Globo, y el contrato no registró nada de eso.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0,05% (vol USD 7,30M acumulado) en la ${STAMP}, sin variación. Ninguna nacional lo prueba para presidente.`,
})
