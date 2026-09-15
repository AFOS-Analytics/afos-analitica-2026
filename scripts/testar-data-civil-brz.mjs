/**
 * Casos plantados da data civil do Brasil.
 *
 * ⚠️ O caso que importa é a BORDA, e ela é às 03:00Z: abaixo disso o dia UTC já
 * virou e o brasileiro não. É nessa faixa que o gatilho do /atualizar-brz
 * disparava para a pesquisa errada, nas duas direções.
 */
import { dataCivilBrasil, datasDeHoje, ehFormatoIso, FUSO_BRASIL } from './lib/data-civil-brz.mjs'

let passou = 0
let falhou = 0
const falhas = []

function ok(nome, cond, detalhe = '') {
  if (cond) passou++
  else {
    falhou++
    falhas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`)
  }
}
function eq(nome, obtido, esperado) {
  ok(nome, obtido === esperado, `esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(obtido)}`)
}

// ─── 1. A BORDA das 03:00Z, que é a meia-noite de Brasília ──────────────────

eq('02:59:59Z ainda e o dia ANTERIOR no Brasil', dataCivilBrasil('2026-09-16T02:59:59Z'), '2026-09-15')
eq('03:00:00Z ja e o dia novo no Brasil', dataCivilBrasil('2026-09-16T03:00:00Z'), '2026-09-16')
eq('meio-dia UTC nao tem divergencia', dataCivilBrasil('2026-09-15T12:00:00Z'), '2026-09-15')
eq('23:30Z e o mesmo dia, porque 20:30 BRT', dataCivilBrasil('2026-09-15T23:30:00Z'), '2026-09-15')

// O caso REAL que ficou aberto em 14/Set: a rodada rodando a noite.
eq('rodada as 23h30 BRT usa o dia certo', dataCivilBrasil('2026-09-16T02:30:00Z'), '2026-09-15')
ok(
  'e o UTC daquele instante e OUTRO dia, que e o defeito',
  new Date('2026-09-16T02:30:00Z').toISOString().slice(0, 10) === '2026-09-16',
)

// ─── 2. A virada de MES e de ANO na mesma borda ─────────────────────────────

eq('virada de mes: 01/Out 02:00Z e 30/Set no Brasil', dataCivilBrasil('2026-10-01T02:00:00Z'), '2026-09-30')
eq('virada de ano: 01/Jan 02:00Z e 31/Dez no Brasil', dataCivilBrasil('2027-01-01T02:00:00Z'), '2026-12-31')
eq('e 01/Jan 03:00Z ja e 01/Jan', dataCivilBrasil('2027-01-01T03:00:00Z'), '2027-01-01')

// ─── 3. Janeiro e fevereiro, que era a estacao do horario de verao ──────────

// O Brasil aboliu o horario de verao em 2019, entao NAO deve haver salto de
// hora no verao. Se um dia voltar, o fuso nomeado acompanha e estes casos e que
// vao mudar, com o teste falhando primeiro.
eq('verao, 02:00Z de janeiro ainda e o dia anterior', dataCivilBrasil('2026-01-15T02:00:00Z'), '2026-01-14')
eq('verao, 03:00Z de janeiro ja virou', dataCivilBrasil('2026-01-15T03:00:00Z'), '2026-01-15')
eq('verao, 02:00Z de fevereiro ainda e o dia anterior', dataCivilBrasil('2026-02-15T02:00:00Z'), '2026-02-14')

// ─── 4. As formas de entrada ────────────────────────────────────────────────

eq('aceita Date', dataCivilBrasil(new Date('2026-09-16T02:30:00Z')), '2026-09-15')
eq('aceita string ISO', dataCivilBrasil('2026-09-16T02:30:00Z'), '2026-09-15')
eq('aceita epoch em ms', dataCivilBrasil(Date.parse('2026-09-16T02:30:00Z')), '2026-09-15')
ok('sem argumento devolve formato de data', /^\d{4}-\d{2}-\d{2}$/.test(dataCivilBrasil()))

// ─── 5. ANTI-SILÊNCIO: data invalida NAO pode virar "hoje" ──────────────────

// 🔴 `null`, `true` e `[]` sao os perigosos: `new Date()` deles devolve a EPOCA
// de 1970, que e data VALIDA. Sem guarda de tipo, um null viraria "1970-01-01"
// em silencio, e "hoje" errado e calado e o defeito que este arquivo fecha.
// 🔑 O caso exige a MENSAGEM, e não só "lançou". Medido em 15/Set/2026: sem a
// checagem de NaN a função ainda lança, mas com um `RangeError` cru de dentro do
// `Intl` ("Invalid time value"), e quem cair nisso não descobre que o problema é
// a entrada. Exigir só "lançou" deixava a checagem passar por decorativa.
const ESPERA_MENSAGEM = /dataCivilBrasil:/
for (const lixo of ['nao e data', '', null, NaN, new Date('x'), true, false, [], {}, 'data que nao parseia']) {
  let erro = null
  try {
    dataCivilBrasil(lixo)
  } catch (e) {
    erro = e
  }
  ok(`entrada invalida (${JSON.stringify(lixo)}) LANCA em vez de inventar hoje`, erro != null)
  ok(
    `e a mensagem de (${JSON.stringify(lixo)}) explica o problema, nao vem crua do Intl`,
    ESPERA_MENSAGEM.test(erro?.message ?? ''),
    erro?.message ?? '(sem erro)',
  )
}
// E a prova de que a guarda e necessaria. ⚠️ Sao DOIS e nao tres: `new Date([])`
// da data INVALIDA, porque o array vira string vazia e nao numero. Quem engana
// e o que passa por ToNumber, ou seja `null` -> 0 e `true` -> 1.
for (const enganoso of [null, true]) {
  ok(
    `new Date(${JSON.stringify(enganoso)}) seria uma data valida de 1970`,
    !Number.isNaN(new Date(enganoso).getTime()) && new Date(enganoso).getUTCFullYear() === 1970,
  )
}

// ⚠️ `undefined` é o caso do PADRÃO e por isso NÃO lança: ele é a chamada normal.
ok('undefined usa o padrao e nao lanca', /^\d{4}-\d{2}-\d{2}$/.test(dataCivilBrasil(undefined)))

// ─── 6. O aviso de divergencia ──────────────────────────────────────────────

{
  const d = datasDeHoje('2026-09-16T02:30:00Z')
  eq('datasDeHoje: br', d.br, '2026-09-15')
  eq('datasDeHoje: utc', d.utc, '2026-09-16')
  eq('datasDeHoje: diverge', d.diverge, true)
}
{
  const d = datasDeHoje('2026-09-15T12:00:00Z')
  eq('sem divergencia ao meio-dia', d.diverge, false)
  eq('e as duas datas iguais', d.br, d.utc)
}

// ─── 6b. A guarda de FORMATO, testada por fora ──────────────────────────────

// Ela nunca dispara pela funcao de cima, porque `en-CA` sempre da AAAA-MM-DD.
// Guarda sem caso alcancavel e guarda que ninguem sabe se funciona, entao a
// regra dela e exportada e conferida aqui.
ok('ehFormatoIso aceita AAAA-MM-DD', ehFormatoIso('2026-09-15'))
ok('ehFormatoIso recusa o formato americano', !ehFormatoIso('09/15/2026'))
ok('ehFormatoIso recusa data com hora', !ehFormatoIso('2026-09-15T00:00:00Z'))
ok('ehFormatoIso recusa mes de um digito', !ehFormatoIso('2026-9-15'))
ok('ehFormatoIso recusa string vazia', !ehFormatoIso(''))
ok('ehFormatoIso recusa nao-string', !ehFormatoIso(20260915))
ok('ehFormatoIso recusa null', !ehFormatoIso(null))
// 🔑 O caso que prende o `typeof`. Numero e null ja falhariam sem ele, porque o
// `.test()` os converte para texto que nao casa. Quem PASSARIA sem o typeof e o
// objeto que se converte para uma data valida, e o mais provavel deles no mundo
// real e o String embrulhado, cujo typeof e 'object'.
ok('ehFormatoIso recusa String embrulhado', !ehFormatoIso(new String('2026-09-15')))
ok('ehFormatoIso recusa objeto que finge ser data', !ehFormatoIso({ toString: () => '2026-09-15' }))

// ─── 7. O fuso e parametro, para o teste nao depender da maquina ────────────

eq('o fuso padrao e o de Brasilia', FUSO_BRASIL, 'America/Sao_Paulo')
eq('fuso explicito UTC devolve a data UTC', dataCivilBrasil('2026-09-16T02:30:00Z', 'UTC'), '2026-09-16')
eq('e um fuso a leste pode estar um dia ADIANTE', dataCivilBrasil('2026-09-15T23:30:00Z', 'Asia/Tokyo'), '2026-09-16')

console.log(`\n🧪 DATA CIVIL BRZ: ${passou} passou · ${falhou} falhou  (${passou + falhou} casos)`)
if (falhou) {
  console.log('\n❌ falhas:')
  for (const f of falhas) console.log(`   ${f}`)
  process.exit(1)
}
console.log('✅ todos os casos passaram\n')
