#!/usr/bin/env node
/**
 * Testa o `limpar()` de `lib/us-polls/collect.mjs`, que é quem decide o NOME
 * do instituto que vai ao arquivo, à tela e ao dataset aberto.
 *
 * ─── O DEFEITO QUE CRIOU ESTE ARQUIVO, 20/Out/2026 ──────────────────────────
 *
 * 🔴 A Wikipédia escreveu o instituto em ITÁLICO, `''The Washington Post''/ABC
 *    News/Ipsos`, e o limpador tirava NEGRITO (`'''`) e não tirava itálico
 *    (`''`). O nome entrou no arquivo **com as quatro aspas**, foi para a
 *    **média servida** e seria a **QUARTA grafia** da mesma família de casa.
 *
 * 🕳️ **Assimetria de guarda entre duas âncoras do mesmo par é defeito
 *    silencioso, não estilo.** É a mesma família do `==Polling==` que lançava e
 *    do `|}` que não, em 25/Set/2026, no mesmo arquivo.
 *
 * ⚠️ E ele já estava quebrado num segundo caso que ninguém havia encontrado:
 *    `'''''negrito itálico'''''` saía como `''negrito itálico''`, porque tirar
 *    só as três primeiras aspas deixa duas de cada lado.
 *
 * ─── A ORDEM É A REGRA ──────────────────────────────────────────────────────
 *
 * 🔑 Três aspas ANTES de duas. Invertido, `'''negrito'''` perde duas de cada
 *    lado e sobra uma aspa órfã. Metade deste arquivo existe para travar isso.
 *
 * 📌 E apóstrofo ÚNICO sobrevive, porque o padrão exige duas adjacentes:
 *    `Sabato's Crystal Ball` atravessa inteiro, e há caso cobrando.
 */
import { limpar } from '../lib/us-polls/collect.mjs'

let ok = 0
let falhas = 0
function eq(nome, achado, esperado) {
  if (achado === esperado) {
    ok++
    return
  }
  falhas++
  console.log(`  ❌ ${nome}\n     esperado ${JSON.stringify(esperado)}\n     veio     ${JSON.stringify(achado)}`)
}

console.log('\n🔬 limpar() da célula do índice\n')

// ══ 🔴 O CASO FUNDADOR, com o nome REAL do dia ═══════════════════════════
eq(
  "🔴 o itálico sai: ''The Washington Post''/ABC News/Ipsos",
  limpar("''The Washington Post''/ABC News/Ipsos"),
  'The Washington Post/ABC News/Ipsos'
)
eq('e o resultado é EXATAMENTE a grafia que a base já tinha da família', limpar("''The Washington Post''/ABC News/Ipsos"), 'The Washington Post/ABC News/Ipsos')

// ══ 🔑 A ORDEM: três aspas antes de duas ═════════════════════════════════
eq('negrito sai, como já saía', limpar("'''Negrito'''"), 'Negrito')
eq('🔑 negrito+itálico sai INTEIRO, e antes deixava duas aspas', limpar("'''''NegritoItalico'''''"), 'NegritoItalico')
eq('itálico simples sai', limpar("''Italico''"), 'Italico')
// ⛔ Se a ordem invertesse, estes dois deixariam aspa órfã.
eq('⛔ negrito não deixa aspa órfã', limpar("'''X'''").includes("'"), false)
eq('⛔ negrito+itálico não deixa aspa órfã', limpar("'''''X'''''").includes("'"), false)

// ══ 📌 O APÓSTROFO LEGÍTIMO, que não é marcação ══════════════════════════
eq("📌 Sabato's Crystal Ball atravessa inteiro", limpar("Sabato's Crystal Ball"), "Sabato's Crystal Ball")
eq("apóstrofo no fim também", limpar("Pollsters' Group"), "Pollsters' Group")
eq("apóstrofo e itálico juntos", limpar("''Sabato's Crystal Ball''"), "Sabato's Crystal Ball")

// ══ ANTI-EXCESSO: os nomes REAIS da base não podem ser tocados ═══════════
// ⛔ Limpador que mexe em nome bom troca a chave da casa e a média passa a
//    contar duas vezes. Estes são nomes que estão no arquivo hoje.
for (const n of [
  'Reuters/Ipsos',
  'The Economist/YouGov',
  'I&I/TIPP Insights (R)',
  'McLaughlin & Associates (R)',
  'Beacon Research (D)/ Shaw & Co. Research (R)',
  'Harvard/Harris Poll/HarrisX',
  'Emerson College',
  'Quinnipiac University',
  'UMass Amherst/YouGov',
  'Morning Consult/Cato Institute',
  'Impact Research (D)/National Research Inc. (R)',
  'Strength In Numbers/Verasight',
  'The Argument/Verasight',
  'Change Research (D)',
  'Cygnal (R)',
  'ActiVote',
  'SurveyMonkey',
]) {
  eq(`nome real passa intacto: ${n}`, limpar(n), n)
}

// ══ O QUE ELE JÁ FAZIA, e que não pode regredir ══════════════════════════
eq('referência auto-fechada sai', limpar('Casa<ref name="x" />'), 'Casa')
eq('referência pareada sai', limpar('Casa<ref>nota</ref>'), 'Casa')
eq('link com rótulo vira o rótulo', limpar('[[Instituto X|Casa]]'), 'Casa')
eq('link simples vira o alvo', limpar('[[Casa]]'), 'Casa')
eq('nowrap vira o conteúdo', limpar('{{nowrap|Casa Longa}}'), 'Casa Longa')
eq('quebra de linha vira espaço', limpar('Casa<br />Nova'), 'Casa Nova')
eq('nbsp vira espaço', limpar('Casa&nbsp;Nova'), 'Casa Nova')
eq('espaço repetido colapsa', limpar('Casa    Nova'), 'Casa Nova')
eq('espaço nas pontas sai', limpar('  Casa  '), 'Casa')

// ══ ANTI-EXCESSO: entrada degenerada não estoura ═════════════════════════
eq('vazio volta vazio', limpar(''), '')
eq('só marcação volta vazio', limpar("''''''"), '')
eq('só espaço volta vazio', limpar('   '), '')

// ══ 🧪 E A VARREDURA DO ARQUIVO REAL: nenhum nome servido pode ter marcação
{
  const { readFileSync } = await import('fs')
  const a = JSON.parse(readFileSync('public/us-polls-data.json', 'utf8'))
  const comMarcacao = (a.polls ?? []).filter((p) => /''|\[\[|\]\]|<ref|\{\{|<br/.test(String(p.instituto)))
  eq('🧪 ZERO nomes com marcação de wikitext no arquivo publicado', comMarcacao.length, 0)
  if (comMarcacao.length) console.log('     ainda com marcação: ' + [...new Set(comMarcacao.map((p) => p.instituto))].join(' | '))
  // 📌 E a varredura vale para o nome na MÉDIA também, que é o que vai à tela.
  const naMedia = (a.mediaAfos?.incluidas ?? []).filter((k) => /''|\[\[|<ref|\{\{/.test(String(k.instituto)))
  eq('🧪 e ZERO na média servida', naMedia.length, 0)
}

console.log(`\n${falhas === 0 ? '✅ APROVADO' : '❌ REPROVADO'}: ${ok} passaram, ${falhas} falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
