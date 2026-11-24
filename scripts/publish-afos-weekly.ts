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
import { execFileSync } from 'child_process'
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
    console.error('Uso: npx tsx scripts/publish-afos-weekly.ts YYYY-MM-DD [--pais=us|fr] [--all-locales] [--sem-cartao]')
    process.exit(1)
  }
  const pais = args.find((a) => a.startsWith('--pais='))?.split('=')[1] ?? PAIS_PADRAO
  const todos = args.includes('--all-locales')
  const sufixos = todos ? LOCALES : ['']

  console.log(`\n🚦 status: draft → published · AFOS Weekly ${pais.toUpperCase()} ${data}${todos ? ' (todos os idiomas)' : ' (só a origem em inglês)'}\n`)

  /**
   * 🖼️ CARTÃO AUTOMÁTICO DA FRANÇA (24/Nov/2026, pedido do André): antes de
   * virar o status, roda `build-og-card-fr-weekly.mjs`, que monta os cartões a
   * partir do próprio arquivo de cada idioma e grava o `ogImage`. Ele não refaz
   * cartão que já existe (o WhatsApp guarda a 1ª imagem) e reprova número da
   * arte que não esteja no texto ou texto que não cabe. Se reprovar, NADA é
   * publicado. Depois, confere que todo `ogImage` declarado existe no disco.
   * `--sem-cartao` pula o passo (só para emergência; a edição sai com o cartão
   * padrão).
   */
  if (pais === 'fr' && !args.includes('--sem-cartao')) {
    console.log('🖼️  cartão automático da Weekly França:')
    try {
      execFileSync('node', ['scripts/build-og-card-fr-weekly.mjs', `--data=${data}`], { stdio: 'inherit' })
    } catch {
      console.error('\n⛔ o cartão reprovou: NADA foi publicado. Corrigir o texto (ou o cartão) e rodar de novo.')
      process.exit(1)
    }
    let semArte = 0
    for (const sufixo of sufixos) {
      const arq = join(dirDoPais(pais), `${data}${sufixo}.md`)
      if (!existsSync(arq)) continue
      const og = readFileSync(arq, 'utf-8').match(/^ogImage:\s*"?([^"\n]+)"?\s*$/m)?.[1]
      if (!og) { console.error(`⛔ ${data}${sufixo}.md sem ogImage depois do cartão`); semArte++; continue }
      if (!existsSync(join(process.cwd(), 'public', og.split('?')[0]))) { console.error(`⛔ ${data}${sufixo}.md declara ${og}, que não existe no disco`); semArte++ }
    }
    if (semArte) { console.error('\n⛔ cartão incompleto: NADA foi publicado.'); process.exit(1) }
    console.log('✅ cartão conferido em todos os idiomas\n')
  }

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
  console.log(`   1. git add public/afos-weekly/${pais}/${data}*.md${pais === 'fr' ? ' + os cartões novos public/brand/og-fr-weekly-<N>*.png, por NOME' : ''}`)
  console.log('   2. git commit e push')
  console.log('   3. npx vercel --yes --prod')
  console.log('   📌 A edição publicada ENTRA EM BUSCA: index, follow, no sitemap e no llms.txt.')
  console.log('      O piloto acabou em 27/Ago/2026, e esta mensagem dizia o contrario ate 10/Set.')
  console.log()

  if (problemas) process.exit(1)
}

main()
