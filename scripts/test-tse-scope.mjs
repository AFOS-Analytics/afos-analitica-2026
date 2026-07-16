/**
 * Teste do classificador de ESCOPO (lib/tse/scope.mjs), ancorado nos defeitos REAIS
 * observados na base do TSE. O arquivo se declara FONTE ÚNICA e alimenta três
 * consumidores (cron de ingestão, backfill do Neon, build do dataset HF/Zaid), então
 * uma regressão aqui apaga pesquisa do dashboard e do dataset publicado em silêncio.
 *
 * O QUE ESTE TESTE PROTEGE, em ordem de gravidade:
 *   1. NACIONAL nunca pode virar `state`. Estadual é testado ANTES de nacional (regra
 *      de projeto), então qualquer padrão estadual novo e amplo demais sequestra as
 *      nacionais. Foi o risco medido no fix de 16/Jul: 0 colisões em 505 registros.
 *   2. `unknown` é resposta LEGÍTIMA, não falha. A regra (scope.mjs:19) é "não se
 *      inventa escopo". Um teste que exigisse escopo de texto vago empurraria o
 *      classificador a chutar.
 *   3. Os casos que já quebraram na vida real não voltam.
 *
 * Uso: npx tsx scripts/test-tse-scope.mjs
 */
import { classifyScope, detectScope } from '../lib/tse/scope.mjs'

let ok = 0, fail = 0
const t = (nome, cond, detalhe = '') => {
  if (cond) { ok++; console.log(`  OK    ${nome}`) }
  else { fail++; console.log(`  FALHA ${nome}${detalhe ? '\n          ' + detalhe : ''}`) }
}
/** Espera um escopo a partir de um texto de METODOLOGIA. */
const esc = (nome, texto, esperado) => {
  const got = detectScope(texto, '', '')
  t(`${nome} -> ${esperado}`, got === esperado, `obteve "${got}" para: ${JSON.stringify(texto.slice(0, 90))}`)
}

console.log('=== 1. DEFEITO REAL 16/Jul: "eleitores de X" não era reconhecido ===')
// O padrão só cobria `eleitorado d[eoa] <estado>`. Quem declarou "eleitores" no plural
// caía em unknown e sumia do dashboard. Instituto Gazeta (DF) e Data Tempo (MG), texto
// literal do registro TSE.
esc('Gazeta/DF, texto literal', 'junto a uma amostra representativa dos eleitores Do Distrito Federal', 'state')
esc('Data Tempo/MG, texto literal', 'O universo da pesquisa é composto por eleitores de Minas Gerais, com idade a partir de 16 anos.', 'state')
esc('forma antiga segue valendo', 'Amostra representativa do eleitorado do Maranhão', 'state')
esc('sigla de UF segue valendo', 'eleitorado do RN com 16 anos ou mais', 'state')

console.log('\n=== 2. NACIONAIS NÃO PODEM VIRAR ESTADUAL (o risco de maior custo) ===')
// Estadual é testado antes de nacional. Se um padrão estadual for amplo demais, ele
// engole as nacionais e elas somem do dashboard. Este bloco é a rede.
esc('eleitorado brasileiro', 'Universo: eleitorado brasileiro com 16 anos ou mais', 'national')
esc('forma adjetiva (Indexa)', 'Universo: Eleitores brasileiros', 'national')
esc('âmbito nacional', 'pesquisa de âmbito nacional', 'national')
esc('unidades da federação', 'entrevistas em 27 unidades da federação', 'national')
esc('todas as regiões do Brasil', 'amostra distribuída por todas as regiões do Brasil', 'national')
esc('território nacional', 'residentes em todo o território nacional', 'national')

console.log('\n=== 3. COLISÃO brasil × brasilia (documentada em scope.mjs:51) ===')
// `brasilia` está em STATE_NAMES de propósito (municipal ⊂ estadual). Sem fronteira,
// "eleitorado de BRASÍLIA" casaria o padrão nacional `eleitorado de brasil` por prefixo,
// e uma pesquisa do DF viraria nacional. As duas direções têm de ficar de pé.
esc('Brasília é estadual, não nacional', 'eleitorado de Brasília', 'state')
esc('"eleitores de Brasilia" idem', 'eleitores de Brasilia', 'state')
esc('Brasil NÃO é engolido por brasilia', 'eleitores do Brasil com 16 anos ou mais', 'national')
// Os três acima NÃO exercitam a fronteira `\b` do BR: `brasilia` está em STATE_NAMES e
// estadual é testado antes, então o padrão nacional nem chega a ser consultado. Para
// exercitar a fronteira é preciso um texto que cite Brasília e NÃO case padrão estadual
// nenhum ("moradores", não "eleitores"). Sem o `\b`, `universo[^.]{0,20}brasil` casa o
// PREFIXO de "brasilia" e uma pesquisa do DF vira NACIONAL. Este caso foi encontrado por
// mutação em 16/Jul: sem ele, remover a fronteira passava com 26/26 verdes.
esc('fronteira \\b do BR: DF não vira nacional por prefixo', 'universo: moradores de Brasília', 'unknown')

console.log('\n=== 4. `unknown` é resposta CORRETA, não falha ===')
// scope.mjs:19 — "sem texto de universo suficiente. NÃO se inventa escopo."
esc('texto vazio', '', 'unknown')
esc('boilerplate sem universo', 'Pesquisa quantitativa com questionário estruturado e questões fechadas.', 'unknown')
// Caso real: ALFA (BR034962026). "área em estudo" é vago de verdade — não nomeia UF.
esc('Alfa/real: "área em estudo"', 'Representativo do eleitorado da área em estudo, elaborada em dois estágios.', 'unknown')

console.log('\n=== 5. MOJIBAKE não é consertável por regex (Econometrica/MA, real) ===')
// O CSV do TSE é latin-1 (incidente 12/Jul). Lido como UTF-8, o acento vira U+FFFD.
// stripAccents normaliza acento, não lixo. O conserto é scripts/repair-tse-encoding-scope.ts,
// que rebusca da fonte; NÃO é padrão novo aqui. Este teste FIXA esse limite: se alguém
// tentar "resolver" mojibake no regex, o correto é que este caso continue unknown.
esc('texto corrompido fica unknown', 'Amostra representativa do eleitorado do Maranh�o', 'unknown')
esc('mesmo texto SÃO cai em state', 'Amostra representativa do eleitorado do Maranhão', 'state')

console.log('\n=== 6. scope_source registra QUEM decidiu (auditoria/reprodutibilidade) ===')
{
  const a = classifyScope('eleitores do Distrito Federal', '', '')
  t('decide pela methodology', a.scope === 'state' && a.source === 'methodology', JSON.stringify(a))
  const b = classifyScope('', 'O universo é composto por eleitores de Minas Gerais', '')
  t('cai para sampling_plan', b.scope === 'state' && b.source === 'sampling_plan', JSON.stringify(b))
  const c = classifyScope('', '', 'domicílio eleitoral na cidade de Paes Landim')
  t('cai para dado_municipio', c.scope === 'state' && c.source === 'dado_municipio', JSON.stringify(c))
  const d = classifyScope('', '', '')
  t('sem fonte -> source "none"', d.scope === 'unknown' && d.source === 'none', JSON.stringify(d))
}

console.log('\n=== 7. ORDEM das FONTES: metodologia decide antes do plano amostral ===')
// scope.mjs:21 — a metodologia é onde o universo é declarado. Planos nacionais citam
// "municípios" em boilerplate, então a ordem das fontes não é detalhe.
{
  const r = classifyScope('Universo: eleitorado brasileiro', 'sorteio dos municípios do estado', '')
  t('methodology (national) vence sampling_plan (state)', r.scope === 'national' && r.source === 'methodology', JSON.stringify(r))
}

console.log('\n=== 7b. ORDEM dos PADRÕES: estadual é testado antes de nacional ===')
// scope.mjs:22 — DENTRO de um mesmo texto, estadual vence. É o que impede o boilerplate
// nacional de um plano estadual ("...conforme resolução do TSE, âmbito nacional") de
// promover a pesquisa a nacional. Exige um texto onde os DOIS padrões casem: sem isso a
// ordem nunca é exercitada e o teste passa mesmo com a ordem invertida (furo real,
// encontrado por mutação em 16/Jul — a versão anterior deste arquivo não pegava isso).
{
  const ambos = 'no estado de São Paulo, com metodologia de âmbito nacional'
  t('texto casa os DOIS padrões (pré-condição do teste)',
    /state|national/.test(detectScope(ambos, '', '')) && detectScope('no estado de São Paulo', '', '') === 'state'
    && detectScope('metodologia de âmbito nacional', '', '') === 'national',
    'se esta pré-condição quebrar, o teste abaixo vira vácuo')
  t('estadual vence nacional no mesmo texto', detectScope(ambos, '', '') === 'state',
    `obteve "${detectScope(ambos, '', '')}" — se virou national, a ordem em scopeOfText foi invertida`)
}

console.log('\n=== 8. LIMITE CONHECIDO (documenta o comportamento, não o aprova) ===')
// Boilerplate nacional que LISTA estados casa o padrão estadual e vira `state`.
// Medido em 16/Jul: 14 registros casam o padrão estadual novo, 0 colidem com marcador
// nacional, e 0 das 83 nacionais casam. A frase abaixo é sintética: não existe na base.
// A exposição é anterior ao fix (já valia para `estado de <X>`), porque estadual é
// testado antes de nacional. Se este teste começar a FALHAR, alguém tornou o padrão
// nacional prioritário — leia a regra em scope.mjs:14 antes de "consertar" o teste.
{
  const r = detectScope('amostra nacional com eleitores de São Paulo, Rio de Janeiro e Minas Gerais', '', '')
  t('boilerplate nacional listando estados vira "state" (limite aceito)', r === 'state',
    `obteve "${r}" — se virou national, a ordem estadual-antes-de-nacional mudou`)
}

console.log(`\n${ok} OK, ${fail} FALHA`)
process.exit(fail ? 1 : 0)
