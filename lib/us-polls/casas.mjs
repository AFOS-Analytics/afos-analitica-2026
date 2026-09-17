/**
 * A SÉRIE de uma casa, quando o índice troca o nome dela no meio do caminho.
 *
 * 🔴 POR QUE ISTO EXISTE (17/Set/2026): a Big Data Poll publicou a rodada de
 * 13-15/Set e o índice a listou como "Big Data Poll/Public Polling Project",
 * sem o "(R)" das dez rodadas anteriores, porque o patrocínio passou a ser um
 * projeto de financiamento coletivo. A média não sofre: ela identifica RODADA
 * por nome e fim de campo, e a rodada entrou certa. Quem sofre são os medidores
 * que agrupam por CASA, e todos agrupavam pelo nome cru:
 *
 *   - o conferidor de defasagem dizia "temos 2026-07-29" para uma casa cuja
 *     rodada de 15/Set já estava no arquivo, e classificou o próprio post
 *     dessa rodada como TEMA LONGE DA DATA;
 *   - a cadência via a série velha calada desde 29/Jul e a série nova com UMA
 *     rodada, sem cadência nenhuma;
 *   - a exposição e as listagens próprias procuravam o registro pelo nome velho.
 *
 * Nada disso dá erro. O nome novo vira uma casa nova, e a casa velha envelhece.
 *
 * ⛔ A TABELA É EXPLÍCITA, NUNCA POR SEMELHANÇA. Tirar "(R)" de todo nome, ou
 * casar pelo prefixo antes da barra, juntaria séries que são de fato outras:
 * "Morning Consult" e "Morning Consult/Cato Institute" são produtos diferentes,
 * e "HarrisX/Forbes" não é "Harvard/Harris Poll/HarrisX". Cada entrada aqui é
 * uma afirmação conferida de que é a MESMA série com outro rótulo.
 *
 * ⛔ NÃO ENTRA NA MÉDIA NEM NO ARQUIVO PUBLICADO. O `instituto` gravado continua
 * sendo o que o índice escreveu, e `media()` continua chaveando pelo nome cru:
 * dentro de uma rodada o nome não muda, e reescrever o nome no arquivo apagaria
 * a prova do que a fonte publicou.
 */

/** nome como aparece no índice → nome da série. Conferir a fonte antes de somar uma linha. */
export const SERIES_DE_CASA = {
  // Mesma casa, mesmo blog (bigdatapoll.com), mesma cadência mensal e mesmo
  // desenho LV/RV. Troca de patrocinador conferida no post de 16/Set/2026.
  'Big Data Poll (R)': 'Big Data Poll',
  'Big Data Poll/Public Polling Project': 'Big Data Poll',
  // Já tratado desde agosto como apelido dentro do conferidor de defasagem.
  Focaldata: 'Focaldata/Financial Times',
  // ⏳ NÃO entrou sem conferência: "The Washington Post/ABC News/Ipsos" e
  // "Washington Post/ABC News/Ipsos" parecem o mesmo rótulo com e sem artigo.
  // São rodadas esparsas e fora da cadência medida, então esperar custa zero.
}

/** O nome da SÉRIE. Nome fora da tabela volta como veio: ausência de entrada não é erro. */
export function serieDaCasa(nome) {
  if (typeof nome !== 'string') return nome
  return Object.prototype.hasOwnProperty.call(SERIES_DE_CASA, nome) ? SERIES_DE_CASA[nome] : nome
}

/** Todos os nomes do índice que pertencem a uma série, incluindo o próprio nome da série. */
export function nomesDaSerie(serie) {
  const nomes = new Set([serie])
  for (const [nome, s] of Object.entries(SERIES_DE_CASA)) if (s === serie) nomes.add(nome)
  return [...nomes]
}
