/**
 * Confere superlativo contra a série INTEIRA, direto no Neon.
 *
 * POR QUE EXISTE
 * O Guardrail #3 do /atualizar-brz manda verificar "o maior do ciclo" com
 * /api/market/history. Esse endpoint NÃO consegue provar isso:
 *
 *   - `days` é travado em 90 por Math.min (app/api/market/history/route.ts:23),
 *     então days=365 devolve exatamente a mesma janela que days=90;
 *   - o take:1000 pega os pontos mais ANTIGOS da janela, então uma janela larga
 *     ainda por cima corta o lado NOVO da série.
 *
 * Resultado: quem confere "do ciclo" por ali está medindo 90 dias e chamando de
 * ciclo. Em 25/Jul/2026 o banco tinha série desde 14/Abr, 12 dias além do que a
 * API mostrava. Foi um superlativo mal verificado que foi errado a produção em
 * 19/Jul ("a mais larga do ciclo" quando o pico era 4,65pp maior e a série vinha
 * estreitando havia duas semanas).
 *
 * 🔴 CORRIGIDO EM 11/Ago/2026, E ESTE É O PONTO CENTRAL DESTE ARQUIVO.
 * A versão anterior montava só o FECHAMENTO de cada dia ("em ordem asc, o último
 * a escrever vence") e imprimia esse valor sob o rótulo "MÁXIMO". São grandezas
 * diferentes, e a diferença foi a produção:
 *
 *   - o topo real do Flávio é 34,40%, num ponto de 13/Mai às 20:00 BRT;
 *   - o fechamento daquele dia, às 22:30, é 32,50%;
 *   - quem só olha fechamento conclui que o topo da série é 33,20%, de 02/Jun.
 *
 * Em 11/Ago eu publiquei 33,20% "corrigindo" um 34,40% que estava certo, e o
 * mesmo defeito trocou o piso do Renan de 6,80% para 6,90%. Por isso agora este
 * script mede as DUAS coisas e AVISA quando elas divergem:
 *
 *   TOPO e PISO      -> máximo e mínimo de TODOS os pontos (é o que "topo" quer dizer)
 *   DIAS >= ALVO     -> contagem sobre o valor representativo do DIA
 *
 * 📏 A JANELA PUBLICADA É DE 90 DIAS, decisão do André em 11/Ago/2026.
 * O banco guarda mais que isso (118 dias em 11/Ago, desde 14/Abr), e a série
 * completa dá OUTROS extremos: o topo do Flávio é 45,50% em 06/Mai na série
 * inteira e 34,40% em 13/Mai na janela de 90 dias. As duas são verdadeiras, e
 * publicar uma com a etiqueta da outra é o defeito. Por isso:
 *
 *   --dias=90  mede a MESMA janela que o painel publica  <- use este para conferir texto
 *   sem a flag mede a série inteira do banco, que é mais funda e não é a publicada
 *
 * Regra da casa: escrever "na série de 90 dias" e conferir com --dias=90. Se um
 * dia a janela publicada mudar, muda nos dois lugares no mesmo commit.
 *
 * Uso:
 *   npx tsx scripts/check-superlativo.ts                          # gap, série inteira
 *   npx tsx scripts/check-superlativo.ts "Renan Santos"
 *   npx tsx scripts/check-superlativo.ts "Flávio" --dias=90 --alvo=27.25
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

const SLUG = 'brazil-presidential-election'

/** O banco persiste o nome CURTO ("Lula"); a API ao vivo devolve o completo. */
function ehLula(nome: string) { return /^(Lula|Luiz In)/i.test(nome) }
function ehFlavio(nome: string) { return /^Fl.vio Bolsonaro/i.test(nome) }

/**
 * Dia em BRT, não em UTC. O AFOS publica em BRT, e agrupar em UTC joga a leitura
 * das 21h para o dia seguinte, o que faz "o topo foi em tal dia" mudar de data
 * sem nenhum motivo visível para quem lê a peça.
 */
function diaBRT(d: Date): string {
  return new Date(d.getTime() - 3 * 3600 * 1000).toISOString().slice(0, 10)
}
function horaBRT(d: Date): string {
  return new Date(d.getTime() - 3 * 3600 * 1000).toISOString().slice(11, 16)
}

async function main() {
  const args = process.argv.slice(2)
  const alvoNum = ((): number | null => {
    const a = args.find(x => x.startsWith('--alvo='))
    if (!a) return null
    const v = Number(a.slice(7).replace(',', '.'))
    return Number.isFinite(v) ? v : null
  })()
  const nomeAlvo = args.find(x => !x.startsWith('--'))?.trim()
  const janelaDias = ((): number | null => {
    const a = args.find(x => x.startsWith('--dias='))
    if (!a) return null
    const v = Number(a.slice(7))
    return Number.isFinite(v) && v > 0 ? v : null
  })()
  /**
   * Borda DIREITA da janela. Sem isto a janela é contada de AGORA, e uma janela
   * que rola sozinha faz a frase publicada envelhecer no mesmo dia: em 11/Ago o
   * topo do Flávio na janela de 90 dias era 34,40% às 18:22 BRT e passou a ser
   * 33,20% às 20:20 BRT, porque o ponto de 34,40% ficou 3 horas fora da borda.
   * Para conferir texto publicado, ancorar no CARIMBO DA PEÇA.
   */
  const ate = ((): Date | null => {
    const a = args.find(x => x.startsWith('--ate='))
    if (!a) return null
    const d = new Date(a.slice(6))
    return Number.isNaN(d.getTime()) ? null : d
  })()

  const { prisma } = await import('../lib/db')
  if (!prisma) { console.error('SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  const bordaDireita = ate ?? new Date()
  const corte = janelaDias != null ? new Date(bordaDireita.getTime() - janelaDias * 86400_000) : null
  const pontos = await prisma.marketPrice.findMany({
    where: {
      market: { slug: SLUG },
      ...(corte ? { snapshotAt: { gte: corte, lte: bordaDireita } } : ate ? { snapshotAt: { lte: bordaDireita } } : {}),
    },
    select: { price: true, snapshotAt: true, outcome: { select: { outcomeName: true } } },
    orderBy: { snapshotAt: 'asc' },
  })
  if (pontos.length === 0) { console.error('série vazia'); process.exit(1) }

  // 1) agrupa por MOMENTO exato, para que o gap use os dois nomes da MESMA captura
  const porMomento = new Map<number, Record<string, number>>()
  for (const p of pontos) {
    const t = p.snapshotAt.getTime()
    if (!porMomento.has(t)) porMomento.set(t, {})
    porMomento.get(t)![p.outcome?.outcomeName ?? ''] = p.price
  }

  // 2) valor pedido em cada momento: TODOS os pontos, nada descartado
  const todos: Array<{ t: number; v: number }> = []
  for (const [t, linha] of [...porMomento.entries()].sort((a, b) => a[0] - b[0])) {
    let v: number | null = null
    if (nomeAlvo) {
      const k = Object.keys(linha).find(n => n.toLowerCase().startsWith(nomeAlvo.toLowerCase()))
      if (k) v = linha[k]
    } else {
      const kl = Object.keys(linha).find(ehLula)
      const kf = Object.keys(linha).find(ehFlavio)
      if (kl && kf) v = linha[kl] - linha[kf]
    }
    if (v != null) todos.push({ t, v })
  }
  if (todos.length === 0) { console.error(`sem pontos para ${nomeAlvo ?? 'o gap'}`); process.exit(1) }

  // 3) por dia: fechamento, máximo e mínimo do dia
  const porDia = new Map<string, number[]>()
  for (const p of todos) {
    const d = diaBRT(new Date(p.t))
    if (!porDia.has(d)) porDia.set(d, [])
    porDia.get(d)!.push(p.v)
  }
  const dias = [...porDia.keys()].sort()

  const u = nomeAlvo ? '%' : 'pp'
  const rotulo = nomeAlvo ? `preço de ${nomeAlvo}` : 'gap Lula − Flávio'
  const fmt = (n: number) => n.toFixed(2).replace('.', ',')

  // EXTREMOS: sobre todos os pontos, que é o que "topo" e "piso" significam
  const maxP = todos.reduce((a, b) => (b.v > a.v ? b : a))
  const minP = todos.reduce((a, b) => (b.v < a.v ? b : a))
  const ultimo = todos[todos.length - 1]

  // os mesmos extremos, mas olhando só fechamento de dia
  const fechos = dias.map(d => ({ d, v: porDia.get(d)![porDia.get(d)!.length - 1] }))
  const maxF = fechos.reduce((a, b) => (b.v > a.v ? b : a))
  const minF = fechos.reduce((a, b) => (b.v < a.v ? b : a))

  console.log(
    janelaDias != null
      ? `\nJANELA DE ${janelaDias} DIAS — ${rotulo}   (a mesma que o painel publica)`
      : `\nSÉRIE INTEIRA DO BANCO — ${rotulo}   ⚠️ NÃO é a janela publicada; use --dias=90 para conferir texto`
  )
  console.log(`  cobertura : ${dias[0]} a ${dias[dias.length - 1]}  (${dias.length} dias, ${todos.length} pontos)`)
  if (janelaDias != null) {
    console.log(`  borda     : até ${diaBRT(bordaDireita)} ${horaBRT(bordaDireita)} BRT` +
      (ate ? '  (ancorada por --ate)' : '  ⚠️ ancorada em AGORA; para conferir texto publicado use --ate com o carimbo da peça'))
  }
  console.log(`\n  📈 TOPO E PISO, sobre TODOS os pontos (é isto que "topo" quer dizer):`)
  console.log(`     TOPO  : ${fmt(maxP.v)}${u} em ${diaBRT(new Date(maxP.t))} às ${horaBRT(new Date(maxP.t))} BRT`)
  console.log(`     PISO  : ${fmt(minP.v)}${u} em ${diaBRT(new Date(minP.t))} às ${horaBRT(new Date(minP.t))} BRT`)
  console.log(`     agora : ${fmt(ultimo.v)}${u} em ${diaBRT(new Date(ultimo.t))} às ${horaBRT(new Date(ultimo.t))} BRT`)

  const divergeMax = Math.abs(maxP.v - maxF.v) > 1e-9
  const divergeMin = Math.abs(minP.v - minF.v) > 1e-9
  if (divergeMax || divergeMin) {
    console.log(`\n  ⚠️  SÓ COM FECHAMENTO DE DIA daria outro número, e é o erro clássico:`)
    if (divergeMax) console.log(`     topo por fechamento : ${fmt(maxF.v)}${u} em ${maxF.d}   (o real é ${fmt(maxP.v)}${u})`)
    if (divergeMin) console.log(`     piso por fechamento : ${fmt(minF.v)}${u} em ${minF.d}   (o real é ${fmt(minP.v)}${u})`)
    console.log(`     Use os de cima. O extremo intradiário é um preço que existiu, e some se`)
    console.log(`     você guardar só a última leitura de cada dia.`)
  } else {
    console.log(`\n  ✅ topo e piso dão o mesmo por fechamento de dia; aqui a distinção não muda nada.`)
  }

  if (alvoNum != null) {
    const porMax = dias.filter(d => Math.max(...porDia.get(d)!) >= alvoNum).length
    const porFecho = fechos.filter(f => f.v >= alvoNum).length
    console.log(`\n  🔢 DIAS COM VALOR >= ${fmt(alvoNum)}${u}, sobre ${dias.length} dias:`)
    console.log(`     por MÁXIMO do dia    : ${porMax}`)
    console.log(`     por FECHAMENTO do dia: ${porFecho}`)
    if (porMax !== porFecho) {
      console.log(`     ⚠️  OS DOIS DIVERGEM. Declare qual você usou, ou o número não é conferível.`)
    } else {
      console.log(`     ✅ iguais, então a frase "${porFecho} de ${dias.length} dias" está segura.`)
    }
  } else {
    console.log(`\n  ℹ️  Passe --alvo=27.25 para contar "N dos ${dias.length} dias tiveram valor igual ou maior".`)
  }

  console.log('\n  --- 8 maiores pontos ---')
  for (const p of [...todos].sort((a, b) => b.v - a.v).slice(0, 8)) {
    console.log(`    ${diaBRT(new Date(p.t))} ${horaBRT(new Date(p.t))}   ${fmt(p.v)}${u}`)
  }

  console.log(
    `\n⚠️  A janela desta série é a do BANCO, não a do mercado. O Polymarket pode ter\n` +
    `   aberto antes de ${dias[0]}. Escreva "o maior desde ${dias[0]}", que é\n` +
    `   verificável, e NÃO "o maior do ciclo", que esta série não prova.\n`
  )
  await prisma.$disconnect()
}

main().catch(e => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
