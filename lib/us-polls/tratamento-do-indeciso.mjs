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
