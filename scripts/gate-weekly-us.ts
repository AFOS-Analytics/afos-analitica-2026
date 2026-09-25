/**
 * PORTÃO DA EDIÇÃO SEMANAL DOS EUA: blocos, teto de palavras e gate numérico.
 *
 * 🔴 POR QUE EXISTE (17/Set/2026): a skill do weekly manda contar os blocos pelo
 * loader, medir o corpo contra o teto de 1.100 palavras e conferir que todo
 * número com unidade dá multiconjunto idêntico nos três idiomas. As três regras
 * estavam escritas e NENHUMA tinha ferramenta: o bloco era contado por um script
 * descartável colado na sessão, e o teto era estimado.
 *
 * ⭐ Na primeira execução ele achou o que a estimativa escondia: as edições nº 5
 * e nº 6 estão ACIMA do teto até no INGLÊS, com 1.133 e 1.141 palavras. Régua sem
 * medidor é régua que ninguém cumpre. ⛔ Não retroage: reescrever edição já
 * publicada é decisão do André.
 *
 * 📏 O teto vale no INGLÊS, que é a origem do produto. pt-BR e ES saem mais
 * longos por construção (8% a 18% nas edições medidas), e cortar a tradução para
 * caber trocaria conteúdo verificado por contagem de palavras.
 *
 * 🔢 O gate numérico normaliza o separador de MILHAR antes de comparar, porque
 * ele MUDA por idioma (EN vírgula, pt-BR e ES ponto), enquanto o decimal é ponto
 * nos três. Sem isso, 2,633 e 2.633 sairiam como números diferentes e o portão
 * reprovaria tradução correta.
 *
 * 🧪 Conferido com mutação em 17/Set: trocar 7.00pp por 7.50pp no ES reprova, com
 * os dois números nomeados na saída.
 *
 * ⛔ Ele não publica, não traduz e não corrige: mede e reprova.
 *
 * Uso: npx tsx scripts/gate-weekly-us.ts 2026-09-17
 */
import { existsSync } from 'fs'
import { loadWeekly } from '../lib/afos-weekly/loader'

const DATA = process.argv[2] ?? '2026-09-17'
const TETO = 1100
const corpo = (d: any) =>
  [
    d.title,
    ...(d.tldr ?? []),
    d.moneyIntro ?? '',
    ...(d.cards ?? []).map((c: any) => `${c.label} ${c.headline}${c.unit} ${c.delta} ${c.desc}`),
    d.moneyFootnote ?? '',
    d.pollsIntro ?? '',
    d.dispersion ? `${d.dispersion.high} ${d.dispersion.low} ${d.dispersion.amplitude} ${d.dispersion.note}` : '',
    ...(d.coverage?.narrative ?? []),
    ...((d.coverage?.claims ?? []).map((c: any) => `${c.outlet} ${c.claim}`)),
    d.coverage?.measurement ?? '',
    ...(d.crossings ?? []).map((c: any) => `${c.label} ${c.text}`),
    d.howToRead ? `${d.howToRead.title} ${d.howToRead.text}` : '',
  ]
    .join(' ')
    .replace(/https?:\/\/\S+/g, '')

/**
 * Número COM UNIDADE, normalizado para comparação entre idiomas.
 * Decimal é ponto nos três; o separador de MILHAR muda (EN vírgula, pt-BR e ES ponto),
 * então o milhar é removido antes de comparar: 2,633 e 2.633 são o mesmo número.
 */
function numeros(texto: string) {
  const achados: string[] = []
  const re = /(\d[\d.,]*)\s*(%|pp|M\b|USD)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(texto))) {
    let n = m[1]
    if (/^\d{1,3}([.,]\d{3})+$/.test(n)) n = n.replace(/[.,]/g, '')
    achados.push(`${n}${m[2] === 'USD' ? 'USD' : m[2]}`)
  }
  // "USD 20.49M" casa como 20.49M; o prefixo USD sozinho não conta.
  return achados.filter((x) => !x.endsWith('USD')).sort()
}

let falhouTeto = false
const locs = ['en', 'pt-BR', 'es']
const por: Record<string, string[]> = {}
for (const loc of locs) {
  const d: any = loadWeekly(DATA, loc, 'us')
  if (!d) {
    console.log(`❌ ${loc}: loader devolveu null`)
    process.exit(1)
  }
  por[loc] = numeros(corpo(d))
  const palavras = corpo(d).replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length
  // O teto é do INGLÊS. Na tradução ele vira referência, não portão.
  const teto = loc === 'en' ? (palavras > TETO ? ` ❌ ACIMA DO TETO de ${TETO}` : ` ✅ no teto de ${TETO}`) : ' (tradução, sem teto)'
  if (loc === 'en' && palavras > TETO) falhouTeto = true
  console.log(
    `  ${loc.padEnd(6)} ${por[loc].length} números com unidade · ${palavras} palavras${teto} · tldr=${d.tldr?.length} cards=${d.cards?.length} cruzamentos=${d.crossings?.length} narrativa=${(d.coverage?.narrative ?? []).length} claims=${(d.coverage?.claims ?? []).length} fontes=${d.sources?.length}`,
  )
  for (const [nome, n] of Object.entries({ tldr: d.tldr?.length, cards: d.cards?.length, cruzamentos: d.crossings?.length, narrativa: (d.coverage?.narrative ?? []).length, fontes: d.sources?.length })) {
    if (!n) console.log(`     🔴 ${loc}: ${nome} com ZERO. Bloco com zero é bloco que não vai aparecer na página.`)
  }
}

let falhou = false
for (const loc of locs.slice(1)) {
  const a = por.en
  const b = por[loc]
  const sobra = b.filter((x, i) => a.indexOf(x) === -1 || b.filter((y) => y === x).length > a.filter((y) => y === x).length && b.indexOf(x) === i)
  const falta = a.filter((x, i) => b.indexOf(x) === -1 || a.filter((y) => y === x).length > b.filter((y) => y === x).length && a.indexOf(x) === i)
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    falhou = true
    console.log(`\n❌ ${loc} diverge do inglês`)
    if (falta.length) console.log(`   só no EN: ${[...new Set(falta)].join(' ')}`)
    if (sobra.length) console.log(`   só no ${loc}: ${[...new Set(sobra)].join(' ')}`)
  }
}
console.log(falhou ? '\n❌ GATE NUMÉRICO REPROVADO' : '\n✅ gate numérico: multiconjunto idêntico nos três idiomas')
// 🖼️ ogImage DECLARADA tem de EXISTIR no disco. Régua de 25/Set/2026, e ela
// nasceu de um 404 em produção: a edição nº 7 foi ao ar apontando para
// /brand/og-us-weekly-7-1200x627.png, que nunca foi gerado, porque o script da
// arte era fixo na nº 6. Arquivo declarado e ausente renderiza cartão QUEBRADO,
// que é pior que não declarar imagem nenhuma, e nenhum portão via isso: o
// frontmatter estava bem formado e a página respondia 200.
let semArte = false
for (const loc of locs) {
  const img = (loadWeekly(DATA, loc, 'us') as any)?.ogImage
  if (!img) continue
  const caminho = `public${String(img).split('?')[0]}`
  if (existsSync(caminho)) continue
  semArte = true
  console.log(`❌ ${loc}: ogImage declara ${img} e o arquivo NÃO existe em ${caminho}`)
}
if (!semArte) console.log('✅ ogImage: toda imagem declarada existe no disco')

process.exit(falhou || falhouTeto || semArte ? 1 : 0)
