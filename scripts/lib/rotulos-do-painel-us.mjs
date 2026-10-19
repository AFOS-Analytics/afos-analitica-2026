/**
 * 🏷️ A QUE cada número da tela do painel dos EUA pertence.
 *
 * ─── O BURACO QUE ELE FECHA ─────────────────────────────────────────────────
 *
 * 🔴 O `conferir-tela.mjs` nasceu em 06/Set/2026 conferindo que o número CHEGA
 *    ao leitor, e a própria ficha dele declarava o limite: *"ele confere NÚMERO,
 *    não etiqueta. Valor certo com rótulo errado passa por aqui, e essa é a
 *    classe de defeito que segue sem portão"*. Ficou assim de 06/Set a 19/Out.
 *
 * ⚠️ E não é hipótese: a ordem dos valores que a rodada monta vem da ORDEM em
 *    que a API devolve as linhas de cada livro. No dia em que ela devolver o
 *    republicano primeiro, o `--esperado` inteiro desloca e o conferidor antigo
 *    daria VERDE, porque os seis números continuariam todos na tela.
 *
 * ─── A RÉGUA, e por que ela NÃO é proximidade ───────────────────────────────
 *
 * 📏 A primeira tentativa foi "o valor aparece a menos de N caracteres do
 *    rótulo", e a MEDIÇÃO a matou. Na tela de 19/Out/2026:
 *      · o valor certo está a 1 char do rótulo nos quatro preços de controle
 *      · o `no-prazo` legítimo está a 25 chars
 *      · e o valor REPUBLICANO está a 21 chars do rótulo "Democratas"
 *    Ou seja, 25 tem de passar e 21 tem de reprovar: nenhuma janela separa os
 *    dois, e uma janela de 60 chars deixaria passar a troca entre os dois lados
 *    do MESMO cartão, que é justamente o defeito a pegar.
 *
 * ✅ A régua é **o valor é o PRIMEIRO número depois do rótulo**, que é como um
 *    humano lê um par rótulo-valor. Medida nos 18 casos (6 valores × 3 idiomas)
 *    da tela de 19/Out: acerta nos 18, sem nenhuma constante arbitrária.
 *
 * ─── POR QUE OS RÓTULOS ESTÃO AQUI, e não importados do componente ──────────
 *
 * ⛔ Isto É uma segunda cópia dos rótulos, que vivem no `const T` de
 *    `app/components/UsMarketSection.tsx` e `UsPollsSection.tsx`. O `T` não é
 *    exportado, e importar um componente React dentro de um script de linha
 *    arrastaria JSX e o resto da árvore do Next.
 *
 * 🔑 A cópia é aceitável AQUI por uma razão só, e ela é a diferença que a régua
 *    de `feedback_duas_copias_da_mesma_regra` cobra: **esta cópia não pode
 *    envelhecer em silêncio**. Toda âncora é procurada na tela VIVA em cada
 *    passada, e âncora que não é encontrada REPROVA o idioma, nomeando-a. Uma
 *    tradução editada derruba o portão na primeira execução, em vez de deixá-lo
 *    verde sobre um rótulo que ninguém mais usa. O que a régua proíbe é a cópia
 *    que divergem CALADAS, e esta grita.
 *
 * 📌 E ela é deliberadamente pequena: só os rótulos dos SEIS números que o
 *    painel publica, nunca o dicionário inteiro.
 *
 * ─── A ORDEM É CONTRATO ─────────────────────────────────────────────────────
 *
 * 🔴 `CONTRATOS` está na MESMA ordem em que `scripts/rodada-us.mjs` monta o
 *    `--esperado`: os dois preços de `house`, os dois de `senate`, o de
 *    `asScheduled` e a média servida do generic ballot. Trocar a ordem aqui sem
 *    trocar lá faz o portão conferir o par errado, então o conferidor exige que
 *    a CONTAGEM bata e recusa quando não bate.
 */

/**
 * @type {{chave: string, descricao: string, ancoras: Record<string,string[]>}[]}
 */
export const CONTRATOS = [
  {
    chave: 'camara-dem',
    descricao: 'probabilidade de os DEMOCRATAS controlarem a CÂMARA',
    // 🧬 "Democratas" e "Republicanos" NÃO são tradução: vêm do nome do desfecho
    //    como o banco o guarda, e por isso saem em português nos três idiomas.
    //    Isso é achado sobre a TELA e está fichado à parte; aqui é só o fato.
    ancoras: {
      'pt-BR': ['Câmara ↗', 'Democratas'],
      en: ['House ↗', 'Democratas'],
      es: ['Cámara ↗', 'Democratas'],
    },
  },
  {
    chave: 'camara-rep',
    descricao: 'probabilidade de os REPUBLICANOS controlarem a CÂMARA',
    ancoras: {
      'pt-BR': ['Câmara ↗', 'Republicanos'],
      en: ['House ↗', 'Republicanos'],
      es: ['Cámara ↗', 'Republicanos'],
    },
  },
  {
    chave: 'senado-dem',
    descricao: 'probabilidade de os DEMOCRATAS controlarem o SENADO',
    ancoras: {
      'pt-BR': ['Senado ↗', 'Democratas'],
      en: ['Senate ↗', 'Democratas'],
      es: ['Senado ↗', 'Democratas'],
    },
  },
  {
    chave: 'senado-rep',
    descricao: 'probabilidade de os REPUBLICANOS controlarem o SENADO',
    ancoras: {
      'pt-BR': ['Senado ↗', 'Republicanos'],
      en: ['Senate ↗', 'Republicanos'],
      es: ['Senado ↗', 'Republicanos'],
    },
  },
  {
    chave: 'no-prazo',
    descricao: 'probabilidade de a eleição acontecer na data prevista',
    ancoras: {
      'pt-BR': ['A eleição acontece na data prevista ↗'],
      en: ['The election happens as scheduled ↗'],
      es: ['La elección ocurre en la fecha prevista ↗'],
    },
  },
  {
    chave: 'generic-ballot',
    descricao: 'vantagem democrata servida no generic ballot',
    ancoras: {
      'pt-BR': ['Vantagem democrata'],
      en: ['Democratic margin'],
      es: ['Ventaja demócrata'],
    },
  },
]

export const IDIOMAS = ['pt-BR', 'en', 'es']

/**
 * 🔎 A carga se confere, no mesmo padrão dos registros irmãos.
 *
 * ⛔ Entrada sem âncora para um idioma é pior que entrada ausente: o conferidor
 * passaria a não ter o que procurar naquele idioma e o valor ficaria sem par.
 */
export function conferirRegistro(registro = CONTRATOS) {
  const problemas = []
  const vistas = new Set()
  for (const c of registro ?? []) {
    const quem = c?.chave ?? '(sem chave)'
    if (!c?.chave) problemas.push('entrada sem `chave`')
    else if (vistas.has(c.chave)) problemas.push(`${quem}: chave repetida`)
    else vistas.add(c.chave)
    if (!c?.descricao) problemas.push(`${quem}: sem \`descricao\`, e número sem etiqueta é o defeito que este registro existe para pegar`)
    for (const loc of IDIOMAS) {
      const a = c?.ancoras?.[loc]
      if (!Array.isArray(a) || !a.length) problemas.push(`${quem}: sem âncora para ${loc}`)
      else if (a.some((x) => typeof x !== 'string' || !x.trim())) problemas.push(`${quem}: âncora vazia em ${loc}`)
    }
  }
  return problemas
}
