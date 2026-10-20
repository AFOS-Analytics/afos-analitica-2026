/**
 * 🎯 O DONO ÚNICO da folga entre duas leituras do MESMO preço.
 *
 * Criado em 20/Out/2026, e o motivo é um defeito de FORMA, não de valor: a
 * cadeia do `/atualizar-usa` tinha DUAS tolerâncias para a mesma grandeza, e a
 * mais apertada era a ÚLTIMA.
 *
 * 🔴 O caso. A trava de captura (ETAPA 1.7) declara 0.20pp e, dentro disso,
 *    chama duas leituras de **um preço**: foi ela que certificou o contrato de
 *    calendário em 98.85 às 22:45:16Z. O conferidor de tela (ETAPA 5) comparava
 *    `achado !== esperado`, byte a byte, e às 23:02 a tela trazia 98.80, com a
 *    rota tendo buscado AO VIVO (`idade 0.0 min`). Reprovou nos três idiomas.
 *
 * ⚠️ **Nada estava errado.** O livro oscilou 0.05pp entre as duas horas, que é
 *    um quarto da folga que o passo ANTERIOR da mesma cadeia já declarou ser o
 *    mesmo preço. Portão que reprova coisa certa gasta o crédito do portão, e
 *    essa régua já está registrada na casa.
 *
 * 🔑 **Por que a folga não se calibra na SÉRIE.** A primeira tentativa foi medir
 *    o passo do livro no backup, e ela é cega duas vezes:
 *
 *      | | medido em 20/Out |
 *      |---|---|
 *      | intervalo entre capturas | **270 min**, não os 30 que se supõe |
 *      | passos com até 35 min | 22 de 357, e **todos 0.00pp** |
 *      | resolução do valor gravado | **0.10pp** (`99.1`, `99.0`, `98.9`) |
 *
 *    Ou seja: a série não consegue nem REPRESENTAR o 98.85, e a janela que ela
 *    enxerga é de horas. Perguntar a ela o que acontece em 15 minutos devolve
 *    `0.00pp` com 22 pontos de amostra, o que se lê como "o livro não oscila" e
 *    é quantização. É a mesma armadilha do limiar da cauda de 18/Out, que
 *    supunha grade de 30 min contra uma grade medida de 4,5h.
 *
 * ✅ Então a folga não é número novo: é **a que a cadeia já declarou**, agora com
 *    um dono só. Mudar aqui muda nos dois portões, que é o ponto.
 *
 * ⛔ E ela NÃO vale onde a posição é livre. Ver `dentroDaFolga`.
 */

/**
 * Divergência tolerada entre duas leituras do mesmo preço, em pontos percentuais.
 *
 * 📌 Era `const` local do `capture-guard.ts` desde 10/Ago/2026. O valor não
 * mudou; o que mudou é que agora há um dono.
 */
export const TOLERANCIA_PP = 0.20

/**
 * Lê o número como AQUELE idioma o escreve, e devolve `null` se não for número.
 *
 * ⛔ Guarda de FORMA e não de valor: `Number('')` é 0 e `Number(null)` é 0, os
 * dois finitos, então testar só `Number.isFinite` aceitaria string vazia como
 * zero e compararia 0.00 contra 98.85 como se fosse leitura.
 */
export function comoNumero(texto, locale) {
  const s = String(texto ?? '').trim()
  if (!s) return null
  // pt-BR e ES escrevem `91,50`; EN escreve `91.50`. O separador de MILHAR não
  // aparece nos 5 preços (todos < 100), então não há o que remover aqui.
  const n = Number(locale === 'en' ? s.replace(/,/g, '') : s.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

/**
 * 🎯 As duas leituras são o MESMO preço?
 *
 * ⛔ **Só use isto onde a POSIÇÃO do número é fixada.** Esta é a trava que
 *    importa, e ela é de desenho, não de gosto:
 *
 *    - **sob um rótulo**, a posição está presa e a folga é segura: o único
 *      número que pode casar é aquele, e a folga só perdoa a oscilação do livro.
 *    - **em texto livre**, a folga é PERIGOSA: o painel tem dezenas de números,
 *      e "existe algum número a 0.20pp disto em algum lugar da tela" passa por
 *      acaso. Ali a comparação continua EXATA.
 *
 * 🧪 A mutação que prova isso está em `testar-conferir-tela.mjs`: afrouxar a
 *    busca em texto livre faz a tela aceitar o valor do vizinho.
 *
 * @returns {{ok: boolean, exato: boolean, driftPp: number|null}}
 */
export function dentroDaFolga(achado, esperado, locale, tolerancia = TOLERANCIA_PP) {
  const a = comoNumero(achado, locale)
  const e = comoNumero(esperado, locale)
  if (a === null || e === null) return { ok: false, exato: false, driftPp: null }
  const drift = Math.abs(a - e)
  // 🔑 O exato se decide pelo TEXTO e não pelo número: `91,50` e `91.50` são o
  //    mesmo valor e separador ERRADO para o idioma, e isso tem de aparecer.
  const exato = String(achado).trim() === String(esperado).trim()
  return { ok: drift <= tolerancia + 1e-9, exato, driftPp: drift }
}
