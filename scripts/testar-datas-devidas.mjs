/**
 * 🧪 Casos de `lib/us-press/datas-devidas.mjs`.
 *
 * Metade anti-silencio (a data devida tem de aparecer, e o buraco do meio
 * tambem) e metade anti-excesso (o dia corrente adiado NAO e divida, e arquivo
 * que comeca tarde nao passa a dever o passado inteiro).
 */
import { datasDevidas, somarDias } from '../lib/us-press/datas-devidas.mjs'

let ok = 0
let falhou = 0
const caso = (nome, cond) => {
  if (cond) {
    ok += 1
  } else {
    falhou += 1
    console.log(`  ❌ ${nome}`)
  }
}
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// ── 0. a aritmetica de dia, em UTC ─────────────────────────────────
caso('soma de um dia', somarDias('2026-10-08', 1) === '2026-10-09')
caso('subtracao de um dia', somarDias('2026-10-09', -1) === '2026-10-08')
caso('vira o MES', somarDias('2026-09-30', 1) === '2026-10-01')
caso('volta o mes', somarDias('2026-10-01', -1) === '2026-09-30')
// 🔑 O fuso local desta maquina e UTC-3: fazer a conta com Date local
//    devolveria o dia anterior em toda virada.
caso('nao escorrega por fuso local', somarDias('2026-10-08', 0) === '2026-10-08')

// ── 1. O CASO REAL de 09/Out/2026 as 00:00Z ────────────────────────
// 70 datas de 30/Jul a 07/Out, sem buraco. 08/Out nunca foi arquivada e o dia
// UTC virou. A janela das 19:30Z nao abriu.
const serie = []
for (let d = '2026-07-30'; d <= '2026-10-07'; d = somarDias(d, 1)) serie.push(d)
caso('a serie de referencia tem 70 datas', serie.length === 70)
{
  const r = datasDevidas({ datas: serie, hoje: '2026-10-09', janelaPassou: false })
  caso('o caso real devolve SO 2026-10-08', igual(r, ['2026-10-08']))
  // ⛔ A regressao exata: a versao inline listava o dia corrente.
  caso('e NAO lista 2026-10-09, que esta adiado por desenho', !r.includes('2026-10-09'))
}
{
  const r = datasDevidas({ datas: serie, hoje: '2026-10-09', janelaPassou: true })
  caso('com a janela ABERTA, as duas sao devidas', igual(r, ['2026-10-08', '2026-10-09']))
}

// ── 2. ANTI-EXCESSO: o dia corrente adiado nao e divida ────────────
{
  const comHoje = [...serie, '2026-10-08']
  caso(
    'em dia, janela fechada, nada devido',
    igual(datasDevidas({ datas: comHoje, hoje: '2026-10-09', janelaPassou: false }), [])
  )
  caso(
    'em dia, janela ABERTA, o dia corrente passa a ser devido',
    igual(datasDevidas({ datas: comHoje, hoje: '2026-10-09', janelaPassou: true }), ['2026-10-09'])
  )
  caso(
    'ultima data = hoje, janela fechada, nada devido',
    igual(datasDevidas({ datas: comHoje, hoje: '2026-10-08', janelaPassou: false }), [])
  )
  caso(
    'ultima data = hoje, janela aberta, nada devido',
    igual(datasDevidas({ datas: comHoje, hoje: '2026-10-08', janelaPassou: true }), [])
  )
}

// ── 3. ANTI-EXCESSO: nao se deve o passado antes do inicio ─────────
{
  const curta = ['2026-10-06', '2026-10-07']
  const r = datasDevidas({ datas: curta, hoje: '2026-10-09', janelaPassou: false })
  caso('arquivo que comeca tarde deve so 10-08', igual(r, ['2026-10-08']))
  caso('e nao inventa nada antes do inicio', !r.some((d) => d < '2026-10-06'))
}

// ── 4. ANTI-SILENCIO: buraco no MEIO conta ─────────────────────────
{
  const comBuraco = serie.filter((d) => d !== '2026-09-15' && d !== '2026-08-20')
  const r = datasDevidas({ datas: comBuraco, hoje: '2026-10-09', janelaPassou: false })
  caso('os dois buracos do meio aparecem', r.includes('2026-08-20') && r.includes('2026-09-15'))
  caso('junto com a cauda', r.includes('2026-10-08'))
  caso('e em ORDEM', igual(r, [...r].sort()))
  caso('exatamente tres', r.length === 3)
}

// ── 5. Entrada ruim nao explode e nao fabrica divida ───────────────
caso('sem argumento devolve vazio', igual(datasDevidas(), []))
caso('datas vazias devolve vazio', igual(datasDevidas({ datas: [], hoje: '2026-10-09', janelaPassou: false }), []))
caso('datas undefined devolve vazio', igual(datasDevidas({ hoje: '2026-10-09', janelaPassou: false }), []))
caso('hoje invalido devolve vazio', igual(datasDevidas({ datas: serie, hoje: 'ontem', janelaPassou: false }), []))
caso('hoje ausente devolve vazio', igual(datasDevidas({ datas: serie, janelaPassou: false }), []))
// 📌 Lixo no meio das datas e ignorado, e nao vira inicio da enumeracao.
caso(
  'entrada com lixo ignora o lixo',
  igual(datasDevidas({ datas: ['lixo', ...serie, ''], hoje: '2026-10-09', janelaPassou: false }), ['2026-10-08'])
)
// ⛔ hoje ANTES da primeira data: nada devido, e nao um laco infinito nem lista gigante.
caso(
  'hoje antes do inicio devolve vazio',
  igual(datasDevidas({ datas: serie, hoje: '2026-07-01', janelaPassou: true }), [])
)
// 🔑 janelaPassou ausente conta como FECHADA, que e a direcao que nao acusa
//    atraso falso, igual ao ADIAR do dono da regra.
caso(
  'janelaPassou ausente conta como fechada',
  igual(datasDevidas({ datas: serie, hoje: '2026-10-09' }), ['2026-10-08'])
)

console.log(`\n${falhou ? '❌' : '✅'} ${ok} asserção(ões) passaram, ${falhou} falharam`)
process.exit(falhou ? 1 : 0)
