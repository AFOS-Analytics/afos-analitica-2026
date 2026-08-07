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
 * 🧩 A RÉGUA NÃO MORA MAIS AQUI (migrado em 07/Ago/2026). Ela é o primitivo
 * único de `scripts/lib/cpf.mjs`, o MESMO que o backup do Neon e a trava de PII
 * usam. Antes desta migração havia duas cópias da mesma regra, e elas divergiram
 * exatamente como se temia: a do backup só via CPF PONTUADO e deixou passar CPF
 * cru para o repositório público durante três meses.
 *
 * 🔢 O QUE MUDOU NA PRÁTICA, e foi MEDIDO antes de trocar
 * A régua antiga era "11 dígitos em qualquer formatação". A nova exige DÍGITO
 * VERIFICADOR e fronteira de PALAVRA. Comparadas sobre o texto cru do TSE:
 *   - os CPFs reais: os MESMOS nos dois, nenhum a menos;
 *   - a antiga redigia ainda 3 números que NÃO são CPF, entre eles fragmento de
 *     UUID e um número dentro da citação de uma fonte do TSE.
 * Ou seja, a nova protege igual e para de destruir dado legítimo. Um desses
 * falsos positivos está publicado no dataset: o `tse-registry` traz
 * "...home?session=1156 [CPF removido] e IBGE", onde o número redigido reprova
 * no dígito verificador. Como o `tse-registry` é regenerado a cada espelhamento
 * e não é arquivo datado, o próximo espelho o devolve correto.
 *
 * 🧮 O QUE SAI E O QUE FICA continua igual:
 *   SAI  o CPF de pessoa física (11 dígitos), pontuado ou cru, e também o número
 *        ROTULADO como CPF mesmo com dígito verificador inválido.
 *   FICA o CNPJ (14 dígitos), que identifica empresa e não pessoa. O TSE rotula
 *        o campo como "CNPJ/CPF" e preenche com CNPJ: redigir por RÓTULO
 *        apagaria o identificador do instituto, que é o que dá auditabilidade.
 *   FICA o NOME do estatístico, que é atuação profissional e campo próprio.
 *
 * Uso: node scripts/redigir-cpf-tse-registry.mjs [--check]
 *   --check  não escreve, só relata (exit 1 se achar CPF)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { redigirCpf } from './lib/cpf.mjs'

const CHECK = process.argv.includes('--check')
const DIR = join(process.cwd(), 'hf-assets', 'polls')

/**
 * 🔴 TODO ARQUIVO QUE CARREGA TEXTO LIVRE DO TSE ENTRA AQUI.
 *
 * A lista tinha só os dois `tse-registry.*` e deixava de fora o
 * `national-polls.json`, que o `build-tse-registry-full.mjs` escreve no MESMO
 * passo anterior e que embala os mesmos campos crus dentro de
 * `tse_registration`: `methodology`, `sampling_plan` e `control_system`,
 * presentes nos 48 registros. É nesses três que o CPF do estatístico aparece.
 *
 * Medido em 06/Ago/2026: pela lógica deste próprio redator o arquivo estava
 * com ZERO CPF naquele dia, então a falha era ESTRUTURAL e latente, não
 * vazamento ativo. Latente é pior de achar: passa verde até o dia em que o TSE
 * publicar um registro com CPF no texto e ninguém estiver olhando.
 *
 * Régua do André: preservar o legado e, do presente para o futuro, não coletar
 * CPF. A trava é a parte do "para o futuro", então ela precisa cobrir tudo que
 * sai daqui para o dataset público.
 *
 * ⚠️ NÃO mover este passo para depois do `export-hf-dataset.mjs`: o `DIR` é
 * fixo em `hf-assets/polls`, e depois do export o que vai para o ar é a cópia
 * em `.cache/hf-dataset/polls`. Redigir aqui depois da cópia limparia o
 * original e publicaria a cópia suja.
 */
const ARQS = ['tse-registry.csv', 'tse-registry.json', 'national-polls.json']

let total = 0
for (const arq of ARQS) {
  const p = join(DIR, arq)
  const antes = readFileSync(p, 'utf8')
  const { saida, n } = redigirCpf(antes)
  total += n
  if (n && !CHECK) writeFileSync(p, saida, 'utf8')
  console.log(`${arq.padEnd(22)} CPF encontrados: ${n}${n && !CHECK ? ' (removidos)' : ''}`)
}

if (CHECK && total) {
  console.error(`\n❌ ${total} CPF de pessoa física no registro. Rodar sem --check antes de publicar.`)
  process.exit(1)
}
console.log(total ? `\n✅ ${total} ocorrência(s) tratada(s).` : '\n✅ nenhum CPF de pessoa física.')
