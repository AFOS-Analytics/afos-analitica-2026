/**
 * testar-traduzir-dashboard-brz.mjs — casos plantados para as DUAS regras que
 * decidem se um campo é traduzido, mudadas em 18/Set/2026.
 *
 * 🔴 As duas se escondiam da mesma forma: campo que elas pegam NUNCA vira
 *    pendência, então a saída do tradutor ficava verde enquanto o arquivo
 *    publicado tinha português. Foi preciso um conferidor que lê o arquivo
 *    PUBLICADO (`conferir-traducao-brz.mjs`) para elas aparecerem.
 *
 * Uso: node scripts/testar-traduzir-dashboard-brz.mjs
 */

import { readFileSync } from 'node:fs'

const fonte = readFileSync('scripts/traduzir-dashboard-brz.ts', 'utf8')

let falhas = 0
let passes = 0
function conferir(nome, cond, detalhe) {
  if (cond) {
    passes++
    console.log(`  ✅ ${nome}`)
  } else {
    falhas++
    console.log(`  ❌ ${nome}${detalhe ? `\n     ${detalhe}` : ''}`)
  }
}

console.log('\n1. 🔴 O MAPA VENCE A HERANÇA')
{
  // A ordem importa: herança primeiro congela tradução errada para sempre,
  // porque campo que não muda é copiado intacto em toda rodada e o `--mapa`
  // nunca chega nele.
  const iMapa = fonte.indexOf('if (doMapa !== undefined)')
  const iHerd = fonte.indexOf('} else if (herdada !== undefined)')
  conferir('o ramo do mapa existe', iMapa > 0, 'não achei `if (doMapa !== undefined)`')
  conferir('o ramo da herança é o ELSE', iHerd > 0, 'não achei `} else if (herdada !== undefined)`')
  conferir('e o mapa vem ANTES da herança', iMapa > 0 && iHerd > iMapa, `mapa em ${iMapa}, herança em ${iHerd}`)
  conferir(
    'a ordem antiga não voltou',
    !/if \(herdada !== undefined\) \{[\s\S]{0,120}\} else if \(doMapa/.test(fonte),
    'a herança voltou a vir primeiro',
  )
}

console.log('\n2. 🔴 `name` NÃO se exclui em bloco')
{
  // `institutes[].name` e `candidates[].name` são nome próprio e ficam fora.
  // `scenarios[].name` é rótulo descritivo e TEM de ser traduzido.
  const bruto = fonte.slice(fonte.indexOf('const NAO_TRADUZ = ['), fonte.indexOf('const naoTraduz'))
  // 🕳️ OS COMENTÁRIOS SAEM ANTES. A primeira versão deste caso varria o bloco
  //    cru e reprovava, porque o comentário que explica a correção CITA a regra
  //    antiga: `/(^|\.)name$/`. Conferidor que lê comentário como se fosse
  //    código acusa a própria documentação da correção.
  const bloco = bruto.replace(/\/\/[^\n]*/g, '')
  conferir('a regra por sufixo puro saiu do CÓDIGO', !/\/\(\^\|\\\.\)name\$\//.test(bloco), 'ainda há `/(^|\\.)name$/` solto')
  conferir('institutes[N].name continua fora', /institutes\\\[\\d\+\\\]\\\.name\$/.test(bloco))
  conferir('candidates[N].name continua fora', /candidates\\\[\\d\+\\\]\\\.name\$/.test(bloco))

  // O comportamento, e não só o texto: reconstruo a lista e testo caminhos.
  const linhas = [...bloco.matchAll(/^\s*(\/.+\/),\s*$/gm)].map((m) => m[1])
  const regras = linhas.map((s) => {
    const fim = s.lastIndexOf('/')
    return new RegExp(s.slice(1, fim), s.slice(fim + 1))
  })
  const pula = (c) => regras.some((re) => re.test(c))
  conferir('PULA institutes[3].name', pula('institutes[3].name'))
  conferir('PULA candidates[0].name', pula('candidates[0].name'))
  conferir('🔑 NÃO pula polls[0].scenarios[0].name', !pula('polls[0].scenarios[0].name'), 'o rótulo do cenário voltou a ser excluído')
  conferir('NÃO pula institutes[3].type', !pula('institutes[3].type'))
  conferir('NÃO pula polls[0].note', !pula('polls[0].note'))
  // Os que sempre estiveram certos, para a mudança não ter afrouxado nada.
  conferir('PULA polls[0].date', pula('polls[0].date'))
  conferir('PULA polls[0].register', pula('polls[0].register'))
  conferir('PULA polls[0].institute', pula('polls[0].institute'))
  conferir('PULA secondRound[0].matchup', pula('polls[0].secondRound[0].matchup'))
  conferir('PULA secondRound[0].candidate1', pula('polls[0].secondRound[0].candidate1'))
  conferir('PULA updatedAt', pula('updatedAt'))
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.\n`)
process.exit(falhas === 0 ? 0 : 1)
