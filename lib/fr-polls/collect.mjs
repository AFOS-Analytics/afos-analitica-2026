/**
 * Pesquisas da presidencial francesa de 2027. Criado 08/Nov/2026.
 *
 * A França não tem registro estruturado como o do TSE. Duas fontes, cada uma
 * com um papel, e a regra que as amarra:
 *
 *  1. 🏛️ COMMISSION DES SONDAGES = AUTORIDADE. Toda pesquisa publicada na
 *     França deposita uma ficha (notice) antes de sair (lei de 1977, art. 3).
 *     A listagem por tema é HTML, com número, rótulo, instituto e data.
 *  2. 📊 MIEUXVOTER/presidentielle2027 = BASE ESTRUTURADA (CSV, licença MIT),
 *     com candidato e porcentagem por lista testada ("hypothèse").
 *
 * 🔒 A REGRA: cada pesquisa do CSV é conferida contra a ficha que ele mesmo
 * cita. A ficha tem de existir na listagem, ser de intenção de voto e ser do
 * MESMO instituto. Só `ficha: 'confere'` pode ir para a tela; as outras ficam
 * gravadas com o motivo, à vista.
 *
 * 📌 O caso que justifica a conferência, medido em 08/Nov/2026: o CSV atribui a
 * Ifop de 27 a 29/Out à ficha 10352, que na Commission é uma pesquisa da ELABE
 * sobre mobilizações sociais. A certa é a 10351. Sem conferir, o número entraria
 * com procedência falsa.
 *
 * 📥 E o caminho inverso: ficha de intenção de voto na Commission que o CSV
 * ainda não tem vira `pendentes`. É o aviso de "saiu pesquisa nova" (a Harris
 * de 03 a 05/Nov e a Cluster17/Politico de outubro estavam fora do CSV).
 *
 * ⛔ Este módulo NÃO faz média. Juntar listas diferentes de candidatos numa
 * média é decisão de método, e ela é do André.
 */

const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'

export const URL_LISTAGEM = 'https://www.commission-des-sondages.fr/notices/medias/fichiers/bytag/14/2027-Presidentielle'
const BASE_COMMISSION = 'https://www.commission-des-sondages.fr'
export const URL_CSV = 'https://raw.githubusercontent.com/MieuxVoter/presidentielle2027/main/presidentielle2027.csv'

/** Rótulo de ficha que é de INTENÇÃO DE VOTO (os outros são popularidade, temas, etc.). */
const E_INTENCAO = /\bIV\b|barom[eè]tre [ée]lection|pr[ée]sitrack|intentions? de vote/i

/**
 * Instituto do CSV → grafias no rótulo da ficha. Lista FECHADA: instituto que
 * não está aqui vira `instituto-sem-mapa`, nunca um acerto por acaso.
 */
const INSTITUTOS = {
  ifop: ['ifop'],
  'harris interactive': ['harris', 'toluna'],
  'toluna harris interactive': ['harris', 'toluna'],
  elabe: ['elabe'],
  'ipsos bva': ['ipsos', 'bva'],
  ipsos: ['ipsos', 'bva'],
  opinionway: ['opinionway'],
  cluster17: ['cluster17', 'cluster 17'],
  yougov: ['yougov'],
  odoxa: ['odoxa'],
  verian: ['verian'],
  csa: ['csa'],
  viavoice: ['viavoice'],
}

const semAcento = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** CSV com aspas, vírgula dentro de aspas e aspas duplicadas. */
export function lerCsv(texto) {
  const linhas = []
  let campo = ''
  let linha = []
  let aspas = false
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i]
    if (aspas) {
      if (ch === '"' && texto[i + 1] === '"') { campo += '"'; i++ }
      else if (ch === '"') aspas = false
      else campo += ch
      continue
    }
    if (ch === '"') aspas = true
    else if (ch === ',') { linha.push(campo); campo = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && texto[i + 1] === '\n') i++
      linha.push(campo); campo = ''
      if (linha.length > 1 || linha[0] !== '') linhas.push(linha)
      linha = []
    } else campo += ch
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha) }
  const [cab, ...resto] = linhas
  return resto.map((l) => Object.fromEntries(cab.map((c, i) => [c, l[i] ?? ''])))
}

/** Listagem da Commission → fichas. O número pode ter sufixo de letra (10166A). */
export function lerListagem(html) {
  const fichas = []
  for (const m of html.matchAll(/href="(\/notices\/medias\/fichiers\/add\/\d+)"[^>]*>\s*([^<]+?)\s*</g)) {
    const rotulo = m[2].replace(/\s+/g, ' ').trim()
    const numero = rotulo.match(/^(\d+[A-Z]?)\b/)?.[1]
    if (!numero) continue
    fichas.push({ numero, rotulo, url: BASE_COMMISSION + m[1], intencao: E_INTENCAO.test(rotulo) })
  }
  return fichas
}

/** Número da ficha a partir do nome do arquivo citado pelo CSV ("10351-pres-iv-...pdf" → "10351"). */
export function numeroDoArquivo(arquivo) {
  return String(arquivo).match(/^(\d+[A-Za-z]?)-/)?.[1]?.toUpperCase() ?? null
}

/** Confere UMA pesquisa contra a listagem. Devolve o status e o porquê. */
export function conferirFicha(instituto, arquivo, fichasPorNumero) {
  const numero = numeroDoArquivo(arquivo)
  if (!numero) return { status: 'sem-numero', numero: null, motivo: `o CSV não cita ficha (arquivo "${arquivo}")` }
  const ficha = fichasPorNumero.get(numero)
  if (!ficha) return { status: 'fora-da-listagem', numero, motivo: `a ficha ${numero} não está na listagem 2027 da Commission` }
  const grafias = INSTITUTOS[semAcento(instituto).trim()]
  if (!grafias) return { status: 'instituto-sem-mapa', numero, rotulo: ficha.rotulo, url: ficha.url, motivo: `instituto "${instituto}" fora do mapa` }
  const rot = semAcento(ficha.rotulo)
  if (!grafias.some((g) => rot.includes(g))) {
    return { status: 'diverge', numero, rotulo: ficha.rotulo, url: ficha.url, motivo: `o CSV diz ${instituto}; a ficha ${numero} é "${ficha.rotulo}"` }
  }
  // 📏 Medido em 08/Nov/2026: só 30 das 221 fichas dizem "IV" no rótulo. As
  // antigas dizem apenas "Pres ELABE 11 juillet", e exigir "IV" reprovava 176
  // pesquisas legítimas. Número + instituto é a conferência; o rótulo dizer
  // intenção de voto é um selo a mais (`rotuloDizIntencao`), não condição.
  return { status: 'confere', numero, rotulo: ficha.rotulo, url: ficha.url, rotuloDizIntencao: ficha.intencao }
}

/**
 * Turno pelo valor da coluna `tour`. A base tem só "1er Tour" e "2nd Tour"
 * (medido em 19/Nov/2026: 3.514 linhas). Até 19/Nov/2026 qualquer valor sem
 * "2" virava 1º turno, e uma lista de outra eleição estruturada com outro
 * rótulo entraria na tela como lista da presidencial. Valor desconhecido dá
 * `null` e a lista fica fora (`formaDaLista`).
 */
export function turnoDe(tour) {
  const t = semAcento(tour ?? '').replace(/\s+/g, ' ').trim()
  if (/^(1|1er|1e|premier) tour$/.test(t)) return 1
  if (/^(2|2nd|2e|2eme|second) tour$/.test(t)) return 2
  return null
}

/** Menor lista de 1º turno que a tela aceita. A menor da base tem 7 nomes (19/Nov/2026). */
export const MIN_NOMES_1T = 6

/**
 * 🧭 A FORMA da lista é a da presidencial? Devolve o motivo de não ser, ou null.
 * Criado 19/Nov/2026, quando a Commission recebeu a ficha 10387 (Ifop para
 * Le Figaro), com intenção de voto numa PRIMÁRIA do centro e da direita: das
 * 6 fichas de primária com texto no índice, a única com essa pergunta. As
 * listas dela têm 4 e 3 nomes e somam 100, a ficha existe e o instituto
 * bate. Se a base a estruturasse, só a forma a separaria da presidencial.
 * Turno desconhecido, 1º turno com menos de MIN_NOMES_1T nomes e duelo que
 * não tem 2 nomes ficam fora, à vista, com o motivo.
 */
export function formaDaLista(p) {
  const n = p.intencoes.length
  if (p.turno === null) return `turno desconhecido na base ("${p.tourNaBase ?? ''}")`
  if (p.turno === 1 && n < MIN_NOMES_1T) return `1º turno com ${n} nome(s), menos de ${MIN_NOMES_1T}: não tem a forma de lista da presidencial (primária?)`
  if (p.turno === 2 && n !== 2) return `2º turno com ${n} nome(s), e não 2`
  return null
}

/** Monta as pesquisas (uma por lista testada) a partir das linhas longas do CSV. */
export function montarPesquisas(linhas, fichasPorNumero) {
  const porPoll = new Map()
  for (const l of linhas) {
    if (!l.poll_id) continue
    let p = porPoll.get(l.poll_id)
    if (!p) {
      p = {
        pollId: l.poll_id,
        instituto: l.nom_institut,
        cliente: l.commanditaire,
        campo: { inicio: l.debut_enquete, fim: l.fin_enquete },
        amostra: Number(l.echantillon) || null,
        turno: turnoDe(l.tour),
        // Só quando o turno é desconhecido, para a assinatura do conteúdo de
        // hoje não mudar (19/Nov/2026).
        ...(turnoDe(l.tour) === null ? { tourNaBase: l.tour } : {}),
        hipotese: l.hypothese,
        ficha: conferirFicha(l.nom_institut, l.filename, fichasPorNumero),
        intencoes: [],
      }
      porPoll.set(l.poll_id, p)
    }
    const pct = Number(l.intentions)
    if (l.candidat && Number.isFinite(pct)) {
      p.intencoes.push({ candidato: l.candidat, pct })
    }
  }
  for (const p of porPoll.values()) {
    p.intencoes.sort((a, b) => b.pct - a.pct)
    // Soma por lista: perto de 100 no 1º turno e no 2º. Fora disso o CSV
    // perdeu candidato ou duplicou linha, e a pesquisa não deve ir para a tela.
    p.soma = Number(p.intencoes.reduce((s, i) => s + i.pct, 0).toFixed(2))
  }
  return [...porPoll.values()].sort((a, b) => b.campo.fim.localeCompare(a.campo.fim) || a.pollId.localeCompare(b.pollId))
}

/** Download que LANÇA em status fora de 2xx. Exportado para o script de conferência (12/Nov/2026). */
export async function baixar(url, comoTexto = true) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20_000), cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`)
  return comoTexto ? res.text() : res
}

/**
 * Colunas do CSV que a montagem lê. Coluna renomeada na base não dá erro: vira
 * `undefined`, a ficha cai em 'sem-numero' ou a lista fica vazia, e nenhuma
 * pesquisa sai publicável. Por isso a ausência é FALHA de leitura (12/Nov/2026).
 */
const COLUNAS_CSV = ['poll_id', 'nom_institut', 'fin_enquete', 'tour', 'filename', 'candidat', 'intentions']

/** Soma de uma lista fora disto = lista quebrada no CSV. */
const SOMA_MIN = 97
const SOMA_MAX = 103

export async function coletarPesquisasFr({ agora = new Date(), diasDePendencia = 45 } = {}) {
  const falhas = []
  let fichas = []
  let linhas = []
  try {
    fichas = lerListagem(await baixar(URL_LISTAGEM))
  } catch (e) {
    falhas.push(`commission: ${e instanceof Error ? e.message : String(e)}`)
  }
  try {
    linhas = lerCsv(await baixar(URL_CSV))
  } catch (e) {
    falhas.push(`mieuxvoter: ${e instanceof Error ? e.message : String(e)}`)
  }
  if (linhas.length) {
    const cabecalho = Object.keys(linhas[0])
    for (const c of COLUNAS_CSV) if (!cabecalho.includes(c)) falhas.push(`mieuxvoter: coluna ${c} ausente`)
  }

  const fichasPorNumero = new Map(fichas.map((f) => [f.numero, f]))
  const pesquisas = fichas.length && linhas.length ? montarPesquisas(linhas, fichasPorNumero) : []
  for (const p of pesquisas) {
    p.somaConfere = p.soma >= SOMA_MIN && p.soma <= SOMA_MAX
    // O que a tela pode mostrar: ficha confere, a lista fecha E tem a forma
    // da presidencial (19/Nov/2026, ver `formaDaLista`).
    p.publicavel = p.ficha.status === 'confere' && p.somaConfere && !formaDaLista(p)
  }

  // Fichas de intenção de voto recentes que o CSV não cita: pesquisa nova
  // ainda sem estrutura. A data do rótulo não é confiável o bastante para
  // filtrar; o número é crescente, então "recente" = acima da menor ficha
  // citada pelo CSV nos últimos `diasDePendencia` dias.
  const citadas = new Set(pesquisas.map((p) => p.ficha.numero).filter(Boolean))
  const limite = new Date(agora.getTime() - diasDePendencia * 864e5).toISOString().slice(0, 10)
  const recentes = pesquisas.filter((p) => p.campo.fim >= limite && p.ficha.numero)
  const piso = recentes.length ? Math.min(...recentes.map((p) => parseInt(p.ficha.numero, 10))) : Infinity
  const pendentes = fichas
    .filter((f) => f.intencao && !citadas.has(f.numero) && parseInt(f.numero, 10) >= piso)
    .map((f) => ({ numero: f.numero, rotulo: f.rotulo, url: f.url }))

  const contar = (s) => pesquisas.filter((p) => p.ficha.status === s).length

  // Partido uma vez por candidato, e não em cada uma das ~3.000 linhas.
  const partidos = {}
  for (const l of linhas) if (l.candidat && l.parti && !partidos[l.candidat]) partidos[l.candidat] = l.parti

  // 🔏 ASSINATURA do conteúdo, sem carimbo de hora. O cron compara com a da
  // última gravação e só grava quando ela muda: medido em 08/Nov/2026, o
  // resultado tem ~400 KB, e gravado todo dia até maio seriam ~70 MB num
  // banco de 0,5 GB para repetir o mesmo conteúdo na maioria dos dias.
  const { createHash } = await import('node:crypto')
  const assinatura = createHash('sha256').update(JSON.stringify({ pesquisas, pendentes })).digest('hex').slice(0, 16)
  return {
    pais: 'fra',
    lastUpdate: agora.toISOString().slice(0, 10),
    fetchedAt: agora.toISOString(),
    regra: 'Cada pesquisa da base MieuxVoter é conferida contra a ficha oficial que ela cita na Commission des sondages. Só vai para a tela a que confere, cuja lista soma entre 97 e 103 e que tem a forma da presidencial (1º turno com 6 nomes ou mais, 2º turno com 2). O AFOS não faz média entre listas diferentes de candidatos.',
    fontes: { autoridade: URL_LISTAGEM, base: URL_CSV, licencaDaBase: 'MIT' },
    assinatura,
    partidos,
    qualidade: {
      fichasNaListagem: fichas.length,
      fichasDeIntencao: fichas.filter((f) => f.intencao).length,
      linhasDoCsv: linhas.length,
      pesquisas: pesquisas.length,
      publicaveis: pesquisas.filter((p) => p.publicavel).length,
      fichaConfere: contar('confere'),
      fichaDiverge: contar('diverge'),
      fichaForaDaListagem: contar('fora-da-listagem'),
      semNumero: contar('sem-numero'),
      institutoSemMapa: contar('instituto-sem-mapa'),
      somaForaDaFaixa: pesquisas.filter((p) => !p.somaConfere).length,
      listaForaDaForma: pesquisas.filter((p) => formaDaLista(p)).length,
      pendentes: pendentes.length,
      falhas,
    },
    divergencias: pesquisas.filter((p) => p.ficha.status !== 'confere').map((p) => ({ pollId: p.pollId, instituto: p.instituto, fim: p.campo.fim, ...p.ficha })),
    pendentes,
    pesquisas,
  }
}
