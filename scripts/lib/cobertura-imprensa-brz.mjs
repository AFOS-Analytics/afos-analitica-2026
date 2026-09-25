/**
 * cobertura-imprensa-brz.mjs — a nossa coleta de imprensa ENXERGA as casas do
 * nosso próprio índice?
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 18/Set/2026: a Veritá tinha divulgação
 *    marcada para aquele dia, é uma das casas NACIONAIS do índice, e o
 *    `news-cache` do dia trazia ZERO item com o nome dela, em 1.125 itens
 *    únicos. Não é que a casa estivesse calada: o Google News tinha matéria de
 *    11, 12, 13, 15 e 18/Set sobre ela, incluindo uma decisão judicial do
 *    mesmo dia. **Nenhuma das 23 consultas do cache a alcançava.**
 *
 * ⭐ O defeito não é de valor e nenhum portão de valor o pega: a rodada roda
 *    verde, o calendário sai certo, e a pergunta "essa pesquisa saiu?" é
 *    respondida com "não achei nada", que se lê como "não saiu". É a forma de
 *    imprensa do mesmo erro de amostra por ESCOLHA: eu procuro quem eu já
 *    notei, e concluo sobre quem existe.
 *
 * 🔑 A distinção que este módulo mantém de pé, e que é a razão de ele não ser
 *    um `grep`: **silêncio de UM dia é ambíguo** (a casa pode não ter publicado)
 *    e **silêncio em TODOS os dias cacheados, com divulgações no meio, é do
 *    instrumento**. Só a segunda leitura acusa buraco de cobertura.
 *
 * ⛔ Ele NÃO conclui que a pesquisa saiu nem que não saiu. Ele diz onde a nossa
 *    resposta não vale nada.
 */

/**
 * Casa como o registro do TSE a escreve → como a IMPRENSA a escreve.
 *
 * ⛔ TABELA EXPLÍCITA, nunca por semelhança, pelo mesmo motivo de
 *    `lib/us-polls/casas.mjs`: cortar o nome no primeiro espaço juntaria
 *    "Paraná Pesquisas" com "Paraná Pesquisas e Consultoria" e, pior, separaria
 *    casas que a imprensa chama por apelido que não está no registro.
 *
 * ⚠️ `alvos` são expressões de BUSCA no título, não nomes. Casa curta ganha
 *    fronteira de palavra de propósito: "MDA" solto casa "mdas", "Mda" de
 *    sobrenome e o "MDA" de qualquer sigla.
 */
/**
 * Fronteira de palavra que funciona em PORTUGUÊS.
 *
 * 🔴⭐ POR QUE NÃO É `\b`, medido em 18/Set/2026 e o defeito era MEU: o `\b` do
 *    JavaScript é definido sobre `\w`, que é `[A-Za-z0-9_]`. Letra acentuada não
 *    é `\w`, então **não existe fronteira depois de "á"**: `/\bverit[áa]\b/i`
 *    dá `false` em "Veritá: Flávio e Lula empatam", e `true` em "Verita" sem
 *    acento. O cache tinha 19 títulos da casa e o medidor disse ZERO.
 *
 * 🕳️ E o que deixou passar foi o TESTE, não a régua: o caso plantado que eu
 *    escrevi para "acento" usava "Pesquisa Verita aponta empate", a forma SEM
 *    acento, que é exatamente a que funciona. Teste que escolhe o lado fácil do
 *    próprio achado passa verde sobre o defeito que ele existe para pegar.
 *
 * ⛔ `\p{L}` com a bandeira `u`, não uma lista de acentos: lista esquece "ç",
 *    esquece maiúscula acentuada, e esquece a próxima.
 */
export function palavra(corpo, bandeiras = 'iu') {
  return new RegExp(`(?<!\\p{L})(?:${corpo})(?!\\p{L})`, bandeiras)
}

export const CASAS_BRZ = [
  { registro: /real ?time/i, nome: 'Real Time Big Data', busca: '"Real Time Big Data"', alvos: [palavra('real ?time')] },
  { registro: /atlasintel/i, nome: 'AtlasIntel', busca: 'AtlasIntel', alvos: [palavra('atlas ?intel')] },
  { registro: /nexus/i, nome: 'Nexus', busca: '"pesquisa Nexus"', alvos: [palavra('nexus')] },
  { registro: /quaest/i, nome: 'Quaest', busca: 'Quaest', alvos: [palavra('quaest')] },
  { registro: /american analytics/i, nome: 'American Analytics', busca: '"American Analytics"', alvos: [palavra('american analytics')] },
  { registro: /palver/i, nome: 'Palver', busca: 'Palver', alvos: [palavra('palver')] },
  // "Veritá" e "Verita" convivem na imprensa, e o acento cai em metade dos títulos.
  // 🔴 Esta é a linha em que o `\b` mentiu: ver `palavra()` acima.
  { registro: /verit[áa]/i, nome: 'Veritá', busca: 'Veritá', alvos: [palavra('verit[áa]')] },
  { registro: /datafolha/i, nome: 'Datafolha', busca: 'Datafolha', alvos: [palavra('datafolha')] },
  { registro: /poderdata/i, nome: 'PoderData', busca: 'PoderData', alvos: [palavra('poder ?data')] },
  { registro: /gerp/i, nome: 'Gerp', busca: '"pesquisa Gerp"', alvos: [palavra('gerp')] },
  { registro: /datatrends/i, nome: 'DataTrends', busca: 'DataTrends', alvos: [palavra('data ?trends')] },
  { registro: /indexa/i, nome: 'Indexa', busca: '"Instituto Indexa"', alvos: [palavra('indexa')] },
  { registro: /ideia|canal meio/i, nome: 'Ideia/Canal Meio', busca: '"Canal Meio"', alvos: [palavra('ideia'), palavra('canal meio')] },
  // 🔴⭐ A ENTRADA QUE PROVA POR QUE A TABELA É EXPLÍCITA, medida em 18/Set/2026.
  // O registro do TSE diz "100 Cidades". A imprensa NUNCA escreve isso: escreve
  // "Futura", "Futura/100% Cidades" ou "Pesquisa Futura/100% Cidades". São duas
  // diferenças, e cada uma sozinha já bastaria para o grep falhar:
  //   · o parceiro "Futura" lidera o nome e não está no registro;
  //   · "100% Cidades" tem PORCENTO, e `/\b100 cidades\b/` não casa "100% Cidades".
  // Resultado antes desta linha: 0 item em 12.680 títulos de 14 dias, com duas
  // divulgações NACIONAIS vencidas (10 e 17/Set) no meio. A casa não estava
  // calada; nós é que estávamos surdos para o nome dela.
  // ⚠️ `Futura` seguido de dois-pontos ou barra é estreito de propósito: "futura"
  // solto é adjetivo comum em português ("a futura eleição") e viraria ruído.
  {
    registro: /100 cidades/i,
    nome: '100 Cidades (Futura)',
    busca: '"100% Cidades" OR "pesquisa Futura"',
    alvos: [/100\s*%?\s*cidades/iu, /(?<!\p{L})futura\s*[/:]/iu, palavra('pesquisa futura'), palavra('instituto futura')],
  },
  // 🔴⭐ ENTRADA DE 19/Set/2026, e ela chegou aqui pelo DETECTOR, não por eu ter
  // notado a casa. O conferidor saiu `CASA_FORA_DA_TABELA` na rodada do dia: a
  // ALFA tinha registro NACIONAL no índice (BR025122026, n=2.700, div 24/Set) e
  // ninguém media a cobertura dela. É a primeira vez que o buraco de cobertura
  // é achado por medição em vez de por acaso, que era o ponto de existir.
  //
  // O registro do TSE diz "ALFA INTELIGENCIA E SERVICOS DE SOFTWARE", sem acento.
  // A imprensa escreve "Alfa Inteligência", COM acento, e em metade dos títulos
  // escreve o parceiro de mídia junto: "Alfa/TMC", "TMC/Alfa", "Instituto Alfa".
  // Mesma forma do caso Futura acima, e a casa publica PRESIDENCIAL nacional.
  //
  // ⚠️ `alfa` NU está fora de propósito, e isto foi medido antes de escrever a
  // linha: 14 dias de cache trazem 7 títulos com "alfa" e NENHUM é da casa. São
  // alfaiataria, analfabeto, analfabetismo, alface e o domínio `jornalfatos`.
  // A fronteira de `palavra()` derruba os 7, mas "Alfa Romeo" e "Banco Alfa"
  // passariam por ela, então a forma nua só entra colada a "pesquisa".
  {
    registro: /alfa intelig/i,
    nome: 'Alfa Inteligência (TMC)',
    busca: '"Alfa Inteligência" OR "Alfa/TMC"',
    alvos: [
      palavra('alfa intelig[êe]ncia'),
      palavra('instituto alfa'),
      palavra('pesquisa alfa'),
      /(?<!\p{L})alfa\s*\/\s*tmc(?!\p{L})/iu,
      /(?<!\p{L})tmc\s*\/\s*alfa(?!\p{L})/iu,
    ],
  },
  // 🔴⭐ ENTRADA DE 24/Set/2026, e o detector a trouxe do mesmo jeito que trouxe
  // a ALFA: o conferidor saiu `CASA_FORA_DA_TABELA` na rodada do dia, com a casa
  // já dentro do índice nacional (BR008952026, n=2.100, campo 26 a 28/Set,
  // div 29/Set). Ninguém media a cobertura dela.
  //
  // O registro do TSE diz "INSTITUTO VOX BRASIL OPINIAO E PESQUISAS". A imprensa
  // escreve "Vox Brasil", e às vezes só "Vox" ("diz Vox", "Vox: Flávio cresce").
  //
  // ⚠️ MEDIDO em 30 dias de cache, 25.225 títulos únicos, antes de escrever a
  // linha: `vox` com fronteira de palavra aparece 18 vezes e as 18 são desta
  // casa, da onda nacional de 29/Ago à estadual de Senado/SP de 01/Set. Por
  // isso a forma NUA entra aqui, ao contrário de "alfa" acima, que tinha 7
  // ocorrências e nenhuma da casa.
  //
  // ⛔ "Vox Populi" é OUTRA casa, existe de verdade e aparece ZERO vez nesses 30
  // dias. Ela sai por exclusão escrita, não por sorte de não ter aparecido: o
  // dia em que aparecer não pode contar como cobertura desta.
  // ⚠️ Riscos conhecidos e não medidos, porque não apareceram: o partido VOX da
  // Espanha e a Vox Media. Se entrarem no cache, estreitar para "vox brasil".
  {
    registro: /vox brasil|instituto vox/i,
    nome: 'Vox Brasil',
    busca: '"Vox Brasil"',
    alvos: [palavra('vox brasil'), /(?<!\p{L})vox(?!\p{L})(?!\s+populi)/iu],
  },
  // 🔴⭐⭐ ENTRADA DE 24/Set/2026, e é a mais delicada da tabela, porque a casa
  // do registro é um VEÍCULO: a BR058692026 (n=6.000, campo 03 a 28/Set, div
  // 29/Set) está no nome de "JOTA JORNALISMO S/A", que publica jornalismo
  // próprio todo dia. E o Google News cola o nome da FONTE no fim do título,
  // então "- JOTA Info" entra em todo título que vem do veículo.
  //
  // ⚠️ MEDIDO nos mesmos 30 dias: `jota` com fronteira de palavra dá 89 itens, e
  // 85 deles são SÓ esse rodapé. Dos 4 que sobram, um é a newsletter ("JOTA
  // Principal"), um é o agregador do próprio veículo, um é o candidato "Jota
  // Rodrigues 29 (PCO)" e um é o jogador "Diogo Jota". Nenhum dos 89 é pesquisa
  // desta casa.
  //
  // 🔴 A linha ingênua, com `jota` nu, marcaria a casa COBERTA com 89 itens sem
  // que exista um único item dela. **Cobertura fingida é pior que buraco
  // declarado**, porque o buraco ainda avisa e ela cala: é o mesmo perigo que a
  // linha do MDA declara, aqui com 89 de ruído em vez de alguns. Por isso os
  // alvos exigem CONTEXTO de pesquisa, e a casa fica em INDETERMINADO até a
  // divulgação de 29/Set, que é o estado honesto hoje.
  //
  // 🔑 SEGUNDA CAMADA, e ela não tem conserto dentro desta tabela: pela régua de
  // que o registro sai no nome de quem CONTRATA, o executor pode ser outra casa,
  // e a imprensa costuma escrever o executor. A forma de parceria que ela usa
  // está no mesmo cache ("Globo/Quaest", "BTG/Nexus", "Indexa/Broadcast"), então
  // as duas ordens da barra entram. Se em 29/Set sair número e esta casa seguir
  // em zero, a pergunta não é "a casa está calada", é QUEM executou.
  {
    registro: /jota jornalismo/i,
    nome: 'JOTA Jornalismo',
    busca: '"pesquisa JOTA" OR "Agregador do JOTA"',
    alvos: [
      /(?<!\p{L})pesquisa\s+(do\s+)?jota(?!\p{L})/iu,
      /(?<!\p{L})levantamento\s+(do\s+)?jota(?!\p{L})/iu,
      /(?<!\p{L})jota\s*\/\s*\p{L}/iu,
      /\p{L}\s*\/\s*jota(?!\p{L})/iu,
      /(?<!\p{L})jota\s+(divulga|aponta|mostra|contratou|encomendou)(?!\p{L})/iu,
    ],
  },
  { registro: /paran[áa] pesquisas/i, nome: 'Paraná Pesquisas', busca: '"Paraná Pesquisas"', alvos: [palavra('paran[áa] pesquisas')] },
  // ⚠️ Sigla de 3 letras, e a ÚNICA entrada sensível a caixa (`'u'`, sem `i`).
  // A fronteira é o que separa o instituto do "MDA" de qualquer outra coisa, e
  // ainda assim esta linha é a mais frágil da tabela: ruído aqui se lê como
  // cobertura que não existe.
  { registro: /^mda\b|\bmda\b/i, nome: 'MDA', busca: '"pesquisa MDA"', alvos: [palavra('MDA', 'u')] },
  { registro: /instituto mais/i, nome: 'Instituto Mais', busca: '"Instituto Mais"', alvos: [palavra('instituto mais')] },
]

/**
 * As consultas do Google News que cobrem TODAS as casas da tabela.
 *
 * 🔴 POR QUE ISTO SUBSTITUI UM LITERAL, medido em 18/Set/2026: a consulta
 *    `pesquisas` do coletor era `pesquisa eleitoral Datafolha AtlasIntel Quaest
 *    2026 when:2d`, e **o Google News faz AND de todos os termos**. Ela exigia
 *    as três casas na MESMA matéria: devolveu 12 itens no dia em que as outras
 *    consultas devolveram 100. O próprio arquivo já tinha esse defeito
 *    diagnosticado e consertado na consulta `aprovacao`, em 12/Jul; a consulta
 *    `pesquisas` ficou com ele.
 *
 * ⭐ E o defeito de fundo era o outro: mesmo com OR, três nomes escritos à mão
 *    não são o índice. Quem decide quem é coletado passa a ser a tabela que o
 *    conferidor de cobertura usa, então acrescentar casa ao índice acrescenta
 *    casa à coleta, sem ninguém lembrar de fazer as duas coisas.
 *
 * 🔴⭐ UMA CONSULTA POR CASA, e o padrão 1 não é exagero: é medição. A primeira
 *    versão disto agrupava 6 casas por `OR`, e as três consultas voltaram com
 *    100 itens cada, o teto do Google News. Parecia consertado. **A Veritá
 *    continuou com ZERO**, porque no lote dela estavam Datafolha (539 itens no
 *    cache) e Quaest (502): num `OR` com teto, a casa barulhenta come a vaga da
 *    casa pequena, e a pequena é justamente a que ninguém vigia.
 *
 * ⛔ Agrupar não tem conserto por tamanho de lote, só por sorte: o teto é por
 *    CONSULTA, então garantia por casa exige consulta por casa. Como efeito
 *    colateral bom, lote que cai leva só a casa dele.
 *
 * @param {number} [porLote] 1 por padrão. Acima de 1, a garantia por casa cai.
 * @param {string} [janela] operador `when:` do Google News
 * @returns {{id:string, q:string}[]}
 */
export function consultasDeCasas(porLote = 1, janela = 'when:2d') {
  const casas = CASAS_BRZ.filter((c) => c.busca)
  const lotes = []
  for (let i = 0; i < casas.length; i += porLote) lotes.push(casas.slice(i, i + porLote))
  return lotes.map((lote, i) => ({
    id:
      porLote === 1
        ? `casa-${lote[0].nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
        : `casas-do-indice-${i + 1}`,
    q: `${lote.map((c) => c.busca).join(' OR ')} ${janela}`,
  }))
}

/**
 * A entrada da tabela para um nome do registro, ou `null`.
 *
 * ⛔ `null` é LOUD, não silencioso: quem chama tem de reportar a casa
 *    desconhecida em vez de pulá-la. Casa nova sem entrada é justamente o caso
 *    em que a cobertura vale zero e ninguém percebe.
 */
export function casaDoRegistro(nome) {
  if (typeof nome !== 'string' || nome.trim() === '') return null
  return CASAS_BRZ.find((c) => c.registro.test(nome)) ?? null
}

/**
 * Mede a cobertura.
 *
 * @param {{institute:string, publicationDate:string, protocolo?:string}[]} nacionais
 *        registros NACIONAIS da janela, já filtrados por quem chama
 * @param {{dia:string, titulos:string[]}[]} diasDeCache
 *        um item por arquivo de `public/news-cache/`, do mais antigo ao mais novo
 * @param {string} hoje  `AAAA-MM-DD`, data civil do Brasil
 * @returns {{casas:object[], desconhecidas:string[], veredito:string}}
 */
export function medirCobertura(nacionais, diasDeCache, hoje) {
  const porCasa = new Map()
  const desconhecidas = new Set()

  for (const r of nacionais) {
    const casa = casaDoRegistro(r.institute)
    if (!casa) {
      desconhecidas.add(r.institute)
      continue
    }
    if (!porCasa.has(casa.nome)) porCasa.set(casa.nome, { casa, divulgacoes: [] })
    porCasa.get(casa.nome).divulgacoes.push({
      protocolo: r.protocolo ?? null,
      div: (r.publicationDate ?? '').slice(0, 10),
    })
  }

  const casas = []
  for (const { casa, divulgacoes } of porCasa.values()) {
    let itensTotais = 0
    const diasComItem = []
    for (const d of diasDeCache) {
      const n = d.titulos.filter((t) => casa.alvos.some((a) => a.test(t))).length
      if (n > 0) {
        itensTotais += n
        diasComItem.push(d.dia)
      }
    }
    // 🔑 Divulgação de HOJE ainda pode sair à noite. O que este medidor chama de
    // buraco é a casa que o cache NUNCA viu, tendo divulgado, não a que está
    // apenas atrasada dentro do próprio dia.
    const divs = divulgacoes.map((x) => x.div).sort()
    const vencidas = divs.filter((d) => d < hoje)
    let estado
    if (itensTotais > 0) estado = 'COBERTA'
    else if (vencidas.length >= 2) estado = 'CEGA'
    else if (vencidas.length === 1) estado = 'SUSPEITA'
    else estado = 'INDETERMINADO'
    casas.push({
      nome: casa.nome,
      divulgacoes: divulgacoes.sort((a, b) => a.div.localeCompare(b.div)),
      vencidas: vencidas.length,
      itens: itensTotais,
      diasComItem,
      estado,
    })
  }

  casas.sort((a, b) => a.estado.localeCompare(b.estado) || a.nome.localeCompare(b.nome))
  const cegas = casas.filter((c) => c.estado === 'CEGA')
  const veredito =
    desconhecidas.size > 0
      ? 'CASA_FORA_DA_TABELA'
      : cegas.length > 0
        ? 'BURACO_DE_COBERTURA'
        : 'COBERTURA_OK'
  return { casas, desconhecidas: [...desconhecidas], veredito }
}
