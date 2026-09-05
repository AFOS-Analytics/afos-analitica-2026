/**
 * serie-contrato.mjs — as contas puras da checagem de superlativo, feitas sobre
 * a série GRAVADA e não sobre a API.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 04/Set/2026 na rodada do `/atualizar-usa`.
 * A ETAPA 4 do comando é a única etapa MANUAL da passada e manda consultar a
 * rota `/api/market/history` com o filtro de slug. O filtro funciona nos EUA,
 * porque `which-party-will-win-the-house` e `-senate` são irmãos e nenhum é
 * prefixo do outro. O que não funciona é a JANELA:
 *
 *   | série  | API com days=90 | backup   |
 *   |--------|-----------------|----------|
 *   | Câmara | começa 29/Jul   | 29/Jul   |
 *   | Senado | começa 08/Jun   | 14/Abr   |
 *
 * 🕳️ O `days` da rota trava em 90, e ela devolve `truncated: false`, porque esse
 * campo fala do teto de 1.000 PONTOS e não da janela. Ou seja: a resposta diz
 * "não truncado" enquanto esconde 55 dias.
 *
 * ⚠️ E é na parte escondida que moram os extremos. O topo democrata do Senado é
 * 57,50% em 16/Abr; dentro da janela da API o topo aparente é 52,50%. Escrever
 * "perto do topo da série" com o valor de hoje, 51,50%, erraria por 5pp na
 * distância, com a frase soando plausível. Superlativo falso não dá erro.
 *
 * ✅ Por isso a régua da casa é a mesma dos dois países: superlativo se confere
 * no `backup/neon/marketPrice`, não na API.
 * → memory/feedback_superlativo_se_confere_no_backup_nao_na_api.md
 * → memory/reference_market_history_cap_90_dias.md
 *
 * 🕳️ E o backup tem a CAUDA CEGA: ele roda 1x/dia e a série grava a cada 30min,
 * então as últimas horas não estão nele. Quem fecha esse vão é a leitura
 * certificada pela trava de captura, que entra aqui como ponto de AGORA.
 * → memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 */

/**
 * 🔴 A JUNÇÃO que quase passou calada, medida em 04/Set/2026.
 *
 * A trava de captura grava o preço chaveado pela PERGUNTA do mercado, com o
 * grupo na frente:
 *
 *   house:the Democratic Party control the House after the 2026 Midterm elections = 87.5
 *
 * O backup chaveia pelo DESFECHO, que é outra coisa:
 *
 *   which-party-will-win-the-house-in-2026 | Democratas
 *
 * A primeira versão deste script procurava a chave da captura pelo nome do
 * desfecho. Nos EUA nada casava, e como o código caía para o último ponto
 * GRAVADO, a saída ficava plausível: ela dizia 88,50 quando o preço de agora era
 * 87,50, e não dava erro nenhum. Isso é a cauda cega de 24h passando por
 * conferida. No Brasil o mesmo código funciona por acidente, porque lá a chave é
 * o nome do candidato nos dois lados.
 *
 * ✅ Por isso o mapa é DECLARADO, e chave de captura que não acha casa é
 * reportada em voz alta em vez de sumir.
 */
export const MAPA_CAPTURA = {
  us: [
    { grupo: 'house', re: /Democratic/i, slug: 'which-party-will-win-the-house-in-2026', outcome: 'Democratas' },
    { grupo: 'house', re: /Republican/i, slug: 'which-party-will-win-the-house-in-2026', outcome: 'Republicanos' },
    { grupo: 'senate', re: /Democratic/i, slug: 'which-party-will-win-the-senate-in-2026', outcome: 'Democratas' },
    { grupo: 'senate', re: /Republican/i, slug: 'which-party-will-win-the-senate-in-2026', outcome: 'Republicanos' },
    { grupo: 'asScheduled', re: /./, slug: 'will-the-2026-midterm-elections-happen-as-scheduled', outcome: 'Acontece no prazo' },
  ],
  // No Brasil a chave da captura já é o nome do desfecho, então não há mapa: a
  // junção é pelo próprio nome e o `slug` vem do grupo do livro.
  br: null,
}

/**
 * Traduz as chaves da trava de captura para `slug␟outcome`, que é a chave da
 * série. Devolve também as chaves que NÃO acharam casa, que é o que precisa
 * aparecer na tela.
 */
export function casarCaptura(precosDaCaptura, pais) {
  const casadas = new Map()
  const orfas = []
  const mapa = MAPA_CAPTURA[pais]
  for (const [chave, valor] of Object.entries(precosDaCaptura ?? {})) {
    const i = chave.indexOf(':')
    const grupo = i >= 0 ? chave.slice(0, i) : ''
    const resto = i >= 0 ? chave.slice(i + 1) : chave
    if (!mapa) {
      // Brasil: a junção é pelo nome do desfecho, sem tradução.
      casadas.set(resto, valor)
      continue
    }
    const r = mapa.find((x) => x.grupo === grupo && x.re.test(resto))
    if (r) casadas.set(`${r.slug}␟${r.outcome}`, valor)
    else orfas.push(chave)
  }
  return { casadas, orfas }
}

/**
 * 🕳️ A IDADE da leitura certificada, porque "agora" com 21 horas não é agora.
 *
 * Medido em 04/Set/2026, minutos depois de consertar a junção acima: com o mapa
 * funcionando, o script passou a usar o `ultima-us.json` e a chamá-lo de agora.
 * O arquivo era da véspera, 05:11 UTC, e trazia a Câmara democrata em 89,50. O
 * preço ao vivo naquele instante era 87,50. O veredito saiu "0,00pp do topo",
 * que se lê como o mercado no ponto mais alto da série, e ele estava 2pp abaixo.
 *
 * 🔑 Consertar a junção não bastou: um valor que casa e está velho é PIOR que um
 * que não casa, porque o não-casado ao menos aparecia como buraco.
 */
export function idadeEmHoras(carimbo, agora = new Date()) {
  if (!carimbo) return null
  const t = Date.parse(carimbo)
  if (!Number.isFinite(t)) return null
  return (agora.getTime() - t) / 3600000
}

/**
 * 🔴 O INSTANTE CONTAMINADO, achado em 04/Set/2026 ao rodar isto no Brasil.
 *
 * A ferramenta anunciou que o topo da série do contrato do STF era 50,00, de
 * 28/Abr, contra uma faixa real de 2,10 a 19,30. E que o Aldo Rebelo, hoje em
 * 0,10%, já valera 50,00. Nenhum dos dois é preço.
 *
 * 📏 O que a medição mostrou, sobre os 971 instantes com 20 pontos ou mais:
 *
 *   fração de pontos entre 49% e 51%, por instante
 *   mediana  0,0%   ·   p90  4,2%   ·   p99  8,7%
 *
 * E em 28/Abr, três instantes fora de qualquer escala:
 *
 *   11:45:34   67 de  73   91,8%
 *   12:10:33   30 de  30  100,0%
 *   12:50:34   18 de  64   28,1%
 *
 * Nesses instantes o coletor gravou ~50 para livros sem relação nenhuma entre
 * si: Aldo Rebelo, o STF, Colômbia, Rússia, primária do Texas, eleição
 * suplementar australiana, e os DOIS lados do Senado americano ao mesmo tempo.
 * Book real não faz isso. É valor de recuo de quem não conseguiu ler o preço.
 *
 * ⚠️ A primeira hipótese que testei era mais frouxa e teria dado falso positivo
 * em massa: "mesmo preço em 3 livros diferentes no mesmo segundo" acontece 379
 * vezes no backup, quase toda em valores baixos, porque azarão se aglomera em
 * 1%. O que separa o joio é a concentração perto de 50, não a coincidência.
 *
 * ⛔ Isto NÃO reescreve o backup e não retroage nada. É filtro de LEITURA, e só
 * do conferidor de superlativo, que é o único consumidor que olha extremo. O que
 * fazer com o histórico contaminado é decisão do André.
 *
 * 📌 O corte em 20% fica entre a maior legítima observada, 12,5%, e a menor
 * contaminada, 28,1%, e é 2,3 vezes o p99.
 */
export function instantesSuspeitos(precos, { limiar = 0.2, minPontos = 20, faixa = [49, 51] } = {}) {
  const porInstante = new Map()
  for (const p of precos ?? []) {
    const k = String(p.snapshotAt ?? p.t).slice(0, 19)
    const v = Number(p.price ?? p.v)
    if (!Number.isFinite(v)) continue
    if (!porInstante.has(k)) porInstante.set(k, { n: 0, perto: 0 })
    const o = porInstante.get(k)
    o.n++
    if (v >= faixa[0] && v <= faixa[1]) o.perto++
  }
  const suspeitos = new Map()
  for (const [k, o] of porInstante) {
    if (o.n < minPontos) continue
    const frac = o.perto / o.n
    if (frac >= limiar) suspeitos.set(k, { ...o, frac })
  }
  return suspeitos
}

/** O `price` do backup já vem em PONTOS PERCENTUAIS, não em fração. */
export function serieDe(precos, outcomeDe, mercadoDe, { slug, outcome } = {}) {
  const pontos = []
  for (const p of precos) {
    const o = outcomeDe.get(p.outcomeId)
    if (!o) continue
    const m = mercadoDe.get(o.marketId)
    if (!m) continue
    // ⚠️ Igualdade EXATA no slug, nunca `startsWith`. No Brasil os três contratos
    // presidenciais se aninham e o prefixo cola as três séries numa só.
    if (slug && m.slug !== slug) continue
    if (outcome && o.outcomeName !== outcome) continue
    const v = Number(p.price)
    if (!Number.isFinite(v)) continue
    pontos.push({ t: String(p.snapshotAt), v, slug: m.slug, outcome: o.outcomeName })
  }
  return pontos.sort((a, b) => a.t.localeCompare(b.t))
}

/** Agrupa por contrato + desfecho, que é a unidade de série. */
export function agruparPorLivro(pontos) {
  const m = new Map()
  for (const p of pontos) {
    const k = `${p.slug}␟${p.outcome}`
    if (!m.has(k)) m.set(k, [])
    m.get(k).push(p)
  }
  return m
}

export function extremos(pontos) {
  if (!pontos || pontos.length === 0) return null
  let min = pontos[0]
  let max = pontos[0]
  for (const p of pontos) {
    if (p.v < min.v) min = p
    if (p.v > max.v) max = p
  }
  return {
    n: pontos.length,
    inicio: pontos[0].t,
    fim: pontos[pontos.length - 1].t,
    ultimo: pontos[pontos.length - 1].v,
    min: min.v,
    minEm: min.t,
    max: max.v,
    maxEm: max.t,
  }
}

/** A fatia que a rota da API conseguiria enxergar, para medir o que ela esconde. */
export function janela(pontos, dias, agora = new Date()) {
  const corte = new Date(agora.getTime() - dias * 86400000).toISOString()
  return (pontos ?? []).filter((p) => p.t >= corte)
}

/**
 * 🔑 O veredito de superlativo. Ele responde UMA pergunta: o valor de hoje é
 * extremo da série, e a série é longa o bastante para a frase se sustentar?
 *
 * `RECORDE` / `PISO` só saem quando o valor bate o extremo da série INTEIRA,
 * a do backup mais o ponto de agora. `DENTRO` é o caso normal e não autoriza
 * superlativo nenhum.
 */
export function vereditoSuperlativo(valorHoje, ext, { tolerancia = 0.001 } = {}) {
  if (ext == null || valorHoje == null) return { veredito: 'SEM_SERIE', motivo: 'sem série gravada para comparar' }
  if (valorHoje > ext.max + tolerancia) {
    return {
      veredito: 'RECORDE',
      motivo: `${valorHoje.toFixed(2)} supera o topo da série, ${ext.max.toFixed(2)} de ${ext.maxEm.slice(0, 10)}`,
    }
  }
  if (valorHoje < ext.min - tolerancia) {
    return {
      veredito: 'PISO',
      motivo: `${valorHoje.toFixed(2)} fica abaixo do piso da série, ${ext.min.toFixed(2)} de ${ext.minEm.slice(0, 10)}`,
    }
  }
  return {
    veredito: 'DENTRO',
    motivo:
      `${valorHoje.toFixed(2)} está a ${(ext.max - valorHoje).toFixed(2)}pp do topo (${ext.max.toFixed(2)}, ${ext.maxEm.slice(0, 10)})` +
      ` e a ${(valorHoje - ext.min).toFixed(2)}pp do piso (${ext.min.toFixed(2)}, ${ext.minEm.slice(0, 10)})`,
  }
}

/**
 * ⚠️ O alerta que dá nome ao script: quanto a janela da API ESCONDE.
 *
 * Devolve `null` quando a janela cobre a série inteira, e aí a API serviria.
 * Quando não cobre, diz quantos dias ficam de fora e se algum EXTREMO está lá,
 * que é o caso em que a API produz superlativo falso sem dar erro.
 */
export function oQueAJanelaEsconde(pontos, dias, agora = new Date()) {
  const tudo = extremos(pontos)
  const dentro = extremos(janela(pontos, dias, agora))
  if (!tudo || !dentro) return null
  if (dentro.inicio === tudo.inicio) return null
  const diasFora = Math.round((Date.parse(dentro.inicio) - Date.parse(tudo.inicio)) / 86400000)
  return {
    diasFora,
    inicioReal: tudo.inicio,
    inicioVisivel: dentro.inicio,
    pontosFora: tudo.n - dentro.n,
    escondeMax: tudo.max > dentro.max ? { real: tudo.max, em: tudo.maxEm, aparente: dentro.max } : null,
    escondeMin: tudo.min < dentro.min ? { real: tudo.min, em: tudo.minEm, aparente: dentro.min } : null,
  }
}
