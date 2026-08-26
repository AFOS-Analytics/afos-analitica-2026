/**
 * Mapa ES de 26/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções ES: VÍRGULA decimal e PONTO de milhar, igual ao pt-BR.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem.
 * 🏷️ `parado` é `estancado`; `precificar` é `descontar`; `estadual` é `estatal`.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/es/glossary#${id})`
const S = 'lectura confirmada del 26/Ago, 15:19 BRT (18:19 UTC)'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `El libro presidencial acumula USD 133,35M y el precio de esta página es de la ${S}. El día tuvo DOS encuestas nacionales nuevas, Gerp e Indexa/Broadcast, y llegaron a resultados opuestos sobre la misma disputa.`,
  'cards.sentimento.text2':
    `En el precio, el líder quedó estancado en 62,50% por tercer día consecutivo y el segundo subió 0,90pp, hasta 35,55%. La distancia entre ambos cayó a 26,95pp, la más estrecha desde el 21/Jun, verificada en el respaldo de la base contra el registro completo desde el 14/Abr. Se estrechó por un solo lado, porque quien se movió fue el segundo.`,
  'cards.sentimento.text3':
    `El mayor movimiento del día no está en el contrato de ganador. Está en el de tercer lugar de la ${G('primera vuelta', 'primeiro-turno')}, donde Renan Santos cedió 6,00pp hasta 45,50% y Ronaldo Caiado cedió 3,00pp hasta 39,00%. Los dos cayeron y la distancia entre ellos se acortó de 9,50pp a 6,50pp. Este miércoles Lula acudió al TSE contra ambos por ataques en el debate, y las dos encuestas nuevas discreparon sobre cuál de ellos es el tercero en la urna. El panel registra la coincidencia de fechas y no atribuye causa.`,
  'cards.sentimento.direita':
    `Flávio Bolsonaro en 35,55% en el presidencial, alza de 0,90pp, la mayor del día entre los contratos de ganador, y su nivel más alto desde el 13/May. En el contrato de segundo lugar de la primera vuelta quedó estancado en 87,50%. En la urna, Gerp lo coloca adelante en la primera vuelta con 38% frente a 37%, e Indexa lo coloca atrás con 34% frente a 39%.`,
  'cards.sentimento.esquerda':
    `Lula en 62,50%, sin variación por tercer día consecutivo. En la urna, las dos encuestas nuevas lo ponen por debajo del 41% de ${G('BTG/Nexus', 'nexus-btg')} del 24/Ago: 39% en Indexa, con ventaja de 5 puntos, y 37% en Gerp, atrás por 1. La aprobación del gobierno aparece negativa en ambas, con 46% frente a 50% en Indexa y 43% frente a 51% en Gerp.`,
  'cards.sentimento.terceiraVia':
    `Aquí está el movimiento del día. Renan Santos cedió 6,00pp en el contrato de tercer lugar y llegó a 45,50%, mientras Ronaldo Caiado cedió 3,00pp y llegó a 39,00%. Los dos cayeron, y aun así la distancia entre ellos se acortó de 9,50pp a 6,50pp. En la urna las dos casas de hoy discrepan sobre ellos: Indexa da a Caiado adelante por 5% a 4% y Gerp da empate en 3%.`,
  'cards.sentimento.polymarket':
    `Precios de la ${S}. El AFOS solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp. Los nombres por debajo de 0,5% quedan fuera de esa vigilancia, porque en un libro delgado la oscilación no distingue movimiento de ruido.`,
  'cards.inss.text1':
    `⭐ EL HECHO NUEVO DEL 26/Ago ES DE INVESTIGACIÓN Y LLEGA POR EL FLANCO FAMILIAR DEL GOBIERNO. La Policía Federal afirma que un lobista pidió acción de Lulinha para cerrar negocios del llamado Careca do INSS con el gobierno, según Folha de S.Paulo. La investigación apunta a tres intentos frustrados de cerrar contrato en el Ministerio de Salud, según O Globo.`,
  'cards.inss.text2':
    `La Justicia negó el pedido de Lulinha para retirar el video en que Flávio Bolsonaro trata las sospechas de desvíos en el INSS, según O Globo, y Lula decidió endurecer el tono sobre las sospechas que involucran a su hijo, en un intento de alejar el desgaste electoral.`,
  'cards.inss.text3':
    `La distinción que el panel mantiene desde el inicio sigue vigente: una cosa es el efecto sobre la evaluación del gobierno, otra es el efecto sobre la intención de voto, y las dos no andan juntas por defecto. Este miércoles el caso ganó una tercera capa, la de campaña: Renan Santos quiere explotar el caso Lulinha en la entrevista del Jornal Nacional, según Folha de S.Paulo.`,
  'cards.inss.text4':
    `⚠️ El caso sigue vivo y sin desenlace. El mismo día la Policía Federal lanzó una operación contra fraude en beneficios con un perjuicio estimado de R$ 86 millones, y la Justicia liberó R$ 2,7 mil millones para el pago de atrasados del INSS. Son hechos de naturalezas distintas y el panel no los suma.`,
  'cards.inss.impactoLula':
    `No aislable, y hoy hay números nuevos para decirlo. Las dos nacionales divulgadas este miércoles lo miden en 37% y 39% en la primera vuelta, frente al 41% de BTG/Nexus del 24/Ago, y las tres tienen campo en ventanas que se superponen. La diferencia entre institutos es mayor que cualquier efecto que se pudiera atribuir al caso.`,
  'cards.inss.impactoGestao':
    `La evaluación sigue con saldo negativo y ahora en tres lecturas: 46% de aprobación frente a 50% de desaprobación en Indexa, 43% frente a 51% en Gerp, y 48% frente a 49% en BTG/Nexus del 24/Ago. Las tres coinciden en el signo y discrepan en el tamaño, con cinco puntos de amplitud entre ellas.`,
  'cards.inss.conclusao':
    `El 26/Ago el caso avanza por investigación policial y por decisión judicial, y entra en el calendario electoral por una tercera vía, la de la entrevista televisiva. El panel registra el avance y no lo convierte en pronóstico de voto: la distancia entre las dos encuestas del día es de diez puntos, y ningún efecto de caso es separable dentro de una amplitud así.`,
  'cards.bancoMaster.text1':
    `⭐ EL HECHO NUEVO DEL 26/Ago ES UNA DECLARACIÓN. Daniel Vorcaro declarará ante la Policía Federal en la investigación sobre los fraudes del Master, según O Globo. El mismo día la PF hizo un allanamiento en un instituto de previsión de Campo Grande por aportes hechos en el banco.`,
  'cards.bancoMaster.text2':
    `⚠️ El caso Dark Horse, en el Supremo, involucra sospechas sobre gastos de Vorcaro y sobre enmiendas parlamentarias, según O Globo. Ronaldo Caiado pidió este miércoles el levantamiento del secreto de los casos ligados al Master y defendió la posibilidad de juicio político a ministros del STF.`,
  'cards.bancoMaster.text3':
    `El panel separa las capas a propósito. Una declaración es un acto de investigación, un allanamiento en un fondo de previsión municipal es otro hecho, y el uso electoral del tema es un tercero. Este miércoles los tres aparecieron juntos: Tarcísio de Freitas afirmó que Flávio Bolsonaro ya explicó sus relaciones con Vorcaro, y militantes del PT empezaron a replicar un jingle que junta el caso al nombre del senador.`,
  'cards.bancoMaster.conclusao':
    `⭐ Y AQUÍ ESTÁ EL CRUCE DEL DÍA, porque esta vez quien liga el caso a la urna es el propio instituto que mide. El CEO de Indexa dijo a Estadão que Flávio Bolsonaro viene recuperando electores después del caso Master. El mismo día su precio subió 0,90pp, hasta el nivel más alto desde el 13/May, y el caso volvió al noticiero por una declaración y por una operación policial. El panel registra ambas cosas lado a lado y no decide cuál explica a la otra.`,
  'cards.stf.toffoli': `Sin acto individual nuevo capturado el 26/Ago.`,
  'cards.stf.moraes':
    `Sin acto individual nuevo de fondo el 26/Ago. Aparece en la cobertura por una autorización de rutina, para que un profesor particular entre en la casa de Jair Bolsonaro a dar clases a la hija del expresidente, y por análisis de la prensa sobre su posición después del juicio del 8 de enero.`,
  'cards.stf.gilmar': `Sin acto individual nuevo capturado el 26/Ago.`,
  'cards.stf.dino':
    `Sin acto individual nuevo el 26/Ago. Su decisión sobre enmiendas parlamentarias, que era el acto relevante del martes, sigue produciendo efecto en el noticiero de este miércoles, ahora entrelazada al caso Dark Horse, que involucra sospechas sobre gastos de Vorcaro y sobre enmiendas.`,
  'cards.stf.mendonca':
    `⭐ EL NOMBRE DEL DÍA EN EL TRIBUNAL ES ÉL, y por tres frentes distintos. Propuso al TSE una tesis para definir qué es un deepfake en las elecciones. Dijo que un ministro del STF tiene buen salario, pero no vive sin preocupaciones financieras. Y está en el centro de una crisis con la Policía Federal, con el abogado general presionado y riesgo de que un recurso abra brecha para una nulidad, según O Globo. Un relevamiento apunta que es el ministro que menos vota a favor de la campaña de Lula en el TSE.`,
  'cards.stf.nexo':
    `⭐ EL NEXO DEL DÍA ES ELECTORAL, NO PRESUPUESTARIO. La tesis de deepfake propuesta al TSE apunta directamente a la campaña en curso, y el mismo tribunal recibió este miércoles la acción de Lula contra Renan Santos y Ronaldo Caiado por ataques en el debate. El Supremo aparece hoy menos como fuente de riesgo fiscal y más como árbitro de lo que puede circular en la disputa.`,
  'cards.stf.analise':
    `El contrato de salida de un ministro del Supremo por juicio político antes de 2027 está en 3,40% (vol USD 84 mil), sin variación en la ${S}. Es el tercer día consecutivo en el mismo nivel. Este miércoles un candidato a la Presidencia defendió públicamente la posibilidad de juicio político a ministros y pidió el levantamiento del secreto de casos ligados al Master, y aun así el precio no se movió. Ese mercado es pequeño, así que el panel no trata la ausencia de movimiento como respuesta a nada: la trata como ausencia de negocio.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'es', {
  'subtitle':
    `Cruce del 26 de agosto de 2026: precio de Polymarket en ${S}, libro presidencial en USD 133,35M, contra DOS encuestas nacionales nuevas divulgadas hoy que se contradicen, Gerp (BR-03547/2026, campo del 21 al 25/Ago, n=2.400) e Indexa/Broadcast (BR-06366/2026, campo del 20 al 23/Ago, n=2.000), más BTG/Nexus del 24/Ago (BR-09028/2026, n=2.006), que sigue siendo la de mayor confiabilidad de la ventana en la regla de la casa. Noticias relevadas en 1.091 ítems recolectados este miércoles.`,
  'candidates[0].header':
    `PRECIO: 62,50% (vol USD 9,03M acumulado), ${S}. Sin variación en el día, TERCER día consecutivo estancado. Su distancia al segundo cayó a 26,95pp, la más estrecha desde el 21/Jun.`,
  'candidates[0].fortes[0]':
    `Indexa/Broadcast de hoy (n=2.000, teléfono, campo del 20 al 23/Ago, BR-06366/2026) lo coloca en 39% en la primera vuelta frente a 34% del segundo, y lo da ganando los CUATRO escenarios de segunda vuelta probados: 46% a 41% frente a Flávio, 45% a 34% frente a Zema, 44% a 38% frente a Caiado y 46% a 34% frente a Renan Santos.`,
  'candidates[0].fortes[1]':
    `BTG/Nexus del 24/Ago, la de mayor confiabilidad de la ventana, lo mantiene en 41% en la primera vuelta sin Marçal y ganando la segunda vuelta por 46% a 45%.`,
  'candidates[0].fortes[2]':
    `El precio sigue en 62,50% por tercer día, y el mercado continúa pagando casi dos a uno a su favor. El máximo de la serie es 67,50%, del 16/Ago, verificado en el respaldo contra el registro completo desde el 14/Abr.`,
  'candidates[0].fortes[3]':
    `Confirmó la entrevista del Jornal Nacional para el 27/Ago, según Valor Econômico y Poder360, después de haber faltado al debate de Band el 23/Ago.`,
  'candidates[0].fortes[4]':
    `Este miércoles acudió al TSE contra Renan Santos y Ronaldo Caiado por ataques en el debate, pidiendo el retiro de publicaciones, según Folha de S.Paulo. El mismo día los dos cedieron en el contrato de tercer lugar, y el panel registra la coincidencia de fechas sin atribuir causa.`,
  'candidates[0].fracos[0]':
    `⚠️ La Gerp de hoy lo coloca ATRÁS por primera vez en la tabla del panel: 37% frente a 38% en la primera vuelta, dentro del margen de 2pp, y perdiendo la segunda vuelta por 42% a 47%. La única otra lectura en que no estaba adelante es la propia Gerp del 11/Ago, que dio empate en 38 a 38.`,
  'candidates[0].fracos[1]':
    `LAS DOS nacionales de hoy lo ponen por debajo del 41% de BTG/Nexus: 37% en Gerp y 39% en Indexa. El piso de su franja de 30 días cayó de 38% a 37% por eso.`,
  'candidates[0].fracos[2]':
    `La aprobación del gobierno está en terreno negativo en las dos casas nuevas: 46% frente a 50% en Indexa, según Estadão y CNN Brasil, y 43% frente a 51% en Gerp, según CNN Brasil y Diário de São Paulo.`,
  'candidates[0].fracos[3]':
    `Su distancia al segundo en el precio es la más estrecha desde el 21/Jun, y se estrechó sin que él cediera nada: quien se movió fue el otro lado.`,
  'candidates[0].fracos[4]':
    `⚠️ El caso del INSS volvió al noticiero por el flanco familiar: la Policía Federal afirma que un lobista pidió acción de Lulinha para cerrar negocios del llamado Careca do INSS con el gobierno, y la investigación apunta a tres intentos frustrados de contrato en el Ministerio de Salud, según Folha de S.Paulo y O Globo. La Justicia negó el pedido de Lulinha para retirar el video en que Flávio trata las sospechas.`,
  'candidates[0].analise':
    `El día entrega el caso más limpio del año para la tesis de la casa, y no es entre mercado y urna: es entre dos urnas. Gerp e Indexa midieron la misma disputa, en la misma semana, con ventanas de campo que se superponen, y llegaron a resultados opuestos en la segunda vuelta, una dando al líder perdiendo por 5 y la otra dando al líder ganando por 5. Son diez puntos de distancia entre institutos, sin ningún día entre ellas para explicarlo. El panel publica las dos y no promedia, porque promediar lecturas que se invierten esconde justamente lo informativo. En el precio, el movimiento fue de un solo lado: está estancado en 62,50% por tercer día y la distancia al segundo cayó a 26,95pp, la más estrecha desde el 21/Jun. Probabilidad de ganar e intención de voto miden cosas distintas, y el panel no resta una de la otra.`,
  'candidates[1].header':
    `PRECIO: 35,55% (vol USD 8,94M acumulado), ${S}. Alza de 0,90pp, la mayor variación del día entre los contratos de ganador, y su nivel más alto desde el 13/May.`,
  'candidates[1].fortes[0]':
    `⭐ La Gerp de hoy (n=2.400, campo del 21 al 25/Ago, BR-03547/2026) lo coloca ADELANTE en la primera vuelta por primera vez en la tabla del panel, con 38% frente a 37%, y ganando la segunda vuelta por 47% a 42%.`,
  'candidates[1].fortes[1]':
    `El precio subió 0,90pp y llegó a 35,55%, el más alto desde el 13/May. Verificado en el respaldo de la base: ningún punto entre aquella fecha y hoy quedó por encima de esto. El máximo de la serie es 45,50%, del 06/May.`,
  'candidates[1].fortes[2]':
    `En el contrato de segundo lugar de la primera vuelta sigue en 87,50%, sin variación. El mercado está seguro de que es el segundo y discute solo cuánto vale eso frente al primero.`,
  'candidates[1].fortes[3]':
    `El CEO de Indexa dijo a Estadão que viene recuperando electores después del caso Master, y es la propia casa que mide la que liga el movimiento de la urna al caso.`,
  'candidates[1].fortes[4]':
    `En la comparación de Gerp consigo misma, la distancia en la segunda vuelta pasó de 2 puntos (45% a 43% en la ronda del 11/Ago, BR-08045/2026) a 5 puntos ahora.`,
  'candidates[1].fracos[0]':
    `⚠️ La Indexa de hoy lo da en 34% en el escenario sin Pablo Marçal y 33% en el escenario con él, perdiendo la segunda vuelta por 41% a 46%. Las dos nacionales del día discrepan sobre quién gana, y la diferencia entre ellas es de diez puntos.`,
  'candidates[1].fracos[1]':
    `El caso Master volvió con fuerza este miércoles: Daniel Vorcaro declarará ante la Policía Federal en la investigación sobre fraudes, la PF hizo un allanamiento en un instituto de previsión de Campo Grande por aportes en el banco, y el caso Dark Horse en el Supremo involucra sospechas sobre gastos de Vorcaro y sobre enmiendas, según O Globo.`,
  'candidates[1].fracos[2]':
    `Militantes del PT pasaron a replicar un jingle que junta Vorcaro, Estados Unidos y el caso de los sueldos retenidos para atacarlo, según O Globo, lo que indica que el tema entró en el repertorio de campaña del otro lado.`,
  'candidates[1].fracos[3]':
    `BTG/Nexus del 24/Ago, la de mayor confiabilidad de la ventana, lo mantiene en 37% y lo da perdiendo la segunda vuelta por 45% a 46%.`,
  'candidates[1].fracos[4]':
    `Su franja de 30 días sigue amplia, de 28,7% a 40%, y esa amplitud entre institutos es mayor que la variación del precio en el mismo período.`,
  'candidates[1].analise':
    `Fue el nombre que se movió en el día, y en los dos instrumentos a la vez. En el precio, alza de 0,90pp hasta 35,55%, el nivel más alto desde el 13/May. En la urna, una de las dos nacionales nuevas lo coloca adelante del líder por primera vez desde que el panel arma esta tabla. Las dos cosas apuntan en la misma dirección, y es raro que apunten juntas. La salvedad que va junto es del mismo tamaño: la otra nacional del día, con campo superpuesto, lo da perdiendo por cinco en la segunda vuelta, y el caso Master volvió al noticiero el mismo miércoles en que el precio subió. El CEO de Indexa atribuye su recuperación justamente a que el caso salió del centro del noticiero, y el día mostró lo contrario de eso.`,
  'candidates[2].header':
    `PRECIO: 2,75% (vol USD 11,23M acumulado), ${S}. Caída de 0,20pp en el contrato de ganador. 🔴 En el contrato de tercer lugar de la primera vuelta la pérdida es de 6,00pp, la mayor variación del panel este miércoles.`,
  'candidates[2].fortes[0]':
    `Sigue adelante de Ronaldo Caiado en el contrato de tercer lugar, con 45,50% frente a 39,00%.`,
  'candidates[2].fortes[1]':
    `Indexa lo mide en 4% en la primera vuelta, el valor más alto que recibe entre las tres nacionales de la ventana.`,
  'candidates[2].fortes[2]':
    `El volumen acumulado de su contrato en el libro presidencial es de USD 11,23M, el segundo mayor entre los nombres seguidos, lo que describe un mercado con bastante gente negociando la hipótesis.`,
  'candidates[2].fortes[3]':
    `Quiere explotar el caso Lulinha en la entrevista del Jornal Nacional, según Folha de S.Paulo, y el tema está vivo en el noticiero de este miércoles.`,
  'candidates[2].fracos[0]':
    `🔴 Cedió 6,00pp en el contrato de tercer lugar, de 51,50% a 45,50%, la mayor variación del panel en el día. Su distancia a Caiado en ese contrato cayó de 9,50pp a 6,50pp, y esta vez los dos cedieron, con él cayendo el doble.`,
  'candidates[2].fracos[1]':
    `En el contrato de ganador cedió 0,20pp y está en 2,75%.`,
  'candidates[2].fracos[2]':
    `Gerp lo mide en 3%, empatado con Caiado, y BTG/Nexus del 24/Ago también lo daba en 3%, detrás del 5% de Caiado. Las dos casas de hoy discrepan sobre quién es el tercero en la urna.`,
  'candidates[2].fracos[3]':
    `Lula acudió al TSE contra él y contra Caiado por ataques en el debate, pidiendo el retiro de publicaciones, según Folha de S.Paulo.`,
  'candidates[2].analise':
    `El mayor movimiento de todo el día no está en el contrato de ganador, está en el de tercer lugar, y es suyo. Una caída de 6,00pp en un día en un contrato de ese tamaño es grande, y vino acompañada de una caída menor del rival directo, lo que acortó la distancia entre ambos en lugar de ampliarla. En la urna nada cambió de nivel: las tres nacionales de la ventana lo ponen entre 3% y 4%. Es el tipo de día en que el precio se mueve más que la intención declarada, y el panel registra los dos sin elegir cuál está en lo cierto.`,
  'candidates[3].header':
    `Pelotón de atrás en la ${S}. Ronaldo Caiado cedió 0,10pp y está en 0,45%, por debajo del piso de 0,5% que vigila la doble lectura. Romeu Zema cedió 0,10pp y está en 0,15%. Fernando Haddad sigue en 0,05%.`,
  'candidates[3].subtitle':
    `Pelotón de atrás en la ${S}. Los tres están por debajo del piso de 0,5% en que la doble lectura distingue movimiento de ruido, así que el panel no trata ninguna variación de ellos como señal.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,45% (vol USD 6,59M acumulado, ${S}), con caída de 0,10pp. En el contrato de tercer lugar de la primera vuelta cedió 3,00pp y tiene 39,00%, a 6,50pp de Renan Santos.`,
  'candidates[3].caiado.fortes':
    `La Indexa de hoy lo mide en 5% en la primera vuelta, adelante de Renan Santos, y lo da perdiendo la segunda vuelta frente a Lula por 38% a 44%, la menor distancia entre los cuatro escenarios probados por la casa después del de Flávio. Aun cediendo 3,00pp en el contrato de tercer lugar, ACORTÓ la distancia a Renan Santos, porque el otro cayó el doble. Este miércoles defendió la posibilidad de juicio político a ministros del STF y pidió el levantamiento del secreto de los casos ligados al Master, según O Globo, y fue entrevistado por O Globo, CBN y Valor.`,
  'candidates[3].caiado.fracos':
    `Gerp lo mide en 3%, empatado con Renan Santos, frente al 5% de Indexa y al 5% de BTG/Nexus. Cedió 0,10pp en el contrato de ganador y está en 0,45%, por debajo del piso de vigilancia. Lula acudió al TSE contra él y contra Renan Santos por ataques en el debate.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,15% (vol USD 5,99M acumulado, ${S}), con caída de 0,10pp.`,
  'candidates[3].zema.fortes':
    `Sigue siendo probado por las nacionales, a diferencia de Tarcísio y Haddad. Indexa lo da perdiendo la segunda vuelta frente a Lula por 34% a 45%.`,
  'candidates[3].zema.fracos':
    `Las dos nacionales de hoy lo miden en 1%, frente al 3% de BTG/Nexus del 24/Ago, y el piso de su franja de 30 días cayó de 1,3% a 1% por eso.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,30M acumulado, ${S}), sin variación.`,
  'candidates[3].haddad.fortes':
    `La encuesta del JOTA divulgada este miércoles (BR-07806/2026, 6.000 entrevistas por internet, campo del 27/Jul al 24/Ago) probó un escenario de segunda vuelta con él en el lugar de Lula frente a Flávio Bolsonaro.`,
  'candidates[3].haddad.fracos':
    `Ninguna nacional lo prueba en la primera vuelta para presidente, así que no entra en el grafo de divergencia, a propósito. Y los números del escenario del JOTA no salieron de forma que el panel pudiera verificarlos en una fuente, así que nada de ella fue a la tabla.`,
  'candidates[3].analise':
    `Los tres siguen por debajo del piso de 0,5% en el contrato de ganador, y lo que se mueve en ellos hoy es el contrato de tercer lugar, donde Caiado cedió 3,00pp y aun así se acercó a Renan Santos. En la urna el cuadro es otro: las dos nacionales de hoy discrepan sobre quién es el tercero, con Indexa dando a Caiado adelante por 5% a 4% y Gerp dando empate en 3%. Es justamente ese par el que el contrato de tercer lugar descuenta, y se movió el día en que las dos casas discreparon sobre él.`,
  'quadroComparativo[0].p':
    `DOS NACIONALES NUEVAS Y DISCREPAN. Gerp (n=2.400, campo del 21 al 25/Ago) lo da en 37% en la primera vuelta, ATRÁS por 1 punto, y perdiendo la segunda vuelta por 42% a 47%. Indexa (n=2.000, campo del 20 al 23/Ago) lo da en 39%, adelante por 5, y ganando la segunda vuelta por 46% a 41%. BTG/Nexus del 24/Ago, de mayor confiabilidad, lo mantiene en 41%.`,
  'quadroComparativo[0].m':
    `62,50% (vol USD 9,03M), ${S}. Sin variación, tercer día consecutivo estancado. El máximo de la serie es 67,50%, del 16/Ago.`,
  'quadroComparativo[0].t': `estancado por tercer día, y la distancia al segundo es la más estrecha desde el 21/Jun`,
  'quadroComparativo[0].s':
    `Octavo día de campaña oficial, a 42 días de la primera vuelta. Entrevista del Jornal Nacional marcada para el 27/Ago. Este miércoles acudió al TSE contra Renan Santos y Caiado por ataques en el debate.`,
  'quadroComparativo[1].p':
    `Gerp lo da en 38% en la primera vuelta, ADELANTE por primera vez en la tabla del panel, y ganando la segunda vuelta por 47% a 42%. Indexa lo da en 34% sin Marçal y 33% con él, perdiendo la segunda vuelta por 41% a 46%. BTG/Nexus del 24/Ago lo mantiene en 37%.`,
  'quadroComparativo[1].m':
    `35,55% (vol USD 8,94M), ${S}. Alza de 0,90pp, la mayor del día entre los contratos de ganador, y el nivel más alto desde el 13/May. En el contrato de segundo lugar quedó estancado en 87,50%.`,
  'quadroComparativo[1].t': `la mayor alza del día, y su precio más alto desde el 13/May`,
  'quadroComparativo[1].s':
    `Vorcaro declarará ante la PF en la investigación sobre los fraudes del Master, y el CEO de Indexa dijo a Estadão que viene recuperando electores después del caso.`,
  'quadroComparativo[2].p':
    `Gerp lo da en 3% e Indexa en 4%. BTG/Nexus del 24/Ago lo daba en 3%, detrás del 5% de Caiado. Las dos casas de hoy discrepan sobre quién es el tercero.`,
  'quadroComparativo[2].m':
    `2,75% (vol USD 11,23M), ${S}. Caída de 0,20pp en el contrato de ganador y de 6,00pp en el de tercer lugar, hasta 45,50%, la mayor variación del panel en el día.`,
  'quadroComparativo[2].t': `la mayor caída del día, y está en el contrato de tercer lugar`,
  'quadroComparativo[2].s':
    `Lula acudió al TSE contra él por ataques en el debate. Quiere explotar el caso Lulinha en la entrevista del Jornal Nacional.`,
  'quadroComparativo[3].p':
    `Indexa lo da en 5%, adelante de Renan Santos, y perdiendo la segunda vuelta frente a Lula por 38% a 44%. Gerp lo da en 3%, empatado con Renan.`,
  'quadroComparativo[3].m':
    `0,45% (vol USD 6,59M), ${S}. Caída de 0,10pp, por debajo del piso de 0,5%. En el contrato de tercer lugar cedió 3,00pp hasta 39,00% y aun así acortó la distancia a Renan Santos.`,
  'quadroComparativo[3].t': `cede en los dos contratos y aun así se acerca al tercero`,
  'quadroComparativo[3].s':
    `Defendió la posibilidad de juicio político a ministros del STF y pidió el levantamiento del secreto de los casos ligados al Master. Fue entrevistado por O Globo, CBN y Valor.`,
  'quadroComparativo[4].p':
    `Gerp lo mide en 4% e Indexa en 2%, las dos en la misma semana. BTG/Nexus del 24/Ago lo medía en 4%. Sigue siendo el nombre con mayor divergencia relativa entre institutos en la ventana.`,
  'quadroComparativo[4].m':
    `0,15% (vol USD 2,77M), ${S}. Sin variación, y por debajo del piso de 0,5% de la doble lectura.`,
  'quadroComparativo[4].t': `por debajo del piso de vigilancia`,
  'quadroComparativo[4].s':
    `El escenario con él baja un punto al segundo en Indexa y no mueve al primero.`,
  'quadroComparativo[5].p':
    `Sin encuesta. Mercado de juicio político a un ministro del STF antes de 2027.`,
  'quadroComparativo[5].m':
    `3,40% (vol USD 84 mil), ${S}. Sin variación en el día.`,
  'quadroComparativo[5].t': `estancado`,
  'quadroComparativo[5].s':
    `Caiado defendió la posibilidad de juicio político a ministros y pidió el levantamiento del secreto de los casos ligados al Master. Mendonça propuso al TSE una tesis para definir qué es un deepfake en las elecciones, y vive una crisis con la PF.`,
  'cruzamento':
    `El 26 de agosto entrega el caso más limpio del año para lo que el AFOS mide, y no es entre mercado y urna: es entre dos urnas. Gerp e Indexa/Broadcast divulgaron encuestas nacionales el mismo día, con ventanas de campo que se superponen, y llegaron a resultados opuestos. En la ${G('primera vuelta', 'primeiro-turno')} Gerp da 38% a 37% para Flávio Bolsonaro e Indexa da 39% a 34% para Lula. En la segunda vuelta Gerp da a Flávio ganando por 47% a 42% e Indexa da a Lula ganando por 46% a 41%. Son diez puntos de distancia entre dos casas sobre la misma disputa, sin ningún día entre ellas que explique la diferencia. El panel publica las dos con la regla de confiabilidad declarada y no promedia, porque promediar lecturas que se invierten borra lo que hay de informativo en el día. La regla de la casa da 3 a las dos, y la nacional de mayor confiabilidad de la ventana sigue siendo BTG/Nexus del 24/Ago, que mantiene a Lula en 41% y es la que alimenta el lado encuesta del grafo de divergencia. En el precio, la lectura confirmada del 26/Ago a las 15:19 BRT trae al líder estancado en 62,50% por tercer día consecutivo y al segundo subiendo 0,90pp hasta 35,55%, su nivel más alto desde el 13/May. La distancia entre los dos cayó a 26,95pp, y es la más estrecha desde el 21/Jun, verificada en el respaldo de la base contra el registro completo desde el 14/Abr. Se estrechó por un solo lado, y eso importa: quien se movió fue el segundo. El mayor movimiento del día, sin embargo, no está en el contrato de ganador. Está en el de tercer lugar de la primera vuelta, donde Renan Santos cedió 6,00pp hasta 45,50% y Ronaldo Caiado cedió 3,00pp hasta 39,00%. Los dos cayeron y la distancia entre ellos se acortó de 9,50pp a 6,50pp. Ese mismo miércoles Lula acudió al TSE contra ambos por ataques en el debate, y las dos nacionales nuevas discreparon sobre cuál de los dos es el tercero en la urna, con Indexa dando a Caiado adelante por 5% a 4% y Gerp dando empate en 3%. El panel registra la coincidencia de fechas y no atribuye causa. De fondo, el caso Master volvió al noticiero con la declaración marcada de Daniel Vorcaro ante la Policía Federal y una operación sobre aportes de un instituto de previsión municipal, mientras el caso del INSS avanzó por el flanco familiar del gobierno. Aprobación del gobierno en terreno negativo en las dos casas nuevas, 46% frente a 50% en Indexa y 43% frente a 51% en Gerp, con cinco puntos de amplitud entre institutos sobre la misma pregunta en la misma semana. Probabilidad de ganar e intención de voto miden cosas distintas, y el panel no resta una de la otra.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'es', {
  'polymarketComparison.note':
    `Precios de Polymarket en la ${S}, con el libro presidencial en USD 133,35M. ⭐ EL DÍA TUVO DOS NACIONALES NUEVAS Y SE CONTRADICEN: Gerp (BR-03547/2026, campo del 21 al 25/Ago, n=2.400) da a Flávio adelante en la primera vuelta con 38% frente a 37%, y ganando la segunda vuelta por 47% a 42%; Indexa/Broadcast (BR-06366/2026, campo del 20 al 23/Ago, n=2.000) da a Lula adelante con 39% frente a 34%, y ganando la segunda vuelta por 46% a 41%. Son diez puntos de distancia entre dos casas sobre la misma disputa, con ventanas de campo que se superponen, y el panel publica las dos sin promediarlas. ⚖️ El lado ENCUESTA de este bloque sigue en BTG/Nexus del 24/Ago, que es la nacional de mayor confiabilidad en la regla de la casa, y no en ninguna de las dos de hoy. La amplitud de los 30 días fue recalculada con ellas dentro, y tres pisos cedieron: Lula del 38% al 37%, Caiado del 3,1% al 3% y Zema del 1,3% al 1%. 📉 EN EL PRECIO, LA DISTANCIA ENTRE LOS DOS PRIMEROS SE ESTRECHÓ DE 27,85pp A 26,95pp, y es la más estrecha desde el 21/Jun, verificada en el respaldo de la base contra la serie que empieza el 14/Abr. Se estrechó por un solo lado: el primero está estancado en 62,50% por tercer día consecutivo y el segundo subió 0,90pp, hasta 35,55%, su nivel más alto desde el 13/May. ⭐ Y EL MAYOR MOVIMIENTO DEL DÍA NO ESTÁ EN EL CONTRATO DE GANADOR: en el de tercer lugar de la primera vuelta, Renan Santos cedió 6,00pp hasta 45,50% y Ronaldo Caiado cedió 3,00pp hasta 39,00%. Los dos cayeron, y aun así la distancia entre ellos se acortó de 9,50pp a 6,50pp. Este miércoles Lula acudió al TSE contra ambos por ataques en el debate, pidiendo el retiro de publicaciones. El panel registra la coincidencia de fechas y no atribuye causa. Probabilidad de ganar e intención de voto miden cosas distintas, y el panel no resta una de la otra.`,
  'polymarketComparison.sources':
    `Precios de Polymarket vía el proxy AFOS, y el panel solo publica precio que dos lecturas independientes, tomadas con ocho minutos de intervalo, confirmen dentro de 0,20pp. El 26/Ago hay lectura confirmada nueva para todos los contratos seguidos, a las 15:19 BRT (18:19 UTC): presidencial, segundo lugar, tercer lugar, Senado e impeachment en el STF. Encuestas registradas en el TSE y divulgadas por los institutos, con cobertura de G1, CNN Brasil, Folha de S.Paulo, Valor Econômico, Estadão, Poder360, VEJA, InfoMoney, UOL, O Globo, Correio Braziliense, Gazeta do Povo, Money Times y CartaCapital. Las dos nacionales del 26/Ago fueron verificadas en dos fuentes cada una, con el número de registro del TSE coincidiendo, y cruzadas con la tabla de Wikipedia de encuestas presidenciales de 2026. Los superlativos de serie se verifican en el respaldo del Neon, en backup/neon/marketPrice, que guarda el registro completo desde el 14/Abr.`,
  'polymarketComparison.candidates[1].polymarket': `35,55%`,
  'polymarketComparison.candidates[2].polymarket': `2,75%`,
  'polymarketComparison.candidates[3].polymarket': `0,45%`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `62,50% (vol USD 9,03M) en la ${S}, sin variación por TERCER día consecutivo. El máximo de la serie es 67,50%, del 16/Ago, verificado en el respaldo contra el registro completo desde el 14/Abr. ⭐ Su distancia al segundo cayó a 26,95pp, y es la más estrecha desde el 21/Jun: ningún punto de la serie después de aquella fecha quedó por debajo de esto. Y se estrechó sin que él cediera nada, porque quien se movió fue el otro lado.`,
  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `DOS NACIONALES NUEVAS HOY, Y DISCREPAN SOBRE ÉL. Gerp (BR-03547/2026, campo del 21 al 25/Ago, n=2.400) lo da en 37% en la primera vuelta, atrás de Flávio por 1 punto, y perdiendo la segunda vuelta por 42% a 47%. Indexa/Broadcast (BR-06366/2026, campo del 20 al 23/Ago, n=2.000) lo da en 39%, adelante por 5, y ganando la segunda vuelta por 46% a 41%. Las dos quedan por debajo del 41% de BTG/Nexus del 24/Ago, que sigue siendo la nacional de mayor confiabilidad de la ventana y es la que alimenta el número de este bloque.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `35,55% (vol USD 8,94M) en la ${S}, con alza de 0,90pp, la mayor variación del día entre los contratos de ganador. ⭐ Es su nivel más alto desde el 13/May, verificado en el respaldo: ningún punto entre aquella fecha y hoy quedó por encima de esto, y el máximo de la serie es 45,50%, del 06/May. En el contrato de segundo lugar de la primera vuelta quedó estancado en 87,50%.`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `Las dos nacionales de hoy lo miden en lugares opuestos. Gerp lo da en 38% en la primera vuelta, ADELANTE de Lula por primera vez en la tabla del panel, y ganando la segunda vuelta por 47% a 42%. Indexa lo da en 34% en el escenario sin Pablo Marçal y 33% en el escenario con él, y perdiendo la segunda vuelta por 41% a 46%. BTG/Nexus del 24/Ago, que alimenta el número de este bloque, lo mantiene en 37%. 📌 El CEO de Indexa dijo a Estadão que viene recuperando electores después del caso Master, y el precio anduvo en la misma dirección este miércoles.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `2,75% (vol USD 11,23M) en la ${S}, caída de 0,20pp. 🔴 En el contrato de tercer lugar de la primera vuelta la pérdida es bastante mayor: 6,00pp en un día, de 51,50% a 45,50%, la mayor variación del panel este miércoles. Su distancia a Caiado en ese contrato cayó de 9,50pp a 6,50pp, y esta vez LOS DOS cedieron.`,
  'polymarketComparison.candidates[2].tendenciaPesquisa':
    `Gerp lo da en 3% e Indexa en 4%, frente al 3% de BTG/Nexus del 24/Ago. Las tres lecturas lo ponen en la misma franja estrecha, y ninguna de ellas explica sola la caída de 6,00pp en el contrato de tercer lugar.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `0,45% (vol USD 6,59M) en la ${S}, caída de 0,10pp, por debajo del piso de 0,5% que vigila la doble lectura. En el contrato de tercer lugar cedió 3,00pp, de 42,00% a 39,00%, y aun así ACORTÓ la distancia a Renan Santos, porque el otro cayó el doble.`,
  'polymarketComparison.candidates[3].tendenciaPesquisa':
    `Indexa lo da en 5%, adelante de Renan Santos, y Gerp lo da en 3%, empatado con él. BTG/Nexus del 24/Ago lo mantenía en 5%. Las dos casas de hoy discrepan sobre quién es el tercero en la urna, y es ese par el que el contrato de tercer lugar descuenta.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `0,15% (vol USD 2,77M) en la ${S}, sin variación. Está por debajo del piso de 0,5% de la doble lectura, así que el panel no trata el movimiento de ese contrato como señal.`,
  'polymarketComparison.candidates[4].tendenciaPesquisa':
    `Gerp lo da en 4% e Indexa en 2%, y las dos midieron en la misma semana. La divergencia sobre él sigue siendo la mayor en términos relativos de la ventana, y el precio de 0,15% no distingue entre 2% y 4% de intención declarada.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `0,05% (vol USD 14,06M) en la ${S}, sin variación. Es el mayor volumen acumulado del libro presidencial y el precio más bajo entre los nombres seguidos, lo que describe un contrato donde mucha gente ya negoció y el mercado hoy trata la hipótesis como cerrada.`,
  'polymarketComparison.candidates[5].tendenciaPesquisa':
    `Ninguna nacional lo prueba para presidente, incluidas las dos de hoy. Por eso queda con 0% en este bloque y sale del grafo, a propósito.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `0,15% (vol USD 5,99M) en la ${S}, caída de 0,10pp, dentro del ruido de un contrato por debajo del piso de vigilancia.`,
  'polymarketComparison.candidates[6].tendenciaPesquisa':
    `Gerp e Indexa lo miden en 1% cada una, y BTG/Nexus del 24/Ago lo daba en 3%. El piso de la franja de 30 días cayó a 1% por causa de las dos de hoy.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `0,05% (vol USD 7,30M) en la ${S}, sin variación.`,
  'polymarketComparison.candidates[7].tendenciaPesquisa':
    `Ninguna nacional lo prueba para presidente. La encuesta del JOTA divulgada hoy probó un escenario de segunda vuelta con él en el lugar de Lula, pero sus números no salieron de forma que el panel pudiera verificarlos, así que no entra en la tabla.`,
  'approvalData.note':
    `🏷️ LOS NÚMEROS ESTRUCTURADOS DE ESTE BLOQUE SON DE GENIAL/QUAEST DEL 14/Ago, y son estos: 46% de aprobación frente a 48% de desaprobación, con 6% que no sabe, y 36% de excelente o bueno, 25% de regular y 37% de malo o pésimo. El panel mantiene UNA casa por bloque a propósito, para no sumar reglas de institutos distintos. ⭐ DOS NACIONALES NUEVAS EL 26/Ago, declaradas aquí y NO mezcladas arriba, y las dos miden al gobierno en terreno negativo: Indexa/Broadcast trae 46% de aprobación frente a 50% de desaprobación, según Estadão y CNN Brasil; Gerp trae 43% frente a 51%, según CNN Brasil y Diário de São Paulo. 📌 La lectura anterior, de BTG/Nexus del 24/Ago (n=2.006, campo del 21 al 23/Ago, BR-09028/2026), traía 48% de aprobación frente a 49% de desaprobación, y 35% de excelente o bueno frente a 43% de malo o pésimo. ⚠️ LAS TRES CASAS COINCIDEN EN EL SIGNO Y DISCREPAN EN EL TAMAÑO: la desaprobación va de 49% a 51% y la aprobación de 43% a 48%, es decir cinco puntos de amplitud entre institutos sobre la misma pregunta en la misma semana. El panel no promedia entre ellas.`,
})
