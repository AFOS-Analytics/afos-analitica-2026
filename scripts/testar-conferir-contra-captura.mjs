/**
 * testar-conferir-contra-captura.mjs — casos plantados.
 *
 * 🔑 O caso 3 é o defeito REAL de 04/Set/2026 replantado: prosa e quadro
 * coerentes entre si, os dois com o volume da rodada anterior. Nenhum portão da
 * casa reclamava dele, porque todos comparam a página consigo mesma.
 *
 * Uso: node scripts/testar-conferir-contra-captura.mjs
 */

import { formatarVolume, formatarPreco, permitidos, volumesForaDaCaptura } from './conferir-contra-captura.mjs'

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

console.log('\n1. Formatação na convenção do pt-BR')
{
  conferir('milhão vira M com vírgula', formatarVolume(3685273) === 'USD 3,69M', formatarVolume(3685273))
  conferir('milhar vira "mil" arredondado', formatarVolume(468892) === 'USD 469 mil', formatarVolume(468892))
  conferir('o corte é em 1 milhão', formatarVolume(999999) === 'USD 1000 mil')
  conferir('zero e negativo não viram texto', formatarVolume(0) === null && formatarVolume(-5) === null)
  conferir('preço com duas casas e vírgula', formatarPreco(15.85) === '15,85%')
}

console.log('\n2. A captura autoriza o que ela contém, livro bloqueado incluído')
{
  const snap = {
    livrosOk: ['presidential'],
    livros: { presidential: { ok: true }, stf: { ok: false } },
    precos: { 'presidential:A': 55.5, 'stf:X': 15.85 },
    volumes: { 'presidential:A': 9720476, 'stf:X': 87387 },
  }
  const { precos, volumes } = permitidos(snap)
  conferir('conhece os dois volumes', volumes.has('USD 9,72M') && volumes.has('USD 87 mil'), [...volumes].join(' '))
  conferir(
    '🔑 o preço do livro BLOQUEADO também é conhecido, porque ele existe na captura',
    precos.has('15,85%'),
    [...precos].join(' ')
  )
}

console.log('\n3. 🔴 O DEFEITO REAL DE 04/Set: prosa e quadro velhos JUNTOS')
{
  const snap = { precos: {}, volumes: { 'presidential:Marçal': 3685273 } }
  const { volumes } = permitidos(snap)
  const pagina =
    '{"m":"0,15% (vol USD 3,64M) no contrato de VENCEDOR","p":"...","t":"o volume dele segue em USD 3,64M"}'
  const fora = volumesForaDaCaptura(pagina, volumes)
  conferir('acusa o volume velho', fora.includes('USD 3,64M'), JSON.stringify(fora))
  conferir('e acusa UMA vez, mesmo aparecendo duas', fora.length === 1, JSON.stringify(fora))

  const corrigida = pagina.split('3,64M').join('3,69M')
  conferir('com o valor certo, nada é acusado', volumesForaDaCaptura(corrigida, volumes).length === 0)
}

console.log('\n4. Referência declarada não é acusação')
{
  const snap = { precos: {}, volumes: { 'presidential:A': 9720476 } }
  const { volumes } = permitidos(snap)
  const pagina = 'o livro passou de USD 142,61M para USD 143,62M, e ele está em USD 9,72M'
  conferir('sem declarar, os dois totais são acusados', volumesForaDaCaptura(pagina, volumes).length === 2)
  const refs = new Set(['USD 142,61M', 'USD 143,62M'])
  conferir('declarados, somem', volumesForaDaCaptura(pagina, volumes, refs).length === 0)
  conferir(
    '⚠️ mas declarar não apaga um valor de verdade errado',
    volumesForaDaCaptura('ele está em USD 9,71M', volumes, refs).includes('USD 9,71M')
  )
}

console.log('\n5. O regex não engole número que não é volume')
{
  const snap = { precos: {}, volumes: { 'presidential:A': 87387 } }
  const { volumes } = permitidos(snap)
  const pagina = 'percorreu 8,70pp com USD 28 de dinheiro novo, e o livro tem USD 87 mil'
  const fora = volumesForaDaCaptura(pagina, volumes)
  conferir('USD 28, sem "mil" nem "M", não é lido como volume', !fora.some((f) => f.includes('28')), JSON.stringify(fora))
  conferir('e o USD 87 mil real passa', fora.length === 0, JSON.stringify(fora))
}

console.log('\n6. Captura vazia não vira aprovação silenciosa')
{
  const { volumes } = permitidos({ precos: {}, volumes: {} })
  conferir('nenhum volume autorizado', volumes.size === 0)
  conferir(
    'então tudo que estiver escrito é acusado, e não o contrário',
    volumesForaDaCaptura('ele está em USD 9,72M', volumes).length === 1
  )
}

console.log(`\n${falhas === 0 ? '✅' : '❌'} ${passes} passaram, ${falhas} falharam.`)
process.exit(falhas === 0 ? 0 : 1)
