/**
 * 🧷 QUAL O CAMINHO ATÉ O BACKUP DO DIA, quando a árvore é compartilhada.
 *
 * 🔑 POR QUE EXISTE, medido em 06/Out/2026. O `build-us-2026-dataset.mjs` lê
 * `backup/neon/`, e quem escreve ali é um workflow que CHEGA COMO COMMIT. Então
 * "o backup de hoje chegou?" é "existe commit de hoje tocando backup/neon?".
 *
 * O `estado-da-faixa-us.mjs` já respondia isso em TRÊS estados desde 03/Out:
 * está aqui, está no remoto sem ter sido trazido, ou não existe. E o estado do
 * meio mandava dar `git pull`.
 *
 * 🔴 Em 06/Out o `git pull` era IMPOSSÍVEL. A árvore é compartilhada entre dois
 * terminais e o outro tinha 25 arquivos modificados sem commit; o merge aborta
 * antes de começar quando um caminho que ele precisa escrever está sujo
 * localmente. Medido no dia: 47 caminhos de entrada, 34 sujos aqui, **30
 * colidindo**, e o `git merge` de teste abortou exatamente como a conta previa.
 *
 * ⛔ Medidor que manda fazer o que não se pode fazer é pior que medidor calado:
 * ele gasta a confiança de quem lê e empurra para a gambiarra.
 *
 * ✅ E existe saída que NÃO toca no trabalho alheio: trazer só `backup/neon` do
 * remoto. Ela é segura por uma razão MEDIDA e não por otimismo, e é por isso que
 * esta régua a confere antes de sugerir: se aquele caminho está limpo aqui,
 * trazer a versão do remoto não pode perder trabalho nenhum, por construção. Se
 * estiver sujo, a saída não existe e a resposta é PARAR.
 *
 * 📌 A régua mora aqui, e não no script, porque ela é DECISÃO e não leitura: o
 * script lê o git e passa os dois conjuntos de caminhos; quem decide é esta
 * função, que tem caso plantado.
 */

export const ROTAS = {
  /** O commit de hoje já está aqui. A ETAPA 6.1 pode subir. */
  AQUI: 'AQUI',
  /**
   * O commit de hoje NÃO está aqui, mas o CONTEÚDO de backup/neon na árvore é o
   * do remoto, que tem o commit de hoje. A ETAPA 6.1 pode subir.
   *
   * 🔑 Esta rota existe porque a própria régua tinha um buraco, achado em
   * 06/Out/2026 ao USÁ-LA: ela mede COMMIT e a saída que ela recomenda
   * (`git checkout origin/main -- backup/neon/`) muda o WORKING TREE sem
   * commitar. Depois de seguir o próprio conselho, ela seguia dizendo
   * SO_BACKUP. ⛔ Remédio que não satisfaz o teste do próprio medidor é
   * remédio que ninguém sabe se funcionou. E o que o dataset lê é ARQUIVO.
   */
  AQUI_SEM_COMMIT: 'AQUI_SEM_COMMIT',
  /** Está no remoto e o merge passa: `git pull --no-rebase`. */
  PULL: 'PULL',
  /** Está no remoto, o merge NÃO passa, e `backup/neon` está limpo aqui. */
  SO_BACKUP: 'SO_BACKUP',
  /** Está no remoto, o merge não passa, e `backup/neon` está SUJO. Sem saída segura. */
  PARAR: 'PARAR',
  /** Não existe commit de hoje em lugar nenhum. Esperar. */
  ESPERAR: 'ESPERAR',
  /** Não deu para olhar o histórico. ⛔ NÃO é "em ordem". */
  INDETERMINADO: 'INDETERMINADO',
}

/** O caminho do backup, com a barra, para o prefixo não comer vizinho. */
const RAIZ_BACKUP = 'backup/neon'

/**
 * 🔴 `startsWith('backup/neon')` casaria `backup/neonologia/x`, e a primeira
 * versão desta regra, escrita inline no script, tinha exatamente esse defeito.
 * O que conta é a RAIZ EXATA ou a raiz seguida de barra.
 */
export const ehDoBackup = (caminho) =>
  typeof caminho === 'string' && (caminho === RAIZ_BACKUP || caminho.startsWith(RAIZ_BACKUP + '/'))

/**
 * @param {object} e
 * @param {string|null} e.local    data ISO do último commit de backup/neon em HEAD
 * @param {string|null} e.remoto   idem em origin/main
 * @param {string} e.hoje          data ISO de hoje
 * @param {string[]} e.deEntrada   caminhos que os commits de ENTRADA escrevem
 * @param {string[]} e.sujos       caminhos sujos na árvore local
 * @param {boolean|null} e.arvoreBateComRemoto  backup/neon na árvore é idêntico ao do remoto?
 * @returns {{rota: string, colidem: string[], motivo: string}}
 */
export function rotaDoBackup({ local = null, remoto = null, hoje, deEntrada = [], sujos = [], arvoreBateComRemoto = null } = {}) {
  const vazio = { colidem: [] }
  if (!hoje) return { rota: ROTAS.INDETERMINADO, ...vazio, motivo: 'sem a data de hoje não há pergunta a fazer' }

  // ⛔ O commit AQUI vence qualquer outra consideração, inclusive o remoto estar
  //    à frente: se o backup de hoje está nesta árvore, o dataset lê o de hoje.
  if (local === hoje) return { rota: ROTAS.AQUI, ...vazio, motivo: `commit de ${local} nesta árvore` }

  // ⛔ ANTES de qualquer conversa sobre merge: se a árvore JÁ tem o conteúdo do
  //    remoto em backup/neon e o remoto tem o commit de hoje, o dataset lê o
  //    backup de hoje. A pergunta do dataset é sobre ARQUIVO, não sobre commit.
  if (remoto === hoje && arvoreBateComRemoto === true) {
    return {
      rota: ROTAS.AQUI_SEM_COMMIT,
      ...vazio,
      motivo: 'o commit não está aqui, mas backup/neon na árvore é idêntico ao do remoto, que tem o de hoje',
    }
  }

  if (local === null && remoto === null) {
    return { rota: ROTAS.INDETERMINADO, ...vazio, motivo: 'não deu para olhar o histórico de backup/neon' }
  }

  if (remoto !== hoje) {
    return { rota: ROTAS.ESPERAR, ...vazio, motivo: `não existe commit de hoje · último: ${local ?? 'nenhum'}` }
  }

  // 🔑 A interseção é a pergunta "o merge aborta?", e ela se responde SEM tentar
  //    o merge. ⛔ `deEntrada` tem de ser o que o lado REMOTO escreve desde a
  //    base comum, e nunca a diferença entre as duas pontas: lida assim, um dia
  //    de trabalho meu apareceria como "o merge vai mexer nisso".
  const deEntradaSet = new Set((deEntrada ?? []).filter((p) => typeof p === 'string' && p))
  const sujosLimpos = (sujos ?? []).filter((p) => typeof p === 'string' && p)
  const colidem = [...new Set(sujosLimpos.filter((p) => deEntradaSet.has(p)))].sort()

  if (!colidem.length) {
    return { rota: ROTAS.PULL, colidem, motivo: 'o merge não encosta em caminho sujo' }
  }
  if (sujosLimpos.some(ehDoBackup)) {
    return {
      rota: ROTAS.PARAR,
      colidem,
      motivo: `o merge aborta em ${colidem.length} caminho(s) sujo(s) E backup/neon está sujo: trazer o remoto descartaria alteração local`,
    }
  }
  return {
    rota: ROTAS.SO_BACKUP,
    colidem,
    motivo: `o merge aborta em ${colidem.length} caminho(s) sujo(s), e backup/neon está limpo: trazer só ele é seguro por construção`,
  }
}
