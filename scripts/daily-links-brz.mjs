#!/usr/bin/env node
/**
 * DAILY LINKS — resolve os marcadores de link da daily pelo news-cache do dia
 * e monta o bloco "Fontes consultadas" a partir do que o texto REALMENTE cita.
 *
 * 🔴 POR QUE EXISTE, medido em 25/Set/2026: a listagem de links do cache para
 *    escrever a daily passava por `cut -c1-260`, e a URL do Google News tem
 *    ~400 caracteres. Copiar dali é produzir exatamente a URL truncada que o
 *    gate de URL bloqueia (<150 chars) ou, pior, uma de 260 que passa no gate
 *    de tamanho e não resolve. E o rodapé era montado à mão, então nada
 *    garantia que ele listasse o que o corpo cita, nem só isso.
 *
 * Marcadores, escritos no lugar da URL dentro de `[texto](...)`:
 *   {{GN:regex do título}}   item SECUNDÁRIO do cache (Google News redirect)
 *   {{AN:regex do título}}   item ÂNCORA do cache (qid prestige-*, URL direta)
 *   {{URL:https://...|Veículo|Título}}   âncora com URL já conhecida (corpo lido)
 *   {{FONTES}}               vira os dois sub-blocos de "Fontes consultadas"
 *
 * ⛔ Falha ALTO: marcador sem casamento, casamento ambíguo entre veículos
 *    diferentes ou URL do Google News abaixo de 150 caracteres param tudo e
 *    nada é escrito. Chutar um link é pior que não ter link.
 *
 * Uso:
 *   node scripts/daily-links-brz.mjs rascunho.md public/afos-daily/2026-09-25.md --data=2026-09-25
 */
import fs from 'node:fs'

const [entrada, saida] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const data = process.argv.find((a) => a.startsWith('--data='))?.slice(7)
if (!entrada || !saida || !data) {
  console.error('Uso: node scripts/daily-links-brz.mjs rascunho.md saida.md --data=AAAA-MM-DD')
  process.exit(2)
}
const cacheArq = `public/news-cache/${data}.json`
if (!fs.existsSync(cacheArq)) {
  console.error(`❌ ${cacheArq} não existe: sem cache não há link a resolver.`)
  process.exit(4)
}
const cache = JSON.parse(fs.readFileSync(cacheArq, 'utf8'))
const itens = []
for (const [qid, q] of Object.entries(cache.queries ?? {})) for (const x of q.items ?? []) itens.push({ ...x, qid })

// A Folha entrega o RSS com um redirecionador na frente; a URL da matéria vem depois do `*`.
const limpar = (u) => u.replace(/^https:\/\/redir\.folha\.com\.br\/redir\/online\/[^*]+\*/, '')
// O Google News cola " - Veículo" no fim do título.
const semRodape = (t) => t.replace(/\s+-\s+[^-]+$/, '').trim()
// O cache traz o nome como o feed escreve ("g1.globo.com", "O GLOBO"); o rodapé usa o nome do veículo.
const NOME = { 'g1.globo.com': 'G1', 'O GLOBO': 'O Globo', 'cnnbrasil.com.br': 'CNN Brasil', 'poder360.com.br': 'Poder360' }
const veiculoDe = (s) => NOME[s] ?? s

const usados = new Map() // url -> { tipo, veiculo, titulo }
const erros = []
let texto = fs.readFileSync(entrada, 'utf8')

texto = texto.replace(/\{\{(GN|AN|URL):([^}]+)\}\}/g, (inteiro, tipo, arg) => {
  if (tipo === 'URL') {
    const [url, veiculo, titulo] = arg.split('|')
    if (!/^https:\/\//.test(url ?? '') || !veiculo || !titulo) { erros.push(`URL mal formada: ${inteiro}`); return inteiro }
    usados.set(url, { tipo: 'ANCORA', veiculo, titulo })
    return url
  }
  const re = new RegExp(arg, 'i')
  const cand = itens.filter((x) => re.test(x.title) && (tipo === 'AN' ? x.qid.startsWith('prestige-') : !x.qid.startsWith('prestige-')))
  const unicos = [...new Map(cand.map((x) => [x.link, x])).values()]
  if (unicos.length === 0) { erros.push(`sem casamento ${tipo}: /${arg}/`); return inteiro }
  const veiculos = new Set(unicos.map((x) => x.sourceName))
  if (veiculos.size > 1) { erros.push(`ambíguo ${tipo} /${arg}/: ${[...veiculos].join(', ')}`); return inteiro }
  const x = unicos[0]
  const url = tipo === 'AN' ? limpar(x.link) : x.link
  if (tipo === 'GN' && url.length < 150) { erros.push(`GN curta (${url.length}c): /${arg}/`); return inteiro }
  usados.set(url, { tipo: tipo === 'AN' ? 'ANCORA' : 'SECUND', veiculo: veiculoDe(x.sourceName), titulo: semRodape(x.title) })
  return url
})

if (erros.length) {
  console.error(`❌ ${erros.length} marcador(es) sem resolução. NADA foi escrito.`)
  for (const e of erros) console.error('   ' + e)
  process.exit(1)
}

const lista = (t) => [...usados.entries()].filter(([, v]) => v.tipo === t).map(([u, v]) => `- [${v.veiculo} · ${v.titulo}](${u})`)
const an = lista('ANCORA'), sec = lista('SECUND')
const bloco = [
  '**matérias com link direto para a notícia (veículos âncora):**', '', ...an, '',
  '**matérias secundárias (URL Google News redirect, clique resolve à matéria):**', '', ...sec,
].join('\n')
// 🔴 26/Set/2026: o marcador gerava só os DOIS sub-blocos, e o título
//    "## Fontes consultadas", obrigatório no template, dependia de quem escrevia
//    o rascunho. Naquele dia ele faltou, o validate-afos-daily não acusou, e a
//    contagem de palavras passou a medir o rodapé como corpo (1.605). Agora o
//    título entra junto quando não está logo antes do marcador.
if (texto.includes('{{FONTES}}')) {
  const antes = texto.slice(0, texto.indexOf('{{FONTES}}')).trimEnd()
  const titulo = antes.endsWith('## Fontes consultadas') ? '' : '## Fontes consultadas\n\n'
  texto = texto.replace('{{FONTES}}', titulo + bloco)
}

fs.writeFileSync(saida, texto)
const pct = usados.size ? Math.round((100 * sec.length) / usados.size) : 0
console.log(`✅ ${usados.size} link(s) distintos: ${an.length} âncora, ${sec.length} secundário(s), ${pct}% secundário ${pct >= 50 ? '✅' : '🔴 abaixo do piso de 50%'}`)
console.log(`   escrito em ${saida}`)
