/**
 * Alerta de PESQUISA NACIONAL NOVA — email quando o cron do TSE insere uma.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 13/Ago/2026.
 *
 * O aviso vivia numa rotina na nuvem que SAÍA para a internet buscar
 * `www.afos-analytics.com/api/polls/tse`, ou seja, ia lá fora pedir um dado que
 * este mesmo sistema acabara de gravar. O sandbox de rotina tem lista de
 * egresso e esse host não está nela: a rotina falhava com 403 no CONNECT todos
 * os dias desde pelo menos 05/Ago, sem nunca ler uma pesquisa, e terminava com
 * `result: success` reportando que não conseguiu. Nove dias de alarme falso.
 *
 * Aqui o aviso nasce DENTRO da ingestão, que é quem insere a linha. Não sai
 * para a rede, não depende de lista de liberação nem de máquina ligada, e
 * roda 3x por dia junto do cron em vez de 1x.
 *
 * Ficha: memory/project_rotinas_nuvem_auditoria_13ago.md
 *
 * ⚠️ FALHA DO ALERTA NUNCA DERRUBA A INGESTÃO. Gravar a pesquisa importa mais
 * que avisar sobre ela, então tudo aqui é best-effort e o chamador engole o
 * erro. Mesma postura do [health-alerts].
 */

import { Redis } from '@upstash/redis'
import { sendSystemAlert } from '../email/resend'
import { EMAIL_ALERTS } from '../contacts'
import type { InsertedPoll } from '../../../lib/tse/persist'

/**
 * Janela do dedup por protocolo. Longa de propósito: protocolo do TSE é
 * imutável, então uma pesquisa avisada nunca deve ser avisada de novo.
 */
const DEDUP_SECONDS = 45 * 24 * 60 * 60 // 45 dias

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? new Redis({ url, token }) : null
}

/**
 * Avisa por email as pesquisas de escopo NACIONAL recém-inseridas.
 *
 * @param insertedPolls o que `persistPolls` acabou de gravar, com escopo já
 *   classificado na origem. NÃO reclassificar aqui.
 * @param to destinatário. Padrão é a caixa de alertas, que é o que a ingestão
 *   usa. ⚠️ EXISTE PARA O TESTE: em 13/Ago/2026 verifiquei o caminho positivo
 *   mandando para a caixa real, e sujei o `alerts@` com um alerta falso que
 *   depois não havia como apagar (o correio é Zoho, e o projeto só tem chave de
 *   ENVIO). Teste que escreve na caixa de produção é teste que suja. Ver
 *   `scripts/testa-alerta-pesquisa.ts`.
 * @returns quantas geraram aviso. Zero é resultado normal e frequente.
 */
export async function alertNewNationalPolls(
  insertedPolls: InsertedPoll[],
  to: string = EMAIL_ALERTS,
): Promise<number> {
  // ⛔ Só NACIONAL. Estadual e escopo indefinido ficam de fora: o painel é de
  // eleição nacional, e uma estadual entrando aqui vira ruído diário.
  const nacionais = insertedPolls.filter((p) => p.scope === 'national')
  if (nacionais.length === 0) return 0

  // Dedup por protocolo. A ingestão já é idempotente (filtra protocolos
  // existentes antes de inserir), então isto cobre só a corrida de dois runs
  // simultâneos, por exemplo o cron das 6/12/18 e um disparo manual em cima.
  // ⚠️ Sem Redis, segue em frente: email repetido é falha menos grave que
  // aviso perdido, e este alerta existe justamente porque o anterior calava.
  const redis = getRedis()
  let novas = nacionais
  if (redis) {
    const marcadas = await Promise.all(
      nacionais.map(async (p) => {
        const primeira = await redis.set(`afos:poll-alert:${p.protocolo}`, '1', {
          nx: true,
          ex: DEDUP_SECONDS,
        })
        return primeira === 'OK' ? p : null
      }),
    )
    novas = marcadas.filter((p): p is InsertedPoll => p !== null)
  }
  if (novas.length === 0) return 0

  // Sem interpretação e sem juízo: instituto, protocolo, campo, amostra e
  // divulgação, que é o que o registro do TSE declara. O cruzamento com
  // mercado é decisão editorial e não entra num alerta automático.
  const linhas = novas
    .map(
      (p) =>
        `• ${p.instituto} | protocolo ${p.protocolo} | campo ${p.campoInicio} a ${p.campoFim} | amostra ${p.amostra} entrevistas | divulgação ${p.divulgacao}`,
    )
    .join('\n')

  await sendSystemAlert(to, {
    type: `pesquisa nacional nova (${novas.length})`,
    message: `${novas.length} pesquisa(s) presidencial(is) de escopo NACIONAL entraram no banco nesta rodada da ingestão do TSE.`,
    details:
      `${linhas}\n\n` +
      `Escopo classificado por classifyScope() a partir de metodologia, plano amostral e dado-município. ` +
      `Pesquisas estaduais e de escopo indefinido NÃO entram neste aviso. ` +
      `O registro no TSE é obrigatório e anterior à divulgação, então "pesquisa registrada" não é o mesmo que "pesquisa publicada".`,
  })

  return novas.length
}
