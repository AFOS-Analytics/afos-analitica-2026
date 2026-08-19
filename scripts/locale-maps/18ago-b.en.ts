/** Mapa EN de 18/Ago/2026, parte 2: analysis-data e polls-data. */
import { construir } from '../build-locale-json'

construir('analysis-data', 'en', {
  'cards.sentimento.text1': `⛔ The panel is NOT publishing a new price today, and the reason is the AFOS guard itself: it takes two readings 8 minutes apart and only clears them if they agree within 0.20pp. It ran FIVE times between 8:30 PM and 9:37 PM BRT on Aug 18 and blocked all five. The prices on screen are the confirmed capture of Aug 17, 6:48 PM BRT.`,
  'cards.sentimento.text2': `🔑 The instability sat in the THIN contracts, not in the leader. Across the ten readings of the night the front-runner came in at 63.50% every time, 0.00pp of amplitude, and Renan Santos and Ronaldo Caiado did not move in the presidential book either. What disagreed between samples was the runner-up, between 32.45% and 32.75%, and Pablo Marçal, between 0.65% and 1.15%.`,
  'cards.sentimento.text3': `⚠️ An amplitude of 0.50pp on a contract worth 1% is nearly half its own value, and that is market depth, not an electoral signal: a thin book moves on little money. The panel records the difference instead of publishing a number that two readings do not confirm.`,
  'cards.sentimento.polymarket': `Confirmed reading of Aug 17, 6:48 PM BRT. On Aug 18 the guard blocked five times and no new price was certified.`,
})

construir('polls-data', 'en', {
  'polymarketComparison.note': `⛔ NO CERTIFIED PRICE ON Aug 18, and the values in this table are the confirmed capture of Aug 17, 6:48 PM BRT. The AFOS capture guard takes two readings 8 minutes apart and only clears them if they agree within 0.20pp; it ran FIVE times between 8:30 PM and 9:37 PM on Aug 18 and blocked all five. 🔑 The instability sat in the THIN contracts: across the ten readings of the night the leader came in at 63.50% every time, with 0.00pp of amplitude, while Pablo Marçal was read between 0.65% and 1.15%, that is 0.50pp on a contract worth about 1%. A thin book moves on little money, so this is market depth and not an electoral signal. 📌 POLLS: no new national one. The latest is BTG/Nexus of Aug 17, and Datafolha of Aug 21 will be the first to measure Marçal.`,

  'polymarketComparison.candidates[0].tendenciaPolymarket': `⛔ NO CONFIRMED READING on Aug 18. Across the ten readings between 8:30 PM and 9:37 PM he appeared at 63.50% in ALL of them, 0.00pp of amplitude, the most stable contract in the book, but the guard certifies the whole capture or none of it. The value alongside is the one from Aug 17, 6:48 PM BRT. ⛔ No superlative: the high of the 88-day series is 66.50%, from Aug 1.`,

  'polymarketComparison.candidates[1].tendenciaPolymarket': `⛔ NO CONFIRMED READING on Aug 18. He was one of the contracts that blocked certification: read between 32.45% and 32.75% in the presidential book and between 86.50% and 87.50% in the second place book. ⛔ No superlative: the high of the 88-day series is 33.20%, from Jun 2, and no reading tonight passed it.`,

  'polymarketComparison.candidates[2].tendenciaPolymarket': `⛔ NO CONFIRMED READING on Aug 18. In the presidential book he sat still at 3.95% across the ten readings; it was in the PLACEMENT contracts that he moved, 0.50pp in the third place one. 📏 The low of the 88-day series was touched on Aug 18, at 3.60%.`,

  'polymarketComparison.candidates[3].tendenciaPolymarket': `⛔ NO CONFIRMED READING on Aug 18. He was STABLE at 0.45% in the presidential book across the ten readings, and swung 0.50pp in the third place contract, between 37.00% and 37.50%. 📌 The poll and the price still disagree about who is third: BTG/Nexus of Aug 17 gives him 5%, above the 4% of Renan Santos.`,

  'polymarketComparison.candidates[4].tendenciaPolymarket': `⛔ NO CONFIRMED READING on Aug 18, and he was the MOST UNSTABLE contract of the night: read between 0.65% and 1.15%, that is 0.50pp of amplitude on a contract worth about 1%. 🏷️ ELECTORAL STATUS, updated today: he asked the electoral court to correct his asset declaration and the declared wealth fell from R$ 7.4 billion to R$ 149.9 million, according to G1, Valor and O Globo, all of the same group. He remains INELIGIBLE until 2032, campaigning allowed by injunction and registration still pending. 📅 Datafolha of Aug 21 is the FIRST to measure him.`,
})
