/**
 * Mapa ES de polls-data.json — /atualizar-brz 04/Ago/2026.
 * Convenções ES: vírgula decimal e ponto de milhar. `pesquisa` é `encuesta`,
 * `parado` (sem movimento) é `quieto`, `precificar` é `descontar`.
 */
import { readFileSync } from 'fs'
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/es/glossary#${id})`
const NEXUS = G('BTG/Nexus', 'nexus-btg')
const ATLAS = G('AtlasIntel', 'atlasintel')
const TSE = G('TSE', 'tse')

const anterior = JSON.parse(readFileSync('public/polls-data.es.json', 'utf-8'))
const PREFIXO = '[precio del 03/Ago] '
const prefixados: Record<string, string> = {}
anterior.polymarketComparison.candidates.forEach((c: any, i: number) => {
  if (typeof c.tendenciaPolymarket === 'string' && c.tendenciaPolymarket.length) {
    const limpo = c.tendenciaPolymarket.replace(/^\[precio del 03\/Ago\] /, '')
    prefixados[`polymarketComparison.candidates[${i}].tendenciaPolymarket`] = PREFIXO + limpo
  }
})

construir('polls-data', 'es', {
  ...prefixados,

  'polls[0].note':
    `Encuesta nacional ${NEXUS} divulgada el 03/Ago, 8ª ronda de la serie, y la primera de las cuatro nacionales que el registro del ${TSE} preveía entre el 03 y el 05/Ago. 1ª vuelta Lula 41% x Flávio 37%, con Caiado en 5%, Renan Santos en 4% y Zema en 3%. 2ª vuelta Lula 46% x Flávio 45%, diferencia de 1pp que queda DENTRO del margen de 2pp y por eso es ${G('empate técnico', 'empate-tecnico')}. Trabajo de campo del 31/Jul al 02/Ago, n=2.002, telefónica, margen 2pp, 95% de confianza, registro BR-02874/2026. LO QUE CAMBIA LA SEMANA ES LA COMPARACIÓN CON LA PROPIA CASA: la diferencia de la 1ª vuelta CAYÓ DE 9pp A 4pp en una sola ronda, contra el 42% x 33% del 27/Jul. Y el movimiento viene casi todo de un lado, porque LULA CEDIÓ 1pp y FLÁVIO SUBIÓ 4pp. En la 2ª vuelta el ajuste es aún más fuerte, de 4pp a 1pp, con Lula pasando de 47% a 46% y Flávio de 43% a 45%. Las otras 2ª vueltas de la ronda: Lula 46% x Caiado 42%, Lula 46% x Zema 40% y Lula 47% x Renan Santos 37%. FRENTE A LAS OTRAS CASAS, entre las cuatro nacionales divulgadas desde el 29/Jul esta es la que muestra la 1ª vuelta más ajustada: 4pp aquí, contra 6pp en PoderData del 30/Jul, 9,1pp en ${ATLAS} del 29/Jul y 9,3pp en Vox Brasil del 31/Jul. La distancia entre la lectura más alta y la más baja llega a 5,3pp y es mayor que cualquier movimiento de precio del período. ⚠️ RECHAZO NO PUBLICADO POR ESTE PANEL: las fuentes secundarias DISCREPAN. Poder360, CNN Brasil y Correio Braziliense reportan 49% para cada uno de los dos; Money Times reporta 50% para Lula y 51% para Flávio. La nota de divulgación del instituto no trae el dato, así que no se pudo cerrar en fuente primaria y el número queda fuera, con la discrepancia declarada aquí. ⚠️ CORRECCIÓN PUBLICADA EL 04/Ago: esta ficha decía que la ronda no había traído aprobación, y sí la trajo. El dato salió en la cobertura del 04/Ago, de la MISMA ronda BR-02874/2026: aprobación del gobierno en 47% contra 48% de desaprobación, y evaluación de la gestión en 37% de excelente o buena, 18% de regular y 43% de mala o pésima. El panel corrige en vez de reescribir en silencio.`,

  'approvalData.note':
    `APROBACIÓN NUEVA, y el hallazgo es la INMOVILIDAD. ${NEXUS} del 03/Ago da 47% de aprobación del gobierno contra 48% de desaprobación. Dentro de la propia casa, la aprobación está QUIETA en 47% desde hace tres rondas seguidas: 47% x 47% el 13/Jul, 47% x 49% el 27/Jul y 47% x 48% ahora. Quien se movió fue la desaprobación, y se movió 2pp hacia arriba y 1pp hacia abajo, dentro del margen de 2pp en ambos casos. Es decir, la serie de la casa describe un electorado dividido y estable, no una tendencia. EVALUACIÓN DE LA GESTIÓN, que es una pregunta distinta de la aprobación y no se mezcla: 37% de excelente o buena, 18% de regular y 43% de mala o pésima, con 2% sin opinión. Contra la ronda del 27/Jul de la misma casa, eran 36% y 43%, así que también prácticamente quieto. ⚠️ EL PANEL CAMBIÓ DE FUENTE EN ESTE CAMPO: hasta el 03/Ago traía la lectura del 29/Jul, y la comparación directa entre casas distintas no es válida, porque cambian método y recorte. La comparación que vale es la de Nexus con Nexus, hecha arriba. PoderData/Aya del 30/Jul, que es la otra lectura reciente, dio 43% x 49% de aprobación personal y 34% x 47% de gestión, un cuadro bastante más duro. Las dos casas siguen apuntando a lados distintos y el panel registra ambas sin arbitrar. SIN LECTURA NUEVA DESPUÉS DE ESTA: el barrido del ${TSE} del 04/Ago leyó 537 registros y no insertó ninguno. ${G('Quaest', 'quaest')} (n=2.004) e Ideia/Canal Meio (n=1.500) tienen publicación declarada para el 05/Ago.`,
  'approvalData.source':
    `BTG/Nexus 03/Ago/2026 (campo del 31/Jul al 02/Ago, n=2.002, telefónica, margen 2pp, 95% de confianza, BR-02874/2026). Números de aprobación divulgados en la cobertura del 04/Ago, vía Poder360, CNN Brasil, Metrópoles, Correio Braziliense, Terra y Brasil 247.`,

  'polymarketComparison.note':
    `⚠️ LOS PRECIOS DE ESTA SECCIÓN SON DEL 03/Ago, DE LA CAPTURA TRABADA DE LAS 19:11 UTC, Y NO DE HOY. La ronda del 04/Ago no publica precio nuevo porque la traba de captura bloqueó cuatro veces seguidas: el libro de Caiado osciló entre 1,65% y 2,30% en lecturas separadas por ocho minutos, y el panel no publica un precio que dos lecturas independientes no confirmen. El lado de la ENCUESTA, ese sí, es de hoy. --- LO QUE DICEN LOS PRECIOS DEL 03/Ago: Lula en 65,50% (vol USD 7,92M) y Flávio en 25,45% (vol USD 7,86M), con diferencia de +40,05pp. Aquel día las dos mediciones se movieron hacia el mismo lado y por el mismo motivo, con el líder quieto y el rival subiendo, algo raro en este panel. Conviene repetir lo que aquello NO era: convergencia de nivel. El mercado paga probabilidad de victoria y la encuesta mide porción de voto, y las dos no se restan. --- POR QUÉ EL LIBRO ESTÁ EN TRÁNSITO HOY, y esto es registro y no explicación: el 04/Ago fue el día en que Zema anunció a su compañero de fórmula, el senador Eduardo Girão, del partido ${G('Novo', 'novo')}, y en que Flávio recibió DOS rechazos de alianza, de Republicanos y de Podemos, quedando sin vice a once días del plazo que él mismo declaró. La tercera vía es justamente donde la traba viene bloqueando. El panel no atribuye causa: registra que el reprecio está ocurriendo y que por eso no publica número. --- LA ENCUESTA, ESA SÍ ES DE HOY: ${NEXUS} del 03/Ago (BR-02874/2026) publicó aprobación del gobierno en 47% contra 48%, un número que no estaba en la divulgación de ayer y salió en la cobertura de hoy. La aprobación está quieta en 47% desde hace tres rondas de la misma casa.`,
  'polymarketComparison.sources':
    `Precios de ${G('Polymarket', 'polymarket')} vía el proxy de AFOS, captura trabada de las 19:11 UTC del 03/Ago (scripts/capture-guard.ts). El 04/Ago la traba bloqueó cuatro rondas y no se publicó ningún precio nuevo. Encuesta BTG/Nexus del 03/Ago, registro TSE BR-02874/2026, con los números de aprobación divulgados en la cobertura del 04/Ago. Barrido del TSE del 04/Ago: 537 registros, ninguno nuevo.`,

  'polymarketComparison.candidates[0].tendenciaPesquisa':
    `ENCUESTA DEL 03/Ago, CON LA APROBACIÓN DIVULGADA EL 04/Ago. ${NEXUS} (n=2.002, campo del 31/Jul al 02/Ago, telefónica, margen 2pp, BR-02874/2026) da 41% en 1ª vuelta, contra 42% en la propia ronda del 27/Jul, y 46% en la 2ª vuelta contra Flávio, contra 47% antes. Las dos caídas son de 1pp y quedan dentro del margen. Lo que sí es movimiento es el otro lado: Flávio subió 4pp en 1ª vuelta y 2pp en la 2ª, y por eso la diferencia cayó de 9pp a 4pp y la 2ª vuelta se volvió empate técnico. APROBACIÓN DEL GOBIERNO en 47% contra 48% de desaprobación, y aquí el hallazgo es la inmovilidad: la aprobación está quieta en 47% en las tres últimas rondas de la casa, con la desaprobación yendo de 47% a 49% y volviendo a 48%, siempre dentro del margen. Entre las cuatro nacionales desde el 29/Jul, esta es la que muestra la 1ª vuelta más ajustada: 4pp aquí, 6pp en PoderData, 9,1pp en ${ATLAS} y 9,3pp en Vox Brasil.`,
  'polymarketComparison.candidates[1].tendenciaPesquisa':
    `${NEXUS} del 03/Ago da 37% en 1ª vuelta, contra 33% en la ronda del 27/Jul de la misma casa, subida de 4pp que es el DOBLE del margen de 2pp y por lo tanto no se explica por ruido muestral. En la 2ª vuelta pasa de 43% a 45% y queda a 1pp de Lula, dentro del margen, lo que caracteriza empate técnico. La lectura necesita contexto de casa: las otras tres nacionales desde el 29/Jul dan diferencias de 6pp a 9,3pp en 1ª vuelta, así que esta es la más favorable a él, y la distancia entre la lectura más alta y la más baja llega a 5,3pp. El 04/Ago recibió DOS rechazos de alianza, de Republicanos y de Podemos, y sigue sin vice.`,
})
