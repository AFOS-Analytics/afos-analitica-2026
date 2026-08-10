/**
 * Mapa ES de 10/Ago para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar. "estancado", nunca "parado".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const PRECIO = 'lectura confirmada del 9/Ago, 17:34 UTC'

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 10/Ago, a 55 días de la ${G('primera vuelta', 'primeiro-turno')}. DOS NACIONALES NUEVAS: BTG/Nexus (n=2.001, telefónica, BR-08428/2026) y el estreno de Palver (n=5.000, online, BR-06596/2026), ambas publicadas hoy. Los precios de esta página son de la ${PRECIO}, porque no hay lectura de precio nueva el 10/Ago.`,

  // ================= LULA =================
  'candidates[0].header':
    `DOS ENCUESTAS NUEVAS Y DISCREPAN ENTRE SÍ: BTG/Nexus le da 40% en la primera vuelta y Palver le da 44%, con segundas vueltas de 47% x 44% y de 46% x 46%. En las cuatro nacionales desde el 5/Ago varía de 39% a 44%, un rango de 5pp. Precio de la ${PRECIO}: 63,50% (vol USD 8,18M acumulado). No hay lectura de precio nueva el 10/Ago, y por eso esta página no registra movimiento de precio en el día.`,
  'candidates[0].fortes[0]':
    `Lidera la primera vuelta en las CUATRO nacionales de la ventana, sin excepción: 39% en Quaest el 5/Ago, 43% en Ideia el mismo día, 40% en BTG/Nexus hoy y 44% en Palver hoy.`,
  'candidates[0].fortes[1]':
    `La BTG/Nexus de hoy pone la diferencia de la primera vuelta FUERA del margen de 2pp, con 40% contra 35%, y es la propia casa que en la ronda del 3/Ago había registrado 41% contra 37%.`,
  'candidates[0].fortes[2]':
    `Gana o empata las segundas vueltas de las cuatro rondas, y en la peor de ellas, Palver, empata en 46% x 46%.`,
  'candidates[0].fortes[3]':
    `La dispersión entre casas es MENOR de su lado: en la primera vuelta las cuatro lecturas caben en un rango de 5pp, contra 10pp de su adversario.`,
  'candidates[0].fortes[4]':
    `Precio de la ${PRECIO} en 63,50%, con USD 8,18M de volumen acumulado, y la serie de 89 días tiene un techo de 66,50%, del 1/Ago.`,
  'candidates[0].fracos[0]':
    `LA APROBACIÓN EMPEORÓ EN LAS DOS LECTURAS DE HOY: 46% contra 49% en BTG/Nexus, frente a 47% x 48% en la propia ronda del 3/Ago, y 45% contra 55% en Palver, el saldo más negativo de la ventana.`,
  'candidates[0].fracos[1]':
    `RECHAZO en 48% en BTG/Nexus y 52% en Palver, y en Palver él es el MÁS rechazado de los dos, invirtiendo el orden que muestra Nexus.`,
  'candidates[0].fracos[2]':
    `En la segunda vuelta de Palver el empate en 46% x 46% es el peor escenario de segunda vuelta que cualquier nacional de la ventana le ha dado.`,
  'candidates[0].fracos[3]':
    `La diferencia de mercado venía estrechándose: cayó en seis de las siete últimas jornadas, de +38,90pp el 3/Ago a +36,55pp en la lectura del 9/Ago.`,
  'candidates[0].fracos[4]':
    `Salvedad de serie que sigue valiendo: 13 de los 89 días tuvieron un precio igual o superior a 63,50%, así que el nivel actual no es extremo.`,
  'candidates[0].analise':
    `EL DÍA TRAJO ENCUESTAS, NO PRECIO, y por ahí tiene que empezar la lectura. Salieron dos nacionales y miden la misma disputa con resultados distintos: BTG/Nexus, telefónica, da 40% x 35% en la primera vuelta y 47% x 44% en la segunda; Palver, online y con n=5.000, da 44% x 40% y empate en 46% x 46%. Sumadas a las dos del 5/Ago, son cuatro nacionales en seis días, y él aparece entre 39% y 44%. LO QUE MUESTRA LA COMPARACIÓN DENTRO DE LA CASA es lo inverso de lo que mostró la semana pasada: el 3/Ago BTG/Nexus había estrechado la primera vuelta de 9pp a 4pp, y ahora se abrió de nuevo, a 5pp, con los dos cediendo y el adversario cediendo más. En la segunda vuelta de la misma casa la distancia pasó de 1pp a 3pp. LA APROBACIÓN SE MOVIÓ PARA EL OTRO LADO, y en las dos lecturas: 46% contra 49% en Nexus y 45% contra 55% en Palver. En cinco lecturas de ocho días el saldo va de 1pp positivo a 10pp negativo, y la desaprobación aislada va de 47% a 55%. EN EL PRECIO no hay novedad que registrar: el valor confirmado más reciente es el del 9/Ago a las 17:34 UTC, 63,50% con USD 8,18M de volumen acumulado, y esta página no atribuye movimiento a hoy porque no hay lectura de hoy con la cual comparar. EL CRUCE QUE INTERESA es de dirección: en la misma semana en que la diferencia de mercado se estrechó en seis de las siete últimas jornadas, la diferencia de BTG/Nexus se abrió en las dos vueltas. Los dos instrumentos se movieron en sentidos opuestos, y el panel lo registra sin decir cuál está en lo cierto.`,

  // ================= FLÁVIO =================
  'candidates[1].header':
    `LA DISPERSIÓN ENTRE CASAS ES SU NÚMERO DE HOY: en las cuatro nacionales desde el 5/Ago aparece con 30%, 35%, 35% y 40% en la primera vuelta, un rango de 10pp, el doble que el del líder. Las dos de hoy dan 35% en BTG/Nexus y 40% en Palver. Precio de la ${PRECIO}: 26,95% (vol USD 8,09M acumulado), sin lectura nueva el 10/Ago.`,
  'candidates[1].fortes[0]':
    `La Palver de hoy trae el mejor resultado que cualquier nacional le ha dado en la ventana: 40% en la primera vuelta y EMPATE en 46% x 46% en la segunda.`,
  'candidates[1].fortes[1]':
    `Es la primera vez en la ventana que una nacional no muestra derrota suya en la segunda vuelta contra Lula, aunque sea por empate en el número y no por ventaja.`,
  'candidates[1].fortes[2]':
    `En BTG/Nexus la distancia de la segunda vuelta es de 3pp, que la propia divulgación trata como empate técnico dentro del margen de 2pp.`,
  'candidates[1].fortes[3]':
    `Esa misma ronda de BTG/Nexus también apunta a un empate suyo en el enfrentamiento de Lula contra Caiado, lo que indica que el problema de la segunda vuelta no es exclusivo de su nombre.`,
  'candidates[1].fortes[4]':
    `Precio de la ${PRECIO} en 26,95%, con USD 8,09M de volumen acumulado, y 30 de los 89 días de la serie tuvieron un valor igual o superior.`,
  'candidates[1].fracos[0]':
    `EL RANGO DE 10pp ENTRE CASAS ES SU PROBLEMA DE LECTURA: 30% en Quaest, 35% en Ideia, 35% en BTG/Nexus y 40% en Palver, y elegir una de ellas es elegir la conclusión.`,
  'candidates[1].fracos[1]':
    `En BTG/Nexus CEDIÓ 2pp frente a la propia ronda del 3/Ago, de 37% a 35%, y la diferencia de la primera vuelta se abrió de 4pp a 5pp por eso.`,
  'candidates[1].fracos[2]':
    `La diferencia de 5pp en la primera vuelta de BTG/Nexus queda FUERA del margen de 2pp, es decir, ahí no es empate.`,
  'candidates[1].fracos[3]':
    `RECHAZO en 50% en BTG/Nexus, el más alto de la ronda, y en 51% en Palver, donde queda solo por detrás del líder.`,
  'candidates[1].fracos[4]':
    `Su precio confirmado sigue en 26,95%, y la serie de 89 días tiene un techo de 43,30%, del 12/May, con un piso de 22,00%, del 3/Jul.`,
  'candidates[1].analise':
    `EL NÚMERO MÁS INFORMATIVO SOBRE ÉL HOY NO ES UN NÚMERO, ES UN RANGO. En las cuatro nacionales publicadas desde el 5/Ago aparece con 30%, 35%, 35% y 40% en la primera vuelta, y la distancia entre la lectura más alta y la más baja llega a 10pp. Del lado del líder ese mismo rango es de 5pp. Es decir, la incertidumbre de medición está concentrada en él, y cualquier titular que fije un valor está eligiendo una casa. LAS DOS DE HOY ILUSTRAN LA DISTANCIA: BTG/Nexus, telefónica, da 35% y derrota en la segunda vuelta por 47% x 44%; Palver, online, da 40% y EMPATE en 46% x 46%, que es el mejor escenario que ha obtenido en la ventana. DENTRO DE SU PROPIA CASA el movimiento fue en su contra: BTG/Nexus tenía 37% el 3/Ago y ahora tiene 35%, y la diferencia de la primera vuelta se abrió de 4pp a 5pp precisamente por eso. Es lo inverso de lo que mostró la misma serie hace una semana, cuando el estrechamiento de 9pp a 4pp fue impulsado por una subida suya. EL RECHAZO SIGUE SIENDO EL TECHO: 50% en Nexus y 51% en Palver, y en ambas queda en la cima o a un punto de ella. EN EL PRECIO no hay lectura nueva el 10/Ago; el valor confirmado es el del 9/Ago a las 17:34 UTC, 26,95% con USD 8,09M acumulados. EN EL TABLERO, Folha de S.Paulo informó el 10/Ago que el presidente de la Cámara declaró apoyo a su adversario después de que su propio partido rechazara una coalición con él, y Estadão y O Globo publicaron un recorte estatal de Ideia/ACSP en São Paulo en el que hace 44% contra 39% en la segunda vuelta, dato de alcance estatal y que por eso no entra en el panel nacional.`,

  // ================= RENAN =================
  'candidates[2].header':
    `EL CASO DE MÉTODO DEL DÍA ES ÉL, Y QUIEN LO DECLARÓ FUE EL INSTITUTO: Palver, online, le da 10%, contra 4% en BTG/Nexus por teléfono el mismo día, y 4% y 4,7% en las dos del 5/Ago. La propia Palver evaluó que el formato digital pudo haber impulsado su desempeño. Precio de la ${PRECIO}: 7,80% (vol USD 9,27M acumulado).`,
  'candidates[2].fortes[0]':
    `La Palver de hoy le da 10% y lo coloca AISLADO en tercer lugar, el mejor resultado suyo en cualquier nacional de la ventana.`,
  'candidates[2].fortes[1]':
    `Mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,27M en la lectura del 9/Ago, por encima del volumen del propio líder.`,
  'candidates[2].fortes[2]':
    `El precio de mercado, en 7,80%, está POR ENCIMA de todas las lecturas por teléfono y presenciales, que quedan entre 4% y 4,7%.`,
  'candidates[2].fortes[3]':
    `Aparece por delante de Caiado y de Zema en Palver, invirtiendo el orden que mostraba la Ideia del 5/Ago, en la que Caiado tenía 5,7% contra sus 4,7%.`,
  'candidates[2].fortes[4]':
    `La salvedad de método vino de la casa que lo midió alto, y no de quienes lo miden bajo, lo que reduce la posibilidad de que el número sea una lectura sesgada de un solo lado.`,
  'candidates[2].fracos[0]':
    `LA PROPIA PALVER DECLARÓ LA SALVEDAD: evaluó que el formato digital pudo haber impulsado su desempeño, ya que mantiene una base activa en ese entorno, e informó que prueba enfoques para reducir ese efecto en encuestas online.`,
  'candidates[2].fracos[1]':
    `En las tres nacionales por teléfono o presenciales de la ventana queda entre 4% y 4,7%, y la lectura de 10% es la única fuera de ese intervalo.`,
  'candidates[2].fracos[2]':
    `El mercado lo descuenta cerca del PISO de su propia serie: 84 de los 88 días tuvieron un valor igual o superior al actual, y el mínimo del período fue 6,80%, el 6/Ago.`,
  'candidates[2].fracos[3]':
    `Pierde las segundas vueltas con holgura en las rondas que lo prueban, y en la Quaest del 5/Ago la derrota es de 45% x 35%.`,
  'candidates[2].fracos[4]':
    `La prensa del 10/Ago publicó dos notas cuestionando si la encuesta online sobredimensiona su desempeño, lo que convierte los 10% en un dato bajo discusión pública y no en un nivel consolidado.`,
  'candidates[2].analise':
    `ESTE ES EL CRUCE MÁS LIMPIO QUE EL PANEL PUEDE MOSTRAR, Y NO DEPENDE DE NINGÚN JUICIO. El mismo nombre, en la misma semana, aparece con 4% en Genial/Quaest presencial del 5/Ago, con 4,7% en Meio/Ideia por teléfono del mismo día, con 4% en BTG/Nexus por teléfono hoy, y con 10% en Palver por internet, también hoy. La diferencia entre la lectura más alta y la más baja es de 6pp en un candidato que ninguna casa pone en dos dígitos por teléfono. LA SALVEDAD NO ES NUESTRA, ES DE LA CASA: Palver evaluó que el formato digital pudo haber impulsado su desempeño, ya que mantiene una base activa en ese entorno, y dijo que prueba enfoques para reducir ese efecto en encuestas online. El panel repite su declaración en lugar de juzgar el número, porque medir y juzgar son cosas distintas. Y EL PRECIO QUEDA ENTRE LOS DOS MÉTODOS: 7,80% en la lectura confirmada del 9/Ago, por encima del 4% a 4,7% del teléfono y del presencial, por debajo del 10% de internet. PERO EL PRECIO NO ESTÁ ALTO EN SU PROPIA HISTORIA: 84 de los 88 días de la serie tuvieron un valor igual o superior, con un máximo de 17,90% el 9/Jun. Es decir, está cerca del piso del mercado al mismo tiempo que registra su techo en las encuestas, y las dos cosas son verdad en la misma semana.`,

  // ================= CAIADO / HADDAD / ZEMA =================
  'candidates[3].header':
    `CAIADO EMPATA CON LULA EN LA SEGUNDA VUELTA DE BTG/NEXUS, y es el dato que cambia la lectura sobre él: la misma ronda que da derrota de 47% x 44% al segundo colocado apunta a un empate en el enfrentamiento contra Caiado. En la primera vuelta tiene 5% en Nexus. Precios de la ${PRECIO}: Caiado 1,25% (vol USD 5,60M), Zema 0,45% (vol USD 5,02M) y Haddad 0,05%.`,
  'candidates[3].fortes[0]':
    `CAIADO EMPATA CON LULA en la segunda vuelta de la BTG/Nexus de hoy, según la divulgación de la ronda, y es el único nombre fuera de los dos primeros que lo consigue en la ventana.`,
  'candidates[3].fortes[1]':
    `Caiado tiene 5% en la primera vuelta de BTG/Nexus, por delante de Renan Santos, con 4%, y de Zema, con 3%.`,
  'candidates[3].fortes[2]':
    `En la Meio/Ideia del 5/Ago, Caiado es el adversario que más se acerca en la segunda vuelta, con 40% contra 48,5%.`,
  'candidates[3].fortes[3]':
    `Zema registró su candidatura ante el ${G('TSE', 'tse')} el 6/Ago y sigue siendo el único del pelotón con registro presentado, en un plazo que se cierra el 15/Ago.`,
  'candidates[3].fortes[4]':
    `La Palver de hoy no prueba a Caiado ni a Zema en el escenario publicado, de modo que la ausencia de lectura se registra como ausencia, y no se rellena con dato antiguo.`,
  'candidates[3].fracos[0]':
    `El precio de Caiado, en 1,25% en la lectura del 9/Ago, es decenas de veces menor que su intención declarada, que va de 4% a 5,7% en las nacionales de la ventana.`,
  'candidates[3].fracos[1]':
    `Zema sigue en 0,45%, POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido.`,
  'candidates[3].fracos[2]':
    `Palver, con la mayor muestra del día, no los incluye en el escenario publicado, lo que reduce la base de comparación entre casas para los dos.`,
  'candidates[3].fracos[3]':
    `HADDAD NO ES CANDIDATO A LA PRESIDENCIA y disputa la gobernación de São Paulo, así que cualquier escenario que lo incluya es una hipótesis de encuesta, no una candidatura en curso.`,
  'candidates[3].fracos[4]':
    `Ninguno de los tres aparece en los libros secundarios con un precio que sostenga una lectura de movimiento: los contratos son delgados y la variación en ellos exige salvedad.`,
  'candidates[3].analise':
    `EL DATO NUEVO ES DE CAIADO Y VIENE DE LA SEGUNDA VUELTA. La BTG/Nexus de hoy apunta a un empate de Lula con él, en la misma ronda en la que el líder vence al segundo colocado por 47% x 44%. Sumado a los 40% contra 48,5% en la Meio/Ideia del 5/Ago, el cuadro es el de un tercer nombre que aparece mejor en el enfrentamiento directo que en la largada, y es exactamente lo opuesto de lo que muestra el precio: 1,25% en la lectura confirmada del 9/Ago, contra 4% a 5,7% de intención declarada. EL PANEL NO RESTA UNO DEL OTRO, porque las dos magnitudes no son la misma: la encuesta mide intención ahora y el contrato mide probabilidad de ganar al final. Lo que el panel registra es que la distancia entre ellas es la mayor del pelotón. ZEMA sigue en 0,45% y por debajo del corte de 0,5% que el panel usa para separar precio de ruido, y la lectura sobre él queda suspendida mientras esté en esa franja. LA AUSENCIA TAMBIÉN ES INFORMACIÓN: Palver, que es la mayor muestra del día con n=5.000, no publicó escenario con los dos, y el panel registra la ausencia en lugar de repetir un número antiguo como si fuera nuevo. HADDAD sigue sin encuesta y sin candidatura presidencial, disputando la gobernación de São Paulo.`,

  // ================= CUADRO COMPARATIVO =================
  'quadroComparativo[0].p':
    `DOS NACIONALES NUEVAS EL 10/Ago. BTG/Nexus (n=2.001, telefónica, BR-08428/2026): 40% en la primera vuelta y 47% x 44% en la segunda. Palver (n=5.000, online, BR-06596/2026): 44% y empate en 46% x 46%. En las cuatro rondas desde el 5/Ago va de 39% a 44%. LA APROBACIÓN empeoró en las dos: 46% x 49% y 45% x 55%.`,
  'quadroComparativo[0].m': `63,50% (vol USD 8,18M acumulado), ${PRECIO}`,
  'quadroComparativo[0].t':
    `SIN LECTURA DE PRECIO NUEVA EL 10/Ago. El valor confirmado más reciente sigue siendo el del 9/Ago a las 17:34 UTC. En la semana hasta ahí, la diferencia sobre Flávio se estrechó en seis de las siete jornadas, de +38,90pp el 3/Ago a +36,55pp.`,
  'quadroComparativo[0].s':
    `55 días de la elección. Las campañas lanzaron sus lemas el 10/Ago, y él y Alckmin presentaron un programa de gobierno con énfasis en soberanía, economía, seguridad y medio ambiente. Folha de S.Paulo informó del apoyo del presidente de la Cámara, después de que el partido de este rechazara una coalición con el adversario. Lanzamiento oficial el 16/Ago, en Vila Euclides.`,

  'quadroComparativo[1].p':
    `DOS NACIONALES NUEVAS. BTG/Nexus: 35% en la primera vuelta, contra 37% en la propia ronda del 3/Ago, y derrota de 47% x 44% en la segunda. Palver: 40% y EMPATE en 46% x 46%, el mejor escenario que ha obtenido en la ventana. En las cuatro rondas desde el 5/Ago va de 30% a 40%, un rango de 10pp. RECHAZO de 50% y 51%.`,
  'quadroComparativo[1].m': `26,95% (vol USD 8,09M), ${PRECIO}`,
  'quadroComparativo[1].t':
    `SIN LECTURA DE PRECIO NUEVA EL 10/Ago. El valor confirmado sigue siendo el del 9/Ago a las 17:34 UTC, que era el tercer día en el mismo nivel. En el libro de segundo lugar, el último valor confirmado es 81,50%.`,
  'quadroComparativo[1].s':
    `Estadão y O Globo publicaron un recorte ESTATAL de Ideia/ACSP en São Paulo, con 44% contra 39% en la segunda vuelta, dato que no entra en el panel nacional por alcance. Su vice sigue en la lista de enmiendas Pix que Dino mandó investigar. Una ronda de Quaest indica que el apoyo de Milei a él aumenta la probabilidad de voto al adversario.`,

  'quadroComparativo[2].p':
    `EL CASO DE MÉTODO DE LA SEMANA. Palver, online: 10%, aislado en tercer lugar. BTG/Nexus, telefónica, el mismo día: 4%. Quaest presencial del 5/Ago: 4%. Ideia por teléfono: 4,7%. LA PROPIA PALVER declaró que el formato digital pudo haber impulsado su desempeño y que prueba enfoques para reducir el efecto.`,
  'quadroComparativo[2].m': `7,80% (vol USD 9,27M), ${PRECIO}`,
  'quadroComparativo[2].t':
    `SIN LECTURA DE PRECIO NUEVA EL 10/Ago. El valor confirmado del 9/Ago, 7,80%, queda ENTRE los dos métodos: por encima del 4% a 4,7% del teléfono y del presencial, por debajo del 10% de internet. Y está cerca del piso de su propia serie: 84 de los 88 días tuvieron un valor igual o superior.`,
  'quadroComparativo[2].s':
    `Mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,27M. Dos notas del 10/Ago, en UOL y CartaCapital, discuten si la encuesta online sobredimensiona su desempeño.`,

  'quadroComparativo[3].p':
    `DATO NUEVO EN LA SEGUNDA VUELTA: la BTG/Nexus de hoy apunta a un EMPATE de Lula con él, en la misma ronda en la que el líder vence al segundo colocado por 47% x 44%. En la primera vuelta tiene 5%, por delante de Renan Santos y de Zema. Palver no lo prueba en el escenario publicado, y la ausencia queda registrada como ausencia.`,
  'quadroComparativo[3].m': `1,25% (vol USD 5,60M), ${PRECIO}`,
  'quadroComparativo[3].t':
    `SIN LECTURA DE PRECIO NUEVA EL 10/Ago. El valor confirmado es el del 9/Ago, que cerraba el tercer día seguido de caída en los dos libros, con 25,50% en el de tercer lugar.`,
  'quadroComparativo[3].s':
    `Es el nombre con la MAYOR distancia entre encuesta y precio del pelotón: de 4% a 5,7% de intención declarada contra 1,25% de probabilidad descontada. El panel registra la distancia sin restar una magnitud de la otra, porque miden cosas distintas.`,

  'quadroComparativo[4].p':
    `Ninguna de las dos rondas de hoy lo prueba en el escenario publicado. Siguen valiendo los 3% de BTG/Nexus en la primera vuelta, los 2% de Quaest y los 2,6% de Ideia, ambas del 5/Ago. En las segundas vueltas de aquellas dos, 34% contra 46% y 37% contra 48,5%.`,
  'quadroComparativo[4].m': `0,45% (vol USD 5,02M), ${PRECIO}`,
  'quadroComparativo[4].t':
    `SIN LECTURA DE PRECIO NUEVA EL 10/Ago. El valor confirmado del 9/Ago, 0,45%, está POR DEBAJO del corte de 0,5% que el panel usa para separar precio de ruido, y la lectura sobre él queda suspendida mientras esté en esa franja.`,
  'quadroComparativo[4].s':
    `Registró su candidatura ante el ${G('TSE', 'tse')} el 6/Ago, declarando R$ 178,7 millones de patrimonio, y sigue siendo el único del pelotón con registro presentado. El plazo se cierra el 15/Ago.`,

  'quadroComparativo[5].m': `3,60% (vol USD 83 mil), ${PRECIO}`,
  'quadroComparativo[5].t':
    `SIN LECTURA DE PRECIO NUEVA EL 10/Ago. El valor confirmado es el del 9/Ago, 3,60%. Sigue siendo el contrato más delgado entre los seguidos, y cualquier movimiento en él exige una lectura con esa salvedad.`,
  'quadroComparativo[5].s':
    `Sigue valiendo la decisión de Dino que ordenó a la Policía Federal investigar R$ 55,4 millones en enmiendas Pix señaladas por el TCU. En el caso Master, Poder360 publicó el 10/Ago que dos ministros favorecieron un negocio que enriqueció a Vorcaro, y una asamblea estatal traba la apertura de una CPI sobre inversiones de un instituto de previsión en el banco.`,

  cruzamento:
    `EL DÍA TRAJO ENCUESTAS Y NO TRAJO PRECIO, Y LA LECTURA EMPIEZA POR AHÍ. Los valores de esta página son de la ${PRECIO}, porque no hay lectura de precio nueva el 10/Ago, y por eso ninguna línea aquí atribuye movimiento de precio al día de hoy. SALIERON DOS NACIONALES, y lo que muestran juntas vale más que cada una por separado. BTG/Nexus, telefónica, n=2.001, da una primera vuelta de 40% x 35% y una segunda de 47% x 44%. Palver, que estrena en el panel con n=5.000 y cuestionario por internet, da 44% x 40% y EMPATE en 46% x 46%. Las dos midieron la misma semana. LO PRIMERO QUE HAY QUE REGISTRAR ES EL RANGO, NO EL PUNTO: sumando las cuatro nacionales desde el 5/Ago, Lula va de 39% a 44% y Flávio va de 30% a 40%. La incertidumbre de medición está concentrada en el segundo colocado, con el doble de amplitud que el primero, y en la segunda vuelta la distancia entre ellos va de 0pp a 5,5pp según la casa. Elegir una encuesta es elegir una conclusión, y por eso el panel publica el conjunto. LO SEGUNDO ES UN EFECTO DE MÉTODO DECLARADO POR LA PROPIA CASA QUE LO PRODUJO. Renan Santos aparece con 4% en Quaest presencial, 4,7% en Ideia por teléfono, 4% en BTG/Nexus por teléfono y 10% en Palver por internet. Palver evaluó que el formato digital pudo haber impulsado su desempeño, ya que mantiene una base activa en ese entorno, e informó que prueba enfoques para reducir ese efecto. Su precio confirmado, 7,80%, queda ENTRE los dos métodos. Y al mismo tiempo cerca del piso de su propia serie, con 84 de los 88 días en un valor igual o superior: techo en la encuesta y piso en el precio, en la misma semana. LO TERCERO ES DE DIRECCIÓN, Y ES EL CRUCE CENTRAL DE LA RONDA. En la semana en que la diferencia de mercado se ESTRECHÓ, cayendo en seis de las siete últimas jornadas, de +38,90pp el 3/Ago a +36,55pp el 9/Ago, la diferencia de BTG/Nexus se ABRIÓ dentro de su propia casa, de 4pp a 5pp en la primera vuelta y de 1pp a 3pp en la segunda. Los dos instrumentos se movieron en sentidos opuestos sobre la misma disputa y en la misma ventana. El panel registra el cruce y no dice cuál está en lo cierto, porque no lo sabe, y porque decirlo sería cambiar medición por opinión. LO CUARTO ES LA APROBACIÓN, que empeoró en las dos lecturas de hoy y amplió la dispersión: 46% x 49% en BTG/Nexus, contra 47% x 48% en la propia ronda del 3/Ago, y 45% x 55% en Palver. En cinco lecturas de ocho días el saldo va de 1pp positivo a 10pp negativo y la desaprobación aislada va de 47% a 55%. Antes el SIGNO del saldo ya dependía de la casa; ahora el TAMAÑO también depende.`,
})
