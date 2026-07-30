/**
 * Deriva os mapas EN/ES do rebaseline de 19:50 a partir das traduções de 18:47.
 *
 * POR QUE DERIVAR EM VEZ DE RETRADUZIR
 * O rebaseline mudou 48 campos, mas dentro deles mudou pouco: números, o
 * enquadramento do vídeo de IA, a data do ato do Mendonça e o aval do Tarcísio.
 * Retraduzir 26 KB de prosa para trocar isso cria risco sem necessidade, e é o
 * mesmo raciocínio do reaproveitamento por texto de origem do build-locale-json.
 * Aqui o reaproveitamento é por CAMPO, com as mesmas trocas aplicadas na língua
 * de destino. O gate numérico do construtor confere o resultado.
 *
 * Uso: npx tsx scripts/locale-maps/derive-29jul-1950.ts   (só imprime o que sobrou)
 */
import { readFileSync, writeFileSync } from 'fs'

type Loc = 'en' | 'es'

const CAMINHOS: Record<string, string[]> = {
  'analysis-data': [
    'cards.sentimento.text3', 'cards.sentimento.direita', 'cards.sentimento.terceiraVia',
    'cards.sentimento.polymarket', 'cards.inss.text3', 'cards.inss.text4', 'cards.inss.impactoGestao',
    'cards.inss.conclusao', 'cards.bancoMaster.text1', 'cards.bancoMaster.text3',
    'cards.bancoMaster.conclusao', 'cards.stf.moraes', 'cards.stf.mendonca', 'cards.stf.analise',
  ],
  'analysis-criteriosa': [
    'subtitle', 'candidates[1].fortes[3]', 'candidates[1].fracos[3]', 'candidates[1].analise',
    'candidates[2].header', 'candidates[2].fortes[1]', 'candidates[2].fracos[0]', 'candidates[2].fracos[2]',
    'candidates[2].analise', 'candidates[3].header', 'candidates[3].subtitle', 'candidates[3].caiado.fortes',
    'candidates[3].haddad.label', 'candidates[3].haddad.fortes', 'candidates[3].analise', 'candidates[3].fortes[2]',
    'quadroComparativo[0].s', 'quadroComparativo[1].t', 'quadroComparativo[2].m', 'quadroComparativo[2].t',
    'quadroComparativo[2].s', 'quadroComparativo[3].s', 'quadroComparativo[5].m', 'quadroComparativo[5].t',
    'quadroComparativo[5].s', 'cruzamento',
  ],
  'polls-data': [
    'polymarketComparison.note', 'polymarketComparison.sources',
    'polymarketComparison.candidates[1].tendenciaPolymarket',
    'polymarketComparison.candidates[2].polymarket',
    'polymarketComparison.candidates[2].tendenciaPolymarket',
    'polymarketComparison.candidates[3].tendenciaPesquisa',
    'polymarketComparison.candidates[4].tendenciaPesquisa',
    'polymarketComparison.candidates[6].tendenciaPolymarket',
  ],
}

function valorEm(raiz: any, caminho: string): any {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (const p of partes) v = v?.[p]
  return v
}

/** Trocas numéricas: EN usa ponto decimal, ES vírgula como o português. */
function numericas(loc: Loc): Array<[string, string]> {
  const d = loc === 'en' ? '.' : ','
  const n = (s: string) => s.replace(/,/g, d)
  const mil = loc === 'en' ? 'USD 80,000' : 'USD 80.000'
  const mil2 = loc === 'en' ? 'USD 81,000' : 'USD 81.000'
  return [
    // Renan
    [n('0,15pp'), n('0,05pp')],
    [n('8,60%'), n('8,70%')],
    [n('0,80pp'), n('0,90pp')],
    // 2º lugar
    [n('78,00%'), n('78,50%')],
    [n('11,75%'), n('11,70%')],
    [n('0,40pp'), n('0,45pp')],
    [n('1,20%'), n('1,15%')],
    [n('0,35pp, para 1,15%'), n('0,30pp, para 1,15%')],
    [n('0,35pp to 1,15%'), n('0,30pp to 1,15%')],
    [n('0,35pp, a 1,15%'), n('0,30pp, a 1,15%')],
    // Tereza
    [n('0,20% (alta 0,05pp)'), n('0,25% (alta 0,10pp)')],
    [n('0,20% (up 0,05pp)'), n('0,25% (up 0,10pp)')],
    [n('0,20% (alza 0,05pp)'), n('0,25% (alza 0,10pp)')],
    // Inflação
    [n('34,70%'), n('34,90%')],
    [n('37,95%'), n('38,30%')],
    [n('3,55%'), n('4,10%')],
    [mil, mil2],
    // STF
    [n('2,85%'), n('3,35%')],
    // Horário
    ['21:47', '22:50'],
    ['18:47', '19:50'],
  ]
}

const ad = JSON.parse(readFileSync('public/analysis-data.json', 'utf-8'))
const relatorio: string[] = []

for (const loc of ['en', 'es'] as Loc[]) {
  const mapas: Record<string, Record<string, string>> = {}
  for (const [arq, paths] of Object.entries(CAMINHOS)) {
    const antigo = JSON.parse(readFileSync(`public/${arq}.${loc}.json`, 'utf-8'))
    const mapa: Record<string, string> = {}
    for (const p of paths) {
      const base = valorEm(antigo, p)
      if (typeof base !== 'string') { relatorio.push(`[${loc}/${arq}] ${p}: sem base traduzida`); continue }
      let t = base
      for (const [de, para] of numericas(loc)) t = t.split(de).join(para)
      mapa[p] = t
    }
    mapas[arq] = mapa
  }
  writeFileSync(
    `scripts/locale-maps/_derivado.${loc}.json`,
    JSON.stringify(mapas, null, 2) + '\n',
    'utf-8',
  )
  console.log(`✅ scripts/locale-maps/_derivado.${loc}.json escrito`)
}

// ------------------- o que a derivação NÃO resolve -------------------
// Frases novas do rebaseline (trava em 3 rodadas, Michelle faixa, correções de
// enquadramento) não existem na base traduzida e têm de ser escritas à mão.
const PENDENTE_MANUAL = [
  'trava rodou TRÊS vezes / three rounds',
  'Michelle FAIXA 0,35% a 0,55%',
  'vídeo de IA: NÃO SE OPÕE + hipótese de deep fake',
  'Tarcísio liberou em 28/Jul e segue com Flávio',
  'Mendonça: decisão de MAIO, via MLAT/DRCI',
  'STF: direção acompanhou o acúmulo (era imobilidade)',
]
console.log('\n⚠️  Ainda precisa de redação manual em EN e ES:')
for (const p of PENDENTE_MANUAL) console.log('   - ' + p)
if (relatorio.length) { console.log('\n⚠️  avisos:'); for (const r of relatorio) console.log('   ' + r) }
