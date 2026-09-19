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
// A função pura, só para o anti-silêncio de TIPO do conjunto de fantasmas.
// O resto do arquivo roda o SCRIPT de propósito, porque o defeito de 04/Set foi
// no chamador e não na regra.
import { conferirEscopoDerivado } from '../lib/tse/poder-discriminante.mjs'

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
  // 👻 OS QUATRO CASOS DO FANTASMA, de 19/Set/2026.
  //
  // 🔴 O defeito que eles pegam: "calendário vivo" era só comparação de DATA, e
  // a data vem do nosso banco, que nunca apaga. O TSE RETIRA. No dia, a
  // BR005482026 da Real Time saiu do registro na MESMA rodada em que este portão
  // a imprimiu como NO CALENDÁRIO VIVO, e o veredito fechou "2 no calendário
  // vivo" quando o vivo era 1. O código de saída estava certo por acaso, porque
  // o OUTRO grave era real; a FRASE é que era falsa.
  {
    nome: '13· GRAVE com divulgação à frente, mas RETIRADO do TSE: não é calendário vivo',
    aprova: true,
    exige: 'já RETIRADO do registro',
    fantasmas: ['BR099999001'],
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA, { protocolo: 'BR099999001', publicationDate: '2026-09-20' }),
    ],
  },
  {
    // O contraste que prova que quem muda o veredito é o CONJUNTO, e não a data.
    // Base idêntica à do 13, sem o conjunto: volta a reprovar, como antes.
    nome: '14· a MESMA base sem o conjunto de fantasmas volta a reprovar',
    aprova: false,
    exige: 'NO CALENDÁRIO VIVO',
    semFantasmas: true,
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA, { protocolo: 'BR099999001', publicationDate: '2026-09-20' }),
    ],
  },
  {
    // ⚠️ O portão que NÃO PODE CALAR. Fantasma é reversível: protocolo volta ao
    // arquivo. Conjunto de ONTEM chamaria de retirado um registro que voltou, e
    // aí o rótulo vivo passaria em silêncio. Conjunto velho é DESCARTADO.
    nome: '15· conjunto de fantasmas de OUTRO dia é descartado, e o portão volta a alarmar',
    aprova: false,
    exige: 'NÃO usado',
    fantasmas: ['BR099999001'],
    fantasmasQuando: '2026-09-05T12:00:00.000Z',
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA, { protocolo: 'BR099999001', publicationDate: '2026-09-20' }),
    ],
  },
  {
    // O caso real de 19/Set/2026, com os dois graves da Real Time: um retirado
    // naquele dia e um ainda no registro. Reprova, e a CONTA sai 1, não 2.
    nome: '16· dois graves, um retirado e um vivo: reprova e conta 1 vivo, não 2',
    aprova: false,
    exige: '1 no calendário vivo',
    fantasmas: ['BR099999001'],
    base: [
      ...estaduais(23, CASA_CEGA, T.planoNacional),
      nacionalPorPlano(CASA_CEGA, { protocolo: 'BR099999001', publicationDate: '2026-09-20' }),
      nacionalPorPlano(CASA_CEGA, { protocolo: 'BR099999002', publicationDate: '2026-09-21' }),
    ],
  },
]

const dir = mkdtempSync(join(tmpdir(), 'afos-escopo-'))
let falhas = 0

for (const caso of CASOS) {
  const alvo = join(dir, 'base.json')
  writeFileSync(alvo, JSON.stringify({ data: caso.base }), 'utf8')

  // O conjunto de fantasmas entra por arquivo, porque o teste roda o SCRIPT.
  // Sem `fantasmas` nem `semFantasmas`, o caso não passa a bandeira e o script
  // lê o arquivo do projeto, que num caso plantado não tem nenhum destes
  // protocolos: é o mesmo efeito de conjunto vazio, e os 12 casos antigos
  // seguem medindo o que sempre mediram.
  const extras = []
  if (caso.semFantasmas) {
    extras.push('--sem-fantasmas')
  } else if (caso.fantasmas) {
    const ghosts = join(dir, 'fantasmas.jsonl')
    writeFileSync(
      ghosts,
      JSON.stringify({
        quando: caso.fantasmasQuando ?? `${HOJE}T12:00:00.000Z`,
        total: caso.fantasmas.length,
        protocolos: caso.fantasmas,
      }) + '\n',
      'utf8',
    )
    extras.push(`--fantasmas=${ghosts}`)
  }

  let saida = ''
  let codigo = 0
  try {
    saida = execFileSync('node', [PORTAO, `--arquivo=${alvo}`, `--hoje=${HOJE}`, ...extras], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (e) {
    saida = `${e.stdout ?? ''}${e.stderr ?? ''}`
    codigo = e.status ?? -1
  }

  const aprovou = codigo === 0 && saida.includes('VEREDITO: APROVADO')
  // 17/Set/2026: "não aprovou" aceitava QUALQUER saída diferente de zero,
  // inclusive o script travado. Reprovar exige o código do GRAVE e o veredito.
  const reprovou = codigo === 1 && saida.includes('VEREDITO: REPROVADO')
  let ok = caso.aprova ? aprovou : reprovou
  let motivo = ok ? '' : `esperava ${caso.aprova ? 'APROVADO' : 'REPROVADO'}, saiu com código ${codigo}`
  if (ok && caso.exige && !saida.includes(caso.exige)) {
    ok = false
    motivo = `veredito certo, mas sem dizer "${caso.exige}"` // acertar pelo motivo errado não conta
  }

  console.log(`${ok ? '✅' : '❌'} ${caso.nome}${ok ? '' : `  → ${motivo}`}`)
  if (!ok) falhas++
}

// NÃO LEU sai 4 e nunca veste o veredito de rótulo. 🔴 Medido em 17/Set/2026:
// numa rede com inspeção de TLS o fetch lançou, o processo saiu com 1 e a rodada
// anunciou "GRAVE no calendário vivo" sobre uma medição que não aconteceu.
const vazio = join(dir, 'vazio.json')
writeFileSync(vazio, '[]')
const LEITURAS = [
  { nome: 'arquivo inexistente sai NAO LEU (4), não GRAVE', args: [`--arquivo=${join(dir, 'nao-existe.json')}`] },
  { nome: '10· FALHA FECHADA, base sem linhas sai NAO LEU (4): não é aprovação nem GRAVE', args: [`--arquivo=${vazio}`] },
  { nome: 'rede recusada sai NAO LEU (4), não GRAVE', args: ['--base=http://127.0.0.1:9'] },
]
for (const caso of LEITURAS) {
  let saida = ''
  let codigo = 0
  try {
    saida = execFileSync('node', [PORTAO, ...caso.args, `--hoje=${HOJE}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    saida = `${e.stdout ?? ''}${e.stderr ?? ''}`
    codigo = e.status ?? -1
  }
  const ok = codigo === 4 && saida.includes('NÃO LEU') && !saida.includes('VEREDITO')
  console.log(`${ok ? '✅' : '❌'} ${caso.nome}${ok ? '' : `  → código ${codigo}`}`)
  if (!ok) falhas++
}
// 🕳️ ANTI-SILÊNCIO DE TIPO, na função pura. Um Array de protocolos passado no
// lugar do Set não explodiria: `instanceof Set` daria falso e o conjunto sumiria
// CALADO, devolvendo exatamente o comportamento antigo com a aparência do novo.
// É o defeito voltando pela porta dos fundos, e ele tem de gritar.
const TIPOS = [
  { nome: 'Array de protocolos no lugar de Set EXPLODE, não some calado', valor: ['BR099999001'] },
  { nome: 'objeto qualquer no lugar de Set EXPLODE', valor: { has: () => true } },
  { nome: 'string no lugar de Set EXPLODE', valor: 'BR099999001' },
]
for (const t of TIPOS) {
  let lancou = false
  try {
    conferirEscopoDerivado([], { hoje: HOJE, fantasmas: t.valor })
  } catch {
    lancou = true
  }
  console.log(`${lancou ? '✅' : '❌'} ${t.nome}`)
  if (!lancou) falhas++
}
// E os dois valores que querem dizer DESCONHECIDO seguem aceitos, senão o
// anti-silêncio viraria um portão que não deixa ninguém passar.
for (const [nome, valor] of [
  ['null é DESCONHECIDO e passa', null],
  ['ausente é DESCONHECIDO e passa', undefined],
]) {
  let ok = true
  try {
    conferirEscopoDerivado([], { hoje: HOJE, fantasmas: valor })
  } catch {
    ok = false
  }
  console.log(`${ok ? '✅' : '❌'} ${nome}`)
  if (!ok) falhas++
}

const TOTAL = CASOS.length + LEITURAS.length + TIPOS.length + 2

rmSync(dir, { recursive: true, force: true })

console.log(
  `\n${falhas === 0 ? '✅' : '❌'} VEREDITO DO TESTE: ${TOTAL - falhas}/${TOTAL} casos corretos\n`,
)
process.exit(falhas === 0 ? 0 : 1)
