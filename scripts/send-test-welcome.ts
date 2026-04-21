import { config } from 'dotenv'
config({ path: '.env.local' })

import { welcomeTemplate } from '../app/lib/email/templates'
import { Resend } from 'resend'

const TO = '***redacted-email***'

async function main() {
  const key = process.env.RESEND_API_KEY
  if (!key) { console.error('❌ RESEND_API_KEY não configurada'); process.exit(1) }

  const resend = new Resend(key)
  console.log(`📨 Enviando welcome test para ${TO}...\n`)

  const { data, error } = await resend.emails.send({
    from: 'AFOS Analytics <alerts@afos-analytics.com>',
    replyTo: 'contact@afos-analytics.com',
    to: TO,
    subject: 'Bem-vindo ao AFOS Analytics (teste de verificação)',
    html: welcomeTemplate(),
  })

  if (error) {
    console.error('❌ Erro Resend:', JSON.stringify(error, null, 2))
    process.exit(1)
  }

  console.log(`✅ Email enviado`)
  console.log(`   ID: ${data?.id}`)
  console.log(`\nAguarde 1-2 minutos e verifique:`)
  console.log(`   1. Caixa de entrada em ${TO}`)
  console.log(`   2. Pasta SPAM (primeira vez pode cair lá)`)
  console.log(`   3. Remetente: alerts@afos-analytics.com`)
}

main().catch((e) => { console.error(e); process.exit(1) })
