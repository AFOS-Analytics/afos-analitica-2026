/**
 * De QUEM é este arquivo modificado: da faixa dos EUA ou não.
 *
 * ─── A PERGUNTA QUE ESTE ARQUIVO RESPONDE ───────────────────────────────────
 *
 * Duas pessoas trabalham na MESMA árvore, uma na faixa do Brasil e uma na dos
 * EUA, e o `vercel --prod` publica o **diretório inteiro**. Então antes de
 * publicar é preciso saber se a árvore tem trabalho que não é meu.
 *
 * ─── POR QUE ELE INVERTE O SENTIDO DA REGRA, medido em 04/Out/2026 ──────────
 *
 * 🔴 O `estado-da-faixa-us.mjs` classificava por uma lista do que é da OUTRA
 * faixa (`/tse|brz|analysis-|afos-daily|wayback|.../`) e tudo que não casava
 * virava MEU. Isso erra na direção permissiva: artefato novo que ninguém
 * previu é reivindicado como meu em silêncio.
 *
 * **Medido no dia:** o terminal do Brasil tinha SETE arquivos em `hf-assets/`
 * e CINCO saíram rotulados como EUA, porque só `tse-registry.csv` e
 * `tse-registry.json` continham uma das palavras da lista:
 *
 *     EUA          hf-assets/data/poll-divergence.csv
 *     EUA          hf-assets/polls/national-poll-results-firstround.csv
 *     EUA          hf-assets/polls/national-polls.json
 *     outra faixa  hf-assets/polls/tse-registry.csv
 *
 * ⚠️ E o aviso de "árvore tem arquivo de outra faixa" disparou **por
 * acidente**: ele só existiu porque DOIS dos sete casaram. Se o Brasil tivesse
 * tocado apenas nos outros cinco, o medidor teria dito que a árvore era toda
 * minha, que é exatamente a frase que libera uma publicação errada.
 *
 * 🔑 Aqui a lista é do que é MEU, e o que não casa sai como `FORA`. A direção
 * de erro passa a ser um aviso a mais, e não uma publicação indevida.
 *
 * 📌 `FORA` não afirma de quem o arquivo é: ele pode ser da outra faixa ou
 * compartilhado (README, `package.json`, um script que os dois países usam).
 * Para a pergunta "posso publicar daqui?" os dois casos pedem a mesma cautela,
 * e inventar uma terceira categoria seria afirmar autoria que não se mede.
 *
 * Ver memory/feedback_deploy_arvore_compartilhada_entre_terminais.md
 */

export const FAIXA_EUA = 'EUA'
export const FORA = 'FORA'

/**
 * Os caminhos que são, sem ambiguidade, da faixa dos EUA.
 *
 * ⛔ Nada de `us` solto: `us` casa dentro de palavras comuns, e a lista existe
 * para ser estreita. Cada padrão ancora no começo do caminho.
 */
const PADROES_EUA = [
  /^public\/us-polls-data\.json$/,
  /^public\/us-press-data\.json$/,
  /^public\/us-press-archive\//,
  /^public\/afos-weekly\/us\//,
  /^public\/afos-tradeoff\/us\//,
  /^lib\/us-polls\//,
  /^lib\/us-press\//,
  /^lib\/us-market\//,
  /^lib\/dashboard\/us-/,
  /^app\/api\/cron\/refresh-us-/,
  /^app\/\[locale\]\/dashboard\/us\//,
  /^scripts\/[^/]*\bus(a|2026)?\b/,
  /^scripts\/[^/]*-us-/,
  /^\.claude\/commands\/[^/]*usa[^/]*\.md$/,
]

/**
 * O CAMINHO dentro de uma linha de `git status --porcelain`.
 *
 * 🔑 Ela vem como `XY caminho`, com dois caracteres de estado e um espaço, e
 * renomeação vem como `R  antigo -> novo`. Quem decide o que vai no commit é o
 * DESTINO, então é ele que importa.
 *
 * ⚠️ Caminho com espaço ou acento vem entre aspas no porcelain, e as aspas não
 * fazem parte do caminho.
 */
export function caminhoDoStatus(linha) {
  if (typeof linha !== 'string') return null
  const s = linha.replace(/\r?\n$/, '')
  if (s.length < 4) return null
  let resto = s.slice(3)
  const seta = resto.indexOf(' -> ')
  if (seta >= 0) resto = resto.slice(seta + 4)
  resto = resto.trim()
  if (resto.startsWith('"') && resto.endsWith('"') && resto.length >= 2) resto = resto.slice(1, -1)
  return resto || null
}

/** `EUA` se o caminho casa a faixa declarada, `FORA` em qualquer outro caso. */
export function faixaDoCaminho(caminho) {
  if (typeof caminho !== 'string' || !caminho) return FORA
  const limpo = caminho.replace(/^\.\//, '')
  return PADROES_EUA.some((p) => p.test(limpo)) ? FAIXA_EUA : FORA
}

/** A faixa de uma linha de `git status --porcelain`. Linha ilegível sai FORA. */
export function faixaDaLinha(linha) {
  return faixaDoCaminho(caminhoDoStatus(linha))
}
