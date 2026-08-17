/**
 * Mapa EN, complemento de 17/Ago: estado eleitoral declarado por linha.
 */
import { construir } from '../build-locale-json'

const STAMP = 'confirmed reading of Aug 17, 6:48 PM BRT (9:48 PM UTC)'

construir('analysis-criteriosa', 'en', {
  'candidates[3].header':
    `PRICE for the whole pack, ${STAMP}: Caiado 0.25% (vol USD 6.07M), Zema 0.25% (vol USD 5.62M). ⭐ Pablo Marçal appears at 0.90% (vol USD 1.21M) and is a registered candidate campaigning under an injunction, though INELIGIBLE until 2032 and with his registration still pending before the electoral court.`,
  'candidates[3].fortes[4]':
    `Pablo Marçal is priced at 0.90%, with USD 1.21M accumulated, and will be included in the Datafolha survey scheduled for Aug 21, according to Valor Econômico. 🏷️ He filed for registration and is among the 13 who did so, and an injunction cleared him to campaign, but he is INELIGIBLE until 2032 and the registration remains pending a decision by the electoral court, according to BBC, G1 and Folha de S.Paulo.`,
  'candidates[3].analise':
    `The pack produced the most interesting move of the day in POSITION, not in winning. Caiado fell in the contract on winning, from 0.60% to 0.25%, and rose in the one on finishing third, from 37.50% to 38.50%. 📌 These are different questions and the panel does not add them: one contract asks whether he wins the election, the other asks in which position he finishes the first round. ⭐ And today's poll reinforces that side: BTG/Nexus gives Caiado 5% against Renan Santos's 4%, meaning that in declared intention he is already the third name, while in the third place book he still sits 14.00pp behind. ⚠️ All of these win contracts in the pack are below 1%, a range in which the panel declares noise and avoids fine readings. 🏷️ AND FROM TODAY THE PANEL DECLARES THE ELECTORAL STATUS OF EVERY ROW. Pablo Marçal enters the comparison table because he is a registered candidate cleared to campaign by an injunction, and the market already assigns him 0.90% and USD 1.21M without A SINGLE poll having measured him. ⭐ That is the sharpest crossing the panel holds today, and he stays out of the graph until the Datafolha of Aug 21, because absence of measurement is not a measurement of zero. Tarcísio de Freitas and Fernando Haddad REMAIN in the table even though they are running for governor of São Paulo, because their contracts are still open: the first carries USD 13.93M, the highest accumulated volume among the 18 priced contracts in the presidential book, above the leader's own. ⛔ The panel does not delete a row to look tidy.`,
})
