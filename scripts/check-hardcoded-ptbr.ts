/**
 * Trava contra prosa em PORTUGUÊS embutida em componente.
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
 * O QUE ELA FAZ
 * Procura marcador de prosa portuguesa dentro de string literal longa nos
 * componentes. O legado conhecido está em LEGADO e é ignorado. Qualquer
 * componente NOVO que ganhe prosa em português reprova.
 *
 * Uso:  npx tsx scripts/check-hardcoded-ptbr.ts
 */
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DIR = 'app/components'

/**
 * Legado congelado em 25/Jul/2026. Entrar nesta lista exige decisão explícita:
 * significa que aquele arquivo vai renderizar português para leitor de EN/ES.
 */
const LEGADO = new Set([
  'CandidatesSection.tsx',
])

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
 * Dicionário de i18n definido no próprio componente é localização legítima,
 * não defeito: o português ali convive com o inglês e o espanhol.
 */
function temDicionarioI18n(src: string): boolean {
  // A chave pode vir com ou sem aspas: `'pt-BR': {` e `es: {` convivem no mesmo
  // objeto. A primeira versão exigia aspas nas duas e deixou passar o
  // LandingPageDual, que tem dicionário completo dos três idiomas.
  const temChave = (k: string) =>
    new RegExp(`(?:^|[{,\\s])['"]?${k}['"]?\\s*:`, 'm').test(src)
  return temChave('pt-BR') && temChave('en') && temChave('es')
}

interface Achado { arquivo: string; marcadores: number; amostra: string }

const achados: Achado[] = []
for (const arquivo of readdirSync(DIR).filter(f => f.endsWith('.tsx')).sort()) {
  if (LEGADO.has(arquivo)) continue
  const bruto = readFileSync(join(DIR, arquivo), 'utf-8')
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
  if (marcadores > 0) achados.push({ arquivo, marcadores, amostra })
}

if (achados.length === 0) {
  console.log(`✅ Nenhum componente novo com prosa pt-BR embutida.`)
  console.log(`   Legado preservado e ignorado: ${[...LEGADO].join(', ')}`)
  process.exit(0)
}

console.error('❌ Prosa em PORTUGUÊS embutida em componente fora do legado:\n')
for (const a of achados) {
  console.error(`   ${a.arquivo}  (${a.marcadores} marcador(es))`)
  console.error(`      ...${a.amostra}...`)
}
console.error('\nConteúdo editorial vai para JSON em public/, que tem pipeline de tradução')
console.error('(ETAPA 3.5 do /atualizar). Componente é layout, não texto.')
console.error('Se for legado que precisa ficar, adicione o arquivo em LEGADO com justificativa.')
process.exit(1)
