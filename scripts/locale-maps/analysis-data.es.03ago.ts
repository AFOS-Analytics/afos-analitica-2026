/**
 * Mapa ES de analysis-data.json — /atualizar-brz 03/Ago/2026.
 * Convenções: vírgula decimal e ponto de milhar. `pesquisa` é `encuesta`,
 * `estadual` é `estatal`, `parado` (sem movimento) é `quieto`, e o verbo de
 * mercado é `descontar`, nunca `precificar`.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/es/glossary#${id})`

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 62 días de la ${G('1ª vuelta', 'primeiro-turno')} SALIÓ LA PRIMERA de las cuatro nacionales que el registro del ${G('TSE', 'tse')} preveía entre el 03 y el 05/Ago, y ajusta la disputa. ${G('BTG/Nexus', 'nexus-btg')} (n=2.002, campo del 31/Jul al 02/Ago, telefónica, margen 2pp, 95% de confianza, BR-02874/2026) da 41% a Lula y 37% a Flávio en 1ª vuelta, con Caiado en 5%, Renan Santos en 4% y Zema en 3%. En la 2ª vuelta, 46% x 45%, diferencia de 1pp que queda dentro del margen y por eso es ${G('empate técnico', 'empate-tecnico')}.`,
  'cards.sentimento.text2':
    `LO QUE CAMBIA LA SEMANA ES LA COMPARACIÓN CON LA PROPIA CASA. En la ronda de Nexus del 27/Jul era 42% x 33%, es decir, la diferencia de 1ª vuelta cayó de 9pp a 4pp en una sola ronda, y la de la 2ª vuelta cayó de 4pp a 1pp. El movimiento viene casi todo de un lado: Lula cedió 1pp, dentro del margen, y Flávio subió 4pp, el doble.`,
  'cards.sentimento.text3':
    `EN EL MERCADO LA DIFERENCIA SE CERRÓ JUNTO, y por el mismo motivo. Lula quedó QUIETO en 65,50% (vol USD 7,92M) por segunda rueda, y Flávio SUBIÓ 0,90pp, hasta 25,45% (vol USD 7,86M), lo que llevó la diferencia de +40,95pp a +40,05pp. En la serie diaria, no quedaba por debajo de eso desde el 30/Jul, cuando marcó +39,50pp. Las dos mediciones se movieron hacia el mismo lado el mismo día, algo raro en este panel, pero eso es coincidencia de DIRECCIÓN, no de nivel: probabilidad de victoria y porción de voto no se comparan en nivel.`,
  'cards.sentimento.direita':
    `Flávio SUBIÓ 0,90pp, hasta 25,45% (vol USD 7,86M), el movimiento más fuerte de la rueda entre los dos primeros, y cerró la diferencia solo, sin que el líder cediera. En la encuesta de ${G('BTG/Nexus', 'nexus-btg')} subió 4pp, hasta 37%, y quedó a 1pp de Lula en la 2ª vuelta. La salvedad de serie es grande: su techo es 45,20%, del 07/May, y su piso es 22,00%, del 03/Jul, así que 25,45% es recuperación dentro de un nivel rebajado. Es favorito del contrato de 2º lugar con 80,50%. Recibió apoyo declarado de Milei, que volvió a atacar a Lula públicamente el 02 y el 03/Ago.`,
  'cards.sentimento.esquerda':
    `Lula quedó QUIETO en 65,50% (vol USD 7,92M) por segunda rueda seguida, el día en que la encuesta se ajustó. El precio está 1,00pp por debajo del techo de la serie, que es 66,50%, del cierre del 01/Ago. En ${G('BTG/Nexus', 'nexus-btg')} cayó 1pp en 1ª vuelta y 1pp en la 2ª, caídas dentro del margen de 2pp que aisladas no son movimiento. Gana los cuatro escenarios de 2ª vuelta de la ronda. En su propio campo el mercado cedió: Camilo Santana está en 0,55% y Haddad retrocedió a 0,15% (vol USD 6,64M).`,
  'cards.sentimento.terceiraVia':
    `DÍA DE CONVENCIÓN SIN EFECTO DE PRECIO. Caiado y Zema fueron oficializados candidatos y ninguno de los dos ganó en el mercado: Caiado está en 1,15% (vol USD 5,30M), por encima del piso de 0,90% que la serie tocó dentro del día 02/Ago, y Zema sigue en 0,25% (vol USD 4,66M). Caiado prometió amnistiar a Bolsonaro y a los condenados del 8 de Enero y disputó con Flávio el voto del agronegocio, justo el día en que Flávio subió en las dos mediciones. RENAN SANTOS CAYÓ 0,50pp, hasta 7,45% (vol USD 8,86M), deshaciendo la subida de ayer, y la encuesta de Nexus le dio 4%, lo que deja la distancia entre precio y encuesta en 3,45pp.`,
  'cards.sentimento.polymarket':
    `Lula 65,50% (quieto, vol USD 7,92M), Flávio 25,45% (subida 0,90pp, vol USD 7,86M), Renan Santos 7,45% (baja 0,50pp, vol USD 8,86M), Caiado 1,15% (vol USD 5,30M), Jair Bolsonaro 0,65% (vol USD 5,34M), Camilo Santana 0,55% (vol USD 4,27M), Alckmin 0,35% (vol USD 5,04M), Zema 0,25% (vol USD 4,66M), Haddad 0,15% (baja 0,15pp, vol USD 6,64M). Diferencia de Lula sobre Flávio +40,05pp. Captura trabada de las 19:11 UTC, aprobada en el tercer intento.`,
  'cards.inss.text1':
    `La agenda fiscal no tuvo hecho nuevo este lunes que moviera precios, y el registro del día viene del Boletín Focus: el mercado AMPLIÓ la apuesta por recortes de tasas y pasó a ver la Selic en 13,75% a fines de 2026 (O Globo, 03/Ago). Es la primera reducción de la proyección de tasas desde el inicio de la guerra en Irán, según Folha, y el Copom entra en un horizonte mejor, aunque la inflación siga siendo el desafío.`,
  'cards.inss.text2':
    `EL CONTRATO DE INFLACIÓN DEL PANEL ES COHERENTE CON ESA LECTURA. La franja de 5,00% a 5,49% concentra 36,60%, seguida de la franja de 4,50% a 4,99% con 29,95% y la de 5,50% a 5,99% con 12,00%. Las diez franjas suman 99,65%, dentro de la compuerta de coherencia de 95% a 105%, y la cola de descontrol es fina: la franja de 7,00% o más paga 1,25%. Es decir, el mercado descuenta inflación persistente por encima del centro de la meta, y no una ruptura.`,
  'cards.inss.text3':
    `En el mercado electoral, la diferencia se cerró de +40,95pp a +40,05pp, con Lula QUIETO en 65,50% (vol USD 7,92M) y Flávio subiendo 0,90pp. El movimiento vino junto con la encuesta de ${G('BTG/Nexus', 'nexus-btg')}, que cortó la diferencia de 1ª vuelta de 9pp a 4pp. Se registra la coincidencia de dirección, sin atribuir causa: nada en las noticias fiscales del día explica los dos movimientos.`,
  'cards.inss.text4':
    `En el Senado, el ${G('PL', 'pl')} SUBIÓ 2,50pp hasta 75,00% (vol USD 259 mil), y el ${G('MDB', 'mdb')} CAYÓ 0,15pp, hasta 18,60%, en un libro de USD 8 mil que no sostiene lectura fina. El contrato de destitución de un ministro del ${G('STF', 'stf')} antes de 2027 quedó ESTABLE en 3,10% (vol USD 83 mil), sin variación en las lecturas de la traba de captura.`,
  'cards.inss.impactoLula':
    `La ronda de ${G('BTG/Nexus', 'nexus-btg')} de hoy NO publicó aprobación ni desaprobación, así que el cuadro de evaluación sigue sin lectura nueva desde el 30/Jul y continúa con dos casas apuntando a lados opuestos. Las dos nacionales que faltan de la ventana, ${G('Quaest', 'quaest')} e Ideia/Canal Meio, tienen publicación declarada para el 05/Ago, y es ahí donde el cuadro puede rehacerse.`,
  'cards.inss.impactoGestao':
    `Sin ronda nueva de evaluación de gestión. Permanece el registro del 30/Jul, con PoderData/Aya señalando 34% de excelente o bueno contra 47% de malo o pésimo, y el malo o pésimo subiendo 10pp en dos semanas dentro de la propia casa. El panel no mezcla ese dato con la lectura de intención de voto de hoy, que es de otra casa y de otro campo.`,
  'cards.inss.conclusao':
    `A 62 días de la elección, el día trajo encuesta nueva y un precio moviéndose en el mismo sentido que ella, algo que no venía ocurriendo. La diferencia se cerró 0,90pp en el mercado y 5pp en la encuesta de la misma casa, y en ambos el mecanismo es idéntico: el líder quieto y el rival subiendo. La salvedad que impide la lectura fácil es la dispersión: los 4pp de Nexus contrastan con 6pp de PoderData, 9,1pp de ${G('AtlasIntel', 'atlasintel')} y 9,3pp de Vox Brasil, todas divulgadas desde el 29/Jul, y la distancia entre la más alta y la más baja llega a 5,3pp, mayor que cualquier movimiento de precio del período.`,
  'cards.bancoMaster.text1':
    `El caso ${G('Banco Master', 'banco-master')} tuvo movimiento de investigación este lunes: la Policía Federal APLAZÓ la declaración de Augusto Lima, ex socio de Daniel Vorcaro, tras un pedido de la defensa (G1, 03/Ago). Es el segundo aplazamiento en el bloque de audiencias de la investigación, y el panel registra el acto sin inferir intención.`,
  'cards.bancoMaster.text2':
    `En el plano judicial paralelo, la familia de Alexandre de Moraes PERDIÓ una acción contra un senador que citó públicamente su vínculo con el Banco Master (VEJA, 03/Ago). El registro importa porque mide el costo institucional del caso, que ya salió de la esfera puramente penal y entra en disputa reputacional entre Poderes.`,
  'cards.bancoMaster.text3':
    `En el frente legislativo sigue sin novedad, y la ausencia continúa siendo el hecho: el recurso sobre la instalación de la comisión investigadora del Banco Master permanece sin decisión. El mercado no descontó nada de eso: el contrato de destitución de un ministro del ${G('STF', 'stf')} quedó ESTABLE en 3,10% (vol USD 83 mil) el mismo día de esas dos noticias.`,
  'cards.bancoMaster.conclusao':
    `Los frentes del caso siguen en carriles separados y ninguno movió precio hoy. El penal avanza despacio, con una declaración aplazada a pedido de la defensa. El reputacional ganó un capítulo con la derrota de la familia de Moraes en la Justicia. El legislativo continúa detenido en el recurso. Un día con dos noticias del caso y CERO variación en el contrato de destitución es la lectura más informativa aquí: el mercado no trata un hecho judicial aislado como riesgo de ruptura.`,
  'cards.stf.toffoli':
    `Toffoli sigue aislado en el ${G('STF', 'stf')} tras la crisis del Master, sin acto individual nuevo capturado este lunes.`,
  'cards.stf.moraes':
    `Sin resolución nueva de Moraes en el período. El registro del día es indirecto y viene de fuera del tribunal: su familia PERDIÓ una acción contra un senador que citó su vínculo con el ${G('Banco Master', 'banco-master')} (VEJA, 03/Ago).`,
  'cards.stf.gilmar':
    `Sin acto individual de Gilmar en el período. Permanece el voto conjunto reciente, con Dino, Moraes y Zanin, que redujo restricciones al embargo de bienes.`,
  'cards.stf.dino':
    `Sin acto nuevo este lunes. Sigue corriendo el plazo dado el 29/Jul para que el gobierno y el Congreso especifiquen la responsabilidad sobre las enmiendas presupuestarias.`,
  'cards.stf.mendonca':
    `Sigue como relator del caso Master, cuya investigación tuvo movimiento hoy: la Policía Federal aplazó la declaración de Augusto Lima, ex socio de Vorcaro, a pedido de la defensa.`,
  'cards.stf.nexo':
    `El nexo de este lunes es DOBLE y los dos no se cruzan. Por un lado, la disputa electoral tuvo el día más movido de la semana, con ${G('BTG/Nexus', 'nexus-btg')} cortando la diferencia de 1ª vuelta de 9pp a 4pp y el mercado cerrando la diferencia de +40,95pp a +40,05pp. Por otro, el eje judicial tuvo tres hechos relevantes: Fachin defendió que el ${G('STF', 'stf')} conviva con la contestación de la opinión pública, diciendo que eso fortalece la democracia (Folha y O Globo, 03/Ago); la Policía Federal pidió al STF la apertura de un TERCER expediente contra Lulinha, por sospecha de tráfico de influencias; y la Policía Federal aplazó una audiencia en el caso Master. El contrato de destitución no se movió con nada de eso.`,
  'cards.stf.analise':
    `El contrato de destitución de un ministro del ${G('STF', 'stf')} antes de 2027 quedó ESTABLE en 3,10% (vol USD 83 mil) por segunda rueda seguida, y quedó estable en un día con tres hechos institucionales relevantes: la declaración de Fachin sobre la contestación al tribunal, el pedido de la Policía Federal por un tercer expediente contra Lulinha y el aplazamiento de una audiencia en el caso Master. Es un libro pequeño, así que un movimiento pequeño diría poco, pero NINGÚN movimiento en un día cargado es un registro en sí: el mercado separa la fricción institucional del riesgo de ruptura. Vale la salvedad de siempre: con USD 83 mil acumulados, este es el contrato más fino entre los que el panel publica, y su lectura no sostiene la misma confianza que los mercados presidenciales, que negocian en millones.`,
})
