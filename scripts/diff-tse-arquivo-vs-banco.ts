/**
 * diff-tse-arquivo-vs-banco.ts — compara o REGISTRO do TSE com o que o Neon guarda.
 *
 * Uso:
 *   npx tsx scripts/diff-tse-arquivo-vs-banco.ts            # baixa o ZIP daqui
 *   npx tsx scripts/diff-tse-arquivo-vs-banco.ts <arquivo>  # modo ARQUIVO
 *
 * 🔴 POR QUE ISTO EXISTE. Medido em 02/Set/2026: a ingestão gravou "4 inserida(s),
 * 753 já existente(s)" com 757 presidenciais no arquivo, contra 756 no dia anterior.
 * O arquivo cresceu UMA linha e QUATRO protocolos eram novos para o banco. A conta
 * só fecha se o arquivo do TSE também PERDE registros entre um dia e outro.
 *
 * 🔑 O `persistPolls` deduplica por `protocolo` e nunca apaga. Isso é o certo para
 * não perder trilha, mas tem uma consequência que nenhum portão media: o banco
 * ACUMULA protocolos que saíram do registro oficial. Quem lê o banco vê pesquisa
 * "registrada e não divulgada" onde o TSE já não tem registro nenhum.
 *
 * ⚠️ Este script NÃO grava e NÃO apaga. Ele só mede as duas diferenças:
 *   - no arquivo e fora do banco  → entraria na próxima ingestão
 *   - no banco e fora do arquivo  → saiu do registro oficial depois de ingerida
 *
 * A decisão sobre o que fazer com a segunda lista é do André, não deste script.
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { readFileSync, existsSync } from 'fs'
import { parseTSEZipBytes, fetchTSEPolls, detectScope } from '../lib/tse/ingest'
import type { TSEPoll } from '../lib/tse/ingest'

const ANO = 2026

// Mesma armadilha do ingest-tse-local: `lib/db` resolve a DATABASE_URL na hora
// em que é carregado. Import estático no topo carrega antes do dotenv e o prisma
// nasce nulo, o que aqui apareceria como "o banco está vazio".
async function carregarPrisma() {
  return (await import('../lib/db')).getPrisma()
}

const PROTOCOLO = /^[A-Z]{2}\d{9}$/

function ehNacional(p: { metodologia?: string; planoAmostral?: string; dadoMunicipio?: string }) {
  return detectScope(p.metodologia as string, p.planoAmostral as string, p.dadoMunicipio as string) === 'national'
}

async function main() {
  const caminho = process.argv.slice(2).find((a) => !a.startsWith('--'))

  let polls: TSEPoll[]
  if (caminho) {
    if (!existsSync(caminho)) {
      console.error(`❌ Arquivo não encontrado: ${caminho}`)
      process.exit(1)
    }
    const bytes = readFileSync(caminho)
    if (!(bytes[0] === 0x50 && bytes[1] === 0x4b)) {
      console.error('❌ Isto não é um ZIP (faltam os bytes "PK" no início).')
      process.exit(1)
    }
    polls = await parseTSEZipBytes(bytes, ANO)
  } else {
    console.log('\n🌐 modo REDE: baixando do TSE com o mesmo cliente do cron…')
    polls = await fetchTSEPolls(ANO)
  }

  const prisma = await carregarPrisma()
  if (!prisma) {
    console.error('❌ Sem banco. Sem DATABASE_URL não há o que comparar, e ZERO aqui não é medição.')
    process.exit(1)
  }

  const noArquivo = new Map<string, TSEPoll>()
  for (const p of polls) if (p.protocolo) noArquivo.set(p.protocolo, p)

  const linhas = await prisma.researchFinding.findMany({ select: { title: true } })
  const noBanco = new Set(linhas.map((l) => l.title).filter((t): t is string => !!t && PROTOCOLO.test(t)))

  // 🔒 Portão de colapso: arquivo vazio ou banco vazio invalida a comparação
  // inteira, e o resultado pareceria um achado enorme em vez de uma leitura ruim.
  if (noArquivo.size === 0 || noBanco.size === 0) {
    console.error(`\n❌ Comparação inválida: arquivo ${noArquivo.size}, banco ${noBanco.size}. Não reportar isto como diferença.`)
    process.exit(1)
  }

  const soNoArquivo = [...noArquivo.keys()].filter((p) => !noBanco.has(p))
  const soNoBanco = [...noBanco].filter((p) => !noArquivo.has(p))

  console.log(`\n📊 Presidenciais no arquivo do TSE: ${noArquivo.size}`)
  console.log(`   Protocolos no Neon: ${noBanco.size}`)
  console.log(`   Em comum: ${noArquivo.size - soNoArquivo.length}`)

  console.log(`\n➕ No arquivo e FORA do banco: ${soNoArquivo.length}  (entrariam na próxima ingestão)`)
  for (const p of soNoArquivo.slice(0, 30)) {
    const r = noArquivo.get(p)!
    const escopo = ehNacional(r) ? 'NACIONAL' : 'sub'
    console.log(`   ${p}  ${escopo.padEnd(8)} div ${r.divulgacao}  campo ${r.campoInicio} a ${r.campoFim}  ${(r.institutoFantasia || r.instituto).slice(0, 34)}`)
  }
  if (soNoArquivo.length > 30) console.log(`   … e mais ${soNoArquivo.length - 30}`)

  console.log(`\n➖ No banco e FORA do arquivo: ${soNoBanco.length}  (saíram do registro oficial DEPOIS de ingeridas)`)
  if (soNoBanco.length > 0) {
    const detalhe = await prisma.researchFinding.findMany({
      where: { title: { in: soNoBanco } },
      select: { title: true, rawPayload: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    for (const d of detalhe.slice(0, 40)) {
      const r = (d.rawPayload || {}) as Record<string, string>
      const escopo = ehNacional(r) ? 'NACIONAL' : 'sub'
      console.log(`   ${d.title}  ${escopo.padEnd(8)} div ${r.divulgacao ?? '?'}  campo ${r.campoInicio ?? '?'} a ${r.campoFim ?? '?'}  ${(r.institutoFantasia || r.instituto || '?').slice(0, 34)}  ingerida ${d.createdAt.toISOString().slice(0, 10)}`)
    }
    if (detalhe.length > 40) console.log(`   … e mais ${detalhe.length - 40}`)

    const nacionais = detalhe.filter((d) => ehNacional((d.rawPayload || {}) as Record<string, string>))
    console.log(`\n   Dessas, NACIONAIS: ${nacionais.length}`)
  }

  // `--json=<caminho>` despeja a comparação inteira para análise sem baixar o ZIP
  // de novo. Cada ida ao TSE é uma chamada à borda que já bloqueou o cron.
  const destino = process.argv.slice(2).find((a) => a.startsWith('--json='))?.slice(7)
  if (destino) {
    const detalhe = await prisma.researchFinding.findMany({
      where: { title: { in: soNoBanco } },
      select: { title: true, rawPayload: true, createdAt: true },
    })
    const { writeFileSync } = await import('fs')
    writeFileSync(
      destino,
      JSON.stringify(
        {
          medidoEm: new Date().toISOString(),
          totalArquivo: noArquivo.size,
          totalBanco: noBanco.size,
          protocolosBanco: [...noBanco],
          soNoArquivo: soNoArquivo.map((p) => noArquivo.get(p)),
          soNoBanco: detalhe.map((d) => ({ title: d.title, ingerida: d.createdAt.toISOString(), ...(d.rawPayload as object) })),
        },
        null,
        2,
      ),
    )
    console.log(`\n💾 despejo em ${destino}`)
  }

  console.log('\n📌 Este script não grava e não apaga. A lista de baixo é para decidir, não para agir sozinho.')
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
