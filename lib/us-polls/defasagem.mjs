/**
 * DEFASAGEM: a lógica pura do conferidor "o instituto publicou algo que o índice
 * ainda não tem?". O script `scripts/check-us-polls-defasagem.mjs` é a casca de
 * rede em volta disto, e `scripts/testar-defasagem-us.mjs` prova esta parte.
 *
 * ⚠️ POR QUE ELA SAIU DO SCRIPT, em 07/Set/2026. Ela morava dentro do script, que
 * é um módulo com `await` no topo: importar o script é EXECUTÁ-LO, e executá-lo é
 * ir à rede. Então a regra que decide o veredicto não tinha teste nenhum, ao
 * contrário de todos os outros conferidores desta casa. E foi ela que errou hoje.
 *
 * 🔴 O DEFEITO QUE ESTE ARQUIVO EXISTE PARA FECHAR, medido em 07/Set/2026.
 *
 * O conferidor deu POSSIVEL NOVIDADE para a Big Data Poll: "a página tem data
 * mais nova que a nossa base E fala do tema". As duas metades eram verdade e a
 * conclusão era falsa, porque elas vinham de ITENS DIFERENTES da mesma página:
 *
 *   - a data mais nova, 27/Ago/2026, é de um post sobre deportação de haitianos
 *     com TPS em Springfield, Ohio;
 *   - o "Generic Ballot" é um item PERMANENTE do catálogo de projetos, ao lado de
 *     "2024 Republican Presidential Nomination".
 *
 * Enquanto aquele link existir, QUALQUER post novo daquela casa dispara o alarme,
 * para sempre. Falso positivo que não se esgota é pior que ruído: ele gasta o
 * crédito do portão, que é o mesmo custo do conferidor de tela em 06/Set.
 *
 * 🔑 E o conserto já existia no próprio script, só que num caminho só. Em
 * 19/Ago o caminho de RSS ganhou exatamente esta regra ("a data tem que ser a do
 * ITEM que fala do tema") por causa das estaduais da Emerson. O caminho de HTML
 * ficou de fora, com um comentário declarando que ali não dava para amarrar data
 * a item. Dá, por PROXIMIDADE: numa listagem, o título e a data do mesmo item
 * ficam a poucas dezenas de caracteres um do outro, e o catálogo do rodapé fica
 * a milhares.
 *
 * ⛔ E o que a proximidade NÃO pode fazer é virar silêncio. Quando existe data
 * nova e o tema aparece na página LONGE dela, o veredicto não vira EM DIA: vira
 * `TEMA LONGE DA DATA`, que é o conferidor declarando que não consegue amarrar os
 * dois. Rebaixar a confiança é honesto; fechar a suspeita com verde não é.
 */

/**
 * Marcadores de que o texto fala do voto para o Congresso, e não de outra pesquisa.
 *
 * 🔇 `congressional environment` e `congressional preference` entraram em 10/Set/2026,
 * e a razão é um ALARME MUDO medido no feed da Quantus Insights.
 *
 * O post de 28/Ago traz a rodada nacional de 1.200 likely voters com o generic
 * ballot em D 49,7 x R 42,8, e o resumo do item chama isso de "a D+6.9
 * congressional environment". O título é "Democrats Hold the Midterm Advantage",
 * e `midterm (?:election|vote|ballot)` não casa com "midterm advantage".
 *
 * 🔴 O desfecho sem os dois termos não era INCONCLUSIVO nem alarme: era EM DIA.
 * Quatro itens ANTIGOS do mesmo feed casavam o marcador, então "o tema existe na
 * página" era verdade e "o item novo é do tema" era falso, que é a conjunção de
 * duas verdades de itens diferentes de novo. Casa com rodada nacional fora do
 * índice, declarada em dia.
 *
 * ⛔ Alargar marcador aumenta a chance de falso positivo, e este é o lado certo
 * de errar: falso positivo custa ler um trecho, falso negativo custa a rodada.
 * Os dois termos são jargão de generic ballot nacional, e os posts estaduais e
 * distritais da mesma casa seguem fora, com caso plantado provando cada um.
 */
export const MARCADOR =
  /generic (?:congressional )?ballot|congressional (?:ballot|vote|environment|preference)|house of representatives|midterm (?:election|vote|ballot)|control of congress/i

const MESES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7,
  august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
}

/**
 * Quantos caracteres de texto visível separam o título de um item da data dele.
 *
 * 📏 Medido na página da Big Data Poll em 07/Set/2026: o título do post fica a
 * ~60 caracteres da data dele, e o "Generic Ballot" do catálogo está a mais de
 * 2.000 do post mais recente. 200 é folgado para o item e apertado para o
 * catálogo, e a folga é do lado certo: errar para mais só devolve o alarme de
 * hoje, que já se sabe ler.
 */
export const JANELA_ITEM = 200

/** Uma listagem de verdade tem uma data por item. Menos de 3 é página não lida. */
export const DATAS_MIN = 3

/**
 * A nossa base guarda FIM DE CAMPO e o site do instituto dá DATA DE PUBLICAÇÃO,
 * que vem depois. Comparar cruas transforma a MESMA pesquisa em novidade.
 * Medido em 19/Ago sobre quatro casos conferidos à mão: no máximo 3 dias.
 */
export const TOLERANCIA_DIAS = 7

const hojeIso = () => new Date().toISOString().slice(0, 10)

/**
 * Toda ocorrência de data no texto, COM a posição, que é o que permite amarrar
 * data e assunto. Data futura é lixo de template ou de calendário eleitoral.
 */
export function ocorrenciasDe(txt, hoje = hojeIso()) {
  const out = []
  const guarda = (iso, index) => { if (iso <= hoje) out.push({ iso, index }) }
  for (const m of txt.matchAll(/\b([A-Z][a-z]{2,8})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(20\d{2})/g)) {
    const mes = MESES[m[1].toLowerCase()]
    if (mes) guarda(`${m[3]}-${String(mes).padStart(2, '0')}-${String(+m[2]).padStart(2, '0')}`, m.index)
  }
  for (const m of txt.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) guarda(`${m[1]}-${m[2]}-${m[3]}`, m.index)
  for (const m of txt.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/g)) {
    guarda(`${m[3]}-${String(+m[1]).padStart(2, '0')}-${String(+m[2]).padStart(2, '0')}`, m.index)
  }
  return out.sort((a, b) => a.index - b.index)
}

/** As datas distintas do texto, em ordem. Mesma saída da versão antiga. */
export function datasDe(txt, hoje = hojeIso()) {
  return [...new Set(ocorrenciasDe(txt, hoje).map((o) => o.iso))].sort()
}

/**
 * As datas cujo ITEM fala do tema, amarradas por proximidade. É esta a lista que
 * decide o veredicto no caminho de HTML.
 */
export function datasDoTemaEmHtml(txt, hoje = hojeIso(), janela = JANELA_ITEM) {
  const achadas = new Set()
  for (const { iso, index } of ocorrenciasDe(txt, hoje)) {
    const vizinhanca = txt.slice(Math.max(0, index - janela), index + janela)
    if (MARCADOR.test(vizinhanca)) achadas.add(iso)
  }
  return [...achadas].sort()
}

/**
 * O texto em volta da ÚLTIMA ocorrência de uma data, para o humano decidir sem
 * abrir o navegador. É o atalho que faltava: hoje o veredicto mandava "abrir a
 * página à mão", e abrir custou quatro requisições para descobrir que o item era
 * uma pesquisa local de Ohio.
 */
export function trechoDaData(txt, iso, hoje = hojeIso(), raio = 170) {
  const ocorr = ocorrenciasDe(txt, hoje).filter((o) => o.iso === iso)
  if (!ocorr.length) return null
  const { index } = ocorr[ocorr.length - 1]
  return txt.slice(Math.max(0, index - raio), index + 60).trim().replace(/\s+/g, ' ')
}

export const VEREDITOS = {
  SEM_BASE: 'SEM BASE',
  INCONCLUSIVO: 'INCONCLUSIVO',
  POSSIVEL_NOVIDADE: 'POSSIVEL NOVIDADE',
  TEMA_LONGE: 'TEMA LONGE DA DATA',
  SEM_ITEM_DO_TEMA: 'SEM ITEM DO TEMA',
  EM_DIA: 'EM DIA',
}

const diasDepois = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000)

/**
 * O veredicto de uma casa.
 *
 * `granularidade` é o que separa os dois caminhos e precisa ser dito:
 *   - 'item'        (RSS): data e assunto vêm do MESMO item, então ausência de
 *                   tema em item novo é informação, e EM DIA é legítimo.
 *   - 'proximidade' (HTML): a amarração é inferida, então data nova sem tema
 *                   perto NÃO vira EM DIA, vira TEMA LONGE DA DATA.
 */
export function veredito({
  conhecido,
  datas = [],
  datasDoTema = [],
  temaNaPagina = false,
  granularidade = 'item',
  datasMin = DATAS_MIN,
  tolerancia = TOLERANCIA_DIAS,
}) {
  const leuAPagina = datas.length >= datasMin
  const passouControle = leuAPagina && !!conhecido && datas.some((d) => d >= conhecido)
  const maisRecente = datas.length ? datas[datas.length - 1] : null
  const maisRecenteTema = datasDoTema.length ? datasDoTema[datasDoTema.length - 1] : null
  const nova = (d) => !!d && diasDepois(conhecido, d) > tolerancia

  let veredicto
  if (!conhecido) veredicto = VEREDITOS.SEM_BASE
  else if (!passouControle) veredicto = VEREDITOS.INCONCLUSIVO
  else if (nova(maisRecenteTema)) veredicto = VEREDITOS.POSSIVEL_NOVIDADE
  else if (granularidade === 'proximidade' && temaNaPagina && nova(maisRecente)) veredicto = VEREDITOS.TEMA_LONGE
  else if (!temaNaPagina) veredicto = VEREDITOS.SEM_ITEM_DO_TEMA
  else veredicto = VEREDITOS.EM_DIA

  return { veredicto, maisRecente, maisRecenteTema, leuAPagina, passouControle }
}

/** Ordem de exibição: o que exige ação humana primeiro. */
export const ORDEM = {
  [VEREDITOS.POSSIVEL_NOVIDADE]: 0,
  [VEREDITOS.TEMA_LONGE]: 1,
  INCONCLUSIVO: 2,
  INACESSIVEL: 3,
  [VEREDITOS.SEM_ITEM_DO_TEMA]: 4,
  [VEREDITOS.SEM_BASE]: 5,
  [VEREDITOS.EM_DIA]: 6,
}
