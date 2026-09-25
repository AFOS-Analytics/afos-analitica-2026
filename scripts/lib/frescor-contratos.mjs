/**
 * frescor-contratos.mjs — a régua de VOLUME e PREÇO do portão de frescor
 * passa a saber DE QUAL CONTRATO o número é.
 *
 * 🔴 POR QUE ISTO EXISTE. A régua 3 do `check-frescor-editorial` amarra o valor
 * ao CANDIDATO, que foi a correção certa quando ela comparava volume solto
 * contra o conjunto do quadro. Mas ela para aí, e o mesmo candidato aparece em
 * ATÉ TRÊS contratos com preços e volumes muito diferentes. Ronaldo Caiado, em
 * 04/Set/2026: 0,15% e USD 7,15M no livro de vencedor, 9,50% e USD 114 mil no
 * de 3º lugar do 1º turno.
 *
 * O canônico saía do PRIMEIRO `USD X` do `quadroComparativo[].m`, que é sempre
 * o de vencedor. Consequência dupla, e a segunda é a pior:
 *
 *   1. o livro de 3º lugar acusava FALSO POSITIVO em toda rodada, porque
 *      USD 114 mil é menor que USD 7,15M;
 *   2. 🕳️ e o livro de 3º lugar NUNCA ERA CONFERIDO DE VERDADE, porque estava
 *      sendo comparado contra a linha de base do contrato errado. Um volume
 *      genuinamente velho ali passaria batido pelo mesmo caminho.
 *
 * O item 2 é o que justifica mexer. Trava que acusa sem motivo é trava que
 * alguém aprende a pular, e trava que confere contra a base errada não confere.
 * → memory/reference_portao_de_corte_duro_em_grandeza_ruidosa.md
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 *
 * 🔑 A UNIDADE É A FRASE. A casa escreve um contrato por frase, e o marcador
 * pode vir antes ou depois do número. Frase que nomeia DOIS contratos é
 * ambígua e não se julga: devolve `null` e o chamador pula. Preferir o silêncio
 * ao palpite é o que mantém o portão crível.
 */

/** Ordem não importa aqui: a frase é classificada pelo conjunto do que casa. */
export const MARCADORES = [
  ['terceiro', /3\s*º\s*lugar|terceiro no contrato|3\s*º\s*LUGAR/i],
  ['segundo', /2\s*º\s*lugar|2\s*º\s*LUGAR/i],
  ['vencedor', /contrato de vencedor|no contrato de VENCEDOR|livro de vencedor|livro presidencial/i],
]

/**
 * Quebra em frases. O ponto entre digitos NAO encerra frase.
 *
 * ATENCAO: a primeira versao trocava o separador por um unico caractere e
 * depois devolvia TODOS eles para ponto, o que transformava "9,50%" em "9.50%"
 * e corrompia o texto. Cada separador precisa da PROPRIA sentinela, senao a
 * restauracao adivinha, e adivinhar aqui troca um numero por outro.
 */
const S_PONTO = '\u0001'
const S_VIRG = '\u0002'

export function frasesDe(texto) {
  if (typeof texto !== 'string' || !texto) return []
  const protegido = texto
    .replace(/(\d)\.(\d)/g, `$1${S_PONTO}$2`)
    .replace(/(\d),(\d)/g, `$1${S_VIRG}$2`)
  return protegido
    .split(/(?<=[.!?])\s+|\r?\n/)
    .map((f) => f.split(S_PONTO).join('.').split(S_VIRG).join(',').trim())
    .filter(Boolean)
}

/**
 * O contrato de UMA frase.
 * - exatamente um marcador → a chave dele
 * - nenhum marcador        → `padrao` (o chamador decide, normalmente vencedor)
 * - mais de um             → `null`, que quer dizer "não julgue esta frase"
 */
export function contratoDaFrase(frase, padrao = 'vencedor') {
  const achados = MARCADORES.filter(([, rx]) => rx.test(frase)).map(([k]) => k)
  if (achados.length === 0) return padrao
  if (achados.length === 1) return achados[0]
  return null
}

// ATENCAO: a alternancia e (mil|M) e nao (M|mil). Com /i, o `M` casa o "m" de
// "mil" e USD 114 mil vira a MESMA chave que USD 114M, o que e uma colisao de
// tres ordens de grandeza. Defeito encontrado em 04/Set/2026, e ele existia
// tambem no check-frescor-editorial, corrigido junto.
const PAR = /(\d+,\d+)\s*%[^.!?]{0,40}?USD\s+([\d.,]+)\s*(mil|M)/i

/**
 * Lê o `m` do quadro e devolve a linha de base POR CONTRATO.
 * Uma frase só contribui se for inequívoca e trouxer o par preço + volume.
 */
export function canonPorContrato(m) {
  const mapa = new Map()
  for (const frase of frasesDe(m)) {
    const contrato = contratoDaFrase(frase)
    if (!contrato) continue
    const p = frase.match(PAR)
    if (!p) continue
    if (mapa.has(contrato)) continue // a primeira frase do contrato manda
    mapa.set(contrato, { preco: p[1], vol: `${p[2]}${p[3].toLowerCase()}` })
  }
  return mapa
}

/**
 * O contrato da frase que CONTÉM o trecho [ini, fim) dentro de `bruto`.
 *
 * ⚠️ A janela vai do início da frase até o FIM do trecho, e não só até o começo
 * dele: em "Caiado segue em terceiro no contrato de 3º lugar, com 9,50% (vol
 * USD 114 mil)" o marcador está DEPOIS do nome e ANTES do número, e olhar só
 * para trás perderia metade dos casos.
 */
export function contratoNoPonto(bruto, ini, fim, padrao = 'vencedor') {
  const antes = bruto.slice(0, ini)
  const corte = Math.max(
    antes.lastIndexOf('. '),
    antes.lastIndexOf('! '),
    antes.lastIndexOf('? '),
    antes.lastIndexOf('\n'),
    antes.lastIndexOf('": "')
  )
  const janela = bruto.slice(corte < 0 ? 0 : corte, fim)
  return contratoDaFrase(janela, padrao)
}

/**
 * Valor citado como HISTORICO nao e contradicao, e narrativa de delta.
 * E FAIXA gravada tambem e: "variou de 54,30% a 56,30%" (25/Set/2026) e a
 * forma que a ETAPA 1.8 do /atualizar-brz manda escrever, e o portao a acusava.
 * "subiu de 41,00% para 39,00%" tem duas verdades e so a segunda e de hoje.
 *
 * Espelha a regra que ja vivia dentro do check-frescor-editorial, trazida para
 * ca porque agora DOIS chamadores precisam dela e regra em dois lugares
 * diverge. Exportada para o teste poder plantar caso nela.
 */
export const HISTORICO =
  /\b(era|vinha de|ontem|na leitura de|no fechamento de|confirmada de|confirmado em|em \d{1,2}\/\w{3}|topo da s[ée]rie|piso da s[ée]rie|topo de|piso de|m[áa]xim|m[íi]nim|recorde|desde|contra|vari(?:ou|a) de|faixa (?:do dia|gravada))\b/i

export function ehHistoricoEm(texto, pos) {
  const antes = texto.slice(Math.max(0, pos - 45), pos)
  if (HISTORICO.test(antes)) return true
  // Valor seguido de DATA e referencia a outro dia: "17,90%, de 09/Jun".
  const depois = texto.slice(pos).replace(/^\d+,\d+/, '')
  if (/^%?[,;]?\s*(?:de|em)\s+\d{1,2}\/\w{3}/.test(depois)) return true
  // "de X% para Y%": o X e o valor velho.
  return /\bde\s*$/.test(antes) && /^\s*\d+,\d+%\s+para\s+\d/.test(texto.slice(pos))
}

/**
 * PRECOS AFIRMADOS COMO DE HOJE num texto, por contrato.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 13/Set/2026. O `check:frescor` passou VERDE
 * sobre cinco campos `analise` que traziam precos de 11/Set sob carimbo de
 * 12/Set, com Lula em 48,50% no `header` e 42,50% na `analise`. A regua de
 * preco lia SO o `quadroComparativo`, e a de volume achava o dono pelo NOME no
 * texto, que a `analise` nao repete porque o dono ali e ESTRUTURAL: e a chave
 * do JSON. O comentario de 04/Set ja registrava esse ponto cego com estas
 * palavras, "ler estrutura e outra regua", e esta e a regua.
 *
 * O dono NAO entra aqui: quem sabe de quem e o cartao e o chamador. Esta
 * funcao so responde "que precos este texto afirma como de hoje, e de qual
 * contrato cada um e".
 *
 * ⛔ Preco nesta casa tem SEMPRE duas casas decimais ("55,60%"). Numero de urna
 * vem com uma ("5,2%") ou nenhuma ("39%"). Exigir as duas separa preco de
 * pesquisa sem precisar entender a frase.
 */
export function precosAfirmados(texto, padrao = 'vencedor') {
  const saida = []
  for (const frase of frasesDe(String(texto ?? ''))) {
    const contrato = contratoDaFrase(frase, padrao)
    if (!contrato) continue // frase ambigua nomeia dois livros: nao se julga
    for (const m of frase.matchAll(/(\d+,\d{2})\s*%/g)) {
      const pos = m.index ?? 0
      if (ehHistoricoEm(frase, pos)) continue
      saida.push({ contrato, preco: m[1], frase })
    }
  }
  return saida
}
