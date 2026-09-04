/**
 * conferir-contra-captura.mjs — todo preço e todo volume escritos nos JSONs
 * editoriais têm de existir no instantâneo que a TRAVA certificou.
 *
 * 🔴 POR QUE ISTO EXISTE, e é um vão medido em 04/Set/2026. O portão de frescor
 * compara a prosa contra o `quadroComparativo` do próprio arquivo. Isso pega o
 * bloco que ficou para trás enquanto o quadro andou. Não pega o caso em que os
 * DOIS estão velhos juntos.
 *
 * Foi o que aconteceu ao republicar a rodada com um carimbo novo: o volume do
 * Pablo Marçal estava escrito USD 3,64M na prosa E no quadro, coerentes entre
 * si, e a captura certificada dizia USD 3,69M. Nenhum portão da casa reclamou,
 * porque nenhum deles olha para a CAPTURA. Coerência interna não é frescor.
 * → memory/feedback_defeito_de_etiqueta_passa_por_todo_portao_de_valor.md
 *
 * 🔑 A pergunta que ele faz é diferente da de todos os outros: "este número que
 * está escrito na página existe na leitura que a trava certificou?" Um número
 * que não existe lá é de outra rodada, de outro contrato, ou foi digitado.
 *
 * ⚠️ Ele NÃO exige que todo contrato apareça na página, só que todo número da
 * página venha de algum contrato. E aceita uma lista de REFERÊNCIAS declaradas,
 * que são números legítimos que não são preço de hoje: o total do livro, o
 * volume da véspera numa comparação, a faixa do dia.
 *
 * ⛔ Não reescreve nada. Lê e reprova.
 *
 * Uso:
 *   node scripts/conferir-contra-captura.mjs
 *   node scripts/conferir-contra-captura.mjs --ref="USD 142,61M; USD 380 mil"
 */

import { readFileSync, existsSync } from 'fs'
import { pathToFileURL } from 'url'

export const CAMINHO_CAPTURA = '.cache/capture-guard/ultima-br.json'
export const ARQUIVOS = ['public/analysis-criteriosa.json', 'public/analysis-data.json', 'public/polls-data.json']

/** USD 9,72M e USD 586 mil, na convenção do pt-BR. */
export function formatarVolume(x) {
  if (!Number.isFinite(x) || x <= 0) return null
  return x >= 1e6 ? `USD ${(x / 1e6).toFixed(2).replace('.', ',')}M` : `USD ${Math.round(x / 1000)} mil`
}

export function formatarPreco(x) {
  if (!Number.isFinite(x)) return null
  return `${x.toFixed(2).replace('.', ',')}%`
}

/**
 * O conjunto do que a captura autoriza a escrever.
 * ⚠️ Inclui os livros BLOQUEADOS de proposito: um preco bloqueado que o Andre
 * mandou publicar continua sendo um preco que existe na captura. O que este
 * conferidor persegue e numero que nao existe em lugar nenhum.
 */
export function permitidos(snap) {
  const precos = new Set()
  const volumes = new Set()
  for (const [, val] of Object.entries(snap.precos ?? {})) {
    const p = formatarPreco(val)
    if (p) precos.add(p)
  }
  for (const [, val] of Object.entries(snap.volumes ?? {})) {
    const v = formatarVolume(val)
    if (v) volumes.add(v)
  }
  return { precos, volumes }
}

const RX_VOLUME = /USD [\d.,]+ ?(?:mil|M)\b/g

/** Devolve os volumes escritos que a captura nao conhece. */
export function volumesForaDaCaptura(texto, permitidosVol, referencias = new Set()) {
  const achados = new Set(texto.match(RX_VOLUME) ?? [])
  return [...achados].filter((a) => !permitidosVol.has(a) && !referencias.has(a))
}

function principal() {
  if (!existsSync(CAMINHO_CAPTURA)) {
    console.error(`❌ ${CAMINHO_CAPTURA} não existe. Rodar a trava antes: npx tsx scripts/capture-guard.ts`)
    process.exit(1)
  }
  const snap = JSON.parse(readFileSync(CAMINHO_CAPTURA, 'utf8'))
  const { volumes } = permitidos(snap)

  // Referências declaradas: números legítimos que não são volume de contrato de
  // hoje. Ficam explícitas de propósito, para ninguém acrescentar em silêncio.
  const arg = process.argv.find((a) => a.startsWith('--ref='))
  // ATENCAO: o separador e PONTO E VIRGULA, nao virgula. Em pt-BR a virgula e o
  // separador DECIMAL, entao "USD 142,61M" partido por virgula vira "USD 142" e
  // "61M", e as duas metades sao acusadas. Separador que existe dentro do valor
  // nao serve como separador.
  const refs = new Set(
    (arg ? arg.slice(6) : 'USD 142,61M; USD 143,62M; USD 3,69M; USD 380 mil')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
  )

  console.log(`\n🔎 Conferindo contra a captura de ${snap.fetchedAt}`)
  console.log(`   ${volumes.size} volume(s) distinto(s) na captura · ${refs.size} referência(s) declarada(s)\n`)

  let falhas = 0
  for (const arquivo of ARQUIVOS) {
    const texto = readFileSync(arquivo, 'utf8')
    const fora = volumesForaDaCaptura(texto, volumes, refs)
    if (fora.length === 0) {
      console.log(`   ✅ ${arquivo}`)
      continue
    }
    falhas += fora.length
    console.log(`   ❌ ${arquivo}: ${fora.length} volume(s) que a captura não conhece`)
    for (const f of fora) console.log(`        ${f}`)
  }

  if (falhas > 0) {
    console.error(
      `\n❌ ${falhas} volume(s) escrito(s) na página não existem na leitura certificada.\n` +
        `   Ou é de rodada anterior, ou é de outro contrato, ou foi digitado.\n` +
        `   Se for referência legítima, declare com --ref= em vez de deixar passar.\n`
    )
    process.exit(1)
  }
  console.log('\n✅ todo volume escrito existe na captura certificada ou é referência declarada.\n')
}

// ATENCAO: `endsWith('conferir-contra-captura.mjs')` casa TAMBEM o proprio
// arquivo de teste, `testar-conferir-contra-captura.mjs`, porque um e sufixo do
// outro. Com isso o `principal()` rodava dentro do teste e sujava a saida.
// Comparar a URL inteira, como os outros scripts da casa ja fazem.
if (import.meta.url === pathToFileURL(process.argv[1]).href) principal()
