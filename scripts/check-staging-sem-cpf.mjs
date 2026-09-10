/**
 * Portão FAIL-CLOSED de CPF no que vai SUBIR para o Hugging Face.
 *
 * ⛔ POR QUE ISTO EXISTE (10/Set/2026): a redação de CPF já existia, bem escrita
 * e bem documentada, em `scripts/redigir-cpf-tse-registry.mjs`. O que faltava é
 * que NADA obrigava ela a rodar antes do envio. Medido nos 5 últimos espelhos
 * do Brasil: ela rodou em 2 e foi esquecida em 3, e a consequência era ativa e
 * não latente, com 8 CPFs VÁLIDOS de 3 pessoas publicados no dataset aberto.
 *
 * 🔑 Portão que depende de alguém lembrar de chamá-lo é documentação, não
 * portão. Este roda dentro do `subir` do espelho, olha os BYTES que serão
 * enviados, e o envio não acontece se ele reprovar.
 *
 * 🧩 A RÉGUA NÃO MORA AQUI. Ela é o primitivo único de `scripts/lib/cpf.mjs`, o
 * mesmo que o backup do Neon, a trava de PII e o redator usam. Escrever aqui
 * uma segunda cópia repetiria o incidente das duas cópias que divergiram e
 * deixaram CPF cru passar por três meses.
 *
 * Uso: node scripts/check-staging-sem-cpf.mjs <diretório>
 *   exit 0 = nada encontrado E o detector provou que está vivo
 *   exit 1 = CPF encontrado, ou o detector está mudo
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { acharCpf } from './lib/cpf.mjs'

const raiz = process.argv[2]
if (!raiz) { console.error('uso: node scripts/check-staging-sem-cpf.mjs <diretório>'); process.exit(1) }

// ⚠️ CONTROLE PLANTADO, antes de confiar em qualquer zero. Um detector mudo
// devolve "nenhum CPF" exatamente como uma base limpa devolve, e os dois
// resultados são indistinguíveis sem isto.
const CONTROLE = 'estatístico responsável, CPF 529.982.247-25, CONRE 12345'
if ((acharCpf(CONTROLE) || []).length !== 1) {
  console.error('❌ DETECTOR MUDO: o CPF de controle plantado não foi encontrado. O zero abaixo não valeria nada.')
  process.exit(1)
}

const TEXTO = /\.(csv|json|md|txt|ya?ml|tsv)$/i
let arquivos = 0
let achados = 0

function anda(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === '.git' || e.name === '.huggingface' || e.name === '.cache') continue
      anda(p)
      continue
    }
    if (!TEXTO.test(e.name)) continue
    arquivos++
    const a = acharCpf(readFileSync(p, 'utf8')) || []
    if (!a.length) continue
    achados += a.length
    console.error(`🔴 ${p}: ${a.length} CPF`)
    for (const x of a.slice(0, 5)) console.error(`     ${x.trecho}`)
  }
}

try { statSync(raiz) } catch { console.error(`❌ diretório não existe: ${raiz}`); process.exit(1) }
anda(raiz)

if (achados) {
  console.error(`\n❌ ${achados} CPF de pessoa física em ${raiz}. Rodar scripts/redigir-cpf-tse-registry.mjs e reexportar ANTES de subir.`)
  process.exit(1)
}
console.log(`✅ CPF: nenhum em ${arquivos} arquivo(s) de texto sob ${raiz}, com controle plantado detectado.`)
