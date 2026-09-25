/**
 * 🧪 O LEDGER DE FONTE ABERTA (lib/us-polls/fonte-conferida.mjs).
 *
 * 🔑 O teste que mais importa é o ANTI-SILÊNCIO: uma conferência de ontem não
 * pode calar um número de hoje. Se o índice reescrever D ou R, a entrada tem de
 * CADUCAR e a linha volta a contar como não conferida.
 *
 * node scripts/testar-fonte-conferida.mjs
 */
import { FONTE_CONFERIDA, RESULTADOS, conferirCarga, fonteDa, dividasAbertas } from '../lib/us-polls/fonte-conferida.mjs'

let ok = 0
let falhou = 0
const caso = (nome, cond) => {
  if (cond) ok++
  else {
    falhou++
    console.log(`❌ ${nome}`)
  }
}
const err = (reg, agulha) => conferirCarga(reg).some((e) => e.includes(agulha))

// ── 1. A carga real ────────────────────────────────────────────────
caso('a carga real nao tem erro', conferirCarga().length === 0)
caso('as 2 entradas de 25/Set estao la', FONTE_CONFERIDA.length === 2)
caso('os 4 resultados previstos', Object.keys(RESULTADOS).sort().join(',') === 'CONFIRMA,CONFIRMA_PARCIAL,NAO_CONTEM_A_PERGUNTA,NAO_ENCONTRADO')

// ── 2. Entrada sem prova nao passa ─────────────────────────────────
const base = () => [
  {
    instituto: 'Casa A',
    campoInicio: '2026-09-01',
    campoFim: '2026-09-03',
    valores: '50/40',
    conferidoEm: '2026-09-25',
    resultado: 'CONFIRMA',
    url: 'https://x',
    confirmado: ['tudo'],
    naoConfirmado: [],
    nota: 'n',
  },
]
const sem = (f) => {
  const r = base()
  delete r[0][f]
  return r
}
caso('sem instituto reprova', err(sem('instituto'), 'sem instituto'))
caso('sem campoFim reprova', err(sem('campoFim'), 'sem campo completo'))
caso('sem valores reprova', err(sem('valores'), 'nao caducaria'.replace('nao', 'não')))
caso('sem conferidoEm reprova', err(sem('conferidoEm'), 'sem conferidoEm'))
caso('sem url reprova', err(sem('url'), 'sem url'))
caso('sem nota reprova', err(sem('nota'), 'sem nota'))
{
  const r = base()
  r[0].resultado = 'TALVEZ'
  caso('resultado fora da lista reprova', err(r, 'não é um de'))
}
{
  const r = base()
  r[0].resultado = 'CONFIRMA_PARCIAL'
  caso('PARCIAL sem as duas listas reprova', err(r, 'DUAS listas'))
  r[0].naoConfirmado = ['o recorte']
  caso('PARCIAL com as duas listas passa', conferirCarga(r).length === 0)
}
{
  const r = base()
  r[0].naoConfirmado = ['alguma coisa']
  caso('CONFIRMA com pendencia reprova, e parcial', err(r, 'é parcial, não total'))
}
{
  const r = base()
  r[0].resultado = 'NAO_CONTEM_A_PERGUNTA'
  caso('NAO_CONTEM confirmando algo reprova', err(r, 'não pode confirmar nada'))
  r[0].confirmado = []
  r[0].naoConfirmado = ['tudo']
  caso('NAO_CONTEM sem confirmar nada passa', conferirCarga(r).length === 0)
}

// ── 3. O casamento, e a CADUCIDADE ─────────────────────────────────
const REG = base()
const linha = (o) => ({ instituto: 'Casa A', campoInicio: '2026-09-01', campoFim: '2026-09-03', dem: 50, rep: 40, ...o })
caso('casa pela casa, pelo campo e pelos valores', fonteDa(linha(), REG) !== null)
caso('🔒 CADUCA quando o indice reescreve D', fonteDa(linha({ dem: 51 }), REG) === null)
caso('🔒 CADUCA quando o indice reescreve R', fonteDa(linha({ rep: 41 }), REG) === null)
caso('⛔ outra ONDA da mesma casa nao casa', fonteDa(linha({ campoFim: '2026-09-10' }), REG) === null)
caso('⛔ outra CASA na mesma onda nao casa', fonteDa(linha({ instituto: 'Casa B' }), REG) === null)
caso('inicio de campo diferente nao casa', fonteDa(linha({ campoInicio: '2026-08-30' }), REG) === null)
caso('linha vazia nao explode', fonteDa(null, REG) === null)

// 🧬 O casamento passa pela SERIE da casa: o rotulo do veiculo encontra o do executor.
{
  const r = base()
  r[0].instituto = 'Beacon Research (D)/ Shaw & Co. Research (R)'
  caso(
    'o rotulo do VEICULO acha a entrada da serie',
    fonteDa(linha({ instituto: 'Fox News' }), r) !== null
  )
}

// ── 4. As dividas abertas ──────────────────────────────────────────
{
  const r = base()
  caso('CONFIRMA nao e divida', dividasAbertas([linha()], r).length === 0)
  r[0].resultado = 'NAO_ENCONTRADO'
  r[0].confirmado = []
  r[0].naoConfirmado = ['tudo']
  caso('NAO_ENCONTRADO e divida aberta', dividasAbertas([linha()], r).length === 1)
  r[0].resultado = 'CONFIRMA_PARCIAL'
  r[0].confirmado = ['o campo']
  caso('PARCIAL tambem e divida aberta', dividasAbertas([linha()], r).length === 1)
  caso('linha sem entrada nenhuma nao aparece', dividasAbertas([linha({ instituto: 'Casa Z' })], r).length === 0)
  caso('lista vazia devolve vazio', dividasAbertas([], r).length === 0)
  caso('undefined nao explode', dividasAbertas(undefined, r).length === 0)
}

console.log(`\n${falhou ? '❌' : '✅'} ${ok} asserção(ões) passaram, ${falhou} falharam`)
process.exit(falhou ? 1 : 0)
