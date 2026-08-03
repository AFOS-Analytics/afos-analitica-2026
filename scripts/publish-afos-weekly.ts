/**
 * publish-afos-weekly.ts — vira `status: draft` → `published` no frontmatter.
 *
 * Uso:
 *   npx tsx scripts/publish-afos-weekly.ts 2026-08-06
 *   npx tsx scripts/publish-afos-weekly.ts 2026-08-06 --all-locales
 *   npx tsx scripts/publish-afos-weekly.ts 2026-08-06 --pais=us --all-locales
 *
 * ⚠️ NÃO é cópia do `publish-afos-tradeoff.ts`, e as duas diferenças importam:
 *
 * 1. 🔴 **O INGLÊS É O ARQUIVO DE ORIGEM.** No Tradeoff e no Daily o canônico é
 *    `{data}.md` em português e as traduções levam sufixo. Aqui `{data}.md` está
 *    EM INGLÊS, e as traduções são `{data}.pt-BR.md` e `{data}.es.md`. Por isso
 *    a lista de sufixos abaixo é `['', '.pt-BR', '.es']` e não `['', '.en', '.es']`.
 *    Copiar a do Tradeoff faria o script procurar um `.en.md` que não existe e
 *    deixar a tradução em português fora do flip, em silêncio.
 *
 * 2. 📁 **Todo país tem subpasta, inclusive o primeiro.** O Tradeoff tem a
 *    assimetria histórica de manter o Brasil na raiz; este produto nasceu
 *    multipaís e não herdou isso.
 *
 * ⛔ ENQUANTO O PILOTO DURAR, publicar aqui NÃO põe a edição no ar para busca:
 * a página continua `noindex` e fora do sitemap por decisão de 01/Ago/2026. O
 * flip só tira o 404 da rota.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const RAIZ = join(process.cwd(), 'public', 'afos-weekly')
const PAIS_PADRAO = 'us'
/** 🔴 Origem em INGLÊS: o sufixo vazio É o inglês. */
const LOCALES = ['', '.pt-BR', '.es'] as const

function dirDoPais(pais: string): string {
  return join(RAIZ, pais)
}

type Resultado = 'virou' | 'ja-publicada' | 'sem-status' | 'ausente'

function flip(path: string): Resultado {
  if (!existsSync(path)) return 'ausente'
  const conteudo = readFileSync(path, 'utf-8')

  const fm = conteudo.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fm) return 'sem-status'

  const status = fm[1].match(/^status:\s*([a-z]+)\s*$/m)
  if (!status) return 'sem-status'
  if (status[1] === 'published') return 'ja-publicada'

  // Troca só dentro do frontmatter, para não acertar um "status: draft" que
  // apareça no corpo do texto.
  const novoFm = fm[1].replace(/^status:\s*[a-z]+\s*$/m, 'status: published')
  writeFileSync(path, conteudo.replace(fm[1], novoFm), 'utf-8')
  return 'virou'
}

function main() {
  const args = process.argv.slice(2)
  const data = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
  if (!data) {
    console.error('Uso: npx tsx scripts/publish-afos-weekly.ts YYYY-MM-DD [--pais=us] [--all-locales]')
    process.exit(1)
  }
  const pais = args.find((a) => a.startsWith('--pais='))?.split('=')[1] ?? PAIS_PADRAO
  const todos = args.includes('--all-locales')
  const sufixos = todos ? LOCALES : ['']

  console.log(`\n🚦 status: draft → published · AFOS Weekly ${pais.toUpperCase()} ${data}${todos ? ' (todos os idiomas)' : ' (só a origem em inglês)'}\n`)

  let virou = 0
  let problemas = 0
  for (const sufixo of sufixos) {
    const nome = `${data}${sufixo}.md`
    const r = flip(join(dirDoPais(pais), nome))
    const rotulo = sufixo === '' ? `${nome}  (origem, inglês)` : nome
    if (r === 'virou') { console.log(`✅ ${rotulo}: agora published`); virou++ }
    else if (r === 'ja-publicada') console.log(`ℹ️  ${rotulo}: já estava published`)
    else if (r === 'ausente') {
      // Falta de tradução NÃO é erro: a cascata serve o inglês com aviso.
      console.log(`⏭️  ${rotulo}: não existe${sufixo === '' ? '  ⛔ A ORIGEM FALTANDO É ERRO' : ' (o leitor cai para o inglês, com aviso)'}`)
      if (sufixo === '') problemas++
    }
    else { console.log(`⛔ ${rotulo}: frontmatter sem linha de status`); problemas++ }
  }

  console.log(`\n${virou} arquivo(s) publicado(s).`)
  console.log('\n📋 Depois disto:')
  console.log(`   1. git add public/afos-weekly/${pais}/${data}*.md`)
  console.log('   2. git commit e push')
  console.log('   3. npx vercel --yes --prod')
  console.log('   ⚠️  Durante o piloto a página segue noindex e fora do sitemap.\n')

  if (problemas) process.exit(1)
}

main()
