/**
 * Mapa ES de 13/Ago para analysis-criteriosa.json.
 * Convenções: vírgula decimal e ponto de milhar, como no pt-BR. Datas "13 de ago".
 */
import { construir } from '../build-locale-json'

const S = 'última lectura confirmada, del 12 de ago, 16:41 BRT'
const SEM = `SIN LECTURA DE MERCADO NUEVA EL 13 DE AGO. El valor exhibido es el de la ${S}.`

construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 13 de ago, a 52 días de la primera vuelta. ENCUESTA NACIONAL NUEVA: PoderData/Aya (n=2.400, telefónica, campo del 9 al 12 de ago, registro BR-06868/2026), la primera desde el 11 de ago. PRECIOS: no hay lectura de mercado nueva el 13 de ago, y los valores exhibidos son los de la ${S}. 📅 Quaest publica el 14 de ago y Nexus el 17 de ago.`,

  'candidates[0].header':
    `ENCUESTA NACIONAL NUEVA EL 13 DE AGO: PoderData/Aya (n=2.400, telefónica, campo del 9 al 12 de ago, registro BR-06868/2026) con 41% en la primera vuelta y 46% x 45% en el balotaje. Contra la propia casa, la primera vuelta repite el 41% x 35% del 30 de jul y el balotaje se estrecha de 3pp a 1pp. Rechazo en 48%, empatado con el de su adversario. Sin lectura de mercado nueva el 13 de ago: el precio exhibido es el de la ${S}.`,
  'candidates[0].fortes[1]':
    `La CNT/MDA del 11 de ago sigue siendo su mejor lectura de la ventana: 42,4% en la primera vuelta, con 13,7pp de ventaja, y 48% x 39% en el balotaje.`,
  'candidates[0].fortes[4]':
    `Precio de la ${S}, en 63,50%, con USD 8,22M acumulados. Entre los 173 puntos registrados desde el 16 de may, 29 tuvieron un valor igual o superior, con un máximo de 66,50% el 1 de ago a las 23:00.`,
  'candidates[0].fracos[3]':
    `Sin lectura de mercado nueva el 13 de ago, la distancia sobre el segundo no tiene medición nueva en este día. La última distancia confirmada es la del 12 de ago, 16:41 BRT.`,
  'candidates[0].fracos[4]':
    `Salvedad de serie, medida sobre los 173 puntos registrados desde el 16 de may y no sobre el último de cada día: 29 tuvieron un precio igual o superior a 63,50%, así que el nivel actual no es un extremo de la serie.`,
  'candidates[0].analise':
    `EL DÍA TRAJO ENCUESTA NACIONAL NUEVA Y NINGUNA LECTURA DE MERCADO NUEVA, y la lectura del día está entera en las encuestas. PoderData/Aya publicó la primera nacional desde el 11 de ago, y el hallazgo está en la casa comparada consigo misma, que es la comparación que mantiene constantes método, muestra y cuestionario. En la primera vuelta la distancia entre él y el segundo no se movió en cuatro semanas: 6pp el 16 de jul, 6pp el 30 de jul y 6pp ahora, con ambos repitiendo exactamente los mismos porcentajes de la ronda anterior. En el balotaje, en el mismo intervalo, la distancia cayó de 3pp a 1pp, que está dentro del margen de 2pp de la encuesta. Una vuelta detenida y la otra estrechándose, en la misma casa. El rechazo salió empatado en 48% para los dos primeros, lo que quita la base a cualquier lectura fácil sobre quién tiene más espacio para crecer. Lanzó su campaña a la reelección en el Estadio Vila Euclides, en São Bernardo, según TVT News y G1. SALVEDAD DE SERIE, medida sobre los 173 puntos registrados desde el 16 de may y no sobre el último de cada día: 29 tuvieron un valor igual o superior a 63,50%, con un máximo de 66,50% el 1 de ago a las 23:00.`,

  'candidates[1].header':
    `ENCUESTA NACIONAL NUEVA EL 13 DE AGO: PoderData/Aya le da 35% en la primera vuelta, el mismo valor que la casa le dio el 30 de jul, y 45% en el balotaje, contra 43% en la ronda anterior, a 1pp del líder. Rechazo en 48%, exactamente igual al de él. Sin lectura de mercado nueva el 13 de ago: el precio exhibido es el de la ${S}.`,
  'candidates[1].fortes[0]':
    `La Gerp del 11 de ago sigue siendo la primera nacional de la ventana en ponerlo al frente en el balotaje, con 45% contra 43%, y PoderData del 13 de ago lo deja a 1pp, dentro del margen.`,
  'candidates[1].fortes[4]':
    `Precio de la ${S}, en 27,65%, con USD 8,13M acumulados. Entre los 172 puntos registrados desde el 16 de may, 51 tuvieron un valor igual o superior, con un máximo de 33,20% el 2 de jun a las 19:30 y un piso de 22,00% el 3 de jul a las 01:00.`,
  'candidates[1].fracos[4]':
    `PoderData lo mantiene detenido en la primera vuelta, con el mismo 35% del 30 de jul, y su avance del día es solo en el balotaje. Acercarse en el balotaje y crecer en la primera vuelta son cosas distintas, y solo la segunda cambiaría la distancia que separa a los dos en la largada.`,
  'candidates[1].analise':
    `🔴 EL HECHO DEL DÍA SOBRE ÉL NO ES PRECIO NI ENCUESTA, ES REGISTRO. Folha de S.Paulo y G1 informan que aparece en el registro del TSE afiliado a Missão, el partido por el cual compite Renan Santos, sin tener conocimiento de eso, y que esto trabó el registro formal de su candidatura presidencial por el PL. G1 registra que el PL habla de fraude. El plazo de registro se cierra el 15 de ago, lo que da dos días. EN LAS ENCUESTAS, PoderData lo mantiene detenido en la primera vuelta, con el mismo 35% del 30 de jul, y lo acerca en el balotaje, de 43% a 45%, dejando la distancia en 1pp, dentro del margen. Exame lo resumió como crecimiento de él en el balotaje. EL RECHAZO EMPATADO EN 48% es el dato que el panel destaca, porque impide la lectura de que alguno de los dos tendría un techo mayor. ⚠️ NINGUNA CAUSA SE ATRIBUYE: no hay lectura de mercado nueva el 13 de ago para comparar con el episodio del registro, y el panel no convierte una coincidencia de fechas en una relación. SALVEDAD DE SERIE, sobre los 172 puntos registrados desde el 16 de may: 51 tuvieron un valor igual o superior a 27,65%, con un máximo de 33,20% el 2 de jun a las 19:30.`,

  'candidates[2].header':
    `PoderData del 13 de ago lo probó en el balotaje y es el ÚNICO del pelotón al que el líder vence en ese escenario, según Bnews, mientras empata con los otros tres. Sus porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas. Sin lectura de mercado nueva el 13 de ago: el precio exhibido es el de la ${S}.`,
  'candidates[2].fortes[0]':
    `Mantiene el mayor volumen acumulado del libro presidencial entre los nombres por encima de 1%, con USD 9,48M en la ${S}.`,
  'candidates[2].fortes[1]':
    `Salvedad de serie: en la ventana registrada desde el 16 de may su precio pasó la mayor parte del tiempo en un nivel igual o superior al actual, con un piso de 6,80% el 6 de ago, así que el valor de hoy está cerca de la parte baja de su propia serie.`,
  'candidates[2].analise':
    `EL DÍA LO SEPARÓ DEL RESTO DEL PELOTÓN, Y PARA PEOR. PoderData probó cuatro nombres en el balotaje contra el líder y, según CNN Brasil y Bnews, tres empataron y solo él perdió. Es la primera vez en la ventana que el pelotón se divide así, y la división NO sigue al precio: él está valorado bastante por encima de Caiado y de Zema, que empataron. ⚠️ Sus porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas, y el panel no los estima: siguen valiendo el 5% de la Gerp del 11 de ago, el 4% de Genial/Quaest y de BTG/Nexus, el 4,7% de Meio/Ideia y el 10% de Palver por internet. EL EFECTO DE MÉTODO sigue siendo la lectura sobre él, con el mismo nombre yendo de 4% a 10% según el ambiente de la entrevista, salvedad declarada por la propia Palver. EN EL TABLERO, Gazeta do Povo publicó su plan de gobierno, y el partido por el cual compite es el mismo en el que el segundo apareció afiliado sin saberlo, en el episodio que trabó el registro de aquel.`,

  'candidates[3].header':
    `⭐ EL PELOTÓN TUVO SU MEJOR DÍA DE LA VENTANA, Y VINO DE LAS ENCUESTAS. Según CNN Brasil y Bnews, PoderData del 13 de ago pone a CAIADO y a ZEMA en EMPATE con el líder en el balotaje. Para Caiado es el segundo empate en cuatro días, después del de BTG/Nexus del 10 de ago. Sin lectura de mercado nueva el 13 de ago: los precios exhibidos son los de la ${S}.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,95% (vol USD 5,66M acumulado, ${S}) | EMPATA con el líder en el balotaje de PoderData del 13 de ago | encuestas vigentes: Gerp 4%, Genial/Quaest 4%, Meio/Ideia 5,7%, BTG/Nexus 5%`,
  'candidates[3].caiado.fortes':
    `EMPATA CON EL LÍDER EN EL BALOTAJE de PoderData del 13 de ago, según CNN Brasil y Bnews, su segundo empate en cuatro días después del de BTG/Nexus del 10 de ago. Es el mejor resultado que un nombre fuera de los dos primeros viene obteniendo en la ventana.`,
  'candidates[3].caiado.fracos':
    `LA DISTANCIA ENTRE ENCUESTA Y PRECIO SIGUE SIENDO LA MAYOR DEL PELOTÓN EN ESTA VENTANA: de 4% a 5,7% de intención declarada contra 0,95% valorado en la última lectura confirmada. Sus porcentajes de primera vuelta en la ronda del 13 de ago no aparecieron en las notas capturadas, y el panel registra la ausencia en vez de estimar.`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,15% (vol USD 7,06M acumulado, ${S}) | NO probado por las nacionales vigentes, porque compite por la gobernación de São Paulo`,
  'candidates[3].haddad.fortes':
    `Su volumen acumulado sigue siendo mayor que el de varios nombres con precio por encima del suyo, lo que mantiene el contrato con respaldo de negociación pese al precio bajo.`,
  'candidates[3].haddad.fracos':
    `PoderData del 13 de ago no lo prueba, y ninguna nacional de la ventana lo prueba en escenario presidencial. LA SALVEDAD PERMANECE Y DEBE DECIRSE CON CLARIDAD: él NO es candidato a la Presidencia, compite por la gobernación de São Paulo, y cualquier escenario que lo incluya es hipótesis de encuesta, no candidatura en curso.`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,35% (vol USD 5,07M acumulado, ${S}) | EMPATA con el líder en el balotaje de PoderData del 13 de ago | encuestas vigentes: Gerp 2%, Genial/Quaest 2%, Meio/Ideia 2,6%, BTG/Nexus 3%`,
  'candidates[3].zema.fortes':
    `EMPATA CON EL LÍDER EN EL BALOTAJE por primera vez en la ventana, según CNN Brasil y Bnews. Sigue siendo el único del pelotón con registro de candidatura presentado al TSE, el 6 de ago con R$ 178,7 millones declarados, en un plazo que se cierra el 15 de ago.`,
  'candidates[3].zema.fracos':
    `EL PRECIO SIGUE POR DEBAJO DEL CORTE DE 0,5% que el panel usa para separar precio de ruido, y en esa franja la variación no sostiene interpretación. Sus porcentajes de primera vuelta en la ronda del 13 de ago no aparecieron en las notas capturadas, y sigue siendo el nombre del pelotón con la menor intención declarada entre los que las casas prueban.`,
  'candidates[3].analise':
    `⭐ EL CONTRASTE MÁS FUERTE DEL DÍA ESTÁ AQUÍ, Y OPONE ENCUESTA A PRECIO. Caiado y Zema EMPATAN con el líder en el balotaje de PoderData, según CNN Brasil y Bnews, y los precios de victoria vigentes para ambos son 0,95% y 0,35%. Son preguntas distintas y el panel no las resta: empatar en un balotaje hipotético mide otra cosa que ganar la elección, y la distancia entre las dos mediciones es justamente lo que esta sección existe para mostrar. Para Caiado es el segundo empate en cuatro días, después del de BTG/Nexus del 10 de ago. ⚠️ Los porcentajes de primera vuelta de estos nombres en esta ronda no aparecieron en las notas capturadas, y el panel registra ausencia en vez de estimar. EN EL TABLERO, Caiado atacó en São Paulo las trayectorias de los dos primeros y criticó la actuación del Supremo, según Goiás 246; Zema sigue siendo el único del pelotón con registro presentado al TSE, y el plazo de los demás se cierra el 15 de ago.`,
  'candidates[3].fortes[0]':
    `PoderData del 13 de ago pone a Caiado y a Zema en empate con el líder en el balotaje, según CNN Brasil y Bnews, y Caiado sigue por delante de Zema en todas las rondas que publican la primera vuelta de ambos.`,
  'candidates[3].fortes[4]':
    `La Palver del 10 de ago no prueba a Caiado ni a Zema en el escenario divulgado, así que la ausencia de lectura se registra como ausencia, y no se completa con una estimación.`,
  'candidates[3].fracos[2]':
    `DOS DE LAS TRES NACIONALES DEL 11 DE AGO no publicaron el campo completo, y PoderData del 13 de ago no tuvo sus porcentajes de primera vuelta en las notas capturadas, así que la base de comparación entre casas sobre ellos sigue siendo estrecha.`,

  'quadroComparativo[0].p':
    `NACIONAL NUEVA EL 13 DE AGO. PoderData/Aya (n=2.400, telefónica, campo del 9 al 12 de ago, BR-06868/2026): 41% en la primera vuelta y 46% x 45% en el balotaje. Contra la propia casa, la primera vuelta repite el 41% x 35% del 30 de jul y el balotaje se estrecha de 3pp a 1pp. Rechazo en 48%, igual al de su adversario. Aprobación personal en 43% contra 50% de desaprobación.`,
  'quadroComparativo[0].t':
    `${SEM} LO QUE CAMBIÓ HOY VINO DE LAS ENCUESTAS, NO DEL PRECIO: PoderData repite la primera vuelta de la propia casa y estrecha el balotaje de 3pp a 1pp. SALVEDAD DE SERIE: entre los 173 puntos registrados desde el 16 de may, 29 tuvieron un valor igual o superior a 63,50%, con un máximo de 66,50% el 1 de ago a las 23:00 y un piso de 39,50% el 26 de may.`,
  'quadroComparativo[0].s':
    `A 52 días de la elección. Lanzó su campaña a la reelección en el Estadio Vila Euclides, en São Bernardo, cuna del sindicalismo en la región del ABC, según TVT News y G1, el mismo día en que su adversario abrió la suya en Río. 📅 Quaest publica el 14 de ago y Nexus el 17 de ago.`,

  'quadroComparativo[1].p':
    `NACIONAL NUEVA EL 13 DE AGO. PoderData/Aya le da 35% en la primera vuelta, el mismo valor que la casa le dio el 30 de jul, y 45% en el balotaje, contra 43% en la ronda anterior. Rechazo en 48%, exactamente igual al del líder. Siguen valiendo el 28,7% de la CNT/MDA, el 34,1% de la Futura y el 38% de la Gerp, del 11 de ago.`,
  'quadroComparativo[1].t':
    `${SEM} EN LAS ENCUESTAS repitió el 35% de la propia casa en la primera vuelta y subió de 43% a 45% en el balotaje. SALVEDAD DE SERIE: entre los 172 puntos registrados desde el 16 de may, 51 tuvieron un valor igual o superior a 27,65%, con un máximo de 33,20% el 2 de jun a las 19:30 y un piso de 22,00% el 3 de jul a las 01:00.`,
  'quadroComparativo[1].s':
    `🔴 EL HECHO DEL DÍA ES SU REGISTRO. Folha de S.Paulo y G1 informan que aparece en el TSE afiliado a Missão, el partido del MBL y de Renan Santos, sin tener conocimiento de eso, lo que entorpeció el registro formal de su candidatura presidencial por el PL. G1 registra que el PL habla de fraude. El plazo de registro se cierra el 15 de ago. Abrió su campaña en Río y volvió a criticar al juez Moraes tras un operativo contra una fuente de un periodista.`,

  'quadroComparativo[2].p':
    `PoderData del 13 de ago lo probó en el balotaje y es el único del pelotón al que el líder VENCE en ese escenario, según Bnews, mientras empata con los otros tres. Sus porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas. Siguen el 5% de la Gerp, el 4% de Genial/Quaest y de BTG/Nexus, el 4,7% de Meio/Ideia y el 10% de Palver por internet.`,
  'quadroComparativo[2].t':
    `${SEM} Mantiene el mayor volumen acumulado del libro entre los nombres por encima de 1%.`,
  'quadroComparativo[2].s':
    `Gazeta do Povo publicó su plan de gobierno. El partido por el cual compite, Missão, es el mismo en el que el candidato del PL apareció afiliado sin saberlo, según Folha y G1, en el episodio que trabó el registro presidencial de aquel.`,

  'quadroComparativo[3].p':
    `PoderData del 13 de ago lo pone en EMPATE con el líder en el balotaje, según CNN Brasil y Bnews, su segundo empate en cuatro días después del de BTG/Nexus del 10 de ago. Los porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas, y siguen el 4% de la Gerp y de Genial/Quaest, el 5,7% de Meio/Ideia y el 5% de BTG/Nexus.`,
  'quadroComparativo[3].t':
    `${SEM} La distancia entre encuesta y precio sigue siendo la mayor del pelotón en esta ventana: de 4% a 5,7% de intención declarada contra 0,95% valorado, y ahora con un empate en el balotaje en dos casas distintas en cuatro días.`,
  'quadroComparativo[3].s':
    `En São Paulo, según Goiás 246, atacó las trayectorias del líder y del segundo y criticó la actuación del Supremo.`,

  'quadroComparativo[4].p':
    `PoderData del 13 de ago lo pone en EMPATE con el líder en el balotaje, según CNN Brasil y Bnews, y es la primera vez en la ventana que aparece en esa condición. Los porcentajes de primera vuelta en esta ronda no aparecieron en las notas capturadas, y siguen el 2% de la Gerp, el 3% de BTG/Nexus, el 2% de Genial/Quaest y el 2,6% de Meio/Ideia.`,
  'quadroComparativo[4].t':
    `${SEM} Sigue por debajo del corte de 0,5% que el panel usa para separar precio de ruido. ⚠️ EL CONTRASTE DEL DÍA ES SUYO: empata con el líder en el balotaje y está valorado en 0,35%.`,
  'quadroComparativo[4].s':
    `Sigue siendo el único del pelotón con registro de candidatura ya presentado al TSE, el 6 de ago con R$ 178,7 millones declarados. El plazo de los demás se cierra el 15 de ago, y a partir de ahí la ausencia de registro pasa a ser un hecho, y no una pendencia.`,

  'quadroComparativo[5].p':
    `Sin encuesta. Mercado de impeachment de un ministro del Supremo antes de 2027.`,
  'quadroComparativo[5].t':
    `${SEM} Sigue siendo el contrato más fino entre los seguidos, y un movimiento en él exige esa salvedad.`,
  'quadroComparativo[5].s':
    `El hilo judicial del día es el operativo de la Policía Federal contra la fuente de un periodista, con base en un intercambio de mensajes que sustentaron reportajes sobre Dino. El ministro dijo ser objeto de agresiones e injusticias, según O Globo, y la decisión de Moraes en el caso generó reacción de entidades y dudas entre especialistas, según Folha. Sigue vigente la determinación del 12 de ago en la que Moraes, Dino, Gilmar Mendes y Zanin ordenaron a siete tribunales devolver penduricalhos.`,

  'quadroComparativo[0].m': `63,50% (vol USD 8,22M acumulado), ${S}`,
  'quadroComparativo[1].m': `27,65% (vol USD 8,13M), ${S}`,
  'quadroComparativo[2].m': `7,45% (vol USD 9,48M), ${S}`,
  'quadroComparativo[3].m': `0,95% (vol USD 5,66M), ${S}`,
  'quadroComparativo[4].m': `0,35% (vol USD 5,07M), ${S}`,
  'quadroComparativo[5].m': `3,90% (vol USD 83 mil), ${S}`,

  cruzamento:
    `EL DÍA SE DECIDIÓ EN LAS ENCUESTAS Y EN EL REGISTRO ELECTORAL, NO EN EL PRECIO. Primero, PoderData/Aya publicó la primera nacional desde el 11 de ago y el hallazgo está en la casa comparada consigo misma: en la primera vuelta la distancia entre los dos primeros no se movió en cuatro semanas, fueron 6pp el 16 de jul, 6pp el 30 de jul y 6pp ahora, con ambos repitiendo exactamente los mismos porcentajes de la ronda anterior; en el balotaje, en el mismo intervalo, la distancia cayó de 3pp a 1pp. Misma casa, mismo método, misma muestra y mismo registro en el TSE, con una vuelta detenida y la otra estrechándose. Segundo, el rechazo salió empatado en 48% para los dos primeros, lo que quita la base a cualquier lectura fácil sobre quién tiene más espacio para crecer. Tercero, y es el hecho político del día, Folha de S.Paulo y G1 informan que el segundo aparece en el registro del TSE afiliado a Missão, el partido por el cual compite el cuarto colocado, sin tener conocimiento de eso, y que esto trabó el registro formal de su candidatura presidencial por el PL, que habla de fraude. El plazo de registro se cierra el 15 de ago. ⚠️ EL PANEL NO ATRIBUYE CAUSA: no hay aquí ninguna medición que vincule el episodio del registro a un movimiento de precio, y no hay lectura de mercado nueva el 13 de ago para comparar. Los precios exhibidos en esta página son los de la ${S}.`,
})
