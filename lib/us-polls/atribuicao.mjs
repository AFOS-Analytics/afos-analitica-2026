/**
 * atribuicao.mjs · a única implementação da pergunta que a régua do generic
 * ballot faz antes de qualquer verbo de movimento: **o que mudou foi a intenção
 * de voto ou foi o conjunto?**
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 04/Set/2026. A média foi de D+6.07 para
 * D+5.69, uma queda de 0,38pp, com ZERO pesquisa nova: a John Zogby Strategies,
 * campo 04-05/Ago e D+11.00, saiu pela borda quando o dia UTC virou. O
 * `conferir-us-polls.mjs` já dizia isso, e dizia certo naquele dia.
 *
 * 🕳️ MAS DIZIA POR SORTE, e o ponto cego foi medido no mesmo dia. Ele comparava
 * o CONJUNTO DE NOMES de instituto, `mediaAfos.institutos`, e nome de casa não é
 * rodada. Caso plantado sobre o arquivo real de 04/Set: uma onda NOVA da
 * The Economist/YouGov, campo 28/Ago, entra na média e a leva de D+5.69 a
 * D+5.93. Como a YouGov já estava no conjunto e o campo mais recente do arquivo
 * seguia sendo 31/Ago, a régua antiga imprimia:
 *
 *     entraram (ninguém) · saíram (ninguém) · campo PARADO
 *     ⚠️ ZERO informação nova. Escrever verbo de movimento aqui é falso.
 *
 * Ou seja: no dia em que uma pesquisa DE VERDADE entrou, o portão mandava
 * escrever o contrário. Falso negativo que produz frase falsa, que é a família
 * de defeito que este projeto mais persegue.
 *
 * ✅ O conserto tem duas metades e as duas são necessárias:
 *   1. `collect.mjs` passou a gravar QUAIS rodadas entraram, em
 *      `mediaAfos.incluidas`, e não só quantas. Sem isso a atribuição só se
 *      obtinha reexecutando o coletor, e reexecutar é medir de novo, não
 *      conferir. Regra que depende de um número que ninguém grava não roda.
 *   2. A comparação passou a ser por RODADA, o par instituto + fim de campo.
 *
 * 📌 Uma cópia só, aqui. O `conferir-us-polls.mjs` importa daqui em vez de ter
 * a sua própria versão da regra. Duas cópias convivem sem incidente até o dia em
 * que uma é corrigida e a outra não, que foi o que custou os rótulos de faixa do
 * mercado em 29/Jul.
 */

/**
 * A identidade de uma rodada é o par instituto + fim de campo.
 *
 * ⚠️ NÃO usar só o instituto. A The Economist/YouGov publica toda semana e em
 * 04/Set aparecia QUATRO vezes na mesma janela, com quatro campos diferentes.
 * Foi exatamente esse o defeito do comparador de deltas do Brasil, achado horas
 * antes no mesmo dia: a chave era a pergunta, e a mesma pergunta existe nos três
 * livros.
 */
export const chaveDe = (x) => `${x.instituto}|${x.campoFim}`

/** Uma rodada mudou se o recorte escolhido ou algum dos dois valores mudou. */
export function mudou(a, b) {
  return a.dem !== b.dem || a.rep !== b.rep || (a.amostraTipo ?? null) !== (b.amostraTipo ?? null)
}

export function comparar(antes, depois) {
  const A = new Map((antes ?? []).map((x) => [chaveDe(x), x]))
  const D = new Map((depois ?? []).map((x) => [chaveDe(x), x]))
  const entraram = [...D.values()].filter((x) => !A.has(chaveDe(x)))
  const sairam = [...A.values()].filter((x) => !D.has(chaveDe(x)))
  const mudaram = [...D.values()]
    .filter((x) => A.has(chaveDe(x)) && mudou(A.get(chaveDe(x)), x))
    .map((x) => ({ antes: A.get(chaveDe(x)), depois: x }))
  return { entraram, sairam, mudaram }
}

/** A média que as linhas produzem, para conferir contra a que o arquivo declara. */
export function mediaDe(linhas) {
  if (!linhas || linhas.length === 0) return null
  const m = (k) => Number((linhas.reduce((s, x) => s + x[k], 0) / linhas.length).toFixed(2))
  const dem = m('dem')
  const rep = m('rep')
  return { dem, rep, vantagemDem: Number((dem - rep).toFixed(2)), n: linhas.length }
}

/**
 * 🔑 O veredito.
 *
 * - COMPOSICAO: nada entrou e nada foi corrigido, só saiu gente pela borda da
 *   janela. Escrever "a média caiu" aqui é falso, e é o erro que a régua nomeia.
 * - PESQUISA_NOVA: entrou rodada nova. Aí sim há leitura nova do eleitorado,
 *   ainda que misturada com a rolagem da borda.
 * - CORRECAO: alguma rodada que já estava mudou de valor ou de recorte, ou seja
 *   a origem foi corrigida. Vale investigar antes de narrar.
 * - PARADO: conjunto idêntico e média idêntica.
 * - INCONSISTENTE: conjunto idêntico e a média mexeu. O lugar de olhar é o
 *   coletor, não o mundo.
 */
export function veredito({ entraram, sairam, mudaram }, deltaPp) {
  const rotulos = []
  if (entraram.length) rotulos.push('PESQUISA_NOVA')
  if (mudaram.length) rotulos.push('CORRECAO')
  if (sairam.length && !entraram.length && !mudaram.length) rotulos.push('COMPOSICAO')
  else if (sairam.length) rotulos.push('borda-rolou')
  if (!rotulos.length) rotulos.push(Math.abs(deltaPp ?? 0) > 0.001 ? 'INCONSISTENTE' : 'PARADO')
  return rotulos
}

/**
 * A conta de atribuição fecha? Soma de antes, menos as que saíram, mais as que
 * entraram, mais o efeito das correções, tem de dar a soma de depois.
 *
 * Devolve a lista de inconsistências, vazia quando fecha.
 */
export function conferirSubtracao(antes, depois, d) {
  const soma = (ls, k) => (ls ?? []).reduce((s, x) => s + x[k], 0)
  const problemas = []
  for (const k of ['dem', 'rep']) {
    const previsto =
      soma(antes, k) - soma(d.sairam, k) + soma(d.entraram, k) + d.mudaram.reduce((s, m) => s + m.depois[k] - m.antes[k], 0)
    const real = soma(depois, k)
    if (Math.abs(previsto - real) > 1e-9) problemas.push({ campo: k, previsto, real })
  }
  return problemas
}
