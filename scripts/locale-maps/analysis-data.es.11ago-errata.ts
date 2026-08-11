/**
 * Mapa ES da ERRATA de serie de 11/Ago para analysis-data.json.
 * Restaura o topo do Flavio (34,40% em 13/Mai) e o piso do Renan (6,80% em 06/Ago),
 * que a rodada de fechamento havia trocado por valores de fecho-do-dia.
 */
import { construir } from '../build-locale-json'

construir('analysis-data', 'es', {
  'cards.sentimento.terceiraVia':
    "EL TERCERO FUE LO ÚNICO QUE SE MOVIÓ EN TODO EL DÍA, Y VOLVIÓ: subió hasta 8,40% en la lectura de las 16:27 y cerró en 7,75%, terminando 0,10pp por encima del 10/Ago. Las dos lecturas fueron confirmadas, cada una por dos capturas, así que no es que una esté equivocada, es que el día siguió. En la serie de 90 días, 78 tuvieron un valor igual o superior a 7,75%, con un techo de 17,90% el 9/Jun y un piso de 6,80% el 6/Ago. En la encuesta Gerp le da 5%, el segundo mayor valor de la ventana, por detrás solo del 10% que Palver midió por internet, y el efecto de método sigue siendo la lectura sobre él. Caiado, Zema y Haddad cedieron 0,10pp cada uno, cerrando en 1,05%, 0,35% y 0,05%.",
})
