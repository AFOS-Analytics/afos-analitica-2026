import { sendSystemAlert } from '../../app/lib/email/resend'
import { redigirSegredo } from './redigir'

/**
 * Aviso de falha de cron, por email.
 *
 * 🔴 POR QUE EXISTE, medido em 19/Ago/2026 pelo crítico de cobertura do EVAL:
 * dos SETE crons declarados em `vercel.json`, apenas `persist-analysis` avisava
 * alguém quando falhava. Os outros seis falhavam em silêncio, e entre eles está
 * o `refresh-elections`, que alimenta a série de preços de 30 em 30 minutos.
 *
 * ⚠️ E essa série é a única coisa do banco que **não se reconstrói**: o próprio
 * `backup-neon.yml` registra isso. O `docs/OPERATIONS.md` admitia "cron stale,
 * conferência manual semanal", ou seja, até SETE DIAS de buraco antes de alguém
 * notar, num job que roda a cada meia hora.
 *
 * ⛔ Falha de alerta NUNCA derruba o cron. Gravar o dado importa mais que avisar
 * sobre ele: o `catch` aqui é deliberado, e o mesmo padrão já vale no alerta de
 * pesquisa nacional de `refresh-polls`.
 */
export async function avisarFalhaDeCron(
  rota: string,
  motivo: string,
  detalhe?: unknown
): Promise<void> {
  const destino = process.env.ALERT_EMAIL || 'alerts@afos-analytics.com'
  try {
    await sendSystemAlert(destino, {
      type: `cron-falhou:${rota}`,
      message: `O cron ${rota} não completou: ${motivo}`,
      // Redação antes de sair, porque alerta é email e email circula.
      details: [
        `rota: ${rota}`,
        `motivo: ${motivo}`,
        detalhe ? `detalhe: ${redigirSegredo(detalhe, 500)}` : null,
        `quando: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
  } catch (e) {
    console.error(`[cron/${rota}] o próprio alerta falhou:`, e)
  }
}

/**
 * Aviso de que a FONTE do generic ballot dos EUA congelou.
 *
 * 🔴 POR QUE EXISTE, decidido pelo André em 24/Ago/2026: a Tradeoff EUA №5 saiu
 * do rascunho declarando em quatro lugares que a base estava "parada há vinte
 * dias". Ele cortou, e o argumento decide: nos Estados Unidos sai pesquisa
 * todo dia, então essa frase não descreve o eleitorado, **denuncia a nossa
 * coleta**. O que a casa precisa é SABER, não anunciar.
 *
 * ⛔ Este alerta é o único destino do número, junto do log. Ele NÃO entra em
 * `public/us-polls-data.json`, que é servido publicamente.
 *
 * ⚠️ Dispara em MARCO EXATO (7, 14, 21, 30, 45, 60, 90 dias), nunca por nível:
 * o atraso cresce 1 por dia, e `>=` mandaria email todo dia a partir do
 * primeiro. Alerta diário é alerta que alguém aprende a ignorar.
 *
 * ⛔ Falha de alerta NUNCA derruba o cron, mesma regra do `avisarFalhaDeCron`.
 */
export async function avisarAtrasoDaFonte(
  atrasoDias: number,
  campoMaisRecente: string | null
): Promise<void> {
  const destino = process.env.ALERT_EMAIL || 'alerts@afos-analytics.com'
  try {
    await sendSystemAlert(destino, {
      type: `fonte-congelada:us-generic-ballot (${atrasoDias}d)`,
      message: `A tabela do generic ballot dos EUA nao recebe linha nova ha ${atrasoDias} dias.`,
      details: [
        `campo mais recente na base: ${campoMaisRecente ?? 'nenhum'}`,
        `atraso: ${atrasoDias} dias`,
        '',
        'O QUE ISSO E: a fonte e uma unica tabela da Wikipedia, no artigo',
        '"2026 United States elections". Ela e alimentada por editores de la, e',
        'ja ficou 20 dias sem linha nova enquanto a pagina seguia sendo editada',
        'em outras secoes.',
        '',
        'O QUE ISSO NAO E: nao e parser quebrado, e nao e ausencia de pesquisa',
        'no mundo. Conferir antes de concluir: se a tabela tem linha nova e nao',
        'entrou, ai sim e o parseTabela.',
        '',
        'NAO PUBLICAR este numero em peca nenhuma. A regra esta em',
        'memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md',
        `quando: ${new Date().toISOString()}`,
      ].join('\n'),
    })
  } catch (e) {
    console.error('[cron/refresh-us-polls] o proprio alerta de atraso falhou:', e)
  }
}

/**
 * Uma casa de pesquisa saiu da PRÓPRIA cadência.
 *
 * Diferente de `avisarAtrasoDaFonte`, que olha a ponta da base. Este olha
 * buraco no MEIO: em 28/Ago/2026 a tabela estava com 11 dias de atraso global,
 * o que é comum, e a The Economist/YouGov tinha DUAS ondas publicadas fora do
 * índice, uma delas com campo dentro da janela que a média usa.
 *
 * ⛔ Este número não se publica. É diagnóstico da nossa coleta.
 */
type VerificacaoFora = {
  instituto: string
  veredito: string
  detalhe?: string
  ultimoNaListagem?: string
  url?: string | null
  rodadasFora?: { iso: string; evidencia: string }[]
}

type Exposicao = {
  rodadasFaltando: number
  janelaDias: number
  atual: { vantagemDem: number; nPesquisas: number }
  central: { vantagemDem: number; nPesquisas: number }
  faixa: { min: number; max: number }
  deslocamentoCentralPp: number
  porCasa: { instituto: string; efeitoDeCasaPp: number; datasEsperadasNaJanela: string[] }[]
  semEfeitoMedivel: { instituto: string; motivo: string }[]
} | null

const sinalPp = (v: number) => (v >= 0 ? `D+${v.toFixed(2)}` : `R+${Math.abs(v).toFixed(2)}`)

export async function avisarCasaCalada(
  casas: { instituto: string; cadenciaDias: number; silencioDias: number; ciclosPerdidos: number; ultimoCampo: string }[],
  verificacao: VerificacaoFora[] | null = null,
  exposicao: Exposicao = null,
): Promise<void> {
  if (!casas.length) return
  const destino = process.env.ALERT_EMAIL || 'alerts@afos-analytics.com'

  // 🔎 O bloco do segundo leitor. Ele responde a pergunta que este email
  // ANTES mandava uma pessoa responder na mao, e por isso a instrucao velha
  // saiu: pedir conferencia manual so das casas que alguem reparou troca uma
  // amostra sistematica por uma escolhida.
  // Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
  const blocoVerificacao: string[] = []
  if (verificacao?.length) {
    blocoVerificacao.push('', 'LISTAGEM PROPRIA DE CADA CASA (consultada pelo portao, nao a mao):')
    for (const v of verificacao) {
      blocoVerificacao.push(`  ${v.instituto}: ${v.veredito} - ${v.detalhe ?? ''}`)
      for (const r of v.rodadasFora ?? []) blocoVerificacao.push(`    campo ${r.iso}  "${r.evidencia}"`)
      if (v.url) blocoVerificacao.push(`    ${v.url}`)
    }
    const fora = verificacao.filter((v) => v.veredito === 'RODADA_FORA_DO_INDICE')
    if (fora.length) {
      blocoVerificacao.push(
        '',
        `ATRIBUICAO: ${fora.length} casa(s) PUBLICOU rodada que o indice nao recebeu.`,
        'O buraco e do INDICE, nao das casas. Nao dizer que "a casa esta calada".',
      )
    }
    // ⚠️ Veredito inconclusivo NAO e veredito de "nada novo". Ele aparece
    // nomeado para nao virar um verde que ninguem mediu.
    const incerto = verificacao.filter(
      (v) => v.veredito === 'INDETERMINADO' || v.veredito === 'SEM_LISTAGEM_REGISTRADA',
    )
    if (incerto.length) {
      blocoVerificacao.push('', `NAO CONCLUIDO em ${incerto.length} casa(s): ${incerto.map((v) => v.instituto).join(', ')}.`)
      blocoVerificacao.push('Isto NAO quer dizer que nao ha rodada nova. Quer dizer que nao deu para olhar.')
    }
  } else {
    blocoVerificacao.push('', 'LISTAGEM PROPRIA: nao consultada nesta passada (falha ou desligada).')
  }

  const blocoExposicao: string[] = []
  if (exposicao && exposicao.rodadasFaltando > 0) {
    blocoExposicao.push(
      '',
      `EXPOSICAO DA MEDIA: ${exposicao.rodadasFaltando} rodada(s) faltando na janela de ${exposicao.janelaDias}d.`,
      ...exposicao.porCasa.map(
        (c) =>
          `  ${c.instituto}: efeito de casa ${c.efeitoDeCasaPp >= 0 ? '+' : ''}${c.efeitoDeCasaPp}pp, deve ${c.datasEsperadasNaJanela.join(', ')}`,
      ),
      `  servida ${sinalPp(exposicao.atual.vantagemDem)} (n=${exposicao.atual.nPesquisas}) -> com as que faltam ${sinalPp(exposicao.central.vantagemDem)} (n=${exposicao.central.nPesquisas})`,
      `  faixa ${sinalPp(exposicao.faixa.min)} a ${sinalPp(exposicao.faixa.max)}, deslocamento ${exposicao.deslocamentoCentralPp >= 0 ? '+' : ''}${exposicao.deslocamentoCentralPp}pp`,
      '  SUPOSICAO: cada rodada que falta entra como campo de hoje mais o efeito',
      '  daquela casa. E o TAMANHO DO RISCO, nao uma previsao.',
      ...exposicao.semEfeitoMedivel.map((s) => `  NAO CERCADA: ${s.instituto} (${s.motivo})`),
    )
  }

  try {
    await sendSystemAlert(destino, {
      type: `casa-calada:us-generic-ballot (${casas.map((c) => c.instituto).join(', ')})`,
      message: `${casas.length} casa(s) de pesquisa fora da propria cadencia no generic ballot dos EUA.`,
      details: [
        ...casas.map(
          (c) =>
            `${c.instituto}: publica a cada ~${c.cadenciaDias}d, calada ha ${c.silencioDias}d (${c.ciclosPerdidos} ciclos), ultimo campo ${c.ultimoCampo}`,
        ),
        '',
        'O QUE ISSO E: cada casa e comparada com ELA MESMA. Uma casa semanal',
        'calada ha 18 dias e anomalia; uma casa mensal calada ha 18 dias e',
        'rotina. Por isso o corte e em ciclos dela, nao em dias.',
        ...blocoVerificacao,
        ...blocoExposicao,
        '',
        'O QUE NAO FAZER: digitar a linha a mao. Numero posto a mao nao se',
        'reproduz na leitura seguinte e some no proximo parse, e escolher quais',
        'linhas entram converte a amostra numa escolha.',
        '',
        'NAO PUBLICAR este numero em peca nenhuma. A regra esta em',
        'memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md',
        `quando: ${new Date().toISOString()}`,
      ].join('\n'),
    })
  } catch (e) {
    console.error('[cron/refresh-us-polls] o proprio alerta de casa calada falhou:', e)
  }
}
