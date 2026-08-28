/**
 * Cron de LEMBRETE ÚNICO: remedir a captação de e-mail por superfície.
 *
 * O André pediu em 28/Ago/2026 para ser lembrado "na virada de setembro". O
 * motivo do prazo está na ficha `project_medir_captacao_por_superficie_setembro`
 * e resume-se a isto: até 27/Ago o cadastro estava QUEBRADO e até 28/Ago as
 * origens eram INDISTINGUÍVEIS, então nenhum número anterior serve para julgar
 * conversão. Só a partir de 01/Set existe um mês de dado limpo e separado.
 *
 * ⚠️ POR QUE CRON DA VERCEL E NÃO GITHUB ACTIONS: os secrets do GitHub têm
 * apenas DATABASE_URL e HF_TOKEN. Mandar e-mail de lá exigiria copiar a
 * RESEND_API_KEY de produção para um segundo cofre, ou seja, ampliar onde uma
 * credencial vive por causa de um lembrete. A Vercel já tem a chave.
 *
 * ⛔ NÃO É ROTINA PERMANENTE. Dispara uma vez, em 01/Set. Depois disso a rota e
 * a entrada no `vercel.json` devem ser REMOVIDAS: o próprio e-mail diz isso.
 */

import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { requireCronAuth } from '../../../../lib/cron/auth'
import { sendSystemAlert } from '../../../lib/email/resend'
import { EMAIL_FOUNDER } from '../../../lib/contacts'

export const maxDuration = 30

/**
 * Chave de idempotência POR DATA DE DISPARO.
 *
 * 🔴 A primeira versão usava chave FIXA com TTL de 90 dias, e isso teria
 * quebrado o lembrete: um teste feito hoje gravaria a chave, ela viveria até
 * novembro, e o disparo real de 01/Set encontraria "já enviado" e NÃO MANDARIA
 * NADA. A trava contra repetição teria engolido justamente o envio que importa.
 *
 * Com a data no nome, um teste de hoje e o disparo de setembro usam chaves
 * diferentes, e o TTL pode ser curto porque o cron só volta daqui a um ano.
 */
function chaveDoDia(): string {
  return `afos:lembrete:medicao-captacao:${new Date().toISOString().slice(0, 10)}`
}

const CORPO = [
  'Passou um mês de dado LIMPO desde 28/Ago. Agora dá para medir a captação por superfície.',
  '',
  'POR QUE SÓ AGORA: até 27/Ago o cadastro estava quebrado (o último lead real entrou em 30/Jul)',
  'e até 28/Ago as origens eram indistinguíveis, com os dois painéis gravando "popup" e as duas',
  'edições do Tradeoff gravando "tradeoff". Nenhum número anterior serve para julgar conversão.',
  '',
  'AS DUAS PERGUNTAS:',
  '1. O bloco inline converte? daily, tradeoff-br, tradeoff-us e weekly estavam em ZERO.',
  '2. O painel dos EUA converte como o do Brasil? popup-us contra popup-br responde.',
  '',
  'COMO MEDIR: cortar por firstSeenAt >= 2026-08-28. Sem esse corte, os 29 leads velhos',
  'entram na conta e afogam o sinal novo. Base de comparação em 28/Ago: 29 leads, 20 ativos,',
  'sendo popup 13, landing 11, gate 5, e as editoriais em zero.',
  '',
  'A RESSALVA QUE IMPORTA: conversão zero com tráfego zero não diz nada. Buscar as páginas',
  'vistas das edições ANTES de concluir qualquer coisa sobre o bloco inline.',
  '',
  'A receita completa está em memory/project_medir_captacao_por_superficie_setembro.md',
  '',
  '---',
  'ESTE LEMBRETE É DE DISPARO ÚNICO. Depois de lê-lo, remover a rota',
  'app/api/cron/lembrete-medicao-captacao e a entrada correspondente no vercel.json.',
].join('\n')

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request)
  if (unauthorized) return unauthorized

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  // Trava de repetição. Sem Redis o lembrete ainda sai: perder o aviso é pior
  // que mandá-lo duas vezes, e o cron só dispara uma vez ao ano de qualquer forma.
  if (url && token) {
    try {
      const redis = new Redis({ url, token })
      const primeiro = await redis.set(chaveDoDia(), new Date().toISOString(), { nx: true, ex: 60 * 60 * 24 * 7 })
      if (!primeiro) {
        return NextResponse.json({ ok: true, enviado: false, motivo: 'ja_enviado' })
      }
    } catch {
      // Falha da trava não impede o lembrete.
    }
  }

  const ok = await sendSystemAlert(EMAIL_FOUNDER, {
    type: 'lembrete: remedir captação por superfície',
    message: 'Combinado em 28/Ago: medir a captação de e-mail agora que há um mês de dado limpo e separado por origem.',
    details: CORPO,
  })

  return NextResponse.json({ ok, enviado: ok, destino: EMAIL_FOUNDER })
}
