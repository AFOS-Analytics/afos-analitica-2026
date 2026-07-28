/**
 * Correção 1 do mapa EN de analysis-data.json — 28/Jul/2026.
 *
 * Motivo: o gate de fact-check do /afos-daily encontrou erro de atribuição no
 * mapa original (commit 4e3e925). A fala do diretor da Quaest é do Expert XP de
 * 24/Jul (InfoMoney, 25/Jul), não do almoço do Lide de 27/Jul, e o número é
 * "perto de 60%", não 60% exatos, o que invalida a subtração de 3,50pp.
 * Só os 3 campos afetados entram aqui; o resto vem da memória.
 */
import { construir } from '../build-locale-json'

const G = (termo: string, id: string) => `[${termo}](/en/glossary#${id})`

construir('analysis-data', 'en', {
  'cards.sentimento.text2':
    `The week's most direct cross-reading did not come from a poll, it came from a sentence, and it is not from today. Felipe Nunes, director of ${G('Quaest', 'quaest')}, said at Expert XP on Jul 24 that Lula's probability of re-election went from around 38% to close to 60%, in a model that ties government approval to re-election probability, with the turn starting in May (InfoMoney, Jul 25). ${G('Polymarket', 'polymarket')} is at 63.50%. It is the first time in this panel that the two sources estimate the SAME quantity, probability of victory, rather than different quantities: normally the panel compares implied probability with voting intention, which are not the same thing. The panel shows the two numbers side by side and does NOT subtract one from the other, because close to 60% is not an exact value. Recording that is not saying one validates the other: they are two models with different assumptions that landed close, and landing close is not proof of being right.`,
  'cards.inss.text2':
    `The market moved at the top after two flat sessions: Lula rose 1.00pp and returned to 63.50%, matching the ceiling of the AFOS series marked on Jul 26. What does NOT explain that move matters: no fresh national poll came out on Tuesday. The day's three polls are state-level and do not measure the country. When the price moves with no fresh polling to anchor it, the correct reading is that the market reacted to something else, and the panel cannot say to which, because the same session carried the extension of the US emergency, the WTO filing, three state polls and the echo of an earlier remark by the ${G('Quaest', 'quaest')} director on re-election probability, made on Jul 24. Recording the absence of an anchor is more honest than picking a cause.`,
  'cards.inss.impactoLula':
    `No fresh national approval reading on Tuesday. The most recent is still ${G('BTG/Nexus', 'nexus-btg')} of Jul 27: personal approval 47% against 49% disapproval, with 4% who did not answer, against 47% x 47% on Jul 13. The contrast with ${G('Datafolha', 'datafolha')} of Jul 24 still stands, because there it was the reverse, 49% x 48%. Two surveys with a 2pp margin and two ${G('statistical ties', 'empate-tecnico')} with the ends swapped describe a narrow band around 48%, not a swing. The additional data point on this theme is indirect, comes from the sector itself and is from last week, not from today: Felipe Nunes, director of ${G('Quaest', 'quaest')}, said at Expert XP on Jul 24 that, in the model tying government approval to re-election probability, Lula's chance went from around 38% to close to 60%, with the turn starting in May (InfoMoney, Jul 25). The earlier readings: PoderData Jul 22 at 46% x 47%, Indexa Jul 21 at 49% x 48%, Real Time Jul 21 at 46% x 50%, Genial/Quaest Jul 15 at 48% x 47% and PoderData/Aya Jul 16 at 42% x 51%.`,
})
