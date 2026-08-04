/** Mapa ES de analysis-data.json — /atualizar-brz 04/Ago/2026. Vírgula decimal, ponto de milhar. */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const NEXUS = G('BTG/Nexus', 'nexus-btg')
const STF = G('STF', 'stf')
const NOVO = G('Novo', 'novo')
const PF = G('Policía Federal', 'pf')

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 61 días de la 1ª vuelta el dato nuevo es la APROBACIÓN, y vino de la ronda de ayer. ${NEXUS} divulgó, en la cobertura del 04/Ago y de la misma ronda BR-02874/2026 (n=2.002, campo del 31/Jul al 02/Ago), aprobación del gobierno en 47% contra 48% de desaprobación. En la evaluación de la gestión, que es una pregunta distinta, 37% de excelente o buena, 18% de regular y 43% de mala o pésima.`,
  'cards.sentimento.text2':
    `EL HALLAZGO NO ES EL NIVEL, ES LA INMOVILIDAD. Dentro de la propia ${NEXUS} la aprobación está en 47% en las tres últimas rondas: 47% x 47% el 13/Jul, 47% x 49% el 27/Jul y 47% x 48% ahora. Quien se movió fue la desaprobación, dentro del margen de 2pp en ambos casos. Tres lecturas sin movimiento describen un electorado dividido y estable, no una tendencia.`,
  'cards.sentimento.text3':
    `⚠️ EL MERCADO NO ENTRA EN ESTA RONDA. La traba de captura bloqueó cuatro veces el 04/Ago, con el libro de Caiado oscilando entre 1,65% y 2,30% en ocho minutos. Los precios que muestra este panel son de la captura trabada de las 19:11 UTC del 03/Ago, y están marcados como tal. El panel no publica un precio que dos lecturas independientes no confirmen.`,
  'cards.sentimento.direita':
    `DÍA DE AISLAMIENTO PARTIDARIO PARA FLÁVIO. Republicanos confirmó neutralidad en la elección y rechazó integrar la fórmula, y Podemos hizo lo mismo poco después, tras resistirse a postular a su propia presidenta como vice. Sigue SIN VICE y dice que definirá hasta el 15 de agosto. Michelle Bolsonaro llamó a Ciro Nogueira para interceder por Tereza Cristina en el puesto. En la encuesta sigue siendo el movimiento de la semana, con una subida de 4pp en la 1ª vuelta de ${NEXUS}, pero esa es la lectura más favorable a él entre las cuatro nacionales desde el 29/Jul.`,
  'cards.sentimento.esquerda':
    `Aprobación del gobierno en 47% contra 48%, quieta en 47% desde hace tres rondas de ${NEXUS}. ⚠️ El panel cambió de fuente en este campo, que hasta ayer traía la lectura del 29/Jul, y por eso no publica variación: comparar casas distintas sería cambiar la vara de medir. PoderData/Aya del 30/Jul sigue mostrando un cuadro más duro, 43% x 49%. En el eje judicial, Dino AUTORIZÓ el tercer expediente contra Lulinha y abrió una investigación sobre filtraciones, y Lula mandó a un asesor a explicar un préstamo tomado con una amiga de Lulinha investigada.`,
  'cards.sentimento.terceiraVia':
    `EL ESPACIO GANÓ DEFINICIÓN PARTIDARIA HOY. ZEMA anunció a su compañero de fórmula, el senador Eduardo Girão, del partido ${NOVO}, y es el primero de los tres en cerrar fórmula, y encima la cierra dentro de su propio partido. CAIADO es el nombre cuyo precio más se mueve, y es justamente por él que la traba bloqueó: cuatro rondas, con lecturas entre 1,65% y 2,30%. El panel no publica ese número. En la encuesta de ${NEXUS} de ayer, Caiado tiene 5% y Zema 3%, y Lula les gana a ambos en la 2ª vuelta, 46% x 42% y 46% x 40%.`,
  'cards.sentimento.polymarket':
    `⚠️ Precios del 03/Ago, de la captura trabada de las 19:11 UTC, no de hoy: Lula 65,50% (vol USD 7,92M), Flávio 25,45% (vol USD 7,86M), Renan Santos 7,45% (vol USD 8,86M), Caiado 1,15% (vol USD 5,30M), Zema 0,25% (vol USD 4,66M), Haddad 0,15% (vol USD 6,64M), destitución en el ${STF} 3,10% (vol USD 83 mil). Diferencia de Lula sobre Flávio +40,05pp. El 04/Ago la traba bloqueó cuatro rondas y no se publicó ningún precio nuevo.`,
  'cards.inss.text1':
    `La agenda fiscal no tuvo un hecho que moviera precios este martes, y el mercado no entra en esta ronda de todos modos: la traba de captura bloqueó cuatro veces el 04/Ago. El registro del día viene del lado político-partidario, donde el tablero se movió más que la encuesta.`,
  'cards.inss.text2':
    `ZEMA cerró fórmula con el senador Eduardo Girão, del partido ${NOVO}, y es el primer nombre de la tercera vía en resolver la vicepresidencia. FLÁVIO recibió dos rechazos el mismo día, de Republicanos y de Podemos, ambos confirmando neutralidad en la elección, y sigue sin vice a once días del plazo que él mismo declaró.`,
  'cards.inss.text3':
    `LA APROBACIÓN DEL GOBIERNO quedó en 47% contra 48% de desaprobación en ${NEXUS}, divulgada hoy pero recogida entre el 31/Jul y el 02/Ago. Está quieta en 47% desde hace tres rondas de la misma casa, lo que describe estabilidad y no movimiento. La gestión sigue en 37% de excelente o buena contra 43% de mala o pésima.`,
  'cards.inss.text4':
    `⚠️ Los números de mercado de este panel son del 03/Ago y están marcados como tal. En aquella captura, el Senado tenía al ${G('PL', 'pl')} en 75,00% (vol USD 259 mil) y el contrato de inflación anual concentraba 36,60% en la franja de 5,00% a 5,49%, con las franjas sumando 99,65%. El 04/Ago no hay lectura confirmada para comparar.`,
  'cards.inss.impactoLula':
    `Aprobación nueva y quieta: 47% contra 48%, con la aprobación detenida en 47% en las tres últimas rondas de ${NEXUS}. ⚠️ El panel cambió de fuente en este campo y por eso no publica variación contra la lectura anterior, que era del 29/Jul y de otra casa. ${G('Quaest', 'quaest')} (n=2.004) e Ideia/Canal Meio (n=1.500) publican el 05/Ago y son las próximas lecturas nacionales.`,
  'cards.inss.impactoGestao':
    `Gestión en 37% de excelente o buena, 18% de regular y 43% de mala o pésima en ${NEXUS} del 03/Ago, contra 36% y 43% en la ronda del 27/Jul de la misma casa. Prácticamente quieto. PoderData/Aya del 30/Jul sigue con una lectura más dura, 34% contra 47%, y el panel registra ambas sin arbitrar cuál está bien.`,
  'cards.inss.conclusao':
    `A 61 días de la elección, el día fue de definición partidaria y de aprobación inmóvil. Zema cerró fórmula, Flávio perdió dos partidos y sigue sin vice, y la aprobación del gobierno no se movió por tercera ronda seguida de la misma casa. El mercado quedó fuera porque la traba bloqueó cuatro veces, y la tercera vía, que es donde el tablero más se movió, es justamente donde el libro está en tránsito. La ronda de mañana, con Quaest e Ideia, es la que va a medir si algo de eso se volvió voto.`,
  'cards.bancoMaster.text1':
    `El eje judicial se movió, y se movió por decisión y no por pedido: DINO AUTORIZÓ la apertura de un tercer expediente contra Fábio Luís Lula da Silva, conocido como Lulinha, y abrió además una investigación sobre filtraciones (Folha de S.Paulo, 04/Ago). Ayer el panel registró que la ${PF} lo había PEDIDO, y la distinción entre pedir y abrir es lo que separa la noticia del hecho.`,
  'cards.bancoMaster.text2':
    `En el mismo eje, el presidente mandó a un asesor a explicar públicamente un préstamo tomado con Roberta, una amiga de Lulinha investigada por la ${PF}. El ex jefe de gabinete confirmó el préstamo. El panel registra el hecho y no atribuye efecto electoral, porque no hay un precio confirmado hoy contra el cual medir una reacción.`,
  'cards.bancoMaster.text3':
    `En el caso ${G('Banco Master', 'banco-master')} no hubo hecho nuevo este martes. El recurso sobre la instalación de la comisión investigadora sigue sin decisión, y la ausencia continúa siendo el registro. Flávio Bolsonaro nombró a Moraes, Dino y Zanin al defender públicamente la destitución de ministros del ${STF}, lo que mantiene el tema en la agenda política sin que exista un precio nuevo para medirlo.`,
  'cards.bancoMaster.conclusao':
    `⚠️ El contrato de destitución en el ${STF} NO tiene precio nuevo hoy, porque la traba de captura bloqueó cuatro rondas. En la captura trabada del 03/Ago estaba en 3,10% (vol USD 83 mil). Queda registrado que, el mismo día, se autorizó un tercer expediente contra el hijo del presidente y el segundo en la disputa defendió públicamente destituir ministros, sin que el panel pueda decir si el mercado descontó alguna de las dos cosas.`,
  'cards.stf.toffoli':
    `Toffoli sigue aislado en el ${STF} tras la crisis del Master, sin acto individual nuevo capturado este martes.`,
  'cards.stf.moraes':
    `Sin resolución nueva de Moraes en el período. Fue nombrado directamente por Flávio Bolsonaro, junto a Dino y Zanin, en una defensa pública de destituir ministros del tribunal.`,
  'cards.stf.dino':
    `ES EL MINISTRO DEL DÍA. Dino AUTORIZÓ la apertura del tercer expediente contra Lulinha, por sospecha de tráfico de influencias, y abrió en paralelo una investigación sobre filtraciones. También fue nombrado por Flávio en la defensa de destituir ministros.`,
  'cards.stf.mendonca':
    `Sigue como relator del expediente del caso Master, sin acto nuevo este martes.`,
  'cards.stf.nexo':
    `El nexo de este martes es la distancia entre un tablero que se movió mucho y un mercado que no se pudo medir. En lo político, Zema cerró fórmula con Eduardo Girão y Flávio perdió a Republicanos y Podemos el mismo día. En lo judicial, Dino autorizó el tercer expediente contra Lulinha y Flávio defendió públicamente destituir a tres ministros, nombrándolos. En la encuesta, la aprobación del gobierno no se movió por tercera ronda seguida. Y el precio, que sería el cruce de todo eso, quedó fuera: la traba de captura bloqueó cuatro veces.`,
  'cards.stf.analise':
    `⚠️ SIN PRECIO NUEVO PARA EL CONTRATO DE DESTITUCIÓN en esta ronda. En la captura trabada del 03/Ago estaba ESTABLE en 3,10% (vol USD 83 mil), y ese es el número que el panel muestra, marcado con su fecha. Vale el registro de método: en un día con la autorización de un expediente contra el hijo del presidente y con el segundo en la disputa nombrando a tres ministros que quiere destituir, sería tentador estimar una reacción. El panel no estima. Sin dos lecturas que coincidan no hay precio, y sin precio no hay cruce. La salvedad de siempre: con USD 83 mil acumulados, este es el contrato más fino que el panel publica.`,
})
