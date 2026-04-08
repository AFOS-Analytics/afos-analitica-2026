/**
 * Resend Service
 *
 * Env var: RESEND_API_KEY
 *
 * IMPORTANTE: No free tier do Resend, sem domínio verificado,
 * use from: 'onboarding@resend.dev'. Ao verificar seu domínio
 * no dashboard do Resend, altere para seu domínio real.
 */

import { Resend } from 'resend';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Enviar email de boas-vindas.
 * Retorna true se enviado, false se falhou ou Resend indisponível.
 */
export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn('[resend] API key não configurada — welcome email não enviado');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: 'AFOS Analytics <onboarding@resend.dev>',
      to,
      subject: 'Bem-vindo ao AFOS Analytics',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <h2 style="color: #0F52BA; margin-bottom: 16px;">AFOS Analytics</h2>
          <p style="color: #333; line-height: 1.6;">Obrigado por se cadastrar. Você receberá:</p>
          <ul style="color: #333; line-height: 1.8;">
            <li>Alertas de mudanças significativas nas odds</li>
            <li>Resumo diário das eleições</li>
            <li>Notificações de eventos críticos</li>
          </ul>
          <p style="color: #999; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px;">
            AFOS Analytics — Plataforma Global de Inteligência Eleitoral<br>
            Para cancelar o recebimento, responda este email com "cancelar".
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[resend] Erro ao enviar welcome:', error.message);
      return false;
    }

    console.log(`[resend] Welcome email enviado: ${to.slice(0, 3)}***`);
    return true;
  } catch (error) {
    console.error('[resend] Falha no envio:', error);
    return false;
  }
}
