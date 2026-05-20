import { LandingPageDual } from '../components/LandingPageDual';

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = (params.locale === 'en' || params.locale === 'es') ? params.locale : 'pt-BR';
  return <LandingPageDual locale={locale} />;
}
