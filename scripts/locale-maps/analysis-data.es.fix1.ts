/**
 * Correção 1 do mapa ES de analysis-data.json — 28/Jul/2026.
 * Mesmo motivo do .en.fix1: atribuição da fala do diretor da Quaest corrigida
 * para o Expert XP de 24/Jul, número "perto de 60%" e sem subtração de 3,50pp.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/es/glossary#${id})`

construir('analysis-data', 'es', {
  'cards.sentimento.text2':
    `El cruce más directo de la semana no vino de una encuesta, vino de una frase, y no es de hoy. Felipe Nunes, director de ${G('Quaest', 'quaest')}, afirmó en el Expert XP del 24/Jul que la probabilidad de reelección de Lula pasó de cerca de 38% a cerca de 60%, en un modelo que asocia la aprobación del gobierno a la probabilidad de reelección, con el giro empezando en mayo (InfoMoney, 25/Jul). ${G('Polymarket', 'polymarket')} marca 63,50%. Es la primera vez en este panel en que las dos fuentes estiman la MISMA magnitud, probabilidad de victoria, y no magnitudes distintas: normalmente el panel compara probabilidad implícita con intención de voto, que no son lo mismo. El panel muestra los dos números lado a lado y NO resta uno del otro, porque cerca de 60% no es un valor exacto. Registrarlo no es decir que una valida a la otra: son dos modelos con premisas diferentes que quedaron cerca, y quedar cerca no es prueba de acierto.`,
  'cards.inss.text2':
    `El mercado se movió en la cima después de dos jornadas estancadas: Lula subió 1,00pp y volvió a 63,50%, igualando el techo de la serie del AFOS marcado el 26/Jul. Importa lo que NO explica ese movimiento: no salió encuesta nacional nueva este martes. Las tres encuestas del día son estatales y no miden el país. Cuando el precio se mueve sin encuesta nueva que lo ancle, la lectura correcta es que el mercado reaccionó a otra cosa, y el panel no puede decir a cuál, porque la misma jornada tuvo la prórroga de la emergencia estadounidense, las consultas en la OMC, tres encuestas estatales y la repercusión de una declaración anterior del director de ${G('Quaest', 'quaest')} sobre probabilidad de reelección, hecha el 24/Jul. Registrar la ausencia de ancla es más honesto que elegir una causa.`,
  'cards.inss.impactoLula':
    `Sin lectura nacional nueva de aprobación este martes. La más reciente sigue siendo la ${G('BTG/Nexus', 'nexus-btg')} del 27/Jul: aprobación personal 47% contra 49% de desaprobación, con 4% que no respondieron, frente a 47% x 47% el 13/Jul. El contraste con la ${G('Datafolha', 'datafolha')} del 24/Jul sigue en pie, porque allí era lo inverso, 49% x 48%. Dos encuestas con margen de 2pp y dos ${G('empates técnicos', 'empate-tecnico')} con los extremos en orden invertido describen una franja estrecha en torno al 48%, no un vuelco. El dato adicional sobre este tema es indirecto, viene del propio sector y es de la semana pasada, no de hoy: Felipe Nunes, director de ${G('Quaest', 'quaest')}, afirmó en el Expert XP del 24/Jul que, en el modelo que asocia la aprobación del gobierno a la probabilidad de reelección, la probabilidad de Lula pasó de cerca de 38% a cerca de 60%, con el giro empezando en mayo (InfoMoney, 25/Jul). Las anteriores: PoderData 22/Jul con 46% x 47%, Indexa 21/Jul con 49% x 48%, Real Time 21/Jul con 46% x 50%, Genial/Quaest 15/Jul con 48% x 47% y PoderData/Aya 16/Jul con 42% x 51%.`,
})
