/**
 * Testa `lib/dashboard/partido-us.ts`, o rótulo do partido na tela dos EUA.
 *
 * 🔴 O DEFEITO QUE CRIOU O MÓDULO, medido em 19/Out/2026: os cartões de controle
 *    de `/dashboard/us` imprimiam `Democratas` e `Republicanos` em PORTUGUÊS no
 *    inglês e no espanhol, ao lado de rótulos corretamente traduzidos. O nome é
 *    o do desfecho como o banco o guarda, e a tela o imprimia cru.
 *
 * 🔑 E a mesma página se contradizia: a seção do cruzamento já imprimia
 *    `Democrats` e `Demócratas` certos, por uma tradução inline. As duas passaram
 *    a ler este módulo, que é a cópia única.
 *
 * ⛔ A TRAVA que mais importa aqui é a de PASSAGEM: o mesmo componente desenha
 *    as FAIXAS de cadeiras com a mesma função de rótulo, então nome fora do mapa
 *    tem de voltar INTEIRO. Um mapa que engolisse o desconhecido apagaria a
 *    tabela de distribuição inteira, e desfecho novo apareceria em branco, que é
 *    pior que aparecer em português: erro de idioma se lê, rótulo vazio não.
 */
import { rotuloDePartido, PARTIDO_US } from '../lib/dashboard/partido-us'

let ok = 0
let falhas = 0
function eq(nome: string, achado: unknown, esperado: unknown) {
  if (JSON.stringify(achado) === JSON.stringify(esperado)) {
    ok++
    return
  }
  falhas++
  console.log(`  ❌ ${nome}\n     esperado ${JSON.stringify(esperado)}\n     veio     ${JSON.stringify(achado)}`)
}

console.log('\n🔬 partido-us\n')

// ══ O CASO FUNDADOR: os dois partidos nos três idiomas ═══════════════════
eq('Democratas em pt-BR', rotuloDePartido('Democratas', 'pt-BR'), 'Democratas')
eq('🔴 Democratas em EN deixa de sair em português', rotuloDePartido('Democratas', 'en'), 'Democrats')
eq('🔴 Democratas em ES deixa de sair em português', rotuloDePartido('Democratas', 'es'), 'Demócratas')
eq('Republicanos em pt-BR', rotuloDePartido('Republicanos', 'pt-BR'), 'Republicanos')
eq('🔴 Republicanos em EN', rotuloDePartido('Republicanos', 'en'), 'Republicans')
eq('Republicanos em ES é a MESMA palavra, e isso é fato e não omissão', rotuloDePartido('Republicanos', 'es'), 'Republicanos')

// 🔑 As traduções têm de bater com as que a seção do cruzamento já publicava,
//    senão a mesma página voltaria a se contradizer, agora ao contrário.
eq('o EN bate com o que o cruzamento já imprimia', [rotuloDePartido('Democratas', 'en'), rotuloDePartido('Republicanos', 'en')], ['Democrats', 'Republicans'])
eq('e o ES também', [rotuloDePartido('Democratas', 'es'), rotuloDePartido('Republicanos', 'es')], ['Demócratas', 'Republicanos'])

// ══ ⛔ A PASSAGEM, que é a trava anti-silêncio ════════════════════════════
// As faixas de cadeiras passam pela MESMA função, em todos os idiomas.
for (const loc of ['pt-BR', 'en', 'es']) {
  eq(`faixa "< 190 cad." passa inteira em ${loc}`, rotuloDePartido('< 190 cad.', loc), '< 190 cad.')
  eq(`faixa "≥ 230 cad." passa inteira em ${loc}`, rotuloDePartido('≥ 230 cad.', loc), '≥ 230 cad.')
  eq(`faixa "205–209 cad." passa inteira em ${loc}`, rotuloDePartido('205–209 cad.', loc), '205–209 cad.')
  eq(`faixa "≤ 47 cad." passa inteira em ${loc}`, rotuloDePartido('≤ 47 cad.', loc), '≤ 47 cad.')
}
eq('🔑 desfecho NOVO do Polymarket passa inteiro, nunca vazio', rotuloDePartido('Libertarians', 'en'), 'Libertarians')
eq('e em ES também', rotuloDePartido('Libertarians', 'es'), 'Libertarians')

// ══ ANTI-EXCESSO: entrada degenerada nunca devolve vazio ═════════════════
// ⛔ Rótulo vazio na tela é invisível, e invisível é pior que errado.
eq('string vazia volta vazia, sem inventar rótulo', rotuloDePartido('', 'en'), '')
eq('idioma desconhecido cai em pt-BR', rotuloDePartido('Democratas', 'fr'), 'Democratas')
eq('idioma vazio cai em pt-BR', rotuloDePartido('Democratas', ''), 'Democratas')
eq('casamento é EXATO: minúscula não casa', rotuloDePartido('democratas', 'en'), 'democratas')
eq('e nome com espaço em volta não casa, volta inteiro', rotuloDePartido(' Democratas', 'en'), ' Democratas')

// ══ O MAPA: carga e forma ════════════════════════════════════════════════
eq('o mapa tem os dois partidos', Object.keys(PARTIDO_US).sort(), ['Democratas', 'Republicanos'])
for (const [nome, e] of Object.entries(PARTIDO_US)) {
  for (const loc of ['pt-BR', 'en', 'es'] as const) {
    eq(`${nome} tem rótulo não vazio em ${loc}`, Boolean(e[loc] && e[loc].trim()), true)
  }
}
// 📌 A CHAVE é o nome como o BANCO o guarda, e ele não se traduz lá: mexer no
//    dado mudaria a procedência da série. Esta asserção trava isso.
eq('🔑 a chave de cada entrada é o nome do banco, em português', Object.keys(PARTIDO_US).every((k) => PARTIDO_US[k]['pt-BR'] === k), true)

console.log(`\n${falhas === 0 ? '✅ APROVADO' : '❌ REPROVADO'}: ${ok} passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
