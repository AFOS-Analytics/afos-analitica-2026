import { LandingPageDual } from '../components/LandingPageDual';
import { locales } from '../../lib/i18n/config';

// A página inicial sai pronta do build nos três idiomas. Sem esta lista ela
// seguia dinâmica (no-store) mesmo depois que o layout raiz parou de ler
// cabeçalho (12/Nov/2026), porque nada dizia ao Next quais idiomas existem.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = (params.locale === 'en' || params.locale === 'es') ? params.locale : 'pt-BR';
  // Landing usa só o rodapé próprio do LandingPageDual (limpo: AFOS Analytics + sociais
  // + pílula Harvard). O Footer compartilhado (colunas Nav/Open Source/Legal) fica nas
  // demais páginas (dashboard etc.), não na home, para não poluir a landing.
  return <LandingPageDual locale={locale} />;
}
