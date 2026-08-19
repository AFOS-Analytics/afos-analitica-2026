/**
 * Terceira passada do /atualizar de 30/Jul.
 *
 * O validador acusou "INCONSISTENTE" em duas frases minhas. Ele está CERTO em
 * acusar: a construção "para X% (vol ...)" é o idioma do preço de VENCEDOR, e eu
 * a usei para falar de sub-mercado (2º e 3º lugar). A frase estava correta no
 * conteúdo e ambígua na forma. Quem corrige é o texto, não o validador.
 *
 * Também declara a janela dos dois superlativos de volume que ficaram sem escopo.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const P_PD = 'public/polls-data.json'
const erros: string[] = []
const oPd = JSON.parse(readFileSync(P_PD, 'utf-8'))

const TROCAS: Array<[string, string, string]> = [
  [
    'Flávio Bolsonaro',
    'SOBE 0,50pp no 2º lugar do 1º turno, para 79,00% (vol USD 215 mil), a maior marca dele naquele contrato no acompanhamento do painel',
    'SOBE 0,50pp no book de 2º lugar do 1º turno, que passa a 79,00% num contrato de USD 215 mil, a maior marca dele ali no acompanhamento do painel',
  ],
  [
    'Renan Santos',
    'o book de 3º lugar SUBIU 0,50pp, para 62,00% (vol USD 164 mil)',
    'o book de 3º lugar SUBIU 0,50pp e passa a 62,00% num contrato de USD 164 mil',
  ],
  [
    'Renan Santos',
    'Mantém o maior volume acumulado entre os nomes competitivos do presidencial.',
    'Mantém, nesta captura, o maior volume acumulado entre os nomes competitivos do presidencial, USD 8,59M, acima de Lula e de Flávio.',
  ],
  [
    'Tarcísio',
    'com o maior volume acumulado entre todos os nomes com preço vivo no book nesta captura, USD 13,66M',
    'com o volume acumulado mais alto do book presidencial nesta captura, USD 13,66M',
  ],
]

for (const [nome, de, para] of TROCAS) {
  const c = oPd.polymarketComparison.candidates.find((x: any) => x.name === nome)
  if (!c) { erros.push(`candidato não encontrado: ${nome}`); continue }
  if (!c.tendenciaPolymarket.includes(de)) {
    erros.push(`trecho não encontrado em ${nome}.tendenciaPolymarket: "${de.slice(0, 60)}…"`)
    continue
  }
  c.tendenciaPolymarket = c.tendenciaPolymarket.split(de).join(para)
}

if (erros.length) {
  console.error('❌ ABORTADO, nada foi escrito:')
  for (const e of erros) console.error('   • ' + e)
  process.exit(1)
}

writeFileSync(P_PD, JSON.stringify(oPd, null, 2) + '\n', 'utf-8')
console.log('✅ 4 frases reescritas para não usar o idioma de preço de vencedor em sub-mercado.')
