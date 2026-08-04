/**
 * Remove CPF de pessoa física do registro público do TSE antes de ele ir para o
 * Hugging Face.
 *
 * ⛔ POR QUE ISTO EXISTE (04/Ago/2026): a salvaguarda do `export-hf-dataset.mjs`
 * é DB-FREE, ou seja, protege a tabela de assinantes. Ela não olha o CONTEÚDO do
 * que vem do TSE. E o TSE publica, dentro do texto livre de `methodology` e
 * `sampling_plan`, o CPF do estatístico responsável. Dado público na origem não
 * deixa de ser dado pessoal quando republicado em massa num dataset aberto.
 *
 * 🧮 O QUE SAI E O QUE FICA:
 *   SAI  o CPF de pessoa física (11 dígitos), em qualquer formatação.
 *   FICA o CNPJ (14 dígitos), que identifica empresa e não pessoa. Cuidado real:
 *        o TSE rotula o campo como "CNPJ/CPF" e preenche com CNPJ. Redigir por
 *        rótulo apagaria o identificador do instituto, que é justamente o que dá
 *        auditabilidade ao dataset.
 *   FICA o NOME do estatístico, que é atuação profissional e já é campo próprio
 *        (`statistician`). É ele que permite auditar quem assinou a pesquisa.
 *
 * Uso: node scripts/redigir-cpf-tse-registry.mjs [--check]
 *   --check  não escreve, só relata (exit 1 se achar CPF)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CHECK = process.argv.includes('--check')
const DIR = join(process.cwd(), 'hf-assets', 'polls')
const ARQS = ['tse-registry.csv', 'tse-registry.json']

// 11 dígitos = CPF. 14 = CNPJ, não mexe. O \d{14} na alternativa da frente
// consome o CNPJ antes de a alternativa do CPF tentar casar um pedaço dele.
const CNPJ = /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/
const CPF = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/

function redigir(texto) {
  let n = 0
  const saida = texto.replace(/\d[\d.\-/]{9,19}\d/g, (m) => {
    const digitos = m.replace(/\D/g, '')
    if (digitos.length === 14 && CNPJ.test(m)) return m // CNPJ de empresa: fica
    if (digitos.length !== 11 || !CPF.test(m)) return m
    n++
    return '[CPF removido]'
  })
  return { saida, n }
}

let total = 0
for (const arq of ARQS) {
  const p = join(DIR, arq)
  const antes = readFileSync(p, 'utf8')
  const { saida, n } = redigir(antes)
  total += n
  if (n && !CHECK) writeFileSync(p, saida, 'utf8')
  console.log(`${arq.padEnd(22)} CPF encontrados: ${n}${n && !CHECK ? ' (removidos)' : ''}`)
}

if (CHECK && total) {
  console.error(`\n❌ ${total} CPF de pessoa física no registro. Rodar sem --check antes de publicar.`)
  process.exit(1)
}
console.log(total ? `\n✅ ${total} ocorrência(s) tratada(s).` : '\n✅ nenhum CPF de pessoa física.')
