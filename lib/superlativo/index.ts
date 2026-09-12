/**
 * A régua de SUPERLATIVO, em UM lugar só.
 *
 * 🔴 POR QUE ESTE MÓDULO EXISTE, medido em 12/Set/2026.
 * A regra vivia inteira dentro de `scripts/validate-polls-data.ts` e varria
 * apenas os JSONs do PAINEL. A AFOS Daily, que é onde a frase vai para a tela
 * em três idiomas e para o broadcast, não tinha varredura nenhuma. A ficha de
 * 05/Set já dizia por escrito que "nenhum dos gates da casa reprova afirmação
 * de superlativo", e seis dias depois a daily de 11/Set foi ao ar afirmando em
 * quatro posições de cada idioma que 53,95% era "o ponto mais alto da série",
 * quando a série guarda 55,10% de 10/Set.
 *
 * 🕳️ E O BURACO ERA DE VOCABULÁRIO, que é o achado que importa.
 * Medido nas 143 dailies pt-BR publicadas: com a lista ANTIGA, a daily de
 * 11/Set produzia ZERO alerta. O escopo temporal casava ("da série"), mas
 * nenhum termo da lista casava, porque ela conhecia "a maior" e "o maior" e
 * NÃO conhecia "mais alto". Portão que não pode disparar é indistinguível de
 * portão quebrado.
 * → memory/feedback_fechamento_do_dia_esconde_topo_e_piso.md
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * ⭐ As formas acrescentadas não foram imaginadas, foram colhidas em peça
 * publicada. Só elas fazem 18 dailies que escapavam INTEIRAS passarem a ser
 * vistas, entre elas 30 e 31/Jul e 16/Ago, todas com "topo da série".
 *
 * ⛔ O QUE ESTE MÓDULO NÃO FAZ, e a distinção é honestidade, não modéstia.
 * Ele não sabe se o superlativo é VERDADEIRO. Ele é textual e não consulta
 * série nenhuma. Ele diz "esta frase afirma extremo e exige conferência", e
 * quem confere é `scripts/check-superlativo.ts`, que lê o Neon inteiro.
 * Declarar escopo não torna a afirmação verdadeira, só a torna checável.
 */

/**
 * ⚠️ A lista é DECLARADA, nunca derivada. Complemento de conjunto é ralo: um
 * jeito novo de escrever superlativo precisa entrar aqui à mão, com o caso ao
 * lado, em vez de ser capturado por uma regra genérica que também pegaria
 * prosa inocente.
 */
export const SUPERLATIVOS =
  /\b(a mais larga|o mais largo|a mais estreita|a maior|o maior|a menor|o menor|recorde|in[ée]dit[oa]|pela primeira vez|nunca ante[sr]|teto|piso hist[óo]rico|mais alt[oa]|mais baix[oa]|topo d[aeo]|piso d[aeo]|pico d[aeo]|maior n[íi]vel|menor n[íi]vel)\b/gi

/**
 * ⚠️ ESCOPO TEMPORAL é o PERIGOSO, e é contra-intuitivo: a frase que causou o
 * incidente de 19/Jul DECLARAVA janela ("a mais larga DO CICLO"), e a de
 * 11/Set também ("da série, aberta em 14 de abril"). Declarar escopo não
 * torna verdadeiro; torna checável, e a checagem exige a série INTEIRA.
 */
export const ESCOPO_TEMPORAL =
  /\b(do ciclo|do ano|da s[ée]rie|hist[óo]ric[oa]|de todos os tempos|at[ée] aqui|em qualquer)\b/i

/**
 * Escopo interno ao documento se confere na própria frase e é risco menor.
 * ⚠️ 23/Ago/2026: esta regex reprovou QUATRO frases corretas, e as quatro
 * falharam na PREPOSIÇÃO: o texto dizia "NO recorte", "NA janela", e a lista
 * só aceitava "DO recorte". Portão que acusa frase correta ensina alguém a
 * ignorar o portão. A preposição é livre desde então.
 */
export const ESCOPO_LOCAL = new RegExp(
  '\\b[dn][oa]s? (p[áa]reo|painel|book|rodada|recorte|janela|semana|dia|m[êe]s|levantamento|livro|quadro|calend[áa]rio)\\b' +
    '|\\b(desta|nesta|nessa|dessa) (pesquisa|leitura|rodada|janela|edi[çc][ãa]o|tabela)\\b' +
    '|\\bentre (as|os|essas|esses|estas|estes)\\b' +
    '|\\bdesde \\d' +
    '|\\bnas [úu]ltimas\\b' +
    '|\\bem \\d+ dias\\b' +
    '|\\bem (janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\\b',
  'i'
)

export interface AchadoSuperlativo {
  /** O termo que casou, para a mensagem dizer O QUE acusou. */
  termo: string
  /** A frase, cortada, para quem lê o alerta achar o lugar sem abrir o arquivo. */
  frase: string
  /** `temporal` exige varrer a série inteira; `ausente` é superlativo solto. */
  escopo: 'temporal' | 'ausente'
}

/**
 * 🔑 Markdown quebra frase por LINHA e por pontuação, não só por pontuação.
 * Segmentar apenas em [.!?;] faz um parágrafo inteiro virar uma "frase" só, e
 * aí um superlativo de um parágrafo casa com o escopo declarado de outro.
 * Medido em 12/Set, ao escrever o medidor desta própria régua.
 */
function frasesDe(texto: string): string[] {
  return texto
    .split(/\n+/)
    .flatMap((linha) => linha.split(/(?<=[.!?;])\s+/))
    .map((f) => f.trim())
    .filter((f) => f.length > 15)
}

/**
 * Acha superlativos que exigem conferência. Devolve lista vazia quando o texto
 * não é string, em vez de explodir: o chamador varre campos opcionais.
 */
export function acharSuperlativos(texto: unknown): AchadoSuperlativo[] {
  if (typeof texto !== 'string' || !texto) return []
  const achados: AchadoSuperlativo[] = []
  for (const frase of frasesDe(texto)) {
    SUPERLATIVOS.lastIndex = 0
    const m = frase.match(SUPERLATIVOS)
    if (!m) continue
    if (ESCOPO_TEMPORAL.test(frase)) {
      achados.push({ termo: m[0], frase: frase.slice(0, 110), escopo: 'temporal' })
    } else if (!ESCOPO_LOCAL.test(frase)) {
      achados.push({ termo: m[0], frase: frase.slice(0, 110), escopo: 'ausente' })
    }
  }
  return achados
}

/**
 * Linhas de METADADO do frontmatter, que não são afirmação sobre o mundo.
 * `title: AFOS Daily` não é superlativo, e contá-lo foi um defeito do medidor
 * de 12/Set, o mesmo que a ficha de 09/Set já registrava sobre a contagem de
 * palavras: o frontmatter entrou na conta e inflou o número.
 * ⚠️ `lede` e `tldr` NÃO entram aqui de propósito: são prosa publicada.
 */
export const LINHA_DE_METADADO = /^\s*(date|updatedAt|locale|status|slug|title|author|tags):/
