/**
 * Trava contra prosa em PORTUGUÊS embutida em componente ou página.
 *
 * POR QUE EXISTE
 * Em 25/Jul/2026 o dashboard foi traduzido para EN e ES: os 3 JSONs editoriais
 * ganharam versão por idioma e o `readLocalized` serve o arquivo certo. Mas o
 * `CandidatesSection.tsx` tem a prosa escrita DENTRO do componente, e por isso
 * ficou de fora: a seção "Pre-Candidate Profiles" aparece inteira em português
 * no /en/dashboard e no /es/dashboard.
 *
 * DECISÃO DO ANDRÉ (25/Jul): o legado fica como está, não se reescreve. Esta
 * trava existe para o problema NÃO CRESCER. Conteúdo editorial novo vai para
 * JSON, que tem pipeline de tradução; componente é layout, não texto.
 *
 * Uso:  npx tsx scripts/check-hardcoded-ptbr.ts
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs'
import { join, relative, sep } from 'path'

const RAIZ = 'app'

/**
 * Legado congelado em 25/Jul/2026. Entrar nesta lista exige decisão explícita:
 * significa que aquele arquivo vai renderizar português para leitor de EN/ES.
 * Caminho relativo à raiz do repositório.
 */
const LEGADO = new Set([
  'app/components/CandidatesSection.tsx',
])

/**
 * Arquivo cujo NOME declara ser conteúdo de um idioma só. O projeto usa esse
 * padrão de propósito (content-pt-BR.tsx ao lado de content-en.tsx), então
 * português ali é a intenção, não defeito.
 */
const NOME_DE_IDIOMA = /[.-](pt-BR|pt|en|es)\.tsx$/

/**
 * Palavra funcional portuguesa que praticamente não aparece em inglês, em
 * espanhol nem em código. Evita de propósito palavra que o espanhol também
 * tem (`para`, `mercado`, `sobre`), senão o guard acusaria texto ES legítimo.
 */
const MARCADOR_PT = /\b(não|então|também|porque|ainda|pelo|pela|dele|dela|seguido|queda|urna|pregões|acumulado|nenhum|hoje|ontem|véspera)\b/gi

/**
 * String literal longa o bastante para ser prosa, não rótulo nem className.
 *
 * ⚠️ SEM QUEBRA DE LINHA DENTRO, e comentário é removido ANTES. A primeira
 * versão não fazia nem uma coisa nem outra e acusou 18 componentes: a crase de
 * um comentário casava com a crase de outro dezenas de linhas adiante, e o
 * texto do comentário (que é em português neste projeto, de propósito) entrava
 * como se fosse conteúdo de tela. Guard que acusa 18 falsos positivos não é
 * guard, é ruído que ninguém lê.
 */
const STRING_LONGA = /"[^"\n]{40,}"|'[^'\n]{40,}'|`[^`\n]{40,}`/g

/** Comentário não é conteúdo de tela: neste projeto ele é escrito em português. */
function semComentarios(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
}

/**
 * Dicionário de i18n definido no próprio arquivo é localização legítima, não
 * defeito: o português ali convive com o inglês e o espanhol.
 *
 * A chave pode vir com ou sem aspas: `'pt-BR': {` e `es: {` convivem no mesmo
 * objeto. A primeira versão exigia aspas nas duas e deixou passar o
 * LandingPageDual, que tem dicionário completo dos três idiomas.
 */
function temDicionarioI18n(src: string): boolean {
  const temChave = (k: string) =>
    new RegExp(`(?:^|[{,\\s])['"]?${k}['"]?\\s*:`, 'm').test(src)
  return temChave('pt-BR') && temChave('en') && temChave('es')
}

/** Varre RECURSIVAMENTE. A 1ª versão só olhava o topo de app/components/ e
 *  deixava de fora 7 componentes em subpasta e as 52 páginas de app/[locale]/,
 *  que é justamente onde uma seção nova nasceria. */
function listarTsx(dir: string, out: string[] = []): string[] {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome)
    if (statSync(caminho).isDirectory()) { listarTsx(caminho, out); continue }
    if (nome.endsWith('.tsx')) out.push(caminho.split(sep).join('/'))
  }
  return out
}

// Allowlist que aponta para arquivo inexistente é allowlist podre: o arquivo
// pode ter sido renomeado e o guard passaria a cobrir nada sem avisar.
const legadoAusente = [...LEGADO].filter(f => !existsSync(f))
if (legadoAusente.length > 0) {
  console.error('❌ LEGADO aponta para arquivo que não existe mais:')
  legadoAusente.forEach(f => console.error(`   ${f}`))
  console.error('\nRenomeado ou removido? Atualize a lista em scripts/check-hardcoded-ptbr.ts.')
  process.exit(1)
}

interface Achado { arquivo: string; marcadores: number; amostra: string }

const achados: Achado[] = []
for (const arquivo of listarTsx(RAIZ).sort()) {
  if (LEGADO.has(arquivo)) continue
  if (NOME_DE_IDIOMA.test(arquivo)) continue

  const bruto = readFileSync(arquivo, 'utf-8')
  if (temDicionarioI18n(bruto)) continue
  const texto = semComentarios(bruto)

  let marcadores = 0
  let amostra = ''
  for (const s of texto.match(STRING_LONGA) ?? []) {
    const hits = s.match(MARCADOR_PT)
    if (!hits) continue
    marcadores += hits.length
    if (!amostra) amostra = s.slice(1, 120).replace(/\s+/g, ' ')
  }
  if (marcadores > 0) achados.push({ arquivo: relative('.', arquivo).split(sep).join('/'), marcadores, amostra })
}

if (achados.length === 0) {
  console.log('✅ Nenhum arquivo novo com prosa pt-BR embutida.')
  console.log(`   Varridos: ${listarTsx(RAIZ).length} .tsx em ${RAIZ}/ (recursivo)`)
  console.log(`   Legado preservado e ignorado: ${[...LEGADO].join(', ')}`)
  process.exit(0)
}

console.error('❌ Prosa em PORTUGUÊS embutida, fora do legado:\n')
for (const a of achados) {
  console.error(`   ${a.arquivo}  (${a.marcadores} marcador(es))`)
  console.error(`      ...${a.amostra}...`)
}
console.error('\nConteúdo editorial vai para JSON em public/, que tem pipeline de tradução')
console.error('(ETAPA 3.5 do /atualizar). Componente é layout, não texto.')
console.error('Se for legado que precisa ficar, adicione o caminho em LEGADO com justificativa.')
process.exit(1)
