/**
 * Controle plantado do portão de escopo derivado (`conferir-escopo-derivado.mjs`).
 *
 * 🔑 A regra da casa: um zero só vale se um positivo conhecido é encontrado.
 * Cada caso monta uma base inteira e exige o veredito daquele caso.
 *
 * ⭐ Os casos que mais importam são os NEGATIVOS, e é por eles que se lê. Um
 * portão que reprovasse toda derivação por plano amostral reprovaria também a
 * Veritá, cujo campo SEPARA, e aí não teria medido nada: teria só trocado
 * "conferir os 7" por "reprovar os 7". O caso 1 é esse contraste e o caso 5 é a
 * guarda contra falso positivo em fonte FORTE.
 *
 * ⚠️ O teste roda o SCRIPT, não a função pura, porque o defeito de 04/Set foi no
 * chamador e não na função. → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * Uso:  node scripts/testar-escopo-derivado.mjs
 */

import { mkdtempSync, writeFileSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'

const PORTAO = join(import.meta.dirname, 'conferir-escopo-derivado.mjs')
const HOJE = '2026-09-06'

// Textos reais o bastante para o classificador de verdade decidir sobre eles.
const T = {
  metEstadual: 'Universo: eleitores do estado de Minas Gerais, com 16 anos ou mais.',
  metNacional: 'Universo: eleitorado brasileiro apto, residente no Brasil, com 16 anos ou mais.',
  // A metodologia que não nomeia universo nenhum, que é a da Real Time.
  metMuda:
    'Pesquisa quantitativa com eleitores do universo a ser explorado, feita em combinacao mista ' +
    'por entrevistadores humanos e recursos de inteligencia artificial, com questionario estruturado.',
  planoNacional:
    'A pesquisa foi planejada para produzir uma amostra estatisticamente representativa do ' +
    'eleitorado brasileiro, utilizando o metodo de Probabilidade Proporcional ao Tamanho.',
  planoEstadual:
    'A pesquisa foi planejada para produzir uma amostra representativa do eleitorado do estado ' +
    'de Minas Gerais, com cotas de sexo, faixa etaria e grau de instrucao.',
}

let seq = 0
const reg = (o = {}) => {
  seq++
  return {
    protocolo: `BR${String(10000 + seq).padStart(9, '0')}`,
    institute: 'Instituto X',
    cnpj: '00000000000191',
    sampleSize: 1600,
    fieldStart: '2026-09-04',
    fieldEnd: '2026-09-08',
    publicationDate: '2026-09-09',
    methodology: T.metEstadual,
    samplingPlan: T.planoEstadual,
    scope: 'state',
    scopeSource: 'methodology',
    ...o,
  }
}

/** n registros estaduais de uma casa, com o plano amostral que se quer testar. */
const estaduais = (n, casa, plano) =>
  Array.from({ length: n }, () =>
    reg({ institute: casa.nome, cnpj: casa.cnpj, samplingPlan: plano, methodology: T.metEstadual }),
  )

const CASA_CEGA = { nome: 'Real Time Big Data', cnpj: '11111111000111' }
const CASA_BOA = { nome: 'Verita', cnpj: '22222222000122' }
const CASA_SEM_BASE = { nome: 'PoderData', cnpj: '33333333000133' }

/** O registro no centro do caso: nacional derivado do PLANO, metodologia muda. */
const nacionalPorPlano = (casa, o = {}) =>
  reg({
    institute: casa.nome,
    cnpj: casa.cnpj,
    methodology: T.metMuda,
    samplingPlan: T.planoNacional,
    scope: 'national',
    scopeSource: 'sampling_plan',
    ...o,
  })

const CASOS = [
  {
    nome: '1· NEGATIVO, a casa cujo plano SEPARA: nacional por plano passa',
    aprova: true,
    exige: 'Nenhum rótulo nacional apoiado em campo sem sustentação',
    base: [...estaduais(41, CASA_BOA, T.planoEstadual), nacionalPorPlano(CASA_BOA, { sampleSize: 40500 })],
  },
  {
    nome: '2· GRAVE e VIVO: plano cego e o registro está no calendário',
    aprova: false,
    exige: 'NO CALENDÁRIO VIVO',
    base: [...estaduais(23, CASA_CEGA, T.planoNacional), nacionalPorPlano(CASA_CEGA)],
  },
  {
    nome: '3· o MESMO defeito já vencido: aparece, mas não trava a publicação',
    aprova: true,
    exige: 'já vencido',
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA, {
        fieldStart: '2026-08-20',
        fieldEnd: '2026-08-24',
        publicationDate: '2026-08-25',
      }),
    ],
  },
  {
    nome: '4· SEM_BASE: casa sem nenhuma estadual vira AVISO, não reprovação',
    aprova: true,
    exige: 'SEM_BASE',
    base: [nacionalPorPlano(CASA_SEM_BASE, { sampleSize: 3000 })],
  },
  {
    nome: '5· NEGATIVO decisivo: em casa CEGA, nacional por METODOLOGIA não é flagrado',
    aprova: true,
    exige: 'Nenhum rótulo nacional apoiado em campo sem sustentação',
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      reg({
        institute: CASA_CEGA.nome,
        cnpj: CASA_CEGA.cnpj,
        methodology: T.metNacional,
        samplingPlan: T.planoNacional,
        scope: 'national',
        scopeSource: 'methodology',
      }),
    ],
  },
  {
    nome: '6· casa CEGA sem nenhum nacional derivado: nada a reprovar',
    aprova: true,
    exige: 'Nenhum rótulo nacional apoiado em campo sem sustentação',
    base: estaduais(23, CASA_CEGA, T.planoNacional),
  },
  {
    nome: '7· vivo pelo CAMPO ABERTO, com a divulgação já passada',
    aprova: false,
    exige: 'NO CALENDÁRIO VIVO',
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA, {
        fieldStart: '2026-09-02',
        fieldEnd: '2026-09-10',
        publicationDate: '2026-09-01',
      }),
    ],
  },
  {
    nome: '8· o defeito REAL de 06/Set: 23 estaduais e 3 nacionais na Real Time',
    aprova: false,
    exige: '3 grave(s)',
    base: [
      ...estaduais(21, CASA_CEGA, T.planoNacional),
      ...estaduais(2, CASA_CEGA, T.planoNacional).map((r) => ({ ...r, sampleSize: 2000 })),
      nacionalPorPlano(CASA_CEGA, { sampleSize: 1600, publicationDate: '2026-09-09' }),
      nacionalPorPlano(CASA_CEGA, { sampleSize: 2000, publicationDate: '2026-09-01', fieldEnd: '2026-08-31' }),
      nacionalPorPlano(CASA_CEGA, { sampleSize: 2000, publicationDate: '2026-08-31', fieldEnd: '2026-08-29' }),
    ],
  },
  {
    // A prova de que a boa não caiu junto é a CONTAGEM: são 2 candidatas a
    // flagrar, uma por casa, e só 1 pode virar achado.
    nome: '9· duas casas juntas: a cega reprova sem derrubar a boa',
    aprova: false,
    exige: '1 rótulo(s) NACIONAL',
    base: [
      ...estaduais(41, CASA_BOA, T.planoEstadual),
      nacionalPorPlano(CASA_BOA, { sampleSize: 40500 }),
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA),
    ],
  },
  {
    nome: '10· FALHA FECHADA: base vazia não é aprovação',
    aprova: false,
    exige: 'nada a conferir não é aprovação',
    base: [],
  },
  {
    // 🔴 Este caso nasceu de uma MUTAÇÃO que os 10 primeiros não pegaram: fazer a
    // base aceitar também os NACIONAIS de fonte forte. Em toda casa plantada até
    // aqui, ou havia estaduais, ou havia um registro só, e nos dois a mutação dava
    // o mesmo resultado. Ela só muda o veredito na casa SEM estadual e COM nacional
    // de fonte forte: a base deixaria de ser vazia, o plano nacional dela contaria
    // como mentira, e um AVISO viraria REPROVAÇÃO. Falso positivo é o defeito mais
    // caro num portão, porque ensina a ignorá-lo.
    nome: '11· casa sem estadual mas com nacional FORTE: segue SEM_BASE, não vira grave',
    aprova: true,
    exige: 'SEM_BASE',
    base: [
      reg({
        institute: CASA_SEM_BASE.nome,
        cnpj: CASA_SEM_BASE.cnpj,
        methodology: T.metNacional,
        samplingPlan: T.planoNacional,
        scope: 'national',
        scopeSource: 'methodology',
      }),
      nacionalPorPlano(CASA_SEM_BASE, { sampleSize: 3000 }),
    ],
  },
  {
    // 🔴 Segundo caso nascido de mutação: trocar "MENTIU AO MENOS UMA VEZ" por
    // "mentiu em TODAS". Nas casas plantadas até aqui o plano mentia em 100% das
    // estaduais, então as duas regras davam o mesmo veredito e a mutação passava
    // batida. A regra da casa é UMA mentira basta: um campo que já chamou de
    // nacional uma estadual conhecida não sustenta rótulo nenhum, e exigir
    // unanimidade deixaria passar justamente a casa de boilerplate irregular,
    // que é a mais difícil de perceber a olho.
    nome: '12· plano que mente em ALGUMAS estaduais, não em todas, ainda é CEGO',
    aprova: false,
    exige: 'CEGO',
    base: [
      ...estaduais(17, CASA_CEGA, T.planoEstadual),
      ...estaduais(3, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA),
    ],
  },
]

const dir = mkdtempSync(join(tmpdir(), 'afos-escopo-'))
let falhas = 0

for (const caso of CASOS) {
  const alvo = join(dir, 'base.json')
  writeFileSync(alvo, JSON.stringify({ data: caso.base }), 'utf8')

  let saida = ''
  let codigo = 0
  try {
    saida = execFileSync('node', [PORTAO, `--arquivo=${alvo}`, `--hoje=${HOJE}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (e) {
    saida = `${e.stdout ?? ''}${e.stderr ?? ''}`
    codigo = e.status ?? -1
  }

  const aprovou = codigo === 0 && saida.includes('VEREDITO: APROVADO')
  let ok = aprovou === caso.aprova
  let motivo = ok ? '' : `esperava ${caso.aprova ? 'APROVADO' : 'REPROVADO'}, saiu com código ${codigo}`
  if (ok && caso.exige && !saida.includes(caso.exige)) {
    ok = false
    motivo = `veredito certo, mas sem dizer "${caso.exige}"` // acertar pelo motivo errado não conta
  }

  console.log(`${ok ? '✅' : '❌'} ${caso.nome}${ok ? '' : `  → ${motivo}`}`)
  if (!ok) falhas++
}

rmSync(dir, { recursive: true, force: true })

console.log(
  `\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${CASOS.length - falhas}/${CASOS.length} casos corretos\n`,
)
process.exit(falhas === 0 ? 0 : 1)
