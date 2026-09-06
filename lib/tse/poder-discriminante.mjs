/**
 * PODER DISCRIMINANTE DO PLANO AMOSTRAL, por instituto — lógica pura.
 *
 * ⚠️ POR QUE ISTO EXISTE. O `scope.mjs` decide o escopo pela ordem
 * metodologia > plano amostral > dado-município, e registra em `scope_source`
 * quem decidiu. A ordem está certa. O que não existia era a pergunta seguinte:
 * quando a decisão cai no PLANO AMOSTRAL, esse campo vale alguma coisa NAQUELA
 * CASA?
 *
 * 🔴 Medido em 06/Set/2026, e a resposta é que às vezes não vale nada. O plano
 * amostral da Real Time Big Data diz "eleitorado brasileiro" em 23 de 23
 * pesquisas ESTADUAIS dela. É boilerplate: o campo diz "nacional" sempre, então
 * dizer "nacional" não é informação. E 3 registros da casa estavam servidos como
 * NACIONAIS apoiados exatamente nesse campo, com a metodologia calada, um deles
 * no calendário publicado. Eles são indistinguíveis das 23 estaduais em toda
 * medida do registro: mesmo n (1.600 e 2.000), mesmo custo por entrevista
 * (R$ 15,00) e uma metodologia que diz "eleitores do universo a ser explorado",
 * que não nomeia universo nenhum.
 *
 * ⭐ O contraste que faz o portão ser útil em vez de histérico: o plano amostral
 * da Veritá diz "estadual" em 41 dos 43 registros dela. Nessa casa o campo SEPARA,
 * então o "nacional" do registro de n=40.500 é informação de verdade e passa.
 * Um portão que reprovasse toda derivação por plano amostral reprovaria as duas
 * e não teria dito nada.
 *
 * 🔑 SÃO DOIS SINAIS, E É POR CASA. Não se pergunta se o campo é bom em geral.
 *
 *   1. CONTRADIÇÃO, e basta sozinha: o plano chamou de nacional uma pesquisa que
 *      a METODOLOGIA já disse ser estadual. Exige fonte forte dos dois lados,
 *      senão é circular, porque escopo derivado do plano sempre concorda com o
 *      plano. Uma contradição basta: exigir unanimidade deixaria passar a casa
 *      de boilerplate irregular, que é a mais difícil de ver a olho.
 *
 *   2. VARIAÇÃO, quando não há contradição: o plano já disse "estadual" alguma
 *      vez nos registros daquela casa? Se sim, ele está sendo preenchido por
 *      pesquisa e o "nacional" dele é escolha. Se diz nacional em todos, é texto
 *      padrão e não informa nada.
 *
 * 🔴 A primeira versão deste arquivo só tinha o sinal 1, e classificou a VERITÁ
 * como `SEM_BASE`. O motivo é que as 41 estaduais dela foram resolvidas pelo
 * próprio plano amostral, não pela metodologia, então nenhuma entrava na base.
 * O sinal 2 existe porque a pergunta "este texto varia?" não precisa de fonte
 * forte para ser respondida. Sem base e sem variação não há veredito: é
 * `SEM_BASE`, aviso e não reprovação.
 *
 * ⛔ O que ele NÃO faz: não diz que o registro é estadual. Diz que a evidência
 * para chamá-lo de nacional não sustenta o rótulo. A confirmação é na
 * divulgação. → memory/feedback_escopo_nacional_derivado_do_plano_amostral.md
 */

import { classifyScope } from './scope.mjs'

/** Fontes que decidem sem depender do plano amostral. */
const FORTES = new Set(['methodology', 'dado_municipio'])

/** Chave estável da casa: CNPJ quando existe, senão o nome normalizado. */
export function chaveDaCasa(reg) {
  const cnpj = String(reg.cnpj ?? '').replace(/\D/g, '')
  if (cnpj) return `cnpj:${cnpj}`
  const nome = String(reg.institute ?? reg.instituto ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim()
  return `nome:${nome}`
}

const escopoDe = (reg) => reg.scope ?? reg.escopo ?? 'unknown'
const fonteDe = (reg) => reg.scopeSource ?? reg.scope_source ?? reg.escopoFonte ?? 'none'
const nomeDe = (reg) => reg.institute ?? reg.instituto ?? '(sem nome)'
const protocoloDe = (reg) => reg.protocolo ?? reg.protocol ?? '(sem protocolo)'

/** O que o PLANO AMOSTRAL, sozinho, diz deste registro. */
export function planoSozinho(reg) {
  return classifyScope(null, reg.samplingPlan ?? reg.planoAmostral ?? null, null).scope
}

/**
 * Mede, por casa, se o plano amostral separa escopo.
 *
 * @returns {Map<string, {casa, chave, baseEstaduais, planoNosEstaduais, veredito}>}
 *   veredito: 'DISCRIMINA' | 'CEGO' | 'SEM_BASE'
 */
export function medirPoderDiscriminante(registros) {
  const porCasa = new Map()

  for (const reg of registros) {
    const chave = chaveDaCasa(reg)
    if (!porCasa.has(chave)) {
      porCasa.set(chave, {
        chave,
        casa: nomeDe(reg),
        baseEstaduais: 0,
        contradicoes: 0,
        planoNosEstaduais: { state: 0, national: 0, unknown: 0 },
        planoDiz: { state: 0, national: 0, unknown: 0 },
      })
    }
    const casa = porCasa.get(chave)
    const diz = planoSozinho(reg)

    // 🔑 SINAL 2, a VARIAÇÃO: o que este campo diz em TODOS os registros da casa.
    // Um plano que diz "nacional" em cada linha que a casa registra é boilerplate,
    // e boilerplate não é informação. Um que às vezes diz "estadual" está sendo
    // preenchido por pesquisa, e aí o "nacional" dele é escolha.
    casa.planoDiz[diz]++

    // 🔑 SINAL 1, a CONTRADIÇÃO, e é o que basta sozinho: o campo chamou de
    // nacional uma pesquisa que a metodologia já disse ser ESTADUAL. Exige fonte
    // FORTE dos dois lados, senão é circular: escopo derivado do plano sempre
    // concorda com o plano.
    if (!FORTES.has(fonteDe(reg)) || escopoDe(reg) !== 'state') continue
    casa.baseEstaduais++
    casa.planoNosEstaduais[diz]++
    if (diz === 'national') casa.contradicoes++
  }

  for (const casa of porCasa.values()) {
    if (casa.contradicoes > 0) casa.veredito = 'CEGO'
    else if (casa.planoDiz.state > 0) casa.veredito = 'DISCRIMINA'
    else casa.veredito = 'SEM_BASE'
  }

  return porCasa
}

/** Está no calendário que o painel publica: em campo agora, ou divulgação à frente. */
export function noCalendarioVivo(reg, hoje) {
  const div = reg.publicationDate ?? reg.divulgacao ?? null
  if (div && div >= hoje) return true
  const ini = reg.fieldStart ?? reg.campoInicio ?? null
  const fim = reg.fieldEnd ?? reg.campoFim ?? null
  return Boolean(ini && fim && ini <= hoje && hoje <= fim)
}

/**
 * O portão. Acha todo registro servido como NACIONAL por derivação do plano
 * amostral cuja casa não dá sustentação a esse campo.
 *
 * @param {object[]} registros
 * @param {{hoje: string}} opcoes  hoje em ISO 'AAAA-MM-DD', injetado para o teste
 * @returns {{ok, poder, achados, graves, vivos}}
 */
export function conferirEscopoDerivado(registros, { hoje } = {}) {
  if (!hoje) throw new Error('conferirEscopoDerivado exige `hoje` em AAAA-MM-DD')
  const poder = medirPoderDiscriminante(registros)
  const achados = []

  for (const reg of registros) {
    if (escopoDe(reg) !== 'national' || fonteDe(reg) !== 'sampling_plan') continue
    const casa = poder.get(chaveDaCasa(reg))
    if (casa.veredito === 'DISCRIMINA') continue

    achados.push({
      protocolo: protocoloDe(reg),
      casa: casa.casa,
      chave: casa.chave,
      gravidade: casa.veredito === 'CEGO' ? 'GRAVE' : 'AVISO',
      veredito: casa.veredito,
      baseEstaduais: casa.baseEstaduais,
      contradicoes: casa.contradicoes,
      planoNosEstaduais: casa.planoNosEstaduais,
      planoDiz: casa.planoDiz,
      amostra: reg.sampleSize ?? reg.amostra ?? null,
      divulgacao: reg.publicationDate ?? reg.divulgacao ?? null,
      vivo: noCalendarioVivo(reg, hoje),
    })
  }

  achados.sort(
    (a, b) =>
      Number(b.vivo) - Number(a.vivo) ||
      (a.gravidade === b.gravidade ? 0 : a.gravidade === 'GRAVE' ? -1 : 1) ||
      String(a.protocolo).localeCompare(String(b.protocolo)),
  )

  const graves = achados.filter((a) => a.gravidade === 'GRAVE')
  const vivos = graves.filter((a) => a.vivo)

  // 🔑 Só reprova o que CHEGA À TELA. Rótulo frágil em registro já vencido é
  // dívida de dataset e vira aviso; o que o painel publica hoje é que trava.
  return { ok: vivos.length === 0, poder, achados, graves, vivos }
}
