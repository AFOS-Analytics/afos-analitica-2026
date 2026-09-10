/**
 * MEDIDOR DA EDIÇÃO SEMANAL: blocos, palavras do corpo e gate numérico.
 *
 * 🔴 POR QUE EXISTE, medido em 10/Set/2026. Três conferências obrigatórias da
 * quinta-feira eram feitas à mão, toda semana:
 *
 *   1. a ETAPA 3.5 mandava CRIAR um `scripts/tmp-wk.ts` com `cat`, rodar e
 *      apagar. Arquivo temporário escrito à mão é a chance nova de errar a ordem
 *      dos argumentos do loader, que é `(data, idioma, pais)`;
 *   2. a contagem de palavras do corpo era estimada, e a régua diz "medir, não
 *      estimar". Em 09/Set, na daily, a contagem à mão leu o frontmatter junto
 *      por causa do CRLF e mandou cortar 179 palavras que não existiam;
 *   3. o gate numérico dos três idiomas era varredura de olho, e em 03/Set o
 *      gate escrito às pressas ignorava TODO percentual por causa de um `\b`
 *      depois do `%`, e passou verde.
 *
 * 🔑 A fonte de verdade aqui é o LOADER, não o arquivo. É ele que o site usa, e
 * é ele que descarta bloco com campo errado em silêncio. Contar no markdown
 * mediria o que eu escrevi; contar no loader mede o que o leitor recebe.
 *
 * ⛔ Ele não decide nada e não escreve arquivo nenhum. Corte é do André.
 *
 * Uso:
 *   npx tsx scripts/medir-weekly.ts 2026-09-10
 *   npx tsx scripts/medir-weekly.ts 2026-09-10 --teto=1100
 *   npx tsx scripts/medir-weekly.ts 2026-09-10 --pais=us
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { loadWeekly, SUPPORTED_LOCALES, LOCALE_ORIGEM, dirDoPais } from '../lib/afos-weekly/loader'

const argv = process.argv.slice(2)
const data = argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
const opt = (n: string, padrao: string) =>
  argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? padrao
const pais = opt('pais', 'us')
const TETO = Number(opt('teto', '1100'))

if (!data) {
  console.error('❌ falta a data: npx tsx scripts/medir-weekly.ts YYYY-MM-DD')
  process.exit(1)
}

/**
 * 🔴 O LOADER CAI PARA O INGLÊS, e o medidor precisa saber a diferença.
 *
 * Achado na PRIMEIRA execução deste script, em 10/Set/2026, com só o inglês
 * escrito: ele imprimiu as MESMAS 33 ocorrências numéricas nos três idiomas e
 * declarou "o gate numérico passou". Estava comparando o inglês com ele mesmo.
 *
 * O fallback é regra do produto e está certo: falta de tradução entrega o
 * original em vez de entregar português a um leitor americano. Errado seria o
 * conferidor tratar isso como conferência, porque um gate que aprova o que não
 * existe é pior que gate nenhum: ele produz um verde no relatório.
 *
 * A pergunta é sobre o DISCO, não sobre o objeto carregado.
 */
function traduzido(loc: string): boolean {
  if (loc === LOCALE_ORIGEM) return existsSync(join(dirDoPais(pais), `${data}.md`))
  return existsSync(join(dirDoPais(pais), `${data}.${loc}.md`))
}

/**
 * 📏 O QUE É O CORPO, e a lista está aqui em vez de na cabeça de quem conta.
 *
 * A régua do /weekly-usa: título, TL;DR, moneyIntro, os `desc` dos cards,
 * moneyFootnote, pollsIntro, a nota de dispersão, a narrativa, as alegações, a
 * medição, os cruzamentos e o howToRead. `methodology` e `sources` ficam FORA,
 * por serem rodapé de procedência e não leitura corrida.
 */
function pedacosDoCorpo(d: any): { campo: string; texto: string }[] {
  const out: { campo: string; texto: string }[] = []
  const push = (campo: string, v: unknown) => {
    if (typeof v === 'string' && v.trim()) out.push({ campo, texto: v })
  }
  push('title', d.title)
  ;(d.tldr ?? []).forEach((t: string, i: number) => push(`tldr[${i}]`, t))
  push('moneyIntro', d.moneyIntro)
  ;(d.cards ?? []).forEach((c: any, i: number) => push(`cards[${i}].desc`, c?.desc))
  push('moneyFootnote', d.moneyFootnote)
  push('pollsIntro', d.pollsIntro)
  push('dispersion.note', d.dispersion?.note)
  ;(d.coverage?.narrative ?? []).forEach((t: string, i: number) => push(`coverage.narrative[${i}]`, t))
  ;(d.coverage?.claims ?? []).forEach((c: any, i: number) => {
    push(`coverage.claims[${i}].outlet`, c?.outlet)
    push(`coverage.claims[${i}].claim`, c?.claim)
  })
  push('coverage.measurement', d.coverage?.measurement)
  ;(d.crossings ?? []).forEach((c: any, i: number) => {
    push(`crossings[${i}].label`, c?.label)
    push(`crossings[${i}].text`, c?.text)
  })
  push('howToRead.title', d.howToRead?.title)
  push('howToRead.text', d.howToRead?.text)
  return out
}

/** Palavras de leitura: a marcação some, o número fica. */
function palavras(txt: string): number {
  return txt
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

/**
 * 🔢 O GATE NUMÉRICO, e o padrão é o que já custou um verde falso.
 *
 * Em 03/Set o gate terminava o padrão com `\b`, que NÃO casa depois de `%`, e
 * por isso conferia só `pp` e `M` e ignorava todo percentual. Aqui o número e a
 * unidade são capturados juntos e sem âncora de fim de palavra.
 *
 * ⛔ E a unidade tem de ser SÍMBOLO, nunca palavra. A primeira versão aceitava
 * `points`, e isso quebra o gate no dia em que ele serve para algo: "10 points"
 * vira "10 pontos" e "10 puntos", e o multiconjunto acusaria divergência numa
 * tradução correta. Falso vermelho ensina a ignorar o portão, que é como se
 * perde um portão. Número com unidade por extenso fica para a leitura inteira
 * das três versões, que segue obrigatória.
 */
function numerosCom(txt: string): string[] {
  const limpo = txt.replace(/\*\*/g, '')
  const achados: string[] = []
  for (const m of limpo.matchAll(/(\d[\d.,]*)\s*(%|pp|M\b)/gi)) {
    achados.push(`${m[1]}${m[2].toLowerCase().replace(/\s+/g, '')}`)
  }
  return achados.sort()
}

console.log('')
console.log(`📐 MEDIDOR DA WEEKLY · ${data} · pais=${pais} · teto do corpo ${TETO}`)
console.log('   fonte: o LOADER, que é o que o leitor recebe, não o markdown')

const porIdioma: Record<string, { total: number; nums: string[]; ok: boolean }> = {}

for (const loc of SUPPORTED_LOCALES) {
  console.log('')
  console.log('─'.repeat(72))
  if (!traduzido(loc)) {
    console.log(`⏳ ${loc.padEnd(6)} SEM ARQUIVO PRÓPRIO: a página serve o ${LOCALE_ORIGEM} por fallback.`)
    console.log('   Isso não é medição deste idioma e não entra no gate. Traduzir e rodar de novo.')
    porIdioma[loc] = { total: 0, nums: [], ok: false }
    continue
  }
  const d: any = loadWeekly(data, loc, pais as any)
  if (!d) {
    console.log(`❌ ${loc}: o loader devolveu NULL. O arquivo existe, então o frontmatter não abre.`)
    porIdioma[loc] = { total: 0, nums: [], ok: false }
    continue
  }

  // 1. BLOCOS. Zero, ou narrativa ausente, é bloco que não aparece na página.
  const blocos = {
    tldr: d.tldr?.length ?? 0,
    cards: d.cards?.length ?? 0,
    cruzamentos: d.crossings?.length ?? 0,
    fontes: d.sources?.length ?? 0,
    narrativa: d.coverage?.narrative?.length ?? 0,
    alegacoes: d.coverage?.claims?.length ?? 0,
  }
  const faltando = Object.entries(blocos).filter(([k, v]) => v === 0 && k !== 'alegacoes')
  console.log(
    `📦 ${loc.padEnd(6)} tldr=${blocos.tldr} cards=${blocos.cards} cruzamentos=${blocos.cruzamentos} ` +
      `fontes=${blocos.fontes} narrativa=${blocos.narrativa} alegacoes=${blocos.alegacoes}`
  )
  if (faltando.length) {
    console.log(`   🔴 bloco(s) em ZERO: ${faltando.map(([k]) => k).join(', ')}. Isso não vai aparecer na página.`)
  }
  if (!d.coverage?.narrative?.length) {
    console.log('   🔴 narrativa AUSENTE: ela é obrigatória desde 03/Ago/2026, e seção 4 vazia é defeito meu, não da semana.')
  }

  // 2. PALAVRAS do corpo, campo a campo, para o corte saber onde pegar.
  const pedacos = pedacosDoCorpo(d)
  const total = pedacos.reduce((a, p) => a + palavras(p.texto), 0)
  const folga = TETO - total
  /**
   * 📏 O TETO SE AFERE NO IDIOMA DE ORIGEM, que no Weekly é o inglês.
   *
   * Português e espanhol saem naturalmente 10% a 20% mais longos, e cortar a
   * tradução para caber no teto do original significa cortar informação que o
   * leitor da origem recebeu. A régua equivalente da daily está medida em
   * memory/feedback_afos_daily_teto_900_palavras.md, com a origem invertida.
   */
  const naOrigem = loc === LOCALE_ORIGEM
  const veredito = folga >= 0 ? `folga de ${folga}` : naOrigem ? `🔴 ${-folga} ACIMA do teto` : `${-folga} acima do teto do inglês, o que é esperado nesta língua`
  console.log(`📏 corpo: ${total} palavras em ${pedacos.length} campos · ${veredito}`)
  const maiores = [...pedacos].sort((a, b) => palavras(b.texto) - palavras(a.texto)).slice(0, 5)
  console.log(`   os 5 maiores: ${maiores.map((p) => `${p.campo} ${palavras(p.texto)}`).join(' · ')}`)

  // 3. NÚMEROS com unidade, para o gate entre idiomas.
  const nums = pedacos.flatMap((p) => numerosCom(p.texto)).sort()
  const distintos = new Set(nums)
  console.log(`🔢 números com unidade: ${nums.length} ocorrências, ${distintos.size} distintos`)

  porIdioma[loc] = { total, nums, ok: true }
}

console.log('')
console.log('─'.repeat(72))
const presentes = Object.entries(porIdioma).filter(([, v]) => v.ok)
if (presentes.length < 2) {
  const faltam = SUPPORTED_LOCALES.filter((l) => !porIdioma[l]?.ok)
  console.log(`🔢 GATE NUMÉRICO: NÃO RODOU. Falta arquivo próprio em ${faltam.join(', ')}.`)
  console.log('   ⛔ Isto NÃO é aprovação, e a ausência de vermelho aqui não vale nada:')
  console.log('      com um idioma só, comparar seria comparar o texto com ele mesmo.')
} else {
  const [refLoc, ref] = presentes[0]
  let divergiu = false
  for (const [loc, v] of presentes.slice(1)) {
    const a = ref.nums.join('|')
    const b = v.nums.join('|')
    if (a === b) {
      console.log(`✅ ${loc} bate com ${refLoc}: ${v.nums.length} ocorrências idênticas`)
    } else {
      divergiu = true
      const soRef = ref.nums.filter((x) => !v.nums.includes(x))
      const soLoc = v.nums.filter((x) => !ref.nums.includes(x))
      console.log(`🔴 ${loc} DIVERGE de ${refLoc}`)
      if (soRef.length) console.log(`   só em ${refLoc}: ${soRef.join(', ')}`)
      if (soLoc.length) console.log(`   só em ${loc}: ${soLoc.join(', ')}`)
    }
  }
  console.log(divergiu ? '\n🔴 VEREDITO: o gate numérico REPROVOU' : '\n✅ VEREDITO: o gate numérico passou')
  console.log('   ⚠️ Ele confere NÚMERO, não sentido. Ler as três versões inteiras continua obrigatório:')
  console.log('      30 erros de tradução já passaram por varredura automática nesta casa.')
}
console.log('')
