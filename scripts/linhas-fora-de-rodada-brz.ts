/**
 * linhas-fora-de-rodada-brz.ts — dá NOME às linhas que entraram no banco entre duas
 * rodadas registradas do TSE, e diz quais caíram em minuto de cron.
 *
 * 🔴 POR QUE EXISTE: a rodada imprime "N linha(s) entraram no banco SEM rodada
 *    registrada" e para aí. Em 01/Out/2026 a linha era 1, municipal, gravada pelo
 *    `/api/cron/refresh-polls` às 18:00:10Z, o cron que a régua dava como morto. Em
 *    03/Out eram 7. A consulta foi feita à mão as duas vezes, e régua que depende de
 *    consulta à mão é régua que alguém pula. → memory/project_state_01out_brz_pesquisas.md
 *
 * 🔑 A janela sai sozinha do `data/tse/historico-arquivo.jsonl`: começa na PENÚLTIMA
 *    rodada e termina na ÚLTIMA, que é a que acabou de imprimir o aviso. Gravação do
 *    cron não anota esse arquivo, por isso ela aparece como sobra na subtração.
 *
 * 📌 Minuto de cron = 06, 12 ou 18 UTC com minuto 00, que é o `0 6,12,18 * * *` do
 *    vercel.json. Linha fora desses minutos e fora de rodada é outra coisa (ingestão
 *    à mão, outro script) e sai marcada como tal.
 *
 * ⛔ Só lê. Não grava, não corrige e não apaga nada.
 *
 * Uso:
 *   npx tsx scripts/linhas-fora-de-rodada-brz.ts            # entre as duas últimas rodadas
 *   npx tsx scripts/linhas-fora-de-rodada-brz.ts --desde=2026-10-02T18:48:41Z
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })
import { readFileSync } from 'fs'

const HISTORICO = 'data/tse/historico-arquivo.jsonl'
const CRON_HORAS = ['06', '12', '18']

/**
 * 🔴 06/Out/2026: o carimbo `quando` da rodada é gravado DEPOIS da inserção, então
 *    as linhas que a ÚLTIMA rodada inseriu têm `createdAt` uns instantes antes dele
 *    e caíam dentro da janela, saindo como "OUTRO" e acendendo "conferir quem
 *    gravou". Medido no dia: 3 de 8 linhas eram da própria rodada (17:27:48 contra
 *    17:27:49). A rodada declara quantas inseriu (`inseridas`), e é por esse número,
 *    não por palpite, que elas saem como RODADA: as N últimas até 10 minutos antes
 *    do carimbo. O que passar de N no intervalo continua acusado.
 */
const FOLGA_RODADA_MS = 10 * 60_000

function janela(): { desde: Date; ate: Date | null; inseridasNaUltima: number } {
  const arg = process.argv.find((a) => a.startsWith('--desde='))
  if (arg) return { desde: new Date(arg.slice(8)), ate: null, inseridasNaUltima: 0 }
  const linhas = readFileSync(HISTORICO, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  if (linhas.length < 2) throw new Error(`${HISTORICO} tem menos de duas rodadas: não há janela entre rodadas`)
  return { desde: new Date(linhas.at(-2).quando), ate: new Date(linhas.at(-1).quando), inseridasNaUltima: Number(linhas.at(-1).inseridas ?? 0) }
}

/** Índices (em `r`, ordenado por createdAt) das linhas que são da própria última rodada. */
export function linhasDaRodada(datas: Date[], ate: Date | null, n: number): Set<number> {
  const out = new Set<number>()
  if (!ate || n <= 0) return out
  for (let i = datas.length - 1; i >= 0 && out.size < n; i--) {
    const dt = ate.getTime() - datas[i].getTime()
    if (dt >= 0 && dt <= FOLGA_RODADA_MS) out.add(i)
    else break
  }
  return out
}

async function main() {
  const { desde, ate, inseridasNaUltima } = janela()
  if (Number.isNaN(desde.getTime())) throw new Error('data de início inválida')
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) {
    console.error('❌ sem banco: não dá para listar, e isso NÃO quer dizer que a janela está vazia.')
    process.exit(2)
  }
  const where = { createdAt: ate ? { gt: desde, lt: ate } : { gt: desde } }
  const r = await prisma.researchFinding.findMany({ where, select: { title: true, createdAt: true, rawPayload: true }, orderBy: { createdAt: 'asc' } })
  console.log(`\n🔎 LINHAS FORA DE RODADA · de ${desde.toISOString()} até ${ate ? ate.toISOString() : 'agora'}`)
  const daRodada = linhasDaRodada(r.map((d) => d.createdAt), ate, inseridasNaUltima)
  let cron = 0
  let outro = 0
  r.forEach((d, i) => {
    const p = (d.rawPayload ?? {}) as Record<string, unknown>
    const t = d.createdAt.toISOString()
    const ehCron = CRON_HORAS.includes(t.slice(11, 13)) && t.slice(14, 16) === '00'
    const rot = daRodada.has(i) ? 'RODADA' : ehCron ? 'CRON  ' : 'OUTRO '
    if (!daRodada.has(i)) ehCron ? cron++ : outro++
    const casa = String(p.institutoFantasia || p.instituto || '?').slice(0, 30)
    const plano = String(p.planoAmostral || '').replace(/\s+/g, ' ').slice(0, 60)
    console.log(`   ${d.title}  ${t}  ${rot}  ${String(p.cargo ?? '?').padEnd(10)} n=${String(p.amostra ?? '?').padEnd(5)} div ${p.divulgacao ?? '?'}  ${casa}  | ${plano}`)
  })
  console.log(`\n   ${r.length} linha(s): ${daRodada.size} da própria última rodada (declarou ${inseridasNaUltima}), ${cron} em minuto de cron (06, 12 ou 18 UTC, minuto 00), ${outro} de outra origem.`)
  if (daRodada.size < Math.min(inseridasNaUltima, r.length) && ate) console.log(`   ⚠️ a rodada declarou ${inseridasNaUltima} inserção(ões) e só ${daRodada.size} caíram nos 10 min antes do carimbo: conferir.`)
  if (outro > 0) console.log('   ⚠️ há linha FORA de minuto de cron e fora de rodada: conferir quem gravou antes de seguir.')
}
// Só roda quando chamado direto: o teste importa `linhasDaRodada` sem tocar no banco.
if (/linhas-fora-de-rodada-brz\.ts$/.test(process.argv[1] ?? '')) main()
