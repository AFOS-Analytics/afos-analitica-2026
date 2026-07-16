/**
 * Classificador de ESCOPO de pesquisa eleitoral (nacional × estadual) — FONTE ÚNICA.
 *
 * Usado por: lib/tse/ingest.ts (app/ingest do cron), scripts/backfill-poll-scope.ts
 * (Neon) e scripts/build-tse-registry-full.mjs (dataset HF/Zaid DB-free). JS puro,
 * sem dependências, para ser importável tanto por TS (via scope.d.ts) quanto por .mjs.
 *
 * POR QUE INFERIR DE TEXTO: o TSE NÃO classifica a abrangência da AMOSTRA. Ele arquiva
 * pela jurisdição do cargo — toda pesquisa que pergunta sobre Presidente entra sob
 * SG_UF="BR"/SG_UE="BR" no arquivo BRASIL.csv, mesmo que tenha entrevistado um só estado.
 * (Confirmado: as 365 linhas presidenciais têm SG_UF=BR.) A abrangência real só existe
 * no texto declarado pelo instituto (metodologia / plano amostral / dado-município).
 *
 * REGRA (decisão de projeto):
 *   - NACIONAL  → universo declarado abrange mais de uma UF / o país
 *                 ("eleitorado brasileiro", "residente no Brasil", "todas as regiões do
 *                  Brasil", "N unidades da federação", "todo o país", "âmbito nacional").
 *   - ESTADUAL  → universo restrito a UMA UF (inclui municipal: uma cidade ⊂ 1 UF).
 *   - UNKNOWN   → sem texto de universo suficiente. NÃO se inventa escopo.
 *
 * Ordem das fontes: metodologia > plano amostral > dado-município (a metodologia é onde
 * o universo é declarado). Dentro de cada fonte testa-se ESTADUAL antes de NACIONAL
 * (mais específico — planos nacionais citam "municípios"/"Brasil" em boilerplate).
 * scope_source registra QUAL fonte decidiu, para auditoria/reprodutibilidade acadêmica.
 */

// `brasilia` entra aqui de propósito: municipal ⊂ estadual pela nossa regra, e sem ele
// "eleitorado de BRASÍLIA" cai no padrão nacional `eleitorado de brasil` (prefixo comum).
const STATE_NAMES =
  'acre|alagoas|amapa|amazonas|bahia|brasilia|ceara|distrito federal|espirito santo|goias|maranhao|' +
  'mato grosso do sul|mato grosso|minas gerais|paraiba|parana|pernambuco|piaui|' +
  'rio de janeiro|rio grande do norte|rio grande do sul|rondonia|roraima|santa catarina|' +
  'sao paulo|sergipe|tocantins|para'

// Siglas de UF (universo estadual abreviado: "eleitorado do RN", "de PB").
const UF_ABBREV =
  'ac|al|ap|am|ba|ce|df|es|go|ma|mt|ms|mg|pa|pb|pr|pe|pi|rj|rn|rs|ro|rr|sc|sp|se|to'

// Universo é UMA UF / município (sub-nacional). Mais específico → testado primeiro.
// d[eoa] cobre de/do/da ("eleitorado da Paraíba"). Municipal específico para NÃO colidir
// com o sorteio nacional de "municípios" no plural (ex.: Quaest).
// `eleitor(es|ado)`: institutos declaram o universo nas duas formas — "eleitorado de MG"
// e "eleitores de Minas Gerais". Só `eleitorado` deixava Gazeta/DF e Data Tempo/MG em
// unknown. A forma adjetiva nacional ("eleitores brasileiros") não colide: `brasil` não
// está em STATE_NAMES, e `brasilia` exige a palavra inteira.
const STATE_UNIVERSE = new RegExp(
  `(estado d[eoa] (${STATE_NAMES}))|(eleitor(es|ado) d[eoa] (${STATE_NAMES}))|` +
  `(eleitorado d[eoa] (${UF_ABBREV})\\b)|` +
  `(residentes? no estado)|(no estado d[eoa] )|(eleitorado do estado)|(regioes do estado)|` +
  `(municipio[^.]{0,40}do estado)|` +
  `(domicilio eleitoral na cidade)|(n[ao] cidade de )|(o municipio de )|(regioes da cidade)`,
)

// Universo é o Brasil inteiro / mais de uma UF.
// `brasil` exige fronteira: sem ela, "eleitorado de BRASÍLIA" casa com `eleitorado de
// brasil` (prefixo) e uma pesquisa municipal do DF vira nacional. Mas a fronteira tem
// de aceitar a forma adjetiva ("eleitores brasileiros"), senão a Indexa, que declara
// "Universo: Eleitores brasileiros", deixa de ser reconhecida como nacional.
// BR = fronteira que casa "brasil", "brasileiro(s)" e "brasileira(s)", mas NÃO "brasilia".
const BR = 'brasil(eir[oa]s?)?\\b'
const NATIONAL_UNIVERSE = new RegExp(
  `(eleitorado brasileiro)|(eleitorado d[eoa] ${BR})|(populacao brasileira)|` +
  `(eleitor(es|as)? brasileir[oa]s?\\b)|(eleitores e eleitoras do ${BR})|` +
  `(votante[^.]{0,30}residente[^.]{0,6}no ${BR})|(residente[^.]{0,6}no ${BR})|` +
  `(todas as regioes do ${BR})|(unidades da federacao)|(todo o pais\\b)|(ambito nacional)|` +
  `(pais do ${BR})|(abrangencia[^.]{0,20}nacional)|` +
  `(territorio (nacional|brasileiro))|(em todo o ${BR})|(universo[^.]{0,20}${BR})|(do brasil\\b com 16)`,
)

const stripAccents = (s) =>
  (s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** Escopo declarado num único campo de texto: 'state' | 'national' | null. */
function scopeOfText(text) {
  const t = stripAccents(text)
  if (!t) return null
  if (STATE_UNIVERSE.test(t)) return 'state'
  if (NATIONAL_UNIVERSE.test(t)) return 'national'
  return null
}

/**
 * Classifica o escopo a partir das 3 fontes de texto do registro TSE.
 * @returns {{ scope: 'national'|'state'|'unknown', source: 'methodology'|'sampling_plan'|'dado_municipio'|'none' }}
 */
export function classifyScope(methodology, samplingPlan, dadoMunicipio) {
  const fields = [
    ['methodology', methodology],
    ['sampling_plan', samplingPlan],
    ['dado_municipio', dadoMunicipio],
  ]
  for (const [source, text] of fields) {
    const s = scopeOfText(text)
    if (s) return { scope: s, source }
  }
  return { scope: 'unknown', source: 'none' }
}

/** Conveniência: só o escopo, descartando a fonte. */
export function detectScope(methodology, samplingPlan, dadoMunicipio) {
  return classifyScope(methodology, samplingPlan, dadoMunicipio).scope
}
