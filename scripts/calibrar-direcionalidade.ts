/**
 * Calibração da DIRECIONALIDADE de uma janela de 24h.
 *
 * deriva        = última menos primeira (o que o portão já mede)
 * variacaoTotal = soma dos |passos| (o caminho que a série percorreu)
 * direcionalidade = |deriva| / variacaoTotal, entre 0 e 1
 *
 * 1.00 = monótona, todo passo na mesma direção
 * 0.00 = voltou exatamente ao ponto de partida
 *
 * O caso que criou a regra da deriva (governors, 15/Set/2026) é descrito no
 * código como "quase monótona, com UMA travessia". Se a régua está certa, ele
 * tem de sair com direcionalidade ALTA. O turnout de hoje, que troca de direção
 * seis vezes, tem de sair BAIXO.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { DISTRIBUICOES_US } from '../lib/us-market/mercados'

const JANELA = 24 * 3600 * 1000

async function main() {
  const { getPrisma } = await import('../lib/db')
  // ⛔ `getPrisma()` e SINCRONO e devolve `PrismaClient | null`. Sem esta guarda
  //    o `npm run build` reprova com TS18047, porque ele faz type-check de
  //    `scripts/` tambem, e ai NENHUM deploy sai, de faixa nenhuma.
  //
  // 🔴 Isto passou em 29/Set/2026 porque eu rodei o script com `tsx`, que APAGA
  //    os tipos sem conferi-los: a execucao deu certo e me deu confianca falsa.
  //    Script rodar no tsx nao e o mesmo que o projeto compilar.
  //
  // 📌 E a mensagem segue a da casa: sem banco NAO quer dizer que esta tudo em
  //    ordem, quer dizer que nao deu para olhar.
  const prisma = getPrisma()
  if (!prisma) {
    console.error('\n   ⚠️ SEM BANCO: DATABASE_URL ausente ou invalida.')
    console.error('      Isto NAO calibra nada e NAO confirma o limiar. Quer dizer que nao deu para medir.')
    process.exit(1)
  }

  console.log('\n📐 DIRECIONALIDADE das janelas de 24h · |deriva| / variacao total\n')

  for (const m of DISTRIBUICOES_US) {
    const pontos = await prisma.marketPrice.findMany({
      where: { market: { slug: m.slug } },
      select: { price: true, snapshotAt: true, outcome: { select: { outcomeName: true } } },
      orderBy: { snapshotAt: 'asc' },
    })
    if (!pontos.length) continue

    const porT = new Map<number, Record<string, number>>()
    for (const p of pontos) {
      const t = p.snapshotAt.getTime()
      if (!porT.has(t)) porT.set(t, {})
      porT.get(t)![p.outcome?.outcomeName ?? ''] = p.price
    }
    const maxFaixas = Math.max(...[...porT.values()].map((l) => Object.keys(l).length))
    const minFaixas = Math.max(2, Math.floor(maxFaixas * 0.8))
    const caps = [...porT.entries()]
      .map(([t, linha]) => ({ t, soma: Object.values(linha).reduce((a, b) => a + b, 0), n: Object.keys(linha).length }))
      .filter((c) => c.n >= minFaixas)
      .sort((a, b) => a.t - b.t)

    // uma janela por dia, ancorada no fim de cada dia gravado
    const dias = [...new Set(caps.map((c) => new Date(c.t).toISOString().slice(0, 10)))]
    const linhas: { dia: string; n: number; deriva: number; total: number; dir: number; viradas: number }[] = []
    for (const dia of dias) {
      const fim = Math.max(...caps.filter((c) => new Date(c.t).toISOString().slice(0, 10) === dia).map((c) => c.t))
      const j = caps.filter((c) => c.t > fim - JANELA && c.t <= fim)
      if (j.length < 4) continue
      const deriva = j[j.length - 1].soma - j[0].soma
      let total = 0
      let viradas = 0
      let sinalAnt = 0
      for (let i = 1; i < j.length; i++) {
        const d = j[i].soma - j[i - 1].soma
        total += Math.abs(d)
        const s = Math.sign(d)
        if (s !== 0) {
          if (sinalAnt !== 0 && s !== sinalAnt) viradas++
          sinalAnt = s
        }
      }
      linhas.push({ dia, n: j.length, deriva, total, dir: total > 0 ? Math.abs(deriva) / total : 0, viradas })
    }
    if (!linhas.length) continue

    const dirs = linhas.map((l) => l.dir).sort((a, b) => a - b)
    const q = (p: number) => dirs[Math.min(dirs.length - 1, Math.floor(p * dirs.length))]
    console.log(`── ${m.key}  (${linhas.length} janelas)`)
    console.log(`   direcionalidade: min ${dirs[0].toFixed(2)} · p25 ${q(0.25).toFixed(2)} · mediana ${q(0.5).toFixed(2)} · p75 ${q(0.75).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · max ${dirs[dirs.length - 1].toFixed(2)}`)
    const ultimas = linhas.slice(-3)
    for (const l of ultimas)
      console.log(`   ${l.dia}  n=${String(l.n).padStart(2)}  deriva ${l.deriva >= 0 ? '+' : ''}${l.deriva.toFixed(2).padStart(6)}pp  caminho ${l.total.toFixed(2).padStart(6)}pp  viradas ${String(l.viradas).padStart(2)}  →  dir ${l.dir.toFixed(2)}`)
    // o caso que criou a regra
    const caso = linhas.find((l) => l.dia === '2026-09-15')
    if (caso) console.log(`   ⭐ 15/Set (caso da regra): deriva ${caso.deriva.toFixed(2)}pp · caminho ${caso.total.toFixed(2)}pp · viradas ${caso.viradas} · dir ${caso.dir.toFixed(2)}`)
    console.log()
  }
  await prisma.$disconnect()
}
main()
