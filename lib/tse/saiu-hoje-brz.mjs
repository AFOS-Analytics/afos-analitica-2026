/**
 * SAIU OU SÓ PROMETEU? A regra que separa PROMESSA de PUBLICAÇÃO.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 20/Set/2026, com os DOIS erros no mesmo dia.
 *
 *    O bloco `📣 DIVULGAM HOJE` do relatório é o gatilho do `/atualizar-brz`, e
 *    ele lê a `divulgacao` do REGISTRO do TSE. Isso é o que a casa prometeu, e
 *    não é o que existe no mundo. Naquele dia as duas coisas divergiram nas
 *    duas direções ao mesmo tempo:
 *
 *    - **Prometeu e não saiu:** as duas nacionais da Palver tinham divulgação
 *      marcada para o dia. O único item no cache era de 00:01, com o verbo no
 *      FUTURO ("o levantamento mostrará", "os dados estarão disponíveis").
 *      Às 21h ainda não havia número nenhum.
 *    - **Saiu sem ter prometido:** a Veritá, com 40.500 entrevistas, tinha
 *      divulgação registrada para 18/Set e o bloco a tratava como vencida e
 *      calada. Os números apareceram no dia 20, a partir das 18:12, em treze
 *      manchetes nacionais. Nos caches de 18 e 19 não havia UMA.
 *
 * 🔑 Então a pergunta do gatilho ("quem prometeu para hoje?") não é a pergunta
 *    que decide se o painel está velho ("que número nacional existe hoje?").
 *    Este módulo responde a segunda, e não substitui a primeira.
 *
 * ⛔ E ELE NÃO DIZ "PUBLICADO". Manchete não carrega tempo verbal, que é a
 *    régua de `memory/feedback_a_manchete_esconde_o_tempo_verbal_nova_pesquisa_e_anuncio.md`.
 *    O veredito mais forte que ele emite é COM_NUMERO, que quer dizer "há
 *    manchete com percentual desta casa hoje, vá ao CORPO confirmar". Quem
 *    confirma é `ler-materia.mjs`, pelo protocolo ou pelo período de campo.
 */

import { palavra } from '../../scripts/lib/cobertura-imprensa-brz.mjs'

/** Percentual no formato brasileiro, com vírgula ou sem decimal: `45,73%`, `46%`. */
const PERCENTUAL = /\d{1,3}(?:[,.]\d{1,2})?\s?%/

/**
 * Marcadores de ANÚNCIO. Todos falam de uma publicação que ainda VAI acontecer.
 *
 * ⚠️ `divulga` sozinho NÃO entra, de propósito: "Palver divulga nova pesquisa"
 *    é anúncio e "Datafolha divulga Lula com 44%" é resultado. O presente do
 *    indicativo em português serve às duas, e é exatamente por isso que a
 *    manchete não decide. Quem separa aqui é a presença de NÚMERO, e o que
 *    estes padrões pegam é só a marca de tempo explícita.
 */
const ANUNCIO = [
  /\b(vai|v[ãa]o)\s+(divulgar|sair|apresentar)/i,
  /\bser[áa]\s+divulgad/i,
  /\bque\s+(sai|saem|ser[ãa]o)\b/i,
  /\bpr[óo]xima\s+pesquisa\b/i,
  /\bquando\s+sai\b/i,
  // ⚠️ O marcador de tempo NÃO vem colado no verbo. "DataTrends divulga à
  //    meia-noite nova pesquisa" põe a hora entre os dois, e a primeira versão
  //    desta linha exigia `divulga` seguido de `pesquisa`, então ela passava
  //    batido. O que liga os dois é proximidade, não adjacência.
  // 🔴 E o separador aqui é `(?:^|[\s(,:])`, NÃO `\b`, e isso custou um teste
  //    vermelho: o `\b` do JavaScript é definido sobre ASCII, então entre um
  //    espaço e o `à` de "à meia-noite" não existe fronteira nenhuma e o padrão
  //    falhava justamente na forma acentuada. É o MESMO defeito que já tinha
  //    mordido o nome da Veritá na tabela de cobertura, reaparecendo num regex
  //    escrito hoje. Acento em português não é caso de borda, é o caso comum.
  /\bdivulga(?:r[áa])?\b[^%]{0,60}?(?:^|[\s(,:])(?:neste|nesta|amanh[ãa]|[àa]s?\s+meia-?noite|no\s+pr[óo]ximo|na\s+pr[óo]xima|mais\s+tarde)\b/i,
  /\bsai\s+(?:[àa]s?|nesta|neste|amanh[ãa])\b/i,
  /\bnesta\s+semana\b/i,
]

/**
 * Classifica UM título.
 *
 * @returns 'COM_NUMERO' | 'ANUNCIO' | 'MENCAO'
 *
 * 🔑 A ordem importa e ela não é óbvia: o NÚMERO vence o marcador de anúncio.
 *    Uma matéria pode anunciar a onda de amanhã e citar o número da de hoje na
 *    mesma manchete, e nesse caso existe número publicado para olhar. O erro
 *    caro é o contrário, tratar anúncio como resultado, e esse não acontece
 *    aqui porque anúncio puro não traz percentual.
 */
export function classificarTitulo(titulo) {
  const s = String(titulo ?? '')
  if (PERCENTUAL.test(s)) return 'COM_NUMERO'
  if (ANUNCIO.some((re) => re.test(s))) return 'ANUNCIO'
  return 'MENCAO'
}

/**
 * A disputa do título é a PRESIDENCIAL, ou é estadual da mesma casa?
 *
 * 🔴 Sem isto o medidor grita, medido na primeira execução de 20/Set/2026: ele
 *    acusou 9 casas de 15, e a maioria era pesquisa ESTADUAL. "DataTrends:
 *    Raquel tem 46% e João Campos, 38% na disputa pelo Governo de Pernambuco"
 *    é número de verdade, da casa certa, no dia certo, e não diz nada sobre a
 *    nacional dela. Conferidor que acusa 9 de 15 não é usado.
 *
 * ⚠️ E isto é HEURÍSTICA de manchete, declarada como tal. Ela erra para os dois
 *    lados e por isso só encaminha para o corpo, nunca conclui.
 */
// 🔴⭐⭐ A FRONTEIRA É `palavra()`, NUNCA `\b`, e esta é a TERCEIRA vez que o
//    mesmo defeito aparece neste repositório: o `\b` do JavaScript é definido
//    sobre `[A-Za-z0-9_]`, então não existe fronteira depois de letra acentuada.
//    Medido aqui em 20/Set/2026: `/\bno\s+Cear[áa]\b/i` dá **false** em "Lula
//    tem 54% no Ceará contra 26% de Flávio Bolsonaro", porque o `\b` final vem
//    logo depois do "á". A manchete de uma pesquisa do CEARÁ passava como
//    nacional. Os nomes de estado brasileiros são justamente os que levam
//    acento: Ceará, Pará, Goiás, Piauí, Paraná, Maranhão, São Paulo.
// 🔴 26/Set/2026: a casa cola o estado no próprio nome, SEM preposição.
//    "Datafolha Ceará aponta Lula com 56% contra 26% de Flávio Bolsonaro" saiu
//    como "Datafolha COM NUMERO" no dia em que a nacional da casa era de 24/Set.
//    Por extenso vale SEM preposição e com caixa (Pará e Paraná só acentuados,
//    para "para" não casar).
// ⚠️ "Paraná Pesquisas" é nome de CASA nacional, não o estado.
const EXTENSO_SEM_PREPOSICAO =
  /(?<!\p{L})(?:Cear[áa]|Piau[íi]|Pernambuco|Bahia|Maranh[ãa]o|Amazonas|Par[á]|Goi[áa]s|Paran[á](?!\s+Pesquisas)|Minas\s+Gerais|Rio\s+Grande\s+do\s+(?:Sul|Norte)|Mato\s+Grosso|Santa\s+Catarina|Esp[íi]rito\s+Santo|Rio\s+de\s+Janeiro|S[ãa]o\s+Paulo|Distrito\s+Federal|Tocantins|Alagoas|Sergipe|Roraima|Rond[ôo]nia|Amap[áa]|Acre|Para[íi]ba)(?!\p{L})/u
const ESTADUAL = [
  palavra('governador(?:a|es)?|governo\\s+d[eoa]|governos'),
  palavra('senad(?:o|or|ora|ores)'),
  palavra('prefeit\\p{L}*|c[âa]mara|assembleia|distrital'),
  // "terceiro maior colégio eleitoral" é como a imprensa nomeia um ESTADO.
  palavra('col[ée]gio\\s+eleitoral'),
  palavra(
    '(?:no|na|em|d[eo])\\s+(?:Cear[áa]|Piau[íi]|Pernambuco|Bahia|Maranh[ãa]o|Amazonas|Par[áa]|Goi[áa]s|Paran[áa]|Minas(?:\\s+Gerais)?|Rio\\s+Grande|Mato\\s+Grosso|Santa\\s+Catarina|Esp[íi]rito\\s+Santo|Rio\\s+de\\s+Janeiro|S[ãa]o\\s+Paulo|Distrito\\s+Federal|Tocantins|Alagoas|Sergipe|Roraima|Rond[ôo]nia|Amap[áa]|Acre|Para[íi]ba)'
  ),
  // ⚠️ Sigla de UF vai SEM a bandeira `i`, de propósito: com ela, "de pe" de
  //    "de pé" casaria com PE, e "em ba" com BA.
  // 🔴 E a preposição inclui "no/na/da", corrigido em 25/Set/2026. Só com
  //    "em/de/do", 80 manchetes de setembro com o recorte ESTADUAL da disputa
  //    presidencial ("Quaest no RJ: Flávio, 35%; Lula, 33%", "Lula tem 58,1%
  //    contra 29% de Flávio no 2º turno na BA") saíam como NACIONAIS, e no dia
  //    do conserto a do AMAZONAS pelo PoderData virou "PoderData COM NUMERO".
  //    Por extenso a lista já aceitava "no/na"; a sigla tinha ficado para trás.
  // ⚠️ E "nos 26 estados E no DF" é a forma da imprensa dizer NACIONAL (a Veritá
  //    de 40,5 mil entrevistas), então o DF depois de "estados e" não conta.
  /(?<!\p{L})(?<![Ee]stados\s+e\s+)(?:em|n[oa]|d[eoa])\s+(?:MG|SP|RJ|RS|BA|PE|CE|PR|SC|GO|DF|MT|MS|PA|AM|MA|PI|AL|SE|RN|PB|ES|RO|RR|AP|AC|TO)(?!\p{L})/u,
  EXTENSO_SEM_PREPOSICAO,
  // A sigla sem preposição só depois de BARRA ("Datafolha/DF: No 2º turno,
  // Flávio mantém 51%", 26/Set/2026). Hífen fica de fora: é o padrão de partido
  // e de órgão ("PSB-MG", "TRE-SP"), não de recorte de pesquisa.
  /(?<=\p{L})\/(?:MG|SP|RJ|RS|BA|PE|CE|PR|SC|GO|DF|MT|MS|PA|AM|MA|PI|AL|SE|RN|PB|ES|RO|RR|AP|AC|TO)(?!\p{L})/u,
]

/**
 * Tira o " - Veículo" que o Google News cola no fim do título.
 *
 * 🔴 Medido em 26/Set/2026 no cache de setembro: **53 manchetes NACIONAIS**
 *    saíam como estaduais por causa do NOME DO VEÍCULO, e não da manchete.
 *    "Datafolha: Lula tem 46% e Flávio Bolsonaro, 44% no segundo turno - Diario
 *    de Pernambuco", "- Estado de Minas", "- Tribuna do Paraná", e "- Portal de
 *    Prefeitura", que casava com `prefeit`. É a nota do agregador entrando na
 *    chave outra vez: a classificação é da MANCHETE, o rodapé é de quem publicou.
 *
 * ⚠️ Só o ÚLTIMO segmento sai, porque hífen interno é parte da manchete. O
 *    "- - Bahia Economica" (traço duplo) sai inteiro.
 */
export function semVeiculo(titulo) {
  return String(titulo ?? '')
    .replace(/(?:\s+-\s*)+[^-]*$/u, '')
    .replace(/(?:\s+-)+\s*$/u, '')
    .trim()
}
const PRESIDENCIAL = [
  // 🔴 O PLURAL não é o singular mais `s`: "presidencial" vira "presidenciais",
  //    e o `l` DESAPARECE. A primeira versão desta linha era `\bpresidencial` e
  //    não via "as pesquisas presidenciais que saem nesta semana", que é a forma
  //    mais comum nas manchetes de véspera. Palavra em `-al` é regra de plural
  //    do português, não caso raro.
  /\bpresidenci(?:al|ais)\b|\bpresid[êe]ncia\b|\bpresidente\b/i,
  /\bPal[áa]cio\s+do\s+Planalto\b/i,
  // Lula E Flávio na mesma manchete, sem marca de estado, é o par nacional.
  /(?=.*\blula\b)(?=.*\bfl[áa]vio\b)/i,
]

export function ehNacional(titulo) {
  // "nos 26 estados e no DF" é a imprensa dizendo NACIONAL (Veritá, 40,5 mil).
  // O DF colado ali sai ANTES das regras, por sigla ou por extenso: até 26/Set
  // a exceção só valia para a sigla, e "e no Distrito Federal" virava estadual.
  const s = semVeiculo(titulo).replace(/(\b26\s+estados)\s+e\s+(?:n?o\s+)?(?:DF|Distrito\s+Federal)(?!\p{L})/giu, '$1')
  if (ESTADUAL.some((re) => re.test(s))) return false
  return PRESIDENCIAL.some((re) => re.test(s))
}

/**
 * 📅 A DIVULGAÇÃO REGISTRADA cai antes do fim do CAMPO?
 *
 * 🔴 POR QUE EXISTE, medido em 25/Set/2026 no arquivo inteiro do TSE: 32 dos
 *    1.138 registros presidenciais marcam divulgação antes do fim do campo, e 3
 *    marcam antes de o campo COMEÇAR. Dois desses três eram as duas nacionais
 *    vivas da Gerp (`BR005092026`, campo 30/Set a 02/Out, e `BR081682026`, campo
 *    01 a 03/Out), as duas com divulgação em 29/Set. Sem esta marca, no dia 29
 *    o medidor PROMESSA x MUNDO diria `PROMETEU_E_NAO_SAIU` sobre uma promessa
 *    que o próprio registro torna impossível, e essa é a frase que a peça
 *    publicada não pode escrever.
 *
 * ⛔ Não corrige a data e não tira o registro de lugar nenhum: a data é o que o
 *    TSE publica. Só diz que ela não pode ser lida como compromisso.
 *
 * @returns 'ANTES_DO_INICIO' | 'ANTES_DO_FIM' | null  (null também sem as 3 datas)
 */
export function divulgacaoAntesDoCampo(p) {
  const d = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null)
  const div = d(p?.publicationDate ?? p?.divulgacao)
  const ini = d(p?.fieldStart ?? p?.campoInicio)
  const fim = d(p?.fieldEnd ?? p?.campoFim)
  if (!div || !fim) return null
  if (ini && div < ini) return 'ANTES_DO_INICIO'
  if (div < fim) return 'ANTES_DO_FIM'
  return null
}

/**
 * Junta o que a casa PROMETEU com o que apareceu no cache de HOJE.
 *
 * @param casas  [{ nome, alvos: RegExp[], divulgacoes: ['YYYY-MM-DD', ...] }]
 * @param titulos ['...', ...] títulos únicos do cache de hoje
 * @param hoje    'YYYY-MM-DD', data civil do BRASIL
 */
export function medirSaida(casas, titulos, hoje) {
  if (!Array.isArray(casas)) throw new TypeError('casas tem de ser array')
  if (!Array.isArray(titulos)) throw new TypeError('titulos tem de ser array')
  if (typeof hoje !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(hoje)) {
    // 🕳️ Anti-silêncio de TIPO, não de valor: `new Date(null)` devolve a época
    //    de 1970, que é data VÁLIDA, então sem esta guarda um `null` viraria
    //    "1970-01-01" e toda promessa sairia como vencida, sem reclamar.
    throw new TypeError(`hoje tem de ser ISO YYYY-MM-DD, veio ${JSON.stringify(hoje)}`)
  }

  const linhas = []
  for (const casa of casas) {
    const daCasa = titulos.filter((t) => casa.alvos.some((re) => re.test(t)))
    // 🔑 Só a disputa PRESIDENCIAL conta para o gatilho do painel nacional. O
    //    resto fica contado ao lado, em `itensEstaduais`, para que "a casa está
    //    calada" não seja dito quando ela publicou o dia inteiro sobre estados.
    const meus = daCasa.filter(ehNacional)
    const classes = meus.map(classificarTitulo)
    const comNumero = classes.filter((c) => c === 'COM_NUMERO').length
    const anuncios = classes.filter((c) => c === 'ANUNCIO').length

    const prometeuHoje = (casa.divulgacoes ?? []).includes(hoje)
    const prometeuAntes = (casa.divulgacoes ?? []).some((d) => d < hoje)
    // 📅 Divulgação registrada ANTES do fim do campo não é promessa legível, e
    //    por isso vem numa lista à parte (`divulgacaoAntesDoCampo`). Ela não gera
    //    `PROMETEU_E_NAO_SAIU`, mas também não some: sai como aviso com nome.
    const incoerenteHoje = (casa.divulgacoesIncoerentes ?? []).includes(hoje)

    let estado
    if (comNumero > 0) estado = 'COM_NUMERO'
    else if (anuncios > 0) estado = 'SO_ANUNCIO'
    else if (meus.length > 0) estado = 'SO_MENCAO'
    else estado = 'SEM_ITEM'

    // As duas divergências que o gatilho do registro não vê, cada uma com nome.
    let divergencia = null
    if (prometeuHoje && estado !== 'COM_NUMERO') divergencia = 'PROMETEU_E_NAO_SAIU'
    else if (!prometeuHoje && estado === 'COM_NUMERO') {
      divergencia = prometeuAntes ? 'SAIU_DEPOIS_DO_PROMETIDO' : 'SAIU_SEM_PROMESSA_NA_JANELA'
    }

    linhas.push({
      nome: casa.nome,
      divulgacoes: casa.divulgacoes ?? [],
      divulgacoesIncoerentes: casa.divulgacoesIncoerentes ?? [],
      prometeuHoje,
      itens: meus.length,
      itensEstaduais: daCasa.length - meus.length,
      comNumero,
      anuncios,
      estado,
      divergencia,
      aviso: incoerenteHoje && !prometeuHoje ? 'DIVULGACAO_ANTES_DO_CAMPO' : null,
      // 🔴 Os exemplos têm de ser os do ESTADO que foi declarado, e não os três
      //    primeiros da lista. Medido em 20/Set/2026: a Datafolha saiu
      //    `COM NUMERO` e as três manchetes impressas ao lado eram todas de
      //    anúncio ("que saem nesta semana", "quando sai?"). Quem lesse a saída
      //    veria um veredito contradito pela própria prova que ele mostra, e a
      //    reação certa a isso é desconfiar do medidor inteiro.
      exemplos: (estado === 'COM_NUMERO'
        ? meus.filter((t) => classificarTitulo(t) === 'COM_NUMERO')
        : estado === 'SO_ANUNCIO'
          ? meus.filter((t) => classificarTitulo(t) === 'ANUNCIO')
          : meus
      ).slice(0, 3),
    })
  }

  const alerta = linhas.filter((l) => l.divergencia !== null)
  return {
    hoje,
    linhas,
    alerta,
    // ⛔ O veredito NUNCA é "publicado". Ele é "há o que conferir" ou "não há".
    veredito: alerta.length === 0 ? 'PROMESSA_E_MUNDO_BATEM' : 'DIVERGEM',
  }
}

/**
 * 👻 SEPARA O QUE O TSE RETIROU do que ainda é promessa.
 *
 * 🔴 POR QUE EXISTE, medido em 23/Set/2026. O passo PROMESSA x MUNDO lê a rota
 *    de pesquisas, que serve o BANCO, e o banco guarda para sempre o registro
 *    que o TSE já tirou do arquivo dele. Naquele dia a Real Time saiu como
 *    `PROMETEU_E_NAO_SAIU` com "prometeu HOJE", e a promessa não existia: a
 *    `BR-00548/2026` estava RETIRADA, e o relatório do passo 2, que baixa o
 *    arquivo do TSE, já a marcava com 👻 na MESMA rodada. Um leitor filtrava e
 *    o irmão não.
 *
 * ⛔ O custo caro não é esperar número de quem cancelou: é escrever
 *    "registrada e não divulgada" sobre um cancelamento, que é exatamente a
 *    conta que a régua do fantasma existe para impedir.
 *
 * 🔑 O casamento é por protocolo NORMALIZADO, porque o ledger grava
 *    `BR005482026` e a rota pode devolver `BR-00548/2026`. E o resultado
 *    carrega `suspeito`: ledger com fantasmas e ZERO casamento é quase sempre
 *    formato que mudou, não arquivo que ficou limpo, e isso não pode passar
 *    por corte bem-sucedido.
 */
export const normalizarProtocolo = (s) => String(s ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()

//
// 🔴 E o formato se confere no UNIVERSO servido, não nas linhas que se quer
//    cortar. Medido em 26/Set/2026: o alarme disparou com "95 fantasmas e
//    NENHUM casou com as 20 servidas", e as 20 eram as NACIONAIS, entre as quais
//    zero retiradas é o caso NORMAL. Na rota inteira, 7 de 200 casavam: o
//    formato estava certo. Um anti-silêncio que grita no caso normal ensina a
//    ignorá-lo, e aí ele não fala no dia em que o formato mudar de verdade.
//    `universo` é opcional; sem ele vale o conjunto que se corta.
export function separarFantasmas(registros, protocolosFantasma, { universo } = {}) {
  if (!Array.isArray(registros)) throw new Error('separarFantasmas exige um array de registros')
  const lista = protocolosFantasma == null ? null : [...protocolosFantasma]
  // ⛔ Sem ledger NÃO se filtra, e isso se declara: filtrar por engano some com
  //    promessa viva, que é o erro simétrico e mais caro.
  if (lista == null) return { vivas: registros, retiradas: [], semLedger: true, suspeito: false, casamNoUniverso: null }
  const set = new Set(lista.map(normalizarProtocolo))
  const vivas = []
  const retiradas = []
  for (const r of registros) {
    const p = normalizarProtocolo(r?.protocol ?? r?.protocolo)
    if (p && set.has(p)) retiradas.push(r)
    else vivas.push(r)
  }
  const base = Array.isArray(universo) ? universo : registros
  const casamNoUniverso = base.filter((r) => set.has(normalizarProtocolo(r?.protocol ?? r?.protocolo))).length
  return {
    vivas,
    retiradas,
    semLedger: false,
    casamNoUniverso,
    // 🕳️ ledger com nomes e nenhum casamento em TODO o servido: formato mudou
    suspeito: set.size > 0 && casamNoUniverso === 0 && base.length > 0,
  }
}
