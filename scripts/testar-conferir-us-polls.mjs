/**
 * Controle plantado do portão do generic ballot (`conferir-us-polls.mjs`).
 *
 * 🔑 A regra da casa: um zero só vale se um positivo conhecido é encontrado. Um
 * portão que nunca reprovou é indistinguível de um portão que parou de
 * funcionar. Cada caso abaixo monta um par (base, atual) com UM defeito plantado
 * e exige que o portão reprove por AQUELE motivo.
 *
 * ⭐ Os dois casos que mais importam são os NEGATIVOS, e é por eles que se
 * começa a ler: o arquivo limpo e o RECORTE LEGÍTIMO do instituto. Sem eles, um
 * portão que reprova tudo passaria em todos os outros, e um portão histérico é
 * pior que nenhum, porque ensina o operador a ignorá-lo.
 *
 * Uso:  node scripts/testar-conferir-us-polls.mjs
 */

import { mkdtempSync, writeFileSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'

const PORTAO = join(import.meta.dirname, 'conferir-us-polls.mjs')

const linha = (o = {}) => ({
  instituto: 'Instituto X',
  campoInicio: '2026-08-10',
  campoFim: '2026-08-12',
  amostra: 1500,
  amostraTipo: 'RV',
  margemErro: 2.5,
  dem: 47,
  rep: 41,
  outros: 12,
  vantagemDem: 6,
  fontePrimaria: 'https://exemplo.org/x',
  ...o,
})

/** Recorte legítimo: indeciso fora de "outros", soma 94, campos nos lugares. */
const RECORTE_LEGITIMO = linha({
  instituto: 'RMG Research',
  campoInicio: '2026-04-06',
  campoFim: '2026-04-09',
  dem: 45,
  rep: 42,
  outros: 7,
  amostra: 2000,
  margemErro: 2.2,
})

const arquivo = (polls, extra = {}) => ({
  lastUpdate: '2026-09-04',
  polls,
  qualidade: {
    linhasLidas: polls.length,
    publicadas: polls.length,
    descartadas: 0,
    descartadasPorForma: 0,
    descartadasPorValor: 0,
    semFontePrimaria: 0,
    ...(extra.qualidade ?? {}),
  },
  mediaAfos:
    extra.mediaAfos === null
      ? null
      : {
          janelaDias: 30,
          desde: '2026-08-05',
          nPesquisas: polls.length,
          nInstitutos: 1,
          dem: 47,
          rep: 41,
          vantagemDem: 6,
          metodo: 'média aritmética simples',
          institutos: ['Instituto X'],
          ...(extra.mediaAfos ?? {}),
        },
})

const BASE_LIMPA = arquivo([linha(), linha({ campoFim: '2026-08-13' }), RECORTE_LEGITIMO])

const CASOS = [
  {
    nome: '⭐ limpo (controle NEGATIVO: tem de APROVAR)',
    base: BASE_LIMPA,
    atual: BASE_LIMPA,
    aprova: true,
  },
  {
    nome: '⭐ recorte LEGÍTIMO do instituto não pode reprovar',
    // Soma 94 com amostra e margem nos campos delas. Já estava na base.
    base: BASE_LIMPA,
    atual: arquivo([linha(), linha({ campoFim: '2026-08-13' }), RECORTE_LEGITIMO]),
    aprova: true,
  },
  {
    nome: 'colapso: publicadas foi a ZERO',
    base: BASE_LIMPA,
    atual: arquivo([], { mediaAfos: null }),
    aprova: false,
    exige: 'COLAPSO',
  },
  {
    nome: 'colapso: publicadas caiu para menos da METADE',
    base: arquivo(Array.from({ length: 10 }, () => linha())),
    atual: arquivo([linha(), linha()]),
    aprova: false,
    exige: 'COLAPSO',
  },
  {
    nome: 'colapso: mediaAfos veio NULA com o arquivo cheio',
    base: BASE_LIMPA,
    atual: arquivo([linha(), linha()], { mediaAfos: null }),
    aprova: false,
    exige: 'COLAPSO',
  },
  {
    nome: '🔴 o defeito REAL de 01/Ago: amostra e margem viraram intenção de voto',
    // "Big Data Poll · D 914 x R 3,2": 914 era a amostra, 3,2 a margem de erro.
    base: BASE_LIMPA,
    atual: arquivo([
      linha(),
      linha({ instituto: 'Big Data Poll', dem: 914, rep: 3.2, outros: 0, amostra: 914, margemErro: 3.2 }),
    ]),
    aprova: false,
    exige: 'CONTAMINAÇÃO',
  },
  {
    nome: 'deslize SUTIL: valores plausíveis, mas a margem aparece como "outros"',
    // A régua de valor NÃO pega: 47, 41 e 2.5 estão todos entre 15 e 70 ou são
    // outros. Quem pega é a soma, que desanda para 90,5.
    base: BASE_LIMPA,
    atual: arquivo([linha(), linha({ instituto: 'Casa Y', outros: 2.5, margemErro: 2.5 })]),
    aprova: false,
    exige: 'CONTAMINAÇÃO',
  },
  {
    nome: '🔴 deslize na ÚLTIMA linha de uma base longa (varre TODAS, não as 5 primeiras)',
    // O defeito do conferidor ANTERIOR era olhar as 5 primeiras, que são sempre
    // as mais recentes e as mais bem formatadas. Coluna deslizada aparece onde a
    // origem mudou de formato, e isso é no meio ou no FIM da tabela. Sem este
    // caso, um portão que varresse só o topo passaria em todos os outros sete.
    base: arquivo(Array.from({ length: 40 }, (_, i) => linha({ campoFim: `2026-07-${String((i % 28) + 1).padStart(2, '0')}` }))),
    atual: arquivo([
      ...Array.from({ length: 40 }, (_, i) => linha({ campoFim: `2026-07-${String((i % 28) + 1).padStart(2, '0')}` })),
      linha({ instituto: 'Casa Do Fim', dem: 914, rep: 3.2, outros: 0, amostra: 914, margemErro: 3.2 }),
    ]),
    aprova: false,
    exige: 'CONTAMINAÇÃO',
  },
  {
    nome: 'CRESCEU o número de somas fora da faixa (origem mudou de formato)',
    // Nenhuma linha isolada tem assinatura de deslize, e mesmo assim reprova,
    // porque o que denuncia mudança de formato é o crescimento contra a base.
    base: BASE_LIMPA,
    atual: arquivo([
      linha(),
      linha({ campoFim: '2026-08-13' }),
      RECORTE_LEGITIMO,
      linha({ instituto: 'Casa Z', dem: 44, rep: 40, outros: 5, amostra: 1200, margemErro: 3 }),
    ]),
    aprova: false,
    exige: 'CRESCEU',
  },
  {
    // 🔴 Portão instalado em 04/Set/2026 junto com `mediaAfos.incluidas`: a média
    // DECLARADA tem de sair das linhas que o próprio arquivo declara. Aqui elas
    // dão D+6.00 e o arquivo afirma D+9.00. Arquivo incoerente consigo mesmo
    // passava por todas as outras réguas, porque nenhuma delas olhava para
    // dentro da média.
    nome: '🔴 a média DECLARADA não sai das linhas declaradas',
    base: BASE_LIMPA,
    atual: arquivo([linha(), linha({ campoFim: '2026-08-13' }), RECORTE_LEGITIMO], {
      mediaAfos: {
        dem: 50,
        rep: 41,
        vantagemDem: 9,
        nPesquisas: 2,
        nInstitutos: 1,
        incluidas: [
          { instituto: 'Instituto X', campoFim: '2026-08-20', amostraTipo: 'RV', dem: 47, rep: 41 },
          { instituto: 'Instituto X', campoFim: '2026-08-13', amostraTipo: 'RV', dem: 47, rep: 41 },
        ],
      },
    }),
    aprova: false,
    exige: 'NÃO reproduz',
  },
  {
    // ✅ Controle NEGATIVO do portão acima: com `incluidas` COERENTE ele não pode
    // reprovar, senão o portão novo estaria só dizendo não para tudo.
    nome: '⭐ `incluidas` coerente com a média declarada tem de APROVAR',
    base: BASE_LIMPA,
    atual: arquivo([linha(), linha({ campoFim: '2026-08-13' }), RECORTE_LEGITIMO], {
      mediaAfos: {
        dem: 47,
        rep: 41,
        vantagemDem: 6,
        nPesquisas: 2,
        nInstitutos: 1,
        incluidas: [
          { instituto: 'Instituto X', campoFim: '2026-08-20', amostraTipo: 'RV', dem: 47, rep: 41 },
          { instituto: 'Instituto X', campoFim: '2026-08-13', amostraTipo: 'RV', dem: 47, rep: 41 },
        ],
      },
    }),
    aprova: true,
  },
]

let falhas = 0
for (const caso of CASOS) {
  const dir = mkdtempSync(join(tmpdir(), 'usgate-'))
  const fBase = join(dir, 'base.json')
  const fAtual = join(dir, 'atual.json')
  writeFileSync(fBase, JSON.stringify(caso.base), 'utf8')
  writeFileSync(fAtual, JSON.stringify(caso.atual), 'utf8')

  let saida = ''
  let codigo = 0
  try {
    saida = execFileSync('node', [PORTAO, `--arquivo=${fAtual}`, `--base-arquivo=${fBase}`], {
      encoding: 'utf8',
    })
  } catch (e) {
    saida = (e.stdout ?? '') + (e.stderr ?? '')
    codigo = e.status ?? -1
  }
  rmSync(dir, { recursive: true, force: true })

  const aprovou = codigo === 0 && saida.includes('VEREDITO: APROVADO')
  let ok = aprovou === caso.aprova
  let motivo = ok ? '' : `esperava ${caso.aprova ? 'APROVADO' : 'REPROVADO'}`
  if (ok && caso.exige && !saida.includes(caso.exige)) {
    ok = false
    motivo = `reprovou, mas sem dizer "${caso.exige}"` // reprovar pelo motivo errado não conta
  }

  console.log(`${ok ? '✅' : '❌'} ${caso.nome}${ok ? '' : `  → ${motivo}`}`)
  if (!ok) falhas++
}

console.log(
  `\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${CASOS.length - falhas}/${CASOS.length} casos corretos\n`
)
process.exit(falhas === 0 ? 0 : 1)
