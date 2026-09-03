/**
 * Leitura do HISTÓRICO do generic ballot dos EUA, direto do Neon.
 *
 * 🔴 POR QUE EXISTE, medido em 31/Ago/2026.
 *
 * O `us-polls-data.json` do repositório é uma FOTOGRAFIA: ele diz como a base
 * está hoje e não diz nada sobre como ela chegou aqui. Quem grava todo dia é o
 * cron das 07:10Z, num registro por dia no `analysis_reports`. Ler essa série
 * respondeu, em uma consulta, três perguntas que a fotografia não responde:
 *
 *   1. o cron rodou hoje, ou o dado de hoje é de ontem sobrevivendo?
 *   2. desde quando o índice da fonte parou de crescer?
 *   3. o que mexeu na média foi pesquisa nova, ou só a borda da janela?
 *
 * Foi assim que se viu que `linhasLidas` está em 379 há sete dias seguidos e
 * que a queda de 22 para 15 pesquisas na média era toda composição.
 *
 * 🔑 A FONTE É O BANCO VIVO, NÃO O BACKUP.
 * O backup do Neon roda uma vez por dia, então tem uma cauda cega de até 24h,
 * e era exatamente lá que morava o ponto que derrubou uma frase já publicada.
 * Ver memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 *
 * 🔌 E NENHUMA FALHA VIRA "NADA A RELATAR".
 * Registro com corpo ilegível é contado e nomeado, nunca descartado em
 * silêncio; dia sem registro aparece como LACUNA; e a origem da gravação de
 * hoje devolve INDETERMINADO quando não dá para concluir, jamais "o cron não
 * rodou". Ver memory/feedback_o_cliente_devolve_desserializado_e_o_failopen_engoliu.md
 *
 * ⛔ Nada daqui entra no objeto `dados`: é medida de operador, pela mesma
 * razão declarada no `atraso.mjs`.
 */

/** Hora UTC em que o cron `/api/cron/refresh-us-polls` está agendado. */
export const HORA_CRON_UTC = { hora: 7, minuto: 10 }

/** Folga, em minutos, para creditar uma gravação ao cron. */
export const TOLERANCIA_CRON_MIN = 30

export const ORIGENS = {
  CRON: 'CRON',
  INDETERMINADO: 'INDETERMINADO',
  AUSENTE: 'AUSENTE',
  /**
   * O dia UTC virou e a hora do cron ainda NAO chegou.
   *
   * 🔴 POR QUE ISTO EXISTE, medido em 02/Set/2026 as 02:17Z. O registro do dia
   * anterior tinha sido gravado pelo cron as 07:10:42Z, na hora exata, e mesmo
   * assim o diagnostico devolvia AUSENTE com a nota "nem o cron gravou, nem
   * ninguem forcou" e um alerta VERMELHO mandando ir para o passo 3, que e
   * FORCAR. Isso vale todas as noites entre 00:00Z e 07:10Z, ou seja das 21h as
   * 04h10 de Brasilia: SETE HORAS por dia de alarme falso.
   *
   * ⛔ E o alarme apontava para a acao que causa dano. Em 01/Set forcar sem ler
   * antes APAGOU o carimbo das 07:10Z, porque o registro do dia e um so e e
   * sobrescrito. O conferidor recomendava exatamente o que a ficha manda evitar.
   * Ver memory/project_state_01set_usa_pesquisas.md
   *
   * 📐 A regra da casa ja estava escrita duas linhas acima: ausencia de marca
   * nao e marca de ausencia. Faltava aplica-la ao proprio relogio.
   */
  AGUARDANDO: 'AGUARDANDO',
}

function paraIso(v) {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString()
  if (typeof v === 'string') {
    const t = Date.parse(v)
    return Number.isNaN(t) ? null : new Date(t).toISOString()
  }
  return null
}

/**
 * Um registro do banco vira uma linha de série.
 *
 * ⚠️ Corpo ilegível NÃO some: volta com `ilegivel: true` e o motivo. Um leitor
 * que descarta o que não entende produz uma série mais limpa do que a
 * realidade, e é a série limpa que engana.
 */
export function resumirRegistro(row) {
  const gravadoEm = paraIso(row?.updatedAt)
  const base = { slug: row?.slug ?? null, gravadoEm }
  let d
  try {
    d = JSON.parse(row?.bodyMarkdown ?? '')
  } catch (e) {
    return { ...base, ilegivel: true, motivo: `corpo nao e JSON: ${e.message}` }
  }
  if (!d || typeof d !== 'object') {
    return { ...base, ilegivel: true, motivo: 'corpo nao e objeto' }
  }
  const m = d.mediaAfos ?? null
  const q = d.qualidade ?? {}
  const campos = Array.isArray(d.polls)
    ? d.polls.map((p) => p?.campoFim).filter((x) => typeof x === 'string').sort()
    : []
  return {
    ...base,
    ilegivel: false,
    lastUpdate: d.lastUpdate ?? null,
    fetchedAt: d.fetchedAt ?? null,
    linhasLidas: q.linhasLidas ?? null,
    publicadas: q.publicadas ?? null,
    descartadas: q.descartadas ?? null,
    semFontePrimaria: q.semFontePrimaria ?? null,
    nPesquisas: m?.nPesquisas ?? null,
    nInstitutos: m?.nInstitutos ?? null,
    vantagemDem: m?.vantagemDem ?? null,
    desde: m?.desde ?? null,
    // `false` aqui quer dizer "rodada sem média", que é diferente de média zero.
    temMedia: Boolean(m),
    campoMaisRecente: campos.length ? campos[campos.length - 1] : null,
  }
}

/** A série, do mais recente para o mais antigo, com os ilegíveis contados. */
export function montarSerie(rows) {
  const registros = (rows ?? [])
    .map(resumirRegistro)
    .sort((a, b) => String(b.gravadoEm ?? '').localeCompare(String(a.gravadoEm ?? '')))
  return {
    registros,
    total: registros.length,
    ilegiveis: registros.filter((r) => r.ilegivel).length,
  }
}

/**
 * Há quantos registros seguidos o campo `chave` não muda, contado do mais
 * recente para trás. Devolve `null` com menos de dois registros legíveis:
 * um ponto não é uma série, e "congelado há 0 dias" seria afirmação inventada
 * sobre um dado que não existe.
 * Ver memory/feedback_superlativo_de_serie_vs_hora_da_captura.md
 */
export function contarCongelamento(registros, chave) {
  const legiveis = (registros ?? []).filter((r) => !r.ilegivel && r[chave] != null)
  if (legiveis.length < 2) return null
  const valor = legiveis[0][chave]
  let n = 0
  for (const r of legiveis) {
    if (r[chave] !== valor) break
    n++
  }
  return {
    valor,
    registros: n,
    desde: legiveis[n - 1]?.lastUpdate ?? legiveis[n - 1]?.gravadoEm ?? null,
    cobreASerieInteira: n === legiveis.length,
  }
}

/**
 * Dias de calendário entre o primeiro e o último `lastUpdate` que NÃO têm
 * registro. Dia sem registro é dia em que nem o cron gravou nem ninguém
 * forçou, e isso é evidência de buraco, não de continuidade.
 */
export function lacunasDeDia(registros) {
  const dias = (registros ?? [])
    .map((r) => r.lastUpdate)
    .filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
  if (dias.length < 2) return []
  const tem = new Set(dias)
  const faltando = []
  const fim = Date.parse(dias[dias.length - 1] + 'T12:00:00Z')
  for (let t = Date.parse(dias[0] + 'T12:00:00Z'); t <= fim; t += 86400000) {
    const d = new Date(t).toISOString().slice(0, 10)
    if (!tem.has(d)) faltando.push(d)
  }
  return faltando
}

/**
 * A gravação de hoje, e QUEM a fez.
 *
 * ⚠️ A regra dura: carimbo fora da janela do cron devolve INDETERMINADO, e
 * NUNCA "o cron não rodou". O registro é um por dia e é sobrescrito, então uma
 * chamada forçada às 15h apaga o carimbo das 07:10Z. Ausência de marca não é
 * marca de ausência. É a mesma armadilha do `Last-Modified` da Morning
 * Consult: modificação não é data de ato.
 * Ver memory/feedback_cache_date_vs_event_date.md
 */
export function origemDaGravacao(registros, agora = new Date()) {
  const hoje = agora.toISOString().slice(0, 10)
  const r = (registros ?? []).find((x) => x.lastUpdate === hoje) ?? null
  if (!r) {
    // Antes da hora do cron, a ausencia e ESPERADA e nao e sinal de nada.
    const agoraMin = agora.getUTCHours() * 60 + agora.getUTCMinutes()
    const alvoMin = HORA_CRON_UTC.hora * 60 + HORA_CRON_UTC.minuto
    if (agoraMin < alvoMin - TOLERANCIA_CRON_MIN) {
      const hh = String(HORA_CRON_UTC.hora).padStart(2, '0')
      const mm = String(HORA_CRON_UTC.minuto).padStart(2, '0')
      return {
        dia: hoje,
        origem: ORIGENS.AGUARDANDO,
        registro: null,
        nota: `o dia UTC virou e o cron das ${hh}:${mm}Z ainda nao rodou. Ausencia esperada, nao e falha: o painel serve o registro do dia anterior ate la`,
      }
    }
    return {
      dia: hoje,
      origem: ORIGENS.AUSENTE,
      registro: null,
      nota: 'nenhum registro com lastUpdate de hoje, e a hora do cron ja passou: nem o cron gravou, nem ninguem forcou',
    }
  }
  const t = r.gravadoEm ? new Date(r.gravadoEm) : null
  if (!t) {
    return { dia: hoje, origem: ORIGENS.INDETERMINADO, registro: r, nota: 'registro sem carimbo de gravacao' }
  }
  const minutos = t.getUTCHours() * 60 + t.getUTCMinutes()
  const alvo = HORA_CRON_UTC.hora * 60 + HORA_CRON_UTC.minuto
  if (Math.abs(minutos - alvo) <= TOLERANCIA_CRON_MIN) {
    return { dia: hoje, origem: ORIGENS.CRON, registro: r, nota: `gravado ${r.gravadoEm}, dentro da janela das 07:10Z` }
  }
  return {
    dia: hoje,
    origem: ORIGENS.INDETERMINADO,
    registro: r,
    nota: `gravado ${r.gravadoEm}, fora da janela do cron. Pode ter sido chamada forcada POR CIMA da do cron: o registro do dia e um so e e sobrescrito, entao isto NAO prova que o cron falhou`,
  }
}

/** O diagnóstico inteiro, que é o que o CLI imprime. */
export function diagnosticarSerie(rows, agora = new Date()) {
  const serie = montarSerie(rows)
  return {
    ...serie,
    indice: contarCongelamento(serie.registros, 'linhasLidas'),
    campo: contarCongelamento(serie.registros, 'campoMaisRecente'),
    lacunas: lacunasDeDia(serie.registros),
    hoje: origemDaGravacao(serie.registros, agora),
  }
}
