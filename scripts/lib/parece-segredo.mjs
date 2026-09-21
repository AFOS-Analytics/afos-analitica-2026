/**
 * parece-segredo.mjs — separa SEGREDO de NOME PÚBLICO, para a trava que varre o
 * backup antes de ele ir a um repositório PÚBLICO.
 *
 * 🔴 POR QUE ISTO SAIU DE DENTRO DO `check-backup-sem-pii.ts`, em 20/Set/2026:
 *    a heurística é o que decide se o backup do dia vai ao ar, e ela não tinha
 *    UM caso plantado nem rodava no CI. Ela vivia inline num script que só roda
 *    no pre-commit e no workflow, então o único jeito de saber que ela errou
 *    era o backup falhar. Foi exatamente assim que se descobriu que ela errava.
 *
 * ⚠️ O CASO QUE CUSTOU UM DIA DE BACKUP. O workflow de 20/Set reprovou com
 *    `segredo de alta entropia` em duas cadeias que são NOME DE ARQUIVO de
 *    documento público, as duas entradas pela ingestão de rodadas curadas do
 *    mesmo dia:
 *      · MLSPSC35PressRelease_NationalTopics
 *      · August2026NationalPollMidtermCongressToplines
 *    Elas moram dentro da URL de `fontePrimaria` de uma pesquisa, que é o
 *    documento que o próprio instituto publicou e que o painel cita.
 *
 * 🔑 O DEFEITO NÃO ERA A TRAVA SER DURA, ERA ELA SER SURDA A UMA FORMA DE
 *    PALAVRA. A regra já dizia "três palavras ou mais não é segredo", e estava
 *    certa. O que ela não enxergava é que num nome de arquivo as palavras vêm
 *    coladas por MAIÚSCULA, e não por hífen: `PressRelease` é duas palavras
 *    que a separação por `[-_]` lê como uma cadeia só, e sem palavras
 *    reconhecidas sobra "tem dígito e mistura caixa", que é a assinatura de um
 *    token.
 *
 * ⛔ E O CONSERTO NÃO PODE SER SÓ "QUEBRAR TAMBÉM NA MAIÚSCULA". Medido aqui:
 *    um token de verdade como `4eC39HqLyjWDarjtT1zdp7dc` quebrado assim produz
 *    `Hq`, `Lyj`, `zdp`, `dc`, que são quatro cadeias só de letras. Com a
 *    régua antiga de "2 letras ou mais" isso passaria como quatro palavras e
 *    o token sairia liberado. Por isso são DUAS condições, e não uma:
 *      1. três partes de 3+ letras, que já derruba `Hq` e `dc`;
 *      2. COBERTURA: as palavras e os números têm de ocupar 60% da cadeia.
 *         Num nome de arquivo eles ocupam quase tudo; no token acima ocupam
 *         46%, porque o resto é letra solta e fragmento.
 *
 * 📌 A direção do conserto é ACRESCENTAR ESCAPE, nunca afrouxar o que já
 *    barrava: quem passava antes continua passando, e o que muda é só o que
 *    era barrado por engano. Regressão aqui é vazamento em repositório público.
 */

/**
 * Parte a cadeia em pedaços de significado: no hífen e no sublinhado, na
 * fronteira minúscula→MAIÚSCULA, e na fronteira entre letra e dígito.
 */
export function partirEmPedacos(s) {
  return String(s)
    .replace(/[-_]+/g, ' ')
    .replace(/([a-zà-ÿ])([A-ZÀ-Ý])/g, '$1 $2')
    .replace(/([A-Za-zÀ-ÿ])(\d)/g, '$1 $2')
    .replace(/(\d)([A-Za-zÀ-ÿ])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
}

/** Fração mínima da cadeia que palavras e números precisam ocupar. */
export const COBERTURA_MINIMA = 0.7
/** Quantas palavras um nome de documento precisa ter. */
export const PALAVRAS_MINIMAS = 3
/**
 * E pelo menos UMA delas precisa ser longa.
 *
 * 🔴 A TERCEIRA TRANCA, e ela nasceu de um caso plantado que REPROVOU o
 *    conserto antes de ele ir ao ar. `Xq7ZvbT3nkJw9RtLmPasBqoDufCei4HgYnk` e
 *    cadeia aleatoria, e quebrada na maiuscula produz SEIS pedacos com forma de
 *    palavra (Zvb, Pas, Bqo, Duf, Cei, Ynk) cobrindo 63% dela. Ela passava nas
 *    duas primeiras trancas.
 *
 * 🔑 O que separa: cadeia aleatoria troca de caixa a cada dois ou tres
 *    caracteres, entao ela nao produz palavra LONGA. Nome de documento sempre
 *    tem uma: National, Toplines, Presentation, congressional. Medido nos 153
 *    candidatos reais do `analysisReport`, a menor "palavra mais longa" e 7.
 */
export const PALAVRA_LONGA_MINIMA = 6

/**
 * O pedaço tem FORMA de palavra?
 *
 * 🔴 Aqui mora a diferença entre o conserto certo e um ralo. "Três ou mais
 *    cadeias só de letras" NÃO serve: quebrando o token `4eC39HqLyjWDarjtT1zdp7dc`
 *    na maiúscula sobram `Hq`, `Lyj`, `WDarjt` e `dc`, quatro cadeias só de
 *    letras, e o token sairia liberado. `WDarjt` é a que denuncia: palavra de
 *    verdade tem UMA maiúscula na frente, ou nenhuma, ou é sigla inteira em
 *    caixa alta. Maiúscula no MEIO é assinatura de cadeia aleatória.
 */
export function formaDePalavra(p) {
  return (
    /^[A-ZÀ-Ý][a-zà-ÿ]{2,}$/.test(p) ||  // Capitalizada: National, Press
    /^[a-zà-ÿ]{3,}$/.test(p) ||          // minúscula: formatted, toplines
    /^[A-ZÀ-Ý]{2,}$/.test(p)             // sigla: CNBC, NVT, US
  )
}

/**
 * A cadeia se lê como nome de arquivo ou título de documento?
 *
 * ⛔ Não é "contém palavras". É "é FEITA de palavras e números, quase inteira".
 *    A cobertura é a segunda tranca: uma cadeia aleatória pode produzir duas ou
 *    três palavras por acaso, mas não cobre 60% de si mesma com elas, porque o
 *    resto dela é letra solta e fragmento de caixa misturada.
 */
export function pareceNomeDeDocumento(s) {
  const texto = String(s)
  if (!texto) return false
  const pedacos = partirEmPedacos(texto)
  const palavras = pedacos.filter(formaDePalavra)
  if (palavras.length < PALAVRAS_MINIMAS) return false
  if (!palavras.some((p) => p.length >= PALAVRA_LONGA_MINIMA)) return false
  const numeros = pedacos.filter((p) => /^\d+$/.test(p))
  const cobertos = [...palavras, ...numeros].reduce((a, p) => a + p.length, 0)
  return cobertos / texto.length >= COBERTURA_MINIMA
}

/**
 * Separa SEGREDO de SLUG. A primeira versão desta checagem usava só
 * "40 caracteres ou mais" e acusou `brazil-presidential-election-first-round-2nd-place`
 * e nomes de arquivo do IBGE. Guard que acusa slug legítimo é ruído, e ruído
 * ensina a ignorar o alerta, que é justamente o que não pode acontecer aqui.
 *
 * Um segredo real (hex, base64, uuid sem hífen) mistura caixa e dígito e não
 * tem estrutura de palavras. Um slug é uma sequência de palavras minúsculas
 * separadas por hífen ou sublinhado, e um nome de documento é a mesma coisa
 * com as palavras coladas por maiúscula.
 */
export function pareceSegredo(s) {
  const texto = String(s)
  const partes = texto.split(/[-_]/)
  const palavras = partes.filter((p) => /^[a-zà-ÿ]{2,}$/i.test(p))
  if (palavras.length >= 3) return false          // slug: três ou mais palavras
  if (!/\d/.test(texto)) return false             // segredo sem dígito é improvável
  if (pareceNomeDeDocumento(texto)) return false  // nome de arquivo em CamelCase
  const temMaiuscula = /[A-Z]/.test(texto)
  const temMinuscula = /[a-z]/.test(texto)
  return temMaiuscula && temMinuscula             // mistura de caixa
}
