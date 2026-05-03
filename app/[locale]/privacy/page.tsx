import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '../../../lib/afos-daily/loader'
import { StaticPageHeader } from '../../components/StaticPageHeader'
import { Footer } from '../../components/Footer'
import { buildMetadata } from '../../../lib/seo/metadata'
import type { Locale } from '../../../lib/i18n/config'

interface Props { params: { locale: string } }

const CONTENT = {
  'pt-BR': {
    title: 'Política de Privacidade | AFOS Analytics',
    description: 'Como AFOS Analytics coleta, usa e protege dados pessoais conforme LGPD.',
    h1: 'Política de Privacidade',
    updated: 'Última atualização: 1 de maio de 2026',
    sections: [
      ['Coleta de dados', 'AFOS Analytics coleta apenas o estritamente necessário para operar o serviço: (a) endereço de email, quando você opta por receber alertas; (b) cookie de identificação anônimo (afos_visitor_id) para diferenciar sessões; (c) preferências de idioma e estado da interface; (d) logs de acesso (IP, user-agent) retidos por 24 horas para mitigação de abuso.'],
      ['Uso dos dados', 'Endereços de email são usados exclusivamente para enviar alertas que você consentiu em receber. Identificadores anônimos são usados para personalizar a experiência (linguagem, modais já vistos). Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros para marketing.'],
      ['Direitos do titular (LGPD)', 'Você pode, a qualquer momento, solicitar acesso, retificação, anonimização ou exclusão dos seus dados. Para isso, envie email para contact@afos-analytics.com com a solicitação. Respondemos em até 15 dias.'],
      ['Cookies', 'Usamos apenas cookies essenciais: identificador anônimo de sessão e preferência de idioma. Não usamos cookies de tracking de terceiros, fingerprinting, ou analytics invasivos. Vercel Analytics usado é cookieless.'],
      ['Retenção', 'Emails de subscritores: enquanto a subscrição estiver ativa. Logs de acesso: 24 horas. Identificadores anônimos: 12 meses ou até remoção do cookie pelo usuário.'],
      ['Segurança', 'Conexões via HTTPS obrigatório. Dados em repouso criptografados (Neon Postgres TLS, Upstash Redis TLS). Senha de admin via secrets em variáveis de ambiente, nunca em código.'],
    ],
  },
  en: {
    title: 'Privacy Policy | AFOS Analytics',
    description: 'How AFOS Analytics collects, uses and protects personal data in compliance with LGPD.',
    h1: 'Privacy Policy',
    updated: 'Last updated: May 1, 2026',
    sections: [
      ['Data collection', 'AFOS Analytics collects only what is strictly necessary to operate the service: (a) email address, when you opt in to receive alerts; (b) anonymous identification cookie (afos_visitor_id) to distinguish sessions; (c) language preferences and interface state; (d) access logs (IP, user-agent) retained for 24 hours for abuse mitigation.'],
      ['Data use', 'Email addresses are used exclusively to send alerts you have consented to receive. Anonymous identifiers personalize the experience (language, modal seen state). We do not sell, rent or share personal data with third parties for marketing.'],
      ['Data subject rights (LGPD)', 'You may at any time request access, rectification, anonymization or deletion of your data by emailing contact@afos-analytics.com. We respond within 15 days.'],
      ['Cookies', 'We use only essential cookies: anonymous session identifier and language preference. No third-party tracking cookies, fingerprinting, or invasive analytics. Vercel Analytics used is cookieless.'],
      ['Retention', 'Subscriber emails: while subscription is active. Access logs: 24 hours. Anonymous identifiers: 12 months or until cookie is removed by user.'],
      ['Security', 'Mandatory HTTPS connections. Data at rest encrypted (Neon Postgres TLS, Upstash Redis TLS). Admin secrets via environment variables, never in code.'],
    ],
  },
  es: {
    title: 'Política de Privacidad | AFOS Analytics',
    description: 'Cómo AFOS Analytics recolecta, usa y protege datos personales conforme a LGPD.',
    h1: 'Política de Privacidad',
    updated: 'Última actualización: 1 de mayo de 2026',
    sections: [
      ['Recolección de datos', 'AFOS Analytics recolecta solo lo estrictamente necesario para operar el servicio: (a) dirección de email, cuando optas por recibir alertas; (b) cookie de identificación anónima (afos_visitor_id) para diferenciar sesiones; (c) preferencias de idioma y estado de interfaz; (d) logs de acceso (IP, user-agent) retenidos por 24 horas para mitigación de abuso.'],
      ['Uso de datos', 'Las direcciones de email se usan exclusivamente para enviar alertas a las que has consentido. Los identificadores anónimos personalizan la experiencia (idioma, modales ya vistos). No vendemos, alquilamos ni compartimos datos personales con terceros para marketing.'],
      ['Derechos del titular (LGPD)', 'Puedes solicitar en cualquier momento acceso, rectificación, anonimización o eliminación de tus datos enviando email a contact@afos-analytics.com. Respondemos en hasta 15 días.'],
      ['Cookies', 'Usamos solo cookies esenciales: identificador anónimo de sesión y preferencia de idioma. No usamos cookies de tracking de terceros, fingerprinting ni analíticas invasivas. Vercel Analytics usado es cookieless.'],
      ['Retención', 'Emails de suscriptores: mientras la suscripción esté activa. Logs de acceso: 24 horas. Identificadores anónimos: 12 meses o hasta eliminación del cookie por el usuario.'],
      ['Seguridad', 'Conexiones HTTPS obligatorias. Datos en reposo encriptados (Neon Postgres TLS, Upstash Redis TLS). Secretos admin vía variables de entorno, nunca en código.'],
    ],
  },
} as const

export function generateMetadata({ params }: Props): Metadata {
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return buildMetadata({ title: c.title, description: c.description, path: 'privacy' }, params.locale as Locale)
}

export default function PrivacyPage({ params }: Props) {
  if (!isValidLocale(params.locale)) notFound()
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <StaticPageHeader />
      <main id="main-content" className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-2">{c.h1}</h1>
        <p className="text-xs text-gray-500 mb-10">{c.updated}</p>
        <div className="space-y-8">
          {c.sections.map(([heading, body]) => (
            <section key={heading} className="bg-white border border-light-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">{heading}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
