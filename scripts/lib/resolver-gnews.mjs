/**
 * resolver-gnews.mjs — a CASA da resolução do invólucro do Google News.
 *
 * 🔑 POR QUE ISTO EXISTE, em 18/Set/2026: a orquestração (buscar o invólucro,
 *    extrair os três atributos, bater no `batchexecute`, pegar a URL do veículo)
 *    morava dentro do `resolver-noticia.mjs`, que não a exporta. Quando o
 *    `ler-materia.mjs` precisou do mesmo caminho, a saída fácil era recopiar as
 *    seis linhas, e seis linhas repetidas são a segunda cópia de uma regra.
 *    O próprio `resolver-noticia.mjs` avisa contra isso no cabeçalho dele.
 *
 * ⛔ As REGRAS continuam em `wayback-archive.ts`, que é onde elas têm casos
 *    plantados (`scripts/testar-resolver-google-news.mjs`). Aqui mora só a
 *    ordem em que elas são chamadas.
 *
 * ⚠️ Importa de um `.ts`, então quem usar este módulo roda com `tsx`, não com
 *    `node` puro.
 */

import {
  UA_NAVEGADOR,
  extrairAtributos,
  extrairUrlDoVeiculo,
  montarPayload,
} from '../wayback-archive.ts'

export { UA_NAVEGADOR }

/**
 * 🔑 Link que NÃO é do Google News já é a URL do veículo e não tem o que
 * resolver. Os feeds âncora (`prestige-*`) do cache guardam a primária direto,
 * e a primeira versão do `resolver-noticia` tratava isso como "❌ não resolveu",
 * que se lê como link sem caminho e é o oposto do que acontece. Medido em
 * 09/Set/2026 com Folha, Gazeta do Povo e Poder360, os três já primários.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function jaEhPrimaria(url) {
  return !/^https?:\/\/(news\.)?google\.com\//i.test(url)
}

/**
 * Do invólucro do Google News para a URL do veículo.
 *
 * @param {string} url
 * @returns {Promise<string|null>} a primária, ou `null` quando o Google não devolveu
 */
export async function resolverGoogleNews(url) {
  if (jaEhPrimaria(url)) return url
  const pagina = await fetch(url, {
    headers: { 'User-Agent': UA_NAVEGADOR },
    signal: AbortSignal.timeout(25000),
  })
  const attrs = extrairAtributos(await pagina.text())
  if (!attrs) return null
  const res = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
    method: 'POST',
    headers: { 'User-Agent': UA_NAVEGADOR, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: 'f.req=' + encodeURIComponent(montarPayload(attrs)),
    signal: AbortSignal.timeout(25000),
  })
  return extrairUrlDoVeiculo(await res.text())
}
