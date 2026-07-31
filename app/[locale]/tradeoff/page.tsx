import { redirect } from 'next/navigation'
import { isValidLocale, PAIS_PADRAO, SUPPORTED_LOCALES } from '../../../lib/afos-tradeoff/loader'

/**
 * `/[idioma]/tradeoff` → 307 para `/[idioma]/tradeoff/br`.
 *
 * Mesmo desenho do painel, que em 29/Jul passou a ter país no endereço: a rota
 * curta continua existindo para sempre, porque ela está publicada, citada em
 * e-mail e ligada da landing. Quem chega por ela cai no Brasil, que é o país de
 * origem do produto.
 *
 * ⚠️ Redirect, e não uma segunda página com o mesmo conteúdo. Duas páginas
 * servindo a mesma coisa dividem a autoridade de busca entre si e obrigam a
 * declarar canônico cruzado; o redirect resolve sem nenhuma dessas dívidas.
 */
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export default async function TradeoffIndexRedirect(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const loc = isValidLocale(locale) ? locale : 'pt-BR'
  redirect(`/${loc}/tradeoff/${PAIS_PADRAO}`)
}
