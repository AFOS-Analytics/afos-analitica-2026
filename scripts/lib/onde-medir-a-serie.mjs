/**
 * 📍 EM QUAL ÁRVORE A SÉRIE SE MEDE, e a resposta não é "nesta".
 *
 * 🔴 POR QUE EXISTE, medido em 13/Out/2026. A ETAPA 4 do `/atualizar-usa` lê o
 * `backup/neon` da árvore em que ela roda, e NADA confere se aquela é a árvore
 * com o backup mais novo. Medido na passada do dia: a árvore principal tinha o
 * backup de 09/Out e a destacada tinha o de 12/Out, TRÊS dias de diferença, e a
 * ETAPA 4 rodou na principal sem uma palavra sobre isso.
 *
 * 🕳️ E o portão que existe diagnostica ERRADO este caso, o que é pior do que não
 * diagnosticar. O `serie-contrato.mjs` mede a cauda cega e, acima de
 * `CAUDA_CEGA_ESPERADA_H`, manda "Regerar o backup antes de escrever isto".
 * Aqui o backup NÃO falhou e não há nada a regerar: ele está pronto, commitado,
 * a um diretório de distância. Regerar seria trabalho para nada, e, pior, a
 * frase faz o leitor concluir que a coleta está quebrada quando ela está boa.
 *
 * 🔑 A DISTINÇÃO que este módulo acrescenta, e que a cauda cega não alcança por
 * construção: ela mede QUANTO a série está curta, e não SE existe lugar onde ela
 * está inteira. São perguntas diferentes e pedem ações opostas, regerar contra
 * mudar de árvore. Medida de tamanho não decide ação.
 *
 * ⛔ Ele NÃO mede série, não lê preço, não pronuncia superlativo e não copia
 * arquivo. Responde ONDE medir, e só.
 *
 * 📌 A data de cada árvore é a do COMMIT que tocou `backup/neon`, nunca o mtime
 * nem o relógio: "quem decide é o COMMIT, nunca o relógio" é a régua da ETAPA
 * 6.1, e esta é a mesma pergunta.
 */

import { execFileSync } from 'node:child_process'

/** Os quatro estados. `INDETERMINADO` não é "em ordem". */
export const ONDE = {
  AQUI: 'AQUI',
  OUTRA_ARVORE: 'OUTRA_ARVORE',
  SO_NO_REMOTO: 'SO_NO_REMOTO',
  INDETERMINADO: 'INDETERMINADO',
}

/**
 * 📅 A FORMA da data é conferida, e data torta conta como AUSENTE e não como
 * antiga. Régua emprestada do arquivo de imprensa: pasta indexada por data se
 * filtra pela FORMA da data. `git log` devolve string vazia quando o caminho
 * nunca foi tocado, e "(nenhuma)" é o que o chamador antigo imprimia: as duas
 * têm de cair no mesmo lugar, que é ausência.
 */
/** A FORMA aceita, nomeada para o arnes de mutacao poder ancorar nela sem barra invertida. */
export const FORMA_ISO = /^\d{4}-\d{2}-\d{2}$/

export function diaValido(d) {
  return typeof d === 'string' && FORMA_ISO.test(d)
}

/**
 * Decide onde medir.
 *
 * @param {{caminho:string, dia:string|null}} aqui      a árvore que está rodando
 * @param {Array<{caminho:string, dia:string|null}>} arvores  as OUTRAS árvores
 * @param {string|null} remoto  o dia do backup em origin/main
 *
 * ⚠️ EMPATE RESOLVE A FAVOR DE AQUI, de propósito: mandar trocar de árvore para
 * ver o mesmo backup é custo sem ganho, e conselho que não paga é conselho que
 * se aprende a ignorar.
 */
export function decidir({ aqui, arvores = [], remoto = null } = {}) {
  const limpa = (e) => ({ caminho: String(e?.caminho ?? '?'), dia: diaValido(e?.dia) ? e.dia : null })
  const eu = limpa(aqui ?? {})
  const outras = (Array.isArray(arvores) ? arvores : []).map(limpa).filter((e) => e.caminho !== eu.caminho)
  const rem = diaValido(remoto) ? remoto : null

  // a melhor das OUTRAS árvores, que é a única alternativa sem custo de rede
  const melhorOutra = outras
    .filter((e) => e.dia)
    .sort((a, b) => (a.dia < b.dia ? 1 : a.dia > b.dia ? -1 : 0))[0] ?? null

  const candidatos = [eu.dia, melhorOutra?.dia ?? null, rem].filter(Boolean)
  if (candidatos.length === 0) {
    return {
      onde: ONDE.INDETERMINADO,
      diaAqui: null,
      diaMelhor: null,
      caminho: eu.caminho,
      // 🔑 a ação aqui NÃO é "regerar": é não pronunciar. Ausência de data em
      // toda parte quer dizer que eu não sei o tamanho da série, e superlativo
      // sobre série de tamanho desconhecido é afirmação sem lastro.
      acao: 'não pronunciar RECORDE nem PISO: nenhuma árvore declara dia de backup, então o tamanho da série é desconhecido',
      atrasoDias: null,
    }
  }
  const melhor = candidatos.sort().at(-1)
  const atraso = eu.dia ? diferencaEmDias(eu.dia, melhor) : null

  if (eu.dia === melhor) {
    return {
      onde: ONDE.AQUI,
      diaAqui: eu.dia,
      diaMelhor: melhor,
      caminho: eu.caminho,
      acao: 'medir aqui: nenhuma árvore e nem o remoto têm backup mais novo',
      atrasoDias: 0,
    }
  }
  if (melhorOutra && melhorOutra.dia === melhor) {
    return {
      onde: ONDE.OUTRA_ARVORE,
      diaAqui: eu.dia,
      diaMelhor: melhor,
      caminho: melhorOutra.caminho,
      // ⛔ a frase diz "medir LÁ", nunca "regerar": o dado existe e está commitado
      acao: `medir em ${melhorOutra.caminho}, que tem o backup de ${melhor}. ⛔ NÃO é caso de regerar backup: ele existe e está commitado`,
      atrasoDias: atraso,
    }
  }
  return {
    onde: ONDE.SO_NO_REMOTO,
    diaAqui: eu.dia,
    diaMelhor: melhor,
    caminho: null,
    // ⚠️ e a ação NÃO é `git pull`: na árvore compartilhada ele ABORTA por causa
    // do trabalho não commitado da outra faixa, que é a razão de a árvore
    // destacada existir.
    acao: `o backup de ${melhor} está só no remoto: criar a árvore destacada com \`node scripts/arvore-completa.mjs\` e medir lá. ⛔ \`git pull\` na árvore compartilhada aborta`,
    atrasoDias: atraso,
  }
}

/** Diferença em dias entre dois dias ISO, pelo UTC, sem fuso no meio. */
export function diferencaEmDias(de, ate) {
  if (!diaValido(de) || !diaValido(ate)) return null
  return Math.round((Date.parse(`${ate}T00:00:00Z`) - Date.parse(`${de}T00:00:00Z`)) / 86400000)
}

/** A linha para imprimir, já com o ícone que corresponde ao estado. */
export function linhaDoVeredito(v) {
  const icone = { AQUI: '✅', OUTRA_ARVORE: '⭐', SO_NO_REMOTO: '🔴', INDETERMINADO: '⚠️' }[v.onde] ?? '·'
  const atraso = Number.isFinite(v.atrasoDias) && v.atrasoDias > 0 ? ` · esta árvore está ${v.atrasoDias} dia(s) atrás` : ''
  return `${icone} onde medir a série: ${v.onde}${atraso}\n     ${v.acao}`
}

/**
 * 🌳 COLETA as datas, e o executor de git é INJETÁVEL de propósito: assim o
 * teste exercita a regra sem sair ao disco, e o chamador não precisa reescrever
 * a coleta, que é como a segunda cópia de uma regra nasce.
 *
 * 📌 A data é a do COMMIT que tocou `backup/neon` no HEAD daquela árvore, que é
 * a mesma medida que o `arvore-completa.mjs` usa desde 09/Out. Nunca mtime: o
 * OneDrive reescreve mtime ao reidratar arquivo, e aí a medida mentiria.
 */
export function coletar({ cwd = process.cwd(), git = gitPadrao } = {}) {
  const dia = (dir, ref = '') =>
    git(['log', '-1', '--format=%ad', '--date=short', ...(ref ? [ref] : []), '--', 'backup/neon'], dir)

  const arvores = []
  const porcelain = git(['worktree', 'list', '--porcelain'], cwd) ?? ''
  for (const linha of String(porcelain).split('\n')) {
    if (!linha.startsWith('worktree ')) continue
    const caminho = linha.slice('worktree '.length).trim()
    if (!caminho) continue
    arvores.push({ caminho, dia: dia(caminho) })
  }
  return {
    aqui: { caminho: cwd, dia: dia(cwd) },
    arvores,
    // ⚠️ sem `fetch` aqui: coletar não vai à rede. Quem quer o remoto fresco
    // dá o fetch antes, e é o que o chamador faz. Medir contra um `origin/main`
    // velho só pode SUBESTIMAR o que existe, nunca inventar backup que não há.
    remoto: dia(cwd, 'origin/main'),
  }
}

function gitPadrao(args, dir) {
  try {
    return String(execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })).trim()
  } catch {
    return null
  }
}
