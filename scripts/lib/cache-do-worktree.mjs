/**
 * cache-do-worktree.mjs — o `public/news-cache/` num worktree de origin/main.
 *
 * 🔴 POR QUE EXISTE, medido em 18/Out/2026: a pasta é ignorada pelo git, então
 *    o worktree em que a rodada roda (por regra, para não usar código velho)
 *    nasce SEM os dias anteriores. A cobertura de imprensa mediu sobre 1 dia e
 *    chamou de CEGAS três casas (DataTrends, Datavero, Nexus), quando a régua de
 *    CEGA é "zero item em TODO o cache" e o cache era um dia. E o caminho
 *    inverso também perdia: o cache do dia, coletado no worktree, sumia com ele
 *    na remoção; o de 17/Out só sobreviveu porque outro processo o gerou na
 *    árvore principal.
 *
 * 🔑 As duas direções têm regras diferentes, de propósito:
 *    - TRAZER: só dia que falta aqui. Dia que já existe no worktree é o mais
 *      novo (acabou de ser coletado) e não se sobrescreve com o velho.
 *    - DEVOLVER: o arquivo do worktree vai para a principal quando falta lá ou
 *      quando o daqui é MAIOR. Cache do dia só cresce ao longo do dia; trocar
 *      um maior por um menor perderia manchete.
 *
 * ⛔ Fora de worktree (rodando na própria árvore principal) não faz nada.
 */
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const DIA = /^\d{4}-\d{2}-\d{2}\.json$/

/** Caminho da árvore principal quando o cwd é um worktree ligado; senão null. */
export function arvorePrincipal(cwd = process.cwd()) {
  const git = (args) => spawnSync('git', args, { cwd, encoding: 'utf8' })
  const comum = git(['rev-parse', '--path-format=absolute', '--git-common-dir'])
  const proprio = git(['rev-parse', '--path-format=absolute', '--git-dir'])
  if (comum.status !== 0 || proprio.status !== 0) return null
  const c = resolve(comum.stdout.trim()), p = resolve(proprio.stdout.trim())
  if (c === p) return null
  return dirname(c)
}

/**
 * Decide o que copiar, sem tocar no disco. Entradas: {nome: tamanho} dos dois lados.
 * @returns {{ trazer: string[], devolver: string[] }}
 */
export function planejar(aqui, la, { desde }) {
  const trazer = Object.keys(la).filter((f) => DIA.test(f) && f.slice(0, 10) >= desde && !(f in aqui)).sort()
  const devolver = Object.keys(aqui).filter((f) => DIA.test(f) && (!(f in la) || aqui[f] > la[f])).sort()
  return { trazer, devolver }
}

const tamanhos = (dir) => {
  if (!existsSync(dir)) return {}
  return Object.fromEntries(readdirSync(dir).filter((f) => DIA.test(f)).map((f) => [f, statSync(join(dir, f)).size]))
}

/** Executa uma direção. `direcao` é 'trazer' ou 'devolver'. Devolve a lista copiada, ou null fora de worktree. */
export function sincronizar(direcao, { dias = 14, hoje, cwd = process.cwd() } = {}) {
  const principal = arvorePrincipal(cwd)
  if (!principal) return null
  const aquiDir = join(cwd, 'public/news-cache'), laDir = join(principal, 'public/news-cache')
  const d = new Date(`${hoje}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - dias)
  const plano = planejar(tamanhos(aquiDir), tamanhos(laDir), { desde: d.toISOString().slice(0, 10) })
  const lista = plano[direcao]
  mkdirSync(direcao === 'trazer' ? aquiDir : laDir, { recursive: true })
  for (const f of lista) {
    if (direcao === 'trazer') copyFileSync(join(laDir, f), join(aquiDir, f))
    else copyFileSync(join(aquiDir, f), join(laDir, f))
  }
  return { principal, lista }
}
