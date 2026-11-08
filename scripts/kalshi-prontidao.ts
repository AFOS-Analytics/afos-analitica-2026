/**
 * A Kalshi já pode ir para a TELA? Só leitura, nada é gravado.
 *
 *   npx tsx scripts/kalshi-prontidao.ts            # país: fra (o único com Kalshi)
 *   npx tsx scripts/kalshi-prontidao.ts --pais=fra
 *
 * Regra (decisão do André, 08/Nov/2026): 14 dias de captura sem defeito e sem
 * buraco. Ela mora em `lib/kalshi/prontidao.ts`; aqui só se lê o diário
 * `kalshi_capturas` do Neon e se imprime o veredito numa linha greppável.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { avaliarProntidao } from '../lib/kalshi/prontidao'
import { resolverPaisKalshi } from '../lib/kalshi/leitura'

async function main() {
  const pedido = process.argv.find((a) => a.startsWith('--pais='))?.split('=')[1] ?? 'fra'
  const pais = resolverPaisKalshi(pedido)
  if (!pais) throw new Error(`--pais=${pedido} não tem Kalshi. Nunca um país por padrão.`)
  console.log(`Prontidão da Kalshi (${pais.toUpperCase()})`)

  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) throw new Error('SEM BANCO: DATABASE_URL ausente ou inválida')

  const capturas = await prisma.kalshiCaptura.findMany({
    where: { pais },
    select: { startedAt: true, ok: true, defeitos: true },
    orderBy: { startedAt: 'asc' },
  })
  const precos = await prisma.kalshiPreco.count({ where: { captura: { pais } } })
  const p = avaliarProntidao(capturas, new Date())

  console.log(`  capturas registradas : ${p.capturas} (${p.defeituosas} com defeito)`)
  console.log(`  linhas de preço      : ${precos}`)
  console.log(`  maior buraco         : ${p.maiorBuracoMin ?? 'n/a'} min`)
  if (capturas.length) {
    console.log(`  primeira / última    : ${capturas[0].startedAt.toISOString()} / ${(capturas.at(-1) as { startedAt: Date }).startedAt.toISOString()}`)
  }
  for (const m of p.motivos) console.log(`  • ${m}`)
  console.log('')
  console.log(`VEREDITO: ${p.pronto ? 'PRONTO PARA A TELA' : 'AINDA NÃO'}${p.prontoEm && !p.pronto ? ` (previsto ${p.prontoEm.toISOString().slice(0, 10)})` : ''}`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('kalshi-prontidao falhou:', err instanceof Error ? err.message : err)
  console.log('\nVEREDITO: AINDA NÃO')
  process.exit(1)
})
