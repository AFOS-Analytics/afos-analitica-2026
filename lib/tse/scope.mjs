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

const STATE_NAMES =
  'acre|alagoas|amapa|amazonas|bahia|ceara|distrito federal|espirito santo|goias|maranhao|' +
  'mato grosso do sul|mato grosso|minas gerais|paraiba|parana|pernambuco|piaui|' +
  'rio de janeiro|rio grande do norte|rio grande do sul|rondonia|roraima|santa catarina|' +
  'sao paulo|sergipe|tocantins|para'

// Siglas de UF (universo estadual abreviado: "eleitorado do RN", "de PB").
const UF_ABBREV =
  'ac|al|ap|am|ba|ce|df|es|go|ma|mt|ms|mg|pa|pb|pr|pe|pi|rj|rn|rs|ro|rr|sc|sp|se|to'

// Universo é UMA UF / município (sub-nacional). Mais específico → testado primeiro.
// d[eoa] cobre de/do/da ("eleitorado da Paraíba"). Municipal específico para NÃO colidir
// com o sorteio nacional de "municípios" no plural (ex.: Quaest).
const STATE_UNIVERSE = new RegExp(
  `(estado d[eoa] (${STATE_NAMES}))|(eleitorado d[eoa] (${STATE_NAMES}))|` +
  `(eleitorado d[eoa] (${UF_ABBREV})\\b)|` +
  `(residentes? no estado)|(no estado d[eoa] )|(eleitorado do estado)|(regioes do estado)|` +
  `(municipio[^.]{0,40}do estado)|` +
  `(domicilio eleitoral na cidade)|(n[ao] cidade de )|(no municipio de )|(regioes da cidade)`,
)

// Universo é o Brasil inteiro / mais de uma UF.
const NATIONAL_UNIVERSE =
  /(eleitorado brasileiro)|(eleitorado d[eoa] brasil)|(populacao brasileira)|(eleitores e eleitoras do brasil)|(votante[^.]{0,30}residente[^.]{0,6}no brasil)|(residente[^.]{0,6}no brasil)|(todas as regioes do brasil)|(unidades da federacao)|(todo o pais)|(ambito nacional)|(territorio (nacional|brasileiro))|(em todo o brasil)|(universo[^.]{0,20}brasil)|(do brasil com 16)/

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
