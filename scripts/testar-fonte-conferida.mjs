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
// Contar entradas quebra a cada conferencia nova e nao diz nada; o tripwire
// que importa e contra a REMOCAO silenciosa de uma divida ja registrada.
caso(
  'nenhuma conferencia registrada desapareceu',
  [
    ['CNN/SSRS', '2026-09-17'],
    ['Emerson College/RealClear Opinion Research', '2026-09-15'],
    ['BGSU/YouGov', '2026-09-01'],
    ['Cygnal (R)', '2026-10-02'],
  ].every(([casa, fim]) => FONTE_CONFERIDA.some((e) => e.instituto === casa && e.campoFim === fim))
)
caso(
  'os 5 resultados previstos',
  Object.keys(RESULTADOS).sort().join(',') ===
    'CONFIRMA,CONFIRMA_PARCIAL,FONTE_INACESSIVEL,NAO_CONTEM_A_PERGUNTA,NAO_ENCONTRADO'
)

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

// ── 5. FONTE_INACESSIVEL: documento LOCALIZADO que nao abriu ────────
// Metade anti-silencio, metade anti-excesso. O erro simetrico deste veredito
// nao e um portao frouxo: e ele VAZAR para entradas cujo documento foi lido,
// porque ai o registro declara bloqueio sobre pagina que abriu.
{
  const inac = () => {
    const r = base()
    r[0].resultado = 'FONTE_INACESSIVEL'
    r[0].confirmado = []
    r[0].naoConfirmado = ['o topline']
    r[0].acesso = { status: 403, medidoEm: '2026-10-08', controlePositivo: 'outro host deu 200 no mesmo minuto' }
    return r
  }
  caso('INACESSIVEL completa passa', conferirCarga(inac()).length === 0)

  // ⛔ ANTI-SILENCIO: sem a medicao do acesso, "inacessivel" e opiniao.
  {
    const r = inac()
    delete r[0].acesso
    caso('INACESSIVEL sem acesso reprova', err(r, 'exige acesso com status'))
  }
  {
    const r = inac()
    r[0].acesso = { status: '403', medidoEm: '2026-10-08', controlePositivo: 'x' }
    caso('status como STRING reprova, a guarda e de TIPO', err(r, 'exige acesso com status'))
  }
  {
    const r = inac()
    delete r[0].acesso.medidoEm
    caso('acesso sem medidoEm reprova', err(r, 'exige acesso com status'))
  }
  {
    const r = inac()
    delete r[0].acesso.controlePositivo
    caso('acesso sem controlePositivo reprova', err(r, 'controlePositivo'))
  }
  {
    const r = inac()
    r[0].naoConfirmado = []
    caso('INACESSIVEL sem dizer o que fica sem confirmacao reprova', err(r, 'SEM confirmação'))
  }
  {
    const r = inac()
    r[0].confirmado = ['o campo']
    caso('INACESSIVEL confirmando algo reprova', err(r, 'não pode confirmar nada'))
  }
  // 🔑 status ZERO e numero: curl devolve 000 quando o host nao resolve, e uma
  // guarda escrita como `!e.acesso.status` rejeitaria o caso de DNS morto, que e
  // justamente um dos que este veredito existe para registrar. Mesma familia do
  // `Number(true)` e `Number(null)` do portao-gravacao.
  {
    const r = inac()
    r[0].acesso.status = 0
    caso('status 0 (host nao resolve) passa, porque 0 e numero', conferirCarga(r).length === 0)
  }

  // ⛔ ANTI-EXCESSO: `acesso` em veredito de documento LIDO e contradicao.
  for (const v of ['CONFIRMA', 'CONFIRMA_PARCIAL', 'NAO_CONTEM_A_PERGUNTA']) {
    const r = base()
    r[0].resultado = v
    if (v === 'CONFIRMA_PARCIAL') r[0].naoConfirmado = ['o recorte']
    if (v === 'NAO_CONTEM_A_PERGUNTA') {
      r[0].confirmado = []
      r[0].naoConfirmado = ['tudo']
    }
    r[0].acesso = { status: 403, medidoEm: '2026-10-08', controlePositivo: 'x' }
    caso(`${v} com acesso reprova, o documento FOI lido`, err(r, 'FOI lido'))
  }
  // 📌 E NAO_ENCONTRADO com acesso NAO reprova, de proposito: um 404 na URL
  // procurada e medicao legitima de busca que nao achou. Este caso existe para a
  // fronteira ser ESCOLHA declarada e nao efeito colateral de uma lista.
  {
    const r = base()
    r[0].resultado = 'NAO_ENCONTRADO'
    r[0].confirmado = []
    r[0].naoConfirmado = ['tudo']
    r[0].acesso = { status: 404, medidoEm: '2026-10-08', controlePositivo: 'x' }
    caso('NAO_ENCONTRADO com acesso passa, e isso e escolha', conferirCarga(r).length === 0)
  }

  // 🔒 A TRAVA QUE IMPORTA MAIS: dívida inacessível e dívida ABERTA. Se alguem
  // algum dia a tratar como fechada, para o contador parar de cobrar, isto cai.
  {
    const r = inac()
    caso('INACESSIVEL e divida ABERTA', dividasAbertas([linha()], r).length === 1)
  }
  // E a entrada REAL da Cygnal tem de aparecer como divida sobre a linha real.
  {
    const real = { instituto: 'Cygnal (R)', campoInicio: '2026-10-01', campoFim: '2026-10-02', dem: 52, rep: 43 }
    caso('a Cygnal real sai como divida aberta', dividasAbertas([real]).length === 1)
    caso(
      'e CADUCA se o indice reescrever o valor',
      dividasAbertas([{ ...real, dem: 53 }]).length === 0
    )
  }
}

console.log(`\n${falhou ? '❌' : '✅'} ${ok} asserção(ões) passaram, ${falhou} falharam`)
process.exit(falhou ? 1 : 0)
