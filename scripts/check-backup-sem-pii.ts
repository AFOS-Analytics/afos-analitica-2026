/**
 * Varre o backup atrás de DADO PESSOAL antes de ele ir para um repositório
 * PÚBLICO. Roda no pre-commit quando backup/neon/ é tocado.
 *
 * A classificação em scripts/backup-neon.ts é a primeira barreira, mas ela
 * confia em quem classificou. Esta é a segunda: olha o CONTEÚDO descomprimido e
 * procura o que não pode estar lá, independentemente da tabela de origem. Um
 * e-mail pode aparecer dentro de um JSON de researchFinding sem ninguém prever.
 *
 * Uso:  npx tsx scripts/check-backup-sem-pii.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'

const RAIZ = 'backup/neon'

const PADROES: Array<{ nome: string; re: RegExp; nota?: string; filtro?: (s: string) => boolean }> = [
  { nome: 'e-mail', re: /[\w.+-]+@[\w-]+\.[\w.]{2,}/g },
  { nome: 'CPF formatado', re: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g },
  { nome: 'telefone BR', re: /\(\d{2}\)\s?9?\d{4}-\d{4}/g },
  { nome: 'segredo de alta entropia', re: /\b[A-Za-z0-9_-]{32,}\b/g, nota: 'possível token ou chave', filtro: pareceSegredo },
  { nome: 'chave de API', re: /\b(sk-[A-Za-z0-9-]{20,}|re_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,})\b/g },
]

/**
 * Separa SEGREDO de SLUG. A primeira versão desta checagem usava só
 * "40 caracteres ou mais" e acusou `brazil-presidential-election-first-round-2nd-place`
 * e nomes de arquivo do IBGE. Guard que acusa slug legítimo é ruído, e ruído
 * ensina a ignorar o alerta, que é justamente o que não pode acontecer aqui.
 *
 * Um segredo real (hex, base64, uuid sem hífen) mistura caixa e dígito e não
 * tem estrutura de palavras. Um slug é uma sequência de palavras minúsculas
 * separadas por hífen ou sublinhado.
 */
function pareceSegredo(s: string): boolean {
  const partes = s.split(/[-_]/)
  const palavras = partes.filter((p) => /^[a-zà-ÿ]{2,}$/i.test(p))
  if (palavras.length >= 3) return false          // slug: três ou mais palavras
  if (!/\d/.test(s)) return false                 // segredo sem dígito é improvável
  const temMaiuscula = /[A-Z]/.test(s)
  const temMinuscula = /[a-z]/.test(s)
  return temMaiuscula && temMinuscula             // mistura de caixa
}

/**
 * O que aparece legitimamente e NÃO é dado de assinante nem segredo. Mantido
 * curto e explícito: cada entrada precisa de justificativa, senão a lista vira
 * um ralo por onde some o que deveria ser barrado.
 */
const PERMITIDOS = [
  /@afos-analytics\.com$/i,
  /@example\.(com|org)$/i,
  // Token de URL do Google News. Já é público: está impresso nas dailies
  // publicadas e serve para o leitor abrir a matéria. Não é segredo.
  /^CBM[A-Za-z0-9_-]+$/,
]

function listar(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome)
    if (statSync(p).isDirectory()) listar(p, out)
    else out.push(p)
  }
  return out
}

const arquivos = listar(RAIZ)
if (arquivos.length === 0) {
  console.log('Nada em backup/neon/ para varrer.')
  process.exit(0)
}

let achados = 0
for (const arq of arquivos) {
  const texto = arq.endsWith('.gz')
    ? gunzipSync(readFileSync(arq)).toString('utf-8')
    : readFileSync(arq, 'utf-8')

  // O MANIFEST lista de propósito os NOMES das tabelas com dado pessoal, para
  // documentar a exclusão. Isso não é vazamento; o que importa é o conteúdo.
  const ehManifesto = arq.endsWith('MANIFEST.json')

  for (const { nome, re, nota, filtro } of PADROES) {
    re.lastIndex = 0
    const hits = [...texto.matchAll(re)]
      .map((m) => m[0])
      .filter((h) => !PERMITIDOS.some((p) => p.test(h)))
      .filter((h) => (filtro ? filtro(h) : true))
    if (hits.length === 0) continue
    // O MANIFEST guarda sha256 de propósito; é conferência, não segredo.
    if (ehManifesto && nome === 'segredo de alta entropia') continue
    console.error(`  ❌ ${nome}${nota ? ' (' + nota + ')' : ''} em ${arq}`)
    for (const h of [...new Set(hits)].slice(0, 3)) {
      console.error(`       ${h.slice(0, 24)}${h.length > 24 ? '…' : ''}`)
    }
    achados++
  }
}

if (achados > 0) {
  console.error('\n❌ O repositório é PÚBLICO. NÃO commite este backup.')
  console.error('   Reclassifique a tabela de origem em scripts/backup-neon.ts e gere de novo.')
  process.exit(1)
}
console.log(`✅ ${arquivos.length} arquivo(s) de backup varridos, nenhum dado pessoal encontrado.`)
