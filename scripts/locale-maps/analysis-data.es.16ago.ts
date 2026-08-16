/**
 * Mapa ES de 16/Ago para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como no pt-BR. R$ preservado.
 */
import { construir } from '../build-locale-json'

const CAR = 'lectura confirmada del 16 de ago, 16:56 BRT (19:56 UTC)'

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 49 días de la primera vuelta, el día es el PRIMERO DE LA CAMPAÑA OFICIAL y el movimiento entero está en el precio, porque no salió ninguna encuesta nacional nueva. El líder subió 2,00pp y cerró en 66,50%, valor que IGUALA el máximo de una serie de 174 puntos que corre desde el 19 de may, sin ningún punto por encima. El segundo subió 1,30pp y cerró en 29,45%, en el tercer día seguido de alza. Aun así la distancia entre los dos se AMPLIÓ, de 36,35pp a 37,05pp, porque el primero subió más.`,
  'cards.sentimento.text2':
    `⚠️ EL ORDEN DE LOS HECHOS ES PARTE DE LA INFORMACIÓN Y EL PANEL LO DECLARA. Los puntos que produjeron esa alza se registraron a las 05:01 BRT, ANTES de cualquier acto de campaña del día. Es decir, el precio se movió al entrar el primer día de campaña, y no en reacción a los actos que ocurrieron después. ⛔ Sin superlativo indebido: la distancia de 37,05pp es ordinaria en la serie, con 30 de los 89 días registrando un valor igual o mayor y un pico de 41,80pp el 1 de ago, y el 29,45% del segundo queda por debajo de 4 de los 173 puntos, con un máximo de 33,20% el 2 de jun.`,
  'cards.sentimento.text3':
    `⭐ EN LAS ENCUESTAS LA NOVEDAD ES DE FIRMEZA, NO DE NIVEL. La Quaest del 14 de ago sigue siendo la más reciente, con 38% x 31% en la primera vuelta y 43% x 40% en el balotaje. Lo que apareció el fin de semana fue un cruce de la misma encuesta, difundido el 15 de ago por G1: entre los electores del líder, 77% llaman definitiva a la decisión y 22% dicen que todavía pueden cambiar, y el electorado menos convencido del cuadro es el del candidato del Novo. Eso mide la DUREZA de la intención y no su tamaño, y es una dimensión que el panel no tenía hasta aquí.`,
  'cards.sentimento.direita':
    `El segundo subió por tercer día seguido, 1,30pp, y cerró en 29,45% (vol USD 8,34M acumulado). ⚠️ Aun subiendo, quedó más lejos del líder, porque el líder subió 2,00pp. Abrió la campaña en Copacabana, y el acto fue estimado en 8.900 personas por el monitor de USP/Cebrap, según Estadão. 📌 Esa es la única estimación de público publicada en el día, porque el acto de su rival no tuvo medición difundida, y por eso no existe comparación medida entre los dos actos. El gobernador de São Paulo abrió su campaña a la reelección el mismo día sin su presencia, según O Globo. En las encuestas nada cambió: siguen el 31% y el 40% de la Quaest del 14 de ago, con rechazo de 54%, el más alto del cuadro.`,
  'cards.sentimento.esquerda':
    `El líder subió 2,00pp, de 64,50% a 66,50% (vol USD 8,40M acumulado). ⭐ Ese valor IGUALA EL MÁXIMO DE LA SERIE: entre los 174 puntos registrados desde el 19 de may ninguno es mayor, y el único otro día en ese nivel fue el 1 de ago. ⛔ El panel dice iguala, no supera, porque la serie no sostiene la segunda palabra. Abrió la campaña en el estadio de Vila Euclides, en São Bernardo do Campo, escenario de las asambleas de metalúrgicos de fines de los años setenta, según Valor Econômico, y prometió un Ministerio de Seguridad, según G1. En las encuestas siguen el 38% y el 43% de la Quaest del 14 de ago, y ese 38% es el piso de las nueve nacionales desde el 5 de ago.`,
  'cards.sentimento.terceiraVia':
    `🔴 El pelotón cayó entero en el precio de victoria: el primero de ellos en 4,70% (caída de 2,45pp y tercer cierre seguido en baja desde el 8,00% del cierre del 11 de ago), Caiado en 0,60% (caída de 0,45pp), Zema en 0,15% y Haddad en 0,05%. ⭐ Y aquí está el hallazgo del día, que es de CONTRATO y no de nivel: en el contrato de TERCER LUGAR el primero del pelotón sigue en 53,00%, la mayor probabilidad de ese book, y Caiado SUBIÓ a 37,50%, contra 31,00% en el cierre del 12 de ago. Es decir, los dos quedaron más probables en la POSICIÓN y menos probables en la VICTORIA, el mismo día. ⛔ Son preguntas distintas y el panel no las suma. Los tres abrieron agenda: la universidad en el centro de São Paulo, misa y caravana en Goiás y misa en Montes Claros, según O Globo, G1, Folha de S.Paulo y Valor Econômico.`,
  'cards.sentimento.polymarket':
    `LECTURA CONFIRMADA NUEVA EL 16 DE AGO para TODOS los contratos seguidos, ${CAR}. Presidencial: líder 66,50% (vol USD 8,40M) y segundo 29,45% (vol USD 8,34M), con una distancia de 37,05pp contra 36,35pp el 15 de ago. Pelotón: 4,70%, 0,60%, 0,15% y 0,05%. Contrato de segundo lugar de la primera vuelta: 87,00% para el segundo (vol USD 286 mil). Contrato de tercer lugar: 53,00% para el primero del pelotón y 37,50% para Caiado (vol USD 543 mil en el book). Senado: PL en 77,50% y MDB en 16,10% (vol USD 294 mil). Impeachment en el Supremo: 3,40%, caída de 0,50pp, sobre un volumen de USD 84 mil. Volumen total del book presidencial: USD 124,32M.`,

  'cards.inss.text1':
    `⚠️ NO HAY HECHO NUEVO DEL CASO DE FRAUDE PREVISIONAL EL 16 DE AGO. La recolección del día no devolvió ninguna nota nueva sobre el tema, y el panel registra la ausencia en vez de repetir el hecho viejo como si fuera del día. El último movimiento capturado es del 13 de ago, y es policial, no de encuesta: Carlos Lopes, presidente de una asociación acusada de desvíos y de coimas a políticos, estaba prófugo, se entregó a la Policía Federal y quedó detenido. La información salió en G1, O Globo, Folha de S.Paulo y Estadão ese mismo 13 de ago, con reporteo independiente.`,
  'cards.inss.text2':
    `También el 13 de ago, O Globo informó que CUATRO DELACIONES del caso están frenadas, a la espera de una definición de la Policía Federal y de la Procuraduría General. Una delación frenada no es una delación homologada, y el panel registra el estado del proceso sin anticipar lo que pueda producir. Nada cambió en ese cuadro entre el 14 y el 16 de ago.`,
  'cards.inss.text3':
    `La distinción que el panel mantiene desde el inicio sigue vigente: una cosa es el efecto sobre la evaluación de la gestión, que es donde suele aparecer el fraude administrativo; otra es el efecto sobre la intención de voto, que ninguna encuesta de la ventana aísla. Ninguna casa probó el caso como variable explicativa.`,
  'cards.inss.text4':
    `La evaluación de gobierno más reciente es la de la Quaest del 14 de ago, con 46% de aprobación contra 48% de desaprobación, saldo de 2pp negativos dentro del margen. Reemplazó como par vigente a la PoderData/Aya del 13 de ago, que marcaba 43% contra 50%. ⚠️ Son dos casas en dos días con 5 puntos de diferencia en el saldo, y el panel no elige entre ellas.`,
  'cards.inss.impactoLula':
    `No aislable. En las nueve nacionales desde el 5 de ago lidera o empata la primera vuelta en todas, entre 38% y 44%, y ninguna de ellas prueba el caso previsional como variable. La detención del 13 de ago es un hecho procesal y no hay medición que lo vincule con la intención de voto.`,
  'cards.inss.impactoGestao':
    `La evaluación de gobierno sigue con saldo negativo en las casas vigentes, con tamaños que varían entre 2pp y 10pp negativos. La causa no se atribuye aquí, porque ninguna encuesta de la ventana descompone el saldo por tema.`,
  'cards.inss.conclusao':
    `El caso sigue en el campo de la gestión y de la policía, y no de la intención de voto. El último movimiento es del 13 de ago, con una detención y el registro de cuatro delaciones frenadas, los dos con medio y fecha, y ninguno con efecto medido sobre las urnas. El 16 de ago no hubo hecho nuevo.`,

  'cards.bancoMaster.text1':
    `⭐ EL HECHO NUEVO DEL 16 DE AGO ES DE CONSECUENCIA REGULATORIA, no de fondo del caso. Estadão informó que, tras las pérdidas con Banco Master, 85% de las cajas previsionales pasaron a poder invertir solo en títulos públicos. Es la primera vez que el panel registra un efecto del caso sobre la REGLA de inversión de terceros, y no sobre el proceso.`,
  'cards.bancoMaster.text2':
    `El 15 de ago, Valor Econômico informó que la fabricante de un yate de R$ 2 mil millones que perteneció a Vorcaro fue citada a prestar declaración en el caso. Es un acto de instrucción, no una decisión.`,
  'cards.bancoMaster.text3':
    `⚠️ Los movimientos anteriores siguen vigentes y son todos del 13 de ago: el gestor que denunció al banco acudió al Supremo pidiendo su inclusión en el programa de protección a víctimas, según O Globo; un director del Banco Central relató a la Policía Federal un ambiente hostil y temor a filtraciones en torno a la liquidación, según Folha de S.Paulo; y el consejo de la magistratura apartó al juez del caso Banco Santos que aparece en una grabación sugiriendo a los herederos vender a Master, según Estadão. Ninguno de ellos es una decisión sobre la conducta del banco ni de sus controlantes.`,
  'cards.bancoMaster.conclusao':
    `El caso produjo el 16 de ago el primer efecto registrado sobre reglas de inversión, con 85% de las cajas previsionales restringidas a títulos públicos según Estadão, y sigue sin decisión de fondo y sin efecto medido sobre la intención de voto. El panel registra los hechos con medio y fecha y no los convierte en pronóstico.`,

  'cards.stf.toffoli': `Sin acto individual nuevo capturado el 16 de ago.`,
  'cards.stf.moraes':
    `Sin acto individual nuevo el 16 de ago. VEJA informó este domingo que Estados Unidos considera imponerle de nuevo la Ley Magnitsky, atribuyendo la información a otro diario. ⚠️ El panel registra la atribución en segunda mano y no la trata como hecho confirmado, porque no hubo una segunda fuente independiente en la ventana.`,
  'cards.stf.gilmar':
    `Sin acto individual nuevo el 16 de ago. Sigue vigente la determinación del 12 de ago, en la que él, Moraes, Dino y Zanin ordenaron a jueces de siete tribunales devolver pagos considerados exorbitantes, según Folha de S.Paulo y Estadão.`,
  'cards.stf.dino':
    `Sin acto judicial nuevo el 16 de ago. VEJA informó que volvió a desmentir información falsa sobre el uso de autos oficiales. Sigue de fondo la decisión del 15 de ago que suspendió la condena de Romero Jucá, según O Globo, con la salvedad que el panel ya registraba: es una decisión monocrática, pendiente de ratificación de la Primera Sala, y el beneficiado es precandidato a diputado federal por Roraima.`,
  'cards.stf.mendonca':
    `Sin acto individual nuevo el 16 de ago. El 15 de ago, O Globo publicó una nota sobre la estrategia de Messias para contener la fricción entre él y la Policía Federal. Es material de análisis, no un acto judicial.`,
  'cards.stf.nexo':
    `⭐ EL HILO DEL 16 DE AGO ES NUEVO Y CAMBIA LA NATURALEZA DE LA SECCIÓN: el tribunal dejó de ser apenas objeto de noticias judiciales y se volvió TEMA DE CAMPAÑA en el primer día de ella. El candidato del Novo abrió su campaña criticando a ministros del Supremo, según Folha de S.Paulo y Valor Econômico. Estadão registró que las críticas al tribunal marcaron la largada de la campaña, junto a guiños al electorado femenino y a la idea de pacificación con Estados Unidos. Y G1 informó que la estrategia del segundo para la disputa del Senado se organiza en torno al enfrentamiento con el Supremo, mientras la del líder se organiza en torno a la gobernabilidad. 📌 El panel registra el desplazamiento sin atribuirle ningún efecto sobre el precio, porque ninguna medición de la ventana hace ese vínculo.`,
  'cards.stf.analise':
    `LECTURA CONFIRMADA NUEVA EL 16 DE AGO para el contrato de impeachment de ministro del Supremo, ${CAR}. Está en 3,40% sobre un volumen acumulado de USD 84 mil, caída de 0,50pp contra el 3,90% de la lectura anterior, del 14 de ago. ⚠️ Sigue siendo el contrato más delgado entre los seguidos por este panel, con un volumen tres órdenes de magnitud por debajo del presidencial, y cualquier movimiento en él exige esa salvedad antes de cualquier lectura. ⛔ El panel no vincula la caída con el hecho de que el tribunal se haya vuelto tema de campaña el mismo día, porque no hay medición que sostenga ese puente.`,
})
