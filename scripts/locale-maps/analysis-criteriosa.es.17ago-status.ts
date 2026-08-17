/**
 * Mapa ES, complemento de 17/Ago: estado eleitoral declarado por linha.
 */
import { construir } from '../build-locale-json'

const CAR = 'lectura confirmada del 17 de ago, 18:48 BRT (21:48 UTC)'

construir('analysis-criteriosa', 'es', {
  'candidates[3].header':
    `PRECIO para todo el pelotón, ${CAR}: Caiado 0,25% (vol USD 6,07M), Zema 0,25% (vol USD 5,62M). ⭐ Pablo Marçal aparece en 0,90% (vol USD 1,21M) y es candidato registrado con campaña habilitada por una medida cautelar, aunque INELEGIBLE hasta 2032 y con el registro todavía pendiente ante la justicia electoral.`,
  'candidates[3].fortes[4]':
    `Pablo Marçal está descontado en 0,90%, con USD 1,21M acumulados, y será incluido en el relevamiento de Datafolha previsto para el 21 de ago, según Valor Econômico. 🏷️ Pidió el registro y está entre los 13 que lo hicieron, y una medida cautelar habilitó la campaña, pero está INELEGIBLE hasta 2032 y el registro sigue pendiente de una decisión de la justicia electoral, según BBC, G1 y Folha de S.Paulo.`,
  'candidates[3].analise':
    `El pelotón produjo el movimiento más interesante del día en POSICIÓN, y no en victoria. Caiado cayó en el contrato de ganar, de 0,60% a 0,25%, y subió en el de terminar tercero, de 37,50% a 38,50%. 📌 Son preguntas distintas y el panel no las suma: un contrato pregunta si gana la elección, el otro pregunta en qué posición termina la primera vuelta. ⭐ Y la encuesta de hoy refuerza ese lado: la BTG/Nexus le da 5% a Caiado contra 4% de Renan Santos, o sea que en la intención declarada él ya es el tercer nombre, mientras que en el book de tercer lugar todavía aparece 14,00pp atrás. ⚠️ Todos esos contratos de victoria del pelotón están por debajo de 1%, franja en la que el panel declara ruido y evita lecturas finas. 🏷️ Y DESDE HOY EL PANEL DECLARA EL ESTADO ELECTORAL DE CADA FILA. Pablo Marçal entra en la tabla de comparación porque es candidato registrado habilitado a hacer campaña por una medida cautelar, y el mercado ya le atribuye 0,90% y USD 1,21M sin que UNA SOLA encuesta lo haya medido. ⭐ Ese es el cruce más nítido que el panel tiene hoy, y queda fuera del grafo hasta la Datafolha del 21 de ago, porque la ausencia de medición no es una medición igual a cero. Tarcísio de Freitas y Fernando Haddad PERMANECEN en la tabla aunque disputan la gobernación de São Paulo, porque sus contratos siguen abiertos: el del primero carga USD 13,93M, el volumen acumulado más alto entre los 18 contratos con precio del book presidencial, por encima del propio líder. ⛔ El panel no borra una fila para quedar prolijo.`,
})
