import { serieDaCasa } from './casas.mjs'

/**
 * 🎚️ QUAL TRATAMENTO DO INDECISO A MÉDIA SERVE, quando o instituto publica mais
 * de um na MESMA onda.
 *
 * 🔑 POR QUE EXISTE, decidido pelo André em 05/Out/2026.
 *
 * A hierarquia `LV > RV > A` ordena o RECORTE DE ELEITOR, e essa é outra
 * dimensão. Um instituto pode publicar, da mesma rodada e do mesmo recorte,
 * o voto ANTES de alocar quem está indeciso, DEPOIS de alocar quem pende para
 * um lado, e só entre quem já decidiu. São três números diferentes da mesma
 * pergunta, e a escolha entre eles não é recorte: é tratamento do indeciso.
 *
 * ⚠️ A casa já tinha NOMEADO essa dimensão e declarado que não a usava. O campo
 * `comLeaners` do `collect.mjs` existe desde o caso da John Zogby Strategies de
 * 15-17/Set/2026, lê a nota `{{efn|name="lean"}}` do índice, e o comentário dele
 * diz, literalmente: *"Este campo é ADITIVO e não muda nada... Trocar a régua de
 * escolha é decisão do André, e sem medida não há decisão."* Naquele caso a
 * margem era D+6 nos dois lados, então a média não sofria e a decisão podia
 * esperar. Este é o segundo caso e o PRIMEIRO em que a dimensão move o número.
 *
 * 🔴 A ASSINATURA É POR VALOR, e isso é a caducidade, não preciosismo.
 *
 * O caminho tentador seria apontar o recorte ou a amostra da linha escolhida, e
 * ele estaria errado: o índice ERRA os dois. Na onda que criou este registro ele
 * rotulou o painel escolhido como recorte de ADULTOS quando o documento diz
 * eleitores registrados, e emprestou a ele o N de outra pergunta. Casar por
 * `dem` e `rep` faz a escolha valer enquanto o número for o número conferido: se
 * o índice reescrever, nenhuma linha casa, o registro CADUCA e isso sai dito em
 * `estado: 'CADUCOU'`, nunca em silêncio.
 *
 * ⛔ ELE NÃO CORRIGE VALOR NENHUM e não cria linha. A Wikipédia é o ÍNDICE, e
 * escrever número à mão muda a procedência. Tudo que este registro faz é dizer,
 * entre as linhas que o índice JÁ trouxe para aquela onda, qual delas a média
 * serve. Por isso ele nunca muda o `n`: troca quem representa a rodada.
 */
export const TRATAMENTO_ESCOLHIDO = [
  {
    serie: 'Angus Reid Global',
    campoFim: '2026-09-25',
    // O rótulo é o do DOCUMENTO, copiado, não um nome nosso.
    escolha: 'With leaners',
    dem: 45,
    rep: 34,
    decididoEm: '2026-10-05',
    conferidoEm: '2026-10-05',
    motivo:
      'O documento traz UM gráfico de generic ballot, "Midterm House of Representatives vote intention", com TRÊS painéis, e os três são entre eleitores registrados: o gráfico por filiação declara a base como "(Decided and leaning among registered voters)", n=919. O André escolheu o painel "With leaners" em 05/Out/2026. ' +
      '🔴 E a escolha corrige um defeito do índice que nenhum portão alcançava: a linha que a média servia até aqui trazia D 49 x R 35 com n=1.041, e "49" NÃO APARECE NO DOCUMENTO, conferido em três formas (extração com layout, sem layout e no binário do PDF), com controle positivo em "56", que aparece 5 vezes nas duas extrações. O n=1.041 é a base de eleitores registrados da pergunta de APROVAÇÃO do Trump, não do generic ballot, e o `outros` 16 daquela linha é a barra de indecisos do painel "Initial vote intent", sozinha. ' +
      '✅ A linha que o índice traz com D 45 x R 34 tem `outros` 21, e o residual do painel "With leaners" no documento é 4 + 7 + 10 = 21, exato: é a confirmação independente de que aquela linha É este painel, residual incluído. O índice a rotula como recorte de ADULTOS, com n=1.205, que é a base de todos os adultos de outra pergunta; o documento diz eleitores registrados. ' +
      '⛔ Nada foi reescrito: o registro só diz qual das linhas do índice a média serve.',
    prova: 'https://angusreid.us/wp-content/uploads/2026/09/2026.09.28_Trump_Midterms.pdf',
    tituloDoGrafico: 'Midterm House of Representatives vote intention',
    baseDeclarada: 'Decided and leaning among registered voters (n=919)',
    // Os três painéis como o documento os publica, para a escolha poder ser
    // refeita sem abrir o PDF de novo. `dem` e `rep` são as duas primeiras
    // barras de cada painel e saem sem ambiguidade de posição; o residual é a
    // SOMA das barras restantes, porque o gráfico é empilhado e a extração em
    // texto não separa "Another party", "Undecided" e "Would not vote" com
    // garantia. Declarar a soma é o que a medição sustenta.
    paineis: [
      { rotulo: 'Initial vote intent', dem: 42, rep: 32, residual: 27, barras: 5 },
      { rotulo: 'With leaners', dem: 45, rep: 34, residual: 21, barras: 5 },
      { rotulo: 'Registered and Decided', dem: 56, rep: 40, residual: 5, barras: 3 },
    ],
  },
  {
    // 🎚️ O SEGUNDO caso, e ele difere do primeiro no que mais importa:
    // AQUI NAO DA PARA ABRIR O DOCUMENTO.
    //
    // Na Angus Reid o PDF estava aberto e os rotulos dos tres paineis foram
    // COPIADOS dele ("Initial vote intent", "With leaners", "Registered and
    // Decided"). Aqui o topline esta atras de paywall, conferido em 03/Out/2026,
    // e o indice herdou do agregador uma data de campo que o proprio documento
    // contradiz (ele diz que o campo acaba em 21/Set e o indice grava 22).
    //
    // ⛔ Entao os rotulos abaixo sao DESCRITIVOS e nossos, nao copiados, e a
    // prova NAO sustenta os paineis do documento: ela sustenta duas outras
    // coisas, que sao o que a decisao usou.
    //
    // 🔑 O QUE A DECISAO USOU, e os dois sao medicao e nao leitura de PDF:
    //
    //   1. A ANOTACAO DO PROPRIO INDICE. Ele marca as duas linhas de `outros`
    //      vazio com `{{efn|name="lean"}}`, e o campo `comLeaners` do coletor as
    //      le como `true`. As quatro linhas desta onda somam 100, duas por
    //      D+R+outros e duas por D+R sozinhos, entao o PORTAO DA SOMA e
    //      estruturalmente cego a distincao: quem a enxerga e a anotacao.
    //
    //   2. A CONTINUIDADE DA SERIE DESTA CASA, medida nas SETE ondas que ela
    //      tem no arquivo: em todas as sete a producao servia a versao de DUAS
    //      VIAS, de 27/Jan a 22/Set. Nao por decisao, por ordem de aparicao no
    //      artigo, mas sem excecao.
    //
    // ⚖️ A REGUA QUE DECIDIU, e ela e da casa desde a Focaldata, 20/Set:
    // "a descontinuidade dentro da serie de uma casa e pior que a diferenca de
    // convencao entre casas". Trocar para a versao com residual agora faria esta
    // casa cair de D+10 para D+9 por mudanca NOSSA, e no RV de D+6 para D+7, sem
    // nada ter acontecido no mundo. E o precedente da ActiVote fecha: a
    // normalizada ENTRA, com a normalizacao DECLARADA.
    //
    // 📌 Custo na media de hoje: ZERO. A linha escolhida e a que ja era
    // servida; o que muda e que a escolha deixa de ser "a que veio primeiro no
    // artigo" e passa a ser decisao datada, com caducidade por VALOR.
    //
    // ⚠️ E FICA DECLARADO O QUE ESTA DECISAO NAO RESOLVE: a hierarquia
    // LV > RV > A mudou esta casa de RV para LV nesta setima onda, porque e a
    // primeira em que ela publica LV, e isso vale QUATRO pontos (LV duas vias
    // D+10,00 contra RV duas vias D+6,00). E outra dimensao, tem ferramenta
    // propria (`efeito-do-recorte-us.mjs`) e segue decisao separada. Juntar as
    // duas faria uma decisao sobre o indeciso carregar de carona uma troca de
    // recorte que vale o dobro.
    serie: 'The Argument/Verasight',
    campoFim: '2026-09-22',
    escolha: 'LV, duas vias normalizada',
    dem: 55,
    rep: 45,
    decididoEm: '2026-10-07',
    conferidoEm: '2026-10-07',
    motivo:
      'O indice traz QUATRO linhas desta onda, que sao dois pares: cada recorte publicado em versao normalizada em duas vias (`outros` vazio, D+R fechando 100) e em versao com o residual. ' +
      'As quatro somam 100, entao o portao da soma nao distingue; quem distingue e a anotacao `{{efn|name="lean"}}` do indice, que o campo `comLeaners` le como true nas duas de duas vias. ' +
      'DECIDIDO pela CONTINUIDADE DA SERIE, medida: nas sete ondas desta casa no arquivo, de 27/Jan a 22/Set, a producao servia a versao de duas vias em TODAS, por ordem de aparicao e nunca por decisao. ' +
      'Trocar agora inventaria uma queda nossa, que e a regua da Focaldata de 20/Set, e o precedente da ActiVote manda a normalizada entrar com a normalizacao declarada. ' +
      '🔴 PROVA LIMITADA, e isto fica dito: o topline esta atras de PAYWALL (conferido em 03/Out/2026), os rotulos dos paineis aqui sao DESCRITIVOS e nossos e nao copiados do documento, e o indice herdou do agregador uma data de campo que o documento contradiz, 22/Set contra 21. ' +
      'A prova sustenta a ANOTACAO do indice e a CONTINUIDADE da nossa serie, e NAO o topline. ' +
      '⚠️ Esta decisao NAO resolve o recorte: a hierarquia mudou esta casa de RV para LV nesta onda, o que vale quatro pontos, e segue decisao separada.',
    prova: 'https://www.theargumentmag.com/p/the-least-popular-war-since-vietnam',
    tituloDoGrafico: '(nao legivel: topline atras de paywall)',
    baseDeclarada: 'o indice grava n=1603 RV nas duas linhas RV e deixa a amostra VAZIA nas duas LV; o agregador declara 1533 LV, e o documento diz que 1.533 e o COMPLETADO de 1.603 REGISTRADOS',
    paineis: [
      { rotulo: 'LV, duas vias normalizada', dem: 55, rep: 45, residual: 0, barras: 2 },
      { rotulo: 'LV, com residual', dem: 50, rep: 41, residual: 9, barras: 3 },
      { rotulo: 'RV, duas vias normalizada', dem: 53, rep: 47, residual: 0, barras: 2 },
      { rotulo: 'RV, com residual', dem: 48, rep: 41, residual: 11, barras: 3 },
    ],
  },
]

/** A entrada da onda, pela SÉRIE: o rótulo do veículo acha a do executor. */
export function buscar(poll, registro = TRATAMENTO_ESCOLHIDO) {
  if (!poll?.campoFim) return null
  const alvo = serieDaCasa(poll.instituto)
  return (
    (registro ?? []).find((e) => serieDaCasa(e.serie) === alvo && e.campoFim === poll.campoFim) ?? null
  )
}

/**
 * 🎚️ ESTA LINHA É O PAINEL ESCOLHIDO PARA ESTA ONDA?
 *
 * Casa por `dem` e `rep`, que é a assinatura que caduca. Linha de onda não
 * declarada devolve `false` sem efeito nenhum: quem não está no registro
 * continua decidido pela hierarquia de recorte, como antes.
 */
export function ehEscolhida(poll, registro = TRATAMENTO_ESCOLHIDO) {
  const e = buscar(poll, registro)
  if (!e) return false
  return poll.dem === e.dem && poll.rep === e.rep
}

/**
 * 🔍 O ESTADO da escolha, sobre as linhas que o índice trouxe para a onda.
 *
 * ⛔ Existe porque a escolha pode falhar de DUAS maneiras caladas, e as duas
 * precisam sair ditas:
 *   - `CADUCOU`: nenhuma linha casa com os valores declarados. O índice
 *     reescreveu o número, e a escolha deixou de ter objeto. ⚠️ Não é "em
 *     ordem": é dívida contra a origem, e a média volta à hierarquia de
 *     recorte, que é justamente o comportamento que a escolha existia para
 *     corrigir.
 *   - `AMBIGUA`: mais de uma linha casa. Aí quem decide volta a ser a ordem de
 *     leitura, que é o defeito original sob outro nome.
 */
export function auditar(linhasDaOnda, registro = TRATAMENTO_ESCOLHIDO) {
  const lista = linhasDaOnda ?? []
  if (!lista.length) return null
  const e = buscar(lista[0], registro)
  if (!e) return null
  const casam = lista.filter((p) => p.dem === e.dem && p.rep === e.rep)
  const estado = casam.length === 1 ? 'ESCOLHIDA' : casam.length === 0 ? 'CADUCOU' : 'AMBIGUA'
  return {
    serie: serieDaCasa(e.serie),
    campoFim: e.campoFim,
    escolha: e.escolha,
    declarado: { dem: e.dem, rep: e.rep },
    estado,
    quantasCasam: casam.length,
    // O que a onda tem no índice, para o relato não precisar reabrir o arquivo.
    linhasDaOnda: lista.map((p) => ({
      dem: p.dem,
      rep: p.rep,
      outros: p.outros ?? null,
      amostra: p.amostra ?? null,
      amostraTipo: p.amostraTipo ?? null,
      escolhida: p.dem === e.dem && p.rep === e.rep,
    })),
    prova: e.prova,
    conferidoEm: e.conferidoEm,
    decididoEm: e.decididoEm,
  }
}

/**
 * Entrada sem prova é opinião, e opinião não escolhe o número que a casa serve.
 *
 * ⛔ As travas que impedem a tabela de mentir sobre si mesma: onda declarada
 * duas vezes deixaria o resultado dependendo da ordem de leitura; escolha cujos
 * valores não estão entre os painéis declarados seria escolha sem origem, e aí
 * a decomposição não serviria para refazer a conta; e painel repetido tornaria a
 * conferência impossível de reproduzir.
 */
export function conferirCarga(registro = TRATAMENTO_ESCOLHIDO) {
  const erros = []
  const vistas = new Set()
  for (const [i, e] of (registro ?? []).entries()) {
    const onde = `entrada ${i} (${e?.serie ?? 'sem série'} ${e?.campoFim ?? 'sem campoFim'})`
    if (!e?.serie || typeof e.serie !== 'string') erros.push(`${onde}: sem serie`)
    if (!e?.campoFim || !/^\d{4}-\d{2}-\d{2}$/.test(e.campoFim)) erros.push(`${onde}: campoFim ausente ou fora de AAAA-MM-DD`)
    if (!e?.escolha) erros.push(`${onde}: sem escolha, e o rótulo do painel é o que liga a decisão ao documento`)
    if (!e?.prova) erros.push(`${onde}: sem prova`)
    if (!e?.conferidoEm) erros.push(`${onde}: sem conferidoEm`)
    if (!e?.decididoEm) erros.push(`${onde}: sem decididoEm, e escolha sem data não se revê`)
    if (!e?.motivo) erros.push(`${onde}: sem motivo`)
    if (!Number.isFinite(e?.dem) || !Number.isFinite(e?.rep)) {
      erros.push(`${onde}: dem ou rep não é número, e é por eles que a escolha CADUCA`)
    }
    const chave = `${serieDaCasa(e?.serie)}|${e?.campoFim}`
    if (vistas.has(chave)) erros.push(`${onde}: onda declarada duas vezes, o resultado dependeria da ordem de leitura`)
    vistas.add(chave)

    const paineis = Array.isArray(e?.paineis) ? e.paineis : []
    if (paineis.length < 2) {
      erros.push(`${onde}: menos de 2 painéis declarados, e sem eles não há o que escolher`)
    }
    const rotulos = new Set()
    for (const p of paineis) {
      if (!p?.rotulo) erros.push(`${onde}: painel sem rótulo`)
      else if (rotulos.has(p.rotulo)) erros.push(`${onde}: painel "${p.rotulo}" declarado duas vezes`)
      else rotulos.add(p.rotulo)
      if (!Number.isFinite(p?.dem) || !Number.isFinite(p?.rep)) erros.push(`${onde}: painel "${p?.rotulo}" sem dem/rep numéricos`)
    }
    if (paineis.length && !paineis.some((p) => p.rotulo === e.escolha)) {
      erros.push(`${onde}: a escolha "${e.escolha}" não está entre os painéis declarados`)
    }
    const escolhido = paineis.find((p) => p.rotulo === e.escolha)
    if (escolhido && (escolhido.dem !== e.dem || escolhido.rep !== e.rep)) {
      erros.push(
        `${onde}: os valores da escolha (D ${e.dem} x R ${e.rep}) não são os do painel "${e.escolha}" (D ${escolhido.dem} x R ${escolhido.rep})`,
      )
    }
  }
  return erros
}
