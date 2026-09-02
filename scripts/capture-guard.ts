/**
 * Trava de captura do Polymarket.
 *
 * POR QUE EXISTE
 * Em 24/Jul/2026 o /atualizar capturou o book às 15h38 num momento de spread
 * largo e publicou. Metade dos deltas estava errada e DOIS TINHAM SINAL
 * INVERTIDO: Michelle e Caiado foram publicados em alta e fecharam em queda.
 * O snapshot passou por todos os validadores porque era internamente coerente,
 * ou seja, os deltas batiam com os valores. O erro estava na ENTRADA.
 * Nenhuma checagem sobre o JSON pega isso. Só a captura pega.
 *
 * COMO FUNCIONA
 * O Polymarket é arbitrado em minutos. Logo, duas leituras independentes
 * separadas por alguns minutos que CONCORDAM são um preço; que DISCORDAM são
 * um book em trânsito. A trava lê duas vezes e só libera se concordarem.
 *
 * As duas leituras usam ?fresh=1, que ignora o cache de dados do proxy. Sem
 * isso a trava leria o mesmo cache duas vezes e aprovaria qualquer coisa.
 *
 * USO
 *   npx tsx scripts/capture-guard.ts                 # padrão, Brasil, 8 min
 *   npx tsx scripts/capture-guard.ts --pais=us       # midterms dos EUA
 *   npx tsx scripts/capture-guard.ts --intervalo=3   # intervalo em minutos
 *   npx tsx scripts/capture-guard.ts --json          # saída JSON para pipeline
 *
 * SAÍDA
 *   Última linha  = `VEREDITO: APROVADO` ou `VEREDITO: BLOQUEADO`
 *   exit 0 = as duas leituras concordam, pode publicar a SEGUNDA
 *   exit 1 = discordam ou proxy degradado, NÃO publicar
 *
 * 🔴 A LINHA `VEREDITO:` É A FONTE DE VERDADE. O exit code é confirmação.
 *
 * Motivo, medido em 10/Ago/2026: o código de saída **pode se perder no
 * caminho** e virar 1 sem que a trava tenha bloqueado nada. Aconteceu num
 * ambiente onde o Git Bash monta o `C:` em `/cygdrive/c` e não em `/c`, o que
 * é o padrão quando falta o `/etc/fstab` do Git para Windows. O invólucro que
 * chamava a trava escrevia um arquivo de controle num caminho `/c/...`
 * inexistente, a escrita falhava e **TODO** comando voltava com exit 1,
 * inclusive um `true`. A trava imprimiu APROVADO e foi lida como bloqueio.
 *
 * ⚠️ Confundir os dois lados custa caro nas DUAS direções: ler um APROVADO
 * como bloqueio trava uma rodada por nada, e o inverso publicaria número que
 * não passou. Por isso o veredito agora é explícito no texto, numa linha só,
 * greppável, e não depende de canal nenhum além do stdout.
 *
 * 📌 Como desempatar sem esperar outra rodada de 8 minutos: rodar `true` no
 * mesmo shell. Se `true` também "falha", o exit code do ambiente não vale nada
 * e o que manda é a linha `VEREDITO:`.
 */

const PROXY_BASE = 'https://www.afos-analytics.com/api/polymarket?fresh=1'

/** Divergência tolerada entre as duas leituras, em pontos percentuais. */
const TOLERANCIA_PP = 0.20

/** Só vale a pena vigiar quem tem preço relevante. Abaixo disso é ruído de book fino. */
const PISO_RELEVANCIA_PCT = 0.5

/**
 * ⚠️ MERCADO DE DISTRIBUIÇÃO FICA DE FORA, nos dois países.
 *
 * No Brasil a `inflation` nunca esteve nesta lista, e a razão vale igual para os
 * EUA: uma distribuição tem dezenas de faixas finas, cada uma com book raso, e
 * elas oscilam entre si sem que o preço da eleição tenha mudado. Vigiá-las com
 * tolerância de 0,20pp produziria bloqueio constante por ruído, e trava que
 * bloqueia todo dia é trava que alguém aprende a pular.
 *
 * O que segura a qualidade das faixas é OUTRO portão, o de coerência: a seção
 * só mostra a distribuição se as faixas somarem entre 95% e 105%.
 */
const BOOKS_BR = ['presidential', 'secondPlace', 'thirdPlace', 'stf', 'senate'] as const
const BOOKS_US = ['house', 'senate', 'asScheduled'] as const

interface Leitura {
  precos: Map<string, number>
  // 💾 Volume acumulado do MESMO instante do preço. Sem ele, o instantâneo
  // certificado obriga a rodada a buscar volume numa segunda chamada, e aí o
  // par preço/volume publicado lado a lado passa a ser de dois momentos.
  volumes: Map<string, number>
  fetchedAt: string | null
  degraded: boolean
  failedCount: number
}

function limpaNome(q: string): string {
  return String(q)
    .replace(/^Will\s+/i, '')
    .replace(/\s+win the.*$/i, '')
    .replace(/\s+finish in .*$/i, '')
    .replace(/\?$/, '')
    .trim()
}

/**
 * 🔴 RETENTATIVA DE TRANSPORTE, instalada em 18/Ago/2026 por decisão do André.
 *
 * O QUE ACONTECIA. A 2a leitura sai depois de 8 minutos de processo PARADO, e
 * três vezes (uma em 17/Ago e duas em 18/Ago) ela voltou com `fetch failed`
 * enquanto o proxy estava saudável: no mesmo minuto, três chamadas manuais
 * responderam HTTP 200 em menos de 1s, com `degraded: false`. Rodando a mesma
 * trava com `--intervalo=1`, a 2a leitura funcionou. A causa provável é a
 * conexão morrer no ócio, e o `fetch` puro não tinha timeout nem retentativa.
 *
 * ⛔ O QUE A RETENTATIVA **NÃO** PODE FAZER, e é o ponto inteiro:
 *
 *   1. **Não cobre discordância de preço.** Ela vive aqui dentro, no transporte.
 *      Leitura que CHEGA e discorda continua bloqueando, e é assim que tem que
 *      ser: a trava existe para isso.
 *   2. **Não reaproveita leitura.** Cada tentativa é um fetch novo, então o
 *      `fetchedAt` de cada uma é o do momento dela.
 *   3. **Não engole falha.** Toda tentativa que falha é IMPRESSA. Se as três
 *      falharem, a trava bloqueia igual a antes, com o erro na mão.
 *   4. **Não encurta o intervalo.** Retentativa só ADIA a 2a leitura, o que
 *      afasta as duas medições em vez de aproximá-las.
 *
 * ⚠️ A checagem de `fetchedAt` idêntico segue valendo depois disto: se o proxy
 * devolver o mesmo carimbo nas duas leituras, não houve medição independente e
 * a trava falha fechada, com ou sem retentativa.
 */
const TENTATIVAS = 3
const ESPERA_BASE_MS = 4_000
const TIMEOUT_MS = 45_000

async function lerUmaVez(proxy: string, books: readonly string[]): Promise<Leitura> {
  // Timeout explícito: sem ele uma conexão pendurada segura a trava para sempre,
  // e trava que não termina é pior que trava que bloqueia.
  const res = await fetch(proxy, { cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`proxy devolveu HTTP ${res.status}`)
  const j = await res.json() as Record<string, any>

  const precos = new Map<string, number>()
  const volumes = new Map<string, number>()
  for (const book of books) {
    for (const m of j?.[book]?.markets ?? []) {
      const p = Number(m?.outcomePrices?.[0])
      if (!Number.isFinite(p)) continue
      const chave = `${book}:${limpaNome(m.question)}`
      precos.set(chave, Number((p * 100).toFixed(2)))
      const v = Number(m?.volumeNum)
      if (Number.isFinite(v)) volumes.set(chave, v)
    }
  }
  return {
    precos,
    volumes,
    fetchedAt: j?.fetchedAt ?? null,
    degraded: !!j?.degraded,
    failedCount: Number(j?.failedCount ?? 0),
  }
}

async function ler(
  proxy: string,
  books: readonly string[],
  rotulo: string,
  log: (s: string) => void,
): Promise<Leitura> {
  let ultimo: unknown
  for (let n = 1; n <= TENTATIVAS; n++) {
    try {
      const r = await lerUmaVez(proxy, books)
      // Silêncio quando funciona de primeira; quando precisou de socorro, DIZ.
      if (n > 1) log(`  ${rotulo}: obtida na tentativa ${n} de ${TENTATIVAS}.`)
      return r
    } catch (e) {
      ultimo = e
      const m = e instanceof Error ? e.message : String(e)
      log(`  ⚠️ ${rotulo}: tentativa ${n} de ${TENTATIVAS} falhou no transporte: ${m}`)
      if (n < TENTATIVAS) await new Promise(r => setTimeout(r, ESPERA_BASE_MS * n))
    }
  }
  const m = ultimo instanceof Error ? ultimo.message : String(ultimo)
  throw new Error(`${rotulo}: as ${TENTATIVAS} tentativas falharam no transporte. Última: ${m}`)
}

async function main() {
  const args = process.argv.slice(2)
  const jsonOut = args.includes('--json')
  const minutos = Number(args.find(a => a.startsWith('--intervalo='))?.split('=')[1] ?? 8)
  const log = (s: string) => { if (!jsonOut) console.log(s) }

  // ⚠️ O padrão continua sendo o Brasil, sem parâmetro nenhum. Quem já chama
  // esta trava (o /atualizar-brz e quem a roda à mão) não pode mudar de
  // comportamento por causa da chegada dos EUA.
  const pais = args.find(a => a.startsWith('--pais='))?.split('=')[1] === 'us' ? 'us' : 'br'
  const proxy = pais === 'us' ? `${PROXY_BASE}&country=us` : PROXY_BASE
  const books: readonly string[] = pais === 'us' ? BOOKS_US : BOOKS_BR

  const motivos: string[] = []

  log(`Trava de captura (${pais.toUpperCase()}): 2 leituras com ${minutos} min de intervalo, tolerância ${TOLERANCIA_PP}pp.`)
  log(`Books vigiados: ${books.join(', ')}`)
  log('')

  const a = await ler(proxy, books, '1a leitura', log)
  log(`  1a leitura: ${a.precos.size} mercados, fetchedAt=${a.fetchedAt}`)
  if (a.degraded) motivos.push(`1a leitura veio degradada (failedCount=${a.failedCount}). Não publicar.`)

  // ⛔ Falha fechada: sem book nenhum não há o que confirmar. Sem isto, um erro
  // no nome de um book faria a trava ler zero preços, achar zero divergências e
  // APROVAR com exit 0, que é o pior desfecho possível para uma trava.
  if (a.precos.size === 0) {
    motivos.push(`a 1a leitura não trouxe preço nenhum de ${books.join('/')}. A trava não tem o que confirmar.`)
  }

  log(`  aguardando ${minutos} min...`)
  await new Promise(r => setTimeout(r, minutos * 60_000))

  const b = await ler(proxy, books, '2a leitura', log)
  log(`  2a leitura: ${b.precos.size} mercados, fetchedAt=${b.fetchedAt}`)
  if (b.degraded) motivos.push(`2a leitura veio degradada (failedCount=${b.failedCount}). Não publicar.`)

  // Se o proxy devolveu o MESMO carimbo nas duas, não houve leitura independente:
  // a trava não confirmou nada e não pode dizer que está tudo bem.
  if (a.fetchedAt && a.fetchedAt === b.fetchedAt) {
    motivos.push(
      `As duas leituras têm o mesmo fetchedAt (${a.fetchedAt}), então vieram do mesmo cache. ` +
      `A trava NÃO confirmou estabilidade. Confira se o ?fresh=1 está valendo no proxy.`
    )
  }

  const divergencias: Array<{ nome: string; p1: number; p2: number; d: number }> = []
  for (const [nome, p1] of a.precos) {
    const p2 = b.precos.get(nome)
    if (p2 === undefined) {
      motivos.push(`${nome}: presente na 1a leitura e ausente na 2a.`)
      continue
    }
    if (Math.max(p1, p2) < PISO_RELEVANCIA_PCT) continue
    const d = Math.abs(p2 - p1)
    if (d > TOLERANCIA_PP) divergencias.push({ nome, p1, p2, d })
  }

  for (const { nome, p1, p2, d } of divergencias.sort((x, y) => y.d - x.d)) {
    motivos.push(
      `${nome}: as leituras discordam em ${d.toFixed(2)}pp ` +
      `(${p1.toFixed(2)}% -> ${p2.toFixed(2)}%). Book em trânsito ou spread largo.`
    )
  }

  /**
   * 🔴 CERTIFICAÇÃO POR LIVRO, instalada em 18/Ago/2026 por ordem do André.
   *
   * O PROBLEMA, medido. A trava do Brasil vigia CINCO livros e, com o piso de
   * 0,5%, isso dá 19 contratos: 4 no presidencial, 4 no de 2º lugar, 5 no de 3º,
   * 1 no do STF e 5 no do Senado. Ela exigia que os DEZENOVE concordassem ao
   * mesmo tempo. Mesmo que cada contrato tenha 95% de chance de ficar parado em
   * 8 minutos, a chance de todos ficarem é 0,95^19, ou seja **38%**. A trava
   * americana vigia CINCO contratos, e é por isso que ela quase não bloqueia.
   *
   * Em 18/Ago isso custou cinco rodadas seguidas bloqueadas, e os bloqueios
   * vieram espalhados: 3 do livro de 2º lugar, 3 do presidencial e 2 do de 3º.
   *
   * 🔑 E O ACOPLAMENTO NUNCA TEVE JUSTIFICATIVA. Uma oscilação no livro de
   * TERCEIRO LUGAR não tem por que impedir a publicação do preço PRESIDENCIAL:
   * são mercados distintos, com preços distintos, publicados em lugares
   * distintos da tela.
   *
   * ⛔ O QUE **NÃO** MUDA, e é o ponto: **nenhum número passa a ser publicável
   * sem confirmação.** Cada preço continua exigindo duas leituras do SEU
   * PRÓPRIO contrato concordando dentro de 0,20pp. O que deixa de existir é a
   * regra de que o livro A suprime o livro B. Para cada número publicado, a
   * garantia é idêntica à de antes.
   *
   * 📌 `ok` continua sendo o veredicto GLOBAL, para quem só quer saber se a
   * captura inteira fechou. Quem publica por livro lê `livros`.
   */
  const livrosComProblema = new Set(divergencias.map(d => d.nome.split(':')[0]))
  const livros: Record<string, { ok: boolean; motivos: string[] }> = {}
  for (const book of books) {
    const meus = motivos.filter(m => m.startsWith(`${book}:`))
    livros[book] = { ok: !livrosComProblema.has(book) && meus.length === 0, motivos: meus }
  }

  // Problema que não pertence a livro nenhum (leitura degradada, cache repetido,
  // preço sumido) contamina TODOS: aí não há o que certificar em lugar algum.
  const motivosGlobais = motivos.filter(m => !books.some(bk => m.startsWith(`${bk}:`)))
  if (motivosGlobais.length) for (const book of books) livros[book] = { ok: false, motivos: motivosGlobais }

  const ok = motivos.length === 0
  const livrosOk = Object.entries(livros).filter(([, v]) => v.ok).map(([k]) => k)

  const certificado = {
    ok,
    livros,
    livrosOk,
    motivos,
    pais,
    fetchedAt: b.fetchedAt,
    fetchedAtPrimeira: a.fetchedAt,
    intervaloMin: minutos,
    toleranciaPp: TOLERANCIA_PP,
    // A 2a leitura é a que vale: é a mais recente e sobreviveu à confirmação.
    precos: Object.fromEntries(b.precos),
    volumes: Object.fromEntries(b.volumes),
  }

  /**
   * 💾 O INSTANTÂNEO CERTIFICADO FICA GRAVADO, instalado em 02/Set/2026.
   *
   * 🔴 O que faltava: a trava lia, confirmava, IMPRIMIA o veredito e descartava
   * os preços. Quem roda sem `--json` fica com a certificação e sem os números,
   * e aí só tem duas saídas, as duas ruins: rodar de novo, gastando mais oito
   * minutos, ou publicar uma leitura NOVA que ninguém certificou. Medido hoje,
   * na rodada em que o livro do STF bloqueou e os outros quatro passaram: para
   * recuperar os quatro preços aprovados era preciso repetir a trava inteira.
   *
   * 🔑 Gravar não enfraquece nada. O arquivo é a MESMA 2a leitura que a trava
   * acabou de aprovar, com o carimbo dela junto. Quem publicar a partir daqui
   * publica o número certificado, e o carimbo diz de quando ele é.
   *
   * ⛔ A escrita NUNCA derruba a trava. Se o disco recusar, o veredito continua
   * valendo e sai pelo stdout como sempre: portão que falha por causa de um
   * efeito colateral é portão que alguém aprende a pular.
   */
  try {
    const { mkdirSync, writeFileSync } = await import('fs')
    const dir = '.cache/capture-guard'
    mkdirSync(dir, { recursive: true })
    const carimbo = (b.fetchedAt ?? new Date().toISOString()).replace(/[:.]/g, '-')
    writeFileSync(`${dir}/${pais}-${carimbo}.json`, JSON.stringify(certificado, null, 2), 'utf8')
    writeFileSync(`${dir}/ultima-${pais}.json`, JSON.stringify(certificado, null, 2), 'utf8')
    log(`  💾 instantâneo certificado em ${dir}/ultima-${pais}.json`)
  } catch (err) {
    log(`  ⚠️ não deu para gravar o instantâneo (${err instanceof Error ? err.message : String(err)}). O veredito abaixo continua valendo.`)
  }

  if (jsonOut) {
    console.log(JSON.stringify(certificado, null, 2))
  } else {
    log('')
    if (ok) {
      log(`APROVADO. As duas leituras concordam dentro de ${TOLERANCIA_PP}pp.`)
      log(`Publicar os valores da 2a leitura (fetchedAt=${b.fetchedAt}).`)
    } else {
      log(`BLOQUEADO no conjunto. ${motivos.length} motivo(s):`)
      motivos.forEach(m => log(`  - ${m}`))
      log('')
      log('CERTIFICAÇÃO POR LIVRO, e é por ela que se publica:')
      for (const [book, v] of Object.entries(livros)) {
        log(`  ${v.ok ? 'APROVADO ' : 'BLOQUEADO'}  ${book}`)
      }
      log('')
      log('Publicar os livros APROVADOS com os valores da 2a leitura. Os bloqueados, não.')
    }
    // 🔑 ÚLTIMA LINHA, E É A FONTE DE VERDADE. Ver o cabeçalho: o exit code
    // pode se perder no invólucro e virar 1 sem bloqueio nenhum. Esta linha
    // não se perde, e é o que se deve grepar.
    log('')
    log(`VEREDITO: ${ok ? 'APROVADO' : 'BLOQUEADO'}`)
  }

  process.exit(ok ? 0 : 1)
}

main().catch(err => {
  console.error('capture-guard falhou:', err instanceof Error ? err.message : err)
  // Falha da própria trava é motivo para NÃO publicar (fail-closed).
  // ⚠️ O veredito sai também aqui, e em stdout como nos demais casos. Sem isto
  // uma quebra da trava não produziria linha `VEREDITO:` nenhuma, e AUSÊNCIA de
  // veredito é ambígua exatamente como o exit code perdido que este mecanismo
  // existe para substituir.
  console.log('')
  console.log('VEREDITO: BLOQUEADO')
  process.exit(1)
})
