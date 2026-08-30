/**
 * Verificador de RODADA FORA DO ÍNDICE.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * Em 28/Ago/2026 o portão de cadência (`medirCadencia`) passou a apontar as
 * casas caladas por critério. Ele acertou: a The Economist/YouGov tinha duas
 * ondas publicadas que o índice da Wikipédia nunca recebeu.
 *
 * Em 29/Ago a pergunta seguinte foi se aquelas duas ondas entravam à mão. A
 * resposta foi NÃO, e a razão não era procedência:
 *
 *   "Eu só sei dessas duas porque o MEU portão apontou ESSA casa. Se eu
 *    acrescento a YouGov porque reparei nela, a média deixa de ser 'o que o
 *    índice traz' e passa a ser 'o que o índice traz, mais o que eu reparei'."
 *
 * Isso converteria uma amostra SISTEMÁTICA numa DISCRICIONÁRIA, que é a
 * família de defeito que o AFOS existe para não cometer.
 * Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
 *
 * ✅ ESTE ARQUIVO É O DESENHO QUE A FICHA PEDIU: um segundo leitor acionado
 * pelo PORTÃO, e não pela atenção de quem está rodando. Toda casa que cruzar o
 * marco de ciclos perdidos tem a listagem PRÓPRIA consultada, sem exceção e
 * sem escolha.
 *
 * ─── O QUE ELE FAZ, E O QUE ELE NÃO FAZ ─────────────────────────────────────
 *
 * ✅ FAZ: responde UMA pergunta por casa sinalizada, "existe rodada com campo
 *    mais recente do que a última que o índice tem?", e devolve a evidência.
 *
 * ⛔ NÃO FAZ: não lê percentual, não lê amostra, não ingere linha nenhuma. Ele
 *    é DETECTOR, não coletor. Ingerir mudaria a procedência da média servida e
 *    é decisão do André, não efeito colateral de uma passada.
 *
 * ⛔ NÃO ENTRA no objeto `dados`. Mesma regra do atraso e da cadência:
 *    `public/us-polls-data.json` é servido em público, e "a YouGov tem onda
 *    fora do índice" é fato sobre a NOSSA coleta, não sobre a eleição.
 *    Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 *
 * ─── A REGRA DE FALHA, QUE É A PARTE QUE MAIS IMPORTA ───────────────────────
 *
 * 🔌 Erro de rede, 403 de borda, página que mudou de formato ou casa sem
 * listagem registrada devolvem `INDETERMINADO` ou `SEM_LISTAGEM_REGISTRADA`,
 * NUNCA `SEM_RODADA_NOVA`.
 *
 * Fail-open calado já custou uma rodada inteira nesta casa: em 28/Ago o
 * `shouldPersist` do coletor de mercado engoliu duas exceções num
 * `catch { return true }` e o banco passou a gravar 15 vezes mais rápido sem
 * nenhum alarme. Um verificador que devolve "nada novo" quando na verdade não
 * conseguiu olhar é o mesmo defeito com outra roupa: ele fecharia a suspeita
 * com um verde que ninguém mediu.
 * Ver memory/feedback_o_cliente_devolve_desserializado_e_o_failopen_engoliu.md
 */

const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'

/**
 * ─── O REGISTRO DE LISTAGENS ────────────────────────────────────────────────
 *
 * 🔑 O `host` de cada casa NÃO foi escolhido a dedo: ele é o host que MAIS
 * aparece nos links de `fontePrimaria` que o próprio índice já dá para aquela
 * casa. Isso mantém a construção do registro derivada de dado, e não de
 * atenção. As 11 casas abaixo são exatamente as que o portão de cadência
 * consegue avaliar hoje (mínimo de 5 rodadas em 180 dias), ou seja, TODAS as
 * que algum dia podem ser sinalizadas.
 *
 * `url` é a página que lista as divulgações da casa. Onde ela não existe, ou
 * não respondeu na conferência de 30/Ago/2026, o campo fica `null` de
 * propósito: casa sinalizada sem listagem sai como SEM_LISTAGEM_REGISTRADA,
 * que é ruidoso por desenho. Um `null` calado seria fail-open.
 *
 * `formato` diz o que a página oferece:
 *   'intervalo' → o texto traz o intervalo de campo ("August 21 - 24, 2026"),
 *                 que é a evidência forte, porque é a data do ATO.
 *   'meta'      → a página não lista intervalos e só declara quando foi
 *                 modificada (schema.org `dateModified`). É evidência FRACA:
 *                 diz quando a página mexeu, não quando o campo encerrou.
 *                 Ver memory/feedback_cache_date_vs_event_date.md
 */
export const LISTAGENS_POR_CASA = {
  'The Economist/YouGov': {
    host: 'yougov.com',
    url: 'https://yougov.com/en-us/content/the-economist',
    formato: 'intervalo',
    nota: 'o titulo de cada artigo traz o intervalo de campo da onda',
  },
  'Morning Consult': {
    host: 'intel.morningconsult.com',
    url: 'https://intel.morningconsult.com/mc-content/trackers/2026-midterm-election-generic-ballot-polls',
    formato: 'meta',
    nota: 'tracker semanal; parte do conteudo e paga (isAccessibleForFree:false), por isso o veredito e sempre PARCIAL',
  },
  'Quantus Insights (R)': {
    host: 'quantusinsights.org',
    url: 'https://quantusinsights.org/',
    formato: 'intervalo',
    nota: 'a raiz lista as divulgacoes; /polls/ devolve 404',
  },
  'Strength In Numbers/Verasight': {
    host: 'www.gelliottmorris.com',
    url: 'https://www.gelliottmorris.com/archive',
    formato: 'intervalo',
    nota: 'arquivo do boletim onde a rodada e divulgada',
  },
  'RMG Research': {
    host: 'napolitannews.org',
    url: null,
    formato: null,
    nota: 'napolitannews.org nao resolveu na conferencia de 30/Ago/2026',
  },
  'McLaughlin & Associates (R)': {
    host: 'mclaughlinonline.com',
    url: 'https://mclaughlinonline.com/polls/',
    formato: 'intervalo',
    nota: null,
  },
  'Big Data Poll (R)': {
    host: 'www.bigdatapoll.com',
    url: null,
    formato: null,
    nota: '/polls devolve 404; caminho da listagem nao confirmado',
  },
  'Reuters/Ipsos': {
    host: 'www.ipsos.com',
    url: 'https://www.ipsos.com/en-us/publications',
    formato: 'intervalo',
    nota: null,
  },
  'Cygnal (R)': {
    host: 'www.cygn.al',
    url: null,
    formato: null,
    nota: 'www.cygn.al/insights/ devolve 403 de borda; ver memory/reference_bloqueio_de_borda_como_diagnosticar.md',
  },
  'Echelon Insights': {
    host: 'echeloninsights.com',
    url: 'https://echeloninsights.com/insights/',
    formato: 'intervalo',
    nota: null,
  },
  'Emerson College': {
    host: 'emersoncollegepolling.com',
    url: 'https://emersoncollegepolling.com/',
    formato: 'intervalo',
    nota: null,
  },
}

const MESES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9,
  oct: 10, nov: 11, dec: 12,
}

/**
 * Intervalos de campo no texto da página: "August 21 - 24, 2026",
 * "July 30 – August 3, 2026", "Aug 14-17, 2026".
 *
 * ⚠️ Só o FIM do intervalo interessa, porque é ele que a casa usa como
 * `campoFim` e é ele que decide se a rodada cai dentro da janela da média.
 *
 * ⚠️ E o extrator é DE PROPÓSITO burro: ele acha datas, não pesquisas. Uma
 * data de evento na mesma página vira falso positivo. Por isso o veredito vem
 * sempre com a `evidencia`, o trecho literal que gerou a data, e por isso nada
 * disto ingere valor: quem confirma é uma pessoa olhando o trecho.
 */
export function extrairIntervalosDeCampo(texto, ano = new Date().getUTCFullYear()) {
  const re = /([A-Z][a-z]{2,8})\.?\s+(\d{1,2})\s*(?:[-–—]|to)\s*(?:([A-Z][a-z]{2,8})\.?\s+)?(\d{1,2}),?\s*(20\d{2})/g
  const achados = []
  for (const m of texto.matchAll(re)) {
    const mesFim = MESES[(m[3] || m[1]).toLowerCase()]
    const dia = Number(m[4])
    const anoTxt = Number(m[5])
    if (!mesFim || dia < 1 || dia > 31) continue
    if (anoTxt !== ano) continue
    achados.push({
      iso: `${anoTxt}-${String(mesFim).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
      evidencia: m[0],
    })
  }
  return achados.sort((a, b) => (a.iso < b.iso ? 1 : -1))
}

/** `dateModified`/`datePublished` do schema.org. Evidência fraca, ver acima. */
export function extrairUltimaModificacao(texto) {
  const m = [...texto.matchAll(/"date(?:Modified|Published)"\s*:\s*"(20\d{2}-\d{2}-\d{2})/g)].map((x) => x[1])
  return m.length ? m.sort().reverse()[0] : null
}

export const VEREDITOS = {
  RODADA_FORA_DO_INDICE: 'RODADA_FORA_DO_INDICE',
  SEM_RODADA_NOVA: 'SEM_RODADA_NOVA',
  INDETERMINADO: 'INDETERMINADO',
  SEM_LISTAGEM_REGISTRADA: 'SEM_LISTAGEM_REGISTRADA',
}

/**
 * Consulta a listagem de UMA casa e compara com o que o índice tem dela.
 *
 * `ultimoCampoNoIndice` é a última `campoFim` que a NOSSA base tem daquela
 * casa. A pergunta é estritamente "existe algo mais novo do que isto lá?".
 */
export async function verificarCasa(instituto, ultimoCampoNoIndice, opts = {}) {
  const { fetchImpl = fetch, agora = new Date(), timeoutMs = 20_000 } = opts
  const reg = LISTAGENS_POR_CASA[instituto]
  const base = { instituto, ultimoCampoNoIndice, url: reg?.url ?? null, host: reg?.host ?? null }

  if (!reg || !reg.url) {
    return {
      ...base,
      veredito: VEREDITOS.SEM_LISTAGEM_REGISTRADA,
      detalhe: reg?.nota ?? 'casa nao esta no registro de listagens',
    }
  }

  let texto
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeoutMs)
    const r = await fetchImpl(reg.url, { headers: { 'user-agent': UA }, signal: ctrl.signal })
    clearTimeout(t)
    if (!r.ok) {
      return { ...base, veredito: VEREDITOS.INDETERMINADO, detalhe: `HTTP ${r.status} na listagem` }
    }
    texto = await r.text()
  } catch (e) {
    // 🔌 Falha de rede NÃO vira "nada novo". Ver o cabeçalho deste arquivo.
    return { ...base, veredito: VEREDITOS.INDETERMINADO, detalhe: `falha ao ler a listagem: ${e.message}` }
  }

  const ano = agora.getUTCFullYear()
  const hoje = agora.toISOString().slice(0, 10)

  if (reg.formato === 'intervalo') {
    const achados = extrairIntervalosDeCampo(texto, ano).filter((a) => a.iso <= hoje)
    if (!achados.length) {
      // A página respondeu mas não trouxe intervalo nenhum: o formato mudou,
      // ou o conteúdo é montado no cliente. Não dá para afirmar nada.
      return {
        ...base,
        veredito: VEREDITOS.INDETERMINADO,
        detalhe: 'listagem sem intervalo de campo legivel (formato mudou ou e montada no cliente)',
      }
    }
    const topo = achados[0]
    if (ultimoCampoNoIndice && topo.iso > ultimoCampoNoIndice) {
      const novos = achados.filter((a) => a.iso > ultimoCampoNoIndice)
      const distintas = [...new Map(novos.map((n) => [n.iso, n.evidencia])).entries()]
      return {
        ...base,
        veredito: VEREDITOS.RODADA_FORA_DO_INDICE,
        ultimoNaListagem: topo.iso,
        rodadasFora: distintas.map(([iso, evidencia]) => ({ iso, evidencia })),
        detalhe: `${distintas.length} rodada(s) com campo mais recente do que o indice`,
      }
    }
    return {
      ...base,
      veredito: VEREDITOS.SEM_RODADA_NOVA,
      ultimoNaListagem: topo.iso,
      detalhe: 'a listagem propria nao tem campo mais recente do que o indice',
    }
  }

  // formato 'meta': só dá para dizer quando a página mexeu.
  const mod = extrairUltimaModificacao(texto)
  if (!mod) {
    return {
      ...base,
      veredito: VEREDITOS.INDETERMINADO,
      detalhe: 'pagina sem intervalo de campo e sem data de modificacao declarada',
    }
  }
  const suspeita = ultimoCampoNoIndice && mod > ultimoCampoNoIndice
  return {
    ...base,
    veredito: VEREDITOS.INDETERMINADO,
    ultimaModificacao: mod,
    detalhe: suspeita
      ? `PARCIAL: a pagina mexeu em ${mod}, depois do ultimo campo indexado, mas ela nao declara intervalo de campo. Modificacao NAO e data de ato.`
      : `PARCIAL: ultima modificacao declarada ${mod}, nao posterior ao ultimo campo indexado. ${reg.nota ?? ''}`.trim(),
  }
}

/**
 * O ponto de entrada, e o único que deve ser chamado de fora.
 *
 * 🔑 A LISTA DE QUEM É CONSULTADO VEM DO PORTÃO, não de quem chama. Não existe
 * parâmetro para escolher casa: isso é de propósito, e é a diferença entre uma
 * verificação sistemática e uma escolhida.
 */
export async function verificarCasasAtrasadas(dados, cadencia, opts = {}) {
  const ultimoPorCasa = new Map()
  for (const p of dados?.polls ?? []) {
    if (!p?.instituto || !p?.campoFim) continue
    const atual = ultimoPorCasa.get(p.instituto)
    if (!atual || p.campoFim > atual) ultimoPorCasa.set(p.instituto, p.campoFim)
  }

  const resultados = []
  for (const c of cadencia?.atrasadas ?? []) {
    resultados.push(await verificarCasa(c.instituto, ultimoPorCasa.get(c.instituto) ?? null, opts))
  }

  return {
    resultados,
    comRodadaFora: resultados.filter((r) => r.veredito === VEREDITOS.RODADA_FORA_DO_INDICE),
    inconclusivos: resultados.filter(
      (r) => r.veredito === VEREDITOS.INDETERMINADO || r.veredito === VEREDITOS.SEM_LISTAGEM_REGISTRADA,
    ),
  }
}

/**
 * Casas que o portão pode sinalizar e para as quais NÃO há listagem utilizável.
 *
 * Isto é o buraco do REGISTRO, não da fonte. Ele é impresso mesmo quando
 * nenhuma casa está atrasada, porque um registro incompleto só aparece no dia
 * em que a casa que falta é a que atrasa, e nesse dia já é tarde.
 */
export function buracosNoRegistro(cadencia) {
  return (cadencia?.avaliadas ?? [])
    .filter((c) => !LISTAGENS_POR_CASA[c.instituto]?.url)
    .map((c) => ({
      instituto: c.instituto,
      nota: LISTAGENS_POR_CASA[c.instituto]?.nota ?? 'nao esta no registro',
    }))
}
