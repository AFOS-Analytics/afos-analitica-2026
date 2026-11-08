'use client'

import { useTranslation } from '../../i18n/context'

/**
 * Aviso de silêncio eleitoral (lei francesa de 1977, art. 11). Quando ele
 * aparece, a tela da França NÃO mostra pesquisa nem preço: quem decide é
 * `lib/fr/silencio-eleitoral.ts`, e este componente só explica ao leitor.
 */

const T = {
  'pt-BR': {
    titulo: 'Silêncio eleitoral',
    texto: (turno: number, ate: string) => `A lei francesa proíbe publicar ou comentar pesquisa no sábado e no domingo do ${turno}º turno. Pesquisas e preços de mercado voltam a esta tela depois das ${ate}.`,
  },
  en: {
    titulo: 'Electoral silence',
    texto: (turno: number, ate: string) => `French law bans publishing or commenting on polls on the Saturday and Sunday of round ${turno}. Polls and market prices return to this screen after ${ate}.`,
  },
  es: {
    titulo: 'Silencio electoral',
    texto: (turno: number, ate: string) => `La ley francesa prohíbe publicar o comentar encuestas el sábado y el domingo de la ${turno}ª vuelta. Encuestas y precios de mercado vuelven a esta pantalla después de las ${ate}.`,
  },
}

export function FrSilencioBanner({ turno, ate }: { turno: 1 | 2; ate: string }) {
  const { locale } = useTranslation()
  const t = T[(locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T]
  const d = new Date(ate)
  const dia = String(d.getUTCDate()).padStart(2, '0')
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0')
  const quando = `${locale === 'en' ? `${mes}/${dia}` : `${dia}/${mes}`} ${String(d.getUTCHours()).padStart(2, '0')}:00 UTC`
  return (
    <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">{t.titulo}</p>
      <p className="mt-1">{t.texto(turno, quando)}</p>
    </div>
  )
}
