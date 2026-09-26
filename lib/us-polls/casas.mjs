/**
 * 🧬 A SÉRIE DE UMA CASA: um nome só, quando o índice escreve dois.
 *
 * 🔴 POR QUE ISTO EXISTE (17/Set/2026): a Big Data Poll publicou a rodada de
 * 13-15/Set e o índice a listou como "Big Data Poll/Public Polling Project",
 * sem o "(R)" das dez rodadas anteriores, porque o patrocínio passou a ser um
 * projeto de financiamento coletivo. Quem sofria eram os medidores que agrupam
 * por CASA, e todos agrupavam pelo nome cru:
 *
 *   - o conferidor de defasagem dizia "temos 2026-07-29" para uma casa cuja
 *     rodada de 15/Set já estava no arquivo;
 *   - a cadência via a série velha calada desde 29/Jul e a nova com UMA rodada;
 *   - a exposição e as listagens procuravam o registro pelo nome velho.
 *
 * Nada disso dá erro. O nome novo vira uma casa nova, e a casa velha envelhece.
 *
 * 🔴 E EM 25/Set/2026 A PREMISSA DESTE ARQUIVO CAIU. Ele afirmava, literal, que
 * "a média não sofre: ela identifica RODADA por nome e fim de campo, e a rodada
 * entrou certa", e por isso se declarava fora da média de propósito. Isso valia
 * para o caso que o criou, em que o nome muda ENTRE ondas. Não vale quando a
 * MESMA onda existe duas vezes no arquivo sob dois rótulos:
 *
 *   Beacon Research (D)/ Shaw & Co. Research (R)  e  Fox News
 *   Marquette University Law School               e  Marquette Law School
 *   ActiVote                                      e  Activote
 *
 * Três casas entravam DUAS vezes na média de 25/Set: 41 rodadas onde a regra dá
 * 38, e 31 institutos onde ela dá 28. A regra "uma rodada por instituto por
 * onda" se apoiava no único campo que a fonte não promete.
 *
 * 🔑 E A ORIGEM DOS TRÊS PARES NÃO ERA O ÍNDICE, ERA A NOSSA PRÓPRIA CURADORIA.
 * Cada par é uma rodada CURADA que devia ter se aposentado e não se aposentou. A
 * curada é escrita à mão a partir do documento do INSTITUTO, onde a casa se
 * nomeia (Fox News, Marquette Law School, ActiVote); o índice a nomeia pelo
 * executor ou com outra grafia (Beacon/Shaw, Marquette University Law School,
 * ActiVote). A regra "o índice SEMPRE vence" aposenta a curada pela CHAVE, e a
 * chave era o nome: rótulos diferentes, nenhuma aposentadoria, casa contada duas
 * vezes. Eram CINCO curadas nesse estado, três dentro da janela da média.
 *
 * ⭐ Por isso o conserto é esta tabela e não corrigir grafia: a divergência é
 * ESTRUTURAL, porque os dois lados nomeiam a casa a partir de fontes diferentes.
 *
 * ⚖️ A DECISÃO É DO ANDRÉ, de 25/Set/2026, literal: "fica o nome de quem EXECUTA
 * nos três pares".
 *
 * ⛔ A TABELA É EXPLÍCITA, NUNCA POR SEMELHANÇA. Tirar "(R)" de todo nome, ou
 * casar pelo prefixo antes da barra, juntaria séries que são de fato outras:
 * "Morning Consult" e "Morning Consult/Cato Institute" são produtos diferentes,
 * e "HarrisX/Forbes" não é "Harvard/Harris Poll/HarrisX". Cada entrada aqui é
 * uma afirmação conferida de que é a MESMA casa com outro rótulo. Grafia que
 * ninguém declarou passa inteira, e o detector de duplicata volta a cobrá-la.
 *
 * ⛔ E O ARQUIVO PUBLICADO NÃO MUDA. O `instituto` de cada linha de `polls[]`
 * continua sendo o que o índice escreveu: reescrever o nome na linha apagaria a
 * prova do que a fonte publicou. O que passa a usar a série é a DEDUPLICAÇÃO da
 * média, e o registro dela grava o rótulo do índice ao lado, em
 * `institutoNoIndice`, sempre que houve colapso.
 */

/**
 * Papéis aceitos: POR QUE o nome divergiu.
 *
 * 🔑 Isto é ortogonal a `mesmaOnda`, que diz SE os dois rótulos foram vistos na
 * mesma rodada. A primeira versão desta tabela juntava as duas perguntas numa só,
 * com um papel `serie` que queria dizer "entre ondas", e a confusão apareceu na
 * primeira entrada nova: a Focaldata é caso de VEÍCULO no rótulo e de ondas
 * DIFERENTES ao mesmo tempo, e não cabia em nenhum dos três valores antigos.
 */
export const PAPEIS = {
  // Encomenda e publica, não vai a campo. Pede URL: "quem executou" é uma
  // afirmação sobre o mundo, e afirmação sobre o mundo pede documento.
  veiculo: 'encomenda e publica, não executa',
  // A mesma casa escrita de outro jeito: maiúscula, palavra a menos, sufixo.
  grafia: 'mesma casa, grafia diferente',
}

/**
 * 📒 A TABELA. Uma entrada por casa, com as variantes que colapsam nela.
 *
 * 🔒 `prova` aceita `url` ou `onde`, e nunca nada. `onde` existe para a
 * conferência feita contra material sem link estável, e dizer onde foi feita é
 * diferente de inventar um link.
 */
export const CASAS_DECLARADAS = [
  {
    serie: 'Big Data Poll',
    conferidoEm: '2026-09-17',
    motivo:
      'Mesma casa, mesmo blog (bigdatapoll.com), mesma cadência mensal e mesmo desenho LV/RV. A troca de patrocinador virou parte do rótulo do índice.',
    variantes: [
      {
        nome: 'Big Data Poll (R)',
        papel: 'grafia',
        mesmaOnda: false,
        prova: { onde: 'rodadas anteriores da própria casa no arquivo, todas com o sufixo (R)' },
        motivo: 'o sufixo de partido saiu do rótulo quando o patrocínio mudou.',
      },
      {
        nome: 'Big Data Poll/Public Polling Project',
        papel: 'veiculo',
        mesmaOnda: false,
        prova: { url: 'https://www.bigdatapoll.com/blog/democrats-maintain-significant-midterm-advantage-in-post-labor-day-poll/' },
        motivo: 'o patrocínio passou a ser um projeto de financiamento coletivo e entrou no rótulo.',
      },
    ],
  },
  {
    // ⚖️ INVERTIDA EM 26/Set/2026, por decisão do André ("resolva da melhor forma
    // técnica possível"). Até então esta entrada canonizava para o rótulo que
    // CARREGA o veículo, contra a régua de 25/Set, e a inconsistência estava
    // declarada aqui à espera de decisão.
    //
    // 🔑 E o custo não era o que eu havia estimado. Eu disse que inverter
    // renomearia a série que três medidores usam, e a medição mostrou outra
    // coisa: o `fora-do-indice.mjs` não tem chave nenhuma para esta casa, mas o
    // `check-us-polls-defasagem.mjs` montava o índice PELA SÉRIE e consultava
    // PELO RÓTULO escrito à mão na lista dele. Trocar a canônica sem tocar nisso
    // recriaria, pelo outro lado, exatamente o defeito de 17/Set que criou este
    // arquivo: a casa apareceria sem nada conhecido. O conserto foi canonizar os
    // dois lados da consulta, o que desacopla a lista de toda escolha de rótulo.
    serie: 'Focaldata',
    conferidoEm: '2026-09-26',
    motivo:
      'A Focaldata é quem vai a campo e publica as tabelas no próprio domínio, com a pergunta Q69 lida na planilha dela; o Financial Times encomenda e publica. O índice às vezes escreve só o executor e às vezes o par com o veículo, em ondas diferentes.',
    variantes: [
      {
        nome: 'Focaldata/Financial Times',
        papel: 'veiculo',
        mesmaOnda: false,
        prova: {
          url: 'https://landing.focaldata.com/hubfs/Marketing%20content/Focaldata_US_Midterms_Poll_Sep2026_formatted.xlsx',
        },
        motivo:
          'a planilha de tabelas está hospedada no domínio da Focaldata e é onde a pergunta do generic ballot foi lida; o veículo entra no rótulo do índice em parte das ondas.',
      },
    ],
  },
  {
    serie: 'Beacon Research (D)/ Shaw & Co. Research (R)',
    conferidoEm: '2026-09-25',
    motivo:
      'O par bipartidário Beacon Research (D) e Shaw & Company Research (R) é quem vai a campo; a Fox News encomenda e publica. O ÍNDICE lista a rodada sob o executor, e a CURADA de 11-14/Set, entrada a partir do topline da Fox, a listava sob o veículo: 1.211 RV, margem 3, D 51 x R 44 nos dois lados. Sem esta entrada a curada não se aposenta.',
    // 📌 O que a escolha custa, declarado para não se descobrir depois: a linha
    // que FICA traz `outros` 5 e aponta a matéria; a que sai traz `outros` 4 e
    // aponta o topline em PDF. `outros` não entra na média nem na contagem de
    // institutos, e as duas somas caem dentro da faixa de 97 a 102.
    ressalva:
      'a curada trazia o topline em PDF e `outros` 4; a linha do índice traz a matéria e `outros` 5. Ao se aposentar, a curada leva o PDF com ela, e `outros` não entra em conta nenhuma.',
    variantes: [
      {
        nome: 'Fox News',
        papel: 'veiculo',
        mesmaOnda: true,
        prova: {
          url: 'https://static.foxnews.com/foxnews.com/content/uploads/2026/09/fox_september-11-14-2026_national_topline_september-16-release-1.pdf',
        },
        assinatura: '2026-09-11|2026-09-14|1211|RV',
        valores: ['51/44'],
        motivo: 'o topline é publicado pela Fox News e conduzido pelo par Beacon/Shaw, que é o nome que fica.',
      },
    ],
  },
  {
    serie: 'Marquette University Law School',
    conferidoEm: '2026-09-25',
    motivo:
      'A mesma casa, com e sem a palavra University. O nome longo é o do ÍNDICE e o que está em 9 outras rodadas da nossa série; o curto é como o instituto se nomeia no press release, e foi como as CURADAS de 02-09/Set entraram, nos recortes LV e RV. Adotar o curto partiria a série em duas.',
    // 🕳️ E o índice se contradiz no campo que NÃO entra na conta: o nome longo
    // traz `outros` 8 no recorte LV e o curto traz 4. O 4 é o que o press release
    // do instituto declara, e o 8 é o "Neither" do recorte de ADULTOS, já
    // registrado como ERRO_DO_INDICE em `soma-conferida.mjs` em 23/Set/2026.
    // ⭐ A linha duplicada é PROVA INDEPENDENTE daquele diagnóstico, e estava no
    // arquivo desde então sem ninguém ligar as duas coisas.
    // 🕳️ E o campo que NÃO entra na conta divergia entre os dois lados: a curada
    // trazia `outros` 4 no LV, lido no press release, e a linha do índice traz 8,
    // que é o "Neither" do recorte de ADULTOS. O 8 já estava registrado como
    // ERRO_DO_INDICE em `soma-conferida.mjs` em 23/Set/2026, e a contradição do
    // índice com a sua PRÓPRIA nota, chamada "Neither4", foi medida naquele dia.
    ressalva:
      'a linha que fica carrega o `outros` errado do índice (8 no LV, contra 4 no press release que a curada lia), já registrado em soma-conferida. `outros` não entra na média.',
    variantes: [
      {
        nome: 'Marquette Law School',
        papel: 'grafia',
        mesmaOnda: true,
        prova: { url: 'https://law.marquette.edu/assets/community/poll/MLSPSC35/MLSPSC35PressRelease_NationalTopics.pdf' },
        assinatura: '2026-09-02|2026-09-09|581|LV',
        valores: ['54/41'],
        motivo: 'campo, amostra, recorte, margem e o par D/R idênticos nos dois nomes, nos recortes LV e RV.',
      },
    ],
  },
  {
    serie: 'ActiVote',
    conferidoEm: '2026-09-25',
    motivo:
      'A mesma casa com maiúscula diferente, e a MESMA rodada: a CURADA foi escrita Activote em 20/Set e o índice escreve ActiVote. As duas apontam a mesma URL do instituto, divergindo só pela barra final. Não são duas ondas nem duas medições, são a mesma medição em duas precisões.',
    // ⚠️ E o preço desta entrada: a curada existia para guardar o DECIMAL
    // (52,3 x 47,7 e 51,7 x 48,3) que o índice arredonda para 52 x 48. Ao voltar
    // a se aposentar, ela leva o decimal com ela. Manter as duas seria manter a
    // casa contada duas vezes, e uma regra só é melhor que duas em conflito.
    ressalva:
      'a grafia ActiVote é a do próprio instituto e a dominante na nossa série. A aposentadoria da curada devolve a onda ao valor ARREDONDADO do índice.',
    variantes: [
      {
        nome: 'Activote',
        papel: 'grafia',
        mesmaOnda: true,
        prova: { url: 'https://www.activote.net/polls/generic-ballot/2026-09-11/' },
        assinatura: '2026-08-31|2026-09-10|1000|LV',
        valores: ['52/48', '52.3/47.7'],
        motivo:
          'campo 31/Ago-10/Set, 1.000 LV e margem 3,1 nas duas; D 52,3 x R 47,7 é o valor com decimal e D 52 x R 48 é ele arredondado. O par 10-24/Ago repete o padrão, com 51,7/48,3 contra 52/48.',
      },
    ],
  },
  {
    // 🔴 AS DUAS ENTRADAS ABAIXO NASCERAM DE UM EVENTO DE 26/Set/2026, e ele é a
    // prova independente da tese deste arquivo: em MENOS DE 24 HORAS o índice
    // renomeou duas casas, uma acrescentando o sufixo de partido e a outra
    // acrescentando um ESPAÇO depois da barra. Nenhuma das duas mudanças tem
    // aviso, e as duas fazem a rodada sair como "pesquisa nova" para quem compara
    // por nome. Aqui elas passam a sair como RENOMEAÇÃO.
    serie: 'McLaughlin & Associates (R)',
    conferidoEm: '2026-09-26',
    motivo:
      'A rodada de campo 16-22/Set entrou no índice em 25/Set como "McLaughlin & Associates", sem o sufixo, e em 26/Set apareceu como "McLaughlin & Associates (R)", que é a forma das 7 rodadas anteriores da casa. Mesmo campo, mesma amostra, mesmo recorte e mesma margem.',
    // ✅ E o VALOR não mudou: D 48 x R 43 nos dois rótulos, conferido contra o
    // arquivo do dia anterior. A primeira versão desta entrada afirmava que o
    // índice havia revalorizado a rodada, porque eu havia relatado D 47 x R 42 em
    // 25/Set; o arquivo daquele dia registra 48 x 43, então o erro era do meu
    // RELATO e não da origem. A margem, D+5, estava certa nas duas versões.
    ressalva: 'só o rótulo mudou: D 48 x R 43 nos dois, conferido contra o arquivo de 25/Set.',
    variantes: [
      {
        nome: 'McLaughlin & Associates',
        papel: 'grafia',
        mesmaOnda: true,
        prova: { url: 'https://mclaughlinonline.com/2026/09/24/national-monthly-september-2026/' },
        assinatura: '2026-09-16|2026-09-22|1000|LV',
        valores: ['48/43'],
        motivo: 'o sufixo de partido caiu do rótulo por um dia e voltou; a casa é a mesma e o release é o mesmo.',
      },
    ],
  },
  {
    serie: 'Emerson College/RealClear Opinion Research',
    conferidoEm: '2026-09-26',
    motivo:
      'O índice passou a escrever um ESPAÇO depois da barra, "Emerson College/ RealClear Opinion Research", na mesma rodada de campo 12-15/Set. A canônica fica sem o espaço, que é a forma anterior e a que o nosso registro de fonte referencia.',
    // ⛔ E o que esta entrada NÃO faz: juntar com "Emerson College" puro, que tem
    // 9 rodadas próprias no arquivo. Sob a régua de "fica quem executa" as duas
    // colapsariam, porque a Emerson vai a campo nas duas, mas a advertência deste
    // arquivo vale aqui: "Morning Consult" e "Morning Consult/Cato Institute" são
    // produtos diferentes. Juntar é decisão de procedência e fica declarada como
    // não tomada, em vez de acontecer de lado.
    ressalva: 'NÃO junta com "Emerson College" puro: é outra pergunta de procedência, e ela segue não decidida.',
    variantes: [
      {
        nome: 'Emerson College/ RealClear Opinion Research',
        papel: 'grafia',
        mesmaOnda: true,
        prova: { onde: 'a própria célula do índice, que mudou de um dia para o outro sem mudar campo, amostra, recorte nem valores' },
        assinatura: '2026-09-12|2026-09-15|1500|RV',
        valores: ['37/29'],
        motivo: 'a diferença é um espaço depois da barra, e nada mais.',
      },
    ],
  },
  // ⏳ NÃO entrou sem conferência: "The Washington Post/ABC News/Ipsos" e
  // "Washington Post/ABC News/Ipsos" parecem o mesmo rótulo com e sem artigo.
  // São rodadas esparsas e fora da cadência medida, então esperar custa zero.
]

/** nome como aparece no índice → nome da série. Derivado da tabela, nunca escrito à mão em dois lugares. */
export const SERIES_DE_CASA = Object.fromEntries(
  CASAS_DECLARADAS.flatMap((e) => (e.variantes ?? []).map((v) => [v.nome, e.serie]))
)

function mapa(registro) {
  if (registro === undefined) return SERIES_DE_CASA
  return Object.fromEntries((registro ?? []).flatMap((e) => (e.variantes ?? []).map((v) => [v.nome, e.serie])))
}

/**
 * O nome da SÉRIE. Nome fora da tabela volta como veio: ausência de entrada não
 * é erro. 🔑 O casamento é por string EXATA, de propósito: grafia nova que
 * ninguém declarou NÃO é absorvida em silêncio.
 *
 * `registro` existe para o MEDIDOR poder desligar a tabela e mostrar o preço
 * dela, sem escrever uma segunda cópia da regra de deduplicação.
 */
export function serieDaCasa(nome, registro = undefined) {
  if (typeof nome !== 'string') return nome
  const m = mapa(registro)
  return Object.prototype.hasOwnProperty.call(m, nome) ? m[nome] : nome
}

/** Todos os nomes do índice que pertencem a uma série, incluindo o próprio nome da série. */
export function nomesDaSerie(serie, registro = undefined) {
  const nomes = new Set([serie])
  for (const [nome, s] of Object.entries(mapa(registro))) if (s === serie) nomes.add(nome)
  return [...nomes]
}

/** true quando os dois nomes são a MESMA casa segundo a tabela. */
export function mesmaCasa(a, b, registro = undefined) {
  return serieDaCasa(a, registro) === serieDaCasa(b, registro)
}

/**
 * 🥇 DESEMPATE entre duas linhas da MESMA rodada, e ele é declarado porque a
 * alternativa é a ordem em que o índice escreveu, que não é critério nenhum.
 *
 * Vale DEPOIS do recorte e da amostra, que são a regra antiga e não mudam:
 *   1. mais PRECISA ganha. O caso é a ActiVote: 52,3 x 47,7 e 52 x 48 são a
 *      mesma medição, e a segunda é a primeira arredondada. Descartar o decimal
 *      joga fora resolução que o instituto publicou.
 *   2. o nome da SÉRIE ganha, para a linha que fica ser a que o rótulo promete.
 *   3. ordem alfabética, só para nunca depender da ordem de leitura.
 */
export function ordemDeEmpate(p, registro = undefined) {
  const inteiro = Number.isInteger(p?.dem) && Number.isInteger(p?.rep)
  const serie = serieDaCasa(p?.instituto, registro)
  return [inteiro ? 0 : 1, p?.instituto === serie ? 1 : 0, String(p?.instituto ?? '')]
}

/** Compara duas listas de desempate. >0 quando `a` ganha. */
export function compararEmpate(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue
    if (typeof a[i] === 'string') return a[i] < b[i] ? 1 : -1
    return a[i] > b[i] ? 1 : -1
  }
  return 0
}

/**
 * Entrada sem prova é opinião, e opinião não colapsa nome de instituto.
 * ⛔ E três travas para a tabela não poder mentir sobre si mesma: série que é
 * variante de outra entrada criaria cadeia, nome declarado duas vezes deixaria o
 * resultado dependendo da ordem de leitura, e variante da MESMA onda sem
 * assinatura nem valores seria conferência que nunca caduca.
 */
export function conferirCarga(registro = CASAS_DECLARADAS) {
  const erros = []
  const vistos = new Map()
  const series = new Set(registro.map((e) => e.serie))
  registro.forEach((e, i) => {
    const onde = `entrada ${i} (${e.serie ?? 'sem série'})`
    if (!e.serie || typeof e.serie !== 'string') erros.push(`${onde}: sem serie`)
    if (!e.conferidoEm) erros.push(`${onde}: sem conferidoEm`)
    if (!e.motivo) erros.push(`${onde}: sem motivo`)
    if (!Array.isArray(e.variantes) || e.variantes.length === 0) {
      erros.push(`${onde}: sem variantes, a entrada não colapsa nada`)
      return
    }
    for (const v of e.variantes) {
      const q = `${onde}, variante ${v?.nome ?? '?'}`
      if (!v?.nome) erros.push(`${q}: sem nome`)
      if (!PAPEIS[v?.papel]) erros.push(`${q}: papel ${v?.papel} não é um de ${Object.keys(PAPEIS).join(', ')}`)
      if (!v?.prova?.url && !v?.prova?.onde) erros.push(`${q}: sem prova (url ou onde), a afirmação ficaria sem lastro`)
      if (v?.papel === 'veiculo' && !v?.prova?.url) erros.push(`${q}: papel veiculo exige url, "quem executa" é afirmação sobre o mundo`)
      if (!v?.motivo) erros.push(`${q}: sem motivo`)
      // 🔒 A assinatura só existe quando os dois rótulos foram vistos na MESMA
      // onda, e aí ela é OBRIGATÓRIA, porque é o que faz a conferência caducar
      // se o índice reescrever o número. Quando as ondas são diferentes não há
      // rodada a fixar, e exigir assinatura ali obrigaria a inventar uma.
      if (typeof v?.mesmaOnda !== 'boolean') erros.push(`${q}: sem mesmaOnda, não se sabe se há rodada a fixar`)
      else if (v.mesmaOnda) {
        if (!v?.assinatura) erros.push(`${q}: mesmaOnda exige a assinatura da rodada em que o par foi visto`)
        if (!Array.isArray(v?.valores) || v.valores.length === 0) erros.push(`${q}: mesmaOnda exige valores, senão a conferência não caducaria`)
      } else {
        // ⛔ E o simétrico: declarar assinatura sem mesmaOnda afirma uma rodada
        // compartilhada que não existe, e essa afirmação passaria calada.
        if (v?.assinatura || v?.valores) erros.push(`${q}: mesmaOnda false não pode declarar assinatura nem valores`)
      }
      if (v?.nome === e.serie) erros.push(`${q}: variante igual à série`)
      if (series.has(v?.nome)) erros.push(`${q}: é série de outra entrada, isso criaria cadeia de nomes`)
      if (vistos.has(v?.nome)) erros.push(`${q}: já declarada em ${vistos.get(v.nome)}`)
      else if (v?.nome) vistos.set(v.nome, onde)
    }
  })
  return erros
}
