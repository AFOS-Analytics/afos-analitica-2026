/**
 * tse-fantasmas.mjs — QUAIS protocolos saíram do registro do TSE, não quantos.
 *
 * 🔴 POR QUE ISTO EXISTE. Em 11/Set/2026 a rodada mediu 1 retirada nova, com as
 * duas contas independentes concordando, e mesmo assim o PROTOCOLO dela teve de
 * ser deduzido: o `historico-arquivo.jsonl` guarda o NÚMERO de fantasmas e
 * nunca o conjunto. A dedução funcionou, "foi ingerida em 10/Set e hoje não
 * está no arquivo, logo saiu hoje", mas ela é raciocínio sobre a lista de
 * ontem, e a lista de ontem não existia em disco.
 *
 * 🔑 É a mesma família do defeito de 04/Set: regra que depende de um número que
 * ninguém grava é regra que não roda. Aqui a regra depende de um CONJUNTO, e
 * conjunto que ninguém grava obriga a inferir de cabeça exatamente na hora de
 * publicar um nome próprio.
 * → memory/feedback_regra_que_depende_de_numero_que_ninguem_grava.md
 * → memory/feedback_afirmacao_de_contagem_sobre_a_propria_base.md
 *
 * ⭐ E o conjunto responde uma pergunta que a contagem NÃO responde. Fantasmas
 * de 80 para 81 é compatível com "uma saiu", e também com "duas saíram e uma
 * VOLTOU". A subtração dá 1 nos dois casos; só o conjunto separa os dois.
 *
 * ⚠️ NÃO faz IO. O chamador lê e escreve o arquivo, como em tse-historico.mjs,
 * para que o teste exercite a conta com casos plantados, sem banco e sem disco.
 * → memory/feedback_o_conferidor_que_eu_escrevo_tambem_e_um_medidor.md
 */

import { dataCivilBrasil } from './data-civil-brz.mjs'

export const CAMINHO_FANTASMAS = 'data/tse/fantasmas.jsonl'

/** Lê o JSONL em registros. Linha quebrada ABORTA, nunca vira lista vazia. */
export function lerFantasmas(texto) {
  if (!texto) return []
  const linhas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  return linhas.map((l, i) => {
    try {
      return JSON.parse(l)
    } catch {
      throw new Error(`${CAMINHO_FANTASMAS}: linha ${i + 1} não é JSON. Não adivinhar, conferir à mão.`)
    }
  })
}

export function serializarFantasmas(registro) {
  return JSON.stringify(registro) + '\n'
}

/** O último registro, ou null. Ordena por `quando` para não depender da ordem do arquivo. */
export function ultimoFantasmas(historico) {
  if (!historico.length) return null
  return [...historico].sort((a, b) => String(a.quando).localeCompare(String(b.quando))).pop()
}

/**
 * Compara dois conjuntos de fantasmas e devolve os DOIS movimentos, separados.
 *
 * `sairam`   protocolo que NÃO era fantasma e virou: retirada nova do registro.
 * `voltaram` protocolo que era fantasma e deixou de ser: o TSE repôs a linha.
 *
 * 🔑 Os dois se cancelam na contagem e não se cancelam no mundo. `null` em
 * `anterior` devolve `primeira: true`, nunca listas vazias: conjunto vazio
 * calculado sobre base ausente é o medidor mudo.
 */
export function compararFantasmas(anterior, atual) {
  const atuais = [...new Set(atual ?? [])].sort()
  if (!anterior || !Array.isArray(anterior.protocolos)) {
    return { primeira: true, atuais, sairam: null, voltaram: null }
  }
  const antes = new Set(anterior.protocolos)
  const agora = new Set(atuais)
  return {
    primeira: false,
    atuais,
    sairam: atuais.filter((p) => !antes.has(p)),
    voltaram: [...antes].filter((p) => !agora.has(p)).sort(),
  }
}

/**
 * Um protocolo é uma CHAVE, não uma identidade.
 *
 * 🔴 Medido em 13/Set/2026, na rodada em que 2 protocolos saíram do registro.
 * O conjunto entregou `BR043752026` e `BR065952026`, que é exatamente o que ele
 * foi construído para entregar em 11/Set, e mesmo assim a pergunta que decide
 * publicação ficou sem resposta: uma retirada NACIONAL com divulgação ainda à
 * frente é compromisso que a casa pode ter publicado, e uma estadual já vencida
 * não é nada. Para saber qual das duas era, foi preciso rodar um SEGUNDO script
 * e grepar a saída dele.
 *
 * 🔑 A régua: o conjunto acabou com a dedução do PROTOCOLO e deixou de pé a
 * dedução do QUE ELE É. Nome próprio sem escopo e sem data não responde se a
 * retirada importa.
 *
 * ⚠️ `identidades` é opcional de propósito: sem ele o formato é o de antes, byte
 * a byte, para o teste de conjuntos seguir exercitando a conta pura sem banco.
 */
function descrever(p, identidades) {
  const id = identidades?.[p]
  if (!id) return `      ${p}`
  const escopo = id.nacional ? 'NACIONAL' : 'estadual'
  const casa = (id.instituto || '?').slice(0, 34)
  return `      ${p}  ${escopo.padEnd(8)}  div ${id.divulgacao ?? '?'}  ${casa}`
}

/** Linhas prontas para a tela. Separada da conta de propósito. */
export function formatarFantasmas(anterior, r, identidades, { hoje, arquivo } = {}) {
  const L = []
  if (r.primeira) {
    L.push(`\n👻 Conjunto de fantasmas iniciado em ${CAMINHO_FANTASMAS}, com ${r.atuais.length}.`)
    L.push('   A partir da próxima rodada a retirada sai por NOME, sem dedução.')
    return L
  }
  L.push(`\n👻 FANTASMAS por protocolo, contra ${anterior.quando}:`)
  L.push(`   ${anterior.protocolos.length} → ${r.atuais.length}`)
  if (r.sairam.length === 0 && r.voltaram.length === 0) {
    L.push('   ✅ conjunto IDÊNTICO: nenhuma retirada nova e nenhuma reposição.')
    return L
  }
  if (r.sairam.length) {
    L.push(`   ➖ ${r.sairam.length} SAIU(RAM) do registro do TSE desde então:`)
    for (const p of r.sairam) L.push(descrever(p, identidades))
  }
  if (r.voltaram.length) {
    L.push(`   🔁 ${r.voltaram.length} VOLTOU(RAM) ao registro do TSE:`)
    for (const p of r.voltaram) L.push(descrever(p, identidades))
  }
  if (r.sairam.length && r.voltaram.length) {
    L.push('   ⚠️ Houve saída E volta na mesma janela: a CONTAGEM de fantasmas esconde')
    L.push('      os dois movimentos, porque eles se cancelam. Só o conjunto os separa.')
  }
  L.push(...vereditoEditorial(r, identidades, hoje ?? dataCivilBrasil(), arquivo))
  return L
}

/** Texto comparável: sem acento, sem caixa, espaço único. */
function normalizarTexto(s) {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** n, custo e metodologia. É DESCRIÇÃO, nunca prova de que dois registros são a mesma pesquisa. */
export function mesmaAssinatura(a, b) {
  return (
    Number(a.amostra) === Number(b.amostra) &&
    Number(a.valorPesquisa) === Number(b.valorPesquisa) &&
    normalizarTexto(a.metodologia) === normalizarTexto(b.metodologia)
  )
}

/**
 * O que a MESMA casa ainda tem de nacional com divulgação à frente, no arquivo de AGORA.
 *
 * 🔴 POR QUE ISTO EXISTE. Medido em 16/Set/2026: saiu do registro a
 * `BR-01431/2026`, American Analytics, nacional com divulgação marcada para o
 * PRÓPRIO dia, e que estava no calendário de cinco dailies publicadas. O
 * veredito acendeu, como devia, e a pergunta seguinte teve de ser respondida à
 * mão com um script descartável: a casa sumiu do calendário, ou tem outra data?
 * Tinha: `BR-02587/2026`, registrada em 15/Set, divulgação em 21/Set, com o
 * mesmo n, o mesmo custo, o mesmo estatístico e a mesma metodologia.
 *
 * ⛔ E o atalho NÃO diz "re-registro". Medido no mesmo arquivo: das 577
 * assinaturas (cnpj, n, custo, metodologia, escopo), 138 se repetem, a maior em
 * 36 registros, e Nexus e AtlasIntel têm 9 cada, porque casa de onda regular
 * repete tudo isso toda semana. A própria `BR-02587` tem a assinatura idêntica
 * à `BR-09521/2026` de JUNHO. Assinatura igual é fato descritivo com taxa-base
 * alta, então ela sai como fato, com a contagem da casa ao lado, e o motivo da
 * retirada fica sem nome, porque o registro não o traz.
 *
 * ⛔ Sem CNPJ na identidade devolve `null`, nunca lista vazia: "a casa não tem
 * nada à frente" calculado sem saber qual é a casa é o medidor mudo.
 *
 * @param {{cnpj?: string, amostra?: number, valorPesquisa?: number, metodologia?: string}} retirada
 * @param {Array<{protocolo: string, cnpj: string, nacional: boolean, divulgacao: string}>} arquivo
 * @param {string} hoje  data civil do Brasil, AAAA-MM-DD
 */
export function aFrenteDaCasa(retirada, arquivo, hoje) {
  if (!retirada?.cnpj || !Array.isArray(arquivo)) return null
  const daCasa = arquivo.filter((p) => p.cnpj === retirada.cnpj)
  const aFrente = daCasa
    .filter((p) => p.nacional && p.divulgacao && p.divulgacao >= hoje)
    .sort((a, b) => String(a.divulgacao).localeCompare(String(b.divulgacao)))
    .map((p) => ({ ...p, assinaturaIgual: mesmaAssinatura(retirada, p) }))
  const comAssinatura = daCasa.filter((p) => mesmaAssinatura(retirada, p)).length
  return { aFrente, comAssinatura, registrosDaCasa: daCasa.length }
}

/**
 * A única pergunta da retirada que muda o que a casa faz hoje: alguma delas era
 * NACIONAL com divulgação ainda à frente?
 *
 * ⛔ Fica CALADO quando não há identidade, em vez de dizer "nenhuma nacional".
 * Zero calculado sobre base ausente é o medidor mudo, e aqui ele mandaria
 * publicar sossegado justamente no caso em que ninguém olhou.
 *
 * 🕐 `hoje` é a data civil do BRASIL. Até 16/Set/2026 o padrão era a data UTC,
 * que o conserto de 15/Set tirou dos outros três leitores e não tirou daqui. Das
 * 21h BRT em diante ela já é amanhã, e a retirada daquele dia, nacional com
 * divulgação HOJE, sairia como "nada a corrigir no calendário".
 * → scripts/lib/data-civil-brz.mjs
 *
 * `arquivo` é opcional: sem ele o formato é o de antes, byte a byte.
 */
export function vereditoEditorial(r, identidades, hoje = dataCivilBrasil(), arquivo) {
  if (!r || r.primeira || !r.sairam?.length) return []
  if (!identidades) {
    return ['   ⚠️ Sem identidade dos protocolos: não dá para dizer se a retirada era nacional.']
  }
  const semFicha = r.sairam.filter((p) => !identidades[p])
  const vivas = r.sairam.filter((p) => {
    const id = identidades[p]
    return id && id.nacional && id.divulgacao && id.divulgacao >= hoje
  })
  const L = []
  if (vivas.length) {
    L.push(`   🔴 ${vivas.length} das retiradas era(m) NACIONAL com divulgação à frente de ${hoje}:`)
    for (const p of vivas) {
      L.push(`      ${p}  div ${identidades[p].divulgacao}  ${identidades[p].instituto ?? '?'}`)
      if (arquivo) L.push(...formatarAFrente(aFrenteDaCasa(identidades[p], arquivo, hoje)))
    }
    L.push('      Compromisso que a casa pode ter publicado. Conferir o calendário no ar ANTES de somar.')
  } else {
    L.push('   ✅ nenhuma retirada era nacional com divulgação à frente: nada a corrigir no calendário.')
  }
  if (semFicha.length) {
    L.push(`   ⚠️ ${semFicha.length} protocolo(s) sem ficha no banco, fora deste veredito: ${semFicha.join(', ')}`)
  }
  return L
}

function formatarAFrente(af) {
  if (!af) return ['         ⚠️ sem CNPJ na ficha: não dá para dizer o que a casa tem à frente no registro.']
  if (!af.aFrente.length) return ['         ↳ a casa NÃO tem outra nacional com divulgação à frente no registro atual.']
  const L = [`         ↳ a casa tem ${af.aFrente.length} nacional(is) com divulgação à frente no registro atual:`]
  for (const p of af.aFrente) {
    const reg = p.registroDate ? `  reg ${p.registroDate}` : ''
    const campo = p.campoInicio ? `  campo ${p.campoInicio} a ${p.campoFim ?? '?'}` : ''
    const sig = p.assinaturaIgual ? '  mesma assinatura (n, custo, metodologia)' : ''
    L.push(`            ${p.protocolo}${reg}${campo}  div ${p.divulgacao}${sig}`)
  }
  if (af.aFrente.some((p) => p.assinaturaIgual)) {
    L.push(
      `         ⚠️ assinatura igual NÃO prova re-registro: ela aparece em ${af.comAssinatura} de ${af.registrosDaCasa} registro(s) desta casa no arquivo, e o registro não diz o motivo da retirada.`,
    )
  }
  return L
}
