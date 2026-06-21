import { LandingPageDual } from '../components/LandingPageDual';

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = (params.locale === 'en' || params.locale === 'es') ? params.locale : 'pt-BR';
  // Landing usa só o rodapé próprio do LandingPageDual (limpo: AFOS Analytics + sociais
  // + pílula Harvard). O Footer compartilhado (colunas Nav/Open Source/Legal) fica nas
  // demais páginas (dashboard etc.), não na home, para não poluir a landing.
  return <LandingPageDual locale={locale} />;
}
