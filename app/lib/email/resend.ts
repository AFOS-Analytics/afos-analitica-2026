/**
 * Resend Service — Preparado para uso futuro
 *
 * Este módulo abstrai o envio de emails via Resend.
 * Atualmente apenas estrutura; os envios serão ativados
 * quando RESEND_API_KEY estiver configurada.
 *
 * Env var necessária: RESEND_API_KEY
 * Obtenha em: https://resend.com
 */

import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export function isResendAvailable(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Enviar email de boas-vindas ao novo subscriber.
 * Só envia se Resend estiver configurado.
 */
export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.log('[resend] API key não configurada — email de boas-vindas não enviado');
    return false;
  }

  try {
    await resend.emails.send({
      from: 'AFOS Analytics <noreply@afos-analytics.com>',
      to,
      subject: 'Bem-vindo ao AFOS Analytics',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F52BA;">AFOS Analytics</h2>
          <p>Obrigado por se cadastrar!</p>
          <p>Você receberá:</p>
          <ul>
            <li>Alertas de mudanças significativas nas odds</li>
            <li>Resumo diário das eleições</li>
            <li>Notificações de eventos críticos</li>
          </ul>
          <p style="color: #666; font-size: 12px;">
            Para cancelar, acesse o link de descadastro no rodapé de qualquer email.
          </p>
        </div>
      `,
    });
    console.log(`[resend] Welcome email enviado para ${to.slice(0, 3)}***`);
    return true;
  } catch (error) {
    console.error('[resend] Erro ao enviar welcome email:', error);
    return false;
  }
}

/**
 * Enviar alerta de eleição (uso futuro).
 */
export async function sendElectionAlert(
  to: string[],
  subject: string,
  htmlContent: string
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    // Resend suporta batch sending
    for (const email of to) {
      await resend.emails.send({
        from: 'AFOS Analytics <alertas@afos-analytics.com>',
        to: email,
        subject,
        html: htmlContent,
      });
    }
    console.log(`[resend] Alerta enviado para ${to.length} subscribers`);
    return true;
  } catch (error) {
    console.error('[resend] Erro ao enviar alerta:', error);
    return false;
  }
}
