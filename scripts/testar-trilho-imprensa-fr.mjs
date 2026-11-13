#!/usr/bin/env node
/**
 * Casos plantados do classificador de trilho da imprensa da França
 * (`trilhoDaMateria` em lib/fr-press/collect.mjs).
 *
 * 🔴 Até 13/Nov/2026 a França não tinha teste no CI. Nesse dia a manchete
 *    "Ligue des nations. Le calendrier de l'équipe de France féminine dévoilé
 *    jusqu'à la Coupe du monde 2027 au Brésil" (Ouest-France) entrou na seção de
 *    imprensa do painel como notícia da eleição: o "2027" solto abria a porta e
 *    o veto só conhecia orçamento.
 *
 * ⚠️ Os dois lados custam: deixar passar esporte ou orçamento põe na tela o que
 *    não é a corrida; barrar demais tira da tela manchete legítima. Por isso há
 *    caso plantado dos dois lados, e as manchetes reais de 12 e 13/Nov/2026 que
 *    precisam continuar entrando.
 *
 * Uso: node scripts/testar-trilho-imprensa-fr.mjs
 */
import { trilhoDaMateria } from '../lib/fr-press/collect.mjs'

let passes = 0
let falhas = 0
function conferir(titulo, esperado) {
  const r = trilhoDaMateria(titulo)
  if (r === esperado) passes++
  else {
    falhas++
    console.log(`❌ esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(r)}: ${titulo}`)
  }
}

console.log('\n🔴 o "2027" que NÃO é a eleição')
for (const t of [
  'Ligue des nations. Le calendrier de l’équipe de France féminine dévoilé jusqu’à la Coupe du monde 2027 au Brésil',
  'Rugby : le XV de France prépare la Coupe du monde 2027 en Australie',
  'Mondial 2027 : les Bleues connaissent leurs adversaires',
  'Championnats du monde 2027 : la sélection française dévoilée',
  'Budget 2027 : le Sénat adopte la première partie',
  'PLF 2027 : ce qui change pour les retraités',
  'Projet de loi de finances 2027 : le gouvernement recule',
]) conferir(t, null)

console.log('🟢 o "2027" que É a eleição continua entrando')
for (const t of [
  '2027 : la gauche cherche son candidat',
  'Présidentielle 2027 : Nicolas Sarkozy se dit favorable à une primaire « large » à droite et au centre',
  'Présidentielle 2027 : «Teddy Riner va voler l\'aspect "nouveauté" à David Lisnard», observe Florian Gérard-Mercier',
  'Candidats à la présidentielle : que veulent-ils faire des fonctionnaires ?',
  'VIDEO Présidentielle 2027 : les gauches sont-elles vraiment irréconciliables ?',
  '"Cet exercice n’a d’intérêt que s’il rassemble": Nicolas Sarkozy plaide pour l\'organisation d\'une "large" primaire de la droite et du centre',
  // eleição nomeada + palavra de esporte: entra pela porta da eleição, antes do veto
  'Présidentielle 2027 : Teddy Riner, de la Coupe du monde de judo à la course à l\'Élysée',
  'Élysée 2027 : l\'équipe de France de Marine Le Pen se met en ordre de bataille',
]) conferir(t, 'disputa')

console.log('🟡 o instrumento (trilho método)')
for (const t of [
  'Les sondeurs face à la candidature de Teddy Riner',
  'Polymarket : les paris sur l\'élection française s\'envolent',
]) conferir(t, 'metodo')

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
