/**
 * Primitivos de leitura de RSS, COMPARTILHADOS pela imprensa de cada país.
 *
 * Movidos SEM ALTERAÇÃO de `lib/us-press/collect.mjs` em 08/Nov/2026, quando
 * a França ganhou coletor de imprensa. Duas cópias do decodificador de
 * entidade divergiriam no dia em que uma fosse corrigida e a outra não, e o
 * defeito de 06/Ago (`&apos;` na tela e matéria publicada duas vezes) voltaria
 * só num país.
 *
 * ⛔ Aqui só entra o que é LEITURA de RSS. Lista de veículos, filtro de
 * assunto e teto por veículo são decisão editorial de cada país e ficam no
 * módulo do país.
 */

/**
 * 🔴 DECODIFICADOR DE ENTIDADE HTML, e ele existe por causa de um defeito com
 * duas caras que nasceu de UMA lista incompleta.
 *
 * Aqui havia cinco `.replace` fixos: `&amp;`, `&quot;`, `&#39;`, `&lt;` e
 * `&gt;`. Faltava `&apos;`, que é justamente o que os feeds da NPR e da Fox
 * mandam. O estrago apareceu em 06/Ago/2026 em dois lugares diferentes:
 *
 * 1. NA TELA: três manchetes do dia saíram com `Michigan&apos;s` e
 *    `Trump&apos;s` à vista, porque o texto chega ao React já escapado.
 *
 * 2. NO DEDUP, e este é o traiçoeiro: a chave de deduplicação remove
 *    pontuação com `[^\p{L}\p{N}\s]`, então de `&apos;` somem o `&` e o `;`
 *    e sobram as LETRAS `apos` dentro da chave. A mesma matéria da NPR virou
 *    `michiganaposs` pelo feed e `michigans` pelo Google News, as chaves não
 *    bateram e ela foi publicada DUAS VEZES, gastando o teto de 2 por veículo.
 *    Das 10 publicadas naquele dia, só 9 eram distintas.
 *
 * ⚠️ `&amp;` é decodificado POR ÚLTIMO, de propósito. Decodificado primeiro,
 * uma entrada com duplo escape (`&amp;apos;`) viraria `&apos;` e a regra
 * seguinte a transformaria em apóstrofo, inventando texto que a fonte não
 * escreveu. Por último, ela para em `&apos;` literal, que é o correto.
 */
export function decodificarEntidades(s) {
  return String(s)
    // numéricas primeiro, decimal e hexadecimal
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    // nomeadas que aparecem em feed de notícia
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // 🔴 &amp; SEMPRE por último. Ver a nota acima.
    .replace(/&amp;/g, '&')
}

export const tag = (bloco, nome) => {
  const m = bloco.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`))
  if (!m) return null
  return decodificarEntidades(
    m[1]
      .replace(/^<!\[CDATA\[/, '')
      .replace(/\]\]>$/, '')
  ).trim()
}

/**
 * O Google News põe " - Veículo" no fim do título. Tirar isso deixa o título
 * limpo e devolve o nome da casa mesmo quando o campo `source` falta.
 */
export function separarTitulo(titulo) {
  const i = titulo.lastIndexOf(' - ')
  if (i < 0) return { titulo, casa: null }
  return { titulo: titulo.slice(0, i).trim(), casa: titulo.slice(i + 3).trim() }
}

/**
 * Chave de deduplicação entre as duas fontes: mesma matéria, títulos idênticos.
 *
 * ⚠️ SEGUNDA TRAVA, e não é redundância. O `tag` já decodifica entidade na
 * entrada, mas a limpeza abaixo remove pontuação e DEIXA AS LETRAS: qualquer
 * entidade que escape da lista do decodificador entra na chave como texto
 * (`&apos;` vira `apos`) e separa duas cópias da mesma matéria. Decodificar de
 * novo aqui custa nada e fecha a porta para a entidade que eu não previ.
 *
 * 📌 Também remove um `&` solto seguido de letras, que é o resto de entidade
 * malformada, e aí sim a limpeza de pontuação não tem o que espalhar.
 */
export function chaveTitulo(t) {
  return decodificarEntidades(String(t))
    .toLowerCase()
    .replace(/&[a-z]+;?/gi, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 70)
}

