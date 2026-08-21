/**
 * Mapa ES de 20/Ago/2026 para os três JSONs do painel do Brasil.
 * Convenções ES: VÍRGULA decimal e PONTO de milhar.
 * ⚠️ Armadilhas registradas: `pesquisa` é `encuesta` e nunca `investigación`;
 *    `estadual` é `estatal`; `parado` é desempregado, então usa-se `estancado`;
 *    o verbo de mercado é `descontar`, nunca `precificar`.
 * ⛔ `updatedAt` e `lastUpdate` NÃO se traduzem.
 */
import { construir } from '../build-locale-json'

const STAMP = 'lectura confirmada del 20 de ago, 23:19 BRT (21 de ago, 02:19 UTC)'
const LECT = 'lectura del 20 de ago, 23:19 BRT (21 de ago, 02:19 UTC)'
const NEXUS = 'BTG/Nexus del 17 de ago (n=2.003, campo del 14 al 16 de ago, registro TSE BR-03317/2026)'

// ─────────────────────────────────────────────── analysis-data
construir('analysis-data', 'es', {
  'cards.sentimento.text1':
    `La distancia entre LULA y FLÁVIO BOLSONARO se acortó por CUARTO día seguido y cerró en 30,65pp en la ${STAMP}. Eran 37,05pp el 16 de ago, 33,05pp el 17, 31,45pp el 18 y 30,95pp el 19: son 6,40pp en cuatro días.`,
  'cards.sentimento.text2':
    `El movimiento sigue teniendo un solo lado, y eso es lo que muestra la semana. Lula repitió 63,50% por TERCER día seguido, sin perder precio alguno, y todo el acercamiento vino del segundo subiendo 0,30pp. ⛔ Y no es récord: en la serie unida de 175 lecturas desde el 23 de mayo, solo 2 marcan 32,85% o más, y las dos son 33,20%, del 2 de jun y del 18 de ago.`,
  'cards.sentimento.text3':
    `⭐ El hecho del día vino de fuera del pelotón de cabeza. PABLO MARÇAL registró su candidatura por el PRTB, aprovechando una brecha provocada por el TSE (Folha, 20 de ago), y ese mismo día el Ministerio Público pidió al TSE que la impida y que lo deje fuera de los debates (Folha, 19 de ago), mientras el TSE concedía una medida cautelar que le prohíbe usar recursos oficiales en la campaña (TSE, 20 de ago). Las urnas siguen mudas: ninguna encuesta nacional nueva desde el 17 de ago. La Datafolha del 21 de ago es la primera hecha tras el registro de las candidaturas y la primera en medir a Marçal.`,
  'cards.sentimento.direita':
    `El segundo subió 0,30pp, de 32,55% a 32,85% (vol USD 8,68M acumulado), ${STAMP}, en su cuarto día seguido acortando la distancia. En el contrato de 2º lugar está en 87,50% (vol USD 308 mil). ⚠️ Fuera del precio, elogió a Pablo Marçal como "un buen tipo, preparado y bienintencionado" (Estadão, 20 de ago), y dijo que mira al Supremo "con asco", hablando de ser un presidente de transición (Folha, 20 de ago).`,
  'cards.sentimento.esquerda':
    `El líder repitió 63,50% por TERCER día seguido (vol USD 8,74M acumulado), ${STAMP}, sin perder precio alguno. El techo de la serie es 67,50%, del 16 de ago, y 63,50% es su valor más repetido: 20 de las 175 lecturas desde el 23 de mayo marcan exactamente ese número.`,
  'cards.sentimento.terceiraVia':
    `⭐ EL PELOTÓN SE MOVIÓ EN DOS DIRECCIONES OPUESTAS. Renan Santos subió 0,40pp, de 4,05% a 4,45% (vol USD 10,28M), el mayor movimiento del día, y en el contrato de 3º lugar está en 55,50% frente a 34,50% de Ronaldo Caiado. 📉 En cambio Pablo Marçal cayó de 0,75% a 0,25% y Caiado de 0,55% a 0,35%. ⚠️ Los dos están por debajo de 0,5%, que es el piso vigilado por la doble lectura, así que son lectura de libro y no precio confirmado. 🔑 Y la discrepancia del tercer lugar se mantiene: el mercado paga más por Renan Santos, mientras la última encuesta nacional, del 17 de ago, da 5% a Caiado frente a 4% a él.`,
  'cards.sentimento.polymarket':
    `Lectura confirmada del 20 de ago, 23:19 BRT (21 de ago, 02:19 UTC). Lula 63,50%, Flávio Bolsonaro 32,85%, Renan Santos 4,45%, Ronaldo Caiado 0,35% y Pablo Marçal 0,25%. El libro presidencial acumula USD 129,90M.`,

  'cards.inss.text1':
    `⭐ HECHO NUEVO EL 20 DE AGO, Y VIENE DE LA FISCALÍA. La Procuraduría General afirmó que el llamado "Careca do INSS" no cerró negocios con el gobierno de Lula y señaló imprecisión en una conclusión de la Policía Federal, según Estadão, en una petición enviada al ministro André Mendonça.`,
  'cards.inss.text2':
    `Ese mismo día el caso se volvió litigio entre los dos lados de la disputa: Fábio Luís Lula da Silva demandó a Flávio Bolsonaro y pidió indemnización por un video hecho con inteligencia artificial sobre sospechas de desvíos, según O Globo, 20 de ago. Antes, el 20 de ago, Flávio citó el caso y trató el episodio Dark Horse como página vuelta, según Folha.`,
  'cards.inss.text3':
    `La distinción que este panel mantiene desde el inicio sigue vigente: una cosa es el efecto sobre la evaluación de la gestión y otra el efecto sobre la intención de voto. ⛔ El panel NO atribuye al caso el acortamiento de 6,40pp en cuatro días, porque no hay medición que lo aísle.`,
  'cards.inss.text4':
    `⚠️ La evaluación de gobierno más reciente sigue siendo la de la ${NEXUS}, con 42% de mala o pésima frente a 34% de óptima o buena, y 23% de regular. 📌 Folha informó el 21 de ago, en la columna de Mônica Bergamo, que encuestas INTERNAS del PT indicarían una reducción de la ventaja de Lula. ⛔ El panel no publica números de encuesta interna de partido: no hay registro, muestra ni metodología divulgados.`,
  'cards.inss.impactoLula':
    `No aislable. La última medición nacional es del 17 de ago y lo coloca en 41% en la primera vuelta, un punto arriba frente a la ronda anterior de la misma casa. Ningún movimiento de precio desde entonces tiene una encuesta nueva que lo explique.`,
  'cards.inss.impactoGestao':
    `La evaluación sigue con saldo negativo: 42% de mala o pésima frente a 34% de óptima o buena en la ${NEXUS}, una distancia de 8 puntos. El panel registra el saldo y no proyecta efecto electoral a partir de él.`,
  'cards.inss.conclusao':
    `El 20 de ago el caso ganó dos capas nuevas y de naturalezas distintas: la Procuraduría cuestionó parte de la conclusión de la Policía Federal, y el hijo del presidente fue a la Justicia contra el adversario por contenido generado con inteligencia artificial. Sigue sin desenlace judicial, y el panel no convierte ninguna de las dos en intención de voto.`,

  'cards.bancoMaster.text1':
    `⭐ EL HECHO NUEVO DEL 20 DE AGO ES DE DELACIÓN. Los investigadores aceptan reabrir la negociación con Daniel Vorcaro, pero exigen una delación completa y una indicación precisa de bienes en el exterior, según Folha de S.Paulo.`,
  'cards.bancoMaster.text2':
    `Ese mismo día su defensa pidió aplazar su declaración ante la Policía Federal, por la entrada de un nuevo abogado en el equipo, según O Globo. ⚠️ El caso también entró en la campaña por otra vía: el ministro André Mendonça, del TSE, ordenó retirar un video hecho con inteligencia artificial que asociaba a Flávio Bolsonaro con Vorcaro, y dejó registrado que la sátira no levanta la prohibición. Informado de forma independiente por O Globo y G1, ambos el 20 de ago.`,
  'cards.bancoMaster.text3':
    `⚠️ El panel separa las dos cosas a propósito. Negociar una delación es una etapa de investigación y no es una condena, y el caso sigue sin desenlace judicial. Retirar el video es una decisión electoral sobre propaganda, no un juicio sobre el fondo del caso bancario.`,
  'cards.bancoMaster.conclusao':
    `El 20 de ago el caso produjo movimiento en dos frentes: la negociación de delación se reabrió con exigencia de bienes en el exterior, y la Justicia Electoral ordenó retirar una pieza de campaña que usaba el nombre de Vorcaro contra el segundo. Sigue sin desenlace.`,

  'cards.stf.toffoli': `Sin acto individual nuevo captado el 20 de ago.`,
  'cards.stf.moraes':
    `⚠️ Aparece el 20 de ago en una crítica de método, no en un acto nuevo: una columna de Folha de ese día registra errores en serie de él y de Dino en un caso de un periodista de Maranhão.`,
  'cards.stf.gilmar': `Sin acto individual nuevo el 20 de ago.`,
  'cards.stf.dino': `Sin acto individual nuevo el 20 de ago. Aparece en la misma columna de Folha citada arriba, junto a Moraes.`,
  'cards.stf.mendonca':
    `⭐ EL MINISTRO MÁS PRESENTE DEL DÍA, Y EN LOS DOS PAPELES. Como ministro del Supremo, pretende usar precedentes de la corte para mantener bajo su competencia las investigaciones sobre Fábio Luís Lula da Silva (Folha, 20 de ago). Como ministro del TSE, ordenó retirar el video con inteligencia artificial que asociaba a Flávio Bolsonaro con Daniel Vorcaro (O Globo y G1, 20 de ago).`,
  'cards.stf.nexo':
    `⭐ EL HILO DEL 20 DE AGO ES UN SOLO NOMBRE EN DOS SILLAS. André Mendonça decide, el mismo día, sobre el caso que alcanza al hijo del líder de las encuestas y sobre la pieza de campaña que alcanza al segundo. 📌 El panel registra la coincidencia institucional y NO le atribuye intención: son competencias distintas, una en el Supremo y otra en el TSE, ejercidas por la misma persona. ⚠️ Y el contrato de impeachment no reaccionó a nada de eso.`,
  'cards.stf.analise':
    `Contrato de impeachment de ministro del Supremo, ${STAMP}: 3,35% (vol USD 84 mil), baja de 0,05pp frente al 3,40% del 19 de ago. 📌 El libro es pequeño, USD 84 mil acumulados, y una variación de ese orden no sostiene una lectura de tendencia.`,
})

// ─────────────────────────────────────────────── analysis-criteriosa
construir('analysis-criteriosa', 'es', {
  subtitle:
    `ACTUALIZACIÓN 20 de ago, a 45 días de la primera vuelta y en el QUINTO DÍA DE LA CAMPAÑA OFICIAL. LA DISTANCIA ENTRE LULA Y FLÁVIO BOLSONARO SE ACORTÓ POR CUARTO DÍA SEGUIDO y cerró en 30,65pp, frente a 37,05pp el 16 de ago, en un libro presidencial que acumula USD 129,90M. Y el patrón de los cuatro días se mantuvo: LULA quedó estancado en 63,50% por TERCER día, y quien se movió fue FLÁVIO BOLSONARO. ⭐ EL HECHO DEL DÍA VINO DE FUERA DEL PELOTÓN DE CABEZA: PABLO MARÇAL registró su candidatura por el PRTB y, el mismo día, el Ministerio Público pidió al TSE que la impida. Su precio cayó de 0,75% a 0,25%. NINGUNA encuesta nacional nueva: la última sigue siendo la ${NEXUS}. La Datafolha nacional se publica el 21 de ago y es la primera en medir a Pablo Marçal.`,

  'candidates[0].header': `PRECIO: 63,50% (vol USD 8,74M acumulado), ${STAMP}`,
  'candidates[0].fortes[0]':
    `La última encuesta nacional, la ${NEXUS}, lo coloca en 41% en la primera vuelta, un punto arriba frente a la ronda anterior de la misma casa, que lo tenía en 40%.`,
  'candidates[0].fortes[4]':
    `El techo de la serie es 67,50%, marcado el 16 de ago a las 21:00. La lectura del 20 de ago, 63,50%, es el valor más repetido de la serie: 20 de las 175 lecturas desde el 23 de mayo marcan exactamente ese número.`,
  'candidates[0].fracos[2]':
    `La evaluación del gobierno en la BTG/Nexus del 17 de ago tiene 42% de mala o pésima frente a 34% de óptima o buena, con 23% de regular.`,
  'candidates[0].fracos[3]':
    `⛔ Ningún superlativo de alza aplica: el techo de la serie es 67,50%, del 16 de ago, y la lectura del 20 de ago está 4,00pp por debajo.`,
  'candidates[0].analise':
    `PRECIO en 63,50% (vol USD 8,74M acumulado), ${STAMP}, SIN VARIACIÓN por TERCER día seguido. ⭐ LA DISTANCIA al segundo se acortó otros 0,30pp y quedó en 30,65pp, en el CUARTO día seguido de acercamiento, sumando 6,40pp desde el 16 de ago. 🔑 Y el acortamiento sigue sin venir de él: en tres días no perdió precio alguno, y todo el acercamiento es el adversario subiendo. 📌 Las urnas siguen mudas al respecto: ninguna encuesta nacional nueva desde el 17 de ago, cuando la BTG/Nexus midió la distancia entre los dos en 5 puntos.`,

  'candidates[1].header': `PRECIO: 32,85% (vol USD 8,68M acumulado), ${STAMP}`,
  'candidates[1].fortes[2]':
    `La BTG/Nexus del 17 de ago lo lleva de 35% a 36% en la primera vuelta, y en la segunda repite el 44% de la ronda anterior.`,
  'candidates[1].fracos[0]':
    `⛔ No es récord: en la serie unida de 175 lecturas desde el 23 de mayo, solo 2 marcan 32,85% o más, y las dos son 33,20%, del 2 de jun y del 18 de ago. La lectura del 20 de ago es la tercera más alta de la serie.`,
  'candidates[1].analise':
    `PRECIO en 32,85% (vol USD 8,68M acumulado), ${STAMP}, alza de 0,30pp y cuarto día seguido acortando la distancia con el líder. ⛔ SIN SUPERLATIVO: 32,85% NO es récord. En la serie unida de 175 lecturas desde el 23 de mayo, solo 2 marcan 32,85% o más, y las dos son 33,20%, del 2 de jun y del 18 de ago. Hoy es la tercera lectura más alta de la serie, no el techo. 📌 En el contrato de 2º lugar está en 87,50% (vol USD 308 mil). ⚠️ Y hay un movimiento a su derecha que no pasa por el precio: elogió públicamente a Pablo Marçal, llamándolo "un buen tipo, preparado y bienintencionado" (Estadão, 20 de ago), el día en que el Ministerio Público pidió al TSE que impidiera la candidatura del otro.`,

  'candidates[2].header': `PRECIO: 4,45% (vol USD 10,28M acumulado), ${STAMP}`,
  'candidates[2].fortes[2]':
    `La BTG/Nexus del 17 de ago lo mantiene en 4% en la primera vuelta, el mismo nivel de las nacionales recientes.`,
  'candidates[2].fracos[3]':
    `🔴 EN LA ENCUESTA ESTÁ DETRÁS DE CAIADO: la BTG/Nexus del 17 de ago da 5% a Caiado y 4% a él, mientras el mercado paga 55,50% por él y 34,50% por Caiado en el contrato de 3º lugar.`,
  'candidates[2].fracos[4]':
    `El techo de su serie es 17,90%, del 9 de jun, así que la lectura del 20 de ago, 4,45%, es un cuarto de aquel valor.`,
  'candidates[2].analise':
    `PRECIO en 4,45% (vol USD 10,28M acumulado), ${STAMP}, alza de 0,40pp, la mayor variación relativa del pelotón de cabeza hoy. ⭐ En el contrato de TERCER LUGAR está en 55,50% (vol USD 186 mil), frente a 34,50% de Ronaldo Caiado: el mercado lo coloca como probable tercero, aunque la intención declarada de la BTG/Nexus del 17 de ago lo pone en 4%, DETRÁS del 5% de Caiado. 🔑 Es la discrepancia más limpia del panel hoy: precio y urnas no coinciden en QUIÉN ES EL TERCERO. 📌 Dijo a Valor, el 21 de ago, que Lula y Flávio están "completamente quemados" por escándalos de corrupción. ⚠️ Y el PSOL fue al TSE contra él por repetir "campeonatos de cortes" (CartaCapital, 20 de ago).`,

  'candidates[3].header':
    `PRECIO para todo el pelotón, ${LECT}: Pablo Marçal 0,25% (vol USD 2,04M), Ronaldo Caiado 0,35% (vol USD 6,37M), Romeu Zema 0,15% (vol USD 5,75M), Fernando Haddad 0,05% (vol USD 7,28M). ⚠️ Los cuatro están POR DEBAJO de 0,5%, que es el piso que vigila la traba de captura, así que son lectura de libro y no precio confirmado por doble lectura.`,
  'candidates[3].subtitle':
    `20 de ago, quinto día de campaña: el movimiento del pelotón fue todo hacia ABAJO en el precio de victoria, y el nombre que más se movió fue el que acaba de entrar en la disputa.`,
  'candidates[3].caiado.label':
    `CAIADO (PSD), Poly presidencial 0,35% (vol USD 6,37M acumulado, ${LECT}), baja de 0,20pp | 3º lugar de la primera vuelta en 34,50% | ⚠️ por debajo del corte de 0,5% que vigila la doble lectura | urnas en vigor: BTG/Nexus del 17 de ago con 5% en la primera vuelta`,
  'candidates[3].haddad.label':
    `HADDAD (PT), Poly presidencial 0,05% (vol USD 7,28M acumulado), ${LECT}, por debajo del corte de 0,5%`,
  'candidates[3].zema.label':
    `ZEMA (Novo), Poly presidencial 0,15% (vol USD 5,75M acumulado, ${LECT}), sin variación y por debajo del corte de 0,5% | 3º lugar de la primera vuelta en 4,35%`,
  'candidates[3].fortes[1]':
    `En la BTG/Nexus del 17 de ago, Caiado tiene 5% en la primera vuelta, POR ENCIMA del 4% de Renan Santos, invirtiendo el orden que descuenta el mercado.`,
  'candidates[3].fortes[4]':
    `⭐ PABLO MARÇAL REGISTRÓ SU CANDIDATURA por el PRTB, aprovechando una brecha provocada por el TSE, según Folha, 20 de ago. El mismo día el Ministerio Público pidió al TSE que impida la candidatura y lo deje fuera de los debates (Folha, 19 de ago), y el TSE concedió una medida cautelar que prohíbe el uso de recursos oficiales en su campaña (TSE, 20 de ago). 📉 En el precio cayó de 0,75% a 0,25% (vol USD 2,04M acumulado). ⚠️ Está por debajo del corte de 0,5% y su serie tiene 6 lecturas, todas entre 0,60% y 1,10%, desde el 17 de ago. Sigue INELEGIBLE hasta 2032 y el registro depende de una decisión del TSE. La Datafolha del 21 de ago es la primera en medirlo.`,
  'candidates[3].fracos[0]':
    `🔻 Caiado volvió a caer en el contrato de victoria, de 0,55% a 0,35%, y ahora está POR DEBAJO del corte de 0,5% que vigila la doble lectura. En el contrato de 3º lugar está en 34,50%, detrás del 55,50% de Renan Santos.`,
  'candidates[3].analise':
    `⭐ EL PELOTÓN TUVO EL MOVIMIENTO MÁS RELEVANTE DEL DÍA, Y ES DE PABLO MARÇAL. Registró su candidatura a la Presidencia por el PRTB, aprovechando una brecha provocada por el TSE (Folha, 20 de ago), y el mismo día el Ministerio Público pidió al TSE que impida la candidatura y lo deje fuera de los debates (Folha, 19 de ago). El TSE también concedió una medida cautelar que prohíbe el uso de recursos oficiales en su campaña (TSE, 20 de ago). 📉 El precio acompañó: de 0,75% el 19 de ago a 0,25% en la lectura de hoy. ⚠️ ADVERTENCIA DE MÉTODO: 0,25% está por debajo del piso de 0,5% que vigila la traba de captura, así que es lectura de libro y no precio confirmado. Su serie tiene apenas 6 lecturas, todas entre 0,60% y 1,10%, y empieza el 17 de ago. 📌 RONALDO CAIADO cedió de 0,55% a 0,35%, y en el contrato de 3º lugar está en 34,50%, detrás del 55,50% de Renan Santos. ROMEU ZEMA repitió 0,15% y FERNANDO HADDAD repitió 0,05%.`,

  'quadroComparativo[0].p': `SIN ENCUESTA NACIONAL NUEVA. La más reciente sigue siendo la ${NEXUS}, margen de 2pp, que lo mide en 41% en la primera vuelta.`,
  'quadroComparativo[0].m': `63,50% (vol USD 8,74M), ${STAMP}. Sin variación por tercer día.`,
  'quadroComparativo[1].p': `SIN ENCUESTA NACIONAL NUEVA. La BTG/Nexus del 17 de ago lo mide en 36% en la primera vuelta y en 44% en la segunda.`,
  'quadroComparativo[1].m': `32,85% (vol USD 8,68M), ${STAMP}. Alza de 0,30pp, cuarto día acortando.`,
  'quadroComparativo[2].p': `SIN ENCUESTA NACIONAL NUEVA. La BTG/Nexus del 17 de ago lo mantiene en 4% en la primera vuelta, DETRÁS del 5% de Caiado.`,
  'quadroComparativo[2].m': `4,45% (vol USD 10,28M), ${STAMP}. Alza de 0,40pp. En el 3º lugar, 55,50%.`,
  'quadroComparativo[3].p': `SIN ENCUESTA NACIONAL NUEVA. La BTG/Nexus del 17 de ago le da 5% en la primera vuelta, POR ENCIMA del 4% de Renan Santos.`,
  'quadroComparativo[3].m': `0,35% (vol USD 6,37M), ${LECT}. Por debajo del piso de 0,5% de la traba. En el 3º lugar, 34,50%.`,
  'quadroComparativo[4].n': `Pablo Marçal (PRTB)`,
  'quadroComparativo[4].p': `SIN ENCUESTA NACIONAL que lo incluya. La Datafolha del 21 de ago es la primera en medirlo.`,
  'quadroComparativo[4].m': `0,25% (vol USD 2,04M), ${LECT}. Por debajo del piso de 0,5% de la traba. Serie de 6 lecturas, desde el 17 de ago.`,
  'quadroComparativo[5].m': `3,35% (vol USD 84 mil), ${STAMP}.`,

  // ⚠️ `t` (tendencia) e `s` (contexto) fazem parte do schema e eu os havia
  // derrubado ao reescrever o bloco. O pre-commit bloqueou.
  'quadroComparativo[0].t': `➖ SIN VARIACIÓN por TERCER día seguido, en 63,50%. La distancia al segundo se acortó otros 0,30pp y quedó en 30,65pp, en el CUARTO día seguido de acercamiento, sumando 6,40pp desde el 16 de ago. El techo de la serie es 67,50%, del 16 de ago.`,
  'quadroComparativo[0].s': `Quinto día de campaña oficial, a 45 días de la primera vuelta. El caso de su hijo ganó dos capas el 20 de ago: la Procuraduría cuestionó parte de la conclusión de la Policía Federal, según Estadão, y él demandó al adversario por un video hecho con inteligencia artificial, según O Globo.`,
  'quadroComparativo[1].t': `🔺 ALZA de 0,30pp, de 32,55% a 32,85%, cuarto día seguido acortando la distancia. ⛔ No es récord: en la serie unida de 175 lecturas desde el 23 de mayo, solo 2 marcan 32,85% o más, y las dos son 33,20%, del 2 de jun y del 18 de ago.`,
  'quadroComparativo[1].s': `Elogió a Pablo Marçal como "un buen tipo, preparado y bienintencionado", según Estadão del 20 de ago, el mismo día en que el Ministerio Público pidió al TSE que impidiera la candidatura del otro. Y dijo que mira al Supremo "con asco", hablando de ser un presidente de transición, según Folha.`,
  'quadroComparativo[2].t': `🔺 ALZA de 0,40pp, de 4,05% a 4,45%, la mayor variación de esta lectura entre los tres nombres por encima de 1%. El techo de su serie es 17,90%, del 9 de jun.`,
  'quadroComparativo[2].s': `📌 La discrepancia con las urnas continúa y nadie la resolvió: el mercado paga 55,50% por él en el contrato de 3º lugar frente a 34,50% por Caiado, mientras la BTG/Nexus del 17 de ago da 5% a Caiado y 4% a él. Dijo a Valor, el 21 de ago, que Lula y Flávio están "completamente quemados".`,
  'quadroComparativo[3].t': `🔻 BAJA de 0,20pp, de 0,55% a 0,35%, y ahora POR DEBAJO del corte de 0,5% que vigila la doble lectura. En esa franja la variación es ruido de libro delgado y no sostiene una lectura de tendencia.`,
  'quadroComparativo[3].s': `En la intención declarada sigue por delante de Renan Santos, 5% frente a 4%, y en el precio está muy detrás: 0,35% frente a 4,45%. Es la inversión que el panel registra desde la primera medición de esta semana.`,
  'quadroComparativo[4].t': `🔻 BAJA de 0,50pp, de 0,75% a 0,25%, por debajo del corte de 0,5%. ⚠️ Su serie tiene apenas 6 lecturas, todas entre 0,60% y 1,10%, y empieza el 17 de ago. Es un movimiento a seguir, no una medición firme.`,
  'quadroComparativo[4].s': `Registró su candidatura por el PRTB, aprovechando una brecha provocada por el TSE, según Folha del 20 de ago. El mismo día el Ministerio Público pidió al TSE que impida la candidatura y lo deje fuera de los debates, y el TSE concedió una medida cautelar que prohíbe el uso de recursos oficiales. Sigue inelegible hasta 2032.`,
  'quadroComparativo[5].t': `🔻 BAJA de 0,05pp, de 3,40% a 3,35%. 📌 El libro acumula USD 84 mil, y una variación de ese orden no sostiene una lectura de tendencia.`,
  'quadroComparativo[5].s': `Contrato de impeachment de ministro del Supremo antes de 2027, mantenido en el panel como termómetro institucional. El 20 de ago el ministro André Mendonça decidió en los dos lados de la disputa, en el Supremo y en el TSE, y el contrato no se movió por eso.`,

  cruzamento:
    `⭐ EL PATRÓN DE CUATRO DÍAS SE MANTUVO, Y UN NOMBRE NUEVO ENTRÓ EN LA CUENTA. En la ${STAMP}, LULA repitió 63,50% (vol USD 8,74M), sin variación por TERCER día seguido, y FLÁVIO BOLSONARO subió 0,30pp a 32,85% (vol USD 8,68M). La distancia entre los dos se acortó a 30,65pp, en el CUARTO día seguido de acercamiento: eran 37,05pp el 16 de ago, 33,05pp el 17, 31,45pp el 18 y 30,95pp el 19, es decir 6,40pp en cuatro días. 🔑 QUIEN ESTÁ ACORTANDO LA DISTANCIA SIGUE SIN SER QUIEN ESTÁ CAYENDO. El líder no perdió precio alguno en tres días. ⛔ SIN SUPERLATIVO: 32,85% NO es récord. En la serie unida de 175 lecturas desde el 23 de mayo, solo 2 marcan 32,85% o más, y las dos son 33,20%, del 2 de jun y del 18 de ago. ⭐ EL HECHO NUEVO ES PABLO MARÇAL. Registró su candidatura por el PRTB aprovechando una brecha provocada por el TSE (Folha, 20 de ago); el Ministerio Público pidió al TSE que impida la candidatura y lo deje fuera de los debates (Folha, 19 de ago); el TSE concedió una medida cautelar que prohíbe el uso de recursos oficiales en la campaña (TSE, 20 de ago); y FLÁVIO BOLSONARO lo elogió públicamente, "un buen tipo, preparado y bienintencionado" (Estadão, 20 de ago). Su precio cayó de 0,75% a 0,25%. ⚠️ ADVERTENCIA: 0,25% está por debajo del piso de 0,5% que vigila la traba, y su serie tiene 6 lecturas. Es un movimiento a seguir, no una medición firme. 📌 LA DISCREPANCIA MÁS LIMPIA DEL PANEL SIGUE SIENDO SOBRE EL TERCER LUGAR: el mercado paga 55,50% por Renan Santos y 34,50% por Caiado, mientras la última encuesta nacional, la BTG/Nexus del 17 de ago, pone a Caiado en 5% y a Renan en 4%. Precio y urnas no coinciden en quién es el tercero. 📊 Las encuestas del día son ESTATALES y no entran en el panel nacional: la AtlasIntel en Pará (Lula 48,9% x Flávio 37,4% en la primera vuelta) y la Ipsos-Ipec en Ceará (Ciro Gomes 43% x Elmano 35% para el gobierno). ⏭️ LA DATAFOLHA NACIONAL SE PUBLICA EL 21 DE AGO y es la primera hecha tras el registro de las candidaturas, y la primera en incluir a Pablo Marçal.`,
})

// ─────────────────────────────────────────────── polls-data
construir('polls-data', 'es', {
  'polymarketComparison.note':
    `Lectura confirmada del 20 de ago, 23:19 BRT, aprobada por dos lecturas independientes separadas por ocho minutos. La distancia entre Lula y Flávio Bolsonaro se acortó por CUARTO día seguido y cerró en 30,65pp, frente a 37,05pp el 16 de ago. El líder repitió 63,50% por tercer día, y todo el acercamiento vino del segundo subiendo. ⛔ Sin superlativo: 32,85% no es récord, y en la serie unida de 175 lecturas desde el 23 de mayo solo 2 marcan ese valor o más, las dos en 33,20%, del 2 de jun y del 18 de ago. ⚠️ Ronaldo Caiado, Pablo Marçal, Romeu Zema, Tarcísio y Fernando Haddad están por debajo de 0,5%, el piso vigilado por la doble lectura, así que son lectura de libro y no precio confirmado.`,
  // ⚠️ Em ES o valor é IGUAL ao pt-BR, porque as duas convenções usam vírgula
  // decimal. Ainda assim o campo precisa entrar no mapa: o construtor recusa
  // campo que MUDOU no pt-BR e não foi declarado, e faz isso de propósito, para
  // ninguém publicar meio arquivo traduzido. Foi o que aconteceu na 1ª tentativa.
  'polymarketComparison.candidates[1].polymarket': `32,85%`,
  'polymarketComparison.candidates[2].polymarket': `4,45%`,
  'polymarketComparison.candidates[3].polymarket': `0,35%`,
  'polymarketComparison.candidates[4].polymarket': `0,25%`,
  'polymarketComparison.candidates[0].tendenciaPolymarket':
    `➖ SIN VARIACIÓN por TERCER día seguido, en 63,50% (vol USD 8,74M acumulado), lectura confirmada del 20 de ago, 23:19 BRT. La distancia al segundo se acortó otros 0,30pp y quedó en 30,65pp, en el CUARTO día seguido de acercamiento, sumando 6,40pp desde el 16 de ago. 🔑 El acortamiento sigue sin venir de él: en tres días no perdió precio alguno. El techo de la serie es 67,50%, del 16 de ago, y 63,50% es su valor más repetido, en 20 de las 175 lecturas desde el 23 de mayo.`,
  'polymarketComparison.candidates[1].tendenciaPolymarket':
    `🔺 ALZA de 0,30pp, de 32,55% a 32,85% (vol USD 8,68M acumulado), lectura confirmada del 20 de ago, 23:19 BRT, en su cuarto día seguido acortando la distancia con el líder. ⛔ No es récord: en la serie unida de 175 lecturas desde el 23 de mayo, solo 2 marcan 32,85% o más, y las dos son 33,20%, del 2 de jun y del 18 de ago. En el contrato de 2º lugar está en 87,50%.`,
  'polymarketComparison.candidates[2].tendenciaPolymarket':
    `🔺 ALZA de 0,40pp, de 4,05% a 4,45% (vol USD 10,28M acumulado), lectura confirmada del 20 de ago, 23:19 BRT, la mayor variación de esta lectura entre los tres nombres por encima de 1%, frente a 0,30pp de Flávio Bolsonaro y 0,00pp de Lula. ⭐ En el contrato de TERCER LUGAR está en 55,50%, frente a 34,50% de Ronaldo Caiado, mientras la última encuesta nacional, del 17 de ago, da 5% a Caiado y 4% a él: precio y urnas no coinciden en quién es el tercero. El techo de su serie es 17,90%, del 9 de jun.`,
  'polymarketComparison.candidates[3].tendenciaPolymarket':
    `🔻 BAJA de 0,20pp, de 0,55% a 0,35% (vol USD 6,37M acumulado), lectura del 20 de ago, 23:19 BRT. ⚠️ Está por debajo de 0,5%, el piso vigilado por la doble lectura, así que es lectura de libro y no precio confirmado. En el contrato de 3º lugar está en 34,50%.`,
  'polymarketComparison.candidates[4].tendenciaPolymarket':
    `🔻 BAJA de 0,50pp, de 0,75% a 0,25% (vol USD 2,04M acumulado), lectura del 20 de ago, 23:19 BRT, el día en que registró su candidatura por el PRTB y el Ministerio Público pidió al TSE que la impida. ⚠️ Está por debajo del piso de 0,5% de la doble lectura, y su serie tiene apenas 6 lecturas, todas entre 0,60% y 1,10%, desde el 17 de ago. Es un movimiento a seguir, no una medición firme.`,
  'polymarketComparison.candidates[5].tendenciaPolymarket':
    `➖ SIN VARIACIÓN, en 0,05% (vol USD 13,93M acumulado), lectura del 20 de ago, 23:19 BRT. ⚠️ Por debajo del piso de 0,5% de la doble lectura. Lidera el volumen acumulado del libro presidencial en esta lectura, con USD 13,93M frente a USD 10,44M del segundo, Eduardo Bolsonaro, y está entre los precios más bajos.`,
  'polymarketComparison.candidates[6].tendenciaPolymarket':
    `➖ SIN VARIACIÓN, en 0,15% (vol USD 5,75M acumulado), lectura del 20 de ago, 23:19 BRT. ⚠️ Por debajo del piso de 0,5% de la doble lectura. En el contrato de 3º lugar está en 4,35%.`,
  'polymarketComparison.candidates[7].tendenciaPolymarket':
    `➖ SIN VARIACIÓN, en 0,05% (vol USD 7,28M acumulado), lectura del 20 de ago, 23:19 BRT. ⚠️ Por debajo del piso de 0,5% de la doble lectura.`,
})
