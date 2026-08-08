/**
 * Mapa ES de 08/Ago para analysis-data.json.
 * Convenções: vírgula decimal e ponto de milhar, como o pt. Datas "8/Ago".
 */
import { construir } from '../build-locale-json'

const G = (t: string, id: string) => `[${t}](/es/glossary#${id})`
const PV = G('primera vuelta', 'primeiro-turno')

construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `A 57 días de la ${PV}, los dos lados del cruce quedaron quietos y lo que se movió fue el tablero. No salió encuesta nacional nueva desde el 5/Ago: siguen vigentes ${G('Genial/Quaest', 'quaest')} (n=2.004, presencial, margen 2pp, BR-06591/2026) con 39% x 30% en la primera vuelta y 44% x 39% en el balotaje, y Meio/Ideia (n=1.500, telefónica, margen 2,5pp, BR-04579/2026) con 43% x 35% y 48,5% x 43%.`,

  'cards.sentimento.text2':
    `LA RACHA DE SEIS DÍAS DE ESTRECHAMIENTO DE LA BRECHA NO CONTINUÓ. Venía de +41,80pp el 1/Ago y cayó todos los días hasta el 7/Ago; hoy la brecha quedó en +37,55pp, con Lula estancado en 64,50% por quinto día consecutivo y Flávio estancado en 26,95%. Ninguno de los dos devolvió terreno, lo que también es información: el nivel nuevo del segundo se sostuvo sin una encuesta nueva que lo confirmara.`,

  'cards.sentimento.text3':
    `EL MOVIMIENTO DEL DÍA ESTÁ EN LOS LIBROS DE COLOCACIÓN, Y CONTRADICE LA LECTURA DE AYER. En el contrato de segundo lugar de la ${PV}, Flávio cayó por segundo día consecutivo, sumando 6,00pp en dos días, y esta vez su precio de ganador no subió junto. Y en el contrato de tercer lugar la transferencia se detuvo: Caiado cayó 2,50pp y Renan Santos NO subió, quedó quieto. En los dos días anteriores los dos se movían en espejo. Hoy la probabilidad salió del libro en vez de migrar dentro de él.`,

  'cards.sentimento.direita':
    `LA FÓRMULA DE FLÁVIO CERRÓ UN CUADRO ESTRUCTURAL: 2026 es la primera elección de este siglo sin mujer en fórmula presidencial competitiva, contando como competitiva la fórmula cuyo partido tiene representación en el Congreso (CNN Brasil y Jornal de Brasília, 8/Ago). Desde 2002 siempre hubo al menos una, y en este ciclo las mujeres aparecen solo en candidaturas de partidos sin bancada. Él respondió al tema hablando de nombrar mujeres al ${G('STF', 'stf')} en un evento con aliadas (Folha de S.Paulo, 8/Ago). El compañero de fórmula sigue siendo el problema: está en la lista de enmiendas Pix que Dino ordenó investigar a la ${G('PF', 'pf')}, con R$ 6,2 millones enviados a São José da Laje que la auditoría del TCU no pudo rastrear, Gilmar Mendes dijo no conocerlo, y las actas del ${G('PL', 'pl')} dejan una rendija para que vuelva a disputar el Senado si cambia la fórmula.`,

  'cards.sentimento.esquerda':
    `LULA REGISTRÓ SU CANDIDATURA en el ${G('TSE', 'tse')} la noche del 7/Ago, con Alckmin de compañero de fórmula, por la coalición Brasil Pronto Pra Mais, que reúne siete partidos: PDT, PSB, la federación PT, PCdoB y PV, y la federación PSOL y Rede. Es la ÚNICA fórmula de la disputa con más de un partido, en un cuadro descrito como el de más fórmulas de un solo partido desde la redemocratización (G1, 8/Ago). El lanzamiento oficial está previsto para el 16/Ago, en Vila Euclides. En el eje judicial, el ${G('PT', 'pt')} acudió al ${G('STF', 'stf')} exigiendo investigación sobre la filtración de audios del hijo del presidente a su rival, y Mendonça ordenó la entrega de datos sobre un encuentro del partido y sobre el proyecto Porta-Vozes de Lula.`,

  'cards.sentimento.terceiraVia':
    `EL ESPACIO NO TUVO HECHO PROPIO, Y LO QUE LO ALCANZA VIENE DEL CUADRO GENERAL. En el precio, el movimiento fue todo de Caiado y hacia abajo por segundo día: presidencial de 1,55% a 1,35%, y tercer lugar de la ${PV} de 33,50% a 31,00%. Zema subió 0,10pp, a 0,55%, y volvió a pasar el corte de 0,5% que separa precio de ruido. Haddad cayó a 0,05%. En las encuestas nada cambió: Caiado sigue con 4% en Quaest y 5,7% en Ideia, Renan Santos con 4% y 4,7%, Zema con 2% y 2,6%. Zema, que presentó su registro el 6/Ago, sigue siendo el único de los tres con candidatura presentada, en un plazo que va hasta el 15/Ago.`,

  'cards.sentimento.polymarket':
    `Precios de la lectura del 8/Ago, de las 17:32 UTC: Lula 64,50% (vol USD 8,12M acumulado), Flávio 26,95% (vol USD 8,08M), Renan Santos 7,65% (vol USD 9,23M), Caiado 1,35% (vol USD 5,59M), Zema 0,55% (vol USD 5,01M), Haddad 0,05% (vol USD 6,78M), destitución en el STF 3,10% (vol USD 83 mil). Volumen total del libro presidencial en USD 121,06M. Brecha de Lula sobre Flávio en +37,55pp, y la racha de seis días de estrechamiento se detuvo aquí. AFOS solo publica precio que dos lecturas independientes confirmen, tomadas con ocho minutos de intervalo, y la que vale es siempre la más reciente. EN LOS LIBROS DE COLOCACIÓN: en el de segundo lugar, Flávio cayó a 81,50%, segundo día consecutivo, y Renan Santos está en 8,30% contra 8,20% de Lula, diferencia de 0,10pp entre dos valores bajos. En el de tercer lugar, Renan Santos quedó quieto en 58,50% y Caiado cayó a 31,00%.`,

  'cards.inss.text1':
    `El ${G('INSS', 'inss')} entró hoy por la vía de las enmiendas, no por el fraude en las jubilaciones. Dino ordenó a la Policía Federal investigar indicios de delito en R$ 55,4 millones de enmiendas Pix señalados por una auditoría del TCU, y la lista alcanza a los dos lados de la disputa.`,

  'cards.inss.text2':
    `LA LISTA TIENE TRES NOMBRES QUE IMPORTAN PARA ESTE PANEL, Y CITAR SOLO UNO SERÍA ELEGIR UN LADO. Alfredo Gaspar, compañero de fórmula de Flávio Bolsonaro, con R$ 6,2 millones enviados a São José da Laje, en Alagoas, que la auditoría no pudo rastrear. Hugo Motta, presidente de la Cámara. Y Rogério Carvalho, exlíder del ${G('PT', 'pt')} en el Senado. Entran además otros seis diputados federales, dos senadores y cuatro exparlamentarios.`,

  'cards.inss.text3':
    `LA APROBACIÓN DEL GOBIERNO SIGUE SIN MEDICIÓN NUEVA. Valen ${G('Genial/Quaest', 'quaest')} del 5/Ago, con 48% x 47% y la gestión en 36% positiva, 26% regular y 36% negativa, Meio/Ideia de la misma ventana, con 48,5% x 49%, y ${G('BTG/Nexus', 'nexus-btg')} del 3/Ago, con 47% x 48%. Las tres quedan dentro de cualquier margen una de otra, y por eso el signo del saldo depende de la casa.`,

  'cards.inss.text4':
    `Los números de mercado de este panel son de la lectura del 8/Ago a las 17:32 UTC. El Senado tiene al ${G('PL', 'pl')} en 73,50% (vol USD 259 mil), contra 73,00% el 7/Ago, y al ${G('MDB', 'mdb')} en 18,45%. El contrato de inflación anual de 2026 no entra en la confirmación por dos lecturas, así que el panel publica el REPARTO DEL LIBRO en vez de tratar cada banda como probabilidad: la banda de 5,00% a 5,49% concentra 40,8% del libro, la de 5,50% a 5,99% concentra 22,9% y la de 4,50% a 4,99% concentra 19,7%. Las bandas suman 105,55% en precio bruto, y por eso la lectura correcta allí es participación, no probabilidad.`,

  'cards.inss.impactoLula':
    `Sin medición nueva de aprobación. Valen los 48% contra 47% de la Quaest del 5/Ago, con 5% sin respuesta. En las encuestas, Lula lidera los cuatro escenarios de balotaje de las dos rondas vigentes y gana a Zema, Caiado y Renan Santos en todos. Lo que cambió hoy fue el registro: su candidatura fue presentada en el ${G('TSE', 'tse')} la noche del 7/Ago, con Alckmin de compañero de fórmula.`,

  'cards.inss.impactoGestao':
    `Gestión en 36% positiva, 26% regular y 36% negativa en la Quaest del 5/Ago, reparto idéntico al del 15/Jul. En ${G('BTG/Nexus', 'nexus-btg')} del 3/Ago son 37% de excelente o bueno contra 43% de malo o pésimo. Las dos casas miden la gestión de forma distinta y el panel registra ambas sin arbitrar, porque la comparación válida es de cada casa consigo misma. BTG/Nexus vuelve a campo, con divulgación prevista para el 10/Ago.`,

  'cards.inss.conclusao':
    `A 57 días de la elección, el día detuvo el precio y movió el tablero. La brecha quedó en +37,55pp y la racha de seis días de estrechamiento no continuó, con los dos extremos quietos. Lo que se movió fueron los libros de colocación, y allí la lectura de ayer no se repitió: la transferencia entre Renan Santos y Caiado en el contrato de tercer lugar se detuvo, y la probabilidad salió del libro en vez de migrar dentro de él. LA PRUEBA LLEGA EL LUNES, EL MARTES Y EL JUEVES: seis encuestas nacionales están registradas en el ${G('TSE', 'tse')} para el 10, el 11 y el 13/Ago, una de ellas con n=5.000, y ninguna tiene resultado todavía.`,

  'cards.bancoMaster.text1':
    `El ${G('caso Master', 'banco-master')} se movió en el patrimonio, no en la investigación. La prensa informó que la holding de Daniel Vorcaro fue liquidada en las Islas Caimán, y que el liquidador avanzó en la búsqueda de bienes, consiguiendo una revisión de apartamentos en Estados Unidos (noticiero del 7 y el 8/Ago).`,

  'cards.bancoMaster.text2':
    `La fricción institucional entre la Policía Federal y André Mendonça, relator de la investigación, siguió en el noticiero, pero con un registro que baja la alarma: comisarios consultados por la prensa dicen que el ambiente se volvió hostil y que aun así no ven riesgo para las investigaciones (noticiero del 8/Ago). El ministro de Justicia intenta mediar.`,

  'cards.bancoMaster.text3':
    `La declaración de Jaques Wagner ante la ${G('PF', 'pf')} sobre el caso Master sigue aplazada, a pedido de la defensa, que alegó falta de acceso al expediente. El recurso de amparo sobre la instalación de la comisión de investigación sigue sin decisión, y la ausencia sigue siendo el registro. La consulta específica sobre Master, Vorcaro, STF, INSS y la comisión trajo flujo bajo hoy, con un ítem, lo que es información sobre el día y queda anotado como tal en vez de volverse silencio.`,

  'cards.bancoMaster.conclusao':
    `El contrato de destitución de un ministro del ${G('STF', 'stf')} quedó quieto en 3,10% (vol USD 83 mil) en la lectura del 8/Ago a las 17:32 UTC, el mismo valor del 7/Ago. Es el contrato más fino entre los que el panel publica, con volumen acumulado que no llega a una milésima del libro presidencial. En un día en que el Poder Judicial apareció en cuatro frentes, de enmiendas Pix a un pedido de visita denegado, el precio no se movió. El panel registra las dos cosas lado a lado y no concluye nada a partir de la ausencia de movimiento en un contrato de ese tamaño.`,

  'cards.stf.toffoli':
    `Toffoli sigue sin acto individual nuevo capturado este sábado.`,

  'cards.stf.moraes':
    `Denegó el pedido de Jair Bolsonaro para recibir la visita de sus hijos en el Día del Padre (noticiero del 8/Ago). Sigue vigente el registro del 4/Ago, cuando recibió en su casa el encuentro entre Lula y Alcolumbre, episodio que volvió a las páginas de opinión este fin de semana.`,

  'cards.stf.gilmar':
    `Dijo no conocer a Alfredo Gaspar, el compañero de fórmula de Flávio Bolsonaro (noticiero del 7/Ago). Sigue en pie su propuesta de doctrina vinculante para frenar las ${G('pautas-bomba', 'pauta-bomba')}, que otros ministros señalaron apoyar.`,

  'cards.stf.dino':
    `ES EL MINISTRO DEL DÍA. Ordenó a la ${G('PF', 'pf')} investigar indicios de delito en R$ 55,4 millones de enmiendas Pix señalados por una auditoría del TCU. La lista alcanza al compañero de fórmula de Flávio Bolsonaro, con R$ 6,2 millones sin rastrear, al presidente de la Cámara, Hugo Motta, y a Rogério Carvalho, exlíder del ${G('PT', 'pt')} en el Senado, además de otros seis diputados, dos senadores y cuatro exparlamentarios.`,

  'cards.stf.mendonca':
    `Como vicepresidente del ${G('TSE', 'tse')}, ordenó la entrega de datos sobre un encuentro del PT y sobre el proyecto Porta-Vozes de Lula (noticiero del 8/Ago). Sigue siendo relator de la investigación del caso ${G('Master', 'banco-master')}, y su fricción con la PF continúa en el noticiero, con el ministro de Justicia intentando mediar.`,

  'cards.stf.nexo':
    `El hilo de este sábado es que la decisión de mayor alcance del día golpea a los dos lados por el MISMO acto. Dino ordenó investigar enmiendas Pix y la lista tiene al compañero de fórmula del segundo, al presidente de la Cámara y a un exlíder del ${G('PT', 'pt')} en el Senado. No es una decisión contra un campo, es una auditoría que alcanzó a parlamentarios de varios. En paralelo, el PT acudió al ${G('STF', 'stf')} por la filtración de audios del hijo del presidente, Mendonça pidió datos sobre un encuentro del partido, Moraes denegó a Bolsonaro la visita de sus hijos y Gilmar dijo no conocer al compañero de fórmula de Flávio. En el precio, el contrato de ganador no se movió.`,

  'cards.stf.analise':
    `EL CONTRATO DE DESTITUCIÓN QUEDÓ QUIETO en 3,10% (vol USD 83 mil), el mismo del 7/Ago. En un día en que el Poder Judicial apareció en cuatro frentes distintos, el precio no reaccionó, y el panel no trata eso como señal: con USD 83 mil acumulados, este es el contrato más fino entre los que el panel publica, y la ausencia de movimiento allí significa tan poco como el movimiento. La salvedad se repite a propósito, porque es el último lugar donde se debe buscar confirmación de una tesis política.`,
})
