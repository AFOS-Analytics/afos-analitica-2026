export const meta = {
  name: 'eval-plataforma',
  description: 'Auditoria EVAL da plataforma AFOS por eixos, com verificacao adversarial, resolucao de INCERTO e critico de cobertura',
  whenToUse: 'Auditoria ampla da plataforma. Rodar com o Andre presente: consome dezenas de agentes.',
  phases: [
    { title: 'Auditoria', detail: 'um auditor por eixo, somente leitura' },
    { title: 'Verificacao', detail: 'um cetico por eixo, tenta REFUTAR cada achado' },
    { title: 'Resolucao', detail: 'segundo passe SO nos INCERTOS, com lente diferente' },
    { title: 'Cobertura', detail: 'critico responde o que os eixos NAO olharam' },
  ],
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE MUDOU DEPOIS DA RODADA DE 19/Ago/2026, e cada item saiu de um defeito
 * MEDIDO naquela execucao, nao de suposicao.
 *
 * 1. EIXO QUE MORRE SOME. O agente do eixo `i18n-formatacao` caiu por erro de
 *    conexao. O `pipeline` devolveu null, o `.filter(Boolean)` o descartou, e o
 *    resumo saiu "eixos: 15" — numero plausivel, que nao denuncia nada. Quando
 *    refiz o eixo a mao, ele trouxe 6 achados, um critico. Um eixo NAO AUDITADO
 *    tinha sido reportado dentro de uma auditoria concluida.
 *    ✅ Agora: retentativa, e o que nao volta entra em `eixos_nao_auditados`, que
 *    aparece no topo do resumo. Nunca mais confundivel com eixo limpo.
 *
 * 2. TETO SILENCIOSO. O prompt pedia "no maximo 6 achados". QUATRO dos quinze
 *    eixos vieram com exatamente 6, ou seja, encostaram no teto, e nada no
 *    retorno dizia se havia um setimo. Corte silencioso le-se como cobertura.
 *    ✅ Agora: teto maior e campo `achados_omitidos` obrigatorio, com motivo.
 *
 * 3. `eixos_limpos` MENTIA POR CONSTRUCAO. Era calculado como "eixo sem
 *    veredicto", e eixo morto tambem tem zero veredicto.
 *    ✅ Agora: so entra quem RODOU e voltou com zero achado.
 *
 * 4. INCERTO FICAVA NO RELATORIO. Seis achados sairam como INCERTO e eu os
 *    deixei abertos. Fui medir depois, um a um: OS SEIS ERAM REAIS. Incerto nao
 *    e meio-termo entre confirmado e refutado, e trabalho nao terminado.
 *    ✅ Agora: terceiro passe so para os INCERTOS, com lente diferente da do
 *    cetico e decisao binaria forcada. O que sobrar vira PENDENTE_HUMANO, em
 *    secao propria, nunca diluido na lista.
 *
 * 5. SEM DEDUP ENTRE EIXOS. Dois eixos acharam o mesmo defeito no mesmo
 *    arquivo e linha, e ele foi verificado duas vezes e reportado duas vezes.
 *    ✅ Agora: dedup por arquivo:linha ANTES de verificar.
 *
 * 6. NINGUEM PERGUNTOU O QUE FICOU DE FORA. Os 16 eixos foram escolhidos por
 *    mim; nada checou se eles cobriam a plataforma.
 *    ✅ Agora: critico de cobertura no fim, que le a lista de eixos e a arvore e
 *    responde o que NENHUM eixo olhou.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TETO_ACHADOS = 12

const ACHADOS = {
  type: 'object',
  properties: {
    dimensao: { type: 'string' },
    cobertura: { type: 'string', description: 'o que foi aberto e conferido, com nomes de arquivo' },
    achados_omitidos: {
      type: 'number',
      description: `quantos achados REAIS voce deixou de fora por causa do teto de ${TETO_ACHADOS}. Zero se coube tudo. NUNCA truncar em silencio.`,
    },
    motivo_da_omissao: { type: 'string', description: 'se achados_omitidos > 0, do que se tratava, em uma linha' },
    achados: {
      type: 'array',
      maxItems: TETO_ACHADOS,
      items: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          arquivo: { type: 'string' },
          linha: { type: 'number' },
          severidade: { type: 'string', enum: ['critico', 'alto', 'medio', 'baixo'] },
          categoria: { type: 'string' },
          descricao: { type: 'string' },
          cenario_de_falha: { type: 'string', description: 'entrada ou estado concreto -> resultado errado concreto' },
          evidencia: { type: 'string', description: 'trecho de codigo ou comando rodado COM a saida' },
          correcao_proposta: { type: 'string' },
          toca_texto_de_frontend: { type: 'boolean' },
        },
        required: ['titulo', 'arquivo', 'linha', 'severidade', 'categoria', 'descricao', 'cenario_de_falha', 'evidencia', 'correcao_proposta', 'toca_texto_de_frontend'],
      },
    },
  },
  required: ['dimensao', 'cobertura', 'achados_omitidos', 'achados'],
}

const VEREDITOS = {
  type: 'object',
  properties: {
    veredictos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          arquivo: { type: 'string' },
          linha: { type: 'number' },
          veredicto: { type: 'string', enum: ['CONFIRMADO', 'REFUTADO', 'INCERTO'] },
          razao: { type: 'string', description: 'o que voce ABRIU para decidir, com evidencia. Nao repetir o auditor' },
          o_que_falta_para_decidir: { type: 'string', description: 'so quando INCERTO: o teste exato que resolveria' },
          severidade_revisada: { type: 'string', enum: ['critico', 'alto', 'medio', 'baixo'] },
          correcao_revisada: { type: 'string' },
        },
        required: ['titulo', 'arquivo', 'linha', 'veredicto', 'razao', 'severidade_revisada', 'correcao_revisada'],
      },
    },
  },
  required: ['veredictos'],
}

const RESOLUCAO = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    veredicto: { type: 'string', enum: ['CONFIRMADO', 'REFUTADO', 'PENDENTE_HUMANO'] },
    razao: { type: 'string' },
    o_que_voce_executou: { type: 'string', description: 'o comando ou leitura que produziu a decisao' },
    severidade_revisada: { type: 'string', enum: ['critico', 'alto', 'medio', 'baixo'] },
    correcao_revisada: { type: 'string' },
  },
  required: ['titulo', 'veredicto', 'razao', 'o_que_voce_executou', 'severidade_revisada', 'correcao_revisada'],
}

const COBERTURA = {
  type: 'object',
  properties: {
    lacunas: {
      type: 'array',
      maxItems: 10,
      items: {
        type: 'object',
        properties: {
          area: { type: 'string' },
          porque_importa: { type: 'string' },
          arquivos_ou_rotas: { type: 'string' },
          eixo_sugerido: { type: 'string' },
        },
        required: ['area', 'porque_importa', 'arquivos_ou_rotas', 'eixo_sugerido'],
      },
    },
    veredicto_geral: { type: 'string' },
  },
  required: ['lacunas', 'veredicto_geral'],
}

const REGRAS = `
CONTEXTO: AFOS Analytics, plataforma Next.js (App Router) que cruza mercados de previsao, pesquisas eleitorais e imprensa, publicada em pt-BR (origem), en e es.
Repositorio: ${typeof args?.repo === 'string' ? args.repo : 'C:/Users/afos3/OneDrive/Documentos/MeusProjetos/AFOS-Analitica-2026'}

REGRAS DURAS
1. SOMENTE LEITURA. Proibido Edit, Write, git add/commit/checkout/stash, rm, mv, npm install, npm run build, npx playwright, npx vercel e qualquer curl que ESCREVA. Ler com cat/sed/grep/find e rodar leitura de codigo e o que voce faz. Curl GET em endpoint publico de leitura e permitido, com moderacao.
   ⚠️ Rodar suite de teste NAO e leitura: ela sobe servidor e escreve artefato. Nao rode.
2. PRESERVAR TODO TEXTO DE FRONTEND. Nenhuma correcao pode reescrever copy visivel. Se o defeito so se resolve mexendo em texto visivel, DECLARE e nao proponha.
3. NAO propor forjar user-agent de navegador para furar 403 de terceiro.
4. Achado precisa de ARQUIVO, LINHA e CENARIO DE FALHA concreto. "Poderia ser melhor" nao e achado.
5. ⛔ NUNCA TRUNCAR EM SILENCIO. O teto e ${TETO_ACHADOS}. Se voce encontrou mais, preencha \`achados_omitidos\` com o numero e \`motivo_da_omissao\` com uma linha. Corte nao declarado le-se como cobertura.

O QUE E PROPOSITAL E NAO E BUG
- app/components/CandidatesSection.tsx tem prosa em portugues no codigo: LEGADO CONGELADO por decisao de 25/Jul/2026.
- public/us-polls-data.json e us-press-data.json nao tem variante por idioma: sao dado medido.
- O grafo do painel dos EUA nao mostra delta em pp entre mercado e pesquisa: grandezas diferentes.
- popularVoteMargin esta REPROVADO no portao de 95-105% e e coletado assim mesmo, para guardar serie.
- Peca publicada com data ENCERRADA e registro historico: corrige-se por errata.
- O fallback para pt-BR quando o gate numerico reprova e decisao de projeto.
- O AFOS Tradeoff usa PONTO decimal nos TRES idiomas, por decisao de 02/Ago/2026.
`

// ─── Fase 1 e 2 ──────────────────────────────────────────────────────────────
phase('Auditoria')

const EIXOS = Array.isArray(args?.eixos) && args.eixos.length ? args.eixos : []
if (!EIXOS.length) {
  log('ERRO: passe os eixos em args.eixos, cada um { key, prompt }.')
  return { erro: 'sem eixos' }
}
log(`EVAL endurecido: ${EIXOS.length} eixos, teto de ${TETO_ACHADOS} achados por eixo`)

/** Auditor com retentativa. Eixo que morre NAO some: vira estado explicito. */
async function auditar(eixo) {
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    const r = await agent(`${REGRAS}\n\n=====================\n${eixo.prompt}`, {
      label: tentativa === 1 ? `audita:${eixo.key}` : `audita:${eixo.key}:retry`,
      phase: 'Auditoria',
      schema: ACHADOS,
    })
    if (r) return { ok: true, dados: r }
    log(`${eixo.key}: agente nao retornou (tentativa ${tentativa})`)
  }
  return { ok: false, dados: null }
}

const auditados = await pipeline(
  EIXOS,
  (eixo) => auditar(eixo).then((r) => ({ eixo, ...r })),
  (r) => {
    if (!r?.ok) return { dimensao: r?.eixo?.key ?? '?', estado: 'NAO_AUDITADO', achados: [], veredictos: [] }
    const a = r.dados
    if (!a.achados?.length) {
      return { dimensao: a.dimensao, estado: 'LIMPO', cobertura: a.cobertura, omitidos: a.achados_omitidos ?? 0, achados: [], veredictos: [] }
    }
    const lista = a.achados
      .map((f, i) => `ACHADO ${i + 1}\ntitulo: ${f.titulo}\narquivo: ${f.arquivo}:${f.linha}\nseveridade alegada: ${f.severidade}\ndescricao: ${f.descricao}\ncenario alegado: ${f.cenario_de_falha}\nevidencia alegada: ${f.evidencia}\ncorrecao proposta: ${f.correcao_proposta}`)
      .join('\n\n---\n\n')
    return agent(
      `${REGRAS}\n\n=====================\nVOCE E O CETICO DO EIXO "${a.dimensao}". Sua tarefa e TENTAR DERRUBAR CADA ACHADO, nao confirma-los.\n\nPara cada um, nesta ordem:\n1. O codigo existe naquele arquivo e naquela LINHA? Auditor erra caminho.\n2. O caminho de falha e ALCANCAVEL? Guarda, early return, validacao de tipo ou portao antes dele derrubam o achado.\n3. E PROPOSITAL? Releia a lista do que e proposital.\n4. O cenario e reproduzivel, ou e "poderia acontecer"? Sem entrada concreta, REFUTE.\n5. A correcao mexe em texto visivel? Se mexer, reescreva-a para agir em metadado, tipo, rota ou logica.\n\n⚠️ INCERTO E O ULTIMO RECURSO, e custa caro: na rodada de 19/Ago os SEIS achados que sairam como incerto foram medidos depois e OS SEIS ERAM REAIS. Se voce marcar INCERTO, preencha \`o_que_falta_para_decidir\` com o TESTE EXATO que resolveria, porque outro agente vai executa-lo.\n\nNa duvida entre CONFIRMADO e REFUTADO, refute. Na duvida sobre se voce consegue decidir, execute mais um comando antes de dizer incerto.\n\n=====================\n${lista}`,
      { label: `cetico:${a.dimensao}`, phase: 'Verificacao', schema: VEREDITOS, effort: 'high' }
    ).then((v) => ({
      dimensao: a.dimensao,
      estado: 'AUDITADO',
      cobertura: a.cobertura,
      omitidos: a.achados_omitidos ?? 0,
      motivo_omissao: a.motivo_da_omissao,
      achados: a.achados,
      veredictos: v?.veredictos ?? [],
    }))
  }
)

const eixos = auditados.filter(Boolean)

// ─── Consolidacao, com DEDUP por arquivo:linha ───────────────────────────────
const chaveDe = (x) => `${String(x.arquivo || '').replace(/\\/g, '/').split('/').slice(-3).join('/')}:${x.linha}`
const confirmados = []
const incertos = []
const refutados = []
const vistos = new Map()

for (const e of eixos) {
  for (const v of e.veredictos ?? []) {
    const orig = (e.achados ?? []).find((a) => a.titulo === v.titulo) ?? {}
    const item = { dimensao: e.dimensao, ...orig, ...v }
    const k = chaveDe(item)
    if (vistos.has(k)) {
      vistos.get(k).tambem_achado_por = [...(vistos.get(k).tambem_achado_por ?? []), e.dimensao]
      continue
    }
    vistos.set(k, item)
    if (v.veredicto === 'CONFIRMADO') confirmados.push(item)
    else if (v.veredicto === 'INCERTO') incertos.push(item)
    else refutados.push(item)
  }
}

// ─── Fase 3: os INCERTOS TEM que sair do limbo ───────────────────────────────
let resolvidos = []
if (incertos.length) {
  phase('Resolucao')
  log(`${incertos.length} incerto(s): segundo passe, com lente diferente e decisao binaria`)
  resolvidos = await parallel(
    incertos.map((f) => () =>
      agent(
        `${REGRAS}\n\n=====================\nVOCE RESOLVE UM ACHADO QUE FICOU INCERTO. O cetico nao conseguiu decidir. Voce tem que decidir.\n\n🔑 LENTE DIFERENTE DA DELE: ele julgou se o defeito EXISTE. Voce julga se ele PRODUZ EFEITO. Construa a entrada concreta, rode o comando, leia o dado real, compare com o que a tela ou a API entrega hoje. Nao argumente: EXECUTE.\n\n📌 O peso da historia: em 19/Ago/2026 seis achados sairam como incerto e, medidos um a um depois, OS SEIS ERAM REAIS. Incerto nao e meio-termo, e trabalho nao terminado.\n\nDecida CONFIRMADO ou REFUTADO. Use PENDENTE_HUMANO SO quando a decisao depender de escolha do Andre (produto, custo, politica), nunca por falta de esforco seu.\n\nACHADO\ntitulo: ${f.titulo}\narquivo: ${f.arquivo}:${f.linha}\ndescricao: ${f.descricao}\ncenario alegado: ${f.cenario_de_falha}\nevidencia do auditor: ${f.evidencia}\nrazao do cetico para nao decidir: ${f.razao}\nteste que ele disse faltar: ${f.o_que_falta_para_decidir ?? '(nao declarou)'}`,
        { label: `resolve:${String(f.titulo).slice(0, 40)}`, phase: 'Resolucao', schema: RESOLUCAO, effort: 'high' }
      ).then((r) => (r ? { ...f, ...r } : { ...f, veredicto: 'PENDENTE_HUMANO', razao: 'agente de resolucao nao retornou' }))
    )
  )
  for (const r of resolvidos.filter(Boolean)) {
    if (r.veredicto === 'CONFIRMADO') confirmados.push(r)
    else if (r.veredicto === 'REFUTADO') refutados.push(r)
  }
}
const pendentes = resolvidos.filter(Boolean).filter((r) => r.veredicto === 'PENDENTE_HUMANO')

// ─── Fase 4: o que NINGUEM olhou ─────────────────────────────────────────────
phase('Cobertura')
const critico = await agent(
  `${REGRAS}\n\n=====================\nVOCE E O CRITICO DE COBERTURA. Nao procure defeito: procure AUSENCIA.\n\nEstes foram os eixos auditados, com o que cada um declarou ter aberto:\n\n${eixos.map((e) => `- ${e.dimensao} [${e.estado}]: ${String(e.cobertura ?? '(sem relato)').slice(0, 400)}`).join('\n')}\n\nEIXOS QUE NAO FORAM AUDITADOS: ${eixos.filter((e) => e.estado === 'NAO_AUDITADO').map((e) => e.dimensao).join(', ') || 'nenhum'}\n\nSua tarefa: varra a arvore do repositorio e responda o que NENHUM desses eixos olhou. Pense em superficies inteiras, nao em arquivos soltos: fluxo de email e broadcast, acessibilidade, desempenho e tamanho de bundle, dados pessoais e retencao, rotas de admin, migracoes de banco, scripts operacionais, documentacao que mente sobre o codigo, dependencia sem uso ou desatualizada, tratamento de fuso, e o que mais a arvore mostrar.\n\nPara cada lacuna: a area, POR QUE ela importa neste projeto especificamente, os arquivos ou rotas envolvidos, e o eixo que a cobriria numa proxima rodada. No maximo 10, as que mais importam.`,
  { label: 'critico:cobertura', phase: 'Cobertura', schema: COBERTURA, effort: 'high' }
)

// ─── Resultado ───────────────────────────────────────────────────────────────
const ordem = { critico: 0, alto: 1, medio: 2, baixo: 3 }
confirmados.sort((a, b) => (ordem[a.severidade_revisada] ?? 9) - (ordem[b.severidade_revisada] ?? 9))

const naoAuditados = eixos.filter((e) => e.estado === 'NAO_AUDITADO').map((e) => e.dimensao)
const comOmissao = eixos.filter((e) => (e.omitidos ?? 0) > 0).map((e) => ({ eixo: e.dimensao, omitidos: e.omitidos, motivo: e.motivo_omissao }))

log(`Fim: ${confirmados.length} confirmados, ${pendentes.length} pendentes, ${refutados.length} refutados. Nao auditados: ${naoAuditados.length}. Com omissao declarada: ${comOmissao.length}.`)

return {
  // 🔴 Estes dois campos vem PRIMEIRO de proposito: eles dizem em que medida o
  // resto merece confianca. Eixo nao auditado e achado omitido sao buraco de
  // COBERTURA, e buraco de cobertura nao aparece na contagem de achados.
  eixos_nao_auditados: naoAuditados,
  eixos_com_achados_omitidos: comOmissao,
  resumo: {
    eixos_pedidos: EIXOS.length,
    eixos_auditados: eixos.filter((e) => e.estado !== 'NAO_AUDITADO').length,
    eixos_limpos: eixos.filter((e) => e.estado === 'LIMPO').map((e) => e.dimensao),
    confirmados: confirmados.length,
    pendentes_de_decisao_humana: pendentes.length,
    refutados: refutados.length,
    duplicatas_fundidas: [...vistos.values()].filter((v) => v.tambem_achado_por).length,
  },
  confirmados,
  pendentes,
  refutados: refutados.map((r) => ({ dimensao: r.dimensao, titulo: r.titulo, razao: r.razao })),
  lacunas_de_cobertura: critico?.lacunas ?? [],
  veredicto_de_cobertura: critico?.veredicto_geral ?? '(critico nao retornou)',
  cobertura_por_eixo: eixos.map((e) => ({ dimensao: e.dimensao, estado: e.estado, cobertura: e.cobertura })),
}
