/**
 * Bloco FAQ VISÍVEL de /how-it-works.
 *
 * Renderiza exatamente FAQ_DATA (a mesma fonte do faqSchema JSON-LD), garantindo
 * a paridade texto-visível × schema que a política FAQPage do Google exige para
 * o rich result. Server component; usa os estilos compartilhados (theme-aware).
 */
import { FAQ_DATA } from '../../../lib/seo/schema'
import type { Locale } from '../../../lib/i18n/config'
import { S } from './styles'

const FAQ_TITLE: Record<Locale, string> = {
  'pt-BR': 'Perguntas frequentes',
  en: 'Frequently asked questions',
  es: 'Preguntas frecuentes',
}

export function HowItWorksFaq({ loc }: { loc: Locale }) {
  const items = FAQ_DATA[loc] || FAQ_DATA['pt-BR']
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className={S.h2}>
        {FAQ_TITLE[loc] || FAQ_TITLE['pt-BR']}
      </h2>
      <div className="space-y-6">
        {items.map((f, i) => (
          <div key={i}>
            <h3 className={S.h3}>{f.q}</h3>
            <p className={S.p}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
