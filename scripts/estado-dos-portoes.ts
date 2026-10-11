#!/usr/bin/env node
/**
 * 🚦 Para CADA distribuição do painel dos EUA: o ❌ de hoje merece nota?
 *
 * ─── POR QUE ESTE SCRIPT EXISTE ─────────────────────────────────────────────
 *
 * O passo 1 da rodada imprime `❌ REPROVADO` e `✅` e para aí. A régua do
 * `/atualizar-usa` manda decidir pela SÉRIE das últimas 24h, e a rodada não
 * media isso: quem estivesse rodando decidia de cabeça, ou rodava o
 * `check-distribuicao.ts` uma vez por mercado.
 *
 * 🔴 Medido em 15/Set/2026, e custou quatro comandos à mão. `governors` e
 * `houseSeats` saíram os dois com `❌` na mesma leitura, e são coisas opostas:
 * `governors` fecha em 80,78% das capturas, então reprovar ali é EVENTO;
 * `houseSeats` fecha em 36,17%, então reprovar ali é o que ele faz sempre.
 *
 * ⛔ Ele NÃO decide publicar. Distribuição reprovada não vai ao ar como se
 * valesse em nenhuma leitura, e isso não está em discussão. Ele decide se a
 * reprovação entra no RELATÓRIO como movimento.
 *
 * A regra mora em `lib/us-market/estado-do-portao.ts`, com 58 casos plantados.
 * Aqui só tem rede, banco e impressão.
 *
 * ─── COMO RODAR ─────────────────────────────────────────────────────────────
 *
 *   npx tsx scripts/estado-dos-portoes.ts                 # leitura ao vivo + serie
 *   npx tsx scripts/estado-dos-portoes.ts --sem-rede      # usa a ultima captura gravada
 *   npx tsx scripts/estado-dos-portoes.ts --soma=governors:94.20,turnout:96.75
 *   npx tsx scripts/estado-dos-portoes.ts --estatisticas  # a FAIXA da soma de cada livro
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { DISTRIBUICOES_US } from '../lib/us-market/mercados'
import { classificarPortao, type CapturaDaSoma, type EstadoDoPortao } from '../lib/us-market/estado-do-portao'
import { baseDeLeitura } from './lib/base-afos.mjs'

const argv = process.argv.slice(2)
const temFlag = (f: string) => argv.includes(f)
const valor = (f: string) => argv.find((a) => a.startsWith(`${f}=`))?.slice(f.length + 1) ?? null

const fmt = (n: number) => n.toFixed(2).replace('.', ',')

const MARCA: Record<string, string> = {
  'ESTADO NORMAL': '·',
  EVENTO: '🔴',
  OSCILANDO: '🌀',
  'NA BORDA': '⚖️',
  'TRAVESSIA NAO CONFIRMADA': '🔁',
  INDETERMINADO: '⚠️',
}

/** As somas de AGORA, lidas da mesma rota que o passo 1 usa. */
async function somasAoVivo(): Promise<Record<string, number>> {
  const url = `${baseDeLeitura()}/api/polymarket?country=us&fresh=1`
  const r = await fetch(url, { headers: { 'user-agent': 'AFOS-Analytics/1.0 (rodada interna)' } })
  if (!r.ok) throw new Error(`HTTP ${r.status} na leitura ao vivo`)
  const j: any = await r.json()
  const out: Record<string, number> = {}
  for (const m of DISTRIBUICOES_US) {
    const grupo = j?.[m.key] ?? j?.grupos?.[m.key]
    const linhas: any[] = Array.isArray(grupo) ? grupo : (grupo?.markets ?? grupo?.linhas ?? [])
    let soma = 0
    let achou = false
    for (const l of linhas) {
      const p = typeof l?.price === 'number' ? l.price : typeof l?.preco === 'number' ? l.preco : null
      if (p == null) continue
      achou = true
      soma += p > 1.5 ? p : p * 100
    }
    if (achou) out[m.key] = Number(soma.toFixed(2))
  }
  return out
}

async function main() {
  console.log('\n🚦 ESTADO DOS PORTÕES DAS DISTRIBUIÇÕES (EUA)  [USO INTERNO, nao publicar]')

  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) {
    console.error('\n   ⚠️ INDETERMINADO: SEM BANCO, DATABASE_URL ausente ou invalida.')
    console.error('      Isto NAO quer dizer que os portoes estao em ordem. Quer dizer que nao deu para olhar.')
    process.exit(1)
  }

  // ── as somas de agora ───────────────────────────────────────────────────
  let somas: Record<string, number> = {}
  let origemDaSoma = 'leitura ao vivo (fresh=1)'
  const forcadas = valor('--soma')
  if (forcadas) {
    for (const par of forcadas.split(',')) {
      const [k, v] = par.split(':')
      if (k && v && Number.isFinite(Number(v))) somas[k.trim()] = Number(v)
    }
    origemDaSoma = 'valores passados na linha de comando'
  } else if (!temFlag('--sem-rede')) {
    try {
      somas = await somasAoVivo()
    } catch (e) {
      console.log(`   ⚠️ leitura ao vivo falhou (${(e as Error).message}); caindo para a ultima captura gravada`)
      origemDaSoma = 'ultima captura gravada (a leitura ao vivo falhou)'
    }
  } else {
    origemDaSoma = 'ultima captura gravada (--sem-rede)'
  }

  console.log(`   soma de agora: ${origemDaSoma}`)
  console.log(`   janela de 24h e serie inteira: backup/neon, tabela marketPrice\n`)

  const linhas: {
    m: (typeof DISTRIBUICOES_US)[number]
    est: EstadoDoPortao | null
    nota: string
    capturas: CapturaDaSoma[]
  }[] = []

  for (const m of DISTRIBUICOES_US) {
    const pontos = await prisma.marketPrice.findMany({
      where: { market: { slug: m.slug } },
      select: { price: true, snapshotAt: true, outcome: { select: { outcomeName: true } } },
      orderBy: { snapshotAt: 'asc' },
    })
    if (pontos.length === 0) {
      linhas.push({ m, est: null, nota: 'sem serie gravada para este slug', capturas: [] })
      continue
    }

    const porT = new Map<number, Record<string, number>>()
    for (const p of pontos) {
      const t = p.snapshotAt.getTime()
      if (!porT.has(t)) porT.set(t, {})
      porT.get(t)![p.outcome?.outcomeName ?? ''] = p.price
    }
    // ⚠️ Captura incompleta não é captura: uma leitura com metade das faixas
    // somaria baixo e entraria na série como reprovação que nunca existiu.
    // O piso de 80% das faixas é o mesmo do `check-distribuicao.ts`.
    const maxFaixas = Math.max(...[...porT.values()].map((l) => Object.keys(l).length))
    const minFaixas = Math.max(2, Math.floor(maxFaixas * 0.8))
    const capturas: CapturaDaSoma[] = [...porT.entries()]
      .map(([t, linha]) => ({ t, soma: Object.values(linha).reduce((a, b) => a + b, 0), n: Object.keys(linha).length }))
      .filter((c) => c.n >= minFaixas)
      .map(({ t, soma }) => ({ t, soma }))

    const somaAgora = somas[m.key] ?? (capturas.length ? capturas[capturas.length - 1].soma : null)
    if (somaAgora == null) {
      linhas.push({ m, est: null, nota: 'nenhuma captura completa e nenhuma soma de agora', capturas })
      continue
    }
    linhas.push({ m, est: classificarPortao(somaAgora, capturas), nota: '', capturas })
  }

  // ── impressão ───────────────────────────────────────────────────────────
  for (const { m, est, nota } of linhas) {
    if (!est) {
      console.log(`   ⚠️ ${m.key.padEnd(18)} INDETERMINADO — ${nota}`)
      continue
    }
    const marca = MARCA[est.leitura] ?? '·'
    const selo = est.veredito === 'PASSOU' ? '✅' : '❌'
    console.log(
      `   ${marca} ${m.key.padEnd(18)} ${selo} soma ${fmt(est.soma).padStart(7)}%  ·  ${est.leitura}`,
    )
    console.log(`        ${est.motivo}`)
    console.log(
      `        janela ${est.janela.horas}h: ${est.janela.n} captura(s), ${est.janela.passou} passou / ${est.janela.reprovou} reprovou, ` +
        `${est.janela.viradas} virada(s), deriva ${est.janela.derivaPp == null ? 'n/d' : `${est.janela.derivaPp >= 0 ? '+' : ''}${fmt(est.janela.derivaPp)}pp`}`,
    )
    if (est.historico) {
      console.log(
        `        serie: ${est.historico.passou} de ${est.historico.n} fecharam (${fmt(est.historico.taxaPassagem * 100)}%)`,
      )
    }
  }

  const eventos = linhas.filter((l) => l.est?.leitura === 'EVENTO')
  const relerAgora = linhas.filter((l) => l.est?.leitura === 'TRAVESSIA NAO CONFIRMADA')
  const incertos = linhas.filter((l) => !l.est || l.est.leitura === 'INDETERMINADO')

  console.log('')
  if (eventos.length) {
    console.log(`   🔴 ${eventos.length} para o relatorio: ${eventos.map((e) => e.m.key).join(', ')}`)
  } else {
    console.log('   · nenhuma distribuicao fez hoje o contrario do que faz sempre')
  }

  // ── --estatisticas: a FAIXA de cada livro, para nao decorar numero ───────
  // 🔴 POR QUE EXISTE, medido em 11/Out/2026. A skill do /weekly-usa carrega
  //    "popularVoteMargin: mediana 151.90%, faixa de 144.80% a 154.60%, medido
  //    em 04/Set sobre 37 dias", e a memoria carrega o mesmo numero. Em 10 e
  //    11/Out o livro leu 157.30% e 158.10%, ACIMA do maximo registrado nos dois
  //    lugares. Numero tipico escrito a mao envelhece em silencio, e envelhece
  //    em DOIS lugares de uma vez.
  // 📌 Ele le a MESMA serie que o portao acabou de usar, com o mesmo piso de
  //    completude de faixas: nenhuma conta nova nasce aqui.
  if (temFlag('--estatisticas')) {
    const pct = (xs: number[], p: number) => {
      const s = [...xs].sort((a, b) => a - b)
      return s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)))]
    }
    console.log('')
    console.log('   📊 FAIXA DA SOMA, por livro, sobre a serie gravada  [USO INTERNO]')
    console.log('      livro                n      min      p10      p50      p90      max')
    for (const { m, capturas } of linhas) {
      if (!capturas.length) {
        console.log(`      ${m.key.padEnd(18)} (sem captura completa)`)
        continue
      }
      const s = capturas.map((c) => c.soma)
      const col = (x: number) => `${fmt(x)}%`.padStart(9)
      console.log(
        `      ${m.key.padEnd(18)}${String(s.length).padStart(4)}` +
          col(Math.min(...s)) + col(pct(s, 0.1)) + col(pct(s, 0.5)) + col(pct(s, 0.9)) + col(Math.max(...s)),
      )
    }
    console.log('')
    console.log('      ⛔ Isto NAO autoriza publicar distribuicao reprovada: a faixa descreve o')
    console.log('         LIVRO, e livro que nao fecha segue fora da tela. Serve para a ressalva')
    console.log('         obrigatoria quando o popularVoteMargin e citado, e para saber se a soma')
    console.log('         de hoje e tipica do livro ou fora da faixa dele.')
    console.log('      ⚠️ A serie cresce todo dia: este numero se MEDE, nao se decora.')
  }
  if (relerAgora.length) {
    console.log(`   🔁 ${relerAgora.length} RELER antes de relatar: ${relerAgora.map((e) => e.m.key).join(', ')}`)
    console.log('      A leitura ao vivo esta do outro lado do corte e NENHUMA captura gravada da janela')
    console.log('      concorda com ela. Uma leitura nao e um estado: pode ser ruido de sobrepreco e pode')
    console.log('      ser o primeiro instante de um movimento. Reler, como a trava faz com preco.')
  }
  if (incertos.length) {
    console.log(`   ⚠️ ${incertos.length} NAO CONCLUIDO: ${incertos.map((e) => e.m.key).join(', ')}`)
    console.log('      Isto NAO e "em ordem": e o conferidor dizendo que nao deu para medir.')
  }
  console.log('\n   ⛔ Em qualquer leitura, distribuicao reprovada NAO se publica como se valesse.\n')

  await prisma.$disconnect()
  // ⚠️ Saida != 0 aqui e SINAL, nao queda: ou faltou material para medir, ou
  // existe travessia que pede releitura. O comando manda ler a secao, nao o
  // numero. Ver memory/reference_exit_code_do_ambiente_nao_vale_cygdrive.md
  process.exit(incertos.length || relerAgora.length ? 1 : 0)
}

main().catch((e) => {
  console.error('\n⚠️ INDETERMINADO — o conferidor caiu:', (e as Error).message.slice(0, 300))
  console.error('   Isto NAO e "os portoes estao em ordem".')
  process.exit(1)
})
