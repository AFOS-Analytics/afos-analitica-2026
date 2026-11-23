/**
 * Mesma matéria com e sem RUBRICA na coleta de imprensa da França (23/Nov/2026).
 *
 * Em 23/Nov a coleta das 12:25 UTC publicou o L'Opinion DUAS vezes: o título do
 * feed próprio sem rubrica e o do Google News com "Présidentielle 2027 : " na
 * frente. A chave por título só junta títulos idênticos. `mesmaMateriaComRubrica`
 * junta quando o mais longo TERMINA com o mais curto (6 palavras ou mais).
 *
 * Cobre o caso real (controle positivo), a rubrica com ponto, e o que NÃO pode
 * juntar: título curto demais, título que só começa igual, matérias diferentes
 * do mesmo veículo. Sem rede.
 *
 *   node scripts/testar-imprensa-fr-rubrica.mjs
 */
import { mesmaMateriaComRubrica } from '../lib/fr-press/collect.mjs'

const casos = [
  // O caso real de 23/Nov/2026 (L'Opinion, feed x Google News).
  ['David Lisnard devance Edouard Philippe dans un sondage pour la première fois', 'Présidentielle 2027 : David Lisnard devance Edouard Philippe dans un sondage pour la première fois', true],
  // Rubrica com ponto (Ouest-France), aspas e apóstrofo tipográficos.
  ['Présidentielle 2027. Marine Le Pen nie avoir reçu des «informations confidentielles» du ministère de l’Intérieur', 'Marine Le Pen nie avoir reçu des «informations confidentielles» du ministère de l’Intérieur', true],
  // Idênticos depois da normalização.
  ['Présidentielle 2027 : faut-il changer les dates du scrutin ?', 'Présidentielle 2027 - faut-il changer les dates du scrutin', true],
  // Curto demais para afirmar que é a mesma matéria.
  ['Lisnard candidat', 'Présidentielle 2027 : Lisnard candidat', false],
  // Começa igual, mas é outro título (prefixo, não rubrica).
  ['David Lisnard devance Edouard Philippe dans un sondage', 'David Lisnard devance Edouard Philippe dans un sondage pour la première fois', false],
  // Duas matérias do mesmo veículo sobre a mesma pessoa.
  ['"Il n\'y a pas d\'autres modes de départage" que la primaire, affirme David Lisnard', '"J\'espère le faire en tant que président des maires": David Lisnard assure qu\'il sera "candidat à l\'élection présidentielle"', false],
]

let falhas = 0
for (const [a, b, esperado] of casos) {
  for (const [x, y] of [[a, b], [b, a]]) {
    const r = mesmaMateriaComRubrica(x, y)
    if (r !== esperado) { falhas++; console.log(`⛔ esperado ${esperado}, veio ${r}: "${x.slice(0, 60)}" × "${y.slice(0, 60)}"`) }
  }
}
console.log(`${casos.length * 2 - falhas}/${casos.length * 2} casos (cada par nas duas ordens)`)
process.exit(falhas ? 1 : 0)
