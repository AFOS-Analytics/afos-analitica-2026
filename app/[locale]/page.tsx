import { LandingPageDual } from '../components/LandingPageDual';

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = (params.locale === 'en' || params.locale === 'es') ? params.locale : 'pt-BR';
  return <LandingPageDual locale={locale} />;
}
